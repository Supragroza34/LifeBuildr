import "server-only";
import { createHash } from "crypto";

const SCANNER_USER_AGENT =
  "LifeBuildr-PersonalScanner/1.0 (+personal grad-school application tracker; checks a page you added on purpose)";

/** Strips scripts/styles/tags and collapses whitespace to get a rough text snapshot for diffing. */
export function extractText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function hashText(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

export async function fetchPageText(
  url: string,
): Promise<{ text: string; hash: string }> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(20000),
    headers: { "User-Agent": SCANNER_USER_AGENT },
  });
  if (!res.ok) {
    throw new Error(`Fetch failed (${res.status}) for ${url}`);
  }
  const html = await res.text();
  const text = extractText(html).slice(0, 100_000);
  return { text, hash: hashText(text) };
}
