import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

export default function PrayerRequestsView() {
  const [formData, setFormData] = useState({
    submitterName: '',
    submitterPhone: '',
    submitterEmail: '',
    submitterPlace: '',
    prayerRequestText: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/prayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
      setFormData({ submitterName: '', submitterPhone: '', submitterEmail: '', submitterPlace: '', prayerRequestText: '' });
    } catch (error) {
      console.error('Error submitting prayer request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center text-white bg-black">
      {/* Full Page Cinematic Background (oversized to fix mobile viewport jump) */}
      <div className="absolute top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-[#0A1428]" />
      <div
        className="absolute top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-cover bg-[center_30%] opacity-100 saturate-[0.8] brightness-[0.7] transition-all duration-700"
        style={{ backgroundImage: `url('/images/prayer-bg.jpg')` }}
      />
      
      {/* Divine Light Rays */}
      <div className="absolute top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 overflow-hidden pointer-events-none mix-blend-plus-lighter opacity-50">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[120%] bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-[120px]" />
        <div className="absolute top-[-20%] left-[15%] w-[15%] h-[130%] bg-gradient-to-b from-[#C0A87D]/15 via-[#C0A87D]/5 to-transparent rotate-[25deg] blur-2xl origin-top" />
        <div className="absolute top-[-10%] right-[10%] w-[25%] h-[120%] bg-gradient-to-b from-white/15 via-white/2 to-transparent rotate-[-20deg] blur-3xl origin-top" />
        <div className="absolute top-[-10%] left-[45%] w-[5%] h-[100%] bg-gradient-to-b from-white/20 to-transparent rotate-[5deg] blur-xl origin-top" />
      </div>

      <div className="absolute top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-gradient-to-b from-[#0A1428]/5 via-[#0A1428]/40 to-[#0A1428]/90 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0A1428_100%)] opacity-[0.5] pointer-events-none" />

      {/* Main Container: Perfect 50/50 Balance with Spacing */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center flex-grow pt-24 pb-12">
        
        {/* Left Side: Calm, Elegant Spiritual Content */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center text-center lg:text-left h-full"
        >
          <div className="max-w-xl mx-auto lg:mx-0">
            {/* Soft, smaller, elegant typography for the verse */}
            <h1 className="font-heading text-4xl sm:text-4xl md:text-5xl text-white mb-6 leading-relaxed tracking-wide drop-shadow-md">
              "Cast all your anxiety on Him,<br className="hidden lg:block" />
              <span className="text-white/90"> because He cares for you."</span>
            </h1>
            
            {/* Bold, prominent gold reference */}
            <p className="font-paragraph text-xl md:text-2xl text-[#C0A87D] uppercase tracking-widest font-semibold mb-8 drop-shadow-sm">
              — 1 Peter 5:7
            </p>

            <p className="font-paragraph text-lg md:text-xl text-white/80 leading-loose drop-shadow-sm">
              You are not alone. Whether you're carrying a heavy burden, celebrating a praise report, 
              or seeking guidance, share your heart with us. Our pastoral team and church family 
              consider it an honor to stand with you in prayer.
            </p>
          </div>
        </motion.div>

        {/* Right Side: True Glassmorphism Form aligned with homepage */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full max-w-[500px] mx-auto lg:mx-0 lg:ml-auto h-full flex flex-col justify-center relative"
        >
          {/* Background interaction behind the card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_rgba(192,168,125,0.15)_0%,_transparent_70%)] blur-[80px] pointer-events-none -z-10" />
          <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08)_0%,_transparent_70%)] blur-[100px] pointer-events-none -z-10" />

          {submitted ? (
                <div className="relative z-10 bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] backdrop-saturate-[1.2] border border-white/[0.12] shadow-[0_24px_60px_rgba(0,0,0,0.3),_0_0_40px_rgba(192,168,125,0.05),_inset_0_1px_rgba(255,255,255,0.15)] rounded-[20px] p-10 md:p-14 text-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 rounded-[20px] border-[0.5px] border-white/[0.15] border-t-white/[0.25] border-l-white/[0.25] pointer-events-none" />
                  <h2 className="font-heading text-3xl text-white mb-4 relative z-10">Request Received</h2>
                  <p className="font-paragraph text-lg text-white/90 mb-8 relative z-10 leading-relaxed">
                    Your prayer request has been received. Our church family will be praying for you.
                  </p>
                  <Button onClick={() => setSubmitted(false)} className="w-full bg-[#C0A87D] hover:bg-white text-[#0A1428] rounded-full h-14 font-semibold tracking-wide transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] shadow-[0_4px_15px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_25px_rgba(192,168,125,0.4)] relative z-10 border border-white/20">
                    Submit Another Request
                  </Button>
                </div>
          ) : (
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-2xl p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent pointer-events-none" />
              
              <h2 className="font-heading text-3xl text-[#FDFBF7] mb-6 text-center relative z-10 font-light tracking-wide drop-shadow-sm">
                Submit Your Request
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <p className="font-paragraph text-sm text-[#C0A87D] italic text-center mb-6">
                  Rest assured, your details are safe with us.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="font-paragraph text-[13px] md:text-sm text-[#FDFBF7]/80 mb-2 block tracking-widest uppercase">
                      Your Name <span className="text-[#C0A87D]">*</span>
                    </label>
                    <Input
                      id="name" type="text"
                      value={formData.submitterName}
                      onChange={e => setFormData({ ...formData, submitterName: e.target.value })}
                      required
                      className="w-full bg-white/[0.08] backdrop-blur-[10px] border border-white/[0.15] rounded-xl focus:border-[#C0A87D] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-white placeholder:text-white/50 relative z-10 h-14 px-5 font-light focus:bg-white/[0.12]" 
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="font-paragraph text-[13px] md:text-sm text-[#FDFBF7]/80 mb-2 block tracking-widest uppercase">
                      Phone Number <span className="text-[#C0A87D]">*</span>
                    </label>
                    <Input
                      id="phone" type="tel"
                      value={formData.submitterPhone}
                      onChange={e => setFormData({ ...formData, submitterPhone: e.target.value })}
                      required
                      className="w-full bg-white/[0.08] backdrop-blur-[10px] border border-white/[0.15] rounded-xl focus:border-[#C0A87D] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-white placeholder:text-white/50 relative z-10 h-14 px-5 font-light focus:bg-white/[0.12]" 
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
                      value={formData.submitterEmail}
                      onChange={e => setFormData({ ...formData, submitterEmail: e.target.value })}
                      className="w-full bg-white/[0.08] backdrop-blur-[10px] border border-white/[0.15] rounded-xl focus:border-[#C0A87D] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-white placeholder:text-white/50 relative z-10 h-14 px-5 font-light focus:bg-white/[0.12]" 
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label htmlFor="place" className="font-paragraph text-[13px] md:text-sm text-[#FDFBF7]/80 mb-2 block tracking-widest uppercase">
                      Your Place <span className="text-[#C0A87D]">*</span>
                    </label>
                    <Input
                      id="place" type="text"
                      value={formData.submitterPlace}
                      onChange={e => setFormData({ ...formData, submitterPlace: e.target.value })}
                      required
                      className="w-full bg-white/[0.08] backdrop-blur-[10px] border border-white/[0.15] rounded-xl focus:border-[#C0A87D] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-white placeholder:text-white/50 relative z-10 h-14 px-5 font-light focus:bg-white/[0.12]" 
                      placeholder="City, State, or Country"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="request" className="font-paragraph text-[13px] md:text-sm text-[#FDFBF7]/80 mb-2 block tracking-widest uppercase">
                    Prayer Request <span className="text-[#C0A87D]">*</span>
                  </label>
                    <Textarea
                    id="request"
                    value={formData.prayerRequestText}
                    onChange={e => setFormData({ ...formData, prayerRequestText: e.target.value })}
                    required rows={5} 
                    className="w-full bg-white/[0.08] backdrop-blur-[10px] border border-white/[0.15] rounded-xl focus:border-[#C0A87D] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-white placeholder:text-white/50 relative z-10 p-5 font-light resize-none focus:bg-white/[0.12]"
                    placeholder="Share what's on your heart..."
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-[#C0A87D] hover:bg-white text-[#0A1428] font-medium tracking-widest uppercase py-7 md:py-8 rounded-[9999px] shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(192,168,125,0.4)] transition-all duration-300 relative z-10">
                    {isSubmitting ? 'Submitting...' : (
                      <><Send className="mr-3 h-5 w-5 opacity-90" />Submit Prayer Request</>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
