import BaseController from "./base.controller.js";


class UserController extends BaseController {
    constructor() {
        super();
    };

    async index(req , res , next) {
        try {
            return res.render("layout/index.html");
        }
        catch(error) {
            next(error)
        }
    }
};
export default new UserController();