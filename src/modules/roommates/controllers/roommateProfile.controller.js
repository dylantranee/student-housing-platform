const RoommateProfile = require('../models/roommateProfile.model');
const MatchRequest = require('../models/matchRequest.model');

exports.createProfile = async (req, res) => {
	try {
		const { userId } = req.body;
		const existingProfile = await RoommateProfile.findOne({ userId });
		if (existingProfile) {
			return res.status(400).json({ message: 'Profile already exists for this user' });
		}
		const profile = new RoommateProfile(req.body);
		await profile.save();
		res.status(201).json(profile);
	} catch (error) {
		res.status(500).json({ message: 'Failed to create profile', error: error.message });
	}
};

exports.getProfile = async (req, res) => {
	try {
		const { userId } = req.params;
		
		// Try finding by userId first
		let profile = await RoommateProfile.findOne({ userId });
		
		// Fallback: Try finding by profile _id if userId lookup fails 
		// (handles cases where frontend passes profileId to this endpoint)
		if (!profile && userId.match(/^[0-9a-fA-F]{24}$/)) {
			profile = await RoommateProfile.findById(userId);
		}

		// Return 200 with null instead of 404 to avoid console error logs
		if (!profile) return res.status(200).json(null);
		res.json(profile);
	} catch (error) {
		res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
	}
};

exports.updateProfile = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;
		delete updates.userId;
		const profile = await RoommateProfile.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
		if (!profile) return res.status(404).json({ message: 'Profile not found' });
		res.json(profile);
	} catch (error) {
		res.status(500).json({ message: 'Failed to update profile', error: error.message });
	}
};

exports.deleteProfile = async (req, res) => {
	try {
		const { id } = req.params;
		const profile = await RoommateProfile.findByIdAndDelete(id);
		if (!profile) return res.status(404).json({ message: 'Profile not found' });
		res.json({ message: 'Profile deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Failed to delete profile', error: error.message });
	}
};

exports.uploadPhoto = async (req, res) => {
	try {
		const { id } = req.params;
		if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
		
		const profile = await RoommateProfile.findByIdAndUpdate(id, { profilePhoto: req.file.filename }, { new: true });
		if (!profile) return res.status(404).json({ message: 'Profile not found' });
		
		res.json(profile);
	} catch (error) {
		res.status(500).json({ message: 'Failed to upload photo', error: error.message });
	}
};

const MatchingFactory = require('../factories/matching.factory');

exports.browseRoommates = async (req, res) => {
	try {
		const userId = req.user._id || req.user.id;
		const userProfile = await RoommateProfile.findOne({ userId });
		if (!userProfile) {
			// Return 200 with flag instead of 404/400
			return res.status(200).json({ 
				profiles: [], 
				requiresProfile: true, 
				message: 'Please create your roommate profile first to see matches' 
			});
		}
		
		// Determine which strategy to use (Strategy Pattern)
		const strategyType = req.query.strategy || 'balanced';
		const strategy = MatchingFactory.getStrategy(strategyType);
		console.log(`[Matching] Using strategy: ${strategy.constructor.name}`);

		const candidateProfiles = await RoommateProfile.find({ status: 'published', userId: { $ne: userId } }).populate('userId', 'name email');
		const requests = await MatchRequest.find({ $or: [{ senderId: userId }, { receiverId: userId }], status: { $in: ['pending', 'accepted'] } });

		const requestMap = new Map();
		requests.forEach(r => {
			const otherId = r.senderId.toString() === userId.toString() ? r.receiverId.toString() : r.senderId.toString();
			const existing = requestMap.get(otherId);
			if (!existing || r.status === 'accepted') requestMap.set(otherId, r.status);
		});
		
		const profilesWithScores = candidateProfiles.map(candidate => {
			// Delegate calculation to strategy
			const { total, breakdown } = strategy.calculate(userProfile, candidate);
			
			const otherUserId = candidate.userId._id.toString();
			return { 
				...candidate.toObject(), 
				matchScore: total, 
				matchBreakdown: breakdown, 
				connectionStatus: requestMap.get(otherUserId) || null,
				appliedStrategy: strategyType
			};
		});
		
		profilesWithScores.sort((a, b) => b.matchScore - a.matchScore);
		res.json(profilesWithScores.slice(0, 50));
	} catch (error) {
		res.status(500).json({ message: 'Failed to fetch roommate profiles', error: error.message });
	}
};

