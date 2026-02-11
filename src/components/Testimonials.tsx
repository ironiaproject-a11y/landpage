"use client";

import { m } from "framer-motion";
import { Quote, Star } from "lucide-react";
import VisualContainer from "./VisualContainer";
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

            // Scroll-Influenced Marquee Speed
            const marquee = sectionRef.current?.querySelector(".testimonials-marquee");
            if (marquee) {
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
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted]);

    return (
        <section ref={sectionRef} className="py-24 md:py-32 bg-[var(--color-deep-black)] relative overflow-hidden" id="depoimentos">
            {/* Atmospheric Lighting Evolution */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] glow-blob-warm opacity-10 pointer-events-none" />
            <div className="absolute -top-[10%] -right-[10%] w-[30%] h-[30%] glow-blob opacity-20" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header Evolution */}
                <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
                    <m.span
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-[var(--color-silver-bh)] font-semibold tracking-[0.4em] uppercase text-[10px] mb-8 block"
                    >
                        Prova Social
                    </m.span>
                    <h2 ref={titleRef} className="font-display text-5xl md:text-7xl font-medium text-white leading-[0.95] tracking-tight">
                        <div className="block overflow-hidden pb-1">
                            <span className="title-line-inner inline-block">Histórias de</span>
                        </div>
                        <div className="block overflow-hidden pb-1">
                            <span className="title-line-inner inline-block text-gradient-silver">transformação real</span>.
                        </div>
                    </h2>
                </div>

                {/* Testimonials Marquee Evolution */}
                <div className="relative -mx-6 md:-mx-12">
                    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] testimonials-marquee">
                        <m.div
                            animate={{
                                x: ["0%", "-50%"],
                            }}
                            whileHover={{ animationPlayState: "paused" }}
                            transition={{
                                duration: 35,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                            className="flex gap-10 pr-10 marquee-inner"
                            style={{ width: "max-content" }}
                        >
                            {[...testimonials, ...testimonials].map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="w-[450px] shrink-0 h-full"
                                >
                                    <VisualContainer
                                        width="100%"
                                        height="100%"
                                        hoverColor="rgba(199, 168, 107, 0.05)"
                                        sideHeight="5px"
                                        className="rounded-organic-md light-sweep"
                                    >
                                        <div className="p-12 relative overflow-hidden group h-full">
                                            {/* Quote Icon Evolution */}
                                            <div className="mb-12 relative">
                                                <Quote strokeWidth={1.2} className="w-16 h-16 text-[var(--color-silver-bh)]/10 rotate-180 group-hover:text-[var(--color-silver-bh)]/20 transition-all duration-700" />
                                            </div>

                                            <div className="relative z-10 flex flex-col h-full">
                                                {/* Stars Evolution */}
                                                <div className="flex gap-2 mb-10">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <Star key={i} strokeWidth={1.2} className="w-4 h-4 fill-[var(--color-silver-bh)] text-[var(--color-silver-bh)] opacity-80" />
                                                    ))}
                                                </div>

                                                {/* Content Evolution */}
                                                <p className="font-editorial text-2xl text-white/90 italic leading-relaxed mb-12 flex-grow font-light">
                                                    "{testimonial.content}"
                                                </p>

                                                {/* Author Evolution */}
                                                <div className="pt-10 border-t border-white/5 flex items-center gap-5">
                                                    <div className="w-14 h-14 rounded-full overflow-hidden border border-[var(--color-silver-bh)]/30 shadow-level-2 relative group-hover:border-[var(--color-silver-bh)] transition-colors duration-500">
                                                        <Image
                                                            src={testimonial.image}
                                                            alt={testimonial.name}
                                                            fill
                                                            className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-white text-lg tracking-tight">{testimonial.name}</h4>
                                                        <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-[0.2em] font-bold">{testimonial.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </VisualContainer>
                                </div>
                            ))}
                        </m.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
