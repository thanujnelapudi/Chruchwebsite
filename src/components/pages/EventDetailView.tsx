import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Event {
  _id: string;
  title?: string;
  eventDate?: string;
  eventTime?: string;
  description?: string;
  imageUrl?: string | null;
}

interface Props {
  event: Event | null;
}

export default function EventDetailView({ event }: Props) {
  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto text-center py-16">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-primary/30" />
            <p className="font-paragraph text-lg text-foreground/60 mb-8">Event not found</p>
            <a href="/events">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />Back to Events
              </Button>
            </a>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <a href="/events" className="inline-flex items-center font-paragraph text-sm text-primary hover:text-highlight-hover transition-colors mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />Back to Events
            </a>

            {event.imageUrl && (
              <div className="aspect-video bg-primary/10 mb-8 overflow-hidden">
                <img src={event.imageUrl} alt={event.title ?? 'Event'} className="w-full h-full object-cover" />
              </div>
            )}

            <h1 className="font-heading text-4xl md:text-5xl text-primary mb-8">{event.title}</h1>

            <div className="bg-primary/5 p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.eventDate && (
                  <div className="flex items-center">
                    <Calendar className="w-6 h-6 mr-4 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-paragraph text-sm text-foreground/60 mb-1">Date</p>
                      <p className="font-paragraph text-base text-foreground">
                        {new Date(event.eventDate).toLocaleDateString('en-US', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {event.eventTime && (
                  <div className="flex items-center">
                    <Clock className="w-6 h-6 mr-4 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-paragraph text-sm text-foreground/60 mb-1">Time</p>
                      <p className="font-paragraph text-base text-foreground">{event.eventTime}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {event.description && (
              <p className="font-paragraph text-lg text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
