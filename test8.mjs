const channelId = "UC5KmMLWKSyiGixXGl9J3Z8Q";
async function run() {
    const streamsUrl = `https://www.youtube.com/channel/${channelId}/streams`;
    const streamsRes = await fetch(streamsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });

    if (streamsRes.ok) {
        const html = await streamsRes.text();
        const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
        if (match) {
            const data = JSON.parse(match[1]);
            const str = JSON.stringify(data);
            
            // extract videoId, title, published
            const regex = /"videoId":"([a-zA-Z0-9_-]{11})"[^}]*?"title":\{"runs":\[\{"text":"(.*?)"\}\][^}]*?"publishedTimeText":\{"simpleText":"(.*?)"\}/g;
            let videos = [];
            let m;
            while ((m = regex.exec(str)) !== null) {
                videos.push({
                    id: m[1],
                    title: m[2],
                    published: m[3]
                });
            }
            // De-duplicate
            const unique = [];
            const ids = new Set();
            for (const v of videos) {
                if (!ids.has(v.id)) {
                    ids.add(v.id);
                    unique.push(v);
                }
            }
            console.log("Extracted streams length:", unique.length);
            console.log(unique.slice(0, 3));
        }
    } else {
        console.log("Status:", streamsRes.status);
    }
}
run();
