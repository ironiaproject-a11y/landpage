"use client";

import { m, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
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
                    filter: "blur(10px)"
                });

                entranceTl.to(titleLines, {
                    y: 0,
                    opacity: 1,
                    skewY: 0,
                    filter: "blur(0px)",
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

                // Headline Refinement on Scroll
                scrollTl.to(titleRef.current, {
                    scale: 0.96,
                    opacity: 0.8,
                    y: -30,
                    letterSpacing: "0.02em",
                    filter: "blur(2px)",
                    ease: "power1.inOut"
                }, 0);

                // Content Wrapper Fade
                scrollTl.to(contentWrapperRef.current, {
                    opacity: 0.5,
                    filter: "blur(4px)",
                    ease: "none"
                }, 0);
            } else if (isMobile) {
                // Minimal parallax for mobile to ensure performance
                gsap.to(videoWrapperRef.current, {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    },
                    yPercent: -10
                });

                // Subtle Headline micro-parallax for mobile
                gsap.to(titleRef.current, {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1.2
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
            className="relative w-full min-h-screen overflow-visible bg-[#0a0a0a]"
        >
            <div
                ref={pinContainerRef}
                className="relative h-screen w-full flex items-center overflow-hidden"
            >
                {/* Background Video / X-ray Layer */}
                <div
                    ref={videoWrapperRef}
                    className="absolute inset-0 z-0 origin-center will-change-transform"
                >
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none opacity-90" />
                    <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black pointer-events-none" />

                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        onCanPlay={() => setVideoLoaded(true)}
                        className={`w-full h-full object-cover brightness-[0.6] contrast-[1.1] transition-opacity duration-[2000ms] ${videoLoaded ? 'opacity-70' : 'opacity-0'}`}
                    >
                        <source src="/hero-background.mp4" type="video/mp4" />
                    </video>
                </div>

                {/* Ambient Particles */}
                {!shouldReduceMotion && <AmbientParticles />}

                {/* Main Content */}
                <div
                    ref={contentWrapperRef}
                    className="relative z-20 container mx-auto px-[6%] h-full flex flex-col justify-center items-center pt-32 lg:pt-20 text-center"
                >
                    <div className="max-w-[850px] perspective-1000 w-full">
                        <div className="mb-8 lg:mb-10 overflow-hidden">
                            <h1 ref={titleRef} className="text-hero-editorial font-medium text-[#FAF9F7] tracking-tight will-change-transform">
                                <span className="block mb-2 overflow-hidden">
                                    <span className="title-line-inner inline-block">Seu Sorriso,</span>
                                </span>
                                <span className="block overflow-hidden">
                                    <span className="title-line-inner inline-block italic font-light text-[var(--color-silver-bh)]">Sua Assinatura.</span>
                                </span>
                            </h1>
                        </div>

                        <div className="overflow-hidden mb-12 lg:mb-14">
                            <p ref={descriptionRef} className="text-subheadline-editorial text-white/80 max-w-[55ch] mx-auto text-base md:text-xl lg:text-[1.75rem]">
                                A harmonia perfeita entre a ciência avançada e a estética de alta costura.
                                Projetamos o seu sorriso como uma obra de arte única e irrepetível.
                            </p>
                        </div>

                        <div ref={actionsRef} className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 w-full sm:w-auto">
                            <Magnetic strength={isMobile ? 0 : 0.3} range={100}>
                                <m.button
                                    whileHover={!isMobile ? { y: -5, scale: 1.02 } : {}}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-luxury-primary group flex items-center justify-center gap-4 px-10 w-full sm:w-auto"
                                >
                                    <span className="relative z-10 flex items-center gap-4">
                                        Agendar Consulta
                                        <ArrowRight strokeWidth={1.2} className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500 ease-out" />
                                    </span>
                                </m.button>
                            </Magnetic>

                            <Magnetic strength={isMobile ? 0 : 0.3} range={100}>
                                <m.button
                                    whileHover={!isMobile ? { y: -5, scale: 1.02 } : {}}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-luxury-ghost group flex items-center justify-center gap-4 px-10 w-full sm:w-auto"
                                >
                                    Ver Casos Clínicos
                                </m.button>
                            </Magnetic>
                        </div>
                    </div>
                </div>

                {/* Atmospheric Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[80%] lg:w-[50%] h-[50%] glow-blob-warm opacity-15 pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[70%] lg:w-[40%] h-[40%] glow-blob opacity-10 pointer-events-none" />
            </div>
        </section>
    );
}

