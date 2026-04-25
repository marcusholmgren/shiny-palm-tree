import {describe, expect, it} from 'vitest';
import {normalizeMathOption, normalizeMathText, normalizeQuizQuestion} from './llmFormatting';

describe('normalizeMathText', () => {
    it('keeps standard dollar-delimited LaTeX unchanged', () => {
        expect(normalizeMathText('Use $\\binom{4}{2}$ here.')).toBe('Use $\\binom{4}{2}$ here.');
    });

    it('converts parenthesis LaTeX delimiters to dollar delimiters', () => {
        expect(normalizeMathText('Use \\(\\binom{4}{2}\\) here.')).toBe('Use $\\binom{4}{2}$ here.');
    });

    it('converts bracket LaTeX delimiters to block delimiters', () => {
        expect(normalizeMathText('Compute \\[P(A)=\\frac{|A|}{|S|}\\] carefully.')).toBe('Compute $$P(A)=\\frac{|A|}{|S|}$$ carefully.');
    });

    it('wraps bare latex fragments embedded in prose', () => {
        expect(
            normalizeMathText('The total number of ways to choose 3 members from 10 is \\binom{10}{3} = 120$.'),
        ).toBe('The total number of ways to choose 3 members from 10 is $\\binom{10}{3} = 120$.');
    });
});

describe('normalizeQuizQuestion', () => {
    it('normalizes all quiz text fields', () => {
        expect(
            normalizeQuizQuestion({
                question: 'What is \\(P(A)\\)?',
                options: ['\\(1/2\\)', '\\(1/3\\)', '\\(1/4\\)', '\\(1\\)'],
                correctIndex: 0,
                explanation: 'Use \\[P(A)=\\frac{|A|}{|S|}\\].',
            }),
        ).toEqual({
            question: 'What is $P(A)$?',
            options: ['$1/2$', '$1/3$', '$1/4$', '$1$'],
            correctIndex: 0,
            explanation: 'Use $$P(A)=\\frac{|A|}{|S|}$$.',
        });
    });
});

describe('normalizeMathOption', () => {
    it('wraps bare latex-like options so they render as math', () => {
        expect(normalizeMathOption('3 \\times 2 \\times 5 = 30')).toBe('$3 \\times 2 \\times 5 = 30$');
        expect(normalizeMathOption('\\binom{10}{3} = 120')).toBe('$\\binom{10}{3} = 120$');
    });

    it('does not wrap ordinary prose options', () => {
        expect(normalizeMathOption('Exactly 30 sequences')).toBe('Exactly 30 sequences');
    });
});
