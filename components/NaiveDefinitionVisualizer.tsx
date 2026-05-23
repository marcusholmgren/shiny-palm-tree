import React, {useState} from 'react';
import MathRenderer from './MathRenderer';
import {Plus, Minus, RefreshCw} from 'lucide-react';

interface Marble {
    id: number;
    color: 'red' | 'blue' | 'green';
    x: number; // Percentage offset in jar
    y: number; // Percentage offset in jar
}

type TargetEvent = 'red' | 'blue' | 'green' | 'red_blue' | 'blue_green' | 'any';

const NaiveDefinitionVisualizer: React.FC = () => {
    const [redCount, setRedCount] = useState(4);
    const [blueCount, setBlueCount] = useState(3);
    const [greenCount, setGreenCount] = useState(2);
    const [targetEvent, setTargetEvent] = useState<TargetEvent>('red');

    // Generate coordinates pseudo-randomly but deterministically inside the jar
    // We want marbles to sit nicely and not overlap completely.
    const generateMarbles = (): Marble[] => {
        const list: Marble[] = [];
        let idCounter = 1;

        // Deterministic placements to prevent marble overlaps
        const placements = [
            { x: 30, y: 75 }, { x: 50, y: 78 }, { x: 70, y: 75 },
            { x: 40, y: 60 }, { x: 60, y: 62 }, { x: 20, y: 55 }, { x: 80, y: 58 },
            { x: 50, y: 42 }, { x: 30, y: 38 }, { x: 70, y: 40 },
            { x: 42, y: 22 }, { x: 58, y: 25 }, { x: 25, y: 20 }, { x: 75, y: 22 },
            { x: 50, y: 8 },  { x: 35, y: 10 }, { x: 65, y: 12 }
        ];

        let index = 0;
        const addMarblesOfColor = (count: number, color: 'red' | 'blue' | 'green') => {
            for (let i = 0; i < count; i++) {
                const pos = placements[index % placements.length] || { x: 50, y: 50 };
                // Add slight jitter so they look organic
                const jitterX = (idCounter * 7) % 6 - 3;
                const jitterY = (idCounter * 13) % 4 - 2;
                list.push({
                    id: idCounter++,
                    color,
                    x: Math.max(12, Math.min(88, pos.x + jitterX)),
                    y: Math.max(8, Math.min(82, pos.y + jitterY))
                });
                index++;
            }
        };

        addMarblesOfColor(redCount, 'red');
        addMarblesOfColor(blueCount, 'blue');
        addMarblesOfColor(greenCount, 'green');

        return list;
    };

    const marbles = generateMarbles();
    const totalCount = redCount + blueCount + greenCount;

    const isFavorable = (color: 'red' | 'blue' | 'green'): boolean => {
        if (targetEvent === 'any') return true;
        if (targetEvent === 'red') return color === 'red';
        if (targetEvent === 'blue') return color === 'blue';
        if (targetEvent === 'green') return color === 'green';
        if (targetEvent === 'red_blue') return color === 'red' || color === 'blue';
        if (targetEvent === 'blue_green') return color === 'blue' || color === 'green';
        return false;
    };

    const favorableCount = marbles.filter(m => isFavorable(m.color)).length;
    const probability = totalCount > 0 ? favorableCount / totalCount : 0;

    const getEventLabel = () => {
        switch (targetEvent) {
            case 'red': return 'Drawing a Red marble';
            case 'blue': return 'Drawing a Blue marble';
            case 'green': return 'Drawing a Green marble';
            case 'red_blue': return 'Drawing a Red OR Blue marble';
            case 'blue_green': return 'Drawing a Blue OR Green marble';
            case 'any': return 'Drawing ANY marble';
        }
    };

    const getFormulaLatex = () => {
        if (totalCount === 0) return '$$P(A) = 0$$';
        return `$$P(A) = \\frac{|A|}{|S|} = \\frac{${favorableCount}}{${totalCount}} \\approx ${probability.toFixed(3)}$$`;
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-4xl mx-auto shadow-sm">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
                
                {/* Visualizer Jar */}
                <div className="w-full max-w-[320px] flex-shrink-0 flex flex-col items-center">
                    <div className="w-full aspect-[4/5] bg-slate-50/50 border-[6px] border-slate-300/80 rounded-b-[40px] rounded-t-[20px] relative shadow-inner overflow-hidden flex items-end p-4">
                        {/* Jar neck detailing */}
                        <div className="absolute top-0 inset-x-8 h-4 border-b border-slate-300/50 bg-slate-200/40 rounded-t-lg" />
                        
                        {/* Jar contents/marbles */}
                        <div className="relative w-full h-[90%]">
                            {totalCount === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-medium italic">
                                    The jar is empty!
                                </div>
                            )}
                            
                            {marbles.map(marble => {
                                const favorable = isFavorable(marble.color);
                                let colorClass = '';
                                if (marble.color === 'red') {
                                    colorClass = favorable 
                                        ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)] ring-2 ring-rose-300' 
                                        : 'bg-rose-500/30 border border-rose-200/50';
                                } else if (marble.color === 'blue') {
                                    colorClass = favorable 
                                        ? 'bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)] ring-2 ring-indigo-300' 
                                        : 'bg-indigo-500/30 border border-indigo-200/50';
                                } else {
                                    colorClass = favorable 
                                        ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)] ring-2 ring-emerald-300' 
                                        : 'bg-emerald-500/30 border border-emerald-200/50';
                                }

                                return (
                                    <div
                                        key={marble.id}
                                        style={{
                                            bottom: `${marble.y}%`,
                                            left: `${marble.x}%`,
                                            transform: 'translate(-50%, 50%)'
                                        }}
                                        className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-all duration-300 ${colorClass} ${
                                            favorable ? 'scale-105 animate-[pulse_2s_infinite]' : 'scale-95'
                                        }`}
                                    >
                                        {favorable && '✓'}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="mt-4 text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-slate-300 rounded-full border border-slate-400" />
                        Sample Space <MathRenderer text={`$|S| = ${totalCount}$`} />
                    </div>
                </div>

                {/* Controls and Calculations */}
                <div className="flex-1 w-full space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Configure Jar Contents</h3>
                        <p className="text-sm text-slate-500 mb-4">Add or remove marbles to adjust the sizes of your sample sets.</p>
                        
                        <div className="grid grid-cols-3 gap-4">
                            {/* Red Counter */}
                            <div className="flex flex-col items-center p-3 bg-rose-50/50 border border-rose-100 rounded-xl">
                                <span className="text-xs font-bold text-rose-700 mb-2">Red Marbles</span>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setRedCount(Math.max(0, redCount - 1))}
                                        className="p-1.5 bg-white border border-rose-200 rounded-lg text-rose-600 hover:bg-rose-100/50 active:scale-95 transition-all"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="font-mono font-bold text-rose-800 text-lg w-6 text-center">{redCount}</span>
                                    <button 
                                        onClick={() => setRedCount(Math.min(8, redCount + 1))}
                                        className="p-1.5 bg-white border border-rose-200 rounded-lg text-rose-600 hover:bg-rose-100/50 active:scale-95 transition-all"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Blue Counter */}
                            <div className="flex flex-col items-center p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                                <span className="text-xs font-bold text-indigo-700 mb-2">Blue Marbles</span>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setBlueCount(Math.max(0, blueCount - 1))}
                                        className="p-1.5 bg-white border border-indigo-200 rounded-lg text-indigo-600 hover:bg-indigo-100/50 active:scale-95 transition-all"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="font-mono font-bold text-indigo-800 text-lg w-6 text-center">{blueCount}</span>
                                    <button 
                                        onClick={() => setBlueCount(Math.min(8, blueCount + 1))}
                                        className="p-1.5 bg-white border border-indigo-200 rounded-lg text-indigo-600 hover:bg-indigo-100/50 active:scale-95 transition-all"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Green Counter */}
                            <div className="flex flex-col items-center p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                                <span className="text-xs font-bold text-emerald-700 mb-2">Green Marbles</span>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setGreenCount(Math.max(0, greenCount - 1))}
                                        className="p-1.5 bg-white border border-emerald-200 rounded-lg text-emerald-600 hover:bg-emerald-100/50 active:scale-95 transition-all"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="font-mono font-bold text-emerald-800 text-lg w-6 text-center">{greenCount}</span>
                                    <button 
                                        onClick={() => setGreenCount(Math.min(8, greenCount + 1))}
                                        className="p-1.5 bg-white border border-emerald-200 rounded-lg text-emerald-600 hover:bg-emerald-100/50 active:scale-95 transition-all"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2.5">Define Target Event (Event <MathRenderer text="$A$" />)</h3>
                        <div className="flex flex-wrap gap-2">
                            {(['red', 'blue', 'green', 'red_blue', 'blue_green', 'any'] as TargetEvent[]).map(ev => {
                                let label = '';
                                if (ev === 'red') label = 'Red Only';
                                else if (ev === 'blue') label = 'Blue Only';
                                else if (ev === 'green') label = 'Green Only';
                                else if (ev === 'red_blue') label = 'Red or Blue';
                                else if (ev === 'blue_green') label = 'Blue or Green';
                                else label = 'Any Marble';

                                const active = targetEvent === ev;
                                return (
                                    <button
                                        key={ev}
                                        onClick={() => setTargetEvent(ev)}
                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                            active
                                                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Results Container */}
                    <div className="bg-slate-900 text-slate-50 rounded-xl p-5 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <RefreshCw className="w-20 h-20" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <h4 className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Target Event size (|A|)</h4>
                                <p className="text-2xl font-extrabold text-emerald-400 font-mono">
                                    {favorableCount} <span className="text-xs text-slate-400 font-normal">marbles</span>
                                </p>
                            </div>
                            <div>
                                <h4 className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Sample Space size (|S|)</h4>
                                <p className="text-2xl font-extrabold text-white font-mono">
                                    {totalCount} <span className="text-xs text-slate-400 font-normal">marbles</span>
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-slate-800 pt-4">
                            <h4 className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Probability Formula</h4>
                            <div className="text-xl font-mono text-white flex items-center font-bold">
                                <MathRenderer text={getFormulaLatex()} />
                            </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
                            <strong>Intuition:</strong> Since every marble is equally likely to be selected at random, the probability of <strong>{getEventLabel()}</strong> is the size of the target event divided by the size of the sample space.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NaiveDefinitionVisualizer;
