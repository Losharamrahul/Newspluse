import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/services/supabase";
import { useAuth } from "@/context/AuthContext";
import type { NewsArticle } from "@/types/news";

interface StoredBookmark {
  id: string;
  article_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  article_url: string;
  source: string;
  category: string | null;
  published_at: string | null;
  created_at: string;
}

function articleToBookmark(a: NewsArticle) {
  return {
    article_id: a.id,
    title: a.title,
    description: a.description,
    image_url: a.imageUrl,
    article_url: a.link,
    source: a.source,
    category: a.category,
    published_at: a.publishedAt,
  };
}

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<StoredBookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const loadBookmarks = useCallback(async () => {
    if (!user) {
      setBookmarks([]);
      setBookmarkedIds(new Set());
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load bookmarks:", error.message);
    } else if (data) {
      setBookmarks(data as StoredBookmark[]);
      setBookmarkedIds(new Set((data as StoredBookmark[]).map((b) => b.article_id)));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const isBookmarked = useCallback((articleId: string) => bookmarkedIds.has(articleId), [bookmarkedIds]);

  const addBookmark = useCallback(
    async (article: NewsArticle) => {
      if (!user) return { error: "Please sign in to save articles" };
      const { error } = await supabase.from("bookmarks").insert(articleToBookmark(article));
      if (error) {
        return { error: error.message };
      }
      setBookmarkedIds((prev) => new Set(prev).add(article.id));
      setBookmarks((prev) => [{ ...articleToBookmark(article), id: article.id, created_at: new Date().toISOString() } as StoredBookmark, ...prev]);
      return { error: null };
    },
    [user]
  );

  const removeBookmark = useCallback(
    async (articleId: string) => {
      if (!user) return { error: "Please sign in to manage bookmarks" };
      const { error } = await supabase.from("bookmarks").delete().eq("article_id", articleId);
      if (error) {
        return { error: error.message };
      }
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        next.delete(articleId);
        return next;
      });
      setBookmarks((prev) => prev.filter((b) => b.article_id !== articleId));
      return { error: null };
    },
    [user]
  );

  const toggleBookmark = useCallback(
    async (article: NewsArticle) => {
      if (isBookmarked(article.id)) {
        return removeBookmark(article.id);
      }
      return addBookmark(article);
    },
    [isBookmarked, addBookmark, removeBookmark]
  );

  return { bookmarks, loading, isBookmarked, addBookmark, removeBookmark, toggleBookmark, refresh: loadBookmarks };
}
