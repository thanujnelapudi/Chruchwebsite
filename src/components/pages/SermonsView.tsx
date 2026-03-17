/**
 * SermonsView.tsx
 * Based on the original ResourcesPage.tsx design, upgraded with:
 * - YouTube thumbnail previews
 * - Inline PDF viewer modal
 * - Fuse.js search (title, speaker, topic, tags)
 * - Series filter
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Download, Calendar, Search, X, Play, Tag, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Fuse from 'fuse.js';

interface Sermon {
  _id: string;
  title: string;
  speaker?: string;
  date?: string;
  topic?: string;
  tags?: string[];
  series?: string;
  seriesPart?: number;
  youtubeVideoId?: string;
  pdfUrl?: string;
  description?: string;
}

interface Props {
  sermons: Sermon[];
  topics: string[];
  allSeries: string[];
}

export default function SermonsView({ sermons, topics, allSeries }: Props) {
  const [query, setQuery]               = useState('');
  const [selectedTopic, setTopic]       = useState('');
  const [selectedSeries, setSeries]     = useState('');
  const [pdfUrl, setPdfUrl]             = useState<string | null>(null);
  const [pdfTitle, setPdfTitle]         = useState('');

  const fuse = useMemo(() => new Fuse(sermons, {
    keys: [
      { name: 'title',    weight: 3 },
      { name: 'speaker',  weight: 2 },
      { name: 'topic',    weight: 2 },
      { name: 'tags',     weight: 1.5 },
      { name: 'series',   weight: 1 },
      { name: 'description', weight: 1 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
  }), [sermons]);

  const filtered = useMemo(() => {
    let r = query.trim() ? fuse.search(query).map(x => x.item) : [...sermons];
    if (selectedTopic)  r = r.filter(s => s.topic === selectedTopic);
    if (selectedSeries) r = r.filter(s => s.series === selectedSeries);
    return r;
  }, [query, selectedTopic, selectedSeries, fuse, sermons]);

  const clearAll = () => { setQuery(''); setTopic(''); setSeries(''); };
  const hasFilters = query || selectedTopic || selectedSeries;

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="py-24 px-6 bg-primary">
        <div className="max-w-[100rem] mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <BookOpen className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
            <h1 className="font-heading text-5xl md:text-6xl text-primary-foreground mb-6">SERMONS</h1>
            <p className="font-paragraph text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Access sermon notes, watch messages, and deepen your faith
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="py-8 px-6 bg-primary/5 border-b border-primary/10 sticky top-20 z-30">
        <div className="max-w-[100rem] mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
            <input
              type="search" value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by title, speaker, topic, tags…"
              className="w-full pl-11 pr-10 py-3 border border-primary/20 bg-white font-paragraph text-sm focus:outline-none focus:border-primary"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {topics.length > 0 && (
            <select value={selectedTopic} onChange={e => setTopic(e.target.value)}
              className="px-4 py-3 border border-primary/20 bg-white font-paragraph text-sm focus:outline-none focus:border-primary min-w-[160px]">
              <option value="">All Topics</option>
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
          {allSeries.length > 0 && (
            <select value={selectedSeries} onChange={e => setSeries(e.target.value)}
              className="px-4 py-3 border border-primary/20 bg-white font-paragraph text-sm focus:outline-none focus:border-primary min-w-[160px]">
              <option value="">All Series</option>
              {allSeries.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
          {hasFilters && (
            <button onClick={clearAll} className="px-4 py-3 text-sm font-paragraph text-secondary hover:text-secondary/80 flex items-center gap-1.5 whitespace-nowrap">
              <X className="w-4 h-4" />Clear
            </button>
          )}
        </div>
        <p className="max-w-[100rem] mx-auto font-paragraph text-xs text-foreground/50 mt-2">
          {filtered.length} sermon{filtered.length !== 1 ? 's' : ''}{hasFilters ? ' matching filters' : ''}
        </p>
      </section>

      {/* Sermon Grid */}
      <section className="py-24 px-6">
        <div className="max-w-[100rem] mx-auto">
          <div className="min-h-[400px]">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((sermon, index) => (
                  <motion.div
                    key={sermon._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.4) }}
                    className="bg-white border border-primary/10 p-8 hover:border-primary/30 hover:shadow-lg transition-all flex flex-col"
                  >
                    {/* YouTube thumbnail */}
                    {sermon.youtubeVideoId && (
                      <div className="relative aspect-video bg-primary/5 mb-6 overflow-hidden group -mx-8 -mt-8 mb-6">
                        <img
                          src={`https://img.youtube.com/vi/${sermon.youtubeVideoId}/mqdefault.jpg`}
                          alt={sermon.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <a
                          href={`https://www.youtube.com/watch?v=${sermon.youtubeVideoId}`}
                          target="_blank" rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-secondary/80 transition-colors">
                            <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                          </div>
                        </a>
                        {sermon.series && (
                          <div className="absolute top-3 left-3 bg-primary/90 text-white font-paragraph text-xs px-2.5 py-1">
                            {sermon.series}{sermon.seriesPart ? ` · Part ${sermon.seriesPart}` : ''}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-heading text-xl text-primary mb-2">{sermon.title}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-foreground/60">
                          {sermon.speaker && <span className="font-paragraph">{sermon.speaker}</span>}
                          {sermon.topic && (
                            <span className="font-paragraph flex items-center gap-1">
                              <Tag className="w-3 h-3" />{sermon.topic}
                            </span>
                          )}
                        </div>
                      </div>
                      <BookOpen className="w-6 h-6 text-primary/30 flex-shrink-0 ml-2 mt-1" />
                    </div>

                    {sermon.description && (
                      <p className="font-paragraph text-sm text-foreground/70 mb-4 line-clamp-2">{sermon.description}</p>
                    )}

                    {sermon.date && (
                      <div className="flex items-center text-foreground/50 mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-paragraph text-xs">
                          {new Date(sermon.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                    )}

                    {sermon.tags && sermon.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {sermon.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="font-paragraph text-xs px-2 py-0.5 bg-primary/8 text-primary/80">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action buttons */}
                    {sermon.pdfUrl && (
                      <div className="flex gap-2 mt-auto pt-4 border-t border-primary/10">
                        <button
                          onClick={() => { setPdfUrl(sermon.pdfUrl!); setPdfTitle(sermon.title); }}
                          className="flex-1 flex items-center justify-center gap-2 border border-primary/30 text-primary hover:bg-primary hover:text-white font-paragraph text-sm py-2.5 px-4 transition-colors"
                        >
                          <BookOpen className="w-4 h-4" />View Notes
                        </button>
                        <a
                          href={sermon.pdfUrl} download target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center p-2.5 border border-primary/20 text-foreground/60 hover:text-primary hover:border-primary transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-primary/30" />
                <p className="font-paragraph text-lg text-foreground/60">
                  {hasFilters ? 'No sermons match your filters' : 'No sermons available at this time'}
                </p>
                {hasFilters && (
                  <button onClick={clearAll} className="mt-4 font-paragraph text-sm text-primary underline underline-offset-4">
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {pdfUrl && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setPdfUrl(null)}
          >
            <motion.div
              className="w-full max-w-5xl h-[90vh] bg-white flex flex-col shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10 flex-shrink-0">
                <div>
                  <p className="font-paragraph text-xs text-foreground/50 uppercase tracking-wide mb-0.5">Sermon Notes</p>
                  <h3 className="font-heading text-lg text-primary truncate">{pdfTitle}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <a href={pdfUrl} download target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-paragraph text-sm px-4 py-2 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                  <button onClick={() => setPdfUrl(null)}
                    className="p-2 text-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {/* iframe */}
              <div className="flex-1 overflow-hidden bg-gray-100">
                <iframe
                  src={`${pdfUrl}#toolbar=1&navpanes=0`}
                  className="w-full h-full border-0"
                  title={`${pdfTitle} — Sermon Notes`}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
