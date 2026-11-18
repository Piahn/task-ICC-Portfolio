"use client";

import { useMemo, useRef } from "react";
import {
  type MotionValue,
  type Transition,
  motion,
  useScroll,
  useTransform,
} from "motion/react";

import { PolaroidCard } from "@/components/shared/cards/polaroid-card";

import { useDesktop } from "@/hooks/use-desktop";
import { placeItems } from "@/lib/assets";

const transition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

const Places = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const { isDesktop } = useDesktop(640);

  const itemsToRender = useMemo(() => {
    return isDesktop ? placeItems : placeItems.slice(0, 3);
  }, [isDesktop]);

  return (
    <div ref={containerRef} className="relative w-full max-w-full">
      <div className="mx-auto flex w-fit flex-row items-center gap-2 -space-x-4 px-4 sm:gap-4 sm:-space-x-8">
        {itemsToRender.map((item, index) => (
          <PlaceCard
            key={item.id}
            item={item}
            index={index}
            scrollY={scrollY}
          />
        ))}
      </div>
    </div>
  );
};

const PlaceCard = ({
  item,
  index,
  scrollY,
}: {
  item: (typeof placeItems)[number];
  index: number;
  scrollY: MotionValue<number>;
}) => {
  // Parallax fanning out effect driven by scroll position
  const spreadFactors = [-28, -10, 10, 28];
  const rotFactors = [-7, 3, -4, 8];
  const yFactors = [0, 14, -8, 6];

  const factorX = spreadFactors[index] ?? 0;
  const factorRot = rotFactors[index] ?? 0;
  const factorY = yFactors[index] ?? 0;

  // Transforms react directly to vertical scroll
  const x = useTransform(scrollY, [0, 350], [0, factorX]);
  const y = useTransform(scrollY, [0, 350], [0, factorY]);
  const rotate = useTransform(
    scrollY,
    [0, 350],
    [item.rotation, item.rotation + factorRot],
  );

  return (
    <motion.div
      style={{ x, y, rotate }}
      whileHover={{ scale: 1.08, rotate: 0, zIndex: 30 }}
      transition={transition as Transition}
      className="box-shadow relative shrink-0 overflow-hidden rounded-[1px] will-change-transform"
    >
      <PolaroidCard
        src={item.src}
        alt={`Image of place ${item.id}`}
        title={item.title}
        className="xs:w-[24vw] relative w-[28vw] sm:w-32"
      />
    </motion.div>
  );
};

export default Places;
