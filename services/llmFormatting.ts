import {QuizQuestion} from '../types';

const MATH_TEXT_SPLIT_PATTERN = /(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/;
const BARE_INLINE_LATEX_FRAGMENT_PATTERN =
    /\\[a-zA-Z]+(?:\{[^{}]*\})*(?:\s*(?:\\[a-zA-Z]+(?:\{[^{}]*\})*|[0-9]+(?:\.[0-9]+)?(?:\/[0-9]+(?:\.[0-9]+)?)?|[A-Za-z]{1,2}|[=+\-*/^_(),{}!|<>\[\]]))+\$?/g;

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
    // Collapse double backslashes before common LaTeX math commands
    const collapsed = text.replace(
        /\\\\(times|frac|binom|cdot|cdots|ldots|cup|cap|le|ge|ne|neq|approx|infty|theta|pi|sigma|mu|alpha|beta|gamma|lambda|delta|sum|prod|int|text|choose|sim|bar|setminus|subset|over)\b/g,
        '\\$1'
    );

    const normalized = collapsed
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

const SELF_CORRECTION_PATTERN =
    /(?:\(|^|\s)(?:wait,\s+)?(?:this\s+is\s+incorrect|that's\s+not\s+right|self-correction|\*?re-evaluation|\*?final\s+(?:attempt|adjustment)|(?:re-)?writing\s+the\s+prompt|\*?new\s+question:|\*?alternative\s+check)\b/i;

export const cleanExplanationText = (text: string): string => {
    const matchIndex = text.search(SELF_CORRECTION_PATTERN);
    if (matchIndex >= 0) {
        return text.slice(0, matchIndex).trim();
    }
    return text.trim();
};

const MATH_COMMANDS_PATTERN =
    /(?<!\\)\\(times|frac|binom|cdot|cdots|ldots|cup|cap|le|ge|ne|neq|approx|infty|theta|pi|sigma|mu|alpha|beta|gamma|lambda|delta|sum|prod|int|text|choose|sim|bar|setminus|subset|over)\b/g;

export const escapeRawJsonMathBackslashes = (jsonStr: string): string => {
    // Double-escape any unescaped backslash that is part of a LaTeX command
    return jsonStr.replace(MATH_COMMANDS_PATTERN, '\\\\$1');
};

export const normalizeQuizQuestion = (question: QuizQuestion): QuizQuestion => {
    return {
        ...question,
        question: normalizeMathText(question.question),
        options: question.options.map(normalizeMathOption),
        explanation: normalizeMathText(cleanExplanationText(question.explanation)),
    };
};
