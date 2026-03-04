import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { MotionProvider } from "@/components/MotionProvider";
import { ScrollProgress } from "@/components/ScrollProgress";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { ClientSideExtras } from "@/components/ClientSideExtras";



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
    <html lang="pt-br" className={`${inter.variable} ${playfair.variable}`}>
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
