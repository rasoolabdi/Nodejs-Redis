import crypto from "crypto";
import { config } from "dotenv";
config();

class Crypto {
    #secretKey = '';

    constructor() {
        this.#secretKey = process.env.SECRET_KEY;
    };

    hash(str) {
        try {
            return crypto.createHmac('sha256',this.#secretKey).update(str.toString()).digest("hex");
        }
        catch(error) {
            return '';
        }
    };

    toBase64(str) {
        try {
            return Buffer.from(str.toString()).toString("base64url");
        }
        catch(error) {
            return  error;
        }
    };

    fromBase64(str) {
        try {
            return Buffer.from(str.toString() , "base64url").toString("utf8");
        }
        catch(error) {
            return error;
        }
    };

};

export default new Crypto();