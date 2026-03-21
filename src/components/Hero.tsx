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
                    object-position: center; 
                    filter: brightness(0.45) contrast(1.05) grayscale(100%);
                    z-index: 0;
                }

                .heroCopy {
                    position: relative;
                    z-index: 2;
                    width: min(600px, 90vw); /* Increased width for 5rem text */
                    margin-left: clamp(24px, 8vw, 96px);
                    transform: translateY(-4vh);
                }

                /* O Pré-título Elegante */
                .heroPre {
                    display: block;
                    margin: 0 0 1rem 0;
                    font-family: 'Cormorant Garamond', serif;
                    font-style: italic;
                    letter-spacing: 0.4em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 1rem;
                    opacity: 0;
                    transform: translateY(18px);
                    animation: fadeUp 0.9s ease forwards;
                    animation-delay: 0.5s;
                }

                /* O Título de Impacto */
                .heroTitle {
                    margin: 0;
                    font-family: 'Inter', sans-serif;
                    font-weight: 900; /* Extra Bold */
                    font-style: normal;
                    text-transform: uppercase;
                    font-size: 5rem;
                    line-height: 0.9;
                    color: #ffffff;
                    filter: drop-shadow(0 4px 15px rgba(0,0,0,0.3));
                    opacity: 0;
                    transform: translateY(42px);
                    animation: fadeUpTitle 1.05s cubic-bezier(.22,.9,.32,1) forwards;
                    animation-delay: 0.75s;
                }

                @media (max-width: 768px) {
                    .heroCopy {
                        width: min(340px, 88vw);
                        margin-left: 6vw;
                    }
                    .heroTitle {
                        font-size: clamp(3rem, 12vw, 4.5rem);
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

            <div className="heroCopy">
                <span className="heroPre">Sua origem</span>
                <h1 className="heroTitle">Seu sorriso</h1>
            </div>
        </section>
    );
}
