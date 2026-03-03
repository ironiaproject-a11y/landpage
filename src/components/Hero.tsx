"use client";

import { m, useReducedMotion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import NextImage from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Magnetic } from "./Magnetic";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 192;

// Expose a draw(frameIdx) method directly — GSAP calls this on every tick
type IntroSequenceHandle = { draw: (idx: number) => void };

const IntroSequence = forwardRef<IntroSequenceHandle, { isMobile: boolean }>(function IntroSequence({ isMobile }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const framesRef = useRef<HTMLImageElement[]>([]);
    const [loaded, setLoaded] = useState(false);
    const loadedRef = useRef(false);

    useEffect(() => {
        const imageElements: HTMLImageElement[] = new Array(TOTAL_FRAMES);
        let loadedCount = 0;
        const targetFrames = TOTAL_FRAMES;

        const loadFrame = (i: number) => {
            const img = new Image();
            img.onload = () => {
                imageElements[i] = img;
                loadedCount++;
                if (loadedCount === targetFrames) {
                    framesRef.current = imageElements;
                    loadedRef.current = true;
                    setLoaded(true);
                }
            };
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === targetFrames) {
                    framesRef.current = imageElements;
                    loadedRef.current = true;
                    setLoaded(true);
                }
            };
            const paddedIndex = i.toString().padStart(3, '0');
            img.src = `/para_vc/frame_${paddedIndex}_delay-0.041s.png`;
        };

        for (let i = 0; i < TOTAL_FRAMES; i++) loadFrame(i);
    }, []);

    // Expose draw() so GSAP can call it directly without triggering React renders
    useImperativeHandle(ref, () => ({
        draw(frameIdx: number) {
            if (!loadedRef.current) return;
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d', { alpha: false });

            if (!canvas || !ctx) return;

            const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(frameIdx)));
            const img = framesRef.current[idx];
            if (!img || !img.complete) return;

            const isMobileView = window.innerWidth < 768;
            const dpr = Math.min(window.devicePixelRatio || 1, isMobileView ? 1.5 : 2);
            const displayWidth = canvas.clientWidth;
            const displayHeight = canvas.clientHeight;

            if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
                canvas.width = displayWidth * dpr;
                canvas.height = displayHeight * dpr;
                ctx.scale(dpr, dpr);
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";
            }

            // Object-Fit: Cover algorithm
            const imgAspect = img.naturalWidth / img.naturalHeight;
            const canvasAspect = displayWidth / displayHeight;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasAspect > imgAspect) {
                // Canvas is wider than image aspect
                drawWidth = displayWidth;
                drawHeight = displayWidth / imgAspect;
                offsetX = 0;
                offsetY = (displayHeight - drawHeight) * 0.5;
            } else {
                // Canvas is taller than image aspect
                drawHeight = displayHeight;
                drawWidth = displayHeight * imgAspect;
                offsetX = (displayWidth - drawWidth) * 0.5;
                offsetY = 0;
            }

            // Clear with absolute black to avoid any visible seams
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, displayWidth, displayHeight);

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
    }), []);

    // Draw the first frame when images are ready
    useEffect(() => {
        if (loaded && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = framesRef.current[0];
            if (ctx && img && img.complete) {
                const isMobileView = window.innerWidth < 768;
                const dpr = Math.min(window.devicePixelRatio || 1, isMobileView ? 1.5 : 3);
                canvas.width = canvas.clientWidth * dpr;
                canvas.height = canvas.clientHeight * dpr;
                ctx.scale(dpr, dpr);
                const displayWidth = canvas.clientWidth;
                const displayHeight = canvas.clientHeight;
                const canvasAspect = displayWidth / displayHeight;
                const imgAspect = img.naturalWidth / img.naturalHeight;
                let drawWidth, drawHeight, offsetX, offsetY;

                if (isMobileView) {
                    if (canvasAspect > imgAspect) {
                        drawWidth = displayWidth; drawHeight = displayWidth / imgAspect;
                        offsetX = 0; offsetY = (displayHeight - drawHeight) / 2;
                    } else {
                        drawHeight = displayHeight; drawWidth = displayHeight * imgAspect;
                        offsetX = (displayWidth - drawWidth) / 2; offsetY = 0;
                    }
                } else {
                    if (canvasAspect > imgAspect) {
                        drawHeight = displayHeight; drawWidth = displayHeight * imgAspect;
                        offsetX = (displayWidth - drawWidth) / 2; offsetY = 0;
                    } else {
                        drawWidth = displayWidth; drawHeight = displayWidth / imgAspect;
                        offsetX = 0; offsetY = (displayHeight - drawHeight) / 2;
                    }
                }
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            }
        }
    }, [loaded]);

    return (
        <div className="absolute inset-0 z-0 flex items-center justify-center">
            {!loaded && (
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-t-2 border-b-2 border-[#C7A86B] animate-spin" />
                    <span className="text-white/60 text-sm tracking-widest uppercase font-bold text-center px-4">Otimizando Experiência Mobile</span>
                </div>
            )}
            <canvas
                ref={canvasRef}
                className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    filter: isMobile ? 'brightness(0.65) contrast(1.1)' : 'brightness(0.72)',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                }}
            />
        </div>
    );
});

const DentalScanner = ({ onLoaded, isMobile }: { onLoaded: () => void, isMobile: boolean }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
    const [isInteracting, setIsInteracting] = useState(false);
    const [isAutoAnimating, setIsAutoAnimating] = useState(true);

    useEffect(() => {
        const estetica = new Image();
        const raiox = new Image();
        let loadedCount = 0;
        const handleLoad = () => {
            loadedCount++;
            if (loadedCount === 2) onLoaded();
        };
        estetica.onload = handleLoad;
        raiox.onload = handleLoad;
        estetica.src = "/assets/images/dente-estetica.webp";
        raiox.src = "/assets/images/dente-raio-x.webp";
    }, [onLoaded]);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const hintTl = gsap.timeline({
            onComplete: () => setIsAutoAnimating(false)
        });

        gsap.set(container, { "--mask-size": "0px", "--x": `${centerX}px`, "--y": `${centerY}px` });

        hintTl
            .to(container, { "--mask-size": "200px", duration: 0.8, ease: "power2.out" }, "+=0.5")
            .to(container, { "--mask-size": "150px", duration: 0.6, ease: "back.out(1.7)" });

        const quickSetterX = gsap.quickSetter(container, "--x", "px");
        const quickSetterY = gsap.quickSetter(container, "--y", "px");
        const cursorSetterX = gsap.quickSetter(cursorRef.current, "x", "px");
        const cursorSetterY = gsap.quickSetter(cursorRef.current, "y", "px");

        const ticker = () => {
            if (isAutoAnimating) {
                cursorSetterX(centerX);
                cursorSetterY(centerY);
                return;
            }
            mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.1;
            mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.1;

            quickSetterX(mousePos.current.x);
            quickSetterY(mousePos.current.y);
            cursorSetterX(mousePos.current.x);
            cursorSetterY(mousePos.current.y);
        };

        gsap.ticker.add(ticker);
        return () => {
            gsap.ticker.remove(ticker);
            hintTl.kill();
        };
    }, [isAutoAnimating]);

    const handleMove = (clientX: number, clientY: number) => {
        if (isAutoAnimating || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mousePos.current.targetX = clientX - rect.left;
        mousePos.current.targetY = clientY - rect.top;
    };

    return (
        <div
            ref={containerRef}
            className="relative mx-auto overflow-hidden select-none"
            onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY + (isMobile ? -60 : 0))}
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
            style={{
                cursor: 'none',
                touchAction: 'none',
                width: '100%',
                height: '100%',
                containerType: 'inline-size'
            } as any}
        >
            <NextImage
                src="/assets/images/dente-estetica.webp"
                alt="Aesthetic"
                fill
                className="object-contain pointer-events-none"
                priority
            />
            <div
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                    clipPath: `circle(var(--mask-size, 0px) at var(--x, 50%) var(--y, 50%))`,
                    WebkitClipPath: `circle(var(--mask-size, 0px) at var(--x, 50%) var(--y, 50%))`
                } as any}
            >
                <NextImage src="/assets/images/dente-raio-x.webp" alt="X-Ray" fill className="object-contain" priority />
            </div>

            <div
                ref={cursorRef}
                className={`fixed top-0 left-0 w-[150px] h-[150px] pointer-events-none z-[100] transition-opacity duration-300 ${isInteracting && !isAutoAnimating ? 'opacity-100' : 'opacity-0'}`}
                style={{ marginTop: '-75px', marginLeft: '-75px' }}
            >
                <div className="absolute inset-0 border border-[#C7A86B]/30 rounded-full" />
                <div className="absolute top-1/2 left-0 w-4 h-[1px] bg-[#C7A86B] -translate-y-1/2" />
                <div className="absolute top-1/2 right-0 w-4 h-[1px] bg-[#C7A86B] -translate-y-1/2" />
                <div className="absolute top-0 left-1/2 w-[1px] h-4 bg-[#C7A86B] -translate-x-1/2" />
                <div className="absolute bottom-0 left-1/2 w-[1px] h-4 bg-[#C7A86B] -translate-x-1/2" />
                <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-[#C7A86B] rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_#C7A86B]" />
            </div>
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
    const heroVideoRef = useRef<HTMLVideoElement | null>(null);

    const [mounted, setMounted] = useState(false);
    const [canStartSequence, setCanStartSequence] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [introFinished, setIntroFinished] = useState(false);
    const introRef = useRef<{ draw: (idx: number) => void } | null>(null);
    const targetProgress = useRef(0);
    const smoothedProgress = useRef(0);
    const isAnimating = useRef(false);
    const frameProxy = useRef({ frame: 0 });
    const sectionMounted = useRef(false);

    useEffect(() => {
        setMounted(true);
        sectionMounted.current = true;
        const checkMobile = () => setIsMobile(window.innerWidth < 768);

        if (typeof window !== "undefined") {
            checkMobile();
            window.addEventListener("resize", checkMobile);

            const handlePreloaderExit = () => setCanStartSequence(true);
            window.addEventListener("preloader-exiting", handlePreloaderExit);

            const timer = setTimeout(() => setCanStartSequence(true), 5000);

            if (isMobile) {
                ScrollTrigger.config({ ignoreMobileResize: true });
            }

            return () => {
                window.removeEventListener("resize", checkMobile);
                window.removeEventListener("preloader-exiting", handlePreloaderExit);
                clearTimeout(timer);
            };
        }
    }, []);

    // Phase 1 & 2 — Animation Orchestration
    useEffect(() => {
        if (!mounted || !canStartSequence) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            mm.add({
                isDesktop: "(min-width: 768px)",
                isMobile: "(max-width: 767px)",
                reduceMotion: "(prefers-reduced-motion: reduce)"
            }, (context) => {
                const { isMobile, reduceMotion } = context.conditions as { isMobile: boolean, reduceMotion: boolean };

                // Reset frame proxy
                frameProxy.current.frame = 0;

                // Intro Timeline
                const introTl = gsap.timeline({
                    onComplete: () => setIntroFinished(true)
                });

                introTl.to(frameProxy.current, {
                    frame: TOTAL_FRAMES - 1,
                    duration: isMobile ? 4.5 : 5.0,
                    ease: "power3.inOut",
                    onUpdate() {
                        introRef.current?.draw(frameProxy.current.frame);
                        smoothedProgress.current = frameProxy.current.frame;
                        targetProgress.current = frameProxy.current.frame;
                    },
                    onComplete: () => {
                        setIntroFinished(true);
                        ScrollTrigger.refresh();
                    }
                });

                // Scroll Animation (Only if not reduced motion)
                if (!reduceMotion) {
                    const startFrame = isMobile ? TOTAL_FRAMES - 1 : 0;
                    const endFrame = isMobile ? 0 : TOTAL_FRAMES - 1;

                    ScrollTrigger.create({
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom bottom",
                        pin: pinContainerRef.current,
                        pinType: isMobile ? "fixed" : "transform",
                        scrub: false,
                        onUpdate: (self) => {
                            targetProgress.current = startFrame + (endFrame - startFrame) * self.progress;

                            if (!isAnimating.current) {
                                isAnimating.current = true;
                            }
                        },
                        onLeave: () => {
                            targetProgress.current = endFrame;
                            isAnimating.current = true;
                        },
                        anticipatePin: 1.5,
                        pinSpacing: true,
                    });

                    // Parallax and Content Animations
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 0.5,
                        }
                    })
                        .fromTo(videoWrapperRef.current,
                            { scale: 1.0, y: 0 }, // ALWAYS full screen to avoid side borders
                            { scale: 1.0, y: isMobile ? 0 : -30, ease: "none", overwrite: "auto" }, 0)
                        .to(contentWrapperRef.current, { y: isMobile ? -10 : -30, opacity: 0.8, ease: "none" }, 0)
                        .to(actionsRef.current, { scale: isMobile ? 1.0 : 0.97, opacity: 0.9, ease: "none" }, 0.1);
                }

                return () => {
                    // Cleanup handled by ctx.revert()
                };
            });

            // Ticker for smooth LERPing
            const tickerRender = () => {
                if (!isAnimating.current || !sectionMounted.current) return;

                const diff = targetProgress.current - smoothedProgress.current;
                // Higher precision for the last 1% to prevent lock-up
                const isNearEnd = Math.abs(diff) < 2;
                const lerpFactor = isNearEnd ? 0.15 : (window.innerWidth < 768 ? 0.05 : 0.07);

                smoothedProgress.current += diff * lerpFactor;

                if (introRef.current) {
                    // Always draw with current proxy state
                    introRef.current.draw(smoothedProgress.current);
                }

                if (Math.abs(diff) < 0.0001) {
                    smoothedProgress.current = targetProgress.current;
                    isAnimating.current = false;
                }
            };

            gsap.ticker.add(tickerRender);

            return () => {
                gsap.ticker.remove(tickerRender);
            };
        }, sectionRef);

        return () => {
            sectionMounted.current = false;
            ctx.revert();
        };
    }, [mounted, canStartSequence]);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-[300vh] flex flex-col bg-black overflow-x-hidden"
            style={{ padding: '0 5vw', backgroundColor: '#000000' }} // Force absolute black
        >
            <div
                ref={pinContainerRef}
                className="relative h-screen w-full flex items-center justify-center overflow-hidden z-0 will-change-transform bg-black"
                style={{ backgroundColor: '#000000' }}
            >
                {/* Brand-Focused 360 Viewer Wrapper Container */}
                <div
                    className="relative w-[85vw] h-[85vh] max-w-[1600px] max-h-[1000px] z-0 overflow-hidden flex items-center justify-center bg-black"
                    style={{ margin: 'auto', backgroundColor: '#000000' }}
                >
                    <div
                        ref={videoWrapperRef}
                        className="absolute inset-0 z-0 origin-center will-change-transform flex items-center justify-center bg-black"
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

                        {/* Frame sequence — always visible, driven by intro then scroll */}
                        <IntroSequence
                            ref={introRef}
                            isMobile={isMobile}
                        />
                    </div>
                </div>

                {/* Ambient Particles (Disabled for cleaner look) */}
                {/* {!shouldReduceMotion && <AmbientParticles />} */}

                <div
                    ref={contentWrapperRef}
                    className="absolute inset-0 z-10 w-full flex flex-col items-center justify-center text-center pointer-events-none"
                    style={{ padding: '0 5vw' }}
                >
                    <div className="max-w-[95vw] lg:max-w-[1100px] perspective-1000 w-full flex flex-col items-center relative">
                        {/* Dominant Brand Element (Optional, since Navbar has it, but can be used for extra brand dominance) */}
                        <m.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={(mounted && canStartSequence) ? { opacity: 0.1, y: 0 } : { opacity: 0, y: 10 }}
                            transition={{ delay: 5.5, duration: 2 }}
                            className="absolute top-[-15%] left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none select-none"
                        >
                            <span className="font-display text-[12vw] font-black text-white uppercase tracking-[0.2em] opacity-10">
                                IRONIA
                            </span>
                        </m.div>

                        <m.h1
                            ref={titleRef}
                            initial={{ opacity: 0 }}
                            animate={(mounted && canStartSequence) ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="font-display text-[clamp(2rem,6vw,5.5rem)] text-[var(--color-creme)] will-change-transform font-black uppercase tracking-[0.1em] leading-[1.05] mb-10 text-shadow-luxury"
                        >
                            <span className="text-mask-reveal">
                                <m.span
                                    initial={{ y: "100%" }}
                                    animate={(mounted && canStartSequence) ? { y: 0 } : { y: "100%" }}
                                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: isMobile ? 1.5 : 4.5 }}
                                    className="text-mask-reveal-inner"
                                >
                                    Seu sorriso,
                                </m.span>
                            </span>
                            <span className="text-mask-reveal">
                                <m.span
                                    initial={{ y: "100%" }}
                                    animate={(mounted && canStartSequence) ? { y: 0 } : { y: "100%" }}
                                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: isMobile ? 1.8 : 4.8 }}
                                    className="text-mask-reveal-inner font-light italic"
                                >
                                    sua assinatura.
                                </m.span>
                            </span>
                        </m.h1>

                        <div className="overflow-hidden mb-12 w-full max-w-[700px]">
                            <m.p
                                ref={descriptionRef}
                                initial={{ opacity: 0, y: 20 }}
                                animate={(mounted && canStartSequence) ? { opacity: 0.8, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ delay: isMobile ? 1.2 : 5.2, duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                                className="text-[18px] lg:text-[20px] font-medium text-center text-white/90 leading-[1.75] body-text-refined px-4"
                            >
                                A harmonia perfeita entre ciência avançada e estética de <span className="font-semibold font-display uppercase tracking-widest text-[var(--color-silver-bh)]">alta costura</span>.
                            </m.p>
                        </div>


                        <div ref={actionsRef} className="hero-ctas relative z-[60] py-2 flex flex-col sm:flex-row items-center justify-center w-full px-5 pointer-events-auto" style={{ gap: isMobile ? 16 : 24 }}>
                            <Magnetic strength={isMobile ? 0 : 0.3} range={100} className={isMobile ? "w-full" : ""}>
                                <m.button
                                    onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                                    animate={(mounted && canStartSequence) ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
                                    transition={{ delay: isMobile ? 0.6 : 5.5, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                    whileHover={!isMobile ? { y: -5, scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.6)" } : {}}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', padding: '18px 42px', minHeight: isMobile ? 60 : 56, fontSize: isMobile ? 16 : 18, width: isMobile ? '100%' : 'auto' }}
                                    className="group relative flex items-center justify-center gap-3 bg-[var(--color-creme)] text-black rounded-full font-black shadow-2xl overflow-hidden border border-transparent hover:scale-[1.05] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
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
                                    <span className="relative z-10 flex items-center gap-3 tracking-[0.08em] font-bold uppercase" style={{ fontSize: 'inherit' }}>
                                        Agendar Consulta
                                    </span>
                                </m.button>
                            </Magnetic>

                            <Magnetic strength={isMobile ? 0 : 0.3} range={100} className={isMobile ? "w-full" : ""}>
                                <m.button
                                    onClick={() => document.getElementById('casos')?.scrollIntoView({ behavior: 'smooth' })}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={(canStartSequence) ? { opacity: 0.85, y: 0 } : { opacity: 0, y: 10 }}
                                    transition={{ delay: isMobile ? 0.9 : 4.7, duration: 1.5 }}
                                    whileHover={!isMobile ? { y: -3, scale: 1.01, opacity: 1 } : {}}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.95)', padding: '16px 32px', minHeight: isMobile ? 56 : 52, fontSize: isMobile ? 16 : 18, width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? 420 : 'none' }}
                                    className="group flex items-center justify-center gap-3 rounded-full backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/30 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#C7A86B]/40 focus-visible:outline-offset-[3px]"
                                >
                                    <span className="tracking-[0.08em] font-semibold uppercase" style={{ fontSize: 'inherit' }}>Galeria de Resultados</span>
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

