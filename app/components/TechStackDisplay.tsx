"use client";

import { motion } from "framer-motion";
import { TechStack } from "../types";
import { Code2, Database, Globe, Server, Wrench, Zap } from "lucide-react";
import clsx from "clsx";

interface TechStackDisplayProps {
    data: TechStack;
}

export default function TechStackDisplay({ data }: TechStackDisplayProps) {
    const items = [
        { label: "Frontend", icon: Globe, value: data.frontend, color: "text-blue-400" },
        { label: "Backend", icon: Server, value: data.backend, color: "text-green-400" },
        { label: "Database", icon: Database, value: data.database, color: "text-yellow-400" },
        { label: "Infrastructure", icon: Zap, value: data.infrastructure, color: "text-purple-400" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-1 md:col-span-4 macos-card p-6 md:p-8 mt-6 relative overflow-hidden group"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Recommended Tech Stack</h3>
                    <p className="text-sm text-gray-400">Optimized for MVPs & Scalability</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {items.map((item, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                            <item.icon className={clsx("w-4 h-4", item.color)} />
                            <span className="text-xs uppercase font-semibold text-gray-500">{item.label}</span>
                        </div>
                        <p className="text-white font-medium">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <h4 className="text-xs uppercase font-semibold text-gray-500 mb-2 flex items-center gap-2">
                        <Wrench className="w-3 h-3" /> Key Tools & Libraries
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {data.tools.map((tool, i) => (
                            <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-cyan-100/80">
                                {tool}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-1 bg-blue-950/20 border border-blue-500/20 p-4 rounded-xl">
                    <h4 className="text-xs uppercase font-semibold text-blue-400 mb-2">Why this stack?</h4>
                    <p className="text-sm text-blue-100/70 leading-relaxed">
                        {data.justification}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
