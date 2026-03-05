"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // 1) Persistent Eyebrow Removal
        const sel = '.hero-eyebrow';
        const hide = (el: any) => { if (!el) return; el.remove && el.remove(); };
        document.querySelectorAll(sel).forEach(hide);
        const obs = new MutationObserver(muts => {
            muts.forEach(m => {
                m.addedNodes.forEach((node: any) => {
                    if (node.nodeType === 1) {
                        if (node.matches && node.matches(sel)) hide(node);
                        node.querySelectorAll && node.querySelectorAll(sel).forEach(hide);
                    }
                });
            });
        });
        obs.observe(document.documentElement || document.body, { childList: true, subtree: true });

        const ctx = gsap.context(() => {
            // 6) CINEMATIC ENTRY
            // Initial states
            gsap.set(".hero-mouth", { opacity: 0 });
            gsap.set(".hero-title", { autoAlpha: 0, y: 20 });
            gsap.set(".hero-subtitle", { autoAlpha: 0, y: 12 });
            gsap.set(".cta-primary", { autoAlpha: 0, scale: 0.98 });

            const tlEntry = gsap.timeline();
            tlEntry
                .to(".hero-mouth", { opacity: 1, duration: 0.8, ease: "power2.inOut" }, 0)
                .to(".hero-title", { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.3)
                .to(".hero-subtitle", { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.7)
                .to(".cta-primary", { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power2.out" }, 1.0);

            // 7) SCROLL CONTROLLED PARALLAX (FACTOR-BASED)
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

                // Mouth: 0.4x Speed
                gsap.to('.hero-mouth', {
                    y: () => -(window.innerHeight * 0.12), // 0.4 factor perspective
                    scale: 1.03,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    }
                });

                // Title: 0.9x Speed, Max -60px
                // Duration to reach 60px at 0.9x speed = 60 / 0.9 = ~66.6px scroll
                gsap.to('.hero-title', {
                    y: -60,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: () => `+=${60 / 0.9}`,
                        scrub: true
                    }
                });

                // Subtitle: 1.0x Speed, Max -60px
                // Duration to reach 60px at 1.0x speed = 60px scroll
                gsap.to('.hero-subtitle', {
                    y: -60,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "+=60",
                        scrub: true
                    }
                });

                // CTA: 0.3x Speed
                gsap.to('.cta-primary', {
                    y: () => -(window.innerHeight * 0.1),
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    }
                });

                // 8) STICKY TOGGLE (40% mark)
                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: "40% top",
                    onEnter: () => document.querySelector('.cta-primary')?.classList.add('is-sticky'),
                    onLeaveBack: () => document.querySelector('.cta-primary')?.classList.remove('is-sticky')
                });
            }

        }, sectionRef);

        return () => {
            obs.disconnect();
            ctx.revert();
        };
    }, []);

    if (!mounted) return null;

    return (
        <>
            <style>{`
        .hero { 
          padding: 24px 16px; 
          position: relative; 
          overflow: hidden; 
          height: 100vh; 
          background: #000; 
          width: 100%; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
        }
        
        .hero-mouth { 
          position: absolute; 
          left: 50%; 
          transform: translateX(-50%); 
          top: 35%; 
          height: 65vh; 
          width: 100%; 
          z-index: 1; 
          will-change: transform; 
          filter: contrast(.96) brightness(.98); 
          object-fit: cover; 
          pointer-events: none;
        }
        
        .hero-overlay { 
          position: absolute; 
          inset: 0; 
          background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%); 
          z-index: 2; 
          pointer-events: none; 
        }
        
        /* content position strictly at 59.7vh */
        .hero-content { 
          position: absolute; 
          z-index: 10; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          text-align: center; 
          width: 100%; 
          top: 59.7vh; 
          transform: translateY(-50%); 
          padding: 0 20px;
        }
        
        .hero-title { 
          font-size: 36px; 
          font-weight: 700; 
          line-height: 1.05; 
          letter-spacing: -0.02em; 
          color: #FBFBFB; 
          margin: 0; 
          will-change: transform, opacity; 
        }
        
        .hero-subtitle { 
          font-size: 16px; 
          font-weight: 500; 
          line-height: 1.4; 
          color: #E6E6E6; 
          margin-top: 8px; 
          will-change: transform, opacity; 
        }
        
        .hero-actions { 
          margin-top: 24px; 
          width: 100%; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
        }
        
        .cta-primary { 
          width: 100%; 
          height: 52px; 
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
          box-shadow: 0 10px 30px rgba(0,0,0,0.5); 
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        
        .cta-primary.is-sticky { 
          position: fixed !important; 
          bottom: 20px; 
          left: 20px; 
          width: calc(100% - 40px); 
          height: 50px !important; 
          transform: scale(1); 
          z-index: 9999; 
          background: #0B0B0B;
          border-color: rgba(255,255,255,0.2);
        }
        
        .cta-secondary-link { 
          display: inline-block; 
          font-size: 14px; 
          font-weight: 500; 
          color: rgba(255,255,255,0.6); 
          margin-top: 20px; 
          text-decoration: none; 
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 2px;
          transition: color 0.3s ease, border-color 0.3s ease;
        }
        .cta-secondary-link:hover { color: #fff; border-color: #fff; }
      `}</style>

            <section ref={sectionRef} className="hero">
                <video
                    className="hero-mouth"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/para_vc/frame_000_delay-0.041s.png"
                >
                    <source src="/luxury-hero/mp4_1080_variantA.mp4" type="video/mp4" />
                    <source src="/luxury-hero/webm_1080_variantA.webm" type="video/webm" />
                </video>

                <div className="hero-overlay"></div>

                <div className="hero-content">
                    <h1 className="hero-title">Volte a sorrir com confiança.</h1>
                    <p className="hero-subtitle">Segurança clínica. Resultado natural.</p>

                    <div className="hero-actions">
                        <button className="cta-primary">
                            AGENDAR CONSULTA
                        </button>
                        <a href="#results" className="cta-secondary-link">
                            Galeria de Resultados
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
