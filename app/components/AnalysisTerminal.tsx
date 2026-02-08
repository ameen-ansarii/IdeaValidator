"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Coffee, Rocket, Target, Flame, Lightbulb, TrendingUp } from "lucide-react";

// Funny loading messages that cycle through
const WITTY_MESSAGES = [
    { text: "Consulting the startup gods...", emoji: "🙏", icon: Sparkles },
    { text: "Judging your idea silently...", emoji: "👀", icon: Brain },
    { text: "Checking if this exists on ProductHunt...", emoji: "🔍", icon: Target },
    { text: "Asking ChatGPT's opinion (just kidding)...", emoji: "🤖", icon: Brain },
    { text: "Counting how many competitors you have...", emoji: "📊", icon: TrendingUp },
    { text: "Preparing constructive criticism...", emoji: "💭", icon: Lightbulb },
    { text: "Brewing some harsh truths...", emoji: "☕", icon: Coffee },
    { text: "Calculating your runway to failure...", emoji: "✈️", icon: Rocket },
    { text: "Summoning the spirit of Steve Jobs...", emoji: "👻", icon: Sparkles },
    { text: "Running it by imaginary VCs...", emoji: "💰", icon: Target },
];

const ROAST_MESSAGES = [
    { text: "Oh boy, here we go...", emoji: "🔥", icon: Flame },
    { text: "Sharpening the roasting tools...", emoji: "🗡️", icon: Flame },
    { text: "Preparing maximum savagery...", emoji: "💀", icon: Flame },
    { text: "Channeling Gordon Ramsay energy...", emoji: "👨‍🍳", icon: Flame },
    { text: "This is gonna hurt (a lot)...", emoji: "😈", icon: Flame },
    { text: "Loading brutal honesty module...", emoji: "💣", icon: Flame },
    { text: "No feelings were considered...", emoji: "🥶", icon: Flame },
    { text: "Fetching the world's smallest violin...", emoji: "🎻", icon: Flame },
];

interface AnalysisTerminalProps {
    isRoastMode?: boolean;
}

export default function AnalysisTerminal({ isRoastMode = false }: AnalysisTerminalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dots, setDots] = useState("");

    const messages = isRoastMode ? ROAST_MESSAGES : WITTY_MESSAGES;

    // Cycle through messages
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % messages.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [messages.length]);

    // Animated dots
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 400);
        return () => clearInterval(interval);
    }, []);

    const currentMessage = messages[currentIndex];
    const Icon = currentMessage.icon;

    return (
        <div className="flex flex-col items-center justify-center p-8 max-w-lg w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8"
            >
                {/* Animated Emoji */}
                <motion.div
                    key={currentIndex}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="text-6xl md:text-7xl"
                >
                    {currentMessage.emoji}
                </motion.div>

                {/* Message Text */}
                <div className="space-y-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center justify-center gap-3"
                        >
                            <Icon className={`w-5 h-5 ${isRoastMode ? 'text-red-400' : 'text-indigo-400'}`} />
                            <span className={`text-lg md:text-xl font-medium ${isRoastMode ? 'text-red-100' : 'text-white'}`}>
                                {currentMessage.text.replace("...", "")}
                                <span className="inline-block w-8 text-left">{dots}</span>
                            </span>
                        </motion.div>
                    </AnimatePresence>

                    {/* Subtle subtext */}
                    <motion.p
                        className="text-sm text-gray-500"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        {isRoastMode ? "Preparing your emotional damage..." : "This usually takes 5-10 seconds"}
                    </motion.p>
                </div>

                {/* Minimal Progress Indicator */}
                <div className="flex items-center justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className={`w-2 h-2 rounded-full ${isRoastMode ? 'bg-red-500' : 'bg-indigo-500'}`}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>

                {/* Fun fact or tip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className={`px-4 py-2 rounded-full text-xs font-medium ${isRoastMode
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}
                >
                    {isRoastMode
                        ? "💡 Pro tip: Have tissues ready"
                        : "💡 Pro tip: Great ideas often sound crazy at first"
                    }
                </motion.div>
            </motion.div>
        </div>
    );
}
