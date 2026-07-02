// extract-sections.cjs
// Parses raw station text into structured fields
const fs = require('fs');

const raw = JSON.parse(fs.readFileSync(
  'C:/Users/Brandon Ten-Fah/AppData/Local/Temp/claude/C--Users-Brandon-Ten-Fah-OneDrive-Desktop-SCA-Explained/c7adc2c7-d4c9-438d-a0e7-acea4cf121bf/scratchpad/stations-raw.json', 'utf8'
));

// Parse titles from TOC (stored in the raw JSON as the FIRST station entry for each number)
// The TOC entries look like: "Station N - Video Consultation - Some Title\n17\n"
const bookletTxt = fs.readFileSync(
  'C:/Users/Brandon Ten-Fah/AppData/Local/Temp/claude/C--Users-Brandon-Ten-Fah-OneDrive-Desktop-SCA-Explained/c7adc2c7-d4c9-438d-a0e7-acea4cf121bf/scratchpad/booklet2.txt', 'utf8'
);

const TOC_TITLE_RE = /Station\s+(\d+)\s*[-–—:]?\s*(?:Video Consultation|Telephone Consultation)\s*[-–—]\s*([^\n]+)/gi;
const titleMap = {};
let tm;
while ((tm = TOC_TITLE_RE.exec(bookletTxt)) !== null) {
  const num = parseInt(tm[1], 10);
  const title = tm[2].trim().replace(/\s+/g, ' ');
  if (!titleMap[num] && title.length > 3) titleMap[num] = title;
}

// Subject mapping from the booklet's System-Based Table of Contents
const SUBJECT_MAP = {
  Cardiology: [42,52,58,118,121,139,141,167,194,199,203,219,225,227,229,232],
  Dermatology: [8,20,69,89,90,105,119,128,138,145,156,193,213,231,244],
  'Elderly Medicine & Palliative Care': [4,17,28,33,47,63,73,85,97,131,132,148,161,162,186,196,245],
  'Endocrine & Nephrology': [6,7,11,15,23,48,70,86,110,116,120,133,149,153,171,176,177,190,209,215,216],
  'ENT & Eye': [3,30,82,99,108,166,174,189,192,202,235],
  Ethics: [18,25,32,43,55,66,80,88,91,112,117,150,178,210,214,220,242],
  'Gastroenterology & Haematology': [2,16,29,35,45,54,60,65,78,87,103,127,134,144,146,152,159,195,200,218,223,226,237,238],
  Genetics: [12,103,115],
  "Gynaecology & Women's Health": [1,22,40,50,59,75,79,94,140,143,154,172,180,188,205,236,239,240,241],
  "Men's Health": [51,77,98,104,109,191],
  'Mental Health': [9,10,14,26,49,53,84,93,96,102,125,142,151,163,164,165,170,187,217,221,222],
  Neurology: [44,57,62,64,92,114,158,160,224,228,243,246],
  Paediatrics: [36,76,83,106,107,136,155,184,198,233],
  Respiratory: [5,24,37,41,71,74,100,113,122,124,129,137,181,230,234],
  'Rheumatology & Musculoskeletal': [39,56,81,95,130,173,175,182,183,212],
  'Travel Health & Infectious Disease': [13,72,179,197],
};

function getSubject(num) {
  for (const [subj, nums] of Object.entries(SUBJECT_MAP)) {
    if (nums.includes(num)) return subj;
  }
  return 'General Practice'; // fallback
}

function cleanLines(text) {
  return text.split('\n')
    .map(l => l.trim())
    .filter(l => l && !/^\d+$/.test(l) && l !== '•');
}

function extractBullets(text) {
  // Join continuation lines (lines that don't start with •/- and follow a bullet)
  const raw = cleanLines(text);
  const bullets = [];
  let current = '';
  for (const line of raw) {
    if (line.startsWith('•') || line.startsWith('-')) {
      if (current) bullets.push(current.trim());
      current = line.replace(/^[•\-]\s*/, '').trim();
    } else if (current) {
      current += ' ' + line;
    }
  }
  if (current) bullets.push(current.trim());
  return bullets.filter(Boolean);
}

function between(text, startRe, endRe) {
  const startM = startRe.exec(text);
  if (!startM) return '';
  const sub = text.slice(startM.index + startM[0].length);
  if (!endRe) return sub;
  const endM = endRe.exec(sub);
  return endM ? sub.slice(0, endM.index) : sub;
}

function parseStation(s) {
  const t = s.raw;

  // Title: from TOC map
  const title = titleMap[s.number] || `Station ${s.number}`;

  // Patient name - matches "Patient's name:", "Patient name:", "Name:"
  const nameM = t.match(/(?:Patient[''’]?s?\s*name|(?:^|\n)\s*Name)\s*:\s*([^\n]+)/im);
  const patientName = nameM ? nameM[1].trim() : '';

  // Age
  const ageM = t.match(/Age:\s*([^\n]+)/i);
  const patientAge = ageM ? ageM[1].trim() : '';

  // PMH
  const pmhBlock = between(t, /Past\s+(?:Medical\s+)?[Hh]istory[\s\S]{0,10}?\n/, /Drug\s+and\s+Allerg/i);
  const pmh = extractBullets(pmhBlock);

  // Drug/allergy
  const drugBlock = between(t, /Drug\s+and\s+Allerg[^\n]*\n/i, /Recent\s+Notes|Reason\s+for\s+Consult/i);
  const drugAllergy = extractBullets(drugBlock);

  // Recent notes
  const notesBlock = between(t, /Recent\s+Notes?[^\n]*\n/i, /Reason\s+for\s+Consult/i);
  const recentNotes = cleanLines(notesBlock).filter(l => !l.startsWith('•') && !l.startsWith('-')).join(' ').trim() || null;

  // Reason
  const reasonM = t.match(/Reason\s+for\s+Consultation\s*:\s*(.*?)(?=\n\s*\n|Patient.s Story|$)/is);
  const reasonForConsultation = reasonM ? reasonM[1].replace(/\n/g, ' ').trim() : '';

  // Opening statement
  const openM = t.match(/Opening\s+Statement\s*:\s*([\s\S]*?)(?=If\s+Asked?\s+to\s+Explain|ONLY\s+SAY|Social\s+History|Ideas?:|Concerns?:|$)/i);
  const openingStatement = openM ? openM[1].replace(/\n/g, ' ').trim() : '';

  // If asked further
  const ifAskedM = t.match(/If\s+[Aa]sked?\s+to\s+[Ee]xplain\s+[Ff]urther\s*:\s*([\s\S]*?)(?=ONLY\s+SAY|Social\s+History|Ideas?:|$)/i);
  const ifAskedFurther = ifAskedM ? ifAskedM[1].replace(/\n/g, ' ').trim() : '';

  // Only if asked block
  const onlyBlock = between(t, /ONLY\s+SAY\s+BELOW\s+IF\s+ASKED\s*[:.]?\s*\n/i, /Social\s+History|Ideas?:|Concerns?:|Marking\s+Scheme/i);
  const onlyIfAsked = cleanLines(onlyBlock).filter(l => !l.startsWith('•') ? l.length > 10 : true)
    .map(l => l.replace(/^[•\-]\s*/, '').trim()).filter(Boolean);

  // Social history
  const socM = t.match(/Social\s+History\s*:\s*([\s\S]*?)(?=Ideas?:|Concerns?:|Expectations?:|Question\s+for|Say\s+NO|Accept\s+any|Marking|$)/i);
  const socialHistory = socM ? socM[1].replace(/\n/g, ' ').trim() : '';

  // ICE
  const ideaM = t.match(/Ideas?\s*:\s*([\s\S]*?)(?=Concerns?:|$)/i);
  const iceIdeas = ideaM ? ideaM[1].replace(/\n/g, ' ').trim() : '';

  const concernM = t.match(/Concerns?\s*:\s*([\s\S]*?)(?=Expectations?:|$)/i);
  const iceConcerns = concernM ? concernM[1].replace(/\n/g, ' ').trim() : '';

  const expectM = t.match(/Expectations?\s*:\s*([\s\S]*?)(?=If\s+the\s+doctor|Question\s+for|Say\s+NO|Accept\s+any|Marking|$)/i);
  const iceExpectations = expectM ? expectM[1].replace(/\n/g, ' ').trim() : '';

  // Scenarios ("If the doctor suggests...")
  const scenarioLines = [];
  const scenRe = /If\s+the\s+(?:doctor|GP)\s+(?:suggests?|recommends?|offers?|asks?)[^\n]*/gi;
  let m;
  // Only from Patient's Story section to Marking Scheme
  const storyBlock = between(t, /Patient.s\s+Story|Role\s+Player.s\s+Brief/i, /Marking\s+Scheme/i);
  while ((m = scenRe.exec(storyBlock)) !== null) {
    const lines = storyBlock.slice(m.index).split('\n').slice(0, 5).join(' ').trim();
    if (lines.length > 10) scenarioLines.push(lines.substring(0, 300));
  }
  const scenarios = [...new Set(scenarioLines)];

  // Question for doctor
  const qM = t.match(/Question\s+for\s+the\s+Doctor\s*:\s*([\s\S]*?)(?=Say\s+NO|Accept\s+any|Role\s+[Pp]layer|Marking|$)/i);
  const questionRaw = qM ? extractBullets(qM[1]).join('. ') : null;
  const questionForDoctor = questionRaw && questionRaw.length > 3 ? questionRaw : null;

  // Role player instruction
  const roleM = t.match(/(Say\s+NO\s+to\s+any[^\n]*|Accept\s+anything[^\n]*)[^\n]*/i);
  const rolePlayerInstruction = roleM ? roleM[0].trim() : null;

  // Data gathering
  const dgBlock = between(t, /Data\s+Gathering\s+and\s+Diagnosis\s*\n/i, /\n\s*Management\b|\n\s*Example\s+of/i);
  const dataGathering = extractBullets(dgBlock);

  // Management
  const mgmtBlock = between(t, /^\s*Management\s*\n/im, /Example\s+of\s+[Ee]xplanation|Learning\s+Point/i);
  const management = extractBullets(mgmtBlock);

  // Example explanation
  const exBlock = between(t, /Example\s+of\s+[Ee]xplanation[^\n]*\n/i, /Learning\s+Point|Further\s+Reading|\n\s*\n\s*\n\s*\n\s*\d+\s*\n/);
  const exampleExplanation = cleanLines(exBlock).join('\n').trim();

  // Key takeaways (Learning Point) - stop before general guide or further reading
  const lpBlock = between(t, /Learning\s+Point[^\n]*\n/i, /Further\s+Reading|General\s+guide|Refer\s+the\s+patient|https?:\/\//i);
  const lpText = cleanLines(lpBlock).join(' ').trim();
  const keyTakeaways = lpText.length > 20
    ? lpText.split(/\.\s+/).map(s => s.trim()).filter(s => s.length > 15).map(s => s.endsWith('.') ? s : s + '.')
    : [];

  return {
    number: s.number,
    title: title || `Station ${s.number}`,
    subject: getSubject(s.number),
    consultation_type: s.consultation_type,
    published: false,
    patient_name: patientName,
    patient_age: patientAge,
    pmh,
    drug_allergy: drugAllergy,
    recent_notes: recentNotes,
    reason_for_consultation: reasonForConsultation,
    opening_statement: openingStatement,
    if_asked_further: ifAskedFurther,
    only_if_asked: onlyIfAsked,
    social_history: socialHistory,
    ice_ideas: iceIdeas,
    ice_concerns: iceConcerns,
    ice_expectations: iceExpectations,
    scenarios,
    question_for_doctor: questionForDoctor,
    role_player_instruction: rolePlayerInstruction,
    data_gathering: dataGathering,
    management,
    example_explanation: exampleExplanation,
    key_takeaways: keyTakeaways,
    editor_video_url: null,
  };
}

const structured = raw.map(parseStation);

const outPath = 'C:/Users/Brandon Ten-Fah/AppData/Local/Temp/claude/C--Users-Brandon-Ten-Fah-OneDrive-Desktop-SCA-Explained/c7adc2c7-d4c9-438d-a0e7-acea4cf121bf/scratchpad/stations-structured.json';
fs.writeFileSync(outPath, JSON.stringify(structured, null, 2), 'utf8');
console.error(`Wrote ${structured.length} structured stations`);

// Show station 1 as a sample
const s1 = structured.find(s => s.number === 1);
console.log(JSON.stringify(s1, null, 2));
