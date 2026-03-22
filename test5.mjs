const channelId = 'UC5KmMLWKSyiGixXGl9J3Z8Q';
async function run() {
  const rssXml = await fetch('https://www.youtube.com/feeds/videos.xml?channel_id=' + channelId).then(r => r.text());
  const entries = rssXml.split('<entry>').slice(1);
  const allRecent = entries.map(entry => {
    const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    return idMatch ? idMatch[1] : '';
  });
  
  console.log('allRecent (first 3):', allRecent.slice(0, 3));
  
  const streamsHtml = await fetch('https://www.youtube.com/channel/' + channelId + '/streams', { headers: { 'User-Agent': 'Mozilla/5.0' } }).then(r => r.text());
  
  console.log('streamsHtml length:', streamsHtml.length);
  
  if (allRecent.length > 0) {
    const p1 = allRecent[0];
    console.log(`Does streamsHtml include ${p1}?`, streamsHtml.includes(p1));
  }
}
run();
