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
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
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
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                    transform: scale(0.85);
                }

                .hero-overlay { 
                    position: absolute; 
                    inset: 0; 
                    /* Deep vignette to enhance perspective and blend the scaled, feathered video */
                    background: radial-gradient(
                        circle at center,
                        rgba(0,0,0,0) 0%,
                        rgba(0,0,0,0.3) 50%,
                        rgba(0,0,0,0.9) 100%
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
                    max-width: 320px;
                    height: 48px; 
                    background: linear-gradient(180deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.95) 100%); 
                    color: #FBFBFB; 
                    /* Pill shape */
                    border-radius: 9999px; 
                    font-weight: 500; 
                    font-size: 13px; 
                    letter-spacing: 1.2px; 
                    text-transform: uppercase; 
                    display: inline-flex; 
                    align-items: center; 
                    justify-content: center; 
                    border: 1px solid rgba(255,255,255,0.15); 
                    border-top: 1px solid rgba(255,255,255,0.3); 
                    box-shadow: 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
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

                .cta-primary:hover::before {
                    left: 150%;
                }

                .cta-primary:hover {
                    background: linear-gradient(180deg, rgba(30,30,30,0.95) 0%, rgba(15,15,15,0.95) 100%);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2);
                    border-color: rgba(255,255,255,0.25);
                    border-top-color: rgba(255,255,255,0.4);
                    transform: translateY(-2px);
                }

                .cta-primary:active {
                    transform: translateY(1px);
                    box-shadow: 0 2px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
                }

                .cta-primary.is-sticky { 
                    position: fixed !important; 
                    bottom: 24px; 
                    left: 20px; 
                    width: calc(100% - 40px); 
                    max-width: none;
                    z-index: 9999; 
                    box-shadow: 0 15px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1);
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
