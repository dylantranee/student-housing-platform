const PropertyInquiry = require('../models/propertyInquiry.model');
const HouseDetail = require('../models/houseDetail.model');
const User = require('../../users/models/user.model');
const MatchRequest = require('../../roommates/models/matchRequest.model'); // Fixed path

exports.createInquiry = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { propertyId, message, moveInDate, tenantPhone, linkedRoommateId } = req.body;

        if (!propertyId || !message || !moveInDate) {
            return res.status(400).json({ 
                message: 'Missing required fields: propertyId, message, and moveInDate are required' 
            });
        }

        const property = await HouseDetail.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const tenantName = req.user.name;
        const tenantEmail = req.user.email;
        const phone = tenantPhone || req.user.phone;

        if (!phone) {
            return res.status(400).json({ 
                message: 'Phone number is required. Please update your profile.' 
            });
        }

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

        let linkedRoommateData = {};
        if (linkedRoommateId) {
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
        res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
    } catch (error) {
        console.error('Error creating property inquiry:', error);
        res.status(500).json({ message: 'Failed to submit inquiry', error: error.message });
    }
};

exports.getMyInquiries = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
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
        res.status(500).json({ message: 'Failed to fetch inquiries', error: error.message });
    }
};

exports.getPropertyInquiries = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const property = await HouseDetail.findById(propertyId);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        const inquiries = await PropertyInquiry.find({ propertyId })
            .populate('tenantId', 'name email')
            .sort({ createdAt: -1 });

        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch inquiries', error: error.message });
    }
};

exports.confirmLinkedRoommate = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { inquiryId } = req.params;
        const inquiry = await PropertyInquiry.findById(inquiryId);
        if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

        if (!inquiry.linkedRoommateId || inquiry.linkedRoommateId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to confirm this inquiry' });
        }

        inquiry.linkedRoommateConfirmed = true;
        await inquiry.save();
        res.json({ message: 'Successfully confirmed interest in this property', inquiry });
    } catch (error) {
        res.status(500).json({ message: 'Failed to confirm interest', error: error.message });
    }
};

exports.withdrawInquiry = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { inquiryId } = req.params;
        const inquiry = await PropertyInquiry.findById(inquiryId);
        if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

        if (inquiry.tenantId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to withdraw this inquiry' });
        }

        if (!['pending', 'contacted', 'viewed'].includes(inquiry.status)) {
            return res.status(400).json({ message: `Cannot withdraw inquiry with status '${inquiry.status}'` });
        }

        inquiry.status = 'withdrawn';
        await inquiry.save();
        res.json({ message: 'Inquiry withdrawn successfully', inquiry });
    } catch (error) {
        res.status(500).json({ message: 'Failed to withdraw inquiry', error: error.message });
    }
};
