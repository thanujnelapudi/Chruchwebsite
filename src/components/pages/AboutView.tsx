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
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative py-24 px-6 bg-primary">
        <div className="max-w-[100rem] mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-5xl md:text-6xl text-primary-foreground mb-6"
          >
            ABOUT US
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-paragraph text-xl text-primary-foreground/90 max-w-3xl mx-auto"
          >
            Discover our mission, vision, and the people who make our church a spiritual home
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6">
        <div className="max-w-[100rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Heart className="w-16 h-16 text-primary mb-6" />
              <h2 className="font-heading text-4xl text-primary mb-6">Our Mission</h2>
              <p className="font-paragraph text-lg text-foreground/80 leading-relaxed mb-6">
                To be a beacon of faith, hope, and love in our community. We are committed to spreading
                the Gospel of Jesus Christ, nurturing spiritual growth, and serving those in need with
                compassion and dedication.
              </p>
              <p className="font-paragraph text-lg text-foreground/80 leading-relaxed">
                Through worship, fellowship, and outreach, we strive to create a welcoming environment
                where everyone can encounter God's transforming presence and discover their purpose in His kingdom.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="aspect-[4/3] bg-primary/10 overflow-hidden"
            >
              <img
                src={missionImage}
                alt="Church mission"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 px-6 bg-primary/5">
        <div className="max-w-[100rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="aspect-[4/3] bg-primary/10 order-2 lg:order-1 overflow-hidden"
            >
              <img
                src={visionImage}
                alt="Church vision"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <Target className="w-16 h-16 text-primary mb-6" />
              <h2 className="font-heading text-4xl text-primary mb-6">Our Vision</h2>
              <p className="font-paragraph text-lg text-foreground/80 leading-relaxed mb-6">
                To see lives transformed by the power of God's love, building a community of believers
                who are passionate about worship, committed to discipleship, and dedicated to making a
                difference in the world.
              </p>
              <p className="font-paragraph text-lg text-foreground/80 leading-relaxed">
                We envision a church where every person feels valued, equipped, and empowered to fulfill
                their God-given calling, impacting generations for Christ.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Biblical Foundation */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Book className="w-16 h-16 text-primary mx-auto mb-8" />
            <h2 className="font-heading text-4xl text-primary mb-8">Our Biblical Foundation</h2>
            <div className="bg-primary/5 p-12">
              <p className="font-paragraph text-xl text-foreground/80 leading-relaxed italic mb-6">
                "The Lord went before them by day in a pillar of cloud to lead them along the way,
                and by night in a pillar of fire to give them light, that they might travel by day and by night."
              </p>
              <p className="font-paragraph text-lg text-primary">Exodus 13:21</p>
            </div>
            <p className="font-paragraph text-lg text-foreground/80 leading-relaxed mt-8">
              Just as God led the Israelites with a pillar of cloud and fire, we believe He continues to
              guide His people today. Our church is founded on the unchanging truth of God's Word and the
              transforming power of His presence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-24 px-6 bg-primary/5">
        <div className="max-w-[100rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Users className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="font-heading text-4xl md:text-5xl text-primary mb-6">Our Leadership Team</h2>
            <p className="font-paragraph text-lg text-foreground/70 max-w-2xl mx-auto">
              Meet the dedicated leaders who shepherd and serve our congregation
            </p>
          </motion.div>

          <div className="min-h-[400px]">
            {leaders.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-16 h-16 mx-auto mb-4 text-primary/30" />
                <p className="font-paragraph text-lg text-foreground/60">Leadership information coming soon</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {leaders.map((leader, index) => (
                  <motion.div
                    key={leader._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white p-8 text-center"
                  >
                    <div className="w-32 h-32 mx-auto mb-6 bg-primary/10 rounded-full overflow-hidden">
                      {leader.profilePhotoUrl ? (
                        <img
                          src={leader.profilePhotoUrl}
                          alt={leader.name ?? 'Leader'}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-heading text-4xl text-primary/30">
                            {(leader.name ?? '?')[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-heading text-2xl text-primary mb-2">{leader.name}</h3>
                    <p className="font-paragraph text-base text-foreground/70 mb-4">{leader.role}</p>
                    {leader.biography && (
                      <p className="font-paragraph text-sm text-foreground/60 leading-relaxed mb-4">
                        {leader.biography}
                      </p>
                    )}
                    {leader.email && (
                      <a
                        href={`mailto:${leader.email}`}
                        className="font-paragraph text-sm text-primary hover:text-highlight-hover transition-colors"
                      >
                        {leader.email}
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
