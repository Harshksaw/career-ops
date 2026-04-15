const state = {
  scanList: [],
  activeScan: null,
  selectedUrl: null,
  filters: {
    fit: 'all',
    platform: 'all',
    company: 'all',
    queue: 'all',
    sort: 'fit',
    query: '',
  },
};

const fitOrder = ['High Fit', 'Medium Fit', 'Broad Match'];
const priorityOrder = { primary: 0, backup: 1 };
const bootstrap = window.__PORTAL_SCAN_BOOTSTRAP__ || null;

const refs = {
  scanSelect: document.querySelector('#scan-select'),
  refreshButton: document.querySelector('#refresh-button'),
  searchInput: document.querySelector('#search-input'),
  fitFilter: document.querySelector('#fit-filter'),
  platformFilter: document.querySelector('#platform-filter'),
  companyFilter: document.querySelector('#company-filter'),
  queueFilter: document.querySelector('#queue-filter'),
  sortFilter: document.querySelector('#sort-filter'),
  summaryGrid: document.querySelector('#summary-grid'),
  priorityRoot: document.querySelector('#priority-root'),
  resultsCount: document.querySelector('#results-count'),
  resultsContext: document.querySelector('#results-context'),
  rolesRoot: document.querySelector('#roles-root'),
  detailRoot: document.querySelector('#detail-root'),
  issuesRoot: document.querySelector('#issues-root'),
};

function formatDate(value) {
  if (!value) {
    return 'n/a';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-CA', {
    dateStyle: 'medium',
  }).format(date);
}

function createOption(value, label) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = label;
  return option;
}

function priorityRank(role) {
  return priorityOrder[role.priority] ?? 2;
}

function priorityLabel(value) {
  if (value === 'primary') {
    return 'Apply now';
  }
  if (value === 'backup') {
    return 'Backup';
  }
  return '';
}

function statusLabel(value) {
  if (value === 'active') {
    return 'Live';
  }
  if (value === 'deadline_flagged') {
    return 'Deadline flagged';
  }
  if (value === 'stale') {
    return 'Closed or stale';
  }
  return value || '';
}

function resetOptions(select, values, formatter = (value) => value) {
  const current = select.value;
  const first = select.querySelector('option');
  select.innerHTML = '';
  if (first) {
    select.append(first);
  }
  values.forEach((value) => {
    select.append(createOption(value, formatter(value)));
  });
  if ([...select.options].some((option) => option.value === current)) {
    select.value = current;
  }
}

function roleMeta(role) {
  return [
    role.company,
    role.title,
    role.location,
    role.platform,
    role.fitBucket,
  ]
    .join(' ')
    .toLowerCase();
}

function filteredRoles() {
  if (!state.activeScan) {
    return [];
  }

  const query = state.filters.query.trim().toLowerCase();
  const roles = state.activeScan.roles.filter((role) => {
    if (state.filters.fit !== 'all' && role.fitBucket !== state.filters.fit) {
      return false;
    }
    if (state.filters.platform !== 'all' && role.platform !== state.filters.platform) {
      return false;
    }
    if (state.filters.company !== 'all' && role.company !== state.filters.company) {
      return false;
    }
    if (state.filters.queue === 'queued' && !role.queued) {
      return false;
    }
    if (state.filters.queue === 'unqueued' && role.queued) {
      return false;
    }
    if (query && !roleMeta(role).includes(query)) {
      return false;
    }
    return true;
  });

  const sorted = [...roles];
  if (state.filters.sort === 'company') {
    sorted.sort((a, b) => a.company.localeCompare(b.company) || a.title.localeCompare(b.title));
  } else if (state.filters.sort === 'published') {
    sorted.sort((a, b) => (b.publishedSort || '').localeCompare(a.publishedSort || '') || a.company.localeCompare(b.company));
  } else {
    sorted.sort((a, b) => {
      const priorityDelta = priorityRank(a) - priorityRank(b);
      if (priorityDelta !== 0) {
        return priorityDelta;
      }
      const fitDelta = fitOrder.indexOf(a.fitBucket) - fitOrder.indexOf(b.fitBucket);
      if (fitDelta !== 0) {
        return fitDelta;
      }
      return a.company.localeCompare(b.company) || a.title.localeCompare(b.title);
    });
  }

  return sorted;
}

function renderSummary() {
  if (!state.activeScan) {
    refs.summaryGrid.innerHTML = '';
    return;
  }

  const summaryItems = [
    ['Tracked Companies', state.activeScan.scanned_companies.length],
    ['Matched Roles', state.activeScan.totals.added],
    ['Priority Picks', state.activeScan.priorityRoles.length],
    ['Queued Roles', state.activeScan.queuedCount],
    ['High Fit', state.activeScan.bucketCounts['High Fit']],
    ['Medium Fit', state.activeScan.bucketCounts['Medium Fit']],
    ['Broad Match', state.activeScan.bucketCounts['Broad Match']],
    ['Broken Sources', state.activeScan.errors.length],
    ['Skipped by Filter', state.activeScan.totals.skipped_title],
  ];

  refs.summaryGrid.innerHTML = '';
  summaryItems.forEach(([label, value]) => {
    const card = document.createElement('article');
    card.className = 'summary-card';
    card.innerHTML = `<p>${label}</p><strong>${value}</strong>`;
    refs.summaryGrid.append(card);
  });
}

function renderPriority() {
  if (!state.activeScan) {
    refs.priorityRoot.innerHTML = '';
    return;
  }

  const priorityRoles = state.activeScan.priorityRoles || [];
  const statusChecks = state.activeScan.statusChecks || [];

  if (!priorityRoles.length && !statusChecks.length) {
    refs.priorityRoot.innerHTML = '<p class="muted">No curated priority notes for this scan.</p>';
    return;
  }

  refs.priorityRoot.innerHTML = '';
  const verifiedOn = priorityRoles[0]?.verified_on || statusChecks[0]?.verified_on || state.activeScan.scanned_on;

  const intro = document.createElement('p');
  intro.className = 'muted priority-intro';
  intro.textContent = `Verified on ${verifiedOn}.`;
  refs.priorityRoot.append(intro);

  const priorityList = document.createElement('div');
  priorityList.className = 'priority-list';

  priorityRoles.forEach((role) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `priority-card priority-${role.priority || 'review'}`;
    button.innerHTML = `
      <div class="priority-card-head">
        <span class="pill priority-pill ${role.priority || 'review'}">${priorityLabel(role.priority) || 'Review'}</span>
        <span class="pill status-pill ${role.status || 'unknown'}">${statusLabel(role.status) || 'Checked'}</span>
      </div>
      <strong>${role.title}</strong>
      <p>${role.company} • ${role.location}</p>
      <span>${role.reason}</span>
    `;
    button.addEventListener('click', () => {
      state.selectedUrl = role.url;
      renderRoles();
      renderDetail();
    });
    priorityList.append(button);
  });

  refs.priorityRoot.append(priorityList);

  if (!statusChecks.length) {
    return;
  }

  const staleHead = document.createElement('p');
  staleHead.className = 'priority-subhead';
  staleHead.textContent = 'Checked closed or stale';
  refs.priorityRoot.append(staleHead);

  const staleList = document.createElement('div');
  staleList.className = 'stale-list';
  statusChecks.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'stale-row';
    row.innerHTML = `
      <strong>${item.company}</strong>
      <span>${item.title}</span>
      <small>${statusLabel(item.status)} • ${item.verified_on}</small>
    `;
    staleList.append(row);
  });
  refs.priorityRoot.append(staleList);
}

function renderIssues() {
  if (!state.activeScan) {
    refs.issuesRoot.innerHTML = '';
    return;
  }

  if (!state.activeScan.errors.length) {
    refs.issuesRoot.innerHTML = '<p class="muted">No source issues in this scan.</p>';
    return;
  }

  refs.issuesRoot.innerHTML = '';
  state.activeScan.errors.forEach((issue) => {
    const row = document.createElement('div');
    row.className = 'issue-row';
    row.innerHTML = `
      <strong>${issue.company}</strong>
      <span>${issue.error}</span>
      <code>${issue.source}</code>
    `;
    refs.issuesRoot.append(row);
  });
}

function renderDetail() {
  if (!state.activeScan) {
    refs.detailRoot.textContent = 'No scan loaded.';
    return;
  }

  const role =
    state.activeScan.roles.find((entry) => entry.url === state.selectedUrl) ||
    filteredRoles()[0];

  if (!role) {
    refs.detailRoot.textContent = 'No role matches the current filters.';
    return;
  }

  state.selectedUrl = role.url;
  const badges = [
    `<span class="pill fit-${role.fitBucket.toLowerCase().replace(/\s+/g, '-')}">${role.fitBucket}</span>`,
    role.priority
      ? `<span class="pill priority-pill ${role.priority}">${priorityLabel(role.priority)}</span>`
      : '',
    role.queued
      ? '<span class="pill queued">Queued</span>'
      : '<span class="pill idle">Not queued</span>',
    role.status && role.status !== 'active'
      ? `<span class="pill status-pill ${role.status}">${statusLabel(role.status)}</span>`
      : '',
  ].filter(Boolean).join('');

  refs.detailRoot.innerHTML = `
    <div class="detail-header">
      ${badges}
    </div>
    <h3>${role.title}</h3>
    <p class="detail-company">${role.company}</p>
    <dl class="detail-meta">
      <div><dt>Location</dt><dd>${role.location}</dd></div>
      <div><dt>Platform</dt><dd>${role.platform}</dd></div>
      <div><dt>Published</dt><dd>${formatDate(role.published)}</dd></div>
      <div><dt>Verified</dt><dd>${role.verified_on || 'n/a'}</dd></div>
      <div><dt>Scan Date</dt><dd>${state.activeScan.scanned_on}</dd></div>
    </dl>
    ${role.reason ? `<p class="detail-note">${role.reason}</p>` : ''}
    <div class="detail-actions">
      <a class="primary-link" href="${role.url}" target="_blank" rel="noreferrer">Open posting</a>
      <button type="button" class="ghost small" data-copy="${role.url} | ${role.company} | ${role.title}">Copy pipeline line</button>
    </div>
  `;

  refs.detailRoot.querySelector('[data-copy]')?.addEventListener('click', async (event) => {
    const value = event.currentTarget.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(`- [ ] ${value}`);
      event.currentTarget.textContent = 'Copied';
      setTimeout(() => {
        event.currentTarget.textContent = 'Copy pipeline line';
      }, 1200);
    } catch {
      event.currentTarget.textContent = 'Clipboard blocked';
    }
  });
}

function renderRoles() {
  const roles = filteredRoles();
  refs.resultsCount.textContent = `${roles.length} roles`;
  refs.resultsContext.textContent = state.activeScan
    ? `Scan date ${state.activeScan.scanned_on} · ${state.activeScan.priorityRoles.length} Canada-priority picks`
    : '';

  refs.rolesRoot.innerHTML = '';

  if (!roles.length) {
    refs.rolesRoot.innerHTML = '<p class="empty-state">No roles match the current filters.</p>';
    renderDetail();
    return;
  }

  const grouped = new Map(fitOrder.map((bucket) => [bucket, []]));
  roles.forEach((role) => grouped.get(role.fitBucket).push(role));

  fitOrder.forEach((bucket) => {
    const items = grouped.get(bucket);
    if (!items.length) {
      return;
    }

    const section = document.createElement('section');
    section.className = 'role-group';

    const head = document.createElement('div');
    head.className = 'group-head';
    head.innerHTML = `<h3>${bucket}</h3><span>${items.length}</span>`;
    section.append(head);

    const list = document.createElement('div');
    list.className = 'role-list';

    items.forEach((role) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `role-card ${state.selectedUrl === role.url ? 'selected' : ''}`;
      button.innerHTML = `
        <div class="role-topline">
          <span class="role-company">${role.company}</span>
          <span class="role-platform">${role.platform}</span>
        </div>
        <strong>${role.title}</strong>
        <p>${role.location}</p>
        <div class="role-footer">
          <span>${formatDate(role.published)}</span>
          ${
            role.priority === 'primary'
              ? '<span class="priority-mark">Apply now</span>'
              : role.priority === 'backup'
                ? '<span class="backup-mark">Backup</span>'
                : role.queued
                  ? '<span class="queued-mark">Queued</span>'
                  : '<span class="open-mark">Review</span>'
          }
        </div>
      `;
      button.addEventListener('click', () => {
        state.selectedUrl = role.url;
        renderRoles();
        renderDetail();
      });
      list.append(button);
    });

    section.append(list);
    refs.rolesRoot.append(section);
  });

  renderDetail();
}

function syncFilterChoices() {
  if (!state.activeScan) {
    return;
  }

  const platforms = [...new Set(state.activeScan.roles.map((role) => role.platform))].sort();
  const companies = [...new Set(state.activeScan.roles.map((role) => role.company))].sort();

  resetOptions(refs.fitFilter, fitOrder);
  resetOptions(refs.platformFilter, platforms);
  resetOptions(refs.companyFilter, companies);
}

async function fetchJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

async function loadScans(selectedDate) {
  const listing = bootstrap
    ? { scans: bootstrap.scans, latest: bootstrap.latest }
    : await fetchJSON('/api/scans');
  state.scanList = listing.scans;

  refs.scanSelect.innerHTML = '';
  listing.scans.forEach((scan) => {
    refs.scanSelect.append(createOption(scan.date, scan.date));
  });

  const date = selectedDate || listing.latest;
  if (!date) {
    state.activeScan = null;
    renderSummary();
    renderPriority();
    renderIssues();
    renderRoles();
    return;
  }

  refs.scanSelect.value = date;
  state.activeScan = bootstrap
    ? bootstrap.byDate[date]
    : await fetchJSON(`/api/scan/${date}`);
  syncFilterChoices();
  renderSummary();
  renderPriority();
  renderIssues();
  renderRoles();
}

function wireEvents() {
  refs.scanSelect.addEventListener('change', () => {
    loadScans(refs.scanSelect.value);
  });

  refs.refreshButton.addEventListener('click', () => {
    loadScans(refs.scanSelect.value);
  });

  refs.searchInput.addEventListener('input', (event) => {
    state.filters.query = event.target.value;
    renderRoles();
  });

  refs.fitFilter.addEventListener('change', (event) => {
    state.filters.fit = event.target.value;
    renderRoles();
  });

  refs.platformFilter.addEventListener('change', (event) => {
    state.filters.platform = event.target.value;
    renderRoles();
  });

  refs.companyFilter.addEventListener('change', (event) => {
    state.filters.company = event.target.value;
    renderRoles();
  });

  refs.queueFilter.addEventListener('change', (event) => {
    state.filters.queue = event.target.value;
    renderRoles();
  });

  refs.sortFilter.addEventListener('change', (event) => {
    state.filters.sort = event.target.value;
    renderRoles();
  });
}

wireEvents();
loadScans().catch((error) => {
  refs.rolesRoot.innerHTML = `<p class="empty-state">Failed to load scan data: ${error.message}</p>`;
});
