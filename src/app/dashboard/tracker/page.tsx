import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { STATUS_LABELS } from "@/lib/status";
import { StatusSelect } from "./StatusSelect";

function nearestDeadline(deadlines: { label: string; date: Date }[]) {
  const now = new Date();
  const upcoming = deadlines
    .filter((d) => d.date >= now)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  if (upcoming.length > 0) return upcoming[0];
  if (deadlines.length > 0) {
    return [...deadlines].sort((a, b) => b.date.getTime() - a.date.getTime())[0];
  }
  return null;
}

export default async function TrackerPage() {
  const applications = await prisma.application.findMany({
    include: {
      program: {
        include: { university: true, deadlines: true },
      },
      fundingOffers: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        Application Tracker
      </h1>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500 dark:border-neutral-800">
            <tr>
              <th className="px-4 py-3 font-medium">School / Program</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Nearest deadline</th>
              <th className="px-4 py-3 font-medium">Visa</th>
              <th className="px-4 py-3 font-medium">Funding offers</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const deadline = nearestDeadline(app.program.deadlines);
              return (
                <tr
                  key={app.id}
                  className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900 dark:text-neutral-100">
                      {app.program.university.name}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {app.program.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusSelect applicationId={app.id} status={app.status} />
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    {deadline ? (
                      <>
                        {deadline.date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        <div className="text-xs text-neutral-400">
                          {deadline.label}
                        </div>
                      </>
                    ) : (
                      <span className="text-neutral-400">TBD</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    {app.visaType ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    {app.fundingOffers.length > 0
                      ? `${app.fundingOffers.length} offer${app.fundingOffers.length > 1 ? "s" : ""}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/tracker/${app.id}`}
                      className="text-sm font-medium text-neutral-700 underline underline-offset-2 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-neutral-400">
        {applications.length} application
        {applications.length === 1 ? "" : "s"} tracked. Statuses:{" "}
        {Object.entries(STATUS_LABELS)
          .map(([, label]) => label)
          .join(", ")}
        .
      </p>
    </div>
  );
}
