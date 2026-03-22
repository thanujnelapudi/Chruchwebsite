import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryItem {
  _id: string;
  title?: string;
  imageUrl?: string;
  category?: string;
  caption?: string;
  dateTaken?: string;
}

interface Props {
  images: GalleryItem[];
}

export default function GalleryView({ images }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', ...Array.from(new Set(images.map(img => img.category).filter(Boolean)))] as string[];
  const filteredImages = selectedCategory === 'All'
    ? images
    : images.filter(img => img.category === selectedCategory);

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  };

  return (
    <div className="min-h-screen bg-background relative">

      {/* Hero Section */}
      <section className="py-24 px-6 bg-primary">
        <div className="max-w-[100rem] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ImageIcon className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
            <h1 className="font-heading text-5xl md:text-6xl text-primary-foreground mb-6">
              GALLERY
            </h1>
            <p className="font-paragraph text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Glimpses of worship, fellowship, and ministry in action
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      {categories.length > 1 && (
        <section className="py-12 px-6 bg-primary/5 border-b border-primary/10">
          <div className="max-w-[100rem] mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`font-paragraph text-sm px-6 py-3 transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white text-foreground/70 hover:bg-primary/10 border border-primary/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="py-24 px-6">
        <div className="max-w-[100rem] mx-auto">
          <div className="min-h-[400px]">
            {filteredImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredImages.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="group relative aspect-square overflow-hidden bg-primary/10 cursor-pointer"
                    onClick={() => openLightbox(index)}
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title ?? 'Gallery image'}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <div>
                        {item.title && (
                          <h3 className="font-heading text-lg text-primary-foreground mb-1">
                            {item.title}
                          </h3>
                        )}
                        {item.caption && (
                          <p className="font-paragraph text-sm text-primary-foreground/80">
                            {item.caption}
                          </p>
                        )}
                        {item.dateTaken && (
                          <p className="font-paragraph text-xs text-primary-foreground/60 mt-2">
                            {new Date(item.dateTaken).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-primary/30" />
                <p className="font-paragraph text-lg text-foreground/60">
                  {selectedCategory === 'All' ? 'No images in gallery yet' : `No images in ${selectedCategory} category`}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10">
              <X className="w-8 h-8" />
            </button>
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length); }}
                  className="absolute left-4 text-white/70 hover:text-white p-2 z-10"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % filteredImages.length); }}
                  className="absolute right-4 text-white/70 hover:text-white p-2 z-10"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
            <motion.div
              key={lightboxIndex}
              className="max-w-5xl max-h-[90vh] flex flex-col items-center px-16"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              onClick={e => e.stopPropagation()}
            >
              {filteredImages[lightboxIndex]?.imageUrl && (
                <img
                  src={filteredImages[lightboxIndex].imageUrl!}
                  alt={filteredImages[lightboxIndex].title ?? ''}
                  className="max-h-[75vh] max-w-full object-contain"
                />
              )}
              {filteredImages[lightboxIndex]?.title && (
                <p className="font-heading text-lg text-white mt-4">{filteredImages[lightboxIndex].title}</p>
              )}
              <p className="font-paragraph text-xs text-white/30 mt-2">
                {lightboxIndex + 1} / {filteredImages.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
