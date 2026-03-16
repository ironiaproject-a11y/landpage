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
    const scrollDriverRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [imagesReady, setImagesReady] = useState(false);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const sequenceRef = useRef({ frame: 0 });
    const mouseRef = useRef({ x: 0, y: 0 });
    
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
        const centerX = (w - finalW) / 2;
        const centerY = (h - finalH) / 2;
        const lateralShift = w * 0.25; 

        drawParamsRef.current = { 
            drawW: finalW, 
            drawH: finalH, 
            drawX: centerX + lateralShift, 
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
        if (!mounted || !imagesReady || !canvasRef.current || !scrollDriverRef.current) return;

        const sequence = sequenceRef.current;
        const lenis = (window as any).lenis;
        
        if (lenis) lenis.stop();

        const ctx = gsap.context(() => {
            // --- 3D TILT INTERACTION ---
            const handleMouseMove = (e: MouseEvent) => {
                const { clientX, clientY } = e;
                const { innerWidth, innerHeight } = window;
                const xPct = (clientX / innerWidth - 0.5) * 2; // -1 to 1
                const yPct = (clientY / innerHeight - 0.5) * 2; // -1 to 1
                
                mouseRef.current = { x: xPct, y: yPct };
                
                // Subtle tilt
                gsap.to(".canvas-container", {
                    rotateY: xPct * 4,
                    rotateX: -yPct * 4,
                    x: xPct * 15,
                    y: yPct * 15,
                    duration: 1.2,
                    ease: "power2.out",
                });
                
                // Bloom follows mouse
                gsap.to(".hero-bloom", {
                    x: xPct * 50,
                    y: yPct * 50,
                    opacity: 0.4 + (Math.abs(xPct) * 0.2),
                    duration: 1.5,
                    ease: "power2.out",
                });
            };

            window.addEventListener("mousemove", handleMouseMove);

            // 1. Setup Scroll Scrub immediately
            const scrubTl = gsap.timeline({
                scrollTrigger: {
                    trigger: scrollDriverRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.5,
                    invalidateOnRefresh: true,
                }
            });

            scrubTl.to(sequence, {
                frame: frameCount - 1,
                onUpdate: () => render(Math.round(sequence.frame)),
                ease: "none"
            }, 0);

            // 0a. End frame sequence early to prevent skip
            // The frames (0-143) will complete at 75% scroll progress
            gsap.to(scrubTl.getChildren()[0], {
                duration: 0.75, // Percentage of timeline
                ease: "none"
            });

            // Enhanced Z-Space effect
            scrubTl.to(canvasRef.current, {
                scale: 1.15,
                ease: "none"
            }, 0);

            // Text recedes into distance (Parallax)
            scrubTl.to([".phrase-1-wrapper", ".phrase-2-wrapper"], {
                scale: 0.8,
                z: -150,
                ease: "none"
            }, 0);

            // Fade out UI - Delayed until AFTER the transformation
            scrubTl.to(".hero-text-cluster", {
                opacity: 0,
                x: -120,
                scale: 0.85,
                duration: 0.4,
                ease: "power2.inOut"
            }, 0.6); // Delay to 60% of scroll to preserve intro visibility

            scrubTl.to(".hero-btn-wrapper", {
                opacity: 0,
                y: 80,
                duration: 0.3,
                ease: "power2.inOut"
            }, 0.6);

            // The Exit Sequence that previously caused a blackout has been removed 
            // to ensure the hero video remains visible throughout the entire scroll.

            // 2. MASTER INTRO TIMELINE (Sequential Reveal)
            const introTl = gsap.timeline({
                defaults: { ease: "power3.inOut" },
                delay: 1.0, // Initial breath
                onComplete: () => {
                    if (lenis) lenis.start();
                    ScrollTrigger.refresh();
                }
            });

            // PHASE 1: The Origin (Skull)
            introTl.to(".phrase-1-wrapper", {
                opacity: 0.8,
                y: 0,
                duration: 1.8,
                ease: "power2.out"
            }, 0);

            // PHASE 2 & 3: Movement and Transformation
            // Synchronized with skull end sequence
            introTl.to(".phrase-1-wrapper", {
                opacity: 0,
                scale: 0.7,
                y: -60,
                duration: 1.5,
                ease: "power3.in"
            }, 5.5); // Fades out as the auto-scroll reaches the transformation point

            // Balanced for 400dvh track - lands at exactly the transformation point
            const trackHeight = scrollDriverRef.current?.offsetHeight || (window.innerHeight * 3);
            const scrollDistance = trackHeight * 0.48; 

            introTl.to(window, {
                scrollTo: scrollDistance,
                duration: 4.5,
                ease: "expo.inOut",
            }, 3.5);

            // PHASE 4: The Smile (Reveal)
            // Starts appearing exactly when the face sequence begins in the video
            introTl.to(".phrase-2-wrapper", {
                opacity: 1,
                y: 0,
                duration: 2.5,
                ease: "power4.out"
            }, 7.8);

            introTl.to(".hero-btn-wrapper", {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: "back.out(1.4)"
            }, 9.0);
        });

        // Initial render logic
        if (imagesReady) {
            updateDimensions();
            render(0);
        }

        return () => {
            ctx.revert();
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
        <div ref={scrollDriverRef} style={{ height: "300dvh", position: "relative" }}>
            <section ref={sectionRef} className="hero relative overflow-hidden bg-[#0B0B0B]">
                <style>{`
                    .hero {
                    position: sticky;
                    top: 0;
                    width: 100vw;
                    height: 100vh;
                    background: #0B0B0B;
                    margin: 0;
                    padding: 0 !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    z-index: 10;
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
                        width: 80vw;
                        height: 80vh;
                        background: radial-gradient(circle at center, rgba(230, 211, 163, 0.15) 0%, transparent 70%);
                        transform: translate(-50%, -50%);
                        z-index: 1;
                        pointer-events: none;
                        filter: blur(80px);
                        mix-blend-mode: screen;
                    }

                    /* Multi-layered sophisticated vignette */
                    .hero-overlay {
                        position: absolute;
                        inset: 0;
                        /* Linear gradient targeted for left-side text legibility */
                        background: linear-gradient(90deg, 
                            rgba(0,0,0,0.65) 0%, 
                            rgba(0,0,0,0.3) 40%, 
                            transparent 80%
                        );
                        z-index: 2;
                        pointer-events: none;
                    }

                    @media (max-width: 768px) {
                        .hero-overlay {
                            background: rgba(0,0,0,0.45);
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

                    .hero-text-cluster {
                        position: absolute;
                        top: 50vh;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        text-align: center;
                        z-index: 20;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 15px;
                        pointer-events: none;
                        width: 100%;
                        max-width: 95vw;
                    }

                    .phrase-1-wrapper {
                        opacity: 0;
                        transform: translateZ(60px) translateY(20px);
                        font-family: var(--font-playfair), "Playfair Display", serif;
                        font-size: clamp(18px, 2.5vw, 26px);
                        font-weight: 400;
                        letter-spacing: 0.35em;
                        color: #F3E7C8;
                        text-transform: uppercase;
                        text-shadow: 0 4px 15px rgba(0,0,0,0.5);
                    }

                    .phrase-2-wrapper {
                        opacity: 0;
                        transform: translateZ(160px) translateY(20px);
                        font-family: var(--font-bodoni), "Libre Bodoni", serif;
                        font-size: clamp(80px, 18vw, 280px);
                        font-weight: 600;
                        letter-spacing: -0.03em;
                        line-height: 0.75;
                        color: #FFCC00;
                        text-shadow: 0 20px 80px rgba(0,0,0,0.9), 0 0 40px rgba(255, 204, 0, 0.25);
                        white-space: nowrap;
                    }

                    .hero-btn-wrapper {
                        position: absolute;
                        left: 6vw;
                        bottom: 8vh;
                        transform: translateZ(150px);
                        opacity: 0;
                        pointer-events: auto;
                    }

                    .btn-premium-cta {
                        background: transparent;
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(15px);
                        border: 1px solid rgba(248, 248, 246, 0.4);
                        color: #F8F8F6;
                        padding: 18px 40px;
                        border-radius: 999px;
                        font-size: 13px;
                        font-weight: 500;
                        letter-spacing: 0.25em;
                        text-transform: uppercase;
                        transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                    }

                    .btn-premium-cta:hover {
                        background: rgba(230, 211, 163, 0.15);
                        border-color: #E6D3A3;
                        transform: scale(1.05);
                        letter-spacing: 0.3em;
                    }

                    @media (max-width: 1024px) {
                        .phrase-2-wrapper {
                            font-size: clamp(50px, 14vw, 90px);
                            white-space: normal;
                            max-width: 90vw;
                        }
                    }

                    @media (max-width: 768px) {
                        .hero-text-cluster {
                            top: 45vh;
                        }
                        .phrase-2-wrapper {
                            font-size: clamp(40px, 18vw, 70px);
                        }
                        .hero-btn-wrapper { 
                            left: 50%;
                            transform: translateX(-50%) translateZ(150px);
                            bottom: 12vh;
                        }
                        .btn-premium-cta { padding: 14px 30px; font-size: 11px; }
                    }
                `}</style>

                <div className={`canvas-container ${imagesReady ? 'ready' : ''}`}>
                    <canvas ref={canvasRef} className="hero-canvas" />
                    <div className="hero-bloom" />
                    <div className="hero-overlay" />
                </div>

                <div className="hero-container">
                    <div className="hero-text-cluster">
                        <div className="phrase-1-wrapper">
                            <span className="block">
                                Sua origem
                            </span>
                        </div>

                        <div className="phrase-2-wrapper">
                            <h2 className="block italic">
                                Seu sorriso
                            </h2>
                        </div>
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


