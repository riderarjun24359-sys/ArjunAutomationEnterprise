import { knowledgeService } from "@/src/modules/knowledge/services/knowledge.service";
import type { KnowledgeSdkContextInput, KnowledgeSdkMemoryInput, KnowledgeSdkSearchInput } from "@/src/modules/knowledge/types";

export class KnowledgeClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async search(input: KnowledgeSdkSearchInput) {
        return knowledgeService.sdkSearch(this.authUserId, this.email, input, this.fullName);
    }

    async resolveContext(input: KnowledgeSdkContextInput) {
        return knowledgeService.sdkResolveContext(this.authUserId, this.email, input, this.fullName);
    }

    async storeMemory(input: KnowledgeSdkMemoryInput) {
        return knowledgeService.sdkStoreMemory(this.authUserId, this.email, input, this.fullName);
    }

    async getEntries() {
        return knowledgeService.getEntries(this.authUserId, this.email, this.fullName);
    }

    async getPrompts() {
        return knowledgeService.getPrompts(this.authUserId, this.email, this.fullName);
    }

    async getAiContexts() {
        return knowledgeService.getAiContexts(this.authUserId, this.email, this.fullName);
    }

    async getProjectMemories() {
        return knowledgeService.getProjectMemories(this.authUserId, this.email, this.fullName);
    }

    async getClientMemories() {
        return knowledgeService.getClientMemories(this.authUserId, this.email, this.fullName);
    }
}

export function createKnowledgeClient(authUserId: string, email: string, fullName?: string | null): KnowledgeClient {
    return new KnowledgeClient(authUserId, email, fullName);
}

export { knowledgeService };
