export enum TopicId {
    NAIVE_DEF = 'naive_def',
    MULTIPLICATION = 'multiplication',
    SAMPLING_TABLE = 'sampling_table',
    STORY_PROOFS = 'story_proofs',
    COMPLEMENT = 'complement',
    INCLUSION_EXCLUSION = 'inclusion_exclusion',
}

export interface Topic {
    id: TopicId;
    title: string;
    description: string;
    formula?: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    isThinking?: boolean;
}

export enum SamplingMode {
    ORDERED_WITH_REPLACEMENT = 'OWR',
    ORDERED_NO_REPLACEMENT = 'ONR',
    UNORDERED_NO_REPLACEMENT = 'UNR', // Combinations
    UNORDERED_WITH_REPLACEMENT = 'UWR' // Bose-Einstein / Stars & Bars
}
