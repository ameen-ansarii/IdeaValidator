'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

/**
 * ThemeToggle - A beautiful animated sun/moon toggle for switching between light and dark modes.
 * Positioned in the top-left corner with a glassmorphic design.
 */
export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <motion.button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="theme-toggle-btn"
            style={{
                position: 'fixed',
                top: '1.5rem',
                left: '1.5rem',
                zIndex: 10001,
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: '100px',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none',
            }}
        >
            <div
                style={{
                    position: 'relative',
                    width: '56px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 5px',
                    background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '100px',
                }}
            >
                {/* Sun Icon */}
                <motion.div
                    animate={{
                        scale: isDark ? 0.6 : 1,
                        opacity: isDark ? 0.3 : 1,
                        rotate: isDark ? -90 : 0,
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isDark ? 'rgba(255, 255, 255, 0.4)' : '#f59e0b',
                    }}
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                </motion.div>

                {/* Moon Icon */}
                <motion.div
                    animate={{
                        scale: isDark ? 1 : 0.6,
                        opacity: isDark ? 1 : 0.3,
                        rotate: isDark ? 0 : 90,
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isDark ? '#a78bfa' : 'rgba(0, 0, 0, 0.4)',
                    }}
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                </motion.div>

                {/* Sliding Indicator */}
                <motion.div
                    animate={{
                        x: isDark ? 28 : 0,
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        position: 'absolute',
                        top: '2px',
                        left: '2px',
                        width: '24px',
                        height: '24px',
                        background: isDark ? '#1a1a2e' : '#ffffff',
                        borderRadius: '50%',
                        boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                        zIndex: 1,
                    }}
                />
            </div>
        </motion.button>
    );
}
