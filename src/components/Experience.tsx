"use client";

import { m } from "framer-motion";
import { Compass, Layers, Sparkles, ArrowRight } from "lucide-react";
import VisualContainer from "./VisualContainer";
import { Magnetic } from "./Magnetic";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { PremiumReveal } from "./PremiumReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Experience() {
    const sectionRef = useRef<HTMLElement>(null);
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
            // Image Parallax
            const speedMult = isMobile ? 0.85 : 1.2;
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

            // Text Content Parallax
            gsap.fromTo(".experience-content-parallax",
                { y: isMobile ? 20 : 40 },
                {
                    scrollTrigger: {
                        trigger: ".experience-visual-wrapper",
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.2
                    },
                    y: isMobile ? -20 : -40,
                    ease: "none"
                }
            );

            // Step items staggered reveal
            const stepItems = stepsRef.current?.querySelectorAll(".experience-step-item");
            if (stepItems && stepItems.length > 0) {
                gsap.fromTo(stepItems,
                    { opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 20 : 0 },
                    {
                        scrollTrigger: {
                            trigger: stepsRef.current,
                            start: "top 75%",
                            toggleActions: "play none none reverse"
                        },
                        opacity: 1,
                        x: 0,
                        y: 0,
                        stagger: 0.2,
                        duration: 1.2,
                        ease: "power3.out"
                    }
                );
            }

        }, sectionRef);

        return () => ctx.revert();
    }, [mounted, isMobile]);

    return (
        <section ref={sectionRef} className="py-20 md:py-40 relative bg-black overflow-hidden" id="experiencia">
            <div ref={textureRef} className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-silver-bh)]/10 to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
                    {/* Left Side */}
                    <div className="lg:w-1/2">
                        <PremiumReveal direction="bottom" delay={0.1}>
                            <span className="text-[var(--color-silver-bh)] font-semibold tracking-[0.4em] uppercase text-[10px] mb-8 block">
                                A Jornada do Paciente
                            </span>
                        </PremiumReveal>

                        <h2 className="font-display text-[clamp(28px,8vw,6.5rem)] font-medium text-[var(--color-silver-bh)] leading-[0.95] mb-12 md:mb-16 tracking-tight uppercase">
                            <PremiumReveal type="mask" direction="bottom" delay={0.2}>
                                <span>O Protocolo de</span>
                            </PremiumReveal>
                            <PremiumReveal type="mask" direction="bottom" delay={0.3}>
                                <span className="text-[var(--color-creme)] font-bodoni italic font-light block mt-2">Transformação.</span>
                            </PremiumReveal>
                        </h2>

                        <div ref={stepsRef} className="space-y-8 md:space-y-12 relative">
                            <div className="absolute left-[23px] top-4 bottom-12 w-[1px] bg-gradient-to-b from-[var(--color-silver-bh)]/30 via-[var(--color-silver-bh)]/5 to-transparent md:hidden" />

                            {steps.map((step, index) => (
                                <m.div key={index} className="experience-step-item flex gap-6 md:gap-8 group relative z-10">
                                    <div className="flex flex-col items-center pt-1">
                                        <Magnetic strength={0.3} range={60}>
                                            <div className="w-12 h-12 rounded-full border border-[var(--color-creme)]/10 flex items-center justify-center group-hover:border-[var(--color-creme)]/30 transition-all duration-500 bg-[#0A0A0A] backdrop-blur-sm shadow-premium-1">
                                                <span className="text-[var(--color-creme)] font-display text-sm font-bold tracking-widest">{step.number}</span>
                                            </div>
                                        </Magnetic>
                                    </div>
                                    <div className="pb-8">
                                        <h3 className="text-xl md:text-2xl font-display font-medium text-[var(--color-silver-bh)] group-hover:text-[var(--color-creme)] transition-colors mb-2 md:mb-3">{step.title}</h3>
                                        <p className="text-[var(--color-text-secondary)] text-base md:text-lg font-light leading-relaxed max-w-md opacity-80 group-hover:opacity-100 transition-opacity">
                                            {step.description}
                                        </p>
                                    </div>
                                </m.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="lg:w-1/2 relative">
                        <m.div
                            className="experience-visual-wrapper relative z-10"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                        >
                            <VisualContainer width="100%" height="auto">
                                <div ref={visualRef} className="aspect-[4/5] relative overflow-hidden rounded-2xl">
                                    <Image
                                        src="/assets/images/elite-digital-protocol-final.png"
                                        alt="Clínica Premium - Protocolo Digital"
                                        fill
                                        className="object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-12 left-12 right-12 z-20 experience-image-content">
                                        <div className="experience-content-parallax">
                                            <p className="text-[var(--color-silver-bh)] font-display text-3xl font-bold mb-2 uppercase tracking-tight">Exclusividade</p>
                                            <p className="text-[var(--color-silver-bh)]/70 text-sm font-light tracking-wide max-w-xs leading-relaxed">Planejamento personalizado e alta tecnologia para cada sorriso de elite.</p>
                                        </div>
                                    </div>
                                </div>
                            </VisualContainer>
                        </m.div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[var(--color-silver-bh)]/5 blur-[120px] pointer-events-none -z-10" />
                    </div>
                </div>

                <div ref={ctaRef} className="mt-16 md:mt-32 flex justify-center">
                    <div className="inline-flex flex-col md:flex-row items-center gap-6 px-10 py-8 rounded-3xl border border-[var(--color-silver-bh)]/5 bg-white/2 hover:border-[var(--color-silver-bh)]/30 transition-all group cursor-pointer backdrop-blur-sm">
                        <span className="text-[var(--color-silver-bh)]/60 text-sm font-medium">Pronto para sua própria jornada de elite?</span>
                        <div className="hidden md:block w-[1px] h-6 bg-[var(--color-silver-bh)]/10" />
                        <span className="text-[var(--color-silver-bh)] text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3">
                            Falar com um Especialista
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
