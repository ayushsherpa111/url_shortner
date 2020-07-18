import { Schema, model } from "mongoose";
import { generate } from "shortid";
const URL_SCHEMA = new Schema({
    url: {
        required: true,
        type: String,
        lowercase: true,
        trim: true
    },
    visit: {
        required: true,
        default: 0,
        type: Number
    },
    shorten: {
        required: true,
        type: String,
        default: generate
    }
});

URL_SCHEMA.index({ name: "shorten", type: 1 });
URL_SCHEMA.on("index", err => {
    if (err) console.log(err);
    else console.log("💯Index on URL created");
});

const URL_MODEL = model("URL", URL_SCHEMA);
export default URL_MODEL;
