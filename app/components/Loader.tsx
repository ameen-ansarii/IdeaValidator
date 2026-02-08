import React from "react";
import clsx from "clsx";

interface LoaderProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

const Loader = ({ size = "md", className }: LoaderProps) => {
    // iOS Spoke Spinner dimensions
    const dimensions = {
        sm: { size: "w-4 h-4", barH: "h-1", barW: "w-0.5" },
        md: { size: "w-8 h-8", barH: "h-2.5", barW: "w-1" },
        lg: { size: "w-12 h-12", barH: "h-3.5", barW: "w-1.5" }
    };

    const { size: wrapperSize, barH, barW } = dimensions[size];
    const spokes = Array.from({ length: 12 });

    return (
        <div className={clsx("relative flex items-center justify-center", wrapperSize, className)}>
            {spokes.map((_, i) => (
                <div
                    key={i}
                    className={clsx(
                        "absolute rounded-full bg-[var(--foreground)]",
                        barH, barW
                    )}
                    style={{
                        transform: `rotate(${i * 30}deg) translate(0, -140%)`,
                        opacity: 0.1,
                        animation: `ios-spinner 1.2s linear infinite`,
                        animationDelay: `${-1.1 + (i * 0.1)}s`
                    }}
                />
            ))}
        </div>
    );
};

export default Loader;
