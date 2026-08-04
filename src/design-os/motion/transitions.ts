import { motion as motionTokens } from "@/src/design-os/tokens/motion";

export const defaultTransition = {
    duration: motionTokens.duration.normal / 1000,
    ease: motionTokens.easing.default,
};

export const fastTransition = {
    duration: motionTokens.duration.fast / 1000,
    ease: motionTokens.easing.out,
};

export const springTransition = motionTokens.spring.default;
