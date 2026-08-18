import { Link } from "react-router-dom";
import { TrendingUp, AlertCircle, Clock, Flame } from "lucide-react";
import { useTrendingNews } from "@/hooks/useTrendingNews";
import { NewsCard } from "@/components/NewsCard";
import { NewsGridSkeleton } from "@/components/Skeletons";
import { formatRelativeTime } from "@/utils/format";
import { fallbackImage } from "@/utils/images";

export function TrendingPage() {
  const { articles, loading, error } = useTrendingNews();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3 mb-2">
        <TrendingUp className="h-7 w-7 text-red-600" /> Trending Now
      </h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
        Top stories ranked by recency and popularity
      </p>

      {loading && (
        <>
          <div className="space-y-3 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            ))}
          </div>
          <NewsGridSkeleton count={3} />
        </>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center text-center py-16">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{error}</p>
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <>
          {/* Top 5 ranked list */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-5">
              <Flame className="h-5 w-5 text-red-600" /> Top 5 Trending
            </h2>
            <div className="space-y-3">
              {articles.slice(0, 5).map((article, i) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  state={{ article }}
                  className="group flex items-center gap-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 hover:shadow-md transition-shadow"
                >
                  <span className="text-3xl font-bold text-red-600/20 dark:text-red-500/20 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors w-12 text-center shrink-0">
                    #{i + 1}
                  </span>
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-700">
                    <img
                      src={article.imageUrl || fallbackImage(article.category, 400, 250)}
                      alt=""
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage(article.category, 400, 250);
                      }}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-500">{article.category}</span>
                    <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                      {article.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="font-medium">{article.source}</span>
                      <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {formatRelativeTime(article.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Rest as grid */}
          {articles.length > 5 && (
            <section>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-5">
                <span className="h-5 w-1 rounded-full bg-red-600" /> More Trending
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {articles.slice(5).map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
