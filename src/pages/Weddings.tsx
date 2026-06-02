import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { Users, UtensilsCrossed, Key, Sparkles, Heart, ChevronLeft, ChevronRight, Calendar, Compass, MapPin, Wine } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import PageLoader from "@/components/PageLoader";

interface WeddingOfferingCardProps {
  key?: string;
  offer: any;
  idx: number;
  total: number;
  scrollYProgress: any;
  isMobile: boolean;
}

const getWeddingTransformParams = (idx: number, total: number) => {
  if (total <= 1) {
    return {
      inputs: [0, 1],
      scale: [1, 1],
      y: ["0vh", "0vh"],
      opacity: [1, 1],
      rotate: [0, 0],
      rotateX: [0, 0],
      z: [0, 0]
    };
  }

  const step = 1.0 / (total - 1);
  const inputs: number[] = [];
  const scale: number[] = [];
  const y: string[] = [];
  const opacity: number[] = [];
  const rotate: number[] = [];
  const rotateX: number[] = [];
  const z: number[] = [];

  const initialScale = 1.0 - idx * 0.07;
  const baseRotate = idx % 2 === 0 ? -3.5 - (idx * 0.5) : 3.5 + (idx * 0.5);

  for (let k = 0; k < total - 1; k++) {
    const start = k * step;
    inputs.push(start);
    inputs.push(start + step * 0.3);
    inputs.push(start + step * 0.9);
  }
  inputs.push(1.0);

  const uniqueInputs = Array.from(new Set(inputs)).sort((a, b) => a - b);
  const clampedInputs = uniqueInputs.map(v => Math.max(0, Math.min(1, v)));

  clampedInputs.forEach(progress => {
    let currentY = "0vh";
    let currentScale = initialScale;
    let currentRotate = baseRotate;
    let currentOpacity = 1.0;
    let currentRotateX = 0;
    let currentZ = 0;

    if (idx < total - 1) {
      const activeStart = idx * step;
      const slideStart = activeStart + step * 0.3;
      const slideEnd = activeStart + step * 0.9;

      if (progress <= slideStart) {
        currentY = "0vh";
        currentRotate = baseRotate;
        currentRotateX = 0;
        currentZ = 0;
      } else if (progress >= slideEnd) {
        currentY = "-120vh";
        currentRotate = idx % 2 === 0 ? -12 : 12;
        currentRotateX = 25;
        currentZ = -80;
      } else {
        const threshold = slideStart + (slideEnd - slideStart) / 2;
        currentY = progress <= threshold ? "0vh" : "-120vh";
        currentRotate = progress <= threshold ? baseRotate : (idx % 2 === 0 ? -12 : 12);
        const ratio = (progress - slideStart) / (slideEnd - slideStart);
        currentRotateX = ratio * 25;
        currentZ = ratio * -80;
      }
    } else {
      currentY = "0vh";
      currentRotate = baseRotate;
      currentRotateX = 0;
      currentZ = 0;
    }

    let activeOffsetCount = 0;
    for (let k = 0; k < idx; k++) {
      const cardSlideEnd = k * step + step * 0.9;
      if (progress >= cardSlideEnd) {
        activeOffsetCount++;
      }
    }
    currentScale = initialScale + activeOffsetCount * 0.07;

    if (idx < total - 1) {
      const activeStart = idx * step;
      const slideStart = activeStart + step * 0.3;
      if (progress >= slideStart) {
        currentScale = 1.08;
      }
    }

    // Adjust rotation for underlying cards as top cards fly away
    if (progress < idx * step) {
      const currentActiveStep = Math.floor(progress / step);
      const stepProgress = (progress - currentActiveStep * step) / step;
      if (stepProgress > 0.3 && stepProgress < 0.9) {
        currentRotate = baseRotate - (idx - currentActiveStep) * 0.5;
      }
    }

    y.push(currentY);
    scale.push(currentScale);
    rotate.push(currentRotate);
    opacity.push(currentOpacity);
    rotateX.push(currentRotateX);
    z.push(currentZ);
  });

  return {
    inputs: clampedInputs,
    scale,
    y,
    opacity,
    rotate,
    rotateX,
    z
  };
};

function WeddingOfferingCard({ offer, idx, total, scrollYProgress, isMobile }: WeddingOfferingCardProps) {
  const params = getWeddingTransformParams(idx, total);
  
  const scale = useTransform(scrollYProgress, params.inputs, params.scale);
  const y = useTransform(scrollYProgress, params.inputs, params.y);
  const opacity = useTransform(scrollYProgress, params.inputs, params.opacity);
  const rotate = useTransform(scrollYProgress, params.inputs, params.rotate);
  const rotateX = useTransform(scrollYProgress, params.inputs, isMobile ? params.rotateX.map(() => 0) : params.rotateX);
  const z = useTransform(scrollYProgress, params.inputs, isMobile ? params.z.map(() => 0) : params.z);
  
  const imageScale = useTransform(scrollYProgress, [0, 1], isMobile ? [1.0, 1.0] : [1.1, 1.0]);

  return (
    <motion.div 
      style={{ 
        scale, 
        y,
        opacity,
        rotate,
        rotateX,
        z,
        transformOrigin: isMobile ? "center center" : "bottom center",
        zIndex: total - idx,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transformStyle: isMobile ? "flat" : "preserve-3d",
        WebkitTransformStyle: isMobile ? "flat" : "preserve-3d",
        willChange: "transform, opacity"
      }}
      className={`absolute inset-0 rounded-[1.6rem] sm:rounded-[2.2rem] border border-[#D8CBB8]/30 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden ${offer.bgClass} ${offer.textClass} flex flex-col md:flex-row p-3.5 sm:p-5 lg:p-7 gap-3 sm:gap-6`}
    >
      {/* Subtle glamorous glint texture overlay for light ray highlights */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.012] to-white/[0.03] pointer-events-none" />

      {/* Left Details column with big design aesthetics and reduced, readable, high-end copy */}
      <div className="flex-1 md:w-1/2 flex flex-col justify-between py-1 xs:py-2 md:py-3 px-1 md:px-3 z-10 text-left font-sans">
        <div>
          <span className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold tracking-tight opacity-20 block">
            {offer.num}
          </span>
          <span className="text-[8px] sm:text-[9px] tracking-[0.2em] font-mono uppercase font-bold mt-1 opacity-65 block">
            {offer.badge}
          </span>
        </div>

        {/* Dynamic, clean, spacious text placement */}
        <div className="my-auto py-1 sm:py-3 space-y-1.5 sm:space-y-3">
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-serif font-normal tracking-wide leading-tight">
            {offer.title}
          </h3>
          <p className="text-[11px] sm:text-sm opacity-90 leading-relaxed font-sans font-light max-w-sm">
            {offer.description}
          </p>
        </div>


      </div>

      {/* Right Visual nesting layout representing a "card inside a card" holding the illustration */}
      <div className="flex-1 md:w-1/2 p-1 sm:p-2 bg-white/10 rounded-[1.3rem] sm:rounded-[1.8rem] border border-white/10 overflow-hidden relative group h-36 xs:h-44 sm:h-52 md:h-auto min-h-[140px] md:min-h-0">
        <div className="w-full h-full rounded-[1rem] sm:rounded-[1.3rem] overflow-hidden relative">
          <motion.img 
            src={offer.image} 
            alt={offer.title} 
            className="absolute inset-0 w-full h-full object-cover"
            style={{ scale: imageScale }}
            referrerPolicy="no-referrer"
          />
          {/* Gentle overlay gradient to soften image edges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Weddings() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const easePremium = [0.22, 1, 0.36, 1] as const;
  const { getValue, loading, content } = useContent();

  const weddingsHeading = getValue('weddings', 'weddings_heading', 'Destination Weddings');
  const weddingsSubheading = getValue('weddings', 'weddings_subheading', 'Sacred Celebrations in the Himalayas');
  const weddingsImage = getValue('weddings', 'weddings_image', '');
  const weddingsHeroBadge = getValue('weddings', 'weddings_hero_badge', 'SACRED WEDDINGS & CELEBRATIONS');
  const weddingsHeroDesc = getValue('weddings', 'weddings_hero_desc', '');
  const weddingsStoryTitle = getValue('weddings', 'weddings_story_title', 'Ancestral Purity');
  const weddingsStorySubtitle = getValue('weddings', 'weddings_story_subtitle', 'In Sacred Commemoration');
  const weddingsStoryDesc = getValue('weddings', 'weddings_story_desc', 'Take part in customizable celebratory layouts where the alpine air remains whispery and crisp. Let our stone-hearth specialists and organic culinary designers assemble beautiful tables decorated exclusively with wild mountain flowers.');

  const weddingsStoryScript = getValue('weddings', 'weddings_story_script', 'Himalayan Pure Blessings');
  const weddingsStoryHeading = getValue('weddings', 'weddings_story_heading', 'Intimate, Cinematic');
  const weddingsStoryHeadingItalic = getValue('weddings', 'weddings_story_heading_italic', '&');
  const weddingsStorySubheading = getValue('weddings', 'weddings_story_subheading', 'Unforgettable');
  const weddingsStoryParagraph = getValue('weddings', 'weddings_story_paragraph', 'From beautiful pre-marriage morning rituals on our mountain-sky deodar terraces to customized wedding lawns set before a majestic valley backdrop, The Vedic Himalaya Retreat coordinates an exceptional blend of premium hospitality, local Garhwali flavor thalis, and pure mountain atmosphere.');

  const weddingsVenuesTagline = getValue('weddings', 'weddings_venues_tagline', 'SACRED VENUE GRID');
  const weddingsVenuesHeading = getValue('weddings', 'weddings_venues_heading', 'Our Ceremony');
  const weddingsVenuesHeadingItalic = getValue('weddings', 'weddings_venues_heading_italic', 'Spaces');
  const weddingsVenuesDesc = getValue('weddings', 'weddings_venues_desc', 'Choose from our hand-selected indoor and outdoor spaces, each featuring high altitude forest views and traditional wood hearth configurations.');

  const weddingsOfferingsTagline = getValue('weddings', 'weddings_offerings_tagline', 'Wedding Specifications');
  const weddingsOfferingsHeading = getValue('weddings', 'weddings_offerings_heading', 'Sacred');
  const weddingsOfferingsHeadingItalic = getValue('weddings', 'weddings_offerings_heading_italic', 'Aesthetics');
  const weddingsOfferingsDesc = getValue('weddings', 'weddings_offerings_desc', 'Bespoke Arrangements & Sanctuary parameters');

  const weddingsGalleryTagline = getValue('weddings', 'weddings_gallery_tagline', 'PHOTO CAPTURES');
  const weddingsGalleryHeading = getValue('weddings', 'weddings_gallery_heading', 'Celebration');
  const weddingsGalleryHeadingItalic = getValue('weddings', 'weddings_gallery_heading_italic', 'Aesthetics');
  const weddingsGalleryDesc = getValue('weddings', 'weddings_gallery_desc', 'A cinematic visual registry of tables decorated exclusively with wild mountain blooms and wooden embers.');

  const weddingsCtaBtnText = getValue('weddings', 'weddings_cta_btn_text', 'Inquire for Events');
  const weddingsCtaBtnLink = getValue('weddings', 'weddings_cta_btn_link', '/contact');
  const weddingsCtaFootnote = getValue('weddings', 'weddings_cta_footnote', 'Booking open for 2026/2027 Himalayan Seasons');

  const heroVisible = getValue('weddings', 'weddings_hero_visible', 'true') !== 'false';
  const storyVisible = getValue('weddings', 'weddings_story_visible', 'true') !== 'false';
  const polaroidsVisible = getValue('weddings', 'weddings_polaroids_visible', 'true') !== 'false';
  const venuesVisible = getValue('weddings', 'weddings_venues_visible', 'true') !== 'false';
  const offeringsVisible = getValue('weddings', 'weddings_offerings_visible', 'true') !== 'false';

  let weddingPolaroids = [];
  try {
    weddingPolaroids = JSON.parse(getValue('weddings', 'weddings_polaroids', '[]'));
  } catch (e) {}
  if (!weddingPolaroids || weddingPolaroids.length === 0) {
    weddingPolaroids = [
      {
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
        title: "Sacred Canopy",
        desc: "VOWS UNDER MAJESTIC SUMMITS"
      },
      {
        image: "https://images.unsplash.com/photo-1519225495810-7512c322a3e6?auto=format&fit=crop&q=80&w=800",
        title: "Candlelit Glass",
        desc: "GLOWING EVENING SALON RECEPTIONS"
      },
      {
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
        title: "High Pine Lawn",
        desc: "ALFRESCO DEODAR BANQUETS"
      },
      {
        image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800",
        title: "Floral Mandap",
        desc: "TRADITIONAL GARHWALI HARMONY"
      }
    ];
  }
  const visiblePolaroids = weddingPolaroids.filter((p: any) => p.is_visible !== false);

  let venueCards = [];
  try {
    venueCards = JSON.parse(getValue('weddings', 'venue_cards', '[]'));
  } catch (e) {}
  if (!venueCards || venueCards.length === 0) {
    venueCards = [
      {
        id: "canopy-lawn",
        title: "Sacred Canopy Lawn",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600",
        capacity: "Up to 20 guests",
        location: "East Sanctuary Facing",
        highlight: "Kedarnath peaks backdrop during golden sunset hours.",
        vibe: "Intimate, Sacred Open Sky",
        tags: ["Panoramic Vistas", "Open Wood Hearth", "Custom Carpets"]
      },
      {
        id: "glass-pavilion",
        title: "The Glass Pavilion",
        image: "https://images.unsplash.com/photo-1519225495810-7512c322a3e6?auto=format&fit=crop&q=80&w=600",
        capacity: "Up to 20 guests",
        location: "Sanctuary Center",
        highlight: "Framed gorge viewline with cozy slate under-floor heat.",
        vibe: "Editorial, Celestial",
        tags: ["Pine Forest Views", "Heated Stone Slabs", "Ambient Chandeliers"]
      },
      {
        id: "chaukhamba-terrace",
        title: "Chaukhamba Terrace",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600",
        capacity: "Up to 20 guests",
        location: "High Ridge Level",
        highlight: "Porous Himalayan flagstones optimal for fire havan mantras.",
        vibe: "Vedic, Spiritual Purity",
        tags: ["Altar Space", "Mandakini Breezes", "Copper Lamp Rails"]
      },
      {
        id: "deodar-garden",
        title: "Deodar Forest Garden",
        image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600",
        capacity: "Up to 20 guests",
        location: "West Sanctuary Ridge",
        highlight: "Deep forest whispers, warm pathway fire cups, zero plastic.",
        vibe: "Mystical, Eco-Luxury",
        tags: ["Tall Pines Sieve", "Fallen Spruce Bark Path", "Candle Glow Only"]
      }
    ];
  }
  const visibleVenues = venueCards.filter((v: any) => v.is_visible !== false);

  let weddingOfferings = [];
  try {
    weddingOfferings = JSON.parse(getValue('weddings', 'wedding_offerings', '[]'));
  } catch (e) {}
  if (!weddingOfferings || weddingOfferings.length === 0) {
    weddingOfferings = [
      {
        num: "01",
        badge: "CAPACITY LIMITS",
        title: "Up to 20 Guests",
        description: "Exclusively limited to 20 guests for exquisite mountain buyouts. Host a deeply intimate, sacred micro-destination wedding with full retreat access.",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
        bgClass: "bg-[#0f2822]",
        textClass: "text-[#FAF9F5]",
        coords: "N 30° 16' 10\" // E 79° 04' 40\""
      },
      {
        num: "02",
        badge: "CULINARY ARTISTRY",
        title: "Bespoke Sattvik Menus",
        description: "Pure vegetarian, regional organic ingredients curated carefully by our executive chefs for high physical vitality and ultimate sensory purity.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200",
        bgClass: "bg-[#3A1412]",
        textClass: "text-[#FAF9F5]",
        coords: "N 30° 16' 12\" // E 79° 04' 45\""
      },
      {
        num: "03",
        badge: "EXCLUSIVE ACCESS",
        title: "Entire Retreat Buyouts",
        description: "Complete private access to all of our local temperature-controlled luxury pinewood suites, private lawns, paths, and dedicated resort staff.",
        image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200",
        bgClass: "bg-[#FAF9F5]",
        textClass: "text-[#0B1714]",
        coords: "N 30° 16' 15\" // E 79° 04' 50\""
      },
      {
        num: "04",
        badge: "SACRED METRICS",
        title: "Sacred Havan Canopy",
        description: "Traditional cedarwood fire altars aligned with celestial astrologies, providing peaceful chanting vibrations under starlit Himalayan mountain skies.",
        image: "https://images.unsplash.com/photo-1519225495810-7512c322a3e6?auto=format&fit=crop&q=80&w=1200",
        bgClass: "bg-[#09100e]",
        textClass: "text-[#FAF9F5]",
        coords: "N 30° 16' 18\" // E 79° 04' 52\""
      }
    ];
  }
  const visibleOfferings = weddingOfferings.filter((o: any) => o.is_visible !== false);

  const [slideIndex, setSlideIndex] = useState(0);
  const [activeVenue, setActiveVenue] = useState<string | null>(null);

  const weddingSpecsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: weddingSpecsScroll } = useScroll({
    target: weddingSpecsRef,
    offset: ["start start", "end end"]
  });

  const nextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % Math.max(1, visiblePolaroids.length));
  };

  const prevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + visiblePolaroids.length) % Math.max(1, visiblePolaroids.length));
  };

  return (
    <div className="bg-[#FAF9F5] text-slate-charcoal pb-24 min-h-screen font-sans antialiased">
      {loading && content.length === 0 && <PageLoader />}
      
      {/* 1. EDITORIAL HERO PANEL */}
      {heroVisible && (
        <section className="relative h-screen w-full flex items-center justify-center text-center px-4 overflow-hidden pt-20">
          <div className="absolute inset-0 z-0 bg-[#0B1714]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#222425] via-black/15 to-[#0B1714]/65 z-10" />
            <img 
              src={weddingsImage || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1800"} 
              className="w-full h-full object-cover scale-[1.03] brightness-[0.7] contrast-[1.03]"
              alt="Cinematic Alpine Wedding Setup"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="relative z-20 max-w-4xl space-y-6 text-white pt-10 px-4">
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: easePremium }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 text-[#D8CBB8] text-[9px] uppercase font-bold tracking-[0.25em] rounded-full border border-white/10 backdrop-blur-xs select-none"
            >
              <Sparkles size={11} className="text-[#A88C52] animate-pulse" />
              <span>{weddingsHeroBadge}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: easePremium }}
              className="text-4xl md:text-7xl font-serif font-light tracking-tight leading-[1.05] text-white"
            >
              {weddingsHeading}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-xs md:text-sm max-w-lg mx-auto text-white/95 leading-relaxed font-light"
            >
              {weddingsSubheading}
            </motion.p>

            {weddingsHeroDesc && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-xs md:text-sm max-w-lg mx-auto text-white/70 leading-relaxed font-light"
              >
                {weddingsHeroDesc}
              </motion.p>
            )}
          </div>
        </section>
      )}

      {/* 2. CORE NARRATIVE STATEMENT */}
      {storyVisible && (
        <section className="py-20 max-w-4xl mx-auto px-6 text-center">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 1, ease: easePremium }}
             className="space-y-4"
          >
            <span className="font-script text-2xl md:text-4.5xl text-[#A88C52]">
              {weddingsStoryScript}
            </span>
            <h2 className="text-3xl md:text-5.5xl font-serif font-light tracking-tight text-[#1B4C44] leading-tight">
              {weddingsStoryHeading} <span className="italic font-normal font-serif">{weddingsStoryHeadingItalic}</span> {weddingsStorySubheading}
            </h2>
            <div className="w-12 h-[1px] bg-stone-300 mx-auto my-3" />
            <p className="text-xs md:text-md text-slate-charcoal/75 leading-relaxed max-w-2xl mx-auto font-sans font-light text-justify md:text-center">
              {weddingsStoryParagraph}
            </p>
          </motion.div>
        </section>
      )}

      {/* 3. NEW: REUSABLE DYNAMIC POLAROID PHOTO CAROUSEL SECTION */}
      {polaroidsVisible && visiblePolaroids.length > 0 && (
        <section className="py-16 md:py-24 relative px-6 md:px-4 bg-[#FAF9F5] overflow-hidden border-t border-stone-200/40">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              
              {/* Left side: Editorial copywriting & CTA */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: easePremium }}
                className="lg:col-span-5 space-y-6 md:space-y-8 relative z-10 text-left"
              >
                <h2 className="text-4xl sm:text-5xl lg:text-5.5xl font-serif leading-[1.1] tracking-tight text-[#2E3438] font-light">
                  {weddingsStoryTitle} <br /> 
                  <span className="italic font-normal text-[#1B4C44]">{weddingsStorySubtitle}</span>
                </h2>
                <p className="text-xs md:text-sm text-slate-charcoal/75 max-w-md font-sans leading-relaxed text-pretty">
                  {weddingsStoryDesc}
                </p>
                
                <div className="inline-block pt-2">
                  <a href="#venue-grid-section" className="scroll-smooth">
                    <button className="px-7 py-3.5 bg-[#1B4C44] hover:bg-slate-charcoal text-[#FAF9F5] text-[10px] md:text-[10.5px] font-bold uppercase tracking-[0.2em] rounded-md transition-all duration-300 shadow-[0_6px_20px_rgba(27,76,68,0.15)] hover:-translate-y-0.5 cursor-pointer">
                      EXPLORE CELEBRATION VENUES
                    </button>
                  </a>
                </div>
              </motion.div>

              {/* Right side: Absolute replica visual polaroid stack carousel */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.4, ease: easePremium }}
                className="lg:col-span-12 xl:col-span-7 relative flex items-center justify-center bg-transparent pt-10 lg:pt-0"
              >
                <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/3.1] flex items-center justify-center">
                  
                  {/* Visual Arrow Controls over absolute bounds */}
                  <button 
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="absolute left-[-12px] md:-left-10 z-30 w-11 h-11 md:w-13 md:h-13 rounded-full bg-[#1B4C44]/90 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-slate-charcoal transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ChevronLeft size={20} className="stroke-[2.5]" />
                  </button>

                  <button 
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="absolute right-[-12px] md:-right-10 z-30 w-11 h-11 md:w-13 md:h-13 rounded-full bg-[#1B4C44]/90 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-slate-charcoal transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ChevronRight size={20} className="stroke-[2.5]" />
                  </button>

                  {/* Overlapping, tilted, incredibly artistic fanning polaroids */}
                  {visiblePolaroids.map((item: any, i: number) => {
                    const len = visiblePolaroids.length;
                    let offset = i - slideIndex;
                    
                    if (offset > len / 2) offset -= len;
                    if (offset < -len / 2) offset += len;
                    
                    let x = "0%";
                    let y = "0%";
                    let rotate = 0;
                    let scale = 1;
                    let opacity = 1;
                    let zIndex = 20;
                    let isPointerEventsActive = "pointer-events-none";
                    let shadowClass = "shadow-[0_24px_55px_-10px_rgba(46,52,56,0.18)] border-stone-100/60";

                    if (offset === 0) {
                      // Center Active Card (on top of everyone!)
                      x = "0%";
                      y = "0%";
                      rotate = 1;
                      scale = 1;
                      opacity = 1;
                      zIndex = 30;
                      isPointerEventsActive = "pointer-events-auto hover:scale-[1.03] transition-all duration-[400ms]";
                      shadowClass = "shadow-[0_30px_70px_-12px_rgba(46,52,56,0.24)] border-stone-250";
                    } else if (offset === -1) {
                      // Left Background Card
                      x = "-32%";
                      y = "-2%";
                      rotate = -8;
                      scale = 0.88;
                      opacity = 0.65;
                      zIndex = 15;
                      shadowClass = "shadow-[0_15px_35px_-8px_rgba(46,52,56,0.12)] border-stone-200/20";
                    } else if (offset === 1) {
                      // Right Background Card
                      x = "30%";
                      y = "-1%";
                      rotate = 8;
                      scale = 0.88;
                      opacity = 0.65;
                      zIndex = 15;
                      shadowClass = "shadow-[0_15px_35px_-8px_rgba(46,52,56,0.12)] border-stone-200/20";
                    } else {
                      // Hidden background cards
                      x = "0%";
                      y = "8%";
                      rotate = 0;
                      scale = 0.8;
                      opacity = 0;
                      zIndex = 5;
                      shadowClass = "shadow-none border-transparent";
                    }

                    return (
                      <motion.div 
                        key={i}
                        style={{ zIndex }}
                        animate={{ 
                          x, 
                          y, 
                          rotate, 
                          scale, 
                          opacity,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 18,
                          mass: 0.9
                        }}
                        className={`absolute w-[58%] bg-white p-3.5 md:p-4.5 pb-12 md:pb-16 border rounded-xs ${shadowClass} ${isPointerEventsActive} transition-shadow duration-[400ms]`}
                      >
                        <div className="aspect-square w-full overflow-hidden bg-stone-55 border border-stone-100 rounded-2xs group relative">
                          <img 
                            src={item.image} 
                            className="w-full h-full object-cover duration-700 ease-out group-hover:scale-105 transition-transform" 
                            alt={item.title}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="mt-4 text-center px-1">
                          <span className="font-script text-2xl md:text-3.5xl text-[#2E3438] block tracking-wide leading-none">{item.title}</span>
                          <span className="text-[7.5px] md:text-[8px] tracking-[0.2em] font-extrabold text-[#A88C52]/90 font-sans mt-2.5 block uppercase truncate">{item.desc}</span>
                        </div>
                      </motion.div>
                    );
                  })}

                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* 4. VENUES SECTION (ID: venue-grid-section) */}
      {venuesVisible && visibleVenues.length > 0 && (
        <section id="venue-grid-section" className="py-20 bg-[#FAF9F5] border-t border-stone-200/50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center space-y-3 mb-16">
              <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-[#A88C52] block font-mono">
                {weddingsVenuesTagline}
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-[#1B4C44] font-light">
                {weddingsVenuesHeading} <span className="italic font-normal font-serif">{weddingsVenuesHeadingItalic}</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-charcoal/70 max-w-lg mx-auto font-sans leading-relaxed">
                {weddingsVenuesDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {visibleVenues.map((venue: any, index: number) => (
                <motion.div
                  key={venue.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: index * 0.1, ease: easePremium }}
                  className="bg-[#EFEAE1]/40 border border-[#D8CBB8]/40 hover:border-[#1B4C44] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-500 flex flex-col group"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
                    <img
                      src={venue.image}
                      alt={venue.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-[#1B4C44] text-white text-[8px] uppercase tracking-widest font-extrabold px-3 py-1.5 rounded-md border border-white/10 shadow-sm font-mono">
                      {venue.vibe}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <h3 className="text-xl sm:text-2xl font-serif text-slate-charcoal group-hover:text-[#1B4C44] transition-colors duration-300">
                        {venue.title}
                      </h3>
                      <p className="text-xs text-slate-charcoal/75 leading-relaxed font-sans font-light">
                        {venue.highlight}
                      </p>
                    </div>

                    <div className="border-t border-[#D8CBB8]/40 pt-4 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                        <div>
                          <span className="text-[8px] uppercase tracking-wider text-[#A88C52] block font-mono">Capacity</span>
                          <span className="font-semibold text-slate-charcoal">{venue.capacity}</span>
                        </div>
                        <div>
                          <span className="text-[8px] uppercase tracking-wider text-[#A88C52] block font-mono">Location</span>
                          <span className="font-semibold text-slate-charcoal">{venue.location}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {venue.tags && venue.tags.map((tag: string, tIdx: number) => (
                          <span
                            key={tIdx}
                            className="bg-[#FAF9F5] text-slate-charcoal/80 border border-[#D8CBB8]/30 text-[9px] font-sans px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Scroll Stack Specifications Section */}
      {offeringsVisible && visibleOfferings.length > 0 && (
        <section 
          ref={weddingSpecsRef} 
          className="relative bg-[#FAF9F5]"
          style={{ height: `${(visibleOfferings.length - 1) * 90 + 110}vh` }}
        >
          <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
            <div className="container mx-auto px-6 md:px-4 max-w-6xl relative z-10">
              
              <div className="text-center pt-20 xs:pt-24 sm:pt-28 md:pt-2 mb-6 md:mb-12 max-w-2xl mx-auto space-y-2.5 shrink-0 animate-fade-in">
                <span className="text-[9px] uppercase tracking-[0.3em] font-extrabold text-[#A88C52] bg-[#1B4C44]/5 border border-[#1B4C44]/10 px-4 py-1.5 rounded-full inline-block font-sans">
                  {weddingsOfferingsTagline}
                </span>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading text-slate-charcoal mt-1 tracking-tight font-light leading-none">
                  {weddingsOfferingsHeading} <span className="italic font-serif text-[#1B4C44] font-normal">{weddingsOfferingsHeadingItalic}</span>
                </h2>
                <p className="text-[10px] md:text-xs text-slate-charcoal/50 uppercase tracking-[0.18em] font-mono">
                  {weddingsOfferingsDesc}
                </p>
              </div>

              <div className="relative w-full max-w-5xl mx-auto h-[480px] xs:h-[440px] sm:h-[440px] md:h-[420px] lg:h-[450px]" style={{ perspective: isMobile ? undefined : "800px" }}>
                {visibleOfferings.map((offer, idx) => (
                  <WeddingOfferingCard 
                    key={offer.num} 
                    offer={offer} 
                    idx={idx} 
                    total={visibleOfferings.length} 
                    scrollYProgress={weddingSpecsScroll}
                    isMobile={isMobile}
                  />
                ))}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* GALLERY SECTION (Clean sans card background layout) */}
      <section className="py-24 bg-[#FAF9F5]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center space-y-3 mb-12">
            <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-[#A88C52] block font-mono">
              {weddingsGalleryTagline}
            </span>
            <h3 className="text-3xl md:text-5xl font-serif text-[#1B4C44]">
              {weddingsGalleryHeading} <span className="italic font-normal font-serif">{weddingsGalleryHeadingItalic}</span>
            </h3>
            <p className="text-xs md:text-sm text-slate-charcoal/70 max-w-lg mx-auto font-sans">
              {weddingsGalleryDesc}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            <div className="space-y-3 md:space-y-4 lg:space-y-6">
              <div className="relative group overflow-hidden rounded-xl border border-stone-200/50 aspect-[3/4]">
                <img 
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" 
                  alt="Sacred Alpine Canopy vows setup" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <span className="text-[8px] font-mono tracking-widest text-[#D8CBB8] block">CANOPY VOWS</span>
                    <span className="text-xs text-white font-serif">Altar under the Snowpeaks</span>
                  </div>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-xl border border-stone-200/50 aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" 
                  alt="Bespoke outdoor wedding fine-dining deodar table" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <span className="text-[8px] font-mono tracking-widest text-[#D8CBB8] block">OUTDOOR SLATES</span>
                    <span className="text-xs text-white font-serif">Long table woodland banquets</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4 lg:space-y-6 pt-6 md:pt-10">
              <div className="relative group overflow-hidden rounded-xl border border-stone-200/50 aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1519225495810-7512c322a3e6?auto=format&fit=crop&q=80&w=800" 
                  alt="Glass Pavilion evening reception starlight" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <span className="text-[8px] font-mono tracking-widest text-[#D8CBB8] block">GLASS SANCTUARY</span>
                    <span className="text-xs text-white font-serif">Starlit fireplace gatherings</span>
                  </div>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-xl border border-stone-200/50 aspect-[3/4]">
                <img 
                  src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800" 
                  alt="Traditional Garhwali multi-tiered wedding flower designs" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <span className="text-[8px] font-mono tracking-widest text-[#D8CBB8] block">WOODEN TORCHES</span>
                    <span className="text-xs text-white font-serif">Deodar twilight trail entrance</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4 lg:space-y-6 col-span-2 md:col-span-1">
              <div className="relative group overflow-hidden rounded-xl border border-stone-200/50 aspect-[3/4]">
                <img 
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800" 
                  alt="Fine sattvik organic wedding foods" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <span className="text-[8px] font-mono tracking-widest text-[#D8CBB8] block">SATTVIK FEASTS</span>
                    <span className="text-xs text-white font-serif">Hand raised local millet thalis</span>
                  </div>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-xl border border-stone-200/50 aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800" 
                  alt="Ambient wedding night glow celebrations" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <span className="text-[8px] font-mono tracking-widest text-[#D8CBB8] block">TWILIGHT SPIRIT</span>
                    <span className="text-xs text-white font-serif">Lawn cocktails & quiet embers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center mt-16 space-y-4">
          <Link to={weddingsCtaBtnLink}>
            <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1B4C44] hover:bg-slate-charcoal text-white font-bold uppercase tracking-[0.18em] text-[10px] sm:text-[10.5px] rounded-xl transition-colors duration-300 shadow-md cursor-pointer">
              <Heart size={14} className="text-[#A88C52]" />
              <span>{weddingsCtaBtnText}</span>
            </button>
          </Link>
          <span className="text-[9px] text-[#2E3438]/50 uppercase tracking-[0.15em] font-mono">
            {weddingsCtaFootnote}
          </span>
        </div>
      </section>

    </div>
  );
}
