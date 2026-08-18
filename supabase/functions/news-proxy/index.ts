import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  imageUrl: string | null;
  source: string;
  category: string;
  publishedAt: string;
  isBreaking: boolean;
}

const CATEGORY_MAP: Record<string, string> = {
  world: "World",
  nation: "India",
  telangana: "Telangana",
  andhra: "Andhra Pradesh",
  technology: "Technology",
  business: "Business",
  sports: "Sports",
  entertainment: "Entertainment",
  science: "Science",
  health: "Health",
  politics: "Politics",
};

const GOOGLE_NEWS_RSS: Record<string, string> = {
  world: "https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-IN&gl=IN&ceid=IN:en",
  nation: "https://news.google.com/rss/headlines/section/topic/NATION?hl=en-IN&gl=IN&ceid=IN:en",
  technology: "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-IN&gl=IN&ceid=IN:en",
  business: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en",
  sports: "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-IN&gl=IN&ceid=IN:en",
  entertainment: "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-IN&gl=IN&ceid=IN:en",
  science: "https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en-IN&gl=IN&ceid=IN:en",
  health: "https://news.google.com/rss/headlines/section/topic/HEALTH?hl=en-IN&gl=IN&ceid=IN:en",
};

const REGION_RSS: Record<string, string> = {
  telangana: "https://news.google.com/rss/search?q=Telangana+when:2d&hl=en-IN&gl=IN&ceid=IN:en",
  andhra: "https://news.google.com/rss/search?q=Andhra+Pradesh+when:2d&hl=en-IN&gl=IN&ceid=IN:en",
  politics: "https://news.google.com/rss/search?q=India+politics+when:2d&hl=en-IN&gl=IN&ceid=IN:en",
};

function hashId(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return `np-${Math.abs(h).toString(36)}`;
}

function stripHtml(html: string): string {
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function extractImageFromHtml(html: string): string | null {
  const unescaped = html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
  const imgMatch = unescaped.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) {
    const url = imgMatch[1];
    if (url.startsWith("http")) return url;
  }
  return null;
}

const CATEGORY_KEYWORDS: Record<string, string> = {
  World: "world,news",
  India: "india,newspaper",
  Telangana: "telangana,hyderabad",
  "Andhra Pradesh": "andhra,india",
  Technology: "technology,computer",
  Business: "business,finance",
  Sports: "sports,stadium",
  Entertainment: "entertainment,concert",
  Science: "science,laboratory",
  Health: "health,medical",
  Politics: "politics,government",
};

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
  "by", "from", "is", "are", "was", "were", "be", "been", "being", "have", "has",
  "had", "do", "does", "did", "will", "would", "could", "should", "may", "might",
  "must", "can", "this", "that", "these", "those", "it", "its", "as", "if", "then",
  "than", "so", "not", "no", "yes", "up", "down", "out", "about", "into", "over",
  "after", "before", "new", "news", "says", "said", "amid", "over", "still",
]);

function extractKeywords(title: string, category: string): string {
  const words = title
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
    .slice(0, 3);
  const catKeyword = CATEGORY_KEYWORDS[category] || category.toLowerCase();
  const keyword = words.length > 0 ? words.join(",") : catKeyword;
  return encodeURIComponent(keyword);
}

function placeholderImage(title: string, category: string): string {
  const keyword = extractKeywords(title, category);
  return `https://loremflickr.com/800/450/${keyword}`;
}

async function resolveGoogleNewsLink(link: string): Promise<string> {
  if (!link.startsWith("https://news.google.com/")) return link;
  try {
    const resp = await fetch(link, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NewsPulse/1.0)" },
    });
    return resp.url || link;
  } catch {
    return link;
  }
}

async function fetchOgImage(articleUrl: string): Promise<string | null> {
  try {
    const resp = await fetch(articleUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NewsPulse/1.0)" },
      signal: AbortSignal.timeout(5000),
    });
    if (!resp.ok) return null;
    const html = await resp.text();
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (ogMatch && ogMatch[1].startsWith("http")) return ogMatch[1];
    const twitterMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
    if (twitterMatch && twitterMatch[1].startsWith("http")) return twitterMatch[1];
    const imgMatch = html.match(/<img[^>]+src=["']([^"']+(?:\.(?:jpg|jpeg|png|webp))[^"']*)["']/i);
    if (imgMatch && imgMatch[1].startsWith("http")) return imgMatch[1];
    return null;
  } catch {
    return null;
  }
}

function parseDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}

function extractSource(title: string, sourceTag: string): string {
  const match = title.match(/\s-\s([^-]+)$/);
  if (match) return match[1].trim();
  return stripHtml(sourceTag) || "Google News";
}

function cleanTitle(title: string): string {
  return title.replace(/\s-\s[^-]+$/, "").trim();
}

async function fetchRss(url: string, category: string): Promise<NewsArticle[]> {
  const resp = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; NewsPulse/1.0)",
      Accept: "application/rss+xml, application/xml, text/xml",
    },
  });
  if (!resp.ok) throw new Error(`RSS fetch failed: ${resp.status}`);

  const xml = await resp.text();
  const items: NewsArticle[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null && items.length < 40) {
    const block = match[1];
    const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = block.match(/<link>([\s\S]*?)<\/link>/);
    const descMatch = block.match(/<description>([\s\S]*?)<\/description>/);
    const dateMatch = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const sourceMatch = block.match(/<source[^>]*>([\s\S]*?)<\/source>/);

    if (!titleMatch || !linkMatch) continue;

    const rawTitle = stripHtml(titleMatch[1]);
    const source = extractSource(rawTitle, sourceMatch?.[1] || "");
    const title = cleanTitle(rawTitle);
    const link = stripHtml(linkMatch[1]);
    const description = descMatch ? stripHtml(descMatch[1]).slice(0, 280) : "";
    const publishedAt = dateMatch ? parseDate(dateMatch[1]) : new Date().toISOString();

    let imageUrl: string | null = null;
    const mediaMatch = block.match(/<media:content[^>]+url="([^"]+)"/);
    if (mediaMatch) imageUrl = mediaMatch[1];
    const encMatch = block.match(/<enclosure[^>]+url="([^"]+)"[^>]*type="image/);
    if (!imageUrl && encMatch) imageUrl = encMatch[1];
    if (!imageUrl && descMatch) imageUrl = extractImageFromHtml(descMatch[1]);
    const needsOgImage = !imageUrl;
    if (!imageUrl) imageUrl = placeholderImage(title, category);

    const isBreaking = /breaking|urgent|alert|just in/i.test(title);

    items.push({
      id: hashId(link || title),
      title,
      description,
      link,
      imageUrl,
      source,
      category: CATEGORY_MAP[category] || category,
      publishedAt,
      isBreaking,
      _needsOgImage: needsOgImage,
    } as NewsArticle & { _needsOgImage: boolean });
  }

  return items;
}

async function enrichWithOgImages(articles: NewsArticle[], limit = 12): Promise<NewsArticle[]> {
  const toEnrich = articles.filter((a) => (a as { _needsOgImage?: boolean })._needsOgImage).slice(0, limit);
  if (toEnrich.length === 0) return articles;

  const results = await Promise.allSettled(
    toEnrich.map(async (a) => {
      const realUrl = await resolveGoogleNewsLink(a.link);
      const ogImage = await fetchOgImage(realUrl);
      return { id: a.id, ogImage };
    })
  );

  const imageMap = new Map<string, string>();
  results.forEach((r) => {
    if (r.status === "fulfilled" && r.value.ogImage) {
      imageMap.set(r.value.id, r.value.ogImage);
    }
  });

  return articles.map((a) => {
    const og = imageMap.get(a.id);
    if (og) {
      const { _needsOgImage, ...rest } = a as NewsArticle & { _needsOgImage?: boolean };
      return { ...rest, imageUrl: og };
    }
    const { _needsOgImage, ...rest } = a as NewsArticle & { _needsOgImage?: boolean };
    return rest;
  });
}

function dedupe(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  const out: NewsArticle[] = [];
  for (const a of articles) {
    if (seen.has(a.id)) continue;
    seen.add(a.id);
    out.push(a);
  }
  return out;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/news-proxy\/?/, "");
    const params = url.searchParams;
    const category = (params.get("category") || "").toLowerCase();
    const query = (params.get("q") || "").toLowerCase();

    // /latest — fetch from multiple feeds
    if (path === "latest" || path === "" || path === "/") {
      const feeds = ["nation", "world", "business", "technology"];
      const results = await Promise.allSettled(
        feeds.map((c) => fetchRss(GOOGLE_NEWS_RSS[c], c))
      );
      let all: NewsArticle[] = [];
      results.forEach((r) => {
        if (r.status === "fulfilled") all = all.concat(r.value);
      });
      if (all.length === 0) {
        return new Response(
          JSON.stringify({ error: "No news available right now. Please try again later.", articles: [], isDemo: false }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      const articles = dedupe(all).slice(0, 60);
      const enriched = await enrichWithOgImages(articles, 15);
      return new Response(
        JSON.stringify({ articles: enriched, isDemo: false, fetchedAt: new Date().toISOString() }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // /trending — top stories from multiple feeds, scored by recency
    if (path === "trending") {
      const feeds = ["nation", "world", "sports", "entertainment", "technology"];
      const results = await Promise.allSettled(
        feeds.map((c) => fetchRss(GOOGLE_NEWS_RSS[c], c))
      );
      let all: NewsArticle[] = [];
      results.forEach((r) => {
        if (r.status === "fulfilled") all = all.concat(r.value);
      });
      all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      const articles = dedupe(all).slice(0, 10);
      const enriched = await enrichWithOgImages(articles, 10);
      return new Response(
        JSON.stringify({ articles: enriched, isDemo: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // /breaking — breaking flag from latest
    if (path === "breaking") {
      const feeds = ["nation", "world"];
      const results = await Promise.allSettled(
        feeds.map((c) => fetchRss(GOOGLE_NEWS_RSS[c], c))
      );
      let all: NewsArticle[] = [];
      results.forEach((r) => {
        if (r.status === "fulfilled") all = all.concat(r.value);
      });
      const breaking = dedupe(all)
        .filter((a) => a.isBreaking)
        .slice(0, 8);
      const headlines = (breaking.length > 0 ? breaking : dedupe(all).slice(0, 8)).map((a) => ({
        id: a.id,
        title: a.title,
        link: a.link,
        source: a.source,
        publishedAt: a.publishedAt,
      }));
      return new Response(
        JSON.stringify({ headlines, isDemo: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // /category/:category
    if (path.startsWith("category/") || category) {
      const cat = path.replace("category/", "") || category;
      let rssUrl = GOOGLE_NEWS_RSS[cat] || REGION_RSS[cat];
      if (!rssUrl) {
        return new Response(
          JSON.stringify({ error: `Unknown category: ${cat}`, articles: [] }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const articles = await fetchRss(rssUrl, cat);
      const enriched = await enrichWithOgImages(articles, 12);
      return new Response(
        JSON.stringify({ articles: enriched, isDemo: false, category: CATEGORY_MAP[cat] || cat }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // /search?q=
    if (path === "search" || query) {
      const q = query || params.get("q") || "";
      if (!q) {
        return new Response(
          JSON.stringify({ articles: [], query: "" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}+when:7d&hl=en-IN&gl=IN&ceid=IN:en`;
      const articles = await fetchRss(rssUrl, "world");
      const enriched = await enrichWithOgImages(articles, 12);
      return new Response(
        JSON.stringify({ articles: enriched, query: q, isDemo: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found", path }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal error", articles: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
