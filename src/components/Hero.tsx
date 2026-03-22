"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const preRef = useRef<HTMLSpanElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const copyRef = useRef<HTMLDivElement>(null);

    const framesRef = useRef<HTMLImageElement[]>([]);
    const frameObj = useRef({ index: 0 });
    const totalFrames = 177; // Premium 177-frame sequence

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        const section = sectionRef.current;
        const pre = preRef.current;
        const title = titleRef.current;
        const copy = copyRef.current;

        if (!context || !section || !pre || !title || !copy) return;

        const ctx = gsap.context(() => {
            // ─── FRAME LOADING SYSTEM ──────────────────────────────────────
            let loadedCount = 0;
            const preloadFrames = () => {
                for (let i = 0; i < totalFrames; i++) {
                    const img = new Image();
                    img.src = `/assets/premium-hero-frames/frame_${i.toString().padStart(3, '0')}_delay-0.041s.png`;
                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount === totalFrames) onAssetsReady();
                    };
                    img.onerror = () => {
                        loadedCount++;
                        if (loadedCount === totalFrames) onAssetsReady();
                    };
                    framesRef.current[i] = img;
                }
            };

            const renderFrame = (index: number) => {
                const img = framesRef.current[Math.floor(index)];
                if (img && (img.complete || img.naturalWidth > 0)) {
                    const { width, height } = canvas;
                    const imgRatio = img.width / img.height;
                    const canvasRatio = width / height;
                    let drawWidth, drawHeight, offsetX, offsetY;

                    if (imgRatio > canvasRatio) {
                        drawHeight = height; drawWidth = height * imgRatio;
                        offsetX = (width - drawWidth) / 2; offsetY = 0;
                    } else {
                        drawWidth = width; drawHeight = width / imgRatio;
                        offsetX = 0; offsetY = (height - drawHeight) / 2;
                    }

                    context.clearRect(0, 0, width, height);
                    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                }
            };

            const handleResize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                renderFrame(frameObj.current.index);
            };

            // ─── MASTER SCROLL TIMELINE ───────────────────────────────────
            const initScroll = () => {
                const tlScroll = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: "+=300vh",
                        scrub: 1.5,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                        refreshPriority: 1,
                    }
                });

                // 1. Frame Scrubbing (Skull to Smile)
                tlScroll.to(frameObj.current, {
                    index: totalFrames - 1,
                    ease: "none",
                    onUpdate: () => renderFrame(frameObj.current.index)
                }, 0);

                // 2. Text Parallax & Sweep
                tlScroll.to(copy, {
                    y: -150,
                    opacity: 0,
                    ease: "power2.inOut"
                }, 0.5); // Starts exit transition halfway through scroll

                // 3. Canvas Depth Scale
                tlScroll.to(canvas, {
                    scale: 1.1,
                    ease: "none"
                }, 0);
            };

            // ─── ENTRY ANIMATION ──────────────────────────────────────────
            const startAnimations = () => {
                const tlEntry = gsap.timeline({ 
                    onComplete: initScroll,
                    defaults: { ease: "power3.out" }
                });
                
                // Initial State
                gsap.set(pre, { opacity: 0, y: 30 });
                gsap.set(title, { opacity: 0, y: 40 });
                gsap.set(canvas, { scale: 1.05, opacity: 0 });

                // 1. Fade-in Canvas
                tlEntry.to(canvas, { opacity: 1, scale: 1.0, duration: 2 });

                // 2. Reveal "Sua origem" (Cinematic Reveal)
                tlEntry.to(pre, { opacity: 1, y: 0, duration: 1.8 }, "-=1.5");
                
                // 3. Full Premium Sequence (Skull to Smile - 177 Frames)
                tlEntry.to(frameObj.current, { 
                    index: totalFrames - 1, 
                    duration: 4.5, 
                    ease: "power2.inOut",
                    onUpdate: () => renderFrame(frameObj.current.index)
                }, "-=1.2");
                
                // 4. Elegant fade-out of "Sua origem" & Reveal "Seu sorriso"
                tlEntry.to(pre, { opacity: 0, y: -20, duration: 1.5 }, "-=3.0");
                tlEntry.to(title, { opacity: 1, y: 0, duration: 2.2 }, "-=2.2");
            };

            const onAssetsReady = () => {
                renderFrame(0);
                startAnimations();
            };

            preloadFrames();
            window.addEventListener("resize", handleResize);
            handleResize();

            return () => {
                window.removeEventListener("resize", handleResize);
            };
        });

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="hero">
            <style jsx>{`
                .hero {
                    position: relative;
                    width: 100%;
                    height: 300vh;
                    background: #000;
                    overflow: visible;
                }
                .heroVisual {
                    position: sticky;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .heroCanvas {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    /* Filtro balanceado para profundidade premium */
                    filter: brightness(0.95) contrast(1.1) saturate(1.1);
                    z-index: 1;
                    will-change: transform, opacity;
                }
                .heroCopy {
                    position: fixed;
                    left: 8%;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 10;
                    width: min(820px, 90vw);
                    pointer-events: none;
                }
                .heroPre {
                    display: block;
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(14px, 1.2vw, 18px);
                    font-weight: 400;
                    font-style: italic;
                    letter-spacing: 0.35em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.65);
                    margin-bottom: 1.5rem;
                }
                .heroTitle {
                    font-family: 'Outfit', sans-serif;
                    font-size: clamp(45px, 8vw, 110px);
                    font-weight: 700;
                    line-height: 0.95;
                    letter-spacing: -0.01em;
                    text-transform: uppercase;
                    color: #ffffff;
                    margin: 0;
                    filter: drop-shadow(0 10px 40px rgba(0, 0, 0, 0.4));
                }
                @media (max-width: 768px) {
                    .heroCopy {
                        left: 5%;
                        width: 90%;
                        text-align: center;
                    }
                    .heroTitle {
                        letter-spacing: -0.02em;
                    }
                }
            `}</style>

            <div className="heroVisual">
                <canvas ref={canvasRef} className="heroCanvas" />
            </div>

            <div ref={copyRef} className="heroCopy">
                <span ref={preRef} className="heroPre">Sua origem</span>
                <h1 ref={titleRef} className="heroTitle">Seu sorriso</h1>
            </div>
        </section>
    );
}
