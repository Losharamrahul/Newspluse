import { useParams } from "react-router-dom";
import { useCategoryNews } from "@/hooks/useCategoryNews";
import { NewsCard } from "@/components/NewsCard";
import { NewsGridSkeleton } from "@/components/Skeletons";
import { AlertCircle, RefreshCw } from "lucide-react";
import { slugToCategory } from "@/types/news";

export function CategoryPage() {
  const { category = "" } = useParams();
  const categoryName = slugToCategory(category);
  const { articles, loading, error, refresh } = useCategoryNews(category);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
          <span className="h-8 w-1.5 rounded-full bg-red-600" />
          {categoryName}
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Latest {categoryName} news from trusted sources
        </p>
      </div>

      {loading && <NewsGridSkeleton count={6} />}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-16">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Unable to load {categoryName} news</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">{error}</p>
          <button onClick={refresh} className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors">
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="text-center py-16">
          <p className="text-neutral-500 dark:text-neutral-400">No articles found in this category.</p>
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
