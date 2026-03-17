/**
 * SongSearch.tsx
 * Full-featured song browser with client-side Fuse.js search.
 * Supports Telugu Unicode lyrics — uses `font-family: "Noto Sans Telugu"` for
 * the lyrics body and pre-wrap for preserving verse structure.
 */
import { useState, useMemo, useCallback } from "react";
import Fuse from "fuse.js";
import { Search, X, Music, ChevronDown, ChevronUp, Volume2, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Song } from "@/lib/sanity";

interface Props {
  songs: Song[];
  genres: string[];
}

const ITEMS_PER_PAGE = 20;

export default function SongSearch({ songs, genres }: Props) {
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fuse = useMemo(
    () =>
      new Fuse(songs, {
        keys: [
          { name: "title", weight: 3 },
          { name: "titleTelugu", weight: 3 },
          { name: "lyrics", weight: 1 },
          { name: "artist", weight: 1.5 },
          { name: "tags", weight: 1 },
        ],
        threshold: 0.35,
        useExtendedSearch: true,
        // Crucial: Fuse.js handles Unicode natively — no special config needed
        ignoreLocation: true,
      }),
    [songs]
  );

  const filtered = useMemo(() => {
    let results = query.trim()
      ? fuse.search(query).map((r) => r.item)
      : [...songs];

    if (selectedGenre) {
      results = results.filter((s) => s.genre === selectedGenre);
    }
    return results;
  }, [query, selectedGenre, fuse, songs]);

  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  const clearFilters = useCallback(() => {
    setQuery("");
    setSelectedGenre("");
    setPage(1);
  }, []);

  const isTelugu = (text: string) => /[\u0C00-\u0C7F]/.test(text);

  const lyricsStyle = (lyrics: string): React.CSSProperties =>
    isTelugu(lyrics)
      ? {
          fontFamily: '"Noto Sans Telugu", "Open Sans", system-ui, sans-serif',
          lineHeight: 1.9,
          fontSize: "0.95rem",
        }
      : {};

  return (
    <div>
      {/* ── Search + filter bar ─────────────────────────────────────────── */}
      <div className="sticky top-[73px] z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-primary/10 dark:border-white/10 py-4 mb-10">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 dark:text-white/40 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search songs by title, lyrics, or artist… (Telugu supported)"
                className="w-full pl-10 pr-10 py-2.5 border border-primary/20 dark:border-white/20 bg-white dark:bg-slate-800 text-foreground dark:text-white font-paragraph text-sm focus:outline-none focus:border-primary dark:focus:border-white/60 focus:ring-1 focus:ring-primary/30"
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); setPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground dark:text-white/40 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <select
              value={selectedGenre}
              onChange={(e) => { setSelectedGenre(e.target.value); setPage(1); }}
              className="px-3 py-2.5 border border-primary/20 dark:border-white/20 bg-white dark:bg-slate-800 text-foreground dark:text-white font-paragraph text-sm focus:outline-none focus:border-primary min-w-[160px]"
            >
              <option value="">All Genres</option>
              {genres.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>

            {(query || selectedGenre) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2.5 text-sm font-paragraph text-secondary hover:text-secondary/80 flex items-center gap-1.5"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
          <p className="font-paragraph text-xs text-foreground/50 dark:text-white/40 mt-2">
            {filtered.length} song{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* ── Song list ────────────────────────────────────────────────────── */}
      <div className="max-w-[100rem] mx-auto px-6">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Music className="w-16 h-16 mx-auto mb-6 text-primary/20" />
            <p className="font-heading text-2xl text-primary/60 mb-4">No songs found</p>
            <button onClick={clearFilters} className="font-paragraph text-sm text-primary underline underline-offset-4">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginated.map((song, index) => {
                const isExpanded = expandedId === song._id;
                const hasTeluguTitle = isTelugu(song.titleTelugu ?? song.title ?? "");

                return (
                  <motion.div
                    key={song._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.3) }}
                    className="bg-white dark:bg-slate-800 border border-primary/10 dark:border-white/10 hover:border-primary/25 dark:hover:border-white/25 transition-colors"
                  >
                    {/* Song header row — always visible */}
                    <div
                      className="flex items-center justify-between p-5 cursor-pointer group"
                      onClick={() => setExpandedId(isExpanded ? null : song._id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setExpandedId(isExpanded ? null : song._id)}
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary/8 dark:bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Music className="w-3.5 h-3.5 text-primary dark:text-blue-300" />
                        </div>
                        <div className="min-w-0">
                          <h3
                            className="font-heading text-lg text-primary dark:text-blue-300 group-hover:text-secondary transition-colors truncate"
                            style={hasTeluguTitle ? lyricsStyle(song.titleTelugu ?? song.title ?? "") : {}}
                          >
                            {song.title}
                          </h3>
                          {song.titleTelugu && song.titleTelugu !== song.title && (
                            <p
                              className="font-paragraph text-sm text-foreground/60 dark:text-white/50 mt-0.5"
                              style={lyricsStyle(song.titleTelugu)}
                            >
                              {song.titleTelugu}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 mt-1.5">
                            {song.artist && (
                              <span className="font-paragraph text-xs text-foreground/50 dark:text-white/40">
                                {song.artist}
                              </span>
                            )}
                            {song.genre && (
                              <span className="font-paragraph text-xs px-2 py-0.5 bg-primary/8 dark:bg-white/10 text-primary/70 dark:text-white/60">
                                {song.genre}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        {song.audioLink && (
                          <a
                            href={song.audioLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-primary/60 dark:text-white/50 hover:text-secondary transition-colors"
                            title="Listen to this song"
                          >
                            <Volume2 className="w-4 h-4" />
                          </a>
                        )}
                        {song.lyrics && (
                          <span className="font-paragraph text-xs text-foreground/50 dark:text-white/40 hidden sm:block">
                            {isExpanded ? "Hide" : "Show"} lyrics
                          </span>
                        )}
                        {song.lyrics && (
                          <div className="text-primary/60 dark:text-white/50">
                            {isExpanded
                              ? <ChevronUp className="w-5 h-5" />
                              : <ChevronDown className="w-5 h-5" />
                            }
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expandable lyrics */}
                    <AnimatePresence>
                      {isExpanded && song.lyrics && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-6 pt-2 border-t border-primary/8 dark:border-white/8">
                            <pre
                              className="font-paragraph text-sm text-foreground/80 dark:text-white/70 whitespace-pre-wrap leading-relaxed max-h-[60vh] overflow-y-auto"
                              style={lyricsStyle(song.lyrics)}
                            >
                              {song.lyrics}
                            </pre>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="inline-flex items-center gap-2 border border-primary/30 dark:border-white/20 text-primary dark:text-white hover:bg-primary hover:text-white font-paragraph text-sm px-10 py-4 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                  Load more ({filtered.length - paginated.length} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
