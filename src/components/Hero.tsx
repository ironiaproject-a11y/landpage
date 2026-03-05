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

        // 1) Remoção definitiva eyebrow + observer (COPIADO EXATAMENTE DO PROMPT)
        (function () {
            const sel = '.hero-eyebrow';
            function hide(el: any) { if (!el) return; el.remove && el.remove(); }
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
        })();

        // 2) Scroll driven parallax (COPIADO EXATAMENTE DO PROMPT + ADAPTAÇÕES DE SELETORES)
        const ctx = gsap.context(() => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                // mouth
                gsap.to('.hero-mouth', {
                    y: () => -(window.innerHeight * 0.12), // approx max -40~60px
                    scale: 1.03,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".hero",
                        start: "top top",
                        end: () => "+=" + Math.round(window.innerHeight * 0.8),
                        scrub: 0.8
                    }
                });

                // title
                gsap.to('.hero-title', {
                    y: -60,
                    ease: "power2.out",
                    scrollTrigger: { trigger: ".hero", start: "top top", end: "top+=300 top", scrub: 0.9 }
                });

                // subtitle
                gsap.to('.hero-subtitle', {
                    y: -60,
                    ease: "power2.out",
                    scrollTrigger: { trigger: ".hero", start: "top top", end: "top+=300 top", scrub: 1 }
                });

                // CTA sticky toggle after 40% hero
                ScrollTrigger.create({
                    trigger: ".hero",
                    start: () => (window.innerHeight * 0.4) + " top",
                    onEnter: () => document.querySelector('.cta-primary')?.classList.add('is-sticky'),
                    onLeaveBack: () => document.querySelector('.cta-primary')?.classList.remove('is-sticky')
                });
            } else {
                // fallback: set static positions
                gsap.set('.hero-mouth, .hero-title, .hero-subtitle', { clearProps: 'all' });
            }

            // ENTRADA CINEMATOGRÁFICA (SEÇÃO 6)
            const tl = gsap.timeline();
            // 0ms: vídeo já pronto (está no DOM)
            tl.to(".hero-mouth", { opacity: 1, duration: 0 })
                // 300ms: headline
                .fromTo(".hero-title",
                    { autoAlpha: 0, y: 20 },
                    { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
                    0.3
                )
                // 700ms: subheadline
                .fromTo(".hero-subtitle",
                    { autoAlpha: 0, y: 12 },
                    { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
                    0.7
                )
                // 1000ms: CTA primário
                .fromTo(".cta-primary",
                    { autoAlpha: 0, scale: 0.98 },
                    { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power2.out" },
                    1.0
                );

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    if (!mounted) return null;

    return (
        <>
            <style>{`
        /* CSS COPIADO EXATAMENTE DO PROMPT (SEÇÃO 13) */
        .hero { padding: 24px 16px; position: relative; overflow: hidden; height: 100vh; background: #000; width: 100%; display: flex; flex-direction: column; align-items: center; }
        .hero-mouth { position: absolute; left: 50%; transform: translateX(-50%); top: 35%; height: 65vh; width: 100%; max-width: 100vw; z-index:1; will-change: transform; filter: contrast(.96) brightness(.98); object-fit: contain; opacity: 0; }
        .hero-overlay { position:absolute; inset:0; background: linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.25) 70%); z-index:2; pointer-events:none; }
        
        /* Ajuste de posicionamento vertical conforme cálculo da Seção 4 */
        /* mouthTop(35) + mouthHeight(65)/2 - (65 * 0.12) = 67.5 - 7.8 = 59.7% */
        .hero-content { position: relative; z-index:3; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; text-align:center; width: 100%; top: 59.7%; transform: translateY(-50%); }
        
        .hero-title{ font-size:36px; font-weight:700; line-height:1.02; letter-spacing:-0.02em; color:#FBFBFB; margin:0; will-change: transform, opacity; }
        .hero-subtitle{ font-size:16px; font-weight:500; line-height: 1.4; color:#E6E6E6; margin-top:8px; will-change: transform, opacity; }
        
        .hero-actions { margin-top: 24px; width: 100%; display: flex; flex-direction: column; align-items: center; }
        
        .cta-primary{ width:100%; height:52px; background:#0B0B0B; color:#FBFBFB; border-radius:8px; font-weight:600; font-size:16px; letter-spacing:1px; text-transform:uppercase; display:inline-flex; align-items:center; justify-content:center; border:0; cursor:pointer; box-shadow: 0 6px 18px rgba(11,11,11,0.12); transition: opacity 200ms ease-out; }
        .cta-primary:hover { opacity: 0.9; }
        
        .cta-primary.is-sticky{ position: fixed !important; bottom: 16px; left:16px; width: calc(100% - 32px); height:48px !important; transform: scale(1.02); transition: transform 200ms ease-out, box-shadow 200ms ease-out; z-index:9999; }
        
        .cta-secondary-link{ display:inline-block; font-size:14px; font-weight:500; color: rgba(255,255,255,0.78); opacity:0.78; margin-top:16px; text-decoration:none; }
        .cta-secondary-link:hover { text-decoration: underline; opacity: 1; }
        
        @media (prefers-reduced-motion: reduce){ .hero-mouth, .hero-title, .hero-subtitle { transition: none !important; transform:none !important; } }
      `}</style>

            <section ref={sectionRef} className="hero">
                <video
                    className="hero-mouth"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/para_vc/frame_000_delay-0.041s.png"
                    aria-label="Close-up do sorriso restaurado em 3D"
                >
                    <source src="/luxury-hero/mp4_1080_variantA.mp4" type="video/mp4" />
                    <source src="/luxury-hero/webm_1080_variantA.webm" type="video/webm" />
                </video>

                <div className="hero-overlay"></div>

                <div className="hero-content">
                    <h1 className="hero-title">Volte a sorrir com confiança.</h1>
                    <p className="hero-subtitle">Segurança clínica. Resultado natural.</p>

                    <div className="hero-actions">
                        <button className="cta-primary" aria-label="Agendar consulta — abre formulário de agendamento">
                            AGENDAR CONSULTA
                        </button>
                        <a href="#galeria" className="cta-secondary-link">
                            Galeria de Resultados
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
