"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { useEffect, useState } from "react";

const stories = [
    { from: "Flickr", to: "Slack", description: "Was a failed video game called Glitch" },
    { from: "Odeo", to: "Twitter", description: "Started as a podcasting platform" },
    { from: "Burbn", to: "Instagram", description: "Complex check-in app turned photo sharing" },
    { from: "YouTube", to: "Video Platform", description: "Originally a video dating site" },
    { from: "Shopify", to: "E-commerce Giant", description: "Started as a snowboard shop" },
    { from: "Discord", to: "Chat Giant", description: "Gaming communication tool for Fates Forever" },
    { from: "Netflix", to: "Streaming King", description: "DVD rental by mail, pivot to streaming" },
    { from: "Android", to: "Mobile OS", description: "Started as OS for digital cameras" },
];

export default function FloatingPivotStories() {
    const [activeStories, setActiveStories] = useState<number[]>([]);

    // Randomly select stories to show on mount to vary the experience
    useEffect(() => {
        setActiveStories(stories.map((_, i) => i).sort(() => 0.5 - Math.random()).slice(0, 5));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Left Column - Continuous Vertical Marquee Up */}
            <div className="absolute left-4 md:left-10 h-full w-64 overflow-hidden mask-gradient-vertical">
                <motion.div
                    className="flex flex-col gap-8 pb-8"
                    animate={{ y: [0, -1000] }} // Adjust value based on content height
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 40
                    }}
                >
                    {[...stories, ...stories, ...stories].map((story, i) => (
                        <div
                            key={`left-${i}`}
                            className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm opacity-40 hover:opacity-60 transition-opacity duration-300"
                        >
                            <div className="text-[10px] uppercase font-bold text-indigo-400 mb-1">Famous Pivot</div>
                            <div className="text-sm font-semibold text-gray-200 mb-1">{story.from} → {story.to}</div>
                            <div className="text-xs text-gray-500 leading-tight">{story.description}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Right Column - Continuous Vertical Marquee Down */}
            <div className="absolute right-4 md:right-10 h-full w-64 overflow-hidden mask-gradient-vertical">
                <motion.div
                    className="flex flex-col gap-8 pb-8"
                    animate={{ y: [-1000, 0] }} // Reverse direction
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 45
                    }}
                >
                    {[...stories, ...stories, ...stories].map((story, i) => (
                        <div
                            key={`right-${i}`}
                            className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm opacity-40 hover:opacity-60 transition-opacity duration-300"
                        >
                            <div className="text-[10px] uppercase font-bold text-cyan-400 mb-1">Success Story</div>
                            <div className="text-sm font-semibold text-gray-200 mb-1">{story.from} → {story.to}</div>
                            <div className="text-xs text-gray-500 leading-tight">{story.description}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
