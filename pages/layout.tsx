import { motion, useScroll, useSpring } from "motion/react";
import dynamic from "next/dynamic";
import { Outlet } from "react-router-dom";

import Command from "@/components/shared/command";
import Dock from "@/components/shared/dock";

const Footer = dynamic(() => import("@/components/shared/footer"), {
  ssr: false,
});

export default function AppLayout() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-primary origin-left"
        style={{ scaleX }}
      />

      <div className="relative flex min-h-svh flex-col items-center justify-center">
        <div className="from-background pointer-events-none fixed top-0 left-0 z-50 h-8 w-full bg-linear-to-b to-transparent md:h-10 lg:h-12" />
        <main className="flex h-auto w-full grow flex-col py-16 md:py-20 lg:py-24">
          <Outlet />
        </main>
        <Dock />
      </div>
      <Footer />
      <Command />
    </>
  );
}
