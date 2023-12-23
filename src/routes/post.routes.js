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
postRouter.get("/", authMiddleware.authenticate, postController.getAll);
postRouter.get("/:id", authMiddleware.authenticate, postController.getOne);
postRouter.delete(
    "/:id",
    authMiddleware.authenticate,
    authMiddleware.isUser,
    postController.deleteOne
);
postRouter.patch(
    "/:id",
    authMiddleware.authenticate,
    authMiddleware.isUser,
    postController.update
);

export { postRouter };
