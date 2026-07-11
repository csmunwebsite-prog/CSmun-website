import https from 'https';
import fs from 'fs';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  console.log("Fetching folder page...");
  const html = await fetch('https://drive.google.com/drive/folders/1KTEOnG7U79qCpRnV3Jg9ZbwfwPaw1oCg');
  fs.writeFileSync('/Users/chendhoor/Desktop/CSmun-website/drive_response.html', html);
  console.log("Saved response. Length:", html.length);
  
  // Search for any occurrence of common image extensions or names
  const regex = /"[^"]+?\.(?:png|jpg|jpeg|pdf|webp)"/gi;
  const matches = new Set();
  let m;
  while ((m = regex.exec(html)) !== null) {
    matches.add(m[0]);
  }
  console.log("Found files:", Array.from(matches));

  // Let's also search for string arrays with file IDs or names
  // Usually looks like: [ "id", "name", ... ]
  const textMatches = [];
  const lines = html.split('\n');
  for (const line of lines) {
    if (line.includes('1KTEOnG7U79qCpRnV3Jg9ZbwfwPaw1oCg') || line.includes('Chairs') || line.includes('DISEC') || line.includes('UNGA')) {
      textMatches.push(line.substring(0, 200));
    }
  }
  console.log("Matching lines count:", textMatches.length);
  console.log(textMatches.slice(0, 10));
})();
