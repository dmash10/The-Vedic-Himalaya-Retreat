import { motion } from "motion/react";
import { useEffect, useRef } from "react";

interface PageLoaderProps {
  /** URL to preload in the background while the loader is visible */
  preloadSrc?: string;
  /** Signal if the parent component is still loading the URL from database/CMS */
  isUrlLoading?: boolean;
  /** Called when the preloaded image has finished loading */
  onPreloaded?: () => void;
}

/**
 * Premium full-page loading screen with resort branding.
 * Preloads the hero image so it's instantly cached when the loader dismisses.
 */
export default function PageLoader({ preloadSrc, isUrlLoading = false, onPreloaded }: PageLoaderProps) {
  const calledRef = useRef(false);
  const onPreloadedRef = useRef(onPreloaded);
  onPreloadedRef.current = onPreloaded;

  useEffect(() => {
    if (calledRef.current) return;

    // If we don't have a preload URL yet:
    if (!preloadSrc) {
      if (isUrlLoading) {
        // We are still loading the URL from DB, so we wait
        return;
      } else {
        // We finished loading and there is no URL to preload, so dismiss immediately
        calledRef.current = true;
        onPreloadedRef.current?.();
        return;
      }
    }

    const done = () => {
      if (calledRef.current) return;
      calledRef.current = true;
      onPreloadedRef.current?.();
    };

    const img = new Image();
    img.src = preloadSrc;
    if (img.complete) {
      // Already cached by browser
      done();
      return;
    }
    img.onload = done;
    img.onerror = done;

    // Safety: never block more than 5s
    const timer = setTimeout(done, 5000);
    return () => clearTimeout(timer);
  }, [preloadSrc, isUrlLoading]);

  return (
    <motion.div
      key="page-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] bg-[#FAF9F5] flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-8"
      >
        {/* Resort Name */}
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="uppercase tracking-[0.35em] text-[10px] text-[#A88C52] font-semibold mb-3"
          >
            Welcome to
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-3xl md:text-4xl tracking-tight text-[#2E3438] font-light"
          >
            The Vedic{" "}
            <span className="italic font-serif font-normal text-[#1B4C44]">Himalaya</span>{" "}
            Retreat
          </motion.h1>
        </div>

        {/* Loading bar */}
        <div className="w-36 h-[1.5px] bg-[#2E3438]/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#A88C52] to-[#C9A96E] rounded-full"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: "40%" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
