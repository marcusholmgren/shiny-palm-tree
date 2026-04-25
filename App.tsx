import React, {useState} from 'react';
import SamplingTable, {getSamplingSelection, SamplingSelection} from './components/SamplingTable';
import Quiz from './components/Quiz';
import Tutor from './components/Tutor';
import MathRenderer from './components/MathRenderer';
import {SamplingMode, TopicId, Topic} from './types';
import {BookOpen, Calculator, ChevronRight, Layout, Sigma} from 'lucide-react';

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

    const renderContent = () => {
        if (currentTopic.id === TopicId.SAMPLING_TABLE) {
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

                    <Quiz
                        topic={samplingSelection.topic}/>
                </div>
            );
        }

        // Placeholder for other topics to keep the demo focused on the requested functionality
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
                <Quiz topic={currentTopic.title}/>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
            {/* Sidebar Navigation */}
            <aside
                className="w-full md:w-64 bg-white border-r border-slate-200 md:h-screen sticky top-0 flex-shrink-0 overflow-y-auto">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
                        <Layout className="w-6 h-6"/>
                        <span>Probability</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Interactive Counting</p>
                </div>

                <nav className="p-4 space-y-1">
                    {topics.map(topic => (
                        <button
                            key={topic.id}
                            onClick={() => setCurrentTopic(topic)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all ${
                                currentTopic.id === topic.id
                                    ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {topic.id === TopicId.SAMPLING_TABLE ? <Calculator className="w-4 h-4"/> :
                                    <BookOpen className="w-4 h-4"/>}
                                {topic.title}
                            </div>
                            {currentTopic.id === topic.id && <ChevronRight className="w-4 h-4 opacity-50"/>}
                        </button>
                    ))}
                </nav>

                <div className="p-6 mt-auto">
                    <div className="bg-slate-900 rounded-xl p-4 text-center">
                        <p className="text-slate-400 text-xs mb-2">Powered by</p>
                        <div className="text-white font-bold flex items-center justify-center gap-1">
                            <span>Google Gemini</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto max-w-5xl mx-auto w-full">
                <header className="mb-8 pb-6 border-b border-slate-200">
                    <h1 className="text-3xl font-bold text-slate-900">{currentTopic.title}</h1>
                    <p className="text-slate-500 mt-2 text-lg">
                        <MathRenderer text={currentTopic.description}/>
                    </p>
                </header>

                {renderContent()}
            </main>

            {/* AI Tutor Chat Overlay */}
            <Tutor/>
        </div>
    );
};

export default App;
