"use client";

import { useAuth } from "../context/AuthContext";
import { User, LogOut, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import PricingModal from "./PricingModal";

export default function UserAuth() {
    const { user, userData, signInWithGoogle, signOut, loading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [showPricing, setShowPricing] = useState(false);

    if (loading) {
        return (
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse dark:bg-gray-700"></div>
        );
    }

    if (!user) {
        return (
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={signInWithGoogle}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
                <User size={18} />
                Sign In
            </motion.button>
        );
    }

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative"
            >
                <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                    alt={user.displayName || "User"}
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-md"
                />
                {userData?.plan === "pro" && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 rounded-full p-0.5 border-2 border-white dark:border-gray-800">
                        <Crown size={12} fill="currentColor" />
                    </div>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-4 z-50 origin-top-right"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                                alt="Profile"
                                className="w-12 h-12 rounded-full border-2 border-gray-100 dark:border-gray-700"
                            />
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-[140px]">
                                    {user.displayName}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${userData?.plan === "pro"
                                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                                        }`}>
                                        {userData?.plan === "pro" ? "PRO MEMBER" : "FREE PLAN"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />

                        {userData?.plan !== "pro" && (
                            <button
                                className="w-full mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 rounded-xl font-medium text-sm hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95"
                                onClick={() => {
                                    setIsOpen(false);
                                    setShowPricing(true);
                                }}
                            >
                                Upgrade to Pro
                            </button>
                        )}

                        <button
                            onClick={() => {
                                signOut();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-sm font-medium"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
        </div>
    );
}
