import { ProtectedRoute } from "@/src/modules/auth/components/ProtectedRoute";

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
                <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h1 className="text-3xl font-semibold">Dashboard</h1>
                    <p className="mt-3 text-slate-600">This protected workspace is only accessible to authenticated users.</p>
                </div>
            </main>
        </ProtectedRoute>
    );
}
