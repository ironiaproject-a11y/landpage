"use client";

import { m } from "framer-motion";
import { useEffect, useState } from "react";

const metrics = [
    {
        value: "785+",
        label: "Sorrisos transformados",
        emphasis: true
    },
    {
        value: "12+",
        label: "Anos de experiência",
        emphasis: false
    },
    {
        value: "4.9★",
        label: "Avaliação média no Google",
        emphasis: false
    }
];

export function Stats() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <section className="social-proof bg-[#FBFBF9] py-16 md:py-20 lg:py-24 overflow-hidden">
            <style>{`
                .social-proof {
                    /* Ensuring specified colors - Opção A: Subordinated Elegance */
                    --sp-bg: #FBFBF9;
                    --sp-text: #1A1A1A; /* Softened from #0B0B0B */
                    --sp-secondary: #8E9196; /* Muted grey */
                    --sp-accent: #C7A86B;
                }
                
                .metric-number {
                    font-size: clamp(32px, 4vw, 42px); /* Reduced from 56px */
                    color: var(--sp-text);
                    font-weight: 500; /* Medium instead of Bold */
                }
                
                .metric-label {
                    font-size: 11px; /* Slightly smaller for precision */
                    color: var(--sp-secondary);
                    font-weight: 400;
                    letter-spacing: 0.25em; /* Increased tracking (editorial style) */
                }

                .metric-emphasis {
                    color: var(--sp-text) !important;
                    position: relative;
                }

                .metric-emphasis::after {
                    content: '';
                    position: absolute;
                    bottom: -6px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 24px; /* Narrower, more precise */
                    height: 1.5px;
                    background: var(--sp-accent);
                    opacity: 0.4;
                }
            `}</style>
            
            <div className="container mx-auto px-6">
                <div className="flex justify-center mb-12 md:mb-16">
                    <span className="text-[10px] font-bold text-[#8E9196] uppercase tracking-[0.4em] border-b border-[#C7A86B]/30 pb-2">
                        Excelência em Números
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 text-center items-center">
                    {metrics.map((metric, idx) => (
                        <m.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.2 }}
                            className="flex flex-col items-center"
                        >
                            <span className={`metric-number font-bold mb-2 ${metric.emphasis ? 'metric-emphasis' : ''}`}>
                                {metric.value}
                            </span>
                            <span className="metric-label tracking-wide uppercase text-xs sm:text-sm">
                                {metric.label}
                            </span>
                        </m.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Stats;
