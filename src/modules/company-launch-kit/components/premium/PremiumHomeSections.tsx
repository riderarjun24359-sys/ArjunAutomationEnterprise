"use client";

import { LazyOnView } from "@/src/modules/company-launch-kit/components/premium/LazyOnView";

export function PremiumHomeSections() {
    return (
        <>
            <LazyOnView loader={() => import("@/src/modules/company-launch-kit/components/premium/sections/WhyUsSection").then((m) => ({ default: m.WhyUsSection }))} minHeight="28rem" />
            <LazyOnView loader={() => import("@/src/modules/company-launch-kit/components/premium/sections/ServicesSection").then((m) => ({ default: m.ServicesSection }))} minHeight="32rem" />
            <LazyOnView loader={() => import("@/src/modules/company-launch-kit/components/premium/sections/IndustriesSection").then((m) => ({ default: m.IndustriesSection }))} minHeight="28rem" />
            <LazyOnView loader={() => import("@/src/modules/company-launch-kit/components/premium/sections/SolutionsSection").then((m) => ({ default: m.SolutionsSection }))} minHeight="28rem" />
            <LazyOnView loader={() => import("@/src/modules/company-launch-kit/components/premium/sections/PortfolioSection").then((m) => ({ default: m.PortfolioSection }))} minHeight="32rem" />
            <LazyOnView loader={() => import("@/src/modules/company-launch-kit/components/premium/sections/CaseStudiesSection").then((m) => ({ default: m.CaseStudiesSection }))} minHeight="32rem" />
            <LazyOnView loader={() => import("@/src/modules/company-launch-kit/components/premium/sections/AiCapabilitiesSection").then((m) => ({ default: m.AiCapabilitiesSection }))} minHeight="28rem" />
            <LazyOnView loader={() => import("@/src/modules/company-launch-kit/components/premium/sections/EnterprisePlatformSection").then((m) => ({ default: m.EnterprisePlatformSection }))} minHeight="28rem" />
            <LazyOnView loader={() => import("@/src/modules/company-launch-kit/components/premium/sections/CustomerJourneySection").then((m) => ({ default: m.CustomerJourneySection }))} minHeight="28rem" />
            <LazyOnView loader={() => import("@/src/modules/company-launch-kit/components/premium/sections/FaqSection").then((m) => ({ default: m.FaqSection }))} minHeight="24rem" />
            <LazyOnView loader={() => import("@/src/modules/company-launch-kit/components/premium/sections/PremiumCtaSection").then((m) => ({ default: m.PremiumCtaSection }))} minHeight="16rem" />
        </>
    );
}
