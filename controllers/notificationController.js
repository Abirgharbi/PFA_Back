import Notification from "../models/Notification.js";

// GET notifications for a user
export const getUserNotifications = async (req, res) => {
  const  userId  = req.user.id;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching notifications." });
  }
};

// MARK a notification as read
export const markAsRead = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Notification ID is required." });
  }

  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true, updatedAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.json(notification);
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res
      .status(500)
      .json({ message: "Server error while updating notification." });
  }
};

// CREATE a new notification (used internally or by event)
export const createNotification = async (data) => {
  try {
    const notification = new Notification(data);
    await notification.save();
    return notification;
  } catch (err) {
    console.error("Error creating notification:", err);
    throw new Error("Failed to create notification.");
  }
};
