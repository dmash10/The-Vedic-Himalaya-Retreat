import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Cookie, Check, X, Settings } from "lucide-react";

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
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-[340px] md:max-w-[380px] bg-[#FAF9F5] border border-[#D8CBB8]/70 text-[#2E3438] rounded-xl p-4 sm:p-5 shadow-[0_12px_36px_rgba(46,52,56,0.12)] z-50 font-sans"
        >
          {!showPreferences ? (
            <div className="space-y-3.5">
              <div className="flex items-start gap-2.5 text-left">
                <div className="p-1.5 bg-[#FAF9F5] rounded-lg border border-[#D8CBB8]/40 text-[#A88C52] shrink-0 mt-0.5">
                  <Cookie size={16} strokeWidth={1.5} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold tracking-wider uppercase text-[#1B4C44] font-sans flex items-center gap-1.5">
                    <span>Sanctuary Cookies</span>
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#2E3438]/85 leading-relaxed font-light font-sans">
                    We use cookies to improve booking performance, respect navigation parameters, and support the peaceful digital flow of our sanctuary retreat.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-1 text-[9.5px] tracking-widest font-mono font-bold uppercase">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-[#1B4C44] hover:bg-[#A88C52] text-white py-2 rounded-lg border border-transparent transition-colors duration-300 cursor-pointer text-center flex items-center justify-center gap-1"
                >
                  <Check size={11} strokeWidth={2.5} />
                  <span>Accept All</span>
                </button>
                <button
                  onClick={() => setShowPreferences(true)}
                  className="flex-1 bg-white hover:bg-stone-50 text-[#2E3438] py-2 rounded-lg border border-stone-300 transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                >
                  <Settings size={11} strokeWidth={1.5} />
                  <span>Customize</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 text-[9px] font-mono text-stone-500 uppercase tracking-widest select-none">
                <div className="flex items-center gap-1.5">
                  <Link to="/privacy-policy" className="hover:text-[#A88C52] transition-colors underline">Privacy Policy</Link>
                  <span>•</span>
                  <Link to="/terms-of-stay" className="hover:text-[#A88C52] transition-colors underline">Terms</Link>
                </div>
                <button 
                  onClick={handleDeclineAll}
                  className="hover:text-[#A88C52] font-bold transition-colors uppercase border-b border-dashed border-stone-300 cursor-pointer"
                >
                  Decline
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <h4 className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#1B4C44] flex items-center gap-1">
                  <Settings size={12} className="text-[#A88C52]" />
                  <span>Preference Settings</span>
                </h4>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="p-0.5 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>

              <div className="space-y-2 text-left">
                {/* Category 1 */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                  <div>
                    <span className="text-[10.5px] font-bold text-[#1B4C44] uppercase tracking-wider block">Essential Session</span>
                    <span className="text-[9.5px] text-stone-500 leading-none block">Reservation & payment access logs.</span>
                  </div>
                  <div className="text-[8.5px] font-mono tracking-widest bg-stone-200/50 text-stone-500 px-1.5 py-0.5 rounded uppercase font-bold select-none">
                    MANDATORY
                  </div>
                </div>

                {/* Category 2 */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                  <div>
                    <span className="text-[10.5px] font-bold text-[#1B4C44] uppercase tracking-wider block">Analytics</span>
                    <span className="text-[9.5px] text-stone-500 leading-none block">Anonymized page counts and guides statistics.</span>
                  </div>
                  <button
                    onClick={() => setConsent(c => ({ ...c, analytics: !c.analytics }))}
                    className={`px-2 py-1 rounded font-mono text-[8.5px] font-bold tracking-wider uppercase transition-colors cursor-pointer border ${
                      consent.analytics 
                        ? "bg-[#1B4C44] border-transparent text-white" 
                        : "bg-white border-stone-300 text-stone-400 hover:bg-stone-50"
                    }`}
                  >
                    {consent.analytics ? "ACTIVE" : "DISABLED"}
                  </button>
                </div>

                {/* Category 3 */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                  <div>
                    <span className="text-[10.5px] font-bold text-[#1B4C44] uppercase tracking-wider block">Functional Memories</span>
                    <span className="text-[9.5px] text-stone-500 leading-none block">Preserves specific theme parameters.</span>
                  </div>
                  <button
                    onClick={() => setConsent(c => ({ ...c, functional: !c.functional }))}
                    className={`px-2 py-1 rounded font-mono text-[8.5px] font-bold tracking-wider uppercase transition-colors cursor-pointer border ${
                      consent.functional 
                        ? "bg-[#1B4C44] border-transparent text-white" 
                        : "bg-white border-stone-300 text-stone-400 hover:bg-stone-50"
                    }`}
                  >
                    {consent.functional ? "ACTIVE" : "DISABLED"}
                  </button>
                </div>
              </div>

              {/* Preference controls bottom */}
              <div className="flex items-center gap-2 text-[9px] font-mono font-bold uppercase pt-1">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="flex-1 bg-white hover:bg-stone-50 text-[#2E3438] py-2 rounded-lg border border-stone-300 transition-colors cursor-pointer text-center"
                >
                  Back
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-[#1B4C44] hover:bg-[#A88C52] text-white py-2 rounded-lg border border-transparent transition-colors cursor-pointer text-center"
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
