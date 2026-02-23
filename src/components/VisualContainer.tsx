"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { m, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface VisualContainerProps {
    width?: string;
    height?: string;
    hoverColor?: string;
    sideHeight?: string;
    transformDuration?: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children?: React.ReactNode | React.ReactNode[];
    className?: string;
}

export default function VisualContainer({
    width = "100%",
    height = "100%",
    hoverColor = "rgba(148, 163, 184, 0.08)",
    sideHeight = "8px",
    transformDuration = "0.6s",
    header,
    footer,
    children,
    className,
}: VisualContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const isVisibleRef = useRef(true);
    const ambientRef = useRef<number>(0);
    const rafRef = useRef<number>();

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Mouse positions (normalized -0.5 to 0.5)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // IntersectionObserver: reset when off-screen
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                isVisibleRef.current = entries[0].isIntersecting;
                if (!entries[0].isIntersecting) {
                    mouseX.set(0);
                    mouseY.set(0);
                    setIsHovered(false);
                    setIsClicked(false);
                }
            },
            { threshold: 0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [mouseX, mouseY]);

    // Unified spring for all movements - smooth and stable
    const springConfig = { stiffness: 60, damping: 25, mass: 1.2 };

    const rotateX = useSpring(
        useTransform(mouseY, [-0.5, 0.5], [-4, 4]),
        springConfig
    );
    const rotateY = useSpring(
        useTransform(mouseX, [-0.5, 0.5], [4, -4]),
        springConfig
    );

    // Glare: follows mouse across the full card surface
    const glareX = useTransform(mouseX, [-0.5, 0.5], ["10%", "90%"]);
    const glareY = useTransform(mouseY, [-0.5, 0.5], ["10%", "90%"]);

    // Entry animation
    const isInView = useInView(containerRef, { once: true, margin: "0px 0px -80px 0px" });

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !isVisibleRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    }, [mouseX, mouseY]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        setIsClicked(false);
        // Smoothly return — ambient loop takes over
    }, []);

    return (
        <m.div
            ref={containerRef}
            className="relative"
            style={{ width, height, perspective: "1000px" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsClicked(!isClicked)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={handleMouseLeave}
            onTouchCancel={handleMouseLeave}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
            <m.div
                className="w-full h-full relative"
                animate={{
                    rotateX: rotateX.get(),
                    rotateY: rotateY.get(),
                    scale: isClicked || (isMobile && isHovered) ? 1.06 : 1,
                    z: isClicked || (isMobile && isHovered) ? 60 : 0
                }}
                transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 18,
                    mass: 1
                }}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Main Card Surface */}
                <div
                    className={cn(
                        "relative w-full bg-[#0A0A0A]/80 border border-white/10 rounded-2xl overflow-hidden flex flex-col",
                        !isMobile && "backdrop-blur-md",
                        isClicked && "border-white/20",
                        className
                    )}
                    style={{
                        boxShadow: isClicked
                            ? `0 50px 100px -20px ${hoverColor}, 0 0 2px 2px rgba(255,255,255,0.1) inset`
                            : isHovered && !isMobile
                                ? `0 30px 70px -15px ${hoverColor}, 0 0 1px 1px rgba(255,255,255,0.06) inset`
                                : "0 6px 24px -4px rgba(0,0,0,0.6)",
                        transform: "translateZ(0px)",
                        height: height === "auto" ? "auto" : "100%",
                        transition: `all ${transformDuration} cubic-bezier(0.22, 1, 0.36, 1)`,
                    }}
                >
                    {/* Noise Texture */}
                    <div
                        className="absolute inset-0 opacity-[0.04] z-0 pointer-events-none mix-blend-overlay"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
                        }}
                    />

                    {/* Glass Glare — tracks mouse like real glass */}
                    <m.div
                        className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
                        style={{
                            background: useTransform(
                                [glareX, glareY],
                                ([x, y]) => `
                                    radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 35%, transparent 65%),
                                    radial-gradient(ellipse at ${x} ${y}, rgba(203,213,225,0.06) 0%, transparent 75%)
                                `
                            ),
                            opacity: isHovered ? 1 : 0.4,
                            transition: `opacity 0.4s ease`,
                        }}
                    />

                    {header && (
                        <div className="p-4 border-b border-white/5 bg-white/5">
                            {header}
                        </div>
                    )}

                    <div className="flex-grow relative flex flex-col">
                        {children && (Array.isArray(children) ? children : [children]).map((child, idx) => (
                            <m.div
                                key={idx}
                                className="w-full relative flex flex-col h-full"
                                style={{
                                    transform: `translateZ(${(idx + 1) * 12}px)`,
                                    transformStyle: "preserve-3d",
                                }}
                            >
                                {child}
                            </m.div>
                        ))}
                    </div>

                    {footer && (
                        <div className="p-4 border-t border-white/5 bg-white/5">
                            {footer}
                        </div>
                    )}
                </div>

                {/* 3D Depth Edges */}
                <div
                    className="absolute top-0 bottom-0 left-0 bg-[#0D0D0D] border-r border-white/5"
                    style={{ width: sideHeight, transform: "rotateY(-90deg) translateZ(0.5px)", transformOrigin: "left" }}
                />
                <div
                    className="absolute top-0 bottom-0 right-0 bg-[#0D0D0D] border-l border-white/5"
                    style={{ width: sideHeight, transform: "rotateY(90deg) translateZ(0.5px)", transformOrigin: "right" }}
                />
                <div
                    className="absolute left-0 right-0 top-0 bg-[#0D0D0D] border-b border-white/5"
                    style={{ height: sideHeight, transform: "rotateX(90deg) translateZ(0.5px)", transformOrigin: "top" }}
                />
                <div
                    className="absolute left-0 right-0 bottom-0 bg-[#0D0D0D] border-t border-white/5"
                    style={{ height: sideHeight, transform: "rotateX(-90deg) translateZ(0.5px)", transformOrigin: "bottom" }}
                />
            </m.div>
        </m.div>
    );
}
