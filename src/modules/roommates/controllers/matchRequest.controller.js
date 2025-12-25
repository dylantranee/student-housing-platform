const MatchRequest = require('../models/matchRequest.model');
const RoommateProfile = require('../models/roommateProfile.model');
const { eventBus, EVENTS } = require('../../../common/events/eventBus');

exports.sendRequest = async (req, res) => {
  try {
    const senderId = req.user._id || req.user.id;
    const { receiverId, message, propertyLink } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({ message: 'Receiver and message are required' });
    }

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ message: 'You cannot send a request to yourself' });
    }

    const receiverProfile = await RoommateProfile.findOne({ userId: receiverId });
    if (!receiverProfile) {
      return res.status(404).json({ message: 'Receiver profile not found' });
    }

    const existingRequest = await MatchRequest.findOne({
      senderId,
      receiverId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return res.status(400).json({ 
        message: existingRequest.status === 'pending' 
          ? 'You already have a pending request to this user' 
          : 'You are already connected with this user' 
      });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const requestCount = await MatchRequest.countDocuments({
      senderId,
      createdAt: { $gte: startOfDay }
    });

    if (requestCount >= 10) {
      return res.status(429).json({ message: 'Daily limit of 10 requests reached. Please try again tomorrow.' });
    }

    const matchRequest = new MatchRequest({
      senderId,
      receiverId,
      message,
      propertyLink,
      status: 'pending'
    });

    await matchRequest.save();

    // --- Observer Pattern: Emit Event ---
    eventBus.emit(EVENTS.MATCH_REQUEST_SENT, {
      matchRequest,
      senderName: req.user.name
    });
    // ------------------------------------

    res.status(201).json({
      message: 'Connection request sent successfully',
      data: matchRequest
    });

  } catch (error) {
    console.error('Error sending match request:', error);
    res.status(500).json({ message: 'Failed to send connection request', error: error.message });
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    const senderId = req.user._id || req.user.id;
    const { requestId } = req.params;

    const matchRequest = await MatchRequest.findOneAndUpdate(
      { _id: requestId, senderId, status: 'pending' },
      { status: 'cancelled' },
      { new: true }
    );

    if (!matchRequest) {
      return res.status(404).json({ message: 'Pending request not found' });
    }

    res.json({ message: 'Request cancelled successfully', data: matchRequest });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel request', error: error.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const outgoing = await MatchRequest.find({ senderId: userId })
      .populate('receiverId', 'name email')
      .sort({ createdAt: -1 });

    const incoming = await MatchRequest.find({ receiverId: userId })
      .populate('senderId', 'name email')
      .sort({ createdAt: -1 });

    // Filter out requests where population failed (e.g. user deleted)
    const validOutgoing = outgoing.filter(r => r.receiverId);
    const validIncoming = incoming.filter(r => r.senderId);

    const senderIds = validIncoming.map(r => r.senderId._id);
    const receiverIds = validOutgoing.map(r => r.receiverId._id);
    
    const profiles = await RoommateProfile.find({
      userId: { $in: [...senderIds, ...receiverIds] }
    }).select('userId profilePhoto university');

    const profileMap = new Map();
    profiles.forEach(p => {
      if (p.userId) {
        profileMap.set(p.userId.toString(), p);
      }
    });

    const processRequest = (req, otherUserField) => {
      const rObj = req.toObject();
      const otherUser = rObj[otherUserField];
      
      if (!otherUser) return null;
      
      const otherUserId = otherUser._id.toString();
      const profile = profileMap.get(otherUserId);
      
      return {
        ...rObj,
        otherUserProfile: profile ? {
          profilePhoto: profile.profilePhoto,
          university: profile.university
        } : null
      };
    };

    res.json({
      outgoing: validOutgoing.map(r => processRequest(r, 'receiverId')).filter(Boolean),
      incoming: validIncoming.map(r => processRequest(r, 'senderId')).filter(Boolean)
    });

  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch match requests', error: error.message });
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { requestId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be accepted or declined.' });
    }

    const matchRequest = await MatchRequest.findOneAndUpdate(
      { _id: requestId, receiverId: userId, status: 'pending' },
      { status },
      { new: true }
    ).populate('senderId', 'name email');

    if (!matchRequest) {
      return res.status(404).json({ message: 'Pending request not found' });
    }

    // --- Observer Pattern: Emit Event if Accepted ---
    if (status === 'accepted') {
      eventBus.emit(EVENTS.MATCH_REQUEST_ACCEPTED, {
        matchRequest,
        responderName: req.user.name
      });
    }
    // ------------------------------------------------

    res.json({ message: `Request ${status} successfully`, data: matchRequest });

  } catch (error) {
    res.status(500).json({ message: 'Failed to respond to request', error: error.message });
  }
};
