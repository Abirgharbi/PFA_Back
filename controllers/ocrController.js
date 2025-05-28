import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import path from "path";
import Rapport from "../models/Rapport.js";

// Fonction qui envoie l'image au service OCR Flask
export async function envoyerImageAuServiceOCR(imagePath) {
  const form = new FormData();
  form.append("file", fs.createReadStream(imagePath));

  // Appel de l'API Flask
  const response = await axios.post("http://127.0.0.1:5000/api/analyze", form, {
    headers: form.getHeaders(),
  });

  return response.data;
}


// Utility to convert "DD/MM/YYYY" to Date object
function convertDate(dateStr) {
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return null;
  return new Date(`${year}-${month}-${day}`);
}

// Controller to handle image upload and OCR processing
export const uploadRapportWithOCR = async (req, res) => {
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
      imageUrl: req.file.path.replace(/\\/g, "/"), // Ensure URL-safe slashes
      ocrResult,
      date: convertDate(ocrResult.Edite_date) || new Date(),
      reportType: req.body.reportType,
    });

    await rapport.save();

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
};
