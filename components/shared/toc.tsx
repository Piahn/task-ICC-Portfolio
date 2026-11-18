"use client";

import { AnimatePresence, motion } from "motion/react";
import { useIsClient, useMediaQuery } from "usehooks-ts";

import { useEffect, useState } from "react";

import { useSmoothScroll } from "@/components/provider/smooth-scroll-provider";
import { slugify } from "@/lib/functions";
import { cn } from "@/lib/utils";

export type TocItem = {
  depth: number;
  value: string;
  id?: string;
  children?: TocItem[];
};

type TableOfContentsProps = {
  toc: TocItem[];
  className?: string;
  scrollPosition?: "center" | "top";
};

const TableOfContents = ({
  toc,
  className,
  scrollPosition = "center",
}: TableOfContentsProps) => {
  const matches = useMediaQuery("(max-width: 768px)");
  const isClient = useIsClient();
  const { scrollTo } = useSmoothScroll();

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const headings = Array.from(
        document.querySelectorAll<HTMLElement>(
          "h2[id], h3[id], h4[id], h5[id], h6[id]",
        ),
      );
      if (!headings.length) return;

      // Check if user scrolled near the bottom of the page
      const isBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 60;
      if (isBottom) {
        setActiveId(headings[headings.length - 1].id);
        return;
      }

      // Reading threshold: upper 30% of viewport or 120px
      const threshold = Math.max(120, window.innerHeight * 0.3);
      let currentId: string | null = null;

      for (const heading of headings) {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= threshold) {
          currentId = heading.id;
        } else {
          break;
        }
      }

      // If above first heading but first heading is already visible in viewport
      if (!currentId && headings.length > 0) {
        const firstRect = headings[0].getBoundingClientRect();
        if (firstRect.top <= window.innerHeight * 0.5) {
          currentId = headings[0].id;
        }
      }

      setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    const timer = setTimeout(handleScroll, 200);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      const rect = element.getBoundingClientRect();
      const y =
        rect.top +
        window.scrollY -
        (scrollPosition === "center" ? window.innerHeight / 3 : 106);

      scrollTo(y, { duration: 0.8 });
    }
  };

  const renderTocItems = (items: TocItem[]) =>
    items.map((item) => {
      const id = item.id || slugify(item.value);
      const isActive = activeId === id;

      return (
        <li key={id}>
          <button
            type="button"
            onClick={() => scrollToHeading(id)}
            className={cn(
              "hover:text-foreground w-fit cursor-pointer text-left text-xs font-medium transition-colors duration-200 lg:text-sm lg:text-nowrap focus:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 rounded-xs select-none",
              {
                "text-foreground font-semibold": isActive,
                "text-muted-foreground": !isActive,
                "pl-3": item.depth === 3,
                "pl-6": item.depth === 4,
                "pl-9": item.depth === 5,
                "pl-12": item.depth === 6,
              },
            )}
          >
            {item.value}
          </button>
          {item.children && item.children.length > 0 && (
            <ul className="mt-2 w-fit space-y-2">
              {renderTocItems(item.children)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <AnimatePresence>
      {isClient && !matches && toc.length > 0 && (
        <motion.div
          key="toc"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn("sticky top-16 left-16 h-fit w-36", className)}
        >
          <div>
            <h3 className="mb-3 text-sm font-semibold tracking-wide lg:text-base lg:text-nowrap">
              On this page
            </h3>
            <nav>
              <ul className="space-y-2">{renderTocItems(toc)}</ul>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TableOfContents;
