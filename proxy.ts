import { randomBytes } from "node:crypto";
import { type NextRequest } from "next/server";
import { buildContentSecurityPolicy } from "@/src/lib/content-security-policy";
import { authMiddleware } from "@/src/middleware/auth";

export async function proxy(request: NextRequest) {
    const nonce = randomBytes(18).toString("base64");
    const policy = buildContentSecurityPolicy(nonce);
    const requestHeaders = new Headers(request.headers);

    // Next.js reads the request CSP to attach the nonce to framework scripts.
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", policy);

    const requestWithNonce = new NextRequest(request, { headers: requestHeaders });
    const response = await authMiddleware(requestWithNonce);
    response.headers.set("Content-Security-Policy", policy);
    return response;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
