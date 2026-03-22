import React, { useState, useEffect } from 'react';
import { Play, Calendar, Users } from 'lucide-react';

interface YouTubeVideo {
  id: string;
  title: string;
  published: string;
}

interface RecentSermonsGridProps {
  /**
   * By passing the activeVideoId (the one currently playing in the live slot),
   * this block will ensure that the featured video is excluded from the recent list.
   */
  activeVideoId?: string | null;
  className?: string;
  theme?: 'light' | 'dark';
  hideTitle?: boolean;
}

export default function RecentSermonsGrid({ activeVideoId, className = '', theme = 'light', hideTitle = false }: RecentSermonsGridProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch('/api/youtube-live');
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        if (data.recentVideos && Array.isArray(data.recentVideos)) {
          setVideos(data.recentVideos);
        }
      } catch (err) {
        console.error('Failed to load recent sermons:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecent();
  }, []);

  // Filter out the active featured video (Live or Fallback) to prevent duplication.
  // Also, attempt a very rough filter to exclude potential shorts (though RSS doesn't give length,
  // we can just exclude titles with #shorts if they exist). We only take the top 3.
  const displayVideos = videos
    .filter(v => v.id !== activeVideoId && !v.title.toLowerCase().includes('#shorts'))
    .slice(0, 3);

  // If we are loading and have no data yet
  if (isLoading) {
    return (
      <div className={`w-full py-12 ${className}`}>
        {!hideTitle && (
          <h2 className={`font-heading text-4xl mb-8 text-center text-transparent animate-pulse rounded w-64 h-10 mx-auto ${theme === 'dark' ? 'bg-white/10' : 'bg-primary/20'}`}></h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[100rem] mx-auto px-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className={`aspect-video w-full mb-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-primary/10'}`}></div>
              <div className={`h-6 w-3/4 mb-2 ${theme === 'dark' ? 'bg-white/5' : 'bg-primary/10'}`}></div>
              <div className={`h-4 w-1/2 ${theme === 'dark' ? 'bg-white/5' : 'bg-primary/10'}`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If API completely failed or literally 0 videos exist
  if (error || displayVideos.length === 0) {
    return (
      <div className={`w-full py-16 text-center ${className}`}>
        <Play className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-white/20' : 'text-primary/30'}`} />
        {!hideTitle && (
          <h2 className={`font-heading text-3xl mb-2 ${theme === 'dark' ? 'text-white' : 'text-primary'}`}>Recent Sermons</h2>
        )}
        <p className={`font-paragraph text-lg ${theme === 'dark' ? 'text-white/50' : 'text-foreground/60'}`}>Sermons will be available soon.</p>
      </div>
    );
  }

  // Helper to extract pastor name (highly naive approach based on common titling)
  const getSpeaker = (title: string) => {
    if (title.toLowerCase().includes('pastor')) {
      // Find "Pastor Name"
      const match = title.match(/Pastor\s+[a-zA-Z]+/i);
      if (match) return match[0];
      return 'Church Pastor';
    }
    return 'Church Message';
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="max-w-[100rem] mx-auto px-6">
        {!hideTitle && (
          <h2 className={`font-heading text-4xl mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-primary'}`}>
            Recent Sermons
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayVideos.map((video, index) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`overflow-hidden transition-all duration-500 group flex flex-col border ${
                theme === 'dark' 
                  ? 'bg-[#0B1221]/60 backdrop-blur-md border-[#C0A87D]/10 hover:border-[#C0A87D]/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
                  : 'bg-white border-primary/5 hover:shadow-lg'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`aspect-video relative cursor-pointer overflow-hidden origin-bottom ${theme === 'dark' ? 'bg-white/5' : 'bg-primary/10'}`}>
                <img
                  src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    // Fallback to standard quality if maxres doesn't exist (older videos)
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className={`w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
                    theme === 'dark' 
                      ? 'bg-white/10 group-hover:bg-[#C0A87D]/80' 
                      : 'bg-white/20 group-hover:bg-highlight-hover'
                  }`}>
                    <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className={`font-heading text-xl mb-4 line-clamp-2 leading-snug transition-colors ${
                  theme === 'dark'
                    ? 'text-white group-hover:text-[#C0A87D]'
                    : 'text-primary group-hover:text-highlight-hover'
                }`}>
                  {video.title}
                </h3>
                <div className={`mt-auto flex flex-wrap items-center justify-between gap-y-2 border-t pt-4 ${
                  theme === 'dark' ? 'border-white/10' : 'border-primary/10'
                }`}>
                  <div className={`flex items-center shrink-0 pr-2 ${theme === 'dark' ? 'text-white/60' : 'text-foreground/70'}`}>
                    <Users className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-[#C0A87D]/60' : 'text-primary/40'}`} />
                    <span className="font-paragraph text-sm whitespace-normal">{getSpeaker(video.title)}</span>
                  </div>
                  <div className={`flex items-center shrink-0 ${theme === 'dark' ? 'text-white/40' : 'text-foreground/50'}`}>
                    <Calendar className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-[#C0A87D]/60' : 'text-primary/30'}`} />
                    <span className="font-paragraph text-xs whitespace-normal">
                      {new Date(video.published).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
