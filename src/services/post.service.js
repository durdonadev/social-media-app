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

    getAll = async (userId) => {
        const posts = await prisma.post.findMany({
            where: {
                userId: userId
            }
        });
        return posts;
    };

    getOne = async (userId, postId) => {
        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        });

        if (!post) {
            throw new CustomError("Post does not exist", 400);
        }

        if (post.userId !== userId) {
            throw new CustomError("Post does not belong this user", 403);
        }

        return post;
    };
}

export const postService = new PostService();
