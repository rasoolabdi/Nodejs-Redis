import BaseMiddleware from "../core/BaseMiddleware.js";


class AuthMiddleware extends BaseMiddleware {
    constructor() {
        super();
    };

    async needAuth(req,res,next) {
        try {
            if(req?.session?.admin_id) {
                req.app.locals.admin_info = req.session.admin_info;
                next();
            }
            else {
                return res.redirect(`${process.env.APP_URL}login?msg=no-access`)
            }
        }
        catch(error) {
            return super.toError(error , req , res);
        }
    };

    async isAuth(req,res,next) {
        try {
            if(req?.session?.admin_id) {
                return res.redirect(`${process.env.APP_URL}`)
            }
            else {
                return next();
            }
        }
        catch(error) {
            return super.toError(error , req , res);
        }
    }
};

export default AuthMiddleware;