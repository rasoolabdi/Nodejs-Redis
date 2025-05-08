import express from "express";
import nunjucks from "nunjucks";
import {config} from "dotenv";
config();

class Application {

    #app = null;
    #templateEngine = null;

    constructor() {
        this.#initExpress();
        this.#initRoute();
        this.#app.use(express.static("assets"));
        this.#app.use(express.static("media"));
        this.#app.use(express.urlencoded({urlencoded: true}));
        this.#app.use(express.json());
        this.#initTemplate();
    }

    async #initExpress() {
        this.#app = express();
    }

    async #initTemplate() {
        const templateDir = "template/" + process.env.TEMPLATE + "/";
        this.#templateEngine = nunjucks.configure(templateDir , {
            autoescape: true,
            express: this.#app,
            noCache: false
        })
    }

    async #initRoute() {

    }

    async run() {
        const PORT = process.env.PORT;
        this.#app.listen(PORT , async () => {
            console.log(`Application is running on port ${PORT}`)
        });
    }
};
export default new Application();