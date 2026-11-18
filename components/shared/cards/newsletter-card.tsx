"use client";

import Link from "next/link";
import { PiChatCircleDotsBold, PiHeartBold } from "react-icons/pi";
import { formatDate } from "@/lib/functions";
import { cn } from "@/lib/utils";
import { useNewsletterComments, useNewsletterLikes } from "@/query/newsletter";
import type { Newsletter } from "#site/content";

interface NewsletterCardProps {
  newsletter: Newsletter;
  className?: string;
}

export const NewsletterCard = ({
  newsletter,
  className,
}: NewsletterCardProps) => {
  const { data: likesData } = useNewsletterLikes(newsletter.slugAsParams);
  const { data: commentsData } = useNewsletterComments(newsletter.slugAsParams);

  const likesCount = likesData?.count ?? 0;
  const totalComments = (commentsData ?? []).reduce(
    (acc, curr) => acc + 1 + (curr.replies?.length ?? 0),
    0,
  );

  return (
    <Link
      href={`/newsletter/${newsletter.slugAsParams}`}
      className={cn(
        "group/card block rounded-xl border border-border/70 bg-card/40 p-5 transition-all duration-200 hover:border-foreground/30 hover:bg-card/70 hover:shadow-xs",
        className,
      )}
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <time dateTime={newsletter.date}>
            {formatDate(newsletter.date, "mid")}
          </time>
          {newsletter.tags && newsletter.tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              {newsletter.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-muted/80 px-2 py-0.5 text-[10px] font-medium text-foreground/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <h3 className="text-base font-bold text-foreground group-hover/card:text-primary transition-colors">
          {newsletter.title}
        </h3>

        <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
          {newsletter.description}
        </p>

        <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground/80">
          <div className="flex items-center gap-1">
            <PiHeartBold className="size-3.5" />
            <span>{likesCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <PiChatCircleDotsBold className="size-3.5" />
            <span>{totalComments}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsletterCard;
