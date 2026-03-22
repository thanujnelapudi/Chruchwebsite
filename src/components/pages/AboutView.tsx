import { motion } from 'framer-motion';
import { Heart, Target, Book, Users } from 'lucide-react';

interface Leader {
  _id: string;
  name?: string;
  role?: string;
  biography?: string;
  profilePhotoUrl?: string | null;
  email?: string;
}

interface Props {
  leaders: Leader[];
  missionImage: string;
  visionImage: string;
}

export default function AboutView({ leaders, missionImage, visionImage }: Props) {
  return (
    <div className="min-h-screen relative text-white bg-[#0A0B10]">
      {/* Full Page Cinematic Background (oversized to fix mobile viewport jump) */}
      <div className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-[#0A1428]" />
      <div
        className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-cover bg-[center_30%] opacity-100 saturate-[0.8] brightness-[0.5] transition-all duration-700"
        style={{ backgroundImage: `url('/images/cta-bg.jpg')` }}
      />

      {/* Divine Light Rays */}
      <div className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 overflow-hidden pointer-events-none mix-blend-plus-lighter opacity-50">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[120%] bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-[120px]" />
        <div className="absolute top-[-20%] left-[15%] w-[15%] h-[130%] bg-gradient-to-b from-[#C0A87D]/15 via-[#C0A87D]/5 to-transparent rotate-[25deg] blur-2xl origin-top" />
        <div className="absolute top-[-10%] right-[10%] w-[25%] h-[120%] bg-gradient-to-b from-white/15 via-white/2 to-transparent rotate-[-20deg] blur-3xl origin-top" />
        <div className="absolute top-[-10%] left-[45%] w-[5%] h-[100%] bg-gradient-to-b from-white/20 to-transparent rotate-[5deg] blur-xl origin-top" />
      </div>

      <div className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-gradient-to-b from-[#0A1428]/5 via-[#0A1428]/60 to-[#0A1428]/95 pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0A1428_100%)] opacity-[0.75] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-0 md:pt-40 md:pb-2 px-6 z-10">
        <div className="max-w-[100rem] mx-auto text-center relative z-10 flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center w-full mb-6">
            <motion.h1
              className="font-heading text-5xl md:text-7xl mb-2 tracking-wide font-light text-transparent bg-clip-text bg-gradient-to-r from-[#FDFBF7] via-[#FDFBF7] to-[#C0A87D]/80 drop-shadow-[0_0_30px_rgba(253,251,247,0.15)]"
            >
              New Here ?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-paragraph text-[15px] md:text-lg text-[#FDFBF7]/90 max-w-3xl mx-auto drop-shadow-md leading-[2.4] tracking-[0.05em] font-light"
            >
              Discover our mission, vision, and the people who make our church a spiritual home
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-12 md:py-16 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <Heart className="w-16 h-16 text-[#FDFBF7]/90 mb-6 drop-shadow-md" />
            <h2 className="font-heading text-4xl text-[#FDFBF7] mb-6 drop-shadow-md">Our Mission</h2>
            <p className="font-paragraph text-[15px] md:text-[16px] text-[#FDFBF7]/90 leading-[1.8] mb-6 font-light drop-shadow-sm">
              The Motto of the Trust is "PROVE ALL THINGS; HOLD FAST THAT WHICH IS GOOD"
            </p>
            <p className="font-paragraph text-[15px] md:text-[16px] text-[#FDFBF7]/90 leading-[1.8] font-light drop-shadow-sm">
              As a church, the above is our mission that reflects our commitment to uphold biblical truth, to reject error, and to remain firmly grounded in the faith. It is a call to be watchful, discerning, and faithful—holding fast to the truth that leads to life everlasting..
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative py-12 md:py-16 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <Target className="w-16 h-16 text-[#FDFBF7]/90 mb-6 drop-shadow-md" />
            <h2 className="font-heading text-4xl text-[#FDFBF7] mb-6 drop-shadow-md">Our Vision</h2>
            <p className="font-paragraph text-[15px] md:text-[16px] text-[#FDFBF7]/90 leading-[1.8] mb-6 font-light drop-shadow-sm">
              To see lives transformed by the power of God's love, building a community of believers
              who are passionate about worship, committed to discipleship, and dedicated to making a
              difference in the world.
            </p>
            <p className="font-paragraph text-[15px] md:text-[16px] text-[#FDFBF7]/90 leading-[1.8] font-light drop-shadow-sm">
              We envision a church where every person feels valued, equipped, and empowered to fulfill
              their God-given calling, impacting generations for Christ.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Biblical Foundation */}
      <section className="relative py-24 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Book className="w-16 h-16 text-[#FDFBF7] mx-auto mb-8 drop-shadow-md" />
            <h2 className="font-heading text-4xl text-[#FDFBF7] mb-8 drop-shadow-md">Our Biblical Foundation</h2>
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-12 rounded-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
              <div className="absolute inset-0 rounded-[10px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] pointer-events-none" />
              <p className="font-paragraph text-xl text-[#FDFBF7]/90 leading-relaxed italic mb-6 relative z-10 drop-shadow-sm font-light">
                "But in the days of the voice of the seventh angel, when he shall begin to sound, the mystery of God should be finished, as he hath declared to his servants the prophets."
              </p>
              <p className="font-paragraph text-lg text-[#C0A87D] relative z-10 tracking-widest uppercase font-semibold">Revelation 10:7</p>
            </div>
            <p className="font-paragraph text-[15px] md:text-[16px] text-[#FDFBF7]/90 leading-[1.8] mt-8 font-light drop-shadow-sm">

            </p>
          </motion.div>
        </div>
      </section>


    </div>
  );
}
