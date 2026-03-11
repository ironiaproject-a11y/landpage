"use client";

import nextDynamic from "next/dynamic";

import { Hero } from "@/components/Hero";
import { ServicesSkeleton, CaseStudiesSkeleton, TestimonialsSkeleton } from "@/components/SectionSkeletons";

const About = nextDynamic(() => import("@/components/About").then(mod => mod.About), { ssr: false });
const InstitutionalTrust = nextDynamic(() => import("@/components/InstitutionalTrust").then(mod => mod.InstitutionalTrust), { ssr: false });
const TrustBar = nextDynamic(() => import("@/components/TrustBar").then(mod => mod.TrustBar), { ssr: false });
const Services = nextDynamic(() => import("@/components/Services").then(mod => mod.Services), {
  ssr: false,
  loading: () => <ServicesSkeleton />
});
const CaseStudies = nextDynamic(() => import("@/components/CaseStudies").then(mod => mod.CaseStudies), {
  ssr: false,
  loading: () => <CaseStudiesSkeleton />
});
const Specialist = nextDynamic(() => import("@/components/Specialist").then(mod => mod.Specialist), { ssr: false });
const Experience = nextDynamic(() => import("@/components/Experience").then(mod => mod.Experience), { ssr: false });
const Amenities = nextDynamic(() => import("@/components/Amenities").then(mod => mod.Amenities), { ssr: false });
const Testimonials = nextDynamic(() => import("@/components/Testimonials").then(mod => mod.Testimonials), {
  ssr: false,
  loading: () => <TestimonialsSkeleton />
});
const FAQ = nextDynamic(() => import("@/components/FAQ").then(mod => mod.FAQ), { ssr: false });
const CTA = nextDynamic(() => import("@/components/CTA").then(mod => mod.CTA), { ssr: false });
const Contact = nextDynamic(() => import("@/components/Contact").then(mod => mod.Contact), { ssr: false });
const Stats = nextDynamic(() => import("@/components/Stats"), {
  ssr: false,
  loading: () => <div className="h-40 bg-transparent" />
});
const Footer = nextDynamic(() => import("@/components/Footer").then(mod => mod.Footer), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Specialist />
      <About />
      <InstitutionalTrust />
      <TrustBar />
      <Services />
      <CaseStudies />
      <Stats />
      <Experience />
      <Amenities />
      <Testimonials />
      <FAQ />
      <CTA />
      <Contact />
      <Footer />
    </main>
  );
}
