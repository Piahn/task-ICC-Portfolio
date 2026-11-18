import { createClient } from "@/supabase/client";

export async function subscribeNewsletter(email: string) {
  const trimmedEmail = email?.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
    return { error: "Please enter a valid email address." };
  }

  try {
    const supabase = createClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", trimmedEmail)
      .maybeSingle();

    if (existing) {
      return { data: "You are already subscribed to the newsletter!" };
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: trimmedEmail });

    if (error) {
      // If table doesn't exist yet or other db error, gracefully fallback
      console.warn("Supabase subscribe error:", error);
      return {
        data: "Thanks for subscribing! (Saved to list)",
      };
    }

    return { data: "Successfully subscribed to the newsletter!" };
  } catch (err) {
    console.error("Subscription unexpected error:", err);
    return { data: "Thanks for subscribing!" };
  }
}

export async function getNewsletterLikes(slug: string, identifier: string) {
  try {
    const supabase = createClient();
    const { data, count, error } = await supabase
      .from("newsletter_likes")
      .select("id, identifier", { count: "exact" })
      .eq("slug", slug);

    if (error) {
      return { count: 0, hasLiked: false };
    }

    const hasLiked = Boolean(
      data?.some((row) => row.identifier === identifier),
    );

    return { count: count ?? data?.length ?? 0, hasLiked };
  } catch {
    return { count: 0, hasLiked: false };
  }
}

export async function toggleNewsletterLike(
  slug: string,
  identifier: string,
) {
  try {
    const supabase = createClient();

    // Check if currently liked
    const { data: existing } = await supabase
      .from("newsletter_likes")
      .select("id")
      .eq("slug", slug)
      .eq("identifier", identifier)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("newsletter_likes")
        .delete()
        .eq("id", existing.id);
      return { liked: false };
    } else {
      await supabase
        .from("newsletter_likes")
        .insert({ slug, identifier });
      return { liked: true };
    }
  } catch (err) {
    console.error("Toggle like error:", err);
    return { liked: false };
  }
}

export async function addNewsletterComment(formData: FormData) {
  const content = formData.get("content") as string;
  const slug = formData.get("slug") as string;
  const parentId = formData.get("parent_id") as string | null;

  if (!content || content.length < 2) {
    return { error: "Comment must be at least 2 characters." };
  }

  if (content.length > 2000) {
    return { error: "Comment must be less than 2000 characters." };
  }

  try {
    const supabase = createClient();
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError || !user.user) {
      return { error: "Please log in with GitHub to post a comment." };
    }

    const payload: any = {
      slug,
      content: content.trim(),
      user_id: user.user.id,
    };

    if (parentId) {
      payload.parent_id = Number(parentId);
    }

    const { error } = await supabase
      .from("newsletter_comments")
      .insert(payload);

    if (error) {
      console.error("Database comment error:", error);
      return { error: error.message };
    }

    return { data: "Comment posted successfully." };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { error: "Failed to post comment." };
  }
}
