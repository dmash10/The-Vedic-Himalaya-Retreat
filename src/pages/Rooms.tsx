import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  ArrowLeft, Bed, Fan, Tv, Bath, Wifi, Coffee, Sparkles, 
  ShieldCheck, Star, Check, Calendar, Users, Lock, 
  CheckCircle2, ArrowRight, ChevronLeft, ChevronRight, X, MessageSquare,
  Flame, Compass, Utensils, Mountain, Info
} from "lucide-react";
import { useRooms } from "@/hooks/useRooms";
import { useContent } from "@/hooks/useContent";
import PageLoader from "@/components/PageLoader";

// Integrated Brand Logos for high psychological trust
const GoogleLogo = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

const TripAdvisorLogo = () => (
  <svg className="w-4.5 h-4.5 text-[#00AF87] shrink-0" viewBox="0 0 50 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M 25 11 C 19.167969 11 13.84375 12.511719 9.789063 15 L 2 15 C 2 15 3.753906 17.152344 4.578125 19.578125 C 2.96875 21.621094 2 24.195313 2 27 C 2 33.628906 7.371094 39 14 39 C 17.496094 39 20.636719 37.492188 22.828125 35.105469 L 25 38 L 27.171875 35.105469 C 29.363281 37.492188 32.503906 39 36 39 C 42.628906 39 48 33.628906 48 27 C 48 24.195313 47.03125 21.621094 45.421875 19.578125 C 46.246094 17.152344 48 15 48 15 L 40.203125 15 C 36.148438 12.511719 30.828125 11 25 11 Z M 14 18 C 18.972656 18 23 22.027344 23 27 C 23 31.972656 18.972656 36 14 36 C 9.027344 36 5 31.972656 5 27 C 5 22.027344 9.027344 18 14 18 Z M 36 18 C 40.972656 18 45 22.027344 45 27 C 45 31.972656 40.972656 36 36 36 C 31.027344 36 27 31.972656 27 27 C 27 22.027344 31.027344 18 36 18 Z M 14 21 C 10.6875 21 8 23.6875 8 27 C 8 30.3125 10.6875 33 14 33 C 17.3125 33 20 30.3125 20 27 C 20 23.6875 17.3125 21 14 21 Z M 36 21 C 32.6875 21 30 23.6875 30 27 C 30 30.3125 32.6875 33 36 33 C 39.3125 33 42 30.3125 42 27 C 42 23.6875 39.3125 21 36 21 Z M 14 23 C 16.210938 23 18 24.789063 18 27 C 18 29.210938 16.210938 31 14 31 C 11.789063 31 10 29.210938 10 27 C 10 24.789063 11.789063 23 14 23 Z M 36 23 C 38.210938 23 40 24.789063 40 27 C 40 29.210938 38.210938 31 36 31 C 33.789063 31 32 29.210938 32 27 C 32 24.789063 33.789063 23 36 23 Z M 14 25 C 12.894531 25 12 25.894531 12 27 C 12 28.105469 12.894531 29 14 29 C 15.105469 29 16 28.105469 16 27 C 16 25.894531 15.105469 25 14 25 Z M 36 25 C 34.894531 25 34 25.894531 34 27 C 34 28.105469 34.894531 29 36 29 C 37.105469 29 38 28.105469 38 27 C 38 25.894531 37.105469 25 36 25 Z" />
  </svg>
);

export default function Rooms() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedRoomId = searchParams.get("room");

  const { rooms: dbRooms, loading } = useRooms();
  const { getValue, loading: contentLoading, content } = useContent();

  const roomsHeading = getValue('rooms', 'rooms_heading', 'Sanctuary Suites');
  const roomsSubheading = getValue('rooms', 'rooms_subheading', 'Luxury Mountain Lodging');
  const roomsNotice = getValue('rooms', 'rooms_notice', 'Important Booking Notice...');
  const noticeVisible = getValue('rooms', 'notice_visible', 'true') !== 'false';
  const roomsHeroVisible = getValue('rooms', 'rooms_hero_visible', 'true') !== 'false';

  const getIconComponent = (iconName: any) => {
    if (!iconName) return Bed;
    if (typeof iconName !== 'string') return iconName;
    const map: { [key: string]: any } = {
      Bed, Fan, Tv, Bath, Wifi, Coffee, Sparkles, ShieldCheck, Star, Check, Calendar, Users, Lock, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight, X, MessageSquare, Flame, Compass, Utensils, Mountain, Info
    };
    return map[iconName] || Bed;
  };

  const cmsAmenities = useMemo(() => {
    let list = [];
    try {
      list = JSON.parse(getValue('rooms', 'rooms_amenities', '[]'));
    } catch (e) {}
    if (!list || list.length === 0) {
      list = [
        { label: "2 Double Beds", icon: "Bed", desc: "Two pristine premium double-sized mattresses with finest linens and duvets" },
        { label: "Whisper Cool Fan", icon: "Fan", desc: "High-capacity whisper silent designer cooling and ventilation fan" },
        { label: "Spa Slate Bath", icon: "Bath", desc: "Luxury slate bathroom equipped with geyser and hot rain shower" },
        { label: "Smart Sound Hub", icon: "Tv", desc: "Massive 55\" cinematic display with premium room audio" },
        { label: "Ultimate Fiber", icon: "Wifi", desc: "Ultra performance high-speed complimentary internet" },
        { label: "Hot Beverage Station", icon: "Coffee", desc: "Exquisite electric hot beverage server and regional herbal tea blends" }
      ];
    }
    return list;
  }, [content]);

  const cmsReviews = useMemo(() => {
    let list = [];
    try {
      list = JSON.parse(getValue('rooms', 'rooms_reviews', '[]'));
    } catch (e) {}
    if (!list || list.length === 0) {
      list = [
        { name: "Suresh Patel", rating: 5, location: "Ahmedabad", date: "May 25, 2024", text: "Outstanding quality. Beautiful rich pine wood ceilings, spacious layouts, and a truly majestic feel. We felt pampered every minute.", source: "google" },
        { name: "Kuldeep Rana", rating: 4, location: "Haryana", date: "May 22, 2022", text: "Good hotel for the price. Rooms are spacious but the WiFi was slow. Location is perfect - away from Guptkashi's crowded market. Would have given 5 stars if breakfast timing was earlier.", source: "google" },
        { name: "Pooja Hegde", rating: 5, location: "Hyderabad", date: "May 10, 2024", text: "The grand master room did not disappoint. Clean, massive, stunning window scenes, and excellent staff service. Perfect 10/10.", source: "tripadvisor" },
        { name: "Rajiv Singhal", rating: 5, location: "Noida", date: "Jan 2024", text: "Outstanding spaciousness for the entire family. Heated blankets and gorgeous layout.", source: "google" }
      ];
    }
    return list.filter((r: any) => r.is_visible !== false);
  }, [content]);

  const rooms = useMemo(() => {
    if (!dbRooms || dbRooms.length === 0) return [];
    return dbRooms.filter((r: any) => r.is_visible !== false).map((r: any) => {
      const isPinewood = r.slug === 'pinewood-family-suite' || r.slug === 'pinewood-suite';
      return {
        id: r.slug || r.id,
        title: r.name,
        badge: isPinewood ? "Signature Reserve" : "Premium Suite",
        price: r.real_price || 11500,
        fake_price: r.fake_price || 15000,
        description: r.description || "Himalayan luxury Suite wreathed in pines.",
        images: [
          r.card_image_url || "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200",
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000",
          "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80&w=1000",
          "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800"
        ],
        amenities: cmsAmenities.map((a: any) => ({
          label: a.label,
          icon: getIconComponent(a.icon),
          desc: a.desc
        })),
        reviews: cmsReviews
      };
    });
  }, [dbRooms, cmsAmenities, cmsReviews]);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0] || null;
  const [activeImage, setActiveImage] = useState("");
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);
  const [isReviewExpanded, setIsReviewExpanded] = useState(false);

  // Update chosen photo on load
  useEffect(() => {
    if (selectedRoom && selectedRoom.images && selectedRoom.images.length > 0) {
      setActiveImage(selectedRoom.images[0]);
      setCurrentReviewIdx(0);
      setIsReviewExpanded(false);
    }
  }, [selectedRoom]);

  // Booking states
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState("2 Guests");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [bookingStep, setBookingStep] = useState<"idle" | "loading" | "success">("idle");
  const [loadingText, setLoadingText] = useState("");
  const [generatedTicket, setGeneratedTicket] = useState<any>(null);
  const [selectedReviewForModal, setSelectedReviewForModal] = useState<any>(null);
  
  // Custom interactive booking enhancements
  const [addSpecialPooja, setAddSpecialPooja] = useState(false);
  const [addCompulsoryBreakfast, setAddCompulsoryBreakfast] = useState(true);
  const [viewersCount, setViewersCount] = useState(3);

  // Dynamic realistic viewers simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setViewersCount(() => {
        return Math.floor(Math.random() * 4) + 1; // randomly choose 1, 2, 3, or 4
      });
    }, 4000 + Math.random() * 2000); // randomize update interval
    return () => clearInterval(interval);
  }, []);

  // Auto scroll to top on detail mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedRoomId]);

  const easePremium = [0.22, 1, 0.36, 1] as const;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || !guestName || !guestEmail || !guestPhone) {
      alert("Please fill in your name, email, phone number, and both check-in/checkout dates.");
      return;
    }

    setBookingStep("loading");
    
    const phases = [
      "Verifying seasonal calendar room spaces...",
      "Reserving holding keys in our ledger...",
      "Activating direct-booking harvest perks...",
      "Drafting secure confirmation e-ticket..."
    ];

    let currentPhase = 0;
    setLoadingText(phases[0]);

    const interval = setInterval(() => {
      currentPhase++;
      if (currentPhase < phases.length) {
        setLoadingText(phases[currentPhase]);
      } else {
        clearInterval(interval);
        const d1 = new Date(checkIn);
        const d2 = new Date(checkOut);
        const timeDiff = Math.abs(d2.getTime() - d1.getTime());
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;
        
        const baseCost = (selectedRoom?.price || 0) * nights;
        const guestsNum = parseInt(guestCount) || 1;
        const poojaCost = addSpecialPooja ? 2500 : 0;
        const breakfastCost = addCompulsoryBreakfast ? 350 * guestsNum * nights : 0;
        const finalCalculatedTotal = baseCost + poojaCost + breakfastCost; // discount is subtracted visually
        
        const ticket = {
          id: `KED-${Math.floor(100000 + Math.random() * 900000)}`,
          roomTitle: selectedRoom?.title,
          checkIn,
          checkOut,
          guests: guestCount,
          nights,
          total: finalCalculatedTotal,
          guestName,
          guestEmail,
          guestPhone,
          addSpecialPooja,
          addCompulsoryBreakfast,
          status: "Pending",
          createdAt: new Date().toISOString()
        };

        const existingBookingsStr = localStorage.getItem("adminBookings");
        const existingBookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
        existingBookings.unshift(ticket);
        localStorage.setItem("adminBookings", JSON.stringify(existingBookings));

        setGeneratedTicket(ticket);
        setBookingStep("success");
      }
    }, 950);
  };

  const handleReset = () => {
    setBookingStep("idle");
    setCheckIn("");
    setCheckOut("");
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
    setGeneratedTicket(null);
    setAddSpecialPooja(false);
    setAddCompulsoryBreakfast(true);
  };

  // Prevent flash of fallback text while CMS content loads
  if (contentLoading && content.length === 0) return <PageLoader />;

  if (loading) return <PageLoader />;

  return (
    <div className="bg-[#FAF9F5] text-rock-900 pt-28 pb-24 min-h-screen font-sans selection:bg-pine-800 selection:text-white">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        <AnimatePresence mode="wait">
          {selectedRoom ? (
            /* VIEW 1: PREMIUM SINGLE ROOM DETAIL VIEW */
            <motion.div
              key="room-detail"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: easePremium }}
              className="max-w-6xl mx-auto"
            >
              
              {/* Minimalistic Navigation Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200/60">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-pine-700 hover:text-pine-900 transition-colors duration-300 cursor-pointer group"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
                  Back to Overview
                </Link>

                <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                  <span>Guptkashi Retreat</span>
                  <span>/</span>
                  <span className="text-pine-900 font-bold">{selectedRoom.title}</span>
                </div>
              </div>

              {/* Title Section */}
              <div className="mb-8">
                <div className="flex flex-nowrap items-center gap-2 mb-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
                  <span className="text-[10px] tracking-[0.2em] font-extrabold uppercase text-pine-800 bg-pine-100/50 px-3 py-1 rounded-full border border-pine-200/20 whitespace-nowrap shrink-0">
                    ★ {selectedRoom.badge} Selection
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/20 shadow-xs whitespace-nowrap shrink-0">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span>4.9 Index Rating</span>
                  </div>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading tracking-tight text-rock-900 font-normal leading-tight">
                  {selectedRoom.title}
                </h1>
              </div>

              {/* Layout Content Segment */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10 items-start">
                
                {/* LEFT COLUMN: Photo Gallery, Specs, Narrative & Key Conveniences */}
                <div className="lg:col-span-7 space-y-8">
                  
                  {/* PHOTO GALLERY */}
                  <div className="space-y-3.5">
                    {/* Large Main Photo */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-zinc-150 border border-zinc-250/20 rounded-xl shadow-md">
                      <img
                        src={activeImage || selectedRoom.images[0]}
                        alt={selectedRoom.title}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-[1.01]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>

                    {/* Thumbnail List */}
                    <div className="flex flex-wrap gap-2 pt-1 animate-fade-in">
                      {selectedRoom.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(img)}
                          className={`relative w-[52px] h-[36px] sm:w-[65px] sm:h-[45px] overflow-hidden bg-zinc-100 transition-all duration-300 rounded-lg cursor-pointer shrink-0 ${
                            (activeImage || selectedRoom.images[0]) === img 
                              ? "ring-2 ring-deep-teal scale-[0.98] shadow-sm" 
                              : "opacity-75 hover:opacity-100 border border-zinc-200/40"
                          }`}
                        >
                          <img src={img} alt={`${selectedRoom.title} view ${i}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Specs Bar (Clean, Compact Horizontal Segment) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border border-[#D8CBB8]/40 rounded-xl text-center sm:text-left bg-[#EFEAE1]/30 px-5 shadow-xs">
                    <div className="space-y-0.5">
                      <span className="text-[9.5px] uppercase tracking-wider text-slate-charcoal/50 font-bold block">Dimensions</span>
                      <span className="text-xs sm:text-[13px] font-semibold text-slate-charcoal font-heading leading-tight block">
                        890 SQ FT / 83 M²
                      </span>
                    </div>
                    <div className="space-y-0.5 border-l border-[#D8CBB8]/40 pl-4 sm:pl-5">
                      <span className="text-[9.5px] uppercase tracking-wider text-slate-charcoal/50 font-bold block">Scenic View</span>
                      <span className="text-xs sm:text-[13px] font-semibold text-slate-charcoal font-heading leading-tight block">
                        Valley Peak Vista & Pines
                      </span>
                    </div>
                    <div className="space-y-0.5 border-l border-[#D8CBB8]/40 pl-4 sm:pl-5">
                      <span className="text-[9.5px] uppercase tracking-wider text-slate-charcoal/50 font-bold block">Bed Layout</span>
                      <span className="text-xs sm:text-[13px] font-semibold text-slate-charcoal font-heading leading-tight block">
                        2 Double Beds
                      </span>
                    </div>
                    <div className="space-y-0.5 border-l border-[#D8CBB8]/40 pl-4 sm:pl-5">
                      <span className="text-[9.5px] uppercase tracking-wider text-slate-charcoal/50 font-bold block">Bath Suite</span>
                      <span className="text-xs sm:text-[13px] font-semibold text-slate-charcoal font-heading leading-tight block">Custom Slate</span>
                    </div>
                  </div>

                  {/* Clean Narrative Introduction */}
                  <div className="bg-white border border-[#BAC1C8]/40 p-6 sm:p-8 rounded-2xl shadow-xs space-y-5">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#1B3B2B] block">High Altitude Solitude</span>
                    <h2 className="text-2xl sm:text-3xl font-heading font-normal text-[#1E2229]">
                      Alpine Conifer Comfort & <span className="italic text-[#0F4C5C]">Pure Serenity</span>
                    </h2>
                    <p className="text-[#2D3139] leading-relaxed text-sm sm:text-base font-sans font-normal">
                      {selectedRoom.description}
                    </p>
                    <div className="pt-4 border-t border-dashed border-[#BAC1C8]/30 flex flex-col sm:flex-row flex-wrap gap-2.5 text-xs font-semibold text-[#1E2229]">
                      <div className="flex items-center gap-1.5 bg-[#FAF9F5] text-[#1B3B2B] px-3.5 py-2 rounded-xl border border-[#BAC1C8]/30">
                        <Check size={14} className="text-[#1B3B2B]" strokeWidth={2.5} />
                        <span>Himalayan Sunrise Breakfast Included</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#FAF9F5] text-[#1E2229] px-3.5 py-2 rounded-xl border border-[#BAC1C8]/30">
                        <Check size={14} className="text-[#1E2229]" strokeWidth={2.5} />
                        <span>Complimentary Private Parking Space</span>
                      </div>
                    </div>
                  </div>

                  {/* Sanctuary Provisions (Exclusive Inclusions with Solid Slate Rock Background) */}
                  <div className="bg-[#2D3139] border border-[#BAC1C8]/25 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#FAF9F5]/60 block mb-0.5">EXCLUSIVE INCLUSIONS</span>
                      <h3 className="text-xl sm:text-2xl font-heading font-normal text-[#FAF9F5]">Suite Comfort Conveniences</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {selectedRoom.amenities.map((amenity, i) => {
                        const IconComponent = amenity.icon;
                        return (
                          <div 
                            key={i} 
                            className="flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-4 bg-[#1E2229]/65 border border-[#BAC1C8]/10 rounded-xl hover:border-[#BAC1C8]/30 hover:bg-[#1E2229] transition-all duration-300 cursor-default group"
                          >
                            <span className="p-2.5 bg-[#FAF9F5]/10 text-[#FAF9F5] rounded-xl transition-transform group-hover:scale-110 shrink-0">
                              <IconComponent size={15} strokeWidth={2.2} />
                            </span>
                            <span className="font-heading font-medium text-[#FAF9F5] text-[11px] sm:text-sm tracking-wide leading-tight">{amenity.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Refined Slideable Guest Experience Column */}
                  <div className="bg-[#FAF9F5] border border-[#D8CBB8]/40 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 relative overflow-visible">
                    
                    {/* Top rating trust panel from review image reference */}
                    <div className="text-center pt-2 pb-6 border-b border-[#D8CBB8]/30 flex flex-col items-center">
                      <span className="text-lg sm:text-xl font-bold tracking-widest text-[#2D3438] uppercase font-heading">EXCELLENT</span>
                      
                      {/* Gold Stars */}
                      <div className="flex text-amber-400 gap-1 mt-1.5 justify-center">
                        <Star className="fill-amber-400 text-amber-400" size={18} strokeWidth={0} />
                        <Star className="fill-amber-400 text-amber-400" size={18} strokeWidth={0} />
                        <Star className="fill-amber-400 text-amber-400" size={18} strokeWidth={0} />
                        <Star className="fill-amber-400 text-amber-400" size={18} strokeWidth={0} />
                        <div className="relative w-[18px] h-[18px]">
                          <Star className="text-amber-400" size={18} strokeWidth={1} />
                          <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
                            <Star className="fill-amber-400 text-amber-400" size={18} strokeWidth={0} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Rating details */}
                      <p className="text-[#5C6B5F] text-xs sm:text-sm mt-2 font-normal font-sans">
                        Rating <span className="font-bold text-[#2E3438]">4.7</span> from <span className="font-bold text-[#2E3438]">241 reviews</span>
                      </p>
                      
                      {/* Direct Provider Logos side-by-side */}
                      <div className="flex items-center gap-4 mt-3 text-xs font-bold text-[#2E3438]">
                        <div className="flex items-center gap-1.5 opacity-85 hover:opacity-100 transition-opacity">
                          <GoogleLogo />
                          <span className="tracking-wide">Google</span>
                        </div>
                        <span className="text-[#D8CBB8]/60">|</span>
                        <div className="flex items-center gap-1.5 opacity-85 hover:opacity-100 transition-opacity">
                          <TripAdvisorLogo />
                          <span className="tracking-wide">Tripadvisor</span>
                        </div>
                      </div>
                    </div>

                    {/* PC/Tablet Arrow Navigation floating on sides - elegantly modern */}
                    <button 
                      onClick={() => {
                        setCurrentReviewIdx((prev) => (prev - 1 + selectedRoom.reviews.length) % selectedRoom.reviews.length);
                        setIsReviewExpanded(false);
                      }}
                      className="hidden md:flex absolute -left-5 top-[58%] -translate-y-1/2 w-10 h-10 items-center justify-center bg-white border border-[#D8CBB8]/60 text-[#2D3438] rounded-full shadow-md hover:bg-stone-sand/20 hover:scale-[1.05] transition-all duration-300 cursor-pointer z-20"
                      aria-label="Previous Review"
                    >
                      <ChevronLeft size={16} strokeWidth={2.5} />
                    </button>
                    
                    <button 
                      onClick={() => {
                        setCurrentReviewIdx((prev) => (prev + 1) % selectedRoom.reviews.length);
                        setIsReviewExpanded(false);
                      }}
                      className="hidden md:flex absolute -right-5 top-[58%] -translate-y-1/2 w-10 h-10 items-center justify-center bg-white border border-[#D8CBB8]/60 text-[#2D3438] rounded-full shadow-md hover:bg-stone-sand/20 hover:scale-[1.05] transition-all duration-300 cursor-pointer z-20"
                      aria-label="Next Review"
                    >
                      <ChevronRight size={16} strokeWidth={2.5} />
                    </button>

                    {/* Verified Review container - matching requested image with clean details */}
                    <div className="mt-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentReviewIdx}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white border border-[#D8CBB8]/40 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-[215px] sm:h-[195px]"
                        >
                          {(() => {
                            const review = selectedRoom.reviews[currentReviewIdx];
                            
                            // Generate custom background color for the avatar circle based on reviewer initials for visual fun
                            const initials = review.name.split(" ").map(n => n[0]).join("").toUpperCase();
                            // Kuldeep gets the specific brand green as requested by image (#24a148)
                            const avatarBg = review.name.includes("Kuldeep") ? "bg-[#24a148]" : "bg-[#2E5C63]";
                            
                            return (
                              <>
                                {/* Profile Header line */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-11 h-11 ${avatarBg} text-white text-sm font-bold flex items-center justify-center rounded-full shrink-0 tracking-widest`}>
                                      {initials}
                                    </div>
                                    <div>
                                      <h4 className="font-heading font-bold text-sm text-[#2E3438] leading-tight flex items-center gap-1.5">
                                        {review.name}
                                      </h4>
                                      <span className="text-[11px] sm:text-xs text-[#5C6B5F] block font-medium mt-0.5">
                                        {review.location || "Verified Guest"} • {review.date}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Verified Check Circle (Blue check mark in upper right corner of the card) */}
                                  <div className="text-[#3b82f6] shrink-0 select-none bg-blue-50 p-1 rounded-full border border-blue-100">
                                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                                
                                {/* 5 Star score panel on the left of review */}
                                <div className="flex text-amber-400 gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      size={12.5} 
                                      className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200 fill-zinc-200"} 
                                      strokeWidth={0}
                                    />
                                  ))}
                                </div>
                                
                                {/* Truncated/Expandable quote content */}
                                <div className="space-y-1 overflow-hidden">
                                  <p className="text-[#2D3139] text-xs sm:text-[13px] leading-relaxed font-normal">
                                    {review.text.length > 120 ? `${review.text.slice(0, 115)}...` : review.text}
                                  </p>
                                  
                                  {review.text.length > 120 && (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedReviewForModal(review)}
                                      className="text-xs font-semibold text-[#4285F4] hover:text-[#3367d6] transition-colors cursor-pointer inline-block hover:underline focus:outline-none select-none text-left"
                                    >
                                      Read more
                                    </button>
                                  )}
                                </div>
                              </>
                            );
                          })()}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Responsive phone arrow controls below card */}
                    <div className="flex md:hidden items-center justify-between pt-4 border-t border-[#D8CBB8]/20">
                      <button 
                        type="button"
                        onClick={() => {
                          setCurrentReviewIdx((prev) => (prev - 1 + selectedRoom.reviews.length) % selectedRoom.reviews.length);
                          setIsReviewExpanded(false);
                        }}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-[#D8CBB8]/50 text-[#2D3438] rounded-xl active:bg-stone-sand/20 cursor-pointer shadow-xs"
                        aria-label="Previous Review"
                      >
                        <ChevronLeft size={18} strokeWidth={2.5} />
                      </button>
                      
                      {/* Index display */}
                      <span className="text-[10px] text-[#5C6B5F] font-bold tracking-widest uppercase">
                        Review {currentReviewIdx + 1} of {selectedRoom.reviews.length}
                      </span>

                      <button 
                        type="button"
                        onClick={() => {
                          setCurrentReviewIdx((prev) => (prev + 1) % selectedRoom.reviews.length);
                          setIsReviewExpanded(false);
                        }}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-[#D8CBB8]/50 text-[#2D3438] rounded-xl active:bg-stone-sand/20 cursor-pointer shadow-xs"
                        aria-label="Next Review"
                      >
                        <ChevronRight size={18} strokeWidth={2.5} />
                      </button>
                    </div>

                    {/* Navigation dot markers for PC & mobile alike */}
                    <div className="flex justify-center gap-1.5 pt-1">
                      {selectedRoom.reviews.map((_, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => {
                            setCurrentReviewIdx(i);
                            setIsReviewExpanded(false);
                          }}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            i === currentReviewIdx ? "w-6 bg-[#2D5C63]" : "w-1.5 bg-[#D8CBB8]/60 hover:bg-[#D8CBB8]"
                          }`}
                          aria-label={`Go to slide ${i+1}`}
                        />
                      ))}
                    </div>

                  </div>

                </div>

                {/* RIGHT COLUMN: PRESTIGE ALPINE MOUNTAIN BOOKING CARD */}
                <div className="lg:col-span-5 sticky top-28 bg-gradient-to-br from-[#1B3C41] via-[#152F33] to-[#0E2023] border border-[#D8CBB8]/25 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl text-warm-white font-sans ring-1 ring-[#D8CBB8]/5">
                  
                  {/* Title & Beautiful Rate Panel */}
                  <div className="pb-5 border-b border-warm-white/10 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#D8CBB8] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FAF9F5] animate-pulse" />
                        Direct Treasury rate
                      </span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl sm:text-4xl font-heading font-bold text-warm-white">₹{selectedRoom.price.toLocaleString("en-IN")}</span>
                        <span className="text-warm-white/70 text-xs italic">/ night</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold text-rock-900 bg-[#EFEAE1] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-stone-sand/20 hover:scale-[1.01] transition-transform duration-300 select-none font-sans shrink-0 whitespace-nowrap">
                      <Sparkles size={11} className="text-rock-900 sm:w-3 sm:h-3" />
                      <span>Best Rate Guarantee</span>
                    </div>
                  </div>

                  {/* Live Demand Ticker Bar (Mini Enhancement) */}
                  <div className="p-3 bg-[#0D1C1E]/40 border border-[#D8CBB8]/10 rounded-xl flex items-center justify-between gap-2.5 text-xs">
                    <span className="text-[#D8CBB8] font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      Live Demand
                    </span>
                    <span className="text-warm-white/80 text-[11px] leading-tight text-right italic">
                      <span className="font-bold text-amber-400">{viewersCount} travelers</span> are currently looking at this suite.
                    </span>
                  </div>

                  {/* Booking Flow Form */}
                  {bookingStep === "idle" && (
                    <form className="space-y-5" onSubmit={handleBookingSubmit}>
                                     {/* Dates Selector Group */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-[#FAF9F5]/75 flex items-center gap-1.5">
                            <Calendar size={12} className="text-[#D8CBB8]" /> Check-In
                          </label>
                          <input 
                            type="date" 
                            required
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="w-full bg-[#0D1C1E]/55 border border-warm-white/10 hover:border-[#D8CBB8]/50 focus:border-[#D8CBB8] focus:bg-[#122A2D]/80 rounded-xl px-3 py-3 text-xs text-warm-white focus:outline-none transition-all duration-200 font-medium" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-[#FAF9F5]/75 flex items-center gap-1.5">
                            <Calendar size={12} className="text-[#D8CBB8]" /> Check-Out
                          </label>
                          <input 
                            type="date" 
                            required
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="w-full bg-[#0D1C1E]/55 border border-warm-white/10 hover:border-[#D8CBB8]/50 focus:border-[#D8CBB8] focus:bg-[#122A2D]/80 rounded-xl px-3 py-3 text-xs text-warm-white focus:outline-none transition-all duration-200 font-medium" 
                          />
                        </div>
                      </div>

                      {/* Guest Count */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-[#FAF9F5]/75 flex items-center gap-1.5">
                          <Users size={12} className="text-[#D8CBB8]" /> Suite Occupants
                        </label>
                        <select 
                          value={guestCount}
                          onChange={(e) => setGuestCount(e.target.value)}
                          className="w-full bg-[#0D1C1E]/55 border border-warm-white/10 hover:border-[#D8CBB8]/50 rounded-xl px-3 py-3 text-xs text-warm-white focus:outline-none focus:border-[#D8CBB8] focus:bg-[#122A2D]/80 transition-all duration-200 font-medium cursor-pointer"
                        >
                          <option className="text-[#2D3438]">1 Guest</option>
                          <option className="text-[#2D3438]">2 Guests</option>
                          <option className="text-[#2D3438]">3 Guests</option>
                          <option className="text-[#2D3438]">4 Guests</option>
                        </select>
                      </div>


                      {/* Live Valuation Breakdowns */}
                      {checkIn && checkOut && (
                        <div className="p-4 bg-[#0D1C1E]/60 border border-[#D8CBB8]/20 rounded-xl space-y-3.5 text-xs text-warm-white/90 relative">
                          <div className="absolute top-3 right-3 flex items-center gap-1 bg-stone-sand/15 text-stone-sand text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border border-stone-sand/25">
                            Low Web Rate
                          </div>
                          
                          <span className="text-[10px] uppercase tracking-wider font-bold text-[#D8CBB8] block font-heading">
                            Stay Breakdown
                          </span>
                          
                          {(() => {
                            const nightsCount = Math.ceil(Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)) || 1;
                            const guestsNum = parseInt(guestCount) || 1;
                            const baseCost = selectedRoom.price * nightsCount;
                            const discountCost = 1200;
                            const poojaCost = addSpecialPooja ? 2500 : 0;
                            const breakfastCost = addCompulsoryBreakfast ? 350 * guestsNum * nightsCount : 0;
                            const finalStayTotal = baseCost - discountCost + poojaCost + breakfastCost;
                            
                            return (
                              <>
                                <div className="flex justify-between items-center text-warm-white/90 font-medium border-b border-warm-white/10 pb-2.5">
                                  <div>
                                    <span className="font-semibold block text-warm-white">{selectedRoom.title}</span>
                                    <span className="text-[10px] text-warm-white/70 block">
                                      ₹{selectedRoom.price.toLocaleString("en-IN")} × {nightsCount} night(s)
                                    </span>
                                  </div>
                                  <span className="font-heading font-medium text-warm-white text-sm">₹{baseCost.toLocaleString("en-IN")}</span>
                                </div>
                                
                                <div className="space-y-1.5">
                                  <div className="flex justify-between items-center text-[#D8CBB8] text-[11px] font-semibold">
                                    <span>• Electric Cozy Heating</span>
                                    <span className="text-[9px] uppercase tracking-widest bg-[#D8CBB8]/15 px-1.5 py-0.5 rounded text-[#D8CBB8] border border-[#D8CBB8]/10">Free</span>
                                  </div>

                                  <div className="flex justify-between items-center text-[#D8CBB8] text-[11px] font-semibold">
                                    <span>• Compulsory Breakfast ({guestsNum} Guests)</span>
                                    <span className="font-semibold text-warm-white">+ ₹{breakfastCost.toLocaleString("en-IN")}</span>
                                  </div>

                                  {addSpecialPooja && (
                                    <div className="flex justify-between items-center text-[#D8CBB8] text-[11px] font-semibold">
                                      <span>• Special Pooja arrangements</span>
                                      <span className="font-semibold text-warm-white">+ ₹{poojaCost.toLocaleString("en-IN")}</span>
                                    </div>
                                  )}

                                  <div className="flex justify-between items-center text-warm-white/80 text-[11px] font-semibold">
                                    <span>• Direct Member Discount</span>
                                    <span className="font-semibold text-stone-sand">- ₹1,200</span>
                                  </div>
                                </div>

                                <div className="flex justify-between items-baseline text-sm font-bold text-warm-white border-t border-dashed border-warm-white/15 pt-3">
                                  <span className="font-heading uppercase tracking-wide text-xs">Total Stay:</span>
                                  <div className="text-right">
                                    <span className="text-xl text-stone-sand font-semibold">₹{finalStayTotal.toLocaleString("en-IN")}</span>
                                    <p className="text-[9px] text-[#FAF9F5]/60 font-normal">All taxes & hot water showers included</p>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      )}

                      {/* Guest Verification */}
                      <div className="space-y-3 pt-3 border-t border-warm-white/10">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#D8CBB8] block">
                          Guest Information
                        </span>
                        
                        <div className="space-y-1">
                          <input 
                            type="text"
                            required
                            placeholder="Full Name"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full bg-[#0D1C1E]/55 border border-warm-white/10 hover:border-[#D8CBB8]/50 focus:border-[#D8CBB8] focus:bg-[#122A2D]/80 rounded-xl px-3 py-2.5 text-xs text-warm-white focus:outline-none transition-all duration-200"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input 
                            type="email"
                            required
                            placeholder="Email"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            className="w-full bg-[#0D1C1E]/55 border border-warm-white/10 hover:border-[#D8CBB8]/50 focus:border-[#D8CBB8] focus:bg-[#122A2D]/80 rounded-xl px-3 py-2.5 text-xs text-warm-white focus:outline-none transition-all duration-200"
                          />
                          <input 
                            type="tel"
                            required
                            placeholder="Phone Number"
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            className="w-full bg-[#0D1C1E]/55 border border-warm-white/10 hover:border-[#D8CBB8]/50 focus:border-[#D8CBB8] focus:bg-[#122A2D]/80 rounded-xl px-3 py-2.5 text-xs text-warm-white focus:outline-none transition-all duration-200"
                          />
                        </div>
                      </div>

                      {/* Premium Secure Booking CTA Button in Stone Sand and Slate-Charcoal text */}
                      <button
                        type="submit"
                        className="w-full relative overflow-hidden py-3.5 px-6 rounded-lg bg-stone-sand hover:bg-[#E5D7C3] text-slate-charcoal font-sans font-bold text-xs uppercase tracking-[0.18em] cursor-pointer shadow-md select-none outline-none hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 group border border-stone-sand/15"
                      >
                        <MessageSquare size={16} className="text-slate-charcoal/85 transition-transform duration-300 group-hover:scale-110 shrink-0" strokeWidth={2.5} />
                        <span>BOOK SUITE VIA WHATSAPP</span>
                      </button>
                      
                      {/* Safety Badges with elegant design */}
                      <div className="pt-4 border-t border-warm-white/10 flex flex-col gap-2 text-xs text-warm-white/70">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-[#D8CBB8] shrink-0 mt-0.5" />
                          <span>Direct Price Policy: We match any verified lower rates.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-[#D8CBB8] shrink-0 mt-0.5" />
                          <span>No deposit requested today. Simple pay on arrival.</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-center text-warm-white/40 text-[9.5px] pt-2 border-t border-warm-white/10 font-sans">
                          <Lock size={10} />
                          <span className="uppercase tracking-widest font-bold">100% Encrypted Stay Registry</span>
                        </div>
                      </div>

                    </form>
                  )}

                  {/* Booking Processing / Loading state */}
                  {bookingStep === "loading" && (
                    <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-10 h-10 border-2 border-zinc-200/20 border-t-[#D8CBB8] rounded-full animate-spin" />
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-[#D8CBB8] font-extrabold animate-pulse">Allocating Sanctuary</p>
                        <p className="italic text-base text-warm-white mt-1 animate-pulse">
                          {loadingText}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Booking Voucher Receipt Success Display */}
                  {bookingStep === "success" && generatedTicket && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      {/* Header Signature */}
                      <div className="text-center space-y-2 pb-4 border-b border-warm-white/10 font-sans">
                        <div className="mx-auto w-10 h-10 bg-[#FAF9F5]/10 rounded-full flex items-center justify-center border border-[#FAF9F5]/20 text-[#FAF9F5] shadow-sm">
                          <CheckCircle2 size={18} className="text-[#D8CBB8]" />
                        </div>
                        <h3 className="text-lg font-heading font-semibold text-warm-white">Sanctuary Lock Confirmed</h3>
                        <p className="text-stone-sand text-[9px] font-bold uppercase tracking-widest bg-[#FAF9F5]/10 px-3.5 py-1.5 border border-[#FAF9F5]/15 rounded-full inline-block font-mono">
                          HOLD SECURED • {generatedTicket.id}
                        </p>
                      </div>

                      {/* Clean Custom Invoice Card - Slighly rounded */}
                      <div className="border border-[#D8CBB8]/30 p-5 bg-[#FAF9F5] rounded-xl font-mono text-xs space-y-3 shadow-md text-rock-900">
                        <div className="flex justify-between font-bold text-zinc-500 uppercase text-[9px] pb-2 border-b border-[#D8CBB8]/25">
                          <span>Hold Details</span>
                          <span>{generatedTicket.id}</span>
                        </div>

                        <div className="space-y-2.5 pt-1.5 text-zinc-800 font-sans">
                          <div className="flex justify-between">
                            <span className="text-zinc-500 font-medium">Suite layout:</span>
                            <span className="font-semibold text-rock-900">{generatedTicket.roomTitle}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500 font-medium">Scheduled In:</span>
                            <span className="font-semibold text-rock-900">{generatedTicket.checkIn}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500 font-medium font-sans">Scheduled Out:</span>
                            <span className="font-semibold text-rock-900">{generatedTicket.checkOut}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500 font-medium font-sans">Selected nights:</span>
                            <span className="font-semibold text-rock-900">{generatedTicket.nights} night(s)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500 font-medium font-sans">Occupancy:</span>
                            <span className="font-semibold text-rock-900">{generatedTicket.guests}</span>
                          </div>
                          {generatedTicket.addCompulsoryBreakfast && (
                            <div className="flex justify-between text-xs text-pine-800 font-medium">
                              <span>• Compulsory Breakfast:</span>
                              <span className="font-semibold text-pine-800">Added</span>
                            </div>
                          )}
                          {generatedTicket.addSpecialPooja && (
                            <div className="flex justify-between text-xs text-[#1B3C41] font-medium">
                              <span>• Special Pooja Arrangements:</span>
                              <span className="font-semibold text-[#1B3C41]">Added</span>
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-dashed border-[#D8CBB8]/40 flex justify-between font-sans items-center">
                          <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Total Stay Cost:</span>
                          <span className="text-[#1B3C41] font-bold text-base">₹{(generatedTicket.total - 1200).toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      {/* Post Booking Resets & Info */}
                      <div className="text-center space-y-4">
                        <p className="text-xs text-warm-white/80 leading-relaxed font-sans">
                          Your reservation voucher, access credentials, and precise driving coordinates have been dispatched to your email address. No pre-payments are required.
                        </p>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="text-[10.5px] uppercase font-bold tracking-widest text-[#D8CBB8] hover:text-warm-white transition-colors duration-200 border-b border-[#D8CBB8]/50 hover:border-warm-white pb-0.5 cursor-pointer font-heading"
                        >
                          New Reservation Inquiry
                        </button>
                      </div>

                    </motion.div>
                  )}

                </div>

              </div>

            </motion.div>
          ) : (
            
            /* VIEW 2: HIGH-END MAIN LIST GRID ROOMS SELECTION OVERVIEW */
            <motion.div
              key="rooms-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto animate-fadeIn"
            >
              {/* Clean Editorial Title */}
              <header className="mb-16 text-center max-w-4xl mx-auto space-y-4">
                <span className="inline-flex items-center gap-1.5 uppercase tracking-[0.25em] text-[10px] sm:text-xs font-bold text-pine-800 bg-pine-100/50 px-4 py-1.5 rounded-full border border-pine-200/20 text-pretty">
                  <Sparkles size={11} className="text-amber-500" />
                  Exclusive Alpine Retreat Accommodations
                </span>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-heading tracking-tight leading-none text-rock-900">
                  {roomsHeading}
                </h1>
                <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto text-pretty font-sans font-normal">
                  {roomsSubheading}
                </p>

              </header>

              {/* Grid with Pristine Multi-image Suite Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {rooms.map((room, index) => (
                  <motion.div 
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15px" }}
                    transition={{ duration: 0.7, delay: index * 0.12, ease: easePremium }}
                    className="group bg-[#EFEAE1] border border-[#D8CBB8]/60 hover:border-deep-teal rounded-xl shadow-xs transition-all duration-500 hover:-translate-y-1 flex flex-col h-full overflow-hidden"
                  >
                    
                    {/* Full aspect thumbnail scene */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#FAF9F5]">
                      <img 
                        src={room.images[0]} 
                        alt={room.title}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
                      />
                      {/* Quiet Float Label */}
                      <span className="absolute top-4 left-4 bg-slate-charcoal text-[#FAF9F5] text-[9px] uppercase tracking-widest font-extrabold px-3 py-1.5 rounded-lg border border-warm-white/10 shadow-md font-mono">
                        {room.badge}
                      </span>
                      
                      {/* Quiet Float Price */}
                      <div className="absolute bottom-4 right-4 bg-slate-charcoal/90 backdrop-blur-xs text-[#FAF9F5] text-xs font-bold px-3 py-1.5 rounded-xl border border-warm-white/15 shadow-sm flex items-baseline gap-0.5 select-none font-sans">
                        <span className="text-[10px] text-[#FAF9F5]/70 font-normal">from</span>
                        <span className="text-[13px] font-heading font-bold text-[#FAF9F5]">₹{room.price.toLocaleString("en-IN")}</span>
                        <span className="text-[9px] text-[#FAF9F5]/60 lowercase font-normal italic">/nt</span>
                      </div>
                    </div>
                    
                    {/* Narrative body & detailed selections */}
                    <div className="flex-grow p-5 sm:p-7 flex flex-col justify-between">
                      <div className="space-y-3 mb-5">
                        <div className="flex items-center gap-1.5 text-amber-700 text-[11px] font-bold">
                          <Star size={11} className="fill-amber-400 text-amber-500" />
                          <span>4.9 Index Rating</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-heading font-medium tracking-tight text-slate-charcoal group-hover:text-deep-teal transition-colors duration-300">
                          {room.title}
                        </h2>
                        <p className="text-slate-charcoal/80 text-xs sm:text-sm leading-relaxed font-sans font-normal">
                          {room.description}
                        </p>
                      </div>
 
                      {/* Quiet list of experiences inclusions */}
                      <div className="border-t border-[#D8CBB8]/40 pt-4 mb-4 space-y-2.5 flex flex-col">
                        <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-slate-charcoal/60">Included Experiences</span>
                        <div className="flex flex-wrap gap-1.5 text-zinc-650">
                          {room.amenities.slice(0, 4).map((amenity, i) => {
                            const IconComponent = amenity.icon;
                            return (
                              <div key={i} className="flex items-center gap-1 bg-[#FAF9F5]/70 text-slate-charcoal px-2.5 py-1 rounded-full border border-[#D8CBB8]/40 hover:border-deep-teal hover:bg-white transition-all cursor-default" title={amenity.desc}>
                                <IconComponent size={11} className="text-deep-teal shrink-0" />
                                <span className="text-[10px] sm:text-[11px] font-sans font-semibold leading-none">{amenity.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Pricing and Action navigation */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#D8CBB8]/40">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-charcoal/50">Nightly Rate</span>
                          <span className="font-heading font-bold text-base sm:text-lg text-slate-charcoal flex items-baseline gap-0.5">
                            ₹{room.price.toLocaleString("en-IN")}
                            <span className="text-[10px] font-normal text-slate-charcoal/60 font-sans">/night</span>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSearchParams({ room: room.id })}
                          className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-xs font-bold tracking-widest uppercase text-warm-white bg-deep-teal hover:bg-slate-charcoal rounded-xl px-3 sm:px-4.5 py-2.5 sm:py-3 transition-colors duration-350 cursor-pointer"
                        >
                          View Room <ArrowRight size={13} className="transition-transform group-hover:translate-x-1 duration-300" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global verified review pop up modal */}
        {selectedReviewForModal && (() => {
          const review = selectedReviewForModal;
          const initials = review.name.split(" ").map((n: string) => n[0]).join("").toUpperCase();
          const avatarBg = review.name.includes("Kuldeep") ? "bg-[#24a148]" : "bg-[#2E5C63]";
          
          return (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedReviewForModal(null)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#FAF9F5] max-w-lg w-full rounded-2xl border border-[#D8CBB8]/40 p-6 sm:p-8 space-y-6 shadow-2xl relative font-sans text-rock-900"
              >
                {/* Close button icon */}
                <button 
                  onClick={() => setSelectedReviewForModal(null)}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors w-8 h-8 rounded-full flex items-center justify-center bg-[#FAF9F5]/40 hover:bg-zinc-100 border border-zinc-200/40 cursor-pointer animate-fadeIn"
                  aria-label="Close modal"
                >
                  <X size={15} />
                </button>

                {/* Profile Header line */}
                <div className="flex items-center gap-3 pt-2">
                  <div className={`w-12 h-12 ${avatarBg} text-white font-bold text-sm flex items-center justify-center rounded-full shrink-0 tracking-widest`}>
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-[#2E3438]">{review.name}</h3>
                    <p className="text-xs text-[#5C6B5F] mt-0.5">{review.location || "Verified Guest"} • {review.date}</p>
                  </div>
                </div>

                {/* Stars and Provider details */}
                <div className="flex items-center justify-between border-t border-b border-[#D8CBB8]/30 py-3">
                  <div className="flex text-amber-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={13} 
                        className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200 fill-zinc-200"} 
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-white border border-[#D8CBB8]/30 px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#2D3438]">
                    {review.source === "google" ? <GoogleLogo /> : <TripAdvisorLogo />}
                    <span className="capitalize tracking-wider">{review.source} Verified</span>
                  </div>
                </div>

                {/* Review Description body */}
                <div className="space-y-1.5">
                  <span className="text-[9px] tracking-[0.2em] font-bold text-stone-500 uppercase block">GUEST JOURNAL ENTRY</span>
                  <p className="text-zinc-700 text-xs sm:text-[13.5px] leading-relaxed whitespace-pre-line italic">
                    "{review.text}"
                  </p>
                </div>

                {/* Verified ledger seal */}
                <div className="bg-[#2E5C63]/5 border border-[#2E5C63]/15 text-[#2E5C63] rounded-xl p-4 flex items-start gap-3.5 text-xs">
                  <div className="text-white shrink-0 select-none bg-[#2E5C63] p-1 rounded-full">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#2D3438] block font-heading tracking-wide uppercase text-[10px]">Verified Booking Sanctuary Record</span>
                    <p className="text-[#5C6B5F] leading-relaxed text-[11px] font-medium font-sans">
                      This review is verified authentic through The Vedic Himalaya Retreat booking ledger and is locked as of seasonal trail access check periods.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => setSelectedReviewForModal(null)}
                    className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-[#FAF9F5] text-xs uppercase font-extrabold tracking-widest cursor-pointer hover:shadow-md transition-all duration-200"
                  >
                    Back to Journal
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}

/**
 * ARCHIVED MULTIPLE ROOMS CONFIGURATION
 * 
 * Useful for future when we will use multiple cards.
 * Includes the 2-bed room and 3-bed room configurations.
 * Note: All bathtub reference items have been replaced with walk-in stone showers/slate baths.
 */
export const ARCHIVED_MULTIPLE_ROOMS = [
  {
    id: "2-bed",
    title: "2 Bed Room",
    badge: "Twin Comfort",
    price: 6500,
    description: "Designed for couples, close friends, or corporate colleagues seeking premium twin comfort in the clouds. Offers bespoke wood masonry, warm heating, separate plush twin bedding, and panoramic window portals viewing the majestic Himalayan valley.",
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: [
      { label: "Plush Mattresses", icon: Bed, desc: "Two separate master-grade organic mattresses with ultra-soft covers" },
      { label: "Quiet Airflow", icon: Fan, desc: "High-performance remote cooling system" },
      { label: "Private Slate Bath", icon: Bath, desc: "Bespoke stone bath with geyser and hot rain shower" },
      { label: "Smart TV Portal", icon: Tv, desc: "Stream pre-loaded cinematic alpine media" },
      { label: "Fiber Speed WiFi", icon: Wifi, desc: "High-speed complimentary internet" },
      { label: "Artisanal Kettle", icon: Coffee, desc: "Local premium herbal tea set included" }
    ],
    reviews: [
      { name: "Rahul Sharma", rating: 5, location: "Delhi", date: "May 2024", text: "The beds were incredibly comfortable and the environment is designed with true refinement. Spotless stone shower with hot water always ready.", source: "google" },
      { name: "Kuldeep Rana", rating: 4, location: "Haryana", date: "May 2022", text: "Good hotel for the price. Rooms are spacious but the WiFi was slow. Location is perfect - away from Guptkashi's crowded market. Would have given 5 stars if breakfast timing was earlier.", source: "google" },
      { name: "Anita Desai", rating: 5, location: "Mumbai", date: "April 2024", text: "Exquisite attention to detail, breathtaking views, and wonderful tea. A masterclass in modern mountain serenity.", source: "tripadvisor" },
      { name: "Nitin Rawat", rating: 5, location: "Rudraprayag", date: "Oct 2023", text: "Beautiful sanctuary! Absolute luxury in the middle of nature. Perfect starting point for Kedarnath route.", source: "tripadvisor" }
    ]
  },
  {
    id: "3-bed",
    title: "3 Bed Room",
    badge: "Tri-Sanctuary",
    price: 8500,
    description: "Perfect for families, spiritual seekers, or small travel squads exploring the sacred Guptkashi region. Beautifully spacious layouts equipped with premium plush beds, warm lighting, and luxury fixtures blending modern convenience with rustic mountain charm.",
    images: [
      "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: [
      { label: "Premium Bedding", icon: Bed, desc: "Three separate luxurious mattresses with goose-down duvets" },
      { label: "Luxe Ceiling Fan", icon: Fan, desc: "Premium designer fan for absolute room comfort" },
      { label: "Private Stone Bath", icon: Bath, desc: "Walk-in stone shower with organic apothecary soaps" },
      { label: "4K Cinema Display", icon: Tv, desc: "Large flat screen display with premium global channels" },
      { label: "High Speed Fiber", icon: Wifi, desc: "Complimentary high-speed fiber internet connection" },
      { label: "Coffee & Tea Hub", icon: Coffee, desc: "Selected organic chai blends and french kettle set" }
    ],
    reviews: [
      { name: "Vikram Malhotra", rating: 5, location: "Bangalore", date: "May 22, 2024", text: "Stunning room size for our group. The architecture breathes space and peace. Having three comfy beds made our journey truly restful.", source: "google" },
      { name: "Kuldeep Rana", rating: 4, location: "Haryana", date: "May 2022", text: "Good hotel for the price. Rooms are spacious but the WiFi was slow. Location is perfect - away from Guptkashi's crowded market. Would have given 5 stars if breakfast timing was earlier.", source: "google" },
      { name: "Meera Krishnan", rating: 5, location: "Chennai", date: "May 05, 2024", text: "Beautiful stone shower, great smart amenities, and beautiful views of the pines. Highly recommend it for those seeking peaceful lodging.", source: "tripadvisor" },
      { name: "Siddharth Sen", rating: 5, location: "Kolkata", date: "Mar 2024", text: "Fabulous family hospitality, spacious room with comfortable duvets. Clean sheets and cozy heating make all the difference.", source: "google" }
    ]
  }
];

