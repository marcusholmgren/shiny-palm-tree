import React, {useState, useEffect} from 'react';
import {TopicId, Topic} from '../types';
import {getStats, resetStats, ProbalityStats} from '../services/statsService';
import {Flame, Award, Target, RotateCcw, Brain, BarChart3, ChevronRight, Calculator, BookOpen, Sigma, Compass, Layers} from 'lucide-react';
import MathRenderer from './MathRenderer';

interface PracticeDashboardProps {
    topics: Topic[];
    onSelectTopic: (topicId: TopicId) => void;
}

const getBadgeInfo = (correctCount: number): {label: string; colorClass: string; desc: string} => {
    if (correctCount >= 5) {
        return {
            label: 'Master',
            colorClass: 'bg-amber-50 border border-amber-200 text-amber-700 shadow-[0_0_12px_rgba(245,158,11,0.2)] font-bold animate-[pulse_3s_infinite]',
            desc: 'Solved 5+ correct! Deep conceptual counting intuition.',
        };
    }
    if (correctCount >= 3) {
        return {
            label: 'Practitioner',
            colorClass: 'bg-purple-50 border border-purple-200 text-purple-700 font-semibold',
            desc: 'Solved 3-4 correct. Comfortable with casework and formulas.',
        };
    }
    if (correctCount >= 1) {
        return {
            label: 'Apprentice',
            colorClass: 'bg-blue-50 border border-blue-200 text-blue-700',
            desc: 'Solved 1-2 correct. First steps to counting mastery!',
        };
    }
    return {
        label: 'Novice',
        colorClass: 'bg-slate-100 border border-slate-200 text-slate-500',
        desc: 'Unsolved. Ready to tackle practice problems!',
    };
};

const getTopicIcon = (topicId: TopicId) => {
    switch (topicId) {
        case TopicId.NAIVE_DEF:
            return <Compass className="w-5 h-5" />;
        case TopicId.MULTIPLICATION:
            return <Sigma className="w-5 h-5" />;
        case TopicId.SAMPLING_TABLE:
            return <Calculator className="w-5 h-5" />;
        case TopicId.STORY_PROOFS:
            return <Layers className="w-5 h-5" />;
        case TopicId.COMPLEMENT:
            return <Target className="w-5 h-5" />;
        case TopicId.INCLUSION_EXCLUSION:
            return <Award className="w-5 h-5" />;
        default:
            return <Brain className="w-5 h-5" />;
    }
};

const PracticeDashboard: React.FC<PracticeDashboardProps> = ({topics, onSelectTopic}) => {
    const [stats, setStats] = useState<ProbalityStats>(getStats());
    const [showConfirmReset, setShowConfirmReset] = useState(false);

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

    // Calculate overall stats
    const totalCorrect = Object.values(stats.mastery).reduce((sum, item) => sum + item.correct, 0);
    const totalAnswered = Object.values(stats.mastery).reduce((sum, item) => sum + item.total, 0);
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    
    // Overall completion percentage (e.g. Mastered = 5 correct per topic. 6 topics * 5 = 30 points max)
    const MAX_POINTS = topics.length * 5;
    const currentPoints = Object.values(stats.mastery).reduce((sum, item) => sum + Math.min(item.correct, 5), 0);
    const masteryPercentage = Math.round((currentPoints / MAX_POINTS) * 100);

    const handleReset = () => {
        resetStats();
        setShowConfirmReset(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Header Performance Dashboard Panel */}
            <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
                {/* Decorative backgrounds */}
                <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute left-1/3 bottom-0 -mb-24 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider self-start border border-white/20">
                            <BarChart3 className="w-3.5 h-3.5" />
                            Practice Analytics
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight">Your Probability Journey</h2>
                        <p className="text-indigo-100 mt-2 text-sm md:text-base max-w-xl">
                            Consistent practice builds the mental model. Target Master status (<MathRenderer text="$5+$" /> correct first-tries) on all core categories!
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-4 rounded-xl border border-white/20 shadow-sm shrink-0 self-stretch md:self-auto justify-center">
                        <Flame className={`w-10 h-10 ${stats.streak > 0 ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse' : 'text-white/30'}`} />
                        <div className="text-left">
                            <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-wider">Current Streak</p>
                            <p className="text-2xl font-black">{stats.streak} <span className="text-sm font-medium text-indigo-100">problems</span></p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/20">
                    <div className="text-center bg-white/5 rounded-lg py-3 px-2 border border-white/5">
                        <p className="text-2xl font-black">{totalCorrect}</p>
                        <p className="text-xs text-indigo-100 mt-0.5">Correct Answers</p>
                    </div>
                    <div className="text-center bg-white/5 rounded-lg py-3 px-2 border border-white/5">
                        <p className="text-2xl font-black">{totalAnswered}</p>
                        <p className="text-xs text-indigo-100 mt-0.5">Total Answered</p>
                    </div>
                    <div className="text-center bg-white/5 rounded-lg py-3 px-2 border border-white/5">
                        <p className="text-2xl font-black">{accuracy}%</p>
                        <p className="text-xs text-indigo-100 mt-0.5">First-Try Accuracy</p>
                    </div>
                    <div className="text-center bg-white/5 rounded-lg py-3 px-2 border border-white/5">
                        <p className="text-2xl font-black">{stats.bestStreak}</p>
                        <p className="text-xs text-indigo-100 mt-0.5">Best Streak</p>
                    </div>
                </div>
            </section>

            {/* Overall Progress Section */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Overall Mastery Completion</h3>
                        <p className="text-slate-500 text-sm mt-0.5">Calculated based on topics achieving Master status.</p>
                    </div>
                    <span className="text-2xl font-black text-indigo-600 shrink-0">{masteryPercentage}% Complete</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/50">
                    <div 
                        className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{width: `${masteryPercentage}%`}}
                    />
                </div>
            </section>

            {/* Grid of Core Topics */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic) => {
                    const topicStats = stats.mastery[topic.id] || {correct: 0, total: 0};
                    const badge = getBadgeInfo(topicStats.correct);
                    const progress = Math.min(Math.round((topicStats.correct / 5) * 100), 100);

                    return (
                        <div 
                            key={topic.id}
                            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/50 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                        {getTopicIcon(topic.id)}
                                    </div>
                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${badge.colorClass}`}>
                                        {badge.label}
                                    </span>
                                </div>

                                <h4 className="font-bold text-slate-800 text-base leading-tight group-hover:text-indigo-600 transition-colors">
                                    {topic.title}
                                </h4>

                                <div className="mt-2 text-xs text-slate-500 line-clamp-2 h-8 leading-relaxed">
                                    <MathRenderer text={topic.description} />
                                </div>

                                <div className="my-4 bg-slate-50 rounded-lg p-2.5 border border-slate-100 font-mono text-[10px] text-indigo-600 overflow-x-auto whitespace-nowrap text-center">
                                    {topic.formula ? <MathRenderer text={topic.formula} /> : 'Intuit proof stories'}
                                </div>
                            </div>

                            <div className="space-y-4 pt-3 border-t border-slate-100">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                                        <span>Mastery Score</span>
                                        <span>{topicStats.correct} / 5 solved</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                                            style={{width: `${progress}%`}}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => onSelectTopic(topic.id)}
                                    className="w-full mt-2 py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 font-semibold rounded-lg text-xs transition-all flex items-center justify-center gap-1 active:scale-[0.98] border border-slate-200/60 group-hover:border-indigo-100"
                                >
                                    Practice Now
                                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Danger Zone / Reset Progress */}
            <section className="bg-slate-100 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                    <h4 className="font-bold text-slate-700 text-sm">Need a Fresh Start?</h4>
                    <p className="text-xs text-slate-500 mt-0.5">This will clear all localStorage stats and reset streaks back to zero.</p>
                </div>

                {!showConfirmReset ? (
                    <button
                        onClick={() => setShowConfirmReset(true)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100/50 px-4 py-2 rounded-lg border border-rose-200 transition-all shrink-0 active:scale-95 flex items-center gap-1.5"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset My Stats
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleReset}
                            className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-lg transition-all active:scale-95 shadow-sm"
                        >
                            Confirm Reset
                        </button>
                        <button
                            onClick={() => setShowConfirmReset(false)}
                            className="text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default PracticeDashboard;
