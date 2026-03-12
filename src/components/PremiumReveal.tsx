"use client";

import { m } from "framer-motion";
import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface PremiumRevealProps {
    children: React.ReactNode;
    direction?: "left" | "right" | "top" | "bottom";
    type?: "mask" | "fade" | "slide";
    delay?: number;
    duration?: number;
    className?: string;
    innerClassName?: string;
    once?: boolean;
}

/**
 * Enhanced PremiumReveal for unified entrance animations.
 * Supports various luxury reveal types with a consistent easing curve.
 */
export function PremiumReveal({
    children,
    direction = "bottom",
    type = "mask",
    delay = 0,
    duration = 1.2,
    className = "",
    innerClassName = "",
    once = true
}: PremiumRevealProps) {

    const variants = {
        hidden: {
            opacity: type === "fade" ? 0 : 1,
            clipPath: type === "mask" ? (
                direction === "left" ? "inset(0 100% 0 0)" :
                    direction === "right" ? "inset(0 0 0 100%)" :
                        direction === "top" ? "inset(0 0 100% 0)" :
                            "inset(100% 0 0 0)"
            ) : "inset(0 0 0 0)",
            y: type === "slide" ? (direction === "bottom" ? 40 : direction === "top" ? -40 : 0) : 0,
            x: type === "slide" ? (direction === "right" ? 40 : direction === "left" ? -40 : 0) : 0,
            filter: type === "mask" ? "blur(4px)" : "blur(0px)",
            scale: type === "mask" ? 1.02 : 1,
        },
        visible: {
            opacity: 1,
            clipPath: "inset(0 0 0 0)",
            y: 0,
            x: 0,
            filter: "blur(0px)",
            scale: 1,
            transition: {
                duration,
                delay,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <div className={cn("relative overflow-hidden will-change-[clip-path,opacity]", className)}>
            <m.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once, margin: "-10%" }}
                variants={variants}
                className={cn("w-full h-full will-change-transform", innerClassName)}
            >
                {children}
            </m.div>

        </div>
    );
}
