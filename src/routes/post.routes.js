import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { postController } from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.post(
    "/",
    authMiddleware.authenticate,
    authMiddleware.isUser,
    postController.create
);

export { postRouter };
