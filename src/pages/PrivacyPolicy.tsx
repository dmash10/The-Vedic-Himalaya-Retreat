import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Shield, Eye, Lock, FileText, ArrowLeft, Heart } from "lucide-react";
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
            REGULATORY COMPLIANCE // ETHICAL STEWARDSHIP
          </span>
          <h1 className="text-4xl sm:text-6xl font-heading font-light tracking-tight text-slate-charcoal leading-none">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-charcoal/60 uppercase tracking-[0.15em] font-mono font-medium">
            Effective Date: May 31, 2026 // Version 1.2
          </p>
        </motion.div>

        {/* Content Body */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: easePremium }}
          className="space-y-12 text-left font-sans text-sm sm:text-[15px] leading-relaxed text-slate-charcoal/90 font-light"
        >
          {dbContent ? (
            <div className="whitespace-pre-line leading-relaxed space-y-6 font-sans">
              {dbContent}
            </div>
          ) : (
            <>
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif text-[#1B4C44] font-normal tracking-wide flex items-center gap-2">
                  <Shield size={18} className="text-[#A88C52] shrink-0" />
                  <span>1. Ethical Stewardship of Information</span>
                </h2>
                <p>
                  At <strong className="font-semibold text-slate-charcoal">The Vedic Himalaya Retreat</strong>, we guard your personal sanctuary information with the same reverence we hold for the beautiful mountain deodar surrounding us. We believe in complete transparency, zero spam, and absolute confidentiality regarding your pilgrimage logs, room specifications, and dietary requests.
                </p>
                <p>
                  We only collect information that is strictly essential for your booking, custom regional sattvik meal plans, celestial astrological inquiries, or to process local entry permits required along the sacred route of Kedarnath.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif text-[#1B4C44] font-normal tracking-wide flex items-center gap-2">
                  <Eye size={18} className="text-[#A88C52] shrink-0" />
                  <span>2. Personal Attributes We Collect</span>
                </h2>
                <p>
                  When navigating our reservation tools, we secure:
                </p>
                <ul className="list-disc list-inside pl-4 space-y-2.5 text-xs sm:text-sm">
                  <li><strong className="font-semibold">Identification Metrics:</strong> Legal names, phone coordinates, email directions, and government passport/Aadhaar credentials (required by official district administration for high-altitude pilgrimage registers).</li>
                  <li><strong className="font-semibold">Sanctuary Settings:</strong> Room tier preference, date intervals, custom physical therapy options, and local trekking specifications.</li>
                  <li><strong className="font-semibold">Vitality Logistics:</strong> Particular allergen records, nutritional choices, and medical conditions necessary to safeguard your well-being on our 6,500 ft. sanctuary altitude.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif text-[#1B4C44] font-normal tracking-wide flex items-center gap-2">
                  <Lock size={18} className="text-[#A88C52] shrink-0" />
                  <span>3. Data Security & Storage Controls</span>
                </h2>
                <p>
                  Your personal information is saved within modern databases protected by secure transport layers (TLS 1.3) and active database-level rules. Our servers are configured with automated backups, strict role-based firewalls, and are managed in high-security environments to prevent unauthorized leaks or physical compromises.
                </p>
                <p>
                  We never trade, loan, or monetize your reservation records. Only authorized executive sanctuary management and booking crews have access to your details, strictly on a need-to-know basis.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif text-[#1B4C44] font-normal tracking-wide flex items-center gap-2">
                  <FileText size={18} className="text-[#A88C52] shrink-0" />
                  <span>4. Your Control Rights</span>
                </h2>
                <p>
                  Under international guidelines, guests retain complete ownership of their digital profile. Upon written request to <span className="italic underline text-[#1B4C44] hover:text-[#A88C52] transition-colors">stay@vedichimalaya.com</span>, you can request an export of your information dashboard, demand immediate total erasure of all records (except where retention is required of luxury hotels by government administrative statutes), or restrict specific analytical processing cookies.
                </p>
              </section>

              <section className="p-6 sm:p-8 bg-[#EFEAE1]/50 border border-[#D8CBB8]/30 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#1B4C44] font-extrabold">
                  <Heart size={14} className="text-[#A88C52] fill-current" />
                  <span>Sanctuary Commitment</span>
                </div>
                <p className="text-xs text-slate-charcoal/70 leading-relaxed italic">
                  "To preserve the absolute purity, peace, and spiritual frequencies of the Vedic sanctuary, we conduct our digital footprint and regulatory procedures with the highest tier of ethics, care, and respectful silence."
                </p>
              </section>
            </>
          )}
        </motion.div>

        {/* Elegant Footer Details */}
        <div className="mt-16 pt-8 border-t border-[#D8CBB8]/20 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono tracking-widest text-slate-charcoal/40 gap-4">
          <span>VEDIC HIMALAYA // SEMI GUPTKASHI SANCTUARY</span>
          <span>© {new Date().getFullYear()} ALL CITATIONS RESERVED</span>
        </div>

      </div>
    </div>
  );
}
