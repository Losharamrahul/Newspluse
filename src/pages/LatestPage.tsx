import { useState } from "react";
import { Clock, RefreshCw, AlertCircle } from "lucide-react";
import { useLatestNews } from "@/hooks/useLatestNews";
import { NewsCard } from "@/components/NewsCard";
import { NewsGridSkeleton } from "@/components/Skeletons";
import { LiveIndicator } from "@/components/LiveIndicator";
import { formatRelativeTime } from "@/utils/format";

export function LatestPage() {
  const { articles, loading, error, lastUpdated, refresh } = useLatestNews();
  const [visibleCount, setVisibleCount] = useState(12);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
            <span className="h-8 w-1.5 rounded-full bg-red-600" /> Latest News
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Most recent articles from trusted sources, auto-refreshing every 5 minutes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LiveIndicator size="md" />
          {lastUpdated && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <Clock className="h-3 w-3" /> {formatRelativeTime(lastUpdated.toISOString())}
            </span>
          )}
          <button onClick={refresh} className="flex items-center gap-1 text-sm font-medium text-red-600 dark:text-red-500 hover:gap-2 transition-all">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      {loading && articles.length === 0 && <NewsGridSkeleton count={9} />}

      {error && articles.length === 0 && (
        <div className="flex flex-col items-center text-center py-16">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Unable to load news</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">{error}</p>
          <button onClick={refresh} className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors">
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.slice(0, visibleCount).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
          {visibleCount < articles.length && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + 9)}
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-6 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-500 transition-colors"
              >
                Load More Articles
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
