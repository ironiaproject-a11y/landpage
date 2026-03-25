"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { m, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { MoveLeft, MoveRight, Sparkles } from "lucide-react";
import Image from "next/image";

interface ComparisonProps {
    beforeSource: string;
    beforeType?: "image" | "video";
    afterSource: string;
    afterType?: "image" | "video";
    title: string;
    description: string;
    isSingleMedia?: boolean;
}

export function BeforeAfterSlider({
    beforeSource,
    beforeType = "image",
    afterSource,
    afterType = "image",
    title,
    description,
    isSingleMedia
}: ComparisonProps) {
    const [sliderPos, setSliderPos] = useState(isSingleMedia ? 100 : 50);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (e: React.MouseEvent | React.TouchEvent | any) => {
        if (isSingleMedia) return;
        if (!isResizing && e.type !== "mousemove" && e.type !== "touchmove") return;

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = "touches" in e ? e.touches[0].clientX : e.clientX;
        const relativeX = x - rect.left;
        const position = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));

        setSliderPos(position);
    };

    const videoRefBefore = useRef<HTMLVideoElement>(null);
    const videoRefAfter = useRef<HTMLVideoElement>(null);

    const startVideos = useCallback(() => {
        // Injetar sources sob demanda para performance
        const loadSources = (v: HTMLVideoElement | null, src: string) => {
            if (!v || v.dataset.loaded === "1") return;
            const mp4 = document.createElement("source");
            mp4.src = src;
            mp4.type = "video/mp4";
            v.appendChild(mp4);
            v.load();
            v.dataset.loaded = "1";
        };

        if (beforeType === "video") loadSources(videoRefBefore.current, beforeSource);
        if (afterType === "video") loadSources(videoRefAfter.current, afterSource);

        videoRefBefore.current?.play().catch(() => { });
        videoRefAfter.current?.play().catch(() => { });
    }, [beforeSource, beforeType, afterSource, afterType]);

    const stopVideos = useCallback(() => {
        videoRefBefore.current?.pause();
        videoRefAfter.current?.pause();
    }, []);

    const handleMouseDown = useCallback(() => {
        if (!isSingleMedia) setIsResizing(true);
        startVideos();
    }, [isSingleMedia, startVideos]);

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
        stopVideos();
    }, [stopVideos]);

    // Magnetic Handle Logic
    const handleX = useMotionValue(0);
    const handleY = useMotionValue(0);
    const springConfig = { damping: 20, stiffness: 200 };
    const springHandleX = useSpring(handleX, springConfig);
    const springHandleY = useSpring(handleY, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isSingleMedia || isResizing) return;
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

        // Se estiver perto do handle, pré-carrega os vídeos
        if (distance < 150) {
            // Apenas injeta sources, não dá play ainda
            const loadSourcesOnly = (v: HTMLVideoElement | null, src: string) => {
                if (!v || v.dataset.loaded === "1") return;
                const mp4 = document.createElement("source");
                mp4.src = src;
                mp4.type = "video/mp4";
                v.appendChild(mp4);
                v.load();
                v.dataset.loaded = "1";
            };
            if (beforeType === "video") loadSourcesOnly(videoRefBefore.current, beforeSource);
            if (afterType === "video") loadSourcesOnly(videoRefAfter.current, afterSource);
        }
    };

    const handleMouseLeave = () => {
        handleX.set(0);
        handleY.set(0);
        stopVideos();
    };

    useEffect(() => {
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchend", handleMouseUp);
        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, [handleMouseUp]);

    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        // Pré-carrega os vídeos assim que entram em vista para mostrar o frame real
                        const loadSourcesOnly = (v: HTMLVideoElement | null, src: string) => {
                            if (!v || v.dataset.loaded === "1") return;
                            const mp4 = document.createElement("source");
                            mp4.src = src;
                            mp4.type = "video/mp4";
                            v.appendChild(mp4);
                            v.load();
                            v.dataset.loaded = "1";
                        };
                        if (beforeType === "video") loadSourcesOnly(videoRefBefore.current, beforeSource);
                        if (afterType === "video") loadSourcesOnly(videoRefAfter.current, afterSource);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: "200px", threshold: 0.01 }
        );

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [beforeSource, afterSource, beforeType, afterType]);

    const MediaRenderer = ({ source, type, label, poster, isBefore = false }: { source: string; type: "image" | "video"; label: string; poster?: string; isBefore?: boolean }) => {
        const [isLoaded, setIsLoaded] = useState(false);

        if (type === "video") {
            return (
                <>
                    <video
                        ref={isBefore ? videoRefBefore : videoRefAfter}
                        poster={poster}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        onLoadedData={() => setIsLoaded(true)}
                        className={`absolute inset-0 w-full h-full object-cover grayscale transition-opacity duration-700 ${isLoaded ? "opacity-100 z-[2]" : "opacity-0 z-[1]"}`}
                        aria-hidden="true"
                    />
                    {poster && (
                        <Image
                            src={poster}
                            alt={label}
                            fill
                            className={`object-cover grayscale transition-opacity duration-700 ${isLoaded ? "opacity-0 invisible pointer-events-none" : "opacity-100"} z-[1]`}
                        />
                    )}
                </>
            );
        }
        return (
            <Image
                src={source}
                alt={label}
                fill
                priority={isBefore}
                className={`object-cover grayscale`}
            />
        );
    };

    return (
        <div className="group relative flex flex-col gap-8">
            <div
                ref={containerRef}
                className={`relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] border border-white/10 ${isSingleMedia ? "" : "cursor-col-resize"} select-none shadow-2xl`}
                style={{ touchAction: "pan-y" }}
                onMouseMove={(e) => {
                    handleMove(e);
                    handleMouseMove(e);
                }}
                onMouseLeave={handleMouseLeave}
                onTouchMove={handleMove}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >

                {/* After Media (Background) */}
                <MediaRenderer
                    source={afterSource}
                    type={afterType}
                    label="After"
                    poster={beforeType === "image" ? beforeSource : undefined}
                />

                {!isSingleMedia && (
                    <>
                        {/* Before Media (Clip) */}
                        <div
                            className="absolute inset-0 w-full h-full overflow-hidden"
                            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                        >
                            <MediaRenderer source={beforeSource} type={beforeType} label="Before" isBefore />

                            {/* Before Label */}
                            <div className="absolute top-6 left-6 px-4 py-2 rounded-full glass-panel border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-caption-marker !text-white/60">Antes</span>
                            </div>
                        </div>

                        {/* After Label */}
                        <div className="absolute top-6 right-6 px-4 py-2 rounded-full glass-panel border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-caption-marker">Depois</span>
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
                                className="absolute inset-y-0 -left-[1px] w-[2px] bg-gradient-to-b from-transparent via-[var(--color-text-primary)] to-transparent"
                            />

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#0D0D0D]/80 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-premium-2 transition-transform duration-300 group-hover/handle:scale-110">
                                <div className="flex items-center gap-1 text-[var(--color-accent-gold)]">
                                    <MoveLeft strokeWidth={1.5} className="w-3.5 h-3.5" />
                                    <MoveRight strokeWidth={1.5} className="w-3.5 h-3.5" />
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
                    <h4 className="text-h3 uppercase">{title}</h4>
                </div>
                <p className="text-body-refined text-white/60 max-w-xl">
                    {description}
                </p>
            </div>
        </div>
    );
}
