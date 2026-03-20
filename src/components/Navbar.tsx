"use client";

import { m, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Instagram, Facebook, Linkedin } from "lucide-react";
import { Magnetic } from "./Magnetic";

export function Navbar() {
    const [isHidden, setIsHidden] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const { scrollY } = useScroll();

    useEffect(() => {
        const handleReveal = () => setIsVisible(true);
        window.addEventListener("preloader-exiting", handleReveal);
        // Fallback for cases where preloader might already be gone
        if (!(window as any).__PRELOADER_ACTIVE__) setIsVisible(true);
        return () => window.removeEventListener("preloader-exiting", handleReveal);
    }, []);

    // Scroll lock for mobile menu using Lenis
    useEffect(() => {
        const lenis = (window as any).lenis;
        if (isMobileOpen) {
            if (lenis) lenis.stop();
            document.body.style.overflow = "hidden";
        } else {
            if (lenis) lenis.start();
            document.body.style.overflow = "unset";
        }
        return () => {
            if (lenis) lenis.start();
            document.body.style.overflow = "unset";
        };
    }, [isMobileOpen]);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 600) {
            setIsHidden(true);
        } else {
            setIsHidden(false);
        }
        
        if (latest > 400) {
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
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"} ${isScrolled ? "py-4 bg-[var(--color-premium-dark)]/85 backdrop-blur-xl border-b border-white/5" : "pt-12 pb-8 bg-transparent"
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
                            <span className="font-headline text-[16px] font-semibold text-[var(--color-text-primary)] tracking-[0.1em] uppercase transition-all duration-700">
                                Clínica<span className="text-white italic font-light">.</span>
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
                                                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                                        className="text-caption-marker opacity-80"
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
                                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                                    className="absolute inset-0 py-2 px-4 text-caption-marker text-white"
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
                                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                                    className="absolute bottom-1 left-2 right-2 h-[1.5px] bg-white/40 origin-left"
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
                                            "0 0 0px rgba(245, 245, 220, 0)",
                                            "0 0 20px rgba(245, 245, 220, 0.2)",
                                            "0 0 0px rgba(245, 245, 220, 0)"
                                        ] : "none"
                                    } : {}}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 3,
                                        ease: "easeInOut"
                                    }}
                                    onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="btn-premium !py-3 !px-8 text-caption-marker shadow-none hover:shadow-glow-white relative overflow-hidden !bg-white !text-black"
                                >
                                    <m.div
                                        className="absolute inset-0 bg-white/20 translate-x-[-100%]"
                                        animate={{ translateX: ["-100%", "100%"] }}
                                        transition={{ repeat: Infinity, duration: 2, delay: 1, ease: "easeInOut" }}
                                    />
                                    <span className="relative z-10 uppercase tracking-[0.08em]">Agendar</span>
                                </m.button>
                            </Magnetic>
                        </div>
                    </div>

                    {/* Mobile Toggle - Only visible after scroll for maximum minimalism in Hero */}
                    <AnimatePresence>
                        {isScrolled && (
                            <m.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="md:hidden relative z-50 text-[var(--color-text-primary)]"
                                onClick={() => setIsMobileOpen(!isMobileOpen)}
                            >
                                {isMobileOpen ? <X strokeWidth={1} /> : <Menu strokeWidth={1} />}
                            </m.button>
                        )}
                    </AnimatePresence>
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
                        className="fixed inset-0 z-40 bg-[var(--color-background)] flex items-center justify-center md:hidden"
                    >
                        {/* Atmospheric Backgrounds for Mobile Menu */}
                        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                            <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[50%] glow-blob opacity-20 blur-[120px]" />
                            <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[60%] glow-blob-warm opacity-15 blur-[100px]" />
                            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                        </div>

                        <div className="relative z-10 w-full px-8 sm:px-12 flex flex-col h-full justify-center">
                            <m.ul
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.1,
                                            delayChildren: 0.2
                                        }
                                    }
                                }}
                                className="flex flex-col items-center gap-4 sm:gap-6 text-center w-full mt-10"
                            >
                                {links.map((link, index) => (
                                    <m.li
                                        key={link.name}
                                        variants={{
                                            hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
                                            visible: {
                                                opacity: 1,
                                                y: 0,
                                                filter: "blur(0px)",
                                                transition: {
                                                    duration: 0.8,
                                                    ease: [0.22, 1, 0.36, 1]
                                                }
                                            }
                                        }}
                                        className="w-full"
                                    >
                                        <a
                                            href={link.href}
                                            onClick={() => setIsMobileOpen(false)}
                                            className="group relative inline-block py-2 sm:py-3"
                                        >
                                            <span className="font-headline text-2xl sm:text-3xl text-white group-hover:text-white transition-colors tracking-[var(--font-h3-tracking)] font-semibold uppercase" data-text={link.name}>
                                                {link.name}
                                            </span>
                                            <m.div
                                                className="absolute -bottom-1 left-0 right-0 h-px bg-white origin-center"
                                                initial={{ scaleX: 0 }}
                                                whileHover={{ scaleX: 1 }}
                                            />
                                        </a>
                                    </m.li>
                                ))}
                                <m.li
                                    variants={{
                                        hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            filter: "blur(0px)",
                                            transition: {
                                                duration: 0.8,
                                                ease: [0.22, 1, 0.36, 1]
                                            }
                                        }
                                    }}
                                    className="mt-8 sm:mt-12 w-full max-w-[280px] sm:max-w-[320px]"
                                >
                                    <a
                                        href="#contato"
                                        onClick={() => setIsMobileOpen(false)}
                                        className="btn-luxury-primary flex items-center justify-center !py-4 sm:!py-6 w-full text-[var(--font-small)] sm:text-sm tracking-[var(--font-small-tracking)]"
                                    >
                                        Agendar Consulta
                                    </a>
                                </m.li>
                            </m.ul>


                            {/* Contact Details & Socials in Menu */}
                            <div className="mt-12 sm:mt-16 w-full max-w-[400px] mx-auto overflow-hidden">
                                <m.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 1 }}
                                    className="text-center border-t border-white/5 pt-10 sm:pt-12"
                                >
                                    <p className="text-[var(--font-small)] uppercase tracking-[var(--font-small-tracking)] text-[var(--color-text-secondary)] mb-4">Atendimento VIP</p>
                                    <a
                                        href="tel:+551837433000"
                                        className="text-[#F8F8F6] font-medium text-lg sm:text-xl hover:brightness-125 transition-all block mb-2"
                                    >
                                        +55 (18) 3743-3000
                                    </a>
                                    <p className="text-[var(--font-small)] text-white/30 uppercase tracking-[var(--font-small-tracking)] mb-8">Pereira Barreto - SP</p>

                                    <div className="flex items-center justify-center gap-8 border-t border-white/5 pt-8">
                                        {[
                                            { icon: Instagram, href: "#", name: "Instagram" },
                                            { icon: Facebook, href: "#", name: "Facebook" },
                                            { icon: Linkedin, href: "#", name: "Linkedin" }
                                        ].map((social, i) => (
                                            <m.a
                                                key={social.name}
                                                href={social.href}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 1 + (i * 0.1), duration: 0.5 }}
                                                whileHover={{ y: -3, color: "#E6D3A3" }}
                                                className="text-white/40 transition-colors"
                                                aria-label={social.name}
                                            >
                                                <social.icon strokeWidth={1} size={20} />
                                            </m.a>
                                        ))}
                                    </div>
                                </m.div>
                            </div>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </>
    );
}
