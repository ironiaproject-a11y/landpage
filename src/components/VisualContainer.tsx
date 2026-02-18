"use client";
import React, { useState, useRef, useEffect } from "react";
import { m, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
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
    hoverColor = "rgba(148, 163, 184, 0.08)", // Clinical Silver
    sideHeight = "12px", // Slightly increased for better 3D depth
    transformDuration = "0.7s", // Smoother transition
    header,
    footer,
    children,
    className,
}: VisualContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Mouse positions
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Scroll tracker for mobile automatic 3D
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"] as const
    });


    // Smooth springs - weighted for premium inertia
    const springConfig = { damping: 40, stiffness: 120, mass: 1 };

    // Intensified rotation (15 degrees) tilting TOWARDS the interaction
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [15, -15]), springConfig);

    // Automatic scroll-based tilt for mobile (reveals 3D side perspective automatically)
    const scrollRotateX = useSpring(useTransform(scrollYProgress, [0, 1], [-10, 10]), springConfig);
    const scrollRotateY = useSpring(useTransform(scrollYProgress, [0, 1], [5, -5]), springConfig);

    // Glare position transform - Dual Layer Specular highlights
    const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
    const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);
    const glareOpacity = useSpring(isHovered ? 0.5 : 0, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        setIsHovered(true); // Force hover state for mobile interaction
        const rect = containerRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        const x = (touch.clientX - rect.left) / rect.width - 0.5;
        const y = (touch.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <div
            ref={containerRef}
            className="relative"
            style={{ width, height, perspective: "2000px" }}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsHovered(true)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseLeave}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            <m.div
                className="w-full h-full relative preserve-3d"
                style={{
                    rotateX: isHovered ? rotateX : scrollRotateX,
                    rotateY: isHovered ? rotateY : scrollRotateY,
                    transformStyle: "preserve-3d",
                }}
                transition={{ duration: parseFloat(transformDuration) }}
            >
                {/* Main Card Surface */}
                <div
                    className={cn(
                        "relative w-full bg-[#0A0A0A]/80 border border-white/10 rounded-2xl overflow-hidden flex flex-col transition-all duration-700",
                        !isMobile && "backdrop-blur-md",
                        className
                    )}
                    style={{
                        boxShadow: isHovered && !isMobile
                            ? `0 35px 80px -20px ${hoverColor}, 0 0 1px 1px rgba(255,255,255,0.05) inset`
                            : "0 8px 12px -4px rgba(0,0,0,0.5)",
                        transform: "translateZ(0px)",
                        height: height === "auto" ? "auto" : "100%",
                    }}
                >
                    {/* Internal Noise Texture ("Glass 2.0") */}
                    <div className="absolute inset-0 opacity-[0.05] z-0 pointer-events-none mix-blend-overlay"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
                        }}
                    />

                    {/* Dynamic Glare Overlay - Dual Specular Layer */}
                    <m.div
                        className="absolute inset-0 z-10 pointer-events-none"
                        style={{
                            background: useTransform(
                                [glareX, glareY],
                                ([x, y]) => `
                                    radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.25) 0%, transparent 45%),
                                    radial-gradient(circle at ${x} ${y}, rgba(203, 213, 225, 0.15) 0%, transparent 70%)
                                `
                            ),
                            opacity: glareOpacity
                        }}
                    />

                    {header && (
                        <div className="p-4 border-b border-white/5 bg-white/5 translate-z-20">
                            {header}
                        </div>
                    )}

                    <div className="flex-grow relative flex flex-col">
                        {children && (Array.isArray(children) ? children : [children]).map((child, idx) => (
                            <m.div
                                key={idx}
                                className="w-full relative flex flex-col h-full"
                                style={{
                                    transform: `translateZ(${(idx + 1) * 20}px)`,
                                    transformStyle: "preserve-3d",
                                }}
                            >
                                {child}
                            </m.div>
                        ))}
                    </div>

                    {footer && (
                        <div className="p-4 border-t border-white/5 bg-white/5 translate-z-10">
                            {footer}
                        </div>
                    )}
                </div>

                {/* 3D Sides/Depth Effect */}
                <div
                    className="absolute top-0 bottom-0 left-0 bg-[#000] opacity-30"
                    style={{ width: sideHeight, transform: "rotateY(-90deg) translateZ(0.5px)", transformOrigin: "left" }}
                />
                <div
                    className="absolute top-0 bottom-0 right-0 bg-[#000] opacity-30"
                    style={{ width: sideHeight, transform: "rotateY(90deg) translateZ(0.5px)", transformOrigin: "right" }}
                />
                <div
                    className="absolute left-0 right-0 top-0 bg-[#000] opacity-30"
                    style={{ height: sideHeight, transform: "rotateX(90deg) translateZ(0.5px)", transformOrigin: "top" }}
                />
                <div
                    className="absolute left-0 right-0 bottom-0 bg-[#000] opacity-30"
                    style={{ height: sideHeight, transform: "rotateX(-90deg) translateZ(0.5px)", transformOrigin: "bottom" }}
                />
            </m.div>
        </div>
    );
}

