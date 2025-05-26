import {
  getUserReports,
  getReportStatsDetailed,
} from "../Services/reportService.js";

export const getReportsAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const reports = await getUserReports(userId);
    const stats = getReportStatsDetailed(reports);
    res.json(stats);
  } catch (err) {
    console.error("Erreur statistiques rapport :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
