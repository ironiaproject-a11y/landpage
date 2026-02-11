// Final Polish Verification
import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { ServicesSkeleton, CaseStudiesSkeleton, TestimonialsSkeleton } from "@/components/SectionSkeletons";

const About = dynamic(() => import("@/components/About").then(mod => mod.About));

const InstitutionalTrust = dynamic(() => import("@/components/InstitutionalTrust").then(mod => mod.InstitutionalTrust));
const TrustBar = dynamic(() => import("@/components/TrustBar").then(mod => mod.TrustBar));
const Services = dynamic(() => import("@/components/Services").then(mod => mod.Services), {
  loading: () => <ServicesSkeleton />
});
const CaseStudies = dynamic(() => import("@/components/CaseStudies").then(mod => mod.CaseStudies), {
  loading: () => <CaseStudiesSkeleton />
});
const Specialist = dynamic(() => import("@/components/Specialist").then(mod => mod.Specialist));
const Experience = dynamic(() => import("@/components/Experience").then(mod => mod.Experience));
const Amenities = dynamic(() => import("@/components/Amenities").then(mod => mod.Amenities));
const Testimonials = dynamic(() => import("@/components/Testimonials").then(mod => mod.Testimonials), {
  loading: () => <TestimonialsSkeleton />
});
const FAQ = dynamic(() => import("@/components/FAQ").then(mod => mod.FAQ));
const CTA = dynamic(() => import("@/components/CTA").then(mod => mod.CTA));
const Contact = dynamic(() => import("@/components/Contact").then(mod => mod.Contact));
const Stats = dynamic(() => import("@/components/Stats"), {
  ssr: false,
  loading: () => <div className="h-40 bg-transparent" />
});
const Footer = dynamic(() => import("@/components/Footer").then(mod => mod.Footer));

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
