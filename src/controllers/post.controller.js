import { catchAsync } from "../utils/catch-async.js";
import { CustomError } from "../utils/custom-error.js";
import { userService } from "../services/user.services.js";
import { postService } from "../services/post.service.js";
import { prisma } from "../prisma/index.js";

class PostController {
    create = catchAsync(async (req, res) => {
        const { userId, body } = req;

        const input = {
            content: body.content,
            comments: [],
            visibility: "PUBLIC",
            likeCount: 0
        };

        if (!input.content) {
            throw new CustomError("Provide Content!", 400);
        }
        const post = await postService.create(userId, input);

        res.status(201).json({
            data: post
        });
    });

    getAll = catchAsync(async (req, res) => {
        const { userId } = req;

        const posts = await postService.getAll(userId);

        res.status(200).json({
            data: posts
        });
    });

    getOne = catchAsync(async (req, res) => {
        const { userId, params } = req;

        const post = await postService.getOne(userId, params.id);

        res.status(200).json({
            data: post
        });
    });

    deleteOne = catchAsync(async (req, res) => {
        const { userId, params } = req;

        await postService.deleteOne(userId, params.id);
        res.status(204).send();
    });

    update = catchAsync(async (req, res) => {
        const { userId, params, body } = req;
        const input = {};

        if (body.content) {
            input.content = body.content;
        }

        if (!input.content) {
            throw new CustomError("No update data provided", 400);
        }

        const updatedPost = await postService.update(userId, params.id, input);

        res.status(201).json({
            data: updatedPost
        });
    });

    setVisibilityPrivate = catchAsync(async (req, res) => {
        const { userId, params } = req;

        await postService.changeVisibilityStatus(userId, params.id, "PRIVATE");
        res.status(204).send();
    });

    setVisibilityFriendsOnly = catchAsync(async (req, res) => {
        const { userId, params } = req;

        await postService.changeVisibilityStatus(
            userId,
            params.id,
            "FRIENDS_ONLY"
        );
        res.status(204).send();
    });

    setVisibilityPublic = catchAsync(async (req, res) => {
        const { userId, params } = req;

        await postService.changeVisibilityStatus(userId, params.id, "PUBLIC");
        res.status(204).send();
    });
}
export const postController = new PostController();
