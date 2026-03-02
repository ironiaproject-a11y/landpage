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

const FrameSequence = ({ videoLoaded, setVideoLoaded, start, isMobile }: { videoLoaded: boolean, setVideoLoaded: (v: boolean) => void, start: boolean, isMobile: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const framesRef = useRef<HTMLImageElement[]>([]);
    const frameIndexRef = useRef(0);
    const [interactionHappened, setInteractionHappened] = useState(false);

    useEffect(() => {
        const handleInteraction = () => setInteractionHappened(true);
        window.addEventListener('mousemove', handleInteraction, { once: true, passive: true });
        window.addEventListener('touchstart', handleInteraction, { once: true, passive: true });
        return () => {
            window.removeEventListener('mousemove', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        };
    }, []);

    useEffect(() => {
        const imageElements: HTMLImageElement[] = new Array(TOTAL_FRAMES);
        // Load more critical frames upfront to ensure smooth start (approx 1s of content)
        const CRITICAL_BATCH = isMobile ? 40 : 60;
        const REMAINING_BATCH_SIZE = isMobile ? 20 : 40;
        let criticalLoaded = 0;

        const loadFrame = (i: number): Promise<void> => {
            return new Promise<void>((resolve) => {
                const img = new Image();
                img.onload = () => {
                    imageElements[i] = img;
                    resolve();
                };
                img.onerror = () => resolve();
                img.src = `/assets/hero-frames/frame-${i}.gif`;
            });
        };

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

        const loadRemaining = () => {
            const remaining = TOTAL_FRAMES - CRITICAL_BATCH;
            const batches = Math.ceil(remaining / REMAINING_BATCH_SIZE);
            let b = 0;

            const scheduleNextBatch = () => {
                if (b >= batches) return;
                const scheduleFn = typeof requestIdleCallback !== 'undefined'
                    ? (cb: () => void) => requestIdleCallback(cb, { timeout: 1000 })
                    : (cb: () => void) => setTimeout(cb, isMobile ? 200 : 100);

                scheduleFn(() => {
                    const batchStart = CRITICAL_BATCH + b * REMAINING_BATCH_SIZE;
                    const batchEnd = Math.min(batchStart + REMAINING_BATCH_SIZE, TOTAL_FRAMES);
                    const promises: Promise<void>[] = [];
                    for (let i = batchStart; i < batchEnd; i++) {
                        // On mobile, only load every 2nd frame after the critical batch to save 50% memory
                        if (isMobile && i % 2 !== 0) continue;
                        promises.push(loadFrame(i).then(() => {
                            framesRef.current = imageElements;
                        }));
                    }
                    b++;
                    Promise.all(promises).then(scheduleNextBatch);
                });
            };

            scheduleNextBatch();
        };

        Promise.all(criticalPromises).then(loadRemaining);

        let frameId: number;
        let lastTime = 0;
        // Animation loop — unified 60 FPS for maximum smoothness
        const fps = 60;
        const interval = 1000 / fps;

        const ctx = canvasRef.current?.getContext('2d', { alpha: false });

        const drawFrame = () => {
            const canvas = canvasRef.current;
            const img = framesRef.current[frameIndexRef.current];

            if (canvas && ctx && img && img.complete) {
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
                if (start) {
                    if (interactionHappened) {
                        // Reverse Loop
                        const decrement = isMobile && frameIndexRef.current >= CRITICAL_BATCH ? 2 : 1;
                        frameIndexRef.current = (frameIndexRef.current - decrement + TOTAL_FRAMES) % TOTAL_FRAMES;
                    } else {
                        // Forward Play
                        const increment = isMobile && frameIndexRef.current >= CRITICAL_BATCH ? 2 : 1;
                        frameIndexRef.current = (frameIndexRef.current + increment) % TOTAL_FRAMES;
                    }

                    // Safety check for mobile frame skipping (both directions)
                    if (isMobile && frameIndexRef.current >= CRITICAL_BATCH && !framesRef.current[frameIndexRef.current]) {
                        frameIndexRef.current = interactionHappened
                            ? (frameIndexRef.current - 1 + TOTAL_FRAMES) % TOTAL_FRAMES
                            : (frameIndexRef.current + 1) % TOTAL_FRAMES;
                    }
                } else {
                    frameIndexRef.current = 0;
                }
                drawFrame();
                lastTime = time;
            }
            frameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            if (canvasRef.current && typeof window !== 'undefined') {
                // Cap DPR at 1 on mobile to avoid rendering too many pixels
                const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2);
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
    }, [setVideoLoaded, start, isMobile, interactionHappened]); // Re-run when isMobile or interaction changes


    // Breathe entrance animation (initial zoom out)
    return (
        <m.div
            initial={{ scale: 1.15 }}
            animate={(videoLoaded && start) ? { scale: 1 } : { scale: 1.15 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className={`w-full h-full relative transition-opacity duration-1500 ${(videoLoaded && start) ? 'opacity-100 lg:opacity-60' : 'opacity-0'}`}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover object-center will-change-transform"
                style={{ filter: isMobile ? 'brightness(0.5) contrast(1.05) saturate(1.02)' : 'brightness(0.34) contrast(1.02) saturate(0.95)', transition: 'filter 400ms ease' }}
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

