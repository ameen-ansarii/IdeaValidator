"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TrendingUp, Shield, AlertTriangle, ExternalLink as ExternalLinkIcon, Swords } from "lucide-react";
import { CompetitiveAnalysis as CompetitiveAnalysisType } from "../types";

interface CompetitiveAnalysisProps {
    data: CompetitiveAnalysisType;
}

export default function CompetitiveAnalysis({ data }: CompetitiveAnalysisProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c0612] via-[#0a0510] to-[#08080c] border border-white/[0.08] p-8 md:p-10 mt-6"
        >
            {/* Background Typography Watermark */}
            <div className="absolute -top-8 -right-12 text-[160px] md:text-[220px] font-black text-white/[0.03] leading-none tracking-tighter select-none pointer-events-none">
                COMPETE
            </div>

            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center backdrop-blur-sm">
                            <Swords className="w-6 h-6 text-violet-300" />
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-bold text-violet-300 uppercase tracking-wider">
                            Enterprise
                        </span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95] mb-3">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-200 to-violet-400">
                            Competitive
                        </span>
                        <br />
                        <span className="text-white/90">Analysis</span>
                    </h3>
                    <p className="text-sm text-gray-400">Market positioning & competitive landscape</p>
                </div>
            </div>

            {/* Market Position */}
            <div className="relative z-10 mb-8 p-6 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-purple-500/5 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-violet-300" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white/90 mb-2 text-lg">Market Position</h4>
                        <p className="text-sm text-gray-300 leading-relaxed">{data.marketPosition}</p>
                    </div>
                </div>
            </div>

            {/* Competitors */}
            {data.competitors.length > 0 && (
                <div className="relative z-10 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-bold text-white/80 flex items-center gap-2 text-sm uppercase tracking-widest">
                            <Shield className="w-4 h-4 text-violet-400" />
                            Key Competitors
                        </h4>
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-medium text-emerald-300">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            Live Results
                        </span>
                    </div>
                    <div className="grid gap-4">
                        {data.competitors.map((competitor, idx) => (
                            <div key={idx} className="group p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-violet-500/30 hover:bg-white/[0.05] transition-all duration-300 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {competitor.url ? (
                                            <Image
                                                src={`https://www.google.com/s2/favicons?domain=${competitor.url}&sz=128`}
                                                alt={`${competitor.name} icon`}
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded-lg opacity-80"
                                                onError={(e) => {
                                                    // Hide image on error or replace with fallback
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                                unoptimized // Favicons are small anyway, skip server optimization for speed
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-white/60">
                                                {competitor.name.charAt(0)}
                                            </div>
                                        )}
                                        <h5 className="font-bold text-white/90 text-xl">{competitor.name}</h5>
                                    </div>

                                    {competitor.url && (
                                        <a
                                            href={competitor.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-violet-500/10 border border-white/10 hover:border-violet-500/30 text-gray-400 hover:text-violet-300 transition-all"
                                            title="Visit Website"
                                        >
                                            <ExternalLinkIcon className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-emerald-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                                            Strengths
                                        </p>
                                        <ul className="text-sm text-gray-300 space-y-2">
                                            {competitor.strengths.map((strength, i) => (
                                                <li key={i} className="flex items-start gap-2.5">
                                                    <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                                                    <span>{strength}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-rose-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-rose-400"></span>
                                            Weaknesses
                                        </p>
                                        <ul className="text-sm text-gray-300 space-y-2">
                                            {competitor.weaknesses.map((weakness, i) => (
                                                <li key={i} className="flex items-start gap-2.5">
                                                    <span className="text-rose-400 mt-0.5">•</span>
                                                    <span>{weakness}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Differentiation Strategy */}
            <div className="relative z-10 mb-8 p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-violet-500/5 backdrop-blur-sm">
                <h4 className="font-bold text-purple-300 mb-3 text-lg">Differentiation Strategy</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{data.differentiationStrategy}</p>
            </div>

            {/* Competitive Advantages */}
            <div className="relative z-10 mb-8">
                <h4 className="font-bold text-white/80 mb-4 text-sm uppercase tracking-widest">Your Competitive Advantages</h4>
                <div className="grid gap-3">
                    {data.competitiveAdvantages.map((advantage, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/20 transition-colors">
                            <span className="text-emerald-400 font-bold text-lg">✓</span>
                            <span className="text-sm text-gray-300 leading-relaxed">{advantage}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Threats */}
            <div className="relative z-10 p-6 rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-500/5 to-red-500/5 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-rose-300" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-rose-200 mb-3 text-lg">Competitive Threats</h4>
                        <ul className="space-y-2.5">
                            {data.threats.map((threat, idx) => (
                                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2.5">
                                    <span className="text-rose-400/80 mt-1 font-bold">⚠</span>
                                    <span>{threat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

