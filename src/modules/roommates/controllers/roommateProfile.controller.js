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
		const profile = await RoommateProfile.findOne({ userId });
		if (!profile) return res.status(404).json({ message: 'Profile not found' });
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

exports.browseRoommates = async (req, res) => {
	try {
		const userId = req.user._id || req.user.id;
		const userProfile = await RoommateProfile.findOne({ userId });
		if (!userProfile) {
			return res.status(404).json({ message: 'Please create your roommate profile first to see matches', requiresProfile: true });
		}
		const candidateProfiles = await RoommateProfile.find({ status: 'published', userId: { $ne: userId } }).populate('userId', 'name email');
		const requests = await MatchRequest.find({ $or: [{ senderId: userId }, { receiverId: userId }], status: { $in: ['pending', 'accepted'] } });

		const requestMap = new Map();
		requests.forEach(r => {
			const otherId = r.senderId.toString() === userId.toString() ? r.receiverId.toString() : r.senderId.toString();
			const existing = requestMap.get(otherId);
			if (!existing || r.status === 'accepted') requestMap.set(otherId, r.status);
		});
		
		const profilesWithScores = candidateProfiles.map(candidate => {
			const { total, breakdown } = calculateMatchScore(userProfile, candidate);
			const otherUserId = candidate.userId._id.toString();
			return { ...candidate.toObject(), matchScore: total, matchBreakdown: breakdown, connectionStatus: requestMap.get(otherUserId) || null };
		});
		
		profilesWithScores.sort((a, b) => b.matchScore - a.matchScore);
		res.json(profilesWithScores.slice(0, 50));
	} catch (error) {
		res.status(500).json({ message: 'Failed to fetch roommate profiles', error: error.message });
	}
};

function calculateMatchScore(userProfile, candidateProfile) {
	const scores = { lifestyle: 0, budget: 0, schedule: 0, social: 0, cleanliness: 0 };
	let uniScore = 0;
	if (userProfile.preferredUniversities?.length && candidateProfile.university) {
		uniScore = userProfile.preferredUniversities.includes(candidateProfile.university) ? 1 : 0;
	} else if (userProfile.university && candidateProfile.university && userProfile.university === candidateProfile.university) {
		uniScore = 1;
	}
	const smokingScore = userProfile.smoking && candidateProfile.smoking ? calculateSmokingCompatibility(userProfile.smoking, candidateProfile.smoking) : 0.5;
	const noiseScore = userProfile.noiseTolerance && candidateProfile.noiseTolerance ? calculateNoiseCompatibility(userProfile.noiseTolerance, candidateProfile.noiseTolerance) : 0.5;
	scores.lifestyle = (uniScore * 10) + (smokingScore * 10) + (noiseScore * 10);

	if (userProfile.budgetMin != null && userProfile.budgetMax != null && candidateProfile.budgetMin != null && candidateProfile.budgetMax != null) {
		scores.budget = calculateBudgetOverlap(userProfile.budgetMin, userProfile.budgetMax, candidateProfile.budgetMin, candidateProfile.budgetMax) * 20;
	}
	const sleepScore = userProfile.sleepSchedule && candidateProfile.sleepSchedule ? calculateSleepCompatibility(userProfile.sleepSchedule, candidateProfile.sleepSchedule) : 0.5;
	const dateScore = userProfile.moveInDate && candidateProfile.moveInDate ? calculateDateProximity(userProfile.moveInDate, candidateProfile.moveInDate) : 0.5;
	scores.schedule = (sleepScore * 10) + (dateScore * 10);
	scores.social = (userProfile.socialPreference && candidateProfile.socialPreference ? calculateSocialCompatibility(userProfile.socialPreference, candidateProfile.socialPreference) : 0.5) * 15;

	if (userProfile.cleanliness && candidateProfile.cleanliness) {
		const diff = Math.abs(userProfile.cleanliness - candidateProfile.cleanliness);
		scores.cleanliness = Math.max(0, 1 - diff / 2) * 15;
	}
	const total = Math.round(scores.lifestyle + scores.social + scores.budget + scores.schedule + scores.cleanliness);
	return { total, breakdown: { lifestyle: Math.round(scores.lifestyle), budget: Math.round(scores.budget), schedule: Math.round(scores.schedule), social: Math.round(scores.social), cleanliness: Math.round(scores.cleanliness) } };
}

function calculateBudgetOverlap(min1, max1, min2, max2) {
	const overlapMin = Math.max(min1, min2);
	const overlapMax = Math.min(max1, max2);
	return overlapMin > overlapMax ? 0 : (overlapMax - overlapMin) / (Math.max(max1, max2) - Math.min(min1, min2));
}

function calculateDateProximity(date1, date2) {
	const daysDiff = Math.abs(new Date(date1) - new Date(date2)) / (1000 * 60 * 60 * 24);
	if (daysDiff <= 14) return 1;
	if (daysDiff <= 30) return 1 - ((daysDiff - 14) / 16) * 0.5;
	if (daysDiff <= 60) return 0.5 - ((daysDiff - 30) / 30) * 0.5;
	return 0;
}

function calculateSmokingCompatibility(pref1, pref2) {
	const matrix = { 'No': { 'No': 1, 'Outside only': 0.7, 'Yes': 0 }, 'Outside only': { 'No': 0.7, 'Outside only': 1, 'Yes': 0.8 }, 'Yes': { 'No': 0, 'Outside only': 0.8, 'Yes': 1 } };
	return matrix[pref1]?.[pref2] || 0.5;
}

function calculateNoiseCompatibility(pref1, pref2) {
	const matrix = { 'Quiet': { 'Quiet': 1, 'Moderate': 0.7, 'Lively': 0.3 }, 'Moderate': { 'Quiet': 0.7, 'Moderate': 1, 'Lively': 0.7 }, 'Lively': { 'Quiet': 0.3, 'Moderate': 0.7, 'Lively': 1 } };
	return matrix[pref1]?.[pref2] || 0.5;
}

function calculateSleepCompatibility(pref1, pref2) {
	const matrix = { 'Early Bird': { 'Early Bird': 1, 'Flexible': 0.7, 'Night Owl': 0.2 }, 'Flexible': { 'Early Bird': 0.7, 'Flexible': 1, 'Night Owl': 0.7 }, 'Night Owl': { 'Early Bird': 0.2, 'Flexible': 0.7, 'Night Owl': 1 } };
	return matrix[pref1]?.[pref2] || 0.5;
}

function calculateSocialCompatibility(pref1, pref2) {
	const matrix = { 'Very social': { 'Very social': 1, 'Moderate': 0.7, 'Prefer privacy': 0.2 }, 'Moderate': { 'Very social': 0.7, 'Moderate': 1, 'Prefer privacy': 0.7 }, 'Prefer privacy': { 'Very social': 0.2, 'Moderate': 0.7, 'Prefer privacy': 1 } };
	return matrix[pref1]?.[pref2] || 0.5;
}
