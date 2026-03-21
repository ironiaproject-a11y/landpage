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
            // Master Timeline for the Intro
            const intro = gsap.timeline({
                onComplete: () => {
                    // Initialize ScrollTrigger after intro
                    initScroll();
                }
            });

            // Set initial states
            gsap.set(pre, { opacity: 0, y: 20 });
            gsap.set(title, { opacity: 0, y: 40 });
            gsap.set(video, { currentTime: 0 });

            // 1. Initial Fade In of Tagline
            intro.to(pre, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power2.out"
            }, "+=0.5");

            // 2. Play Video transition (Skull to Smile)
            // We animate currentTime because it's easier to sync with GSAP
            intro.to(video, {
                currentTime: 1.8, // Assuming 1.8s is the transition point
                duration: 2.5,
                ease: "none"
            }, "-=0.3");

            // 3. "Swept" (Varredura) effect for the tagline
            // Using a mask-image gradient sweep
            intro.to(pre, {
                "--mask-p": "100%",
                duration: 1.2,
                ease: "power2.inOut"
            }, "-=1.5");

            intro.to(pre, {
                opacity: 0,
                duration: 0.4
            }, "-=0.2");

            // 4. "Inverse" Reveal of the Main Title
            intro.to(title, {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: "expo.out"
            }, "-=0.5");

            // Scroll Scrubbing Function
            const initScroll = () => {
                if (!video.duration) return;
                
                // We create a ScrollTrigger that takes over the video
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
            // Preloader sync
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

                /* Para o "SUA ORIGEM" */
                .heroPre {
                    display: block;
                    margin: 0 0 1rem 0;
                    font-family: 'Playfair Display', serif;
                    font-style: italic;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.7);
                    
                    /* Efeito de Varredura (Mask) */
                    --mask-p: 0%;
                    mask-image: linear-gradient(to right, transparent var(--mask-p), black calc(var(--mask-p) + 20%));
                    -webkit-mask-image: linear-gradient(to right, transparent var(--mask-p), black calc(var(--mask-p) + 20%));
                }

                /* Para o "SEU SORRISO" */
                .heroTitle {
                    margin: 0;
                    font-family: 'Inter', sans-serif;
                    font-weight: 900;
                    font-style: normal;
                    text-transform: uppercase;
                    color: #ffffff;
                    font-size: 5rem;
                    line-height: 1;
                    filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5));
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
