/**
 * src/components/Header.tsx
 * Smart scroll-hide header with dark mode toggle.
 * Uses plain <a> tags — no react-router-dom dependency.
 */
import { useState, useEffect, useCallback } from "react";
import { Menu, X, Play, Sun, Moon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import design from "../../config/design.json";

/* ── Flat nav links (Gallery removed; Sermons & Songs moved into Resources dropdown) ── */
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
  { name: "Service Schedule", path: "/service-schedule" },
  { name: "I'm New", path: "/about" },
  { name: "Prayer Requests", path: "/prayer-requests" },
  { name: "Contact", path: "/contact" },
];

/* ── Resources dropdown sub-links ── */
const resourcesLinks = [
  { name: "Sermon PDFs", path: "/sermons" },
  { name: "Songs", path: "/songs" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDark, setIsDark] = useState(false);
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

  // ── Dark mode ──────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("pct-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = saved ? saved === "dark" : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  function toggleDark() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("pct-theme", next ? "dark" : "light");
  }

  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  const isResourcesActive = resourcesLinks.some((l) => isActive(l.path));

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm
        border-b border-primary/10 dark:border-white/10 shadow-sm
        transition-transform duration-300 ease-in-out
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <div className="max-w-[120rem] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Brand Name — Cinzel font, fits within header */}
          <a href="/" className="flex items-center flex-shrink min-w-0">
            <span
              className="text-sm sm:text-base md:text-lg lg:text-xl text-primary dark:text-white leading-tight"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              {design.brand.name}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`
                  font-paragraph text-sm px-3 py-2 transition-colors relative group
                  ${isActive(link.path)
                    ? "text-primary dark:text-white"
                    : "text-foreground/70 dark:text-white/60 hover:text-primary dark:hover:text-white"
                  }
                `}
              >
                {link.name}
                <span
                  className={`
                    absolute bottom-0 left-0 h-0.5 bg-highlight-hover transition-all duration-200
                    ${isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                />
              </a>
            ))}

            {/* ── Resources Dropdown (Desktop) ── */}
            <div className="relative group">
              <button
                className={`
                  font-paragraph text-sm px-3 py-2 transition-colors relative flex items-center gap-1
                  ${isResourcesActive
                    ? "text-primary dark:text-white"
                    : "text-foreground/70 dark:text-white/60 hover:text-primary dark:hover:text-white"
                  }
                `}
              >
                Resources
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                <span
                  className={`
                    absolute bottom-0 left-0 h-0.5 bg-highlight-hover transition-all duration-200
                    ${isResourcesActive ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                />
              </button>

              {/* Dropdown panel — visible on hover */}
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white dark:bg-slate-800 border border-primary/10 dark:border-white/10 shadow-lg min-w-[180px]">
                  {resourcesLinks.map((sub) => (
                    <a
                      key={sub.path}
                      href={sub.path}
                      className={`
                        block font-paragraph text-sm px-5 py-3 transition-colors
                        ${isActive(sub.path)
                          ? "text-primary dark:text-white bg-primary/5 dark:bg-white/10"
                          : "text-foreground/70 dark:text-white/60 hover:text-primary dark:hover:text-white hover:bg-primary/5 dark:hover:bg-white/5"
                        }
                      `}
                    >
                      {sub.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Right controls */}
          <div className="flex items-center space-x-3">

            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="p-2 text-primary/60 dark:text-white/60 hover:text-primary dark:hover:text-white transition-colors"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Watch Live CTA */}
            <a href="/watch-live" className="hidden md:block">
              <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-none">
                <Play className="mr-2 h-4 w-4 fill-current" />
                WATCH LIVE
              </Button>
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-primary dark:text-white p-2"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-primary/10 dark:border-white/10 pt-4">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    font-paragraph text-base px-4 py-3 transition-colors
                    ${isActive(link.path)
                      ? "text-primary dark:text-white bg-primary/5 dark:bg-white/10"
                      : "text-foreground/70 dark:text-white/60 hover:text-primary dark:hover:text-white hover:bg-primary/5 dark:hover:bg-white/5"
                    }
                  `}
                >
                  {link.name}
                </a>
              ))}

              {/* ── Resources (Mobile — expandable) ── */}
              <button
                onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                className={`
                  font-paragraph text-base px-4 py-3 transition-colors text-left flex items-center justify-between
                  ${isResourcesActive
                    ? "text-primary dark:text-white bg-primary/5 dark:bg-white/10"
                    : "text-foreground/70 dark:text-white/60 hover:text-primary dark:hover:text-white hover:bg-primary/5 dark:hover:bg-white/5"
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
                          ? "text-primary dark:text-white bg-primary/5 dark:bg-white/10"
                          : "text-foreground/70 dark:text-white/60 hover:text-primary dark:hover:text-white hover:bg-primary/5 dark:hover:bg-white/5"
                        }
                      `}
                    >
                      {sub.name}
                    </a>
                  ))}
                </div>
              )}

              <a href="/watch-live" className="mx-4 mt-4">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-none">
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  WATCH LIVE
                </Button>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}