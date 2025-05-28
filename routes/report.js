
import express from 'express';
import { shareReport , getSharedReport ,shareByEmail,acceptSharedReport} from '../controllers/archiveController.js'
import Report from '../models/Rapport.js'
import verifyToken from "../Middleware/AuthVerify.js";
import { shareRapportWithDoctor } from '../controllers/reportController.js';

const router = express.Router();


router.patch('/:id/share', verifyToken, shareReport);
router.post('/share-email', verifyToken, shareByEmail);
// router.get('/shared/:id', getSharedReport);
// router.get('/shared-reports/:id', getSharedReport);
router.post('/shared/:id/accept', verifyToken, acceptSharedReport);


router.get('/shared-reports/:id', async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      $or: [
        { isPublic: true },
        { sharedWith: { $exists: true, $ne: [] } },
        { sharedEmails: req.query.email || '' }
      ]
    });

    if (!report) {
      console.log('Tentative d\'accès non autorisée au rapport:', req.params.id);
      return res.status(404).json({ 
        success: false,
        message: 'Rapport non trouvé ou accès non autorisé' 
      });
    }

    res.json({
      success: true,
      data: {
        _id: report._id,
        title: report.title,
        date: report.date,
        patientId: report.patientId,
        imageUrl: report.imageUrl,
        ocrResult: report.ocrResult
      }
    });
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
});
router.get('/reports/patient/:patientId', verifyToken, async (req, res) => {
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

router.post("/share", shareRapportWithDoctor);

export default router;
