import Report from "../models/Rapport.js";

export const getReportsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const reports = await Report.find({ patientId: userId }).sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    console.error("Erreur récupération rapports :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
