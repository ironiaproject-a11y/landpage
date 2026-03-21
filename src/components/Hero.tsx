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
            // Function to initialize scroll trigger once video metadata is ready
            const initScroll = () => {
                gsap.to(video, {
                    currentTime: video.duration || 5,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: "+=300vh",
                        scrub: 1.5,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true
                    }
                });
            };

            if (video.readyState >= 1) {
                initScroll();
            } else {
                video.onloadedmetadata = initScroll;
            }

            // Cinematic Intro Timeline
            const introTl = gsap.timeline({
                onStart: () => {
                    // Signal preloader to start exiting immediately as intro begins
                    window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
                    (window as any).__HERO_ASSETS_LOADED__ = true;
                },
                onComplete: () => {
                    ScrollTrigger.refresh();
                }
            });

            // Video and Overlay Fade-in
            introTl.fromTo([".hero-video", ".hero-overlay"],
                { opacity: 0 },
                { opacity: 1, duration: 2, ease: "power2.inOut" },
                0
            );

            // Line 1: Sua origem
            introTl.fromTo(".hero-pre", 
                { opacity: 0, y: 40, filter: "blur(4px)" },
                { 
                    opacity: 0.6, 
                    y: 0, 
                    filter: "blur(0px)",
                    duration: 1.2, 
                    ease: "power2.out" 
                },
                0.5
            );

            // Line 2: Seu sorriso
            introTl.fromTo(".hero-title", 
                { opacity: 0, y: 100, filter: "blur(12px)", scale: 0.9 },
                { 
                    opacity: 1, 
                    y: 0, 
                    filter: "blur(0px)",
                    scale: 1,
                    duration: 1.5, 
                    ease: "expo.out" 
                },
                0.8
            );
        });

        // Failsafe for preloader
        const failsafe = setTimeout(() => {
            if (!(window as any).__HERO_ASSETS_LOADED__) {
                window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
                (window as any).__HERO_ASSETS_LOADED__ = true;
            }
        }, 4000);

        return () => {
            ctx.revert();
            clearTimeout(failsafe);
        };
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
                    padding-left: 6vw;
                }

                /* VIDEO */
                .hero-video {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    filter: brightness(0.5) contrast(1.1);
                    z-index: 0;
                    pointer-events: none;
                    opacity: 0; /* Animated by GSAP */
                }

                /* DARK OVERLAY */
                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 1;
                    pointer-events: none;
                    opacity: 0; /* Animated by GSAP */
                }

                /* TEXT CONTAINER */
                .hero-content {
                    position: relative;
                    z-index: 2;
                    max-width: none;
                }

                /* SMALL TEXT */
                .hero-pre {
                    font-family: 'Source Serif 4', serif;
                    font-size: clamp(18px, 2vw, 28px);
                    font-weight: 400;
                    color: rgba(255,255,255,0.6);
                    margin-bottom: 60px;
                }

                /* MAIN TITLE */
                .hero-title {
                    font-family: 'Source Serif 4', serif;
                    font-size: clamp(90px, 13vw, 160px);
                    font-weight: 400;
                    line-height: 1.05;
                    letter-spacing: -0.03em;
                    color: #FFFFFF;
                }

                @media (max-width: 768px) {
                    .hero {
                        padding-left: 20px;
                    }
                }
            `}</style>

            <video 
                ref={videoRef}
                muted 
                playsInline 
                className="hero-video"
                preload="auto"
            >
                <source src="/hero-slit.mp4" type="video/mp4" />
            </video>

            <div className="hero-overlay"></div>

            <div className="hero-content">
                <p className="hero-pre">Sua origem</p>
                <h1 className="hero-title">Seu sorriso</h1>
            </div>
        </section>
    );
}
