/**
 * SongsView.tsx
 * Exact visual replica of the original SongsPage.tsx.
 * Data passed as props — no data fetching here.
 * Includes full Fuse.js client-side search.
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Fuse from 'fuse.js';

interface Song {
  _id: string;
  songTitle?: string;
  title?: string;
  lyrics?: string;
  audioLink?: string;
  artist?: string;
  genre?: string;
  titleTelugu?: string;
}

interface Props {
  songs: Song[];
}

export default function SongsView({ songs }: Props) {
  const [expandedSong, setExpandedSong] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const fuse = useMemo(() => new Fuse(songs, {
    keys: [
      { name: 'songTitle', weight: 3 },
      { name: 'title', weight: 3 },
      { name: 'lyrics', weight: 1 },
      { name: 'artist', weight: 1.5 },
    ],
    threshold: 0.4,
    ignoreLocation: true,
  }), [songs]);

  const filtered = query.trim()
    ? fuse.search(query).map(r => r.item)
    : songs;

  const displayTitle = (s: Song) => s.songTitle ?? s.title ?? '';

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
            <Music className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
            <h1 className="font-heading text-5xl md:text-6xl text-primary-foreground mb-6">
              WORSHIP SONGS
            </h1>
            <p className="font-paragraph text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Sing along with the songs we worship with. Explore lyrics and listen to our worship collection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search bar */}
      <section className="py-8 px-6 bg-primary/5 border-b border-primary/10">
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search songs by title, lyrics, or artist…"
            className="w-full pl-11 pr-10 py-3 border border-primary/20 bg-white font-paragraph text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>

      {/* Songs List */}
      <section className="py-24 px-6">
        <div className="max-w-[100rem] mx-auto">
          <div className="min-h-[400px]">
            {filtered.length > 0 ? (
              <div className="space-y-6">
                {filtered.map((song, index) => (
                  <motion.div
                    key={song._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.3) }}
                    className="bg-white border border-primary/10 overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-heading text-2xl text-primary mb-2">
                            {displayTitle(song)}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                            {song.artist && (
                              <span className="font-paragraph">Artist: {song.artist}</span>
                            )}
                            {song.genre && (
                              <span className="font-paragraph">Genre: {song.genre}</span>
                            )}
                          </div>
                        </div>
                        <Music className="w-8 h-8 text-primary/30 flex-shrink-0 mt-1" />
                      </div>

                      {song.audioLink && (
                        <div className="mb-4">
                          <a
                            href={song.audioLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center font-paragraph text-sm text-primary hover:text-highlight-hover transition-colors"
                          >
                            <Volume2 className="w-4 h-4 mr-2" />
                            Listen to Audio
                          </a>
                        </div>
                      )}

                      {song.lyrics && (
                        <>
                          <Button
                            variant="ghost"
                            onClick={() => setExpandedSong(expandedSong === song._id ? null : song._id)}
                            className="text-primary hover:text-highlight-hover mb-4"
                          >
                            {expandedSong === song._id ? 'Hide Lyrics' : 'Show Lyrics'}
                          </Button>

                          <AnimatePresence>
                            {expandedSong === song._id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-primary/5 p-6 mt-4"
                              >
                                <pre
                                  className="font-paragraph text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed"
                                  style={/[\u0C00-\u0C7F]/.test(song.lyrics) ? {
                                    fontFamily: '"Noto Sans Telugu", "Open Sans", system-ui, sans-serif',
                                    lineHeight: 1.9,
                                  } : undefined}
                                >
                                  {song.lyrics}
                                </pre>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Music className="w-16 h-16 mx-auto mb-4 text-primary/30" />
                <p className="font-paragraph text-lg text-foreground/60">
                  {query ? 'No songs match your search' : 'No worship songs available at this time'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
