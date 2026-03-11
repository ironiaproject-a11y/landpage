"use client";

import { useEffect, useRef, useState } from "react";
import { PremiumReveal } from "./PremiumReveal";
import { m } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const trustLogos = [
    { name: "USP", detail: "Excelência Acadêmica" },
    { name: "SBOE", detail: "Estética Orofacial" },
    { name: "CRO-SP", detail: "Conselho Regional" },
    { name: "ABO", detail: "Associação Brasileira" },
];

const stats = [
    {
        id: "historias",
        value: 1200,
        prefix: "",
        suffix: "+",
        label: "HISTÓRIAS REAIS",
        description: "Mais do que pacientes, são vidas transformadas através de sorrisos que recuperam a essência e a autoconfiança.",
    },
    {
        id: "precisao",
        value: 99.1,
        prefix: "",
        suffix: "%",
        label: "PRECISÃO DIGITAL",
        description: "O rigor da tecnologia alemã aplicado em diagnósticos 3D milimétricos, garantindo previsibilidade absoluta.",
    }
];

export function Stats() {
    const sectionRef = useRef<HTMLElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const ctx = gsap.context(() => {
            // 1. Trust Bar Entrance
            gsap.fromTo(".trust-logo-item", 
                { opacity: 0, y: 10 },
                { 
                    opacity: 0.3, 
                    y: 0, 
                    stagger: 0.1, 
                    duration: 1.2, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".trust-bar-container",
                        start: "top 90%",
                    }
                }
            );

            // 2. Main Narrative Reveal
            gsap.fromTo(".narrative-line", 
                { scaleX: 0 },
                { 
                    scaleX: 1, 
                    duration: 2, 
                    ease: "expo.inOut",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                    }
                }
            );

            // 3. Counter Animations
            const counters = sectionRef.current?.querySelectorAll(".counter-value");
            counters?.forEach((counter) => {
                const targetValue = parseFloat(counter.getAttribute("data-target") || "0");
                const isFloat = counter.getAttribute("data-float") === "true";
                
                const obj = { value: 0 };
                gsap.to(obj, {
                    value: targetValue,
                    duration: 3,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: counter,
                        start: "top 85%",
                    },
                    onUpdate: () => {
                        if (counter) {
                            counter.innerHTML = isFloat 
                                ? obj.value.toFixed(1).replace(".", ",") 
                                : Math.floor(obj.value).toLocaleString("pt-BR");
                        }
                    }
                });
            });

            // 4. Parallax Background
            gsap.to(".stats-bg-accent", {
                y: -100,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, [mounted]);

    return (
        <section ref={sectionRef} className="pt-16 pb-32 md:pb-48 bg-[#050505] relative overflow-hidden" id="stats">
            {/* Ambient Background */}
            <div className="stats-bg-accent absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#E6D3A3_0%,transparent_70%)]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                
                {/* Authority Bar (Trust Bar Integrated) */}
                <div className="trust-bar-container flex flex-wrap justify-center md:justify-between items-center gap-8 mb-24 pb-12 border-b border-white/5">
                    {trustLogos.map((logo, i) => (
                        <div key={i} className="trust-logo-item flex flex-col items-center md:items-start group transition-all duration-700">
                            <span className="font-display text-xl md:text-2xl text-white font-light tracking-[0.2em] group-hover:opacity-100 transition-opacity">
                                {logo.name}
                            </span>
                            <span className="text-[8px] uppercase tracking-[0.3em] text-[#E6D3A3] mt-1 opacity-60">
                                {logo.detail}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Main Asymmetrical Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                    
                    {/* Left: Histórias Reais (The Anchor) */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="relative inline-block">
                             <PremiumReveal direction="bottom">
                                <span className="text-[#E6D3A3] font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">
                                    01. {stats[0].label}
                                </span>
                            </PremiumReveal>
                            <div className="flex items-baseline gap-2">
                                <span 
                                    className="counter-value font-editorial text-7xl md:text-[140px] font-medium text-[#F8F8F6] tracking-[-0.05em] leading-none"
                                    data-target={stats[0].value}
                                    data-float="false"
                                >
                                    0
                                </span>
                                <span className="font-editorial text-4xl md:text-7xl text-[#E6D3A3] opacity-40">{stats[0].suffix}</span>
                            </div>
                        </div>
                        <PremiumReveal direction="bottom" delay={0.4}>
                            <p className="text-[#8E9196] font-body text-base md:text-lg leading-relaxed max-w-sm">
                                {stats[0].description}
                            </p>
                        </PremiumReveal>
                    </div>

                    {/* Middle: Divider Line (Animated) */}
                    <div className="hidden lg:flex lg:col-span-1 justify-center h-full min-h-[300px]">
                        <div className="narrative-line w-[1px] h-full bg-gradient-to-b from-[#E6D3A3]/40 via-[#E6D3A3]/10 to-transparent origin-top" />
                    </div>

                    {/* Right: Precisão & Olhar (The Detail) */}
                    <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-16">
                        
                        {/* Precisão Digital */}
                        <div className="space-y-6">
                            <PremiumReveal direction="bottom">
                                <span className="text-[#E6D3A3] font-bold tracking-[0.3em] text-[10px] uppercase block">
                                    02. {stats[1].label}
                                </span>
                            </PremiumReveal>
                            <div className="flex items-baseline gap-1">
                                <span 
                                    className="counter-value font-editorial text-5xl md:text-8xl font-medium text-[#F8F8F6] tracking-[-0.05em] leading-none"
                                    data-target={stats[1].value}
                                    data-float="true"
                                >
                                    0
                                </span>
                                <span className="font-editorial text-2xl md:text-4xl text-[#E6D3A3] opacity-40">{stats[1].suffix}</span>
                            </div>
                            <PremiumReveal direction="bottom" delay={0.3}>
                                <p className="text-[#8E9196] font-body text-sm leading-relaxed">
                                    {stats[1].description}
                                </p>
                            </PremiumReveal>
                        </div>

                        {/* Olhar Humano */}
                        <div className="space-y-6 relative">
                            <PremiumReveal direction="bottom">
                                <span className="text-[#E6D3A3] font-bold tracking-[0.3em] text-[10px] uppercase block">
                                    03. OLHAR HUMANO
                                </span>
                            </PremiumReveal>
                            <div className="pt-2">
                                <h3 className="font-display text-4xl md:text-5xl text-[#F8F8F6] font-medium leading-[1.2] italic">
                                    Acolhimento <span className="text-[#E6D3A3]">Genuíno</span>
                                </h3>
                            </div>
                            <PremiumReveal direction="bottom" delay={0.4}>
                                <p className="text-[#8E9196] font-body text-sm leading-relaxed">
                                    Onde o rigor da tecnologia de elite encontra o cuidado individualizado que honra cada trajetória.
                                </p>
                            </PremiumReveal>

                            {/* Floating Accent for Luxury Feel */}
                            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#E6D3A3]/5 blur-3xl rounded-full" />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default Stats;
