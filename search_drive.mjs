import fs from 'fs';
const html = fs.readFileSync('/Users/chendhoor/.gemini/antigravity-ide/brain/a7660d45-6441-4cac-aef3-370487513c17/.system_generated/steps/227/content.md', 'utf8');

// Search for any matches of drive item names
// Usually Google Drive embeds data in window.initData or similar JSON structures
const matches = [];
const regex = /"[^"]*?\.(?:png|jpg|jpeg|pdf)"/gi;
let m;
while ((m = regex.exec(html)) !== null) {
  matches.push(m[0]);
}
console.log('Matches count:', matches.length);
console.log(matches.slice(0, 50));
