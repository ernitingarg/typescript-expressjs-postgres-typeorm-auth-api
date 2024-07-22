import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { StatusCodes } from "http-status-codes";
import { encrypt } from "../helpers/helpers";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: {
          email: email,
        },
      });

      if (!user) {
        return res
          .send(StatusCodes.NOT_FOUND)
          .json({ error: `User not found with email: ${email}` });
      }

      const isValid = await encrypt.comparePassword(password, user.password);
      if (!isValid) {
        return res
          .send(StatusCodes.BAD_REQUEST)
          .json({ error: `Invalid password provided for email: ${email}` });
      }

      const token = encrypt.generateToken({ id: user.id });
      return res.status(StatusCodes.OK).json({
        message: "Login Successful",
        token: token,
      });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }

  static async getProfile(req: Request, res: Response) {
    const currentUser = req["currentUser"];
    if (!currentUser) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized user" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        id: currentUser.id,
      },
    });

    return res.status(StatusCodes.OK).json({ ...user, password: undefined });
  }
}
