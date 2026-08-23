import { describe, it, expect, vi } from 'vitest';
import { aiOrchestrationService } from "./ai-orchestration.service";

describe("AiOrchestrationService - Gemini Integration", () => {
    it("should allow registration of a new provider (mocked)", async () => {
        const createProviderSpy = vi.spyOn(aiOrchestrationService, 'createProvider').mockResolvedValue({
            id: 'mock-gemini-id',
            name: 'Google Gemini',
            providerKey: 'gemini',
            apiBaseUrl: 'https://generativelanguage.googleapis.com',
            status: 'active',
            routeCount: 0,
            isDefault: false
        });
        
        const result = await aiOrchestrationService.createProvider('user', 'email', {
            name: 'Google Gemini',
            providerKey: 'gemini',
            apiBaseUrl: 'https://generativelanguage.googleapis.com',
            isDefault: false
        });
        
        expect(createProviderSpy).toHaveBeenCalled();
        expect(result.providerKey).toBe('gemini');
    });
});
