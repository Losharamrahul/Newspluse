import { useCallback, useEffect, useState } from "react";
import type { NewsArticle } from "@/types/news";
import { fetchCategoryNews } from "@/services/newsService";

export function useCategoryNews(categorySlug: string) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCategoryNews(categorySlug);
      setArticles(data.articles);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load category news");
    } finally {
      setLoading(false);
    }
  }, [categorySlug]);

  useEffect(() => {
    load();
  }, [load]);

  return { articles, loading, error, refresh: load };
}
