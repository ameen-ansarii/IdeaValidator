"use client";

import clsx from "clsx";
import { useTheme } from "../context/ThemeContext";

interface BackgroundDotsProps {
  children: React.ReactNode;
  className?: string;
}

export default function BackgroundDots({ children, className = "" }: BackgroundDotsProps) {
  const { theme } = useTheme();

  return (
    <div 
      className={clsx(
        "min-h-screen",
        theme === "light" ? "bg-gray-50" : "bg-black",
        className
      )}
      style={{
        backgroundImage: theme === "light" ? 
          'radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)' :
          'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      {children}
    </div>
  );
}