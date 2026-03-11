// Updated: 2026-03-10 - Beautiful Scroll Hero with linda vc frames
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

const FRAME_COUNT = 144;

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    // Animation state
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const playheadRef = useRef({ frame: 0 });
    const layoutRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !canvasRef.current || !sectionRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        // Configuration matching the new extracted sequence
        const currentFrame = (index: number) =>
            `/assets/hero-lindo-vc/frame_${index.toString().padStart(3, '0')}_delay-0.041s.webp`;

        const render = () => {
            const img = imagesRef.current[playheadRef.current.frame];
            if (!img || !img.complete) return;

            const { x, y, width, height } = layoutRef.current;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, x, y, width, height);
        };

        // Preload images
        const preloadImages = () => {
            let loadedCount = 0;
            for (let i = 0; i < FRAME_COUNT; i++) {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    if (i === 0) {
                        render();
                    }
                };
                img.src = currentFrame(i);
                imagesRef.current.push(img);
            }
        };

        const updateSize = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            const img = imagesRef.current[0] || new Image();
            const imgWidth = img.width || 1920;
            const imgHeight = img.height || 1080;

            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "medium";

            const isMobile = window.innerWidth <= 768;
            const ratio = isMobile
                ? Math.min(canvas.width / imgWidth, canvas.height / imgHeight)
                : Math.max(canvas.width / imgWidth, canvas.height / imgHeight);

            const newWidth = imgWidth * ratio;
            const newHeight = imgHeight * ratio;

            layoutRef.current = {
                width: newWidth * 1.08, // Increased base scale
                height: newHeight * 1.08,
                x: (canvas.width - newWidth * 1.08) / 2,
                y: (canvas.height - newHeight * 1.08) / 2
            };

            render();
        };

        window.addEventListener("resize", updateSize);
        updateSize();
        preloadImages();

        // Reveal text after a short delay
        gsap.to(textContainerRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.5,
            delay: 0.5,
            ease: "power3.out"
        });

        const ctx = gsap.context(() => {
            // SINGLE UNIFIED TIMELINE for absolute synchronization
            const masterTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=200%",
                    pin: true,
                    scrub: 0.5,
                    anticipatePin: 1
                }
            });

            // 1. Frame Animation (full duration)
            masterTl.to(playheadRef.current, {
                frame: FRAME_COUNT - 1,
                snap: "frame",
                ease: "none",
                duration: 2, // Arbitrary timeline duration
                onUpdate: render,
            }, 0);

            // 2. Container Scale (full duration)
            if (window.innerWidth > 768) {
                masterTl.to(containerRef.current, {
                    scale: 1.25,
                    ease: "none",
                    duration: 2
                }, 0);
            }

            // 3. Text Narrative Logic
            // Phase 1: [ SUA ORIGEM ] Out
            masterTl.to(".phrase-1", {
                opacity: 0,
                filter: "blur(15px)",
                scale: 0.85,
                y: -15,
                duration: 0.6,
                ease: "power2.in"
            }, 0.6); // Transition starts at ~30% scroll

            // Phase 2: [ SEU SORRISO ] In
            masterTl.fromTo(".phrase-2", {
                opacity: 0,
                filter: "blur(15px)",
                scale: 1.15,
                y: 15
            }, {
                opacity: 1,
                filter: "blur(0px)",
                scale: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, 1.0); // Overlaps as phrase-1 finishes

        }, sectionRef);

        return () => {
            ctx.revert();
            window.removeEventListener("resize", updateSize);
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <section ref={sectionRef} className="hero relative overflow-hidden bg-black min-h-[90vh]">
            <style>{`
                .hero {
                    position: relative;
                    width: 100%;
                    height: 100vh;
                    min-height: -webkit-fill-available;
                    background: #000;
                    margin-bottom: 25vh; /* Large spacer for About section */
                }

                @media (min-width: 1024px) {
                    .hero-container {
                        display: flex;
                        align-items: center;
                        width: 100%;
                        height: 100%;
                        padding-left: 8vw;
                    }
                    .hero-text {
                        width: 50%;
                        max-width: 520px;
                        z-index: 20;
                        text-align: left !important;
                    }
                    .hero-visual {
                        width: 50%;
                        height: 100%;
                        position: relative;
                    }
                    .hero-overlay {
                        background: linear-gradient(to right, 
                            rgba(0,0,0,0.55) 0%, 
                            rgba(0,0,0,0.2) 50%, 
                            transparent 100%
                        );
                    }
                }

                @media (max-width: 1023px) {
                    .hero-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        height: 100%;
                    }
                    .hero-text {
                        position: absolute;
                        z-index: 20;
                        text-align: center;
                        width: 100%;
                        padding: 0 6vw;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-end;
                        padding-bottom: 12vh;
                        top: 0 !important;
                    }
                    .phrase-1 {
                        position: relative !important;
                        top: auto !important;
                        left: auto !important;
                        transform: none !important;
                        width: 100%;
                        margin-bottom: 0.5rem;
                    }
                    .phrase-2 {
                        position: relative !important;
                        top: auto !important;
                        left: auto !important;
                        transform: none !important;
                        width: 100%;
                    }
                    .hero-btn-wrapper {
                        position: relative !important;
                        top: auto !important;
                        left: auto !important;
                        transform: none !important;
                        margin-top: 2rem !important;
                    }
                    .hero-visual {
                        width: 100%;
                        height: 100%;
                    }
                    .hero-overlay {
                        background: radial-gradient(circle at center, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%);
                    }
                }

                .visual-wrapper {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                }

                @media (max-width: 768px) {
                    .hero { 
                        height: 90vh;
                        margin-bottom: 15vh;
                    }
                }
            `}</style>

            <div className="hero-container relative z-10 w-full h-full">
                {/* Text Column */}
                <div ref={textContainerRef} className="hero-text opacity-0 translate-y-8" aria-hidden="false">
                    <div className="phrase-1 mb-1">
                        <h1 className="text-[#F8F8F6] font-normal tracking-[0.15em] opacity-90 uppercase" style={{ 
                            fontFamily: '"Playfair Display", serif',
                            fontSize: 'clamp(16px, 3vw, 22px)',
                            lineHeight: '1.2'
                        }}>
                            Sua origem
                        </h1>
                    </div>
                    
                    <div className="phrase-2">
                        <h2 className="text-[#E6D3A3] font-bold tracking-[-0.02em]" style={{ 
                            fontFamily: '"Playfair Display", serif',
                            fontSize: 'clamp(44px, 11vw, 88px)',
                            lineHeight: '0.95'
                        }}>
                            Seu sorriso
                        </h2>
                    </div>

                    <div className="hero-btn-wrapper mt-12 pointer-events-auto">
                        <button className="btn-luxury-primary">
                            Agendar Experiência
                        </button>
                    </div>
                </div>

                {/* Visual Column / Container */}
                <div ref={containerRef} className="hero-visual absolute lg:relative inset-0 lg:inset-auto lg:h-full lg:w-1/2 lg:ml-auto pointer-events-none overflow-hidden">
                    <div className="visual-wrapper">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="hero-overlay absolute inset-0 z-[1]" />
                </div>
            </div>
        </section>
    );
}
