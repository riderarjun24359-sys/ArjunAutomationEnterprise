import { SERVICE_ITEMS } from "@/src/modules/company-launch-kit/data/services";

/**
 * Initial service offer for customer acquisition (E.1).
 *
 * Reuses the existing public service catalog (`SERVICE_ITEMS`) — no duplicate
 * catalog. This file only selects the entry offer and states the commercial
 * terms the delivery team will actually honor: scope, deliverables,
 * exclusions, turnaround, and acceptance criteria. Proposal/quote generation
 * must reference `offerKey` so every prospect is quoted against the same
 * published scope.
 */

export const INITIAL_OFFER_KEY = "platform-implementation";

export interface ServiceOfferTerms {
    offerKey: string;
    title: string;
    scope: string[];
    deliverables: string[];
    exclusions: string[];
    turnaround: string;
    acceptanceCriteria: string[];
    acquisitionChannels: string[];
}

const OFFER_EXCLUSIONS = [
    "Custom product engineering outside the Arjun Automation OS platform",
    "Third-party license/subscription fees (Supabase, hosting, email/SMS providers)",
    "Legal, tax, or statutory compliance certification",
    "Bulk unsolicited outreach or purchased contact lists",
] as string[];

const OFFER_ACCEPTANCE_CRITERIA = [
    "Configured modules match the signed scope checklist",
    "Customer admin can sign in with required role separation",
    "UAT scenarios for quoted workflows pass with recorded evidence",
    "Go-live runbook handed over and acknowledged by the customer",
] as const;

const ACQUISITION_CHANNELS = [
    "inbound-website",
    "referral",
    "partner",
    "event",
    "outbound-consented",
    "returning-customer",
] as string[];

export function getInitialServiceOffer(): ServiceOfferTerms {
    const item = SERVICE_ITEMS.find((s) => s.slug === INITIAL_OFFER_KEY);
    if (!item) throw new Error(`Initial offer not found in service catalog: ${INITIAL_OFFER_KEY}`);
    return {
        offerKey: item.slug,
        title: item.title,
        scope: item.solutions.slice(),
        deliverables: item.deliverables.slice(),
        exclusions: OFFER_EXCLUSIONS.slice(),
        turnaround: item.timeline,
        acceptanceCriteria: OFFER_ACCEPTANCE_CRITERIA.slice(),
        acquisitionChannels: ACQUISITION_CHANNELS.slice(),
    };
}
