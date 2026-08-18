import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Clock, TrendingUp, Flame, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import { useLatestNews } from "@/hooks/useLatestNews";
import { useTrendingNews } from "@/hooks/useTrendingNews";
import { NewsCard } from "@/components/NewsCard";
import { NewsGridSkeleton, FeaturedSkeleton } from "@/components/Skeletons";
import { LiveIndicator } from "@/components/LiveIndicator";
import { CATEGORIES, type NewsArticle } from "@/types/news";
import { formatRelativeTime, categoryToSlug } from "@/utils/format";
import { fallbackImage } from "@/utils/images";

export function HomePage() {
  const { articles, loading, error, isDemo, lastUpdated, hasNewArticles, refresh } = useLatestNews();
  const { articles: trending, loading: trendingLoading } = useTrendingNews();
  const [visibleCount, setVisibleCount] = useState(9);

  const featured = articles[0];
  const secondaryFeatured = articles.slice(1, 3);
  const latestGrid = articles.slice(3, 3 + visibleCount);

  const categorySections = useMemo(() => {
    const sections: Record<string, NewsArticle[]> = {};
    for (const article of articles) {
      if (!sections[article.category]) sections[article.category] = [];
      if (sections[article.category].length < 4) sections[article.category].push(article);
    }
    return sections;
  }, [articles]);

  const mostRead = articles.slice(10, 15);

  if (loading && articles.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <FeaturedSkeleton />
        <div className="mt-8">
          <NewsGridSkeleton count={6} />
        </div>
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Unable to load news</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">{error}</p>
          <button
            onClick={refresh}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Live indicator + last updated */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LiveIndicator size="md" />
          {isDemo && (
            <span className="rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 text-xs font-medium">
              Demo data
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          {lastUpdated && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> Updated {formatRelativeTime(lastUpdated.toISOString())}
            </span>
          )}
          <button
            onClick={refresh}
            className="flex items-center gap-1 hover:text-red-600 dark:hover:text-red-500 transition-colors"
          >
            <RefreshCw className="h-3 w-3" /> Refresh
          </button>
        </div>
      </div>

      {hasNewArticles && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-2.5 text-sm text-red-700 dark:text-red-400 animate-fade-in">
          <Flame className="h-4 w-4" /> New articles just arrived! Auto-refreshed.
        </div>
      )}

      {/* Featured headline */}
      {featured && (
        <section className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Link
              to={`/article/${featured.id}`}
              state={{ article: featured }}
              className="lg:col-span-2 group relative overflow-hidden rounded-3xl shadow-lg"
            >
              <div className="aspect-[16/9] lg:aspect-[21/9] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                <img
                  src={featured.imageUrl || fallbackImage(featured.category, 1200, 600)}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage(featured.category, 1200, 600);
                  }}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <span className="inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white mb-3">
                  {featured.category}
                </span>
                <h1 className="text-2xl lg:text-4xl font-bold text-white leading-tight mb-2 line-clamp-3">
                  {featured.title}
                </h1>
                <p className="text-sm lg:text-base text-white/80 line-clamp-2 max-w-2xl">{featured.description}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-white/70">
                  <span className="font-medium">{featured.source}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {formatRelativeTime(featured.publishedAt)}
                  </span>
                </div>
              </div>
            </Link>

            {/* Secondary featured */}
            <div className="flex flex-col gap-5">
              {secondaryFeatured.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  state={{ article }}
                  className="group flex-1 flex flex-col sm:flex-row lg:flex-col overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative sm:w-1/3 lg:w-full aspect-[16/9] lg:aspect-[16/9] overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                    <img
                      src={article.imageUrl || fallbackImage(article.category)}
                      alt=""
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage(article.category);
                      }}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-500 mb-1">{article.category}</span>
                    <h2 className="font-semibold text-base text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                      {article.title}
                    </h2>
                    <div className="mt-auto pt-2 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>{article.source}</span>
                      <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {formatRelativeTime(article.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest News grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-red-600" /> Latest News
          </h2>
          <Link to="/latest" className="flex items-center gap-1 text-sm font-medium text-red-600 dark:text-red-500 hover:gap-2 transition-all">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {latestGrid.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
        {3 + visibleCount < articles.length && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setVisibleCount((c) => c + 6)}
              className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-6 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-500 transition-colors"
            >
              Load More Articles
            </button>
          </div>
        )}
      </section>

      {/* Trending */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-600" /> Trending Now
          </h2>
          <Link to="/trending" className="flex items-center gap-1 text-sm font-medium text-red-600 dark:text-red-500 hover:gap-2 transition-all">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {trendingLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            ))
          ) : (
            trending.slice(0, 6).map((article, i) => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                state={{ article }}
                className="group flex items-center gap-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 hover:shadow-md transition-shadow"
              >
                <span className="text-2xl font-bold text-red-600/30 dark:text-red-500/30 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors w-8 text-center">
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                    {article.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <span>{article.source}</span>
                    <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {formatRelativeTime(article.publishedAt)}</span>
                  </div>
                </div>
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-700">
                  <img
                    src={article.imageUrl || fallbackImage(article.category, 200, 200)}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage(article.category, 200, 200);
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Category sections */}
      {Object.entries(categorySections).slice(0, 4).map(([category, catArticles]) => (
        <section key={category} className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-red-600" /> {category}
            </h2>
            <Link to={`/category/${categoryToSlug(category)}`} className="flex items-center gap-1 text-sm font-medium text-red-600 dark:text-red-500 hover:gap-2 transition-all">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {catArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      ))}

      {/* Most Read */}
      {mostRead.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-5">
            <Flame className="h-5 w-5 text-red-600" /> Most Read
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1">
            {mostRead.map((article, i) => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                state={{ article }}
                className="group flex items-start gap-3 py-3 border-b border-neutral-100 dark:border-neutral-800"
              >
                <span className="text-2xl font-bold text-red-600/30 dark:text-red-500/30 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors w-8 text-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                    {article.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <span>{article.source}</span>
                    <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {formatRelativeTime(article.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
