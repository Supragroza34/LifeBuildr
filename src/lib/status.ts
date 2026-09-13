import type { ApplicationStatus } from "@prisma/client";

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "SUBMITTED",
  "INTERVIEW",
  "DECISION_PENDING",
  "ADMITTED",
  "REJECTED",
  "DECLINED",
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "In progress",
  SUBMITTED: "Submitted",
  INTERVIEW: "Interview",
  DECISION_PENDING: "Decision pending",
  ADMITTED: "Admitted",
  REJECTED: "Rejected",
  DECLINED: "Declined",
};

// Tailwind classes for status badges — light/dark aware.
export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  NOT_STARTED:
    "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
  IN_PROGRESS:
    "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  SUBMITTED:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  INTERVIEW:
    "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  DECISION_PENDING:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  ADMITTED:
    "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  DECLINED:
    "bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
};
