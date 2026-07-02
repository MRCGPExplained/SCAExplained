// Creates compact per-station JSON files (example_explanation stripped — agents write fresh)
const fs = require('fs');
const SCRATCHPAD = 'C:/Users/Brandon Ten-Fah/AppData/Local/Temp/claude/C--Users-Brandon-Ten-Fah-OneDrive-Desktop-SCA-Explained/c7adc2c7-d4c9-438d-a0e7-acea4cf121bf/scratchpad';

const all = JSON.parse(fs.readFileSync(`${SCRATCHPAD}/stations-structured.json`, 'utf8'));

let maxSize = 0;
for (const s of all) {
  const { example_explanation, key_takeaways, ...compact } = s; // agents write both from scratch
  const num = String(s.number).padStart(3, '0');
  const json = JSON.stringify(compact);
  fs.writeFileSync(`${SCRATCHPAD}/sc${num}.json`, json, 'utf8');
  if (json.length > maxSize) maxSize = json.length;
}

console.log(`Created ${all.length} compact files. Largest: ${maxSize} bytes.`);
const sizes = all.map(s => {
  const {example_explanation, ...c} = s;
  return { num: s.number, size: JSON.stringify(c).length };
}).sort((a,b) => b.size - a.size);
console.log('Top 5:', sizes.slice(0,5).map(x => `s${x.num}: ${x.size}b`).join(', '));
