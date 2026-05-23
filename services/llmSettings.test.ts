import {describe, expect, it, beforeEach, afterEach, vi, beforeAll} from 'vitest';
import {getLlmSettings, updateLlmSettings} from './geminiService';

class StorageMock implements Storage {
    private store: Record<string, string> = {};

    get length(): number {
        return Object.keys(this.store).length;
    }

    clear(): void {
        this.store = {};
    }

    getItem(key: string): string | null {
        return this.store[key] !== undefined ? this.store[key] : null;
    }

    key(index: number): string | null {
        const keys = Object.keys(this.store);
        return keys[index] !== undefined ? keys[index] : null;
    }

    removeItem(key: string): void {
        delete this.store[key];
    }

    setItem(key: string, value: string): void {
        this.store[key] = String(value);
    }
}

describe('LLM Settings Resolution', () => {
    beforeAll(() => {
        // Polyfill Storage and window events in NodeJS for vitest environment
        global.localStorage = new StorageMock();
        global.sessionStorage = new StorageMock();
        
        // Mock custom event and dispatchEvent
        if (typeof global.window === 'undefined') {
            (global as any).window = {
                dispatchEvent: vi.fn(),
            };
            (global as any).CustomEvent = class CustomEvent {
                type: string;
                detail: any;
                constructor(type: string, options?: any) {
                    this.type = type;
                    this.detail = options?.detail;
                }
            };
        }
    });

    beforeEach(() => {
        // Clear storages before each test
        localStorage.clear();
        sessionStorage.clear();
        vi.stubEnv('VITE_LLM_PROVIDER', '');
        vi.stubEnv('VITE_GEMINI_API_KEY', '');
        vi.stubEnv('VITE_GEMINI_MODEL', '');
        vi.stubEnv('VITE_OLLAMA_BASE_URL', '');
        vi.stubEnv('VITE_OLLAMA_MODEL', '');
        if (global.window && (global.window.dispatchEvent as any).mockClear) {
            (global.window.dispatchEvent as any).mockClear();
        }
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('resolves correct default values when no storage is present', () => {
        const settings = getLlmSettings();
        expect(settings.provider).toBe('ollama'); // Default fallback because VITE_GEMINI_API_KEY is empty
        expect(settings.ollamaBaseUrl).toBe('http://127.0.0.1:11434');
        expect(settings.ollamaModel).toBe('gemma4:latest');
        expect(settings.geminiModel).toBe('gemini-3.1-flash-lite-preview');
        expect(settings.geminiApiKey).toBe('');
    });

    it('uses environmental variables as initial fallbacks', () => {
        vi.stubEnv('VITE_LLM_PROVIDER', 'gemini');
        vi.stubEnv('VITE_GEMINI_API_KEY', 'env-key-123');
        vi.stubEnv('VITE_GEMINI_MODEL', 'gemini-custom');
        vi.stubEnv('VITE_OLLAMA_BASE_URL', 'http://custom-ollama:11434');
        vi.stubEnv('VITE_OLLAMA_MODEL', 'custom-gemma');

        const settings = getLlmSettings();
        expect(settings.provider).toBe('gemini');
        expect(settings.geminiApiKey).toBe('env-key-123');
        expect(settings.geminiModel).toBe('gemini-custom');
        expect(settings.ollamaBaseUrl).toBe('http://custom-ollama:11434');
        expect(settings.ollamaModel).toBe('custom-gemma');
    });

    it('prioritizes sessionStorage API Key over environmental variable API Key', () => {
        vi.stubEnv('VITE_GEMINI_API_KEY', 'env-key-123');
        sessionStorage.setItem('probality_gemini_api_key', 'session-key-456');

        const settings = getLlmSettings();
        expect(settings.geminiApiKey).toBe('session-key-456');
    });

    it('allows sessionStorage to set empty API key and bypass environmental variable', () => {
        vi.stubEnv('VITE_GEMINI_API_KEY', 'env-key-123');
        sessionStorage.setItem('probality_gemini_api_key', '');

        const settings = getLlmSettings();
        expect(settings.geminiApiKey).toBe('');
    });

    it('saves settings to localStorage and sessionStorage via updateLlmSettings', () => {
        updateLlmSettings({
            provider: 'gemini',
            geminiApiKey: 'new-session-key',
            geminiModel: 'new-model',
            ollamaBaseUrl: 'http://localhost:5000',
            ollamaModel: 'new-gemma',
        });

        expect(localStorage.getItem('probality_llm_provider')).toBe('gemini');
        expect(sessionStorage.getItem('probality_gemini_api_key')).toBe('new-session-key');
        expect(localStorage.getItem('probality_gemini_model')).toBe('new-model');
        expect(localStorage.getItem('probality_ollama_base_url')).toBe('http://localhost:5000');
        expect(localStorage.getItem('probality_ollama_model')).toBe('new-gemma');

        const settings = getLlmSettings();
        expect(settings.provider).toBe('gemini');
        expect(settings.geminiApiKey).toBe('new-session-key');
        expect(settings.geminiModel).toBe('new-model');
        expect(settings.ollamaBaseUrl).toBe('http://localhost:5000');
        expect(settings.ollamaModel).toBe('new-gemma');

        expect(window.dispatchEvent).toHaveBeenCalled();
    });
});
