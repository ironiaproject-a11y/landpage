"use client";

import { m } from "framer-motion";
import { Compass, Layers, Sparkles, ArrowRight } from "lucide-react";
import VisualContainer from "./VisualContainer";
import { Magnetic } from "./Magnetic";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Experience() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const visualRef = useRef<HTMLDivElement>(null);
    const stepsRef = useRef<HTMLDivElement>(null);
    const textureRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const steps = [
        {
            title: "Diagnóstico Digital",
            description: "Análise milimétrica da sua anatomia facial e dental com escaneamento intraoral de última geração.",
            number: "01"
        },
        {
            title: "Desenho do Sorriso",
            description: "Você visualiza o resultado final antes mesmo de começar, através de simulações 3D realistas.",
            number: "02"
        },
        {
            title: "Excelência na Execução",
            description: "Procedimentos realizados com rigor técnico absoluto, unindo estética e função.",
            number: "03"
        }
    ];

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const ctx = gsap.context(() => {
            const titleLines = Array.from(titleRef.current?.querySelectorAll(".title-line-inner") || []);

            if (titleLines.length > 0) {
                gsap.fromTo(titleLines,
                    { y: "110%", skewY: 7, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: titleRef.current,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        },
                        y: 0,
                        skewY: 0,
                        opacity: 1,
                        stagger: 0.15,
                        duration: 1.2,
                        ease: "power4.out"
                    }
                );
            }

            // Image Parallax - Experience Visual
            const speedMult = isMobile ? 0.5 : 1.2;
            gsap.fromTo(".experience-visual-wrapper",
                { y: 80 * speedMult },
                {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    },
                    y: -80 * speedMult,
                    ease: "none"
                }
            );

            // Light Sweep Trigger on entrance
            if (visualRef.current) {
                gsap.to(visualRef.current, {
                    scrollTrigger: {
                        trigger: visualRef.current,
                        start: "top 70%",
                        onEnter: () => {
                            visualRef.current?.classList.add("light-sweep-trigger");
                        }
                    }
                });
            }

            // CTA reveal with letter spacing refinement
            if (ctaRef.current) {
                gsap.fromTo(ctaRef.current,
                    { opacity: 0, y: 30, letterSpacing: "-0.02em" },
                    {
                        scrollTrigger: {
                            trigger: ctaRef.current,
                            start: "top 90%",
                            toggleActions: "play none none reverse"
                        },
                        opacity: 1,
                        y: 0,
                        letterSpacing: "0em",
                        duration: 1.5,
                        ease: "power3.out"
                    }
                );

                // Desktop-only cinematic scroll effects
                if (!isMobile) {
                    // Title scale down on scroll
                    if (titleRef.current) {
                        gsap.to(titleRef.current, {
                            scale: 0.96,
                            opacity: 0.9,
                            scrollTrigger: {
                                trigger: sectionRef.current,
                                start: "top top",
                                end: "bottom top",
                                scrub: true
                            }
                        });
                    }

                    // Background texture parallax
                    if (textureRef.current) {
                        gsap.to(textureRef.current, {
                            x: 100,
                            opacity: 0.15,
                            scrollTrigger: {
                                trigger: sectionRef.current,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 1.5
                            }
                        });
                    }

                    // Step items staggered reveal based on scroll
                    const stepItems = stepsRef.current?.querySelectorAll(".experience-step-item");
                    if (stepItems && stepItems.length > 0) {
                        gsap.fromTo(stepItems,
                            { opacity: 0, x: -30 },
                            {
                                scrollTrigger: {
                                    trigger: stepsRef.current,
                                    start: "top 75%",
                                    toggleActions: "play none none reverse"
                                },
                                opacity: 1,
                                x: 0,
                                stagger: 0.2,
                                duration: 1.2,
                                ease: "power3.out"
                            }
                        );
                    }

                    // Animate "Jornada do Paciente" Label
                    gsap.fromTo(".experience-label",
                        { opacity: 0, y: 15 },
                        {
                            scrollTrigger: {
                                trigger: ".experience-label",
                                start: "top 90%",
                                toggleActions: "play none none reverse"
                            },
                            opacity: 1,
                            y: 0,
                            duration: 1,
                            ease: "power2.out"
                        }
                    );

                    // Animate Image Content
                    gsap.fromTo(".experience-image-content",
                        { opacity: 0, y: 30 },
                        {
                            scrollTrigger: {
                                trigger: ".experience-visual-wrapper",
                                start: "top 80%",
                                toggleActions: "play none none reverse"
                            },
                            opacity: 1,
                            y: 0,
                            duration: 1.5,
                            delay: 0.5,
                            ease: "power3.out"
                        }
                    );

                    // Bottom CTA fade/scale out
                    gsap.to(ctaRef.current, {
                        opacity: 0.6,
                        scale: 0.98,
                        scrollTrigger: {
                            trigger: ctaRef.current,
                            start: "top 60%",
                            end: "bottom top",
                            scrub: true
                        }
                    });
                }
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted, isMobile]);

    return (
        <section ref={sectionRef} className="py-24 md:py-40 relative bg-[var(--color-graphite)] overflow-hidden" id="experiencia">
            {/* Background Narrative Texture */}
            <div ref={textureRef} className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
                    {/* Left: Content & Steps */}
                    <div className="lg:w-1/2">
                        <m.span
                            initial={{ opacity: 0 }}
                            className="text-[var(--color-silver-bh)] font-semibold tracking-[0.4em] uppercase text-[10px] mb-8 block experience-label"
                        >
                            A Jornada do Paciente
                        </m.span>
                        <h2 ref={titleRef} className="font-display text-5xl md:text-7xl font-medium text-white leading-tight mb-12 md:mb-16 tracking-tight">
                            <div className="block overflow-hidden pb-1">
                                <span className="title-line-inner inline-block">O Protocolo de</span>
                            </div>
                            <div className="block overflow-hidden pb-1">
                                <span className="title-line-inner inline-block text-gradient-silver italic">Elite Digital</span>.
                            </div>
                        </h2>

                        <div ref={stepsRef} className="space-y-8 md:space-y-12 relative">
                            {/* Conceptual Timeline Line Background */}
                            <div className="absolute left-[23px] top-4 bottom-12 w-[1px] bg-gradient-to-b from-[var(--color-silver-bh)]/30 via-white/5 to-transparent md:hidden" />

                            {steps.map((step, index) => (
                                <m.div
                                    key={index}
                                    className="experience-step-item flex gap-6 md:gap-8 group relative z-10"
                                >
                                    <div className="flex flex-col items-center pt-1">
                                        <Magnetic strength={0.3} range={60}>
                                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[var(--color-silver-bh)]/30 transition-all duration-500 bg-[#0A0A0A] backdrop-blur-sm z-10 shadow-premium-1">
                                                <span className="text-[var(--color-silver-bh)]/60 group-hover:text-[var(--color-silver-bh)] font-display text-sm font-bold tracking-widest transition-colors duration-500">
                                                    {step.number}
                                                </span>
                                            </div>
                                        </Magnetic>
                                    </div>
                                    <div className="pb-8">
                                        <h3 className="text-xl md:text-2xl font-display font-medium text-white group-hover:text-[var(--color-silver-bh)] transition-colors mb-2 md:mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-[var(--color-text-secondary)] text-base md:text-lg font-light leading-relaxed max-w-md opacity-80 group-hover:opacity-100 transition-opacity">
                                            {step.description}
                                        </p>
                                    </div>
                                </m.div>
                            ))}
                        </div>

                    </div>

                    {/* Right: Visual Showcase (The Brand Visual) */}
                    <div className="lg:w-1/2 relative">
                        <m.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="relative z-10 experience-visual-wrapper"
                        >
                            <VisualContainer
                                width="100%"
                                height="auto"
                                hoverColor="rgba(199, 168, 107, 0.15)"
                                sideHeight="20px"
                            >
                                <div ref={visualRef} className="aspect-[4/5] relative overflow-hidden h-full rounded-2xl light-sweep">
                                    <Image
                                        src="/assets/images/elite-digital-protocol-final.png"
                                        alt="Clínica Premium - Protocolo Digital"
                                        width={1000}
                                        height={1250}
                                        className="w-full h-full object-cover object-[center_25%] transition-transform duration-[2s] group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                    {/* Refined Brand Badge */}
                                    <div className="absolute bottom-12 left-12 right-12 translate-z-30 experience-image-content">
                                        <p className="text-[var(--color-silver-bh)] font-display text-3xl font-bold mb-2 tracking-tight">Exclusividade</p>
                                        <p className="text-white/70 text-sm font-light tracking-wide max-w-xs leading-relaxed">
                                            Planejamento personalizado e alta tecnologia para cada sorriso de elite.
                                        </p>
                                    </div>
                                </div>
                            </VisualContainer>
                        </m.div>

                        {/* Ambient Glows */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[var(--color-silver-bh)]/5 blur-[120px] pointer-events-none -z-10" />
                    </div>
                </div>

                {/* Bottom CTA Element */}
                <div
                    ref={ctaRef}
                    className="mt-16 md:mt-32 flex justify-center"
                >
                    <div className="inline-flex flex-col md:flex-row items-center gap-6 px-10 py-8 rounded-3xl border border-white/5 bg-white/2 hover:border-[var(--color-silver-bh)]/30 transition-all group cursor-pointer backdrop-blur-sm shadow-premium-1">
                        <span className="text-white/60 text-sm font-medium">Pronto para sua própria jornada de elite?</span>
                        <div className="hidden md:block w-[1px] h-6 bg-white/10" />
                        <span className="text-[var(--color-silver-bh)] text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3">
                            Falar com um Especialista
                            <ArrowRight strokeWidth={1.2} className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

