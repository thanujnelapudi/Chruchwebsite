import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

interface Event {
  _id: string;
  title?: string;
  eventDate?: string;
  eventTime?: string;
  description?: string;
  imageUrl?: string | null;
}

interface Props {
  events: Event[];
}

export default function EventsView({ events }: Props) {
  return (
    <div className="min-h-screen relative bg-[#0A1428] text-[#FDFBF7] overflow-x-hidden font-paragraph selection:bg-[#C0A87D]/30 selection:text-[#FDFBF7]">

      {/* Full Page Cinematic Background */}
      <div className="fixed top-0 left-0 w-full h-[110vh] -top-[5vh] z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full"
          style={{ backgroundImage: "url('/images/event-bg.png')" }}
        />
        {/* Smooth gradient over the whole layout to slowly darken the image, creating a seamlessly larger overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1428]/20 via-[#0A1428]/60 to-[#0A1428]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-16 md:pt-40 md:pb-24 px-6">
        <div className="max-w-[100rem] mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Calendar className="w-16 h-16 text-[#C0A87D] mx-auto mb-6 opacity-90" />
            <h1 className="font-heading text-5xl md:text-6xl text-[#FDFBF7] mb-6 tracking-wide drop-shadow-md">
              UPCOMING EVENTS
            </h1>
            <p className="font-paragraph text-xl text-[#FDFBF7]/80 max-w-3xl mx-auto font-light leading-relaxed">
              Join us for special gatherings, fellowship opportunities, and community events
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events List */}
      <section className="relative z-10 pb-32 px-6">
        <div className="max-w-[100rem] mx-auto">
          <div className="min-h-[400px]">
            {events.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <a href={`/events/${event._id}`} className="block h-full cursor-pointer group">
                      <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden hover:border-[#C0A87D]/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-500 h-full flex flex-col group-hover:-translate-y-1">
                        
                        {/* Image Section with Overlay Title */}
                        <div className="aspect-video bg-white/[0.02] relative overflow-hidden">
                          {event.imageUrl ? (
                            <img src={event.imageUrl} alt={event.title ?? 'Event'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Calendar className="w-16 h-16 text-white/10" />
                            </div>
                          )}
                          
                          {/* Dark overlay gradient to ensure title text stands out */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1428] via-[#0A1428]/60 to-transparent opacity-90" />
                          
                          {/* Title Overlay Layer */}
                          <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
                            <h3 className="font-heading text-3xl md:text-4xl text-[#FDFBF7] group-hover:text-[#C0A87D] transition-colors drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-wide leading-tight">
                              {event.title}
                            </h3>
                          </div>
                        </div>
                        
                        {/* Details Section */}
                        <div className="p-6 md:p-8 pt-6 flex-1 flex flex-col">
                          <div className="space-y-4 mb-6">
                            {event.eventDate && (
                              <div className="flex items-center text-[#FDFBF7]/70">
                                <Calendar className="w-5 h-5 mr-3 flex-shrink-0 text-[#C0A87D]" />
                                <span className="font-paragraph text-base">
                                  {new Date(event.eventDate).toLocaleDateString('en-US', {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                  })}
                                </span>
                              </div>
                            )}
                            {event.eventTime && (
                              <div className="flex items-center text-[#FDFBF7]/70">
                                <Clock className="w-5 h-5 mr-3 flex-shrink-0 text-[#C0A87D]" />
                                <span className="font-paragraph text-base">{event.eventTime}</span>
                              </div>
                            )}
                          </div>
                          {event.description && (
                            <p className="font-paragraph text-base text-[#FDFBF7]/60 line-clamp-3 font-light leading-relaxed mt-auto">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-sm">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-[#C0A87D]/50" />
                <p className="font-paragraph text-lg text-[#FDFBF7]/60 tracking-wide font-light">No upcoming events at this time</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
