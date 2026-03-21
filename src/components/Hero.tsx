"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imagesReady, setImagesReady] = useState(false);
    
    // Configuration for the image sequence
    // The user mentioned a folder "aqui" which likely refers to "para_vc" (for you)
    const frameCount = 192; 
    const currentFrame = (index: number) => 
        `/para_vc/frame_${index.toString().padStart(3, '0')}_delay-0.041s.png`;

    useEffect(() => {
        if (!canvasRef.current || !sectionRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const section = sectionRef.current;

        // Set high-quality canvas dimensions
        canvas.width = 1920;
        canvas.height = 1080;

        const images: HTMLImageElement[] = [];
        const airbnb = { frame: 0 };

        // Preload images
        let loadedCount = 0;
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    setImagesReady(true);
                    render();
                }
            };
            images.push(img);
        }

        const render = () => {
            if (context && images[airbnb.frame]) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(images[airbnb.frame], 0, 0, canvas.width, canvas.height);
            }
        };

        const ctx = gsap.context(() => {
            // Scroll Animation for Canvas
            gsap.to(airbnb, {
                frame: frameCount - 1,
                snap: "frame",
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "+=300vh",
                    scrub: 1.2,
                    pin: true,
                    anticipatePin: 1,
                    onUpdate: render,
                },
            });

            // Cinematic Entrance
            const introTl = gsap.timeline({
                onStart: () => {
                    window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
                }
            });

            // Fade in Canvas and Overlay
            introTl.fromTo([".hero-canvas", ".hero-overlay"],
                { opacity: 0 },
                { opacity: 1, duration: 2, ease: "power2.inOut" },
                0
            );

            // Cascade text animations from Step 160 Design
            introTl.fromTo(".hero-pre", 
                { opacity: 0, y: 100 },
                { opacity: 0.6, y: 0, duration: 1, ease: "power2.out" },
                0.4
            );

            introTl.fromTo(".hero-title", 
                { opacity: 0, y: 100, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" },
                0.7
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="hero">
            <style>{`
                .hero {
                    position: relative;
                    height: 100vh;
                    width: 100%;
                    overflow: hidden;
                    background: #000;
                    display: flex;
                    align-items: center;
                    padding-left: 6vw;
                }

                .canvas-container {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                }

                .hero-canvas {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0;
                }

                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.6);
                    z-index: 1;
                    opacity: 0;
                }

                .hero-content {
                    position: relative;
                    z-index: 2;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .hero-pre {
                    font-family: 'Source Serif 4', serif;
                    font-size: clamp(18px, 2vw, 28px);
                    color: #FFFFFF;
                    margin-bottom: 60px;
                }

                .hero-title {
                    font-family: 'Source Serif 4', serif;
                    font-size: clamp(90px, 13vw, 160px);
                    color: #FFFFFF;
                    line-height: 1.05;
                    letter-spacing: -0.03em;
                    max-width: 100%;
                }

                @media (max-width: 768px) {
                    .hero { padding-left: 20px; }
                }
            `}</style>

            <div className="canvas-container">
                <canvas ref={canvasRef} className="hero-canvas" />
                <div className="hero-overlay"></div>
            </div>

            <div className="hero-content">
                <p className="hero-pre">Sua origem</p>
                <h1 className="hero-title">Seu sorriso</h1>
            </div>
        </section>
    );
}
