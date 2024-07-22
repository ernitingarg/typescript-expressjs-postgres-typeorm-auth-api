import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`Error: ${error.message}`);

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: error,
  });
};
