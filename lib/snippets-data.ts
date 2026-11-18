export type SnippetCategory =
  | "All"
  | "React & Hooks"
  | "TypeScript"
  | "Tailwind & CSS"
  | "Utilities"
  | "Next.js & API";

export type SnippetItem = {
  id: string;
  title: string;
  description: string;
  category: "React & Hooks" | "TypeScript" | "Tailwind & CSS" | "Utilities" | "Next.js & API";
  language: "typescript" | "tsx" | "css" | "javascript";
  tags: string[];
  featured?: boolean;
  code: string;
};

export const SNIPPET_CATEGORIES: SnippetCategory[] = [
  "All",
  "React & Hooks",
  "TypeScript",
  "Tailwind & CSS",
  "Utilities",
  "Next.js & API",
];

export const snippetItems: SnippetItem[] = [
  {
    id: "use-debounce",
    title: "useDebounce Hook",
    description: "Debounce rapidly changing values like search inputs or window resize events to reduce redundant re-renders and API calls.",
    category: "React & Hooks",
    language: "typescript",
    tags: ["React", "Hook", "Performance", "Input"],
    featured: true,
    code: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
  },
  {
    id: "cn-tailwind-merge",
    title: "cn() Class Merger",
    description: "The gold-standard Tailwind CSS class merger combining clsx condition handling with tailwind-merge to resolve conflicting utilities.",
    category: "Tailwind & CSS",
    language: "typescript",
    tags: ["Tailwind", "Utility", "CSS", "UI"],
    featured: true,
    code: `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class names and resolves Tailwind CSS conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}`,
  },
  {
    id: "use-local-storage",
    title: "useLocalStorage Hook",
    description: "Sync component state with localStorage across browser tabs and handle SSR hydration seamlessly.",
    category: "React & Hooks",
    language: "typescript",
    tags: ["React", "Hook", "Storage", "State"],
    featured: true,
    code: `import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(\`Error setting localStorage key "\${key}":\`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}`,
  },
  {
    id: "use-click-outside",
    title: "useOnClickOutside Hook",
    description: "Detect mouse click or touch events outside of a referenced modal, drawer, or dropdown menu to close it.",
    category: "React & Hooks",
    language: "typescript",
    tags: ["React", "Hook", "DOM", "Modal"],
    code: `import { type RefObject, useEffect } from "react";

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}`,
  },
  {
    id: "copy-to-clipboard",
    title: "Copy to Clipboard",
    description: "Safe asynchronous copy-to-clipboard function with automatic fallback for older browsers or non-secure contexts.",
    category: "Utilities",
    language: "typescript",
    tags: ["Clipboard", "Utility", "DOM"],
    code: `export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("navigator.clipboard failed, attempting fallback:", err);
    }
  }

  // Fallback for older browsers or non-HTTPS contexts
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.error("Fallback copy failed:", err);
    return false;
  }
}`,
  },
  {
    id: "format-relative-time",
    title: "formatRelativeTime Helper",
    description: "Lightweight zero-dependency relative time formatter using native Intl.RelativeTimeFormat.",
    category: "Utilities",
    language: "typescript",
    tags: ["Intl", "Date", "Format", "Utility"],
    code: `export function formatRelativeTime(date: Date | string | number): string {
  const now = Date.now();
  const past = new Date(date).getTime();
  const diffInSeconds = Math.round((past - now) / 1000);

  const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const { unit, seconds } of units) {
    if (Math.abs(diffInSeconds) >= seconds || unit === "second") {
      const value = Math.round(diffInSeconds / seconds);
      return rtf.format(value, unit);
    }
  }

  return "just now";
}`,
  },
  {
    id: "fetch-with-timeout",
    title: "Fetch with Timeout & Retry",
    description: "Robust fetch wrapper with AbortController timeout and exponential backoff retry logic.",
    category: "Next.js & API",
    language: "typescript",
    tags: ["API", "Fetch", "Async", "Network"],
    code: `type FetchOptions = RequestInit & {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
};

export async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {},
): Promise<Response> {
  const { timeoutMs = 8000, retries = 2, retryDelayMs = 1000, ...fetchOptions } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!response.ok && attempt < retries) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }
      return response;
    } catch (err: any) {
      clearTimeout(timer);
      lastError = err?.name === "AbortError" ? new Error("Request timed out") : err;

      if (attempt < retries) {
        const backoff = retryDelayMs * Math.pow(2, attempt);
        await new Promise((res) => setTimeout(res, backoff));
      }
    }
  }

  throw lastError ?? new Error("Fetch failed");
}`,
  },
  {
    id: "slugify-string",
    title: "Safe Kebab Slugifier",
    description: "Convert string headings into clean, SEO-friendly, URL-safe kebab-case slugs.",
    category: "TypeScript",
    language: "typescript",
    tags: ["String", "SEO", "URL", "Utility"],
    code: `export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\\s_]+/g, "-")          // Replace spaces and underscores with -
    .replace(/[^\\w\\-]+/g, "")         // Remove all non-word chars
    .replace(/\\-\\-+/g, "-")           // Replace multiple - with single -
    .replace(/^-+/, "")                // Trim - from start of text
    .replace(/-+$/, "");               // Trim - from end of text
}`,
  },
  {
    id: "shimmer-skeleton-css",
    title: "Shimmer Gradient Keyframes",
    description: "Smooth continuous shimmer skeleton animation for loading state placeholders.",
    category: "Tailwind & CSS",
    language: "css",
    tags: ["CSS", "Animation", "Skeleton", "Tailwind"],
    code: `@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.8s infinite linear;
}`,
  },
];
