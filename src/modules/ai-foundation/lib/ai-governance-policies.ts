export function computeRiskScore(factors: { piiDetected?: boolean; promptUnsafe?: boolean; outputInvalid?: boolean; modelUnapproved?: boolean }): number {
    let score = 0;
    if (factors.piiDetected) score += 30;
    if (factors.promptUnsafe) score += 25;
    if (factors.outputInvalid) score += 25;
    if (factors.modelUnapproved) score += 20;
    return Math.min(100, score);
}

export function isApprovedModel(model: string, approvedModels: string[]): boolean {
    return approvedModels.includes(model) || approvedModels.includes("*");
}

export function validateOutput(output: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    if (output.includes("{{UNSAFE}}")) issues.push("unsafe_content");
    if (output.length > 50000) issues.push("output_too_large");
    return { valid: issues.length === 0, issues };
}
