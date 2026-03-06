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

            // Image Container Parallax
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

        }, sectionRef);

        return () => ctx.revert();
    }, [mounted, isMobile]);

    return (
        <section ref={sectionRef} className="py-20 md:py-40 relative bg-black overflow-hidden" id="sobre">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Image Side */}
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
                            <div ref={revealShadeRef} className="absolute inset-0 bg-neutral-900 z-30" />
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
                            <span className="text-[var(--color-silver-bh)] font-semibold tracking-[0.4em] uppercase text-[10px] mb-8 block">
                                Excelência Master
                            </span>
                        </PremiumReveal>

                        <h2 className="font-display text-[clamp(28px,4.5vw,48px)] font-medium mb-12 text-white leading-[1.1] tracking-[-0.01em] uppercase">
                            <PremiumReveal type="mask" direction="bottom" delay={0.2}>
                                <span>Redefinindo o Conceito de</span>
                            </PremiumReveal>
                            <PremiumReveal type="mask" direction="bottom" delay={0.3}>
                                <span className="text-gradient-silver italic font-light block mt-2">Luxo Odontológico.</span>
                            </PremiumReveal>
                        </h2>

                        <PremiumReveal direction="bottom" delay={0.4}>
                            <p className="text-lg text-white/70 font-light leading-relaxed mb-10 body-text-refined">
                                Combinamos a precisão da tecnologia alemã com a sensibilidade artística de reabilitações biomiméticas, criando uma experiência que transcende o tratamento clínico.
                            </p>
                        </PremiumReveal>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mb-16 w-full">
                            {highlights.map((item, index) => (
                                <div key={index} className="about-list-item flex items-center gap-5 group py-2 border-b border-white/5 hover:border-white/20 transition-colors">
                                    <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[var(--color-silver-bh)] transition-all">
                                        <ArrowUpRight className="w-3 h-3 text-[var(--color-silver-bh)] group-hover:text-black transition-colors" />
                                    </div>
                                    <span className="text-white/80 font-medium text-sm tracking-wide group-hover:text-white">{item}</span>
                                </div>
                            ))}
                        </div>

                        <m.button
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 }}
                            className="px-10 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.08em] min-h-[52px] rounded-full hover:bg-[var(--color-silver-bh)] transition-colors duration-500 font-body"
                        >
                            Descubra nossa tecnologia
                        </m.button>
                    </div>
                </div>
            </div>
        </section>
    );
}
