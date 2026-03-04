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

            const dpr = window.devicePixelRatio || 1;
            const displayWidth = window.innerWidth;
            const displayHeight = window.innerHeight;

            // 1) Resize canvas with DPR (User Guide)
            if (canvas.width !== Math.floor(displayWidth * dpr) || canvas.height !== Math.floor(displayHeight * dpr)) {
                canvas.style.width = displayWidth + 'px';
                canvas.style.height = displayHeight + 'px';
                canvas.width = Math.floor(displayWidth * dpr);
                canvas.height = Math.floor(displayHeight * dpr);
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // Correctly scale the context for CSS pixels
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";
            }

            // 2) Functional drawCoverImage with INTERNAL SCALING
            const canvasWidth = displayWidth;
            const canvasHeight = displayHeight;
            const canvasRatio = canvasWidth / canvasHeight;
            const imgRatio = img.naturalWidth / img.naturalHeight;

            // Define the internal scale factor (e.g., 0.85 of viewport)
            const DRAW_SCALE = isMobile ? 0.85 : 0.9;

            let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

            if (canvasRatio > imgRatio) {
                // canvas mais largo → escalar pela largura
                drawWidth = canvasWidth * DRAW_SCALE;
                drawHeight = drawWidth / imgRatio;
            } else {
                // canvas mais alto → escalar pela altura
                drawHeight = canvasHeight * DRAW_SCALE;
                drawWidth = drawHeight * imgRatio;
            }

            // Always center the internally scaled image
            offsetX = (canvasWidth - drawWidth) * 0.5;
            offsetY = (canvasHeight - drawHeight) * 0.5;

            // Clean & Draw using CSS pixels (already normalized by setTransform)
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
    }), []);

    // Initial draw when loaded
    useEffect(() => {
        if (loaded && canvasRef.current) {
            const canvas = canvasRef.current;
            const handle = (ref as any)?.current;
            if (handle?.draw) handle.draw(0);
        }
    }, [loaded, ref]);


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
                className="w-full h-full object-cover transition-opacity duration-700"
                style={{
                    width: '100% !important',
                    height: '100% !important',
                    objectFit: 'cover',
                    transform: `scale(${isMobile ? 0.96 : 0.98}) translateZ(0)`, // Recovered presence per spec
                    filter: `brightness(${isMobile ? 0.96 : 0.94}) contrast(0.98) saturate(0.98)`, // Improved contrast/brightness
                    backfaceVisibility: 'hidden',
                    mixBlendMode: 'screen',
                    backgroundColor: 'transparent',
                    opacity: loaded ? 1 : 0,
                    transition: 'transform 0.45s ease, filter 0.45s ease'
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
    const [isLowPower, setIsLowPower] = useState(false);
    const [introFinished, setIntroFinished] = useState(false);
    const introRef = useRef<{ draw: (idx: number) => void } | null>(null);
    const targetProgress = useRef(0);
    const smoothedProgress = useRef(0);
    const isAnimating = useRef(false);
    const frameProxy = useRef({ frame: 0, letterSpacing: 0, textY: 0, opacity: 1, glowScale: 1, glowOpacity: 0.05 });
    const sectionMounted = useRef(false);
    const backlightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        sectionMounted.current = true;
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            // Simple low-power/performance detection
            const lowPower = (navigator as any).deviceMemory < 4 || /Mobi|Android|iPhone/.test(navigator.userAgent) && (navigator as any).hardwareConcurrency <= 4;
            setIsLowPower(lowPower);
        };

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
    }, [isMobile]);

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

                // Intro Timeline (Rotation only if not low-power)
                if (!isLowPower && !reduceMotion) {
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
                } else {
                    // Fallback state
                    setIntroFinished(true);
                    introRef.current?.draw(0);
                }

                // Legibilidade: Título fixo com GSAP
                gsap.fromTo('.hero-title-refined',
                    { opacity: 0, y: 30, scale: 1.05 },
                    {
                        opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power4.out",
                        delay: isMobile ? 0.5 : 1,
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top top",
                            end: "10% top",
                            scrub: false,
                            toggleActions: "play none none reverse"
                        }
                    }
                );

                // Narrativa por Etapas (Subtítulos)
                const narrativeTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: true
                    }
                });

                // 20-40%: Primeiro Subtítulo
                narrativeTimeline.fromTo('.hero-sub-refined',
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.2 }, 0.2
                );

                // 60-85%: CTA Highlight
                narrativeTimeline.to('.hero-cta-refined', {
                    scale: 1.1,
                    boxShadow: '0 0 30px rgba(199,168,107,0.4)',
                    duration: 0.15
                }, 0.6);

                // 85-100%: CTA Final State
                narrativeTimeline.to('.hero-cta-refined', {
                    scale: 1,
                    duration: 0.1
                }, 0.85);

                // Sync 3D with Scroll
                if (!isLowPower && !reduceMotion) {
                    ScrollTrigger.create({
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom bottom",
                        pin: pinContainerRef.current,
                        scrub: isMobile ? 1 : 0.5,
                        onUpdate: (self) => {
                            targetProgress.current = (TOTAL_FRAMES - 1) * self.progress;
                            const scale = 1 - (self.progress * 0.05);
                            gsap.to('.hero-title-refined', { scale, overwrite: true, duration: 0.3 });

                            if (!isAnimating.current) {
                                isAnimating.current = true;
                            }
                        }
                    });
                } else {
                    // Static pinning for fallbacks
                    ScrollTrigger.create({
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom bottom",
                        pin: pinContainerRef.current
                    });
                }
            });
        });

        // Ticker for smooth LERPing
        const tickerRender = () => {
            if (!isAnimating.current || isLowPower) return;

            const diff = targetProgress.current - smoothedProgress.current;
            const lerpFactor = window.innerWidth < 768 ? 0.05 : 0.08;

            smoothedProgress.current += diff * lerpFactor;

            if (introRef.current) {
                introRef.current.draw(smoothedProgress.current);
            }

            if (Math.abs(diff) < 0.01) {
                smoothedProgress.current = targetProgress.current;
                isAnimating.current = false;
            }
        };

        gsap.ticker.add(tickerRender);

        return () => {
            gsap.ticker.remove(tickerRender);
            ctx.revert();
        };
    }, [mounted, canStartSequence, isLowPower]);

    // The entire redundant block from line 480 to 484 should be removed because the previous return handles it and the previous useEffect dependency array is already closed.


    return (
        <section
            ref={sectionRef}
            className="hero-outer relative w-full h-[300vh] flex flex-col bg-black overflow-visible"
            style={{ padding: '0 !important', margin: 0, backgroundColor: '#000000' }}
        >
            <div
                ref={pinContainerRef}
                className="hero-sticky sticky top-0 w-[100vw] h-[100vh] left-1/2 -translate-x-1/2 overflow-hidden bg-black z-[1]"
                style={{ maxWidth: 'none !important', padding: '0 !important', margin: 0 }}
            >
                {/* Atmospheric Seamless 360 Viewer - No Box, Pure Void */}
                <div
                    ref={videoWrapperRef}
                    className="absolute inset-0 z-0 origin-center will-change-transform flex items-center justify-center bg-black"
                >
                    {/* Volumetric Backlight Glow (Slow Parallax for 3D Depth) - Enhanced for 0.85x scale */}
                    <div
                        ref={backlightRef}
                        className="absolute w-[130vw] h-[130vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none will-change-transform"
                        style={{
                            background: 'radial-gradient(circle, rgba(255, 245, 220, 0.07) 0%, transparent 65%)', // Reduced intensity by subtle amount
                            opacity: 0.07
                        }}
                    />

                    {/* Radial Mask Container for "Bleeding" Video Edges - Tighter falloff for absolute invisibility */}
                    <div
                        className="relative w-full h-full flex items-center justify-center z-[5]"
                        style={{
                            maskImage: 'radial-gradient(circle at center, black 15%, transparent 65%)',
                            WebkitMaskImage: 'radial-gradient(circle at center, black 15%, transparent 65%)'
                        }}
                    >
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
                    className="absolute inset-0 z-[30] w-full flex flex-col items-center justify-center text-center pointer-events-none"
                    style={{ padding: '0 5vw' }}
                >
                    {/* Refined Overlay for stable contrast */}
                    <div className="hero-overlay" />

                    <div className="max-w-[95vw] lg:max-w-[1100px] perspective-1000 w-full flex flex-col items-center relative z-10">
                        <h1
                            ref={titleRef}
                            className="hero-title-refined"
                            aria-label="Seu Sorriso, Sua Assinatura"
                        >
                            Seu Sorriso, <br />
                            <span className="font-light">sua assinatura.</span>
                        </h1>

                        <div className="hero-sub-refined">
                            <p
                                ref={descriptionRef}
                                className="text-white/70 font-display text-[1.2rem] lg:text-[1.5rem] tracking-wide"
                            >
                                Precisão clínica. Estética invisível.
                            </p>
                        </div>

                        <div ref={actionsRef} className="hero-ctas relative z-[60] py-2 mt-8 flex flex-col sm:flex-row items-center justify-center w-full px-5 pointer-events-auto">
                            <button
                                onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                                className="hero-cta-refined"
                                aria-label="Agendar Consulta - abre modal/agenda"
                            >
                                Agendar Consulta
                            </button>
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

