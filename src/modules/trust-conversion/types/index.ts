export type TrustCta = {
    label: string;
    href: string;
};

export type TrustCounter = {
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
};

export type TrustLogo = {
    name: string;
    initials: string;
};

export type TrustBadge = {
    label: string;
    description: string;
};

export type ValueCard = {
    title: string;
    description: string;
    outcome: string;
    icon: string;
};

export type ProcessStep = {
    step: number;
    title: string;
    description: string;
};

export type ServicePreview = {
    title: string;
    businessValue: string;
    benefits: string[];
    cta: TrustCta;
    icon: string;
};

export type TrustMetric = {
    title: string;
    description: string;
    icon: string;
};
