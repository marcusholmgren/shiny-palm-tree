import {QuizQuestion} from '../types';

const MATH_TEXT_SPLIT_PATTERN = /(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/;
const BARE_INLINE_LATEX_FRAGMENT_PATTERN =
    /\\[a-zA-Z]+(?:\{[^{}]*\})*(?:\s*(?:\\[a-zA-Z]+(?:\{[^{}]*\})*|[0-9]+(?:\.[0-9]+)?(?:\/[0-9]+(?:\.[0-9]+)?)?|[A-Za-z]{1,2}|[=+\-*/^_(),{}]))+\$?/g;

const isDelimitedMathSegment = (segment: string): boolean => {
    return (
        (segment.startsWith('$$') && segment.endsWith('$$')) ||
        (segment.startsWith('$') && segment.endsWith('$'))
    );
};

const wrapBareInlineLatexFragments = (text: string): string => {
    return text
        .split(MATH_TEXT_SPLIT_PATTERN)
        .filter(Boolean)
        .map((segment) => {
            if (isDelimitedMathSegment(segment)) {
                return segment;
            }

            return segment.replace(BARE_INLINE_LATEX_FRAGMENT_PATTERN, (match) => {
                const trimmedMatch = match.trimEnd();
                const cleaned = trimmedMatch.endsWith('$') ? trimmedMatch.slice(0, -1).trimEnd() : trimmedMatch;
                return `$${cleaned}$`;
            });
        })
        .join('');
};

export const normalizeMathText = (text: string): string => {
    const normalized = text
        .replace(/\r\n/g, '\n')
        .replace(/\\\[/g, () => '$$')
        .replace(/\\\]/g, () => '$$')
        .replace(/\\\(/g, () => '$')
        .replace(/\\\)/g, () => '$');

    return wrapBareInlineLatexFragments(normalized);
};

const looksLikeStandaloneMath = (text: string): boolean => {
    const trimmed = text.trim();

    if (!trimmed || trimmed.includes('$')) {
        return false;
    }

    if (!/[\\=^_+\-*/{}()]/.test(trimmed)) {
        return false;
    }

    if (/[.!?:;]/.test(trimmed)) {
        return false;
    }

    const withoutLatexCommands = trimmed.replace(/\\[a-zA-Z]+/g, ' ');
    return !/[A-Za-z]{3,}/.test(withoutLatexCommands);
};

export const normalizeMathOption = (text: string): string => {
    const normalized = normalizeMathText(text);
    const withoutDelimiters = normalized.replace(/\$/g, '').trim();

    if (looksLikeStandaloneMath(withoutDelimiters)) {
        return `$${withoutDelimiters}$`;
    }

    return normalized;
};

export const normalizeQuizQuestion = (question: QuizQuestion): QuizQuestion => {
    return {
        ...question,
        question: normalizeMathText(question.question),
        options: question.options.map(normalizeMathOption),
        explanation: normalizeMathText(question.explanation),
    };
};
