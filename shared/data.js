/* ════════════════════════════════════════════════════════════════════
   SKC data fixtures
   Extracted top-level data constants from script 3 of skc-demo-v30b-tooltips-floating.html
   ════════════════════════════════════════════════════════════════════ */

// ── from source lines 23726-23753 (MENU_DATA) ──
const MENU_DATA = {
  location: 'Oakland', daypart: 'Dinner', period: 'Last 28 Days',
  total_items: 2004,
  current_wavg_cm: 8.42,
  baseline_wavg_cm: 9.13,
  mix_shift_per_item: -0.71,  // 8.42 - 9.13
  est_exposure: 1420,         // ~$1,420/mo
  popularity_threshold: 8.0,
  cm_threshold: 8.75,
  // SAMPLE — cm / totalCM below and cm_threshold are derived from food cost.
  // Requires a manual cost-input layer (recipe-cost upload), not built (Taya #20).
  items: {
    crispy:  { name:'Crispy Chicken Sandwich', cls:'plow', cm:5.80, pop:18.6, units:373, rev:6714, totalCM:2163, action:'Review price or portion cost' },
    burger:  { name:'Burger',                  cls:'plow', cm:6.40, pop:12.0, units:240, rev:4560, totalCM:1536, action:'Reprice or portion review' },
    risotto: { name:'Mushroom Risotto',        cls:'puzz', cm:14.20, pop:4.2, units:84,  rev:2436, totalCM:1193, action:'Promote during dinner' },
    vodka:   { name:'Spicy Vodka Pasta',       cls:'star', cm:12.40, pop:13.1, units:263, rev:5786, totalCM:3261, action:'Protect placement' },
    fries:   { name:'Truffle Fries',           cls:'plow', cm:7.60, pop:15.8, units:317, rev:3804, totalCM:2409, action:'Watch · CM below threshold', watch:true },
    martini: { name:'Espresso Martini',        cls:'star', cm:10.80, pop:11.4, units:228, rev:3876, totalCM:2462, action:'Protect / feature' },
    burrata: { name:'Burrata Toast',           cls:'puzz', cm:9.90, pop:5.6, units:112, rev:1904, totalCM:1109, action:'Promote' },
    beet:    { name:'Beet Salad',              cls:'dog',  cm:4.10, pop:2.6, units:52,  rev:884,  totalCM:213,  action:'Review / remove' },
    kids:    { name:'Kids Pasta',              cls:'dog',  cm:3.20, pop:3.1, units:62,  rev:744,  totalCM:198,  action:'Review' },
  },
  scenarios: {
    // SAMPLE — current_cm / sim_cm derived from food cost; manual cost-input layer not built (Taya #20).
    crispy:  { title:'Crispy Chicken Sandwich +$1.00', current_price:18, sim_price:19, current_units:373, expected_units:362, current_cm:5.80, sim_cm:6.80, lift:300 },
    burger:  { title:'Burger +$1.00',                   current_price:19, sim_price:20, current_units:240, expected_units:233, current_cm:6.40, sim_cm:7.40, lift:210 },
    risotto: { title:'Promote Mushroom Risotto',        current_units:84,  expected_units:109, cm:14.20, lift:355, is_promo:true },
  },
};

// Topbar title map per subpage

// ── from source lines 23852-23861 (ACTIONS_SUBPAGE_TITLES) ──
const ACTIONS_SUBPAGE_TITLES = {
  overview: 'Actions',
  pending:  'Pending Decisions',
  active:   'Active Recovery',
  ready:    'Ready to Verify',
  blocked:  'Blocked Actions',
  history:  'Action History',
  evidence: 'Action Evidence',
};


// ── from source lines 23938-23946 (LABOR_SUBPAGE_TITLES) ──
const LABOR_SUBPAGE_TITLES = {
  overview:   'Labor Efficiency',
  heatmap:    'Labor Heatmap',
  staffing:   'Staffing Plan',
  benchmarks: 'Labor Benchmarks',
  coaching:   'Server Coaching',
  evidence:   'Labor Evidence',
};


// ── from source lines 24020-24044 (LE_CO_AXES) ──
const LE_CO_AXES = {
  revenue: {
    state: 'full',
    label: 'Revenue contribution',
    sub: 'Premium attach · items/check · modifier capture',
    metricNote: 'Toast item categories tagged · ready'
  },
  retention: {
    state: 'partial', // loyalty captures ~28% of covers
    label: 'Guest retention',
    sub: 'Repeat-guest rate · regular request rate',
    metricNote: 'Toast loyalty connected · 28% capture rate · suggest 60%+'
  },
  reliability: {
    state: 'full',
    label: 'Service reliability',
    sub: 'Comp rate · void rate · re-fire rate',
    metricNote: 'Toast void/comp reasons structured · ready'
  }
};

// Servers: 14 total, but only those with top/bottom quartile signal are surfaced.
// Each server has scores 0–100 per axis. 'null' = no data for that axis (server hasn't
// hit min sample, OR axis is locked at the platform level).
// Pattern is derived from scores by classifyPattern().

// ── from source lines 24045-24154 (LE_CO_SERVERS) ──
const LE_CO_SERVERS = [
  {
    name: 'Sarah C.', shift: 'Dinner', location: 'Oakland', section: '4-top',
    shifts: 23, confidence: 86,
    scores: { revenue: 90, retention: 84, reliability: 88 },
    prevScores: { revenue: 85, retention: 82, reliability: 87 },
    lastCoachedDays: 14, lastCoachedTopic: 'Modifier upsell',
    rawMetrics: {
      premiumAttach: '41%', premiumMedian: '23%',
      itemsCheck: '5.2', itemsMedian: '4.1',
      modCapture: '71%', modMedian: '52%',
      repeatRate: '34%', repeatMedian: '21%',
      compRate: '0.4%', compMedian: '1.1%'
    }
  },
  {
    name: 'Priya R.', shift: 'Dinner', location: 'Berkeley', section: 'patio',
    shifts: 21, confidence: 81,
    scores: { revenue: 82, retention: 76, reliability: 79 },
    prevScores: { revenue: 78, retention: 72, reliability: 76 },
    lastCoachedDays: null,
    rawMetrics: {
      premiumAttach: '34%', premiumMedian: '23%',
      itemsCheck: '4.7', itemsMedian: '4.1',
      modCapture: '64%', modMedian: '52%',
      repeatRate: '28%', repeatMedian: '21%',
      compRate: '0.6%', compMedian: '1.1%'
    }
  },
  {
    name: 'Devon K.', shift: 'Brunch', location: 'Walnut Creek', section: '4-top',
    shifts: 19, confidence: 76,
    scores: { revenue: 78, retention: 52, reliability: 71 },
    prevScores: { revenue: 81, retention: 55, reliability: 72 },
    lastCoachedDays: 21, lastCoachedTopic: 'Retention follow-up',
    rawMetrics: {
      premiumAttach: '29%', premiumMedian: '19%',
      itemsCheck: '3.8', itemsMedian: '3.2',
      modCapture: '58%', modMedian: '46%',
      repeatRate: '19%', repeatMedian: '18%',
      compRate: '0.9%', compMedian: '1.3%'
    }
  },
  {
    name: 'Elena V.', shift: 'Dinner', location: 'Oakland', section: 'window',
    shifts: 18, confidence: 79,
    scores: { revenue: 58, retention: 88, reliability: 84 },
    prevScores: { revenue: 60, retention: 85, reliability: 82 },
    lastCoachedDays: null,
    rawMetrics: {
      premiumAttach: '21%', premiumMedian: '23%',
      itemsCheck: '4.0', itemsMedian: '4.1',
      modCapture: '50%', modMedian: '52%',
      repeatRate: '42%', repeatMedian: '21%',
      compRate: '0.3%', compMedian: '1.1%'
    }
  },
  {
    name: 'Tom F.', shift: 'Brunch', location: 'Berkeley', section: '4-top',
    shifts: 17, confidence: 73,
    scores: { revenue: 49, retention: 81, reliability: 78 },
    prevScores: { revenue: 52, retention: 79, reliability: 76 },
    lastCoachedDays: 28, lastCoachedTopic: 'Premium attach drills',
    rawMetrics: {
      premiumAttach: '15%', premiumMedian: '19%',
      itemsCheck: '3.0', itemsMedian: '3.2',
      modCapture: '43%', modMedian: '46%',
      repeatRate: '36%', repeatMedian: '18%',
      compRate: '0.5%', compMedian: '1.3%'
    }
  },
  {
    name: 'Marcus L.', shift: 'Dinner', location: 'Oakland', section: '4-top',
    shifts: 16, confidence: 74,
    scores: { revenue: 22, retention: 48, reliability: 56 },
    prevScores: { revenue: 26, retention: 52, reliability: 58 },
    lastCoachedDays: 9, lastCoachedTopic: 'Premium attach focus',
    rawMetrics: {
      premiumAttach: '12%', premiumMedian: '23%',
      itemsCheck: '3.4', itemsMedian: '4.1',
      modCapture: '41%', modMedian: '52%',
      repeatRate: '17%', repeatMedian: '21%',
      compRate: '1.2%', compMedian: '1.1%'
    },
    estLift: '$148/wk'
  },
  {
    name: 'Jordan T.', shift: 'Dinner', location: 'Oakland', section: 'bar-rail',
    shifts: 14, confidence: 68,
    scores: { revenue: 28, retention: 41, reliability: 62 },
    prevScores: { revenue: 24, retention: 38, reliability: 60 },
    lastCoachedDays: 32, lastCoachedTopic: 'Items/check + repeat-guest',
    rawMetrics: {
      premiumAttach: '14%', premiumMedian: '23%',
      itemsCheck: '3.6', itemsMedian: '4.1',
      modCapture: '47%', modMedian: '52%',
      repeatRate: '14%', repeatMedian: '21%',
      compRate: '0.8%', compMedian: '1.1%'
    },
    estLift: '$94/wk'
  },
  {
    name: 'Alex M.', shift: 'Lunch', location: 'Berkeley', section: '4-top',
    shifts: 13, confidence: 62,
    scores: { revenue: 18, retention: 24, reliability: 35 },
    prevScores: { revenue: 16, retention: 22, reliability: 33 },
    lastCoachedDays: null,
    rawMetrics: {
      premiumAttach: '9%', premiumMedian: '16%',
      itemsCheck: '2.9', itemsMedian: '3.4',
      modCapture: '38%', modMedian: '44%',
      repeatRate: '11%', repeatMedian: '15%',
      compRate: '1.4%', compMedian: '1.2%'
    },
    estLift: '$67/wk'
  }
];

// Classify a server into a pattern based on their axis scores.
// Rules (per-axis: top = score>=70, bottom = score<=35, otherwise mid):
//   - top on all 3 (or top on 2 if 3rd locked) → triple-threat
//   - top on revenue only, others mid           → revenue-specialist
//   - top on retention/reliability, revenue mid → hospitality-specialist
//   - bottom on 2+ axes                         → structural
//   - bottom on exactly 1 axis                  → coaching
//   - otherwise (all mid)                       → null (not surfaced)

// ── from source lines 24170-24178 (LE_CO_PATTERN_META) ──
const LE_CO_PATTERN_META = {
  triple:       { label: 'Triple-threat',        cls: 'pattern-triple',       short: 'TRIPLE-THREAT' },
  revenue:      { label: 'Revenue specialist',   cls: 'pattern-revenue',      short: 'REVENUE SPEC' },
  hospitality:  { label: 'Hospitality spec.',    cls: 'pattern-hospitality',  short: 'HOSPITALITY' },
  coaching:     { label: 'Coaching opportunity', cls: 'pattern-coaching',     short: 'COACHING OPP' },
  structural:   { label: 'Structural concern',   cls: 'pattern-structural',   short: 'STRUCTURAL' }
};

// Compute the quartile class for a bar fill given a score.

// ── from source lines 24397-24404 (TT_SUBPAGE_TITLES) ──
const TT_SUBPAGE_TITLES = {
  overview:   'Table Turns · Watch',
  playbooks:  'Table Turns · Decide',
  evidence:   'Table Turns · Evidence',
};


// ── from source lines 24698-24723 (MENU_SIM_SCENARIOS) ──
// SAMPLE — curCm / simCm / formula values derive from food cost; manual cost-input layer not built (Taya #20).
const MENU_SIM_SCENARIOS = {
  crispy: {
    title: 'Crispy Chicken Sandwich · price +$1.00',
    why: 'Plowhorse. $5.80 CM is $2.95 below the $8.75 threshold. Highest single-item exposure on the dinner menu.',
    curPrice: '$18.00', curCm: '$5.80', curUnits: '373', curTotal: '$2,163.40',
    simPrice: '$19.00', simCm: '$6.80', simUnits: '362 (−3.0%)', simTotal: '$2,461.60',
    formula: 'Lift = (362 × $6.80) − (373 × $5.80) = $2,461.60 − $2,163.40 = $298.20',
    lift: '~$300'
  },
  burger: {
    title: 'Burger · price +$1.00',
    why: 'Plowhorse. $6.40 CM is $2.35 below threshold. Second-largest dinner exposure after Crispy.',
    curPrice: '$19.00', curCm: '$6.40', curUnits: '240', curTotal: '$1,536.00',
    simPrice: '$20.00', simCm: '$7.40', simUnits: '236 (−1.7%)', simTotal: '$1,746.40',
    formula: 'Lift = (236 × $7.40) − (240 × $6.40) = $1,746.40 − $1,536.00 = $210.40',
    lift: '~$210'
  },
  risotto: {
    title: 'Promote Mushroom Risotto',
    why: 'Puzzle. $14.20 CM, but only 4.2% popularity. Promo placement test targets +30% units against a fixed CM.',
    curPrice: '$26.00', curCm: '$14.20', curUnits: '84', curTotal: '$1,192.80',
    simPrice: '$26.00', simCm: '$14.20', simUnits: '109 (+30%)', simTotal: '$1,547.80',
    formula: 'Lift = (109 − 84) × $14.20 = 25 × $14.20 = $355.00',
    lift: '~$355'
  }
};


// ════════════════════════════════════════════════════════════════════
// (table_turns) Watch scenarios — per service-day data for the day switcher.
// Friday · Oakland remains the hand-built static block in screens/table-turns.html;
// Saturday and Sunday are generated from this data into the same Friday layout
// by ttRenderDay() in controllers.js. Only the fields the Watch view renders are
// kept here (aiResolution / kitchenEvidence belong to Decide / Evidence).
// ════════════════════════════════════════════════════════════════════
const TT_SVC_HOURS = {
  Lunch:  ['11 AM','12 PM','1 PM','2 PM'],
  Dinner: ['5 PM','6 PM','7 PM','8 PM','9 PM'],
  Brunch: ['10 AM','11 AM','12 PM','1 PM','2 PM']
};
// Oakland dining-room seat capacity — a measured constant (POS table map), not a guess.
var TT_SEATS = 42;

// Build a full Watch service scenario from a compact config.
// Every headline number below is COMPUTED from the throughput model the Evidence
// subpage documents — none are hand-asserted. Inputs (durations, seats, avg check)
// stand in for measured feeds; `realization` is the one forecast/estimated term.
function ttMkSvc(p){
  var stages = p.stages.map(function(s,i){ return {id:i+1,name:s[0],targetMin:s[1],actualMin:s[2],delta:s[2]-s[1],status:'in_tolerance'}; });
  var maxD = Math.max.apply(null, stages.map(function(s){return s.delta;}));
  stages.forEach(function(s){ s.status = (s.delta===maxD && maxD>0) ? 'bottleneck' : (s.delta<=0 ? 'on_target' : 'in_tolerance'); });
  var actual=0,expected=0; stages.forEach(function(s){ actual+=s.actualMin; expected+=s.targetMin; });
  var over=actual-expected;

  // ── Throughput model — DERIVE lost covers + revenue (arithmetic on measured inputs) ──
  var hrs=TT_SVC_HOURS[p.meal]||[], n=hrs.length;
  var serviceHours = Math.max(1, n-1);                       // span between first & last hour label
  var seats        = p.seats || TT_SEATS;
  var realization  = (p.realization != null ? p.realization : 0.36); // forecast fill rate (the EST term)
  var theoTurns    = serviceHours*60/expected;               // turns/seat at the expected pace
  var actTurns     = serviceHours*60/actual;                 // turns/seat at the measured pace
  var deltaTurns   = theoTurns - actTurns;                   // turns/seat lost to slow turns
  var theoLost     = deltaTurns*seats;                       // gross covers lost / service
  var lostCovers   = Math.floor(theoLost*realization);       // realized covers — always FLOORED (conservative)
  var revExact     = lostCovers*p.chk;                       // covers × avg check
  var revWeekly    = Math.floor(revExact/10)*10;             // floor to $10 — no false precision, matches floor doctrine
  var monthly      = Math.round(revWeekly*4.33);

  // ── Confidence band on the recoverable $ — the one modeled number gets an honest range ──
  // Width is DERIVED from the two on-page trust signals: pattern confidence + history depth.
  // Lower confidence or thinner history ⇒ wider band; more weeks of history tightens it.
  var histWeeks  = Math.max(8, Math.round(p.conf/7));
  var spreadRel  = 0.45 * (1 - p.conf/100) / Math.sqrt(histWeeks/8);  // ≈10% at 74% conf · 11 wks
  var revLow     = Math.floor(revWeekly*(1-spreadRel)/10)*10;         // floor the low — conservative
  var revHigh    = Math.ceil (revWeekly*(1+spreadRel)/10)*10;         // ceil the high — honest about upside

  // ── Hourly overage — demand-weighted so the cover-weighted mean ≡ headline `over` ──
  // o_h = over·d_h·(Σd/Σd²) makes Σ(d_h·o_h)/Σd_h === over exactly (cover-weighted reconciliation).
  var pk=(p.peak!=null?p.peak:Math.floor(n/2)), sigma=1.25;
  var dem = hrs.map(function(_,i){ return Math.exp(-0.5*Math.pow((i-pk)/sigma,2)); }); // demand bell, peak at pk
  var sumD=0,sumD2=0; dem.forEach(function(d){ sumD+=d; sumD2+=d*d; });
  var kScale = sumD2>0 ? sumD/sumD2 : 1;
  var rows=hrs.map(function(hr,i){
    var ov=Math.round(over*dem[i]*kScale);
    var sev = ov<=2 ? 'green' : (i===pk ? 'red' : 'amber');
    return { hour:hr, label:(ov<=2?'On pace':'+'+ov+' min over')+(i===pk?' · worst hour':''), totalMin:expected+ov, overTargetMin:ov, severity:sev };
  });

  return {
    id:(p.day+'-'+p.meal).toLowerCase(), day:p.day, service:p.meal, timeWindow:p.win, location:'Oakland', status:'Watch',
    heroInsight:{ message:'', patternConfidence:p.conf },
    forecastHistWeeks: histWeeks,
    summaryCards:[{},{},{},{subtext:p.note}],
    diagnosisPanel:{ estimatedWeeklyRevenue:revWeekly, revLow:revLow, revHigh:revHigh, monthlyPace:monthly },
    stageBreakdown:{ actualTotalMin:actual, targetTotalMin:expected, overTargetMin:over, stageCount:stages.length, stages:stages },
    recommendedActionCard:{ action:p.action },
    hourlyRows:rows,
    worstStretch:{ message: hrs[pk] + ' is your worst stretch — ' + (p.bnNote||'the bottleneck stage runs well past its expected pace') + '.' },
    formula:{ values:{ averageCheck:p.chk, missedTables:lostCovers, missedRevenue:revWeekly },
              trace:{ serviceHours:serviceHours, seats:seats, expectedMin:expected, actualMin:actual,
                      theoTurns:+theoTurns.toFixed(2), actTurns:+actTurns.toFixed(2), deltaTurns:+deltaTurns.toFixed(2),
                      theoLost:+theoLost.toFixed(1), realization:realization, lostCovers:lostCovers, revExact:revExact,
                      spreadPct:+(spreadRel*100).toFixed(1), revLow:revLow, revHigh:revHigh } }
  };
}
// Each day's services (illustrative). Lunch+Dinner on weekdays; Brunch+Dinner on weekends.
const TT_WATCH_SCENARIOS = {};
[
  { day:'Monday',   meal:'Lunch',  win:'11 AM–2 PM', conf:60, chk:26, realization:0.28, peak:2, note:'Seen 2 of last 4 Mondays',   action:'Add a second register at the noon counter rush',        bnNote:'ordering backs up at the counter', stages:[['Seat',6,6],['Order',12,17],['Eat',20,21],['Pay',6,6]] },
  { day:'Tuesday',  meal:'Lunch',  win:'11 AM–2 PM', conf:63, chk:27, realization:0.28, peak:1, note:'Seen 3 of last 5 Tuesdays',  action:'Pre-fire the top three lunch mains before the rush',     bnNote:'the kitchen falls behind on mains', stages:[['Seat',6,7],['Order',12,13],['Eat',21,25],['Pay',6,6]] },
  { day:'Wednesday',meal:'Lunch',  win:'11 AM–2 PM', conf:65, chk:29, realization:0.3, peak:2, note:'Seen 3 of last 4 Wednesdays',action:'Drop checks proactively at the 35-minute mark',          bnNote:'guests wait on the check', stages:[['Seat',6,6],['Order',12,13],['Eat',21,21],['Pay',6,12]] },
  { day:'Thursday', meal:'Lunch',  win:'11 AM–2 PM', conf:66, chk:28, realization:0.3, peak:1, note:'Seen 3 of last 4 Thursdays', action:'Take orders tableside within 3 minutes of seating',      bnNote:'ordering is slow to start', stages:[['Seat',6,7],['Order',13,18],['Eat',21,21],['Pay',6,6]] },
  { day:'Friday',   meal:'Lunch',  win:'11 AM–2 PM', conf:67, chk:28, realization:0.34, peak:2, note:'Seen 3 of last 4 Fridays',   action:'Take orders tableside within 3 minutes of seating at lunch', bnNote:'ordering backs up during the midday rush', stages:[['Seat',6,7],['Order',13,18],['Eat',22,21],['Pay',6,6]] },
  { day:'Monday',   meal:'Dinner', win:'5–9 PM',     conf:64, chk:58, realization:0.3, peak:2, note:'Seen 2 of last 4 Mondays',   action:'Present the dessert menu at the 55-minute mark',         bnNote:'guests linger before paying', stages:[['Seat',8,9],['Order',20,21],['Eat',34,37],['Pay',12,18]] },
  { day:'Tuesday',  meal:'Dinner', win:'5–9 PM',     conf:66, chk:60, realization:0.32, peak:2, note:'Seen 4 of last 5 Tuesdays',  action:'Add sauté support during the 6–8 PM push',     bnNote:'entrée ticket time stretches', stages:[['Seat',8,8],['Order',20,22],['Eat',35,48],['Pay',12,12]] },
  { day:'Wednesday',meal:'Dinner', win:'5–9 PM',     conf:62, chk:56, realization:0.3, peak:2, note:'Seen 3 of last 5 Wednesdays',action:'Pre-drop checks during the entrée clear',          bnNote:'the check stage drags', stages:[['Seat',8,9],['Order',20,21],['Eat',33,38],['Pay',12,19]] },
  { day:'Thursday', meal:'Dinner', win:'5–9 PM',     conf:71, chk:66, realization:0.34, peak:3, note:'Seen 4 of last 5 Thursdays', action:'Servers present the dessert menu at the 60-minute mark', bnNote:'dessert-to-check runs long', stages:[['Seat',8,10],['Order',20,22],['Eat',38,40],['Pay',12,20]] },
  { day:'Friday',   meal:'Dinner', win:'5–9 PM',     conf:74, chk:76, realization:0.36, peak:3, note:'Seen 3 of last 4 Fridays',   action:'Servers present the dessert menu at the 60-minute mark', bnNote:'guests linger between dessert and the check', stages:[['Seat',8,10],['Order',20,22],['Eat',36,40],['Pay',12,22]] },
  { day:'Saturday', meal:'Brunch', win:'10 AM–2 PM', conf:69, chk:42, realization:0.36, peak:2, note:'Seen 3 of last 4 Saturdays', action:'Stagger reservations and add a host runner for the 11–1 wave', bnNote:'the host stand backs up as the wave arrives', stages:[['Seat',8,16],['Order',16,17],['Eat',28,29],['Pay',8,8]] },
  { day:'Sunday',   meal:'Brunch', win:'10 AM–2 PM', conf:72, chk:44, realization:0.26, peak:3, note:'Seen 4 of last 5 Sundays',   action:'Add a second host and pre-bus during the brunch rush',  bnNote:'guests wait while tables sit unseated', stages:[['Seat',8,18],['Order',16,17],['Eat',26,30],['Pay',8,8]] },
  { day:'Saturday', meal:'Dinner', win:'6–10 PM',    conf:68, chk:88, realization:0.38, peak:3, note:'Seen 2 of last 4 Saturdays', action:'Add a 7–9 PM reset captain and table-ready host signal', bnNote:'tables are slow to reset and reseat', stages:[['Seat',8,9],['Order',20,20],['Eat',37,37],['Pay',12,12],['Reset',0,9]] },
  { day:'Sunday',   meal:'Dinner', win:'5–9 PM',     conf:82, chk:74, realization:0.38, peak:2, note:'Seen 4 of last 5 Sundays',   action:'Move prep earlier and add Sunday 6–8 PM sauté support', bnNote:'entrée ticket time stretches the meal', stages:[['Seat',8,8],['Order',20,22],['Eat',40,50],['Pay',12,12]] }
].forEach(function(c){ TT_WATCH_SCENARIOS[(c.day+'-'+c.meal).toLowerCase()] = ttMkSvc(c); });

// Day -> ordered meal services. Sidebar location filters which days show.
const TT_WATCH_DAYS = {
  monday:    { day:'Monday',    location:'Oakland', meals:[{key:'monday-lunch',label:'Lunch'},      {key:'monday-dinner',label:'Dinner'}] },
  tuesday:   { day:'Tuesday',   location:'Oakland', meals:[{key:'tuesday-lunch',label:'Lunch'},     {key:'tuesday-dinner',label:'Dinner'}] },
  wednesday: { day:'Wednesday', location:'Oakland', meals:[{key:'wednesday-lunch',label:'Lunch'},   {key:'wednesday-dinner',label:'Dinner'}] },
  thursday:  { day:'Thursday',  location:'Oakland', meals:[{key:'thursday-lunch',label:'Lunch'},    {key:'thursday-dinner',label:'Dinner'}] },
  friday:    { day:'Friday',    location:'Oakland', meals:[{key:'friday-lunch',label:'Lunch'},      {key:'friday-dinner',label:'Dinner'}] },
  saturday:  { day:'Saturday',  location:'Oakland', meals:[{key:'saturday-brunch',label:'Brunch'},  {key:'saturday-dinner',label:'Dinner'}] },
  sunday:    { day:'Sunday',    location:'Oakland', meals:[{key:'sunday-brunch',label:'Brunch'},    {key:'sunday-dinner',label:'Dinner'}] }
};

if (typeof window !== "undefined") window.TT_WATCH_SCENARIOS = TT_WATCH_SCENARIOS;
if (typeof window !== "undefined") window.TT_WATCH_DAYS = TT_WATCH_DAYS;
