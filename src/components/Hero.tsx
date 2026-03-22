"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const preRef = useRef<HTMLParagraphElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    
    const framesRef = useRef<HTMLImageElement[]>([]);
    const frameObj = useRef({ index: 0 });
    const totalFrames = 145;

    useEffect(() => {
        if (!sectionRef.current || !canvasRef.current || !preRef.current || !titleRef.current) return;

        const section = sectionRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const pre = preRef.current;
        const title = titleRef.current;

        if (!context) return;

        const ctx = gsap.context(() => {
            // ─── FRAME LOADING SYSTEM ──────────────────────────────────────
            let loadedCount = 0;
            const preloadFrames = () => {
                for (let i = 0; i < totalFrames; i++) {
                    const img = new Image();
                    img.src = `/hero-frames/frame_${i.toString().padStart(3, '0')}_delay-0.041s.png`;
                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount === totalFrames) {
                            onAssetsReady();
                        }
                    };
                    img.onerror = () => {
                        loadedCount++; // Count even if error to avoid blocking forever
                        if (loadedCount === totalFrames) {
                            onAssetsReady();
                        }
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
                        drawHeight = height;
                        drawWidth = height * imgRatio;
                        offsetX = (width - drawWidth) / 2;
                        offsetY = 0;
                    } else {
                        drawWidth = width;
                        drawHeight = width / imgRatio;
                        offsetX = 0;
                        offsetY = (height - drawHeight) / 2;
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

            // ─── SCROLL ANIMATION ──────────────────────────────────────────
            const initScroll = () => {
                gsap.to(frameObj.current, {
                    index: totalFrames - 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: "+=300vh",
                        scrub: 2,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                        refreshPriority: 1,
                        onUpdate: (self) => {
                            // Backup update for extremely fast scrolls
                            renderFrame(frameObj.current.index);
                        }
                    },
                    onUpdate: () => renderFrame(frameObj.current.index)
                });
            };

            // ─── ENTRY ANIMATION ──────────────────────────────────────────
            const startAnimations = () => {
                const tl = gsap.timeline({ 
                    onComplete: initScroll,
                    defaults: { ease: "power3.out" }
                });
                
                // Reset state
                gsap.set(pre, { opacity: 0, y: 20 });
                gsap.set(title, { opacity: 0, y: 20 });

                // 1. Reveal "Sua origem" (Cinematic Fade)
                tl.to(pre, { opacity: 1, y: 0, duration: 1.5 }, "+=0.3");
                
                // 2. Full Frame Transformation (Skull to Smile - Complete Index 144)
                tl.to(frameObj.current, { 
                    index: totalFrames - 1, 
                    duration: 3.5, 
                    ease: "power2.inOut",
                    onUpdate: () => renderFrame(frameObj.current.index)
                }, "-=0.8");
                
                // 3. Elegant transition for "Sua origem"
                tl.to(pre, { opacity: 0, y: -15, duration: 1.2, ease: "power2.in" }, "-=2.2");
                
                // 4. Powerful reveal of "Seu sorriso"
                tl.to(title, { opacity: 1, y: 0, duration: 2, ease: "expo.out" }, "-=1.5");
            };

            const onAssetsReady = () => {
                renderFrame(0);
                startAnimations();
                window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
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
                    min-height: 100svh;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    background: #000;
                    width: 100%;
                }

                .heroVisual {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                }

                .heroCanvas {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    /* Refined brightness/contrast balance */
                    filter: brightness(0.95) contrast(1.1) saturate(1.1);
                    display: block;
                    will-change: filter;
                }

                .heroCopy {
                    position: relative;
                    z-index: 10;
                    width: min(820px, 90vw);
                    margin-left: 8%;
                    transform: translateY(-4vh);
                    pointer-events: none;
                    /* Editorial shadow for readability */
                    text-shadow: 0 10px 40px rgba(0,0,0,0.4);
                }

                .heroPre {
                    display: block;
                    margin: 0 0 1.2rem 0;
                    font-family: 'Playfair Display', serif;
                    font-style: italic;
                    letter-spacing: 0.35em;
                    text-transform: uppercase;
                    font-size: clamp(0.9rem, 1.4vw, 1.1rem);
                    color: rgba(255, 255, 255, 0.75);
                    opacity: 0;
                }

                .heroTitle {
                    margin: 0;
                    font-family: 'Inter', sans-serif;
                    font-weight: 900;
                    font-style: normal;
                    text-transform: uppercase;
                    color: #ffffff;
                    font-size: clamp(3.2rem, 10vw, 6rem);
                    line-height: 1.05;
                    letter-spacing: -0.02em;
                    opacity: 0;
                }

                @media (max-width: 768px) {
                    .heroCopy {
                        width: min(340px, 88vw);
                        margin-left: 6vw;
                        transform: translateY(-2vh);
                    }
                    .heroTitle {
                        font-size: clamp(2.8rem, 12vw, 3.5rem);
                    }
                }
            `}</style>

            <div className="heroVisual">
                <canvas ref={canvasRef} className="heroCanvas" />
            </div>

            <div className="heroCopy">
                <span ref={preRef} className="heroPre">Sua origem</span>
                <h1 ref={titleRef} className="heroTitle">Seu sorriso</h1>
            </div>
        </section>
    );
}

