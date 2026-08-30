/**
 * SermonsView.tsx
 * Based on the original ResourcesPage.tsx design, upgraded with:
 * - YouTube thumbnail previews
 * - Inline PDF viewer modal
 * - Fuse.js search (title, speaker, topic, tags)
 * - Series filter
 */
import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Download, Calendar, Search, X, Play, Tag, Filter, User, ChevronDown, FileText, Image as ImageIcon, File as FileIcon, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Fuse from 'fuse.js';

interface Sermon {
  _id: string;
  title: string;
  speaker?: string;
  date?: string;
  category?: string;
  tags?: string[];
  series?: string;
  seriesPart?: number;
  youtubeVideoId?: string;
  pdfUrl?: string;
  description?: string;
}

interface SourceItem {
  _id: string;
  title: string;
  fileType: 'pdf' | 'image' | 'docx' | 'other';
  fileUrl: string;
  caption?: string;
  relatedSermon?: { _id: string; title: string } | null;
}

interface Props {
  sermons: Sermon[];
  allSeries: string[];
  sources?: SourceItem[];
}

const SOURCE_ICONS: Record<SourceItem['fileType'], typeof FileText> = {
  pdf: FileText,
  image: ImageIcon,
  docx: FileIcon,
  other: FileIcon,
};

const getYouTubeId = (url: string) => {
  if (!url) return '';
  if (url.length === 11 && !url.includes('/')) return url;
  const match = url.match(/(?:youtu\.be\/|v\/|u\/\w\/|embed\/|live\/|watch\?v=|&v=)([^#&?]*)/);
  return (match && match[1].length === 11) ? match[1] : url;
};

export default function SermonsView({ sermons, allSeries, sources = [] }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('');
  const [selectedSeries, setSeries] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfTitle, setPdfTitle] = useState('');
  const [seriesOpen, setSeriesOpen] = useState(false);

  // Notes-button popover: which sermon's "Notes" dropdown is currently open
  const [notesMenuFor, setNotesMenuFor] = useState<string | null>(null);
  // Sources panel: the sermon whose supporting sources are being browsed
  const [sourcesPanelSermon, setSourcesPanelSermon] = useState<Sermon | null>(null);
  // A single source item opened for viewing (pdf/docx/other → iframe, image → lightbox)
  const [sourceFile, setSourceFile] = useState<{ url: string; title: string; fileType: SourceItem['fileType'] } | null>(null);

  const sourcesBySermon = useMemo(() => {
    const map: Record<string, SourceItem[]> = {};
    for (const s of sources) {
      if (s.relatedSermon?._id) {
        (map[s.relatedSermon._id] ??= []).push(s);
      }
    }
    return map;
  }, [sources]);

  const fuse = useMemo(() => new Fuse(sermons, {
    keys: [
      { name: 'title', weight: 3 },
      { name: 'speaker', weight: 2 },
      { name: 'tags', weight: 1.5 },
      { name: 'series', weight: 1 },
      { name: 'description', weight: 1 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
  }), [sermons]);

  const filtered = useMemo(() => {
    let r = query.trim() ? fuse.search(query).map(x => x.item) : [...sermons];
    if (category) r = r.filter(s => s.category === category);
    if (selectedSeries) r = r.filter(s => s.series === selectedSeries);
    return r;
  }, [query, category, selectedSeries, fuse, sermons]);

  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
        setSeriesOpen(false);
      }
    };
    if (seriesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [seriesOpen]);

  // Close the Notes popover on Escape or outside click
  useEffect(() => {
    if (!notesMenuFor) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setNotesMenuFor(null); };
    const onClick = () => setNotesMenuFor(null);
    document.addEventListener('keydown', onKey);
    // Use a small timeout so the click that opened it doesn't instantly close it
    setTimeout(() => document.addEventListener('click', onClick), 0);
    
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [notesMenuFor]);

  const clearAll = () => { setQuery(''); setSeries(''); };
  const hasFilters = query || selectedSeries;

  // Notes / Sources split button — shared between the featured card and grid cards.
  const renderNotesButton = (sermon: Sermon, variant: 'featured' | 'card') => {
    const linkedSources = sourcesBySermon[sermon._id] ?? [];
    if (!sermon.pdfUrl && linkedSources.length === 0) return null;

    const isFeatured = variant === 'featured';
    const btnClass = isFeatured
      ? 'border border-[#C0A87D]/40 text-[#C0A87D] hover:bg-[#C0A87D]/10 font-paragraph text-[11px] uppercase tracking-wider font-semibold px-4 py-2 rounded transition-colors flex items-center gap-2'
      : 'flex-1 flex items-center justify-center gap-2 bg-transparent text-[#C0A87D] border border-[#C0A87D]/40 hover:bg-[#C0A87D]/10 font-paragraph text-[11px] uppercase tracking-wider font-semibold py-2.5 px-3 rounded-[4px] transition-colors';
    const iconClass = isFeatured ? 'w-[10px] h-[10px]' : 'w-3 h-3';

    // Only one thing to open (either just notes, or just sources) → skip the popover, act directly.
    const onlyNotes = !!sermon.pdfUrl && linkedSources.length === 0;
    const onlySources = !sermon.pdfUrl && linkedSources.length > 0;

    if (onlyNotes) {
      return (
        <button
          onClick={(e) => { e.stopPropagation(); setPdfUrl(sermon.pdfUrl!); setPdfTitle(sermon.title); }}
          className={btnClass}
        >
          <BookOpen className={iconClass} /> Notes
        </button>
      );
    }
    if (onlySources) {
      return (
        <button
          onClick={(e) => { e.stopPropagation(); setSourcesPanelSermon(sermon); }}
          className={btnClass}
        >
          <ImageIcon className={iconClass} /> Sources
        </button>
      );
    }

    return (
      <div className="relative z-50" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setNotesMenuFor(notesMenuFor === sermon._id ? null : sermon._id)}
          className={btnClass}
        >
          <BookOpen className={iconClass} /> Notes <ChevronDown className={`${iconClass} transition-transform ${notesMenuFor === sermon._id ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {notesMenuFor === sermon._id && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 left-0 w-56 bg-[#0A1428] border border-[#C0A87D]/25 rounded-lg shadow-[0_15px_40px_rgba(0,0,0,0.6)] overflow-hidden py-1.5 z-50"
            >
              <button
                onClick={() => { setPdfUrl(sermon.pdfUrl!); setPdfTitle(sermon.title); setNotesMenuFor(null); }}
                className="w-full text-left px-4 py-2.5 text-xs font-paragraph text-[#FDFBF7]/80 hover:text-[#FDFBF7] hover:bg-white/5 flex items-center gap-2.5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#C0A87D]" /> Sermon Notes (PDF)
              </button>
              <button
                onClick={() => { setSourcesPanelSermon(sermon); setNotesMenuFor(null); }}
                className="w-full text-left px-4 py-2.5 text-xs font-paragraph text-[#FDFBF7]/80 hover:text-[#FDFBF7] hover:bg-white/5 flex items-center gap-2.5 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#C0A87D]" /> Supporting Sources ({linkedSources.length})
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A1428] text-[#FDFBF7] overflow-x-hidden relative font-paragraph selection:bg-[#C0A87D]/30 selection:text-[#FDFBF7]">

      {/* Full Page Cinematic Background (oversized to fix mobile viewport jump) */}
      <div className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-[#0A1428]" />
      <div
        className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-cover bg-[center_30%] opacity-100 saturate-[0.8] brightness-[0.85] transition-all duration-700"
        style={{ backgroundImage: `url('/images/sermons-bg.jpg')` }}
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

      {/* Removed the fixed z-40 backdrop that was covering the dropdowns and intercepting clicks */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-0 md:pt-40 md:pb-2 px-6 flex flex-col justify-end z-10">

        <div className="max-w-[85rem] w-full mx-auto relative z-10 flex flex-col items-center">

          {/* Text is back to original huge size, but the margins between them are crushed */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="text-center w-full mb-6 text-[#FDFBF7]">
            <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-[#C0A87D] mx-auto mb-4 drop-shadow-sm opacity-90" strokeWidth={1} />
            <h1 className="font-heading text-5xl md:text-7xl mb-2 tracking-[0.03em] font-normal opacity-95 text-[#FDFBF7]">
              S E R M O N S
            </h1>
            <p className="font-paragraph text-sm md:text-base text-[#FDFBF7]/70 max-w-2xl mx-auto font-light leading-[1.8] tracking-widest uppercase">
              Access sermon notes, watch messages, and deepen your faith.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="flex items-center justify-center p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-8 z-50 w-auto flex-wrap mx-auto shadow-xl"
          >
            {['All', 'Sunday Sermons', 'Wednesday Sermons', 'Youth Meeting'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat === 'All' ? '' : cat)}
                className={`flex items-center justify-center py-2 md:py-2.5 px-4 md:px-6 rounded-full text-[11px] md:text-[13px] uppercase tracking-widest font-medium transition-all border whitespace-nowrap ${(category === cat) || (cat === 'All' && category === '')
                    ? 'bg-[#C0A87D]/15 text-[#C0A87D] border-[#C0A87D]/30 shadow-sm'
                    : 'border-transparent text-[#FDFBF7]/50 hover:text-[#FDFBF7]/80 hover:bg-white/5'
                  }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Soft Sacred Pill Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="w-full max-w-3xl mx-auto sticky top-24 z-50 mb-6"
          >
            <div
              ref={pillRef}
              className="relative rounded-[2rem] md:rounded-full bg-white/[0.04] backdrop-blur-md border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-row items-center transition-all duration-500 hover:bg-white/[0.06] hover:border-white/[0.1] px-1 md:px-2 py-1 md:py-1.5 h-12 md:h-14"
            >

              <div className="relative flex-1 group h-full flex items-center min-w-[100px]">
                <Search className="absolute left-3 md:left-4 w-4 h-4 text-[#FDFBF7]/40 group-focus-within:text-[#C0A87D] transition-colors pointer-events-none" />
                <input
                  type="text" value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search messages..."
                  className="w-full h-full pl-9 md:pl-11 pr-3 md:pr-4 bg-transparent font-paragraph text-[#FDFBF7] text-xs md:text-sm placeholder-[#FDFBF7]/40 focus:outline-none focus:ring-0 truncate [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                />
              </div>

              {allSeries.length > 0 && (
                <div className="w-px h-6 bg-white/10 mx-1 md:mx-2 shrink-0" />
              )}

              <div className="flex items-center justify-center gap-0.5 md:gap-2 shrink-0 px-1 md:px-0">
                {allSeries.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => { setSeriesOpen(!seriesOpen); }}
                      className="group w-8 h-8 md:w-[38px] md:h-[38px] flex items-center justify-center rounded-full hover:bg-white/5 transition-colors focus:outline-none"
                      title="Filter by Series"
                    >
                      <Filter className={`w-4 h-4 md:w-[18px] md:h-[18px] transition-colors ${selectedSeries ? 'text-[#C0A87D]' : 'text-[#FDFBF7]/30 group-hover:text-[#FDFBF7]/60'}`} />
                    </button>
                    <AnimatePresence>
                      {seriesOpen && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 mt-3 w-64 bg-[#0A1428]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] z-50 overflow-hidden py-2 px-1"
                          >
                            <button
                              onClick={() => { setSeries(''); setSeriesOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 text-sm font-paragraph rounded-md transition-colors ${selectedSeries === '' ? 'text-[#C0A87D] bg-white/5' : 'text-[#FDFBF7]/70 hover:text-[#FDFBF7] hover:bg-white/5'}`}
                            >
                              All Series
                            </button>
                            <div className="w-full h-px bg-white/5 my-1" />
                            <div className="max-h-60 overflow-y-auto">
                              {allSeries.map(s => (
                                <button
                                  key={s}
                                  onClick={() => { setSeries(s); setSeriesOpen(false); }}
                                  className={`w-full text-left px-4 py-2 text-sm font-paragraph rounded-md transition-colors ${selectedSeries === s ? 'text-[#C0A87D] bg-white/5' : 'text-[#FDFBF7]/70 hover:text-[#FDFBF7] hover:bg-white/5'}`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {hasFilters && (
                <button onClick={clearAll} className="ml-0.5 md:ml-2 px-2.5 md:px-4 h-8 md:h-full rounded-full bg-[#C0A87D]/10 hover:bg-[#C0A87D]/20 border border-[#C0A87D]/20 text-[10px] md:text-xs font-paragraph text-[#C0A87D] flex items-center justify-center transition-all whitespace-nowrap shrink-0">
                  <X className="w-3.5 h-3.5 mr-1 hidden md:block" /> Clear
                </button>
              )}
            </div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center font-paragraph text-[11px] text-[#FDFBF7]/30 mt-6 tracking-widest uppercase">
              {filtered.length} message{filtered.length !== 1 ? 's' : ''}{hasFilters ? ' matching your search' : ' available'}
            </motion.p>
          </motion.div>

        </div>
      </section>

      {/* Sermon Content Section */}
      <section className="relative z-20 px-6 pt-4 md:pt-6 pb-32">
        <div className="max-w-[100rem] mx-auto">
          <div className="min-h-[400px]">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
                {/* UX Fix 2: Featured Sermon Layout (Visual Hierarchy) */}
                {!hasFilters && filtered.length > 0 && (
                  <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 group bg-white/[0.03] border border-white/[0.06] hover:border-[#C0A87D]/30 transition-all duration-500 p-6 lg:p-8 rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-sm relative flex flex-col items-start gap-4">
                    {/* Premium Top Glow */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C0A87D]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#C0A87D]/10 text-[#C0A87D] text-[10px] font-medium tracking-widest uppercase mb-1 pointer-events-none">
                      <BookOpen className="w-3 h-3" />
                      Latest Message
                    </div>

                    <h3 className="font-heading text-2xl lg:text-[28px] text-[#FDFBF7] leading-[1.3] tracking-wide font-light group-hover:text-[#C0A87D] transition-colors duration-500">
                      {filtered[0].title}
                    </h3>
                    {filtered[0].series && (
                      <p className="text-[#C0A87D] font-paragraph text-xs mt-1 uppercase tracking-widest">
                        {filtered[0].series}{filtered[0].seriesPart ? ` - Part ${filtered[0].seriesPart}` : ''}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-[#FDFBF7]/80 font-light tracking-wide mb-1 text-[13px]">
                      {filtered[0].category && (
                        <span className="text-[#C0A87D] uppercase tracking-widest text-[10px] font-semibold border border-[#C0A87D]/30 bg-[#C0A87D]/5 px-2.5 py-1 rounded-sm">
                          {filtered[0].category}
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-[#C0A87D]/70" />
                        <span>{filtered[0].speaker || 'Pastor'}</span>
                      </div>

                      {filtered[0].date && (
                        <div className="flex items-center gap-2 text-[#FDFBF7] font-semibold">
                          <Calendar className="w-4 h-4 text-[#C0A87D]" />
                          <span className="text-sm tracking-wide">{new Date(filtered[0].date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      )}
                    </div>

                    {filtered[0].description && (
                      <p className="font-paragraph text-[#FDFBF7]/70 text-[13.5px] leading-[1.7] mb-4 line-clamp-2 max-w-2xl font-light">
                        {filtered[0].description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-auto border-t border-white/[0.04] pt-4 w-full">
                      {filtered[0].youtubeVideoId && (
                        <a
                          href={`https://www.youtube.com/watch?v=${getYouTubeId(filtered[0].youtubeVideoId)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="bg-[#C0A87D] text-[#0A1428] hover:bg-white font-paragraph text-[11px] uppercase tracking-wider font-semibold px-4 py-2 rounded transition-colors flex items-center gap-2"
                        >
                          <Play className="w-[10px] h-[10px] fill-current" /> Watch
                        </a>
                      )}
                      {renderNotesButton(filtered[0], 'featured')}
                    </div>
                  </div>
                )}
                {(hasFilters ? filtered : filtered.slice(1)).map((sermon) => (
                  <div
                    key={sermon._id}
                    className="group bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.05] p-6 lg:p-8 hover:border-[#C0A87D]/30 transition-all flex flex-col rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-sm relative min-h-[220px]"
                  >
                    {/* Subtle hover edge */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C0A87D]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex items-start justify-between mb-5">
                      <div className="flex-1">
                        {sermon.category && (
                          <span className="inline-block text-[#C0A87D] uppercase tracking-widest text-[9px] font-semibold border border-[#C0A87D]/30 bg-[#C0A87D]/5 px-2 py-1 rounded-sm mb-3">
                            {sermon.category}
                          </span>
                        )}
                        <h3 className="font-heading text-lg lg:text-[22px] text-[#FDFBF7] mb-3 leading-[1.3] tracking-wide font-normal group-hover:text-[#C0A87D] transition-colors">{sermon.title}</h3>
                        {sermon.series && (
                          <p className="text-[#C0A87D] font-paragraph text-xs mt-1 uppercase tracking-widest mb-3">
                            {sermon.series}{sermon.seriesPart ? ` - Part ${sermon.seriesPart}` : ''}
                          </p>
                        )}

                        {/* 90% White Readability Fix */}
                        <div className="flex flex-col gap-1.5 text-xs text-[#FDFBF7]/90 font-light tracking-wide border-t border-white/[0.04] pt-4 mt-2">
                          {sermon.speaker && <span className="uppercase tracking-widest text-[#FDFBF7]/80 flex items-center gap-2"><User className="w-[12px] h-[12px] text-[#C0A87D]/70" /> {sermon.speaker}</span>}
                        </div>
                      </div>
                    </div>

                    {sermon.description && (
                      <p className="font-paragraph text-[14px] text-[#FDFBF7]/80 mb-6 line-clamp-2 leading-[1.8] font-light">
                        {sermon.description}
                      </p>
                    )}

                    {sermon.date && (
                      <div className="flex items-center text-[#FDFBF7] mb-5 border-t border-white/[0.04] pt-4 mt-auto font-semibold">
                        <Calendar className="w-3.5 h-3.5 mr-2 text-[#C0A87D]" />
                        <span className="font-paragraph text-xs md:text-[13px] tracking-wide">
                          {new Date(sermon.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                    )}

                    {sermon.tags && sermon.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {sermon.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="font-paragraph text-[10px] uppercase tracking-widest px-2.5 py-0.5 bg-black/40 text-[#FDFBF7]/70 rounded-[3px] border border-white/[0.06]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action buttons - Solid High Contrast Design System */}
                    <div className="flex gap-3 mt-auto pt-4 border-t border-white/[0.04]">
                      {sermon.youtubeVideoId && (
                        <a
                          href={`https://www.youtube.com/watch?v=${getYouTubeId(sermon.youtubeVideoId)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 bg-[#C0A87D] text-[#0A1428] hover:bg-white font-paragraph text-[11px] uppercase tracking-wider font-semibold py-2.5 px-3 rounded-[4px] transition-colors shadow-sm"
                        >
                          <Play className="w-3 h-3 fill-current" /> Watch
                        </a>
                      )}
                      {renderNotesButton(sermon, 'card')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <BookOpen className="w-16 h-16 mx-auto mb-6 text-[#FDFBF7]/10" strokeWidth={1} />
                <p className="font-paragraph text-lg text-[#FDFBF7]/40 font-light tracking-wide">
                  {hasFilters ? 'No sermons match your current filters' : 'No sermons available at this time'}
                </p>
                {hasFilters && (
                  <button onClick={clearAll} className="mt-8 font-paragraph text-sm text-[#C0A87D] hover:text-[#C0A87D] uppercase tracking-widest transition-colors pb-1 border-b border-[#C0A87D]/30">
                    Clear all filters
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
            className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
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
                  <button onClick={() => setPdfUrl(null)}
                    className="p-2 text-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {/* iframe with #toolbar=0 to disable native browser download/print buttons */}
              <div className="flex-1 overflow-hidden bg-gray-100">
                <iframe src={`${pdfUrl}#toolbar=0`} className="w-full h-full border-0" title={pdfTitle} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sources Panel — supporting sources for one sermon, shown in-place (no page navigation) */}
      <AnimatePresence>
        {sourcesPanelSermon && (
          <motion.div
            className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSourcesPanelSermon(null)}
          >
            <motion.div
              className="w-full max-w-2xl max-h-[85vh] bg-[#0A1428] border border-[#C0A87D]/25 flex flex-col shadow-2xl rounded-lg overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
                <div>
                  <p className="font-paragraph text-xs text-[#FDFBF7]/50 uppercase tracking-wide mb-0.5">Supporting Sources</p>
                  <h3 className="font-heading text-lg text-[#FDFBF7] truncate">{sourcesPanelSermon.title}</h3>
                </div>
                <button onClick={() => setSourcesPanelSermon(null)}
                  className="p-2 text-[#FDFBF7]/60 hover:text-[#FDFBF7] hover:bg-white/5 transition-colors rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                {(sourcesBySermon[sourcesPanelSermon._id] ?? []).map((s) => {
                  const Icon = SOURCE_ICONS[s.fileType] ?? FileIcon;
                  return (
                    <button
                      key={s._id}
                      onClick={() => { setSourceFile({ url: s.fileUrl, title: s.title, fileType: s.fileType }); setSourcesPanelSermon(null); }}
                      className="flex items-start gap-3 p-3 text-left bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-[#C0A87D]/30 rounded-lg transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#C0A87D]/15 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[#C0A87D]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-paragraph text-sm text-[#FDFBF7]">{s.title}</p>
                        {s.caption && <p className="font-paragraph text-xs text-[#FDFBF7]/50 mt-0.5 line-clamp-2">{s.caption}</p>}
                      </div>
                      <ExternalLink className="w-4 h-4 text-[#FDFBF7]/30 ml-auto flex-shrink-0 mt-1" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Individual source file viewer — PDF/docx/other → iframe, image → lightbox */}
      <AnimatePresence>
        {sourceFile && sourceFile.fileType === 'image' && (
          <motion.div
            className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSourceFile(null)}
          >
            <button onClick={() => setSourceFile(null)} className="absolute top-6 right-6 text-white/80 hover:text-white">
              <X className="w-7 h-7" />
            </button>
            <motion.img
              initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              src={sourceFile.url} alt={sourceFile.title}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[85vh] object-contain rounded"
            />
          </motion.div>
        )}
        {sourceFile && sourceFile.fileType !== 'image' && (
          <motion.div
            className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSourceFile(null)}
          >
            <motion.div
              className="w-full max-w-5xl h-[90vh] bg-white flex flex-col shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10 flex-shrink-0">
                <div>
                  <p className="font-paragraph text-xs text-foreground/50 uppercase tracking-wide mb-0.5">Supporting Source</p>
                  <h3 className="font-heading text-lg text-primary truncate">{sourceFile.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <a href={sourceFile.url} download target="_blank" rel="noopener noreferrer"
                    className="p-2 text-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors">
                    <Download className="w-5 h-5" />
                  </a>
                  <button onClick={() => setSourceFile(null)}
                    className="p-2 text-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden bg-gray-100">
                <iframe src={`${sourceFile.url}#toolbar=0`} className="w-full h-full border-0" title={sourceFile.title} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
