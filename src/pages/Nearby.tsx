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
  X,
  MapPin,
  Activity,
  Map,
  Clock,
  Calendar,
  Heart,
  Info
} from "lucide-react";
import { Footer } from "../components/layout/Footer";
import { useContent } from "@/hooks/useContent";
import PageLoader from "@/components/PageLoader";
import { useEffect } from "react";
import BentoGallery from "@/components/BentoGallery";

interface Trek {
  title: string;
  subtitle: string;
  difficulty: "Easy" | "Moderate" | "Difficult";
  altitude: string;
  distance: string;
  bestSeason: string;
  duration: string;
  highlight: string;
  description: string;
  is_visible?: boolean;
}

const defaultGallery = [
  {
    url: "https://images.unsplash.com/photo-1626082896492-766af4fc6595?auto=format&fit=crop&q=80&w=1200",
    caption: "Sacred shrine bells framing snowbound peaks at Tungnath"
  },
  {
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
    caption: "Double golden mirroring of Chaukhamba Peaks in Deoria Tal Lake"
  },
  {
    url: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200",
    caption: "Ancient mountain ridges fading into twilight orange gradients"
  },
  {
    url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=1200",
    caption: "Rich velvet meadow paths in Chopta valley wreathed in mist"
  },
  {
    url: "https://images.unsplash.com/photo-1598325492474-0fadd61a8685?auto=format&fit=crop&q=80&w=1200",
    caption: "Timeless brass bells hung in sacred cliff shrines"
  },
  {
    url: "https://images.unsplash.com/photo-1566378268012-ea11aa6e7b46?auto=format&fit=crop&q=80&w=1200",
    caption: "Climbing handcarved slate steps in high alpine hamlet walks"
  },
  {
    url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1200",
    caption: "Cosmic starlit night skies hovering over high range basecamps"
  },
  {
    url: "https://images.unsplash.com/photo-1533130061792-64b345e4e837?auto=format&fit=crop&q=80&w=1200",
    caption: "Deep emerald pine canopy and alpine fog surrounding our routes"
  }
];

const defaultSlides = [
  {
    id: "tungnath",
    category: "SACRED SUMMIT TREK",
    title: "Tungnath & Chandrashila",
    subtitle: "The highest shrine of Shiva at 3,680 meters",
    description: "Climb past high alpine ridges and rhododendron groves. A beautiful stone path leads to the 1000-year-old Tungnath Temple. Push further to Chandrashila Peak (4,130m) for a complete 360-degree panorama of Trishul, Nanda Devi, and Chaukhamba snow peaks.",
    image: "https://images.unsplash.com/photo-1626082896492-766af4fc6595?auto=format&fit=crop&q=80&w=2000",
    altitude: "3,680m - 4,130m",
    distance: "4 km from Chopta Base",
    duration: "3-4 Hours"
  },
  {
    id: "triyuginarayan",
    category: "CELESTIAL HERITAGE",
    title: "Triyuginarayan Temple",
    subtitle: "The wedding flame of Shiva & Goddess Parvati",
    description: "A monumental temple of majestic dry grey slate. Built on sacred mythological alignments, it guards the 'Akhand Dhuni'—an eternal wedding fire that has burned continuously for cosmic epochs. Legend confirms pilgrims receive marital blessing by adding timber logs to the holy smoke.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=2000",
    altitude: "1,980m",
    distance: "1.5 Hours Drive from Retreat",
    duration: "Half-Day Trip"
  },
  {
    id: "chopta",
    category: "ALPINE MEADOW REFUGE",
    title: "Chopta Valley",
    subtitle: "The legendary mini switzerland of Uttarakhand",
    description: "Located inside the Kedarnath Wild Forest area, this scenic meadow is surrounded by dense, mossy pine, spruce, and pink cedar. Home to native mountain musk deer and rare monal pheasants, Chopta offers clean mountain winds, starry skies, and boundless green trails.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=2000",
    altitude: "2,680m",
    distance: "1 Hour Scenic Drive from Retreat",
    duration: "Full-Day Exploration"
  },
  {
    id: "kartikswami",
    category: "RIDGE-TOP SHIELD",
    title: "Kartik Swami Mandir",
    subtitle: "A floating cliffside retreat on narrow vertical spires",
    description: "Dramatically built on a sharp, vertical knife-edge ridge at 3,050 meters. Accessible via a scenic 3km trail from Kanakchauri village, the approach is wreathed by hundreds of ringing bell bells offered by travelers. The final deck overlooks clear, endless vertical drop-offs directly facing the snow peak lines.",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=2000",
    altitude: "3,050m",
    distance: "1.5 Hours Scenic Trail Drive",
    duration: "Half-Day Exploration"
  },
  {
    id: "deoriatal",
    category: "GLACIAL REfLECTION",
    title: "Deoria Tal Lake",
    subtitle: "Mirror of the royal Chaukhamba peak summits",
    description: "A magical mountain freshwater lake sheltered inside dense, green oak canopies. At quiet sunrises, the water turns glass-like, throwing an immaculate mirror image of the grand Chaukhamba glaciers. Revered as the place where the Mahabharata's Yaksha tested the Pandavas with cosmic questions.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000",
    altitude: "2,438m",
    distance: "45 Mins to Sari + 3km walk",
    duration: "Half-Day Hike"
  },
  {
    id: "madmaheshwar",
    category: "PANCH KEDAR MYSTERY",
    title: "Madmaheshwar Meadows",
    subtitle: "An isolated green valley under glaciers",
    description: "A gorgeous trek alongside deep glacial canyons, mountain log bridges, and dense bamboo covers. The majestic ancient temple structure is framed within a vast green bugyal (meadow) directly below Kedarnath Peak summits, wreathed in supreme spiritual quietude.",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=2000",
    altitude: "3,490m",
    distance: "Drive to Ransi + 16km trek",
    duration: "1-2 Days Journey"
  },
  {
    id: "guptkashi",
    category: "LOCAL CULTURAL CORE",
    title: "Guptkashi Vishwanath",
    subtitle: "Historic masonry shrines and holy Manikarnika Kund",
    description: "The historical heart of our valley. Wreathed in centuries of legends, it houses the majestic stone Vishwanath Temple matching the design of Kashi. The sacred Manikarnika Kund sits continuously fed by mountain spouts representing Ganga and Yamuna rivers.",
    image: "https://images.unsplash.com/photo-1627855913251-512c1b2f0b78?auto=format&fit=crop&q=80&w=2000",
    altitude: "1,319m",
    distance: "Only 10 Mins from Retreat",
    duration: "1-2 Hours"
  }
];

const defaultTreks: Trek[] = [
  {
    title: "Tungnath Chandrashila Hike",
    subtitle: "Unmatched 360° views from Chandrashila Summit",
    difficulty: "Moderate",
    altitude: "4,130 m",
    distance: "4 km (One Way)",
    bestSeason: "May to November",
    duration: "3-4 Hours",
    highlight: "Highest Shiva Temple in the world, grand snowpeak range visibility",
    description: "A well-laid stone pathway that passes through forests and high altitude alpine meadows. A fantastic trek for beginners looking for majestic Himalayan vistas."
  },
  {
    title: "Deoria Tal Wilderness Walk",
    subtitle: "Pristine lake hike near Sari village",
    difficulty: "Easy",
    altitude: "2,438 m",
    distance: "3 km (One Way)",
    bestSeason: "Year-Round",
    duration: "1.5 Hours",
    highlight: "Double mirroring of Chaukhamba glaciers in emerald waters",
    description: "An easy pine-covered trek starting from Sari village. The lake is wreathed by dense forest canopies and is beautiful for quiet meditation sessions."
  },
  {
    title: "Madmaheshwar Valley Journey",
    subtitle: "A scenic pilgrimage valley of deep silence",
    difficulty: "Difficult",
    altitude: "3,490 m",
    distance: "16 km (One Way)",
    bestSeason: "May to October",
    duration: "1.5 Days",
    highlight: "High mountain glens and massive slate-faced temple complex",
    description: "Trek alongside wild mountain rivers and pristine mountain villages. The meadow surroundings of Madmaheshwar are revered as some of the most beautiful in Rudraprayag."
  },
  {
    title: "Kartik Swami Ridge Trail",
    subtitle: "A floating ridge journey to Kartikeya's altar",
    difficulty: "Easy",
    altitude: "3,050 m",
    distance: "3 km (One Way)",
    bestSeason: "October to June",
    duration: "1.5 Hours",
    highlight: "360-degree lookouts wreathed with hundreds of brass bells",
    description: "A scenic hike starting at Kanakchauri village. Leads to a narrow ridge overlooking deep valleys and beautiful morning sunrises."
  },
  {
    title: "Kedarnath Sacred Ascent",
    subtitle: "The profound pilgrimage trek of India",
    difficulty: "Difficult",
    altitude: "3,584 m",
    distance: "16 km (One Way)",
    bestSeason: "May to November",
    duration: "6-8 Hours",
    highlight: "One of the twelve sacred Jyotirlingas, roaring Mandakini river path",
    description: "The main pedestrian trail leading past Gaurikund. It climbs past glacier walls and winding trails up to the monumental Kedarnath stone temple."
  },
  {
    title: "Vasuki Tal Alpine Lake Trek",
    subtitle: "Moderate high-altitude glacial lake",
    difficulty: "Difficult",
    altitude: "4,135 m",
    distance: "8 km from Kedarnath",
    bestSeason: "June to October",
    duration: "5 Hours",
    highlight: "Breathtaking high altitude pass trail near Kedarnath peaks",
    description: "An adventurous, narrow glacier track starting from the back of Kedarnath temple. Leads to a pristine, sapphire-colored lake reflecting snowbound summits."
  },
  {
    title: "Koteshwar Mahadev Cave Corridor",
    subtitle: "An ancient grotto along the Alaknanda riverbed",
    difficulty: "Easy",
    altitude: "610 m",
    distance: "Short 5-min walk",
    bestSeason: "Year-Round",
    duration: "Half Hour",
    highlight: "Water dripping naturally over river stones",
    description: "Located near Rudraprayag. An extraordinary natural cave retreat where water droplets continuously bathe icons on riverbanks, offering absolute natural cooling."
  },
  {
    title: "Hariyali Devi Siddhapeeth Path",
    subtitle: "Deep forest hike to high high peak temple",
    difficulty: "Moderate",
    altitude: "1,400 m",
    distance: "4 km (One Way)",
    bestSeason: "Year-Round",
    duration: "2-3 Hours",
    highlight: "Surrounded by yellow oak forests and rare avian life",
    description: "A beautiful forest path leading to a peaceful temple at the mountain top, wreathed in high local folklore, absolute peace, and dynamic views."
  }
];

export default function Nearby() {
  const [current, setCurrent] = useState(0);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | "Easy" | "Moderate" | "Difficult">("All");

  const { getValue, loading, content } = useContent();

  const nearbyHeading = getValue('nearby', 'nearby_heading', 'Himalayan Travel Guide');
  const nearbySubheading = getValue('nearby', 'nearby_subheading', 'Coordinates of Rudraprayag');

  const nearbySlideBadge = getValue('nearby', 'nearby_slide_badge', 'Rudraprayag Coordinates');

  const nearbyBentoTagline = getValue('nearby', 'nearby_bento_tagline', 'EXPLORATION DIRECTORY');
  const nearbyBentoHeading = getValue('nearby', 'nearby_bento_heading', 'High Himalayan');
  const nearbyBentoHeadingItalic = getValue('nearby', 'nearby_bento_heading_italic', 'Coordinates');

  const nearbyTreksTagline = getValue('nearby', 'nearby_treks_tagline', 'REGION RESEARCH');
  const nearbyTreksHeading = getValue('nearby', 'nearby_treks_heading', 'Trekking & Valley');
  const nearbyTreksHeadingItalic = getValue('nearby', 'nearby_treks_heading_italic', 'Guide');
  const nearbyTreksDesc = getValue('nearby', 'nearby_treks_desc', 'Expert-curated treks ranging from easy heritage walks to challenging high-altitude ascents through pristine Himalayan terrain.');

  const nearbyScenesTagline = getValue('nearby', 'nearby_scenes_tagline', 'VISUAL JOURNAL');
  const nearbyScenesHeading = getValue('nearby', 'nearby_scenes_heading', 'Glances of');
  const nearbyScenesHeadingItalic = getValue('nearby', 'nearby_scenes_heading_italic', 'Rudraprayag');
  const nearbyScenesDesc = getValue('nearby', 'nearby_scenes_desc', 'Breathtaking glances of alpine lakes, high altitude meadows, ringing brass bells, and misty pine routes. Click components to expand view.');

  const nearbyCtaBadge = getValue('nearby', 'nearby_cta_badge', 'A peaceful stay awaits you');
  const nearbyCtaHeading = getValue('nearby', 'nearby_cta_heading', 'Trek the peaks.');
  const nearbyCtaHeadingItalic = getValue('nearby', 'nearby_cta_heading_italic', 'Find your peace.');
  const nearbyCtaDesc = getValue('nearby', 'nearby_cta_desc', 'The Vedic Himalaya Retreat is built at Guptkashi, offering easy transit and quiet evenings after high-altitude treks.');
  const nearbyCtaBtnText = getValue('nearby', 'nearby_cta_btn_text', 'Reserve Your Basecamp Stay');
  const nearbyCtaBtnLink = getValue('nearby', 'nearby_cta_btn_link', '/rooms');

  // Section Visibility Settings
  const tourVisible = getValue('nearby', 'nearby_tour_visible', 'true') !== 'false';
  const treksVisible = getValue('nearby', 'nearby_treks_visible', 'true') !== 'false';
  const galleryVisible = getValue('nearby', 'nearby_gallery_visible', 'true') !== 'false';

  let dbSlides = [];
  try {
    const rawSlidesStr = getValue('nearby', 'nearby_slides', '[]');
    dbSlides = rawSlidesStr ? JSON.parse(rawSlidesStr) : [];
  } catch (e) {
    console.error("Failed to parse nearby slides:", e);
  }
  if (!dbSlides || dbSlides.length === 0) {
    dbSlides = [...defaultSlides];
  }
  const slides = dbSlides.filter((s: any) => s.is_visible !== false);

  let dbTreks: Trek[] = [];
  try {
    const rawTreksStr = getValue('nearby', 'treks_directory', '[]');
    dbTreks = rawTreksStr ? JSON.parse(rawTreksStr) : [];
  } catch (e) {
    console.error("Failed to parse treks directory:", e);
  }
  if (!dbTreks || dbTreks.length === 0) {
    dbTreks = [...defaultTreks];
  }
  const treksDirectory = dbTreks.filter((t: any) => t.is_visible !== false);

  let dbGallery = [];
  try {
    const rawGalleryStr = getValue('nearby', 'nearby_gallery', '[]');
    dbGallery = rawGalleryStr ? JSON.parse(rawGalleryStr) : [];
  } catch (e) {
    console.error("Failed to parse nearby gallery:", e);
  }
  if (!dbGallery || dbGallery.length === 0) {
    dbGallery = [...defaultGallery];
  }
  const galleryPhotos = dbGallery.filter((p: any) => p.is_visible !== false);

  const totalSlides = slides.length + 1; // slides + 1 final Explorer Directory Screen

  // Clamp current index if slides array shrinks dynamically
  useEffect(() => {
    if (current >= totalSlides) {
      setCurrent(Math.max(0, totalSlides - 1));
    }
  }, [totalSlides, current]);

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

  const onTrekLocationClick = (idx: number) => {
    setCurrent(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedPhoto = selectedPhotoIdx !== null ? galleryPhotos[selectedPhotoIdx] : null;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIdx !== null) {
      setSelectedPhotoIdx((selectedPhotoIdx + 1) % galleryPhotos.length);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIdx !== null) {
      setSelectedPhotoIdx((selectedPhotoIdx - 1 + galleryPhotos.length) % galleryPhotos.length);
    }
  };

  const isFinalScreen = !tourVisible || current === slides.length;

  // Filter trekking list
  const filteredTreks = treksDirectory.filter(trek => {
    if (difficultyFilter === "All") return true;
    return trek.difficulty === difficultyFilter;
  });

  // Prevent flash of fallback text while CMS content loads
  if (loading && content.length === 0) return <PageLoader />;

  return (
    <div className={`relative w-full bg-[#0B1714] text-[#FAF9F5] font-sans selection:bg-[#A88C52] selection:text-[#0B1714] ${
      isFinalScreen ? "min-h-screen overflow-y-auto" : "h-[100dvh] overflow-hidden"
    }`}>
      
      {/* Background slide renderer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <AnimatePresence mode="wait">
          {!isFinalScreen ? (
            <motion.div
              key={slides[current].id}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${slides[current].image}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B1714]/95 via-[#0B1714]/50 to-[#0B1714]/15" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1714] via-transparent to-[#0B1714]/60" />
            </motion.div>
          ) : (
            // Immediat ambient visual base for Directory view
            <motion.div
              key="directory-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-b from-[#0B1714] to-[#0d1f1a]"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Interactive slider view */}
      {!isFinalScreen ? (
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
                  {slides[current].category}
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
                  key={`slide-${slides[current].id}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-3"
                >
                  <p className="text-[11px] font-bold text-[#A88C52] uppercase tracking-[0.2em]">
                    {nearbySlideBadge}
                  </p>
                  
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#FAF9F5] leading-tight tracking-wide font-normal">
                    {slides[current].title}
                  </h1>
                  
                  <p className="text-sm sm:text-base font-serif text-[#E5D7C3] italic font-light tracking-wide">
                    {slides[current].subtitle}
                  </p>

                  <div className="max-w-md pt-2">
                    <p className="text-xs sm:text-sm text-[#FAF9F5]/90 leading-relaxed font-sans text-left text-pretty drop-shadow-md">
                      {slides[current].description}
                    </p>
                  </div>

                  {/* Highlights Grid inside Slide */}
                  <div className="grid grid-cols-3 gap-4 pt-6 max-w-md border-t border-white/10 mt-6 text-left">
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase tracking-widest text-[#A88C52] block font-mono">Max Altitude</span>
                      <span className="text-xs font-bold text-[#FAF9F5] block font-serif">{slides[current].altitude}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase tracking-widest text-[#A88C52] block font-mono">Distance</span>
                      <span className="text-xs font-bold text-[#FAF9F5] block font-serif">{slides[current].distance}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase tracking-widest text-[#A88C52] block font-mono">Recommended</span>
                      <span className="text-xs font-bold text-[#FAF9F5] block font-serif">{slides[current].duration}</span>
                    </div>
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
        // Final Screen: Comprehensive Bento Explorer View with Trek Directory & Visual Scene Archives
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 w-full flex flex-col pt-36"
        >
          <div className="container mx-auto px-6 sm:px-12 md:px-20 lg:px-32 max-w-7xl mb-24">
            
            {/* Header section matches Experiences layout */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-8 mb-16 gap-4">
              <div className="space-y-3">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-extrabold text-[#A88C52] block">
                  {nearbyBentoTagline}
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif text-[#FAF9F5] font-light leading-none">
                  {nearbyBentoHeading} <span className="italic font-normal text-[#E5D7C3]">{nearbyBentoHeadingItalic}</span>
                </h2>
              </div>
              
              <button 
                onClick={() => setCurrent(0)}
                className="text-xs font-bold uppercase tracking-widest text-[#A88C52] hover:text-[#FAF9F5] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                Back to Slide Tour <ChevronRight size={14} />
              </button>
            </div>

            {/* Curated Bento Grid of Destinations identical to Experience design */}
            {slides.length > 0 && (() => {
              const bentoOrder = [0, 2, 3, 5, 4, 1];
              const mappedBentoItems = bentoOrder.map((slideIdx) => {
                const slide = slides[slideIdx];
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
                        onTrekLocationClick(originalIndex);
                      }
                    }} 
                    theme="dark"
                    borderRadiusClass="rounded-xl"
                  />
                </div>
              );
            })()}

            {/* Detailed Trekking & Trails Directory Section (Research added) */}
            {treksVisible && treksDirectory.length > 0 && (
              <div className="mb-24 scroll-mt-24" id="trek-directory">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 mb-10 gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-extrabold text-[#A88C52] flex items-center gap-2">
                      <Activity size={12} className="text-[#A88C52]" /> {nearbyTreksTagline}
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-serif text-[#FAF9F5] font-light">
                      {nearbyTreksHeading} <span className="italic font-normal text-[#E5D7C3]">{nearbyTreksHeadingItalic}</span>
                    </h3>
                    <p className="text-xs text-[#FAF9F5]/60 max-w-sm font-sans leading-relaxed mt-2 text-left">
                      {nearbyTreksDesc}
                    </p>
                  </div>

                  {/* Difficulty Filters */}
                  <div className="flex flex-wrap gap-2">
                    {(["All", "Easy", "Moderate", "Difficult"] as const).map(difficulty => (
                      <button
                        key={difficulty}
                        onClick={() => setDifficultyFilter(difficulty)}
                        className={`px-4 py-2 rounded-lg text-[9.5px] uppercase font-bold tracking-widest font-mono border transition-all duration-300 cursor-pointer ${
                          difficultyFilter === difficulty
                            ? "bg-[#A88C52] text-[#0B1714] border-[#A88C52]"
                            : "bg-white/5 text-[#FAF9F5]/70 border-white/10 hover:border-white/35 hover:text-white"
                        }`}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid representation of detailed trek info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredTreks.map((trek, idx) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        key={trek.title}
                        className="bg-white/5 border border-white/10 hover:border-[#A88C52]/30 p-6 rounded-2xl flex flex-col justify-between hover:bg-white/[0.07] transition-all group shadow-md"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className={`inline-block px-2.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest font-mono border ${
                                trek.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" :
                                trek.difficulty === "Moderate" ? "bg-amber-500/10 text-amber-400 border-amber-500/25" :
                                "bg-rose-500/10 text-rose-400 border-rose-500/25"
                              }`}>
                                {trek.difficulty}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono font-medium text-white/50">{trek.altitude}</span>
                          </div>

                          <div>
                            <h4 className="text-md sm:text-lg font-serif text-[#FAF9F5] tracking-wide font-normal group-hover:text-[#A88C52] transition-colors">
                              {trek.title}
                            </h4>
                            <p className="text-[11px] text-[#E5D7C3] italic mt-0.5">{trek.subtitle}</p>
                          </div>

                          <p className="text-xs text-[#FAF9F5]/75 leading-relaxed font-sans font-light text-left">
                            {trek.description}
                          </p>

                          <div className="h-px bg-white/10" />

                          {/* Specs list */}
                          <div className="grid grid-cols-2 gap-3 text-[10.5px] font-sans text-white/60">
                            <div>
                              <span className="text-[8px] uppercase tracking-wider text-[#A88C52] block font-mono">Distance</span>
                              <span className="font-semibold block text-white/80">{trek.distance}</span>
                            </div>
                            <div>
                              <span className="text-[8px] uppercase tracking-wider text-[#A88C52] block font-mono">Best Period</span>
                              <span className="font-semibold block text-white/80">{trek.bestSeason}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[10.5px]">
                          <span className="text-[#A88C52] flex items-center gap-1 font-semibold">
                            <Clock size={11} /> {trek.duration} duration
                          </span>
                          <span className="text-[9.5px] font-mono uppercase text-white/40 tracking-wider">
                            High Altitude
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Scenic Visual Glances Layout */}
            {galleryVisible && galleryPhotos.length > 0 && (
              <div className="mb-24">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 mb-10 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-extrabold text-[#A88C52] flex items-center gap-2">
                      <Camera size={12} /> {nearbyScenesTagline}
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-serif text-[#FAF9F5] font-light">
                      {nearbyScenesHeading} <span className="italic font-normal text-[#E5D7C3]">{nearbyScenesHeadingItalic}</span>
                    </h3>
                  </div>
                  <p className="text-xs text-[#FAF9F5]/60 max-w-sm font-sans leading-relaxed">
                    {nearbyScenesDesc}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {galleryPhotos.map((photo, index) => (
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
                      
                      {/* Dark overlay showing description on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <p className="text-[10px] sm:text-xs font-sans text-[#FAF9F5] font-medium tracking-wide">
                          {photo.caption}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Magnificent Closing Call To Action card */}
            <div className="relative rounded-2xl bg-gradient-to-r from-[#1B4C44]/40 to-[#122A22]/60 border border-[#FAF9F5]/10 p-8 sm:p-12 md:p-16 text-center max-w-4xl mx-auto overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#A88C52_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05]" />
              
              <div className="relative z-10 space-y-6">
                <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-[#A88C52] bg-[#A88C52]/10 px-4 py-1.5 rounded-full inline-block">
                  {nearbyCtaBadge}
                </span>
                
                <h3 className="text-3xl sm:text-4xl font-serif text-[#FAF9F5] font-light tracking-wide leading-tight">
                  {nearbyCtaHeading} <br />
                  <span className="italic font-normal text-[#E5D7C3]">{nearbyCtaHeadingItalic}</span>
                </h3>
                
                <p className="text-xs sm:text-sm text-[#FAF9F5]/70 max-w-md mx-auto leading-relaxed font-sans">
                  {nearbyCtaDesc}
                </p>
                
                <div className="pt-2">
                  <Link to={nearbyCtaBtnLink}>
                    <button className="h-12 px-10 bg-[#FAF9F5] hover:bg-[#A88C52] text-[#0B1714] font-extrabold hover:text-[#FAF9F5] text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-xl cursor-pointer">
                      {nearbyCtaBtnText}
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

// Compact custom icon component representing dynamic mountain lines
function OverpackMountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
