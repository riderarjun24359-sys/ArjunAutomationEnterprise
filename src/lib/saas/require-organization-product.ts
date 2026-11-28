import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/src/constants/routes";
import { authServerService } from "@/src/services/auth.server";
import { hasOrganizationProductAccess, resolveServerIdentity } from "@/src/lib/api-security";
import type { SaasProductKey } from "@/src/lib/organization-provisioning";

/**
 * Server-component boundary for product pages. The selected organization is
 * treated only as a hint; resolveServerIdentity verifies its active membership
 * against the authenticated session before checking the product entitlement.
 */
export async function requireOrganizationProduct(product: SaasProductKey): Promise<void> {
    const session = await authServerService.validateSession();
    if (!session.valid || !session.user) {
        redirect(ROUTES.auth.signIn);
    }

    const requestHeaders = await headers();
    const cookieStore = await cookies();
    const requestedOrganizationId =
        requestHeaders.get("x-organization-id")?.trim() ||
        cookieStore.get("aae_selected_organization")?.value ||
        null;

    const identity = await resolveServerIdentity(session.user.id, requestedOrganizationId);
    if (!identity.organizationId || !(await hasOrganizationProductAccess(identity.organizationId, product))) {
        redirect(`${ROUTES.dashboard}?product_unavailable=${encodeURIComponent(product)}`);
    }
}
