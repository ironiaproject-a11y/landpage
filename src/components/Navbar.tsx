"use client";

import { m, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Magnetic } from "./Magnetic";

export function Navbar() {
    const [isHidden, setIsHidden] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150) {
            setIsHidden(true);
        } else {
            setIsHidden(false);
        }

        if (latest > 50) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }

        // Active section detection
        const sections = links.map(link => link.href.replace("#", "")).filter(id => id !== "");
        for (const sectionId of sections.reverse()) {
            const element = document.getElementById(sectionId);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 100) {
                    setActiveSection("#" + sectionId);
                    break;
                }
            }
        }
        if (latest < 100) setActiveSection("#");
    });

    const links = [
        { name: "Início", href: "#" },
        { name: "Sobre", href: "#sobre" },
        { name: "Tratamentos", href: "#servicos" },
        { name: "Resultados", href: "#casos" },
        { name: "Depoimentos", href: "#depoimentos" },
    ];

    return (
        <>
            <m.nav
                variants={{
                    visible: { y: 0 },
                    hidden: { y: "-100%" },
                }}
                animate={isHidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-4 bg-[#050505]/85 backdrop-blur-xl border-b border-white/5" : "pt-20 pb-8 bg-transparent"
                    }`}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Magnetic strength={0.2} range={60}>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="relative z-50 flex items-center gap-2"
                        >
                            <span className="font-body text-[9px] font-semibold text-white tracking-[0.2em] uppercase group-hover:tracking-[0.25em] transition-all duration-700">
                                Clínica<span className="text-[var(--color-silver-bh)] font-bold">.</span>
                            </span>
                        </a>
                    </Magnetic>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-10">
                        <ul className="flex items-center gap-6">
                            {links.map((link) => (
                                <li key={link.name}>
                                    <Magnetic strength={0.3} range={50}>
                                        <m.a
                                            href={link.href}
                                            className="relative block py-2 px-4 group overflow-hidden"
                                            initial="initial"
                                            whileHover="hover"
                                        >
                                            {/* Original Text */}
                                            <m.div
                                                variants={{
                                                    initial: { y: 0 },
                                                    hover: { y: "-110%" }
                                                }}
                                                animate={activeSection === link.href ? "hover" : "initial"}
                                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                                className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.2em]"
                                            >
                                                {link.name}
                                            </m.div>

                                            {/* Hover Text (Champagne) */}
                                            <m.div
                                                variants={{
                                                    initial: { y: "110%" },
                                                    hover: { y: 0 }
                                                }}
                                                animate={activeSection === link.href ? "hover" : "initial"}
                                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                                className="absolute inset-0 py-2 px-4 text-[10px] font-bold text-[var(--color-silver-bh)] uppercase tracking-[0.2em]"
                                            >
                                                {link.name}
                                            </m.div>

                                            {/* Animated Underline */}
                                            <m.div
                                                variants={{
                                                    initial: { scaleX: 0, opacity: 0 },
                                                    hover: { scaleX: 1, opacity: 1 }
                                                }}
                                                animate={activeSection === link.href ? "hover" : "initial"}
                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                                className="absolute bottom-1 left-2 right-2 h-[1.5px] bg-[var(--color-silver-bh)] origin-left"
                                            />
                                        </m.a>
                                    </Magnetic>
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center gap-6">
                            <Magnetic strength={0.4} range={80}>
                                <m.button
                                    whileHover={{ y: -3, scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={activeSection !== "" ? {
                                        boxShadow: isScrolled ? [
                                            "0 0 0px rgba(199, 168, 107, 0)",
                                            "0 0 20px rgba(199, 168, 107, 0.4)",
                                            "0 0 0px rgba(199, 168, 107, 0)"
                                        ] : "none"
                                    } : {}}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 3,
                                        ease: "easeInOut"
                                    }}
                                    onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="btn-luxury-primary !py-3 !px-8 text-[9px] tracking-[0.2em] shadow-none hover:shadow-glow-gold relative overflow-hidden"
                                >
                                    <m.div
                                        className="absolute inset-0 bg-white/20 translate-x-[-100%]"
                                        animate={{ translateX: ["-100%", "100%"] }}
                                        transition={{ repeat: Infinity, duration: 2, delay: 1, ease: "easeInOut" }}
                                    />
                                    <span className="relative z-10">Agendar</span>
                                </m.button>
                            </Magnetic>
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden relative z-50 text-white"
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                    >
                        {isMobileOpen ? <X strokeWidth={1.2} /> : <Menu strokeWidth={1.2} />}
                    </button>
                </div>
            </m.nav>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <m.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 200, mass: 1 }}
                        className="fixed inset-0 z-40 bg-[var(--color-deep-black)] flex items-center justify-center md:hidden"
                    >
                        {/* Atmospheric Backgrounds for Mobile Menu */}
                        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                            <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[50%] glow-blob opacity-20 blur-[120px]" />
                            <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[60%] glow-blob-warm opacity-15 blur-[100px]" />
                            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                        </div>

                        <div className="relative z-10 w-full px-12">
                            <ul className="flex flex-col items-center gap-6 text-center w-full">
                                {links.map((link, index) => (
                                    <m.li
                                        key={link.name}
                                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        transition={{ delay: 0.2 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                                        className="w-full"
                                    >
                                        <a
                                            href={link.href}
                                            onClick={() => setIsMobileOpen(false)}
                                            className="group relative inline-block py-4"
                                        >
                                            <span className="font-display text-4xl text-white group-hover:text-[var(--color-silver-bh)] transition-colors tracking-tight">
                                                {link.name}
                                            </span>
                                            <m.div
                                                className="absolute bottom-2 left-0 right-0 h-px bg-[var(--color-silver-bh)] origin-center"
                                                initial={{ scaleX: 0 }}
                                                whileHover={{ scaleX: 1 }}
                                            />
                                        </a>
                                    </m.li>
                                ))}
                                <m.li
                                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={{ delay: 0.2 + (links.length * 0.1) + 0.1, duration: 1 }}
                                    className="mt-16 w-full max-w-[320px]"
                                >
                                    <a
                                        href="#contato"
                                        onClick={() => setIsMobileOpen(false)}
                                        className="btn-luxury-primary flex items-center justify-center !py-6 w-full text-xs tracking-[0.3em]"
                                    >
                                        Agendar Consulta
                                    </a>
                                </m.li>
                            </ul>

                            {/* Contact Details in Menu */}
                            <m.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1, duration: 1 }}
                                className="mt-20 text-center border-t border-white/5 pt-12"
                            >
                                <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--color-text-tertiary)] mb-4">Atendimento VIP</p>
                                <a
                                    href="tel:+551837433000"
                                    className="text-[var(--color-silver-bh)] font-medium text-xl md:text-2xl hover:brightness-125 transition-all block mb-2"
                                >
                                    +55 (18) 3743-3000
                                </a>
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Pereira Barreto - SP</p>
                            </m.div>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </>
    );
}
