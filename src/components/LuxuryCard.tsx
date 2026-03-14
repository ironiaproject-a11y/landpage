"use client";

import { m } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface LuxuryCardProps {
    children: React.ReactNode;
    className?: string;
    innerClassName?: string;
    glowColor?: string;
    interactive?: boolean;
    delay?: number;
}

/**
 * A standardized, high-performance luxury card component.
 * Replaces multiple ad-hoc card implementations for a cleaner codebase.
 */
export function LuxuryCard({
    children,
    className = "",
    innerClassName = "",
    glowColor = "rgba(245, 245, 220, 0.05)",
    interactive = true,
    delay = 0
}: LuxuryCardProps) {
    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
                "glass-card-premium rounded-2xl p-px relative group overflow-hidden",
                className
            )}
        >
            {/* Animated Glow on Hover */}
            {interactive && (
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                    style={{
                        background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 40%)`
                    }}
                />
            )}

            <div className={cn("relative z-10 w-full", !innerClassName && "p-8 md:p-10", innerClassName)}>
                {children}
            </div>
        </m.div>
    );
}
