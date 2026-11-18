"use client";

import { newsletters } from "#site/content";
import { useParams } from "react-router-dom";
import { PiArrowLeftBold, PiShareNetworkDuotone } from "react-icons/pi";
import { LuBadgeCheck } from "react-icons/lu";
import Link from "next/link";
import { toast } from "sonner";

import { MDXToC, Mdx } from "@/components/shared/mdx";
import TableOfContents from "@/components/shared/toc";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/functions";
import NotFoundPage from "@/pages/not-found";

import NewsletterActionBar from "@/components/newsletter/newsletter-action-bar";
import NewsletterSubscribeCard from "@/components/newsletter/newsletter-subscribe-card";
import NewsletterComments from "@/components/newsletter/newsletter-comments";
import NewsletterRowItem from "@/components/newsletter/newsletter-row-item";
import { VerticalTimeline } from "@/components/lab/examples/timeline/vertical-timeline";

// Preview card wrapper matching Substack Gambar 2
const TimelinePreview = () => (
  <div className="not-prose my-8 w-full overflow-hidden rounded-xl border border-border/80 bg-muted/20 dark:bg-card/40 p-6 sm:p-8 flex items-center justify-center shadow-xs">
    <div className="w-full max-w-xs">
      <VerticalTimeline />
    </div>
  </div>
);

export default function NewsletterDetailPage() {
  const params = useParams();
  const slug = params["*"] || params.slug || "";
  const newsletter = newsletters.find((n) => n.slugAsParams === slug);

  if (!newsletter || !newsletter.published) {
    return <NotFoundPage />;
  }

  const tableOfContents = MDXToC({ code: newsletter.body });

  return (
    <article
      id={newsletter.slug}
      className="relative flex h-auto w-full grow px-4"
    >
      {/* Table of Contents (Desktop sidebar - Gambar 3) */}
      <TableOfContents toc={tableOfContents} />

      <div className="mx-auto w-full max-w-lg space-y-8 md:max-w-md md:space-y-10 lg:max-w-lg lg:space-y-12">
        {/* Top Navigation (Clean Go Back without duplicate Share) */}
        <div className="flex w-full items-center justify-start">
          <Link
            href="/newsletter"
            aria-label="Go back to /newsletter"
            className="anim text-muted-foreground hover:text-foreground flex items-center gap-x-2 cursor-pointer"
          >
            <PiArrowLeftBold className="size-4" />
            <p className="text-sm font-medium">Go back</p>
          </Link>
        </div>

        {/* Header (Gambar 2 & 3 Combo) */}
        <div className="flex w-full flex-col">
          <div className="space-y-2 mb-6">
            <h1 className="text-2xl font-bold sm:text-3xl tracking-tight text-foreground">
              {newsletter.title}
            </h1>
          </div>

          {/* Author Badge (Gambar 2 Substack Style) */}
          <div className="flex items-center gap-3 py-2">
            <div className="relative">
              <Avatar className="size-10 rounded-full border border-border">
                <AvatarImage
                  src="https://avatars.githubusercontent.com/u/132025108?v=4"
                  alt="@Piahn"
                />
                <AvatarFallback className="text-muted-foreground text-xs font-semibold">
                  PW
                </AvatarFallback>
              </Avatar>
              <LuBadgeCheck
                size={18}
                className="text-background absolute -right-1 -bottom-1 fill-green-500"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-foreground text-xs font-semibold uppercase tracking-wide">
                Piahn Wijaya
              </span>
              <time
                dateTime={newsletter.date}
                className="text-muted-foreground text-[11px] font-medium"
              >
                {formatDate(newsletter.date, "long").toUpperCase()}
              </time>
            </div>
          </div>

          {/* Substack Action Bar (Gambar 2: Like, Comment, Share) */}
          <NewsletterActionBar
            slug={newsletter.slugAsParams}
            title={newsletter.title}
          />

          {/* Article MDX Body with Embedded Components */}
          <div className="prose-custom max-w-none">
            <Mdx
              code={newsletter.body}
              components={{
                TimelinePreview,
                VerticalTimeline: TimelinePreview,
              }}
            />
          </div>

          {/* Bottom Subscribe Call-to-Action */}
          <div className="mt-12">
            <NewsletterSubscribeCard variant="hero" />
          </div>

          {/* Discussion / Comments Section */}
          <NewsletterComments slug={newsletter.slugAsParams} />

          {/* More from Piahn Wijaya (Substack Feed at bottom of post) */}
          <div className="mt-16 pt-8 border-t border-border/60 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              More from Piahn Wijaya
            </h3>
            <div className="divide-y divide-border/50">
              {newsletters
                .filter(
                  (n) =>
                    n.published && n.slugAsParams !== newsletter.slugAsParams,
                )
                .slice(0, 3)
                .map((item) => (
                  <NewsletterRowItem key={item.slug} newsletter={item} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
