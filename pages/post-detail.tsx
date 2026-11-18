import { posts } from "#site/content";
import { useParams } from "react-router-dom";

import { LuBadgeCheck } from "react-icons/lu";
import { PiArrowLeftBold, PiShareNetworkDuotone } from "react-icons/pi";

import Image from "next/image";
import Link from "next/link";

import { TextHighlighter } from "@/components/shared/highlighter";
import { MDXToC, Mdx } from "@/components/shared/mdx";
import TableOfContents from "@/components/shared/toc";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { siteItems } from "@/lib/config";
import { formatDate } from "@/lib/functions";
import NotFoundPage from "@/pages/not-found";

export default function PostDetailPage() {
  const params = useParams();
  const slug = params["*"] || "";
  const post = posts.find((p) => p.slugAsParams === slug);

  if (!post || !post.published) {
    return <NotFoundPage />;
  }

  const tableOfContents = MDXToC({ code: post.body });

  return (
    <article id={post.slug} className="relative flex h-auto w-full grow px-4">
      <TableOfContents toc={tableOfContents} />

      <div className="mx-auto w-full max-w-lg space-y-10 md:max-w-md md:space-y-12 lg:max-w-lg lg:space-y-16">
        <div className="flex w-full items-center justify-between">
          <Link
            href={`/post`}
            scroll={true}
            aria-label={`Go back to /post`}
            className="anim text-muted-foreground hover:text-foreground flex items-center gap-x-2"
          >
            <PiArrowLeftBold className="size-4" />
            <p className="text-sm font-medium">Go back</p>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-muted-foreground h-9 w-9"
          >
            <Link
              href={`https://x.com/intent/tweet?text=${post?.title}&url=https://salmoon.vercel.app/${post?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              scroll={true}
              aria-label={`Tweet about ${post?.title}`}
            >
              <PiShareNetworkDuotone className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="flex w-full flex-col">
          <div className="mb-4 space-y-1 sm:mb-6">
            <h1 className="text-xl font-bold sm:text-2xl">{post.title}</h1>
            <p className="text-muted-foreground text-sm font-medium md:text-base">
              {formatDate(post.date, "mid")}
            </p>
          </div>

          <div className="relative mb-4 aspect-video h-auto w-full overflow-hidden rounded sm:mb-6">
            <Image
              src={post.image}
              alt={`${post.title} cover image.`}
              fill
              className="object-cover"
            />
          </div>

          <div className="mb-1 flex items-center gap-3">
            <div className="relative">
              <Avatar className="size-11 rounded-full border">
                <AvatarImage
                  src="https://avatars.githubusercontent.com/u/132025108?v=4"
                  alt={`@${siteItems.name}`}
                />
                <AvatarFallback className="text-muted-foreground rounded-md">
                  PW
                </AvatarFallback>
              </Avatar>

              <LuBadgeCheck
                size={20}
                className="text-background absolute -right-1 -bottom-1 fill-green-500"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-foreground text-sm font-semibold">
                {siteItems.name}
              </p>
              <p className="text-muted-foreground text-xs font-medium">
                {siteItems.role}
              </p>
            </div>
          </div>

          <TextHighlighter slug={post.slug}>
            <Mdx code={post.body} />
          </TextHighlighter>
        </div>
      </div>
    </article>
  );
}
