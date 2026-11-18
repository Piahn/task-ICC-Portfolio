"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { PiCheckBold, PiCopyBold } from "react-icons/pi";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
  size?: "sm" | "xs";
}

const CodeBlock = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const [copied, setCopied] = useState(false);
  const language = className ? className.replace(/^language-/, "") : "";
  const codeText = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy code:", e);
    }
  };

  return (
    <div className="relative my-2.5 overflow-hidden rounded-md border border-border bg-muted/40 text-foreground">
      <div className="flex items-center justify-between border-b border-border/40 bg-muted/60 px-3 py-1 text-[11px] font-mono text-muted-foreground select-none">
        <span>{language || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="hover:text-foreground inline-flex items-center gap-1 transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <PiCheckBold className="size-3 text-emerald-500" />
              <span className="text-[10px] text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <PiCopyBold className="size-3" />
              <span className="text-[10px]">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed">
        <code className={className}>{codeText}</code>
      </pre>
    </div>
  );
};

export const MarkdownContent = ({
  content,
  className,
  size = "sm",
}: MarkdownContentProps) => {
  return (
    <div
      className={cn(
        "prose-custom max-w-none break-words leading-relaxed",
        size === "sm" ? "text-sm text-foreground" : "text-xs text-muted-foreground",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children, ...props }) => {
            const isCodeBlock =
              Boolean(className?.includes("language-")) ||
              String(children).includes("\n");

            if (isCodeBlock) {
              return <CodeBlock className={className}>{children}</CodeBlock>;
            }

            return (
              <code
                className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground border border-border/50"
                {...props}
              >
                {children}
              </code>
            );
          },
          table: ({ children, ...props }) => (
            <div className="my-2.5 w-full overflow-x-auto rounded-md border border-border bg-card/40">
              <table
                className="w-full border-collapse text-left text-xs"
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead
              className="border-b border-border bg-muted/70 text-foreground font-semibold"
              {...props}
            >
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody className="divide-y divide-border/60" {...props}>
              {children}
            </tbody>
          ),
          th: ({ children, ...props }) => (
            <th
              className="border-r border-border last:border-r-0 px-3 py-1.5 font-semibold text-foreground text-xs"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="border-r border-border last:border-r-0 border-t border-border/50 px-3 py-1.5 text-foreground/90 text-xs"
              {...props}
            >
              {children}
            </td>
          ),
          tr: ({ children, ...props }) => (
            <tr className="hover:bg-muted/30 transition-colors" {...props}>
              {children}
            </tr>
          ),
          p: ({ children, ...props }) => (
            <p className="my-1 leading-relaxed break-words" {...props}>
              {children}
            </p>
          ),
          h1: ({ children, ...props }) => (
            <h1
              className="text-lg font-bold text-foreground mt-3 mb-1.5 leading-snug"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="text-base font-bold text-foreground mt-2.5 mb-1 leading-snug"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="text-sm font-semibold text-foreground mt-2 mb-1 leading-snug"
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className="text-xs font-semibold text-foreground mt-1.5 mb-0.5 leading-snug uppercase tracking-wide"
              {...props}
            >
              {children}
            </h4>
          ),
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-foreground" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic" {...props}>
              {children}
            </em>
          ),
          ul: ({ children, ...props }) => (
            <ul
              className="my-1.5 list-disc pl-5 space-y-1 text-xs leading-relaxed"
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol
              className="my-1.5 list-decimal pl-5 space-y-1 text-xs leading-relaxed"
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-relaxed" {...props}>
              {children}
            </li>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="my-2 border-l-2 border-primary bg-muted/30 px-3 py-2 italic text-muted-foreground rounded-r-md text-xs leading-relaxed"
              {...props}
            >
              {children}
            </blockquote>
          ),
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
              {...props}
            >
              {children}
            </a>
          ),
          hr: ({ ...props }) => (
            <hr className="my-3 border-border" {...props} />
          ),
          input: ({ type, checked, ...props }) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled
                  className="mr-1.5 rounded accent-primary align-middle"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
