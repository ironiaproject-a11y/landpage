// Updated: 2026-03-14 - Final Refinement: 0.95x Scale & Absolute Centering
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
            duration: (FRAME_COUNT * 0.041), 
            repeat: -1,
            onUpdate: () => {
                renderFrame(frameObj.current.frame);
            }
        });

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
                }

                .video-container {
                    position: absolute;
                    inset: 0;
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
                    object-position: center 38.5%;
                    display: block;
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
                        left: 8vw;
                        top: 22vh;
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
                    bottom: 10vh;
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
                        margin-top: 4rem;
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
                    
                    <div className="phrase-2 text-balance mb-8">
                        <h2 className="text-[#E6D3A3] font-bold tracking-tight" style={{ 
                            fontFamily: '"Playfair Display", serif',
                            fontSize: 'clamp(52px, 11vw, 102px)', 
                            lineHeight: '0.95',
                            letterSpacing: '-0.02em'
                        }}>
                            Seu sorriso
                        </h2>
                    </div>

                    <div className="hero-subheadline mt-6 max-w-[480px] mx-auto lg:mx-0">
                        <p className="text-white/40 text-[14px] md:text-xl font-light leading-relaxed tracking-[0.03em]">
                            A união entre a alta tecnologia alemã e a sensibilidade artística para criar resultados que transcendem a estética.
                        </p>
                    </div>

                    <div className="hero-metrics-subtle mt-12 flex flex-wrap justify-center lg:justify-start gap-x-12 gap-y-6">
                        {[
                            { value: "785+", label: "Transformações" },
                            { value: "12+ Anos", label: "Experiência" },
                            { value: "4.9★", label: "Satisfação" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col">
                                <span className="text-white/90 font-medium text-xl md:text-2xl tracking-tighter">
                                    {item.value}
                                </span>
                                <span className="text-white/30 text-[9px] uppercase tracking-[0.4em] font-semibold mt-1">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Mobile CTA */}
                    <div className="hero-btn-wrapper lg:hidden">
                        <button className="btn-premium-cta">
                            AGENDAR EXPERIÊNCIA
                        </button>
                    </div>
                </div>

                {/* Desktop CTA */}
                <div className="hero-btn-wrapper hidden lg:block">
                    <button className="btn-premium-cta">
                        AGENDAR EXPERIÊNCIA
                    </button>
                </div>
            </div>
        </section>
    );
}
