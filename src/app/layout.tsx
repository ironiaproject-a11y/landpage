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
        <style id="hero-video-fix" dangerouslySetInnerHTML={{ __html: `
/* INÍCIO: ajuste cirúrgico do vídeo do HERO - aplicar somente este bloco CSS */
.hero, .site-hero, header.hero { 
  position: relative !important;
  overflow: hidden !important;
  /* NÃO alterar height/width do container */
}

/* aplicar ao elemento de mídia do hero — cobre variações comuns de seletor */
.hero video,
.hero img.video,
.hero .video-element,
video.hero-media {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  object-position: center center !important;
  pointer-events: none !important;
  transform: none !important; /* garantir sem scale/translate direto */
  filter: brightness(0.90) contrast(0.96) saturate(0.98) !important; /* reduz dominância sem criar bordas */
  backface-visibility: hidden !important;
  -webkit-backface-visibility: hidden !important;
  will-change: transform, filter !important;
  border: 0 !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}

/* overlay leve, opcional — APLICAR SÓ SE TEXTOS FICAREM DIFÍCEIS DE LER */
.hero::after{
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  pointer-events: none !important;
  background: linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.08) 35%, rgba(0,0,0,0.03) 70%) !important;
  z-index: 2 !important;
}

/* garantir que o conteúdo textual fique acima do overlay */
.hero .hero-content,
.hero-content,
.hero .content {
  position: relative !important;
  z-index: 3 !important;
}

/* Evitar mostrar bordas indesejadas em viewports problemáticas */
@media (min-width: 1200px){
  .hero video { filter: brightness(0.92) contrast(0.97) !important; }
}
/* FIM: ajuste cirúrgico do vídeo do HERO */
        ` }} />
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
      </body>
    </html>
  );
}
