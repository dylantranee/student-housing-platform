
const BalancedStrategy = require('../strategies/balanced.strategy');
const UniversityStrategy = require('../strategies/university.strategy');
const LifestyleStrategy = require('../strategies/lifestyle.strategy');

/**
 * Factory for creating Matching Strategies.
 */
class MatchingFactory {
    /**
     * Get a matching strategy based on type.
     * @param {string} type - 'balanced', 'university', or 'lifestyle' (default: 'balanced')
     * @returns {MatchingStrategy}
     */
    static getStrategy(type) {
        const t = (type || 'balanced').toLowerCase();
        
        switch (t) {
            case 'university':
                return new UniversityStrategy();
            case 'lifestyle':
                return new LifestyleStrategy();
            case 'balanced':
            default:
                return new BalancedStrategy();
        }
    }
}

module.exports = MatchingFactory;
