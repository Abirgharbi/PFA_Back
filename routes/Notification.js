import express from "express";
import {
  getUserNotifications,
  markAsRead,
  createFollowUp,
} from "../controllers/notificationController.js";
import verifyToken from "../Middleware/AuthVerify.js";

const router = express.Router();

router.get("/user", verifyToken, getUserNotifications);
router.put("/read/:id", markAsRead);
router.post("/followups", createFollowUp);

export default router;
