"use client";

import { motion } from "framer-motion";
import { TechStack } from "../types";
import { Code2, Database, Globe, Server, Wrench, Zap, Cpu } from "lucide-react";
import clsx from "clsx";

interface TechStackDisplayProps {
    data: TechStack;
}

export default function TechStackDisplay({ data }: TechStackDisplayProps) {
    const items = [
        { label: "Frontend", icon: Globe, value: data.frontend, gradient: "from-blue-500/20 to-blue-600/10", border: "border-blue-500/30", text: "text-blue-300" },
        { label: "Backend", icon: Server, value: data.backend, gradient: "from-emerald-500/20 to-emerald-600/10", border: "border-emerald-500/30", text: "text-emerald-300" },
        { label: "Database", icon: Database, value: data.database, gradient: "from-amber-500/20 to-amber-600/10", border: "border-amber-500/30", text: "text-amber-300" },
        { label: "Infrastructure", icon: Zap, value: data.infrastructure, gradient: "from-purple-500/20 to-purple-600/10", border: "border-purple-500/30", text: "text-purple-300" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-1 md:col-span-4 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#061215] via-[#050d10] to-[#0a0a0c] border border-white/[0.08] p-8 md:p-10 mt-6"
        >
            {/* Background Typography Watermark */}
            <div className="absolute -top-8 -right-12 text-[160px] md:text-[220px] font-black text-white/[0.03] leading-none tracking-tighter select-none pointer-events-none">
                STACK
            </div>

            {/* Ambient Glow */}
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px]" />

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center backdrop-blur-sm">
                            <Code2 className="w-6 h-6 text-cyan-300" />
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                            Pro Feature
                        </span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95] mb-3">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-cyan-400">
                            Tech Stack
                        </span>
                        <br />
                        <span className="text-white/90">Recommendations</span>
                    </h3>
                    <p className="text-sm text-gray-400">Optimized for MVPs & Scalability</p>
                </div>
            </div>

            {/* Stack Components */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {items.map((item, idx) => (
                    <div key={idx} className={`bg-gradient-to-br ${item.gradient} border ${item.border} p-5 rounded-2xl hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm`}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center`}>
                                <item.icon className={clsx("w-4 h-4", item.text)} />
                            </div>
                            <span className={`text-xs uppercase font-bold tracking-wider ${item.text}`}>{item.label}</span>
                        </div>
                        <p className="text-white/90 font-semibold text-sm">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tools & Libraries */}
                <div className="md:col-span-2 p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm">
                    <h4 className="text-sm uppercase font-bold text-white/70 mb-4 flex items-center gap-2 tracking-wider">
                        <Wrench className="w-4 h-4 text-cyan-400" /> 
                        Key Tools & Libraries
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                        {data.tools.map((tool, i) => (
                            <span key={i} className="px-4 py-2 bg-white/[0.05] border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 rounded-xl text-sm text-gray-300 font-medium transition-all duration-300">
                                {tool}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Justification */}
                <div className="md:col-span-1 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 p-6 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <Cpu className="w-4 h-4 text-cyan-300" />
                        <h4 className="text-sm uppercase font-bold text-cyan-300 tracking-wider">Why this stack?</h4>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {data.justification}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
