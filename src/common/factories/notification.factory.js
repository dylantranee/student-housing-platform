const { 
    EmailNotificationService, 
    SMSNotificationService, 
    PushNotificationService 
} = require('../services/notification.services');

class NotificationFactory {
    /**
     * Get a notification service implementation
     * @param {string} type - 'email', 'sms', or 'push'
     * @returns {Object} - The service instance
     */
    static getService(type) {
        switch (type.toLowerCase()) {
            case 'email':
                return new EmailNotificationService();
            case 'sms':
                return new SMSNotificationService();
            case 'push':
                return new PushNotificationService();
            default:
                console.warn(`[NotificationFactory] Fallback to Email for unknown type: ${type}`);
                return new EmailNotificationService();
        }
    }
}

module.exports = NotificationFactory;
