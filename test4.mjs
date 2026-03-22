const channelId = 'UC5KmMLWKSyiGixXGl9J3Z8Q';
fetch('https://www.youtube.com/feeds/videos.xml?channel_id=' + channelId)
  .then(res => res.text())
  .then(xml => {
    console.log('Includes <entry>?:', xml.includes('<entry>'));
    console.log('Split length:', xml.split('<entry>').length);
  });
