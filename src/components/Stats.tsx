"use client";

import { m, useInView } from "framer-motion";
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

  useEffect(() => {
    if (!active) return;

    const timer = setTimeout(() => {
      const start = performance.now();
      const duration = 1600;

      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

      const tick = (now: number) => {
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
  }, [active, target, delay]);

  return value;
}

/* ─── single stat column ───────────────────────────────────── */
function StatItem({
  numeric,
  suffix,
  label,
  accent,
  delay,
  inView,
  showDivider,
}: {
  numeric: number;
  suffix: string;
  label: string;
  accent?: boolean;
  delay: number;
  inView: boolean;
  showDivider: boolean;
}) {
  const count = useCountUp(numeric, inView, delay);

  return (
    <m.div
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }}
      className="stats-item flex flex-col items-center"
    >
      {/* number */}
      <span className={`stats-number${accent ? " stats-number--accent" : ""}`}>
        {count}
        <span className="stats-suffix">{suffix}</span>
      </span>

      {/* label */}
      <span className="stats-label">{label}</span>

      {/* animated divider — draws from center outward */}
      {showDivider && (
        <m.span
          className="stats-divider"
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.7, delay: delay + 0.3, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        />
      )}
    </m.div>
  );
}

/* ─── section ──────────────────────────────────────────────── */
export function Stats() {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <section
      ref={sectionRef}
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

        /* Divider — positioned via JS Framer div */
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
          /* suffix does NOT animate — stays at same weight */
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
          .stats-section { padding: 56px 20px 64px; }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .stats-item {
            padding: 40px 0;
            border-bottom: 1px solid rgba(230, 211, 163, 0.1);
          }

          .stats-item:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }

          .stats-item:first-child { padding-top: 0; }

          .stats-divider { display: none; }

          .stats-number { font-size: clamp(48px, 14vw, 60px); }
        }

        /* ── Tablet ─────────────────────────────── */
        @media (min-width: 641px) and (max-width: 860px) {
          .stats-item { padding: 0 28px; }
          .stats-number { font-size: clamp(42px, 7vw, 56px); }
        }
      `}</style>

      <div className="stats-grid">
        {metrics.map((metric, i) => (
          <StatItem
            key={i}
            numeric={metric.numeric}
            suffix={metric.suffix}
            label={metric.label}
            accent={metric.accent}
            delay={i * 0.18}
            inView={inView}
            showDivider={i < metrics.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

export default Stats;
