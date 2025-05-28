import { Router } from "express";
import userController from "../controllers/user.controller.js";
import AuthMiddleware from "../middlewares/auth.js";

const userRouters = Router();

userRouters.get("/home" , userController.home);
userRouters.get("/" , new AuthMiddleware().needAuth , userController.index);
userRouters.get("/profile-user" , userController.profile);
userRouters.get("/login", new AuthMiddleware().isAuth ,userController.login);
userRouters.post("/login" , new AuthMiddleware().isAuth , userController.postLogin);
userRouters.get("/register" , new AuthMiddleware().isAuth , userController.register);
userRouters.post("/register" , new AuthMiddleware().isAuth ,userController.postRegister);
userRouters.get("/recovery" , userController.recovery);
userRouters.post("/recovery" , userController.postRecovery);
userRouters.get("/logout" , userController.logout);

export default userRouters;