"use client";

import React from "react";

export function Hero() {
  return (
    <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#000' }}>
      <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}>
        <source src="/Aqui.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay">
        <p className="hero-origin">Sua origem</p>
        <hr className="hero-divider" />
        <h1 className="hero-title">Seu sorriso</h1>
        <a className="hero-cta" href="#sobre">↓ descubra como</a>
      </div>
    </section>
  );
}
