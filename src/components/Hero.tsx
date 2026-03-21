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
            // master timeline
            const tl = gsap.timeline({
                // Ensure ScrollTrigger only starts AFTER the intro
                onComplete: () => {
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

            // 2. Video Playing (Transition Skull -> Smile)
            // We'll animate it to a significant portion of its duration
            tl.to(video, {
                currentTime: 2.8, // Increased for a more complete transition
                duration: 4.5,    // Slower, more cinematic pace
                ease: "power1.inOut"
            }, "-=0.8");

            // 3. "Swept" (Varredura) Tagline Exit
            // Trigger this only when the video is deep into the transition
            tl.to(pre, {
                "--mask-p": "100%",
                duration: 1.8,
                ease: "power2.inOut"
            }, "-=3.0"); // Overlap with video playing

            tl.to(pre, {
                opacity: 0,
                duration: 0.6
            }, "-=1.2");

            // 4. Main Title Entrance (AFTER tagline is gone and woman is clear)
            tl.to(title, {
                opacity: 1,
                y: 0,
                duration: 1.8,
                ease: "expo.out"
            }, "-=0.4");

            // Scroll Scrubbing Function
            const initScroll = () => {
                if (!video.duration) return;
                
                // Allow user to scrub the ENTIRE video duration
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

            // Loading assets
            video.load();
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
