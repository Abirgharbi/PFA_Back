import express from "express";
import {
  getReportsByUser,
  getReportById,
  shareReport,
} from "../controllers/archiveController.js";
import verifyToken from "../Middleware/AuthVerify.js";
import { getReportsAnalytics } from "../controllers/reportController.js";
import Rapport from "../models/Rapport.js";

const router = express.Router();
router.put("/multi/:id", verifyToken, shareReport);

router.get("/analytics/:patientId", verifyToken, getReportsAnalytics);

router.get("/reports", verifyToken, getReportsByUser);

router.get("/:id", getReportById);

router.patch("/:id/visibility", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublic } = req.body;

    const rapport = await Rapport.findById(id);
    if (!rapport) {
      return res.status(404).json({ message: "Rapport introuvable" });
    }

    rapport.isPublic = isPublic;
    await rapport.save();

    res.status(200).json({ message: "Visibilité mise à jour", isPublic });
  } catch (error) {
    console.error("Erreur de mise à jour de visibilité :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
