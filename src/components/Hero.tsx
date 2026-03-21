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
                    width: min(420px, 84vw);
                    margin-left: clamp(24px, 8vw, 96px);
                    transform: translateY(-4vh);
                }

                .heroPre {
                    margin: 0 0 1rem 0; /* Updated margin-bottom: 1rem */
                    font-family: 'Cinzel', serif;
                    font-weight: 400;
                    letter-spacing: 0.5em; /* Luxo extremo */
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.9rem;
                    opacity: 0;
                    transform: translateY(18px);
                    animation: fadeUp 0.9s ease forwards;
                    animation-delay: 0.5s;
                }

                .heroTitle {
                    margin: 0;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 900;
                    font-style: normal;
                    text-transform: uppercase;
                    color: #FFFFFF;
                    font-size: clamp(3rem, 8vw, 6rem); /* Responsividade */
                    line-height: 0.9;
                    letter-spacing: -0.02em;
                    filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.5));
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
                        font-size: clamp(2.5rem, 10vw, 4rem);
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
                        opacity: 1; /* Pure white for Montserrat 900 */
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
                <p className="heroPre">Sua origem</p>
                <h1 className="heroTitle">Seu sorriso</h1>
            </div>
        </section>
    );
}
