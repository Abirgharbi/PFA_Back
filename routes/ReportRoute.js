import express from 'express';
import {getReportsByUser , getReportById } from '../controllers/archiveController.js'
const router = express.Router();
import verifyToken from "../Middleware/AuthVerify.js";

router.get('/reports', verifyToken, getReportsByUser);
router.get('/:id', getReportById);

export default router;
