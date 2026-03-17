/**
 * WatchLiveView.tsx
 * Exact visual replica of the original WatchLivePage.tsx.
 * Data passed as props from watch-live.astro — zero data fetching here.
 */
import { motion } from 'framer-motion';
import { Play, Calendar, Clock } from 'lucide-react';

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
            <Play className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
            <h1 className="font-heading text-5xl md:text-6xl text-primary-foreground mb-6">
              WATCH LIVE
            </h1>
            <p className="font-paragraph text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Join us for live worship every Sunday at 10:00 AM
            </p>
          </motion.div>
        </div>
      </section>

      {/* Live Stream Section */}
      <section className="py-24 px-6">
        <div className="max-w-[100rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="font-heading text-4xl text-primary mb-8 text-center">
              Live Stream
            </h2>
            <div className="max-w-5xl mx-auto">
              <div className="aspect-video bg-primary/5 mb-8">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/live_stream?channel=${channelId}`}
                  title="Live Stream"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="bg-primary/5 p-8 text-center">
                <div className="flex items-center justify-center gap-8 mb-4">
                  <div className="flex items-center text-foreground/70">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span className="font-paragraph text-base">Every Sunday</span>
                  </div>
                  <div className="flex items-center text-foreground/70">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="font-paragraph text-base">10:00 AM</span>
                  </div>
                </div>
                <p className="font-paragraph text-base text-foreground/60">
                  Can't make it in person? Join us online and be part of our worship community from anywhere.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Past Sermons */}
      <section className="py-24 px-6 bg-primary/5">
        <div className="max-w-[100rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl text-primary mb-6">
              Recent Sermons
            </h2>
            <p className="font-paragraph text-lg text-foreground/70 max-w-2xl mx-auto">
              Catch up on messages you may have missed
            </p>
          </motion.div>

          {recentSermons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentSermons.map((sermon, index) => (
                <motion.div
                  key={sermon._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-primary/10 relative group cursor-pointer">
                    {sermon.youtubeVideoId ? (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${sermon.youtubeVideoId}`}
                        title={sermon.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-12 h-12 text-primary/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl text-primary mb-2">{sermon.title}</h3>
                    {sermon.speaker && (
                      <p className="font-paragraph text-sm text-foreground/70 mb-1">{sermon.speaker}</p>
                    )}
                    {sermon.date && (
                      <p className="font-paragraph text-sm text-foreground/50">
                        {new Date(sermon.date).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Play className="w-16 h-16 mx-auto mb-4 text-primary/30" />
              <p className="font-paragraph text-lg text-foreground/60">No recent sermons available</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
