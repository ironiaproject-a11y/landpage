"use client";

import React, { useState, useRef, useEffect } from "react";
import { m, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { MoveLeft, MoveRight, Sparkles } from "lucide-react";
import Image from "next/image";

interface ComparisonProps {
    beforeImage: string;
    afterImage: string;
    title: string;
    description: string;
    isSingleImage?: boolean;
}

export function BeforeAfterSlider({ beforeImage, afterImage, title, description, isSingleImage }: ComparisonProps) {
    const [sliderPos, setSliderPos] = useState(isSingleImage ? 100 : 50);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (e: React.MouseEvent | React.TouchEvent | any) => {
        if (isSingleImage) return;
        if (!isResizing && e.type !== "mousemove" && e.type !== "touchmove") return;

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = "touches" in e ? e.touches[0].clientX : e.clientX;
        const relativeX = x - rect.left;
        const position = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));

        setSliderPos(position);
    };

    const handleMouseDown = () => {
        if (!isSingleImage) setIsResizing(true);
    };
    const handleMouseUp = () => setIsResizing(false);

    // Magnetic Handle Logic
    const handleX = useMotionValue(0);
    const handleY = useMotionValue(0);
    const springConfig = { damping: 20, stiffness: 200 };
    const springHandleX = useSpring(handleX, springConfig);
    const springHandleY = useSpring(handleY, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isSingleImage || isResizing) return;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const centerX = rect.left + (rect.width * sliderPos) / 100;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < 100) {
            const pull = Math.max(0, (100 - distance) / 100);
            handleX.set(distanceX * pull * 0.4);
            handleY.set(distanceY * pull * 0.4);
        } else {
            handleX.set(0);
            handleY.set(0);
        }
    };

    const handleMouseLeave = () => {
        handleX.set(0);
        handleY.set(0);
    };

    useEffect(() => {
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchend", handleMouseUp);
        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, []);

    return (
        <div className="group relative flex flex-col gap-8">
            <div
                ref={containerRef}
                className={`relative aspect-[16/10] w-full overflow-hidden rounded-organic-md border border-white/10 ${isSingleImage ? "" : "cursor-col-resize"} select-none shadow-2xl`}
                onMouseMove={(e) => {
                    handleMove(e);
                    handleMouseMove(e);
                }}
                onMouseLeave={handleMouseLeave}
                onTouchMove={handleMove}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >
                {/* After Image (Background) */}
                <Image
                    src={afterImage}
                    alt="After"
                    fill
                    className="object-cover"
                    priority
                />

                {!isSingleImage && (
                    <>
                        {/* Before Image (Clip) */}
                        <div
                            className="absolute inset-0 w-full h-full overflow-hidden"
                            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                        >
                            <Image
                                src={beforeImage}
                                alt="Before"
                                fill
                                className="object-cover grayscale"
                                priority
                            />
                            {/* Before Label */}
                            <div className="absolute top-6 left-6 px-4 py-2 rounded-full glass-panel border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Antes</span>
                            </div>
                        </div>

                        {/* After Label */}
                        <div className="absolute top-6 right-6 px-4 py-2 rounded-full glass-panel border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-silver-bh)]">Depois</span>
                        </div>

                        {/* Slider Handle */}
                        <m.div
                            className="absolute inset-y-0 z-20 group/handle"
                            style={{
                                left: `${sliderPos}%`,
                                x: springHandleX,
                                y: springHandleY
                            }}
                        >
                            <m.div
                                animate={{
                                    opacity: [0.3, 0.6, 0.3],
                                    boxShadow: [
                                        "0 0 10px rgba(226, 232, 240, 0.2)",
                                        "0 0 25px rgba(226, 232, 240, 0.4)",
                                        "0 0 10px rgba(226, 232, 240, 0.2)"
                                    ]
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-y-0 -left-[1px] w-[2px] bg-gradient-to-b from-transparent via-[var(--color-silver-bh)] to-transparent"
                            />

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#0B0B0B] border border-[var(--color-silver-bh)] flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover/handle:scale-110">
                                <div className="flex items-center gap-1 text-[var(--color-silver-bh)]">
                                    <MoveLeft strokeWidth={1.2} className="w-3 h-3" />
                                    <MoveRight strokeWidth={1.2} className="w-3 h-3" />
                                </div>
                            </div>
                        </m.div>
                    </>
                )}

                {/* Texture Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
            </div>

            <div className="flex flex-col gap-4 px-2">
                <div className="flex items-center gap-3">
                    <Sparkles strokeWidth={1.2} className="w-4 h-4 text-[var(--color-silver-bh)]" />
                    <h4 className="font-display text-2xl text-white font-medium">{title}</h4>
                </div>
                <p className="text-[var(--color-text-secondary)] font-light leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}
