import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export interface BentoItem {
  image: string;
  title: string;
  category?: string;
  description?: string;
}

interface BentoGalleryProps {
  items: BentoItem[];
  gap?: number; // gap in pixels
  borderRadiusClass?: string; // tailwind border radius class
  onItemClick?: (index: number) => void;
  getItemSpan?: (index: number) => string;
  theme?: "light" | "dark";
  enableLightbox?: boolean;
}

const defaultGetItemSpan = (index: number) => {
  const mod = index % 5;
  if (mod === 0) return "col-span-2 row-span-2";
  if (mod === 3) return "col-span-1 row-span-2";
  if (mod === 4) return "col-span-1 md:col-span-2 row-span-1";
  return "col-span-1 row-span-1";
};

export default function BentoGallery({
  items,
  gap = 4, // gap in tailwind spacing or custom gaps
  borderRadiusClass = "rounded-2xl",
  onItemClick,
  getItemSpan = defaultGetItemSpan,
  theme = "dark",
  enableLightbox = true
}: BentoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    if (onItemClick) {
      onItemClick(index);
    } else if (enableLightbox) {
      setLightboxIndex(index);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(prev => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape") {
        setLightboxIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  const easePremium = [0.22, 1, 0.36, 1] as const;

  return (
    <>
      <div 
        className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 auto-rows-[120px] md:auto-rows-[250px] w-full"
      >
        {items.map((item, index) => {
          const itemSpan = getItemSpan(index);
          const isDarkTheme = theme === "dark";

          return (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              key={item.image + index}
              onClick={() => handleCardClick(index)}
              className={`group relative overflow-hidden bg-stone-sand/20 border border-[#D8CBB8]/30 cursor-pointer select-none ${borderRadiusClass} ${itemSpan}`}
            >
              {/* Premium Scale-Up Wrapper inside card */}
              <div className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] overflow-hidden relative">
                {/* High Quality Image with secondary zoom on hover */}
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] contrast-105" 
                  referrerPolicy="no-referrer"
                />

                {/* Glassmorphic/Gradient info panel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-500 z-10 flex flex-col justify-end p-4 text-white">
                  {item.category && (
                    <span className="text-[8px] uppercase tracking-widest text-[#D8CBB8] font-bold font-mono mb-1">
                      {item.category}
                    </span>
                  )}
                  <h4 className="text-xs sm:text-sm font-heading font-medium tracking-wide text-white">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-[10px] text-white/80 leading-relaxed font-sans line-clamp-2 mt-1 hidden sm:block">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Subtle Maximize icon for mobile */}
                <div className="absolute bottom-3 right-3 z-20 sm:hidden bg-black/45 p-1.5 rounded-lg border border-white/10 text-white">
                  <Maximize2 size={11} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Premium Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && items[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            {/* Close button */}
            <button 
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-105 z-50"
              aria-label="Close Lightbox"
            >
              <X size={20} />
            </button>

            <div 
              className="relative max-w-4xl w-full flex flex-col items-center justify-center" 
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image display viewport with drag swiping */}
              <div className="relative w-full aspect-video md:max-h-[70vh] flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40">
                <motion.img 
                  key={lightboxIndex}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 180 }}
                  src={items[lightboxIndex].image} 
                  alt={items[lightboxIndex].title} 
                  className="max-w-full max-h-[70vh] object-contain rounded-xl select-none"
                  referrerPolicy="no-referrer"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, info) => {
                    const swipeThreshold = 50;
                    if (info.offset.x < -swipeThreshold) {
                      handleNext();
                    } else if (info.offset.x > swipeThreshold) {
                      handlePrev();
                    }
                  }}
                />
                
                {/* Navigation controls */}
                <button 
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white rounded-full bg-black/40 border border-white/10 hover:border-white/30 hover:bg-black/75 transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 select-none"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>

                <button 
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white rounded-full bg-black/40 border border-white/10 hover:border-white/30 hover:bg-black/75 transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 select-none"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Caption details underneath image */}
              <div className="text-center text-white mt-5 max-w-lg space-y-1 px-4">
                {items[lightboxIndex].category && (
                  <span className="text-[9px] uppercase tracking-widest font-bold text-[#D8CBB8] font-mono">
                    {items[lightboxIndex].category}
                  </span>
                )}
                <h4 className="text-base font-heading tracking-wide font-medium">
                  {items[lightboxIndex].title}
                </h4>
                {items[lightboxIndex].description && (
                  <p className="text-xs text-stone-300 leading-relaxed font-sans font-light">
                    {items[lightboxIndex].description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
