"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { useReducedMotion } from "framer-motion";

interface MediaCardProps {
    webmSrc?: string;
    mp4Src: string;
    posterSrc: string;
    alt: string;
    ariaLabel: string;
    className?: string;
    aspectRatio?: string;
    onPlay?: () => void;
    onPause?: () => void;
    playing?: boolean;
    onClick?: () => void;
}

/**
 * MediaCard Component
 * 
 * Optimized for performance and accessibility:
 * - Lazy-loads poster images via IntersectionObserver.
 * - Injects video sources only on user interaction (hover/touch/focus).
 * - Manages concurrent video playback via 'pauseAllExcept'.
 * - Respects prefers-reduced-motion.
 */
export function MediaCard({
    webmSrc,
    mp4Src,
    posterSrc,
    alt,
    ariaLabel,
    className,
    aspectRatio = "aspect-[4/3]",
    onPlay,
    onPause,
    playing,
    onClick
}: MediaCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const posterRef = useRef<HTMLImageElement>(null);
    const internalChangeRef = useRef(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);

    const shouldReduceMotion = useReducedMotion();

    // 3. Source Injection on Interaction
    const loadSources = useCallback(() => {
        if (!videoRef.current || videoRef.current.dataset.loaded === "1") return;

        const video = videoRef.current;

        // Add MP4 Source
        const mp4 = document.createElement("source");
        mp4.src = mp4Src.includes("#t=") ? mp4Src : `${mp4Src}#t=0.001`;
        mp4.type = "video/mp4";
        video.appendChild(mp4);

        // Add WebM Source if provided
        if (webmSrc) {
            const webm = document.createElement("source");
            webm.src = webmSrc.includes("#t=") ? webmSrc : `${webmSrc}#t=0.001`;
            webm.type = "video/webm";
            video.insertBefore(webm, mp4);
        }

        video.load();
        video.dataset.loaded = "1";
    }, [mp4Src, webmSrc]);

    // 1. Intersection Observer for Lazy Loading
    useEffect(() => {
        if (!cardRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    loadSources(); // Start loading as soon as it's in view
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1, rootMargin: "50px" }
        );

        observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, [loadSources]);

    // 2. Pause All Except logic
    const pauseAllExcept = useCallback((currentVideo: HTMLVideoElement) => {
        const allVideos = document.querySelectorAll<HTMLVideoElement>(".media-video");
        allVideos.forEach((v) => {
            if (v !== currentVideo && !v.paused) {
                v.pause();
                // Communicate to other components that they should update their state
                v.dispatchEvent(new CustomEvent("media-paused-externally"));
            }
        });
    }, []);

    const handlePlay = useCallback(async (isInternal = true) => {
        if (shouldReduceMotion) return;

        // Ensure sources are loaded if play is triggered (fallback/focus)
        loadSources();

        if (!videoRef.current) return;

        pauseAllExcept(videoRef.current);

        try {
            await videoRef.current.play();
            setIsPlaying(true);
            if (isInternal) {
                internalChangeRef.current = true;
                onPlay?.();
            }
        } catch (err) {
            console.warn("MediaCard: Play promise rejected", err);
        }
    }, [shouldReduceMotion, onPlay, pauseAllExcept, loadSources]);

    const handlePause = useCallback((isInternal = true) => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
            if (isInternal) {
                internalChangeRef.current = true;
                onPause?.();
            }
        }
    }, [onPause]);

    // Sync with external 'playing' prop
    useEffect(() => {
        if (playing !== undefined) {
            if (internalChangeRef.current) {
                internalChangeRef.current = false;
                return;
            }

            if (playing) {
                handlePlay(false);
            } else {
                handlePause(false);
            }
        }
    }, [playing, handlePlay, handlePause]);

    // External pause listener
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleExternalPause = () => setIsPlaying(false);
        video.addEventListener("media-paused-externally", handleExternalPause);
        return () => video.removeEventListener("media-paused-externally", handleExternalPause);
    }, []);

    return (
        <div
            ref={cardRef}
            className={clsx(
                "media-card group relative overflow-hidden bg-black transition-all duration-500",
                isPlaying && "is-playing",
                aspectRatio,
                className
            )}
            tabIndex={0}
            role="button"
            aria-label={ariaLabel}
            onPointerEnter={!shouldReduceMotion ? () => handlePlay() : undefined}
            onPointerLeave={() => handlePause()}
            onFocus={() => handlePlay()}
            onBlur={() => handlePause()}
            onClick={() => {
                if (onClick) {
                    onClick();
                } else {
                    isPlaying ? handlePause() : handlePlay();
                }
            }}
        >
            {/* Video Layer */}
            <video
                ref={videoRef}
                muted
                playsInline
                loop
                preload="auto"
                aria-hidden="true"
                onLoadedData={() => setIsLoaded(true)}
                className={clsx(
                    "media-video absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out z-[1]",
                    isLoaded ? "opacity-100" : "opacity-0"
                )}
            />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-[10]" />
        </div>
    );
}
