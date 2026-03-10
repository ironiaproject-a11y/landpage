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
                filter: "blur(15px)",
                scale: 0.9,
                y: -15,
                duration: 0.8,
                ease: "power2.in"
            }, 0.3); // Starts slightly later

            // Phase 2: [ SEU SORRISO ]
            tl.fromTo(".phrase-2", {
                opacity: 0,
                filter: "blur(15px)",
                scale: 1.1,
                y: 15
            }, {
                opacity: 1,
                filter: "blur(0px)",
                scale: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, 0.5); // Overlaps with phrase-1 fade-out

            if (window.innerWidth > 768) {
                gsap.to(containerRef.current, {
                    scale: 1.22, // Increased scroll scale
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
                    position: relative;
                    font-family: inherit;
                    color: #fff;
                    width: 100%;
                    height: 120px; /* Stronger fixed height to hold both absolute phrases */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .prestige-text {
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    line-height: 1.2;
                    display: inline-block;
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
                        {/* Both phrases use absolute inset-0 to ensure perfect overlap and centering */}
                        <div className="phrase-1 absolute inset-0 flex items-center justify-center w-full">
                            <span className="bracket text-2xl md:text-4xl font-extralight opacity-30">[</span>
                            <span className="prestige-text font-medium text-4xl md:text-6xl tracking-[0.2em] text-white/90">
                                SUA ORIGEM
                            </span>
                            <span className="bracket text-2xl md:text-4xl font-extralight opacity-30">]</span>
                        </div>

                        <div className="phrase-2 absolute inset-0 flex items-center justify-center opacity-0">
                            <span className="bracket text-2xl md:text-4xl font-thin opacity-30">[</span>
                            <span className="prestige-text font-extralight italic text-4xl md:text-6xl tracking-[0.25em] text-white">
                                SEU SORRISO
                            </span>
                            <span className="bracket text-2xl md:text-4xl font-thin opacity-30">]</span>
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
