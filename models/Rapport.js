import mongoose from "mongoose";

const rapportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    imageUrl: { type: String, required: true },

    title: { type: String, default: "Rapport Médical" },
    ocrResult: { type: mongoose.Schema.Types.Mixed },
    date: { type: Date, default: Date.now },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
    sharedEmails: [String],
    isPublic: { type: Boolean, default: false },
    reportType: {
      type: String,
      required: false, // or false, depending on your use case
    },
  },
  { timestamps: true }
);

const Rapport = mongoose.model("Rapport", rapportSchema);
export default Rapport;
