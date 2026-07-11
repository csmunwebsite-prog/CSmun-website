import https from 'https';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  const page = await fetch('https://www.youtube.com/watch?v=ChzKEFkv7Dg');
  const match = page.match(/"captionTracks":\s*(\[.*?\])/);
  if (!match) { console.log('NO MATCH'); return; }
  const raw = match[1];
  console.log('RAW TRACKS (first 500 chars):');
  console.log(raw.substring(0, 500));
  console.log('\n---');
  const tracks = JSON.parse(raw.replace(/\\u0026/g, '&'));
  console.log('URL:', tracks[0].baseUrl);
  const xml = await fetch(tracks[0].baseUrl);
  console.log('\nXML (first 1000 chars):');
  console.log(xml.substring(0, 1000));
})();
