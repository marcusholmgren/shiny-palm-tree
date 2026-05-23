import React, {useState, useEffect} from 'react';
import MathRenderer from './MathRenderer';
import {RefreshCw, HelpCircle, Layers} from 'lucide-react';

const InclusionExclusionVisualizer: React.FC = () => {
    const [sizeA, setSizeA] = useState(45);
    const [sizeB, setSizeB] = useState(40);
    const [intersection, setIntersection] = useState(15);
    const [activeStep, setActiveStep] = useState<'none' | 'add_a' | 'add_b' | 'sub_int'>('none');

    // Keep intersection in valid bounds
    useEffect(() => {
        const maxIntersection = Math.min(sizeA, sizeB);
        if (intersection > maxIntersection) {
            setIntersection(maxIntersection);
        }
    }, [sizeA, sizeB, intersection]);

    const union = sizeA + sizeB - intersection;

    // Calculate dynamic circle coordinates for the Venn Diagram
    // Width is 400, Height is 240, Center Y is 120.
    const centerY = 120;
    
    // Scale slider values to SVG pixel radii
    const rA = sizeA * 1.5;
    const rB = sizeB * 1.5;

    // Distance between circle centers.
    // If intersection is 0, they should just touch or be separate: dist = rA + rB
    // If intersection is max, they should overlap almost completely: dist = |rA - rB|
    const maxDist = rA + rB - 10;
    const minDist = Math.abs(rA - rB);
    const maxIntersection = Math.min(sizeA, sizeB);
    
    // Linearly interpolate center distance based on intersection size
    const intersectionRatio = maxIntersection > 0 ? intersection / maxIntersection : 0;
    const distance = maxDist - intersectionRatio * (maxDist - minDist);

    // Center X coordinates: offset by half the distance from the SVG midpoint (200)
    const cXA = 200 - distance / 2;
    const cXB = 200 + distance / 2;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-4xl mx-auto shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Overlapping Venn Diagrams</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                When finding the size of the **union** of two sets (<MathRenderer text="$|A \cup B|$" />), simply adding their 
                sizes (<MathRenderer text="$|A| + |B|$" />) counts the overlapping elements twice. We must subtract 
                their **intersection** (<MathRenderer text="$|A \cap B|$" />) to correct this double counting.
            </p>

            {/* Config Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                        <span>Set A Size (<MathRenderer text="$|A|$"/>)</span>
                        <span className="text-indigo-600 font-bold">{sizeA}</span>
                    </div>
                    <input
                        type="range" min="20" max="60" value={sizeA} onChange={(e) => setSizeA(parseInt(e.target.value))}
                        className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                        <span>Set B Size (<MathRenderer text="$|B|$"/>)</span>
                        <span className="text-emerald-600 font-bold">{sizeB}</span>
                    </div>
                    <input
                        type="range" min="20" max="60" value={sizeB} onChange={(e) => setSizeB(parseInt(e.target.value))}
                        className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                        <span>Intersection Size (<MathRenderer text="$|A \cap B|$"/>)</span>
                        <span className="text-amber-500 font-bold">{intersection}</span>
                    </div>
                    <input
                        type="range" min="0" max={Math.min(sizeA, sizeB)} value={intersection} onChange={(e) => setIntersection(parseInt(e.target.value))}
                        className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>

            {/* Formula Stepper Control Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
                <button
                    onClick={() => setActiveStep('none')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        activeStep === 'none'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    Reset Venn Diagram
                </button>
                <button
                    onClick={() => setActiveStep('add_a')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        activeStep === 'add_a'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
                    }`}
                >
                    Step 1: Add |A|
                </button>
                <button
                    onClick={() => setActiveStep('add_b')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        activeStep === 'add_b'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                    }`}
                >
                    Step 2: Add |B| (Overlap Double Counts!)
                </button>
                <button
                    onClick={() => setActiveStep('sub_int')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        activeStep === 'sub_int'
                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                            : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50'
                    }`}
                >
                    Step 3: Subtract |A ∩ B|
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-center">
                
                {/* SVG Venn Diagram */}
                <div className="flex-1 w-full flex justify-center bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[260px] items-center relative overflow-hidden">
                    <svg className="w-full max-w-[400px] h-[240px]" viewBox="0 0 400 240">
                        {/* Define gradients for premium aesthetics */}
                        <defs>
                            <linearGradient id="gradA" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#818CF8" />
                                <stop offset="100%" stopColor="#4F46E5" />
                            </linearGradient>
                            <linearGradient id="gradB" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#34D399" />
                                <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                        </defs>

                        {/* Venn Circle A */}
                        <circle
                            cx={cXA}
                            cy={centerY}
                            r={rA}
                            fill="url(#gradA)"
                            fillOpacity={activeStep === 'add_b' ? '0.2' : activeStep === 'sub_int' ? '0.4' : activeStep === 'none' || activeStep === 'add_a' ? '0.45' : '0.1'}
                            stroke="#4F46E5"
                            strokeWidth={activeStep === 'add_a' || activeStep === 'sub_int' ? '3' : '1.5'}
                            className="transition-all duration-500"
                        />

                        {/* Venn Circle B */}
                        <circle
                            cx={cXB}
                            cy={centerY}
                            r={rB}
                            fill="url(#gradB)"
                            fillOpacity={activeStep === 'add_a' ? '0.2' : activeStep === 'sub_int' ? '0.4' : activeStep === 'none' || activeStep === 'add_b' ? '0.45' : '0.1'}
                            stroke="#059669"
                            strokeWidth={activeStep === 'add_b' || activeStep === 'sub_int' ? '3' : '1.5'}
                            className="transition-all duration-500"
                        />

                        {/* Label overlays inside circles */}
                        <text 
                            x={cXA - rA / 3} 
                            y={centerY} 
                            fill={activeStep === 'add_b' ? '#818CF8' : '#ffffff'} 
                            className="text-sm font-extrabold select-none pointer-events-none transition-all"
                            textAnchor="middle"
                        >
                            A
                        </text>
                        <text 
                            x={cXB + rB / 3} 
                            y={centerY} 
                            fill={activeStep === 'add_a' ? '#34D399' : '#ffffff'} 
                            className="text-sm font-extrabold select-none pointer-events-none transition-all"
                            textAnchor="middle"
                        >
                            B
                        </text>

                        {/* Glow highlight for intersection overlay in step 2 (Double Counting) */}
                        {activeStep === 'add_b' && intersection > 0 && (
                            <ellipse
                                cx={200}
                                cy={centerY}
                                rx={distance < (rA + rB) ? (rA + rB - distance) / 2 : 0}
                                ry={Math.min(rA, rB) * 0.7}
                                fill="#F59E0B"
                                fillOpacity="0.25"
                                className="animate-pulse"
                            />
                        )}
                    </svg>

                    {/* Step Explanations overlayed */}
                    {activeStep === 'add_a' && (
                        <div className="absolute bottom-4 inset-x-4 text-center bg-indigo-600 text-white rounded-lg p-2 text-xs font-semibold animate-in slide-in-from-bottom-2 duration-300">
                            We add all elements in Set A (<MathRenderer text={`$|A| = ${sizeA}$`} />).
                        </div>
                    )}
                    {activeStep === 'add_b' && (
                        <div className="absolute bottom-4 inset-x-4 text-center bg-emerald-600 text-white rounded-lg p-2 text-xs font-semibold animate-in slide-in-from-bottom-2 duration-300">
                            Adding Set B (<MathRenderer text={`$|B| = ${sizeB}$`} />) counts the overlap (<MathRenderer text={`$|A \\cap B| = ${intersection}$`} />) TWICE!
                        </div>
                    )}
                    {activeStep === 'sub_int' && (
                        <div className="absolute bottom-4 inset-x-4 text-center bg-amber-500 text-white rounded-lg p-2 text-xs font-semibold animate-in slide-in-from-bottom-2 duration-300">
                            Subtracting the intersection (<MathRenderer text={`$|A \\cap B| = ${intersection}$`} />) once corrects the total!
                        </div>
                    )}
                </div>

                {/* Calculation Stats column */}
                <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
                    <div className="bg-slate-900 text-slate-50 rounded-xl p-5 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <RefreshCw className="w-20 h-20" />
                        </div>
                        
                        <h4 className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2 text-center">Inclusion-Exclusion Formula</h4>
                        <div className="text-lg font-mono text-emerald-400 font-bold mb-4 text-center overflow-x-auto py-1">
                            <MathRenderer text="$|A \cup B| = \\ |A| + |B| - |A \cap B|$" />
                        </div>

                        <div className="space-y-3 border-t border-slate-800 pt-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-semibold">Set Size A (|A|):</span>
                                <span className="font-mono text-white font-bold">{sizeA}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-semibold">Set Size B (|B|):</span>
                                <span className="font-mono text-white font-bold">{sizeB}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-semibold">Double Overlap (|A ∩ B|):</span>
                                <span className="font-mono text-amber-400 font-bold">-{intersection}</span>
                            </div>
                            
                            <div className="flex justify-between items-center border-t border-dashed border-slate-800 pt-3 text-sm">
                                <span className="text-slate-200 font-bold uppercase tracking-wider">Total Union (|A ∪ B|):</span>
                                <span className="font-mono text-emerald-400 text-lg font-extrabold">{union}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 leading-relaxed flex gap-2">
                        <Layers className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                            <strong>Formula Breakdown:</strong> 
                            <div className="mt-1 font-mono font-bold text-indigo-700 bg-white px-2 py-1 rounded border border-indigo-200 text-center">
                                <MathRenderer text={`$${sizeA} + ${sizeB} - ${intersection} = ${union}$`} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InclusionExclusionVisualizer;
