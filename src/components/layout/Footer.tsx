import { Link } from "react-router-dom";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-slate-charcoal border-t border-[#D8CBB8]/10 pt-16 pb-12 text-[#F6F4EF]/85 font-sans relative overflow-hidden">
      {/* Decorative subtle top gradient aura */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8A98A6]/30 to-transparent" />

      <div className="container mx-auto px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 sm:gap-8 pb-12 mb-12 border-b border-[#D8CBB8]/15">
          
          {/* Column 1: Editorial Branding */}
          <div className="space-y-4 col-span-2 lg:col-span-1">
            <div className="flex flex-col">
              <span className="font-heading font-normal text-2xl tracking-wider text-[#F6F4EF] uppercase">
                {settings.hotel_name || "The Vedic Himalaya Retreat"}
              </span>
              <span className="italic text-[#D8CBB8] text-sm tracking-wide mt-1">
                {settings.tagline || "Peace in the Pines"}
              </span>
            </div>
            <p className="text-[#F6F4EF]/70 text-xs sm:text-sm leading-relaxed max-w-xs font-normal font-sans">
              A quiet mountain retreat on the Kedarnath Route, offering panoramic views and warm Himalayan hospitality.
            </p>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="space-y-4 col-span-1">
            <h4 className="font-heading uppercase tracking-[0.18em] text-xs text-[#D8CBB8] font-semibold">
              The Retreat
            </h4>
            <div className="flex flex-col space-y-2.5 text-sm text-[#F6F4EF]/80">
              <Link to="/about" className="hover:text-[#A88C52] transition-colors duration-300 w-fit">The Retreat</Link>
              <Link to="/rooms" className="hover:text-[#A88C52] transition-colors duration-300 w-fit">Rooms</Link>
              <Link to="/dining" className="hover:text-[#A88C52] transition-colors duration-300 w-fit">Dining</Link>
              <Link to="/gallery" className="hover:text-[#A88C52] transition-colors duration-300 w-fit">Gallery</Link>
            </div>
          </div>

          {/* Column 3: Destination Experience */}
          <div className="space-y-4 col-span-1">
            <h4 className="font-heading uppercase tracking-[0.18em] text-xs text-[#D8CBB8] font-semibold">
              Experiences
            </h4>
            <div className="flex flex-col space-y-2.5 text-sm text-[#F6F4EF]/80">
              <Link to="/experiences" className="hover:text-[#A88C52] transition-colors duration-300 w-fit">Experiences</Link>
              <Link to="/weddings" className="hover:text-[#A88C52] transition-colors duration-300 w-fit">Weddings</Link>
              <Link to="/nearby" className="hover:text-[#A88C52] transition-colors duration-300 w-fit">Explore</Link>
              <Link to="/contact" className="hover:text-[#A88C52] transition-colors duration-300 w-fit">Contact</Link>
            </div>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-4 col-span-2 lg:col-span-1 pt-4 sm:pt-0 border-t border-[#D8CBB8]/10 sm:border-0">
            <h4 className="font-heading uppercase tracking-[0.18em] text-xs text-[#D8CBB8] font-semibold">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-2.5 max-w-sm">
              {/* Location Badge */}
              <a 
                href={settings.google_maps_url || "https://maps.google.com/?q=Village+Dewar+Guptkashi"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl border border-[#D8CBB8]/15 bg-white/[0.02] text-[#F6F4EF]/85 hover:bg-[#FAF9F5]/5 hover:text-[#A88C52] hover:border-[#A88C52] transition-all duration-300 group shadow-xs select-none"
              >
                <MapPin size={15} className="shrink-0 mt-0.5 text-[#8A98A6] group-hover:text-[#A88C52] transition-colors" />
                <span className="leading-snug text-xs font-medium font-sans">
                  {settings.address || "Village Dewar, Guptkashi, Kedarnath Route"}
                </span>
              </a>

              {/* Phone 1 Badge */}
              {settings.primary_phone && (
                <a 
                  href={`tel:${settings.primary_phone.replace(/\s+/g, '')}`} 
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-[#D8CBB8]/15 bg-white/[0.02] text-[#F6F4EF]/85 hover:bg-[#FAF9F5]/5 hover:text-[#A88C52] hover:border-[#A88C52] transition-all duration-300 group shadow-xs select-none"
                >
                  <Phone size={14} className="shrink-0 text-[#8A98A6] group-hover:text-[#A88C52] transition-colors" />
                  <span className="text-[11px] tracking-wider font-mono font-bold uppercase">{settings.primary_phone}</span>
                </a>
              )}

              {/* Phone 2 Badge */}
              {settings.secondary_phone && (
                <a 
                  href={`tel:${settings.secondary_phone.replace(/\s+/g, '')}`} 
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-[#D8CBB8]/15 bg-white/[0.02] text-[#F6F4EF]/85 hover:bg-[#FAF9F5]/5 hover:text-[#A88C52] hover:border-[#A88C52] transition-all duration-300 group shadow-xs select-none"
                >
                  <Phone size={14} className="shrink-0 text-[#8A98A6] group-hover:text-[#A88C52] transition-colors" />
                  <span className="text-[11px] tracking-wider font-mono font-bold uppercase">{settings.secondary_phone}</span>
                </a>
              )}

              {/* Email Badge */}
              {settings.email && (
                <a 
                  href={`mailto:${settings.email}`} 
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-[#D8CBB8]/15 bg-white/[0.02] text-[#F6F4EF]/85 hover:bg-[#FAF9F5]/5 hover:text-[#A88C52] hover:border-[#A88C52] transition-all duration-300 group shadow-xs select-none"
                >
                  <Mail size={14} className="shrink-0 text-[#8A98A6] group-hover:text-[#A88C52] transition-colors" />
                  <span className="text-[11px] tracking-wide font-mono truncate lowercase">{settings.email}</span>
                </a>
              )}
              
              {/* Instagram Badge */}
              <a 
                href="https://www.instagram.com/the_vedic_himalaya/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram Profile" 
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-[#D8CBB8]/15 bg-white/[0.02] text-[#F6F4EF]/85 hover:bg-[#FAF9F5]/5 hover:text-[#A88C52] hover:border-[#A88C52] transition-all duration-300 group shadow-xs select-none"
              >
                <Instagram size={14} className="text-[#8A98A6] group-hover:text-[#A88C52] transition-colors" />
                <span className="text-[10px] tracking-widest font-mono uppercase font-bold">@the_vedic_himalaya</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer Meta bottom section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] tracking-wider text-[#8A98A6] uppercase font-semibold">
          <p className="text-center sm:text-left font-sans">&copy; {new Date().getFullYear()} {settings.hotel_name || "The Vedic Himalaya Retreat"}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-[#F6F4EF] transition-colors duration-350 font-sans">Privacy Policy</Link>
            <Link to="/terms-of-stay" className="hover:text-[#F6F4EF] transition-colors duration-350 font-sans">Terms of Stay</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
