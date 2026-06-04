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
  readyToLoad?: boolean;
}

const defaultGetItemSpan = (index: number) => {
  const mod = index % 6;
  if (mod === 0) return "col-span-1 row-span-2 md:col-span-1 md:row-span-2";
  if (mod === 1) return "col-span-1 row-span-1 md:col-span-2 md:row-span-1";
  if (mod === 2) return "col-span-1 row-span-1 md:col-span-1 md:row-span-1";
  if (mod === 3) return "col-span-1 row-span-1 md:col-span-1 md:row-span-1";
  if (mod === 4) return "col-span-2 row-span-1 md:col-span-3 md:row-span-1";
  return "col-span-1 row-span-1 md:col-span-1 md:row-span-1";
};

export default function BentoGallery({
  items,
  gap = 4, // gap in tailwind spacing or custom gaps
  borderRadiusClass = "rounded-xl",
  onItemClick,
  getItemSpan = defaultGetItemSpan,
  theme = "dark",
  enableLightbox = true,
  readyToLoad = true
}: BentoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});

  const handleCardClick = (index: number) => {
    if (onItemClick) {
      onItemClick(index);
    } else if (enableLightbox) {
      setLightboxIndex(index);
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setIsZoomed(false);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsZoomed(false);
    if (lightboxIndex !== null) {
      setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsZoomed(false);
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
        closeLightbox();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  const easePremium = [0.22, 1, 0.36, 1] as const;

  return (
    <>
      <div 
        className="grid grid-cols-2 gap-3 w-full auto-rows-[140px] xs:auto-rows-[185px] grid-flow-dense md:flex md:flex-wrap md:gap-2 md:justify-center"
      >
        {items.map((item, index) => {
          const isDarkTheme = theme === "dark";
          const imgKey = `${item.image}-${index}`;
          const isLoaded = loadedMap[imgKey];

          return (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              key={item.image + index}
              onClick={() => handleCardClick(index)}
              className={`w-full h-full md:w-auto md:h-[260px] md:flex-grow relative overflow-hidden bg-stone-sand/20 cursor-pointer select-none ${borderRadiusClass} group ${getItemSpan(index)}`}
              style={{ flexBasis: "auto" }}
            >
              {/* Premium Scale-Up Wrapper inside card */}
              <div className={`w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:scale-[1.03] overflow-hidden relative ${borderRadiusClass}`}>
                {/* Shimmering Skeleton Loader */}
                {!isLoaded && (
                  <div className="absolute inset-0 bg-[#EFEAE1]/25 dark:bg-white/5 animate-pulse z-10" />
                )}
                
                {/* High Quality Image with secondary zoom on hover */}
                <img 
                  src={readyToLoad ? item.image : ""} 
                  alt={item.title} 
                  onLoad={() => setLoadedMap(prev => ({ ...prev, [imgKey]: true }))}
                  className={`w-full h-full md:h-full md:w-auto md:min-w-full object-cover transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:scale-[1.05] contrast-105 ${borderRadiusClass} ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} 
                  referrerPolicy="no-referrer"
                />

                {/* Subtle Grain/Noise Overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay z-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                  }}
                />

                {/* Glassmorphic/Gradient info panel - reveals with premium slide-up transition on hover only */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10 flex flex-col justify-end p-4 text-white">
                  <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    {item.category && (
                      <span className="text-[8px] uppercase tracking-widest text-[#D8CBB8] font-bold font-mono mb-1 block">
                        {item.category}
                      </span>
                    )}
                    {item.title && item.title.trim() !== "" && (
                      <h4 className="text-xs sm:text-sm font-heading font-medium tracking-wide text-white">
                        {item.title}
                      </h4>
                    )}
                    {item.description && item.description.trim() !== "" && (
                      <p className="text-[10px] text-white/80 leading-relaxed font-sans line-clamp-2 mt-1 hidden sm:block">
                        {item.description}
                      </p>
                    )}
                  </div>
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
            onClick={closeLightbox}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            {/* Close button */}
            <button 
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer md:hover:scale-105 z-50"
              aria-label="Close Lightbox"
            >
              <X size={20} />
            </button>

            <div 
              className="relative max-w-4xl w-full flex flex-col items-center justify-center" 
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image display viewport with drag swiping */}
              <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[65vh] flex items-center justify-center overflow-hidden">
                <motion.img 
                  key={lightboxIndex}
                  initial={{ opacity: 0.3 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isZoomed ? 1.5 : 1
                  }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  src={items[lightboxIndex].image} 
                  alt={items[lightboxIndex].title} 
                  className={`max-w-full max-h-full object-contain rounded-xl select-none ${
                    isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                  }`}
                  referrerPolicy="no-referrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed(!isZoomed);
                  }}
                  drag={isZoomed ? false : "x"}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, info) => {
                    if (isZoomed) return;
                    const swipeThreshold = 50;
                    if (info.offset.x < -swipeThreshold) {
                      handleNext();
                    } else if (info.offset.x > swipeThreshold) {
                      handlePrev();
                    }
                  }}
                />
              </div>

              {/* Navigation controls - Outside the image div so they stay fixed relative to viewport */}
              <button 
                onClick={handlePrev}
                className="absolute left-2 md:-left-16 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white rounded-full bg-black/40 border border-white/10 hover:border-white/30 hover:bg-black/75 transition-all duration-300 cursor-pointer md:hover:scale-110 active:scale-95 select-none z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              <button 
                onClick={handleNext}
                className="absolute right-2 md:-right-16 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white rounded-full bg-black/40 border border-white/10 hover:border-white/30 hover:bg-black/75 transition-all duration-300 cursor-pointer md:hover:scale-110 active:scale-95 select-none z-10"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>

              {/* Caption details underneath image with stable height container */}
              <div className="h-[100px] sm:h-[120px] flex items-center justify-center mt-5 w-full">
                <motion.div
                  key={lightboxIndex}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="text-center text-white max-w-lg space-y-2 px-4"
                >
                  {items[lightboxIndex].category && (
                    <span className="text-[9px] uppercase tracking-widest font-bold text-[#D8CBB8] font-mono block">
                      {items[lightboxIndex].category}
                    </span>
                  )}
                  {items[lightboxIndex].title && items[lightboxIndex].title.trim() !== "" && (
                    <h4 className="text-base font-heading tracking-wide font-medium">
                      {items[lightboxIndex].title}
                    </h4>
                  )}
                  {items[lightboxIndex].description && items[lightboxIndex].description.trim() !== "" && (
                    <p className="text-xs text-stone-300 leading-relaxed font-sans font-light line-clamp-2 md:line-clamp-none">
                      {items[lightboxIndex].description}
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
