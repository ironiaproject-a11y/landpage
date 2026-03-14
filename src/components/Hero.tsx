// Updated: 2026-03-14 - Final Refinement: 0.95x Scale & Absolute Centering + Scroll-Scrub
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FRAME_COUNT = 30; // Updated to 30 frames from 16;9.zip
const FRAME_PREFIX = "/assets/hero-new/ezgif-frame-";
const FRAME_SUFFIX = ".png";

// Important: Register GSAP Plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Helper to format frame numbers (ezgif-frame-001.png etc)
const getFramePath = (index: number) => {
    // Files are 1-indexed based on directory listing: 001 to 030
    const paddedIndex = (index + 1).toString().padStart(3, "0");
    return `${FRAME_PREFIX}${paddedIndex}${FRAME_SUFFIX}`;
};

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const frameObj = useRef({ frame: 0 });

    useEffect(() => {
        setMounted(true);
        // Preload images
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.src = getFramePath(i);
            img.onload = () => {
                loadedCount++;
                if (loadedCount === FRAME_COUNT && canvasRef.current) {
                    // Draw first frame
                    renderFrame(0);
                }
            };
            loadedImages.push(img);
        }
        imagesRef.current = loadedImages;
    }, []);

    const renderFrame = (index: number) => {
        if (!canvasRef.current || !imagesRef.current[index]) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = imagesRef.current[index];
        if (!img.complete) return;

        // Best Practice: Match canvas internal coordinate system to the exact image size!
        if (canvas.width !== img.width || canvas.height !== img.height) {
            canvas.width = img.width;
            canvas.height = img.height;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the crisp original image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Manual brightness/contrast via semi-transparent black overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    useEffect(() => {
        if (!mounted || !textContainerRef.current) return;

        const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
        const scrollEnd = isMobile ? "+=130%" : "+=200%";

        const ctx = gsap.context(() => {
            // 1. Natural intro animation (plays automatically on load)
            let naturalPlayPaused = false;
            const naturalPlay = gsap.to(frameObj.current, {
                frame: FRAME_COUNT - 1,
                snap: "frame",
                ease: "none",
                duration: 1.8,
                onUpdate: () => {
                    // Only render frame if scroll hasn't hijacked control
                    if (!naturalPlayPaused) {
                        renderFrame(Math.round(frameObj.current.frame));
                    }
                }
            });

            // 2. Scroll-scrub animation
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: scrollEnd,
                pin: true,
                anticipatePin: 1,
                scrub: 0.5,
                onUpdate: (self) => {
                    if (self.progress > 0.001) {
                        // Pause the natural animation only once
                        if (!naturalPlayPaused) {
                            naturalPlay.pause();
                            naturalPlayPaused = true;
                        }
                        const frameIndex = Math.round(self.progress * (FRAME_COUNT - 1));
                        renderFrame(frameIndex);
                    } else {
                        // Allow natural play to resume if scrolled back to top
                        if (naturalPlayPaused) {
                            naturalPlayPaused = false;
                            if (!naturalPlay.isActive()) naturalPlay.restart();
                        }
                    }
                }
            });

            // 3. Text Animations
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
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted]);

    return (
        <section ref={sectionRef} className="hero relative overflow-hidden bg-black">
            <style>{`
                .hero {
                    position: relative;
                    width: 100%;
                    height: 100dvh;
                    background: #000;
                    padding: 0 !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* Fixed Cinematic Layer: Decoupled from Page Flow */
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

                .video-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }

                .hero-canvas-wrapper {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }

                .hero-canvas {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center center;
                    display: block;
                }

                @media (max-width: 1023px) {
                    .hero-canvas {
                        /* Force a bit more zoom/scale on mobile to center the skull without cutting sides */
                        transform: scale(1.15);
                        object-position: center 40%;
                    }
                }

                /* Typographic Excellence: Dominant Hierarchy */
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

                /* High-End CTA: Glassmorphism & Precision */
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

            {/* Background Layer: Clean Video Immersion */}
            <div className="video-bg-layer">
                <div ref={containerRef} className="video-container">
                    <canvas ref={canvasRef} className="hero-canvas" />
                </div>
            </div>

            <div className="hero-container">
                {/* Content Block */}
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
    );
}
