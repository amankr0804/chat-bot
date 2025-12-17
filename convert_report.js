const fs = require('fs');
const path = require('path');
const md = require('markdown-it')({ html: true, linkify: true, typographer: true });

const input = path.resolve(__dirname, 'REPORT.md');
const tempHtml = path.resolve(__dirname, 'REPORT_temp.html');
const outPdf = path.resolve(__dirname, 'REPORT.pdf');

const markdown = fs.readFileSync(input, 'utf8');

const css = `
body { font-family: Arial, Helvetica, sans-serif; color:#111827; padding: 36px; max-width: 900px; margin: auto; }
h1,h2,h3 { color: #1f2937 }
code { background:#f3f4f6; padding:2px 6px; border-radius:4px }
pre { background:#0f172a; color:#f8fafc; padding:12px; border-radius:8px; overflow:auto }
img { max-width:100%; }
.table-of-contents { margin-bottom: 12px }
footer { margin-top: 40px; font-size: 12px; color: #6b7280 }
`;

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Project Report</title>
<style>${css}</style>
</head>
<body>
${md.render(markdown)}
<footer>Generated from REPORT.md</footer>
</body>
</html>`;

fs.writeFileSync(tempHtml, html, 'utf8');

(async () => {
  try {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('file://' + tempHtml, { waitUntil: 'networkidle0' });
    await page.pdf({ path: outPdf, format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } });
    await browser.close();
    console.log('PDF created at:', outPdf);
  } catch (err) {
    console.error('Error creating PDF:', err.message || err);
    process.exit(1);
  }
})();
