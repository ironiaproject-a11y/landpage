LUXURY DENTAL HERO ASSETS - TECHNICAL README (FINAL)

PROJECT: Luxury Dental Clinic Landing Page
OBJECTIVE: Professional polish for "High-End Clinical" visual identity.

--- DELIVERY CHECKLIST STATUS ---
[x] Codebase ready for WebM (VP9) 1080p + MP4 (H.264) 1080p for Variants A, B, C.
[x] Codebase ready for poster.webp 1600px + thumb 800×450 for each variant.
[x] technical structure for worst_frame contrast QA.
[x] Seamless 4–6s loop logic implemented (playbackRate ~0.86).
[x] Left 0–40% Text-Safe Zone implemented via .hero-overlay CSS.
[x] Reduced-motion fallback fully functional.

--- PENDING ASSETS (Render Instructions) ---
Please place the final professional renders in: /public/luxury-hero/
 naming convention:
 - webm_1080_variantA.webm
 - mp4_1080_variantA.mp4
 - poster_variantA.webp (1600px, Optimized ≤ 120KB)
 - thumb_variantA.jpg (800x450)
 - worst_frame_variantA.png (For contrast validation)

--- OFFICIAL CSS OVERLAY SNIPPET ---
.hero-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  background: linear-gradient(
    90deg,
    rgba(11,11,11,0.78) 0%,
    rgba(11,11,11,0.55) 38%,
    rgba(11,11,11,0.25) 68%,
    rgba(11,11,11,0.06) 100%
  );
}

--- ADDITIONAL DEV NOTES ---
- LCP Strategy: The 'poster' attribute is applied to the <video> tag in Hero.tsx for instant load perception.
- Accessibility: prefers-reduced-motion handling is active in globals.css.
- Playback: videoRef.playbackRate is set to 0.86 in React for cinematic micro-motion.
- Typography: No text is baked into the video; headlines use Playfair Display rendered in HTML.
- Mobile Selection: Suggest using lower resolution/bitrate files for mobile variants if bandwidth is a concern.

CONTACT:
Antigravity AI (Advanced Agency Coding)
