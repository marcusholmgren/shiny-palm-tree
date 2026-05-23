import React, {useState} from 'react';
import MathRenderer from './MathRenderer';
import {RefreshCw, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, CheckCircle2} from 'lucide-react';

const ComplementCountingVisualizer: React.FC = () => {
    const [numRolls, setNumRolls] = useState<1 | 2 | 3>(2);

    // Roll statistics
    const totalOutcomes = Math.pow(6, numRolls);
    const complementOutcomes = Math.pow(5, numRolls); // No 6s
    const favorableOutcomes = totalOutcomes - complementOutcomes; // At least one 6

    const probFavorable = favorableOutcomes / totalOutcomes;
    const probComplement = complementOutcomes / totalOutcomes;

    // Helper to render die SVG or icon based on value
    const renderDie = (val: number, sizeClass = "w-4 h-4") => {
        switch (val) {
            case 1: return <Dice1 className={`${sizeClass}`} />;
            case 2: return <Dice2 className={`${sizeClass}`} />;
            case 3: return <Dice3 className={`${sizeClass}`} />;
            case 4: return <Dice4 className={`${sizeClass}`} />;
            case 5: return <Dice5 className={`${sizeClass}`} />;
            default: return <Dice6 className={`${sizeClass}`} />;
        }
    };

    // Render outcomes for 2 rolls as a grid (36 outcomes)
    const renderGridForTwoRolls = () => {
        const grid = [];
        for (let r1 = 1; r1 <= 6; r1++) {
            for (let r2 = 1; r2 <= 6; r2++) {
                const hasSix = r1 === 6 || r2 === 6;
                grid.push({ r1, r2, hasSix });
            }
        }

        return (
            <div className="grid grid-cols-6 gap-1.5 max-w-[280px] mx-auto">
                {grid.map((cell, idx) => (
                    <div
                        key={idx}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center p-1 border transition-all ${
                            cell.hasSix
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm font-bold scale-[1.02]'
                                : 'bg-slate-100/50 border-slate-200 text-slate-400 opacity-60'
                        }`}
                        title={`Roll 1: ${cell.r1}, Roll 2: ${cell.r2}`}
                    >
                        <div className="flex gap-0.5">
                            {renderDie(cell.r1, "w-3 h-3")}
                            {renderDie(cell.r2, "w-3 h-3")}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const getCaseworkLatex = () => {
        if (numRolls === 1) {
            return `$$P(\\text{at least one 6}) = P(\\text{exactly one 6}) = \\frac{1}{6} \\approx 0.167$$`;
        }
        if (numRolls === 2) {
            return `$$P(\\text{exactly one 6}) = \\frac{10}{36},\\quad P(\\text{exactly two 6s}) = \\frac{1}{36}$$
                    $$P(A) = \\frac{10}{36} + \\frac{1}{36} = \\frac{11}{36} \\approx 0.306$$`;
        }
        return `$$P(\\text{exactly one 6}) = \\frac{75}{216},\\quad P(\\text{exactly two}) = \\frac{15}{216},\\quad P(\\text{exactly three}) = \\frac{1}{216}$$
                $$P(A) = \\frac{75}{216} + \\frac{15}{216} + \\frac{1}{216} = \\frac{91}{216} \\approx 0.421$$`;
    };

    const getComplementLatex = () => {
        if (numRolls === 1) {
            return `$$P(A^c) = P(\\text{no 6s}) = \\frac{5}{6}$$
                    $$P(A) = 1 - P(A^c) = 1 - \\frac{5}{6} = \\frac{1}{6}$$`;
        }
        if (numRolls === 2) {
            return `$$P(A^c) = P(\\text{no 6s}) = \\left(\\frac{5}{6}\\right)^2 = \\frac{25}{36}$$
                    $$P(A) = 1 - P(A^c) = 1 - \\frac{25}{36} = \\frac{11}{36}$$`;
        }
        return `$$P(A^c) = P(\\text{no 6s}) = \\left(\\frac{5}{6}\\right)^3 = \\frac{125}{216}$$
                $$P(A) = 1 - P(A^c) = 1 - \\frac{125}{216} = \\frac{91}{216}$$`;
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-4xl mx-auto shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Casework vs. Complementary Counting</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                When a problem asks for the probability of <strong>"at least one"</strong> event, direct counting (casework) 
                can become incredibly tedious as the number of stages increases. Counting the **complement** (what we don't want) 
                is often vastly faster!
            </p>

            {/* Stage Selector */}
            <div className="flex justify-center gap-3 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200 max-w-md mx-auto">
                <span className="text-sm font-semibold text-slate-600 self-center">Number of rolls:</span>
                {[1, 2, 3].map(val => (
                    <button
                        key={val}
                        onClick={() => setNumRolls(val as 1 | 2 | 3)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            numRolls === val
                                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100/50'
                        }`}
                    >
                        {val} {val === 1 ? 'Roll' : 'Rolls'}
                    </button>
                ))}
            </div>

            {/* Two Column Approaches */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-8">
                
                {/* Method A: Direct Casework */}
                <div className="border border-slate-200 rounded-xl p-5 bg-rose-50/10 flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full">Approach A</span>
                        <h4 className="text-md font-bold text-rose-900 mt-2 mb-4">Direct Counting (Casework)</h4>
                        
                        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                            Count every distinct way we can get exactly 1, exactly 2, or exactly 3 sixes, then add their probabilities together.
                        </p>

                        <div className="space-y-4 mb-6">
                            <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-semibold text-rose-800">
                                <MathRenderer text={getCaseworkLatex()} />
                            </div>
                        </div>
                    </div>

                    <div className="p-3 bg-rose-50/50 rounded-lg text-xs text-rose-950 font-semibold border border-rose-100 flex justify-between items-center mt-auto">
                        <span>Direct Result:</span>
                        <span className="font-mono text-sm text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200 font-bold">
                            {favorableOutcomes} / {totalOutcomes}
                        </span>
                    </div>
                </div>

                {/* Method B: Complement Counting */}
                <div className="border border-slate-200 rounded-xl p-5 bg-indigo-50/10 flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">Approach B</span>
                        <h4 className="text-md font-bold text-indigo-900 mt-2 mb-4">Complementary Counting</h4>
                        
                        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                            Find the opposite event (getting **no** sixes at all), calculate its probability, and subtract from 1.
                        </p>

                        <div className="space-y-4 mb-6">
                            <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-semibold text-indigo-800">
                                <MathRenderer text={getComplementLatex()} />
                            </div>
                        </div>
                    </div>

                    <div className="p-3 bg-indigo-50/50 rounded-lg text-xs text-indigo-950 font-semibold border border-indigo-100 flex justify-between items-center mt-auto">
                        <span>Complement Result:</span>
                        <span className="font-mono text-sm text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 font-bold">
                            1 - {complementOutcomes}/{totalOutcomes}
                        </span>
                    </div>
                </div>

            </div>

            {/* Outcome grid for 2 rolls */}
            {numRolls === 2 && (
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/30 text-center mb-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Visualizing the 36 Outcomes (2 Rolls)</h4>
                    {renderGridForTwoRolls()}
                    <div className="mt-4 flex justify-center gap-6 text-xs font-semibold text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 bg-indigo-100 border border-indigo-200 rounded" />
                            <span>At least one 6 (<MathRenderer text={`$11$`} /> Favorable)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 bg-slate-100 border border-slate-200 rounded" />
                            <span>No 6s (<MathRenderer text={`$25$`} /> Complement)</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Verdict Panel */}
            <div className="bg-slate-900 text-slate-50 rounded-xl p-5 shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-800 rounded-lg text-emerald-400">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-0.5">The Lesson</h4>
                        <p className="text-xs text-slate-400">As the number of rolls increases, casework paths multiply exponentially, while the complement path always takes exactly one step!</p>
                    </div>
                </div>

                <div className="text-center font-mono font-bold bg-slate-800/80 px-4 py-2 border border-slate-700 rounded-lg text-emerald-400 text-lg">
                    P(A) = {(probFavorable * 100).toFixed(1)}%
                </div>
            </div>
        </div>
    );
};

export default ComplementCountingVisualizer;
