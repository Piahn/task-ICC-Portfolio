import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  PiArrowLeftBold,
  PiCodeBlockDuotone,
  PiGitBranchDuotone,
  PiGridFourDuotone,
  PiShareNetworkDuotone,
  PiStarDuotone,
  PiStarFill,
} from "react-icons/pi";

import Link from "next/link";

import ApiTable from "@/components/shared/api-table";
import LabCard from "@/components/shared/cards/lab-card";
import Code from "@/components/shared/code";
import Paragraph from "@/components/shared/paragraph";
import TableOfContents from "@/components/shared/toc";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CodeWrapper from "@/components/motion/code-wrapper";

import { API_REFERENCES } from "@/lib/api-reference";
import { COMPONENTS } from "@/lib/data";
import { mapComponentToToc } from "@/lib/functions";
import { getFilePathAndConfig } from "@/lib/read-file";

export default function LabDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const item = COMPONENTS.find((component) => component.slug === slug);

  const [fileConfig, setFileConfig] = useState<{
    code: string;
    twConfig: string;
    uiLibrary: string | undefined;
    cssClass: string | undefined;
    exampleCodes: { name: string; code: string }[];
    customHook: string | null;
  } | null>(null);

  useEffect(() => {
    if (item) {
      getFilePathAndConfig(item).then((config) => {
        setFileConfig(config);
      });
    }
  }, [item]);

  if (!item) {
    return (
      <section className="pad-x flex h-auto w-full grow flex-col items-center justify-center">
        <h2 className="text-accent-foreground text-center text-lg font-semibold">
          Component Not Found
        </h2>
      </section>
    );
  }

  const {
    code = "",
    twConfig = "",
    uiLibrary,
    cssClass,
    exampleCodes = [],
    customHook = null,
  } = fileConfig ?? {};

  return (
    <article id={item.slug} className="relative flex h-auto w-full grow px-4">
      <TableOfContents toc={mapComponentToToc(item)} scrollPosition="top" />

      <div className="mx-auto w-full max-w-lg space-y-10 md:max-w-md md:space-y-12 lg:max-w-lg lg:space-y-16">
        <div className="flex w-full items-center justify-between">
          <Link
            href={`/lab`}
            scroll={true}
            aria-label={`Go back to /lab`}
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
              href={`https://x.com/intent/tweet?text=${item?.name}&url=https://salmoon.vercel.app/lab/${item?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              scroll={true}
              aria-label={`Share /lab/${item?.slug}`}
            >
              <PiShareNetworkDuotone className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="w-full space-y-10 md:space-y-12 lg:space-y-16">
          <Paragraph title={item.name}>
            <p>{item.description}</p>
            <div className="flex flex-col gap-y-3">
              <LabStarButton slug={item.slug} name={item.name} />
              {item.credit && (
                <Link
                  href={item.credit.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Credit link"
                  className="anim hover:text-foreground inline-flex w-fit items-center gap-2 text-sm font-medium"
                >
                  <PiGitBranchDuotone />
                  {item.credit.name}
                </Link>
              )}
            </div>
          </Paragraph>

          {item.example.map((example, index) => (
            <div className="w-full space-y-2" key={index}>
              <Tabs defaultValue="preview">
                <TabsList className="gap-x-8 bg-transparent p-0">
                  <TabsTrigger
                    className="gap-2 px-0 data-[state=active]:shadow-none"
                    value="preview"
                  >
                    <PiGridFourDuotone />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger
                    className="gap-2 px-0 data-[state=active]:shadow-none"
                    value="code"
                  >
                    <PiCodeBlockDuotone />
                    Code
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="preview">
                  <LabCard
                    gridClass={item.gridClass}
                    className="min-h-72"
                    name={example.name}
                    id={example.path}
                  >
                    <example.child />
                  </LabCard>
                </TabsContent>
                <TabsContent value="code">
                  <div className="h-fit w-full max-w-lg rounded border-2 border-dashed p-1 sm:p-2">
                    <Code
                      code={exampleCodes[index]?.code ?? "// Loading code..."}
                      lang="tsx"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ))}
        </div>

        {uiLibrary && (
          <div className="w-full space-y-4">
            <Paragraph title="Library setup" />
            <div
              id="library-setup"
              className="h-fit w-full max-w-lg rounded border-2 border-dashed p-1 sm:p-2"
            >
              <Code code={uiLibrary} lang="bash" />
            </div>
          </div>
        )}

        {cssClass && (
          <div className="w-full space-y-4">
            <Paragraph title="CSS styling" />
            <div
              id="css-styling"
              className="h-fit w-full max-w-lg rounded border-2 border-dashed p-1 sm:p-2"
            >
              <Code code={cssClass} lang="css" />
            </div>
          </div>
        )}

        {twConfig && (
          <div className="w-full space-y-4">
            <Paragraph title="Tailwind config" />
            <div
              id="tailwind-config"
              className="h-fit w-full max-w-lg rounded border-2 border-dashed p-1 sm:p-2"
            >
              <CodeWrapper>
                <Code code={twConfig} lang="json" />
              </CodeWrapper>
            </div>
          </div>
        )}

        {customHook && (
          <div className="w-full space-y-4">
            <Paragraph title="Required hook" />
            <div
              id="required-hook"
              className="h-fit w-full max-w-lg rounded border-2 border-dashed p-1 sm:p-2"
            >
              <CodeWrapper>
                <Code code={customHook} lang="ts" />
              </CodeWrapper>
            </div>
          </div>
        )}

        {item.primitive && (
          <div className="w-full space-y-4">
            <Paragraph title="Code" />
            <div
              id="code"
              className="h-fit w-full max-w-lg rounded border-2 border-dashed p-1 sm:p-2"
            >
              <CodeWrapper>
                <Code code={code} lang="tsx" />
              </CodeWrapper>
            </div>
          </div>
        )}

        {API_REFERENCES[item.slug] && (
          <div className="w-full space-y-4">
            <Paragraph title="API Reference" />
            <div id="api-reference" className="w-full max-w-lg">
              <ApiTable data={API_REFERENCES[item.slug]} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

const getBaseStars = (slug: string): number => {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  return 18 + Math.abs(hash % 30); // 18 - 47 baseline
};

const LabStarButton = ({ slug, name }: { slug: string; name: string }) => {
  const [isStarred, setIsStarred] = useState(false);
  const [mounted, setMounted] = useState(false);
  const baseCount = getBaseStars(slug);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`lab_star_${slug}`);
      if (stored === "true") {
        setIsStarred(true);
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, [slug]);

  const handleToggleStar = () => {
    const nextState = !isStarred;
    setIsStarred(nextState);
    try {
      localStorage.setItem(`lab_star_${slug}`, String(nextState));
    } catch {
      // ignore
    }
    if (nextState) {
      toast(`Starred ${name}!`, {
        icon: <PiStarFill className="size-4 text-yellow-500" />,
      });
    } else {
      toast(`Unstarred ${name}`, {
        icon: <PiStarDuotone className="size-4" />,
      });
    }
  };

  const currentCount = baseCount + (isStarred ? 1 : 0);

  return (
    <button
      type="button"
      onClick={handleToggleStar}
      className="anim text-muted-foreground hover:text-foreground group inline-flex w-fit items-center gap-2 text-sm font-medium cursor-pointer active:scale-95 select-none"
      aria-label={isStarred ? `Unstar ${name}` : `Star ${name}`}
    >
      {isStarred ? (
        <PiStarFill className="size-4 text-yellow-500 transition-transform duration-200 group-hover:scale-110" />
      ) : (
        <PiStarDuotone className="size-4 transition-transform duration-200 group-hover:scale-110" />
      )}
      <span className={isStarred ? "text-foreground font-semibold" : ""}>
        {isStarred ? "Starred" : "Star"}
      </span>
      <span className="text-muted-foreground border-border/70 bg-secondary/50 rounded-full border px-2 py-0.5 font-mono text-xs font-normal">
        {mounted ? currentCount : baseCount}
      </span>
    </button>
  );
};
