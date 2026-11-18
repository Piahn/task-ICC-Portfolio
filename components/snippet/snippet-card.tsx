"use client";

import { useState } from "react";
import {
  PiCaretDownBold,
  PiCaretUpBold,
  PiCheckBold,
  PiCopyBold,
  PiTagDuotone,
} from "react-icons/pi";
import { toast } from "sonner";

import Code from "@/components/shared/code";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SnippetItem } from "@/lib/snippets-data";
import { copyToClipboard } from "@/lib/functions";
import { cn } from "@/lib/utils";

type SnippetCardProps = {
  snippet: SnippetItem;
};

export default function SnippetCard({ snippet }: SnippetCardProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const lines = snippet.code.trim().split("\n");
  const isLong = lines.length > 12;

  const handleCopy = async () => {
    const ok = await copyToClipboard(snippet.code);
    if (ok) {
      setCopied(true);
      toast("Snippet copied to clipboard!", {
        duration: 2000,
        icon: <PiCheckBold className="text-emerald-500 size-4" />,
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group border-border/80 bg-card/60 hover:border-border hover:bg-card/90 flex w-full flex-col overflow-hidden rounded-2xl border transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-foreground text-base font-semibold tracking-tight sm:text-lg">
                {snippet.title}
              </h3>
              {snippet.featured && (
                <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Featured
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
              {snippet.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="text-[11px] font-medium capitalize">
              {snippet.category}
            </Badge>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCopy}
              className="h-8 gap-1.5 px-2.5 text-xs font-medium cursor-pointer"
              aria-label="Copy snippet"
            >
              {copied ? (
                <>
                  <PiCheckBold className="text-emerald-500 size-3.5" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <PiCopyBold className="size-3.5" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Tags */}
        {snippet.tags && snippet.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <PiTagDuotone className="text-muted-foreground/70 size-3" />
            {snippet.tags.map((tag) => (
              <span
                key={tag}
                className="bg-secondary/50 text-muted-foreground rounded-md px-1.5 py-0.5 text-[10px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Code Viewer */}
      <div className="border-border/60 relative border-t">
        <div
          className={cn(
            "relative w-full overflow-hidden transition-all duration-300",
            !isExpanded && isLong ? "max-h-72" : "max-h-none",
          )}
        >
          <Code
            code={snippet.code}
            lang={snippet.language}
            lineNumber
            className="rounded-none! border-0!"
          />

          {!isExpanded && isLong && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-card via-card/80 to-transparent" />
          )}
        </div>

        {isLong && (
          <div className="bg-card/90 border-border/40 flex w-full justify-center border-t py-1.5">
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer"
            >
              {isExpanded ? (
                <>
                  <PiCaretUpBold className="size-3" />
                  Show less
                </>
              ) : (
                <>
                  <PiCaretDownBold className="size-3" />
                  Show all ({lines.length} lines)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
