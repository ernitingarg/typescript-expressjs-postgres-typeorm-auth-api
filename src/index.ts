import { AppDataSource } from "./data-source";
import * as dotenv from "dotenv";
import * as express from "express";
import { errorHandler } from "./middlewares/error.middleware";
import { userRouter } from "./routes/user.route";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
app.use("/auth", userRouter);

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

AppDataSource.initialize()
  .then(async () => {
    app.listen(port, () => {
      console.log(`Server started listening at port ${port}`);
    });
  })
  .catch((error) => console.log(error));
