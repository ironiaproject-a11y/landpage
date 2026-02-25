"use client";

import { m, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AmbientParticles } from "./AmbientParticles";
import { Magnetic } from "./Magnetic";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 192;

const FrameSequence = ({ videoLoaded, setVideoLoaded, start }: { videoLoaded: boolean, setVideoLoaded: (v: boolean) => void, start: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const framesRef = useRef<HTMLImageElement[]>([]);
    const frameIndexRef = useRef(0);

    useEffect(() => {
        const imageElements: HTMLImageElement[] = new Array(TOTAL_FRAMES);
        const CRITICAL_BATCH = 30;
        const REMAINING_BATCH_SIZE = 20;
        let criticalLoaded = 0;

        // Load a single frame (returns a promise)
        const loadFrame = (i: number): Promise<void> => {
            return new Promise<void>((resolve) => {
                const img = new Image();
                img.onload = () => {
                    imageElements[i] = img;
                    resolve();
                };
                img.onerror = () => resolve(); // Don't block on error
                img.src = `/assets/hero-frames/frame-${i}.gif`;
            });
        };

        // Phase 1: Load critical frames (0–29) immediately
        const criticalPromises = Array.from({ length: CRITICAL_BATCH }, (_, i) =>
            loadFrame(i).then(() => {
                criticalLoaded++;
                if (criticalLoaded === CRITICAL_BATCH) {
                    framesRef.current = imageElements;
                    setVideoLoaded(true);
                    if (typeof window !== "undefined") {
                        (window as any).__HERO_ASSETS_LOADED__ = true;
                        window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
                    }
                }
            })
        );

        // Phase 2: Load remaining frames in staggered batches
        const loadRemaining = () => {
            const remaining = TOTAL_FRAMES - CRITICAL_BATCH;
            const batches = Math.ceil(remaining / REMAINING_BATCH_SIZE);
            for (let b = 0; b < batches; b++) {
                const batchDelay = 2000 + b * 500;
                setTimeout(() => {
                    const batchStart = CRITICAL_BATCH + b * REMAINING_BATCH_SIZE;
                    const batchEnd = Math.min(batchStart + REMAINING_BATCH_SIZE, TOTAL_FRAMES);
                    for (let i = batchStart; i < batchEnd; i++) {
                        loadFrame(i).then(() => {
                            framesRef.current = imageElements;
                        });
                    }
                }, batchDelay);
            }
        };

        Promise.all(criticalPromises).then(loadRemaining);

        // Animation loop - Direct Canvas drawing for zero-latency
        let frameId: number;
        let lastTime = 0;
        const fps = 60;
        const interval = 1000 / fps;

        const drawFrame = () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d', { alpha: false });
            const img = framesRef.current[frameIndexRef.current];

            if (canvas && ctx && img && img.complete) {
                // High-performance canvas setup
                const canvasAspect = canvas.width / canvas.height;
                const imgAspect = img.naturalWidth / img.naturalHeight;

                let drawWidth, drawHeight, offsetX, offsetY;

                if (canvasAspect > imgAspect) {
                    drawWidth = canvas.width;
                    drawHeight = canvas.width / imgAspect;
                    offsetX = 0;
                    offsetY = (canvas.height - drawHeight) / 2;
                } else {
                    drawWidth = canvas.height * imgAspect;
                    drawHeight = canvas.height;
                    offsetX = (canvas.width - drawWidth) / 2;
                    offsetY = 0;
                }

                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            }
        };

        const animate = (time: number) => {
            if (time - lastTime >= interval) {
                // ONLY increment if start is true, otherwise draw frame 0
                if (start) {
                    frameIndexRef.current = (frameIndexRef.current + 1) % TOTAL_FRAMES;
                } else {
                    frameIndexRef.current = 0; // Forced human arch start
                }
                drawFrame();
                lastTime = time;
            }
            frameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            if (canvasRef.current) {
                // Cap DPR at 1.5 for performance on mobile devices, or use 2 for desktop
                const isMobileDevice = window.innerWidth < 1024;
                const dpr = Math.min(window.devicePixelRatio || 1, isMobileDevice ? 1.5 : 2);

                canvasRef.current.width = window.innerWidth * dpr;
                canvasRef.current.height = window.innerHeight * dpr;
                drawFrame();
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        frameId = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [setVideoLoaded, start]); // Re-run or update when start changes


    return (
        <div className={`w-full h-full relative transition-opacity duration-1500 ${videoLoaded ? 'opacity-80 lg:opacity-60' : 'opacity-0'}`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover object-center will-change-transform"
                style={{ filter: 'brightness(0.92) contrast(0.96)' }}
            />
        </div>
    );
};

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const pinContainerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);
    const contentWrapperRef = useRef<HTMLDivElement>(null);
    const videoWrapperRef = useRef<HTMLDivElement>(null);
    const progressLineRef = useRef<HTMLDivElement>(null);
    const scrollHintRef = useRef<HTMLDivElement>(null);
    const overlayDarkRef = useRef<HTMLDivElement>(null);

    const [mounted, setMounted] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [canStartSequence, setCanStartSequence] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);

        if (typeof window !== "undefined") {
            checkMobile();
            window.addEventListener("resize", checkMobile);

            // Start sequence when preloader begins to exit
            const handlePreloaderExit = () => {
                setCanStartSequence(true);
            };

            window.addEventListener("preloader-exiting", handlePreloaderExit);

            // Fallback safety
            const timer = setTimeout(() => {
                setCanStartSequence(true);
            }, 5000);

            return () => {
                window.removeEventListener("resize", checkMobile);
                window.removeEventListener("preloader-exiting", handlePreloaderExit);
                clearTimeout(timer);
            };
        }
    }, []);

    // Analytics (Mock)
    const logEvent = (eventName: string, params?: any) => {
        console.log(`[Analytics] ${eventName}`, params);
    };

    // GSAP Scroll & Entrance Animations
    useEffect(() => {
        if (!mounted) return;

        const ctx = gsap.context(() => {
            if (shouldReduceMotion) return;

            // Unified Scroll Timeline (Depth & Atmosphere)
            const scrollTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=100%",
                    pin: !isMobile ? pinContainerRef.current : false,
                    scrub: 1.2,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        if (shouldReduceMotion) return;

                        // Direction-sensitive micro-motion
                        const direction = self.direction; // 1 for down, -1 for up
                        const velocity = self.getVelocity();
                        const intensity = Math.min(Math.abs(velocity) / 2000, 1);

                        gsap.to(videoWrapperRef.current, {
                            x: direction * intensity * (isMobile ? 4 : 8),
                            scale: 1.05 + (intensity * 0.005),
                            rotationZ: direction * intensity * 0.1,
                            duration: 0.8,
                            ease: "power2.out",
                            overwrite: "auto"
                        });
                    }
                }
            });

            // 1. Background Layer Parallax (Restrained 4-6%)
            scrollTl.to(videoWrapperRef.current, {
                yPercent: isMobile ? 6 : 4,
                ease: "none"
            }, 0);

            // 2. Text Block Layer (Depth Separation)
            scrollTl.to(contentWrapperRef.current, {
                y: -30,
                opacity: 0.85,
                ease: "none"
            }, 0);

            // 3. CTA Layer (Scale reduction + Stays visible longer)
            scrollTl.to(actionsRef.current, {
                scale: 0.97,
                opacity: 0.95,
                ease: "none"
            }, 0.1);

            // 4. Darken bottom gradient for transition
            gsap.to(".bottom-cinematic-fade", {
                opacity: 0.9,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom center",
                    scrub: true
                }
            });

            // 5. Scroll Indicator Fade
            gsap.to(scrollHintRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "top -50px",
                    scrub: true
                },
                opacity: 0,
                y: -20,
                ease: "power2.inOut"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted, shouldReduceMotion, isMobile]);

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-[65vh] lg:min-h-screen h-[75vh] lg:h-screen flex flex-col overflow-hidden bg-[#0a0a0a]"
        >
            <div
                ref={pinContainerRef}
                className="relative h-full w-full flex items-center overflow-hidden"
            >
                {/* Background Frame Sequence Layer */}
                <div
                    ref={videoWrapperRef}
                    className="absolute inset-0 z-0 origin-center will-change-transform"
                    style={{
                        transform: `scale(${isMobile ? 0.95 : 0.98})`,
                        transition: 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)'
                    }}
                >
                    {/* Radial Vignette Overlay */}
                    <div
                        className="absolute inset-0 z-[12] pointer-events-none transition-opacity duration-1500"
                        style={{
                            background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)'
                        }}
                    />

                    {/* Refined Cinematic Overlay Gradient */}
                    <div
                        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-1500 backdrop-blur-[4px]"
                        style={{
                            background: 'linear-gradient(180deg, rgba(11,11,11,0.55) 0%, rgba(11,11,11,0.35) 45%, rgba(11,11,11,0.20) 75%, rgba(11,11,11,0.12) 100%)'
                        }}
                    />

                    {/* Dark Overlay (Animated on Scroll) */}
                    <div
                        ref={overlayDarkRef}
                        className="overlay-dark absolute inset-0 z-[11] bg-black/0 pointer-events-none"
                        style={{ opacity: 0 }}
                    />

                    {/* Bottom Cinematic Fade Transition */}
                    <div className="bottom-cinematic-fade absolute bottom-0 left-0 w-full h-1/3 z-[12] bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none opacity-0" />

                    <FrameSequence
                        videoLoaded={videoLoaded}
                        setVideoLoaded={setVideoLoaded}
                        start={canStartSequence}
                    />
                </div>

                {/* Ambient Particles */}
                {!shouldReduceMotion && <AmbientParticles />}

                {/* Main Content */}
                <div
                    ref={contentWrapperRef}
                    className="relative z-[50] container mx-auto px-6 h-full flex flex-col justify-center items-center lg:items-start pt-24 lg:pt-32 pb-16 lg:pb-0 text-center lg:text-left"
                >
                    <div className="max-w-[90vw] lg:max-w-[850px] perspective-1000 w-full flex flex-col items-center lg:items-start relative">
                        <m.h1
                            ref={titleRef}
                            initial={{ opacity: 0, y: 30 }}
                            animate={mounted ? (videoLoaded ? {
                                opacity: 1,
                                y: 0,
                                skewX: 0,
                                rotate: 0
                            } : {
                                opacity: 0.4,
                                y: [0, -5, 0],
                                skewX: [-0.5, 0.5, -0.5],
                                rotate: [-0.2, 0.2, -0.2]
                            }) : { opacity: 0, y: 30 }}
                            transition={videoLoaded ? {
                                duration: 0.8,
                                ease: [0.22, 1, 0.36, 1], // Power3.out equivalent
                                delay: 0.1
                            } : {
                                y: { duration: 4, repeat: Infinity, ease: "sine.inOut" },
                                skewX: { duration: 5, repeat: Infinity, ease: "sine.inOut" },
                                rotate: { duration: 6, repeat: Infinity, ease: "sine.inOut" }
                            }}
                            className="text-hero-editorial will-change-transform perspective-2000"
                        >
                            <span className="block mb-1 lg:mb-2 shine-text">Seu sorriso,</span>
                            <span className="block italic font-light text-[var(--color-silver-bh)] shine-text">sua assinatura.</span>
                        </m.h1>

                        <div className="overflow-hidden mb-8 lg:mb-10 w-full lg:pl-1 mt-4 lg:mt-5">
                            <m.p
                                ref={descriptionRef}
                                initial={{ opacity: 0 }}
                                animate={mounted && videoLoaded ? { opacity: 0.88, y: 0 } : { opacity: 0, y: 15 }}
                                transition={{ delay: 0.25, duration: 0.7, ease: "easeOut" }}
                                className="text-subheadline-editorial text-center lg:text-left shine-text"
                            >
                                A harmonia perfeita entre ciência avançada e estética de <span className="italic font-editorial text-[var(--color-silver-bh)]">alta costura</span>.
                            </m.p>
                        </div>


                        <div ref={actionsRef} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 w-full sm:w-auto mt-7 lg:mt-9">
                            <Magnetic strength={isMobile ? 0 : 0.3} range={100}>
                                <m.button
                                    animate={mounted && videoLoaded ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
                                    transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    whileHover={!isMobile ? { y: -5, scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" } : {}}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative flex items-center justify-center gap-4 px-8 lg:px-12 w-full max-w-[300px] sm:max-w-none sm:w-auto py-4 lg:py-6 bg-[#FAF9F7] text-[#0B0B0B] rounded-full font-bold shadow-xl lg:shadow-2xl overflow-hidden focus:outline-white"
                                >
                                    {/* Shimmer Effect */}
                                    <m.div
                                        className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12"
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "200%" }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 3,
                                            ease: "easeInOut",
                                            delay: 2
                                        }}
                                    />
                                    <span className="relative z-10 flex items-center gap-4 text-[11px] sm:text-xs tracking-[0.4em] font-extrabold">
                                        AGENDAR CONSULTA
                                    </span>
                                </m.button>
                            </Magnetic>

                            <Magnetic strength={isMobile ? 0 : 0.3} range={100}>
                                <m.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={mounted && videoLoaded ? { opacity: 0.85, y: 0 } : { opacity: 0 }}
                                    transition={{ delay: 0.6, duration: 0.6 }}
                                    whileHover={!isMobile ? { y: -3, scale: 1.01, opacity: 1 } : {}}
                                    whileTap={{ scale: 0.98 }}
                                    className="group flex items-center justify-center gap-4 px-8 lg:px-12 w-full max-w-[300px] sm:max-w-none sm:w-auto py-4 lg:py-6 bg-transparent border border-white/10 text-white/60 rounded-full backdrop-blur-md transition-all hover:bg-white/5 hover:border-white/30 hover:text-white"
                                >
                                    <span className="text-[11px] sm:text-xs tracking-[0.3em] font-medium uppercase">Galeria de Resultados</span>
                                </m.button>
                            </Magnetic>
                        </div>
                    </div>
                </div>

                {/* Atmospheric Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[80%] lg:w-[50%] h-[50%] glow-blob-warm opacity-15 pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[70%] lg:w-[40%] h-[40%] glow-blob opacity-10 pointer-events-none" />

                {/* Cinematic Progress Line (Desktop) */}
                {!isMobile && (
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 h-32 w-[1px] bg-white/10 overflow-hidden z-50">
                        <div
                            ref={progressLineRef}
                            className="absolute top-0 left-0 w-full h-full bg-[var(--color-silver-bh)] origin-top scale-y-0"
                        />
                    </div>
                )}

                <m.div
                    ref={scrollHintRef}
                    initial={{ opacity: 0, x: "-50%" }}
                    animate={{ opacity: 0.6, x: "-50%" }}
                    transition={{ delay: 3, duration: 1.5 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-4"
                >
                    <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold">Scroll</span>
                    <div className="relative w-px h-16 overflow-hidden">
                        <div className="absolute inset-0 bg-white/10" />
                        <m.div
                            animate={{
                                y: ["-100%", "100%"]
                            }}
                            transition={{
                                duration: 1.8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-silver-bh)] to-transparent"
                        />
                    </div>
                </m.div>
            </div>
        </section>
    );
}

