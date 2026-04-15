import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const fitOrder = ['High Fit', 'Medium Fit', 'Broad Match'];

export function scanFiles(projectRoot) {
  const dataRoot = join(projectRoot, 'data');
  if (!existsSync(dataRoot)) {
    return [];
  }

  return readdirSync(dataRoot)
    .filter((name) => /^portal-scan-\d{4}-\d{2}-\d{2}\.json$/.test(name))
    .sort()
    .reverse()
    .map((name) => join(dataRoot, name));
}

export function pipelineURLs(projectRoot) {
  const filePath = join(projectRoot, 'data', 'pipeline.md');
  if (!existsSync(filePath)) {
    return new Set();
  }

  const urls = readFileSync(filePath, 'utf8')
    .split('\n')
    .filter((line) => /^- \[(?: |x)\]/.test(line))
    .flatMap((line) => line.match(/https?:\/\/[^\s|)]+/g) || []);
  return new Set(urls.map((url) => url.replace(/[)>.,]+$/g, '')));
}

export function fitBucket(role) {
  const title = `${role.title || ''}`.toLowerCase();
  const location = `${role.location || ''}`.toLowerCase();

  const earlyCareer = [
    /\bintern\b/,
    /\binternship\b/,
    /\bco-?op\b/,
    /\bnew grad(uate)?\b/,
    /\bgraduate\b/,
    /\bjunior\b/,
    /\bearly career\b/,
  ].some((pattern) => pattern.test(title));

  const engineering = [
    /software engineer/,
    /software developer/,
    /full[- ]stack/,
    /frontend/,
    /front-end/,
    /backend/,
    /back-end/,
    /platform engineer/,
    /cloud engineer/,
    /devops/,
    /machine learning/,
    /\bml engineer\b/,
    /\bai engineer\b/,
    /research engineer/,
    /data engineer/,
    /security engineer/,
    /compiler/,
    /kernel/,
    /release engineer/,
  ].some((pattern) => pattern.test(title));

  const canadaFriendly = [
    'canada',
    'toronto',
    'vancouver',
    'montreal',
    'kelowna',
    'markham',
    'ottawa',
    'remote',
  ].some((term) => location.includes(term));

  if (earlyCareer && engineering && canadaFriendly) {
    return 'High Fit';
  }
  if (earlyCareer && engineering) {
    return 'Medium Fit';
  }
  return 'Broad Match';
}

function decorateRole(role, queuedURLs) {
  const bucket = fitBucket(role);
  return {
    ...role,
    fitBucket: bucket,
    queued: queuedURLs.has(role.url),
    publishedSort: role.published || '',
    location: role.location || 'Unknown',
    platform: role.platform || 'unknown',
    priority: role.priority || '',
    status: role.status || '',
    verified_on: role.verified_on || '',
    reason: role.reason || '',
  };
}

export function parseScanFile(projectRoot, filePath) {
  const raw = JSON.parse(readFileSync(filePath, 'utf8'));
  const queuedURLs = pipelineURLs(projectRoot);
  const priorityRoles = (raw.priority_roles || []).map((role) => decorateRole(role, queuedURLs));
  const statusChecks = raw.status_checks || [];

  const roleMap = new Map();
  [...(raw.new_roles || []), ...(raw.priority_roles || [])].forEach((role) => {
    const existing = roleMap.get(role.url) || {};
    roleMap.set(role.url, { ...existing, ...role });
  });

  const roles = [...roleMap.values()].map((role) => decorateRole(role, queuedURLs));

  const bucketCounts = Object.fromEntries(fitOrder.map((bucket) => [bucket, 0]));
  let queuedCount = 0;

  roles.forEach((role) => {
    bucketCounts[role.fitBucket] += 1;
    if (role.queued) {
      queuedCount += 1;
    }
  });

  return {
    ...raw,
    roles,
    priorityRoles,
    statusChecks,
    bucketCounts,
    queuedCount,
  };
}

export function scanSummary(filePath) {
  const stats = statSync(filePath);
  const raw = JSON.parse(readFileSync(filePath, 'utf8'));
  return {
    date: raw.scanned_on,
    totals: raw.totals,
    path: filePath,
    updatedAt: stats.mtime.toISOString(),
  };
}

export function latestScan(projectRoot) {
  const files = scanFiles(projectRoot);
  return files[0] ? parseScanFile(projectRoot, files[0]) : null;
}
