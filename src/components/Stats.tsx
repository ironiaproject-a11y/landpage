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
  { numeric: 20,  suffix: "+", label: "anos de", subLabel: "experiência" },
  { numeric: 97,  suffix: "%", label: "pacientes", subLabel: "satisfeitos", accent: true },
  { numeric: 785, suffix: "+", label: "sorrisos", subLabel: "transformados" },
];

export function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(".stats-item");
      
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      // Section entrance removed for mobile stability

      mainTl.fromTo(items, 
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.15, 
          ease: "expo.out" 
        }
      );

      // Count-up Animation
      metrics.forEach((metric, i) => {
        const numberEl = document.querySelector(`.count-target-${i}`);
        if (!numberEl) return;

        const obj = { value: 0 };
        mainTl.to(obj, {
          value: metric.numeric,
          duration: 2,
          ease: "power4.out",
          onUpdate: () => {
            if (numberEl) numberEl.textContent = Math.round(obj.value).toString();
          }
        }, 0.2 + (i * 0.15));
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={sectionRef}
      id="stats-section"
      className="stats-container"
      aria-label="Estatísticas da clínica"
    >
      <style>{`
        .stats-container {
          background: transparent;
          padding: 0 0 120px;
          position: relative;
          z-index: 30;
          display: flex;
          justify-content: center;
          width: 100%;
          max-width: var(--container-width);
          margin: 0 auto;
        }

        .stats-editorial-bar {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: stretch;
          gap: 0;
          position: relative;
          padding: 40px 60px;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          width: fit-content;
          box-shadow: 
            0 20px 50px rgba(0, 0, 0, 0.3),
            inset 0 0 0 1px rgba(255, 255, 255, 0.02);
        }

        .stats-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 60px;
          min-width: 240px;
        }

        .stats-item:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 20%;
          height: 60%;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent);
        }

        .stats-number {
          font-family: var(--font-serif), serif;
          font-size: 72px;
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.04em;
          margin-bottom: 12px;
          color: var(--color-text-primary);
          display: flex;
          align-items: flex-start;
          font-style: italic;
        }

        .stats-suffix {
          font-family: var(--font-serif), serif;
          font-size: 0.5em;
          font-weight: 200;
          margin-left: 2px;
          opacity: 0.3;
          margin-top: 8px;
          font-style: italic;
        }

        .stats-label-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stats-label {
          font-family: var(--font-sans), sans-serif;
          font-size: 11px;
          font-weight: 400;
          color: var(--color-text-tertiary);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          line-height: 1.2;
        }

        .stats-number--accent {
          color: var(--color-accent-gold);
          text-shadow: 0 0 30px rgba(var(--color-accent-gold-rgb), 0.2);
        }

        @media (max-width: 1100px) {
          .stats-item {
            padding: 0 40px;
            min-width: 200px;
          }
        }

        @media (max-width: 900px) {
          .stats-editorial-bar {
            flex-direction: column;
            padding: 40px 20px;
            width: 100%;
            max-width: 400px;
          }
          .stats-item {
            padding: 30px 0;
            width: 100%;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }
          .stats-item:last-child {
            border-bottom: none;
          }
          .stats-item:not(:last-child)::after {
            display: none;
          }
          .stats-number {
            font-size: 64px;
          }
        }
      `}</style>

      <div className="stats-editorial-bar">
        {metrics.map((metric, i) => (
          <div key={i} className="stats-item">
            <span className={`stats-number ${metric.accent ? "stats-number--accent" : ""}`}>
              <span className={`count-target-${i}`}>0</span>
              <span className="stats-suffix">{metric.suffix}</span>
            </span>
            <div className="stats-label-group">
              <span className="stats-label">{metric.label}</span>
              <span className="stats-label">{metric.subLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;
