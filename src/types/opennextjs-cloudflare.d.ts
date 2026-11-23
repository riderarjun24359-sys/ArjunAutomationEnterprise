/**
 * The Cloudflare build installs the OpenNext adapter before running its build
 * command. GitHub's standard application CI intentionally does not install
 * deployment-only tooling, so provide the small compile-time surface here.
 */
declare module "@opennextjs/cloudflare" {
    export function defineCloudflareConfig(options?: Record<string, unknown>): unknown;
}
