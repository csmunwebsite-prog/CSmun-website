import fs from 'fs';

const content = fs.readFileSync('/Users/chendhoor/.gemini/antigravity-ide/brain/a7660d45-6441-4cac-aef3-370487513c17/.system_generated/steps/268/content.md', 'utf8');

// check if signin is in base href
console.log("Includes signin:", content.includes('signin') || content.includes('AccountsSignInUi'));

// look for "DISEC", "UNSC", "UNGA", "UNHRC", "SOCHUM", or "WTO"
const keywords = ['DISEC', 'UNSC', 'UNGA', 'UNHRC', 'SOCHUM', 'WTO', 'UNEP', 'HRC', 'SC'];
for (const kw of keywords) {
  if (content.toLowerCase().includes(kw.toLowerCase())) {
    console.log(`Found keyword: ${kw}`);
  }
}

// print first 500 chars of body
const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (bodyMatch) {
  console.log("Body preview:");
  console.log(bodyMatch[1].substring(0, 1000));
}
