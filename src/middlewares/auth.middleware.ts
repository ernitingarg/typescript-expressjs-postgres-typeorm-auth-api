import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

dotenv.config();

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(StatusCodes.UNAUTHORIZED).json("Unauthorized access");
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json("Unauthorized access");
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);
  if (!decode) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized access" });
  }

  req["currentUser"] = token;

  next();
};

export const authorization = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: {
        id: req["currentUser"].id,
      },
    });
    console.log(user);

    if (!roles.includes(user.role)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Forbidden access" });
    }

    next();
  };
};
