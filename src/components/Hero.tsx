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

        const scaleFactor = 1.08; 
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
                scale: 1.25,
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

            // 1a. Exit Sequence (Parallax Recess) - Replaces the "vanishing" effect
            // The video now lifts up slightly as it fades, creating a more natural transition
            scrubTl.to(".canvas-container", {
                yPercent: -15, // Subtle vertical lift
                opacity: 0, // Absolute blackout
                filter: "brightness(0) contrast(1.1) blur(10px)",
                duration: 0.4,
                ease: "power1.inOut"
            }, 0.8);

            // Suppression of atmospheric layers
            scrubTl.to(".hero-bloom", {
                opacity: 0,
                scale: 0.5,
                duration: 0.3,
                ease: "power2.in"
            }, 0.8);

            scrubTl.to(".hero-overlay", {
                background: "#0B0B0B", // Force solid blackout color
                opacity: 1,
                duration: 0.2, // Shorter duration for faster track
                ease: "none"
            }, 0.8);

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

            // PHASE 2: The Disappearance
            introTl.to(".phrase-1-wrapper", {
                opacity: 0,
                y: -20,
                duration: 1.5,
                ease: "power2.in"
            }, 2.5);

            // PHASE 3: The Transformation (Auto-Scroll)
            // Synchronized with the new compressed 200dvh track
            // We want to land at approx 48% of the Hero scroll range (the transformation point)
            const trackHeight = scrollDriverRef.current?.offsetHeight || (window.innerHeight * 2);
            const scrollDistance = trackHeight * 0.48; 

            // PHASE 4: The Smile (Reveal)
            introTl.to(".phrase-2-wrapper", {
                opacity: 1,
                y: 0,
                duration: 2.0,
                ease: "power2.out"
            }, 7.5);

            introTl.to(".hero-btn-wrapper", {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: "back.out(1.4)"
            }, 8.5);
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
        <div ref={scrollDriverRef} style={{ height: "200dvh", position: "relative" }}>
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
                        transform: scale(1.05);
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
                        background: 
                            radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.4) 60%, #000 100%),
                            linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.6) 100%);
                        z-index: 2;
                        pointer-events: none;
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
                        left: 12vw;
                        top: 45%;
                        transform: translateY(-50%);
                        z-index: 10;
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                        pointer-events: none;
                    }

                    .phrase-1-wrapper {
                        opacity: 0;
                        transform: translateZ(40px) translateY(20px);
                        filter: drop-shadow(0 0 20px rgba(0,0,0,0.9));
                    }

                    .phrase-2-wrapper {
                        opacity: 0;
                        transform: translateZ(80px) translateY(20px);
                        filter: drop-shadow(0 0 30px rgba(0,0,0,0.8));
                    }

                    .hero-btn-wrapper {
                        position: absolute;
                        left: 50%;
                        bottom: 12vh;
                        transform: translate(-50%, 30px) translateZ(100px);
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
                        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                    }

                    .btn-premium-cta:hover {
                        background: rgba(230, 211, 163, 0.2);
                        border-color: #E6D3A3;
                        transform: scale(1.05);
                    }

                    @media (max-width: 768px) {
                        .hero-text-cluster {
                            left: 50%;
                            top: 35%;
                            transform: translate(-50%, -50%);
                            width: 100%;
                            text-align: center;
                            padding: 0 20px;
                        }
                        .hero-btn-wrapper { bottom: 15vh; }
                        .btn-premium-cta { padding: 16px 40px; font-size: 11px; }
                        .hero-canvas { transform: translateX(0); } 
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
                            <h1 className="text-white/80 font-light uppercase" style={{
                                fontSize: 'clamp(14px, 1.4vw, 20px)',
                                letterSpacing: '0.5em'
                            }}>
                                Sua origem
                            </h1>
                        </div>

                        <div className="phrase-2-wrapper">
                            <h2 className="text-[#E6D3A3] font-bold" style={{
                                fontFamily: '"Playfair Display", serif',
                                fontSize: 'clamp(42px, 6vw, 90px)',
                                lineHeight: '1.0',
                                letterSpacing: '-0.01em'
                            }}>
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


