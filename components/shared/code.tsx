import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import type { BundledLanguage } from "shiki";

import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRemoveNotationEscape,
} from "@shikijs/transformers";

import Clipboard from "@/components/shared/clipboard";

import { cn } from "@/lib/utils";
import "@/styles/shiki.css";

type CodeProps = {
  code?: string;
  id?: string;
  lang?: BundledLanguage | string;
  lineNumber?: boolean;
  lineShine?: boolean;
  [key: string]: any;
};

const highlightCache = new Map<string, string>();

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function Code(props: CodeProps = {}) {
  const {
    code = "",
    id,
    lang = "ts",
    lineNumber = false,
    lineShine = false,
    ...rest
  } = props || {};

  const cacheKey = `${lang}:${code}`;
  const [html, setHtml] = useState<string>(() => highlightCache.get(cacheKey) || "");

  useEffect(() => {
    if (!code) {
      setHtml("");
      return;
    }

    if (highlightCache.has(cacheKey)) {
      setHtml(highlightCache.get(cacheKey)!);
      return;
    }

    let isMounted = true;
    codeToHtml(code, {
      lang: (lang as BundledLanguage) || "ts",
      themes: { dark: "github-dark", light: "github-light" },
      transformers: [
        transformerNotationHighlight(),
        transformerNotationDiff(),
        transformerNotationWordHighlight(),
        transformerRemoveNotationEscape(),
        transformerMetaHighlight(),
      ],
    })
      .then((result) => {
        highlightCache.set(cacheKey, result);
        if (isMounted) {
          setHtml(result);
        }
      })
      .catch((err) => {
        console.error("Shiki highlight error:", err);
        const fallback = `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`;
        if (isMounted) {
          setHtml(fallback);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [code, lang, cacheKey]);

  return (
    <div
      id={id}
      className="relative h-fit w-full overflow-hidden rounded bg-[#f7f7f7]! dark:bg-[#101010]!"
      {...rest}
    >
      {html ? (
        <div
          className={cn(
            "no-scrollbar min-h-8 w-full min-w-0 overflow-x-auto rounded-xl text-sm [&_code]:block [&_code]:w-fit [&_code]:min-w-full",
            lineNumber ? "" : "no-line-numbers",
            lineShine ? "" : "no-line-shine",
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="no-scrollbar min-h-8 w-full min-w-0 overflow-x-auto rounded-xl p-4 text-sm font-mono text-muted-foreground">
          <code>{code || "// Loading..."}</code>
        </pre>
      )}

      <div className="pointer-events-none absolute top-0 right-0 z-0 h-full w-6 bg-linear-to-r from-transparent to-[#f7f7f7] dark:to-[#101010]" />

      <Clipboard
        string={code}
        className="absolute top-1 right-1 size-8 sm:top-2 sm:right-2"
      />
    </div>
  );
}
