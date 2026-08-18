import { useCallback, useEffect, useRef, useState } from "react";
import type { NewsArticle } from "@/types/news";
import { fetchLatestNews } from "@/services/newsService";

interface UseNewsResult {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  isDemo: boolean;
  lastUpdated: Date | null;
  hasNewArticles: boolean;
  refresh: () => void;
}

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useLatestNews(): UseNewsResult {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [hasNewArticles, setHasNewArticles] = useState(false);
  const prevIdsRef = useRef<Set<string>>(new Set());

  const load = useCallback(async () => {
    try {
      const data = await fetchLatestNews();
      const newIds = new Set(data.articles.map((a) => a.id));
      const hasNew = data.articles.some((a) => !prevIdsRef.current.has(a.id));
      if (prevIdsRef.current.size > 0 && hasNew) {
        setHasNewArticles(true);
        setTimeout(() => setHasNewArticles(false), 8000);
      }
      prevIdsRef.current = newIds;
      setArticles(data.articles);
      setIsDemo(data.isDemo);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load news");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [load]);

  return { articles, loading, error, isDemo, lastUpdated, hasNewArticles, refresh: load };
}
