const channelId = 'UC5KmMLWKSyiGixXGl9J3Z8Q';

async function test() {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const rssRes = await fetch(rssUrl);
  const rssXml = await rssRes.text();
  const entries = rssXml.split("<entry>").slice(1);
  
  const recentVideos = entries.map((entry) => {
    const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
    return {
      id: idMatch ? idMatch[1] : "",
      title: titleMatch ? titleMatch[1] : "Untitled"
    };
  }).filter((v) => v.id !== "");

  const streamsRes = await fetch('https://www.youtube.com/channel/' + channelId + '/streams', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
  const streamsHtml = await streamsRes.text();

  console.log("ALL RSS VIDEOS:");
  recentVideos.forEach(v => console.log(v.id, v.title));
  
  const liveStreamVideos = recentVideos.filter(v => streamsHtml.includes(v.id));
  
  console.log("\nFILTERED LIVE STREAMS:");
  liveStreamVideos.forEach(v => console.log(v.id, v.title));
}

test();
