"use client";

import { PremiumReveal } from "./PremiumReveal";
import { LuxuryCard } from "./LuxuryCard";
import { ArrowRight, Calendar } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DEFAULT_MESSAGE } from "@/config/constants";
import { generateWhatsAppUrl } from "@/utils/whatsapp";
import { Magnetic } from "@/components/Magnetic";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function CTA() {
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

            // Desktop-only cinematic scroll effects
            const isMobile = window.innerWidth < 768;
            if (!isMobile) {
                gsap.to(".cta-glass-panel", {
                    scale: 0.98,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted]);

    return (
        <section ref={sectionRef} className="py-24 md:py-40 relative overflow-hidden bg-[var(--color-deep-black)]">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />

            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] aspect-square bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_70%)] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <LuxuryCard
                    className="cta-glass-panel max-w-4xl mx-auto border-white/5"
                    innerClassName="p-10 md:p-24"
                    glowColor="rgba(245, 245, 220, 0.08)"
                >
                    {/* Decorative shine evolution */}
                    <div className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] glow-blob-warm opacity-40" />
                    <div className="absolute -bottom-[100px] -left-[100px] w-[300px] h-[300px] glow-blob opacity-20" />

                    <PremiumReveal type="fade" direction="top" delay={0.2}>
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[var(--color-silver-bh)]/5 text-[var(--color-silver-bh)] text-[10px] font-bold uppercase tracking-[0.2em] border border-[var(--color-silver-bh)]/10 mb-12">
                            <Calendar strokeWidth={1.2} className="w-3.5 h-3.5" />
                            Agenda Aberta 2026
                        </div>
                    </PremiumReveal>

                    <PremiumReveal type="mask" direction="bottom" delay={0.3}>
                        <h2 className="font-display text-[clamp(42px,7vw,96px)] font-medium text-white mb-10 leading-[1.05] tracking-hero uppercase">
                            Seu novo sorriso<br />
                            <span className="text-gradient-silver italic font-light">começa hoje.</span>
                        </h2>
                    </PremiumReveal>

                    <PremiumReveal type="fade" delay={0.5}>
                        <p className="text-lg md:text-xl text-white font-medium leading-[1.6] max-w-2xl mx-auto mb-16 body-text-refined">
                            Agende uma avaliação detalhada e descubra como nosso protocolo <span className="italic font-display font-light text-white">exclusivo</span> pode transformar sua autoestima.
                        </p>
                    </PremiumReveal>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        <Magnetic strength={0.2} range={100}>
                            <button
                                onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-luxury-primary group flex items-center justify-center gap-4 py-4 px-8 rounded-full"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Agendar Avaliação
                                    <ArrowRight strokeWidth={1.2} className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500 ease-out" />
                                </span>
                            </button>
                        </Magnetic>

                        <Magnetic strength={0.2} range={100}>
                            <button
                                onClick={() => window.open(generateWhatsAppUrl(DEFAULT_MESSAGE), '_blank')}
                                className="btn-luxury-ghost group flex items-center justify-center gap-4 py-4 px-8 rounded-full"
                            >
                                Falar com Concierge
                            </button>
                        </Magnetic>
                    </div>
                </LuxuryCard>
            </div>
        </section>
    );
}
