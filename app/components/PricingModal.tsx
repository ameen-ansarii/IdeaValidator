"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Zap, Crown, Rocket } from "lucide-react";

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const plans = [
    {
        name: "Starter",
        description: "Perfect for trying out the platform and testing your first ideas.",
        price: 0,
        period: "/mo",
        buttonText: "Get Started",
        buttonStyle: "secondary",
        featuresTitle: "What's included:",
        features: [
            "5 Idea Validations/month",
            "Basic Analysis",
            "Viability Score",
            "Simple Recommendations",
            "Community Support"
        ]
    },
    {
        name: "Pro",
        description: "For serious founders who want deep insights and unlimited access.",
        price: 49,
        period: "/mo",
        buttonText: "Get Started",
        buttonStyle: "primary",
        popular: true,
        icon: Crown,
        featuresTitle: "Everything in Starter, plus:",
        features: [
            "Team Collaboration",
            "Brand Vibe Generator",
            "Tech Stack Advisor",
            "Custom Roadmaps",
            "PDF Export"
        ]
    },
    {
        name: "Enterprise",
        description: "For teams and agencies needing advanced features and priority access.",
        price: 99,
        period: "/mo",
        buttonText: "Get Started",
        buttonStyle: "secondary",
        icon: Rocket,
        featuresTitle: "Everything in Pro, plus:",
        features: [
            "Unlimited Validations",
            "Competitor Analysis",
            "Market Size Calculator",
            "Roast Mode 🔥",
            "Pivot Strategies",
            "Priority Support"
        ]
    }
];

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0a0a0f] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800/50 p-6 md:p-10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors z-20 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            <X size={18} />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-10">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-100 dark:bg-indigo-500/10 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-4 tracking-wide"
                            >
                                <Zap size={12} className="fill-indigo-500" />
                                Pricing
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2"
                            >
                                Plans that work best for{" "}
                                <span className="relative">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                        your business
                                    </span>
                                    <svg
                                        className="absolute -bottom-2 left-0 w-full"
                                        viewBox="0 0 200 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M2 8C30 4 60 2 100 6C140 10 170 8 198 4"
                                            stroke="url(#underline-gradient)"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient id="underline-gradient" x1="0" y1="0" x2="200" y2="0">
                                                <stop stopColor="#6366f1" />
                                                <stop offset="1" stopColor="#a855f7" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </span>
                            </motion.h2>
                        </div>

                        {/* Pricing Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {plans.map((plan, index) => (
                                <motion.div
                                    key={plan.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.1 }}
                                    className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 ${plan.popular
                                        ? "bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/30 dark:to-[#0f0f14] border-indigo-300 dark:border-indigo-500/40 shadow-xl shadow-indigo-500/10"
                                        : "bg-gray-50 dark:bg-[#0f0f14] border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                                        }`}
                                >
                                    {/* Popular Badge */}
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <div className="px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-lg shadow-indigo-500/30">
                                                Most Popular
                                            </div>
                                        </div>
                                    )}

                                    {/* Plan Header */}
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            {plan.name}
                                            {plan.icon && <plan.icon size={18} className="text-indigo-500" />}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed min-h-[40px]">
                                            {plan.description}
                                        </p>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg font-medium text-gray-500 dark:text-gray-400">₹</span>
                                            <span className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                                                {plan.price}
                                            </span>
                                            <span className="text-base font-medium text-gray-400 dark:text-gray-500">
                                                {plan.period}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 mb-8 ${plan.popular
                                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
                                            : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                                            }`}
                                    >
                                        {plan.buttonText}
                                    </button>

                                    {/* Features */}
                                    <div>
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
                                            {plan.featuresTitle}
                                        </p>
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                    <div className={`flex-shrink-0 p-0.5 rounded-full mt-0.5 ${plan.popular
                                                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                                                        : "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                                                        }`}>
                                                        <Check size={12} strokeWidth={3} />
                                                    </div>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Footer Note */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8"
                        >
                            All plans include a 7-day free trial. Cancel anytime from your dashboard.
                        </motion.p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
