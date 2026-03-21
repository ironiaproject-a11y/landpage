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

            // preloader integration
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

                /* OVERLAY GLOBAL (REFRESHED GRADIENT) */
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

                /* CONTAINER (CONTROLLED LATERAL POSITIONING) */
                .hero-content {
                    position: relative;
                    z-index: 2;
                    margin-left: 8vw;
                    max-width: 420px;
                }

                /* TEXTO SECUNDÁRIO (CLOSER HIERARCHY) */
                .hero-pre {
                    font-family: 'Source Serif 4', serif;
                    font-size: 18px;
                    color: rgba(255,255,255,0.6);
                    margin-bottom: 20px;
                    opacity: 0;
                    transform: translateY(30px);
                    animation: intro 1s ease forwards;
                    animation-delay: 0.5s;
                }

                /* TEXTO PRINCIPAL (CLOSER HIERARCHY) */
                .hero-title {
                    font-family: 'Source Serif 4', serif;
                    font-size: clamp(48px, 6vw, 72px);
                    line-height: 1.1;
                    letter-spacing: -0.02em;
                    color: #fff;
                    opacity: 0;
                    transform: translateY(50px) scale(0.98); /* Less movement for subtler look */
                    animation: reveal 1.2s ease forwards;
                    animation-delay: 0.8s;
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
                    .hero-content { margin-left: 20px; max-width: 80%; }
                    .hero-title { font-size: clamp(38px, 10vw, 48px); }
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
