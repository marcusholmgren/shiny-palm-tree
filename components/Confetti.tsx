import React, {useState, useEffect} from 'react';

interface Particle {
    id: number;
    x: number;
    size: number;
    color: string;
    shape: 'circle' | 'square' | 'triangle';
    delay: number;
    duration: number;
    animation: string;
}

interface ConfettiProps {
    trigger: number;
}

const COLORS = [
    '#f43f5e', // rose-500
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#6366f1', // indigo-500
    '#ec4899', // pink-500
    '#8b5cf6', // violet-500
    '#14b8a6', // teal-500
];

const SHAPES: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];

const Confetti: React.FC<ConfettiProps> = ({trigger}) => {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        if (trigger === 0) return;

        const generatedParticles: Particle[] = Array.from({length: 60}).map((_, i) => {
            const size = Math.random() * 8 + 6; // 6px to 14px
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            const x = Math.random() * 100; // 0% to 100%
            const delay = Math.random() * 0.4; // 0s to 0.4s delay
            const duration = Math.random() * 1.5 + 1.5; // 1.5s to 3.0s
            const animation = Math.random() > 0.5 ? 'confetti-fall-sway' : 'confetti-fall-alternate';

            return {
                id: i + trigger * 1000, // Unique ID per trigger burst
                x,
                size,
                color,
                shape,
                delay,
                duration,
                animation,
            };
        });

        setParticles((prev) => [...prev, ...generatedParticles]);

        // Clean up particles after they finish animating to keep DOM lean
        const timer = setTimeout(() => {
            setParticles((prev) => prev.filter((p) => p.id < trigger * 1000));
        }, 3500);

        return () => clearTimeout(timer);
    }, [trigger]);

    if (particles.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes confetti-fall-sway {
                    0% {
                        transform: translateY(-20px) translateX(0) rotate(0deg) rotateY(0deg);
                        opacity: 1;
                    }
                    50% {
                        transform: translateY(50vh) translateX(40px) rotate(180deg) rotateY(360deg);
                        opacity: 0.9;
                    }
                    100% {
                        transform: translateY(105vh) translateX(-20px) rotate(360deg) rotateY(720deg);
                        opacity: 0;
                    }
                }
                @keyframes confetti-fall-alternate {
                    0% {
                        transform: translateY(-20px) translateX(0) rotate(0deg) rotateX(0deg);
                        opacity: 1;
                    }
                    50% {
                        transform: translateY(50vh) translateX(-40px) rotate(-180deg) rotateX(360deg);
                        opacity: 0.9;
                    }
                    100% {
                        transform: translateY(105vh) translateX(20px) rotate(-360deg) rotateX(720deg);
                        opacity: 0;
                    }
                }
            `}} />
            {particles.map((p) => {
                let borderStyles = {};
                if (p.shape === 'triangle') {
                    borderStyles = {
                        width: 0,
                        height: 0,
                        backgroundColor: 'transparent',
                        borderLeft: `${p.size / 2}px solid transparent`,
                        borderRight: `${p.size / 2}px solid transparent`,
                        borderBottom: `${p.size}px solid ${p.color}`,
                    };
                }

                return (
                    <div
                        key={p.id}
                        style={{
                            position: 'absolute',
                            left: `${p.x}%`,
                            top: '-20px',
                            width: p.shape === 'triangle' ? undefined : `${p.size}px`,
                            height: p.shape === 'triangle' ? undefined : `${p.size}px`,
                            backgroundColor: p.shape === 'triangle' ? 'transparent' : p.color,
                            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'square' ? '2px' : undefined,
                            ...borderStyles,
                            animationName: p.animation,
                            animationDuration: `${p.duration}s`,
                            animationDelay: `${p.delay}s`,
                            animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            animationFillMode: 'forwards',
                        }}
                    />
                );
            })}
        </div>
    );
};

export default Confetti;
