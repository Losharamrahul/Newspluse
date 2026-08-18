import { Link } from "react-router-dom";
import { Newspaper, Twitter, Facebook, Instagram, Youtube, Github } from "lucide-react";
import { CATEGORIES } from "@/types/news";
import { categoryToSlug } from "@/utils/format";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600">
                <Newspaper className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                News<span className="text-red-600">Pulse</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Your trusted source for real-time news from around the world. Stay informed, stay ahead.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[Twitter, Facebook, Instagram, Youtube, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-500 hover:border-red-300 dark:hover:border-red-700 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/category/${categoryToSlug(cat)}`}
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More categories */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">More</h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(6).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/category/${categoryToSlug(cat)}`}
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-500 transition-colors">Home</Link></li>
              <li><Link to="/latest" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-500 transition-colors">Latest News</Link></li>
              <li><Link to="/trending" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-500 transition-colors">Trending</Link></li>
              <li><Link to="/saved" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-500 transition-colors">Saved News</Link></li>
              <li><Link to="/auth" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-500 transition-colors">Sign In</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            &copy; {new Date().getFullYear()} NewsPulse. All rights reserved. News content sourced from Google News.
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Built with React, Vite, Tailwind CSS &amp; Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
