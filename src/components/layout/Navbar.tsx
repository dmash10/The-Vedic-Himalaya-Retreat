import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/Button";

import { useSiteSettings } from "@/hooks/useSiteSettings";

const NAV_LINKS = [
  { name: "The Retreat", href: "/about" },
  { name: "Rooms", href: "/rooms" },
  { name: "Dining", href: "/dining" },
  { name: "Experiences", href: "/experiences" },
  { name: "Weddings", href: "/weddings" },
  { name: "Gallery", href: "/gallery" },
  { name: "Explore", href: "/nearby" },
  { name: "Contact", href: "/contact" },
];

const MOBILE_NAV_LINKS = [
  { name: "Home", href: "/" },
  ...NAV_LINKS,
];

export function Navbar() {
  const { settings } = useSiteSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled((prev) => {
        if (prev !== scrolled) return scrolled;
        return prev;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check on initial load
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isTransparentPage = location.pathname === "/" || location.pathname === "/weddings";
  // Maintain beautiful warm white / mist text for premium visual contrast against dark backgrounds
  const textColor = "text-warm-white";
  const overlayBg = isScrolled || !isTransparentPage ? "bg-[#10231E]/95 backdrop-blur-md border-b border-[#D8CBB8]/15 shadow-xl" : "bg-transparent";
  const buttonVariant = "outline";

  const easePremium = [0.22, 1, 0.36, 1] as const;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${overlayBg} ${isScrolled ? "py-3" : "py-4 md:py-6"}`}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className={`flex flex-col z-50 relative ${textColor}`}>
              <span className="font-heading font-normal text-xl tracking-wider uppercase leading-none">
                <span className="sm:hidden">
                  {settings.hotel_name ? settings.hotel_name.replace(/Retreat/gi, '').trim() : "The Vedic Himalaya"}
                </span>
                <span className="hidden sm:inline">
                  {settings.hotel_name || "The Vedic Himalaya Retreat"}
                </span>
              </span>
              <span className="hidden sm:inline text-[10px] italic opacity-85 mt-1 uppercase tracking-widest text-stone-sand">
                {settings.tagline || "Village Dewar, Guptkashi"}
              </span>
             </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 opacity-80 hover:opacity-100 hover:text-stone-sand ${textColor}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-4 z-50">
              <div className="block">
                <Link to="/rooms">
                  <Button variant={buttonVariant} size="sm" className={`uppercase tracking-[0.15em] text-[9.5px] font-bold px-4 py-2 border border-warm-white/30 text-warm-white hover:bg-warm-white/10 hover:border-stone-sand/50 h-8 sm:h-9`}>
                    Book<span className="hidden sm:inline"> Suite</span>
                  </Button>
                </Link>
              </div>
              <button
                className={`lg:hidden p-2 -mr-2 text-warm-white`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: easePremium }}
            className="fixed inset-0 z-40 bg-[#0A1613] flex flex-col lg:hidden"
          >
            {/* Cinematic background image overlaid slightly */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
               <img src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="mountains" />
            </div>

            <div className="flex flex-col items-center justify-center w-full h-full px-6 py-12 overflow-y-auto">
               <div className="flex flex-col items-center space-y-3.5 sm:space-y-5 text-center py-4">
                  {MOBILE_NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + (i * 0.03), duration: 0.5, ease: easePremium }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="font-heading font-medium text-xl sm:text-2xl text-warm-white/90 hover:text-white transition-colors tracking-tight uppercase block py-1"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
