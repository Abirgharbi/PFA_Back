import AuthService from "../services/authService.js";
import { createNotification } from "../utils/Notificaitons.js";

export const registerPatient = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const { user, token } = await AuthService.registerUser({
      fullName,
      email,
      password,
      role: "patient",
    });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const registerDoctor = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const { user, token } = await AuthService.registerUser({
      fullName,
      email,
      password,
      role: "doctor",
    });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { email: userEmail, role, userId } = await AuthService.loginUser({
      email,
      password,
    });
    await createNotification({
      userId: userId,
      title: "You Has been logged in",
      message: "your account s looged ind",
      type: "info",
    });
    res.status(200).json({
      message: "Verification code sent to your email",
      need2FA: true,
      email: userEmail,
      role,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verify2FACode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const { user, token, role } = await AuthService.verify2FACode({
      email,
      code,
    });
    res.status(200).json({ user, token, role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resend2FA = async (req, res) => {
  try {
    const { email } = req.body;
    const { email: userEmail, role } = await AuthService.resend2FACode({
      email,
    });
    res.status(200).json({
      message: "A new verification code has been sent to your email",
      email: userEmail,
      role,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
