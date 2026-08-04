import { EVALUATION_CATEGORIES } from "../constants";
import type { EvaluationMetric } from "../types";

export function getEvaluationMetrics(): EvaluationMetric[] {
    return EVALUATION_CATEGORIES.map((category, i) => {
        const value = category === "latency" ? 120 + i * 10 : 85 + Math.random() * 10;
        const threshold = category === "latency" ? 500 : category === "failures" ? 5 : 80;
        const status = category === "latency" ? (value < threshold ? "pass" : "warning") : value >= threshold ? "pass" : "warning";
        return {
            id: `eval-${category}`,
            name: category.charAt(0).toUpperCase() + category.slice(1),
            category,
            value: Math.round(value * 10) / 10,
            unit: category === "latency" ? "ms" : category === "failures" ? "%" : "score",
            threshold,
            status: status as EvaluationMetric["status"],
            measuredAt: new Date().toISOString(),
        };
    });
}

export function getHallucinationIndicators(): EvaluationMetric[] {
    return getEvaluationMetrics().filter((m) => m.category === "hallucination");
}

export function getOverallQualityScore(): number {
    const metrics = getEvaluationMetrics().filter((m) => m.category !== "latency" && m.category !== "failures");
    return Math.round(metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length);
}
