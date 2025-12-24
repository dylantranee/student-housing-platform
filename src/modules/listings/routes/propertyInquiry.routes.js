const express = require('express');
const router = express.Router();
const propertyInquiryController = require('../controllers/propertyInquiry.controller');
const auth = require("../../../../middleware/auth");

router.use(auth);

router.post('/', propertyInquiryController.createInquiry);
router.get('/my-inquiries', propertyInquiryController.getMyInquiries);
router.get('/property/:propertyId', propertyInquiryController.getPropertyInquiries);
router.patch('/:inquiryId/confirm', propertyInquiryController.confirmLinkedRoommate);
router.patch('/:inquiryId/withdraw', propertyInquiryController.withdrawInquiry);

module.exports = router;
