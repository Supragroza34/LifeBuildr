"use client";

import { useState, useTransition } from "react";
import { checkWatchedPage } from "@/app/actions/scanner";

export function CheckPageButton({ pageId }: { pageId: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<
    { ok: boolean; changed?: boolean; error?: string } | null
  >(null);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setResult(null);
          startTransition(async () => {
            const res = await checkWatchedPage(pageId);
            setResult(res);
          });
        }}
        className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
      >
        {isPending ? "Checking..." : "Check now"}
      </button>
      {result && (
        <span
          className={
            result.ok
              ? result.changed
                ? "text-sm font-medium text-amber-600"
                : "text-sm text-neutral-500"
              : "text-sm text-red-600"
          }
        >
          {result.ok
            ? result.changed
              ? "Changed!"
              : "No change"
            : `Failed: ${result.error}`}
        </span>
      )}
    </div>
  );
}
