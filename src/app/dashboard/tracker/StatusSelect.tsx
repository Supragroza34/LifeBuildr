"use client";

import { useTransition } from "react";
import type { ApplicationStatus } from "@prisma/client";
import { updateApplicationStatus } from "@/app/actions/applications";
import { APPLICATION_STATUSES, STATUS_LABELS } from "@/lib/status";

export function StatusSelect({
  applicationId,
  status,
}: {
  applicationId: string;
  status: ApplicationStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(() => {
          updateApplicationStatus(applicationId, next);
        });
      }}
      className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-950"
    >
      {APPLICATION_STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
