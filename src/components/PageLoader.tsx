import { motion } from "motion/react";
import { Leaf } from "lucide-react";

/**
 * A premium full-page loading screen shown while CMS content is being fetched.
 * Prevents the flash of fallback/default text that appears before Supabase data loads.
 */
export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#FAF9F5] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-6"
      >
        {/* Animated leaf icon */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Leaf className="h-8 w-8 text-[#1B4C44]" strokeWidth={1.5} />
        </motion.div>

        {/* Pulsing loading bar */}
        <div className="w-32 h-[2px] bg-stone-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#1B4C44] rounded-full"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: "50%" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
