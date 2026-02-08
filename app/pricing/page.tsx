"use client";

import { motion } from "framer-motion";
import { Check, Zap, Crown, Rocket, ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import MaskedText from "../components/MaskedText";
import BackgroundDots from "../components/BackgroundDots";

const plans = [
    {
        name: "Starter",
        description: "Perfect for trying out the platform and testing your first ideas.",
        price: 0,
        period: "/mo",
        buttonText: "Get Started Free",
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
        buttonText: "Start 7-Day Trial",
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
        buttonText: "Start 7-Day Trial",
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

export default function PricingPage() {
    const router = useRouter();

    return (
        <BackgroundDots>
            <main className="min-h-screen flex flex-col items-center p-6 pt-20 relative overflow-hidden">
            {/* Background */}
            <div className="bg-aurora" />

            {/* Gradient Orbs */}
            <div className="fixed top-20 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => router.back()}
                className="fixed top-24 left-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back</span>
            </motion.button>

            <div className="max-w-6xl w-full z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-100 dark:bg-indigo-500/10 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-6 tracking-wide"
                    >
                        <Zap size={12} className="fill-indigo-500" />
                        Pricing
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-[var(--foreground)] mb-4">
                        <MaskedText text="Plans that work best for" delay={0.1} />
                    </h1>
                    <div className="relative inline-block">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                            <MaskedText text="your business" delay={0.3} />
                        </h1>
                        <svg
                            className="absolute -bottom-2 left-0 w-full h-4"
                            viewBox="0 0 300 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                d="M2 8C50 4 100 2 150 6C200 10 250 8 298 4"
                                stroke="url(#underline-gradient-page)"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient id="underline-gradient-page" x1="0" y1="0" x2="300" y2="0">
                                    <stop stopColor="#6366f1" />
                                    <stop offset="1" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mt-8 leading-relaxed"
                    >
                        Choose the perfect plan for your startup journey. Start free and upgrade as you grow.
                    </motion.p>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${plan.popular
                                ? "bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/30 dark:to-[#0f0f14] border-indigo-300 dark:border-indigo-500/40 shadow-2xl shadow-indigo-500/15 scale-[1.02]"
                                : "bg-white dark:bg-[#0f0f14] border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xl"
                                }`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="px-5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg shadow-indigo-500/30">
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    {plan.name}
                                    {plan.icon && <plan.icon size={20} className="text-indigo-500" />}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed min-h-[48px]">
                                    {plan.description}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-medium text-gray-500 dark:text-gray-400">₹</span>
                                    <span className="text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
                                        {plan.price}
                                    </span>
                                    <span className="text-lg font-medium text-gray-400 dark:text-gray-500">
                                        {plan.period}
                                    </span>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <button
                                className={`w-full py-4 px-6 rounded-2xl font-semibold text-base transition-all duration-300 mb-10 flex items-center justify-center gap-2 group ${plan.popular
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
                                    : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98]"
                                    }`}
                            >
                                {plan.buttonText}
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Features */}
                            <div className="flex-1">
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-5 uppercase tracking-wide">
                                    {plan.featuresTitle}
                                </p>
                                <ul className="space-y-4">
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

                {/* Trust Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center py-12 border-t border-[var(--card-border)]"
                >
                    <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-8">
                        Trusted by founders & startups worldwide
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
                        {["TechCrunch", "ProductHunt", "YCombinator", "Forbes", "Wired"].map((brand, i) => (
                            <span key={i} className="text-lg md:text-xl font-bold text-[var(--text-secondary)]">
                                {brand}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* FAQ Teaser */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-center py-12"
                >
                    <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4">
                        Have questions?
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-6">
                        All plans include a 7-day free trial. Cancel anytime.
                    </p>
                    <a
                        href="/about"
                        className="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-400 font-semibold transition-colors"
                    >
                        Read our FAQ <ArrowRight size={16} />
                    </a>
                </motion.div>
            </div>
            </main>
        </BackgroundDots>
    );
}
