"use client";

import { m } from "framer-motion";
import { Sparkles } from "lucide-react";
import { MediaCard } from "./MediaCard";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const cases = [
    {
        video: "/assets/videos/results/grok-resultados.mp4",
        poster: "/assets/images/service-sensitivity.png",
        title: "Reabilitação Oral de Precisão",
        description: "Transformação completa utilizando protocolos digitais e lentes de contato de porcelana, garantindo máxima naturalidade e funcionalidade."
    }
];

interface ResultCaseItem {
    video: string;
    poster: string;
    title: string;
    description: string;
}

function ResultCard({ item, index }: { item: ResultCaseItem; index: number }) {
    const [isVideoActive, setIsVideoActive] = useState(false);
    return (
        <m.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px", amount: 0.3 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="case-study-card light-sweep max-w-5xl w-full overflow-hidden rounded-organic-md border border-white/10 shadow-2xl bg-black"
        >
            {/* Video container — agora ocupa o card inteiro para um look "limpo" */}
            <div
                className="relative w-full h-full"
                onMouseEnter={() => setIsVideoActive(true)}
                onMouseLeave={() => setIsVideoActive(false)}
                onTouchStart={() => setIsVideoActive(true)}
                onTouchEnd={() => setIsVideoActive(false)}
            >
                {/* Overlay esquerdo — "Antes" */}
                <div className="absolute top-3 left-3 md:top-4 md:left-4 w-[80px] md:w-[100px] h-[30px] md:h-[36px] bg-black/60 backdrop-blur-md rounded-full z-30 pointer-events-none border border-white/10 flex items-center justify-center shadow-lg">
                    <span className="text-[9px] md:text-[11px] text-white font-semibold uppercase tracking-[0.2em]">Antes</span>
                </div>

                {/* Overlay direito — "Depois" */}
                <div className="absolute top-3 right-3 md:top-4 md:right-4 w-[80px] md:w-[100px] h-[30px] md:h-[36px] bg-black/60 backdrop-blur-md rounded-full z-30 pointer-events-none border border-white/10 flex items-center justify-center shadow-lg">
                    <span className="text-[9px] md:text-[11px] text-white font-semibold uppercase tracking-[0.2em]">Depois</span>
                </div>

                {/* Overlay inferior — cobre labels ou marcas d'água extras no fundo do vídeo */}
                <div className="absolute bottom-0 left-0 w-full h-[50px] bg-black z-30 pointer-events-none" />
                <div className="absolute bottom-[50px] left-0 w-full h-[30px] bg-gradient-to-t from-black to-transparent z-30 pointer-events-none" />


                <MediaCard
                    mp4Src={item.video}
                    posterSrc={item.poster}
                    alt={item.title}
                    ariaLabel={`Projeto: ${item.title}`}
                    aspectRatio="aspect-video"
                    playing={isVideoActive}
                    onPlay={() => setIsVideoActive(true)}
                    onPause={() => setIsVideoActive(false)}
                    className="w-full h-full object-cover scale-[1.01]" // Pequeno scale para garantir preenchimento total
                />
            </div>
        </m.div>
    );
}

export function CaseStudies() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
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

            // Central Card Parallax
            if (!isMobile) {
                gsap.fromTo(".case-study-card",
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

                // Desktop-only cinematic scroll effects
                // Image zoom effect on scroll
                gsap.to(".case-study-image", {
                    scale: 1.05,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top center",
                        end: "bottom top",
                        scrub: 1.5
                    }
                });

                // Title letter spacing increase
                gsap.to(titleRef.current, {
                    letterSpacing: "0.05em",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top center",
                        end: "bottom top",
                        scrub: true
                    }
                });

                // Ambient glow pulse
                if (glowRef.current) {
                    gsap.to(glowRef.current, {
                        opacity: 0.2,
                        scale: 1.2,
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top center",
                            end: "bottom top",
                            scrub: 1
                        }
                    });
                }
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted, isMobile]);

    return (
        <section ref={sectionRef} className="py-20 md:py-40 bg-[var(--color-background)] relative overflow-hidden" id="casos">
            {/* Ambient Lighting */}
            <div
                ref={glowRef}
                className="absolute top-1/2 left-0 w-[40%] h-[40%] glow-blob-warm opacity-10 pointer-events-none"
            />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mb-16 md:mb-32">
                    <m.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "0px 0px -100px 0px", amount: 0.3 }}
                        transition={{ duration: 1 }}
                        className="text-[var(--color-silver-bh)] font-semibold tracking-[0.4em] uppercase text-[10px] mb-8 block font-body"
                    >
                        Casos Clínicos
                    </m.span>
                    <h2 ref={titleRef} className="font-display text-[clamp(28px,7vw,88px)] font-medium text-white leading-[1.05] tracking-hero mb-8 uppercase">
                        <span className="text-mask-reveal">
                            <span className="title-line-inner inline-block">Resultados que</span>
                        </span>
                        <span className="text-mask-reveal">
                            <span className="title-line-inner inline-block text-gradient-silver italic font-light">falam por si.</span>
                        </span>
                    </h2>
                    <m.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 0.8, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className="text-lg md:text-xl text-white font-medium leading-[1.6] max-w-xl body-text-refined"
                    >
                        Explore a transformação real de nossos pacientes e veja como a precisão clínica encontra a estética absoluta.
                    </m.p>
                </div>

                <div className="flex justify-center">
                    {cases.map((item, index) => (
                        <ResultCard key={index} item={item} index={index} />
                    ))}
                </div>

            </div>
        </section>
    );
}
