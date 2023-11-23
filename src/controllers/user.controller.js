import { catchAsync } from "../utils/catch-async.js";
// import { CustomError } from "../utils/custom-error.js";
import { userService } from "../services/user.services.js";

class UserController {
    signUp = catchAsync(async (req, res) => {
        const {
            email,
            password,
            firstName,
            lastName,
            dateOfBirth,
            currentPlace,
            education,
            workExperience
        } = req.body;

        const userInput = {
            email,
            password,
            firstName,
            lastName,
            dateOfBirth,
            currentPlace,
            education,
            workExperience
        };

        await userService.signUp(userInput);
        res.status(201).json({
            message: "Success"
        });
    });

    activate = catchAsync(async (req, res) => {
        const {
            query: { activationToken }
        } = req;

        if (!activationToken) {
            throw new CustomError("Activation Token is missing", 400);
        }

        await userService.activate(activationToken);

        res.status(200).json({
            message: "Success"
        });
    });

    login = catchAsync(async (req, res) => {
        const { body } = req;
        const input = {
            email: body.email,
            password: body.password
        };

        const jwt = await userService.login(input);
        res.status(200).json({
            token: jwt
        });
    });
}

export const userController = new UserController();
