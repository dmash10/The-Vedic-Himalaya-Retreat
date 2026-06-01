import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Cookie, ShieldAlert, Check, X, ChevronRight, Settings } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  
  // Consent categories
  const [consent, setConsent] = useState({
    necessary: true, // Always true
    analytics: true,
    functional: true,
  });

  useEffect(() => {
    // Check if user has already made a decision
    const savedConsent = localStorage.getItem("vedic_cookie_consent");
    if (!savedConsent) {
      // Show the banner with a slight delay for aesthetic flow
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const fullConsent = { necessary: true, analytics: true, functional: true };
    localStorage.setItem("vedic_cookie_consent", JSON.stringify(fullConsent));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("vedic_cookie_consent", JSON.stringify(consent));
    setIsVisible(false);
  };

  const handleDeclineAll = () => {
    const essentialOnly = { necessary: true, analytics: false, functional: false };
    localStorage.setItem("vedic_cookie_consent", JSON.stringify(essentialOnly));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 sm:bottom-6 right-4 left-4 sm:left-auto sm:max-w-md md:max-w-lg bg-[#0B1714]/95 backdrop-blur-md border border-[#D8CBB8]/25 text-[#FAF9F5] rounded-2xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] z-50 font-sans"
        >
          {/* Subtle light highlighting glint */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D8CBB8]/30 to-transparent pointer-events-none" />

          {!showPreferences ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-left">
                <div className="p-2 bg-[#1B4C44] rounded-xl border border-[#D8CBB8]/15 text-[#A88C52] shrink-0 mt-0.5">
                  <Cookie size={18} strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold tracking-wide uppercase text-[#FAF9F5] font-sans flex items-center gap-1.5">
                    <span>Sanctuary Cookies</span>
                    <span className="text-[8px] bg-[#A88C52]/20 text-[#D8CBB8] px-2 py-0.5 font-bold rounded-full font-mono tracking-widest uppercase">
                      SECURE
                    </span>
                  </h4>
                  <p className="text-[11.5px] sm:text-xs text-[#FAF9F5]/80 leading-relaxed font-light">
                    We utilize delicate, privacy-safe analytics & essential session cookies to improve culinary booking performance, respect coordinates navigation, and sustain the atmospheric flow of our high-altitude sanctuary retreat.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col xs:flex-row gap-2 pt-2 text-[10px] sm:text-[10.5px] tracking-widest font-mono font-extrabold uppercase">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-[#1B4C44] hover:bg-[#FAF9F5] text-white hover:text-[#0B1714] py-2.5 rounded-xl border border-[#1B4C44] transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <Check size={12} strokeWidth={2.5} />
                  <span>Accept All</span>
                </button>
                <button
                  onClick={() => setShowPreferences(true)}
                  className="flex-1 bg-transparent hover:bg-white/5 text-[#FAF9F5]/80 py-2.5 rounded-xl border border-white/10 transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                >
                  <Settings size={12} strokeWidth={1.5} />
                  <span>Customize</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-[#FAF9F5]/40 uppercase tracking-widest select-none">
                <div className="flex items-center gap-2">
                  <Link to="/privacy-policy" className="hover:text-[#D8CBB8] transition-colors underline">Privacy Policy</Link>
                  <span>•</span>
                  <Link to="/terms-of-stay" className="hover:text-[#D8CBB8] transition-colors underline">Terms</Link>
                </div>
                <button 
                  onClick={handleDeclineAll}
                  className="hover:text-red-400 font-bold transition-colors uppercase border-b border-dashed border-white/10 cursor-pointer"
                >
                  Essential Only
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-[#D8CBB8] flex items-center gap-1.5">
                  <Settings size={13} className="text-[#A88C52]" />
                  <span>Preference Settings</span>
                </h4>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="p-1 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-3 pt-1 text-left">
                {/* Category 1 */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <span className="text-[11px] font-bold text-[#F6F4EF] uppercase tracking-wider block">Essential Session</span>
                    <span className="text-[10px] text-white/60 leading-none">Access tokens & room reservation metadata.</span>
                  </div>
                  <div className="text-[9px] font-mono tracking-widest bg-white/10 text-white/40 px-2 py-1 rounded-sm uppercase font-extrabold select-none">
                    MANDATORY
                  </div>
                </div>

                {/* Category 2 */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <span className="text-[11px] font-bold text-[#F6F4EF] uppercase tracking-wider block">Astrological & Analytics</span>
                    <span className="text-[10px] text-white/60 leading-none">Anonymized maps and custom inquiry logs.</span>
                  </div>
                  <button
                    onClick={() => setConsent(c => ({ ...c, analytics: !c.analytics }))}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[9px] font-bold tracking-wider uppercase transition-colors cursor-pointer border ${
                      consent.analytics 
                        ? "bg-[#1B4C44] border-[#1B4C44] text-[#FAF9F5]" 
                        : "bg-white/5 border-white/10 text-white/40"
                    }`}
                  >
                    {consent.analytics ? "ACTIVE" : "DISABLED"}
                  </button>
                </div>

                {/* Category 3 */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <span className="text-[11px] font-bold text-[#F6F4EF] uppercase tracking-wider block">Functional Memories</span>
                    <span className="text-[10px] text-white/60 leading-none">Preserving layout preferences and light themes.</span>
                  </div>
                  <button
                    onClick={() => setConsent(c => ({ ...c, functional: !c.functional }))}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[9px] font-bold tracking-wider uppercase transition-colors cursor-pointer border ${
                      consent.functional 
                        ? "bg-[#1B4C44] border-[#1B4C44] text-[#FAF9F5]" 
                        : "bg-white/5 border-white/10 text-white/40"
                    }`}
                  >
                    {consent.functional ? "ACTIVE" : "DISABLED"}
                  </button>
                </div>
              </div>

              {/* Preference controls bottom */}
              <div className="flex items-center gap-2 text-[9px] font-mono font-extrabold uppercase pt-2">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-[#FAF9F5] py-2.5 rounded-xl border border-white/10 transition-all cursor-pointer text-center"
                >
                  Back
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-[#1B4C44] text-white py-2.5 rounded-xl border border-[#1B4C44] hover:bg-white hover:text-[#0B1714] transition-all cursor-pointer text-center"
                >
                  Save Choices
                </button>
              </div>
            </div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
}
