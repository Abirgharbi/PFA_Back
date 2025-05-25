import Notification from '../models/Notification.js';

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      userId: req.params.userId 
    }).sort({ createdAt: -1 });
    
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createNotification = async (data) => {
  try {
    const notification = new Notification(data);
    await notification.save();
    return notification;
  } catch (err) {
    console.error('Error creating notification:', err);
    throw err;
  }
};