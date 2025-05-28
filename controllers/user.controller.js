import { body, validationResult } from "express-validator";
import BaseController from "./base.controller.js";
import crypto from "../core/crypto.js";
import { Redis } from "../core/redis.js";
import { random } from "../core/utils.js";


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
            const data = {
                title: "خوش امدید به پروفایل خودتون",
                "formData": req.session.admin_info
            }
            return res.render("layout/index.html" , data);
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

    async #loginValidation(req) {
        await body("email").not().isEmpty().withMessage("err1").isEmail().withMessage("err2").run(req);
        await body("password").not().isEmpty().withMessage("err3").isLength({min: 8}).withMessage("err4").run(req);
        return validationResult(req);
    }

    async postLogin(req , res , next) {
        try {
            const result = await this.#loginValidation(req);
            if(!result.isEmpty()) {
                return res.redirect(`/login?msg=${result?.errors[0]?.msg}`);
            }
            const email = super.input(req.body.email);
            const password = super.input(req.body.password);
            const hashEmail = crypto.hash(email);
            const user = await Redis.get(`register_${hashEmail}`);
            if(user?.id && user.password === password) {
                req.session.admin_id = user?.id;
                req.session.admin_info = user;
                return res.redirect(`/?msg=login-success`)
            }
            else {
                return res.redirect(`/login?msg=login-error`)
            }
        }
        catch(e) {
            next(e);
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
        await body("first_name").not().isEmpty().withMessage("err1").isLength({max: 30}).withMessage("err2").run(req);
        await body("last_name").not().isEmpty().withMessage("err3").isLength({max: 30}).withMessage("err4").run(req);
        await body("username").not().isEmpty().withMessage("err6").isLength({min: 3}).withMessage("err7").run(req);
        await body("email").not().isEmpty().withMessage("err8").isEmail().withMessage("err9").run(req);
        await body("password1").not().isEmpty().withMessage("err10").isLength({min: 8}).withMessage("err11").run(req);
        await body("password2").not().isEmpty().withMessage("err12").isLength({min: 8}).withMessage("err13").run(req);
        return  validationResult(req);
    };

    async postRegister(req ,res , next) {
        try {
            const result = await this.#registerValidation(req);
            if(!result.isEmpty()) {
                return res.redirect(`/register?msg=${result?.errors[0]?.msg}`)
            }
            const firstName = super.input(req.body.first_name);
            const lastName = super.input(req.body.last_name);
            const userName = super.input(req.body.username);
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
                    firstName,
                    lastName,
                    userName,
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

    async profile(req , res , next) {
        try {
            const data = {
                title: "اطلاعات کاربر",
                "formData": req.session.admin_info
            }
            return res.render("pages/profile.html" , data)
        }
        catch(error) {
            next(error)
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

    async #recoveryValidation(req) {
        await body("email").not().isEmpty().withMessage("err1").isEmail().withMessage("err2").run(req);
        return validationResult(req);
    }

    async postRecovery(req , res , next) {
        try {
            const result = await this.#recoveryValidation(req);
            if(!result.isEmpty()) {
                return res.redirect(`/recovery?msg=${result?.errors[0]?.msg}`);
            }

            const email = super.input(req.body.email);
            const hashEmail = crypto.hash(email);
            const user = await Redis.get(`register_${hashEmail}`);
            if(user?.id) {
                const resetKey = await Redis.get(`reset_${hashEmail}`);
                if(resetKey === "") {
                    const token = crypto.hash(email + random(1000000000,9999999999) + random(1000000000,9999999999) );
                    const data = {
                        id: hashEmail,
                        email,
                        token
                    };
                    await Redis.set(`reset_${hashEmail}` , data , 120);
                    return res.redirect("/recovery?msg=ok")
                }
                else {
                    return res.redirect("/recovery?msg=reset-wait")
                }
            }
            else {
                return res.redirect("/recovery?msg=email-error")
            }
        }
        catch(error) {
            console.log(error)
            next(error)
        }
    }

    async logout(req , res , next) {
        try {
            delete req.session.admin_id;
            delete req.session.admin_info;
            req.session.destroy();
            return res.redirect(`/login?msg=logout-success`)
        }
        catch(error){
            next(error)
        }
    }

};
export default new UserController();