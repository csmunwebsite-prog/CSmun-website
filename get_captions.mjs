import https from 'https';
import http from 'http';

const videos = [
  { id: 'ChzKEFkv7Dg', label: 'v1' },
  { id: 'yPOr9Xg28AU', label: 'v2' },
  { id: 'KTr4sDnE2zE', label: 'v3' },
  { id: 'lnjpnhQPrRI', label: 'v4' },
  { id: '4nOiPrbcxyM', label: 'v5' },
  { id: 'HCGKEtP3Rww', label: 'v6' },
  { id: 'GM_Dgj23ePs', label: 'v7' },
  { id: 'ddS9cCaxQiU', label: 'v8' },
  { id: 'nCxGlgpafFk', label: 'v9' },
  { id: '-TmTYMbfWEs', label: 'v11' },
  { id: 'JhRlyvPQvLQ', label: 'v12' },
  { id: 'FaP76l7BbiQ', label: 'v13' },
  { id: '5vPlnSKTruA', label: 'v14' },
  { id: 'paF5ZmsvTUY', label: 'v15' },
  { id: 'U-M-3BBRe5o', label: 'v16' },
  { id: 'EMuLbPUZblE', label: 'v17' },
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function getCaptions(videoId, label) {
  try {
    const page = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    // Find captionTracks in the page
    const match = page.match(/"captionTracks":\s*(\[.*?\])/);
    if (!match) { console.log(`=== ${label} (${videoId}) === NO CAPTIONS`); return; }
    const tracks = JSON.parse(match[1].replace(/\\u0026/g, '&'));
    if (!tracks.length) { console.log(`=== ${label} === EMPTY TRACKS`); return; }
    const url = tracks[0].baseUrl;
    const xml = await fetch(url);
    // Parse XML captions: <text start="X" dur="Y">content</text>
    const entries = [];
    const regex = /<text start="([^"]*)" dur="([^"]*)"[^>]*>(.*?)<\/text>/gs;
    let m;
    while ((m = regex.exec(xml)) !== null) {
      const start = parseFloat(m[1]);
      const text = m[3].replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\n/g,' ');
      entries.push({ start, text });
    }
    console.log(`\n=== ${label} (${videoId}) === ${entries.length} caption segments`);
    // Group into 30-second buckets
    const maxTime = entries.length ? entries[entries.length-1].start : 0;
    for (let t = 0; t <= maxTime; t += 30) {
      const bucket = entries.filter(e => e.start >= t && e.start < t + 30).map(e => e.text).join(' ');
      if (bucket.trim()) {
        const mins = Math.floor(t/60);
        const secs = t % 60;
        console.log(`  [${mins}:${String(secs).padStart(2,'0')}-${Math.floor((t+30)/60)}:${String((t+30)%60).padStart(2,'0')}] ${bucket}`);
      }
    }
  } catch(e) {
    console.log(`=== ${label} === ERROR: ${e.message}`);
  }
}

(async () => {
  for (const v of videos) {
    await getCaptions(v.id, v.label);
  }
})();
