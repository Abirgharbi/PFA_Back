import Notification from "../models/Notification.js";

// Get notifications for a specific user
export const fetchUserNotifications = async (userId) => {
  return await Notification.find({ userId }).sort({ createdAt: -1 });
};

// Mark a notification as read
export const markNotificationAsRead = async (id) => {
  return await Notification.findByIdAndUpdate(
    id,
    { read: true, updatedAt: new Date() },
    { new: true }
  );
};

// Create a generic notification
export const createNotification = async (data) => {
  const notification = new Notification(data);
  return await notification.save();
};

// Create a follow-up notification
export const createFollowUpNotification = async ({ patientId, followUpDate, details }) => {
  return await Notification.create({
    userId: patientId,
    title: "Suivi médical programmé",
    type: "follow-up",
    datefollowup: new Date(followUpDate),
    message: details,
  });
};
