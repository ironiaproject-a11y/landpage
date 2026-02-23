"use client";

import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

interface Service {
    icon: string;
    title: string;
    description: string;
    tag: string;
    image: string;
    video: string;
}

function ServiceCard({ service, index, isMobile }: { service: Service; index: number; isMobile: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoActive, setIsVideoActive] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleInteractionStart = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => { });
            setIsVideoActive(true);
        }
    };

    const handleInteractionEnd = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsVideoActive(false);
        }
    };

    return (
        <m.div
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{
                once: true,
                margin: "0px 0px -100px 0px",
                amount: isMobile ? 0.01 : 0.3
            }}
            onMouseEnter={handleInteractionStart}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            className={clsx(
                "group relative spotlight-card transition-all duration-700 ease-[0.22,1,0.36,1] hover:-translate-y-4",
                index % 2 === 0 ? "md:translate-y-0" : "md:translate-y-24"
            )}
        >
            <m.div
                className="service-card-wrapper will-change-transform"
                whileTap={isMobile ? { scale: 1.05, z: 50, transition: { duration: 0.4 } } : {}}
            >
                <VisualContainer
                    width="100%"
                    height="auto"
                    hoverColor="rgba(203, 213, 225, 0.1)"
                    sideHeight="12px"
                    className={clsx(isMobile && isVideoActive && "border-[var(--color-silver-bh)]/30 shadow-[0_0_40px_rgba(203,213,225,0.15)]")}
                >
                    <div className="p-8 md:p-12 flex flex-col h-full">
                        {/* Image Frame - luxury first-frame video approach */}
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] mb-12 bg-[#0A0A0A] border border-white/5 shadow-inner">
                            {/* Video Layer - Acts as its own poster */}
                            <video
                                ref={videoRef}
                                src={service.video}
                                poster={service.image}
                                muted
                                loop
                                playsInline
                                preload="auto"
                                onLoadedData={() => setIsLoaded(true)}
                                onPlaying={() => setIsVideoActive(true)}
                                className={clsx(
                                    "absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out",
                                    isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110",
                                    isVideoActive ? "brightness-100" : "brightness-[0.7] grayscale-[30%] group-hover:grayscale-0 group-hover:brightness-100"
                                )}
                            />

                            {/* Loading State Skeleton */}
                            {!isLoaded && (
                                <div className="absolute inset-0 skeleton-shimmer bg-white/5" />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                            {/* Floating Tag */}
                            <div className="absolute top-6 right-6 w-12 h-12 rounded-full glass-panel flex items-center justify-center border-white/10 backdrop-blur-2xl service-tag-parallax service-icon-rotate">
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

                            <p className="text-[var(--color-text-secondary)] leading-relaxed text-base mb-10 font-light group-hover:text-white/90 transition-colors duration-700 service-card-description">
                                {service.description}
                            </p>

                            <Magnetic strength={0.2} range={60}>
                                <m.div
                                    whileHover={{ x: 5 }}
                                    onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="inline-flex items-center gap-4 text-[var(--color-silver-bh)] text-[10px] font-bold uppercase tracking-extra-wide cursor-pointer transition-all duration-700 service-card-cta"
                                >
                                    <span className="font-body">Ver Protocolo</span>
                                    <ArrowRight strokeWidth={1.2} className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-700" />
                                </m.div>
                            </Magnetic>
                        </div>
                    </div>
                </VisualContainer>

                {/* Hover Shadow Glow - Silver Clinical Enhanced for Relief */}
                <div className="absolute -inset-10 bg-[var(--color-silver-bh)]/10 blur-[130px] rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
            </m.div>
        </m.div>
    );
}

export function Services() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const overlayDarkRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

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
            image: "/assets/images/root-canal-treatment.png",
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
            video: "/assets/videos/services/canal.mp4"
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
            icon: "Diamond",
            title: "Protocolo Ortodôntico",
            description: "Correção e alinhamento dental com protocolos modernos para um sorriso funcional e estético.",
            tag: "09",
            image: "/assets/images/service-orthodontics.png",
            video: "/assets/videos/services/ortho_protocol.mp4"
        },
        {
            icon: "Cpu",
            title: "Escaneamento Digital",
            description: "Moldagem digital de alta precisão, eliminando massas e garantindo agilidade no tratamento.",
            tag: "10",
            image: "/assets/images/digital-scanning-process.jpg",
            video: "/assets/videos/services/scanning.mp4"
        },
        {
            icon: "CircleDashed",
            title: "Radiografia Digital",
            description: "Imagens radiográficas de alta definição com menor exposição à radiação e resultado imediato.",
            tag: "11",
            image: "/assets/images/digital-xray-tablet.jpg",
            video: "/assets/videos/services/panoramic.mp4"
        },
        {
            icon: "Crown",
            title: "Skycam",
            description: "Tecnologia avançada para diagnósticos e acompanhamentos detalhados.",
            tag: "12",
            image: "/assets/images/skycam-device.jpg",
            video: "/assets/videos/services/skycam.mp4"
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

            // Harmonized Card Parallax - Unified values for organic organization
            const cards = gsap.utils.toArray(".service-card-wrapper");
            cards.forEach((card: any, i) => {
                const ySpeed = 80; // Consistent vertical speed
                const xDrift = (i % 2 === 0 ? 15 : -15); // Subtle horizontal drift

                gsap.fromTo(card,
                    { y: ySpeed / 2, x: xDrift * 0.5 },
                    {
                        scrollTrigger: {
                            trigger: card,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1.2
                        },
                        y: -ySpeed / 2,
                        x: -xDrift,
                        ease: "power1.inOut"
                    }
                );

                // Float the individual tag within the card - unified speed
                const tag = card.querySelector(".service-tag-parallax");
                if (tag) {
                    gsap.fromTo(tag,
                        { y: 15 },
                        {
                            scrollTrigger: {
                                trigger: card,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 1
                            },
                            y: -30,
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
        <section ref={sectionRef} className="py-24 md:py-32 bg-[var(--color-deep-black)] relative overflow-hidden" id="servicos">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />

            {/* Dark Overlay (Animated on Scroll) */}
            <div
                ref={overlayDarkRef}
                className="absolute inset-0 z-[1] bg-black/0 pointer-events-none"
                style={{ opacity: 0 }}
            />

            <div className="max-w-4xl mb-16 md:mb-24">
                <m.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[var(--color-silver-bh)] font-semibold tracking-extra-wide uppercase text-[10px] mb-8 block font-body"
                >
                    Tratamentos de Elite
                </m.span>
                <h2 ref={titleRef} className="font-display text-[clamp(42px,7vw,85px)] font-medium text-white leading-[1.05] tracking-tight">
                    <div className="block overflow-hidden pb-1">
                        <span className="title-line-inner inline-block">Soluções clínicas de</span>
                    </div>
                    <div className="block overflow-hidden pb-1">
                        <span className="title-line-inner inline-block text-gradient-silver italic font-light">extrema precisão</span>.
                    </div>
                </h2>
            </div>

            {/* Services Grid Evolution - Dynamic Asymmetrical Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16 md:gap-y-32">
                {
                    services.map((service, index) => (
                        <ServiceCard
                            key={index}
                            service={service}
                            index={index}
                            isMobile={isMobile}
                        />
                    ))
                }
            </div>
        </section>
    );
}
