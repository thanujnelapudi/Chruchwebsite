import { motion } from 'framer-motion';
import { Clock, MapPin, Wifi, Calendar } from 'lucide-react';

interface Service {
  _id: string;
  serviceName?: string;
  dayOfWeek?: string;
  serviceTime?: string;
  description?: string;
  location?: string;
  isOnline?: boolean;
}

interface Props {
  services: Service[];
}

export default function ServiceScheduleView({ services }: Props) {
  return (
    <div className="min-h-screen bg-[#0A1428] text-[#FDFBF7] overflow-x-hidden relative font-paragraph selection:bg-[#C0A87D]/30 selection:text-[#FDFBF7]">

      {/* Full Page Cinematic Background */}
      <div className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-[#0A1428]" />
      <div
        className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-cover bg-[center_30%] opacity-100 saturate-[0.8] brightness-[0.85] transition-all duration-700"
        style={{ backgroundImage: `url('/images/Service-bg.jpg')` }}
      />
      {/* Blue Overlay */}
      <div className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-blue-900/40" />
      
      {/* Divine Light Rays */}
      <div className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 overflow-hidden pointer-events-none mix-blend-plus-lighter opacity-60">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[120%] bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-[120px]" />
        <div className="absolute top-[-20%] left-[15%] w-[15%] h-[130%] bg-gradient-to-b from-[#C0A87D]/15 via-[#C0A87D]/5 to-transparent rotate-[25deg] blur-2xl origin-top" />
        <div className="absolute top-[-10%] right-[10%] w-[25%] h-[120%] bg-gradient-to-b from-white/15 via-white/2 to-transparent rotate-[-20deg] blur-3xl origin-top" />
        <div className="absolute top-[-10%] left-[45%] w-[5%] h-[100%] bg-gradient-to-b from-white/20 to-transparent rotate-[5deg] blur-xl origin-top" />
      </div>

      <div className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-gradient-to-b from-[#0A1428]/5 via-[#0A1428]/60 to-[#0A1428]/90 pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0A1428_100%)] opacity-50 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-0 md:pt-40 md:pb-2 px-6 overflow-hidden flex flex-col justify-end z-10">
        <div className="max-w-[85rem] w-full mx-auto relative z-10 flex flex-col items-center mt-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="text-center w-full mb-6 text-[#FDFBF7]">
            <Calendar className="w-12 h-12 md:w-16 md:h-16 text-[#C0A87D] mx-auto mb-4 drop-shadow-sm opacity-90" strokeWidth={1} />
            <h1 className="font-heading text-5xl md:text-7xl mb-2 tracking-wide font-light text-transparent bg-clip-text bg-gradient-to-r from-[#FDFBF7] via-[#FDFBF7] to-[#C0A87D]/80 drop-shadow-[0_0_30px_rgba(253,251,247,0.15)]">
              Service Schedule
            </h1>
            <p className="font-paragraph text-[15px] md:text-lg text-[#FDFBF7]/70 max-w-2xl mx-auto leading-[2.4] tracking-[0.05em] font-light">
              Join us for worship, prayer, and fellowship throughout the week. Discover our weekly service timings and locations below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid (Soft Sacred Cards) */}
      <section className="relative z-20 px-6 pt-2 md:pt-8 pb-32">
        <div className="max-w-[90rem] mx-auto">
          <div className="min-h-[400px]">
            {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6 overflow-hidden pb-4 px-2 -mx-2">
                {services.map((service, index) => (
                  <div
                    key={service._id}
                    className="group bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.05] p-5 lg:p-6 hover:border-[#C0A87D]/40 transition-all duration-500 flex flex-col rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md relative min-h-[140px] overflow-hidden"
                  >
                    {/* Glowing Top Edge on Hover */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C0A87D]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="mb-3">
                          <h3 className="font-heading text-lg lg:text-xl text-[#FDFBF7] leading-[1.3] tracking-wide font-light group-hover:text-[#C0A87D] transition-colors duration-500">
                            {service.serviceName}
                          </h3>
                        </div>
                        <div className="flex flex-col gap-2.5 text-sm text-[#FDFBF7]/60 font-light tracking-wide mt-4 border-t border-white/[0.03] pt-4">
                          {service.dayOfWeek && (
                            <div className="flex items-center gap-3 group-hover:text-[#FDFBF7]/80 transition-colors duration-500">
                              <Clock className="w-[14px] h-[14px] text-[#C0A87D]/70 shrink-0" />
                              <span className="leading-snug">
                                {service.dayOfWeek}
                                {service.serviceTime && <span className="text-[#FDFBF7]/30 ml-1">at {service.serviceTime}</span>}
                              </span>
                            </div>
                          )}
                          {service.location && (
                            <div className="flex items-start gap-3 group-hover:text-[#FDFBF7]/80 transition-colors duration-500">
                              <MapPin className="w-[14px] h-[14px] text-[#C0A87D]/70 shrink-0 mt-0.5" />
                              <span className="leading-relaxed">
                                {service.location}
                              </span>
                            </div>
                          )}
                          {service.isOnline && (
                            <div className="flex items-center gap-3 group-hover:text-[#FDFBF7]/80 transition-colors duration-500">
                              <Wifi className="w-[14px] h-[14px] text-[#C0A87D]/70 shrink-0" />
                              <span className="leading-snug">
                                Available Online
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {service.description && (
                      <p className="font-paragraph text-[13px] text-[#FDFBF7]/40 mt-auto pt-4 border-t border-white/[0.03] leading-[1.8] font-light">
                        {service.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 flex flex-col items-center">
                <Clock className="w-12 h-12 mb-6 text-[#FDFBF7]/20" />
                <p className="font-paragraph text-xs tracking-widest text-[#FDFBF7]/40 uppercase">
                  Service schedule coming soon
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
