// HomePageClient.tsx — Restructured homepage layout
// Sections: Hero → Quick Info → Pastor → Special Meeting Bar → Daily Quote → Sermon → Songs+Gallery → Visit CTA
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Calendar, MapPin, Play, Users,
  ArrowRight, Clock, Music, Image as ImageIcon,
} from 'lucide-react';

/* Latin Cross — longer lower arm, traditional Christian style */
const LatinCross = ({ className = '' }: { className?: string; strokeWidth?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v20" />
    <path d="M5 8h14" />
  </svg>
);
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

// Wix source images (publicly accessible, will be replaced with /public assets later)
const HERO_IMAGE    = 'https://static.wixstatic.com/media/9e129b_7c11a873db554fe6b146a8648d43d667~mv2.png';
const SERMON_IMAGE  = 'https://static.wixstatic.com/media/9e129b_dfb0a88c94a44f3daa971f91b4fd0476~mv2.png';
const CTA_IMAGE     = 'https://static.wixstatic.com/media/9e129b_21b72736547143279f87741e76dc36c5~mv2.png';

interface Sermon { _id: string; title: string; speaker?: string; date?: string; youtubeVideoId?: string; description?: string; }
interface Event  { _id: string; title?: string; eventDate?: string; eventTime?: string; description?: string; eventImageUrl?: string | null; }
interface Song   { _id: string; songTitle?: string; artist?: string; }
interface DailyVerse { _id: string; date: string; verseText?: string; verseReference?: string; }

interface Props {
  latestSermon: Sermon | null;
  events: Event[];
  songs: Song[];
  dailyVerse?: DailyVerse | null;
}

export default function HomePageClient({ latestSermon, events, songs, dailyVerse }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY       = useTransform(heroScroll, [0, 1], ['0%', '40%']);
  const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0]);

  const fadeUpVariant = {
    hidden:  { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as const } },
  };
  const staggerContainer = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <div className="min-h-screen bg-background selection:bg-highlight-hover selection:text-primary">
      <style>{`
        .sacred-divider {
          position: relative; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(30,58,138,0.2), transparent);
        }
        .sacred-divider::after {
          content: ''; position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%) rotate(45deg);
          width: 6px; height: 6px; background-color: #1E3A8A; opacity: 0.5;
        }
        .clip-diagonal { clip-path: polygon(0 0, 100% 0, 100% 95%, 0 100%); }
        .text-balance  { text-wrap: balance; }
      `}</style>

      {/* ── 1. HERO — Cinematic Cloud Video Background ─────────────────── */}
      {/*
        VIDEO SETUP: Place the cloud video at /public/videos/hero-clouds.mp4
        Download from: https://www.pexels.com/video/time-lapse-video-of-clouds-4787839/
        Choose the HD or Full HD MP4 option and save as hero-clouds.mp4
      */}
      <section ref={heroRef} className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden bg-primary">
        {/* Video Background — looping, muted, autoplaying */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={HERO_IMAGE}
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero-clouds.mp4" type="video/mp4" />
            {/* Fallback to static image if video can't load */}
          </video>
          {/* Soft blue overlay for text readability */}
          <div className="absolute inset-0 bg-primary/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-primary/80" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-[100rem] mx-auto w-full flex flex-col items-center justify-center"
        >
          {/* Hero title — Two lines, Cinzel 600, improved readability */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-white mb-10 text-center uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 600,
              letterSpacing: '0.12em',
              lineHeight: 1.2,
            }}
          >
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              Pillar of Cloud
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mt-3 text-white/90">
              Tabernacle
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="w-px h-16 bg-gradient-to-b from-highlight-hover to-transparent mx-auto mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-xl md:text-2xl text-white/85 mb-12 italic max-w-2xl text-balance"
            style={{ fontFamily: "'Cinzel', serif", fontWeight: 400, letterSpacing: '0.04em' }}
          >
            "The Lord went before them by day in a pillar of cloud."
            <span className="block text-sm font-paragraph not-italic mt-4 text-highlight-hover tracking-widest uppercase">
              Exodus 13:21
            </span>
          </motion.p>

        </motion.div>
      </section>

      {/* ── 2. QUICK INFO — Overlapping Cards ─────────────────────────── */}
      <section className="relative z-20 px-6 -mt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={staggerContainer} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-1"
          >
            {[
              { icon: MapPin,    title: 'VISIT US',     desc1: 'Sunday Worship – 10:00 AM',     desc2: 'Join us for worship and fellowship',  href: '/contact',         cta: 'Get Directions' },
              { icon: Play,      title: 'WATCH ONLINE', desc1: 'Join our worship service live',  desc2: 'Every Sunday at 10:00 AM',            href: '/watch-live',      cta: 'Watch Now' },
              { icon: LatinCross, title: 'NEED PRAYER?', desc1: 'Submit your prayer request',     desc2: 'Our church will pray for you',        href: '/prayer-requests', cta: 'Request Prayer' },
            ].map(({ icon: Icon, title, desc1, desc2, href, cta }) => (
              <motion.div
                key={title} variants={fadeUpVariant}
                className="bg-white p-8 text-center group hover:bg-primary transition-all duration-500 border border-primary/5 shadow-md hover:shadow-[0_8px_30px_rgba(244,196,48,0.25)]"
              >
                <Icon className="w-8 h-8 mx-auto mb-4 text-secondary group-hover:text-highlight-hover transition-colors duration-500" strokeWidth={1.5} />
                <h3 className="font-heading text-xl text-primary group-hover:text-white mb-2 tracking-wide transition-colors duration-500">{title}</h3>
                <p className="font-paragraph text-sm text-foreground/80 group-hover:text-white/80 mb-1 transition-colors duration-500">{desc1}</p>
                <p className="font-paragraph text-xs text-foreground/50 group-hover:text-white/50 mb-5 transition-colors duration-500">{desc2}</p>
                <a href={href}>
                  <span className="inline-flex items-center font-paragraph text-sm font-semibold text-primary group-hover:text-highlight-hover uppercase tracking-widest transition-colors duration-500">
                    {cta} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6"><div className="sacred-divider" style={{ background: 'linear-gradient(90deg, transparent, rgba(244,196,48,0.4), transparent)' }} /></div>

      {/* ── 3. PASTOR SECTION — Compact, Centered, Testimony Only ─────── */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-50px' }} variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Image */}
            <motion.div variants={fadeUpVariant} className="relative aspect-[4/5] bg-primary/5 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <Users className="w-20 h-20 text-primary/20" />
              </div>
              {/* Replace div above with <img src="..." /> when pastor photo is available */}
            </motion.div>
            {/* Testimony */}
            <motion.div variants={fadeUpVariant}>
              <span className="font-paragraph text-sm font-semibold text-secondary uppercase tracking-[0.2em] mb-4 block">
                Our Pastor
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-primary mb-6">
                Pastoral Testimony
              </h2>
              <p className="font-paragraph text-lg text-foreground/70 leading-relaxed mb-6">
                "By the grace of God, I was called to shepherd this flock. The Lord placed a burden on my heart
                for the people of this city, to bring them the unadulterated Word of God and to lead them into
                a deeper relationship with Christ. The Pillar of Cloud Tabernacle was born out of prayer and obedience."
              </p>
              <p className="font-paragraph text-base text-foreground/50 italic">
                — Pastor, The Pillar of Cloud Tabernacle
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[100rem] mx-auto px-6"><div className="sacred-divider" /></div>

      {/* ── 4. SPECIAL MEETING — Compact Announcement Bar (hidden if no meeting) ── */}
      {latestSermon && (
        <section className="py-4 px-6 bg-secondary/5 border-y border-secondary/10">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
            <span className="inline-block bg-secondary/10 text-secondary font-paragraph text-xs font-semibold uppercase tracking-[0.15em] px-3 py-1">
              Special Meeting
            </span>
            <span className="font-heading text-lg text-primary">
              Special Prayer Meeting
            </span>
            <span className="font-paragraph text-sm text-foreground/60">
              Coming Soon
            </span>
            <a href="/events" className="ml-0 sm:ml-4">
              <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-white rounded-none text-xs px-4 py-2">
                Learn More
              </Button>
            </a>
          </div>
        </section>
      )}

      {/* ── 5. DAILY QUOTE — CMS-driven ──────────────────────────────── */}
      {dailyVerse && dailyVerse.verseText && (
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")' }}
          />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div
              initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: '-100px' }} variants={fadeUpVariant}
            >
              <span className="font-paragraph text-sm font-semibold text-secondary uppercase tracking-[0.2em] mb-8 block">
                Daily Quote
              </span>
              <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl text-primary mb-12 leading-tight text-balance">
                "{dailyVerse.verseText}"
              </h2>
              {dailyVerse.verseReference && (
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-px bg-primary/20" />
                  <p className="font-heading text-xl text-primary/70 italic">{dailyVerse.verseReference}</p>
                  <div className="w-12 h-px bg-primary/20" />
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── 6. LATEST SERMON — Split Layout ───────────────────────────── */}
      <section className="py-0 bg-primary text-white clip-diagonal">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
          <div className="p-12 md:p-24 flex flex-col justify-center relative z-10">
            <motion.div
              initial="hidden" whileInView="visible"
              viewport={{ once: true }} variants={fadeUpVariant} className="max-w-xl"
            >
              <span className="font-paragraph text-sm font-semibold text-highlight-hover uppercase tracking-[0.2em] mb-6 block">
                Latest Message
              </span>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
                {latestSermon?.title ?? 'Walking in Faith Through the Valley'}
              </h2>
              <p className="font-paragraph text-lg text-white/70 mb-8 leading-relaxed">
                {latestSermon?.description ?? 'Watch our most recent message and be encouraged in your faith journey. Discover how the pillar of cloud guides us even today.'}
              </p>
              <div className="flex items-center gap-6 mb-12">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-highlight-hover" />
                </div>
                <div>
                  <p className="font-heading text-lg">{latestSermon?.speaker ?? 'Pastor'}</p>
                  {latestSermon?.date && (
                    <p className="font-paragraph text-sm text-white/50">
                      {new Date(latestSermon.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
              <a href="/sermons">
                <Button className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg rounded-none tracking-wide">
                  Watch More Sermons
                </Button>
              </a>
            </motion.div>
          </div>

          <div className="relative h-[50vh] lg:h-auto bg-black">
            <img
              src={latestSermon?.youtubeVideoId
                ? `https://img.youtube.com/vi/${latestSermon.youtubeVideoId}/maxresdefault.jpg`
                : SERMON_IMAGE}
              alt="Sermon Video Thumbnail"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <a
                href={latestSermon?.youtubeVideoId
                  ? `https://www.youtube.com/watch?v=${latestSermon.youtubeVideoId}`
                  : '/sermons'}
                target={latestSermon?.youtubeVideoId ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors group border border-white/20"
              >
                <Play className="w-10 h-10 text-white ml-2 group-hover:scale-110 transition-transform" fill="currentColor" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. WORSHIP SONGS & GALLERY — Side by Side ─────────────────── */}
      <section className="py-0 border-t border-primary/10">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* Songs Half */}
          <div className="p-12 md:p-24 lg:pr-16 bg-primary/5 flex flex-col justify-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}>
              <Music className="w-10 h-10 text-secondary mb-8" strokeWidth={1.5} />
              <h2 className="font-heading text-4xl md:text-5xl text-primary mb-6">Worship With Us</h2>
              <p className="font-paragraph text-lg text-foreground/70 mb-12 leading-relaxed max-w-md">
                Sing along with the songs we worship with. Prepare your heart for service by exploring our collection.
              </p>
              <div className="space-y-6 mb-12">
                {songs.length > 0 ? songs.map((song) => (
                  <a href="/songs" key={song._id} className="group flex items-center justify-between border-b border-primary/10 pb-6 cursor-pointer">
                    <div>
                      <h4 className="font-heading text-xl text-primary group-hover:text-secondary transition-colors">{song.songTitle}</h4>
                      <p className="font-paragraph text-sm text-foreground/50 mt-1">{song.artist ?? 'Traditional'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-secondary group-hover:border-secondary transition-all">
                      <Play className="w-4 h-4 text-primary group-hover:text-white ml-1" fill="currentColor" />
                    </div>
                  </a>
                )) : (
                  <p className="font-paragraph text-foreground/50 italic">Song list updating...</p>
                )}
              </div>
              <a href="/songs">
                <Button variant="link" className="text-primary hover:text-secondary p-0 h-auto font-paragraph font-semibold tracking-widest uppercase text-sm">
                  Browse All Songs <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Gallery / Visit CTA Half */}
          <div
            className="relative p-12 md:p-24 lg:pl-16 flex flex-col justify-center overflow-hidden min-h-[500px]"
            style={{ backgroundImage: `url(${CTA_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-primary/85" />
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="relative z-10">
              <ImageIcon className="w-10 h-10 text-highlight-hover mb-8" strokeWidth={1.5} />
              <h2 className="font-heading text-4xl md:text-5xl text-white mb-6">Our Community</h2>
              <p className="font-paragraph text-lg text-white/80 mb-12 leading-relaxed max-w-md">
                Glimpses of worship, fellowship, and ministry in action. See the life of our church family.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/gallery">
                  <Button className="bg-white text-primary hover:bg-highlight-hover hover:text-primary px-8 py-6 rounded-none tracking-wide transition-colors">
                    View Gallery
                  </Button>
                </a>
                <a href="/about">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-6 rounded-none tracking-wide transition-colors">
                    About Us
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ── 8. VISIT US — Immersive CTA ───────────────────────────────── */}
      <section className="relative py-40 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src={CTA_IMAGE} alt="Church doors welcoming" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/90 mix-blend-multiply" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}>
            <h2 className="font-heading text-5xl md:text-7xl text-white mb-8">New Here?</h2>
            <p className="font-paragraph text-xl md:text-2xl text-white/80 mb-12 leading-relaxed font-light">
              We would love to welcome you.<br className="hidden md:block" />
              Join us this Sunday and experience worship with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="/about">
                <Button className="w-full sm:w-auto bg-white text-primary hover:bg-highlight-hover hover:text-primary px-10 py-7 text-lg rounded-none tracking-wide transition-colors">
                  Plan Your Visit
                </Button>
              </a>
              <a href="/contact">
                <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary px-10 py-7 text-lg rounded-none tracking-wide transition-colors">
                  Contact Us
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
