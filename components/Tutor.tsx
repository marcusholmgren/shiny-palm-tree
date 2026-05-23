import React, {useState, useRef, useEffect} from 'react';
import {getTutorResponse} from '../services/geminiService';
import {ChatMessage} from '../types';
import {MessageSquare, Send, GraduationCap, X} from 'lucide-react';
import MathRenderer from './MathRenderer';

const Tutor: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {role: 'model', text: "Hi! I'm Dr. B's AI Assistant. Stuck on a counting problem? Ask me!"}
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    useEffect(() => {
        const handleTutorHint = async (e: Event) => {
            const customEvent = e as CustomEvent<{ question: string; options: string[]; topic: string }>;
            if (!customEvent.detail) return;

            const {question, options, topic} = customEvent.detail;
            setIsOpen(true);

            // Construct user text asking for a hint
            const hintPrompt = `I'm practicing problems about "${topic}". I'm stuck on this question: "${question}". The choices are: [${options.join(', ')}]. Can you give me a Socratic hint to guide me in the right direction without telling me the answer directly?`;

            // Display a user message in the chat that is readable and natural
            const userDisplayMessage: ChatMessage = {
                role: 'user',
                text: `I'm stuck on this problem: "${question}". Can you give me a hint?`
            };

            // To prevent double submission/nesting, make sure we aren't already processing
            setMessages(prev => [...prev, userDisplayMessage]);
            setLoading(true);

            try {
                const chatHistoryForCall = messages.concat(userDisplayMessage);
                const reply = await getTutorResponse(chatHistoryForCall, hintPrompt);
                setMessages(prev => [...prev, {role: 'model', text: reply}]);
            } catch (err) {
                setMessages(prev => [...prev, {role: 'model', text: "I'm having trouble connecting to Dr. B right now. Please try again in a moment."}]);
            } finally {
                setLoading(false);
            }
        };

        window.addEventListener('probality_ask_tutor_hint', handleTutorHint);
        return () => {
            window.removeEventListener('probality_ask_tutor_hint', handleTutorHint);
        };
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = {role: 'user', text: input};
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        const responseText = await getTutorResponse(messages.concat(userMsg), input);

        setMessages(prev => [...prev, {role: 'model', text: responseText}]);
        setLoading(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110 z-50"
            >
                <MessageSquare className="w-6 h-6"/>
            </button>
        );
    }

    return (
        <div
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5"/>
                    <span className="font-bold">Dr. B AI</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-indigo-200 hover:text-white">
                    <X className="w-5 h-5"/>
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                            msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                        }`}>
                            <MathRenderer text={msg.text}/>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 p-3 rounded-lg rounded-tl-none shadow-sm">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                                     style={{animationDelay: '0ms'}}/>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                                     style={{animationDelay: '150ms'}}/>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                                     style={{animationDelay: '300ms'}}/>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about sampling..."
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600"
                    >
                        <Send className="w-4 h-4"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Tutor;