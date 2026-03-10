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
                width: newWidth,
                height: newHeight,
                x: (canvas.width - newWidth) / 2,
                y: (canvas.height - newHeight) / 2
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
                gsap.set(canvasRef.current, { xPercent: -50, yPercent: -50 });
                gsap.to(canvasRef.current, {
                    scale: 1.15, // Increased scale
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
                    height: 100svh;
                    min-height: -webkit-fill-available;
                    background: #000;
                    display: flex;
                    align-items: center; /* Center instead of bottom to move it up */
                    padding-bottom: 2vh; /* Slight offset from dead center */
                    padding-top: 0;
                }

                .cinematic-title {
                    font-family: inherit;
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0;
                    margin: 0;
                }

                .bracket {
                    font-weight: 200;
                    color: rgba(255,255,255,0.4);
                    margin: 0 4px;
                }

                .prestige-text {
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                }

                .hero-overlay {
                    background: linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%);
                }

                .cta-primary {
                    min-width: 280px;
                    height: 56px;
                    background: rgba(255,255,255,0.05);
                    color: #fff;
                    border-radius: 9999px;
                    font-weight: 500;
                    font-size: 13px;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-top: 1px solid rgba(255,255,255,0.3);
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    backdrop-filter: blur(25px);
                    cursor: pointer;
                    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .cta-primary:hover {
                    background: #fff;
                    color: #000;
                    transform: translateY(-5px);
                    box-shadow: 0 20px 50px rgba(255,255,255,0.15);
                }

                @media (max-width: 768px) {
                    .hero { 
                        height: 100svh;
                        padding-bottom: 15vh; 
                        padding-left: 2rem;
                        padding-right: 2rem;
                    }
                }
            `}</style>

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={mounted && window.innerWidth > 768 ? { left: '50%', top: '42%' } : { top: '45%' }}
            />

            <div className="hero-overlay absolute inset-0 z-[1] pointer-events-none" />

            {/* Content properly positioned at the bottom with a clear visual hierarchy */}
            <div className="relative z-10 w-full px-6 md:px-24 mx-auto container pointer-events-none mb-4 md:mb-12 -mt-20 md:-mt-32">
                <div 
                    ref={textContainerRef}
                    className="max-w-4xl flex flex-col items-start gap-8 opacity-0 translate-y-12"
                >
                    <div className="cinematic-title">
                        {/* Phrase 1: The Origin */}
                        <div className="phrase-1 flex items-center">
                            <span className="bracket text-4xl md:text-6xl">[</span>
                            <span className="prestige-text font-bold text-5xl md:text-8xl tracking-tight text-white drop-shadow-2xl">
                                SUA ORIGEM
                            </span>
                            <span className="bracket text-4xl md:text-6xl">]</span>
                        </div>

                        {/* Phrase 2: The Smile (Stacked/Absolute to allow clean transition) */}
                        <div className="phrase-2 absolute top-0 left-0 flex items-center opacity-0">
                            <span className="bracket text-4xl md:text-6xl">[</span>
                            <span className="prestige-text font-bold text-5xl md:text-8xl tracking-tight text-white drop-shadow-2xl">
                                SEU SORRISO
                            </span>
                            <span className="bracket text-4xl md:text-6xl">]</span>
                        </div>
                    </div>

                    <div className="ml-2 md:ml-12 pointer-events-auto">
                        <button className="cta-primary">
                            Agendar Experiência
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
