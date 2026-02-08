"use client";

import { motion } from "framer-motion";
import MaskedText from "../components/MaskedText";

export default function LegalPage() {
    return (
        <main className="min-h-screen flex flex-col items-center p-6 pt-32 relative">
            {/* NavBar and ThemeToggle are now in layout.tsx */}
            <div className="fixed inset-0 z-0 bg-aurora pointer-events-none" />

            <div className="max-w-3xl w-full z-10">
                <div className="mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[var(--foreground)] mb-6">
                        <MaskedText text="Legal" delay={0.1} />
                    </h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="prose prose-lg prose-invert macos-card p-10 max-w-none text-[var(--text-secondary)]"
                >
                    <h3 className="text-[var(--foreground)]">Terms of Service</h3>
                    <p>
                        By using idea-validator, you agree that the analysis provided is for informational purposes only. Do not make financial decisions solely based on AI predictions.
                    </p>

                    <h3 className="text-[var(--foreground)]">Privacy Policy</h3>
                    <p>
                        We do not store your idea submissions. All data is processed in real-time and discarded after the session. We use Google Gemini API for processing.
                    </p>

                    <h3 className="text-[var(--foreground)]">Disclaimer</h3>
                    <p>
                        The AI model can make mistakes. Always do your own research.
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
