import {describe, expect, it, beforeEach, beforeAll, vi} from 'vitest';
import {getStats, updateStats, resetStats} from './statsService';
import {TopicId} from '../types';

class StorageMock implements Storage {
    private store: Record<string, string> = {};

    get length(): number {
        return Object.keys(this.store).length;
    }

    clear(): void {
        this.store = {};
    }

    getItem(key: string): string | null {
        return this.store[key] !== undefined ? this.store[key] : null;
    }

    key(index: number): string | null {
        const keys = Object.keys(this.store);
        return keys[index] !== undefined ? keys[index] : null;
    }

    removeItem(key: string): void {
        delete this.store[key];
    }

    setItem(key: string, value: string): void {
        this.store[key] = String(value);
    }
}

describe('Practice Stats Service', () => {
    beforeAll(() => {
        global.localStorage = new StorageMock();

        if (typeof global.window === 'undefined') {
            (global as any).window = {
                dispatchEvent: vi.fn(),
            };
            (global as any).CustomEvent = class CustomEvent {
                type: string;
                detail: any;
                constructor(type: string, options?: any) {
                    this.type = type;
                    this.detail = options?.detail;
                }
            };
        }
    });

    beforeEach(() => {
        localStorage.clear();
        if (global.window && (global.window.dispatchEvent as any).mockClear) {
            (global.window.dispatchEvent as any).mockClear();
        }
    });

    it('returns default stats on initial retrieval', () => {
        const stats = getStats();
        expect(stats.streak).toBe(0);
        expect(stats.bestStreak).toBe(0);
        expect(stats.mastery[TopicId.NAIVE_DEF]).toEqual({correct: 0, total: 0});
        expect(stats.mastery[TopicId.SAMPLING_TABLE]).toEqual({correct: 0, total: 0});
    });

    it('updates topic stats and streak correctly on success', () => {
        // 1st correct answer
        let stats = updateStats(TopicId.NAIVE_DEF, true);
        expect(stats.streak).toBe(1);
        expect(stats.bestStreak).toBe(1);
        expect(stats.mastery[TopicId.NAIVE_DEF]).toEqual({correct: 1, total: 1});

        // 2nd correct answer on a different topic
        stats = updateStats(TopicId.SAMPLING_TABLE, true);
        expect(stats.streak).toBe(2);
        expect(stats.bestStreak).toBe(2);
        expect(stats.mastery[TopicId.SAMPLING_TABLE]).toEqual({correct: 1, total: 1});
        expect(stats.mastery[TopicId.NAIVE_DEF]).toEqual({correct: 1, total: 1});
    });

    it('resets streak but preserves masteries and updates total on failure', () => {
        // Correct first, then incorrect
        updateStats(TopicId.NAIVE_DEF, true);
        const stats = updateStats(TopicId.NAIVE_DEF, false);

        expect(stats.streak).toBe(0);
        expect(stats.bestStreak).toBe(1); // Preserves best streak
        expect(stats.mastery[TopicId.NAIVE_DEF]).toEqual({correct: 1, total: 2});
    });

    it('resets all progress to defaults via resetStats', () => {
        updateStats(TopicId.NAIVE_DEF, true);
        updateStats(TopicId.SAMPLING_TABLE, true);

        const stats = resetStats();
        expect(stats.streak).toBe(0);
        expect(stats.bestStreak).toBe(0);
        expect(stats.mastery[TopicId.NAIVE_DEF]).toEqual({correct: 0, total: 0});
        expect(stats.mastery[TopicId.SAMPLING_TABLE]).toEqual({correct: 0, total: 0});
        expect(window.dispatchEvent).toHaveBeenCalled();
    });
});
