"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Une erreur est survenue",
  description,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-6 text-center">
      <AlertTriangle className="mb-3 h-8 w-8 text-red-500" />
      <h3 className="text-base font-semibold text-red-700">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-red-600">{description}</p>
      {onRetry ? (
        <Button className="mt-4" variant="danger" onClick={onRetry}>
          Reessayer
        </Button>
      ) : null}
    </div>
  );
}
