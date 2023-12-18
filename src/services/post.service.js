import { prisma } from "../prisma/index.js";
import { v4 as uuid } from "uuid";
import { CustomError } from "../utils/custom-error.js";

class PostService {
    create = async (userId, input) => {
        const post = await prisma.post.create({
            data: {
                ...input,
                userId: userId
            }
        });
        return post;
    };
}

export const postService = new PostService();
