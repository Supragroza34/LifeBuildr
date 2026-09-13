import { prisma } from "@/lib/prisma";
import {
  addNewsSource,
  deleteNewsSource,
  toggleNewsSource,
} from "@/app/actions/news";
import { RefreshNewsButton } from "./RefreshNewsButton";

export default async function NewsPage() {
  const [sources, articles] = await Promise.all([
    prisma.newsSource.findMany({ orderBy: { name: "asc" } }),
    prisma.newsArticle.findMany({
      orderBy: [{ publishedAt: "desc" }, { fetchedAt: "desc" }],
      take: 30,
    }),
  ]);

  const hasApiKey = Boolean(process.env.GNEWS_API_KEY);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        News Feed
      </h1>
      <p className="mb-6 text-sm text-neutral-500">
        Visa policy, funding announcements, and international student news
        via GNews, filtered by the keyword sources you configure below.
      </p>

      {!hasApiKey && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
          Add <code>GNEWS_API_KEY</code> to your <code>.env</code> file (get a
          free key at gnews.io) to enable fetching.
        </div>
      )}

      <div className="mb-6">
        <RefreshNewsButton />
      </div>

      <div className="mb-8 space-y-3">
        {articles.length === 0 && (
          <p className="text-sm text-neutral-400">
            No articles yet — click &quot;Refresh news&quot; once you&apos;ve
            added a keyword source and an API key.
          </p>
        )}
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
          >
            <div className="font-medium text-neutral-900 dark:text-neutral-100">
              {article.title}
            </div>
            {article.description && (
              <p className="mt-1 text-sm text-neutral-500">
                {article.description}
              </p>
            )}
            {article.publishedAt && (
              <div className="mt-2 text-xs text-neutral-400">
                {article.publishedAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            )}
          </a>
        ))}
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Keyword sources
        </h2>

        {sources.length > 0 && (
          <ul className="mb-4 space-y-2">
            {sources.map((source) => (
              <li
                key={source.id}
                className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800"
              >
                <div>
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">
                    {source.name}
                  </div>
                  <div className="text-xs text-neutral-500">
                    &quot;{source.keywords}&quot;
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <form
                    action={toggleNewsSource.bind(
                      null,
                      source.id,
                      !source.enabled,
                    )}
                  >
                    <button
                      type="submit"
                      className={
                        source.enabled
                          ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300"
                          : "rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500 dark:bg-neutral-800"
                      }
                    >
                      {source.enabled ? "Enabled" : "Disabled"}
                    </button>
                  </form>
                  <form action={deleteNewsSource.bind(null, source.id)}>
                    <button
                      type="submit"
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form action={addNewsSource} className="flex flex-wrap items-end gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Name
            </label>
            <input
              name="name"
              placeholder="Visa policy"
              required
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-950"
            />
          </div>
          <div className="flex-[2]">
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Search keywords
            </label>
            <input
              name="keywords"
              placeholder="F-1 visa OR OPT policy change"
              required
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-950"
            />
          </div>
          <button
            type="submit"
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
