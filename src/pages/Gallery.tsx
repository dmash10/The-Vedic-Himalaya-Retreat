import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import PageLoader from "@/components/PageLoader";
import BentoGallery from "@/components/BentoGallery";

interface GalleryImage {
  src: string;
  category: string;
  title: string;
  desc: string;
  is_visible?: boolean;
}

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { getValue, loading, content } = useContent();

  // Prevent flash of fallback text while CMS content loads
  if (loading && content.length === 0) return <PageLoader />;

  const galleryHeading = getValue('gallery', 'gallery_heading', 'Captured Stillness');
  const gallerySubheading = getValue('gallery', 'gallery_subheading', 'Take a slow, visual tour of our deodar-framed spaces, snow summits, and restorative pilgrimage amenities.');
  const galleryHeroVisible = getValue('gallery', 'gallery_hero_visible', 'true') !== 'false';
  const galleryHeroBadge = getValue('gallery', 'gallery_hero_badge', 'THE SANCTUARY CHRONICLES');

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

  const categoriesStr = getValue('gallery', 'gallery_categories', 'Peaks & Vibe, Sanctuary Suites, Spiritual Life');
  const categories = ["All", ...categoriesStr.split(',').map((c: string) => c.trim()).filter(c => c && c !== "All")];

  const filteredImages = selectedCategory === "All" 
    ? visibleImages 
    : visibleImages.filter(img => img.category === selectedCategory);

  return (
    <div className="bg-[#FAF9F5] text-slate-charcoal pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        {/* Editorial Header */}
        {galleryHeroVisible && (
          <header className="mb-14 text-center space-y-5 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#1B4C44]/5 text-[#1B4C44] text-[10px] uppercase font-bold tracking-[0.25em] rounded-full border border-[#1B4C44]/10">
              <Sparkles size={11} className="text-[#A88C52]" />
              <span>{galleryHeroBadge}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-medium tracking-tight text-slate-charcoal leading-[1.1]">
              {galleryHeading}
            </h1>
            <p className="text-xs md:text-sm text-slate-charcoal/70 max-w-md mx-auto font-sans leading-relaxed">
              {gallerySubheading}
            </p>
          </header>
        )}

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
        {(() => {
          const mappedGalleryItems = filteredImages.map(img => ({
            image: img.src,
            title: img.title,
            category: img.category,
            description: img.desc
          }));

          const galleryGetItemSpan = (i: number) => {
            if (i % 5 === 0) return "col-span-2 row-span-2";
            if (i % 4 === 1) return "col-span-1 row-span-2";
            return "col-span-1 row-span-1";
          };

          return (
            <BentoGallery 
              items={mappedGalleryItems} 
              getItemSpan={galleryGetItemSpan}
              theme="light"
              borderRadiusClass="rounded-2xl"
            />
          );
        })()}

      </div>
    </div>
  );
}
