"use client";

import React, { useEffect } from "react";

export function Hero() {
    useEffect(() => {
        // Signal preloader that hero logic is mounted and ready
        // We do this immediately to prevent hang, but video will load in background
        const signalLoaded = () => {
            window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
            (window as any).__HERO_ASSETS_LOADED__ = true;
        };

        // Delay slightly to allow initial animation frames
        const timer = setTimeout(signalLoaded, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="hero">
            <style>{`
                .hero {
                    position: relative;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    background: #000;
                    padding-left: 6vw;
                }

                /* VIDEO */
                .hero-video {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    filter: brightness(0.6) contrast(1.1);
                    z-index: 0;
                    pointer-events: none;
                }

                /* DARK OVERLAY */
                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.6);
                    z-index: 1;
                    pointer-events: none;
                }

                /* TEXT CONTAINER */
                .hero-content {
                    position: relative;
                    z-index: 2;
                    max-width: none;
                }

                /* SMALL TEXT */
                .hero-pre {
                    font-family: 'Source Serif 4', serif;
                    font-size: clamp(18px, 2vw, 28px);
                    font-weight: 400;
                    color: rgba(255,255,255,0.6);
                    margin-bottom: 60px;
                }

                /* MAIN TITLE */
                .hero-title {
                    font-family: 'Source Serif 4', serif;
                    font-size: clamp(90px, 13vw, 160px);
                    font-weight: 400;
                    line-height: 1.05;
                    letter-spacing: -0.03em;
                    color: #FFFFFF;
                }

                /* ANIMATION */
                .hero-pre {
                    opacity: 0;
                    transform: translateY(40px);
                    animation: fadeUp 1s ease forwards;
                }

                .hero-title {
                    opacity: 0;
                    transform: translateY(100px) scale(0.9);
                    animation: fadeUpBig 1.2s ease forwards;
                    animation-delay: 0.3s;
                }

                @keyframes fadeUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeUpBig {
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @media (max-width: 768px) {
                    .hero {
                        padding-left: 20px;
                    }
                }
            `}</style>

            <video 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="hero-video"
                preload="auto"
            >
                <source src="/hero-background.mp4" type="video/mp4" />
                <source src="/luxury-hero/mp4_1080_variantA.mp4" type="video/mp4" />
            </video>

            <div className="hero-overlay"></div>

            <div className="hero-content">
                <p className="hero-pre">Sua origem</p>
                <h1 className="hero-title">Seu sorriso</h1>
            </div>
        </section>
    );
}
