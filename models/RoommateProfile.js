const mongoose = require('mongoose');

const RoommateProfileSchema = new mongoose.Schema({
	userId: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User', 
		required: true, 
		unique: true 
	},
	profilePhoto: { type: String },
	bio: { 
		type: String, 
		maxlength: 500 
	},
	studyProgram: { type: String },
	university: { type: String },
	moveInDate: { type: Date },
	budgetMin: { 
		type: Number,
		min: 0
	},
	budgetMax: { 
		type: Number,
		min: 0
	},
	// Lifestyle Preferences
	sleepSchedule: { 
		type: String, 
		enum: ['Early Bird', 'Night Owl', 'Flexible'] 
	},
	cleanliness: { 
		type: Number, 
		min: 1, 
		max: 5  // Support both old (1-5) and new (1-3) data
	},
	noiseTolerance: { 
		type: String, 
		enum: ['Quiet', 'Moderate', 'Lively'] 
	},
	smoking: { 
		type: String, 
		enum: ['Yes', 'No', 'Outside only'] 
	},
	socialPreference: { 
		type: String, 
		enum: ['Very social', 'Moderate', 'Prefer privacy'] 
	},
	studyHabits: { 
		type: String, 
		enum: ['Study at home', 'Library', 'Both'] 
	},
	// Roommate Requirements
	preferredUniversities: [{ 
		type: String 
	}],
	roommatesWanted: { 
		type: Number, 
		min: 1, 
		max: 5,
		default: 1
	},
	roomType: { 
		type: String, 
		enum: ['Private', 'Shared', 'Any'],
		default: 'Any'
	},
	leaseLength: { 
		type: String, 
		enum: ['3 months', '6 months', '1 year', 'Flexible'],
		default: 'Flexible'
	},
	status: { 
		type: String, 
		enum: ['draft', 'published', 'paused'], 
		default: 'draft' 
	},
}, { timestamps: true });

// Virtual field to check if profile is complete
RoommateProfileSchema.virtual('isComplete').get(function() {
	return !!(
		this.bio && 
		this.studyProgram && 
		this.university && 
		this.moveInDate && 
		this.budgetMin !== undefined && 
		this.budgetMax !== undefined
	);
});

// Ensure virtuals are included when converting to JSON
RoommateProfileSchema.set('toJSON', { virtuals: true });
RoommateProfileSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('RoommateProfile', RoommateProfileSchema);
