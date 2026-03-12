// Updated: 2026-03-10 - Beautiful Scroll Hero with linda vc frames
"use client";

import { useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
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
            const dpr = Math.min(window.devicePixelRatio || 1, 3);

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            const img = imagesRef.current[0] || new Image();
            const imgWidth = img.width || 1920;
            const imgHeight = img.height || 1080;

            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";

            const isMobile = window.innerWidth <= 768;
            const ratio = Math.max(canvas.width / imgWidth, canvas.height / imgHeight);

            const newWidth = imgWidth * ratio;
            const newHeight = imgHeight * ratio;

            const mobileYOffset = isMobile ? -(canvas.height * 0.20) : 0; // sobe a imagem 20% da altura do canvas no mobile para garantir o rosto/foco no lugar

            layoutRef.current = {
                width: newWidth * 1.02, // Tighter scale for performance and crispness
                height: newHeight * 1.02,
                x: (canvas.width - newWidth * 1.02) / 2,
                y: (canvas.height - newHeight * 1.02) / 2 + mobileYOffset
            };

            render();
        };

        window.addEventListener("resize", updateSize);
        updateSize();
        preloadImages();

        // 1. Intro Animation Sequence
        const introTl = gsap.timeline({
            paused: true,
            onComplete: () => {
                initScrollEffects();
            }
        });

        const initScrollEffects = () => {
            // Avoid double initialization
            if (ScrollTrigger.getById("heroScroll")) return;

            const ctx = gsap.context(() => {
                const masterTl = gsap.timeline({
                    id: "heroScroll",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "+=200%",
                        pin: true,
                        scrub: 0.5,
                        anticipatePin: 1
                    }
                });

                // Frame Animation - Continues from the end of intro (~90)
                masterTl.fromTo(playheadRef.current, 
                    { frame: 90 },
                    {
                        frame: FRAME_COUNT - 1,
                        snap: "frame",
                        ease: "none",
                        duration: 1.5,
                        onUpdate: render,
                    }, 0);

                /* masterTl.fromTo(".hero-metrics", 
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
                0.3); */

                // Metric Counter Animations - Moved to Stats.tsx
                /* const counters = sectionRef.current?.querySelectorAll(".hero-counter-value");
                counters?.forEach((counter, idx) => {
                    const targetValue = parseFloat(counter.getAttribute("data-target") || "0");
                    const isFloat = counter.getAttribute("data-float") === "true";
                    
                    const obj = { value: 0 };
                    masterTl.to(obj, {
                        value: targetValue,
                        duration: 1.8,
                        ease: "power4.out",
                        onUpdate: () => {
                            if (counter) {
                                counter.innerHTML = isFloat 
                                    ? obj.value.toFixed(1).replace(".", ",") 
                                    : Math.floor(obj.value).toLocaleString("pt-BR");
                            }
                        }
                    }, 0.5 + (idx * 0.15)); // Staggered count-up
                }); */

                // Container Scale
                if (window.innerWidth > 768) {
                    masterTl.to(containerRef.current, {
                        scale: 1.25,
                        ease: "none",
                        duration: 2
                    }, 0);
                }

                // Text Narrative logic - Handled by introTl mostly, but sync for backward scroll if needed
                // Currently phrase-2 is visible at end of intro.
            }, sectionRef);
        };

        // Define Intro Tweens - The Cinematic Transformation
        introTl.to(playheadRef.current, {
            frame: 90, // Played automatically to set the stage
            duration: 4.5, // Cinematic duration
            ease: "power2.inOut",
            onUpdate: render
        }, 0);
 
        introTl.fromTo(textContainerRef.current, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, 
        0.5);

        // Phrase 1 to 2 transition during intro
        introTl.to(".phrase-1", {
            opacity: 0,
            filter: "blur(15px)",
            scale: 0.85,
            y: -15,
            duration: 1.2,
            ease: "power2.inOut"
        }, 1.8);

        introTl.fromTo(".phrase-2", {
            opacity: 0,
            filter: "blur(15px)",
            scale: 1.15,
            y: 15
        }, {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out"
        }, 2.4);
 
        // Animate metrics and button
        introTl.fromTo(".hero-metrics-subtle",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
        3.2);
 
        introTl.fromTo(".hero-btn-wrapper",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
        3.5);

        // Handle Scroll Handover (Interruption)
        const handleInterrupt = () => {
            if (introTl.isActive()) {
                introTl.kill();
                // Jump to intro handover state for consistency
                playheadRef.current.frame = 90;
                gsap.set(textContainerRef.current, { opacity: 1, y: 0 });
                gsap.set(".phrase-1", { opacity: 0, filter: "blur(15px)", y: -15, scale: 0.85 });
                gsap.set(".phrase-2", { opacity: 1, filter: "blur(0px)", y: 0, scale: 1 });
                gsap.set(".hero-metrics-subtle", { opacity: 1, y: 0 });
                gsap.set(".hero-btn-wrapper", { opacity: 1, y: 0 });
                render();
                initScrollEffects();
            }
            window.removeEventListener("wheel", handleInterrupt);
            window.removeEventListener("touchstart", handleInterrupt);
        };

        window.addEventListener("wheel", handleInterrupt);
        window.addEventListener("touchstart", handleInterrupt);

        // Start Intro when first frame is ready
        let introTimeout: NodeJS.Timeout;
        const startSequence = () => {
            if (imagesRef.current[0]?.complete) {
                introTl.play();
            } else {
                introTimeout = setTimeout(startSequence, 100);
            }
        };

        startSequence();

        return () => {
            introTl.kill();
            if (introTimeout) clearTimeout(introTimeout);
            window.removeEventListener("wheel", handleInterrupt);
            window.removeEventListener("touchstart", handleInterrupt);
            window.removeEventListener("resize", updateSize);
            ScrollTrigger.getById("heroScroll")?.kill();
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <section ref={sectionRef} className="hero relative overflow-hidden bg-black min-h-[90vh]">
            <style>{`
                .hero {
                    position: relative;
                    width: 100%;
                    height: 100vh; /* Changed back to 100vh for full immersion */
                    min-height: -webkit-fill-available;
                    background: #000;
                    padding: 0 !important;
                }

                @media (min-width: 1024px) {
                    .hero-container {
                        display: flex;
                        align-items: flex-start;
                        width: 100%;
                        height: 100%;
                        padding-left: 8vw;
                        padding-top: 22vh; /* Content sitting higher with more breathing room from Navbar */
                        position: relative;
                    }
                    .hero-text {
                        width: 50%;
                        max-width: 600px;
                        z-index: 20;
                        text-align: left !important;
                        padding-top: 2vh;
                    }
                    .phrase-2 {
                        margin-left: 30px; /* Artistic Offset for the main line */
                    }
                    .hero-visual {
                        position: absolute;
                        inset: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 0;
                    }
                    .hero-overlay {
                        background: radial-gradient(
                            circle at 20% 50%,
                            rgba(0,0,0,0.4) 0%,
                            rgba(0,0,0,0.2) 40%,
                            rgba(0,0,0,0.6) 100%
                        );
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
                        padding-top: 12vh;
                        position: relative;
                    }
                    .hero-text {
                        z-index: 20;
                        text-align: center;
                        width: 100%;
                        padding: 0 6vw;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .phrase-1 {
                        position: relative !important;
                        top: auto !important;
                        left: auto !important;
                        transform: none !important;
                        width: 100%;
                        margin-bottom: 8px; /* Slightly tighter */
                    }
                    .phrase-2 {
                        position: relative !important;
                        top: auto !important;
                        left: auto !important;
                        transform: none !important;
                        width: 100%;
                    }
                    .hero-metrics-subtle {
                        justify-content: center;
                        margin-top: 40px;
                    }
                    .hero-btn-wrapper {
                        position: relative !important;
                        top: auto !important;
                        left: auto !important;
                        transform: none !important;
                        margin-top: 32px !important;
                        z-index: 30;
                    }
                    .hero-visual {
                        width: 100%;
                        height: 100%;
                    }
                    .hero-overlay {
                        background: linear-gradient(
                            rgba(0,0,0,0.6),
                            rgba(0,0,0,0.3),
                            rgba(0,0,0,0.7)
                        );
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
                        height: auto;
                        min-height: 100vh;
                        padding-bottom: 60px !important;
                    }
                }

                /* Film Grain Texture */
                .film-grain {
                    position: absolute;
                    inset: -100% -100% -100% -100%;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    opacity: 0.04;
                    pointer-events: none;
                    z-index: 5;
                    animation: noise 0.2s infinite;
                    will-change: transform;
                }

                @keyframes noise {
                    0% { transform: translate(0, 0); }
                    10% { transform: translate(-5%, -5%); }
                    20% { transform: translate(-10%, 5%); }
                    30% { transform: translate(5%, -10%); }
                    40% { transform: translate(-5%, 15%); }
                    50% { transform: translate(-10%, 5%); }
                    60% { transform: translate(15%, 0); }
                    70% { transform: translate(0, 10%); }
                    80% { transform: translate(-15%, 0); }
                    90% { transform: translate(10%, 5%); }
                    100% { transform: translate(5%, 0); }
                }
            `}</style>

            <div className="hero-container relative z-10 w-full h-full">
                {/* Film Grain Layer */}
                <div className="film-grain" aria-hidden="true" />
                
                {/* Atmospheric Bokeh Particles */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                        <m.div
                            key={i}
                            className="absolute rounded-full bg-[#E6D3A3]/5 blur-[60px]"
                            style={{
                                width: Math.random() * 300 + 200 + 'px',
                                height: Math.random() * 300 + 200 + 'px',
                                left: Math.random() * 100 + '%',
                                top: Math.random() * 100 + '%',
                            }}
                            animate={{
                                x: [0, Math.random() * 100 - 50, 0],
                                y: [0, Math.random() * 100 - 50, 0],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: Math.random() * 10 + 15,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
                {/* Text Column */}
                <div ref={textContainerRef} className="hero-text opacity-0" aria-hidden="false">
                    <div className="phrase-1">
                        <h1 className="text-white/60 font-medium tracking-[0.6em] uppercase" style={{ 
                            fontFamily: 'var(--font-body), sans-serif',
                            fontSize: '12px', 
                            lineHeight: '1.2'
                        }}>
                            Sua origem
                        </h1>
                    </div>
                    
                    <div className="phrase-2 mt-4">
                        <h2 className="text-[#E6D3A3] font-bold tracking-[-0.02em]" style={{ 
                            fontFamily: '"Playfair Display", serif',
                            fontSize: 'clamp(48px, 10vw, 82px)', 
                            lineHeight: '0.9'
                        }}>
                            Seu sorriso
                        </h2>
                    </div>

                    <div className="hero-metrics-subtle mt-10 md:mt-12 opacity-0 flex flex-wrap gap-x-8 gap-y-4">
                        {[
                            { value: "785+", label: "Transformações" },
                            { value: "12+ Anos", label: "Experiência" },
                            { value: "4.9★", label: "Google Business" }
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

                    <div className="hero-btn-wrapper mt-10 opacity-0 group">
                        <button className="btn-luxury-primary relative overflow-hidden">
                            <span className="relative z-10 text-white tracking-[0.2em] font-medium">AGENDAR EXPERIÊNCIA</span>
                        </button>
                    </div>
                </div>

                {/* Full-Screen Visual Background */}
                <div ref={containerRef} className="hero-visual absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
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
