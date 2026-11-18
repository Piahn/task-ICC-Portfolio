"use client";

import { useMemo, useState } from "react";
import {
  PiCodeBold,
  PiMagnifyingGlassDuotone,
  PiXBold,
} from "react-icons/pi";

import SectionWrapper from "@/components/motion/section-wrapper";
import SnippetCard from "@/components/snippet/snippet-card";
import { Input } from "@/components/ui/input";
import {
  SNIPPET_CATEGORIES,
  type SnippetCategory,
  snippetItems,
} from "@/lib/snippets-data";
import { cn } from "@/lib/utils";

export default function SnippetsPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<SnippetCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSnippets = useMemo(() => {
    return snippetItems.filter((item) => {
      // Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
        const matchCode = item.code.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchTags || matchCode;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: snippetItems.length };
    for (const cat of SNIPPET_CATEGORIES) {
      if (cat !== "All") {
        counts[cat] = snippetItems.filter((s) => s.category === cat).length;
      }
    }
    return counts;
  }, []);

  return (
    <SectionWrapper
      id="snippets"
      className="flex flex-col items-center gap-y-10 px-4 md:gap-y-12 lg:gap-y-16"
    >
      {/* Header */}
      <div className="flex w-full max-w-2xl flex-col items-center text-center gap-y-3">
        <span className="font-caveat text-primary text-xl font-medium tracking-wide">
          // code library
        </span>
        <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
          Code Snippets
        </h1>
        <p className="text-muted-foreground max-w-lg text-sm leading-relaxed sm:text-base">
          A curated collection of practical, copy-pasteable code snippets, custom
          React hooks, and utilities I frequently use in my daily fullstack
          engineering work.
        </p>
      </div>

      {/* Controls: Search & Category Tabs */}
      <div className="flex w-full max-w-3xl flex-col gap-4">
        {/* Search input */}
        <div className="relative w-full">
          <PiMagnifyingGlassDuotone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search snippets by name, tag, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card/70 border-border/80 text-foreground placeholder:text-muted-foreground/70 h-10 w-full rounded-xl pl-10 pr-9 text-sm transition-colors focus-visible:ring-1"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 p-0.5 cursor-pointer"
              aria-label="Clear search"
            >
              <PiXBold className="size-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="no-scrollbar flex w-full items-center gap-1.5 overflow-x-auto pb-1">
          {SNIPPET_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "anim inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/60",
                )}
              >
                <span>{cat}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px] font-semibold",
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-background text-muted-foreground",
                  )}
                >
                  {categoryCounts[cat] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Snippet Grid / List */}
      <div className="flex w-full max-w-3xl flex-col gap-6">
        {filteredSnippets.length > 0 ? (
          filteredSnippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))
        ) : (
          <div className="border-border/60 bg-card/40 flex flex-col items-center justify-center rounded-2xl border p-12 text-center">
            <PiCodeBold className="text-muted-foreground/60 mb-3 size-10" />
            <h3 className="text-foreground text-base font-semibold">
              No snippets found
            </h3>
            <p className="text-muted-foreground mt-1 max-w-sm text-xs leading-relaxed sm:text-sm">
              We couldn&apos;t find any snippets matching &quot;{searchQuery}&quot;
              {selectedCategory !== "All" && ` in ${selectedCategory}`}.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="text-primary hover:underline mt-4 text-xs font-semibold cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
