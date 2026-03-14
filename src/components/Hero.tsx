// Updated: 2026-03-14 - Video Scrubbing approach with perfect centering
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
    const scrollDriverRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !textContainerRef.current || !scrollDriverRef.current || !videoRef.current) return;

        const video = videoRef.current;

        const ctx = gsap.context(() => {
            // 1. Natural intro animation
            // We want to play the first bit naturally or just have it ready
            gsap.to(video, {
                currentTime: 1.5, // Initial reveal
                duration: 1.8,
                ease: "power2.out"
            });

            // 2. Scroll-scrub
            ScrollTrigger.create({
                trigger: scrollDriverRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5,
                onUpdate: (self) => {
                    const duration = video.duration || 1;
                    // Map scroll progress to video time
                    // We can adjust the multiplier if we want it to go faster/slower
                    const targetTime = self.progress * duration;
                    
                    gsap.to(video, {
                        currentTime: targetTime,
                        duration: 0.1,
                        ease: "none",
                        overwrite: true
                    });
                }
            });

            // 3. Text entrance animations
            const tl = gsap.timeline();
            tl.to(textContainerRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, 0.2);
            tl.fromTo(".phrase-1",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            0.4);
            tl.fromTo(".phrase-2",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            0.6);
        });

        return () => ctx.revert();
    }, [mounted]);

    return (
        <div ref={scrollDriverRef} style={{ height: "280dvh", position: "relative" }}>
            <section ref={sectionRef} className="hero relative overflow-hidden bg-black">
                <style>{`
                    .hero {
                        position: sticky;
                        top: 0;
                        width: 100vw;
                        height: 85vh;
                        background: #000;
                        margin-left: calc(-50vw + 50%);
                        margin-right: calc(-50vw + 50%);
                        padding: 0 !important;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                    }

                    @media (max-width: 767px) {
                        .hero {
                            width: 100vw;
                            height: 100vh;
                            height: 100dvh;
                            position: relative;
                            overflow: hidden;
                            margin: 0;
                            padding: 0 !important;
                        }
                    }

                    .video-bg-layer {
                        position: absolute;
                        inset: 0;
                        z-index: 0;
                        pointer-events: none;
                        background: #000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .hero-video-container {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .hero-video-container video {
                        min-width: 100%;
                        min-height: 100%;
                        width: auto;
                        height: auto;
                        object-fit: cover;
                        object-position: center;
                        display: block;
                    }

                    /* Darkness overlay directly on top of video */
                    .hero-video-overlay {
                        position: absolute;
                        inset: 0;
                        background: rgba(0, 0, 0, 0.35);
                        z-index: 1;
                    }

                    .hero-container {
                        position: absolute;
                        inset: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 10;
                        pointer-events: none;
                        display: flex;
                        flex-direction: column;
                    }

                    @media (min-width: 1024px) {
                        .hero-content {
                            position: absolute;
                            left: 15vw;
                            top: 25vh;
                            width: 55%;
                            max-width: 750px;
                            pointer-events: auto;
                            text-align: left;
                        }
                    }

                    @media (max-width: 1023px) {
                        .hero-content {
                            position: relative;
                            width: 100%;
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            padding: 0 8vw;
                            text-align: center;
                            pointer-events: auto;
                        }
                    }

                    .hero-btn-wrapper {
                        position: absolute;
                        bottom: 15vh;
                        left: 50%;
                        transform: translateX(-50%);
                        z-index: 30;
                        pointer-events: auto;
                        opacity: 0;
                        animation: heroBtn-in 1s cubic-bezier(0.22, 1, 0.36, 1) 1.5s forwards;
                    }

                    @media (max-width: 1023px) {
                        .hero-btn-wrapper {
                            position: relative;
                            bottom: auto;
                            left: auto;
                            transform: none;
                            margin-top: 2rem;
                            opacity: 1;
                            animation: none;
                        }
                    }

                    @keyframes heroBtn-in {
                        from { opacity: 0; transform: translateX(-50%) translateY(24px); }
                        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
                    }

                    .btn-premium-cta {
                        background: rgba(26, 26, 26, 0.45);
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        border: 1px solid rgba(230, 211, 163, 0.3);
                        color: #FFFFFF;
                        padding: 18px 56px;
                        border-radius: 100px;
                        font-size: 13px;
                        font-weight: 600;
                        letter-spacing: 0.25em;
                        text-transform: uppercase;
                        transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                        box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
                    }

                    .btn-premium-cta:hover {
                        background: rgba(230, 211, 163, 0.15);
                        border-color: rgba(230, 211, 163, 0.8);
                        box-shadow: 0 15px 50px -10px rgba(230, 211, 163, 0.25);
                        transform: translateY(-2px);
                        letter-spacing: 0.28em;
                    }
                `}</style>

                {/* Background Layer with Video */}
                <div className="video-bg-layer">
                    <div className="hero-video-container">
                        <video
                            ref={videoRef}
                            src="/hero-background-new.mp4"
                            muted
                            playsInline
                            preload="auto"
                        />
                        <div className="hero-video-overlay" />
                    </div>
                </div>

                <div className="hero-container">
                    <div ref={textContainerRef} className="hero-content opacity-0 translate-y-8">
                        <div className="phrase-1 mb-4">
                            <h1 className="text-white/60 font-medium tracking-[0.45em] uppercase" style={{
                                fontFamily: 'var(--font-body), sans-serif',
                                fontSize: 'clamp(14px, 2vw, 18px)',
                                lineHeight: '1.0'
                            }}>
                                Sua origem
                            </h1>
                        </div>

                        <div className="phrase-2 text-balance mb-12">
                            <h2 className="text-[#E6D3A3] font-bold tracking-tight" style={{
                                fontFamily: '"Playfair Display", serif',
                                fontSize: 'clamp(52px, 11vw, 102px)',
                                lineHeight: '0.95',
                                letterSpacing: '-0.02em'
                            }}>
                                Seu sorriso
                            </h2>
                        </div>

                        {/* Main CTA */}
                        <div className="hero-btn-wrapper">
                            <button className="btn-premium-cta">
                                AGENDAR EXPERIÊNCIA
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
