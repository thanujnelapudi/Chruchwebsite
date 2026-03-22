const channelId = "UC5KmMLWKSyiGixXGl9J3Z8Q";
async function run() {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const rssRes = await fetch(rssUrl);
    
  if (rssRes.ok) {
    const rssXml = await rssRes.text();
    const entries = rssXml.split("<entry>").slice(1);
    console.log("RSS fetched, entries found:", entries.length);
    
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

    if (streamsRes.ok) {
        const streamsHtml = await streamsRes.text();
        console.log("streamsHtml length:", streamsHtml.length);
        const filtered = allRecent.filter(v => streamsHtml.includes(v.id));
        console.log("recentVideos length:", filtered.length);
        if (filtered.length === 0) {
            console.log("Why empty? Let's check first ID:", allRecent[0].id);
            console.log("streamsHtml includes it?", streamsHtml.includes(allRecent[0].id));
            if (!streamsHtml.includes(allRecent[0].id)) {
                console.log("Wait, is it in the HTML at all?");
                console.log(streamsHtml.substring(0, 500));
            }
        }
    }
  }
}
run();
