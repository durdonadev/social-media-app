import { prisma } from "../prisma/index.js";
import { bcrypt } from "../utils/bcrypt.js";
import { crypto } from "../utils/crypto.js";
import { mailer } from "../utils/mailer.js";
import { date } from "../utils/date.js";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { CustomError } from "../utils/custom-error.js";

class UserService {
    signUp = async (userInput) => {
        const hashedPassword = await bcrypt.hash(userInput.password);
        const activationToken = crypto.createToken();
        const hashedActivationToken = crypto.hash(activationToken);

        await prisma.user.create({
            data: {
                ...userInput,
                password: hashedPassword,
                activationToken: hashedActivationToken
            },
            select: {
                id: true
            }
        });

        await mailer.sendActivationMail(userInput.email, activationToken);
    };

    activate = async (token) => {
        const hashedActivationToken = crypto.hash(token);

        const user = await prisma.user.findFirst({
            where: {
                activationToken: hashedActivationToken
            },
            select: {
                id: true,
                activationToken: true
            }
        });

        if (!user) {
            throw new CustomError(
                "User does not exist with with provided Activation Token",
                404
            );
        }

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                status: "ACTIVE",
                activationToken: null
            }
        });
    };

    login = async (input) => {
        const user = await prisma.user.findUnique({
            where: {
                email: input.email
            },
            select: {
                id: true,
                status: true,
                password: true
            }
        });

        if (!user) throw new CustomError("User does not exist", 404);

        if (user.status === "INACTIVE") {
            const activationToken = crypto.createToken();
            const hashedActivationToken = crypto.hash(activationToken);

            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    activationToken: hashedActivationToken
                }
            });

            await mailer.sendActivationMail(input.email, activationToken);

            throw new CustomError(
                "We just sent you activation email. Follow instructions",
                400
            );
        }

        const isPasswordMatches = await bcrypt.compare(
            input.password,
            user.password
        );
        if (!isPasswordMatches) {
            throw new CustomError("Invalid Credentials", 401);
        }

        const token = jwt.sign(
            {
                userId: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2 days"
            }
        );

        return token;
    };

    forgotPassword = async (email) => {
        const user = await prisma.user.findFirst({
            where: {
                email
            },
            select: {
                id: true
            }
        });

        if (!user)
            throw new CustomError(
                "We could not find a user with the email you provided",
                404
            );

        const passwordResetToken = crypto.createToken();
        const hashedPasswordResetToken = crypto.hash(passwordResetToken);

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                passwordResetToken: hashedPasswordResetToken,
                passwordResetTokenExpirationDate: date.addMinutes(10)
            }
        });

        await mailer.sendPasswordResetToken(email, passwordResetToken);
    };

    resetPassword = async (token, password) => {
        const hashedPasswordResetToken = crypto.hash(token);

        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: hashedPasswordResetToken
            },
            select: {
                id: true,
                passwordResetToken: true,
                passwordResetTokenExpirationDate: true
            }
        });

        if (!user) throw new CustomError("Invalid Token", 401);

        const currentTime = new Date();
        const tokenExpDate = new Date(user.passwordResetTokenExpirationDate);

        if (tokenExpDate < currentTime)
            throw new CustomError("Reset Token Expired", 422);

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: await bcrypt.hash(password),
                passwordResetToken: null,
                passwordResetTokenExpirationDate: null
            }
        });
    };

    getMe = async (userId) => {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                id: true,
                dateOfBirth: true,
                education: true,
                currentPlace: true,
                workExperience: true
            }
        });

        if (!user) throw new CustomError("User does not exist anymore", 404);

        return user;
    };

    changePassword = async (userId, input) => {
        const user = await prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true,
                password: true
            }
        });

        const isPasswordMatches = await bcrypt.compare(
            input.password,
            user.password
        );

        if (!isPasswordMatches) {
            throw new CustomError("Invalid Credentials", 401);
        }

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: await bcrypt.hash(input.newPassword)
            }
        });
    };

    updateProfile = async (userId, input) => {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                ...input
            }
        });
    };
}

export const userService = new UserService();
