import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

export default function PrayerRequestsView() {
  const [formData, setFormData] = useState({
    submitterName: '',
    submitterEmail: '',
    prayerRequestText: '',
    isAnonymous: false,
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
      setFormData({ submitterName: '', submitterEmail: '', prayerRequestText: '', isAnonymous: false });
    } catch (error) {
      console.error('Error submitting prayer request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-24 px-6 bg-primary">
        <div className="max-w-[100rem] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
            <h1 className="font-heading text-5xl md:text-6xl text-primary-foreground mb-6">
              PRAYER REQUESTS
            </h1>
            <p className="font-paragraph text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Share your prayer needs with us. Our church family is here to lift you up in prayer.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Prayer Request Form */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-primary/5 p-12 text-center"
            >
              <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="font-heading text-3xl text-primary mb-4">Thank You for Sharing</h2>
              <p className="font-paragraph text-lg text-foreground/80 mb-8">
                Your prayer request has been received. Our church family will be praying for you.
              </p>
              <Button onClick={() => setSubmitted(false)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Submit Another Request
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white border border-primary/10 p-8 md:p-12"
            >
              <h2 className="font-heading text-3xl text-primary mb-8 text-center">
                Submit Your Prayer Request
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="font-paragraph text-sm text-foreground/80 mb-2 block">
                    Your Name {!formData.isAnonymous && <span className="text-secondary">*</span>}
                  </label>
                  <Input
                    id="name" type="text"
                    value={formData.submitterName}
                    onChange={e => setFormData({ ...formData, submitterName: e.target.value })}
                    disabled={formData.isAnonymous}
                    required={!formData.isAnonymous}
                    className="w-full" placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="font-paragraph text-sm text-foreground/80 mb-2 block">
                    Your Email {!formData.isAnonymous && <span className="text-secondary">*</span>}
                  </label>
                  <Input
                    id="email" type="email"
                    value={formData.submitterEmail}
                    onChange={e => setFormData({ ...formData, submitterEmail: e.target.value })}
                    disabled={formData.isAnonymous}
                    required={!formData.isAnonymous}
                    className="w-full" placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="request" className="font-paragraph text-sm text-foreground/80 mb-2 block">
                    Prayer Request <span className="text-secondary">*</span>
                  </label>
                  <Textarea
                    id="request"
                    value={formData.prayerRequestText}
                    onChange={e => setFormData({ ...formData, prayerRequestText: e.target.value })}
                    required rows={6} className="w-full"
                    placeholder="Share your prayer request..."
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="anonymous"
                    checked={formData.isAnonymous}
                    onCheckedChange={checked => setFormData({ ...formData, isAnonymous: checked as boolean })}
                  />
                  <label htmlFor="anonymous" className="font-paragraph text-sm text-foreground/80 cursor-pointer">
                    Submit anonymously
                  </label>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6">
                  {isSubmitting ? 'Submitting...' : (
                    <><Send className="mr-2 h-5 w-5" />Submit Prayer Request</>
                  )}
                </Button>
              </form>
            </motion.div>
          )}
        </div>
      </section>

      {/* Encouragement Section */}
      <section className="py-24 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl text-primary mb-6">We Are Here for You</h2>
            <p className="font-paragraph text-lg text-foreground/80 leading-relaxed mb-6">
              "The prayer of a righteous person is powerful and effective."
            </p>
            <p className="font-paragraph text-base text-primary">James 5:16</p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
