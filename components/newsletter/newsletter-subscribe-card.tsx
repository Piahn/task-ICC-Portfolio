"use client";

import { useState } from "react";
import { PiArrowClockwiseBold, PiEnvelopeSimpleBold, PiPaperPlaneRightBold } from "react-icons/pi";
import { toast } from "sonner";
import { useSubscribeNewsletter } from "@/query/newsletter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NewsletterSubscribeCardProps {
  className?: string;
  variant?: "hero" | "compact";
}

export const NewsletterSubscribeCard = ({
  className,
  variant = "hero",
}: NewsletterSubscribeCardProps) => {
  const [email, setEmail] = useState("");
  const subscribeMutation = useSubscribeNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      const res = await subscribeMutation.mutateAsync(email);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.data || "Thanks for subscribing!");
        setEmail("");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/80 bg-muted/20 p-5 sm:p-6",
        variant === "hero" ? "w-full" : "w-full max-w-md",
        className,
      )}
    >
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-foreground font-semibold text-sm sm:text-base">
          <PiEnvelopeSimpleBold className="size-4 text-primary" />
          <span>Subscribe to Piahn's Newsletter</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Get practical insights on product design, frontend architecture, and new lab components directly in your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          disabled={subscribeMutation.isPending}
          className="flex-1 rounded-md border border-input bg-background/70 px-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring/40 transition-colors"
        />
        <Button
          type="submit"
          size="sm"
          disabled={subscribeMutation.isPending || !email.trim()}
          className="gap-1.5 text-xs h-9 px-4 cursor-pointer"
        >
          {subscribeMutation.isPending ? (
            <PiArrowClockwiseBold className="size-3.5 animate-spin" />
          ) : (
            <>
              <span>Subscribe</span>
              <PiPaperPlaneRightBold className="size-3.5" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSubscribeCard;
