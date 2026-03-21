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
                    width: min(380px, 84vw); /* Based on max-w-[380px] */
                    margin-left: clamp(24px, 8vw, 96px);
                    transform: translateY(-4vh);
                }

                .heroPre {
                    margin: 0 0 16px 0; /* Updated mb-4 */
                    font-family: 'Source Serif 4', serif;
                    font-size: 22px; /* Based on text-[22px] */
                    font-weight: 500; /* Based on font-medium */
                    color: #E5E5E5; /* Based on text-[#E5E5E5] */
                    letter-spacing: normal;
                    opacity: 0;
                    transform: translateY(18px);
                    animation: fadeUp 0.9s ease forwards;
                    animation-delay: 0.5s;
                }

                .heroTitle {
                    margin: 0;
                    font-family: 'Source Serif 4', serif;
                    font-size: 56px; /* Based on text-[56px] */
                    line-height: 1.02; /* Based on leading-[1.02] */
                    letter-spacing: -0.03em; /* Based on tracking-[-0.03em] */
                    font-weight: 700; /* Based on font-bold */
                    color: #fff;
                    text-shadow: 
                        0 0 10px rgba(255,255,255,0.05),
                        0 0 40px rgba(255,255,255,0.04);
                    opacity: 0;
                    transform: translateY(42px);
                    animation: fadeUpTitle 1.05s cubic-bezier(.22,.9,.32,1) forwards;
                    animation-delay: 0.78s;
                }

                @media (max-width: 768px) {
                    .heroCopy {
                        width: min(340px, 88vw);
                        margin-left: 6vw;
                    }
                    .heroTitle {
                        font-size: clamp(48px, 12vw, 56px);
                    }
                }

                @keyframes fadeUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeUpTitle {
                    to {
                        opacity: 0.9;
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
            </div>
        </section>
    );
}
