const EventEmitter = require('events');

/**
 * Central Event Bus for the application.
 * This acts as the 'Subject' in the Observer Pattern.
 */
class EventBus extends EventEmitter {}

const eventBus = new EventBus();

// Define shared event names as constants to avoid typos
const EVENTS = {
    INQUIRY_CREATED: 'inquiry:created',
    MATCH_REQUEST_SENT: 'match:sent',
    MATCH_REQUEST_ACCEPTED: 'match:accepted'
};

module.exports = {
    eventBus,
    EVENTS
};
