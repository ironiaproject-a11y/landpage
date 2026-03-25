"use client";

import { m } from "framer-motion";
import { Medal, Globe, Quote } from "lucide-react";
import { Magnetic } from "./Magnetic";
import { PremiumReveal } from "./PremiumReveal";
import { LuxuryCard } from "./LuxuryCard";
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
    const credentialsRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
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
            gsap.to(".badge-parallax", {
                scrollTrigger: {
                    trigger: ".dr-portrait-wrapper",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                },
                y: isMobile ? -15 : -40,
                ease: "none"
            });

            // Badge Entrance
            gsap.fromTo(".op-badge-specialist",
                { opacity: 0, scale: 0.8, x: 20 },
                {
                    scrollTrigger: {
                        trigger: ".dr-portrait-wrapper",
                        start: "top 75%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    duration: 1.5,
                    delay: 0.8,
                    ease: "expo.out"
                }
            );

            if (quoteRef.current) {
                gsap.fromTo(quoteRef.current,
                    { opacity: 0, y: 30 },
                    {
                        scrollTrigger: {
                            trigger: quoteRef.current,
                            start: isMobile ? "top 95%" : "top 85%",
                            toggleActions: "play none none reverse"
                        },
                        opacity: 1,
                        y: 0,
                        duration: isMobile ? 0.8 : 1.2,
                        ease: "power3.out",
                        delay: isMobile ? 0.2 : 0.4
                    }
                );
            }

            // High-End Portrait Parallax
            gsap.fromTo(".dr-portrait-wrapper",
                { y: isMobile ? 40 : 80 },
                {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.2
                    },
                    y: isMobile ? -40 : -80,
                    ease: "none"
                }
            );

            // Description Text Parallax
            gsap.fromTo(".op-desc-parallax",
                { y: isMobile ? 15 : 30 },
                {
                    scrollTrigger: {
                        trigger: ".dr-portrait-wrapper",
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5
                    },
                    y: isMobile ? -15 : -30,
                    ease: "none"
                }
            );

            // Cinematic scroll effects
            // Credentials sequential reveal
            if (credentialsRef.current) {
                const credentialItems = credentialsRef.current.querySelectorAll(".credential-item");
                gsap.fromTo(credentialItems,
                    { opacity: 0, x: -30 },
                    {
                        scrollTrigger: {
                            trigger: credentialsRef.current,
                            start: isMobile ? "top 90%" : "top 80%",
                            toggleActions: "play none none reverse"
                        },
                        opacity: 1,
                        x: 0,
                        stagger: isMobile ? 0.1 : 0.2,
                        duration: isMobile ? 0.7 : 1,
                        ease: "power3.out"
                    }
                );
            }

            // Quote scale effect on scroll
            if (quoteRef.current) {
                gsap.to(quoteRef.current, {
                    scale: 0.97,
                    scrollTrigger: {
                        trigger: quoteRef.current,
                        start: "top center",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }

            // Background blur effect increase
            if (backgroundRef.current) {
                gsap.to(backgroundRef.current, {
                    opacity: 0.3,
                    filter: "blur(20px)",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top center",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted, isMobile]);

    return (
        <section ref={sectionRef} className="py-24 md:py-40 relative bg-[#0D0D0D] overflow-hidden" id="especialista">
            {/* Background overlay for blur effect */}
            <div
                ref={backgroundRef}
                className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent pointer-events-none"
                style={{ opacity: 0 }}
            />
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-start gap-20">
                    {/* Left: Academic & Authority */}
                    <div className="lg:w-1/2 order-2 lg:order-1">
                        <PremiumReveal type="fade" direction="top" duration={1}>
                            <span className="text-level-4 uppercase mb-10 block">
                                Corpo Clínico
                            </span>
                        </PremiumReveal>

                        <PremiumReveal type="mask" direction="bottom">
                            <h2 className="text-level-2 mb-10">
                                A ciência por trás do seu<br />
                                <span className="text-white text-level-3 block mt-4 italic font-light">melhor sorriso</span>.
                            </h2>
                        </PremiumReveal>

                        <div ref={credentialsRef} className="space-y-8 mb-12">
                            <div className="credential-item flex items-start gap-6 group">
                                <Magnetic strength={0.3} range={50}>
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-text-primary)] shrink-0 transition-all duration-500 group-hover:bg-white group-hover:text-black shadow-level-1">
                                        <Globe strokeWidth={1.2} className="w-6 h-6" />
                                    </div>
                                </Magnetic>
                                <div>
                                    <h4 className="text-[#F8F8F6] text-level-3 font-[400] mb-1 group-hover:text-white transition-colors">Formação de Excelência</h4>
                                    <p className="text-level-3">Graduado e Especialista pela USP, com foco em Reabilitação Oral de Alta Complexidade.</p>
                                </div>
                            </div>
                            <div className="credential-item flex items-start gap-6 group">
                                <Magnetic strength={0.3} range={50}>
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-text-primary)] shrink-0 transition-all duration-500 group-hover:bg-white group-hover:text-black shadow-level-1">
                                        <Medal strokeWidth={1.2} className="w-6 h-6" />
                                    </div>
                                </Magnetic>
                                <div>
                                    <h4 className="text-[#F8F8F6] text-level-3 font-[400] mb-1 group-hover:text-white transition-colors">Reconhecimento Internacional</h4>
                                    <p className="text-level-3">Certificação Master em Lentes de Contato 3D por institutos da Alemanha e Suíça.</p>
                                </div>
                            </div>
                        </div>

                        <PremiumReveal type="fade" delay={0.4}>
                            <div ref={quoteRef}>
                                <LuxuryCard
                                    glowColor="rgba(255,255,255,0.05)"
                                    className="border-white/5"
                                    innerClassName="p-8 md:p-10"
                                >
                                    <div className="relative">
                                        <Quote strokeWidth={1.2} className="absolute top-0 right-0 w-12 h-12 text-[var(--color-text-primary)]/10" />
                                        <p className="text-level-3 text-white italic mb-12 relative z-10">
                                            &quot;Minha missão não é apenas tratar dentes, mas esculpir a confiança que permite a cada paciente expressar sua verdadeira essência através do sorriso.&quot;
                                        </p>
                                        <div className="relative z-10">
                                            <h4 className="text-[var(--color-text-primary)] text-level-3 font-[400] tracking-tight">Dr. Ricardo Alessandro</h4>
                                            <p className="text-level-4 uppercase tracking-widest">Diretor Clínico • CRO 00.000</p>
                                        </div>
                                    </div>
                                </LuxuryCard>
                            </div>
                        </PremiumReveal>
                    </div>

                    <div className="lg:w-1/2 order-1 lg:order-2">
                        <div className="relative dr-portrait-wrapper will-change-transform [transform:translateZ(0)]">
                            <PremiumReveal type="mask" direction="bottom" duration={1.5}>
                                <div className="relative rounded-[2rem] overflow-hidden border border-white/10 dr-portrait-inner">
                                    <Image
                                        src="/assets/images/dr-ricardo.png"
                                        alt="Dr. Ricardo Alessandro"
                                        width={800}
                                        height={1000}
                                        loading="lazy"
                                        className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[750px] object-cover grayscale transition-all duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-black/20 to-transparent" />

                                    <div className="absolute top-4 right-4 md:top-8 md:right-8 glass-panel p-3 md:p-6 rounded-2xl border border-white/10 backdrop-blur-2xl badge-parallax z-20 op-badge-specialist">
                                        <p className="text-[var(--color-text-primary)] text-level-2 font-medium tracking-tight">15</p>
                                        <p className="text-level-4 uppercase tracking-widest opacity-40">Anos de Maestria</p>
                                    </div>

                                    <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-20 op-desc-parallax">
                                        <h4 className="text-white text-level-3 font-medium tracking-tight mb-1">Dr. Ricardo Alessandro</h4>
                                        <p className="text-level-4 uppercase tracking-wider opacity-80">Especialista em Reabilitação Oral</p>
                                    </div>
                                </div>
                            </PremiumReveal>

                             <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#F8F8F6]/5 blur-[100px] pointer-events-none -z-10" />
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}

