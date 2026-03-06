"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 177;

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const titleTopRef = useRef<HTMLHeadingElement>(null);
    const titleBottomRef = useRef<HTMLHeadingElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);
    const progressLineRef = useRef<HTMLDivElement>(null);
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
            `/assets/premium-hero-frames/frame_${index.toString().padStart(3, '0')}_delay-0.041s.png`;

        const render = () => {
            const img = imagesRef.current[airbnbRef.current.frame];
            if (!img || !img.complete) return;

            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const imgWidth = img.width;
            const imgHeight = img.height;

            // Draw logic: object-fit: cover with object-position: center 20%
            const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);

            const newWidth = imgWidth * ratio;
            const newHeight = imgHeight * ratio;

            // center horizontal
            const x = (canvasWidth - newWidth) / 2;
            // 40% vertical position (optimizes framing for 70vh)
            const y = (canvasHeight - newHeight) * 0.4;

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
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
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

            // Immersive Zoom
            gsap.to(canvasRef.current, {
                scale: 1.1,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=200%",
                    scrub: true
                }
            });

            // Narrative Flow: Part 1 - Top Headline Evaporation
            gsap.to(titleTopRef.current, {
                opacity: 0,
                y: -50,
                filter: "blur(12px)",
                letterSpacing: "0.2em",
                scale: 1.1,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "30% top",
                    scrub: true
                }
            });

            // Narrative Flow: Part 2 - Bottom Headline Entry
            gsap.fromTo(titleBottomRef.current,
                { opacity: 0, y: 50, scale: 0.95, filter: "blur(10px)" },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "50% top",
                        end: "80% top",
                        scrub: true
                    }
                }
            );

            // Narrative Flow: Part 3 - Button Entry
            gsap.fromTo(ctaRef.current,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "75% top",
                        end: "95% top",
                        scrub: true
                    }
                }
            );

            // Scroll Indicators
            gsap.to(scrollIndicatorRef.current, {
                opacity: 0,
                y: 20,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "10% top",
                    scrub: true
                }
            });

            gsap.to(progressLineRef.current, {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=200%",
                    scrub: true
                }
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
                    background: transparent; 
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
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100vw;
                    height: 70vh;
                    mix-blend-mode: screen;
                    overflow: hidden;
                    /* Seamless blending via mask */
                    -webkit-mask-image: linear-gradient(to bottom, 
                        transparent 0%, 
                        black 10%, 
                        black 90%, 
                        transparent 100%
                    );
                    mask-image: linear-gradient(to bottom, 
                        transparent 0%, 
                        black 10%, 
                        black 90%, 
                        transparent 100%
                    );
                }

                .hero-bottom-mask {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 30vh;
                    background: linear-gradient(to top, #000 0%, transparent 100%);
                    z-index: 2;
                    pointer-events: none;
                }

                .hero-text-layer { 
                    position: absolute; 
                    inset: 0;
                    width: 100%;
                    z-index: 3; 
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                    padding: 8vh 20px 12vh;
                    pointer-events: none;
                }

                .hero-title-top { 
                    font-size: 24px; 
                    font-weight: 300; 
                    line-height: 1.2; 
                    letter-spacing: 0.1em; 
                    text-transform: uppercase;
                    color: #FBFBFB; 
                    opacity: 0.8;
                    margin: 0; 
                    text-shadow: 0 4px 20px rgba(0,0,0,0.3);
                }

                .hero-title-bottom { 
                    font-size: 48px; 
                    font-weight: 700; 
                    line-height: 1.0; 
                    letter-spacing: -0.02em; 
                    color: #FBFBFB; 
                    margin: 20px 0; 
                    max-width: 600px;
                    text-shadow: 0 10px 40px rgba(0,0,0,0.6);
                }

                .hero-cta-layer {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
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
                    pointer-events: auto;
                }

                .hero-scroll-indicator {
                    position: absolute;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    opacity: 0.6;
                    z-index: 5;
                    pointer-events: none;
                }

                .scroll-line {
                    width: 1px;
                    height: 60px;
                    background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent);
                }

                .hero-progress-container {
                    position: absolute;
                    right: 40px;
                    top: 50%;
                    transform: translateY(-50%);
                    height: 200px;
                    width: 1px;
                    background: rgba(255,255,255,0.1);
                    z-index: 5;
                }

                .hero-progress-fill {
                    width: 100%;
                    height: 100%;
                    background: #FBFBFB;
                    transform-origin: top;
                    transform: scaleY(0);
                }

                @media (max-width: 768px) {
                    .hero-title-top {
                        font-size: 18px;
                    }
                    .hero-title-bottom {
                        font-size: 36px;
                        margin: 15px 0;
                    }
                    .hero-text-layer {
                        padding: 10vh 20px;
                    }
                    .hero-progress-container {
                        right: 20px;
                    }
                }
            `}</style>

            <section ref={sectionRef} className="hero">
                <div ref={containerRef} className="hero-inner-container">
                    <canvas
                        ref={canvasRef}
                        className="hero-canvas"
                    />

                    <div className="hero-bottom-mask" />

                    <div className="hero-text-layer">
                        <h2 ref={titleTopRef} className="hero-title-top">Transforme seu sorriso</h2>

                        <div className="hero-cta-layer">
                            <h1 ref={titleBottomRef} className="hero-title-bottom">Transforme sua vida</h1>

                            <div ref={ctaRef} style={{ pointerEvents: 'auto' }}>
                                <button className="cta-primary">
                                    Agendar Consulta
                                </button>
                                <div className="text-center">
                                    <a href="#results" className="cta-secondary-link">
                                        ver galeria de resultados →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div ref={scrollIndicatorRef} className="hero-scroll-indicator">
                        <div className="scroll-line" />
                    </div>

                    <div className="hero-progress-container">
                        <div ref={progressLineRef} className="hero-progress-fill" />
                    </div>
                </div>
            </section>
        </>
    );
}
