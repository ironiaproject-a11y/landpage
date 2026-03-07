"use client";

import { PremiumReveal } from "./PremiumReveal";

export function MidCTA() {
    return (
        <section className="py-20 md:py-32 bg-[#050505] relative z-20 flex flex-col items-center justify-center border-y border-white/5">
            <div className="container mx-auto px-6 text-center">
                <PremiumReveal direction="bottom">
                    <h2 className="font-display text-2xl md:text-3xl font-medium text-white mb-10 uppercase tracking-widest opacity-80">
                        Pronto para o seu <span className="text-gradient-silver italic">novo legado?</span>
                    </h2>
                </PremiumReveal>

                <PremiumReveal direction="bottom" delay={0.2}>
                    <button className="mid-cta-button group relative">
                        <span className="relative z-10">Agendar Consulta</span>
                        <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                    </button>
                </PremiumReveal>
            </div>

            <style>{`
                .mid-cta-button {
                    width: 100%;
                    max-width: 320px;
                    height: 56px;
                    background: linear-gradient(180deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.95) 100%);
                    color: #FBFBFB;
                    border-radius: 9999px;
                    font-weight: 500;
                    font-size: 13px;
                    letter-spacing: 1.2px;
                    text-transform: uppercase;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(255,255,255,0.15);
                    border-top: 1px solid rgba(255,255,255,0.3);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                }

                .mid-cta-button:hover {
                    background: linear-gradient(180deg, rgba(30,30,30,0.95) 0%, rgba(15,15,15,0.95) 100%);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2);
                    border-color: rgba(255,255,255,0.25);
                    border-top-color: rgba(255,255,255,0.4);
                    transform: translateY(-2px);
                }
            `}</style>
        </section>
    );
}
