"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { m, AnimatePresence } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const frameObj = useRef({ index: 0 });
  const [videoPhase, setVideoPhase] = useState<'skull' | 'woman'>('skull');
  const totalFrames = 145;

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current || !triggerRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const ctx = gsap.context(() => {
      // 1. Preload Frames
      const preload = () => {
        for (let i = 0; i < totalFrames; i++) {
          const img = new Image();
          img.src = `/hero-frames/frame_${i.toString().padStart(3, "0")}_delay-0.041s.png`;
          framesRef.current[i] = img;
        }
      };
      preload();

      const render = (index: number) => {
        const img = framesRef.current[Math.floor(index)];
        if (img && img.complete) {
          const { width, height } = canvas;
          const imgRatio = img.width / img.height;
          const canvasRatio = width / height;
          let dWidth, dHeight, dx, dy;

          if (imgRatio > canvasRatio) {
            dHeight = height;
            dWidth = dHeight * imgRatio;
            dx = (width - dWidth) / 2;
            dy = 0;
          } else {
            dWidth = width;
            dHeight = dWidth / imgRatio;
            dx = 0;
            dy = (height - dHeight) / 2;
          }

          context.clearRect(0, 0, width, height);
          context.drawImage(img, dx, dy, dWidth, dHeight);
        }
      };

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render(frameObj.current.index);
      };
      window.addEventListener("resize", handleResize);
      handleResize();

      // 2. Scroll Scrub Logic (Initialized after Intro)
      const initScrollScrub = () => {
        gsap.to(frameObj.current, {
          index: totalFrames - 1,
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: "+=200%",
            scrub: 1,
            pin: containerRef.current,
            onUpdate: (self) => {
              const currentFrame = 75 + (self.progress * (totalFrames - 1 - 75));
              frameObj.current.index = currentFrame;
              render(currentFrame);
              
              // Phase control
              if (currentFrame >= 75) setVideoPhase('woman');
              else setVideoPhase('skull');
            }
          }
        });
      };

      // 3. Cinematic Intro (Automatic)
      const startIntro = () => {
        gsap.to(frameObj.current, {
          index: 75,
          duration: 3,
          ease: "power2.inOut",
          onUpdate: () => {
            render(frameObj.current.index);
            if (frameObj.current.index >= 75) setVideoPhase('woman');
            else setVideoPhase('skull');
          },
          onComplete: initScrollScrub
        });
      };

      // Start when first frame is ready
      const firstFrame = framesRef.current[0];
      if (firstFrame) {
        if (firstFrame.complete) {
          render(0);
          startIntro();
        } else {
          firstFrame.onload = () => {
            render(0);
            startIntro();
          };
        }
      }
    });

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={triggerRef} className="relative w-full overflow-visible">
      <section ref={containerRef} className="relative w-full h-[100vh] overflow-hidden bg-black text-white m-0 p-0 border-none z-10">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover z-0 m-0 p-0 border-none scale-[1.05] origin-center" 
          style={{ filter: 'grayscale(100%)' }}
        />
        
        <div className="absolute inset-0 w-full h-full bg-black/40 z-0 m-0 p-0 border-none pointer-events-none scale-[1.05] origin-center" />

        <div className="absolute top-[30%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-full lg:static lg:flex lg:flex-col lg:justify-center lg:h-full lg:px-24 lg:translate-y-0 z-10 pointer-events-none">
          <div className="w-full max-w-[1600px] mx-auto flex justify-center">
            <h1 className="flex flex-col text-center items-center w-full relative h-[200px] justify-center">
              <AnimatePresence mode="wait">
                {videoPhase === 'skull' ? (
                  <m.span 
                    key="skull-text"
                    initial={{ opacity: 0, filter: 'blur(12px)', y: 10 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    exit={{ opacity: 0, filter: 'blur(12px)', y: -10 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ fontFamily: 'var(--font-sans)' }} 
                    className="absolute text-[18px] lg:text-[clamp(1.75rem,5vw,4rem)] font-[400] text-[rgba(255,255,255,0.55)] lg:text-white/90 leading-tight lg:leading-[0.95] tracking-[5px] uppercase text-center"
                  >
                    Sua origem,
                  </m.span>
                ) : (
                  <m.span 
                    key="woman-text"
                    initial={{ opacity: 0, y: 20, clipPath: 'inset(100% 0 0 0)' }}
                    animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 -20% 0)' }}
                    exit={{ opacity: 0, y: -20, clipPath: 'inset(0 0 100% 0)' }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{ fontFamily: 'var(--font-serif)' }} 
                    className="absolute text-[42px] lg:text-[clamp(3.75rem,11vw,10rem)] font-[300] text-[#ffffff] leading-[1.1] lg:leading-[0.95] tracking-normal lowercase first-letter:uppercase text-center"
                  >
                    Seu sorriso.
                  </m.span>
                )}
              </AnimatePresence>
            </h1>
          </div>
        </div>

        <div className="absolute bottom-[40px] left-0 right-0 w-full flex justify-center z-20">
          <a style={{ fontFamily: 'var(--font-sans)' }} href="#sobre" className="inline-flex items-center justify-center bg-transparent border border-[rgba(255,255,255,0.25)] rounded-full px-[32px] py-[10px] hover:bg-white/10 transition-colors z-20 whitespace-nowrap text-[rgba(255,255,255,0.55)] text-[11px] tracking-[4px] font-[400] uppercase backdrop-blur-md">
            AGENDAR CONSULTA &rarr;
          </a>
        </div>
      </section>
    </div>
  );
}
