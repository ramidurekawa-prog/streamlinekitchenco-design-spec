/* ════════════════════════════════════════════════════════════════════
   SKC Server Coaching renderer + showLaborSubpage wrap
   Extracted from script 3 of skc-demo-v30b-tooltips-floating.html
   ════════════════════════════════════════════════════════════════════ */

// ── from source lines 24155-24169 (classifyPattern) ──
function classifyPattern(scores) {
  const axes = ['revenue','retention','reliability'];
  const valid = axes.filter(a => scores[a] != null);
  if (valid.length === 0) return null;
  const top = valid.filter(a => scores[a] >= 70);
  const bot = valid.filter(a => scores[a] <= 35);
  if (top.length === valid.length && valid.length >= 2) return 'triple';
  if (top.includes('revenue') && top.length === 1) return 'revenue';
  if (top.length >= 1 && top.includes('retention') && !top.includes('revenue')) return 'hospitality';
  if (top.length >= 1 && top.includes('reliability') && !top.includes('revenue')) return 'hospitality';
  if (bot.length >= 2) return 'structural';
  if (bot.length === 1) return 'coaching';
  return null;
}


// ── from source lines 24179-24187 (leCoBarClass) ──
function leCoBarClass(score) {
  if (score == null) return 'locked';
  if (score >= 70) return 'q-top';
  if (score >= 50) return 'q-mid';
  if (score >= 35) return 'q-low';
  return 'q-bot';
}

// SVG mini radar chart — 3 axes, triangle, score plotted as % distance from center.

// ── from source lines 24188-24236 (leCoRadarSvg) ──
function leCoRadarSvg(scores) {
  const cx = 44, cy = 46, r = 32;
  const axes = ['revenue','retention','reliability'];
  // Angles: revenue top, retention bottom-right, reliability bottom-left
  const angles = [-Math.PI/2, Math.PI/6, 5*Math.PI/6];
  // Ring at 100% and 50%
  let svg = '<svg class="le-co-radar" viewBox="0 0 88 88">';
  // 100% triangle (background)
  let pts100 = angles.map((a,i)=>{
    return [cx + Math.cos(a)*r, cy + Math.sin(a)*r];
  });
  svg += '<polygon points="'+pts100.map(p=>p.join(',')).join(' ')+'" fill="var(--surface)" stroke="var(--border)" stroke-width="1"/>';
  // 50% ring
  let pts50 = angles.map((a)=>[cx + Math.cos(a)*r*0.5, cy + Math.sin(a)*r*0.5]);
  svg += '<polygon points="'+pts50.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="var(--border)" stroke-width="0.6" stroke-dasharray="2 2"/>';
  // Axis lines
  angles.forEach((a)=>{
    svg += '<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+Math.cos(a)*r)+'" y2="'+(cy+Math.sin(a)*r)+'" stroke="var(--border)" stroke-width="0.6"/>';
  });
  // Score polygon — locked axes shown at 0 with dashed
  let scorePts = axes.map((ax,i)=>{
    const s = scores[ax];
    const dist = s == null ? 0 : (s/100)*r;
    return [cx + Math.cos(angles[i])*dist, cy + Math.sin(angles[i])*dist];
  });
  // Determine fill color from pattern
  const pat = classifyPattern(scores);
  const patColors = {
    triple: 'rgba(34,197,94,0.32)',
    revenue: 'rgba(59,130,246,0.32)',
    hospitality: 'rgba(168,85,247,0.32)',
    coaching: 'rgba(245,158,11,0.32)',
    structural: 'rgba(239,68,68,0.32)'
  };
  const patStrokes = {
    triple: '#22c55e', revenue: '#3b82f6', hospitality: '#a855f7', coaching: '#f59e0b', structural: '#ef4444'
  };
  const fill = patColors[pat] || 'rgba(160,160,170,0.25)';
  const stroke = patStrokes[pat] || '#a1a1aa';
  svg += '<polygon points="'+scorePts.map(p=>p.map(n=>n.toFixed(1)).join(',')).join(' ')+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.5"/>';
  // Axis labels (very small)
  svg += '<text x="'+cx+'" y="9" font-size="7" fill="var(--t3)" text-anchor="middle" font-weight="700" letter-spacing="0.5">REV</text>';
  svg += '<text x="83" y="78" font-size="7" fill="var(--t3)" text-anchor="end" font-weight="700" letter-spacing="0.5">RET</text>';
  svg += '<text x="5" y="78" font-size="7" fill="var(--t3)" text-anchor="start" font-weight="700" letter-spacing="0.5">REL</text>';
  svg += '</svg>';
  return svg;
}

// Render the data-sources strip showing axis-level state.

// ── from source lines 24237-24257 (renderLeCoDsrc) ──
function renderLeCoDsrc() {
  const el = document.getElementById('leCoDsrc');
  if (!el) return;
  const stateIco = { full: '✓', partial: '◐', locked: '×' };
  const stateLabel = { full: 'Data ready', partial: 'Partial — setup recommended', locked: 'Locked — setup required' };
  const html = ['revenue','retention','reliability'].map(k => {
    const a = LE_CO_AXES[k];
    return '<div class="le-co-dsrc-cell is-'+a.state+'">'
      + '<div class="le-co-dsrc-ico is-'+a.state+'">'+stateIco[a.state]+'</div>'
      + '<div class="le-co-dsrc-body">'
      +   '<div class="le-co-dsrc-k">'+a.label+'</div>'
      +   '<div class="le-co-dsrc-v">'+stateLabel[a.state]+'</div>'
      +   '<div class="le-co-dsrc-sub">'+a.metricNote+'</div>'
      +   (a.state !== 'full' ? '<button class="le-co-dsrc-cta" onclick="showDemoToast(\'Open Toast setup guidance for '+a.label+'\',\'blue\')">'+(a.state==='locked'?'Connect to unlock':'Improve capture rate')+'</button>' : '')
      + '</div>'
      + '</div>';
  }).join('');
  el.innerHTML = html;
}

// (Removed — the metric strip duplicated the hero + side rail; cells now live in
// the hero ($842/wk, monthly, annual), the filter buttons (counts per pattern),
// and the methodology card (analyzed / surfaced / hidden). Render is a no-op
// in case the strip element is reintroduced in a future variant.)
function renderLeCoStrip() {}

// (Removed — pattern counts now live on the filter buttons, which serve both as
// counts AND the filter action. The standalone pattern-distribution side card
// was visualizing the same data with no extra affordance. Render is a no-op
// in case the host element gets reintroduced.)
function renderLeCoPatternDist() {}

// Helpers — extract weekly $ from an estLift string ("$148/wk" → 148; null → -1)
function leCoLiftWeekly(estLift) {
  if (!estLift) return -1;
  const m = String(estLift).match(/(\d+)/);
  return m ? parseInt(m[1], 10) : -1;
}
function leCoAvgScore(s) {
  const vals = ['revenue','retention','reliability']
    .map(k => s.scores[k])
    .filter(v => v != null);
  return vals.length ? vals.reduce((a,b) => a + b, 0) / vals.length : 0;
}
// Deterministic card id from server name — used by hero-priority click-to-scroll.
function leCoCardId(name) {
  return 'leCoCard-' + String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
// Scroll a card into view, OPEN its details, and briefly highlight it.
// Called from hero priority rows — turns the priority list into a deep-link
// into the matching card's full detail.
function leCoScrollToCard(serverName) {
  const card = document.getElementById(leCoCardId(serverName));
  if (!card) return;
  // Open the details if it's collapsed so the card content is visible on arrival.
  if (card.tagName === 'DETAILS' && !card.hasAttribute('open')) {
    card.setAttribute('open', '');
  }
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  card.classList.remove('le-co-card-pulse');
  void card.offsetWidth;
  card.classList.add('le-co-card-pulse');
  setTimeout(() => card.classList.remove('le-co-card-pulse'), 1800);
}
// Trend glyph next to an axis percentile. Compares current vs 60-day-prior score.
// Uses ↑↓→ (not ▲▼) to differentiate from the metric-chip arrows (▲▼ +N pts vs median).
function leCoTrendGlyph(score, prev) {
  if (score == null || prev == null) return '';
  const delta = score - prev;
  if (Math.abs(delta) <= 2) return '<span class="le-co-trend is-flat" title="Stable vs 60d prior">→</span>';
  if (delta > 0) return '<span class="le-co-trend is-up" title="Up ' + delta + ' pts vs 60d prior">↑</span>';
  return '<span class="le-co-trend is-down" title="Down ' + Math.abs(delta) + ' pts vs 60d prior">↓</span>';
}
// Compact "vs median" chip for a raw metric. `lowerIsBetter` flips the arrow
// direction for negative metrics like comp rate.
function leCoMetricChip(value, median, lowerIsBetter) {
  if (value == null || median == null) return '';
  const v = parseFloat(String(value));
  const m = parseFloat(String(median));
  if (isNaN(v) || isNaN(m)) return '';
  const rawDelta = v - m;
  if (Math.abs(rawDelta) < 0.5) return '<span class="le-co-mchip is-flat">—</span>';
  const performance = lowerIsBetter ? -rawDelta : rawDelta;
  const isUp = performance > 0;
  const arrow = isUp ? '▲' : '▼';
  const cls = isUp ? 'is-up' : 'is-down';
  const abs = Math.abs(rawDelta);
  const valStr = String(value);
  const isPct = valStr.includes('%');
  // Preserve precision when the source value carries a decimal (e.g. comp rate "0.4%")
  const decimals = valStr.includes('.') ? 1 : 0;
  const unit = isPct ? ' pts' : '';
  return '<span class="le-co-mchip ' + cls + '">' + arrow + ' ' + abs.toFixed(decimals) + unit + '</span>';
}
// Confidence tier — drives card CTA treatment + caveat. Mirrors Staffing Plan's
// 80 / 70 floors from Evidence. Only applies to coaching/structural (act-on
// patterns); assets/specialists don't have an action floor since the action is
// recognition/shadow training, which is operator-led, not lifecycle-tracked.
function leCoConfTier(conf, pattern) {
  const actOn = (pattern === 'coaching' || pattern === 'structural');
  if (!actOn) return 'recognize';
  if (conf >= 80) return 'green';
  if (conf >= 70) return 'amber';
  return 'red';
}
function leCoConfChip(conf, tier) {
  if (tier === 'recognize') return '';
  const label = { green: 'Ready to act', amber: 'Review before acting', red: 'Too low to act on yet' }[tier];
  return '<span class="le-co-conf-chip tier-' + tier + '">' + conf + '% · ' + label + '</span>';
}

// Last-coached chip — null → "Never coached", recent → blue (observe), overdue → amber.
// Optional `topic` surfaces the prior coaching focus so the page tracks an ongoing
// relationship rather than just a list of patterns.
function leCoLastCoachedChip(days, pattern, topic) {
  const topicSuffix = topic ? ' · <span class="le-co-coached-topic">' + topic + '</span>' : '';
  if (days == null) {
    const cls = (pattern === 'coaching' || pattern === 'structural') ? 'le-co-coached-flag' : 'le-co-coached-neutral';
    return '<span class="le-co-coached ' + cls + '">Never coached</span>';
  }
  if (days < 14) return '<span class="le-co-coached le-co-coached-recent">Coached ' + days + 'd ago' + topicSuffix + ' · give it a beat</span>';
  if (days <= 30) return '<span class="le-co-coached le-co-coached-neutral">Last coached ' + days + 'd ago' + topicSuffix + '</span>';
  return '<span class="le-co-coached le-co-coached-flag">Overdue · ' + days + 'd since last' + topicSuffix + '</span>';
}
// Update count badges on the filter buttons. Called each render.
function renderLeCoFilterCounts() {
  const ranked = LE_CO_SERVERS.map(s => ({ ...s, pattern: classifyPattern(s.scores) })).filter(s => s.pattern);
  const counts = { all: ranked.length, triple: 0, revenue: 0, hospitality: 0, coaching: 0, structural: 0 };
  ranked.forEach(s => { counts[s.pattern] = (counts[s.pattern] || 0) + 1; });
  document.querySelectorAll('#leCoFilters .le-co-filter-count').forEach(el => {
    const k = el.getAttribute('data-count-for');
    el.textContent = counts[k] != null ? counts[k] : '0';
  });
}

// Session-scoped scheduled-action state. Keyed by leCoCardId(name).
// Each entry: { type: 'shadow'|'coaching'|'recognition'|'review', label, date, icon }.
// Persists across re-renders within the page session; lost on full reload.
// Production should back this with a real Actions API.
let LE_CO_SCHEDULED = {};
function leCoSchedule(name, type, label) {
  LE_CO_SCHEDULED[leCoCardId(name)] = { type: type, label: label, date: 'today', icon: '✓' };
  if (typeof showDemoToast === 'function') {
    showDemoToast(label + ' scheduled with ' + name, 'green');
  }
  renderLeCoaching();
}
function leCoUnschedule(name) {
  delete LE_CO_SCHEDULED[leCoCardId(name)];
  if (typeof showDemoToast === 'function') {
    showDemoToast('Rescheduling for ' + name + ' · select a new action', 'blue');
  }
  renderLeCoaching();
}
function leCoBulkSchedule() {
  const ranked = LE_CO_SCHEDULED_PIPELINE || [];
  let scheduledCount = 0;
  ranked.forEach(s => {
    if (s.tier !== 'red' && !LE_CO_SCHEDULED[leCoCardId(s.name)]) {
      LE_CO_SCHEDULED[leCoCardId(s.name)] = { type: 'coaching', label: 'Coaching action', date: 'today', icon: '✓' };
      scheduledCount += 1;
    }
  });
  if (typeof showDemoToast === 'function') {
    if (scheduledCount > 0) {
      showDemoToast(scheduledCount + ' coaching session' + (scheduledCount === 1 ? '' : 's') + ' drafted · review in Actions', 'green');
    } else {
      showDemoToast('No new actions to draft · top priorities are either too low-confidence or already scheduled', 'amber');
    }
  }
  renderLeCoaching();
}
// Snapshot of the hero priority pipeline used by the bulk-schedule button.
// Populated each time renderLeCoHero() runs.
let LE_CO_SCHEDULED_PIPELINE = [];

// Render the "Top priorities to schedule" list inside the hero card.
// Decision-maker-first: sorted by weekly $ lift descending across all
// surfaced servers that carry an estLift (coaching / structural patterns).
// Also computes the "what fraction of the team gap do these cover" sub-line.
function renderLeCoHero() {
  const el = document.getElementById('leCoHeroPri');
  const fracEl = document.getElementById('leCoHeroFraction');
  const bulkEl = document.getElementById('leCoHeroBulk');
  if (!el) return;
  const allRanked = LE_CO_SERVERS
    .map(s => ({ ...s, pattern: classifyPattern(s.scores) }))
    .filter(s => s.pattern != null && s.estLift)
    .map(s => ({ ...s, tier: leCoConfTier(s.confidence, s.pattern) }))
    .sort((a, b) => leCoLiftWeekly(b.estLift) - leCoLiftWeekly(a.estLift));
  const ranked = allRanked.slice(0, 3);
  LE_CO_SCHEDULED_PIPELINE = ranked;

  // Compute the "top-3 = $N/wk · X% of team gap" line, with action-floor split
  if (fracEl) {
    const TEAM_GAP = 842;
    const sum = ranked.reduce((a, s) => a + leCoLiftWeekly(s.estLift), 0);
    const pct = TEAM_GAP > 0 ? Math.round((sum / TEAM_GAP) * 100) : 0;
    const readySum = ranked.filter(s => s.tier !== 'red').reduce((a, s) => a + leCoLiftWeekly(s.estLift), 0);
    const belowSum = ranked.filter(s => s.tier === 'red').reduce((a, s) => a + leCoLiftWeekly(s.estLift), 0);
    const readyN = ranked.filter(s => s.tier !== 'red').length;
    const belowN = ranked.filter(s => s.tier === 'red').length;
    if (sum > 0) {
      let html = 'Top ' + ranked.length + ' priorities at right cover <strong>$' + sum + '/wk</strong> · <strong>' + pct + '%</strong> of the total opportunity';
      if (belowN > 0) {
        html += '<br><span class="le-co-hero-fraction-split">'
          + readyN + ' ready ($' + readySum + '/wk) · ' + belowN + ' too low-confidence ($' + belowSum + '/wk · investigate first)'
          + '</span>';
      }
      fracEl.innerHTML = html;
    } else {
      fracEl.innerHTML = '';
    }
  }

  // Bulk action — schedules all ready (above-floor) priorities at once.
  // Count what's already scheduled so the button reflects remaining work.
  if (bulkEl) {
    const readyRows = ranked.filter(s => s.tier !== 'red');
    const remaining = readyRows.filter(s => !LE_CO_SCHEDULED[leCoCardId(s.name)]);
    if (remaining.length === 0 && readyRows.length > 0) {
      bulkEl.innerHTML = '<span class="le-co-hero-bulk-done">✓ All ready priorities scheduled</span>';
    } else if (remaining.length === 0) {
      bulkEl.innerHTML = '';
    } else {
      const sum = remaining.reduce((a, s) => a + leCoLiftWeekly(s.estLift), 0);
      bulkEl.innerHTML = '<button class="btn btn-primary btn-sm le-co-hero-bulk-btn" onclick="leCoBulkSchedule()">'
        + 'Schedule ' + remaining.length + ' coaching action' + (remaining.length === 1 ? '' : 's') + ' · $' + sum + '/wk →'
        + '</button>';
    }
  }

  if (ranked.length === 0) {
    el.innerHTML = '<div class="le-co-hero-pri-empty">No coaching priorities surfaced this week.</div>';
    return;
  }
  el.innerHTML = ranked.map((s, i) => {
    const escapedName = s.name.replace(/'/g, "\\'");
    // Status pill — most-actionable signal on the priority list. Order of priority:
    // already scheduled > below floor > overdue > recent > neutral.
    const isScheduled = !!LE_CO_SCHEDULED[leCoCardId(s.name)];
    let statusPill = '';
    if (isScheduled) {
      statusPill = '<span class="le-co-hero-pri-status is-scheduled">✓ Scheduled</span>';
    } else if (s.tier === 'red') {
      statusPill = '<span class="le-co-hero-pri-status is-red">Too low to act</span>';
    } else if (s.lastCoachedDays == null) {
      statusPill = '<span class="le-co-hero-pri-status is-amber">Never coached</span>';
    } else if (s.lastCoachedDays > 30) {
      statusPill = '<span class="le-co-hero-pri-status is-amber">' + s.lastCoachedDays + 'd overdue</span>';
    } else if (s.lastCoachedDays < 14) {
      statusPill = '<span class="le-co-hero-pri-status is-blue">' + s.lastCoachedDays + 'd ago</span>';
    } else {
      statusPill = '<span class="le-co-hero-pri-status is-neutral">' + s.lastCoachedDays + 'd ago</span>';
    }
    return '<div class="le-co-hero-pri-row' + (isScheduled ? ' is-done' : '') + '" role="button" tabindex="0"'
      + ' onclick="leCoScrollToCard(\'' + escapedName + '\')"'
      + ' onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();leCoScrollToCard(\'' + escapedName + '\')}"'
      + ' aria-label="Scroll to ' + s.name + ' card">'
      + '<span class="le-co-hero-pri-rank">' + (i + 1) + '</span>'
      + '<div class="le-co-hero-pri-mid">'
      +   '<div class="le-co-hero-pri-name">' + s.name + '</div>'
      +   '<div class="le-co-hero-pri-meta">' + s.location + ' ' + s.shift + '</div>'
      + '</div>'
      + statusPill
      + '<div class="le-co-hero-pri-lift">' + s.estLift + '</div>'
      + '<span class="le-co-hero-pri-chev" aria-hidden="true">→</span>'
      + '</div>';
  }).join('');
}

// Render the surfaced server cards.

// ── from source lines 24290-24365 (renderLeCoCards) ──
function renderLeCoCards(filter) {
  const list = document.getElementById('leCoList');
  const countEl = document.getElementById('leCoCardCount');
  if (!list) return;
  // Preserve which cards (and which nested metric details) were open across re-renders,
  // so toggling state on one card doesn't snap the others closed.
  const openCardIds = Array.from(list.querySelectorAll('details.le-co-card[open]')).map(d => d.id);
  const openMetricsIn = Array.from(list.querySelectorAll('details.le-co-card[open] details.le-co-card-metrics-details[open]'))
    .map(d => d.closest('details.le-co-card').id);
  const surfaced = LE_CO_SERVERS
    .map(s => ({ ...s, pattern: classifyPattern(s.scores) }))
    .filter(s => s.pattern != null)
    .filter(s => filter === 'all' || filter == null || s.pattern === filter)
    // Decision-maker default sort: servers with est-lift (coaching/structural)
    // bubble to the top by $ desc; assets/specialists sort after by avg score.
    .sort((a, b) => {
      const al = leCoLiftWeekly(a.estLift);
      const bl = leCoLiftWeekly(b.estLift);
      if (al !== bl) return bl - al;
      return leCoAvgScore(b) - leCoAvgScore(a);
    });
  if (countEl) countEl.textContent = surfaced.length + ' standout servers shown · 6 average performers hidden';
  if (surfaced.length === 0) {
    list.innerHTML = '<div style="padding:24px;text-align:center;color:var(--t3);font-size:11.5px">No servers match this pattern.</div>';
    return;
  }
  list.innerHTML = surfaced.map(s => {
    const meta = LE_CO_PATTERN_META[s.pattern];
    // (lift now renders in the card summary via `summaryLift` below — no
    // separate lift block in the body)
    // Build the 3 axis rows — now with trend arrows vs 60-day-prior scores
    const prev = s.prevScores || {};
    const axRow = (key, label, score) => {
      const cls = leCoBarClass(score);
      const pct = score == null ? 0 : score;
      const pctText = score == null ? 'LOCKED' : (score + ' / 100');
      const pctCls = score == null ? 'locked' : '';
      const trend = score == null ? '' : leCoTrendGlyph(score, prev[key]);
      return '<div class="le-co-ax">'
        + '<span class="le-co-ax-lbl">'+label+'</span>'
        + '<div class="le-co-ax-bar"><div class="le-co-ax-bar-fill '+cls+'" style="width:'+pct+'%"></div></div>'
        + '<span class="le-co-ax-pct '+pctCls+'">'+pctText+trend+'</span>'
        + '</div>';
    };
    // Build raw-metrics summary inside a <details> so cards stay scannable by default.
    // Open on demand to see "vs median" chips for the 5 metrics that back the axis scores.
    const rm = s.rawMetrics;
    const metricSummary = ''
      + '<details class="le-co-card-metrics-details">'
      +   '<summary class="le-co-card-metrics-summary">'
      +     '<span>Metrics vs peer median</span>'
      +     '<span class="le-co-toggle-chev" aria-hidden="true">▾</span>'
      +   '</summary>'
      +   '<div class="le-co-card-metrics">'
      +     '<div class="le-co-metrics-line"><strong>REV:</strong> Premium ' + rm.premiumAttach + ' ' + leCoMetricChip(rm.premiumAttach, rm.premiumMedian, false)
      +       ' · Items/check ' + rm.itemsCheck + ' ' + leCoMetricChip(rm.itemsCheck, rm.itemsMedian, false) + '</div>'
      +     '<div class="le-co-metrics-line"><strong>RET:</strong> Repeat-guest ' + rm.repeatRate + ' ' + leCoMetricChip(rm.repeatRate, rm.repeatMedian, false)
      +       ' · <span class="le-co-metrics-caveat">[partial — only 28% of guests are in the loyalty program]</span></div>'
      +     '<div class="le-co-metrics-line"><strong>REL:</strong> Comp rate ' + rm.compRate + ' ' + leCoMetricChip(rm.compRate, rm.compMedian, true)
      +       ' · Mod capture ' + rm.modCapture + ' ' + leCoMetricChip(rm.modCapture, rm.modMedian, false) + '</div>'
      +   '</div>'
      + '</details>';
    const lastCoachedChip = leCoLastCoachedChip(s.lastCoachedDays, s.pattern, s.lastCoachedTopic);
    // Confidence tier — green/amber/red for coaching/structural; "recognize" for assets
    const tier = leCoConfTier(s.confidence, s.pattern);
    const confChip = leCoConfChip(s.confidence, tier);
    const escName = s.name.replace(/'/g, "\\'");
    const cardId = leCoCardId(s.name);
    const scheduled = LE_CO_SCHEDULED[cardId];

    // CTAs — tier-aware. Below-floor coaching/structural CTAs are downgraded
    // to "Investigate evidence" since they can't pass the 70% action floor.
    let ctas;
    if (scheduled) {
      ctas = '<button class="btn btn-secondary btn-sm" onclick="leCoUnschedule(\'' + escName + '\')">Reschedule</button>'
           + '<button class="btn btn-ghost btn-sm" onclick="showDemoToast(\'Server detail · 60-day shift-by-shift view\',\'blue\')">View Detail</button>';
    } else if (s.pattern === 'triple' || s.pattern === 'revenue' || s.pattern === 'hospitality') {
      ctas = '<button class="btn btn-primary btn-sm" onclick="leCoSchedule(\'' + escName + '\',\'shadow\',\'Shadow training\')">Schedule Shadow Training</button>'
           + '<button class="btn btn-ghost btn-sm" onclick="leCoSchedule(\'' + escName + '\',\'recognition\',\'Recognition note\')">Recognize</button>';
    } else if (tier === 'red') {
      ctas = '<button class="btn btn-secondary btn-sm" onclick="showLaborSubpage(\'evidence\')">Investigate evidence</button>'
           + '<button class="btn btn-ghost btn-sm" onclick="showDemoToast(\'Server detail · 60-day shift-by-shift view\',\'blue\')">View Detail</button>';
    } else if (s.pattern === 'structural') {
      ctas = '<button class="btn btn-primary btn-sm" onclick="leCoSchedule(\'' + escName + '\',\'review\',\'Structural review\')">Structural Review</button>'
           + '<button class="btn btn-ghost btn-sm" onclick="showDemoToast(\'Server detail · 60-day shift-by-shift view\',\'blue\')">View Detail</button>';
    } else {
      ctas = '<button class="btn btn-primary btn-sm" onclick="leCoSchedule(\'' + escName + '\',\'coaching\',\'Coaching action\')">Turn into Coaching Action</button>'
           + '<button class="btn btn-ghost btn-sm" onclick="showDemoToast(\'Server detail · 60-day shift-by-shift view\',\'blue\')">View Detail</button>';
    }

    // Below-action-floor caveat for red tier
    const tierCaveat = tier === 'red'
      ? '<div class="le-co-card-caveat le-co-card-caveat-red">Confidence below 70% — too low to act on yet. Investigate the evidence first and re-evaluate as more data comes in.</div>'
      : tier === 'amber'
      ? '<div class="le-co-card-caveat le-co-card-caveat-amber">Confidence is between 70% (enough to act) and 80% (enough to count as verified). Review the metrics before turning this into an action.</div>'
      : '';

    // Scheduled state badge (replaces the coached chip's spot when present)
    const scheduledBadge = scheduled
      ? '<div class="le-co-scheduled-row"><span class="le-co-scheduled-badge">' + (scheduled.icon || '✓') + ' Scheduled · ' + scheduled.label + ' · ' + scheduled.date + '</span></div>'
      : '';
    // Compact summary line — everything an operator needs to decide whether to expand.
    // Layout: [name + pattern badge] [tier + coached + scheduled chips] [lift] [chevron]
    const summaryLift = s.estLift
      ? '<span class="le-co-summary-lift">' + s.estLift.replace('/wk', '<span class="le-co-summary-lift-period">/wk</span>') + '</span>'
      : '<span class="le-co-summary-lift is-asset">ASSET</span>';
    const summaryHtml = ''
      + '<summary class="le-co-card-summary">'
      +   '<div class="le-co-summary-name-wrap">'
      +     '<span class="le-co-card-name">' + s.name + ' · ' + s.shift + ' · ' + s.location + '</span>'
      +     '<span class="le-co-card-pat ' + meta.cls + '">' + meta.short + '</span>'
      +   '</div>'
      +   '<div class="le-co-summary-chips">'
      +     (confChip || '')
      +     lastCoachedChip
      +     (scheduled ? '<span class="le-co-scheduled-badge">✓ Scheduled · ' + scheduled.label + '</span>' : '')
      +   '</div>'
      +   summaryLift
      +   '<span class="le-co-toggle-chev" aria-hidden="true">▾</span>'
      + '</summary>';

    // Body — everything else. Hidden until summary is clicked.
    const bodyHtml = ''
      + '<div class="le-co-card-body">'
      +   '<div class="le-co-card-meta">' + s.shifts + ' shifts in the last 60 days · ' + s.section + ' section</div>'
      +   '<div class="le-co-axes">'
      +     axRow('revenue', 'Revenue', s.scores.revenue)
      +     axRow('retention', 'Retention', s.scores.retention)
      +     axRow('reliability', 'Reliability', s.scores.reliability)
      +   '</div>'
      +   metricSummary
      +   tierCaveat
      +   '<div class="le-co-card-cta">' + ctas + '</div>'
      + '</div>';

    return '<details class="le-co-card ' + meta.cls + ' tier-' + tier + (scheduled ? ' is-scheduled' : '') + '"'
      + ' id="' + cardId + '" data-pattern="' + s.pattern + '">'
      + summaryHtml
      + bodyHtml
      + '</details>';
  }).join('');

  // Restore open state captured before innerHTML reset.
  openCardIds.forEach(id => {
    const card = document.getElementById(id);
    if (card) card.setAttribute('open', '');
  });
  openMetricsIn.forEach(cardId => {
    const card = document.getElementById(cardId);
    if (!card) return;
    const m = card.querySelector('details.le-co-card-metrics-details');
    if (m) m.setAttribute('open', '');
  });
}

// Filter handler

// ── from source lines 24367-24373 (leCoFilter) ──
function leCoFilter(filter, btn) {
  LE_CO_ACTIVE_FILTER = filter;
  document.querySelectorAll('#leCoFilters .le-co-filter').forEach(b => b.classList.toggle('active', b === btn));
  renderLeCoCards(filter);
}

// Master render — called whenever the coaching subpage becomes active.

// ── from source lines 24374-24381 (renderLeCoaching) ──
function renderLeCoaching() {
  renderLeCoHero();
  renderLeCoFilterCounts();
  renderLeCoDsrc();
  renderLeCoStrip();
  renderLeCoPatternDist();
  renderLeCoCards(LE_CO_ACTIVE_FILTER);
}

// Hook into Labor subpage controller — render when coaching becomes active.

// ── from source lines 24382-24396 (_origShowLaborSubpage) ──
const _origShowLaborSubpage = (typeof showLaborSubpage === 'function') ? showLaborSubpage : null;
if (_origShowLaborSubpage) {
  // Re-define to wrap
  window.showLaborSubpage = function(sub) {
    _origShowLaborSubpage(sub);
    if (sub === 'coaching') {
      setTimeout(renderLeCoaching, 10);
    }
  };
}

// ═══════════════════════════════════════════════════════════
// (v28c) TABLE TURNS — Subpage controller + sidebar handlers
// ═══════════════════════════════════════════════════════════


