"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { searchGNews } from "@/lib/gnews";

const REFRESH_COOLDOWN_MS = 60 * 60 * 1000; // don't refetch a source more than once/hour

export async function addNewsSource(formData: FormData) {
  await verifySession();

  const name = formData.get("name");
  const keywords = formData.get("keywords");
  if (typeof name !== "string" || name.trim() === "") return;
  if (typeof keywords !== "string" || keywords.trim() === "") return;

  await prisma.newsSource.create({
    data: {
      name: name.trim(),
      type: "api",
      keywords: keywords.trim(),
      enabled: true,
    },
  });

  revalidatePath("/dashboard/news");
}

export async function toggleNewsSource(sourceId: string, enabled: boolean) {
  await verifySession();
  await prisma.newsSource.update({
    where: { id: sourceId },
    data: { enabled },
  });
  revalidatePath("/dashboard/news");
}

export async function deleteNewsSource(sourceId: string) {
  await verifySession();
  await prisma.newsSource.delete({ where: { id: sourceId } });
  revalidatePath("/dashboard/news");
}

export async function refreshNews() {
  await verifySession();

  if (!process.env.GNEWS_API_KEY) {
    return { error: "GNEWS_API_KEY is not set in .env" };
  }

  const sources = await prisma.newsSource.findMany({
    where: { enabled: true, type: "api" },
  });

  const now = new Date();
  let fetchedCount = 0;
  const errors: string[] = [];

  for (const source of sources) {
    if (!source.keywords) continue;

    if (
      source.lastFetchedAt &&
      now.getTime() - source.lastFetchedAt.getTime() < REFRESH_COOLDOWN_MS
    ) {
      continue; // skip — checked recently, protect the free API quota
    }

    try {
      const articles = await searchGNews(source.keywords);
      for (const article of articles) {
        await prisma.newsArticle.upsert({
          where: { url: article.url },
          update: {
            title: article.title,
            description: article.description,
            imageUrl: article.image,
            publishedAt: article.publishedAt
              ? new Date(article.publishedAt)
              : null,
          },
          create: {
            sourceId: source.id,
            title: article.title,
            url: article.url,
            description: article.description,
            imageUrl: article.image,
            publishedAt: article.publishedAt
              ? new Date(article.publishedAt)
              : null,
          },
        });
      }
      fetchedCount += articles.length;
      await prisma.newsSource.update({
        where: { id: source.id },
        data: { lastFetchedAt: now },
      });
    } catch (err) {
      errors.push(
        `${source.name}: ${err instanceof Error ? err.message : "unknown error"}`,
      );
    }
  }

  revalidatePath("/dashboard/news");
  return { fetchedCount, errors };
}
