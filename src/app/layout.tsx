import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { MotionProvider } from "@/components/MotionProvider";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";
import ClientSideExtras from "@/components/ClientSideExtras";

// ── Self-hosted fonts via next/font — zero render-blocking, swap display ──
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
  preload: true,
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  display: "swap",
  variable: "--font-jost",
  preload: true,
});

export const metadata: Metadata = {
  title: "Clínica Premium | Odontologia de Alta Performance",
  description: "Transformando sorrisos com tecnologia de ponta, estética refinada e cuidado personalizado em São Paulo.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Preload Critical Hero Assets */}
        <link rel="preload" href="/hero-background-new.mp4" as="video" type="video/mp4" fetchPriority="high" />

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
                "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
                "opens": "08:00",
                "closes": "20:00"
              },
              "sameAs": ["https://www.instagram.com/clinicapremium"]
            })
          }}
        />
      </head>
      <body className="antialiased">
          <MotionProvider>
            <SmoothScroll />
            <Preloader />
            <ScrollProgress />
            <ClientSideExtras />
            <Navbar />
            {children}
          </MotionProvider>
      </body>
    </html>
  );
}
