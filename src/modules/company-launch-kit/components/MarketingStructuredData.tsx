import { JsonLd } from "@/src/modules/company-launch-kit/components/JsonLd";
import {
    buildBreadcrumbJsonLd,
    buildOrganizationJsonLd,
    buildWebPageJsonLd,
    type BreadcrumbItem,
} from "@/src/lib/seo";

type MarketingStructuredDataProps = {
    title: string;
    description: string;
    path: string;
    breadcrumbs: BreadcrumbItem[];
    extra?: Record<string, unknown>[];
};

export function MarketingStructuredData({
    title,
    description,
    path,
    breadcrumbs,
    extra = [],
}: MarketingStructuredDataProps) {
    const schemas: Record<string, unknown>[] = [
        buildOrganizationJsonLd(),
        buildWebPageJsonLd({ title, description, path }),
        buildBreadcrumbJsonLd(breadcrumbs),
        ...extra,
    ];

    return (
        <>
            {schemas.map((schema, index) => (
                <JsonLd key={`${path}-schema-${index}`} data={schema} />
            ))}
        </>
    );
}
