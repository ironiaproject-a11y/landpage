"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 192;

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    // Animation state
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const airbnbRef = useRef({ frame: 0 });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !canvasRef.current || !sectionRef.current || !containerRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        // Configuration
        const currentFrame = (index: number) =>
            `/para_vc/frame_${index.toString().padStart(3, '0')}_delay-0.041s.png`;

        const render = () => {
            const img = imagesRef.current[airbnbRef.current.frame];
            if (!img || !img.complete) return;

            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const imgWidth = img.width;
            const imgHeight = img.height;

            // Draw logic: Ensure the image covers its internal canvas area
            const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);

            const newWidth = imgWidth * ratio;
            const newHeight = imgHeight * ratio;
            const x = (canvasWidth - newWidth) / 2;
            const y = (canvasHeight - newHeight) / 2;

            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.drawImage(img, x, y, newWidth, newHeight);
        };

        // Preload images
        const preloadImages = () => {
            for (let i = 0; i < FRAME_COUNT; i++) {
                const img = new Image();
                img.onload = () => {
                    if (i === 0) {
                        render();
                        // Signal Preloader that Hero is ready
                        window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
                    }
                };
                img.src = currentFrame(i);
                imagesRef.current.push(img);
            }
        };

        preloadImages();

        if (imagesRef.current[0]?.complete) {
            render();
            window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
        }

        const updateSize = () => {
            // Set canvas size to 115% of window to allow scale(0.92) without borders
            canvas.width = window.innerWidth * 1.15;
            canvas.height = window.innerHeight * 1.15;
            render();
        };

        window.addEventListener("resize", updateSize);
        updateSize();

        // GSAP Scroll Animation
        const ctx = gsap.context(() => {
            gsap.to(airbnbRef.current, {
                frame: FRAME_COUNT - 1,
                snap: "frame",
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=200%",
                    pin: true,
                    scrub: 0.05,
                    anticipatePin: 1
                },
                onUpdate: render,
            });

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "10% top",
                onEnter: () => document.querySelector('.cta-primary')?.classList.add('is-sticky'),
                onLeaveBack: () => document.querySelector('.cta-primary')?.classList.remove('is-sticky')
            });
        }, sectionRef);

        return () => {
            ctx.revert();
            window.removeEventListener("resize", updateSize);
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <>
            <style>{`
                .hero { 
                    position: relative; 
                    height: 100vh; 
                    width: 100vw; 
                    background: #000; 
                    overflow: visible; 
                    margin: 0;
                    padding: 0;
                    perspective: 2000px;
                }

                .hero-inner-container {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .hero-canvas {
                    position: absolute;
                    /* Expanded to 115% and centered to hide gaps at 0.92 scale */
                    top: -7.5%;
                    left: -7.5%;
                    width: 115%;
                    height: 115%;
                    display: block;
                    z-index: 1;
                    /* Visual balance: 0.92 scale + subtle tilt */
                    transform: scale(0.92);
                    transform-origin: center center;
                    filter: brightness(0.85) contrast(1.1);
                    transition: transform 1.2s cubic-bezier(0.23, 1, 0.32, 1);
                }

                .hero-overlay { 
                    position: absolute; 
                    inset: 0; 
                    background: radial-gradient(
                        circle at center,
                        rgba(0,0,0,0) 0%,
                        rgba(0,0,0,0.15) 40%,
                        rgba(0,0,0,0.7) 100%
                    ); 
                    z-index: 2; 
                    pointer-events: none; 
                }

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
                    font-size: 38px; 
                    font-weight: 600; 
                    line-height: 1.1; 
                    letter-spacing: -0.02em; 
                    color: #FBFBFB; 
                    margin: 0; 
                    max-width: 440px;
                    margin: 0 auto;
                    text-shadow: 0 4px 30px rgba(0,0,0,0.5);
                }

                .hero-subtitle { 
                    font-size: 16px; 
                    font-weight: 400;
                    color: #FBFBFB;
                    opacity: 0.8; 
                    margin-top: 12px; 
                }

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
                    margin-top: 18px; 
                    text-decoration: none; 
                    font-weight: 400;
                }
            `}</style>

            <section ref={sectionRef} className="hero">
                <div ref={containerRef} className="hero-inner-container">
                    <canvas
                        ref={canvasRef}
                        className="hero-canvas"
                    />

                    <div className="hero-overlay"></div>

                    <div className="hero-text-layer">
                        <h1 className="hero-title">Volte a sorrir com confiança.</h1>
                        <p className="hero-subtitle">Segurança clínica. Resultado natural.</p>
                    </div>

                    <div className="hero-cta-layer">
                        <button className="cta-primary">
                            Agendar Consulta
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
