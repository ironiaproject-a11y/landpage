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
          padding: 80px 24px 40px;
          position: relative;
          z-index: 30;
          opacity: 0;
          transform: translateY(30px);
          will-change: transform, opacity;
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .stats-vertical-card {
          display: flex;
          flex-direction: column;
          gap: 60px;
          width: 100%;
          max-width: 340px;
          margin: 0 auto;
          position: relative;
          background: rgba(13, 13, 13, 0.6);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border-radius: 40px;
          padding: 70px 40px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 
            0 30px 60px -12px rgba(0, 0, 0, 0.8),
            0 0 20px rgba(255, 255, 255, 0.02) inset;
        }

        .stats-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stats-divider {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          height: 1px;
          width: 30px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.15),
            transparent
          );
        }

        .stats-number {
          font-family: var(--font-serif), serif;
          font-size: 64px;
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.04em;
          margin-bottom: 12px;
          color: #FFFFFF;
          display: flex;
          align-items: flex-start;
        }

        .stats-suffix {
          font-family: var(--font-sans), sans-serif;
          font-size: 0.45em;
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
        }

        .stats-number--accent {
          text-shadow: 0 0 25px rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .stats-container {
            padding: 40px 20px;
          }
          .stats-vertical-card {
            padding: 50px 30px;
            gap: 40px;
          }
          .stats-number {
            font-size: 54px;
          }
        }
      `}</style>

      <div className="stats-vertical-card">
        {metrics.map((metric, i) => (
          <div key={i} className="stats-item">
            <span className={`stats-number ${metric.accent ? "stats-number--accent" : ""}`}>
              <span className={`count-target-${i}`}>0</span>
              <span className="stats-suffix">{metric.suffix}</span>
            </span>
            <span className="stats-label">{metric.label}</span>
            
            {i < metrics.length - 1 && <span className="stats-divider" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;
