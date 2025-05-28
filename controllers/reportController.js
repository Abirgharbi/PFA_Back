import {
  getUserReports,
  getReportStatsDetailed,
} from "../Services/reportService.js";
import Rapport from "../models/Rapport.js";
import Doctor from "../models/doctor.js";
export const getReportsAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const reports = await getUserReports(userId);
    const stats = getReportStatsDetailed(reports);
    console.log(stats)
    res.json(stats);
  } catch (err) {
    console.error("Erreur statistiques rapport :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
export const shareRapportWithDoctor = async (req, res) => {
  try {
    const { rapportId, doctorId } = req.body;

    const rapport = await Rapport.findById(rapportId);
    const doctor = await Doctor.findById(doctorId);

    if (!rapport || !doctor) {
      return res.status(404).json({ message: "Rapport or Doctor not found" });
    }

    // Avoid duplicates
    if (!rapport.sharedWith.includes(doctorId)) {
      rapport.sharedWith.push(doctorId);
      await rapport.save();
    }

    // Add patient to doctor.patients if not already there
    if (!doctor.patients.includes(rapport.patientId)) {
      doctor.patients.push(rapport.patientId);
      await doctor.save();
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Rapport shared with doctor successfully.",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
