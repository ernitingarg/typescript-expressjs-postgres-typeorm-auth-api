import express = require("express");
import { UserController } from "../controllers/user.controller";
import { AuthController } from "../controllers/auth.controller";
import { authentication, authorization } from "../middlewares/auth.middleware";

const Router = express.Router();

Router.post("/login", AuthController.login);
Router.post("/signup", UserController.signup);

// user and admin get profile
Router.get(
  "/profile",
  authentication,
  authorization(["user", "admin"]),
  AuthController.getProfile
);

// Only admin can get all users
Router.get(
  "/users",
  authentication,
  authorization(["admin"]),
  UserController.getUsers
);

Router.put(
  "/update/:id",
  authentication,
  authorization(["user", "admin"]),
  UserController.updateUser
);

Router.delete(
  "/delete/:id",
  authentication,
  authorization(["user", "admin"]),
  UserController.deleteUser
);

export { Router as userRouter };
