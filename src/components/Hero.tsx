"use client";

import { m, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

    const [mounted, setMounted] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();

        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Forced Video Playback for Mobile Reliability
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const attemptPlay = async () => {
            try {
                video.muted = true;
                video.setAttribute('muted', '');
                video.setAttribute('playsinline', '');
                await video.play();
                setVideoLoaded(true);
            } catch (error) {
                console.log("Autoplay blocked, retry after interaction or wait", error);

                // Secondary retry logic for mobile quirks
                const retryOnInteraction = () => {
                    video.play().catch(() => { });
                    window.removeEventListener('click', retryOnInteraction);
                    window.removeEventListener('touchstart', retryOnInteraction);
                };
                window.addEventListener('click', retryOnInteraction);
                window.addEventListener('touchstart', retryOnInteraction);
            }
        };

        attemptPlay();

        // Handle visibility changes (resume play when returning to tab)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                video.play().catch(() => { });
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [mounted]);

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
            } else if (isMobile) {
                // Minimal parallax for mobile to ensure performance
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
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/60 to-black/30 lg:via-black/20 lg:to-transparent pointer-events-none opacity-90" />
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-transparent to-black pointer-events-none" />

                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    poster="/assets/images/clinic-interior.png"
                    onCanPlay={() => setVideoLoaded(true)}
                    className={`w-full h-full object-cover brightness-[0.8] contrast-[1.3] transition-opacity duration-[2000ms] ${videoLoaded ? 'opacity-60 lg:opacity-70' : 'opacity-0'}`}
                >
                    <source src="/hero-background.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Ambient Particles */}
            {!shouldReduceMotion && <AmbientParticles />}

            {/* Main Content */}
            <div
                ref={contentWrapperRef}
                className="relative z-20 container mx-auto px-[6%] h-full flex flex-col justify-center items-center lg:items-start pt-28 lg:pt-32 text-center lg:text-left"
            >
                <div className="max-w-[850px] perspective-1000 w-full flex flex-col items-center lg:items-start">
                    <div className="mb-6 lg:mb-10 overflow-hidden w-full">
                        <h1 ref={titleRef} className="text-hero-editorial font-medium text-[#FAF9F7] tracking-tight will-change-transform">
                            <span className="block mb-1 lg:mb-2 overflow-hidden">
                                <span className="title-line-inner inline-block">Seu Sorriso,</span>
                            </span>
                            <span className="block overflow-hidden">
                                <span className="title-line-inner inline-block italic font-light text-[var(--color-silver-bh)]">Sua Assinatura.</span>
                            </span>
                        </h1>
                    </div>

                    <div className="overflow-hidden mb-10 lg:mb-14 w-full">
                        <p ref={descriptionRef} className="text-subheadline-editorial text-white/90 lg:text-white/80 max-w-[55ch] mx-auto lg:mx-0 text-base md:text-xl lg:text-[1.75rem] leading-relaxed">
                            A harmonia perfeita entre a ciência avançada e a estética de alta costura.
                            Projetamos o seu sorriso como uma obra de arte única e irrepetível.
                        </p>
                    </div>

                    <div ref={actionsRef} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 sm:gap-8 w-full sm:w-auto">
                        <Magnetic strength={isMobile ? 0 : 0.3} range={100}>
                            <m.button
                                whileHover={!isMobile ? { y: -5, scale: 1.02 } : {}}
                                whileTap={{ scale: 0.98 }}
                                className="btn-luxury-primary group flex items-center justify-center gap-4 px-10 w-full sm:w-auto py-5 lg:py-6"
                            >
                                <span className="relative z-10 flex items-center gap-4 text-[10px] lg:text-xs">
                                    Agendar Consulta
                                    <ArrowRight strokeWidth={1.2} className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-2 transition-transform duration-500 ease-out" />
                                </span>
                            </m.button>
                        </Magnetic>

                        <Magnetic strength={isMobile ? 0 : 0.3} range={100}>
                            <m.button
                                whileHover={!isMobile ? { y: -5, scale: 1.02 } : {}}
                                whileTap={{ scale: 0.98 }}
                                className="btn-luxury-ghost group flex items-center justify-center gap-4 px-10 w-full sm:w-auto py-5 lg:py-6"
                            >
                                <span className="text-[10px] lg:text-xs">Ver Casos Clínicos</span>
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

            {/* Scroll Hint (Mobile & Desktop Initial) */}
            <div
                ref={scrollHintRef}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 opacity-0 animate-fade-in-up"
                style={{ animationDelay: '3s', animationFillMode: 'forwards' }}
            >
                <span className="text-[var(--color-silver-bh)] text-[10px] font-bold uppercase tracking-[0.4em]">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--color-silver-bh)] to-transparent" />
            </div>
        </div>
    </section>
);
}

