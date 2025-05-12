import autoBind from "auto-bind";

class BaseController {
    constructor() {
        if(this.costructor === BaseController) {
            throw new Error("BaseController is Abstract class");
        }
        autoBind(this);
    }
};
export default  BaseController;