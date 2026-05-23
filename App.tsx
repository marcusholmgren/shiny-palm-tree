import React, {useState, useEffect} from 'react';
import SamplingTable, {getSamplingSelection, SamplingSelection} from './components/SamplingTable';
import Quiz from './components/Quiz';
import Tutor from './components/Tutor';
import MathRenderer from './components/MathRenderer';
import LlmSettingsPanel from './components/LlmSettingsPanel';
import NaiveDefinitionVisualizer from './components/NaiveDefinitionVisualizer';
import MultiplicationRuleVisualizer from './components/MultiplicationRuleVisualizer';
import StoryProofsVisualizer from './components/StoryProofsVisualizer';
import ComplementCountingVisualizer from './components/ComplementCountingVisualizer';
import InclusionExclusionVisualizer from './components/InclusionExclusionVisualizer';
import PracticeDashboard from './components/PracticeDashboard';
import {getLlmSettings, LlmSettings} from './services/geminiService';
import {getStats, ProbalityStats} from './services/statsService';
import {SamplingMode, TopicId, Topic} from './types';
import {BookOpen, Calculator, ChevronRight, Layout, Sigma, Settings, BarChart3, Flame} from 'lucide-react';

const topics: Topic[] = [
    {
        id: TopicId.NAIVE_DEF,
        title: "Naive Definition",
        description: "Probability over a finite sample space where all outcomes are equally likely.",
        formula: "$$P(A) = \\frac{|A|}{|S|}$$"
    },
    {
        id: TopicId.MULTIPLICATION,
        title: "Multiplication Rule",
        description: "If stage 1 has $n_1$ choices, stage 2 has $n_2$, …, the total outcome count is their product.",
        formula: "$$n_1 \\times n_2 \\times \\dots \\times n_k$$"
    },
    {
        id: TopicId.SAMPLING_TABLE,
        title: "The Sampling Table",
        description: "Four ways to sample $k$ items from $n$: does order matter, and can items repeat?",
        formula: "$$\\binom{n}{k},\\quad \\frac{n!}{(n-k)!},\\quad n^k,\\quad \\binom{n+k-1}{k}$$"
    },
    {
        id: TopicId.STORY_PROOFS,
        title: "Story Proofs",
        description: "Prove combinatorial identities by finding two ways to count the same set — no algebra needed.",
        formula: "$$k\\binom{n}{k} = n\\binom{n-1}{k-1}$$"
    },
    {
        id: TopicId.COMPLEMENT,
        title: "Complement Counting",
        description: "Count what you don't want and subtract from the total.",
        formula: "$$P(A) = 1 - P(A^c)$$"
    },
    {
        id: TopicId.INCLUSION_EXCLUSION,
        title: "Inclusion-Exclusion",
        description: "Count outcomes in A or B by adding, then correcting for overlap.",
        formula: "$$|A \\cup B| = |A| + |B| - |A \\cap B|$$"
    }
];

const App: React.FC = () => {
    const [currentTopic, setCurrentTopic] = useState<Topic>(topics[2]); // Default to Sampling Table
    const [samplingSelection, setSamplingSelection] = useState<SamplingSelection>(
        getSamplingSelection(SamplingMode.ORDERED_WITH_REPLACEMENT),
    );
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [llmSettings, setLlmSettings] = useState<LlmSettings>(getLlmSettings());
    const [activeView, setActiveView] = useState<'dashboard' | 'practice'>('dashboard');
    const [stats, setStats] = useState<ProbalityStats>(getStats());

    useEffect(() => {
        const handleSettingsChange = (e: Event) => {
            const customEvent = e as CustomEvent<LlmSettings>;
            if (customEvent.detail) {
                setLlmSettings(customEvent.detail);
            } else {
                setLlmSettings(getLlmSettings());
            }
        };
        window.addEventListener('probality_llm_settings_changed', handleSettingsChange);
        return () => {
            window.removeEventListener('probality_llm_settings_changed', handleSettingsChange);
        };
    }, []);

    useEffect(() => {
        const handleStatsUpdate = (e: Event) => {
            const customEvent = e as CustomEvent<ProbalityStats>;
            if (customEvent.detail) {
                setStats(customEvent.detail);
            } else {
                setStats(getStats());
            }
        };
        window.addEventListener('probality_stats_updated', handleStatsUpdate);
        return () => {
            window.removeEventListener('probality_stats_updated', handleStatsUpdate);
        };
    }, []);

    const renderContent = () => {
        if (activeView === 'dashboard') {
            return (
                <PracticeDashboard 
                    topics={topics} 
                    onSelectTopic={(topicId) => {
                        const target = topics.find((t) => t.id === topicId);
                        if (target) {
                            setCurrentTopic(target);
                            setActiveView('practice');
                        }
                    }}
                />
            );
        }

        switch (currentTopic.id) {
            case TopicId.NAIVE_DEF:
                return (
                    <div className="space-y-8">
                        <NaiveDefinitionVisualizer />
                        <Quiz topicId={currentTopic.id} topicTitle={currentTopic.title} />
                    </div>
                );
            case TopicId.MULTIPLICATION:
                return (
                    <div className="space-y-8">
                        <MultiplicationRuleVisualizer />
                        <Quiz topicId={currentTopic.id} topicTitle={currentTopic.title} />
                    </div>
                );
            case TopicId.SAMPLING_TABLE:
                return (
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                Mastering the Sampling Table
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                Whenever you choose <MathRenderer text="$k$"/> items from a group of{" "}
                                <MathRenderer text="$n$"/>, stop and ask yourself two questions:
                            </p>
                            <ul className="list-disc pl-5 space-y-3 text-slate-700 mb-6">
                                <li>
                                    <strong>Does order matter?</strong> Would rearranging the selection
                                    give a different outcome? (Race rankings: yes. Committee members: no.)
                                </li>
                                <li>
                                    <strong>Is replacement allowed?</strong> Can the same item appear
                                    more than once? (PIN digits: yes. Dealing cards: no.)
                                </li>
                            </ul>
                            <p className="text-slate-600 mb-4">
                                Your answers place you in one of four cells — each with its own
                                formula. Once you identify the right cell, the counting follows
                                automatically.
                            </p>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-700 text-sm">
                                <strong>Worked example:</strong> How many 3-digit PINs can you make
                                from digits 0–9? Order matters (123 ≠ 321) and repetition is allowed
                                (111 is valid) →{" "}
                                <MathRenderer text="$n^k = 10^3 = 1000$"/>
                            </div>
                        </div>

                        <SamplingTable onSelectionChange={setSamplingSelection}/>

                        <Quiz topicId={currentTopic.id} topicTitle={samplingSelection.topic}/>
                    </div>
                );
            case TopicId.STORY_PROOFS:
                return (
                    <div className="space-y-8">
                        <StoryProofsVisualizer />
                        <Quiz topicId={currentTopic.id} topicTitle={currentTopic.title} />
                    </div>
                );
            case TopicId.COMPLEMENT:
                return (
                    <div className="space-y-8">
                        <ComplementCountingVisualizer />
                        <Quiz topicId={currentTopic.id} topicTitle={currentTopic.title} />
                    </div>
                );
            case TopicId.INCLUSION_EXCLUSION:
                return (
                    <div className="space-y-8">
                        <InclusionExclusionVisualizer />
                        <Quiz topicId={currentTopic.id} topicTitle={currentTopic.title} />
                    </div>
                );
            default:
                return (
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
                            <Sigma className="w-16 h-16 text-indigo-200 mx-auto mb-4"/>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">{currentTopic.title}</h2>
                            <p className="text-slate-600 max-w-2xl mx-auto mb-6">
                                <MathRenderer text={currentTopic.description}/>
                            </p>
                            {currentTopic.formula && (
                                <div
                                    className="inline-block bg-white px-8 py-4 rounded-xl font-mono text-indigo-600 border border-slate-200 shadow-sm">
                                    <MathRenderer text={`${currentTopic.formula}`}/>
                                </div>
                            )}
                        </div>
                        <Quiz topicId={currentTopic.id} topicTitle={currentTopic.title}/>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
            {/* Sidebar Navigation */}
            <aside
                className="w-full md:w-64 bg-white border-r border-slate-200 md:h-screen sticky top-0 flex-shrink-0 overflow-y-auto flex flex-col justify-between">
                <div className="flex flex-col">
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
                            <Layout className="w-6 h-6"/>
                            <span>Probability</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Interactive Counting</p>

                        {/* Sidebar Progress & Streak Widget */}
                        {(() => {
                            const totalPointsSidebar = Object.values(stats.mastery).reduce((sum, item) => sum + Math.min(item.correct, 5), 0);
                            const overallProgressPercent = Math.round((totalPointsSidebar / (topics.length * 5)) * 100);
                            return (
                                <div className="mt-4 pt-4 border-t border-slate-100/70 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5" title="First-try Answer Streak">
                                        <Flame className={`w-4 h-4 ${stats.streak > 0 ? 'text-amber-500 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)] animate-pulse' : 'text-slate-300'}`} />
                                        <span className={`text-xs font-bold ${stats.streak > 0 ? 'text-slate-700' : 'text-slate-400'}`}>
                                            {stats.streak} Streak
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 flex-1 max-w-[90px]">
                                        <div className="flex justify-between w-full text-[9px] font-bold text-slate-400">
                                            <span>Mastery</span>
                                            <span>{overallProgressPercent}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden border border-slate-200/50">
                                            <div 
                                                className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                                                style={{width: `${overallProgressPercent}%`}}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    <nav className="p-4 space-y-1">
                        <button
                            onClick={() => setActiveView('dashboard')}
                            className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold transition-all mb-4 ${
                                activeView === 'dashboard'
                                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <BarChart3 className="w-4 h-4"/>
                                Progress Hub
                            </div>
                            {activeView === 'dashboard' && <ChevronRight className="w-4 h-4 opacity-75"/>}
                        </button>

                        <div className="text-[9px] uppercase font-bold text-slate-400 px-3 mb-2 tracking-wider">
                            Counting Topics
                        </div>

                        {topics.map(topic => {
                            const isSelected = activeView === 'practice' && currentTopic.id === topic.id;
                            return (
                                <button
                                    key={topic.id}
                                    onClick={() => {
                                        setCurrentTopic(topic);
                                        setActiveView('practice');
                                    }}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all ${
                                        isSelected
                                            ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {topic.id === TopicId.SAMPLING_TABLE ? <Calculator className="w-4 h-4"/> :
                                            <BookOpen className="w-4 h-4"/>}
                                        {topic.title}
                                    </div>
                                    {isSelected && <ChevronRight className="w-4 h-4 opacity-50"/>}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Dynamic Branding & Settings Panel Toggle */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2 mt-auto">
                    <div className="flex items-center gap-2">
                        {llmSettings.provider === 'gemini' ? (
                            <svg className="w-5 h-5 text-indigo-600 shrink-0 animate-[pulse_2s_infinite]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5A.75.75 0 0 1 12 2zm0 13.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5a.75.75 0 0 1 .75-.75zm6.5-6.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5a.75.75 0 0 1 .75-.75zM5.5 8.75a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5a.75.75 0 0 1 .75-.75z" opacity="0.3" />
                                <path d="M11.5 3C11.5 3 11.5 9.5 5 9.5C11.5 9.5 11.5 16 11.5 16C11.5 16 11.5 9.5 18 9.5C11.5 9.5 11.5 3 11.5 3Z" />
                                <path d="M18.5 14C18.5 14 18.5 17.5 15 17.5C18.5 17.5 18.5 21 18.5 21C18.5 21 18.5 17.5 22 17.5C18.5 17.5 18.5 14 18.5 14Z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-emerald-600 shrink-0 animate-[pulse_2s_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="10" rx="2" />
                                <path d="M12 2v6" />
                                <path d="M8 5h8" />
                                <circle cx="12" cy="16" r="2" />
                            </svg>
                        )}
                        <div className="text-left">
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Engine</p>
                            <p className="text-xs font-bold text-slate-700 leading-tight">
                                {llmSettings.provider === 'gemini' ? 'Google Gemini' : 'Gemma (Ollama)'}
                            </p>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-all active:scale-95"
                        title="Configure settings"
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto max-w-5xl mx-auto w-full">
                {activeView !== 'dashboard' && (
                    <header className="mb-8 pb-6 border-b border-slate-200">
                        <h1 className="text-3xl font-bold text-slate-900">{currentTopic.title}</h1>
                        <p className="text-slate-500 mt-2 text-lg">
                            <MathRenderer text={currentTopic.description}/>
                        </p>
                    </header>
                )}

                {renderContent()}
            </main>

            {/* AI Tutor Chat Overlay */}
            <Tutor/>

            {/* LLM Dynamic Configuration Dialog */}
            <LlmSettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
};

export default App;
