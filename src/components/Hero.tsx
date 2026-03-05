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
    const [mounted, setMounted] = useState(false);

    // Animation state
    const animatingRef = useRef(false);
    const currentRotationRef = useRef(0);
    const lastTriggerAtRef = useRef(0);
    const touchStartYRef = useRef<number | null>(null);

    // Config
    const AUTO_DURATION = 1.0;
    const USER_ROTATION = 360;
    const USER_DURATION = 0.9;
    const WHEEL_THRESHOLD = 60;
    const MIN_TIME_BETWEEN = 600;
    const PREFERRED_SCALE = 1.03;
    const EASE = "power2.inOut";

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !videoRef.current || !sectionRef.current) return;

        const video = videoRef.current;
        const model = video; // Use video as the model

        // Signal Preloader that Hero is ready
        const handleCanPlay = () => {
            window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
        };

        if (video.readyState >= 3) {
            handleCanPlay();
        } else {
            video.addEventListener("canplaythrough", handleCanPlay, { once: true });
        }

        const userTrigger = () => {
            const nowTime = performance.now();
            if (animatingRef.current) return;
            if (nowTime - lastTriggerAtRef.current < MIN_TIME_BETWEEN) return;

            lastTriggerAtRef.current = nowTime;
            animatingRef.current = true;

            const target = currentRotationRef.current + USER_ROTATION;

            gsap.to(model, {
                rotationY: target,
                scale: PREFERRED_SCALE,
                duration: USER_DURATION,
                ease: EASE,
                onUpdate: function () {
                    const r = gsap.getProperty(model, "rotationY") as number;
                    currentRotationRef.current = r;
                },
                onComplete: () => {
                    currentRotationRef.current = target;
                    gsap.to(model, { scale: 1, duration: 0.2 });
                    animatingRef.current = false;
                }
            });
        };

        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
            userTrigger();
        };

        const onTouchStart = (e: TouchEvent) => {
            touchStartYRef.current = e.touches[0].clientY;
        };

        const onTouchEnd = (e: TouchEvent) => {
            if (touchStartYRef.current === null) return;
            const endY = e.changedTouches[0].clientY;
            const delta = touchStartYRef.current - endY;
            if (Math.abs(delta) > 30) {
                userTrigger();
            }
            touchStartYRef.current = null;
        };

        // Initial Autoplay 360
        animatingRef.current = true;
        gsap.to(model, {
            rotationY: 360,
            scale: PREFERRED_SCALE,
            duration: AUTO_DURATION,
            ease: EASE,
            onComplete: () => {
                currentRotationRef.current = 360;
                gsap.to(model, { scale: 1, duration: 0.2 });
                animatingRef.current = false;

                // Enable user controls after autoplay
                window.addEventListener("wheel", onWheel, { passive: true });
                window.addEventListener("touchstart", onTouchStart, { passive: true });
                window.addEventListener("touchend", onTouchEnd, { passive: true });
            }
        });

        // Sticky CTA logic
        const ctx = gsap.context(() => {
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
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchend", onTouchEnd);
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
                    perspective: 1200px;
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
                    will-change: transform;
                    transform-origin: center center;
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
                <video
                    ref={videoRef}
                    className="hero-video-bg tooth-model"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/assets/images/clinic-interior.png"
                >
                    <source src="/hero-background.mp4" type="video/mp4" />
                </video>

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
            </section>
        </>
    );
}
