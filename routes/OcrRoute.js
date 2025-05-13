import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { envoyerImageAuServiceOCR } from "../controllers/ocrController.js";

const router = express.Router();
const upload = multer({ dest: "uploads" });

router.post("/", upload.single("image"), async (req, res) => {
  try {

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Aucun fichier envoyé." });
    }

    const imagePath = path.resolve(req.file.path);
    const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });
    const result = await envoyerImageAuServiceOCR(imageBase64);

     fs.unlinkSync(imagePath); // Nettoyage

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'analyse OCR",
      error: err.message,
    });
  }
});

export default router;
