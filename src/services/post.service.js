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

    getOne = async (userId, id) => {
        const post = await prisma.post.findUnique({
            where: {
                id: id
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

    deleteOne = async (userId, id) => {
        const post = await prisma.post.findUnique({
            where: {
                id: id
            }
        });

        if (!post) {
            throw new CustomError("Post does not exist", 400);
        }

        if (post.userId !== userId) {
            throw new CustomError("Post does not belong this user", 403);
        }

        await prisma.post.delete({
            where: {
                id: id
            }
        });
    };

    update = async (userId, id, input) => {
        const post = await prisma.post.findUnique({
            where: {
                id: id
            }
        });

        if (!post) {
            throw new CustomError("Post does not exist", 400);
        }

        if (post.userId !== userId) {
            throw new CustomError("Post does not belong this user", 403);
        }

        const updatedPost = await prisma.post.update({
            where: {
                id: id
            },
            data: {
                ...input
            }
        });
        return updatedPost;
    };

    changeVisibilityStatus = async (userId, id, visibilityStatus) => {
        const post = await prisma.post.findUnique({
            where: {
                id: id
            }
        });

        if (!post) {
            throw new CustomError("Post does not exist", 400);
        }

        if (post.userId !== userId) {
            throw new CustomError("Post does not belong this user", 403);
        }

        await prisma.post.update({
            where: {
                id: id
            },
            data: {
                visibility: visibilityStatus
            }
        });
    };
}

export const postService = new PostService();
