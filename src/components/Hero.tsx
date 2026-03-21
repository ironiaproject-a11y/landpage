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
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current || !videoRef.current || !overlayRef.current) return;

        const video = videoRef.current;
        const section = sectionRef.current;
        const overlay = overlayRef.current;

        const ctx = gsap.context(() => {
            // GSAP Scroll Scrubbing
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

            // Force load to ensure duration is available
            video.load();
            if (video.readyState >= 1) {
                initScroll();
            } else {
                video.onloadedmetadata = initScroll;
            }

            // Cinematic Entrance
            const introTl = gsap.timeline({
                onStart: () => {
                    // Signal preloader to start exiting immediately
                    window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
                    (window as any).__HERO_ASSETS_LOADED__ = true;
                },
                onComplete: () => {
                    ScrollTrigger.refresh();
                }
            });

            // Fade in video and overlay immediately
            introTl.to([video, overlay], {
                opacity: 1,
                duration: 1.5,
                ease: "power2.inOut"
            }, 0);

            // Cascade text
            introTl.fromTo(".hero-pre", 
                { opacity: 0, y: 30, filter: "blur(4px)" },
                { opacity: 0.6, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out" },
                0.4
            );

            introTl.fromTo(".hero-title", 
                { opacity: 0, y: 60, scale: 0.95, filter: "blur(10px)" },
                { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "expo.out" },
                0.7
            );
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
                    padding-left: 6vw;
                }

                .hero-video {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    filter: brightness(0.6) contrast(1.1);
                    z-index: 0;
                    pointer-events: none;
                    opacity: 0; /* Managed by GSAP */
                }

                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.6);
                    z-index: 1;
                    pointer-events: none;
                    opacity: 0; /* Managed by GSAP */
                }

                .hero-content {
                    position: relative;
                    z-index: 2;
                }

                .hero-pre {
                    font-family: 'Source Serif 4', serif;
                    font-size: clamp(18px, 2vw, 28px);
                    color: rgba(255,255,255,0.6);
                    margin-bottom: 60px;
                }

                .hero-title {
                    font-family: 'Source Serif 4', serif;
                    font-size: clamp(90px, 13vw, 160px);
                    color: #FFFFFF;
                    line-height: 1.05;
                    letter-spacing: -0.03em;
                }

                @media (max-width: 768px) {
                    .hero { padding-left: 20px; }
                }
            `}</style>

            {/* Robust Video Source */}
            <video 
                ref={videoRef}
                muted 
                playsInline 
                className="hero-video"
                poster="/hero-video.webp"
            >
                <source src="/hero-slit.mp4" type="video/mp4" />
                <source src="/luxury-hero/mp4_1080_variantA.mp4" type="video/mp4" />
            </video>

            <div ref={overlayRef} className="hero-overlay"></div>

            <div className="hero-content">
                <p className="hero-pre">Sua origem</p>
                <h1 className="hero-title">Seu sorriso</h1>
            </div>
        </section>
    );
}
