import express from 'express';
import {getReportsByUser , getReportById } from '../controllers/archiveController.js'
import verifyToken from '../Middleware/AuthVerify.js';
import { getReportsAnalytics } from '../controllers/reportController.js';


const router = express.Router();

router.get("/reports", verifyToken, getReportsByUser);
router.get('/reports', verifyToken, getReportsByUser);
router.get('/:id', getReportById);
router.get("/analytics", verifyToken,getReportsAnalytics );


export default router;
