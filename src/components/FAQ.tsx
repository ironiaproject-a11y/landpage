 "use client";

import { m, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

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
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

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
        <section ref={sectionRef} className="py-24 md:py-40 relative bg-[var(--color-deep-black)] overflow-hidden" id="faq">
            {/* Atmospheric Lighting */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[40%] h-[60%] glow-blob opacity-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[30%] h-[40%] glow-blob-warm opacity-10 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 md:mb-24">
                        <m.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="text-[var(--color-silver-bh)] font-semibold tracking-[0.4em] uppercase text-[10px] mb-6 block"
                        >
                            Esclarecimentos
                        </m.span>
                        <h2 ref={titleRef} className="font-display text-5xl md:text-7xl font-medium text-white leading-tight tracking-tight">
                            <div className="block overflow-hidden pb-1">
                                <span className="title-line-inner inline-block">Dúvidas</span> <span className="title-line-inner text-gradient-silver inline-block">Frequentes</span>
                            </div>
                        </h2>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="space-y-4 mb-20">
                        {faqs.map((faq, index) => (
                            <m.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-5%" }}
                                transition={{ delay: index * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className={`glass-panel overflow-hidden transition-all duration-500 rounded-organic-md ${activeIndex === index ? "border-[var(--color-silver-bh)]/30 bg-white/[0.05]" : "border-white/5"
                                    }`}
                            >
                                <button
                                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                    className="w-full p-8 md:p-10 flex items-center justify-between text-left group"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border ${activeIndex === index
                                            ? "bg-[var(--color-silver-bh)] border-[var(--color-silver-bh)] text-black shadow-glow-gold"
                                            : "bg-white/5 border-white/10 text-[var(--color-silver-bh)]"
                                            }`}>
                                            <HelpCircle strokeWidth={1.2} className="w-5 h-5" />
                                        </div>
                                        <span className="text-xl md:text-2xl font-medium text-white tracking-tight group-hover:text-[var(--color-silver-bh)] transition-colors">
                                            {faq.question}
                                        </span>
                                    </div>
                                    <div className="ml-4 transition-transform duration-500">
                                        {activeIndex === index ? (
                                            <Minus strokeWidth={1.2} className="w-6 h-6 text-[var(--color-silver-bh)]" />
                                        ) : (
                                            <Plus strokeWidth={1.2} className="w-6 h-6 text-white/20 group-hover:text-white/60" />
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
                                            <div className="px-8 md:px-10 pb-10 md:pb-12 ml-18 md:ml-22">
                                                <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed font-light max-w-2xl">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </m.div>
                                    )}
                                </AnimatePresence>
                            </m.div>
                        ))}
                    </div>

                    {/* FAQ CTA */}
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <p className="text-[var(--color-text-tertiary)] text-xs uppercase tracking-[0.2em] mb-8">
                            Ainda tem alguma dúvida específica?
                        </p>
                        <m.button
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.open('https://wa.me/551837433000', '_blank')}
                            className="btn-luxury-ghost inline-flex items-center gap-4 px-12"
                        >
                            Falar com um Especialista
                        </m.button>
                    </m.div>
                </div>
            </div>
        </section>
    );
}
