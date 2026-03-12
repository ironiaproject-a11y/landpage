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

        // Set dimensions to match window or container
        const { width, height } = canvas.getBoundingClientRect();
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }

        // Object cover logic
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = drawWidth / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = drawHeight * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Optional dark filter logic could go here via globalAlpha or just draw image
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        // Manual brightness/contrast via semi-transparent black overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
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
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
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

        // Handle resize properly
        const handleResize = () => {
             renderFrame(frameObj.current.frame);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            ctx.revert();
            playAnim.kill();
            window.removeEventListener("resize", handleResize);
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <section ref={sectionRef} className="hero relative overflow-hidden bg-black">
            <style>{`
                .hero {
                    position: relative;
                    width: 100%;
                    height: 100vh;
                    background: #000;
                    padding: 0 !important;
                }

                .video-container {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    width: 100%;
                    height: 100%;
                }

                .hero-canvas {
                    width: 100%;
                    height: 100%;
                    display: block;
                }

                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    background: linear-gradient(
                        rgba(0,0,0,0.5),
                        rgba(0,0,0,0.2),
                        rgba(0,0,0,0.6)
                    );
                }

                @media (min-width: 1024px) {
                    .hero-container {
                        display: flex;
                        align-items: flex-start;
                        width: 100%;
                        height: 100%;
                        padding-left: 8vw;
                        padding-top: 25vh;
                        position: relative;
                    }
                    .hero-text {
                        width: 50%;
                        max-width: 650px;
                        z-index: 20;
                        text-align: left !important;
                    }
                }

                @media (max-width: 1023px) {
                    .hero-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: flex-start;
                        width: 100%;
                        height: 100%;
                        padding-top: 15vh;
                        position: relative;
                    }
                    .hero-text {
                        z-index: 20;
                        text-align: center;
                        width: 100%;
                        padding: 0 6vw;
                    }
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
                    <canvas 
                        ref={canvasRef}
                        className="hero-canvas"
                    />
                    <div className="hero-overlay" />
                </div>

                {/* Text Column */}
                <div ref={textContainerRef} className="hero-text opacity-0 translate-y-8" aria-hidden="false">
                    <div className="phrase-1 mb-2">
                        <h1 className="text-white/60 font-medium tracking-[0.5em] uppercase" style={{ 
                            fontFamily: 'var(--font-body), sans-serif',
                            fontSize: '11px', 
                        }}>
                            Sua origem
                        </h1>
                    </div>
                    
                    <div className="phrase-2 text-balance">
                        <h2 className="text-[#E6D3A3] font-bold tracking-[-0.02em]" style={{ 
                            fontFamily: '"Playfair Display", serif',
                            fontSize: 'clamp(44px, 10vw, 82px)', 
                            lineHeight: '0.95'
                        }}>
                            Seu sorriso
                        </h2>
                    </div>

                    <div className="hero-subheadline mt-8 max-w-lg">
                        <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed tracking-wide">
                            A união entre a alta tecnologia alemã e a sensibilidade artística para criar resultados que transcendem a estética.
                        </p>
                    </div>

                    <div className="hero-metrics-subtle mt-10 md:mt-12 flex flex-wrap gap-x-8 gap-y-4">
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
