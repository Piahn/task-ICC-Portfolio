"use client";

import {
  PiArrowClockwiseBold,
  PiArrowElbowDownLeftBold,
  PiCodeBold,
  PiEyeBold,
  PiListBulletsBold,
  PiPencilSimpleBold,
  PiQuotesBold,
  PiTableBold,
  PiTextBBold,
  PiTextHBold,
  PiXBold,
} from "react-icons/pi";

import type React from "react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/shared/markdown-content";

import contentMutation from "@/mutation/content.mutation";
import { cn } from "@/lib/utils";

interface ReplyFormProps {
  parentId: string;
  onCancel: () => void;
}

const ReplyForm = ({ parentId, onCancel }: ReplyFormProps) => {
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { addReplyMutation } = contentMutation();

  // Auto-resize textarea to fit markdown tables, quotes, and content dynamically
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || isPreview) return;
    textarea.style.height = "auto";
    const nextHeight = Math.max(80, textarea.scrollHeight);
    textarea.style.height = `${nextHeight}px`;
  }, [content, isPreview]);

  const insertMarkdown = (
    before: string,
    after: string = "",
    placeholder: string = "",
  ) => {
    setIsPreview(false);
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + before + placeholder + after);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);

    const textToInsert = selected || placeholder;
    const newContent =
      content.substring(0, start) +
      before +
      textToInsert +
      after +
      content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      const selectionStart = start + before.length;
      const selectionEnd = selectionStart + textToInsert.length;
      textarea.setSelectionRange(selectionStart, selectionEnd);
    }, 10);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await addReplyMutation.mutateAsync({
        content: content.trim(),
        parentId,
      });
      setContent("");
      onCancel();
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (content.trim() && !addReplyMutation.isPending) {
        handleSubmit(e as any);
      }
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <form className="w-full space-y-2" onSubmit={handleSubmit}>
      <div
        data-lenis-prevent
        className="overflow-hidden rounded-md border border-input bg-background/50 focus-within:ring-2 focus-within:ring-ring/40 focus-within:border-border transition-colors"
      >
        {/* Formatting Toolbar */}
        <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-2 py-1 select-none">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => insertMarkdown("### ", "", "Judul")}
              title="Huruf Besar / Heading"
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <PiTextHBold className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("**", "**", "teks tebal")}
              title="Tebal / Bold"
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <PiTextBBold className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("> ", "", "kutipan")}
              title="Kutipan / Quote"
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <PiQuotesBold className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() =>
                insertMarkdown(
                  "\n| Kolom 1 | Kolom 2 |\n| --- | --- |\n| Data 1 | Data 2 |\n",
                  "",
                )
              }
              title="Tabel"
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <PiTableBold className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("\n```js\n", "\n```\n", "// kode")}
              title="Kode / Code Block"
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <PiCodeBold className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("- ", "", "item")}
              title="Daftar / List"
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <PiListBulletsBold className="size-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsPreview((prev) => !prev)}
            className={cn(
              "flex items-center gap-1 rounded px-2 py-0.5 text-xs transition-colors cursor-pointer",
              isPreview
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            title={isPreview ? "Kembali Menulis" : "Lihat Pratinjau"}
          >
            {isPreview ? (
              <>
                <PiPencilSimpleBold className="size-3" />
                <span>Tulis</span>
              </>
            ) : (
              <>
                <PiEyeBold className="size-3" />
                <span>Preview</span>
              </>
            )}
          </button>
        </div>

        {/* Input / Preview Area */}
        {isPreview ? (
          <div
            data-lenis-prevent
            className="min-h-20 max-h-60 w-full overflow-y-auto p-3 text-xs"
          >
            {content.trim() ? (
              <MarkdownContent content={content} size="xs" />
            ) : (
              <p className="text-xs italic text-muted-foreground">
                Tulis sesuatu untuk melihat pratinjau markdown...
              </p>
            )}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            data-lenis-prevent
            placeholder="Leave a reply... (Markdown didukung)"
            name="reply"
            id="reply"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-20 max-h-60 w-full resize-y border-0 bg-transparent p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 overflow-y-auto"
            disabled={addReplyMutation.isPending}
            autoFocus
            maxLength={2000}
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button
          onClick={onCancel}
          type="button"
          size="icon"
          variant="secondary"
          className="size-9"
          title="Cancel"
        >
          <PiXBold className="size-4" />
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground">
            {content.length}/2000
          </span>
          <Button
            disabled={addReplyMutation.isPending || !content.trim()}
            type="submit"
            size="sm"
            variant="secondary"
          >
            {addReplyMutation.isPending ? (
              <PiArrowClockwiseBold className="size-4 animate-spin" />
            ) : (
              <>
                <span>Enter</span>
                <PiArrowElbowDownLeftBold className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ReplyForm;
