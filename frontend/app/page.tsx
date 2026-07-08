import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_#EEF2FF,_#F8FAFC_45%,_#EFF6FF)] p-6">
      <main className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">LexiVoice Intake</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">AI Legal Intake Dashboard</h1>
        <p className="mt-3 text-sm text-slate-600">
          Centralisez vos prospects, appels et documents avec une vue claire, moderne et orientee cabinet d avocats.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Ouvrir le dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </main>
    </div>
  );
}
