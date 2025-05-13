import express from "express";
import nunjucks from "nunjucks";
import {config} from "dotenv";
import mainRouter from "./routes/route.js";
import {Redis} from "./core/redis.js";
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
        this.#initTemplateEngine();
    }

    async #initExpress() {
        this.#app = express();
    }

    async #initTemplateEngine() {
        const templateDir = "templates/" + process.env.TEMPLATE + "/";
        this.#templateEngine = nunjucks.configure(templateDir , {
            autoescape: true,
            express: this.#app,
            noCache: false
        });
        this.#templateEngine.addGlobal("APP_URL" , process.env.APP_URL);
        this.#templateEngine.addGlobal("TEMPLATE_NAME" , process.env.TEMPLATE + "/");
    }

    async #initRoute() {
        this.#app.use("/" , mainRouter);
    }

    async run() {
        const redisDB = await Redis.connect(process.env.REDIS_URI);
        if(!redisDB) {
            console.log("connot connected to redis");
            process.exit(-1);
        }

        const PORT = process.env.PORT;
        this.#app.listen(PORT , async () => {
            console.log(`Application is running on port ${PORT}`)
        });
    }
};
export default new Application();