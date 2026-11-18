"use client";

import { useState } from "react";
import { PiMagnifyingGlassBold, PiXBold } from "react-icons/pi";
import { cn } from "@/lib/utils";

export type NewsletterFilterTab = "top" | "latest" | "discussions";

interface NewsletterFeedHeaderProps {
  activeTab: NewsletterFilterTab;
  onTabChange: (tab: NewsletterFilterTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

export const NewsletterFeedHeader = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  className,
}: NewsletterFeedHeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60",
        className,
      )}
    >
      {/* Substack Style Pill Tabs */}
      <div className="inline-flex items-center rounded-lg border border-border/80 bg-muted/30 p-1 w-fit">
        <button
          type="button"
          onClick={() => onTabChange("top")}
          className={cn(
            "rounded-md px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer",
            activeTab === "top"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Top
        </button>
        <button
          type="button"
          onClick={() => onTabChange("latest")}
          className={cn(
            "rounded-md px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer",
            activeTab === "latest"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Latest
        </button>
        <button
          type="button"
          onClick={() => onTabChange("discussions")}
          className={cn(
            "rounded-md px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer",
            activeTab === "discussions"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Discussions
        </button>
      </div>

      {/* Search Input / Icon */}
      <div className="flex items-center gap-2">
        {isSearchOpen ? (
          <div className="relative flex items-center w-full sm:w-48 animate-in fade-in zoom-in-95 duration-150">
            <input
              type="text"
              autoFocus
              placeholder="Search editions..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
            />
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                onSearchChange("");
              }}
              className="absolute right-2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <PiXBold className="size-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            title="Search newsletter"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors cursor-pointer"
          >
            <PiMagnifyingGlassBold className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NewsletterFeedHeader;
