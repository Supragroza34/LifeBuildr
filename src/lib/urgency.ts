export type UrgencyLevel = "red" | "yellow" | "green";

const DAY_MS = 24 * 60 * 60 * 1000;

export function daysUntil(date: Date, now: Date = new Date()): number {
  return Math.ceil((date.getTime() - now.getTime()) / DAY_MS);
}

export function urgencyLevel(date: Date, now: Date = new Date()): UrgencyLevel {
  const days = daysUntil(date, now);
  if (days < 14) return "red";
  if (days < 42) return "yellow";
  return "green";
}

export const URGENCY_COLORS: Record<UrgencyLevel, string> = {
  red: "border-red-400 bg-red-50 dark:border-red-800 dark:bg-red-950",
  yellow: "border-amber-400 bg-amber-50 dark:border-amber-800 dark:bg-amber-950",
  green: "border-green-400 bg-green-50 dark:border-green-800 dark:bg-green-950",
};

export const URGENCY_BADGE_COLORS: Record<UrgencyLevel, string> = {
  red: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  yellow: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  green: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

export function formatCountdown(date: Date, now: Date = new Date()): string {
  const days = daysUntil(date, now);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days > 0) {
    if (days < 14) return `In ${days} days`;
    if (days < 60) return `In ${Math.round(days / 7)} weeks`;
    return `In ${Math.round(days / 30)} months`;
  }
  const past = Math.abs(days);
  if (past < 14) return `${past} days ago`;
  if (past < 60) return `${Math.round(past / 7)} weeks ago`;
  return `${Math.round(past / 30)} months ago`;
}
