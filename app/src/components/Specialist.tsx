"use client";

import { m } from "framer-motion";
import { Medal, Globe, Quote } from "lucide-react";
import { Magnetic } from "./Magnetic";
import VisualContainer from "./VisualContainer";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Specialist() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const quoteRef = useRef<HTMLDivElement>(null);
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

            // Cinematic Portrait Reveal
            gsap.fromTo(".dr-portrait-inner",
                { clipPath: "inset(100% 0% 0% 0%)", scale: 1.2 },
                {
                    scrollTrigger: {
                        trigger: ".dr-portrait-wrapper",
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    clipPath: "inset(0% 0% 0% 0%)",
                    scale: 1,
                    duration: 2,
                    ease: "expo.out"
                }
            );

            // Badge Parallax
            if (!isMobile) {
                gsap.to(".badge-parallax", {
                    scrollTrigger: {
                        trigger: ".dr-portrait-wrapper",
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    },
                    y: -40,
                    ease: "none"
                });
            }

            if (quoteRef.current) {
                gsap.fromTo(quoteRef.current,
                    { opacity: 0, y: 30 },
                    {
                        scrollTrigger: {
                            trigger: quoteRef.current,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        },
                        opacity: 1,
                        y: 0,
                        duration: 1.2,
                        ease: "power3.out",
                        delay: 0.4
                    }
                );
            }

            // High-End Portrait Parallax
            if (!isMobile) {
                gsap.fromTo(".dr-portrait-wrapper",
                    { y: 60 },
                    {
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1.2
                        },
                        y: -60,
                        ease: "none"
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted, isMobile]);

    return (
        <section ref={sectionRef} className="py-40 relative bg-[var(--color-background)] overflow-hidden" id="especialista">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    {/* Left: Academic & Authority */}
                    <div className="lg:w-1/2 order-2 lg:order-1">
                        <m.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="text-[var(--color-silver-bh)] font-semibold tracking-[0.4em] uppercase text-[10px] mb-8 block"
                        >
                            Corpo Clínico
                        </m.span>
                        <h2 ref={titleRef} className="font-display text-[clamp(40px,5.5vw,72px)] font-light text-white mb-10 leading-[1.0] tracking-tight">
                            <div className="block overflow-hidden pb-1">
                                <span className="title-line-inner inline-block">A ciência por trás do seu</span>
                            </div>
                            <div className="block overflow-hidden pb-1">
                                <span className="title-line-inner inline-block text-gradient-silver italic font-medium">melhor sorriso</span>.
                            </div>
                        </h2>

                        <div className="space-y-8 mb-12">
                            <div className="flex items-start gap-6 group">
                                <Magnetic strength={0.3} range={50}>
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-silver-bh)] shrink-0 transition-all duration-500 group-hover:bg-[var(--color-silver-bh)] group-hover:text-black shadow-level-1">
                                        <Globe strokeWidth={1.2} className="w-6 h-6" />
                                    </div>
                                </Magnetic>
                                <div>
                                    <h4 className="text-white font-bold mb-1 group-hover:text-[var(--color-silver-bh)] transition-colors">Formação de Excelência</h4>
                                    <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">Graduado e Especialista pela USP, com foco em Reabilitação Oral de Alta Complexidade.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-6 group">
                                <Magnetic strength={0.3} range={50}>
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-silver-bh)] shrink-0 transition-all duration-500 group-hover:bg-[var(--color-silver-bh)] group-hover:text-black shadow-level-1">
                                        <Medal strokeWidth={1.2} className="w-6 h-6" />
                                    </div>
                                </Magnetic>
                                <div>
                                    <h4 className="text-white font-bold mb-1 group-hover:text-[var(--color-silver-bh)] transition-colors">Reconhecimento Internacional</h4>
                                    <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">Certificação Master em Lentes de Contato 3D por institutos da Alemanha e Suíça.</p>
                                </div>
                            </div>
                        </div>

                        <div ref={quoteRef} className="opacity-0">
                            <VisualContainer
                                width="100%"
                                height="auto"
                                hoverColor="rgba(255, 255, 255, 0.1)"
                                sideHeight="15px"
                            >
                                <div className="p-10 relative overflow-hidden h-full">
                                    <Quote strokeWidth={1.2} className="absolute top-6 right-8 w-12 h-12 text-[var(--color-silver-bh)]/10" />
                                    <p className="font-editorial text-2xl text-white/90 italic leading-relaxed mb-6 font-light relative z-10">
                                        "Minha missão não é apenas tratar dentes, mas esculpir a confiança que permite a cada paciente expressar sua verdadeira essência através do sorriso."
                                    </p>
                                    <div className="relative z-10">
                                        <h4 className="text-white font-bold text-lg tracking-tight">Dr. Ricardo Alessandro</h4>
                                        <p className="text-[var(--color-silver-bh)] text-[10px] uppercase font-bold tracking-[0.2em]">Diretor Clínico • CRO 00.000</p>
                                    </div>
                                </div>
                            </VisualContainer>
                        </div>
                    </div>

                    {/* Right: Cinematic Portrait */}
                    <div className="lg:w-1/2 order-1 lg:order-2">
                        <m.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                            className="relative dr-portrait-wrapper"
                        >
                            <VisualContainer
                                width="100%"
                                height="auto"
                                hoverColor="rgba(255, 255, 255, 0.05)"
                                sideHeight="20px"
                                className="!rounded-[3rem] overflow-hidden border-white/10"
                            >
                                <div className="relative dr-portrait-inner">
                                    <Image
                                        src="/assets/images/dr-ricardo.png"
                                        alt="Dr. Ricardo Alessandro"
                                        width={800}
                                        height={1000}
                                        className="w-full h-[650px] lg:h-[750px] object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                                    {/* Floating Counter Badge - Integrated into VisualContainer layers if needed, 
                                        but keep as child for translateZ effect via VisualContainer mapping if possible.
                                        VisualContainer maps children to translateZ layers.
                                    */}
                                    <div className="absolute top-12 right-12 glass-panel p-6 rounded-2xl border border-white/10 backdrop-blur-2xl badge-parallax z-20">
                                        <p className="text-[var(--color-silver-bh)] font-display text-4xl font-bold tracking-tight">15+</p>
                                        <p className="text-white/40 text-[8px] uppercase font-bold tracking-[0.3em]">Anos de Maestria</p>
                                    </div>

                                    <div className="absolute bottom-12 left-12 z-20">
                                        <h4 className="text-white font-display text-3xl font-light tracking-tight mb-1">Dr. Ricardo Alessandro</h4>
                                        <p className="text-[var(--color-silver-bh)] text-[10px] uppercase font-bold tracking-[0.3em]">Especialista em Reabilitação Oral</p>
                                    </div>
                                </div>
                            </VisualContainer>

                            {/* Ambient Glows */}
                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[var(--color-silver-bh)]/10 blur-[120px] pointer-events-none -z-10" />
                            <div className="absolute -top-20 -left-20 w-64 h-64 bg-[var(--color-silver-bh)]/5 blur-[100px] pointer-events-none -z-10" />
                        </m.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

