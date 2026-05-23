import {TopicId} from '../types';

export interface TopicStats {
    correct: number;
    total: number;
}

export interface ProbalityStats {
    streak: number;
    bestStreak: number;
    mastery: Record<TopicId, TopicStats>;
}

const STORAGE_KEY = 'probality_practice_stats';

const DEFAULT_TOPIC_STATS: TopicStats = {correct: 0, total: 0};

const DEFAULT_STATS: ProbalityStats = {
    streak: 0,
    bestStreak: 0,
    mastery: {
        [TopicId.NAIVE_DEF]: {...DEFAULT_TOPIC_STATS},
        [TopicId.MULTIPLICATION]: {...DEFAULT_TOPIC_STATS},
        [TopicId.SAMPLING_TABLE]: {...DEFAULT_TOPIC_STATS},
        [TopicId.STORY_PROOFS]: {...DEFAULT_TOPIC_STATS},
        [TopicId.COMPLEMENT]: {...DEFAULT_TOPIC_STATS},
        [TopicId.INCLUSION_EXCLUSION]: {...DEFAULT_TOPIC_STATS},
    },
};

export const getStats = (): ProbalityStats => {
    if (typeof window === 'undefined') return JSON.parse(JSON.stringify(DEFAULT_STATS));
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return JSON.parse(JSON.stringify(DEFAULT_STATS));
        
        const parsed = JSON.parse(stored) as Partial<ProbalityStats>;
        
        // Merge with defaults in case structure updates or keys are missing
        const mergedMastery = {
            ...JSON.parse(JSON.stringify(DEFAULT_STATS.mastery)),
            ...(parsed.mastery || {}),
        };

        return {
            streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
            bestStreak: typeof parsed.bestStreak === 'number' ? parsed.bestStreak : 0,
            mastery: mergedMastery as Record<TopicId, TopicStats>,
        };
    } catch (e) {
        console.error('Error reading stats from localStorage:', e);
        return JSON.parse(JSON.stringify(DEFAULT_STATS));
    }
};

export const updateStats = (topicId: TopicId, isCorrect: boolean): ProbalityStats => {
    if (typeof window === 'undefined') return JSON.parse(JSON.stringify(DEFAULT_STATS));
    const current = getStats();

    // 1. Update topic stats
    const topicStats = current.mastery[topicId] || {...DEFAULT_TOPIC_STATS};
    topicStats.total += 1;
    if (isCorrect) {
        topicStats.correct += 1;
    }
    current.mastery[topicId] = topicStats;

    // 2. Update streaks
    if (isCorrect) {
        current.streak += 1;
        if (current.streak > current.bestStreak) {
            current.bestStreak = current.streak;
        }
    } else {
        current.streak = 0;
    }

    // 3. Save to localStorage
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
        console.error('Error saving stats to localStorage:', e);
    }

    // 4. Dispatch event to notify listeners (components)
    window.dispatchEvent(new CustomEvent('probality_stats_updated', {detail: current}));

    return current;
};

export const resetStats = (): ProbalityStats => {
    if (typeof window === 'undefined') return JSON.parse(JSON.stringify(DEFAULT_STATS));
    const clean = JSON.parse(JSON.stringify(DEFAULT_STATS));
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    } catch (e) {
        console.error('Error resetting stats in localStorage:', e);
    }
    window.dispatchEvent(new CustomEvent('probality_stats_updated', {detail: clean}));
    return clean;
};
