"use client";

import { motion } from "framer-motion";
import { Lock, Crown, Rocket, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

interface LockedFeatureProps {
    children: React.ReactNode;
    tier?: "pro" | "enterprise";
    featureName?: string;
    className?: string;
    blurAmount?: number;
    showPreview?: boolean;
}

/**
 * LockedFeature - A premium feature wrapper that shows a blurred preview
 * with an "Unlock with Pro/Enterprise" overlay to encourage upgrades.
 */
export default function LockedFeature({
    children,
    tier = "pro",
    featureName = "this feature",
    className = "",
    blurAmount = 8,
    showPreview = true,
}: LockedFeatureProps) {
    const { isPro, isEnterprise } = useAuth();
    
    // Unlock logic
    if (tier === "pro" && isPro) return <>{children}</>;
    if (tier === "enterprise" && isEnterprise) return <>{children}</>;

    const Icon = tier === "pro" ? Crown : Rocket;
    const tierName = tier === "pro" ? "Pro" : "Enterprise";
    const price = tier === "pro" ? "₹49" : "₹99";
    const gradientFrom = tier === "pro" ? "from-indigo-600" : "from-purple-600";
    const gradientTo = tier === "pro" ? "to-purple-600" : "to-pink-600";
    const glowColor = tier === "pro" ? "indigo" : "purple";

    return (
        <div className={`relative overflow-hidden rounded-2xl ${className}`}>
            {/* Blurred Content Preview */}
            {showPreview && (
                <div
                    className="pointer-events-none select-none"
                    style={{ filter: `blur(${blurAmount}px)` }}
                >
                    {children}
                </div>
            )}

            {/* Locked Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`absolute inset-0 flex flex-col items-center justify-center p-6 backdrop-blur-sm bg-gradient-to-b from-black/40 via-black/60 to-black/80 z-10 ${!showPreview ? 'relative min-h-[200px]' : ''}`}
            >
                {/* Glow Effect */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-${glowColor}-500/20 rounded-full blur-3xl pointer-events-none`} />

                {/* Lock Icon with Animation */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center mb-4 shadow-lg shadow-${glowColor}-500/30`}
                >
                    <Lock className="w-7 h-7 text-white" />
                    <motion.div
                        className="absolute inset-0 rounded-2xl bg-white/20"
                        animate={{ opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>

                {/* Tier Badge */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white text-xs font-bold uppercase tracking-wider mb-3 shadow-md`}
                >
                    <Icon size={12} />
                    {tierName} Feature
                </motion.div>

                {/* Feature Name */}
                <motion.h4
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="text-white text-lg font-bold text-center mb-1"
                >
                    Unlock {featureName}
                </motion.h4>

                {/* Description */}
                <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/70 text-sm text-center mb-5 max-w-xs"
                >
                    Upgrade to {tierName} to access this premium feature and supercharge your idea validation.
                </motion.p>

                {/* CTA Button */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                >
                    <Link
                        href="/pricing"
                        className={`group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white font-semibold text-sm shadow-lg shadow-${glowColor}-500/30 hover:shadow-${glowColor}-500/50 hover:scale-105 active:scale-95 transition-all duration-300`}
                    >
                        <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                        Unlock with {tierName}
                        <span className="text-white/70 text-xs ml-1">({price}/mo)</span>
                    </Link>
                </motion.div>

                {/* Decorative sparkles */}
                <motion.div
                    className="absolute top-4 right-4 text-white/30"
                    animate={{ rotate: [0, 15, 0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    <Sparkles size={20} />
                </motion.div>
                <motion.div
                    className="absolute bottom-4 left-4 text-white/20"
                    animate={{ rotate: [0, -15, 0, 15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                >
                    <Sparkles size={16} />
                </motion.div>
            </motion.div>
        </div>
    );
}

/**
 * Smaller inline locked badge for buttons/features
 */
export function LockedBadge({ tier = "pro" }: { tier?: "pro" | "enterprise" }) {
    const isPro = tier === "pro";
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${isPro
                ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
            }`}>
            <Lock size={10} />
            {isPro ? "Pro" : "Enterprise"}
        </span>
    );
}

/**
 * Lock overlay for buttons that require upgrade
 */
export function LockedButton({
    children,
    tier = "pro",
    className = "",
    onClick,
}: {
    children: React.ReactNode;
    tier?: "pro" | "enterprise";
    className?: string;
    onClick?: () => void;
}) {
    const isPro = tier === "pro";
    const gradientFrom = isPro ? "from-indigo-600" : "from-purple-600";
    const gradientTo = isPro ? "to-purple-600" : "to-pink-600";

    return (
        <Link
            href="/pricing"
            className={`group relative inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${className}`}
            onClick={onClick}
        >
            <Lock size={14} />
            {children}
            <Crown size={12} className="opacity-70" />
        </Link>
    );
}
