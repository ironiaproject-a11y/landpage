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
        const targetFrames = isMobile ? 101 : TOTAL_FRAMES;
        const imageElements: HTMLImageElement[] = new Array(TOTAL_FRAMES);
        let loadedCount = 0;

        const loadFrame = (i: number) => {
            return new Promise<void>((resolve) => {
                const img = new Image();

                const checkDone = () => {
                    loadedCount++;
                    if (loadedCount === 1) { // Redraw first frame immediately
                        framesRef.current = imageElements;
                        (ref as any)?.current?.draw(0);
                        // Notify that critical assets are ready for preloader exit
                        window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
                    }
                    if (loadedCount >= targetFrames) {
                        framesRef.current = imageElements;
                        loadedRef.current = true;
                        setLoaded(true);
                    }
                    resolve();
                };

                img.onload = () => {
                    imageElements[i] = img;
                    checkDone();
                };

                img.onerror = checkDone;
                const paddedIndex = i.toString().padStart(3, '0');
                img.src = `/para_vc/frame_${paddedIndex}_delay-0.041s.png`;
            });
        };

        const loadInBatches = async () => {
            // Priority 1: First 10 frames
            const priorityBatches = [];
            for (let i = 0; i < Math.min(10, TOTAL_FRAMES); i++) {
                priorityBatches.push(loadFrame(i));
            }
            await Promise.all(priorityBatches);

            // Priority 2: Remaining frames in batches
            const batchSize = isMobile ? 10 : 20;
            for (let i = 10; i < TOTAL_FRAMES; i += batchSize) {
                // If mobile, we can skip some frames to reduce payload
                const currentBatch = [];
                for (let j = i; j < Math.min(i + batchSize, TOTAL_FRAMES); j++) {
                    if (isMobile && j % 2 !== 0) continue; // Skip every other frame on mobile
                    currentBatch.push(loadFrame(j));
                }
                await Promise.all(currentBatch);
                // Allow some breathing room for the main thread
                await new Promise(r => setTimeout(r, 10));
            }
        };

        loadInBatches();
    }, [isMobile, ref]);

    // Expose draw() so GSAP can call it directly without triggering React renders
    useImperativeHandle(ref, () => ({
        draw(frameIdx: number) {
            if (!loadedRef.current) return;
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d', { alpha: false });

            if (!canvas || !ctx) return;

            const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(frameIdx)));
            let img = framesRef.current[idx];

            // Fallback for skipped frames on mobile
            if (!img && isMobile) {
                const prevIdx = Math.floor(idx / 2) * 2;
                img = framesRef.current[prevIdx];
            }

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

            // Aggressively reduced scale to push the dente into the deep background
            const DRAW_SCALE = isMobile ? 0.70 : 0.60;

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [isMobile]);

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
                    transform: `scale(${isMobile ? 1.0 : 0.98}) translateZ(0)`, // Removed mobile reduction to prevent gaps
                    willChange: 'transform, opacity, filter',
                    transformStyle: 'preserve-3d', filter: `brightness(${isMobile ? 1.05 : 1.1}) contrast(1.05) saturate(1.05)`, // Dente como figura luminosa
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
        // We rely on NextImage's priority prop for these critical assets
        onLoaded();
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
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formStep, setFormStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', treatment: '', date: '', time: '' });
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

                // Coordinated reveal triggered during intro
                const revealThreshold = TOTAL_FRAMES * (isMobile ? 0.35 : 0.85);
                let revealed = false;

                const checkReveal = (currentFrame: number) => {
                    if (!revealed && currentFrame >= revealThreshold) {
                        revealed = true;
                        const tl = gsap.timeline({
                            defaults: { ease: "power4.out", duration: 1.8 }
                        });

                        tl.fromTo([".hero-title-line-1", ".hero-title-line-2"],
                            { y: 60, opacity: 0, filter: "blur(12px)" },
                            { y: 0, opacity: 1, filter: "blur(0px)", stagger: 0.2, duration: 1.8, ease: "power4.out" }, "-=0.5"
                        )
                            .fromTo(descriptionRef.current,
                                { y: 20, opacity: 0, filter: "blur(8px)" },
                                { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.4, ease: "power4.out" }, "-=1.2"
                            )
                            .fromTo(actionsRef.current,
                                { y: 15, opacity: 0 },
                                { y: 0, opacity: 1, duration: 1.2, delay: 0.8, ease: "power4.out" }, "-=1.0"
                            );
                    }
                };

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
                        checkReveal(frameProxy.current.frame);
                    },
                    onComplete: () => {
                        setIntroFinished(true);
                        ScrollTrigger.refresh();
                    }
                });

                // Sync with rotation and depth (Aggressively smaller for "background" feel)
                gsap.to(videoWrapperRef.current, {
                    rotation: isMobile ? 0 : 5,
                    scale: isMobile ? 0.80 : 0.90,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 0.8
                    }
                });

                // Parallax of content (Layered depth) - 0.6x speed relative to scroll. Using y offset.
                gsap.to(contentWrapperRef.current, {
                    y: () => window.innerHeight * -0.6,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    }
                });

                // Keep existing frame sync trigger
                const startFrame = 0;
                const endFrame = TOTAL_FRAMES - 1;
                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: isMobile ? 1 : 0.3,
                    onUpdate: (self) => {
                        targetProgress.current = startFrame + (endFrame - startFrame) * self.progress;

                        // Scroll Cinemático: Texto sobe e comprime levemente (tensão), sumindo de forma mais elegante
                        frameProxy.current.letterSpacing = -(self.progress * 3);
                        frameProxy.current.textY = -(self.progress * 150);
                        frameProxy.current.opacity = 1 - Math.pow(self.progress, 1.5) * 1.5;

                        if (!isAnimating.current) {
                            isAnimating.current = true;
                        }
                    }
                });

                return () => {
                    // Cleanup handled by ctx.revert()
                };
            });

            // Shared constants (re-declared for ticker scope)
            const startFrame = 0;
            const endFrame = TOTAL_FRAMES - 1;

            // Ticker for smooth LERPing
            const tickerRender = () => {
                if (!isAnimating.current || !sectionMounted.current) return;

                const diff = targetProgress.current - smoothedProgress.current;

                if (Math.abs(diff) < 0.001) {
                    smoothedProgress.current = targetProgress.current;
                    isAnimating.current = false;
                    return;
                }

                const lerpFactor = isMobile ? 0.08 : 0.12;
                smoothedProgress.current += diff * lerpFactor;

                // Scroll Cinemático: Dissolve Atmosférico (Tracking + Scale + Fade)
                // Usando ScrollTrigger progress (self.progress salvo no proxy)
                const scrollProgress = Math.max(0, (smoothedProgress.current - startFrame) / (endFrame - startFrame));

                if (titleRef.current) {
                    const tracking = scrollProgress * 10; // Expansão orgânica do 'assinatura' de 0 a 10px
                    const scale = 1 + scrollProgress * 0.1; // "Câmera atravessando o texto"
                    const opacity = Math.max(0, 1 - Math.pow(scrollProgress, 1.2) * 2);

                    // Aplica na Primeira Linha (não expande letter spacing com o scroll conforme restrito)
                    gsap.set(".hero-title-line-1", {
                        scale: scale,
                        opacity: opacity,
                        y: -(scrollProgress * 20), // Movimento vertical mínimo para não 'bater'
                        filter: `blur(${Math.pow(scrollProgress, 2) * 10}px)`
                    });

                    // Aplica na Segunda Linha (Expande o letter spacing)
                    gsap.set(".hero-title-line-2", {
                        letterSpacing: `${tracking}px`,
                        scale: 1 + scrollProgress * 0.08,
                        opacity: Math.max(0, 1 - Math.pow(scrollProgress, 0.8) * 1.5),
                        y: -(scrollProgress * 40),
                        filter: `blur(${Math.pow(scrollProgress, 2) * 10}px)`
                    });
                }

                if (descriptionRef.current || actionsRef.current) {
                    const contentOpacity = Math.max(0, 1 - scrollProgress * 3);
                    gsap.set([descriptionRef.current, actionsRef.current], {
                        opacity: contentOpacity,
                        y: -(scrollProgress * 60)
                    });
                }

                if (backlightRef.current) {
                    gsap.set(backlightRef.current, {
                        scale: 1 + scrollProgress * 0.5,
                        opacity: 0.08 * (1 - scrollProgress),
                        y: -(scrollProgress * 100)
                    });
                }

                if (introRef.current) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted, canStartSequence]);

    return (
        <section
            ref={sectionRef}
            className="hero-outer relative w-full h-[300vh] flex flex-col bg-black overflow-visible"
            style={{ padding: '0 !important', margin: 0, backgroundColor: '#000000' }}
        >
            <div
                ref={pinContainerRef}
                className="hero-sticky sticky top-0 left-0 w-full h-[100vh] overflow-hidden bg-black z-[1]"
                style={{ maxWidth: 'none !important', padding: '0 !important', margin: 0 }}
            >
                {/* Atmospheric Seamless 360 Viewer - No Box, Pure Void */}
                <div
                    ref={videoWrapperRef}
                    className="absolute inset-0 z-0 origin-center will-change-transform flex items-center justify-center bg-black"
                    style={{
                        filter: isFormOpen ? 'brightness(0.3)' : 'none',
                        transition: 'filter 1.2s cubic-bezier(0.22, 1, 0.36, 1)'
                    }}
                >
                    {/* Volumetric Backlight Glow (Slow Parallax for 3D Depth) - Enhanced for 0.85x scale */}
                    <div
                        ref={backlightRef}
                        className="absolute w-[130vw] h-[130vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none will-change-transform"
                        style={{
                            background: 'radial-gradient(circle, rgba(255, 245, 220, 0.12) 0%, transparent 70%)',
                            opacity: 0.08
                        }}
                    />

                    {/* Radial Mask Container for "Bleeding" Video Edges - Tighter falloff for absolute invisibility */}
                    <div
                        className="relative w-full h-full flex items-center justify-center z-[5]"
                        style={{
                            maskImage: isMobile
                                ? 'radial-gradient(circle at center, black 20%, transparent 70%)'
                                : 'radial-gradient(circle at center, black 10%, transparent 55%)',
                            WebkitMaskImage: isMobile
                                ? 'radial-gradient(circle at center, black 20%, transparent 70%)'
                                : 'radial-gradient(circle at center, black 10%, transparent 55%)',
                            filter: isFormOpen ? 'blur(20px)' : 'none',
                            transition: 'filter 1.2s cubic-bezier(0.22, 1, 0.36, 1)'
                        }}
                    >
                        {/* Frame sequence — always visible, driven by intro then scroll */}
                        <IntroSequence
                            ref={introRef}
                            isMobile={isMobile}
                        />
                    </div>
                </div>

                {/* Removido o overlay escuro global para valorizar a luz do 3D */}
                <div className="hero-overlay-fix absolute inset-0 pointer-events-none" style={{ background: 'rgba(0, 0, 0, 0.15)', zIndex: 1 }} />

                {/* Ambient Particles (Disabled for cleaner look) */}
                {/* {!shouldReduceMotion && <AmbientParticles />} */}

                <div
                    ref={contentWrapperRef}
                    className="absolute inset-0 z-[3] w-full flex flex-col items-center text-center pointer-events-none"
                    style={{ padding: '0 6vw', justifyContent: 'space-between', paddingTop: isMobile ? '8vh' : '15vh', paddingBottom: isMobile ? '6vh' : '12vh' }}
                >
                    {/* Strategic Spotlight Layer - Cinematic Depth (Layer 1) */}
                    <div
                        className="absolute inset-0 z-[11] pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.5) 100%)',
                            opacity: (mounted && canStartSequence) ? 0.8 : 0,
                            transition: 'opacity 3s ease-in-out'
                        }}
                    />

                    <div
                        className="absolute inset-0 z-[10] pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle at 50% 44%, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 18%, rgba(0,0,0,0) 45%)',
                            mixBlendMode: 'screen',
                            opacity: (mounted && canStartSequence) ? 0.6 : 0,
                            transition: 'opacity 2.5s ease-in-out'
                        }}
                    />

                    {/* Strategic Editorial Overlay - Vignette Suave, clareado no centro (Layer 2) */}
                    <div
                        className="absolute inset-0 z-[20] pointer-events-none"
                        style={{
                            background: isMobile
                                ? 'radial-gradient(circle at 50% 46%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.85) 85%)'
                                : 'radial-gradient(circle at 50% 44%, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.8) 85%)',
                            opacity: (mounted && canStartSequence) ? 1 : 0,
                            transition: 'opacity 1.5s ease-in-out'
                        }}
                    />

                    <div className="max-w-[95vw] lg:max-w-[1100px] perspective-1000 w-full flex flex-col items-center relative z-10">
                        {/* Branded Atmospheric Overlay */}


                        {/* Brand Eyebrow - The Anchor */}


                        <h1
                            ref={titleRef}
                            className={`hero-title ${(mounted && canStartSequence) ? 'in-view' : ''} text-center will-change-transform leading-[1.05] mb-8 flex flex-col items-center relative w-full`}
                            style={{
                                color: 'white',
                                backdropFilter: 'blur(2px)',
                                WebkitBackdropFilter: 'blur(2px)',
                                margin: '0 auto',
                                pointerEvents: isFormOpen ? 'none' : 'auto',
                                transition: 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
                                transform: isFormOpen ? (isMobile ? 'translateY(-10vh) scale(0.85)' : 'translateY(-15vh) scale(0.8)') : 'translateY(0) scale(1)',
                            }}
                        >
                            <span
                                className="uppercase opacity-0 hero-title-line-1 font-sans font-semibold"
                                style={{
                                    fontSize: '11px',
                                    letterSpacing: '8px',
                                    opacity: 0.6
                                }}
                            >SEU SORRISO,</span>
                            <span
                                className="italic lowercase opacity-0 hero-title-line-2 font-display font-light flex items-center justify-center"
                                style={{
                                    fontSize: isMobile ? '42px' : '8rem',
                                    marginTop: '12px'
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    <m.span
                                        key={isFormOpen ? "consulta" : "assinatura"}
                                        initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
                                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
                                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                        style={{ display: 'inline-block' }}
                                    >
                                        {isFormOpen ? "sua consulta." : "sua assinatura."}
                                    </m.span>
                                </AnimatePresence>
                            </span>
                        </h1>

                        <div style={{
                            opacity: isFormOpen ? 0 : 1,
                            visibility: isFormOpen ? 'hidden' : 'visible',
                            pointerEvents: isFormOpen ? 'none' : 'auto',
                            transition: 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), visibility 0.8s',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%'
                        }}>
                            <div className="overflow-hidden w-full transform mb-16 mt-auto">
                                <p
                                    ref={descriptionRef}
                                    className="text-center opacity-0 font-sans"
                                    style={{
                                        fontSize: isMobile ? '15px' : '16px',
                                        color: '#F5F5DC',
                                        opacity: 0.8,
                                        maxWidth: isMobile ? 'min(90vw, 450px)' : '600px',
                                        margin: '0 auto',
                                        letterSpacing: '0.02em',
                                        backdropFilter: 'blur(2px)',
                                        WebkitBackdropFilter: 'blur(2px)'
                                    }}
                                >
                                    Segurança clínica. Resultado natural.
                                </p>
                            </div>


                            <div ref={actionsRef} className="hero-ctas relative z-[20] flex flex-col items-center justify-center w-full px-5 pointer-events-auto opacity-0 gap-4" style={{ paddingBottom: '2vh' }}>
                                <Magnetic strength={isMobile ? 0 : 0.3} range={100} className={isMobile ? "w-full" : ""}>
                                    <m.button
                                        onClick={() => setIsFormOpen(true)}
                                        whileHover={{
                                            y: -2,
                                            scale: 1.05,
                                            background: "rgba(245, 245, 220, 0.2)",
                                            boxShadow: "0 8px 40px rgba(0,0,0,0.15)"
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            padding: '1rem 2.5rem',
                                            borderRadius: '9999px',
                                            background: 'rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(10px)',
                                            WebkitBackdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            color: '#F5F5DC',
                                            fontWeight: 600,
                                            width: isMobile ? '100%' : 'auto',
                                            transition: 'all 0.3s ease'
                                        }}
                                        className="group relative flex items-center justify-center"
                                    >
                                        <span className="relative z-10">Agendar Consulta</span>
                                    </m.button>
                                </Magnetic>

                                <Magnetic strength={isMobile ? 0 : 0.3} range={100} className={isMobile ? "w-full" : ""}>
                                    <m.button
                                        onClick={() => document.getElementById('casos')?.scrollIntoView({ behavior: 'smooth' })}
                                        whileHover={{
                                            y: -2,
                                            scale: 1.05,
                                            background: 'rgba(245, 245, 220, 0.2)',
                                            boxShadow: "0 8px 40px rgba(0,0,0,0.15)"
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            padding: '1rem 2.5rem',
                                            borderRadius: '9999px',
                                            background: 'transparent',
                                            backdropFilter: 'blur(10px)',
                                            WebkitBackdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            color: '#F5F5DC',
                                            fontWeight: 600,
                                            width: isMobile ? '100%' : 'auto',
                                            transition: 'all 0.3s ease'
                                        }}
                                        className="group flex items-center justify-center"
                                    >
                                        <span>Galeria de Resultados</span>
                                    </m.button>
                                </Magnetic>
                            </div>
                        </div>

                        {/* Glassmorphism Multistep Form */}
                        <AnimatePresence>
                            {isFormOpen && (
                                <m.div
                                    initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
                                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                                    className="absolute top-[48%] md:top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] z-[30] pointer-events-auto"
                                    style={{
                                        background: 'rgba(11, 11, 11, 0.65)',
                                        backdropFilter: 'blur(24px)',
                                        WebkitBackdropFilter: 'blur(24px)',
                                        border: '1px solid rgba(245, 245, 220, 0.12)',
                                        borderRadius: '24px',
                                        padding: isMobile ? '2.5rem 1.5rem' : '3.5rem 2.5rem',
                                        boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* Progress Line */}
                                    <div className="absolute top-0 left-0 h-[2px] bg-[#F5F5DC]/10 w-full">
                                        <m.div
                                            className="h-full bg-[#F5F5DC]/80"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(formStep / 4) * 100}%` }}
                                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                        />
                                    </div>

                                    {/* Close Button */}
                                    <button
                                        onClick={() => { setIsFormOpen(false); setTimeout(() => setFormStep(1), 500); }}
                                        className="absolute top-4 right-4 text-[#F5F5DC]/40 hover:text-[#F5F5DC] transition-colors p-2 rounded-full hover:bg-white/5"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" />
                                        </svg>
                                    </button>

                                    {/* Step 1: Identification */}
                                    {formStep === 1 && (
                                        <m.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                            className="flex flex-col gap-8"
                                        >
                                            <div className="flex flex-col gap-2 relative z-10">
                                                <h3 className="font-display text-2xl md:text-3xl text-[#F5F5DC] font-light">Seus dados</h3>
                                                <p className="text-[#F5F5DC]/60 font-sans text-sm">O primeiro passo para a sua nova assinatura visual.</p>
                                            </div>
                                            <div className="flex flex-col gap-6 relative z-10">
                                                <div className="flex flex-col gap-1.5 group">
                                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#F5F5DC]/50 font-sans transition-colors group-focus-within:text-[#F5F5DC]/80">Nome Completo</label>
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="Sua assinatura visual"
                                                        className="bg-transparent border-b border-[#F5F5DC]/20 py-2.5 text-[#F5F5DC] font-display text-xl focus:outline-none focus:border-[#F5F5DC]/80 transition-all placeholder:text-[#F5F5DC]/15 placeholder:font-light"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1.5 group">
                                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#F5F5DC]/50 font-sans transition-colors group-focus-within:text-[#F5F5DC]/80">WhatsApp</label>
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        placeholder="(11) 99999-9999"
                                                        className="bg-transparent border-b border-[#F5F5DC]/20 py-2.5 text-[#F5F5DC] font-display tracking-widest text-xl focus:outline-none focus:border-[#F5F5DC]/80 transition-all placeholder:text-[#F5F5DC]/15 placeholder:font-light"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setFormStep(2)}
                                                disabled={!formData.name || !formData.phone}
                                                className="mt-6 border border-[#F5F5DC]/20 bg-[#F5F5DC]/5 text-[#F5F5DC] py-4 rounded-full font-sans font-medium text-sm transition-all hover:bg-[#F5F5DC] hover:text-[#0B0B0B] disabled:opacity-30 disabled:hover:bg-[#F5F5DC]/5 disabled:hover:text-[#F5F5DC] relative z-10"
                                            >
                                                Próximo Passo
                                            </button>
                                        </m.div>
                                    )}

                                    {/* Step 2: Preference */}
                                    {formStep === 2 && (
                                        <m.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                            className="flex flex-col gap-7"
                                        >
                                            <button onClick={() => setFormStep(1)} className="text-[#F5F5DC]/40 text-xs text-left hover:text-[#F5F5DC] transition-colors flex items-center gap-2 -ml-2 -mt-2">
                                                <span>←</span> Voltar
                                            </button>
                                            <div className="flex flex-col gap-2">
                                                <h3 className="font-display text-2xl md:text-3xl text-[#F5F5DC] font-light">Seu objetivo</h3>
                                                <p className="text-[#F5F5DC]/60 font-sans text-sm">Qual especialidade você procura?</p>
                                            </div>
                                            <div className="flex flex-col gap-3 max-h-[40vh] overflow-y-auto no-scrollbar pb-2">
                                                {['Estética Dental (Lentes)', 'Harmonização Orogengival', 'Limpeza Profunda Premium', 'Avaliação Geral Exclusiva'].map((treatment) => (
                                                    <button
                                                        key={treatment}
                                                        onClick={() => setFormData({ ...formData, treatment })}
                                                        className={`text-left py-4 px-5 rounded-2xl border transition-all duration-300 ${formData.treatment === treatment ? 'border-[#F5F5DC]/60 bg-[#F5F5DC]/10 shadow-[0_0_20px_rgba(245,245,220,0.05)]' : 'border-[#F5F5DC]/10 hover:border-[#F5F5DC]/30 hover:bg-[#F5F5DC]/5'}`}
                                                    >
                                                        <span className="font-display text-[#F5F5DC]/90 tracking-wide text-lg">{treatment}</span>
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setFormStep(3)}
                                                disabled={!formData.treatment}
                                                className="mt-2 border border-[#F5F5DC]/20 bg-[#F5F5DC]/5 text-[#F5F5DC] py-4 rounded-full font-sans font-medium text-sm transition-all hover:bg-[#F5F5DC] hover:text-[#0B0B0B] disabled:opacity-30 disabled:hover:bg-[#F5F5DC]/5 disabled:hover:text-[#F5F5DC]"
                                            >
                                                Escolher Horário
                                            </button>
                                        </m.div>
                                    )}

                                    {/* Step 3: Calendar */}
                                    {formStep === 3 && (
                                        <m.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                            className="flex flex-col gap-8"
                                        >
                                            <button onClick={() => setFormStep(2)} className="text-[#F5F5DC]/40 text-xs text-left hover:text-[#F5F5DC] transition-colors flex items-center gap-2 -ml-2 -mt-2">
                                                <span>←</span> Voltar
                                            </button>
                                            <div className="flex flex-col gap-2">
                                                <h3 className="font-display text-2xl md:text-3xl text-[#F5F5DC] font-light">Sua disponibilidade</h3>
                                                <p className="text-[#F5F5DC]/60 font-sans text-sm">Quando fica melhor para você?</p>
                                            </div>

                                            <div className="flex flex-col gap-5">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#F5F5DC]/50 font-sans mb-1">Período Ideal</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {['Manhã', 'Tarde'].map((time) => (
                                                            <button
                                                                key={time}
                                                                onClick={() => setFormData({ ...formData, time })}
                                                                className={`py-4 rounded-xl border transition-all duration-300 ${formData.time === time ? 'border-[#F5F5DC]/60 bg-[#F5F5DC]/10 shadow-[0_0_20px_rgba(245,245,220,0.05)]' : 'border-[#F5F5DC]/10 hover:border-[#F5F5DC]/30 hover:bg-[#F5F5DC]/5'}`}
                                                            >
                                                                <span className="font-sans text-[15px] font-medium text-[#F5F5DC]/90">{time}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    // Submission logic simulation
                                                    setFormStep(4);
                                                }}
                                                disabled={!formData.time}
                                                className="mt-6 border border-[#F5F5DC]/20 bg-[#F5F5DC] text-[#0B0B0B] py-4 rounded-full font-sans font-medium text-sm transition-all hover:scale-[1.02] shadow-[0_4px_20px_rgba(245,245,220,0.15)] disabled:opacity-30 disabled:bg-[#F5F5DC]/5 disabled:text-[#F5F5DC] disabled:hover:scale-100 disabled:shadow-none"
                                            >
                                                Finalizar Agendamento
                                            </button>
                                        </m.div>
                                    )}

                                    {/* Step 4: Success */}
                                    {formStep === 4 && (
                                        <m.div
                                            initial={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
                                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="flex flex-col items-center justify-center text-center gap-7 py-8"
                                        >
                                            <div className="w-20 h-20 rounded-full border border-[#F5F5DC]/20 flex items-center justify-center relative">
                                                <div className="absolute inset-0 bg-[#F5F5DC]/5 rounded-full animate-pulse" />
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                                                    <path d="M5 13L9 17L19 7" stroke="#F5F5DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <h3 className="font-display text-3xl md:text-3xl text-[#F5F5DC] font-light leading-tight">
                                                    Em breve,<br />sua nova assinatura visual começa.
                                                </h3>
                                                <p className="text-[#F5F5DC]/50 font-sans text-[15px] max-w-[280px] mx-auto leading-relaxed">
                                                    Nossa Concierge entrará em contato via WhatsApp para alinhar os últimos detalhes.
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => { setIsFormOpen(false); setTimeout(() => setFormStep(1), 800); setFormData({ name: '', phone: '', email: '', treatment: '', date: '', time: '' }); }}
                                                className="mt-6 text-[#F5F5DC]/60 hover:text-[#F5F5DC] text-xs uppercase tracking-[0.2em] font-sans transition-colors border-b border-transparent hover:border-[#F5F5DC]/30 pb-1"
                                            >
                                                Voltar ao início
                                            </button>
                                        </m.div>
                                    )}
                                </m.div>
                            )}
                        </AnimatePresence>
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
                    animate={{
                        opacity: [0.35, 0.7, 0.35],
                        x: "-50%",
                        y: [0, 5, 0]
                    }}
                    transition={{
                        opacity: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                        y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                        delay: 5
                    }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[30] pointer-events-none"
                    style={{ opacity: 0.7 }}
                >
                    <span className="uppercase text-white text-[10px] tracking-[0.4em] font-light">Scroll</span>
                </m.div>

                {/* Vertical Cinematic Depth Gradient (Final Polish) */}
                <div
                    className="absolute inset-x-0 top-0 h-[40vh] z-[12] pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)' }}
                />
                <div
                    className="absolute inset-x-0 bottom-0 h-[30vh] z-[12] pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)' }}
                />
            </div>
        </section>
    );
}

