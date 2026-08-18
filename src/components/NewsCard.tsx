import { Link } from "react-router-dom";
import { Bookmark, BookmarkCheck, Share2, Clock } from "lucide-react";
import type { NewsArticle } from "@/types/news";
import { formatRelativeTime, categoryToSlug, truncate } from "@/utils/format";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useToast } from "@/context/ToastContext";
import { fallbackImage } from "@/utils/images";

interface NewsCardProps {
  article: NewsArticle;
  variant?: "default" | "compact" | "horizontal";
}

export function NewsCard({ article, variant = "default" }: NewsCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { showToast } = useToast();
  const saved = isBookmarked(article.id);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { error } = await toggleBookmark(article);
    if (error) {
      showToast(error, "error");
    } else {
      showToast(saved ? "Removed from saved" : "Saved to bookmarks", saved ? "info" : "success");
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, url: article.link });
      } else {
        await navigator.clipboard.writeText(article.link);
        showToast("Link copied to clipboard", "success");
      }
    } catch {
      // user cancelled
    }
  };

  if (variant === "horizontal") {
    return (
      <Link
        to={`/article/${article.id}`}
        state={{ article }}
        className="group flex gap-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 hover:shadow-md transition-shadow"
      >
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-700">
          <img
            src={article.imageUrl || fallbackImage(article.category)}
            alt=""
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = fallbackImage(article.category);
            }}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-500 mb-1">
            {article.category}
          </span>
          <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
            {article.title}
          </h3>
          <div className="mt-auto flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span>{article.source}</span>
            <span className="flex items-center gap-0.5">
              <Clock className="h-3 w-3" /> {formatRelativeTime(article.publishedAt)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        to={`/article/${article.id}`}
        state={{ article }}
        className="group flex items-start gap-3 py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0"
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
            {article.title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span>{article.source}</span>
            <span className="flex items-center gap-0.5">
              <Clock className="h-3 w-3" /> {formatRelativeTime(article.publishedAt)}
            </span>
          </div>
        </div>
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-700">
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
    );
  }

  return (
    <Link
      to={`/article/${article.id}`}
      state={{ article }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-700">
        <img
          src={article.imageUrl || fallbackImage(article.category)}
          alt=""
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = fallbackImage(article.category);
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-red-600/90 backdrop-blur px-2.5 py-1 text-xs font-semibold text-white">
          {article.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
          {article.title}
        </h3>
        {article.description && (
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
            {truncate(article.description, 120)}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">{article.source}</span>
            <span className="flex items-center gap-0.5">
              <Clock className="h-3 w-3" /> {formatRelativeTime(article.publishedAt)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="rounded-lg p-1.5 text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              aria-label="Share article"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleBookmark}
              className={`rounded-lg p-1.5 transition-colors ${
                saved
                  ? "text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                  : "text-neutral-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              }`}
              aria-label={saved ? "Remove bookmark" : "Bookmark article"}
            >
              {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
