import { body, validationResult } from "express-validator";
import BaseController from "./base.controller.js";
import crypto from "../core/crypto.js";
import { Redis } from "../core/redis.js";


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

    async #registerValidation(req) {
        await body("email").not().isEmpty().withMessage("err1").isEmail().withMessage("err2").run(req);
        await body("password1").not().isEmpty().withMessage("err3").run(req);
        await body("password2").not().isEmpty().withMessage("err4").run(req);
        return  validationResult(req);
    };

    async postRegister(req ,res , next) {
        try {
            const result = await this.#registerValidation(req);
            if(!result.isEmpty()) {
                return res.redirect(`/register?msg=${result?.errors[0]?.msg}`)
            }
            const email = super.input(req.body.email);
            const password1 = super.input(req.body.password1);
            const password2 = super.input(req.body.password2);
            if(password1 !== password2) {
                return res.redirect(`/register?msg=err5`)
            };
            
            const hashEmail = crypto.hash(email);
            const alreadyEmail = await Redis.get(`register_${hashEmail}`);
            if(alreadyEmail === "") {
                const data = {
                    id: hashEmail,
                    email,
                    password: password2
                };
                await Redis.set(`register_${hashEmail}` , data);
                return res.redirect(`/register?msg=register-success`)
            }
            else {
                return res.redirect("/register?msg=already-email")
            }
        }
        catch(e) {
            next(e);
        }
    }

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