"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!sectionRef.current || !videoRef.current) return;

        const video = videoRef.current;
        const section = sectionRef.current;

        const ctx = gsap.context(() => {
            // GSAP Scroll Scrubbing for the "Entire Video" (Cinematic Experience)
            const initScroll = () => {
                if (!video.duration) return;
                
                gsap.to(video, {
                    currentTime: video.duration,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: "+=300vh",
                        scrub: 1.2,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    }
                });
            };

            video.load();
            if (video.readyState >= 1) {
                initScroll();
            } else {
                video.onloadedmetadata = initScroll;
            }

            // preloader interaction
            window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
        });

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="hero">
            <style>{`
                .hero {
                    position: relative;
                    min-height: 100svh;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    background: #000;
                    width: 100%;
                }

                .heroVideo {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    /* Manted 15% left alignment as previously approved */
                    object-position: 15% center;
                    filter: brightness(0.45) contrast(1.05) grayscale(100%);
                    z-index: 0;
                }

                .heroShade {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    background: linear-gradient(
                        to right,
                        rgba(0, 0, 0, 0.82) 0%,
                        rgba(0, 0, 0, 0.72) 32%,
                        rgba(0, 0, 0, 0.35) 62%,
                        rgba(0, 0, 0, 0) 100%
                    );
                }

                .heroCopy {
                    position: relative;
                    z-index: 2;
                    width: min(460px, 84vw);
                    margin-left: clamp(24px, 8vw, 96px);
                    transform: translateY(-4vh);
                    padding-top: 8vh;
                }

                .heroPre {
                    margin: 0 0 24px 0;
                    font-family: 'Source Serif 4', serif;
                    font-size: clamp(16px, 1.5vw, 22px);
                    font-weight: 400;
                    color: rgba(255, 255, 255, 0.58);
                    letter-spacing: -0.01em;
                    opacity: 0;
                    transform: translateY(18px);
                    animation: fadeUp 0.9s ease forwards;
                    animation-delay: 0.5s; /* Sync with preloader */
                }

                .heroTitle {
                    margin: 0;
                    font-family: 'Source Serif 4', serif;
                    font-size: clamp(56px, 7vw, 90px);
                    line-height: 0.98;
                    letter-spacing: -0.03em;
                    font-weight: 400;
                    color: #fff;
                    text-shadow: 0 0 24px rgba(255, 255, 255, 0.08);
                    opacity: 0;
                    transform: translateY(42px);
                    animation: fadeUp 1.05s cubic-bezier(.22,.9,.32,1) forwards;
                    animation-delay: 0.78s;
                }

                .heroHint {
                    margin: 24px 0 0 0;
                    font-family: Inter, sans-serif;
                    font-size: 13px;
                    letter-spacing: 0.04em;
                    color: rgba(255, 255, 255, 0.45);
                    text-transform: uppercase;
                    opacity: 0;
                    transform: translateY(12px);
                    animation: fadeUp 0.9s ease forwards;
                    animation-delay: 1.05s;
                }

                @media (max-width: 768px) {
                    .heroCopy {
                        width: min(360px, 88vw);
                        margin-left: 6vw;
                        transform: translateY(-2vh);
                        padding-top: 10vh;
                    }

                    .heroTitle {
                        font-size: clamp(44px, 12vw, 64px);
                    }

                    .heroPre {
                        margin-bottom: 18px;
                    }
                }

                @keyframes fadeUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

            <video 
                ref={videoRef}
                muted 
                playsInline 
                className="heroVideo"
                preload="auto"
            >
                <source src="/Aqui.mp4" type="video/mp4" />
            </video>

            <div className="heroShade" />

            <div className="heroCopy">
                <p className="heroPre">Sua origem</p>
                <h1 className="heroTitle">Seu sorriso</h1>
                <p className="heroHint">Role para descobrir</p>
            </div>
        </section>
    );
}
