"use client";

import { m } from "framer-motion";

const trustTokens = [
    { name: "USP", detail: "Excelência em Formação" },
    { name: "CRO-SP", detail: "Registro Profissional" },
    { name: "ABO", detail: "Associação Brasileira" },
    { name: "SBOE", detail: "Sociedade de Estética" },
];

export function TrustBar() {
    return (
        <div className="py-12 border-y border-white/5 bg-[var(--color-background)]/50 backdrop-blur-sm overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-wrap justify-between items-center gap-8 md:gap-12 opacity-60 hover:opacity-100 transition-opacity duration-700">
                    <m.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--color-silver-bh)] w-full lg:w-auto text-center lg:text-left mb-4 lg:mb-0"
                    >
                        Padrões Internacionais
                    </m.span>
                    <div className="flex flex-wrap justify-center lg:justify-end items-center gap-x-12 gap-y-8 flex-1">
                        {trustTokens.map((token, index) => (
                            <m.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.8 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center lg:items-start group transition-all"
                            >
                                <span className="font-display text-xl md:text-2xl text-white font-medium tracking-widest group-hover:text-[var(--color-silver-bh)] transition-colors duration-500">
                                    {token.name}
                                </span>
                                <span className="text-[8px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] group-hover:text-white/40 transition-colors">
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
