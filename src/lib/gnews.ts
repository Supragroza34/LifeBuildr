import "server-only";

export type GNewsArticle = {
  title: string;
  description: string | null;
  url: string;
  image: string | null;
  publishedAt: string;
};

type GNewsResponse = {
  articles: {
    title: string;
    description: string | null;
    url: string;
    image: string | null;
    publishedAt: string;
  }[];
};

export async function searchGNews(query: string): Promise<GNewsArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    throw new Error("GNEWS_API_KEY is not set");
  }

  const url = new URL("https://gnews.io/api/v4/search");
  url.searchParams.set("q", query);
  url.searchParams.set("lang", "en");
  url.searchParams.set("max", "10");
  url.searchParams.set("apikey", apiKey);

  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GNews request failed (${res.status}): ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as GNewsResponse;
  return data.articles.map((a) => ({
    title: a.title,
    description: a.description,
    url: a.url,
    image: a.image,
    publishedAt: a.publishedAt,
  }));
}
