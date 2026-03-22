import { motion } from 'framer-motion';
import { Calendar, Clock, Video } from 'lucide-react';
import SmartLivePlayer from '../ui/SmartLivePlayer';
import RecentSermonsGrid from '../ui/RecentSermonsGrid';

interface Sermon {
  _id: string;
  title: string;
  speaker?: string;
  date?: string;
  youtubeVideoId?: string;
}

interface Props {
  channelId: string;
  recentSermons: Sermon[];
}

export default function WatchLiveView({ channelId, recentSermons }: Props) {
  const fallbackSermon = recentSermons.length > 0 ? recentSermons[0] : null;

  return (
    <div className="min-h-screen bg-[#0B1221] overflow-hidden selection:bg-[#C0A87D]/30 selection:text-white pb-32">

      {/* ── IMMERSIVE BACKGROUND LAYER ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 scale-[1.02]"
          style={{ backgroundImage: 'url(/images/watchview-bg.jpg)' }}
        />
        {/* Uniform light overlay ensures all corners of the image (worshipers, lit corner) are perfectly visible */}
        <div className="absolute inset-0 bg-[#0B1221]/40" />
        {/* Classic Dark Blue Gradient Overlay from the Left */}
        <div className="absolute inset-y-0 left-0 w-full md:w-full bg-gradient-to-r from-[#0B1221] via-[#0B1221]/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B1221] to-transparent border-none" />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 pt-32 md:pt-40">

        {/* 1. CINEMATIC HERO */}
        <section className="px-6 text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full border border-[#C0A87D]/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(192,168,125,0.15)] bg-[#C0A87D]/5">
              <Video className="w-6 h-6 text-[#C0A87D]" strokeWidth={1.5} />
            </div>

            <span className="font-paragraph text-[#C0A87D] text-xs font-bold uppercase tracking-[0.3em] mb-4 block drop-shadow-md">
              Step Into His Presence
            </span>

            <h1
              className="text-5xl md:text-7xl lg:text-8xl text-white mb-6 uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] tracking-wide"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600, lineHeight: 1.1 }}
            >
              Watch <span className="text-[#C0A87D] italic font-light drop-shadow-[0_0_25px_rgba(192,168,125,0.4)]">Live</span>
            </h1>

            <p className="font-paragraph text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light tracking-[0.05em]">
              No matter where you are, you are part of our family. Join our live worship services to experience God's word together.
            </p>
          </motion.div>
        </section>

        {/* 2. THEATRICAL LIVE STREAM PLAYER & SCHEDULE */}
        <section className="px-4 md:px-6 mb-32">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="relative group"
            >
              {/* Glowing Ambient Backlight for the Entire Cohesive Card */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-transparent via-[#C0A87D]/20 to-transparent rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000 pointer-events-none"></div>

              <div className="relative rounded-2xl md:rounded-[2rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.8)] border border-white/10 bg-[#0B1221]/80 backdrop-blur-xl flex flex-col">

                {/* Custom top bar for that premium "Event" feel */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#C0A87D] to-transparent opacity-80 z-20" />

                {/* TOP HALF: THE VIDEO PLAYER */}
                <div className="w-full bg-black/50 p-4 md:p-8 lg:p-10 pb-6 border-b border-white/5 shadow-inner">
                  <SmartLivePlayer
                    fallbackVideoId={fallbackSermon?.youtubeVideoId}
                    fallbackTitle={fallbackSermon?.title || 'Recent Service'}
                    className="w-full"
                    theme="dark"
                  />
                </div>

                {/* BOTTOM HALF: THE SCHEDULE */}
                <div className="relative p-6 md:p-10 max-w-5xl w-full flex flex-col items-center text-center">

                  {/* Subtle corner golden accent */}
                  <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#C0A87D]/10 rounded-full blur-[40px] pointer-events-none" />
                  <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[#C0A87D]/10 rounded-full blur-[40px] pointer-events-none" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full relative z-10 mb-8">
                    {/* Sunday */}
                    <div className="flex flex-col items-center bg-black/20 p-6 rounded-xl border border-white/5 hover:border-[#C0A87D]/30 transition-colors">
                      <Calendar className="w-6 h-6 text-[#C0A87D] mb-3" strokeWidth={1.5} />
                      <span className="font-paragraph text-xs text-white/40 uppercase tracking-[0.2em] mb-1 font-bold">Sunday Worship</span>
                      <div className="flex items-center gap-2 mt-2 text-white/90">
                        <Clock className="w-4 h-4 text-[#C0A87D]/70" />
                        <span className="font-heading text-xl tracking-widest uppercase">10:00 AM</span>
                      </div>
                    </div>

                    {/* Wednesday */}
                    <div className="flex flex-col items-center bg-black/20 p-6 rounded-xl border border-white/5 hover:border-[#C0A87D]/30 transition-colors">
                      <Calendar className="w-6 h-6 text-[#C0A87D] mb-3" strokeWidth={1.5} />
                      <span className="font-paragraph text-xs text-white/40 uppercase tracking-[0.2em] mb-1 font-bold">Wednesday Service</span>
                      <div className="flex items-center gap-2 mt-2 text-white/90">
                        <Clock className="w-4 h-4 text-[#C0A87D]/70" />
                        <span className="font-heading text-xl tracking-widest uppercase">07:00 PM</span>
                      </div>
                    </div>

                    {/* Friday */}
                    <div className="flex flex-col items-center bg-black/20 p-6 rounded-xl border border-white/5 hover:border-[#C0A87D]/30 transition-colors">
                      <Calendar className="w-6 h-6 text-[#C0A87D] mb-3" strokeWidth={1.5} />
                      <span className="font-paragraph text-xs text-white/40 uppercase tracking-[0.2em] mb-4 font-bold">Friday Services</span>
                      <div className="flex flex-row items-center justify-center gap-6 text-white/90">
                        <div className="flex flex-col items-center gap-1">
                          <Clock className="w-4 h-4 text-[#C0A87D]/70" />
                          <span className="font-heading text-sm tracking-widest uppercase leading-none">10:30 AM</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="flex flex-col items-center gap-1">
                          <Clock className="w-4 h-4 text-[#C0A87D]/70" />
                          <span className="font-heading text-sm tracking-widest uppercase leading-none">07:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C0A87D]/20 to-transparent mb-6 relative z-10" />

                  <p className="font-paragraph text-white/60 max-w-3xl mx-auto text-[15px] leading-relaxed font-light tracking-wide relative z-10">
                    If the livestream is currently unavailable, wait a few moments or refresh the page. Missed a service? You can always catch up on our
                    <a href="https://www.youtube.com/@PastorK.Andrew" target="_blank" rel="noopener noreferrer" className="text-[#C0A87D] hover:text-white transition-colors duration-300 font-medium mx-1.5 border-b border-[#C0A87D]/30 hover:border-white">
                      YouTube Channel
                    </a>
                    or browse the sermon archive below.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. RECENT SERMONS ARCHIVE */}
        <section className="relative px-6">
          <div className="max-w-[100rem] mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#C0A87D]/50" />
                <span className="font-paragraph text-[#C0A87D] text-xs font-bold uppercase tracking-[0.2em]">
                  Sermon Archive
                </span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#C0A87D]/50" />
              </div>

              <h2
                className="text-4xl md:text-5xl text-white uppercase drop-shadow-md tracking-wide"
                style={{ fontFamily: "'Cinzel', serif", fontWeight: 400 }}
              >
                Previous <span className="italic text-white/90">Messages</span>
              </h2>
            </motion.div>

            <RecentSermonsGrid activeVideoId={fallbackSermon?.youtubeVideoId} theme="dark" hideTitle />
          </div>
        </section>

      </div>
    </div>
  );
}
