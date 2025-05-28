import {
  fetchUserNotifications,
  markNotificationAsRead,
  createNotification,
  createFollowUpNotification,
} from "../services/notificationService.js";

// GET /api/notifications/user
export const getUserNotifications = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const notifications = await fetchUserNotifications(userId);
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Server error while fetching notifications." });
  }
};

// PUT /api/notifications/read/:id
export const markAsRead = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Notification ID is required." });
  }

  try {
    const notification = await markNotificationAsRead(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.json(notification);
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ message: "Server error while updating notification." });
  }
};

// POST /api/notifications/followups
export const createFollowUp = async (req, res) => {
  const { patientId, followUpDate, details } = req.body;

  try {
    const followUp = await createFollowUpNotification({ patientId, followUpDate, details });
    res.status(201).json({ success: true, followUp });
  } catch (error) {
    console.error("Follow-up creation failed:", error);
    res.status(500).json({ message: "Error creating follow-up", error });
  }
};
