"use client";

import { FC, useMemo } from "react";

import { useTheme } from "next-themes";
import Image from "next/image";

import { cn } from "@/lib/utils";

type IconProps = {
  name?: string;
  slug?: string;
  className?: string;
  size?: number;
};

export const Svg: FC<IconProps> = ({ name, slug, className = "", size = 12 }) => {
  const { resolvedTheme } = useTheme();
  const rawKey = name || slug || "";
  const key = rawKey.toLowerCase();

  const src = useMemo(() => {
    if (!key) return "";
    const themeSuffix = resolvedTheme === "dark" ? "dark" : "light";
    const themedPath = `/icons/tech/${key}-${themeSuffix}.svg`;
    const defaultPath = `/icons/tech/${key}.svg`;

    // We can't do a filesystem check in the browser, so we rely on naming convention
    // and fallback if themed file isn't provided
    const hasThemedVersion = [
      "astro",
      "aws",
      "drizzle",
      "github",
      "markdown",
      "prisma",
      "motion",
      "swr",
      "vercel",
      "zed",
      "shadcn",
      "go",
      "express",
      "sketch",
    ].includes(key);

    return hasThemedVersion ? themedPath : defaultPath;
  }, [key, resolvedTheme]);

  if (!key || !src) return null;

  return (
    <Image
      src={src}
      alt={key}
      width={size}
      height={size}
      className={cn("size-3", className)}
    />
  );
};
