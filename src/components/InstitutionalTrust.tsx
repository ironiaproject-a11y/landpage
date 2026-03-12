"use client";

import { m } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { LuxuryCard } from "./LuxuryCard";
import { PremiumReveal } from "./PremiumReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const cards = [
    {
        number: "01",
        title: "Excelência Estética",
        subtitle: "Autoridade técnica internacional em casos de alta complexidade e reabilitação oral Biomimética com precisão absoluta.",
    },
    {
        number: "02",
        title: "Corpo Clínico Global",
        subtitle: "Equipe composta exclusivamente por especialistas master com formação europeia e certificações americanas.",
    },
    {
        number: "03",
        title: "Protocolos Proprietários",
        subtitle: "Metodologias exclusivas desenhadas para garantir previsibilidade clínica, segurança e conforto absoluto.",
    },
    {
        number: "04",
        title: "Diagnóstico Digital",
        subtitle: "O ápice da odontologia guiada por tecnologia de escaneamento de última geração e planejamento 3D.",
    }
];

export function InstitutionalTrust() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

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
                            start: isMobile ? "top 95%" : "top 85%",
                            toggleActions: "play none none reverse"
                        },
                        y: 0,
                        skewY: 0,
                        opacity: 1,
                        stagger: isMobile ? 0.08 : 0.15,
                        duration: isMobile ? 0.8 : 1.2,
                        ease: "power4.out"
                    }
                );
            }

            // Cinematic scroll effects for All Devices
            // Section title scale refinement
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

            // Background dot pattern parallax
            gsap.to(".trust-bg-dots", {
                y: 100,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5
                }
            });

            // Cards staggered reveal on scroll
            const cardItems = gsap.utils.toArray(".trust-card-item");
            if (cardItems.length > 0) {
                gsap.fromTo(cardItems,
                    { opacity: 0, y: 50 },
                    {
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: isMobile ? "top 85%" : "top 70%",
                            toggleActions: "play none none reverse"
                        },
                        opacity: 1,
                        y: 0,
                        stagger: isMobile ? 0.05 : 0.1,
                        duration: isMobile ? 0.7 : 1,
                        ease: "power3.out"
                    }
                );

                // Animate subtitles within cards
                const cardSubtitles = gsap.utils.toArray(".trust-card-subtitle");
                gsap.fromTo(cardSubtitles,
                    { opacity: 0, x: -10 },
                    {
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top 65%",
                            toggleActions: "play none none reverse"
                        },
                        opacity: 1,
                        x: 0,
                        stagger: 0.1,
                        duration: 1.2,
                        delay: 0.3,
                        ease: "power2.out"
                    }
                );

                // Animate "Pilar de Excelência" details
                const cardDetails = gsap.utils.toArray(".trust-card-detail");
                gsap.fromTo(cardDetails,
                    { opacity: 0, y: 10 },
                    {
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top 60%",
                            toggleActions: "play none none reverse"
                        },
                        opacity: 1,
                        y: 0,
                        stagger: 0.1,
                        duration: 1,
                        delay: 0.6,
                        ease: "power2.out"
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted, isMobile]);

    return (
        <section ref={sectionRef} className="py-20 md:py-40 bg-[var(--color-deep-black)] relative overflow-hidden">
            {/* Background Texture for Depth */}
            <div className="trust-bg-dots absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundSize: '40px 40px', backgroundImage: 'radial-gradient(circle, #F8F8F6 1px, transparent 1px)' }}></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-32 gap-12 border-b border-white/5 pb-20">
                    <div className="max-w-4xl">
                        <PremiumReveal direction="bottom" delay={0.1}>
                            <span className="text-[#E6D3A3] font-semibold tracking-[0.4em] uppercase text-[10px] mb-8 block">
                                Fundamentos do Cuidado
                            </span>
                        </PremiumReveal>

                        <h2 className="font-display text-[#F8F8F6] text-[clamp(36px,6vw,72px)] font-semibold leading-[1.05] uppercase tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
                            <PremiumReveal type="mask" direction="bottom" delay={0.2}>
                                <span>A harmonia entre o</span>
                            </PremiumReveal>
                            <PremiumReveal type="mask" direction="bottom" delay={0.3}>
                                <span className="text-[#E6D3A3] font-display italic font-light block mt-2">Rigor e a Sensibilidade.</span>
                            </PremiumReveal>
                        </h2>

                        <PremiumReveal direction="bottom" delay={0.4} className="mt-10 lg:mt-12 max-w-2xl">
                            <p className="text-[#6B7280] text-lg lg:text-xl font-light leading-relaxed tracking-wide">
                                Nossa metodologia é sustentada por quatro pilares fundamentais que garantem não apenas resultados estéticos, mas a longevidade e saúde do seu investimento.
                            </p>
                        </PremiumReveal>
                    </div>

                    <div className="hidden lg:block text-right">
                        <PremiumReveal direction="right" delay={0.4}>
                            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280] mb-2">Desde 1996</span>
                            <div className="h-[1px] w-20 bg-[#F8F8F6] ml-auto mb-2"></div>
                            <span className="block text-sm text-[#6B7280]">Tradição e Inovação em Pereira Barreto</span>
                        </PremiumReveal>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {cards.map((card, index) => (
                        <LuxuryCard key={index} delay={0.2 + (index * 0.1)}>
                            {/* Numerical Indicator - Editorial Style */}
                            <div className="flex justify-between items-start mb-12">
                                <div className="w-10 h-[1px] bg-[#E6D3A3]/10 mt-4 group-hover:w-16 group-hover:bg-[#E6D3A3]/30 transition-all duration-700 origin-left" />
                                <span className="font-display font-medium text-6xl text-[#F8F8F6]/[0.03] group-hover:text-[#E6D3A3]/10 transition-all duration-1000 leading-none tracking-tighter">
                                    {card.number}
                                </span>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-[#F8F8F6] text-[20px] font-semibold mb-6 transition-transform duration-500 uppercase tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    {card.title}
                                </h3>

                                <p className="text-[#6B7280] text-[15px] font-normal leading-[1.6] transition-colors duration-500 max-w-[90%]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    {card.subtitle}
                                </p>
                            </div>

                            {/* Bottom Detail */}
                            <div className="mt-12 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                                <div className="text-[9px] uppercase tracking-[0.08em] text-[#E6D3A3]">Pilar de Excelência</div>
                            </div>
                        </LuxuryCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
