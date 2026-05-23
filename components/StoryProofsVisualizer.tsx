import React, {useState} from 'react';
import MathRenderer from './MathRenderer';
import {Crown, Users, RefreshCw} from 'lucide-react';

const StoryProofsVisualizer: React.FC = () => {
    const [n, setN] = useState(6);
    const [k, setK] = useState(3);

    // Keep k valid relative to n
    React.useEffect(() => {
        if (k >= n) {
            setK(n - 1 >= 2 ? n - 1 : 2);
        }
    }, [n, k]);

    // Helpers to compute combinations for representation
    const factorial = (num: number): number => (num <= 1 ? 1 : num * factorial(num - 1));
    const combinations = (n: number, k: number) => {
        if (k < 0 || k > n) return 0;
        return factorial(n) / (factorial(k) * factorial(n - k));
    };

    const sideACount = combinations(n, k) * k;
    const sideBCount = n * combinations(n - 1, k - 1);

    const peopleAvatars = Array.from({length: n}, (_, i) => ({
        id: i + 1,
        letter: String.fromCharCode(65 + i), // A, B, C...
    }));

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-4xl mx-auto shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-2">The Committee & Chair Story</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                A <strong>story proof</strong> proves that two algebraic expressions are equal by showing they count the 
                exact same group of objects in two different ways. Here, we prove the identity:
                <span className="block my-3 text-center text-lg font-bold text-indigo-600">
                    <MathRenderer text="$$k\binom{n}{k} = n\binom{n-1}{k-1}$$" />
                </span>
                <strong>Goal:</strong> Choose a committee of size <MathRenderer text="$k$"/> from a group of <MathRenderer text="$n$"/> people, where exactly one member of the committee is designated as the **Chair**.
            </p>

            {/* Slider Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                        <span>Total Candidates (<MathRenderer text="$n$"/>)</span>
                        <span className="text-indigo-600 font-bold">{n}</span>
                    </div>
                    <input
                        type="range" min="3" max="8" value={n} onChange={(e) => setN(parseInt(e.target.value))}
                        className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                        <span>Committee Size (<MathRenderer text="$k$"/>)</span>
                        <span className="text-indigo-600 font-bold">{k}</span>
                    </div>
                    <input
                        type="range" min="2" max={n - 1 || 2} value={k} onChange={(e) => setK(parseInt(e.target.value))}
                        className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>

            {/* Interactive Side-By-Side Visual Stories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                
                {/* Story A: Choose Committee First */}
                <div className="border border-slate-200 rounded-xl p-5 bg-indigo-50/20 relative flex flex-col">
                    <span className="absolute top-4 right-4 text-[10px] uppercase font-extrabold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">Story A</span>
                    <h4 className="text-md font-bold text-indigo-900 mb-4 pr-12">Method 1: Choose Committee, then Chair</h4>
                    
                    <div className="space-y-6 flex-1">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 mb-2">Step 1: Choose <MathRenderer text="$k$"/> members from <MathRenderer text="$n$"/> candidates</p>
                            {/* Visualizing committee highlight */}
                            <div className="flex gap-2 flex-wrap">
                                {peopleAvatars.map((person, idx) => {
                                    const isSelected = idx < k;
                                    return (
                                        <div
                                            key={person.id}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 ${
                                                isSelected 
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md scale-105' 
                                                    : 'bg-white border-slate-200 text-slate-400 opacity-60'
                                            }`}
                                        >
                                            {person.letter}
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1.5">
                                Number of ways to do this: <MathRenderer text={`$\\binom{n}{k} = \\binom{${n}}{${k}} = ${combinations(n, k)}$`} />
                            </p>
                        </div>

                        <div className="border-t border-slate-200/50 pt-4">
                            <p className="text-xs font-semibold text-slate-500 mb-2">Step 2: Choose 1 of those <MathRenderer text="$k$"/> members to be Chair</p>
                            <div className="flex gap-2 flex-wrap">
                                {peopleAvatars.map((person, idx) => {
                                    const isSelected = idx < k;
                                    const isChair = idx === 0; // Let's make the first one chair
                                    return (
                                        <div
                                            key={person.id}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all relative border-2 ${
                                                isChair
                                                    ? 'bg-amber-500 border-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)] scale-110'
                                                    : isSelected
                                                        ? 'bg-indigo-600 border-indigo-600 text-white'
                                                        : 'bg-white border-slate-200 text-slate-400 opacity-60'
                                            }`}
                                        >
                                            {person.letter}
                                            {isChair && (
                                                <Crown className="w-3.5 h-3.5 text-amber-300 absolute -top-2.5 -right-0.5 transform rotate-12 drop-shadow-sm" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1.5">
                                Number of ways to choose the Chair: <MathRenderer text={`$k = ${k}$`} />
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-indigo-100 bg-indigo-50/50 p-3 rounded-lg text-xs text-indigo-950 font-semibold flex justify-between items-center">
                        <span>Total Product:</span>
                        <span className="font-mono text-sm text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 font-bold">
                            <MathRenderer text={`$${k} \\times \\binom{${n}}{${k}} = ${sideACount}$`} />
                        </span>
                    </div>
                </div>

                {/* Story B: Choose Chair First */}
                <div className="border border-slate-200 rounded-xl p-5 bg-emerald-50/20 relative flex flex-col">
                    <span className="absolute top-4 right-4 text-[10px] uppercase font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">Story B</span>
                    <h4 className="text-md font-bold text-emerald-900 mb-4 pr-12">Method 2: Choose Chair, then rest of Committee</h4>
                    
                    <div className="space-y-6 flex-1">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 mb-2">Step 1: Choose 1 Chair from all <MathRenderer text="$n$"/> candidates</p>
                            <div className="flex gap-2 flex-wrap">
                                {peopleAvatars.map((person, idx) => {
                                    const isChair = idx === 0;
                                    return (
                                        <div
                                            key={person.id}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all relative border-2 ${
                                                isChair
                                                    ? 'bg-amber-500 border-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)] scale-110'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:scale-105'
                                            }`}
                                        >
                                            {person.letter}
                                            {isChair && (
                                                <Crown className="w-3.5 h-3.5 text-amber-300 absolute -top-2.5 -right-0.5 transform rotate-12 drop-shadow-sm" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1.5">
                                Number of ways to choose the Chair: <MathRenderer text={`$n = ${n}$`} />
                            </p>
                        </div>

                        <div className="border-t border-slate-200/50 pt-4">
                            <p className="text-xs font-semibold text-slate-500 mb-2">Step 2: Choose the remaining <MathRenderer text="$k-1$"/> members from the <MathRenderer text="$n-1$"/> candidates left</p>
                            <div className="flex gap-2 flex-wrap">
                                {peopleAvatars.map((person, idx) => {
                                    const isChair = idx === 0;
                                    const isSelectedInRemaining = idx > 0 && idx < k;
                                    return (
                                        <div
                                            key={person.id}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all relative border-2 ${
                                                isChair
                                                    ? 'bg-amber-500/50 border-amber-400 text-amber-900 opacity-50'
                                                    : isSelectedInRemaining
                                                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md scale-105'
                                                        : 'bg-white border-slate-200 text-slate-400 opacity-60'
                                            }`}
                                        >
                                            {person.letter}
                                            {isChair && (
                                                <Crown className="w-3.5 h-3.5 text-amber-500 absolute -top-2.5 -right-0.5 transform rotate-12" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1.5">
                                Number of ways to fill remaining slots: <MathRenderer text={`$\\binom{n-1}{k-1} = \\binom{${n - 1}}{${k - 1}} = ${combinations(n - 1, k - 1)}$`} />
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-emerald-100 bg-emerald-50/50 p-3 rounded-lg text-xs text-emerald-950 font-semibold flex justify-between items-center">
                        <span>Total Product:</span>
                        <span className="font-mono text-sm text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 font-bold">
                            <MathRenderer text={`$${n} \\times \\binom{${n - 1}}{${k - 1}} = ${sideBCount}$`} />
                        </span>
                    </div>
                </div>

            </div>

            {/* Bottom Proof Matching Card */}
            <div className="bg-slate-900 text-slate-50 rounded-xl p-5 shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-800 rounded-lg text-emerald-400">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-0.5">The Double Counting Verdict</h4>
                        <p className="text-xs text-slate-400">Both methods count the exact same physical structures, meaning the formulas must be equal.</p>
                    </div>
                </div>

                <div className="text-center font-mono font-bold bg-slate-800/80 px-4 py-2 border border-slate-700 rounded-lg">
                    <span className="text-indigo-400">{sideACount}</span>
                    <span className="mx-2 text-white">=</span>
                    <span className="text-emerald-400">{sideBCount}</span>
                </div>
            </div>
        </div>
    );
};

export default StoryProofsVisualizer;
