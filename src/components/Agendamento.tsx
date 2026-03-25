"use client";

import { m } from "framer-motion";
import { PremiumReveal } from "./PremiumReveal";
import { generateWhatsAppUrl } from "@/utils/whatsapp";
import { DEFAULT_MESSAGE } from "@/config/constants";

export function Agendamento() {
    return (
        <section id="agendamento" className="py-24 md:py-40 bg-black text-white relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <PremiumReveal direction="bottom" delay={0.1}>
                    <span className="text-[10px] md:text-xs tracking-[0.4em] opacity-50 uppercase block mb-6">
                        COMECE SUA TRANSFORMAÇÃO
                    </span>
                </PremiumReveal>
                
                <PremiumReveal type="mask" direction="bottom" delay={0.2}>
                    <h2 className="text-4xl md:text-6xl font-light mb-8 tracking-tight">
                        Agende sua <em className="font-serif italic text-white/90">consulta</em>
                    </h2>
                </PremiumReveal>
                
                <PremiumReveal direction="bottom" delay={0.3}>
                    <p className="text-base md:text-lg opacity-60 max-w-xl mx-auto mb-16 font-light leading-relaxed">
                        Nossa equipe está pronta para criar o sorriso que você sempre sonhou.
                        Preencha o formulário e entraremos em contato em até 24 horas.
                    </p>
                </PremiumReveal>
                
                <div className="max-w-xl mx-auto">
                    <m.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input 
                                type="text" 
                                placeholder="Seu nome completo"
                                className="w-full bg-white/[0.03] border border-white/10 px-8 py-5 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-all rounded-sm font-light"
                            />
                            <input 
                                type="tel" 
                                placeholder="Seu WhatsApp"
                                className="w-full bg-white/[0.03] border border-white/10 px-8 py-5 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-all rounded-sm font-light"
                            />
                        </div>
                        <textarea 
                            placeholder="Descreva brevemente o que você procura"
                            rows={4}
                            className="w-full bg-white/[0.03] border border-white/10 px-8 py-5 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-all rounded-sm font-light resize-none"
                        ></textarea>
                        
                        <m.button 
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-white text-black py-6 px-10 text-xs md:text-sm tracking-[0.2em] uppercase font-medium transition-all flex items-center justify-center gap-4"
                        >
                            Solicitar Agendamento
                            <span className="text-lg">→</span>
                        </m.button>
                    </m.div>
                </div>
                
                <PremiumReveal direction="bottom" delay={0.6}>
                    <p className="text-[10px] md:text-xs opacity-30 mt-12 tracking-widest uppercase">
                        Ou envie uma mensagem direto no WhatsApp: 
                        <a 
                            href={generateWhatsAppUrl(DEFAULT_MESSAGE)} 
                            target="_blank" 
                            className="ml-2 underline underline-offset-4 hover:opacity-100 transition-opacity"
                        >
                            Falar com Concierge
                        </a>
                    </p>
                </PremiumReveal>
            </div>
        </section>
    );
}
