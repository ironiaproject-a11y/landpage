"use client";

import { m, useMotionValue, useTransform, useSpring } from "framer-motion";
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
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return;
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
                    duration: isMobile ? 1.8 : 1.8,
                    ease: "power4.inOut"
                });
            }

            // 2. Image Zoom & Subtle Float Effect
            tl.fromTo(".inner-image-content",
                { scale: isMobile ? 1.25 : 1.1, y: isMobile ? 50 : 30 },
                { scale: 1, y: 0, duration: isMobile ? 2.5 : 2.2, ease: "power2.out" },
                "-=1.6"
            );

            // 3. Title Lines
            const titleLines = Array.from(titleRef.current?.querySelectorAll(".title-line-inner") || []);
            if (titleLines.length > 0) {
                tl.fromTo(titleLines,
                    { y: "100%", skewY: 5, opacity: 0 },
                    {
                        y: 0,
                        skewY: 0,
                        opacity: 1,
                        stagger: isMobile ? 0.05 : 0.1,
                        duration: isMobile ? 0.7 : 1,
                        ease: "power4.out"
                    },
                    "-=1.5"
                );
            }

            // 4. Description & Elements
            if (descriptionRef.current) {
                tl.fromTo(descriptionRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
                    "-=1.2"
                );
            }

            tl.fromTo(".about-list-item",
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, stagger: 0.05, duration: 0.8, ease: "power2.out" },
                "-=0.6"
            );

            // Continuous Parallax Effects
            const speedMult = isMobile ? 0.45 : 1; // Greatly increased for mobile

            // Image Container Parallax (Vertical drift)
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

            // Decorations
            gsap.to(".about-decoration-blob", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 2,
                },
                y: -120 * speedMult,
                rotation: 45,
                ease: "none"
            });

            // Floating ring
            gsap.to(".about-decoration-ring", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5,
                },
                y: 80 * speedMult,
                scale: 1.1,
                ease: "none"
            });


        }, sectionRef);

        return () => ctx.revert();
    }, [mounted, isMobile]);

    return (
        <section ref={sectionRef} className="py-24 md:py-40 relative bg-black overflow-hidden" id="sobre">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-silver-bh)]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="container mx-auto px-6 relative z-10"
            >
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Image Side - Desktop Tilt & Parallax */}
                    <m.div
                        className="w-full lg:w-1/2 relative group"
                        style={!isMobile ? { perspective: 1000 } : {}}
                    >
                        <m.div
                            ref={imageWrapperRef}
                            className="about-image-wrapper relative rounded-2xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10"
                            style={!isMobile ? { rotateX, rotateY, transformStyle: "preserve-3d" } : {}}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Cinematic Reveal Shade */}
                            <div
                                ref={revealShadeRef}
                                className="absolute inset-0 bg-neutral-900 z-30"
                            />

                            {/* Main Image with Zoom Effect */}
                            <div className="relative w-full h-[450px] md:h-[600px] lg:h-[750px] overflow-hidden inner-image-content">
                                <Image
                                    src="/assets/images/elevando-padrao-premium.jpg"
                                    alt="Elevando o padrão da Odontologia Estética"
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 800px"
                                />
                                {/* Glass Overlay on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            </div>

                            {/* Floating ring decoration inside tilt container */}
                            <div
                                className="absolute -top-10 -right-10 w-40 h-40 border border-white/10 rounded-full about-decoration-ring pointer-events-none z-20 backdrop-blur-[2px] bg-white/5"
                                style={!isMobile ? { transform: "translateZ(50px)" } : {}}
                            />
                        </m.div>

                        {/* External decorative blob */}
                        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br from-[var(--color-silver-bh)]/20 to-transparent blur-3xl rounded-full about-decoration-blob pointer-events-none -z-10" />
                    </m.div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start">
                        <m.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="flex items-center gap-4 mb-8"
                        >
                            <span className="w-12 h-[1px] bg-gradient-to-r from-[var(--color-silver-bh)] to-transparent" />
                            <span className="text-[var(--color-silver-bh)] font-semibold tracking-extra-wide uppercase text-[10px] md:text-xs font-body">
                                Excelência e Tradição
                            </span>
                        </m.div>

                        <h2 ref={titleRef} className="font-display text-[clamp(2.5rem,7.5vw,5.5rem)] font-black mb-10 text-white leading-[1] tracking-[0.05em] uppercase">
                            <div className="block overflow-hidden pb-1">
                                <span className="title-line-inner inline-block text-glitch" data-text="Elevando o padrão da">Elevando o padrão da</span>
                            </div>
                            <div className="block overflow-hidden pb-1">
                                <span className="title-line-inner inline-block text-gradient-silver font-black text-glitch" data-text="Odontologia Estética">Odontologia Estética</span>
                            </div>
                        </h2>

                        <p ref={descriptionRef} className="text-subheadline-editorial mb-12 border-l border-[var(--color-silver-bh)]/20 pl-8">
                            Mais do que tratamentos, oferecemos <span className="font-bold font-display uppercase tracking-wider text-white">confiança, conforto e segurança</span> em cada etapa do cuidado com quem você mais ama.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mb-16 w-full">
                            {highlights.map((item, index) => (
                                <div
                                    key={index}
                                    className="about-list-item flex items-center gap-5 group py-2 border-b border-white/5 hover:border-white/20 transition-colors cursor-default"
                                >
                                    <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[var(--color-silver-bh)] group-hover:border-[var(--color-silver-bh)] transition-all duration-500">
                                        <ArrowUpRight strokeWidth={1.5} className="w-3 h-3 text-[var(--color-silver-bh)] group-hover:text-black transition-colors" />
                                    </div>
                                    <span className="text-white/80 font-medium text-sm tracking-wide group-hover:text-white transition-colors">{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* Primary CTA suggestion */}
                        <m.button
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 }}
                            className="px-10 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-extra-wide rounded-full hover:bg-[var(--color-silver-bh)] transition-colors duration-500 font-body"
                        >
                            Descubra nossa tecnologia
                        </m.button>
                    </div>
                </div>
            </m.div>
        </section>
    );
}

