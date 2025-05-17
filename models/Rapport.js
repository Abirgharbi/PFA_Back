// models/Rapport.js
import mongoose from "mongoose";

const rapportSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  imageUrl: { type: String, required: true },
  ocrResult: { type: mongoose.Schema.Types.Mixed }, // Tu peux adapter selon structure du résultat OCR
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Rapport", rapportSchema);
