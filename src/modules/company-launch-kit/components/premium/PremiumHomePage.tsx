"use client";

import dynamic from "next/dynamic";
import { PremiumHero } from "@/src/modules/company-launch-kit/components/premium/sections/PremiumHero";

const WhyUsSection = dynamic(() => import("@/src/modules/company-launch-kit/components/premium/sections/WhyUsSection").then((m) => m.WhyUsSection));
const ServicesSection = dynamic(() => import("@/src/modules/company-launch-kit/components/premium/sections/ServicesSection").then((m) => m.ServicesSection));
const IndustriesSection = dynamic(() => import("@/src/modules/company-launch-kit/components/premium/sections/IndustriesSection").then((m) => m.IndustriesSection));
const SolutionsSection = dynamic(() => import("@/src/modules/company-launch-kit/components/premium/sections/SolutionsSection").then((m) => m.SolutionsSection));
const PortfolioSection = dynamic(() => import("@/src/modules/company-launch-kit/components/premium/sections/PortfolioSection").then((m) => m.PortfolioSection));
const CaseStudiesSection = dynamic(() => import("@/src/modules/company-launch-kit/components/premium/sections/CaseStudiesSection").then((m) => m.CaseStudiesSection));
const AiCapabilitiesSection = dynamic(() => import("@/src/modules/company-launch-kit/components/premium/sections/AiCapabilitiesSection").then((m) => m.AiCapabilitiesSection));
const EnterprisePlatformSection = dynamic(() => import("@/src/modules/company-launch-kit/components/premium/sections/EnterprisePlatformSection").then((m) => m.EnterprisePlatformSection));
const CustomerJourneySection = dynamic(() => import("@/src/modules/company-launch-kit/components/premium/sections/CustomerJourneySection").then((m) => m.CustomerJourneySection));
const FaqSection = dynamic(() => import("@/src/modules/company-launch-kit/components/premium/sections/FaqSection").then((m) => m.FaqSection));
const PremiumCtaSection = dynamic(() => import("@/src/modules/company-launch-kit/components/premium/sections/PremiumCtaSection").then((m) => m.PremiumCtaSection));

export function PremiumHomePage() {
    return (
        <>
            <PremiumHero />
            <WhyUsSection />
            <ServicesSection />
            <IndustriesSection />
            <SolutionsSection />
            <PortfolioSection />
            <CaseStudiesSection />
            <AiCapabilitiesSection />
            <EnterprisePlatformSection />
            <CustomerJourneySection />
            <FaqSection />
            <PremiumCtaSection />
        </>
    );
}
