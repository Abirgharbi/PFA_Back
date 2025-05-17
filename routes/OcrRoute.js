// routes/ocr.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import Rapport from "../models/Rapport.js";
import { envoyerImageAuServiceOCR } from "../controllers/ocrController.js";
import verifyToken from "../Middleware/AuthVerify.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Aucun fichier envoyé." });
    }

    const imagePath = path.resolve(req.file.path);
    const ocrResult = await envoyerImageAuServiceOCR(imagePath);

    // Enregistre le rapport dans MongoDB
    const rapport = new Rapport({
      patientId: req.user.id,
      imageUrl: req.file.path, // ou utiliser un chemin public si tu héberges les images
      ocrResult,
    });

    await rapport.save();

    res.json({ success: true, message: "Rapport enregistré avec succès", data: rapport });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur lors du traitement OCR", error: err.message });
  }
});

export default router;
