/**
 * SongsView.tsx
 * Exact visual replica of the original SongsPage.tsx.
 * Data passed as props — no data fetching here.
 * Includes full Fuse.js client-side search.
 */
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, Search, X, BookOpen, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Fuse from 'fuse.js';
import WatermarkBackground from '../ui/WatermarkBackground';

interface Song {
  _id: string;
  songTitle?: string;
  title?: string;
  lyrics?: string;
  audioLink?: string;
  artist?: string;
  genre?: string;
  titleTelugu?: string;
  isEndtimeSong?: boolean;
}

interface Props {
  songs: Song[];
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Extracts the base consonant/vowel from a Telugu string, ignoring guninthalu (vowel markers)
const getTeluguBaseLetter = (str: string) => {
  const trimmed = str.replace(/[^a-zA-Z\u0C00-\u0C7F]/g, '').trim();
  if (!trimmed) return '';
  const firstChar = trimmed[0];
  if (/^[\u0C00-\u0C7F]/.test(firstChar)) return firstChar;
  return '';
};

export default function SongsView({ songs }: Props) {
  const [expandedSong, setExpandedSong] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [language, setLanguage] = useState<'te' | 'en' | 'endtime'>('te');
  
  const itemsPerPage = viewMode === 'list' ? 24 : 12;

  // Lock body scroll when cinematic modal is open
  useEffect(() => {
    if (expandedSong && viewMode === 'grid') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [expandedSong, viewMode]);

  // Filter songs by selected language or category
  const languageFilteredSongs = useMemo(() => {
    return songs.filter(s => {
      if (language === 'endtime') return s.isEndtimeSong === true;
      if (language === 'te') return !!s.titleTelugu || s.genre?.toLowerCase().includes('telugu');
      if (language === 'en') return !s.titleTelugu && !s.genre?.toLowerCase().includes('telugu');
      return true;
    });
  }, [songs, language]);

  const fuse = useMemo(() => new Fuse(languageFilteredSongs, {
    keys: [
      { name: 'songTitle', weight: 3 },
      { name: 'title', weight: 4 },
      { name: 'titleTelugu', weight: 4 },
      { name: 'lyrics', weight: 1 },
      { name: 'artist', weight: 1.5 },
    ],
    threshold: 0.4,
    ignoreLocation: true,
  }), [languageFilteredSongs]);

  const displayTitle = (s: Song) => s.songTitle ?? s.title ?? '';

  // Dynamically extract only the Telugu letters that actually have songs assigned to them!
  const teluguAlphabet = useMemo(() => {
    const letters = new Set<string>();
    languageFilteredSongs.forEach(s => {
      if (s.titleTelugu) {
        const base = getTeluguBaseLetter(s.titleTelugu);
        if (base) letters.add(base);
      }
    });
    return Array.from(letters).sort((a, b) => a.localeCompare(b, 'te')); 
  }, [languageFilteredSongs]);

  const currentAlphabetList = language === 'en' ? ALPHABET : teluguAlphabet;

  const filtered = useMemo(() => {
    let results = query.trim() ? fuse.search(query).map(r => r.item) : languageFilteredSongs;
    
    if (activeLetter) {
      results = results.filter(s => {
        if (language === 'en') {
          const title = displayTitle(s).trim().toUpperCase();
          return title.startsWith(activeLetter) || title.replace(/^[^A-Z]+/i, '').startsWith(activeLetter);
        } else {
          if (!s.titleTelugu) return false;
          return getTeluguBaseLetter(s.titleTelugu) === activeLetter;
        }
      });
    }
    
    // Sort alphabetically naturally
    return results.sort((a, b) => {
      if (language === 'te' && a.titleTelugu && b.titleTelugu) {
        return a.titleTelugu.localeCompare(b.titleTelugu, 'te');
      }
      return displayTitle(a).localeCompare(displayTitle(b));
    });
  }, [query, fuse, languageFilteredSongs, activeLetter, language]);

  useEffect(() => {
    setCurrentPage(1);
    setActiveLetter(null); // Reset letter filter when changing language
  }, [query, language, viewMode]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedSongs = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-[#0A1428] text-[#FDFBF7] overflow-x-hidden relative font-paragraph selection:bg-[#C0A87D]/30 selection:text-[#FDFBF7]">

      {/* Full Page Cinematic Background (oversized to fix mobile viewport jump) */}
      <div className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-[#0A1428]" />
      <div
        className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-cover bg-[60%_30%] md:bg-[center_30%] opacity-100 saturate-[0.8] brightness-[0.85] transition-all duration-700"
        style={{ backgroundImage: `url('/images/songs-bg.jpg')` }}
      />
      
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
      <section className="relative pt-32 pb-0 md:pt-40 md:pb-2 px-6 z-10 flex flex-col justify-end">
        <div className="max-w-[85rem] w-full mx-auto relative z-10 flex flex-col items-center mt-auto">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="text-center w-full mb-6 text-[#FDFBF7]">
            <Music className="w-12 h-12 md:w-16 md:h-16 text-[#C0A87D] mx-auto mb-4 drop-shadow-sm opacity-90" strokeWidth={1} />
            <h1 className="font-heading text-5xl md:text-7xl mb-2 tracking-wide font-light text-transparent bg-clip-text bg-gradient-to-r from-[#FDFBF7] via-[#FDFBF7] to-[#C0A87D]/80 drop-shadow-[0_0_30px_rgba(253,251,247,0.15)] leading-tight pb-2 md:pb-4">
              Worship Songs
            </h1>
            <p className="font-paragraph text-[15px] md:text-lg text-[#FDFBF7]/70 max-w-2xl mx-auto leading-[2.4] tracking-[0.05em] font-light">
              Sing along with the songs we worship with. Explore lyrics and listen to our curated worship collection.
            </p>
          </motion.div>

          {/* Language Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="flex items-center justify-center p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-8 z-50 w-auto inline-flex mx-auto shadow-xl flex-wrap"
          >
            <button
              onClick={() => setLanguage('te')}
              className={`flex items-center justify-center py-2 md:py-2.5 px-5 md:px-8 rounded-full text-[11px] md:text-[13px] uppercase tracking-widest font-medium transition-all border whitespace-nowrap ${language === 'te' ? 'bg-[#C0A87D]/15 text-[#C0A87D] border-[#C0A87D]/30 shadow-sm' : 'border-transparent text-[#FDFBF7]/50 hover:text-[#FDFBF7]/80 hover:bg-white/5'}`}
            >
              Telugu Worship
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`flex items-center justify-center py-2 md:py-2.5 px-5 md:px-8 rounded-full text-[11px] md:text-[13px] uppercase tracking-widest font-medium transition-all border whitespace-nowrap ${language === 'en' ? 'bg-[#C0A87D]/15 text-[#C0A87D] border-[#C0A87D]/30 shadow-sm' : 'border-transparent text-[#FDFBF7]/50 hover:text-[#FDFBF7]/80 hover:bg-white/5'}`}
            >
              English Worship
            </button>
            <button
              onClick={() => setLanguage('endtime')}
              className={`flex items-center justify-center py-2 md:py-2.5 px-5 md:px-8 rounded-full text-[11px] md:text-[13px] uppercase tracking-widest font-medium transition-all border whitespace-nowrap ${language === 'endtime' ? 'bg-[#C0A87D]/15 text-[#C0A87D] border-[#C0A87D]/30 shadow-sm' : 'border-transparent text-[#FDFBF7]/50 hover:text-[#FDFBF7]/80 hover:bg-white/5'}`}
            >
              Endtime Songs
            </button>
          </motion.div>

          {/* Soft Sacred Pill Search & View Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="w-full max-w-3xl mx-auto sticky top-24 z-50 mb-0"
          >
            <div 
              className="relative rounded-[2rem] md:rounded-full bg-white/[0.04] backdrop-blur-md border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-row items-center transition-all duration-500 hover:bg-white/[0.06] hover:border-white/[0.1] px-1.5 md:px-2 py-1 md:py-1.5 h-12 md:h-14 group"
            >
              <div className="relative flex-1 group/input h-full flex items-center min-w-[100px]">
                <Search className={`absolute left-3 md:left-4 w-4 h-4 transition-colors pointer-events-none ${query ? 'text-[#C0A87D]' : 'text-[#FDFBF7]/40 group-focus-within/input:text-[#C0A87D]'}`} />
                <input
                  type="text" value={query}
                  onChange={e => { setQuery(e.target.value); setActiveLetter(null); }}
                  placeholder="Search songs by title or lyrics..."
                  className="w-full h-full pl-9 md:pl-11 pr-3 md:pr-4 bg-transparent font-paragraph text-[#FDFBF7] text-[13px] md:text-sm placeholder-[#FDFBF7]/40 focus:outline-none focus:ring-0 truncate tracking-wide [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                />
              </div>

              <div className="w-px h-6 bg-white/10 mx-1 md:mx-2 shrink-0" />

              <div className="flex shrink-0 items-center justify-center gap-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`w-8 h-8 md:w-[38px] md:h-[38px] flex items-center justify-center rounded-full transition-colors ${viewMode === 'grid' ? 'bg-[#C0A87D]/10 text-[#C0A87D] border border-[#C0A87D]/20' : 'border border-transparent text-[#FDFBF7]/40 hover:text-[#FDFBF7]/80 hover:bg-white/5'}`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`w-8 h-8 md:w-[38px] md:h-[38px] flex items-center justify-center rounded-full transition-colors ${viewMode === 'list' ? 'bg-[#C0A87D]/10 text-[#C0A87D] border border-[#C0A87D]/20' : 'border border-transparent text-[#FDFBF7]/40 hover:text-[#FDFBF7]/80 hover:bg-white/5'}`}
                  title="List View"
                >
                  <List className="w-[18px] h-[18px]" />
                </button>
              </div>

              {(query || activeLetter) && (
                <button onClick={() => { setQuery(''); setActiveLetter(null); }} className="ml-0.5 md:ml-2 px-2.5 md:px-4 h-8 md:h-10 rounded-full bg-[#C0A87D]/10 hover:bg-[#C0A87D]/20 border border-[#C0A87D]/20 text-[10px] md:text-xs font-paragraph text-[#C0A87D] flex items-center justify-center transition-all whitespace-nowrap shrink-0 mr-1 md:mr-0">
                  <X className="w-3.5 h-3.5 mr-1 hidden md:block" /> Clear
                </button>
              )}
            </div>

            {/* A-Z Index Bar */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={language}
                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.2 }}
                className="mt-5 w-full overflow-x-auto hide-scrollbar touch-pan-x"
              >
                <div className="flex items-center justify-start md:justify-center min-w-max gap-1 px-2 pb-2 font-paragraph">
                  <button
                    onClick={() => setActiveLetter(null)}
                    className={`px-4 py-1.5 rounded-full text-[11px] md:text-[12px] font-medium tracking-widest transition-all uppercase ${!activeLetter ? 'bg-[#C0A87D]/10 border border-[#C0A87D]/30 text-[#C0A87D]' : 'border border-transparent bg-transparent text-[#FDFBF7]/40 hover:text-[#FDFBF7]/80 hover:bg-white/5'}`}
                  >
                    All
                  </button>
                  <div className="w-px h-4 bg-white/5 mx-1" />
                  {currentAlphabetList.length > 0 ? currentAlphabetList.map(letter => {
                    const isActive = activeLetter === letter;
                    return (
                      <button
                        key={letter}
                        onClick={() => setActiveLetter(isActive ? null : letter)}
                        className={`w-[28px] h-[28px] md:w-[32px] md:h-[32px] flex items-center justify-center rounded-full font-heading font-light tracking-wide ${language === 'en' ? 'text-[13px] md:text-[15px]' : 'text-sm md:text-base'} transition-all ${isActive ? 'bg-[#C0A87D]/10 border border-[#C0A87D]/30 text-[#C0A87D]' : 'border border-transparent text-[#FDFBF7]/40 hover:text-[#FDFBF7]/80 hover:bg-white/5'}`}
                      >
                        {letter}
                      </button>
                    );
                  }) : (
                    <span className="text-xs text-[#FDFBF7]/30 italic px-2">No starting letters found in database.</span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center font-paragraph text-[11px] text-[#FDFBF7]/30 mt-4 tracking-widest uppercase">
              {filtered.length} song{filtered.length !== 1 ? 's' : ''}{(query || activeLetter) ? ' matching filters' : ' available'}
            </motion.p>
          </motion.div>
        
        </div>
      </section>

      {/* Songs View */}
      <section className="relative z-20 px-6 -mt-8 pb-32">
        <div className="max-w-[100rem] mx-auto">
          <div className="min-h-[400px]">
            {filtered.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
                    {paginatedSongs.map((song) => (
                      <div
                        key={song._id}
                        className={`group bg-white/[0.03] border border-white/[0.06] p-6 lg:p-8 hover:border-[#C0A87D]/30 transition-all flex flex-col rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-sm relative min-h-[160px] ${expandedSong === song._id ? 'z-50' : 'z-10 hover:z-20'}`}
                      >
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex-1">
                            <div className="mb-3">
                              {song.titleTelugu ? (
                                <>
                                  <h3 className="font-heading text-xl md:text-2xl text-[#FDFBF7] leading-[1.3] font-normal group-hover:text-[#C0A87D] transition-colors" style={{ fontFamily: '"Noto Sans Telugu", sans-serif' }}>
                                    {song.titleTelugu}
                                  </h3>
                                  <div className="text-[#FDFBF7]/70 text-[10px] md:text-[11px] tracking-[0.2em] font-medium uppercase mt-2">{displayTitle(song)}</div>
                                </>
                              ) : (
                                <h3 className="font-heading text-lg lg:text-xl text-[#FDFBF7] leading-[1.4] tracking-wide font-light group-hover:text-[#C0A87D] transition-colors">
                                  {displayTitle(song)}
                                </h3>
                              )}
                            </div>
                            <div className="flex flex-col gap-1.5 text-xs text-[#FDFBF7]/50 font-light tracking-wide">
                              {song.artist && <span className="uppercase tracking-widest text-[#FDFBF7]/70">Artist: {song.artist}</span>}
                              {song.genre && (
                                <span className="flex items-center gap-1.5 italic">
                                  <span className="w-1 h-1 rounded-full bg-[#C0A87D]/50" /> {song.genre}
                                </span>
                              )}
                            </div>
                          </div>
                          <Music className="w-5 h-5 text-[#FDFBF7]/20 flex-shrink-0 mt-1 transition-colors group-hover:text-[#C0A87D]/40" />
                        </div>

                        <div className="mt-auto pt-6 flex flex-col gap-3 border-t border-white/[0.04]">
                          {song.audioLink && (
                            <a
                              href={song.audioLink}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 bg-[#C0A87D]/10 text-[#C0A87D] hover:bg-[#C0A87D]/20 border border-[#C0A87D]/20 font-paragraph text-xs font-light py-2 px-3 rounded-[4px] transition-all shadow-sm group-hover:border-[#C0A87D]/30"
                            >
                              <Volume2 className="w-[10px] h-[10px] opacity-80" /> Listen
                            </a>
                          )}

                          {song.lyrics && (
                            <>
                              <button
                                onClick={() => setExpandedSong(song._id)}
                                className="flex items-center justify-center gap-2 bg-white/[0.02] text-[#FDFBF7]/60 hover:text-[#FDFBF7] hover:bg-white/[0.05] border border-white/[0.04] font-paragraph text-xs font-light py-2 px-3 rounded-[4px] transition-all"
                              >
                                <BookOpen className="w-[10px] h-[10px] opacity-80" /> 
                                View Lyrics
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-0 max-w-5xl mx-auto rounded-xl border border-white/[0.04] bg-white/[0.01] overflow-hidden">
                    {paginatedSongs.map((song) => (
                      <div
                        key={song._id}
                        className={`group bg-transparent border-b border-white/[0.04] last:border-b-0 px-4 py-4 lg:px-6 hover:bg-white/[0.04] transition-all flex flex-col backdrop-blur-sm ${expandedSong === song._id ? 'bg-white/[0.03]' : ''}`}
                      >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full">
                          
                          <div className="flex items-center gap-4 flex-1 w-full md:w-auto mb-4 md:mb-0">
                            <div className="w-10 h-10 rounded-full bg-white/[0.03] hidden md:flex items-center justify-center shrink-0">
                              <Music className="w-4 h-4 text-[#FDFBF7]/30 group-hover:text-[#C0A87D]/60 transition-colors" />
                            </div>
                            <div className="flex flex-col">
                              {song.titleTelugu ? (
                                <div className="flex flex-col gap-0.5">
                                  <h3 className="font-heading text-[19px] md:text-[21px] text-[#FDFBF7] font-normal group-hover:text-[#C0A87D] transition-colors leading-[1.2]" style={{ fontFamily: '"Noto Sans Telugu", sans-serif' }}>
                                    {song.titleTelugu}
                                  </h3>
                                  <div className="text-[#FDFBF7]/70 text-[10px] md:text-[11px] tracking-[0.2em] font-medium uppercase mt-1.5">{displayTitle(song)}</div>
                                </div>
                              ) : (
                                <h3 className="font-heading text-[17px] md:text-lg text-[#FDFBF7] font-light tracking-wide group-hover:text-[#C0A87D] transition-colors leading-tight">
                                  {displayTitle(song)}
                                </h3>
                              )}
                              <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-[11px] text-[#FDFBF7]/40 tracking-widest uppercase mt-1.5 flex-wrap">
                                {song.artist && <span>{song.artist}</span>}
                                {song.artist && song.genre && <span className="w-[3px] h-[3px] rounded-full bg-white/20" />}
                                {song.genre && <span>{song.genre}</span>}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
                            {song.audioLink && (
                              <a
                                href={song.audioLink}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-center h-8 md:h-9 w-9 md:w-auto md:px-4 bg-[#C0A87D]/10 text-[#C0A87D] hover:bg-[#C0A87D]/20 border border-[#C0A87D]/20 rounded-md transition-all shadow-sm group-hover:border-[#C0A87D]/30"
                                title="Listen"
                              >
                                <Volume2 className="w-3.5 h-3.5 md:mr-2" />
                                <span className="hidden md:block font-paragraph text-xs font-light">Listen</span>
                              </a>
                            )}
                            {song.lyrics && (
                              <button
                                onClick={() => setExpandedSong(expandedSong === song._id ? null : song._id)}
                                className={`flex items-center justify-center h-8 md:h-9 w-9 md:w-auto md:px-4 text-[#FDFBF7]/60 hover:text-[#FDFBF7] hover:bg-white/[0.08] border border-white/[0.06] rounded-md transition-all ${expandedSong === song._id ? 'bg-white/[0.08] text-[#FDFBF7]' : 'bg-white/[0.03]'}`}
                                title={expandedSong === song._id ? "Close Lyrics" : "Lyrics"}
                              >
                                {expandedSong === song._id ? <X className="w-3.5 h-3.5 md:mr-2" /> : <BookOpen className="w-3.5 h-3.5 md:mr-2" />}
                                <span className="hidden md:block font-paragraph text-xs font-light">{expandedSong === song._id ? 'Close' : 'Lyrics'}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <AnimatePresence>
                          {(viewMode === 'list' && expandedSong === song._id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden w-full mt-4"
                            >
                              <div className="bg-[#0A1428]/40 border border-white/[0.04] p-5 md:p-6 rounded-lg w-full">
                                <pre
                                  className="font-paragraph text-sm md:text-[15px] text-[#FDFBF7]/80 whitespace-pre-wrap leading-[2.0] tracking-wide"
                                  style={/[\u0C00-\u0C7F]/.test(song.lyrics) ? {
                                    fontFamily: '"Noto Sans Telugu", "Open Sans", system-ui, sans-serif',
                                    lineHeight: 2.0,
                                  } : undefined}
                                >
                                  {song.lyrics}
                                </pre>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="mt-16 flex items-center justify-center gap-6">
                    <button 
                      onClick={() => {
                        setCurrentPage(p => Math.max(1, p - 1));
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/[0.06] text-[#FDFBF7]/60 hover:text-[#C0A87D] hover:border-[#C0A87D]/30 transition-all disabled:opacity-30 disabled:pointer-events-none hover:shadow-[0_0_15px_rgba(192,168,125,0.15)]"
                    >
                      <ChevronLeft className="w-5 h-5 ml-[-2px]" />
                    </button>
                    
                    <div className="flex items-center gap-2 font-paragraph text-[#FDFBF7]/50 text-[13px] tracking-widest uppercase">
                      Page <span className="text-[#FDFBF7]/90 font-medium px-1">{currentPage}</span> of <span className="text-[#FDFBF7]/90 font-medium px-1">{totalPages}</span>
                    </div>

                    <button 
                      onClick={() => {
                        setCurrentPage(p => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/[0.06] text-[#FDFBF7]/60 hover:text-[#C0A87D] hover:border-[#C0A87D]/30 transition-all disabled:opacity-30 disabled:pointer-events-none hover:shadow-[0_0_15px_rgba(192,168,125,0.15)]"
                    >
                      <ChevronRight className="w-5 h-5 mr-[-2px]" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 flex flex-col items-center">
                <Music className="w-12 h-12 mb-6 text-[#FDFBF7]/20" />
                <p className="font-paragraph text-sm tracking-widest text-[#FDFBF7]/40 uppercase">
                  {query ? 'No songs match your search' : 'No worship songs available at this time'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cinematic Full-Screen Lyrics Overlay */}
      <AnimatePresence>
        {(viewMode === 'grid' && expandedSong) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A1428]/80 backdrop-blur-xl p-4 sm:p-6"
            onClick={() => setExpandedSong(null)} // Close when clicking the beautiful blurred background
          >
            {/* Find the song to display its data within the modal */}
            {(() => {
              const song = songs.find(s => s._id === expandedSong);
              if (!song) return null;
              
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                  className="bg-[#0A1428] border border-[#C0A87D]/20 rounded-2xl md:rounded-[2rem] shadow-[0_20px_60px_rgba(192,168,125,0.15)] w-full max-w-2xl max-h-[90vh] md:max-h-[85vh] flex flex-col relative overflow-hidden"
                  onClick={e => e.stopPropagation()} // Prevent clicking inside modal from closing it
                >
                  {/* Lyrics Header with Golden Accents */}
                  <div className="flex items-center justify-between p-6 md:p-8 bg-gradient-to-br from-white/[0.02] to-[#C0A87D]/[0.05] relative">
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C0A87D]/40 to-transparent" />
                    
                    <div className="flex-1 pr-6">
                      {song.titleTelugu && (
                        <h2 className="font-heading text-2xl md:text-3xl text-[#FDFBF7] font-normal leading-tight mb-2 group-hover:text-[#C0A87D] transition-colors" style={{ fontFamily: '"Noto Sans Telugu", sans-serif' }}>
                          {song.titleTelugu}
                        </h2>
                      )}
                      <h3 className={`font-heading ${song.titleTelugu ? 'text-xs md:text-sm text-[#FDFBF7]/60 uppercase tracking-widest' : 'text-2xl md:text-3xl text-[#FDFBF7] font-normal'}`}>
                        {displayTitle(song)}
                      </h3>
                      {song.artist && <p className="text-xs text-[#C0A87D] mt-2 tracking-widest uppercase">Artist: {song.artist}</p>}
                    </div>
                    <button
                      onClick={() => setExpandedSong(null)}
                      className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.06] text-[#FDFBF7]/60 hover:bg-[#C0A87D]/20 hover:text-[#C0A87D] hover:border-[#C0A87D]/30 transition-all shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Lyrics Body */}
                  <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-1 relative">
                    <pre
                      className="font-paragraph text-[15px] md:text-[17px] text-[#FDFBF7]/90 whitespace-pre-wrap leading-[2.0] tracking-[0.03em] font-light"
                      style={/[\u0C00-\u0C7F]/.test(song.lyrics || '') ? {
                        fontFamily: '"Noto Sans Telugu", "Open Sans", system-ui, sans-serif',
                        lineHeight: 2.0,
                      } : undefined}
                    >
                      {song.lyrics || "No lyrics available."}
                    </pre>
                  </div>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
