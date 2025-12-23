const express = require('express');
const router = express.Router();
const matchRequestController = require('../controllers/matchRequestController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Send a connection request
router.post('/send', matchRequestController.sendRequest);

// Cancel a sent request
router.patch('/cancel/:requestId', matchRequestController.cancelRequest);

// Get current user's requests
router.get('/my-requests', matchRequestController.getMyRequests);

// Respond to a request (accept/decline)
router.patch('/respond/:requestId', matchRequestController.respondToRequest);

module.exports = router;
