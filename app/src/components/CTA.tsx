"use client";

import { m } from "framer-motion";
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
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted]);

    return (
        <section ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden bg-[var(--color-deep-black)]">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />

            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] aspect-square bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_70%)] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <m.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1]
                    }}
                    className="max-w-4xl mx-auto glass-panel rounded-organic-lg p-10 md:p-24 relative overflow-hidden"
                >
                    {/* Decorative shine evolution */}
                    <div className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] glow-blob-warm opacity-40" />
                    <div className="absolute -bottom-[100px] -left-[100px] w-[300px] h-[300px] glow-blob opacity-20" />

                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[var(--color-silver-bh)]/5 text-[var(--color-silver-bh)] text-[10px] font-bold uppercase tracking-[0.2em] border border-[var(--color-silver-bh)]/10 mb-12"
                    >
                        <Calendar strokeWidth={1.2} className="w-3.5 h-3.5" />
                        Agenda Aberta 2026
                    </m.div>

                    <h2 ref={titleRef} className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-white mb-10 leading-[0.95] tracking-tight">
                        <div className="block overflow-hidden pb-1">
                            <span className="title-line-inner inline-block">Seu novo sorriso</span>
                        </div>
                        <div className="block overflow-hidden pb-1">
                            <span className="title-line-inner inline-block text-gradient-silver">começa hoje.</span>
                        </div>
                    </h2>

                    <m.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="text-lg md:text-2xl text-[var(--color-text-secondary)] mb-16 leading-relaxed max-w-2xl mx-auto font-light tracking-wide"
                    >
                        Agende uma avaliação detalhada e descubra como nosso protocolo exclusivo pode transformar sua autoestima.
                    </m.p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        <Magnetic strength={0.2} range={100}>
                            <m.button
                                whileHover={{ y: -10, scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-luxury-primary group flex items-center justify-center gap-4"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Agendar Avaliação
                                    <ArrowRight strokeWidth={1.2} className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500 ease-out" />
                                </span>
                            </m.button>
                        </Magnetic>

                        <Magnetic strength={0.2} range={100}>
                            <m.button
                                whileHover={{ y: -10, scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                onClick={() => window.open(generateWhatsAppUrl(DEFAULT_MESSAGE), '_blank')}
                                className="btn-luxury-ghost group flex items-center justify-center gap-4"
                            >
                                Falar com Concierge
                            </m.button>
                        </Magnetic>
                    </div>
                </m.div>
            </div>
        </section>
    );
}
