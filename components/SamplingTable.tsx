import React, {useEffect, useState} from 'react';
import {SamplingMode} from '../types';
import {RefreshCcw, Hash, ArrowRight} from 'lucide-react';
import MathRenderer from './MathRenderer';

export interface SamplingSelection {
    mode: SamplingMode;
    label: string;
    topic: string;
}

interface SamplingTableProps {
    onSelectionChange?: (selection: SamplingSelection) => void;
}

export const getSamplingSelection = (mode: SamplingMode): SamplingSelection => {
    switch (mode) {
        case SamplingMode.ORDERED_WITH_REPLACEMENT:
            return {
                mode,
                label: 'Ordered with replacement',
                topic: 'sampling table: ordered sampling with replacement, where order matters and repeated items are allowed',
            };
        case SamplingMode.ORDERED_NO_REPLACEMENT:
            return {
                mode,
                label: 'Ordered without replacement',
                topic: 'sampling table: ordered sampling without replacement, where order matters and repeated items are not allowed',
            };
        case SamplingMode.UNORDERED_NO_REPLACEMENT:
            return {
                mode,
                label: 'Unordered without replacement',
                topic: 'sampling table: unordered sampling without replacement, where order does not matter and repeated items are not allowed',
            };
        case SamplingMode.UNORDERED_WITH_REPLACEMENT:
            return {
                mode,
                label: 'Unordered with replacement',
                topic: 'sampling table: unordered sampling with replacement, where order does not matter and repeated items are allowed, including stars and bars style problems',
            };
    }
};

const SamplingTable: React.FC<SamplingTableProps> = ({onSelectionChange}) => {
    const [n, setN] = useState(5);
    const [k, setK] = useState(3);
    const [orderMatters, setOrderMatters] = useState(true);
    const [replacement, setReplacement] = useState(true);

    // Determine current mode
    let mode: SamplingMode;
    if (orderMatters && replacement) mode = SamplingMode.ORDERED_WITH_REPLACEMENT;
    else if (orderMatters && !replacement) mode = SamplingMode.ORDERED_NO_REPLACEMENT;
    else if (!orderMatters && !replacement) mode = SamplingMode.UNORDERED_NO_REPLACEMENT;
    else mode = SamplingMode.UNORDERED_WITH_REPLACEMENT;

    // Math helpers
    const factorial = (num: number): number => (num <= 1 ? 1 : num * factorial(num - 1));
    const permutations = (n: number, k: number) => factorial(n) / factorial(n - k);
    const combinations = (n: number, k: number) => factorial(n) / (factorial(k) * factorial(n - k));

    const getResult = () => {
        if (k > n && !replacement) return 0;
        switch (mode) {
            case SamplingMode.ORDERED_WITH_REPLACEMENT:
                return Math.pow(n, k);
            case SamplingMode.ORDERED_NO_REPLACEMENT:
                return permutations(n, k);
            case SamplingMode.UNORDERED_NO_REPLACEMENT:
                return combinations(n, k);
            case SamplingMode.UNORDERED_WITH_REPLACEMENT:
                return combinations(n + k - 1, k);
        }
    };

    const getFormula = () => {
        switch (mode) {
            case SamplingMode.ORDERED_WITH_REPLACEMENT:
                return `$$n^k$$`;
            case SamplingMode.ORDERED_NO_REPLACEMENT:
                return `$$P(n, k) = \\frac{n!}{(n-k)!}$$`;
            case SamplingMode.UNORDERED_NO_REPLACEMENT:
                return `$$\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$$`;
            case SamplingMode.UNORDERED_WITH_REPLACEMENT:
                return `$$\\binom{n+k-1}{k}$$ (Stars & Bars)`;
        }
    };

    const getDescription = () => {
        switch (mode) {
            case SamplingMode.ORDERED_WITH_REPLACEMENT:
                return "Think: A password lock. '1-1-1' is valid, and '1-2' is different from '2-1'.";
            case SamplingMode.ORDERED_NO_REPLACEMENT:
                return "Think: A race with Gold, Silver, Bronze positions. You can't win twice, and order matters.";
            case SamplingMode.UNORDERED_NO_REPLACEMENT:
                return "Think: A poker hand or committee. {A, K, Q} is the same hand as {K, A, Q}. No duplicates.";
            case SamplingMode.UNORDERED_WITH_REPLACEMENT:
                return "Think: Scoops of ice cream in a bowl. You can have 2 Chocolate and 1 Vanilla. Order in the bowl doesn't matter.";
        }
    };

    const result = getResult();
    const selection = getSamplingSelection(mode);

    useEffect(() => {
        onSelectionChange?.(getSamplingSelection(mode));
    }, [mode, onSelectionChange]);

    // Visualization logic
    const renderVisualization = () => {
        const items = Array.from({length: n}, (_, i) => i + 1);

        return (
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-600 mb-2">Interactive Concept</h4>

                <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                    <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-slate-500 mb-1">
              Pool (<MathRenderer text={`$n=${n}$`}/>)
            </span>
                        <div className="flex gap-2 flex-wrap justify-center max-w-[200px]">
                            {items.map(i => (
                                <div key={i}
                                     className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-sm font-bold text-sm">
                                    {i}
                                </div>
                            ))}
                        </div>
                    </div>

                    <ArrowRight className="text-slate-400"/>

                    <div className="flex flex-col items-center">
          <span className="text-xs font-medium text-slate-500 mb-1">
            Selection (<MathRenderer text={`$k=${k}$`}/>)
          </span>

                        {/* Changed from flex flex-wrap to grid grid-cols-3 */}
                        <div className="grid grid-cols-3 gap-2">
                            {Array.from({length: k}).map((_, i) => (
                                <div key={i}
                                     className={`w-10 h-10 border-2 flex-shrink-0 ${orderMatters ? 'border-dashed border-indigo-300' : 'border-slate-300 rounded-full'} flex items-center justify-center bg-white text-slate-400 text-xs`}>
                                    {orderMatters ? `#${i + 1}` : '?'}
                                </div>
                            ))}
                        </div>

                        <div className="mt-2 text-xs text-slate-500">
                            {replacement ? "Refills allowed" : "No refills"}
                        </div>
                    </div>


                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Hash className="w-6 h-6 text-indigo-600"/>
                The Sampling Table
            </h2>

            <div
                className="mb-6 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-indigo-200">
                Current cell: {selection.label}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-indigo-50 p-4 rounded-lg">
                    <label className="flex items-center justify-between cursor-pointer mb-4">
                        <span className="font-medium text-indigo-900">Does Order Matter?</span>
                        <div
                            onClick={() => setOrderMatters(!orderMatters)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${orderMatters ? 'bg-indigo-600' : 'bg-slate-300'}`}
                        >
                            <div
                                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${orderMatters ? 'translate-x-6' : ''}`}/>
                        </div>
                    </label>
                    <p className="text-sm text-indigo-700">
                        {orderMatters ? "Yes: (1, 2) is different from (2, 1)" : "No: {1, 2} is the same as {2, 1}"}
                    </p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg">
                    <label className="flex items-center justify-between cursor-pointer mb-4">
                        <span className="font-medium text-emerald-900">With Replacement?</span>
                        <div
                            onClick={() => setReplacement(!replacement)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${replacement ? 'bg-emerald-600' : 'bg-slate-300'}`}
                        >
                            <div
                                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${replacement ? 'translate-x-6' : ''}`}/>
                        </div>
                    </label>
                    <p className="text-sm text-emerald-700">
                        {replacement ? "Yes: You can pick the same item twice." : "No: Once picked, it's gone."}
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Controls */}
                <div className="flex-1 w-full space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-slate-700">Items to choose from (<MathRenderer
                                text="$n$"/>)</label>
                            <span className="font-mono text-indigo-600 font-bold">{n}</span>
                        </div>
                        <input
                            type="range" min="1" max="10" value={n} onChange={(e) => setN(parseInt(e.target.value))}
                            className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-slate-700">Items to pick (<MathRenderer
                                text="$k$"/>)</label>
                            <span className="font-mono text-indigo-600 font-bold">{k}</span>
                        </div>
                        <input
                            type="range" min="1" max="10" value={k} onChange={(e) => setK(parseInt(e.target.value))}
                            className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {renderVisualization()}
                </div>

                {/* Results */}
                <div
                    className="flex-1 w-full bg-slate-900 text-slate-50 rounded-xl p-6 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <RefreshCcw className="w-24 h-24"/>
                    </div>

                    <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-2">Formula</h3>
                    <div className="text-xl font-mono text-emerald-400 mb-6 font-bold">
                        <MathRenderer text={getFormula()}/>
                    </div>

                    <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-2">Total
                        Possibilities</h3>
                    <div className="text-4xl font-bold text-white mb-6">
                        {result.toLocaleString()}
                    </div>

                    <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-2">Intuition</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        {getDescription()}
                    </p>
                </div>
            </div>

            {/* Stars and Bars Special Note */}
            {mode === SamplingMode.UNORDERED_WITH_REPLACEMENT && (
                <div className="mt-6 bg-amber-50 border-l-4 border-amber-400 p-4 text-amber-900 text-sm rounded-r">
                    <strong className="font-bold">Pro Tip (Stars & Bars):</strong> Imagine <MathRenderer
                    text="$n$"/> flavors as <MathRenderer text="$n-1$"/> dividers (bars) and <MathRenderer
                    text="$k$"/> scoops as stars. Any arrangement of stars and bars corresponds to a valid selection!
                </div>
            )}
        </div>
    );
};

export default SamplingTable;
