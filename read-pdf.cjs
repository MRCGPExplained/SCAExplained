const { PDFParse } = require('pdf-parse');
const fs = require('fs');

const pdfPath = "C:/Users/Brandon Ten-Fah/OneDrive/Desktop/NATIVE 246 CASES MOCK BOOKLET - Updated April 2026.pdf";
const buf = fs.readFileSync(pdfPath);

const startPage = parseInt(process.argv[2] || '1', 10);
const numPages  = parseInt(process.argv[3] || '5', 10);

const parser = new PDFParse({ data: new Uint8Array(buf) });

async function run() {
  await parser.load();
  const info = await parser.getInfo();
  process.stdout.write("TOTAL_PAGES=" + info.pages + "\n");

  for (let pg = startPage; pg < startPage + numPages && pg <= info.pages; pg++) {
    const text = await parser.getPageText(pg);
    process.stdout.write("=== PAGE " + pg + " ===\n");
    process.stdout.write(text + "\n");
  }
}

run().catch(e => { console.error("ERROR:", e.message); process.exit(1); });
