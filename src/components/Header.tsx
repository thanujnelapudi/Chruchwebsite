/**
 * src/components/Header.tsx
 * Smart scroll-hide header with dark mode toggle.
 * Uses plain <a> tags — no react-router-dom dependency.
 */
import { useState, useEffect, useCallback } from "react";
import { Menu, X, Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import design from "../../config/design.json";

/* ── Flat nav links (Gallery removed; Sermons & Songs moved into Resources dropdown) ── */
const navLinks = [
  { name: "Service Schedule", path: "/service-schedule" },
  { name: "Prayer Requests", path: "/prayer-requests" },
  { name: "New Here ?", path: "/about" },
  { name: "Contact", path: "/contact" },
];

/* ── Resources dropdown sub-links ── */
const resourcesLinks = [
  { name: "Sermons", path: "/sermons" },
  { name: "Songs", path: "/songs" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentPath, setCurrentPath] = useState("/");
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  // Set current path on mount (window is only available client-side)
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // ── Smart hide/show on scroll ──────────────────────────────────────────
  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;

    if (currentY < 80) {
      setIsVisible(true);
    } else if (delta > 8) {
      setIsVisible(false);
      setIsMenuOpen(false);
    } else if (delta < -5) {
      setIsVisible(true);
    }

    setLastScrollY(currentY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  const isResourcesActive = resourcesLinks.some((l) => isActive(l.path));

  const isScrolled = lastScrollY > 10;

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transform-gpu
        transition-all duration-300 ease-in-out
        bg-[rgba(20,40,80,0.55)] backdrop-blur-[16px] border-b border-white/[0.08]
        ${isScrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.2)]" : "shadow-none"}
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
      `}
    >
      <div className={`max-w-[120rem] mx-auto px-6 transition-all duration-300 ${isScrolled ? "py-3" : "py-5"}`}>
        <div className="flex items-center justify-between">

          {/* Brand Name — Cinzel font, fits within header */}
          <a href="/" className="flex items-center flex-shrink min-w-0 transition-opacity hover:opacity-80">
            <span
              className="text-sm sm:text-base md:text-lg lg:text-xl text-white leading-none tracking-[0.02em]"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              {design.brand.name}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 lg:space-x-8">

            {/* 1. Service Schedule */}
            {navLinks.filter(l => l.name === "Service Schedule").map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`
                  font-paragraph text-sm transition-colors relative group py-1
                  ${isActive(link.path)
                    ? "text-white font-medium"
                    : "text-white/80 hover:text-white"
                  }
                `}
              >
                {link.name}
                <span
                  className={`
                    absolute bottom-0 left-0 h-[2px] bg-secondary transition-all duration-300 ease-out
                    ${isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                />
              </a>
            ))}

            {/* 2. Resources Dropdown (Desktop) ── */}
            <div className="relative group flex items-center h-full">
              <button
                className={`
                  font-paragraph text-sm transition-colors relative flex items-center gap-1 py-1
                  ${isResourcesActive
                    ? "text-white font-medium"
                    : "text-white/80 hover:text-white"
                  }
                `}
              >
                Resources
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                <span
                  className={`
                    absolute bottom-0 left-0 h-[2px] bg-secondary transition-all duration-300 ease-out
                    ${isResourcesActive ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                />
              </button>

              {/* Dropdown panel — visible on hover */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50">
                <div className="bg-[rgba(20,40,80,0.8)] backdrop-blur-[20px] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] min-w-[200px] rounded-sm overflow-hidden py-1">
                  {resourcesLinks.map((sub) => (
                    <a
                      key={sub.path}
                      href={sub.path}
                      className={`
                        block font-paragraph text-sm px-6 py-3 transition-colors
                        ${isActive(sub.path)
                          ? "text-white bg-white/10 font-semibold"
                          : "text-white/80 hover:text-white hover:bg-white/5"
                        }
                      `}
                    >
                      {sub.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* 3, 4, 5. Prayer Requests, I'm New, Contact */}
            {navLinks.filter(l => l.name !== "Service Schedule").map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`
                  font-paragraph text-sm transition-colors relative group py-1
                  ${isActive(link.path)
                    ? "text-white font-medium"
                    : "text-white/80 hover:text-white"
                  }
                `}
              >
                {link.name}
                <span
                  className={`
                    absolute bottom-0 left-0 h-[2px] bg-secondary transition-all duration-300 ease-out
                    ${isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                />
              </a>
            ))}

          </nav>

          {/* Right controls */}
          <div className="flex items-center space-x-4 lg:space-x-6">

            {/* Watch Live CTA */}
            <a href="/watch-live" className="hidden md:flex items-center">
              <div className="relative inline-flex group">
                <div className="absolute -inset-0.5 bg-secondary/30 blur-sm rounded-full animate-pulse opacity-70 group-hover:opacity-0 transition-opacity duration-300"></div>
                <Button className="relative bg-secondary hover:bg-secondary/90 text-white rounded-[9999px] h-10 px-6 font-medium tracking-wide transition-all duration-300 ease-out hover:-translate-y-[2px] hover:scale-[1.04] shadow-[0_4px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_16px_rgba(212,175,55,0.3)]">
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  WATCH LIVE
                </Button>
              </div>
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden flex items-center justify-center text-white transition-opacity hover:opacity-80"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            <div className="flex flex-col space-y-1">

              {/* 1. Service Schedule */}
              {navLinks.filter(l => l.name === "Service Schedule").map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    font-paragraph text-base px-4 py-3 transition-colors
                    ${isActive(link.path)
                      ? "text-secondary font-medium bg-white/5"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {link.name}
                </a>
              ))}

              {/* ── 2. Resources (Mobile — expandable) ── */}
              <button
                onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                className={`
                  font-paragraph text-base px-4 py-3 transition-colors text-left flex items-center justify-between
                  ${isResourcesActive
                    ? "text-secondary font-medium bg-white/5"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                Resources
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileResourcesOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileResourcesOpen && (
                <div className="pl-6 flex flex-col space-y-1">
                  {resourcesLinks.map((sub) => (
                    <a
                      key={sub.path}
                      href={sub.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`
                        font-paragraph text-sm px-4 py-2 transition-colors
                        ${isActive(sub.path)
                          ? "text-secondary font-medium bg-white/5"
                          : "text-white/80 hover:text-white hover:bg-white/5"
                        }
                      `}
                    >
                      {sub.name}
                    </a>
                  ))}
                </div>
              )}

              {/* 3, 4, 5. Prayer Requests, I'm New, Contact */}
              {navLinks.filter(l => l.name !== "Service Schedule").map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    font-paragraph text-base px-4 py-3 transition-colors
                    ${isActive(link.path)
                      ? "text-secondary font-medium bg-white/5"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {link.name}
                </a>
              ))}

              <a href="/watch-live">
                <div className="relative w-full group mx-4 mt-4 block" style={{ width: 'calc(100% - 2rem)' }}>
                  <div className="absolute -inset-0.5 bg-secondary/30 blur-sm rounded-full animate-pulse opacity-70 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <Button className="relative w-full bg-secondary hover:bg-secondary/90 text-white rounded-[9999px] font-medium transition-all duration-300 ease-out shadow-[0_4px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_16px_rgba(212,175,55,0.3)]">
                    <Play className="mr-2 h-4 w-4 fill-current" />
                    WATCH LIVE
                  </Button>
                </div>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
