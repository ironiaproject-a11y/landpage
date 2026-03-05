"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const mouthRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const ctx = gsap.context(() => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                // Layer 1 - Mouth (Medium Parallax: 0.6 speed)
                gsap.to(mouthRef.current, {
                    y: -150,
                    scale: 1.03,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    }
                });

                // Layer 2 - Text (Slow Parallax: 0.2 speed)
                gsap.to(textRef.current, {
                    y: -50,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    }
                });

                // Layer 3 - Buttons (Normal scroll: 1.0 speed)
                // No specific GSAP transform needed as it follows normal flow

                // Sticky CTA logic (at 40%)
                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: "40% top",
                    onEnter: () => document.querySelector('.cta-primary')?.classList.add('is-sticky'),
                    onLeaveBack: () => document.querySelector('.cta-primary')?.classList.remove('is-sticky')
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    if (!mounted) return null;

    return (
        <>
            <style>{`
                .hero { 
                    position: relative; 
                    height: 100vh; 
                    width: 100%; 
                    background: #000; 
                    overflow: hidden; 
                    margin: 0;
                    padding: 0;
                }

                /* Layer 1 - Mouth */
                .hero-mouth-container { 
                    position: absolute; 
                    top: 50%; 
                    left: 50%; 
                    transform: translate(-50%, -50%); 
                    width: 100%;
                    height: 70vh; 
                    z-index: 1; 
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none;
                }

                .hero-mouth-video {
                    height: 100%;
                    width: auto;
                    object-fit: cover;
                    will-change: transform;
                }

                .hero-overlay { 
                    position: absolute; 
                    inset: 0; 
                    background: linear-gradient(
                        to bottom,
                        rgba(0,0,0,0.65) 0%,
                        rgba(0,0,0,0.45) 40%,
                        rgba(0,0,0,0.25) 70%
                    ); 
                    z-index: 2; 
                    pointer-events: none; 
                }

                /* Layer 2 - Text Content */
                .hero-text-layer { 
                    position: absolute; 
                    top: 32%; 
                    left: 0;
                    width: 100%;
                    z-index: 3; 
                    text-align: center; 
                    padding: 0 20px;
                    will-change: transform;
                }

                .hero-title { 
                    font-size: 36px; 
                    font-weight: 600; 
                    line-height: 1.1; 
                    letter-spacing: -0.02em; 
                    color: #FBFBFB; 
                    margin: 0; 
                    max-width: 420px;
                    margin: 0 auto;
                }

                .hero-subtitle { 
                    font-size: 16px; 
                    font-weight: 400;
                    color: #FBFBFB;
                    opacity: 0.8; 
                    margin-top: 10px; 
                }

                /* Layer 3 - CTA Buttons */
                .hero-cta-layer {
                    position: absolute;
                    bottom: 22%;
                    left: 0;
                    width: 100%;
                    z-index: 4;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 0 20px;
                }

                .cta-primary { 
                    width: 100%; 
                    max-width: 420px;
                    height: 50px; 
                    background: #0B0B0B; 
                    color: #FBFBFB; 
                    border-radius: 8px; 
                    font-weight: 600; 
                    font-size: 16px; 
                    letter-spacing: 1px; 
                    text-transform: uppercase; 
                    display: inline-flex; 
                    align-items: center; 
                    justify-content: center; 
                    border: 1px solid rgba(255,255,255,0.1); 
                    cursor: pointer; 
                }

                .cta-primary.is-sticky { 
                    position: fixed !important; 
                    bottom: 20px; 
                    left: 20px; 
                    width: calc(100% - 40px); 
                    max-width: none;
                    z-index: 9999; 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }

                .cta-secondary-link { 
                    display: inline-block; 
                    font-size: 14px; 
                    color: #FBFBFB;
                    opacity: 0.75; 
                    margin-top: 16px; 
                    text-decoration: none; 
                    font-weight: 400;
                }
            `}</style>

            <section ref={sectionRef} className="hero">
                {/* Layer 1: Mouth */}
                <div ref={mouthRef} className="hero-mouth-container">
                    <video
                        className="hero-mouth-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster="/para_vc/frame_000_delay-0.041s.png"
                    >
                        <source src="/luxury-hero/mp4_1080_variantA.mp4" type="video/mp4" />
                        <source src="/luxury-hero/webm_1080_variantA.webm" type="video/webm" />
                    </video>
                </div>

                <div className="hero-overlay"></div>

                {/* Layer 2: Text */}
                <div ref={textRef} className="hero-text-layer">
                    <h1 className="hero-title">Volte a sorrir com confiança.</h1>
                    <p className="hero-subtitle">Segurança clínica. Resultado natural.</p>
                </div>

                {/* Layer 3: Buttons */}
                <div ref={buttonsRef} className="hero-cta-layer">
                    <button className="cta-primary">
                        Agendar Consulta
                    </button>
                    <a href="#results" className="cta-secondary-link">
                        ver galeria de resultados →
                    </a>
                </div>
            </section>
        </>
    );
}
