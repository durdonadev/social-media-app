import { Router } from "express";
// import { authMiddleware } from "../middlewares/auth.middleware.js";
import { userController } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/sign-up", userController.signUp);

export { userRouter };
