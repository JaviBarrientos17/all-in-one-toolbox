import { JSDOM } from 'jsdom';
import * as yaml from 'js-yaml';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Set up Virtual DOM for Node
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.DOMParser = dom.window.DOMParser;
global.XMLSerializer = dom.window.XMLSerializer;
global.Node = dom.window.Node;

// --- UTILITIES UNDER TEST (Copied from DocumentTools.tsx and PDFTools.tsx) ---

function jsonToXml(obj, rootName = 'root') {
  const jsonToXmlHelper = (val) => {
    if (typeof val === 'object' && val !== null) {
      if (Array.isArray(val)) {
        return val.map(item => `<item>${jsonToXmlHelper(item)}</item>`).join('');
      }
      return Object.entries(val)
        .map(([k, v]) => {
          const cleanKey = k.replace(/^@/, '');
          return `<${cleanKey}>${jsonToXmlHelper(v)}</${cleanKey}>`;
        })
        .join('');
    }
    return String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };
  return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${jsonToXmlHelper(obj)}\n</${rootName}>`;
}

function xmlToObj(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue?.trim() || "";
  }
  
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }
  
  const element = node;
  const obj = {};
  
  // Attributes
  if (element.attributes.length > 0) {
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      obj[`@${attr.name}`] = attr.value;
    }
  }
  
  // Children
  let hasElementChildren = false;
  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i];
    if (child.nodeType === Node.ELEMENT_NODE) {
      hasElementChildren = true;
      const childName = child.nodeName;
      const childVal = xmlToObj(child);
      
      if (obj[childName] === undefined) {
        obj[childName] = childVal;
      } else {
        if (!Array.isArray(obj[childName])) {
          obj[childName] = [obj[childName]];
        }
        obj[childName].push(childVal);
      }
    }
  }
  
  if (!hasElementChildren) {
    const textContent = element.textContent?.trim() || "";
    if (Object.keys(obj).length === 0) {
      return textContent;
    } else {
      obj["text"] = textContent;
    }
  }
  
  return obj;
}

// Markdown parsing test logic
function parseMdToHtml(text) {
  const lines = text.split('\n');
  let htmlContent = '';
  let inList = false;
  let inCodeBlock = false;

  for (let line of lines) {
    line = line.trim();

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        htmlContent += '</code></pre>\n';
        inCodeBlock = false;
      } else {
        htmlContent += '<pre class="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm font-mono my-3 border border-slate-200 dark:border-slate-800"><code class="text-slate-800 dark:text-slate-200">';
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      htmlContent += escaped + '\n';
      continue;
    }

    if (line.startsWith('# ')) {
      htmlContent += `<h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mt-6 mb-3">${line.substring(2)}</h1>\n`;
      continue;
    } else if (line.startsWith('## ')) {
      htmlContent += `<h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-5 mb-2">${line.substring(3)}</h2>\n`;
      continue;
    } else if (line.startsWith('### ')) {
      htmlContent += `<h3 class="text-xl font-semibold text-slate-900 dark:text-slate-200 mt-4 mb-2">${line.substring(4)}</h3>\n`;
      continue;
    }

    if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!inList) {
        htmlContent += '<ul class="list-disc pl-6 my-3 space-y-1 text-slate-700 dark:text-slate-300">\n';
        inList = true;
      }
      let itemText = line.substring(2);
      itemText = itemText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      itemText = itemText.replace(/\*(.*?)\*/g, '<em>$1</em>');
      htmlContent += `  <li>${itemText}</li>\n`;
      continue;
    } else {
      if (inList) {
        htmlContent += '</ul>\n';
        inList = false;
      }
    }

    if (line === '') {
      continue;
    }

    let pText = line;
    pText = pText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    pText = pText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    pText = pText.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-sm font-mono">$1</code>');
    
    htmlContent += `<p class="my-3 text-slate-700 dark:text-slate-300 leading-relaxed">${pText}</p>\n`;
  }

  if (inList) htmlContent += '</ul>\n';
  if (inCodeBlock) htmlContent += '</code></pre>\n';

  return htmlContent;
}

// CSV/JSON parser
function csvToJson(text) {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const obj = {};

    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });

    data.push(obj);
  }
  return data;
}

function jsonToCsv(data) {
  if (!Array.isArray(data) || data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const csvLines = [headers.join(',')];

  data.forEach((item) => {
    const values = headers.map(header => {
      const value = item[header] || '';
      return typeof value === 'string' && value.includes(',')
        ? `"${value}"`
        : value;
    });
    csvLines.push(values.join(','));
  });
  return csvLines.join('\n');
}

// --- TEST RUNNER SUITE ---

const results = [];
let passCount = 0;
let failCount = 0;

function it(desc, testFn) {
  try {
    testFn();
    results.push({ desc, status: 'PASS', error: null });
    passCount++;
  } catch (err) {
    results.push({ desc, status: 'FAIL', error: err.stack || err.message });
    failCount++;
  }
}

function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEquals(actual, expected, message = '') {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message || 'Assertion failed'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// --- EXECUTE TESTS ---

console.log('Starting QA Verification Suite...');

// 1. JSON ↔ XML Conversion
it('JSON to XML Conversion', () => {
  const input = {
    name: 'Javi',
    age: 26,
    skills: {
      coding: 'React',
      testing: 'QA'
    }
  };
  const xmlStr = jsonToXml(input, 'person');
  
  assert(xmlStr.includes('<name>Javi</name>'));
  assert(xmlStr.includes('<coding>React</coding>'));
  assert(xmlStr.includes('<person>'));
});

it('XML to JSON Conversion', () => {
  const xmlStr = `<?xml version="1.0" encoding="UTF-8"?>
  <person>
    <name>Javi</name>
    <age>26</age>
    <skills>
      <coding>React</coding>
      <testing>QA</testing>
    </skills>
  </person>`;

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlStr, 'text/xml');
  const obj = xmlToObj(xmlDoc.documentElement);

  assertEquals(obj.name, 'Javi');
  assertEquals(obj.age, '26');
  assertEquals(obj.skills.coding, 'React');
});

// 2. JSON ↔ YAML Conversion
it('JSON to YAML Conversion', () => {
  const json = { name: 'All-in-One', active: true, list: [1, 2, 3] };
  const yamlStr = yaml.dump(json);
  assert(yamlStr.includes('name: All-in-One'));
  assert(yamlStr.includes('- 1'));
});

it('YAML to JSON Conversion', () => {
  const yamlStr = `
  name: All-in-One
  active: true
  list:
    - 1
    - 2
    - 3
  `;
  const json = yaml.load(yamlStr);
  assertEquals(json.name, 'All-in-One');
  assertEquals(json.active, true);
  assertEquals(json.list, [1, 2, 3]);
});

// 3. CSV ↔ JSON Conversion
it('CSV to JSON Conversion', () => {
  const csv = 'id,name,role\n1,Javi,Admin\n2,Tester,QA';
  const json = csvToJson(csv);
  assertEquals(json.length, 2);
  assertEquals(json[0], { id: '1', name: 'Javi', role: 'Admin' });
  assertEquals(json[1], { id: '2', name: 'Tester', role: 'QA' });
});

it('JSON to CSV Conversion', () => {
  const json = [
    { id: '1', name: 'Javi', role: 'Admin' },
    { id: '2', name: 'Tester', role: 'QA' }
  ];
  const csv = jsonToCsv(json);
  assertEquals(csv, 'id,name,role\n1,Javi,Admin\n2,Tester,QA');
});

// 4. Markdown Parsing (HTML preview conversion)
it('Markdown H1, H2, and Bold parsing to HTML', () => {
  const markdown = '# Main Title\n\n## Subtitle\nThis is **bold** and *italic* text.\n* Bullet point 1\n* Bullet point 2';
  const html = parseMdToHtml(markdown);

  assert(html.includes('<h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mt-6 mb-3">Main Title</h1>'));
  assert(html.includes('<h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-5 mb-2">Subtitle</h2>'));
  assert(html.includes('<strong>bold</strong>'));
  assert(html.includes('<em>italic</em>'));
  assert(html.includes('<li>Bullet point 1</li>'));
});

// 5. PDF Engine Integrations (using pdf-lib)
it('PDF Document Creation & Page Operations', async () => {
  // Create a PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([500, 700]);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  page.drawText('QA Test PDF', {
    x: 50,
    y: 600,
    size: 24,
    font,
    color: rgb(0, 0, 1),
  });

  const pdfBytes = await pdfDoc.save();
  assert(pdfBytes instanceof Uint8Array);

  // Load PDF and verify page count
  const loadedPdf = await PDFDocument.load(pdfBytes);
  assertEquals(loadedPdf.getPageCount(), 1);

  // PDF Merge simulation
  const mergedPdf = await PDFDocument.create();
  const copiedPages = await mergedPdf.copyPages(loadedPdf, [0]);
  mergedPdf.addPage(copiedPages[0]);
  mergedPdf.addPage(copiedPages[0]); // add twice

  const mergedBytes = await mergedPdf.save();
  const loadedMerged = await PDFDocument.load(mergedBytes);
  assertEquals(loadedMerged.getPageCount(), 2);
});

// --- PRINT RESULTS SUMMARY ---

console.log('\n--- QA TEST EXECUTION REPORT SUMMARY ---');
results.forEach((r, idx) => {
  console.log(`[${idx + 1}] [${r.status}] ${r.desc}`);
  if (r.error) {
    console.error(`    Error: ${r.error}`);
  }
});
console.log(`\nTOTAL: ${results.length} | PASSED: ${passCount} | FAILED: ${failCount}`);

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
