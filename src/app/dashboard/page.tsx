import Link from "next/link";
import { tiles } from "@/lib/tiles";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        Dashboard
      </h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.key}
            href={tile.href}
            className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
          >
            <span className="text-4xl">{tile.icon}</span>
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {tile.title}
            </span>
            <span className="text-xs text-neutral-500">
              {tile.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
