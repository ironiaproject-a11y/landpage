"use client";

import React, { useRef, useEffect, useState } from "react";
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
    onPause
}: MediaCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const posterRef = useRef<HTMLImageElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);

    const shouldReduceMotion = useReducedMotion();

    // 1. IntersectionObserver for Poster Lazy-Loading and Source Injection
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        // Trigger source injection as soon as it's in view to show the real frame
                        loadSources();
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: "200px", threshold: 0.01 }
        );

        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    // 2. Pause All Except logic
    const pauseAllExcept = (currentVideo: HTMLVideoElement) => {
        const allVideos = document.querySelectorAll<HTMLVideoElement>(".media-video");
        allVideos.forEach((v) => {
            if (v !== currentVideo && !v.paused) {
                v.pause();
                // Communicate to other components that they should update their state
                v.dispatchEvent(new CustomEvent("media-paused-externally"));
            }
        });
    };

    // 3. Source Injection on Interaction
    const loadSources = () => {
        if (!videoRef.current || videoRef.current.dataset.loaded === "1") return;

        const video = videoRef.current;

        if (webmSrc) {
            const webm = document.createElement("source");
            webm.src = webmSrc;
            webm.type = "video/webm";
            video.appendChild(webm);
        }

        const mp4 = document.createElement("source");
        mp4.src = mp4Src;
        mp4.type = "video/mp4";
        video.appendChild(mp4);

        video.load();
        video.dataset.loaded = "1";
    };

    const handlePlay = async () => {
        if (shouldReduceMotion) return;
        if (!videoRef.current) return;

        loadSources();
        pauseAllExcept(videoRef.current);

        try {
            await videoRef.current.play();
            setIsPlaying(true);
            onPlay?.();
        } catch (err) {
            console.warn("MediaCard: Play promise rejected", err);
        }
    };

    const handlePause = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
            onPause?.();
        }
    };

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
            onPointerEnter={!shouldReduceMotion ? handlePlay : undefined}
            onPointerLeave={handlePause}
            onFocus={handlePlay}
            onBlur={handlePause}
            onClick={() => isPlaying ? handlePause() : handlePlay()}
        >
            {/* Poster Layer */}
            {isInView && (
                <img
                    ref={posterRef}
                    src={posterSrc}
                    alt={alt}
                    className={clsx(
                        "media-poster absolute inset-0 w-full h-full object-cover transition-opacity duration-700 z-[2]",
                        isLoaded ? "opacity-0 invisible pointer-events-none" : "opacity-100"
                    )}
                />
            )}

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
                    "media-video absolute inset-0 w-full h-full object-cover transition-opacity duration-[220ms] ease-in-out z-[1]",
                    isLoaded ? "opacity-100" : "opacity-0"
                )}
            />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-[10]" />
        </div>
    );
}
