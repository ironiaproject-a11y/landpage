"use client";

import { m } from "framer-motion";
import VisualContainer from "./VisualContainer";
import { useEffect, useState, useRef } from "react";
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

    useEffect(() => {
        setMounted(true);
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
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted]);

    return (
        <section ref={sectionRef} className="py-40 bg-[var(--color-deep-black)] relative overflow-hidden">
            {/* Background Texture for Depth */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundSize: '40px 40px', backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)' }}></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-32 gap-12 border-b border-white/5 pb-20">
                    <div className="max-w-4xl">
                        <m.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="text-[var(--color-silver-bh)] font-body text-[10px] font-bold uppercase tracking-[0.4em] mb-8 block"
                        >
                            Fundamentos do Cuidado
                        </m.span>
                        <h2 ref={titleRef} className="font-display text-white text-[clamp(48px,6vw,80px)] font-light tracking-tight leading-[1.0]">
                            <div className="block overflow-hidden pb-1">
                                <span className="title-line-inner inline-block text-white">A harmonia entre o</span>
                            </div>
                            <div className="block overflow-hidden pb-1">
                                <span className="title-line-inner inline-block text-gradient-silver italic font-medium">Rigor e a Sensibilidade</span>.
                            </div>
                        </h2>
                    </div>

                    <m.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="hidden lg:block text-right"
                    >
                        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-2">Desde 1996</span>
                        <div className="h-[1px] w-20 bg-[var(--color-silver-bh)] ml-auto mb-2"></div>
                        <span className="block text-sm text-[var(--color-text-secondary)]">Tradição e Inovação em Pereira Barreto</span>
                    </m.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {cards.map((card, index) => (
                        <m.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 1,
                                delay: index * 0.15,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            viewport={{ once: true, margin: "-10%" }}
                            className="group"
                        >
                            <VisualContainer
                                width="100%"
                                height="420px"
                                hoverColor="rgba(196, 175, 126, 0.1)"
                                sideHeight="12px"
                                className="!bg-[var(--color-surface-dark)]/40 hover:!bg-[var(--color-surface)]/60 border-white/5 hover:border-[var(--color-silver-bh)]/20 transition-all duration-700 light-sweep"
                            >
                                <div className="p-10 h-full flex flex-col justify-between relative overflow-hidden group/card shadow-2xl">
                                    {/* Abstract Gradient Glow */}
                                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--color-silver-bh)]/5 blur-[80px] rounded-full group-hover/card:bg-[var(--color-silver-bh)]/10 transition-colors duration-1000" />

                                    {/* Numerical Indicator - Editorial Style */}
                                    <div className="flex justify-between items-start z-10">
                                        <div className="w-10 h-[1px] bg-[var(--color-silver-bh)]/30 mt-4 group-hover/card:w-16 group-hover/card:bg-[var(--color-silver-bh)] transition-all duration-700 origin-left" />
                                        <m.span
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                            className="font-display italic text-6xl text-white/[0.03] group-hover/card:text-[var(--color-silver-bh)]/10 group-hover/card:scale-110 transition-all duration-1000 leading-none"
                                        >
                                            {card.number}
                                        </m.span>
                                    </div>

                                    <div className="relative z-10 pt-12">
                                        <h3 className="font-display text-white text-2xl font-light mb-6 group-hover/card:translate-x-2 transition-transform duration-500">
                                            {card.title}
                                        </h3>

                                        <p className="font-body text-[var(--color-text-tertiary)] text-sm leading-relaxed group-hover/card:text-[var(--color-text-secondary)] transition-colors duration-500 max-w-[90%]">
                                            {card.subtitle}
                                        </p>
                                    </div>

                                    {/* Bottom Detail */}
                                    <div className="z-10 mt-8 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700">
                                        <div className="text-[9px] uppercase tracking-[0.3em] text-[var(--color-silver-bh)]">Pilar de Excelência</div>
                                    </div>
                                </div>
                            </VisualContainer>
                        </m.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

