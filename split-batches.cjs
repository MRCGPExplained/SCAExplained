// split-batches.cjs — splits stations-structured.json into minified batch files
const fs = require('fs');
const SCRATCHPAD = 'C:/Users/Brandon Ten-Fah/AppData/Local/Temp/claude/C--Users-Brandon-Ten-Fah-OneDrive-Desktop-SCA-Explained/c7adc2c7-d4c9-438d-a0e7-acea4cf121bf/scratchpad';

const all = JSON.parse(fs.readFileSync(`${SCRATCHPAD}/stations-structured.json`, 'utf8'));
const BATCH_SIZE = 12;
let batchNum = 1;
const batchMeta = [];

for (let i = 0; i < all.length; i += BATCH_SIZE) {
  const slice = all.slice(i, i + BATCH_SIZE);
  const nums = slice.map(s => s.number);
  const fname = `${SCRATCHPAD}/sbatch_${batchNum}.json`;
  fs.writeFileSync(fname, JSON.stringify(slice), 'utf8'); // minified
  const size = fs.statSync(fname).size;
  batchMeta.push({ batchNum, start: nums[0], end: nums[nums.length - 1], count: slice.length, size, fname });
  console.log(`Batch ${batchNum}: stations ${nums[0]}-${nums[nums.length-1]} (${slice.length} stations, ${size} bytes)`);
  batchNum++;
}

fs.writeFileSync(`${SCRATCHPAD}/batch_meta.json`, JSON.stringify(batchMeta, null, 2), 'utf8');
console.log(`\nCreated ${batchNum - 1} batch files`);
