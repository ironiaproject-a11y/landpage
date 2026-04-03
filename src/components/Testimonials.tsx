"use client";

import { m } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { PremiumReveal } from "./PremiumReveal";
import { LuxuryCard } from "./LuxuryCard";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/* ── Avatar com iniciais (substitui fotos de pacientes) ── */
function Avatar({ name, color }: { name: string; color: string }) {
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("");
    return (
        <div
            className="w-12 h-12 rounded-full flex items-center justify-center border border-white/10 shrink-0"
            style={{ background: color }}
            aria-label={name}
        >
            <span className="text-[13px] font-medium text-white tracking-wide">{initials}</span>
        </div>
    );
}

export function Testimonials() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const testimonials = [
        {
            name: "Mariana Costa",
            role: "Empresária & Palestrante",
            content: "Recuperei minha segurança ao sorrir. O planejamento digital tornou todo o processo previsível e o resultado ficou incrivelmente natural.",
            rating: 5,
            avatarColor: "rgba(139,115,85,0.55)"
        },
        {
            name: "Ricardo Oliveira",
            role: "Sócio-Diretor Corporativo",
            content: "Precisão clínica excepcional. A equipe demonstrou um domínio técnico impressionante em cada etapa do meu tratamento de implantes.",
            rating: 5,
            avatarColor: "rgba(60,90,120,0.55)"
        },
        {
            name: "Fernanda Santos",
            role: "Arquiteta de Interiores",
            content: "O atendimento exclusivo e o ambiente sofisticado fazem toda a diferença. Superou minhas expectativas mais exigentes.",
            rating: 5,
            avatarColor: "rgba(100,85,130,0.55)"
        },
        {
            name: "Carlos Eduardo",
            role: "Cirurgião Plástico",
            content: "Como profissional da área de estética, sou extremamente rigoroso. A clínica entrega um nível de acabamento e naturalidade que raramente se vê.",
            rating: 5,
            avatarColor: "rgba(80,110,90,0.55)"
        },
        {
            name: "Beatriz Lins",
            role: "Executiva de Tecnologia",
            content: "O protocolo de atendimento digital é fascinante. Rapidez, eficiência e um resultado que transformou minha presença profissional.",
            rating: 5,
            avatarColor: "rgba(140,80,80,0.55)"
        },
        {
            name: "André Monteiro",
            role: "Empresário",
            content: "Fiz implantes com medo, mas a equipe me deixou completamente tranquilo. Hoje tenho um sorriso que jamais tive. Recomendo sem hesitar.",
            rating: 5,
            avatarColor: "rgba(60,100,140,0.55)"
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
            className="relative py-16 md:py-32 overflow-hidden"
            style={{ background: '#F8F6F2' }}
        >
            {/* Subtle warm grain overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-multiply pointer-events-none" />
            {/* Soft top/bottom gradients for page blending */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header Evolution */}
                <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
                    <PremiumReveal type="fade" direction="top" duration={1}>
                        <span className="text-level-4 uppercase mb-8 block text-center" style={{ color: 'rgba(0,0,0,0.45)' }}>
                            Prova Social
                        </span>
                    </PremiumReveal>

                    <PremiumReveal type="mask" direction="bottom">
                        <h2 className="text-level-2" style={{ color: '#0D0D0D' }}>
                            Histórias de<br />
                            <span className="text-headline-sub block mt-4" style={{ color: 'rgba(0,0,0,0.55)' }}>transformação real.</span>
                        </h2>
                    </PremiumReveal>
                </div>

                {/* Testimonials Marquee Evolution */}
                <div className="relative -mx-6 md:-mx-12">
                    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] testimonials-marquee">
                        <m.div
                            animate={{
                                x: ["0%", "-50%"],
                            }}
                            whileHover={{ animationPlayState: "paused" }}
                            whileTap={{ animationPlayState: "paused" }}
                            transition={{
                                duration: 30,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                            className="flex gap-6 md:gap-10 pr-10 marquee-inner will-change-transform"
                            style={{ width: "max-content" }}
                        >
                            {/* Duplicamos os cards para o loop infinito funcionar perfeitamente */}
                            {[...testimonials, ...testimonials].map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="testimonial-card w-[320px] md:w-[450px] shrink-0 h-full"
                                >
                                    {/* Card com fundo escuro sobre seção branca — contraste intencional */}
                                    <div className="h-full rounded-[2rem] border border-black/8 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.14)] transition-shadow duration-700 p-10 md:p-12 flex flex-col">
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="mb-10 relative">
                                                <Quote strokeWidth={1} className="quote-icon-rotate w-12 h-12 text-black/10" />
                                            </div>

                                            <div className="flex gap-2 mb-8">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} strokeWidth={1} className="star-icon w-3.5 h-3.5 fill-black text-black opacity-75" />
                                                ))}
                                            </div>

                                            <p className="italic mb-12 flex-grow leading-relaxed" style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', color: 'rgba(0,0,0,0.72)', fontWeight: 300 }}>
                                                &quot;{testimonial.content}&quot;
                                            </p>

                                            <div className="pt-8 border-t border-black/8 flex items-center gap-4">
                                                <Avatar name={testimonial.name} color={testimonial.avatarColor} />
                                                <div>
                                                    <h4 className="text-level-3" style={{ fontWeight: 500, color: '#0D0D0D' }}>{testimonial.name}</h4>
                                                    <p className="text-level-4 uppercase" style={{ fontWeight: 400, color: 'rgba(0,0,0,0.45)' }}>{testimonial.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </m.div>
                    </div>
                </div>
            </div>
        </section >
    );
}
