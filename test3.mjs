const channelId = 'UC5KmMLWKSyiGixXGl9J3Z8Q';
async function run() {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const rssRes = await fetch(rssUrl);
  const rssXml = await rssRes.text();
  console.log(rssXml);
}
run();
