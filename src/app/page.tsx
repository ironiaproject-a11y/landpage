"use client";

import nextDynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ServicesSkeleton, CaseStudiesSkeleton, TestimonialsSkeleton } from "@/components/SectionSkeletons";
import { InstitutionalTrust } from "@/components/InstitutionalTrust";
import { Agendamento } from "@/components/Agendamento";

const About = nextDynamic(() => import("@/components/About").then(mod => mod.About), { 
  ssr: false, 
  loading: () => <div className="h-screen bg-[#0D0D0D]" />
});
const TrustBar = nextDynamic(() => import("@/components/TrustBar").then(mod => mod.TrustBar), { 
  ssr: false,
  loading: () => <div className="h-10 bg-[#0D0D0D]" />
});
const Services = nextDynamic(() => import("@/components/Services").then(mod => mod.Services), {
  ssr: false,
  loading: () => <ServicesSkeleton />
});
const CaseStudies = nextDynamic(() => import("@/components/CaseStudies").then(mod => mod.CaseStudies), {
  ssr: false,
  loading: () => <CaseStudiesSkeleton />
});
const Specialist = nextDynamic(() => import("@/components/Specialist").then(mod => mod.Specialist), { 
  ssr: false,
  loading: () => <div className="h-screen bg-[#0D0D0D]" />
});
const Experience = nextDynamic(() => import("@/components/Experience").then(mod => mod.Experience), { 
  ssr: false,
  loading: () => <div className="h-screen bg-[#0D0D0D]" />
});
const Amenities = nextDynamic(() => import("@/components/Amenities").then(mod => mod.Amenities), { 
  ssr: false,
  loading: () => <div className="h-screen bg-[#0D0D0D]" />
});
const Testimonials = nextDynamic(() => import("@/components/Testimonials").then(mod => mod.Testimonials), {
  ssr: false,
  loading: () => <TestimonialsSkeleton />
});
const FAQ = nextDynamic(() => import("@/components/FAQ").then(mod => mod.FAQ), { 
  ssr: false,
  loading: () => <div className="h-40 bg-[#0D0D0D]" />
});
const Stats = nextDynamic(() => import("@/components/Stats").then(mod => mod.Stats), {
  ssr: false,
  loading: () => <div className="h-40 bg-[#0D0D0D] -mt-[10vh]" />
});
const Footer = nextDynamic(() => import("@/components/Footer").then(mod => mod.Footer), { ssr: false });

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  const frameObj = useRef({ index: 0 });
  const [videoPhase, setVideoPhase] = useState<'skull' | 'woman'>('skull');
  const frameCount = 145;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.getById("heroScroll")?.kill(true);
    ScrollTrigger.refresh();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const ctx = gsap.context(() => {
      let loadedCount = 0;
      const criticalFrames = 30;

      const onImageLoad = () => {
        loadedCount++;
        if (loadedCount === criticalFrames) {
          render(0);
        }
        if (loadedCount === frameCount) {
          window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
        }
      };

      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.onload = onImageLoad;
        img.onerror = onImageLoad;
        img.src = `/hero-frames/frame_${i.toString().padStart(3, "0")}_delay-0.041s.png`;
        imagesRef.current[i] = img;
      }

      const render = (index: number) => {
        const roundedIndex = Math.min(Math.round(index), frameCount - 1);
        const img = imagesRef.current[roundedIndex];
        if (img && img.complete) {
          const { width, height } = canvas;
          const imgRatio = img.width / img.height;
          const canvasRatio = width / height;
          let dWidth, dHeight, dx, dy;
          if (imgRatio > canvasRatio) {
            dHeight = height; dWidth = dHeight * imgRatio;
            dx = (width - dWidth) / 2; dy = 0;
          } else {
            dWidth = width; dHeight = dWidth / imgRatio;
            dx = 0; dy = (height - dHeight) / 2;
          }
          context.clearRect(0, 0, width, height);
          context.drawImage(img, dx, dy, dWidth, dHeight);
        }
      };

      const updateFrame = () => {
        const idx = frameObj.current.index;
        render(idx);
        const nextPhase = idx >= 75 ? 'woman' : 'skull';
        setVideoPhase(prev => (prev !== nextPhase ? nextPhase : prev));
      };

      const handleResize = () => {
        if (!canvas) return;
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        updateFrame();
      };
      window.addEventListener("resize", handleResize);
      handleResize();

      const scrubTrigger = ScrollTrigger.create({
        id: "heroScroll",
        trigger: scrollContainerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const targetIdx = self.progress * (frameCount - 1);
          frameObj.current.index = targetIdx;
          updateFrame();
        }
      });

      (scrollContainerRef as any).__scrubTrigger = scrubTrigger;

      let introTween: any = null;
      const startIntro = () => {
        const lenis = (window as any).lenis;
        if (!lenis) return;
        const targetScroll = scrubTrigger.end;
        lenis.scrollTo(targetScroll, {
          duration: 3.5,
          easing: (t: number) => t,
          onComplete: () => {
            frameObj.current.index = frameCount - 1;
            updateFrame();
            introTween = null;
          }
        });
        introTween = true;
      };

      const handleUserScroll = () => {
        const lenis = (window as any).lenis;
        if (introTween && lenis) {
          lenis.stop();
          lenis.start();
          introTween = null;
        }
      };
      window.addEventListener("wheel", handleUserScroll, { passive: true });
      window.addEventListener("touchstart", handleUserScroll, { passive: true });

      let introStarted = false;
      const onPreloaderExit = () => {
        if (introStarted) return;
        introStarted = true;
        setTimeout(startIntro, 400);
      };
      window.addEventListener("preloader-exiting", onPreloaderExit);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("wheel", handleUserScroll);
        window.removeEventListener("touchstart", handleUserScroll);
        window.removeEventListener("preloader-exiting", onPreloaderExit);
      };
    });

    return () => {
      const st = (scrollContainerRef as any).__scrubTrigger;
      if (st) st.kill(true);
      ScrollTrigger.getById("heroScroll")?.kill(true);
      ctx.revert();
    };
  }, []);

  return (
    <main className="w-full bg-[#0D0D0D] overflow-x-clip">
      {/* Hero Section – Video Background */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          overflow: 'hidden',
        }}
      >
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
          src="/hero-background-new.mp4"
        />

        {/* Gradient overlay – bottom 65% */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '65%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.92) 40%, transparent 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Text Zone */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: '2.5rem',
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontSize: '9px',
              fontWeight: 300,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '0.35rem',
              fontFamily: "'Barlow', sans-serif",
            }}
          >
            Sua origem
          </p>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.6rem, 10vw, 4rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#fff',
              lineHeight: 1.05,
              marginBottom: '0.75rem',
            }}
          >
            Seu sorriso.
          </h1>

          {/* Body */}
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '13px',
              fontWeight: 300,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.5)',
              maxWidth: '28ch',
              marginBottom: '1.5rem',
            }}
          >
            Odontologia de alta performance onde a excelência encontra a precisão biológica.
          </p>

          {/* CTA Pill */}
          <a
            href="#agendamento"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.65rem 1.5rem',
              background: 'rgba(255,255,255,0.1)',
              border: '0.5px solid rgba(255,255,255,0.2)',
              borderRadius: '40px',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 300,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontFamily: "'Barlow', sans-serif",
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#fff',
                opacity: 0.7,
                flexShrink: 0,
              }}
            />
            Agendar consulta
          </a>

          {/* Scroll Hint */}
          <p
            style={{
              fontSize: '9px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)',
              marginTop: '0.75rem',
              fontFamily: "'Barlow', sans-serif",
            }}
          >
            role para explorar ↓
          </p>
        </div>
      </section>

      {/* Main Content Sections Reordered for Conversion */}
      <div className="relative z-30 bg-[#0D0D0D]">
        <Services />
        <Stats />
        <TrustBar />
        <InstitutionalTrust />
        <About />
        <Specialist />
        <Experience />
        <Amenities />
        <CaseStudies />
        <Testimonials />
        <FAQ />
        <Agendamento />
        <Footer />
      </div>
    </main>
  );
}
