const express = require('express');
const router = express.Router();
const matchRequestController = require('../controllers/matchRequest.controller');
const auth = require("../../../../middleware/auth");

router.use(auth);
router.post('/', matchRequestController.sendRequest);
router.get('/my-requests', matchRequestController.getMyRequests);
router.patch('/:requestId/respond', matchRequestController.respondToRequest);
router.patch('/:requestId/cancel', matchRequestController.cancelRequest);

module.exports = router;
