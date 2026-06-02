import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Shield, Eye, Lock, FileText, ArrowLeft, Heart, Scale, Globe } from "lucide-react";
import { useContent } from "@/hooks/useContent";

export default function PrivacyPolicy() {
  const easePremium = [0.22, 1, 0.36, 1] as const;
  const { getValue } = useContent();

  const title = getValue('privacy', 'privacy_title', 'Privacy Policy');
  const dbContent = getValue('privacy', 'privacy_content', '');

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-slate-charcoal py-24 sm:py-32 select-none">
      <div className="container mx-auto px-6 sm:px-8 max-w-4xl relative">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-12 animate-fade-in">
          <Link 
            to="/" 
            className="group inline-flex items-center gap-2 text-[10px] sm:text-xs text-[#1B4C44] uppercase tracking-widest font-extrabold font-sans hover:text-[#A88C52] transition-colors"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Sanctuary</span>
          </Link>
        </div>

        {/* Header Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easePremium }}
          className="space-y-4 text-left border-b border-[#D8CBB8]/30 pb-10 mb-12"
        >
          <span className="text-[10px] md:text-[11px] font-mono tracking-[0.3em] font-extrabold text-[#A88C52] uppercase block">
            REGULATORY COMPLIANCE // ETHICAL DATA STEWARDSHIP
          </span>
          <h1 className="text-4xl sm:text-6xl font-heading font-light tracking-tight text-slate-charcoal leading-none">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-charcoal/60 uppercase tracking-[0.15em] font-mono font-medium">
            Effective Date: June 2, 2026 // Version 3.0 // Unified Global Standard
          </p>
        </motion.div>

        {/* Content Body */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: easePremium }}
          className="space-y-12 text-left font-sans text-sm sm:text-[15px] leading-relaxed text-slate-charcoal/90 font-light text-justify"
        >
          {dbContent ? (
            <div className="whitespace-pre-line leading-relaxed space-y-6 font-sans">
              {dbContent}
            </div>
          ) : (
            <>
              {/* Introduction */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif text-[#1B4C44] font-normal tracking-wide flex items-center gap-2">
                  <Shield size={18} className="text-[#A88C52] shrink-0" />
                  <span>1. Commitment to Digital Serenity</span>
                </h2>
                <p>
                  At <strong className="font-semibold text-slate-charcoal">The Green Hills Resort</strong>, we guard your personal sanctuary information with the same reverence we hold for the pristine mountain air and ancient deodar woods surrounding our location. We believe that privacy is an essential dimension of spiritual calm.
                </p>
                <p>
                  In compliance with global framework standards including the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and the Digital Personal Data Protection Act (DPDPA) of India, this document details how we collect, process, secure, and respect your personal digital credentials. We strictly enforce a policy of zero commercial monetization, zero data leasing, and absolute transaction confidentiality.
                </p>
              </section>

              {/* Data We Collect */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif text-[#1B4C44] font-normal tracking-wide flex items-center gap-2">
                  <Eye size={18} className="text-[#A88C52] shrink-0" />
                  <span>2. Information Collection Protocol</span>
                </h2>
                <p>
                  To secure your bookings and deliver high-altitude holistic wellness, we collect only the most essential physical and digital indicators:
                </p>
                <div className="space-y-4 bg-stone-50 p-6 rounded-xl border border-[#D8CBB8]/20">
                  <div>
                    <h4 className="font-bold text-[#1B4C44] text-xs sm:text-sm uppercase tracking-wide">A. Personal Identification & Government Compliance</h4>
                    <p className="text-xs sm:text-sm text-slate-charcoal/80 mt-1">
                      Legal name, billing coordinates, telephone numbers, and email contacts. For foreign national arrivals, passport details, visa registers, and Form C reporting records are mandatory under Indian local intelligence and police commissioner protocols. For resident citizens, a valid government photo identification (Aadhaar, PAN, or Passport) is requested upon arrival.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1B4C44] text-xs sm:text-sm uppercase tracking-wide">B. Sanctuary Experience & Dietary Preferences</h4>
                    <p className="text-xs sm:text-sm text-slate-charcoal/80 mt-1">
                      Your chosen cabin specifications, arrival schedules, dietary requirements (such as vegetarian, gluten-free, or specific allergen metrics), and astrological alignment inquiry data to customize private yoga practices.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1B4C44] text-xs sm:text-sm uppercase tracking-wide">C. Technical & Navigational Parameters</h4>
                    <p className="text-xs sm:text-sm text-slate-charcoal/80 mt-1">
                      Anonymized browser identifiers, network IP locations, and basic search metrics gathered strictly to sustain the performance of our online reservation channels and cookie preferences.
                    </p>
                  </div>
                </div>
              </section>

              {/* Processing Purpose */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif text-[#1B4C44] font-normal tracking-wide flex items-center gap-2">
                  <Globe size={18} className="text-[#A88C52] shrink-0" />
                  <span>3. Intended Processing & Legal Basis</span>
                </h2>
                <p>
                  Every piece of personal data processed by the retreat is anchored on legitimate, lawful grounds:
                </p>
                <div className="list-decimal list-inside pl-4 space-y-3.5 text-xs sm:text-sm">
                  <li><strong className="font-semibold text-[#1B4C44]">Contractual Execution:</strong> To validate, hold, update, and manage your reservation bookings, transaction settlements, and room logs.</li>
                  <li><strong className="font-semibold text-[#1B4C44]">Physical Safeguarding:</strong> To pass vital allergy and health logs directly to our kitchen team, ensuring absolute wellness at our 6,500 ft elevation.</li>
                  <li><strong className="font-semibold text-[#1B4C44]">Legal Compliance:</strong> To report mandatory arrival logs of international travelers to the Ministry of Home Affairs Bureau of Immigration in India.</li>
                  <li><strong className="font-semibold text-[#1B4C44]">Consent-Based Updates:</strong> To share retreat announcements or voluntary seasonal packages, only when you have explicitly requested notifications.</li>
                </div>
              </section>

              {/* Data Security */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif text-[#1B4C44] font-normal tracking-wide flex items-center gap-2">
                  <Lock size={18} className="text-[#A88C52] shrink-0" />
                  <span>4. Cryptographic Defenses & Storage Control</span>
                </h2>
                <p>
                  Your data resides in high-integrity cloud storage networks utilizing modern secure socket layers (TLS 1.3/SSL encryption) during transit. Database instances are fully segregated with complex cryptographic keys and strict permission layers to block unauthorized intrusion.
                </p>
                <p>
                  We keep your records only for as long as is necessary to complete your stay, maintain legal tax records, or satisfy regulatory immigration registers. All offline documentation is stored in keycard-controlled corporate resort storage accessible only to elite, vetted operational staff.
                </p>
              </section>

              {/* Cookie Disclosure */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif text-[#1B4C44] font-normal tracking-wide flex items-center gap-2">
                  <FileText size={18} className="text-[#A88C52] shrink-0" />
                  <span>5. Cookie and Analytics Disclosure</span>
                </h2>
                <p>
                  Our website relies on minimal, privacy-compliant cookies. These are tiny strings of information stored on your local browser:
                </p>
                <ul className="list-disc list-inside pl-4 space-y-2 text-xs sm:text-sm">
                  <li><strong className="font-semibold text-[#1B4C44]">Essential Cookies:</strong> Critical for reserving suites, preserving payment states, and keeping layouts consistent.</li>
                  <li><strong className="font-semibold text-[#1B4C44]">Analytics & Memory Cookies:</strong> Provide completely anonymized, aggregate traffic counts to let us improve page loading speeds and layout flows.</li>
                </ul>
                <p>
                  You are fully empowered to adjust, clear, or reject analytics and memory cookies through our simple, off-white Cookie Consent manager or your browser's private privacy configurations at any time.
                </p>
              </section>

              {/* User Rights */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif text-[#1B4C44] font-normal tracking-wide flex items-center gap-2">
                  <Scale size={18} className="text-[#A88C52] shrink-0" />
                  <span>6. Your Sovereign Digital Rights</span>
                </h2>
                <p>
                  Regardless of your place of residence, the retreat accords you absolute sovereignty over your digital footprint. You have the right to request access to the personal records we hold, request corrections to incomplete information, withdraw your consent for email updates, or request total erasure of your personal files from our servers.
                </p>
                <p>
                  For all data requests, digital disclosures, or queries regarding immigration reporting, please coordinate with our privacy team at: <span className="italic font-semibold text-[#1B4C44] underline hover:text-[#A88C52] transition-colors">stay@greenhillsresort.com</span>. We pledge to address and satisfy all lawful requests within 30 business days.
                </p>
              </section>

              <section className="p-6 sm:p-8 bg-[#EFEAE1]/50 border border-[#D8CBB8]/30 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#1B4C44] font-extrabold">
                  <Heart size={14} className="text-[#A88C52] fill-current" />
                  <span>Sanctuary Commitment</span>
                </div>
                <p className="text-xs text-slate-charcoal/70 leading-relaxed italic">
                  "To preserve the absolute purity, peace, and spiritual frequencies of the sanctuary, we conduct our digital footprint and regulatory procedures with the highest tier of ethics, care, and respectful silence."
                </p>
              </section>
            </>
          )}
        </motion.div>

        {/* Elegant Footer Details */}
        <div className="mt-16 pt-8 border-t border-[#D8CBB8]/20 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono tracking-widest text-slate-charcoal/40 gap-4">
          <span>THE GREEN HILLS RESORT // VILLAGE DEWAR GUPTKASHI</span>
          <span>© {new Date().getFullYear()} ALL CITATIONS RESERVED</span>
        </div>

      </div>
    </div>
  );
}
