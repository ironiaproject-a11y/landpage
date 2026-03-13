// Updated: 2026-03-12 - Reverted to Image Sequence for 'lindo vc'
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const FRAME_COUNT = 144;
const FRAME_PREFIX = "/assets/hero-lindo-vc/frame_";
const FRAME_SUFFIX = "_delay-0.041s.webp";

// Helper to format frame numbers
const getFramePath = (index: number) => {
    const paddedIndex = index.toString().padStart(3, "0");
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
        // This avoids any quality loss from CSS pixel scaling on Retina/High-DPI screens.
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

        // Set up infinite play loop for frames since autoplay logic is requested
        const playAnim = gsap.to(frameObj.current, {
            frame: FRAME_COUNT - 1,
            snap: "frame",
            ease: "none",
            duration: (FRAME_COUNT * 0.041), // Based on 0.041s delay per frame
            repeat: -1,
            onUpdate: () => {
                renderFrame(frameObj.current.frame);
            }
        });

        // Load-only fade-in — NO scroll triggers
        const ctx = gsap.context(() => {
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

            tl.fromTo(".hero-subheadline",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            0.8);

            tl.fromTo(".hero-metrics-subtle",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            1.0);

            tl.fromTo(".hero-btn-wrapper",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            1.2);
        }, textContainerRef);

        return () => {
            ctx.revert();
            playAnim.kill();
        };
    }, [mounted]);


    return (
        <section ref={sectionRef} className="hero relative overflow-hidden bg-black">
            <style>{`
                .hero {
                    position: relative;
                    width: 100%;
                    height: 100dvh; /* Dynamic viewport height for mobile */
                    background: #000;
                    padding: 0 !important;
                }

                .video-container {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .hero-canvas-wrapper {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    top: 0;
                }

                .hero-canvas {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center 20%; /* Keep faces near the top aligned properly */
                    display: block;
                    transform: scale(1.0);
                }

                @media (min-width: 1024px) {
                    .hero-container {
                        display: flex;
                        align-items: flex-start;
                        width: 100%;
                        height: 100%;
                        padding-left: 8vw;
                        padding-top: 18vh; /* Adjusted from 25vh to hit 15-20% target */
                        position: relative;
                    }
                    .hero-text {
                        width: 50%;
                        max-width: 650px;
                        z-index: 20;
                        text-align: left !important;
                    }
                    .hero-canvas {
                        /* Decreasing the visual footprint slightly to restore quality and limit oversize on wide screens */
                        width: 100%;
                        height: 100%;
                        max-width: 1800px;
                        object-fit: contain; /* Shrinks to not stretch completely on very wide screens while keeping quality */
                        transform: scale(1.15); /* Slight zoom so there are zero black bars on standard 16:9, but avoids 3x zoom on ultrawide */
                        filter: drop-shadow(0 0 40px rgba(0,0,0,0.5));
                    }
                }

                @media (max-width: 1023px) {
                    .hero-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: flex-start; /* Changed from flex-end to top-align */
                        width: 100%;
                        height: 100%;
                        padding-top: 15dvh; /* Adjusted to hit 15-20% target */
                        position: relative;
                        background: #000;
                    }
                    .hero-canvas-wrapper {
                        height: 55dvh; /* Final refined height for minimal side cropping */
                        top: 0;
                    }
                    .hero-text {
                        z-index: 20;
                        text-align: center;
                        width: 100%;
                        padding-left: 8vw;
                        padding-right: 8vw;
                        background: linear-gradient(to bottom, 
                            rgba(0,0,0,0.8) 0%, 
                            rgba(0,0,0,0.4) 40%, 
                            rgba(0,0,0,0) 100%);
                        padding-top: 20px;
                        padding-bottom: 40px;
                    }
                    .hero-canvas {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        object-position: center 25%;
                    }
                    .hero-subheadline {
                        margin-top: 0.75rem !important;
                    }
                    .hero-metrics-subtle {
                        margin-top: 1rem !important;
                        gap: 1.25rem !important;
                    }
                    .hero-btn-wrapper {
                        margin-top: 1.5rem !important;
                    }
                }

                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    background: linear-gradient(
                        rgba(0,0,0,0.6),
                        rgba(0,0,0,0.2),
                        rgba(0,0,0,0.8)
                    );
                }

                .film-grain {
                    position: absolute;
                    inset: -100%;
                    width: 300%;
                    height: 300%;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    opacity: 0.04;
                    pointer-events: none;
                    z-index: 5;
                    animation: noise-move 0.2s steps(2) infinite;
                    will-change: transform;
                }

                @keyframes noise-move {
                    0% { transform: translate(0, 0); }
                    25% { transform: translate(-2%, -1%); }
                    50% { transform: translate(1%, -2%); }
                    75% { transform: translate(-1%, 2%); }
                    100% { transform: translate(0, 0); }
                }
            `}</style>

            <div className="hero-container relative z-10 w-full h-full">
                <div className="film-grain" aria-hidden="true" />
                
                {/* Visual Background */}
                <div ref={containerRef} className="video-container">
                    <div className="hero-canvas-wrapper">
                        <canvas 
                            ref={canvasRef}
                            className="hero-canvas"
                        />
                    </div>
                    <div className="hero-overlay" />
                </div>

                {/* Text Column */}
                <div ref={textContainerRef} className="hero-text opacity-0 translate-y-8" aria-hidden="false">
                    <div className="phrase-1 mb-2">
                        <h1 className="text-white/40 font-medium tracking-[0.6em] uppercase" style={{ 
                            fontFamily: 'var(--font-body), sans-serif',
                            fontSize: '10px', 
                        }}>
                            Sua origem
                        </h1>
                    </div>
                    
                    <div className="phrase-2 text-balance">
                        <h2 className="text-[#E6D3A3] font-bold tracking-tight" style={{ 
                            fontFamily: '"Playfair Display", serif',
                            fontSize: 'clamp(42px, 10vw, 88px)', 
                            lineHeight: '0.9'
                        }}>
                            Seu sorriso
                        </h2>
                    </div>

                    <div className="hero-subheadline mt-6 max-w-lg mx-auto">
                        <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed tracking-wide">
                            A união entre a alta tecnologia alemã e a sensibilidade artística para criar resultados que transcendem a estética.
                        </p>
                    </div>

                    <div className="hero-metrics-subtle mt-8 md:mt-12 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4">
                        {[
                            { value: "785+", label: "Transformações" },
                            { value: "12+ Anos", label: "Experiência" },
                            { value: "4.9★", label: "Satisfação" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col">
                                <span className="text-white/80 font-medium text-lg md:text-xl tracking-tight">
                                    {item.value}
                                </span>
                                <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-medium">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="hero-btn-wrapper mt-10">
                        <button className="btn-luxury-primary py-4 px-10 rounded-full border border-[#E6D3A3]/30 bg-black/40 backdrop-blur-md text-white tracking-[0.2em] font-medium text-xs hover:bg-[#E6D3A3] hover:text-black transition-all duration-500">
                            AGENDAR EXPERIÊNCIA
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
