"use client";

import { motion } from "framer-motion";
import { Palette, Sparkles } from "lucide-react";

interface BrandVibeProps {
    data: {
        colors: string[];
        fontPair: string;
        slogan: string;
        designStyle: string;
    } | null;
}

export default function BrandVibe({ data }: BrandVibeProps) {
    if (!data) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#120610] via-[#0f050d] to-[#0a080c] border border-white/[0.08] p-8 md:p-10 mt-6 md:col-span-4"
        >
            {/* Background Typography Watermark */}
            <div className="absolute -top-8 -right-12 text-[160px] md:text-[220px] font-black text-white/[0.03] leading-none tracking-tighter select-none pointer-events-none">
                VIBE
            </div>

            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[120px]" />

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 flex items-center justify-center backdrop-blur-sm">
                            <Palette className="w-6 h-6 text-pink-300" />
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-[10px] font-bold text-pink-300 uppercase tracking-wider">
                            Pro Feature
                        </span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95] mb-3">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-pink-400">
                            Brand Vibe
                        </span>
                        <br />
                        <span className="text-white/90">Check</span>
                    </h3>
                    <p className="text-sm text-gray-400 uppercase tracking-widest font-medium">{data.designStyle}</p>
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Slogan & Typography */}
                <div className="space-y-8">
                    <div className="p-6 rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-rose-500/5 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-pink-300" />
                            <span className="text-xs text-pink-300 uppercase tracking-wider font-bold">Generated Slogan</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-serif italic text-white/90 leading-tight">
                            "{data.slogan}"
                        </h2>
                    </div>

                    <div className="p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm">
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold block mb-4">Typography Pair</span>
                        <div className="p-4 bg-white/[0.03] rounded-xl border border-white/10">
                            <span className="font-mono text-sm text-gray-300">{data.fontPair}</span>
                        </div>
                    </div>
                </div>

                {/* Color Palette */}
                <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-bold block mb-6">Color Palette</span>
                    <div className="grid grid-cols-2 gap-4">
                        {data.colors.map((color, idx) => (
                            <div key={idx} className="space-y-3 group cursor-pointer">
                                <div
                                    className="h-28 w-full rounded-2xl shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl border border-white/10"
                                    style={{ 
                                        backgroundColor: color,
                                        boxShadow: `0 8px 32px ${color}40`
                                    }}
                                />
                                <p className="text-center font-mono text-xs text-gray-400 uppercase group-hover:text-white transition-colors">
                                    {color}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
