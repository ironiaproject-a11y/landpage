// Updated: 2026-03-15 - Canvas Image Sequence with Refined Layout
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [imagesReady, setImagesReady] = useState(false);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const sequenceRef = useRef({ frame: 0 });
    const mouseRef = useRef({ x: 0, y: 0 });
    
    // Config
    const frameCount = 145;
    const introFrames = 70; // Half-way roughly for the intro

    useEffect(() => {
        setMounted(true);
        
        // Preload Image Sequence
        let loadedCount = 0;
        const loadImages = () => {
            for (let i = 0; i < frameCount; i++) {
                const img = new Image();
                img.src = `/hero-frames/frame_${i.toString().padStart(3, '0')}_delay-0.041s.png`;
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === frameCount) {
                        setImagesReady(true);
                        // Signal preloader to exit
                        window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
                        (window as any).__HERO_ASSETS_LOADED__ = true;
                    }
                };
                imagesRef.current[i] = img;
            }
        };
        loadImages();
    }, []);

    const drawParamsRef = useRef({ drawW: 0, drawH: 0, drawX: 0, drawY: 0 });

    const updateDimensions = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;

        const img = imagesRef.current[0] || new Image();
        if (!img.width) return;

        const imgRatio = img.width / img.height;
        const canvasRatio = w / h;

        let drawW, drawH, drawX, drawY;
        if (canvasRatio > imgRatio) {
            drawW = w;
            drawH = w / imgRatio;
            drawX = 0;
            drawY = (h - drawH) / 2;
        } else {
            drawW = h * imgRatio;
            drawH = h;
            drawX = (w - drawW) / 2;
            drawY = 0;
        }

        const scaleFactor = 1.02; 
        const finalW = drawW * scaleFactor;
        const finalH = drawH * scaleFactor;
        
        // Shift video significantly to the right to frame the transformation
        // directly behind the 'u' in 'Seu sorriso' (approx 22% shift)
        const lateralShift = w * 0.22; 
        const centerX = ((w - finalW) / 2) + lateralShift;
        const centerY = (h - finalH) / 2;

        drawParamsRef.current = { 
            drawW: finalW, 
            drawH: finalH, 
            drawX: centerX, 
            drawY: centerY 
        };
    };

    const render = (frame: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const img = imagesRef.current[frame];
        if (!canvas || !ctx || !img) return;

        const { drawW, drawH, drawX, drawY } = drawParamsRef.current;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
    };

    // Master Animation Logic
    useEffect(() => {
        if (!mounted || !canvasRef.current || !sectionRef.current) return;

        const sequence = sequenceRef.current;
        const ctx = gsap.context(() => {
            // 1. IMMEDIATE PINNING (For Layout Stability)
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: "+=500vh", // Extended scroll distance for heavy, deliberate control
                pin: true,
                pinSpacing: true,
                invalidateOnRefresh: true
            });

            // 2. SCRUB TIMELINE (Created immediately)
            const scrubTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                start: "top top",
                end: "+=500vh", // Match the extended pinning length
                scrub: 2.5, // Increased inertia so the user feels the "weight" and control over the video
                    invalidateOnRefresh: true,
                    onLeave: () => {
                        gsap.set(sequence, { frame: frameCount - 1 });
                        if (imagesReady) render(frameCount - 1);
                    }
                }
            });

            // Video Frame Scrubbing (Reverse order over scroll: 143 -> 0)
            scrubTl.fromTo(sequence, 
                { frame: frameCount - 1 }, 
                {
                    frame: 0,
                    onUpdate: () => {
                        if (imagesReady) render(Math.round(sequence.frame));
                    },
                    ease: "none",
                    duration: 10
                }, 
                0
            );

            // 3. MASTER INTRO TIMELINE (Cinematic Animation Timeline)
            const introTl = gsap.timeline({
                onComplete: () => {
                    // Enable scrubbed text transitions ONLY AFTER intro is complete
                    setupScrubbedAnimations(scrubTl);
                    const lenis = (window as any).lenis;
                    if (lenis) lenis.start();
                    ScrollTrigger.refresh();
                }
            });

            // Video Intro (runs only if imagesReady, but we define it now)
            if (imagesReady) {
                introTl.fromTo(sequence, 
                    { frame: 0 },
                    {
                        frame: frameCount - 1,
                        duration: 6,
                        ease: "none",
                        onUpdate: () => render(Math.round(sequence.frame))
                    }, 
                    0
                );
                
                introTl.to([".canvas-container", ".hero"], {
                    opacity: 1,
                    duration: 1.0,
                    ease: "power2.inOut"
                }, 0);

                introTl.to(".canvas-container", {
                    scale: 1.05,
                    duration: 6,
                    ease: "power1.inOut"
                }, 0);
            }

            // --- CINEMATIC TEXT ANIMATIONS (Run regardless of video loading) ---

            // 0.0s - show text "Sua origem" (Immediate Presence)
            introTl.fromTo(".hero-line-1", 
                { opacity: 0, y: 15, scale: 0.95 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    duration: 0.6, 
                    ease: "expo.out" 
                },
                0
            );

            // 3.0s - hide "Sua origem"
            introTl.to(".hero-line-1", {
                opacity: 0,
                y: -10,
                duration: 0.8,
                ease: "power2.in"
            }, 3.0);

            // 3.3s - show text "Seu sorriso" (Elegant reveal)
            introTl.fromTo(".hero-line-2",
                { opacity: 0, y: 5, scale: 1.02, filter: "blur(10px)", letterSpacing: "0.1em" },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    filter: "blur(0px)",
                    letterSpacing: "-0.03em",
                    duration: 2.7, 
                    ease: "expo.out" 
                },
                3.3
            );

            function setupScrubbedAnimations(tl: gsap.core.Timeline) {
                // At the start of the scroll (T=0), we are at the end of the intro.
                // Video is Woman (143). "Seu sorriso" is fully visible.
                tl.set(".hero-line-2", { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", letterSpacing: "-0.03em" }, 0);
                tl.set(".hero-line-1", { opacity: 0, y: -10, scale: 1 }, 0); 

                // T=0.5 -> 3.5: User scrolls down, "Seu sorriso" dissolves (backwards)
                tl.to(".hero-line-2", 
                    { opacity: 0, y: 10, scale: 1.02, filter: "blur(10px)", letterSpacing: "0.1em", duration: 3, ease: "power2.in" },
                    0.5
                );

                // T=4.0 -> 7.0: User continues scrolling, video becomes Skull, "Sua origem" materializes
                tl.fromTo(".hero-line-1", 
                    { opacity: 0, y: 15, scale: 0.95 },   // starts pushed down slightly
                    { opacity: 1, y: 0, scale: 1, duration: 3, ease: "expo.out", immediateRender: false },
                    4.0
                );

                // T=8.0 -> 10.0: The entire Hero section fades out to reveal the next part of the site
                tl.to(".hero-container", { y: -80, opacity: 0, duration: 2 }, 8.0); 
                tl.to(".canvas-container", { opacity: 0, duration: 2 }, 8.0); 
                tl.to(".scroll-indicator-wrapper", { opacity: 0, duration: 1 }, 1.0); // Indicator fades early on
            }

            // Tilt interaction
            const handleMouseMove = (e: MouseEvent) => {
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
                const { clientX, clientY } = e;
                const { innerWidth, innerHeight } = window;
                const xPct = (clientX / innerWidth - 0.5) * 2;
                const yPct = (clientY / innerHeight - 0.5) * 2;
                mouseRef.current = { x: xPct, y: yPct };
                gsap.to(".canvas-container", { rotateY: xPct * 4, rotateX: -yPct * 4, x: xPct * 15, y: yPct * 15, duration: 1.2, ease: "power2.out", overwrite: "auto" });
                gsap.to(".hero-bloom", { x: xPct * 50, y: yPct * 50, opacity: 0.4 + (Math.abs(xPct) * 0.2), duration: 1.5, ease: "power2.out" });
            };
            window.addEventListener("mousemove", handleMouseMove);
        });

        if (imagesReady) {
            updateDimensions();
            render(0);
        }

        return () => {
            ctx.revert();
            const lenis = (window as any).lenis;
            if (lenis) lenis.start();
        };
    }, [mounted, imagesReady]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            updateDimensions();
            render(Math.round(sequenceRef.current.frame)); 
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [imagesReady]);

    return (
            <section ref={sectionRef} className="hero relative overflow-hidden bg-[#000000]">
                <style>{`
                    .hero {
                    position: relative;
                    width: 100vw;
                    height: 100vh;
                    background: var(--color-bg-dark);
                    margin: 0;
                    padding: 0 !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    z-index: 1;
                }

                    .canvas-container {
                        position: absolute;
                        inset: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 0;
                        opacity: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        transform: scale(1.02);
                        perspective: 1000px;
                        transform-style: preserve-3d;
                    }

                    .canvas-container.ready {
                        opacity: 1;
                    }

                    .hero-canvas {
                        width: 100% !important;
                        height: 100% !important;
                        object-fit: cover;
                        filter: brightness(1.1) contrast(1.05);
                    }

                    /* Atmospheric Bloom layer */
                    .hero-bloom {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 100vw;
                        height: 100vh;
                        background: radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, transparent 60%);
                        transform: translate(-50%, -50%);
                        z-index: 1;
                        pointer-events: none;
                        filter: blur(120px);
                        opacity: 0.3;
                    }

                    /* Multi-layered sophisticated vignette */
                    .hero-overlay {
                        position: absolute;
                        inset: 0;
                        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.50) 100%);
                        z-index: 2;
                        pointer-events: none;
                    }

                    @media (max-width: 768px) {
                        .hero-overlay {
                            background: rgba(0,0,0,0.60);
                        }
                    }

                    .hero-container {
                        position: absolute;
                        inset: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 10;
                        pointer-events: none;
                        perspective: 1200px;
                        transform-style: preserve-3d;
                    }

                    .hero-text {
                        position: absolute;
                        inset: 0;
                        z-index: 5;
                        pointer-events: none;
                        width: 100%;
                        height: 100%;
                    }

                    .hero-line-1 {
                        position: absolute;
                        top: 30%;
                        left: 5%;
                        max-width: 550px;
                        transform: translateY(-50%);
                        text-align: left;
                        opacity: 0;
                        z-index: 10;
                    }

                    .hero-line-1 h1 {
                        font-family: var(--font-headline);
                        font-size: var(--font-h1);
                        font-weight: var(--font-h1-weight);
                        line-height: var(--font-h1-line-height);
                        letter-spacing: var(--font-h1-tracking);
                        color: var(--color-text-primary);
                        margin: 0;
                        padding: 0;
                        text-transform: uppercase;
                        filter: drop-shadow(0 12px 30px rgba(0,0,0,0.7));
                    }

                    .hero-line-1::before,
                    .hero-line-1::after {
                        display: none;
                    }

                    .hero-line-2 {
                        position: absolute;
                        top: 45%;
                        left: 5%;
                        transform: translateY(-50%);
                        text-align: left;
                        opacity: 0;
                        z-index: 10;
                        max-width: 550px;
                    }

                    .hero-line-2 h2 {
                        font-family: var(--font-headline);
                        font-size: clamp(20px, 4vw, 32px);
                        font-weight: 300;
                        line-height: 1.2;
                        letter-spacing: 0.05em;
                        color: rgba(255,255,255,0.80);
                        margin: 0;
                        padding: 0;
                        text-transform: uppercase;
                        text-shadow: 0 4px 12px rgba(0,0,0,0.5);
                    }

                    .hero-line-2::before {
                        display: none;
                    }

                    .hero-line-2::after {
                        display: none;
                    }

                    .hero-btn-wrapper {
                        position: absolute;
                        left: 50%;
                        bottom: 12vh; /* Slightly lower to give breathing room from the massive text */
                        transform: translateX(-50%) translateZ(150px);
                        opacity: 0;
                        pointer-events: auto;
                        z-index: 20;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 16px;
                    }

                    .btn-premium-cta {
                        position: relative;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        background: rgba(255, 255, 255, 0.05);
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        color: #FFFFFF;
                        padding: 16px 42px;
                        border-radius: 999px;
                        font-family: var(--font-ui);
                        font-size: 14px;
                        font-weight: 600;
                        letter-spacing: 0.25em;
                        text-transform: uppercase;
                        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(var(--color-accent-gold-rgb), 0.05);
                        transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                        overflow: hidden;
                        cursor: pointer;
                    }

                    .btn-premium-cta::before {
                        content: '';
                        position: absolute;
                        top: 0; left: 0; width: 100%; height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                        transform: translateX(-100%);
                        transition: 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                    }

                    .btn-premium-cta:hover::before {
                        transform: translateX(100%);
                    }

                    .btn-premium-cta:hover {
                        background: #FFFFFF;
                        color: #000000;
                        border-color: #FFFFFF;
                        transform: translateY(-3px) scale(1.02);
                        box-shadow: 0 10px 40px rgba(255, 255, 255, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
                        letter-spacing: 0.4em;
                    }
                    
                    /* Indicator text above or below button to aid scroll */
                    .scroll-indicator-wrapper {
                        position: absolute;
                        bottom: 6vh;
                        left: 50%;
                        transform: translateX(-50%);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 12px;
                        z-index: 20;
                        opacity: 1; /* GSAP will fade it */
                    }

                     .scroll-indicator-text {
                        font-family: var(--font-ui);
                        font-size: 10px;
                        font-weight: 500;
                        text-transform: uppercase;
                        letter-spacing: 0.3em;
                        color: var(--color-premium-slate);
                        animation: pulse 2s infinite ease-in-out;
                    }

                    .scroll-indicator-line {
                        width: 1px;
                        height: 40px;
                        background: linear-gradient(to bottom, #FFFFFF, transparent);
                        animation: stretch 2s infinite ease-in-out;
                        transform-origin: top;
                    }
                    
                    @keyframes stretch {
                        0% { transform: scaleY(0.3); opacity: 0; }
                        50% { transform: scaleY(1); opacity: 1; }
                        100% { transform: scaleY(0.3); opacity: 0; }
                    }

                    @keyframes pulse {
                        0%, 100% { opacity: 0.4; }
                        50% { opacity: 0.8; }
                    }

                    @media (max-width: 1024px) {
                        .hero-btn-wrapper {
                            bottom: 15vh;
                        }
                    }

                    @media (max-width: 768px) {
                        .hero-text {
                            top: 0;
                        }
                        .hero-line-1 {
                            top: 30%;
                            left: 50%;
                            transform: translateX(-50%) translateY(-50%);
                            text-align: center;
                            max-width: 90vw;
                        }
                        .hero-line-1 h1 {
                            font-size: clamp(48px, 9vw, 80px);
                        }
                        .hero-line-2 {
                            top: 45%;
                            left: 50%;
                            transform: translateX(-50%) translateY(-50%);
                            text-align: center;
                            max-width: 90vw;
                        }
                        .hero-line-2 h2 {
                            font-size: clamp(16px, 2.5vw, 22px);
                        }
                        .hero-btn-wrapper {
                            left: 50%;
                            transform: translateX(-50%) translateZ(150px);
                            bottom: 10vh;
                        }
                        .btn-premium-cta { padding: 14px 30px; font-size: 12px; letter-spacing: 0.20em; }
                    }
                `}</style>

                <div className={`canvas-container ${imagesReady ? 'ready' : ''}`}>
                    <canvas ref={canvasRef} className="hero-canvas" />
                    <div className="hero-bloom" />
                    <div className="hero-overlay" />
                </div>

                <div className="hero-container">
                    <div className="hero-text">
                        <div className="hero-line-1">
                            <h1 className="block">
                                SUA ORIGEM
                            </h1>
                        </div>

                        <div className="hero-line-2">
                            <h2 className="block">
                                SEU SORRISO
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Call to Scroll Indicator */}
                <div className="scroll-indicator-wrapper">
                    <span className="scroll-indicator-text">Role para descobrir</span>
                    <div className="scroll-indicator-line" />
                </div>
            </section>
    );
}


