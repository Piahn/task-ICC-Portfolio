"use client";

import { useRef, useState } from "react";
import {
  type MotionValue,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useSmoothScroll } from "@/components/provider/smooth-scroll-provider";
import { cn } from "@/lib/utils";

export default function SailingBoat({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSailingToTop, setIsSailingToTop] = useState(false);
  const { scrollToTop } = useSmoothScroll();

  // Track scroll position of the footer / boat container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Smooth out the scroll progress with a gentle spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // Calculate motion across the horizontal track (5% to 88% width)
  const boatX = useTransform(smoothProgress, [0, 1], ["5%", "85%"]);
  const boatY = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [0, -3.5, 2.5, -2, 0]);
  const boatRotate = useTransform(
    smoothProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [-4, 5, -3, 4, -2, 1],
  );

  // Easter Egg: Sail to top on click
  const handleSailToTop = () => {
    if (isSailingToTop) return;
    setIsSailingToTop(true);

    scrollToTop({ smooth: true });

    // Reset after reaching the top
    setTimeout(() => {
      setIsSailingToTop(false);
    }, 1200);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative mx-auto w-full max-w-lg select-none px-4 py-4 md:py-6 overflow-hidden col-span-full",
        className,
      )}
    >
      {/* Side gradient fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-12 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-12 bg-linear-to-l from-background to-transparent" />

      {/* Main sailing track container */}
      <div className="relative flex h-14 w-full items-end justify-center pb-2">
        {/* Animated Sailing Boat */}
        <motion.div
          style={{
            left: isSailingToTop ? "100%" : boatX,
            y: boatY,
            rotate: boatRotate,
            transition: isSailingToTop
              ? "left 0.8s cubic-bezier(0.22, 1, 0.36, 1)"
              : undefined,
          }}
          onClick={handleSailToTop}
          whileHover={{ scale: 1.18, y: -4 }}
          whileTap={{ scale: 0.95 }}
          className="group absolute bottom-2.5 z-20 flex cursor-pointer items-center gap-0.5 text-foreground/80 transition-colors hover:text-foreground"
          role="button"
          tabIndex={0}
          aria-label="Sail boat to top of page"
        >
          {/* Micro Tooltip */}
          <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 scale-75 rounded-md border border-border/80 bg-popover px-2 py-0.5 text-[10px] font-medium text-foreground opacity-0 shadow-xs transition-all duration-200 ease-in-out group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap">
            sail to top ↑
          </span>

          {/* Wake foam trail behind the boat */}
          <span className="absolute -left-6 bottom-0 text-xs text-foreground/30 font-mono tracking-tighter opacity-70">
            ﹏﹏
          </span>

          {/* Idle gentle floating bob */}
          <motion.div
            animate={{
              y: [0, -2, 1, 0],
              rotate: [-1.5, 2, -1.5],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.2,
              ease: "easeInOut",
            }}
            className="flex items-center text-xl md:text-2xl font-mono leading-none"
          >
            <span className="text-foreground">𓊝</span>
            <span className="text-foreground/75 text-base md:text-lg -ml-0.5">𓂁</span>
          </motion.div>
        </motion.div>

        {/* Continuous baseline water waves */}
        <div className="flex w-full justify-center overflow-hidden text-xs md:text-sm font-mono tracking-tight text-foreground/40 dark:text-foreground/30 opacity-80 select-none">
          <span className="whitespace-nowrap">
            ﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
          </span>
        </div>
      </div>
    </div>
  );
}
