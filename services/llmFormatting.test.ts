import {describe, expect, it} from 'vitest';
import {cleanExplanationText, escapeRawJsonMathBackslashes, normalizeMathOption, normalizeMathText, normalizeQuizQuestion} from './llmFormatting';
import {getTopicCategory, getFallbackQuizQuestion} from './geminiService';

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

    it('collapses double backslashes in front of LaTeX commands', () => {
        expect(normalizeMathText('\\\\frac{7!}{3!}')).toBe('$\\frac{7!}{3!}$');
        expect(normalizeMathText('Use $\\\\binom{10}{3}$ here.')).toBe('Use $\\binom{10}{3}$ here.');
    });

    it('does not swallow adjacent English words of length >= 3 when wrapping bare math fragments', () => {
        const input = 'By the Inclusion-Exclusion principle, |A \\cup B| = |A| + |B| - |A \\cap B|, which gives 17 = 12 + 10 - |A \\cap B|.';
        const result = normalizeMathText(input);
        expect(result).toContain('which gives');
        expect(result).not.toContain('whichgives');
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

    it('cleans up self-correction noise from the explanation field', () => {
        expect(
            normalizeQuizQuestion({
                question: 'Select the committee size.',
                options: ['1', '2', '3', '4'],
                correctIndex: 1,
                explanation: 'The size is 2. Wait, this is incorrect because we need size 3...',
            })
        ).toEqual({
            question: 'Select the committee size.',
            options: ['1', '2', '3', '4'],
            correctIndex: 1,
            explanation: 'The size is 2.',
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

describe('cleanExplanationText', () => {
    it('leaves standard explanations without self-corrections intact', () => {
        expect(cleanExplanationText('This is a straightforward counting problem.')).toBe(
            'This is a straightforward counting problem.'
        );
    });

    it('truncates explanation at self-correction and thinking markers', () => {
        expect(
            cleanExplanationText(
                'By naive definition, P(A) = 1/2. Wait, this is incorrect because the calculations must be based on...'
            )
        ).toBe('By naive definition, P(A) = 1/2.');

        expect(
            cleanExplanationText(
                'We count unordered committees. (Self-correction: The intended answer is 40...)'
            )
        ).toBe('We count unordered committees.');

        expect(
            cleanExplanationText(
                'Let us use complement counting. *Re-evaluation for target answer 40:* Let us assume...'
            )
        ).toBe('Let us use complement counting.');

        expect(
            cleanExplanationText(
                'Final answer is 20. (Re-writing the prompt entirely to ensure consistency)'
            )
        ).toBe('Final answer is 20.');
    });
});

describe('escapeRawJsonMathBackslashes', () => {
    it('escapes unescaped LaTeX backslashes in raw JSON string', () => {
        const rawJson = '{"explanation": "This is ordered: $5 \\times 5 \\times 5 = 125$. Total is \\frac{120}{125}."}';
        // Note: \\ in rawJson string literal compiles to a single literal backslash in the JS string value.
        // It should double-escape them to two literal backslashes (which is \\ in JS string value, written as \\\\ in literal).
        expect(escapeRawJsonMathBackslashes(rawJson)).toBe(
            '{"explanation": "This is ordered: $5 \\\\times 5 \\\\times 5 = 125$. Total is \\\\frac{120}{125}."}'
        );
    });

    it('does not touch already-escaped LaTeX backslashes', () => {
        const rawJson = '{"explanation": "Already escaped: $5 \\\\\\\\times 5 = 125$."}';
        // Note: \\\\\\\\ in rawJson string literal compiles to two literal backslashes in the JS string value.
        // It should remain exactly the same.
        expect(escapeRawJsonMathBackslashes(rawJson)).toBe(
            '{"explanation": "Already escaped: $5 \\\\\\\\times 5 = 125$."}'
        );
    });

    it('does not touch standard JSON escapes or single control characters', () => {
        const rawJson = '{"text": "Line 1\\nLine 2\\tTabbed", "unicode": "\\u0020Space"}';
        // Note: \\n, \\t, \\u in JS string literal compile to a single literal backslash in JS string value.
        // They should remain exactly the same.
        expect(escapeRawJsonMathBackslashes(rawJson)).toBe(
            '{"text": "Line 1\\nLine 2\\tTabbed", "unicode": "\\u0020Space"}'
        );
    });
});

describe('getTopicCategory', () => {
    it('correctly maps naive definition topics', () => {
        expect(getTopicCategory('Naive Definition')).toBe('naive_def');
        expect(getTopicCategory('naive probability')).toBe('naive_def');
    });

    it('correctly maps multiplication rule topics', () => {
        expect(getTopicCategory('Multiplication Rule')).toBe('multiplication');
        expect(getTopicCategory('multiplication rule of counting')).toBe('multiplication');
    });

    it('correctly maps story proofs topics', () => {
        expect(getTopicCategory('Story Proofs')).toBe('story_proofs');
        expect(getTopicCategory('combinatorial proof')).toBe('story_proofs');
    });

    it('correctly maps complement counting topics', () => {
        expect(getTopicCategory('Complement Counting')).toBe('complement');
        expect(getTopicCategory('counting by complement')).toBe('complement');
    });

    it('correctly maps inclusion-exclusion topics', () => {
        expect(getTopicCategory('Inclusion-Exclusion')).toBe('inclusion_exclusion');
        expect(getTopicCategory('inclusion exclusion principle')).toBe('inclusion_exclusion');
    });

    it('defaults to sampling table for other/dynamic topics', () => {
        expect(getTopicCategory('Ordered without replacement (Race rankings)')).toBe('sampling_table');
        expect(getTopicCategory('Unordered with replacement (Stars and Bars)')).toBe('sampling_table');
        expect(getTopicCategory('Something completely random')).toBe('sampling_table');
    });
});

describe('getFallbackQuizQuestion', () => {
    it('returns a valid normalized quiz question for a matched topic and difficulty', () => {
        const question = getFallbackQuizQuestion('Naive Definition', 'easy');
        expect(question.question).toBe('A bag contains 3 red balls and 2 blue balls. If you draw one ball at random, what is the probability it is red?');
        expect(question.options.length).toBe(4);

        expect(question.explanation).toContain('By the naive definition of probability, $P(A) = \\frac{|A|}{|S|}$');
    });

    it('falls back to sampling table if topic is unrecognized', () => {
        const question = getFallbackQuizQuestion('Some random topic', 'medium');
        // 'sampling_table' medium is stars and bars scoop choosing
        expect(question.question).toContain('scoops of ice cream');
        expect(question.options.length).toBe(4);

    });

    it('falls back to medium difficulty if invalid difficulty is somehow provided', () => {
        // Cast to any to simulate invalid difficulty at runtime
        const question = getFallbackQuizQuestion('Multiplication Rule', 'invalid-difficulty' as any);
        expect(question.question).toContain('license plate');

    });
});
