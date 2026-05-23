import React, {useState} from 'react';
import {generateQuizQuestion} from '../services/geminiService';
import {Difficulty, QuizQuestion, TopicId} from '../types';
import {QUIZ_DIFFICULTY_OPTIONS} from '../quizDifficulty';
import {Brain, CheckCircle, XCircle, Loader2, ArrowRight, LucideBaby, Smile, SmilePlusIcon, GraduationCap} from 'lucide-react';
import MathRenderer from './MathRenderer';
import {updateStats} from '../services/statsService';
import Confetti from './Confetti';

interface QuizProps {
    topicId: TopicId;
    topicTitle: string;
}

const Quiz: React.FC<QuizProps> = ({topicId, topicTitle}) => {
    const [question, setQuestion] = useState<QuizQuestion | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [confettiTrigger, setConfettiTrigger] = useState(0);

    const resetQuestionState = () => {
        setShowExplanation(false);
        setSelectedOption(null);
        setQuestion(null);
    };

    const handleLoadQuestion = async () => {
        setLoading(true);
        resetQuestionState();

        const q = await generateQuizQuestion(topicTitle, difficulty);
        setQuestion(q);
        setLoading(false);
    };

    const handleDifficultySelect = (nextDifficulty: Difficulty) => {
        if (difficulty === nextDifficulty) return;

        setDifficulty(nextDifficulty);
        resetQuestionState();
    };

    const handleSelect = (index: number) => {
        if (selectedOption !== null || !question) return; // Prevent changing answer
        setSelectedOption(index);
        setShowExplanation(true);

        const isCorrect = index === question.correctIndex;
        // Update practice stats database
        updateStats(topicId, isCorrect);

        if (isCorrect) {
            setConfettiTrigger((prev) => prev + 1);
        }
    };

    const handleAskForHint = () => {
        if (!question) return;

        window.dispatchEvent(new CustomEvent('probality_ask_tutor_hint', {
            detail: {
                question: question.question,
                options: question.options,
                topic: topicTitle
            }
        }));
    };

    const difficultyUi = {
        easy: {
            icon: LucideBaby,
            base: 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50',
            iconColor: 'text-emerald-500',
            selected: 'border-emerald-500 bg-emerald-500 text-white shadow-sm',
            selectedIconColor: 'text-white',
            selectedDescription: 'text-emerald-50/90',
        },
        medium: {
            icon: Smile,
            base: 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50',
            iconColor: 'text-indigo-500',
            selected: 'border-indigo-600 bg-indigo-600 text-white shadow-lg',
            selectedIconColor: 'text-white',
            selectedDescription: 'text-indigo-50/90',
        },
        hard: {
            icon: SmilePlusIcon,
            base: 'border-amber-200 hover:border-amber-400 hover:bg-amber-50',
            iconColor: 'text-amber-500',
            selected: 'border-amber-500 bg-amber-500 text-white shadow-sm',
            selectedIconColor: 'text-white',
            selectedDescription: 'text-amber-50/90',
        },
    } satisfies Record<Difficulty, {
        icon: typeof Smile;
        base: string;
        iconColor: string;
        selected: string;
        selectedIconColor: string;
        selectedDescription: string;
    }>;

    return (
        <div className="space-y-6">
            <Confetti trigger={confettiTrigger} />
            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {QUIZ_DIFFICULTY_OPTIONS.map((option) => {
                    const ui = difficultyUi[option.value];
                    const Icon = ui.icon;
                    const isSelected = difficulty === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleDifficultySelect(option.value)}
                            className={`rounded-xl border p-4 text-left transition-all active:scale-[0.98] ${
                                isSelected
                                    ? ui.selected
                                    : `bg-white text-slate-700 shadow-sm ${ui.base}`
                            }`}
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <Icon className={`h-4 w-4 ${isSelected ? ui.selectedIconColor : ui.iconColor}`}/>
                                <span
                                    className={`text-xs font-bold uppercase tracking-[0.18em] ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                  {option.label}
                </span>
                            </div>
                            <p className={`text-sm leading-relaxed ${isSelected ? ui.selectedDescription : 'text-slate-500'}`}>
                                {option.description}
                            </p>
                        </button>
                    );
                })}
            </section>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div
                    className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-indigo-500"/>
                            Practice Problem
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            {QUIZ_DIFFICULTY_OPTIONS.find((option) => option.value === difficulty)?.label} difficulty
                            for <strong>{topicTitle}</strong>
                        </p>
                    </div>
                    <button
                        onClick={handleLoadQuestion}
                        disabled={loading}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50 flex items-center gap-1"
                    >
                        {loading ?
                            <Loader2 className="w-3 h-3 animate-spin"/> : question ? 'New Problem' : 'Generate Problem'}
                    </button>
                </div>

                {!question && !loading ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <Brain className="w-16 h-16 text-indigo-200 mb-4"/>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">Ready to practice?</h3>
                        <p className="text-slate-500 mb-6 max-w-md">
                            Generate a unique <strong>{difficulty}</strong> problem
                            about <strong>{topicTitle}</strong> powered by the selected model.
                        </p>
                        <button
                            onClick={handleLoadQuestion}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            Generate {QUIZ_DIFFICULTY_OPTIONS.find((option) => option.value === difficulty)?.label} Problem
                        </button>
                    </div>
                ) : loading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-500"/>
                        <p>Consulting the Oracle...</p>
                    </div>
                ) : question ? (
                    <div className="p-6">
                        <div className="text-lg text-slate-800 font-medium mb-6 leading-relaxed flex flex-col gap-4">
                            <MathRenderer text={question.question}/>
                            {selectedOption === null && (
                                <button
                                    onClick={handleAskForHint}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-lg transition-all self-start active:scale-[0.97] border border-indigo-100/30"
                                >
                                    <GraduationCap className="w-3.5 h-3.5" />
                                    Ask Dr. B for a Socratic Hint
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-3 mb-6">
                            {question.options.map((option, idx) => {
                                let btnClass = "border-slate-200 hover:bg-slate-50 hover:border-indigo-300 text-slate-700";

                                if (selectedOption !== null) {
                                    if (idx === question.correctIndex) {
                                        btnClass = "bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500";
                                    } else if (idx === selectedOption) {
                                        btnClass = "bg-rose-50 border-rose-500 text-rose-800 ring-1 ring-rose-500";
                                    } else {
                                        btnClass = "border-slate-100 text-slate-400 opacity-50";
                                    }
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelect(idx)}
                                        disabled={selectedOption !== null}
                                        className={`p-4 rounded-lg border-2 text-left transition-all flex items-center justify-between group ${btnClass}`}
                                    >
                                        <MathRenderer text={option}/>
                                        {selectedOption !== null && idx === question.correctIndex &&
                                            <CheckCircle className="w-5 h-5 text-emerald-600"/>}
                                        {selectedOption !== null && idx === selectedOption && idx !== question.correctIndex &&
                                            <XCircle className="w-5 h-5 text-rose-600"/>}
                                    </button>
                                );
                            })}
                        </div>

                        {showExplanation && (
                            <div
                                className="bg-indigo-50 rounded-lg p-5 border border-indigo-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-2">Solution</h4>
                                <div className="text-indigo-800 text-sm leading-relaxed whitespace-pre-wrap">
                                    <MathRenderer text={question.explanation}/>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handleLoadQuestion}
                                        className="text-sm font-medium text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
                                    >
                                        Next Problem <ArrowRight className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Quiz;
