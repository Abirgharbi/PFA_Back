import Report from "../models/Rapport.js";

export const getUserReports = async (userId) => {
  const reports = await Report.find({ patientId: userId }).sort({ date: -1 });
  return reports;
};

export const getReportStatsDetailed = (reports) => {
  const totalrapport = reports.length;

  // Pour rapports : nombre de rapports par date
  const rapportsMap = {};

  // Pour resulte : tableau des { champ, valeur, date } extraits de OCR
  const resulte = [];

  reports.forEach((report) => {
    const date = report.ocrResult?.Edite_date || "Inconnu";

    // Comptage rapports par date
    rapportsMap[date] = (rapportsMap[date] || 0) + 1;

    // Extraction de tous les champs et valeurs dans ocrResult.tables
    const tables = report.ocrResult?.tables || {};

    Object.values(tables).forEach((entries) => {
      entries.forEach((entry) => {
        if (entry.champ && entry.valeur) {
          // On parse la valeur en float (remplace , par .)
          const valeur = parseFloat(entry.valeur.replace(",", "."));
          if (!isNaN(valeur)) {
            resulte.push({
              champ: entry.champ,
              valeur,
              unité: entry.unité || "N/A",
              date,
            });
          }
        }
      });
    });
  });

  // Transformer rapportsMap en tableau [{date, number}]
  const rapports = Object.entries(rapportsMap).map(([date, number]) => ({
    date,
    number,
  }));

  return { rapports, resulte, totalrapport };
};
