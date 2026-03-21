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
            // Force reset states
            gsap.set([pre, title], { opacity: 0, y: 30 });
            gsap.set(video, { currentTime: 0, opacity: 1 });

            const startAnimations = () => {
                const tl = gsap.timeline({
                    onComplete: () => initScroll()
                });

                // Tagline Entrance
                tl.to(pre, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power2.out"
                }, "+=0.4");

                // Video Intro (Simulated play via currentTime)
                tl.to(video, {
                    currentTime: 2.8,
                    duration: 4.5,
                    ease: "none"
                }, "-=0.2");

                // Tagline "Swept" Exit
                tl.to(pre, {
                    "--mask-p": "100%",
                    duration: 1.5,
                    ease: "power1.inOut"
                }, "-=3.0");

                tl.to(pre, {
                    opacity: 0,
                    duration: 0.5
                }, "-=1.5");

                // Title Reveal
                tl.to(title, {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    ease: "expo.out"
                }, "-=0.8");
            };

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

            // Better metadata handling
            if (video.readyState >= 1) {
                startAnimations();
            } else {
                video.onloadedmetadata = startAnimations;
            }

            // Fallback to avoid black screen/stuck state
            const fallback = setTimeout(() => {
                if (gsap.getProperty(pre, "opacity") === 0) {
                    startAnimations();
                }
            }, 3000);

            // Preloader interaction
            window.dispatchEvent(new CustomEvent("hero-assets-loaded"));

            return () => clearTimeout(fallback);
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
                    z-index: 1; /* Ensured it's above the black background */
                    display: block;
                }

                .heroCopy {
                    position: relative;
                    z-index: 10; /* Far above the video */
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
                    font-size: clamp(3.2rem, 11vw, 5.5rem);
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
                preload="metadata" /* Changed to metadata for quicker initial check */
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
