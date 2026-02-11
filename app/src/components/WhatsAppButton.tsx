"use client";

import { m, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { DEFAULT_MESSAGE } from "@/config/constants";
import { generateWhatsAppUrl } from "@/utils/whatsapp";
import { useRef, useState, useEffect } from "react";
import { Magnetic } from "@/components/Magnetic";

export function WhatsAppButton() {
    const whatsappUrl = generateWhatsAppUrl(DEFAULT_MESSAGE);
    const [isHovered, setIsHovered] = useState(false);
    const [showProactive, setShowProactive] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowProactive(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <Magnetic strength={0.4} range={150}>
                <m.a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    onMouseEnter={() => {
                        setIsHovered(true);
                        setShowProactive(false);
                    }}
                    onMouseLeave={() => setIsHovered(false)}
                    whileHover={{
                        scale: 1.1,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(37, 211, 102, 0.2)"
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center bg-[#25D366] text-white shadow-2xl transition-shadow duration-300 group overflow-hidden relative"
                >
                    {/* Premium Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Static Gold Border (Luxury Feel) */}
                    <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-[var(--color-silver-bh)]/40 transition-colors" />

                    <m.div
                        animate={{
                            scale: isHovered ? [1, 1.1, 1] : 1,
                            rotate: isHovered ? [0, -10, 10, 0] : 0
                        }}
                        transition={{
                            repeat: isHovered ? Infinity : 0,
                            duration: 0.6
                        }}
                        className="relative z-10"
                    >
                        <MessageCircle strokeWidth={1.2} className="w-8 h-8" />
                    </m.div>

                    {/* Proactive Speech Bubble */}
                    <AnimatePresence>
                        {showProactive && (
                            <m.div
                                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                                className="absolute right-full mr-6 top-1/2 -translate-y-1/2 whitespace-nowrap px-6 py-4 rounded-organic-md bg-[var(--color-silver-bh)] text-black text-[11px] font-bold uppercase tracking-[0.2em] shadow-2xl pointer-events-none"
                            >
                                <span className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                                    Dúvida sobre nossos protocolos?
                                </span>
                                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-[var(--color-silver-bh)] rotate-45" />
                            </m.div>
                        )}
                    </AnimatePresence>

                    {/* Tooltip (Manual Hover) */}
                    <m.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{
                            opacity: (isHovered && !showProactive) ? 1 : 0,
                            x: (isHovered && !showProactive) ? 0 : 20
                        }}
                        className="absolute right-full mr-6 top-1/2 -translate-y-1/2 whitespace-nowrap px-6 py-3 rounded-organic-sm bg-[#0B0B0B]/90 border border-white/10 text-[var(--color-silver-bh)] text-[10px] font-bold uppercase tracking-[0.3em] pointer-events-none backdrop-blur-xl shadow-premium-2"
                    >
                        Fale Conosco
                        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-[#0B0B0B]/90 border-r border-t border-white/10 rotate-45" />
                    </m.div>
                </m.a>
            </Magnetic>
        </div>
    );
}
