"use client";

import { m } from "framer-motion";
import { Sparkles } from "lucide-react";
import { MediaCard } from "./MediaCard";
import { useRef, useEffect, useState } from "react";
import { LuxuryCard } from "./LuxuryCard";
import { PremiumReveal } from "./PremiumReveal";
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
        <LuxuryCard
            delay={0.2}
            innerClassName="p-0"
            className="max-w-5xl w-full"
            interactive={true}
        >
            <div
                className="relative w-full h-full"
                onMouseEnter={() => setIsVideoActive(true)}
                onMouseLeave={() => setIsVideoActive(false)}
                onTouchStart={() => setIsVideoActive(true)}
                onTouchEnd={() => setIsVideoActive(false)}
            >
                {/* Labels */}
                <div className="absolute top-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full z-30 border border-white/10 flex items-center justify-center">
                    <span className="text-[10px] text-[var(--color-text-primary)] font-bold uppercase tracking-[0.2em]">Antes</span>
                </div>
                <div className="absolute top-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full z-30 border border-white/10 flex items-center justify-center">
                    <span className="text-[10px] text-[var(--color-text-primary)] font-bold uppercase tracking-[0.2em]">Depois</span>
                </div>

                <MediaCard
                    mp4Src={item.video}
                    posterSrc={item.poster}
                    alt={item.title}
                    ariaLabel={item.title}
                    playing={isVideoActive}
                    className="w-full h-full object-cover scale-[1.01]"
                />

                {/* Bottom Mask for cleaner look */}
                <div className="absolute bottom-0 left-0 w-full h-12 bg-black z-30" />
            </div>
        </LuxuryCard>
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
                    <PremiumReveal direction="bottom" delay={0.1}>
                        <span className="editorial-label">
                            Casos Clínicos
                        </span>
                    </PremiumReveal>

                    <h2 className="font-headline text-[clamp(36px,6vw,72px)] font-semibold text-[var(--color-text-primary)] leading-[1.05] tracking-tight mb-8 uppercase">
                        <PremiumReveal type="mask" direction="bottom" delay={0.2}>
                            <span>Resultados que</span>
                        </PremiumReveal>
                        <PremiumReveal type="mask" direction="bottom" delay={0.3}>
                            <span className="text-[var(--color-accent-gold)] font-headline italic font-light block mt-2">falam por si.</span>
                        </PremiumReveal>
                    </h2>

                    <PremiumReveal direction="bottom" delay={0.4}>
                        <p className="text-[16px] text-[var(--color-text-secondary)] font-normal leading-[1.6] max-w-xl" style={{ fontFamily: 'var(--font-ui)' }}>
                            Explore a transformação real de nossos pacientes e veja como a precisão clínica encontra a estética absoluta.
                        </p>
                    </PremiumReveal>
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
