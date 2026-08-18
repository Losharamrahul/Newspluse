import { Radio } from "lucide-react";

export function LiveIndicator({ size = "sm" }: { size?: "sm" | "md" }) {
  const dotSize = size === "md" ? "h-2.5 w-2.5" : "h-2 w-2";
  const textSize = size === "md" ? "text-sm" : "text-xs";
  return (
    <span className="inline-flex items-center gap-1.5 font-semibold text-red-600 dark:text-red-500">
      <span className="relative flex">
        <span className={`absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping ${dotSize}`} />
        <span className={`relative inline-flex rounded-full bg-red-600 ${dotSize}`} />
      </span>
      <span className={textSize}>LIVE</span>
      <Radio className={size === "md" ? "h-4 w-4" : "h-3 w-3"} />
    </span>
  );
}
