// Base Notification Service Interface (mental model)
// All services should have a notify(user, message) method

class EmailNotificationService {
    async notify(user, message) {
        console.log(`[EmailService] Sending email to ${user.email || user.name}: ${message}`);
        // Integration with SendGrid/Nodemailer would go here
        return true;
    }
}

class SMSNotificationService {
    async notify(user, message) {
        console.log(`[SMSService] Sending SMS to ${user.phone || 'Unknown Phone'}: ${message}`);
        // Integration with Twilio would go here
        return true;
    }
}

class PushNotificationService {
    async notify(user, message) {
        console.log(`[PushService] Sending Push Notification to user ${user.id || user.name}: ${message}`);
        // Integration with Firebase/FCM would go here
        return true;
    }
}

module.exports = {
    EmailNotificationService,
    SMSNotificationService,
    PushNotificationService
};
