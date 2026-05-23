import React, {useState, useEffect} from 'react';
import {
    getLlmSettings,
    updateLlmSettings,
    testOllamaConnection,
    testGeminiConnection,
    LlmSettings
} from '../services/geminiService';
import {
    Settings,
    X,
    Cpu,
    Cloud,
    CheckCircle2,
    XCircle,
    Loader2,
    Eye,
    EyeOff,
    RefreshCw,
    AlertCircle,
    ExternalLink
} from 'lucide-react';

interface LlmSettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const LlmSettingsPanel: React.FC<LlmSettingsPanelProps> = ({isOpen, onClose}) => {
    const [settings, setSettings] = useState<LlmSettings>(getLlmSettings());
    const [apiKeyVisible, setApiKeyVisible] = useState(false);
    
    // Connection test states
    const [testingOllama, setTestingOllama] = useState(false);
    const [ollamaResult, setOllamaResult] = useState<{ success: boolean; message: string; models?: string[] } | null>(null);
    
    const [testingGemini, setTestingGemini] = useState(false);
    const [geminiResult, setGeminiResult] = useState<{ success: boolean; message: string } | null>(null);

    // Track dynamic changes from other components
    useEffect(() => {
        const handleSettingsChange = () => {
            setSettings(getLlmSettings());
        };
        window.addEventListener('probality_llm_settings_changed', handleSettingsChange);
        return () => {
            window.removeEventListener('probality_llm_settings_changed', handleSettingsChange);
        };
    }, []);

    if (!isOpen) return null;

    const handleProviderChange = (provider: 'gemini' | 'ollama') => {
        const updated = updateLlmSettings({provider});
        setSettings(updated);
    };

    const handleUpdateField = (key: keyof LlmSettings, value: string) => {
        const updated = updateLlmSettings({[key]: value});
        setSettings(updated);
    };

    const handleTestOllama = async () => {
        setTestingOllama(true);
        setOllamaResult(null);
        try {
            const result = await testOllamaConnection(settings.ollamaBaseUrl);
            setOllamaResult(result);
            if (result.success && result.models && result.models.length > 0) {
                // If the currently configured model isn't in their list, but others are, we don't force change,
                // but we can offer list selection.
            }
        } catch (e) {
            setOllamaResult({success: false, message: 'Connection failed.'});
        } finally {
            setTestingOllama(false);
        }
    };

    const handleTestGemini = async () => {
        setTestingGemini(true);
        setGeminiResult(null);
        try {
            const result = await testGeminiConnection(settings.geminiApiKey, settings.geminiModel);
            setGeminiResult(result);
        } catch (e) {
            setGeminiResult({success: false, message: 'Authentication failed.'});
        } finally {
            setTestingGemini(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Box */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in scale-in duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <Settings className="w-5 h-5 animate-[spin_8s_linear_infinite]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Model Configuration</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Toggle between hosted cloud and local offline LLMs</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Segmented Provider Switch */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                            AI Provider
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                            <button
                                onClick={() => handleProviderChange('gemini')}
                                className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                                    settings.provider === 'gemini'
                                        ? 'bg-white text-indigo-700 shadow-md scale-[1.01]'
                                        : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
                                }`}
                            >
                                <Cloud className={`w-4 h-4 ${settings.provider === 'gemini' ? 'text-indigo-600' : ''}`} />
                                Hosted Gemini
                            </button>
                            <button
                                onClick={() => handleProviderChange('ollama')}
                                className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                                    settings.provider === 'ollama'
                                        ? 'bg-white text-emerald-700 shadow-md scale-[1.01]'
                                        : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
                                }`}
                            >
                                <Cpu className={`w-4 h-4 ${settings.provider === 'ollama' ? 'text-emerald-600' : ''}`} />
                                Local Ollama
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                        {settings.provider === 'gemini' ? (
                            /* GEMINI SETTINGS */
                            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs text-indigo-800 leading-relaxed">
                                    <div className="flex gap-2 items-start">
                                        <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                                        <div>
                                            <strong className="font-bold">Privacy First Storage:</strong> Custom API keys entered below are saved strictly in <code className="bg-indigo-100/80 px-1 py-0.5 rounded font-mono font-bold">sessionStorage</code>. They are completely erased from memory as soon as you close your browser tab.
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                                        <span>Gemini API Key</span>
                                        <a 
                                            href="https://aistudio.google.com/" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 font-medium"
                                        >
                                            Get API Key <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </label>
                                    <div className="relative flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type={apiKeyVisible ? 'text' : 'password'}
                                                value={settings.geminiApiKey}
                                                onChange={(e) => handleUpdateField('geminiApiKey', e.target.value)}
                                                placeholder={settings.geminiApiKey ? "• • • • • • • •" : "Paste your Gemini API Key..."}
                                                className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setApiKeyVisible(!apiKeyVisible)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                            >
                                                {apiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleTestGemini}
                                            disabled={testingGemini || !settings.geminiApiKey}
                                            className="px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-all active:scale-[0.98]"
                                        >
                                            {testingGemini ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                            Test
                                        </button>
                                    </div>
                                </div>

                                {geminiResult && (
                                    <div className={`p-4 rounded-xl border text-sm flex gap-3 items-start animate-in fade-in duration-200 ${
                                        geminiResult.success 
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                            : 'bg-rose-50 border-rose-200 text-rose-800'
                                    }`}>
                                        {geminiResult.success ? (
                                            <>
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                                <div>
                                                    <p className="font-semibold">Authentication Successful</p>
                                                    <p className="text-xs opacity-90 mt-0.5">Your API key is active and ready to use!</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                                                <div>
                                                    <p className="font-semibold">Authentication Failed</p>
                                                    <p className="text-xs opacity-90 mt-0.5">{geminiResult.message}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Gemini Model
                                    </label>
                                    <select
                                        value={settings.geminiModel}
                                        onChange={(e) => handleUpdateField('geminiModel', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                                    >
                                        <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
                                        <option value="gemini-2.5-pro">Gemini 2.5 Pro (Highly Intelligent)</option>
                                        <option value="gemini-1.5-flash">Gemini 1.5 Flash (Legacy)</option>
                                        <option value="gemini-3.1-flash-lite-preview">Gemini 3.1 Flash Lite Preview</option>
                                    </select>
                                </div>
                            </div>
                        ) : (
                            /* OLLAMA SETTINGS */
                            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-emerald-800 leading-relaxed">
                                    <div className="flex gap-2 items-start">
                                        <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <strong className="font-bold">Local Host Check:</strong> Ensure that your Ollama application is launched and running locally on your computer before testing or running problems.
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Ollama API Endpoint
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={settings.ollamaBaseUrl}
                                            onChange={(e) => handleUpdateField('ollamaBaseUrl', e.target.value)}
                                            placeholder="e.g. http://127.0.0.1:11434"
                                            className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                                        />
                                        <button
                                            onClick={handleTestOllama}
                                            disabled={testingOllama || !settings.ollamaBaseUrl}
                                            className="px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-all active:scale-[0.98]"
                                        >
                                            {testingOllama ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                            Test
                                        </button>
                                    </div>
                                </div>

                                {ollamaResult && (
                                    <div className={`p-4 rounded-xl border text-sm flex gap-3 items-start animate-in fade-in duration-200 ${
                                        ollamaResult.success 
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                            : 'bg-rose-50 border-rose-200 text-rose-800'
                                    }`}>
                                        {ollamaResult.success ? (
                                            <>
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                                <div className="flex-1">
                                                    <p className="font-semibold">Local Connection Stable</p>
                                                    <p className="text-xs opacity-90 mt-0.5">Ollama responds smoothly.</p>
                                                    {ollamaResult.models && ollamaResult.models.length > 0 && (
                                                        <div className="mt-2">
                                                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-1">Installed Models:</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {ollamaResult.models.map((m) => (
                                                                    <span 
                                                                        key={m} 
                                                                        onClick={() => handleUpdateField('ollamaModel', m)}
                                                                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer border hover:border-emerald-500 ${
                                                                            settings.ollamaModel === m 
                                                                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                                                                : 'bg-white text-emerald-800 border-emerald-200'
                                                                        }`}
                                                                    >
                                                                        {m}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                                                <div>
                                                    <p className="font-semibold">Connection Failed</p>
                                                    <p className="text-xs opacity-90 mt-0.5">{ollamaResult.message}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Model Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={settings.ollamaModel}
                                            onChange={(e) => handleUpdateField('ollamaModel', e.target.value)}
                                            placeholder="e.g. gemma4:latest"
                                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                                        />
                                        {ollamaResult?.models && ollamaResult.models.includes(settings.ollamaModel) && (
                                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-500 text-xs font-semibold">
                                                Installed
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md active:scale-[0.98]"
                    >
                        Close & Apply
                    </button>
                </div>

            </div>
        </div>
    );
};

export default LlmSettingsPanel;
