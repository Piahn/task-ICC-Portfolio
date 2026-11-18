"use client";

import { newsletters } from "#site/content";
import SectionWrapper from "@/components/motion/section-wrapper";
import Paragraph from "@/components/shared/paragraph";
import NewsletterSubscribeCard from "@/components/newsletter/newsletter-subscribe-card";
import NewsletterCard from "@/components/shared/cards/newsletter-card";

export default function NewsletterPage() {
  const publishedNewsletters = [...newsletters]
    .filter((n) => n.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <SectionWrapper
      id="newsletter"
      className="flex flex-col items-center gap-y-12 px-4 md:gap-y-16 lg:gap-y-20"
    >
      <div className="w-full space-y-6">
        <Paragraph title="Newsletter">
          <p>
            Insights on interface engineering, design systems, and behind-the-scenes experiments. Written directly by Piahn Wijaya.
          </p>
        </Paragraph>

        {/* Hero Email Subscribe Card */}
        <NewsletterSubscribeCard variant="hero" />
      </div>

      {/* Editions List */}
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            All Editions ({publishedNewsletters.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {publishedNewsletters.map((newsletter) => (
            <NewsletterCard
              key={newsletter.slug}
              newsletter={newsletter}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
