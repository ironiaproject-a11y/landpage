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
        { opacity: 0, y: 100 },
        { 
          opacity: 1, 
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
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
          background: #0B0B0B;
          padding: 100px 24px;
          margin-top: -15vh; /* Overlap with Hero exit for seamless flow */
          position: relative;
          overflow: hidden;
          z-index: 20; /* Ensure it stays above Hero exit */
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
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
          height: 60px;
          width: 1px;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(230, 211, 163, 0.2),
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
          width: 80px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(230, 211, 163, 0.2),
            transparent
          );
          display: none;
        }

        .stats-number {
          font-family: var(--font-playfair), serif;
          font-size: clamp(54px, 7vw, 72px);
          font-weight: 500;
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
          display: block;
          color: #F8F8F6;
          font-variant-numeric: tabular-nums;
        }

        .stats-suffix {
          font-size: 0.7em;
          margin-left: 2px;
          color: rgba(248, 248, 246, 0.6);
        }

        .stats-number--accent {
          color: var(--color-premium-gold) !important;
          /* Subtle persistent glow */
          text-shadow: 0 0 40px rgba(230, 211, 163, 0.1);
        }

        .stats-label {
          font-family: var(--font-inter), sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: rgba(248, 248, 246, 0.4);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          display: block;
          max-width: 160px;
          line-height: 1.5;
        }

        @media (max-width: 1023px) {
          .stats-section { 
            padding-top: 100px !important; 
            padding-bottom: 80px !important;
            margin-top: 0 !important; 
            z-index: 50 !important; 
            background: #0B0B0B;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            max-width: 300px;
          }

          .stats-item {
            padding: 40px 0;
          }

          .stats-item:first-child { padding-top: 0; }
          .stats-item:last-child { padding-bottom: 0; }

          .stats-divider { display: none; }
          .stats-divider-mobile { display: block; }
          
          .stats-number { font-size: 64px; }
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
