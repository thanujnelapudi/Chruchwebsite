/**
 * GalleryGrid.tsx
 * Category-filterable image grid with a simple lightbox.
 * Image URLs are pre-computed server-side and passed in as plain strings,
 * so no Sanity client runs on the browser.
 */
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryItem {
  _id: string;
  title?: string | null;
  category?: string | null;
  caption?: string | null;
  dateTaken?: string | null;
  url: string | null;
  urlThumb: string | null;
}

interface Props {
  items: GalleryItem[];
  categories: string[];
}

export default function GalleryGrid({ items, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = selectedCategory === "All"
    ? items
    : items.filter((i) => i.category === selectedCategory);

  const openLightbox = useCallback((idx: number) => {
    setLightboxIndex(idx);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
  }, [filtered.length]);

  const lightboxItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <>
      {/* Category filter */}
      <div className="max-w-[100rem] mx-auto mb-10">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`font-paragraph text-sm px-5 py-2 transition-colors border ${
                selectedCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "border-primary/20 text-foreground/70 hover:border-primary hover:text-primary bg-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <p className="font-paragraph text-xs text-foreground/40 mt-3">
          {filtered.length} photo{filtered.length !== 1 ? "s" : ""}
          {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 max-w-[100rem] mx-auto">
          <p className="font-paragraph text-lg text-foreground/50">No photos in this category yet.</p>
        </div>
      ) : (
        <motion.div
          className="max-w-[100rem] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative aspect-square bg-primary/5 overflow-hidden group cursor-pointer"
                onClick={() => openLightbox(idx)}
                role="button"
                tabIndex={0}
                aria-label={item.title ?? item.caption ?? "Gallery image"}
                onKeyDown={(e) => e.key === "Enter" && openLightbox(idx)}
              >
                {item.urlThumb ? (
                  <img
                    src={item.urlThumb}
                    alt={item.title ?? item.caption ?? "Gallery photo"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-primary/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z"/>
                    </svg>
                  </div>
                )}
                {/* Hover overlay with caption */}
                {(item.title || item.caption || item.category) && (
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                    {(item.title || item.caption) && (
                      <p className="font-paragraph text-sm text-white line-clamp-3">
                        {item.title ?? item.caption}
                      </p>
                    )}
                    {item.category && (
                      <span className="font-paragraph text-xs text-white/60 mt-1">{item.category}</span>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
              aria-label="Close"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Prev */}
            {filtered.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 text-white/70 hover:text-white p-2 z-10"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={lightboxItem._id}
              className="max-w-5xl max-h-[90vh] flex flex-col items-center px-16"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxItem.url ? (
                <img
                  src={lightboxItem.url}
                  alt={lightboxItem.title ?? lightboxItem.caption ?? "Gallery photo"}
                  className="max-h-[75vh] max-w-full object-contain"
                />
              ) : null}
              {(lightboxItem.title || lightboxItem.caption) && (
                <div className="mt-4 text-center">
                  {lightboxItem.title && (
                    <p className="font-heading text-lg text-white mb-1">{lightboxItem.title}</p>
                  )}
                  {lightboxItem.caption && lightboxItem.caption !== lightboxItem.title && (
                    <p className="font-paragraph text-sm text-white/60">{lightboxItem.caption}</p>
                  )}
                </div>
              )}
              {lightboxIndex !== null && (
                <p className="font-paragraph text-xs text-white/30 mt-3">
                  {lightboxIndex + 1} / {filtered.length}
                </p>
              )}
            </motion.div>

            {/* Next */}
            {filtered.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 text-white/70 hover:text-white p-2 z-10"
                aria-label="Next photo"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
