import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const channelId = import.meta.env.PUBLIC_YOUTUBE_CHANNEL_ID || "UC5KmMLWKSyiGixXGl9J3Z8Q";
    const url = `https://www.youtube.com/channel/${channelId}/live`;
    const response = await fetch(url, {
      headers: {
        // Use a generic user agent to prevent basic bot blocks
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    if (!response.ok) {
      throw new Error(`YouTube responded with status ${response.status}`);
    }

    const html = await response.text();
    const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)">/);
    const canonicalUrl = canonicalMatch ? canonicalMatch[1] : null;

    let isLive = false;
    let liveVideoId = null;

    if (canonicalUrl && canonicalUrl.includes("watch?v=")) {
      isLive = true;
      liveVideoId = canonicalUrl.split("watch?v=")[1];
    }

    let latestVideoId = null;
    let recentVideos: any[] = [];

    try {
      const streamsUrl = `https://www.youtube.com/channel/${channelId}/streams`;
      const streamsRes = await fetch(streamsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9"
        }
      });
      
      if (streamsRes.ok) {
        const html = await streamsRes.text();
        const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
        if (match) {
            const data = JSON.parse(match[1]);
            const results: any[] = [];
            
            function findVideos(obj: any) {
                if (!obj) return;
                if (Array.isArray(obj)) {
                    for (const item of obj) findVideos(item);
                } else if (typeof obj === 'object') {
                    if (obj.videoId && obj.title && obj.title.runs && obj.title.runs.length > 0) {
                        results.push({
                            id: obj.videoId,
                            title: obj.title.runs[0].text,
                            published: obj.publishedTimeText ? obj.publishedTimeText.simpleText : ''
                        });
                    } else {
                        for (const key in obj) {
                            findVideos(obj[key]);
                        }
                    }
                }
            }
            findVideos(data);
            
            // De-duplicate
            const ids = new Set();
            for (const v of results) {
                if (!ids.has(v.id)) {
                    ids.add(v.id);
                    recentVideos.push(v);
                }
            }
        }
        
        if (recentVideos.length > 0) {
          latestVideoId = recentVideos[0].id;
        }
      }
    } catch (e) {
      console.warn("Failed to fetch YouTube streams data", e);
    }

    return new Response(JSON.stringify({
      isLive,
      videoId: liveVideoId,
      latestVideoId,
      recentVideos
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Cache the response briefly to prevent hammering YouTube if many users load at once
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30"
      }
    });

  } catch (err) {
    console.error("[/api/youtube-live] Error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to detect live status", isLive: false }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
