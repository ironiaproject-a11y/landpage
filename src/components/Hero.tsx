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
        const centerX = (w - finalW) / 2;
        const centerY = (h - finalH) / 2;
        // Lateral shift removed to center content (skull/smile) perfectly
        // const lateralShift = w * 0.25; 

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
        if (!mounted || !imagesReady || !canvasRef.current || !sectionRef.current) return;

        const sequence = sequenceRef.current;
        
        // Ensure dimensions are correct and first frame is drawn before starting animations
        updateDimensions();
        render(0);

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
                    overwrite: "auto"
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

            // 1. MASTER INTRO TIMELINE (Cinematic Animation Timeline)
            const introTl = gsap.timeline({
                onComplete: () => {
                    const lenis = (window as any).lenis;
                    if (lenis) lenis.start();

                    // 2. SETUP SCROLL SCRUB FOR THE VIDEO
                    // Created after intro finishes so it doesn't conflict with the auto-play
                    // This allows the user to control the entire transformation (0 to 144) on scroll
                    const scrubTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top top",
                            end: "+=200vh", // Extended scroll area for smooth playback
                            scrub: 0.5,
                            pin: true, // PIN hero section exactly where it is
                            invalidateOnRefresh: true,
                        }
                    });

                    // Allows scroll to scrub all frames of the video
                    scrubTl.fromTo(sequence, 
                        { frame: 0 }, 
                        {
                            frame: frameCount - 1,
                            onUpdate: () => render(Math.round(sequence.frame)),
                            ease: "none"
                        }, 
                        0
                    );

                    // EXIT ANIMATION (Narrative Transition)
                    scrubTl.to(".hero-container", {
                        y: -100,
                        opacity: 0,
                    }, 0);

                    scrubTl.to(".hero-btn-wrapper", {
                        opacity: 0,
                        y: 50,
                        ease: "power2.inOut"
                    }, 0);

                    ScrollTrigger.refresh();
                }
            });

            // 0.0s - Video starts (animating frames based on time)
            // Assuming 144 frames at ~24fps = 6 seconds total
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

            // 0.6s - Subtle video zoom
            introTl.to(".canvas-container", {
                scale: 1.05,
                duration: 6,
                ease: "power1.inOut"
            }, 0);

            // 1.5s - show text "Sua origem"
            // High-end subtitle style
            introTl.fromTo(".hero-line-1", 
                { opacity: 0, y: 15, scale: 0.95 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    duration: 1.2, 
                    ease: "expo.out" 
                },
                1.5
            );

            // 3.5s - hide "Sua origem"
            introTl.to(".hero-line-1", {
                opacity: 0,
                y: -10,
                duration: 0.5,
                ease: "power2.in"
            }, 3.5);

            // 3.8s - show text "Seu sorriso"
            // Dramatic entrance for the focal point
            introTl.fromTo(".hero-line-2",
                { opacity: 0, y: 25, scale: 1.05, filter: "blur(10px)" },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    filter: "blur(0px)",
                    duration: 1.5, 
                    ease: "power4.out" 
                },
                3.8
            );

            // 4.2s - CTA button fades in
            introTl.fromTo(".hero-btn-wrapper",
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 1.2, 
                    ease: "back.out(1.7)" 
                },
                4.2
            );
        });

        // Initial render logic
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
            <section ref={sectionRef} className="hero relative overflow-hidden bg-[#0B0B0B]">
                <style>{`
                    .hero {
                    position: relative;
                    width: 100vw;
                    height: 100vh;
                    background: #0B0B0B;
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
                        top: 42%; /* Slightly above center for subtitle feel */
                        left: 50%;
                        transform: translate(-50%, -50%);
                        text-align: center;
                        opacity: 0;
                        font-family: var(--font-playfair), "Playfair Display", serif;
                        font-size: clamp(14px, 1.5vw, 18px);
                        font-weight: 500;
                        letter-spacing: 0.5em; /* Elegant wide tracking */
                        text-transform: uppercase;
                        color: rgba(243, 231, 200, 0.8);
                        text-shadow: 0 4px 15px rgba(0,0,0,0.4);
                        white-space: nowrap;
                        z-index: 10;
                    }

                    .hero-line-2 {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        text-align: center;
                        opacity: 0;
                        z-index: 10;
                    }

                    .hero-line-2 h2 {
                        font-family: var(--font-bodoni), "Libre Bodoni", serif;
                        font-size: clamp(64px, 10vw, 110px); /* Massive, impactful size */
                        font-weight: 700;
                        font-style: italic; /* Cinematic italic touch */
                        letter-spacing: -0.03em;
                        line-height: 0.9;
                        background: linear-gradient(180deg, #F3E7C8 0%, #E6D3A3 50%, #CBB382 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        filter: drop-shadow(0 15px 35px rgba(0,0,0,0.6));
                        margin: 0;
                        padding: 0;
                    }

                    .hero-btn-wrapper {
                        position: absolute;
                        left: 50%;
                        bottom: 15vh;
                        transform: translateX(-50%) translateZ(150px);
                        opacity: 0;
                        pointer-events: auto;
                        z-index: 20;
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
                        .hero-line-2 h2 {
                            font-size: clamp(40px, 8vw, 50px);
                            white-space: normal;
                            max-width: 90vw;
                        }
                    }

                    @media (max-width: 768px) {
                        .hero-text {
                            top: 0;
                        }
                        .hero-line-2 h2 {
                            font-size: clamp(36px, 10vw, 46px);
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
                    <div className="hero-text">
                        <div className="hero-line-1">
                            <span className="block">
                                Sua origem
                            </span>
                        </div>

                        <div className="hero-line-2">
                            <h2 className="block">
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
    );
}


