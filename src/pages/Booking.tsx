import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Sparkles, Calendar, Users, Home, Phone, Check, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useContent } from "@/hooks/useContent";
import PageLoader from "@/components/PageLoader";

export default function Booking() {
  const { settings } = useSiteSettings();
  const { getValue, loading, content } = useContent();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Guests");
  const [roomType, setRoomType] = useState("Pinewood Family Suite");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [addSpecialPooja, setAddSpecialPooja] = useState(false);
  
  const [bookingStep, setBookingStep] = useState<"idle" | "loading" | "success">("idle");
  const [loadingText, setLoadingText] = useState("");
  const [generatedTicket, setGeneratedTicket] = useState<any>(null);

  const easePremium = [0.22, 1, 0.36, 1] as const;

  const whatsappNumber = settings.whatsapp_number || "917060326489";

  // Prevent flash of fallback text while CMS content loads
  if (loading && content.length === 0) return <PageLoader />;

  const bookingHeading = getValue('booking', 'booking_heading', 'Reserve Your');
  const bookingHeadingItalic = getValue('booking', 'booking_heading_italic', 'Stay');
  const bookingBadge = getValue('booking', 'booking_badge', 'Guaranteed sanctuary booking');
  const bookingSubheading = getValue('booking', 'booking_subheading', 'Elevate your Himalayan ascent with a direct direct-booking premium rate.');
  const bookingVisible = getValue('booking', 'booking_visible', 'true') !== 'false';

  if (!bookingVisible) {
    return (
      <div className="bg-[#FAF9F5] text-slate-charcoal pt-32 pb-24 min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-md relative z-10 text-center space-y-6 bg-white p-8 md:p-12 border border-[#D8CBB8]/30 shadow-2xl rounded-2xl">
          <h1 className="text-3xl font-heading tracking-tight text-slate-charcoal">
            Bookings <span className="italic font-normal text-[#1B4C44]">Paused</span>
          </h1>
          <p className="text-[#1C2E2A]/70 text-xs font-medium font-sans leading-relaxed">
            Online reservation requests are currently paused for system updates. Please connect with our reservation desk directly via WhatsApp.
          </p>
          <a 
            href={`https://wa.me/${whatsappNumber}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center justify-center bg-[#1B4C44] hover:bg-[#143731] text-white font-sans font-extrabold text-[10px] uppercase tracking-[0.2em] px-6 py-3.5 rounded-xl transition-all shadow-md"
          >
            Connect WhatsApp Desk
          </a>
        </div>
        
        {/* Decorative mountain background line-art */}
        <div className="fixed inset-0 z-0 pointer-events-none block opacity-15">
          <img 
            src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover grayscale" 
            alt="mountains" 
          />
          <div className="absolute inset-0 bg-[#FAF9F5]/90 blend-multiply" />
        </div>
      </div>
    );
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || !guestName || !guestEmail || !guestPhone) {
      alert("Please fill in all the required details to secure your reservation.");
      return;
    }

    setBookingStep("loading");
    const phrases = [
      "Verifying peak-season calendar spaces...",
      "Reserving luxury suite holding keys...",
      "Engaging mountain-top direct benefits...",
      "Drafting secure confirmations e-voucher..."
    ];

    let currentPhase = 0;
    setLoadingText(phrases[0]);

    const interval = setInterval(() => {
      currentPhase++;
      if (currentPhase < phrases.length) {
        setLoadingText(phrases[currentPhase]);
      } else {
        clearInterval(interval);
        
        const d1 = new Date(checkIn);
        const d2 = new Date(checkOut);
        const timeDiff = Math.abs(d2.getTime() - d1.getTime());
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;
        
        const basePrice = roomType === "Deodar Imperial Suite" ? 9500 : roomType === "Kedar View Balcony Room" ? 7200 : 5800;
        const baseCost = basePrice * nights;
        const guestsNum = parseInt(guests) || 1;
        const poojaCost = addSpecialPooja ? 2500 : 0;
        const breakfastCost = 350 * guestsNum * nights;
        const total = baseCost + poojaCost + breakfastCost - 1200; // direct discount constant

        const ticket = {
          id: `KED-${Math.floor(100000 + Math.random() * 900000)}`,
          roomTitle: roomType,
          checkIn,
          checkOut,
          guests,
          nights,
          total,
          guestName,
          guestEmail,
          guestPhone,
          addSpecialPooja,
          addCompulsoryBreakfast: true,
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
    }, 900);
  };

  const handleReset = () => {
    setBookingStep("idle");
    setCheckIn("");
    setCheckOut("");
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
    setAddSpecialPooja(false);
    setGeneratedTicket(null);
  };

  return (
    <div className="bg-[#FAF9F5] text-rock-900 pt-32 pb-24 min-h-screen flex items-center relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        
        {bookingStep === "idle" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easePremium }}
            className="bg-white p-6 md:p-12 border border-[#D8CBB8]/30 shadow-2xl rounded-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none select-none">
              <span className="text-9xl italic font-serif">G</span>
            </div>
            
            <header className="mb-8 relative z-10">
              <h1 className="text-3xl md:text-5xl font-heading tracking-tight text-slate-charcoal mb-3">
                {bookingHeading} <span className="italic font-normal text-[#1B4C44]">{bookingHeadingItalic}</span>
              </h1>
              <p className="text-[#1B4C44] text-[11px] font-black uppercase tracking-widest font-mono flex items-center gap-1.5 mb-1">
                <Sparkles size={12} className="text-[#A88C52]" /> {bookingBadge}
              </p>
              <p className="text-rock-600/70 text-xs font-medium font-sans">
                {bookingSubheading}
              </p>
            </header>

            <form className="space-y-5 relative z-10" onSubmit={handleBookingSubmit}>
              {/* Date Pickers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#1B4C44] flex items-center gap-1.5 font-mono">
                    <Calendar size={12} className="text-[#A88C52]" /> Check In
                  </label>
                  <input 
                    type="date" 
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#D8CBB8]/30 rounded-xl px-4 py-3 text-xs text-rock-900 focus:outline-none focus:border-[#1B4C44] transition-colors font-semibold" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#1B4C44] flex items-center gap-1.5 font-mono">
                    <Calendar size={12} className="text-[#A88C52]" /> Check Out
                  </label>
                  <input 
                    type="date" 
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#D8CBB8]/30 rounded-xl px-4 py-3 text-[#1e3a1e] focus:outline-none focus:border-[#1B4C44] transition-colors font-semibold" 
                  />
                </div>
              </div>

              {/* Occupants & Room */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#1B4C44] flex items-center gap-1.5 font-mono">
                    <Users size={12} className="text-[#A88C52]" /> Occupants
                  </label>
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#D8CBB8]/30 rounded-xl px-4 py-3 text-xs text-rock-900 focus:outline-none focus:border-[#1B4C44] transition-colors font-semibold appearance-none"
                  >
                     <option>1 Guest</option>
                     <option>2 Guests</option>
                     <option>3 Guests</option>
                     <option>4 Guests</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#1B4C44] flex items-center gap-1.5 font-mono">
                    <Home size={12} className="text-[#A88C52]" /> Suite Choice
                  </label>
                  <select 
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#D8CBB8]/30 rounded-xl px-4 py-3 text-xs text-rock-900 focus:outline-none focus:border-[#1B4C44] transition-colors font-semibold appearance-none"
                  >
                     <option>Pinewood Family Suite</option>
                     <option>Deodar Imperial Suite</option>
                     <option>Kedar View Balcony Room</option>
                  </select>
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-3.5 pt-2 border-t border-[#D8CBB8]/20">
                <h3 className="text-slate-charcoal font-sans font-bold uppercase tracking-wider text-[10px]">Guest Information</h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-rock-500 font-mono">Full Guest Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Arjun Sharma"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#D8CBB8]/30 rounded-xl px-4 py-3 text-xs text-rock-900 focus:outline-none focus:border-[#1B4C44] transition-colors font-medium" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-rock-500 font-mono">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="arjun@sharma.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#D8CBB8]/30 rounded-xl px-4 py-3 text-xs text-rock-900 focus:outline-none focus:border-[#1B4C44] transition-colors font-medium" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-rock-500 font-mono">Contact Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 94563 96950"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#D8CBB8]/30 rounded-xl px-4 py-3 text-xs text-rock-900 focus:outline-none focus:border-[#1B4C44] transition-colors font-medium" 
                    />
                  </div>
                </div>
              </div>

              {/* Addons checkbox */}
              <div className="p-3.5 bg-[#FAF9F5] border border-[#D8CBB8]/20 rounded-xl group select-none cursor-pointer">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={addSpecialPooja}
                    onChange={(e) => setAddSpecialPooja(e.target.checked)}
                    className="mt-0.5 rounded text-[#1B4C44] focus:ring-[#1B4C44] accent-[#1B4C44]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-charcoal">Include Himalayan Pooja Session</span>
                    <span className="text-[10px] text-rock-600/70 block">Vedic sunrise chanting blessing led by local pujaris (+ ₹2,500)</span>
                  </div>
                </label>
              </div>

              <div className="pt-4">
                <Button size="lg" className="w-full uppercase tracking-[0.2em] font-extrabold text-[10px]" variant="primary">
                  Verify &amp; Book Sanctuary Suite
                </Button>
              </div>
              
              <div className="text-center pt-2">
                <p className="text-[11px] text-rock-600/70 font-medium">Or coordinate directly via <a href={`https://wa.me/${whatsappNumber}`} className="text-pine-700 hover:text-pine-600 border-b border-pine-700/30">WhatsApp Desk</a></p>
              </div>
            </form>
          </motion.div>
        )}

        {/* Loading Step */}
        {bookingStep === "loading" && (
          <div className="bg-white p-12 border border-[#D8CBB8]/30 shadow-2xl rounded-2xl relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-2 border-[#D8CBB8]/30 border-t-[#1B4C44] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={20} className="text-[#A88C52] animate-bounce" />
              </div>
            </div>
            <p className="text-xs uppercase tracking-widest text-[#1B4C44] font-black mb-3 font-mono">Secure Ledger Process</p>
            <p className="text-slate-charcoal font-sans font-medium text-sm max-w-sm leading-relaxed animate-pulse">
              {loadingText}
            </p>
          </div>
        )}

        {/* Success / Ticket View */}
        {bookingStep === "success" && generatedTicket && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: easePremium }}
            className="bg-white border-2 border-[#1B4C44]/30 shadow-2xl rounded-2xl overflow-hidden text-rock-900 relative"
          >
            {/* Top Green Accent Header */}
            <div className="bg-[#1B4C44] p-5 text-center text-white relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <button onClick={handleReset} className="text-white/80 hover:text-white transition-colors p-1 flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold">
                  <ChevronLeft size={16} /> New Stay
                </button>
              </div>
              <Check className="mx-auto text-amber-400 bg-white/10 p-2 rounded-full w-12 h-12 mb-2" strokeWidth={2.5} />
              <span className="text-[10px] uppercase font-black tracking-[0.3em] font-mono block text-amber-400">Ledger Reservation Locked</span>
              <h2 className="text-xl font-heading font-normal">Sanctuary Voucher E-Ticket</h2>
            </div>

            {/* Ticket Body with dashed tear line */}
            <div className="p-6 md:p-8 space-y-6">
              
              <div className="flex justify-between items-center bg-[#FAF9F5] p-3.5 border border-[#D8CBB8]/30 rounded-xl">
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-rock-500 font-mono block">E-Ticket ID</span>
                  <span className="text-base font-bold text-slate-charcoal font-mono">{generatedTicket.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-rock-500 font-mono block">Voucher Status</span>
                  <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Pending Ledger Verification
                  </span>
                </div>
              </div>

              {/* Guest / Suite details */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs font-sans">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#A88C52] block font-mono">Pilgrim Custodian</span>
                  <span className="font-semibold text-slate-charcoal mt-1 block">{generatedTicket.guestName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#A88C52] block font-mono font-sans">Accommodation</span>
                  <span className="font-semibold text-slate-charcoal mt-1 block">{generatedTicket.roomTitle}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#A88C52] block font-mono">Check-In</span>
                  <span className="font-semibold text-slate-charcoal mt-1 block">{generatedTicket.checkIn}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#A88C52] block font-mono">Check-Out</span>
                  <span className="font-semibold text-slate-charcoal mt-1 block">{generatedTicket.checkOut}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#A88C52] block font-mono">Guests Assigned</span>
                  <span className="font-semibold text-slate-charcoal mt-1 block">{generatedTicket.guests}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#A88C52] block font-mono">Nights Span</span>
                  <span className="font-semibold text-slate-charcoal mt-1 block">{generatedTicket.nights} night(s)</span>
                </div>
              </div>

              {/* Services List summary */}
              <div className="pt-4 border-t border-[#D8CBB8]/20 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-widest text-rock-500 block font-mono">Inclusions</span>
                <div className="flex justify-between text-rock-700 font-medium">
                  <span>Farm breakfast (complimentary perk)</span>
                  <span className="text-emerald-700">Included</span>
                </div>
                {generatedTicket.addSpecialPooja && (
                  <div className="flex justify-between text-rock-700 font-medium">
                    <span>Peak Sunrise Pooja Arrangement</span>
                    <span>₹2,500</span>
                  </div>
                )}
              </div>

              {/* Secure valuation */}
              <div className="p-4 bg-[#1B4C44]/5 border-t border-b border-dashed border-[#1B4C44]/20 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#1B4C44] block font-mono">Ledger Valuation Total</span>
                  <span className="text-[9px] text-[#A88C52] font-semibold uppercase font-mono">No pre-payment required</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-heading text-slate-charcoal">₹{generatedTicket.total.toLocaleString("en-IN")}</span>
                  <p className="text-[8px] text-[#1B4C44] uppercase font-extrabold tracking-widest font-mono">Sattvik Perks Combined</p>
                </div>
              </div>

              <div className="text-center space-y-3.5 pt-2">
                <p className="text-[11px] text-[#1B4C44] leading-relaxed max-w-md mx-auto font-medium">
                  Your reservation request has been registered in our database. The on-duty registrar is confirming physical suite clearance right now. Please present this voucher screen at check-in.
                </p>
                <div className="inline-flex gap-3 justify-center w-full">
                  <Button variant="outline" size="sm" onClick={() => window.print()} className="uppercase tracking-widest text-[9px] py-2 px-4 shadow-xs">
                    Print Voucher
                  </Button>
                  <a href={`https://wa.me/${whatsappNumber}?text=Namaste!%20I%20have%20booked%20my%20stay.%20Voucher%20ID:%20${generatedTicket.id}`} className="inline-flex items-center gap-1.5 bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors rounded-lg text-[9px] uppercase tracking-widest font-sans font-extrabold px-4 py-2 hover:shadow-md">
                    Connect WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* Decorative mountain background line-art */}
      <div className="fixed inset-0 z-0 pointer-events-none block opacity-15">
        <img 
          src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover grayscale" 
          alt="mountains" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-[#FAF9F5]/90 blend-multiply" />
      </div>
    </div>
  );
}
