import { useState, useEffect, useRef, useCallback } from 'react';
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
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'dining', label: 'Dining' },
  { id: 'weddings', label: 'Weddings' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'nearby', label: 'Nearby' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
  { id: 'booking', label: 'Booking' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'terms', label: 'Terms' }
];

// Fallback Default Content Catalogs (Syncs Frontend Default Assets to CMS when DB is unpopulated)
const DEFAULT_HOME_POLAROIDS = [
  { title: "Double Pine Suite", desc: "ELEVATED ALPINE LIVING", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800", is_visible: true },
  { title: "Cozy Comforts", desc: "COZY HEARTH COMPANIONSHIP", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600", is_visible: true },
  { title: "Chaukhamba Peak", desc: "MISTY GOLDEN RANGE VISTAS", image: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80&w=800", is_visible: true },
  { title: "Hearthside Breads", desc: "ORGANIC FRESH BREADS", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600", is_visible: true }
];

const DEFAULT_HOME_OFFERINGS = [
  { num: "01", badge: "CELESTIAL MEMORIES", title: "Destination Weddings", description: "Exchange eternal vows on elegant stone cedar terraces wreathed in soft misty breeze and sacred Himalayan aesthetics.", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200", bgClass: "bg-[#3A1412]", textClass: "text-[#FAF9F5]", coords: "N 30° 16' 10\" // E 79° 04' 40\"", icon: "Heart", is_visible: true },
  { num: "02", badge: "RETREAT BASECAMP", title: "Kedarnath Yatra Stay", description: "Your premium high-altitude rest stay. Rest in comfortable modern pine wood cabins built along the Kedarnath pilgrimage route.", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200", bgClass: "bg-[#0f2822]", textClass: "text-[#FAF9F5]", coords: "N 30° 16' 12\" // E 79° 04' 45\"", icon: "Mountain", is_visible: true },
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
  { num: "03", category: "UNTOUCHED BREATH", title: "Pure Clean Air", desc: "Wake up energized. Crisp mountain currents blow straight off the high snowy peak glaciers, naturally filtered by dense evergreens before climbing Village Dewar's scenic ridge.", icon: "Wind", is_visible: true },
  { num: "04", category: "CARING HOSPITALITY", title: "Devoted Himalayan Sewa", desc: "Genuine, humble local team serving selfless mountain devotion—brewing warming morning herbal teas & coordinating peaceful local pilgrimage routes like family.", icon: "Users", is_visible: true }
];

const DEFAULT_HOME_BENTO_GALLERY = [
  { image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1000", title: "Dining" },
  { image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800", title: "Wedding" },
  { image: "https://images.unsplash.com/photo-1443632864897-14973fa006cf?auto=format&fit=crop&q=80&w=800", title: "Pines" },
  { image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800", title: "Cafe" },
  { image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200", title: "Glamping" },
  { image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800", title: "Lounge" }
];

const DEFAULT_SOCIAL_PROOF_REVIEWS = [
  { name: "Harshvardhan Joshi", date: "May 2025", rating: 5, state: "Maharashtra", text: "Stayed here for 2 days during our pilgrimage. The gentle climb up to this high-altitude property is totally worth it. The view of Chaukhamba peaks in the golden morning light is absolutely stunning. The staff is incredibly helpful and arranged a smooth local transfer for our early departure.", approved: true },
  { name: "Ramesh Gupta", date: "October 2024", rating: 4, state: "Gujarat", text: "Very peaceful place. It is far from the dust and traffic noise of Guptkashi bazaar. Clean rooms, hot water was regular which is rare in mountains. Best part is the pure veg food, super simple and tasty like home. Highly recommend.", approved: true },
  { name: "Meenakshi Iyer", date: "December 2024", rating: 5, state: "Tamil Nadu", text: "We were traveling with our 70-year-old parents. The staff personally helped them with their heavy bags up the stairs. Rooms have proper wooden interiors which kept us warm. The kitchen staff prepared simple oil-free khichdi on request.", approved: true },
  { name: "Kuldeep Singh", date: "June 2025", rating: 4, state: "Haryana", text: "Clean rooms, beautiful views of the valley. The property is very quiet. Only thing is Wi-Fi was bit slow in the night, but we didn't mind because the pine forest walk nearby was beautiful. Good value for money.", approved: true }
];

const DEFAULT_ABOUT_PILLARS = [
  { id: '01', title: 'ORGANIC CUSTODIANSHIP', desc: 'Sustaining high-altitude terrain integrity with local terrace field grains.', icon: 'Trees', is_visible: true },
  { id: '02', title: 'HEALTHY VEGETARIAN', desc: 'Providing nutritious, fresh local vegetarian meals made from regional crops.', icon: 'Leaf', is_visible: true },
  { id: '03', title: 'SACRED RESTORATION', desc: 'A peaceful pilgrimage base camp designed for genuine spiritual restoration.', icon: 'Sparkles', is_visible: true }
];

const DEFAULT_ROOMS_AMENITIES = [
  { label: "Electric Heated Beds", icon: "Bed", desc: "Dual control electric temperature overlays.", is_visible: true },
  { label: "Mountain View Balcony", icon: "Mountain", desc: "Private sit-out facing misty Chaukhamba peaks.", is_visible: true },
  { label: "Organic Herb Brews", icon: "Coffee", desc: "Complimentary raw ginger tea upon arrival.", is_visible: true },
  { label: "High-Speed Internet", icon: "Wifi", desc: "Resort-wide continuous high bandwidth.", is_visible: true },
  { label: "Slate Hot Baths", icon: "Droplets", desc: "Continuous mountain hot spring streams.", is_visible: true },
  { label: "Wooden Work Desks", icon: "Briefcase", desc: "Hand-crafted mountain deodar wood desks.", is_visible: true }
];

const DEFAULT_ROOMS_REVIEWS = [
  { name: "Arjun Sharma", rating: 5, location: "New Delhi", date: "May 2026", text: "The Pinewood suite was an exceptional rest base before our Kedarnath trek. The electric bed heating made a huge difference in the mountain chill.", source: "google", is_visible: true },
  { name: "Devika Rao", rating: 5, location: "Bangalore", date: "April 2026", text: "A truly restorative space. Waking up to the misty views of Chaukhamba peaks and hot ginger brews was unforgettable.", source: "tripadvisor", is_visible: true },
  { name: "Rahul Verma", rating: 5, location: "Mumbai", date: "May 2026", text: "Pure organic vegetarian dining and quiet forest surroundings. The staff coordinated our puja circuits beautifully.", source: "google", is_visible: true }
];

const DEFAULT_DINING_SPECIALTIES = [
  { num: "01", title: "Traditional Gehat Dal & Red Rice", desc: "Slow-simmered regional black gehat beans prepared in traditional heavy ironware, paired with local red rice grown in high-altitude terrace fields, topped with hand-churned mountain cow A2 ghee.", energy: "Healthy & Nutritious", origin: "Local Ridge Farms", attribute: "Organic Restorative", category: "grains", is_visible: true },
  { num: "02", title: "Hand-Rolled Mandua Flatbreads & Wild Honey", desc: "Stone-ground alpine ragi crop griddle breads baked over open deodar woods on porous earthen plates. Served warm with raw wild mountain honey and salted organic walnut dust.", energy: "Traditional Energy", origin: "High Guptkashi Ridge", attribute: "Organic Grain Fuel", category: "grains", is_visible: true },
  { num: "03", title: "Traditional Phaanu Stew", desc: "A hearty organic pureed stew of native hillside soybeans, slow-cooked inside local earthen vessels, tempered with mountain celery root and wild caraway.", energy: "Nutrient Rich", origin: "Kedarnath Foothills", attribute: "Light Digestion", category: "stews", is_visible: true },
  { num: "04", title: "Organic Ginger-Tulsi Herbal Brew", desc: "A warm and soothing herbal beverage brewed from fresh-gathered holy basil stems, crushed mountain ginger roots, and pure forest honey.", energy: "Restorative Brew", origin: "Retreat Herbal Garden", attribute: "Active Peak Warmth", category: "elixirs", is_visible: true },
  { num: "05", title: "Kali Dal Ka Chaunsa", desc: "A traditional high-altitude Garhwali dish of dry-roasted and stone-ground black urad lentils, slow-cooked in seasoned iron pans, and tempered with the aromatic native herb Jakhiya.", energy: "High Protein & Warming", origin: "Garhwal Highlands", attribute: "Ancestral Iron Pot", category: "grains", is_visible: true }
];

const DEFAULT_DINING_ALCHEMY = [
  { id: "clay", title: "The Earthen Mudpot", tagline: "9-HOUR EMBERS & POROUS CLAY", desc: "Vessel walls shaped by hand from Mandakini riverbed silt. As the pots simmer slow over low heat for nine hours, the porous natural minerals bind with grain stars, locking in unrefined earth elements with zero synthetic reactions.", illustration: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800", vessel: "Traditional Himalayan Claypots", benefit: "Retains high soil mineral density", smoke: "Deodar log whispers", accentColor: "#1B4C44", is_visible: true },
  { id: "iron", title: "The Heavy Ironware", tagline: "RAW CAST ROASTING", desc: "Pre-heated heavy black iron cauldrons, seasoned thoroughly for generations. Gehat beans and therapeutic wild celery roots are slow-cooked under high iron weights, infusing raw minerals and retaining dense nutrients.", illustration: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800", vessel: "Hand-Beaten Mountain Ironware", benefit: "Supports micro-biological blood health", smoke: "Cedar timber glow", accentColor: "#A88C52", is_visible: true },
  { id: "embers", title: "The Timber Hearth", tagline: "BAKED ABOVE WOOD EMBERS", desc: "Our hearth uses clean fallen deodar timber logs. Flour is ground, kneaded in hand-beaten bronze pans, and slow-baked on hot regional flagstones using only the radiant warmth of embers.", illustration: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800", vessel: "Fallen Deodar Bark Hearth", benefit: "Purifies respiratory pathways naturally", smoke: "Pine essence atmosphere", accentColor: "#2E3438", is_visible: true }
];

const DEFAULT_DINING_POLAROIDS = [
  { title: "Slate Pavilion Hearth", desc: "WOOD-FIRED EMBERS COOKING", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800", is_visible: true },
  { title: "Terrace Herbal Garden", desc: "DAILY FRESH HERBAL INFUSIONS", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600", is_visible: true },
  { title: "Pilgrim Bread Griddle", desc: "HAND-BEATEN MANDUA BREADS", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800", is_visible: true }
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

const DEFAULT_GARHWALI_DISHES = [
  { name: "Mandua Roti with local butter", desc: "Stone-ground finger millet flatbreads cooked over open wood flame, served hot with fresh hand-churned salted mountain butter.", category: "breakfast", is_visible: true },
  { name: "Aloo ke Gutke", desc: "Crispy skin-on mountain potatoes stir-fried in mustard oil and tempered with the aromatic native Jakhiya herb (wild mustard).", category: "breakfast", is_visible: true },
  { name: "Fresh curd", desc: "Naturally set, thick and creamy probiotic curd made from regional pasture-grazed A2 cow milk.", category: "breakfast", is_visible: true },
  { name: "Mountain tea", desc: "A steaming restorative infusion of crushed mountain ginger, fresh lemongrass, and wild tulsi leaves.", category: "breakfast", is_visible: true },
  { name: "Kafuli", desc: "The legendary green gravy of Uttarakhand. Made with fresh spinach and fenugreek leaves, simmered in iron pots and thickened with organic rice paste.", category: "signature", is_visible: true },
  { name: "Chainsoo", desc: "A roasted, stone-ground black gram (urad dal) soup cooked slow in iron pans to develop deep earthy flavors.", category: "signature", is_visible: true },
  { name: "Phaanu", desc: "A rich, complex legume soufflé-stew made by blending split green soybeans, slow-cooked in traditional earthenware.", category: "signature", is_visible: true },
  { name: "Dubuk", desc: "A velvety, comforting preparation of local pulses (bhatt or gahat) ground and slow-simmered over gentle embers.", category: "signature", is_visible: true },
  { name: "Kandali Ka Saag", desc: "Wild-harvested stinging nettle greens, carefully de-thorned, boiled and sautéed with local spices and wild garlic.", category: "signature", is_visible: true },
  { name: "Traditional Village Thali", desc: "A complete Garhwali meal featuring Mandua Roti, Jhangora (barnyard millet), seasonal vegetables, dal, Bhang Ki Chutney, and local pickle.", category: "signature", is_visible: true },
  { name: "Thechwani", desc: "Mountain potatoes and white radish roots crushed (thechyaye) and sautéed in local oil, tempered with wild caraway.", category: "delicacies", is_visible: true },
  { name: "Gahat Dal", desc: "Medicinal horse gram lentils simmered for hours, highly regarded in Ayurveda for kidney health and winter warmth.", category: "delicacies", is_visible: true },
  { name: "Bhatt preparations", desc: "Black soybeans cooked in various traditional styles, from dry roasted snacks to thick iron-cooked gravies (Bhatt ki Churkani).", category: "delicacies", is_visible: true },
  { name: "Seasonal mountain greens", desc: "Wild-foraged forest fiddlehead ferns (Lingra) or organic amaranth leaves sautéed with mountain red chilies.", category: "delicacies", is_visible: true },
  { name: "Jhangora Ki Kheer", desc: "Creamy pudding made of organic barnyard millet cooked slow in sweetened A2 milk, finished with cardamom and dry nuts.", category: "sweet", is_visible: true },
  { name: "Arsa", desc: "Crisp festival treats made by grinding soaked red rice, mixing with jaggery syrup, and frying in fresh cow ghee.", category: "sweet", is_visible: true },
  { name: "Rot", desc: "Thick sweet flatbreads made of wheat flour, fennel, and jaggery, baked directly over wood embers.", category: "sweet", is_visible: true },
  { name: "Singori", desc: "A sweet delicacy of concentrated milk solids (khoya) flavored with coconut, wrapped in fresh green Maalu leaves.", category: "sweet", is_visible: true }
];

const DEFAULT_WEDDINGS_POLAROIDS = [
  { image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800", title: "Sacred Canopy", desc: "VOWS UNDER MAJESTIC SUMMITS", is_visible: true },
  { image: "https://images.unsplash.com/photo-1519225495810-7512c322a3e6?auto=format&fit=crop&q=80&w=800", title: "Candlelit Glass", desc: "GLOWING EVENING SALON RECEPTIONS", is_visible: true },
  { image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800", title: "High Pine Lawn", desc: "ALFRESCO DEODAR BANQUETS", is_visible: true },
  { image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800", title: "Floral Mandap", desc: "TRADITIONAL GARHWALI HARMONY", is_visible: true }
];

const DEFAULT_WEDDINGS_GALLERY = [
  { image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800", title: "Altar under the Snowpeaks", category: "CANOPY VOWS", is_visible: true },
  { image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800", title: "Long table woodland banquets", category: "OUTDOOR SLATES", is_visible: true },
  { image: "https://images.unsplash.com/photo-1519225495810-7512c322a3e6?auto=format&fit=crop&q=80&w=1200", title: "Starlit fireplace gatherings", category: "GLASS PAVILION", is_visible: true },
  { image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800", title: "Deodar twilight trail entrance", category: "WOODEN TORCHES", is_visible: true },
  { image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800", title: "Hand raised local millet thalis", category: "VEGETARIAN FEASTS", is_visible: true },
  { image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800", title: "Lawn cocktails & quiet embers", category: "TWILIGHT SPIRIT", is_visible: true }
];

const DEFAULT_WEDDINGS_VENUES = [
  {
    id: "canopy-lawn",
    title: "Sacred Canopy Lawn",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600",
    capacity: "Up to 20 guests",
    location: "East Forest Facing",
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
    location: "Retreat Garden",
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
    location: "West Forest Ridge",
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
    description: "Limited to 20 guests. Host a private family destination wedding with full retreat access.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    bgClass: "bg-[#0f2822]",
    textClass: "text-[#FAF9F5]",
    coords: "N 30° 16' 10\" // E 79° 04' 40\"",
    is_visible: true
  },
  {
    num: "02",
    badge: "CULINARY ARTISTRY",
    title: "Bespoke Vegetarian Menus",
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
    id: "horseriding",
    category: "RECREATION",
    title: "Horse Riding",
    subtitle: "Scenic mountain paths on sturdy ponies",
    description: "Explore the surrounding alpine slopes, tall forests, and peaceful valley viewports on sturdily trained mountain horses with a dedicated handler.",
    image: "",
    icon: "Compass",
    is_visible: true
  },
  {
    id: "cycling",
    category: "LOCAL TRIPS",
    title: "Cycling on Village Roads",
    subtitle: "Pedal through historic pine forest paths",
    description: "Rent one of our premium hybrid bicycles and explore the winding, quiet paved roads of Village Dewar, feeling the fresh cedar breeze.",
    image: "",
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
  },
  {
    id: "cooking",
    category: "CULINARY",
    title: "Traditional Cooking Class",
    subtitle: "Learn local food preparation",
    description: "Discover the principles of Ayurvedic nutrition and healthy cooking. Learn how to cook with clay pots, ironware, and locally-sourced terraced ingredients.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=2000",
    icon: "Utensils",
    is_visible: true
  }
];

const DEFAULT_EXPERIENCES_GALLERY = [
  { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200", caption: "Cozy Pinewood Cottage Bedroom", is_visible: true },
  { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200", caption: "Misty Sunrise on Chaukhamba Peaks", is_visible: true },
  { url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200", caption: "Hot House-Sourced Organic Vegetarian Lunch", is_visible: true },
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
    description: "Set within Kedarnath Wild Forest Reserve, this scenic meadow is surrounded by dense, mossy pine, spruce, and pink cedar. Home to rare monal pheasants, Chopta offers pristine winds and clean stars.",
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
    subtitle: "A cliff-top temple on narrow vertical spires",
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
  { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200", category: "Mountain Views", title: "Chaukhamba Summits", desc: "Glacial snow peaks overlooking our open sunrise yoga deck.", is_visible: true },
  { src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200", category: "Rooms & Suites", title: "Luxury Mountain Suite", desc: "Cozy custom electric temperature beds lined with organic heavy wool blankets.", is_visible: true },
  { src: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1200", category: "Food & Dining", title: "The Slate Dining Pavilion", desc: "Pure organic thalis cooked over fresh timber and mountain logs.", is_visible: true },
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200", category: "Sacred Spaces", title: "Himalayan Mandap Vows", desc: "Our cedar marriage lawns framed beautifully by pine forests and mountain fog.", is_visible: true },
  { src: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80&w=1200", category: "Mist & Ridges", title: "Guptkashi Dawn Mist", desc: "Ethereal blue morning fog hanging gracefully over our cedar pine cliffs.", is_visible: true },
  { src: "https://images.unsplash.com/photo-1580977276076-ac4ccbec0680?auto=format&fit=crop&q=80&w=1200", category: "Rooms & Suites", title: "Aura Bath & Spa Suite", desc: "Continuous organic hot water flows with cold slate stone tiles.", is_visible: true },
  { src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1200", category: "Food & Dining", title: "Restorative Herbal Sips", desc: "Hot immune-support ginger remedies upon custom arrival desks.", is_visible: true },
  { src: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200", category: "Sacred Spaces", title: "Sacred Temple Rays", desc: "Spiritual morning light pierces the traditional deodar woodwork in Guptkashi.", is_visible: true }
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
    <div className="flex justify-end pt-4 mt-6 border-t border-[#C4A665]/20">
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="relative group overflow-hidden px-7 py-3.5 bg-gradient-to-r from-[#C4A665] to-[#E2C58A] hover:from-[#FAF9F5] hover:to-[#FAF9F5] text-black font-extrabold text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-[#C4A665]/20 active:scale-95 disabled:opacity-50 hover:shadow-xl hover:shadow-[#C4A665]/30 cursor-pointer flex items-center gap-2.5 border border-[#C4A665]/30"
      >
        {isSaving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        <span>{isSaving ? 'SAVING CHANGES...' : label}</span>
        <div className="absolute inset-0 border border-white/30 rounded-xl group-hover:scale-105 transition-transform duration-500 pointer-events-none" />
      </button>
    </div>
  );
}

// Floating persistent save bar that sticks to the bottom of the viewport
function FloatingSaveBar({ onSave, isSaving, hasChanges, pageLabel }: { onSave: () => void; isSaving: boolean; hasChanges: boolean; pageLabel: string }) {
  return (
    <div
      className={`fixed bottom-0 left-0 lg:left-[260px] right-0 z-50 transition-all duration-500 ease-out ${
        hasChanges
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-gradient-to-r from-[#0D1412] via-[#111A17] to-[#0D1412] border-t-2 border-[#C4A665]/60 backdrop-blur-xl shadow-[0_-8px_32px_rgba(196,166,101,0.15)] px-6 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Unsaved indicator */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C4A665]" />
            </span>
            <div>
              <span className="text-[10px] font-extrabold text-[#C4A665] uppercase tracking-[0.2em] block">⚠ Unsaved Changes</span>
              <span className="text-[9px] text-[#8E9F96] block mt-0.5">Your edits to <strong className="text-white/80">{pageLabel}</strong> have not been saved yet</span>
            </div>
          </div>
          {/* Right: Save CTA */}
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="relative group overflow-hidden px-8 py-3 bg-gradient-to-r from-[#C4A665] to-[#E2C58A] hover:from-[#FAF9F5] hover:to-[#FAF9F5] text-black font-extrabold text-xs uppercase tracking-[0.15em] rounded-xl transition-all shadow-lg shadow-[#C4A665]/25 active:scale-95 disabled:opacity-50 hover:shadow-xl hover:shadow-[#C4A665]/40 cursor-pointer flex items-center gap-2.5 border border-[#C4A665]/30 shrink-0"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'SAVING...' : `SAVE ${pageLabel.toUpperCase()}`}</span>
            <div className="absolute inset-0 border border-white/20 rounded-xl group-hover:scale-[1.02] transition-transform duration-500 pointer-events-none" />
          </button>
        </div>
      </div>
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

        {/* ADD ITEM grid card placeholder */}
        <div
          onClick={handleAdd}
          className="border-2 border-dashed border-[#1C2E2A] hover:border-[#C4A665]/40 hover:bg-[#C4A665]/5 rounded-xl flex flex-col items-center justify-center min-h-[120px] p-4 group cursor-pointer transition-all duration-300"
          title="Add a new item"
        >
          <div className="bg-[#1C2E2A]/30 group-hover:bg-[#C4A665]/10 group-hover:scale-105 p-3 rounded-full text-[#C4A665]/50 group-hover:text-[#C4A665] transition-all duration-300 border border-transparent group-hover:border-[#C4A665]/10 shadow-sm">
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-bold text-white/30 group-hover:text-[#C4A665] uppercase tracking-widest mt-2.5 transition-colors">Add Item</span>
        </div>
      </div>

      {activeIdx !== null && items[activeIdx] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0D1412] border border-[#1C2E2A] rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto relative shadow-2xl animate-in zoom-in-95 duration-200 text-left">
            <button
              type="button"
              onClick={() => setActiveIdx(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Close editor"
            >
              <X className="w-5 h-5" />
            </button>

            {onSave && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 text-[9px] text-[#C4A665] font-bold bg-[#C4A665]/10 px-4 py-2.5 rounded-lg border border-[#C4A665]/20 shadow-inner">
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

            <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-4 border-b border-[#1C2E2A] pb-2">
              Editing Item #{activeIdx + 1}
            </div>

            <div className="space-y-4">
              {renderItemEditor(items[activeIdx], activeIdx, (field, value) => handleUpdate(activeIdx, field, value))}
            </div>

            <div className="flex justify-end pt-4 mt-6 border-t border-[#1C2E2A] gap-3">
              <button
                type="button"
                onClick={() => setActiveIdx(null)}
                className="px-5 py-2 rounded bg-gradient-to-r from-[#C4A665] to-[#E2C58A] hover:from-[#FAF9F5] hover:to-[#FAF9F5] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 border border-[#C4A665]/20"
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const DEFAULT_CONTACT_FAQS = [
  {
    question: "What is the daily life and atmosphere like at the retreat?",
    answer: "The retreat is designed for quiet, mindful mountain living. Guests wake up to clear peak views, practice morning yoga or meditation in our forest shala, walk through fragrant deodar paths, and gather around the outdoor slate fire bowl at twilight. We serve fresh, slow-cooked Sattvik vegetarian meals.",
    is_visible: true
  },
  {
    question: "What outdoor activities and treks can we experience nearby?",
    answer: "We coordinate guided forest trail walks, ancient heritage temple treks, and day hikes to scenic meadows. For adventure seekers, we arrange trail guides for nearby coordinates. Inside the resort, we offer sunrise yoga sessions, deep breathing practices for high-altitude adjustment, and fireside musical gatherings.",
    is_visible: true
  },
  {
    question: "What peaks are visible from the retreat, and how are the views?",
    answer: "The retreat sits on a scenic, elevated shelf in Village Dewar, offering panoramic views of the snow-capped Chaukhamba peaks and surrounding Himalayan ranges. Our luxury suites, garden lawns, and glass dining pavilion feature large glass panels facing directly towards the peaks.",
    is_visible: true
  },
  {
    question: "How is the weather at Guptkashi throughout the season?",
    answer: "April to June offers warm, pleasant days (18°C to 25°C) and cool evenings, ideal for events and pilgrimages. July to September brings the lush green monsoon mist, creating a serene, dreamy mountain vibe. October to December is crisp, sunny, and cold (down to 2°C at night), offering the clearest views of the snowy peaks.",
    is_visible: true
  },
  {
    question: "Why do pilgrims choose this retreat as a base for the Kedarnath Yatra?",
    answer: "While staying right on the transit path can be congested and noisy, our location in Village Dewar is elevated into the quiet evergreens, completely free of traffic fumes. We are just a 10-minute drive (4.7 km) from Guptkashi Helipad, making us the perfect peaceful base for early helicopter departures or road transit to Sonprayag.",
    is_visible: true
  },
  {
    question: "Can the retreat accommodate group bookings, weddings, or private events?",
    answer: "Yes, we can accommodate up to 60+ guests across our suites, cottages, and Swiss camps. We offer full buyout packages for weddings, yoga retreats, and events, including end-to-end catering, Himalayan floral decorations, and local folk ceremonies.",
    is_visible: true
  }
];

export default function AdminPages() {
  const { content, loading: contentLoading, getValue, updateContent, updateMultipleContent } = useContent();
  const { zones, loading: zonesLoading, uploadImageDirect } = useImageZones();

  const [activePageId, setActivePageId] = useState('home');
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const initialLoadRef = useRef(true);

  // States
  const [visibilities, setVisibilities] = useState<any>({});
  const [formFields, setFormFields] = useState<any>({});
  
  // Lists
  const [polaroids, setPolaroids] = useState<any[]>([]);
  const [offerings, setOfferings] = useState<any[]>([]);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [pillars, setPillars] = useState<any[]>([]);
  const [specialtyDishes, setSpecialtyDishes] = useState<any[]>([]);
  const [garhwaliDishes, setGarhwaliDishes] = useState<any[]>([]);
  const [alchemies, setAlchemies] = useState<any[]>([]);
  const [diningPolaroids, setDiningPolaroids] = useState<any[]>([]);
  const [dailyRituals, setDailyRituals] = useState<any[]>([]);
  const [diningVows, setDiningVows] = useState<any[]>([]);
  const [roomsAmenities, setRoomsAmenities] = useState<any[]>([]);
  const [roomsReviews, setRoomsReviews] = useState<any[]>([]);
  const [weddingPolaroids, setWeddingPolaroids] = useState<any[]>([]);
  const [weddingsGallery, setWeddingsGallery] = useState<any[]>([]);
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
  const [contactFaqs, setContactFaqs] = useState<any[]>([]);

  // Mark changes as unsaved whenever form data changes (skip initial load)
  useEffect(() => {
    if (initialLoadRef.current) return;
    setHasUnsavedChanges(true);
  }, [formFields, visibilities, polaroids, offerings, amenities, pillars, specialtyDishes, garhwaliDishes, alchemies, diningPolaroids, dailyRituals, diningVows, roomsAmenities, roomsReviews, weddingPolaroids, weddingsGallery, venues, weddingOfferings, experienceSlides, experiencePhotos, nearbySlides, treksDirectory, nearbyPhotos, galleryImages, marqueeSlogans, whyChooseItems, bentoGalleryItems, socialProofReviews, contactFaqs]);

  // Load effect
  useEffect(() => {
    if (contentLoading) return;
    initialLoadRef.current = true;

    // Load general values
    const textVal = (key: string, def = '') => getValue(activePageId, key, def);

    // Visibilities
    const sectionVisKeys = [
      'hero_visible', 'marquee_visible', 'story_visible', 'offerings_visible', 'amenities_visible',
      'why_choose_visible', 'home_gallery_visible', 'home_cta_visible', 'social_proof_visible',
      'about_story_visible', 'pillars_visible', 'notice_visible', 'hours_visible', 'dietary_visible',
      'specialty_visible', 'alchemy_visible', 'dining_polaroids_visible', 'weddings_hero_visible',
      'weddings_story_visible', 'weddings_polaroids_visible', 'weddings_venues_visible', 'weddings_offerings_visible', 'weddings_gallery_visible',
      'experiences_tour_visible', 'experiences_gallery_visible', 'nearby_tour_visible', 'nearby_treks_visible', 'nearby_gallery_visible',
      'dining_hero_visible', 'dining_philosophy_visible', 'dining_rituals_visible', 'dining_pavilion_visible', 'dining_vows_visible', 'dining_garhwali_visible',
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
        hero_subtitle: getValue('home', 'hero_subtitle', 'Village Dewar, Guptkashi, Kedarnath Route'),
        hero_image: getValue('home', 'hero_image', ''),
        hero_cta: getValue('home', 'hero_cta', 'EXPLORE ROOMS'),
        hero_cta_link: getValue('home', 'hero_cta_link', '/rooms'),
        story_line1: getValue('home', 'story_line1', 'Wake Up to the'),
        story_line2: getValue('home', 'story_line2', 'Himalayan Snowline'),
        story_desc: getValue('home', 'story_desc', 'Inspired by our pristine cedar forest surroundings...'),
        story_btn_name: getValue('home', 'story_btn_name', 'VIEW ALL ROOMS & SUITES'),
        story_btn_link: getValue('home', 'story_btn_link', '/rooms'),
        why_choose_tagline: getValue('home', 'why_choose_tagline', 'THE VEDIC HIMALAYA DIFFERENCE'),
        why_choose_heading: getValue('home', 'why_choose_heading', 'Why Guests Choose'),
        why_choose_heading_italic: getValue('home', 'why_choose_heading_italic', 'Our Retreat'),
        why_choose_desc1: getValue('home', 'why_choose_desc1', 'Most commercial hotels are grouped near busy transit stations, introducing constant vehicle fumes, generator hums, and crowd noise.'),
        why_choose_desc2: getValue('home', 'why_choose_desc2', "The Vedic Himalaya Retreat sits high on the scenic, quiet shelf of Village Dewar, Guptkashi, Kedarnath Route. Here, you are beautifully elevated into the silent pines, looking straight out onto snowy Chaukhamba sweeps."),
        home_gallery_badge: getValue('home', 'home_gallery_badge', 'Gallery'),
        home_gallery_heading: getValue('home', 'home_gallery_heading', 'Our Visual Journal'),
        home_gallery_desc: getValue('home', 'home_gallery_desc', 'Capturing moments of morning light, quiet silence, and devotion across our retreat garden.'),
        home_cta_badge: getValue('home', 'home_cta_badge', 'A peaceful Himalayan stay awaits'),
        home_cta_heading: getValue('home', 'home_cta_heading', 'Ready to Experience the'),
        home_cta_heading_italic: getValue('home', 'home_cta_heading_italic', 'Pinewood Calm?'),
        home_cta_desc: getValue('home', 'home_cta_desc', 'Secure your room high in the mountain evergreens ahead of your sacred pilgrimage. Clean air, warm hospitality, and pure alpine peace.'),
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
        about_second_image: getValue('about', 'about_second_image', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200'),
        about_second_image_location: getValue('about', 'about_second_image_location', 'Village Dewar, Guptkashi, Uttarakhand'),
        about_second_image_title: getValue('about', 'about_second_image_title', 'Facing the Divine Peaks of Chaukhamba'),
      });
      try {
        const val = JSON.parse(getValue('about', 'pillars', '[]'));
        setPillars(Array.isArray(val) && val.length > 0 ? val : DEFAULT_ABOUT_PILLARS);
      } catch {
        setPillars(DEFAULT_ABOUT_PILLARS);
      }
    } else if (activePageId === 'rooms') {
      setFormFields({
        rooms_heading: getValue('rooms', 'rooms_heading', 'Mountain View Rooms'),
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
        dining_heading: getValue('dining', 'dining_heading', 'Traditional Mountain Dining'),
        dining_subheading: getValue('dining', 'dining_subheading', 'An intimate, fire-warmed communion with high-altitude terrace crops and raw forest elixirs.'),
        dining_image: getValue('dining', 'dining_image', ''),
        dining_hours: getValue('dining', 'dining_hours', '7:30 AM - 10:00 PM'),
        dining_dietary: getValue('dining', 'dining_dietary', 'Pure Vegetarian Cuisine'),
        dining_hero_subtitle: getValue('dining', 'dining_hero_subtitle', 'SATTVIK NOURISHMENT'),
        dining_philosophy_tagline: getValue('dining', 'dining_philosophy_tagline', 'SATTVIK NOURISHMENT'),
        dining_philosophy_heading: getValue('dining', 'dining_philosophy_heading', 'Nourished by the High Valley Peaks'),
        dining_philosophy_desc: getValue('dining', 'dining_philosophy_desc', "Savor the Mandakini basin's untouched alpine fields with hyper-local, traditional vegetarian recipes. Every grain of red millet has been collected by family handmills in the tiny terrace properties clinging high above the valley dust."),
        dining_alchemy_tagline: getValue('dining', 'dining_alchemy_tagline', 'TRADITIONAL COOKING METHODS'),
        dining_alchemy_heading: getValue('dining', 'dining_alchemy_heading', 'Raw Vessels, Living Nourishment'),
        dining_alchemy_desc: getValue('dining', 'dining_alchemy_desc', 'We cook on ancestral stone and slow-simmer inside native clays and seasoned hand-beaten mountain irons.'),
        dining_polaroids_tagline: getValue('dining', 'dining_polaroids_tagline', 'DINING PICTURES'),
        dining_polaroids_heading: getValue('dining', 'dining_polaroids_heading', 'A Taste of Pure Harvests'),
        dining_polaroids_desc: getValue('dining', 'dining_polaroids_desc', "Take a visual journey through our kitchen's daily bread, herbal infusions, and fireside seating configurations."),
        dining_rituals_tagline: getValue('dining', 'dining_rituals_tagline', 'THE NOURISHMENT CYCLE'),
        dining_rituals_heading: getValue('dining', 'dining_rituals_heading', 'Daily Meal Cycles'),
        dining_rituals_desc: getValue('dining', 'dining_rituals_desc', 'Our meals follow the rhythm of the mountain day. View how we structure dining throughout your stay.'),
        dining_pavilion_tagline: getValue('dining', 'dining_pavilion_tagline', 'Our Dining Room'),
        dining_pavilion_heading: getValue('dining', 'dining_pavilion_heading', 'The Mountain Table'),
        dining_pavilion_desc1: getValue('dining', 'dining_pavilion_desc1', 'Framed by massive floor-to-ceiling panoramic glass panes, our signature interior space hovers above the misty Guptkashi gorge. Enjoy your meal in a warm indoor dining space with clear views of the majestic snowline of Chaukhamba peaks.'),
        dining_pavilion_desc2: getValue('dining', 'dining_pavilion_desc2', 'Guests gather around cold-slab slate fireplace tables while foods are slow-cooked using traditional wood fuel. We avoid processed white sugars, chemical vegetable oils, and commercial steel pans—cooking inside clay pots and raw regional iron vessels.'),
        dining_pavilion_image: getValue('dining', 'dining_pavilion_image', ''),
        dining_pavilion_dresscode: getValue('dining', 'dining_pavilion_dresscode', 'Casual Resort Comfort'),
        dining_vows_tagline: getValue('dining', 'dining_vows_tagline', 'OUR DINING PHILOSOPHY'),
        dining_vows_heading1: getValue('dining', 'dining_vows_heading1', 'Food and Honesty'),
        dining_vows_heading2: getValue('dining', 'dining_vows_heading2', 'What We Promise'),
        dining_vows_desc1: getValue('dining', 'dining_vows_desc1', 'True physical restoration lies in complete resonance with the terrain. High high-altitude hiking requires provisions that digest lightly, hydrate cells thoroughly, and calm mental distraction.'),
        dining_vows_desc2: getValue('dining', 'dining_vows_desc2', 'We strictly discard industrial white sugars, synthesized chemical salts, processed lard oils, and preserving chemicals. Every kitchen process is pure, steady, and completed by hand.'),
        dining_specialty_tagline: getValue('dining', 'dining_specialty_tagline', 'What Is On The Menu'),
        dining_specialty_heading1: getValue('dining', 'dining_specialty_heading1', 'The Daily'),
        dining_specialty_heading2: getValue('dining', 'dining_specialty_heading2', 'Meal Spread'),
        dining_specialty_desc: getValue('dining', 'dining_specialty_desc', 'Slowly constructed dishes prepared fresh each sunrise and twilight, complementary to all resident guests of our hillside valleys.'),
        dining_menu_tagline: getValue('dining', 'dining_menu_tagline', 'PUBLIC DINING'),
        dining_menu_heading1: getValue('dining', 'dining_menu_heading1', 'Taste of'),
        dining_menu_heading2: getValue('dining', 'dining_menu_heading2', 'Garhwal'),
        dining_menu_desc: getValue('dining', 'dining_menu_desc', 'Carefully curated items available for order. All dishes are prepared from seasonal ridge-grown crops and organic valley spices.'),
        dining_footer_warning: getValue('dining', 'dining_footer_warning', 'Meals are crafted specifically to zero out village farm wastes. Please notify our dining team 2 hours in advance for specific allergy or custom diets.'),
        
        // Garhwali cuisine titles and Thali card settings
        dining_garhwali_tagline: getValue('dining', 'dining_garhwali_tagline', 'INDIGENOUS HARVEST'),
        dining_garhwali_heading: getValue('dining', 'dining_garhwali_heading', 'Authentic Garhwali Cuisine'),
        dining_garhwali_desc: getValue('dining', 'dining_garhwali_desc', '"Recipes passed down through generations, prepared with locally sourced ingredients from the Himalayan valleys."'),
        dining_garhwali_breakfast_title: getValue('dining', 'dining_garhwali_breakfast_title', 'Himalayan Breakfast'),
        dining_garhwali_signature_title: getValue('dining', 'dining_garhwali_signature_title', 'Garhwali Signatures'),
        dining_garhwali_grains_stews_title: getValue('dining', 'dining_garhwali_grains_stews_title', 'Grains & Claypot Stews'),
        dining_garhwali_main_title: getValue('dining', 'dining_garhwali_main_title', 'Main Course'),
        dining_garhwali_sweet_title: getValue('dining', 'dining_garhwali_sweet_title', 'Local Desserts'),
        dining_garhwali_elixirs_title: getValue('dining', 'dining_garhwali_elixirs_title', 'Purifying Elixirs'),
        
        dining_garhwali_thali_subtitle: getValue('dining', 'dining_garhwali_thali_subtitle', "Chef's Special Recommendation"),
        dining_garhwali_thali_title: getValue('dining', 'dining_garhwali_thali_title', "Traditional Himalayan Thali"),
        dining_garhwali_thali_image: getValue('dining', 'dining_garhwali_thali_image', "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800"),
        dining_garhwali_thali_ingredients_label: getValue('dining', 'dining_garhwali_thali_ingredients_label', "Farm-to-Table Ingredients"),
        dining_garhwali_thali_specials_label: getValue('dining', 'dining_garhwali_thali_specials_label', "Seasonal Specials"),
        dining_garhwali_thali_specials_desc: getValue('dining', 'dining_garhwali_thali_specials_desc', "Featuring slow-cooked Kandali Ka Saag, local festival recipes, and our chef's daily village-inspired menu."),
        dining_garhwali_thali_ingredients: (() => {
          let str = getValue('dining', 'dining_garhwali_thali_ingredients', '[]');
          let arr = [];
          try { arr = JSON.parse(str); } catch {}
          if (!arr || arr.length === 0) {
            arr = ["Mandua (Finger Millet)", "Jhangora (Barnyard Millet)", "Gahat (Horse Gram)", "Fresh Mountain Vegetables"];
          }
          return arr.join(', ');
        })()
      });
      try {
        const val = JSON.parse(getValue('dining', 'specialty_dishes', '[]'));
        setSpecialtyDishes(Array.isArray(val) && val.length > 0 ? val : DEFAULT_DINING_SPECIALTIES);
      } catch {
        setSpecialtyDishes(DEFAULT_DINING_SPECIALTIES);
      }
      try {
        const val = JSON.parse(getValue('dining', 'garhwali_dishes', '[]'));
        setGarhwaliDishes(Array.isArray(val) && val.length > 0 ? val : DEFAULT_GARHWALI_DISHES);
      } catch {
        setGarhwaliDishes(DEFAULT_GARHWALI_DISHES);
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
        weddings_heading: getValue('weddings', 'weddings_heading', 'The Great Himalayan Wedding'),
        weddings_subheading: getValue('weddings', 'weddings_subheading', 'Sacred Celebrations in the Himalayas'),
        weddings_image: getValue('weddings', 'weddings_image', ''),
        weddings_hero_badge: getValue('weddings', 'weddings_hero_badge', 'SACRED WEDDINGS & CELEBRATIONS'),
        weddings_hero_desc: getValue('weddings', 'weddings_hero_desc', ''),
        weddings_story_title: getValue('weddings', 'weddings_story_title', 'Mountain Wedding'),
        weddings_story_subtitle: getValue('weddings', 'weddings_story_subtitle', 'A quiet Himalayan ceremony'),
        weddings_story_desc: getValue('weddings', 'weddings_story_desc', ''),
        weddings_story_script: getValue('weddings', 'weddings_story_script', 'Himalayan Pure Blessings'),
        weddings_story_heading: getValue('weddings', 'weddings_story_heading', 'Small, Personal'),
        weddings_story_heading_italic: getValue('weddings', 'weddings_story_heading_italic', '&'),
        weddings_story_subheading: getValue('weddings', 'weddings_story_subheading', 'Unforgettable'),
        weddings_story_paragraph: getValue('weddings', 'weddings_story_paragraph', 'From beautiful pre-marriage morning rituals on our mountain-sky deodar terraces to customized wedding lawns set before a majestic valley backdrop, The Vedic Himalaya Retreat coordinates an exceptional blend of premium hospitality, local Garhwali flavor thalis, and pure mountain atmosphere.'),
        weddings_venues_tagline: getValue('weddings', 'weddings_venues_tagline', 'SACRED VENUE GRID'),
        weddings_venues_heading: getValue('weddings', 'weddings_venues_heading', 'Our Ceremony'),
        weddings_venues_heading_italic: getValue('weddings', 'weddings_venues_heading_italic', 'Spaces'),
        weddings_venues_desc: getValue('weddings', 'weddings_venues_desc', 'Choose from our hand-selected indoor and outdoor spaces, each featuring high altitude forest views and traditional wood hearth configurations.'),
        weddings_offerings_tagline: getValue('weddings', 'weddings_offerings_tagline', 'What We Offer'),
        weddings_offerings_heading: getValue('weddings', 'weddings_offerings_heading', 'Sacred'),
        weddings_offerings_heading_italic: getValue('weddings', 'weddings_offerings_heading_italic', 'Aesthetics'),
        weddings_offerings_desc: getValue('weddings', 'weddings_offerings_desc', 'Custom arrangements & local services'),
        weddings_gallery_tagline: getValue('weddings', 'weddings_gallery_tagline', 'PHOTO CAPTURES'),
        weddings_gallery_heading: getValue('weddings', 'weddings_gallery_heading', 'Celebration'),
        weddings_gallery_heading_italic: getValue('weddings', 'weddings_gallery_heading_italic', 'Aesthetics'),
        weddings_gallery_desc: getValue('weddings', 'weddings_gallery_desc', 'A cinematic visual registry of tables decorated exclusively with wild mountain blooms and wooden embers.'),
        weddings_cta_title: getValue('weddings', 'weddings_cta_title', 'Plan Your Destination Wedding'),
        weddings_cta_desc: getValue('weddings', 'weddings_cta_desc', 'Contact our reservations team to check availability, request packages, or discuss private buyouts for your guests.'),
        weddings_cta_bg_image: getValue('weddings', 'weddings_cta_bg_image', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1800'),
        weddings_cta_btn_text: getValue('weddings', 'weddings_cta_btn_text', 'Inquire for Packages'),
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
        const val = JSON.parse(getValue('weddings', 'weddings_gallery', '[]'));
        setWeddingsGallery(Array.isArray(val) && val.length > 0 ? val : DEFAULT_WEDDINGS_GALLERY);
      } catch {
        setWeddingsGallery(DEFAULT_WEDDINGS_GALLERY);
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
        experiences_cta_heading_italic: getValue('experiences', 'experiences_cta_heading_italic', 'Himalayan Stay'),
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
        nearby_cta_badge: getValue('nearby', 'nearby_cta_badge', 'A peaceful stay awaits you'),
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
        gallery_categories: getValue('gallery', 'gallery_categories', 'Mountain Views, Rooms & Suites, Sacred Spaces, Food & Dining, Forest Trails, Mist & Ridges'),
      });
      try {
        const val = JSON.parse(getValue('gallery', 'gallery_images', '[]'));
        setGalleryImages(Array.isArray(val) ? val : []);
      } catch {
        setGalleryImages([]);
      }
      try {
        const val = JSON.parse(getValue('home', 'bento_gallery_items', '[]'));
        setBentoGalleryItems(Array.isArray(val) && val.length > 0 ? val : DEFAULT_HOME_BENTO_GALLERY);
      } catch {
        setBentoGalleryItems(DEFAULT_HOME_BENTO_GALLERY);
      }
    } else if (activePageId === 'contact') {
      setFormFields({
        contact_heading: getValue('contact', 'contact_heading', 'Reach Out'),
        contact_subheading: getValue('contact', 'contact_subheading', 'Reservations & coordinates'),
        contact_image: getValue('contact', 'contact_image', ''),
        contact_email: getValue('contact', 'contact_email', 'stay@vedichimalayaretreat.com'),
        contact_map_pin: getValue('contact', 'contact_map_pin', 'Village Dewar, Guptkashi, Kedarnath Route, Uttarakhand 246439').replace('246495', '246439'),
        contact_badge: getValue('contact', 'contact_badge', 'REACH OUT TO US'),
        contact_italic_text: getValue('contact', 'contact_italic_text', 'Sacred Arrival'),
        contact_instagram: getValue('contact', 'contact_instagram', '@thevedichimalayaretreat'),
        contact_instagram_url: getValue('contact', 'contact_instagram_url', 'https://instagram.com/thevedichimalayaretreat'),
        contact_form_title: getValue('contact', 'contact_form_title', 'Send an Inquiry'),
      });
      try {
        const val = JSON.parse(getValue('contact', 'contact_faqs', '[]'));
        setContactFaqs(Array.isArray(val) && val.length > 0 ? val : DEFAULT_CONTACT_FAQS);
      } catch {
        setContactFaqs(DEFAULT_CONTACT_FAQS);
      }
    } else if (activePageId === 'booking') {
      setFormFields({
        booking_heading: getValue('booking', 'booking_heading', 'Reserve Your'),
        booking_heading_italic: getValue('booking', 'booking_heading_italic', 'Stay'),
        booking_badge: getValue('booking', 'booking_badge', 'Guaranteed room booking'),
        booking_subheading: getValue('booking', 'booking_subheading', 'Elevate your Himalayan ascent with a direct direct-booking premium rate.'),
      });
    } else if (['privacy', 'terms'].includes(activePageId)) {
      setFormFields({
        title: getValue(activePageId, `${activePageId}_title`, activePageId === 'privacy' ? 'Privacy Policy' : 'Terms of Stay'),
        content: getValue(activePageId, `${activePageId}_content`, '')
      });
    }
    // Allow a brief delay then enable change tracking
    setTimeout(() => { initialLoadRef.current = false; }, 300);
  }, [activePageId, contentLoading, content]);

  // Bulk Upload State & Methods
  const [isBulkUploading, setIsBulkUploading] = useState<string | null>(null);
  const [bulkUploadProgress, setBulkUploadProgress] = useState<{
    total: number;
    current: number;
    fileName: string;
  }>({ total: 0, current: 0, fileName: '' });

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetList: 'gallery' | 'experience' | 'nearby') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsBulkUploading(targetList);
    setBulkUploadProgress({
      total: files.length,
      current: 0,
      fileName: files[0].name,
    });
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      setBulkUploadProgress({
        total: files.length,
        current: i,
        fileName: file.name,
      });

      try {
        const result = await uploadImageDirect(file);
        if (result?.success && result.url) {
          successCount++;
          setHasUnsavedChanges(true);

          if (targetList === 'gallery') {
            setGalleryImages(prev => [
              ...prev,
              {
                src: result.url,
                category: 'Mountain Views',
                title: 'New Photo',
                desc: '',
                is_visible: true
              }
            ]);
          } else if (targetList === 'experience') {
            setExperiencePhotos(prev => [
              ...prev,
              {
                url: result.url,
                caption: 'New Scene',
                is_visible: true
              }
            ]);
          } else if (targetList === 'nearby') {
            setNearbyPhotos(prev => [
              ...prev,
              {
                url: result.url,
                caption: 'New Scene',
                is_visible: true
              }
            ]);
          }
        }
      } catch (err) {
        console.error("Bulk upload error:", err);
      }
    }

    setBulkUploadProgress(prev => ({
      ...prev,
      current: files.length,
      fileName: 'All uploads completed!',
    }));

    await new Promise(resolve => setTimeout(resolve, 800));

    setIsBulkUploading(null);
    setBulkUploadProgress({ total: 0, current: 0, fileName: '' });
    toast.success(`Successfully uploaded ${successCount} files to the collection!`);
  };

  // Unified Save Method
  // Warn on page switch with unsaved changes
  const handlePageSwitch = useCallback((newPageId: string) => {
    if (hasUnsavedChanges) {
      const confirmed = confirm('You have unsaved changes. Switch pages without saving?');
      if (!confirmed) return;
    }
    setHasUnsavedChanges(false);
    initialLoadRef.current = true;
    setActivePageId(newPageId);
  }, [hasUnsavedChanges]);

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
      updates.push({ section: 'dining', key: 'garhwali_dishes', value: JSON.stringify(garhwaliDishes) });
      updates.push({ section: 'dining', key: 'kitchen_alchemies', value: JSON.stringify(alchemies) });
      updates.push({ section: 'dining', key: 'dining_polaroids', value: JSON.stringify(diningPolaroids) });
      updates.push({ section: 'dining', key: 'daily_rituals', value: JSON.stringify(dailyRituals) });
      updates.push({ section: 'dining', key: 'dining_vows', value: JSON.stringify(diningVows) });
      
      let thaliIngsStr = formFields.dining_garhwali_thali_ingredients || '';
      let thaliIngsArr = thaliIngsStr.split(',').map((s: string) => s.trim()).filter(Boolean);
      const existingIdx = updates.findIndex(u => u.section === 'dining' && u.key === 'dining_garhwali_thali_ingredients');
      if (existingIdx !== -1) {
        updates[existingIdx].value = JSON.stringify(thaliIngsArr);
      } else {
        updates.push({ section: 'dining', key: 'dining_garhwali_thali_ingredients', value: JSON.stringify(thaliIngsArr) });
      }
    } else if (activePageId === 'weddings') {
      updates.push({ section: 'weddings', key: 'weddings_polaroids', value: JSON.stringify(weddingPolaroids) });
      updates.push({ section: 'weddings', key: 'weddings_gallery', value: JSON.stringify(weddingsGallery) });
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
      updates.push({ section: 'home', key: 'bento_gallery_items', value: JSON.stringify(bentoGalleryItems) });
    } else if (activePageId === 'contact') {
      updates.push({ section: 'contact', key: 'contact_faqs', value: JSON.stringify(contactFaqs) });
    }

    const r = await updateMultipleContent(updates);
    setIsSaving(null);
    if (r.success) {
      setHasUnsavedChanges(false);
      toast.success(`${PAGES_LIST.find(p => p.id === activePageId)?.label} saved successfully!`);
    } else {
      toast.error('Failed to save page contents. Check database connection.');
    }
  };

  const isLoading = contentLoading || zonesLoading;

  return (
    <div className="space-y-6 text-[#E2E8F0] min-h-screen relative">
      {/* Fixed Top-Level Navigation Bar */}
      <div className="fixed top-14 lg:top-0 left-0 lg:left-[260px] right-0 z-45 bg-[#060B0A]/95 backdrop-blur-md border-b border-[#1C2E2A]/50 py-4 px-6 shadow-md transition-all duration-300">
        <div className="grid grid-cols-6 gap-x-2 sm:gap-x-4 gap-y-3.5 max-w-6xl mx-auto text-center justify-items-center">
          {PAGES_LIST.map((page) => {
            const isActive = activePageId === page.id;
            return (
              <button
                key={page.id}
                onClick={() => handlePageSwitch(page.id)}
                className={`relative whitespace-nowrap text-[11px] uppercase font-bold tracking-widest transition-all duration-300 cursor-pointer pb-1.5 ${
                  isActive
                    ? 'text-[#C4A665] scale-105 font-extrabold'
                    : 'text-[#8E9F96] hover:text-[#FAF9F5] active:scale-95'
                }`}
              >
                {page.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C4A665] rounded-full shadow-sm shadow-[#C4A665]/50" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Spacer to push down content so it's not hidden under the fixed nav bar */}
      <div className="h-[120px] sm:h-[110px] lg:h-[100px] w-full" />

      <div className="border-l-4 border-[#C4A665] pl-5 py-0.5 text-left">
        <h1 className="text-2xl md:text-3xl font-heading font-medium text-[#F8FAFC]">PAGE EDITOR</h1>
        <p className="text-[#8E9F96] text-xs mt-1">Refine each section layout, cards, and copy to match the user journey.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#C4A665]" />
        </div>
      ) : (
        <>
        <div className="w-full space-y-6">
          <div className="bg-[#0D1412] border border-[#1C2E2A] rounded-2xl overflow-hidden shadow-none pb-20">
              <div className="p-5 border-b border-[#1C2E2A] flex items-center justify-between bg-[#0D1412]/50">
                <div className="flex items-center gap-3">
                  <h2 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                    {PAGES_LIST.find(p => p.id === activePageId)?.label} Contents
                  </h2>
                  {hasUnsavedChanges && (
                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      UNSAVED
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSavePage}
                  disabled={isSaving !== null}
                  className={`flex items-center gap-2 px-5 py-2.5 font-extrabold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 uppercase tracking-wider border ${
                    hasUnsavedChanges
                      ? 'bg-gradient-to-r from-[#C4A665] to-[#E2C58A] text-black border-[#C4A665]/30 shadow-lg shadow-[#C4A665]/20 hover:shadow-xl hover:shadow-[#C4A665]/30 hover:from-[#FAF9F5] hover:to-[#FAF9F5]'
                      : 'bg-[#1C2E2A] text-[#8E9F96] border-[#1C2E2A] hover:bg-[#C4A665] hover:text-black'
                  }`}
                >
                  {isSaving !== null ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {hasUnsavedChanges ? 'SAVE CHANGES' : 'ALL SAVED ✓'}
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
                            
                            <div className="overflow-hidden w-full select-none relative">
                              <div className="animate-marquee gap-12 md:gap-16 items-center">
                                {Array(2).fill(null).map((_, groupIndex) => (
                                  <div 
                                    key={groupIndex} 
                                    className="flex items-center gap-12 md:gap-16 font-heading uppercase tracking-[0.1em] text-lg md:text-2xl text-[#2D3E35] font-medium"
                                  >
                                    {marqueeSlogans.map((item, i) => (
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
                          title="Bento Grid Images (Exactly 6 items)"
                          items={bentoGalleryItems}
                          onChange={setBentoGalleryItems}
                          createDefaultItem={() => ({ image: '', title: 'Visual Photo', category: 'Mountain Views', is_visible: true })}
                          getItemLabel={(item) => item.title}
                          getItemImage={(item) => item.image}
                          renderItemEditor={(item, idx, updateField) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                              <div className="space-y-4">
                                <TextInputGroup label="Photo Description/Caption" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                                <div className="text-left w-full">
                                  <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Category Group</label>
                                  <select value={item.category || 'Mountain Views'} onChange={(e) => updateField('category', e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665]">
                                    <option value="Mountain Views" className="bg-[#0D1412]">Mountain Views</option>
                                    <option value="Rooms & Suites" className="bg-[#0D1412]">Rooms & Suites</option>
                                    <option value="Sacred Spaces" className="bg-[#0D1412]">Sacred Spaces</option>
                                    <option value="Food & Dining" className="bg-[#0D1412]">Food & Dining</option>
                                    <option value="Forest Trails" className="bg-[#0D1412]">Forest Trails</option>
                                    <option value="Mist & Ridges" className="bg-[#0D1412]">Mist & Ridges</option>
                                  </select>
                                </div>
                              </div>
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
                          createDefaultItem={() => ({ name: 'New Pilgrim', date: 'May 2026', rating: 5, state: 'State', text: 'Beautiful mountain stay...', approved: true })}
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

                    <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                      <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">Second Cinematic Visual</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                          <TextInputGroup label="Location Text" icon={Type} value={formFields.about_second_image_location || ''} onChange={(v) => setFormFields((prev: any) => ({ ...prev, about_second_image_location: v }))} />
                          <TextInputGroup label="Visual Title" icon={Type} value={formFields.about_second_image_title || ''} onChange={(v) => setFormFields((prev: any) => ({ ...prev, about_second_image_title: v }))} />
                        </div>
                        <ImageUploader label="Second Visual Image" currentImage={formFields.about_second_image || ''} onImageChange={(p) => setFormFields((prev: any) => ({ ...prev, about_second_image: p }))} aspectRatio="aspect-video w-full" />
                      </div>
                    </div>

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

                    <SectionToggle
                      label="Taste of Garhwal Menu Section"
                      checked={visibilities.dining_garhwali_visible}
                      onChange={(v) => setVisibilities((prev: any) => ({ ...prev, dining_garhwali_visible: v }))}
                      description="Toggle the main unified regional Garhwali cuisine and public dining menu"
                    />
                    {visibilities.dining_garhwali_visible && (
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                          <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">Taste of Garhwal Menu Headings</div>
                          <TextInputGroup label="Menu Tagline" icon={Type} value={formFields.dining_menu_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_menu_tagline: v }))} />
                          <div className="grid grid-cols-2 gap-4">
                            <TextInputGroup label="Menu Heading 1" icon={Type} value={formFields.dining_menu_heading1} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_menu_heading1: v }))} />
                            <TextInputGroup label="Menu Heading 2 (Italic)" icon={Type} value={formFields.dining_menu_heading2} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_menu_heading2: v }))} />
                          </div>
                          <TextAreaGroup label="Menu Description" value={formFields.dining_menu_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_menu_desc: v }))} rows={2} />
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                          <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">Category Tab Titles (Frontend Labels)</div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <TextInputGroup label="Himalayan Breakfast Tab" icon={Type} value={formFields.dining_garhwali_breakfast_title} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_garhwali_breakfast_title: v }))} />
                            <TextInputGroup label="Garhwali Signatures Tab" icon={Type} value={formFields.dining_garhwali_signature_title} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_garhwali_signature_title: v }))} />
                            <TextInputGroup label="Grains & Stews Tab" icon={Type} value={formFields.dining_garhwali_grains_stews_title} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_garhwali_grains_stews_title: v }))} />
                            <TextInputGroup label="Main Course Tab" icon={Type} value={formFields.dining_garhwali_main_title} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_garhwali_main_title: v }))} />
                            <TextInputGroup label="Local Desserts Tab" icon={Type} value={formFields.dining_garhwali_sweet_title} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_garhwali_sweet_title: v }))} />
                            <TextInputGroup label="Purifying Elixirs Tab" icon={Type} value={formFields.dining_garhwali_elixirs_title} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_garhwali_elixirs_title: v }))} />
                          </div>
                        </div>

                        <ListEditor
                          title="Taste of Garhwal Dishes Catalog"
                          items={garhwaliDishes}
                          onChange={setGarhwaliDishes}
                          createDefaultItem={() => ({ name: 'New Dish', desc: 'Description', category: 'signature', price: 0, tag: 'Garhwali', origin: 'Garhwal Highlands', is_visible: true })}
                          getItemLabel={(item) => `${item.name} (${item.category})`}
                          renderItemEditor={(item, idx, updateField) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                              <TextInputGroup label="Dish Name" icon={Type} value={item.name} onChange={(v) => updateField('name', v)} />
                              <div className="text-left w-full">
                                <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Category Tab</label>
                                <select value={item.category || 'signature'} onChange={(e) => updateField('category', e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665]">
                                  <option value="breakfast" className="bg-[#0D1412]">Himalayan Breakfast</option>
                                  <option value="signature" className="bg-[#0D1412]">Garhwali Signatures</option>
                                  <option value="grains-stews" className="bg-[#0D1412]">Grains & Claypot Stews</option>
                                  <option value="main" className="bg-[#0D1412]">Main Course</option>
                                  <option value="sweet" className="bg-[#0D1412]">Local Desserts</option>
                                  <option value="elixirs" className="bg-[#0D1412]">Purifying Elixirs & Beverages</option>
                                </select>
                              </div>
                              <TextAreaGroup label="Description" value={item.desc} onChange={(v) => updateField('desc', v)} />
                              <div className="space-y-4">
                                <TextInputGroup label="Tag (e.g. Sattvik, High Protein)" icon={Sparkles} value={item.tag} onChange={(v) => updateField('tag', v)} />
                                <TextInputGroup label="Origin (e.g. High Ridge Farms)" icon={MapPin} value={item.origin} onChange={(v) => updateField('origin', v)} />
                              </div>
                            </div>
                          )}
                          onSave={handleSavePage}
                          isSaving={isSaving !== null}
                        />

                        {/* Chef's Special Thali Showcase Card Editor */}
                        <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                          <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">Thali Recommendation Card (Right Showcase)</div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-4">
                              <TextInputGroup label="Thali Subtitle Tag" icon={Type} value={formFields.dining_garhwali_thali_subtitle} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_garhwali_thali_subtitle: v }))} />
                              <TextInputGroup label="Thali Card Title" icon={Type} value={formFields.dining_garhwali_thali_title} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_garhwali_thali_title: v }))} />
                              <TextInputGroup label="Ingredients Label" icon={Type} value={formFields.dining_garhwali_thali_ingredients_label} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_garhwali_thali_ingredients_label: v }))} />
                              <TextInputGroup label="Ingredients List (Comma separated)" icon={Tag} value={formFields.dining_garhwali_thali_ingredients} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_garhwali_thali_ingredients: v }))} />
                              <div className="grid grid-cols-2 gap-4">
                                <TextInputGroup label="Specials Label" icon={Type} value={formFields.dining_garhwali_thali_specials_label} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_garhwali_thali_specials_label: v }))} />
                                <TextInputGroup label="Specials Description text" icon={Type} value={formFields.dining_garhwali_thali_specials_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, dining_garhwali_thali_specials_desc: v }))} />
                              </div>
                            </div>
                            <div className="flex flex-col justify-start">
                              <ImageUploader 
                                label="Thali Photo Image" 
                                currentImage={formFields.dining_garhwali_thali_image} 
                                onImageChange={(p) => setFormFields((prev: any) => ({ ...prev, dining_garhwali_thali_image: p }))} 
                                aspectRatio="aspect-[4/3] w-full" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

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

                    <SectionToggle label="Weddings Gallery Section" checked={visibilities.weddings_gallery_visible} onChange={(v) => setVisibilities((prev: any) => ({ ...prev, weddings_gallery_visible: v }))} />
                    {visibilities.weddings_gallery_visible && (
                      <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                        <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">Gallery Section Headings</div>
                        <TextInputGroup label="Gallery Tagline" icon={Type} value={formFields.weddings_gallery_tagline} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_gallery_tagline: v }))} />
                        <div className="grid grid-cols-2 gap-4">
                          <TextInputGroup label="Gallery Heading" icon={Type} value={formFields.weddings_gallery_heading} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_gallery_heading: v }))} />
                          <TextInputGroup label="Gallery Heading (Italic)" icon={Type} value={formFields.weddings_gallery_heading_italic} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_gallery_heading_italic: v }))} />
                        </div>
                        <TextAreaGroup label="Gallery Description" value={formFields.weddings_gallery_desc} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_gallery_desc: v }))} rows={2} />

                        <ListEditor
                          title="Wedding Bento Grid Images"
                          items={weddingsGallery}
                          onChange={setWeddingsGallery}
                          createDefaultItem={() => ({ image: '', title: 'Visual Photo', category: 'CANOPY VOWS', is_visible: true })}
                          getItemLabel={(item) => item.title}
                          getItemImage={(item) => item.image}
                          renderItemEditor={(item, idx, updateField) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                              <div className="space-y-4">
                                <TextInputGroup label="Photo Title/Description" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                                <TextInputGroup label="Category Group" icon={Tag} value={item.category} onChange={(v) => updateField('category', v)} />
                              </div>
                              <ImageUploader label="Image" currentImage={item.image} onImageChange={(p) => updateField('image', p)} aspectRatio="aspect-[4/3] w-full" />
                            </div>
                          )}
                          onSave={handleSavePage}
                          isSaving={isSaving !== null}
                        />
                      </div>
                    )}

                    <div className="p-4 bg-white/5 rounded-xl border border-[#1C2E2A] space-y-4">
                      <div className="text-xs font-bold text-[#C4A665] uppercase tracking-wider mb-2">Bottom CTA Section</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                          <TextInputGroup label="CTA Title" icon={Type} value={formFields.weddings_cta_title || ''} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_cta_title: v }))} />
                          <TextAreaGroup label="CTA Description" value={formFields.weddings_cta_desc || ''} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_cta_desc: v }))} rows={2} />
                          <div className="grid grid-cols-2 gap-4">
                            <TextInputGroup label="CTA Button Text" icon={Type} value={formFields.weddings_cta_btn_text} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_cta_btn_text: v }))} />
                            <TextInputGroup label="CTA Button Link" icon={LinkIcon} value={formFields.weddings_cta_btn_link} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_cta_btn_link: v }))} />
                          </div>
                          <TextInputGroup label="Footnote Text" icon={Type} value={formFields.weddings_cta_footnote} onChange={(v) => setFormFields((prev: any) => ({ ...prev, weddings_cta_footnote: v }))} />
                        </div>
                        <div className="flex flex-col justify-start">
                          <ImageUploader 
                            label="CTA Background Image" 
                            currentImage={formFields.weddings_cta_bg_image || ''} 
                            onImageChange={(p) => setFormFields((prev: any) => ({ ...prev, weddings_cta_bg_image: p }))} 
                            aspectRatio="aspect-video w-full" 
                          />
                        </div>
                      </div>
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

                        {isBulkUploading === 'experience' && bulkUploadProgress.total > 0 && (
                          <div className="bg-[#0D1412] border border-[#1C2E2A] rounded-xl p-4 space-y-2.5 text-left">
                            <div className="flex items-center justify-between text-xs text-[#E2E8F0] font-medium">
                              <span className="flex items-center gap-1.5 text-[#C4A665]">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                {bulkUploadProgress.current === bulkUploadProgress.total ? 'Wrapping up uploads...' : `Uploading image ${bulkUploadProgress.current + 1} of ${bulkUploadProgress.total}...`}
                              </span>
                              <span className="font-mono text-[#8E9F96]">{Math.round((bulkUploadProgress.current / bulkUploadProgress.total) * 100)}%</span>
                            </div>
                            <div className="w-full bg-[#1A2E2A] rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-[#C4A665] h-1.5 rounded-full transition-all duration-300" 
                                style={{ width: `${(bulkUploadProgress.current / bulkUploadProgress.total) * 100}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-[#8E9F96] truncate">
                              Current: {bulkUploadProgress.fileName}
                            </div>
                          </div>
                        )}

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

                        {isBulkUploading === 'nearby' && bulkUploadProgress.total > 0 && (
                          <div className="bg-[#0D1412] border border-[#1C2E2A] rounded-xl p-4 space-y-2.5 text-left">
                            <div className="flex items-center justify-between text-xs text-[#E2E8F0] font-medium">
                              <span className="flex items-center gap-1.5 text-[#C4A665]">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                {bulkUploadProgress.current === bulkUploadProgress.total ? 'Wrapping up uploads...' : `Uploading image ${bulkUploadProgress.current + 1} of ${bulkUploadProgress.total}...`}
                              </span>
                              <span className="font-mono text-[#8E9F96]">{Math.round((bulkUploadProgress.current / bulkUploadProgress.total) * 100)}%</span>
                            </div>
                            <div className="w-full bg-[#1A2E2A] rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-[#C4A665] h-1.5 rounded-full transition-all duration-300" 
                                style={{ width: `${(bulkUploadProgress.current / bulkUploadProgress.total) * 100}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-[#8E9F96] truncate">
                              Current: {bulkUploadProgress.fileName}
                            </div>
                          </div>
                        )}

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

                    {isBulkUploading === 'gallery' && bulkUploadProgress.total > 0 && (
                      <div className="bg-[#0D1412] border border-[#1C2E2A] rounded-xl p-4 space-y-2.5 text-left">
                        <div className="flex items-center justify-between text-xs text-[#E2E8F0] font-medium">
                          <span className="flex items-center gap-1.5 text-[#C4A665]">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            {bulkUploadProgress.current === bulkUploadProgress.total ? 'Wrapping up uploads...' : `Uploading image ${bulkUploadProgress.current + 1} of ${bulkUploadProgress.total}...`}
                          </span>
                          <span className="font-mono text-[#8E9F96]">{Math.round((bulkUploadProgress.current / bulkUploadProgress.total) * 100)}%</span>
                        </div>
                        <div className="w-full bg-[#1A2E2A] rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-[#C4A665] h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${(bulkUploadProgress.current / bulkUploadProgress.total) * 100}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-[#8E9F96] truncate">
                          Current: {bulkUploadProgress.fileName}
                        </div>
                      </div>
                    )}

                    <ListEditor
                      title="Bento Masonry Gallery Images"
                      items={galleryImages}
                      onChange={setGalleryImages}
                      createDefaultItem={() => ({ src: '', category: 'Mountain Views', title: 'New Photo', desc: 'Description...', is_visible: true })}
                      getItemLabel={(item) => item.title}
                      getItemImage={(item) => item.src}
                      renderItemEditor={(item, idx, updateField) => (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                          <div className="space-y-4">
                            <TextInputGroup label="Title" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                            <TextInputGroup label="Description" icon={Type} value={item.desc} onChange={(v) => updateField('desc', v)} />
                            <div className="text-left w-full">
                              <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Category Group</label>
                              <select value={item.category || 'Mountain Views'} onChange={(e) => updateField('category', e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665]">
                                {(formFields.gallery_categories || "Mountain Views, Rooms & Suites, Sacred Spaces, Food & Dining, Forest Trails, Mist & Ridges").split(',').map((c: string) => c.trim()).filter(Boolean).map((c: string) => (
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

                    <ListEditor
                      title="Synced Home Page Bento Images"
                      items={bentoGalleryItems}
                      onChange={setBentoGalleryItems}
                      createDefaultItem={() => ({ image: '', title: 'Visual Photo', category: 'Mountain Views', is_visible: true })}
                      getItemLabel={(item) => item.title}
                      getItemImage={(item) => item.image}
                      renderItemEditor={(item, idx, updateField) => (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                          <div className="space-y-4">
                            <TextInputGroup label="Photo Description/Caption" icon={Type} value={item.title} onChange={(v) => updateField('title', v)} />
                            <div className="text-left w-full">
                              <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Category Group</label>
                              <select value={item.category || 'Mountain Views'} onChange={(e) => updateField('category', e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665]">
                                <option value="Mountain Views" className="bg-[#0D1412]">Mountain Views</option>
                                <option value="Rooms & Suites" className="bg-[#0D1412]">Rooms & Suites</option>
                                <option value="Sacred Spaces" className="bg-[#0D1412]">Sacred Spaces</option>
                                <option value="Food & Dining" className="bg-[#0D1412]">Food & Dining</option>
                                <option value="Forest Trails" className="bg-[#0D1412]">Forest Trails</option>
                                <option value="Mist & Ridges" className="bg-[#0D1412]">Mist & Ridges</option>
                              </select>
                            </div>
                          </div>
                          <ImageUploader label="Visual Image" currentImage={item.image} onImageChange={(p) => updateField('image', p)} aspectRatio="aspect-video w-full" />
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

                    <ListEditor
                      title="Contact Page FAQs"
                      items={contactFaqs}
                      onChange={setContactFaqs}
                      createDefaultItem={() => ({ question: 'New Question?', answer: 'Answer here.', is_visible: true })}
                      getItemLabel={(item) => item.question}
                      renderItemEditor={(item, idx, updateField) => (
                        <div className="space-y-4 text-left">
                          <TextInputGroup label="FAQ Question" icon={Type} value={item.question} onChange={(v) => updateField('question', v)} />
                          <TextAreaGroup label="FAQ Answer" value={item.answer} onChange={(v) => updateField('answer', v)} rows={3} />
                        </div>
                      )}
                      onSave={handleSavePage}
                      isSaving={isSaving !== null}
                    />

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

          {/* Floating persistent save bar */}
          <FloatingSaveBar
            onSave={handleSavePage}
            isSaving={isSaving !== null}
            hasChanges={hasUnsavedChanges}
            pageLabel={PAGES_LIST.find(p => p.id === activePageId)?.label || 'Page'}
          />
        </>
        )}
      </div>
  );
}
