"use client";

import { m, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Registration MUST happen outside component to avoid re-registration on hot-reload
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Global sequence config
const TOTAL_FRAMES = 192;

// Expose a draw(frameIdx) method directly — GSAP calls this on every tick
type IntroSequenceHandle = { draw: (idx: number) => void, getCanvas: () => HTMLCanvasElement | null };

const IntroSequence = forwardRef<IntroSequenceHandle, { isMobile: boolean }>(function IntroSequence({ isMobile }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const framesRef = useRef<HTMLImageElement[]>([]);
    const loadedRef = useRef(false);

    // Progressive loading with web-worker simulation logic for performance
    useEffect(() => {
        let isMounted = true;
        const frames: HTMLImageElement[] = [];
        let loadedCount = 0;

        const loadPack = (start: number, end: number) => {
            for (let i = start; i <= end; i++) {
                if (!isMounted) return;
                const img = new Image();
                // Use the correct path based on your assets
                const index = i.toString();
                img.src = `/assets/hero-frames/frame-${index}.gif`;
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === TOTAL_FRAMES) {
                        loadedRef.current = true;
                    }
                };
                frames[i] = img;
            }
        };

        // prioritized load of first chunk to allow immediate sequence start
        loadPack(0, 40);
        setTimeout(() => loadPack(41, TOTAL_FRAMES - 1), 100);

        framesRef.current = frames;
        return () => { isMounted = false; };
    }, []);

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

            // Scaled precisely to 65% of height as per instruction
            const DRAW_SCALE = 0.65;

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
        },
        getCanvas() {
            return canvasRef.current;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [isMobile]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full block object-cover will-change-transform"
            style={{
                background: '#000',
                imageRendering: 'crisp-edges'
            }}
        />
    );
});

export function Hero() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const pinContainerRef = useRef<HTMLDivElement>(null);
    const videoWrapperRef = useRef<HTMLDivElement>(null);
    const contentWrapperRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);
    const scrollHintRef = useRef<HTMLDivElement>(null);
    const progressLineRef = useRef<HTMLDivElement>(null);
    const backlightRef = useRef<HTMLDivElement>(null);
    const sectionMounted = useRef(false);

    const shouldReduceMotion = useReducedMotion();
    const [mounted, setMounted] = useState(false);
    const [canStartSequence, setCanStartSequence] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [ctaSticky, setCtaSticky] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formStep, setFormStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', treatment: '', date: '', time: '' });
    const introRef = useRef<IntroSequenceHandle | null>(null);
    const targetProgress = useRef(0);
    const smoothedProgress = useRef(0);
    const isAnimating = useRef(false);

    useEffect(() => {
        setMounted(true);
        sectionMounted.current = true;
        setIsMobile(window.innerWidth < 768);

        // Pre-warm the component reveal
        setTimeout(() => setCanStartSequence(true), 300);

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!mounted || !canStartSequence) return;

        const ctx = gsap.context(() => {
            // 1. INTRO TIMELINE (Fixed Frames: 0 -> 120)
            const introTl = gsap.timeline({
                onUpdate: () => {
                    const progress = introTl.progress();
                    const frame = Math.floor(progress * 130);
                    if (introRef.current && !isAnimating.current) {
                        introRef.current.draw(frame);
                        smoothedProgress.current = frame;
                    }
                }
            });

            introTl.to({}, { duration: 3, ease: "none" });

            // Coordinated reveal triggered during intro
            const revealThreshold = TOTAL_FRAMES * (isMobile ? 0.35 : 0.85);
            let revealed = false;

            const checkReveal = (currentFrame: number) => {
                if (!revealed && currentFrame >= revealThreshold) {
                    revealed = true;
                    const tl = gsap.timeline({
                        defaults: { ease: "power4.out", duration: 1.8 }
                    });

                    tl.fromTo(titleRef.current,
                        { y: 60, opacity: 0 },
                        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }
                    )
                        .fromTo(descriptionRef.current,
                            { y: 20, opacity: 0 },
                            { y: 0, opacity: 1, duration: 1.4, ease: "power4.out" }, "-=1.0"
                        )
                        .fromTo(actionsRef.current,
                            { y: 15, opacity: 0 },
                            { y: 0, opacity: 1, duration: 1.2, delay: 0.4, ease: "power4.out" }, "-=1.0"
                        );
                }
            };

            // 2. SCROLL TRIGGER (Drives frame 130 -> 192 and Parallax)
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                onUpdate: (self) => {
                    if (sectionMounted.current) {
                        const progress = self.progress;
                        // Map 0 -> 1 scroll to frames 130 -> 192
                        const startFrame = 130;
                        const endFrame = 192;
                        targetProgress.current = startFrame + progress * (endFrame - startFrame);
                        isAnimating.current = true;

                        // Sticky CTA logic
                        if (progress > 0.4) {
                            if (!ctaSticky) setCtaSticky(true);
                        } else {
                            if (ctaSticky) setCtaSticky(false);
                        }

                        checkReveal(targetProgress.current);
                    }
                }
            });

            // Parallax Logic inside a ticker for smoothness beyond scrub
            const tickerRender = () => {
                const diff = targetProgress.current - smoothedProgress.current;
                smoothedProgress.current += diff * 0.35; // Smooth interpolation - increased from 0.1 for responsiveness

                const startFrame = 130;
                const endFrame = 192;
                const scrollProgress = (smoothedProgress.current - startFrame) / (endFrame - startFrame);
                const scrollValue = scrollProgress * (typeof window !== 'undefined' ? window.innerHeight : 0);

                if (titleRef.current) {
                    const titleY = !shouldReduceMotion ? Math.max(-60, scrollValue * -0.9) : 0;
                    gsap.set(titleRef.current, {
                        y: titleY,
                        opacity: 1,
                        force3D: true
                    });
                }

                if (descriptionRef.current) {
                    const descY = !shouldReduceMotion ? Math.max(-60, scrollValue * -1.0) : 0;
                    gsap.set(descriptionRef.current, {
                        y: descY,
                        opacity: 1,
                        force3D: true
                    });
                }

                if (introRef.current) {
                    const currentMouthScale = !shouldReduceMotion ? (1 + Math.min(0.03, (scrollProgress / 0.4) * 0.03)) : 1;
                    const mouthY = !shouldReduceMotion ? (scrollValue * 0.4) : 0;

                    const canvas = introRef.current.getCanvas();
                    if (canvas) {
                        gsap.set(canvas, {
                            y: mouthY,
                            scale: currentMouthScale,
                            filter: 'brightness(0.92)',
                            force3D: true
                        });
                    }
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
                        className="absolute w-[100vw] h-[100vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none will-change-transform"
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
                                ? 'radial-gradient(circle at center, black 25%, transparent 65%)'
                                : 'radial-gradient(circle at center, black 15%, transparent 45%)',
                            WebkitMaskImage: isMobile
                                ? 'radial-gradient(circle at center, black 25%, transparent 65%)'
                                : 'radial-gradient(circle at center, black 15%, transparent 45%)',
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
                <div className="hero-overlay-fix absolute inset-0 pointer-events-none" style={{ background: 'rgba(0, 0, 0, 0.45)', zIndex: 1 }} />

                {/* Ambient Particles (Disabled for cleaner look) */}
                {/* {!shouldReduceMotion && <AmbientParticles />} */}

                <div
                    ref={contentWrapperRef}
                    className="absolute inset-0 z-[3] w-full flex flex-col items-center text-center pointer-events-none"
                    style={{ padding: '24px 16px 36px 16px', justifyContent: 'center' }}
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
                            background: 'radial-gradient(circle at center, transparent 0%, rgba(26, 26, 26, 0.4) 100%)',
                            opacity: (mounted && canStartSequence) ? 1 : 0,
                            transition: 'opacity 1.5s ease-in-out'
                        }}
                    />

                    <div className="max-w-[95vw] lg:max-w-[1100px] perspective-1000 w-full flex flex-col items-center relative z-10">
                        {/* Branded Atmospheric Overlay */}


                        {/* Brand Eyebrow - The Anchor */}


                        <h1
                            ref={titleRef}
                            className={`hero-title ${(mounted && canStartSequence) ? 'in-view' : ''} text-center will-change-transform flex flex-col items-center relative w-full`}
                            style={{
                                color: '#FBFBFB',
                                fontSize: '36px',
                                fontWeight: 700,
                                lineHeight: 1.02,
                                letterSpacing: '-0.02em',
                                margin: '0 auto',
                                pointerEvents: isFormOpen ? 'none' : 'auto',
                                transform: `translateY(-12%)`,
                                textTransform: 'lowercase'
                            }}
                        >
                            sua assinatura.
                        </h1>

                        <div className="flex flex-col items-center w-full" style={{
                            opacity: isFormOpen ? 0 : 1,
                            transition: 'opacity 0.8s ease',
                            marginTop: '24px'
                        }}>
                            <p
                                ref={descriptionRef}
                                className="hero-subtitle text-center font-sans"
                                style={{
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    lineHeight: 1.4,
                                    color: '#E6E6E6',
                                    margin: '8px auto 0 auto',
                                    opacity: 1
                                }}
                            >
                                Segurança clínica. Resultado natural.
                            </p>

                            <div
                                ref={actionsRef}
                                className={`hero-ctas relative z-[50] flex flex-col items-center w-full transition-all duration-200 ease-out ${ctaSticky ? 'fixed bottom-4 left-4 w-[calc(100%-32px)] scale-[1.02]' : 'w-full'}`}
                                style={{ marginTop: '24px' }}
                            >
                                <button
                                    onClick={() => setIsFormOpen(true)}
                                    aria-label="Agendar consulta — abre formulário de agendamento"
                                    style={{
                                        width: '100%',
                                        height: ctaSticky ? '48px' : '52px',
                                        background: '#0B0B0B',
                                        color: '#FBFBFB',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        letterSpacing: '1px',
                                        textTransform: 'uppercase',
                                        border: 'none',
                                        boxShadow: '0 6px 18px rgba(11,11,11,0.12)',
                                        cursor: 'pointer',
                                        transition: 'opacity 200ms ease-out, transform 200ms ease-out',
                                        willChange: 'transform, opacity'
                                    }}
                                    className="cta-primary hover:opacity-90 active:scale-[0.98]"
                                >
                                    AGENDAR CONSULTA
                                </button>

                                {!ctaSticky && (
                                    <a
                                        href="#galeria"
                                        className="cta-secondary-link text-center"
                                        style={{
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            color: 'rgba(255,255,255,0.78)',
                                            opacity: 0.78,
                                            marginTop: '16px',
                                            display: 'inline-block',
                                            textDecoration: 'none',
                                            transition: 'opacity 200ms ease'
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.textDecoration = 'underline'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.opacity = '0.78'; e.currentTarget.style.textDecoration = 'none'; }}
                                    >
                                        ver galeria de resultados →
                                    </a>
                                )}
                            </div>
                        </div>
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
