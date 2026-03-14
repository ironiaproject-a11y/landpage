// Updated: 2026-03-14 - CSS Sticky approach to fix ghost hero
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FRAME_COUNT = 30;
const FRAME_PREFIX = "/assets/hero-new/ezgif-frame-";
const FRAME_SUFFIX = ".png";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const getFramePath = (index: number) => {
    const paddedIndex = (index + 1).toString().padStart(3, "0");
    return `${FRAME_PREFIX}${paddedIndex}${FRAME_SUFFIX}`;
};

export function Hero() {
    // scrollDriverRef wraps the sticky hero and drives the scroll animation
    const scrollDriverRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const frameObj = useRef({ frame: 0 });

    useEffect(() => {
        setMounted(true);
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.src = getFramePath(i);
            img.onload = () => {
                loadedCount++;
                if (loadedCount === FRAME_COUNT) {
                    // Wait for layout so canvas has its display dimensions
                    requestAnimationFrame(() => renderFrame(0));
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
        if (!img.complete || !img.naturalWidth) return;

        // Match canvas pixels to display size
        const displayW = Math.round(canvas.clientWidth) || window.innerWidth;
        const displayH = Math.round(canvas.clientHeight) || window.innerHeight;

        if (canvas.width !== displayW || canvas.height !== displayH) {
            canvas.width = displayW;
            canvas.height = displayH;
        }

        // Cover scale: fill the canvas
        const scale = Math.max(displayW / img.naturalWidth, displayH / img.naturalHeight);

        const drawW = img.naturalWidth * scale;
        const drawH = img.naturalHeight * scale;

        // Perfect center horizontally and vertically
        const offsetX = (displayW - drawW) / 2;
        const offsetY = (displayH - drawH) / 2;

        ctx.clearRect(0, 0, displayW, displayH);
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

        // Darkness overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.fillRect(0, 0, displayW, displayH);
    };

    useEffect(() => {
        if (!mounted || !textContainerRef.current || !scrollDriverRef.current) return;

        const ctx = gsap.context(() => {
            // 1. Natural intro animation on load
            let naturalPlayPaused = false;
            const naturalPlay = gsap.to(frameObj.current, {
                frame: FRAME_COUNT - 1,
                snap: "frame",
                ease: "none",
                duration: 1.8,
                onUpdate: () => {
                    if (!naturalPlayPaused) {
                        renderFrame(Math.round(frameObj.current.frame));
                    }
                }
            });

            // 2. Scroll-scrub — triggered by the wrapper, NOT the section itself
            // NO pin: true here — CSS sticky handles the visual pinning
            ScrollTrigger.create({
                trigger: scrollDriverRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5,
                onUpdate: (self) => {
                    if (self.progress > 0.001) {
                        if (!naturalPlayPaused) {
                            naturalPlay.pause();
                            naturalPlayPaused = true;
                        }
                        const frameIndex = Math.round(self.progress * (FRAME_COUNT - 1));
                        renderFrame(frameIndex);
                    } else {
                        if (naturalPlayPaused) {
                            naturalPlayPaused = false;
                            if (!naturalPlay.isActive()) naturalPlay.restart();
                        }
                    }
                }
            });

            // 3. Text entrance animations
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
        });

        return () => ctx.revert();
    }, [mounted]);

    return (
        // Scroll driver: this tall wrapper provides the scroll range for the sticky section
        <div ref={scrollDriverRef} style={{ height: "280dvh", position: "relative" }}>
            <section ref={sectionRef} className="hero relative overflow-hidden bg-black">
                <style>{`
                    /* The scroll driver wrapper sets height, hero stays sticky inside it */
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
                            margin: 0;
                            padding: 0 !important;
                            position: relative;
                            overflow: hidden;
                        }

                        .hero-video {
                            position: absolute;
                            inset: 0;
                            width: 100% !important;
                            height: 100% !important;
                            transform: none !important;
                            object-fit: cover !important;
                            object-position: center !important;
                            display: block;
                        }

                        .hero-video canvas {
                            width: 100% !important;
                            height: 100% !important;
                            object-fit: cover !important;
                            object-position: center !important;
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
                    }

                    .hero-video {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                    }

                    .hero-video canvas {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        object-position: center;
                        display: block;
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

                {/* Background Layer */}
                <div className="video-bg-layer">
                    <div ref={containerRef} className="hero-video">
                        <canvas ref={canvasRef} />
                    </div>
                </div>

                <div className="hero-container">
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
        </div>
    );
}
