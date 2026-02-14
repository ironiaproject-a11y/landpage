"use client";

import { m } from "framer-motion";
import { ArrowRight, CircleDashed, Diamond, Crown, Cpu } from "lucide-react";
import { clsx } from "clsx";
import VisualContainer from "./VisualContainer";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Magnetic } from "./Magnetic";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Services() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [mounted, setMounted] = useState(false);

    const services = [
        {
            icon: "CircleDashed",
            title: "Implantes Dentários",
            description: "Recupere a função e a estética do seu sorriso com implantes de alta durabilidade e precisão.",
            tag: "01",
            image: "/assets/images/service-implant.png"
        },
        {
            icon: "Diamond",
            title: "Tratamento de Bruxismo e Dor",
            description: "Alívio eficaz para dores orofaciais e proteção dos dentes contra o desgaste excessivo.",
            tag: "02",
            image: "/assets/images/root-canal-treatment.png"
        },
        {
            icon: "Crown",
            title: "Tratamento de Canal",
            description: "Procedimentos endodônticos avançados para salvar seus dentes com máximo conforto e segurança.",
            tag: "03",
            image: "/assets/images/service-sensitivity.png"
        },
        {
            icon: "Cpu",
            title: "Odontopediatria",
            description: "Cuidado especializado e acolhedor para a saúde bucal dos pequenos desde os primeiros anos.",
            tag: "04",
            image: "/assets/images/pediatric-dentistry.png"
        },
        {
            icon: "Diamond",
            title: "Estética Dental",
            description: "Transforme seu sorriso com facetas, clareamento e procedimentos que harmonizam sua face.",
            tag: "05",
            image: "/assets/images/service-aesthetic.png"
        },
        {
            icon: "CircleDashed",
            title: "Tratamento de Sensibilidade",
            description: "Tratamentos específicos para eliminar o desconforto e devolver o prazer de comer e beber.",
            tag: "06",
            image: "/assets/images/dental-exam.jpg"
        },
        {
            icon: "Crown",
            title: "Cirurgias e Extrações",
            description: "Procedimentos cirúrgicos seguros, realizados por especialistas com técnicas minimamente invasivas.",
            tag: "07",
            image: "/assets/images/surgery-room.jpg"
        },
        {
            icon: "Cpu",
            title: "Radiografia Panorâmica",
            description: "Diagnóstico completo com imagens amplas da arcada dentária para um planejamento preciso.",
            tag: "08",
            image: "/assets/images/3d-ct-scan.jpg"
        },
        {
            icon: "Diamond",
            title: "Protocolo Ortodôntico",
            description: "Correção e alinhamento dental com protocolos modernos para um sorriso funcional e estético.",
            tag: "09",
            image: "/assets/images/service-orthodontics.png"
        },
        {
            icon: "Cpu",
            title: "Escaneamento Digital",
            description: "Moldagem digital de alta precisão, eliminando massas e garantindo agilidade no tratamento.",
            tag: "10",
            image: "/assets/images/digital-scanning-process.jpg"
        },
        {
            icon: "CircleDashed",
            title: "Radiografia Digital",
            description: "Imagens radiográficas de alta definição com menor exposição à radiação e resultado imediato.",
            tag: "11",
            image: "/assets/images/digital-xray-tablet.jpg"
        },
        {
            icon: "Crown",
            title: "Skycam",
            description: "Tecnologia avançada para diagnósticos e acompanhamentos detalhados.",
            tag: "12",
            image: "/assets/images/skycam-device.jpg"
        }

    ];

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

            // Enhanced Asymmetrical Card Parallax with Horizontal Drift - Enabled for Mobile
            const speedMult = isMobile ? 0.4 : 1;

            const cards = gsap.utils.toArray(".service-card-wrapper");
            cards.forEach((card: any, i) => {
                const ySpeed = (i % 2 === 0 ? 60 : 120) * speedMult;
                const xDrift = (i % 2 === 0 ? 30 : -30) * speedMult;

                gsap.fromTo(card,
                    { y: ySpeed, x: xDrift * 0.5 },
                    {
                        scrollTrigger: {
                            trigger: card,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1.5
                        },
                        y: -ySpeed,
                        x: -xDrift,
                        ease: "power1.inOut"
                    }
                );

                // Float the individual tag within the card
                const tag = card.querySelector(".service-tag-parallax");
                if (tag) {
                    gsap.fromTo(tag,
                        { y: 20 * speedMult },
                        {
                            scrollTrigger: {
                                trigger: card,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 1
                            },
                            y: -40 * speedMult,
                            ease: "none"
                        }
                    );
                }
            });

            // Internal Image Lens Parallax (Ultra Smooth)
            gsap.utils.toArray(".service-image-parallax").forEach((img: any) => {
                gsap.fromTo(img,
                    { scale: 1.2, y: "-10%" },
                    {
                        scrollTrigger: {
                            trigger: img.closest(".service-card-wrapper"),
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        },
                        y: "10%",
                        ease: "none"
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted, isMobile]);

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent, card: HTMLElement) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mouse-x", `${x}%`);
        card.style.setProperty("--mouse-y", `${y}%`);
    };

    return (
        <section ref={sectionRef} className="py-24 md:py-32 bg-[var(--color-deep-black)] relative overflow-hidden" id="servicos">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />

            <div className="max-w-3xl mb-16 md:mb-24">
                <m.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[var(--color-silver-bh)] font-semibold tracking-[0.4em] uppercase text-[10px] mb-8 block font-body"
                >
                    Tratamentos de Elite
                </m.span>
                <h2 ref={titleRef} className="font-display text-[clamp(42px,7vw,90px)] font-light text-white leading-[0.9] tracking-tight">
                    <div className="block overflow-hidden pb-1">
                        <span className="title-line-inner inline-block">Soluções clínicas de</span>
                    </div>
                    <div className="block overflow-hidden pb-1">
                        <span className="title-line-inner inline-block text-gradient-silver font-medium italic">extrema precisão</span>.
                    </div>
                </h2>
            </div>

            {/* Services Grid Evolution - Dynamic Asymmetrical Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16 md:gap-y-32">
                {
                    services.map((service, index) => (
                        <m.div
                            key={index}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            viewport={{
                                once: true,
                                margin: "0px 0px -100px 0px",
                                amount: 0.3
                            }}
                            onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                            className={clsx(
                                "group relative service-card-wrapper spotlight-card",
                                index % 2 === 0 ? "md:translate-y-0" : "md:translate-y-24"
                            )}
                        >
                            <VisualContainer
                                width="100%"
                                height="auto"
                                hoverColor="rgba(203, 213, 225, 0.05)" // Silver-based hover
                                sideHeight="12px"
                            >
                                <div className="p-8 md:p-12 flex flex-col h-full">
                                    {/* Image Frame - Luxury Gallery Style */}
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] mb-12 bg-[#1A1A1A] border border-white/5 shadow-inner">
                                        <Image
                                            src={service.image}
                                            alt={service.title}
                                            width={800}
                                            height={600}
                                            className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105 grayscale-[40%] group-hover:grayscale-0 service-image-parallax"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                        {/* Floating Tag */}
                                        <div className="absolute top-6 right-6 w-12 h-12 rounded-full glass-panel flex items-center justify-center border-white/10 backdrop-blur-2xl service-tag-parallax">
                                            <span className="text-[var(--color-silver-bh)] font-display text-xs font-bold">
                                                {service.tag}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="h-[1px] bg-gradient-to-r from-[var(--color-silver-bh)]/30 to-transparent flex-grow" />
                                        </div>

                                        <h3 className="font-display text-3xl md:text-4xl font-medium mb-6 text-white group-hover:text-[var(--color-silver-bh)] transition-all duration-700 delay-100 leading-tight">
                                            {service.title}
                                        </h3>

                                        <p className="text-[var(--color-text-secondary)] leading-relaxed text-base mb-10 font-light group-hover:text-white/90 transition-colors duration-700 delay-150">
                                            {service.description}
                                        </p>

                                        <Magnetic strength={0.2} range={60}>
                                            <m.div
                                                whileHover={{ x: 5 }}
                                                onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                                                className="inline-flex items-center gap-4 text-[var(--color-silver-bh)] text-[10px] font-bold uppercase tracking-[0.4em] cursor-pointer transition-all duration-700 delay-100"
                                            >
                                                <span>Ver Protocolo</span>
                                                <ArrowRight strokeWidth={1.2} className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-700" />
                                            </m.div>
                                        </Magnetic>
                                    </div>
                                </div>
                            </VisualContainer>

                            {/* Hover Shadow Glow - Silver Clinical */}
                            <div className="absolute -inset-10 bg-[var(--color-silver-bh)]/5 blur-[120px] rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1500 -z-10" />
                        </m.div>
                    ))
                }
            </div>
        </section>
    );
}

