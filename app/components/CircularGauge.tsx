"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface CircularGaugeProps {
    score: number; // 0 to 100
    label: string;
    subLabel: string;
    isRoastMode?: boolean;
}

export default function CircularGauge({ score, label, subLabel, isRoastMode = false }: CircularGaugeProps) {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center relative w-full h-full">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className={clsx(
                            "text-opacity-10 dark:text-opacity-10",
                            isRoastMode ? "text-red-500" : "text-white"
                        )}
                    />

                    {/* Animated Progress Circle */}
                    <motion.circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        strokeLinecap="round"
                        className={clsx(
                            isRoastMode
                                ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                : "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                        )}
                    />
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <motion.span
                        className={clsx("text-4xl font-bold tracking-tighter", isRoastMode ? "text-red-100" : "text-white")}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                    >
                        {score}%
                    </motion.span>
                </div>
            </div>

            <div className="text-center mt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-0.5">{label}</h3>
                <p className="text-[10px] text-gray-600 font-medium">{subLabel}</p>
            </div>
        </div>
    );
}
