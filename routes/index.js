import express from "express";
import patientRoutes from "./PatientRoute.js";
import doctorRoutes from "./DoctorRoute.js";
import authRoutes from "./authRoute.js";
import ocrRoutes from "./OcrRoute.js";
import reportRoutes from "./ReportRoute.js";
import report from "./report.js";
import Notification from "./Notification.js"; // assuming NotificationRoutes is defined

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/ocr", ocrRoutes);
router.use("/patients", patientRoutes);
router.use("/doctors", doctorRoutes);
router.use("/uploads", reportRoutes);
router.use("/notifications",Notification); // assuming NotificationRoutes is defined
router.use("/", report); // assuming report has base path '/'

export default router;
