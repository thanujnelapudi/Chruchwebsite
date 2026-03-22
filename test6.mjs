const channelId = "UC5KmMLWKSyiGixXGl9J3Z8Q";
async function run() {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const rssRes = await fetch(rssUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }
  });
  
  const rssXml = await rssRes.text();
  const entries = rssXml.split("<entry>").slice(1);
  console.log("RSS entries count:", entries.length);
  
  let allRecent = entries.map((entry) => {
    const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    return { id: idMatch ? idMatch[1] : "" };
  }).filter((v) => v.id !== "");
  
  console.log("allRecent count:", allRecent.length);

  const streamsUrl = `https://www.youtube.com/channel/${channelId}/streams`;
  const streamsRes = await fetch(streamsUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept-Language": "en-US,en;q=0.9"
    }
  });
  const streamsHtml = await streamsRes.text();
  console.log("streamsHtml length:", streamsHtml.length);
  
  let recentVideos = allRecent.filter(v => streamsHtml.includes(v.id));
  console.log("recentVideos length:", recentVideos.length);
}
run();
