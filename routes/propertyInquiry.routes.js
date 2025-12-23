const express = require('express');
const router = express.Router();
const propertyInquiryController = require('../controllers/propertyInquiryController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Submit a new inquiry
router.post('/', propertyInquiryController.createInquiry);

// Get authenticated user's inquiry history
router.get('/my-inquiries', propertyInquiryController.getMyInquiries);

// Get all inquiries for a specific property (landlord view)
router.get('/property/:propertyId', propertyInquiryController.getPropertyInquiries);

// Confirm interest as a linked roommate
router.patch('/:inquiryId/confirm', propertyInquiryController.confirmLinkedRoommate);

// Withdraw a property inquiry
router.patch('/:inquiryId/withdraw', propertyInquiryController.withdrawInquiry);

module.exports = router;
