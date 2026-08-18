import { useCallback, useEffect, useState } from "react";
import type { NewsArticle } from "@/types/news";
import { fetchTrendingNews } from "@/services/newsService";

export function useTrendingNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchTrendingNews();
      setArticles(data.articles);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trending news");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { articles, loading, error };
}
