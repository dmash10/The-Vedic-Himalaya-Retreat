import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Coffee, Flame, Compass, Heart, ArrowLeft, Leaf, ShieldAlert, AlertTriangle } from "lucide-react";
import { useContent } from "@/hooks/useContent";

export default function TermsOfStay() {
  const easePremium = [0.22, 1, 0.36, 1] as const;
  const { getValue } = useContent();

  const title = getValue('terms', 'terms_title', 'Terms of Stay');
  const dbContent = getValue('terms', 'terms_content', '');

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
            <span>Return to Home</span>
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
            REGULATORY BOUNDARIES // GUEST PROTOCOLS & CODES
          </span>
          <h1 className="text-4xl sm:text-6xl font-heading font-light tracking-tight text-slate-charcoal leading-none">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-charcoal/60 uppercase tracking-[0.15em] font-mono font-medium">
            Effective Date: June 2, 2026 // Version 3.0 // Unified Code of Conduct
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
              <p className="text-xs sm:text-sm text-slate-charcoal/80 leading-relaxed font-sans italic border-l-2 border-[#A88C52] pl-4 py-1">
                Welcome to The Vedic Himalaya Retreat. By scheduling a reservation, executing payments, or entering our retreat grounds at Village Dewar, Guptkashi, you unconditionally agree to respect the physical, environmental, and ethical principles outlined below. These rules ensure the safety and quiet environment of all residents and pilgrims.
              </p>

              {/* Section 1: Pure Vegetarian Codes */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif text-[#1B4C44] font-normal tracking-wide flex items-center gap-2">
                  <Leaf size={18} className="text-[#A88C52] shrink-0" />
                  <span>1. Pure Vegetarian & Spiritual Guidelines</span>
                </h2>
                <p>
                  To preserve the sacred vibrations, peaceful atmosphere, and spiritual frequency of our retreat grounds, we observe strict vegetarian and peaceful discipline throughout our boundaries. Guests must strictly respect these parameters:
                </p>
                <ul className="list-disc list-inside pl-4 space-y-2.5 text-xs sm:text-sm text-[#2E3438]/90">
                  <li>
                    <strong className="font-semibold text-[#1B4C44]">Pure Vegetarianism:</strong> Non-vegetarian foods of any type, including poultry, seafood, red meats, or items containing animal fats/eggs, are strictly prohibited from being brought inside or consumed anywhere on retreat grounds.
                  </li>
                  <li>
                    <strong className="font-semibold text-[#1B4C44]">No Alcohol or Narcotics:</strong> Under no condition should any alcoholic cocktails, beers, spirits, or psychotropics be imported, possessed, or ingested within the retreat complex.
                  </li>
                  <li>
                    <strong className="font-semibold text-[#1B4C44]">Smoke-Free Alpine Air:</strong> Tobacco smoking, vaping, or electronic nicotine pipes are strictly forbidden in all pine suites, private dining areas, and terraces to keep the fresh mountain oxygen crystalline.
                  </li>
                </ul>
                <div className="flex items-start gap-2 bg-red-50 p-4 border border-red-200/80 rounded-xl text-xs text-red-800 font-sans font-medium tracking-wide">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>
                    (!) VIOLATION OF THESE PARAMETERS LEADS TO IMMEDIATE REVOCATION OF RESERVATION STATUS AND IMMEDIATE ESCORTED EVICTION WITHOUT REFUND. A LIQUIDATED CLEANING FEE OF INR 15,000 WILL BE ASSESSED FOR ROOM SANITIZATION IN THE EVENT OF SMOKING.
                  </span>
                </div>
              </section>

              {/* Section 2: High Altitude Liability */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif text-[#1B4C44] font-normal tracking-wide flex items-center gap-2">
                  <ShieldAlert size={18} className="text-[#A88C52] shrink-0" />
                  <span>2. High-Altitude Health & Wellness Liability Waiver</span>
                </h2>
                <p>
                  The Vedic Himalaya Retreat lies at an elevation exceeding <strong className="font-semibold">6,500 feet (1,980 meters)</strong> above sea level on the rugged Kedarnath route. Guests acknowledge that this climate involves atmospheric differences, steeper trekking gradients, lower oxygen levels, and remote mountain surroundings.
                </p>
                <p>
                  By checking in, you certify that you are in suitable physical condition for high-altitude activities, carry your own necessary medical prescriptions, and have consulted medical practitioners prior to taking high-intensity spiritual walks or embarking on the Kedarnath pilgrimage path. The retreat management operates as an ethical shelter but accepts zero financial liability for physiological events, altitude symptoms (AMS), medical emergencies, or natural environmental constraints.
                </p>
              </section>

              {/* Section 3: Arrival Compliance */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif text-[#1B4C44] font-normal tracking-wide flex items-center gap-2">
                  <Coffee size={18} className="text-[#A88C52] shrink-0" />
                  <span>3. Arrival Specifications, Form C & Check-In</span>
                </h2>
                <p>
                  For legal compliance with the regional Garhwal Commissionerate regulations, valid government-issued photographic credentials (<strong className="font-semibold">Aadhaar card for Indian citizens; passport and valid entry visa for international travelers</strong>) must be physical presented during arrival registration.
                </p>
                <p>
                  Under Indian intelligence rules, all foreign passport holders must complete Form C registration within 24 hours of arrival. We reserve the right to deny check-in to any visitor failing to provide valid credentials.
                </p>
                <p>
                  Check-in is active starting at <strong className="font-semibold">2:00 PM IST</strong>, and check-out completes by <strong className="font-semibold">11:00 AM IST</strong> to allow our team to properly purify the custom pinewood suites for subsequent incoming spiritual seekers.
                </p>
              </section>

              {/* Section 4: Quiet Hours */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif text-[#1B4C44] font-normal tracking-wide flex items-center gap-2">
                  <Flame size={18} className="text-[#A88C52] shrink-0" />
                  <span>4. Quiet Hours</span>
                </h2>
                <p>
                  We honor the mountain stillness. Quiet hours are implemented starting from <strong className="font-semibold">10:00 PM to 7:00 AM</strong>. Media devices, speakers, high-decibel chatter, or structural gatherings must be transitioned into complete silence or enjoyed in private, isolated suites during these intervals to safeguard the resting cycle of the surrounding wildlife and meditation schedules.
                </p>
              </section>

              {/* Section 5: Cancellations & Force Majeure */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif text-[#1B4C44] font-normal tracking-wide flex items-center gap-2">
                  <Compass size={18} className="text-[#A88C52] shrink-0" />
                  <span>5. Bespoke Booking, Cancellation & Force Majeure Policies</span>
                </h2>
                <p>
                  Because our retreat maintains a limited, bespoke room count of high-end wood cabins, bookings cancelled <strong className="font-semibold">30 days or more</strong> prior to arrival receive a full refund minus a 5% handling tax. Cancellations made between <strong className="font-semibold">15 and 30 days</strong> receive a 50% reservation refund. Bookings cancelled <strong className="font-semibold">within 14 days</strong> of check-in are completely non-refundable.
                </p>
                <p>
                  Landslides, torrential rains, cloudbursts, earthquakes, route blockages along the Rudraprayag mountains, or government-imposed travel constraints constitute <strong className="font-semibold">Force Majeure</strong>. In such occurrences, the retreat is not financially liable for disrupted check-ins or forced cancellations, but under resort management approval, we may issue rescheduling credits valid for 12 months.
                </p>
                <p>
                  Helicopter shuttle coordination for the Kedarnath shrine is entirely independent of the retreat. We are not responsible for cancellation or flight disruptions by operators due to poor weather or air-safety restrictions.
                </p>
              </section>

              {/* Section 6: Damage to Deodar Cabins */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif text-[#1B4C44] font-normal tracking-wide flex items-center gap-2">
                  <AlertTriangle size={18} className="text-[#A88C52] shrink-0" />
                  <span>6. Property Care & Damage Responsibility</span>
                </h2>
                <p>
                  Our luxury cabins are handcrafted using aromatic natural pinewood and custom Himalayan slate stones. Guests are requested to respect these high-end materials.
                </p>
                <p>
                  Any structural damage, staining of organic linen, breakage of custom Vaastu patterns, or vandalism to the property will be appraised by the resort management upon check-out, and the guest will be fully liable for recovery, material sourcing, and specialized mountain craftsmanship labor costs.
                </p>
              </section>

              {/* Agreement Card */}
              <section className="p-6 sm:p-8 bg-[#EFEAE1]/50 border border-[#D8CBB8]/30 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#1B4C44] font-extrabold">
                  <Heart size={14} className="text-[#A88C52] fill-current" />
                  <span>Guest Agreement</span>
                </div>
                <p className="text-xs text-slate-charcoal/70 leading-relaxed italic">
                  "By confirming your booking and crossing into the threshold of our retreat, you choose to align yourself with these timeless forest principles and the peaceful serenity of this Himalayan soil."
                </p>
              </section>
            </>
          )}
        </motion.div>

        {/* Elegant Footer Details */}
        <div className="mt-16 pt-8 border-t border-[#D8CBB8]/20 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono tracking-widest text-slate-charcoal/40 gap-4">
          <span>THE VEDIC HIMALAYA RETREAT // VILLAGE DEWAR GUPTKASHI</span>
          <span>© {new Date().getFullYear()} ALL CITATIONS RESERVED</span>
        </div>

      </div>
    </div>
  );
}
