export const MATH_TEXT_SPLIT_PATTERN = /(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/;

export const splitMathTextSegments = (text: string): string[] => {
    if (!text) {
        return [];
    }

    return text.split(MATH_TEXT_SPLIT_PATTERN).filter(Boolean);
};
