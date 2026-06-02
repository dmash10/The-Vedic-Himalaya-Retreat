import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CookieConsent } from "../CookieConsent";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { MessageSquare, Phone, Mail, Sparkles } from "lucide-react";

export function Layout() {
  const { pathname } = useLocation();
  const { settings, loading } = useSiteSettings();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1613]">
        <div className="w-10 h-10 rounded-full border-2 border-[#D8CBB8]/30 border-t-[#C4A665] animate-spin" />
      </div>
    );
  }

  // 1. Maintenance Mode implementation (Admin Routes are outside of layout, so they remain fully accessible)
  if (settings.maintenance_mode) {
    const whatsappUrl = `https://wa.me/${settings.whatsapp_number || "918126573560"}?text=${encodeURIComponent(settings.whatsapp_default_message || "Hi, I want to book a room at The Vedic Himalaya Retreat")}`;
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#0A1613] text-[#FAF9F5] font-sans relative overflow-hidden">
        {/* Cinematic atmospheric blurred background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30 select-none">
          <img 
            src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover scale-105 filter blur-xs contrast-110" 
            alt="mountains" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#0A1613]/90 blend-multiply" />
        </div>

        {/* Top Header */}
        <header className="relative z-10 p-6 md:p-8 border-b border-[#D8CBB8]/10 bg-black/10 backdrop-blur-xs flex justify-center sm:justify-start">
          <div className="flex flex-col text-center sm:text-left">
            <span className="font-heading font-normal text-lg sm:text-xl tracking-widest uppercase text-[#FAF9F5]">
              {settings.hotel_name || "The Vedic Himalaya Retreat"}
            </span>
            <span className="text-[10px] italic text-[#C4A665] uppercase tracking-widest mt-1">
              {settings.tagline || "Peace in the Pines"}
            </span>
          </div>
        </header>

        {/* Centered glassmorphic coming-soon card */}
        <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12 md:py-16">
          <div className="w-full max-w-xl bg-black/45 backdrop-blur-md border border-[#D8CBB8]/15 rounded-3xl p-6 sm:p-12 text-center shadow-2xl space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#C4A665]/10 text-[#C4A665] text-[10px] uppercase font-bold tracking-[0.25em] rounded-full border border-[#C4A665]/10">
              <Sparkles size={11} className="text-[#C4A665] animate-pulse" />
              <span>Under Maintenance</span>
            </div>
            
            <div className="space-y-3.5">
              <h1 className="text-3xl sm:text-5xl font-heading font-normal tracking-tight text-white leading-tight">
                Website <span className="italic text-[#C4A665]">Under Maintenance</span>
              </h1>
              <p className="text-[#FAF9F5]/70 text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto">
                Our website is temporarily down for updates. We will be back online shortly. Thank you for your patience.
              </p>
            </div>

            <div className="flex flex-col gap-3 max-w-md mx-auto pt-4 border-t border-white/10">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C4A665]/60 mb-1">Contact Us Directly</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {settings.primary_phone && (
                  <a href={`tel:${settings.primary_phone.replace(/\s+/g, '')}`} className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[#C4A665]/40 transition-all font-mono font-bold tracking-wider text-white">
                    <Phone size={13} className="text-[#C4A665]" />
                    {settings.primary_phone}
                  </a>
                )}
                {settings.email && (
                  <a href={`mailto:${settings.email}`} className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[#C4A665]/40 transition-all font-mono lowercase tracking-wide text-white">
                    <Mail size={13} className="text-[#C4A665]" />
                    {settings.email}
                  </a>
                )}
              </div>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full py-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <MessageSquare size={16} fill="white" />
                Connect With Registrar Via WhatsApp
              </a>
            </div>
          </div>
        </main>

        {/* Footer info */}
        <footer className="relative z-10 p-6 text-center text-[10px] text-[#FAF9F5]/40 uppercase tracking-widest border-t border-white/5 bg-black/10">
          &copy; {new Date().getFullYear()} {settings.hotel_name || "The Vedic Himalaya Retreat"}. Under Maintenance.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-warm-white text-rock-900">
      {/* 2. Announcement Banner implementation */}
      {settings.announcement_enabled && settings.announcement_text && (
        <div className="bg-[#1B4C44] text-[#FAF9F5] text-center py-2.5 px-6 text-[10px] font-extrabold uppercase tracking-[0.2em] relative z-50 border-b border-[#FAF9F5]/10 animate-fade-in flex items-center justify-center gap-2.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C4A665] animate-ping shrink-0" />
          <span className="leading-relaxed">{settings.announcement_text}</span>
        </div>
      )}
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {pathname !== "/experiences" && pathname !== "/nearby" && <Footer />}
      <CookieConsent />
    </div>
  );
}
