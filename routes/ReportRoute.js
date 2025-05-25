import express from 'express';
import {getReportsByUser} from '../controllers/archiveController.js'
const router = express.Router();
import verifyToken from "../Middleware/AuthVerify.js";

router.get('/reports', verifyToken, getReportsByUser);

export default router;
