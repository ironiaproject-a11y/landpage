"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ─── register gsap ─────────────────────────────────────────── */
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/* ─── data ────────────────────────────────────────────────── */
const metrics = [
  { numeric: 20,  suffix: "+", label: "anos de experiência" },
  { numeric: 97,  suffix: "%", label: "pacientes satisfeitos", accent: true },
  { numeric: 785, suffix: "+", label: "sorrisos transformados" },
];

export function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Staggered Item Appearance
      const items = gsap.utils.toArray(".stats-item");
      const dividers = gsap.utils.toArray(".stats-divider, .stats-divider-mobile");
      
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      // 0. Section Entrance Continuity (Hand-off from Hero)
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            toggleActions: "play none none reverse"
          }
        }
      );

      mainTl.fromTo(items, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          stagger: 0.2, 
          ease: "expo.out" 
        }
      );

      // 2. Count-up Animation
      metrics.forEach((metric, i) => {
        const numberEl = document.querySelector(`.count-target-${i}`);
        if (!numberEl) return;

        const obj = { value: 0 };
        mainTl.to(obj, {
          value: metric.numeric,
          duration: 2.5,
          ease: "power4.out",
          onUpdate: () => {
            numberEl.textContent = Math.round(obj.value).toString();
          }
        }, 0.3 + (i * 0.2)); // Slight delay after item reveals
      });

      // 3. Dividers Reveal
      mainTl.fromTo(dividers,
        { scaleY: 0, scaleX: 0, opacity: 0 },
        { 
          scaleY: 1, 
          scaleX: 1, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.2, 
          ease: "power2.out" 
        },
        "-=1.5"
      );

    }, sectionRef);

    return () => ctx.revert();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={sectionRef}
      id="stats-section"
      className="stats-section"
      aria-label="Estatísticas da clínica"
    >
      <style>{`
        .stats-section {
          background: transparent;
          padding: 80px 24px;
          margin-top: -10vh; /* Adjusted for better hierarchy */
          position: relative;
          z-index: 30;
          opacity: 0; /* Match GSAP start state */
          transform: translateY(40px); /* Match GSAP start state */
          will-change: transform, opacity;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          background: rgba(17, 17, 17, 0.85); /* Soft dark translucent card */
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: var(--radius-premium, 32px); /* Card layout */
          padding: 80px 60px; /* Increased breathing room */
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 60px 120px rgba(0, 0, 0, 0.6);
        }

        .stats-item {
          position: relative;
          padding: 0 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          opacity: 0; /* Base state */
        }

        .stats-divider {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 80px;
          width: 1px;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          display: block;
        }

        .stats-divider-mobile {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          height: 1px;
          width: 100px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          display: none;
        }

        .stats-number {
          font-family: var(--font-serif), serif;
          font-size: clamp(60px, 8vw, 110px); /* Massive editorial dominance */
          font-weight: 300;
          line-height: 0.9;
          letter-spacing: -0.06em;
          margin-bottom: 24px;
          display: block;
          color: var(--color-text-primary);
          font-variant-numeric: tabular-nums;
          text-transform: none;
        }

        .stats-suffix {
          font-family: var(--font-sans), sans-serif;
          font-size: 0.7em;
          font-weight: 200;
          margin-left: 2px;
          color: var(--color-premium-slate);
        }

        .stats-number--accent {
          color: #FFFFFF !important;
          text-shadow: 0 0 40px rgba(255, 255, 255, 0.1);
        }

        .stats-label {
          font-family: var(--font-sans), sans-serif;
          font-size: 11px;
          font-weight: 400;
          color: var(--color-accent-gold);
          opacity: 0.8;
          letter-spacing: 3px;
          text-transform: uppercase;
          display: block;
          max-width: 250px;
          line-height: 1.6;
        }

        @media (max-width: 1023px) {
          .stats-section { 
            padding: 0 16px;
            margin-top: 32px; 
            z-index: 50; 
            background: transparent;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
            max-width: 380px;
            padding: 40px 32px;
            border-radius: 24px;
            gap: 24px 0;
          }

          .stats-item {
            padding: 0;
          }

          /* Container adjustments for Line 1 */
          .stats-item:nth-child(1), .stats-item:nth-child(2) {
            padding-bottom: 24px;
            position: relative;
          }
          
          /* Horizontal separator below Line 1 */
          .stats-item:nth-child(1)::after, .stats-item:nth-child(2)::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: rgba(255, 255, 255, 0.12);
          }
          
          /* Vertical central separator between item 1 and 2 */
          .stats-item:nth-child(1)::before {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            bottom: 24px;
            width: 1px;
            background: rgba(255, 255, 255, 0.12);
            z-index: 10;
          }

          /* Line 2 Container (Single centered item) */
          .stats-item:nth-child(3) {
            grid-column: span 2;
            padding-top: 12px;
          }

          .stats-divider, .stats-divider-mobile { display: none !important; }
          
          .stats-number {
             display: inline-flex;
             position: relative;
             align-items: flex-start;
          }

          /* Typo: Line 1 */
          .stats-item:nth-child(1) .stats-number,
          .stats-item:nth-child(2) .stats-number {
             font-size: 44px;
             font-weight: 300;
             margin-bottom: 4px;
          }
          .stats-item:nth-child(1) .stats-suffix,
          .stats-item:nth-child(2) .stats-suffix {
             font-family: var(--font-sans), sans-serif;
             position: absolute;
             top: 4px;
             right: -16px;
             font-size: 16px;
             font-weight: 200;
             color: rgba(255,255,255,0.45);
          }
          .stats-item:nth-child(1) .stats-label,
          .stats-item:nth-child(2) .stats-label {
             font-family: var(--font-sans), sans-serif;
             font-size: 9px;
             font-weight: 400;
             letter-spacing: 3px;
             color: rgba(255,255,255,0.45);
             max-width: 100px;
             line-height: 1.4;
          }

          /* Typo: Line 2 */
          .stats-item:nth-child(3) .stats-number {
             font-size: 56px;
             font-weight: 300;
             margin-bottom: 2px;
          }
          .stats-item:nth-child(3) .stats-suffix {
             font-family: var(--font-sans), sans-serif;
             position: absolute;
             top: 6px;
             right: -24px;
             font-size: 20px;
             font-weight: 200;
             color: rgba(255,255,255,0.45);
          }
          .stats-item:nth-child(3) .stats-label {
             font-family: var(--font-sans), sans-serif;
             font-size: 9px;
             font-weight: 400;
             letter-spacing: 3px;
             color: rgba(255,255,255,0.45);
             white-space: nowrap;
          }
        }
      `}</style>

      <div ref={gridRef} className="stats-grid">
        {metrics.map((metric, i) => (
          <div key={i} className="stats-item">
            <span className={`stats-number ${metric.accent ? "stats-number--accent" : ""}`}>
              <span className={`count-target-${i}`}>0</span>
              <span className="stats-suffix">{metric.suffix}</span>
            </span>
            <span className="stats-label">{metric.label}</span>
            
            {/* Dividers logic */}
            {i < metrics.length - 1 && (
              <>
                <span className="stats-divider" />
                <span className="stats-divider-mobile" />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;
