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
        <section ref={sectionRef} className="hero relative overflow-hidden">
            <style>{`
                .hero {
                    position: relative;
                    width: 100%;
                    height: 100vh;
                    min-height: -webkit-fill-available;
                    background: #000;
                    margin-bottom: 25vh; /* Large spacer for About section */
                }

                .visual-wrapper {
                    position: absolute;
                    top: 35%; /* Elevated position closer to Clinica logo */
                    left: 50%;
                    transform: translate(-50%, -50%); /* Robust centering for all devices */
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .cinematic-title {
                    position: relative;
                    width: 100%;
                    height: 140px;
                }

                .prestige-text {
                    text-transform: uppercase;
                    line-height: 1.2;
                    display: inline-block;
                }

                .phrase-1 .prestige-text {
                    color: var(--color-silver-bh, #CBD5E1);
                    letter-spacing: 0.18em;
                }

                .phrase-2 .prestige-text {
                    color: var(--color-creme, #F5F5DC);
                    font-family: var(--font-bodoni), serif;
                    letter-spacing: 0.22em;
                    filter: drop-shadow(0 0 15px rgba(245, 245, 220, 0.3));
                }

                @media (max-width: 768px) {
                    .hero { 
                        height: 90vh;
                        margin-bottom: 15vh;
                    }
                    .visual-wrapper {
                        top: 32%; /* Even closer on mobile */
                    }
                }
            `}</style>

            <div ref={containerRef} className="visual-wrapper z-0 pointer-events-none">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Typography INSIDE the visual container */}
                <div 
                    ref={textContainerRef}
                    className="relative z-10 w-full px-6 flex flex-col items-center opacity-0 translate-y-8"
                >
                    <div className="cinematic-title">
                        {/* Phrase 1: Titanium Silver - Technical Precision */}
                        <div className="phrase-1 absolute inset-0 flex items-center justify-center w-full">
                            <span className="bracket text-2xl md:text-3xl font-extralight opacity-20 text-[#CBD5E1]">[</span>
                            <span className="prestige-text font-medium text-4xl md:text-6xl">
                                SUA ORIGEM
                            </span>
                            <span className="bracket text-2xl md:text-3xl font-extralight opacity-20 text-[#CBD5E1]">]</span>
                        </div>

                        {/* Phrase 2: Creme Luminous - Aesthetic Sophistication */}
                        <div className="phrase-2 absolute inset-0 flex items-center justify-center opacity-0">
                            <span className="bracket text-2xl md:text-3xl font-thin opacity-20 text-[#F5F5DC]">[</span>
                            <span className="prestige-text font-light italic text-4xl md:text-6xl">
                                SEU SORRISO
                            </span>
                            <span className="bracket text-2xl md:text-3xl font-thin opacity-20 text-[#F5F5DC]">]</span>
                        </div>
                    </div>

                    <div className="mt-12 pointer-events-auto">
                        <button className="cta-primary">
                            Agendar Experiência
                        </button>
                    </div>
                </div>
            </div>

            <div className="hero-overlay absolute inset-0 z-[1] pointer-events-none" />
        </section>
    );
}
