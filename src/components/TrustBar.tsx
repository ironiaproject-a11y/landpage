"use client";

import { m } from "framer-motion";
import { useEffect, useRef, useState } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const trustTokens = [
    { name: "USP", detail: "Excelência em Formação" },
    { name: "CRO-SP", detail: "Registro Profissional" },
    { name: "ABO", detail: "Associação Brasileira" },
    { name: "SBOE", detail: "Sociedade de Estética" },
];

export function TrustBar() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);

        const ctx = gsap.context(() => {
            // Main bar entrance
            gsap.fromTo(containerRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 95%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            gsap.to(".trust-token", {
                scale: 0.95,
                opacity: 0.4,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }, containerRef);
        return () => {
            window.removeEventListener("resize", checkMobile);
            ctx.revert();
        };
    }, [isMobile]);

    return (
        <div ref={containerRef} className="py-16 border-y border-white/5 bg-gradient-to-b from-black/20 to-transparent backdrop-blur-md overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute inset-0 glow-blob opacity-20 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-24">
                    <m.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="flex flex-col items-center lg:items-start text-center lg:text-left"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gradient-silver mb-2">
                            Qualidade Certificada
                        </span>
                        <h3 className="text-white/40 font-display text-xl md:text-2xl font-light tracking-wide italic">
                            Padrões Internacionais
                        </h3>
                    </m.div>

                    <div className="flex flex-wrap justify-center lg:justify-end items-center gap-x-16 gap-y-10 flex-1">
                        {trustTokens.map((token, index) => (
                            <m.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.3 + (index * 0.1),
                                    duration: 1,
                                    ease: [0.22, 1, 0.36, 1]
                                }}
                                viewport={{ once: true }}
                                className="trust-token flex flex-col items-center lg:items-start group cursor-default"
                            >
                                <span className="font-display text-2xl md:text-3xl text-white/90 font-light tracking-[0.15em] group-hover:text-white group-hover:drop-shadow-glow transition-all duration-700">
                                    {token.name}
                                </span>
                                <div className="h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-[var(--color-silver-bh)] to-transparent transition-all duration-700 mb-2" />
                                <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--color-text-tertiary)] group-hover:text-[var(--color-silver-bh)] transition-colors duration-500">
                                    {token.detail}
                                </span>
                            </m.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
