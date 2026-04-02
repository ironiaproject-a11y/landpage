"use client";

import { m } from "framer-motion";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { PremiumReveal } from "./PremiumReveal";
import { Magnetic } from "./Magnetic";

export function LocationSection() {
    // Address data (Placeholder as per previous codebase reference)
    const ADDRESS = "Av. Paulista, 1000 - Bela Vista";
    const CITY = "São Paulo - SP, 01311-000";
    const MAP_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197509536098!2d-46.65215018502223!3d-23.56391498468305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%201000!5e0!3m2!1spt-BR!2sbr!4v1712000000000!5m2!1spt-BR!2sbr";
    const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/964Kq6TfH6C2f6zY7"; // Placeholder legitimate-looking link

    return (
        <section className="relative w-full bg-black py-24 md:py-40 overflow-hidden border-t border-white/5">
            <div className="container mx-auto px-6 mb-16 md:mb-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                    <div className="max-w-2xl">
                        <PremiumReveal direction="bottom" delay={0.1}>
                            <span className="text-[10px] md:text-xs tracking-[0.4em] opacity-40 uppercase block mb-6">
                                LOCALIZAÇÃO PRIVILEGIADA
                            </span>
                        </PremiumReveal>
                        <PremiumReveal type="mask" direction="bottom" delay={0.2}>
                            <h2 className="text-4xl md:text-6xl font-light tracking-tight">
                                No coração de <em className="font-serif italic opacity-90">São Paulo</em>
                            </h2>
                        </PremiumReveal>
                    </div>
                    
                    <PremiumReveal direction="left" delay={0.4}>
                        <div className="flex items-start gap-4 p-6 bg-white/[0.03] border border-white/5 rounded-2xl backdrop-blur-md">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80">
                                <MapPin size={18} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-white text-sm font-medium mb-1">{ADDRESS}</p>
                                <p className="text-white/40 text-[13px]">{CITY}</p>
                            </div>
                        </div>
                    </PremiumReveal>
                </div>
            </div>

            {/* Map Container - Full Width Cinematic */}
            <div className="relative w-full h-[500px] md:h-[700px] group transition-all duration-700">
                {/* Floating Navigation Card - Luxury Minimalist */}
                <m.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                    className="absolute top-12 left-6 md:left-12 z-20 w-[calc(100%-3rem)] md:max-w-sm"
                >
                    <div className="bg-black/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group/card">
                        {/* Subtle highlight */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                        
                        <h3 className="text-xl md:text-2xl font-light text-white mb-4 tracking-tight">
                            Ambiente exclusivo com <span className="font-serif italic border-b border-white/20 pb-0.5">estacionamento privativo</span>
                        </h3>
                        <p className="text-sm text-white/50 leading-relaxed mb-8 font-light">
                            Oferecemos serviço de manobrista (Valet) para sua total comodidade e segurança durante sua visita em nossa clínica clínica.
                        </p>
                        
                        <Magnetic speed={1.5}>
                            <a 
                                href={GOOGLE_MAPS_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-6 py-3.5 bg-white text-black text-xs tracking-widest uppercase font-semibold rounded-full hover:bg-neutral-200 transition-all duration-500"
                            >
                                <Navigation size={14} fill="black" />
                                Abrir no GPS
                                <ExternalLink size={12} className="opacity-50" />
                            </a>
                        </Magnetic>
                    </div>
                </m.div>

                {/* Google Maps Embed with Premium Styling */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <iframe
                        src={MAP_URL}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Localização da Clínica Premium"
                        className="opacity-100 grayscale-[100%] brightness-[0.7] contrast-[1.2] transition-all duration-1000 group-hover:grayscale-[20%] group-hover:brightness-[0.8] w-full h-full scale-[1.05] group-hover:scale-[1]"
                    ></iframe>
                    
                    {/* Cinematic Grain & Fade Out Overlays */}
                    <div className="absolute inset-0 pointer-events-none z-10">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 md:from-black/40 md:to-black/40" />
                    </div>
                </div>

                {/* Interaction Label bottom right */}
                <div className="absolute bottom-10 right-10 z-20 hidden md:block">
                    <m.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.4 }}
                        className="flex items-center gap-3 text-white/50 text-[10px] tracking-[0.4em] uppercase"
                    >
                        EXPLORAR MAPA
                        <div className="w-12 h-[1px] bg-white/20" />
                    </m.div>
                </div>
            </div>
            
            {/* Global cinematic protection for footer transition */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
        </section>
    );
}
