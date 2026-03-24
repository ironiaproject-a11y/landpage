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
  const [phase, setPhase] = useState<'origin' | 'smile'>('origin');
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
          
          // Optimization: Only update state when crossing threshold
          if (roundedIndex < 75) {
            setPhase(p => p !== 'origin' ? 'origin' : p);
          } else {
            setPhase(p => p !== 'smile' ? 'smile' : p);
          }
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

  return (
    <section ref={sectionRef} className="relative w-full bg-black overflow-hidden m-0 p-0 border-none">
      <div className="relative w-full h-[100vh] flex items-center justify-center m-0 p-0">
        {/* Canvas Background */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover z-0 scale-[1.02] grayscale"
          style={{ filter: 'brightness(1.1) contrast(1.1) grayscale(100%)' }}
        />

        {/* Cinematic Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />

        {/* Restored Typography Hierarchy */}
        <div className="relative z-20 w-full max-w-[1600px] mx-auto flex justify-center px-6 pointer-events-none">
          <AnimatePresence mode="wait">
            {phase === 'origin' ? (
              <m.h1
                key="origin"
                initial={{ opacity: 0, filter: 'blur(12px)', y: 10 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(12px)', y: -10 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ fontFamily: 'var(--font-sans)' }}
                className="text-[18px] lg:text-[clamp(1.75rem,5vw,4rem)] font-[400] text-white/90 leading-tight lg:leading-[0.95] tracking-[5px] uppercase text-center"
              >
                Sua origem,
              </m.h1>
            ) : (
              <m.h1
                key="smile"
                initial={{ opacity: 0, y: 20, clipPath: 'inset(100% 0 0 0)' }}
                animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 -20% 0)' }}
                exit={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontFamily: 'var(--font-serif)' }}
                className="text-[42px] lg:text-[clamp(3.75rem,11vw,10rem)] font-[300] text-white leading-[1.1] lg:leading-[0.95] tracking-normal lowercase first-letter:uppercase text-center"
              >
                Seu sorriso.
              </m.h1>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <div className="absolute bottom-[40px] left-0 right-0 w-full flex justify-center z-30">
          <a 
            style={{ fontFamily: 'var(--font-sans)' }} 
            href="#sobre" 
            className="inline-flex items-center justify-center bg-transparent border border-white/25 rounded-full px-[32px] py-[10px] hover:bg-white/10 transition-colors whitespace-nowrap text-white/55 text-[11px] tracking-[4px] font-[400] uppercase backdrop-blur-md pointer-events-auto"
          >
            AGENDAR CONSULTA &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
