import { Router } from "express";
import userRouters from "./user.js";

const mainRouter = Router();

mainRouter.use("/" , userRouters);

export default mainRouter;