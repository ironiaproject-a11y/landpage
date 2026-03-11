"use client";

import { m } from "framer-motion";
import { Quote, Star } from "lucide-react";
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

export function Testimonials() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const testimonials = [
        {
            name: "Dr. Mariana Costa",
            role: "Empresária & Palestrante",
            content: "Recuperei minha segurança ao sorrir. O planejamento digital tornou todo o processo previsível e o resultado ficou incrivelmente natural.",
            rating: 5,
            image: "/assets/images/dr-ricardo.png"
        },
        {
            name: "Ricardo Oliveira",
            role: "Sócio-Diretor Corporativo",
            content: "Precisão clínica excepcional. A equipe demonstrou um domínio técnico impressionante em cada etapa do meu tratamento de implantes.",
            rating: 5,
            image: "/assets/images/luxury-lounge.png"
        },
        {
            name: "Fernanda Santos",
            role: "Arquiteta de Interiores",
            content: "O atendimento exclusivo e o ambiente sofisticado fazem toda a diferença. Superou minhas expectativas mais exigentes.",
            rating: 5,
            image: "/assets/images/clinic-interior.png"
        },
        {
            name: "Dr. Carlos Eduardo",
            role: "Cirurgião Plástico",
            content: "Como profissional da área de estética, sou extremamente rigoroso. A Clínica Premium entrega um nível de acabamento e naturalidade que raramente se vê.",
            rating: 5,
            image: "/assets/images/dr-ricardo.png"
        },
        {
            name: "Beatriz Lins",
            role: "Executiva de Tecnologia",
            content: "O protocolo de atendimento digital é fascinante. Rapidez, eficiência e um resultado que transformou minha presença profissional.",
            rating: 5,
            image: "/assets/images/luxury-lounge.png"
        }
    ];

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
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

            // Scroll-Influenced Marquee Speed (Desktop only for performance)
            const marquee = sectionRef.current?.querySelector(".testimonials-marquee");
            if (marquee && !isMobile) {
                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    onUpdate: (self) => {
                        const velocity = Math.abs(self.getVelocity() / 1000);
                        const marqueeInner = sectionRef.current?.querySelector(".marquee-inner");
                        if (marqueeInner) {
                            gsap.to(marqueeInner, {
                                timeScale: 1 + velocity,
                                duration: 0.5,
                                overwrite: "auto"
                            });
                        }
                    }
                });
            }

            // Desktop-only cinematic scroll effects
            // Testimonial cards stagger reveal
            const cards = gsap.utils.toArray(".testimonial-card");
            if (cards.length > 0) {
                gsap.fromTo(cards,
                    { opacity: 0, y: 40 },
                    {
                        scrollTrigger: {
                            trigger: ".testimonials-marquee",
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        },
                        opacity: 1,
                        y: 0,
                        stagger: 0.15,
                        duration: 1,
                        ease: "power3.out"
                    }
                );
            }

            // Star rating shine effect
            gsap.to(".star-icon", {
                opacity: 1,
                scale: 1.1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top center",
                    end: "bottom top",
                    scrub: 1.5
                }
            });

            // Quote marks rotation
            gsap.to(".quote-icon-rotate", {
                rotation: 15,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top center",
                    end: "bottom top",
                    scrub: 2
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted, isMobile]);

    return (
        <section
            ref={sectionRef}
            id="depoimentos"
            className="relative py-16 md:py-32 overflow-hidden bg-[#0a0a0a]"
        >
            {/* Cremic Atmospheric Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#E6D3A3]/5 blur-[120px] pointer-events-none" />
            <div className="absolute -top-[10%] -right-[10%] w-[30%] h-[30%] bg-[#E6D3A3]/5 blur-[100px]" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header Evolution */}
                <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
                    <PremiumReveal type="fade" direction="top" duration={1}>
                        <span className="text-[#E6D3A3] font-semibold tracking-[0.4em] uppercase text-[10px] mb-8 block">
                            Prova Social
                        </span>
                    </PremiumReveal>

                    <PremiumReveal type="mask" direction="bottom">
                        <h2 className="font-display text-[clamp(36px,6vw,72px)] font-semibold text-[#F8F8F6] leading-[1.05] tracking-tight uppercase" style={{ fontFamily: '"Playfair Display", serif' }}>
                            Histórias de<br />
                            <span className="text-[#E6D3A3] font-display italic font-light block mt-2">transformação real.</span>
                        </h2>
                    </PremiumReveal>
                </div>

                {/* Testimonials Marquee Evolution */}
                <div className="relative -mx-6 md:-mx-12">
                    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] testimonials-marquee">
                        <m.div
                            animate={{
                                x: ["0%", "-100%"],
                            }}
                            whileHover={{ animationPlayState: "paused" }}
                            transition={{
                                duration: 25,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                            className="flex gap-6 md:gap-10 pr-10 marquee-inner will-change-transform"
                            style={{ width: "max-content" }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="testimonial-card w-[320px] md:w-[450px] shrink-0 h-full"
                                >
                                    <LuxuryCard
                                        className="h-full border-white/5"
                                        innerClassName="p-10 md:p-12"
                                        glowColor="rgba(245, 245, 220, 0.03)"
                                    >
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="mb-10 relative">
                                                <Quote strokeWidth={1.2} className="quote-icon-rotate w-12 h-12 text-[#F8F8F6]/10" />
                                            </div>

                                            <div className="flex gap-2 mb-8">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} strokeWidth={1.2} className="star-icon w-3.5 h-3.5 fill-[#F8F8F6] text-[#F8F8F6] opacity-80" />
                                                ))}
                                            </div>

                                            <p className="text-[#F8F8F6] text-[20px] italic leading-[1.6] mb-12 flex-grow font-normal" style={{ fontFamily: '"Playfair Display", serif' }}>
                                                &quot;{testimonial.content}&quot;
                                            </p>

                                            <div className="pt-8 border-t border-white/5 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#F8F8F6]/10 relative">
                                                    <Image
                                                        src={testimonial.image}
                                                        alt={testimonial.name}
                                                        fill
                                                        className="object-cover grayscale-[30%]"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-[#F8F8F6] text-base tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>{testimonial.name}</h4>
                                                    <p className="text-[10px] text-[#6B7280] uppercase tracking-[0.08em] font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>{testimonial.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </LuxuryCard>
                                </div>
                            ))}
                        </m.div>
                    </div>
                </div>
            </div>
        </section >
    );
}
