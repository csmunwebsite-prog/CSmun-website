import https from 'https';

function fetch(url, cookie) {
  return new Promise((resolve, reject) => {
    const opts = { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' } };
    if (cookie) opts.headers['Cookie'] = cookie;
    https.get(url, opts, (res) => {
      let data = '';
      // Capture set-cookie headers
      const cookies = res.headers['set-cookie'] || [];
      res.on('data', c => data += c);
      res.on('end', () => resolve({ data, cookies, status: res.statusCode }));
    }).on('error', reject);
  });
}

(async () => {
  // First get cookies from the watch page
  const pageRes = await fetch('https://www.youtube.com/watch?v=ChzKEFkv7Dg');
  const cookieStr = pageRes.cookies.map(c => c.split(';')[0]).join('; ');
  console.log('Cookies:', cookieStr.substring(0, 200));
  
  const match = pageRes.data.match(/"captionTracks":\s*(\[.*?\])/);
  if (!match) { console.log('NO MATCH'); return; }
  const tracks = JSON.parse(match[1].replace(/\\u0026/g, '&'));
  let url = tracks[0].baseUrl;
  // Try json3 format
  url += '&fmt=json3';
  console.log('\nFetching with cookies and fmt=json3...');
  const capRes = await fetch(url, cookieStr);
  console.log('Status:', capRes.status);
  console.log('Response length:', capRes.data.length);
  console.log('First 800 chars:', capRes.data.substring(0, 800));
})();
