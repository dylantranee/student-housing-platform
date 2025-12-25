const { eventBus, EVENTS } = require('./eventBus');
const NotificationFactory = require('../factories/notification.factory');
const User = require('../../modules/users/models/user.model');
const Notification = require('../models/notification.model');

/**
 * Notification Observer
 * Listens for system events and triggers relevant notification services.
 */
function initNotificationListeners() {
    
    // Observer for new property inquiries
    eventBus.on(EVENTS.INQUIRY_CREATED, async (data) => {
        try {
            const { inquiry, property, tenantName } = data;
            
            console.log(`[Observer] Reacting to ${EVENTS.INQUIRY_CREATED}...`);
            
            const notifier = NotificationFactory.getService('email'); 
            
            // 1. External Notification (Landlord)
            const messageForLandlord = `New inquiry for ${property.title} from ${tenantName}`;
            const landlord = { name: 'Owner', email: 'owner@example.com' }; 
            await notifier.notify(landlord, messageForLandlord);

            // 2. Persistent Notification (Inquiry Initiator)
            try {
                console.log(`[Observer] Creating initiator notification for: ${inquiry.tenantId}`);
                await Notification.create({
                    recipient: inquiry.tenantId,
                    title: 'Inquiry Submitted',
                    message: `You successfully submitted an inquiry for ${property.title}.`,
                    category: 'PropertyInquiry',
                    relatedId: inquiry._id,
                    type: 'success'
                });
            } catch (initErr) {
                console.error('[Observer Error] Failed to create initiator notification:', initErr.message);
            }

            // 3. Notify Invited Roommates (Group Coordination)
            if (inquiry.linkedRoommates && inquiry.linkedRoommates.length > 0) {
                console.log(`[Observer] Processing ${inquiry.linkedRoommates.length} roommates...`);
                for (const roommate of inquiry.linkedRoommates) {
                    try {
                        const messageForRoommate = `${tenantName} invited you to join their inquiry for ${property.title}`;
                        await notifier.notify(roommate, messageForRoommate);
                        
                        // Persistent notification for roommate
                        if (roommate.user) {
                            const recipientId = roommate.user.toString();
                            console.log(`[Observer] Creating roommate notification for: ${recipientId}`);
                            const newNotif = await Notification.create({
                                recipient: recipientId,
                                title: 'Group Inquiry Invitation',
                                message: messageForRoommate,
                                category: 'PropertyInquiry',
                                relatedId: inquiry._id
                            });
                            console.log(`[Observer] Notification created: ${newNotif._id} for ${recipientId}`);
                        } else {
                            console.warn(`[Observer] No user ID found for roommate: ${roommate.email}`);
                        }
                    } catch (roommateErr) {
                        console.error(`[Observer Error] Failed to notify roommate ${roommate.email}:`, roommateErr.message);
                    }
                }
            }

        } catch (error) {
            console.error('[Observer Error] Failed to process inquiry notification:', error);
        }
    });

    // Observer for new match requests (Say Hello)
    eventBus.on(EVENTS.MATCH_REQUEST_SENT, async (data) => {
        try {
            const { matchRequest, senderName } = data;
            console.log(`[Observer] Reacting to ${EVENTS.MATCH_REQUEST_SENT}...`);

            const receiver = await User.findById(matchRequest.receiverId).select('name email');
            if (receiver) {
                const notifier = NotificationFactory.getService('email');
                const message = `${senderName} sent you a connection request: "${matchRequest.message}"`;
                await notifier.notify(receiver, message);

                // Persistent notification
                await Notification.create({
                    recipient: matchRequest.receiverId,
                    title: 'New Match Request',
                    message: message,
                    category: 'MatchRequest',
                    relatedId: matchRequest._id
                });
            }
        } catch (error) {
            console.error('[Observer Error] Match request notification failed:', error);
        }
    });

    // Observer for accepted match requests
    eventBus.on(EVENTS.MATCH_REQUEST_ACCEPTED, async (data) => {
        try {
            const { matchRequest, responderName } = data;
            console.log(`[Observer] Reacting to ${EVENTS.MATCH_REQUEST_ACCEPTED}...`);

            const originalSender = matchRequest.senderId;
            if (originalSender) {
                const notifier = NotificationFactory.getService('email');
                const message = `${responderName} accepted your connection request! You can now start chatting.`;
                await notifier.notify(originalSender, message);

                // Persistent notification
                await Notification.create({
                    recipient: originalSender._id || originalSender,
                    title: 'Match Request Accepted',
                    message: message,
                    category: 'MatchRequest',
                    relatedId: matchRequest._id
                });
            }
        } catch (error) {
            console.error('[Observer Error] Match acceptance notification failed:', error);
        }
    });

    console.log('✅ Notification Observers registered and Persistence active.');
}

module.exports = {
    initNotificationListeners
};
