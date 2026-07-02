const mammoth = require('mammoth');
const fs = require('fs');

const OUT = 'C:/Users/Brandon Ten-Fah/AppData/Local/Temp/claude/C--Users-Brandon-Ten-Fah-OneDrive-Desktop-SCA-Explained/c7adc2c7-d4c9-438d-a0e7-acea4cf121bf/scratchpad/booklet2.txt';

mammoth.extractRawText({
  path: 'C:/Users/Brandon Ten-Fah/OneDrive/Desktop/NATIVE_246_CASES_MOCK_BOOKLET_Plain_Text.docx'
}).then(result => {
  fs.writeFileSync(OUT, result.value, 'utf8');
  console.log('Written', result.value.length, 'chars');
}).catch(e => { console.error(e.message); process.exit(1); });
