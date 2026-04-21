import { Show, UserButton } from "@clerk/nextjs";
import { CTA } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import Hero from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen lic-bg">
      <Hero />
      <Features />
      <HowItWorks />

      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>

      <Pricing />
      <CTA />
    </main>
  );
}
