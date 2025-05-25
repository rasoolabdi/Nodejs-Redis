import { RedisStore } from "connect-redis";
import expressSession from "express-session";
import { Redis } from "../core/redis.js";
import { config } from "dotenv";
import BaseMiddleware from "../core/BaseMiddleware.js";
config();

class SessionMiddleware extends BaseMiddleware {
    constructor() {
        super()
    };
    async handle(req , res , next) {
        try {
            expressSession({
                store: new RedisStore({client: Redis.redis}),
                secret: process.env.SESSION_SECRET,
                name: process.env.SESSION_NAME,
                resave: false,
                saveUninitialized: true,
                cookie: {
                    httpOnly: true,
                    secure: false,
                    maxAge: 1000 * 60 * process.env.SESSION_EXPIRE,
                    sameSite: process.env.SESSION_SAMESITE
                }
            })(req , res , next);
        }
        catch(error) {
            return super.toError(error , req , res);
        }
    }

};
export default SessionMiddleware;
