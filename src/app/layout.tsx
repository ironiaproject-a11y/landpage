import type { Metadata } from "next";
import { Inter, Playfair_Display, Libre_Bodoni } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { MotionProvider } from "@/components/MotionProvider";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Preloader } from "@/components/Preloader";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ClientSideExtras from "@/components/ClientSideExtras";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-playfair",
  display: "swap",
});

const libreBodoni = Libre_Bodoni({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clínica Premium | Odontologia de Alta Performance",
  description: "Transformando sorrisos com tecnologia de ponta, estética refinada e cuidado personalizado em São Paulo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${inter.variable} ${playfair.variable} ${libreBodoni.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Preload Critical Assets */}
        <link rel="preload" href="/hero-background.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/implant-3d.png" as="image" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Dentist",
              "name": "Clínica Premium",
              "image": "https://primeira-clinica-premium.vercel.app/logo.png",
              "@id": "",
              "url": "https://primeira-clinica-premium.vercel.app",
              "telephone": "+551837433000",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Centro",
                "addressLocality": "Pereira Barreto",
                "addressRegion": "SP",
                "postalCode": "15370-000",
                "addressCountry": "BR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -20.6385,
                "longitude": -51.1098
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday"
                ],
                "opens": "08:00",
                "closes": "20:00"
              },
              "sameAs": [
                "https://www.instagram.com/clinicapremium"
              ]
            })
          }}
        />
      </head>
      <body className="antialiased">
        <SmoothScroll>
          <MotionProvider>
            <Preloader />
            <ScrollProgress />
            <ClientSideExtras />
            <Navbar />
            {children}
          </MotionProvider>
        </SmoothScroll>
        {/* INÍCIO: hero-force (load-safe) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  // executar apenas após load completo para evitar reidratação reescrever
  function applyHeroForce(){
    /* --- INJETAR CSS --- */
    if(!document.getElementById('hero-force-style')){
      const css = \`
.hero { padding: 24px 16px; position: relative; overflow: hidden; }
.hero-mouth { position: absolute; left: 50%; transform: translateX(-50%); top: 30%; height: 65vh; width: auto; z-index:1; will-change: transform; filter: contrast(.96) brightness(.98); pointer-events: none; }
.hero-overlay { position:absolute; inset:0; background: linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.25) 70%); z-index:2; pointer-events:none; }
.hero-content { position: relative; z-index:3; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; text-align:center; margin-top: 6vh; padding: 0 16px; }
.hero-title{ font-size:36px; font-weight:700; line-height:1.02; letter-spacing:-0.02em; color:#FBFBFB; margin:0; will-change: transform, opacity; }
.hero-subtitle{ font-size:16px; font-weight:500; color:#E6E6E6; margin-top:8px; will-change: transform, opacity; }
.cta-primary{ width:100%; height:52px; background:#0B0B0B; color:#FBFBFB; border-radius:8px; font-weight:600; font-size:16px; letter-spacing:1px; text-transform:uppercase; display:inline-flex; align-items:center; justify-content:center; border:0; cursor:pointer; z-index:4; }
.cta-primary.is-sticky{ position: fixed !important; bottom: 16px; left:16px; width: calc(100% - 32px); height:48px !important; transform: scale(1.02); transition: transform 200ms ease-out, box-shadow 200ms ease-out; z-index:99999; }
.cta-secondary-link{ display:inline-block; font-size:14px; font-weight:500; color: rgba(255,255,255,0.78); opacity:0.78; margin-top:16px; text-decoration:none; z-index:4; }
.hero-eyebrow{ display:none !important; opacity:0 !important; pointer-events:none !important; }
@media (prefers-reduced-motion: reduce){ .hero-mouth, .hero-title, .hero-subtitle { transition: none !important; transform:none !important; } }
      \`;
      const style = document.createElement('style');
      style.id = 'hero-force-style';
      style.innerHTML = css;
      document.head.appendChild(style);
    }

    /* --- Helpers --- */
    function findByClassOrText(possibleClasses, textMatch){
      for(const cls of possibleClasses){
        const el = document.querySelector(cls);
        if(el) return el;
      }
      if(textMatch){
        const nodes = Array.from(document.querySelectorAll('body *'));
        const found = nodes.find(n=> n.innerText && n.innerText.trim().toLowerCase().includes(textMatch.toLowerCase()));
        if(found) return found;
      }
      return null;
    }

    /* --- Localizar / Normalizar estrutura do hero --- */
    const hero = findByClassOrText(['.hero', '#hero', '[data-hero]'], 'volte a sorrir') || document.querySelector('main') || document.body;
    function ensureHeroContent(){
      let container = document.querySelector('.hero-content');
      if(!container){
        container = document.createElement('div');
        container.className = 'hero-content';
        (hero || document.body).insertBefore(container, (hero || document.body).firstChild);
      }
      return container;
    }
    const container = ensureHeroContent();

    // TÍTULO
    let heroTitle = findByClassOrText(['.hero-title', '.title', 'h1','h2'], 'volte a sorrir');
    if(!heroTitle){
      const h = document.createElement('h1');
      h.className = 'hero-title';
      h.innerText = 'Volte a sorrir com confiança.';
      container.appendChild(h);
      heroTitle = h;
    } else {
      heroTitle.classList.add('hero-title');
      heroTitle.innerText = 'Volte a sorrir com confiança.';
    }

    // SUBTÍTULO
    let heroSubtitle = findByClassOrText(['.hero-subtitle','.subtitle','p','.lead'], 'segurança clínica') || findByClassOrText(['.hero-subtitle','.subtitle','p','.lead']);
    if(!heroSubtitle){
      const p = document.createElement('div');
      p.className = 'hero-subtitle';
      p.innerText = 'Segurança clínica. Resultado natural.';
      container.appendChild(p);
      heroSubtitle = p;
    } else {
      heroSubtitle.classList.add('hero-subtitle');
      heroSubtitle.innerText = 'Segurança clínica. Resultado natural.';
    }

    // CTA primário
    let ctaPrimary = findByClassOrText(['.cta-primary','button.cta','button.primary','button'], 'agendar');
    if(!ctaPrimary){
      const btn = document.createElement('button');
      btn.className = 'cta-primary';
      btn.innerText = 'AGENDAR CONSULTA';
      btn.setAttribute('aria-label','Agendar consulta — abre formulário de agendamento');
      container.appendChild(btn);
      ctaPrimary = btn;
    } else {
      ctaPrimary.classList.add('cta-primary');
      ctaPrimary.innerText = 'AGENDAR CONSULTA';
      ctaPrimary.setAttribute('aria-label','Agendar consulta — abre formulário de agendamento');
      container.appendChild(ctaPrimary);
    }

    // CTA secundário -> transformar em link editorial
    let ctaSecondary = Array.from(document.querySelectorAll('button, a')).find(n=> n.innerText && /galeria|resultados/i.test(n.innerText));
    if(ctaSecondary){
      if(ctaSecondary.tagName.toLowerCase() === 'button'){
        const a = document.createElement('a');
        a.className = 'cta-secondary-link';
        a.href = '#galeria';
        a.innerText = 'ver galeria de resultados →';
        ctaSecondary.parentNode.insertBefore(a, ctaSecondary.nextSibling);
        try{ ctaSecondary.remove(); }catch(e){}
        ctaSecondary = a;
      } else {
        ctaSecondary.classList.add('cta-secondary-link');
        ctaSecondary.innerText = 'ver galeria de resultados →';
        container.appendChild(ctaSecondary);
      }
    } else {
      const a = document.createElement('a');
      a.className = 'cta-secondary-link';
      a.href = '#galeria';
      a.innerText = 'ver galeria de resultados →';
      container.appendChild(a);
      ctaSecondary = a;
    }

    // Overlay
    if(!document.querySelector('.hero-overlay')){
      const ov = document.createElement('div');
      ov.className = 'hero-overlay';
      (hero || document.body).appendChild(ov);
    }

    // Mouth: localizar vídeo/imagem e marcar com classe
    let heroMouth = document.querySelector('.hero-mouth') || document.querySelector('video') || document.querySelector('img');
    if(heroMouth){
      if(!heroMouth.classList.contains('hero-mouth')) heroMouth.classList.add('hero-mouth');
      if(heroMouth.tagName.toLowerCase() === 'video'){
        heroMouth.play().catch(e=>console.warn('heroMouth.play() blocked:', e));
      }
    }
    // Forçar play em qualquer vídeo na página para garantir
    document.querySelectorAll('video').forEach(v => v.play().catch(e=>{}));

    /* --- Remover eyebrow e proteger contra reinserção --- */
    function removeEyebrowsNow(){
      document.querySelectorAll('.hero-eyebrow, [data-eyebrow]').forEach(n=>{ try{ n.remove(); }catch(e){} });
      Array.from(document.querySelectorAll('body *')).forEach(n=>{
        try{
          if(n.innerText && n.innerText.trim().toUpperCase().includes('SEU SORRISO')) n.remove();
        }catch(e){}
      });
    }
    removeEyebrowsNow();
    const eyebrowObserver = new MutationObserver(muts=>{
      muts.forEach(m=>{
        m.addedNodes.forEach(node=>{
          if(node.nodeType===1){
            try{
              if(node.matches && (node.matches('.hero-eyebrow') || node.matches('[data-eyebrow]'))) node.remove();
            }catch(e){}
            try{
              if(node.innerText && node.innerText.trim().toUpperCase().includes('SEU SORRISO')) node.remove();
            }catch(e){}
            try{ node.querySelectorAll && node.querySelectorAll('.hero-eyebrow, [data-eyebrow]').forEach(n=>n.remove()); }catch(e){}
          }
        });
      });
    });
    eyebrowObserver.observe(document.documentElement || document.body, { childList:true, subtree:true });

    /* --- Parallax: usar GSAP se disponível, senão RAF fallback --- */
    function setupParallaxFallback(){
      const heroEl = hero || document.body;
      const mouth = document.querySelector('.hero-mouth');
      const title = document.querySelector('.hero-title');
      const subtitle = document.querySelector('.hero-subtitle');
      const cta = document.querySelector('.cta-primary');

      function getScrollProgress(){
        const rect = heroEl.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const total = Math.max(rect.height, vh);
        const scrolled = Math.min(Math.max(-rect.top, 0), total);
        return total > 0 ? (scrolled / total) : 0;
      }
      const clamp = (v,min,max)=> Math.max(min, Math.min(max, v));
      function onScroll(){
        const p = getScrollProgress();
        const heroH = (heroEl.getBoundingClientRect().height || window.innerHeight);
        const mouthY = - clamp(p * heroH * 0.12, 0, 60);
        const mouthScale = 1 + clamp(p * 0.03, 0, 0.03);
        if(mouth) mouth.style.transform = 'translate3d(-50%, ' + mouthY + 'px, 0) scale(' + mouthScale + ')';
        const titleY = - clamp(p * 60, 0, 60);
        if(title){
          title.style.transform = 'translate3d(0, ' + titleY + 'px, 0)';
          title.style.opacity = '' + clamp(1 - p*0.15, 0.0, 1);
        }
        if(subtitle){
          subtitle.style.transform = 'translate3d(0, ' + titleY + 'px, 0)';
          subtitle.style.opacity = '' + clamp(1 - p*0.25, 0.0, 1);
        }
        if(cta){
          if(p >= 0.4) cta.classList.add('is-sticky'); else cta.classList.remove('is-sticky');
          const ctaY = - clamp(p * 30, 0, 30);
          cta.style.transform = 'translate3d(0, ' + ctaY + 'px, 0)';
        }
      }
      let ticking = false;
      function rafHandler(){
        if(!ticking){ ticking = true; requestAnimationFrame(()=>{ onScroll(); ticking = false; }); }
      }
      window.addEventListener('scroll', rafHandler, { passive:true });
      window.addEventListener('resize', rafHandler);
      rafHandler();
    }

    function setupGSAP(){
      if(window.gsap && window.ScrollTrigger){
        try{
          gsap.registerPlugin(ScrollTrigger);
          gsap.to('.hero-mouth', { y: () => - (window.innerHeight * 0.12), scale: 1.03, ease: "power2.out", scrollTrigger: { trigger: ".hero", start: "top top", end: () => "+=" + Math.round(window.innerHeight * 0.8), scrub: 0.8 } });
          gsap.to('.hero-title', { y: -60, ease: "power2.out", scrollTrigger: { trigger: ".hero", start: "top top", end: "top+=300 top", scrub: 0.9 } });
          gsap.to('.hero-subtitle', { y: -60, ease: "power2.out", scrollTrigger: { trigger: ".hero", start: "top top", end: "top+=300 top", scrub: 1 } });
          ScrollTrigger.create({ trigger: ".hero", start: () => (window.innerHeight * 0.4) + " top", onEnter: ()=> document.querySelector('.cta-primary')?.classList.add('is-sticky'), onLeaveBack: ()=> document.querySelector('.cta-primary')?.classList.remove('is-sticky') });
          return true;
        }catch(e){ console.warn('GSAP error:', e); return false; }
      }
      return false;
    }

    if(!setupGSAP()) setupParallaxFallback();
    console.log('[hero-force] applied');
  } // end applyHeroForce

  // Run after load and schedule reapply attempts in case framework rehydrates
  function onReadyApply(){
    try{ applyHeroForce(); }catch(e){ console.error('applyHeroForce error', e); }
    // Reapply short-term to handle late re-renders (3 tries)
    let tries = 0;
    const iv = setInterval(()=>{
      tries++;
      try{ applyHeroForce(); }catch(e){}
      if(tries >= 3) clearInterval(iv);
    }, 600);
  }

  if(document.readyState === 'complete'){
    onReadyApply();
  } else {
    window.addEventListener('load', onReadyApply);
    // safety: also try after DOMContentLoaded
    window.addEventListener('DOMContentLoaded', onReadyApply);
  }
})();
`
          }}
        />
        {/* FIM: hero-force (load-safe) */}
      </body>
    </html>
  );
}
