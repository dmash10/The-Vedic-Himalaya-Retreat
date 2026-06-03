import { motion } from "motion/react";
import { Mountain, Compass, ShieldCheck, Heart, Sparkles, Sun } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useContent } from "@/hooks/useContent";
import PageLoader from "@/components/PageLoader";

function DynamicIcon({ name, className = "h-4 w-4", strokeWidth = 1.5 }: { name: string; className?: string; strokeWidth?: number }) {
  const Icon = (LucideIcons as any)[name];
  if (!Icon) return <Sparkles className={className} strokeWidth={strokeWidth} />;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}

export default function About() {
  const easePremium = [0.22, 1, 0.36, 1] as const;

  const { content, loading, getValue } = useContent();

  // Prevent flash of fallback text while CMS content loads
  if (loading && content.length === 0) return <PageLoader />;

  const aboutHeading = getValue('about', 'about_heading', 'Rooted in the');
  const aboutSubheading = getValue('about', 'about_subheading', 'Kedarnath Retreat');
  const aboutMainText = getValue('about', 'about_main_text', 'The Vedic Himalaya Retreat is more than luxury lodging. It is an extension of the Uttarakhand soul, designed purely to ground and restore the high-altitude voyager. Our structures pay humble homage to the traditional deodar wood and black mountain stone masonry of Uttarakhand. Every pillar is hand-fitted by local artisans, embedding regional spirit into every joint.');
  const aboutHighlights = getValue('about', 'about_highlights', 'We believe true luxury is found in the deep forest silence, the cold slate underfoot, and the monumental scale of the peaks towering outside your window.');
  const aboutImage = getValue('about', 'about_image', 'https://images.unsplash.com/photo-1443632864897-14973fa006cf?auto=format&fit=crop&q=80&w=1200');

  // Section Visibility Settings
  const storyVisible = getValue('about', 'about_story_visible', 'true') !== 'false';
  const pillarsVisible = getValue('about', 'pillars_visible', 'true') !== 'false';

  const pillarsStr = getValue('about', 'pillars', '');
  let aboutPillars: any[] = [];
  try {
    aboutPillars = pillarsStr ? JSON.parse(pillarsStr) : [];
  } catch (e) {
    console.error("Failed to parse about pillars:", e);
  }
  if (aboutPillars.length === 0) {
    aboutPillars = [
      { id: "01", title: "NATURE INTEGRATION", desc: "Surrounded by aromatic cedar and organic farms.", icon: "Trees", is_visible: true },
      { id: "02", title: "SACRED COMFORT", desc: "Vaastu-aligned pinewood master log cabins.", icon: "Compass", is_visible: true },
      { id: "03", title: "GARHWALI FOOD", desc: "Timely served authentic organic vegetarian cuisine.", icon: "Utensils", is_visible: true },
      { id: "04", title: "YATRA SHELTER", desc: "Premium basecamp for your sacred Kedarnath pilgrimage.", icon: "Mountain", is_visible: true }
    ];
  }
  const visiblePillars = aboutPillars.filter(p => p.is_visible !== false);

  return (
    <div className="bg-[#FAF9F5] text-slate-charcoal pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        
        {/* Editorial Header */}
        <header className="mb-20 text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easePremium }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#1B4C44]/5 text-[#1B4C44] text-[10px] uppercase font-bold tracking-[0.25em] rounded-full border border-[#1B4C44]/10"
          >
            <Sparkles size={11} className="text-[#A88C52]" />
            <span>OUR SACRED COMMITTMENT</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: easePremium }}
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-medium tracking-tight text-slate-charcoal mt-2 leading-[1.1]"
          >
            {aboutHeading} <br />
            <span className="italic font-serif font-normal text-[#1B4C44]">{aboutSubheading}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: easePremium }}
            className="text-xs md:text-sm text-slate-charcoal/70 max-w-lg mx-auto font-sans leading-relaxed"
          >
            The Vedic Himalaya Retreat is more than luxury lodging. It is an extension of the Uttarakhand soul, designed purely to ground and restore the high-altitude voyager.
          </motion.p>
        </header>

        {/* Editorial Statement */}
        {storyVisible && (
          <>
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <p className="text-lg md:text-2xl font-serif text-[#1B4C44] italic leading-relaxed text-pretty">
                "{aboutHighlights}"
              </p>
            </div>

            {/* Cinematic Grid Narrative */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: easePremium }}
                className="space-y-6"
              >
                <h2 className="text-2xl md:text-3xl font-heading font-medium tracking-tight text-slate-charcoal">
                  Ancient Architecture, <br />
                  <span className="italic font-serif font-normal text-[#A88C52]">Modern Mountain Care</span>
                </h2>
                <p className="text-xs md:text-sm text-slate-charcoal/75 leading-relaxed font-sans whitespace-pre-line">
                  {aboutMainText}
                </p>
              </motion.div>
              <div className="relative group overflow-hidden rounded-2xl border border-[#D8CBB8]/30 shadow-xl bg-[#EFEAE1]/50 aspect-video md:aspect-[4/3]">
                <img 
                  src={aboutImage} 
                  alt="Himalayan Pine Forests" 
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            </div>
          </>
        )}

        {/* Four Pillars of Custodianship */}
        {pillarsVisible && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-14 border-t border-[#D8CBB8]/20 mb-20">
            {visiblePillars.map((pillar, idx) => (
              <div key={idx} className="space-y-4 text-center md:text-left">
                <div className="w-12 h-12 rounded-full bg-white border border-[#D8CBB8]/30 flex items-center justify-center text-[#1B4C44] mx-auto md:mx-0 shadow-xs">
                  <DynamicIcon name={pillar.icon || 'Sparkles'} className="h-5 w-5 text-[#A88C52]" />
                </div>
                <h3 className="text-base font-heading font-bold uppercase tracking-wider text-slate-charcoal">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-charcoal/70 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Second Cinematic Visual */}
        <div className="relative group overflow-hidden rounded-2xl border border-[#D8CBB8]/40 shadow-2xl bg-[#EFEAE1]/50 aspect-video max-w-4xl mx-auto">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200" 
            alt="Majestic Kedarnath Range Peaks" 
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-[#0B1714]/20 mix-blend-overlay pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 p-6 md:p-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
            <span className="text-[9px] uppercase tracking-[0.3em] font-extrabold text-[#D8CBB8] block mb-2 font-mono">Village Dewar, Guptkashi, Uttarakhand</span>
            <h4 className="text-xl md:text-2xl font-heading font-medium tracking-tight">Facing the Divine Peaks of Chaukhamba</h4>
          </div>
        </div>

      </div>
    </div>
  );
}
