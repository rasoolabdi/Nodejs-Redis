import express from "express";
import nunjucks from "nunjucks";
import mainRouter from "./routes/route.js";
import translate from "./core/translate.js";
import {Redis} from "./core/redis.js";
import * as templateHelper from "./core/TemplateHelper.js";
import {config} from "dotenv";
config();

class Application {

    #app = null;
    #templateEngine = null;

    constructor() {
        this.#initExpress();
        this.#initRoute();
    }

    async #initExpress() {
        this.#app = express();
        this.#app.use(express.static("assets"));
        this.#app.use(express.urlencoded({urlencoded: true}));
        this.#app.use(express.json());
        this.#app.use(async (req , res , next) => {
            try {
                this.#app.set("req" , req);
                next();
            }
            catch(error) {
                next(error);
            }
        })
        this.#initTemplateEngine();
    }

    async #initTemplateEngine() {
        const templateDir = "templates/" + process.env.TEMPLATE + "/";
        this.#templateEngine = nunjucks.configure(templateDir , {
            autoescape: true,
            express: this.#app,
            noCache: false
        });
        this.#app.set('view engine' , 'html');
        this.#templateEngine.addGlobal("t" , translate.t);
        this.#templateEngine.addGlobal("APP_URL" , process.env.APP_URL);
        this.#templateEngine.addGlobal("TEMPLATE_NAME" , process.env.TEMPLATE + "/");

        this.#templateEngine.addExtension('alertDangerExtension' , new templateHelper.alertDangerExtension());
        this.#templateEngine.addExtension('alertSuccessExtension' , new templateHelper.alertSuccessExtension());
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
        else {
            console.log("Connected to Redis DataBase")
        }

        const PORT = process.env.PORT;
        this.#app.listen(PORT , async () => {
            console.log(`Application is running on port ${PORT}`)
        });
    }
};
export default new Application();