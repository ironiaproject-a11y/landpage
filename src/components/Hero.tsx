"use client";

import { m, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AmbientParticles } from "./AmbientParticles";
import { Magnetic } from "./Magnetic";

gsap.registerPlugin(ScrollTrigger);

const SlideText = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <span className={`relative block overflow-hidden group cursor-default ${className}`}>
        <span className="block transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-[105%]">
            {children}
        </span>
        <span className="absolute inset-0 block -translate-x-[105%] transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-0">
            {children}
        </span>
    </span>
);


export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const pinContainerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
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
    const [isMobile, setIsMobile] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false); // Track play state for UI
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);

        if (typeof window !== "undefined") {
            checkMobile();
            window.addEventListener("resize", checkMobile);
            return () => window.removeEventListener("resize", checkMobile);
        }
    }, []);

    // Analytics and Flags (Mock)
    const logEvent = (eventName: string, params?: any) => {
        console.log(`[Analytics] ${eventName}`, params);
    };

    const handlePlayClick = () => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = false; // Try to unmute on interaction
        video.play().then(() => {
            setIsPlaying(true);
            logEvent('hero_play');
        }).catch((err) => {
            console.error("Play failed", err);
            // Fallback: try muted if unmuted fails (browser policy)
            video.muted = true;
            video.play().then(() => setIsPlaying(true));
        });
    };

    const playingRef = useRef(false);

    // Ultra-Aggressive Mobile Autoplay Watchdog
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !mounted) return;

        // Force critical attributes
        // Force critical attributes
        const enforceAttributes = () => {
            if (!video) return;
            video.muted = true;
            video.defaultMuted = true;
            video.setAttribute('muted', '');
            video.setAttribute('playsinline', '');
            video.setAttribute('autoplay', '');
            video.setAttribute('loop', '');
        };

        const attemptPlay = async () => {
            if (!video || playingRef.current || shouldReduceMotion) return;
            try {
                // Ensure all attributes are strictly set
                video.muted = true;
                video.defaultMuted = true;
                video.setAttribute('muted', '');
                video.setAttribute('playsinline', '');
                video.setAttribute('autoplay', '');
                video.setAttribute('loop', '');

                await video.play();
                playingRef.current = true;
                setIsPlaying(true);
                setVideoLoaded(true);
            } catch (err) {
                // Silently fail
            }
        };

        // Watchdog: Keep trying until it plays
        let rafId: number;
        const watchdog = () => {
            if (!playingRef.current && video) {
                attemptPlay();
                rafId = requestAnimationFrame(watchdog);
            }
        };

        // Interaction "Unlock" - Essential for iPhones in Low Power Mode
        const unlock = () => {
            if (video && !playingRef.current) {
                video.play().then(() => {
                    playingRef.current = true;
                    setIsPlaying(true);
                    setVideoLoaded(true);
                }).catch(() => { });
            }
            // Cleanup listeners after first interaction attempt
            ['touchstart', 'mousedown', 'keydown', 'scroll'].forEach(ev =>
                window.removeEventListener(ev, unlock)
            );
        };

        enforceAttributes();

        // Start watchdog and listeners
        rafId = requestAnimationFrame(watchdog);
        ['touchstart', 'mousedown', 'keydown', 'scroll'].forEach(ev =>
            window.addEventListener(ev, unlock, { passive: true })
        );

        // Visibility handling
        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible' && video && playingRef.current) {
                video.play().catch(() => { });
            }
        };
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            cancelAnimationFrame(rafId);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            ['touchstart', 'mousedown', 'keydown', 'scroll'].forEach(ev =>
                window.removeEventListener(ev, unlock)
            );
        };
    }, [mounted, shouldReduceMotion]);

    // GSAP Scroll & Entrance Animations
    useEffect(() => {
        if (!mounted) return;

        const ctx = gsap.context(() => {
            // 1. Entrance Animation (Handled by CSS for performance and reduced motion)
            const titleLines = Array.from(titleRef.current?.querySelectorAll(".title-line-inner") || []);

            // 2. Cinematic Scroll Logic
            if (!shouldReduceMotion) {
                // Desktop Version
                if (!isMobile) {
                    const scrollTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top top",
                            end: "+=500",
                            pin: pinContainerRef.current,
                            scrub: 1,
                            anticipatePin: 1
                        }
                    });

                    scrollTl.to(videoWrapperRef.current, {
                        yPercent: -20,
                        scale: 1.1,
                        ease: "none"
                    }, 0);

                    scrollTl.to(titleRef.current, {
                        scale: 0.94,
                        opacity: 0,
                        y: -100,
                        letterSpacing: "0.15em",
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
                }
                // Mobile Version (Premium Scroll Effect)
                else {
                    const mobileTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top top",
                            end: "bottom top",
                            scrub: true
                        }
                    });

                    // Video Parallax (0.75x speed/intensity)
                    mobileTl.to(videoWrapperRef.current, {
                        y: "40%", // Stronger parallax effect
                        scale: 1.1, // Subtle zoom for cinematic feel
                        ease: "none"
                    }, 0);

                    // Text Exit (Higher speed/fade)
                    mobileTl.to([titleRef.current, descriptionRef.current], {
                        opacity: 0,
                        y: -30,
                        ease: "power2.inOut",
                        stagger: 0.05
                    }, 0);

                    // CTA Exit (Later fade + subtle scale)
                    mobileTl.to(actionsRef.current, {
                        opacity: 0,
                        scale: 0.96,
                        y: -10,
                        ease: "power1.inOut"
                    }, 0.1);
                }
            }

            // Dark Overlay Fade-in Animation (User-requested) - Applies to both desktop/mobile if not reduced motion
            if (!shouldReduceMotion) {
                gsap.to(overlayDarkRef.current, {
                    opacity: 0.7,
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
                {/* Background Video / X-ray Layer */}
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

                    <video
                        ref={videoRef}
                        src="/hero-background.mp4"
                        autoPlay={!shouldReduceMotion}
                        playsInline
                        muted
                        loop
                        preload="metadata"
                        poster="/assets/images/clinic-interior.png"
                        onCanPlay={() => setVideoLoaded(true)}
                        className={`w-full h-full object-cover object-center brightness-[0.5] lg:brightness-[0.8] saturate-[0.8] lg:saturate-100 transition-opacity duration-700 ${videoLoaded ? 'opacity-90 lg:opacity-70' : 'opacity-40 lg:opacity-0'}`}
                    />
                </div>

                {/* Ambient Particles */}
                {!shouldReduceMotion && <AmbientParticles />}

                {/* Mobile Play Button overlay */}
                {isMobile && !isPlaying && (
                    <button
                        onClick={handlePlayClick}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-20 h-20 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm animate-pulse border border-white/20 shadow-lg"
                        aria-label="Reproduzir vídeo"
                    >
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </button>
                )}

                {/* Main Content */}
                <div
                    ref={contentWrapperRef}
                    className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center items-center lg:items-start pt-32 lg:pt-40 pb-16 lg:pb-0 text-center lg:text-left"
                >
                    <div className="max-w-[850px] lg:max-w-none perspective-1000 w-full flex flex-col items-center lg:items-start">
                        <m.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.15,
                                        delayChildren: 0.2
                                    }
                                }
                            }}
                            className="mb-4 lg:mb-10 w-full"
                        >
                            <h1 ref={titleRef} className="font-medium text-[#FAF9F7] tracking-tight will-change-transform">
                                <span className="block mb-0 lg:mb-2 overflow-hidden pb-1">
                                    <m.span
                                        variants={{
                                            hidden: { y: "30%", opacity: 0 },
                                            visible: {
                                                y: "0%",
                                                opacity: 1,
                                                transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
                                            }
                                        }}
                                        className="inline-block text-[clamp(28px,6vw,42px)] lg:text-[clamp(1.8rem,8vw,5.5rem)] leading-[1.1] lg:leading-[1.1] max-w-[92%] lg:max-w-none mx-auto lg:mx-0"
                                    >
                                        Seu sorriso,
                                    </m.span>
                                </span>
                                <span className="block overflow-hidden pb-1">
                                    <m.span
                                        variants={{
                                            hidden: { y: "30%", opacity: 0 },
                                            visible: {
                                                y: "0%",
                                                opacity: 1,
                                                transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
                                            }
                                        }}
                                        className={`inline-block ${isMobile ? 'font-playfair italic font-light' : 'italic font-light'} text-[var(--color-silver-bh)] text-[clamp(28px,6vw,42px)] lg:text-[clamp(1.8rem,8vw,5.5rem)] leading-[1.1] lg:leading-[1.1] max-w-[92%] lg:max-w-none mx-auto lg:mx-0`}
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

