"use client";

import { m } from "framer-motion";
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
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const highlights = [
        "Autoridade em Lentes de Contato 3D",
        "Protocolos Clínicos Proprietários",
        "Corpo Clínico Diplomado pela USP",
        "Ecossistema Digital de Alta Precisão"
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

            if (descriptionRef.current) {
                gsap.fromTo(descriptionRef.current,
                    { opacity: 0, y: 30 },
                    {
                        scrollTrigger: {
                            trigger: descriptionRef.current,
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

            // Enhanced Multi-Layer Parallax - Enabled for all with speed adjustment
            const speedMult = isMobile ? 0.5 : 1;

            // Background Glow Drift
            gsap.to(".glow-blob", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 2,
                },
                y: -100 * speedMult,
                x: 50 * speedMult,
                scale: 1.2,
                ease: "none"
            });

            // Main Image Container Parallax
            gsap.fromTo(".about-image-wrapper",
                { y: 100 * speedMult },
                {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5,
                    },
                    y: -100 * speedMult,
                    ease: "power1.inOut"
                }
            );

            // Internal Image Parallax (Lens effect)
            gsap.fromTo(".inner-image-parallax img",
                { y: "-10%" },
                {
                    scrollTrigger: {
                        trigger: ".about-image-wrapper",
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    },
                    y: "10%",
                    ease: "none"
                }
            );

            // Decorative Elements Parallax
            gsap.fromTo(".about-decoration-parallax",
                { y: 150 * speedMult, rotate: -15 },
                {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.2,
                    },
                    y: -150 * speedMult,
                    rotate: 15,
                    ease: "none"
                }
            );

            gsap.fromTo(".about-decoration-parallax-2",
                { x: -100 * speedMult, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        end: "bottom top",
                        scrub: 2,
                    },
                    x: 100 * speedMult,
                    opacity: 0.5,
                    ease: "none"
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted, isMobile]);

    return (
        <section ref={sectionRef} className="py-24 md:py-40 relative" id="sobre">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#111] to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Image Side */}
                    <m.div
                        initial={{ opacity: 0, x: isMobile ? -30 : -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: isMobile ? "0px 0px -50px 0px" : "0px 0px -100px 0px", amount: isMobile ? 0.1 : 0.3 }}
                        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:w-1/2 relative p-4"
                    >
                        <div className="about-image-wrapper will-change-transform">
                            {/* Lighting Blob Behind Image */}
                            <div className="absolute -top-[15%] -left-[10%] w-[80%] h-[80%] glow-blob opacity-30 blur-[100px] pointer-events-none" />

                            {/* Floating Decorative Elements with independent parallax */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 border border-white/5 rounded-full about-decoration-parallax pointer-events-none z-20 backdrop-blur-sm bg-white/5" />
                            <div className="absolute -bottom-20 left-10 w-48 h-1 h-px bg-gradient-to-r from-[var(--color-silver-bh)] to-transparent about-decoration-parallax-2 pointer-events-none z-20" />

                            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[700px] rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl inner-image-parallax">
                                <Image
                                    src="/assets/images/elevando-padrao-premium.jpg"
                                    alt="Elevando o padrão da Odontologia Estética"
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                                />
                            </div>
                    </m.div>

                    {/* Content Side */}
                    <div className="lg:w-1/2">
                        <m.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, margin: "0px 0px -100px 0px", amount: 0.3 }}
                            className="flex items-center gap-3 mb-8"
                        >
                            <div className="w-12 h-[1px] bg-[var(--color-silver-bh)]" />
                            <span className="text-[var(--color-silver-bh)] font-bold tracking-[0.2em] uppercase text-xs">
                                Excelência Comprovada
                            </span>
                        </m.div>

                        <h2 ref={titleRef} className="text-5xl md:text-6xl font-medium mt-4 mb-8 text-white leading-[1.05] tracking-tight">
                            <div className="block overflow-hidden pb-1">
                                <span className="title-line-inner inline-block">Elevando o padrão da</span>
                            </div>
                            <div className="block overflow-hidden pb-1">
                                <span className="title-line-inner inline-block text-gradient-silver font-editorial italic">Odontologia Estética</span>.
                            </div>
                        </h2>

                        <p ref={descriptionRef} className="text-xl text-[var(--color-text-secondary)] mb-12 leading-relaxed font-light border-l-2 border-[var(--color-silver-bh)]/30 pl-8 opacity-0">
                            Com mais de 30 anos de atuação em Pereira Barreto, a clínica alia tradição, inovação e alta tecnologia em Odontologia, contando também com uma clínica radiológica completa. Nosso foco é oferecer um ambiente seguro, acolhedor e altamente eficiente, garantindo um atendimento de excelência para o cuidado de toda a família.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 mb-14">
                            {highlights.map((item, index) => (
                                <m.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "0px 0px -100px 0px", amount: 0.3 }}
                                    transition={{ delay: 0.4 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="w-5 h-5 rounded-full border border-[var(--color-silver-bh)]/50 flex items-center justify-center group-hover:bg-[var(--color-silver-bh)] group-hover:border-[var(--color-silver-bh)] transition-all">
                                        <ArrowUpRight strokeWidth={1.2} className="w-3 h-3 text-[var(--color-silver-bh)] group-hover:text-black transition-colors" />
                                    </div>
                                    <span className="text-white/90 font-medium text-sm tracking-wide">{item}</span>
                                </m.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

