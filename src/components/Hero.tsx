"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const mouthRef = useRef<HTMLVideoElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const ctx = gsap.context(() => {
            // SCROLL CONTROLLED PARALLAX (Only interaction)
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

                // Mouth: Scale 1.03 on scroll
                gsap.to(mouthRef.current, {
                    scale: 1.03,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    }
                });

                // Text Content: Move up 60px
                gsap.to(contentRef.current, {
                    y: -60,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    }
                });

                // Sticky CTA (at 40%)
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
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .hero-mouth { 
                    position: absolute; 
                    top: 50%; 
                    left: 50%; 
                    transform: translate(-50%, -50%); 
                    height: 70vh; 
                    width: auto; 
                    z-index: 1; 
                    object-fit: cover; 
                    pointer-events: none;
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

                .hero-content { 
                    position: relative; 
                    z-index: 3; 
                    max-width: 420px; 
                    width: 100%;
                    text-align: center; 
                    padding: 0 20px;
                    margin: auto;
                    will-change: transform;
                }

                .hero-title { 
                    font-size: 34px; 
                    font-weight: 600; 
                    line-height: 1.1; 
                    letter-spacing: -0.02em; 
                    color: #FBFBFB; 
                    margin: 0; 
                }

                .hero-subtitle { 
                    font-size: 16px; 
                    font-weight: 400;
                    color: #FBFBFB;
                    opacity: 0.8; 
                    margin-top: 10px; 
                }

                .cta-actions {
                    margin-top: 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                }

                .cta-primary { 
                    width: 100%; 
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
                    transition: transform 0.3s ease;
                }

                .cta-primary.is-sticky { 
                    position: fixed !important; 
                    bottom: 20px; 
                    left: 20px; 
                    width: calc(100% - 40px); 
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
                    transition: opacity 0.3s ease;
                }
                .cta-secondary-link:hover { opacity: 1; }
            `}</style>

            <section ref={sectionRef} className="hero">
                <video
                    ref={mouthRef}
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

                <div ref={contentRef} className="hero-content">
                    <h1 className="hero-title">Volte a sorrir com confiança.</h1>
                    <p className="hero-subtitle">Segurança clínica. Resultado natural.</p>

                    <div className="cta-actions">
                        <button className="cta-primary">
                            AGENDAR CONSULTA
                        </button>
                        <a href="#results" className="cta-secondary-link">
                            ver galeria de resultados →
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
