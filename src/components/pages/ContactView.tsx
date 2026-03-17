import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactView() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
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
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-24 px-6 bg-primary">
        <div className="max-w-[100rem] mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Mail className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
            <h1 className="font-heading text-5xl md:text-6xl text-primary-foreground mb-6">CONTACT US</h1>
            <p className="font-paragraph text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              We'd love to hear from you. Reach out with any questions or to learn more about our church.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-24 px-6">
        <div className="max-w-[100rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact Information */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="font-heading text-3xl text-primary mb-8">Get in Touch</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-4 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading text-xl text-primary mb-2">Address</h3>
                    <p className="font-paragraph text-base text-foreground/80">
                      The Pillar Of Cloud Tabernacle<br />
                      Hyderabad, Telangana, 500040<br />
                      India
                    </p>
                  </div>
                </div>
                {/* Phone — hidden for now, remove 'hidden' class to re-enable */}
                <div className="flex items-start hidden">
                  <Phone className="w-6 h-6 mr-4 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading text-xl text-primary mb-2">Phone</h3>
                    <p className="font-paragraph text-base text-foreground/80">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-6 h-6 mr-4 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading text-xl text-primary mb-2">Email</h3>
                    <p className="font-paragraph text-base text-foreground/80">
                      thepillarofcloudtabernacle@gmail.com
                    </p>
                  </div>
                </div>
                {/* WhatsApp — hidden for now, remove 'hidden' class to re-enable */}
                <div className="flex items-start hidden">
                  <MessageCircle className="w-6 h-6 mr-4 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading text-xl text-primary mb-2">WhatsApp</h3>
                    <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer"
                      className="font-paragraph text-base text-primary hover:text-highlight-hover transition-colors">
                      Message us on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
              {/* Map Placeholder */}
              <div className="mt-12 aspect-video bg-primary/10 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-primary/30" />
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              {submitted ? (
                <div className="bg-primary/5 p-12 text-center">
                  <Mail className="w-16 h-16 text-primary mx-auto mb-6" />
                  <h2 className="font-heading text-3xl text-primary mb-4">Message Sent!</h2>
                  <p className="font-paragraph text-lg text-foreground/80 mb-8">
                    Thank you for reaching out. We'll get back to you as soon as possible.
                  </p>
                  <Button onClick={() => setSubmitted(false)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <div className="bg-white border border-primary/10 p-8">
                  <h2 className="font-heading text-3xl text-primary mb-8">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {(['name', 'email', 'subject'] as const).map(field => (
                      <div key={field}>
                        <label htmlFor={field} className="font-paragraph text-sm text-foreground/80 mb-2 block capitalize">
                          {field === 'email' ? 'Your Email' : field === 'name' ? 'Your Name' : 'Subject'}{' '}
                          <span className="text-secondary">*</span>
                        </label>
                        <Input
                          id={field} type={field === 'email' ? 'email' : 'text'}
                          value={formData[field]}
                          onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                          required className="w-full"
                          placeholder={field === 'name' ? 'Enter your name' : field === 'email' ? 'Enter your email' : 'What is this about?'}
                        />
                      </div>
                    ))}
                    <div>
                      <label htmlFor="message" className="font-paragraph text-sm text-foreground/80 mb-2 block">
                        Message <span className="text-secondary">*</span>
                      </label>
                      <Textarea id="message" value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        required rows={6} className="w-full" placeholder="Your message..." />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6">
                      {isSubmitting ? 'Sending...' : <><Send className="mr-2 h-5 w-5" />Send Message</>}
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
