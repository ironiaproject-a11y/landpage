"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const textLayerRef = useRef<HTMLDivElement>(null);
    const ctaLayerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !videoRef.current || !sectionRef.current) return;

        const video = videoRef.current;

        // Signal Preloader that Hero is ready when video can play
        const handleCanPlay = () => {
            window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
        };

        if (video.readyState >= 3) {
            handleCanPlay();
        } else {
            video.addEventListener("canplaythrough", handleCanPlay, { once: true });
        }

        // GSAP Scroll Animation - Subtle cinematic zoom
        const ctx = gsap.context(() => {
            gsap.fromTo(video,
                { scale: 1.0 },
                {
                    scale: 1.05,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                    },
                }
            );

            // Sticky CTA logic
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "40% top",
                onEnter: () => document.querySelector('.cta-primary')?.classList.add('is-sticky'),
                onLeaveBack: () => document.querySelector('.cta-primary')?.classList.remove('is-sticky')
            });
        }, sectionRef);

        return () => {
            ctx.revert();
            video.removeEventListener("canplaythrough", handleCanPlay);
        };
    }, [mounted]);

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

                .hero-video-bg {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                    z-index: 1;
                    display: block;
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
                    pointer-events: none;
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
                {/* Layer 1: Background Video */}
                <video
                    ref={videoRef}
                    className="hero-video-bg"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/assets/images/clinic-interior.png"
                >
                    <source src="/hero-background.mp4" type="video/mp4" />
                </video>

                <div className="hero-overlay"></div>

                {/* Layer 2: Text */}
                <div ref={textLayerRef} className="hero-text-layer">
                    <h1 className="hero-title">Volte a sorrir com confiança.</h1>
                    <p className="hero-subtitle">Segurança clínica. Resultado natural.</p>
                </div>

                {/* Layer 3: Buttons */}
                <div ref={ctaLayerRef} className="hero-cta-layer">
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
