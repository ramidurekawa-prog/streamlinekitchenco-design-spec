/* ════════════════════════════════════════════════════════════════════
   SKC feature subpage controllers + nav handlers
   Extracted from scripts 1, 2, 3 of skc-demo-v30b-tooltips-floating.html
   ════════════════════════════════════════════════════════════════════ */

// ── from source lines 23765-23800 (showMenuSubpage) ──
function showMenuSubpage(sub) {
  if (!MENU_SUBPAGE_TITLES[sub]) sub = 'overview';

  // Ensure the parent screen is active
  const screen = document.getElementById('screen-menu');
  if (!screen || !screen.classList.contains('active')) {
    // Defer via showScreen if needed; showScreen will re-call us
    showScreen('menu', null, MENU_SUBPAGE_TITLES[sub]);
    // showScreen has a 20ms timeout that defaults to overview if not active.
    // Re-target to the requested subpage after that defaulting.
    setTimeout(() => showMenuSubpage(sub), 30);
    return;
  }

  // Hide all subpages, show selected
  document.querySelectorAll('#screen-menu .menu-subpage').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('menu-subpage-' + sub);
  if (target) target.classList.add('active');

  // Update topbar title
  const tb = document.getElementById('tbTitle');
  if (tb) tb.textContent = MENU_SUBPAGE_TITLES[sub];

  // Update menu page header title
  const hdr = document.getElementById('menuHdrTitle');
  if (hdr) hdr.textContent = 'Menu Optimization · ' + MENU_SUBPAGE_TITLES[sub].replace('Menu Optimization','Overview').replace('Menu ','');

  // Update sidebar nav
  _menuUpdateNav(sub);

  // First-time render of items table
  if (sub === 'items') {
    renderMenuItemsTable();
  }
}


// ── from source lines 23811-23818 (navMenuParentClick) ──
function navMenuParentClick(event) {
  // Click on parent label area: always open Menu Optimization > Overview and expand children.
  // Caret has its own handler (toggleMenuNav) that stops propagation.
  const parent = document.getElementById('navMenuParent');
  if (parent) parent.setAttribute('aria-expanded', 'true');
  showScreen('menu', null, MENU_SUBPAGE_TITLES.overview);
  showMenuSubpage('overview');
}

// ── from source lines 23819-23829 (toggleMenuNav) ──
function toggleMenuNav(event) {
  // Caret only: toggle expand/collapse without opening or navigating.
  if (event) {
    event.stopPropagation();
    if (event.preventDefault) event.preventDefault();
  }
  const parent = document.getElementById('navMenuParent');
  if (!parent) return;
  const expanded = parent.getAttribute('aria-expanded') === 'true';
  parent.setAttribute('aria-expanded', expanded ? 'false' : 'true');
}

// ── from source lines 23830-23835 (navMenuParentKeydown) ──
function navMenuParentKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    navMenuParentClick(event);
  }
}

// ── from source lines 23836-23839 (navMenuChildClick) ──
function navMenuChildClick(sub, el) {
  showScreen('menu', null, MENU_SUBPAGE_TITLES[sub]);
  showMenuSubpage(sub);
}

// ── from source lines 23840-23851 (navMenuChildKeydown) ──
function navMenuChildKeydown(event, sub) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    navMenuChildClick(sub);
  }
}

// ═══════════════════════════════════════════════════════════
// (v28) ACTIONS — Subpage controller + sidebar handlers
// Mirrors Menu Optimization pattern.
// ═══════════════════════════════════════════════════════════


// ── from source lines 23862-23886 (showActionsSubpage) ──
function showActionsSubpage(sub) {
  // (consolidated) pending / active / ready / blocked now live in one
  // #ac-subpage-queue with an in-page toggle. Route those four (and 'queue') there.
  var QUEUE = { pending: 1, active: 1, ready: 1, blocked: 1, queue: 1 };
  if (!ACTIONS_SUBPAGE_TITLES[sub] && !QUEUE[sub]) sub = 'overview';

  // Ensure parent screen is active
  const screen = document.getElementById('screen-actions');
  if (!screen || !screen.classList.contains('active')) {
    showScreen('actions', null, ACTIONS_SUBPAGE_TITLES[sub] || 'Actions');
    setTimeout(() => showActionsSubpage(sub), 30);
    return;
  }

  // Hide all subpages
  document.querySelectorAll('#screen-actions .ac-subpage').forEach(p => p.classList.remove('active'));

  // Queue group → show the one queue subpage and switch its inner view
  if (QUEUE[sub]) {
    const q = document.getElementById('ac-subpage-queue');
    if (q) q.classList.add('active');
    const view = (sub === 'queue') ? 'pending' : sub;
    if (typeof acQueueShow === 'function') acQueueShow(view);
    _actionsUpdateNav('queue');
    return;
  }

  // Normal subpage
  const target = document.getElementById('ac-subpage-' + sub);
  if (target) target.classList.add('active');
  const tb = document.getElementById('tbTitle');
  if (tb) tb.textContent = ACTIONS_SUBPAGE_TITLES[sub];
  _actionsUpdateNav(sub);
}


// ── from source lines 23899-23905 (navActionsParentClick) ──
function navActionsParentClick(event) {
  // Click on parent label area: always open Actions > Overview and expand children.
  const parent = document.getElementById('navActionsParent');
  if (parent) parent.setAttribute('aria-expanded', 'true');
  showScreen('actions', null, ACTIONS_SUBPAGE_TITLES.overview);
  showActionsSubpage('overview');
}

// ── from source lines 23906-23916 (toggleActionsNav) ──
function toggleActionsNav(event) {
  // Caret only: toggle expand/collapse without opening or navigating.
  if (event) {
    event.stopPropagation();
    if (event.preventDefault) event.preventDefault();
  }
  const parent = document.getElementById('navActionsParent');
  if (!parent) return;
  const expanded = parent.getAttribute('aria-expanded') === 'true';
  parent.setAttribute('aria-expanded', expanded ? 'false' : 'true');
}

// ── from source lines 23917-23922 (navActionsParentKeydown) ──
function navActionsParentKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    navActionsParentClick(event);
  }
}

// ── from source lines 23923-23926 (navActionsChildClick) ──
function navActionsChildClick(sub, el) {
  showScreen('actions', null, ACTIONS_SUBPAGE_TITLES[sub]);
  showActionsSubpage(sub);
}

// ── from source lines 23927-23937 (navActionsChildKeydown) ──
function navActionsChildKeydown(event, sub) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    navActionsChildClick(sub);
  }
}

// ═══════════════════════════════════════════════════════════
// (v28b) LABOR EFFICIENCY — Subpage controller + sidebar handlers
// ═══════════════════════════════════════════════════════════


// ── from source lines 23947-23966 (showLaborSubpage) ──
function showLaborSubpage(sub) {
  if (!LABOR_SUBPAGE_TITLES[sub]) sub = 'overview';

  const screen = document.getElementById('screen-labor-efficiency');
  if (!screen || !screen.classList.contains('active')) {
    showScreen('labor-efficiency', null, LABOR_SUBPAGE_TITLES[sub]);
    setTimeout(() => showLaborSubpage(sub), 30);
    return;
  }

  document.querySelectorAll('#screen-labor-efficiency .le-subpage').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('le-subpage-' + sub);
  if (target) target.classList.add('active');

  const tb = document.getElementById('tbTitle');
  if (tb) tb.textContent = LABOR_SUBPAGE_TITLES[sub];

  _laborUpdateNav(sub);
}


// ── from source lines 23978-23983 (navLaborParentClick) ──
function navLaborParentClick(event) {
  const parent = document.getElementById('navLaborParent');
  if (parent) parent.setAttribute('aria-expanded', 'true');
  showScreen('labor-efficiency', null, LABOR_SUBPAGE_TITLES.overview);
  showLaborSubpage('overview');
}

// ── from source lines 23984-23993 (toggleLaborNav) ──
function toggleLaborNav(event) {
  if (event) {
    event.stopPropagation();
    if (event.preventDefault) event.preventDefault();
  }
  const parent = document.getElementById('navLaborParent');
  if (!parent) return;
  const expanded = parent.getAttribute('aria-expanded') === 'true';
  parent.setAttribute('aria-expanded', expanded ? 'false' : 'true');
}

// ── from source lines 23994-23999 (navLaborParentKeydown) ──
function navLaborParentKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    navLaborParentClick(event);
  }
}

// ── from source lines 24000-24003 (navLaborChildClick) ──
function navLaborChildClick(sub, el) {
  showScreen('labor-efficiency', null, LABOR_SUBPAGE_TITLES[sub]);
  showLaborSubpage(sub);
}

// ── from source lines 24004-24019 (navLaborChildKeydown) ──
function navLaborChildKeydown(event, sub) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    navLaborChildClick(sub);
  }
}

// ═══════════════════════════════════════════════════════════
// (v28e) SERVER COACHING — 3-axis data model + render
// Axes: revenue / retention / reliability
// Each axis has a state: 'full' | 'partial' | 'locked'
// State derived from operator's Toast data setup (demo: simulated)
// ═══════════════════════════════════════════════════════════

// Axis-level data availability (operator-side Toast setup).
// In production this is derived from data quality checks. Demo is static.

// ── from source lines 24405-24424 (showTtSubpage) ──
function showTtSubpage(sub) {
  if (!TT_SUBPAGE_TITLES[sub]) sub = 'overview';

  const screen = document.getElementById('screen-table-turns');
  if (!screen || !screen.classList.contains('active')) {
    showScreen('table-turns', null, TT_SUBPAGE_TITLES[sub]);
    setTimeout(() => showTtSubpage(sub), 30);
    return;
  }

  document.querySelectorAll('#screen-table-turns .tt-subpage').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('tt-subpage-' + sub);
  if (target) target.classList.add('active');

  const tb = document.getElementById('tbTitle');
  if (tb) tb.textContent = TT_SUBPAGE_TITLES[sub];

  _ttUpdateNav(sub);

  // Re-sync the Watch day switcher with the current sidebar location
  if (sub === 'overview' && typeof window.ttApplyLocation === 'function') {
    window.ttApplyLocation(window.SKC_LOCATION || 'All Locations');
  }
}


// ── from source lines 24436-24441 (navTtParentClick) ──
function navTtParentClick(event) {
  const parent = document.getElementById('navTtParent');
  if (parent) parent.setAttribute('aria-expanded', 'true');
  showScreen('table-turns', null, TT_SUBPAGE_TITLES.overview);
  showTtSubpage('overview');
}

// ── from source lines 24442-24451 (toggleTtNav) ──
function toggleTtNav(event) {
  if (event) {
    event.stopPropagation();
    if (event.preventDefault) event.preventDefault();
  }
  const parent = document.getElementById('navTtParent');
  if (!parent) return;
  const expanded = parent.getAttribute('aria-expanded') === 'true';
  parent.setAttribute('aria-expanded', expanded ? 'false' : 'true');
}

// ── from source lines 24452-24457 (navTtParentKeydown) ──
function navTtParentKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    navTtParentClick(event);
  }
}

// ── from source lines 24458-24461 (navTtChildClick) ──
function navTtChildClick(sub, el) {
  showScreen('table-turns', null, TT_SUBPAGE_TITLES[sub]);
  showTtSubpage(sub);
}

// ── from source lines 24462-24469 (navTtChildKeydown) ──
function navTtChildKeydown(event, sub) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    navTtChildClick(sub);
  }
}

// ── (v32) Table Turns · Watch — toggle 4-stage vs hour-by-hour view ──
function toggleWatchStageView(mode) {
  const v4 = document.getElementById('watchStageView4');
  const vh = document.getElementById('watchStageViewHourly');
  const b4 = document.getElementById('watchStageBtn4');
  const bh = document.getElementById('watchStageBtnHourly');
  if (!v4 || !vh || !b4 || !bh) return;
  const on  = (el) => { el.style.background = 'var(--surface)'; el.style.color = 'var(--t1)'; };
  const off = (el) => { el.style.background = 'transparent';    el.style.color = 'var(--t3)'; };
  if (mode === 'hourly') {
    v4.style.display = 'none';  vh.style.display = 'block';
    off(b4); on(bh);
  } else {
    v4.style.display = 'block'; vh.style.display = 'none';
    on(b4); off(bh);
  }
}

// ── Matrix: select an item ──────────────────────────────────

// ────────────────────────────────────────────────────────────────────
// Script 1 (source lines 15679-15723): Operating System drawer controls
// ────────────────────────────────────────────────────────────────────
(function(){
  var OS_DRAWERS = ['digest','gm','review','memory','detectors','renewal'];
  function $(id){ return document.getElementById(id); }
  function drawerId(name, suffix){ return 'os' + name.charAt(0).toUpperCase() + name.slice(1) + suffix; }

  window.osOpen = function(name){
    var ov = $(drawerId(name,'Overlay'));
    var dr = $(drawerId(name,'Drawer'));
    if (!ov || !dr) return;
    ov.classList.add('os-open');
    dr.classList.add('os-open');
  };
  window.osClose = function(name){
    var ov = $(drawerId(name,'Overlay'));
    var dr = $(drawerId(name,'Drawer'));
    if (!ov || !dr) return;
    ov.classList.remove('os-open');
    dr.classList.remove('os-open');
  };

  // Detector library tab switcher
  window.osSwitchTab = function(btn, key){
    var tabs = btn.parentNode.querySelectorAll('.os-d-tab');
    tabs.forEach(function(t){ t.classList.remove('os-d-tab-active'); t.setAttribute('aria-selected','false'); });
    btn.classList.add('os-d-tab-active');
    btn.setAttribute('aria-selected','true');
    var drawer = btn.closest('.os-drawer');
    if (!drawer) return;
    var panels = drawer.querySelectorAll('.os-d-tabpanel');
    panels.forEach(function(p){
      p.classList.toggle('os-d-tab-active', p.getAttribute('data-tab') === key);
    });
  };

  // ESC closes any open OS drawer
  document.addEventListener('keydown', function(e){
    if (e.key !== 'Escape') return;
    OS_DRAWERS.forEach(function(name){
      var dr = $(drawerId(name,'Drawer'));
      if (dr && dr.classList.contains('os-open')) window.osClose(name);
    });
  });
})();

// ────────────────────────────────────────────────────────────────────
// Script 2 (source lines 19034-19486): Table Turns daypart controller + drawers
// ────────────────────────────────────────────────────────────────────
(function(){

  // ── Daypart state model ──────────────────────────────────
  var DAYPARTS = {
    'fri-dinner': {
      mode: 'kds',
      eyebrow: 'Top table-turn opportunity · Oakland · Friday Dinner',
      title: 'Friday dinner may be creating ~$680/week in recoverable revenue opportunity.',
      sub: 'Dining duration is running 11 minutes above baseline during the highest-demand dinner window. Recovery only counts after guardrails on average check and guest sentiment hold during the monitoring window.',
      heroValue: '~$680',
      current: '74 min', baseline: '63 min', overage: '+11 min',
      overagePct: '17.5% above',
      covers: '9 / wk',
      bottleneck: 'Payment',
      bottleneckColor: 'var(--red)',
      bottleneckSub: '+6.5 min vs baseline',
      bottleneckChip: '<span class="tt-chip tt-chip-kds">KDS</span>',
      recBody: 'Deploy handheld closeout + check-drop script from 7–9 PM on Friday dinner.',
      recWhy: 'Payment closeout is <strong style="color:var(--t1)">+6.5 minutes above baseline</strong> and accounts for the largest recoverable stage delay.',
      patternConf: 'High', patternColor: 'var(--green)',
      revConf: 'Medium', revColor: 'var(--amber)',
      recency: 'Recurring · 3 of 4',
      modeLabel: 'KDS', modeColor: 'var(--blue)',
      sectionTitle: 'Service flow · KDS stage decomposition',
      sectionSub: 'Where the 11-minute overage is hiding · Oakland Friday Dinner',
      sectionChipHtml: '<span class="tt-chip tt-chip-kds">Precise stage timing from KDS</span>',
      stages: [
        {key:'seat',  name:'Seat→order', current:7.5, baseline:6.0,  delta:'+1.5'},
        {key:'order', name:'Order→food', current:19.0, baseline:17.5, delta:'+1.5'},
        {key:'food',  name:'Food→check', current:25.0, baseline:23.5, delta:'+1.5'},
        {key:'pay',   name:'Payment',    current:22.5, baseline:16.0, delta:'+6.5'}
      ],
      bottleneckStage: 'pay',
      pbTitle:'Friday dinner closeout playbook',
      pbBody: 'Deploy handheld closeout + check-drop script from 7–9 PM on Friday dinner.',
      pbWhy:  'Payment closeout is adding +6.5 min versus baseline and accounts for the largest share of the +11 min dining-duration overage.',
      pbOwner:'Floor Manager', pbTiming:'Friday dinner · 7–9 PM',
      pbExpected:'~$680/wk EST · not guaranteed',
      pbPattern:'High confidence (3 of 4)',
      pbPrimaryLabel:'Review Turn Playbook',
      pbPrimaryAction:'playbook',
      proofMain: 'Est. <strong>9 covers</strong> may have been missed this week — about <strong>~$680</strong> in recoverable revenue opportunity if duration returned to baseline and incremental seats actually filled.',
      proofSub: 'Seat-based capacity model · floored conservatively',
      proofFormula: ttBuildFridayFormula
    },
    'sat-dinner': {
      mode: 'kds',
      eyebrow: 'Table-turn opportunity · Oakland · Saturday Dinner',
      title: 'Saturday dinner may be creating ~$420/week in recoverable revenue opportunity.',
      sub: 'Dining duration is running 8 minutes above baseline. The biggest delay is on the food-to-check hand-off — a service-pacing review is recommended before deploying a closeout playbook.',
      heroValue: '~$420',
      current: '71 min', baseline: '63 min', overage: '+8 min',
      overagePct: '12.7% above',
      covers: '6 / wk',
      bottleneck: 'Food→check',
      bottleneckColor: 'var(--amber)',
      bottleneckSub: '+6.5 min vs baseline',
      bottleneckChip: '<span class="tt-chip tt-chip-kds">KDS</span>',
      recBody: 'Review service pacing on the food-to-check hand-off before creating a playbook.',
      recWhy: 'Food→check is <strong style="color:var(--t1)">+6.5 minutes above baseline</strong> while payment is actually faster than baseline. Verify whether expo, server check-drop timing, or table layout is causing the delay.',
      patternConf: 'Medium', patternColor: 'var(--amber)',
      revConf: 'Medium', revColor: 'var(--amber)',
      recency: 'Regressing',
      modeLabel: 'KDS', modeColor: 'var(--blue)',
      sectionTitle: 'Service flow · KDS stage decomposition',
      sectionSub: 'Where the 8-minute overage is hiding · Oakland Saturday Dinner',
      sectionChipHtml: '<span class="tt-chip tt-chip-kds">Precise stage timing from KDS</span>',
      stages: [
        {key:'seat',  name:'Seat→order', current:7.0,  baseline:6.0,  delta:'+1.0'},
        {key:'order', name:'Order→food', current:18.5, baseline:17.5, delta:'+1.0'},
        {key:'food',  name:'Food→check', current:30.0, baseline:23.5, delta:'+6.5'},
        {key:'pay',   name:'Payment',    current:15.5, baseline:16.0, delta:'−0.5'}
      ],
      bottleneckStage: 'food',
      pbTitle:'Saturday dinner service pacing review',
      pbBody: 'Review food→check hand-off pacing before deploying a playbook.',
      pbWhy:  'Food→check is +6.5 min above baseline; payment is actually faster. Underlying cause needs verification before action.',
      pbOwner:'Floor Manager + Expo lead',
      pbTiming:'Saturday dinner · service review',
      pbExpected:'~$420/wk EST · not guaranteed · needs review',
      pbPattern:'Medium confidence · regressing',
      pbPrimaryLabel:'Review Turn Playbook',
      pbPrimaryAction:'playbook',
      proofMain: 'Est. <strong>6 covers</strong> may have been missed this week — about <strong>~$420</strong> in recoverable revenue opportunity if duration returned to baseline and incremental seats actually filled.',
      proofSub: 'Seat-based capacity model · floored conservatively',
      proofFormula: ttBuildSaturdayFormula
    },
    'wed-lunch': {
      mode: 'proxy',
      eyebrow: 'Proxy-mode opportunity · Oakland · Wednesday Lunch',
      title: 'Wednesday lunch may be creating ~$115/week in recoverable revenue opportunity.',
      sub: 'Service speed is 6 minutes above baseline based on POS check timestamps. Stage-level KDS data is unavailable for this service period, so the breakdown can\'t pinpoint a kitchen vs. FOH cause yet.',
      heroValue: '~$115',
      current: '58 min', baseline: '52 min', overage: '+6 min',
      overagePct: '11.5% above',
      covers: '2 / wk',
      bottleneck: 'Stage unknown',
      bottleneckColor: 'var(--t3)',
      bottleneckSub: 'Proxy mode · no stage split',
      bottleneckChip: '<span class="tt-chip tt-chip-proxy">Proxy</span>',
      recBody: 'Connect KDS for Wednesday lunch to identify which stage is causing the delay.',
      recWhy: 'Without stage-level KDS data, SKC can flag the slow-turn pattern but can\'t recommend a precise FOH or kitchen action.',
      patternConf: 'Low', patternColor: 'var(--t3)',
      revConf: 'Low', revColor: 'var(--t3)',
      recency: 'New',
      modeLabel: 'Proxy', modeColor: 'var(--t2)',
      sectionTitle: 'Service speed · Proxy Mode',
      sectionSub: 'Stage decomposition suppressed · KDS unavailable for this service period',
      sectionChipHtml: '<span class="tt-chip tt-chip-proxy">Proxy</span> <span class="tt-chip tt-chip-heur" style="margin-left:4px">Heuristic</span>',
      proxyCurrent: 58, proxyBaseline: 52, proxyOverage: '+6 min',
      proxyHeadlineHtml: 'Wednesday lunch may be creating <strong>~$115/week</strong> in recoverable revenue opportunity. <span class="tt-chip tt-chip-est" style="margin-left:4px">EST — not guaranteed</span>',
      proxyOverageText: '+6 min · service-speed proxy only · no stage breakdown',
      pbTitle:'Wednesday lunch proxy opportunity',
      pbBody: 'Connect KDS for Wednesday lunch to identify the bottleneck before creating any FOH action.',
      pbWhy:  'Proxy mode can detect the slow-turn pattern but cannot identify which stage to fix. No safe playbook without stage data.',
      pbOwner:'GM',
      pbTiming:'Before next Wednesday lunch service',
      pbExpected:'~$115/wk EST · proxy · heuristic',
      pbPattern:'Low confidence · new',
      pbPrimaryLabel:'Connect KDS for stage breakdown',
      pbPrimaryAction:'connect-kds',
      proofMain: 'Est. <strong>2 covers</strong> may have been missed this week — about <strong>~$115</strong> in recoverable revenue opportunity. Proxy-mode estimate; precision improves once KDS stage data is available.',
      proofSub: 'Proxy mode · heuristic estimate',
      proofFormula: ttBuildWednesdayFormula
    }
  };

  // Formula renderers (defined as fns so they can lazily render fresh HTML)
  function ttBuildFridayFormula(){
    return '<div class="tt-formula-grid">'+
      '<span class="tt-fg-key">Current duration</span><span class="tt-fg-val">74 min</span>'+
      '<span class="tt-fg-key">Baseline duration</span><span class="tt-fg-val">63 min</span>'+
      '<span class="tt-fg-key">Duration overage</span><span class="tt-fg-val" style="color:var(--amber)">+11 min</span>'+
      '<span class="tt-fg-key">Seats × fill factor</span><span class="tt-fg-val">38 × 0.56</span>'+
      '<span class="tt-fg-key">Method</span><span class="tt-fg-val" style="font-family:var(--sans)">seat-based capacity model</span>'+
      '<span class="tt-fg-key">Floored lost covers</span><span class="tt-fg-val tt-f-eq">9 / wk</span>'+
      '<span class="tt-fg-key">× avg check</span><span class="tt-fg-val">× $75.50</span>'+
      '<span class="tt-fg-key" style="border-top:1px solid var(--border);padding-top:6px">Revenue opportunity</span>'+
      '<span class="tt-fg-val tt-f-eq" style="border-top:1px solid var(--border);padding-top:6px;color:var(--amber)">~$680 / wk</span>'+
      '</div>';
  }
  function ttBuildSaturdayFormula(){
    return '<div class="tt-formula-grid">'+
      '<span class="tt-fg-key">Current duration</span><span class="tt-fg-val">71 min</span>'+
      '<span class="tt-fg-key">Baseline duration</span><span class="tt-fg-val">63 min</span>'+
      '<span class="tt-fg-key">Duration overage</span><span class="tt-fg-val" style="color:var(--amber)">+8 min</span>'+
      '<span class="tt-fg-key">Seats × fill factor</span><span class="tt-fg-val">38 × 0.56</span>'+
      '<span class="tt-fg-key">Method</span><span class="tt-fg-val" style="font-family:var(--sans)">seat-based capacity model</span>'+
      '<span class="tt-fg-key">Floored lost covers</span><span class="tt-fg-val tt-f-eq">6 / wk</span>'+
      '<span class="tt-fg-key">× avg check</span><span class="tt-fg-val">× $75.50</span>'+
      '<span class="tt-fg-key" style="border-top:1px solid var(--border);padding-top:6px">Revenue opportunity</span>'+
      '<span class="tt-fg-val tt-f-eq" style="border-top:1px solid var(--border);padding-top:6px;color:var(--amber)">~$420 / wk</span>'+
      '</div>';
  }
  function ttBuildWednesdayFormula(){
    return '<div class="tt-formula-grid">'+
      '<span class="tt-fg-key">Current duration</span><span class="tt-fg-val">58 min</span>'+
      '<span class="tt-fg-key">Baseline duration</span><span class="tt-fg-val">52 min</span>'+
      '<span class="tt-fg-key">Duration overage</span><span class="tt-fg-val" style="color:var(--amber)">+6 min</span>'+
      '<span class="tt-fg-key">Method</span><span class="tt-fg-val" style="font-family:var(--sans)">proxy / heuristic (KDS unavailable)</span>'+
      '<span class="tt-fg-key">Floored lost covers</span><span class="tt-fg-val tt-f-eq">2 / wk</span>'+
      '<span class="tt-fg-key">× avg check</span><span class="tt-fg-val">× ~$57.50 lunch avg</span>'+
      '<span class="tt-fg-key" style="border-top:1px solid var(--border);padding-top:6px">Revenue opportunity</span>'+
      '<span class="tt-fg-val tt-f-eq" style="border-top:1px solid var(--border);padding-top:6px;color:var(--amber)">~$115 / wk</span>'+
      '</div>';
  }

  // ── Stage detail copy ───────────────────────────────────
  var STAGE_DETAILS = {
    seat: {
      label: 'Seat → Order',
      modeChip: '<span class="tt-chip tt-chip-det">Deterministic</span>',
      source: 'Toast POS opened_at + first_order_at (KDS) timestamps',
      output: 'Deterministic stage timing · KDS source present',
      recPay: 'Minor delay; not the primary bottleneck. Monitor only.',
      deltaColor: 'var(--amber)'
    },
    order: {
      label: 'Order → Food',
      modeChip: '<span class="tt-chip tt-chip-det">Deterministic</span>',
      source: 'Toast KDS first_order_at → kds_done_at',
      output: 'Deterministic stage timing · KDS source present',
      recPay: 'Kitchen-driven. If this becomes primary, open Kitchen Speed before creating a FOH table-turn action.',
      deltaColor: 'var(--amber)'
    },
    food: {
      label: 'Food → Check',
      modeChip: '<span class="tt-chip tt-chip-det">Deterministic</span>',
      source: 'Toast KDS kds_done_at → check_requested_at',
      output: 'Deterministic stage timing · KDS source present',
      recPay: 'FOH pacing issue. Review server check-drop timing and expo hand-off.',
      deltaColor: 'var(--amber)'
    },
    pay: {
      label: 'Payment closeout',
      modeChip: '<span class="tt-chip tt-chip-det">Deterministic · High confidence</span>',
      source: 'Toast POS check request timestamp + Toast POS close timestamp',
      output: 'Deterministic · High confidence',
      recPay: 'Deploy handheld closeout + check-drop script from 7–9 PM.',
      deltaColor: 'var(--red)',
      tagText: 'Largest recoverable delay'
    }
  };

  // ── State ───────────────────────────────────────────────
  var ttState = { dp: 'fri-dinner', selectedStage: 'pay' };

  // ── Helpers ─────────────────────────────────────────────
  function $(id){ return document.getElementById(id); }
  function setText(id, val){ var el = $(id); if (el) el.textContent = val; }
  function setHtml(id, val){ var el = $(id); if (el) el.innerHTML = val; }

  // ── Render stage bars (KDS mode) ────────────────────────
  function renderStageBars(dp){
    var stages = dp.stages || [];
    var currentSum = stages.reduce(function(a,s){return a+s.current},0);
    var baselineSum = stages.reduce(function(a,s){return a+s.baseline},0);
    setText('ttKdsCurrentTotal',  currentSum.toFixed(1)+' min');
    setText('ttKdsBaselineTotal', baselineSum.toFixed(1)+' min');
    setText('ttKdsDeltaLabel',    (currentSum>baselineSum?'+':'')+(currentSum-baselineSum).toFixed(1)+' vs baseline');
    setText('ttKdsCurrentSum',    stages.map(function(s){return s.current.toFixed(1)}).join(' + ')+' = '+currentSum.toFixed(1)+' min');
    setText('ttKdsBaselineSum',   stages.map(function(s){return s.baseline.toFixed(1)}).join(' + ')+' = '+baselineSum.toFixed(1)+' min');

    var segClass = { seat:'tt-seg-seat', order:'tt-seg-order', food:'tt-seg-food', pay:'tt-seg-pay' };
    var bot = dp.bottleneckStage;

    // Current bar
    var curBar = $('ttKdsCurrentBar');
    curBar.innerHTML = stages.map(function(s){
      var emph = (s.key === bot) ? ' tt-seg-emph' : '';
      var active = (s.key === ttState.selectedStage) ? ' tt-seg-active' : '';
      var tagHtml = (s.key === bot && STAGE_DETAILS[s.key].tagText) ? '<span class="tt-seg-tag">'+STAGE_DETAILS[s.key].tagText+'</span>' : '';
      var deltaCls = (s.key === bot) ? ' tt-delta-red' : '';
      var deltaSym = s.delta;
      var deltaHtml = '<span class="tt-seg-delta'+deltaCls+'">'+(deltaSym.indexOf('+')===0?'↑ ':(deltaSym.indexOf('−')===0?'↓ ':''))+deltaSym.replace(/[+−]/,'')+' min</span>';
      return '<button type="button" class="tt-stage-seg '+segClass[s.key]+emph+active+'" style="flex:'+s.current+'" aria-label="'+s.name+' · current '+s.current+' min, baseline '+s.baseline+' min, delta '+s.delta+' min" onclick="ttShowStage(\''+s.key+'\')">'+
        tagHtml +
        '<span class="tt-seg-name">'+s.name+'</span>'+
        '<span class="tt-seg-min">'+s.current.toFixed(1)+'</span>'+
        deltaHtml +
      '</button>';
    }).join('');

    // Baseline ghost bar — width relative to current total
    var basePct = (baselineSum / currentSum * 100).toFixed(2);
    $('ttKdsBaselineBar').style.width = basePct+'%';
    $('ttKdsBaselineBar').innerHTML = stages.map(function(s){
      return '<div class="tt-stage-seg '+segClass[s.key]+'" style="flex:'+s.baseline+'" aria-hidden="true">'+
        '<span class="tt-seg-name">'+s.name+'</span>'+
        '<span class="tt-seg-min">'+s.baseline.toFixed(1)+'</span>'+
      '</div>';
    }).join('');

    // Stage caption based on bottleneck
    var captionByStage = {
      pay: 'Stage timing uses POS and Toast KDS timestamps. Payment closeout is the largest recoverable delay. Tap any segment for source data, output type, and recommendation.',
      food: 'Stage timing uses POS and Toast KDS timestamps. Food→check is the largest delay — service pacing review recommended before any playbook.',
      order: 'Stage timing uses POS and Toast KDS timestamps. Order→food is the largest delay — this is a kitchen-driven bottleneck; open Kitchen Speed before any FOH action.',
      seat: 'Stage timing uses POS and Toast KDS timestamps.'
    };
    setText('ttStageCaption', captionByStage[bot] || captionByStage.pay);
  }

  // ── Show stage detail ───────────────────────────────────
  window.ttShowStage = function(key){
    var dp = DAYPARTS[ttState.dp];
    if (!dp || dp.mode !== 'kds') return;
    var stages = dp.stages;
    var s = stages.find(function(x){return x.key === key});
    if (!s) return;
    var copy = STAGE_DETAILS[key];

    ttState.selectedStage = key;

    setHtml('ttStageDetailTitle',
      '<span style="color:var(--t1)">'+copy.label+'</span> '+copy.modeChip
      + (key === dp.bottleneckStage ? ' <span class="tt-chip tt-chip-red">Largest recoverable delay</span>' : '')
    );
    setHtml('ttStageDetailGrid',
      '<div>Current <strong>'+s.current.toFixed(1)+' min</strong></div>'+
      '<div>Baseline <strong>'+s.baseline.toFixed(1)+' min</strong></div>'+
      '<div>Overage <strong style="color:'+copy.deltaColor+'">'+s.delta+' min</strong></div>'
    );
    setHtml('ttStageDetailSource', '<strong>Source:</strong> '+copy.source+' &nbsp;·&nbsp; <strong>Output:</strong> '+copy.output);

    // Tailor recommendation by bottleneck stage
    var recHtml = '';
    if (key === 'pay'){
      recHtml = '<strong>Recommendation:</strong> '+copy.recPay;
    } else if (key === 'order'){
      recHtml = '<strong>Recommendation:</strong> '+copy.recPay + ' <button type="button" class="tt-q-cta" onclick="showScreen(\'throughput\',null,\'Kitchen Speed\')">Open Kitchen Speed →</button>';
    } else if (key === 'food'){
      recHtml = '<strong>Recommendation:</strong> '+copy.recPay;
    } else {
      recHtml = '<strong>Recommendation:</strong> '+copy.recPay;
    }
    setHtml('ttStageDetailRec', recHtml);

    // Update active class on segments
    document.querySelectorAll('#ttKdsCurrentBar .tt-stage-seg').forEach(function(el){ el.classList.remove('tt-seg-active'); });
    var idx = stages.findIndex(function(x){return x.key===key});
    var segs = document.querySelectorAll('#ttKdsCurrentBar .tt-stage-seg');
    if (segs[idx]) segs[idx].classList.add('tt-seg-active');
  };

  // ── Daypart switch (REAL — updates everything) ──────────
  window.ttSetDaypart = function(key){
    var dp = DAYPARTS[key];
    if (!dp) return;
    ttState.dp = key;
    ttState.selectedStage = dp.bottleneckStage || 'pay';

    // Update daypart card active + ARIA
    document.querySelectorAll('#screen-table-turns .tt-dp-card').forEach(function(c){
      c.classList.remove('tt-dp-active');
      c.setAttribute('aria-selected','false');
    });
    var cardId = key === 'fri-dinner' ? 'ttDpFri' : (key === 'sat-dinner' ? 'ttDpSat' : 'ttDpWed');
    var card = $(cardId);
    if (card){ card.classList.add('tt-dp-active'); card.setAttribute('aria-selected','true'); }

    // Hero
    setText('ttHeroEyebrow', dp.eyebrow);
    setText('ttHeroTitle', dp.title);
    setText('ttHeroSub', dp.sub);
    setText('ttHeroValue', dp.heroValue);
    setText('ttHeroCurrent', dp.current);
    setText('ttHeroBaseline', dp.baseline);
    setText('ttHeroOverage', dp.overage);
    setText('ttHeroOveragePct', dp.overagePct);
    setText('ttHeroCovers', dp.covers);
    setHtml('ttHeroRecBody', dp.recBody);
    setHtml('ttHeroRecWhy',  dp.recWhy);
    setText('ttHeroPatternConf', dp.patternConf);
    $('ttHeroPatternConf').style.color = dp.patternColor;
    setText('ttHeroRevConf', dp.revConf);
    $('ttHeroRevConf').style.color = dp.revColor;
    setText('ttHeroRecency', dp.recency);
    setText('ttHeroMode', dp.modeLabel);
    $('ttHeroMode').style.color = dp.modeColor;

    // Summary strip
    setText('ttSumDur', dp.current);
    setText('ttSumDurSub', dp.overage+' vs '+dp.baseline+' baseline');
    setText('ttSumRev', dp.heroValue+' / wk');
    setText('ttSumCovers', dp.covers);
    setText('ttSumBottle', dp.bottleneck);
    $('ttSumBottle').style.color = dp.bottleneckColor;
    setText('ttSumBottleSub', dp.bottleneckSub);
    setHtml('ttSumBottleChip', dp.bottleneckChip);

    // Section header (above stage diagram)
    setText('ttStageSectionTitle', dp.sectionTitle);
    setText('ttStageSectionSub', dp.sectionSub);
    setHtml('ttStageSectionChip', dp.sectionChipHtml);

    // Mode panels
    var modeKds = $('ttModeKds');
    var modeProxy = $('ttModeProxy');
    if (dp.mode === 'kds'){
      modeKds.classList.add('tt-active');
      modeProxy.classList.remove('tt-active');
      renderStageBars(dp);
      // Open bottleneck stage by default (audit fix #5)
      ttShowStage(dp.bottleneckStage);
    } else {
      modeKds.classList.remove('tt-active');
      modeProxy.classList.add('tt-active');
      setHtml('ttProxyHeadline', dp.proxyHeadlineHtml);
      // Bar widths: current is reference = 100%, baseline relative
      var maxVal = Math.max(dp.proxyCurrent, dp.proxyBaseline);
      $('ttProxyCurrentFill').style.width = (dp.proxyCurrent / maxVal * 100).toFixed(2)+'%';
      $('ttProxyBaselineFill').style.width = (dp.proxyBaseline / maxVal * 100).toFixed(2)+'%';
      setText('ttProxyCurrentNum', dp.proxyCurrent+' min');
      setText('ttProxyBaselineNum', dp.proxyBaseline+' min');
      setText('ttProxyOverageText', dp.proxyOverageText);
    }

    // Proof panel
    setHtml('ttProofMain', dp.proofMain);
    setText('ttProofSub', dp.proofSub);
    setHtml('ttProofFormula', dp.proofFormula());

    // Playbook card
    setText('ttPbTitle', dp.pbTitle);
    setText('ttPbBody', dp.pbBody);
    setHtml('ttPbWhy', dp.pbWhy);
    setText('ttPbOwner', dp.pbOwner);
    setText('ttPbTiming', dp.pbTiming);
    setText('ttPbExpected', dp.pbExpected);
    setText('ttPbPattern', dp.pbPattern);
    $('ttPbPattern').style.color = (dp.patternConf === 'High') ? 'var(--green)' : (dp.patternConf === 'Medium' ? 'var(--amber)' : 'var(--t3)');

    // Update primary CTA labels
    setText('ttHeroPrimaryCta', dp.pbPrimaryLabel);
    setText('ttPbPrimaryCta', dp.pbPrimaryLabel);
  };

  // ── Hero primary action (varies by daypart) ─────────────
  window.ttHeroPrimaryAction = function(){
    var dp = DAYPARTS[ttState.dp];
    if (dp && dp.pbPrimaryAction === 'connect-kds'){
      showScreen('settings', null, 'Data Quality');
    } else {
      ttOpenPlaybook();
    }
  };

  // ── Drawer open/close ──────────────────────────────────
  window.ttOpenPlaybook = function(){
    $('ttPlaybookOverlay').classList.add('tt-open');
    $('ttPlaybookDrawer').classList.add('tt-open');
  };
  window.ttClosePlaybook = function(){
    $('ttPlaybookOverlay').classList.remove('tt-open');
    $('ttPlaybookDrawer').classList.remove('tt-open');
  };
  window.ttOpenEvidence = function(){
    $('ttEvidenceOverlay').classList.add('tt-open');
    $('ttEvidenceDrawer').classList.add('tt-open');
  };
  window.ttCloseEvidence = function(){
    $('ttEvidenceOverlay').classList.remove('tt-open');
    $('ttEvidenceDrawer').classList.remove('tt-open');
  };

  // ── Create Action ──────────────────────────────────────
  window.ttCreateAction = function(){
    var dp = DAYPARTS[ttState.dp];
    var msg = 'Action drafted · '+ (dp ? dp.pbTitle : 'Table-turn playbook') +' · Ready in Actions';
    if (typeof showDemoToast === 'function') showDemoToast(msg,'green');
    if ($('ttPlaybookDrawer').classList.contains('tt-open')) ttClosePlaybook();
    if ($('ttEvidenceDrawer').classList.contains('tt-open')) ttCloseEvidence();
  };

  // ── ESC closes drawers ─────────────────────────────────
  document.addEventListener('keydown', function(e){
    if (e.key !== 'Escape') return;
    if ($('ttPlaybookDrawer') && $('ttPlaybookDrawer').classList.contains('tt-open')) ttClosePlaybook();
    if ($('ttEvidenceDrawer') && $('ttEvidenceDrawer').classList.contains('tt-open')) ttCloseEvidence();
  });

  // ── Initialize on first navigation to screen ───────────
  document.addEventListener('DOMContentLoaded', function(){
    // Render initial state (Friday dinner · payment selected)
    var dp = DAYPARTS['fri-dinner'];
    renderStageBars(dp);
    ttShowStage('pay');
  });

})();

// ════════════════════════════════════════════════════════════════════
// (table_turns) Watch · day switcher + sidebar-location filter
//
// The Watch overview is one <div class="tt-day-view"> per service day.
// #ttDay-friday is the hand-built static layout (untouched); #ttDay-saturday
// and #ttDay-sunday are generated from TT_WATCH_SCENARIOS by ttRenderDay()
// into that same Friday layout; #ttDay-empty covers no-data locations.
// This controller shows exactly one at a time and keeps the header day
// dropdown in sync with the sidebar location.
// ════════════════════════════════════════════════════════════════════
(function(){
  function $(id){ return document.getElementById(id); }

  // Which location each service day belongs to (all Oakland for now)
  var DAY_LOCATION = { friday: 'Oakland', saturday: 'Oakland', sunday: 'Oakland' };
  var DAY_LABEL    = { friday: 'Friday Dinner', saturday: 'Saturday Dinner', sunday: 'Sunday Dinner' };
  var ALL_DAYS     = ['friday', 'saturday', 'sunday'];
  var currentDay   = 'friday';

  // ── Render helpers (reproduce the Friday static layout from data) ──
  function pct(min, total){ return (min / total * 100).toFixed(2); }
  function sevColor(s){ return s === 'red' ? 'var(--red)' : s === 'amber' ? 'var(--amber)' : 'var(--green)'; }
  function sevBg(s){ return s === 'red' ? 'rgba(239,68,68,.32)' : 'rgba(245,158,11,.30)'; }
  function stripClass(st){ return st === 'danger' ? 'is-bad' : st === 'strong' ? 'is-good' : st === 'warning' ? 'is-warn' : ''; }
  function boldFirst(msg){
    var i = msg.indexOf('. ');
    if (i === -1) return '<strong style="color:var(--t1)">' + msg + '</strong>';
    return '<strong style="color:var(--t1)">' + msg.slice(0, i + 1) + '</strong>' + msg.slice(i + 1);
  }
  var GREY = [0.28, 0.18, 0.24, 0.18, 0.22];

  function ttRenderDay(s){
    var sb = s.stageBreakdown;
    var total = sb.actualTotalMin;
    var bn = sb.stages.filter(function(x){ return x.status === 'bottleneck'; })[0] || sb.stages[sb.stages.length - 1];
    var f = s.formula.values;
    var rev = Math.round(f.missedRevenue);

    // 1 · headline
    var headline =
      '<div style="padding:14px 16px;margin-bottom:12px;background:var(--card);border:1px solid var(--border);border-left:3px solid var(--amber);border-radius:6px;font-size:13.5px;line-height:1.55;color:var(--t2)">' +
        boldFirst(s.heroInsight.message) +
      '</div>';

    // 2 · 4-cell strip
    var strip = '<div class="sp-strip" style="grid-template-columns:repeat(4,1fr)">' +
      s.summaryCards.map(function(c){
        var subColor = (c.status === 'warning' || c.status === 'danger') ? 'color:var(--amber)' : '';
        return '<div class="sp-strip-cell ' + stripClass(c.status) + '"><div class="sp-strip-k">' + c.label +
          '</div><div class="sp-strip-v">' + c.value +
          '</div><div class="sp-strip-sub" style="' + subColor + '">' + c.subtext + '</div></div>';
      }).join('') +
    '</div>';

    // 3a · LEFT panel — Why <day> is slow
    var dp = s.diagnosisPanel;
    var left =
      '<div class="tt-ov-panel"><div class="tt-ov-panel-h"><span>' + dp.eyebrow + '</span><span class="tag-kds tag-pill">' + dp.badge + '</span></div>' +
      '<div class="tt-ov-body"><div class="hero-card">' +
        '<div class="hero-title">' + dp.headline + '</div>' +
        '<div class="hero-sub">' + dp.body + '</div>' +
        '<div class="hero-value-block"><span class="hero-value-num">~$' + dp.estimatedWeeklyRevenue + '</span>' +
          '<span class="hero-value-period">/wk · estimated, not guaranteed</span></div>' +
        '<div style="font-size:11.5px;color:var(--t2);line-height:1.6;margin-top:8px">' + dp.explanation + '</div>' +
        '<details style="margin-top:8px;font-size:10.5px;color:var(--t3)">' +
          '<summary style="cursor:pointer;color:var(--blue);user-select:none">Show the formula</summary>' +
          '<div style="margin-top:6px;padding:8px 10px;background:var(--card);border:1px solid var(--border);border-radius:4px;font-family:var(--mono);line-height:1.7">' +
            f.missedTables + ' tables × $' + f.averageCheck + ' avg check = ~$' + rev + '/wk<br>' +
            '~$' + rev + ' × 4.33 weeks = ~$' + dp.monthlyPace + '/mo<br>' +
            'Tables-missed always rounded <em>down</em>, never up.<br>' +
            'Confidence in the pattern: ' + s.heroInsight.patternConfidence + '% · in the dollar amount: medium' +
          '</div></details>' +
        '<div class="hero-ctas">' +
          '<button class="btn btn-primary btn-sm" onclick="showTtSubpage(\'playbooks\')">See what to do</button>' +
          '<button class="btn btn-secondary btn-sm" onclick="showTtSubpage(\'evidence\')">See full math</button>' +
        '</div></div></div></div>';

    // 3b · CENTER panel — Where the time goes
    var targetSegs = sb.stages.filter(function(x){ return x.targetMin > 0; }).map(function(x, i){
      return '<div style="width:' + pct(x.targetMin, total) + '%;background:rgba(161,161,170,' + GREY[i % 5] + ');border-right:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:9.5px;color:var(--t2);font-family:var(--mono);font-weight:700">' + x.targetMin + '</div>';
    }).join('');
    var actualSegs = sb.stages.map(function(x, i){
      if (x.status === 'bottleneck'){
        var out = '';
        if (x.targetMin > 0){
          out += '<div style="width:' + pct(x.targetMin, total) + '%;background:rgba(161,161,170,' + GREY[i % 5] + ');border-right:1px solid var(--amber);display:flex;align-items:center;justify-content:center;font-size:9.5px;color:var(--t1);font-family:var(--mono);font-weight:700">' + x.targetMin + '</div>';
        }
        out += '<div style="width:' + pct(x.delta, total) + '%;background:var(--amber);display:flex;align-items:center;justify-content:center;font-size:9.5px;color:#fff;font-family:var(--mono);font-weight:700">+' + x.delta + '</div>';
        return out;
      }
      return '<div style="width:' + pct(x.actualMin, total) + '%;background:rgba(161,161,170,' + GREY[i % 5] + ');border-right:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--t1);font-family:var(--mono);font-weight:700">' + x.actualMin + '</div>';
    }).join('');
    var stageLabels = sb.stages.map(function(x){
      var isBn = x.status === 'bottleneck';
      return '<div style="width:' + pct(x.actualMin, total) + '%;font-size:9px;color:' + (isBn ? 'var(--amber)' : 'var(--t3)') + ';text-align:center;line-height:1.2' + (isBn ? ';font-weight:700' : '') + '">' + x.id + ' · ' + x.name + (isBn ? ' ⚠' : '') + '</div>';
    }).join('');
    var stageCards = sb.stages.map(function(x){
      var isBn = x.status === 'bottleneck';
      var statusText = isBn ? 'bottleneck' : (x.status === 'on_target' ? 'on target' : 'in tolerance');
      return '<div style="padding:6px 8px;background:' + (isBn ? 'var(--amber-d)' : 'var(--card)') + ';border:1px solid ' + (isBn ? 'var(--amber-b)' : 'var(--border)') + ';border-radius:4px;text-align:center">' +
        '<div style="font-size:8.5px;color:' + (isBn ? 'var(--amber)' : 'var(--t3)') + ';font-weight:700;letter-spacing:.04em;text-transform:uppercase">Stage ' + x.id + (isBn ? ' ⚠' : '') + '</div>' +
        '<div style="font-family:var(--mono);font-size:' + (isBn ? '12' : '11') + 'px;color:' + (isBn ? 'var(--amber)' : 'var(--t2)') + ';font-weight:700;margin-top:2px">' + (x.delta > 0 ? '+' : '') + x.delta + '</div>' +
        '<div style="font-size:8px;color:' + (isBn ? 'var(--amber)' : 'var(--t3)') + ';margin-top:1px' + (isBn ? ';font-weight:600' : '') + '">' + statusText + '</div></div>';
    }).join('');
    var center =
      '<div class="tt-ov-panel"><div class="tt-ov-panel-h"><span>Where the time goes · ' + sb.stageCount + ' stages</span></div>' +
      '<div class="tt-ov-body"><div>' +
        '<div style="display:flex;align-items:flex-end;gap:12px;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--border)">' +
          '<div><div style="font-family:var(--mono);font-size:30px;font-weight:700;color:var(--amber);line-height:1">' + total + '<span style="font-size:14px;color:var(--t3);font-weight:500;margin-left:3px">min</span></div>' +
            '<div style="font-size:9.5px;color:var(--t3);text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-top:3px">Actual · this week</div></div>' +
          '<div style="font-family:var(--mono);font-size:18px;color:var(--t3);padding-bottom:4px">vs</div>' +
          '<div><div style="font-family:var(--mono);font-size:22px;font-weight:700;color:var(--t2);line-height:1">' + sb.targetTotalMin + '<span style="font-size:13px;color:var(--t3);font-weight:500;margin-left:3px">min</span></div>' +
            '<div style="font-size:9.5px;color:var(--t3);text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-top:3px">Your target</div></div>' +
          '<div style="margin-left:auto;text-align:right"><div style="font-family:var(--mono);font-size:16px;font-weight:700;color:var(--amber);line-height:1">+' + sb.overTargetMin + ' min</div>' +
            '<div style="font-size:9.5px;color:var(--t3);margin-top:3px;line-height:1.4">' + bn.delta + ' of ' + sb.overTargetMin + ' are in<br><strong style="color:var(--amber)">Stage ' + bn.id + ' alone</strong></div></div>' +
        '</div>' +
        '<div style="margin-bottom:14px">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">' +
            '<div style="font-size:9.5px;color:var(--t3);width:50px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;flex-shrink:0">Target</div>' +
            '<div style="flex:1;display:flex;height:24px;border-radius:3px;background:var(--surface);border:1px solid var(--border);overflow:hidden">' + targetSegs + '</div>' +
            '<div style="font-size:11px;color:var(--t2);font-family:var(--mono);font-weight:700;width:36px;text-align:right;flex-shrink:0">' + sb.targetTotalMin + '</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px">' +
            '<div style="font-size:9.5px;color:var(--t1);width:50px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;flex-shrink:0">Actual</div>' +
            '<div style="flex:1;display:flex;height:24px;border-radius:3px;background:var(--surface);border:1px solid var(--border);overflow:hidden">' + actualSegs + '</div>' +
            '<div style="font-size:11px;color:var(--amber);font-family:var(--mono);font-weight:700;width:36px;text-align:right;flex-shrink:0">' + total + '</div>' +
          '</div>' +
          '<div style="display:flex;gap:0;margin-top:6px;padding-left:58px;padding-right:44px">' + stageLabels + '</div>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(' + sb.stageCount + ',1fr);gap:4px;margin-bottom:12px">' + stageCards + '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
          '<div style="padding:8px 10px;background:var(--card);border:1px solid var(--border);border-radius:4px"><div style="font-size:9.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--t3);margin-bottom:3px">Total now</div><div style="font-size:14px;color:var(--amber);font-family:var(--mono);font-weight:700">' + total + ' min</div></div>' +
          '<div style="padding:8px 10px;background:var(--card);border:1px solid var(--border);border-radius:4px"><div style="font-size:9.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--t3);margin-bottom:3px">Your target</div><div style="font-size:14px;color:var(--t1);font-family:var(--mono);font-weight:700">' + sb.targetTotalMin + ' min</div></div>' +
        '</div>' +
      '</div></div></div>';

    // 3c · RIGHT panel — What to do / is it safe
    var rec = s.recommendedActionCard;
    var sg = s.serviceGuardrails;
    var checks = sg.checks.map(function(c){
      var mono = /\$|%/.test(c.current) ? ';font-family:var(--mono)' : '';
      return '<div style="display:flex;justify-content:space-between"><span>' + c.label + '</span><strong style="color:var(--green)' + mono + '">' + c.current + '</strong></div>';
    }).join('');
    var right =
      '<div class="tt-ov-panel"><div class="tt-ov-panel-h">What to do · is it safe?</div><div class="tt-ov-body">' +
        '<div style="background:var(--card);border:1px solid var(--border);border-left:3px solid var(--blue);border-radius:4px;padding:11px 13px;margin-bottom:8px">' +
          '<div style="font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--blue);margin-bottom:4px">Recommended action</div>' +
          '<div style="font-size:12px;color:var(--t1);font-weight:600;line-height:1.4">' + rec.action + '</div>' +
          '<div style="font-size:10.5px;color:var(--t3);margin-top:4px;line-height:1.5">' + rec.description + '</div>' +
          '<div style="margin-top:8px;display:flex;gap:6px"><button class="btn btn-primary btn-sm" onclick="showTtSubpage(\'playbooks\')">Turn into Action</button></div>' +
        '</div>' +
        '<div style="background:var(--card);border:1px solid var(--border);border-left:3px solid var(--green);border-radius:4px;padding:11px 13px;margin-bottom:8px">' +
          '<div style="font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--green);margin-bottom:4px">Will it hurt service?</div>' +
          '<div style="font-size:12px;color:var(--t1);font-weight:600;line-height:1.4">' + sg.summary + '</div>' +
          '<div style="font-size:10.5px;color:var(--t3);margin-top:6px;line-height:1.7">' + checks + '</div>' +
          '<div style="font-size:10px;color:var(--t3);margin-top:8px;padding-top:7px;border-top:1px dashed var(--border);font-style:italic;line-height:1.5">' + sg.warning + '</div>' +
        '</div>' +
      '</div></div>';

    // 4 · Hour-by-hour
    var rows = s.hourlyRows.map(function(h){
      var col = sevColor(h.severity);
      var bg;
      if (h.severity === 'green'){
        bg = 'rgba(34,197,94,.18)';
      } else {
        var greenPct = Math.max(0, 100 - (h.overTargetMin / h.totalMin * 100)).toFixed(0);
        bg = 'linear-gradient(90deg,rgba(34,197,94,.18) ' + greenPct + '%,' + sevBg(h.severity) + ' ' + greenPct + '%)';
      }
      return '<div style="color:var(--t3);font-weight:700">' + h.hour + '</div>' +
        '<div style="background:' + bg + ';height:22px;border-radius:3px;display:flex;align-items:center;padding:0 8px;color:' + col + ';font-size:10px;font-family:var(--sans)">' + h.label + '</div>' +
        '<div style="color:' + col + ';font-weight:700">' + h.totalMin + 'm</div>';
    }).join('');
    var hourly =
      '<div class="tt-ov-panel" style="margin-top:12px"><div class="tt-ov-panel-h"><span>Hour-by-hour · ' + s.day + ' ' + s.service.toLowerCase() + ' ' + s.timeWindow + '</span></div>' +
      '<div class="tt-ov-body"><div>' +
        '<div style="font-size:11px;color:var(--t3);margin-bottom:8px;line-height:1.5">Each row is one hour of ' + s.day + ' ' + s.service.toLowerCase() + ' service. The <strong style="color:var(--amber)">amber section</strong> shows where Stage ' + bn.id + ' (' + bn.name + ') is running over target.</div>' +
        '<div style="display:grid;grid-template-columns:auto 1fr auto;gap:8px 10px;font-size:11px;font-family:var(--mono);align-items:center">' + rows + '</div>' +
        '<div style="margin-top:10px;padding:8px 10px;background:var(--card);border:1px solid var(--border);border-radius:4px;font-size:10.5px;color:var(--t3);line-height:1.5">' + s.worstStretch.message + '</div>' +
      '</div></div></div>';

    return headline + strip + '<div class="tt-ov-grid">' + left + center + right + '</div>' + hourly;
  }

  // Inject the generated Saturday / Sunday markup into their containers.
  // Idempotent: runs once, but safe to call repeatedly (e.g. lazily on first
  // switch) so it self-heals regardless of init timing.
  var generatedBuilt = false;
  function ttBuildGeneratedDays(){
    if (generatedBuilt) return;
    var scenarios = (typeof TT_WATCH_SCENARIOS !== 'undefined') ? TT_WATCH_SCENARIOS
                  : (window.TT_WATCH_SCENARIOS || null);
    if (!scenarios) return;
    var any = false;
    Object.keys(scenarios).forEach(function(key){
      var el = $('ttDay-' + key);
      if (!el) return;
      try { el.innerHTML = ttRenderDay(scenarios[key]); any = true; }
      catch (err){ console.warn('[table_turns] render failed for ' + key + ':', err); }
    });
    if (any) generatedBuilt = true;
  }

  // Show one day view, hide the rest. Unknown / no-data → #ttDay-empty.
  window.ttSwitchDay = function(key){
    ttBuildGeneratedDays(); // lazy safety net — build generated days if not yet built
    var views = document.querySelectorAll('#tt-subpage-overview .tt-day-view');
    if (!views.length) return;
    views.forEach(function(v){ v.style.display = 'none'; });
    var target = $('ttDay-' + key);
    if (target){
      target.style.display = '';
      currentDay = key;
    } else {
      var empty = $('ttDay-empty');
      if (empty) empty.style.display = '';
    }
    var sel = $('ttDaySel');
    if (sel && key !== '__none__' && sel.value !== key) sel.value = key;
  };

  // Filter the header day dropdown to the chosen sidebar location, then
  // select a sensible default and render it.
  window.ttApplyLocation = function(loc){
    var sel = $('ttDaySel');
    if (!sel) return; // not on the Table Turns screen yet
    var visible = ALL_DAYS.filter(function(d){
      if (!loc || loc === 'All Locations') return true;
      return DAY_LOCATION[d] === loc;
    });
    sel.innerHTML = '';
    visible.forEach(function(d){
      var o = document.createElement('option');
      o.value = d;
      o.textContent = DAY_LABEL[d];
      sel.appendChild(o);
    });
    if (visible.length === 0){
      sel.disabled = true;
      ttSwitchDay('__none__'); // → empty state
      return;
    }
    sel.disabled = false;
    var pick = visible.indexOf(currentDay) !== -1 ? currentDay : visible[0];
    sel.value = pick;
    ttSwitchDay(pick);
  };

  // Sidebar location selector calls this.
  window.setSKCLocation = function(loc){
    window.SKC_LOCATION = loc;
    ttApplyLocation(loc);
  };

  document.addEventListener('DOMContentLoaded', function(){
    ttBuildGeneratedDays();
    ttApplyLocation(window.SKC_LOCATION || 'All Locations');
  });
})();

