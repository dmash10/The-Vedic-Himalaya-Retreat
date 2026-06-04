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
            <div className="flex flex-col gap-3.5 max-w-sm">
              {/* Location */}
              <a 
                href={settings.google_maps_url || "https://maps.google.com/?q=Village+Dewar+Guptkashi"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-[#F6F4EF]/80 hover:text-[#A88C52] transition-colors duration-300 group"
              >
                <MapPin size={15} className="shrink-0 mt-0.5 text-[#8A98A6] group-hover:text-[#A88C52] transition-colors" />
                <span className="leading-snug text-xs font-sans">
                  {settings.address || "Village Dewar, Guptkashi, Kedarnath Route"}
                </span>
              </a>

              {/* Direct WhatsApp */}
              <a 
                href={`https://wa.me/${settings.whatsapp_number || "918126573560"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#F6F4EF]/80 hover:text-[#A88C52] transition-colors duration-300 group"
              >
                <svg className="h-[15px] w-[15px] shrink-0 text-[#8A98A6] group-hover:text-[#25D366] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="text-xs font-mono font-bold">+{settings.whatsapp_number || "918126573560"}</span>
              </a>

              {/* Phone 1 */}
              {settings.primary_phone && (
                <a 
                  href={`tel:${settings.primary_phone.replace(/\s+/g, '')}`} 
                  className="flex items-center gap-3 text-[#F6F4EF]/80 hover:text-[#A88C52] transition-colors duration-300 group"
                >
                  <Phone size={14} className="shrink-0 text-[#8A98A6] group-hover:text-[#A88C52] transition-colors" />
                  <span className="text-xs tracking-wider font-mono font-bold">{settings.primary_phone}</span>
                </a>
              )}

              {/* Phone 2 */}
              {settings.secondary_phone && (
                <a 
                  href={`tel:${settings.secondary_phone.replace(/\s+/g, '')}`} 
                  className="flex items-center gap-3 text-[#F6F4EF]/80 hover:text-[#A88C52] transition-colors duration-300 group"
                >
                  <Phone size={14} className="shrink-0 text-[#8A98A6] group-hover:text-[#A88C52] transition-colors" />
                  <span className="text-xs tracking-wider font-mono font-bold">{settings.secondary_phone}</span>
                </a>
              )}

              {/* Email */}
              {settings.email && (
                <a 
                  href={`mailto:${settings.email}`} 
                  className="flex items-center gap-3 text-[#F6F4EF]/80 hover:text-[#A88C52] transition-colors duration-300 group"
                >
                  <Mail size={14} className="shrink-0 text-[#8A98A6] group-hover:text-[#A88C52] transition-colors" />
                  <span className="text-xs tracking-wide font-mono truncate lowercase">{settings.email}</span>
                </a>
              )}
              
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/the_vedic_himalaya/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram Profile" 
                className="flex items-center gap-3 text-[#F6F4EF]/80 hover:text-[#A88C52] transition-colors duration-300 group"
              >
                <Instagram size={14} className="shrink-0 text-[#8A98A6] group-hover:text-[#A88C52] transition-colors" />
                <span className="text-xs tracking-widest font-mono uppercase font-bold">@the_vedic_himalaya</span>
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
