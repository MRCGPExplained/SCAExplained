const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/Users/Brandon Ten-Fah/AppData/Local/Temp/claude/C--Users-Brandon-Ten-Fah-OneDrive-Desktop-SCA-Explained/c7adc2c7-d4c9-438d-a0e7-acea4cf121bf/scratchpad/stations-raw.json', 'utf8'));

const batch = parseInt(process.argv[2] || '1', 10);
const size = 5; // 5 stations per batch for readability
const start = (batch - 1) * size + 1;
const end = start + size - 1;

const stations = data.filter(s => s.number >= start && s.number <= end).sort((a,b)=>a.number-b.number);
for (const s of stations) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`STATION ${s.number} | ${s.consultation_type}`);
  console.log(`${'='.repeat(80)}`);
  console.log(s.raw);
}
