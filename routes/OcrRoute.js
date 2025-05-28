import express from "express";
import verifyToken from "../Middleware/AuthVerify.js";
import { uploadRapportWithOCR } from "../controllers/ocrController.js";
import upload from "../config/multerConfig.js"; // ✅ Import the multer config

const router = express.Router();

router.post("/", verifyToken, upload.single("image"), uploadRapportWithOCR);

export default router;
