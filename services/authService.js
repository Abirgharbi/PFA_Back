import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Patient from "../models/patient.js";
import Doctor from "../models/doctor.js";
import { sendEmail } from "../utils/SendEmail.js";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "abir";

class AuthService {
  static async registerUser({ fullName, email, password, role }) {
    const Model = role === "doctor" ? Doctor : Patient;

    const existingUser = await Model.findOne({ email });
    if (existingUser)
      throw new Error(
        `${role.charAt(0).toUpperCase() + role.slice(1)} already exists`
      );

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Model({ fullName, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, {
      expiresIn: "1d",
    });
    return { user, token };
  }

  static async loginUser({ email, password }) {
    let user = await Patient.findOne({ email });
    let role = "patient";

    if (!user) {
      user = await Doctor.findOne({ email });
      role = "doctor";
    }

    if (!user) throw new Error("Invalid email or password");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error("Invalid email or password");

    const code = crypto.randomInt(100000, 999999).toString();
    user.twoFactorCode = code;
    user.twoFactorCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    const anybody = await user.save();
    await sendEmail(email, code);

    return { email, role, userId: anybody._id };
  }

  static async verify2FACode({ email, code }) {
    let user = await Patient.findOne({ email });
    let role = "patient";

    if (!user) {
      user = await Doctor.findOne({ email });
      role = "doctor";
    }

    if (!user) throw new Error("Invalid or expired verification code");

    if (user.twoFactorCode !== code || new Date() > user.twoFactorCodeExpires) {
      throw new Error("Invalid or expired verification code");
    }

    user.twoFactorCode = null;
    user.twoFactorCodeExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return { user, token, role };
  }

  static async resend2FACode({ email }) {
    let user = await Patient.findOne({ email });
    let role = "patient";

    if (!user) {
      user = await Doctor.findOne({ email });
      role = "doctor";
    }

    if (!user) throw new Error("User not found");

    const code = crypto.randomInt(100000, 999999).toString();
    user.twoFactorCode = code;
    user.twoFactorCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail(email, code);

    return { email, role };
  }
}

export default AuthService;
