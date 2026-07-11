import https from 'https';

function fetch(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cookie': 'CONSENT=YES+cb.20210328-17-p0.en-GB+FX+999'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function getCaptions(videoId, label) {
  const page = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
  const match = page.match(/"captionTracks":\s*(\[.*?\])/);
  if (!match) { console.log(`=== ${label} === NO CAPTIONS`); return; }
  const tracks = JSON.parse(match[1].replace(/\\u0026/g, '&'));
  const url = tracks[0].baseUrl + '&fmt=json3';
  const json = await fetch(url);
  if (!json || json.length < 10) {
    // Try XML format with consent cookie
    const xmlUrl = tracks[0].baseUrl;
    const xml = await fetch(xmlUrl);
    if (!xml || xml.length < 10) {
      console.log(`=== ${label} === EMPTY RESPONSE (xml len: ${xml.length})`);
      return;
    }
    // Parse XML
    const entries = [];
    const re = /<text[^>]*start="([^"]*)"[^>]*>([\s\S]*?)<\/text>/g;
    let m;
    while ((m = re.exec(xml)) !== null) {
      entries.push({ t: parseFloat(m[1]), s: m[2].replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/<[^>]*>/g,'').trim() });
    }
    console.log(`=== ${label} === ${entries.length} segments (XML)`);
    for (const e of entries) {
      const m2 = Math.floor(e.t/60);
      const s2 = Math.floor(e.t%60);
      process.stdout.write(`[${m2}:${String(s2).padStart(2,'0')}] ${e.s}  `);
    }
    console.log('');
    return;
  }
  try {
    const data = JSON.parse(json);
    const events = data.events || [];
    console.log(`\n=== ${label} (${videoId}) ===`);
    for (const ev of events) {
      if (!ev.segs) continue;
      const t = (ev.tStartMs || 0) / 1000;
      const text = ev.segs.map(s => s.utf8 || '').join('').trim();
      if (!text) continue;
      const mins = Math.floor(t/60);
      const secs = Math.floor(t%60);
      process.stdout.write(`[${mins}:${String(secs).padStart(2,'0')}] ${text}  `);
    }
    console.log('');
  } catch(e) {
    console.log(`=== ${label} === PARSE ERROR: ${e.message}, response: ${json.substring(0,200)}`);
  }
}

const videos = [
  ['ChzKEFkv7Dg','v1'], ['yPOr9Xg28AU','v2'], ['KTr4sDnE2zE','v3'],
  ['lnjpnhQPrRI','v4'], ['4nOiPrbcxyM','v5'], ['HCGKEtP3Rww','v6'],
  ['GM_Dgj23ePs','v7'], ['ddS9cCaxQiU','v8'], ['nCxGlgpafFk','v9'],
  ['-TmTYMbfWEs','v11'], ['JhRlyvPQvLQ','v12'], ['FaP76l7BbiQ','v13'],
  ['5vPlnSKTruA','v14'], ['paF5ZmsvTUY','v15'], ['U-M-3BBRe5o','v16'],
  ['EMuLbPUZblE','v17']
];

(async () => {
  for (const [id, label] of videos) {
    await getCaptions(id, label);
  }
})();
