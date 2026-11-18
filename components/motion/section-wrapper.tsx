"use client";

import { Children, type ReactNode } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  itemClassName?: string;
  disableAnimation?: boolean;
}

const DEFAULT_SECTION_CLASS = "flex h-auto w-full grow flex-col";
const DEFAULT_ITEM_CLASS = "flex w-full max-w-lg flex-col items-center";

const SectionWrapper = ({
  id,
  children,
  className,
  itemClassName,
  disableAnimation = false,
}: SectionWrapperProps) => {
  const childrenArray = Children.toArray(children);

  return (
    <section id={id} className={cn(DEFAULT_SECTION_CLASS, className)}>
      {childrenArray.map((child, index) => {
        if (disableAnimation) {
          return (
            <div key={index} className={cn(DEFAULT_ITEM_CLASS, itemClassName)}>
              {child}
            </div>
          );
        }

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 32, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.12, margin: "0px 0px -40px 0px" }}
            transition={{
              duration: 0.55,
              delay: index === 0 ? 0.05 : 0.08,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className={cn(
              DEFAULT_ITEM_CLASS,
              itemClassName,
              "will-change-transform",
            )}
          >
            {child}
          </motion.div>
        );
      })}
    </section>
  );
};

export default SectionWrapper;
