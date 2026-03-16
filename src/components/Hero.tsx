// Updated: 2026-03-15 - Canvas Image Sequence with Refined Layout
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
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [imagesReady, setImagesReady] = useState(false);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    
    // Config
    const frameCount = 144;
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
                    }
                };
                imagesRef.current[i] = img;
            }
        };
        loadImages();
    }, []);

    const render = (frame: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx || !imagesRef.current[frame]) return;

        const img = imagesRef.current[frame];
        
        // Responsive Scaling (Cover behavior)
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;

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

        // --- POSITIONING TWEAK ---
        // Overscale the image slightly to allow lateral shifting without showing canvas edges
        const scaleFactor = 1.15; 
        const finalW = drawW * scaleFactor;
        const finalH = drawH * scaleFactor;
        
        // Center it first
        const centerX = (w - finalW) / 2;
        const centerY = (h - finalH) / 2;
        
        // "Position after E of word origem"
        // Move slightly to the right so focal point (skull) doesn't overlap left text.
        const lateralShift = w * 0.12; 
        
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, centerX + lateralShift, centerY, finalW, finalH);
    };

    // Master Animation Logic
    useEffect(() => {
        if (!mounted || !imagesReady || !canvasRef.current || !scrollDriverRef.current) return;

        const sequence = { frame: 0 };
        document.body.style.overflow = "hidden";

        const ctx = gsap.context(() => {
            // 1. MASTER INTRO TIMELINE
            const introTl = gsap.timeline({
                defaults: { ease: "power2.out" },
                onComplete: () => {
                    document.body.style.overflow = "auto";
                    setupScrollScrub();
                    ScrollTrigger.refresh();
                }
            });

            // Intro Sequence (frames 0 -> 70)
            introTl.to(sequence, {
                frame: introFrames,
                duration: 4.5,
                ease: "none",
                onUpdate: () => render(Math.round(sequence.frame))
            }, 0);

            // Text Animations
            introTl.to(".phrase-1-wrapper", {
                opacity: 1,
                y: 0,
                duration: 1.2,
            }, 1.2);

            introTl.to(".phrase-2-wrapper", {
                opacity: 1,
                y: 0,
                duration: 1.2,
            }, 3.0);

            introTl.to(".hero-btn-wrapper", {
                opacity: 1,
                y: 0,
                duration: 1.0,
                ease: "back.out(1.7)"
            }, 3.8);

            function setupScrollScrub() {
                const scrubTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: scrollDriverRef.current,
                        start: "top top",
                        end: "bottom bottom", // Full height of the track
                        scrub: 0.8, // Slightly faster for more "complete" feel
                        invalidateOnRefresh: true,
                    }
                });

                scrubTl.to(sequence, {
                    frame: frameCount - 1,
                    onUpdate: () => render(Math.round(sequence.frame)),
                    ease: "none"
                }, 0);

                // Zoom effect for "limitless" feel
                scrubTl.to(canvasRef.current, {
                    scale: 1.1,
                    ease: "none"
                }, 0);

                // Fade out UI
                scrubTl.to([".phrase-1-wrapper", ".phrase-2-wrapper", ".hero-btn-wrapper"], {
                    opacity: 0,
                    y: -100,
                    stagger: 0.05,
                    duration: 0.4,
                    ease: "power2.inOut"
                }, 0.1);
            }
        });

        // Initial render
        render(0);

        return () => {
            ctx.revert();
            document.body.style.overflow = "auto";
        };
    }, [mounted, imagesReady]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            render(imagesReady ? Math.round(frameCount / 2) : 0); // Re-render preview
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [imagesReady]);

    return (
        <div ref={scrollDriverRef} style={{ height: "400dvh", position: "relative" }}>
            <section ref={sectionRef} className="hero relative overflow-hidden bg-black">
                <style>{`
                    .hero {
                        position: sticky;
                        top: 0;
                        width: 100vw;
                        height: 100vh;
                        background: #000;
                        margin: 0;
                        padding: 0 !important;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                    }

                    .canvas-container {
                        position: absolute;
                        inset: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 0;
                        opacity: 0;
                        transition: opacity 1.5s ease;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        transform: scale(1.05); /* LARGE BY DEFAULT */
                    }

                    .canvas-container.ready {
                        opacity: 1;
                    }

                    .hero-canvas {
                        width: 100% !important;
                        height: 100% !important;
                        object-fit: cover;
                    }

                    /* Subtle vignette to blend edges without looking like a "box" */
                    .hero-overlay {
                        position: absolute;
                        inset: 0;
                        background: radial-gradient(circle at center, transparent 30%, #000 100%);
                        z-index: 1;
                        pointer-events: none;
                        opacity: 0.6;
                    }

                    .hero-container {
                        position: absolute;
                        inset: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 10;
                        pointer-events: none;
                    }

                    .phrase-1-wrapper {
                        position: absolute;
                        left: 10vw;
                        top: 25vh; /* ADJUSTED FOR HIGHER CONTAINER */
                        opacity: 0;
                        transform: translateY(30px);
                    }

                    .phrase-2-wrapper {
                        position: absolute;
                        left: 50%;
                        bottom: 25vh;
                        transform: translate(-50%, 30px);
                        opacity: 0;
                        text-align: center;
                        width: 100%;
                    }

                    .hero-btn-wrapper {
                        position: absolute;
                        left: 50%;
                        bottom: 12vh;
                        transform: translate(-50%, 30px);
                        opacity: 0;
                        pointer-events: auto;
                    }

                    .btn-premium-cta {
                        background: rgba(255, 255, 255, 0.05);
                        backdrop-filter: blur(15px);
                        -webkit-backdrop-filter: blur(15px);
                        border: 1px solid rgba(230, 211, 163, 0.4);
                        color: #FFFFFF;
                        padding: 20px 56px;
                        border-radius: 100px;
                        font-size: 13px;
                        font-weight: 600;
                        letter-spacing: 0.3em;
                        text-transform: uppercase;
                        transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                    }

                    .btn-premium-cta:hover {
                        background: rgba(230, 211, 163, 0.2);
                        border-color: #E6D3A3;
                        transform: scale(1.05);
                    }

                    @media (max-width: 768px) {
                        .phrase-1-wrapper { top: 20vh; left: 8vw; }
                        .phrase-2-wrapper { bottom: 30vh; }
                        .btn-premium-cta { padding: 16px 40px; font-size: 11px; }
                        /* Shifting less on mobile to keep skull visible */
                        .hero-canvas { transform: translateX(5%); } 
                    }
                `}</style>

                <div className={`canvas-container ${imagesReady ? 'ready' : ''}`}>
                    <canvas ref={canvasRef} className="hero-canvas" />
                    <div className="hero-overlay" />
                </div>

                <div className="hero-container">
                    <div className="phrase-1-wrapper">
                        <h1 className="text-white/70 font-light uppercase" style={{
                            fontSize: 'clamp(14px, 1.5vw, 20px)',
                            letterSpacing: '0.5em'
                        }}>
                            Sua origem
                        </h1>
                    </div>

                    <div className="phrase-2-wrapper">
                        <h2 className="text-[#E6D3A3] font-bold" style={{
                            fontFamily: '"Playfair Display", serif',
                            fontSize: 'clamp(48px, 8vw, 110px)',
                            lineHeight: '0.9',
                            letterSpacing: '-0.02em'
                        }}>
                            Seu sorriso
                        </h2>
                    </div>

                    <div className="hero-btn-wrapper">
                        <button className="btn-premium-cta">
                            Descubra a Experiência
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}


