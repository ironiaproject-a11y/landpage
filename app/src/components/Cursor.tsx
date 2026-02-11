"use client";

import { useEffect, useState } from "react";
import { m, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

export function Cursor() {
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isMagnetic, setIsMagnetic] = useState(false);
    const [isTextHovered, setIsTextHovered] = useState(false);
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Enhanced spring configs for smoother magnetic effect
    const magneticSpringConfig = { damping: 20, stiffness: 200 };
    const normalSpringConfig = { damping: 25, stiffness: 250 };

    const [springConfig, setSpringConfig] = useState(normalSpringConfig);
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const magneticElement = target.closest('a, button, [role="button"], input, textarea, [data-cursor="magnetic"]');

            if (magneticElement) {
                const rect = magneticElement.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Enhanced magnetic pull with distance calculation
                const distanceX = e.clientX - centerX;
                const distanceY = e.clientY - centerY;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                // Stronger pull when closer
                const pullStrength = Math.min(1, 80 / distance);
                const targetX = centerX + distanceX * (1 - pullStrength);
                const targetY = centerY + distanceY * (1 - pullStrength);

                cursorX.set(targetX);
                cursorY.set(targetY);
                setIsHovered(true);
                setIsMagnetic(true);
                setIsTextHovered(false);
                setSpringConfig(magneticSpringConfig);
            } else {
                cursorX.set(e.clientX);
                cursorY.set(e.clientY);
                setIsHovered(false);
                setIsMagnetic(false);

                // Check if hovering over text
                const isText = target.tagName === 'P' || target.tagName === 'SPAN' || target.tagName === 'H1' || target.tagName === 'H2' || target.tagName === 'H3' || target.tagName === 'H4' || target.closest('[data-cursor="text"]');
                setIsTextHovered(!!isText);

                setSpringConfig(normalSpringConfig);
            }
        };

        const mouseDown = (e: MouseEvent) => {
            setIsActive(true);
            // Create ripple effect
            const id = Date.now();
            setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
            setTimeout(() => {
                setRipples(prev => prev.filter(r => r.id !== id));
            }, 800);
        };

        const mouseUp = () => setIsActive(false);

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mousedown", mouseDown);
        window.addEventListener("mouseup", mouseUp);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mousedown", mouseDown);
            window.removeEventListener("mouseup", mouseUp);
        };
    }, []);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (isMobile) return null;

    return (
        <>
            {/* Ripple Effects on Click */}
            <AnimatePresence>
                {ripples.map(ripple => (
                    <m.div
                        key={ripple.id}
                        initial={{ scale: 0, opacity: 0.6 }}
                        animate={{ scale: 3, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="fixed top-0 left-0 w-12 h-12 rounded-full border-2 border-[var(--color-silver-bh)] pointer-events-none z-[10000]"
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            translateX: "-50%",
                            translateY: "-50%",
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Enhanced Outer Ring with Glow */}
            <m.div
                className="fixed top-0 left-0 pointer-events-none z-[10000]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            >
                <m.div
                    className="w-8 h-8 rounded-full border pointer-events-none relative"
                    animate={{
                        scale: isHovered ? 2 : isActive ? 0.8 : 1,
                        borderWidth: isHovered ? "1px" : "1.5px",
                        borderColor: isHovered ? "rgba(212, 197, 165, 0.8)" : "rgba(212, 197, 165, 0.5)",
                    }}
                    transition={{
                        scale: { type: "spring", stiffness: 300, damping: 20 },
                        borderWidth: { duration: 0.2 },
                        borderColor: { duration: 0.3 }
                    }}
                >
                    {/* Glow effect when hovered */}
                    <m.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                            opacity: isHovered || isTextHovered ? 0.4 : 0,
                            scale: isHovered ? 1.5 : isTextHovered ? 1.2 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        style={{
                            background: "radial-gradient(circle, rgba(212, 197, 165, 0.3) 0%, transparent 70%)",
                            filter: isTextHovered ? "blur(4px)" : "blur(8px)",
                        }}
                    />
                    {isTextHovered && (
                        <m.div
                            className="absolute inset-0 border border-[var(--color-silver-bh)] opacity-20 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        />
                    )}
                </m.div>
            </m.div>

            {/* Inner Dot - Enhanced with pulse */}
            <m.div
                className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[var(--color-silver-bh)] pointer-events-none z-[10000]"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    opacity: isHovered ? 0 : 1,
                    scale: isHovered ? 0 : isActive ? 0.6 : 1,
                }}
                transition={{
                    opacity: { duration: 0.2 },
                    scale: { type: "spring", stiffness: 400, damping: 25 }
                }}
            />

            {/* Magnetic indicator text */}
            <AnimatePresence>
                {isMagnetic && (
                    <m.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.6, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-0 left-0 pointer-events-none z-[10000] text-[8px] font-bold uppercase tracking-widest text-[var(--color-silver-bh)] whitespace-nowrap"
                        style={{
                            x: cursorXSpring,
                            y: cursorYSpring,
                            translateX: "-50%",
                            translateY: "-200%",
                        }}
                    >
                        Click
                    </m.div>
                )}
            </AnimatePresence>
        </>
    );
}
