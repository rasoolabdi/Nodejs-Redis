import { Router } from "express";
import userController from "../controllers/user.controller.js";

const userRouters = Router();

userRouters.get("/profile" , userController.index);

export default userRouters;