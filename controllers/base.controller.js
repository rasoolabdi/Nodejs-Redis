import autoBind from "auto-bind";

class BaseController {
    constructor() {
        if(this.costructor === BaseController) {
            throw new Error("BaseController is Abstract class");
        }
        autoBind(this);
    }

    input(field) {
        try {
            if(!Array.isArray(field)) {
                if(typeof field === 'string') {
                    return field.trim();
                }
                else {
                    return '';
                }
            }
            else {
                return '';
            }
        }
        catch(e) {
            return '';
        }
    };

};
export default  BaseController;