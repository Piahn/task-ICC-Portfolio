import { motion } from "motion/react";
import Image from "next/image";

import Paragraph from "@/components/shared/paragraph";

import { clientItems } from "@/lib/constants";

const ClientSection = () => {
  // Triple the items for a completely seamless continuous infinite loop
  const duplicatedItems = [...clientItems, ...clientItems, ...clientItems];

  return (
    <div className="w-full space-y-6">
      <Paragraph title="Trusted by all">
        <p>
          I have been in these fields for{" "}
          <span className="text-foreground font-medium">3 years</span>, working
          with a diverse range of clients across various industries.
        </p>
        <p>
          My dedication to quality, attention to detail, and commitment to
          results have built long-lasting relationships and trust with every
          partner I've collaborated with.
        </p>
      </Paragraph>

      <div className="relative w-full overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <motion.div
          className="flex w-max items-center gap-x-12"
          animate={{
            x: ["0%", "-33.333%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div
              key={index}
              className="relative size-16 shrink-0 grayscale transition-opacity duration-300 md:size-20 dark:invert"
            >
              <Image
                src={item}
                fill
                alt={`Client logo ${index % clientItems.length}`}
                quality={70}
                loading="lazy"
                sizes="(max-width: 640px) 25vw, (max-width: 1024px) 12vw, 6vw"
                className="object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ClientSection;
