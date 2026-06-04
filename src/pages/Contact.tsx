import React, { useState } from "react";
import { Phone, Mail, Instagram, MapPin, Sparkles, Send, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useContent } from "@/hooks/useContent";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import PageLoader from "@/components/PageLoader";
import { getMapEmbedUrl } from "@/lib/utils";


export default function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
    if (!firstName || !message) {
      alert("Please fill in all required fields.");
      return;
    }

    const fullName = lastName ? `${firstName} ${lastName}` : firstName;

    // Open WhatsApp immediately (synchronous - bypasses popup blockers)
    const waMessage = [
      `Namaste! I would like to send an inquiry:`,
      ``,
      `• *Name*: ${fullName}`,
      `• *Message*: ${message}`,
    ].join('\n');

    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl, '_blank');

    // Store inquiry locally for admin panel
    const newInquiry = {
      id: `INQ-${Math.floor(10000 + Math.random() * 90000)}`,
      firstName,
      lastName,
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

        <div className={`grid grid-cols-1 gap-12 md:gap-16 max-w-5xl mx-auto items-center ${contactFormVisible ? 'lg:grid-cols-2' : 'max-w-xl'}`}>
          
          {/* Brand Contact Info */}
          <div className="space-y-8 lg:pr-4">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-heading font-medium tracking-tight text-slate-charcoal">
                {settings.hotel_name || "The Vedic Himalaya Retreat"}
              </h2>
              <div className="h-0.5 w-12 bg-[#A88C52] rounded-full" />
            </div>
            
            <div className="space-y-6">
              
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

              {/* WhatsApp */}
              <div className="flex gap-4 items-start group">
                <span className="p-2 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl text-[#25D366] block shrink-0">
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </span>
                <div>
                  <h4 className="uppercase tracking-[0.15em] text-[10px] font-extrabold text-slate-charcoal mb-1">Direct WhatsApp</h4>
                  <p className="text-xs text-slate-charcoal/75 leading-relaxed font-sans font-medium">
                    <a 
                      href={`https://wa.me/${whatsappNumber}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-[#1B4C44] transition-colors border-b border-dashed border-[#D8CBB8] pb-0.5"
                    >
                      +{whatsappNumber}
                    </a>
                    <br />
                    Click to chat with us directly
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
              <div className="flex gap-4 items-start group">
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
            <div className="bg-[#0B1714] border border-[#D8CBB8]/20 shadow-2xl p-8 md:p-12 lg:p-14 rounded-3xl relative overflow-hidden text-white flex flex-col justify-center w-full">
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
                     <h3 className="text-3xl md:text-4xl font-heading font-medium tracking-tight mb-8 relative z-10 text-white">{contactFormTitle}</h3>
                     
                     <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                       <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold tracking-widest text-[#D8CBB8]/80 font-mono">First Name</label>
                           <input 
                             type="text" 
                             required
                             placeholder="Arjun" 
                             value={firstName}
                             onChange={e => setFirstName(e.target.value)}
                             className="w-full font-medium bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-[#D8CBB8] focus:ring-1 focus:ring-[#D8CBB8] transition-all duration-300 placeholder:text-white/20" 
                           />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold tracking-widest text-[#D8CBB8]/80 font-mono">Last Name</label>
                           <input 
                             type="text" 
                             placeholder="Sharma" 
                             value={lastName}
                             onChange={e => setLastName(e.target.value)}
                             className="w-full font-medium bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-[#D8CBB8] focus:ring-1 focus:ring-[#D8CBB8] transition-all duration-300 placeholder:text-white/20" 
                           />
                         </div>
                       </div>
                      
                       <div className="space-y-2">
                         <label className="text-[10px] uppercase font-bold tracking-widest text-[#D8CBB8]/80 font-mono">Message</label>
                         <textarea 
                           rows={4} 
                           required
                           placeholder="Tell us about your Kedarnath puja date or special accommodation requests..." 
                           value={message}
                           onChange={e => setMessage(e.target.value)}
                           className="w-full font-medium bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-[#D8CBB8] focus:ring-1 focus:ring-[#D8CBB8] transition-all duration-300 resize-none placeholder:text-white/20"
                         ></textarea>
                       </div>
 
                       <button type="submit" className="w-full py-4 px-8 rounded-xl bg-[#D8CBB8] hover:bg-[#E5D7C3] text-[#0B1714] font-sans font-extrabold text-xs uppercase tracking-[0.2em] cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 border border-[#D8CBB8]/15 active:scale-98 inline-flex items-center justify-center gap-2">
                         <Send size={14} />
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
           )}
        </div>

        {/* Location Map Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easePremium }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-white border border-[#D8CBB8]/30 shadow-xl rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#A88C52] font-mono block mb-1">Interactive Map</span>
                <h3 className="text-xl font-heading font-medium text-slate-charcoal">Resort Coordinates</h3>
                <p className="text-xs text-slate-charcoal/70 mt-1 font-sans">
                  Located in the quiet village of Dewar, Guptkashi, along the Kedarnath road.
                </p>
              </div>
              {(settings.google_maps_url || settings.address) && (
                <a
                  href={settings.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(settings.address || "Village Dewar, Guptkashi")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-5 py-2.5 rounded-xl border border-[#D8CBB8] text-slate-charcoal hover:bg-[#1B4C44] hover:text-white hover:border-[#1B4C44] transition-all duration-300 font-sans font-extrabold text-[10px] uppercase tracking-[0.15em] inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <MapPin size={12} />
                  <span>Open in Google Maps</span>
                </a>
              )}
            </div>

            <div className="relative w-full h-[350px] overflow-hidden rounded-xl border border-[#D8CBB8]/30 shadow-inner bg-[#FAF9F5]">
              <iframe
                src={getMapEmbedUrl(settings.google_maps_url || 'https://maps.app.goo.gl/1Ec5QAh6RJano1BZ7', settings.address || 'Village Dewar, Guptkashi, Kedarnath Route')}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
