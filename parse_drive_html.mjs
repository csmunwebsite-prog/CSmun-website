import fs from 'fs';

const content = fs.readFileSync('/Users/chendhoor/.gemini/antigravity-ide/brain/a7660d45-6441-4cac-aef3-370487513c17/.system_generated/steps/227/content.md', 'utf8');

// Look for patterns like ["id", "name", ...] or common file types (png, jpg, jpeg)
const regex = /"[^"]+?\.(png|jpg|jpeg|pdf|webp)"/gi;
const matches = new Set();
let m;
while ((m = regex.exec(content)) !== null) {
  matches.add(m[0]);
}

console.log("Found files matching regex:");
console.log(Array.from(matches));

// Also let's print any potential script contents that look like file/folder arrays
const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let scriptIndex = 0;
while ((match = scriptRegex.exec(content)) !== null) {
  const scriptContent = match[1];
  if (scriptContent.includes('UNSC') || scriptContent.includes('Chairs') || scriptContent.includes('DISEC') || scriptContent.includes('UNGA') || scriptContent.includes('UNHRC') || scriptContent.includes('Chair')) {
    console.log(`Script ${scriptIndex} matches keyword. Length:`, scriptContent.length);
    console.log(scriptContent.substring(0, 1000));
  }
  scriptIndex++;
}
