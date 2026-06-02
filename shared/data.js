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
const TT_WATCH_SCENARIOS = {
  saturday: {
    id: 'saturday', day: 'Saturday', service: 'Dinner', timeWindow: '6–10 PM',
    location: 'Oakland', status: 'Watch',
    heroInsight: {
      message: "Saturday dinner at Oakland is running 11 minutes long, but the issue is not guest linger. Tables are taking too long to reset and reseat after guests leave. That's about 7 tables you couldn't seat this week — roughly ~$615 in revenue missed. The pattern has shown up 2 of the last 4 Saturdays, mostly between 7–9 PM.",
      patternConfidence: 68
    },
    summaryCards: [
      { label: 'HOW LONG TABLES SIT', value: '87 min', subtext: '11 min over your 76-min target', status: 'warning' },
      { label: 'TABLES YOU MISSED', value: '7', subtext: "/wk · seats you couldn't fill", status: 'warning' },
      { label: 'REVENUE LEFT ON TABLE', value: '~$615', subtext: '/wk · estimate, not guaranteed', status: 'warning' },
      { label: 'IS IT A REAL PATTERN?', value: '68%', subtext: 'Seen 2 of last 4 Saturdays', status: 'watch' }
    ],
    diagnosisPanel: {
      eyebrow: 'WHY SATURDAY IS SLOW', badge: 'HOST + BUS',
      headline: 'Tables are not being reset and reseated fast enough after guests leave',
      body: 'Guests are finishing at a normal pace, but tables are taking too long to become guest-ready and too long to be reseated once ready. The biggest delay is between payment, bussing, reset, host awareness, and reseating. During 7–9 PM, this creates a front-door bottleneck where guests wait while revenue-capable tables sit idle.',
      estimatedWeeklyRevenue: 615, monthlyPace: 2665,
      explanation: "That's 7 tables a week you could have seated but didn't, at an average check of $87.90. About $2,665/month at this pace."
    },
    stageBreakdown: {
      actualTotalMin: 87, targetTotalMin: 76, overTargetMin: 11, stageCount: 5,
      stages: [
        { id: 1, name: 'Seat', targetMin: 8, actualMin: 9, delta: 1, status: 'in_tolerance' },
        { id: 2, name: 'Order', targetMin: 20, actualMin: 20, delta: 0, status: 'on_target' },
        { id: 3, name: 'Eat', targetMin: 36, actualMin: 37, delta: 1, status: 'in_tolerance' },
        { id: 4, name: 'Pay', targetMin: 12, actualMin: 12, delta: 0, status: 'on_target' },
        { id: 5, name: 'Reset', targetMin: 0, actualMin: 9, delta: 9, status: 'bottleneck' }
      ]
    },
    recommendedActionCard: {
      action: 'Add a 7–9 PM reset captain and table-ready host signal',
      description: 'Assign one support person to own table reset visibility during the Saturday rush. Host should receive a table-ready signal immediately after reset instead of waiting for visual confirmation.'
    },
    serviceGuardrails: {
      summary: 'No guest-facing quality drop detected — the issue happens after guests leave, not during the meal.',
      checks: [
        { label: 'Guest spend', current: '$88.10', baseline: '$87.70', status: 'Holding' },
        { label: 'Reviews mention rushing?', current: 'No', baseline: 'No', status: 'Pass' },
        { label: 'Complaints per 100 guests', current: '1.1', baseline: '1.3', status: 'Steady' }
      ],
      warning: 'If complaints rise or reviews mention rushed service, the savings should not count.'
    },
    hourlyRows: [
      { hour: '6 PM', label: 'In target · early dinner flow stable', totalMin: 78, overTargetMin: 2, severity: 'green' },
      { hour: '7 PM', label: '+9 min over · reset delay starts', totalMin: 85, overTargetMin: 9, severity: 'amber' },
      { hour: '8 PM', label: '+18 min over · host stand backlog + reset lag', totalMin: 94, overTargetMin: 18, severity: 'red' },
      { hour: '9 PM', label: '+13 min over · late recovery, table-ready signal still slow', totalMin: 89, overTargetMin: 13, severity: 'amber' },
      { hour: '10 PM', label: '+4 min over · rush clears', totalMin: 80, overTargetMin: 4, severity: 'green' }
    ],
    worstStretch: { message: '8 PM is your worst stretch. Total overage peaks at +18 min, with most of the delay happening after payment when tables should be reset and reseated.' },
    formula: { values: { averageCheck: 87.9, missedTables: 7, missedRevenue: 615.3 } }
  },

  sunday: {
    id: 'sunday', day: 'Sunday', service: 'Dinner', timeWindow: '5–9 PM',
    location: 'Oakland', status: 'Action Needed',
    heroInsight: {
      message: "Sunday dinner at Oakland is running 16 minutes long, but the delay is not at the check. Entree ticket time is stretching the meal by about 12 minutes per table — roughly 8 tables missed and ~$590 in weekly revenue at risk. This has shown up 4 of the last 5 Sundays.",
      patternConfidence: 82
    },
    summaryCards: [
      { label: 'HOW LONG TABLES SIT', value: '92 min', subtext: '16 min over your 76-min target', status: 'danger' },
      { label: 'TABLES YOU MISSED', value: '8', subtext: "/wk · seats you couldn't fill", status: 'danger' },
      { label: 'REVENUE LEFT ON TABLE', value: '~$590', subtext: '/wk · estimate, not guaranteed', status: 'warning' },
      { label: 'IS IT A REAL PATTERN?', value: '82%', subtext: 'Seen 4 of last 5 Sundays', status: 'strong' }
    ],
    diagnosisPanel: {
      eyebrow: 'WHY SUNDAY IS SLOW', badge: 'KDS',
      headline: 'Tables sit too long because entree pacing is stretching the meal, not because guests are delaying payment',
      body: 'The front-of-house flow is mostly inside target. Seating, ordering, dessert, and payment are stable. The delay is concentrated in the entree window, where kitchen ticket times stretch during the 6–8 PM rush. This causes tables to stay occupied longer even though servers are moving guests through the experience normally.',
      estimatedWeeklyRevenue: 590, monthlyPace: 2557,
      explanation: "That's 8 tables a week you could have seated but didn't, at an average check of $73.80. About $2,557/month at this pace."
    },
    stageBreakdown: {
      actualTotalMin: 92, targetTotalMin: 76, overTargetMin: 16, stageCount: 4,
      stages: [
        { id: 1, name: 'Seat', targetMin: 8, actualMin: 8, delta: 0, status: 'on_target' },
        { id: 2, name: 'Order', targetMin: 20, actualMin: 22, delta: 2, status: 'in_tolerance' },
        { id: 3, name: 'Eat', targetMin: 36, actualMin: 50, delta: 14, status: 'bottleneck' },
        { id: 4, name: 'Pay', targetMin: 12, actualMin: 12, delta: 0, status: 'on_target' }
      ]
    },
    recommendedActionCard: {
      action: 'Move prep earlier and add Sunday 6–8 PM sauté support',
      description: 'Pre-portion Sunday sauté mise en place before 5 PM and add one support person to cover garnish, pasta drops, and pan resets during the 6–8 PM push. This targets entree ticket time without pressuring servers to rush guests.'
    },
    serviceGuardrails: {
      summary: 'This action is safe only if food quality and remake rates hold. Savings should be blocked if faster ticket times cause complaints, remakes, or comps.',
      checks: [
        { label: 'Guest spend', current: '$73.80', baseline: '$74.10', status: 'Holding' },
        { label: 'Food remake rate', current: '2.4%', baseline: '1.8%', status: 'Watch' },
        { label: 'Complaints per 100 guests', current: '1.9', baseline: '1.5', status: 'Watch' }
      ],
      warning: 'Because remake rate is slightly elevated, this should start as Monitoring, not Verified Savings.'
    },
    hourlyRows: [
      { hour: '5 PM', label: 'In target · early tables moving normally', totalMin: 77, overTargetMin: 1, severity: 'green' },
      { hour: '6 PM', label: '+12 min over · entree ticket time begins drifting', totalMin: 88, overTargetMin: 12, severity: 'amber' },
      { hour: '7 PM', label: '+26 min over · sauté station bottleneck', totalMin: 102, overTargetMin: 26, severity: 'red' },
      { hour: '8 PM', label: '+19 min over · delayed entrees, recovery begins', totalMin: 95, overTargetMin: 19, severity: 'amber' },
      { hour: '9 PM', label: '+4 min over · kitchen clears backlog', totalMin: 80, overTargetMin: 4, severity: 'green' }
    ],
    worstStretch: { message: '7 PM is your worst stretch. Total overage peaks at +26 min, with the majority of delay coming from entree ticket time, especially sauté-heavy menu items.' },
    formula: { values: { averageCheck: 73.8, missedTables: 8, missedRevenue: 590.4 } }
  }
};

// Expose for cross-file access (controllers.js render + window fallback)
if (typeof window !== "undefined") window.TT_WATCH_SCENARIOS = TT_WATCH_SCENARIOS;
