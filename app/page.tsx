import { Show, UserButton } from "@clerk/nextjs";
import { CTA } from "@/components/landing/cta";
// import { Features } from "@/components/landing/features";
import Hero from "@/components/landing/hero";
// import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <Hero />
      <Features />
      <HowItWorks />

      <Show when="signed-in">
        <div className="fixed top-4 right-4">
          <UserButton />
        </div>
      </Show>

      <Pricing />
      <CTA />
    </main>
  );
}