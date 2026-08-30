/**
 * SourcesView.tsx
 * Library of supporting material — PDFs, images, Word docs — that the pastor has
 * used or displayed during a sermon or for church-wide awareness. Each item is
 * either linked to a specific sermon (relatedSermon) or standalone.
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Image as ImageIcon,
    File,
    Search,
    X,
    Download,
    ExternalLink,
    BookOpen,
    Calendar,
} from "lucide-react";
import Fuse from "fuse.js";
import { PDFViewerModal } from "../islands/PDFViewerModal";

interface Source {
    _id: string;
    title: string;
    fileType: "pdf" | "image" | "docx" | "other";
    fileUrl: string;
    relatedSermons?: Array<{ _id: string; title: string }>;
    relatedSermon?: { _id: string; title: string } | null;
    category?: string;
    caption?: string;
    date?: string;
}

interface Props {
    sources: Source[];
}

const FILE_ICONS: Record<Source["fileType"], typeof FileText> = {
    pdf: FileText,
    image: ImageIcon,
    docx: File,
    other: File,
};

type ScopeFilter = "all" | "linked" | "standalone";

export default function SourcesView({ sources }: Props) {
    const [query, setQuery] = useState("");
    const [scope, setScope] = useState<ScopeFilter>("all");
    const [category, setCategory] = useState("");
    const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);
    const [pdfPreview, setPdfPreview] = useState<{ url: string; title: string } | null>(null);

    const categories = useMemo(
        () => [...new Set(sources.map((s) => s.category).filter(Boolean))] as string[],
        [sources]
    );

    const fuse = useMemo(
        () =>
            new Fuse(sources, {
                keys: [
                    { name: "title", weight: 3 },
                    { name: "caption", weight: 1.5 },
                    { name: "relatedSermons.title", weight: 1 },
                    { name: "relatedSermon.title", weight: 1 },
                    { name: "category", weight: 1 },
                ],
                threshold: 0.35,
                ignoreLocation: true,
            }),
        [sources]
    );

    const filtered = useMemo(() => {
        let r = query.trim() ? fuse.search(query).map((x) => x.item) : [...sources];
        if (scope === "linked") r = r.filter((s) => (s.relatedSermons && s.relatedSermons.length > 0) || !!s.relatedSermon);
        if (scope === "standalone") r = r.filter((s) => (!s.relatedSermons || s.relatedSermons.length === 0) && !s.relatedSermon);
        if (category) r = r.filter((s) => s.category === category);
        return r.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
    }, [query, scope, category, fuse, sources]);

    const clearAll = () => {
        setQuery("");
        setScope("all");
        setCategory("");
    };
    const hasFilters = query || scope !== "all" || category;

    const openItem = (s: Source) => {
        if (s.fileType === "image") {
            setLightboxImage({ url: s.fileUrl, title: s.title });
        } else if (s.fileType === "pdf") {
            setPdfPreview({ url: s.fileUrl, title: s.title });
        } else {
            window.open(s.fileUrl, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div className="min-h-screen bg-[#0A1428] text-[#FDFBF7] overflow-x-hidden relative font-paragraph selection:bg-[#C0A87D]/30 selection:text-[#FDFBF7]">
            {/* Full Page Cinematic Background — matches Sermons/Songs pages */}
            <div className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-[#0A1428]" />
            <div
                className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-cover bg-[center_30%] opacity-100 saturate-[0.8] brightness-[0.85] transition-all duration-700"
                style={{ backgroundImage: `url('/images/sermons-bg.jpg')` }}
            />
            <div className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-blue-900/40" />
            <div className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 overflow-hidden pointer-events-none mix-blend-plus-lighter opacity-60">
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[120%] bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-[120px]" />
                <div className="absolute top-[-20%] left-[15%] w-[15%] h-[130%] bg-gradient-to-b from-[#C0A87D]/15 via-[#C0A87D]/5 to-transparent rotate-[25deg] blur-2xl origin-top" />
                <div className="absolute top-[-10%] right-[10%] w-[25%] h-[120%] bg-gradient-to-b from-white/15 via-white/2 to-transparent rotate-[-20deg] blur-3xl origin-top" />
            </div>
            <div className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-gradient-to-b from-[#0A1428]/5 via-[#0A1428]/60 to-[#0A1428]/90 pointer-events-none" />
            <div className="fixed top-0 left-0 w-full h-[130vh] -top-[15vh] z-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0A1428_100%)] opacity-50 pointer-events-none" />

            {/* Hero Section */}
            <section className="relative pt-32 pb-0 md:pt-40 md:pb-2 px-6 flex flex-col justify-end z-10">
                <div className="max-w-[85rem] w-full mx-auto relative z-10 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }}
                        className="text-center w-full mb-6 text-[#FDFBF7]"
                    >
                        <ImageIcon className="w-12 h-12 md:w-16 md:h-16 text-[#C0A87D] mx-auto mb-4 drop-shadow-sm opacity-90" strokeWidth={1} />
                        <h1 className="font-heading text-5xl md:text-7xl mb-2 tracking-[0.03em] font-normal opacity-95 text-[#FDFBF7]">
                            S O U R C E S
                        </h1>
                        <p className="font-paragraph text-sm md:text-base text-[#FDFBF7]/70 max-w-2xl mx-auto font-light leading-[1.8] tracking-widest uppercase">
                            Access to the sources, pdfs and illustrations
                        </p>
                    </motion.div>

                    {/* Scope Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                        className="flex items-center justify-center p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-8 z-50 w-auto flex-wrap mx-auto shadow-xl"
                    >
                        {(["all", "linked", "standalone"] as ScopeFilter[]).map((s) => (
                            <button
                                key={s}
                                onClick={() => setScope(s)}
                                className={`flex items-center justify-center py-2 md:py-2.5 px-4 md:px-6 rounded-full text-[11px] md:text-[13px] uppercase tracking-widest font-medium transition-all border whitespace-nowrap ${scope === s
                                    ? "bg-[#C0A87D]/15 text-[#C0A87D] border-[#C0A87D]/30 shadow-sm"
                                    : "border-transparent text-[#FDFBF7]/50 hover:text-[#FDFBF7]/80 hover:bg-white/5"
                                    }`}
                            >
                                {s === "all" ? "All" : s === "linked" ? "Linked to a Sermon" : "Standalone"}
                            </button>
                        ))}
                    </motion.div>

                    {/* Search pill */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                        className="w-full max-w-3xl mx-auto sticky top-24 z-50 mb-6"
                    >
                        <div className="relative rounded-[2rem] md:rounded-full bg-white/[0.04] backdrop-blur-md border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-row items-center transition-all duration-500 hover:bg-white/[0.06] hover:border-white/[0.1] px-1 md:px-2 py-1 md:py-1.5 h-12 md:h-14">
                            <div className="relative flex-1 group h-full flex items-center min-w-[100px]">
                                <Search className="absolute left-3 md:left-4 w-4 h-4 text-[#FDFBF7]/40 group-focus-within:text-[#C0A87D] transition-colors pointer-events-none" />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search sources…"
                                    className="w-full h-full pl-9 md:pl-11 pr-3 md:pr-4 bg-transparent font-paragraph text-[#FDFBF7] text-xs md:text-sm placeholder-[#FDFBF7]/40 focus:outline-none focus:ring-0 truncate"
                                />
                            </div>
                            {categories.length > 0 && <div className="w-px h-6 bg-white/10 mx-1 md:mx-2 shrink-0" />}
                            <div className="flex items-center gap-1 md:gap-1.5 shrink-0 px-1 md:px-0 overflow-x-auto max-w-[45%] no-scrollbar">
                                {categories.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setCategory(category === c ? "" : c)}
                                        className={`px-2.5 md:px-3 h-8 md:h-9 rounded-full text-[10px] md:text-[11px] uppercase tracking-wider whitespace-nowrap transition-colors ${category === c ? "bg-[#C0A87D]/20 text-[#C0A87D]" : "text-[#FDFBF7]/50 hover:text-[#FDFBF7]/80 hover:bg-white/5"
                                            }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                            {hasFilters && (
                                <button onClick={clearAll} className="ml-0.5 md:ml-2 px-2.5 md:px-4 h-8 md:h-full rounded-full bg-[#C0A87D]/10 hover:bg-[#C0A87D]/20 border border-[#C0A87D]/20 text-[10px] md:text-xs font-paragraph text-[#C0A87D] flex items-center justify-center transition-all whitespace-nowrap shrink-0">
                                    <X className="w-3.5 h-3.5 mr-1 hidden md:block" /> Clear
                                </button>
                            )}
                        </div>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center font-paragraph text-[11px] text-[#FDFBF7]/30 mt-6 tracking-widest uppercase">
                            {filtered.length} source{filtered.length !== 1 ? "s" : ""}{hasFilters ? " matching your search" : " available"}
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="relative z-20 px-6 pt-4 md:pt-6 pb-32">
                <div className="max-w-[100rem] mx-auto">

                    {/* Grid */}
                    {filtered.length === 0 ? (
                        <p className="text-center text-[#FDFBF7]/50 py-20">No sources found.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            <AnimatePresence mode="popLayout">
                                {filtered.map((s) => {
                                    const Icon = FILE_ICONS[s.fileType] ?? File;
                                    return (
                                        <motion.div
                                            key={s._id}
                                            layout
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="bg-white/[0.04] border border-[#C0A87D]/20 rounded-lg p-5 flex flex-col gap-3 hover:border-[#C0A87D]/50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#C0A87D]/15 flex items-center justify-center flex-shrink-0">
                                                    <Icon className="w-5 h-5 text-[#C0A87D]" />
                                                </div>
                                                <span className="text-[10px] uppercase tracking-widest text-[#FDFBF7]/40">
                                                    {s.fileType}
                                                </span>
                                            </div>

                                            <h3 className="font-heading text-lg text-[#FDFBF7] leading-snug">{s.title}</h3>

                                            {s.caption && (
                                                <p className="text-sm text-[#FDFBF7]/60 line-clamp-3">{s.caption}</p>
                                            )}

                                            <div className="mt-auto pt-2 flex flex-col gap-2">
                                                {s.relatedSermons && s.relatedSermons.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1.5 items-center">
                                                        {s.relatedSermons.map((sermon) => (
                                                            <a
                                                                key={sermon._id}
                                                                href={`/sermons/${sermon._id}`}
                                                                className="inline-flex items-center gap-1 text-xs text-[#C0A87D] hover:underline bg-[#C0A87D]/10 hover:bg-[#C0A87D]/20 px-2 py-0.5 rounded transition-colors"
                                                            >
                                                                <BookOpen className="w-3 h-3 shrink-0" />
                                                                <span className="truncate max-w-[200px]">{sermon.title}</span>
                                                            </a>
                                                        ))}
                                                    </div>
                                                ) : s.relatedSermon ? (
                                                    <a
                                                        href={`/sermons/${s.relatedSermon._id}`}
                                                        className="inline-flex items-center gap-1.5 text-xs text-[#C0A87D] hover:underline w-fit"
                                                    >
                                                        <BookOpen className="w-3.5 h-3.5" />
                                                        {s.relatedSermon.title}
                                                    </a>
                                                ) : s.category ? (
                                                    <span className="text-xs text-[#FDFBF7]/50 w-fit">{s.category}</span>
                                                ) : null}

                                                {s.date && (
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-[#FDFBF7]/40">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Date(s.date).toLocaleDateString("en-IN", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </span>
                                                )}

                                                <div className="flex gap-2 pt-1">
                                                    <button
                                                        onClick={() => openItem(s)}
                                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#C0A87D] hover:bg-[#C0A87D]/90 text-[#0A1428] text-xs font-medium rounded transition-colors"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                        View
                                                    </button>
                                                    <a
                                                        href={s.fileUrl}
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-1.5 px-3 py-2 border border-[#C0A87D]/30 text-[#FDFBF7]/80 hover:border-[#C0A87D] text-xs rounded transition-colors"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                    </a>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </section>

            {/* PDF viewer */}
            {pdfPreview && (
                <PDFViewerModal
                    url={pdfPreview.url}
                    title={pdfPreview.title}
                    onClose={() => setPdfPreview(null)}
                />
            )}

            {/* Image lightbox */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
                        onClick={() => setLightboxImage(null)}
                    >
                        <button
                            onClick={() => setLightboxImage(null)}
                            className="absolute top-6 right-6 text-white/80 hover:text-white"
                        >
                            <X className="w-7 h-7" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            src={lightboxImage.url}
                            alt={lightboxImage.title}
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-full max-h-[85vh] object-contain rounded"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
