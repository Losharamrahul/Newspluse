import { useParams, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Clock, Bookmark, BookmarkCheck, Share2, ExternalLink, AlertCircle } from "lucide-react";
import type { NewsArticle } from "@/types/news";
import { formatFullDate, formatRelativeTime } from "@/utils/format";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useToast } from "@/context/ToastContext";
import { useLatestNews } from "@/hooks/useLatestNews";
import { NewsCard } from "@/components/NewsCard";
import { fallbackImage } from "@/utils/images";

export function ArticlePage() {
  const { id = "" } = useParams();
  const location = useLocation();
  const article = (location.state as { article?: NewsArticle } | null)?.article;
  const { articles } = useLatestNews();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { showToast } = useToast();

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Article not found</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          This article may have expired or was not found in the current feed.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to News
        </Link>
      </div>
    );
  }

  const saved = isBookmarked(article.id);
  const related = articles.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 3);

  const handleBookmark = async () => {
    const { error } = await toggleBookmark(article);
    if (error) {
      showToast(error, "error");
    } else {
      showToast(saved ? "Removed from saved" : "Saved to bookmarks", saved ? "info" : "success");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, url: article.link });
      } else {
        await navigator.clipboard.writeText(article.link);
        showToast("Link copied to clipboard", "success");
      }
    } catch {
      // cancelled
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-500 transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to News
      </Link>

      <article>
        <span className="inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white mb-4">
          {article.category}
        </span>
        <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white leading-tight mb-4">
          {article.title}
        </h1>
        {article.description && (
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
            {article.description}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-neutral-200 dark:border-neutral-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white font-semibold">
              {article.source[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">{article.source}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {formatFullDate(article.publishedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Share2 className="h-4 w-4" /> Share
            </button>
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                saved
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-500"
              }`}
            >
              {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl mb-6">
          <img
            src={article.imageUrl || fallbackImage(article.category, 1200, 600)}
            alt=""
            onError={(e) => {
              e.currentTarget.src = fallbackImage(article.category, 1200, 600);
            }}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {article.description || "Full article content is available at the original source. Click the button below to read the complete story."}
          </p>
          <p className="mt-4 text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
            This article was originally published by <strong>{article.source}</strong> on {formatFullDate(article.publishedAt)}. NewsPulse aggregates headlines and summaries from trusted sources and links to the original publication for the full story.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-5">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
            This is a summary from <strong>{article.source}</strong>. Read the full article on the original source:
          </p>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" /> Read Full Article on {article.source}
          </a>
        </div>

        {/* Share buttons */}
        <div className="mt-6 flex items-center gap-3">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Share:</span>
          {["Twitter", "Facebook", "WhatsApp", "Copy Link"].map((platform) => (
            <button
              key={platform}
              onClick={handleShare}
              className="rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-500 transition-colors"
            >
              {platform}
            </button>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-red-600" /> Related News
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
