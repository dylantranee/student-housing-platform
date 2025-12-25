const Notification = require('../models/notification.model');

/**
 * Get all notifications for the authenticated user
 */
exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        console.log(`[NotificationController] Fetching notifications for user: ${userId}`);
        
        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .limit(50); // Limit to recent 50
            
        console.log(`[NotificationController] Found ${notifications.length} notifications for ${userId}`);
        res.json(notifications);
    } catch (error) {
        console.error('[NotificationController] Error fetching notifications:', error);
        res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
    }
};

/**
 * Mark a notification as read
 */
exports.markAsRead = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { id } = req.params;
        
        const notification = await Notification.findOneAndUpdate(
            { _id: id, recipient: userId },
            { read: true },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        res.json(notification);
    } catch (error) {
        console.error('[NotificationController] Error marking as read:', error);
        res.status(500).json({ message: 'Failed to update notification', error: error.message });
    }
};

/**
 * Mark all notifications as read for the user
 */
exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        
        await Notification.updateMany(
            { recipient: userId, read: false },
            { read: true }
        );
        
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('[NotificationController] Error marking all as read:', error);
        res.status(500).json({ message: 'Failed to update notifications', error: error.message });
    }
};

/**
 * Clear all notifications (Optional)
 */
exports.clearNotifications = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        
        await Notification.deleteMany({ recipient: userId });
        
        res.json({ message: 'All notifications cleared' });
    } catch (error) {
        console.error('[NotificationController] Error clearing notifications:', error);
        res.status(500).json({ message: 'Failed to clear notifications', error: error.message });
    }
};
/**
 * Delete a specific notification
 */
exports.deleteNotification = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { id } = req.params;
        
        const result = await Notification.findOneAndDelete({ _id: id, recipient: userId });
        
        if (!result) {
            return res.status(404).json({ message: 'Notification not found or already deleted' });
        }
        
        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('[NotificationController] Error deleting notification:', error);
        res.status(500).json({ message: 'Failed to delete notification', error: error.message });
    }
};
