import { useState, useEffect } from 'react';
import { useContent } from '@/hooks/useContent';
import { useImageZones } from '@/hooks/useImageZones';
import { motion } from 'framer-motion';
import {
  Save, Loader2, Image as ImageIcon, Plus, ChevronDown, Trash2,
  Type, Link as LinkIcon, Edit3, Compass, Tag, Sparkles, BookOpen, Clock, Mail, MapPin, Info, X, Eye, EyeOff, FileText, Heart, ShieldAlert,
  Flame, Leaf
} from 'lucide-react';
import { toast } from 'sonner';
import ImageUploader from '@/components/admin/ImageUploader';
import * as LucideIcons from 'lucide-react';

const AVAILABLE_ICONS = [
  "Bed", "Droplets", "Wifi", "ShieldCheck", "Compass", "Briefcase", "Utensils", "Fan",
  "Tv", "Wind", "Mountain", "Flame", "Sparkles", "Sun", "Trees", "Heart", "Coffee", "Car",
  "MapPin", "Activity", "Moon", "Calendar"
];

const PAGES_LIST = [
  { id: 'home', label: 'Home Page' },
  { id: 'about', label: 'About Us' },
  { id: 'rooms', label: 'Rooms Intro' },
  { id: 'dining', label: 'Dining / Rest' },
  { id: 'weddings', label: 'Weddings' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'nearby', label: 'Nearby Places' },
  { id: 'gallery', label: 'Gallery Page' },
  { id: 'contact', label: 'Contact Us' },
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'terms', label: 'Terms of Stay' }
];

// Helper components
interface TextInputGroupProps {
  label: string;
  icon: any;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function TextInputGroup({ label, icon: Icon, value, onChange, placeholder = '', disabled = false }: TextInputGroupProps) {
  return (
    <div className="relative group/input flex-1 w-full text-left">
      <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C4A665]/40 group-focus-within/input:text-[#C4A665] transition-colors">
          <Icon className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] placeholder-white/20 focus:outline-none focus:border-[#C4A665] transition-all font-medium"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

interface TextAreaGroupProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

function TextAreaGroup({ label, value, onChange, placeholder = '', rows = 3, disabled = false }: TextAreaGroupProps) {
  return (
    <div className="relative flex-1 w-full text-left">
      <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">
        {label}
      </label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={rows}
        className="w-full px-4 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] placeholder-white/20 focus:outline-none focus:border-[#C4A665] transition-all font-medium leading-relaxed resize-none"
        placeholder={placeholder}
      />
    </div>
  );
}

interface SectionToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

function SectionToggle({ label, checked, onChange, description }: SectionToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#0A0F0E] border border-[#1C2E2A] rounded-xl mb-4 text-left">
      <div>
        <span className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider block">{label}</span>
        {description && <span className="text-[10px] text-[#8E9F96] mt-0.5 block">{description}</span>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer shrink-0 ${
          checked ? 'bg-emerald-500' : 'bg-[#1C2E2A]'
        }`}
      >
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? 'translate-x-6.5' : 'translate-x-0.5'
        }`} />
      </button>
    </div>
  );
}

// Generic List Editor component
interface ListEditorProps<T> {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  createDefaultItem: () => T;
  getItemLabel: (item: T, idx: number) => string;
  getItemImage?: (item: T) => string | undefined;
  renderItemEditor: (item: T, idx: number, updateField: (field: keyof T, value: any) => void) => React.ReactNode;
}

function ListEditor<T>({
  title,
  items,
  onChange,
  createDefaultItem,
  getItemLabel,
  getItemImage,
  renderItemEditor
}: ListEditorProps<T>) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const handleUpdate = (idx: number, field: keyof T, val: any) => {
    const updated = items.map((item, i) => i === idx ? { ...item, [field]: val } : item);
    onChange(updated);
  };

  const handleToggleVisible = (idx: number, currentVisible: boolean | undefined) => {
    const val = currentVisible === false ? true : false;
    handleUpdate(idx, 'is_visible' as keyof T, val);
  };

  const handleAdd = () => {
    const updated = [...items, createDefaultItem()];
    onChange(updated);
    setActiveIdx(updated.length - 1);
  };

  const handleRemove = (idx: number) => {
    if (confirm("Are you sure you want to remove this item?")) {
      onChange(items.filter((_, i) => i !== idx));
      setActiveIdx(null);
    }
  };

  return (
    <div className="bg-[#0D1412] border border-[#1C2E2A] rounded-2xl p-6 space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-[#1C2E2A] pb-3">
        <span className="text-xs font-bold text-[#C4A665] uppercase tracking-wider">{title}</span>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 text-[10px] font-bold text-white/50 hover:text-[#C4A665] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> ADD ITEM
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item: any, idx) => (
          <div
            key={idx}
            className={`relative border rounded-xl overflow-hidden bg-[#060B0A]/40 p-2.5 cursor-pointer transition-colors flex flex-col justify-between min-h-[120px] ${
              activeIdx === idx ? 'border-[#C4A665]' : 'border-[#1C2E2A] hover:border-white/10'
            }`}
          >
            <div onClick={() => setActiveIdx(activeIdx === idx ? null : idx)} className="flex-1">
              {getItemImage && getItemImage(item) ? (
                <img src={getItemImage(item)} alt="" className="w-full aspect-[4/3] object-cover rounded-lg border border-[#1C2E2A] mb-2" />
              ) : null}
              <div className="text-left">
                <span className="text-xs font-bold text-[#F8FAFC] block truncate">{getItemLabel(item, idx)}</span>
                {item.desc && <span className="text-[9px] text-[#8E9F96] block truncate mt-0.5">{item.desc}</span>}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#1C2E2A]/50 pt-2 mt-2">
              <button
                type="button"
                onClick={() => handleToggleVisible(idx, item.is_visible)}
                className={`p-1 rounded cursor-pointer transition-colors ${
                  item.is_visible !== false ? 'text-emerald-400 hover:text-emerald-300' : 'text-red-400 hover:text-red-300'
                }`}
                title={item.is_visible !== false ? "Visible (Click to hide)" : "Hidden (Click to show)"}
              >
                {item.is_visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="p-1 text-red-500/50 hover:text-red-400 cursor-pointer"
                title="Delete item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeIdx !== null && items[activeIdx] && (
        <div className="mt-4 p-4 bg-[#060B0A]/30 border border-[#1C2E2A] rounded-xl relative">
          <button
            type="button"
            onClick={() => setActiveIdx(null)}
            className="absolute top-3 right-3 text-white/40 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-3">
            Editing Item #{activeIdx + 1}
          </div>
          {renderItemEditor(items[activeIdx], activeIdx, (field, value) => handleUpdate(activeIdx, field, value))}
        </div>
      )}
    </div>
  );
}

export default function AdminPages() {
  const { content, loading: contentLoading, getValue, updateContent, updateMultipleContent } = useContent();
  const { zones, loading: zonesLoading } = useImageZones();

  const [activePageId, setActivePageId] = useState('home');
  const [showPageMenuMobile, setShowPageMenuMobile] = useState(false);
  const [isSaving, setIsSaving] = useState<string | null>(null);

  // States
  const [visibilities, setVisibilities] = useState<any>({});
  const [formFields, setFormFields] = useState<any>({});
  
  // Lists
  const [polaroids, setPolaroids] = useState<any[]>([]);
  const [offerings, setOfferings] = useState<any[]>([]);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [pillars, setPillars] = useState<any[]>([]);
  const [specialtyDishes, setSpecialtyDishes] = useState<any[]>([]);
  const [alchemies, setAlchemies] = useState<any[]>([]);
  const [diningPolaroids, setDiningPolaroids] = useState<any[]>([]);
  const [dailyRituals, setDailyRituals] = useState<any[]>([]);
  const [diningVows, setDiningVows] = useState<any[]>([]);
  const [roomsAmenities, setRoomsAmenities] = useState<any[]>([]);
  const [roomsReviews, setRoomsReviews] = useState<any[]>([]);
  const [weddingPolaroids, setWeddingPolaroids] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [weddingOfferings, setWeddingOfferings] = useState<any[]>([]);
  const [experienceSlides, setExperienceSlides] = useState<any[]>([]);
  const [experiencePhotos, setExperiencePhotos] = useState<any[]>([]);
  const [nearbySlides, setNearbySlides] = useState<any[]>([]);
  const [treksDirectory, setTreksDirectory] = useState<any[]>([]);
  const [nearbyPhotos, setNearbyPhotos] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [marqueeSlogans, setMarqueeSlogans] = useState<string[]>([]);

  // Load effect
  useEffect(() => {
    if (contentLoading) return;

    // Load general values
    const textVal = (key: string, def = '') => getValue(activePageId, key, def);

    // Visibilities
    const sectionVisKeys = [
      'hero_visible', 'marquee_visible', 'story_visible', 'offerings_visible', 'amenities_visible',
      'about_story_visible', 'pillars_visible', 'notice_visible', 'hours_visible', 'dietary_visible',
      'specialty_visible', 'alchemy_visible', 'dining_polaroids_visible', 'weddings_hero_visible',
      'weddings_story_visible', 'weddings_polaroids_visible', 'weddings_venues_visible', 'weddings_offerings_visible',
      'experiences_tour_visible', 'experiences_gallery_visible', 'nearby_tour_visible', 'nearby_treks_visible', 'nearby_gallery_visible',
      'dining_hero_visible', 'dining_philosophy_visible', 'dining_rituals_visible', 'dining_pavilion_visible', 'dining_vows_visible',
      'rooms_hero_visible', 'gallery_hero_visible', 'contact_hero_visible', 'contact_form_visible', 'booking_visible'
    ];
    const loadedVis: any = {};
    sectionVisKeys.forEach(k => {
      loadedVis[k] = getValue(activePageId, k, 'true') !== 'false';
    });
    setVisibilities(loadedVis);

    // Set page text states
    if (activePageId === 'home') {
      setFormFields({
        hero_line1: getValue('home', 'hero_line1', 'Peace in the'),
        hero_line2: getValue('home', 'hero_line2', 'Pines'),
        hero_subtitle: getValue('home', 'hero_subtitle', 'Village Dewar, Guptkashi'),
        hero_image: getValue('home', 'hero_image', ''),
        story_line1: getValue('home', 'story_line1', 'Casual Elegance'),
        story_line2: getValue('home', 'story_line2', 'Meets Alpine Charm'),
        story_desc: getValue('home', 'story_desc', 'Inspired by our pristine cedar forest surroundings...'),
        story_btn_name: getValue('home', 'story_btn_name', 'VIEW ALL ROOMS & SUITES'),
        story_btn_link: getValue('home', 'story_btn_link', '/rooms'),
      });
      
      const slogansStr = getValue('home', 'marquee_slogans', '');
      let parsedSlogans: string[] = [];
      try {
        parsedSlogans = slogansStr ? JSON.parse(slogansStr) : [];
      } catch {
        parsedSlogans = [];
      }
      if (!Array.isArray(parsedSlogans) || parsedSlogans.length === 0) {
        parsedSlogans = ["Vedic Retreat", "Kedarnath Stay", "Comfort near Kedarnath", "Serenity in Himalayas"];
      }
      setMarqueeSlogans(parsedSlogans);

      try { setPolaroids(JSON.parse(getValue('home', 'polaroids', '[]'))); } catch { setPolaroids([]); }
      try { setOfferings(JSON.parse(getValue('home', 'offerings', '[]'))); } catch { setOfferings([]); }
      try { setAmenities(JSON.parse(getValue('home', 'amenities', '[]'))); } catch { setAmenities([]); }
    } else if (activePageId === 'about') {
      setFormFields({
        about_heading: getValue('about', 'about_heading', 'Our Story'),
        about_subheading: getValue('about', 'about_subheading', 'Surrounded by nature, crafted with passion'),
        about_main_text: getValue('about', 'about_main_text', ''),
        about_highlights: getValue('about', 'about_highlights', ''),
        about_image: getValue('about', 'about_image', ''),
      });
      try { setPillars(JSON.parse(getValue('about', 'pillars', '[]'))); } catch { setPillars([]); }
    } else if (activePageId === 'rooms') {
      setFormFields({
        rooms_heading: getValue('rooms', 'rooms_heading', 'Sanctuary Suites'),
        rooms_subheading: getValue('rooms', 'rooms_subheading', 'Luxury Mountain Lodging'),
        rooms_image: getValue('rooms', 'rooms_image', ''),
        rooms_notice: getValue('rooms', 'rooms_notice', 'Important Booking Notice...'),
      });
    } else if (activePageId === 'dining') {
      setFormFields({
        dining_heading: getValue('dining', 'dining_heading', 'Pure Sattvik Dining'),
        dining_subheading: getValue('dining', 'dining_subheading', 'Nourishment for Body & Soul'),
        dining_image: getValue('dining', 'dining_image', ''),
        dining_hours: getValue('dining', 'dining_hours', '7:30 AM - 10:00 PM'),
        dining_dietary: getValue('dining', 'dining_dietary', 'Pure Vegetarian Sattvik Cuisine'),
        dining_hero_subtitle: getValue('dining', 'dining_hero_subtitle', 'Dine at the Sanctuary'),
        dining_philosophy_tagline: getValue('dining', 'dining_philosophy_tagline', 'Alpine Harvest Dining'),
        dining_philosophy_heading: getValue('dining', 'dining_philosophy_heading', 'Nourished by the High Valley Peaks'),
        dining_philosophy_desc: getValue('dining', 'dining_philosophy_desc', "Savor the Mandakini basin's untouched alpine fields with hyper-local, certified Sattvik recipes. Every grain of red millet and every cup of fresh spring dew has been collected by family handmills in the tiny terrace properties clinging high above the valley dust."),
        dining_alchemy_tagline: getValue('dining', 'dining_alchemy_tagline', 'ANCIENT CULINARY VESSELED ALCHEMY'),
        dining_alchemy_heading: getValue('dining', 'dining_alchemy_heading', 'Raw Vessels, Living Nourishment'),
        dining_alchemy_desc: getValue('dining', 'dining_alchemy_desc', 'We reject modern industrial metals, baking on ancestral stone and slow-simmering inside native clays and seasoned hand-beaten mountain irons.'),
        dining_polaroids_tagline: getValue('dining', 'dining_polaroids_tagline', 'SATTVIK VISUAL JOURNAL'),
        dining_polaroids_heading: getValue('dining', 'dining_polaroids_heading', 'A Taste of Pure Harvests'),
        dining_polaroids_desc: getValue('dining', 'dining_polaroids_desc', "Take a visual journey through our kitchen's daily bread, herbal infusions, and fireside seating configurations designed for pilgrims."),
        dining_rituals_tagline: getValue('dining', 'dining_rituals_tagline', 'THE NOURISHMENT CYCLE'),
        dining_rituals_heading: getValue('dining', 'dining_rituals_heading', 'A Day of Aromatic Rituals'),
        dining_rituals_desc: getValue('dining', 'dining_rituals_desc', 'Ayurvedic nutrition follows the sun. Click through our daily cycles to view how we structure nourishment throughout your stay.'),
        dining_pavilion_tagline: getValue('dining', 'dining_pavilion_tagline', 'THE MAIN SALON'),
        dining_pavilion_heading: getValue('dining', 'dining_pavilion_heading', 'The Slate Pavilion'),
        dining_pavilion_desc1: getValue('dining', 'dining_pavilion_desc1', 'Framed by massive floor-to-ceiling panoramic glass panes, our signature interior space hovers above the misty Guptkashi gorge. Sit inside a secure warm sanctuary with uninterrupted views of the majestic snowline of Chaukhamba peaks.'),
        dining_pavilion_desc2: getValue('dining', 'dining_pavilion_desc2', 'Guests gather around cold-slab slate fireplace tables while foods are slow-cooked using traditional wood fuel. We avoid processed white sugars, chemical vegetable oils, and commercial steel pans—cooking inside clay pots and raw regional iron vessels.'),
        dining_pavilion_image: getValue('dining', 'dining_pavilion_image', ''),
        dining_pavilion_dresscode: getValue('dining', 'dining_pavilion_dresscode', 'Monastic Ease'),
        dining_vows_tagline: getValue('dining', 'dining_vows_tagline', 'SATTVIK NUTRIMENT'),
        dining_vows_heading1: getValue('dining', 'dining_vows_heading1', 'Earth to Soul'),
        dining_vows_heading2: getValue('dining', 'dining_vows_heading2', 'Purity Vows'),
        dining_vows_desc1: getValue('dining', 'dining_vows_desc1', 'True physical restoration lies in complete resonance with the terrain. High high-altitude hiking requires provisions that digest lightly, hydrate cells thoroughly, and calm mental distraction.'),
        dining_vows_desc2: getValue('dining', 'dining_vows_desc2', 'We strictly discard industrial white sugars, synthesized chemical salts, processed lard oils, and preserving chemicals. Every kitchen process is pure, steady, and completed by hand.'),
        dining_specialty_tagline: getValue('dining', 'dining_specialty_tagline', 'Daily Provisions Menu'),
        dining_specialty_heading1: getValue('dining', 'dining_specialty_heading1', 'The Daily'),
        dining_specialty_heading2: getValue('dining', 'dining_specialty_heading2', 'Harvest Communion'),
        dining_specialty_desc: getValue('dining', 'dining_specialty_desc', 'Slowly constructed dishes prepared fresh each sunrise and twilight, complementary to all resident guests of our hillside valleys.'),
        dining_menu_tagline: getValue('dining', 'dining_menu_tagline', 'PUBLIC DINING CODES'),
        dining_menu_heading1: getValue('dining', 'dining_menu_heading1', 'The Restaurant'),
        dining_menu_heading2: getValue('dining', 'dining_menu_heading2', 'A la Carte'),
        dining_menu_desc: getValue('dining', 'dining_menu_desc', 'Carefully curated items available for order. All dishes are prepared from seasonal ridge-grown crops and organic valley spices.'),
        dining_footer_warning: getValue('dining', 'dining_footer_warning', 'Meals are crafted specifically to zero out village farm wastes. Please notify your table captain 2 hours in advance for specific allergy or custom diets.'),
      });
      try { setSpecialtyDishes(JSON.parse(getValue('dining', 'specialty_dishes', '[]'))); } catch { setSpecialtyDishes([]); }
      try { setAlchemies(JSON.parse(getValue('dining', 'kitchen_alchemies', '[]'))); } catch { setAlchemies([]); }
      try { setDiningPolaroids(JSON.parse(getValue('dining', 'dining_polaroids', '[]'))); } catch { setDiningPolaroids([]); }
      try { setDailyRituals(JSON.parse(getValue('dining', 'daily_rituals', '[]'))); } catch { setDailyRituals([]); }
      try { setDiningVows(JSON.parse(getValue('dining', 'dining_vows', '[]'))); } catch { setDiningVows([]); }
    } else if (activePageId === 'weddings') {
      setFormFields({
        weddings_heading: getValue('weddings', 'weddings_heading', 'Destination Weddings'),
        weddings_subheading: getValue('weddings', 'weddings_subheading', 'Sacred Celebrations in the Himalayas'),
        weddings_image: getValue('weddings', 'weddings_image', ''),
        weddings_story_title: getValue('weddings', 'weddings_story_title', 'Ancestral Purity'),
        weddings_story_subtitle: getValue('weddings', 'weddings_story_subtitle', 'In Sacred Commemoration'),
        weddings_story_desc: getValue('weddings', 'weddings_story_desc', ''),
      });
      try { setWeddingPolaroids(JSON.parse(getValue('weddings', 'weddings_polaroids', '[]'))); } catch { setWeddingPolaroids([]); }
      try { setVenues(JSON.parse(getValue('weddings', 'venue_cards', '[]'))); } catch { setVenues([]); }
      try { setWeddingOfferings(JSON.parse(getValue('weddings', 'wedding_offerings', '[]'))); } catch { setWeddingOfferings([]); }
    } else if (activePageId === 'experiences') {
      setFormFields({
        experiences_heading: getValue('experiences', 'experiences_heading', 'Curated Journeys'),
        experiences_subheading: getValue('experiences', 'experiences_subheading', 'Acclimatize in the Sacred Atmosphere'),
        experiences_image: getValue('experiences', 'experiences_image', ''),
      });
      try { setExperienceSlides(JSON.parse(getValue('experiences', 'experience_slides', '[]'))); } catch { setExperienceSlides([]); }
      try { setExperiencePhotos(JSON.parse(getValue('experiences', 'experience_gallery', '[]'))); } catch { setExperiencePhotos([]); }
    } else if (activePageId === 'nearby') {
      setFormFields({
        nearby_heading: getValue('nearby', 'nearby_heading', 'Himalayan Travel Guide'),
        nearby_subheading: getValue('nearby', 'nearby_subheading', 'Coordinates of Rudraprayag'),
        nearby_image: getValue('nearby', 'nearby_image', ''),
      });
      try { setNearbySlides(JSON.parse(getValue('nearby', 'nearby_slides', '[]'))); } catch { setNearbySlides([]); }
      try { setTreksDirectory(JSON.parse(getValue('nearby', 'treks_directory', '[]'))); } catch { setTreksDirectory([]); }
      try { setNearbyPhotos(JSON.parse(getValue('nearby', 'nearby_gallery', '[]'))); } catch { setNearbyPhotos([]); }
    } else if (activePageId === 'gallery') {
      setFormFields({
        gallery_heading: getValue('gallery', 'gallery_heading', 'Captured Stillness'),
        gallery_subheading: getValue('gallery', 'gallery_subheading', 'Bespoke Deodar-framed spaces'),
        gallery_image: getValue('gallery', 'gallery_image', ''),
      });
      try { setGalleryImages(JSON.parse(getValue('gallery', 'gallery_images', '[]'))); } catch { setGalleryImages([]); }
    } else if (activePageId === 'contact') {
      setFormFields({
        contact_heading: getValue('contact', 'contact_heading', 'Reach Out'),
        contact_subheading: getValue('contact', 'contact_subheading', 'Reservations & coordinates'),
        contact_image: getValue('contact', 'contact_image', ''),
        contact_email: getValue('contact', 'contact_email', 'stay@vedichimalaya.com'),
        contact_map_pin: getValue('contact', 'contact_map_pin', 'Village Dewar, Guptkashi, Uttarakhand')
      });
    } else if (['privacy', 'terms'].includes(activePageId)) {
      setFormFields({
        title: getValue(activePageId, `${activePageId}_title`, activePageId === 'privacy' ? 'Privacy Policy' : 'Terms of Stay'),
        content: getValue(activePageId, `${activePageId}_content`, '')
      });
    }
  }, [activePageId, contentLoading, content]);

  // Unified Save Method
  const handleSavePage = async () => {
    setIsSaving(activePageId);
    const updates: { section: string; key: string; value: string }[] = [];

    // Push Text fields
    Object.keys(formFields).forEach(k => {
      updates.push({ section: activePageId, key: k, value: formFields[k] });
    });

    // Push visibilities
    Object.keys(visibilities).forEach(k => {
      updates.push({ section: activePageId, key: k, value: String(visibilities[k]) });
    });

    // Push specific lists
    if (activePageId === 'home') {
      updates.push({ section: 'home', key: 'marquee_slogans', value: JSON.stringify(marqueeSlogans) });
      updates.push({ section: 'home', key: 'polaroids', value: JSON.stringify(polaroids) });
      updates.push({ section: 'home', key: 'offerings', value: JSON.stringify(offerings) });
      updates.push({ section: 'home', key: 'amenities', value: JSON.stringify(amenities) });
    } else if (activePageId === 'about') {
      updates.push({ section: 'about', key: 'pillars', value: JSON.stringify(pillars) });
    } else if (activePageId === 'dining') {
      updates.push({ section: 'dining', key: 'specialty_dishes', value: JSON.stringify(specialtyDishes) });
      updates.push({ section: 'dining', key: 'kitchen_alchemies', value: JSON.stringify(alchemies) });
      updates.push({ section: 'dining', key: 'dining_polaroids', value: JSON.stringify(diningPolaroids) });
      updates.push({ section: 'dining', key: 'daily_rituals', value: JSON.stringify(dailyRituals) });
      updates.push({ section: 'dining', key: 'dining_vows', value: JSON.stringify(diningVows) });
    } else if (activePageId === 'weddings') {
      updates.push({ section: 'weddings', key: 'weddings_polaroids', value: JSON.stringify(weddingPolaroids) });
      updates.push({ section: 'weddings', key: 'venue_cards', value: JSON.stringify(venues) });
      updates.push({ section: 'weddings', key: 'wedding_offerings', value: JSON.stringify(weddingOfferings) });
    } else if (activePageId === 'experiences') {
      updates.push({ section: 'experiences', key: 'experience_slides', value: JSON.stringify(experienceSlides) });
      updates.push({ section: 'experiences', key: 'experience_gallery', value: JSON.stringify(experiencePhotos) });
    } else if (activePageId === 'nearby') {
      updates.push({ section: 'nearby', key: 'nearby_slides', value: JSON.stringify(nearbySlides) });
      updates.push({ section: 'nearby', key: 'treks_directory', value: JSON.stringify(treksDirectory) });
      updates.push({ section: 'nearby', key: 'nearby_gallery', value: JSON.stringify(nearbyPhotos) });
    } else if (activePageId === 'gallery') {
      updates.push({ section: 'gallery', key: 'gallery_images', value: JSON.stringify(galleryImages) });
    }

    const r = await updateMultipleContent(updates);
    setIsSaving(null);
    if (r.success) {
      toast.success(`${PAGES_LIST.find(p => p.id === activePageId)?.label} saved successfully!`);
    } else {
      toast.error('Failed to save page contents. Check database connection.');
    }
  };

  const isLoading = contentLoading || zonesLoading;

  return (
    <div className="space-y-6 text-[#E2E8F0] min-h-screen">
      <div className="border-l-4 border-[#C4A665] pl-5 py-0.5 text-left">
        <h1 className="text-2xl md:text-3xl font-heading font-medium text-[#F8FAFC]">PAGE EDITOR</h1>
        <p className="text-[#8E9F96] text-xs mt-1">Refine each section layout, cards, and copy to match the user journey.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#C4A665]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* ===== SIDEBAR PICKER ===== */}
          <div className="hidden lg:flex flex-col bg-[#0D1412] border border-[#1C2E2A] rounded-xl overflow-hidden shadow-none">
            <div className="px-4 py-3 border-b border-[#1C2E2A] bg-[#0A0F0E] text-left">
              <span className="text-xs uppercase font-bold tracking-wider text-[#8E9F96]">Select Page</span>
            </div>
            <nav className="p-2 space-y-1">
              {PAGES_LIST.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setActivePageId(page.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                    activePageId === page.id
                      ? 'bg-[#1C2E2A] text-[#C4A665] border-[#C4A665]/20'
                      : 'text-[#8E9F96] hover:text-[#E2E8F0] hover:bg-[#1C2E2A]/40 border-transparent'
                  }`}
                >
                  {page.label.toUpperCase()}
                </button>
              ))}
            </nav>
          </div>

          {/* Mobile page picker */}
          <div className="lg:hidden relative">
            <button
              onClick={() => setShowPageMenuMobile(!showPageMenuMobile)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#0D1412] border border-[#1C2E2A] rounded-xl text-sm font-medium text-[#C4A665]"
            >
              <span>{PAGES_LIST.find(p => p.id === activePageId)?.label.toUpperCase()}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showPageMenuMobile && (
              <div className="absolute top-[105%] left-0 right-0 z-30 bg-[#0D1412] border border-[#1C2E2A] rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
                {PAGES_LIST.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => {
                      setActivePageId(page.id);
                      setShowPageMenuMobile(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-xs font-bold border-b border-[#1C2E2A]/30 transition-colors ${
                      activePageId === page.id
                        ? 'bg-[#1C2E2A] text-[#C4A665]'
                        : 'text-[#8E9F96]'
                    }`}
                  >
                    {page.label.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== DYNAMIC EDITOR PORTAL ===== */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#0D1412] border border-[#1C2E2A] rounded-2xl overflow-hidden shadow-none">
              <div className="p-5 border-b border-[#1C2E2A] flex items-center justify-between bg-[#0D1412]/50">
                <h2 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                  {PAGES_LIST.find(p => p.id === activePageId)?.label} Contents
                </h2>
                <button
                  onClick={handleSavePage}
                  disabled={isSaving !== null}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#C4A665] text-black font-bold text-xs rounded hover:bg-[#FAF9F5] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving !== null ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  SAVE CHANGES
                </button>
              </div>

              <div className="p-6 space-y-6 text-left">
                {/* ----------------- HOME PAGE ----------------- */}
                {activePageId === 'home' && (
                  <div className="space-y-6">
                    <SectionToggle
                      label="Hero Section"
                      checked={visibilities.hero_visible}
                      onChange={(val) => setVisibilities((prev: any) => ({ ...prev, hero_visible: val }))}
                      description="Toggle hero banner visibility on home page"
                    />
                    {visibilities.hero_visible && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white/5 rounded-xl border border-[#1C2E2A]">
                        <div className="md:col-span-2 space-y-4">
                          <TextInputGroup label="Hero Line 1" icon={Type} value={formFields.hero_line1} onChange={(val) => setFormFields((prev: any) => ({ ...prev, hero_line1: val }))} />
                          <TextInputGroup label="Hero Line 2 (Italic)" icon={Type} value={formFields.hero_line2} onChange={(val) => setFormFields((prev: any) => ({ ...prev, hero_line2: val }))} />
                          <TextInputGroup label="Hero Subtitle" icon={Type} value={formFields.hero_subtitle} onChange={(val) => setFormFields((prev: any) => ({ ...prev, hero_subtitle: val }))} />
                        </div>
                        <ImageUploader label="Hero Image" currentImage={formFields.hero_image} onImageChange={(path) => setFormFields((prev: any) => ({ ...prev, hero_image: path }))} aspectRatio="aspect-video w-full" />
                      </div>
                    )}

                    <SectionToggle
                      label="Marquee Section"
                      checked={visibilities.marquee_visible}
                      onChange={(val) => setVisibilities((prev: any) => ({ ...prev, marquee_visible: val }))}
                      description="Show scrolling text highlights banner"
                    />
                    {visibilities.marquee_visible && (
                      <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 block mb-1">Marquee Slogans</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {marqueeSlogans.map((slogan, index) => (
                              <div key={index} className="flex items-center gap-2 bg-[#060B0A]/40 border border-[#1C2E2A] px-3 py-1.5 rounded-md">
                                <input
                                  type="text"
                                  value={slogan}
                                  onChange={(e) => {
                                    const newSlogans = [...marqueeSlogans];
                                    newSlogans[index] = e.target.value;
                                    setMarqueeSlogans(newSlogans);
                                  }}
                                  className="flex-1 bg-transparent border-0 text-white focus:outline-none uppercase font-heading tracking-wider text-xs w-full"
                                  placeholder="Enter slogan..."
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMarqueeSlogans(marqueeSlogans.filter((_, i) => i !== index));
                                  }}
                                  className="p-1 text-red-500/50 hover:text-red-400 transition-colors cursor-pointer"
                                  title="Remove slogan"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setMarqueeSlogans([...marqueeSlogans, "NEW SLOGAN"]);
                          }}
                          className="w-full py-1.5 border border-dashed border-[#1C2E2A] hover:border-[#C4A665]/30 text-slate-400 hover:text-[#C4A665] transition-all flex items-center justify-center gap-1.5 font-bold text-[10px] uppercase rounded-md cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Slogan
                        </button>
                        
                        {/* Live Preview */}
                        <div className="mt-4 pt-6 border-t border-[#1C2E2A]">
                          <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-3">Live Preview</div>
                          
                          <section className="py-6 bg-[#FAF9F5] border-y border-stone-sand/20 overflow-hidden relative shadow-sm rounded-lg">
                            <div className="absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-[#FAF9F5] to-transparent z-10 pointer-events-none opacity-80" />
                            <div className="absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-[#FAF9F5] to-transparent z-10 pointer-events-none opacity-80" />
                            
                            <div className="flex w-max">
                              <motion.div 
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{ repeat: Infinity, ease: "linear", duration: 32 }}
                                className="flex whitespace-nowrap gap-12 md:gap-16 font-heading uppercase tracking-[0.1em] text-lg md:text-2xl text-[#2D3E35] font-medium items-center pr-12 md:pr-16 select-none"
                              >
                                {Array(2).fill(null).map((_, groupIndex) => (
                                  <span key={groupIndex} className="flex items-center gap-12 md:gap-16">
                                    {marqueeSlogans.map((item, i) => (
                                      <span key={i} className="flex items-center gap-12 md:gap-16">
                                        <span>{item}</span>
                                        <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8 fill-[#B32D2D] text-[#B32D2D] shrink-0" stroke="none">
                                          <path d="M12 2L15.3 8.7L22 12L15.3 15.3L12 22L8.7 15.3L2 12L8.7 8.7Z" />
                                        </svg>
                                      </span>
                                    ))}
                                  </span>
                                ))}
                              </motion.div>
                            </div>
                          </section>
                        </div>
                      </div>
                    )}

                    <SectionToggle
                      label="Story Section"
                      checked={visibilities.story_visible}
                      onChange={(val) => setVisibilities((prev: any) => ({ ...prev, story_visible: val }))}
                    />
                    {visibilities.story_visible && (
                      <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TextInputGroup label="Story Line 1" icon={Type} value={formFields.story_line1} onChange={(val) => setFormFields((prev: any) => ({ ...prev, story_line1: val }))} />
                          <TextInputGroup label="Story Line 2 (Italic)" icon={Type} value={formFields.story_line2} onChange={(val) => setFormFields((prev: any) => ({ ...prev, story_line2: val }))} />
                        </div>
                        <TextAreaGroup label="Story Description" value={formFields.story_desc} onChange={(val) => setFormFields((prev: any) => ({ ...prev, story_desc: val }))} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TextInputGroup label="Button Name" icon={Edit3} value={formFields.story_btn_name} onChange={(val) => setFormFields((prev: any) => ({ ...prev, story_btn_name: val }))} />
                          <TextInputGroup label="Button Link" icon={LinkIcon} value={formFields.story_btn_link} onChange={(val) => setFormFields((prev: any) => ({ ...prev, story_btn_link: val }))} />
                        </div>
                      </div>
                    )}

                    <ListEditor
                      title="Polaroid Photo Cards"
                      items={polaroids}
                      onChange={setPolaroids}
                      createDefaultItem={() => ({ title: 'New Card', desc: 'DESCRIPTION', image: '', is_visible: true })}
                      getItemLabel={(item) => item.title}
                      getItemImage={(item) => item.image}
                      renderItemEditor={(item, idx, updateField) => (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <TextInputGroup label="Card Title" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                            <TextInputGroup label="Description tag" icon={Type} value={item.desc} onChange={(v) => updateField('desc', v)} />
                          </div>
                          <ImageUploader label="Card Image" currentImage={item.image} onImageChange={(p) => updateField('image', p)} aspectRatio="aspect-[4/3] w-full" />
                        </div>
                      )}
                    />

                    <SectionToggle label="Offerings Section" checked={visibilities.offerings_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, offerings_visible: v }))} />
                    {visibilities.offerings_visible && (
                      <ListEditor
                        title="Offerings Cards"
                        items={offerings}
                        onChange={setOfferings}
                        createDefaultItem={() => ({ num: '01', badge: 'BADGE', title: 'New Offering', description: '', image: '', coords: '', icon: 'Compass', bgClass: 'bg-[#0f2822]', textClass: 'text-[#FAF9F5]', is_visible: true })}
                        getItemLabel={(item) => item.title}
                        getItemImage={(item) => item.image}
                        renderItemEditor={(item, idx, updateField) => (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <TextInputGroup label="Number (e.g. 01)" icon={Tag} value={item.num} onChange={(v) => updateField('num', v)} />
                              <TextInputGroup label="Badge Label" icon={Tag} value={item.badge} onChange={(v) => updateField('badge', v)} />
                              <TextInputGroup label="Offering Title" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                              <TextAreaGroup label="Description" value={item.description} onChange={(v) => updateField('description', v)} />
                              <TextInputGroup label="Coordinates" icon={Compass} value={item.coords} onChange={(v) => updateField('coords', v)} />
                              <div className="text-left w-full">
                                <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Select Icon</label>
                                <select value={item.icon || 'Compass'} onChange={(e) => updateField('icon', e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665]">
                                  {AVAILABLE_ICONS.map(i => <option key={i} value={i} className="bg-[#0D1412]">{i}</option>)}
                                </select>
                              </div>
                            </div>
                            <ImageUploader label="Cover Image" currentImage={item.image} onImageChange={(p) => updateField('image', p)} aspectRatio="aspect-video w-full" />
                          </div>
                        )}
                      />
                    )}

                    <SectionToggle label="Amenities Section" checked={visibilities.amenities_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, amenities_visible: v }))} />
                    {visibilities.amenities_visible && (
                      <ListEditor
                        title="Amenities list"
                        items={amenities}
                        onChange={setAmenities}
                        createDefaultItem={() => ({ title: 'New Amenity', desc: 'Description', icon: 'Wifi', is_visible: true })}
                        getItemLabel={(item) => item.title}
                        renderItemEditor={(item, idx, updateField) => (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                            <TextInputGroup label="Amenity Name" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                            <TextInputGroup label="Description" icon={Type} value={item.desc} onChange={(v) => updateField('desc', v)} />
                            <div className="text-left w-full">
                              <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Icon</label>
                              <select value={item.icon || 'Wifi'} onChange={(e) => updateField('icon', e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665]">
                                {AVAILABLE_ICONS.map(i => <option key={i} value={i} className="bg-[#0D1412]">{i}</option>)}
                              </select>
                            </div>
                          </div>
                        )}
                      />
                    )}
                  </div>
                )}

                {/* ----------------- ABOUT US ----------------- */}
                {activePageId === 'about' && (
                  <div className="space-y-6">
                    <SectionToggle label="Story Section" checked={visibilities.about_story_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, about_story_visible: v }))} />
                    {visibilities.about_story_visible && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white/5 rounded-xl border border-[#1C2E2A]">
                        <div className="md:col-span-2 space-y-4">
                          <TextInputGroup label="Heading" icon={Type} value={formFields.about_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, about_heading: v }))} />
                          <TextInputGroup label="Subheading" icon={Type} value={formFields.about_subheading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, about_subheading: v }))} />
                          <TextAreaGroup label="Main text content" value={formFields.about_main_text} onChange={(v) => setFormFields((prev: any) => ({ ...prev, about_main_text: v }))} />
                          <TextAreaGroup label="Highlights Quote" value={formFields.about_highlights} onChange={(v) => setFormFields((prev: any) => ({ ...prev, about_highlights: v }))} />
                        </div>
                        <ImageUploader label="Section Image" currentImage={formFields.about_image} onImageChange={(p) => setFormFields((prev: any) => ({ ...prev, about_image: p }))} aspectRatio="aspect-video w-full" />
                      </div>
                    )}

                    <SectionToggle label="Pillars Section" checked={visibilities.pillars_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, pillars_visible: v }))} />
                    {visibilities.pillars_visible && (
                      <ListEditor
                        title="Core Pillars of Custodianship"
                        items={pillars}
                        onChange={setPillars}
                        createDefaultItem={() => ({ id: '01', title: 'NEW PILLAR', desc: 'Principle description...', icon: 'Trees', is_visible: true })}
                        getItemLabel={(item) => item.title}
                        renderItemEditor={(item, idx, updateField) => (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                            <TextInputGroup label="Pillar ID (e.g. 01)" icon={Tag} value={item.id} onChange={(v) => updateField('id', v)} />
                            <TextInputGroup label="Pillar Title" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                            <TextInputGroup label="Pillar Description" icon={Type} value={item.desc} onChange={(v) => updateField('desc', v)} />
                            <div className="text-left w-full">
                              <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Icon</label>
                              <select value={item.icon || 'Trees'} onChange={(e) => updateField('icon', e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665]">
                                {AVAILABLE_ICONS.map(i => <option key={i} value={i} className="bg-[#0D1412]">{i}</option>)}
                              </select>
                            </div>
                          </div>
                        )}
                      />
                    )}
                  </div>
                )}

                {/* ----------------- ROOMS INTRO ----------------- */}
                {activePageId === 'rooms' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white/5 rounded-xl border border-[#1C2E2A]">
                      <div className="md:col-span-2 space-y-4">
                        <TextInputGroup label="Heading" icon={Type} value={formFields.rooms_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, rooms_heading: v }))} />
                        <TextInputGroup label="Subheading" icon={Type} value={formFields.rooms_subheading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, rooms_subheading: v }))} />
                      </div>
                      <ImageUploader label="Cover Image" currentImage={formFields.rooms_image} onImageChange={(p) => setFormFields((prev: any) => ({ ...prev, rooms_image: p }))} aspectRatio="aspect-video w-full" />
                    </div>

                    <SectionToggle label="Advisory Notice Box" checked={visibilities.notice_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, notice_visible: v }))} />
                    {visibilities.notice_visible && (
                      <TextAreaGroup label="Advisory Warning Details" value={formFields.rooms_notice} onChange={(v) => setFormFields((prev: any) => ({ ...prev, rooms_notice: v }))} rows={4} />
                    )}
                  </div>
                )}

                {/* ----------------- DINING / REST ----------------- */}
                {activePageId === 'dining' && (
                  <div className="space-y-6">
                    <SectionToggle
                      label="Dining Hero Section"
                      checked={visibilities.dining_hero_visible}
                      onChange={(v) => setVisibilities((prev: any) => ({ ...prev, dining_hero_visible: v }))}
                      description="Toggle top hero banner on the dining page"
                    />
                    {visibilities.dining_hero_visible && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white/5 rounded-xl border border-[#1C2E2A]">
                        <div className="md:col-span-2 space-y-4">
                          <TextInputGroup label="Hero Subtitle (Italic badge)" icon={Type} value={formFields.dining_hero_subtitle} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_hero_subtitle: v }))} />
                          <TextInputGroup label="Heading" icon={Type} value={formFields.dining_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_heading: v }))} />
                          <TextInputGroup label="Subheading" icon={Type} value={formFields.dining_subheading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_subheading: v }))} />
                        </div>
                        <ImageUploader label="Cover Image" currentImage={formFields.dining_image} onImageChange={(p) => setFormFields((prev: any) => ({ ...prev, dining_image: p }))} aspectRatio="aspect-video w-full" />
                      </div>
                    )}

                    <SectionToggle
                      label="Philosophy Section"
                      checked={visibilities.dining_philosophy_visible}
                      onChange={(v) => setVisibilities((prev: any) => ({ ...prev, dining_philosophy_visible: v }))}
                      description="Toggle core philosophy section under the hero banner"
                    />
                    {visibilities.dining_philosophy_visible && (
                      <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                        <TextInputGroup label="Philosophy Tagline (Italic)" icon={Type} value={formFields.dining_philosophy_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_philosophy_tagline: v }))} />
                        <TextInputGroup label="Philosophy Heading" icon={Type} value={formFields.dining_philosophy_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_philosophy_heading: v }))} />
                        <TextAreaGroup label="Philosophy Description" value={formFields.dining_philosophy_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_philosophy_desc: v }))} rows={4} />
                      </div>
                    )}

                    <SectionToggle label="Kitchen Alchemist Section" checked={visibilities.alchemy_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, alchemy_visible: v }))} />
                    {visibilities.alchemy_visible && (
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                          <TextInputGroup label="Alchemy Tagline" icon={Type} value={formFields.dining_alchemy_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_alchemy_tagline: v }))} />
                          <TextInputGroup label="Alchemy Heading" icon={Type} value={formFields.dining_alchemy_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_alchemy_heading: v }))} />
                          <TextAreaGroup label="Alchemy Description" value={formFields.dining_alchemy_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_alchemy_desc: v }))} rows={3} />
                        </div>
                        <ListEditor
                          title="Kitchen Alchemist Vessels"
                          items={alchemies}
                          onChange={setAlchemies}
                          createDefaultItem={() => ({ id: 'clay', title: 'New Vessel', tagline: '', desc: '', illustration: '', vessel: '', benefit: '', smoke: '', accentColor: '#1B4C44', is_visible: true })}
                          getItemLabel={(item) => item.title}
                          getItemImage={(item) => item.illustration}
                          renderItemEditor={(item, idx, updateField) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                              <div className="space-y-4">
                                <TextInputGroup label="Vessel ID" icon={Tag} value={item.id} onChange={(v) => updateField('id', v)} />
                                <TextInputGroup label="Title" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                                <TextInputGroup label="Tagline" icon={Type} value={item.tagline} onChange={(v) => updateField('tagline', v)} />
                                <TextAreaGroup label="Description" value={item.desc} onChange={(v) => updateField('desc', v)} />
                                <TextInputGroup label="Vessel Name" icon={Type} value={item.vessel} onChange={(v) => updateField('vessel', v)} />
                                <TextInputGroup label="Benefit" icon={Plus} value={item.benefit} onChange={(v) => updateField('benefit', v)} />
                                <TextInputGroup label="Smoke details" icon={Type} value={item.smoke} onChange={(v) => updateField('smoke', v)} />
                                <TextInputGroup label="Color Accent (hex)" icon={Type} value={item.accentColor} onChange={(v) => updateField('accentColor', v)} />
                              </div>
                              <ImageUploader label="Illustration Image" currentImage={item.illustration} onImageChange={(p) => updateField('illustration', p)} aspectRatio="aspect-video w-full" />
                            </div>
                          )}
                        />
                      </div>
                    )}

                    <SectionToggle label="Dining Polaroids Section" checked={visibilities.dining_polaroids_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, dining_polaroids_visible: v }))} />
                    {visibilities.dining_polaroids_visible && (
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                          <TextInputGroup label="Polaroids Tagline" icon={Type} value={formFields.dining_polaroids_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_polaroids_tagline: v }))} />
                          <TextInputGroup label="Polaroids Heading" icon={Type} value={formFields.dining_polaroids_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_polaroids_heading: v }))} />
                          <TextAreaGroup label="Polaroids Description" value={formFields.dining_polaroids_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_polaroids_desc: v }))} rows={2} />
                        </div>
                        <ListEditor
                          title="Dining Polaroid Photos"
                          items={diningPolaroids}
                          onChange={setDiningPolaroids}
                          createDefaultItem={() => ({ title: 'Dish Photo', desc: 'DESCRIPTION', image: '', is_visible: true })}
                          getItemLabel={(item) => item.title}
                          getItemImage={(item) => item.image}
                          renderItemEditor={(item, idx, updateField) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                              <div className="space-y-4">
                                <TextInputGroup label="Title" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                                <TextInputGroup label="Desc" icon={Type} value={item.desc} onChange={(v) => updateField('desc', v)} />
                              </div>
                              <ImageUploader label="Image" currentImage={item.image} onImageChange={(p) => updateField('image', p)} aspectRatio="aspect-[4/3] w-full" />
                            </div>
                          )}
                        />
                      </div>
                    )}

                    <SectionToggle
                      label="Daily Rituals Section"
                      checked={visibilities.dining_rituals_visible}
                      onChange={(v) => setVisibilities((prev: any) => ({ ...prev, dining_rituals_visible: v }))}
                      description="Toggle daily cycles (Ayurvedic sun cycles info panel)"
                    />
                    {visibilities.dining_rituals_visible && (
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                          <TextInputGroup label="Rituals Tagline" icon={Type} value={formFields.dining_rituals_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_rituals_tagline: v }))} />
                          <TextInputGroup label="Rituals Heading" icon={Type} value={formFields.dining_rituals_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_rituals_heading: v }))} />
                          <TextAreaGroup label="Rituals Description" value={formFields.dining_rituals_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_rituals_desc: v }))} rows={3} />
                        </div>
                        <ListEditor
                          title="Daily Ritual Cycles"
                          items={dailyRituals}
                          onChange={setDailyRituals}
                          createDefaultItem={() => ({ id: 'morning', time: '06:00', title: 'New Ritual', desc: 'Description of ritual...', image: '', stats: { warmth: 'Optimal', focus: 'Spiritual', herbs: 'Wild Herbs' }, is_visible: true })}
                          getItemLabel={(item) => item.title}
                          getItemImage={(item) => item.image}
                          renderItemEditor={(item, idx, updateField) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                              <div className="space-y-4">
                                <TextInputGroup label="ID Key (morning/noon/sunset)" icon={Tag} value={item.id} onChange={(v) => updateField('id', v)} />
                                <TextInputGroup label="Time Frame (e.g. 06:00 - SUNRISE)" icon={Clock} value={item.time} onChange={(v) => updateField('time', v)} />
                                <TextInputGroup label="Ritual Title" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                                <TextAreaGroup label="Description" value={item.desc} onChange={(v) => updateField('desc', v)} />
                                <div className="grid grid-cols-3 gap-2">
                                  <TextInputGroup label="Warmth Attribute" icon={Flame} value={item.stats?.warmth} onChange={(v) => updateField('stats', { ...(item.stats || {}), warmth: v })} />
                                  <TextInputGroup label="Focus" icon={Sparkles} value={item.stats?.focus} onChange={(v) => updateField('stats', { ...(item.stats || {}), focus: v })} />
                                  <TextInputGroup label="Key Herbs" icon={Leaf} value={item.stats?.herbs} onChange={(v) => updateField('stats', { ...(item.stats || {}), herbs: v })} />
                                </div>
                              </div>
                              <ImageUploader label="Ritual Image" currentImage={item.image} onImageChange={(p) => updateField('image', p)} aspectRatio="aspect-video w-full" />
                            </div>
                          )}
                        />
                      </div>
                    )}

                    <SectionToggle
                      label="Slate Pavilion Section"
                      checked={visibilities.dining_pavilion_visible}
                      onChange={(v) => setVisibilities((prev: any) => ({ ...prev, dining_pavilion_visible: v }))}
                      description="Toggle Slate Pavilion features & dress codes details block"
                    />
                    {visibilities.dining_pavilion_visible && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white/5 rounded-xl border border-[#1C2E2A]">
                        <div className="md:col-span-2 space-y-4">
                          <TextInputGroup label="Pavilion Tagline" icon={Type} value={formFields.dining_pavilion_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_pavilion_tagline: v }))} />
                          <TextInputGroup label="Pavilion Heading" icon={Type} value={formFields.dining_pavilion_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_pavilion_heading: v }))} />
                          <TextAreaGroup label="Paragraph Description 1" value={formFields.dining_pavilion_desc1} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_pavilion_desc1: v }))} rows={3} />
                          <TextAreaGroup label="Paragraph Description 2" value={formFields.dining_pavilion_desc2} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_pavilion_desc2: v }))} rows={3} />
                          <TextInputGroup label="Dress Code Info" icon={Tag} value={formFields.dining_pavilion_dresscode} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_pavilion_dresscode: v }))} />
                          
                          <div className="grid grid-cols-2 gap-4 border-t border-[#1C2E2A] pt-4 mt-2">
                            <div>
                              <SectionToggle label="Hours Visible" checked={visibilities.hours_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, hours_visible: v }))} />
                              {visibilities.hours_visible && <TextInputGroup label="Opening Hours" icon={Clock} value={formFields.dining_hours} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_hours: v }))} />}
                            </div>
                            <div>
                              <SectionToggle label="Dietary Info Visible" checked={visibilities.dietary_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, dietary_visible: v }))} />
                              {visibilities.dietary_visible && <TextInputGroup label="Sattvik Info" icon={Sparkles} value={formFields.dining_dietary} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_dietary: v }))} />}
                            </div>
                          </div>
                        </div>
                        <ImageUploader label="Pavilion Image" currentImage={formFields.dining_pavilion_image} onImageChange={(p) => setFormFields((prev: any) => ({ ...prev, dining_pavilion_image: p }))} aspectRatio="aspect-[4/3] w-full" />
                      </div>
                    )}

                    <SectionToggle
                      label="Purity Vows Section"
                      checked={visibilities.dining_vows_visible}
                      onChange={(v) => setVisibilities((prev: any) => ({ ...prev, dining_vows_visible: v }))}
                      description="Toggle Ayurvedic Laws / Purity Vows accordion"
                    />
                    {visibilities.dining_vows_visible && (
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                          <TextInputGroup label="Vows Tagline" icon={Type} value={formFields.dining_vows_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_vows_tagline: v }))} />
                          <div className="grid grid-cols-2 gap-4">
                            <TextInputGroup label="Vows Heading 1 (Plain)" icon={Type} value={formFields.dining_vows_heading1} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_vows_heading1: v }))} />
                            <TextInputGroup label="Vows Heading 2 (Italic)" icon={Type} value={formFields.dining_vows_heading2} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_vows_heading2: v }))} />
                          </div>
                          <TextAreaGroup label="Paragraph Description 1" value={formFields.dining_vows_desc1} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_vows_desc1: v }))} rows={3} />
                          <TextAreaGroup label="Paragraph Description 2" value={formFields.dining_vows_desc2} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_vows_desc2: v }))} rows={3} />
                        </div>
                        <ListEditor
                          title="Purity Vow Cards"
                          items={diningVows}
                          onChange={setDiningVows}
                          createDefaultItem={() => ({ id: 'new', icon: 'Leaf', title: 'New Vow', desc: 'Short summary description...', expanded_desc: 'Detailed expanded description...', is_visible: true })}
                          getItemLabel={(item) => item.title}
                          renderItemEditor={(item, idx, updateField) => (
                            <div className="space-y-4 text-left">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <TextInputGroup label="Vow ID" icon={Tag} value={item.id} onChange={(v) => updateField('id', v)} />
                                <TextInputGroup label="Vow Title" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                                <div className="text-left w-full">
                                  <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Icon</label>
                                  <select value={item.icon || 'Leaf'} onChange={(e) => updateField('icon', e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665]">
                                    {AVAILABLE_ICONS.map(i => <option key={i} value={i} className="bg-[#0D1412]">{i}</option>)}
                                  </select>
                                </div>
                              </div>
                              <TextInputGroup label="Short Summary Description" icon={Type} value={item.desc} onChange={(v) => updateField('desc', v)} />
                              <TextAreaGroup label="Detailed Expanded Description" value={item.expanded_desc} onChange={(v) => updateField('expanded_desc', v)} rows={3} />
                            </div>
                          )}
                        />
                      </div>
                    )}

                    <SectionToggle label="Specialty Dishes Section" checked={visibilities.specialty_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, specialty_visible: v }))} />
                    {visibilities.specialty_visible && (
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                          <TextInputGroup label="Menu Tagline" icon={Type} value={formFields.dining_specialty_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_specialty_tagline: v }))} />
                          <div className="grid grid-cols-2 gap-4">
                            <TextInputGroup label="Menu Heading 1" icon={Type} value={formFields.dining_specialty_heading1} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_specialty_heading1: v }))} />
                            <TextInputGroup label="Menu Heading 2 (Italic)" icon={Type} value={formFields.dining_specialty_heading2} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_specialty_heading2: v }))} />
                          </div>
                          <TextAreaGroup label="Description" value={formFields.dining_specialty_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_specialty_desc: v }))} rows={2} />
                        </div>
                        <ListEditor
                          title="Specialty Dishes"
                          items={specialtyDishes}
                          onChange={setSpecialtyDishes}
                          createDefaultItem={() => ({ num: '01', title: 'New Dish', desc: 'Description', energy: 'Sattvik', origin: 'Garden', attribute: 'Restorative', category: 'grains', is_visible: true })}
                          getItemLabel={(item) => item.title}
                          renderItemEditor={(item, idx, updateField) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                              <TextInputGroup label="Num" icon={Tag} value={item.num} onChange={(v) => updateField('num', v)} />
                              <TextInputGroup label="Dish Title" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                              <TextAreaGroup label="Description" value={item.desc} onChange={(v) => updateField('desc', v)} />
                              <div className="grid grid-cols-2 gap-2">
                                <TextInputGroup label="Energy Attributes" icon={Sparkles} value={item.energy} onChange={(v) => updateField('energy', v)} />
                                <TextInputGroup label="Origin field" icon={MapPin} value={item.origin} onChange={(v) => updateField('origin', v)} />
                              </div>
                              <TextInputGroup label="Beneficial Attribute" icon={Plus} value={item.attribute} onChange={(v) => updateField('attribute', v)} />
                              <TextInputGroup label="Category (grains/stews/elixirs)" icon={Tag} value={item.category} onChange={(v) => updateField('category', v)} />
                            </div>
                          )}
                        />
                      </div>
                    )}

                    <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                      <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">A la Carte Menu Headings</div>
                      <TextInputGroup label="A la Carte Tagline" icon={Type} value={formFields.dining_menu_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_menu_tagline: v }))} />
                      <div className="grid grid-cols-2 gap-4">
                        <TextInputGroup label="A la Carte Heading 1" icon={Type} value={formFields.dining_menu_heading1} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_menu_heading1: v }))} />
                        <TextInputGroup label="A la Carte Heading 2 (Italic)" icon={Type} value={formFields.dining_menu_heading2} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_menu_heading2: v }))} />
                      </div>
                      <TextAreaGroup label="A la Carte Description" value={formFields.dining_menu_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_menu_desc: v }))} rows={2} />
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                      <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">Footer Notice Warning</div>
                      <TextAreaGroup label="Warning notice content text" value={formFields.dining_footer_warning} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_footer_warning: v }))} rows={2} />
                    </div>
                  </div>
                )}

                {/* ----------------- WEDDINGS ----------------- */}
                {activePageId === 'weddings' && (
                  <div className="space-y-6">
                    <SectionToggle label="Weddings Hero Section" checked={visibilities.weddings_hero_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, weddings_hero_visible: v }))} />
                    {visibilities.weddings_hero_visible && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white/5 rounded-xl border border-[#1C2E2A]">
                        <div className="md:col-span-2 space-y-4">
                          <TextInputGroup label="Heading" icon={Type} value={formFields.weddings_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_heading: v }))} />
                          <TextInputGroup label="Subheading" icon={Type} value={formFields.weddings_subheading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_subheading: v }))} />
                        </div>
                        <ImageUploader label="Cover Image" currentImage={formFields.weddings_image} onImageChange={(p) => setFormFields((prev: any) => ({ ...prev, weddings_image: p }))} aspectRatio="aspect-video w-full" />
                      </div>
                    )}

                    <SectionToggle label="Weddings Story Section" checked={visibilities.weddings_story_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, weddings_story_visible: v }))} />
                    {visibilities.weddings_story_visible && (
                      <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                        <TextInputGroup label="Story Title" icon={Type} value={formFields.weddings_story_title} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_story_title: v }))} />
                        <TextInputGroup label="Story Subtitle" icon={Type} value={formFields.weddings_story_subtitle} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_story_subtitle: v }))} />
                        <TextAreaGroup label="Story Description" value={formFields.weddings_story_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_story_desc: v }))} />
                      </div>
                    )}

                    <SectionToggle label="Weddings Polaroids Section" checked={visibilities.weddings_polaroids_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, weddings_polaroids_visible: v }))} />
                    {visibilities.weddings_polaroids_visible && (
                      <ListEditor
                        title="Wedding Polaroid Photos"
                        items={weddingPolaroids}
                        onChange={setWeddingPolaroids}
                        createDefaultItem={() => ({ title: 'Ceremony', desc: 'DESCRIPTION', image: '', is_visible: true })}
                        getItemLabel={(item) => item.title}
                        getItemImage={(item) => item.image}
                        renderItemEditor={(item, idx, updateField) => (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className="space-y-4">
                              <TextInputGroup label="Title" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                              <TextInputGroup label="Desc" icon={Type} value={item.desc} onChange={(v) => updateField('desc', v)} />
                            </div>
                            <ImageUploader label="Image" currentImage={item.image} onImageChange={(p) => updateField('image', p)} aspectRatio="aspect-[4/3] w-full" />
                          </div>
                        )}
                      />
                    )}

                    <SectionToggle label="Wedding Venues Section" checked={visibilities.weddings_venues_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, weddings_venues_visible: v }))} />
                    {visibilities.weddings_venues_visible && (
                      <ListEditor
                        title="Celebration Venues"
                        items={venues}
                        onChange={setVenues}
                        createDefaultItem={() => ({ id: 'lawn', title: 'New Venue', capacity: 'Up to 20 guests', location: '', highlight: '', vibe: '', tags: [], image: '', is_visible: true })}
                        getItemLabel={(item) => item.title}
                        getItemImage={(item) => item.image}
                        renderItemEditor={(item, idx, updateField) => (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className="space-y-4">
                              <TextInputGroup label="Venue ID" icon={Tag} value={item.id} onChange={(v) => updateField('id', v)} />
                              <TextInputGroup label="Venue Name" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                              <TextInputGroup label="Capacity Limit" icon={Type} value={item.capacity} onChange={(v) => updateField('capacity', v)} />
                              <TextInputGroup label="Location Coordinates" icon={MapPin} value={item.location} onChange={(v) => updateField('location', v)} />
                              <TextInputGroup label="Highlight Phrase" icon={Sparkles} value={item.highlight} onChange={(v) => updateField('highlight', v)} />
                              <TextInputGroup label="Vibe details" icon={Heart} value={item.vibe} onChange={(v) => updateField('vibe', v)} />
                              <TextAreaGroup label="Tags (Comma separated)" value={item.tags ? (Array.isArray(item.tags) ? item.tags.join(', ') : item.tags) : ''} onChange={(v) => updateField('tags', v.split(',').map((t: string) => t.trim()))} />
                            </div>
                            <ImageUploader label="Venue Image" currentImage={item.image} onImageChange={(p) => updateField('image', p)} aspectRatio="aspect-video w-full" />
                          </div>
                        )}
                      />
                    )}

                    <SectionToggle label="Wedding Offerings/Specs Section" checked={visibilities.weddings_offerings_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, weddings_offerings_visible: v }))} />
                    {visibilities.weddings_offerings_visible && (
                      <ListEditor
                        title="Wedding Offering Specifications"
                        items={weddingOfferings}
                        onChange={setWeddingOfferings}
                        createDefaultItem={() => ({ num: '01', badge: 'SPECIFICATION', title: 'New Spec', description: '', image: '', bgClass: 'bg-[#0f2822]', textClass: 'text-[#FAF9F5]', coords: '', is_visible: true })}
                        getItemLabel={(item) => item.title}
                        getItemImage={(item) => item.image}
                        renderItemEditor={(item, idx, updateField) => (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className="space-y-4">
                              <TextInputGroup label="Num ID" icon={Tag} value={item.num} onChange={(v) => updateField('num', v)} />
                              <TextInputGroup label="Badge Label" icon={Tag} value={item.badge} onChange={(v) => updateField('badge', v)} />
                              <TextInputGroup label="Offering Title" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                              <TextAreaGroup label="Description" value={item.description} onChange={(v) => updateField('description', v)} />
                              <TextInputGroup label="Coords" icon={Compass} value={item.coords} onChange={(v) => updateField('coords', v)} />
                              <TextInputGroup label="Bg Class (tailwindcss)" icon={Type} value={item.bgClass} onChange={(v) => updateField('bgClass', v)} />
                              <TextInputGroup label="Text Class (tailwindcss)" icon={Type} value={item.textClass} onChange={(v) => updateField('textClass', v)} />
                            </div>
                            <ImageUploader label="Offering Image" currentImage={item.image} onImageChange={(p) => updateField('image', p)} aspectRatio="aspect-[4/3] w-full" />
                          </div>
                        )}
                      />
                    )}
                  </div>
                )}

                {/* ----------------- EXPERIENCES ----------------- */}
                {activePageId === 'experiences' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white/5 rounded-xl border border-[#1C2E2A]">
                      <div className="md:col-span-2 space-y-4">
                        <TextInputGroup label="Heading" icon={Type} value={formFields.experiences_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, experiences_heading: v }))} />
                        <TextInputGroup label="Subheading" icon={Type} value={formFields.experiences_subheading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, experiences_subheading: v }))} />
                      </div>
                      <ImageUploader label="Cover Image" currentImage={formFields.experiences_image} onImageChange={(p) => setFormFields((prev: any) => ({ ...prev, experiences_image: p }))} aspectRatio="aspect-video w-full" />
                    </div>

                    <SectionToggle label="Activities Tour Section" checked={visibilities.experiences_tour_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, experiences_tour_visible: v }))} />
                    {visibilities.experiences_tour_visible && (
                      <ListEditor
                        title="Activities Tour Slides"
                        items={experienceSlides}
                        onChange={setExperienceSlides}
                        createDefaultItem={() => ({ id: 'yoga', category: 'WELLNESS', title: 'New Activity', subtitle: '', description: '', image: '', icon: 'Wind', is_visible: true })}
                        getItemLabel={(item) => item.title}
                        getItemImage={(item) => item.image}
                        renderItemEditor={(item, idx, updateField) => (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className="space-y-4">
                              <TextInputGroup label="Slide ID" icon={Tag} value={item.id} onChange={(v) => updateField('id', v)} />
                              <TextInputGroup label="Category Tag" icon={Tag} value={item.category} onChange={(v) => updateField('category', v)} />
                              <TextInputGroup label="Title" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                              <TextInputGroup label="Subtitle Tagline" icon={Type} value={item.subtitle} onChange={(v) => updateField('subtitle', v)} />
                              <TextAreaGroup label="Description" value={item.description} onChange={(v) => updateField('description', v)} />
                              <div className="text-left w-full">
                                <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Icon</label>
                                <select value={item.icon || 'Wind'} onChange={(e) => updateField('icon', e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665]">
                                  {AVAILABLE_ICONS.map(i => <option key={i} value={i} className="bg-[#0D1412]">{i}</option>)}
                                </select>
                              </div>
                            </div>
                            <ImageUploader label="Slide Image" currentImage={item.image} onImageChange={(p) => updateField('image', p)} aspectRatio="aspect-video w-full" />
                          </div>
                        )}
                      />
                    )}

                    <SectionToggle label="Scenes/Gallery Section" checked={visibilities.experiences_gallery_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, experiences_gallery_visible: v }))} />
                    {visibilities.experiences_gallery_visible && (
                      <ListEditor
                        title="Experience Photo Scenes"
                        items={experiencePhotos}
                        onChange={setExperiencePhotos}
                        createDefaultItem={() => ({ url: '', caption: 'New Scene', is_visible: true })}
                        getItemLabel={(item) => item.caption}
                        getItemImage={(item) => item.url}
                        renderItemEditor={(item, idx, updateField) => (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <TextInputGroup label="Caption Text" icon={Type} value={item.caption} onChange={(v) => updateField('caption', v)} />
                            <ImageUploader label="Scene Image" currentImage={item.url} onImageChange={(p) => updateField('url', p)} aspectRatio="aspect-[4/3] w-full" />
                          </div>
                        )}
                      />
                    )}
                  </div>
                )}

                {/* ----------------- NEARBY PLACES ----------------- */}
                {activePageId === 'nearby' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white/5 rounded-xl border border-[#1C2E2A]">
                      <div className="md:col-span-2 space-y-4">
                        <TextInputGroup label="Heading" icon={Type} value={formFields.nearby_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_heading: v }))} />
                        <TextInputGroup label="Subheading" icon={Type} value={formFields.nearby_subheading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_subheading: v }))} />
                      </div>
                      <ImageUploader label="Cover Image" currentImage={formFields.nearby_image} onImageChange={(p) => setFormFields((prev: any) => ({ ...prev, nearby_image: p }))} aspectRatio="aspect-video w-full" />
                    </div>

                    <SectionToggle label="Destinations Tour Section" checked={visibilities.nearby_tour_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, nearby_tour_visible: v }))} />
                    {visibilities.nearby_tour_visible && (
                      <ListEditor
                        title="Destination Slides"
                        items={nearbySlides}
                        onChange={setNearbySlides}
                        createDefaultItem={() => ({ id: 'trek', category: 'TREK', title: 'New Destination', subtitle: '', description: '', image: '', icon: 'Mountain', altitude: '', distance: '', duration: '', is_visible: true })}
                        getItemLabel={(item) => item.title}
                        getItemImage={(item) => item.image}
                        renderItemEditor={(item, idx, updateField) => (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className="space-y-4">
                              <TextInputGroup label="ID" icon={Tag} value={item.id} onChange={(v) => updateField('id', v)} />
                              <TextInputGroup label="Category Tag" icon={Tag} value={item.category} onChange={(v) => updateField('category', v)} />
                              <TextInputGroup label="Title" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                              <TextInputGroup label="Subtitle Tagline" icon={Type} value={item.subtitle} onChange={(v) => updateField('subtitle', v)} />
                              <TextAreaGroup label="Description" value={item.description} onChange={(v) => updateField('description', v)} />
                              <div className="grid grid-cols-3 gap-2">
                                <TextInputGroup label="Altitude" icon={Compass} value={item.altitude} onChange={(v) => updateField('altitude', v)} />
                                <TextInputGroup label="Distance" icon={MapPin} value={item.distance} onChange={(v) => updateField('distance', v)} />
                                <TextInputGroup label="Duration" icon={Clock} value={item.duration} onChange={(v) => updateField('duration', v)} />
                              </div>
                              <div className="text-left w-full">
                                <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Icon</label>
                                <select value={item.icon || 'Mountain'} onChange={(e) => updateField('icon', e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665]">
                                  {AVAILABLE_ICONS.map(i => <option key={i} value={i} className="bg-[#0D1412]">{i}</option>)}
                                </select>
                              </div>
                            </div>
                            <ImageUploader label="Slide Image" currentImage={item.image} onImageChange={(p) => updateField('image', p)} aspectRatio="aspect-video w-full" />
                          </div>
                        )}
                      />
                    )}

                    <SectionToggle label="Treks Directory Section" checked={visibilities.nearby_treks_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, nearby_treks_visible: v }))} />
                    {visibilities.nearby_treks_visible && (
                      <ListEditor
                        title="Treks Directory Guide"
                        items={treksDirectory}
                        onChange={setTreksDirectory}
                        createDefaultItem={() => ({ title: 'New Trek', subtitle: '', difficulty: 'Easy', altitude: '', distance: '', bestSeason: '', duration: '', highlight: '', description: '', is_visible: true })}
                        getItemLabel={(item) => item.title}
                        renderItemEditor={(item, idx, updateField) => (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <TextInputGroup label="Trek Title" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                            <TextInputGroup label="Subtitle Tagline" icon={Type} value={item.subtitle} onChange={(v) => updateField('subtitle', v)} />
                            <div className="text-left w-full">
                              <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Difficulty</label>
                              <select value={item.difficulty || 'Easy'} onChange={(e) => updateField('difficulty', e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665]">
                                <option value="Easy" className="bg-[#0D1412]">Easy</option>
                                <option value="Moderate" className="bg-[#0D1412]">Moderate</option>
                                <option value="Difficult" className="bg-[#0D1412]">Difficult</option>
                              </select>
                            </div>
                            <TextInputGroup label="Max Altitude" icon={Compass} value={item.altitude} onChange={(v) => updateField('altitude', v)} />
                            <TextInputGroup label="Distance" icon={MapPin} value={item.distance} onChange={(v) => updateField('distance', v)} />
                            <TextInputGroup label="Best Season" icon={Clock} value={item.bestSeason} onChange={(v) => updateField('bestSeason', v)} />
                            <TextInputGroup label="Duration" icon={Clock} value={item.duration} onChange={(v) => updateField('duration', v)} />
                            <TextInputGroup label="Highlight Phrase" icon={Sparkles} value={item.highlight} onChange={(v) => updateField('highlight', v)} />
                            <TextAreaGroup label="Description" value={item.description} onChange={(v) => updateField('description', v)} />
                          </div>
                        )}
                      />
                    )}

                    <SectionToggle label="Nearby Gallery Section" checked={visibilities.nearby_gallery_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, nearby_gallery_visible: v }))} />
                    {visibilities.nearby_gallery_visible && (
                      <ListEditor
                        title="Nearby Photo Scenes"
                        items={nearbyPhotos}
                        onChange={setNearbyPhotos}
                        createDefaultItem={() => ({ url: '', caption: 'New Scene', is_visible: true })}
                        getItemLabel={(item) => item.caption}
                        getItemImage={(item) => item.url}
                        renderItemEditor={(item, idx, updateField) => (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <TextInputGroup label="Caption Text" icon={Type} value={item.caption} onChange={(v) => updateField('caption', v)} />
                            <ImageUploader label="Scene Image" currentImage={item.url} onImageChange={(p) => updateField('url', p)} aspectRatio="aspect-[4/3] w-full" />
                          </div>
                        )}
                      />
                    )}
                  </div>
                )}

                {/* ----------------- GALLERY PAGE ----------------- */}
                {activePageId === 'gallery' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white/5 rounded-xl border border-[#1C2E2A]">
                      <div className="md:col-span-2 space-y-4">
                        <TextInputGroup label="Heading" icon={Type} value={formFields.gallery_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, gallery_heading: v }))} />
                        <TextInputGroup label="Subheading" icon={Type} value={formFields.gallery_subheading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, gallery_subheading: v }))} />
                      </div>
                      <ImageUploader label="Cover Image" currentImage={formFields.gallery_image} onImageChange={(p) => setFormFields((prev: any) => ({ ...prev, gallery_image: p }))} aspectRatio="aspect-video w-full" />
                    </div>

                    <ListEditor
                      title="Bento Masonry Gallery Images"
                      items={galleryImages}
                      onChange={setGalleryImages}
                      createDefaultItem={() => ({ src: '', category: 'Peaks & Vibe', title: 'New Photo', desc: 'Description...', is_visible: true })}
                      getItemLabel={(item) => item.title}
                      getItemImage={(item) => item.src}
                      renderItemEditor={(item, idx, updateField) => (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                          <div className="space-y-4">
                            <TextInputGroup label="Title" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                            <TextInputGroup label="Description" icon={Type} value={item.desc} onChange={(v) => updateField('desc', v)} />
                            <div className="text-left w-full">
                              <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Category Group</label>
                              <select value={item.category || 'Peaks & Vibe'} onChange={(e) => updateField('category', e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665]">
                                <option value="Peaks & Vibe" className="bg-[#0D1412]">Peaks & Vibe</option>
                                <option value="Sanctuary Suites" className="bg-[#0D1412]">Sanctuary Suites</option>
                                <option value="Spiritual Life" className="bg-[#0D1412]">Spiritual Life</option>
                              </select>
                            </div>
                          </div>
                          <ImageUploader label="Gallery Image" currentImage={item.src} onImageChange={(p) => updateField('src', p)} aspectRatio="aspect-[4/3] w-full" />
                        </div>
                      )}
                    />
                  </div>
                )}

                {/* ----------------- CONTACT US ----------------- */}
                {activePageId === 'contact' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white/5 rounded-xl border border-[#1C2E2A]">
                      <div className="md:col-span-2 space-y-4">
                        <TextInputGroup label="Heading" icon={Type} value={formFields.contact_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, contact_heading: v }))} />
                        <TextInputGroup label="Subheading" icon={Type} value={formFields.contact_subheading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, contact_subheading: v }))} />
                        <TextInputGroup label="Reservation Email Coordinates" icon={Mail} value={formFields.contact_email} onChange={(v) => setFormFields((prev: any) => ({ ...prev, contact_email: v }))} />
                        <TextInputGroup label="Map Pin Location Text" icon={MapPin} value={formFields.contact_map_pin} onChange={(v) => setFormFields((prev: any) => ({ ...prev, contact_map_pin: v }))} />
                      </div>
                      <ImageUploader label="Cover Image" currentImage={formFields.contact_image} onImageChange={(p) => setFormFields((prev: any) => ({ ...prev, contact_image: p }))} aspectRatio="aspect-video w-full" />
                    </div>
                  </div>
                )}

                {/* ----------------- POLICY PAGES ----------------- */}
                {['privacy', 'terms'].includes(activePageId) && (
                  <div className="space-y-4">
                    <TextInputGroup label="Document Title" icon={Type} value={formFields.title} onChange={(v) => setFormFields((prev: any) => ({ ...prev, title: v }))} />
                    <TextAreaGroup label="Document Content Body" value={formFields.content} onChange={(v) => setFormFields((prev: any) => ({ ...prev, content: v }))} rows={18} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
