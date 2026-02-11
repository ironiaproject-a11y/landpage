"use client";

import { m } from "framer-motion";
import React from "react";

interface PremiumRevealProps {
    children: React.ReactNode;
    direction?: "left" | "right" | "top" | "bottom";
    delay?: number;
    duration?: number;
    className?: string;
    innerClassName?: string;
}

export function PremiumReveal({
    children,
    direction = "left",
    delay = 0,
    duration = 1.2,
    className = "",
    innerClassName = ""
}: PremiumRevealProps) {

    const variants = {
        hidden: {
            clipPath: direction === "left" ? "inset(0 100% 0 0)" :
                direction === "right" ? "inset(0 0 0 100%)" :
                    direction === "top" ? "inset(0 0 100% 0)" :
                        "inset(100% 0 0 0)",
            scale: 1.1,
            filter: "blur(10px)",
        },
        visible: {
            clipPath: "inset(0 0 0 0)",
            scale: 1,
            filter: "blur(0px)",
            transition: {
                duration,
                delay,
                ease: [0.77, 0, 0.175, 1]
            }
        }
    };

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <m.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                variants={variants}
                className={`w-full h-full ${innerClassName}`}
            >
                {children}
            </m.div>

            {/* Premium Overlay Line (moving with the mask) */}
            <m.div
                initial={
                    direction === "left" ? { left: 0, width: "100%" } :
                        direction === "right" ? { right: 0, width: "100%" } :
                            direction === "top" ? { top: 0, height: "100%" } :
                                { bottom: 0, height: "100%" }
                }
                whileInView={
                    direction === "left" ? { left: "100%", width: "0%" } :
                        direction === "right" ? { right: "100%", width: "0%" } :
                            direction === "top" ? { top: "100%", height: "0%" } :
                                { bottom: "100%", height: "0%" }
                }
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                    duration,
                    delay,
                    ease: [0.77, 0, 0.175, 1]
                }}
                className={`absolute z-20 bg-gradient-to-r from-[var(--color-silver-bh)] to-transparent ${(direction === "left" || direction === "right") ? "top-0 bottom-0 w-[2px]" : "left-0 right-0 h-[2px]"
                    }`}
            />
        </div>
    );
}
