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
        // Preload frames as Image objects
        let loadedCount = 0;
        const imageElements: HTMLImageElement[] = [];
        const INITIAL_BATCH = 20; // Show hero after these many frames load

        for (let i = 0; i < TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = `/assets/hero-frames/frame-${i}.gif`;
            img.onload = () => {
                loadedCount++;
                // Show hero immediately after a small batch for better LCP
                if (loadedCount === INITIAL_BATCH) {
                    setVideoLoaded(true);
                }
            };
            imageElements[i] = img;
        }
        framesRef.current = imageElements;

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
        <div className={`w-full h-full relative transition-opacity duration-1000 ${videoLoaded ? 'opacity-90 lg:opacity-70' : 'opacity-0'}`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.5] lg:brightness-[0.8] saturate-[0.8] lg:saturate-100 will-change-transform"
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

            // Match preloader timeout (2200ms) + exit animation (400ms)
            const timer = setTimeout(() => {
                setCanStartSequence(true);
            }, 2600);

            return () => {
                window.removeEventListener("resize", checkMobile);
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
            if (!shouldReduceMotion) {
                // Unified Scroll Timeline (Desktop & Mobile Parallax)
                const scrollTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: isMobile ? "bottom top" : "+=600",
                        pin: !isMobile ? pinContainerRef.current : false,
                        scrub: 1.2, // Smooth scrubbing
                        anticipatePin: 1
                    }
                });

                // Enhanced Parallax ("Paradex") Effect
                scrollTl.to(videoWrapperRef.current, {
                    yPercent: isMobile ? 30 : 25,
                    scale: 1.15,
                    filter: "blur(4px)", // Cinematic depth blur on exit
                    ease: "none"
                }, 0);

                if (!isMobile) {
                    scrollTl.to(titleRef.current, {
                        scale: 0.94,
                        opacity: 0,
                        y: -100,
                        filter: "blur(15px)",
                        ease: "power2.in"
                    }, 0);

                    scrollTl.to(progressLineRef.current, {
                        scaleY: 1,
                        ease: "none"
                    }, 0);

                    scrollTl.to(contentWrapperRef.current, {
                        opacity: 0,
                        y: -50,
                        filter: "blur(8px)",
                        ease: "none"
                    }, 0);

                    gsap.to(scrollHintRef.current, {
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top top",
                            end: "top -50px",
                            scrub: true
                        },
                        opacity: 0,
                        y: -20
                    });
                } else {
                    // Optimized Mobile Transitions
                    scrollTl.to([titleRef.current, descriptionRef.current], {
                        opacity: 0,
                        y: -40,
                        filter: "blur(10px)",
                        ease: "power2.inOut",
                        stagger: 0.05
                    }, 0);

                    scrollTl.to(actionsRef.current, {
                        opacity: 0,
                        scale: 0.95,
                        y: -20,
                        ease: "power1.inOut"
                    }, 0.1);
                }

                // Dark Overlay
                gsap.to(overlayDarkRef.current, {
                    opacity: 0.8,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top center",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }
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
                >
                    {/* Gradient Overlay for Mobile Contrast */}
                    <div
                        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-1000 bg-gradient-to-b from-black/50 via-black/35 to-black/65 lg:hidden"
                    />

                    {/* Radial Spotlight Overlay (Desktop) */}
                    <div
                        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-1000 hidden lg:block"
                        style={{
                            background: 'linear-gradient(to right, black, rgba(0,0,0,0.2), transparent)'
                        }}
                    />

                    {/* Dark Overlay (Animated on Scroll) */}
                    <div
                        ref={overlayDarkRef}
                        className="overlay-dark absolute inset-0 z-[11] bg-black/0 pointer-events-none"
                        style={{ opacity: 0 }}
                    />

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
                    className="relative z-[50] container mx-auto px-6 h-full flex flex-col justify-center items-center lg:items-start pt-32 lg:pt-40 pb-16 lg:pb-0 text-center lg:text-left"
                >
                    <div className="max-w-[850px] lg:max-w-none perspective-1000 w-full flex flex-col items-center lg:items-start">
                        <m.div
                            initial="hidden"
                            animate={mounted ? "visible" : "hidden"}
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.12,
                                        delayChildren: 2.8 // Ensures preloader is fully clear
                                    }
                                }
                            }}
                            className="mb-4 lg:mb-10 w-full"
                        >
                            <h1 ref={titleRef} className="font-medium text-[#FAF9F7] tracking-tight will-change-transform perspective-2000">
                                <span className="block mb-0 lg:mb-4 overflow-hidden pb-4">
                                    <m.span
                                        variants={{
                                            hidden: {
                                                y: "150%",
                                                rotateX: -90,
                                                opacity: 0,
                                                filter: "blur(25px)",
                                                scale: 1.2,
                                                letterSpacing: "0.2em"
                                            },
                                            visible: {
                                                y: "0%",
                                                rotateX: 0,
                                                opacity: 1,
                                                filter: "blur(0px)",
                                                scale: 1,
                                                letterSpacing: "normal",
                                                transition: {
                                                    duration: 1.8,
                                                    ease: [0.16, 1, 0.3, 1],
                                                    filter: { duration: 1.2 }
                                                }
                                            }
                                        }}
                                        className="inline-block text-[clamp(32px,8vw,48px)] lg:text-[clamp(2.5rem,9vw,6.5rem)] leading-[1] lg:leading-[1.1] origin-bottom will-change-transform"
                                    >
                                        Seu sorriso,
                                    </m.span>
                                </span>
                                <span className="block overflow-hidden pb-4">
                                    <m.span
                                        variants={{
                                            hidden: {
                                                y: "150%",
                                                rotateX: -90,
                                                opacity: 0,
                                                filter: "blur(25px)",
                                                scale: 1.2,
                                                letterSpacing: "0.2em"
                                            },
                                            visible: {
                                                y: "0%",
                                                rotateX: 0,
                                                opacity: 1,
                                                filter: "blur(0px)",
                                                scale: 1,
                                                letterSpacing: "normal",
                                                transition: {
                                                    duration: 1.8,
                                                    ease: [0.16, 1, 0.3, 1],
                                                    filter: { duration: 1.2 }
                                                }
                                            }
                                        }}
                                        className={`inline-block ${isMobile ? 'font-playfair italic font-light' : 'italic font-light'} text-[var(--color-silver-bh)] text-[clamp(32px,8vw,48px)] lg:text-[clamp(2.5rem,9vw,6.5rem)] leading-[1] lg:leading-[1.1] origin-bottom will-change-transform`}
                                    >
                                        sua assinatura.
                                    </m.span>
                                </span>
                            </h1>
                        </m.div>

                        <div className="overflow-hidden mb-6 lg:mb-14 w-full">
                            <m.p
                                ref={descriptionRef}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className="text-white/90 lg:text-white/80 max-w-[90%] lg:max-w-[55ch] mx-auto lg:mx-0 text-[clamp(14px,3.2vw,18px)] lg:text-[1.75rem] leading-relaxed opacity-90"
                            >
                                A harmonia perfeita entre ciência avançada e estética de alta costura.
                            </m.p>
                        </div>


                        <div ref={actionsRef} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 w-full sm:w-auto mt-2 lg:mt-0">
                            <Magnetic strength={isMobile ? 0 : 0.3} range={100}>
                                <m.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                    whileHover={!isMobile ? { y: -5, scale: 1.02 } : {}}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative flex items-center justify-center gap-4 px-6 lg:px-10 w-full max-w-[280px] sm:max-w-none sm:w-auto py-3 lg:py-6 bg-[#FAF9F7] text-[#0B0B0B] rounded-full font-bold shadow-md lg:shadow-2xl overflow-hidden focus:outline-white"
                                >
                                    {/* Shimmer Effect */}
                                    <m.div
                                        className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "200%" }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2.5,
                                            ease: "easeInOut",
                                            delay: 1
                                        }}
                                    />
                                    <span className="relative z-10 flex items-center gap-4 text-[11px] sm:text-xs tracking-[0.3em]">
                                        AGENDAR CONSULTA
                                    </span>
                                </m.button>
                            </Magnetic>

                            <Magnetic strength={isMobile ? 0 : 0.3} range={100}>
                                <m.button
                                    onClick={() => logEvent('cta_ver_casos_click')}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                    whileHover={!isMobile ? { y: -5, scale: 1.02 } : {}}
                                    whileTap={{ scale: 0.95 }}
                                    className="group flex items-center justify-center gap-4 px-6 lg:px-10 w-full max-w-[280px] sm:max-w-none sm:w-auto py-3 lg:py-6 bg-transparent border border-white/20 text-white/80 rounded-full backdrop-blur-sm transition-all hover:bg-white/5"
                                >
                                    <span className="text-[11px] sm:text-xs tracking-[0.2em] font-medium uppercase">Galeria de Resultados</span>
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

                {/* Scroll Hint (Desktop Only) */}
                <div
                    ref={scrollHintRef}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 hidden lg:flex flex-col items-center gap-3 opacity-0 animate-fade-in-up"
                    style={{ animationDelay: '3s', animationFillMode: 'forwards' }}
                >
                    <span className="text-[var(--color-silver-bh)] text-[10px] font-bold uppercase tracking-[0.4em]">Scroll</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--color-silver-bh)] to-transparent" />
                </div>
            </div>
        </section >
    );
}

