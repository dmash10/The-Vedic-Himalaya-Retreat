import React, { useState } from "react";
import { Phone, Mail, Instagram, MapPin, Sparkles, Send, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useContent } from "@/hooks/useContent";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import PageLoader from "@/components/PageLoader";

export default function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const easePremium = [0.22, 1, 0.36, 1] as const;

  const { getValue, loading, content } = useContent();
  const { settings } = useSiteSettings();

  // Prevent flash of fallback text while CMS content loads
  if (loading && content.length === 0) return <PageLoader />;

  const contactHeading = getValue('contact', 'contact_heading', 'We Await Your');
  const contactSubheading = getValue('contact', 'contact_subheading', 'Prepare your pilgrimage plans beautifully. Our reservation crew is available 24/7 to orchestrate your luxury stay and pure Sattvik dining requirements.');

  const locationText = getValue('contact', 'contact_map_pin', settings.address || 'Village Dewar, Guptkashi, Kedarnath Route, Uttarakhand 246495');
  const contactEmailText = getValue('contact', 'contact_email', settings.email || 'stay@vedichimalaya.com');

  const contactHeroVisible = getValue('contact', 'contact_hero_visible', 'true') !== 'false';
  const contactBadge = getValue('contact', 'contact_badge', 'REACH OUT TO US');
  const contactItalicText = getValue('contact', 'contact_italic_text', 'Sacred Arrival');
  const contactInstagram = getValue('contact', 'contact_instagram', '@thevedichimalayaretreat');
  const contactInstagramUrl = getValue('contact', 'contact_instagram_url', 'https://instagram.com/thevedichimalayaretreat');
  const contactFormVisible = getValue('contact', 'contact_form_visible', 'true') !== 'false';
  const contactFormTitle = getValue('contact', 'contact_form_title', 'Send an Inquiry');

  const whatsappNumber = settings.whatsapp_number || "918126573560";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email || !message) {
      alert("Please fill in all required fields.");
      return;
    }

    const fullName = lastName ? `${firstName} ${lastName}` : firstName;

    // Open WhatsApp immediately (synchronous - bypasses popup blockers)
    const waMessage = [
      `Namaste! I would like to send an inquiry:`,
      ``,
      `• *Name*: ${fullName}`,
      `• *Email*: ${email}`,
      `• *Message*: ${message}`,
    ].join('\n');

    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl, '_blank');

    // Store inquiry locally for admin panel
    const newInquiry = {
      id: `INQ-${Math.floor(10000 + Math.random() * 90000)}`,
      firstName,
      lastName,
      email,
      message,
      createdAt: new Date().toISOString(),
      status: "Unread"
    };

    const existingInquiriesStr = localStorage.getItem("adminInquiries");
    const existingInquiries = existingInquiriesStr ? JSON.parse(existingInquiriesStr) : [];
    existingInquiries.unshift(newInquiry);
    localStorage.setItem("adminInquiries", JSON.stringify(existingInquiries));

    setSubmitted(true);
    setFirstName("");
    setLastName("");
    setEmail("");
    setMessage("");

    setTimeout(() => {
      setSubmitted(false);
    }, 4500);
  };

  return (
    <div className="bg-[#FAF9F5] text-slate-charcoal pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        
        {/* Editorial Header */}
        {contactHeroVisible && (
          <header className="mb-20 text-center space-y-6 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easePremium }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#1B4C44]/5 text-[#1B4C44] text-[10px] uppercase font-bold tracking-[0.25em] rounded-full border border-[#1B4C44]/10"
            >
              <Sparkles size={11} className="text-[#A88C52]" />
              <span>{contactBadge}</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-medium tracking-tight text-slate-charcoal leading-[1.1]">
              {contactHeading} <br />
              <span className="italic font-serif font-normal text-[#1B4C44]">{contactItalicText}</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-charcoal/70 max-w-md mx-auto font-sans leading-relaxed">
              {contactSubheading}
            </p>
          </header>
        )}

        <div className={`grid grid-cols-1 gap-12 md:gap-16 max-w-4xl mx-auto items-start ${contactFormVisible ? 'lg:grid-cols-2' : 'max-w-xl'}`}>
          
          {/* Brand Contact Card Grid */}
          <div className="space-y-8">
            <h2 className="text-2xl font-heading font-medium tracking-tight text-slate-charcoal">
              {settings.hotel_name || "The Vedic Himalaya Retreat"}
            </h2>
            
            <div className="space-y-8">
              
              {/* Location */}
              <div className="flex gap-4 items-start group">
                <span className="p-2 bg-white border border-[#D8CBB8]/30 rounded-xl text-[#A88C52] block shrink-0">
                  <MapPin size={18} strokeWidth={1.5} />
                </span>
                <div>
                  <h4 className="uppercase tracking-[0.15em] text-[10px] font-extrabold text-slate-charcoal mb-1">Location</h4>
                  <p className="text-xs text-slate-charcoal/75 leading-relaxed font-sans font-medium whitespace-pre-line">
                     {locationText}
                  </p>
                </div>
              </div>

              {/* Reservations */}
              <div className="flex gap-4 items-start group">
                <span className="p-2 bg-white border border-[#D8CBB8]/30 rounded-xl text-[#B32D2D] block shrink-0">
                  <Phone size={18} strokeWidth={1.5} />
                </span>
                <div>
                  <h4 className="uppercase tracking-[0.15em] text-[10px] font-extrabold text-slate-charcoal mb-1">Reservations &amp; Desk</h4>
                  <p className="text-xs text-slate-charcoal/75 leading-relaxed font-sans font-medium">
                     {settings.primary_phone || "+91 70603 26489"}<br />
                     {settings.secondary_phone && <>{settings.secondary_phone}<br /></>}
                     {settings.tertiary_phone && <>{settings.tertiary_phone}<br /></>}
                     Available 24/7 Season-Wide
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start group">
                <span className="p-2 bg-white border border-[#D8CBB8]/30 rounded-xl text-[#1B4C44] block shrink-0">
                  <Mail size={18} strokeWidth={1.5} />
                </span>
                <div>
                  <h4 className="uppercase tracking-[0.15em] text-[10px] font-extrabold text-slate-charcoal mb-1">Email Coordinates</h4>
                  <p className="text-xs text-slate-charcoal/75 leading-relaxed font-sans font-medium">
                     {contactEmailText}
                  </p>
                </div>
              </div>
              
              {/* Instagram */}
              <div className="flex gap-4 items-start group pt-6 border-t border-[#D8CBB8]/20">
                <span className="p-2 bg-white border border-[#D8CBB8]/30 rounded-xl text-[#6D7A71] block shrink-0">
                  <Instagram size={18} strokeWidth={1.5} />
                </span>
                <div>
                  <h4 className="uppercase tracking-[0.15em] text-[10px] font-extrabold text-slate-charcoal mb-1">Social Feed</h4>
                  <a href={contactInstagramUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-charcoal hover:text-[#1B4C44] transition-colors font-sans border-b border-[#D8CBB8] pb-0.5 mt-0.5 inline-block">
                     {contactInstagram}
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Form Card */}
          {contactFormVisible && (
            <div className="bg-[#0B1714] border border-[#D8CBB8]/20 shadow-2xl p-6 md:p-10 rounded-2xl relative overflow-hidden text-white min-h-[420px] flex flex-col justify-center">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#1B4C44]/13 rounded-full blur-3xl pointer-events-none" />
               
               <AnimatePresence mode="wait">
                 {!submitted ? (
                   <motion.div
                     key="contact-form"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.3 }}
                   >
                     <h3 className="text-xl font-heading font-medium tracking-tight mb-6 relative z-10 text-white">{contactFormTitle}</h3>
                     
                     <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                           <label className="text-[9px] uppercase font-bold tracking-widest text-[#D8CBB8]/80 font-mono">First Name</label>
                           <input 
                             type="text" 
                             required
                             placeholder="Arjun" 
                             value={firstName}
                             onChange={e => setFirstName(e.target.value)}
                             className="w-full font-medium bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#D8CBB8] focus:ring-1 focus:ring-[#D8CBB8] transition-all duration-300" 
                           />
                         </div>
                         <div className="space-y-1.5">
                           <label className="text-[9px] uppercase font-bold tracking-widest text-[#D8CBB8]/80 font-mono">Last Name</label>
                           <input 
                             type="text" 
                             placeholder="Sharma" 
                             value={lastName}
                             onChange={e => setLastName(e.target.value)}
                             className="w-full font-medium bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#D8CBB8] focus:ring-1 focus:ring-[#D8CBB8] transition-all duration-300" 
                           />
                         </div>
                       </div>
                       
                       <div className="space-y-1.5">
                         <label className="text-[9px] uppercase font-bold tracking-widest text-[#D8CBB8]/80 font-mono">Email Address</label>
                         <input 
                           type="email" 
                           required
                           placeholder="arjun@pilgrim.com" 
                           value={email}
                           onChange={e => setEmail(e.target.value)}
                           className="w-full font-medium bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#D8CBB8] focus:ring-1 focus:ring-[#D8CBB8] transition-all duration-300" 
                         />
                       </div>

                       <div className="space-y-1.5">
                         <label className="text-[9px] uppercase font-bold tracking-widest text-[#D8CBB8]/80 font-mono">Message</label>
                         <textarea 
                           rows={3} 
                           required
                           placeholder="Tell us about your Kedarnath puja date or special accommodation requests..." 
                           value={message}
                           onChange={e => setMessage(e.target.value)}
                           className="w-full font-medium bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#D8CBB8] focus:ring-1 focus:ring-[#D8CBB8] transition-all duration-300 resize-none"
                         ></textarea>
                       </div>

                       <button type="submit" className="w-full py-3.5 px-6 rounded-xl bg-[#D8CBB8] hover:bg-[#E5D7C3] text-[#0B1714] font-sans font-extrabold text-[10px] uppercase tracking-[0.2em] cursor-pointer shadow-md transition-all duration-350 border border-[#D8CBB8]/15 active:scale-98 inline-flex items-center justify-center gap-2">
                         <Send size={12} />
                         <span>Send Inquiry</span>
                       </button>
                     </form>
                   </motion.div>
                 ) : (
                   <motion.div
                     key="contact-success"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.4, ease: easePremium }}
                     className="text-center space-y-4 py-6"
                   >
                     <div className="w-12 h-12 rounded-full bg-[#1B4C44] border border-[#D8CBB8]/30 flex items-center justify-center mx-auto">
                       <Check className="text-amber-400 w-6 h-6" strokeWidth={2.5} />
                     </div>
                     <span className="text-[10px] uppercase tracking-[0.25em] font-black text-[#D8CBB8] font-mono block">Inquiry Registered</span>
                     <h3 className="text-lg font-heading font-medium text-white">Pranam, {firstName}!</h3>
                     <p className="text-xs text-white/70 max-w-xs mx-auto leading-relaxed">
                       Your sacred inquiry has been placed into our reservation system. Out on-duty supervisor will review details and connect with you via email or WhatsApp within the hour.
                     </p>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          )}  </div>
      </div>
    </div>
  );
}
