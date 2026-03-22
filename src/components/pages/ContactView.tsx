import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactView() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', location: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', location: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#0A1428] text-[#FDFBF7] overflow-x-hidden font-paragraph selection:bg-[#C0A87D]/30 selection:text-[#FDFBF7]">

      {/* Full Page Cinematic Background (oversized to fix mobile viewport jump) */}
      {/* Background Image */}
      <div className="fixed top-0 left-0 w-full h-[120vh] -top-[10vh] z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full scale-105"
          style={{ backgroundImage: "url('/images/contact-bg.jpg')" }}
        />
        {/* Subtle gradient at the bottom just to blend with content, removing dark overlay at top */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A1428]" />
      </div>

      {/* Cinematic Hybrid Hero Section */}
      <section className="relative pt-32 pb-0 md:pt-40 md:pb-2 px-6 overflow-hidden flex flex-col justify-end z-10">
        <div className="max-w-[100rem] mx-auto text-center relative z-10 flex flex-col items-center mt-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center w-full mb-6">
            <Mail className="w-12 h-12 md:w-16 md:h-16 text-[#C0A87D] mx-auto mb-4 drop-shadow-sm opacity-90" strokeWidth={1} />
            <h1 className="font-heading text-5xl md:text-7xl mb-2 tracking-wide font-light text-transparent bg-clip-text bg-gradient-to-r from-[#FDFBF7] via-[#FDFBF7] to-[#C0A87D]/80 drop-shadow-[0_0_30px_rgba(253,251,247,0.15)]">
              CONTACT US
            </h1>
            <p className="font-paragraph text-[15px] md:text-lg text-[#FDFBF7]/90 max-w-3xl mx-auto drop-shadow-md leading-[2.4] tracking-[0.05em] font-light">
              We'd love to hear from you. Reach out with any questions or to learn more about our church.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Premium Full-Width Map Anchor ───────────────────────────── */}
      <section className="relative z-20 pt-12 md:pt-16 pb-12 px-6">
        <div className="max-w-[100rem] mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="w-full relative"
          >
            {/* Map Container - Made smaller as requested */}
            <div className="w-full max-w-4xl mx-auto h-[250px] md:h-[350px] rounded-[16px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-white/[0.06] relative bg-white/[0.03]">
              {/* Subtle top overlay gradient for cinematic map depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/[0.2] to-transparent pointer-events-none z-10" />
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50.5!2d78.56654074791825!3d17.458592116641526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9d0061b5d749%3A0x64cf7cdcddcfd37c!2sThe%20Pillar%20Of%20Cloud%20Tabernacle!5e0!3m2!1sen!2sin!4v1774005751215!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[0.05]"
              ></iframe>
            </div>

            {/* Get Directions CTA */}
            <div className="mt-8 flex justify-center">
              <a href="https://maps.app.goo.gl/cEASLmi7WNewnGpy7" target="_blank" rel="noopener noreferrer">
                <Button className="group bg-transparent border border-[#C0A87D]/40 text-[#C0A87D] rounded-[9999px] px-10 py-7 text-lg tracking-wide transition-all duration-500 hover:bg-[#C0A87D] hover:text-[#0A1428] hover:border-[#C0A87D] hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(192,168,125,0.25)] font-medium backdrop-blur-sm">
                  Get Directions <MapPin className="ml-3 w-5 h-5 opacity-90 transition-transform duration-500 group-hover:scale-110" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Info & Form Grid ────────────────────────────────── */}
      <section className="relative z-20 py-12 pb-32 px-6">
        <div className="max-w-[100rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* Left: Contact Information */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="font-heading text-3xl md:text-4xl text-[#FDFBF7] mb-12 font-light tracking-wide">Get in Touch</h2>
              <div className="space-y-10">
                <div className="flex items-start group">
                  <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mr-6 group-hover:bg-[#C0A87D]/20 group-hover:border-[#C0A87D]/40 transition-colors duration-300 flex-shrink-0">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#FDFBF7]/70 group-hover:text-[#C0A87D] transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg md:text-xl text-[#FDFBF7] tracking-wide mb-2 font-light">Address</h3>
                    <p className="font-paragraph text-[15px] md:text-lg text-[#FDFBF7]/70 leading-relaxed font-light tracking-wide">
                      The Pillar Of Cloud Tabernacle<br />
                      5-13-123, Indira Nagar,H.B Colony,Moula Ali<br />
                      Hyderabad, Telangana, 500040<br />
                      India
                    </p>
                  </div>
                </div>
                {/* Phone — hidden for now, remove 'hidden' class to re-enable */}
                <div className="flex items-start group hidden">
                  <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mr-6 group-hover:bg-[#C0A87D]/20 group-hover:border-[#C0A87D]/40 transition-colors duration-300 flex-shrink-0">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-[#FDFBF7]/70 group-hover:text-[#C0A87D] transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg md:text-xl text-[#FDFBF7] tracking-wide mb-2 font-light">Phone</h3>
                    <p className="font-paragraph text-[15px] md:text-lg text-[#FDFBF7]/70 font-light tracking-wide">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mr-6 group-hover:bg-[#C0A87D]/20 group-hover:border-[#C0A87D]/40 transition-colors duration-300 flex-shrink-0">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-[#FDFBF7]/70 group-hover:text-[#C0A87D] transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg md:text-xl text-[#FDFBF7] tracking-wide mb-2 font-light">Email</h3>
                    <p className="font-paragraph text-[15px] md:text-lg text-[#FDFBF7]/70 font-light tracking-wide transition-colors group-hover:text-[#C0A87D]">
                      thepillarofcloudtabernacle@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              {submitted ? (
                <div className="bg-white/[0.03] border border-white/[0.06] p-12 text-center rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-sm">
                  <Mail className="w-16 h-16 text-[#C0A87D] mx-auto mb-6" strokeWidth={1} />
                  <h2 className="font-heading text-3xl text-[#FDFBF7] mb-4 font-light tracking-wide">Message Sent!</h2>
                  <p className="font-paragraph text-[15px] md:text-lg text-[#FDFBF7]/70 mb-8 font-light tracking-wide">
                    Thank you for reaching out. We'll get back to you as soon as possible.
                  </p>
                  <Button onClick={() => setSubmitted(false)} className="group bg-transparent border border-[#C0A87D]/40 text-[#C0A87D] font-medium tracking-wide transition-all duration-500 rounded-[9999px] px-8 py-6 hover:bg-[#C0A87D] hover:text-[#0A1428] hover:border-[#C0A87D] hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(192,168,125,0.25)] backdrop-blur-sm">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-2xl p-8 md:p-12 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent pointer-events-none" />
                  <h2 className="font-heading text-3xl text-[#FDFBF7] mb-8 relative z-10 font-light tracking-wide">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="font-paragraph text-[13px] md:text-sm text-[#FDFBF7]/80 mb-2 block tracking-widest uppercase">
                          Your Name <span className="text-[#C0A87D]">*</span>
                        </label>
                        <Input
                          id="name" type="text"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          required className="w-full bg-white/[0.08] backdrop-blur-[10px] border border-white/[0.15] rounded-xl focus:border-[#C0A87D] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-white placeholder:text-white/50 relative z-10 h-14 px-5 font-light focus:bg-white/[0.12]"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="font-paragraph text-[13px] md:text-sm text-[#FDFBF7]/80 mb-2 block tracking-widest uppercase">
                          Phone Number <span className="text-[#C0A87D]">*</span>
                        </label>
                        <Input
                          id="phone" type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          required className="w-full bg-white/[0.08] backdrop-blur-[10px] border border-white/[0.15] rounded-xl focus:border-[#C0A87D] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-white placeholder:text-white/50 relative z-10 h-14 px-5 font-light focus:bg-white/[0.12]"
                          placeholder="Your phone number"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="font-paragraph text-[13px] md:text-sm text-[#FDFBF7]/80 mb-2 block tracking-widest uppercase">
                          Your Email <span className="opacity-40 lowercase tracking-normal">(optional)</span>
                        </label>
                        <Input
                          id="email" type="email"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/[0.08] backdrop-blur-[10px] border border-white/[0.15] rounded-xl focus:border-[#C0A87D] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-white placeholder:text-white/50 relative z-10 h-14 px-5 font-light focus:bg-white/[0.12]"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <label htmlFor="location" className="font-paragraph text-[13px] md:text-sm text-[#FDFBF7]/80 mb-2 block tracking-widest uppercase">
                          Location <span className="text-[#C0A87D]">*</span>
                        </label>
                        <Input
                          id="location" type="text"
                          value={formData.location}
                          onChange={e => setFormData({ ...formData, location: e.target.value })}
                          required className="w-full bg-white/[0.08] backdrop-blur-[10px] border border-white/[0.15] rounded-xl focus:border-[#C0A87D] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-white placeholder:text-white/50 relative z-10 h-14 px-5 font-light focus:bg-white/[0.12]"
                          placeholder="City, State, or Country"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="font-paragraph text-[13px] md:text-sm text-[#FDFBF7]/80 mb-2 block tracking-widest uppercase">
                        Subject <span className="opacity-40 lowercase tracking-normal">(optional)</span>
                      </label>
                      <Input
                        id="subject" type="text"
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-white/[0.08] backdrop-blur-[10px] border border-white/[0.15] rounded-xl focus:border-[#C0A87D] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-white placeholder:text-white/50 relative z-10 h-14 px-5 font-light focus:bg-white/[0.12]"
                        placeholder="What is this about?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="font-paragraph text-[13px] md:text-sm text-[#FDFBF7]/80 mb-2 block tracking-widest uppercase">
                        Message <span className="text-[#C0A87D]">*</span>
                      </label>
                      <Textarea id="message" value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        required rows={5} className="w-full bg-white/[0.08] backdrop-blur-[10px] border border-white/[0.15] rounded-xl focus:border-[#C0A87D] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-white placeholder:text-white/50 relative z-10 p-5 font-light resize-none focus:bg-white/[0.12]" placeholder="Your message..." />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="group w-full bg-transparent border border-[#C0A87D]/40 text-[#C0A87D] font-medium tracking-widest uppercase py-7 md:py-8 rounded-[9999px] transition-all duration-500 hover:bg-[#C0A87D] hover:text-[#0A1428] hover:border-[#C0A87D] hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(192,168,125,0.25)] relative z-10 backdrop-blur-sm">
                      {isSubmitting ? 'Sending...' : <><Send className="mr-3 h-5 w-5 opacity-90 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />Send Message</>}
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

    </div >
  );
}
