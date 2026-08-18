import type { NewsArticle, NewsResponse, BreakingResponse } from "@/types/news";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/news-proxy`;
const HEADERS = {
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

async function fetchEndpoint<T>(path: string): Promise<T> {
  const resp = await fetch(`${FUNCTION_URL}${path}`, { headers: HEADERS });
  if (!resp.ok) {
    let message = `Request failed (${resp.status})`;
    try {
      const body = await resp.json();
      if (body?.error) message = body.error;
    } catch {
      // keep default
    }
    throw new Error(message);
  }
  const data = await resp.json();
  if (data?.error) throw new Error(data.error);
  return data as T;
}

export async function fetchLatestNews(): Promise<NewsResponse> {
  return fetchEndpoint<NewsResponse>("/latest");
}

export async function fetchTrendingNews(): Promise<NewsResponse> {
  return fetchEndpoint<NewsResponse>("/trending");
}

export async function fetchBreakingNews(): Promise<BreakingResponse> {
  return fetchEndpoint<BreakingResponse>("/breaking");
}

export async function fetchCategoryNews(categorySlug: string): Promise<NewsResponse> {
  return fetchEndpoint<NewsResponse>(`/category/${categorySlug}`);
}

export async function searchNews(query: string): Promise<NewsResponse> {
  return fetchEndpoint<NewsResponse>(`/search?q=${encodeURIComponent(query)}`);
}
