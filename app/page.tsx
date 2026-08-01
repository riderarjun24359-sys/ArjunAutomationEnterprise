import Link from "next/link";
import { appConfig, appFeatures } from "@/src/config/app";
import { ROUTES } from "@/src/constants/routes";
import { USER_ROLES } from "@/src/constants/roles";
import { AuthStatus } from "@/src/modules/auth/components/AuthStatus";

const foundationAreas = [
  {
    title: "Shared infrastructure",
    description: "Typed configuration, provider composition, and environment-safe integration layers.",
  },
  {
    title: "State management",
    description: "Zustand stores for app state, authentication, and UI interactions with reusable hooks.",
  },
  {
    title: "Enterprise routing",
    description: "Centralized route and permission constants for consistent cross-module navigation.",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-24 lg:px-8">
        <div className="mb-8 flex justify-end">
          <AuthStatus />
        </div>
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-slate-200 backdrop-blur">
              Enterprise foundation ready
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {appConfig.name}
              </h1>
              <p className="max-w-2xl text-lg text-slate-300 sm:text-xl">
                {appConfig.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={ROUTES.dashboard}
                className="rounded-full bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-100"
              >
                Open dashboard
              </Link>
              <Link
                href={ROUTES.settings}
                className="rounded-full border border-white/15 px-5 py-3 font-medium text-slate-100 transition hover:bg-white/10"
              >
                Configure settings
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl shadow-black/20 backdrop-blur">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
              Foundation pillars
            </p>
            <ul className="mt-6 space-y-4">
              {foundationAreas.map((item) => (
                <li key={item.title} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <h2 className="text-base font-semibold text-white">{item.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {appFeatures.map((feature) => (
            <div key={feature} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300">
              {feature}
            </div>
          ))}
        </div>

        <div className="mt-8 text-sm text-slate-400">
          Roles scaffolded: {Object.values(USER_ROLES).join(", ")}
        </div>
      </section>
    </main>
  );
}
