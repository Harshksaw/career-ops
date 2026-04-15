import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { cwd } from 'node:process';
import { scanFiles, scanSummary, parseScanFile } from './scan-data.mjs';

const projectRoot = cwd();
const webRoot = join(projectRoot, 'dashboard', 'web');
const port = Number(process.env.PORT || 4318);
const host = '127.0.0.1';

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
};

function json(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(payload));
}

function sendFile(res, filePath) {
  try {
    const body = readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(body);
  } catch (error) {
    json(res, 404, { error: `missing file: ${filePath}` });
  }
}

function apiRoute(req, res, pathname) {
  const files = scanFiles(projectRoot);

  if (pathname === '/api/scans') {
    return json(res, 200, {
      scans: files.map(scanSummary),
      latest: files[0] ? scanSummary(files[0]).date : null,
    });
  }

  if (pathname === '/api/scan/latest') {
    if (!files[0]) {
      return json(res, 404, { error: 'no portal scan files found' });
    }
    return json(res, 200, parseScanFile(projectRoot, files[0]));
  }

  if (pathname.startsWith('/api/scan/')) {
    const date = pathname.replace('/api/scan/', '');
    const match = files.find((filePath) => filePath.endsWith(`portal-scan-${date}.json`));
    if (!match) {
      return json(res, 404, { error: `scan not found for ${date}` });
    }
    return json(res, 200, parseScanFile(projectRoot, match));
  }

  return json(res, 404, { error: `unknown api route: ${pathname}` });
}

function staticRoute(req, res, pathname) {
  const requested = pathname === '/' ? '/index.html' : pathname;
  const safePath = normalize(requested).replace(/^(\.\.[/\\])+/, '');
  const filePath = join(webRoot, safePath);

  if (!filePath.startsWith(webRoot)) {
    return json(res, 403, { error: 'forbidden' });
  }

  if (!existsSync(filePath)) {
    return json(res, 404, { error: `asset not found: ${requested}` });
  }

  return sendFile(res, filePath);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || `localhost:${port}`}`);

  if (url.pathname.startsWith('/api/')) {
    return apiRoute(req, res, url.pathname);
  }

  return staticRoute(req, res, url.pathname);
});

server.listen(port, host, () => {
  console.log(`Portal scan viewer running at http://${host}:${port}`);
});
