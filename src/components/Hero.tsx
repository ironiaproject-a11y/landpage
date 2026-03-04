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
                            defaults: { ease: "power4.out", duration: 1.4 }
                        });

                        tl.fromTo(".hero-eyebrow",
                            { y: 15, opacity: 0 },
                            { y: 0, opacity: 0.6, duration: 1.2 }
                        )
                            .fromTo(".hero-title-line-1",
                                { y: 30, opacity: 0 },
                                { y: 0, opacity: 1 }, "-=0.9"
                            )
                            .fromTo(".hero-title-line-2",
                                { y: 20, opacity: 0 },
                                { y: 0, opacity: 0.8 }, "-=1.1"
                            )
                            .fromTo(descriptionRef.current,
                                { y: 15, opacity: 0, filter: "blur(4px)" },
                                { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.0 }, "-=1.0"
                            )
                            .fromTo(actionsRef.current,
                                { y: 10, opacity: 0, scale: 0.98 },
                                { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, "-=0.7"
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

                // Parallax of content (Layered depth)
                gsap.to(contentWrapperRef.current, {
                    y: () => window.innerHeight * -0.06,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 0.9
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
                    const tracking = scrollProgress * 15; // Expansão elegante
                    const scale = 1 + scrollProgress * 0.1; // "Câmera atravessando o texto"
                    const opacity = Math.max(0, 1 - Math.pow(scrollProgress, 1.2) * 2);

                    // Aplica na Primeira Linha
                    gsap.set(".hero-title-line-1", {
                        letterSpacing: `${tracking}px`,
                        scale: scale,
                        opacity: opacity,
                        y: -(scrollProgress * 20) // Movimento vertical mínimo para não 'bater'
                    });

                    // Aplica na Segunda Linha (com leve atraso/parallax no dissolve)
                    gsap.set(".hero-title-line-2", {
                        letterSpacing: `${tracking * 0.8}px`,
                        scale: 1 + scrollProgress * 0.08,
                        opacity: Math.max(0, 1 - Math.pow(scrollProgress, 0.8) * 1.5),
                        y: -(scrollProgress * 40)
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
                                : 'radial-gradient(circle at center, black 10%, transparent 55%)'
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
                    className="absolute inset-0 z-[3] w-full flex flex-col items-center justify-center text-center pointer-events-none"
                    style={{ padding: '0 5vw' }}
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
                        <m.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={(mounted && canStartSequence) ? { opacity: 0.15, y: 0 } : { opacity: 0, y: 10 }}
                            transition={{ delay: 5.5, duration: 2 }}
                            className="absolute top-[-25%] left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none select-none"
                        >
                            <span className="font-display text-[12vw] font-black text-white uppercase tracking-[0.2em] opacity-15">
                                CLÍNICA.
                            </span>
                        </m.div>

                        {/* Brand Eyebrow - The Anchor */}
                        <div
                            className="mb-8 opacity-0 hero-eyebrow"
                        >
                            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.5em] text-white/80 uppercase">Estética de Alta Performance</span>
                        </div>

                        <h1
                            ref={titleRef}
                            className={`hero-title ${(mounted && canStartSequence) ? 'in-view' : ''} font-display text-[clamp(2rem,7.5vw,5.5rem)] will-change-transform leading-[0.98] mb-12 transform -translate-y-[15px] !opacity-100 flex flex-col items-center relative`}
                            style={{
                                textShadow: '0 12px 35px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.3)',
                                fontSize: isMobile ? 'clamp(2.4rem, 10vw, 3.2rem)' : undefined,
                                background: 'linear-gradient(to bottom, #FFFFFF 0%, #E5E7EB 50%, #D1D5DB 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                transition: 'none'
                            }}
                        >
                            {/* Staggered Composition - Reduced Displacement for "Clean" look */}
                            <span className="block font-black uppercase tracking-tight sm:mr-[10%] opacity-0 hero-title-line-1">Seu Sorriso,</span>
                            <span
                                className="block font-light italic lowercase tracking-[-0.01em] sm:ml-[10%] sm:-mt-2 opacity-0 hero-title-line-2"
                                style={{
                                    fontFamily: 'var(--font-editorial)',
                                    backgroundImage: 'linear-gradient(to bottom, #FAF9F7, #CBD5E1)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                sua assinatura
                            </span>
                        </h1>

                        <div className="overflow-hidden w-full transform" style={{ marginBottom: '28px' }}>
                            <p
                                ref={descriptionRef}
                                className="font-semibold tracking-[0.02em] text-center text-[#FBFBF9] leading-[1.4] body-text-refined px-4 text-balance opacity-0"
                                style={{
                                    fontSize: isMobile ? '15px' : '16px',
                                    fontWeight: 600,
                                    maxWidth: isMobile ? 'min(90vw, 380px)' : '720px',
                                    margin: isMobile ? '10px auto 0px' : '14px auto 0px',
                                    textShadow: '0 2px 8px rgba(0,0,0,0.30)',
                                    textTransform: 'none'
                                }}
                            >
                                Segurança clínica. Resultado natural.
                            </p>
                        </div>


                        <div ref={actionsRef} className="hero-ctas relative z-[4] py-2 flex flex-col sm:flex-row items-center justify-center w-full px-5 pointer-events-auto opacity-0" style={{ gap: isMobile ? 16 : 24 }}>
                            <Magnetic strength={isMobile ? 0 : 0.3} range={100} className={isMobile ? "w-full" : ""}>
                                <m.button
                                    onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                                    whileHover={!isMobile ? { y: -5, scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.28)" } : {}}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', padding: '18px 42px', minHeight: isMobile ? 60 : 56, fontSize: isMobile ? 16 : 18, width: isMobile ? '100%' : 'auto', transform: 'translateZ(0)' }}
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
                                    whileHover={!isMobile ? { y: -3, scale: 1.01, opacity: 1 } : {}}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        WebkitTapHighlightColor: 'transparent',
                                        touchAction: 'manipulation',
                                        background: 'rgba(11,11,11,0.28)', // Refined secondary CTA
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        color: 'rgba(255,255,255,0.92)',
                                        padding: '18px 36px',
                                        minHeight: isMobile ? 56 : 52,
                                        fontSize: isMobile ? 16 : 18,
                                        width: isMobile ? '100%' : 'auto',
                                        maxWidth: isMobile ? 420 : 'none',
                                        backdropFilter: 'blur(6px)'
                                    }}
                                    className="group bg-gallery flex items-center justify-center gap-3 rounded-full transition-all hover:bg-white/10 hover:border-white/30 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#C7A86B]/40 focus-visible:outline-offset-[3px]"
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
                    animate={{
                        opacity: [0.4, 0.8, 0.4],
                        x: "-50%",
                        y: [0, 5, 0]
                    }}
                    transition={{
                        opacity: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                        y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                        delay: isMobile ? 2.5 : 5
                    }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-4"
                >
                    <span className="text-[10px] uppercase tracking-[0.4em] text-white/60 font-bold">Scroll</span>
                    <div className="relative w-px h-16 overflow-hidden">
                        <div className="absolute inset-0 bg-white/10" />
                        <m.div
                            animate={{
                                y: ["-100%", "100%"]
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-accent)] to-transparent"
                        />
                    </div>
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

