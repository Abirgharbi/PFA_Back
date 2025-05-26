import express from "express";
import {
  registerPatient,
  registerDoctor,
  login,
  verify2FACode,
  resend2FA,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register/patient", registerPatient);
router.post("/register/doctor", registerDoctor);
router.post("/login", login);
router.post("/verify2FA", verify2FACode);
router.post("/resend-2fa", resend2FA); // <-- Add this line

export default router;
