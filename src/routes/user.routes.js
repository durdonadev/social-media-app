import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { userController } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/sign-up", userController.signUp);
userRouter.get("/activate", userController.activate);
userRouter.post("/login", userController.login);
userRouter.patch("/forgot-password", userController.forgotPassword);
userRouter.patch("/reset-password", userController.resetPassword);
userRouter.get(
    "/me",
    authMiddleware.authenticate,
    authMiddleware.isUser,
    userController.getMe
);
userRouter.patch(
    "/change-password",
    authMiddleware.authenticate,
    userController.changePassword
);
userRouter.patch(
    "/update-profile",
    authMiddleware.authenticate,
    userController.updateProfile
);

export { userRouter };
