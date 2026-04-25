import {describe, expect, it} from 'vitest';
import {splitMathTextSegments} from './mathTextSegments';

describe('splitMathTextSegments', () => {
    it('returns no parts for empty text', () => {
        expect(splitMathTextSegments('')).toEqual([]);
    });

    it('returns plain text as a single segment', () => {
        expect(splitMathTextSegments('Counting is about structure.')).toEqual([
            'Counting is about structure.',
        ]);
    });

    it('splits mixed prose and inline math', () => {
        expect(splitMathTextSegments('Choose $k$ items from $n$ distinct objects.')).toEqual([
            'Choose ',
            '$k$',
            ' items from ',
            '$n$',
            ' distinct objects.',
        ]);
    });

    it('splits block math segments', () => {
        expect(splitMathTextSegments('Use $$\\binom{n}{k}$$ when order does not matter.')).toEqual([
            'Use ',
            '$$\\binom{n}{k}$$',
            ' when order does not matter.',
        ]);
    });

    it('keeps unmatched dollar signs in plain text', () => {
        expect(splitMathTextSegments('The price is $5 today.')).toEqual([
            'The price is $5 today.',
        ]);
    });
});
