import { HeroSection } from "@/src/modules/company-launch-kit/components/premium/sections/HeroSection";
import { TrustConversionModule } from "@/src/modules/trust-conversion";

/** Homepage: hero + Business Module 1 (Trust & Conversion). */
export function PremiumHomePage() {
    return (
        <>
            <HeroSection />
            <TrustConversionModule />
        </>
    );
}
