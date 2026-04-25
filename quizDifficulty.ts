import {Difficulty} from './types';

export const QUIZ_DIFFICULTY_GUIDE: Record<Difficulty, string> = {
    easy: 'Single-step counting, direct formula application, no casework.',
    medium: 'Two-step reasoning or one edge case such as overcounting or order ambiguity.',
    hard: 'Casework, complementary counting, or a non-obvious story proof.',
};

export const QUIZ_DIFFICULTY_OPTIONS: Array<{
    value: Difficulty;
    label: string;
    description: string;
}> = [
    {
        value: 'easy',
        label: 'Easy',
        description: QUIZ_DIFFICULTY_GUIDE.easy,
    },
    {
        value: 'medium',
        label: 'Medium',
        description: QUIZ_DIFFICULTY_GUIDE.medium,
    },
    {
        value: 'hard',
        label: 'Hard',
        description: QUIZ_DIFFICULTY_GUIDE.hard,
    },
];
