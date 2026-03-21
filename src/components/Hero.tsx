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
            // Scroll Scrubbing Logic (keeping the cinematic scroll experience)
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

            // Pulse assets-loaded event for Preloader synchronization
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

                /* VIDEO */
                .hero-video {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: 25% center; /* Ajuste manual para alinhar atrás do texto */
                    filter: grayscale(100%) brightness(0.55) contrast(1.1);
                    z-index: 0;
                }

                /* OVERLAY INTELIGENTE (ESQUERDA MAIS ESCURA) */
                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        to right,
                        rgba(0,0,0,0.8) 0%,
                        rgba(0,0,0,0.6) 40%,
                        rgba(0,0,0,0.2) 70%,
                        rgba(0,0,0,0) 100%
                    );
                    z-index: 1;
                }

                /* TEXTO */
                .hero-content {
                    position: relative;
                    z-index: 2;
                    margin-left: 6vw;
                    max-width: 800px; /* Increased slightly for better fit */
                }

                /* FRASE MENOR */
                .hero-pre {
                    font-family: 'Source Serif 4', serif;
                    font-size: clamp(18px, 2vw, 28px);
                    color: rgba(255,255,255,0.65);
                    margin-bottom: 60px;
                    opacity: 0;
                    transform: translateY(30px);
                    animation: fadeUp 1s ease forwards;
                    animation-delay: 0.5s; /* Slight delay for preloader exit */
                }

                /* FRASE PRINCIPAL */
                .hero-title {
                    font-family: 'Source Serif 4', serif;
                    font-size: clamp(72px, 10vw, 140px);
                    line-height: 1.05;
                    letter-spacing: -0.03em;
                    color: #fff;
                    opacity: 0;
                    transform: translateY(80px) scale(0.95);
                    animation: fadeUpBig 1.2s ease forwards;
                    animation-delay: 0.8s;
                }

                @keyframes fadeUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeUpBig {
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @media (max-width: 768px) {
                    .hero-content { margin-left: 20px; }
                    .hero-title { font-size: clamp(50px, 12vw, 80px); }
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
