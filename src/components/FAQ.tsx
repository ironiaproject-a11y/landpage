"use client";

import { m, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { PremiumReveal } from "./PremiumReveal";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const faqs = [
    {
        question: "O procedimento de implante é doloroso?",
        answer: "Absolutamente não. Utilizamos técnicas de sedação consciente e anestesia computadorizada de alta precisão. Nossos pacientes relatam um pós-operatório extremamente tranquilo e livre de desconforto."
    },
    {
        question: "Quanto tempo dura o tratamento de implantes?",
        answer: "Graças ao nosso planejamento 3D e cirurgia guiada, o tempo de clínica é reduzido em até 50%. A osseointegração costuma levar de 3 a 4 meses, mas oferecemos protocolos de carga imediata para casos selecionados."
    },
    {
        question: "Qual a durabilidade das facetas de porcelana?",
        answer: "Trabalhamos apenas com cerâmicas de padrão internacional (E-max). Com os cuidados adequados e manutenção preventiva, as lentes podem durar de 15 a 20 anos, mantendo o brilho e a integridade original."
    },
    {
        question: "A clínica aceita convênios ou planos de saúde?",
        answer: "Como focamos em tratamentos de alta complexidade e materiais de elite, operamos em sistema particular. No entanto, fornecemos toda a documentação necessária para que você solicite o reembolso junto à sua seguradora."
    },
    {
        question: "Como funciona o atendimento de concierge?",
        answer: "Desde o seu primeiro contato, você terá um concierge dedicado para gerenciar sua agenda, translado e necessidades específicas. Nosso objetivo é que sua única preocupação seja o seu novo sorriso."
    }
];

export function FAQ() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const ctx = gsap.context(() => {
            // Desktop-only cinematic scroll effects
            if (!isMobile) {
                gsap.to(".faq-glow", {
                    y: 100,
                    opacity: 0.15,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5
                    }
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted, isMobile]);

    return (
        <section ref={sectionRef} className="py-20 md:py-40 relative bg-[var(--color-deep-black)] overflow-hidden" id="faq">
            {/* Atmospheric Lighting */}
            <div className="faq-glow absolute top-1/2 left-0 -translate-y-1/2 w-[40%] h-[60%] glow-blob opacity-10 pointer-events-none" />
            <div className="faq-glow absolute bottom-0 right-0 w-[30%] h-[40%] glow-blob-warm opacity-10 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-left mb-16 md:mb-32">
                        <PremiumReveal direction="bottom" delay={0.1}>
                            <span className="text-level-4 uppercase mb-10 block">
                                Dúvidas Frequentes
                            </span>
                        </PremiumReveal>

                        <h2 className="text-level-2">
                            <PremiumReveal type="mask" direction="bottom" delay={0.2}>
                                <span>Alguma outra</span>
                            </PremiumReveal>
                            <PremiumReveal type="mask" direction="bottom" delay={0.3}>
                                <span className="text-white text-level-3 italic block mt-4">dúvida?</span>
                            </PremiumReveal>
                        </h2>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-4 mb-20">
                        {faqs.map((faq, index) => (
                            <PremiumReveal key={index} direction="bottom" delay={0.1 + index * 0.05}>
                                <div
                                    className={`glass-panel overflow-hidden transition-all duration-500 rounded-2xl active:scale-[0.98] cursor-pointer ${activeIndex === index ? "border-[var(--color-silver-bh)]/30 bg-[var(--color-silver-bh)]/[0.05] shadow-[0_0_40px_rgba(203,213,225,0.03)]" : "border-[var(--color-silver-bh)]/5"
                                        }`}
                                >

                                    <button
                                        onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                        className="w-full p-5 md:p-10 flex items-start md:items-center justify-between text-left group"
                                    >
                                        <div className="flex items-start md:items-center gap-4 md:gap-6">
                                            <div className={`w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 border shrink-0 mt-0.5 md:mt-0 ${activeIndex === index
                                                ? "bg-white border-white text-black shadow-none"
                                                : "bg-white/5 border-white/10 text-white/60"
                                                }`}>
                                                <HelpCircle strokeWidth={1.2} className="w-4 h-4 md:w-5 md:h-5" />
                                            </div>
                                            <span 
                                                className="text-white transition-colors leading-tight"
                                                style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '13px', letterSpacing: '1px', textTransform: 'none' }}
                                            >
                                                {faq.question}
                                            </span>
                                        </div>
                                        <div className="ml-4 transition-transform duration-500 min-w-[24px]">
                                            {activeIndex === index ? (
                                                <Minus strokeWidth={1.2} className="w-6 h-6 text-[var(--color-text-primary)]" />
                                            ) : (
                                                <Plus strokeWidth={1.2} className="w-6 h-6 text-[var(--color-text-primary)]/20 group-hover:text-[var(--color-text-primary)]/60" />
                                            )}
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {activeIndex === index && (
                                            <m.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                            >
                                                <div className="px-5 md:px-10 pb-7 md:pb-12 pl-[52px] md:pl-[88px]">
                                                    <p className="text-level-3">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </m.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </PremiumReveal>
                        ))}
                    </div>

                    {/* FAQ CTA */}
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "0px 0px -100px 0px", amount: 0.3 }}
                        className="text-center"
                    >
                        <p className="text-level-4 uppercase mb-8">
                            Ainda tem alguma dúvida específica?
                        </p>
                        <m.a
                            href="#agendamento"
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-premium inline-flex items-center gap-4 px-6 md:px-12 bg-white/5 border-white/10 hover:border-white/50 text-level-4 uppercase"
                        >
                            Falar com um Especialista
                        </m.a>
                    </m.div>
                </div>
            </div>
        </section>
    );
}
