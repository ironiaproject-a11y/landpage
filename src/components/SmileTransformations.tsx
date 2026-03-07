"use client";

import { PremiumReveal } from "./PremiumReveal";
import Image from "next/image";

export function SmileTransformations() {
    return (
        <section className="py-24 md:py-40 bg-[#050505] relative overflow-hidden" id="transformacoes">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16 md:mb-24">
                    <PremiumReveal direction="bottom">
                        <span className="text-[var(--color-silver-bh)] font-semibold tracking-[0.4em] uppercase text-[10px] mb-6 block">
                            Casos Reais
                        </span>
                    </PremiumReveal>
                    <h2 className="font-display text-[clamp(32px,4vw,56px)] font-medium text-white uppercase tracking-hero">
                        <PremiumReveal type="mask" direction="bottom" delay={0.2}>
                            <span>Transformações de</span>
                        </PremiumReveal>
                        <PremiumReveal type="mask" direction="bottom" delay={0.3}>
                            <span className="text-gradient-silver italic font-light block mt-2">Sorriso</span>
                        </PremiumReveal>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {[1, 2].map((item) => (
                        <div key={item} className="group relative">
                            <PremiumReveal direction="bottom" delay={0.1 * item}>
                                <div className="relative aspect-[16/10] overflow-hidden rounded- organic-md border border-white/10 bg-white/5 shadow-2xl">
                                    {/* Using the generated image for demonstration */}
                                    <Image
                                        src="/assets/smile-transformation-demo.png"
                                        alt="Transformação de Sorriso"
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />

                                    {/* Glass Overlays for Antes/Depois labels if not using a slider */}
                                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-20">
                                        <div className="px-4 py-2 rounded-full glass-panel border-white/10 backdrop-blur-md">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Antes</span>
                                        </div>
                                        <div className="px-4 py-2 rounded-full glass-panel border-white/10 backdrop-blur-md">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-silver-bh)]">Depois</span>
                                        </div>
                                    </div>

                                    {/* Dark gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                </div>
                            </PremiumReveal>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-[var(--color-silver-bh)]/5 to-transparent blur-3xl opacity-30" />
        </section>
    );
}
