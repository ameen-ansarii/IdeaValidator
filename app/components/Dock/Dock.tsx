"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";
import { useTheme } from "../../context/ThemeContext";
import { Home, Info, Scale, ExternalLink, History as HistoryIcon, Menu, X, Github, Sparkles, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Dock() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);
    const { theme, toggleTheme } = useTheme();

    const dockItems = [
        { label: "Validator", icon: Home, href: "/" },
        { label: "History", icon: HistoryIcon, href: "/history" },
        { label: "About", icon: Info, href: "/about" },
        { label: "Legal", icon: Scale, href: "/legal" },
    ];

    return (
        <>
            {/* Desktop Dock (Floating Liquid Glass) */}
            <div className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50">
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                    className={clsx(
                        "flex items-center gap-1 p-2 rounded-full",
                        "backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]",
                        // Dynamic Theme Colors
                        "bg-[var(--dock-bg)] border border-[var(--dock-border)]"
                    )}
                >
                    {dockItems.map((item) => {
                        const isActive = pathname === item.href;
                        const isHovered = hoveredTab === item.href;
                        const Icon = item.icon;

                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    onMouseEnter={() => setHoveredTab(item.href)}
                                    onMouseLeave={() => setHoveredTab(null)}
                                    className="relative px-5 py-2.5 rounded-full flex items-center gap-2 cursor-pointer transition-all duration-300"
                                >
                                    {/* Active/Hover Backgrounds */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="dock-active-pill"
                                            className="absolute inset-0 bg-black/10 dark:bg-white/10 rounded-full shadow-inner border border-black/5 dark:border-white/5"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}

                                    {isHovered && !isActive && (
                                        <motion.div
                                            layoutId="dock-hover-pill"
                                            className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-full"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        />
                                    )}

                                    <span className={clsx(
                                        "relative z-10 flex items-center gap-2 transition-colors duration-300",
                                        isActive ? "text-[var(--foreground)] font-medium" : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                                    )}>
                                        <Icon className={clsx("w-4 h-4 transition-transform duration-300", isHovered && "scale-110")} />
                                        <span className="text-sm tracking-tight">{item.label}</span>
                                    </span>

                                    {/* Active Dot */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-dot"
                                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--foreground)] shadow-[0_0_8px_var(--foreground)]"
                                        />
                                    )}
                                </div>
                            </Link>
                        );
                    })}

                    <div className="w-px h-5 bg-[var(--dock-border)] mx-2" />

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--card-highlight)] transition-all"
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>

                    <a
                        href="https://github.com"
                        target="_blank"
                        className="relative px-4 py-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--card-highlight)] transition-all flex items-center gap-2 group"
                    >
                        <Github className="w-4 h-4 transition-transform group-hover:scale-110" />
                        <span className="text-xs font-semibold tracking-wide group-hover:tracking-wider transition-all">GITHUB</span>
                    </a>
                </motion.div>
            </div>

            {/* Mobile Hamburger (Visible on small screens) */}
            <div className="md:hidden fixed top-4 right-4 z-50 flex items-center gap-3">
                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-full bg-[var(--mb-dock-bg,black)]/60 border border-[var(--card-border)] backdrop-blur-xl text-[var(--foreground)] shadow-lg active:scale-95 transition-transform"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-3 rounded-full bg-[var(--mb-dock-bg,black)]/60 border border-[var(--card-border)] backdrop-blur-xl text-[var(--foreground)] shadow-lg active:scale-95 transition-transform"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        className="fixed inset-0 z-[60] bg-[var(--background)]/95 backdrop-blur-3xl flex flex-col p-6"
                    >
                        <div className="flex justify-end mb-8">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-3 rounded-full bg-[var(--card-highlight)] text-[var(--foreground)] hover:bg-[var(--card-border)] transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-6 mt-10 px-4">
                            {dockItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={clsx(
                                        "text-4xl font-bold tracking-tighter flex items-center gap-4 transition-all hover:translate-x-2",
                                        pathname === item.href ? "text-[var(--foreground)]" : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                                    )}
                                >
                                    <item.icon className={clsx("w-8 h-8", pathname === item.href ? "text-[var(--foreground)]" : "text-[var(--text-secondary)]")} />
                                    {item.label}
                                </Link>
                            ))}

                            <div className="h-px bg-[var(--dock-border)] my-4" />

                            <a href="https://github.com" target="_blank" className="text-xl font-medium text-[var(--text-secondary)] hover:text-[var(--foreground)] flex items-center gap-4 transition-colors">
                                <Github className="w-6 h-6" />
                                GitHub Repo
                            </a>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
