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

    // Forced Video Playback for Mobile Reliability (Initial Autoplay Muted)
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const attemptPlay = async () => {
            if (!video || isPlaying) return;
            try {
                video.muted = true;
                video.defaultMuted = true;
                video.setAttribute('muted', '');
                video.setAttribute('playsinline', '');

                await video.play();
                setVideoLoaded(true);
                setIsPlaying(true);
            } catch (error) {
                console.log("Autoplay blocked, waiting for interaction", error);
                setVideoLoaded(true);
            }
        };

        // Aggressive "Unlock" for mobile: any interaction triggers play if not already playing
        const unlockVideo = () => {
            if (video && !isPlaying) {
                video.play().then(() => {
                    setIsPlaying(true);
                    setVideoLoaded(true);
                }).catch(() => { });
            }
            // Remove listeners after first interaction
            window.removeEventListener('touchstart', unlockVideo);
            window.removeEventListener('mousedown', unlockVideo);
            window.removeEventListener('keydown', unlockVideo);
        };

        if (video.readyState >= 2) {
            attemptPlay();
        } else {
            video.addEventListener('loadedmetadata', attemptPlay);
        }

        window.addEventListener('touchstart', unlockVideo, { passive: true });
        window.addEventListener('mousedown', unlockVideo, { passive: true });
        window.addEventListener('keydown', unlockVideo, { passive: true });

        // Handle visibility changes
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && isPlaying) {
                video.play().catch(() => { });
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            video.removeEventListener('loadedmetadata', attemptPlay);
            window.removeEventListener('touchstart', unlockVideo);
            window.removeEventListener('mousedown', unlockVideo);
            window.removeEventListener('keydown', unlockVideo);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [mounted, isPlaying]); // Added isPlaying to help logic, but unlockVideo handles cleanup

    // GSAP Scroll & Entrance Animations
    useEffect(() => {
        if (!mounted) return;

        const ctx = gsap.context(() => {
            // 1. Entrance Animation
            const entranceTl = gsap.timeline({
                defaults: { ease: "power4.out", duration: 1.8 }
            });

            const titleLines = Array.from(titleRef.current?.querySelectorAll(".title-line-inner") || []);

            gsap.set([descriptionRef.current, actionsRef.current], {
                opacity: 0,
                y: 30
            });

            if (titleLines.length > 0) {
                gsap.set(titleLines, {
                    y: 100,
                    opacity: 0,
                    skewY: 7,
                    filter: isMobile ? "none" : "blur(10px)"
                });

                entranceTl.to(titleLines, {
                    y: 0,
                    opacity: 1,
                    skewY: 0,
                    filter: isMobile ? "none" : "blur(0px)",
                    stagger: 0.1,
                    duration: 1.5,
                    ease: "expo.out"
                });
            }

            entranceTl.to([descriptionRef.current, actionsRef.current], {
                opacity: 1,
                y: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "power3.out"
            }, "-=1");

            // 2. Cinematic Scroll Logic (Desktop Only)
            if (!shouldReduceMotion && !isMobile) {
                // Main Pinning & Parallax Timeline
                const scrollTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "+=500", // Pinned duration in px
                        pin: pinContainerRef.current,
                        scrub: 1, // Fluid but responsive
                        anticipatePin: 1
                    }
                });

                // X-ray / Video Background Parallax
                scrollTl.to(videoWrapperRef.current, {
                    yPercent: -20, // Move background up
                    scale: 1.1,
                    ease: "none"
                }, 0);

                // Headline Refinement on Scroll (Editorial Evaporation)
                scrollTl.to(titleRef.current, {
                    scale: 0.94,
                    opacity: 0,
                    y: -100,
                    letterSpacing: "0.15em",
                    filter: "blur(15px)",
                    ease: "power2.in"
                }, 0);

                // Progress Line Animation
                scrollTl.to(progressLineRef.current, {
                    scaleY: 1,
                    ease: "none"
                }, 0);

                // Content Wrapper Fade & Parallax
                scrollTl.to(contentWrapperRef.current, {
                    opacity: 0,
                    y: -50,
                    filter: "blur(8px)",
                    ease: "none"
                }, 0);

                // Additional Headline Animation (User-requested)
                gsap.to(titleRef.current, {
                    scale: 0.9,
                    y: -40,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    }
                });

                // Dark Overlay Fade-in Animation (User-requested)
                gsap.to(overlayDarkRef.current, {
                    opacity: 0.7,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top center",
                        end: "bottom top",
                        scrub: true
                    }
                });
            } else if (isMobile) {
                // Minimal parallax for mobile to ensure performance
                gsap.to(videoWrapperRef.current, {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        end: "bottom top",
                        scrub: 0.5,
                        markers: false
                    },
                    yPercent: -15,
                    scale: 1.15
                });

                // Scroll Hint Fade Out
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

                // Subtle Headline micro-parallax for mobile
                gsap.to(titleRef.current, {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        end: "bottom top",
                        scrub: 0.8,
                        markers: false
                    },
                    y: -20,
                    scale: 0.98,
                    opacity: 0.9
                });
            }

        }, sectionRef);

        return () => ctx.revert();
    }, [mounted, shouldReduceMotion, isMobile]);

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-[100dvh] flex flex-col overflow-visible bg-[#0a0a0a]"
        >
            <div
                ref={pinContainerRef}
                className="relative h-[100dvh] lg:h-screen w-full flex items-center overflow-hidden"
            >
                {/* Background Video / X-ray Layer */}
                <div
                    ref={videoWrapperRef}
                    className="absolute inset-0 z-0 origin-center will-change-transform"
                >
                    {/* Radial Spotlight Overlay */}
                    <div
                        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-1000"
                        style={{
                            background: isMobile
                                ? 'radial-gradient(circle at 50% 40%, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.55) 60%)'
                                : 'linear-gradient(to right, black, rgba(0,0,0,0.2), transparent)'
                        }}
                    />
                    {/* Darker base overlay for text contrast on edges */}
                    <div className={`absolute inset-0 z-10 bg-black/20 ${isMobile ? 'block' : 'hidden'}`} />

                    {/* Dark Overlay (Animated on Scroll) */}
                    <div
                        ref={overlayDarkRef}
                        className="overlay-dark absolute inset-0 z-[11] bg-black/0 pointer-events-none"
                        style={{ opacity: 0 }}
                    />


                    <video
                        ref={videoRef}
                        src="/hero-background.mp4"
                        autoPlay
                        playsInline
                        muted
                        loop
                        preload="auto"
                        onCanPlay={() => setVideoLoaded(true)}
                        className={`w-full h-full object-cover brightness-[0.6] contrast-[1.2] lg:brightness-[0.8] transition-opacity duration-700 ${videoLoaded ? 'opacity-90 lg:opacity-70' : 'opacity-40 lg:opacity-0'}`}
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
                    className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center items-center lg:items-start pt-[120px] lg:pt-32 pb-20 lg:pb-0 text-center lg:text-left"
                >
                    <div className="max-w-[850px] lg:max-w-none perspective-1000 w-full flex flex-col items-center lg:items-start" style={{ textShadow: isMobile ? "0 4px 12px rgba(0,0,0,0.5)" : "none" }}>
                        <div className="mb-5 lg:mb-10 w-full">
                            <h1 ref={titleRef} className={`${isMobile ? 'font-playfair' : 'text-hero-editorial'} font-medium text-[#FAF9F7] tracking-tight will-change-transform`}>
                                <span className="block mb-0 lg:mb-2 overflow-hidden pb-1">
                                    <span className="title-line-inner inline-block text-[36px] sm:text-[40px] lg:text-[clamp(1.8rem,8vw,5.5rem)] leading-[1.05] lg:leading-[1.1]">Seu sorriso,</span>
                                </span>
                                <span className="block overflow-hidden pb-1">
                                    <span className={`title-line-inner inline-block ${isMobile ? 'font-playfair italic font-light' : 'italic font-light'} text-[var(--color-silver-bh)] text-[36px] sm:text-[40px] lg:text-[clamp(1.8rem,8vw,5.5rem)] leading-[1.05] lg:leading-[1.1]`}>sua assinatura.</span>
                                </span>
                            </h1>
                        </div>

                        <div className="overflow-hidden mb-8 lg:mb-14 w-full">
                            <p ref={descriptionRef} className="text-white/90 lg:text-white/80 max-w-[90%] lg:max-w-[55ch] mx-auto lg:mx-0 text-[15px] sm:text-[16px] lg:text-[1.75rem] leading-[1.6] lg:leading-relaxed px-2 lg:px-0 backdrop-blur-[2px] lg:backdrop-blur-none rounded-lg py-2 lg:py-0">
                                A harmonia perfeita entre ciência avançada e estética de alta costura.
                            </p>
                        </div>

                        <div ref={actionsRef} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 w-full sm:w-auto mt-6 lg:mt-0">
                            <Magnetic strength={isMobile ? 0 : 0.3} range={100}>
                                <m.button
                                    onClick={() => logEvent('cta_agendar_click')}
                                    whileHover={!isMobile ? { y: -5, scale: 1.02 } : {}}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative flex items-center justify-center gap-4 px-10 w-full sm:w-auto h-[64px] lg:h-auto py-0 lg:py-6 bg-[#FAF9F7] text-[#0B0B0B] rounded-full font-bold shadow-2xl overflow-hidden"
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
                                    whileHover={!isMobile ? { y: -5, scale: 1.02 } : {}}
                                    whileTap={{ scale: 0.95 }}
                                    className="group flex items-center justify-center gap-4 px-10 w-full sm:w-auto h-[56px] lg:h-auto py-0 lg:py-6 bg-transparent border border-white/20 text-white/80 rounded-full backdrop-blur-sm transition-all hover:bg-white/5"
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
        </section>
    );
}

