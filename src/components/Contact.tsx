"use client";

import { useRef, useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Magnetic } from "./Magnetic";
import { LuxuryCard } from "./LuxuryCard";
import { PremiumReveal } from "./PremiumReveal";
import { COMPANY_PHONE, COMPANY_EMAIL } from "@/config/constants";
import { generateWhatsAppUrl } from "@/utils/whatsapp";
import clsx from "clsx";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Contact() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [mounted, setMounted] = useState(false);
    const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section ref={sectionRef} className="py-20 md:py-40 relative bg-[var(--color-background)] overflow-hidden" id="contato">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    {/* Info Side */}
                    <div className="lg:w-1/3">
                        <PremiumReveal direction="bottom" delay={0.1}>
                            <span className="text-level-4 uppercase mb-10 block">
                                Contato
                            </span>
                        </PremiumReveal>

                        <h2 className="text-level-2 mb-12 uppercase">
                            <PremiumReveal type="mask" direction="bottom" delay={0.2}>
                                <span>Vamos planejar seu</span>
                            </PremiumReveal>
                            <PremiumReveal type="mask" direction="bottom" delay={0.3}>
                                <span className="text-white text-level-3 italic block mt-4">novo sorriso?</span>
                            </PremiumReveal>
                        </h2>

                        <PremiumReveal direction="bottom" delay={0.4}>
                            <p className="text-level-3 mb-12">
                                Nossa equipe de concierges está pronta para atender você e esclarecer todas as suas dúvidas sobre nossos tratamentos.
                            </p>
                        </PremiumReveal>

                        <div className="space-y-6">
                            {[
                                { icon: Phone, title: "Telefone", value: COMPANY_PHONE, href: `tel:${COMPANY_PHONE.replace(/\D/g, '')}`, sub: "Atendimento Geral" },
                                { icon: Mail, title: "Email", value: COMPANY_EMAIL, href: `mailto:${COMPANY_EMAIL}`, sub: "Retorno em 24h" },
                                { icon: MapPin, title: "Endereço", value: "Centro, Pereira Barreto - SP", href: "#", sub: "Brasil" }
                            ].map((item, i) => (
                                <PremiumReveal key={i} direction="left" delay={0.5 + i * 0.1}>
                                    <div className="flex items-center gap-5 group p-2">
                                        <div className="w-11 h-11 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[var(--color-text-primary)] group-hover:bg-white group-hover:text-black transition-all duration-500">
                                            <item.icon strokeWidth={1} className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-level-4 uppercase mb-2"> {item.title} </h4>
                                            <a href={item.href} className="text-white hover:text-white transition-colors text-level-3 font-medium"> {item.value} </a>
                                        </div>
                                    </div>
                                </PremiumReveal>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-2/3">
                        <LuxuryCard delay={0.2} interactive={false} innerClassName="p-6 py-10 md:p-14">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (formStatus !== "idle") return;

                                    setFormStatus("sending");

                                    const form = e.target as HTMLFormElement;
                                    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                                    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
                                    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                                    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

                                    const text = `*Nova Solicitação via Site*\n\n*Nome:* ${name}\n*Telefone:* ${phone}\n*Email:* ${email}\n*Mensagem:* ${message}`;

                                    setTimeout(() => {
                                        window.open(generateWhatsAppUrl(text), '_blank');
                                        setFormStatus("sent");
                                        form.reset();
                                        setTimeout(() => setFormStatus("idle"), 5000);
                                    }, 1500);
                                }}
                                className="relative z-10 space-y-10"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-level-4 uppercase ml-1 block">Nome</label>
                                        <input
                                            name="name"
                                            type="text"
                                            required
                                            placeholder="Seu nome"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-5 text-white placeholder:text-white/10 focus:outline-none focus:border-[var(--color-text-primary)]/50 transition-all text-level-3"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-level-4 uppercase ml-1 block">WhatsApp</label>
                                        <input
                                            name="phone"
                                            type="tel"
                                            required
                                            placeholder="(00) 0 0000-0000"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-5 text-white placeholder:text-white/10 focus:outline-none focus:border-[var(--color-text-primary)]/50 transition-all text-level-3"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-level-4 uppercase ml-1 block">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="seu@email.com"
                                        className="w-full bg-[var(--color-text-primary)]/[0.03] border border-[var(--color-text-primary)]/10 rounded-xl px-6 py-5 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-primary)]/10 focus:outline-none focus:border-[var(--color-text-primary)]/50 transition-all text-level-3"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-level-4 uppercase ml-1 block">Como podemos ajudar?</label>
                                    <textarea
                                        name="message"
                                        rows={4}
                                        placeholder="Descreva brevemente seu objetivo..."
                                        className="w-full bg-[var(--color-text-primary)]/[0.03] border border-[var(--color-text-primary)]/10 rounded-xl px-6 py-5 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-primary)]/10 focus:outline-none focus:border-[var(--color-text-primary)]/50 transition-all resize-none text-level-3"
                                    />
                                </div>

                                <m.button
                                    whileHover={formStatus === "idle" ? { y: -2 } : {}}
                                    whileTap={formStatus === "idle" ? { scale: 0.98 } : {}}
                                    disabled={formStatus !== "idle"}
                                    type="submit"
                                    className={clsx(
                                        "w-full py-6 rounded-full font-bold text-caption-marker transition-all duration-500",
                                        formStatus === "idle" ? "bg-white text-black hover:bg-white/90" : "bg-white/10 text-white/40 cursor-wait"
                                    )}
                                >
                                    <AnimatePresence mode="wait">
                                        <m.span key={formStatus} className="text-level-4 font-bold uppercase" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                            {formStatus === "idle" && "Solicitar Agendamento de Luxo"}
                                            {formStatus === "sending" && "Enviando Requisição..."}
                                            {formStatus === "sent" && "Solicitação Confirmada"}
                                        </m.span>
                                    </AnimatePresence>
                                </m.button>
                            </form>
                        </LuxuryCard>
                    </div>
                </div>
            </div>

            {/* Google Maps Section - Premium Cinematic Enhancement */}
            <div className="relative group/map section-divider-top">
                <div className="absolute inset-0 z-20 pointer-events-none border-y border-white/5 bg-gradient-to-b from-[var(--color-graphite)] via-transparent to-[var(--color-graphite)] opacity-60"></div>

                {/* Floating Map Info Card - Refined Positioning */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -100px 0px", amount: 0.3 }}
                    className="absolute top-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:top-12 md:left-20 z-30 w-[calc(100%-3rem)] md:max-w-xs"
                >
                    <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-premium-2 text-[var(--color-text-primary)]">
                        <span className="text-[var(--color-text-secondary)] font-semibold tracking-[var(--font-small-tracking)] uppercase text-[var(--font-small)] mb-3 block opacity-80">
                            Localização Privilegiada
                        </span>
                        <h3 className="text-lg md:text-xl font-display text-white mb-3">Estamos no <span className="text-gradient-silver">coração da Paulista</span></h3>
                        <p className="text-level-4 text-[var(--color-text-secondary)] leading-relaxed mb-5 opacity-90">
                            Ambiente exclusivo com estacionamento privativo e manobrista para sua total comodidade.
                        </p>
                        <a
                            href="https://goo.gl/maps/embed?pb=!1m18!1m12!1m3!1d3657.197509536098!2d-46.65215018502223!3d-23.56391498468305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%201000%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-100!5e0!3m2!1sen!2sbr!4v1620000000000!5m2!1sen!2sbr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/60 text-level-4 font-bold uppercase flex items-center gap-2 hover:gap-4 transition-all group-hover:text-white"
                        >
                            Ver no Google Maps <span className="text-lg">→</span>
                        </a>
                    </div>
                </m.div>

                {/* Google Maps Embed with Premium Styling */}
                <div className="w-full h-[400px] md:h-[600px] contrast-[1.1] brightness-[0.8] transition-all duration-700 group-hover/map:brightness-[0.9] group-hover/map:contrast-[1.15] relative z-10 overflow-hidden">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197509536098!2d-46.65215018502223!3d-23.56391498468305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%201000%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-100!5e0!3m2!1sen!2sbr!4v1620000000000!5m2!1sen!2sbr"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Localização da Clínica Premium"
                        className="opacity-100 grayscale hover:grayscale-0 transition-all duration-1000"
                    ></iframe>

                    {/* Interactive Overlay - Click to focus */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-deep-black)] to-transparent opacity-40 pointer-events-none" />

                    {/* Cinematic Glare Effect Overlay */}
                    <m.div
                        style={{
                            background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)",
                            backgroundSize: "200% 200%",
                        }}
                        animate={{ backgroundPosition: ["100% 100%", "-100% -100%"] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 pointer-events-none z-20"
                    />

                    <div className="absolute bottom-6 right-6 opacity-0 group-hover/map:opacity-100 transition-opacity duration-500 pointer-events-none z-30">
                        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-caption-marker tracking-widest text-white shadow-premium-1">
                            Mapa Interativo
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

