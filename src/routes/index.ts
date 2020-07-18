import { Router, Request, Response, NextFunction } from "express";
import createError from "http-errors";
import url from "../models/url";
import { body, validationResult } from "express-validator";
const router = Router();

router.get("/", async (req, res) => {
    let models: any[] = [];
    console.log(req.query.err);
    try {
        models = await url.find({}, { _id: 0, __v: 0 });
        console.log(models);
    } catch (e) {
        console.log(e);
    }
    res.render("index", { models, error: req.query.err });
});

router.post(
    "/",
    [
        body("url").trim(),
        body("url").notEmpty(),
        body("url").custom(value => {
            return new Promise((res, rej) => {
                url.findOne({ url: value }, (err, doc) => {
                    if (err || doc) {
                        rej("URL already shortened");
                    } else {
                        res();
                    }
                });
            });
        })
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const error = validationResult(req);
        console.log(error.array());
        if (!error.isEmpty()) {
            return res.redirect(`/?err=${error.array()[0].msg}`);
        }
        console.log(req.body);
        const newURL = new url({
            url: req.body.url
        });
        console.log(newURL);
        try {
            const doc = await newURL.save();
            console.log(doc);
            res.redirect("/");
        } catch (e) {
            console.log("error occured");
            return next(createError(401, e));
        }
    }
);

router.get(
    "/:route",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const found = await url.findOne({ shorten: req.params.route });
            if (!found) {
                const err_msg = createError(404, {
                    message: "Requested URL not found"
                });
                return next(err_msg);
            }
            (found as any).visit += 1;
            await found.save();
            console.log(found);
            return res.redirect(found.get("url"));
        } catch (er) {
            return next(createError(er.message));
        }
    }
);

export default router;
