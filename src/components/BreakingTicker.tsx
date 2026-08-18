import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { useBreakingNews } from "@/hooks/useBreakingNews";

export function BreakingTicker() {
  const { headlines, loading } = useBreakingNews();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (headlines.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [headlines.length]);

  if (loading || headlines.length === 0) {
    return (
      <div className="bg-red-600 text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center h-10">
          <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-red-400/50">
            <Zap className="h-4 w-4 fill-white" />
            <span className="text-sm font-bold tracking-wide">BREAKING</span>
          </div>
          <div className="flex-1 overflow-hidden px-4">
            <div className="h-4 w-48 rounded bg-red-400/50 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const current = headlines[currentIndex];

  return (
    <div className="bg-red-600 text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center h-10">
        <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-red-400/50">
          <span className="relative flex">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          <span className="text-sm font-bold tracking-wide">BREAKING</span>
        </div>
        <div className="flex-1 overflow-hidden px-4">
          <Link
            to={`/article/${current.id}`}
            state={{ article: { ...current, description: "", imageUrl: null, isBreaking: true } }}
            className="block text-sm font-medium hover:underline animate-fade-in"
            key={current.id}
          >
            {current.title}
            <span className="ml-2 text-red-200 text-xs">— {current.source}</span>
          </Link>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 pl-4 border-l border-red-400/50">
          {headlines.slice(0, 5).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex % 5 ? "w-4 bg-white" : "w-1.5 bg-red-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
