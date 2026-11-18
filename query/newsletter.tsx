"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/supabase/client";
import {
  addNewsletterComment,
  subscribeNewsletter,
  toggleNewsletterLike,
} from "@/action/newsletter";
import type {
  GuestbookWithReplies,
  GuestbookWithUser,
  UserProfile,
} from "@/types/guestbook.types";

// Local storage key for persistent visitor like tracking
export const getClientIdentifier = () => {
  if (typeof window === "undefined") return "server-client";
  let id = localStorage.getItem("newsletter_client_id");
  if (!id) {
    id = "usr_" + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    localStorage.setItem("newsletter_client_id", id);
  }
  return id;
};

type CommentRow = {
  id: number | string;
  slug: string;
  content: string;
  created_at: string;
  user_id: string | null;
  parent_id: number | string | null;
};

const PROFILE_FIELDS = "id, name, avatar_url";

const buildUserMap = (users: UserProfile[] | null) => {
  if (!users?.length) return {} as Record<string, UserProfile>;
  return users.reduce<Record<string, UserProfile>>((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});
};

const attachReplies = (entries: GuestbookWithUser[]): GuestbookWithReplies[] => {
  const parents = new Map<string, GuestbookWithReplies>();
  const replies: GuestbookWithUser[] = [];

  for (const entry of entries) {
    if (!entry.parent_id) {
      parents.set(entry.id, { ...entry, replies: [] });
      continue;
    }
    replies.push(entry);
  }

  if (!parents.size) return [];

  for (const reply of replies) {
    const parent = parents.get(reply.parent_id!);
    if (!parent) continue;
    parent.replies.push(reply);
  }

  for (const parent of parents.values()) {
    if (parent.replies.length > 1) {
      parent.replies.sort((a, b) => a.created_at.localeCompare(b.created_at));
    }
  }

  return Array.from(parents.values());
};

export const useNewsletterLikes = (slug: string) => {
  return useQuery({
    queryKey: ["newsletter_likes", slug],
    queryFn: async () => {
      const identifier = getClientIdentifier();
      try {
        const supabase = createClient();
        const { data, count, error } = await supabase
          .from("newsletter_likes")
          .select("id, identifier", { count: "exact" })
          .eq("slug", slug);

        if (error) {
          // Fallback to local storage if table is not yet migrated in Supabase
          const localLiked = localStorage.getItem(`newsletter_liked_${slug}`) === "true";
          return { count: localLiked ? 1 : 0, hasLiked: localLiked };
        }

        const hasLiked = Boolean(
          data?.some((row) => row.identifier === identifier),
        );

        return { count: count ?? data?.length ?? 0, hasLiked };
      } catch {
        const localLiked = localStorage.getItem(`newsletter_liked_${slug}`) === "true";
        return { count: localLiked ? 1 : 0, hasLiked: localLiked };
      }
    },
    staleTime: 1000 * 30,
  });
};

export const useNewsletterComments = (slug: string) => {
  return useQuery({
    queryKey: ["newsletter_comments", slug],
    queryFn: async (): Promise<GuestbookWithReplies[]> => {
      try {
        const supabase = createClient();
        const { data: comments, error } = await supabase
          .from("newsletter_comments")
          .select("id, slug, content, created_at, user_id, parent_id")
          .eq("slug", slug)
          .order("created_at", { ascending: false });

        if (error || !comments) return [];

        const userIds = [
          ...new Set(comments.map((c) => c.user_id).filter(Boolean)),
        ] as string[];

        let userMap: Record<string, UserProfile> = {};
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select(PROFILE_FIELDS)
            .in("id", userIds);
          userMap = buildUserMap(profiles);
        }

        const mapped: GuestbookWithUser[] = comments.map((entry) => ({
          id: String(entry.id),
          content: entry.content,
          created_at: entry.created_at,
          user: entry.user_id ? userMap[entry.user_id] ?? null : null,
          parent_id: entry.parent_id ? String(entry.parent_id) : null,
        }));

        return attachReplies(mapped);
      } catch (err) {
        console.warn("Fetch newsletter comments error:", err);
        return [];
      }
    },
  });
};

export const useToggleNewsletterLike = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const identifier = getClientIdentifier();
      const current = queryClient.getQueryData<{ count: number; hasLiked: boolean }>([
        "newsletter_likes",
        slug,
      ]);
      const nextLiked = !current?.hasLiked;
      const nextCount = Math.max(0, (current?.count ?? 0) + (nextLiked ? 1 : -1));

      // Optimistic update
      queryClient.setQueryData(["newsletter_likes", slug], {
        count: nextCount,
        hasLiked: nextLiked,
      });

      // Save local state fallback
      localStorage.setItem(`newsletter_liked_${slug}`, String(nextLiked));

      return toggleNewsletterLike(slug, identifier);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletter_likes", slug] });
    },
  });
};

export const useSubscribeNewsletter = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      return subscribeNewsletter(email);
    },
  });
};

export const useAddNewsletterComment = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("slug", slug);
      if (parentId) formData.append("parent_id", parentId);
      return addNewsletterComment(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletter_comments", slug] });
    },
  });
};
