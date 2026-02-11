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

                const obj = { value: 0 };
                gsap.to(obj, {
                    value: targetValue,
                    duration: 3.5,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: counter,
                        start: "top 95%",
                        once: true
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
        }, containerRef);

        return () => ctx.revert();
    }, [mounted]);

    return (
        <section ref={containerRef} className="py-32 bg-[#050505] relative overflow-hidden border-y border-white/5">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-16 md:gap-0">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex-1 w-full flex flex-col items-center md:items-start relative group md:px-16 first:pl-0 last:pr-0">
                            {/* Number & Value */}
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2, delay: stat.delay, ease: [0.22, 1, 0.36, 1] }}
                                viewport={{ once: true }}
                                className="flex items-baseline gap-1 mb-6"
                            >
                                {stat.prefix && (
                                    <span className="text-[var(--color-silver-bh)] font-display text-4xl md:text-5xl font-light opacity-60">
                                        {stat.prefix}
                                    </span>
                                )}
                                {stat.value !== null ? (
                                    <span
                                        className="stat-counter font-display text-6xl sm:text-7xl md:text-8xl lg:text-[110px] font-medium text-white tracking-tighter leading-none"
                                        data-target={stat.value}
                                        data-float={stat.value % 1 !== 0}
                                    >
                                        0
                                    </span>
                                ) : (
                                    <span className="text-gradient-silver font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase leading-none drop-shadow-glow">
                                        Essência
                                    </span>
                                )}
                                {stat.suffix && (
                                    <span className="text-[var(--color-silver-bh)] font-display text-4xl md:text-5xl font-light opacity-60">
                                        {stat.suffix}
                                    </span>
                                )}
                            </m.div>

                            {/* Labels */}
                            <m.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 1, delay: stat.delay + 0.4 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center md:items-start text-center md:text-left"
                            >
                                <h4 className="text-[var(--color-silver-bh)] font-body text-[9px] md:text-[10px] font-bold uppercase tracking-[0.5em] mb-4">
                                    {stat.label}
                                </h4>
                                <p className="text-[var(--color-text-dim)] font-body text-[14px] font-light leading-relaxed max-w-[260px]">
                                    {stat.sublabel}
                                </p>
                            </m.div>

                            {/* Vertical Divider for Desktop */}
                            {index !== stats.length - 1 && (
                                <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
                            )}

                            {/* Horizontal Divider for Mobile */}
                            {index !== stats.length - 1 && (
                                <div className="md:hidden w-12 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-silver-bh)]/20 to-transparent mt-12" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Subtle Ambient Glow Evolution */}
            <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-[var(--color-silver-bh)]/5 blur-[100px] rounded-full -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-[var(--color-silver-bh)]/5 blur-[100px] rounded-full -translate-y-1/2 pointer-events-none" />
        </section>
    );
}

export default Stats;
