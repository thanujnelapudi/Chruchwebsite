/**
 * SermonSearch.tsx
 * React island — receives all sermons as a prop (serialised at build time),
 * runs Fuse.js locally, renders a filterable, searchable sermon grid with
 * PDF viewer and YouTube embed integration.
 *
 * client:load — loads immediately since it's the primary content of the page.
 */
import { useState, useMemo, useCallback } from "react";
import Fuse from "fuse.js";
import { Search, X, Filter, BookOpen, Play, Download, ChevronDown, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Sermon } from "@/lib/sanity";
import { PDFViewerModal } from "@/components/islands/PDFViewerModal";

interface Props {
  sermons: Sermon[];
  topics: string[];
  allSeries: string[];
}

const ITEMS_PER_PAGE = 12;

export default function SermonSearch({ sermons, topics, allSeries }: Props) {
  const [query, setQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("");
  const [page, setPage] = useState(1);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfTitle, setPdfTitle] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Build Fuse index once on mount
  const fuse = useMemo(
    () =>
      new Fuse(sermons, {
        keys: [
          { name: "title", weight: 3 },
          { name: "speaker", weight: 2 },
          { name: "topic", weight: 2 },
          { name: "tags", weight: 1.5 },
          { name: "series", weight: 1 },
          { name: "description", weight: 1 },
        ],
        threshold: 0.35,
        includeScore: true,
        useExtendedSearch: true,
      }),
    [sermons]
  );

  const filtered = useMemo(() => {
    let results = query.trim()
      ? fuse.search(query).map((r) => r.item)
      : [...sermons];

    if (selectedTopic) {
      results = results.filter((s) => s.topic === selectedTopic);
    }
    if (selectedSeries) {
      results = results.filter((s) => s.series === selectedSeries);
    }
    return results;
  }, [query, selectedTopic, selectedSeries, fuse, sermons]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = page < totalPages;

  const clearFilters = useCallback(() => {
    setQuery("");
    setSelectedTopic("");
    setSelectedSeries("");
    setPage(1);
  }, []);

  const hasActiveFilters = query || selectedTopic || selectedSeries;

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {/* ── Search + filter bar ─────────────────────────────────────────── */}
      <div className="sticky top-[73px] z-40 bg-white/95 backdrop-blur-sm border-b border-primary/10 py-4 mb-10">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search sermons by title, speaker, topic, tags…"
                className="w-full pl-10 pr-10 py-2.5 border border-primary/20 bg-white text-foreground font-paragraph text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); setPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`sm:hidden flex items-center gap-2 px-4 py-2.5 border font-paragraph text-sm transition-colors ${
                showFilters || selectedTopic || selectedSeries
                  ? "border-primary bg-primary text-white"
                  : "border-primary/20 text-foreground/70"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters {(selectedTopic || selectedSeries) ? "(active)" : ""}
            </button>

            {/* Desktop filters */}
            <div className="hidden sm:flex gap-3">
              <select
                value={selectedTopic}
                onChange={(e) => { setSelectedTopic(e.target.value); setPage(1); }}
                className="px-3 py-2.5 border border-primary/20 bg-white text-foreground font-paragraph text-sm focus:outline-none focus:border-primary min-w-[160px]"
              >
                <option value="">All Topics</option>
                {topics.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <select
                value={selectedSeries}
                onChange={(e) => { setSelectedSeries(e.target.value); setPage(1); }}
                className="px-3 py-2.5 border border-primary/20 bg-white text-foreground font-paragraph text-sm focus:outline-none focus:border-primary min-w-[160px]"
              >
                <option value="">All Series</option>
                {allSeries.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2.5 text-sm font-paragraph text-secondary hover:text-secondary/80 flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Mobile filter drawer */}
          {showFilters && (
            <div className="sm:hidden mt-3 flex flex-col gap-3">
              <select
                value={selectedTopic}
                onChange={(e) => { setSelectedTopic(e.target.value); setPage(1); }}
                className="px-3 py-2.5 border border-primary/20 bg-white text-foreground font-paragraph text-sm w-full focus:outline-none"
              >
                <option value="">All Topics</option>
                {topics.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select
                value={selectedSeries}
                onChange={(e) => { setSelectedSeries(e.target.value); setPage(1); }}
                className="px-3 py-2.5 border border-primary/20 bg-white text-foreground font-paragraph text-sm w-full focus:outline-none"
              >
                <option value="">All Series</option>
                {allSeries.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          {/* Results count */}
          <p className="font-paragraph text-xs text-foreground/50 mt-2">
            {filtered.length} sermon{filtered.length !== 1 ? "s" : ""}
            {hasActiveFilters ? " matching your filters" : " total"}
          </p>
        </div>
      </div>

      {/* ── Sermon grid ──────────────────────────────────────────────────── */}
      <div className="max-w-[100rem] mx-auto px-6">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-primary/20" />
            <p className="font-heading text-2xl text-primary/60 mb-4">No sermons found</p>
            <p className="font-paragraph text-foreground/50 mb-8">
              Try different search terms or clear your filters.
            </p>
            <button
              onClick={clearFilters}
              className="font-paragraph text-sm text-primary hover:text-secondary transition-colors underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            >
              {paginated.map((sermon) => (
                <motion.article
                  key={sermon._id}
                  variants={fadeUp}
                  className="bg-white border border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all group flex flex-col"
                >
                  {/* Thumbnail / YouTube preview */}
                  <div className="aspect-video bg-primary/5 relative overflow-hidden">
                    {sermon.youtubeVideoId ? (
                      <img
                        src={`https://img.youtube.com/vi/${sermon.youtubeVideoId}/mqdefault.jpg`}
                        alt={sermon.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : sermon.thumbnailImage ? (
                      <img
                        src={`${sermon.thumbnailImage}`}
                        alt={sermon.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-primary/20" />
                      </div>
                    )}
                    {sermon.youtubeVideoId && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:bg-secondary/80 transition-colors">
                          <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                        </div>
                      </div>
                    )}
                    {sermon.series && (
                      <div className="absolute top-3 left-3 bg-primary/90 text-white font-paragraph text-xs px-2.5 py-1">
                        {sermon.series}
                        {sermon.seriesPart ? ` · Part ${sermon.seriesPart}` : ""}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                      {sermon.date && (
                        <p className="font-paragraph text-xs text-foreground/50 uppercase tracking-wide mb-2">
                          {formatDate(sermon.date)}
                        </p>
                      )}
                      <h3 className="font-heading text-xl text-primary mb-2 group-hover:text-secondary transition-colors">
                        {sermon.title}
                      </h3>
                      {sermon.speaker && (
                        <p className="font-paragraph text-sm text-foreground/70 mb-3">
                          {sermon.speaker}
                        </p>
                      )}
                      {sermon.description && (
                        <p className="font-paragraph text-sm text-foreground/60 line-clamp-2 mb-4">
                          {sermon.description}
                        </p>
                      )}
                      {sermon.tags && sermon.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {sermon.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 font-paragraph text-xs px-2 py-0.5 bg-primary/8 text-primary/80"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-4 border-t border-primary/10 mt-auto">
                      {sermon.youtubeVideoId && (
                        <a
                          href={`https://www.youtube.com/watch?v=${sermon.youtubeVideoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-paragraph text-sm py-2.5 px-4 transition-colors"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          Watch
                        </a>
                      )}
                      {sermon.pdfUrl && (
                        <>
                          <button
                            onClick={() => { setPdfUrl(sermon.pdfUrl!); setPdfTitle(sermon.title); }}
                            className="flex-1 flex items-center justify-center gap-2 border border-primary/30 text-primary hover:bg-primary/5 font-paragraph text-sm py-2.5 px-4 transition-colors"
                          >
                            <BookOpen className="w-4 h-4" />
                            Notes
                          </button>
                          <a
                            href={sermon.pdfUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-2.5 border border-primary/20 text-foreground/60 hover:text-primary hover:border-primary transition-colors"
                            title="Download sermon notes"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-16">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="inline-flex items-center gap-2 border border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary font-paragraph text-sm px-10 py-4 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                  Load more sermons ({filtered.length - paginated.length} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {pdfUrl && (
          <PDFViewerModal
            url={pdfUrl}
            title={pdfTitle}
            onClose={() => setPdfUrl(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
