"use client";

import { m } from "framer-motion";
import { Coffee, ShieldCheck, Car, Heart, Sparkles, Clock } from "lucide-react";
import VisualContainer from "./VisualContainer";
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
    const [mounted, setMounted] = useState(false);

    const items = [
        {
            icon: <Car strokeWidth={1.2} className="w-5 h-5" />,
            title: "Valet Privativo",
            description: "Segurança e conforto desde a sua chegada com serviço de manobrista exclusivo."
        },
        {
            icon: <Coffee strokeWidth={1.2} className="w-5 h-5" />,
            title: "Premium Lounge",
            description: "Ambiente sofisticado com menu de cafés selecionados e Wi-Fi de alta velocidade."
        },
        {
            icon: <Heart strokeWidth={1.2} className="w-5 h-5" />,
            title: "Sedação Consciente",
            description: "Tratamentos absolutamente indolores e tranquilos para pacientes com fobia."
        },
        {
            icon: <ShieldCheck strokeWidth={1.2} className="w-5 h-5" />,
            title: "Padrão Hospitalar",
            description: "Protocolos rigorosos de biossegurança e esterilização de nível cirúrgico."
        },
        {
            icon: <Sparkles strokeWidth={1.2} className="w-5 h-5" />,
            title: "Concierge Dedicado",
            description: "Um assistente pessoal para cuidar de toda a sua jornada e necessidades burocráticas."
        },
        {
            icon: <Clock strokeWidth={1.2} className="w-5 h-5" />,
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
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted]);

    return (
        <section ref={sectionRef} className="py-20 md:py-40 bg-[var(--color-background)] relative overflow-hidden" id="experiencia-vip">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-20 items-start">

                    {/* Left Column: Context & Sticky Image */}
                    <div className="lg:w-5/12 sticky top-32">
                        <m.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-[var(--color-silver-bh)] font-semibold tracking-[0.4em] uppercase text-[10px] mb-8 block"
                        >
                            Hospitality
                        </m.span>
                        <h2 ref={titleRef} className="font-display text-5xl md:text-7xl font-light text-white leading-[1.0] mb-12">
                            <span className="block">Experiência</span>
                            <span className="block text-gradient-silver italic font-medium">Cinco Estrelas.</span>
                        </h2>
                        <p className="amenities-desc text-lg text-[var(--color-text-dim)] font-light leading-relaxed mb-12 max-w-md">
                            Cada detalhe foi curado para transcender a clínica tradicional. Um ambiente onde o luxo, o silêncio e o cuidado absoluto se fundem.
                        </p>

                        {/* Concept Image - Changes on Hover */}
                        <div className="hidden lg:block relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/5 bg-[#121212]">
                            <Image
                                src="/assets/images/luxury-lounge.png"
                                alt="Lounge Private"
                                fill
                                className="object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000 lounge-image-parallax"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />
                            <div className="absolute bottom-8 left-8 z-20">
                                <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-silver-bh)] mb-2">Ambiente</div>
                                <div className="text-2xl font-display text-white">Lounge Private</div>
                            </div>
                        </div>
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
                                    className="group border-b border-white/5 hover:border-[var(--color-silver-bh)]/30 transition-colors duration-500 py-10 cursor-default amenity-item-parallax"
                                >
                                    <div className="flex items-baseline justify-between mb-4">
                                        <h3 className="text-2xl md:text-3xl font-display text-[#E2E2E2] group-hover:text-white group-hover:translate-x-4 transition-all duration-500 ease-out">
                                            {item.title}
                                        </h3>
                                        <span className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-[0.2em] group-hover:text-[var(--color-silver-bh)] transition-colors duration-500 opacity-50 group-hover:opacity-100">
                                            0{index + 1}
                                        </span>
                                    </div>
                                    <p className="text-[var(--color-text-secondary)] text-sm md:text-base font-light leading-relaxed max-w-lg opacity-60 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-500 delay-75 ease-out pl-0 md:pl-0">
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
