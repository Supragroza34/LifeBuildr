"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { fetchPageText } from "@/lib/scan";

export async function addWatchedPage(formData: FormData) {
  await verifySession();

  const label = formData.get("label");
  const url = formData.get("url");
  if (typeof label !== "string" || label.trim() === "") return;
  if (typeof url !== "string" || url.trim() === "") return;

  let normalizedUrl: string;
  try {
    normalizedUrl = new URL(url.trim()).toString();
  } catch {
    return;
  }

  await prisma.watchedPage.create({
    data: { label: label.trim(), url: normalizedUrl },
  });

  revalidatePath("/dashboard/scanner");
}

export async function deleteWatchedPage(pageId: string) {
  await verifySession();
  await prisma.watchedPage.delete({ where: { id: pageId } });
  revalidatePath("/dashboard/scanner");
}

export async function checkWatchedPage(
  pageId: string,
): Promise<{ ok: boolean; changed?: boolean; error?: string }> {
  await verifySession();

  const page = await prisma.watchedPage.findUnique({ where: { id: pageId } });
  if (!page) return { ok: false, error: "Page not found" };

  const now = new Date();

  try {
    const { text, hash } = await fetchPageText(page.url);
    const changed =
      page.lastContentHash !== null && page.lastContentHash !== hash;

    await prisma.watchedPage.update({
      where: { id: pageId },
      data: {
        lastContentHash: hash,
        lastContentText: text,
        lastCheckedAt: now,
        lastChangedAt: changed ? now : page.lastChangedAt,
      },
    });

    revalidatePath("/dashboard/scanner");
    return { ok: true, changed };
  } catch (err) {
    // Record the attempt even on failure so "last checked" reflects reality.
    await prisma.watchedPage.update({
      where: { id: pageId },
      data: { lastCheckedAt: now },
    });
    revalidatePath("/dashboard/scanner");
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
