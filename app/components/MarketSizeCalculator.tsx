"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Target } from "lucide-react";
import { MarketSize } from "../types";

interface MarketSizeCalculatorProps {
    data: MarketSize;
}

export default function MarketSizeCalculator({ data }: MarketSizeCalculatorProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061210] via-[#050f0d] to-[#08080c] border border-white/[0.08] p-8 md:p-10 mt-6"
        >
            {/* Background Typography Watermark */}
            <div className="absolute -top-8 -right-12 text-[160px] md:text-[220px] font-black text-white/[0.03] leading-none tracking-tighter select-none pointer-events-none">
                MARKET
            </div>

            {/* Ambient Glow */}
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px]" />

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center backdrop-blur-sm">
                            <DollarSign className="w-6 h-6 text-emerald-300" />
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                            Enterprise
                        </span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95] mb-3">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
                            Market Size
                        </span>
                        <br />
                        <span className="text-white/90">Analysis</span>
                    </h3>
                    <p className="text-sm text-gray-400">TAM, SAM, SOM & Revenue Projections</p>
                </div>
            </div>

            {/* Market Funnel Visualization */}
            <div className="relative z-10 mb-10 space-y-4">
                {/* TAM */}
                <div className="relative">
                    <div className="w-full p-6 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-blue-300" />
                                </div>
                                <div>
                                    <span className="font-black text-white/90 text-lg">TAM</span>
                                    <span className="text-xs text-gray-400 ml-2">(Total Addressable Market)</span>
                                </div>
                            </div>
                            <span className="text-3xl font-black text-blue-300">{data.tam}</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed pl-[52px]">{data.tamJustification}</p>
                    </div>
                </div>

                {/* SAM */}
                <div className="relative pl-6 md:pl-12">
                    <div className="w-full p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-purple-300" />
                                </div>
                                <div>
                                    <span className="font-black text-white/90 text-lg">SAM</span>
                                    <span className="text-xs text-gray-400 ml-2">(Serviceable Addressable Market)</span>
                                </div>
                            </div>
                            <span className="text-3xl font-black text-purple-300">{data.sam}</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed pl-[52px]">{data.samJustification}</p>
                    </div>
                </div>

                {/* SOM */}
                <div className="relative pl-12 md:pl-24">
                    <div className="w-full p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-emerald-300" />
                                </div>
                                <div>
                                    <span className="font-black text-white/90 text-lg">SOM</span>
                                    <span className="text-xs text-gray-400 ml-2">(Serviceable Obtainable Market)</span>
                                </div>
                            </div>
                            <span className="text-3xl font-black text-emerald-300">{data.som}</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed pl-[52px]">{data.somJustification}</p>
                    </div>
                </div>
            </div>

            {/* Revenue Projections */}
            <div className="relative z-10 p-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-orange-400" />
                    </div>
                    <h4 className="font-black text-white/90 text-xl">3-Year Revenue Projection</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-500/5 to-orange-600/5 border border-orange-500/20 backdrop-blur-sm">
                        <p className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-widest">Year 1</p>
                        <p className="text-3xl font-black text-white/90">{data.revenueProjection.year1}</p>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/30 backdrop-blur-sm">
                        <p className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-widest">Year 2</p>
                        <p className="text-3xl font-black text-white/90">{data.revenueProjection.year2}</p>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-500/15 to-orange-600/10 border border-orange-500/40 backdrop-blur-sm">
                        <p className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-widest">Year 3</p>
                        <p className="text-3xl font-black text-white/90">{data.revenueProjection.year3}</p>
                    </div>
                </div>
            </div>

            {/* Info note */}
            <div className="relative z-10 mt-6 p-5 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-600/5 backdrop-blur-sm">
                <p className="text-xs text-gray-300 leading-relaxed">
                    💡 <strong className="text-blue-300">Note:</strong> These projections are AI-generated estimates based on market analysis.
                    Actual results may vary. Use this as a starting point for deeper research.
                </p>
            </div>
        </motion.div>
    );
}
