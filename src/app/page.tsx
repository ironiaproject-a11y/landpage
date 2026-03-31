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
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Ensure all mobile-critical attributes are set programmatically
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    // ── CANVAS DRAW LOOP ──────────────────────────────────────────────
    const drawFrame = () => {
      if (!video || !canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
        if (video.readyState >= 2) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
      }
    };
    let rafId: number;
    const startDrawing = () => { drawFrame(); rafId = requestAnimationFrame(startDrawing); };
    startDrawing();

    // ── iOS AudioContext UNLOCK TRICK ─────────────────────────────────
    // iOS Safari requires a user gesture to unlock the audio context.
    // Creating and immediately suspending a silent AudioContext "wakes up"
    // the media engine allowing muted video autoplay to succeed.
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

    // ── PLAY HELPER ───────────────────────────────────────────────────
    const tryPlay = () => {
      if (video.paused) {
        video.play()
          .then(() => { window.dispatchEvent(new CustomEvent("hero-assets-loaded")); })
          .catch(() => { /* Blocked — GSAP scrub handles playback */ });
      }
    };

    // ── RESUMO QUANDO A ABA VOLTA AO FOCO ────────────────────────────
    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // ── INTERAÇÃO DO USUÁRIO COMO FALLBACK ────────────────────────────
    const onInteraction = () => {
      unlockAudio();
      tryPlay();
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("touchstart", onInteraction);
    };
    window.addEventListener("pointerdown", onInteraction, { passive: true });
    window.addEventListener("touchstart", onInteraction, { passive: true });

    // ── DISPARO INICIAL ───────────────────────────────────────────────
    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
      video.addEventListener("loadedmetadata", tryPlay, { once: true });
    }

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("touchstart", onInteraction);
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

        // ── DURATION GUARD ─────────────────────────────────────────────
        // On iOS, video.duration can be NaN until the media engine
        // receives enough data (often blocked without a user gesture).
        // We poll up to 20 × 100ms (~2s); if still NaN we use 5s as a safe default.
        let pollCount = 0;
        const MAX_POLLS = 20;

        const buildTimelines = (duration: number) => {
          const safeEnd = duration > 0.1 ? duration - 0.05 : duration;

          // PROXY & STATE
          const proxy = { time: 0 };
          let isManualMode = false;

          // ── EXPLICIT INITIAL STATES ────────────────────────────────────
          // Ensure both phrases start in their correct state before any
          // animation touches them — prevents flash / wrong initial opacity.
          gsap.set(originText, { opacity: 1, y: 0 });
          gsap.set(smileText,  { opacity: 0, y: 20 });

          // ── CINEMATIC INTRO ────────────────────────────────────────────
          // Drives video.currentTime mechanically via GSAP — bypasses mobile autoplay locks.
          // IMPORTANT: masterTl does NOT exist yet → zero conflicts possible on smileText.
          intro = gsap.timeline();

          intro.fromTo(proxy,
            { time: 0 },
            {
              time: safeEnd,
              duration: duration,
              ease: "none",
              onUpdate: () => {
                if (!isManualMode && video && !isNaN(proxy.time)) {
                  video.currentTime = proxy.time;
                }
              }
            }, 0);

          intro.fromTo(canvas,
            { scale: 1.1, filter: "grayscale(1) contrast(1.1) brightness(0.7)" },
            { scale: 1.35, filter: "grayscale(1) contrast(1.1) brightness(0.4)", duration: duration, ease: "none" },
          0);

          // "Sua Origem" — aparece no início, some na metade
          intro.fromTo(originText,
            { opacity: 1, y: 0 },
            { opacity: 0, y: -30, duration: duration * 0.5, ease: "power2.inOut" }, 0);

          // "Seu Sorriso" — entra na segunda metade, quando a mulher aparece
          intro.fromTo(smileText,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: duration * 0.45, ease: "power2.out" }, duration * 0.45);

          // ── DEFERRED SCROLL SETUP ──────────────────────────────────────
          // FIX DEFINITIVO: masterTl é criado SOMENTE após o intro terminar
          // (ou na primeira rolagem do usuário).
          //
          // Se o masterTl existisse simultaneamente com o intro, o mecanismo
          // de scrub do GSAP (scroll=0 → masterTl.time=0) re-aplicaria o estado
          // inicial de smileText (opacity:0) a cada frame, suprimindo o intro.
          // "immediateRender:false" não resolve — o scrub precisa do masterTl
          // inexistente para não interferir.
          let scrollBuilt = false;

          const setupScrollTimeline = () => {
            if (scrollBuilt) return;
            scrollBuilt = true;

            // Capturar estado visual atual para passar ao scroll sem salto
            const snapScale          = (gsap.getProperty(canvas,     "scale")   as number) || 1.1;
            const snapFilter         = (gsap.getProperty(canvas,     "filter")  as string) || "grayscale(1) contrast(1.1) brightness(0.7)";
            const snapSmileOpacity   = (gsap.getProperty(smileText,  "opacity") as number) ?? 0;
            const snapSmileY         = (gsap.getProperty(smileText,  "y")       as number) ?? 20;
            const snapOriginOpacity  = (gsap.getProperty(originText, "opacity") as number) ?? 1;
            const snapOriginY        = (gsap.getProperty(originText, "y")       as number) ?? 0;

            const masterTl = gsap.timeline({
              scrollTrigger: {
                trigger:             container,
                start:               "top top",
                end:                 "+=1200",
                pin:                 true,
                scrub:               1.8,
                anticipatePin:       1.5,
                invalidateOnRefresh: true,
              }
            });

            // Scroll controla o currentTime do vídeo
            masterTl.fromTo(proxy,
              { time: proxy.time },
              {
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
              { scale: snapScale, filter: snapFilter },
              { scale: 1.35, filter: "grayscale(1) contrast(1.1) brightness(0.4)", duration: 1, ease: "none" },
            0);

            // "Sua Origem" — continua de onde o intro parou
            masterTl.fromTo(originText,
              { opacity: snapOriginOpacity, y: snapOriginY },
              { opacity: 0, y: -30, duration: 0.5, ease: "power2.inOut" }, 0);

            // "Seu Sorriso" — continua de onde o intro parou
            masterTl.fromTo(smileText,
              { opacity: snapSmileOpacity, y: snapSmileY },
              { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.45);

            masterTl.to(container, { opacity: 0, duration: 0.25, ease: "power1.in" }, 0.82);

            ScrollTrigger.refresh();
          };

          // Scroll ativa-se quando o intro termina naturalmente
          intro.eventCallback("onComplete", () => {
            isManualMode = true;
            video.play().catch(() => {});
            setupScrollTimeline();
          });

          // Scroll ativa-se se o usuário rolar antes do intro terminar
          const onFirstScroll = () => {
            if (!isManualMode) {
              isManualMode = true;
              if (intro && intro.isActive()) intro.kill();
            }
            setupScrollTimeline();
          };
          window.addEventListener("scroll", onFirstScroll, { passive: true, once: true });

          // Fallback de toque/clique para garantir reprodução no mobile
          container.addEventListener("click",      () => { video.play().catch(() => {}); }, { once: true });
          container.addEventListener("touchstart", () => { video.play().catch(() => {}); }, { once: true });
        }; // end buildTimelines

        // Polling até a duração ser um número finito
        const pollDuration = () => {
          const d = video.duration;
          if (isFinite(d) && d > 0) {
            buildTimelines(d);
          } else if (pollCount < MAX_POLLS) {
            pollCount++;
            setTimeout(pollDuration, 100);
          } else {
            buildTimelines(5); // fallback iOS
          }
        };
        pollDuration();
      };

      // iOS blocks canplaythrough without interaction. Use loadedmetadata.
      if (video.readyState >= 1) {
        initMasterTimeline();
      } else {
        video.addEventListener("loadedmetadata", initMasterTimeline);
      }

      // Safety net — fire after 1.5s regardless
      const safetyId = setTimeout(initMasterTimeline, 1500);
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
          zIndex:         10,
          willChange:     "auto",
          pointerEvents:  "auto",
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
            position:       "absolute",
            top:            0,
            left:           0,
            opacity:        0.001, // Must be > 0.0001 sometimes on iOS to force decode
            pointerEvents:  "none",
            width:          "100%",
            height:         "100%",
            zIndex:         -1
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
