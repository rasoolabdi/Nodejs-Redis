import { Router } from "express";
import userController from "../controllers/user.controller.js";

const userRouters = Router();

userRouters.get("/" , userController.home);
userRouters.get("/profile" , userController.index);
userRouters.get("/login" , userController.login);
userRouters.post("/login" , userController.postLogin);
userRouters.get("/register" , userController.register);
userRouters.post("/register" , userController.postRegister);
userRouters.get("/recovery" , userController.recovery);
userRouters.post("/recovery" , userController.postRecovery);

export default userRouters;