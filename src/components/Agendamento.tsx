"use client";

import { m, AnimatePresence } from "framer-motion";
import { PremiumReveal } from "./PremiumReveal";
import { generateWhatsAppUrl } from "@/utils/whatsapp";
import { DEFAULT_MESSAGE } from "@/config/constants";
import { useState } from "react";
import { Check } from "lucide-react";

export function Agendamento() {
    const [nome, setNome] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [servico, setServico] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !whatsapp) return;

        setIsLoading(true);

        // Simula 1.2s de "processamento" antes de redirecionar — cria percepção de serviço premium
        setTimeout(() => {
            const servicoInfo = servico ? `\n\nTratamento de interesse: *${servico}*` : '';
            const customMessage = `*Novo Agendamento*\n\nOlá! Meu nome é *${nome.trim()}*. Meu WhatsApp de contato é ${whatsapp.trim()}.${servicoInfo}\n\nGostaria de agendar uma avaliação.`;

            window.open(generateWhatsAppUrl(customMessage), '_blank');
            setIsLoading(false);
            setIsSuccess(true);
        }, 1200);
    };

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

                <div className="max-w-xl mx-auto min-h-[320px] flex items-center justify-center">
                    <AnimatePresence mode="wait">

                        {/* ── ESTADO: SUCESSO ── */}
                        {isSuccess && (
                            <m.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.92 }}
                                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                className="flex flex-col items-center gap-8 py-16 w-full"
                            >
                                {/* Checkmark animado */}
                                <m.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                                    className="w-20 h-20 rounded-full border border-white/20 bg-white/5 flex items-center justify-center"
                                >
                                    <m.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4, ease: "backOut" }}
                                    >
                                        <Check strokeWidth={1.5} className="w-9 h-9 text-white" />
                                    </m.div>
                                </m.div>

                                <div className="space-y-3">
                                    <m.h3
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.6 }}
                                        className="text-2xl md:text-3xl font-light tracking-tight"
                                        style={{ fontFamily: 'var(--font-serif)' }}
                                    >
                                        Solicitação enviada.
                                    </m.h3>
                                    <m.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.55 }}
                                        transition={{ delay: 0.7, duration: 0.6 }}
                                        className="text-sm font-light leading-relaxed max-w-sm mx-auto"
                                    >
                                        Continue pelo WhatsApp que acabou de abrir — nossa equipe responde em até 2 horas.
                                    </m.p>
                                </div>

                                <m.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                    onClick={() => { setIsSuccess(false); setNome(""); setWhatsapp(""); setServico(""); }}
                                    className="text-xs tracking-[0.2em] uppercase text-white/30 hover:text-white/70 transition-colors mt-4 underline underline-offset-4"
                                >
                                    Fazer outro agendamento
                                </m.button>
                            </m.div>
                        )}

                        {/* ── ESTADO: FORMULÁRIO ── */}
                        {!isSuccess && (
                            <m.form
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6 }}
                                className="space-y-6 w-full"
                                onSubmit={handleSubmit}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        type="text"
                                        required
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        placeholder="Seu nome completo"
                                        disabled={isLoading}
                                        className="w-full bg-white/[0.03] border border-white/10 px-8 py-5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all rounded-sm font-light disabled:opacity-40"
                                    />
                                    <input
                                        type="tel"
                                        required
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        placeholder="Seu WhatsApp"
                                        disabled={isLoading}
                                        className="w-full bg-white/[0.03] border border-white/10 px-8 py-5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all rounded-sm font-light disabled:opacity-40"
                                    />
                                </div>

                                {/* Select de serviço */}
                                <div className="relative">
                                    <select
                                        value={servico}
                                        onChange={(e) => setServico(e.target.value)}
                                        disabled={isLoading}
                                        className="w-full bg-white/[0.03] border border-white/10 px-8 py-5 text-white/70 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all rounded-sm font-light appearance-none cursor-pointer disabled:opacity-40"
                                    >
                                        <option value="" className="bg-black text-white">Tratamento de interesse (opcional)</option>
                                        <option value="Implantes Dentários" className="bg-black text-white">Implantes Dentários</option>
                                        <option value="Facetas e Lentes de Contato" className="bg-black text-white">Facetas e Lentes de Contato</option>
                                        <option value="Protocolo Ortodôntico" className="bg-black text-white">Protocolo Ortodôntico</option>
                                        <option value="Endodontia Avançada" className="bg-black text-white">Endodontia Avançada</option>
                                        <option value="Disfunção Orofacial" className="bg-black text-white">Disfunção e Dores Orofaciais</option>
                                        <option value="Odontopediatria" className="bg-black text-white">Odontopediatria</option>
                                        <option value="Diagnóstico por Imagem" className="bg-black text-white">Diagnóstico por Imagem / Fluxo 3D</option>
                                        <option value="Avaliação Geral" className="bg-black text-white">Avaliação Geral</option>
                                    </select>
                                    {/* Chevron customizado — remove o select default arrow */}
                                    <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-white/30">
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                            <path d="M1 1L6 7L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>

                                {/* Botão com estado de loading */}
                                <m.button
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                                    className="w-full bg-white text-black py-6 px-10 text-xs md:text-sm tracking-[0.2em] uppercase font-medium transition-all flex items-center justify-center gap-4 group disabled:opacity-80 disabled:cursor-not-allowed"
                                >
                                    <AnimatePresence mode="wait">
                                        {isLoading ? (
                                            <m.div
                                                key="loader"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="flex items-center gap-3"
                                            >
                                                {/* Spinner */}
                                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.2)" strokeWidth="3" />
                                                    <path d="M12 2a10 10 0 0 1 10 10" stroke="black" strokeWidth="3" strokeLinecap="round" />
                                                </svg>
                                                <span>Processando...</span>
                                            </m.div>
                                        ) : (
                                            <m.div
                                                key="label"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center gap-4"
                                            >
                                                Solicitar Agendamento
                                                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                                            </m.div>
                                        )}
                                    </AnimatePresence>
                                </m.button>
                            </m.form>
                        )}

                    </AnimatePresence>
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
