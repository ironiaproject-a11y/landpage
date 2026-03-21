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
    const preRef = useRef<HTMLParagraphElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (!sectionRef.current || !videoRef.current || !preRef.current || !titleRef.current) return;

        const video = videoRef.current;
        const section = sectionRef.current;
        const pre = preRef.current;
        const title = titleRef.current;

        const ctx = gsap.context(() => {
            const initIntro = () => {
                const duration = video.duration || 5; // Fallback to 5s if unknown
                const transitionEnd = duration * 0.8; // Target 80% of video for intro

                const tl = gsap.timeline({
                    onComplete: () => {
                        // After intro, we init scroll scrubbing
                        initScroll();
                    }
                });

                // Initial states
                gsap.set(pre, { opacity: 0, y: 20 });
                gsap.set(title, { opacity: 0, y: 40 });
                gsap.set(video, { currentTime: 0 });

                // 1. Tagline Entrance
                tl.to(pre, {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    ease: "power3.out"
                }, "+=0.3");

                // 2. Video Playing (Full Transition)
                // We use video.duration to go all the way
                tl.to(video, {
                    currentTime: transitionEnd,
                    duration: 5, // Slower, stable duration
                    ease: "none" // Linear for better sync
                }, "-=1.0");

                // 3. "Swept" Tagline Exit
                // Triggered later in the video playback
                tl.to(pre, {
                    "--mask-p": "100%",
                    duration: 1.5,
                    ease: "power2.inOut"
                }, "-=2.5");

                tl.to(pre, {
                    opacity: 0,
                    duration: 0.5
                }, "-=1.2");

                // 4. Main Title Entrance (Woman is fully visible)
                tl.to(title, {
                    opacity: 1,
                    y: 0,
                    duration: 1.8,
                    ease: "expo.out"
                }, "-=0.2");
            };

            const initScroll = () => {
                if (!video.duration) return;
                
                // Scrubbing the entire video
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

            // Ensure video metadata is loaded before starting the timeline
            if (video.readyState >= 1) {
                initIntro();
            } else {
                video.onloadedmetadata = initIntro;
            }

            // Fallback if metadata takes too long
            const timer = setTimeout(() => {
                if (!video.duration) initIntro();
            }, 2000);

            // Preloader sync
            window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
            
            return () => clearTimeout(timer);
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
                    width: min(600px, 90vw);
                    margin-left: clamp(24px, 8vw, 96px);
                    transform: translateY(-4vh);
                }

                .heroPre {
                    display: block;
                    margin: 0 0 1rem 0;
                    font-family: 'Playfair Display', serif;
                    font-style: italic;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    font-size: clamp(0.9rem, 1.5vw, 1.1rem);
                    color: rgba(255, 255, 255, 0.7);
                    
                    /* Efeito de Varredura (Mask) */
                    --mask-p: 0%;
                    mask-image: linear-gradient(to right, transparent var(--mask-p), black calc(var(--mask-p) + 20%));
                    -webkit-mask-image: linear-gradient(to right, transparent var(--mask-p), black calc(var(--mask-p) + 20%));
                }

                .heroTitle {
                    margin: 0;
                    font-family: 'Inter', sans-serif;
                    font-weight: 900;
                    font-style: normal;
                    text-transform: uppercase;
                    color: #ffffff;
                    font-size: clamp(3rem, 10vw, 5.5rem);
                    line-height: 1;
                    filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5));
                }

                @media (max-width: 768px) {
                    .heroCopy {
                        width: min(340px, 88vw);
                        margin-left: 6vw;
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
                <span ref={preRef} className="heroPre">Sua origem</span>
                <h1 ref={titleRef} className="heroTitle">Seu sorriso</h1>
            </div>
        </section>
    );
}
