import mongoose from "mongoose";

const rapportSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  imageUrl: { type: String, required: true },
  title: { type: String, default: "Rapport Médical" },
  ocrResult: { type: mongoose.Schema.Types.Mixed },
  date: { type: Date, default: Date.now },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  sharedEmails: [String],
  isPublic: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Rapport", rapportSchema);

