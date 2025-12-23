const PropertyInquiry = require('../models/PropertyInquiry');
const HouseDetail = require('../models/HouseDetail');

// Create a new property inquiry
exports.createInquiry = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { propertyId, message, moveInDate, tenantPhone, linkedRoommateId } = req.body;

        // Validate required fields
        if (!propertyId || !message || !moveInDate) {
            return res.status(400).json({ 
                message: 'Missing required fields: propertyId, message, and moveInDate are required' 
            });
        }

        // Verify property exists
        const property = await HouseDetail.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Get user info from authenticated user
        const tenantName = req.user.name;
        const tenantEmail = req.user.email;
        const phone = tenantPhone || req.user.phone;

        if (!phone) {
            return res.status(400).json({ 
                message: 'Phone number is required. Please update your profile.' 
            });
        }

        // Check for existing inquiry to prevent duplicates
        const existingInquiry = await PropertyInquiry.findOne({
            propertyId,
            tenantId: userId
        });

        if (existingInquiry) {
            return res.status(409).json({ 
                message: 'You have already submitted an inquiry for this property',
                existingInquiry 
            });
        }

        // If linked roommate is provided, verify connection and get their info
        let linkedRoommateData = {};
        if (linkedRoommateId) {
            const MatchRequest = require('../models/MatchRequest');
            const User = require('../models/User');

            // Verify that the two users have an accepted connection
            const connection = await MatchRequest.findOne({
                $or: [
                    { senderId: userId, receiverId: linkedRoommateId, status: 'accepted' },
                    { senderId: linkedRoommateId, receiverId: userId, status: 'accepted' }
                ]
            });

            if (!connection) {
                return res.status(400).json({ 
                    message: 'You can only link roommates with accepted connections' 
                });
            }

            // Fetch roommate's details
            const roommate = await User.findById(linkedRoommateId).select('name email phone');
            if (!roommate) {
                return res.status(404).json({ message: 'Linked roommate not found' });
            }

            linkedRoommateData = {
                linkedRoommateId,
                linkedRoommateName: roommate.name,
                linkedRoommateEmail: roommate.email,
                linkedRoommatePhone: roommate.phone || '',
                linkedRoommateConfirmed: false
            };
        }

        // Create inquiry
        const inquiry = new PropertyInquiry({
            propertyId,
            tenantId: userId,
            tenantName,
            tenantEmail,
            tenantPhone: phone,
            message,
            moveInDate,
            status: 'pending',
            ...linkedRoommateData
        });

        await inquiry.save();

        res.status(201).json({
            message: 'Inquiry submitted successfully',
            inquiry
        });
    } catch (error) {
        console.error('Error creating property inquiry:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: 'Validation failed', errors: messages });
        }
        res.status(500).json({ message: 'Failed to submit inquiry', error: error.message });
    }
};

// Get all inquiries for the authenticated user (tenant view)
exports.getMyInquiries = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;

        // Find inquiries created by this user OR where they're the linked roommate
        const inquiries = await PropertyInquiry.find({
            $or: [
                { tenantId: userId },
                { linkedRoommateId: userId }
            ]
        })
            .populate('propertyId', 'title address price images')
            .sort({ createdAt: -1 });

        res.json(inquiries);
    } catch (error) {
        console.error('Error fetching user inquiries:', error);
        res.status(500).json({ message: 'Failed to fetch inquiries', error: error.message });
    }
};

// Get all inquiries for a specific property (landlord view)
exports.getPropertyInquiries = async (req, res) => {
    try {
        const { propertyId } = req.params;

        // Verify property exists
        const property = await HouseDetail.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // TODO: Add authorization check - only property owner should access this
        // For now, any authenticated user can view (we'll add landlord roles later)

        const inquiries = await PropertyInquiry.find({ propertyId })
            .populate('tenantId', 'name email')
            .sort({ createdAt: -1 });

        res.json(inquiries);
    } catch (error) {
        console.error('Error fetching property inquiries:', error);
        res.status(500).json({ message: 'Failed to fetch inquiries', error: error.message });
    }
};

// Confirm linked roommate interest in a property inquiry
exports.confirmLinkedRoommate = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { inquiryId } = req.params;

        const inquiry = await PropertyInquiry.findById(inquiryId);
        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        // Verify that the current user is the linked roommate
        if (!inquiry.linkedRoommateId || inquiry.linkedRoommateId.toString() !== userId.toString()) {
            return res.status(403).json({ 
                message: 'You are not authorized to confirm this inquiry' 
            });
        }

        // Update confirmation status
        inquiry.linkedRoommateConfirmed = true;
        await inquiry.save();

        res.json({
            message: 'Successfully confirmed interest in this property',
            inquiry
        });
    } catch (error) {
        console.error('Error confirming linked roommate:', error);
        res.status(500).json({ message: 'Failed to confirm interest', error: error.message });
    }
};

// Withdraw a property inquiry
exports.withdrawInquiry = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { inquiryId } = req.params;

        const inquiry = await PropertyInquiry.findById(inquiryId);
        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        // Verify that the current user is the inquiry creator
        if (inquiry.tenantId.toString() !== userId.toString()) {
            return res.status(403).json({ 
                message: 'You are not authorized to withdraw this inquiry' 
            });
        }

        // Check if inquiry can be withdrawn (only pending, contacted, or viewed)
        if (!['pending', 'contacted', 'viewed'].includes(inquiry.status)) {
            return res.status(400).json({ 
                message: `Cannot withdraw inquiry with status '${inquiry.status}'`
            });
        }

        // Update status to withdrawn
        inquiry.status = 'withdrawn';
        await inquiry.save();

        res.json({
            message: 'Inquiry withdrawn successfully',
            inquiry
        });
    } catch (error) {
        console.error('Error withdrawing inquiry:', error);
        res.status(500).json({ message: 'Failed to withdraw inquiry', error: error.message });
    }
};
