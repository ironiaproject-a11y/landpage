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
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    background: #000;
                    width: 100%;
                }

                /* VIDEO CONTROL (DO NOT CHANGE POSITION) */
                .hero-video {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: 15% center;
                    /* B&W Cinematic Filter */
                    filter: grayscale(100%) brightness(0.5) contrast(1.05);
                    z-index: 0;
                }

                /* LOCAL CONTRAST (LEFT SIDE FOCUS) */
                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        to right,
                        rgba(0,0,0,0.75) 0%,
                        rgba(0,0,0,0.5) 40%,
                        rgba(0,0,0,0) 100%
                    );
                    z-index: 1;
                }

                /* CONTAINER (POSITIONING CRITICAL - ABOVE CENTER) */
                .hero-content {
                    position: relative;
                    z-index: 2;
                    max-width: 420px;
                    margin-left: 8vw;
                    transform: translateY(-5vh);
                }

                /* TYPOGRAPHY HIERARCHY (REFINED) */
                .hero-pre {
                    font-family: 'Source Serif 4', serif;
                    font-size: clamp(16px, 1.5vw, 22px);
                    color: rgba(255,255,255,0.55);
                    margin-bottom: 28px;
                    opacity: 0;
                    transform: translateY(20px);
                    animation: fadeSoft 1s ease forwards;
                    animation-delay: 0.5s;
                }

                .hero-title {
                    font-family: 'Source Serif 4', serif;
                    font-size: clamp(56px, 7vw, 90px);
                    line-height: 1.1;
                    letter-spacing: -0.025em;
                    color: #FFFFFF;
                    text-shadow: 0 0 25px rgba(255,255,255,0.08);
                    opacity: 0;
                    transform: translateY(60px) scale(0.95);
                    animation: fadeStrong 1.2s cubic-bezier(.22,.9,.32,1) forwards;
                    animation-delay: 0.8s;
                }

                /* ANIMATION (SUBTLE + REFINED) */
                @keyframes fadeSoft {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeStrong {
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @media (max-width: 768px) {
                    .hero-content { 
                        margin-left: 20px; 
                        max-width: 80%;
                        transform: translateY(-2vh); 
                    }
                    .hero-title { font-size: clamp(48px, 10vw, 64px); }
                }
            `}</style>

            <video 
                ref={videoRef}
                muted 
                playsInline 
                className="hero-video"
                preload="auto"
            >
                <source src="/Aqui.mp4" type="video/mp4" />
            </video>

            <div className="hero-overlay"></div>

            <div className="hero-content">
                <p className="hero-pre">Sua origem</p>
                <h1 className="hero-title">Seu sorriso</h1>
            </div>
        </section>
    );
}
