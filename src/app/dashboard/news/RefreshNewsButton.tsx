"use client";

import { useState, useTransition } from "react";
import { refreshNews } from "@/app/actions/news";

export function RefreshNewsButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    fetchedCount?: number;
    errors?: string[];
    error?: string;
  } | null>(null);

  return (
    <div>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setResult(null);
          startTransition(async () => {
            const res = await refreshNews();
            setResult(res);
          });
        }}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {isPending ? "Refreshing..." : "Refresh news"}
      </button>
      {result?.error && (
        <p className="mt-2 text-sm text-red-600">{result.error}</p>
      )}
      {result?.fetchedCount !== undefined && (
        <p className="mt-2 text-sm text-neutral-500">
          Checked sources, saw {result.fetchedCount} article
          {result.fetchedCount === 1 ? "" : "s"}.
        </p>
      )}
      {result?.errors && result.errors.length > 0 && (
        <ul className="mt-2 text-sm text-red-600">
          {result.errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
