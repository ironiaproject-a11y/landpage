"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { m, AnimatePresence } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const framesRef = useRef<HTMLImageElement[]>([]);
  const totalFrames = 145;
  const frameObj = useRef({ index: 0 });

  useEffect(() => {
    if (!sectionRef.current || !canvasRef.current) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    const ctx = gsap.context(() => {
      // 1. Preload Frames
      let loadedCount = 0;
      const preloadFrames = () => {
        for (let i = 0; i < totalFrames; i++) {
          const img = new Image();
          img.src = `/hero-frames/frame_${i.toString().padStart(3, '0')}_delay-0.041s.png`;
          img.onload = () => {
            loadedCount++;
            if (loadedCount === totalFrames) {
              setIsLoaded(true);
              renderFrame(0);
              initScroll();
            }
          };
          framesRef.current[i] = img;
        }
      };

      const renderFrame = (index: number) => {
        const roundedIndex = Math.floor(index);
        const img = framesRef.current[roundedIndex];
        if (img && img.complete) {
          const { width, height } = canvas;
          const imgRatio = img.width / img.height;
          const canvasRatio = width / height;
          
          let drawWidth, drawHeight, offsetX, offsetY;

          if (imgRatio > canvasRatio) {
            drawHeight = height;
            drawWidth = height * imgRatio;
            offsetX = (width - drawWidth) / 2;
            offsetY = 0;
          } else {
            drawWidth = width;
            drawHeight = width / imgRatio;
            offsetX = 0;
            offsetY = (height - drawHeight) / 2;
          }

          context.clearRect(0, 0, width, height);
          context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          setFrameIndex(roundedIndex);
        }
      };

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(frameObj.current.index);
      };

      const initScroll = () => {
        gsap.to(frameObj.current, {
          index: totalFrames - 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=300%",
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
          onUpdate: () => renderFrame(frameObj.current.index)
        });
      };

      preloadFrames();
      window.addEventListener("resize", handleResize);
      handleResize();

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    });

    return () => ctx.revert();
  }, []);

  // Determine which phase of text to show based on frame index
  // Frame 0-75: SUA ORIGEM
  // Frame 75-144: SEU SORRISO
  const showOrigin = frameIndex < 75;
  const showSmile = frameIndex >= 75;

  return (
    <section ref={sectionRef} className="relative w-full bg-black overflow-hidden">
      <div className="relative w-full h-[100vh] flex items-center justify-center">
        {/* Canvas Background */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover z-0 grayscale opacity-80"
          style={{ filter: 'brightness(1.1) contrast(1.1) grayscale(100%)' }}
        />

        {/* Cinematic Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none z-10" />

        {/* "PRESTIGE" Typography Container */}
        <div className="relative z-20 flex flex-col items-center justify-center w-full px-4 text-center pointer-events-none">
          <AnimatePresence mode="wait">
            {showOrigin && (
              <m.div
                key="origin"
                initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", y: -20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <span className="text-[12px] lg:text-[14px] tracking-[0.6em] text-white/40 uppercase mb-4">
                  A jornada começa na
                </span>
                <h1 className="text-[32px] lg:text-[72px] font-[300] tracking-[0.3em] uppercase text-white flex items-center gap-4 lg:gap-8">
                  <span className="text-white/20 font-[100]">[</span>
                  Sua Origem
                  <span className="text-white/20 font-[100]">]</span>
                </h1>
              </m.div>
            )}

            {showSmile && (
              <m.div
                key="smile"
                initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", y: -20 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <span className="text-[12px] lg:text-[14px] tracking-[0.6em] text-white/40 uppercase mb-4">
                  Revelando a perfeição em
                </span>
                <h1 className="text-[32px] lg:text-[84px] font-[300] tracking-[0.2em] uppercase text-white flex items-center gap-4 lg:gap-8">
                  <span className="text-white/20 font-[100]">[</span>
                  Seu Sorriso
                  <span className="text-white/20 font-[100]">]</span>
                </h1>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Action Securely inside Hero */}
        <div className="absolute bottom-[60px] left-0 right-0 w-full flex justify-center z-30">
          <a 
            href="#sobre" 
            className="group flex flex-col items-center gap-4 transition-all hover:opacity-100 opacity-60 pointer-events-auto"
          >
            <span className="text-[9px] tracking-[0.5em] uppercase text-white/50 group-hover:text-white transition-colors">
              Explorar Experiência
            </span>
            <div className="w-[1px] h-[40px] bg-gradient-to-b from-white/40 to-transparent group-hover:from-white/100 transition-all" />
          </a>
        </div>
      </div>
    </section>
  );
}
