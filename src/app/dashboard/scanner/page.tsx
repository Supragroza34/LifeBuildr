import { prisma } from "@/lib/prisma";
import { addWatchedPage, deleteWatchedPage } from "@/app/actions/scanner";
import { CheckPageButton } from "./CheckPageButton";

function formatDate(date: Date | null) {
  if (!date) return "Never";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function ScannerPage() {
  const pages = await prisma.watchedPage.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        Site Scanner
      </h1>
      <p className="mb-6 text-sm text-neutral-500">
        Add a page you care about (e.g. a school&apos;s funding or visa page)
        and check it whenever you want. If the content has changed since the
        last check, it&apos;s flagged here.
      </p>

      <div className="mb-6 space-y-3">
        {pages.length === 0 && (
          <p className="text-sm text-neutral-400">
            No pages being watched yet — add one below.
          </p>
        )}
        {pages.map((page) => (
          <div
            key={page.id}
            className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                  {page.label}
                </div>
                <a
                  href={page.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-700 dark:hover:text-neutral-300"
                >
                  {page.url}
                </a>
              </div>
              <form action={deleteWatchedPage.bind(null, page.id)}>
                <button
                  type="submit"
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </form>
            </div>

            <div className="mb-2 text-xs text-neutral-500">
              Last checked: {formatDate(page.lastCheckedAt)}
              {page.lastChangedAt && (
                <> · Last changed: {formatDate(page.lastChangedAt)}</>
              )}
            </div>

            <CheckPageButton pageId={page.id} />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Watch a new page
        </h2>
        <form action={addWatchedPage} className="flex flex-wrap items-end gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Label
            </label>
            <input
              name="label"
              placeholder="UCLA funding page"
              required
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-950"
            />
          </div>
          <div className="flex-[2]">
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              URL
            </label>
            <input
              name="url"
              type="url"
              placeholder="https://cs.ucla.edu/admissions/funding"
              required
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-950"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
          >
            Add
          </button>
        </form>
      </div>

      <p className="mt-4 text-xs text-neutral-400">
        Checks only run when you click &quot;Check now&quot; — there&apos;s no
        automatic background schedule yet, since that needs the app deployed
        somewhere with a cron trigger.
      </p>
    </div>
  );
}
