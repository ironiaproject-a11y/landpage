"use client";

import { m, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AmbientParticles } from "./AmbientParticles";
import { Magnetic } from "./Magnetic";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // GSAP Refs
    const titleRef = useRef<HTMLHeadingElement>(null);

    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);
    const contentWrapperRef = useRef<HTMLDivElement>(null);

    const [mounted, setMounted] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const { scrollY } = useScroll();
    const videoY = useTransform(
        scrollY,
        [0, 800],
        [0, 100]
    );
    const videoScale = useTransform(
        scrollY,
        [0, 1000],
        [1, 1.15]
    );

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();

        if (videoRef.current && videoRef.current.readyState >= 3) {
            setVideoLoaded(true);
        }

        window.addEventListener("resize", checkMobile);

        // Fallback: Force video loaded state after 2.5s if event doesn't fire
        const timeoutId = setTimeout(() => {
            if (!videoLoaded) {
                console.log("Force enabling video visibility after timeout");
                setVideoLoaded(true);
            }
        }, 2500);

        return () => {
            window.removeEventListener("resize", checkMobile);
            clearTimeout(timeoutId);
        };
    }, []);

    // Premium GSAP Entrance & Scroll Animation
    useEffect(() => {
        if (!mounted) return;

        const ctx = gsap.context(() => {
            // 1. Entrance Timeline
            const entranceTl = gsap.timeline({
                defaults: { ease: "power4.out", duration: 1.8 }
            });

            const titleLines = Array.from(titleRef.current?.querySelectorAll(".title-line-inner") || []);

            gsap.set([descriptionRef.current, actionsRef.current], {
                opacity: 0,
                x: -50 // Start from left
            });

            if (titleLines.length > 0) {
                gsap.set(titleLines, {
                    x: -100, // Start from left
                    y: 0,
                    skewX: -10, // Slight skew for dynamic look
                    opacity: 0,
                    filter: "blur(20px)",
                    scale: 1.05
                });
            }

            // Timeline Sequence
            // Timeline Sequence

            if (titleLines.length > 0) {
                entranceTl.to(titleLines, {
                    x: 0,
                    skewX: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    scale: 1,
                    stagger: {
                        each: 0.15,
                        from: "start",
                        ease: "power2.inOut"
                    },
                    duration: 2.2,
                    ease: "expo.out"
                }, "-=1.2");
            }

            entranceTl.to(descriptionRef.current, {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 2,
                ease: "power2.out"
            }, "-=1.8")
                .to(actionsRef.current, {
                    opacity: 1,
                    x: 0,
                    duration: 1.5,
                    stagger: 0.15,
                    ease: "power2.out"
                }, "-=1.5");

            // 2. Scroll Triggered Parallax Fade (Up and Down) - Cinematic Depth
            if (!shouldReduceMotion) {
                // Wrapper Fade & Focus Out on Scroll
                gsap.fromTo(contentWrapperRef.current,
                    { y: 0, opacity: 1, filter: "blur(0px)" },
                    {
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top top",
                            end: "60% top",
                            scrub: true,
                            immediateRender: false
                        },
                        y: -150,
                        opacity: 0,
                        filter: "blur(10px)",
                        ease: "none"
                    }
                );

                // Letter Spacing & Scale Parallax
                if (titleLines) {
                    gsap.to(titleLines, {
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top top",
                            end: "80% top",
                            scrub: 1.5,
                        },
                        letterSpacing: "0.05em",
                        scale: 0.95,
                        ease: "none"
                    });
                }

                // Foreground Details Parallax
                gsap.to(".hero-foreground-parallax-fast", {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 0.5,
                    },
                    y: -400,
                    rotate: 45,
                    ease: "none"
                });

                gsap.to(".hero-foreground-parallax-med", {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1,
                    },
                    y: -250,
                    rotate: -20,
                    ease: "none"
                });

                gsap.to(".hero-foreground-parallax-slow", {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 2,
                    },
                    y: -150,
                    rotate: 10,
                    ease: "none"
                });
            }

        }, sectionRef);

        return () => ctx.revert();
    }, [mounted, shouldReduceMotion]);

    return (
        <section
            ref={sectionRef}
            className="relative h-screen w-full bg-[#0B0B0B] overflow-hidden"
        >
            <div
                ref={containerRef}
                className="relative h-full w-full flex items-center"
            >
                {/* Background Video Container */}
                <m.div
                    style={{
                        y: !shouldReduceMotion ? (isMobile ? useTransform(scrollY, [0, 800], [0, 50]) : videoY) : 0,
                        scale: !shouldReduceMotion ? (isMobile ? useTransform(scrollY, [0, 1000], [1, 1.08]) : videoScale) : 1,
                    }}
                    className="hero-video-container absolute inset-0 z-0 origin-center"
                >
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none opacity-80" />
                    <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black pointer-events-none" />

                    <AnimatePresence>
                        {!videoLoaded && (
                            <m.div
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="absolute inset-0 z-15 bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
                            >
                                <div className="absolute inset-0 w-full h-full skeleton-shimmer opacity-20" />
                                <m.div
                                    animate={{
                                        opacity: [0.3, 0.6, 0.3],
                                        scale: [0.98, 1, 0.98]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-32 h-32 rounded-full border border-[var(--color-silver-bh)]/20 flex items-center justify-center"
                                >
                                    <Star strokeWidth={1.2} className="w-8 h-8 text-[var(--color-silver-bh)]/30" />
                                </m.div>
                            </m.div>
                        )}
                    </AnimatePresence>

                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        poster="/assets/images/clinic-interior.png"
                        onCanPlay={() => setVideoLoaded(true)}
                        className={`w-full h-full object-cover brightness-[0.7] contrast-[1.05] transition-opacity duration-[1500ms] hero-video ${videoLoaded ? 'opacity-80' : 'opacity-0'}`}
                    >
                        <source src="/hero-background.mp4" type="video/mp4" />
                    </video>
                </m.div>

                {/* Ambient Particles Layer */}
                {!shouldReduceMotion && <AmbientParticles />}

                {/* Background Depth Layers */}
                {!shouldReduceMotion && !isMobile && (
                    <div className="absolute inset-0 z-10 pointer-events-none">
                        <m.div
                            style={{
                                y: useTransform(scrollY, [0, 1000], [0, -200]),
                                x: useTransform(scrollY, [0, 1000], [0, 50]),
                            }}
                            className="absolute top-[15%] right-[10%] w-64 h-64 bg-gradient-to-br from-[var(--color-silver-bh)]/10 to-transparent rounded-full blur-[100px]"
                        />
                        <m.div
                            style={{
                                y: useTransform(scrollY, [0, 1000], [0, -400]),
                                x: useTransform(scrollY, [0, 1000], [0, -100]),
                            }}
                            className="absolute bottom-[20%] left-[5%] w-96 h-96 bg-gradient-to-tr from-[var(--color-silver-bh)]/5 to-transparent rounded-full blur-[120px]"
                        />
                    </div>
                )}


                {/* Typography Content */}
                <div
                    ref={contentWrapperRef}
                    className="relative z-20 container mx-auto px-[5%] md:px-[8%] h-full flex flex-col justify-center items-start"
                >
                    <div className="relative max-w-[800px]">
                        {/* Decorative background text removed to keep the video area clean */}


                        {/* Badge - Micro Accent */}


                        {/* Heading Group */}
                        <div className="mb-10 relative">
                            {/* Main H1 - Modern Editorial CLAMP Optimized */}
                            <h1 ref={titleRef} className="font-display font-medium text-[#FAF9F7] leading-[1.1] tracking-tight drop-shadow-2xl translate-z-20">
                                <span className="block text-[clamp(40px,6.5vw,72px)] mb-3">
                                    <span className="title-line-inner inline-block">Seu Sorriso,</span>
                                </span>
                                <span className="block text-[clamp(40px,6.5vw,72px)]">
                                    <span className="title-line-inner inline-block italic font-light text-[var(--color-silver-bh)]">Sua Assinatura</span>.
                                </span>
                            </h1>
                        </div>

                        {/* Body Copy - Increased vertical spacing for better flow */}
                        <div className="overflow-hidden mb-20">
                            <p
                                ref={descriptionRef}
                                className="text-base md:text-xl text-[var(--color-text-dim)] leading-relaxed font-light max-w-[52ch] opacity-0"
                            >
                                A harmonia perfeita entre a ciência avançada e a estética de alta costura. Projetamos o seu sorriso como uma obra de arte única e irreplicável.
                            </p>
                        </div>

                        <div
                            ref={actionsRef}
                            className="flex flex-col sm:flex-row gap-8 opacity-0"
                        >
                            <Magnetic strength={0.3} range={100}>
                                <m.button
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="btn-luxury-primary group flex items-center justify-center gap-4 px-10"
                                >
                                    <span className="relative z-10 flex items-center gap-4">
                                        Agendar Consulta
                                        <ArrowRight strokeWidth={1.2} className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500 ease-out" />
                                    </span>
                                </m.button>
                            </Magnetic>

                            <Magnetic strength={0.3} range={100}>
                                <m.button
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    onClick={() => document.getElementById('casos')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="btn-luxury-ghost group flex items-center justify-center gap-4 px-10"
                                >
                                    Ver Casos Clínicos
                                </m.button>
                            </Magnetic>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <m.div
                    initial={{ opacity: 0 }}
                    animate={mounted ? { opacity: 1 } : {}}
                    transition={{ delay: 2.5, duration: 1 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
                >
                    <span className="text-[10px] uppercase tracking-[0.5em] font-medium text-white/30 vertical-text">Scroll</span>
                    <div className="w-[1px] h-20 bg-gradient-to-b from-white/40 via-white/10 to-transparent" />
                </m.div>
            </div>

            {/* Ambient Lighting */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] glow-blob-warm opacity-20 pointer-events-none" />
            <div className="absolute bottom-10 right-0 w-[40%] h-[40%] glow-blob opacity-10 pointer-events-none" />
        </section >
    );
}

