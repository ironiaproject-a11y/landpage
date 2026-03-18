"use client";

import { m, useMotionValue, useTransform, useSpring } from "framer-motion";
import { PremiumReveal } from "./PremiumReveal";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const imageWrapperRef = useRef<HTMLDivElement>(null);
    const revealShadeRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Tilt values for motion
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

    const highlights = [
        "Autoridade em Lentes de Contato 3D",
        "Protocolos Clínicos Proprietários",
        "Corpo Clínico Diplomado pela USP",
        "Ecossistema Digital de Alta Precisão"
    ];

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);

        // Pre-decode main image for smooth reveal
        const img = new (window as any).Image();
        img.src = "/assets/images/reabilitacao-preview.jpg";
        img.decode?.().catch(() => {});

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    useEffect(() => {
        if (!mounted) return;

        const ctx = gsap.context(() => {
            // Main Reveal Sequence
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: isMobile ? "top 90%" : "top 75%",
                    toggleActions: "play none none reverse"
                }
            });

            // 1. Reveal Shade Animation (Cinematic Vertical Reveal)
            if (revealShadeRef.current) {
                tl.to(revealShadeRef.current, {
                    scaleY: 0,
                    transformOrigin: "top", // Reveals from bottom to top
                    duration: 1.8,
                    ease: "power4.inOut"
                });
            }

            // 2. Image Zoom & Subtle Float Effect
            tl.fromTo(".inner-image-content",
                { scale: isMobile ? 1.25 : 1.1, y: isMobile ? 50 : 30 },
                { scale: 1, y: 0, duration: isMobile ? 2.5 : 2.2, ease: "power2.out" },
                "-=1.6"
            );

            tl.fromTo(".about-list-item",
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, stagger: 0.05, duration: 0.8, ease: "power2.out" },
                "-=0.6"
            );

            // Continuous Parallax Effects
            const speedMult = isMobile ? 0.45 : 1;
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            // Image Container Parallax
            if (!prefersReducedMotion) {
                gsap.to(".about-image-wrapper", {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1,
                    },
                    y: -(isMobile ? 20 : 60) * speedMult,
                    ease: "none"
                });
            }

        }, sectionRef);

        return () => ctx.revert();
    }, [mounted, isMobile]);

    return (
        <section ref={sectionRef} className="py-20 md:py-40 relative bg-transparent overflow-hidden" id="sobre">
            <div className="container mx-auto px-6 pb-32 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32">
                    {/* Image Side */}
                    <m.div
                        className="w-full lg:w-1/2 relative group"
                        style={!isMobile ? { perspective: 1000 } : {}}
                    >
                        <m.div
                            ref={imageWrapperRef}
                            className="about-image-wrapper relative rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10"
                            style={!isMobile ? { rotateX, rotateY, transformStyle: "preserve-3d" } : {}}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div ref={revealShadeRef} className="absolute inset-0 bg-[#E6D3A3]/20 z-30" />
                            <div className="relative w-full h-[400px] md:h-[600px] lg:h-[750px] overflow-hidden inner-image-content">
                                <Image
                                    src="/assets/images/elevando-padrao-premium.jpg"
                                    alt="Elevando o padrão da Odontologia Estética"
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 800px"
                                />
                            </div>
                        </m.div>
                    </m.div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start">
                        <PremiumReveal direction="bottom" delay={0.1}>
                            <span className="editorial-label">
                                Excelência Master
                            </span>
                        </PremiumReveal>

                        <h2 className="font-display text-[clamp(40px,5vw,84px)] font-medium mb-20 text-[var(--color-text-primary)] leading-[1.05] tracking-[-0.02em] uppercase" style={{ fontFamily: '"Playfair Display", serif' }}>
                            <PremiumReveal type="mask" direction="bottom" delay={0.2}>
                                <span>Redefinindo o Conceito de</span>
                            </PremiumReveal>
                            <PremiumReveal type="mask" direction="bottom" delay={0.3}>
                                <span className="text-[#E6D3A3] font-display italic font-light block mt-4 border-l-2 border-[#E6D3A3]/30 pl-8 ml-2">Luxo Odontológico.</span>
                            </PremiumReveal>
                        </h2>

                        <PremiumReveal direction="bottom" delay={0.4}>
                            <div className="space-y-10 mb-16 max-w-[540px]">
                                <p className="text-[18px] text-[var(--color-text-primary)] font-medium leading-[1.6] tracking-[0.01em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Acreditamos que o seu sorriso é a sua assinatura no mundo. Por isso, não apenas tratamos dentes; devolvemos a liberdade de sorrir para as lentes da vida sem hesitar.
                                </p>
                                <p className="text-[15px] text-[var(--color-text-secondary)] font-normal leading-[1.8] tracking-[0.02em] opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Para materializar esse nível de confiança, combinamos a precisão da tecnologia alemã com a sensibilidade artística de reabilitações biomiméticas. 
                                    <span className="block mt-4 text-[#E6D3A3] italic font-light">Uma experiência que transcende o tratamento clínico convencional.</span>
                                </p>
                            </div>
                        </PremiumReveal>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 w-full mb-16">
                            {highlights.map((item, index) => (
                                <div key={index} className="about-list-item flex items-center gap-5 group py-2 border-b border-white/5 hover:border-[#E6D3A3]/20 transition-all">
                                    <div className="w-6 h-6 rounded-lg border border-white/10 flex items-center justify-center group-hover:bg-[#E6D3A3] transition-all">
                                        <ArrowUpRight strokeWidth={1} className="w-3 h-3 text-[var(--color-text-secondary)] group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="text-[var(--color-text-secondary)] font-medium text-[14px] tracking-[0.05em] group-hover:text-[var(--color-text-primary)] transition-all duration-500" style={{ fontFamily: 'Inter, sans-serif' }}>{item}</span>
                                </div>
                            ))}
                        </div>

                        <style>{`
                            .btn-premium-cta-inline {
                                position: relative;
                                display: inline-flex;
                                align-items: center;
                                gap: 12px;
                                background: linear-gradient(135deg, rgba(230, 211, 163, 0.1), rgba(203, 179, 130, 0.05));
                                backdrop-filter: blur(12px);
                                -webkit-backdrop-filter: blur(12px);
                                border: 1px solid rgba(230, 211, 163, 0.25);
                                color: #E6D3A3;
                                padding: 16px 42px;
                                border-radius: 999px;
                                font-family: var(--font-inter), sans-serif;
                                font-size: 11px;
                                font-weight: 600;
                                letter-spacing: 0.35em;
                                text-transform: uppercase;
                                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(230, 211, 163, 0.05);
                                transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                                overflow: hidden;
                                cursor: pointer;
                            }

                            .btn-premium-cta-inline::before {
                                content: '';
                                position: absolute;
                                top: 0; left: 0; width: 100%; height: 100%;
                                background: linear-gradient(90deg, transparent, rgba(230, 211, 163, 0.15), transparent);
                                transform: translateX(-100%);
                                transition: 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                            }

                            .btn-premium-cta-inline:hover::before {
                                transform: translateX(100%);
                            }

                            .btn-premium-cta-inline:hover {
                                background: rgba(230, 211, 163, 0.15);
                                border-color: rgba(230, 211, 163, 0.5);
                                color: #FFF;
                                transform: translateY(-3px) scale(1.02);
                                box-shadow: 0 10px 40px rgba(230, 211, 163, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
                                letter-spacing: 0.4em;
                            }

                            @media (max-width: 768px) {
                                .btn-premium-cta-inline { padding: 14px 30px; font-size: 12px; letter-spacing: 0.25em; width: 100%; justify-content: center; min-height: 48px; }
                            }
                        `}</style>
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 }}
                            className="mt-8 w-full md:w-auto"
                        >
                            <button className="btn-premium w-full md:w-auto">
                                Inicie sua jornada
                                <ArrowUpRight className="ml-3 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </m.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
