"use client";

import { motion } from "framer-motion";


interface CircularGaugeProps {
    score: number; // 0 to 100
    label: string;
    subLabel: string;
    isRoastMode?: boolean;
}

export default function CircularGauge({ score, label, subLabel, isRoastMode = false }: CircularGaugeProps) {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    // Determine color based on score (Dynamic coloring)
    const getColor = (s: number) => {
        if (isRoastMode) return "#ef4444"; // Always red in roast mode
        if (s >= 80) return "#22c55e"; // Green
        if (s >= 50) return "#eab308"; // Yellow
        return "#ef4444"; // Red
    };

    const color = getColor(score);

    return (
        <div className="flex flex-col items-center justify-center relative w-full h-full">
            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Rotating Outer Ring for specific "Tech" feel */}
                <motion.div
                    className="absolute inset-0 rounded-full border border-dashed border-[var(--card-border)]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />

                <svg className="w-full h-full transform -rotate-90">
                    <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={color} stopOpacity="1" />
                        </linearGradient>
                    </defs>

                    {/* Background Track (Dashed) */}
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray="4 6" // Dashed effect
                        className="text-[var(--card-border)]"
                    />

                    {/* Progress Circle with Gradient */}
                    <motion.circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="url(#scoreGradient)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        strokeLinecap="round"
                        style={{ filter: "drop-shadow(0 0 10px var(--gauge-glow))" }}
                    />
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <motion.span
                        className="text-5xl font-bold tracking-tighter"
                        style={{ color: color }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                    >
                        {score}
                    </motion.span>
                    <span className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mt-1 font-medium">Score</span>
                </div>
            </div>

            <div className="text-center mt-[-10px] relative z-10">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">{label}</h3>
                <p className="text-[10px] text-[var(--text-secondary)] font-medium">{subLabel}</p>
            </div>
        </div>
    );
}
