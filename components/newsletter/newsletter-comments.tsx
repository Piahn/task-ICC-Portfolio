"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { PiArrowClockwiseBold, PiChatCircleDotsBold } from "react-icons/pi";
import { toast } from "sonner";
import { createClient } from "@/supabase/client";
import { useAddNewsletterComment, useNewsletterComments } from "@/query/newsletter";
import GuestbookCard from "@/components/shared/cards/guestbook-card";
import ContentForm from "@/components/form/content-form";
import authMutation from "@/mutation/auth.mutation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Svg } from "@/components/shared/svg";
import { cn } from "@/lib/utils";

interface NewsletterCommentsProps {
  slug: string;
  className?: string;
}

export const NewsletterComments = ({
  slug,
  className,
}: NewsletterCommentsProps) => {
  const [user, setUser] = useState<User | null>(null);
  const { data: comments, isLoading, refetch } = useNewsletterComments(slug);
  const { githubMutation } = authMutation();

  useEffect(() => {
    let isMounted = true;
    try {
      const supabase = createClient();
      supabase.auth.getUser().then((res) => {
        if (isMounted) setUser(res?.data?.user ?? null);
      });

      const { data: listener } = supabase.auth.onAuthStateChange((_ev, session) => {
        if (isMounted) setUser(session?.user ?? null);
      });

      return () => {
        isMounted = false;
        listener?.subscription?.unsubscribe();
      };
    } catch {
      return () => {
        isMounted = false;
      };
    }
  }, []);

  const handleSignIn = () => {
    if (typeof window !== "undefined") {
      githubMutation.mutate({ next: window.location.pathname });
    }
  };

  return (
    <section id="comments" className={cn("mt-12 pt-8 border-t border-border/60 space-y-6", className)}>
      <div className="flex items-center gap-2">
        <PiChatCircleDotsBold className="size-5 text-foreground" />
        <h2 className="text-lg font-bold text-foreground">
          Discussion ({comments?.length ?? 0})
        </h2>
      </div>

      {/* Comment Input */}
      {user ? (
        <div className="rounded-lg border border-border/60 bg-card/30 p-4">
          <p className="text-xs text-muted-foreground mb-3 font-medium">
            Leave a response as <span className="text-foreground font-semibold">{user.user_metadata?.name || user.email}</span>:
          </p>
          <ContentForm />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 p-5 text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            Sign in with GitHub to participate in this edition's discussion.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSignIn}
            disabled={githubMutation.isPending}
            className="gap-2 cursor-pointer"
          >
            {githubMutation.isPending ? (
              <PiArrowClockwiseBold className="size-4 animate-spin" />
            ) : (
              <Svg name="github" className="size-3.5" />
            )}
            Sign in with GitHub
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4 pt-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="size-7 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : comments && comments.length > 0 ? (
          comments.map((entry, index) => (
            <GuestbookCard
              key={entry.id}
              entry={entry}
              index={index}
              user={user}
            />
          ))
        ) : (
          <p className="text-xs text-muted-foreground italic">
            No responses yet. Be the first to start the conversation!
          </p>
        )}
      </div>
    </section>
  );
};

export default NewsletterComments;
