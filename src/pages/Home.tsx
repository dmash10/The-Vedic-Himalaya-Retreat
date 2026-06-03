import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import SocialProofSection from "@/components/SocialProofSection";
import { ArrowRight, Maximize2, BedDouble, Bath, Mountain, Flame, Sparkles, Compass, Bed, Fan, Tv, Wifi, Wind, Leaf, MapPin, Droplets, Zap, Car, Utensils, ShieldCheck, Briefcase, Users, ChevronLeft, ChevronRight, Star } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { useRooms } from "@/hooks/useRooms";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import PageLoader from "@/components/PageLoader";
import BentoGallery from "@/components/BentoGallery";

function DynamicIcon({ name, className = "h-4 w-4", strokeWidth = 1.5 }: { name: string; className?: string; strokeWidth?: number }) {
  const Icon = (LucideIcons as any)[name];
  if (!Icon) return <Sparkles className={className} strokeWidth={strokeWidth} />;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}

interface OfferingCardProps {
  key?: string | number;
  offer: any;
  idx: number;
  total: number;
  scrollYProgress: any;
  isMobile: boolean;
  readyToLoad?: boolean;
}

// Custom scroll-based scale-up and slide transform keyframe generator (freestyle, zero tilt, zero opacity fade)
const getTransformParams = (idx: number, total: number, isMobile: boolean) => {
  if (total <= 1) {
    return {
      inputs: [0, 1],
      scale: [1, 1],
      x: ["0vw", "0vw"],
      y: ["0vh", "0vh"],
      opacity: [1, 1],
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
  const rotateX: number[] = [];
  const z: number[] = [];
  const visibility: string[] = [];

  const initialScale = isMobile ? 1.0 - idx * 0.03 : 1.0 - idx * 0.07;

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
    let currentOpacity = 1.0;
    let currentRotateX = 0;
    let currentZ = 0;
    let currentVisibility = "visible";

    if (isMobile) {
      // Layout side-by-side in a horizontal row and translate the track dynamically with vertical scroll progress
      currentX = `${(idx - progress * (total - 1)) * 105}%`;
      currentY = "0vh";
      currentScale = 1.0;
      currentOpacity = 1.0;
      currentRotateX = 0;
      currentZ = 0;
      currentVisibility = "visible";
    } else {
      // Keep scale at 1.0 at all times on desktop to prevent texture scaling blur
      currentScale = 1.0;

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
    opacity,
    rotateX,
    z,
    visibility
  };
};

function OfferingCard({ offer, idx, total, scrollYProgress, isMobile, readyToLoad = false }: OfferingCardProps) {
  const params = getTransformParams(idx, total, isMobile);
  
  const scale = useTransform(scrollYProgress, params.inputs, params.scale);
  const x = useTransform(scrollYProgress, params.inputs, params.x);
  const y = useTransform(scrollYProgress, params.inputs, params.y);
  const opacity = useTransform(scrollYProgress, params.inputs, params.opacity);
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
      <div className="flex-1 md:w-1/2 flex flex-col justify-between py-1 xs:py-2 md:py-3 px-1 md:px-3 z-10 text-left">
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
          <div className="flex items-center gap-2">
            {offer.icon && (
              <DynamicIcon name={offer.icon} className="h-5 w-5 text-[#A88C52] shrink-0" />
            )}
            <h3 className="text-lg sm:text-2xl lg:text-3xl font-serif font-normal tracking-wide leading-tight">
              {offer.title}
            </h3>
          </div>
          <p className="text-[11px] sm:text-sm leading-relaxed font-sans font-normal max-w-sm">
            {offer.description}
          </p>
        </div>


      </div>

      {/* Right Visual nesting layout representing a "card inside a card" holding the illustration */}
      <div className="flex-1 md:w-1/2 p-1 sm:p-2 bg-white/10 md:bg-white/5 rounded-[1.3rem] sm:rounded-[1.8rem] border border-white/10 overflow-hidden relative group h-36 xs:h-44 sm:h-52 md:h-auto min-h-[140px] md:min-h-0">
        <div className="w-full h-full rounded-[1rem] sm:rounded-[1.3rem] overflow-hidden relative">
          <img 
            src={readyToLoad ? offer.image : ""} 
            alt={offer.title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          {/* Gentle overlay gradient to soften image edges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
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

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const offeringsSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: offeringsScroll } = useScroll({
    target: offeringsSectionRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(heroScroll, [0, 1], ["0%", "50%"]);
  const opacity1 = useTransform(heroScroll, [0, 0.8], [1, 0]);

  // Premium easing curve
  const easePremium = [0.22, 1, 0.36, 1] as const;

  const [slideIndex, setSlideIndex] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [polaroidsInteracted, setPolaroidsInteracted] = useState(false);
  const [suiteData, setSuiteData] = useState({
    title: "Pinewood Family Suite",
    badge: "Signature Reserve",
    price: 11500,
    description: "Our premium family suite crafted with fragrant pinewood and mountain stonework. This spacious room features heated master bedding with 2 double beds, clean stone baths, and large window panels showing clear views of the snow-capped Himalayan ranges.",
    images: [
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000"
    ]
  });

  const { content, loading, getValue, appReady } = useContent();
  const { rooms } = useRooms();
  const { settings } = useSiteSettings();

  const [loadRemaining, setLoadRemaining] = useState(false);
  const roomSectionRef = useRef<HTMLDivElement>(null);
  const [loadBento, setLoadBento] = useState(false);

  useEffect(() => {
    if (appReady) {
      const timer = setTimeout(() => {
        setLoadRemaining(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [appReady]);

  useEffect(() => {
    if (!appReady) return; // Wait until page loader is dismissed and layout settles

    const el = roomSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadBento(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [appReady]);

  // Centralized cross-page background preloading queue (runs slowly in background after Bento starts loading)
  useEffect(() => {
    if (loadBento) {
      const roomCardImg = rooms[0]?.card_image_url || "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200";
      const diningHeroImg = getValue('dining', 'dining_image', '');
      const weddingsHeroImg = getValue('weddings', 'weddings_image', '');

      // Parse weddings polaroids to preload them as well
      const weddingsPolaroidsStr = getValue('weddings', 'weddings_polaroids', '[]');
      let weddingPolaroidImages: string[] = [];
      try {
        const parsed = JSON.parse(weddingsPolaroidsStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          weddingPolaroidImages = parsed.map((item: any) => item.image).filter(Boolean);
        }
      } catch (e) {
        console.error("Failed to parse weddings_polaroids in preloader:", e);
      }

      // Default fallback polaroids if weddings_polaroids is empty or unconfigured
      if (weddingPolaroidImages.length === 0) {
        weddingPolaroidImages = [
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1519225495810-7512c322a3e6?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800"
        ];
      }

      // Parse experiences slides to preload them
      const experiencesSlidesStr = getValue('experiences', 'experience_slides', '[]');
      let experiencesSlideImages: string[] = [];
      try {
        const parsed = JSON.parse(experiencesSlidesStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          experiencesSlideImages = parsed.map((item: any) => item.image).filter(Boolean);
        }
      } catch (e) {
        console.error("Failed to parse experience_slides in preloader:", e);
      }
      if (experiencesSlideImages.length === 0) {
        experiencesSlideImages = [
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=2000",
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=2000",
          "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=2000",
          "https://images.unsplash.com/photo-1566378268012-ea11aa6e7b46?auto=format&fit=crop&q=80&w=2000",
          "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=2000",
          "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=2000"
        ];
      }

      // Parse explore (nearby) slides to preload them
      const nearbySlidesStr = getValue('nearby', 'nearby_slides', '[]');
      let nearbySlideImages: string[] = [];
      try {
        const parsed = JSON.parse(nearbySlidesStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          nearbySlideImages = parsed.map((item: any) => item.image).filter(Boolean);
        }
      } catch (e) {
        console.error("Failed to parse nearby_slides in preloader:", e);
      }
      if (nearbySlideImages.length === 0) {
        nearbySlideImages = [
          "https://images.unsplash.com/photo-1626082896492-766af4fc6595?auto=format&fit=crop&q=80&w=2000",
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=2000",
          "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=2000",
          "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=2000",
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000",
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=2000",
          "https://images.unsplash.com/photo-1627855913251-512c1b2f0b78?auto=format&fit=crop&q=80&w=2000"
        ];
      }

      // Combine all images into priority steps
      const rawQueue: (string | string[])[] = [
        roomCardImg,
        diningHeroImg,
        [weddingsHeroImg, ...weddingPolaroidImages].filter(Boolean),
        ...experiencesSlideImages,
        ...nearbySlideImages,
        ...(rooms.slice(1).map(r => r.card_image_url).filter(Boolean) as string[])
      ].filter(Boolean);

      // Deduplicate elements globally across steps to save bandwidth
      const seen = new Set<string>();
      const preloadQueue: (string | string[])[] = [];

      rawQueue.forEach(item => {
        if (Array.isArray(item)) {
          const filtered = item.filter(src => {
            if (!src || seen.has(src)) return false;
            seen.add(src);
            return true;
          });
          if (filtered.length > 0) {
            preloadQueue.push(filtered);
          }
        } else {
          if (item && !seen.has(item)) {
            seen.add(item);
            preloadQueue.push(item);
          }
        }
      });

      let delay = 1200; // Wait 1.2s after Bento gallery starts loading to start preloading other pages
      preloadQueue.forEach((item) => {
        setTimeout(() => {
          if (Array.isArray(item)) {
            item.forEach((src) => {
              const img = new Image();
              img.src = src;
            });
          } else {
            const img = new Image();
            img.src = item;
          }
        }, delay);
        delay += 1000; // Fetch each subsequent step with a 1-second interval to avoid choking browser resources
      });
    }
  }, [loadBento, rooms, getValue]);

  const heroTitleLine1 = getValue('home', 'hero_line1', 'Peace in the');
  const heroTitleLine2 = getValue('home', 'hero_line2', 'Pines');
  const heroSubtitle = getValue('home', 'hero_subtitle', 'Village Dewar, Guptkashi, Kedarnath Route');
  // Instant local cache resolution (loads immediately on mount)
  const [cachedHeroImage, setCachedHeroImage] = useState(() => {
    return localStorage.getItem('cached_resort_hero_image') || '';
  });

  const dbHeroImage = getValue('home', 'hero_image', '');

  useEffect(() => {
    if (dbHeroImage) {
      localStorage.setItem('cached_resort_hero_image', dbHeroImage);
      setCachedHeroImage(dbHeroImage);
    }
  }, [dbHeroImage]);

  const heroImage = dbHeroImage || cachedHeroImage;
  const heroCta = getValue('home', 'hero_cta', 'Reserve Your Stay');
  const heroCtaLink = getValue('home', 'hero_cta_link', '/rooms');

  // Section Visibility Settings
  const heroVisible = getValue('home', 'hero_visible', 'true') !== 'false';
  const marqueeVisible = getValue('home', 'marquee_visible', 'true') !== 'false';
  const storyVisible = getValue('home', 'story_visible', 'true') !== 'false';
  const offeringsVisible = getValue('home', 'offerings_visible', 'true') !== 'false';
  const amenitiesVisible = getValue('home', 'amenities_visible', 'true') !== 'false';

  const marqueeStr = getValue('home', 'marquee_slogans', '');
  let marqueeItems: string[] = [];
  try {
    marqueeItems = marqueeStr ? JSON.parse(marqueeStr) : [];
  } catch (e) {
    console.error("Failed to parse marquee_slogans:", e);
  }
  if (marqueeItems.length === 0) {
    marqueeItems = [
      "The Vedic Himalaya Retreat",
      "Semi Guptkashi Stay",
      "Kedarnath Guest Rest",
      "Semi Guptkashi Room",
      "Misty Peak Vistas",
      "Mountain View Rooms",
    ];
  }

  const storyLine1 = getValue('home', 'story_line1', 'Wake Up to the');
  const storyLine2 = getValue('home', 'story_line2', 'Himalayan Snowline');
  const storyDesc = getValue('home', 'story_desc', 'Inspired by our cedar forest surroundings, enjoy a quiet escape with a distinct wood-and-stone design and comfortable guest suites.');
  const storyBtnName = getValue('home', 'story_btn_name', 'VIEW ALL ROOMS & SUITES');
  const storyBtnLink = getValue('home', 'story_btn_link', '/rooms');

  const polaroidsStr = getValue('home', 'polaroids', '');
  let homePolaroids: any[] = [];
  try {
    homePolaroids = polaroidsStr ? JSON.parse(polaroidsStr) : [];
  } catch (e) {
    console.error("Failed to parse polaroids:", e);
  }
  if (homePolaroids.length === 0) {
    homePolaroids = [
      { id: 0, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800", title: "Double Pine Suite", desc: "ELEVATED ALPINE LIVING", is_visible: true },
      { id: 1, image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600", title: "Cozy Comforts", desc: "COZY HEARTH COMPANIONSHIP", is_visible: true },
      { id: 2, image: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80&w=800", title: "Chaukhamba Peak", desc: "MISTY GOLDEN RANGE VISTAS", is_visible: true },
      { id: 3, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600", title: "Hearthside Breads", desc: "ORGANIC FRESH BREADS", is_visible: true }
    ];
  }
  const visiblePolaroids = homePolaroids.filter(item => item.is_visible !== false);

  const offeringsStr = getValue('home', 'offerings', '');
  let homeOfferings: any[] = [];
  try {
    homeOfferings = offeringsStr ? JSON.parse(offeringsStr) : [];
  } catch (e) {
    console.error("Failed to parse offerings:", e);
  }
  if (homeOfferings.length === 0) {
    homeOfferings = [
      { num: "01", badge: "CELESTIAL MEMORIES", title: "Destination Weddings", description: "Exchange eternal vows on elegant stone cedar terraces wreathed in soft misty breeze and sacred Himalayan aesthetics.", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200", bgClass: "bg-[#3A1412]", textClass: "text-[#FAF9F5]", coords: "N 30° 16' 10\" // E 79° 04' 40\"", icon: "Heart", is_visible: true },
      { num: "02", badge: "RETREAT BASECAMP", title: "Kedarnath Yatra Stay", description: "Your premium high-altitude rest stay. Rest in comfortable modern pine wood cabins built along the Kedarnath pilgrimage route.", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200", bgClass: "bg-[#0f2822]", textClass: "text-[#FAF9F5]", coords: "N 30° 16' 12\" // E 79° 04' 45\"", icon: "Mountain", is_visible: true },
      { num: "03", badge: "INNER WELLNESS", title: "Yoga & Prana Studio", description: "Tune your physical vessel with high-altitude breathing alignment, meditative pine forest morning walks, and sunset sound bowls.", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200", bgClass: "bg-[#EFEAE1]", textClass: "text-[#0B1714]", coords: "N 30° 16' 15\" // E 79° 04' 50\"", icon: "Wind", is_visible: true },
      { num: "04", badge: "VILLAGE RETREAT", title: "Himalayan Village Life", description: "Uncover quiet mountain paths, pure riverbeds, organic farming cycles, and the timeless warmth of authentic local communities.", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200", bgClass: "bg-[#09100e]", textClass: "text-[#FAF9F5]", coords: "N 30° 16' 18\" // E 79° 04' 52\"", icon: "Compass", is_visible: true }
    ];
  }
  const visibleOfferings = homeOfferings.filter(offer => offer.is_visible !== false);

  const amenitiesStr = getValue('home', 'amenities', '');
  let homeAmenities: any[] = [];
  try {
    homeAmenities = amenitiesStr ? JSON.parse(amenitiesStr) : [];
  } catch (e) {
    console.error("Failed to parse amenities:", e);
  }
  if (homeAmenities.length === 0) {
    homeAmenities = [
      { title: "Orthopathic Beds", desc: "Premium mattresses, warm winter insulation of down duvets.", icon: "Bed", is_visible: true },
      { title: "Continuous Hot Water", desc: "Dedicated in-room geysers for comfortable warm mountain showers.", icon: "Droplets", is_visible: true },
      { title: "Free Wifi", desc: "High speed wireless connectivity across rooms and common areas.", icon: "Wifi", is_visible: true },
      { title: "Electric backup power", desc: "Modern power backup so you are never left in the dark.", icon: "ShieldCheck", is_visible: true },
      { title: "Free guest parking", desc: "Spacious, secure on-site parking for all resort visitors.", icon: "Car", is_visible: true },
      { title: "Restaurant dining", desc: "TIMELY served local Garhwali meals and special hot beverages.", icon: "Utensils", is_visible: true },
      { title: "Local travel desk", desc: "Assistance with Kedarnath registrations, local guides and cabs.", icon: "Compass", is_visible: true },
      { title: "In-room TV", desc: "Standard entertainment displays inside all pinewood suites.", icon: "Tv", is_visible: true }
    ];
  }
  const visibleAmenities = homeAmenities.filter(amenity => amenity.is_visible !== false);

  // New Missing Sections Settings
  const whyChooseVisible = getValue('home', 'why_choose_visible', 'true') !== 'false';
  const whyChooseTagline = getValue('home', 'why_choose_tagline', 'THE VEDIC HIMALAYA DIFFERENCE');
  const whyChooseHeading = getValue('home', 'why_choose_heading', 'Why Guests Choose');
  const whyChooseHeadingItalic = getValue('home', 'why_choose_heading_italic', 'Our Retreat');
  const whyChooseDesc1 = getValue('home', 'why_choose_desc1', 'Most commercial hotels are grouped near busy transit stations, introducing constant vehicle fumes, generator hums, and crowd noise.');
  const whyChooseDesc2 = getValue('home', 'why_choose_desc2', "The Vedic Himalaya Retreat sits high on the scenic, quiet shelf of Village Dewar, Guptkashi, Kedarnath Route. Here, you are beautifully elevated into the silent pines, looking straight out onto snowy Chaukhamba sweeps.");

  const whyChooseItemsStr = getValue('home', 'why_choose_items', '');
  let whyChooseItems: any[] = [];
  try {
    whyChooseItems = whyChooseItemsStr ? JSON.parse(whyChooseItemsStr) : [];
  } catch (e) {
    console.error("Failed to parse why_choose_items:", e);
  }
  if (whyChooseItems.length === 0) {
    whyChooseItems = [
      { num: "01", category: "CALM SILENCE", title: "Out of the Chaos", desc: "Located high above the busy transit highway. Breathe in the pristine, quiet spruce-and-pine mountain slopes, completely free of diesel horns and traffic engines.", icon: "Compass" },
      { num: "02", category: "ALPINE COMFORT", title: "Comfortable Cozy Cabins", desc: "Escape the freezing high-altitude winds. Unwind in draft-protected pine suites with private hot water geysers, mountain views, and thick premium winter duvets.", icon: "BedDouble" },
      { num: "03", category: "UNTOUCHED BREATH", title: "Pure Clean Air", desc: "Wake up energized. Crisp mountain currents blow straight off the high snowy peak glaciers, naturally filtered by dense evergreens before climbing Village Dewar's scenic ridge.", icon: "Wind" },
      { num: "04", category: "CARING HOSPITALITY", title: "Devoted Himalayan Sewa", desc: "Genuine, humble local team serving selfless mountain devotion—brewing warming morning herbal teas & coordinating peaceful local pilgrimage routes like family.", icon: "Users" }
    ];
  }

  const homeGalleryVisible = getValue('home', 'home_gallery_visible', 'true') !== 'false';
  const homeGalleryBadge = getValue('home', 'home_gallery_badge', 'Gallery');
  const homeGalleryHeading = getValue('home', 'home_gallery_heading', 'Our Visual Journal');
  const homeGalleryDesc = getValue('home', 'home_gallery_desc', 'Capturing moments of morning light, quiet silence, and devotion across our retreat garden.');

  const bentoGalleryItemsStr = getValue('home', 'bento_gallery_items', '');
  let bentoGalleryItems: any[] = [];
  try {
    bentoGalleryItems = bentoGalleryItemsStr ? JSON.parse(bentoGalleryItemsStr) : [];
  } catch (e) {
    console.error("Failed to parse bento_gallery_items:", e);
  }
  if (bentoGalleryItems.length === 0) {
    bentoGalleryItems = [
      { image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1000", title: "Dining" },
      { image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800", title: "Wedding" },
      { image: "https://images.unsplash.com/photo-1443632864897-14973fa006cf?auto=format&fit=crop&q=80&w=800", title: "Pines" },
      { image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800", title: "Cafe" },
      { image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200", title: "Glamping" },
      { image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800", title: "Lounge" }
    ];
  }

  const homeCtaVisible = getValue('home', 'home_cta_visible', 'true') !== 'false';
  const homeCtaBadge = getValue('home', 'home_cta_badge', 'Your Himalayan Escape Awaits');
  const homeCtaHeading = getValue('home', 'home_cta_heading', 'Ready to Experience the');
  const homeCtaHeadingItalic = getValue('home', 'home_cta_heading_italic', 'Pinewood Calm?');
  const homeCtaDesc = getValue('home', 'home_cta_desc', 'Book your stay high in the mountain evergreens ahead of your pilgrimage. Clean air, warm hospitality, and quiet alpine peace.');
  const homeCtaBtnText = getValue('home', 'home_cta_btn_text', 'Book Your Stay Today');
  const homeCtaBtnLink = getValue('home', 'home_cta_btn_link', '/rooms');

  useEffect(() => {
    const storedSuite = localStorage.getItem("adminRoomsConfig");
    if (storedSuite) {
      try {
        const parsed = JSON.parse(storedSuite);
        if (parsed && parsed[0]) {
          setSuiteData(prev => ({ ...prev, ...parsed[0] }));
        }
      } catch (e) {
        console.error("Failed to parse suiteData:", e);
      }
    }
  }, []);

  const roomData = rooms[0] || {
    name: suiteData.title,
    description: suiteData.description,
    real_price: suiteData.price,
    card_image_url: suiteData.images[0]
  };

  const nextSlide = () => {
    setPolaroidsInteracted(true);
    setSlideIndex((prev) => (prev + 1) % (visiblePolaroids.length || 1));
  };

  const prevSlide = () => {
    setPolaroidsInteracted(true);
    setSlideIndex((prev) => (prev - 1 + visiblePolaroids.length) % (visiblePolaroids.length || 1));
  };

  return (
    <div className="bg-[#F6F4EF] text-slate-charcoal pb-20 md:pb-0 font-sans">
      {/* Hero Section */}
      {heroVisible && (
        <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
          <motion.div 
            style={{ y: y1 }}
            className="absolute inset-0 w-full h-full bg-[#1E2229]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E2229] via-black/15 to-[#1E2229]/40 z-10" />
            {heroImage && (
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                {/* Blurred preview behind — shows through where crisp image hasn't painted yet */}
                {!heroLoaded && (
                  <img
                    src={heroImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-center filter blur-xl scale-105 opacity-60"
                  />
                )}
                {/* Crisp image loads naturally top-to-bottom over the blur */}
                <img 
                  src={heroImage} 
                  alt="Foggy Himalayan Mountains" 
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  onLoad={() => setHeroLoaded(true)}
                />
              </div>
            )}
          </motion.div>
          
          <motion.div 
            style={{ opacity: opacity1 }}
            className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 pt-20"
          >
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: easePremium }}
              className="uppercase tracking-[0.3em] text-[10px] md:text-xs text-warm-white/95 mb-6 font-semibold"
            >
              {heroSubtitle}
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, filter: "blur(10px)", y: 25 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 1.5, ease: easePremium, delay: 0.4 }}
              className="text-[3.5rem] leading-[0.9] md:text-8xl lg:text-9xl font-heading tracking-tighter text-warm-white mb-8 group"
            >
              {heroTitleLine1} <br className="md:hidden"/>
              <span className="italic font-normal text-stone-sand/90">{heroTitleLine2}</span>
            </motion.h1>
          </motion.div>
        </section>
      )}

      {/* Marquee Section */}
      {marqueeVisible && (
        <section className="py-6 md:py-8 bg-[#FAF9F5] border-y border-stone-sand/20 overflow-hidden relative shadow-sm">
          <div className="absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-[#FAF9F5] to-transparent z-10 pointer-events-none opacity-80" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-[#FAF9F5] to-transparent z-10 pointer-events-none opacity-80" />
          
          <div className="overflow-hidden w-full select-none relative">
            <div className="animate-marquee gap-12 md:gap-16 items-center">
              {Array(2).fill(null).map((_, groupIndex) => (
                <div 
                  key={groupIndex} 
                  className="flex items-center gap-12 md:gap-16 font-heading uppercase tracking-[0.1em] text-lg md:text-2xl text-[#2D3E35] font-medium"
                >
                  {marqueeItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-12 md:gap-16">
                      <span>{item}</span>
                      <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8 fill-[#B32D2D] text-[#B32D2D] shrink-0" stroke="none">
                        <path d="M12 2L15.3 8.7L22 12L15.3 15.3L12 22L8.7 15.3L2 12L8.7 8.7Z" />
                      </svg>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Premium Storytelling & Interactive Polaroid Section (Matches design references exactly with buttery-smooth sliding carousel) */}
      {storyVisible && (
        <section className="py-24 md:py-40 relative px-6 md:px-4 bg-[#FAF9F5] overflow-hidden">
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
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading leading-[1.1] tracking-tight text-[#2E3438] font-light">
                  {storyLine1} <br /> 
                  <span className="italic font-serif font-normal text-[#1B4C44]">{storyLine2}</span>
                </h2>
                <p className="text-sm md:text-base text-slate-charcoal/75 max-w-md font-sans leading-relaxed text-pretty">
                  {storyDesc}
                </p>
                
                <Link to={storyBtnLink} className="inline-block pt-2">
                  <button className="px-8 py-4 bg-[#2A6575] hover:bg-[#1C4E5C] text-[#FAF9F5] text-[10.5px] md:text-xs font-bold uppercase tracking-[0.2em] rounded-md transition-all duration-300 shadow-[0_6px_20px_rgba(42,101,117,0.18)] hover:-translate-y-0.5 cursor-pointer">
                    {storyBtnName}
                  </button>
                </Link>
              </motion.div>

              {/* Right side: Absolute replica visual polaroid stack carousel */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.4, ease: easePremium }}
                className="lg:col-span-7 relative flex items-center justify-center bg-transparent pt-10 lg:pt-0"
              >
                <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/3.1] flex items-center justify-center">
                  
                  {/* Visual Arrow Controls over absolute bounds matching the design exactly! */}
                  
                  <button 
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="absolute left-[-12px] md:-left-10 z-30 w-11 h-11 md:w-13 md:h-13 rounded-full bg-[#83979C]/80 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-[#2A6575] hover:border-[#2A6575] transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ChevronLeft size={20} className="stroke-[2.5]" />
                  </button>

                  <button 
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="absolute right-[-12px] md:-right-10 z-30 w-11 h-11 md:w-13 md:h-13 rounded-full bg-[#83979C]/80 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-[#2A6575] hover:border-[#2A6575] transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ChevronRight size={20} className="stroke-[2.5]" />
                  </button>

                  {/* Overlapping, tilted, fanning polaroids */}
                  {visiblePolaroids.map((item, i) => {
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
                      // Center Active Card
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

                    const imageSrc = i === 0
                      ? item.image
                      : (i === 1 || i === 3)
                      ? (appReady ? item.image : "")
                      : (loadBento || polaroidsInteracted ? item.image : "");

                    return (
                      <motion.div 
                         key={item.id}
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
                          {imageSrc ? (
                            <img 
                              src={imageSrc} 
                              className="w-full h-full object-cover duration-700 ease-out group-hover:scale-105 transition-transform" 
                              alt={item.title}
                              loading={i === 0 ? "eager" : "lazy"}
                              fetchPriority={i === 0 ? "high" : "auto"}
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#FAF9F5]/80 animate-pulse" />
                          )}
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

      {/* Scroll Stack Offerings Section */}
      {offeringsVisible && (
        <section 
          ref={offeringsSectionRef} 
          className="relative bg-[#FAF9F5]"
          style={{ height: isMobile ? "auto" : `${(visibleOfferings.length - 1) * 90 + 110}vh` }}
        >
          {isMobile ? (
            // Mobile Native Horizontal Carousel
            <div className="pt-16 pb-8 px-6 relative z-10 w-full overflow-hidden">
              <div className="text-center mb-8 max-w-2xl mx-auto space-y-2 shrink-0">
                <span className="text-[9px] uppercase tracking-[0.3em] font-extrabold text-[#A88C52] bg-[#1B4C44]/5 border border-[#1B4C44]/10 px-4 py-1.5 rounded-full inline-block">
                  Curated Himalayan Paths
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading text-slate-charcoal tracking-tight font-light leading-none">
                  Signature <span className="italic font-serif text-[#1B4C44] font-normal">Offerings</span>
                </h2>
                <p className="text-[10px] text-slate-charcoal/50 uppercase tracking-[0.18em] font-mono">
                  Comfortable Rooms & High-Altitude Stays
                </p>
              </div>

              {/* Native Horizontal Scroll Row */}
              <div className="flex flex-row overflow-x-auto gap-4 snap-x snap-mandatory no-scrollbar px-6 -mx-6 pb-6 pt-2 select-none -webkit-overflow-scrolling-touch">
                {visibleOfferings.map((offer) => (
                  <div
                    key={offer.num}
                    className={`relative w-[85vw] max-w-[340px] h-[380px] xs:h-[350px] shrink-0 snap-center rounded-[1.6rem] border border-[#D8CBB8]/30 shadow-md overflow-hidden ${offer.bgClass} ${offer.textClass} flex flex-col p-4.5 gap-3.5`}
                  >
                    {/* Subtle glamorous glint texture overlay for light ray highlights */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.012] to-white/[0.03] pointer-events-none" />

                    {/* Top row with number and badge */}
                    <div className="flex justify-between items-start z-10">
                      <span className="text-2xl font-serif font-extrabold tracking-tight opacity-20 block leading-none">
                        {offer.num}
                      </span>
                      <span className="text-[8px] tracking-[0.2em] font-mono uppercase font-bold opacity-65 block mt-0.5">
                        {offer.badge}
                      </span>
                    </div>

                    {/* Middle title and description */}
                    <div className="space-y-1.5 z-10 text-left py-1">
                      <div className="flex items-center gap-2">
                        {offer.icon && (
                          <DynamicIcon name={offer.icon} className="h-4.5 w-4.5 text-[#A88C52] shrink-0" />
                        )}
                        <h3 className="text-base font-serif font-normal tracking-wide leading-tight">
                          {offer.title}
                        </h3>
                      </div>
                      <p className="text-[10.5px] opacity-90 leading-relaxed font-sans font-light">
                        {offer.description}
                      </p>
                    </div>

                    {/* Bottom image illustration */}
                    <div className="flex-1 p-1 bg-white/10 rounded-[1.1rem] border border-white/10 overflow-hidden relative w-full">
                      <div className="w-full h-full rounded-[0.8rem] overflow-hidden relative">
                        <img 
                          src={loadRemaining ? offer.image : ""} 
                          alt={offer.title} 
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
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
                
                <div className="text-center pt-20 xs:pt-24 sm:pt-28 md:pt-2 mb-6 md:mb-12 max-w-2xl mx-auto space-y-2.5 shrink-0">
                  <span className="text-[9px] uppercase tracking-[0.3em] font-extrabold text-[#A88C52] bg-[#1B4C44]/5 border border-[#1B4C44]/10 px-4 py-1.5 rounded-full inline-block">
                    Curated Himalayan Paths
                  </span>
                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading text-slate-charcoal tracking-tight font-light leading-none">
                    Signature <span className="italic font-serif text-[#1B4C44] font-normal">Offerings</span>
                  </h2>
                  <p className="text-[10px] md:text-xs text-slate-charcoal/50 uppercase tracking-[0.18em] font-mono">
                    Comfortable Rooms & High-Altitude Stays
                  </p>
                </div>

                <div className="relative w-full max-w-5xl mx-auto h-[480px] xs:h-[440px] sm:h-[440px] md:h-[420px] lg:h-[450px]" style={{ perspective: "800px" }}>
                  {visibleOfferings.map((offer, idx) => (
                    <OfferingCard 
                      key={offer.num} 
                      offer={offer} 
                      idx={idx} 
                      total={visibleOfferings.length} 
                      scrollYProgress={offeringsScroll}
                      isMobile={isMobile}
                      readyToLoad={loadRemaining}
                    />
                  ))}
                </div>

              </div>
            </div>
          )}
        </section>
      )}

      {/* Aesthetic Center CTA Link - Scrolls up naturally right after the signature offerings card stack completes */}
      <div className="bg-[#FAF9F5] py-8 md:py-16 border-b border-[#D8CBB8]/15 flex flex-col items-center justify-center text-center px-6 relative z-10">
        <p className="text-[9px] uppercase tracking-[0.2em] text-[#A88C52] font-mono mb-4">Experience More of Our Mountain Retreat</p>
        <Link 
          to="/experiences" 
          className="group inline-flex items-center gap-3 text-[#1B4C44] hover:text-[#A88C52] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] font-heading transition-colors duration-300 cursor-pointer border-b border-dashed border-[#1B4C44]/30 pb-1.5"
        >
          Explore Detailed Experiences
          <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
        </Link>
      </div>

      {/* Premium Resort Aesthetic Amenities Section (Simple, compact 4-column balanced grid) */}
      {amenitiesVisible && (
        <section className="py-12 md:py-20 bg-[#FAF9F5] border-b border-[#D8CBB8]/20 overflow-hidden">
          <div className="container mx-auto px-6 max-w-6xl">
            
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16 space-y-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-[#A88C52] bg-[#FAF9F5] border border-[#D8CBB8]/40 px-4 py-1.5 rounded-full inline-block">
                Amenities
              </span>
              <h2 className="text-2xl md:text-3xl font-serif text-slate-charcoal tracking-wide font-normal">
                Essential Comforts
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
              {visibleAmenities.map((amenity, idx) => (
                <div key={idx} className="space-y-2 text-center md:text-left">
                  <div className="w-10 h-10 rounded-full bg-[#1B4C44]/5 text-[#1B4C44] flex items-center justify-center mx-auto md:mx-0 border border-[#1B4C44]/10">
                    <DynamicIcon name={amenity.icon || 'Sparkles'} className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-charcoal uppercase tracking-wider font-heading">{amenity.title}</h3>
                  <p className="text-[11px] text-slate-charcoal/65 font-sans leading-relaxed">
                    {amenity.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1B4C44] text-white text-[10px] md:text-xs font-bold tracking-wider uppercase shadow-md transition-all duration-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FAF9F5] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#A88C52]"></span>
                </span>
                <span>100% Verified Guest Satisfaction Rate</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Rooms Peek */}
      <section ref={roomSectionRef} className="py-10 md:py-24 bg-[#EFEAE1]/45 overflow-hidden">
        <div className="container mx-auto px-4 md:px-4 max-w-6xl">
          <div className="flex flex-col items-center text-center mb-6 md:mb-16 space-y-2 md:space-y-4">
            <span className="uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold text-deep-teal">Accommodation</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading tracking-tight text-slate-charcoal">Our <span className="italic text-deep-teal font-normal">{roomData.name}</span></h2>
            <p className="text-[11px] sm:text-sm text-slate-charcoal/70 max-w-sm mx-auto text-center font-sans">
              {roomData.description ? roomData.description.slice(0, 100) + "..." : "Cozy high-altitude rooms crafted with fragrant pinewood and pristine valley vistas."}
            </p>
          </div>
          
          {/* Stunning, high-end 2-column wide layout for the Single Signature Suite */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: easePremium }}
            className="bg-[#FAF9F5] border border-[#D8CBB8]/60 hover:border-deep-teal transition-all duration-500 overflow-hidden rounded-2xl grid grid-cols-1 md:grid-cols-12 max-w-5xl mx-auto"
          >
            {/* Visual Column */}
            <div className="md:col-span-6 relative aspect-[16/9] md:aspect-auto overflow-hidden bg-[#FAF9F5]">
              <img 
                src={loadRemaining ? (roomData.card_image_url || "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200") : ""} 
                alt={roomData.name} 
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-1000 ease-out"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {/* Luxury Transparent Glass Badge */}
              <span className="absolute top-3 left-3 bg-slate-charcoal/90 backdrop-blur-md text-[#ffffff] text-[7.5px] sm:text-[9px] uppercase font-bold tracking-[0.15em] px-3 py-1.5 rounded-md border border-white/10">
                ★ Signature Selection
              </span>
            </div>

            {/* Description & Specs Column */}
            <div className="md:col-span-6 p-4 sm:p-10 flex flex-col justify-between">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-1.5 text-amber-700 text-[10px] sm:text-[11px] font-bold">
                  <Star size={10} className="fill-amber-400 text-amber-500 hover:scale-110 transition-transform cursor-pointer" />
                  <span>4.9 Index Rating • Triple Verified</span>
                </div>
                
                <h3 className="text-xl sm:text-3xl lg:text-4xl font-heading font-medium tracking-tight text-slate-charcoal leading-tight">
                  {roomData.name}
                </h3>
                
                <p className="text-[11px] sm:text-sm text-slate-charcoal/75 leading-relaxed font-sans">
                  {roomData.description}
                </p>

                {/* Specs list */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 pt-3 pb-3 border-t border-b border-[#D8CBB8]/30 text-xs text-slate-charcoal">
                  <div className="flex items-center gap-2">
                    <span className="p-1 sm:p-1.5 rounded-md bg-stone-sand/20 text-deep-teal">
                      <Bed size={12} strokeWidth={2} />
                    </span>
                    <div>
                      <span className="text-[8px] uppercase text-slate-charcoal/50 font-bold block leading-none">Layout</span>
                      <span className="font-semibold text-slate-charcoal text-[11px] sm:text-xs">2 Double Beds</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="p-1 sm:p-1.5 rounded-md bg-stone-sand/20 text-[#A88C52]">
                      <Mountain size={12} strokeWidth={2} />
                    </span>
                    <div>
                      <span className="text-[8px] uppercase text-slate-charcoal/50 font-bold block leading-none">Scenic View</span>
                      <span className="font-semibold text-slate-charcoal text-[11px] sm:text-xs">Snowpeak Vista</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="p-1 sm:p-1.5 rounded-md bg-stone-sand/20 text-deep-teal">
                      <Bath size={12} strokeWidth={2} />
                    </span>
                    <div>
                      <span className="text-[8px] uppercase text-slate-charcoal/50 font-bold block leading-none">Bathing</span>
                      <span className="font-semibold text-slate-charcoal text-[11px] sm:text-xs">Slate Bath</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="p-1 sm:p-1.5 rounded-md bg-stone-sand/20 text-deep-teal">
                      <Wifi size={12} strokeWidth={2} />
                    </span>
                    <div>
                      <span className="text-[8px] uppercase text-slate-charcoal/50 font-bold block leading-none">Internet</span>
                      <span className="font-semibold text-slate-charcoal text-[11px] sm:text-xs">Free Fiber WiFi</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons & Rate Info */}
              <div className="flex flex-row items-center justify-between w-full mt-4 pt-3 border-t border-stone-200/50 gap-3">
                <div className="flex flex-col">
                  <span className="text-[7.5px] sm:text-[9px] uppercase tracking-wider font-bold text-slate-charcoal/55 leading-none mb-0.5">Rate</span>
                  <span className="font-heading font-medium text-base sm:text-2xl text-slate-charcoal flex items-baseline gap-0.5 sm:gap-1">
                    {settings.show_prices ? (
                      <>
                        ₹{roomData.real_price?.toLocaleString('en-IN') || '11,500'}
                        <span className="text-[10px] sm:text-xs text-slate-charcoal/50 font-sans font-normal italic">/night</span>
                      </>
                    ) : (
                      <span className="text-xs sm:text-sm font-heading font-bold text-deep-teal uppercase tracking-wider">Pricing on Request</span>
                    )}
                  </span>
                </div>
                <Link to="/rooms">
                  <button className="flex items-center justify-center h-9 sm:h-11 px-4 sm:px-6 bg-deep-teal hover:bg-slate-charcoal text-warm-white rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors shadow-none gap-1 sm:gap-2 cursor-pointer font-sans duration-300">
                    Book Suite <ArrowRight size={10} className="sm:w-3 sm:h-3" strokeWidth={2.5} />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Verified Guest Reviews Carousel Slider */}
      <SocialProofSection />

      {/* Why Choose Us Section - Pure Luxury Alignment */}
      {whyChooseVisible && (
        <section className="py-24 bg-[#EFEAE1]/20 border-b border-[#D8CBB8]/20 overflow-hidden">
          <div className="container mx-auto px-6 md:px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto">
              
              {/* Left side: Premium Narrative Banner */}
              <div className="lg:col-span-5 space-y-6 text-left">
                <span className="text-[9px] uppercase tracking-[0.25em] font-extrabold text-[#1B4C44] bg-[#1B4C44]/5 border border-[#1B4C44]/10 px-4 py-1.5 rounded-full inline-block">
                  {whyChooseTagline}
                </span>
                <h2 className="text-3xl md:text-5xl font-heading font-medium tracking-tight text-slate-charcoal leading-[1.1]">
                  {whyChooseHeading} <br/>
                  <span className="italic font-serif font-normal text-[#1B4C44]">{whyChooseHeadingItalic}</span>
                </h2>
                <p className="text-xs md:text-sm text-slate-charcoal/75 leading-relaxed font-sans">
                  {whyChooseDesc1}
                </p>
                <p className="text-xs md:text-sm text-slate-charcoal/75 leading-relaxed font-sans">
                  {whyChooseDesc2}
                </p>
              </div>

              {/* Right side: Clean, luxury transparent grid with thin line-art icons and zero card styling */}
              <div className="lg:col-span-7 grid grid-cols-2 gap-x-6 gap-y-10 md:gap-x-10 md:gap-y-12 text-left">
                {whyChooseItems.filter(item => item.is_visible !== false).map((item, idx) => (
                  <div key={idx} className="col-span-1 flex flex-col items-start space-y-3 group">
                    <span className="text-slate-charcoal/80 transition-transform duration-500 group-hover:scale-110 inline-block select-none">
                      <DynamicIcon name={item.icon || 'Compass'} className="h-10 w-10 text-[#A88C52] group-hover:text-[#1B4C44] transition-colors duration-500" strokeWidth={1} />
                    </span>
                    <div className="space-y-1.5">
                      <span className="text-[8px] md:text-[9px] tracking-widest font-extrabold text-[#A88C52] block font-mono">
                        {item.num || `0${idx + 1}`} / {item.category || 'CARD'}
                      </span>
                      <h4 className="text-[12px] md:text-sm font-heading font-semibold text-slate-charcoal group-hover:text-[#A88C52] transition-colors duration-300 uppercase tracking-wide">
                        {item.title}
                      </h4>
                      <p className="text-[10px] md:text-xs text-slate-charcoal/70 leading-relaxed font-sans text-pretty">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Bento Masonry Gallery Section */}
      {homeGalleryVisible && (
        <section className="py-20 md:py-24 bg-[#F6F4EF] border-t border-[#D8CBB8]/20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col items-center text-center mb-6 md:mb-16 space-y-2 md:space-y-4">
              <span className="uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold text-deep-teal">{homeGalleryBadge}</span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading tracking-tight text-slate-charcoal">Our <span className="italic text-deep-teal font-normal">{homeGalleryHeading}</span></h2>
              <p className="text-[11px] sm:text-sm text-slate-charcoal/70 max-w-sm mx-auto text-center font-sans">
                {homeGalleryDesc}
              </p>
              <div className="pt-2">
                <Link to="/gallery" className="inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest font-bold hover:text-deep-teal transition text-slate-charcoal border-b border-dashed border-deep-teal/40 pb-0.5">
                  Full Gallery <ArrowRight size={12} />
                </Link>
              </div>
            </div>
             
             {(() => {
               const visibleBentoItems = bentoGalleryItems.filter((item: any) => item.is_visible !== false);
               const mappedBentoItems = visibleBentoItems.map((item, idx) => ({
                 image: item.image,
                 title: item.title,
                 category: `Slide ${(idx + 1).toString().padStart(2, "0")}`
               }));
               return (
                 <BentoGallery 
                   items={mappedBentoItems} 
                   theme="light" 
                   borderRadiusClass="rounded-xl"
                   readyToLoad={loadBento}
                 />
               );
             })()}

             <div className="mt-8 flex justify-center md:hidden">
                <Link to="/gallery" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2E3438] border-b border-[#2E3438]/30 pb-1 hover:border-deep-teal hover:text-deep-teal transition-colors">
                  View Full Gallery
                </Link>
             </div>
          </div>
        </section>
      )}

      {/* Elegantly Crafted Call to Action (CTA) Section below Gallery */}
      {homeCtaVisible && (
        <section className="py-20 md:py-28 bg-[#1B4C44] text-[#FAF9F5] relative overflow-hidden text-center">
          {/* Subtle geometric aura or background patterns */}
          <div className="absolute inset-0 bg-radial-at-c from-[#235C52] via-[#1B4C44] to-[#0E332C] opacity-90" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1443632864897-14973fa006cf?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-[0.06] pointer-events-none" />
          
          <div className="container mx-auto px-6 relative z-10 max-w-3xl space-y-6 sm:space-y-8">
            <span className="uppercase tracking-[0.25em] text-[10px] sm:text-xs font-bold text-[#D8CBB8] block">{homeCtaBadge}</span>
            <h2 className="text-3xl sm:text-5xl font-heading tracking-tight leading-tight text-[#FAF9F5]">
              {homeCtaHeading} <br />
              <span className="italic font-serif font-normal text-[#E5D7C3]">{homeCtaHeadingItalic}</span>
            </h2>
            <p className="text-xs sm:text-sm text-warm-white/75 max-w-lg mx-auto font-sans leading-relaxed">
              {homeCtaDesc}
            </p>
            <div className="pt-2">
              <Link to={homeCtaBtnLink}>
                <button className="h-12 px-8 sm:px-10 bg-[#D8CBB8] hover:bg-[#E5D7C3] text-[#0B1714] text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg hover:-translate-y-0.5 cursor-pointer">
                  {homeCtaBtnText}
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}


    </div>
  );
}
