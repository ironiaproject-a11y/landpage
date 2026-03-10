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

            if (window.innerWidth > 768) {
                gsap.set(canvasRef.current, { xPercent: -50, yPercent: -50 });
                gsap.to(canvasRef.current, {
                    scale: 1.08,
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
        <section ref={sectionRef} className="hero relative overflow-hidden min-h-[90vh]">
            <style>{`
                .hero {
                    position: relative;
                    width: 100%;
                    height: 100vh;
                    background: #000;
                    display: flex;
                    align-items: flex-end; /* Place text at the bottom to avoid covering the visual */
                    padding-bottom: 8vh;
                }

                .cinematic-title {
                    font-family: inherit;
                    font-weight: 300;
                    font-size: clamp(24px, 4vw, 42px);
                    letter-spacing: 0.1em;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    gap: 12px;
                    text-shadow: 0 4px 20px rgba(0,0,0,0.8);
                    margin: 0;
                }

                .bracket {
                    font-weight: 100;
                    color: rgba(255,255,255,0.4);
                    font-size: 1.2em;
                    transform: translateY(-2px);
                }

                .hero-overlay {
                    background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%);
                }

                .cta-primary {
                    min-width: 220px;
                    height: 48px;
                    background: rgba(255,255,255,0.1);
                    color: #fff;
                    border-radius: 9999px;
                    font-weight: 400;
                    font-size: 13px;
                    letter-spacing: 1.4px;
                    text-transform: uppercase;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(255,255,255,0.2);
                    backdrop-filter: blur(16px);
                    cursor: pointer;
                    transition: all 0.4s ease;
                }

                .cta-primary:hover {
                    background: #fff;
                    color: #000;
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .cinematic-title { font-size: clamp(20px, 5vw, 28px); justify-content: center; }
                    .hero { padding-bottom: 12vh; align-items: flex-end; justify-content: center;}
                }
            `}</style>

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={mounted && window.innerWidth > 768 ? { left: '50%', top: '50%' } : {}}
            />

            <div className="hero-overlay absolute inset-0 z-[1] pointer-events-none" />

            {/* Content properly positioned at the bottom */}
            <div className="relative z-10 w-full px-8 md:px-16 mx-auto container pointer-events-none">
                <div 
                    ref={textContainerRef}
                    className="max-w-2xl flex flex-col md:items-start items-center gap-4 opacity-0 translate-y-8"
                >
                    <h1 className="cinematic-title">
                        <span className="bracket">[</span>
                        <span>Sua origem</span>
                        <span className="bracket">]</span>
                    </h1>

                    <p className="text-base md:text-xl opacity-80 text-white font-light tracking-wide drop-shadow-lg">
                        Seu sorriso
                    </p>
                    
                    <div className="mt-4 pointer-events-auto">
                        <button className="cta-primary">
                            Agendar Consulta
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
