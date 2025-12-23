const RoommateProfile = require('../models/RoommateProfile');
const MatchRequest = require('../models/MatchRequest');

// Create new roommate profile
exports.createProfile = async (req, res) => {
	try {
		const { userId } = req.body;
		
		// Check if profile already exists for this user
		const existingProfile = await RoommateProfile.findOne({ userId });
		if (existingProfile) {
			return res.status(400).json({ message: 'Profile already exists for this user' });
		}

		const profile = new RoommateProfile(req.body);
		await profile.save();
		
		res.status(201).json(profile);
	} catch (error) {
		console.error('Error creating roommate profile:', error);
		if (error.name === 'ValidationError') {
			const messages = Object.values(error.errors).map(val => val.message);
			return res.status(400).json({ message: 'Validation failed', errors: messages });
		}
		res.status(500).json({ message: 'Failed to create profile', error: error.message });
	}
};

// Get roommate profile by user ID
exports.getProfile = async (req, res) => {
	try {
		const { userId } = req.params;
		
		const profile = await RoommateProfile.findOne({ userId });
		
		if (!profile) {
			return res.status(404).json({ message: 'Profile not found' });
		}
		
		res.json(profile);
	} catch (error) {
		console.error('Error fetching roommate profile:', error);
		res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
	}
};

// Update roommate profile
exports.updateProfile = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;
		
		// Don't allow changing userId
		delete updates.userId;
		
		const profile = await RoommateProfile.findByIdAndUpdate(
			id,
			updates,
			{ new: true, runValidators: true }
		);
		
		if (!profile) {
			return res.status(404).json({ message: 'Profile not found' });
		}
		
		res.json(profile);
	} catch (error) {
		console.error('Error updating roommate profile:', error);
		if (error.name === 'ValidationError') {
			const messages = Object.values(error.errors).map(val => val.message);
			return res.status(400).json({ message: 'Validation failed', errors: messages });
		}
		res.status(500).json({ message: 'Failed to update profile', error: error.message });
	}
};

// Delete roommate profile
exports.deleteProfile = async (req, res) => {
	try {
		const { id } = req.params;
		
		const profile = await RoommateProfile.findByIdAndDelete(id);
		
		if (!profile) {
			return res.status(404).json({ message: 'Profile not found' });
		}
		
		res.json({ message: 'Profile deleted successfully' });
	} catch (error) {
		console.error('Error deleting roommate profile:', error);
		res.status(500).json({ message: 'Failed to delete profile', error: error.message });
	}
};

// Upload profile photo
exports.uploadPhoto = async (req, res) => {
	try {
		const { id } = req.params;
		
		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded' });
		}
		
		const profile = await RoommateProfile.findByIdAndUpdate(
			id,
			{ profilePhoto: req.file.filename },
			{ new: true }
		);
		
		if (!profile) {
			return res.status(404).json({ message: 'Profile not found' });
		}
		
		res.json(profile);
	} catch (error) {
		console.error('Error uploading photo:', error);
		res.status(500).json({ message: 'Failed to upload photo', error: error.message });
	}
};

// Browse potential roommates with smart matching
exports.browseRoommates = async (req, res) => {
	try {
		const userId = req.user._id || req.user.id;
		
		// Get the user's own profile to use for matching
		const userProfile = await RoommateProfile.findOne({ userId });
		
		if (!userProfile) {
			return res.status(404).json({ 
				message: 'Please create your roommate profile first to see matches',
				requiresProfile: true 
			});
		}
		
		// Get all published profiles except user's own
		const candidateProfiles = await RoommateProfile.find({
			status: 'published',
			userId: { $ne: userId }
		}).populate('userId', 'name email');

		// Get all pending/accepted requests involving current user
		const requests = await MatchRequest.find({
			$or: [
				{ senderId: userId },
				{ receiverId: userId }
			],
			status: { $in: ['pending', 'accepted'] }
		});

		const requestMap = new Map();
		requests.forEach(r => {
			const otherId = r.senderId.toString() === userId.toString() 
				? r.receiverId.toString() 
				: r.senderId.toString();
			
			// Map the other user's ID to the status
			const existing = requestMap.get(otherId);
			if (!existing || r.status === 'accepted') {
				requestMap.set(otherId, r.status);
			}
		});
		
		// Calculate match score for each profile
		const profilesWithScores = candidateProfiles.map(candidate => {
			const { total, breakdown } = calculateMatchScore(userProfile, candidate);
			const otherUserId = candidate.userId._id.toString();

			return {
				...candidate.toObject(),
				matchScore: total,
				matchBreakdown: breakdown,
				connectionStatus: requestMap.get(otherUserId) || null
			};
		});
		
		// Sort by match score (highest first)
		profilesWithScores.sort((a, b) => b.matchScore - a.matchScore);
		
		// Return top 50 matches
		res.json(profilesWithScores.slice(0, 50));
	} catch (error) {
		console.error('Error browsing roommate profiles:', error);
		res.status(500).json({ message: 'Failed to fetch roommate profiles', error: error.message });
	}
};

// Helper function to calculate match score between two profiles
function calculateMatchScore(userProfile, candidateProfile) {
	const scores = {
		lifestyle: 0, // Noise (10%), Smoking (10%), Uni (10%)
		budget: 0,    // 20%
		schedule: 0,  // Sleep (10%), Move-in (10%)
		social: 0,    // 15%
		cleanliness: 0 // 15%
	};
	
	// 1. Lifestyle Breakdown (30%)
	// University (10%)
	let uniScore = 0;
	if (userProfile.preferredUniversities?.length && candidateProfile.university) {
		uniScore = userProfile.preferredUniversities.includes(candidateProfile.university) ? 1 : 0;
	} else if (userProfile.university && candidateProfile.university && userProfile.university === candidateProfile.university) {
		uniScore = 1;
	}
	
	// Smoking (10%)
	const smokingScore = userProfile.smoking && candidateProfile.smoking ? 
		calculateSmokingCompatibility(userProfile.smoking, candidateProfile.smoking) : 0.5;
	
	// Noise (10%)
	const noiseScore = userProfile.noiseTolerance && candidateProfile.noiseTolerance ?
		calculateNoiseCompatibility(userProfile.noiseTolerance, candidateProfile.noiseTolerance) : 0.5;

	scores.lifestyle = (uniScore * 10) + (smokingScore * 10) + (noiseScore * 10);

	// 2. Budget (20%)
	if (userProfile.budgetMin != null && userProfile.budgetMax != null &&
	    candidateProfile.budgetMin != null && candidateProfile.budgetMax != null) {
		const overlapScore = calculateBudgetOverlap(
			userProfile.budgetMin, userProfile.budgetMax,
			candidateProfile.budgetMin, candidateProfile.budgetMax
		);
		scores.budget = overlapScore * 20;
	}

	// 3. Schedule (20%)
	// Sleep Schedule (10%)
	const sleepScore = userProfile.sleepSchedule && candidateProfile.sleepSchedule ?
		calculateSleepCompatibility(userProfile.sleepSchedule, candidateProfile.sleepSchedule) : 0.5;
	
	// Move-in (10%)
	const dateScore = userProfile.moveInDate && candidateProfile.moveInDate ?
		calculateDateProximity(userProfile.moveInDate, candidateProfile.moveInDate) : 0.5;
	
	scores.schedule = (sleepScore * 10) + (dateScore * 10);

	// 4. Social (15%)
	const socialScore = userProfile.socialPreference && candidateProfile.socialPreference ?
		calculateSocialCompatibility(userProfile.socialPreference, candidateProfile.socialPreference) : 0.5;
	scores.social = socialScore * 15;

	// 5. Cleanliness (15%)
	if (userProfile.cleanliness && candidateProfile.cleanliness) {
		const diff = Math.abs(userProfile.cleanliness - candidateProfile.cleanliness);
		const cleanlinessMatch = Math.max(0, 1 - diff / 2); // Assuming 1-3 scale now
		scores.cleanliness = cleanlinessMatch * 15;
	}

	const total = Math.round(
		scores.lifestyle + scores.budget + scores.schedule + scores.social + scores.cleanliness
	);

	return {
		total,
		breakdown: {
			lifestyle: Math.round(scores.lifestyle),
			budget: Math.round(scores.budget),
			schedule: Math.round(scores.schedule),
			social: Math.round(scores.social),
			cleanliness: Math.round(scores.cleanliness)
		}
	};
}

// Calculate budget overlap (returns 0-1)
function calculateBudgetOverlap(min1, max1, min2, max2) {
	const overlapMin = Math.max(min1, min2);
	const overlapMax = Math.min(max1, max2);
	
	if (overlapMin > overlapMax) {
		return 0; // No overlap
	}
	
	const overlapRange = overlapMax - overlapMin;
	const totalRange = Math.max(max1, max2) - Math.min(min1, min2);
	
	return overlapRange / totalRange;
}

// Calculate date proximity (returns 0-1)
function calculateDateProximity(date1, date2) {
	const daysDiff = Math.abs(new Date(date1) - new Date(date2)) / (1000 * 60 * 60 * 24);
	
	if (daysDiff <= 14) {
		return 1; // Within 2 weeks = perfect match
	} else if (daysDiff <= 30) {
		return 1 - ((daysDiff - 14) / 16) * 0.5; // Linear decay to 0.5
	} else if (daysDiff <= 60) {
		return 0.5 - ((daysDiff - 30) / 30) * 0.5; // Linear decay to 0
	} else {
		return 0; // More than 2 months = no match
	}
}

// Calculate lifestyle compatibility (returns 0-1)
function calculateLifestyleMatch(profile1, profile2) {
	let matches = 0;
	let total = 0;
	
	// Cleanliness level (1-5 or 1-3)
	if (profile1.cleanliness && profile2.cleanliness) {
		total++;
		const diff = Math.abs(profile1.cleanliness - profile2.cleanliness);
		const maxPossibleDiff = 4; // Assuming 1-5 scale
		matches += Math.max(0, 1 - diff / maxPossibleDiff);
	}
	
	// Noise tolerance
	if (profile1.noiseTolerance && profile2.noiseTolerance) {
		total++;
		const compatibility = {
			'Quiet': { 'Quiet': 1, 'Moderate': 0.7, 'Lively': 0.3 },
			'Moderate': { 'Quiet': 0.7, 'Moderate': 1, 'Lively': 0.7 },
			'Lively': { 'Quiet': 0.3, 'Moderate': 0.7, 'Lively': 1 }
		};
		matches += compatibility[profile1.noiseTolerance]?.[profile2.noiseTolerance] || 0.5;
	}
	
	// Sleep schedule compatibility
	if (profile1.sleepSchedule && profile2.sleepSchedule) {
		total++;
		const scheduleCompatibility = {
			'Early Bird': { 'Early Bird': 1, 'Flexible': 0.7, 'Night Owl': 0.2 },
			'Flexible': { 'Early Bird': 0.7, 'Flexible': 1, 'Night Owl': 0.7 },
			'Night Owl': { 'Early Bird': 0.2, 'Flexible': 0.7, 'Night Owl': 1 }
		};
		matches += scheduleCompatibility[profile1.sleepSchedule]?.[profile2.sleepSchedule] || 0.5;
	}

	// Social preference
	if (profile1.socialPreference && profile2.socialPreference) {
		total++;
		const socialCompatibility = {
			'Very social': { 'Very social': 1, 'Moderate': 0.7, 'Prefer privacy': 0.2 },
			'Moderate': { 'Very social': 0.7, 'Moderate': 1, 'Prefer privacy': 0.7 },
			'Prefer privacy': { 'Very social': 0.2, 'Moderate': 0.7, 'Prefer privacy': 1 }
		};
		matches += socialCompatibility[profile1.socialPreference]?.[profile2.socialPreference] || 0.5;
	}
	
	return total > 0 ? matches / total : 0;
}

// Calculate smoking compatibility (returns 0-1)
function calculateSmokingCompatibility(pref1, pref2) {
	const compatibilityMatrix = {
		'No': { 'No': 1, 'Outside only': 0.7, 'Yes': 0 },
		'Outside only': { 'No': 0.7, 'Outside only': 1, 'Yes': 0.8 },
		'Yes': { 'No': 0, 'Outside only': 0.8, 'Yes': 1 }
	};
	
	return compatibilityMatrix[pref1]?.[pref2] || 0.5;
}

// Calculate noise compatibility (returns 0-1)
function calculateNoiseCompatibility(pref1, pref2) {
	const compatibility = {
		'Quiet': { 'Quiet': 1, 'Moderate': 0.7, 'Lively': 0.3 },
		'Moderate': { 'Quiet': 0.7, 'Moderate': 1, 'Lively': 0.7 },
		'Lively': { 'Quiet': 0.3, 'Moderate': 0.7, 'Lively': 1 }
	};
	return compatibility[pref1]?.[pref2] || 0.5;
}

// Calculate sleep compatibility (returns 0-1)
function calculateSleepCompatibility(pref1, pref2) {
	const scheduleCompatibility = {
		'Early Bird': { 'Early Bird': 1, 'Flexible': 0.7, 'Night Owl': 0.2 },
		'Flexible': { 'Early Bird': 0.7, 'Flexible': 1, 'Night Owl': 0.7 },
		'Night Owl': { 'Early Bird': 0.2, 'Flexible': 0.7, 'Night Owl': 1 }
	};
	return scheduleCompatibility[pref1]?.[pref2] || 0.5;
}

// Calculate social compatibility (returns 0-1)
function calculateSocialCompatibility(pref1, pref2) {
	const socialCompatibility = {
		'Very social': { 'Very social': 1, 'Moderate': 0.7, 'Prefer privacy': 0.2 },
		'Moderate': { 'Very social': 0.7, 'Moderate': 1, 'Prefer privacy': 0.7 },
		'Prefer privacy': { 'Very social': 0.2, 'Moderate': 0.7, 'Prefer privacy': 1 }
	};
	return socialCompatibility[pref1]?.[pref2] || 0.5;
}
