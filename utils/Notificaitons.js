import Notification from "../models/Notification.js";

/**
 * Creates a new notification.
 * 
 * @param {Object} options - Notification options.
 * @param {mongoose.Types.ObjectId} options.userId - The user ID to notify.
 * @param {string} options.title - Title of the notification.
 * @param {string} options.message - Main message body.
 * @param {"info" | "warning" | "success" | "error"} options.type - Type of notification.
 * @param {mongoose.Types.ObjectId} [options.reportId] - Optional report ID.
 * 
 * @returns {Promise<Object>} The saved notification document.
 */
export const createNotification = async ({ userId, title, message, type, reportId = null }) => {
  try {
    const notification = new Notification({
      userId,
      title,
      message,
      type,
      reportId,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error in createNotification utility:", error);
    throw new Error("Failed to create notification");
  }
};
