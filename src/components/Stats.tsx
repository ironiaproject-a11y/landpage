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

      // Section Entrance
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            toggleActions: "play none none reverse"
          }
        }
      );

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
          padding: 0 24px 80px;
          position: relative;
          z-index: 30;
          opacity: 0;
          transform: translateY(30px);
          will-change: transform, opacity;
          display: flex;
          justify-content: flex-start; /* Left-aligned */
          width: 100%;
          max-width: var(--container-width);
          margin: 0 auto;
        }

        .stats-vertical-sidebar {
          display: flex;
          flex-direction: column;
          gap: 48px;
          position: relative;
          padding-left: 20px;
          border-left: 1px solid rgba(255, 255, 255, 0.1); /* Vertical elegant divider */
        }

        .stats-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start; /* Left-aligned content */
          text-align: left;
        }

        .stats-number {
          font-family: var(--font-serif), serif;
          font-size: 56px;
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.04em;
          margin-bottom: 8px;
          color: #FFFFFF;
          display: flex;
          align-items: flex-start;
        }

        .stats-suffix {
          font-family: var(--font-sans), sans-serif;
          font-size: 0.4em;
          font-weight: 200;
          margin-left: 1px;
          opacity: 0.4;
          margin-top: 4px;
        }

        .stats-label {
          font-family: var(--font-sans), sans-serif;
          font-size: 10px;
          font-weight: 400;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          line-height: 1.4;
          max-width: 140px; /* Force internal line breaks for verticality */
        }

        .stats-number--accent {
          color: #FFFFFF;
          text-shadow: 0 0 25px rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .stats-container {
            padding: 40px 20px;
          }
          .stats-vertical-sidebar {
            gap: 32px;
          }
          .stats-number {
            font-size: 48px;
          }
        }
      `}</style>

      <div className="stats-vertical-sidebar">
        {metrics.map((metric, i) => (
          <div key={i} className="stats-item">
            <span className={`stats-number ${metric.accent ? "stats-number--accent" : ""}`}>
              <span className={`count-target-${i}`}>0</span>
              <span className="stats-suffix">{metric.suffix}</span>
            </span>
            <span className="stats-label">{metric.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;
