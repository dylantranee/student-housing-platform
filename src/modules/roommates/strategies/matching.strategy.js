
/**
 * Base class for Roommate Matching Strategies.
 * This defines the 'Strategy' interface.
 */
class MatchingStrategy {
    /**
     * Calculate a match score between two profiles.
     * @param {Object} userProfile - The profile of the current user.
     * @param {Object} candidateProfile - The profile being compared.
     * @returns {Object} - { total: number, breakdown: Object }
     */
    calculate(userProfile, candidateProfile) {
        throw new Error('calculate() must be implemented by concrete strategies');
    }

    // Common helper methods shared by strategies
    calculateBudgetOverlap(min1, max1, min2, max2) {
        const overlapMin = Math.max(min1, min2);
        const overlapMax = Math.min(max1, max2);
        const range = (Math.max(max1, max2) - Math.min(min1, min2));
        return overlapMin > overlapMax || range === 0 ? 0 : (overlapMax - overlapMin) / range;
    }

    calculateDateProximity(date1, date2) {
        const daysDiff = Math.abs(new Date(date1) - new Date(date2)) / (1000 * 60 * 60 * 24);
        if (daysDiff <= 14) return 1;
        if (daysDiff <= 30) return 1 - ((daysDiff - 14) / 16) * 0.5;
        if (daysDiff <= 60) return 0.5 - ((daysDiff - 30) / 30) * 0.5;
        return 0;
    }

    calculateSmokingCompatibility(pref1, pref2) {
        const matrix = { 
            'No': { 'No': 1, 'Outside only': 0.7, 'Yes': 0 }, 
            'Outside only': { 'No': 0.7, 'Outside only': 1, 'Yes': 0.8 }, 
            'Yes': { 'No': 0, 'Outside only': 0.8, 'Yes': 1 } 
        };
        return matrix[pref1]?.[pref2] || 0.5;
    }

    calculateNoiseCompatibility(pref1, pref2) {
        const matrix = { 
            'Quiet': { 'Quiet': 1, 'Moderate': 0.7, 'Lively': 0.3 }, 
            'Moderate': { 'Quiet': 0.7, 'Moderate': 1, 'Lively': 0.7 }, 
            'Lively': { 'Quiet': 0.3, 'Moderate': 0.7, 'Lively': 1 } 
        };
        return matrix[pref1]?.[pref2] || 0.5;
    }

    calculateSleepCompatibility(pref1, pref2) {
        const matrix = { 
            'Early Bird': { 'Early Bird': 1, 'Flexible': 0.7, 'Night Owl': 0.2 }, 
            'Flexible': { 'Early Bird': 0.7, 'Flexible': 1, 'Night Owl': 0.7 }, 
            'Night Owl': { 'Early Bird': 0.2, 'Flexible': 0.7, 'Night Owl': 1 } 
        };
        return matrix[pref1]?.[pref2] || 0.5;
    }

    calculateSocialCompatibility(pref1, pref2) {
        const matrix = { 
            'Very social': { 'Very social': 1, 'Moderate': 0.7, 'Prefer privacy': 0.2 }, 
            'Moderate': { 'Very social': 0.7, 'Moderate': 1, 'Prefer privacy': 0.7 }, 
            'Prefer privacy': { 'Very social': 0.2, 'Moderate': 0.7, 'Prefer privacy': 1 } 
        };
        return matrix[pref1]?.[pref2] || 0.5;
    }
}

module.exports = MatchingStrategy;
