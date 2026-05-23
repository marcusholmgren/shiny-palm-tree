import {GoogleGenAI, Type, Schema} from '@google/genai';
import {Difficulty, QuizQuestion} from '../types';
import {QUIZ_DIFFICULTY_GUIDE} from '../quizDifficulty';
import {normalizeQuizQuestion, escapeRawJsonMathBackslashes} from './llmFormatting';

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

const getEnv = (): AppEnv => {
    const metaEnv = ((import.meta as ImportMeta & { env?: AppEnv }).env ?? {});
    const processEnv = typeof process !== 'undefined' ? (process.env as AppEnv) : {};
    return {
        ...metaEnv,
        ...processEnv
    };
};

export interface LlmSettings {
    provider: 'gemini' | 'ollama';
    geminiApiKey: string;
    geminiModel: string;
    ollamaBaseUrl: string;
    ollamaModel: string;
}

export const getLlmSettings = (): LlmSettings => {
    const currentEnv = getEnv();
    const storedProvider = localStorage.getItem('probality_llm_provider') as 'gemini' | 'ollama' | null;
    
    // API Key resolution helper
    const getResolvedApiKey = () => {
        const sessionApiKey = sessionStorage.getItem('probality_gemini_api_key');
        if (sessionApiKey !== null) {
            return sessionApiKey;
        }
        const rawApiKey = currentEnv.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '') || '';
        return rawApiKey === 'PLACEHOLDER_API_KEY' ? '' : rawApiKey;
    };

    const resolvedApiKey = getResolvedApiKey();

    let resolvedProvider: 'gemini' | 'ollama';
    if (storedProvider === 'gemini' || storedProvider === 'ollama') {
        resolvedProvider = storedProvider;
    } else {
        const envProvider = currentEnv.VITE_LLM_PROVIDER?.trim().toLowerCase();
        if (envProvider === 'gemini' || envProvider === 'ollama') {
            resolvedProvider = envProvider;
        } else {
            resolvedProvider = resolvedApiKey ? 'gemini' : 'ollama';
        }
    }

    const storedGeminiModel = localStorage.getItem('probality_gemini_model');
    const resolvedGeminiModel = storedGeminiModel || currentEnv.VITE_GEMINI_MODEL || 'gemini-3.1-flash-lite-preview';

    const storedOllamaBaseUrl = localStorage.getItem('probality_ollama_base_url');
    const resolvedOllamaBaseUrl = storedOllamaBaseUrl || currentEnv.VITE_OLLAMA_BASE_URL || 'http://127.0.0.1:11434';

    const storedOllamaModel = localStorage.getItem('probality_ollama_model');
    const resolvedOllamaModel = storedOllamaModel || currentEnv.VITE_OLLAMA_MODEL || 'gemma4:latest';

    return {
        provider: resolvedProvider,
        geminiApiKey: resolvedApiKey,
        geminiModel: resolvedGeminiModel,
        ollamaBaseUrl: resolvedOllamaBaseUrl,
        ollamaModel: resolvedOllamaModel,
    };
};

export const updateLlmSettings = (updates: Partial<LlmSettings>): LlmSettings => {
    if (updates.provider) {
        localStorage.setItem('probality_llm_provider', updates.provider);
    }
    if (updates.geminiApiKey !== undefined) {
        sessionStorage.setItem('probality_gemini_api_key', updates.geminiApiKey);
    }
    if (updates.geminiModel) {
        localStorage.setItem('probality_gemini_model', updates.geminiModel);
    }
    if (updates.ollamaBaseUrl) {
        localStorage.setItem('probality_ollama_base_url', updates.ollamaBaseUrl);
    }
    if (updates.ollamaModel) {
        localStorage.setItem('probality_ollama_model', updates.ollamaModel);
    }

    const newSettings = getLlmSettings();
    window.dispatchEvent(new CustomEvent('probality_llm_settings_changed', { detail: newSettings }));
    return newSettings;
};

export interface ConnectionTestResult {
    success: boolean;
    message: string;
    models?: string[];
}

export const testOllamaConnection = async (baseUrl: string): Promise<ConnectionTestResult> => {
    try {
        const response = await fetch(`${baseUrl}/api/tags`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        if (!response.ok) {
            return { success: false, message: `Server returned status ${response.status}.` };
        }
        const data = await response.json();
        const models = (data.models || []).map((m: any) => m.name);
        return {
            success: true,
            message: 'Connected successfully!',
            models,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Could not connect. Is Ollama running on your system?',
        };
    }
};

export const testGeminiConnection = async (apiKey: string, model: string): Promise<ConnectionTestResult> => {
    if (!apiKey) {
        return { success: false, message: 'API key is missing.' };
    }
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: model,
            contents: 'Say only the word "OK"',
            config: {
                maxOutputTokens: 5,
            },
        });
        if (response.text) {
            return { success: true, message: 'Connected successfully!' };
        }
        return { success: false, message: 'Empty response received from Gemini.' };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Connection failed. Please check your API key.',
        };
    }
};

const tutorSystemInstruction = `You are Dr. B, a friendly and rigorous probability professor in the style of Joe Blitzstein. You love story proofs, building intuition before formulas, and helping students navigate the four types of sampling (ordered/unordered, with/without replacement).

Scope: You only help with the following topics from this course: the Naive Definition of Probability, the Multiplication Rule, the Sampling Table, and Story Proofs. If a student asks about anything outside these four topics, warmly redirect them: "That's beyond what we're covering here — let's get back to [relevant topic]."

Pedagogy:
- Never give away a final answer. Instead, ask one question that moves the student one step forward.
- When a student is stuck on a counting problem, prompt them with the two Sampling Table questions: "Does order matter?" and "Can the same item be chosen more than once?"
- Use concrete metaphors like ice cream scoops, passwords, races, committees, poker hands, or stars and bars to make problems tangible.
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
        explanation: {type: Type.STRING, description: 'A detailed explanation of the solution. Solve the problem completely here first before writing options or correctIndex.'},
        options: {
            type: Type.ARRAY,
            items: {type: Type.STRING},
            description: 'Exactly four possible answers.',
        },
        correctIndex: {type: Type.INTEGER, description: 'The index (0-3) of the correct answer.'},
    },
    required: ['question', 'explanation', 'options', 'correctIndex'],
};

const fallbackQuizQuestionEasy: QuizQuestion = {
    question:
        "A bag contains 3 red balls and 2 blue balls. If you draw one ball at random, what is the probability it is red?",
    options: ["$\\frac{1}{5}$", "$\\frac{2}{5}$", "$\\frac{3}{5}$", "$\\frac{3}{2}$"],
    correctIndex: 2,
    explanation:
        "By the naive definition, $P(A) = \\frac{|A|}{|S|}$. There are 3 red balls out of 5 equally likely outcomes, so $P(\\text{red}) = \\frac{3}{5}$. The option $\\frac{3}{2}$ is a classic error of dividing favorable by unfavorable outcomes instead of total outcomes.",
};

const fallbackQuizQuestionMedium: QuizQuestion = {
    question: "In how many ways can we choose 3 scoops of ice cream from 5 flavors if order doesn't matter and repetition is allowed?",
    options: ['10', '60', '35', '125'],
    correctIndex: 2,
    explanation:
        "Since order doesn't matter and repetition is allowed, this is unordered sampling with replacement. " +
        "Applying the stars and bars formula: $\\binom{n+k-1}{k}$ with $n=5$ flavors and $k=3$ scoops gives $\\binom{7}{3} = 35$. " +
        "The other options correspond to the remaining cells of the sampling table: $10 = \\binom{5}{2}$ (unordered, no replacement), " +
        "$60 = 5 \\times 4 \\times 3$ (ordered, no replacement), and $125 = 5^3$ (ordered, with replacement).",
};

const fallbackQuizQuestionHard: QuizQuestion = {
    question:
        "A committee of 3 is chosen from 4 men and 4 women. How many committees contain " +
        "at least one man and at least one woman?",
    options: ["48", "56", "32", "16"],
    correctIndex: 0,
    explanation:
        "Use complementary counting: subtract the all-male and all-female committees from the total. " +
        "Total committees: $\\binom{8}{3} = 56$. " +
        "All-male: $\\binom{4}{3} = 4$. All-female: $\\binom{4}{3} = 4$. " +
        "Mixed committees: $56 - 4 - 4 = 48$. " +
        "A common error is direct casework — counting $\\binom{4}{1}\\binom{4}{2} + \\binom{4}{2}\\binom{4}{1} = 48$ also works, " +
        "but complementary counting is faster and less error-prone here. " +
        "The trap answer $56$ forgets to subtract the all-same-gender cases, and $32$ is a classic halving error.",
};

export const generateQuizQuestion = async (topic: string, difficulty: Difficulty): Promise<QuizQuestion> => {
    const settings = getLlmSettings();
    try {
        if (settings.provider === 'ollama') {
            return await generateQuizQuestionWithOllama(topic, difficulty, settings);
        }

        return await generateQuizQuestionWithGemini(topic, difficulty, settings);
    } catch (error) {
        console.error('Quiz Generation Error:', error);
        if (difficulty === 'easy') return fallbackQuizQuestionEasy;
        if (difficulty === 'hard') return fallbackQuizQuestionHard;
        return fallbackQuizQuestionMedium;
    }
};

export const getTutorResponse = async (history: ChatHistoryEntry[], currentMessage: string): Promise<string> => {
    const settings = getLlmSettings();
    try {
        if (settings.provider === 'ollama') {
            return await getTutorResponseWithOllama(history, currentMessage, settings);
        }

        return await getTutorResponseWithGemini(history, currentMessage, settings);
    } catch (error) {
        console.error('Chat Error:', error);

        if (settings.provider === 'ollama') {
            return "I'm having trouble reaching your local Ollama server right now. Make sure Ollama is running and the selected model is available.";
        }

        return "I'm having trouble connecting to Gemini right now. Check your API key and try again.";
    }
};

function getGeminiClient(apiKey: string): GoogleGenAI {
    if (!apiKey) {
        throw new Error('Missing Gemini API key.');
    }

    return new GoogleGenAI({apiKey});
}

async function generateQuizQuestionWithGemini(topic: string, difficulty: Difficulty, settings: LlmSettings): Promise<QuizQuestion> {
    const ai = getGeminiClient(settings.geminiApiKey);
    const response = await ai.models.generateContent({
        model: settings.geminiModel,
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

async function generateQuizQuestionWithOllama(topic: string, difficulty: Difficulty, settings: LlmSettings): Promise<QuizQuestion> {
    const response = await fetch(`${settings.ollamaBaseUrl}/api/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: settings.ollamaModel,
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

async function getTutorResponseWithGemini(history: ChatHistoryEntry[], currentMessage: string, settings: LlmSettings): Promise<string> {
    const ai = getGeminiClient(settings.geminiApiKey);
    const {priorHistory, nextMessage} = splitHistoryForReply(history, currentMessage);

    const chat = ai.chats.create({
        model: settings.geminiModel,
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

async function getTutorResponseWithOllama(history: ChatHistoryEntry[], currentMessage: string, settings: LlmSettings): Promise<string> {
    const {fullConversation} = splitHistoryForReply(history, currentMessage);
    const response = await fetch(`${settings.ollamaBaseUrl}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: settings.ollamaModel,
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
- Use concrete metaphors (e.g. ice cream scoops, passwords, races, committees, poker hands, stars and bars) to frame the question context.
- "explanation" must be a step-by-step solution in 2–5 sentences. It must explicitly state whether order matters and whether replacement is allowed before showing the key formula or counting argument and the final computation. Lead with intuition. Solve the problem completely here first, before choosing the options.
- Exactly 4 answer options labeled as strings. One option must match the final computed answer from the explanation.
- Exactly one correct answer. Set "correctIndex" to its 0-based index (vary this — do not always use 0).
- The 3 wrong options must be plausible: reflect common errors such as confusing ordered vs. unordered selection, off-by-one mistakes, or classic overcounting.
- Prefer short numeric or simplified-fraction answer choices when the problem asks for a count or probability.

LaTeX rules (KaTeX):
- Use $...$ for inline math and $$...$$ for display math only.
- Never use \\(...\\) or \\[...\\].
- In JSON strings, double-escape all backslashes: write \\\\frac, \\\\binom, \\\\cdot — not \\frac.
- Keep all prose outside math delimiters.

Return a single valid JSON object with exactly this shape — no markdown fences, no extra keys:
{
  "question": "string",
  "explanation": "string",
  "options": ["string", "string", "string", "string"],
  "correctIndex": 0
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
    const jsonStr = extractJsonObject(rawText);
    const escapedJsonStr = escapeRawJsonMathBackslashes(jsonStr);
    const parsed = JSON.parse(escapedJsonStr) as Partial<QuizQuestion>;

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
