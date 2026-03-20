"use client";

import { m } from "framer-motion";
import { Coffee, ShieldCheck, Car, Heart, Sparkles, Clock } from "lucide-react";
import { PremiumReveal } from "./PremiumReveal";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Amenities() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    const items = [
        {
            icon: <Car strokeWidth={1} className="w-5 h-5 text-white/60" />,
            title: "Valet Privativo",
            description: "Segurança e conforto desde a sua chegada com serviço de manobrista exclusivo."
        },
        {
            icon: <Coffee strokeWidth={1} className="w-5 h-5 text-white/60" />,
            title: "Premium Lounge",
            description: "Ambiente sofisticado com menu de cafés selecionados e Wi-Fi de alta velocidade."
        },
        {
            icon: <Heart strokeWidth={1} className="w-5 h-5 text-white/60" />,
            title: "Sedação Consciente",
            description: "Tratamentos absolutamente indolores e tranquilos para pacientes com fobia."
        },
        {
            icon: <ShieldCheck strokeWidth={1} className="w-5 h-5 text-white/60" />,
            title: "Padrão Hospitalar",
            description: "Protocolos rigorosos de biossegurança e esterilização de nível cirúrgico."
        },
        {
            icon: <Sparkles strokeWidth={1} className="w-5 h-5 text-white/60" />,
            title: "Concierge Dedicado",
            description: "Um assistente pessoal para cuidar de toda a sua jornada e necessidades burocráticas."
        },
        {
            icon: <Clock strokeWidth={1} className="w-5 h-5 text-white/60" />,
            title: "Pontualidade VIP",
            description: "Respeitamos seu tempo com rigor britânico e atendimento personalizado sem esperas."
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

            // Description reveal
            gsap.fromTo(".amenities-desc",
                { y: 20, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: titleRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    delay: 0.4,
                    ease: "power4.out"
                }
            );

            // Staggered Item Parallax - subtle speed differences
            const ammoItems = gsap.utils.toArray(".amenity-item-parallax");
            ammoItems.forEach((item: any, i) => {
                gsap.fromTo(item,
                    { y: 30 * (i % 2 === 0 ? 1 : -1) },
                    {
                        scrollTrigger: {
                            trigger: item,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1.5,
                        },
                        y: -30 * (i % 2 === 0 ? 1 : -1),
                        ease: "none"
                    }
                );
            });

            // Sticky Image Internal Parallax (Lens effect)
            gsap.fromTo(".lounge-image-parallax",
                { y: "-10%", scale: 1.1 },
                {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    },
                    y: "10%",
                    scale: 1,
                    ease: "none"
                }
            );

            // Ornaments Parallax
            gsap.fromTo(".ornament-parallax",
                { y: (i) => 100 * (i + 1), rotate: 0 },
                {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5
                    },
                    y: (i) => -100 * (i + 1),
                    rotate: (i) => 15 * (i + 1),
                    ease: "none"
                }
            );

            // Desktop-only cinematic scroll effects
            const isMobile = window.innerWidth < 768;
            if (!isMobile) {
                // Heading scale refinement on scroll
                if (titleRef.current) {
                    gsap.to(titleRef.current, {
                        scale: 0.95,
                        opacity: 0.8,
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top top",
                            end: "bottom top",
                            scrub: true
                        }
                    });
                }

                // Ambient lighting expansion pulse on scroll
                if (glowRef.current) {
                    gsap.to(glowRef.current, {
                        scale: 1.4,
                        opacity: 0.25,
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1.2
                        }
                    });
                }
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted]);

    return (
        <section ref={sectionRef} className="py-20 md:py-40 bg-[var(--color-background)] relative overflow-hidden" id="experiencia-vip">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-start">

                    {/* Left Column: Context & Sticky Image */}
                    <div className="lg:w-5/12 sticky top-32">
                        <PremiumReveal direction="bottom" delay={0.1}>
                            <span className="text-level-4 uppercase mb-8 block">
                                Hospitality
                            </span>
                        </PremiumReveal>

                        <h2 className="text-level-2 mb-12 uppercase">
                            <PremiumReveal type="mask" direction="bottom" delay={0.2}>
                                <span>Experiência</span>
                            </PremiumReveal>
                            <PremiumReveal type="mask" direction="bottom" delay={0.3}>
                                <span className="text-white text-level-3 italic block mt-2">Cinco Estrelas.</span>
                            </PremiumReveal>
                        </h2>

                        <PremiumReveal direction="bottom" delay={0.4}>
                            <p className="text-level-3 mb-12 max-w-md">
                                Cada detalhe foi curado para transcender a clínica tradicional. Um ambiente onde o luxo, o silêncio e o cuidado absoluto se fundem.
                            </p>
                        </PremiumReveal>

                        {/* Concept Image - Changes on Hover */}
                        <PremiumReveal type="mask" direction="right" delay={0.5} className="hidden lg:block rounded-[2rem]">
                            <div className="relative w-full aspect-[4/5] overflow-hidden border border-white/5 bg-[#121212]">
                                <Image
                                    src="/assets/images/luxury-lounge.png"
                                    alt="Lounge Private"
                                    fill
                                    className="object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000 lounge-image-parallax"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />
                                <div className="absolute bottom-8 left-8 z-20">
                                    <div className="text-level-4 uppercase mb-2">Ambiente</div>
                                    <div className="text-level-2">Lounge Private</div>
                                </div>
                            </div>
                        </PremiumReveal>
                    </div>

                    {/* Right Column: The "Menu" of Amenities */}
                    <div className="lg:w-7/12 w-full pt-10">
                        <div className="flex flex-col">
                            {items.map((item, index) => (
                                <m.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    viewport={{ once: true, margin: "-5%" }}
                                    className="group border-b border-white/5 hover:border-[#F8F8F6]/30 transition-colors duration-500 py-10 cursor-default amenity-item-parallax"
                                >
                                    <div className="flex items-baseline justify-between mb-4">
                                        <h3 className="text-level-3 font-semibold text-[#E2E2E2] group-hover:text-white group-hover:translate-x-4 transition-all duration-500 ease-out">
                                            {item.title}
                                        </h3>
                                        <span className="text-level-4 uppercase group-hover:text-[var(--color-text-primary)] transition-colors duration-500 opacity-50 group-hover:opacity-100">
                                            0{index + 1}
                                        </span>
                                    </div>
                                    <p className="text-level-3">
                                        {item.description}
                                    </p>
                                </m.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
