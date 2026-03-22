// HomePageClient.tsx — Restructured homepage layout
// Sections: Hero → Quick Info → Pastor → Special Meeting Bar → Daily Quote → Sermon → Songs+Gallery → Visit CTA
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { LazyMotion, domAnimation, m, useScroll, useTransform } from 'framer-motion';
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
import SmartLivePlayer from '../ui/SmartLivePlayer';

// Wix source images (publicly accessible, will be replaced with /public assets later)
const SERMON_IMAGE = 'https://static.wixstatic.com/media/9e129b_dfb0a88c94a44f3daa971f91b4fd0476~mv2.png';
const CTA_IMAGE = 'https://pub-c0ea559d9e3b44439fe9f2006b1ea8bb.r2.dev/Gallery/DSC05375.JPG';

interface Sermon { _id: string; title: string; speaker?: string; date?: string; youtubeVideoId?: string; description?: string; }
interface Event { _id: string; title?: string; eventDate?: string; eventTime?: string; description?: string; eventImageUrl?: string | null; }
interface Song { _id: string; songTitle?: string; artist?: string; audioLink?: string; }
interface DailyVerse { _id: string; date: string; verseText?: string; verseReference?: string; verseImageUrl?: string | null; }

interface Props {
  latestSermon: Sermon | null;
  events: Event[];
  songs: Song[];
  dailyVerse?: DailyVerse | null;
}

export default function HomePageClient({ latestSermon, events, songs, dailyVerse }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const curtainVideoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [pastorSectionOpen, setPastorSectionOpen] = useState(false);
  const [signatureError, setSignatureError] = useState(false);

  type Phase = 'initial' | 'countdown' | 'reveal' | 'site';
  // -------------------------------------------------------------------------
  // ⚙️ TO ENABLE FULL LAUNCH OR REVEAL: set this to 'initial'
  // ⚙️ TO DISABLE EVERYTHING COMPLETELY: set this to 'site'
  // -------------------------------------------------------------------------
  const [phase, setPhase] = useState<Phase>('initial');
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Monitor DOM video readyState so we ONLY let the user launch when the huge video is buffered
  useEffect(() => {
    const video = curtainVideoRef.current;
    if (video) {
      if (video.readyState >= 3) {
        setIsVideoReady(true);
      } else {
        const handleReady = () => setIsVideoReady(true);
        video.addEventListener('canplaythrough', handleReady);
        video.addEventListener('loadeddata', handleReady);
        
        // Safety timeout so user is never permanently stuck if internet is very slow
        const safetyFallback = setTimeout(() => setIsVideoReady(true), 6000);
        return () => {
          video.removeEventListener('canplaythrough', handleReady);
          video.removeEventListener('loadeddata', handleReady);
          clearTimeout(safetyFallback);
        };
      }
    }
  }, []);

  const [countdownSeconds, setCountdownSeconds] = useState(10);

  // Run the countdown timer when the manual Launch button is clicked. Trigger hardware video play strictly at 0.
  useEffect(() => {
    if (phase !== 'countdown') return;

    if (countdownSeconds <= 0) {
      if (curtainVideoRef.current && isVideoReady) {
         curtainVideoRef.current.play().catch(e => { console.warn("Autoplay blocked", e); setPhase('reveal'); });
      }
      return;
    }

    const interval = setInterval(() => {
      setCountdownSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (curtainVideoRef.current && isVideoReady) {
             curtainVideoRef.current.play().catch(e => { console.warn("Autoplay blocked", e); setPhase('reveal'); });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, countdownSeconds, isVideoReady]);

  // Listen for actual frame painting to guarantee the logo and CSS don't reveal too early
  useEffect(() => {
    const video = curtainVideoRef.current;
    if (!video) return;
    const handlePlaying = () => {
      // The exact millisecond the browser hardware pushes the first video frame, drop the preloader and sync the Logo!
      setPhase('reveal'); 
    };
    video.addEventListener('playing', handlePlaying);
    return () => video.removeEventListener('playing', handlePlaying);
  }, []);

  // Trigger curtain video exactly when the reveal phase starts
  useEffect(() => {
    if (phase === 'reveal' && curtainVideoRef.current) {
      curtainVideoRef.current.play().catch(e => console.warn("Curtain video play failed", e));
    }
  }, [phase]);

  useEffect(() => {
    // Only play the background video (clouds) if we've passed the countdown phase completely
    if (phase !== 'initial' && phase !== 'countdown') {
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch((e) => console.warn("Video play failed", e));
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '40%']);
  const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0]);

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as const } },
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <LazyMotion features={domAnimation}>

      {/* ── INITIAL LAUNCH BUTTON OR COUNTDOWN OVERLAY ───────────────────────── */}
      {/* ── INITIAL LAUNCH BUTTON OR COUNTDOWN OVERLAY ───────────────────────── */}
      {(phase === 'initial' || (phase === 'countdown' && !isVideoPlaying)) && (
        <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[#0B1221] overflow-hidden pointer-events-auto transition-opacity duration-300">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(192,168,125,0.1)_0%,_transparent_60%)] pointer-events-none" />

          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex flex-col items-center px-6"
          >
            <h2 
              className="text-white mb-6 text-center uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col items-center"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600, letterSpacing: '0.12em', lineHeight: 1.2 }}
            >
              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-balance">
                The Pillar of Fire Ministries
              </span>
            </h2>
            <span className="text-[#C0A87D] font-paragraph text-sm md:text-base uppercase tracking-[0.4em] font-semibold mb-12 drop-shadow-md">
                Pastor K. Andrew
            </span>

            {/* Launch Action Area */}
            <div className="flex items-center justify-center min-h-[160px]">
              {phase === 'initial' ? (
                <button
                  onClick={() => isVideoReady && setPhase('countdown')}
                  className={`bg-transparent border border-[#C0A87D]/50 text-white font-heading text-xl md:text-2xl tracking-widest uppercase px-12 py-5 md:py-6 rounded-full shadow-[0_0_30px_rgba(192,168,125,0.15)] transition-all duration-500 backdrop-blur-md relative overflow-hidden group ${
                    isVideoReady 
                    ? 'hover:border-[#C0A87D] hover:bg-[#C0A87D]/10 hover:shadow-[0_0_50px_rgba(192,168,125,0.3)] hover:-translate-y-1' 
                    : 'opacity-50 cursor-wait'
                  }`}
                >
                  <span className="relative z-10">{isVideoReady ? 'Launch Website' : 'Preloading...'}</span>
                  {isVideoReady && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C0A87D]/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />}
                </button>
              ) : (
                <div className="flex flex-col items-center">
                  <m.span
                    key={countdownSeconds} // Re-animate on number change
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="font-heading text-[8rem] md:text-[12rem] leading-none text-white font-bold drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] tracking-tighter"
                  >
                    {countdownSeconds === 0 ? "Starting..." : countdownSeconds}
                  </m.span>
                  <m.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[#C0A87D] font-paragraph text-sm md:text-base uppercase tracking-[0.5em] font-semibold mt-8 drop-shadow-md">
                    Seconds
                  </m.span>
                </div>
              )}
            </div>
            <p className="text-white/40 font-paragraph tracking-[0.3em] uppercase mt-20 text-xs md:text-sm">
              {phase === 'initial' ? 'Website Launch Mode' : 'Preparing to Launch'}
            </p>
          </m.div>
        </div>
      )}

      {/* ── 3D VIDEO CURTAIN REVEAL OVERLAY ───────────────────────── */}
      {/* We mount this during 'initial' and 'countdown' too so the heavy 59MB mp4 preloads perfectly in the background without lag! */}
      {(phase === 'initial' || phase === 'countdown' || phase === 'reveal') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-transparent pointer-events-none">

          {/* SVG Green Screen Keying Filter with extreme precision to wipe out green grain */}
          <svg width="0" height="0" className="absolute pointer-events-none">
            <defs>
              <filter id="green-screen" colorInterpolationFilters="sRGB">
                {/* 1. Extract a mask strictly penalizing Green.
                      A = 1*R - 2*G + 1*B + 0.1 
                      This causes any greenish-grey grain to instantly plunge below 0 (transparent).
                      Pure whites and greys balance out to 0, which gets lifted to +0.1 (opaque). */}
                <feColorMatrix in="SourceGraphic" type="matrix" values="
                   0 0 0 0 0
                   0 0 0 0 0
                   0 0 0 0 0
                   1 -1 1 0 0.1
                 " result="maskAlpha" />

                {/* 2. Soft threshold.
                      slope=5 turns the small positive offset (+0.1) of whites/shadows into full opacity.
                      Negative values (the green background) stay transparent. */}
                <feComponentTransfer in="maskHighContrast" result="maskHighContrast">
                  <feFuncA type="linear" slope="5" intercept="0" />
                </feComponentTransfer>

                {/* 3. Minimal blur to keep edges crisp but not pixelated */}
                <feGaussianBlur in="maskHighContrast" stdDeviation="0.8" result="maskBlurred" />

                {/* 4. Mask the original crisp video through the smoothed green-screen mask */}
                <feComposite in="SourceGraphic" in2="maskBlurred" operator="in" />
              </filter>
            </defs>
          </svg>

          {/* The Video (Preloaded silently, played manually from the ref) */}
          <video
            ref={curtainVideoRef}
            src="/videos/curtain.mp4"
            muted
            playsInline
            preload="auto"
            onEnded={() => setPhase('site')}
            onError={() => setPhase('site')}
            style={{ filter: 'url(#green-screen)' }}
            className={`absolute inset-0 w-full h-full object-cover pointer-events-auto ${phase === 'reveal' ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Welcome Logo Container */}
          {phase === 'reveal' && (
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.9, 1, 1.02, 1.05] }}
              transition={{ duration: 2, times: [0, 0.3, 0.6, 1], ease: "easeInOut" }}
              className="absolute inset-0 z-[110] flex items-center justify-center pointer-events-none"
            >
              {/* Church Logo isolated and enlarged */}
              <img src="/images/watermark.png" alt="Church Logo" className="w-[320px] md:w-[420px] lg:w-[520px] object-contain drop-shadow-[0_10px_30px_rgba(255,255,255,0.7)]" />
            </m.div>
          )}
        </div>
      )}

      <div className="min-h-screen bg-[#0B1221] overflow-x-hidden selection:bg-highlight-hover selection:text-primary">
        <style>{`
        .sacred-divider {
          position: relative; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(192,168,125,0.2), transparent);
        }
        .sacred-divider::after {
          content: ''; position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%) rotate(45deg);
          width: 6px; height: 6px; background-color: #C0A87D; opacity: 0.5;
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
        <section
          ref={heroRef}
          className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden bg-primary"
        >
          <video
            ref={videoRef}
            src="/videos/hero-clouds.mp4#t=0.001"
            muted loop playsInline preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60" />

          {/* ── MAGICAL FALLING GOLDEN DUST ────────────────────────── */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen">
            {[...Array(isMobile ? 8 : 40)].map((_, i) => (
              <m.div
                key={`dust-${i}`}
                initial={{
                  y: -50,
                  x: `${Math.random() * 100}vw`,
                  opacity: 0,
                  scale: Math.random() * 0.8 + 0.3
                }}
                animate={{
                  y: '110vh',
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 12 + 8, // 8 to 20 seconds falling (smooth and graceful)
                  repeat: Infinity,
                  delay: Math.random() * -20, // Pre-scatter them so they don't start at the same time
                  ease: "linear"
                }}
                className={`absolute top-0 w-1 h-1 bg-[#C0A87D] rounded-full ${isMobile ? 'opacity-80' : 'shadow-[0_0_12px_3px_rgba(244,196,48,0.5)] blur-[0.5px]'}`}
              />
            ))}
          </div>

          <m.div
            style={{ opacity: heroOpacity }}
            className="relative z-10 text-center px-6 max-w-[100rem] mx-auto w-full flex flex-col items-center justify-center"
          >
            {/* Hero title — Two lines, Cinzel 600, improved readability */}
            <m.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-white mb-10 text-center uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col items-center flex-wrap"
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                letterSpacing: '0.12em',
                lineHeight: 1.2,
              }}
            >
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                The Pillar of Fire Ministries
              </span>
            </m.h1>

            <m.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-base sm:text-lg md:text-xl text-white/90 mb-12 italic max-w-4xl mx-auto px-4 text-pretty leading-loose md:leading-[2] mt-8 drop-shadow-md"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 400, letterSpacing: '0.04em' }}
            >
              "And the Lord went before them in a pillar of fire the pillar of fire was the Angel of the covenant jesus was the Logos that went out of the God what we would call a theophany"
              <span className="block text-sm font-paragraph not-italic mt-4 text-highlight-hover tracking-widest uppercase">
                ( VOICE OF GOD )

              </span>
            </m.p>

          </m.div>
        </section>

        {/* ── 2. QUICK INFO — Overlapping Cards ─────────────────────────── */}
        <section className="relative z-20 px-6 -mt-24 pb-16">
          <div className="max-w-5xl mx-auto">
            <m.div
              variants={staggerContainer} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-1"
            >
              {[
                { icon: MapPin, title: 'VISIT US', desc1: 'Sunday Worship – 10:00 AM', desc2: 'Tune in to our live service or catch up on recent sermons', href: '/contact', cta: 'Get Directions' },
                { icon: Play, title: 'WATCH ONLINE', desc1: 'Join our worship service live', desc2: 'Every Sunday at 10:00 AM', href: '/watch-live', cta: 'Watch Now' },
                { icon: LatinCross, title: 'NEED PRAYER SUPPORT?', desc1: 'Submit your prayer request', desc2: 'Our church will pray for you', href: '/prayer-requests', cta: 'Request For Prayer' },
              ].map(({ icon: Icon, title, desc1, desc2, href, cta }) => (
                <m.div key={title} variants={fadeUpVariant} className="h-full">
                  <a href={href} className="block h-full cursor-pointer">
                    <div
                      className="bg-white/5 backdrop-blur-xl p-8 text-center group border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-200 hover:-translate-y-2 hover:bg-[#C0A87D] hover:border-[#C0A87D] hover:shadow-[0_15px_40px_rgba(192,168,125,0.4)] relative overflow-hidden h-full flex flex-col justify-center"
                    >
                      <Icon className="w-8 h-8 mx-auto mb-4 text-[#C0A87D] group-hover:text-[#0B1221] transition-transform duration-200 group-hover:scale-110 relative z-10" strokeWidth={1.5} />
                      <h3 className="font-heading text-xl text-white group-hover:text-[#0B1221] mb-2 tracking-wide transition-colors duration-200 relative z-10">{title}</h3>
                      <p className="font-paragraph text-sm text-white/80 group-hover:text-[#0B1221]/90 transition-colors duration-200 mb-1 relative z-10">{desc1}</p>
                      <p className="font-paragraph text-xs text-white/50 group-hover:text-[#0B1221]/70 transition-colors duration-200 mb-5 relative z-10 flex-grow">{desc2}</p>
                      
                      <span className="relative z-10 inline-flex items-center justify-center font-paragraph text-sm font-semibold text-[#C0A87D] group-hover:text-[#0B1221] uppercase tracking-widest transition-colors duration-200">
                        {cta} <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                      
                      {/* Subtle golden aura glow on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.2)_0%,_transparent_70%)] transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </a>
                </m.div>
              ))}
            </m.div>
          </div>
        </section>

        {/* ── 5. SPECIAL MEETING — Compact Announcement Bar (hidden if no meeting) ── */}
        {events && events.length > 0 && (
          <section className="py-5 px-6 bg-[#131d3b]/40 border-y border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative z-20 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
              <span className="inline-block border border-[#d93d3d]/50 text-[#d93d3d] font-paragraph text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-sm">
                Event
              </span>
              <span className="font-heading text-lg md:text-xl text-white tracking-wide">
                {events[0].title || "Special Event"}
              </span>
              <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
              <span className="font-paragraph text-sm text-white/70 uppercase tracking-widest">
                {events[0].eventDate
                  ? new Date(events[0].eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : "Coming Soon"}
              </span>
              <a href="/events" className="ml-0 sm:ml-4 mt-2 sm:mt-0">
                <Button size="sm" className="bg-[#d93d3d]/10 hover:bg-[#d93d3d] text-[#d93d3d] hover:text-white border border-[#d93d3d]/30 transition-all rounded-none text-xs px-6 py-2 tracking-widest uppercase">
                  Learn More
                </Button>
              </a>
            </div>
          </section>
        )}

        {/* ── 3. DAILY QUOTE — CMS-driven with fallback ──────────────────────────────── */}
        {(() => {
          const displayVerseText = dailyVerse?.verseText || "The LORD is my shepherd; I shall not want.";
          const displayVerseRef = dailyVerse?.verseReference || "Psalm 23:1";
          const displayImageUrl = dailyVerse?.verseImageUrl;
          const hasText = !!displayVerseText;

          return (
            <section className={`relative overflow-hidden flex ${hasText ? 'py-16 md:py-24 px-6 bg-[#FDFBF7]' : 'py-12 md:py-16 px-6 bg-primary/5'}`}>

              {/* Background Layer */}
              {hasText && (
                <div className="absolute inset-0">
                  {displayImageUrl ? (
                    <>
                      <img loading="lazy" src={displayImageUrl} alt="Daily Verse Background" className="w-full h-full object-cover" />
                    </>
                  ) : (
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")' }}
                    />
                  )}
                </div>
              )}

              <div className="max-w-5xl mx-auto text-center relative z-10">
                {hasText ? (
                  <m.div
                    initial="hidden" whileInView="visible"
                    viewport={{ once: true, margin: '0px' }} variants={fadeUpVariant}
                    className="flex flex-col items-center justify-center text-center py-4"
                  >
                    <span className={`font-paragraph text-sm font-semibold uppercase tracking-[0.2em] mb-12 block ${displayImageUrl ? 'text-highlight-hover' : 'text-secondary'}`}>
                      Quote Of The Day
                    </span>
                    <h2
                      className={`font-heading text-xl md:text-2xl mb-12 italic max-w-5xl mx-auto text-balance ${displayImageUrl ? 'text-white/85' : 'text-primary/85'}`}
                      style={{ fontWeight: 400, letterSpacing: '0.04em', lineHeight: 1.8 }}
                    >
                      "{displayVerseText}"
                    </h2>
                    {displayVerseRef && (
                      <div className="flex items-center justify-center gap-4">
                        <div className={`w-8 h-px ${displayImageUrl ? 'bg-white/20' : 'bg-primary/20'}`} />
                        <p className={`font-paragraph text-xs md:text-sm tracking-widest uppercase ${displayImageUrl ? 'text-highlight-hover' : 'text-secondary'}`}>
                          {displayVerseRef}
                        </p>
                        <div className={`w-8 h-px ${displayImageUrl ? 'bg-white/20' : 'bg-primary/20'}`} />
                      </div>
                    )}
                  </m.div>
                ) : displayImageUrl ? (
                  <m.div
                    initial="hidden" whileInView="visible"
                    viewport={{ once: true, margin: '0px' }} variants={fadeUpVariant}
                    className="flex flex-col items-center justify-center"
                  >
                    <span className="font-paragraph text-sm font-semibold text-secondary uppercase tracking-[0.2em] mb-8 block">
                      Daily Quote
                    </span>
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-primary/10">
                      <img loading="lazy" src={displayImageUrl} alt="Daily Quote" className="w-full h-auto max-h-[75vh] object-contain bg-white" />
                    </div>
                  </m.div>
                ) : null}
              </div>
            </section>
          );
        })()}

        {/* (Removed Gradient fade block that previously obscured the Quote section) */}

        {/* ── 4. PASTOR SECTION ─────── */}
        <section className="py-20 md:py-32 bg-white relative z-20 overflow-hidden">

          {/* Church Logo Watermark - Bottom Layer (with frosted cover) */}
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-y-0 right-0 w-full lg:w-1/2 z-0 flex items-center justify-center pointer-events-none overflow-hidden"
          >
            <img src="/images/watermark.png" alt="" className="w-11/12 md:w-[90%] min-w-[300px] max-w-[700px] lg:scale-105 object-contain opacity-70" />
          </m.div>
          {/* Frosted Layer protecting the entire background */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-md z-0 pointer-events-none" />

          {/* Subtle Background Texture & Editorial Light Rays (Render ON TOP of the frosted glass) */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[1]"
            style={{ backgroundImage: 'radial-gradient(#1e2f5a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.08),_transparent_70%)] pointer-events-none z-[1]" />



          <div className="max-w-[85rem] mx-auto px-6 relative z-10">
            <m.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center"
            >
              {/* Image Side with Interactive Framing & Depth */}
              <m.div variants={fadeUpVariant} className="flex justify-center p-4 relative w-full">
                <div className="relative w-full max-w-[32rem] lg:max-w-[38rem] group cursor-default">
                  {/* Outer glowing aura */}
                  <div className="absolute inset-0 rounded-3xl bg-[#C0A87D]/10 blur-[40px] opacity-0 group-hover:opacity-60 transition-opacity duration-[1500ms] -z-20" />

                  {/* Dynamic Offset Decorative Gold Frame */}
                  <div className="absolute -inset-3 sm:-inset-5 border-2 rounded-3xl border-[#C0A87D]/50 -z-10 transition-all duration-[1200ms] ease-out translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 group-hover:border-[#C0A87D] shadow-sm group-hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]" />

                  {/* Image container - Wide Rectangular Landscape styling with rounded edges */}
                  <div className="relative aspect-[4/3] w-full mx-auto rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(30,47,90,0.15)] border border-[#C0A87D]/30 transition-all duration-1000 transform group-hover:scale-[1.02] group-hover:border-[#C0A87D]/60 group-hover:shadow-[0_30px_60px_rgba(30,47,90,0.25)] bg-[#1e2f5a]">
                    <img
                      loading="lazy"
                      src="/images/Pastor.png"
                      alt="Pastor K. Andrew"
                      className="w-full h-full object-cover object-center p-0 m-0"
                    />
                  </div>
                </div>
              </m.div>

              {/* Text Side with Standard Paragraphs & Foil Signature */}
              <m.div variants={staggerContainer} className="flex flex-col text-center lg:text-left lg:pl-10 relative mt-8 lg:mt-0">
                <m.span variants={fadeUpVariant} className="font-paragraph text-xs font-bold text-[#d93d3d] uppercase tracking-[0.25em] mb-4 drop-shadow-sm block">
                  OUR BELOVED
                </m.span>
                <m.h2 variants={fadeUpVariant} className="font-heading text-4xl md:text-5xl text-[#1e2f5a] mb-[3.25rem] font-bold tracking-wide">
                  Pastor K.Andrew
                </m.h2>

                <m.div variants={fadeUpVariant} className="relative mb-10 group cursor-default text-left">



                  {/* Premium Editorial Quote Styling with Gold Vertical Anchor */}
                  <p className="font-serif italic font-light text-slate-700 leading-[2.1] text-[1.2rem] relative z-10 pl-6 border-l-[3px] border-[#C0A87D]/50">
                    By the grace of God, I, Pastor K. Andrew, an anointed servant of God, established "The Pillar of Fire Ministries" in obedience to His divine calling, for the advancement of His Kingdom and the proclamation of His truth. The Lord led me to establish
                    "The Pillar of Cloud Tabernacle" at Hyderabad in India—an end-time message church,birthed through earnest prayer, unwavering faith, and my complete obedience to His calling.

                  </p>
                </m.div>

                {/* Authentic Foil-Stamped Signature Touch (Kept exactly as is per request) */}
                <m.div variants={fadeUpVariant} className="flex flex-col items-center lg:items-start mt-6">
                  {signatureError ? (
                    <p
                      className="text-[#C0A87D] text-[4.5rem] md:text-[5.5rem] opacity-95 mb-4 -rotate-3 transition-transform duration-700 hover:-rotate-1 hover:scale-105"
                      style={{
                        fontFamily: "'Herr Von Muellerhoff', cursive",
                        fontWeight: 400,
                        textShadow: '1px 1px 1px rgba(0,0,0,0.2), 0 0 15px rgba(212,175,55,0.4)',
                      }}
                    >
                      K. Andrew
                    </p>
                  ) : (
                    <img
                      src="/images/pastor-signature.svg"
                      alt="K. Andrew Signature"
                      className="h-20 md:h-28 w-auto object-contain object-left mb-4 -rotate-3 transition-transform duration-700 hover:-rotate-1 hover:scale-105 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      onError={() => setSignatureError(true)}
                    />
                  )}
                  <p className="font-paragraph text-slate-400 text-xs tracking-[0.2em] uppercase font-semibold">
                    — The Pillar Of Cloud Tabernacle
                  </p>
                </m.div>
              </m.div>
            </m.div>
          </div>
        </section>

        {/* ── 6. LATEST SERMON & LIVE STREAM — Smart Split Layout ────────── */}
        <section className="py-0 bg-[#131d3b]/40 text-white border-t border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative z-10 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">

            <div className="p-12 md:p-24 flex flex-col justify-center relative z-10">
              <m.div
                initial="hidden" whileInView="visible"
                viewport={{ once: true }} variants={fadeUpVariant} className="max-w-xl"
              >
                <span className="font-paragraph text-sm font-semibold text-[#d93d3d] uppercase tracking-[0.2em] mb-6 block drop-shadow-sm">
                  Join Us
                </span>
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight tracking-wide drop-shadow-md">
                  Watch Live & Recent Sermons
                </h2>
                <p className="font-paragraph text-lg text-white/70 mb-10 leading-relaxed font-light">
                  Tune in to our live service or catch up on recent sermons. Be encouraged in your faith journey as we gather in His presence.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="/watch-live">
                    <Button className="bg-[#d93d3d]/10 border border-[#d93d3d]/30 hover:bg-[#d93d3d] text-[#d93d3d] hover:text-white px-8 py-6 text-lg rounded-none tracking-widest uppercase transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(217,61,61,0.3)] backdrop-blur-sm font-semibold">
                      Live Stream Page
                    </Button>
                  </a>
                  <a href="/sermons">
                    <Button variant="outline" className="border-white/20 text-white/80 hover:bg-white hover:text-[#0B1221] px-8 py-6 text-lg rounded-none tracking-widest uppercase transition-all duration-300 hover:-translate-y-1 hover:shadow-lg font-semibold bg-white/5 backdrop-blur-sm">
                      All Sermons
                    </Button>
                  </a>
                </div>
              </m.div>
            </div>

            <div className="relative p-6 md:p-12 lg:p-24 flex items-center justify-center border-l lg:border-l border-white/5">
              {/* The SmartLivePlayer dynamically defaults to LIVE or LATEST SERMON with polling */}
              <SmartLivePlayer
                fallbackVideoId={latestSermon?.youtubeVideoId}
                fallbackTitle={latestSermon?.title || 'Latest Sermon'}
                className="w-full max-w-2xl"
              />
            </div>

          </div>
        </section>

        {/* ── 7. WORSHIP SONGS & GALLERY — Side by Side ─────────────────── */}
        <section className="py-0 border-t border-white/5 relative z-10 bg-[#0B1221]">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Songs Half */}
            <div className="p-12 md:p-24 lg:pr-16 bg-black/20 flex flex-col justify-center">
              <m.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}>
                <Music className="w-10 h-10 text-[#C0A87D] mb-8" strokeWidth={1.5} />
                <h2 className="font-heading text-4xl md:text-5xl text-white mb-6 tracking-wide drop-shadow-md">Worship With Us</h2>
                <p className="font-paragraph text-lg text-white/70 mb-12 leading-relaxed max-w-md font-light">
                  Sing along with the songs we worship with. Prepare your heart for service by exploring our collection.
                </p>
                <div className="space-y-6 mb-12">
                  {songs.length > 0 ? songs.map((song) => (
                    <a href={song.audioLink || '/songs'} target={song.audioLink ? '_blank' : '_self'} rel={song.audioLink ? 'noopener noreferrer' : ''} key={song._id} className="group flex items-center justify-between border-b border-white/5 pb-6 cursor-pointer">
                      <div>
                        <h4 className="font-heading text-xl text-white/90 group-hover:text-[#C0A87D] transition-colors">{song.songTitle}</h4>
                        <p className="font-paragraph text-sm text-white/40 mt-1 uppercase tracking-wider">{song.artist ?? 'Traditional'}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#C0A87D] group-hover:border-[#C0A87D] transition-all shadow-sm">
                        <ArrowRight className="w-4 h-4 text-white/70 group-hover:text-[#0B1221] transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2} />
                      </div>
                    </a>
                  )) : (
                    <p className="font-paragraph text-white/50 italic font-light hover:text-[#C0A87D] transition-colors">Song list updating...</p>
                  )}
                </div>
                <a href="/songs">
                  <Button variant="link" className="text-[#C0A87D] hover:text-white p-0 h-auto font-paragraph font-semibold tracking-widest uppercase text-sm drop-shadow-sm">
                    Browse All Songs <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
              </m.div>
            </div>

            {/* About Us CTA Half */}
            <div
              className="relative p-12 md:p-24 lg:pl-16 flex flex-col justify-center overflow-hidden min-h-[500px] border-l-0 lg:border-l border-white/5 group bg-[#0B1221]"
            >
              {/* Dynamic Interactive Background */}
              <div className="absolute inset-0 bg-cover bg-center opacity-70 transition-transform duration-[2000ms] ease-out group-hover:scale-[1.03]" style={{ backgroundImage: `url('/images/watchview-bg.jpg')` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-[#0B1221]/50 to-transparent" />
              <div className="absolute inset-0 bg-[#0A1428]/20 backdrop-blur-[1px] group-hover:backdrop-blur-0 transition-all duration-700" />

              <m.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="relative z-10">
                <h2 className="font-heading text-4xl md:text-5xl text-white mb-6 drop-shadow-md tracking-wide">Learn More About Us</h2>
                <p className="font-paragraph text-lg text-white/80 mb-12 leading-relaxed max-w-md font-light drop-shadow-sm">
                  Discover our mission, our vision for the future, and our church family.
                </p>
                <div className="flex gap-4">
                  <a href="/about">
                    <Button className="bg-[#C0A87D]/10 border border-[#C0A87D]/30 text-[#C0A87D] hover:bg-[#C0A87D] hover:text-[#0B1221] px-8 py-6 rounded-none tracking-widest uppercase transition-all duration-300 font-semibold backdrop-blur-sm">
                      About Us
                    </Button>
                  </a>
                </div>
              </m.div>
            </div>

          </div>
        </section>

        {/* ── 8. VISIT US — Immersive Spiritual Gateway ─────────────────── */}
        <section className="relative min-h-[75vh] flex items-center justify-center py-32 md:py-40 px-6 overflow-hidden group">

          {/* Gateway Image Background with Subtle Motion and Controlled Brightness */}
          <div className="absolute inset-0 z-0 bg-[#0B1221]">
            <div
              className="w-full h-full bg-no-repeat group-hover:scale-[1.03] transition-transform duration-[8000ms] ease-out brightness-[0.85] contrast-[0.95]"
              style={{ backgroundImage: 'url(/images/cta-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
          </div>

          {/* Cinematic Depth & Spiritual Focus Overlay */}
          <div
            className="absolute inset-0 z-10 pointer-events-none mix-blend-multiply"
            style={{ background: 'linear-gradient(rgba(10, 25, 60, 0.85), rgba(10, 25, 60, 0.95))' }}
          />

          {/* Soft Vignette (Dark edges -> lighter center) to draw attention inward */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(10, 25, 60, 0.8) 100%)' }}
          />

          {/* Smooth Blend to preceding section */}
          <div
            className="absolute top-0 left-0 w-full h-56 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(10, 25, 60, 1), transparent)' }}
          />

          <div className="relative z-20 max-w-4xl mx-auto text-center" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
            <m.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}>
              <h2 className="font-heading text-4xl md:text-5xl mb-6 tracking-wide drop-shadow-md text-balance text-transparent bg-clip-text bg-gradient-to-r from-[#FDFBF7] via-[#FDFBF7] to-[#C0A87D]/90">
                New Here?
              </h2>
              <p className="font-serif text-2xl md:text-3xl text-[#C0A87D] mb-10 italic tracking-wider font-light drop-shadow-md">
                "Step into His presence"
              </p>
              <p className="font-paragraph text-xl md:text-2xl text-white/80 mb-12 leading-relaxed font-light drop-shadow">
                We would love to welcome you.<br className="hidden md:block" />
                Join us this Sunday and experience worship with us.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a href="/contact">
                  <Button className="w-full sm:w-auto bg-[#C0A87D]/10 border border-[#C0A87D]/30 text-[#C0A87D] hover:bg-[#C0A87D] hover:text-[#0B1221] px-12 py-7 text-lg rounded-none tracking-widest uppercase transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl font-semibold backdrop-blur-sm">
                    Plan Your Visit
                  </Button>
                </a>
                <a href="/about">
                  <Button variant="outline" className="w-full sm:w-auto border-white/50 text-white hover:bg-white hover:text-primary px-12 py-7 text-lg rounded-none tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-xl font-semibold backdrop-blur-sm">
                    Know About Us
                  </Button>
                </a>
              </div>
            </m.div>
          </div>
        </section>

      </div>
    </LazyMotion>
  );
}
