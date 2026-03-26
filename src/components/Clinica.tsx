"use client";

import { m } from "framer-motion";
import { PremiumReveal } from "./PremiumReveal";

export function Clinica() {
    return (
        <section
            style={{
                padding: '64px 24px',
                background: '#0B0B0B',
                color: '#fff',
            }}
            id="clinica"
        >
            <div className="container mx-auto max-w-5xl">
                <div className="flex flex-col mb-8">
                    <PremiumReveal direction="bottom" delay={0.1}>
                        <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-4">
                            Clínica.
                        </h2>
                    </PremiumReveal>
                    <PremiumReveal direction="bottom" delay={0.2}>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl font-sans font-light">
                            Precisão clínica guiada por tecnologia e estética.
                        </p>
                    </PremiumReveal>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8 mb-12">
                    <PremiumReveal direction="bottom" delay={0.3}>
                        <div className="flex flex-col border-t border-white/10 pt-4">
                            <span className="text-sm text-white/60 uppercase tracking-widest">+12 anos</span>
                            <span className="text-base text-white mt-2">de experiência</span>
                        </div>
                    </PremiumReveal>
                    <PremiumReveal direction="bottom" delay={0.4}>
                        <div className="flex flex-col border-t border-white/10 pt-4">
                            <span className="text-sm text-white/60 uppercase tracking-widest">+700</span>
                            <span className="text-base text-white mt-2">sorrisos transformados</span>
                        </div>
                    </PremiumReveal>
                    <PremiumReveal direction="bottom" delay={0.5}>
                        <div className="flex flex-col border-t border-white/10 pt-4">
                            <span className="text-sm text-white/60 uppercase tracking-widest">Tecnologia</span>
                            <span className="text-base text-white mt-2">digital 3D</span>
                        </div>
                    </PremiumReveal>
                    <PremiumReveal direction="bottom" delay={0.6}>
                        <div className="flex flex-col border-t border-white/10 pt-4">
                            <span className="text-sm text-white/60 uppercase tracking-widest">Especialistas</span>
                            <span className="text-base text-white mt-2">em estética e implantes</span>
                        </div>
                    </PremiumReveal>
                </div>

                <div className="flex flex-col md:flex-row gap-8 md:gap-24 items-start">
                    <PremiumReveal direction="bottom" delay={0.7} className="md:w-1/2">
                        <p className="text-base md:text-lg text-white/70 font-sans font-light leading-relaxed">
                            Unimos ciência, tecnologia e sensibilidade estética para entregar resultados naturais, duradouros e personalizados para cada paciente.
                        </p>
                    </PremiumReveal>
                    
                    <div className="flex flex-wrap gap-3 md:w-1/2">
                        <PremiumReveal direction="bottom" delay={0.8}>
                            <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[11px] md:text-xs text-white/80 uppercase tracking-widest">
                                Atendimento humanizado
                            </div>
                        </PremiumReveal>
                        <PremiumReveal direction="bottom" delay={0.9}>
                            <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[11px] md:text-xs text-white/80 uppercase tracking-widest">
                                Planejamento digital
                            </div>
                        </PremiumReveal>
                        <PremiumReveal direction="bottom" delay={1.0}>
                            <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[11px] md:text-xs text-white/80 uppercase tracking-widest">
                                Resultados previsíveis
                            </div>
                        </PremiumReveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
