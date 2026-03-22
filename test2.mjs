const channelId = 'UC5KmMLWKSyiGixXGl9J3Z8Q';
async function run() {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const rssRes = await fetch(rssUrl);
  const rssXml = await rssRes.text();
  console.log('RSS length:', rssXml.length);
  const entries = rssXml.split("<entry>").slice(1);
  const allRecent = entries.map(entry => {
    const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    return idMatch ? idMatch[1] : '';
  });
  console.log('allRecent IDs:', allRecent);
  
  const streamsUrl = `https://www.youtube.com/channel/${channelId}/streams`;
  const streamsRes = await fetch(streamsUrl, { 
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'Accept-Language': 'en-US,en;q=0.9' } 
  });
  const streamsHtml = await streamsRes.text();
  
  const filtered = allRecent.filter(id => streamsHtml.includes(id));
  console.log('filtered IDs:', filtered);
}
run();
