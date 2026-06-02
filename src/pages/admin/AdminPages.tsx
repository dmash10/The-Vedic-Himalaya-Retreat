import { useState, useEffect } from 'react';
import { useContent } from '@/hooks/useContent';
import { useImageZones } from '@/hooks/useImageZones';
import { motion } from 'framer-motion';
import {
  Save, Loader2, Image as ImageIcon, Plus, ChevronUp, ChevronDown, Trash2,
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
  { id: 'rooms', label: 'Rooms Page Settings' },
  { id: 'dining', label: 'Dining / Rest' },
  { id: 'weddings', label: 'Weddings' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'nearby', label: 'Nearby Places' },
  { id: 'gallery', label: 'Gallery Page' },
  { id: 'contact', label: 'Contact Us' },
  { id: 'booking', label: 'Booking Page' },
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'terms', label: 'Terms of Stay' }
];

// Fallback Default Content Catalogs (Syncs Frontend Default Assets to CMS when DB is unpopulated)
const DEFAULT_HOME_POLAROIDS = [
  { title: "Double Pine Suite", desc: "ELEVATED ALPINE LIVING", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800", is_visible: true },
  { title: "Monastic Ease", desc: "COZY HEARTH COMPANIONSHIP", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600", is_visible: true },
  { title: "Chaukhamba Peak", desc: "MISTY GOLDEN RANGE VISTAS", image: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80&w=800", is_visible: true },
  { title: "Hearthside Breads", desc: "ORGANIC BAKED SATTVIK SELECTIONS", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600", is_visible: true }
];

const DEFAULT_HOME_OFFERINGS = [
  { num: "01", badge: "CELESTIAL MEMORIES", title: "Destination Weddings", description: "Exchange eternal vows on elegant stone cedar terraces wreathed in soft misty breeze and sacred Himalayan aesthetics.", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200", bgClass: "bg-[#3A1412]", textClass: "text-[#FAF9F5]", coords: "N 30° 16' 10\" // E 79° 04' 40\"", icon: "Heart", is_visible: true },
  { num: "02", badge: "RETREAT BASECAMP", title: "Kedarnath Yatra Stay", description: "Your premium high-altitude rest sanctuary base. Retreat to comfortable modern pine wood cabins nestled along the sacred pilgrimage route.", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200", bgClass: "bg-[#0f2822]", textClass: "text-[#FAF9F5]", coords: "N 30° 16' 12\" // E 79° 04' 45\"", icon: "Mountain", is_visible: true },
  { num: "03", badge: "INNER WELLNESS", title: "Yoga & Prana Studio", description: "Tune your physical vessel with high-altitude breathing alignment, meditative pine forest morning walks, and sunset sound bowls.", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200", bgClass: "bg-[#EFEAE1]", textClass: "text-[#0B1714]", coords: "N 30° 16' 15\" // E 79° 04' 50\"", icon: "Wind", is_visible: true },
  { num: "04", badge: "VILLAGE RETREAT", title: "Himalayan Village Life", description: "Uncover quiet mountain paths, pure riverbeds, organic farming cycles, and the timeless warmth of authentic local communities.", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200", bgClass: "bg-[#09100e]", textClass: "text-[#FAF9F5]", coords: "N 30° 16' 18\" // E 79° 04' 52\"", icon: "Compass", is_visible: true }
];

const DEFAULT_HOME_AMENITIES = [
  { title: "Forest Yoga Shala", desc: "Sunrise Vaastu shala with sound therapy.", icon: "Wind", is_visible: true },
  { title: "Claypot Sattvik Kitchen", desc: "No white sugars, unrefined regional grains.", icon: "Utensils", is_visible: true },
  { title: "Electric Heated Bedding", desc: "Continuous internal warmth under pure heavy wool.", icon: "Bed", is_visible: true },
  { title: "Supabase Fast WiFi", desc: "Continuous coverage for absolute digital ease.", icon: "Wifi", is_visible: true }
];

const DEFAULT_HOME_WHY_CHOOSE_ITEMS = [
  { num: "01", category: "CALM SILENCE", title: "Out of the Chaos", desc: "Located high above the busy transit highway. Breathe in the pristine, quiet spruce-and-pine mountain slopes, completely free of diesel horns and traffic engines.", icon: "Compass", is_visible: true },
  { num: "02", category: "ALPINE COMFORT", title: "Comfortable Cozy Cabins", desc: "Escape the freezing high-altitude winds. Unwind in draft-protected pine suites with private hot water geysers, mountain views, and thick premium winter duvets.", icon: "BedDouble", is_visible: true },
  { num: "03", category: "UNTOUCHED BREATH", title: "Pure Clean Air", desc: "Wake up energized. Crisp mountain currents blow straight off the high snowy peak glaciers, naturally filtered by dense evergreens before climbing Semi Guptkashi's scenic ridge.", icon: "Wind", is_visible: true },
  { num: "04", category: "CARING HOSPITALITY", title: "Devoted Himalayan Sewa", desc: "Genuine, humble local team serving selfless mountain devotion—brewing warming morning herbal teas & coordinating peaceful local pilgrimage routes like family.", icon: "Users", is_visible: true }
];

const DEFAULT_HOME_BENTO_GALLERY = [
  { image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1000", title: "Dining" },
  { image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800", title: "Wedding" },
  { image: "https://images.unsplash.com/photo-1443632864897-14973fa006cf?auto=format&fit=crop&q=80&w=800", title: "Pines" },
  { image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800", title: "Cafe" },
  { image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200", title: "Glamping" }
];

const DEFAULT_SOCIAL_PROOF_REVIEWS = [
  { name: "Harshvardhan Joshi", date: "May 2025", rating: 5, state: "Maharashtra", text: "Stayed here for 2 days during our pilgrimage. The gentle climb up to this high-altitude property is totally worth it. The view of Chaukhamba peaks in the golden morning light is absolutely stunning. The staff is incredibly helpful and arranged a smooth local transfer for our early departure.", approved: true },
  { name: "Ramesh Gupta", date: "October 2024", rating: 4, state: "Gujarat", text: "Very peaceful place. It is far from the dust and traffic noise of Guptkashi bazaar. Clean rooms, hot water was regular which is rare in mountains. Best part is the pure veg food, super simple and tasty like home. Highly recommend.", approved: true },
  { name: "Meenakshi Iyer", date: "December 2024", rating: 5, state: "Tamil Nadu", text: "We were traveling with our 70-year-old parents. The staff personally helped them with their heavy bags up the stairs. Rooms have proper wooden interiors which kept us warm. The kitchen staff prepared simple oil-free khichdi on request.", approved: true },
  { name: "Kuldeep Singh", date: "June 2025", rating: 4, state: "Haryana", text: "Clean rooms, beautiful views of the valley. The property is very quiet. Only thing is Wi-Fi was bit slow in the night, but we didn't mind because the pine forest walk nearby was beautiful. Good value for money.", approved: true }
];

const DEFAULT_ABOUT_PILLARS = [
  { id: '01', title: 'ORGANIC CUSTODIANSHIP', desc: 'Sustaining high-altitude terrain integrity with local terrace field grains.', icon: 'Trees', is_visible: true },
  { id: '02', title: 'AYURVEDIC RESONANCE', desc: 'Constructing physical wellness around daily sun cycle menus and spring dew.', icon: 'Leaf', is_visible: true },
  { id: '03', title: 'SACRED RESTORATION', desc: 'A peaceful pilgrimage base camp designed for genuine spiritual restoration.', icon: 'Sparkles', is_visible: true }
];

const DEFAULT_ROOMS_AMENITIES = [
  { label: "Electric Heated Beds", icon: "Bed", desc: "Dual control electric temperature overlays.", is_visible: true },
  { label: "Mountain View Balcony", icon: "Mountain", desc: "Private sit-out facing misty Chaukhamba peaks.", is_visible: true },
  { label: "Organic Herb Brews", icon: "Coffee", desc: "Complimentary raw ginger tea upon arrival.", is_visible: true },
  { label: "High-Speed Internet", icon: "Wifi", desc: "Sanctuary-wide continuous high bandwidth.", is_visible: true },
  { label: "Slate Hot Baths", icon: "Droplets", desc: "Continuous mountain hot spring streams.", is_visible: true },
  { label: "Monastic Lounge Desks", icon: "Briefcase", desc: "Hand-beaten local deodar wood work desks.", is_visible: true }
];

const DEFAULT_ROOMS_REVIEWS = [
  { name: "Arjun Sharma", rating: 5, location: "New Delhi", date: "May 2026", text: "The Pinewood suite was an exceptional rest base before our Kedarnath trek. The electric bed heating made a huge difference in the mountain chill.", source: "google", is_visible: true },
  { name: "Devika Rao", rating: 5, location: "Bangalore", date: "April 2026", text: "A truly restorative space. Waking up to the misty views of Chaukhamba peaks and hot ginger brews was unforgettable.", source: "tripadvisor", is_visible: true },
  { name: "Rahul Verma", rating: 5, location: "Mumbai", date: "May 2026", text: "Pure organic Sattvik dining and serene forest surroundings. The staff coordinated our puja circuits beautifully.", source: "google", is_visible: true }
];

const DEFAULT_DINING_SPECIALTIES = [
  { num: "01", title: "Vessel of Sacred Gehat (Garhwal Valley)", desc: "Slow-simmered medicinal black gehat beans prepared in heavy ironware, paired with unpolished red rice grown in the irrigated terrace fields of Triyuginarayan, topped with hand-churned mountain cow A2 ghee.", energy: "Sattvik Vitality", origin: "Local Ridge Farms", attribute: "Pilgrimage Restorative", category: "grains", is_visible: true },
  { num: "02", title: "Hand-Rolled Mandua Flatbreads & Rhododendron Extract", desc: "Stone-ground alpine ragi crop griddle breads baked over open deodar woods on porous earthen plates. Served warm with raw wild mountain honey and salted organic walnut dust.", energy: "Prana Restoration", origin: "High Guptkashi Ridge", attribute: "Alkaline Fuel", category: "grains", is_visible: true },
  { num: "03", title: "Templed Phaanu Claypot stew", desc: "An organic pureed stew of native hillside soybeans, slow-simmered for nine hours inside local earthen vessels, tempered with mountain celery root and active wild rock caraway.", energy: "Sacred Food", origin: "Kedarnath Foothills", attribute: "Cellular Digestion", category: "stews", is_visible: true },
  { num: "04", title: "Infused Ginger-Tulsi Somras", desc: "A hot purifying wild herbal beverage brewed from hand-gathered holy basil stems, crushed mountain ginger roots, and crystallized forest honey, balanced to boost respiratory ease.", energy: "Meadow Tonic", origin: "Retreat Herbal Garden", attribute: "Active Peak Warmth", category: "elixirs", is_visible: true }
];

const DEFAULT_DINING_ALCHEMY = [
  { id: "clay", title: "The Earthen Mudpot", tagline: "9-HOUR EMBERS & POROUS CLAY", desc: "Vessel walls shaped by hand from Mandakini riverbed silt. As the pots simmer slow over low heat for nine hours, the porous natural minerals bind with grain stars, locking in unrefined earth elements with zero synthetic reactions.", illustration: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800", vessel: "Traditional Himalayan Claypots", benefit: "Retains high soil mineral density", smoke: "Deodar log whispers", accentColor: "#1B4C44", is_visible: true },
  { id: "iron", title: "The Heavy Ironware", tagline: "RAW CAST ROASTING", desc: "Pre-heated heavy black iron cauldrons, seasoned thoroughly for generations. Gehat beans and therapeutic wild celery roots are slow-cooked under high iron weights, infusing raw minerals and retaining dense nutrients.", illustration: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800", vessel: "Hand-Beaten Mountain Ironware", benefit: "Supports micro-biological blood health", smoke: "Cedar timber glow", accentColor: "#A88C52", is_visible: true },
  { id: "embers", title: "The Timber Hearth", tagline: "BAKED ABOVE SPECIATED ASHES", desc: "Our hearth uses clean fallen deodar timber logs. Flour is ground, kneaded in hand-beaten bronze pans, and slow-baked on hot regional flagstones using only the radiant warmth of embers.", illustration: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800", vessel: "Fallen Deodar Bark Hearth", benefit: "Purifies respiratory pathways naturally", smoke: "Pine essence atmosphere", accentColor: "#2E3438", is_visible: true }
];

const DEFAULT_DINING_POLAROIDS = [
  { title: "Slate Pavilion Hearth", desc: "WOOD-FIRED EMBERS COOKING", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800", is_visible: true },
  { title: "Terrace Herbal Garden", desc: "DAILY FRESH SATTVIK INFUSIONS", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600", is_visible: true },
  { title: "Pilgrim Bread Griddle", desc: "HAND-BEATEN ALKALI MANDUA", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800", is_visible: true }
];

const DEFAULT_DINING_RITUALS = [
  { id: "morning", time: "06:00 - SUNRISE", title: "Dew Elixirs & Chants", desc: "Enjoy a warm ginger-basil infusion while viewing peak reflections. Our Pujari performs a Vaastu clearing chant on the terrace shala.", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800", stats: { warmth: "Moderate", focus: "Spiritual", herbs: "Basil Dew" }, is_visible: true },
  { id: "noon", time: "12:00 - ZENITH", title: "The Valley Platter", desc: "Hyper-local terraced crops prepared inside heavy cast iron pots. Organic unpolished grains digest thoroughly to sustain high-altitude trekking.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800", stats: { warmth: "Optimal", focus: "Physical", herbs: "Caraway Seeds" }, is_visible: true },
  { id: "sunset", time: "18:00 - TWILIGHT", title: "Fireside Claypot Stew", desc: "Gather around the Slate fire bowl. Earthenware dishes are slow-simmered over deodar wood fires, promoting respiratory cellular ease.", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800", stats: { warmth: "High", focus: "Restorative", herbs: "Celery Root" }, is_visible: true }
];

const DEFAULT_DINING_VOWS = [
  { id: "vow1", icon: "Leaf", title: "Hyper-Local Terraced Crops", desc: "No white sugars, no chemical salts.", expanded_desc: "We strictly coordinate our kitchen procurement directly with traditional terrace farm families in Triyuginarayan and high Guptkashi fields.", is_visible: true },
  { id: "vow2", icon: "Flame", title: "Wood Hearth Embers", desc: "Cooking inside raw local clays and regional cast iron vessels.", expanded_desc: "We completely reject standard industrial pans, baking solely on ancestral heated flagstones and slow-simmering inside native clays.", is_visible: true }
];

const DEFAULT_WEDDINGS_POLAROIDS = [
  { image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800", title: "Sacred Canopy", desc: "VOWS UNDER MAJESTIC SUMMITS", is_visible: true },
  { image: "https://images.unsplash.com/photo-1519225495810-7512c322a3e6?auto=format&fit=crop&q=80&w=800", title: "Candlelit Glass", desc: "GLOWING EVENING SALON RECEPTIONS", is_visible: true },
  { image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800", title: "High Pine Lawn", desc: "ALFRESCO DEODAR BANQUETS", is_visible: true },
  { image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800", title: "Floral Mandap", desc: "TRADITIONAL GARHWALI HARMONY", is_visible: true }
];

const DEFAULT_WEDDINGS_VENUES = [
  {
    id: "canopy-lawn",
    title: "Sacred Canopy Lawn",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600",
    capacity: "Up to 20 guests",
    location: "East Sanctuary Facing",
    highlight: "Kedarnath peaks backdrop during golden sunset hours.",
    vibe: "Intimate, Sacred Open Sky",
    tags: ["Panoramic Vistas", "Open Wood Hearth", "Custom Carpets"],
    is_visible: true
  },
  {
    id: "glass-pavilion",
    title: "The Glass Pavilion",
    image: "https://images.unsplash.com/photo-1519225495810-7512c322a3e6?auto=format&fit=crop&q=80&w=600",
    capacity: "Up to 20 guests",
    location: "Sanctuary Center",
    highlight: "Framed gorge viewline with cozy slate under-floor heat.",
    vibe: "Editorial, Celestial",
    tags: ["Pine Forest Views", "Heated Stone Slabs", "Ambient Chandeliers"],
    is_visible: true
  },
  {
    id: "chaukhamba-terrace",
    title: "Chaukhamba Terrace",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600",
    capacity: "Up to 20 guests",
    location: "High Ridge Level",
    highlight: "Porous Himalayan flagstones optimal for fire havan mantras.",
    vibe: "Vedic, Spiritual Purity",
    tags: ["Altar Space", "Mandakini Breezes", "Copper Lamp Rails"],
    is_visible: true
  },
  {
    id: "deodar-garden",
    title: "Deodar Forest Garden",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600",
    capacity: "Up to 20 guests",
    location: "West Sanctuary Ridge",
    highlight: "Deep forest whispers, warm pathway fire cups, zero plastic.",
    vibe: "Mystical, Eco-Luxury",
    tags: ["Tall Pines Sieve", "Fallen Spruce Bark Path", "Candle Glow Only"],
    is_visible: true
  }
];

const DEFAULT_WEDDINGS_OFFERINGS = [
  {
    num: "01",
    badge: "CAPACITY LIMITS",
    title: "Up to 20 Guests",
    description: "Exclusively limited to 20 guests for exquisite mountain buyouts. Host a deeply intimate, sacred micro-destination wedding with full retreat access.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    bgClass: "bg-[#0f2822]",
    textClass: "text-[#FAF9F5]",
    coords: "N 30° 16' 10\" // E 79° 04' 40\"",
    is_visible: true
  },
  {
    num: "02",
    badge: "CULINARY ARTISTRY",
    title: "Bespoke Sattvik Menus",
    description: "Pure vegetarian, regional organic ingredients curated carefully by our executive chefs for high physical vitality and ultimate sensory purity.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200",
    bgClass: "bg-[#3A1412]",
    textClass: "text-[#FAF9F5]",
    coords: "N 30° 16' 12\" // E 79° 04' 45\"",
    is_visible: true
  },
  {
    num: "03",
    badge: "EXCLUSIVE ACCESS",
    title: "Entire Retreat Buyouts",
    description: "Complete private access to all of our local temperature-controlled luxury pinewood suites, private lawns, paths, and dedicated resort staff.",
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200",
    bgClass: "bg-[#FAF9F5]",
    textClass: "text-[#0B1714]",
    coords: "N 30° 16' 15\" // E 79° 04' 50\"",
    is_visible: true
  },
  {
    num: "04",
    badge: "SACRED METRICS",
    title: "Sacred Havan Canopy",
    description: "Traditional cedarwood fire altars aligned with celestial astrologies, providing peaceful chanting vibrations under starlit Himalayan mountain skies.",
    image: "https://images.unsplash.com/photo-1519225495810-7512c322a3e6?auto=format&fit=crop&q=80&w=1200",
    bgClass: "bg-[#09100e]",
    textClass: "text-[#FAF9F5]",
    coords: "N 30° 16' 18\" // E 79° 04' 52\"",
    is_visible: true
  }
];

const DEFAULT_EXPERIENCES_SLIDES = [
  {
    id: "yatra",
    category: "PILGRIMAGE LOGISTICS",
    title: "Pilgrimage Support",
    subtitle: "Sacred trails & custom local guiding",
    description: "Acclimatize comfortably in the sacred atmosphere of Guptkashi. We coordinate custom guided trail mappings, curate historic local temple walks, and handle localized vehicle coordination.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=2000",
    icon: "Mountain",
    is_visible: true
  },
  {
    id: "yoga",
    category: "WELLNESS",
    title: "Yoga & Breathing",
    subtitle: "Morning sessions for mountain high altitudes",
    description: "Practice standard morning yoga and guided deep breathing with our instructors to help normalize breathing at high physical altitudes.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=2000",
    icon: "Wind",
    is_visible: true
  },
  {
    id: "weddings",
    category: "EVENT VENUE",
    title: "Mountain Weddings",
    subtitle: "Custom local setups and catering",
    description: "Host your wedding against the mountain backdrop. We provide pine wood decorations, native Garhwali folk instrumental music, and organic vegetarian dining.",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=2000",
    icon: "Sparkles",
    is_visible: true
  },
  {
    id: "village",
    category: "LOCAL TRIPS",
    title: "Guided Village Hikes",
    subtitle: "Local trails and pony excursions",
    description: "Trek through surrounding forest routes with a local resident, explore nearby mountain viewpoints on sturdily trained ponies, or walk through the historic village lanes.",
    image: "https://images.unsplash.com/photo-1566378268012-ea11aa6e7b46?auto=format&fit=crop&q=80&w=2000",
    icon: "Compass",
    is_visible: true
  },
  {
    id: "bonfire",
    category: "RECREATION",
    title: "Evening Bonfire",
    subtitle: "Outdoor seating around a real mountain fire",
    description: "Relax in our open-air courtyard around a slow-burning pinewood fire. Drink hot ginger tea alongside fellow travelers under clear night vistas.",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=2000",
    icon: "Flame",
    is_visible: true
  }
];

const DEFAULT_EXPERIENCES_GALLERY = [
  { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200", caption: "Cozy Pinewood Cottage Bedroom", is_visible: true },
  { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200", caption: "Misty Sunrise on Chaukhamba Peaks", is_visible: true },
  { url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200", caption: "Hot House-Sourced Organic Sattvik Lunch", is_visible: true },
  { url: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200", caption: "Outer Glamping Deck Encased in Pine Woods", is_visible: true },
  { url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200", caption: "Panoramic Sunrise High Altitude Yoga Shala", is_visible: true },
  { url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200", caption: "Private Cedar Walking Trails Surrounding Retreat", is_visible: true },
  { url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=1200", caption: "Hand-Brewed Local Ginger and Basil Tea", is_visible: true },
  { url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=1200", caption: "Cold Pinewood Clear Sky Stargazing", is_visible: true }
];

const DEFAULT_NEARBY_SLIDES = [
  {
    id: "tungnath",
    category: "SACRED SUMMIT TREK",
    title: "Tungnath & Chandrashila",
    subtitle: "The highest shrine of Shiva at 3,680 meters",
    description: "Climb past high alpine ridges and rhododendron groves. A beautiful stone path leads to the 1000-year-old Tungnath Temple. Push further to Chandrashila Peak (4,130m) for a complete 360-degree panorama of Trishul, Nanda Devi, and Chaukhamba snow peaks.",
    image: "https://images.unsplash.com/photo-1626082896492-766af4fc6595?auto=format&fit=crop&q=80&w=2000",
    icon: "Mountain",
    altitude: "3,680m - 4,130m",
    distance: "4 km from Chopta Base",
    duration: "3-4 Hours",
    is_visible: true
  },
  {
    id: "triyuginarayan",
    category: "CELESTIAL HERITAGE",
    title: "Triyuginarayan Temple",
    subtitle: "The wedding flame of Shiva & Goddess Parvati",
    description: "A monumental temple of majestic dry grey slate. Built on sacred mythological alignments, it guards the 'Akhand Dhuni'—an eternal wedding fire that has burned continuously for cosmic epochs. Legend confirms pilgrims receive marital blessing by adding timber logs to the holy smoke.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=2000",
    icon: "Heart",
    altitude: "1,980m",
    distance: "1.5 Hours Drive from Retreat",
    duration: "Half-Day Trip",
    is_visible: true
  },
  {
    id: "chopta",
    category: "ALPINE MEADOW REFUGE",
    title: "Chopta Valley",
    subtitle: "The legendary mini switzerland of Uttarakhand",
    description: "Nestled within Kedarnath Wild Forest Sanctuary, this scenic meadow is surrounded by dense, mossy pine, spruce, and pink cedar. Home to rare monal pheasants, Chopta offers pristine winds and clean stars.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=2000",
    icon: "Trees",
    altitude: "2,680m",
    distance: "1 Hour Scenic Drive from Retreat",
    duration: "Full-Day Exploration",
    is_visible: true
  },
  {
    id: "kartikswami",
    category: "RIDGE-TOP SHIELD",
    title: "Kartik Swami Mandir",
    subtitle: "A floating cliff haven on narrow vertical spires",
    description: "Dramatically built on a sharp, vertical knife-edge ridge at 3,050 meters. Accessible via a scenic 3km trail from Kanakchauri village, the approach is wreathed by hundreds of ringing bell bells offered by travelers.",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=2000",
    icon: "Mountain",
    altitude: "3,050m",
    distance: "1.5 Hours Scenic Trail Drive",
    duration: "Half-Day Exploration",
    is_visible: true
  },
  {
    id: "deoriatal",
    category: "GLACIAL REfLECTION",
    title: "Deoria Tal Lake",
    subtitle: "Mirror of the royal Chaukhamba peak summits",
    description: "A magical mountain freshwater lake sheltered inside dense, green oak canopies. At quiet sunrises, the water turns glass-like, throwing an immaculate mirror image of the grand Chaukhamba glaciers.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000",
    icon: "Compass",
    altitude: "2,438m",
    distance: "45 Mins to Sari + 3km walk",
    duration: "Half-Day Hike",
    is_visible: true
  },
  {
    id: "madmaheshwar",
    category: "PANCH KEDAR MYSTERY",
    title: "Madmaheshwar Meadows",
    subtitle: "An isolated green valley under glaciers",
    description: "A gorgeous trek alongside deep glacial canyons, mountain log bridges, and dense bamboo covers. The majestic ancient temple structure is framed within a vast green bugyal (meadow).",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=2000",
    icon: "Mountain",
    altitude: "3,490m",
    distance: "Drive to Ransi + 16km trek",
    duration: "1-2 Days Journey",
    is_visible: true
  },
  {
    id: "guptkashi",
    category: "LOCAL CULTURAL CORE",
    title: "Guptkashi Vishwanath",
    subtitle: "Historic masonry shrines and Manikarnika Kund",
    description: "The historical heart of our valley. Wreathed in centuries of legends, it houses the majestic stone Vishwanath Temple matching the design of Kashi.",
    image: "https://images.unsplash.com/photo-1627855913251-512c1b2f0b78?auto=format&fit=crop&q=80&w=2000",
    icon: "Compass",
    altitude: "1,319m",
    distance: "10 Mins from Retreat",
    duration: "1-2 Hours Walk",
    is_visible: true
  }
];

const DEFAULT_NEARBY_TREKS = [
  { title: "Chorabari Tal Lake", subtitle: "GLACIAL BASIN TRAIL", difficulty: "Moderate", altitude: "3,900m", distance: "14km from base", bestSeason: "May - Oct", duration: "6 Hours", highlight: "Stunning glacier views", description: "A gorgeous trek starting from the Kedarnath temple trail heading to the crystal clear glacial lake basin.", is_visible: true }
];

const DEFAULT_NEARBY_GALLERY = [
  { url: "https://images.unsplash.com/photo-1626082896492-766af4fc6595?auto=format&fit=crop&q=80&w=1200", caption: "Sacred shrine bells framing snowbound peaks at Tungnath", is_visible: true },
  { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200", caption: "Double golden mirroring of Chaukhamba Peaks in Deoria Tal Lake", is_visible: true },
  { url: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200", caption: "Ancient mountain ridges fading into twilight orange gradients", is_visible: true },
  { url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=1200", caption: "Rich velvet meadow paths in Chopta valley wreathed in mist", is_visible: true },
  { url: "https://images.unsplash.com/photo-1598325492474-0fadd61a8685?auto=format&fit=crop&q=80&w=1200", caption: "Timeless brass bells hung in sacred cliff shrines", is_visible: true },
  { url: "https://images.unsplash.com/photo-1566378268012-ea11aa6e7b46?auto=format&fit=crop&q=80&w=1200", caption: "Climbing handcarved slate steps in high alpine hamlet walks", is_visible: true },
  { url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1200", caption: "Cosmic starlit night skies hovering over high range basecamps", is_visible: true },
  { url: "https://images.unsplash.com/photo-1533130061792-64b345e4e837?auto=format&fit=crop&q=80&w=1200", caption: "Deep emerald pine canopy and alpine fog surrounding our routes", is_visible: true }
];

const DEFAULT_GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200", category: "Peaks & Vibe", title: "Chaukhamba Summits", desc: "Glacial snow peaks overlooking our open sunrise yoga deck.", is_visible: true },
  { src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200", category: "Sanctuary Suites", title: "Luxury Mountain Suite", desc: "Cozy custom electric temperature beds lined with organic heavy wool blankets.", is_visible: true },
  { src: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1200", category: "Spiritual Life", title: "The Slate Dining Pavilion", desc: "Pure organic thalis cooked over fresh timber and mountain logs.", is_visible: true },
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200", category: "Spiritual Life", title: "Himalayan Mandap Vows", desc: "Our cedar marriage lawns framed beautifully by pine forests and mountain fog.", is_visible: true },
  { src: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80&w=1200", category: "Peaks & Vibe", title: "Guptkashi Dawn Mist", desc: "Ethereal blue morning fog hanging gracefully over our cedar pine cliffs.", is_visible: true },
  { src: "https://images.unsplash.com/photo-1580977276076-ac4ccbec0680?auto=format&fit=crop&q=80&w=1200", category: "Sanctuary Suites", title: "Aura Bath & Spa Suite", desc: "Continuous organic hot water flows with cold slate stone tiles.", is_visible: true },
  { src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1200", category: "Spiritual Life", title: "Restorative Herbal Sips", desc: "Hot immune-support ginger remedies upon custom arrival desks.", is_visible: true },
  { src: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200", category: "Peaks & Vibe", title: "Sacred Temple Rays", desc: "Spiritual morning light pierces the traditional deodar woodwork in Guptkashi.", is_visible: true }
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

interface SectionSaveButtonProps {
  onSave: () => void;
  isSaving: boolean;
  label?: string;
}

function SectionSaveButton({ onSave, isSaving, label = "Save Section Changes" }: SectionSaveButtonProps) {
  return (
    <div className="flex justify-end pt-3 mt-4 border-t border-[#1C2E2A]/20">
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="relative group overflow-hidden px-5 py-2.5 bg-gradient-to-r from-[#C4A665] to-[#E2C58A] hover:from-[#FAF9F5] hover:to-[#FAF9F5] text-black font-extrabold text-[10px] uppercase tracking-[0.2em] rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50 hover:shadow-xl hover:shadow-[#C4A665]/10 cursor-pointer flex items-center gap-2 border border-[#C4A665]/20"
      >
        {isSaving ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Save className="w-3.5 h-3.5" />
        )}
        <span>{isSaving ? 'SAVING CHANGES...' : label}</span>
        <div className="absolute inset-0 border border-white/30 rounded-lg group-hover:scale-105 transition-transform duration-500 pointer-events-none" />
      </button>
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
  onSave?: () => void;
  isSaving?: boolean;
}

function ListEditor<T>({
  title,
  items,
  onChange,
  createDefaultItem,
  getItemLabel,
  getItemImage,
  renderItemEditor,
  onSave,
  isSaving
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

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...items];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    onChange(updated);
    if (activeIdx === idx) setActiveIdx(idx - 1);
    else if (activeIdx === idx - 1) setActiveIdx(idx);
  };

  const handleMoveDown = (idx: number) => {
    if (idx === items.length - 1) return;
    const updated = [...items];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    onChange(updated);
    if (activeIdx === idx) setActiveIdx(idx + 1);
    else if (activeIdx === idx + 1) setActiveIdx(idx);
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
            className={`relative group border rounded-xl overflow-hidden bg-[#060B0A]/40 p-2.5 cursor-pointer transition-colors flex flex-col justify-between min-h-[120px] ${
              activeIdx === idx ? 'border-[#C4A665]' : 'border-[#1C2E2A] hover:border-white/10'
            }`}
          >
            {/* Gold Pencil Edit Icon Overlay */}
            <div className="absolute top-2.5 right-2.5 bg-black/80 p-1.5 rounded-full text-[#C4A665] opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-[#C4A665]/20 shadow-md">
              <Edit3 className="w-3 h-3 text-[#C4A665]" strokeWidth={2.5} />
            </div>

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
              <div className="flex items-center gap-1.5">
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
                  onClick={() => handleMoveUp(idx)}
                  disabled={idx === 0}
                  className="p-1 rounded text-white/40 hover:text-[#C4A665] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                  title="Move Up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(idx)}
                  disabled={idx === items.length - 1}
                  className="p-1 rounded text-white/40 hover:text-[#C4A665] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                  title="Move Down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
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
        <div className="mt-4 p-4 bg-[#060B0A]/30 border border-[#1C2E2A] rounded-xl relative animate-in fade-in slide-in-from-top-2 duration-300">
          <button
            type="button"
            onClick={() => setActiveIdx(null)}
            className="absolute top-3 right-3 text-white/40 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {onSave && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 text-[10px] text-[#C4A665] font-bold bg-[#C4A665]/10 px-4 py-2.5 rounded-lg border border-[#C4A665]/20 shadow-inner">
              <span className="uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C4A665] animate-ping shrink-0" />
                ⚠️ UNSAVED CHANGES: CLICK "SAVE CURRENT PAGE" TO WRITE PERMANENTLY
              </span>
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#C4A665] text-black px-3.5 py-1.5 rounded-md text-[9px] font-extrabold uppercase tracking-[0.1em] hover:bg-[#FAF9F5] active:scale-95 disabled:opacity-50 cursor-pointer transition-all shadow-md"
              >
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                <span>{isSaving ? 'SAVING...' : 'SAVE CURRENT PAGE'}</span>
              </button>
            </div>
          )}

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
  const { zones, loading: zonesLoading, uploadImageDirect } = useImageZones();

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
  const [whyChooseItems, setWhyChooseItems] = useState<any[]>([]);
  const [bentoGalleryItems, setBentoGalleryItems] = useState<any[]>([]);
  const [socialProofReviews, setSocialProofReviews] = useState<any[]>([]);

  // Load effect
  useEffect(() => {
    if (contentLoading) return;

    // Load general values
    const textVal = (key: string, def = '') => getValue(activePageId, key, def);

    // Visibilities
    const sectionVisKeys = [
      'hero_visible', 'marquee_visible', 'story_visible', 'offerings_visible', 'amenities_visible',
      'why_choose_visible', 'home_gallery_visible', 'home_cta_visible', 'social_proof_visible',
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
        hero_subtitle: getValue('home', 'hero_subtitle', 'SEMI VILLAGE, Kedarnath Rd, Kund, Guptkashi'),
        hero_image: getValue('home', 'hero_image', ''),
        hero_cta: getValue('home', 'hero_cta', 'EXPLORE ROOMS'),
        hero_cta_link: getValue('home', 'hero_cta_link', '/rooms'),
        story_line1: getValue('home', 'story_line1', 'Casual Elegance'),
        story_line2: getValue('home', 'story_line2', 'Meets Alpine Charm'),
        story_desc: getValue('home', 'story_desc', 'Inspired by our pristine cedar forest surroundings...'),
        story_btn_name: getValue('home', 'story_btn_name', 'VIEW ALL ROOMS & SUITES'),
        story_btn_link: getValue('home', 'story_btn_link', '/rooms'),
        why_choose_tagline: getValue('home', 'why_choose_tagline', 'THE VEDIC HIMALAYA DIFFERENCE'),
        why_choose_heading: getValue('home', 'why_choose_heading', 'Why Guests Choose'),
        why_choose_heading_italic: getValue('home', 'why_choose_heading_italic', 'Our Sanctuary'),
        why_choose_desc1: getValue('home', 'why_choose_desc1', 'Most commercial hotels are grouped near busy transit stations, introducing constant vehicle fumes, generator hums, and crowd noise.'),
        why_choose_desc2: getValue('home', 'why_choose_desc2', "The Vedic Himalaya Retreat sits high on the scenic, quiet shelf of Semi Village, Kund, Guptkashi. Here, you are beautifully elevated into the silent pines, looking straight out onto snowy Chaukhamba sweeps."),
        home_gallery_badge: getValue('home', 'home_gallery_badge', 'Gallery'),
        home_gallery_heading: getValue('home', 'home_gallery_heading', 'Our Visual Journal'),
        home_gallery_desc: getValue('home', 'home_gallery_desc', 'Capturing moments of alpine light, tranquil silence, and devotion across our sacred sanctuary garden.'),
        home_cta_badge: getValue('home', 'home_cta_badge', 'Your Himalayan Haven Awaits'),
        home_cta_heading: getValue('home', 'home_cta_heading', 'Ready to Experience the'),
        home_cta_heading_italic: getValue('home', 'home_cta_heading_italic', 'Pinewood Calm?'),
        home_cta_desc: getValue('home', 'home_cta_desc', 'Secure your sanctuary space high in the mountain evergreens ahead of your sacred pilgrimage. Clean air, warm hospitality, and pure alpine peace.'),
        home_cta_btn_text: getValue('home', 'home_cta_btn_text', 'Book Your Stay Today'),
        home_cta_btn_link: getValue('home', 'home_cta_btn_link', '/rooms'),
        social_proof_tagline: getValue('home', 'social_proof_tagline', 'GUEST TESTIMONIALS'),
        social_proof_heading: getValue('home', 'social_proof_heading', 'EXCELLENT'),
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

      try {
        const val = JSON.parse(getValue('home', 'polaroids', '[]'));
        setPolaroids(Array.isArray(val) && val.length > 0 ? val : DEFAULT_HOME_POLAROIDS);
      } catch {
        setPolaroids(DEFAULT_HOME_POLAROIDS);
      }
      try {
        const val = JSON.parse(getValue('home', 'offerings', '[]'));
        setOfferings(Array.isArray(val) && val.length > 0 ? val : DEFAULT_HOME_OFFERINGS);
      } catch {
        setOfferings(DEFAULT_HOME_OFFERINGS);
      }
      try {
        const val = JSON.parse(getValue('home', 'amenities', '[]'));
        setAmenities(Array.isArray(val) && val.length > 0 ? val : DEFAULT_HOME_AMENITIES);
      } catch {
        setAmenities(DEFAULT_HOME_AMENITIES);
      }
      try {
        const val = JSON.parse(getValue('home', 'why_choose_items', '[]'));
        setWhyChooseItems(Array.isArray(val) && val.length > 0 ? val : DEFAULT_HOME_WHY_CHOOSE_ITEMS);
      } catch {
        setWhyChooseItems(DEFAULT_HOME_WHY_CHOOSE_ITEMS);
      }
      try {
        const val = JSON.parse(getValue('home', 'bento_gallery_items', '[]'));
        setBentoGalleryItems(Array.isArray(val) && val.length > 0 ? val : DEFAULT_HOME_BENTO_GALLERY);
      } catch {
        setBentoGalleryItems(DEFAULT_HOME_BENTO_GALLERY);
      }
      try {
        const val = JSON.parse(getValue('home', 'social_proof_reviews', '[]'));
        setSocialProofReviews(Array.isArray(val) && val.length > 0 ? val : DEFAULT_SOCIAL_PROOF_REVIEWS);
      } catch {
        setSocialProofReviews(DEFAULT_SOCIAL_PROOF_REVIEWS);
      }
    } else if (activePageId === 'about') {
      setFormFields({
        about_heading: getValue('about', 'about_heading', 'Our Story'),
        about_subheading: getValue('about', 'about_subheading', 'Surrounded by nature, crafted with passion'),
        about_main_text: getValue('about', 'about_main_text', ''),
        about_highlights: getValue('about', 'about_highlights', ''),
        about_image: getValue('about', 'about_image', ''),
      });
      try {
        const val = JSON.parse(getValue('about', 'pillars', '[]'));
        setPillars(Array.isArray(val) && val.length > 0 ? val : DEFAULT_ABOUT_PILLARS);
      } catch {
        setPillars(DEFAULT_ABOUT_PILLARS);
      }
    } else if (activePageId === 'rooms') {
      setFormFields({
        rooms_heading: getValue('rooms', 'rooms_heading', 'Sanctuary Suites'),
        rooms_subheading: getValue('rooms', 'rooms_subheading', 'Luxury Mountain Lodging'),
        rooms_image: getValue('rooms', 'rooms_image', ''),
        rooms_notice: getValue('rooms', 'rooms_notice', 'Important Booking Notice...'),
      });
      try {
        const val = JSON.parse(getValue('rooms', 'rooms_amenities', '[]'));
        setRoomsAmenities(Array.isArray(val) && val.length > 0 ? val : DEFAULT_ROOMS_AMENITIES);
      } catch {
        setRoomsAmenities(DEFAULT_ROOMS_AMENITIES);
      }
      try {
        const val = JSON.parse(getValue('rooms', 'rooms_reviews', '[]'));
        setRoomsReviews(Array.isArray(val) && val.length > 0 ? val : DEFAULT_ROOMS_REVIEWS);
      } catch {
        setRoomsReviews(DEFAULT_ROOMS_REVIEWS);
      }
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
      try {
        const val = JSON.parse(getValue('dining', 'specialty_dishes', '[]'));
        setSpecialtyDishes(Array.isArray(val) && val.length > 0 ? val : DEFAULT_DINING_SPECIALTIES);
      } catch {
        setSpecialtyDishes(DEFAULT_DINING_SPECIALTIES);
      }
      try {
        const val = JSON.parse(getValue('dining', 'kitchen_alchemies', '[]'));
        setAlchemies(Array.isArray(val) && val.length > 0 ? val : DEFAULT_DINING_ALCHEMY);
      } catch {
        setAlchemies(DEFAULT_DINING_ALCHEMY);
      }
      try {
        const val = JSON.parse(getValue('dining', 'dining_polaroids', '[]'));
        setDiningPolaroids(Array.isArray(val) && val.length > 0 ? val : DEFAULT_DINING_POLAROIDS);
      } catch {
        setDiningPolaroids(DEFAULT_DINING_POLAROIDS);
      }
      try {
        const val = JSON.parse(getValue('dining', 'daily_rituals', '[]'));
        setDailyRituals(Array.isArray(val) && val.length > 0 ? val : DEFAULT_DINING_RITUALS);
      } catch {
        setDailyRituals(DEFAULT_DINING_RITUALS);
      }
      try {
        const val = JSON.parse(getValue('dining', 'dining_vows', '[]'));
        setDiningVows(Array.isArray(val) && val.length > 0 ? val : DEFAULT_DINING_VOWS);
      } catch {
        setDiningVows(DEFAULT_DINING_VOWS);
      }
    } else if (activePageId === 'weddings') {
      setFormFields({
        weddings_heading: getValue('weddings', 'weddings_heading', 'Destination Weddings'),
        weddings_subheading: getValue('weddings', 'weddings_subheading', 'Sacred Celebrations in the Himalayas'),
        weddings_image: getValue('weddings', 'weddings_image', ''),
        weddings_hero_badge: getValue('weddings', 'weddings_hero_badge', 'SACRED WEDDINGS & CELEBRATIONS'),
        weddings_hero_desc: getValue('weddings', 'weddings_hero_desc', ''),
        weddings_story_title: getValue('weddings', 'weddings_story_title', 'Ancestral Purity'),
        weddings_story_subtitle: getValue('weddings', 'weddings_story_subtitle', 'In Sacred Commemoration'),
        weddings_story_desc: getValue('weddings', 'weddings_story_desc', ''),
        weddings_story_script: getValue('weddings', 'weddings_story_script', 'Himalayan Pure Blessings'),
        weddings_story_heading: getValue('weddings', 'weddings_story_heading', 'Intimate, Cinematic'),
        weddings_story_heading_italic: getValue('weddings', 'weddings_story_heading_italic', '&'),
        weddings_story_subheading: getValue('weddings', 'weddings_story_subheading', 'Unforgettable'),
        weddings_story_paragraph: getValue('weddings', 'weddings_story_paragraph', 'From beautiful pre-marriage morning rituals on our mountain-sky deodar terraces to customized wedding lawns set before a majestic valley backdrop, The Vedic Himalaya Retreat coordinates an exceptional blend of premium hospitality, local Garhwali flavor thalis, and pure mountain atmosphere.'),
        weddings_venues_tagline: getValue('weddings', 'weddings_venues_tagline', 'SACRED VENUE GRID'),
        weddings_venues_heading: getValue('weddings', 'weddings_venues_heading', 'Our Ceremony'),
        weddings_venues_heading_italic: getValue('weddings', 'weddings_venues_heading_italic', 'Spaces'),
        weddings_venues_desc: getValue('weddings', 'weddings_venues_desc', 'Choose from our hand-selected indoor and outdoor spaces, each featuring high altitude forest views and traditional wood hearth configurations.'),
        weddings_offerings_tagline: getValue('weddings', 'weddings_offerings_tagline', 'Wedding Specifications'),
        weddings_offerings_heading: getValue('weddings', 'weddings_offerings_heading', 'Sacred'),
        weddings_offerings_heading_italic: getValue('weddings', 'weddings_offerings_heading_italic', 'Aesthetics'),
        weddings_offerings_desc: getValue('weddings', 'weddings_offerings_desc', 'Bespoke Arrangements & Sanctuary parameters'),
        weddings_gallery_tagline: getValue('weddings', 'weddings_gallery_tagline', 'PHOTO CAPTURES'),
        weddings_gallery_heading: getValue('weddings', 'weddings_gallery_heading', 'Celebration'),
        weddings_gallery_heading_italic: getValue('weddings', 'weddings_gallery_heading_italic', 'Aesthetics'),
        weddings_gallery_desc: getValue('weddings', 'weddings_gallery_desc', 'A cinematic visual registry of tables decorated exclusively with wild mountain blooms and wooden embers.'),
        weddings_cta_btn_text: getValue('weddings', 'weddings_cta_btn_text', 'Inquire for Events'),
        weddings_cta_btn_link: getValue('weddings', 'weddings_cta_btn_link', '/contact'),
        weddings_cta_footnote: getValue('weddings', 'weddings_cta_footnote', 'Booking open for 2026/2027 Himalayan Seasons'),
      });
      try {
        const val = JSON.parse(getValue('weddings', 'weddings_polaroids', '[]'));
        setWeddingPolaroids(Array.isArray(val) && val.length > 0 ? val : DEFAULT_WEDDINGS_POLAROIDS);
      } catch {
        setWeddingPolaroids(DEFAULT_WEDDINGS_POLAROIDS);
      }
      try {
        const val = JSON.parse(getValue('weddings', 'venue_cards', '[]'));
        setVenues(Array.isArray(val) && val.length > 0 ? val : DEFAULT_WEDDINGS_VENUES);
      } catch {
        setVenues(DEFAULT_WEDDINGS_VENUES);
      }
      try {
        const val = JSON.parse(getValue('weddings', 'wedding_offerings', '[]'));
        setWeddingOfferings(Array.isArray(val) && val.length > 0 ? val : DEFAULT_WEDDINGS_OFFERINGS);
      } catch {
        setWeddingOfferings(DEFAULT_WEDDINGS_OFFERINGS);
      }
    } else if (activePageId === 'experiences') {
      setFormFields({
        experiences_heading: getValue('experiences', 'experiences_heading', 'Curated Journeys'),
        experiences_subheading: getValue('experiences', 'experiences_subheading', 'Acclimatize in the Sacred Atmosphere'),
        experiences_image: getValue('experiences', 'experiences_image', ''),
        experiences_slide_badge: getValue('experiences', 'experiences_slide_badge', 'Activities & Comforts'),
        experiences_bento_tagline: getValue('experiences', 'experiences_bento_tagline', 'VISUAL ARCHIVE'),
        experiences_bento_heading: getValue('experiences', 'experiences_bento_heading', 'Experience'),
        experiences_bento_heading_italic: getValue('experiences', 'experiences_bento_heading_italic', 'Gallery'),
        experiences_scenes_tagline: getValue('experiences', 'experiences_scenes_tagline', 'RETREAT ARCHIVE'),
        experiences_scenes_heading: getValue('experiences', 'experiences_scenes_heading', 'Retreat'),
        experiences_scenes_heading_italic: getValue('experiences', 'experiences_scenes_heading_italic', 'Scenes'),
        experiences_scenes_desc: getValue('experiences', 'experiences_scenes_desc', 'Real photographic glances of our pinewood interiors, high-altitude yoga shala, Sattvik mountain dining, and misty cedar surroundings. Click any image to expand.'),
        experiences_cta_badge: getValue('experiences', 'experiences_cta_badge', 'Plan Your Trip'),
        experiences_cta_heading: getValue('experiences', 'experiences_cta_heading', 'Book Your'),
        experiences_cta_heading_italic: getValue('experiences', 'experiences_cta_heading_italic', 'Vedic Stay'),
        experiences_cta_desc: getValue('experiences', 'experiences_cta_desc', 'Our retreat in Guptkashi features limited rooms to maintain a quiet atmosphere. Reserve your stay for the upcoming season.'),
        experiences_cta_btn_text: getValue('experiences', 'experiences_cta_btn_text', 'Confirm Your Reservation'),
        experiences_cta_btn_link: getValue('experiences', 'experiences_cta_btn_link', '/rooms'),
      });
      try {
        const val = JSON.parse(getValue('experiences', 'experience_slides', '[]'));
        setExperienceSlides(Array.isArray(val) && val.length > 0 ? val : DEFAULT_EXPERIENCES_SLIDES);
      } catch {
        setExperienceSlides(DEFAULT_EXPERIENCES_SLIDES);
      }
      try {
        const val = JSON.parse(getValue('experiences', 'experience_gallery', '[]'));
        setExperiencePhotos(Array.isArray(val) && val.length > 0 ? val : DEFAULT_EXPERIENCES_GALLERY);
      } catch {
        setExperiencePhotos(DEFAULT_EXPERIENCES_GALLERY);
      }
    } else if (activePageId === 'nearby') {
      setFormFields({
        nearby_heading: getValue('nearby', 'nearby_heading', 'Himalayan Travel Guide'),
        nearby_subheading: getValue('nearby', 'nearby_subheading', 'Coordinates of Rudraprayag'),
        nearby_image: getValue('nearby', 'nearby_image', ''),
        nearby_slide_badge: getValue('nearby', 'nearby_slide_badge', 'Nearby Sacred Destinations'),
        nearby_treks_tagline: getValue('nearby', 'nearby_treks_tagline', 'SACRED TRAILS'),
        nearby_treks_heading: getValue('nearby', 'nearby_treks_heading', 'Trekking'),
        nearby_treks_heading_italic: getValue('nearby', 'nearby_treks_heading_italic', 'Directory'),
        nearby_treks_desc: getValue('nearby', 'nearby_treks_desc', 'Expert-curated treks ranging from easy heritage walks to challenging high-altitude ascents through pristine Himalayan terrain.'),
        nearby_bento_tagline: getValue('nearby', 'nearby_bento_tagline', 'DESTINATION ARCHIVE'),
        nearby_bento_heading: getValue('nearby', 'nearby_bento_heading', 'Destination'),
        nearby_bento_heading_italic: getValue('nearby', 'nearby_bento_heading_italic', 'Gallery'),
        nearby_scenes_tagline: getValue('nearby', 'nearby_scenes_tagline', 'RUDRAPRAYAG GLANCES'),
        nearby_scenes_heading: getValue('nearby', 'nearby_scenes_heading', 'Rudraprayag'),
        nearby_scenes_heading_italic: getValue('nearby', 'nearby_scenes_heading_italic', 'Scenes'),
        nearby_scenes_desc: getValue('nearby', 'nearby_scenes_desc', 'Photographic captures of the sacred Mandakini valley surroundings, ancient temples, and alpine landscapes.'),
        nearby_cta_badge: getValue('nearby', 'nearby_cta_badge', 'Your Sacred Sanctuary awaits'),
        nearby_cta_heading: getValue('nearby', 'nearby_cta_heading', 'Plan Your'),
        nearby_cta_heading_italic: getValue('nearby', 'nearby_cta_heading_italic', 'Sacred Journey'),
        nearby_cta_desc: getValue('nearby', 'nearby_cta_desc', 'Let us coordinate your temple circuits, trail guides, and vehicle transfers from our base in Guptkashi.'),
        nearby_cta_btn_text: getValue('nearby', 'nearby_cta_btn_text', 'Contact For Coordination'),
        nearby_cta_btn_link: getValue('nearby', 'nearby_cta_btn_link', '/contact'),
      });
      try {
        const val = JSON.parse(getValue('nearby', 'nearby_slides', '[]'));
        setNearbySlides(Array.isArray(val) && val.length > 0 ? val : DEFAULT_NEARBY_SLIDES);
      } catch {
        setNearbySlides(DEFAULT_NEARBY_SLIDES);
      }
      try {
        const val = JSON.parse(getValue('nearby', 'treks_directory', '[]'));
        setTreksDirectory(Array.isArray(val) && val.length > 0 ? val : DEFAULT_NEARBY_TREKS);
      } catch {
        setTreksDirectory(DEFAULT_NEARBY_TREKS);
      }
      try {
        const val = JSON.parse(getValue('nearby', 'nearby_gallery', '[]'));
        setNearbyPhotos(Array.isArray(val) && val.length > 0 ? val : DEFAULT_NEARBY_GALLERY);
      } catch {
        setNearbyPhotos(DEFAULT_NEARBY_GALLERY);
      }
    } else if (activePageId === 'gallery') {
      setFormFields({
        gallery_heading: getValue('gallery', 'gallery_heading', 'Captured Stillness'),
        gallery_subheading: getValue('gallery', 'gallery_subheading', 'Bespoke Deodar-framed spaces'),
        gallery_image: getValue('gallery', 'gallery_image', ''),
        gallery_hero_badge: getValue('gallery', 'gallery_hero_badge', 'OUR VISUAL STORY'),
        gallery_hero_desc: getValue('gallery', 'gallery_hero_desc', ''),
        gallery_categories: getValue('gallery', 'gallery_categories', 'Peaks & Vibe, Sanctuary Suites, Spiritual Life'),
      });
      try {
        const val = JSON.parse(getValue('gallery', 'gallery_images', '[]'));
        setGalleryImages(Array.isArray(val) && val.length > 0 ? val : DEFAULT_GALLERY_IMAGES);
      } catch {
        setGalleryImages(DEFAULT_GALLERY_IMAGES);
      }
    } else if (activePageId === 'contact') {
      setFormFields({
        contact_heading: getValue('contact', 'contact_heading', 'Reach Out'),
        contact_subheading: getValue('contact', 'contact_subheading', 'Reservations & coordinates'),
        contact_image: getValue('contact', 'contact_image', ''),
        contact_email: getValue('contact', 'contact_email', 'stay@vedichimalayaretreat.com'),
        contact_map_pin: getValue('contact', 'contact_map_pin', 'SEMI VILLAGE, Kedarnath Rd, Kund, Guptkashi, Uttarakhand 246495'),
        contact_badge: getValue('contact', 'contact_badge', 'REACH OUT TO US'),
        contact_italic_text: getValue('contact', 'contact_italic_text', 'Sacred Arrival'),
        contact_instagram: getValue('contact', 'contact_instagram', '@thevedichimalayaretreat'),
        contact_instagram_url: getValue('contact', 'contact_instagram_url', 'https://instagram.com/thevedichimalayaretreat'),
        contact_form_title: getValue('contact', 'contact_form_title', 'Send an Inquiry'),
      });
    } else if (activePageId === 'booking') {
      setFormFields({
        booking_heading: getValue('booking', 'booking_heading', 'Reserve Your'),
        booking_heading_italic: getValue('booking', 'booking_heading_italic', 'Stay'),
        booking_badge: getValue('booking', 'booking_badge', 'Guaranteed sanctuary booking'),
        booking_subheading: getValue('booking', 'booking_subheading', 'Elevate your Himalayan ascent with a direct direct-booking premium rate.'),
      });
    } else if (['privacy', 'terms'].includes(activePageId)) {
      setFormFields({
        title: getValue(activePageId, `${activePageId}_title`, activePageId === 'privacy' ? 'Privacy Policy' : 'Terms of Stay'),
        content: getValue(activePageId, `${activePageId}_content`, '')
      });
    }
  }, [activePageId, contentLoading, content]);

  // Bulk Upload State & Methods
  const [isBulkUploading, setIsBulkUploading] = useState<string | null>(null);

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetList: 'gallery' | 'experience' | 'nearby') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsBulkUploading(targetList);
    let successCount = 0;

    if (targetList === 'gallery') {
      const newImages = [...galleryImages];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        try {
          const result = await uploadImageDirect(file);
          if (result?.success && result.url) {
            newImages.push({
              src: result.url,
              category: 'Peaks & Vibe',
              title: file.name.split('.')[0] || 'New Photo',
              desc: 'Uploaded via bulk catalog',
              is_visible: true
            });
            successCount++;
          }
        } catch (err) {
          console.error("Bulk upload error:", err);
        }
      }
      setGalleryImages(newImages);
    } else if (targetList === 'experience') {
      const newPhotos = [...experiencePhotos];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        try {
          const result = await uploadImageDirect(file);
          if (result?.success && result.url) {
            newPhotos.push({
              url: result.url,
              caption: file.name.split('.')[0] || 'New Scene',
              is_visible: true
            });
            successCount++;
          }
        } catch (err) {
          console.error("Bulk upload error:", err);
        }
      }
      setExperiencePhotos(newPhotos);
    } else if (targetList === 'nearby') {
      const newPhotos = [...nearbyPhotos];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        try {
          const result = await uploadImageDirect(file);
          if (result?.success && result.url) {
            newPhotos.push({
              url: result.url,
              caption: file.name.split('.')[0] || 'New Scene',
              is_visible: true
            });
            successCount++;
          }
        } catch (err) {
          console.error("Bulk upload error:", err);
        }
      }
      setNearbyPhotos(newPhotos);
    }

    setIsBulkUploading(null);
    toast.success(`Successfully uploaded ${successCount} files to the collection!`);
  };

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
      updates.push({ section: 'home', key: 'why_choose_items', value: JSON.stringify(whyChooseItems) });
      updates.push({ section: 'home', key: 'bento_gallery_items', value: JSON.stringify(bentoGalleryItems) });
      updates.push({ section: 'home', key: 'social_proof_reviews', value: JSON.stringify(socialProofReviews) });
      // Synchronize with localstorage reviews v2.1 for frontend SocialProofSection
      try {
        const seeded = socialProofReviews.map((r, idx) => ({
          ...r,
          id: r.id || `REV-${1000 + idx}`,
          approved: r.approved !== false
        }));
        localStorage.setItem("adminReviews_v2_1", JSON.stringify(seeded));
      } catch (e) {
        console.error("Localstorage sync error: ", e);
      }
    } else if (activePageId === 'rooms') {
      updates.push({ section: 'rooms', key: 'rooms_amenities', value: JSON.stringify(roomsAmenities) });
      updates.push({ section: 'rooms', key: 'rooms_reviews', value: JSON.stringify(roomsReviews) });
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
                          <div className="grid grid-cols-2 gap-4">
                            <TextInputGroup label="Hero Button Text" icon={Type} value={formFields.hero_cta} onChange={(val) => setFormFields((prev: any) => ({ ...prev, hero_cta: val }))} />
                            <TextInputGroup label="Hero Button Link" icon={LinkIcon} value={formFields.hero_cta_link} onChange={(val) => setFormFields((prev: any) => ({ ...prev, hero_cta_link: val }))} />
                          </div>
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
                      onSave={handleSavePage}
                      isSaving={isSaving !== null}
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
                        onSave={handleSavePage}
                        isSaving={isSaving !== null}
                      />
                    )}
                    {/* Live Preview: Offerings Stack Cards */}
                    {visibilities.offerings_visible && (
                      <div className="mt-4 p-6 bg-[#0A0F0E] border border-[#1C2E2A] rounded-2xl space-y-4">
                        <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C4A665]" />
                          Live Preview: Stack Cards
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          {offerings.filter(o => o.is_visible !== false).map((off, idx) => {
                            return (
                              <div
                                key={idx}
                                className={`relative p-5 rounded-[1.6rem] border border-[#D8CBB8]/30 shadow-xl flex flex-col md:flex-row gap-5 min-h-[260px] transition-all hover:scale-[1.01] duration-300 ${
                                  off.bgClass || 'bg-[#0f2822]'
                                } ${off.textClass || 'text-[#FAF9F5]'}`}
                              >
                                {/* Left Details column */}
                                <div className="flex-1 flex flex-col justify-between text-left font-sans">
                                  <div>
                                    <div className="flex justify-between items-start">
                                      <span className="text-3xl font-serif font-extrabold opacity-20 block leading-none">
                                        {off.num || `0${idx + 1}`}
                                      </span>
                                      <span className="text-[8px] tracking-[0.2em] font-mono uppercase font-bold mt-1 opacity-65 bg-white/10 px-2 py-0.5 rounded block">
                                        {off.badge || 'OFFERING'}
                                      </span>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                      <h3 className="text-lg sm:text-xl font-serif font-normal tracking-wide leading-tight">
                                        {off.title || 'New Offering'}
                                      </h3>
                                      <p className="text-xs opacity-90 leading-relaxed font-sans font-light line-clamp-3">
                                        {off.description}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="border-t border-current/10 pt-3 mt-3 text-[9px] font-mono opacity-60">
                                    <span>{off.coords || 'N 30° 16\' // E 79° 04\''}</span>
                                  </div>
                                </div>

                                {/* Right Visual nesting layout (card inside a card) */}
                                {off.image && (
                                  <div className="flex-1 md:w-1/2 p-1.5 bg-white/10 rounded-[1.2rem] border border-white/10 overflow-hidden relative min-h-[140px] md:min-h-0">
                                    <div className="w-full h-full rounded-[0.9rem] overflow-hidden relative">
                                      <img src={off.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
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
                        onSave={handleSavePage}
                        isSaving={isSaving !== null}
                      />
                    )}

                    {/* Why Choose Us Section */}
                    <SectionToggle
                      label="Why Choose Us Section"
                      checked={visibilities.why_choose_visible}
                      onChange={(v) => setVisibilities((prev: any) => ({ ...prev, why_choose_visible: v }))}
                      description="Toggle why choose us section on Home page"
                    />
                    {visibilities.why_choose_visible && (
                      <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <TextInputGroup label="Section Tagline" icon={Type} value={formFields.why_choose_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, why_choose_tagline: v }))} />
                          <TextInputGroup label="Heading Line 1" icon={Type} value={formFields.why_choose_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, why_choose_heading: v }))} />
                          <TextInputGroup label="Heading Line 2 (Italic)" icon={Type} value={formFields.why_choose_heading_italic} onChange={(v) => setFormFields((prev: any) => ({ ...prev, why_choose_heading_italic: v }))} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TextAreaGroup label="Paragraph 1 Description" value={formFields.why_choose_desc1} onChange={(v) => setFormFields((prev: any) => ({ ...prev, why_choose_desc1: v }))} rows={3} />
                          <TextAreaGroup label="Paragraph 2 Description" value={formFields.why_choose_desc2} onChange={(v) => setFormFields((prev: any) => ({ ...prev, why_choose_desc2: v }))} rows={3} />
                        </div>
                        
                        <ListEditor
                          title="Difference Value Cards"
                          items={whyChooseItems}
                          onChange={setWhyChooseItems}
                          createDefaultItem={() => ({ num: '01', category: 'CATEGORY', title: 'Title', desc: 'Description...', icon: 'Compass', is_visible: true })}
                          getItemLabel={(item) => item.title}
                          renderItemEditor={(item, idx, updateField) => (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
                              <TextInputGroup label="Number" icon={Tag} value={item.num} onChange={(v) => updateField('num', v)} />
                              <TextInputGroup label="Category Label" icon={Tag} value={item.category} onChange={(v) => updateField('category', v)} />
                              <TextInputGroup label="Card Title" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                              <TextInputGroup label="Description" icon={Type} value={item.desc} onChange={(v) => updateField('desc', v)} />
                              <div className="text-left w-full col-span-2">
                                <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Icon</label>
                                <select value={item.icon || 'Compass'} onChange={(e) => updateField('icon', e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665]">
                                  {AVAILABLE_ICONS.map(i => <option key={i} value={i} className="bg-[#0D1412]">{i}</option>)}
                                </select>
                              </div>
                            </div>
                          )}
                          onSave={handleSavePage}
                          isSaving={isSaving !== null}
                        />
                      </div>
                    )}

                    {/* Bento Masonry Gallery Section */}
                    <SectionToggle
                      label="Bento Masonry Gallery Section"
                      checked={visibilities.home_gallery_visible}
                      onChange={(v) => setVisibilities((prev: any) => ({ ...prev, home_gallery_visible: v }))}
                      description="Toggle bento visual grid gallery on Home page"
                    />
                    {visibilities.home_gallery_visible && (
                      <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <TextInputGroup label="Gallery Badge Tag" icon={Type} value={formFields.home_gallery_badge} onChange={(v) => setFormFields((prev: any) => ({ ...prev, home_gallery_badge: v }))} />
                          <TextInputGroup label="Gallery Heading" icon={Type} value={formFields.home_gallery_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, home_gallery_heading: v }))} />
                          <TextInputGroup label="Gallery Description" icon={Type} value={formFields.home_gallery_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, home_gallery_desc: v }))} />
                        </div>

                        <ListEditor
                          title="Bento Grid Images (Exactly 5 items)"
                          items={bentoGalleryItems}
                          onChange={setBentoGalleryItems}
                          createDefaultItem={() => ({ image: '', title: 'Visual Photo', is_visible: true })}
                          getItemLabel={(item) => item.title}
                          getItemImage={(item) => item.image}
                          renderItemEditor={(item, idx, updateField) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                              <TextInputGroup label="Photo Description/Caption" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                              <ImageUploader label="Visual Image" currentImage={item.image} onImageChange={(p) => updateField('image', p)} aspectRatio="aspect-video w-full" />
                            </div>
                          )}
                          onSave={handleSavePage}
                          isSaving={isSaving !== null}
                        />
                      </div>
                    )}

                    {/* Serene CTA Section */}
                    <SectionToggle
                      label="Serene Booking CTA Section"
                      checked={visibilities.home_cta_visible}
                      onChange={(v) => setVisibilities((prev: any) => ({ ...prev, home_cta_visible: v }))}
                      description="Toggle footer green serene CTA box on Home page"
                    />
                    {visibilities.home_cta_visible && (
                      <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <TextInputGroup label="CTA Upper Tagline" icon={Type} value={formFields.home_cta_badge} onChange={(v) => setFormFields((prev: any) => ({ ...prev, home_cta_badge: v }))} />
                          <TextInputGroup label="CTA Heading" icon={Type} value={formFields.home_cta_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, home_cta_heading: v }))} />
                          <TextInputGroup label="CTA Italic Heading" icon={Type} value={formFields.home_cta_heading_italic} onChange={(v) => setFormFields((prev: any) => ({ ...prev, home_cta_heading_italic: v }))} />
                        </div>
                        <TextAreaGroup label="CTA Description text" value={formFields.home_cta_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, home_cta_desc: v }))} rows={2} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TextInputGroup label="CTA Button Text" icon={Edit3} value={formFields.home_cta_btn_text} onChange={(v) => setFormFields((prev: any) => ({ ...prev, home_cta_btn_text: v }))} />
                          <TextInputGroup label="CTA Button Link" icon={LinkIcon} value={formFields.home_cta_btn_link} onChange={(v) => setFormFields((prev: any) => ({ ...prev, home_cta_btn_link: v }))} />
                        </div>
                      </div>
                    )}

                    {/* Social Proof Testimonials Section */}
                    <SectionToggle
                      label="Social Proof Reviews Slider Section"
                      checked={visibilities.social_proof_visible}
                      onChange={(v) => setVisibilities((prev: any) => ({ ...prev, social_proof_visible: v }))}
                      description="Toggle traveler verified reviews slide uploader"
                    />
                    {visibilities.social_proof_visible && (
                      <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TextInputGroup label="Slider Tagline badge" icon={Type} value={formFields.social_proof_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, social_proof_tagline: v }))} />
                          <TextInputGroup label="Slider Heading summary" icon={Type} value={formFields.social_proof_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, social_proof_heading: v }))} />
                        </div>

                        <ListEditor
                          title="Verified Guest Testimonials Catalogue"
                          items={socialProofReviews}
                          onChange={setSocialProofReviews}
                          createDefaultItem={() => ({ name: 'New Pilgrim', date: 'May 2026', rating: 5, state: 'State', text: 'Stunning pine sanctuary...', approved: true })}
                          getItemLabel={(item) => `${item.name} (${item.state})`}
                          renderItemEditor={(item, idx, updateField) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                              <div className="space-y-4">
                                <TextInputGroup label="Pilgrim Guest Name" icon={Type} value={item.name} onChange={(v) => updateField('name', v)} />
                                <TextInputGroup label="Date of Stay" icon={Clock} value={item.date} onChange={(v) => updateField('date', v)} />
                                <TextInputGroup label="Guest Origin State" icon={MapPin} value={item.state} onChange={(v) => updateField('state', v)} />
                                <TextInputGroup label="Rating index (1 to 5)" icon={Tag} value={String(item.rating)} onChange={(v) => updateField('rating', parseInt(v) || 5)} />
                                <div className="text-left w-full">
                                  <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Approval Status</label>
                                  <select value={item.approved !== false ? 'true' : 'false'} onChange={(e) => updateField('approved', e.target.value === 'true')} className="w-full px-3 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665]">
                                    <option value="true" className="bg-[#0D1412]">Approved & Visible</option>
                                    <option value="false" className="bg-[#0D1412]">Hidden / Private</option>
                                  </select>
                                </div>
                              </div>
                              <TextAreaGroup label="Detailed Review Text" value={item.text} onChange={(v) => updateField('text', v)} rows={6} />
                            </div>
                          )}
                          onSave={handleSavePage}
                          isSaving={isSaving !== null}
                        />
                      </div>
                    )}

                    <SectionSaveButton onSave={handleSavePage} isSaving={isSaving !== null} label="Save Home Page Changes" />
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
                            <TextInputGroup label="Pillar ID" icon={Tag} value={item.id} onChange={(v) => updateField('id', v)} />
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
                        onSave={handleSavePage}
                        isSaving={isSaving !== null}
                      />
                    )}

                    <SectionSaveButton onSave={handleSavePage} isSaving={isSaving !== null} label="Save About Us Changes" />
                  </div>
                )}

                {/* ----------------- ROOMS INTRO ----------------- */}
                {activePageId === 'rooms' && (
                  <div className="space-y-6">
                    <SectionToggle label="Rooms Hero Section" checked={visibilities.rooms_hero_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, rooms_hero_visible: v }))} />
                    {visibilities.rooms_hero_visible && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white/5 rounded-xl border border-[#1C2E2A]">
                        <div className="md:col-span-2 space-y-4">
                          <TextInputGroup label="Heading" icon={Type} value={formFields.rooms_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, rooms_heading: v }))} />
                          <TextInputGroup label="Subheading" icon={Type} value={formFields.rooms_subheading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, rooms_subheading: v }))} />
                        </div>
                        <ImageUploader label="Cover Image" currentImage={formFields.rooms_image} onImageChange={(p) => setFormFields((prev: any) => ({ ...prev, rooms_image: p }))} aspectRatio="aspect-video w-full" />
                      </div>
                    )}

                    <SectionToggle label="Advisory Notice Box" checked={visibilities.notice_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, notice_visible: v }))} />
                    {visibilities.notice_visible && (
                      <TextAreaGroup label="Advisory Warning Details" value={formFields.rooms_notice} onChange={(v) => setFormFields((prev: any) => ({ ...prev, rooms_notice: v }))} rows={4} />
                    )}

                    <ListEditor
                      title="Room Amenities (Global fallback)"
                      items={roomsAmenities}
                      onChange={setRoomsAmenities}
                      createDefaultItem={() => ({ label: 'New Amenity', icon: 'Wifi', desc: '', is_visible: true })}
                      getItemLabel={(item) => item.label}
                      renderItemEditor={(item, idx, updateField) => (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                          <TextInputGroup label="Amenity Label" icon={Type} value={item.label} onChange={(v) => updateField('label', v)} />
                          <TextInputGroup label="Description Detail" icon={Type} value={item.desc} onChange={(v) => updateField('desc', v)} />
                          <div className="text-left w-full">
                            <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Icon</label>
                            <select value={item.icon || 'Wifi'} onChange={(e) => updateField('icon', e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665]">
                              {AVAILABLE_ICONS.map(i => <option key={i} value={i} className="bg-[#0D1412]">{i}</option>)}
                            </select>
                          </div>
                        </div>
                      )}
                      onSave={handleSavePage}
                      isSaving={isSaving !== null}
                    />

                    <ListEditor
                      title="Room Guest Reviews (Global fallback)"
                      items={roomsReviews}
                      onChange={setRoomsReviews}
                      createDefaultItem={() => ({ name: 'New Guest', rating: 5, location: '', date: '', text: '', source: 'google', is_visible: true })}
                      getItemLabel={(item) => item.name}
                      renderItemEditor={(item, idx, updateField) => (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                          <div className="space-y-4">
                            <TextInputGroup label="Guest Name" icon={Type} value={item.name} onChange={(v) => updateField('name', v)} />
                            <TextInputGroup label="Rating (1-5)" icon={Tag} value={String(item.rating)} onChange={(v) => updateField('rating', parseInt(v) || 5)} />
                            <TextInputGroup label="Location / City" icon={MapPin} value={item.location} onChange={(v) => updateField('location', v)} />
                            <TextInputGroup label="Review Date" icon={Clock} value={item.date} onChange={(v) => updateField('date', v)} />
                            <div className="text-left w-full">
                              <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Review Source</label>
                              <select value={item.source || 'google'} onChange={(e) => updateField('source', e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665]">
                                <option value="google" className="bg-[#0D1412]">Google</option>
                                <option value="tripadvisor" className="bg-[#0D1412]">TripAdvisor</option>
                              </select>
                            </div>
                          </div>
                          <TextAreaGroup label="Review Text" value={item.text} onChange={(v) => updateField('text', v)} rows={4} />
                        </div>
                      )}
                      onSave={handleSavePage}
                      isSaving={isSaving !== null}
                    />

                    <SectionSaveButton onSave={handleSavePage} isSaving={isSaving !== null} label="Save Rooms Changes" />
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
                          onSave={handleSavePage}
                          isSaving={isSaving !== null}
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
                          onSave={handleSavePage}
                          isSaving={isSaving !== null}
                        />

                        {/* Live Preview: Dining Polaroid stack */}
                        {visibilities.dining_polaroids_visible && (
                          <div className="mt-4 p-6 bg-[#0A0F0E] border border-[#1C2E2A] rounded-2xl space-y-4">
                            <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C4A665]" />
                              Live Preview: Dining Polaroid Cards
                            </div>
                            <div className="flex flex-wrap gap-6 pt-2">
                              {diningPolaroids.filter(p => p.is_visible !== false).map((p, idx) => {
                                return (
                                  <div
                                    key={idx}
                                    className="w-full sm:w-[220px] bg-[#FAF9F5] p-3.5 pb-6 border border-stone-sand/30 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.15)] rounded-md rotate-[-1deg] hover:rotate-0 transition-transform duration-300 flex flex-col justify-between"
                                  >
                                    {p.image ? (
                                      <img src={p.image} alt="" className="w-full aspect-[4/3.5] object-cover rounded border border-stone-sand/20 mb-3" />
                                    ) : (
                                      <div className="w-full aspect-[4/3.5] bg-[#0A0F0E] rounded border border-[#1C2E2A] mb-3 flex items-center justify-center text-[#C4A665] text-[10px] uppercase font-mono">No Image</div>
                                    )}
                                    <div className="text-left font-serif text-slate-charcoal">
                                      <span className="text-[9px] uppercase tracking-[0.2em] font-mono font-extrabold text-[#1B4C44] block mb-1">{p.desc || 'GASTRONOMY'}</span>
                                      <h4 className="text-sm font-medium leading-tight font-serif text-[#2E3438]">{p.title || 'Untitled Card'}</h4>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
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
                          onSave={handleSavePage}
                          isSaving={isSaving !== null}
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
                          onSave={handleSavePage}
                          isSaving={isSaving !== null}
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
                          onSave={handleSavePage}
                          isSaving={isSaving !== null}
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

                    <SectionSaveButton onSave={handleSavePage} isSaving={isSaving !== null} label="Save Dining Changes" />
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
                          <TextInputGroup label="Hero Badge Text" icon={Tag} value={formFields.weddings_hero_badge} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_hero_badge: v }))} />
                          <TextAreaGroup label="Hero Description Paragraph" value={formFields.weddings_hero_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_hero_desc: v }))} rows={2} />
                        </div>
                        <ImageUploader label="Cover Image" currentImage={formFields.weddings_image} onImageChange={(p) => setFormFields((prev: any) => ({ ...prev, weddings_image: p }))} aspectRatio="aspect-video w-full" />
                      </div>
                    )}

                    <SectionToggle label="Weddings Story Section" checked={visibilities.weddings_story_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, weddings_story_visible: v }))} description="Narrative intro section below hero" />
                    {visibilities.weddings_story_visible && (
                      <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                        <TextInputGroup label="Script Text (Cursive)" icon={Type} value={formFields.weddings_story_script} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_story_script: v }))} />
                        <div className="grid grid-cols-3 gap-4">
                          <TextInputGroup label="Heading Part 1" icon={Type} value={formFields.weddings_story_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_story_heading: v }))} />
                          <TextInputGroup label="Heading Italic" icon={Type} value={formFields.weddings_story_heading_italic} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_story_heading_italic: v }))} />
                          <TextInputGroup label="Heading Part 2" icon={Type} value={formFields.weddings_story_subheading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_story_subheading: v }))} />
                        </div>
                        <TextAreaGroup label="Story Paragraph" value={formFields.weddings_story_paragraph} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_story_paragraph: v }))} rows={3} />
                      </div>
                    )}

                    <SectionToggle label="Weddings Polaroids Section" checked={visibilities.weddings_polaroids_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, weddings_polaroids_visible: v }))} />
                    {visibilities.weddings_polaroids_visible && (
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                          <TextInputGroup label="Polaroid Story Title" icon={Type} value={formFields.weddings_story_title} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_story_title: v }))} />
                          <TextInputGroup label="Polaroid Story Subtitle" icon={Type} value={formFields.weddings_story_subtitle} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_story_subtitle: v }))} />
                          <TextAreaGroup label="Polaroid Story Description" value={formFields.weddings_story_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_story_desc: v }))} />
                        </div>
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
                        onSave={handleSavePage}
                        isSaving={isSaving !== null}
                      />
                      </div>
                    )}

                    <SectionToggle label="Wedding Venues Section" checked={visibilities.weddings_venues_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, weddings_venues_visible: v }))} />
                    {visibilities.weddings_venues_visible && (
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                          <TextInputGroup label="Venues Tagline" icon={Type} value={formFields.weddings_venues_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_venues_tagline: v }))} />
                          <div className="grid grid-cols-2 gap-4">
                            <TextInputGroup label="Venues Heading" icon={Type} value={formFields.weddings_venues_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_venues_heading: v }))} />
                            <TextInputGroup label="Venues Heading (Italic)" icon={Type} value={formFields.weddings_venues_heading_italic} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_venues_heading_italic: v }))} />
                          </div>
                          <TextAreaGroup label="Venues Description" value={formFields.weddings_venues_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_venues_desc: v }))} rows={2} />
                        </div>
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
                          onSave={handleSavePage}
                          isSaving={isSaving !== null}
                        />
                      </div>
                    )}

                    <SectionToggle label="Wedding Offerings/Specs Section" checked={visibilities.weddings_offerings_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, weddings_offerings_visible: v }))} />
                    {visibilities.weddings_offerings_visible && (
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                          <TextInputGroup label="Offerings Tagline" icon={Type} value={formFields.weddings_offerings_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_offerings_tagline: v }))} />
                          <div className="grid grid-cols-2 gap-4">
                            <TextInputGroup label="Offerings Heading" icon={Type} value={formFields.weddings_offerings_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_offerings_heading: v }))} />
                            <TextInputGroup label="Offerings Heading (Italic)" icon={Type} value={formFields.weddings_offerings_heading_italic} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_offerings_heading_italic: v }))} />
                          </div>
                          <TextInputGroup label="Offerings Sub-description" icon={Type} value={formFields.weddings_offerings_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_offerings_desc: v }))} />
                        </div>
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
                          onSave={handleSavePage}
                          isSaving={isSaving !== null}
                        />

                        {/* Live Preview: Wedding Offering Stack Cards */}
                        {visibilities.weddings_offerings_visible && (
                          <div className="mt-4 p-6 bg-[#0A0F0E] border border-[#1C2E2A] rounded-2xl space-y-4">
                            <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C4A665]" />
                              Live Preview: Weddings Stack Cards
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                              {weddingOfferings.filter(o => o.is_visible !== false).map((off, idx) => {
                                return (
                                  <div
                                    key={idx}
                                    className={`relative p-5 rounded-[1.6rem] border border-[#D8CBB8]/30 shadow-xl flex flex-col md:flex-row gap-5 min-h-[260px] transition-all hover:scale-[1.01] duration-300 ${
                                      off.bgClass || 'bg-[#0f2822]'
                                    } ${off.textClass || 'text-[#FAF9F5]'}`}
                                  >
                                    {/* Left Details column */}
                                    <div className="flex-1 flex flex-col justify-between text-left font-sans">
                                      <div>
                                        <div className="flex justify-between items-start">
                                          <span className="text-3xl font-serif font-extrabold opacity-20 block leading-none">
                                            {off.num || `0${idx + 1}`}
                                          </span>
                                          <span className="text-[8px] tracking-[0.2em] font-mono uppercase font-bold mt-1 opacity-65 bg-white/10 px-2 py-0.5 rounded block">
                                            {off.badge || 'SPECIFICATION'}
                                          </span>
                                        </div>
                                        <div className="mt-4 space-y-2">
                                          <h3 className="text-lg sm:text-xl font-serif font-normal tracking-wide leading-tight">
                                            {off.title || 'New Spec'}
                                          </h3>
                                          <p className="text-xs opacity-90 leading-relaxed font-sans font-light line-clamp-3">
                                            {off.description}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="border-t border-current/10 pt-3 mt-3 text-[9px] font-mono opacity-60">
                                        <span>{off.coords || 'Triyuginarayan Style'}</span>
                                      </div>
                                    </div>

                                    {/* Right Visual nesting layout (card inside a card) */}
                                    {off.image && (
                                      <div className="flex-1 md:w-1/2 p-1.5 bg-white/10 rounded-[1.2rem] border border-white/10 overflow-hidden relative min-h-[140px] md:min-h-0">
                                        <div className="w-full h-full rounded-[0.9rem] overflow-hidden relative">
                                          <img src={off.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                      <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">Gallery Section Headings</div>
                      <TextInputGroup label="Gallery Tagline" icon={Type} value={formFields.weddings_gallery_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_gallery_tagline: v }))} />
                      <div className="grid grid-cols-2 gap-4">
                        <TextInputGroup label="Gallery Heading" icon={Type} value={formFields.weddings_gallery_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_gallery_heading: v }))} />
                        <TextInputGroup label="Gallery Heading (Italic)" icon={Type} value={formFields.weddings_gallery_heading_italic} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_gallery_heading_italic: v }))} />
                      </div>
                      <TextAreaGroup label="Gallery Description" value={formFields.weddings_gallery_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_gallery_desc: v }))} rows={2} />
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                      <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">Bottom CTA Section</div>
                      <div className="grid grid-cols-2 gap-4">
                        <TextInputGroup label="CTA Button Text" icon={Type} value={formFields.weddings_cta_btn_text} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_cta_btn_text: v }))} />
                        <TextInputGroup label="CTA Button Link" icon={LinkIcon} value={formFields.weddings_cta_btn_link} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_cta_btn_link: v }))} />
                      </div>
                      <TextInputGroup label="Footnote Text" icon={Type} value={formFields.weddings_cta_footnote} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_cta_footnote: v }))} />
                    </div>

                    <SectionSaveButton onSave={handleSavePage} isSaving={isSaving !== null} label="Save Weddings Changes" />
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
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A]">
                          <TextInputGroup label="Activities Slide Badge Label" icon={Type} value={formFields.experiences_slide_badge} onChange={(v) => setFormFields((prev: any) => ({ ...prev, experiences_slide_badge: v }))} />
                        </div>
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
                          onSave={handleSavePage}
                          isSaving={isSaving !== null}
                        />

                        {/* Live Preview: Experience Tour Slides */}
                        {visibilities.experiences_tour_visible && (
                          <div className="mt-4 p-6 bg-[#0A0F0E] border border-[#1C2E2A] rounded-2xl space-y-4">
                            <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C4A665]" />
                              Live Preview: Experience Tour Slides
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                              {experienceSlides.filter(s => s.is_visible !== false).map((slide, idx) => {
                                return (
                                  <div
                                    key={idx}
                                    className="relative rounded-2xl overflow-hidden border border-[#1C2E2A]/20 shadow-xl min-h-[360px] flex flex-col justify-end p-6 bg-[#060B0A]"
                                  >
                                    {slide.image && (
                                      <div className="absolute inset-0 z-0">
                                        <img src={slide.image} alt="" className="w-full h-full object-cover opacity-40" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                      </div>
                                    )}
                                    <div className="relative z-10 space-y-3 text-left">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-bold text-[#C4A665] uppercase tracking-widest bg-[#C4A665]/10 border border-[#C4A665]/20 px-2 py-0.5 rounded-md">
                                          {slide.category || 'WELLNESS'}
                                        </span>
                                        {slide.icon && (
                                          <span className="text-[9px] text-[#FAF9F5]/60 font-mono tracking-widest uppercase">
                                            // {slide.icon}
                                          </span>
                                        )}
                                      </div>
                                      <div>
                                        <span className="text-[10px] font-mono text-[#C4A665] tracking-widest block uppercase mb-1">{slide.subtitle}</span>
                                        <h3 className="text-2xl font-serif font-light text-[#FAF9F5] leading-tight">{slide.title || 'New Activity'}</h3>
                                      </div>
                                      <p className="text-xs text-[#FAF9F5]/70 font-sans leading-relaxed line-clamp-4">{slide.description}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                      <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">Bento Gallery Headings</div>
                      <TextInputGroup label="Bento Tagline" icon={Type} value={formFields.experiences_bento_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, experiences_bento_tagline: v }))} />
                      <div className="grid grid-cols-2 gap-4">
                        <TextInputGroup label="Bento Heading 1" icon={Type} value={formFields.experiences_bento_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, experiences_bento_heading: v }))} />
                        <TextInputGroup label="Bento Heading 2 (Italic)" icon={Type} value={formFields.experiences_bento_heading_italic} onChange={(v) => setFormFields((prev: any) => ({ ...prev, experiences_bento_heading_italic: v }))} />
                      </div>
                    </div>

                    <SectionToggle label="Scenes/Gallery Section" checked={visibilities.experiences_gallery_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, experiences_gallery_visible: v }))} />
                    {visibilities.experiences_gallery_visible && (
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                          <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">Retreat Scenes Headings</div>
                          <TextInputGroup label="Scenes Tagline" icon={Type} value={formFields.experiences_scenes_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, experiences_scenes_tagline: v }))} />
                          <div className="grid grid-cols-2 gap-4">
                            <TextInputGroup label="Scenes Heading" icon={Type} value={formFields.experiences_scenes_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, experiences_scenes_heading: v }))} />
                            <TextInputGroup label="Scenes Heading (Italic)" icon={Type} value={formFields.experiences_scenes_heading_italic} onChange={(v) => setFormFields((prev: any) => ({ ...prev, experiences_scenes_heading_italic: v }))} />
                          </div>
                          <TextAreaGroup label="Scenes Description" value={formFields.experiences_scenes_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, experiences_scenes_desc: v }))} rows={2} />
                        </div>

                        <div className="bg-[#0D1412] border border-[#1C2E2A] rounded-xl p-4 flex items-center justify-between text-left">
                          <div>
                            <span className="text-xs font-bold text-[#C4A665] uppercase tracking-wider block">Bulk Upload Experience Scenes</span>
                            <span className="text-[10px] text-[#8E9F96] mt-0.5 block">Select multiple images to upload and auto-insert into the scenes list below.</span>
                          </div>
                          <label className={`flex items-center gap-1.5 px-3 py-2 bg-[#1B4C44] hover:bg-[#256055] text-white text-xs font-bold rounded-lg border border-[#1B4C44] transition-colors cursor-pointer shrink-0 ${isBulkUploading === 'experience' ? 'opacity-50 cursor-wait' : ''}`}>
                            {isBulkUploading === 'experience' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                            {isBulkUploading === 'experience' ? 'UPLOADING...' : 'BULK UPLOAD'}
                            <input type="file" multiple accept="image/*" disabled={isBulkUploading === 'experience'} onChange={(e) => handleBulkUpload(e, 'experience')} className="hidden" />
                          </label>
                        </div>

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
                          onSave={handleSavePage}
                          isSaving={isSaving !== null}
                        />
                      </div>
                    )}

                    <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                      <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">Bottom CTA Section</div>
                      <TextInputGroup label="CTA Badge" icon={Tag} value={formFields.experiences_cta_badge} onChange={(v) => setFormFields((prev: any) => ({ ...prev, experiences_cta_badge: v }))} />
                      <div className="grid grid-cols-2 gap-4">
                        <TextInputGroup label="CTA Heading" icon={Type} value={formFields.experiences_cta_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, experiences_cta_heading: v }))} />
                        <TextInputGroup label="CTA Heading (Italic)" icon={Type} value={formFields.experiences_cta_heading_italic} onChange={(v) => setFormFields((prev: any) => ({ ...prev, experiences_cta_heading_italic: v }))} />
                      </div>
                      <TextAreaGroup label="CTA Description" value={formFields.experiences_cta_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, experiences_cta_desc: v }))} rows={2} />
                      <div className="grid grid-cols-2 gap-4">
                        <TextInputGroup label="Button Text" icon={Type} value={formFields.experiences_cta_btn_text} onChange={(v) => setFormFields((prev: any) => ({ ...prev, experiences_cta_btn_text: v }))} />
                        <TextInputGroup label="Button Link" icon={LinkIcon} value={formFields.experiences_cta_btn_link} onChange={(v) => setFormFields((prev: any) => ({ ...prev, experiences_cta_btn_link: v }))} />
                      </div>
                    </div>

                    <SectionSaveButton onSave={handleSavePage} isSaving={isSaving !== null} label="Save Experiences Changes" />
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
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A]">
                          <TextInputGroup label="Destinations Slide Badge Label" icon={Type} value={formFields.nearby_slide_badge} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_slide_badge: v }))} />
                        </div>
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
                          onSave={handleSavePage}
                          isSaving={isSaving !== null}
                        />

                        {/* Live Preview: Nearby destinations slides */}
                        {visibilities.nearby_tour_visible && (
                          <div className="mt-4 p-6 bg-[#0A0F0E] border border-[#1C2E2A] rounded-2xl space-y-4">
                            <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C4A665]" />
                              Live Preview: Destination Slides
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                              {nearbySlides.filter(s => s.is_visible !== false).map((slide, idx) => {
                                return (
                                  <div
                                    key={idx}
                                    className="relative rounded-2xl overflow-hidden border border-[#1C2E2A]/20 shadow-xl min-h-[360px] flex flex-col justify-end p-6 bg-[#060B0A]"
                                  >
                                    {slide.image && (
                                      <div className="absolute inset-0 z-0">
                                        <img src={slide.image} alt="" className="w-full h-full object-cover opacity-40" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                      </div>
                                    )}
                                    <div className="relative z-10 space-y-3 text-left">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-bold text-[#C4A665] uppercase tracking-widest bg-[#C4A665]/10 border border-[#C4A665]/20 px-2 py-0.5 rounded-md">
                                          {slide.category || 'TREK'}
                                        </span>
                                        {slide.icon && (
                                          <span className="text-[9px] text-[#FAF9F5]/60 font-mono tracking-widest uppercase">
                                            // {slide.icon}
                                          </span>
                                        )}
                                      </div>
                                      <div>
                                        <span className="text-[10px] font-mono text-[#C4A665] tracking-widest block uppercase mb-1">{slide.subtitle}</span>
                                        <h3 className="text-2xl font-serif font-light text-[#FAF9F5] leading-tight">{slide.title || 'New Destination'}</h3>
                                      </div>
                                      <p className="text-xs text-[#FAF9F5]/70 font-sans leading-relaxed line-clamp-3 mb-2">{slide.description}</p>
                                      <div className="grid grid-cols-3 gap-2 border-t border-[#1C2E2A] pt-3 text-[9px] font-mono uppercase text-[#C4A665]/80">
                                        <div>
                                          <span className="text-[8px] text-[#FAF9F5]/40 block font-sans">ALTITUDE</span>
                                          {slide.altitude || 'N/A'}
                                        </div>
                                        <div>
                                          <span className="text-[8px] text-[#FAF9F5]/40 block font-sans">DISTANCE</span>
                                          {slide.distance || 'N/A'}
                                        </div>
                                        <div>
                                          <span className="text-[8px] text-[#FAF9F5]/40 block font-sans">DURATION</span>
                                          {slide.duration || 'N/A'}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                      <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">Bento Gallery Headings</div>
                      <TextInputGroup label="Bento Tagline" icon={Type} value={formFields.nearby_bento_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_bento_tagline: v }))} />
                      <div className="grid grid-cols-2 gap-4">
                        <TextInputGroup label="Bento Heading 1" icon={Type} value={formFields.nearby_bento_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_bento_heading: v }))} />
                        <TextInputGroup label="Bento Heading 2 (Italic)" icon={Type} value={formFields.nearby_bento_heading_italic} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_bento_heading_italic: v }))} />
                      </div>
                    </div>

                    <SectionToggle label="Treks Directory Section" checked={visibilities.nearby_treks_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, nearby_treks_visible: v }))} />
                    {visibilities.nearby_treks_visible && (
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                          <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">Treks Directory Headings</div>
                          <TextInputGroup label="Treks Tagline" icon={Type} value={formFields.nearby_treks_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_treks_tagline: v }))} />
                          <div className="grid grid-cols-2 gap-4">
                            <TextInputGroup label="Treks Heading" icon={Type} value={formFields.nearby_treks_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_treks_heading: v }))} />
                            <TextInputGroup label="Treks Heading (Italic)" icon={Type} value={formFields.nearby_treks_heading_italic} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_treks_heading_italic: v }))} />
                          </div>
                          <TextAreaGroup label="Treks Description" value={formFields.nearby_treks_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_treks_desc: v }))} rows={2} />
                        </div>
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
                          onSave={handleSavePage}
                          isSaving={isSaving !== null}
                        />
                      </div>
                    )}

                    <SectionToggle label="Nearby Gallery Section" checked={visibilities.nearby_gallery_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, nearby_gallery_visible: v }))} />
                    {visibilities.nearby_gallery_visible && (
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                          <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">Nearby Photo Scenes Headings</div>
                          <TextInputGroup label="Scenes Tagline" icon={Type} value={formFields.nearby_scenes_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_scenes_tagline: v }))} />
                          <div className="grid grid-cols-2 gap-4">
                            <TextInputGroup label="Scenes Heading" icon={Type} value={formFields.nearby_scenes_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_scenes_heading: v }))} />
                            <TextInputGroup label="Scenes Heading (Italic)" icon={Type} value={formFields.nearby_scenes_heading_italic} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_scenes_heading_italic: v }))} />
                          </div>
                          <TextAreaGroup label="Scenes Description" value={formFields.nearby_scenes_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_scenes_desc: v }))} rows={2} />
                        </div>

                        <div className="bg-[#0D1412] border border-[#1C2E2A] rounded-xl p-4 flex items-center justify-between text-left">
                          <div>
                            <span className="text-xs font-bold text-[#C4A665] uppercase tracking-wider block">Bulk Upload Nearby Scenes</span>
                            <span className="text-[10px] text-[#8E9F96] mt-0.5 block">Select multiple images to upload and auto-insert into the scenes list below.</span>
                          </div>
                          <label className={`flex items-center gap-1.5 px-3 py-2 bg-[#1B4C44] hover:bg-[#256055] text-white text-xs font-bold rounded-lg border border-[#1B4C44] transition-colors cursor-pointer shrink-0 ${isBulkUploading === 'nearby' ? 'opacity-50 cursor-wait' : ''}`}>
                            {isBulkUploading === 'nearby' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                            {isBulkUploading === 'nearby' ? 'UPLOADING...' : 'BULK UPLOAD'}
                            <input type="file" multiple accept="image/*" disabled={isBulkUploading === 'nearby'} onChange={(e) => handleBulkUpload(e, 'nearby')} className="hidden" />
                          </label>
                        </div>

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
                          onSave={handleSavePage}
                          isSaving={isSaving !== null}
                        />
                      </div>
                    )}

                    <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                      <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">Bottom CTA Section</div>
                      <TextInputGroup label="CTA Badge" icon={Tag} value={formFields.nearby_cta_badge} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_cta_badge: v }))} />
                      <div className="grid grid-cols-2 gap-4">
                        <TextInputGroup label="CTA Heading" icon={Type} value={formFields.nearby_cta_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_cta_heading: v }))} />
                        <TextInputGroup label="CTA Heading (Italic)" icon={Type} value={formFields.nearby_cta_heading_italic} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_cta_heading_italic: v }))} />
                      </div>
                      <TextAreaGroup label="CTA Description" value={formFields.nearby_cta_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_cta_desc: v }))} rows={2} />
                      <div className="grid grid-cols-2 gap-4">
                        <TextInputGroup label="Button Text" icon={Type} value={formFields.nearby_cta_btn_text} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_cta_btn_text: v }))} />
                        <TextInputGroup label="Button Link" icon={LinkIcon} value={formFields.nearby_cta_btn_link} onChange={(v) => setFormFields((prev: any) => ({ ...prev, nearby_cta_btn_link: v }))} />
                      </div>
                    </div>

                    <SectionSaveButton onSave={handleSavePage} isSaving={isSaving !== null} label="Save Nearby Guide Changes" />
                  </div>
                )}

                {/* ----------------- GALLERY PAGE ----------------- */}
                {activePageId === 'gallery' && (
                  <div className="space-y-6">
                    <SectionToggle
                      label="Gallery Hero Section"
                      checked={visibilities.gallery_hero_visible}
                      onChange={(v) => setVisibilities((prev: any) => ({ ...prev, gallery_hero_visible: v }))}
                      description="Toggle gallery hero intro panel visibility"
                    />
                    {visibilities.gallery_hero_visible && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white/5 rounded-xl border border-[#1C2E2A]">
                        <div className="md:col-span-2 space-y-4">
                          <TextInputGroup label="Hero Badge" icon={Tag} value={formFields.gallery_hero_badge} onChange={(v) => setFormFields((prev: any) => ({ ...prev, gallery_hero_badge: v }))} />
                          <TextInputGroup label="Heading" icon={Type} value={formFields.gallery_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, gallery_heading: v }))} />
                          <TextAreaGroup label="Subheading / Description" value={formFields.gallery_subheading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, gallery_subheading: v }))} rows={2} />
                        </div>
                        <ImageUploader label="Cover Image" currentImage={formFields.gallery_image} onImageChange={(p) => setFormFields((prev: any) => ({ ...prev, gallery_image: p }))} aspectRatio="aspect-video w-full" />
                      </div>
                    )}

                    <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                      <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">Category Filter Tabs</div>
                      <TextInputGroup label="Category Tabs (comma-separated, do not include 'All')" icon={Tag} value={formFields.gallery_categories} onChange={(v) => setFormFields((prev: any) => ({ ...prev, gallery_categories: v }))} />
                    </div>

                    <div className="bg-[#0D1412] border border-[#1C2E2A] rounded-xl p-4 flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-xs font-bold text-[#C4A665] uppercase tracking-wider block">Bulk Upload Gallery Images</span>
                        <span className="text-[10px] text-[#8E9F96] mt-0.5 block">Select multiple images to upload and auto-insert into the gallery list below.</span>
                      </div>
                      <label className={`flex items-center gap-1.5 px-3 py-2 bg-[#1B4C44] hover:bg-[#256055] text-white text-xs font-bold rounded-lg border border-[#1B4C44] transition-colors cursor-pointer shrink-0 ${isBulkUploading === 'gallery' ? 'opacity-50 cursor-wait' : ''}`}>
                        {isBulkUploading === 'gallery' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        {isBulkUploading === 'gallery' ? 'UPLOADING...' : 'BULK UPLOAD'}
                        <input type="file" multiple accept="image/*" disabled={isBulkUploading === 'gallery'} onChange={(e) => handleBulkUpload(e, 'gallery')} className="hidden" />
                      </label>
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
                                {(formFields.gallery_categories || "Peaks & Vibe, Sanctuary Suites, Spiritual Life").split(',').map((c: string) => c.trim()).filter(Boolean).map((c: string) => (
                                  <option key={c} value={c} className="bg-[#0D1412]">{c}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <ImageUploader label="Gallery Image" currentImage={item.src} onImageChange={(p) => updateField('src', p)} aspectRatio="aspect-[4/3] w-full" />
                        </div>
                      )}
                      onSave={handleSavePage}
                      isSaving={isSaving !== null}
                    />

                    <SectionSaveButton onSave={handleSavePage} isSaving={isSaving !== null} label="Save Gallery Changes" />
                  </div>
                )}

                {/* ----------------- CONTACT US ----------------- */}
                {activePageId === 'contact' && (
                  <div className="space-y-6">
                    <SectionToggle label="Contact Hero Section" checked={visibilities.contact_hero_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, contact_hero_visible: v }))} />
                    {visibilities.contact_hero_visible && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white/5 rounded-xl border border-[#1C2E2A]">
                        <div className="md:col-span-2 space-y-4">
                          <TextInputGroup label="Contact Badge Label" icon={Tag} value={formFields.contact_badge} onChange={(v) => setFormFields((prev: any) => ({ ...prev, contact_badge: v }))} />
                          <TextInputGroup label="Heading" icon={Type} value={formFields.contact_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, contact_heading: v }))} />
                          <TextInputGroup label="Subheading" icon={Type} value={formFields.contact_subheading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, contact_subheading: v }))} />
                          <TextInputGroup label="Italic Phrase" icon={Type} value={formFields.contact_italic_text} onChange={(v) => setFormFields((prev: any) => ({ ...prev, contact_italic_text: v }))} />
                          <TextInputGroup label="Reservation Email Coordinates" icon={Mail} value={formFields.contact_email} onChange={(v) => setFormFields((prev: any) => ({ ...prev, contact_email: v }))} />
                          <TextInputGroup label="Map Pin Location Text" icon={MapPin} value={formFields.contact_map_pin} onChange={(v) => setFormFields((prev: any) => ({ ...prev, contact_map_pin: v }))} />
                        </div>
                        <ImageUploader label="Cover Image" currentImage={formFields.contact_image} onImageChange={(p) => setFormFields((prev: any) => ({ ...prev, contact_image: p }))} aspectRatio="aspect-video w-full" />
                      </div>
                    )}

                    <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                      <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">Instagram Coordinates</div>
                      <div className="grid grid-cols-2 gap-4">
                        <TextInputGroup label="Instagram Username Handle" icon={Type} value={formFields.contact_instagram} onChange={(v) => setFormFields((prev: any) => ({ ...prev, contact_instagram: v }))} />
                        <TextInputGroup label="Instagram Profile URL" icon={LinkIcon} value={formFields.contact_instagram_url} onChange={(v) => setFormFields((prev: any) => ({ ...prev, contact_instagram_url: v }))} />
                      </div>
                    </div>

                    <SectionToggle label="Inquiry Form Section" checked={visibilities.contact_form_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, contact_form_visible: v }))} />
                    {visibilities.contact_form_visible && (
                      <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                        <TextInputGroup label="Inquiry Form Section Title" icon={Type} value={formFields.contact_form_title} onChange={(v) => setFormFields((prev: any) => ({ ...prev, contact_form_title: v }))} />
                      </div>
                    )}

                    <SectionSaveButton onSave={handleSavePage} isSaving={isSaving !== null} label="Save Contact Details" />
                  </div>
                )}

                {/* ----------------- BOOKING PAGE ----------------- */}
                {activePageId === 'booking' && (
                  <div className="space-y-6">
                    <SectionToggle
                      label="Online Booking Enabled"
                      checked={visibilities.booking_visible}
                      onChange={(v) => setVisibilities((prev: any) => ({ ...prev, booking_visible: v }))}
                      description="Toggle online booking forms and reservation capability"
                    />
                    <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <TextInputGroup label="Heading" icon={Type} value={formFields.booking_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, booking_heading: v }))} />
                        <TextInputGroup label="Heading (Italic)" icon={Type} value={formFields.booking_heading_italic} onChange={(v) => setFormFields((prev: any) => ({ ...prev, booking_heading_italic: v }))} />
                      </div>
                      <TextInputGroup label="Badge Text" icon={Tag} value={formFields.booking_badge} onChange={(v) => setFormFields((prev: any) => ({ ...prev, booking_badge: v }))} />
                      <TextAreaGroup label="Subheading" value={formFields.booking_subheading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, booking_subheading: v }))} rows={2} />
                    </div>

                    <SectionSaveButton onSave={handleSavePage} isSaving={isSaving !== null} label="Save Booking Settings" />
                  </div>
                )}

                {/* ----------------- POLICY PAGES ----------------- */}
                {['privacy', 'terms'].includes(activePageId) && (
                  <div className="space-y-4">
                    <TextInputGroup label="Document Title" icon={Type} value={formFields.title} onChange={(v) => setFormFields((prev: any) => ({ ...prev, title: v }))} />
                    <TextAreaGroup label="Document Content Body" value={formFields.content} onChange={(v) => setFormFields((prev: any) => ({ ...prev, content: v }))} rows={18} />
                    <SectionSaveButton onSave={handleSavePage} isSaving={isSaving !== null} label="Save Policy Document" />
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
