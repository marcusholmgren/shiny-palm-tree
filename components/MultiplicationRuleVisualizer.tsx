import React, {useState, useMemo} from 'react';
import MathRenderer from './MathRenderer';
import {RefreshCw} from 'lucide-react';

interface OutfitItem {
    id: number;
    label: string;
    color: string; // Tailwind hex color
    bgClass: string;
}

const MultiplicationRuleVisualizer: React.FC = () => {
    const [numShirts, setNumShirts] = useState(3);
    const [numPants, setNumPants] = useState(3);
    const [numShoes, setNumShoes] = useState(2);

    // Selected items forming the current combination path
    const [selectedShirt, setSelectedShirt] = useState(0);
    const [selectedPants, setSelectedPants] = useState(0);
    const [selectedShoes, setSelectedShoes] = useState(0);

    // Reset selection if sliders reduce count
    React.useEffect(() => {
        if (selectedShirt >= numShirts) setSelectedShirt(0);
    }, [numShirts, selectedShirt]);

    React.useEffect(() => {
        if (selectedPants >= numPants) setSelectedPants(0);
    }, [numPants, selectedPants]);

    React.useEffect(() => {
        if (selectedShoes >= numShoes) setSelectedShoes(0);
    }, [numShoes, selectedShoes]);

    // Data lists for the stages
    const shirtsList: OutfitItem[] = useMemo(() => [
        { id: 0, label: 'Red Shirt', color: '#EF4444', bgClass: 'bg-red-500' },
        { id: 1, label: 'Blue Shirt', color: '#3B82F6', bgClass: 'bg-blue-500' },
        { id: 2, label: 'Green Shirt', color: '#10B981', bgClass: 'bg-emerald-500' },
        { id: 3, label: 'Yellow Shirt', color: '#F59E0B', bgClass: 'bg-amber-500' },
        { id: 4, label: 'Purple Shirt', color: '#8B5CF6', bgClass: 'bg-violet-500' },
    ].slice(0, numShirts), [numShirts]);

    const pantsList: OutfitItem[] = useMemo(() => [
        { id: 0, label: 'Black Jeans', color: '#1F2937', bgClass: 'bg-slate-800' },
        { id: 1, label: 'Blue Jeans', color: '#2563EB', bgClass: 'bg-blue-600' },
        { id: 2, label: 'Grey Chinos', color: '#6B7280', bgClass: 'bg-gray-500' },
        { id: 3, label: 'White Pants', color: '#E5E7EB', bgClass: 'bg-slate-200' },
    ].slice(0, numPants), [numPants]);

    const shoesList: OutfitItem[] = useMemo(() => [
        { id: 0, label: 'White Sneakers', color: '#D1D5DB', bgClass: 'bg-slate-300' },
        { id: 1, label: 'Brown Boots', color: '#B45309', bgClass: 'bg-amber-800' },
        { id: 2, label: 'Black Loafers', color: '#111827', bgClass: 'bg-black' },
    ].slice(0, numShoes), [numShoes]);

    const totalCombinations = numShirts * numPants * numShoes;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-4xl mx-auto shadow-sm">
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                
                {/* Visual SVG Branching Path Grid */}
                <div className="flex-1 min-h-[300px] bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col relative overflow-hidden">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">Interactive Combination Map</h4>
                    
                    <div className="flex-1 flex justify-between items-center relative py-6">
                        {/* Connecting Path SVGs */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                            {/* Draw lines from all shirts to all pants, and all pants to all shoes */}
                            {shirtsList.map((shirt) => {
                                const shirtY = (shirt.id / (numShirts - 1 || 1)) * 80 + 10; // % position
                                return pantsList.map((pants) => {
                                    const pantsY = (pants.id / (numPants - 1 || 1)) * 80 + 10;
                                    const isActive = selectedShirt === shirt.id && selectedPants === pants.id;
                                    return (
                                        <line
                                            key={`s${shirt.id}-p${pants.id}`}
                                            x1="16%"
                                            y1={`${shirtY}%`}
                                            x2="50%"
                                            y2={`${pantsY}%`}
                                            stroke={isActive ? '#6366F1' : '#E2E8F0'}
                                            strokeWidth={isActive ? '3' : '1'}
                                            strokeDasharray={isActive ? 'none' : '2 2'}
                                            className="transition-all duration-300"
                                        />
                                    );
                                });
                            })}

                            {pantsList.map((pants) => {
                                const pantsY = (pants.id / (numPants - 1 || 1)) * 80 + 10;
                                return shoesList.map((shoes) => {
                                    const shoesY = (shoes.id / (numShoes - 1 || 1)) * 80 + 10;
                                    const isActive = selectedPants === pants.id && selectedShoes === shoes.id;
                                    return (
                                        <line
                                            key={`p${pants.id}-sh${shoes.id}`}
                                            x1="50%"
                                            y1={`${pantsY}%`}
                                            x2="84%"
                                            y2={`${shoesY}%`}
                                            stroke={isActive ? '#10B981' : '#E2E8F0'}
                                            strokeWidth={isActive ? '3' : '1'}
                                            strokeDasharray={isActive ? 'none' : '2 2'}
                                            className="transition-all duration-300"
                                        />
                                    );
                                });
                            })}
                        </svg>

                        {/* Column 1: Shirts */}
                        <div className="w-16 flex flex-col justify-between h-full z-10">
                            {shirtsList.map((shirt) => (
                                <button
                                    key={shirt.id}
                                    onClick={() => setSelectedShirt(shirt.id)}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                        selectedShirt === shirt.id
                                            ? 'scale-110 shadow-lg border-2 border-indigo-500 ring-4 ring-indigo-100'
                                            : 'opacity-70 hover:opacity-100 hover:scale-105 border border-slate-200'
                                    } bg-white`}
                                    title={shirt.label}
                                >
                                    <span className={`w-6 h-6 rounded ${shirt.bgClass} shadow-inner`} />
                                </button>
                            ))}
                        </div>

                        {/* Column 2: Pants */}
                        <div className="w-16 flex flex-col justify-between h-full z-10">
                            {pantsList.map((pants) => (
                                <button
                                    key={pants.id}
                                    onClick={() => setSelectedPants(pants.id)}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                        selectedPants === pants.id
                                            ? 'scale-110 shadow-lg border-2 border-indigo-500 ring-4 ring-indigo-100'
                                            : 'opacity-70 hover:opacity-100 hover:scale-105 border border-slate-200'
                                    } bg-white`}
                                    title={pants.label}
                                >
                                    <span className={`w-6 h-3 rounded ${pants.bgClass} shadow-inner`} />
                                </button>
                            ))}
                        </div>

                        {/* Column 3: Shoes */}
                        <div className="w-16 flex flex-col justify-between h-full z-10">
                            {shoesList.map((shoes) => (
                                <button
                                    key={shoes.id}
                                    onClick={() => setSelectedShoes(shoes.id)}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                        selectedShoes === shoes.id
                                            ? 'scale-110 shadow-lg border-2 border-indigo-500 ring-4 ring-indigo-100'
                                            : 'opacity-70 hover:opacity-100 hover:scale-105 border border-slate-200'
                                    } bg-white`}
                                    title={shoes.label}
                                >
                                    <span className={`w-8 h-4 rounded-b-md ${shoes.bgClass} shadow-inner`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="text-center text-xs text-slate-500 font-semibold mt-4 py-1.5 bg-slate-100 border border-slate-200 rounded-lg">
                        Selected: <span className="text-indigo-600 font-bold">{shirtsList[selectedShirt]?.label}</span> + <span className="text-indigo-600 font-bold">{pantsList[selectedPants]?.label}</span> + <span className="text-indigo-600 font-bold">{shoesList[selectedShoes]?.label}</span>
                    </div>
                </div>

                {/* Controls and calculations */}
                <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Stage Multipliers</h3>
                        <p className="text-sm text-slate-500 mb-4">Set the size of each choice stage to see the options grow.</p>
                        
                        <div className="space-y-4">
                            {/* Shirt slider */}
                            <div>
                                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                                    <span>Shirts Stage (<MathRenderer text="$n_1$"/>)</span>
                                    <span className="text-indigo-600 font-mono font-bold">{numShirts}</span>
                                </div>
                                <input
                                    type="range" min="1" max="5" value={numShirts} onChange={(e) => setNumShirts(parseInt(e.target.value))}
                                    className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            {/* Pants slider */}
                            <div>
                                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                                    <span>Pants Stage (<MathRenderer text="$n_2$"/>)</span>
                                    <span className="text-indigo-600 font-mono font-bold">{numPants}</span>
                                </div>
                                <input
                                    type="range" min="1" max="4" value={numPants} onChange={(e) => setNumPants(parseInt(e.target.value))}
                                    className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            {/* Shoes slider */}
                            <div>
                                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                                    <span>Shoes Stage (<MathRenderer text="$n_3$"/>)</span>
                                    <span className="text-indigo-600 font-mono font-bold">{numShoes}</span>
                                </div>
                                <input
                                    type="range" min="1" max="3" value={numShoes} onChange={(e) => setNumShoes(parseInt(e.target.value))}
                                    className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Calculation Panel */}
                    <div className="bg-slate-900 text-slate-50 rounded-xl p-5 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <RefreshCw className="w-20 h-20" />
                        </div>
                        
                        <h4 className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Formula Product</h4>
                        <div className="text-xl font-mono text-emerald-400 font-bold mb-4">
                            <MathRenderer text={`$$n_1 \\times n_2 \\times n_3 = ${numShirts} \\times ${numPants} \\times ${numShoes}$$`} />
                        </div>

                        <h4 className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Total Combinations</h4>
                        <div className="text-3xl font-extrabold text-white font-mono">
                            {totalCombinations}
                        </div>

                        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
                            <strong>Multiplication Rule:</strong> Since choosing a shirt does not restrict your choice of pants, and that doesn't restrict your shoes, the stages are independent. The total combinations are the product of the possibilities!
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MultiplicationRuleVisualizer;
