"use client";

import { useAuth } from "../context/AuthContext";
import { User, LogOut, Crown, Rocket, Mail, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import PricingModal from "./PricingModal";

export default function UserAuth() {
    const { user, userData, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, loading, isPro, isEnterprise } = useAuth();
    
    // UI States
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
    const [showPricing, setShowPricing] = useState(false);
    
    // Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            if (authMode === "signin") {
                await signInWithEmail(email, password);
            } else {
                await signUpWithEmail(email, password, name);
            }
            setShowAuthModal(false);
            // Reset form
            setEmail("");
            setPassword("");
            setName("");
        } catch (err: any) {
            setError(err.message.replace("Firebase: ", ""));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogle = async () => {
        try {
            await signInWithGoogle();
            setShowAuthModal(false);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="fixed top-6 left-28 z-50 h-10 w-10 rounded-full bg-white/10 animate-pulse backdrop-blur-md border border-white/20"></div>
        );
    }

    if (!user) {
        return (
            <>
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setAuthMode("signin");
                        setShowAuthModal(true);
                    }}
                    className="fixed top-6 left-28 z-[50] px-4 py-2 bg-white/10 text-white backdrop-blur-md border border-white/20 rounded-full font-medium shadow-lg hover:bg-white/20 transition-all flex items-center gap-2 text-sm"
                >
                    <User size={16} />
                    Sign In
                </motion.button>

                {/* Auth Modal */}
                <AnimatePresence>
                    {showAuthModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {authMode === "signin" ? "Welcome Back" : "Create Account"}
                                        </h2>
                                        <button onClick={() => setShowAuthModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleAuth} className="space-y-4">
                                        {authMode === "signup" && (
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="••••••••"
                                                minLength={6}
                                            />
                                        </div>

                                        {error && <p className="text-red-500 text-sm">{error}</p>}

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg transition-all flex justify-center items-center"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin" /> : (authMode === "signin" ? "Sign In" : "Sign Up")}
                                        </button>
                                    </form>

                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
                                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span></div>
                                    </div>

                                    <button
                                        onClick={handleGoogle}
                                        className="w-full py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-lg font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-750 transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                        Google
                                    </button>

                                    <p className="mt-4 text-center text-sm text-gray-500">
                                        {authMode === "signin" ? "No account yet?" : "Already have an account?"}
                                        <button
                                            onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
                                            className="ml-1 text-blue-600 hover:underline font-medium"
                                        >
                                            {authMode === "signin" ? "Sign Up" : "Sign In"}
                                        </button>
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </>
        );
    }

    return (
        <div className="fixed top-6 left-28 z-[50]">
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative flex items-center gap-2 px-1 py-1 pr-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg"
            >
                <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || "User"}`}
                    alt={user.displayName || "User"}
                    className="w-8 h-8 rounded-full border border-white/30"
                />
                <div className="flex flex-col items-start leading-none">
                    <span className="text-xs font-bold text-white max-w-[80px] truncate">{user.displayName || "User"}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${
                        isEnterprise ? "text-purple-400" : isPro ? "text-yellow-400" : "text-gray-300"
                    }`}>
                        {isEnterprise ? "ENTERPRISE" : isPro ? "PRO" : "FREE"}
                    </span>
                </div>
            </motion.button>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-12 left-0 w-48 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden py-1"
                    >
                        {/* Status Section */}
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                           <p className="text-xs text-gray-500 dark:text-gray-400">Current Plan</p>
                           <div className="flex items-center gap-2 mt-1">
                                {isEnterprise ? <Rocket size={14} className="text-purple-500" /> : isPro ? <Crown size={14} className="text-yellow-500" /> : <div className="w-3.5 h-3.5 rounded-full bg-gray-400"/>}
                                <span className={`font-bold text-sm ${
                                    isEnterprise ? "text-purple-600 dark:text-purple-400" : isPro ? "text-yellow-600 dark:text-yellow-400" : "text-gray-700 dark:text-gray-300"
                                }`}>
                                    {isEnterprise ? "Enterprise" : isPro ? "Pro Member" : "Free Tier"}
                                </span>
                           </div>
                        </div>

                        {!isPro && !isEnterprise && (
                            <div className="p-2">
                                <button 
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setShowPricing(true);
                                    }}
                                    className="w-full py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold rounded-lg hover:shadow-md transition-all"
                                >
                                    Upgrade to Pro
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                signOut();
                                setIsMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                        >
                            <LogOut size={14} />
                            Log Out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

             {/* Pricing Modal */}
             {showPricing && <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />}
        </div>
    );
}
