import { prisma } from "../prisma/index.js";
import { bcrypt } from "../utils/bcrypt.js";
import { crypto } from "../utils/crypto.js";
import { mailer } from "../utils/mailer.js";
// import { date } from "../utils/date.js";
// import jwt from "jsonwebtoken";
// import { v4 as uuid } from "uuid";
// import { CustomError } from "../utils/custom-error.js";

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
}

export const userService = new UserService();
