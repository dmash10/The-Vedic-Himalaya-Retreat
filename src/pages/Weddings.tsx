import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { Users, UtensilsCrossed, Key, Sparkles, Heart, ChevronLeft, ChevronRight, Calendar, Compass, MapPin, Wine } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import PageLoader from "@/components/PageLoader";
import BentoGallery from "@/components/BentoGallery";

interface WeddingOfferingCardProps {
  key?: string;
  offer: any;
  idx: number;
  total: number;
  scrollYProgress: any;
  isMobile: boolean;
}

// Custom scroll-based scale-up and slide transform keyframe generator (freestyle, zero tilt, zero opacity fade)
const getWeddingTransformParams = (idx: number, total: number, isMobile: boolean) => {
  if (total <= 1) {
    return {
      inputs: [0, 1],
      scale: [1, 1],
      x: ["0vw", "0vw"],
      y: ["0vh", "0vh"],
      opacity: [1, 1],
      rotate: [0, 0],
      rotateX: [0, 0],
      z: [0, 0],
      visibility: ["visible", "visible"]
    };
  }

  const step = 1.0 / (total - 1);
  const inputs: number[] = [];
  const scale: number[] = [];
  const x: string[] = [];
  const y: string[] = [];
  const opacity: number[] = [];
  const rotate: number[] = [];
  const rotateX: number[] = [];
  const z: number[] = [];
  const visibility: string[] = [];

  const initialScale = isMobile ? 1.0 - idx * 0.03 : 1.0 - idx * 0.07;
  const baseRotate = isMobile ? 0 : (idx % 2 === 0 ? -3.5 - (idx * 0.5) : 3.5 + (idx * 0.5));

  // Align keyframe inputs directly on active step boundaries and include intermediate points for opacity fade
  for (let k = 0; k <= total - 1; k++) {
    inputs.push(k * step);
    if (k < total - 1) {
      inputs.push(k * step + 0.85 * step);
    }
  }

  const uniqueInputs = Array.from(new Set(inputs)).sort((a, b) => a - b);
  const clampedInputs = uniqueInputs.map(v => Math.max(0, Math.min(1, v)));

  clampedInputs.forEach(progress => {
    let currentX = "0vw";
    let currentY = "0vh";
    let currentScale = initialScale;
    let currentRotate = baseRotate;
    let currentOpacity = 1.0;
    let currentRotateX = 0;
    let currentZ = 0;
    let currentVisibility = "visible";

    if (isMobile) {
      // Layout side-by-side in a horizontal row and translate the track dynamically with vertical scroll progress
      currentX = `${(idx - progress * (total - 1)) * 105}%`;
      currentY = "0vh";
      currentScale = 1.0;
      currentRotate = 0;
      currentOpacity = 1.0;
      currentRotateX = 0;
      currentZ = 0;
      currentVisibility = "visible";
    } else {
      // Keep scale at 1.0 at all times on desktop to prevent texture scaling blur
      currentScale = 1.0;
      currentRotate = 0; // Do not tilt/rotate these cards (makes them identical to Home page)

      // Desktop Y, rotateX, and Z translate scroll calculations
      if (idx < total - 1) {
        const slideStart = idx * step;
        const slideEnd = (idx + 1) * step;

        if (progress <= slideStart) {
          // Flat 2D stacked position: stays perfectly static and stable, shifting downwards to keep header clear
          currentX = "0vw";
          currentY = `${idx * 2.2}vh`;
          currentRotateX = 0;
          currentZ = 0;
          currentOpacity = 1.0;
          currentVisibility = "visible";
        } else if (progress >= slideEnd) {
          currentX = "0vw";
          currentY = "-120vh";
          currentRotateX = 25;
          currentZ = -80;
          currentOpacity = 0.0;
          currentVisibility = "hidden";
        } else {
          // Active slide-away transition: slides away smoothly starting directly from its downward stack position
          const ratio = (progress - slideStart) / (slideEnd - slideStart);
          const startY = idx * 2.2;
          currentX = "0vw";
          currentY = `${startY + ratio * (-120 - startY)}vh`;
          currentRotateX = ratio * 25;
          currentZ = ratio * -80;
          
          // Keep card fully visible while moving, fade out only at the very end of transition
          if (ratio < 0.85) {
            currentOpacity = 1.0;
            currentVisibility = "visible";
          } else {
            currentOpacity = 1.0 - (ratio - 0.85) / 0.15;
            currentVisibility = "visible";
          }
        }
      } else {
        // Last card in the stack stays perfectly static at its downward stack position
        currentX = "0vw";
        currentY = `${idx * 2.2}vh`;
        currentRotateX = 0;
        currentZ = 0;
        currentOpacity = 1.0;
        currentVisibility = "visible";
      }
    }

    scale.push(currentScale);
    x.push(currentX);
    y.push(currentY);
    rotate.push(currentRotate);
    opacity.push(currentOpacity);
    rotateX.push(currentRotateX);
    z.push(currentZ);
    visibility.push(currentVisibility);
  });

  return {
    inputs: clampedInputs,
    scale,
    x,
    y,
    rotate,
    opacity,
    rotateX,
    z,
    visibility
  };
};

function WeddingOfferingCard({ offer, idx, total, scrollYProgress, isMobile }: WeddingOfferingCardProps) {
  const params = getWeddingTransformParams(idx, total, isMobile);
  
  const scale = useTransform(scrollYProgress, params.inputs, params.scale);
  const x = useTransform(scrollYProgress, params.inputs, params.x);
  const y = useTransform(scrollYProgress, params.inputs, params.y);
  const opacity = useTransform(scrollYProgress, params.inputs, params.opacity);
  const rotate = useTransform(scrollYProgress, params.inputs, params.rotate);
  const rotateX = useTransform(scrollYProgress, params.inputs, params.rotateX);
  const z = useTransform(scrollYProgress, params.inputs, params.z);
  const visibility = useTransform(scrollYProgress, params.inputs, params.visibility);

  return (
    <motion.div 
      style={{ 
        scale, 
        x,
        y,
        opacity,
        rotate,
        rotateX,
        z,
        visibility,
        transformOrigin: isMobile ? "center center" : "bottom center",
        zIndex: total - idx,
        // Desktop-specific anti-blur optimizations
        willChange: isMobile ? "transform, opacity" : "auto",
        transformStyle: isMobile ? "flat" : "preserve-3d",
        WebkitBackfaceVisibility: isMobile ? "visible" : "hidden",
        backfaceVisibility: isMobile ? "visible" : "hidden",
        WebkitFontSmoothing: isMobile ? "antialiased" : "subpixel-antialiased",
        MozOsxFontSmoothing: isMobile ? "grayscale" : "auto",
        outline: "1px solid transparent",
      }}
      className={`absolute inset-0 rounded-[1.6rem] sm:rounded-[2.2rem] border border-[#D8CBB8]/30 shadow-md sm:shadow-[0_12px_30px_rgba(0,0,0,0.12)] ${offer.bgClass} ${offer.textClass} flex flex-col md:flex-row p-3.5 sm:p-5 lg:p-7 gap-3 sm:gap-6`}
    >
      {/* Subtle glamorous glint texture overlay for light ray highlights - rounded corners added to match clipping */}
      <div className="absolute inset-0 rounded-[1.6rem] sm:rounded-[2.2rem] bg-gradient-to-tr from-white/0 via-white/[0.012] to-white/[0.03] pointer-events-none" />

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
          <p className="text-[11px] sm:text-sm leading-relaxed font-sans font-normal max-w-sm">
            {offer.description}
          </p>
        </div>


      </div>

      {/* Right Visual nesting layout representing a "card inside a card" holding the illustration */}
      <div className="flex-1 md:w-1/2 p-1 sm:p-2 bg-white/10 md:bg-white/5 rounded-[1.3rem] sm:rounded-[1.8rem] border border-white/10 overflow-hidden relative group h-36 xs:h-44 sm:h-52 md:h-auto min-h-[140px] md:min-h-0">
        <div className="w-full h-full rounded-[1rem] sm:rounded-[1.3rem] overflow-hidden relative">
          <img 
            src={offer.image} 
            alt={offer.title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    setIsMobile(mql.matches);
    
    try {
      mql.addEventListener("change", onChange);
    } catch (err) {
      mql.addListener(onChange);
    }
    
    return () => {
      try {
        mql.removeEventListener("change", onChange);
      } catch (err) {
        mql.removeListener(onChange);
      }
    };
  }, []);

  const easePremium = [0.22, 1, 0.36, 1] as const;
  const { getValue, loading, content } = useContent();

  const weddingsHeading = getValue('weddings', 'weddings_heading', 'The Great Himalayan Wedding');
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
  const weddingsOfferingsDesc = getValue('weddings', 'weddings_offerings_desc', 'Custom arrangements & local services');

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
  const galleryVisible = getValue('weddings', 'weddings_gallery_visible', 'true') !== 'false';

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
        location: "East Forest Facing",
        highlight: "Kedarnath peaks backdrop during golden sunset hours.",
        vibe: "Intimate, Sacred Open Sky",
        tags: ["Panoramic Vistas", "Open Wood Hearth", "Custom Carpets"]
      },
      {
        id: "glass-pavilion",
        title: "The Glass Pavilion",
        image: "https://images.unsplash.com/photo-1519225495810-7512c322a3e6?auto=format&fit=crop&q=80&w=600",
        capacity: "Up to 20 guests",
        location: "Retreat Garden",
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
        location: "West Forest Ridge",
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
        description: "Limited to 20 guests. Host a private family destination wedding with full retreat access.",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
        bgClass: "bg-[#0f2822]",
        textClass: "text-[#FAF9F5]",
        coords: "N 30° 16' 10\" // E 79° 04' 40\""
      },
      {
        num: "02",
        badge: "CULINARY ARTISTRY",
        title: "Bespoke Vegetarian Menus",
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

  let weddingsGallery = [];
  try {
    const val = getValue('weddings', 'weddings_gallery', '[]');
    weddingsGallery = JSON.parse(val);
  } catch (e) {
    console.error("Error parsing weddings gallery:", e);
  }
  if (!Array.isArray(weddingsGallery) || weddingsGallery.length === 0) {
    weddingsGallery = [
      { image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800", title: "Altar under the Snowpeaks", category: "CANOPY VOWS", is_visible: true },
      { image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800", title: "Long table woodland banquets", category: "OUTDOOR SLATES", is_visible: true },
      { image: "https://images.unsplash.com/photo-1519225495810-7512c322a3e6?auto=format&fit=crop&q=80&w=1200", title: "Starlit fireplace gatherings", category: "GLASS PAVILION", is_visible: true },
      { image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800", title: "Deodar twilight trail entrance", category: "WOODEN TORCHES", is_visible: true },
      { image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800", title: "Hand raised local millet thalis", category: "VEGETARIAN FEASTS", is_visible: true },
      { image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800", title: "Lawn cocktails & quiet embers", category: "TWILIGHT SPIRIT", is_visible: true }
    ];
  }
  const visibleGallery = weddingsGallery.filter((item: any) => item.is_visible !== false);

  const [slideIndex, setSlideIndex] = useState(0);
  const [activeVenue, setActiveVenue] = useState<string | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(heroScroll, [0, 1], ["0%", "50%"]);
  const opacity1 = useTransform(heroScroll, [0, 0.8], [1, 0]);

  // Split heading into two parts, placing "wedding" or "weddings" (or fallback last word) on the second line
  const headingWords = weddingsHeading.split(" ");
  let headingLine1 = weddingsHeading;
  let headingLine2 = "";
  if (headingWords.length > 1) {
    const weddingIndex = headingWords.findIndex(w => 
      w.toLowerCase().includes("wedding")
    );
    if (weddingIndex > 0) {
      headingLine1 = headingWords.slice(0, weddingIndex).join(" ");
      headingLine2 = headingWords.slice(weddingIndex).join(" ");
    } else {
      const lastIndex = headingWords.length - 1;
      headingLine1 = headingWords.slice(0, lastIndex).join(" ");
      headingLine2 = headingWords[lastIndex];
    }
  }

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
      {loading && content.length === 0 && <PageLoader />}      {/* 1. EDITORIAL HERO PANEL */}
      {heroVisible && (
        <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
          <motion.div 
            style={{ y: y1 }}
            className="absolute inset-0 w-full h-full bg-[#1E2229]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E2229] via-black/15 to-[#1E2229]/40 z-10" />
            {weddingsImage && (
              <img 
                src={weddingsImage} 
                className="w-full h-full object-cover object-center scale-105"
                alt="Cinematic Alpine Wedding Setup"
                referrerPolicy="no-referrer"
              />
            )}
          </motion.div>
          
          <motion.div 
            style={{ opacity: opacity1 }}
            className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 pt-20"
          >
            <motion.h1 
              initial={{ opacity: 0, filter: "blur(10px)", y: 25 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 1.5, ease: easePremium, delay: 0.4 }}
              className="text-[3.5rem] leading-[0.9] md:text-8xl lg:text-9xl font-heading tracking-tighter text-warm-white group"
            >
              {headingLine1} <br />
              {headingLine2 && (
                <span className="italic font-normal text-stone-sand/90">{headingLine2}</span>
              )}
            </motion.h1>
          </motion.div>
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
                  className="bg-[#EFEAE1]/40 border border-[#D8CBB8]/40 hover:border-[#1B4C44] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-[border-color,box-shadow] duration-300 flex flex-col group"
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
          style={{ height: isMobile ? "auto" : `${(visibleOfferings.length - 1) * 90 + 110}vh` }}
        >
          {isMobile ? (
            // Mobile Native Horizontal Carousel
            <div className="py-16 px-6 relative z-10 w-full overflow-hidden">
              <div className="text-center mb-8 max-w-2xl mx-auto space-y-2.5 shrink-0">
                <span className="text-[9px] uppercase tracking-[0.3em] font-extrabold text-[#A88C52] bg-[#1B4C44]/5 border border-[#1B4C44]/10 px-4 py-1.5 rounded-full inline-block font-sans">
                  {weddingsOfferingsTagline}
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading text-slate-charcoal mt-1 tracking-tight font-light leading-none">
                  {weddingsOfferingsHeading} <span className="italic font-serif text-[#1B4C44] font-normal">{weddingsOfferingsHeadingItalic}</span>
                </h2>
                <p className="text-[10px] text-slate-charcoal/50 uppercase tracking-[0.18em] font-mono">
                  {weddingsOfferingsDesc}
                </p>
              </div>

              {/* Native Horizontal Scroll Row */}
              <div className="flex flex-row overflow-x-auto gap-4 snap-x snap-mandatory no-scrollbar px-6 -mx-6 pb-6 pt-2 select-none -webkit-overflow-scrolling-touch">
                {visibleOfferings.map((offer: any) => (
                  <div
                    key={offer.num}
                    className={`relative w-[85vw] max-w-[340px] h-[380px] xs:h-[350px] shrink-0 snap-center rounded-[1.6rem] border border-[#D8CBB8]/30 shadow-md overflow-hidden ${offer.bgClass} ${offer.textClass} flex flex-col p-4.5 gap-3.5`}
                  >
                    {/* Subtle glamorous glint texture overlay for light ray highlights */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.012] to-white/[0.03] pointer-events-none" />

                    {/* Top row with number and badge */}
                    <div className="flex justify-between items-start z-10 font-sans">
                      <span className="text-2xl font-serif font-extrabold tracking-tight opacity-20 block leading-none">
                        {offer.num}
                      </span>
                      <span className="text-[8px] tracking-[0.2em] font-mono uppercase font-bold opacity-65 block mt-0.5">
                        {offer.badge}
                      </span>
                    </div>

                    {/* Middle title and description */}
                    <div className="space-y-1.5 z-10 text-left py-1 font-sans">
                      <h3 className="text-base font-serif font-normal tracking-wide leading-tight">
                        {offer.title}
                      </h3>
                      <p className="text-[10.5px] opacity-90 leading-relaxed font-sans font-light">
                        {offer.description}
                      </p>
                    </div>

                    {/* Bottom image illustration */}
                    <div className="flex-1 p-1 bg-white/10 rounded-[1.1rem] border border-white/10 overflow-hidden relative w-full">
                      <div className="w-full h-full rounded-[0.8rem] overflow-hidden relative">
                        <img 
                          src={offer.image} 
                          alt={offer.title} 
                          className="absolute inset-0 w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Swipe Indication */}
              <div className="flex items-center justify-center gap-2 mt-5 text-[11px] font-bold tracking-[0.25em] text-[#1B4C44] font-heading select-none">
                <span className="uppercase opacity-90">Swipe to explore</span>
                <motion.div 
                  animate={{ x: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  className="flex items-center text-[#A88C52]"
                >
                  <ChevronRight size={14} className="stroke-[3]" />
                  <ChevronRight size={14} className="-ml-2 stroke-[3] opacity-60" />
                </motion.div>
              </div>
            </div>
          ) : (
            // Desktop Sticky Interactive Vertical Stack Section
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

                <div className="relative w-full max-w-5xl mx-auto h-[480px] xs:h-[440px] sm:h-[440px] md:h-[420px] lg:h-[450px]" style={{ perspective: "800px" }}>
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
          )}
        </section>
      )}

      {/* GALLERY SECTION (Clean sans card background layout) */}
      <section className="py-24 bg-[#FAF9F5]">
        {galleryVisible && (
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
            <BentoGallery 
              items={visibleGallery} 
              theme="light"
              borderRadiusClass="rounded-xl"
            />
          </div>
        )}

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
