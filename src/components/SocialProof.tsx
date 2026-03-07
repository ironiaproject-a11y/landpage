"use client";

import { m } from "framer-motion";
import { PremiumReveal } from "./PremiumReveal";
import { useEffect, useState } from "react";
import gsap from "gsap";

const stats = [
    { value: 12, suffix: "+", label: "Anos de experiência" },
    { value: 35, suffix: "+", label: "Especialistas" },
    { value: 785, suffix: "+", label: "Sorrisos transformados" }
];

export function SocialProof() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const ctx = gsap.context(() => {
            const counters = document.querySelectorAll(".social-counter");
            counters.forEach((counter) => {
                const target = parseInt(counter.getAttribute("data-target") || "0");
                const obj = { value: 0 };
                gsap.to(obj, {
                    value: target,
                    duration: 2.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: counter,
                        start: "top 85%",
                        once: true
                    },
                    onUpdate: () => {
                        counter.innerHTML = Math.floor(obj.value).toString();
                    }
                });
            });
        });
        return () => ctx.revert();
    }, [mounted]);

    return (
        <section className="py-12 md:py-24 bg-[#050505] relative z-20 border-b border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                            <PremiumReveal direction="bottom" delay={0.1 * i}>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span
                                        className="social-counter font-editorial text-5xl md:text-7xl font-medium text-[var(--color-creme)]"
                                        data-target={stat.value}
                                    >
                                        0
                                    </span>
                                    <span className="font-editorial text-3xl md:text-4xl font-light text-[var(--color-silver-bh)] opacity-60">
                                        {stat.suffix}
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-[0.3em]">
                                    {stat.label}
                                </p>
                            </PremiumReveal>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subtle glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </section>
    );
}
