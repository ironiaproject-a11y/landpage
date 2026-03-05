"use client";

import { useEffect, useState } from "react";

export function Hero() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <section className="hero">
            <video
                className="hero-mouth"
                autoPlay
                muted
                loop
                playsInline
                poster="/para_vc/frame_000_delay-0.041s.png"
            >
                <source src="/luxury-hero/mp4_1080_variantA.mp4" type="video/mp4" />
                <source src="/luxury-hero/webm_1080_variantA.webm" type="video/webm" />
            </video>

            <div className="hero-overlay"></div>

            <div className="hero-content">
                <h1 className="hero-title">Volte a sorrir com confiança.</h1>
                <p className="hero-subtitle">Segurança clínica. Resultado natural.</p>

                <div className="hero-actions">
                    <button className="cta-primary">
                        AGENDAR CONSULTA
                    </button>
                    <a href="#results" className="cta-secondary-link">
                        Galeria de Resultados
                    </a>
                </div>
            </div>
        </section>
    );
}
