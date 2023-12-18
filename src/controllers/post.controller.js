import { catchAsync } from "../utils/catch-async.js";
import { CustomError } from "../utils/custom-error.js";
import { userService } from "../services/user.services.js";
import { postService } from "../services/post.service.js";

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
}
export const postController = new PostController();
