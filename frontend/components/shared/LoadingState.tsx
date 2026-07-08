"use client";

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Chargement des donnees..." }: LoadingStateProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
      <p className="mt-4 text-sm text-slate-500">{label}</p>
    </div>
  );
}
