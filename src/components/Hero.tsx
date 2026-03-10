"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 144;

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const titleTopRef = useRef<HTMLHeadingElement>(null);
    const titleBottomRef = useRef<HTMLHeadingElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);
    const progressLineRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [introFinished, setIntroFinished] = useState(false);

    // Animation state
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const airbnbRef = useRef({ frame: 0 });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !canvasRef.current || !sectionRef.current || !containerRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        // Configuration
        const currentFrame = (index: number) =>
            `/assets/hero-premium-v2/frame_${index.toString().padStart(3, '0')}_delay-0.041s.webp`;

        const render = () => {
            const img = imagesRef.current[airbnbRef.current.frame];
            if (!img || !img.complete) return;

            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const imgWidth = img.width;
            const imgHeight = img.height;

            // Use 'contain' logic for mobile to ensure the entire skull is visible
            const isMobile = window.innerWidth <= 768;
            const ratio = isMobile
                ? Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight)
                : Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);

            const newWidth = imgWidth * ratio;
            const newHeight = imgHeight * ratio;

            // Center image within the canvas
            const x = (canvasWidth - newWidth) / 2;
            const y = (canvasHeight - newHeight) / 2;

            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.drawImage(img, x, y, newWidth, newHeight);
        };

        // Preload images
        const preloadImages = () => {
            let loadedCount = 0;
            for (let i = 0; i < FRAME_COUNT; i++) {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    if (i === 0) {
                        render();
                    }
                    if (loadedCount === FRAME_COUNT) {
                        // All images loaded
                        window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
                        startIntro();
                    }
                };
                img.src = currentFrame(i);
                imagesRef.current.push(img);
            }
        };

        const updateSize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            render();
        };

        window.addEventListener("resize", updateSize);
        updateSize();
        preloadImages();

        let introTimeline: gsap.core.Timeline | null = null;

        const startIntro = () => {
            introTimeline = gsap.timeline({
                onComplete: () => {
                    setIntroFinished(true);
                }
            });

            // "Cinematography" entrance: playing the video sequence
            introTimeline.to(airbnbRef.current, {
                frame: 30, // Intro plays first 30 frames
                duration: 1.5,
                snap: "frame",
                ease: "power2.out",
                onUpdate: render
            });

            // Animate text entry
            introTimeline.fromTo(titleTopRef.current,
                { opacity: 0, y: 30, filter: "blur(10px)" },
                { opacity: 0.8, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out" },
                "-=0.5"
            );
        };

        // GSAP Scroll Animation
        const ctx = gsap.context(() => {
            // Main scroll trigger for frame playback
            gsap.to(airbnbRef.current, {
                frame: FRAME_COUNT - 1,
                snap: "frame",
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=150%",
                    pin: true,
                    scrub: 0.5,
                    anticipatePin: 1
                },
                onUpdate: render,
            });

            // Immersive Zoom — ensures centering is maintained during scale
            if (window.innerWidth > 768) {
                gsap.set(canvasRef.current, { xPercent: -50, yPercent: -50 });
                gsap.to(canvasRef.current, {
                    scale: 1.08,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "+=150%",
                        scrub: true
                    }
                });
            }

            // Narrativa centrada: Opacidade e escala sutis
            gsap.fromTo([titleTopRef.current, titleBottomRef.current, ctaRef.current],
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.2,
                    duration: 1,
                    ease: "power3.out"
                }
            );

            gsap.to(progressLineRef.current, {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=150%",
                    scrub: true
                }
            });

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "10% top",
                onEnter: () => document.querySelector('.cta-primary')?.classList.add('is-sticky'),
                onLeaveBack: () => document.querySelector('.cta-primary')?.classList.remove('is-sticky')
            });
        }, sectionRef);

        return () => {
            ctx.revert();
            if (introTimeline) introTimeline.kill();
            window.removeEventListener("resize", updateSize);
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <>
            <style>{`
                /* ─────────────────────────────────────────
                   HERO — full-bleed video background layout
                ───────────────────────────────────────── */
                .hero {
                    position: relative;
                    width: 100%;
                    height: 75vh;
                    min-height: 500px;
                    background: #000;
                    overflow: hidden;
                    clip-path: inset(0);
                    margin: 0;
                    padding: 0;
                }

                /* Inner wrapper — clips the canvas so it can never 
                   bleed outside the hero, even when GSAP pins it */
                .hero-inner-container {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    contain: paint;
                    background: #000;
                }

                /* Canvas fills the entire hero as a background video */
                .hero-canvas {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 68vw;
                    height: 42vh;
                    transform: translate(-50%, -50%);
                    object-fit: cover;
                    z-index: 1;
                    pointer-events: none;
                }

                /* Dark overlay for text legibility and cinematic depth */
                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%),
                                linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%);
                    z-index: 2;
                    pointer-events: none;
                }

                /* Text layer — centered over the full-bleed canvas */
                .hero-text-layer {
                    position: absolute;
                    inset: 0;
                    z-index: 3;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 0 24px;
                    text-align: center;
                    pointer-events: none;
                }

                .hero-title-top {
                    font-size: 15px;
                    font-weight: 300;
                    line-height: 1.4;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: #FBFBFB;
                    opacity: 0.75;
                    margin: 0 0 16px;
                    text-shadow: 0 2px 12px rgba(0,0,0,0.5);
                }

                .hero-title-bottom {
                    font-size: clamp(38px, 6vw, 72px);
                    font-weight: 700;
                    line-height: 1.05;
                    letter-spacing: -0.03em;
                    color: #FBFBFB;
                    margin: 0 0 32px;
                    max-width: 720px;
                    text-shadow: 0 8px 32px rgba(0,0,0,0.7);
                }

                .hero-cta-layer {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                }

                /* CTA button */
                .cta-primary {
                    width: 100%;
                    max-width: 320px;
                    height: 52px;
                    background: linear-gradient(180deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.95) 100%);
                    color: #FBFBFB;
                    border-radius: 9999px;
                    font-weight: 500;
                    font-size: 13px;
                    letter-spacing: 1.4px;
                    text-transform: uppercase;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(255,255,255,0.15);
                    border-top: 1px solid rgba(255,255,255,0.3);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                    position: relative;
                    overflow: hidden;
                }

                .cta-primary::before {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%;
                    width: 50%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    transform: skewX(-20deg);
                    transition: all 0.6s ease;
                }
                .cta-primary:hover::before { left: 150%; }

                .cta-primary:hover {
                    background: linear-gradient(180deg, rgba(30,30,30,0.95) 0%, rgba(15,15,15,0.95) 100%);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.2);
                    border-color: rgba(255,255,255,0.25);
                    border-top-color: rgba(255,255,255,0.4);
                    transform: translateY(-2px);
                }
                .cta-primary:active {
                    transform: translateY(1px);
                    box-shadow: 0 2px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
                }

                .cta-primary.is-sticky {
                    position: fixed !important;
                    bottom: 24px;
                    left: 20px;
                    width: calc(100% - 40px);
                    max-width: none;
                    z-index: 9999;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1);
                }

                .cta-secondary-link {
                    display: inline-block;
                    font-size: 14px;
                    color: #FBFBFB;
                    opacity: 0.65;
                    margin-top: 20px;
                    text-decoration: none;
                    font-weight: 400;
                    pointer-events: auto;
                    letter-spacing: 0.05em;
                }

                /* Scroll indicator */
                .hero-scroll-indicator {
                    position: absolute;
                    bottom: 36px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    opacity: 0.5;
                    z-index: 5;
                    pointer-events: none;
                }
                .scroll-line {
                    width: 1px;
                    height: 50px;
                    background: linear-gradient(to bottom, rgba(255,255,255,0.6), transparent);
                    animation: scrollPulse 2s ease-in-out infinite;
                }
                @keyframes scrollPulse {
                    0%, 100% { opacity: 0.4; transform: scaleY(1); }
                    50% { opacity: 1; transform: scaleY(1.15); }
                }

                /* Side progress bar */
                .hero-progress-container {
                    position: absolute;
                    right: 32px;
                    top: 50%;
                    transform: translateY(-50%);
                    height: 180px;
                    width: 1px;
                    background: rgba(255,255,255,0.08);
                    z-index: 5;
                }
                .hero-progress-fill {
                    width: 100%;
                    height: 100%;
                    background: rgba(255,255,255,0.7);
                    transform-origin: top;
                    transform: scaleY(0);
                }

                /* ── Responsive ─────────────────────────── */
                @media (max-width: 1024px) {
                    .hero { height: 72vh; }
                }

                @media (max-width: 768px) {
                    .hero { height: 92vh; min-height: 480px; overflow: hidden; max-width: 100%; }
                    .hero-video-wrapper {
                        width: 100vw;
                        height: 50vh;
                        margin: 18px auto 0;
                        overflow: hidden;
                        position: relative;
                        top: 0;
                        left: 0;
                        transform: none;
                        z-index: 1;
                    }
                    .hero-canvas { 
                        width: 100% !important;
                        height: 100% !important;
                        position: relative !important;
                        top: 0 !important;
                        left: 0 !important;
                        transform: none !important;
                        object-fit: contain;
                        opacity: 1;
                    }
                    .hero-title-top { font-size: 11px; letter-spacing: 0.18em; margin-bottom: 8px; }
                    .hero-title-bottom { font-size: clamp(32px, 8vw, 44px); margin-bottom: 0px; }
                    .hero-text-layer { 
                        padding: 8vh 24px 0; 
                        justify-content: flex-start;
                        position: relative;
                        height: 100%;
                    }
                    .hero-cta-layer { gap: 16px; margin-top: 18px; position: relative; z-index: 2; }
                    .hero-progress-container { right: 12px; height: 100px; }
                    .hero-scroll-indicator { bottom: 20px; opacity: 0.2; }
                }
            `}</style>

            <section ref={sectionRef} className="hero">
                <div ref={containerRef} className="hero-inner-container">
                    <div className="hero-overlay" />

                    <div className="hero-text-layer">
                        <h2 ref={titleTopRef} className="hero-title-top">Transforme seu sorriso</h2>
                        <h1 ref={titleBottomRef} className="hero-title-bottom">Transforme sua vida</h1>

                        <div className="hero-video-wrapper">
                            <canvas
                                ref={canvasRef}
                                className="hero-canvas"
                            />
                        </div>

                        <div className="hero-cta-layer">
                            <div ref={ctaRef} style={{ pointerEvents: 'auto' }}>
                                <button className="cta-primary">
                                    Agendar Consulta
                                </button>
                                <div className="text-center">
                                    <a href="#results" className="cta-secondary-link">
                                        ver galeria de resultados →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div ref={scrollIndicatorRef} className="hero-scroll-indicator">
                        <div className="scroll-line" />
                    </div>

                    <div className="hero-progress-container">
                        <div ref={progressLineRef} className="hero-progress-fill" />
                    </div>
                </div>
            </section>
        </>
    );
}
