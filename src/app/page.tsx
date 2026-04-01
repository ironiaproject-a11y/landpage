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
  const heroContentRef = useRef<HTMLDivElement>(null);

  // Direct Refs for synced typography
  const originTextRef = useRef<HTMLParagraphElement>(null);
  const smileTextRef  = useRef<HTMLHeadingElement>(null);
  const [isActuallyPlaying, setIsActuallyPlaying] = useState(false);

  /* ─── VIDEO AUTOPLAY (MOBILE AUDIO UNLOCK) ─────────────────────── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure all mobile-critical attributes are set programmatically
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    // ── iOS AudioContext UNLOCK TRICK ─────────────────────────────────
    const unlockAudio = () => {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ac = new AudioCtx();
          ac.resume().then(() => ac.close()).catch(() => {});
        }
      } catch { /* ignore */ }
    };
    unlockAudio();

    // ── INTERAÇÃO DO USUÁRIO COMO FALLBACK ────────────────────────────
    const onInteraction = () => {
      unlockAudio();
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("touchstart", onInteraction);
    };
    window.addEventListener("pointerdown", onInteraction, { passive: true });
    window.addEventListener("touchstart", onInteraction, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("touchstart", onInteraction);
    };
  }, []);

  /* ─── GSAP UNIFIED MASTER TIMELINE ───────────────────────────────── */
  useEffect(() => {
    const video       = videoRef.current;
    const container   = containerRef.current;
    const heroContent = heroContentRef.current;
    const originText  = originTextRef.current;
    const smileText   = smileTextRef.current;
    
    if (!video || !container || !heroContent || !originText || !smileText) return;

    const ctx = gsap.context(() => {
      let isInit = false;

      const initMasterTimeline = () => {
        if (isInit) return;
        isInit = true;

        let pollCount = 0;
        const MAX_POLLS = 30;

        const buildTimelines = (duration: number) => {
          const safeEnd = duration > 0.1 ? duration - 0.05 : duration;

          // ── PROXY & STATE ──
          const proxy = { time: 0 };

          // ── EXPLICIT INITIAL STATES ──
          gsap.set(originText, { opacity: 1, y: 0 });
          gsap.set(smileText,  { opacity: 0, y: 20 });
          gsap.set(video, { opacity: 1 });

          // ── THE MASTER TIMELINE ──
          // It handles the entire "Sua Origem -> Seu Sorriso" narrative.
          const mainTl = gsap.timeline({ 
            paused: true,
            onUpdate: () => {
              if (video && !isNaN(proxy.time)) {
                video.currentTime = proxy.time;
              }
            }
          });

          // Text animations synced to the video duration
          mainTl.fromTo(originText,
            { opacity: 1, y: 0 },
            { opacity: 0, y: -30, duration: duration * 0.4, ease: "power2.inOut" }, 0);

          mainTl.fromTo(smileText,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: duration * 0.25, ease: "power2.out" }, duration * 0.75);

          // The "Driver": animates proxy.time which in turn updates video.currentTime
          mainTl.fromTo(proxy, { time: 0 }, { time: safeEnd, duration: duration, ease: "none" }, 0);

          // ── VIDEO PRIMING (Critical for Mobile Seeking) ──
          // We call play() then pause() immediately to notify the browser that seeking will start.
          video.play().then(() => {
            video.pause();
            
            // ── PHASE 1: MECHANICAL INTRO ──
            mainTl.play();
          }).catch(() => {
            // Fallback for strict autoplay blocks: just start the timeline
            mainTl.play();
          });

          // ── PHASE 2: MANUAL SCROLL HANDOVER ──
          let st: ScrollTrigger | null = null;
          const setupScroll = () => {
             if (st) return;
             st = ScrollTrigger.create({
               trigger: container,
               start: "top top",
               end: "bottom bottom",
               scrub: 1.2,
               animation: mainTl,
               invalidateOnRefresh: true,
             });
          };

          mainTl.eventCallback("onComplete", setupScroll);

          // Interrupt Intro on Scroll
          const onScrollInterrupt = () => {
            if (window.scrollY > 50) {
              mainTl.pause();
              setupScroll();
              window.removeEventListener("scroll", onScrollInterrupt);
            }
          };
          window.addEventListener("scroll", onScrollInterrupt, { passive: true });
        };

        // Polling until duration is available
        const pollDuration = () => {
          const d = video.duration;
          if (isFinite(d) && d > 0) {
            buildTimelines(d);
          } else if (pollCount < MAX_POLLS) {
            pollCount++;
            setTimeout(pollDuration, 100);
          } else {
            buildTimelines(4.8); // Robust mobile fallback (most hero videos are ~5s)
          }
        };
        pollDuration();
      };

      if (video.readyState >= 1) {
        initMasterTimeline();
      } else {
        video.addEventListener("loadedmetadata", initMasterTimeline);
      }

      const safetyId = setTimeout(initMasterTimeline, 2000);
      return () => {
        clearTimeout(safetyId);
        video.removeEventListener("loadedmetadata", initMasterTimeline);
      };
    });

    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      ctx.revert();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main className="w-full bg-[#0D0D0D] overflow-x-clip">

      {/* ── HERO — NATIVE STICKY WRAPPER ─────────────────── */}
      <div
        ref={containerRef}
        className="hero-trigger bg-[#0D0D0D]"
        style={{
          position: "relative",
          height: "300vh", // SCROLL SCRUB DISTANCE
          width: "100%",
          zIndex: 10,
        }}
      >
        <div
          className="sticky-wrapper"
          style={{
            position: "sticky",
            top: 0,
            left: 0,
            height: "100dvh",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            pointerEvents: "auto",
          }}
        >
          {/* Main Visual Video directly embedded */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            /* @ts-ignore - non-standard WebKit prop */
            webkit-playsinline="true"
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            preload="auto"
            style={{
              position:       "absolute",
              top:            0,
              left:           0,
              width:          "100vw",
              height:         "100dvh",
              objectFit:      "cover",
              objectPosition: "center",
              zIndex:         0,
              pointerEvents:  "none",
              willChange:     "transform, filter",
              opacity:        1,
              transform:      "scale(1.3) translateZ(0)",
              filter:         "grayscale(1) contrast(1.1) brightness(0.5)",
            }}
          >
            <source src="/hero-background-new.mp4" type="video/mp4" />
          </video>

          {/* ── NUCLEAR VIDEO CONTROLS SUPPRESSION ── */}
          <style dangerouslySetInnerHTML={{ __html: `
            video::-webkit-media-controls { display: none !important; -webkit-appearance: none; }
            video::-webkit-media-controls-enclosure { display: none !important; }
            video::-webkit-media-controls-panel { display: none !important; }
            video::-webkit-media-controls-play-button { display: none !important; -webkit-appearance: none; }
            video::-webkit-media-controls-overlay-play-button { display: none !important; -webkit-appearance: none; opacity: 0 !important; pointer-events: none !important; }
            video::-webkit-media-controls-start-playback-button { display: none !important; -webkit-appearance: none; opacity: 0 !important; pointer-events: none !important; }
            video::-internal-media-controls-download-button { display: none !important; }
            video::-internal-media-controls-overflow-button { display: none !important; }
            video::-webkit-media-controls-container { display: none !important; }
          `}} />

          {/* Gradient layers */}
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)", zIndex:1, pointerEvents:"none" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 20%, transparent 40%)", zIndex:1, pointerEvents:"none" }} />
          <div style={{ background:"radial-gradient(circle at center, rgba(0,0,0,0.5) 0%, transparent 70%)", position:"absolute", top:"40%", left:"50%", transform:"translate(-50%, -50%)", width:"90%", height:"50%", zIndex:1, pointerEvents:"none" }} />

          {/* ── Hero Content ── */}
          <div ref={heroContentRef} className="hero-content-split" style={{ pointerEvents: "auto", position: 'relative', height: '100%', zIndex: 2 }}>

            <div className="hero-text-group">
              <p ref={originTextRef} className="hero-overline">SUA ORIGEM,</p>
              <h1 ref={smileTextRef} className="hero-headline">
                Seu sorriso<span className="hero-period">.</span>
              </h1>
            </div>

            <div className="hero-action-group">

              <PremiumReveal type="fade" direction="bottom" delay={0.5}>
                <p className="hero-subheadline" style={{ opacity: 0, pointerEvents: 'none', userSelect: 'none' }}>
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
      </div>

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
