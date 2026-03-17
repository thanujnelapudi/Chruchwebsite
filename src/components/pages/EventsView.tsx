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
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-24 px-6 bg-primary">
        <div className="max-w-[100rem] mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Calendar className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
            <h1 className="font-heading text-5xl md:text-6xl text-primary-foreground mb-6">
              UPCOMING EVENTS
            </h1>
            <p className="font-paragraph text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Join us for special gatherings, fellowship opportunities, and community events
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-24 px-6">
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
                    <a href={`/events/${event._id}`}>
                      <div className="bg-white border border-primary/10 overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all h-full">
                        <div className="aspect-video bg-primary/10">
                          {event.imageUrl ? (
                            <img src={event.imageUrl} alt={event.title ?? 'Event'} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Calendar className="w-16 h-16 text-primary/15" />
                            </div>
                          )}
                        </div>
                        <div className="p-8">
                          <h3 className="font-heading text-2xl text-primary mb-4">{event.title}</h3>
                          <div className="space-y-3 mb-4">
                            {event.eventDate && (
                              <div className="flex items-center text-foreground/70">
                                <Calendar className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="font-paragraph text-base">
                                  {new Date(event.eventDate).toLocaleDateString('en-US', {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                  })}
                                </span>
                              </div>
                            )}
                            {event.eventTime && (
                              <div className="flex items-center text-foreground/70">
                                <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="font-paragraph text-base">{event.eventTime}</span>
                              </div>
                            )}
                          </div>
                          {event.description && (
                            <p className="font-paragraph text-base text-foreground/70 line-clamp-3">
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
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-primary/30" />
                <p className="font-paragraph text-lg text-foreground/60">No upcoming events at this time</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
