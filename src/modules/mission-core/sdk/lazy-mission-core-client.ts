import { createMissionCoreClient } from "./index";

let cached: ReturnType<typeof createMissionCoreClient> | undefined;

/** Deferred Mission Core client — avoids circular init during module evaluation. */
export function lazyMissionCoreClient() {
    if (!cached) cached = createMissionCoreClient();
    return cached;
}
