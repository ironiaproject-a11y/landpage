"use client";

import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import VisualContainer from "./VisualContainer";
import Image from "next/image";
import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LuxuryCard } from "./LuxuryCard";
import { PremiumReveal } from "./PremiumReveal";
import { Magnetic } from "./Magnetic";
import { MediaCard } from "./MediaCard";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface Service {
    icon: string;
    title: string;
    description: string;
    tag: string;
    image: string;
    video: string;
}

function ServiceCard({ service, index, isMobile }: { service: Service; index: number; isMobile: boolean }) {
    const [isVideoActive, setIsVideoActive] = useState(false);

    const handlePlayInternal = useCallback(() => setIsVideoActive(true), []);
    const handlePauseInternal = useCallback(() => setIsVideoActive(false), []);

    return (
        <LuxuryCard
            delay={index * 0.1}
            className="h-full"
            innerClassName="p-0" // We'll handle padding internally for media alignment
        >
            <div
                className="flex flex-col h-full cursor-pointer"
                onMouseEnter={() => setIsVideoActive(true)}
                onMouseLeave={() => setIsVideoActive(false)}
                onTouchStart={() => setIsVideoActive(true)}
                onTouchEnd={() => setIsVideoActive(false)}
            >
                {/* Media Section */}
                <div className="relative overflow-hidden rounded-t-2xl p-6">
                    <div className="transform transition-transform duration-1000 ease-[0.22,1,0.36,1] group-hover:scale-[1.05]">
                        <MediaCard
                            mp4Src={service.video}
                            webmSrc={service.video.replace('.mp4', '.webm')}
                            posterSrc={service.image}
                            alt={service.title}
                            ariaLabel={service.title}
                            className="shadow-2xl rounded-xl overflow-hidden"
                            playing={isVideoActive}
                        />
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-10 md:p-12 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-white/40 font-display text-[9px] font-bold tracking-[0.4em] uppercase">Pilar {service.tag}</span>
                        <div className="h-px bg-white/10 flex-grow" />
                    </div>

                    <h3 className="font-display text-2xl font-medium mb-4 text-white group-hover:text-[var(--color-accent)] transition-colors duration-700 uppercase tracking-tight">
                        {service.title}
                    </h3>

                    <p className="text-white/60 leading-[1.7] text-sm mb-8 md:mb-12 font-light body-text-refined">
                        {service.description}
                    </p>

                    <div className="mt-auto">
                        <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md text-white/80 text-[10px] font-bold uppercase tracking-[0.3em] group-hover:bg-white/10 group-hover:border-white/20 group-hover:text-white transition-all duration-500">
                            <span>Conhecer Protocolo</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </LuxuryCard>
    );
}

export function Services() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const overlayDarkRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    // Agent: Prioritize the first video to avoid black frames on entry
    // We hoist this link via Next.js
    const firstVideo = "/assets/videos/services/implant_new.mp4";

    const services: Service[] = [
        {
            icon: "CircleDashed",
            title: "Implantes Dentários",
            description: "Recupere a função e a estética do seu sorriso com implantes de alta durabilidade e precisão.",
            tag: "01",
            image: "/assets/images/service-implant.png",
            video: "/assets/videos/services/implant_new.mp4"
        },
        {
            icon: "Diamond",
            title: "Tratamento de Bruxismo e Dor",
            description: "Alívio eficaz para dores orofaciais e proteção dos dentes contra o desgaste excessivo.",
            tag: "02",
            image: "/assets/images/dental-exam.jpg",
            video: "/assets/videos/services/bruxismo.mp4"
        },
        {
            icon: "Crown",
            title: "Tratamento de Canal",
            description: "Procedimentos endodônticos avançados para salvar seus dentes com máximo conforto e segurança.",
            tag: "03",
            image: "/assets/images/root-canal-treatment.png",
            video: "/assets/videos/services/canal.mp4"
        },
        {
            icon: "Cpu",
            title: "Odontopediatria",
            description: "Cuidado especializado e acolhedor para a saúde bucal dos pequenos desde os primeiros anos.",
            tag: "04",
            image: "/assets/images/pediatric-dentistry.png",
            video: "/assets/videos/services/pediatrics.mp4"
        },
        {
            icon: "Diamond",
            title: "Estética Dental",
            description: "Transforme seu sorriso com facetas, clareamento e procedimentos que harmonizam sua face.",
            tag: "05",
            image: "/assets/images/service-aesthetic.png",
            video: "/assets/videos/services/aesthetic_new_2.mp4"
        },
        {
            icon: "CircleDashed",
            title: "Tratamento de Sensibilidade",
            description: "Tratamentos específicos para eliminar o desconforto e devolver o prazer de comer e beber.",
            tag: "06",
            image: "/assets/images/service-sensitivity.png",
            video: "/assets/videos/services/grok-sensibilidade.mp4"
        },
        {
            icon: "Crown",
            title: "Cirurgias e Extrações",
            description: "Procedimentos cirúrgicos seguros, realizados por especialistas com técnicas minimamente invasivas.",
            tag: "07",
            image: "/assets/images/surgery-room.jpg",
            video: "/assets/videos/services/grok-surgery.mp4"
        },
        {
            icon: "Cpu",
            title: "Radiografia Panorâmica",
            description: "Diagnóstico completo com imagens amplas da arcada dentária para um planejamento preciso.",
            tag: "08",
            image: "/assets/images/3d-ct-scan.jpg",
            video: "/assets/videos/services/panoramic.mp4"
        },
        {
            icon: "Cpu",
            title: "Protocolo Ortodôntico",
            description: "Correção e alinhamento dental com protocolos modernos para um sorriso funcional e estético.",
            tag: "09",
            image: "/assets/images/service-orthodontics.png",
            video: "/assets/videos/services/ortho_protocol.mp4"
        },
        {
            icon: "CircleDashed",
            title: "Radiografia Digital",
            description: "Imagens radiográficas de alta definição com menor exposição à radiação e resultado imediato.",
            tag: "11",
            image: "/assets/images/radiografia-digital-new.jpg",
            video: "/assets/videos/services/grok-radiografia-digital-2.mp4"
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

            // Disabled GSAP parallax to ensure cards are stable and 3D hover works perfectly

            // Cinematic scroll effects for All Devices
            // Section heading scale effect
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

            // Dark overlay fade-in
            if (overlayDarkRef.current) {
                gsap.to(overlayDarkRef.current, {
                    opacity: 0.4,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top center",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }

            // Animate card descriptions and CTAs
            gsap.fromTo(".service-card-description",
                { opacity: 0, y: 15 },
                {
                    scrollTrigger: {
                        trigger: ".service-card-wrapper",
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 1,
                    ease: "power2.out"
                }
            );

            gsap.fromTo(".service-card-cta",
                { opacity: 0, x: -10 },
                {
                    scrollTrigger: {
                        trigger: ".service-card-wrapper",
                        start: "top 75%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 1,
                    x: 0,
                    stagger: 0.1,
                    duration: 1.2,
                    delay: 0.4,
                    ease: "power2.out"
                }
            );

            // Icon rotation on scroll
            gsap.utils.toArray(".service-icon-rotate").forEach((icon: any) => {
                gsap.to(icon, {
                    rotation: 180,
                    scrollTrigger: {
                        trigger: icon.closest(".service-card-wrapper"),
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5
                    }
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted, isMobile]);

    return (
        <section ref={sectionRef} className="py-24 md:py-40 bg-[var(--color-deep-black)] relative overflow-hidden" id="servicos">
            {/* Priority Preload for the first card video */}
            <link rel="preload" href={firstVideo} as="video" type="video/mp4" />

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />

            {/* Dark Overlay (Animated on Scroll) */}
            <div
                ref={overlayDarkRef}
                className="absolute inset-0 z-[1] bg-black/0 pointer-events-none"
                style={{ opacity: 0 }}
            />

            <div className="max-w-4xl mb-16 md:mb-24 px-6 md:px-0">
                <PremiumReveal direction="bottom" delay={0.1}>
                    <span className="text-[var(--color-silver-bh)] font-semibold tracking-[0.4em] uppercase text-[10px] mb-8 block">
                        Tratamentos de Elite
                    </span>
                </PremiumReveal>

                <h2 className="font-display text-[clamp(28px,6vw,56px)] font-medium text-white leading-[1.1] tracking-[-0.01em] uppercase">
                    <PremiumReveal type="mask" direction="bottom" delay={0.2}>
                        <span>Soluções clínicas de</span>
                    </PremiumReveal>
                    <PremiumReveal type="mask" direction="bottom" delay={0.3}>
                        <span className="text-gradient-silver italic font-light block mt-2">extrema precisão.</span>
                    </PremiumReveal>
                </h2>
            </div>

            {/* Services Grid Evolution - Dynamic Asymmetrical Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                {
                    services.map((service, index) => (
                        <div key={index} className="service-card-wrapper h-full">
                            <ServiceCard
                                service={service}
                                index={index}
                                isMobile={isMobile}
                            />
                        </div>
                    ))
                }
            </div>
        </section>
    );
}
