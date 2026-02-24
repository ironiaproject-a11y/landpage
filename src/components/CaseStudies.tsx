"use client";

import { m } from "framer-motion";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { Star } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const cases = [
    {
        beforeSource: "/assets/images/case-study-dental-premium.jpg",
        beforeType: "image" as const,
        afterSource: "/assets/videos/results/result-case-1.mp4",
        afterType: "video" as const,
        title: "Reabilitação Oral de Precisão",
        description: "Transformação completa utilizando protocolos digitais e lentes de contato de porcelana, garantindo máxima naturalidade e funcionalidade.",
        isSingleMedia: false
    }
];

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
        <section ref={sectionRef} className="py-24 md:py-40 bg-[var(--color-background)] relative overflow-hidden" id="casos">
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
                    <h2 ref={titleRef} className="font-display text-5xl md:text-8xl font-medium text-white leading-[0.9] tracking-tight mb-8">
                        <div className="block overflow-hidden pb-1">
                            <span className="title-line-inner inline-block">Resultados que</span>
                        </div>
                        <div className="block overflow-hidden pb-1">
                            <span className="title-line-inner inline-block text-gradient-silver">falam por si</span>.
                        </div>
                    </h2>
                    <m.p
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className="text-lg md:text-xl text-[var(--color-text-secondary)] font-light leading-relaxed max-w-xl"
                    >
                        Explore a transformação real de nossos pacientes e veja como a precisão clínica encontra a estética absoluta.
                    </m.p>
                </div>

                <div className="flex justify-center">
                    {cases.map((item, index) => (
                        <m.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "0px 0px -100px 0px", amount: 0.3 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="case-study-card light-sweep max-w-5xl w-full"
                        >
                            <BeforeAfterSlider
                                beforeSource={item.beforeSource}
                                beforeType={item.beforeType}
                                afterSource={item.afterSource}
                                afterType={item.afterType}
                                title={item.title}
                                description={item.description}
                                isSingleMedia={item.isSingleMedia}
                            />
                        </m.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
