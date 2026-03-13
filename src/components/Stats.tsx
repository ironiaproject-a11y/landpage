"use client";

import { m } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ─── data ────────────────────────────────────────────────── */
const metrics = [
  { numeric: 20,  suffix: "+", label: "anos de experiência" },
  { numeric: 97,  suffix: "%", label: "pacientes satisfeitos", accent: true },
  { numeric: 785, suffix: "+", label: "sorrisos transformados" },
];

/* ─── counter hook (rAF, easeOutCubic) ─────────────────────── */
function useCountUp(target: number, active: boolean, delay: number) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;

    const timer = setTimeout(() => {
      let start: number | null = null;
      const duration = 1600;
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

      const tick = (now: number) => {
        if (!start) start = now;
        const t = Math.min((now - start) / duration, 1);
        setValue(Math.round(easeOut(t) * target));
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active, delay, target]);

  return active ? value : 0;
}

/* ─── single stat column ───────────────────────────────────── */
function StatItem({
  numeric,
  suffix,
  label,
  accent,
  index,
  counterActive,
  showDivider,
}: {
  numeric: number;
  suffix: string;
  label: string;
  accent?: boolean;
  index: number;
  counterActive: boolean;
  showDivider: boolean;
}) {
  // Cascading delay calculation
  // Item 0 starts at 0.1s
  // Item 1 starts at 0.5s (after item 0's divider)
  // Item 2 starts at 0.9s
  const baseDelay = 0.1;
  const staggerStep = 0.4; 
  const itemDelay = baseDelay + (index * staggerStep);
  const dividerDelay = itemDelay + 0.3; // Divider appears right after the number
  
  const count = useCountUp(numeric, counterActive, itemDelay);

  // Variants for organized staggered orchestration
  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.9, delay: itemDelay, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const dividerVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: { 
      scaleY: 1, 
      opacity: 1,
      transition: { duration: 0.7, delay: dividerDelay, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const mobileDividerVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: { 
      scaleX: 1, 
      opacity: 1,
      transition: { duration: 0.7, delay: dividerDelay, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <m.div
      variants={itemVariants}
      initial="hidden"
      animate={counterActive ? "visible" : "hidden"}
      className="stats-item flex flex-col items-center"
    >
      <span className={`stats-number${accent ? " stats-number--accent" : ""}`}>
        {counterActive ? count : 0}
        <span className="stats-suffix">{suffix}</span>
      </span>

      <span className="stats-label">{label}</span>

      {showDivider && (
        <>
          {/* Desktop Vertical Divider */}
          <m.span
            variants={dividerVariants}
            initial="hidden"
            animate={counterActive ? "visible" : "hidden"}
            className="stats-divider hidden sm:block"
            aria-hidden
          />
          {/* Mobile Horizontal Divider */}
          <m.span
            variants={mobileDividerVariants}
            initial="hidden"
            animate={counterActive ? "visible" : "hidden"}
            className="stats-divider-mobile sm:hidden"
            aria-hidden
          />
        </>
      )}
    </m.div>
  );
}

/* ─── section ──────────────────────────────────────────────── */
export function Stats() {
  const [mounted, setMounted] = useState(false);
  const [counterActive, setCounterActive] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <section
      className="stats-section"
      aria-label="Estatísticas da clínica"
    >
      <style>{`
        .stats-section {
          background: #0B0B0B;
          padding: 72px 24px 80px;
          position: relative;
          overflow: hidden;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          max-width: 860px;
          margin: 0 auto;
          position: relative;
        }

        .stats-item {
          position: relative;
          padding: 0 48px;
        }

        /* Divider — animated via Framer scaleY */
        .stats-divider {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          transform-origin: center;
          height: 52px;
          width: 1px;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(230, 211, 163, 0.22),
            transparent
          );
          display: block;
        }

        /* Mobile specific horizontal divider */
        .stats-divider-mobile {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          transform-origin: center;
          height: 1px;
          width: 60%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(230, 211, 163, 0.15),
            transparent
          );
          display: block;
        }

        .stats-number {
          font-family: var(--font-playfair), serif;
          font-size: clamp(48px, 6vw, 64px);
          font-weight: 500;
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
          display: block;
          color: #F8F8F6;
          font-variant-numeric: tabular-nums;
        }

        .stats-suffix {
          font-size: 0.8em;
          opacity: 0.85;
        }

        /* Accent: gold + pulsing glow */
        .stats-number--accent {
          color: var(--color-premium-gold) !important;
          animation: accentGlow 3.5s ease-in-out infinite;
        }

        @keyframes accentGlow {
          0%, 100% { text-shadow: 0 0 0px rgba(230, 211, 163, 0); }
          50%       { text-shadow: 0 0 28px rgba(230, 211, 163, 0.28),
                                   0 0 60px rgba(230, 211, 163, 0.10); }
        }

        .stats-label {
          font-family: var(--font-inter), sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: rgba(248, 248, 246, 0.35);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          display: block;
          line-height: 1.4;
        }

        /* ── Mobile ─────────────────────────────── */
        @media (max-width: 640px) {
          .stats-section { padding: 16px 20px 48px; }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .stats-item {
            padding: 40px 0;
            border-bottom: none; /* Replaced default border with animated stats-divider-mobile */
          }

          .stats-item:last-child {
            padding-bottom: 0;
          }

          .stats-item:first-child { padding-top: 0; }
          .stats-number { font-size: clamp(48px, 14vw, 60px); }
        }

        /* ── Tablet ─────────────────────────────── */
        @media (min-width: 641px) and (max-width: 860px) {
          .stats-item { padding: 0 28px; }
          .stats-number { font-size: clamp(42px, 7vw, 56px); }
        }
      `}</style>

      <m.div 
        className="stats-grid"
        onViewportEnter={() => setCounterActive(true)}
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -50px 0px" }}
      >
        {metrics.map((metric, i) => (
          <StatItem
            key={i}
            numeric={metric.numeric}
            suffix={metric.suffix}
            label={metric.label}
            accent={metric.accent}
            index={i}
            counterActive={counterActive}
            showDivider={i < metrics.length - 1}
          />
        ))}
      </m.div>
    </section>
  );
}

export default Stats;
