import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const { JWT_SECRET } = process.env;

export class encrypt {
  static async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async comparePassword(password: string, hashPassword: string) {
    return await bcrypt.compare(password, hashPassword);
  }

  static async generateToken(payload: payload) {
    return await jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
  }
}
