import { aiOrchestrationService } from "../src/modules/ai-orchestration/services/ai-orchestration.service.ts";

async function registerGeminiProvider(authUserId, email, fullName) {
    console.log("Preparing to register Gemini provider (optional — local fallback stays active without a key)...");
    if (!process.env.GEMINI_API_KEY?.trim() && !process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()) {
        console.warn("GEMINI_API_KEY not set: DB record will be created, but external Gemini generation stays disabled until the key is set.");
    }
    
    try {
        const provider = await aiOrchestrationService.createProvider(authUserId, email, {
            name: "Google Gemini",
            providerKey: "gemini",
            apiBaseUrl: "https://generativelanguage.googleapis.com",
            isDefault: false
        }, fullName);
        
        console.log("Provider Gemini registered successfully:", provider.id);
        
        // Registering the approved model route
        // Assuming there is an aiOrchestrationService.createModelRoute method
        // (Checking service signature) -> Yes, it has createModelRoute
        
        await aiOrchestrationService.createModelRoute(authUserId, email, {
            name: "Gemini Pro",
            providerId: provider.id,
            modelId: "gemini-pro",
            priority: 1,
            routingStrategy: "priority",
        }, fullName);
        
        console.log("Model route gemini-pro registered successfully.");
        
    } catch (error) {
        console.error("Error registering Gemini provider:", error);
    }
}

// To run this:
// node scripts/register-gemini-provider.mjs <authUserId> <email> <fullName>
const [,, authUserId, email, fullName] = process.argv;
if (authUserId && email) {
    registerGeminiProvider(authUserId, email, fullName);
} else {
    console.error("Usage: node scripts/register-gemini-provider.mjs <authUserId> <email> [fullName]");
}
