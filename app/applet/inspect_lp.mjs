import fs from 'fs';

const content = fs.readFileSync('src/data/landingPageBase64.ts', 'utf8');
const match = content.match(/export const LP = '([^']+)';/);
if (match) {
  let decoded = Buffer.from(match[1], 'base64').toString('utf8');
  console.log('Decoded HTML snippet around menu / header / mobile:');
  const index = decoded.indexOf('id="lp-nav-menu"');
  if (index !== -1) {
    console.log(decoded.slice(index - 200, index + 800));
  } else {
    // search for mobile-menu or similar
    const mobIndex = decoded.indexOf('mobile');
    console.log('Mobile snippet index:', mobIndex);
    if (mobIndex !== -1) {
      console.log(decoded.slice(mobIndex - 100, mobIndex + 600));
    }
  }
}
