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
        <style dangerouslySetInnerHTML={{ __html: `
/* Ajuste cirúrgico: reduzir dominância visual do vídeo mantendo full-bleed */
.hero, .site-hero, header.hero { /* use o seletor real do projeto se diferente */
  position: relative !important;
  overflow: hidden !important;
  /* não alterar height/width */
}

.hero video,
.hero img.video,
.hero .video-element { /* cobrir variações de seletor; aplique ao elemento de mídia real */
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  object-position: center center !important;
  pointer-events: none !important;
  /* Perceção menor sem alterar container: usar escala sutil */
  transform: scale(0.95) !important; /* valor inicial recomendado */
  will-change: transform !important;
}

/* Se a escala revelar bordas em alguns viewports, ajustar para 0.97–0.99 localmente */
@media (min-width: 1200px){
  .hero video { transform: scale(0.97) !important; }
}

/* Opcional e condicional: overlay leve somente se necessário para legibilidade.
   APLICAR SÓ SE A LEITURA DO TEXTO FICAR RUIM (caso contrário, ignorar). */
.hero::after {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  pointer-events: none !important;
  background: rgba(0,0,0,0.12) !important; /* ajuste 0.08–0.18 conforme necessidade */
  z-index: 2 !important; /* assegurar que texto (z-index maior) continue legível */
}

/* Garantir que nenhum estilo adicionado gere bordas visíveis */
.hero video,
.hero img.video { border: 0 !important; box-shadow: none !important; border-radius: 0 !important; }
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
