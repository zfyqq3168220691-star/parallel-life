import { HeroSection } from "@/components/home/hero-section";
import { DisclaimerBanner } from "@/components/home/disclaimer-banner";
import { ClearOldData } from "@/components/home/clear-old-data";

export default function HomePage() {
  return (
    <>
      <ClearOldData />
      <HeroSection />
      <DisclaimerBanner />
    </>
  );
}
