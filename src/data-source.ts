import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DBNAME, DB_PORT } = process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DBNAME,
  synchronize: true,
  logging: false,
  entities: ["./src/entities/**"],
  migrations: [".src/migrations/**"],
  subscribers: [],
});
