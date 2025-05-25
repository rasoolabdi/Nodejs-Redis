import autoBind from "auto-bind";
import { config } from "dotenv";
config();

class BaseMiddleware {
    constructor() {
        autoBind(this);
        if(this.constructor === BaseMiddleware) {
            throw new Error("BaseMiddelware is abstract");
        };
    };
    
    toError(req , res , next) {
        const debug = process.env.DEBUG;
        try {
            if(debug) {
                return res.status(500).render("500" , {"error": error.toString()});
            }
            else {
                return res.status(500).render("500" , {"error": "Internal server error"})
            }
        }
        catch(error) {
            if(debug) {
                return res.status(500).render("500" , {"error": error.toString()})
            }
            else {
                return res.status(500).render("500" , {"error": "Internal server error"})
            }
        }
    }
    
};

export default BaseMiddleware;