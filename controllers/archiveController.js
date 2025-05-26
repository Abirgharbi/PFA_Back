import Rapport from '../models/Rapport.js';
import nodemailer from 'nodemailer';

export const getReportsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const reports = await Rapport.find({ 
      $or: [
        { patientId: userId },
        { sharedWith: userId }
      ]
    }).sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    console.error('Erreur récupération rapports :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getReportById = async (req, res) => {
  try {
    const report = await Rapport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (err) {
    console.error('Erreur récupération rapport par ID :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// export const shareReport = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { sharedWith } = req.body;
    
//     const report = await Rapport.findOneAndUpdate(
//       { _id: id, patientId: req.user.id },
//       { sharedWith },
//       { new: true }
//     );
    
//     if (!report) {
//       return res.status(404).json({ message: 'Report not found or unauthorized' });
//     }
    
//     res.json(report);
//   } catch (err) {
//     console.error('Erreur partage rapport :', err);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };

// export const getSharedReport = async (req, res) => {
//   try {
//     const report = await Rapport.findOne({
//       _id: req.params.id,
//       $or: [
//         { isPublic: true },
//         { sharedWith: { $exists: true, $ne: [] } }
//       ]
//     });
    
//     if (!report) {
//       return res.status(404).json({ message: 'Report not found or not shared' });
//     }
    
//     res.json(report);
//   } catch (err) {
//     console.error('Erreur récupération rapport partagé :', err);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const shareReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { sharedWith } = req.body;
    
    const report = await Rapport.findOneAndUpdate(
      { _id: id, patientId: req.user.id },
      { sharedWith },
      { new: true }
    ).populate('sharedWith', 'name email');
    
    if (!report) {
      return res.status(404).json({ message: 'Rapport non trouvé ou non autorisé' });
    }

    // Envoyer des notifications aux nouveaux utilisateurs partagés
    for (const user of report.sharedWith) {
      await sendShareNotification(user.email, report, req.user.name);
    }

    res.json(report);
  } catch (err) {
    console.error('Erreur partage rapport:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const shareByEmail = async (req, res) => {
  try {
    const { reportId, email } = req.body;
    const report = await Rapport.findOne({
      _id: reportId,
      patientId: req.user.id
    }).populate('patientId', 'name');

    if (!report) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

   const shareUrl = `${process.env.FRONTEND_URL}/shared/${report._id}?email=${encodeURIComponent(email)}`;

    
    await transporter.sendMail({
      from: `"Medical App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Rapport médical partagé',
      html: buildShareEmailTemplate(report, shareUrl, req.user.name)
    });

    // Enregistrer l'email partagé
    await Rapport.findByIdAndUpdate(reportId, {
      $addToSet: { sharedEmails: email }
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Erreur envoi email:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
// GET /api/shared/:id
export const getSharedReport = async (req, res) => {
  try {
    const report = await Rapport.findOne({
      _id: req.params.id,
      $or: [
        { isPublic: true },
        { sharedWith: { $exists: true, $ne: [] } },
        { sharedEmails: req.query.email || '' }
      ]
    });

    if (!report) {
      return res.status(404).json({ message: 'Rapport non trouvé ou non partagé' });
    }
    const imagePath = req.file.path.replace(/\\/g, '/'); 

    res.json({
      _id: report._id,
      title: report.title,
      date: report.date,
      patientName: report.patientId?.name,
      imageUrl: `${process.env.API_BASE_URL}/${imagePath}`, // URL absolue
      findings: report.ocrResult?.pa
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// Fonctions utilitaires
async function sendShareNotification(email, report, senderName) {
  const shareUrl = `${process.env.FRONTEND_URL}/shared/${report._id}`;
  
  await transporter.sendMail({
    from: `"Medical App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Un rapport vous a été partagé',
    html: buildShareEmailTemplate(report, shareUrl, senderName)
  });
}

function buildShareEmailTemplate(report, shareUrl, senderName) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Nouveau rapport médical partagé</h2>
      <p>${senderName} vous a partagé un rapport médical.</p>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">${report.title}</h3>
        <p><strong>Patient:</strong> ${report.patientId?.name || 'Non spécifié'}</p>
        <p><strong>Date:</strong> ${new Date(report.date).toLocaleDateString()}</p>
      </div>
      
      <a href="${shareUrl}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color: #3498db;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
      ">
        Voir le rapport
      </a>
      
      <p style="margin-top: 20px; font-size: 0.9em; color: #7f8c8d;">
        Si vous ne pouvez pas cliquer sur le bouton, copiez et collez ce lien dans votre navigateur:<br>
        ${shareUrl}
      </p>
    </div>
  `;
}

export const acceptSharedReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user._id;

    // 1. Trouver le rapport partagé
    const sharedReport = await Rapport.findOne({
      _id: reportId,
      "sharedWith.user": userId
    });

    if (!sharedReport) {
      return res.status(404).json({ 
        success: false,
        message: "Rapport non trouvé ou non partagé avec vous" 
      });
    }

    // 2. Créer une copie pour le médecin
    const reportCopy = new Rapport({
      ...sharedReport.toObject(),
      _id: new mongoose.Types.ObjectId(),
      owner: userId,
      originalReport: sharedReport._id,
      isSharedCopy: true,
      sharedWith: [],
      sharedEmails: []
    });

    await reportCopy.save();

    // 3. Mettre à jour le statut du partage
    sharedReport.sharedWith.forEach(share => {
      if (share.user.equals(userId)) {
        share.status = "accepted";
      }
    });

    await sharedReport.save();

    res.json({
      success: true,
      message: "Rapport ajouté à votre collection",
      report: reportCopy
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur" 
    });
  }
};