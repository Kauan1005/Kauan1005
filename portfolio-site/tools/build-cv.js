// Gera o currículo em .docx (PT e EN) a partir de cv-content.js.
// Uso: node build-cv.js <pasta de saída>
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, ExternalHyperlink, AlignmentType,
  LevelFormat, TabStopType, BorderStyle,
} = require('docx');
const { contact, pt, en } = require('./cv-content');

const OUT = process.argv[2] || path.join(__dirname, '..', 'curriculo');
const PREVIEW = process.env.CV_PREVIEW === '1';
fs.mkdirSync(OUT, { recursive: true });

const FONT = 'Calibri';
const INK = '1A1A1A';
const ACCENT = '1F3A5F';
const MUTED = '4A4A4A';
const PAGE_W = 11906; // A4
const MARGIN = 660;
const CONTENT_W = PAGE_W - MARGIN * 2;
const SZ = 19;        // 9,5 pt
const LINE = 246;     // entrelinha ~1,03

const run = (text, o = {}) => new TextRun({ text, font: FONT, size: SZ, color: INK, ...o });
const link = (label, url, o = {}) => new ExternalHyperlink({
  link: url,
  children: [run(label, { color: ACCENT, ...o })],
});
const urlOf = (s) => (s.startsWith('http') ? s : `https://${s}`);
const isPlaceholder = (s) => /^\[.*\]$/.test(s);

function heading(text) {
  return new Paragraph({
    spacing: { before: 140, after: 60, line: LINE },
    keepNext: true,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 2 } },
    children: [run(text.toUpperCase(), { bold: true, color: ACCENT, size: 21, characterSpacing: 10 })],
  });
}

function bullet(text) {
  // Placeholders entre colchetes ficam em itálico para serem fáceis de achar e trocar.
  const m = text.match(/^(.*?)(\s*\[[^\]]+\])?$/);
  const children = [run(m[1])];
  if (m[2] && !PREVIEW) children.push(run(m[2], { italics: true, color: 'B00020' }));
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 30, line: LINE },
    children,
  });
}

function rowWithDate(leftRuns, right) {
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }],
    spacing: { before: 80, after: 30, line: LINE },
    keepNext: true,
    children: [...leftRuns, run(`\t${right}`, { color: MUTED })],
  });
}

function build(L) {
  const sep = () => run('  ·  ', { color: MUTED });
  const contactLine = [
    run(contact.city), sep(), run(contact.phone), sep(),
    link(contact.email, `mailto:${contact.email}`), sep(),
    link(contact.linkedin, urlOf(contact.linkedin)), sep(),
    link(contact.github, urlOf(contact.github)), sep(),
    link(contact.portfolio, urlOf(contact.portfolio)),
  ];

  const children = [
    new Paragraph({
      spacing: { after: 20 },
      children: [run(contact.name, { bold: true, size: 36, color: INK })],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [run(L.title, { size: 24, color: ACCENT, bold: true })],
    }),
    new Paragraph({ spacing: { after: 60 }, children: contactLine }),

    heading(L.h.summary),
    new Paragraph({ spacing: { after: 20, line: LINE }, alignment: AlignmentType.LEFT, children: [run(L.summary)] }),

    heading(L.h.exp),
  ];

  for (const e of L.exp) {
    children.push(rowWithDate([run(e.role, { bold: true }), run(` — ${e.org}`)], e.period));
    e.bullets.forEach((b) => children.push(bullet(b)));
  }

  children.push(heading(L.h.projects));
  for (const p of L.projects) {
    children.push(rowWithDate([run(p.name, { bold: true }), run(` — ${p.what}`)], p.tag));
    const meta = [];
    p.links.forEach((l, i) => {
      if (i) meta.push(run(' · ', { color: MUTED }));
      meta.push(link(l, urlOf(l)));
    });
    meta.push(run('  |  ', { color: MUTED }), run(p.stack, { italics: true, color: MUTED }));
    children.push(new Paragraph({ spacing: { after: 30, line: LINE }, keepNext: true, children: meta }));
    p.bullets.forEach((b) => children.push(bullet(b)));
  }

  children.push(heading(L.h.skills));
  for (const [k, v] of [...L.skills, [L.h.lang, L.lang]]) {
    children.push(new Paragraph({
      spacing: { after: 30, line: LINE },
      children: [run(`${k}: `, { bold: true }), run(v)],
    }));
  }

  children.push(heading(L.h.edu));
  for (const [course, school, when] of L.edu) {
    children.push(rowWithDate([run(course, { bold: true }), run(` — ${school}`)], when));
  }

  return new Document({
    creator: contact.name,
    title: `${contact.name} — ${L.title}`,
    description: L.title,
    styles: { default: { document: { run: { font: FONT, size: SZ, color: INK } } } },
    numbering: {
      config: [{
        reference: 'bullets',
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 300, hanging: 220 } } },
        }],
      }],
    },
    sections: [{
      properties: {
        page: {
          size: { width: PAGE_W, height: 16838 },
          margin: { top: 440, bottom: 440, left: MARGIN, right: MARGIN },
        },
      },
      children,
    }],
  });
}

(async () => {
  for (const L of [pt, en]) {
    const buf = await Packer.toBuffer(build(L));
    const file = path.join(OUT, `${L.file}.docx`);
    fs.writeFileSync(file, buf);
    console.log('ok', file);
  }
  if (isPlaceholder(contact.portfolio)) console.log('aviso: link do portfólio ainda é placeholder');
})();
