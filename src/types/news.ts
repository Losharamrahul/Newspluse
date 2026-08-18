export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  imageUrl: string | null;
  source: string;
  category: string;
  publishedAt: string;
  isBreaking: boolean;
}

export interface BreakingHeadline {
  id: string;
  title: string;
  link: string;
  source: string;
  publishedAt: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
  isDemo: boolean;
  fetchedAt?: string;
  error?: string;
}

export interface BreakingResponse {
  headlines: BreakingHeadline[];
  isDemo: boolean;
}

export interface Bookmark {
  id: string;
  article_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  article_url: string;
  source: string;
  category: string | null;
  published_at: string | null;
  created_at: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  favorite_categories: string[];
}

export const CATEGORIES = [
  "World",
  "India",
  "Telangana",
  "Andhra Pradesh",
  "Technology",
  "Business",
  "Sports",
  "Entertainment",
  "Science",
  "Health",
  "Politics",
] as const;

export const CATEGORY_SLUGS: Record<string, string> = {
  world: "World",
  nation: "India",
  telangana: "Telangana",
  andhra: "Andhra Pradesh",
  technology: "Technology",
  business: "Business",
  sports: "Sports",
  entertainment: "Entertainment",
  science: "Science",
  health: "Health",
  politics: "Politics",
};

export function slugToCategory(slug: string): string {
  return CATEGORY_SLUGS[slug.toLowerCase()] || slug;
}
