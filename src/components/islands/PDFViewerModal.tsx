/**
 * PDFViewerModal.tsx
 * Inline PDF viewer using the browser's native PDF renderer (via <iframe>).
 * Zero extra dependencies — works in all modern browsers.
 * Falls back to a download prompt on mobile browsers that don't embed PDFs.
 *
 * Lazy-loaded by SermonSearch: only the <motion.div> wrapper is in the initial bundle.
 */
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, Download, ExternalLink } from "lucide-react";

interface Props {
  url: string;
  title: string;
  onClose: () => void;
}

export function PDFViewerModal({ url, title, onClose }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    // Prevent body scroll while modal is open
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      ref={backdropRef}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <motion.div
        className="w-full max-w-5xl h-[90vh] bg-white flex flex-col shadow-2xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10 flex-shrink-0">
          <div className="flex-1 min-w-0 mr-4">
            <p className="font-paragraph text-xs text-foreground/50 uppercase tracking-wide mb-0.5">
              Sermon Notes
            </p>
            <h3 className="font-heading text-lg text-primary truncate">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-paragraph text-sm px-4 py-2 border border-primary/20 text-primary hover:bg-primary hover:text-white hover:border-primary transition-colors"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </a>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-paragraph text-sm px-4 py-2 border border-primary/20 text-primary hover:bg-primary hover:text-white hover:border-primary transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Open</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 text-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors"
              aria-label="Close PDF viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF iframe */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          <iframe
            src={`${url}#toolbar=1&navpanes=0`}
            className="w-full h-full border-0"
            title={`${title} — Sermon Notes`}
          />
        </div>

        {/* Mobile fallback footer */}
        <div className="md:hidden flex-shrink-0 px-6 py-3 border-t border-primary/10 text-center">
          <p className="font-paragraph text-xs text-foreground/50 mb-2">
            PDF not displaying? Open or download it directly.
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-paragraph text-sm text-primary underline underline-offset-2"
          >
            Open PDF in browser
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
