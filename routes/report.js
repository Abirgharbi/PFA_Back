import express from "express";
import Report from "../models/Rapport.js";
import verifyToken from "../Middleware/AuthVerify.js";

const router = express.Router();

// GET /api/reports/patient/:patientId
// Dans votre fichier de routes (ex: routes/reportRoutes.js)
router.get("/reports/patient/:patientId", verifyToken, async (req, res) => {
  try {
    const reports = await Report.find({
      patientId: req.params.patientId,
    }).sort({ date: -1 });

    if (!reports || reports.length === 0) {
      return res
        .status(404)
        .json({ message: "No reports found for this patient" });
    }

    res.json(reports);
  } catch (err) {
    console.error("Error fetching patient reports:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
