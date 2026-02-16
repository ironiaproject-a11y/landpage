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
                    duration: isMobile ? 2.5 : 3.5,
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
                    }
                });
            });

            // Desktop-only cinematic scroll effects
            const isMobile = window.innerWidth < 768;
            if (!isMobile) {
                // Background glows parallax
                gsap.to(".stats-glow", {
                    y: 50,
                    scale: 1.1,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5
                    }
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, [mounted]);

    return (
        <section ref={containerRef} className="py-24 md:py-32 bg-[#050505] relative overflow-hidden border-y border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
                    {stats.map((stat, index) => (
                        <m.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: stat.delay, ease: [0.22, 1, 0.36, 1] }}
                            viewport={{
                                once: true,
                                margin: "0px 0px -100px 0px",
                                amount: 0.3
                            }}
                            className="flex flex-col items-center md:items-start relative md:px-12 lg:px-16 first:pl-0 last:pr-0"
                        >
                            {/* Number & Value */}
                            <div className="flex items-baseline gap-1 mb-8">
                                {stat.prefix && (
                                    <span className="text-[var(--color-silver-bh)] font-editorial text-3xl md:text-4xl font-light opacity-60">
                                        {stat.prefix}
                                    </span>
                                )}
                                {stat.value !== null ? (
                                    <span
                                        className="stat-counter font-editorial text-6xl sm:text-7xl md:text-8xl lg:text-[100px] font-medium text-white tracking-tighter leading-none"
                                        data-target={stat.value}
                                        data-float={stat.value % 1 !== 0}
                                    >
                                        0
                                    </span>
                                ) : (
                                    <span className="text-gradient-silver font-editorial text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase leading-none drop-shadow-glow">
                                        Essência
                                    </span>
                                )}
                                {stat.suffix && (
                                    <span className="text-[var(--color-silver-bh)] font-editorial text-3xl md:text-4xl font-light opacity-60">
                                        {stat.suffix}
                                    </span>
                                )}
                            </div>

                            {/* Labels */}
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                <h4 className="text-[var(--color-silver-bh)] font-body text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] mb-4 opacity-80">
                                    {stat.label}
                                </h4>
                                <p className="text-[var(--color-text-dim)] font-body text-sm md:text-base font-light leading-relaxed max-w-[280px] opacity-70">
                                    {stat.sublabel}
                                </p>
                            </div>

                            {/* Vertical Divider for Desktop */}
                            {index !== stats.length - 1 && (
                                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-32 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                            )}

                            {/* Horizontal Divider for Mobile */}
                            {index !== stats.length - 1 && (
                                <div className="md:hidden w-12 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-silver-bh)]/20 to-transparent mt-12 mx-auto" />
                            )}
                        </m.div>
                    ))}
                </div>
            </div>

            {/* Subtle Ambient Glow Evolution */}
            <div className="stats-glow absolute top-1/2 left-0 w-[400px] h-[400px] bg-[var(--color-silver-bh)]/3 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />
            <div className="stats-glow absolute top-1/2 right-0 w-[400px] h-[400px] bg-[var(--color-silver-bh)]/3 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />
        </section>
    );
}

export default Stats;
