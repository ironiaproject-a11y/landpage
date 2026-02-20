"use client";

import { m } from "framer-motion";
import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin, ArrowUp, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COMPANY_PHONE, COMPANY_EMAIL, SOCIAL_LINKS, DEFAULT_MESSAGE } from "@/config/constants";
import { generateWhatsAppUrl } from "@/utils/whatsapp";
import { Magnetic } from "./Magnetic";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Footer() {
    const currentYear = new Date().getFullYear();
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const ctx = gsap.context(() => {
            const reveals = Array.from(sectionRef.current?.querySelectorAll(".title-line-inner") || []);

            if (reveals.length > 0) {
                gsap.fromTo(reveals,
                    { y: "110%", skewY: 7, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top 90%",
                            toggleActions: "play none none reverse"
                        },
                        y: 0,
                        skewY: 0,
                        ease: "power4.out"
                    }
                );
            }

            // Animate Footer Content
            const footerItems = gsap.utils.toArray(".footer-reveal-item");
            gsap.fromTo(footerItems,
                { opacity: 0, y: 15 },
                {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 95%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 1,
                    y: 0,
                    stagger: 0.05,
                    duration: 0.8,
                    ease: "power2.out"
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [mounted]);

    const socialLinks = [
        { icon: <Instagram strokeWidth={1.2} className="w-5 h-5" />, href: SOCIAL_LINKS.instagram, label: "Instagram" },
        { icon: <Facebook strokeWidth={1.2} className="w-5 h-5" />, href: SOCIAL_LINKS.facebook, label: "Facebook" },
        { icon: <Linkedin strokeWidth={1.2} className="w-5 h-5" />, href: SOCIAL_LINKS.linkedin, label: "LinkedIn" },
    ];

    const quickLinks = [
        { name: "Sobre Nós", href: "#sobre" },
        { name: "Serviços", href: "#servicos" },
        { name: "Depoimentos", href: "#depoimentos" },
        { name: "Contato", href: "#contato" },
    ];

    const services = [
        { name: "Implantes Dentários", href: "#" },
        { name: "Clareamento", href: "#" },
        { name: "Ortodontia", href: "#" },
        { name: "Estética Dental", href: "#" },
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer ref={sectionRef} className="bg-[#050505] border-t border-white/5 relative overflow-hidden">
            <div className="container mx-auto px-6 pt-24 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 transition-all">
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 group/logo cursor-pointer">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-[var(--color-silver-bh)] border border-white/10 group-hover/logo:border-[var(--color-silver-bh)]/50 transition-all duration-700 relative overflow-hidden light-sweep">
                                    <Sparkles strokeWidth={1.2} className="w-7 h-7 fill-white/5" />
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="title-line-inner text-base font-display font-medium tracking-tight text-white leading-tight">
                                        Clínica.
                                    </h3>
                                </div>
                            </div>
                            <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-sm font-light text-sm opacity-60 group-hover/logo:opacity-100 transition-opacity duration-700 footer-reveal-item">
                                Unindo alta performance tecnológica ao cuidado humano absoluto para resultados de excelência.
                            </p>
                            <div className="relative w-full max-w-[320px] aspect-video rounded-2xl overflow-hidden border border-white/5 mb-6 group/img">
                                <Image
                                    src="/assets/images/luxury-lounge.png"
                                    alt="Ambiente Premium"
                                    fill
                                    className="object-cover opacity-40 group-hover/img:opacity-80 group-hover/img:scale-105 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                            </div>
                            <div className="flex gap-4">
                                {socialLinks.map((social, index) => (
                                    <Magnetic key={index} strength={0.4} range={60}>
                                        <m.a
                                            href={social.href}
                                            aria-label={social.label}
                                            whileHover={{ y: -4, backgroundColor: "var(--color-silver-bh)", color: "black", borderColor: "var(--color-silver-bh)" }}
                                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[var(--color-text-secondary)] transition-all bg-white/5"
                                        >
                                            {social.icon}
                                        </m.a>
                                    </Magnetic>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="overflow-hidden mb-8">
                            <h4 className="title-line-inner text-xs font-bold uppercase tracking-[0.2em] text-white">Navegação</h4>
                        </div>
                        <ul className="space-y-4 footer-reveal-item">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-silver-bh)] transition-all text-sm font-medium flex items-center group"
                                    >
                                        <span className="w-0 group-hover:w-3 h-[1px] bg-[var(--color-silver-bh)] transition-all mr-0 group-hover:mr-2"></span>
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="lg:col-span-2">
                        <div className="overflow-hidden mb-8">
                            <h4 className="title-line-inner text-xs font-bold uppercase tracking-[0.2em] text-white">Especialidades</h4>
                        </div>
                        <ul className="space-y-4 footer-reveal-item">
                            {services.map((service, index) => (
                                <li key={index}>
                                    <a
                                        href="#servicos"
                                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-silver-bh)] transition-all text-sm font-medium flex items-center group"
                                    >
                                        <span className="w-0 group-hover:w-3 h-[1px] bg-[var(--color-silver-bh)] transition-all mr-0 group-hover:mr-2"></span>
                                        {service.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-4">
                        <div className="overflow-hidden mb-8">
                            <h4 className="title-line-inner text-xs font-bold uppercase tracking-[0.2em] text-white">Onde Estamos</h4>
                        </div>
                        <div className="space-y-6 footer-reveal-item">
                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-white/5 rounded-lg border border-white/10 group-hover:border-[var(--color-silver-bh)]/30 transition-colors">
                                    <MapPin strokeWidth={1.2} className="w-5 h-5 text-[var(--color-silver-bh)]" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-white mb-1">Unidade Central</p>
                                    <p className="text-[var(--color-text-secondary)]">Centro, Pereira Barreto - SP</p>
                                    <p className="text-[var(--color-text-secondary)]">Brasil</p>
                                </div>
                            </div>
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4 hover:border-[var(--color-silver-bh)]/30 transition-colors">
                                <a href={generateWhatsAppUrl(DEFAULT_MESSAGE)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-bold text-white hover:text-[var(--color-silver-bh)] transition-colors">
                                    <Phone strokeWidth={1.2} className="w-5 h-5 text-[var(--color-silver-bh)]" />
                                    {COMPANY_PHONE}
                                </a>
                                <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-3 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-silver-bh)] transition-colors">
                                    <Mail strokeWidth={1.2} className="w-5 h-5 text-[var(--color-silver-bh)]" />
                                    {COMPANY_EMAIL}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex flex-col items-center md:items-start gap-1">
                            <p className="text-[var(--color-text-tertiary)] text-xs">
                                © {currentYear} Clínica Odontologia. Todos os direitos reservados.
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-white/20 font-mono tracking-tighter uppercase">Build: 53e99ac5</span>
                                <button
                                    onClick={() => {
                                        if (typeof window !== 'undefined') {
                                            localStorage.clear();
                                            sessionStorage.clear();
                                            window.location.reload();
                                        }
                                    }}
                                    className="text-[10px] text-[var(--color-silver-bh)]/40 hover:text-[var(--color-silver-bh)] underline underline-offset-2 transition-colors"
                                >
                                    Atualizar Versão
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <a href="#" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-silver-bh)] transition-colors text-xs font-medium">
                                Políticas
                            </a>
                            <a href="#" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-silver-bh)] transition-colors text-xs font-medium">
                                Termos
                            </a>
                        </div>
                    </div>

                    <Magnetic strength={0.5} range={80}>
                        <m.button
                            onClick={scrollToTop}
                            whileHover={{ scale: 1.1, backgroundColor: "var(--color-silver-bh)", color: "black" }}
                            whileTap={{ scale: 0.9 }}
                            className="w-14 h-14 bg-white/5 text-white border border-white/10 rounded-full flex items-center justify-center shadow-premium-2 group"
                        >
                            <ArrowUp strokeWidth={1.2} className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                        </m.button>
                    </Magnetic>
                </div>
            </div>

            {/* Subtle Gradient Spots - Enhanced Depth */}
            <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-[var(--color-silver-bh)]/3 blur-[140px] -z-10 rounded-full pointer-events-none translate-y-[-50%]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-silver-bh)]/5 blur-[120px] -z-10 rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--color-silver-bh)]/3 blur-[100px] -z-10 rounded-full pointer-events-none" />
        </footer >
    );
}
