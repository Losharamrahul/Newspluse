import { useCallback, useEffect, useState } from "react";
import type { BreakingHeadline } from "@/types/news";
import { fetchBreakingNews } from "@/services/newsService";

export function useBreakingNews(refreshMs = 3 * 60 * 1000) {
  const [headlines, setHeadlines] = useState<BreakingHeadline[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchBreakingNews();
      setHeadlines(data.headlines);
    } catch {
      // silent — ticker just won't show
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, refreshMs);
    return () => clearInterval(interval);
  }, [load, refreshMs]);

  return { headlines, loading };
}
