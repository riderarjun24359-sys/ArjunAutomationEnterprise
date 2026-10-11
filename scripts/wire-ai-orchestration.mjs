import { aiOrchestrationService } from "../src/modules/ai-orchestration/services/ai-orchestration.service.ts";
import { resolveOrganizationContext } from "../src/modules/database/lib/organization-context.ts";

async function wireGeminiProvider(authUserId, email, fullName) {
    console.log("Starting Gemini provider wiring (optional provider — never required for build/startup)...");
    const keyPresent = Boolean(process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim());
    if (!keyPresent) {
        console.warn("GEMINI_API_KEY not set: registering the Gemini DB record only. External Gemini generation stays disabled until the operator sets GEMINI_API_KEY. Local deterministic fallback remains active.");
    }
    
    // 1. Resolve context
    const context = await resolveOrganizationContext(authUserId, email, fullName);
    if (!context) {
        console.error("Failed to resolve organization context. Ensure the provided credentials have administrative access.");
        process.exit(1);
    }
    
    // 2. Check for existing provider
    const existingProviders = await aiOrchestrationService.getProviders(authUserId, email, fullName);
    const geminiExists = existingProviders.some(p => p.providerKey === 'gemini');
    
    if (geminiExists) {
        console.log("Gemini provider already exists. Skipping registration.");
    } else {
        // 3. Register Gemini Provider
        try {
            const provider = await aiOrchestrationService.createProvider(authUserId, email, {
                name: "Google Gemini",
                providerKey: "gemini",
                apiBaseUrl: "https://generativelanguage.googleapis.com",
                isDefault: false
            }, fullName);
            console.log("Gemini provider registered successfully:", provider.id);
            
            // 4. Register gemini-pro model route
            await aiOrchestrationService.createModelRoute(authUserId, email, {
                name: "Gemini Pro",
                providerId: provider.id,
                modelId: "gemini-pro",
                priority: 1,
                routingStrategy: "priority"
            }, fullName);
            console.log("Gemini model route (gemini-pro) registered successfully.");
            
        } catch (error) {
            console.error("Error during Gemini provider registration:", error);
            process.exit(1);
        }
    }
}

// Execution
const [,, authUserId, email, fullName] = process.argv;
if (authUserId && email) {
    wireGeminiProvider(authUserId, email, fullName);
} else {
    console.error("Usage: node scripts/wire-ai-orchestration.mjs <authUserId> <email> [fullName]");
    process.exit(1);
}
