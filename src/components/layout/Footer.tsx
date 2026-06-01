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
                {settings.hotel_name || "Vedic Himalaya"}
              </span>
              <span className="italic text-[#D8CBB8] text-sm tracking-wide">
                {settings.tagline || "Retreat Semi Guptkashi"}
              </span>
            </div>
            <p className="text-[#F6F4EF]/70 text-sm leading-relaxed max-w-xs font-normal font-sans">
              A premium, atmospheric mountain sanctuary on the sacred Kedarnath Route, offering cinematic view portals and Himalayan calm.
            </p>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="space-y-4 col-span-1">
            <h4 className="font-heading uppercase tracking-[0.18em] text-xs text-[#D8CBB8] font-semibold">
              The Sanctuary
            </h4>
            <div className="flex flex-col space-y-2.5 text-sm">
              <Link to="/about" className="hover:text-deep-teal-500 transition-colors duration-300 w-fit">The Retreat</Link>
              <Link to="/rooms" className="hover:text-deep-teal-500 transition-colors duration-300 w-fit">Rooms & Suites</Link>
              <Link to="/dining" className="hover:text-deep-teal-500 transition-colors duration-300 w-fit">Dining Experience</Link>
              <Link to="/gallery" className="hover:text-deep-teal-500 transition-colors duration-300 w-fit">Visual Gallery</Link>
            </div>
          </div>

          {/* Column 3: Destination Experience */}
          <div className="space-y-4 col-span-1">
            <h4 className="font-heading uppercase tracking-[0.18em] text-xs text-[#D8CBB8] font-semibold">
              Experiences
            </h4>
            <div className="flex flex-col space-y-2.5 text-sm">
              <Link to="/experiences" className="hover:text-deep-teal-500 transition-colors duration-300 w-fit text-[#FAF9F5] font-medium">Guided Activities</Link>
              <Link to="/weddings" className="hover:text-deep-teal-500 transition-colors duration-300 w-fit">Destination Weddings</Link>
              <Link to="/nearby" className="hover:text-deep-teal-500 transition-colors duration-300 w-fit">Kedarnath Route</Link>
              <Link to="/rooms" className="hover:text-deep-teal-500 transition-colors duration-300 w-fit">Reservations</Link>
            </div>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-4 col-span-2 lg:col-span-1 pt-4 sm:pt-0 border-t border-[#D8CBB8]/10 sm:border-0">
            <h4 className="font-heading uppercase tracking-[0.18em] text-xs text-[#D8CBB8] font-semibold">
              Get in Touch
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5 group">
                <MapPin size={16} className="shrink-0 mt-0.5 text-[#8A98A6]" />
                <span className="leading-snug text-[#F6F4EF]/75 font-sans">{settings.address || "SEMI VILLAGE, Kedarnath Rd, Kund, Guptkashi, Uttarakhand 246495"}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {settings.primary_phone && (
                  <a href={`tel:${settings.primary_phone.replace(/\s+/g, '')}`} className="flex items-center gap-2.5 hover:text-deep-teal-500 transition-colors duration-300 group">
                    <Phone size={15} className="shrink-0 text-[#8A98A6] group-hover:text-deep-teal-500 transition-colors" />
                    <span className="text-[#F6F4EF]/75 font-sans">{settings.primary_phone}</span>
                  </a>
                )}
                {settings.secondary_phone && (
                  <a href={`tel:${settings.secondary_phone.replace(/\s+/g, '')}`} className="flex items-center gap-2.5 hover:text-deep-teal-500 transition-colors duration-300 group pl-[25px]">
                    <span className="text-[#F6F4EF]/75 font-sans">{settings.secondary_phone}</span>
                  </a>
                )}
                {settings.tertiary_phone && (
                  <a href={`tel:${settings.tertiary_phone.replace(/\s+/g, '')}`} className="flex items-center gap-2.5 hover:text-deep-teal-500 transition-colors duration-300 group pl-[25px]">
                    <span className="text-[#F6F4EF]/75 font-sans">{settings.tertiary_phone}</span>
                  </a>
                )}
              </div>
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2.5 hover:text-deep-teal-500 transition-colors duration-300 group">
                  <Mail size={15} className="shrink-0 text-[#8A98A6] group-hover:text-deep-teal-500 transition-colors" />
                  <span className="text-[#F6F4EF]/75 truncate font-sans">{settings.email}</span>
                </a>
              )}
              
              <div className="pt-2 flex items-center gap-3">
                <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full border border-[#D8CBB8]/20 flex items-center justify-center text-[#F6F4EF]/70 hover:bg-[#FAF9F5]/5 hover:text-deep-teal-500 hover:border-deep-teal-500 transition-all duration-300">
                  <Instagram size={15} />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Meta bottom section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] tracking-wider text-[#8A98A6] uppercase font-semibold">
          <p className="text-center sm:text-left font-sans">&copy; {new Date().getFullYear()} {settings.hotel_name || "The Vedic Himalaya Retreat"}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/admin" className="hover:text-[#F6F4EF] transition-colors duration-350 font-sans">Admin Console</Link>
            <Link to="/privacy-policy" className="hover:text-[#F6F4EF] transition-colors duration-350 font-sans">Privacy Policy</Link>
            <Link to="/terms-of-stay" className="hover:text-[#F6F4EF] transition-colors duration-350 font-sans">Terms of Stay</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
