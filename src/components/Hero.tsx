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
    const [videoReady, setVideoReady] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);



    // Unified Master Intro & Scroll Logic
    useEffect(() => {
        if (!mounted || !videoReady || !videoRef.current || !textContainerRef.current || !scrollDriverRef.current) return;
        
        const video = videoRef.current;
        const duration = video.duration || 1;
        const scrollDriver = scrollDriverRef.current;
        let isIntroComplete = false;

        video.pause();
        document.body.style.overflow = "hidden";

        const ctx = gsap.context(() => {
            const introDuration = 5.0; // Seconds for the cinematic narrative
            const videoDuration = duration;

            // 1. MASTER INTRO TIMELINE (Frame-Locked Cinematic)
            const introTl = gsap.timeline({
                defaults: { ease: "power2.out" },
                onComplete: () => { 
                    isIntroComplete = true; 
                    document.body.style.overflow = "auto";
                    
                    setTimeout(() => {
                        setupPostIntroScroll();
                        ScrollTrigger.refresh();
                    }, 100);
                }
            });

            // Start Video immediately
            introTl.to(video, {
                currentTime: introDuration,
                duration: introDuration,
                ease: "none"
            }, 0);

            // Timeline timings as requested:
            // 1.5s → "Sua origem" fades in near the skull
            introTl.to(".phrase-1-wrapper", {
                opacity: 1,
                y: 0,
                duration: 1.2,
            }, 1.5);

            // 3.5s → "Seu sorriso" fades in near the woman's face
            introTl.to(".phrase-2-wrapper", {
                opacity: 1,
                y: 0,
                duration: 1.2,
            }, 3.5);

            // 4.5s → Button and Final Polish
            introTl.to(".hero-btn-wrapper", {
                opacity: 1,
                y: 0,
                duration: 1.0,
                ease: "back.out(1.7)"
            }, 4.2);

            // Function to setup SCROLL-BASED logic AFTER intro
            function setupPostIntroScroll() {
                const latestVideoDuration = video.duration || videoDuration;
                const totalScrollHeight = scrollDriver.offsetHeight - window.innerHeight;
                const targetScrollPos = (introDuration / latestVideoDuration) * totalScrollHeight;

                window.scrollTo({ top: targetScrollPos, behavior: "auto" });

                const masterScrollTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: scrollDriver,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 2.0,
                        invalidateOnRefresh: true,
                    }
                });

                masterScrollTl
                    .fromTo(video, 
                        { currentTime: 0 },
                        { 
                            currentTime: latestVideoDuration, 
                            duration: 1.0, 
                            ease: "none"
                        }, 0)
                    .fromTo(video,
                        { scale: 1 },
                        { 
                            scale: 1.15, 
                            duration: 1.0,
                            ease: "none"
                        }, 0)
                    .to([".phrase-1-wrapper", ".phrase-2-wrapper", ".hero-btn-wrapper"], {
                        opacity: 0,
                        y: -100,
                        stagger: 0.05,
                        duration: 0.4,
                        ease: "power2.inOut"
                    }, 0.2);
            }
        });

        return () => {
            ctx.revert();
            document.body.style.overflow = "auto";
        };
    }, [mounted, videoReady]);

    // Robust video detection
    useEffect(() => {
        if (!mounted || !videoRef.current) return;
        const video = videoRef.current;
        const checkReady = () => { if (video.readyState >= 1) setVideoReady(true); };
        const timer = setInterval(checkReady, 500);
        const failsafe = setTimeout(() => { setVideoReady(true); clearInterval(timer); }, 3000);
        checkReady();
        return () => { clearInterval(timer); clearTimeout(failsafe); };
    }, [mounted]);

    const handleVideoEvent = () => setVideoReady(true);

    return (
        <div ref={scrollDriverRef} style={{ height: "400dvh", position: "relative" }}>
            <section ref={sectionRef} className="hero relative overflow-hidden bg-black">
                <style>{`
                    .hero {
                        position: sticky;
                        top: 0;
                        width: 100vw;
                        height: 100vh;
                        height: 100dvh;
                        background: #000;
                        margin: 0;
                        padding: 0 !important;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                    }

                    .video-bg-layer {
                        position: absolute;
                        inset: 0;
                        z-index: 0;
                        opacity: 0;
                        transition: opacity 1.2s ease-out;
                    }

                    .video-bg-layer.ready { opacity: 1; }

                    .hero-video-container {
                        position: absolute;
                        inset: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .hero-video-container video {
                        min-width: 100%;
                        min-height: 100%;
                        object-fit: cover;
                        object-position: 25% center;
                    }

                    .hero-video-overlay {
                        position: absolute;
                        inset: 0;
                        background: rgba(0, 0, 0, 0.3);
                        z-index: 1;
                    }

                    .hero-container {
                        position: absolute;
                        inset: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 10;
                        pointer-events: none;
                    }

                    /* Cinematic Positioning */
                    .phrase-1-wrapper {
                        position: absolute;
                        left: 10vw;
                        top: 15vh;
                        opacity: 0;
                        transform: translateY(20px);
                        text-align: left;
                    }

                    .phrase-2-wrapper {
                        position: absolute;
                        left: 50%;
                        bottom: 20vh;
                        transform: translate(-50%, 20px);
                        opacity: 0;
                        text-align: center;
                        width: 100%;
                        max-width: 90vw;
                    }

                    .hero-btn-wrapper {
                        position: absolute;
                        left: 50%;
                        bottom: 10vh;
                        transform: translate(-50%, 20px);
                        opacity: 0;
                        pointer-events: auto;
                    }

                    .btn-premium-cta {
                        background: rgba(26, 26, 26, 0.45);
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        border: 1px solid rgba(230, 211, 163, 0.3);
                        color: #FFFFFF;
                        padding: 16px 48px;
                        border-radius: 100px;
                        font-size: 13px;
                        font-weight: 600;
                        letter-spacing: 0.25em;
                        text-transform: uppercase;
                        transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                    }

                    .btn-premium-cta:hover {
                        background: rgba(230, 211, 163, 0.15);
                        border-color: rgba(230, 211, 163, 0.8);
                        transform: translateY(-2px);
                    }

                    @media (max-width: 767px) {
                        .phrase-1-wrapper { left: 8vw; top: 18vh; }
                        .phrase-2-wrapper { bottom: 25vh; }
                        .hero-btn-wrapper { bottom: 12vh; }
                    }
                `}</style>

                {/* Background Layer with Video */}
                <div className={`video-bg-layer ${videoReady ? 'ready' : ''}`}>
                    <div className="hero-video-container">
                        <video
                            ref={videoRef}
                            src="/hero-background-new.mp4"
                            muted
                            playsInline
                            autoPlay
                            loop
                            preload="auto"
                            onLoadedMetadata={handleVideoEvent}
                            onCanPlay={handleVideoEvent}
                        />
                        <div className="hero-video-overlay" />
                    </div>
                </div>

                <div className="hero-container">
                    {/* Line 1: Near the skull (Upper-Left) */}
                    <div className="phrase-1-wrapper">
                        <h1 className="text-white/80 font-medium uppercase" style={{
                            fontFamily: 'var(--font-body), sans-serif',
                            fontSize: 'clamp(14px, 2vw, 18px)',
                            letterSpacing: '0.4em'
                        }}>
                            Sua origem
                        </h1>
                    </div>

                    {/* Line 2: Near the woman's face (Center-Lower) */}
                    <div className="phrase-2-wrapper">
                        <h2 className="text-[#E6D3A3] font-bold tracking-tight" style={{
                            fontFamily: '"Playfair Display", serif',
                            fontSize: 'clamp(42px, 9vw, 92px)',
                            lineHeight: '0.95'
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
            </section>
        </div>
    );
}

