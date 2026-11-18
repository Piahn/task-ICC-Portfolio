"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useLocation } from "react-router-dom";

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollToTop: (options?: { smooth?: boolean }) => void;
  scrollTo: (target: number | string | HTMLElement, options?: any) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollToTop: () => {},
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // Check if device is touch-primary / mobile
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(max-width: 768px)").matches;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      // If mobile/touchscreen, let browser handle touch with 100% native momentum
      syncTouch: false,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Ensure scroll is restored instantly to top on route change and resize recalculated
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
      lenisRef.current.resize();
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [location.pathname]);

  // Recalculate scroll dimensions whenever DOM elements resize (e.g. dynamic content/textarea)
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;

    const resizeObserver = new ResizeObserver(() => {
      lenisRef.current?.resize();
    });

    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const scrollToTop = ({ smooth = true }: { smooth?: boolean } = {}) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, {
        duration: smooth ? 1.0 : 0,
        immediate: !smooth,
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: smooth ? "smooth" : "instant",
      });
    }
  };

  const scrollTo = (
    target: number | string | HTMLElement,
    options: any = {},
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    } else if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "smooth" });
    } else if (typeof target === "string") {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <SmoothScrollContext.Provider
      value={{
        lenis: lenisRef.current,
        scrollToTop,
        scrollTo,
      }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
}
