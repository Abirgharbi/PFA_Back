import express from "express";
import { getReportsByUser } from "../controllers/archiveController.js";
import verifyToken from "../Middleware/AuthVerify.js";
import { getReportsAnalytics } from "../controllers/reportController.js";

const router = express.Router();

router.get("/reports", verifyToken, getReportsByUser);
router.get("/analytics", verifyToken, getReportsAnalytics);

export default router;
