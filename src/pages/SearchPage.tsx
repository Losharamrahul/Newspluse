import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, AlertCircle, X } from "lucide-react";
import { searchNews } from "@/services/newsService";
import { useDebounce } from "@/hooks/useDebounce";
import { NewsCard } from "@/components/NewsCard";
import { NewsGridSkeleton } from "@/components/Skeletons";
import type { NewsArticle } from "@/types/news";

const SUGGESTIONS = ["Technology", "India", "Cricket", "Elections", "Business", "Climate", "Artificial Intelligence", "Bollywood", "Stock Market", "Health"];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setArticles([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setShowSuggestions(false);
    setSearchParams({ q: debouncedQuery });
    searchNews(debouncedQuery)
      .then((data) => {
        setArticles(data.articles);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Search failed");
        setArticles([]);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery, setSearchParams]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
        <Search className="h-7 w-7 text-red-600" /> Search News
      </h1>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Search headlines, topics, sources..."
          className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 pl-12 pr-12 py-3.5 text-base text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {showSuggestions && !query && (
          <div className="absolute top-full mt-2 left-0 right-0 z-20 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2 px-2">Trending searches</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setQuery(s);
                    setShowSuggestions(false);
                  }}
                  className="rounded-full bg-neutral-100 dark:bg-neutral-700 px-3 py-1.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading && <NewsGridSkeleton count={6} />}

      {error && !loading && (
        <div className="flex flex-col items-center text-center py-16">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{error}</p>
        </div>
      )}

      {!loading && !error && debouncedQuery && articles.length === 0 && (
        <div className="text-center py-16">
          <Search className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">No results found</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            No articles matched "{debouncedQuery}". Try different keywords.
          </p>
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            {articles.length} results for "<span className="font-semibold text-neutral-900 dark:text-white">{debouncedQuery}</span>"
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </>
      )}

      {!loading && !debouncedQuery && (
        <div className="text-center py-16">
          <Search className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">Search for news</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Start typing to search across headlines, topics, and sources.</p>
        </div>
      )}
    </div>
  );
}
