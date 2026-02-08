"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

const pivotStories = [
    { company: "Flickr", pivot: "Slack", story: "Was a failed video game called Glitch" },
    { company: "Odeo", pivot: "Twitter", story: "Started as a podcasting platform" },
    { company: "Burbn", pivot: "Instagram", story: "Complex check-in app turned photo sharing" },
    { company: "YouTube", pivot: "Video Platform", story: "Originally a video dating site" },
    { company: "Shopify", pivot: "E-commerce Giant", story: "Started as a snowboard shop" },
    { company: "Discord", pivot: "Chat Giant", story: "Gaming communication tool for Fates Forever" },
    { company: "Netflix", pivot: "Streaming King", story: "DVD rental by mail, pivot to streaming" },
    { company: "Android", pivot: "Mobile OS", story: "Started as OS for digital cameras" },
];

const FloatingPivotStories = () => { // Changed function declaration to arrow function
    return (
        <div className="fixed inset-0 pointer-events-none z-0 hidden lg:flex justify-between px-4 overflow-hidden">
            {/* Left Column - Upwards */}
            <div className="w-64 h-full relative">
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--background)] to-transparent z-10" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent z-10" />

                <motion.div
                    animate={{ y: ["0%", "-33.33%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 40,
                        ease: "linear",
                    }}
                    className="flex flex-col gap-6"
                >
                    {[...pivotStories, ...pivotStories, ...pivotStories].map((story, i) => (
                        <div
                            key={i}
                            className="p-5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-sm opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                                    <RefreshCw className="w-3 h-3 inline mr-1" />
                                    Famous Pivot
                                </span>
                            </div>
                            <h4 className="text-sm font-bold text-[var(--foreground)] mb-1">
                                {story.company} <span className="text-[var(--text-secondary)] font-medium">→ {story.pivot}</span>
                            </h4>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                {story.story}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Right Column - Downwards */}
            <div className="w-64 h-full relative">
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--background)] to-transparent z-10" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent z-10" />

                <motion.div
                    animate={{ y: ["-33.33%", "0%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 45,
                        ease: "linear",
                    }}
                    className="flex flex-col gap-6"
                >
                    {[...[...pivotStories].reverse(), ...pivotStories, ...pivotStories].map((story, i) => (
                        <div
                            key={i}
                            className="p-5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-sm opacity-60 hover:opacity-100 transition-opacity text-right"
                        >
                            <div className="flex items-center justify-end gap-2 mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                                    Success Story
                                </span>
                            </div>
                            <h4 className="text-sm font-bold text-[var(--foreground)] mb-1">
                                {story.company} <span className="text-[var(--text-secondary)] font-medium">→ {story.pivot}</span>
                            </h4>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                {story.story}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default FloatingPivotStories; // Exported the new arrow function component
