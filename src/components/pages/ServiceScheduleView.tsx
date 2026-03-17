import { motion } from 'framer-motion';
import { Clock, MapPin, Wifi } from 'lucide-react';

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
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-24 px-6 bg-primary">
        <div className="max-w-[100rem] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Clock className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
            <h1 className="font-heading text-5xl md:text-6xl text-primary-foreground mb-6">
              SERVICE SCHEDULE
            </h1>
            <p className="font-paragraph text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Join us for worship, prayer, and fellowship throughout the week
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-24 px-6">
        <div className="max-w-[100rem] mx-auto">
          <div className="min-h-[400px]">
            {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <motion.div
                    key={service._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white border border-primary/10 p-8 hover:border-primary/30 transition-colors"
                  >
                    <h3 className="font-heading text-2xl text-primary mb-6">
                      {service.serviceName}
                    </h3>
                    <div className="space-y-4">
                      {service.dayOfWeek && (
                        <div className="flex items-start">
                          <Clock className="w-5 h-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                          <p className="font-paragraph text-base text-foreground">
                            {service.dayOfWeek}
                            {service.serviceTime && ` at ${service.serviceTime}`}
                          </p>
                        </div>
                      )}
                      {service.location && (
                        <div className="flex items-start">
                          <MapPin className="w-5 h-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                          <p className="font-paragraph text-base text-foreground">
                            {service.location}
                          </p>
                        </div>
                      )}
                      {service.isOnline && (
                        <div className="flex items-start">
                          <Wifi className="w-5 h-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                          <p className="font-paragraph text-base text-foreground">
                            Available Online
                          </p>
                        </div>
                      )}
                      {service.description && (
                        <p className="font-paragraph text-sm text-foreground/70 leading-relaxed mt-4 pt-4 border-t border-primary/10">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Clock className="w-16 h-16 mx-auto mb-4 text-primary/30" />
                <p className="font-paragraph text-lg text-foreground/60">Service schedule coming soon</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
