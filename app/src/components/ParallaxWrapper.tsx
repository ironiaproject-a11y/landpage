"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ParallaxWrapperProps {
    children: React.ReactNode;
    speed?: number; // Speed multiplier (positive for same direction, negative for opposite)
    direction?: "vertical" | "horizontal";
    className?: string;
    lerp?: number; // Smoothness (higher = smoother/slower follow)
}

/**
 * Premium Parallax Wrapper using GSAP ScrollTrigger for ultra-smooth performance.
 * Works perfectly with the existing Lenis smooth scroll.
 */
export function ParallaxWrapper({
    children,
    speed = 0.5,
    direction = "vertical",
    className = "",
    lerp = 0.1
}: ParallaxWrapperProps) {
    const triggerRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!triggerRef.current || !targetRef.current) return;

        const ctx = gsap.context(() => {
            const movement = speed * 200; // Multiplier to pixels for more noticeable depth

            gsap.fromTo(targetRef.current,
                {
                    [direction === "vertical" ? "y" : "x"]: movement
                },
                {
                    [direction === "vertical" ? "y" : "x"]: -movement,
                    ease: "none",
                    scrollTrigger: {
                        trigger: triggerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: lerp,
                    }
                }
            );
        });

        return () => ctx.revert();
    }, [speed, direction, lerp]);

    return (
        <div ref={triggerRef} className={`overflow-hidden ${className}`}>
            <div ref={targetRef} className="h-full w-full">
                {children}
            </div>
        </div>
    );
}

export default ParallaxWrapper;
