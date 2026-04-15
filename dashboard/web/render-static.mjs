import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { scanFiles, scanSummary, parseScanFile } from './scan-data.mjs';

const projectRoot = cwd();
const webRoot = join(projectRoot, 'dashboard', 'web');
const files = scanFiles(projectRoot);

if (!files.length) {
  console.error('No portal scan JSON files found in data/.');
  process.exit(1);
}

const scans = files.map((filePath) => scanSummary(filePath));
const byDate = Object.fromEntries(files.map((filePath) => {
  const scan = parseScanFile(projectRoot, filePath);
  return [scan.scanned_on, scan];
}));

const latest = scans[0].date;
const bootstrap = {
  scans,
  latest,
  byDate,
};

const template = readFileSync(join(webRoot, 'index.html'), 'utf8')
  .replace('/styles.css', '../dashboard/web/styles.css')
  .replace(
    '<script defer src="/app.js"></script>',
    `<script>window.__PORTAL_SCAN_BOOTSTRAP__ = ${JSON.stringify(bootstrap)};</script>\n    <script defer src="../dashboard/web/app.js"></script>`,
  );

const outputPath = join(projectRoot, 'data', 'portal-scan-view.html');
writeFileSync(outputPath, template);
console.log(outputPath);
