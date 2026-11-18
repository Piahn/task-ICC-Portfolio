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
import { VerticalTimeline } from "@/components/lab/examples/timeline/vertical-timeline";

export default function NewsletterDetailPage() {
  const params = useParams();
  const slug = params["*"] || params.slug || "";
  const newsletter = newsletters.find((n) => n.slugAsParams === slug);

  if (!newsletter || !newsletter.published) {
    return <NotFoundPage />;
  }

  const tableOfContents = MDXToC({ code: newsletter.body });

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsletter.title,
          url,
        });
        return;
      } catch {
        // Fallback
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <article
      id={newsletter.slug}
      className="relative flex h-auto w-full grow px-4"
    >
      {/* Table of Contents (Desktop sidebar - Gambar 3) */}
      <TableOfContents toc={tableOfContents} />

      <div className="mx-auto w-full max-w-lg space-y-8 md:max-w-md md:space-y-10 lg:max-w-lg lg:space-y-12">
        {/* Top Navigation */}
        <div className="flex w-full items-center justify-between">
          <Link
            href="/newsletter"
            aria-label="Go back to /newsletter"
            className="anim text-muted-foreground hover:text-foreground flex items-center gap-x-2 cursor-pointer"
          >
            <PiArrowLeftBold className="size-4" />
            <p className="text-sm font-medium">Go back</p>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="text-muted-foreground h-9 w-9 cursor-pointer"
            aria-label="Share newsletter"
          >
            <PiShareNetworkDuotone className="size-4" />
          </Button>
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
                  src="https://github.com/pwijaya.png"
                  alt="@pwijaya"
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
                VerticalTimeline,
              }}
            />
          </div>

          {/* Bottom Subscribe Call-to-Action */}
          <div className="mt-12">
            <NewsletterSubscribeCard variant="hero" />
          </div>

          {/* Discussion / Comments Section */}
          <NewsletterComments slug={newsletter.slugAsParams} />
        </div>
      </div>
    </article>
  );
}
