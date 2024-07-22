import { Request, Response } from "express";
import { encrypt } from "../helpers/helpers";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import { StatusCodes } from "http-status-codes";

export class UserController {
  static async signup(req: Request, res: Response) {
    const { name, email, password, role } = req.body;
    const hashPassword = await encrypt.hashPassword(password);

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = hashPassword;
    user.role = role;

    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save(user);

    const token = encrypt.generateToken({ id: user.id });

    return res.status(StatusCodes.OK).json({
      token: token,
      user: { ...user, password: undefined },
    });
  }

  static async getUsers(req: Request, res: Response) {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();

    return res.status(200).json({
      data: users,
    });
  }

  static async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });
    user.name = name;
    user.email = email;
    await userRepository.save(user);
    res.status(200).json({ message: "udpdate", user });
  }

  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });
    await userRepository.remove(user);
    res.status(200).json({ message: "ok" });
  }
}
