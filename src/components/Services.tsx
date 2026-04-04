"use client";

import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import VisualContainer from "./VisualContainer";
import Image from "next/image";
import { useRef, useEffect, useState, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { LuxuryCard } from "./LuxuryCard";
import { PremiumReveal } from "./PremiumReveal";
import { Magnetic } from "./Magnetic";
import { MediaCard } from "./MediaCard";

interface Service {
    icon: string;
    title: string;
    description: string;
    tag: string;
    image: string;
    video: string;
    useVideoAsPoster?: boolean;
}


function ServiceCard({ service, index, isMobile }: { service: Service; index: number; isMobile: boolean }) {
    const [isVideoActive, setIsVideoActive] = useState(false);

    const handlePlayInternal = useCallback(() => setIsVideoActive(true), []);
    const handlePauseInternal = useCallback(() => setIsVideoActive(false), []);

    return (
        <LuxuryCard
            delay={index * 0.1}
            className="h-auto md:h-full"
            innerClassName="p-0" // We'll handle padding internally for media alignment
        >
            <div
                className="flex flex-col h-auto md:h-full cursor-pointer"
                onMouseEnter={() => setIsVideoActive(true)}
                onMouseLeave={() => setIsVideoActive(false)}
                onTouchStart={() => setIsVideoActive(true)}
                onTouchEnd={() => setIsVideoActive(false)}
            >
                {/* Media Section */}
                <div className="relative overflow-hidden rounded-t-[2rem] p-6 pb-0 md:p-10 md:pb-0 z-10">
                    <m.div 
                        whileTap={{ scale: 1.05, y: -12, filter: "drop-shadow(0 20px 30px rgba(212, 175, 55, 0.3))" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="transform transition-transform duration-1000 ease-[0.22,1,0.36,1] group-hover:scale-[1.03]"
                    >
                        <MediaCard
                            mp4Src={service.video}
                            webmSrc={service.video.replace('.mp4', '.webm')}
                            posterSrc={service.image}
                            alt={service.title}
                            ariaLabel={service.title}
                            className="shadow-2xl rounded-xl overflow-hidden"
                            playing={isVideoActive}
                            useVideoAsPoster={service.useVideoAsPoster}
                        />
                    </m.div>
                </div>

                {/* Content Section */}
                <div className="px-6 pb-6 pt-4 md:px-10 md:pb-10 md:pt-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-level-4 text-white/40 uppercase">Protocolo {service.tag}</span>
                        <div className="h-px bg-white/10 flex-grow" />
                    </div>

                    <h3 className="text-[clamp(20px,2.5vw,28px)] font-[300] text-white transition-colors duration-700 mb-4 leading-tight tracking-tight">
                        {service.title}
                    </h3>

                    <p className="text-level-3 mb-8 md:mb-12">
                        {service.description}
                    </p>

                    <div className="mt-auto">
                        <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full border border-white/10 bg-white/5 text-[var(--color-text-primary)] text-level-4 uppercase transition-all duration-700 group-hover:bg-white group-hover:text-black group-hover:border-white group-hover:shadow-[0_12px_40px_rgba(255,255,255,0.12)]">
                            <span>Conhecer Protocolo</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
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
    const [mounted, setMounted] = useState(false);

    // Agent: Prioritize the first video to avoid black frames on entry
    // We hoist this link via Next.js
    const firstVideo = "/assets/videos/services/implant_new.mp4";

    const services: Service[] = [
        {
            icon: "Shield",
            title: "Implantes Dentários",
            description: "Recupere a função e a estética do seu sorriso com implantes de alta durabilidade e precisão.",
            tag: "01",
            image: "/assets/images/service-implant.png",
            video: "/assets/videos/services/implant_new.mp4",
            useVideoAsPoster: true
        },
        {
            icon: "Activity",
            title: "Disfunção e Dores Orofaciais",
            description: "Alívio eficaz para dores orofaciais e proteção dos dentes contra o desgaste excessivo.",
            tag: "02",
            image: "/assets/images/dental-exam.jpg",
            video: "/assets/videos/services/bruxismo.mp4"
        },
        {
            icon: "Microscope",
            title: "Endodontia Avançada",
            description: "Procedimentos endodônticos avançados para salvar seus dentes com máximo conforto e segurança.",
            tag: "03",
            image: "/assets/images/root-canal-treatment.png",
            video: "/assets/videos/services/canal.mp4"
        },
        {
            icon: "Stethoscope",
            title: "Odontopediatria",
            description: "Cuidado especializado e acolhedor para a saúde bucal dos pequenos desde os primeiros anos.",
            tag: "04",
            image: "/assets/images/pediatric-dentistry.png",
            video: "/assets/videos/services/pediatrics.mp4"
        },
        {
            icon: "Sparkles",
            title: "Facetas e Lentes de Contato",
            description: "Transforme seu sorriso com facetas, clareamento e procedimentos que harmonizam sua face.",
            tag: "05",
            image: "/assets/images/service-aesthetic.png",
            video: "/assets/videos/services/aesthetic_new_2.mp4"
        },
        {
            icon: "Diamond",
            title: "Tratamento de Sensibilidade",
            description: "Tratamentos específicos para eliminar o desconforto e devolver o prazer de comer e beber.",
            tag: "06",
            image: "/assets/images/service-sensitivity.png",
            video: "/assets/videos/services/grok-sensibilidade.mp4"
        },
        {
            icon: "Activity",
            title: "Cirurgias Orais Complexas",
            description: "Procedimentos cirúrgicos seguros, realizados por especialistas com técnicas minimamente invasivas.",
            tag: "07",
            image: "/assets/images/surgery-room.jpg",
            video: "/assets/videos/services/grok-surgery.mp4"
        },
        {
            icon: "ScanLine",
            title: "Diagnóstico por Imagem",
            description: "Diagnóstico completo com imagens amplas da arcada dentária para um planejamento preciso.",
            tag: "08",
            image: "/assets/images/3d-ct-scan.jpg",
            video: "/assets/videos/services/panoramic.mp4"
        },
        {
            icon: "Diamond",
            title: "Protocolo Ortodôntico",
            description: "Correção e alinhamento dental com protocolos modernos para um sorriso funcional e estético.",
            tag: "09",
            image: "/assets/images/service-orthodontics.png",
            video: "/assets/videos/services/ortho_protocol.mp4",
            useVideoAsPoster: true
        },
        {
            icon: "ScanLine",
            title: "Fluxo Digital 3D",
            description: "Imagens radiográficas de alta definição com menor exposição à radiação e resultado imediato.",
            tag: "11",
            image: "/assets/images/radiografia-digital-new.jpg",
            video: "/assets/videos/services/grok-radiografia-digital-2.mp4"
        }


    ];

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        // Pre-decode priority service images
        const imagesToDecode = [
            "/assets/images/service-implant.png",
            "/assets/images/dental-exam.jpg",
            "/assets/images/root-canal-treatment.png"
        ];

        imagesToDecode.forEach(src => {
            const img = new (window as any).Image();
            img.src = src;
            img.decode?.().catch(() => {});
        });
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

        }, sectionRef);

        return () => ctx.revert();
    }, [mounted, isMobile]);

    return (
        <section ref={sectionRef} className="py-16 md:py-24 bg-transparent relative overflow-hidden" id="servicos">
            {/* Priority Preload for the first card video */}
            <link rel="preload" href={firstVideo} as="video" type="video/mp4" />

            {/* Background Texture (Reduced opacity to prevent gray effect) */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20 md:mb-32">
                <div className="max-w-3xl">
                    <PremiumReveal direction="bottom" delay={0.1}>
                        <span className="text-level-4 uppercase mb-6 block text-[var(--color-accent-gold)] tracking-[0.3em]">
                            O QUE FAZEMOS
                        </span>
                    </PremiumReveal>
                    <h2 className="text-level-2 mb-8">
                        <PremiumReveal type="mask" direction="bottom" delay={0.2}>
                            <span>Tratamentos</span>
                        </PremiumReveal>
                        <PremiumReveal type="mask" direction="bottom" delay={0.3}>
                            <span className="text-headline-sub block mt-2">Especializados.</span>
                        </PremiumReveal>
                    </h2>
                    <PremiumReveal direction="bottom" delay={0.4}>
                        <p className="text-level-3 max-w-xl">
                            Odontologia de alta performance para transformar seu sorriso com tecnologia de ponta e cuidado humano.
                        </p>
                    </PremiumReveal>
                </div>
            </div>

            {/* Services Grid Evolution - Dynamic Asymmetrical Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[80px] md:gap-32">
                {
                    services.map((service, index) => (
                        <div key={index} className="service-card-wrapper h-auto md:h-full">
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
