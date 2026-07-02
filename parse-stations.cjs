// parse-stations.cjs
// Splits booklet.txt into one JSON object per station
const fs = require('fs');

const raw = fs.readFileSync(
  'C:/Users/Brandon Ten-Fah/AppData/Local/Temp/claude/C--Users-Brandon-Ten-Fah-OneDrive-Desktop-SCA-Explained/c7adc2c7-d4c9-438d-a0e7-acea4cf121bf/scratchpad/booklet2.txt',
  'utf8'
);

// Normalise line endings
const lines = raw.replace(/\r\n/g, '\n').split('\n');

// Find every line that starts a new station
// e.g. "Station 1 - Video Consultation" or "Station 2 Telephone Consultation"
const STATION_RE = /^Station\s+(\d+)\s*[-:–—]?\s*(Video Consultation|Telephone Consultation)/i;

// A real station header is followed (within 60 lines) by patient/caller info
// Some stations use "Patient's name:", some "Name:", some "Caller:"
const CONTENT_RE = /(patient.{0,5}(name|story)|\bName:\s|\bCaller:\s)/i;
const stationStarts = [];
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].trim().match(STATION_RE);
  if (m) {
    const lookahead = lines.slice(i + 1, i + 61).join('\n');
    if (CONTENT_RE.test(lookahead)) {
      stationStarts.push({ lineIdx: i, num: parseInt(m[1], 10), type: m[2] });
    }
  }
}

console.error(`Found ${stationStarts.length} station headers`);

const stations = [];
for (let s = 0; s < stationStarts.length; s++) {
  const start = stationStarts[s].lineIdx;
  const end = s + 1 < stationStarts.length ? stationStarts[s + 1].lineIdx : lines.length;
  const block = lines.slice(start, end).join('\n');
  stations.push({
    number: stationStarts[s].num,
    consultation_type: stationStarts[s].type.trim(),
    raw: block,
  });
}

// Write output
const outPath = process.argv[2] || 'C:/Users/Brandon Ten-Fah/AppData/Local/Temp/claude/C--Users-Brandon-Ten-Fah-OneDrive-Desktop-SCA-Explained/c7adc2c7-d4c9-438d-a0e7-acea4cf121bf/scratchpad/stations-raw.json';
fs.writeFileSync(outPath, JSON.stringify(stations, null, 0));
console.error(`Wrote ${stations.length} stations to ${outPath}`);

// Print a summary of the first 3 to stdout
stations.slice(0, 2).forEach(s => {
  console.log(`\n=== STATION ${s.number} (${s.consultation_type}) ===`);
  console.log(s.raw.substring(0, 400));
  console.log('...');
});
