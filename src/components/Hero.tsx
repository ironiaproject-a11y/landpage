// Updated: 2026-03-10 - Simplified Video Overlay Hero
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <section ref={sectionRef} className="hero relative overflow-hidden min-h-[90vh]">
            <style>{`
                .hero {
                    position: relative;
                    width: 100%;
                    background: #000;
                }

                .cinematic-title {
                    font-family: inherit;
                    font-weight: 800;
                    font-size: clamp(28px, 6vw, 56px);
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: clamp(10px, 2vw, 30px);
                    text-shadow: 0 10px 40px rgba(0,0,0,0.6);
                    margin: 0;
                }

                .bracket {
                    font-weight: 200;
                    color: rgba(255,255,255,0.4);
                    font-size: 1.2em;
                    transform: translateY(-2px);
                }

                .cta-primary {
                    width: 100%;
                    min-width: 280px;
                    max-width: 320px;
                    height: 52px;
                    background: linear-gradient(180deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.95) 100%);
                    color: #FBFBFB;
                    border-radius: 9999px;
                    font-weight: 500;
                    font-size: 13px;
                    letter-spacing: 1.4px;
                    text-transform: uppercase;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(255,255,255,0.15);
                    border-top: 1px solid rgba(255,255,255,0.3);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
                    backdrop-filter: blur(12px);
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                    position: relative;
                    overflow: hidden;
                }

                .cta-primary::before {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%;
                    width: 50%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    transform: skewX(-20deg);
                    transition: all 0.6s ease;
                }
                .cta-primary:hover::before { left: 150%; }

                .cta-primary:hover {
                    background: linear-gradient(180deg, rgba(30,30,30,0.95) 0%, rgba(15,15,15,0.95) 100%);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.2);
                    border-color: rgba(255,255,255,0.25);
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .cinematic-title { font-size: clamp(20px, 6vw, 32px); }
                }
            `}</style>

            <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
            >
                <source src="/hero-background.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 z-[1] bg-black/40 pointer-events-none" />

            <div className="absolute inset-0 flex items-center justify-center z-10 text-center px-6">
                <div className="max-w-xl flex flex-col items-center justify-center gap-6">
                    <h1 className="cinematic-title">
                        <span className="bracket">[</span>
                        <span>Sua origem</span>
                        <span className="bracket">]</span>
                    </h1>

                    <p className="text-lg md:text-2xl opacity-90 mt-2 text-white">
                        <span className="bracket">[</span>
                        <span>Seu sorriso</span>
                        <span className="bracket">]</span>
                    </p>
                    
                    <div className="mt-8 pointer-events-auto">
                        <button className="cta-primary">
                            Agendar Consulta
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
