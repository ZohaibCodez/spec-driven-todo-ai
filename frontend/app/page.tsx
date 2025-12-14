import { LandingNav } from '@/components/landing/LandingNav';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNav />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}
