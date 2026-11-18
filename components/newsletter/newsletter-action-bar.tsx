"use client";

import {
  PiChatCircleDotsBold,
  PiHeartBold,
  PiHeartFill,
  PiShareNetworkBold,
} from "react-icons/pi";
import { toast } from "sonner";
import { useNewsletterComments, useNewsletterLikes, useToggleNewsletterLike } from "@/query/newsletter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface NewsletterActionBarProps {
  slug: string;
  title: string;
  className?: string;
}

export const NewsletterActionBar = ({
  slug,
  title,
  className,
}: NewsletterActionBarProps) => {
  const { data: likesData, isLoading: likesLoading } = useNewsletterLikes(slug);
  const { data: commentsData, isLoading: commentsLoading } = useNewsletterComments(slug);
  const toggleLike = useToggleNewsletterLike(slug);

  const likesCount = likesData?.count ?? 0;
  const hasLiked = likesData?.hasLiked ?? false;

  // Count total comments including replies
  const totalComments = (commentsData ?? []).reduce(
    (acc, curr) => acc + 1 + (curr.replies?.length ?? 0),
    0,
  );

  const handleToggleLike = async () => {
    try {
      await toggleLike.mutateAsync();
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleScrollToComments = () => {
    const el = document.getElementById("comments");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
        return;
      } catch (err) {
        // User cancelled or fallback to copy
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
    <div
      className={cn(
        "flex items-center justify-between border-y border-border/60 py-2.5 my-6 text-muted-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Like Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleLike}
          disabled={likesLoading || toggleLike.isPending}
          className={cn(
            "h-8 gap-1.5 px-2.5 text-xs font-medium rounded-full transition-all cursor-pointer",
            hasLiked
              ? "text-rose-500 hover:text-rose-600 bg-rose-500/10"
              : "hover:text-foreground hover:bg-muted/60",
          )}
          aria-label="Like post"
        >
          {hasLiked ? (
            <PiHeartFill className="size-4 text-rose-500 animate-in zoom-in-75 duration-200" />
          ) : (
            <PiHeartBold className="size-4" />
          )}
          {likesLoading ? (
            <Skeleton className="h-3 w-3.5 rounded" />
          ) : (
            <span>{likesCount}</span>
          )}
        </Button>

        {/* Comment Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleScrollToComments}
          className="h-8 gap-1.5 px-2.5 text-xs font-medium rounded-full hover:text-foreground hover:bg-muted/60 cursor-pointer"
          aria-label="View comments"
        >
          <PiChatCircleDotsBold className="size-4" />
          {commentsLoading ? (
            <Skeleton className="h-3 w-3.5 rounded" />
          ) : (
            <span>{totalComments}</span>
          )}
        </Button>
      </div>

      {/* Share Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="h-8 gap-1.5 px-3 text-xs font-medium rounded-full hover:text-foreground hover:bg-muted/60 cursor-pointer"
        aria-label="Share article"
      >
        <PiShareNetworkBold className="size-4" />
        <span>Share</span>
      </Button>
    </div>
  );
};

export default NewsletterActionBar;
