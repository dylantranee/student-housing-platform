
const MatchingStrategy = require('./matching.strategy');

/**
 * Lifestyle Strategy: Prioritizes daily habits like smoking, noise, and cleanliness.
 */
class LifestyleStrategy extends MatchingStrategy {
    calculate(userProfile, candidateProfile) {
        const scores = { lifestyle: 0, budget: 0, schedule: 0, social: 0, cleanliness: 0 };
        
        // Lifestyle factors are heavily weighted
        const smokingScore = this.calculateSmokingCompatibility(userProfile.smoking, candidateProfile.smoking);
        const noiseScore = this.calculateNoiseCompatibility(userProfile.noiseTolerance, candidateProfile.noiseTolerance);
        scores.lifestyle = (smokingScore * 15) + (noiseScore * 15);

        // Cleanliness is worth 25 points
        if (userProfile.cleanliness && candidateProfile.cleanliness) {
            const diff = Math.abs(userProfile.cleanliness - candidateProfile.cleanliness);
            scores.cleanliness = Math.max(0, 1 - diff / 2) * 25;
        }

        // Budget is worth 15 points
        if (userProfile.budgetMin != null && userProfile.budgetMax != null && candidateProfile.budgetMin != null && candidateProfile.budgetMax != null) {
            scores.budget = this.calculateBudgetOverlap(userProfile.budgetMin, userProfile.budgetMax, candidateProfile.budgetMin, candidateProfile.budgetMax) * 15;
        }

        // Social and Schedule complement the lifestyle
        const sleepScore = this.calculateSleepCompatibility(userProfile.sleepSchedule, candidateProfile.sleepSchedule);
        scores.schedule = (sleepScore * 15);

        scores.social = this.calculateSocialCompatibility(userProfile.socialPreference, candidateProfile.socialPreference) * 15;

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

module.exports = LifestyleStrategy;
