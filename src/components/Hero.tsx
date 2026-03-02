"use client";

import { m, useScroll, useTransform, useReducedMotion, AnimatePresence, useVelocity } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AmbientParticles } from "./AmbientParticles";
import { Magnetic } from "./Magnetic";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 192;

const FrameSequence = ({ videoLoaded, setVideoLoaded, start, isMobile }: { videoLoaded: boolean, setVideoLoaded: (v: boolean) => void, start: boolean, isMobile: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const framesRef = useRef<HTMLImageElement[]>([]);
    const frameIndexRef = useRef({ frame: 0 }); // Use an object for GSAP proxy
    const isInteractedRef = useRef(false);
    const autoHintTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Preload images
    useEffect(() => {
        const imageElements: HTMLImageElement[] = new Array(TOTAL_FRAMES);
        let loadedCount = 0;
        let isCancelled = false;

        const loadFrame = (i: number): Promise<void> => {
            return new Promise<void>((resolve) => {
                const img = new Image();
                img.onload = () => {
                    if (isCancelled) return;
                    imageElements[i] = img;
                    loadedCount++;
                    resolve();
                };
                img.onerror = () => {
                    if (isCancelled) return;
                    loadedCount++; // Ignore errors to prevent infinite hang
                    resolve();
                };
                // Format name like: frame_000_delay-0.041s.png
                const paddedIndex = i.toString().padStart(3, '0');
                img.src = `/para_vc/frame_${paddedIndex}_delay-0.041s.png`;
            });
        };

        const loadPromises = Array.from({ length: TOTAL_FRAMES }, (_, i) => loadFrame(i));

        // Create a safety timeout promise
        const timeoutPromise = new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve(); // Force resolve after 8 seconds max
            }, 8000);
        });

        Promise.race([Promise.all(loadPromises), timeoutPromise]).then(() => {
            if (isCancelled) return;
            framesRef.current = imageElements;
            setVideoLoaded(true);
            if (typeof window !== "undefined") {
                (window as any).__HERO_ASSETS_LOADED__ = true;
                window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
            }
        });

        // Cleanup
        return () => {
            isCancelled = true;
            framesRef.current = [];
        };
    }, [setVideoLoaded]);

    const drawFrame = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d', { alpha: false });
        // Make sure we clamp to int, and don't go out of bounds
        const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(frameIndexRef.current.frame)));
        const img = framesRef.current[idx];

        if (canvas && ctx && img && img.complete) {
            // Respect Device Pixel Ratio
            const dpr = window.devicePixelRatio || 1;
            const displayWidth = canvas.clientWidth;
            const displayHeight = canvas.clientHeight;

            // Set actual size in memory (scaled for retina)
            if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
                canvas.width = displayWidth * dpr;
                canvas.height = displayHeight * dpr;
                ctx.scale(dpr, dpr);
            }

            // Fill bg
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, displayWidth, displayHeight);

            const canvasAspect = displayWidth / displayHeight;
            const imgAspect = img.naturalWidth / img.naturalHeight;

            let drawWidth, drawHeight, offsetX, offsetY;

            // "contain" equivalent drawing logic
            if (canvasAspect > imgAspect) {
                // Canvas is wider than image (fit to height)
                drawHeight = displayHeight;
                drawWidth = displayHeight * imgAspect;
                offsetX = (displayWidth - drawWidth) / 2;
                offsetY = 0;
            } else {
                // Image is wider than canvas (fit to width)
                drawWidth = displayWidth;
                drawHeight = displayWidth / imgAspect;
                offsetX = 0;
                offsetY = (displayHeight - drawHeight) / 2;
            }

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
    }, []);

    // Initial render and resize handling
    useEffect(() => {
        if (!videoLoaded || !start) return;

        let resizeTimer: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(drawFrame, 50); // Debounce
        };

        window.addEventListener('resize', handleResize);

        // Initial Draw
        drawFrame();

        // 3. Auto-hint functionality
        autoHintTimerRef.current = setTimeout(() => {
            if (!isInteractedRef.current && framesRef.current.length > 0) {
                gsap.to(frameIndexRef.current, {
                    frame: Math.min(40, TOTAL_FRAMES - 1),
                    duration: 1.5,
                    ease: "power2.inOut",
                    yoyo: true,
                    repeat: 1,
                    onUpdate: drawFrame
                });
            }
        }, 3000);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (autoHintTimerRef.current) clearTimeout(autoHintTimerRef.current);
            gsap.killTweensOf(frameIndexRef.current);
        };
    }, [videoLoaded, start, drawFrame]);

    // Handle Input Interaction
    const handleMove = (clientX: number) => {
        if (!videoLoaded || !start || !containerRef.current) return;

        isInteractedRef.current = true;
        if (autoHintTimerRef.current) {
            clearTimeout(autoHintTimerRef.current);
            autoHintTimerRef.current = null;
        }

        const rect = containerRef.current.getBoundingClientRect();
        // Calculate progress (0 to 1)
        let progress = (clientX - rect.left) / rect.width;
        progress = Math.max(0, Math.min(1, progress));

        const targetFrame = Math.round(progress * (TOTAL_FRAMES - 1));

        gsap.to(frameIndexRef.current, {
            frame: targetFrame,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
            onUpdate: drawFrame
        });
    };

    const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: React.TouchEvent) => {
        // Prevent default scrolling occasionally, but standard passive scroll is better UX. 
        // We will just listen.
        handleMove(e.touches[0].clientX);
    };

    return (
        <m.div
            ref={containerRef}
            initial={{ scale: 1.15 }}
            animate={(videoLoaded && start) ? { scale: 1 } : { scale: 1.15 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className={`w-full h-full relative cursor-ew-resize transition-opacity duration-1500 ${(start) ? 'opacity-100 lg:opacity-60' : 'opacity-0'}`}
            onMouseMove={onMouseMove}
            onTouchMove={onTouchMove}
            style={{ touchAction: 'pan-y' }} // Allow vertical scroll but disable horizontal swipe back
        >
            {!videoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 rounded-full border-t-2 border-b-2 border-[#C7A86B] animate-spin" />
                        <span className="text-white/60 text-sm tracking-widest uppercase font-bold">Carregando Modelo 3D</span>
                    </div>
                </div>
            )}
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full object-contain ${!videoLoaded ? 'opacity-0' : 'opacity-100'}`}
                style={{
                    filter: isMobile ? 'brightness(0.5) contrast(1.05) saturate(1.02)' : 'brightness(0.34) contrast(1.02) saturate(0.95)',
                    transition: 'filter 400ms ease, opacity 800ms ease'
                }}
            />
        </m.div>
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
    const heroVideoRef = useRef<HTMLVideoElement | null>(null);

    const [mounted, setMounted] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [canStartSequence, setCanStartSequence] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const { scrollY } = useScroll();
    const videoY = useTransform(scrollY, [0, 600], [0, -140]);
    const videoScale = useTransform(scrollY, [0, 600], [1, 1.08]);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);

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

    // FrameSequence handles its own asset loading and preloader signaling.
    // The previous video-based aggressive autoplay polling is no longer needed.

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

            // 1. Background Layer Parallax (Disabled GSAP in favor of framer-motion)
            // scrollTl.to(videoWrapperRef.current, {
            //     yPercent: isMobile ? 6 : 4,
            //     ease: "none"
            // }, 0);

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
                <m.div
                    className="absolute inset-0 z-0 overflow-hidden"
                    style={{ y: videoY, scale: videoScale }}
                >
                    <div
                        ref={videoWrapperRef}
                        className="absolute inset-0 z-0 origin-center will-change-transform"
                        style={{
                            transform: 'scale(1.02)',
                            transition: 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)'
                        }}
                    >
                        {/* Radial Vignette Overlay */}
                        <div
                            className="absolute inset-0 z-[12] pointer-events-none transition-opacity duration-1500 hidden lg:block"
                            style={{
                                background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)'
                            }}
                        />

                        {/* Dark Base Overlay for contrast */}
                        <div
                            className="absolute inset-0 z-[9] pointer-events-none hidden lg:block"
                            style={{ background: 'rgba(0,0,0,0.40)' }}
                        />

                        {/* Refined Cinematic Overlay Gradient */}
                        <div
                            className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-1500 hidden lg:block"
                            style={{
                                background: 'linear-gradient(90deg, rgba(11,11,11,0.52) 0%, rgba(11,11,11,0.30) 55%, rgba(11,11,11,0.18) 100%)'
                            }}
                        />

                        {/* Dark Overlay (Animated on Scroll) */}
                        <div
                            ref={overlayDarkRef}
                            className="overlay-dark absolute inset-0 z-[11] bg-black/0 pointer-events-none hidden lg:block"
                            style={{ opacity: 0 }}
                        />

                        {/* Bottom Cinematic Fade Transition */}
                        <div className="bottom-cinematic-fade absolute bottom-0 left-0 w-full h-1/3 z-[12] bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none opacity-0 hidden lg:block" />

                        <div className="absolute inset-0 z-[10] bg-black/5 pointer-events-none lg:hidden" />

                        <FrameSequence
                            videoLoaded={videoLoaded}
                            setVideoLoaded={setVideoLoaded}
                            start={canStartSequence}
                            isMobile={isMobile}
                        />
                    </div>
                </m.div>

                {/* Ambient Particles (Disabled for cleaner look) */}
                {/* {!shouldReduceMotion && <AmbientParticles />} */}

                {/* Main Content */}
                <div
                    ref={contentWrapperRef}
                    className="relative z-[50] w-full flex flex-col items-center lg:items-start text-center lg:text-left pointer-events-none"
                    style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '120px 24px 100px' : '160px 6vw 140px', width: '100%', position: 'absolute', inset: 0, justifyContent: 'center' }}
                >
                    <div className="max-w-[90vw] lg:max-w-[850px] perspective-1000 w-full flex flex-col items-center lg:items-start relative">
                        <m.h1
                            ref={titleRef}
                            initial={{ opacity: 0, y: 50, filter: "blur(14px)" }}
                            animate={(mounted && videoLoaded && canStartSequence) ? {
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)"
                            } : {
                                opacity: 0,
                                y: 50,
                                filter: "blur(14px)"
                            }}
                            transition={{
                                duration: 2.5,
                                ease: [0.16, 1, 0.3, 1],
                                delay: isMobile ? 1.5 : 4.5
                            }}
                            className="font-editorial text-[28px] md:text-[36px] lg:text-[77px] text-[var(--color-creme)] will-change-transform perspective-2000" style={{ lineHeight: isMobile ? 1.15 : 1.1, marginBottom: isMobile ? 52 : 40 }}
                        >
                            <span className="block mb-1 lg:mb-2 font-bold font-editorial">Seu sorriso,</span>
                            <span className="block italic font-normal text-[var(--color-creme)]">sua assinatura.</span>
                        </m.h1>

                        <div className="overflow-hidden mb-0 lg:mb-10 w-full lg:pl-1 mt-4 lg:mt-5">
                            <m.p
                                ref={descriptionRef}
                                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                                animate={(mounted && videoLoaded && canStartSequence) ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(6px)" }}
                                transition={{ delay: isMobile ? 1.2 : 4.0, duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                                className="text-[16px] lg:text-[18px] font-semibold lg:font-normal text-center lg:text-left text-white/90"
                            >
                                A harmonia perfeita entre ciência avançada e estética de <span className="italic font-editorial text-[var(--color-silver-bh)]">alta costura</span>.
                            </m.p>
                        </div>


                        <div ref={actionsRef} className="hero-ctas relative z-[60] py-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start w-full px-5 lg:px-0 sm:w-auto mt-[24px] lg:mt-9 pointer-events-auto" style={{ gap: isMobile ? 16 : 20 }}>
                            <Magnetic strength={isMobile ? 0 : 0.3} range={100} className={isMobile ? "w-full" : ""}>
                                <m.button
                                    onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                                    animate={(mounted && canStartSequence) ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
                                    transition={{ delay: isMobile ? 0.6 : 4.5, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                    whileHover={!isMobile ? { y: -5, scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" } : {}}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', padding: '16px 32px', minHeight: isMobile ? 56 : 52, fontSize: isMobile ? 16 : 18, width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? 420 : 'none' }}
                                    className="group relative flex items-center justify-center gap-3 bg-[#F5F5DC] text-[#0A0A0A] rounded-full font-bold shadow-xl lg:shadow-2xl overflow-hidden focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#C7A86B]/40 focus-visible:outline-offset-[3px] border border-transparent hover:border-[#F5F5DC] hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.6)] transition-all duration-500"
                                >
                                    {/* Shimmer Effect */}
                                    <m.div
                                        className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "200%" }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 3,
                                            ease: "easeInOut",
                                            delay: isMobile ? 2 : 7.5
                                        }}
                                    />
                                    <span className="relative z-10 flex items-center gap-3 tracking-normal font-bold" style={{ fontSize: 'inherit' }}>
                                        Agendar Consulta
                                    </span>
                                </m.button>
                            </Magnetic>

                            <Magnetic strength={isMobile ? 0 : 0.3} range={100} className={isMobile ? "w-full" : ""}>
                                <m.button
                                    onClick={() => document.getElementById('casos')?.scrollIntoView({ behavior: 'smooth' })}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={(mounted && canStartSequence) ? { opacity: 0.85, y: 0 } : { opacity: 0, y: 10 }}
                                    transition={{ delay: isMobile ? 0.9 : 4.7, duration: 1.5 }}
                                    whileHover={!isMobile ? { y: -3, scale: 1.01, opacity: 1 } : {}}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.95)', padding: '16px 32px', minHeight: isMobile ? 56 : 52, fontSize: isMobile ? 16 : 18, width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? 420 : 'none' }}
                                    className="group flex items-center justify-center gap-3 rounded-full backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/30 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#C7A86B]/40 focus-visible:outline-offset-[3px]"
                                >
                                    <span className="tracking-normal font-semibold" style={{ fontSize: 'inherit' }}>Galeria de Resultados</span>
                                </m.button>
                            </Magnetic>
                        </div>
                    </div>
                </div>

                {/* Atmospheric Glows (Disabled for cleaner look) */}
                {/* <div className="absolute top-[-10%] left-[-10%] w-[80%] lg:w-[50%] h-[50%] glow-blob-warm opacity-15 pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[70%] lg:w-[40%] h-[40%] glow-blob opacity-10 pointer-events-none" /> */}

                {/* Cinematic Progress Line (Desktop) (Disabled for cleaner look) */}
                {/* {!isMobile && (
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 h-32 w-[1px] bg-white/10 overflow-hidden z-50">
                        <div
                            ref={progressLineRef}
                            className="absolute top-0 left-0 w-full h-full bg-[var(--color-silver-bh)] origin-top scale-y-0"
                        />
                    </div>
                )} */}

                <m.div
                    ref={scrollHintRef}
                    initial={{ opacity: 0, x: "-50%" }}
                    animate={{ opacity: 0.6, x: "-50%" }}
                    transition={{ delay: isMobile ? 2.5 : 5, duration: 1.5 }}
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

