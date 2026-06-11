import { useState, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function WhatsAppButton() {
  const { settings, loading } = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the chat prompt in this session
    const dismissed = sessionStorage.getItem("whatsapp_prompt_dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  if (loading || !settings.whatsapp_number) {
    return null;
  }

  const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    settings.whatsapp_default_message || "Hi, I want to book a room at The Vedic Himalaya Retreat"
  )}`;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsDismissed(true);
    sessionStorage.setItem("whatsapp_prompt_dismissed", "true");
  };

  const handleChatClick = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    // Also dismiss prompt once they click chat
    setIsOpen(false);
    setIsDismissed(true);
    sessionStorage.setItem("whatsapp_prompt_dismissed", "true");
  };

  return (
    <div className="fixed bottom-6 right-6 z-45 flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && !isDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 w-72 sm:w-80 bg-[#0B1714] border border-[#D8CBB8]/20 shadow-2xl rounded-2xl overflow-hidden relative text-white"
          >
            {/* Header Area */}
            <div className="bg-[#1B4C44] px-4 py-3 flex items-center justify-between border-b border-[#D8CBB8]/15">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <svg className="w-4.5 h-4.5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1B4C44] animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-wide">Concierge Desk</h4>
                  <p className="text-[9px] text-[#D8CBB8]/80 font-medium">Online · Response in minutes</p>
                </div>
              </div>
              <button 
                onClick={handleDismiss} 
                className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg"
                aria-label="Dismiss chat prompt"
              >
                <X size={15} />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-5 space-y-4.5">
              <div className="space-y-2.5 text-slate-200/90 leading-relaxed text-xs font-medium">
                <p>
                  Namaste! 🙏 Welcome to {settings.hotel_name || "The Vedic Himalaya Retreat"}. 
                </p>
                <p>
                  How can we assist you with room bookings, Sattvik dining, or pilgrimage plans today?
                </p>
              </div>

              <button
                onClick={handleChatClick}
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all duration-300 cursor-pointer"
              >
                <Send size={12} />
                <span>Start WhatsApp Chat</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isDismissed ? handleChatClick : () => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 relative group cursor-pointer focus:outline-none border-2 border-white/10"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulsing Outer Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 scale-100 group-hover:animate-ping pointer-events-none" />

        {/* WhatsApp Brand Icon */}
        <svg className="w-7 h-7 relative z-10 transition-transform duration-300 group-hover:rotate-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>

        {/* Dynamic Tooltip Info */}
        <span className="absolute right-16 scale-0 origin-right group-hover:scale-100 transition-all duration-200 bg-[#0B1714] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-2 rounded-lg border border-[#D8CBB8]/15 shadow-lg whitespace-nowrap pointer-events-none">
          Chat With Us
        </span>
      </motion.button>
    </div>
  );
}
