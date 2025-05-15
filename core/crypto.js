import crypto from "crypto";


class Crypto {
    #secretKey = '';

    constructor() {
        this.#secretKey = process.env.SECRET_KEY;
    };

    hash(str) {
        try {
            return crypto.createHmac("sha256" , this.#secretKey).update(str.toString()).digest("hex");
        }
        catch(error) {
            return error;
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

    fromjBase64(str) {
        try {
            return Buffer.from(str.toString() , "base64url").toString("utf-8");
        }
        catch(error) {
            return error;
        }
    };

    encryption(key , data) {
        try {
            const hashKey = this.hash(key);
            const key2 = hashKey.substring(0 , 32);
            const iv = hashKey.slice(32 , -16);
            const data2 = {
                "a" : Math.random(),
                "message": data,
                "z": Math.random()
            };
            const dataFinal = JSON.stringify(data2);
            const cipher = crypto.createCipheriv("aes-256-cbc" , Buffer.from(key2) , iv);
            let encrypted = cipher.update(dataFinal , "utf8" , "base64");
            encrypted += cipher.final("base64");
            return this.toBase64(encrypted);
        }
        catch(error) {
            return  '';
        }
    }

    decryption(key , data) {
        try {   
            const hashKey = this.hash(key);
            const key2 = hashKey.substring(0 , 32);
            const iv = hashKey.slice(32 , -16);
            data = this.fromjBase64(data);
            const decipher = crypto.createDecipheriv("aes-256-cbc" , Buffer.from(key2) , iv);
            let decrypted = decipher.update(data , 'base64' , 'utf8');
            decrypted += decipher.final("utf8");
            const decryptedFinal = JSON.parse(decrypted);
            return decryptedFinal?.message ?? '';
        }
        catch(error) {
            return '';
        }
    }

};

export default new Crypto();