const mongoose = require('mongoose');

const PropertyInquirySchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HouseDetail',
        required: true
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tenantName: {
        type: String,
        required: true
    },
    tenantEmail: {
        type: String,
        required: true
    },
    tenantPhone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        minlength: 20
    },
    moveInDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'awaiting_roommates', 'contacted', 'viewed', 'rejected', 'withdrawn'],
        default: 'pending'
    },
    linkedRoommates: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: String,
        email: String,
        phone: String,
        confirmed: {
            type: Boolean,
            default: false
        }
    }]
}, { timestamps: true });

PropertyInquirySchema.index({ propertyId: 1, createdAt: -1 });
PropertyInquirySchema.index({ tenantId: 1, createdAt: -1 });

module.exports = mongoose.model('PropertyInquiry', PropertyInquirySchema);
