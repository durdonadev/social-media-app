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
postRouter.patch(
    "/:id/private",
    authMiddleware.authenticate,
    authMiddleware.isUser,
    postController.setVisibilityPrivate
);

postRouter.patch(
    "/:id/friends-only",
    authMiddleware.authenticate,
    authMiddleware.isUser,
    postController.setVisibilityFriendsOnly
);

postRouter.patch(
    "/:id/public",
    authMiddleware.authenticate,
    authMiddleware.isUser,
    postController.setVisibilityPublic
);

export { postRouter };
