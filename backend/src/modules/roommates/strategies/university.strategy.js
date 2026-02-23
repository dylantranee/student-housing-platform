
const MatchingStrategy = require('./matching.strategy');

/**
 * University Strategy: Prioritizes university compatibility (40% of score).
 */
class UniversityStrategy extends MatchingStrategy {
    calculate(userProfile, candidateProfile) {
        const scores = { lifestyle: 0, budget: 0, schedule: 0, social: 0, cleanliness: 0 };
        
        let uniScore = 0;
        if (userProfile.preferredUniversities?.length && candidateProfile.university) {
            uniScore = userProfile.preferredUniversities.includes(candidateProfile.university) ? 1 : 0;
        } else if (userProfile.university && candidateProfile.university && userProfile.university === candidateProfile.university) {
            uniScore = 1;
        }

        // University is worth 40 points in this strategy
        scores.lifestyle = (uniScore * 40);

        // Budget is worth 20 points
        if (userProfile.budgetMin != null && userProfile.budgetMax != null && candidateProfile.budgetMin != null && candidateProfile.budgetMax != null) {
            scores.budget = this.calculateBudgetOverlap(userProfile.budgetMin, userProfile.budgetMax, candidateProfile.budgetMin, candidateProfile.budgetMax) * 20;
        }

        // Other factors are scaled down
        const sleepScore = this.calculateSleepCompatibility(userProfile.sleepSchedule, candidateProfile.sleepSchedule);
        const dateScore = this.calculateDateProximity(userProfile.moveInDate, candidateProfile.moveInDate);
        scores.schedule = (sleepScore * 7) + (dateScore * 7);

        scores.social = this.calculateSocialCompatibility(userProfile.socialPreference, candidateProfile.socialPreference) * 10;

        if (userProfile.cleanliness && candidateProfile.cleanliness) {
            const diff = Math.abs(userProfile.cleanliness - candidateProfile.cleanliness);
            scores.cleanliness = Math.max(0, 1 - diff / 2) * 16;
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

module.exports = UniversityStrategy;
