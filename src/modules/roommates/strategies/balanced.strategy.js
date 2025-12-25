
const MatchingStrategy = require('./matching.strategy');

/**
 * Balanced Strategy: Distributes weight evenly across all categories.
 * This is the original matching logic.
 */
class BalancedStrategy extends MatchingStrategy {
    calculate(userProfile, candidateProfile) {
        const scores = { lifestyle: 0, budget: 0, schedule: 0, social: 0, cleanliness: 0 };
        
        // Uni & Lifestyle
        let uniScore = 0;
        if (userProfile.preferredUniversities?.length && candidateProfile.university) {
            uniScore = userProfile.preferredUniversities.includes(candidateProfile.university) ? 1 : 0;
        } else if (userProfile.university && candidateProfile.university && userProfile.university === candidateProfile.university) {
            uniScore = 1;
        }
        const smokingScore = this.calculateSmokingCompatibility(userProfile.smoking, candidateProfile.smoking);
        const noiseScore = this.calculateNoiseCompatibility(userProfile.noiseTolerance, candidateProfile.noiseTolerance);
        scores.lifestyle = (uniScore * 10) + (smokingScore * 10) + (noiseScore * 10);

        // Budget
        if (userProfile.budgetMin != null && userProfile.budgetMax != null && candidateProfile.budgetMin != null && candidateProfile.budgetMax != null) {
            scores.budget = this.calculateBudgetOverlap(userProfile.budgetMin, userProfile.budgetMax, candidateProfile.budgetMin, candidateProfile.budgetMax) * 20;
        }

        // Schedule
        const sleepScore = this.calculateSleepCompatibility(userProfile.sleepSchedule, candidateProfile.sleepSchedule);
        const dateScore = this.calculateDateProximity(userProfile.moveInDate, candidateProfile.moveInDate);
        scores.schedule = (sleepScore * 10) + (dateScore * 10);

        // Social
        scores.social = this.calculateSocialCompatibility(userProfile.socialPreference, candidateProfile.socialPreference) * 15;

        // Cleanliness
        if (userProfile.cleanliness && candidateProfile.cleanliness) {
            const diff = Math.abs(userProfile.cleanliness - candidateProfile.cleanliness);
            scores.cleanliness = Math.max(0, 1 - diff / 2) * 15;
        }

        const total = Math.round(scores.lifestyle + scores.social + scores.budget + scores.schedule + scores.cleanliness);
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
}

module.exports = BalancedStrategy;
