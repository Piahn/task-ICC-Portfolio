"use client";

import { useMemo, useState } from "react";
import { newsletters } from "#site/content";
import SectionWrapper from "@/components/motion/section-wrapper";
import Paragraph from "@/components/shared/paragraph";
import NewsletterSubscribeCard from "@/components/newsletter/newsletter-subscribe-card";
import NewsletterRowItem from "@/components/newsletter/newsletter-row-item";
import NewsletterFeedHeader, {
  type NewsletterFilterTab,
} from "@/components/newsletter/newsletter-feed-header";

export default function NewsletterPage() {
  const [activeTab, setActiveTab] = useState<NewsletterFilterTab>("latest");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNewsletters = useMemo(() => {
    let items = [...newsletters].filter((n) => n.published);

    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // Apply Tab sorting
    if (activeTab === "top") {
      // Sort featured/top editions first
      items.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    } else if (activeTab === "discussions") {
      // Show editions with discussion focus first (e.g. Guestbook update)
      items.sort((a, b) => {
        const aScore = a.title.toLowerCase().includes("guestbook") ? 1 : 0;
        const bScore = b.title.toLowerCase().includes("guestbook") ? 1 : 0;
        return bScore - aScore;
      });
    } else {
      // Latest: chronological descending
      items.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }

    return items;
  }, [activeTab, searchQuery]);

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

      {/* Substack Archive Feed Section */}
      <div className="w-full space-y-2">
        {/* Substack Tab Filter Bar & Search */}
        <NewsletterFeedHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Editions Row List */}
        <div className="divide-y divide-border/50">
          {filteredNewsletters.length > 0 ? (
            filteredNewsletters.map((newsletter) => (
              <NewsletterRowItem
                key={newsletter.slug}
                newsletter={newsletter}
              />
            ))
          ) : (
            <div className="py-12 text-center text-xs text-muted-foreground italic">
              No editions found matching "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
