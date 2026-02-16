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
        <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[100]">
            <Magnetic strength={isHovered ? 0.4 : 0.1} range={100}>
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
                        scale: 1.05,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(37, 211, 102, 0.3)"
                    }}
                    whileTap={{ scale: 0.92 }}
                    className="w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center bg-[#25D366] text-white shadow-2xl transition-shadow duration-300 group overflow-hidden relative"
                >
                    {/* Ripple Background Animation */}
                    <m.div
                        className="absolute inset-0 bg-[#25D366] rounded-full z-0"
                        animate={{
                            scale: [1, 1.4],
                            opacity: [0.3, 0]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeOut"
                        }}
                    />

                    {/* Premium Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />

                    {/* Static Gold Border (Luxury Feel) */}
                    <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-[var(--color-silver-bh)]/40 transition-colors z-20" />

                    <m.div
                        animate={{
                            scale: isHovered ? [1, 1.1, 1] : 1,
                            rotate: isHovered ? [0, -10, 10, 0] : 0
                        }}
                        transition={{
                            repeat: isHovered ? Infinity : 0,
                            duration: 0.6
                        }}
                        className="relative z-30"
                    >
                        <MessageCircle strokeWidth={1.2} className="w-7 h-7 lg:w-8 lg:h-8" />
                    </m.div>

                    {/* Proactive Speech Bubble */}
                    <AnimatePresence>
                        {showProactive && (
                            <m.div
                                initial={{ opacity: 0, scale: 0.8, x: 20, y: "-50%" }}
                                animate={{ opacity: 1, scale: 1, x: 0, y: "-50%" }}
                                exit={{ opacity: 0, scale: 0.8, x: 20, y: "-50%" }}
                                className="absolute right-[120%] top-1/2 whitespace-nowrap px-6 py-4 rounded-2xl bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] shadow-2xl pointer-events-none hidden sm:block"
                            >
                                <span className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                                    Fale conosco agora
                                </span>
                                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white rotate-45" />
                            </m.div>
                        )}
                    </AnimatePresence>
                </m.a>
            </Magnetic>
        </div>
    );
}
