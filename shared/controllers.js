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

  // Remember subpage for refresh-resume (overwrites showScreen's sub:null)
  saveLastView({ screen: 'menu', sub, title: MENU_SUBPAGE_TITLES[sub] });

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
// (v33) Actions is now one flat board (Hero · Kanban · Proof). This is a COMPAT
// SHIM so the ~30 legacy callers (per-section "Open in Actions" links, the
// submitCA deep-link, sidebar, etc.) keep resolving: it opens the board screen
// and scroll-anchors to the relevant section.
//   history  → Proof block        ·   evidence → doctrine expander
//   overview / queue / pending / active / ready / blocked → the board
function showActionsSubpage(sub) {
  const screen = document.getElementById('screen-actions');
  if (!screen || !screen.classList.contains('active')) {
    showScreen('actions', null, 'Actions');
    setTimeout(() => showActionsSubpage(sub), 40);
    return;
  }
  const anchorId = (sub === 'history')  ? 'ac-proof'
                 : (sub === 'evidence') ? 'ac-doctrine'
                 : 'ac-board';
  const el = document.getElementById(anchorId);
  if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const tb = document.getElementById('tbTitle');
  if (tb) tb.textContent = 'Actions';
  saveLastView({ screen: 'actions', sub: null, title: 'Actions' });
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
  saveLastView({ screen: 'labor-efficiency', sub, title: LABOR_SUBPAGE_TITLES[sub] });
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
  saveLastView({ screen: 'table-turns', sub, title: TT_SUBPAGE_TITLES[sub] });

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
  var DAY_LOCATION = { monday:'Oakland', tuesday:'Oakland', wednesday:'Oakland', thursday:'Oakland', friday:'Oakland', saturday:'Oakland', sunday:'Oakland' };
  var ALL_DAYS     = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  var currentDay   = 'friday';
  var currentMealLabel = 'Dinner';

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
    var actual = sb.actualTotalMin, target = sb.targetTotalMin, over = sb.overTargetMin;
    var bn = sb.stages.filter(function(x){ return x.status === 'bottleneck'; })[0] || sb.stages[sb.stages.length - 1];
    var f = s.formula.values;
    var dp = s.diagnosisPanel;
    var rev = dp.estimatedWeeklyRevenue, missed = f.missedTables, conf = s.heroInsight.patternConfidence;
    var revLow = dp.revLow, revHigh = dp.revHigh; // honest band on the one modeled number
    var patternNote = (s.summaryCards[3] && s.summaryCards[3].subtext) || (conf + '% pattern');
    var hist = s.forecastHistWeeks || Math.max(8, Math.round(conf / 7));
    var recurr = patternNote.charAt(0).toLowerCase() + patternNote.slice(1); // "seen 3 of last 4 Wednesdays" — keep day capitalized

    // 1 · VERDICT HERO — money-first · expected = AI forecast from this service's own history
    var hero =
      '<div class="tt-w-hero">' +
        '<div class="tt-w-eyebrow">' + s.day + ' ' + s.service + ' · ' + s.location + ' · ' + s.timeWindow + '</div>' +
        '<h1 class="tt-w-head">' + s.day + ' ' + s.service.toLowerCase() + ' is leaving <b>~$' + rev + '/wk</b> on the table.</h1>' +
        '<div class="tt-w-range"><span class="tt-w-range-k">grounded range</span><b>$' + revLow + '–$' + revHigh + '</b><span class="tt-w-range-u">/wk</span></div>' +
        '<p class="tt-w-sub">Tables run about <b>' + over + ' min</b> over the <b>~' + target + '-min</b> expected for a ' + s.day + ' ' + s.service.toLowerCase() + ' — about <b>' + missed + ' seats</b> you couldn’t fill in a typical week. The lag is almost entirely in <b>Stage ' + bn.id + ' · ' + bn.name + '</b>.</p>' +
        '<div class="tt-w-stats">' +
          '<div class="tt-w-stat"><span class="tt-w-stat-v">' + actual + ' → ' + target + '</span><span class="tt-w-stat-l">min · actual vs expected</span></div>' +
          '<div class="tt-w-stat"><span class="tt-w-stat-v">' + missed + '</span><span class="tt-w-stat-l">tables missed / wk</span></div>' +
          '<div class="tt-w-stat"><span class="tt-w-stat-v">' + conf + '%</span><span class="tt-w-stat-l">forecast confidence</span></div>' +
        '</div>' +
        '<div class="tt-w-prov"><span class="tt-w-prov-pill">forecast</span><span><b>' + hist + ' weeks</b> of history · ' + recurr + '</span></div>' +
        ttMathHTML(s) +
      '</div>';

    // 2 · WHERE THE TIME GOES — one tile per stage: icon + big minutes + ✓/⚠ status
    var bnIdx = sb.stages.indexOf(bn);
    var STAGE_ICON = { Seat: '🪑', Order: '📝', Eat: '🍽️', Pay: '💳', Reset: '🔄' };
    var okCount = sb.stages.filter(function(x){ return x.status !== 'bottleneck'; }).length;
    var steps = sb.stages.map(function(x, i){
      var isBn = x.status === 'bottleneck', sym, txt, cls;
      if (isBn) { sym = '⚠'; txt = '+' + x.delta + ' over'; cls = 'is-over'; }
      else if (x.status === 'on_target') { sym = '✓'; txt = 'on time'; cls = 'is-ok'; }
      else { sym = '✓'; txt = '+' + x.delta + ' min'; cls = 'is-ok'; }
      return '<button type="button" class="tt-w-step' + (isBn ? ' is-bn' : '') + (i === bnIdx ? ' is-active' : '') + '" data-si="' + i + '" onclick="ttSelectStage(this)">' +
        '<span class="tt-w-step-ico" aria-hidden="true">' + (STAGE_ICON[x.name] || '•') + '</span>' +
        '<span class="tt-w-step-name">' + x.id + ' · ' + x.name + '</span>' +
        '<span class="tt-w-step-min">' + x.actualMin + '<small>min</small></span>' +
        '<span class="tt-w-step-status ' + cls + '">' + sym + ' ' + txt + '</span>' +
      '</button>';
    }).join('<span class="tt-w-step-arr" aria-hidden="true">→</span>');
    var stage =
      '<div class="tt-w-card">' +
        '<div class="tt-w-card-h"><span>Where the time goes</span><span class="tt-w-card-meta">a table’s ' + sb.stages.length + ' stages · ' + actual + ' min vs ~' + target + ' min expected</span></div>' +
        '<div class="tt-w-lead"><b>' + okCount + ' of ' + sb.stages.length + ' stages are on time.</b> The hold-up is <b class="tt-w-amber">Stage ' + bn.id + ' · ' + bn.name + '</b>, running <b class="tt-w-amber">+' + bn.delta + ' min</b> over.</div>' +
        '<div class="tt-w-steps">' + steps + '</div>' +
        '<div class="tt-w-stage-detail">' + ttStageDetailHTML(bn) + '</div>' +
        '<div class="tt-w-stage-hint">Tap a stage for its detail.</div>' +
      '</div>';


    // 4 · HOUR BY HOUR — bar = minutes OVER target; big +N number + ✓/⚠ per hour
    var maxOver = Math.max.apply(null, s.hourlyRows.map(function(h){ return h.overTargetMin; })) || 1;
    var worstHi = 0, worstV = -1;
    s.hourlyRows.forEach(function(h, i){ if (h.overTargetMin > worstV){ worstV = h.overTargetMin; worstHi = i; } });
    var hourBars = s.hourlyRows.map(function(h, i){
      var over = h.overTargetMin;
      var barH = over <= 0 ? 3 : Math.max(10, over / maxOver * 100);
      var oc = h.severity === 'red' ? 'var(--red)' : h.severity === 'amber' ? 'var(--amber)' : 'var(--green)';
      var numCls = h.severity === 'red' ? 'is-bad' : h.severity === 'amber' ? 'is-warn' : 'is-ok';
      var sym = h.severity === 'green' ? '✓' : '⚠';
      return '<button type="button" class="tt-w-hour' + (i === worstHi ? ' is-active' : '') + '" data-hi="' + i + '" onclick="ttSelectHour(this)">' +
        '<span class="tt-w-hour-over ' + numCls + '">' + (over > 0 ? '+' + over : '0') + '</span>' +
        '<span class="tt-w-hbar"><i style="height:' + barH.toFixed(1) + '%;background:' + oc + '"></i></span>' +
        '<span class="tt-w-hour-h">' + h.hour.replace(' PM', 'p').replace(' AM', 'a') + ' <span class="tt-w-hour-sym ' + numCls + '">' + sym + '</span></span>' +
      '</button>';
    }).join('');
    var hours =
      '<div class="tt-w-card">' +
        '<div class="tt-w-card-h"><span>Hour by hour</span><span class="tt-w-card-meta">minutes a table runs <b class="tt-w-amber">over expected</b>, by hour</span></div>' +
        '<div class="tt-w-hours">' + hourBars + '</div>' +
        '<div class="tt-w-hour-detail">' + ttHourDetailHTML(s.hourlyRows[worstHi]) + '</div>' +
        '<div class="tt-w-hours-cap">' + s.worstStretch.message + '</div>' +
      '</div>';

    // Split so the toggles can sit between the verdict hero and the visuals.
    return { hero: hero, body: stage + hours };
  }

  function _ttDays(){ return (typeof TT_WATCH_DAYS !== 'undefined') ? TT_WATCH_DAYS : (window.TT_WATCH_DAYS || {}); }
  function _ttScn(){ return (typeof TT_WATCH_SCENARIOS !== 'undefined') ? TT_WATCH_SCENARIOS : (window.TT_WATCH_SCENARIOS || {}); }

  // Render one day+meal service into the single #ttServiceView container.
  // data-svc-key lets the interactive handlers resolve the right service's data.
  function ttRenderService(svcKey){
    var heroEl = $('ttServiceHero'), bodyEl = $('ttServiceBody');
    if (!heroEl || !bodyEl) return;
    var s = _ttScn()[svcKey];
    if (!s){ heroEl.innerHTML = ''; bodyEl.innerHTML = '<div class="tt-w-empty">No service data for this selection.</div>'; return; }
    try {
      var parts = ttRenderDay(s);
      heroEl.innerHTML = '<div class="tt-w">' + parts.hero + '</div>';
      bodyEl.innerHTML = '<section class="tt-w-svc" data-svc-key="' + svcKey + '"><div class="tt-w">' + parts.body + '</div></section>';
    } catch (err){ console.warn('[table_turns] render failed for ' + svcKey + ':', err); }
  }

  // Build the meal pills for a day and mark the active one.
  function ttBuildMealPills(dayKey, activeKey){
    var wrap = $('ttMealPills'); if (!wrap) return;
    var day = _ttDays()[dayKey];
    if (!day){ wrap.innerHTML = ''; return; }
    wrap.innerHTML = day.meals.map(function(m){
      return '<button type="button" class="tt-day-pill tt-meal-pill' + (m.key === activeKey ? ' active' : '') +
        '" data-svc-key="' + m.key + '" onclick="ttSwitchMeal(\'' + m.key + '\',\'' + m.label + '\')">' + m.label + '</button>';
    }).join('');
  }

  // Pick a day: rebuild its meal pills, keep the same meal label if available
  // (else default to the day's last meal = Dinner), and render.
  window.ttSwitchDay = function(key){
    var day = _ttDays()[key];
    if (!day){
      var v = $('ttServiceView'); if (v) v.innerHTML = '<div class="tt-w-empty">No Table Turns data for this location yet.</div>';
      var mp = $('ttMealPills'); if (mp) mp.innerHTML = '';
      return;
    }
    currentDay = key;
    var meal = day.meals.filter(function(m){ return m.label === currentMealLabel; })[0] || day.meals[day.meals.length - 1];
    currentMealLabel = meal.label;
    ttBuildMealPills(key, meal.key);
    ttRenderService(meal.key);
    document.querySelectorAll('.tt-day-pills .tt-day-pill[data-day]').forEach(function(p){
      p.classList.toggle('active', p.getAttribute('data-day') === key);
    });
  };

  // Pick a meal within the current day.
  window.ttSwitchMeal = function(svcKey, label){
    currentMealLabel = label;
    ttRenderService(svcKey);
    document.querySelectorAll('#ttMealPills .tt-meal-pill').forEach(function(p){
      p.classList.toggle('active', p.getAttribute('data-svc-key') === svcKey);
    });
  };

  // Show the day pills available for the chosen location, pick a default, render.
  window.ttApplyLocation = function(loc){
    var pills = document.querySelectorAll('.tt-day-pills .tt-day-pill[data-day]');
    if (!pills.length) return; // not on the Table Turns screen yet
    var visible = [];
    pills.forEach(function(p){
      var d = p.getAttribute('data-day');
      var show = !loc || loc === 'All Locations' || DAY_LOCATION[d] === loc;
      p.style.display = show ? '' : 'none';
      if (show) visible.push(d);
    });
    if (!visible.length){ ttSwitchDay('__none__'); return; }
    ttSwitchDay(visible.indexOf(currentDay) !== -1 ? currentDay : visible[0]);
  };

  // Sidebar location selector calls this.
  window.setSKCLocation = function(loc){
    window.SKC_LOCATION = loc;
    ttApplyLocation(loc);
  };

  document.addEventListener('DOMContentLoaded', function(){
    ttApplyLocation(window.SKC_LOCATION || 'All Locations');
  });
})();


/* ════════════════════════════════════════════════════════════════════
   TABLE TURNS · WATCH — interactive stage + hour visuals. Click a stage
   segment / axis label / hour bar to select it; the visual highlights and a
   live detail line updates. Defaults to the bottleneck stage / worst hour.
   These are global so the inline onclick (and ttRenderDay's defaults) reach
   them; they read window.TT_WATCH_SCENARIOS. Pure presentation.
   ════════════════════════════════════════════════════════════════════ */
function ttStageDetailHTML(st){
  var rel = st.status === 'bottleneck'
      ? 'the main lag — <span class="tt-w-amber">+' + st.delta + ' min over</span>, targeted by the recommended fix'
    : st.status === 'on_target' ? 'right at the expected pace'
    : '+' + st.delta + ' min over — within tolerance';
  return '<b>Stage ' + st.id + ' · ' + st.name + '</b> · ' + st.actualMin + ' min vs ~' + st.targetMin + ' expected · ' + rel;
}
function ttHourDetailHTML(h){
  return '<b>' + h.hour + '</b> · ' + h.totalMin + ' min · ' + h.label;
}
// "Show the math" — the live throughput derivation, read straight from formula.trace.
// Written for an owner who wants to see where the headline number comes from: every
// step is narrated in plain language (what we're doing, where the input came from),
// then the actual arithmetic. Numbers and doctrine are unchanged — realization is
// still the one modeled term, covers are floored, the band stays a band.
function ttMathHTML(s){
  var t = s.formula && s.formula.trace; if (!t) return '';
  var dp = s.diagnosisPanel, chk = s.formula.values.averageCheck;
  var pct = Math.round(t.realization * 100);
  var rows = [
    ['A seat should turn',  '(' + t.serviceHours + 'h × 60) ÷ ' + t.expectedMin + ' min = <b>' + t.theoTurns.toFixed(2) + '</b>/seat'],
    ['It actually turns',   '(' + t.serviceHours + 'h × 60) ÷ ' + t.actualMin + ' min = <b>' + t.actTurns.toFixed(2) + '</b>/seat'],
    ['Seats you miss',      t.deltaTurns.toFixed(2) + '/seat × ' + t.seats + ' seats ≈ <b>' + t.theoLost.toFixed(1) + '</b> covers'],
    ['That fill <i>(est.)</i>', 'round down ' + t.theoLost.toFixed(1) + ' × ' + pct + '% = <b>' + t.lostCovers + '</b> covers'],
    ['What it’s worth',     t.lostCovers + ' × $' + chk + ' = <b>$' + dp.estimatedWeeklyRevenue + '/wk</b>'],
    ['Range',               '±' + t.spreadPct + '% = <b>$' + t.revLow + '–$' + t.revHigh + '</b>/wk']
  ];
  return '<details class="tt-w-math">' +
    '<summary>Where does this number come from?</summary>' +
    '<div class="tt-w-math-body">' +
      rows.map(function(r){
        return '<div class="tt-w-math-row"><span class="tt-w-math-k">' + r[0] + '</span><span class="tt-w-math-v">' + r[1] + '</span></div>';
      }).join('') +
      '<div class="tt-w-math-note">Only <b>the fill rate</b> is estimated — always rounded down. Everything else is your own POS data. Counts toward ROI once we confirm the freed seats filled.</div>' +
    '</div>' +
  '</details>';
}
function _ttServiceFor(el){
  var v = el.closest && el.closest('[data-svc-key]');
  if (!v) return null;
  return (window.TT_WATCH_SCENARIOS || {})[v.getAttribute('data-svc-key')] || null;
}
window.ttSelectStage = function(el){
  var sc = _ttServiceFor(el); if (!sc) return;
  var idx = +el.getAttribute('data-si');
  var st = sc.stageBreakdown.stages[idx]; if (!st) return;
  var card = el.closest('.tt-w-card'); if (!card) return;
  card.querySelectorAll('[data-si]').forEach(function(n){ n.classList.toggle('is-active', +n.getAttribute('data-si') === idx); });
  var d = card.querySelector('.tt-w-stage-detail'); if (d) d.innerHTML = ttStageDetailHTML(st);
};
window.ttSelectHour = function(el){
  var sc = _ttServiceFor(el); if (!sc) return;
  var idx = +el.getAttribute('data-hi');
  var h = sc.hourlyRows[idx]; if (!h) return;
  var card = el.closest('.tt-w-card'); if (!card) return;
  card.querySelectorAll('[data-hi]').forEach(function(n){ n.classList.toggle('is-active', +n.getAttribute('data-hi') === idx); });
  var d = card.querySelector('.tt-w-hour-detail'); if (d) d.innerHTML = ttHourDetailHTML(h);
};
document.addEventListener('keydown', function(e){
  if (e.key !== 'Enter' && e.key !== ' ') return;
  var t = e.target;
  if (!t || !t.hasAttribute) return;
  if (t.hasAttribute('data-si')){ e.preventDefault(); window.ttSelectStage(t); }
  else if (t.hasAttribute('data-hi')){ e.preventDefault(); window.ttSelectHour(t); }
});

/* ════════════════════════════════════════════════════════════════════
   PROFIT RECOVERY — single location filter (segmented pill).
   Scopes the value map to one location: the focal fix + each value-bar
   row carry data-pr-opp + data-loc. Menu-wide opportunities
   (data-loc="all") show under every location. The hero number stays
   portfolio-level. Pure presentation — no data/output-type/ROI logic.
   ════════════════════════════════════════════════════════════════════ */
function prFilterLoc(btn, loc) {
  // Active pill
  document.querySelectorAll('.pr-loc-filter .pr-loc')
    .forEach(b => b.classList.toggle('active', b === btn));

  // Scope the findings to one location. A card matches when filtering "all",
  // the finding is menu-wide (data-loc="all"), or its data-loc is the location.
  let shown = 0;
  document.querySelectorAll('#pr-finds [data-pr-opp]').forEach(el => {
    const cl = (el.getAttribute('data-loc') || 'all').toLowerCase();
    const match = loc === 'all' || cl === 'all' || cl.split(/\s+/).includes(loc);
    el.style.display = match ? '' : 'none';
    if (match) shown++;
  });

  // Empty state when this location has nothing to decide
  const empty = document.getElementById('pr-queue-empty');
  if (empty) empty.style.display = shown === 0 ? '' : 'none';
}

/* ════════════════════════════════════════════════════════════════════
   PROFIT RECOVERY — unfold a finding to show WHY SKC flagged it. The
   signature interaction of the page (this is the "why" surface, not a
   task board). Pure presentation.
   ════════════════════════════════════════════════════════════════════ */
function prToggleWhy(btn) {
  const card = btn.closest('.pr-find');
  if (!card) return;
  const open = card.classList.toggle('open');
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  // Draw the evidence chart the first time this finding is opened
  if (open) card.querySelectorAll('.pr-viz-chart').forEach(prRenderViz);
}

/* Render a finding's evidence visual — dispatched by data-viz to the graphic
   that fits the issue. Each returns SVG markup drawn in its own viewBox.
   Pure presentation; no data/output-type/ROI logic is touched. */
function prRenderViz(chart) {
  if (!chart || chart.dataset.rendered) return;
  const svg = chart.querySelector('svg');
  if (!svg) return;
  const fns = { timeline: prVizTimeline, margin: prVizMargin, trend: prVizTrend, mix: prVizMix, band: prVizBand };
  const fn = fns[chart.dataset.viz];
  if (!fn) return;
  try { svg.innerHTML = fn(chart); chart.dataset.rendered = '1'; }
  catch (e) { console.warn('prRenderViz', chart.dataset.viz, e); }
}
const _prEsc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

/* Stage timeline — two stacked bars (baseline vs now); the highlighted stage
   (data-hl) is amber so its growth is the story. */
function prVizTimeline(chart) {
  const stages = chart.dataset.stages.split(',').map(s => { const p = s.split(':'); return { base: +p[1], now: +p[2] }; });
  const hl = +chart.dataset.hl;
  const W = 320, x0 = 66, barW = W - x0 - 4, bh = 20;
  const baseTot = stages.reduce((a, s) => a + s.base, 0);
  const nowTot = stages.reduce((a, s) => a + s.now, 0);
  const sc = barW / Math.max(baseTot, nowTot);
  let out = '';
  [{ k: 'base', y: 18, tot: baseTot, lab: 'Baseline ' + baseTot + 'm' },
   { k: 'now', y: 54, tot: nowTot, lab: 'Now ' + nowTot + 'm' }].forEach(r => {
    out += '<text x="0" y="' + (r.y + bh / 2 + 3) + '" class="pr-viz-rowlab">' + r.lab + '</text>';
    let cx = x0;
    stages.forEach((st, i) => {
      const w = st[r.k] * sc;
      const cls = i === hl ? 'pr-viz-bad' : (i % 2 ? 'pr-viz-mut' : 'pr-viz-mut2');
      out += '<rect x="' + cx.toFixed(1) + '" y="' + r.y + '" width="' + Math.max(0, w - 1.5).toFixed(1) + '" height="' + bh + '" rx="2" class="' + cls + '"/>';
      cx += w;
    });
  });
  out += '<rect x="' + x0 + '" y="84" width="9" height="9" rx="2" class="pr-viz-bad"/>' +
         '<text x="' + (x0 + 13) + '" y="92" class="pr-viz-txt">check → paid · 4 → 13 min</text>';
  return out;
}

/* Margin breakdown — two vertical bars (Target vs Now), each = the $24 plate,
   split into cost (top, muted) + margin (bottom). Now's margin is amber and
   sits below the dashed target-margin line. */
function prVizMargin(chart) {
  const price = +chart.dataset.price, mb = +chart.dataset.marginBase, mn = +chart.dataset.marginNow;
  const top = 12, baseY = 100, fullH = baseY - top, sc = fullH / price;
  const bw = 60, x1 = 60, x2 = x1 + bw + 70;
  const bar = (x, m, label, amber) => {
    const mH = m * sc, cH = (price - m) * sc;
    return '<rect x="' + x + '" y="' + top + '" width="' + bw + '" height="' + cH.toFixed(1) + '" class="pr-viz-mut2"/>' +
      '<rect x="' + x + '" y="' + (top + cH).toFixed(1) + '" width="' + bw + '" height="' + mH.toFixed(1) + '" rx="0" class="' + (amber ? 'pr-viz-bad' : 'pr-viz-mut') + '"/>' +
      '<text x="' + (x + bw / 2) + '" y="' + (top + cH + mH / 2 + 3).toFixed(1) + '" text-anchor="middle" class="pr-viz-txt-b">$' + m.toFixed(2) + '</text>' +
      '<text x="' + (x + bw / 2) + '" y="' + (top + cH / 2 + 3).toFixed(1) + '" text-anchor="middle" class="pr-viz-txt">cost</text>' +
      '<text x="' + (x + bw / 2) + '" y="' + (baseY + 13) + '" text-anchor="middle" class="pr-viz-rowlab">' + label + '</text>';
  };
  const ty = (top + (price - mb) * sc).toFixed(1);
  return bar(x1, mb, 'Target', false) + bar(x2, mn, 'Now', true) +
    '<line x1="' + (x1 - 6) + '" y1="' + ty + '" x2="' + (x2 + bw + 6) + '" y2="' + ty + '" class="pr-viz-thr"/>' +
    '<text x="' + (x2 + bw + 10) + '" y="' + (+ty + 3) + '" class="pr-viz-txt">target margin</text>' +
    '<text x="' + (x1 - 6) + '" y="9" class="pr-viz-txt">$' + price + ' menu price</text>';
}

/* Trend line — area + line climbing across the dashed target; points over
   target are amber, the last one labelled. */
function prVizTrend(chart) {
  const s = chart.dataset.series.split(',').map(parseFloat), thr = +chart.dataset.threshold;
  const W = 320, H = 84, padT = 14, padB = 16, x0 = 6, x1 = W - 6, n = s.length;
  let lo = Math.min(thr, ...s), hi = Math.max(thr, ...s); const sp = (hi - lo) || 1; lo -= sp * 0.25; hi += sp * 0.2;
  const rng = hi - lo, X = i => x0 + (x1 - x0) * (i / (n - 1)), Y = v => padT + (H - padT - padB) * (1 - (v - lo) / rng);
  const pts = s.map((v, i) => X(i).toFixed(1) + ',' + Y(v).toFixed(1)).join(' ');
  const ty = Y(thr).toFixed(1);
  let out = '<polygon points="' + X(0).toFixed(1) + ',' + (H - padB) + ' ' + pts + ' ' + X(n - 1).toFixed(1) + ',' + (H - padB) + '" class="pr-viz-area"/>';
  out += '<line x1="0" y1="' + ty + '" x2="' + W + '" y2="' + ty + '" class="pr-viz-thr"/>';
  out += '<text x="' + (W - 2) + '" y="' + (+ty - 4) + '" text-anchor="end" class="pr-viz-txt">target ' + thr + '</text>';
  out += '<polyline points="' + pts + '" class="pr-viz-line"/>';
  s.forEach((v, i) => { out += '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="' + (i === n - 1 ? 3.6 : 2.2) + '" class="' + (v > thr ? 'pr-viz-dot-bad' : 'pr-viz-dot') + '"/>'; });
  out += '<text x="' + X(n - 1).toFixed(1) + '" y="' + (Y(s[n - 1]) - 7).toFixed(1) + '" text-anchor="end" class="pr-viz-txt-b">' + s[n - 1] + '</text>';
  return out;
}

/* Mix shift — two 100% stacked bars (baseline vs now); the last tier
   (low-margin) is amber and visibly grows. */
function prVizMix(chart) {
  const base = chart.dataset.base.split(',').map(Number), now = chart.dataset.now.split(',').map(Number);
  const labels = (chart.dataset.labels || '').split(',');
  const W = 320, x0 = 66, barW = W - x0 - 4, bh = 20, fills = ['pr-viz-mut2', 'pr-viz-mut', 'pr-viz-bad'];
  const row = (arr, y, lab) => {
    let g = '<text x="0" y="' + (y + bh / 2 + 3) + '" class="pr-viz-rowlab">' + lab + '</text>';
    const tot = arr.reduce((a, b) => a + b, 0); let cx = x0;
    arr.forEach((v, i) => { const w = barW * (v / tot); g += '<rect x="' + cx.toFixed(1) + '" y="' + y + '" width="' + Math.max(0, w - 1.5).toFixed(1) + '" height="' + bh + '" rx="2" class="' + (fills[i] || 'pr-viz-mut') + '"/>'; cx += w; });
    return g;
  };
  const li = base.length - 1;
  return row(base, 16, 'Baseline') + row(now, 50, 'Now') +
    '<rect x="' + x0 + '" y="84" width="9" height="9" rx="2" class="pr-viz-bad"/>' +
    '<text x="' + (x0 + 13) + '" y="92" class="pr-viz-txt">' + _prEsc(labels[li] || 'low margin') + ' · ' + base[li] + '% → ' + now[li] + '%</text>';
}

/* Range + dots — a shaded normal range and a dashed floor; one dot per
   Tuesday, the ones below the floor amber. Conveys mild / intermittent. */
function prVizBand(chart) {
  const s = chart.dataset.series.split(',').map(parseFloat), floor = +chart.dataset.floor, low = +chart.dataset.low, high = +chart.dataset.high;
  const W = 320, H = 80, padT = 12, padB = 18, x0 = 14, x1 = W - 10, n = s.length;
  let lo = Math.min(floor, low, ...s), hi = Math.max(high, ...s); const sp = (hi - lo) || 1; lo -= sp * 0.14; hi += sp * 0.14;
  const rng = hi - lo, X = i => x0 + (x1 - x0) * ((i + 0.5) / n), Y = v => padT + (H - padT - padB) * (1 - (v - lo) / rng);
  let out = '<rect x="0" y="' + Y(high).toFixed(1) + '" width="' + W + '" height="' + (Y(low) - Y(high)).toFixed(1) + '" class="pr-viz-band"/>';
  out += '<text x="2" y="' + (Y(high) - 3).toFixed(1) + '" class="pr-viz-txt">normal range</text>';
  const fy = Y(floor).toFixed(1);
  out += '<line x1="0" y1="' + fy + '" x2="' + W + '" y2="' + fy + '" class="pr-viz-thr"/>';
  out += '<text x="' + (W - 2) + '" y="' + (+fy + 11) + '" text-anchor="end" class="pr-viz-txt">floor $' + floor + '</text>';
  s.forEach((v, i) => { out += '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="3.4" class="' + (v < floor ? 'pr-viz-dot-bad' : 'pr-viz-dot') + '"/>'; });
  return out;
}

/* PROFIT RECOVERY — decide on a finding to clear it. Commit hands it to
   Actions (the DO half of the pair); Not now snoozes; Dismiss drops it
   (SKC re-raises only if it worsens). The funnel spine reflects each
   decision. No data/output-type/ROI logic is touched. */
function prDecide(btn, action) {
  const card = btn.closest('.pr-find');
  if (!card) return;
  if (window.prInActions == null) window.prInActions = 2;

  let msg, tone;
  if (action === 'commit') {
    window.prInActions++;
    msg = 'Committed — moved to Actions. Assign an owner & due there.'; tone = 'green';
  } else if (action === 'snooze') {
    msg = 'Snoozed — SKC will resurface this next week.'; tone = 'blue';
  } else {
    msg = 'Dismissed — SKC re-raises it only if the pattern worsens.'; tone = 'blue';
  }

  // Animate the card out, then drop it and refresh the spine / empty state
  card.style.opacity = '0';
  card.style.transform = 'translateX(10px)';
  if (typeof showDemoToast === 'function') showDemoToast(msg, tone);
  setTimeout(function () {
    card.remove();
    prUpdateSpine();
    prCheckQueueEmpty();
  }, 170);
}

function prUpdateSpine() {
  const d = document.getElementById('pr-spine-decide');
  if (d) d.textContent = document.querySelectorAll('#pr-finds .pr-find').length;
  const a = document.getElementById('pr-spine-actions');
  if (a && window.prInActions != null) a.textContent = window.prInActions;
}

function prCheckQueueEmpty() {
  const n = document.querySelectorAll('#pr-finds .pr-find').length;
  const empty = document.getElementById('pr-queue-empty');
  if (empty) {
    empty.style.display = n === 0 ? '' : 'none';
    if (n === 0) empty.innerHTML =
      'All clear — you’ve decided on every finding. Committed work is now in <b>Actions</b>.';
  }
}


// ═══════════════════════════════════════════════════════════
// (benchmarks) Standalone Benchmarks page — internal location-by-location
// comparison. Metric dropdown + location pills drive a dynamic chart and a
// written analysis. Two reusable chart types: 'bar' (ranked horizontal bars)
// and 'dot' (benchmark-anchored lollipop, for time/duration metrics). Data:
// BENCHMARK_METRICS / BENCHMARK_LOCATIONS in shared/data.js. Entry point:
// initBenchmarks(), fired from showScreen('benchmarks').
// ═══════════════════════════════════════════════════════════

var benchmarkState = { metric: 'rplh', locations: ['oakland', 'berkeley', 'walnut'] };
var _bmMenuBound = false;

function benchmarkMetric(id){
  for (var i = 0; i < BENCHMARK_METRICS.length; i++) if (BENCHMARK_METRICS[i].id === id) return BENCHMARK_METRICS[i];
  return null;
}
function _bmLocName(id){
  for (var i = 0; i < BENCHMARK_LOCATIONS.length; i++) if (BENCHMARK_LOCATIONS[i].id === id) return BENCHMARK_LOCATIONS[i].name;
  return id;
}

// Value formatting — pre/dp/suf come off the metric.
function fmtBenchmark(m, v){
  if (v == null || isNaN(v)) return '—';
  return (m.pre || '') + Number(v).toFixed(m.dp) + (m.suf || '');
}
// Absolute-difference formatting: percentages read as "pts", everything else
// keeps its own unit.
function _bmFmtDelta(m, d){
  d = Math.abs(d);
  if (m.suf === '%') return d.toFixed(1) + ' pts';
  return (m.pre || '') + d.toFixed(m.dp) + (m.suf || '');
}
// Performance vs the all-locations benchmark, honoring direction.
// 1 = better, -1 = worse, 0 = within ~2% (or neutral metric).
function _bmPerf(m, v){
  if (m.dir === 'neutral') return 0;
  var all = m.values.all;
  if (all == null) return 0;
  var diff = v - all;
  if (m.dir === 'lower') diff = -diff;
  var rel = diff / Math.abs(all || 1);
  if (rel > 0.02) return 1;
  if (rel < -0.02) return -1;
  return 0;
}
function _bmColor(m, v){
  if (m.dir === 'neutral') return 'var(--blue)';
  var p = _bmPerf(m, v);
  return p > 0 ? 'var(--green)' : p < 0 ? 'var(--red)' : 'var(--amber)';
}
function _bmRel(m, v){
  var p = _bmPerf(m, v);
  return { perf: p, word: p > 0 ? 'better than' : p < 0 ? 'worse than' : 'on par with' };
}

function initBenchmarks(){
  if (typeof BENCHMARK_METRICS === 'undefined') return;
  var cur = benchmarkMetric(benchmarkState.metric);
  if (!cur || cur.locked) benchmarkState.metric = 'rplh';
  if (!benchmarkState.locations || !benchmarkState.locations.length){
    benchmarkState.locations = BENCHMARK_LOCATIONS.map(function(l){ return l.id; });
  }
  _bmBuildMetricMenu();
  _bmBuildLocPills();
  _bmSyncMetricTrigger();
  renderBenchmarkChart();
  renderBenchmarkAnalysis();
  if (!_bmMenuBound){
    document.addEventListener('mousedown', function(e){
      var dd = document.getElementById('bmMetricDropdown');
      if (dd && !dd.contains(e.target)) dd.classList.remove('open');
    });
    _bmMenuBound = true;
  }
}

function _bmBuildMetricMenu(){
  var menu = document.getElementById('bmMetricMenu');
  if (!menu) return;
  var groups = [];
  BENCHMARK_METRICS.forEach(function(m){
    var g = null;
    for (var i = 0; i < groups.length; i++) if (groups[i].name === m.group) g = groups[i];
    if (!g){ g = { name: m.group, items: [] }; groups.push(g); }
    g.items.push(m);
  });
  var html = '';
  groups.forEach(function(g){
    html += '<div class="bm-dd-group">' + g.name + '</div>';
    g.items.forEach(function(m){
      if (m.locked){
        html += '<div class="bm-dd-item is-locked" title="' + m.lockReason + '">'
          + '<span class="bm-dd-item-label">' + m.label + '</span>'
          + '<span class="bm-dd-lock"><svg class="bm-dd-lock-ico" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="11" width="15" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>' + m.lockReason + '</span>'
          + '</div>';
      } else {
        var active = (m.id === benchmarkState.metric);
        html += '<div class="bm-dd-item' + (active ? ' is-active' : '') + '" role="menuitem" tabindex="0"'
          + ' onclick="benchmarkSelectMetric(\'' + m.id + '\')"'
          + ' onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();benchmarkSelectMetric(\'' + m.id + '\')}">'
          + '<span class="bm-dd-item-label">' + m.label + '</span>'
          + (active ? '<span class="bm-dd-check">✓</span>' : '')
          + '</div>';
      }
    });
  });
  menu.innerHTML = html;
}

function _bmBuildLocPills(){
  var wrap = document.getElementById('bmLocPills');
  if (!wrap) return;
  var total = BENCHMARK_LOCATIONS.length;
  var allOn = benchmarkState.locations.length === total;
  var html = '<button type="button" class="bm-pill bm-pill-all' + (allOn ? ' is-active' : '') + '"'
    + ' aria-pressed="' + (allOn ? 'true' : 'false') + '" onclick="benchmarkToggleAll()">All locations</button>';
  BENCHMARK_LOCATIONS.forEach(function(l){
    var on = benchmarkState.locations.indexOf(l.id) !== -1;
    html += '<button type="button" class="bm-pill' + (on ? ' is-active' : '') + '"'
      + ' aria-pressed="' + (on ? 'true' : 'false') + '" onclick="benchmarkToggleLocation(\'' + l.id + '\')">' + l.name + '</button>';
  });
  wrap.innerHTML = html;
}

function _bmSyncMetricTrigger(){
  var m = benchmarkMetric(benchmarkState.metric);
  if (!m) return;
  var lbl = document.getElementById('bmMetricLabel');
  if (lbl) lbl.textContent = m.label;
  var ct = document.getElementById('bmChartTitle');
  if (ct) ct.textContent = m.label;
}

function benchmarkToggleMenu(e){
  if (e) e.stopPropagation();
  var dd = document.getElementById('bmMetricDropdown');
  if (!dd) return;
  var open = dd.classList.toggle('open');
  var trig = document.getElementById('bmMetricTrigger');
  if (trig) trig.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function benchmarkSelectMetric(id){
  var m = benchmarkMetric(id);
  if (!m || m.locked) return;
  benchmarkState.metric = id;
  var dd = document.getElementById('bmMetricDropdown');
  if (dd) dd.classList.remove('open');
  var trig = document.getElementById('bmMetricTrigger');
  if (trig) trig.setAttribute('aria-expanded', 'false');
  _bmBuildMetricMenu();
  _bmSyncMetricTrigger();
  renderBenchmarkChart();
  renderBenchmarkAnalysis();
}

function benchmarkToggleLocation(id){
  var idx = benchmarkState.locations.indexOf(id);
  if (idx === -1){
    benchmarkState.locations.push(id);
  } else if (benchmarkState.locations.length > 1){
    benchmarkState.locations.splice(idx, 1);  // keep at least one selected
  }
  // re-sort into canonical location order
  benchmarkState.locations = BENCHMARK_LOCATIONS.map(function(l){ return l.id; })
    .filter(function(x){ return benchmarkState.locations.indexOf(x) !== -1; });
  _bmBuildLocPills();
  renderBenchmarkChart();
  renderBenchmarkAnalysis();
}

function benchmarkToggleAll(){
  benchmarkState.locations = BENCHMARK_LOCATIONS.map(function(l){ return l.id; });
  _bmBuildLocPills();
  renderBenchmarkChart();
  renderBenchmarkAnalysis();
}

function renderBenchmarkChart(){
  var host = document.getElementById('bmChart');
  if (!host) return;
  var m = benchmarkMetric(benchmarkState.metric);
  if (!m){ host.innerHTML = ''; return; }
  var sub = document.getElementById('bmChartSub');
  if (sub) sub.textContent = 'By location vs the all-locations benchmark (' + fmtBenchmark(m, m.values.all) + ')';
  var locs = benchmarkState.locations.slice();
  if (!locs.length){ host.innerHTML = '<div class="bm-empty">Select at least one location to compare.</div>'; return; }
  host.innerHTML = (m.chart === 'dot') ? _bmRenderDot(m, locs) : _bmRenderBar(m, locs);
}

// Chart type 1 — ranked horizontal bars filled from the left axis, with a
// dashed all-locations benchmark line. Used for magnitude metrics.
function _bmRenderBar(m, locs){
  var data = locs.map(function(id){ return { name: _bmLocName(id), v: m.values[id] }; });
  var all = m.values.all;
  var vals = data.map(function(d){ return d.v; }).concat([all]);
  var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
  var span = (hi - lo) || (Math.abs(hi) * 0.1) || 1;
  var domMin = lo - span * 0.30; if (domMin < 0 && lo >= 0) domMin = 0;
  var domMax = hi + span * 0.22; if (domMax <= domMin) domMax = domMin + 1;
  var PX0 = 118, PX1 = 322, PW = PX1 - PX0;
  var sx = function(v){ return PX0 + (v - domMin) / (domMax - domMin) * PW; };
  var rowH = 36, top = 16, n = data.length;
  var axisY = top + n * rowH + 4, H = axisY + 24;
  var bx = sx(all);
  var s = '<svg viewBox="0 0 400 ' + H + '" preserveAspectRatio="xMidYMid meet" class="bm-svg" role="img" aria-label="' + m.label + ' by location">';
  s += '<line x1="' + bx.toFixed(1) + '" y1="' + (top - 6) + '" x2="' + bx.toFixed(1) + '" y2="' + (axisY - 2) + '" stroke="var(--t3)" stroke-dasharray="4,4" stroke-width="1"/>';
  s += '<text x="' + bx.toFixed(1) + '" y="' + (axisY + 13) + '" font-size="9" fill="var(--t3)" text-anchor="middle" font-family="var(--mono)">All ' + fmtBenchmark(m, all) + '</text>';
  data.forEach(function(d, i){
    var y = top + i * rowH, color = _bmColor(m, d.v);
    var bw = Math.max(2, sx(d.v) - PX0);
    s += '<text x="' + (PX0 - 8) + '" y="' + (y + 16) + '" font-size="11" fill="var(--t2)" text-anchor="end" font-weight="600">' + d.name + '</text>';
    s += '<rect x="' + PX0 + '" y="' + (y + 4) + '" width="' + bw.toFixed(1) + '" height="18" rx="3" fill="' + color + '" opacity="0.85"/>';
    s += '<text x="396" y="' + (y + 17) + '" font-size="11.5" font-weight="700" fill="' + color + '" text-anchor="end" font-family="var(--mono)">' + fmtBenchmark(m, d.v) + '</text>';
  });
  s += '</svg>';
  return s;
}

// Chart type 2 — benchmark-anchored lollipop: each location is a stem from the
// all-locations benchmark line out to its value, tipped with a dot. Length and
// direction read as deviation from the benchmark. Used for time/duration metrics.
function _bmRenderDot(m, locs){
  var data = locs.map(function(id){ return { name: _bmLocName(id), v: m.values[id] }; });
  var all = m.values.all;
  var vals = data.map(function(d){ return d.v; }).concat([all]);
  var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
  var span = (hi - lo) || (Math.abs(hi) * 0.1) || 1;
  var domMin = lo - span * 0.30; if (domMin < 0 && lo >= 0) domMin = 0;
  var domMax = hi + span * 0.30; if (domMax <= domMin) domMax = domMin + 1;
  var PX0 = 118, PX1 = 322, PW = PX1 - PX0;
  var sx = function(v){ return PX0 + (v - domMin) / (domMax - domMin) * PW; };
  var rowH = 36, top = 16, n = data.length;
  var axisY = top + n * rowH + 4, H = axisY + 24;
  var bx = sx(all);
  var s = '<svg viewBox="0 0 400 ' + H + '" preserveAspectRatio="xMidYMid meet" class="bm-svg" role="img" aria-label="' + m.label + ' by location">';
  s += '<line x1="' + bx.toFixed(1) + '" y1="' + (top - 6) + '" x2="' + bx.toFixed(1) + '" y2="' + (axisY - 2) + '" stroke="var(--t3)" stroke-dasharray="4,4" stroke-width="1.2"/>';
  s += '<text x="' + bx.toFixed(1) + '" y="' + (axisY + 13) + '" font-size="9" fill="var(--t3)" text-anchor="middle" font-family="var(--mono)">All ' + fmtBenchmark(m, all) + '</text>';
  data.forEach(function(d, i){
    var y = top + i * rowH + 11, dx = sx(d.v), color = _bmColor(m, d.v);
    s += '<text x="' + (PX0 - 8) + '" y="' + (y + 4) + '" font-size="11" fill="var(--t2)" text-anchor="end" font-weight="600">' + d.name + '</text>';
    s += '<line x1="' + bx.toFixed(1) + '" y1="' + y + '" x2="' + dx.toFixed(1) + '" y2="' + y + '" stroke="' + color + '" stroke-width="2.5" opacity="0.45"/>';
    s += '<circle cx="' + dx.toFixed(1) + '" cy="' + y + '" r="6" fill="' + color + '"/>';
    s += '<text x="396" y="' + (y + 4) + '" font-size="11.5" font-weight="700" fill="' + color + '" text-anchor="end" font-family="var(--mono)">' + fmtBenchmark(m, d.v) + '</text>';
  });
  s += '</svg>';
  return s;
}

function renderBenchmarkAnalysis(){
  var host = document.getElementById('bmAnalysis');
  if (!host) return;
  var m = benchmarkMetric(benchmarkState.metric);
  if (!m){ host.innerHTML = ''; return; }
  var all = m.values.all;
  var data = benchmarkState.locations.map(function(id){ return { id: id, name: _bmLocName(id), v: m.values[id] }; });
  if (!data.length){ host.innerHTML = ''; return; }

  var betterThan = function(a, b){ return m.dir === 'lower' ? a < b : a > b; };
  var ranked = data.slice().sort(function(a, b){ return betterThan(a.v, b.v) ? -1 : 1; });
  var leader = ranked[0], laggard = ranked[ranked.length - 1];
  var lo = data.reduce(function(a, b){ return b.v < a.v ? b : a; });
  var hi = data.reduce(function(a, b){ return b.v > a.v ? b : a; });
  var spread = hi.v - lo.v;
  var ml = m.label.toLowerCase();

  function statCell(k, v, tone){
    return '<div class="bm-stat' + (tone ? ' is-' + tone : '') + '"><div class="bm-stat-k">' + k + '</div><div class="bm-stat-v">' + v + '</div></div>';
  }

  // Headline
  var head;
  if (data.length === 1){
    var d0 = data[0];
    if (m.dir === 'neutral'){
      head = '<strong>' + d0.name + '</strong> runs ' + ml + ' of <strong>' + fmtBenchmark(m, d0.v) + '</strong>, against an all-locations average of ' + fmtBenchmark(m, all) + '.';
    } else {
      head = '<strong>' + d0.name + '</strong> posts ' + fmtBenchmark(m, d0.v) + ' on ' + ml + ' — ' + _bmFmtDelta(m, d0.v - all) + ' ' + _bmRel(m, d0.v).word + ' the all-locations benchmark of ' + fmtBenchmark(m, all) + '.';
    }
  } else if (m.dir === 'neutral'){
    head = '<strong>' + lo.name + '</strong> runs the shortest ' + ml + ' at ' + fmtBenchmark(m, lo.v) + ' and <strong>' + hi.name + '</strong> the longest at ' + fmtBenchmark(m, hi.v) + ' — a spread of ' + _bmFmtDelta(m, spread) + ' across the ' + data.length + ' locations in view. The all-locations average is ' + fmtBenchmark(m, all) + '.';
  } else {
    head = '<strong>' + leader.name + '</strong> leads on ' + ml + ' at ' + fmtBenchmark(m, leader.v) + ', ' + _bmFmtDelta(m, leader.v - all) + ' ' + _bmRel(m, leader.v).word + ' the all-locations benchmark. <strong>' + laggard.name + '</strong> sits at ' + fmtBenchmark(m, laggard.v) + ' — closing that ' + _bmFmtDelta(m, spread) + ' gap is the opportunity in view.';
  }

  // Stat row
  var stats = statCell('All-locations benchmark', fmtBenchmark(m, all), '');
  if (m.dir === 'neutral'){
    stats += statCell('Shortest', lo.name + ' · ' + fmtBenchmark(m, lo.v), 'good');
    stats += statCell('Longest', hi.name + ' · ' + fmtBenchmark(m, hi.v), '');
  } else {
    stats += statCell('Leads', leader.name + ' · ' + fmtBenchmark(m, leader.v), 'good');
    stats += statCell('Trails', laggard.name + ' · ' + fmtBenchmark(m, laggard.v), 'bad');
  }
  stats += statCell('Spread', _bmFmtDelta(m, spread), '');

  // Per-location read (canonical order)
  var rows = data.map(function(d){
    var tone = '', note;
    if (m.dir === 'neutral'){
      var diffN = d.v - all;
      if (Math.abs(diffN) < 1e-9) note = 'level with the all-locations average';
      else note = _bmFmtDelta(m, diffN) + (diffN > 0 ? ' longer than' : ' shorter than') + ' the all-locations average';
    } else {
      var p = _bmPerf(m, d.v);
      tone = p > 0 ? 'good' : p < 0 ? 'bad' : 'warn';
      note = (p === 0 ? 'on par with the benchmark' : _bmFmtDelta(m, d.v - all) + ' ' + _bmRel(m, d.v).word + ' the benchmark');
    }
    return '<div class="bm-read-row' + (tone ? ' is-' + tone : '') + '">'
      + '<span class="bm-read-name">' + d.name + '</span>'
      + '<span class="bm-read-val">' + fmtBenchmark(m, d.v) + '</span>'
      + '<span class="bm-read-note">' + note + '</span>'
      + '</div>';
  }).join('');

  var doctrine = 'This compares your own locations against each other and against your all-locations average — not against outside restaurants. Figures refresh as new data lands; where a number is modeled rather than directly measured, it stays labeled as such.';

  host.innerHTML =
      '<div class="bm-analysis-head">Analysis</div>'
    + '<p class="bm-headline">' + head + '</p>'
    + '<div class="bm-stat-row">' + stats + '</div>'
    + '<div class="bm-read">' + rows + '</div>'
    + '<div class="bm-doctrine">' + doctrine + '</div>';
}
