// Final Polish Verification
import nextDynamic from "next/dynamic";

import { Hero } from "@/components/Hero";
import { ServicesSkeleton, CaseStudiesSkeleton, TestimonialsSkeleton } from "@/components/SectionSkeletons";

const About = nextDynamic(() => import("@/components/About").then(mod => mod.About));

const InstitutionalTrust = nextDynamic(() => import("@/components/InstitutionalTrust").then(mod => mod.InstitutionalTrust));
const TrustBar = nextDynamic(() => import("@/components/TrustBar").then(mod => mod.TrustBar));
const Services = nextDynamic(() => import("@/components/Services").then(mod => mod.Services), {
  loading: () => <ServicesSkeleton />
});
const CaseStudies = nextDynamic(() => import("@/components/CaseStudies").then(mod => mod.CaseStudies), {
  loading: () => <CaseStudiesSkeleton />
});
const Specialist = nextDynamic(() => import("@/components/Specialist").then(mod => mod.Specialist));
const Experience = nextDynamic(() => import("@/components/Experience").then(mod => mod.Experience));
const Amenities = nextDynamic(() => import("@/components/Amenities").then(mod => mod.Amenities));
const Testimonials = nextDynamic(() => import("@/components/Testimonials").then(mod => mod.Testimonials), {
  loading: () => <TestimonialsSkeleton />
});
const FAQ = nextDynamic(() => import("@/components/FAQ").then(mod => mod.FAQ));
const CTA = nextDynamic(() => import("@/components/CTA").then(mod => mod.CTA));
const Contact = nextDynamic(() => import("@/components/Contact").then(mod => mod.Contact));
const Stats = nextDynamic(() => import("@/components/Stats"), {
  ssr: false,
  loading: () => <div className="h-40 bg-transparent" />
});
const Footer = nextDynamic(() => import("@/components/Footer").then(mod => mod.Footer));

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <InstitutionalTrust />
      <TrustBar />
      <Services />
      <CaseStudies />
      <Specialist />
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
