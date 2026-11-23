# Cloudflare Workers deployment

This project uses the OpenNext Cloudflare adapter for its Cloudflare Workers
runtime. The standard Next.js `next build` output alone is not a deployable
Cloudflare Worker; OpenNext must generate `.open-next/worker.js` first.

## Build and deploy

The Cloudflare Workers Builds production settings are configured as:

```sh
npm install --no-save --package-lock=false @opennextjs/cloudflare@1.20.18 wrangler@4.166.0 && npm run cloudflare:build
npm run cloudflare:deploy
```

The corresponding npm scripts are defined in the root `package.json`:

- `cloudflare:build` runs `opennextjs-cloudflare build`.
- `cloudflare:deploy` runs `opennextjs-cloudflare deploy`.
- `cloudflare:preview` builds the Worker and starts the OpenNext preview.

## Worker configuration invariants

- The Worker name is `arjunautomationenterprise`.
- `WORKER_SELF_REFERENCE` must reference the same Worker name.
- The Worker entry point is `.open-next/worker.js`.
- Static assets are emitted to `.open-next/assets` and bound as `ASSETS`.
- Node.js compatibility is enabled with `nodejs_compat`.
- Generated `.open-next/` output is ignored by Git and must be created during each build.

## Release safety

- The production branch remains `main`.
- Do not change DNS or custom-domain routing until a new Worker build succeeds
  and production smoke checks pass.
- Keep the Vercel deployment available as a rollback/backup until Cloudflare
  production behavior is verified.
- Runtime credentials belong in Cloudflare secrets/variables, never in Git.
