const channelId = "UC5KmMLWKSyiGixXGl9J3Z8Q";
async function run() {
    const streamsUrl = `https://www.youtube.com/channel/${channelId}/streams`;
    const streamsRes = await fetch(streamsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });

    if (streamsRes.ok) {
        const html = await streamsRes.text();
        const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
        if (match) {
            const data = JSON.parse(match[1]);
            const results = [];
            
            function findVideos(obj) {
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
            const unique = [];
            const ids = new Set();
            for (const v of results) {
                if (!ids.has(v.id)) {
                    ids.add(v.id);
                    unique.push(v);
                }
            }
            console.log("Extracted streams length:", unique.length);
            console.log(unique.slice(0, 5));
        }
    }
}
run();
