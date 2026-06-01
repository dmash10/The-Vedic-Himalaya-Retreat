import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, Flame, Wind, Sparkles, Utensils, Coffee, ChevronRight, Check, ChevronLeft } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { useMenu } from "@/hooks/useMenu";
import PageLoader from "@/components/PageLoader";

function DynamicIcon({ name, className = "h-4 w-4", strokeWidth = 1.5 }: { name: string; className?: string; strokeWidth?: number }) {
  const Icon = (LucideIcons as any)[name];
  if (!Icon) return <Leaf className={className} strokeWidth={strokeWidth} />;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}

export default function Dining() {
  const easePremium = [0.22, 1, 0.36, 1] as const;
  const { getValue, loading, content } = useContent();
  const { menuItems } = useMenu();

  // Prevent flash of fallback text while CMS content loads
  if (loading && content.length === 0) return <PageLoader />;


  const diningHeading = getValue('dining', 'dining_heading', 'Pure Sattvik Dining');
  const diningSubheading = getValue('dining', 'dining_subheading', 'Nourishment for Body & Soul');
  const diningImage = getValue('dining', 'dining_image', '');
  const diningHours = getValue('dining', 'dining_hours', '7:30 AM - 10:00 PM');
  const diningDietary = getValue('dining', 'dining_dietary', 'Pure Vegetarian Sattvik Cuisine');

  const hoursVisible = getValue('dining', 'hours_visible', 'true') !== 'false';
  const dietaryVisible = getValue('dining', 'dietary_visible', 'true') !== 'false';
  const specialtyVisible = getValue('dining', 'specialty_visible', 'true') !== 'false';
  const alchemyVisible = getValue('dining', 'alchemy_visible', 'true') !== 'false';
  const diningPolaroidsVisible = getValue('dining', 'dining_polaroids_visible', 'true') !== 'false';

  // New Visibility Toggles
  const diningHeroVisible = getValue('dining', 'dining_hero_visible', 'true') !== 'false';
  const diningPhilosophyVisible = getValue('dining', 'dining_philosophy_visible', 'true') !== 'false';
  const diningRitualsVisible = getValue('dining', 'dining_rituals_visible', 'true') !== 'false';
  const diningPavilionVisible = getValue('dining', 'dining_pavilion_visible', 'true') !== 'false';
  const diningVowsVisible = getValue('dining', 'dining_vows_visible', 'true') !== 'false';

  // New Text Fields
  const diningHeroSubtitle = getValue('dining', 'dining_hero_subtitle', 'Dine at the Sanctuary');
  const diningPhilosophyTagline = getValue('dining', 'dining_philosophy_tagline', 'Alpine Harvest Dining');
  const diningPhilosophyHeading = getValue('dining', 'dining_philosophy_heading', 'Nourished by the High Valley Peaks');
  const diningPhilosophyDesc = getValue('dining', 'dining_philosophy_desc', "Savor the Mandakini basin's untouched alpine fields with hyper-local, certified Sattvik recipes. Every grain of red millet and every cup of fresh spring dew has been collected by family handmills in the tiny terrace properties clinging high above the valley dust.");
  
  const diningAlchemyTagline = getValue('dining', 'dining_alchemy_tagline', 'ANCIENT CULINARY VESSELED ALCHEMY');
  const diningAlchemyHeading = getValue('dining', 'dining_alchemy_heading', 'Raw Vessels, Living Nourishment');
  const diningAlchemyDesc = getValue('dining', 'dining_alchemy_desc', 'We reject modern industrial metals, baking on ancestral stone and slow-simmering inside native clays and seasoned hand-beaten mountain irons.');
  
  const diningPolaroidsTagline = getValue('dining', 'dining_polaroids_tagline', 'SATTVIK VISUAL JOURNAL');
  const diningPolaroidsHeading = getValue('dining', 'dining_polaroids_heading', 'A Taste of Pure Harvests');
  const diningPolaroidsDesc = getValue('dining', 'dining_polaroids_desc', "Take a visual journey through our kitchen's daily bread, herbal infusions, and fireside seating configurations designed for pilgrims.");
  
  const diningRitualsTagline = getValue('dining', 'dining_rituals_tagline', 'THE NOURISHMENT CYCLE');
  const diningRitualsHeading = getValue('dining', 'dining_rituals_heading', 'A Day of Aromatic Rituals');
  const diningRitualsDesc = getValue('dining', 'dining_rituals_desc', 'Ayurvedic nutrition follows the sun. Click through our daily cycles to view how we structure nourishment throughout your stay.');
  
  const diningPavilionTagline = getValue('dining', 'dining_pavilion_tagline', 'THE MAIN SALON');
  const diningPavilionHeading = getValue('dining', 'dining_pavilion_heading', 'The Slate Pavilion');
  const diningPavilionDesc1 = getValue('dining', 'dining_pavilion_desc1', 'Framed by massive floor-to-ceiling panoramic glass panes, our signature interior space hovers above the misty Guptkashi gorge. Sit inside a secure warm sanctuary with uninterrupted views of the majestic snowline of Chaukhamba peaks.');
  const diningPavilionDesc2 = getValue('dining', 'dining_pavilion_desc2', 'Guests gather around cold-slab slate fireplace tables while foods are slow-cooked using traditional wood fuel. We avoid processed white sugars, chemical vegetable oils, and commercial steel pans—cooking inside clay pots and raw regional iron vessels.');
  const diningPavilionImage = getValue('dining', 'dining_pavilion_image', '');
  const diningPavilionDresscode = getValue('dining', 'dining_pavilion_dresscode', 'Monastic Ease');
  
  const diningVowsTagline = getValue('dining', 'dining_vows_tagline', 'SATTVIK NUTRIMENT');
  const diningVowsHeading1 = getValue('dining', 'dining_vows_heading1', 'Earth to Soul');
  const diningVowsHeading2 = getValue('dining', 'dining_vows_heading2', 'Purity Vows');
  const diningVowsDesc1 = getValue('dining', 'dining_vows_desc1', 'True physical restoration lies in complete resonance with the terrain. High high-altitude hiking requires provisions that digest lightly, hydrate cells thoroughly, and calm mental distraction.');
  const diningVowsDesc2 = getValue('dining', 'dining_vows_desc2', 'We strictly discard industrial white sugars, synthesized chemical salts, processed lard oils, and preserving chemicals. Every kitchen process is pure, steady, and completed by hand.');
  
  const diningSpecialtyTagline = getValue('dining', 'dining_specialty_tagline', 'Daily Provisions Menu');
  const diningSpecialtyHeading1 = getValue('dining', 'dining_specialty_heading1', 'The Daily');
  const diningSpecialtyHeading2 = getValue('dining', 'dining_specialty_heading2', 'Harvest Communion');
  const diningSpecialtyDesc = getValue('dining', 'dining_specialty_desc', 'Slowly constructed dishes prepared fresh each sunrise and twilight, complementary to all resident guests of our hillside valleys.');
  
  const diningMenuTagline = getValue('dining', 'dining_menu_tagline', 'PUBLIC DINING CODES');
  const diningMenuHeading1 = getValue('dining', 'dining_menu_heading1', 'The Restaurant');
  const diningMenuHeading2 = getValue('dining', 'dining_menu_heading2', 'A la Carte');
  const diningMenuDesc = getValue('dining', 'dining_menu_desc', 'Carefully curated items available for order. All dishes are prepared from seasonal ridge-grown crops and organic valley spices.');
  
  const diningFooterWarning = getValue('dining', 'dining_footer_warning', 'Meals are crafted specifically to zero out village farm wastes. Please notify your table captain 2 hours in advance for specific allergy or custom diets.');

  let specialtyDishes = [];
  try {
    specialtyDishes = JSON.parse(getValue('dining', 'specialty_dishes', '[]'));
  } catch (e) {}
  if (!specialtyDishes || specialtyDishes.length === 0) {
    specialtyDishes = [
      {
        num: "01",
        title: "Vessel of Sacred Gehat (Garhwal Valley)",
        desc: "Slow-simmered medicinal black gehat beans prepared in heavy ironware, paired with unpolished red rice grown in the irrigated terrace fields of Triyuginarayan, topped with hand-churned mountain cow A2 ghee.",
        energy: "Sattvik Vitality",
        origin: "Local Ridge Farms",
        attribute: "Pilgrimage Restorative",
        category: "grains"
      },
      {
        num: "02",
        title: "Hand-Rolled Mandua Flatbreads & Rhododendron Extract",
        desc: "Stone-ground alpine ragi crop griddle breads baked over open deodar woods on porous earthen plates. Served warm with raw wild mountain honey and salted organic walnut dust.",
        energy: "Prana Restoration",
        origin: "High Guptkashi Ridge",
        attribute: "Alkaline Fuel",
        category: "grains"
      },
      {
        num: "03",
        title: "Templed Phaanu Claypot stew",
        desc: "An organic pureed stew of native hillside soybeans, slow-simmered for nine hours inside local earthen vessels, tempered with mountain celery root and active wild rock caraway.",
        energy: "Sacred Food",
        origin: "Kedarnath Foothills",
        attribute: "Cellular Digestion",
        category: "stews"
      },
      {
        num: "04",
        title: "Infused Ginger-Tulsi Somras",
        desc: "A hot purifying wild herbal beverage brewed from hand-gathered holy basil stems, crushed mountain mountain ginger roots, and crystallized forest honey, balanced to boost respiratory ease.",
        energy: "Meadow Tonic",
        origin: "Retreat Herbal Garden",
        attribute: "Active Peak Warmth",
        category: "elixirs"
      }
    ];
  }
  const visibleSpecialtyDishes = specialtyDishes.filter((d: any) => d.is_visible !== false);

  let kitchenAlchemies = [];
  try {
    kitchenAlchemies = JSON.parse(getValue('dining', 'kitchen_alchemies', '[]'));
  } catch (e) {}
  if (!kitchenAlchemies || kitchenAlchemies.length === 0) {
    kitchenAlchemies = [
      {
        id: "clay",
        title: "The Earthen Mudpot",
        tagline: "9-HOUR EMBERS & POROUS CLAY",
        desc: "Vessel walls shaped by hand from Mandakini riverbed silt. As the pots simmer slow over low heat for nine hours, the porous natural minerals bind with grain stars, locking in unrefined earth elements with zero synthetic reactions so typical of commercial kitchens.",
        illustration: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
        vessel: "Traditional Himalayan Claypots",
        benefit: "Retains high soil mineral density",
        smoke: "Deodar log whispers",
        accentColor: "#1B4C44"
      },
      {
        id: "iron",
        title: "The Heavy Ironware",
        tagline: "RAW CAST ROASTING",
        desc: "Pre-heated heavy black iron cauldrons, seasoned thoroughly for generations. Gehat beans and therapeutic wild celery roots are slow-cooked under high iron weights, infusing raw minerals and retaining dense nutrients.",
        illustration: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
        vessel: "Hand-Beaten Mountain Ironware",
        benefit: "Supports micro-biological blood health",
        smoke: "Cedar timber glow",
        accentColor: "#A88C52"
      },
      {
        id: "embers",
        title: "The Timber Hearth",
        tagline: "BAKED ABOVE SPECIATED ASHES",
        desc: "Our hearth uses clean fallen deodar timber logs. Flour is ground, kneaded in hand-beaten bronze pans, and slow-baked on hot regional flagstones using only the radiant warmth of embers. Essential oils of deodar bake right in.",
        illustration: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
        vessel: "Fallen Deodar Bark Hearth",
        benefit: "Purifies respiratory pathways naturally",
        smoke: "Pine essence atmosphere",
        accentColor: "#2E3438"
      }
    ];
  }
  const visibleKitchenAlchemies = kitchenAlchemies.filter((a: any) => a.is_visible !== false);

  let diningPolaroids = [];
  try {
    diningPolaroids = JSON.parse(getValue('dining', 'dining_polaroids', '[]'));
  } catch (e) {}
  if (!diningPolaroids || diningPolaroids.length === 0) {
    diningPolaroids = [
      {
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
        title: "Vedic Thali",
        desc: "NATIVE VALLEY SATTVIK NUTRIMENT"
      },
      {
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800",
        title: "Somras Brews",
        desc: "PURIFYING SUNRISE HERBAL ELIXIRS"
      },
      {
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000",
        title: "Slate Fires",
        desc: "WOOD-FIRED SLOW CLAYPOT AMBIENCE"
      },
      {
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
        title: "The Main Salon",
        desc: "PANORAMIC CHALET WINDOW VIEWS"
      }
    ];
  }
  const visibleDiningPolaroids = diningPolaroids.filter((p: any) => p.is_visible !== false);

  const [selectedRitual, setSelectedRitual] = useState("morning");
  const [activeSpecialtyCategory, setActiveSpecialtyCategory] = useState("all");
  const [activeMenuCategory, setActiveMenuCategory] = useState("all");
  const [activeVowDetail, setActiveVowDetail] = useState<string | null>("purity");
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeAlchemy, setActiveAlchemy] = useState("clay");

  const activeAlchemyData = visibleKitchenAlchemies.find((a: any) => a.id === activeAlchemy) || visibleKitchenAlchemies[0] || kitchenAlchemies[0];

  const nextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % Math.max(1, visibleDiningPolaroids.length));
  };

  const prevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + visibleDiningPolaroids.length) % Math.max(1, visibleDiningPolaroids.length));
  };

  let dailyRituals = [];
  try {
    dailyRituals = JSON.parse(getValue('dining', 'daily_rituals', '[]'));
  } catch (e) {}
  if (!dailyRituals || dailyRituals.length === 0) {
    dailyRituals = [
      {
        id: "morning",
        time: "06:00 – SUNRISE CLEANSING",
        title: "Prana Awakening Brews",
        desc: "We greet high altitude dawn with hot, raw ginger-rhododendron somras and hand-tied medicinal herbs. Perfected to stabilize the breathing rhythm and spark warm circulation before a cold mountain traverse.",
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800",
        stats: { warmth: "Optimal", focus: "Spiritual", herbs: "Wild Tulsi & Fennel" }
      },
      {
        id: "noon",
        time: "12:30 – TERRACE REPLENISHMENT",
        title: "High Noon Mountain Thali",
        desc: "A complete nutrient-dense lunch centering on slow-steamed regional red rice, organic green lentils, and fresh-baked local ragi level-breads. Designed to deliver deep plant-based iron and natural minerals.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
        stats: { warmth: "Moderate", focus: "Vitality", herbs: "Celery & Coriander" }
      },
      {
        id: "sunset",
        time: "18:00 – SUNSET SECLUSION",
        title: "Chaukhamba Fireplace Stews",
        desc: "Gathering as twilight colors the Snowy Peaks, we serve warm claypot legume stew (Phaanu) and toasted barley cakes. Light, easily digested, and highly grounding for a restorative sleep inside the alpine crispness.",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
        stats: { warmth: "Deep Heating", focus: "Restorative", herbs: "Wild Rock Thyme" }
      }
    ];
  }
  const visibleDailyRituals = dailyRituals.filter((r: any) => r.is_visible !== false);

  let diningVows = [];
  try {
    diningVows = JSON.parse(getValue('dining', 'dining_vows', '[]'));
  } catch (e) {}
  if (!diningVows || diningVows.length === 0) {
    diningVows = [
      {
        id: "purity",
        icon: "Leaf",
        title: "100% Hyper-Local",
        desc: "All components grown within 25 miles by traditional hillside agricultural collectives.",
        expanded_desc: "We coordinate directly with local ridge planters in Triyuginarayan and neighboring organic farms, sourcing red ragi and handraised root greens daily."
      },
      {
        id: "embers",
        icon: "Flame",
        title: "Cedar Embers Only",
        desc: "We completely discard petroleum gas, slow-baking over fallen spruce cedar logs.",
        expanded_desc: "The smoke from mountain deodar wood naturally flavors flour layers, locking in dynamic organic oils that sustain digestion during chilly nights."
      },
      {
        id: "salt",
        icon: "Check",
        title: "Glacier Salt Rock",
        desc: "Enhanced strictly with hand-extracted pink rock salt layers and woodland wild thyme.",
        expanded_desc: "No processed sodium. Sourced transparently from high altitude cliff layers, reducing arterial tension and ground energy drop."
      },
      {
        id: "water",
        icon: "Wind",
        title: "High Ridge Springs",
        desc: "Each recipe is constructed and finished with ultra-hydrating filtered local peak springs.",
        expanded_desc: "Passed through active river sand filter bed systems, maintaining high alkalinity and zero trace metals."
      }
    ];
  }
  const visibleDiningVows = diningVows.filter((v: any) => v.is_visible !== false);

  const visibleMenuItems = menuItems.filter(item => item.is_visible !== false);
  const filteredMenuItems = activeMenuCategory === "all"
    ? visibleMenuItems
    : visibleMenuItems.filter(item => item.category === activeMenuCategory);

  const activeRitualData = visibleDailyRituals.find((r: any) => r.id === selectedRitual) || visibleDailyRituals[0];

  const heroImageSrc = diningImage || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1800";

  return (
    <div className="bg-[#FAF9F5] text-[#2E3438] pb-24 min-h-screen font-sans antialiased overflow-x-hidden">
      
      {/* 1. LUXURY FULL-SCREEN HERO */}
      {diningHeroVisible && (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Cinematic Backdrop Image */}
          <div className="absolute inset-0">
            <img 
              src={heroImageSrc}
              className="w-full h-full object-cover scale-[1.03] brightness-[0.75]"
              alt="Handmade rustic bakery and warm tea table by the hills"
              referrerPolicy="no-referrer"
            />
            {/* Gentle darkening brand-aligned gradient overlays to ensure text has absolute readability */}
            <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2E3438] via-black/25 to-transparent" />
          </div>

          {/* Hero Copy overlay */}
          <div className="relative z-10 text-center px-6 max-w-4xl space-y-4 md:space-y-6 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: easePremium }}
            >
              <span className="font-script text-3xl md:text-5.5xl text-[#D8CBB8] tracking-wide block">
                {diningHeroSubtitle}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: easePremium, delay: 0.1 }}
              className="text-4xl md:text-7xl font-serif text-white font-light tracking-tight leading-[1.05]"
            >
              {diningHeading}
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="w-16 h-[1.5px] bg-[#D8CBB8]/60 mx-auto"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-white/90 text-xs md:text-sm max-w-lg mx-auto leading-relaxed tracking-wider font-light"
            >
              {diningSubheading}
            </motion.p>
          </div>
        </section>
      )}

      {/* 2. CORE PHILOSOPHY INTRO */}
      {diningPhilosophyVisible && (
        <section className="container mx-auto px-5 md:px-10 max-w-4xl text-center pt-20 md:pt-28 pb-10">
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="font-script text-2xl md:text-4.5xl text-[#A88C52]">
              {diningPhilosophyTagline}
            </span>
            <h2 className="text-3xl md:text-5.5xl font-serif text-[#1B4C44] tracking-normal font-light leading-tight">
              {diningPhilosophyHeading}
            </h2>
            <div className="w-12 h-[1px] bg-stone-300 mx-auto my-4" />
            <p className="text-xs md:text-md text-[#2E3438]/80 leading-relaxed font-light font-sans max-w-xl mx-auto">
              {diningPhilosophyDesc}
            </p>
          </div>
        </section>
      )}

      {/* UNIQUE INTERACTIVE VESSEL ALCHEMY SECTION */}
      {alchemyVisible && visibleKitchenAlchemies.length > 0 && (
        <section className="py-20 md:py-28 bg-[#FAF9F5] border-t border-stone-200 relative overflow-hidden">
          {/* Subtle decorative grid lines */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#EFEAE1]/20 to-transparent pointer-events-none" />

          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Alchemical Choices (interactive tabs) */}
              <div className="lg:col-span-5 space-y-8 text-left z-10">
                <div className="space-y-3">
                  <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-[#A88C52] block font-mono">
                    {diningAlchemyTagline}
                  </span>
                  <h2 className="text-3xl sm:text-5xl lg:text-5.5xl font-serif text-[#2E3438] leading-[1.1] font-light">
                    {diningAlchemyHeading.split(',')[0]}, <br /> 
                    <span className="italic font-normal text-[#1B4C44] font-serif">{diningAlchemyHeading.split(',')[1] || ''}</span>
                  </h2>
                  <p className="text-xs md:text-sm text-slate-charcoal/70 font-sans leading-relaxed">
                    {diningAlchemyDesc}
                  </p>
                </div>

                {/* Vertical selector items */}
                <div className="space-y-4 pt-4">
                  {visibleKitchenAlchemies.map((alc: any) => (
                    <button
                      key={alc.id}
                      onClick={() => {
                        setActiveAlchemy(alc.id);
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 cursor-pointer relative overflow-hidden group ${
                        activeAlchemy === alc.id 
                          ? "bg-white border-[#A88C52] shadow-[0_10px_30px_rgba(168,140,82,0.08)] scale-[1.01]" 
                          : "bg-stone-50/50 border-stone-200/60 hover:bg-white hover:border-stone-300"
                      }`}
                    >
                      {/* Active highlight color pill */}
                      <div 
                        className="w-1 h-12 rounded-full transition-transform duration-300"
                        style={{ 
                          backgroundColor: alc.accentColor,
                          transform: activeAlchemy === alc.id ? "scaleY(1)" : "scaleY(0.2)"
                        }} 
                      />
                      
                      <div className="flex-1">
                        <span className="text-[8px] tracking-widest font-black uppercase font-mono" style={{ color: alc.accentColor }}>
                          {alc.tagline}
                        </span>
                        <h4 className="text-sm md:text-md font-serif text-slate-charcoal mt-0.5">
                          {alc.title}
                        </h4>
                      </div>

                      <ChevronRight 
                        size={16} 
                        className={`transition-transform duration-300 ${
                          activeAlchemy === alc.id ? "translate-x-1 opacity-100" : "opacity-30 group-hover:opacity-75"
                        }`} 
                        style={{ color: alc.accentColor }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: 3D Parallax Tilt Custom Showcase Card */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center pt-8 lg:pt-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeAlchemy}
                    initial={{ opacity: 0, scale: 0.96, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -15 }}
                    transition={{ duration: 0.5, ease: easePremium }}
                    className="w-full max-w-xl"
                  >
                    {/* Clean, elegant static container */}
                    <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-[0_30px_70px_rgba(46,52,56,0.12)] group">
                      {/* Image with normal display */}
                      <img
                        src={activeAlchemyData.illustration}
                        className="absolute inset-0 w-full h-full object-cover brightness-[0.7] transition-all duration-700 ease-out group-hover:scale-102"
                        alt={activeAlchemyData.title}
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Darkening Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                      {/* Flat Elegant Details overlay */}
                      <div className="absolute bottom-6 left-6 right-6 z-20 text-white flex flex-col justify-end text-left select-none">
                        <span className="text-[8px] font-mono tracking-widest text-[#D8CBB8] uppercase font-bold">
                          {activeAlchemyData.tagline}
                        </span>
                        <h3 className="text-xl md:text-3xl font-serif text-white mt-1">
                          {activeAlchemyData.title}
                        </h3>
                        <p className="text-[11.5px] md:text-xs text-white/80 font-sans mt-2 leading-relaxed max-w-md font-light">
                          {activeAlchemyData.desc}
                        </p>

                        {/* Metadata specs table */}
                        <div className="grid grid-cols-2 gap-4 border-t border-white/10 mt-4 pt-3.5 text-[9px] font-mono uppercase tracking-[0.12em] text-[#D8CBB8] font-bold">
                          <div>
                            <span className="text-[8px] text-white/45 block">Vessel</span>
                            <span className="mt-0.5 block text-white truncate font-sans font-semibold text-[10.5px] leading-tight capitalize">{activeAlchemyData.vessel}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-white/45 block">Key Vitality Benefit</span>
                            <span className="mt-0.5 block text-white truncate font-sans font-semibold text-[10.5px] leading-tight capitalize">{activeAlchemyData.benefit}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* DYNAMIC DINING POLAROIDS CAROUSEL */}
      {diningPolaroidsVisible && visibleDiningPolaroids.length > 0 && (
        <section className="py-16 md:py-24 relative px-6 md:px-4 bg-[#FAF9F5] overflow-hidden border-t border-stone-200/40">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              
              {/* Left side: Editorial copywriting */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: easePremium }}
                className="lg:col-span-5 space-y-6 md:space-y-8 relative z-10 text-left"
              >
                <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-[#A88C52] block font-mono">
                  {diningPolaroidsTagline}
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-5.5xl font-serif leading-[1.1] tracking-tight text-[#2E3438] font-light">
                  {diningPolaroidsHeading.split(',')[0]} <br /> 
                  <span className="italic font-normal text-[#1B4C44]">{diningPolaroidsHeading.split(',')[1] || ''}</span>
                </h2>
                <p className="text-xs md:text-sm text-slate-charcoal/75 max-w-md font-sans leading-relaxed text-pretty">
                  {diningPolaroidsDesc}
                </p>
              </motion.div>

              {/* Right side: Polaroid Stack Carousel */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.4, ease: easePremium }}
                className="lg:col-span-7 relative flex items-center justify-center pt-10 lg:pt-0"
              >
                <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/3.1] flex items-center justify-center">
                  
                  <button 
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="absolute left-[-12px] md:-left-10 z-30 w-11 h-11 md:w-13 md:h-13 rounded-full bg-[#1B4C44]/90 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-slate-charcoal transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.1)] cursor-pointer"
                  >
                    <ChevronLeft size={20} className="stroke-[2.5]" />
                  </button>

                  <button 
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="absolute right-[-12px] md:-right-10 z-30 w-11 h-11 md:w-13 md:h-13 rounded-full bg-[#1B4C44]/90 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-slate-charcoal transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.1)] cursor-pointer"
                  >
                    <ChevronRight size={20} className="stroke-[2.5]" />
                  </button>

                  {visibleDiningPolaroids.map((item: any, i: number) => {
                    const len = visibleDiningPolaroids.length;
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
                      x = "0%";
                      y = "0%";
                      rotate = 1;
                      scale = 1;
                      opacity = 1;
                      zIndex = 30;
                      isPointerEventsActive = "pointer-events-auto hover:scale-[1.03] transition-all duration-[400ms]";
                      shadowClass = "shadow-[0_30px_70px_-12px_rgba(46,52,56,0.24)] border-stone-250";
                    } else if (offset === -1) {
                      x = "-32%";
                      y = "-2%";
                      rotate = -8;
                      scale = 0.88;
                      opacity = 0.65;
                      zIndex = 15;
                      shadowClass = "shadow-[0_15px_35px_-8px_rgba(46,52,56,0.12)] border-stone-200/20";
                    } else if (offset === 1) {
                      x = "30%";
                      y = "-1%";
                      rotate = 8;
                      scale = 0.88;
                      opacity = 0.65;
                      zIndex = 15;
                      shadowClass = "shadow-[0_15px_35px_-8px_rgba(46,52,56,0.12)] border-stone-200/20";
                    } else {
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

      {/* 3. INTERACTIVE DAILY RITUALS (The Nourishment Cycle Explorer) */}
      {diningRitualsVisible && visibleDailyRituals.length > 0 && (
        <section className="py-20 bg-[#EFEAE1]/30 border-y border-[#D8CBB8]/20 relative">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <div className="text-center md:text-left mb-12">
              <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-[#A88C52] block mb-2 font-mono">
                {diningRitualsTagline}
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-[#1B4C44] tracking-tight">
                {diningRitualsHeading.split(' ')[0]} {diningRitualsHeading.split(' ')[1] || ''} <span className="italic font-normal font-serif">{diningRitualsHeading.split(' ').slice(2).join(' ')}</span>
              </h2>
              <p className="text-xs md:text-sm text-[#2E3438]/70 mt-3 font-sans max-w-md">
                {diningRitualsDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Left Column: Vertical Interactive Tabs & Information */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                <div className="space-y-3.5">
                  {visibleDailyRituals.map((ritual: any) => (
                    <button
                      key={ritual.id}
                      onClick={() => setSelectedRitual(ritual.id)}
                      className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                        selectedRitual === ritual.id
                          ? "bg-white border-[#A88C52] shadow-[0_4px_20px_rgba(168,140,82,0.06)] scale-[1.02]"
                          : "bg-transparent border-transparent hover:bg-white/50"
                      }`}
                    >
                      <div>
                        <p className="text-[8px] md:text-[9px] tracking-widest font-black uppercase text-[#A88C52] font-mono">
                          {ritual.time}
                        </p>
                        <h4 className="text-sm md:text-md font-serif text-slate-charcoal mt-1">
                          {ritual.title}
                        </h4>
                      </div>
                      <ChevronRight 
                        className={`h-4.5 w-4.5 text-[#A88C52] transition-transform duration-300 ${
                          selectedRitual === ritual.id ? "translate-x-1" : "opacity-30"
                        }`} 
                      />
                    </button>
                  ))}
                </div>

                {/* Detail view pane of active ritual */}
                {activeRitualData && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedRitual}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease: easePremium }}
                      className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-xs"
                    >
                      <p className="text-xs md:text-sm text-slate-charcoal/80 leading-relaxed font-sans italic font-normal text-left">
                        "{activeRitualData.desc}"
                      </p>

                      <div className="grid grid-cols-3 gap-3 border-t border-stone-100 mt-5 pt-4 text-left">
                        <div>
                          <span className="text-[8px] tracking-wider uppercase text-slate-charcoal/45 block font-mono">Warmth</span>
                          <span className="text-[11px] font-bold text-[#1B4C44] mt-0.5 block">{activeRitualData.stats?.warmth}</span>
                        </div>
                        <div>
                          <span className="text-[8px] tracking-wider uppercase text-slate-charcoal/45 block font-mono">Focus</span>
                          <span className="text-[11px] font-bold text-[#A88C52] mt-0.5 block">{activeRitualData.stats?.focus}</span>
                        </div>
                        <div>
                          <span className="text-[8px] tracking-wider uppercase text-slate-charcoal/45 block font-mono">Key Herb</span>
                          <span className="text-[11px] font-bold text-slate-charcoal mt-0.5 block truncate">{activeRitualData.stats?.herbs}</span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* Right Column: Visual Showcase Frame */}
              <div className="lg:col-span-7 relative flex items-center justify-center">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#D8CBB8]/40 shadow-md">
                  {activeRitualData && (
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={selectedRitual}
                        src={activeRitualData.image}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.6, ease: easePremium }}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt={activeRitualData.title}
                        referrerPolicy="no-referrer"
                      />
                    </AnimatePresence>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  {activeRitualData && (
                    <div className="absolute bottom-5 left-5 z-10 text-white text-left">
                      <span className="text-[9px] tracking-widest font-black uppercase text-[#D8CBB8] font-mono">
                        {activeRitualData.time}
                      </span>
                      <h4 className="text-md md:text-xl font-serif text-white mt-1">
                        {activeRitualData.title}
                      </h4>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. THE SLATE PAVILION */}
      {diningPavilionVisible && (
        <section className="container mx-auto px-5 md:px-10 max-w-6xl py-20 md:py-28 text-left">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-center">
            
            {/* Text Left */}
            <div className="md:col-span-6 space-y-4 md:space-y-6">
              <div className="space-y-1">
                <span className="text-[8px] md:text-[9px] tracking-[0.25em] font-extrabold text-[#A88C52] uppercase block font-mono">
                  {diningPavilionTagline}
                </span>
                <h3 className="text-2xl md:text-5xl font-serif text-[#1B4C44] leading-tight">
                  {diningPavilionHeading.split(' ')[0]} {diningPavilionHeading.split(' ')[1] || ''} <span className="italic font-normal font-serif">{diningPavilionHeading.split(' ').slice(2).join(' ')}</span>
                </h3>
              </div>
              
              <p className="text-xs md:text-md text-[#2E3438]/85 leading-relaxed font-light font-sans text-justify">
                {diningPavilionDesc1}
              </p>

              <p className="text-xs md:text-sm text-[#2E3438]/70 leading-relaxed font-light font-sans text-justify">
                {diningPavilionDesc2}
              </p>

              {/* Quick specifications inside a beautiful, high-contrast, segmented grid layout with clean sans typography */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 pt-6 pb-2 border-t border-stone-200/80 font-sans">
                <div className="bg-white/60 border border-[#1B4C44]/10 rounded-lg p-3.5 shadow-[0_2px_8px_rgba(27,76,68,0.02)] transition-all duration-300 hover:border-[#A88C52]/35">
                  <span className="text-[9px] md:text-[10px] uppercase tracking-[0.14em] font-bold text-[#1B4C44] block">
                    Dress Code
                  </span>
                  <span className="text-xs md:text-sm font-sans font-semibold text-[#A88C52] mt-1.5 block">
                    {diningPavilionDresscode}
                  </span>
                </div>
                
                {hoursVisible && (
                  <div className="bg-white/60 border border-[#1B4C44]/10 rounded-lg p-3.5 shadow-[0_2px_8px_rgba(27,76,68,0.02)] transition-all duration-300 hover:border-[#1B4C44]/35">
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.14em] font-bold text-[#1B4C44] block">
                      Daily Timings
                    </span>
                    <span className="text-xs md:text-sm font-sans font-bold text-[#1B4C44] mt-1.5 block">
                      {diningHours}
                    </span>
                  </div>
                )}

                {dietaryVisible && (
                  <div className="bg-white/60 border border-[#1B4C44]/10 rounded-lg p-3.5 shadow-[0_2px_8px_rgba(27,76,68,0.02)] transition-all duration-300 hover:border-[#A88C52]/35">
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.14em] font-bold text-[#1B4C44] block">
                      Dietary Info
                    </span>
                    <span className="text-xs md:text-sm font-semibold text-[#2E3438] mt-1.5 block leading-tight">
                      {diningDietary}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Image Right: Beautiful, non-bulky, rounded image container */}
            <div className="md:col-span-6 w-full aspect-[16/10] md:aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100 shadow-sm border border-[#D8CBB8]/40">
              <img 
                src={diningPavilionImage || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000"} 
                className="w-full h-full object-cover hover:scale-103 duration-700 transition"
                alt="Inside luxury wood architecture mountain retreat kitchen dining salon" 
                referrerPolicy="no-referrer"
              />
            </div>

          </div>
        </section>
      )}

      {/* 5. INDIGENOUS SATTVIK LAWS PANEL (Interactive Accordion Explorer in Forest Green) */}
      {diningVowsVisible && visibleDiningVows.length > 0 && (
        <section className="bg-[#1B4C44] text-white py-20 md:py-24 relative overflow-hidden text-left">
          <div className="container mx-auto px-5 md:px-10 max-w-6xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-5 space-y-4">
                <span className="text-[8px] md:text-[9.5px] tracking-[0.25em] font-extrabold text-[#D8CBB8] uppercase block font-mono">
                  {diningVowsTagline}
                </span>
                <h3 className="text-3xl md:text-5xl font-serif leading-tight font-light col-span-1">
                  {diningVowsHeading1} <br />
                  <span className="italic font-normal font-serif text-[#D8CBB8]">{diningVowsHeading2}</span>
                </h3>
                <p className="text-xs md:text-sm text-white/80 leading-relaxed font-light font-sans text-justify">
                  {diningVowsDesc1}
                </p>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed font-light font-sans text-justify">
                  {diningVowsDesc2}
                </p>
              </div>

              {/* Interactive Vow Details Pane */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 lg:pl-10 font-sans">
                {visibleDiningVows.map((vow: any) => (
                  <div 
                    key={vow.id}
                    onClick={() => setActiveVowDetail(activeVowDetail === vow.id ? null : vow.id)}
                    className={`space-y-1.5 pl-4 border-l border-[#D8CBB8]/30 cursor-pointer p-3 rounded-r-lg transition-colors group ${
                      activeVowDetail === vow.id ? "bg-white/5 border-l-2 border-l-[#D8CBB8]" : "hover:bg-white-[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-block text-[#D8CBB8] group-hover:scale-110 transition-transform">
                        <DynamicIcon name={vow.icon || 'Leaf'} className="h-4.5 w-4.5" />
                      </span>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#D8CBB8] font-mono">
                        {vow.title}
                      </h4>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed font-light">
                      {vow.desc}
                    </p>
                    {activeVowDetail === vow.id && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-[11px] text-[#D8CBB8]/80 pt-1 border-t border-white/10 mt-1 font-light"
                      >
                        {vow.expanded_desc}
                      </motion.p>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 6. COMPLIMENTARY MENU: THE DAILY HARVEST OVERVIEWS (Line-Based Premium Design with Category Filters) */}
      {specialtyVisible && visibleSpecialtyDishes.length > 0 && (
        <section id="provisions-menu" className="container mx-auto px-5 md:px-10 max-w-4xl pt-16 pb-12">
          <div className="text-center space-y-3 mb-10">
            <span className="font-script text-2xl md:text-3.5xl text-[#A88C52]">
              {diningSpecialtyTagline}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#1B4C44] font-light">
              {diningSpecialtyHeading1} <span className="italic font-normal font-serif">{diningSpecialtyHeading2}</span>
            </h2>
            <p className="text-xs md:text-sm text-[#2E3438]/60 max-w-md mx-auto leading-relaxed">
              {diningSpecialtyDesc}
            </p>
          </div>

          {/* Premium Animated Menu Filter controls */}
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mb-12 border-b border-stone-200 pb-6">
            {[
              { id: "all", label: "All Items" },
              { id: "grains", label: "Restorative Grains" },
              { id: "stews", label: "Claypot Stews" },
              { id: "elixirs", label: "Purifying Elixirs" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveSpecialtyCategory(cat.id)}
                className={`px-4 py-2 text-[10px] md:text-xs font-bold font-sans uppercase tracking-[0.15em] rounded-full transition-all cursor-pointer ${
                  activeSpecialtyCategory === cat.id
                    ? "bg-[#1B4C44] text-white shadow-xs"
                    : "bg-[#EFEAE1]/30 hover:bg-[#EFEAE1]/80 text-[#2E3438]/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Traditional Paper Menu Line Design */}
          <div className="grid grid-cols-1 gap-12">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeSpecialtyCategory}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {visibleSpecialtyDishes
                  .filter((dish: any) => activeSpecialtyCategory === "all" || dish.category === activeSpecialtyCategory)
                  .map((dish: any, i: number) => (
                    <div key={i} className="group py-3.5 border-b border-stone-200/50">
                      
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                        <h4 className="text-md md:text-xl font-serif text-[#2E3438] group-hover:text-[#1B4C44] transition-colors duration-300">
                          <span className="text-xs font-mono tracking-wider text-[#A88C52] mr-3">{dish.num}.</span>
                          {dish.title}
                        </h4>
                        
                        {/* Clean dotted line connector */}
                        <span className="hidden sm:inline-block flex-grow mx-4 border-b border-dotted border-stone-300" />
                        
                        <span className="text-[8px] md:text-[9.5px] font-extrabold uppercase tracking-widest text-[#A88C52] font-mono whitespace-nowrap mt-1 sm:mt-0">
                          {dish.energy}
                        </span>
                      </div>

                      {/* Tags block */}
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2.5 text-[7.5px] font-bold uppercase tracking-widest text-[#2E3438]/45 font-mono">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1B4C44]"></span>
                          {dish.origin}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A88C52]"></span>
                          {dish.attribute}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs md:text-sm text-[#2E3438]/75 leading-relaxed font-sans mt-3 text-pretty font-light text-justify text-left">
                        {dish.desc}
                      </p>

                    </div>
                ))}
                {visibleSpecialtyDishes.filter((dish: any) => activeSpecialtyCategory === "all" || dish.category === activeSpecialtyCategory).length === 0 && (
                  <div className="text-center py-10 font-sans text-stone-400 text-sm">
                    No items under this category.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* 7. FULL RESTAURANT MENU SECTION (from menu_items table via useMenu) */}
      {visibleMenuItems.length > 0 && (
        <section id="restaurant-menu" className="container mx-auto px-5 md:px-10 max-w-4xl pt-16 pb-24 border-t border-stone-200/50">
          <div className="text-center space-y-3 mb-10">
            <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-[#A88C52] block font-mono">
              {diningMenuTagline}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#1B4C44] font-light">
              {diningMenuHeading1} <span className="italic font-normal font-serif">{diningMenuHeading2}</span>
            </h2>
            <p className="text-xs md:text-sm text-[#2E3438]/60 max-w-md mx-auto leading-relaxed">
              {diningMenuDesc}
            </p>
          </div>

          {/* Categories for full menu */}
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mb-12 border-b border-stone-200 pb-6">
            {[
              { id: "all", label: "All Items" },
              { id: "breakfast", label: "Breakfast" },
              { id: "soup", label: "Soups" },
              { id: "salad", label: "Salads & Starters" },
              { id: "main", label: "Main Course" },
              { id: "dessert", label: "Dessert" },
              { id: "beverage", label: "Beverages" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveMenuCategory(cat.id)}
                className={`px-4 py-2 text-[10px] md:text-xs font-bold font-sans uppercase tracking-[0.15em] rounded-full transition-all cursor-pointer ${
                  activeMenuCategory === cat.id
                    ? "bg-[#1B4C44] text-white shadow-xs"
                    : "bg-[#EFEAE1]/30 hover:bg-[#EFEAE1]/80 text-[#2E3438]/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Menu Items Grid/List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {filteredMenuItems.map((item) => (
              <div key={item.id} className="group py-3 border-b border-stone-200/40 text-left">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-sm md:text-base font-heading font-bold text-[#2E3438] group-hover:text-[#1B4C44] transition-colors duration-300">
                    {item.name}
                  </h4>
                  <span className="flex-grow border-b border-dotted border-stone-300 mx-2" />
                  <span className="text-xs md:text-sm font-sans font-bold text-[#A88C52]">
                    ₹{item.price}
                  </span>
                </div>
                {item.description && (
                  <p className="text-[11.5px] md:text-xs text-[#2E3438]/70 leading-relaxed font-sans mt-1.5 font-light">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
            {filteredMenuItems.length === 0 && (
              <div className="col-span-2 text-center py-10 font-sans text-stone-400 text-xs">
                No items available in this category.
              </div>
            )}
          </div>
        </section>
      )}

      {/* Sincere warning label */}
      <div className="text-center pb-16 max-w-sm mx-auto space-y-3 font-sans">
        <Utensils size={15} className="text-[#A88C52] mx-auto opacity-70" />
        <p className="text-[9px] text-[#2E3438]/50 leading-relaxed uppercase tracking-[0.2em] whitespace-pre-line">
          {diningFooterWarning}
        </p>
      </div>

    </div>
  );
}
