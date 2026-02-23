const PropertyInquiry = require('../models/propertyInquiry.model');
const HouseDetail = require('../models/houseDetail.model');
const User = require('../../users/models/user.model');
const { eventBus, EVENTS } = require('../../../common/events/eventBus');

exports.createInquiry = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { propertyId, message, moveInDate, tenantPhone, linkedRoommateIds } = req.body;

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

        let linkedRoommates = [];
        if (linkedRoommateIds && Array.isArray(linkedRoommateIds) && linkedRoommateIds.length > 0) {
            for (const roommateId of linkedRoommateIds) {
                const roommate = await User.findById(roommateId).select('name email phone');
                if (!roommate) {
                    return res.status(404).json({ message: `Roommate with ID ${roommateId} not found` });
                }

                linkedRoommates.push({
                    user: roommateId,
                    name: roommate.name,
                    email: roommate.email,
                    phone: roommate.phone || '',
                    confirmed: false
                });
            }
        }

        const inquiry = new PropertyInquiry({
            propertyId,
            tenantId: userId,
            tenantName,
            tenantEmail,
            tenantPhone: phone,
            message,
            moveInDate,
            status: linkedRoommates.length > 0 ? 'awaiting_roommates' : 'pending',
            linkedRoommates
        });

        await inquiry.save();

        console.log(`[Backend] Inquiry saved: ${inquiry._id}. Linked Roommates: ${inquiry.linkedRoommates.length}`);
        inquiry.linkedRoommates.forEach((rm, i) => {
            console.log(`  - Roommate ${i}: ${rm.name} (ID: ${rm.user})`);
        });

        // --- Observer Pattern: Emit Event ---
        eventBus.emit(EVENTS.INQUIRY_CREATED, {
            inquiry,
            property,
            tenantName
        });
        // ------------------------------------

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
                { 'linkedRoommates.user': userId }
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

        const inquiries = await PropertyInquiry.find({ 
            propertyId,
            status: { $nin: ['awaiting_roommates', 'withdrawn'] } 
        })
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

        const roommateEntry = inquiry.linkedRoommates.find(r => r.user.toString() === userId.toString());
        if (!roommateEntry) {
            return res.status(403).json({ message: 'You are not authorized to confirm this inquiry' });
        }

        roommateEntry.confirmed = true;
        
        // Check if all roommates have confirmed
        const allConfirmed = inquiry.linkedRoommates.every(r => r.confirmed);
        if (allConfirmed) {
            inquiry.status = 'pending';
        }

        await inquiry.save();
        res.json({ 
            message: allConfirmed 
                ? 'All roommates confirmed! The inquiry is now sent to the landlord.' 
                : 'Successfully confirmed interest in this property', 
            inquiry 
        });
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
