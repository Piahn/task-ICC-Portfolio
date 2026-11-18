"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/functions";
import { cn } from "@/lib/utils";
import type { Newsletter } from "#site/content";

interface NewsletterRowItemProps {
  newsletter: Newsletter;
  className?: string;
}

export const NewsletterRowItem = ({
  newsletter,
  className,
}: NewsletterRowItemProps) => {
  return (
    <article
      className={cn(
        "group/item py-6 border-b border-border/50 last:border-b-0 transition-colors",
        className,
      )}
    >
      <Link
        href={`/newsletter/${newsletter.slugAsParams}`}
        className="flex items-start justify-between gap-4 sm:gap-6"
      >
        <div className="flex-1 space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-foreground group-hover/item:text-primary transition-colors leading-snug">
            {newsletter.title}
          </h3>

          <p className="line-clamp-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {newsletter.description}
          </p>

          <div className="pt-1 flex items-center gap-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            <time dateTime={newsletter.date}>
              {formatDate(newsletter.date, "mid").toUpperCase()}
            </time>
            <span>•</span>
            <span className="text-foreground/80">PIAHN WIJAYA</span>
          </div>
        </div>

        {newsletter.image && (
          <div className="relative w-24 sm:w-36 aspect-16/10 rounded-md overflow-hidden border border-border/60 bg-muted/30 shrink-0">
            <Image
              src={newsletter.image}
              alt={newsletter.title}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 96px, 144px"
              className="object-cover transition-transform duration-300 group-hover/item:scale-105"
            />
          </div>
        )}
      </Link>
    </article>
  );
};

export default NewsletterRowItem;
