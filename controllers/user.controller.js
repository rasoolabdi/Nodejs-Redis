import BaseController from "./base.controller.js";


class UserController extends BaseController {
    constructor() {
        super();
    };

    async home(req , res , next) {
        try {
            return res.render("pages/home.html")
        }
        catch(error) {
            next(error);
        }
    }

    async index(req , res , next) {
        try {
            return res.render("layout/index.html");
        }
        catch(error) {
            next(error)
        }
    }

    async login(req , res , next) {
        try {
            const data = {
                title: "ورود"
            }
            return res.render("pages/login.html" , data)
        }
        catch(error) {
            next(error)
        }
    }

    async register(req , res , next) {
        try {
            const data = {
                title: "ثبت نام"
            }
            return res.render("pages/register.html" , data);
        }
        catch(error) {
            next(error);
        }
    };

    async recovery(req , res , next) {
        try {
            const data = {
                title: "بازیابی کلمه عبور"
            }
            return res.render("pages/recovery.html" , data)
        }
        catch(error) {
            next(error);
        }
    }

};
export default new UserController();