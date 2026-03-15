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

        // Ensure video is paused so GSAP has total control
        video.pause();

        // BLOCK SCROLL initially
        document.body.style.overflow = "hidden";

        const ctx = gsap.context(() => {
            const introDuration = 4.5; // Seconds for the cinematic narrative
            const videoDuration = duration;

            // 1. MASTER INTRO TIMELINE (Frame-Locked Cinematic)
            const introTl = gsap.timeline({
                defaults: { ease: "none" }, // Linear for "normal playback" feel
                onComplete: () => { 
                    isIntroComplete = true; 
                    document.body.style.overflow = "auto";
                    ScrollTrigger.refresh();
                    setupPostIntroScroll();
                }
            });

            // Phase 1: Total Reveal & Video Start (Skull Phase)
            introTl.to(textContainerRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power2.out"
            })
            // Animate video currentTime linearly (looks like normal playback)
            .to(video, {
                currentTime: 1.5,
                duration: 1.5,
            }, "0") 
            .to(".phrase-1-inner", {
                clipPath: "inset(0% 0 0 0)",
                y: 0,
                letterSpacing: "0.45em",
                duration: 1.2,
                ease: "expo.out"
            }, "0.5")

            // Phase 2: The Morph (Automatic Transition)
            .to(video, {
                currentTime: 3.5,
                duration: 2.0,
            }, "1.5")
            .to(".phrase-1-inner", {
                opacity: 0,
                filter: "blur(12px)",
                y: -15,
                duration: 1.0,
            }, "1.8")
            .to(".phrase-2-inner", {
                clipPath: "inset(0% 0 0 0)",
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "expo.out"
            }, "2.5")

            // Phase 3: Final Detail (Button)
            .to(video, {
                currentTime: introDuration,
                duration: 1.0,
            }, "3.5")
            .to(".hero-btn-wrapper", {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "back.out(1.7)"
            }, "3.8");

            // Function to setup SCROLL-BASED logic AFTER intro
            function setupPostIntroScroll() {
                // Ensure video is at the right spot before handover
                const scrollStartVideoTime = introDuration;

                // Main Video Scrubbing (Continues from intro end)
                ScrollTrigger.create({
                    trigger: scrollDriver,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.5,
                    onUpdate: (self) => {
                        // Start scrubbing from where intro left off to end of video
                        const remaining = videoDuration - scrollStartVideoTime;
                        const targetTime = scrollStartVideoTime + (self.progress * remaining);
                        
                        gsap.to(video, {
                            currentTime: targetTime,
                            duration: 0.8,
                            ease: "power2.out",
                            overwrite: "auto"
                        });
                    }
                });

                // Narrative Exit: Fade out text as we scroll past 20%
                gsap.to(".hero-content", {
                    scrollTrigger: {
                        trigger: scrollDriver,
                        start: "10% top",
                        end: "40% top",
                        scrub: 1,
                    },
                    opacity: 0,
                    y: -100,
                    scale: 0.9,
                    ease: "power2.inOut"
                });

                // Mask Reveal / Wipe Animation synced with scroll
                gsap.to([".phrase-1-inner", ".phrase-2-inner"], {
                    scrollTrigger: {
                        trigger: scrollDriver,
                        start: "top top",
                        end: "30% top",
                        scrub: 1,
                    },
                    clipPath: "inset(0% 0 100% 0)",
                    filter: "blur(12px)",
                    y: -30,
                    stagger: 0.1,
                    ease: "power1.inOut"
                });



                // Atmospheric Zoom
                gsap.to(video, {
                    scrollTrigger: {
                        trigger: scrollDriver,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1.5,
                    },
                    scale: 1.08,
                    ease: "none"
                });
            }
        });

        return () => {
            ctx.revert();
            document.body.style.overflow = "auto";
        };
    }, [mounted, videoReady]);

    // Robust video detection (Hybrid)
    useEffect(() => {
        if (!mounted || !videoRef.current) return;
        
        const video = videoRef.current;
        const checkReady = () => {
            if (video.readyState >= 1) setVideoReady(true);
        };

        const timer = setInterval(checkReady, 500);
        const failsafe = setTimeout(() => {
            setVideoReady(true);
            clearInterval(timer);
        }, 3000);

        checkReady();
        return () => {
            clearInterval(timer);
            clearTimeout(failsafe);
        };
    }, [mounted]);

    const handleVideoEvent = () => setVideoReady(true);

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
                        opacity: 0;
                        transition: opacity 1.2s ease-out;
                    }

                    .video-bg-layer.ready {
                        opacity: 1;
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
                        object-position: 25% center;
                        display: block;
                        transform: scale(0.98);
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
                        position: relative;
                        margin-top: 4rem;
                        z-index: 30;
                        pointer-events: auto;
                        opacity: 0;
                        /* GSAP handles reveal */
                    }

                    @media (max-width: 1023px) {
                        .hero-btn-wrapper {
                            margin-top: 2rem;
                            opacity: 0;
                        }
                    }

                    @keyframes heroBtn-in {
                        from { opacity: 0; transform: translateY(24px); }
                        to   { opacity: 1; transform: translateY(0); }
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

                    .phrase-reveal-container {
                        overflow: hidden;
                        position: relative;
                    }

                    .phrase-inner {
                        clip-path: inset(100% 0 0 0);
                        transform: translateY(30px);
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
                    <div ref={textContainerRef} className="hero-content opacity-0">
                        <div className="phrase-1 phrase-reveal-container mb-4">
                            <h1 className="phrase-1-inner phrase-inner text-white/80 font-medium uppercase" style={{
                                fontFamily: 'var(--font-body), sans-serif',
                                fontSize: 'clamp(14px, 2vw, 18px)',
                                lineHeight: '1.0',
                                letterSpacing: '0.3em'
                            }}>
                                Sua origem
                            </h1>
                        </div>

                        <div className="phrase-2 phrase-reveal-container text-balance mb-12">
                            <h2 className="phrase-2-inner phrase-inner text-[#E6D3A3] font-bold tracking-tight" style={{
                                fontFamily: '"Playfair Display", serif',
                                fontSize: 'clamp(52px, 11vw, 102px)',
                                lineHeight: '0.95',
                                letterSpacing: '-0.02em'
                            }}>
                                Seu sorriso
                            </h2>
                        </div>

                        {/* Main CTA */}
                        <div className="hero-btn-wrapper opacity-0 translate-y-8">
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
