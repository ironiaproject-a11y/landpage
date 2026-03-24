"use client";

import nextDynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const About = nextDynamic(() => import("@/components/About").then(mod => mod.About), { ssr: false });
const InstitutionalTrust = nextDynamic(() => import("@/components/InstitutionalTrust").then(mod => mod.InstitutionalTrust), { ssr: false });
const TrustBar = nextDynamic(() => import("@/components/TrustBar").then(mod => mod.TrustBar), { ssr: false });
const Services = nextDynamic(() => import("@/components/Services").then(mod => mod.Services), { ssr: false });
const CaseStudies = nextDynamic(() => import("@/components/CaseStudies").then(mod => mod.CaseStudies), { ssr: false });
const Specialist = nextDynamic(() => import("@/components/Specialist").then(mod => mod.Specialist), { ssr: false });
const Experience = nextDynamic(() => import("@/components/Experience").then(mod => mod.Experience), { ssr: false });
const Amenities = nextDynamic(() => import("@/components/Amenities").then(mod => mod.Amenities), { ssr: false });
const Testimonials = nextDynamic(() => import("@/components/Testimonials").then(mod => mod.Testimonials), { ssr: false });
const FAQ = nextDynamic(() => import("@/components/FAQ").then(mod => mod.FAQ), { ssr: false });
const CTA = nextDynamic(() => import("@/components/CTA").then(mod => mod.CTA), { ssr: false });
const Contact = nextDynamic(() => import("@/components/Contact").then(mod => mod.Contact), { ssr: false });
const Stats = nextDynamic(() => import("@/components/Stats").then(mod => mod.Stats), { ssr: false });
const Footer = nextDynamic(() => import("@/components/Footer").then(mod => mod.Footer), { ssr: false });

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [videoPhase, setVideoPhase] = useState<'skull' | 'woman'>('skull');
  const frameCount = 145;

  // Optimized Render Logic
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    // Load images
    const loadImages = () => {
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = `/hero-frames/frame_${i.toString().padStart(3, "0")}_delay-0.041s.png`;
        imagesRef.current[i] = img;
      }
    };
    loadImages();

    const render = (index: number) => {
      const img = imagesRef.current[Math.floor(index)];
      if (img && img.complete) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw image cover-style
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
        let dWidth, dHeight, dx, dy;

        if (imgRatio > canvasRatio) {
          dHeight = canvas.height;
          dWidth = dHeight * imgRatio;
          dx = (canvas.width - dWidth) / 2;
          dy = 0;
        } else {
          dWidth = canvas.width;
          dHeight = dWidth / imgRatio;
          dx = 0;
          dy = (canvas.height - dHeight) / 2;
        }

        context.drawImage(img, dx, dy, dWidth, dHeight);
      }
    };

    // Responsive Canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      render(state.frame);
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const state = { frame: 0 };

    const phaseRef = useRef(videoPhase);
    useEffect(() => {
      phaseRef.current = videoPhase;
    }, [videoPhase]);

    // Hybrid Timeline Logic
    const mainTl = gsap.timeline();

    // 1. Cinematic Intro (Frames 0-75)
    mainTl.to(state, {
      frame: 75,
      duration: 3,
      ease: "power2.inOut",
      onUpdate: () => {
        render(state.frame);
        // Sync text phase via Ref check and state update
        if (state.frame < 75 && phaseRef.current !== 'skull') setVideoPhase('skull');
        if (state.frame >= 75 && phaseRef.current !== 'woman') setVideoPhase('woman');
      }
    });

    // 2. Scroll-Activated Scrub (Frames 75-144)
    mainTl.to(state, {
      frame: 144,
      scrollTrigger: {
        trigger: scrollContainerRef.current,
        start: "top top",
        end: "+=200%",
        scrub: 1,
        pin: containerRef.current,
        onUpdate: (self) => {
          const currentFrame = 75 + (self.progress * (144 - 75));
          if (currentFrame >= 75 && phaseRef.current !== 'woman') setVideoPhase('woman');
          if (currentFrame < 75 && phaseRef.current !== 'skull') setVideoPhase('skull');
          render(currentFrame);
        }
      }
    });

    // Initial Draw
    imagesRef.current[0].onload = () => render(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []); // Strictly empty to avoid re-triggering intro

  return (
    <main className="w-full m-0 p-0 border-none overflow-x-hidden">
      {/* Scroll Container - Defines the scrollable area for pinning */}
      <div ref={scrollContainerRef} className="relative w-full z-10">
        <section ref={containerRef} className="relative w-full h-[100vh] overflow-hidden bg-black text-white m-0 p-0 border-none">
          {/* Optimized Canvas Background */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full object-cover z-0 m-0 p-0 border-none scale-[1.05] origin-center" 
            style={{ filter: 'grayscale(100%)' }}
          />
          
          <div className="absolute inset-0 w-full h-full bg-black/40 z-0 m-0 p-0 border-none pointer-events-none scale-[1.05] origin-center" />

          {/* Typography - Maintained top-[30%] positioning */}
          <div className="absolute top-[30%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-full lg:static lg:flex lg:flex-col lg:justify-center lg:h-full lg:px-24 lg:translate-y-0 z-10">
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

          {/* Action Button */}
          <div className="absolute bottom-[40px] left-0 right-0 w-full flex justify-center z-20">
            <a style={{ fontFamily: 'var(--font-sans)' }} href="#sobre" className="inline-flex items-center justify-center bg-transparent border border-[rgba(255,255,255,0.25)] rounded-full px-[32px] py-[10px] hover:bg-white/10 transition-colors z-20 whitespace-nowrap text-[rgba(255,255,255,0.55)] text-[11px] tracking-[4px] font-[400] uppercase backdrop-blur-md">
              AGENDAR CONSULTA &rarr;
            </a>
          </div>
        </section>
      </div>

      <div className="relative z-20">
        <Stats />
        <About />
        <InstitutionalTrust />
        <TrustBar />
        <Services />
        <CaseStudies />
        <Specialist />
        <Experience />
        <Amenities />
        <Testimonials />
        <FAQ />
        <CTA />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
