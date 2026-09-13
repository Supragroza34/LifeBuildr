import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  URGENCY_BADGE_COLORS,
  URGENCY_COLORS,
  formatCountdown,
  urgencyLevel,
} from "@/lib/urgency";

type TimelineItem = {
  id: string;
  date: Date;
  title: string;
  subtitle: string;
  href: string;
};

export default async function DeadlinesPage() {
  const [deadlines, tasks] = await Promise.all([
    prisma.deadline.findMany({
      include: { program: { include: { university: true } } },
    }),
    prisma.task.findMany({ where: { dueDate: { not: null } } }),
  ]);

  const items: TimelineItem[] = [
    ...deadlines.map((d) => ({
      id: `deadline-${d.id}`,
      date: d.date,
      title: d.label,
      subtitle: `${d.program.university.name} — ${d.program.name}`,
      href: `/dashboard/tracker`,
    })),
    ...tasks.map((t) => ({
      id: `task-${t.id}`,
      date: t.dueDate as Date,
      title: t.title,
      subtitle: t.category,
      href: `/dashboard/checklist`,
    })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        Deadline Countdown
      </h1>
      <p className="mb-6 text-sm text-neutral-500">
        Every school deadline and dated prep task, soonest first.{" "}
        <span className="text-red-600">Red</span> = under 2 weeks,{" "}
        <span className="text-amber-600">yellow</span> = under 6 weeks,{" "}
        <span className="text-green-600">green</span> = further out.
      </p>

      {items.length === 0 && (
        <p className="text-sm text-neutral-400">No dated deadlines yet.</p>
      )}

      <div className="space-y-2">
        {items.map((item) => {
          const level = urgencyLevel(item.date);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center justify-between gap-4 rounded-lg border-l-4 bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-neutral-900 ${URGENCY_COLORS[level]}`}
            >
              <div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                  {item.title}
                </div>
                <div className="text-xs text-neutral-500">
                  {item.subtitle}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {item.date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${URGENCY_BADGE_COLORS[level]}`}
                >
                  {formatCountdown(item.date)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
