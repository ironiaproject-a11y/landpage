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
                width: newWidth * 1.02,
                height: newHeight * 1.02,
                x: (canvas.width - newWidth * 1.02) / 2,
                y: (canvas.height - newHeight * 1.02) / 2 // Re-centered internally for "straight" look
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
            // Main frame animation
            gsap.to(playheadRef.current, {
                frame: FRAME_COUNT - 1,
                snap: "frame",
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=150%",
                    pin: true,
                    scrub: 0.5,
                    anticipatePin: 1
                },
                onUpdate: render,
            });

            // Cross-fade animation for text
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=150%",
                    scrub: 0.5,
                }
            });

            // Phase 1: [ SUA ORIGEM ]
            tl.to(".phrase-1", {
                opacity: 0,
                filter: "blur(10px)",
                y: -20,
                duration: 1,
                ease: "power2.inOut"
            }, 0.1);

            // Phase 2: [ SEU SORRISO ]
            tl.fromTo(".phrase-2", {
                opacity: 0,
                filter: "blur(10px)",
                y: 20
            }, {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                duration: 1,
                ease: "power2.out"
            }, 0.6);

            if (window.innerWidth > 768) {
                gsap.to(containerRef.current, {
                    scale: 1.15, // Controlled scale for prestige
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "+=150%",
                        scrub: true
                    }
                });
            }
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
                    font-family: inherit;
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    align-items: center; /* Centered relative to video */
                    gap: 0;
                    margin: 0;
                    width: 100%;
                }

                .prestige-text {
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    line-height: 1;
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
                        {/* Phrase 1: The Origin */}
                        <div className="phrase-1 flex items-center justify-center w-full">
                            <span className="bracket text-3xl md:text-5xl font-light opacity-40">[</span>
                            <span className="prestige-text font-bold text-4xl md:text-6xl tracking-[0.15em] text-white drop-shadow-2xl">
                                SUA ORIGEM
                            </span>
                            <span className="bracket text-3xl md:text-5xl font-light opacity-40">]</span>
                        </div>

                        {/* Phrase 2: The Smile */}
                        <div className="phrase-2 absolute top-0 left-0 right-0 flex items-center justify-center opacity-0">
                            <span className="bracket text-3xl md:text-5xl font-light opacity-40">[</span>
                            <span className="prestige-text font-bold text-4xl md:text-6xl tracking-[0.15em] text-white drop-shadow-2xl">
                                SEU SORRISO
                            </span>
                            <span className="bracket text-3xl md:text-5xl font-light opacity-40">]</span>
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
