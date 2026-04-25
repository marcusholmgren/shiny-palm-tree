import {GoogleGenAI, Type, Schema} from '@google/genai';
import {Difficulty, QuizQuestion} from '../types';
import {QUIZ_DIFFICULTY_GUIDE} from '../quizDifficulty';
import {normalizeQuizQuestion} from './llmFormatting';

type Provider = 'gemini' | 'ollama';
type AppEnv = Record<string, string | undefined>;
type ChatHistoryEntry = { role: 'user' | 'model'; text: string };

interface OllamaGenerateResponse {
    model: string;
    created_at: Date;
    response?: string;
    done: boolean;
    done_reason: string;
    context: number[];
    total_duration: number;
    load_duration: number;
    prompt_eval_count: number;
    prompt_eval_duration: number;
    eval_count: number;
    eval_duration: number;
}

interface OllamaChatResponse {
    model: string;
    created_at: Date;
    message?: OllamaChatResponseMessage;
    done: boolean;
    done_reason: string;
    total_duration: number;
    load_duration: number;
    prompt_eval_count: number;
    prompt_eval_duration: number;
    eval_count: number;
    eval_duration: number;
}

export interface OllamaChatResponseMessage {
    role: string;
    content?: string;
    thinking: string;
}

const env = ((import.meta as ImportMeta & { env?: AppEnv }).env ?? {});

const provider = getProvider();
const geminiApiKey = env.VITE_GEMINI_API_KEY ?? '';
const geminiModel = env.VITE_GEMINI_MODEL ?? 'gemini-3.1-flash-lite-preview';
const ollamaBaseUrl = env.VITE_OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
const ollamaModel = env.VITE_OLLAMA_MODEL ?? 'gemma4:latest';
const tutorSystemInstruction = `You are Dr. B, a friendly and rigorous probability professor in the style of Joe Blitzstein. You love story proofs, building intuition before formulas, and helping students navigate the four types of sampling (ordered/unordered, with/without replacement).

Scope: You only help with the following topics from this course: the Naive Definition of Probability, the Multiplication Rule, the Sampling Table, and Story Proofs. If a student asks about anything outside these four topics, warmly redirect them: "That's beyond what we're covering here — let's get back to [relevant topic]."

Pedagogy:
- Never give away a final answer. Instead, ask one question that moves the student one step forward.
- When a student is stuck on a counting problem, prompt them with the two Sampling Table questions: "Does order matter?" and "Can the same item be chosen more than once?"
- When a student makes an error, name the specific misconception (e.g. "It sounds like you may be treating this as ordered — is the sequence important here?") rather than simply stating the correct answer.
- Praise correct reasoning explicitly before introducing a correction.
- Treat every question as worth asking. Never make a student feel foolish for not knowing something.

Style:
- Be warm, concise, and Socratic. Prefer questions over statements.
- Keep responses to 3–5 sentences unless a step-by-step breakdown is explicitly requested.
- Lead with intuition, follow with formula — never the other way around.

LaTeX rules:
- Use $...$ for inline math and $$...$$ for display math only.
- Never use \\(...\\) or \\[...\\].
- Double-escape backslashes in all LaTeX: \\\\frac, \\\\binom, \\\\cdot.
- Keep all prose outside math delimiters.`;

const quizSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        question: {type: Type.STRING, description: 'The probability problem text.'},
        options: {
            type: Type.ARRAY,
            items: {type: Type.STRING},
            description: 'Exactly four possible answers.',
        },
        correctIndex: {type: Type.INTEGER, description: 'The index (0-3) of the correct answer.'},
        explanation: {type: Type.STRING, description: 'A detailed explanation of the solution.'},
    },
    required: ['question', 'options', 'correctIndex', 'explanation'],
};

const fallbackQuizQuestionEasy: QuizQuestion = {
    question:
        "A bag contains 3 red balls and 2 blue balls. If you draw one ball at random, what is the probability it is red?",
    options: ["$\\frac{1}{5}$", "$\\frac{2}{5}$", "$\\frac{3}{5}$", "$\\frac{3}{2}$"],
    correctIndex: 2,
    explanation:
        "By the naive definition, $P(A) = \\frac{|A|}{|S|}$. There are 3 red balls out of 5 equally likely outcomes, so $P(\\text{red}) = \\frac{3}{5}$. The option $\\frac{3}{2}$ is a classic error of dividing favorable by unfavorable outcomes instead of total outcomes.",
};

const fallbackQuizQuestion: QuizQuestion = {
    question: "In how many ways can we choose 3 scoops of ice cream from 5 flavors if order doesn't matter and repetition is allowed?",
    options: ['10', '60', '35', '125'],
    correctIndex: 2,
    explanation:
        "Since order doesn't matter and repetition is allowed, this is unordered sampling with replacement. " +
        "Applying the stars and bars formula: $\\binom{n+k-1}{k}$ with $n=5$ flavors and $k=3$ scoops gives $\\binom{7}{3} = 35$. " +
        "The other options correspond to the remaining cells of the sampling table: $10 = \\binom{5}{2}$ (unordered, no replacement), " +
        "$60 = 5 \\times 4 \\times 3$ (ordered, no replacement), and $125 = 5^3$ (ordered, with replacement).",
};

export const generateQuizQuestion = async (topic: string, difficulty: Difficulty): Promise<QuizQuestion> => {
    try {
        if (provider === 'ollama') {
            return await generateQuizQuestionWithOllama(topic, difficulty);
        }

        return await generateQuizQuestionWithGemini(topic, difficulty);
    } catch (error) {
        console.error('Quiz Generation Error:', error);
        if (difficulty == 'easy') {
            return fallbackQuizQuestionEasy;
        }
        return fallbackQuizQuestion;
    }
};

export const getTutorResponse = async (history: ChatHistoryEntry[], currentMessage: string): Promise<string> => {
    try {
        if (provider === 'ollama') {
            return await getTutorResponseWithOllama(history, currentMessage);
        }

        return await getTutorResponseWithGemini(history, currentMessage);
    } catch (error) {
        console.error('Chat Error:', error);

        if (provider === 'ollama') {
            return "I'm having trouble reaching your local Ollama server right now. Make sure Ollama is running and the selected model is available.";
        }

        return "I'm having trouble connecting to Gemini right now. Check your VITE_GEMINI_API_KEY and try again.";
    }
};

function getProvider(): Provider {
    const configuredProvider = env.VITE_LLM_PROVIDER?.trim().toLowerCase();

    if (configuredProvider === 'gemini' || configuredProvider === 'ollama') {
        return configuredProvider;
    }

    return env.VITE_GEMINI_API_KEY ? 'gemini' : 'ollama';
}

function getGeminiClient(): GoogleGenAI {
    if (!geminiApiKey) {
        throw new Error('Missing VITE_GEMINI_API_KEY for Gemini provider.');
    }

    return new GoogleGenAI({apiKey: geminiApiKey});
}

async function generateQuizQuestionWithGemini(topic: string, difficulty: Difficulty): Promise<QuizQuestion> {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
        model: geminiModel,
        contents: buildQuizPrompt(topic, difficulty),
        config: {
            responseMimeType: 'application/json',
            responseSchema: quizSchema,
            temperature: 0.7,
        },
    });

    const text = response.text;
    if (!text) {
        throw new Error('No quiz content generated.');
    }

    return parseQuizQuestion(text);
}

async function generateQuizQuestionWithOllama(topic: string, difficulty: Difficulty): Promise<QuizQuestion> {
    const response = await fetch(`${ollamaBaseUrl}/api/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: ollamaModel,
            stream: false,
            format: 'json',
            prompt: buildQuizPrompt(topic, difficulty),
            options: {
                temperature: 0.7,
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Ollama quiz request failed with status ${response.status}.`);
    }

    const data = (await response.json()) as OllamaGenerateResponse;
    if (!data.response) {
        throw new Error('Ollama returned an empty quiz response.');
    }

    return parseQuizQuestion(data.response);
}

async function getTutorResponseWithGemini(history: ChatHistoryEntry[], currentMessage: string): Promise<string> {
    const ai = getGeminiClient();
    const {priorHistory, nextMessage} = splitHistoryForReply(history, currentMessage);

    const chat = ai.chats.create({
        model: geminiModel,
        config: {
            systemInstruction: tutorSystemInstruction,
        },
        history: priorHistory.map((entry) => ({
            role: entry.role,
            parts: [{text: entry.text}],
        })),
    });

    const result = await chat.sendMessage({message: nextMessage});
    return result.text || "I'm sorry, I lost my train of thought. Could you ask that again?";
}

async function getTutorResponseWithOllama(history: ChatHistoryEntry[], currentMessage: string): Promise<string> {
    const {fullConversation} = splitHistoryForReply(history, currentMessage);
    const response = await fetch(`${ollamaBaseUrl}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: ollamaModel,
            stream: false,
            messages: [
                {role: 'system', content: tutorSystemInstruction},
                ...fullConversation.map((entry) => ({
                    role: entry.role === 'model' ? 'assistant' : 'user',
                    content: entry.text,
                })),
            ],
            options: {
                temperature: 0.7,
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Ollama chat request failed with status ${response.status}.`);
    }

    const data = (await response.json()) as OllamaChatResponse;
    return data.message?.content || "I'm sorry, I lost my train of thought. Could you ask that again?";
}

function buildQuizPrompt(topic: string, difficulty: Difficulty): string {
    return `Generate one multiple-choice probability problem for a university intro course (Stat 110 level).

Topic: ${topic}
Difficulty: ${difficulty} — ${QUIZ_DIFFICULTY_GUIDE[difficulty]}

Requirements:
- The problem must require ${topic} as the primary solving mechanic. Do not let a neighboring topic (e.g. permutations when the topic is combinations) dominate.
- Exactly 4 answer options labeled as strings.
- Exactly one correct answer. Set "correctIndex" to its 0-based index (vary this — do not always use 0).
- The 3 wrong options must be plausible: reflect common errors such as confusing ordered vs. unordered selection, off-by-one mistakes, or classic overcounting.
- Prefer short numeric or simplified-fraction answer choices when the problem asks for a count or probability.
- "explanation" must be a step-by-step solution in 2–5 sentences, showing the key formula or counting argument and the final computation.

LaTeX rules (KaTeX):
- Use $...$ for inline math and $$...$$ for display math only.
- Never use \\(...\\) or \\[...\\].
- In JSON strings, double-escape all backslashes: write \\\\frac, \\\\binom, \\\\cdot — not \\frac.
- Keep all prose outside math delimiters.

Return a single valid JSON object with exactly this shape — no markdown fences, no extra keys:
{
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctIndex": 0,
  "explanation": "string"
}`;
}

function splitHistoryForReply(history: ChatHistoryEntry[], currentMessage: string) {
    const dedupedHistory = [...history];
    const lastEntry = dedupedHistory[dedupedHistory.length - 1];
    const currentAlreadyIncluded = lastEntry?.role === 'user' && lastEntry.text === currentMessage;

    const fullConversation = currentAlreadyIncluded
        ? dedupedHistory
        : [...dedupedHistory, {role: 'user' as const, text: currentMessage}];

    const priorHistory = fullConversation.slice(0, -1);
    const nextMessage = fullConversation[fullConversation.length - 1]?.text ?? currentMessage;

    return {fullConversation, priorHistory, nextMessage};
}

function parseQuizQuestion(rawText: string): QuizQuestion {
    const parsed = JSON.parse(extractJsonObject(rawText)) as Partial<QuizQuestion>;

    if (typeof parsed.question !== 'string') {
        throw new Error('Quiz response is missing a question string.');
    }

    if (!Array.isArray(parsed.options) || parsed.options.length !== 4 || !parsed.options.every((option) => typeof option === 'string')) {
        throw new Error('Quiz response must contain exactly four string options.');
    }

    if (
        typeof parsed.correctIndex !== 'number' ||
        !Number.isInteger(parsed.correctIndex) ||
        parsed.correctIndex < 0 ||
        parsed.correctIndex >= parsed.options.length
    ) {
        throw new Error('Quiz response has an invalid correctIndex.');
    }

    if (typeof parsed.explanation !== 'string') {
        throw new Error('Quiz response is missing an explanation string.');
    }

    return normalizeQuizQuestion({
        question: parsed.question,
        options: parsed.options,
        correctIndex: parsed.correctIndex,
        explanation: parsed.explanation,
    });
}

function extractJsonObject(rawText: string): string {
    const trimmed = rawText.trim();
    const withoutFences = trimmed.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    if (withoutFences.startsWith('{') && withoutFences.endsWith('}')) {
        return withoutFences;
    }

    const start = withoutFences.indexOf('{');
    const end = withoutFences.lastIndexOf('}');

    if (start >= 0 && end > start) {
        return withoutFences.slice(start, end + 1);
    }

    throw new Error('Could not extract JSON object from model response.');
}
