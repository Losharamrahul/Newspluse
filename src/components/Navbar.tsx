import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Bookmark, Menu, X, Sun, Moon, Newspaper, ChevronDown, User, LogOut } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES } from "@/types/news";
import { categoryToSlug } from "@/utils/format";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setCategoriesOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/latest", label: "Latest" },
    { to: "/trending", label: "Trending" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-md"
          : "bg-white dark:bg-neutral-900"
      } border-b border-neutral-200 dark:border-neutral-800`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600">
              <Newspaper className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              News<span className="text-red-600">Pulse</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-950/30"
                    : "text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* Categories dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen((v) => !v)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Categories <ChevronDown className={`h-4 w-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
              </button>
              {categoriesOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setCategoriesOpen(false)} />
                  <div className="absolute left-0 top-full mt-1 z-20 w-56 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 py-2 shadow-xl">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat}
                        to={`/category/${categoryToSlug(cat)}`}
                        className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-lg p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              to="/saved"
              className="rounded-lg p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Saved news"
            >
              <Bookmark className="h-5 w-5" />
            </Link>

            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-lg p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white text-xs font-semibold">
                    {user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 z-20 w-56 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 py-2 shadow-xl">
                      <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-700">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Signed in as</p>
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100 truncate">{user.email}</p>
                      </div>
                      <Link to="/saved" className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                        <Bookmark className="h-4 w-4" /> Saved News
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden sm:flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                <User className="h-4 w-4" /> Sign In
              </Link>
            )}

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden rounded-lg p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search headlines, topics, sources..."
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 pl-10 pr-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-colors"
              />
            </div>
          </form>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <nav className="mx-auto max-w-7xl px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === link.to
                    ? "text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-950/30"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">Categories</p>
              <div className="grid grid-cols-2 gap-1">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    to={`/category/${categoryToSlug(cat)}`}
                    className="block px-3 py-2 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
            {user ? (
              <button
                onClick={() => signOut()}
                className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <User className="h-4 w-4" /> Sign In / Register
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
