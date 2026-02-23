"use client";

import { useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const stats = [
    {
        value: 1200,
        prefix: "+",
        suffix: "",
        label: "HISTÓRIAS REAIS",
        sublabel: "Mais de 1.200 sorrisos redesenhados com naturalidade, devolvendo a autoestima e a alegria de viver.",
        delay: 0
    },
    {
        value: 99.8,
        prefix: "",
        suffix: "%",
        label: "PRECISÃO DIGITAL",
        sublabel: "Segurança absoluta no seu resultado final através de um planejamento 3D milimétrico e previsível.",
        delay: 0.1
    },
    {
        value: null,
        label: "OLHAR HUMANO",
        sublabel: "Onde o rigor da tecnologia de elite encontra o acolhimento genuíno de quem realmente cuida da sua história.",
        delay: 0.2
    }
];

export function Stats() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const ctx = gsap.context(() => {
            const counters = containerRef.current?.querySelectorAll(".stat-counter");

            counters?.forEach((counter) => {
                const targetValue = parseFloat(counter.getAttribute("data-target") || "0");
                const isFloat = counter.getAttribute("data-float") === "true";
                const isMobile = window.innerWidth < 768;

                const obj = { value: 0 };
                gsap.to(obj, {
                    value: targetValue,
                    duration: isMobile ? 2.5 : 3,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: counter,
                        start: "top 85%",
                        once: true,
                        markers: false
                    },
                    onUpdate: () => {
                        if (counter) {
                            counter.innerHTML = isFloat
                                ? obj.value.toFixed(1).replace(".", ",")
                                : Math.floor(obj.value).toLocaleString("pt-BR");
                        }
                    },
                    onComplete: () => {
                        // Subtle bounce effect on completion
                        gsap.to(counter, {
                            scale: 1.05,
                            duration: 0.3,
                            yoyo: true,
                            repeat: 1,
                            ease: "power1.inOut"
                        });
                    }
                });
            });

            // Animate dividers
            gsap.fromTo(".stat-divider",
                { scaleY: 0, opacity: 0 },
                {
                    scaleY: 1,
                    opacity: 1,
                    duration: 1.5,
                    delay: 0.5,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                    }
                }
            );

            // Desktop-only cinematic scroll effects
            const isMobile = window.innerWidth < 768;
            if (!isMobile) {
                // Parallax for counters relative to container
                gsap.to(".stat-item-inner", {
                    y: -30,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                });

                // Background glows parallax
                gsap.to(".stats-glow", {
                    y: 100,
                    scale: 1.2,
                    duration: 2,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 2
                    }
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, [mounted]);

    return (
        <section ref={containerRef} className="py-20 md:py-40 bg-[#050505] relative overflow-hidden border-y border-white/5 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center md:items-start relative md:px-12 lg:px-16 first:pl-0 last:pr-0 stat-item-group"
                        >
                            <div className="stat-item-inner w-full flex flex-col items-center md:items-start">
                                {/* Number & Value */}
                                <m.div
                                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={{ duration: 1, delay: stat.delay, ease: [0.22, 1, 0.36, 1] }}
                                    viewport={{ once: true }}
                                    className="flex items-baseline gap-1 mb-6 md:mb-10 group"
                                >
                                    {stat.prefix && (
                                        <span className="text-[var(--color-silver-bh)] font-editorial text-2xl md:text-5xl font-light opacity-40 group-hover:opacity-80 transition-opacity duration-700">
                                            {stat.prefix}
                                        </span>
                                    )}
                                    {stat.value !== null ? (
                                        <span
                                            className="stat-counter font-editorial text-6xl sm:text-8xl md:text-[110px] lg:text-[130px] font-medium text-white tracking-tighter leading-none hover:text-gradient-silver transition-all duration-700"
                                            data-target={stat.value}
                                            data-float={stat.value % 1 !== 0}
                                        >
                                            0
                                        </span>
                                    ) : (
                                        <m.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 1.5, delay: stat.delay + 0.2, ease: "easeOut" }}
                                            className="relative"
                                        >
                                            <span className="text-gradient-silver font-editorial text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight uppercase leading-none drop-shadow-[0_0_30px_rgba(203,213,225,0.2)]">
                                                Essência
                                            </span>
                                            <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                        </m.div>
                                    )}
                                    {stat.suffix && (
                                        <span className="text-[var(--color-silver-bh)] font-editorial text-2xl md:text-5xl font-light opacity-40 group-hover:opacity-80 transition-opacity duration-700">
                                            {stat.suffix}
                                        </span>
                                    )}
                                </m.div>

                                {/* Labels */}
                                <div className="flex flex-col items-center md:items-start text-center md:text-left overflow-hidden">
                                    <m.h4
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 0.8, x: 0 }}
                                        transition={{ duration: 0.8, delay: stat.delay + 0.4 }}
                                        viewport={{ once: true }}
                                        className="text-[var(--color-silver-bh)] font-body text-[11px] md:text-[12px] font-bold uppercase tracking-[0.5em] mb-4"
                                    >
                                        {stat.label}
                                    </m.h4>
                                    <m.p
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 0.7, y: 0 }}
                                        transition={{ duration: 1, delay: stat.delay + 0.6 }}
                                        viewport={{ once: true }}
                                        className="text-[var(--color-text-dim)] font-body text-sm md:text-base font-light leading-relaxed max-w-[300px] hover:opacity-100 transition-opacity duration-500"
                                    >
                                        {stat.sublabel}
                                    </m.p>
                                </div>
                            </div>

                            {/* Vertical Divider for Desktop */}
                            {index !== stats.length - 1 && (
                                <div className="stat-divider hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-48 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent origin-center" />
                            )}

                            {/* Horizontal Divider for Mobile - Refined */}
                            {index !== stats.length - 1 && (
                                <div className="md:hidden w-24 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-silver-bh)]/30 to-transparent my-12 mx-auto" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Cinematic Ambient Glow Evolution */}
            <div className="stats-glow absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-[var(--color-silver-bh)]/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="stats-glow absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-[var(--color-silver-bh)]/5 blur-[150px] rounded-full pointer-events-none" />

            {/* Top Shine */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </section>

    );
}

export default Stats;
