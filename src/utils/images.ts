const CATEGORY_KEYWORDS: Record<string, string> = {
  World: "world,news",
  India: "india,newspaper",
  Telangana: "telangana,hyderabad",
  "Andhra Pradesh": "andhra,india",
  Technology: "technology,computer",
  Business: "business,finance",
  Sports: "sports,stadium",
  Entertainment: "entertainment,concert",
  Science: "science,laboratory",
  Health: "health,medical",
  Politics: "politics,government",
};

export function fallbackImage(category: string, width = 800, height = 450): string {
  const keyword = CATEGORY_KEYWORDS[category] || category.toLowerCase() || "news";
  return `https://loremflickr.com/${width}/${height}/${keyword}`;
}
