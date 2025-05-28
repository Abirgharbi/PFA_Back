import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["info", "warning", "success", "error", "follow-up", "reportShared"],
    default: "info",
  },
  datefollowup: { type: Date, default: null },
  read: { type: Boolean, default: false },
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
