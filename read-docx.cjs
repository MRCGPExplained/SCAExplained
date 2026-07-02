const mammoth = require('mammoth');
const fs = require('fs');

const docxPath = "C:/Users/Brandon Ten-Fah/OneDrive/Desktop/NATIVE_246_CASES_MOCK_BOOKLET_Plain_Text.docx";

mammoth.extractRawText({ path: docxPath }).then(result => {
  process.stdout.write(result.value);
}).catch(e => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
