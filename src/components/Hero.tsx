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

                /* VIDEO */
                .hero-video {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: 15% center;
                    /* Applying grayscale filter for premium B&W cinematic look */
                    filter: grayscale(100%) brightness(0.5) contrast(1.05);
                    z-index: 0;
                }

                /* OVERLAY GLOBAL SUAVE */
                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 1;
                }

                /* CONTAINER */
                .hero-content {
                    position: relative;
                    z-index: 2;
                    margin-left: 6vw;
                }



                /* TEXTO SECUNDÁRIO */
                .hero-pre {
                    font-family: 'Source Serif 4', serif;
                    font-size: clamp(18px, 2vw, 28px);
                    color: rgba(255,255,255,0.65);
                    margin-bottom: 70px;
                    opacity: 0;
                    transform: translateY(30px);
                    animation: intro 1s ease forwards;
                    animation-delay: 0.4s; /* Sync with preloader exit */
                }

                /* TEXTO PRINCIPAL */
                .hero-title {
                    font-family: 'Source Serif 4', serif;
                    font-size: clamp(90px, 12vw, 160px);
                    line-height: 1.05;
                    letter-spacing: -0.03em;
                    color: #fff;
                    opacity: 0;
                    transform: translateY(100px) scale(0.9);
                    animation: reveal 1.2s ease forwards;
                    animation-delay: 0.8s;
                    text-shadow: 0 0 40px rgba(255,255,255,0.1);
                }

                /* ANIMAÇÕES */
                @keyframes intro {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes reveal {
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @media (max-width: 768px) {
                    .hero-content { margin-left: 20px; }
                    .hero-content::before { inset: -40px; }
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
