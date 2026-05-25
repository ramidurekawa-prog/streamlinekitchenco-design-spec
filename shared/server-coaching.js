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
  const stateLabel = { full: 'Full data', partial: 'Partial · setup recommended', locked: 'Locked · setup required' };
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

// Render metric strip.

// ── from source lines 24258-24269 (renderLeCoStrip) ──
function renderLeCoStrip() {
  const el = document.getElementById('leCoStrip');
  if (!el) return;
  el.innerHTML =
    '<div class="le-sp-strip-cell"><div class="le-sp-strip-k">Servers analyzed</div><div class="le-sp-strip-v">14</div><div class="le-sp-strip-sub">After ≥12-shift filter</div></div>'
    + '<div class="le-sp-strip-cell"><div class="le-sp-strip-k">Surfaced (pattern)</div><div class="le-sp-strip-v">8</div><div class="le-sp-strip-sub">6 hidden · no pattern</div></div>'
    + '<div class="le-sp-strip-cell is-warn"><div class="le-sp-strip-k">Coaching gap est.</div><div class="le-sp-strip-v">$842</div><div class="le-sp-strip-sub" style="color:var(--amber)">/wk if matched [ESTIMATED]</div></div>'
    + '<div class="le-sp-strip-cell is-good"><div class="le-sp-strip-k">Triple-threats</div><div class="le-sp-strip-v">2</div><div class="le-sp-strip-sub">Top across axes</div></div>'
    + '<div class="le-sp-strip-cell"><div class="le-sp-strip-k">Confidence</div><div class="le-sp-strip-v">74%</div><div class="le-sp-strip-sub">60-day sample · axis-weighted</div></div>';
}

// Render the pattern distribution.

// ── from source lines 24270-24289 (renderLeCoPatternDist) ──
function renderLeCoPatternDist() {
  const el = document.getElementById('leCoPatternDist');
  if (!el) return;
  const counts = {};
  LE_CO_SERVERS.forEach(s => {
    const p = classifyPattern(s.scores);
    if (p) counts[p] = (counts[p]||0)+1;
  });
  const order = ['triple','revenue','hospitality','coaching','structural'];
  el.innerHTML = order.map(p => {
    const meta = LE_CO_PATTERN_META[p];
    const n = counts[p] || 0;
    return '<div class="le-co-pat-row">'
      + '<span>'+meta.label+'</span>'
      + '<span class="le-co-pat-tag '+meta.cls+'" style="background:var(--card);border:1px solid var(--border)">'+n+' server'+(n===1?'':'s')+'</span>'
      + '</div>';
  }).join('');
}

// Render the surfaced server cards.

// ── from source lines 24290-24365 (renderLeCoCards) ──
function renderLeCoCards(filter) {
  const list = document.getElementById('leCoList');
  const countEl = document.getElementById('leCoCardCount');
  if (!list) return;
  const surfaced = LE_CO_SERVERS
    .map(s => ({ ...s, pattern: classifyPattern(s.scores) }))
    .filter(s => s.pattern != null)
    .filter(s => filter === 'all' || filter == null || s.pattern === filter);
  if (countEl) countEl.textContent = surfaced.length + ' surfaced · 6 hidden (no pattern)';
  if (surfaced.length === 0) {
    list.innerHTML = '<div style="padding:24px;text-align:center;color:var(--t3);font-size:11.5px">No servers match this pattern.</div>';
    return;
  }
  list.innerHTML = surfaced.map(s => {
    const meta = LE_CO_PATTERN_META[s.pattern];
    const liftHtml = s.estLift
      ? '<div class="le-co-card-lift-v">'+s.estLift+'</div><div class="le-co-card-lift-k">[EST LIFT]</div>'
      : '<div class="le-co-card-lift-v is-asset">ASSET</div><div class="le-co-card-lift-k">RECOGNIZE</div>';
    // Build the 3 axis rows
    const axRow = (key, label, score) => {
      const cls = leCoBarClass(score);
      const pct = score == null ? 0 : score;
      const pctText = score == null ? 'LOCKED' : (score+'th');
      const pctCls = score == null ? 'locked' : '';
      return '<div class="le-co-ax">'
        + '<span class="le-co-ax-lbl">'+label+'</span>'
        + '<div class="le-co-ax-bar"><div class="le-co-ax-bar-fill '+cls+'" style="width:'+pct+'%"></div></div>'
        + '<span class="le-co-ax-pct '+pctCls+'">'+pctText+'</span>'
        + '</div>';
    };
    // Build raw-metrics summary line — 2 metrics per axis to keep it scannable
    const rm = s.rawMetrics;
    const metricSummary = ''
      + '<div style="margin-top:8px;font-size:10.5px;color:var(--t3);font-family:var(--mono);line-height:1.55">'
      +   '<strong style="color:var(--t2)">REV:</strong> Premium <strong style="color:var(--t1)">'+rm.premiumAttach+'</strong> vs '+rm.premiumMedian+' · Items/check <strong style="color:var(--t1)">'+rm.itemsCheck+'</strong> vs '+rm.itemsMedian+'<br>'
      +   '<strong style="color:var(--t2)">RET:</strong> Repeat-guest <strong style="color:var(--t1)">'+rm.repeatRate+'</strong> vs '+rm.repeatMedian+' · <span style="color:var(--amber)">[partial — loyalty 28% capture]</span><br>'
      +   '<strong style="color:var(--t2)">REL:</strong> Comp rate <strong style="color:var(--t1)">'+rm.compRate+'</strong> vs '+rm.compMedian+' · Mod capture <strong style="color:var(--t1)">'+rm.modCapture+'</strong> vs '+rm.modMedian
      + '</div>';
    // CTAs depend on pattern type
    let ctas;
    if (s.pattern === 'triple' || s.pattern === 'revenue' || s.pattern === 'hospitality') {
      ctas = '<button class="btn btn-primary btn-sm" onclick="showDemoToast(\'Shadow training scheduled with '+s.name+'\',\'green\')">Schedule Shadow Training</button>'
           + '<button class="btn btn-ghost btn-sm" onclick="showDemoToast(\'Recognition note drafted for GM\',\'green\')">Recognize</button>';
    } else if (s.pattern === 'structural') {
      ctas = '<button class="btn btn-primary btn-sm" onclick="showDemoToast(\'Structural review scheduled · multi-axis coaching plan\',\'amber\')">Structural Review</button>'
           + '<button class="btn btn-ghost btn-sm" onclick="showDemoToast(\'Server detail · 60-day shift-by-shift view\',\'blue\')">View Detail</button>';
    } else {
      ctas = '<button class="btn btn-primary btn-sm" onclick="showDemoToast(\'Coaching action drafted · pending GM review\',\'blue\')">Turn into Coaching Action</button>'
           + '<button class="btn btn-ghost btn-sm" onclick="showDemoToast(\'Server detail · 60-day shift-by-shift view\',\'blue\')">View Detail</button>';
    }
    return '<div class="le-co-card '+meta.cls+'" data-pattern="'+s.pattern+'">'
      + '<div class="le-co-card-left">'
      +   '<div class="le-co-card-htop">'
      +     '<div>'
      +       '<div class="le-co-card-name">'+s.name+' · '+s.shift+' · '+s.location+'</div>'
      +       '<div class="le-co-card-meta">'+s.shifts+' shifts trailing 60d · '+s.section+' section · conf '+s.confidence+'%</div>'
      +     '</div>'
      +     '<span class="le-co-card-pat '+meta.cls+'">'+meta.short+'</span>'
      +   '</div>'
      +   '<div class="le-co-axes">'
      +     axRow('revenue', 'Revenue', s.scores.revenue)
      +     axRow('retention', 'Retention', s.scores.retention)
      +     axRow('reliability', 'Reliability', s.scores.reliability)
      +   '</div>'
      +   metricSummary
      + '</div>'
      + '<div class="le-co-card-right">'
      +   leCoRadarSvg(s.scores)
      +   '<div class="le-co-card-lift">'+liftHtml+'</div>'
      + '</div>'
      + '<div class="le-co-card-cta">'+ctas+'</div>'
      + '</div>';
  }).join('');
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


