"use client";

import { useRef, useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Magnetic } from "./Magnetic";
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

    useEffect(() => {
        if (!mounted) return;

        const ctx = gsap.context(() => {
            const titleLines = Array.from(titleRef.current?.querySelectorAll(".title-line-inner") || []);

            if (titleLines.length > 0) {
                gsap.fromTo(titleLines,
                    { y: "110%", skewY: 7, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: titleRef.current,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        },
                        y: 0,
                        skewY: 0,
                        opacity: 1,
                        stagger: 0.15,
                        duration: 1.2,
                        ease: "power4.out"
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted]);

    return (
        <section ref={sectionRef} className="py-24 md:py-40 relative bg-[var(--color-background)] overflow-hidden" id="contato">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    {/* Info Side */}
                    <div className="lg:w-1/3">
                        <m.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "0px 0px -100px 0px", amount: 0.3 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="text-[var(--color-silver-bh)] font-semibold tracking-[0.2em] uppercase text-xs mb-6 block"
                        >
                            Contato
                        </m.span>
                        <h2 ref={titleRef} className="font-display text-4xl md:text-5xl font-medium text-white mb-8 leading-tight">
                            <div className="block overflow-hidden pb-1">
                                <span className="title-line-inner inline-block">Vamos planejar seu</span>
                            </div>
                            <div className="block overflow-hidden pb-1">
                                <span className="title-line-inner inline-block text-gradient-silver">novo sorriso</span>?
                            </div>
                        </h2>
                        <m.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "0px 0px -100px 0px", amount: 0.3 }}
                            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="text-[var(--color-text-secondary)] mb-12 leading-relaxed"
                        >
                            Nossa equipe de concierges está pronta para atender você e esclarecer todas as suas dúvidas sobre nossos tratamentos.
                        </m.p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4 group">
                                <Magnetic strength={0.3} range={50}>
                                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-silver-bh)] shrink-0 transition-all duration-500 group-hover:bg-[var(--color-silver-bh)] group-hover:text-black shadow-level-1">
                                        <Phone strokeWidth={1.2} className="w-5 h-5" />
                                    </div>
                                </Magnetic>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Telefone</h4>
                                    <a href={`tel:${COMPANY_PHONE.replace(/\D/g, '')}`} className="text-[var(--color-text-secondary)] hover:text-white transition-colors cursor-pointer">{COMPANY_PHONE}</a>
                                    <p className="text-[var(--color-text-tertiary)] text-xs mt-1">Geral</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <Magnetic strength={0.3} range={50}>
                                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-silver-bh)] shrink-0 transition-all duration-500 group-hover:bg-[var(--color-silver-bh)] group-hover:text-black shadow-level-1">
                                        <Mail strokeWidth={1.2} className="w-5 h-5" />
                                    </div>
                                </Magnetic>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Email</h4>
                                    <a href={`mailto:${COMPANY_EMAIL}`} className="text-[var(--color-text-secondary)] hover:text-white transition-colors cursor-pointer">{COMPANY_EMAIL}</a>
                                    <p className="text-[var(--color-text-tertiary)] text-xs mt-1">24h retorno</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <Magnetic strength={0.3} range={50}>
                                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-silver-bh)] shrink-0 transition-all duration-500 group-hover:bg-[var(--color-silver-bh)] group-hover:text-black shadow-level-1">
                                        <MapPin strokeWidth={1.2} className="w-5 h-5" />
                                    </div>
                                </Magnetic>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Endereço</h4>
                                    <p className="text-[var(--color-text-secondary)]">Centro, Pereira Barreto - SP</p>
                                    <p className="text-[var(--color-text-secondary)]">Brasil</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <m.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "0px 0px -100px 0px", amount: 0.3 }}
                        transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:w-2/3"
                    >
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
                            className="glass-panel rounded-organic-md p-10 md:p-16 relative overflow-hidden group/form"
                        >
                            {/* Lighting Blob Evolution */}
                            <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] glow-blob-warm opacity-20 pointer-events-none transition-transform duration-1000 group-focus-within/form:scale-125" />
                            <div className="absolute bottom-0 left-0 w-[30%] h-[30%] glow-blob opacity-10 pointer-events-none" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                                <div className="space-y-4 group/input">
                                    <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] ml-2 group-focus-within/input:text-[var(--color-silver-bh)] group-focus-within/input:translate-x-2 transition-all duration-500 block">Nome</label>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Seu nome completo"
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-organic-sm px-10 py-6 text-white placeholder:text-white/5 focus:outline-none focus:border-[var(--color-silver-bh)] focus:bg-white/[0.05] transition-all font-body text-base ring-0 focus:ring-4 focus:ring-[var(--color-silver-bh)]/5 shadow-inner"
                                    />
                                </div>
                                <div className="space-y-4 group/input">
                                    <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] ml-2 group-focus-within/input:text-[var(--color-silver-bh)] group-focus-within/input:translate-x-2 transition-all duration-500 block">Telefone</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        required
                                        placeholder="(11) 99999-9999"
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-organic-sm px-10 py-6 text-white placeholder:text-white/5 focus:outline-none focus:border-[var(--color-silver-bh)] focus:bg-white/[0.05] transition-all font-body text-base ring-0 focus:ring-4 focus:ring-[var(--color-silver-bh)]/5 shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 mb-12 group/input">
                                <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] ml-2 group-focus-within/input:text-[var(--color-silver-bh)] group-focus-within/input:translate-x-2 transition-all duration-500 block">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="seu@email.com"
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-organic-sm px-10 py-6 text-white placeholder:text-white/5 focus:outline-none focus:border-[var(--color-silver-bh)] focus:bg-white/[0.05] transition-all font-body text-base ring-0 focus:ring-4 focus:ring-[var(--color-silver-bh)]/5 shadow-inner"
                                />
                            </div>

                            <div className="space-y-4 mb-14 group/input">
                                <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] ml-2 group-focus-within/input:text-[var(--color-silver-bh)] group-focus-within/input:translate-x-2 transition-all duration-500 block">Mensagem</label>
                                <textarea
                                    name="message"
                                    rows={5}
                                    placeholder="Como podemos ajudar?"
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-organic-sm px-10 py-6 text-white placeholder:text-white/5 focus:outline-none focus:border-[var(--color-silver-bh)] focus:bg-white/[0.05] transition-all resize-none font-body text-base ring-0 focus:ring-4 focus:ring-[var(--color-silver-bh)]/5 shadow-inner"
                                />
                            </div>

                            <m.button
                                whileHover={formStatus === "idle" ? { scale: 1.02, y: -5 } : {}}
                                whileTap={formStatus === "idle" ? { scale: 0.99 } : {}}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                data-cursor="magnetic"
                                type="submit"
                                disabled={formStatus !== "idle"}
                                className={clsx(
                                    "btn-luxury-primary w-full group flex items-center justify-center gap-4 overflow-hidden transition-all duration-500",
                                    formStatus === "sent" && "bg-green-500/20 text-green-400 border-green-500/30"
                                )}
                            >
                                <AnimatePresence mode="wait">
                                    <m.span
                                        key={formStatus}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="relative z-10 flex items-center gap-4"
                                    >
                                        {formStatus === "idle" && (
                                            <>
                                                Enviar Mensagem
                                                <Send strokeWidth={1.2} className="w-5 h-5 group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform duration-700 ease-out" />
                                            </>
                                        )}
                                        {formStatus === "sending" && "Processando..."}
                                        {formStatus === "sent" && "Mensagem Enviada com Sucesso!"}
                                    </m.span>
                                </AnimatePresence>

                                {formStatus === "idle" && (
                                    <m.div
                                        className="absolute inset-0 bg-white/10 translate-x-[-100%]"
                                        whileHover={{ translateX: "100%" }}
                                        transition={{ duration: 1, ease: "easeInOut" }}
                                    />
                                )}
                            </m.button>
                        </form>
                    </m.div>
                </div>
            </div>

            {/* Google Maps Section - Premium Cinematic Enhancement */}
            <div className="relative group/map section-divider-top">
                <div className="absolute inset-0 z-20 pointer-events-none border-y border-white/5 bg-gradient-to-b from-[var(--color-graphite)] via-transparent to-[var(--color-graphite)] opacity-60"></div>

                {/* Floating Map Info Card */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -100px 0px", amount: 0.3 }}
                    className="absolute top-12 left-6 md:left-20 z-30 lg:max-w-xs"
                >
                    <div className="glass-panel p-8 rounded-organic-md border border-white/10 backdrop-blur-xl">
                        <span className="text-[var(--color-silver-bh)] font-semibold tracking-[0.2em] uppercase text-[10px] mb-3 block">
                            Localização Privilegiada
                        </span>
                        <h3 className="text-xl font-display text-white mb-4">Estamos no <span className="text-gradient-silver">coração da Paulista</span></h3>
                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6">
                            Estacionamento privativo com Manobrista para sua total comodidade e segurança durante sua visita.
                        </p>
                        <a
                            href="https://goo.gl/maps/embed?pb=!1m18!1m12!1m3!1d3657.197509536098!2d-46.65215018502223!3d-23.56391498468305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%201000%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-100!5e0!3m2!1sen!2sbr!4v1620000000000!5m2!1sen!2sbr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--color-silver-bh)] text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all"
                        >
                            Ver no Google Maps <span className="text-lg">→</span>
                        </a>
                    </div>
                </m.div>

                {/* Google Maps Embed with Premium Styling */}
                <div className="w-full h-[600px] contrast-[1.1] brightness-[0.8] transition-all duration-700 group-hover/map:brightness-[0.9] group-hover/map:contrast-[1.15] relative z-10 overflow-hidden">
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

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/map:opacity-100 transition-opacity duration-500 pointer-events-none z-30">
                        <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white">
                            Interação Ativada
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

