import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

interface SmartLivePlayerProps {
  /**
   * By default, the player switches to the latest sermon if offline.
   * Pass latestSermon to provide fallback data.
   */
  fallbackVideoId?: string;
  fallbackTitle?: string;
  className?: string;
  theme?: 'light' | 'dark';
}

export default function SmartLivePlayer({
  fallbackVideoId,
  fallbackTitle = 'Latest Sermon',
  className = '',
  theme = 'light'
}: SmartLivePlayerProps) {
  const [apiLatestVideoId, setApiLatestVideoId] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [hasClickedPlay, setHasClickedPlay] = useState<boolean>(false);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/youtube-live');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        
        if (data.latestVideoId) {
          setApiLatestVideoId(data.latestVideoId);
        }
      } catch (err) {
        console.error('Failed to check latest video:', err);
      } finally {
        setIsChecking(false);
      }
    };

    fetchLatest();
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────
  
  // Decide which video ID to show
  const rawVideoId = apiLatestVideoId || fallbackVideoId;
  
  // Robust YouTube ID extraction for all link formats including /live/ and /shorts/
  const extractVideoId = (str?: string | null) => {
    if (!str) return null;
    const cleanStr = str.trim();
    
    // If it's already exactly 11 valid characters (standard YouTube ID)
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanStr)) {
      return cleanStr;
    }

    // Comprehensive regex for standard URLs, shortlinks, live streams, and shorts
    const match = cleanStr.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|live\/|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (match && match[1]) {
      return match[1];
    }
    
    // Fallback: strictly extract the first 11-char alphanumeric block if it exists
    const looseMatch = cleanStr.match(/[a-zA-Z0-9_-]{11}/);
    return looseMatch ? looseMatch[0] : null;
  };
  const activeVideoId = extractVideoId(rawVideoId);

  return (
    <div className={`flex flex-col w-full ${className}`}>
      
      {/* Status Badge header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <span className={`font-heading text-lg tracking-wide ${theme === 'dark' ? 'text-white' : 'text-primary'}`}>
            {fallbackTitle}
          </span>
        </div>
      </div>

      {/* Video Player */}
      <div className={`relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border ${theme === 'dark' ? 'border-white/10' : 'border-primary/10'}`}>
        {activeVideoId ? (
          hasClickedPlay ? (
            <iframe
              key={activeVideoId} // Forces iframe to reload only if the ID strictly rotates
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
              title={fallbackTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full border-0 bg-black"
            ></iframe>
          ) : (
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center cursor-pointer group flex items-center justify-center transition-opacity"
              style={{ backgroundImage: `url('https://img.youtube.com/vi/${activeVideoId}/hqdefault.jpg')` }}
              onClick={() => setHasClickedPlay(true)}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_4px_30px_rgba(220,38,38,0.7)] group-hover:scale-110 group-hover:shadow-[0_8px_40px_rgba(220,38,38,0.9)] transition-all duration-300">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-2" fill="currentColor" />
              </div>
            </div>
          )
        ) : (
          // Extreme fallback if neither live nor recent sermon exists
          <div className={`absolute inset-0 flex flex-col items-center justify-center text-center px-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-primary/10'}`}>
            <Play className={`w-12 h-12 mb-4 ${theme === 'dark' ? 'text-white/20' : 'text-primary/30'}`} />
            <p className={`font-heading text-xl mb-2 ${theme === 'dark' ? 'text-white' : 'text-primary'}`}>Content Unavailable</p>
            <p className={`font-paragraph text-sm ${theme === 'dark' ? 'text-white/50' : 'text-foreground/60'}`}>
              Please check back later or visit our YouTube channel.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
