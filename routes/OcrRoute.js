import express from "express";
import multer from "multer";
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
function convertDate(dateStr) {
  // Gère le format "DD/MM/YYYY"
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return null;
  return new Date(`${year}-${month}-${day}`);
}

router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Aucun fichier envoyé." });
    }
    const imagePath = path.resolve(req.file.path);
    const ocrResult = await envoyerImageAuServiceOCR(imagePath);
    const rapport = new Rapport({
      patientId: req.user.id,
      imageUrl: req.file.path.replace(/\\/g, '/'), // Force les slashs Unix // ou utiliser un chemin public si tu héberges les images
      ocrResult,
      date: convertDate(ocrResult.Edite_date) || new Date(),
      reportType: req.body.reportType,
    });

    await rapport.save();
    console.log("Rapport enregistré :", rapport);
    res.json({
      success: true,
      message: "Rapport enregistré avec succès",
      data: rapport,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors du traitement OCR",
      error: err.message,
    });
  }
});

export default router;
