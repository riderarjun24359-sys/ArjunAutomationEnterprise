import { type NextRequest } from "next/server";
import { authMiddleware } from "@/src/middleware/auth";
import { buildContentSecurityPolicy } from "@/src/lib/security/content-security-policy";

export async function proxy(request: NextRequest) {
    // A fresh unpredictable nonce is generated for every request. Forward the
    // policy and nonce to Next.js so framework and application scripts receive it.
    const nonce = crypto.randomUUID().replace(/-/g, "");
    const contentSecurityPolicy = buildContentSecurityPolicy(nonce);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

    const requestWithNonce = new NextRequest(request, { headers: requestHeaders });
    const response = await authMiddleware(requestWithNonce);

    // Preserve auth redirects as-is; attach CSP to actual page/asset responses.
    if (!response.headers.has("Location")) {
        response.headers.set("Content-Security-Policy", contentSecurityPolicy);
    }
    return response;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
