/* Request, Response */

import { default as express } from "express";
import morgan from "morgan"; // logging library
import helmet from "helmet"; // library for settings secure http response headers
// import routes
import index from "./routes/index";
import { join } from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
console.log("🚀Starting server");
// create app instance
const app = express();

app.use(
    helmet({
        hidePoweredBy: true,
        dnsPrefetchControl: true,
        xssFilter: true
    })
);

// database connection
mongoose.connect(
    process.env.MONGO_LOCAL || "",
    {
        useCreateIndex: true,
        useNewUrlParser: true,
        authSource: "admin",
        family: 4,
        useUnifiedTopology: true,
        user: "ayush",
        pass: "sherpa"
    },
    err => {
        if (err) {
            console.log(err);
            throw new Error("connection failed");
        }
        console.log("connected to database");
    }
);
app.set("port", process.env.PORT || 8080);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(":method :url :status - :response-time ms"));
app.set("views", join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static(join(__dirname, "../public")));

// routes middleware
app.use("/", index);

// error handling
// @ts-ignore no-unused-vars
/* app.use(function(err: any, _: Request, res: Response, next: any) { */
/*     console.log("logging"); */
/*     console.log(err); */
/*     res.redirect(`/?err=${err.message}`); */
/* }); */
export default app;
