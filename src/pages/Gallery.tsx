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
  const galleryHeroBadge = getValue('gallery', 'gallery_hero_badge', 'OUR VISUAL STORY');

  let bentoImages: GalleryImage[] = [];
  try {
    const bentoImagesStr = getValue('home', 'bento_gallery_items', '[]');
    const parsedBento = bentoImagesStr ? JSON.parse(bentoImagesStr) : [];
    if (Array.isArray(parsedBento)) {
      bentoImages = parsedBento.map((item: any) => ({
        src: item.image,
        category: item.category || "Mountain Views",
        title: item.title || "",
        desc: item.description || item.desc || "",
        is_visible: item.is_visible !== false
      }));
    }
  } catch (e) {
    console.error("Failed to parse bento gallery images:", e);
  }

  const visibleImages = bentoImages.filter((img) => img.is_visible !== false);

  // 1. Get configured categories from database settings
  const categoriesStr = getValue('gallery', 'gallery_categories', 'Mountain Views, Rooms & Suites, Sacred Spaces, Food & Dining, Forest Trails, Mist & Ridges');
  const configuredCategories = categoriesStr.split(',').map((c: string) => c.trim()).filter(c => c && c !== "All");

  // 2. Extract active categories from visible images
  const activeCategories = Array.from(new Set(visibleImages.map(img => img.category).filter(Boolean)));

  // 3. Merge them, keeping order of configured categories first
  const mergedCategories = Array.from(new Set([...configuredCategories, ...activeCategories]));

  // 4. Ensure we only show categories that actually contain at least one visible image so tabs are never empty!
  const categories = ["All", ...mergedCategories.filter(cat => visibleImages.some(img => img.category?.trim() === cat.trim()))];

  const filteredImages = selectedCategory === "All" 
    ? visibleImages 
    : visibleImages.filter(img => img.category?.trim() === selectedCategory.trim());

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
          const mappedGalleryItems = filteredImages.map(img => {
            const rawTitle = img.title || "";
            const lowercaseTitle = rawTitle.toLowerCase();
            const isFileNameTitle = lowercaseTitle.includes('whatsapp') ||
                                    lowercaseTitle.includes('screenshot') ||
                                    lowercaseTitle.includes('uploaded') ||
                                    /\.(jpe?g|png|webp|gif|bmp)$/i.test(lowercaseTitle) ||
                                    /^[a-z0-9_-]+\d{4,}/i.test(lowercaseTitle);
            
            const isPlaceholderTitle = ["New Photo", "Visual Photo", "Untitled Card", "Retreat View", "Mountain Views", "Retreat Scene", "Nearby Attraction"].includes(rawTitle.trim()) || isFileNameTitle;
            const title = isPlaceholderTitle ? "" : rawTitle;

            const rawDesc = img.desc || "";
            const lowercaseDesc = rawDesc.toLowerCase();
            const isPlaceholderDesc = ["Description...", "Uploaded via bulk catalog"].includes(rawDesc.trim()) || 
                                      lowercaseDesc.includes('whatsapp') ||
                                      lowercaseDesc.includes('screenshot') ||
                                      lowercaseDesc.includes('uploaded') ||
                                      /\.(jpe?g|png|webp|gif|bmp)$/i.test(lowercaseDesc);
            const description = isPlaceholderDesc ? "" : rawDesc;

            return {
              image: img.src,
              title: title,
              category: img.category,
              description: description
            };
          });

          return (
            <BentoGallery 
              items={mappedGalleryItems} 
              theme="light"
              borderRadiusClass="rounded-xl"
            />
          );
        })()}

      </div>
    </div>
  );
}
