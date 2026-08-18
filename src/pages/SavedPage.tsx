import { Link } from "react-router-dom";
import { Bookmark, BookmarkX, LogIn, Trash2, ExternalLink } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatRelativeTime } from "@/utils/format";
import { fallbackImage } from "@/utils/images";

export function SavedPage() {
  const { user, loading: authLoading } = useAuth();
  const { bookmarks, loading, removeBookmark } = useBookmarks();
  const { showToast } = useToast();

  if (authLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <div className="h-8 w-8 mx-auto rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 mb-4">
          <LogIn className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Sign in to view saved news</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Bookmark articles to read them later. Your saved articles are tied to your account.
        </p>
        <Link to="/auth" className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors">
          <LogIn className="h-4 w-4" /> Sign In
        </Link>
      </div>
    );
  }

  const handleRemove = async (articleId: string) => {
    const { error } = await removeBookmark(articleId);
    if (error) {
      showToast(error, "error");
    } else {
      showToast("Removed from saved", "info");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3 mb-2">
        <Bookmark className="h-7 w-7 text-red-600" /> Saved News
      </h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
        {bookmarks.length} saved {bookmarks.length === 1 ? "article" : "articles"}
      </p>

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && bookmarks.length === 0 && (
        <div className="text-center py-16">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4">
            <BookmarkX className="h-8 w-8 text-neutral-400" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">No saved articles yet</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">Bookmark articles to save them for later reading.</p>
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors">
            Browse News
          </Link>
        </div>
      )}

      {!loading && bookmarks.length > 0 && (
        <div className="space-y-3">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="flex gap-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 hover:shadow-md transition-shadow"
            >
              <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-700">
                <img
                  src={b.image_url || fallbackImage(b.category || "news", 400, 250)}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage(b.category || "news", 400, 250);
                  }}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                {b.category && (
                  <span className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-500">{b.category}</span>
                )}
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 line-clamp-2">{b.title}</h3>
                {b.description && (
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">{b.description}</p>
                )}
                <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="font-medium">{b.source}</span>
                  {b.published_at && (
                    <span className="flex items-center gap-0.5">
                      {formatRelativeTime(b.published_at)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <a
                  href={b.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  aria-label="Open original article"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={() => handleRemove(b.article_id)}
                  className="rounded-lg p-2 text-neutral-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  aria-label="Remove bookmark"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
