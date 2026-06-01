import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import PageLoader from "@/components/PageLoader";

interface GalleryImage {
  src: string;
  category: string;
  title: string;
  desc: string;
  is_visible?: boolean;
}

export default function Gallery() {
  const easePremium = [0.22, 1, 0.36, 1] as const;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { getValue, loading, content } = useContent();

  // Prevent flash of fallback text while CMS content loads
  if (loading && content.length === 0) return <PageLoader />;

  const galleryHeading = getValue('gallery', 'gallery_heading', 'Captured Stillness');
  const gallerySubheading = getValue('gallery', 'gallery_subheading', 'Take a slow, visual tour of our deodar-framed spaces, snow summits, and restorative pilgrimage amenities.');

  let dbImages: GalleryImage[] = [];
  try {
    const rawImagesStr = getValue('gallery', 'gallery_images', '[]');
    dbImages = rawImagesStr ? JSON.parse(rawImagesStr) : [];
  } catch (e) {
    console.error("Failed to parse gallery images:", e);
  }

  const defaultImages: GalleryImage[] = [
    {
      src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
      category: "Peaks & Vibe",
      title: "Chaukhamba Summits",
      desc: "Glacial snow peaks overlooking our open sunrise yoga deck."
    },
    {
      src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200",
      category: "Sanctuary Suites",
      title: "Luxury Mountain Suite",
      desc: "Cozy custom electric temperature beds lined with organic heavy wool blankets."
    },
    {
      src: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1200",
      category: "Spiritual Life",
      title: "The Slate Dining Pavilion",
      desc: "Pure organic thalis cooked over fresh timber and mountain logs."
    },
    {
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
      category: "Spiritual Life",
      title: "Himalayan Mandap Vows",
      desc: "Our cedar marriage lawns framed beautifully by pine forests and mountain fog."
    },
    {
      src: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80&w=1200",
      category: "Peaks & Vibe",
      title: "Guptkashi Dawn Mist",
      desc: "Ethereal blue morning fog hanging gracefully over our cedar pine cliffs."
    },
    {
      src: "https://images.unsplash.com/photo-1580977276076-ac4ccbec0680?auto=format&fit=crop&q=80&w=1200",
      category: "Sanctuary Suites",
      title: "Aura Bath & Spa Suite",
      desc: "Continuous organic hot water flows with cold slate stone tiles."
    },
    {
      src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1200",
      category: "Spiritual Life",
      title: "Restorative Herbal Sips",
      desc: "Hot immune-support ginger remedies upon custom arrival desks."
    },
    {
      src: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200",
      category: "Peaks & Vibe",
      title: "Sacred Temple Rays",
      desc: "Spiritual morning light pierces the traditional deodar woodwork in Guptkashi."
    }
  ];

  const galleryImages = (dbImages && dbImages.length > 0) ? dbImages : defaultImages;
  const visibleImages = galleryImages.filter((img) => img.is_visible !== false);

  const categories = ["All", "Peaks & Vibe", "Sanctuary Suites", "Spiritual Life"];

  const filteredImages = selectedCategory === "All" 
    ? visibleImages 
    : visibleImages.filter(img => img.category === selectedCategory);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(prev => (prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <div className="bg-[#FAF9F5] text-slate-charcoal pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        {/* Editorial Header */}
        <header className="mb-14 text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#1B4C44]/5 text-[#1B4C44] text-[10px] uppercase font-bold tracking-[0.25em] rounded-full border border-[#1B4C44]/10">
            <Sparkles size={11} className="text-[#A88C52]" />
            <span>THE SANCTUARY CHRONICLES</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-heading font-medium tracking-tight text-slate-charcoal leading-[1.1]">
            {galleryHeading}
          </h1>
          <p className="text-xs md:text-sm text-slate-charcoal/70 max-w-md mx-auto font-sans leading-relaxed">
            {gallerySubheading}
          </p>
        </header>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-[10.5px] uppercase font-bold tracking-[0.15em] transition-all duration-300 border cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#1B4C44] text-white border-[#1B4C44] shadow-md"
                  : "bg-white text-slate-charcoal/75 border-[#D8CBB8]/40 hover:border-[#1B4C44]/40 hover:text-[#1B4C44]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cinematic Bento Layout Grid - Desktop & Mobile */}
        <motion.div 
          layout 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[280px]"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, i) => {
              // Interspersed custom layout sizing
              let itemSpan = "col-span-1 row-span-1";
              if (i % 5 === 0) itemSpan = "col-span-2 row-span-2";
              else if (i % 4 === 1) itemSpan = "col-span-1 row-span-2";

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: easePremium }}
                  key={img.src}
                  onClick={() => setLightboxIndex(i)}
                  className={`relative group overflow-hidden bg-[#EFEAE1]/40 rounded-2xl border border-[#D8CBB8]/30 shadow-xs cursor-pointer select-none ${itemSpan}`}
                >
                  {/* Overlay shadow & title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex flex-col justify-end p-4 text-white">
                    <span className="text-[8px] uppercase tracking-widest text-[#D8CBB8] font-bold font-mono mb-1">{img.category}</span>
                    <h3 className="text-xs sm:text-sm font-heading font-bold text-white tracking-wide">{img.title}</h3>
                    <p className="text-[10px] text-white/80 leading-relaxed font-sans line-clamp-2 mt-1">{img.desc}</p>
                  </div>
                  
                  {/* Subtle static bottom label for mobile */}
                  <div className="absolute bottom-3 right-3 z-10 sm:hidden bg-black/45 p-1.5 rounded-lg border border-white/10 text-white">
                    <Maximize2 size={11} />
                  </div>

                  {/* High Quality Image */}
                  <img 
                    src={img.src} 
                    alt={img.title} 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-103 contrast-105" 
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxIndex(null)}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            >
              <button 
                onClick={() => setLightboxIndex(null)}
                className="absolute top-6 right-6 text-white/70 hover:text-white p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="relative max-w-4xl w-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                
                {/* Image display */}
                <div className="relative w-full aspect-video md:max-h-[70vh] flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black">
                  <img 
                    src={filteredImages[lightboxIndex].src} 
                    alt={filteredImages[lightboxIndex].title} 
                    className="max-w-full max-h-[70vh] object-contain rounded-xl select-none"
                  />
                  
                  {/* Navigation controls */}
                  <button 
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/85 hover:text-white rounded-full bg-black/50 border border-white/15 hover:bg-black/80 transition-colors cursor-pointer select-none"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button 
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/85 hover:text-white rounded-full bg-black/50 border border-white/15 hover:bg-black/80 transition-colors cursor-pointer select-none"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Subtitle & details label below image */}
                <div className="text-center text-white mt-5 max-w-lg space-y-1.5 px-4">
                  <span className="text-[9px] uppercase tracking-widest font-bold text-[#D8CBB8] font-mono">{filteredImages[lightboxIndex].category}</span>
                  <h4 className="text-lg font-heading tracking-wide font-medium">{filteredImages[lightboxIndex].title}</h4>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">{filteredImages[lightboxIndex].desc}</p>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
