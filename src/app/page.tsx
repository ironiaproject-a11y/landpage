"use client";

import nextDynamic from "next/dynamic";
import { useRef, useEffect, useState } from "react";
import { ServicesSkeleton, CaseStudiesSkeleton, TestimonialsSkeleton } from "@/components/SectionSkeletons";
import { InstitutionalTrust } from "@/components/InstitutionalTrust";
import { Agendamento } from "@/components/Agendamento";
import { PremiumReveal } from "@/components/PremiumReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ─── register gsap ─────────────────────────────────────────── */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { TrustBar } from "@/components/TrustBar";

const About = nextDynamic(() => import("@/components/About").then(mod => mod.About), {
  ssr: false,
  loading: () => <div className="h-screen bg-[#0D0D0D]" />,
});
const CaseStudies = nextDynamic(() => import("@/components/CaseStudies").then(mod => mod.CaseStudies), {
  ssr: false,
  loading: () => <CaseStudiesSkeleton />,
});
const Specialist = nextDynamic(() => import("@/components/Specialist").then(mod => mod.Specialist), {
  ssr: false,
  loading: () => <div className="h-screen bg-[#0D0D0D]" />,
});
const Experience = nextDynamic(() => import("@/components/Experience").then(mod => mod.Experience), {
  ssr: false,
  loading: () => <div className="h-screen bg-[#0D0D0D]" />,
});
const Amenities = nextDynamic(() => import("@/components/Amenities").then(mod => mod.Amenities), {
  ssr: false,
  loading: () => <div className="h-screen bg-[#0D0D0D]" />,
});
const Testimonials = nextDynamic(() => import("@/components/Testimonials").then(mod => mod.Testimonials), {
  ssr: false,
  loading: () => <TestimonialsSkeleton />,
});
const FAQ = nextDynamic(() => import("@/components/FAQ").then(mod => mod.FAQ), {
  ssr: false,
  loading: () => <div className="h-40 bg-[#0D0D0D]" />,
});
const Footer = nextDynamic(() => import("@/components/Footer").then(mod => mod.Footer), { ssr: false });


export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  // Direct Refs for synced typography
  const originTextRef = useRef<HTMLParagraphElement>(null);
  const smileTextRef  = useRef<HTMLHeadingElement>(null);
  const [isActuallyPlaying, setIsActuallyPlaying] = useState(false);

  /* ─── VIDEO AUTOPLAY ─────────────────────────────────────────────── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force muted — required for autoplay in all browsers
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const tryPlay = () => video.play().catch(() => {});

    // FETCH VIDEO AS BLOB FOR STUTTER-FREE SCRUBBING
    // (Removed to fix "demora para começar" issue. Using direct streaming for instant start!)
    
    // Attempt 1: once data starts flowing or mounts
    tryPlay();

    // Attempt 2: once enough data is buffered
    video.addEventListener("canplay", tryPlay, { once: true });
    video.addEventListener("loadeddata", tryPlay, { once: true });

    // Attempt 3: on first user interaction of ANY kind (covers strict autoplay policies)
    const onInteraction = () => {
      tryPlay();
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("keydown", onInteraction);
    };
    window.addEventListener("pointerdown", onInteraction, { passive: true });
    window.addEventListener("keydown", onInteraction, { passive: true });

    // Signal preloader that assets are ready
    const onLoaded = () => window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
    video.addEventListener("canplay", onLoaded, { once: true });
    // Safety net: fire after 4 s regardless
    const safetyId = setTimeout(onLoaded, 4000);

    // Event listeners to detect real play state
    const onPlay  = () => setIsActuallyPlaying(true);
    const onPause = () => setIsActuallyPlaying(false);
    const onEnded = () => setIsActuallyPlaying(false);
    const onWaiting = () => setIsActuallyPlaying(false);

    video.addEventListener("playing", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("waiting", onWaiting);

    let rafId: number;
    let rvfcId: number;

    const drawFrame = () => {
      const canvas = canvasRef.current;
      if (video && canvas) {
        const ctx = canvas.getContext("2d", { alpha: false });
        if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }
          if (video.readyState >= 2) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          }
        }
      }
    };

    const renderCanvasRaf = () => {
      drawFrame();
      rafId = requestAnimationFrame(renderCanvasRaf);
    };

    const renderCanvasRvfc = () => {
      drawFrame();
      // @ts-ignore
      rvfcId = video.requestVideoFrameCallback(renderCanvasRvfc);
    };

    // Use native video frame syncing if available
    // @ts-ignore
    if ("requestVideoFrameCallback" in video) {
      // @ts-ignore
      rvfcId = video.requestVideoFrameCallback(renderCanvasRvfc);
    } else {
      renderCanvasRaf();
    }

    // Force autoplay retry loop - keeps trying to play until it works
    let playAttempts = 0;
    const playRetry = setInterval(() => {
      if (video.paused && playAttempts < 20) {
        video.play().catch(() => {});
        playAttempts++;
      } else if (!video.paused) {
        clearInterval(playRetry);
      }
    }, 500);

    return () => {
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", onLoaded);
      video.removeEventListener("playing", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("waiting", onWaiting);
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("keydown", onInteraction);
      clearTimeout(safetyId);
      clearInterval(playRetry);
      cancelAnimationFrame(rafId);
      // @ts-ignore
      if (rvfcId && "cancelVideoFrameCallback" in video) video.cancelVideoFrameCallback(rvfcId);
    };
  }, []);

  /* ─── GSAP UNIFIED MASTER TIMELINE ───────────────────────────────── */
  useEffect(() => {
    const video       = videoRef.current;
    const canvas      = canvasRef.current;
    const container   = containerRef.current;
    const heroContent = heroContentRef.current;
    const originText  = originTextRef.current;
    const smileText   = smileTextRef.current;
    
    if (!video || !canvas || !container || !heroContent || !originText || !smileText) return;

    const ctx = gsap.context(() => {
      let isInit = false;
      let intro: gsap.core.Timeline;

      const initMasterTimeline = () => {
        if (isInit) return;
        isInit = true;
        const duration = video.duration || 5;
        
        // AUTO-PLAY RE-FORCE
        video.muted = true;
        video.play().catch(() => {});

        // 1. PROXY & DEFINITIVE STATE
        // The "Berlin Wall" approach: Separate controllers that never fight.
        const proxy = { time: 0 };
        let isManualMode = false;
        const safeEnd = duration > 0.1 ? duration - 0.05 : duration;

        // 2. CINEMATIC INTRO (AUTO-PLAY ON LOAD) — Created first to be available for control
        intro = gsap.timeline({ 
          delay: 0.1,
          onComplete: () => { 
            isManualMode = true; 
            video.play().catch(() => {});
          }
        });

        // Cinematic Entrance animation for the hero container
        intro.to(container, 
          { opacity: 1, scale: 1, y: 0, duration: 1.8, ease: "expo.out" }
        );

        // Intro scrub of the proxy (manages video.currentTime)
        intro.fromTo(proxy, 
          { time: 0 },
          { 
            time: safeEnd, 
            duration: 4.5, 
            ease: "power1.inOut",
            onUpdate: () => {
              if (!isManualMode && video && !isNaN(proxy.time)) {
                video.currentTime = proxy.time;
              }
            }
          },
          0.1
        );

        // Sync text animations within the same flow
        intro.fromTo(originText,
          { opacity: 1, y: 0, filter: "blur(0px)" },
          { opacity: 0, y: -20, filter: "blur(10px)", duration: 1.8, ease: "power2.inOut" },
          1.8
        );

        intro.fromTo(smileText,
          { opacity: 0, y: 20, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.8, ease: "power2.out" },
          2.4
        );

        // Functional hand-off helper
        const switchToManual = () => {
          if (isManualMode) return;
          isManualMode = true;
          if (intro && intro.isActive()) {
            intro.kill();
          }
        };

        // 3. MASTER TIMELINE (SCROLL-DRIVEN)
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger:       container,
            start:         "top top",
            end:           "+=1200", 
            pin:           true,
            scrub:         1.8, 
            anticipatePin: 1.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // If the user actively scrolls (direction != 0), take over command immediately.
              // This avoids triggering manual mode on pure load/refresh if scroll is slightly offset.
              if (self.direction !== 0 && self.progress > 0.005 && !isManualMode) {
                switchToManual();
              }
            }
          }
        });

        // The Scroll-driven transformation (only active when isManualMode is true)
        masterTl.to(proxy, { 
          time: safeEnd, 
          duration: 1, 
          ease: "none",
          onUpdate: () => {
             if (isManualMode && video && !isNaN(proxy.time)) {
               video.currentTime = proxy.time;
             }
          }
        }, 0);
        
        masterTl.fromTo(canvas, 
          { scale: 1.1, filter: "grayscale(1) contrast(1.1) brightness(0.7)" }, 
          { scale: 1.35, filter: "grayscale(1) contrast(1.1) brightness(0.4)", duration: 1, ease: "none" }, 
        0);

        // Phrase 1 (Sua Origem) -> From 0 to 0.5 (Skull phase)
        masterTl.fromTo(originText, 
          { opacity: 1, y: 0, filter: "blur(0px)" },
          { opacity: 0, y: -30, filter: "blur(10px)", duration: 0.5, ease: "power2.inOut" }, 0);

        // Phrase 2 (Seu Sorriso) -> From 0.45 to end (Woman phase)
        // Overlapping at 0.45-0.5 ensures no "empty" frames during text crossfade
        masterTl.fromTo(smileText, 
          { opacity: 0, y: 20, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power2.out" }, 0.45);

        // Final Fade Out starts closer to the end of the scroll
        masterTl.to(container, { opacity: 0, duration: 0.25, ease: "power1.in" }, 0.82);

        // Click fallback for interaction
        container.addEventListener("click", () => {
          video.play().catch(() => {});
        }, { once: true });
        container.addEventListener("touchstart", () => {
          video.play().catch(() => {});
        }, { once: true });
      };

      // Ensure buffer is ready for scrubbing (canplaythrough is more reliable than loadedmetadata on mobile)
      if (video.readyState >= 4) {
        initMasterTimeline();
      } else {
        video.oncanplaythrough = initMasterTimeline;
      }
      
      // Safety net
      const safetyId = setTimeout(initMasterTimeline, 2000);
      return () => clearTimeout(safetyId);
    });

    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      ctx.revert();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main className="w-full bg-[#0D0D0D] overflow-x-clip">

      {/* ── HERO — Pinned by GSAP ─────────────────────────── */}
      <div
        ref={containerRef}
        className="hero-container-reset"
        style={{
          position:       "relative",
          top:            "-60px",
          left:           0,
          height:         "calc(100svh + 60px)",
          width:          "100vw",
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "space-between",
          overflow:       "hidden",
          zIndex:         10,       // Changed from 999 to 10 so Main Sections (30) can overlap it
          willChange:     "opacity, transform, filter",
          pointerEvents:  "auto",
          opacity:        0,
          transform:      "scale(1.05) translateY(30px)",
        }}
      >
        {/*
          ⚠️  GHOST-LOADING FIX
          The initial inline styles (opacity:0, scale:1.4, filter blur) are applied
          synchronously at render time. GSAP then uses gsap.to() to animate FROM
          these values — so the video is never briefly visible in its raw state.
        */}
        {/* 
            HIDDEN VIDEO ELEMENT 
            We keep the video in the DOM to trigger loads, sound, and playhead data.
            But we visually hide it so the OS never attempts to overlay a native UI.
        */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          /* @ts-ignore - non-standard WebKit prop */
          webkit-playsinline="true"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          style={{
            position:       "fixed",
            top:            "-9999px",
            left:           "-9999px",
            opacity:        0.0001,
            pointerEvents:  "none",
            width:          "10px",
            height:         "10px",
            zIndex:         -99
          }}
        >
          <source src="/Aqui.mp4" type="video/mp4" />
        </video>

        {/* 
            CANVAS VISUAL PROXY 
            Draws the video frames. Bypasses all iOS native playback UI limits.
        */}
        <canvas
          ref={canvasRef}
          style={{
            position:       "absolute",
            inset:          0,
            width:          "100%",
            transition:     "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)", // Silky smooth entrance
            objectFit:      "cover",
            objectPosition: "33% 35%",
            zIndex:         0,
            willChange:     "transform, filter, opacity",
            pointerEvents:  "none",
            opacity:   1, // Opacity is now controlled by the initial GSAP state and Entrance animation
            transform: "scale(1.25) translateY(-30px)",
            filter:    "grayscale(1) contrast(1.1) brightness(0.5) blur(0px)",
            height:    "120%", 
            top:       "-10%", 
          }}
        />

        {/* ── NUCLEAR VIDEO CONTROLS SUPPRESSION ── */}
        <style dangerouslySetInnerHTML={{ __html: `
          video::-webkit-media-controls {
            display: none !important;
            -webkit-appearance: none;
          }
          video::-webkit-media-controls-enclosure {
            display: none !important;
          }
          video::-webkit-media-controls-panel {
            display: none !important;
          }
          video::-webkit-media-controls-play-button {
            display: none !important;
            -webkit-appearance: none;
          }
          video::-webkit-media-controls-overlay-play-button {
            display: none !important;
            -webkit-appearance: none;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          video::-webkit-media-controls-start-playback-button {
            display: none !important;
            -webkit-appearance: none;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          video::-internal-media-controls-download-button {
            display: none !important;
          }
          video::-internal-media-controls-overflow-button {
            display: none !important;
          }
          video::-webkit-media-controls-container {
            display: none !important;
          }
        `}} />

        {/* Gradient layers */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)", zIndex:1, pointerEvents:"none" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 20%, transparent 40%)", zIndex:1, pointerEvents:"none" }} />
        <div style={{ background:"radial-gradient(circle at center, rgba(0,0,0,0.5) 0%, transparent 70%)", position:"absolute", top:"40%", left:"50%", transform:"translate(-50%, -50%)", width:"90%", height:"50%", zIndex:1, pointerEvents:"none" }} />

        {/* ── Hero Content ── */}
        <div ref={heroContentRef} className="hero-content-split" style={{ pointerEvents: "auto" }}>

          <div className="hero-text-group">
            <p ref={originTextRef} className="hero-overline">SUA ORIGEM,</p>
            <h1 ref={smileTextRef} className="hero-headline">
              Seu sorriso<span className="hero-period">.</span>
            </h1>
          </div>

          <div className="hero-action-group">
            <PremiumReveal type="fade" direction="bottom" delay={0.5}>
              <p className="hero-subheadline">
                Odontologia de alta performance
              </p>
            </PremiumReveal>
            <PremiumReveal type="fade" direction="bottom" delay={0.65}>
              <a href="#agendamento" className="hero-cta">
                AGENDAR CONSULTA →
              </a>
            </PremiumReveal>
          </div>

        </div>
      </div>

      {/*
        The spacer is no longer needed as the pin distance creates the gap.
      */}

      {/* Main Sections */}
      <div className="relative z-30 bg-[#0D0D0D] pt-16">
        <Stats />
        <Services />
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
