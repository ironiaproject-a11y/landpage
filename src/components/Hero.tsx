// Updated: 2026-03-10 - Premium Overlapping Narrative v2
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

const FRAME_COUNT = 144;

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);
    const progressLineRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [introFinished, setIntroFinished] = useState(false);

    // Animation state
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const airbnbRef = useRef({ frame: 0 });
    const layoutRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

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

            const { x, y, width, height } = layoutRef.current;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, x, y, width, height);
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
            // Cap DPR at 2 for performance on high-res screens while keeping "Retina" quality
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            // Pre-calculate layout once during resize to save GPU/CPU cycles in render()
            const img = imagesRef.current[0] || new Image();
            const imgWidth = img.width || 1920;
            const imgHeight = img.height || 1080;

            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "medium"; // Balanced for performance

            const isMobile = window.innerWidth <= 768;
            const ratio = isMobile
                ? Math.min(canvas.width / imgWidth, canvas.height / imgHeight)
                : Math.max(canvas.width / imgWidth, canvas.height / imgHeight);

            const newWidth = imgWidth * ratio;
            const newHeight = imgHeight * ratio;

            layoutRef.current = {
                width: newWidth,
                height: newHeight,
                x: (canvas.width - newWidth) / 2,
                y: (canvas.height - newHeight) / 2
            };

            render();
        };

        window.addEventListener("resize", updateSize);
        updateSize();
        preloadImages();

        let autoScrollTween: gsap.core.Tween | null = null;

        const stopAutoPlay = () => {
            if (autoScrollTween) {
                autoScrollTween.kill();
                autoScrollTween = null;
            }
        };

        const startIntro = () => {
            const isPreloaderActive = (window as any).__PRELOADER_ACTIVE__;

            console.log("[Hero] startIntro called. Preloader active:", isPreloaderActive);

            // Force scroll reset to top as soon as we start the intro process
            window.scrollTo(0, 0);

            if (isPreloaderActive) {
                // Listen to 'exiting' instead of 'finished' to start animation WHILE preloader is fading out
                const onPreloaderExiting = () => {
                    console.log("[Hero] preloader-exiting event received. Adding 600ms perception delay.");
                    // Add 600ms so humans can see the "before" state first
                    setTimeout(() => {
                        executeIntro();
                    }, 600);
                    window.removeEventListener("preloader-exiting", onPreloaderExiting);
                };
                window.addEventListener("preloader-exiting", onPreloaderExiting);
            } else {
                console.log("[Hero] Preloader not active, starting intro directly");
                executeIntro();
            }
        };

        const executeIntro = () => {
            // Re-render frame 0 to be absolutely sure we start from clean state
            airbnbRef.current.frame = 0;
            render();

            const scrollDistance = window.innerHeight * 1.5;
            const lenis = (window as any).__LENIS__;

            console.log("[Hero] executeIntro. Scroll distance:", scrollDistance, "Lenis available:", !!lenis);

            // Interaction listeners to stop auto-play
            const interactions = ['mousedown', 'wheel', 'touchstart', 'keydown'];
            let introStopped = false;

            const onInteraction = () => {
                if (introStopped) return;
                console.log("[Hero] User interaction detected. Stopping auto-play.");
                introStopped = true;
                stopAutoPlay();
                interactions.forEach(event => window.removeEventListener(event, onInteraction));
            };
            interactions.forEach(event => window.addEventListener(event, onInteraction, { passive: true }));

            if (lenis) {
                // Snappier but perception-friendly duration (3.8s)
                lenis.scrollTo(scrollDistance, {
                    duration: 3.8,
                    easing: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t, // Smooth power2 easing back for stability
                    onComplete: () => {
                        if (!introStopped) {
                            console.log("[Hero] Lenis auto-play completed");
                            setIntroFinished(true);
                            interactions.forEach(event => window.removeEventListener(event, onInteraction));
                        }
                    }
                });

                // We still store a "fake" tween to allow stopAutoPlay to work via lenis.stop() if needed,
                // but Lenis's scrollTo is self-contained.
                // To stop it, we'll just tell lenis to stop.
                autoScrollTween = {
                    kill: () => lenis.stop(),
                } as any;
                lenis.start(); // Ensure it's running
            } else {
                // Fallback to GSAP
                autoScrollTween = gsap.to(window, {
                    scrollTo: { y: scrollDistance },
                    duration: 3.8,
                    ease: "power2.inOut",
                    onComplete: () => {
                        if (!introStopped) {
                            console.log("[Hero] GSAP auto-play completed");
                            setIntroFinished(true);
                            interactions.forEach(event => window.removeEventListener(event, onInteraction));
                        }
                    },
                    onOverwrite: stopAutoPlay
                });
            }

            // Final CTA Reveal - Triggered toward the end of the auto-play
            gsap.delayedCall(3.2, () => {
                if (!introStopped) {
                    gsap.fromTo(ctaRef.current,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
                    );
                }
            });
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

            // Progress Line Animation
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
                    height: 90vh; /* Increased for immersion */
                    min-height: 600px;
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
                    width: 75vw; /* Slightly larger for immersion */
                    height: 55vh;
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
                    justify-content: flex-end; /* Push CTA to bottom */
                    padding: 0 24px 80px; /* Space for the button */
                    text-align: center;
                    pointer-events: none;
                }

                .hero-cta-layer {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                    margin-top: 24px;
                    z-index: 10;
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
                    .hero { height: 95vh; min-height: 500px; }
                    .hero-video-wrapper {
                        width: 100vw;
                        height: 85vh; /* Increased from 70vh for 15% expansion */
                        margin: 0 auto;
                        position: relative;
                        top: -15vh; /* Pulled up 15% (from -5vh) for more immersion */
                        z-index: 1;
                    }
                    .hero-canvas { 
                        width: 100% !important;
                        height: 100% !important;
                        object-fit: contain;
                    }
                    .hero-text-layer { 
                        padding: 0 24px 60px; 
                        justify-content: flex-end;
                        position: absolute;
                        height: 100%;
                    }
                    .hero-cta-layer { 
                        margin-top: 0; 
                        z-index: 10; 
                    }
                    .hero-progress-container { right: 12px; height: 100px; }
                    .hero-scroll-indicator { bottom: 20px; opacity: 0.2; }
                }
            `}</style>

            <section ref={sectionRef} className="hero">
                <div ref={containerRef} className="hero-inner-container">
                    <div className="hero-overlay" />

                    <div className="hero-text-layer">
                        <div className="hero-video-wrapper">
                            <canvas
                                ref={canvasRef}
                                className="hero-canvas"
                            />
                        </div>

                        <div className="hero-cta-layer">
                            <div ref={ctaRef} style={{ pointerEvents: 'auto', opacity: 0 }}>
                                <button className="cta-primary">
                                    Agendar Consulta
                                </button>
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
