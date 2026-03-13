"use client";

import { m, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const metrics = [
  {
    value: "20+",
    label: "anos de experiência",
  },
  {
    value: "97%",
    label: "pacientes satisfeitos",
    accent: true,
  },
  {
    value: "785+",
    label: "sorrisos transformados",
  },
];

function StatItem({
  value,
  label,
  accent,
  delay,
}: {
  value: string;
  label: string;
  accent?: boolean;
  delay: number;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className="stats-item flex flex-col items-center"
    >
      <span
        className="stats-number"
        style={{ color: accent ? "var(--color-premium-gold)" : "#F8F8F6" }}
      >
        {value}
      </span>
      <span className="stats-label">{label}</span>
    </m.div>
  );
}

export function Stats() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

        .stats-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(230, 211, 163, 0.12) 20%,
            rgba(230, 211, 163, 0.12) 80%,
            transparent
          );
          pointer-events: none;
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

        .stats-item:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 52px;
          width: 1px;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(230, 211, 163, 0.18),
            transparent
          );
        }

        .stats-number {
          font-family: var(--font-playfair), serif;
          font-size: clamp(48px, 6vw, 64px);
          font-weight: 500;
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
          display: block;
        }

        .stats-label {
          font-family: var(--font-inter), sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: rgba(248, 248, 246, 0.38);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: block;
          line-height: 1.4;
        }

        /* Mobile */
        @media (max-width: 640px) {
          .stats-section {
            padding: 56px 20px 64px;
          }

          .stats-section::before {
            display: none;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 44px;
          }

          .stats-item {
            padding: 0;
          }

          .stats-item::after {
            display: none !important;
          }

          .stats-item:not(:last-child) {
            padding-bottom: 44px;
            border-bottom: 1px solid rgba(230, 211, 163, 0.1);
          }

          .stats-number {
            font-size: clamp(48px, 14vw, 60px);
          }
        }

        /* Tablet: 2 cols edge case handled gracefully */
        @media (min-width: 641px) and (max-width: 860px) {
          .stats-item {
            padding: 0 28px;
          }

          .stats-number {
            font-size: clamp(42px, 7vw, 56px);
          }
        }
      `}</style>

      <div className="stats-grid">
        {metrics.map((metric, i) => (
          <StatItem
            key={i}
            value={metric.value}
            label={metric.label}
            accent={metric.accent}
            delay={i * 0.15}
          />
        ))}
      </div>
    </section>
  );
}

export default Stats;
