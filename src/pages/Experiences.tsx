import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mountain, 
  Wind, 
  Sparkles, 
  Compass, 
  Flame, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  Camera,
  X
} from "lucide-react";
import { Footer } from "../components/layout/Footer";
import { useContent } from "@/hooks/useContent";
import PageLoader from "@/components/PageLoader";
import BentoGallery from "@/components/BentoGallery";

export default function Experiences() {
  const [current, setCurrent] = useState(0);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number | null>(null);

  const { getValue, loading, content } = useContent();

  // Prevent flash of fallback text while CMS content loads
  if (loading && content.length === 0) return <PageLoader />;

  const experiencesHeading = getValue('experiences', 'experiences_heading', 'Curated Journeys');
  const experiencesSubheading = getValue('experiences', 'experiences_subheading', 'Acclimatize in the Sacred Atmosphere');
  const experiencesImage = getValue('experiences', 'experiences_image', '');

  const experiencesSlideBadge = getValue('experiences', 'experiences_slide_badge', 'Activities & Comforts');

  const experiencesBentoTagline = getValue('experiences', 'experiences_bento_tagline', 'VISUAL ARCHIVE');
  const experiencesBentoHeading = getValue('experiences', 'experiences_bento_heading', 'Experience');
  const experiencesBentoHeadingItalic = getValue('experiences', 'experiences_bento_heading_italic', 'Gallery');

  const experiencesScenesTagline = getValue('experiences', 'experiences_scenes_tagline', 'RETREAT ARCHIVE');
  const experiencesScenesHeading = getValue('experiences', 'experiences_scenes_heading', 'Retreat');
  const experiencesScenesHeadingItalic = getValue('experiences', 'experiences_scenes_heading_italic', 'Scenes');
  const experiencesScenesDesc = getValue('experiences', 'experiences_scenes_desc', 'Real photographic glances of our pinewood interiors, high-altitude yoga shala, healthy vegetarian dining, and misty cedar surroundings. Click any image to expand.');

  const experiencesCtaBadge = getValue('experiences', 'experiences_cta_badge', 'Plan Your Trip');
  const experiencesCtaHeading = getValue('experiences', 'experiences_cta_heading', 'Book Your');
  const experiencesCtaHeadingItalic = getValue('experiences', 'experiences_cta_heading_italic', 'Himalayan Stay');
  const experiencesCtaDesc = getValue('experiences', 'experiences_cta_desc', 'Our retreat in Guptkashi features limited rooms to maintain a quiet atmosphere. Reserve your stay for the upcoming season.');
  const experiencesCtaBtnText = getValue('experiences', 'experiences_cta_btn_text', 'Confirm Your Reservation');
  const experiencesCtaBtnLink = getValue('experiences', 'experiences_cta_btn_link', '/rooms');

  const tourVisible = getValue('experiences', 'experiences_tour_visible', 'true') !== 'false';
  const galleryVisible = getValue('experiences', 'experiences_gallery_visible', 'true') !== 'false';

  let experienceSlides = [];
  try {
    experienceSlides = JSON.parse(getValue('experiences', 'experience_slides', '[]'));
  } catch (e) {}
  if (!experienceSlides || experienceSlides.length === 0) {
    experienceSlides = [
      {
        id: "yatra",
        category: "PILGRIMAGE LOGISTICS",
        title: "Pilgrimage Support",
        subtitle: "Sacred trails & custom local guiding",
        description: "Acclimatize comfortably in the sacred atmosphere of Guptkashi. We coordinate custom guided trail mappings, curate historic local temple walks, and handle localized vehicle coordination.",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=2000",
        icon: "Mountain",
      },
      {
        id: "yoga",
        category: "WELLNESS",
        title: "Yoga & Breathing",
        subtitle: "Morning sessions for mountain high altitudes",
        description: "Practice standard morning yoga and guided deep breathing with our instructors to help normalize breathing at high physical altitudes.",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=2000",
        icon: "Wind",
      },
      {
        id: "weddings",
        category: "EVENT VENUE",
        title: "Mountain Weddings",
        subtitle: "Custom local setups and catering",
        description: "Host your wedding against the mountain backdrop. We provide pine wood decorations, native Garhwali folk instrumental music, and organic vegetarian dining.",
        image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=2000",
        icon: "Sparkles",
      },
      {
        id: "village",
        category: "LOCAL TRIPS",
        title: "Guided Village Hikes",
        subtitle: "Local trails and pony excursions",
        description: "Trek through surrounding forest routes with a local resident, explore nearby mountain viewpoints on sturdily trained ponies, or walk through the historic village lanes.",
        image: "https://images.unsplash.com/photo-1566378268012-ea11aa6e7b46?auto=format&fit=crop&q=80&w=2000",
        icon: "Compass",
      },
      {
        id: "horseriding",
        category: "RECREATION",
        title: "Horse Riding",
        subtitle: "Scenic mountain paths on sturdy ponies",
        description: "Explore the surrounding alpine slopes, tall forests, and peaceful valley viewports on sturdily trained mountain horses with a dedicated handler.",
        image: "",
        icon: "Compass",
      },
      {
        id: "cycling",
        category: "LOCAL TRIPS",
        title: "Cycling on Village Roads",
        subtitle: "Pedal through historic pine forest paths",
        description: "Rent one of our premium hybrid bicycles and explore the winding, quiet paved roads of Village Dewar, feeling the fresh cedar breeze.",
        image: "",
        icon: "Compass",
      },
      {
        id: "bonfire",
        category: "RECREATION",
        title: "Evening Bonfire",
        subtitle: "Outdoor seating around a real mountain fire",
        description: "Relax in our open-air courtyard around a slow-burning pinewood fire. Drink hot ginger tea alongside fellow travelers under clear night vistas.",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=2000",
        icon: "Flame",
      },
      {
        id: "cooking",
        category: "CULINARY",
        title: "Traditional Cooking Class",
        subtitle: "Learn local food preparation",
        description: "Discover the principles of Ayurvedic nutrition and healthy cooking. Learn how to cook with clay pots, ironware, and locally-sourced terraced ingredients.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=2000",
        icon: "Utensils",
      }
    ];
  }
  const visibleSlides = experienceSlides.filter((s: any) => s.is_visible !== false);

  let experienceGallery = [];
  try {
    experienceGallery = JSON.parse(getValue('experiences', 'experience_gallery', '[]'));
  } catch (e) {}
  if (!experienceGallery || experienceGallery.length === 0) {
    experienceGallery = [
      {
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200",
        caption: "Cozy Pinewood Cottage Bedroom"
      },
      {
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
        caption: "Misty Sunrise on Chaukhamba Peaks"
      },
      {
        url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200",
        caption: "Hot House-Sourced Organic Vegetarian Lunch"
      },
      {
        url: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200",
        caption: "Outer Glamping Deck Encased in Pine Woods"
      },
      {
        url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
        caption: "Panoramic Sunrise High Altitude Yoga Shala"
      },
      {
        url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200",
        caption: "Private Cedar Walking Trails Surrounding Retreat"
      },
      {
        url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=1200",
        caption: "Hand-Brewed Local Ginger and Basil Tea"
      },
      {
        url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=1200",
        caption: "Cold Pinewood Clear Sky Stargazing"
      }
    ];
  }
  const visiblePhotos = experienceGallery.filter((p: any) => p.is_visible !== false);

  const selectedPhoto = selectedPhotoIdx !== null ? visiblePhotos[selectedPhotoIdx] : null;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIdx !== null) {
      setSelectedPhotoIdx((selectedPhotoIdx + 1) % visiblePhotos.length);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIdx !== null) {
      setSelectedPhotoIdx((selectedPhotoIdx - 1 + visiblePhotos.length) % visiblePhotos.length);
    }
  };

  const totalSlides = visibleSlides.length + (galleryVisible ? 1 : 0);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  const onGalleryItemClick = (idx: number | null) => {
    if (idx !== null) {
      setCurrent(idx);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isFinalScreen = !tourVisible || current === visibleSlides.length;

  return (
    <div className={`relative w-full bg-[#0B1714] text-[#FAF9F5] font-sans selection:bg-[#A88C52] selection:text-[#0B1714] ${
      isFinalScreen ? "min-h-screen overflow-y-auto" : "h-[100dvh] overflow-hidden"
    }`}>
      
      {/* Background slide renderer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <AnimatePresence mode="wait">
          {!isFinalScreen && visibleSlides[current] ? (
            <motion.div
              key={visibleSlides[current].id}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${visibleSlides[current].image}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B1714]/95 via-[#0B1714]/50 to-[#0B1714]/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1714] via-transparent to-[#0B1714]/60" />
            </motion.div>
          ) : (
            // Final slide ambient deep textured backdrop
            <motion.div
              key="final-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-b from-[#0B1714] to-[#122A22]"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Slide mode */}
      {!isFinalScreen && visibleSlides[current] ? (
        <motion.div 
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="relative z-10 h-full w-full flex items-center cursor-grab active:cursor-grabbing"
        >
          <div className="container mx-auto px-6 sm:px-12 md:px-20 lg:px-32 max-w-7xl h-full flex flex-col justify-between py-24">
            
            {/* Header info */}
            <div className="flex justify-between items-center w-full">
              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-extrabold text-[#D8CBB8] block">
                  {visibleSlides[current].category}
                </span>
                <div className="h-0.5 w-12 bg-[#A88C52]/60 animate-pulse" />
              </div>

              <div className="text-right">
                <span className="text-[11px] sm:text-xs font-mono tracking-widest text-[#FAF9F5]/50">
                  {(current + 1).toString().padStart(2, "0")} / {totalSlides.toString().padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Core Slide Content */}
            <div className="my-auto max-w-xl space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`slide-${visibleSlides[current].id}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-3"
                >
                  <p className="text-[11px] font-bold text-[#A88C52] uppercase tracking-[0.2em]">
                    {experiencesSlideBadge}
                  </p>
                  
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#FAF9F5] leading-tight tracking-wide font-normal">
                    {visibleSlides[current].title}
                  </h1>
                  
                  <p className="text-sm sm:text-base font-serif text-[#E5D7C3] italic font-light tracking-wide">
                    {visibleSlides[current].subtitle}
                  </p>

                  <div className="max-w-md pt-2">
                    <p className="text-xs sm:text-sm text-[#FAF9F5]/90 leading-relaxed font-sans text-left text-pretty drop-shadow-md">
                      {visibleSlides[current].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center gap-6">
              
              {/* Slide dots */}
              <div className="flex gap-2">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${
                      current === i ? "w-8 bg-[#A88C52]" : "w-1.5 bg-[#FAF9F5]/25 hover:bg-[#FAF9F5]/55"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Navigation arrows */}
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full border border-white/10 hover:border-[#A88C52] text-[#FAF9F5] hover:bg-white/5 flex items-center justify-center transition-all duration-300 cursor-pointer"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full border border-white/10 hover:border-[#A88C52] text-[#FAF9F5] hover:bg-white/5 flex items-center justify-center transition-all duration-300 cursor-pointer"
                  aria-label="Next Slide"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      ) : (
        // Final Screen: Bento Masonry Gallery of realistic experiences & direct CTA, followed by Footer at the bottom.
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 w-full flex flex-col pt-36"
        >
          {/* Main Gallery Container */}
          <div className="container mx-auto px-6 sm:px-12 md:px-20 lg:px-32 max-w-7xl mb-24">
            
            {/* Header section matches Home journal header layout */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-8 mb-16 gap-4">
              <div className="space-y-3">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-extrabold text-[#A88C52] block">
                  {experiencesBentoTagline}
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif text-[#FAF9F5] font-light leading-none">
                  {experiencesBentoHeading} <span className="italic font-normal text-[#E5D7C3]">{experiencesBentoHeadingItalic}</span>
                </h2>
              </div>
              
              {tourVisible && (
                <button 
                  onClick={() => setCurrent(0)}
                  className="text-xs font-bold uppercase tracking-widest text-[#A88C52] hover:text-[#FAF9F5] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  Back to Slide Tour <ChevronRight size={14} />
                </button>
              )}
            </div>

            {/* Premium Bento Masonry Grid matching Home exactly */}
            {visibleSlides.length > 0 && (() => {
              const bentoOrder = [0, 1, 2, 4, 3, 5];
              const mappedBentoItems = bentoOrder.map((slideIdx) => {
                const slide = visibleSlides[slideIdx];
                if (!slide) return null;
                return {
                  image: slide.image,
                  title: slide.title,
                  category: slide.category || `Slide ${(slideIdx + 1).toString().padStart(2, "0")}`,
                  originalIndex: slideIdx
                };
              }).filter(Boolean) as any[];

              return (
                <div className="mb-24">
                  <BentoGallery 
                    items={mappedBentoItems} 
                    onItemClick={(index) => {
                      const originalIndex = mappedBentoItems[index]?.originalIndex;
                      if (originalIndex !== undefined) {
                        onGalleryItemClick(originalIndex);
                      }
                    }} 
                    theme="dark"
                    borderRadiusClass="rounded-xl"
                  />
                </div>
              );
            })()}

            {/* Premium Photographic Image Gallery Section */}
            {galleryVisible && visiblePhotos.length > 0 && (
              <div className="mb-24">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 mb-10 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-extrabold text-[#A88C52] flex items-center gap-2">
                      <Camera size={12} /> {experiencesScenesTagline}
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-serif text-[#FAF9F5] font-light">
                      {experiencesScenesHeading} <span className="italic font-normal text-[#E5D7C3]">{experiencesScenesHeadingItalic}</span>
                    </h3>
                  </div>
                  <p className="text-xs text-[#FAF9F5]/60 max-w-sm font-sans leading-relaxed">
                    {experiencesScenesDesc}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {visiblePhotos.map((photo: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      onClick={() => setSelectedPhotoIdx(index)}
                      className="relative aspect-[4/3] group overflow-hidden rounded-xl bg-[#122A22]/20 border border-white/5 cursor-pointer hover:border-[#A88C52]/30"
                    >
                      <img 
                        src={photo.url} 
                        alt={photo.caption}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Dark gradient on hover to showcase the caption clearly */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-left">
                        <p className="text-[10px] sm:text-xs font-sans text-[#FAF9F5] font-medium tracking-wide">
                          {photo.caption}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Magnificent closing Call To Action */}
            <div className="relative rounded-2xl bg-gradient-to-r from-[#1B4C44]/40 to-[#122A22]/60 border border-[#FAF9F5]/10 p-8 sm:p-12 md:p-16 text-center max-w-4xl mx-auto overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#A88C52_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05]" />
              
              <div className="relative z-10 space-y-6">
                <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-[#A88C52] bg-[#A88C52]/10 px-4 py-1.5 rounded-full inline-block">
                  {experiencesCtaBadge}
                </span>
                
                <h3 className="text-3xl sm:text-4xl font-serif text-[#FAF9F5] font-light tracking-wide leading-tight">
                  {experiencesCtaHeading} <span className="italic font-normal text-[#E5D7C3]">{experiencesCtaHeadingItalic}</span>
                </h3>
                
                <p className="text-xs sm:text-sm text-[#FAF9F5]/70 max-w-md mx-auto leading-relaxed font-sans">
                  {experiencesCtaDesc}
                </p>
                
                <div className="pt-2">
                  <Link to={experiencesCtaBtnLink}>
                    <button className="h-12 px-10 bg-[#FAF9F5] hover:bg-[#A88C52] text-[#0B1714] font-extrabold hover:text-[#FAF9F5] text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-xl cursor-pointer">
                      {experiencesCtaBtnText}
                    </button>
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Smooth, direct footer access at the very bottom */}
          <div className="w-full relative mt-auto border-t border-white/10">
            <Footer />
          </div>

        </motion.div>
      )}

      {/* Photo Lightbox Modal Overlay */}
      <AnimatePresence>
        {selectedPhotoIdx !== null && selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm cursor-zoom-out"
            onClick={() => setSelectedPhotoIdx(null)}
          >
            <button 
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer z-50"
              aria-label="Close Lightbox"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhotoIdx(null);
              }}
            >
              <X size={20} />
            </button>

            {/* Slider navigation buttons */}
            <button 
              className="absolute left-4 sm:left-10 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white hover:text-[#A88C52] transition-all cursor-pointer z-50 flex items-center justify-center shadow-lg border border-white/5"
              aria-label="Previous Photo"
              onClick={handlePrevPhoto}
            >
              <ChevronLeft size={24} />
            </button>

            <button 
              className="absolute right-4 sm:right-10 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white hover:text-[#A88C52] transition-all cursor-pointer z-50 flex items-center justify-center shadow-lg border border-white/5"
              aria-label="Next Photo"
              onClick={handleNextPhoto}
            >
              <ChevronRight size={24} />
            </button>
            
            <div 
              className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={selectedPhotoIdx}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="max-w-full max-h-[75vh] object-contain rounded-xl border border-white/10"
                referrerPolicy="no-referrer"
              />
              <p className="font-serif text-[#FAF9F5] text-center italic tracking-wide text-sm sm:text-base px-4">
                {selectedPhoto.caption}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
