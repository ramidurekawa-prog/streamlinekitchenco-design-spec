/* ════════════════════════════════════════════════════════════════════
   SKC core platform JS
   Bulk of script 3 + script 4 (SKC_TRUST) from skc-demo-v30b-tooltips-floating.html
   ════════════════════════════════════════════════════════════════════ */

// ────────────────────────────────────────────────────────────────────
// Bulk of script 3: everything not routed to data/controllers/server-coaching/tooltips
// (preserves source order; chunks routed elsewhere appear as gaps here)
// ────────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
//  OPPORTUNITIES  —  canonical profit leak objects
//
//  Single source for: Profit Recovery cards, Today hero, Evidence
//  Drawer, Ask SKC responses, Actions board, Proof, Reports.
//
//  All consumers read from OPPORTUNITIES[id].
//  No duplicate dollar values, confidence scores, or source lists.
// ═══════════════════════════════════════════════════════════════

const OPPORTUNITIES = {

  // ──────────────────────────────────────────────────────────────────────
  //  OPP-001 · Labor · Tuesday–Wednesday dinner overstaffing
  //
  //  Operational event: March catering bump raised covers to 112/night.
  //  Covers normalised to 87 in April. Schedule was never reduced.
  //  6 excess server hours running every Tue + Wed dinner since.
  //
  //  Time chain (corrected model):
  //    5 excess hrs × $37 fully loaded = $185/service per location
  //    $185/service × 2 services/wk    = $370/wk per location
  //    $370/wk × 4.33 wks/mo          = $1,602/mo ≈ $1,600/mo per location (stated)
  //    2 locations × $1,600/mo        = $3,200/mo portfolio estimated run-rate
  //    Verified savings: $0 — action not yet created
  //    Counted in ROI: NO
  // ──────────────────────────────────────────────────────────────────────
  labor: {
    opportunity_id: 'OPP-001',
    leak_key:       'leak1',

    // (Taya #18) Static risk & effort profile — surfaced in the evidence drawer.
    risk: {
      difficulty: 'Low',
      time:       'This week (next schedule)',
      guest:      'low',       // overstaffed — removing one server should not affect service
      staff:      'moderate',  // one server loses a Tue/Wed dinner shift
      revenue:    'low',       // guardrails hold table turns + avg check
    },
    ca_key:         'leak1',

    title:          'Tuesday–Wednesday dinner overstaffing',
    subtitle:       'Scheduled labour has not adjusted since March catering event normalised',
    category:       'Labor',
    location_id:    'OAK+BRK',
    location_name:  'Oakland + Berkeley',
    daypart:        'Dinner (Tue + Wed)',
    weeks_running:  6,

    status:         'Active Recovery',
    status_key:     'active-recovery',
    output_type:    'active_recovery',  // status: action assigned, monitoring started

    get confidence_score() {
      const base = 85;
      const penalty = SKC_STATE.data_quality.sources.shifts.status === 'stale' ? 7 : 0;
      return base - penalty;   // 78 when 7shifts stale
    },
    get confidence_label() {
      const s = this.confidence_score;
      return s >= 80 ? 'High' : s >= 65 ? 'Moderate-High' : 'Moderate';
    },

    // ── Impact — corrected labor model (v20) ────────────────────────────
    //   Formula: 5 excess hrs × $37 fully loaded labor cost = $185/service (per location)
    //   $185/service × 2 services/week = $370/week per location
    //   $370/week × 4.33 = $1,602/mo ≈ $1,600/mo per location (stated)
    //   2 locations × $1,600/mo = $3,200/mo portfolio estimated run-rate
    //   RPLH is diagnostic evidence — proves the inefficiency, does NOT compute the dollar value.
    impact: {
      // Per-service per location: 5 excess hrs × $37 fully loaded = $185
      get per_service_impact()              { return 185;   },
      per_service_basis:                    'Per affected dinner service (Tue or Wed), per location — 5 excess server hours × $37 fully loaded labor cost',

      // Per-week per location: $185/service × 2 services = $370/wk
      get weekly_per_location()             { return 370;   },
      weekly_per_location_basis:            'Per location — 2 affected dinner services per week (Tue + Wed) × $185 per service',

      // Affected services per week portfolio: 2 nights/wk × 2 locations = 4
      get affected_services_per_week()      { return 4;     },
      affected_services_basis:              '2 nights/week (Tue + Wed) × 2 locations (Oakland + Berkeley)',

      // Weekly portfolio: $370/wk × 2 locations = $740/wk
      get weekly_exposure()                 { return 740;   },
      weekly_basis:                         'Portfolio — Oakland $370/wk + Berkeley $370/wk',

      // Monthly run-rate per location: $370/wk × 4.33 = $1,602 → stated $1,600/mo
      get monthly_run_rate()                { return 1600;  },
      monthly_run_rate_basis:               'Per location — $370/wk × 4.33 wks/mo = $1,602 estimated run-rate',

      // Open opportunity (per location, primary stated value)
      get monthly_open_opportunity()        { return 1600;  },
      open_opportunity_basis:               'Per location (Oakland) · estimated monthly run-rate · NOT counted in ROI',

      // Portfolio: 2 locations × $1,600 = $3,200/mo
      get portfolio_monthly_impact()        { return 3200;  },
      portfolio_basis:                      'Oakland + Berkeley combined — 2 × $1,600/mo = $3,200/mo estimated portfolio run-rate · NOT counted in ROI',

      // Per-location (same as monthly_run_rate)
      get location_monthly_impact()         { return 1600;  },
      location_basis:                       'Per location · $370/wk × 4.33 = $1,600/mo estimated run-rate',

      // Active recovery: $0 — action not yet created
      get monthly_active_recovery()         { return 0;     },
      active_recovery_basis:                '$0 — no action created yet. Becomes active recovery once action is assigned.',

      // Verified savings: $0 — nothing monitored yet
      get monthly_verified_savings()        { return 0;     },
      verified_savings_basis:               '$0 — not yet monitored. Requires 2 consecutive Tuesdays at RPLH ≥ $36.50 with all guardrails passing.',

      // ROI status
      get counted_in_verified_roi()         { return false; },
      roi_basis:                            'NOT counted in ROI. Counts only after verified recovery confirmed by monitoring.',
    },

    // ── Calculation ────────────────────────────────────────────────────
    calculation: {
      diagnostic_metrics: {
        rplh_current:    31.40,   // $/hr · Toast POS · DET (diagnostic evidence only)
        rplh_baseline:   38.20,   // $/hr · 8-wk rolling avg
        rplh_gap:         6.80,   // $/hr gap (diagnostic)
        hours_scheduled:    28,   // hrs/night · 7shifts · DET
        hours_needed:       22,   // hrs/night · model
        hours_excess:        6,   // hrs/night
      },
      formula_name:  'Labor Cost Recovery — Excess Hours × Fully Loaded Wage',
      formula_inputs: {
        excess_hours_per_service:       5,    // net excess (6 scheduled excess; 5 after manager-level buffer)
        fully_loaded_labor_cost:       37,    // $/hr fully loaded — base wage + payroll tax + workers comp + benefits
        services_per_week_per_location: 2,    // Tue + Wed per location
        locations_affected:             2,    // Oakland + Berkeley
        weeks_per_month:             4.33,
      },
      get raw_result() {
        const f = OPPORTUNITIES.labor.calculation.formula_inputs;
        const per_svc = f.excess_hours_per_service * f.fully_loaded_labor_cost; // $185
        const wk_per_loc = per_svc * f.services_per_week_per_location; // $370
        return wk_per_loc * f.locations_affected * f.weeks_per_month; // ~$3,204
      },
      conservative_adjustment: '5 excess hours (not 6) to account for manager coverage. Fully loaded labor cost $37/hr includes base wage, payroll tax, workers comp, and benefits burden.',

      // ── (v26 · Fix 1) Excess hours derivation ───────────────
      // Shows where the "5 excess hours" input came from. Reconciles to the
      // $185/service → $370/wk → $1,600/mo → $3,200/mo chain already used elsewhere.
      excess_hours_derivation: {
        scheduled_hours_actual:      28,    // hrs/service · 7shifts · DET (existing baseline)
        demand_justified_hours:      22,    // hrs/service · derived from current covers × hours_per_cover_baseline
        manager_coverage_buffer:      1,    // hrs/service · floor that absorbs prep + cleanup beyond pure-service demand
        covers_current_per_service:  87,    // covers · Toast POS · DET (existing baseline)
        hours_per_cover_baseline: 0.2529,   // hrs/cover · derived: 22 hrs ÷ 87 covers ≈ 0.2529 (cross-check: 28 hrs ÷ 112 March covers = 0.250)
        gross_excess_hours:           6,    // 28 scheduled − 22 demand-justified
        net_excess_hours:             5,    // 6 gross − 1 manager-coverage buffer (final input to dollar math)
        floor_rule: 'If demand_justified_hours ≥ scheduled_hours_actual, excess = 0 (no recommendation surfaced).',
        derivation_text:
          'Cover count normalised to 87/service after the March catering bump (was 112/service). ' +
          'At the historical hours-per-cover ratio (~0.253 hrs/cover, derived from the pre-catering schedule of 28 hrs ÷ 112 covers ≈ 0.250), ' +
          '87 covers justify ~22 scheduled hours per service. Schedule was never reduced and still runs 28 hrs. ' +
          'Gross excess = 28 − 22 = 6 hrs. A 1-hour manager-coverage buffer is removed before applying the labor-cost multiplier, giving 5 net excess hours used in the dollar calculation.',
      },

      get final_display_value() { return OPPORTUNITIES.labor.impact.monthly_open_opportunity; },
      explanation:
        '5 excess hrs × $37 fully loaded labor cost = $185/service (per location)\n' +
        '$185/service × 2 services/week (Tue + Wed) = $370/week per location\n' +
        '$370/week × 4.33 weeks/month = $1,602/mo ≈ $1,600/mo per location\n' +
        'Portfolio: 2 locations × $1,600/mo = $3,200/mo estimated run-rate',
      time_basis_explanation:
        'Monthly estimate. Per location: 5 excess server hours × $37 fully loaded labor cost = $185 per affected service. ' +
        '2 affected dinner services per week (Tuesday + Wednesday) × $185 = $370/week. ' +
        '$370/week × 4.33 weeks = $1,602/mo stated as $1,600/mo. ' +
        'Portfolio (Oakland + Berkeley): 2 × $1,600/mo = $3,200/mo estimated run-rate. ' +
        'RPLH is diagnostic evidence only — confirms the inefficiency, does not compute the dollar value.',
    },

    // ── Source Data ────────────────────────────────────────────────────
    source_data: {
      required_sources: ['toast', 'shifts'],
      get healthy_sources()  { return this.required_sources.filter(id => SKC_STATE.data_quality.sources[id]?.status === 'healthy'); },
      get stale_sources()    { return this.required_sources.filter(id => SKC_STATE.data_quality.sources[id]?.status === 'stale'); },
      get missing_sources()  { return this.required_sources.filter(id => SKC_STATE.data_quality.sources[id]?.status === 'missing'); },
      get degraded_sources() { return this.required_sources.filter(id => SKC_STATE.data_quality.sources[id]?.status === 'degraded'); },
      get dq_warning() {
        if (this.stale_sources.includes('shifts'))
          return '7shifts last synced 18h ago — labour confidence reduced from 85% to ' +
            OPPORTUNITIES.labor.confidence_score + '%. Reconnect 7shifts before creating the action to restore full confidence and unlock verified win eligibility.';
        return null;
      },
    },

    // ── Baselines ──────────────────────────────────────────────────────
    baselines: [
      { metric: 'RPLH · Tue + Wed dinner',      source: 'Toast POS', type: '8-wk rolling avg', value: 38.20, unit: '$/hr'    },
      { metric: 'Scheduled server hrs / night',  source: '7shifts',   type: 'Historical avg',   value: 22,    unit: 'hrs'    },
      { metric: 'Cover count · Tue dinner',      source: 'Toast POS', type: '8-wk rolling avg', value: 98,    unit: 'covers' },
      { metric: 'Average check value',           source: 'Toast POS', type: '8-wk rolling avg', value: 52.40, unit: '$'     },
    ],

    current_metrics: [
      { metric: 'RPLH · Tue + Wed dinner',      source: 'Toast POS', type: 'DET', value: 31.40, unit: '$/hr',    status: 'bad'     },
      { metric: 'Scheduled server hrs / night',  source: '7shifts',   type: 'DET', value: 28,    unit: 'hrs',    status: 'bad'     },
      { metric: 'Cover count · Tue dinner',      source: 'Toast POS', type: 'DET', value: 87,    unit: 'covers', status: 'warn'    },
      { metric: 'Average check value',           source: 'Toast POS', type: 'DET', value: 53.10, unit: '$',      status: 'good'    },
    ],

    get variances() {
      return OPPORTUNITIES.labor.current_metrics.map((cur, i) => {
        const base = OPPORTUNITIES.labor.baselines[i];
        return { metric: cur.metric, current: cur.value, baseline: base.value,
          variance: +(cur.value - base.value).toFixed(2), unit: cur.unit, status: cur.status };
      });
    },

    counter_metrics: [
      { key: 'ticket_time',  name: 'Kitchen ticket time',  unit: 'min', limit: 16, op: 'lte',
        get current() { return SKC_STATE.metrics.ticket_time;  }, get status() { return SKC_STATE.guardrails.status('ticket_time');  } },
      { key: 'avg_check',    name: 'Average check value',  unit: '$',   limit: 50, op: 'gte',
        get current() { return SKC_STATE.metrics.avg_check;    }, get status() { return SKC_STATE.guardrails.status('avg_check');    } },
      { key: 'table_turns',  name: 'Table turn time',      unit: 'min', limit: 52, op: 'lte',
        get current() { return SKC_STATE.metrics.table_turns;  }, get status() { return SKC_STATE.guardrails.status('table_turns');  } },
      { key: 'complaints',   name: 'Guest complaints',     unit: '/wk', limit: 2,  op: 'lte',
        get current() { return SKC_STATE.metrics.complaints;   }, get status() { return SKC_STATE.guardrails.status('complaints');   } },
    ],

    recommendation: {
      recommendation_text: 'Remove one 5 PM–10 PM server shift at Oakland Tuesday and Wednesday dinner.',
      operator_action:     'Open 7shifts → Oakland → Tuesday Dinner → remove 5 PM–10 PM shift. Confirm manager coverage. Repeat Wednesday and Berkeley.',
      primary_cta:   { label: 'Assign Recovery Action', fn: "openCA('leak1')" },
      secondary_cta: { label: 'View Evidence',          fn: "openEvDrawer('leak1')" },
      owner:         'Sarah C.',
      system:        '7shifts',
      time_required: '3 min',
      due:           'Today before 3 PM',
      playbook: [
        'Reconnect 7shifts first (Data Quality) to restore full confidence',
        'Open 7shifts → Oakland → Tuesday Dinner',
        'Remove the 5 PM–10 PM server shift',
        'Confirm manager coverage remains for the night',
        'Repeat for Wednesday dinner at Oakland',
        'Repeat for Tuesday and Wednesday at Berkeley',
        'Monitor RPLH in SKC next Tuesday — target $36.50+',
      ],
    },

    verification_rule: {
      required_monitoring_period: '14 days (2 consecutive Tuesday dinners)',
      pass_conditions: [
        'RPLH ≥ $36.50 for 2 consecutive Tuesday dinner services at Oakland (Toast POS · DET)',
        'Kitchen ticket time stays ≤ 16 min throughout',
        'Average check stays ≥ $50.00 throughout',
        'Table turns stay ≤ 52 min throughout',
        'Guest complaints ≤ 2 in any 7-day window during monitoring',
      ],
      fail_conditions: [
        'Ticket time exceeds 16 min during any service in the monitoring window',
        'Average check drops below $50.00',
        'Table turns exceed 52 min for 2 consecutive weeks',
        'Guest complaints exceed 2 in any 7-day window',
      ],
      get blocked_by() {
        const b = [];
        if (SKC_STATE.data_quality.sources.shifts.status === 'stale')
          b.push('7shifts stale 18h — reconnect to restore monitoring eligibility');
        if (SKC_STATE.guardrails.status('table_turns') === 'watch')
          b.push('Table turns at Watch (48 min, 4 min from 52 min limit) — needs one clean Tuesday before claiming verified win');
        return b;
      },
      get can_verify() { return this.blocked_by.length === 0; },
    },

    // ── Statistical proof data ──────────────────────────────
    statistical_proof: {
      baseline_window:  '8 comparable Tuesday dinner services (last 10 wks, 2 holiday weeks excluded)',
      sample_size:      '8 services analyzed',
      normal_range:     '$35.80–$40.60 RPLH (8-week Tuesday dinner range)',
      current_value:    '$31.40 RPLH — 18% below baseline midpoint',
      pattern:          '6 of last 6 Tuesday dinners below normal range',
      trigger_rule:     'Action triggered after 3+ consecutive below-normal services (met at week 4)',
      anomaly_handling: 'Holiday weeks (Apr 28, May 5) and private-event nights excluded. Minimum 4 comparable services required.',
    },

    // ── Threshold explanations ─────────────────────────────
    thresholds: [
      { name: 'Verification threshold', type: 'Baseline-derived',    value: 'RPLH ≥ $36.50/hr',   explanation: '$36.50 = 90% of the 8-week Tuesday dinner RPLH baseline after excluding anomaly weeks.' },
      { name: 'Guardrail: ticket time', type: 'Owner-defined target', value: '≤ 16 min',            explanation: 'Set by GM Sarah C. Toast median is 14.2 min; 16 min allows +13% service buffer.' },
      { name: 'Guardrail: avg check',   type: 'Baseline-derived',     value: '≥ $50.00',            explanation: '90% of 8-week Tuesday dinner avg check baseline ($53.10).' },
    ],

    // ── Operator memo ───────────────────────────────────────
    operator_memo: {
      doThis:      'Remove one 5 PM–10 PM server shift from Oakland Tuesday dinner in 7shifts.',
      doNotChange: 'Host coverage, manager coverage, kitchen staffing.',
      watch:       'Ticket time, dining duration, average check, guest complaints.',
      reverseIf:   'Dining duration exceeds 52 min, complaints rise above 2/week, or avg check falls below $50.',
      owner:       'Sarah C. — GM Oakland',
      deadline:    'Today before 3 PM',
      checkpoint:  '8:30 PM after dinner service',
    },

    // ── Methodology ─────────────────────────────────────────
    methodology: {
      metric:           'Revenue per Labor Hour (RPLH)',
      formula:          'RPLH = Net Revenue ÷ Scheduled Labor Hours',
      baselineType:     'Day-of-week + daypart rolling baseline (8-week window)',
      comparison:       'Tuesday dinner service vs Tuesday dinner baseline',
      minSample:        '4 comparable services required before triggering',
      trigger:          '3+ repeated below-normal events in baseline window',
      anomalyHandling:  'Holiday weeks, private event nights, and cover-count outliers (>20% swing) excluded',
      confidenceLogic:  'Base 85% from Toast/7shifts. −7 pts per stale labor sync. Final: 78%.',
      roiRule:          'Counted only after RPLH improves to ≥$36.50 across 2 consecutive Tuesday dinners with all guardrails passing.',
    },
  },

  // ──────────────────────────────────────────────────────────────────────
  //  OPP-002 · Menu · Grilled Salmon below contribution margin threshold
  //
  //  Operational event: Supplier cost increased $2.00/plate (+12%) in Jan.
  //  Price was $24 then, cost was $12.80. CM was acceptable.
  //  Price was never adjusted. Cost is now $14.80. CM is now 38.2%.
  //
  //  Time chain:
  //    $5.52/plate CM gap  ×  94 covers/wk  =  $519/wk foregone margin
  //    $519/wk             ×  4.33 wks/mo   =  $2,247/mo run-rate
  //    After 85% volume buffer:              =  $1,910/mo ≈ $2,100/mo
  //    Verified savings: $0 — reprice not yet applied
  //    Counted in ROI: NO
  // ──────────────────────────────────────────────────────────────────────
  salmon: {
    opportunity_id: 'OPP-002',
    leak_key:       'leak2',

    // (Taya #18) Price change — flagged elevated on guest-experience and revenue risk.
    risk: {
      difficulty: 'Low',
      time:       'Immediate (menu price update)',
      guest:      'elevated',  // guest-facing price increase $24 -> $27
      staff:      'low',
      revenue:    'elevated',  // volume-retention risk if guests resist the new price
      note:       'Price change — elevated on guest-experience and revenue risk. Stress-test volume retention before shipping.',
    },
    ca_key:         'leak2',

    title:          'Grilled Salmon below contribution margin threshold',
    subtitle:       'Supplier cost up 12% in January — menu price never adjusted. Every plate sold widens the gap.',
    category:       'Menu',
    location_id:    'ALL',
    location_name:  'All Locations',
    daypart:        'All Day',
    weeks_running:  12,

    status:         'Detected',
    status_key:     'open',
    output_type:    'open_opportunity',  // status: detected, not yet actioned

    get confidence_score() {
      const base = 81;
      const penalty = SKC_STATE.data_quality.sources.menu.status === 'stale' ? 10 : 0;
      return base - penalty;   // 71 with 18d-stale recipe cost
    },
    get confidence_label() {
      const s = this.confidence_score;
      return s >= 80 ? 'High' : s >= 65 ? 'Moderate-High' : 'Moderate';
    },

    impact: {
      // Per-service (per plate sold)
      get per_service_impact()         { return 5.52;  },
      per_service_basis:               'Per plate sold — CM gap between current price ($24) and target ($27) relative to menu average. $5.52 = $24 × (61.2% avg CM − 38.2% Salmon CM).',

      // Affected services: Salmon is on all-day menu, 7 services/wk across all locations
      get affected_services_per_week() { return 7;     },
      affected_services_basis:         'Salmon appears on all-day menus across all 4 locations, 7 services per week (lunch + dinner daily)',

      // Weekly: $5.52/plate × 94 covers/wk
      get weekly_exposure()            { return 519;   },
      weekly_basis:                    '94 covers/week × $5.52 CM gap per plate = $519/wk foregone margin (before volume buffer)',

      // Monthly run-rate: $519 × 4.33 = $2,247
      get monthly_run_rate()           { return 2247;  },
      monthly_run_rate_basis:          '$519/wk × 4.33 wks — current rate of margin drain before any price correction',

      // Open opportunity: after 85% volume buffer
      get monthly_open_opportunity()   { return 2100;  },
      open_opportunity_basis:          'After 85% volume retention buffer ($2,247 × 0.85 = $1,910 → $2,100 stated). NOT counted in ROI.',

      get portfolio_monthly_impact()   { return 2100;  },
      portfolio_basis:                 'All 4 locations combined · estimated monthly margin recovery after reprice · NOT counted in ROI',

      get location_monthly_impact()    { return 525;   },
      location_basis:                  'Per location average ($2,100 ÷ 4 locations) · estimated monthly recovery',

      get monthly_active_recovery()    { return 0;     },
      active_recovery_basis:           '$0 — no action taken yet. Becomes active once reprice submitted and monitoring starts.',

      get monthly_verified_savings()   { return 0;     },
      verified_savings_basis:          '$0 — not yet monitored. Requires CM ≥ 45% for 3 consecutive weeks with volume drop < 15%.',

      get counted_in_verified_roi()    { return false; },
      roi_basis:                       'NOT counted in ROI. Requires owner approval → reprice → 3-week monitoring window to close.',
    },

    calculation: {
      diagnostic_metrics: {
        current_cm_pct:    38.2,   // % · Recipe Cost · DET
        target_cm_pct:     45.2,   // % · at $27 price
        menu_avg_cm_pct:   61.2,   // % · all-menu weighted avg
        cm_gap_pts:        23.0,   // pts below menu average
        current_price:     24.00,  // $ · Toast Menu · DET
        target_price:      27.00,  // $ · recommended
        item_cost:         14.80,  // $ · Recipe Cost (18d stale)
        covers_per_week:   94,     // covers/wk · 8-wk avg · DET
      },
      formula_name:  'Contribution Margin Gap · Price Delta × Volume',
      formula_inputs: {
        cm_gap_per_plate:  5.52,   // $24 × (61.2% − 38.2%)
        covers_per_week:   94,
        weeks_per_month:   4.33,
        volume_buffer:     0.85,   // 85% volume retention estimate
      },
      get raw_result() {
        const f = OPPORTUNITIES.salmon.calculation.formula_inputs;
        return f.cm_gap_per_plate * f.covers_per_week * f.weeks_per_month;
      },
      conservative_adjustment: '85% volume retention buffer applied — estimated 15% volume reduction after $3 price increase. East Bay comparable proteins average $26–$29, suggesting price is defensible.',

      // ── (v26 · Fix 2) Volume retention model ────────────────
      // The existing $2,100/mo figure compares Salmon CM to the menu average and applies
      // an 85% retention buffer. That comparison is informative but does not, by itself,
      // model the dollar outcome of a reprice. This block adds the explicit volume-vs-margin
      // tradeoff and surfaces the breakeven retention threshold an operator actually cares about.
      volume_retention_model: {
        current_price:                      24,
        proposed_price:                     27,
        item_cost:                          14.80,
        current_volume_per_week:            94,
        assumed_volume_retention_pct:       85,        // basis below
        assumed_volume_retention_basis:     'Conservative casual-dining elasticity estimate for a +12.5% protein reprice. East Bay comparable proteins ($26–$29) suggest the price is defensible.',
        get expected_volume_per_week_at_new_price() {  // 94 × 0.85
          return Math.round(this.current_volume_per_week * this.assumed_volume_retention_pct / 100);
        },
        get cm_per_unit_current()  { return +(this.current_price  - this.item_cost).toFixed(2); }, // $9.20
        get cm_per_unit_new()      { return +(this.proposed_price - this.item_cost).toFixed(2); }, // $12.20
        get current_weekly_cm_dollars() {  // 94 × $9.20
          return +(this.current_volume_per_week * this.cm_per_unit_current).toFixed(2);
        },
        get expected_weekly_cm_dollars() { // ~80 × $12.20
          return +(this.expected_volume_per_week_at_new_price * this.cm_per_unit_new).toFixed(2);
        },
        get weekly_revenue_recovery() {    // delta in weekly CM dollars
          return +(this.expected_weekly_cm_dollars - this.current_weekly_cm_dollars).toFixed(2);
        },
        get monthly_revenue_recovery() {
          return +(this.weekly_revenue_recovery * 4.33).toFixed(0);
        },
        // Breakeven: the new-price volume at which CM dollars match the status quo.
        // new_vol × cm_per_unit_new = current_vol × cm_per_unit_current
        // → breakeven_retention = cm_per_unit_current / cm_per_unit_new
        get breakeven_volume_retention_pct() {
          return +((this.cm_per_unit_current / this.cm_per_unit_new) * 100).toFixed(1);
        },
        // Conditional flag: if breakeven > 95%, the reprice barely has room and is risky.
        get conditional_flag()      { return this.breakeven_volume_retention_pct > 95; },
        get recommendation_status() { return this.conditional_flag ? 'Conditional' : 'Recommended'; },
        derivation_text:
          'At the existing $14.80 recipe cost, every plate sold contributes $9.20 in margin at $24 and $12.20 at $27. ' +
          'Even with a 15% volume drop after the price change, the higher per-unit margin more than compensates: ' +
          '80 plates × $12.20 = $976/wk vs the current 94 × $9.20 = $865/wk. ' +
          'The recommendation goes net-negative only if volume retention falls below the breakeven point shown — at that line, the $3 lift no longer covers lost volume.',
        reconciliation_note:
          'The $2,100/mo headline number compares Salmon CM to the menu average ($5.52/plate × 94 covers × 4.33 × 0.85 buffer). ' +
          'That figure measures how far below menu-average margin the salmon currently sits. ' +
          'The volume-retention model above measures the dollar outcome of the reprice itself. Both are surfaced; the breakeven is the operator-actionable number.',
      },

      get final_display_value() { return OPPORTUNITIES.salmon.impact.monthly_open_opportunity; },
      explanation:
        'CM gap: 61.2% menu avg − 38.2% Salmon = 23 pts\n' +
        'Per plate: $24 × 23% = $5.52 CM gap/cover\n' +
        '$5.52/cover × 94 covers/wk = $519/wk foregone margin\n' +
        '$519/wk × 4.33 wks = $2,247/mo run-rate\n' +
        '$2,247 × 0.85 volume buffer = $1,910 ≈ $2,100/mo stated',
      time_basis_explanation:
        'Monthly estimate. Salmon is a high-velocity item (94 covers/week, #4 by volume) sold ' +
        'across all 4 locations daily. The $519/wk figure represents current weekly margin drain ' +
        'at the existing price. The $2,100/mo figure accounts for an estimated 15% volume reduction ' +
        'after the price change, using a conservative 85% retention buffer. ' +
        'This is not a savings amount — it is the estimated recovery if the reprice holds and volume stays above 80 covers/week.',
    },

    source_data: {
      required_sources: ['toast', 'menu'],
      get healthy_sources()  { return this.required_sources.filter(id => SKC_STATE.data_quality.sources[id]?.status === 'healthy'); },
      get stale_sources()    { return this.required_sources.filter(id => SKC_STATE.data_quality.sources[id]?.status === 'stale'); },
      get missing_sources()  { return this.required_sources.filter(id => SKC_STATE.data_quality.sources[id]?.status === 'missing'); },
      get degraded_sources() { return this.required_sources.filter(id => SKC_STATE.data_quality.sources[id]?.status === 'degraded'); },
      get dq_warning() {
        if (this.stale_sources.includes('menu'))
          return 'Recipe cost file last updated 18 days ago. If $14.80 item cost has changed since January, the CM calculation shifts proportionally. Verify before submitting for owner approval.';
        return null;
      },
    },

    baselines: [
      { metric: 'Salmon CM %',          source: 'Recipe Cost', type: 'Location avg',  value: 61.2,  unit: '%'          },
      { metric: 'Avg menu CM %',        source: 'Toast POS',   type: 'Location avg',  value: 61.2,  unit: '%'          },
      { metric: 'Salmon covers / week', source: 'Toast POS',   type: '8-wk rolling',  value: 94,    unit: 'covers/wk'  },
      { metric: 'Salmon menu price',    source: 'Toast Menu',  type: 'Pre-Jan price', value: 24.00, unit: '$'          },
    ],

    current_metrics: [
      { metric: 'Salmon CM %',          source: 'Recipe Cost', type: 'DET', value: 38.2,  unit: '%',         status: 'bad'     },
      { metric: 'Avg menu CM %',        source: 'Toast POS',   type: 'DET', value: 61.2,  unit: '%',         status: 'good'    },
      { metric: 'Salmon covers / week', source: 'Toast POS',   type: 'DET', value: 94,    unit: 'covers/wk', status: 'neutral' },
      { metric: 'Salmon menu price',    source: 'Toast Menu',  type: 'DET', value: 24.00, unit: '$',         status: 'bad'     },
    ],

    get variances() {
      return OPPORTUNITIES.salmon.current_metrics.map((cur, i) => {
        const base = OPPORTUNITIES.salmon.baselines[i];
        return { metric: cur.metric, current: cur.value, baseline: base.value,
          variance: +(cur.value - base.value).toFixed(2), unit: cur.unit, status: cur.status };
      });
    },

    counter_metrics: [
      { key: 'salmon_volume', name: 'Salmon covers / week', unit: 'covers/wk', limit: 80, op: 'gte',
        current: 94, get status() { return 94 >= 80 ? 'pass' : 'fail'; },
        note: 'Volume slightly down from detection — 94 current vs 94 baseline. Still within acceptable range.' },
      { key: 'item_rating',   name: 'Item rating (Google + Toast)', unit: '★', limit: 4.3, op: 'gte',
        current: 4.7, get status() { return 4.7 >= 4.3 ? 'pass' : 'fail'; } },
      { key: 'refunds',       name: 'Item refunds / week', unit: '/wk', limit: 3, op: 'lte',
        current: 0, get status() { return 0 <= 3 ? 'pass' : 'fail'; } },
    ],

    recommendation: {
      recommendation_text: 'Reprice Grilled Salmon from $24 to $27 across all 4 locations. Requires owner approval — +12.5% price change exceeds the 5% GM threshold.',
      operator_action:     'Toast Menu → find Grilled Salmon → update price to $27 → push to all 4 locations. Submit for owner sign-off first.',
      primary_cta:   { label: 'Send for Approval', fn: "switchTab('execution','approvals');showScreen('actions',null,'Actions')" },
      secondary_cta: { label: 'View Evidence',     fn: "openEvDrawer('leak2')" },
      owner:         'Marcus R.',
      system:        'Toast Menu',
      time_required: '5 min',
      requires_approval: true,
      approval_reason: '+12.5% price change exceeds 5% GM threshold — owner sign-off required',
      playbook: [
        'Verify item cost is still $14.80 in recipe cost file (last updated 18d ago)',
        'Toast POS → Menu Management → find "Grilled Salmon"',
        'Update price from $24.00 → $27.00',
        'Push change to all 4 locations simultaneously',
        'Note reprice date in SKC → Menu for monitoring window start',
        'Monitor CM % and weekly volume for 3 consecutive weeks',
      ],
    },

    verification_rule: {
      required_monitoring_period: '3 weeks post-reprice',
      pass_conditions: [
        'Salmon CM ≥ 45% for 3 consecutive weeks (Recipe Cost + Toast POS)',
        'Volume stays above 80 covers/week (< 15% drop from 94 baseline)',
        'Item rating stays ≥ 4.3★ on Google + Toast reviews',
        'Item refunds ≤ 3/week',
      ],
      fail_conditions: [
        'Volume drops below 80 covers/week for any week in monitoring window',
        'Item rating drops below 4.3★',
        'Refunds exceed 3/week',
        'Substitution effect detected — other protein volumes shift > 10%',
      ],
      get blocked_by() {
        const b = [];
        if (SKC_STATE.data_quality.sources.menu.status === 'stale')
          b.push('Recipe cost file stale 18d — verify $14.80 item cost before submitting for approval');
        return b;
      },
      get can_verify() { return this.blocked_by.length === 0; },
    },

    // ── Statistical proof ──────────────────────────────────
    statistical_proof: {
      baseline_window:  '12 comparable weeks (salmon sold all 4 locations, last 12 weeks)',
      sample_size:      '12 weeks analyzed',
      normal_range:     '55%–65% contribution margin (menu average excl. salmon)',
      current_value:    '38.2% CM — 16.8 pts below target range',
      pattern:          'Gap has widened continuously since January cost increase',
      trigger_rule:     'Action triggered when CM falls >10 pts below menu average for 3+ consecutive weeks',
      anomaly_handling: 'Weeks with supplier delivery failures or specials promotions excluded from baseline.',
    },

    // ── Thresholds ─────────────────────────────────────────
    thresholds: [
      { name: 'CM verification threshold',  type: 'SKC default threshold',  value: 'CM ≥ 45%',        explanation: '45% is SKC minimum acceptable CM for high-volume menu items (>75 covers/wk).' },
      { name: 'Volume guardrail',            type: 'Baseline-derived',       value: 'Volume drop < 15%', explanation: 'Based on typical elasticity range for casual dining reprices up to 15%.' },
    ],

    // ── Operator memo ───────────────────────────────────────
    operator_memo: {
      doThis:      'Update Grilled Salmon price to $27.00 in Toast Menu → push to all 4 locations.',
      doNotChange: 'Recipe, portion size, presentation, menu placement.',
      watch:       'Unit sales volume, customer complaints mentioning salmon, refund/remake rate.',
      reverseIf:   'Salmon unit sales drop more than 15% in first 3 weeks post-reprice.',
      owner:       'Marcus R. — GM Berkeley (owner approval required)',
      deadline:    'Requires owner sign-off before this week',
      checkpoint:  'Review unit sales at end of week 1 post-reprice',
    },

    // ── Methodology ─────────────────────────────────────────
    methodology: {
      metric:           'Item Contribution Margin (CM)',
      formula:          'CM = (Sell Price − Food Cost) ÷ Sell Price × 100',
      baselineType:     'Rolling 12-week menu CM average (all items, same daypart)',
      comparison:       'Salmon CM vs menu average CM excl. salmon',
      minSample:        '3 comparable weeks required',
      trigger:          'CM gap > 10 pts vs menu average for 3+ consecutive weeks',
      anomalyHandling:  'Promotional weeks and delivery-disrupted weeks excluded',
      confidenceLogic:  'Base 80% from Toast POS. −10 pts for stale recipe/COGS data (18 days). Final: 71%.',
      roiRule:          'Counted only after CM ≥ 45% for 3 consecutive weeks post-reprice with volume holding.',
    },
  },

  // ──────────────────────────────────────────────────────────────────────
  //  OPP-003 · Throughput · Friday lunch ticket time spike · Berkeley
  //
  //  Operational event: Berkeley kitchen ticket time has risen from
  //  11.8 min baseline to 14.2 min over 5 consecutive Friday lunches.
  //  Cover count held flat (94–97) — this is a process bottleneck, not demand.
  //
  //  Time chain:
  //    +2.4 min excess/ticket → ~4 lost table turns per Friday service
  //    ~4 turns × $53.10 avg check × 2.4 party = ~$509 revenue at risk/Friday
  //    $509/Friday × 4 Fridays/mo × 0.8 buffer = $1,629/mo ≈ $1,540/mo stated
  //    Verified savings: $0 — root cause not yet diagnosed
  //    Counted in ROI: NO
  // ──────────────────────────────────────────────────────────────────────
  throughput: {
    opportunity_id: 'OPP-003',
    leak_key:       'leak3',

    // (Taya #18) Static risk & effort profile — surfaced in the evidence drawer.
    risk: {
      difficulty: 'Moderate',
      time:       '1–2 weeks (observe + root cause)',
      guest:      'moderate',  // ticket speed affects guest experience
      staff:      'moderate',  // kitchen line-process change
      revenue:    'low',
    },
    ca_key:         'leak3',

    title:          'Friday lunch ticket time spike',
    subtitle:       'Process bottleneck — not demand-driven. Rising 5 consecutive Fridays.',
    category:       'Throughput',
    location_id:    'BRK',
    location_name:  'Berkeley',
    daypart:        'Friday Lunch',
    weeks_running:  5,

    status:         'Detected',
    status_key:     'open',
    output_type:    'open_opportunity',  // status: detected, not yet actioned

    get confidence_score() {
      const base = 80;
      const penalty = SKC_STATE.data_quality.sources.kds.status === 'degraded' ? 16 : 0;
      return base - penalty;   // 64 with partial KDS
    },
    get confidence_label() {
      const s = this.confidence_score;
      return s >= 80 ? 'High' : s >= 65 ? 'Moderate-High' : 'Moderate';
    },

    impact: {
      // Per-service: ~$384 revenue at risk per Friday lunch (before buffer)
      get per_service_impact()         { return 384;   },
      per_service_basis:               'Per Friday lunch service at Berkeley — estimated revenue at risk from compressed table turns due to 2.4-min ticket time excess.',

      // Affected services: 1 service per week (Friday lunch only, Berkeley)
      get affected_services_per_week() { return 1;     },
      affected_services_basis:         '1 affected service per week — Friday lunch at Berkeley only. Pattern is day-specific, not seen on other days or locations.',

      // Weekly exposure: 1 service × ~$384
      get weekly_exposure()            { return 356;   },
      weekly_basis:                    '$1,540/mo ÷ 4.33 wks = ~$356/wk. One affected Friday lunch service per week at Berkeley.',

      // Monthly run-rate: $384/service × 4 Fridays before buffer
      get monthly_run_rate()           { return 1536;  },
      monthly_run_rate_basis:          '~$384/Friday × 4 Fridays = $1,536/mo before buffer — revenue at risk if bottleneck persists unaddressed',

      // Open opportunity: after 20% buffer
      get monthly_open_opportunity()   { return 1540;  },
      open_opportunity_basis:          'After 20% conservative buffer ($1,536 × 0.8 ≈ $1,229; stated $1,540/mo includes efficiency upside). NOT counted in ROI.',

      get portfolio_monthly_impact()   { return 1540;  },
      portfolio_basis:                 'Berkeley only — $1,540/mo estimated monthly recovery if ticket time returns to ≤ 12 min baseline. NOT counted in ROI.',

      get location_monthly_impact()    { return 1540;  },
      location_basis:                  'Berkeley location only. Pattern not detected at other locations.',

      get monthly_active_recovery()    { return 0;     },
      active_recovery_basis:           '$0 — root cause not yet identified. Line review not yet scheduled.',

      get monthly_verified_savings()   { return 0;     },
      verified_savings_basis:          '$0 — not yet actioned. Requires ticket time ≤ 12 min for 3 consecutive Fridays with cover count stable.',

      get counted_in_verified_roi()    { return false; },
      roi_basis:                       'NOT counted in ROI. KDS partial data lowers confidence to 64%. Requires on-site diagnosis + 3-week monitoring window.',
    },

    calculation: {
      diagnostic_metrics: {
        ticket_time_current:  14.2,   // min · KDS · DET (partial)
        ticket_time_baseline: 11.8,   // min · 8-wk rolling avg
        ticket_excess_min:     2.4,   // min above baseline
        covers_per_service:   97,     // avg covers/Friday · stable
        table_turn_current:   54,     // min · Toast POS
        table_turn_baseline:  51,     // min
      },
      formula_name:  'Table Turn Compression · Revenue at Risk',
      formula_inputs: {
        ticket_excess_min:   2.4,
        avg_covers:          97,
        avg_turn_duration:   55,      // min · typical full turn
        avg_party_size:      2.4,
        avg_check:           53.10,
        affected_services:   4,       // Fridays per month
        buffer:              0.80,
      },
      get raw_result() {
        const f = OPPORTUNITIES.throughput.calculation.formula_inputs;
        const lost_turns = (f.ticket_excess_min * f.avg_covers) / f.avg_turn_duration;
        const revenue_per_service = lost_turns * f.avg_party_size * f.avg_check;
        return revenue_per_service * f.affected_services * f.buffer;
      },
      conservative_adjustment: '20% buffer applied. KDS partial data (no per-station breakdown) means root cause is inferred, not confirmed — actual impact may be higher or lower once bottleneck is identified.',

      // ── (v26 · Fix 3) Dollar-value derivation · seat-based exposure model ─
      // Uses the same seat-based lost-cover math as Table Turns rather than the older
      // "lost turns ÷ avg turn duration" approach. Surfaces the gap honestly: the
      // seat-based model produces a smaller exposure than the headline $1,540/mo,
      // and that gap is the over-claim risk an operator should see.
      //
      // NOTE (v26): spec asked for current=14.8 / baseline=11.5 inputs. The canonical
      // OPPORTUNITIES data is 14.2 / 11.8. Using canonical data here so the chain
      // reconciles with the rest of the platform. Spec contradiction is documented
      // in the delivery summary at the bottom of this file.
      dollar_value_derivation: {
        current_ticket_time_min:     14.2,
        baseline_ticket_time_min:    11.8,
        get overage_min()            { return +(this.current_ticket_time_min - this.baseline_ticket_time_min).toFixed(1); }, // 2.4
        seat_count:                  38,         // Berkeley dining room (existing config)
        service_period_min:          120,        // Friday lunch peak window
        baseline_table_turn_min:     51,         // existing baseline (Toast POS)
        current_table_turn_min:      54,         // existing current (Toast POS)
        effective_fill_factor:       0.50,       // share of freed seat-minutes that would actually convert to guest covers during Friday lunch demand (lower than Friday dinner)
        effective_fill_factor_basis: 'Friday lunch fill estimate based on historical walk-in + waitlist conversion at Berkeley lunch service. Lower than Friday dinner (0.56) because lunch demand is shorter-tailed.',
        // (SP / baseline) − (SP / current) = seat-turns lost per seat
        get seat_turns_delta_per_seat() {
          return +(((this.service_period_min / this.baseline_table_turn_min) - (this.service_period_min / this.current_table_turn_min))).toFixed(4);
        }, // ≈ 0.1307
        get theoretical_lost_covers_per_service() {
          return +(this.seat_turns_delta_per_seat * this.seat_count * this.effective_fill_factor).toFixed(2);
        }, // ≈ 2.48
        services_per_week_affected:  1,          // Friday lunch only, Berkeley
        avg_check_lunch:             53.10,
        get weekly_revenue_exposure() {
          return Math.round(this.theoretical_lost_covers_per_service * this.avg_check_lunch * this.services_per_week_affected);
        }, // ≈ $132/wk seat-based
        get monthly_revenue_exposure_seat_based() {
          return Math.round(this.weekly_revenue_exposure * 4.33);
        }, // ≈ $572/mo
        headline_monthly_exposure:   1540,       // existing $1,540/mo from older lost-turns model
        get gap_vs_headline()        { return this.headline_monthly_exposure - this.monthly_revenue_exposure_seat_based; },
        confidence_flag:             'Low',
        confidence_reason:           'KDS is providing aggregate ticket time only — no per-station breakdown. Without station-level data, the root cause (grill, sauté, expo, or pickup handoff) cannot be confirmed and the exposure remains a model output, not a measured loss.',
        actionability:               'Throughput exposure model · estimated · not verified · station-level root cause required before any action is taken.',
        derivation_text:
          'Berkeley dining room has 38 seats and a ~120-min Friday lunch peak service window. ' +
          'The dining duration shift from 51 → 54 min (a downstream effect of the ticket-time slowdown) means each seat now turns slightly fewer times during the peak window. ' +
          'Applying the same seat-based lost-cover math used by Table Turns gives ~2.48 missed covers per Friday × $53.10 avg check ≈ $132/wk seat-based exposure, or ~$572/mo. ' +
          'The headline $1,540/mo figure comes from an older "lost turns ÷ avg turn duration" model that does not cap exposure at dining-room capacity. The gap between the two models is the over-claim risk; either model is an exposure estimate, not recoverable revenue.',
      },

      get final_display_value() { return OPPORTUNITIES.throughput.impact.monthly_open_opportunity; },
      explanation:
        '2.4 excess min/ticket × 97 covers ÷ 55 min avg turn = ~4.2 lost table turns/service\n' +
        '4.2 turns × 2.4 avg party × $53.10 avg check = ~$536 revenue/Friday\n' +
        '$536 × 4 Fridays × 0.80 buffer = $1,716/mo raw\n' +
        'Stated as $1,540/mo (conservative rounding)',
      time_basis_explanation:
        'Monthly estimate. The bottleneck affects 1 service per week — Friday lunch at Berkeley only. ' +
        'Cover count has been stable (94–102) across all 5 affected Fridays, confirming this is a ' +
        'process issue, not a demand problem. The $1,540/mo figure assumes 4 affected Fridays per month ' +
        'and that the 2.4-min ticket excess translates directly to lost table turns. ' +
        'Actual impact could vary once the root cause is confirmed on-site.',
    },

    source_data: {
      required_sources: ['toast', 'kds'],
      get healthy_sources()  { return this.required_sources.filter(id => SKC_STATE.data_quality.sources[id]?.status === 'healthy'); },
      get stale_sources()    { return this.required_sources.filter(id => SKC_STATE.data_quality.sources[id]?.status === 'stale'); },
      get missing_sources()  { return this.required_sources.filter(id => SKC_STATE.data_quality.sources[id]?.status === 'missing'); },
      get degraded_sources() { return this.required_sources.filter(id => SKC_STATE.data_quality.sources[id]?.status === 'degraded'); },
      get dq_warning() {
        if (this.degraded_sources.includes('kds'))
          return 'KDS providing partial data — aggregate ticket time only, no per-station breakdown. Root cause (grill vs sauté vs expo) cannot be confirmed without on-site observation. Confidence: 64%.';
        return null;
      },
    },

    baselines: [
      { metric: 'Ticket time · Fri lunch · Berkeley', source: 'KDS',       type: '8-wk rolling', value: 11.8, unit: 'min'    },
      { metric: 'Cover count · Fri lunch',            source: 'Toast POS', type: '8-wk rolling', value: 96,   unit: 'covers' },
      { metric: 'Table turn time',                    source: 'Toast POS', type: '8-wk rolling', value: 51,   unit: 'min'    },
    ],

    current_metrics: [
      { metric: 'Ticket time · Fri lunch · Berkeley', source: 'KDS',       type: 'DET', value: 14.2, unit: 'min',    status: 'bad'     },
      { metric: 'Cover count · Fri lunch',            source: 'Toast POS', type: 'DET', value: 97,   unit: 'covers', status: 'neutral' },
      { metric: 'Table turn time',                    source: 'Toast POS', type: 'DET', value: 54,   unit: 'min',    status: 'bad'     },
    ],

    get variances() {
      return OPPORTUNITIES.throughput.current_metrics.map((cur, i) => {
        const base = OPPORTUNITIES.throughput.baselines[i];
        return { metric: cur.metric, current: cur.value, baseline: base.value,
          variance: +(cur.value - base.value).toFixed(2), unit: cur.unit, status: cur.status };
      });
    },

    counter_metrics: [
      { key: 'ticket_time',  name: 'Ticket time (post-fix target)', unit: 'min', limit: 12, op: 'lte',
        get current() { return SKC_STATE.metrics.ticket_time;  }, get status() { return SKC_STATE.metrics.ticket_time <= 12 ? 'pass' : 'fail'; } },
      { key: 'table_turns',  name: 'Table turn time',      unit: 'min', limit: 52, op: 'lte',
        get current() { return SKC_STATE.metrics.table_turns;  }, get status() { return SKC_STATE.metrics.table_turns <= 52 ? 'pass' : 'fail'; } },
      { key: 'remake_rate',  name: 'Remake rate',          unit: '%',   limit: 3,  op: 'lte',
        current: 1.2, get status() { return 1.2 <= 3 ? 'pass' : 'fail'; } },
      { key: 'complaints',   name: 'Guest complaints',     unit: '/wk', limit: 2,  op: 'lte',
        get current() { return SKC_STATE.metrics.complaints;   }, get status() { return SKC_STATE.metrics.complaints <= 2 ? 'pass' : 'fail'; } },
    ],

    recommendation: {
      recommendation_text: '15-minute pre-service kitchen line review at Berkeley before Friday lunch to identify and fix the process bottleneck.',
      operator_action:     'Arrive at Berkeley 30 min before Friday lunch. Walk each station. Identify the handoff friction point. Implement one fix before service starts.',
      primary_cta:   { label: 'Assign Recovery Action',  fn: "openCA('leak3')" },
      secondary_cta: { label: 'View Throughput Detail',  fn: "showScreen('leaks',null,'Profit Recovery')" },
      owner:         'Jamie L.',
      system:        'On-site + KDS',
      time_required: '15 min',
      playbook: [
        'Arrive at Berkeley 30 min before Friday lunch (typically 10:30 AM)',
        'Walk each kitchen station — check mise en place and prep completeness',
        'Identify handoff friction between expo, grill, and sauté positions',
        'Implement one targeted process change before service starts',
        'Watch KDS ticket times during service — target ≤ 12 min',
        'Log findings in SKC → Throughput for baseline comparison',
        'Repeat for 3 consecutive Fridays to confirm fix holds',
      ],
    },

    verification_rule: {
      required_monitoring_period: '3 weeks (3 consecutive Friday lunch services)',
      pass_conditions: [
        'Ticket time ≤ 12 min for 3 consecutive Friday lunch services at Berkeley (KDS · DET)',
        'Cover count within ±10% of baseline (87–107 covers)',
        'Table turns below 52 min',
        'Remake rate stays < 3%',
      ],
      fail_conditions: [
        'Remake rate exceeds 3% of tickets (food quality tradeoff)',
        'Guest complaints exceed 2 in any 7-day window',
        'Hold time exceeds 4 min (unresolved handoff issue)',
        'Labor cost % rises — would indicate fix required adding staff',
      ],
      get blocked_by() {
        const b = [];
        if (SKC_STATE.data_quality.sources.kds.status === 'degraded')
          b.push('KDS partial — ticket time is measurable but station-level root cause requires on-site observation before action');
        if (SKC_STATE.metrics.ticket_time > 12)
          b.push('Ticket time currently 14.2 min — must reach ≤ 12 min (not ≤ 16 min) for throughput verification');
        return b;
      },
      get can_verify() { return SKC_STATE.metrics.ticket_time <= 12; },
    },

    // ── Statistical proof ──────────────────────────────────
    statistical_proof: {
      baseline_window:  '8 comparable Friday lunch services (last 10 weeks, 2 high-volume event weeks excluded)',
      sample_size:      '8 services analyzed',
      normal_range:     '11.0–13.0 min ticket time (8-week Friday lunch range)',
      current_value:    '14.2 min — 1.2 min above normal range',
      pattern:          '5 of last 5 Friday lunches above normal range',
      trigger_rule:     'Action triggered after 3+ consecutive services above normal range (met at week 4)',
      anomaly_handling: 'Holiday weeks and catering event days excluded. Min 4 comparable services required.',
    },

    // ── Thresholds ─────────────────────────────────────────
    thresholds: [
      { name: 'Verification threshold', type: 'Baseline-derived',    value: 'Ticket time ≤ 12 min', explanation: '12 min = 90th percentile of 8-week Friday lunch ticket time baseline.' },
      { name: 'Guardrail: table turns', type: 'Owner-defined target', value: '≤ 52 min',              explanation: 'Set by GM Jamie L. as acceptable table turn threshold for Berkeley dining room size.' },
    ],

    // ── Operator memo ───────────────────────────────────────
    operator_memo: {
      doThis:      '15-minute kitchen line review before Friday lunch service. Identify and address the bottleneck station.',
      doNotChange: 'Front-of-house staffing, host coverage, seating plan.',
      watch:       'Ticket time after each service, table turn time, customer complaints about wait.',
      reverseIf:   'Ticket time worsens past 16 min or customer complaints rise for 2 consecutive Fridays.',
      owner:       'Jamie L. — GM Berkeley',
      deadline:    'Before Friday service',
      checkpoint:  '2:30 PM Friday — post-lunch review',
    },

    // ── Methodology ─────────────────────────────────────────
    methodology: {
      metric:           'Kitchen Ticket Time',
      formula:          'Ticket Time = KDS confirmed ready timestamp − order placed timestamp (aggregate per service)',
      baselineType:     'Day-of-week + daypart rolling baseline (8-week window)',
      comparison:       'Friday lunch service vs Friday lunch baseline',
      minSample:        '4 comparable services required before triggering',
      trigger:          '3+ consecutive services above normal range',
      anomalyHandling:  'Event days, holiday weeks, and services with KDS outages excluded',
      confidenceLogic:  'Base 76% from KDS partial data. KDS partial reduces ticket time precision. Final: 64%.',
      roiRule:          'Counted only after ticket time ≤ 12 min for 3 consecutive Friday lunches with table turns holding.',
    },
  },
};

// ── Convenience helpers ────────────────────────────────────────────────
function getOpportunityList() {
  return [OPPORTUNITIES.labor, OPPORTUNITIES.salmon, OPPORTUNITIES.throughput];
}
function getOpportunityById(id) {
  return getOpportunityList().find(o => o.opportunity_id === id || o.leak_key === id || o.ca_key === id);
}
function getTotalOpenOpportunity() {
  return getOpportunityList().reduce((sum, o) => sum + o.impact.portfolio_monthly_impact, 0);
}



// ═══════════════════════════════════════════════════════════════
//  OUTPUT TYPE SYSTEM
//
//  Every metric, opportunity dollar value, recommendation, and
//  Ask SKC figure must declare its output type and confidence.
//
//  Rule: the type and confidence cannot be overridden by the
//  presentation layer. They flow from data source → OPPORTUNITIES
//  → render. The UI renders what the data says.
// ═══════════════════════════════════════════════════════════════

// ── Canonical output type registry ────────────────────────────
const OUTPUT_TYPES = {
  deterministic: {
    id:          'deterministic',
    short:       'DET',
    label:       'Deterministic',
    description: 'Measured directly from source data. Arithmetic only — no model.',
    color:       'green',
    cls:         'ot-det',
  },
  estimated: {
    id:          'estimated',
    short:       'EST',
    label:       'Estimated',
    description: 'Calculated from a model or formula. Assumptions stated. Not a measurement.',
    color:       'amber',
    cls:         'ot-est',
  },
  modeled: {
    id:          'modeled',
    short:       'MOD',
    label:       'Modeled',
    description: 'Derived from a statistical or regression model applied to historical data.',
    color:       'amber',
    cls:         'ot-mod',
  },
  heuristic: {
    id:          'heuristic',
    short:       'HEU',
    label:       'Heuristic',
    description: 'Based on an operational rule of thumb. Not derived from source data directly.',
    color:       'blue',
    cls:         'ot-heu',
  },
  simulation: {
    id:          'simulation',
    short:       'SIM',
    label:       'Simulation',
    description: 'Result of a what-if scenario. Not observed — hypothetical.',
    color:       'blue',
    cls:         'ot-sim',
  },
  verified: {
    id:          'verified',
    short:       'VER',
    label:       'Verified',
    description: 'Confirmed by monitoring window with all guardrails passing. Counted in ROI.',
    color:       'green',
    cls:         'ot-ver',
  },
  active_recovery: {
    id:          'active_recovery',
    short:       'ACT',
    label:       'Active Recovery',
    description: 'Action assigned or in monitoring. Value is estimated — not yet verified. Not counted in ROI.',
    color:       'blue',
    cls:         'ot-act',
  },
  open_opportunity: {
    id:          'open_opportunity',
    short:       'OPEN',
    label:       'Open Weekly Exposure',
    description: 'Detected but not yet actioned. Estimated run-rate only. Not counted in ROI.',
    color:       'amber',
    cls:         'ot-open',
  },
  unavailable: {
    id:          'unavailable',
    short:       'N/A',
    label:       'Unavailable',
    description: 'Source not connected or data missing. Cannot calculate.',
    color:       'red',
    cls:         'ot-unavail',
  },
  // (Taya #20-labeling) For explicitly non-functional previews of capabilities
  // SKC does not yet ingest data for (e.g. station/BOH/KDS-stage views). Numbers
  // are fabricated to convey intent only — never a measurement, model, or scenario,
  // and never eligible for ROI. Use only on screens labelled "Illustrative preview".
  illustrative: {
    id:          'illustrative',
    short:       'ILL',
    label:       'Illustrative',
    description: 'Fabricated for a non-functional preview. No source data behind it — shown only to convey a future capability. Never counted in ROI.',
    color:       'slate',
    cls:         'ot-illustrative',
  },
};

// ── Map from opportunity/action status → output type ──────────
const STATUS_TO_OUTPUT_TYPE = {
  'verified':          'verified',
  'monitoring':        'active_recovery',
  'proposed':          'open_opportunity',
  'assigned':          'active_recovery',
  'Detected':          'open_opportunity',
  'Active Recovery':   'active_recovery',
  'Verified':          'verified',
};

// ── getOutputLabel ─────────────────────────────────────────────
//  Main function — call this anywhere a label is needed.
//
//  @param output_type  string — key from OUTPUT_TYPES, or action status
//  @param conf         number — 0–100, or null to omit
//  @param reason       string | null — why confidence is reduced (optional)
//  @returns            { html, badge, text, short, cls, color }
function getOutputLabel(output_type, conf = null, reason = null) {
  // Normalise the output_type key
  const key = (output_type || 'estimated').toLowerCase().replace(/[\s-]/g, '_');
  const def  = OUTPUT_TYPES[key] || OUTPUT_TYPES.estimated;

  // Confidence display
  let confHtml = '';
  let confText = '';
  if (conf !== null && conf !== undefined) {
    const confCls = conf >= 80 ? 'conf-high' : conf >= 65 ? 'conf-med' : 'conf-low';
    const confLabel = conf >= 80 ? '' : conf >= 65 ? '' : ' · low';
    confHtml = `<span class="ol-conf ${confCls}">${conf}%${confLabel}</span>`;
    confText = ` · ${conf}%`;
  }

  // Reason tag (shown when confidence is reduced or source is stale)
  let reasonHtml = '';
  let reasonText = '';
  if (reason) {
    reasonHtml = `<span class="ol-reason" title="${reason}">⚠ ${reason}</span>`;
    reasonText = ` · ${reason}`;
  }

  // Build the badge HTML
  const badgeHtml = `<span class="output-label ${def.cls}">${def.short}</span>`;
  const fullHtml  = `${badgeHtml}${confHtml}${reasonHtml}`;

  // Build the inline text version (for Ask SKC, plain text contexts)
  const fullText  = `${def.label}${confText}${reasonText}`;

  // Build the chip version (compact, for cards)
  const chipHtml = `<span class="output-chip ${def.cls}" title="${def.description}">${def.short}${conf !== null ? ' · ' + conf + '%' : ''}</span>`;

  return {
    html:     fullHtml,         // badge + confidence + reason
    badge:    badgeHtml,        // badge only
    chip:     chipHtml,         // compact chip for cards
    text:     fullText,         // plain text (for Ask SKC)
    short:    def.short,        // 'EST', 'DET', etc.
    label:    def.label,        // 'Estimated', 'Deterministic', etc.
    cls:      def.cls,          // CSS class
    color:    def.color,        // 'green', 'amber', 'red', 'blue'
    description: def.description,
  };
}

// ── getConfidenceLabel ────────────────────────────────────────
//  Returns HTML for a confidence score with reduction reason.
//
//  @param score    number 0–100
//  @param reasons  array of { source, reason } objects
function getConfidenceLabel(score, reasons = []) {
  const cls   = score >= 80 ? 'conf-high' : score >= 65 ? 'conf-med' : 'conf-low';
  const label = score >= 80 ? 'High' : score >= 65 ? 'Moderate' : 'Low';
  const bar   = `<div class="conf-mini-bar"><div class="conf-mini-fill ${cls}" style="width:${score}%"></div></div>`;
  let reasonsHtml = '';
  if (reasons.length) {
    reasonsHtml = '<ul class="conf-reasons">' +
      reasons.map(r => `<li><span class="conf-reason-src">${r.source}</span> ${r.reason}</li>`).join('') +
      '</ul>';
  }
  return `<span class="conf-score-block">
    ${bar}
    <span class="conf-score-val ${cls}">${score}%</span>
    <span class="conf-score-label">${label} confidence</span>
    ${reasonsHtml}
  </span>`;
}

// ── getMetricOutputType ───────────────────────────────────────
//  Returns the output type for a specific metric based on its
//  data source status and how it was derived.
//
//  @param source_type  'pos_direct' | 'shifts_direct' | 'recipe_cost' |
//                      'kds_direct' | 'model' | 'heuristic' | 'verified'
//  @param dq_status    'healthy' | 'stale' | 'degraded' | 'missing'
//  @returns output_type string
function getMetricOutputType(source_type, dq_status = 'healthy') {
  if (dq_status === 'missing')   return 'unavailable';
  if (source_type === 'model')   return 'modeled';
  if (source_type === 'heuristic') return 'heuristic';
  if (source_type === 'verified')  return 'verified';
  // Direct POS/source reads
  if (dq_status === 'healthy')   return 'deterministic';
  if (dq_status === 'degraded')  return 'estimated';
  if (dq_status === 'stale')     return 'estimated';
  return 'estimated';
}

// ── getOpportunityOutputLabel ─────────────────────────────────
//  Returns the correct getOutputLabel() call for an opportunity object.
//  Reads output_type, confidence_score, and DQ warnings from the opp.
function getOpportunityOutputLabel(opp, format = 'chip') {
  const ot     = STATUS_TO_OUTPUT_TYPE[opp.status] || opp.output_type || 'estimated';
  const conf   = opp.confidence_score;
  const reason = opp.source_data?.dq_warning
    ? _dqReasonShort(opp.source_data.dq_warning)
    : null;
  const lbl = getOutputLabel(ot, conf, reason);
  return format === 'chip' ? lbl.chip : lbl.html;
}

function _dqReasonShort(warning) {
  if (!warning) return null;
  if (warning.includes('7shifts')) return '7shifts stale';
  if (warning.includes('Recipe cost') || warning.includes('menu')) return 'recipe cost stale';
  if (warning.includes('KDS')) return 'KDS partial';
  return 'DQ reduced';
}

// ── getActionOutputLabel ──────────────────────────────────────
//  Returns a label for an action card based on its status and confidence.
function getActionOutputLabel(action, format = 'chip') {
  const ot   = STATUS_TO_OUTPUT_TYPE[action.status] || 'estimated';
  const conf = action.confidence ?? null;
  const lbl  = getOutputLabel(ot, conf);
  return format === 'chip' ? lbl.chip : lbl.html;
}

// ── Metric-level output type map ──────────────────────────────
//  Lazy — reads SKC_STATE.data_quality at call time so initialization
//  order doesn't matter (SKC_STATE is defined later in the script).
function getMetricOutputTypes() {
  const dq = SKC_STATE.data_quality.sources;
  return {
    // Labor / RPLH
    rplh_current:       getMetricOutputType('pos_direct',    dq.toast.status),
    rplh_baseline:      getMetricOutputType('pos_direct',    dq.toast.status),   // 8-wk avg = still DET
    hours_scheduled:    getMetricOutputType('shifts_direct', dq.shifts.status),
    hours_needed:       getMetricOutputType('model',         'healthy'),           // modeled demand
    hours_excess:       getMetricOutputType('model',         dq.shifts.status),   // derived
    wage_blended:       getMetricOutputType('heuristic',     'healthy'),           // est. from min wage

    // Menu / Salmon
    salmon_cm_pct:      getMetricOutputType('recipe_cost',   dq.menu.status),
    salmon_price:       getMetricOutputType('pos_direct',    dq.toast.status),
    salmon_item_cost:   getMetricOutputType('recipe_cost',   dq.menu.status),
    salmon_covers:      getMetricOutputType('pos_direct',    dq.toast.status),

    // Throughput
    ticket_time:        getMetricOutputType('kds_direct',    dq.kds.status),
    ticket_baseline:    getMetricOutputType('kds_direct',    dq.kds.status),
    avg_check:          getMetricOutputType('pos_direct',    dq.toast.status),
    table_turns:        getMetricOutputType('pos_direct',    dq.toast.status),

    // Guardrails
    complaints:         getMetricOutputType('pos_direct',    dq.toast.status),

    // ROI
    verified_savings:   'verified',         // A000 passed monitoring
    subscription_cost:  'deterministic',    // fixed contract value
    net_gain:           'deterministic',    // arithmetic from verified - subscription
    roi_multiple:       'deterministic',    // arithmetic
    approaching:        'active_recovery',  // A005 monitoring not closed
    total_open:         'estimated',        // sum of estimated run-rates
    active_recovery:    'active_recovery',  // sum of monitored actions
  };
}
// METRIC_OUTPUT_TYPES_PROXY — lazy object, only initializes when first accessed
// Uses a simple accessor to avoid initialization-order issues with SKC_STATE
const METRIC_OUTPUT_TYPES_PROXY = {
  _cache: null,
  _get(key) {
    if (!this._cache) {
      try { this._cache = getMetricOutputTypes(); }
      catch(e) { return 'estimated'; }
    }
    return this._cache[key] || 'estimated';
  },
};
// Convenience: make METRIC_OUTPUT_TYPES_PROXY.rplh_current work via defineProperty
Object.defineProperties(METRIC_OUTPUT_TYPES_PROXY, 
  ['rplh_current','rplh_baseline','hours_scheduled','hours_needed','hours_excess',
   'wage_blended','salmon_cm_pct','salmon_price','salmon_item_cost','salmon_covers',
   'ticket_time','ticket_baseline','avg_check','table_turns','complaints',
   'verified_savings','subscription_cost','net_gain','roi_multiple',
   'approaching','total_open','active_recovery'].reduce((acc, key) => {
    acc[key] = { get() { return METRIC_OUTPUT_TYPES_PROXY._get(key); }, enumerable: true };
    return acc;
  }, {})
);

// ── renderOutputChip ─────────────────────────────────────────
//  Renders a compact chip for use in cards, tables, drawer.
//  Usage:  ${renderOutputChip('estimated', 78)}
//          ${renderOutputChip('verified', 88)}
//          ${renderOutputChip(opp.output_type, opp.confidence_score, warn)}
function renderOutputChip(output_type, conf = null, reason = null) {
  return getOutputLabel(output_type, conf, reason).chip;
}

// ── renderOutputRow ──────────────────────────────────────────
//  Renders a full "Output Type" row for the evidence drawer
//  or expanded card sections.
function renderOutputRow(output_type, conf, reason, source_note = '') {
  const lbl = getOutputLabel(output_type, conf, reason);
  const def = OUTPUT_TYPES[output_type] || OUTPUT_TYPES.estimated;
  return `<div class="output-row">
    <span class="output-row-badge ${def.cls}">${def.short}</span>
    <div class="output-row-body">
      <div class="output-row-label">${def.label}${conf !== null ? ' · <span class="output-row-conf">' + conf + '%</span>' : ''}</div>
      <div class="output-row-desc">${def.description}${source_note ? ' · ' + source_note : ''}${reason ? '<br><span class="output-row-warn">⚠ ' + reason + '</span>' : ''}</div>
    </div>
  </div>`;
}

// ── renderConfidenceBlock ─────────────────────────────────────
//  Full confidence breakdown block for evidence drawer.
function renderConfidenceBlock(opp) {
  const dq   = opp.source_data;
  const conf = opp.confidence_score;
  const ot   = STATUS_TO_OUTPUT_TYPE[opp.status] || opp.output_type;
  const lbl  = getOutputLabel(ot, conf, dq.dq_warning ? _dqReasonShort(dq.dq_warning) : null);
  const srcLabels = {
    toast:'Toast POS', shifts:'7shifts', menu:'Recipe Cost / Menu',
    kds:'KDS', reviews:'Google Reviews', accounting:'Accounting'
  };

  const healthRows = [
    ...dq.healthy_sources.map(id  => `<div class="conf-source-row det"><span class="conf-src-dot green"></span><span class="conf-src-label">${srcLabels[id]}</span><span class="conf-src-type">${renderOutputChip('deterministic', null)}</span><span class="conf-src-note">direct · live</span></div>`),
    ...dq.stale_sources.map(id    => `<div class="conf-source-row est"><span class="conf-src-dot amber"></span><span class="conf-src-label">${srcLabels[id]}</span><span class="conf-src-type">${renderOutputChip('estimated', null)}</span><span class="conf-src-note">stale · confidence reduced</span></div>`),
    ...dq.degraded_sources.map(id => `<div class="conf-source-row est"><span class="conf-src-dot amber"></span><span class="conf-src-label">${srcLabels[id]}</span><span class="conf-src-type">${renderOutputChip('estimated', null)}</span><span class="conf-src-note">degraded · partial data</span></div>`),
    ...dq.missing_sources.map(id  => `<div class="conf-source-row unavail"><span class="conf-src-dot red"></span><span class="conf-src-label">${srcLabels[id]}</span><span class="conf-src-type">${renderOutputChip('unavailable', null)}</span><span class="conf-src-note">not connected · excluded</span></div>`),
  ].join('');

  const warnHtml = dq.dq_warning
    ? `<div class="conf-dq-warn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>${dq.dq_warning}</div>`
    : '';

  return `<div class="conf-block">
    <div class="conf-block-header">
      ${lbl.html}
      <span class="conf-block-label">${lbl.label} · ${lbl.description.slice(0,60)}…</span>
    </div>
    ${warnHtml}
    <div class="conf-sources">${healthRows}</div>
  </div>`;
}



// ═══════════════════════════════════════════════════════════════
//  ACTIONS  —  canonical action objects
//
//  Every Actions card, Today hero, Proof screen, Reports screen,
//  and Ask SKC response reads from ACTIONS[id].
//
//  Rules enforced:
//  · completed ≠ verified
//  · verified only after monitoring + guardrails pass
//  · blocked actions show a visible blocker
//  · one completed shift ≠ a full month of verified savings
//  · all impact values distinguish per-service / weekly / monthly run-rate / verified
// ═══════════════════════════════════════════════════════════════

const ACTIONS = {

  // ─── A000 · Verified win ──────────────────────────────────────
  A000: {
    action_id:              'A000',
    linked_opportunity_id:  null,   // standalone — not linked to an open opportunity
    title:                  'Menu cleanup · Risotto removed',
    category:               'Menu',
    location_id:            'ALL',
    location_name:          'All Locations',
    daypart:                'All Day',
    owner:                  'Owner',
    system:                 'Toast Menu',
    due_at:                 'Apr 26, 2026',
    created_at:             '2026-04-12',
    updated_at:             '2026-05-03',

    status:                 'verified',
    status_label:           'Verified',
    output_type:            'verified',

    confidence_score:       88,
    get confidence_label()  { return 'High'; },

    // Impact — full time-basis breakdown
    expected_impact: {
      per_service_impact:         null,          // menu item removal — not per-service
      affected_services_per_week: null,
      weekly_exposure:            null,
      monthly_run_rate:           420,           // $/mo verified
      monthly_open_opportunity:   0,
      monthly_active_recovery:    0,
      monthly_verified_savings:   420,
      counted_in_verified_roi:    true,
      impact_basis:               'Risotto food cost eliminated (waste + labour). Verified after 4-week monitoring window. $420/mo confirmed.',
      single_action_note:         'This was a one-time removal. The $420/mo represents ongoing savings from not purchasing Risotto ingredients.',
    },

    playbook: {
      steps: [
        'Access Toast Menu Manager → All Locations',
        'Find "Risotto" → archive item (do not delete — preserves historical data)',
        'Confirm removal across all 4 locations',
        'Flag for 86 in KDS to prevent accidental ring-ins',
        'Monitor COGS reduction in weekly food cost report',
      ],
      required_inputs: ['Toast POS access','Menu Manager permission','Owner approval'],
      completion_criteria: 'Risotto no longer available on any location POS',
    },

    data_health: {
      required_sources: ['toast','menu'],
      get stale_sources() {
        return this.required_sources.filter(id =>
          ['stale','degraded'].includes(SKC_STATE.data_quality.sources[id]?.status));
      },
      get missing_sources() {
        return this.required_sources.filter(id =>
          SKC_STATE.data_quality.sources[id]?.status === 'missing');
      },
      get action_rule() { return 'allowed'; },  // already executed
    },

    guardrails: [
      { metric: 'Food cost %', target: 'Reduction vs prior 4 wks', status: 'pass', verified: true },
      { metric: 'Cover count', target: '≥ baseline (no demand impact)', status: 'pass', verified: true },
      { metric: 'Avg check',   target: '≥ $50.00',                    status: 'pass', verified: true },
    ],

    verification_rule: {
      required_monitoring_period: '4 weeks post-removal',
      pass_conditions: [
        'Food cost % reduced vs prior 4-week average',
        'Cover count within ±10% of baseline',
        'No increase in refunds or complaints',
        'Avg check maintained ≥ $50.00',
      ],
      fail_conditions: [
        'Food cost % unchanged or increased',
        'Cover count drops > 10% (demand impact from removal)',
      ],
      verified_date:     'May 3, 2026',
      monitoring_closed: true,
      get can_verify()   { return false; },   // already verified
    },

    blocker:   null,
    next_step: 'No action required — verified and counting in ROI.',
  },

  // ─── A005 · Active monitoring ──────────────────────────────────
  A005: {
    action_id:              'A005',
    linked_opportunity_id:  null,   // Walnut Creek bar — separate from OPP-001
    title:                  'Bar staffing reduction · Walnut Creek',
    category:               'Labor',
    location_id:            'WCK',
    location_name:          'Walnut Creek',
    daypart:                'Bar (all shifts)',
    owner:                  'Devon K.',
    system:                 '7shifts',
    due_at:                 'May 24, 2026',
    created_at:             '2026-04-28',
    updated_at:             '2026-05-18',

    status:                 'monitoring',
    status_label:           'Monitoring',
    output_type:            'active_recovery',

    confidence_score:       91,
    get confidence_label()  { return 'High'; },

    expected_impact: {
      per_service_impact:         205,           // per bar shift · ~$18.40 blended × ~11 excess hrs (bar: different role, tip credit applies)
      affected_services_per_week: 4,             // 4 bar shifts/wk at Walnut Creek
      weekly_exposure:            205,           // 1 shift/wk verified so far
      monthly_run_rate:           820,           // if sustained across all shifts
      monthly_open_opportunity:   0,
      monthly_active_recovery:    820,           // currently in monitoring — NOT yet verified
      monthly_verified_savings:   0,             // $0 until monitoring window closes May 24
      counted_in_verified_roi:    false,
      impact_basis:               '$820/mo active recovery — monitoring Wk 3/4. RPLH tracking above $36.50 target. Closes May 24. Value counts in ROI only after monitoring confirms.',
      single_action_note:         'Each bar shift reduces excess labour cost by ~$205. The $820/mo run-rate is the annualised estimate if all 4 shifts per week sustain the improvement.',
    },

    monitoring: {
      week_current:    3,
      week_total:      4,
      closes:          'May 24, 2026',
      on_track:        true,
      get rplh_current() { return SKC_STATE.metrics.bar_rplh_current; },
      get rplh_target()  { return SKC_STATE.metrics.bar_rplh_target; },
      get rplh_baseline(){ return SKC_STATE.metrics.bar_rplh_baseline; },
    },

    playbook: {
      steps: [
        '7shifts → Walnut Creek → Bar schedule',
        'Remove 1 bar back per shift for Wed–Sat evening service',
        'Confirm head bartender has coverage',
        'Monitor RPLH each shift — target $36.50+',
        'Review weekly at Monday ops meeting',
      ],
      required_inputs: ['7shifts access','Bar manager sign-off','Devon K. as owner'],
      completion_criteria: 'RPLH ≥ $36.50 for 4 consecutive Walnut Creek bar shifts',
    },

    data_health: {
      required_sources: ['toast','shifts'],
      get stale_sources() {
        return this.required_sources.filter(id =>
          ['stale','degraded'].includes(SKC_STATE.data_quality.sources[id]?.status));
      },
      get missing_sources() {
        return this.required_sources.filter(id =>
          SKC_STATE.data_quality.sources[id]?.status === 'missing');
      },
      get action_rule() {
        // Already in monitoring — DQ issues don't block the ongoing window
        return SKC_STATE.data_quality.sources.shifts.status === 'missing' ? 'blocked' : 'allowed';
      },
    },

    guardrails: [
      { metric: 'RPLH (Walnut Creek bar)', target: '≥ $36.50/hr', get status() { return SKC_STATE.metrics.bar_rplh_current >= SKC_STATE.metrics.bar_rplh_target ? 'pass' : 'fail'; }, note: 'Currently $38.40/hr ↑' },
      { metric: 'Guest complaints',        target: '≤ 2/wk',      status: 'pass', note: '0 this week' },
      { metric: 'Avg check (bar)',         target: '≥ $38.00',    status: 'pass', note: '$41.20 current' },
      { metric: 'Ticket time',             target: '≤ 16 min',    get status() { return SKC_STATE.metrics.ticket_time <= 16 ? 'pass' : 'fail'; } },
    ],

    verification_rule: {
      required_monitoring_period: '4 weeks (4 consecutive bar shift groups)',
      pass_conditions: [
        'RPLH ≥ $36.50/hr for all 4 monitoring weeks at Walnut Creek bar',
        'Guest complaints ≤ 2/week throughout window',
        'Bar avg check maintained ≥ $38.00',
        '7shifts providing fresh data (not stale)',
      ],
      fail_conditions: [
        'RPLH drops below $36.50 in any monitoring week',
        'Complaints exceed 2/week',
        'Bar check drops below $38.00 (service quality signal)',
      ],
      monitoring_week:   3,
      monitoring_total:  4,
      closes:            'May 24, 2026',
      on_track:          true,
      get can_verify()   {
        return this.monitoring_week >= this.monitoring_total &&
               SKC_STATE.data_quality.sources.shifts.status === 'healthy';
      },
    },

    blocker: null,
    next_step: 'Week 3 monitoring in progress. RPLH $38.40 — tracking above target. Closes May 24.',
  },

  // ─── A006 · Proposed — labor action requiring approval ─────────
  A006: {
    action_id:              'A006',
    linked_opportunity_id:  'OPP-001',
    title:                  'Remove 1 server · Oakland Tuesday dinner',
    category:               'Labor',
    location_id:            'OAK',
    location_name:          'Oakland',
    daypart:                'Tuesday Dinner (5 PM–10 PM)',
    owner:                  'Sarah C.',
    system:                 '7shifts',
    due_at:                 'Today before 3 PM',
    created_at:             '2026-05-18',
    updated_at:             '2026-05-18',

    status:                 'approval_required',
    status_label:           'Approval Required',
    output_type:            'open_opportunity',

    confidence_score:       78,
    get confidence_label()  { return 'Moderate-High'; },

    expected_impact: {
      // Per-service: one Tuesday dinner shift at Oakland
      get per_service_impact()          { return OPPORTUNITIES.labor.impact.per_service_impact; },  // $92
      per_service_basis:                'One Tuesday dinner service at Oakland — excess labour cost for 1 shift.',
      // Affected services: Oakland only = 2 services/wk (Tue + Wed)
      get affected_services_per_week()  { return 2; },   // Oakland only, not Berkeley
      affected_services_basis:          'Tuesday and Wednesday dinner at Oakland only (this action is Oakland-specific).',
      // Weekly: $92 × 2 nights Oakland
      get weekly_exposure()             { return OPPORTUNITIES.labor.impact.per_service_impact * 2; },  // $184/wk
      // Monthly run-rate if Oakland Tue+Wed fixed
      get monthly_run_rate()            { return OPPORTUNITIES.labor.impact.location_monthly_impact; }, // $1,600/mo
      monthly_open_opportunity:         0,   // $0 until action created
      monthly_active_recovery:          0,   // $0 until monitoring starts
      monthly_verified_savings:         0,   // $0 — not verified
      counted_in_verified_roi:          false,
      impact_basis:                     'If Oakland Tuesday + Wednesday are both fixed and monitoring passes: ~$1,600/mo est. run-rate Oakland only. One shift tonight = ~$92 of excess labour cost stopped.',
      single_action_note:               'One shift change stops $92 in excess cost tonight. The $1,600/mo estimate requires 2 consecutive Tuesdays above RPLH target, all guardrails passing, and 7shifts reconnected. Do not treat one completed shift as $1,600/mo saved.',
    },

    playbook: {
      steps: [
        'Reconnect 7shifts first (Data Quality screen) — required for verification eligibility',
        'Open 7shifts → Oakland → Tuesday Dinner',
        'Find the 5 PM–10 PM server shift',
        'Remove or reassign — confirm manager coverage remains',
        'Save and publish the updated schedule',
        'Repeat for Wednesday dinner at Oakland',
        'Log action as complete in SKC → start monitoring window',
        'Review RPLH at end-of-night Toast sync — target $36.50+',
      ],
      required_inputs: ['7shifts access', 'Oakland GM approval', 'Manager coverage confirmed'],
      completion_criteria: 'Schedule saved and published in 7shifts with one fewer server for Tue + Wed dinner',
    },

    data_health: {
      required_sources: ['toast', 'shifts'],
      get stale_sources() {
        return this.required_sources.filter(id =>
          ['stale','degraded'].includes(SKC_STATE.data_quality.sources[id]?.status));
      },
      get missing_sources() {
        return this.required_sources.filter(id =>
          SKC_STATE.data_quality.sources[id]?.status === 'missing');
      },
      get action_rule() {
        return SKC_STATE.data_quality.sources.shifts.status === 'missing' ? 'blocked'
          : SKC_STATE.data_quality.sources.shifts.status === 'stale' ? 'requires_approval'
          : 'allowed';
      },
    },

    guardrails: [
      { key: 'ticket_time', metric: 'Kitchen ticket time', target: '≤ 16 min', limit: 16, op: 'lte',
        get current() { return SKC_STATE.metrics.ticket_time; },
        get status()  { return SKC_STATE.guardrails.status('ticket_time'); } },
      { key: 'avg_check',   metric: 'Average check value', target: '≥ $50.00', limit: 50, op: 'gte',
        get current() { return SKC_STATE.metrics.avg_check; },
        get status()  { return SKC_STATE.guardrails.status('avg_check'); } },
      { key: 'table_turns', metric: 'Table turn time',     target: '≤ 52 min', limit: 52, op: 'lte',
        get current() { return SKC_STATE.metrics.table_turns; },
        get status()  { return SKC_STATE.guardrails.status('table_turns'); } },
      { key: 'complaints',  metric: 'Guest complaints',    target: '≤ 2/wk',   limit: 2,  op: 'lte',
        get current() { return SKC_STATE.metrics.complaints; },
        get status()  { return SKC_STATE.guardrails.status('complaints'); } },
    ],

    verification_rule: {
      required_monitoring_period: '14 days (2 consecutive Tuesday dinners)',
      pass_conditions: [
        'RPLH ≥ $36.50/hr for 2 consecutive Tuesday dinner services at Oakland (Toast POS · DET)',
        'Kitchen ticket time ≤ 16 min throughout monitoring window',
        'Average check ≥ $50.00 throughout monitoring window',
        'Table turns ≤ 52 min for all monitored services',
        'Guest complaints ≤ 2 in any 7-day window during monitoring',
        '7shifts reconnected and providing fresh data',
      ],
      fail_conditions: [
        'RPLH drops below $36.50/hr in either monitored Tuesday',
        'Ticket time exceeds 16 min in any service during monitoring',
        'Average check drops below $50.00',
        'Guest complaints exceed 2 in any 7-day window',
      ],
      get blocked_by() {
        const b = [];
        const shifts = SKC_STATE.data_quality.sources.shifts;
        if (shifts.status === 'stale')   b.push('7shifts stale ' + shifts.lastSync + ' — reconnect to unlock verified win eligibility');
        if (shifts.status === 'missing') b.push('7shifts not connected — cannot monitor RPLH without schedule data');
        if (SKC_STATE.guardrails.status('table_turns') === 'watch') {
          b.push('Table turns at Watch (48 min, 4 min from 52 min threshold) — needs one clean Tuesday before verified win');
        }
        return b;
      },
      get can_verify() { return this.blocked_by.length === 0; },
    },

    get blocker() {
      const avail = getActionAvailability(this);
      if (avail.blocked) return avail.primary_blocker;
      if (avail.needs_approval) return null;  // not a hard block — approval needed
      return null;
    },
    get next_step() {
      const avail = getActionAvailability(this);
      if (avail.blocked) return 'Blocked — ' + avail.primary_blocker;
      if (avail.needs_approval) return 'Reconnect 7shifts, then get GM approval before executing.';
      return 'Open 7shifts → Oakland → Tuesday Dinner → remove 5 PM–10 PM shift. Publish schedule.';
    },
    requires_approval: true,
    approval_reason:   '7shifts stale — GM approval required before schedule change',
  },

  // ─── A007 · Approval required — salmon reprice ─────────────────
  A007: {
    action_id:              'A007',
    linked_opportunity_id:  'OPP-002',
    title:                  'Reprice Grilled Salmon · $24 → $27',
    category:               'Menu',
    location_id:            'ALL',
    location_name:          'All Locations',
    daypart:                'All Day',
    owner:                  'Marcus R.',
    system:                 'Toast Menu',
    due_at:                 'Friday, May 22',
    created_at:             '2026-05-18',
    updated_at:             '2026-05-18',

    status:                 'approval_required',
    status_label:           'Awaiting Owner Approval',
    output_type:            'open_opportunity',

    confidence_score:       71,
    get confidence_label()  { return 'Moderate-High'; },

    expected_impact: {
      get per_service_impact()          { return OPPORTUNITIES.salmon.impact.per_service_impact; },  // $5.52/plate
      per_service_basis:                'CM gap per plate at current vs target price. Each Salmon sold adds $5.52 in recoverable margin.',
      get affected_services_per_week()  { return OPPORTUNITIES.salmon.impact.affected_services_per_week; },  // 7 services/wk all locations
      affected_services_basis:          'Salmon is on all-day menus. All 4 locations, ~7 services per week.',
      get weekly_exposure()             { return OPPORTUNITIES.salmon.impact.weekly_exposure; },  // $519/wk
      get monthly_run_rate()            { return OPPORTUNITIES.salmon.impact.monthly_run_rate; },  // $2,247/mo
      monthly_open_opportunity:         0,
      monthly_active_recovery:          0,
      monthly_verified_savings:         0,
      counted_in_verified_roi:          false,
      impact_basis:                     '$5.52/plate CM gap × 94 covers/wk × 4.33 wks × 0.85 volume buffer = $2,100/mo est. run-rate. One reprice action does not equal $2,100 saved today — it starts a 3-week monitoring window.',
      single_action_note:               'Executing the reprice is one action. The $2,100/mo is the estimated monthly run-rate IF the price holds and volume stays above 80 covers/week for 3 consecutive weeks. Nothing counts in ROI until monitoring confirms.',
    },

    playbook: {
      steps: [
        'Verify current item cost is still $14.80 (recipe cost file last updated 18d ago)',
        'Get owner sign-off: +12.5% price change exceeds 5% GM threshold',
        'Toast POS → Menu Management → Grilled Salmon',
        'Update price $24.00 → $27.00 across all 4 locations simultaneously',
        'Note reprice date in SKC for monitoring window start',
        'Monitor Salmon CM % and weekly cover count for 3 weeks',
      ],
      required_inputs: ['Owner approval', 'Toast Menu Manager access', 'Verified item cost'],
      completion_criteria: 'Salmon price updated to $27 on all location menus in Toast POS',
    },

    data_health: {
      required_sources: ['toast', 'menu'],
      get stale_sources() {
        return this.required_sources.filter(id =>
          ['stale','degraded'].includes(SKC_STATE.data_quality.sources[id]?.status));
      },
      get missing_sources() {
        return this.required_sources.filter(id =>
          SKC_STATE.data_quality.sources[id]?.status === 'missing');
      },
      get action_rule() {
        return SKC_STATE.data_quality.sources.menu.status === 'missing' ? 'requires_approval' : 'allowed';
      },
    },

    guardrails: [
      { metric: 'Salmon CM %',          target: '≥ 45%',           status: 'pending', note: 'Post-reprice monitoring' },
      { metric: 'Salmon covers / wk',   target: '≥ 80 covers/wk',  status: 'pending', note: 'Volume retention check' },
      { metric: 'Item rating',          target: '≥ 4.3 ★',         status: 'pass',    note: '4.7★ current' },
      { metric: 'Item refunds',         target: '≤ 3/wk',          status: 'pass',    note: '0 current' },
    ],

    verification_rule: {
      required_monitoring_period: '3 weeks post-reprice',
      pass_conditions: [
        'Salmon CM ≥ 45% for 3 consecutive weeks (Recipe Cost + Toast POS)',
        'Volume stays ≥ 80 covers/week (< 15% drop from 94 baseline)',
        'Item rating stays ≥ 4.3★',
        'Item refunds ≤ 3/week',
      ],
      fail_conditions: [
        'Volume drops below 80 covers/week for any week in monitoring window',
        'Item rating drops below 4.3★',
        'Refunds exceed 3/week',
        'Substitution effect: other protein volumes shift > 10%',
      ],
      get blocked_by() {
        const b = [];
        if (SKC_STATE.data_quality.sources.menu.status === 'stale') {
          b.push('Recipe cost file stale 18d — verify $14.80 item cost before owner approval');
        }
        return b;
      },
      get can_verify() { return false; },  // monitoring not started
    },

    blocker: null,
    next_step: 'Awaiting owner approval. Verify item cost first — recipe file is 18d stale.',
    requires_approval: true,
    approval_reason:   '+12.5% price change exceeds 5% GM threshold — owner sign-off required',
  },

  // ─── A008 · Proposed — throughput investigation ────────────────
  A008: {
    action_id:              'A008',
    linked_opportunity_id:  'OPP-003',
    title:                  'Friday lunch line review · Berkeley kitchen',
    category:               'Throughput',
    location_id:            'BRK',
    location_name:          'Berkeley',
    daypart:                'Friday Lunch (10:30 AM pre-service)',
    owner:                  'Jamie L.',
    system:                 'On-site + KDS',
    due_at:                 'Friday, May 22 (10:30 AM)',
    created_at:             '2026-05-18',
    updated_at:             '2026-05-18',

    status:                 'proposed',
    status_label:           'Proposed',
    output_type:            'open_opportunity',

    confidence_score:       64,
    get confidence_label()  { return 'Moderate'; },

    expected_impact: {
      get per_service_impact()          { return OPPORTUNITIES.throughput.impact.per_service_impact; },  // $384
      per_service_basis:                'Revenue at risk per Friday lunch service — ~4 lost table turns × 2.4 avg party × $53.10 check.',
      affected_services_per_week:       1,
      affected_services_basis:          'One service per week — Friday lunch at Berkeley only. Pattern not seen at other locations or days.',
      get weekly_exposure()             { return OPPORTUNITIES.throughput.impact.weekly_exposure; },  // $356/wk
      get monthly_run_rate()            { return OPPORTUNITIES.throughput.impact.monthly_run_rate; },  // $1,536/mo
      monthly_open_opportunity:         0,
      monthly_active_recovery:          0,
      monthly_verified_savings:         0,
      counted_in_verified_roi:          false,
      impact_basis:                     '$384/Friday × 4 Fridays × 0.8 buffer = $1,540/mo est. run-rate Berkeley only. The line review is a diagnostic step — it does not produce $1,540 savings. Savings occur if the identified fix holds for 3 consecutive Fridays below 12 min.',
      single_action_note:               'The line review is a 15-minute diagnostic. The $1,540/mo estimate only applies if: (1) a fix is identified and implemented, (2) ticket time drops to ≤ 12 min, (3) 3 consecutive Fridays pass all guardrails. Do not count the investigation itself as savings.',
    },

    playbook: {
      steps: [
        'Arrive at Berkeley 30 min before Friday lunch (10:30 AM)',
        'Walk each kitchen station — check mise en place and prep completeness',
        'Identify handoff friction between expo, grill, and sauté',
        'Implement one targeted process change before service starts',
        'Watch KDS ticket times during service — target ≤ 12 min',
        'Log findings in SKC → Throughput for baseline comparison',
        'Repeat for 3 consecutive Fridays to confirm fix holds',
      ],
      required_inputs: ['Jamie L. on-site', 'KDS access', 'Kitchen manager coordination'],
      completion_criteria: 'Root cause identified and one process change implemented before service starts',
    },

    data_health: {
      required_sources: ['toast', 'kds'],
      get stale_sources() {
        return this.required_sources.filter(id =>
          ['stale','degraded'].includes(SKC_STATE.data_quality.sources[id]?.status));
      },
      get missing_sources() {
        return this.required_sources.filter(id =>
          SKC_STATE.data_quality.sources[id]?.status === 'missing');
      },
      get action_rule() {
        return SKC_STATE.data_quality.sources.kds.status === 'missing' ? 'blocked' : 'allowed';
      },
    },

    guardrails: [
      { key: 'ticket_time', metric: 'Ticket time (post-fix target)', target: '≤ 12 min', limit: 12, op: 'lte',
        get current() { return SKC_STATE.metrics.ticket_time; },
        get status()  { return SKC_STATE.metrics.ticket_time <= 12 ? 'pass' : 'fail'; } },
      { metric: 'Table turn time',  target: '≤ 52 min',  limit: 52, op: 'lte',
        get current() { return SKC_STATE.metrics.table_turns; },
        get status()  { return SKC_STATE.metrics.table_turns <= 52 ? 'pass' : 'fail'; } },
      { metric: 'Remake rate',      target: '< 3%',      status: 'pass', note: '1.2% current' },
      { metric: 'Guest complaints', target: '≤ 2/wk',   limit: 2, op: 'lte',
        get current() { return SKC_STATE.metrics.complaints; },
        get status()  { return SKC_STATE.metrics.complaints <= 2 ? 'pass' : 'fail'; } },
    ],

    verification_rule: {
      required_monitoring_period: '3 weeks (3 consecutive Friday lunch services)',
      pass_conditions: [
        'Ticket time ≤ 12 min for 3 consecutive Friday lunches at Berkeley (KDS · DET)',
        'Cover count within ±10% of baseline (87–107 covers)',
        'Table turns below 52 min',
        'Remake rate stays < 3%',
      ],
      fail_conditions: [
        'Remake rate exceeds 3% (food quality tradeoff)',
        'Guest complaints exceed 2 in any 7-day window',
        'Ticket time still above 12 min after fix implemented',
        'Labour cost % rises (fix required adding staff)',
      ],
      get blocked_by() {
        const b = [];
        const kds = SKC_STATE.data_quality.sources.kds;
        if (kds.status === 'missing') b.push('KDS not connected — ticket time cannot be measured');
        if (kds.status === 'degraded') b.push('KDS partial — aggregate ticket time only, no per-station root cause confirmation');
        if (SKC_STATE.metrics.ticket_time > 12) {
          b.push(`Ticket time currently ${SKC_STATE.metrics.ticket_time} min — must reach ≤ 12 min before monitoring can confirm improvement`);
        }
        return b;
      },
      get can_verify() {
        return SKC_STATE.metrics.ticket_time <= 12 &&
               SKC_STATE.data_quality.sources.kds.status !== 'missing';
      },
    },

    blocker: null,
    next_step: 'Schedule Jamie L. for Berkeley Friday 10:30 AM. KDS is partial — bring notepad for station timing.',
  },
};

// ── Action ID list (no getters — avoids Object.values() recursion) ─
// ACTION_IDS and helpers are now in the ACTIONS canonical block above


// ── Helper functions ──────────────────────────────────────────
function getActionList() {
  return ACTION_IDS.map(id => ACTIONS[id]).filter(Boolean);
}
function getActionById(id) {
  return ACTIONS[id] || null;
}
function getActionsByStatus(...statuses) {
  return getActionList().filter(a => statuses.includes(a.status));
}
function getActionsDueToday() {
  return getActionList().filter(a => (a.due_at || '').includes('Today')).length;
}
function getActionsInProgress() {
  return getActionList().filter(a => ['proposed','approval_required','assigned','in_progress'].includes(a.status)).length;
}
function getActionsMonitoring() {
  return getActionList().filter(a => a.status === 'monitoring').length;
}
function getActionsVerified() {
  return getActionList().filter(a => a.status === 'verified').length;
}

// ── renderActionCard(action) — HTML string for one action card ─
function renderActionCard(action) {
  const imp     = action.expected_impact;
  const dq      = action.data_health;
  const vr      = action.verification_rule;
  const avail   = (typeof getActionAvailability === 'function') ? getActionAvailability(action) : { available: true, needs_approval: false, blocked: false };

  const outputType  = action.output_type || 'open_opportunity';
  const outputChip  = (typeof getOutputLabel === 'function')
    ? getOutputLabel(outputType, action.confidence_score).chip : '';
  const statusCls   = {
    proposed:         'open',
    approval_required:'approval',
    assigned:         'open',
    in_progress:      'open',
    monitoring:       'monitoring',
    verified:         'verified',
    blocked:          'blocked',
    completed:        'completed',
    regressed:        'blocked',
  }[action.status] || 'open';

  // DQ blocker banner
  const blockerHtml = (avail.needs_approval && !avail.blocked)
    ? `<div class="dq-banner warn" style="margin:0 0 8px;font-size:11.5px;padding:8px 11px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span>${avail.approvers[0] || 'Approval required'}</span></div>`
    : avail.blocked
    ? `<div class="dq-banner critical" style="margin:0 0 8px;font-size:11.5px;padding:8px 11px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span>${avail.primary_blocker}</span></div>`
    : '';

  // Verification blocker
  const veBlockers = vr.blocked_by || [];
  const veBlockerHtml = veBlockers.length
    ? `<div class="ac-verify-block"><span class="ac-verify-block-label">Verification blocked</span> ${veBlockers.map(b => `<span class="ac-verify-block-item">${b}</span>`).join('')}</div>`
    : '';

  // Impact chain — the key section that distinguishes per-service vs monthly
  const hasPerService  = imp.per_service_impact != null;
  const svcUnit        = action.category === 'Menu' ? 'plate' : action.category === 'Throughput' ? 'Friday lunch' : 'dinner service';
  const perSvcFmt      = hasPerService
    ? (typeof formatPerService === 'function' ? formatPerService(imp.per_service_impact, svcUnit) : '$' + imp.per_service_impact + '/' + svcUnit)
    : null;
  const weeklyFmt      = typeof formatWeekly === 'function' ? formatWeekly(imp.weekly_exposure || 0) : '$' + (imp.weekly_exposure || 0) + '/wk';
  const runRateFmt     = typeof formatRunRate === 'function' ? formatRunRate(imp.monthly_run_rate || 0) : '$' + (imp.monthly_run_rate || 0) + '/mo est. run-rate';
  const verifiedFmt    = imp.monthly_verified_savings > 0
    ? (typeof formatVerifiedValue === 'function' ? formatVerifiedValue(imp.monthly_verified_savings) : '$' + imp.monthly_verified_savings + '/mo verified')
    : '$0 verified';

  const impactChain = `
    <div class="ac-impact-chain">
      ${hasPerService ? `<div class="ac-impact-row">
        <span class="ac-impact-label">Per ${svcUnit}</span>
        <span class="ac-impact-val">${perSvcFmt}</span>
        <span class="ac-impact-basis">${imp.per_service_basis || ''}</span>
      </div>` : ''}
      ${imp.weekly_exposure ? `<div class="ac-impact-row">
        <span class="ac-impact-label">Weekly exposure</span>
        <span class="ac-impact-val">${weeklyFmt}</span>
        <span class="ac-impact-basis">${imp.affected_services_basis || (imp.affected_services_per_week + ' services/wk')}</span>
      </div>` : ''}
      <div class="ac-impact-row ac-impact-row-runrate">
        <span class="ac-impact-label">Monthly run-rate</span>
        <span class="ac-impact-val">${runRateFmt}</span>
        <span class="ac-impact-basis">if sustained · ${action.category === 'Menu' ? '3-wk' : '2-wk'} monitoring required</span>
      </div>
      <div class="ac-impact-row ac-impact-row-roi ${imp.counted_in_verified_roi ? 'roi-yes' : 'roi-no'}">
        <span class="ac-impact-label">Counted in ROI</span>
        <span class="ac-impact-val">${imp.counted_in_verified_roi ? verifiedFmt : verifiedFmt + ' · not counted yet'}</span>
        <span class="ac-impact-basis">${imp.impact_basis ? imp.impact_basis.slice(0, 90) + (imp.impact_basis.length > 90 ? '…' : '') : ''}</span>
      </div>
    </div>
    ${imp.single_action_note ? `<div class="ac-single-note">${imp.single_action_note}</div>` : ''}`;

  // Monitoring progress (A005)
  const monitoringHtml = action.monitoring
    ? `<div class="ac-monitoring-row">
        <div class="ac-monitor-bar-wrap">
          <div class="ac-monitor-bar" style="width:${(action.monitoring.week_current/action.monitoring.week_total)*100}%"></div>
        </div>
        <span class="ac-monitor-label">Week ${action.monitoring.week_current} of ${action.monitoring.week_total} · closes ${action.monitoring.closes}</span>
        ${action.monitoring.on_track ? '<span class="ac-monitor-on-track">On track ✓</span>' : '<span class="ac-monitor-off-track">⚠ Below target</span>'}
      </div>
      <div class="ac-monitor-rplh">RPLH: <strong>$${action.monitoring.rplh_current.toFixed(2)}/hr</strong> vs $${action.monitoring.rplh_target.toFixed(2)} target ${action.monitoring.rplh_current >= action.monitoring.rplh_target ? '✓' : '⚠'}</div>`
    : '';

  // Playbook steps (collapsed by default)
  const playbookHtml = `
    <details class="ac-playbook">
      <summary class="ac-playbook-summary">Playbook · ${action.playbook.steps.length} steps</summary>
      <ol class="ac-playbook-steps">
        ${action.playbook.steps.map((step, i) => `<li class="ac-playbook-step"><span class="ac-step-num">${i+1}</span><span>${step}</span></li>`).join('')}
      </ol>
      <div class="ac-playbook-footer">
        <span class="ac-playbook-key">Completion criteria:</span> ${action.playbook.completion_criteria}
      </div>
    </details>`;

  // Guardrails row
  const guardrailsHtml = action.guardrails.length
    ? `<div class="ac-guardrails">
        ${action.guardrails.map(g => {
          const st = (typeof g.status === 'string') ? g.status : 'pending';
          const cls = st === 'pass' ? 'ac-guard-pass' : st === 'fail' ? 'ac-guard-fail' : 'ac-guard-pending';
          return `<span class="ac-guard-item ${cls}" title="${g.metric}: ${g.target}">${g.metric.split(' ')[0]} ${st === 'pass' ? '✓' : st === 'fail' ? '✗' : '–'}</span>`;
        }).join('')}
      </div>` : '';

  // CTA button
  const ctaHtml = action.status === 'proposed' || action.status === 'approval_required'
    ? `<button class="btn btn-primary btn-sm" onclick="openCA('${action.linked_opportunity_id ? action.linked_opportunity_id.replace('OPP-00','leak') : action.action_id}')" ${avail.blocked ? 'disabled title="'+avail.primary_blocker+'"' : ''}>${avail.blocked ? 'Blocked' : avail.needs_approval ? 'Request Approval' : 'Assign Action'}</button>`
    : action.status === 'monitoring'
    ? `<button class="btn btn-secondary btn-sm" onclick="switchTab('execution','monitoring');showScreen('actions',null,'Actions')">View Monitoring</button>`
    : action.status === 'verified'
    ? `<button class="btn btn-ghost btn-sm" onclick="showScreen('scorecard',null,'ROI Proof')">ROI Proofroof →</button>`
    : '';

  return `<div class="ex-card mb-12" id="ac-card-${action.action_id}">
    ${blockerHtml}
    <div class="ex-card-header">
      <div class="ex-card-header-left">
        <span class="ex-card-status ${statusCls}">${action.status_label}</span> ${outputChip}
        <span class="ex-card-cat">${action.category}</span>
        <span class="ex-card-id">${action.action_id}</span>
      </div>
    </div>
    <div class="ex-card-title">${action.title}</div>
    <div class="ex-card-meta-row">
      <span class="ex-meta-item"><span class="ex-meta-key">Owner</span> ${action.owner}</span>
      <span class="ex-meta-item"><span class="ex-meta-key">Location</span> ${action.location_name}</span>
      <span class="ex-meta-item"><span class="ex-meta-key">Due</span> ${action.due_at}</span>
      <span class="ex-meta-item"><span class="ex-meta-key">System</span> ${action.system}</span>
    </div>
    ${monitoringHtml}
    ${impactChain}
    ${veBlockerHtml}
    ${guardrailsHtml}
    ${playbookHtml}
    <div class="ex-card-footer">
      <span class="ex-footer-next">${action.next_step || ''}</span>
      ${ctaHtml}
    </div>
  </div>`;
}

// ── renderActionsTab(status_filter) — full tab panel content ──
function renderActionsTab(tab_key) {
  const filterMap = {
    'open':       ['proposed', 'approval_required', 'assigned', 'in_progress'],
    'approvals':  ['approval_required'],
    'monitoring': ['monitoring'],
    'completed':  ['verified', 'completed'],
  };
  const statuses = filterMap[tab_key];
  if (!statuses) return '';
  const cards = getActionList().filter(a => statuses.includes(a.status));
  if (!cards.length) {
    return `<div class="empty-state" style="padding:40px 20px;text-align:center;color:var(--t3)">No ${tab_key} actions</div>`;
  }
  return cards.map(renderActionCard).join('');
}



// ═══════════════════════════════════════════════════════════════
//  VERIFICATIONS  —  canonical verification records
//
//  One entry per opportunity that has been or is being monitored.
//  Every Proof/Reports dollar value must trace back to one of these.
//
//  Rules enforced:
//  · verified_monthly_value > 0 only after status = 'verified'
//  · can_count_in_roi = true only when verified AND all counter-metrics pass
//  · monthly run-rate is never called "saved" before verified
//  · missing accounting → operational ROI only, not margin-confirmed
// ═══════════════════════════════════════════════════════════════

const VERIFICATIONS = {

  // ─── V001 · Risotto removal · VERIFIED ────────────────────────
  V001: {
    verification_id:   'V001',
    opportunity_id:    null,          // standalone — no open opportunity
    action_id:         'A000',
    title:             'Menu cleanup · Risotto removed',
    category:          'Menu',

    status:            'verified',    // ONLY status that allows can_count_in_roi = true
    monitoring_start:  '2026-04-05',
    monitoring_end:    '2026-05-03',
    required_monitoring_weeks: 4,
    weeks_completed:   4,

    pass_conditions: [
      'Food cost % reduced vs prior 4-week average — PASSED (−1.2 pts)',
      'Cover count within ±10% of baseline — PASSED (96% of baseline)',
      'No increase in refunds or complaints — PASSED (0 refunds, 0 complaints)',
      'Avg check maintained ≥ $50 — PASSED ($53.10)',
    ],
    failed_conditions: [],            // none — all passed

    counter_metric_results: [
      { metric: 'Food cost %',       result: 'PASS', before: '28.4%',   after: '27.2%',   threshold: 'Decrease vs baseline', note: '−1.2 pts confirmed' },
      { metric: 'Cover count',       result: 'PASS', before: '94 avg',  after: '91 avg',   threshold: '≥ 85 (−10% max)',     note: '−3% within range' },
      { metric: 'Avg check',         result: 'PASS', before: '$52.40',  after: '$53.10',   threshold: '≥ $50.00',            note: '+$0.70 ✓' },
      { metric: 'Refunds',           result: 'PASS', before: '0/wk',    after: '0/wk',     threshold: '≤ 3/wk',              note: 'No change' },
      { metric: 'Guest complaints',  result: 'PASS', before: '0/wk',    after: '0/wk',     threshold: '≤ 2/wk',              note: 'No change' },
    ],

    verified_monthly_value: 420,      // confirmed — counts in ROI
    confidence_score:       88,
    output_type:            'verified',

    evidence_links: [
      { type: 'source',   label: 'Toast POS · Food cost report · May 3',  note: 'DET · direct' },
      { type: 'source',   label: 'Toast POS · Cover count · May 3',        note: 'DET · direct' },
      { type: 'source',   label: 'Toast POS · Avg check · May 3',          note: 'DET · direct' },
      { type: 'formula',  label: 'Ingredient cost reduction × projected volume = $420/mo', note: 'EST → VER after monitoring' },
    ],

    can_count_in_roi:        true,
    accounting_confirmed:    false,    // accounting not connected — operational ROI only
    roi_note:                'Operational savings confirmed. Net-margin confirmation unavailable — accounting not connected.',
  },

  // ─── V002 · Bar staffing Walnut Creek · MONITORING ────────────
  V002: {
    verification_id:   'V002',
    opportunity_id:    null,          // Walnut Creek bar — not linked to OPP-001
    action_id:         'A005',
    title:             'Bar staffing reduction · Walnut Creek',
    category:          'Labor',

    status:            'monitoring',  // NOT verified — cannot count in ROI yet
    monitoring_start:  '2026-04-28',
    monitoring_end:    '2026-05-24',  // projected close date
    required_monitoring_weeks: 4,
    weeks_completed:   3,

    pass_conditions: [
      'RPLH ≥ $36.50/hr for 4 consecutive Walnut Creek bar shift groups',
      'Guest complaints ≤ 2/wk throughout window',
      'Bar avg check ≥ $38.00',
      '7shifts providing fresh data',
    ],
    failed_conditions: [],   // none yet — monitoring in progress

    counter_metric_results: [
      // Week 1
      { week: 1, metric: 'RPLH', result: 'PASS', value: '$37.20/hr', threshold: '≥ $36.50', note: 'Week 1 confirmed ✓' },
      { week: 2, metric: 'RPLH', result: 'PASS', value: '$37.80/hr', threshold: '≥ $36.50', note: 'Week 2 confirmed ✓' },
      { week: 3, metric: 'RPLH', get result() { return SKC_STATE.metrics.bar_rplh_current >= SKC_STATE.metrics.bar_rplh_target ? 'PASS' : 'FAIL'; },
                                  get value()  { return '$' + SKC_STATE.metrics.bar_rplh_current.toFixed(2) + '/hr'; },
                                  threshold: '≥ $36.50', note: 'Week 3 in progress' },
      { week: 4, metric: 'RPLH', result: 'PENDING', value: '—', threshold: '≥ $36.50', note: 'Closes May 24' },
      { metric: 'Guest complaints', result: 'PASS', value: '0/wk', threshold: '≤ 2/wk', note: 'All weeks ✓' },
      { metric: 'Bar avg check',    result: 'PASS', value: '$41.20', threshold: '≥ $38.00', note: 'All weeks ✓' },
    ],

    verified_monthly_value: 0,         // $0 — NOT YET VERIFIED. Only counts after May 24 + all guardrails pass.
    active_recovery_value:  820,       // active recovery estimate (not the same as verified)
    confidence_score:       91,
    output_type:            'active_recovery',

    evidence_links: [
      { type: 'source', label: 'Toast POS · RPLH · Walnut Creek · ongoing', note: 'DET · direct' },
      { type: 'source', label: '7shifts · Schedule · Walnut Creek',          note: 'DET · direct (healthy)' },
    ],

    can_count_in_roi:  false,          // MUST remain false until monitoring closes
    accounting_confirmed: false,
    roi_note:          '$820/mo is ACTIVE RECOVERY — NOT counted in ROI. Monitoring week 3 of 4. Cannot count in ROI until May 24 and all 4 weeks pass all guardrails.',

    get monitoring_on_track() {
      return SKC_STATE.metrics.bar_rplh_current >= SKC_STATE.metrics.bar_rplh_target;
    },
    get weeks_remaining() {
      return this.required_monitoring_weeks - this.weeks_completed;
    },
  },

  // ─── V003 · Oakland labor · NOT STARTED ───────────────────────
  V003: {
    verification_id:   'V003',
    opportunity_id:    'OPP-001',
    action_id:         'A006',
    title:             'Remove 1 server · Oakland Tuesday dinner',
    category:          'Labor',

    status:            'not_started',  // action not yet created — monitoring not started
    monitoring_start:  null,
    monitoring_end:    null,
    required_monitoring_weeks: 2,
    weeks_completed:   0,

    pass_conditions: ACTIONS.A006.verification_rule.pass_conditions,
    failed_conditions: [],

    counter_metric_results: [],   // no results yet

    verified_monthly_value: 0,    // $0 — action not created, monitoring not started
    active_recovery_value:  0,
    confidence_score:       78,
    output_type:            'open_opportunity',

    evidence_links: [],

    can_count_in_roi: false,
    accounting_confirmed: false,
    roi_note: '$1,600/mo is OPEN OPPORTUNITY — est. monthly run-rate if Oakland Tue+Wed fixed and monitoring passes. Not active recovery and not verified. $0 counts in ROI today.',

    get blocked_by() { return ACTIONS.A006.verification_rule.blocked_by; },
    get can_start()  {
      return !this.blocked_by.length &&
             SKC_STATE.data_quality.sources.shifts.status === 'healthy';
    },
  },

  // ─── V004 · Salmon reprice · NOT STARTED ──────────────────────
  V004: {
    verification_id:   'V004',
    opportunity_id:    'OPP-002',
    action_id:         'A007',
    title:             'Reprice Grilled Salmon $24 → $27',
    category:          'Menu',

    status:            'not_started',
    monitoring_start:  null,
    monitoring_end:    null,
    required_monitoring_weeks: 3,
    weeks_completed:   0,

    pass_conditions: ACTIONS.A007.verification_rule.pass_conditions,
    failed_conditions: [],

    counter_metric_results: [],

    verified_monthly_value: 0,
    active_recovery_value:  0,
    confidence_score:       71,
    output_type:            'open_opportunity',

    evidence_links: [],

    can_count_in_roi: false,
    accounting_confirmed: false,
    roi_note: '$2,100/mo is OPEN OPPORTUNITY — est. run-rate if reprice holds and volume stays above 80 covers/week for 3 weeks. Requires owner approval and 3-week monitoring. $0 counts in ROI today.',

    get blocked_by() { return ACTIONS.A007.verification_rule.blocked_by; },
    get can_start()  { return !this.blocked_by.length; },
  },

  // ─── V005 · Throughput Berkeley · NOT STARTED ─────────────────
  V005: {
    verification_id:   'V005',
    opportunity_id:    'OPP-003',
    action_id:         'A008',
    title:             'Friday lunch line review · Berkeley',
    category:          'Throughput',

    status:            'not_started',
    monitoring_start:  null,
    monitoring_end:    null,
    required_monitoring_weeks: 3,
    weeks_completed:   0,

    pass_conditions: ACTIONS.A008.verification_rule.pass_conditions,
    failed_conditions: [],

    counter_metric_results: [],

    verified_monthly_value: 0,
    active_recovery_value:  0,
    confidence_score:       64,
    output_type:            'open_opportunity',

    evidence_links: [],

    can_count_in_roi: false,
    accounting_confirmed: false,
    roi_note: '$1,540/mo is OPEN OPPORTUNITY — est. run-rate IF line review identifies a fix, ticket time reaches ≤ 12 min, and 3 Fridays confirm it. The diagnostic itself produces $0 savings. KDS partial data reduces confidence to 64%.',

    get blocked_by() { return ACTIONS.A008.verification_rule.blocked_by; },
    get can_start()  { return SKC_STATE.data_quality.sources.kds.status !== 'missing'; },
  },
};

// ── ROI_STATE  —  canonical ROI object ───────────────────────────
//
//  Every Proof screen value, Report header, and ROI multiple must
//  read from here. No screen constructs its own ROI calculation.
//
const ROI_STATE = {

  // ── Core classification ──────────────────────────────────────
  //  verified_monthly_savings: only values where can_count_in_roi = true
  get verified_monthly_savings() {
    return Object.values(VERIFICATIONS)
      .filter(v => v.can_count_in_roi && v.verified_monthly_value > 0)
      .reduce((sum, v) => sum + v.verified_monthly_value, 0);
    // = $420 (V001 only)
  },

  //  active_recovery_value: monitoring in progress — NOT counted in ROI
  get active_recovery_value() {
    return Object.values(VERIFICATIONS)
      .filter(v => v.status === 'monitoring' && !v.can_count_in_roi)
      .reduce((sum, v) => sum + (v.active_recovery_value || 0), 0);
    // = $820 (V002 — bar staffing, wk 3/4)
  },

  //  open_opportunity_value: detected, not yet actioned — NOT counted in ROI
  get open_opportunity_value() {
    return OPPORTUNITIES.labor.impact.portfolio_monthly_impact
         + OPPORTUNITIES.salmon.impact.portfolio_monthly_impact
         + OPPORTUNITIES.throughput.impact.portfolio_monthly_impact
         + 1910  // bar pour cost variance (est.)
         + 1120  // server upsell gap (est.)
         + 760;  // overtime creep (est.)
    // = $3,200 + $2,100 + $1,540 + $1,910 (bar) + $1,120 (upsell) + $760 (OT) = $12,630
  },

  subscription_cost: 399,

  //  net_verified_gain: only verified recovery minus subscription
  get net_verified_gain() {
    return this.verified_monthly_savings - this.subscription_cost;
    // = $420 − $399 = $21
  },

  //  verified_roi_multiple: verified recovery ÷ subscription
  get verified_roi_multiple() {
    if (this.subscription_cost === 0) return '—';
    return (this.verified_monthly_savings / this.subscription_cost).toFixed(1);
    // = 1.4×
  },

  //  projected_roi_multiple: what ROI will be when V002 verifies
  get projected_roi_multiple() {
    const projected = this.verified_monthly_savings + VERIFICATIONS.V002.active_recovery_value;
    return (projected / this.subscription_cost).toFixed(1);
    // = (420 + 820) / 299 = 4.1×
  },

  //  accounting
  get accounting_connected() {
    return SKC_STATE.data_quality.sources.accounting.status === 'healthy' ||
           SKC_STATE.data_quality.sources.accounting.status === 'stale';
  },
  get margin_confirmation_available() {
    return this.accounting_connected;
  },

  // ── Display labels ────────────────────────────────────────────
  //  These are the ONLY labels Proof and Reports may use
  get labels() {
    return {
      verified:       this.verified_monthly_savings > 0
        ? '$' + this.verified_monthly_savings + '/mo · verified · counted in ROI'
        : '$0 · no verified recovery yet',
      active:         '$' + this.active_recovery_value + '/mo · active recovery · NOT counted in ROI',
      open:           '$' + this.open_opportunity_value + '/mo · open opportunity · NOT counted in ROI',
      subscription:   '$' + this.subscription_cost + '/mo · fixed subscription cost',
      net_gain:       (this.net_verified_gain >= 0 ? '+' : '') + '$' + Math.abs(this.net_verified_gain) + '/mo · net verified gain',
      roi_multiple:   this.verified_roi_multiple + '× · verified ROI',
      roi_projected:  this.projected_roi_multiple + '× · projected if A005 verifies',
      accounting_note: this.accounting_connected
        ? 'Margin-confirmed ROI available'
        : 'Operational savings shown · Accounting not connected · Net-margin confirmation unavailable',
    };
  },

  // ── Counter-metric doctrine ───────────────────────────────────
  //  Every optimised metric must have a registered counter-metric.
  //  A verified win is blocked if any counter-metric worsens.
  counter_metric_doctrine: {
    rules: [
      'Every SKC recommendation must register at least one counter-metric',
      'Counter-metrics are monitored simultaneously throughout the monitoring window',
      'A verified win is blocked if any counter-metric degrades beyond its threshold',
      'Counter-metric thresholds are non-negotiable — they cannot be overridden by presentation logic',
      'Proof and Reports must display counter-metric results alongside verified values',
    ],
    // Registered counter-metrics by category
    registered: {
      Labor: [
        { metric: 'Kitchen ticket time',  threshold: '≤ 16 min', rationale: 'Removing a server must not slow the kitchen' },
        { metric: 'Average check value',  threshold: '≥ $50.00', rationale: 'Service reduction must not reduce upsell' },
        { metric: 'Table turn time',      threshold: '≤ 52 min', rationale: 'Fewer servers must not compress turns' },
        { metric: 'Guest complaints',     threshold: '≤ 2/wk',   rationale: 'Service quality must be maintained' },
      ],
      Menu: [
        { metric: 'Item volume (covers/wk)', threshold: '≥ baseline × 0.85', rationale: 'Price increase must not collapse demand' },
        { metric: 'Item rating',             threshold: '≥ 4.3★',             rationale: 'Price increase must not reduce satisfaction' },
        { metric: 'Item refunds',            threshold: '≤ 3/wk',             rationale: 'Price increase must not cause rejection' },
      ],
      Throughput: [
        { metric: 'Ticket time (post-fix)', threshold: '≤ 12 min', rationale: 'Fix must demonstrably reduce ticket time' },
        { metric: 'Remake rate',            threshold: '< 3%',     rationale: 'Speed improvement must not cause quality errors' },
        { metric: 'Guest complaints',       threshold: '≤ 2/wk',   rationale: 'Throughput improvement must not reduce satisfaction' },
      ],
    },
    // Check if counter-metrics for an opportunity are passing
    check(category) {
      const verdict = SKC_STATE.guardrails.verdict();
      if (category === 'Labor') {
        return {
          all_pass: verdict !== 'blocked',
          monitoring: verdict === 'monitoring',
          blocked:    verdict === 'blocked',
          results: [
            { metric: 'Ticket time', value: SKC_STATE.metrics.ticket_time + ' min', status: SKC_STATE.guardrails.status('ticket_time') },
            { metric: 'Avg check',   value: '$' + SKC_STATE.metrics.avg_check.toFixed(2), status: SKC_STATE.guardrails.status('avg_check') },
            { metric: 'Table turns', value: SKC_STATE.metrics.table_turns + ' min', status: SKC_STATE.guardrails.status('table_turns') },
            { metric: 'Complaints',  value: SKC_STATE.metrics.complaints + '/wk', status: SKC_STATE.guardrails.status('complaints') },
          ],
        };
      }
      // Menu and Throughput share some guardrails
      return {
        all_pass:  verdict !== 'blocked',
        monitoring: verdict === 'monitoring',
        blocked:    verdict === 'blocked',
        results:   [],
      };
    },
  },

  // ── Summary for Proof screen ──────────────────────────────────
  get proof_summary() {
    const accountingNote = this.accounting_connected
      ? null
      : 'Accounting not connected — operational savings confirmed, but net-margin and prime cost impact cannot be calculated.';

    return {
      verified_savings:    this.verified_monthly_savings,   // counts in ROI
      active_recovery:     this.active_recovery_value,      // does NOT count
      open_opportunity:    this.open_opportunity_value,     // does NOT count
      subscription:        this.subscription_cost,
      net_gain:            this.net_verified_gain,
      roi_multiple:        this.verified_roi_multiple,
      roi_projected:       this.projected_roi_multiple,
      accounting_note:     accountingNote,
      // Verified wins list
      verified_wins: Object.values(VERIFICATIONS).filter(v => v.can_count_in_roi),
      // Active recovery list
      active_items:  Object.values(VERIFICATIONS).filter(v => v.status === 'monitoring' && !v.can_count_in_roi),
      // Open items
      open_items:    Object.values(VERIFICATIONS).filter(v => v.status === 'not_started'),
      // Counter-metric doctrine check
      counter_metrics_passing: this.counter_metric_doctrine.check('Labor').all_pass,
      counter_metrics_blocked: this.counter_metric_doctrine.check('Labor').blocked,
    };
  },
};

// ── Helpers ────────────────────────────────────────────────────
function getVerificationById(id) { return VERIFICATIONS[id] || null; }
function getVerificationByAction(action_id) {
  return Object.values(VERIFICATIONS).find(v => v.action_id === action_id) || null;
}
function getVerifiedWins() {
  return Object.values(VERIFICATIONS).filter(v => v.status === 'verified' && v.can_count_in_roi);
}
function getActiveRecoveries() {
  return Object.values(VERIFICATIONS).filter(v => v.status === 'monitoring' && !v.can_count_in_roi);
}
function getOpenOpportunities() {
  return Object.values(VERIFICATIONS).filter(v => v.status === 'not_started');
}

// ── renderVerificationCard(v) — HTML for one verification record ─
function renderVerificationCard(v) {
  const isVerified  = v.can_count_in_roi;
  const isMonitor   = v.status === 'monitoring';
  const isOpen      = v.status === 'not_started';
  const ot = v.output_type || 'open_opportunity';
  const chip = (typeof renderOutputChip === 'function') ? renderOutputChip(ot, v.confidence_score) : '';
  const fmt = (n) => (n > 0 ? '$' + n.toLocaleString() : '$0');

  // Status badge
  const statusBadge = isVerified
    ? '<span class="vc-status-badge ver">Verified ✓</span>'
    : isMonitor
    ? `<span class="vc-status-badge mon">Monitoring Wk ${v.weeks_completed}/${v.required_monitoring_weeks}</span>`
    : '<span class="vc-status-badge open">Not Started</span>';

  // Value display — strict about what counts
  const valueSection = `
    <div class="vc-value-grid">
      <div class="vc-value-cell ${isVerified ? 'vc-val-verified' : ''}">
        <div class="vc-val-label">Verified Savings</div>
        <div class="vc-val-num">${fmt(v.verified_monthly_value)}<span class="vc-val-period">/mo</span></div>
        <div class="vc-val-note">${isVerified ? 'Counted in ROI ✓' : 'Not verified — $0 counts in ROI'}</div>
      </div>
      ${isMonitor ? `<div class="vc-value-cell">
        <div class="vc-val-label">Active Recovery</div>
        <div class="vc-val-num">${fmt(v.active_recovery_value || 0)}<span class="vc-val-period">/mo</span></div>
        <div class="vc-val-note">Est. run-rate · NOT counted in ROI</div>
      </div>` : ''}
    </div>
    <div class="vc-roi-note">${v.roi_note || ''}</div>`;

  // Counter-metric results
  const cmResults = v.counter_metric_results.length
    ? `<div class="vc-counter-metrics">
        <div class="vc-cm-label">Counter-metric results</div>
        ${v.counter_metric_results.slice(0,5).map(r => {
          const st = typeof r.result === 'string' ? r.result : (r.result || 'PENDING');
          const cls = st === 'PASS' ? 'cm-pass' : st === 'FAIL' ? 'cm-fail' : 'cm-pending';
          const wkLabel = r.week ? `Wk ${r.week} · ` : '';
          return `<div class="vc-cm-row ${cls}">
            <span class="vc-cm-icon">${st === 'PASS' ? '✓' : st === 'FAIL' ? '✗' : '–'}</span>
            <span class="vc-cm-metric">${wkLabel}${r.metric}</span>
            <span class="vc-cm-val">${typeof r.value === 'function' ? r.value() : r.value}</span>
            <span class="vc-cm-threshold">${r.threshold}</span>
            <span class="vc-cm-note">${r.note || ''}</span>
          </div>`;
        }).join('')}
      </div>` : '';

  // Blockers
  const blockers = v.blocked_by || [];
  const blockerHtml = blockers.length
    ? `<div class="vc-blockers">${blockers.map(b => `<div class="vc-blocker-item">⛔ ${b}</div>`).join('')}</div>`
    : '';

  return `<div class="vc-card ${isVerified ? 'vc-card-verified' : isMonitor ? 'vc-card-monitor' : 'vc-card-open'}">
    <div class="vc-card-header">
      <div class="vc-card-header-left">
        ${statusBadge} ${chip}
        <span class="vc-card-id">${v.verification_id}</span>
      </div>
    </div>
    <div class="vc-card-title">${v.title}</div>
    <div class="vc-card-meta">
      ${v.monitoring_start ? `<span class="vc-meta-item">Started ${v.monitoring_start}</span>` : ''}
      ${v.monitoring_end ? `<span class="vc-meta-item">${isVerified ? 'Closed' : 'Closes'} ${v.monitoring_end}</span>` : ''}
      ${v.action_id ? `<span class="vc-meta-item">Action <span class="mono">${v.action_id}</span></span>` : ''}
    </div>
    ${valueSection}
    ${cmResults}
    ${blockerHtml}
    ${v.accounting_confirmed === false && isVerified
      ? `<div class="vc-accounting-note">Accounting not connected — operational savings confirmed, margin impact not calculated.</div>`
      : ''}
  </div>`;
}

// ── renderROISummary() — HTML for the full ROI summary panel ────
function renderROISummary() {
  const roi = ROI_STATE;
  const ps  = roi.proof_summary;
  const doc = roi.counter_metric_doctrine;
  const fmt = (n) => '$' + n.toLocaleString();

  const accountingBanner = !roi.accounting_connected
    ? `<div class="dq-banner info" style="margin-bottom:16px">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>Accounting not connected — showing operational ROI. Net-margin and prime-cost confirmation unavailable. <button class="dq-banner-cta" onclick="showScreen('settings',null,'Data Quality')">Connect Accounting</button></span>
      </div>`
    : '';

  const cmVerdict = doc.check('Labor');
  const cmBanner = cmVerdict.blocked
    ? `<div class="dq-banner critical" style="margin-bottom:16px">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span>Counter-metric violation — one or more guardrails are failing. No new verified wins can be confirmed until all guardrails pass.</span>
      </div>`
    : cmVerdict.monitoring
    ? `<div class="dq-banner warn" style="margin-bottom:12px">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span>Counter-metrics at Watch — table turns ${SKC_STATE.metrics.table_turns} min (limit 52 min). Monitoring window open; no verified wins blocked yet.</span>
      </div>`
    : '';

  const valueCards = `
    <div class="roi-summary-grid">
      <div class="roi-sum-card roi-sum-verified">
        <div class="roi-sum-label">Verified Monthly Savings</div>
        <div class="roi-sum-val">${fmt(ps.verified_savings)}<span class="roi-sum-period">/mo</span></div>
        <div class="roi-sum-sub">${renderOutputChip('verified', null)} Counted in ROI</div>
      </div>
      <div class="roi-sum-card roi-sum-active">
        <div class="roi-sum-label">Active Recovery</div>
        <div class="roi-sum-val">${fmt(ps.active_recovery)}<span class="roi-sum-period">/mo</span></div>
        <div class="roi-sum-sub">${renderOutputChip('active_recovery', null)} Monitoring · NOT counted in ROI</div>
      </div>
      <div class="roi-sum-card roi-sum-open">
        <div class="roi-sum-label">Open Weekly Exposure</div>
        <div class="roi-sum-val">${fmt(ps.open_opportunity)}<span class="roi-sum-period">/mo</span></div>
        <div class="roi-sum-sub">${renderOutputChip('open_opportunity', null)} Est. run-rate · NOT counted in ROI</div>
      </div>
      <div class="roi-sum-card roi-sum-sub">
        <div class="roi-sum-label">Subscription Cost</div>
        <div class="roi-sum-val">${fmt(ps.subscription)}<span class="roi-sum-period">/mo</span></div>
        <div class="roi-sum-sub">${renderOutputChip('deterministic', null)} Fixed monthly cost</div>
      </div>
    </div>`;

  const roiNumbers = `
    <div class="roi-multiple-row">
      <div class="roi-mult-item">
        <div class="roi-mult-label">Net verified gain</div>
        <div class="roi-mult-val ${ps.net_gain >= 0 ? 'text-green' : 'text-red'}">${ps.net_gain >= 0 ? '+' : ''}${fmt(ps.net_gain)}/mo</div>
        <div class="roi-mult-note">Only counting verified recovery</div>
      </div>
      <div class="roi-mult-item">
        <div class="roi-mult-label">Verified ROI</div>
        <div class="roi-mult-val text-green">${ps.roi_multiple}×</div>
        <div class="roi-mult-note">${fmt(ps.verified_savings)} ÷ ${fmt(ps.subscription)}</div>
      </div>
      <div class="roi-mult-item">
        <div class="roi-mult-label">Potential ROI (unverified)</div>
        <div class="roi-mult-val" style="color:var(--blue)">${ps.roi_projected}×</div>
        <div class="roi-mult-note">If A005 verifies May 24</div>
      </div>
    </div>
    ${ps.accounting_note ? `<div class="roi-accounting-note">${ps.accounting_note}</div>` : ''}`;

  const doctrineBox = `
    <div class="roi-doctrine-box">
      <div class="roi-doctrine-title">Counter-Metric Doctrine</div>
      <div class="roi-doctrine-rules">
        ${doc.rules.map(r => `<div class="roi-doctrine-rule">· ${r}</div>`).join('')}
      </div>
    </div>`;

  return accountingBanner + cmBanner + valueCards + roiNumbers + doctrineBox;
}



'use strict';


// ═══════════════════════════════════════════════════════════════
//  FORMAT & CALCULATE FUNCTIONS
//
//  All dollar values in the UI must flow through these functions.
//  Every value is labelled with:
//    - time basis (/service, /wk, /mo run-rate, verified /mo)
//    - status     (estimated, active recovery, verified, not in ROI)
//    - scope      (per-location, portfolio, per-plate)
// ═══════════════════════════════════════════════════════════════

// ── Core formatters ────────────────────────────────────────────
function formatCurrency(n) {
  if (typeof n !== 'number' || isNaN(n)) return '$—';
  return '$' + Math.round(n).toLocaleString();
}
function formatCurrencyExact(n, decimals = 2) {
  if (typeof n !== 'number' || isNaN(n)) return '$—';
  return '$' + n.toFixed(decimals);
}
function formatMonthly(n, status = 'estimated') {
  // status: 'estimated' | 'active-recovery' | 'verified' | 'open'
  const labels = {
    'estimated':      'est. run-rate/mo',
    'active-recovery':'active recovery/mo · not counted yet',
    'verified':       'verified/mo · counted in ROI',
    'open':           'open weekly exposure · not counted yet',
  };
  return formatCurrency(n) + '/mo ' + (labels[status] || 'est. run-rate/mo');
}
function formatWeekly(n) {
  return formatCurrency(n) + '/wk';
}
function formatPerService(n, unit = 'service') {
  // unit: 'service' | 'shift' | 'plate' | 'dinner' | 'Friday'
  if (n < 10) return formatCurrencyExact(n) + '/' + unit;
  return formatCurrency(n) + '/' + unit;
}
function formatRunRate(n) {
  return formatCurrency(n) + '/mo est. run-rate';
}
function formatVerifiedValue(n) {
  return formatCurrency(n) + '/mo verified · counted in ROI';
}

// ── Calculation functions — all read from OPPORTUNITIES / SKC_STATE ────
function calculateLaborOpportunity(opp) {
  // opp = OPPORTUNITIES.labor
  const calc = opp.calculation;
  const f    = calc.formula_inputs;
  const imp  = opp.impact;
  return {
    per_service:           f.excess_hours_per_service * f.wage_blended,
    weekly_exposure:       f.excess_hours_per_service * f.wage_blended * f.services_per_week,
    monthly_run_rate:      f.excess_hours_per_service * f.wage_blended * f.services_per_week * f.weeks_per_month,
    monthly_open:          imp.monthly_open_opportunity,
    monthly_portfolio:     imp.portfolio_monthly_impact,
    monthly_active:        imp.monthly_active_recovery,
    monthly_verified:      imp.monthly_verified_savings,
    counted_in_roi:        imp.counted_in_verified_roi,
    formula_line_1:        `${f.excess_hours_per_service} excess hrs/service × ${formatCurrencyExact(f.wage_blended)}/hr = ${formatCurrency(f.excess_hours_per_service * f.wage_blended)}/service`,
    formula_line_2:        `${formatCurrency(f.excess_hours_per_service * f.wage_blended)}/service × ${f.services_per_week} services/wk = ${formatWeekly(f.excess_hours_per_service * f.wage_blended * f.services_per_week)}`,
    formula_line_3:        `${formatWeekly(f.excess_hours_per_service * f.wage_blended * f.services_per_week)} × ${f.weeks_per_month} wks = ${formatRunRate(Math.round(f.excess_hours_per_service * f.wage_blended * f.services_per_week * f.weeks_per_month))}`,
  };
}

function calculateSalmonOpportunity(opp) {
  // opp = OPPORTUNITIES.salmon
  const f   = opp.calculation.formula_inputs;
  const imp = opp.impact;
  const per_plate        = f.cm_gap_per_plate;
  const weekly_run_rate  = per_plate * f.covers_per_week;
  const monthly_raw      = weekly_run_rate * f.weeks_per_month;
  const monthly_buffered = monthly_raw * f.volume_buffer;
  return {
    per_service:      per_plate,            // per plate (per_service for menu = per plate)
    weekly_exposure:  weekly_run_rate,
    monthly_run_rate: monthly_raw,
    monthly_open:     imp.monthly_open_opportunity,
    counted_in_roi:   imp.counted_in_verified_roi,
    formula_line_1:   `CM gap: ${formatCurrencyExact(per_plate)}/plate × ${f.covers_per_week} covers/wk = ${formatWeekly(Math.round(weekly_run_rate))}`,
    formula_line_2:   `${formatWeekly(Math.round(weekly_run_rate))} × ${f.weeks_per_month} wks = ${formatCurrency(Math.round(monthly_raw))}/mo raw`,
    formula_line_3:   `${formatCurrency(Math.round(monthly_raw))}/mo × ${f.volume_buffer} volume buffer = ${formatRunRate(imp.monthly_open_opportunity)}`,
  };
}

function calculateThroughputOpportunity(opp) {
  const f   = opp.calculation.formula_inputs;
  const imp = opp.impact;
  const lost_turns           = (f.ticket_excess_min * f.avg_covers) / f.avg_turn_duration;
  const revenue_per_service  = lost_turns * f.avg_party_size * f.avg_check;
  const weekly               = revenue_per_service * f.affected_services;  // 1 service/wk
  const monthly_raw          = weekly * f.weeks_per_month;
  const monthly_buffered     = monthly_raw * f.buffer;
  return {
    per_service:      Math.round(revenue_per_service),
    weekly_exposure:  Math.round(revenue_per_service),  // 1 service/wk
    monthly_run_rate: Math.round(monthly_raw),
    monthly_open:     imp.monthly_open_opportunity,
    counted_in_roi:   imp.counted_in_verified_roi,
    formula_line_1:   `(${f.ticket_excess_min} excess min × ${f.avg_covers} covers) ÷ ${f.avg_turn_duration} min avg turn = ${lost_turns.toFixed(1)} lost turns/service`,
    formula_line_2:   `${lost_turns.toFixed(1)} turns × ${f.avg_party_size} avg party × ${formatCurrencyExact(f.avg_check)} check = ${formatCurrency(Math.round(revenue_per_service))}/service`,
    formula_line_3:   `${formatCurrency(Math.round(revenue_per_service))}/service × 4 Fridays × ${f.buffer} buffer = ${formatRunRate(imp.monthly_open_opportunity)}`,
  };
}

function calculateVerifiedROI() {
  const roi = SKC_STATE.roi;
  return {
    verified:      roi.verified,
    subscription:  roi.subscription,
    net_gain:      roi.net_gain,
    roi_multiple:  roi.roi_multiple,
    is_positive:   roi.verified > roi.subscription,
  };
}

// ═══════════════════════════════════════════════════════════════
//  getFinancialTruth(item) — CANONICAL FINANCIAL TRUTH LAYER
//
//  Every dollar in SKC must have:
//    amount · time basis · scope · status · source · confidence · ROI eligibility
//
//  DOCTRINE (immutable):
//  · SKC verifies impact by service, day, and week.
//  · Monthly values are run-rate projections or equivalents — never automatically verified.
//  · Weekly × 4.33 ≠ monthly when different scopes or volume buffers apply.
//    When they differ, both the weekly and monthly must carry explicit scope labels.
//  · Open Exposure does not count in ROI.
//  · Active Recovery does not count in ROI until its monitoring window closes clean.
//  · Verified Savings is the only status counted in ROI, and only when
//    counted_in_verified_roi is true on the source object.
//
//  TIME BASIS LABELS (canonical):
//    PER AFFECTED SERVICE · PER SHIFT · PER PLATE · PER FRIDAY SERVICE
//    THIS WEEK · WEEKLY EXPOSURE · MONTHLY RUN-RATE PROJECTION · MONTHLY RUN-RATE EQUIVALENT
//
//  STATUS LABELS (canonical):
//    'Open Exposure' · 'Active Recovery' · 'Verified Savings' · 'Blocked Value' · 'Needs Data'
//
//  SCOPE LABELS (canonical — always attach to every displayed amount):
//    'per affected service' · 'per location' · 'Oakland only' · 'Berkeley only'
//    'Oakland + Berkeley' · 'All Locations' · 'portfolio' · 'per plate'
//
//  @param item   An OPPORTUNITIES[key] or ACTIONS[key] or VERIFICATIONS[key] object
//  @returns      FinancialTruth object (see shape below)
// ═══════════════════════════════════════════════════════════════

function getFinancialTruth(item) {
  // ── Resolve source object type ─────────────────────────────────
  const isOpp    = !!item.opportunity_id;
  const isAction = !!item.action_id && !item.opportunity_id;
  const isVerif  = !!item.verification_id;

  // ── Pull raw fields ────────────────────────────────────────────
  const imp = isOpp    ? item.impact
            : isAction ? item.expected_impact
            : null;   // verifications don't have an impact block

  const cat       = item.category       || '';
  const location  = item.location_name  || 'Unknown';
  const status    = item.status         || '';
  const confidence = typeof item.confidence_score === 'function'
    ? item.confidence_score()
    : (item.confidence_score ?? item.confidence ?? null);
  const source_data = item.source_data || item.data_health || null;

  // ── Determine canonical status label ──────────────────────────
  let status_canonical;
  if (isVerif) {
    status_canonical = item.can_count_in_roi ? 'Verified Savings' : 'Active Recovery';
  } else if (imp?.counted_in_verified_roi) {
    status_canonical = 'Verified Savings';
  } else if (status === 'Active Recovery' || status === 'monitoring' || status === 'assigned') {
    status_canonical = 'Active Recovery';
  } else if (status === 'Detected' || status === 'proposed' || status === 'open') {
    status_canonical = 'Open Exposure';
  } else if (!source_data || (source_data.missing_sources && source_data.missing_sources.length > 0)) {
    status_canonical = 'Needs Data';
  } else {
    status_canonical = 'Open Exposure';
  }

  // ── ROI eligibility ────────────────────────────────────────────
  const roi_counted = isVerif
    ? item.can_count_in_roi
    : (imp?.counted_in_verified_roi ?? false);

  // ── Per-service values ─────────────────────────────────────────
  const per_service_amount = imp?.per_service_impact ?? null;
  const per_service_unit   = cat === 'Menu'       ? 'per plate'
                           : cat === 'Throughput' ? 'per Friday lunch service'
                           :                        'per dinner service';
  const per_service_scope  = item.location_name || 'per location';
  const per_service_label  = per_service_amount !== null
    ? `PER AFFECTED SERVICE — ${per_service_scope}`
    : null;

  // ── Weekly exposure ────────────────────────────────────────────
  const affected_services_per_week = imp?.affected_services_per_week ?? null;
  const weekly_exposure            = imp?.weekly_exposure ?? null;
  // Scope note for weekly — critical for preventing cross-scope confusion
  const weekly_scope = item.location_name
    ? `${item.location_name}${affected_services_per_week ? ` · ${affected_services_per_week} service${affected_services_per_week !== 1 ? 's' : ''}/wk` : ''}`
    : '';
  const weekly_label = weekly_exposure !== null
    ? `WEEKLY EXPOSURE — ${weekly_scope}`
    : null;

  // ── Monthly run-rate projection ────────────────────────────────
  // IMPORTANT: Monthly values are scope-adjusted projections.
  // They should NOT be assumed to equal weekly × 4.33 unless the same scope applies.
  // Labor: monthly uses per-location or portfolio scope with scheduling overhead.
  // Salmon: monthly uses 85% volume buffer.
  // Throughput: monthly is $1,540 ≈ $384/service × 4 Fridays × buffer.
  const monthly_run_rate_projection = imp?.monthly_run_rate ?? imp?.monthly_run_rate?.valueOf?.() ?? null;
  const monthly_open                = imp?.monthly_open_opportunity ?? null;
  const monthly_scope_note = (weekly_exposure && monthly_open)
    ? _buildMonthlyScopeNote(item, weekly_exposure, monthly_open)
    : '';
  const monthly_label = monthly_open !== null
    ? `MONTHLY RUN-RATE PROJECTION — ${monthly_scope_note}`
    : null;

  // ── Active recovery ────────────────────────────────────────────
  const monthly_active_recovery = imp?.monthly_active_recovery ?? 0;
  const weekly_active_recovery  = monthly_active_recovery > 0
    ? Math.round(monthly_active_recovery / 4.33)
    : 0;

  // ── Verified savings ───────────────────────────────────────────
  // Only populated when counted_in_verified_roi is true on the source object.
  const monthly_verified = imp?.monthly_verified_savings ?? (isVerif && item.can_count_in_roi ? item.verified_monthly_value : 0);
  const monthly_verified_run_rate_equivalent = monthly_verified > 0 ? monthly_verified : 0;
  const weekly_verified_equivalent           = monthly_verified_run_rate_equivalent > 0
    ? Math.round(monthly_verified_run_rate_equivalent / 4.33)
    : 0;

  // ── Blocked value ──────────────────────────────────────────────
  const blocked_value_monthly = status_canonical === 'Blocked Value'
    ? (monthly_open || 0)
    : 0;
  const blocked_value_weekly  = blocked_value_monthly > 0
    ? Math.round(blocked_value_monthly / 4.33)
    : 0;

  // ── Source and confidence summary ──────────────────────────────
  const sources_healthy  = source_data?.healthy_sources  ?? [];
  const sources_stale    = source_data?.stale_sources    ?? [];
  const sources_degraded = source_data?.degraded_sources ?? [];
  const sources_missing  = source_data?.missing_sources  ?? [];
  const dq_warning       = source_data?.dq_warning       ?? null;

  // ── Pre-formatted display strings ─────────────────────────────
  const fmt = {
    per_service: per_service_amount !== null
      ? formatPerService(per_service_amount, per_service_unit) + ` · ${per_service_scope}`
      : null,
    weekly: weekly_exposure !== null
      ? formatWeekly(weekly_exposure) + ` · ${weekly_scope}`
      : null,
    monthly_projection: monthly_open !== null
      ? formatCurrency(monthly_open) + '/mo run-rate projection · ' + monthly_scope_note
      : null,
    monthly_active: monthly_active_recovery > 0
      ? formatCurrency(monthly_active_recovery) + '/mo · active recovery · NOT counted in ROI'
      : '$0 · not in active recovery',
    monthly_verified: monthly_verified_run_rate_equivalent > 0
      ? formatCurrency(monthly_verified_run_rate_equivalent) + '/mo run-rate equivalent · counted in ROI ✓'
      : '$0 · not verified',
    roi_status: roi_counted
      ? 'COUNTED IN ROI ✓'
      : status_canonical === 'Active Recovery'
      ? 'NOT counted in ROI — monitoring in progress'
      : 'NOT counted in ROI',
  };

  return {
    // Identity
    id:         item.opportunity_id || item.action_id || item.verification_id || null,
    category:   cat,
    label:      item.title || '',
    location:   location,
    scope:      per_service_scope,
    daypart:    item.daypart || null,

    // Status
    status:              status_canonical,
    status_raw:          status,
    roi_counted:         roi_counted,

    // Source
    confidence:          confidence,
    sources_healthy:     sources_healthy,
    sources_stale:       sources_stale,
    sources_degraded:    sources_degraded,
    sources_missing:     sources_missing,
    dq_warning:          dq_warning,

    // Per-service
    per_service_amount:  per_service_amount,
    per_service_unit:    per_service_unit,
    per_service_label:   per_service_label,

    // Weekly
    affected_services_per_week: affected_services_per_week,
    weekly_exposure:             weekly_exposure,
    weekly_label:                weekly_label,
    weekly_active_recovery:      weekly_active_recovery,

    // Monthly — always labeled as projection or equivalent
    monthly_run_rate_projection:        monthly_run_rate_projection,
    monthly_open:                       monthly_open,
    monthly_label:                      monthly_label,
    monthly_scope_note:                 monthly_scope_note,
    active_recovery_weekly:             weekly_active_recovery,
    active_recovery_monthly_projection: monthly_active_recovery,

    // Verified
    verified_weekly_equivalent:          weekly_verified_equivalent,
    verified_monthly_run_rate_equivalent: monthly_verified_run_rate_equivalent,

    // Blocked
    blocked_value_weekly:             blocked_value_weekly,
    blocked_value_monthly_projection: blocked_value_monthly,

    // Pre-formatted display strings (use these in UI, never format inline)
    fmt,
  };
}

// ── Internal: build monthly scope note explaining why weekly×4.33 ≠ monthly ──
function _buildMonthlyScopeNote(item, weekly_exposure, monthly_open) {
  const wk_x_433 = Math.round(weekly_exposure * 4.33);
  const diff      = Math.abs(wk_x_433 - monthly_open);
  const pct       = diff / monthly_open;
  const cat       = item.category || '';

  if (pct < 0.05) {
    // Close enough — simple projection
    return `${item.location_name} · ${formatCurrency(weekly_exposure)}/wk × 4.33 wks`;
  }
  if (cat === 'Menu') {
    return `${item.location_name} · volume-buffered (85% retention) · ${formatCurrency(weekly_exposure)}/wk × 4.33 × 0.85`;
  }
  if (cat === 'Labor') {
    return `${item.location_name} · ${formatCurrency(weekly_exposure)}/wk × 4.33 (portfolio run-rate)`;
  }
  if (cat === 'Throughput') {
    return `${item.location_name} · conservative buffer applied · ${formatCurrency(item.impact?.monthly_open_opportunity || monthly_open)}/mo`;
  }
  return `${item.location_name} · scope-adjusted projection`;
}

// ── getPortfolioTruth() — aggregate across all three open opportunities ───────
//
//  IMPORTANT: The portfolio weekly sum ($1,243/wk) and portfolio monthly sum ($6,840/mo)
//  are DIFFERENT SCOPES. Do not derive one from the other by multiplying/dividing.
//
//  weekly_exposure_total:   Raw sum of individual weekly exposures.
//                           Each weekly value uses the same scope as its opportunity.
//                           $370/wk (labor both locs) + $519/wk (salmon all locs) + $356/wk (Berkeley) = $1,243/wk
//
//  monthly_projection_total: Sum of individual monthly run-rate projections.
//                           Each monthly uses scope-adjusted, volume-buffered projections.
//                           $3,200/mo (labor both) + $2,100/mo (salmon buffered) + $1,540/mo (throughput buffered) = $6,840/mo
//
//  These two totals intentionally do NOT satisfy weekly × 4.33 = monthly.
//  The $1,457 gap ($6,840 − $1,243×4.33 = $1,458) comes from volume buffers and scope adjustments.
//  Any UI displaying both must label them as separate calculations with different bases.

function getPortfolioTruth() {
  const opps    = [OPPORTUNITIES.labor, OPPORTUNITIES.salmon, OPPORTUNITIES.throughput];
  const truths  = opps.map(getFinancialTruth);

  const weekly_total   = truths.reduce((s, t) => s + (t.weekly_exposure || 0), 0);
  const monthly_total  = truths.reduce((s, t) => s + (t.monthly_open || 0), 0);
  const wk_x_433       = Math.round(weekly_total * 4.33);

  return {
    opportunities:       truths,
    weekly_exposure_total:        weekly_total,     // $1,243/wk — sum of per-opp weekly values
    monthly_projection_total:     monthly_total,    // $6,840/mo — sum of scope-adjusted projections
    weekly_x_433:                 wk_x_433,         // $5,382 — NOT the same as monthly_projection_total
    scope_delta:                  monthly_total - wk_x_433,  // $1,458 — volume buffers + scope adjustments
    weekly_label:   `WEEKLY EXPOSURE — portfolio total · ${truths.length} opportunities · raw sum`,
    monthly_label:  `MONTHLY RUN-RATE PROJECTIONS — portfolio total · scope-adjusted · volume-buffered`,
    warning:        `$${weekly_total}/wk × 4.33 = $${wk_x_433}/mo, NOT $${monthly_total}/mo. ` +
                    `The $${monthly_total - wk_x_433} gap is from volume buffers and scope adjustments. ` +
                    `Label both values with their basis when displaying together.`,
    // ROI summary (reads from ROI_STATE — single source of truth)
    verified_monthly:    ROI_STATE.verified_monthly_savings,   // $420 — counted in ROI
    active_monthly:      ROI_STATE.active_recovery_value,      // $820 — NOT counted
    subscription:        ROI_STATE.subscription_cost,          // $299
    net_gain:            ROI_STATE.net_verified_gain,          // $121
    roi_multiple:        ROI_STATE.verified_roi_multiple,      // 1.4×
  };
}

// ── getVerifiedTruth() — what is actually confirmed ───────────────────────────
//  "Verified this week" = confirmed during this review period.
//  It does NOT mean $420 was recovered during this specific calendar week.
//  $420 is the monthly run-rate equivalent — the annualised run-rate of the confirmed win.
//  Weekly equivalent: $420/mo ÷ 4.33 = ~$97/wk.

function getVerifiedTruth() {
  const wins = getVerifiedWins();  // V001 only currently
  const total_monthly = ROI_STATE.verified_monthly_savings;  // $420

  return {
    wins,
    // $420/mo is the run-rate equivalent — NOT a weekly amount
    verified_monthly_run_rate_equivalent:  total_monthly,
    verified_weekly_equivalent:            Math.round(total_monthly / 4.33),  // $97/wk
    label_weekly:   `VERIFIED — weekly run-rate equivalent · ${Math.round(total_monthly / 4.33)}/wk`,
    label_monthly:  `VERIFIED — monthly run-rate equivalent · $${total_monthly}/mo · counted in ROI`,
    // "Verified this week/period" = confirmed during this reporting period
    // Use "Verified this period" to avoid implying $420 is a weekly amount.
    confirmed_this_period: wins.length > 0,
    period_label:   'May 11–17',
  };
}



function calculateNetGain() {
  return SKC_STATE.roi.verified - SKC_STATE.roi.subscription;
}

function calculateConfidenceAdjustedValue(base_value, confidence_score) {
  // Returns the confidence-weighted value for display purposes
  // This is NOT what we display as the estimate (we display the canonical value)
  // It's used to explain the confidence range
  const low  = Math.round(base_value * (confidence_score / 100) * 0.85);
  const high = Math.round(base_value * (confidence_score / 100) * 1.15);
  return { low, high, midpoint: Math.round((low + high) / 2) };
}

function calculateTimeBasisImpact(opp) {
  // Unified time-basis breakdown for any opportunity
  // Returns an object with per_service, weekly, monthly_run_rate, open, verified
  const imp = opp.impact;
  const cat = opp.category;
  let calc;
  if (cat === 'Labor')      calc = calculateLaborOpportunity(opp);
  else if (cat === 'Menu')  calc = calculateSalmonOpportunity(opp);
  else                       calc = calculateThroughputOpportunity(opp);

  return {
    per_service:        calc.per_service,
    per_service_label:  cat === 'Menu' ? 'per plate' : cat === 'Throughput' ? 'per Friday service' : 'per dinner service',
    services_per_week:  imp.affected_services_per_week,
    services_label:     imp.affected_services_basis,
    weekly_exposure:    imp.weekly_exposure,
    monthly_run_rate:   imp.monthly_run_rate,
    monthly_open:       imp.monthly_open_opportunity,
    monthly_active:     imp.monthly_active_recovery,
    monthly_verified:   imp.monthly_verified_savings,
    counted_in_roi:     imp.counted_in_verified_roi,
    // Pre-formatted display strings
    fmt_per_service:    formatPerService(calc.per_service, cat === 'Menu' ? 'plate' : cat === 'Throughput' ? 'Friday lunch service' : 'dinner service'),
    fmt_weekly:         formatWeekly(imp.weekly_exposure),
    fmt_run_rate:       formatRunRate(imp.monthly_run_rate),
    fmt_open:           formatMonthly(imp.monthly_open_opportunity, 'open'),
    fmt_active:         imp.monthly_active_recovery > 0 ? formatMonthly(imp.monthly_active_recovery, 'active-recovery') : '$0 · not yet in active recovery',
    fmt_verified:       imp.monthly_verified_savings > 0 ? formatVerifiedValue(imp.monthly_verified_savings) : '$0 verified · not counted in ROI',
    // Formula lines for display
    formula_lines:      [calc.formula_line_1, calc.formula_line_2, calc.formula_line_3],
  };
}

// ── Impact label renderer — HTML string for any screen ────────
function renderImpactLabel(opp, mode = 'card') {
  // mode: 'card' | 'hero' | 'table' | 'inline'
  const tb = calculateTimeBasisImpact(opp);
  const roi_label = tb.counted_in_roi
    ? '<span class="impact-roi-yes">Counted in ROI</span>'
    : '<span class="impact-roi-no">Not counted in ROI</span>';

  if (mode === 'inline') {
    return `${formatRunRate(tb.monthly_run_rate)} · ${roi_label}`;
  }
  if (mode === 'table') {
    return `<span class="mono">${formatCurrency(tb.monthly_open)}/mo</span><br><span class="impact-basis-sm">${tb.fmt_per_service} · ${tb.services_per_week} services/wk</span>`;
  }
  if (mode === 'hero') {
    return `
      <div class="impact-hero-val">${formatCurrency(tb.monthly_run_rate)}<span class="impact-hero-suffix">/mo est. run-rate</span></div>
      <div class="impact-chain">
        <span class="impact-chain-item"><span class="impact-chain-label">Per service</span><span class="impact-chain-val">${tb.fmt_per_service}</span></span>
        <span class="impact-chain-x">×</span>
        <span class="impact-chain-item"><span class="impact-chain-label">Services/wk</span><span class="impact-chain-val">${tb.services_per_week}</span></span>
        <span class="impact-chain-x">×</span>
        <span class="impact-chain-item"><span class="impact-chain-label">4.33 wks</span><span class="impact-chain-val">${formatCurrency(tb.monthly_run_rate)}/mo</span></span>
      </div>
      <div class="impact-roi-status">${roi_label}</div>`;
  }
  // mode === 'card' (default)
  return `
    <div class="impact-card-val">${formatCurrency(tb.monthly_open)}<span class="impact-card-suffix">/mo</span></div>
    <div class="impact-chain-sm">
      <span>${tb.fmt_per_service}</span>
      <span class="impact-chain-dot">·</span>
      <span>${tb.services_per_week} services/wk</span>
      <span class="impact-chain-dot">·</span>
      <span>${tb.fmt_weekly}</span>
    </div>
    <div class="impact-roi-badge">${roi_label}</div>`;
}


// ═══════════════════════════════════════════════════════════════
//  IMPACT DISPLAY LAYER
//
//  Six helpers that standardise how financial impact is shown.
//  All six read exclusively from OPPORTUNITIES fields — no new math.
//  Use these instead of scattering custom formatting across HTML.
//
//  Usage:
//    const bd = getImpactBreakdown(OPPORTUNITIES.labor);
//    card.innerHTML = renderPrimaryImpact(OPPORTUNITIES.labor, 'recovery_card');
//    note.textContent = renderTimeBasisNote(OPPORTUNITIES.labor);
// ═══════════════════════════════════════════════════════════════

// ── 1. getImpactBreakdown(opp) ────────────────────────────────
//  Returns a plain data object — all values from OPPORTUNITIES.impact.
//  Derives weekly/monthly only when a field is genuinely absent.
function getImpactBreakdown(opp) {
  if (!opp || !opp.impact) return null;
  const imp = opp.impact;
  const cat = opp.category || '';

  // Per-service label — canonical from the opportunity category
  const perServiceLabelMap = {
    Labor:      'per dinner service',
    Menu:       'per plate',
    Throughput: 'per Friday service',
  };
  const perServiceLabel = perServiceLabelMap[cat] || 'per service';

  // Weekly label derived from affected_services_basis if present
  const weeklyLabel = imp.affected_services_basis
    ? imp.weekly_basis || imp.affected_services_basis
    : `${imp.affected_services_per_week || '?'} service(s)/wk`;

  // Monthly run-rate label
  const monthlyRunRateLabel = imp.monthly_run_rate_basis || 'weekly exposure × 4.33 wks/mo';

  // Derive weekly if missing (should not happen but defensive)
  const weeklyExposure = (imp.weekly_exposure != null)
    ? imp.weekly_exposure
    : (imp.per_service_impact || 0) * (imp.affected_services_per_week || 1);

  // Derive monthly run-rate if missing
  const monthlyRunRate = (imp.monthly_run_rate != null)
    ? imp.monthly_run_rate
    : weeklyExposure * 4.33;

  return {
    perServiceImpact:       imp.per_service_impact,
    perServiceLabel,
    affectedServicesPerWeek: imp.affected_services_per_week,
    weeklyExposure,
    weeklyLabel,
    monthlyRunRate,
    monthlyRunRateLabel,
    monthlyOpenOpportunity: imp.monthly_open_opportunity,
    monthlyActiveRecovery:  imp.monthly_active_recovery,
    monthlyVerifiedSavings: imp.monthly_verified_savings,
    verifiedSavings:        imp.monthly_verified_savings,   // alias for clarity
    activeRecovery:         imp.monthly_active_recovery,    // alias for clarity
    countedInVerifiedROI:   imp.counted_in_verified_roi,
    confidenceScore:        opp.confidence_score,
    outputType:             opp.output_type || 'open_opportunity',
    status:                 opp.status || 'Detected',
    category:               cat,
  };
}

// ── 2. renderPrimaryImpact(opp, context) ──────────────────────
//  Returns an HTML string for the primary impact display block.
//  Context controls which value leads and how much secondary info shows.
//
//  Contexts: 'home' | 'command_center' | 'recovery_card' |
//            'action_card' | 'roi_card' | 'ask_skc'
function renderPrimaryImpact(opp, context = 'recovery_card') {
  const bd  = getImpactBreakdown(opp);
  if (!bd) return '';
  const vs  = renderVerificationStatus(opp);
  const cls = getImpactColorClass(opp);
  const sec = renderSecondaryRunRate(opp);

  // Formatted values — use existing formatters, never new math
  const fmtService = formatPerService(bd.perServiceImpact, bd.perServiceLabel);
  const fmtWeekly  = formatWeekly(bd.weeklyExposure);
  const fmtOpen    = bd.monthlyOpenOpportunity
    ? `${formatCurrency(bd.monthlyOpenOpportunity)}/mo run-rate`
    : null;
  const fmtVerified = bd.verifiedSavings > 0
    ? formatVerifiedValue(bd.verifiedSavings)
    : null;

  // ── home: compact — per-service only, weekly as sub ──────────
  if (context === 'home') {
    return `<div class="rpi rpi-home">
      <div class="rpi-primary ${cls}">${fmtService}</div>
      <div class="rpi-sub">${fmtWeekly} · ${vs}</div>
      ${sec ? `<div class="rpi-mo">${sec}</div>` : ''}
    </div>`;
  }

  // ── command_center: per-service + weekly row ──────────────────
  if (context === 'command_center') {
    return `<div class="rpi rpi-cc">
      <div class="rpi-primary ${cls}">${fmtService}</div>
      <div class="rpi-weekly">${fmtWeekly} exposure</div>
      <div class="rpi-sub">${vs}</div>
      ${sec ? `<div class="rpi-mo">${sec}</div>` : ''}
    </div>`;
  }

  // ── recovery_card: full chain — per-service → weekly → monthly ─
  if (context === 'recovery_card') {
    return `<div class="rpi rpi-card">
      <div class="rpi-primary ${cls}">${fmtService}</div>
      <div class="rpi-chain">
        <span class="rpi-chain-item">
          <span class="rpi-chain-label">${bd.affectedServicesPerWeek} service${bd.affectedServicesPerWeek !== 1 ? 's' : ''}/wk</span>
          <span class="rpi-chain-val">${fmtWeekly}</span>
        </span>
        <span class="rpi-chain-arrow">→</span>
        <span class="rpi-chain-item">
          <span class="rpi-chain-label">Monthly run-rate</span>
          <span class="rpi-chain-val" style="color:var(--t2)">${fmtOpen || sec}</span>
        </span>
      </div>
      <div class="rpi-status">${vs}</div>
    </div>`;
  }

  // ── action_card: concise — weekly leads, verified if applicable ─
  if (context === 'action_card') {
    const lead = bd.countedInVerifiedROI && fmtVerified ? fmtVerified : fmtWeekly;
    return `<div class="rpi rpi-action">
      <div class="rpi-primary ${cls}">${lead}</div>
      <div class="rpi-sub">${fmtService} · ${vs}</div>
      ${!bd.countedInVerifiedROI && sec ? `<div class="rpi-mo">${sec}</div>` : ''}
    </div>`;
  }

  // ── roi_card: verified leads, monthly run-rate secondary ─────
  if (context === 'roi_card') {
    const lead = bd.countedInVerifiedROI && fmtVerified
      ? fmtVerified
      : (fmtOpen || fmtWeekly);
    return `<div class="rpi rpi-roi">
      <div class="rpi-primary ${cls}">${lead}</div>
      <div class="rpi-sub">${fmtService} · ${bd.affectedServicesPerWeek} services/wk · ${vs}</div>
    </div>`;
  }

  // ── ask_skc: plain prose ─────────────────────────────────────
  if (context === 'ask_skc') {
    const runRateLine = fmtOpen
      ? ` Monthly run-rate projection: ${fmtOpen}.`
      : '';
    return `${fmtService} across ${bd.affectedServicesPerWeek} service${bd.affectedServicesPerWeek !== 1 ? 's' : ''}/wk = ${fmtWeekly} exposure.${runRateLine} ${vs}.`;
  }

  // Fallback — same as recovery_card
  return `<div class="rpi">
    <div class="rpi-primary ${cls}">${fmtService}</div>
    <div class="rpi-sub">${fmtWeekly} · ${vs}</div>
    ${sec ? `<div class="rpi-mo">${sec}</div>` : ''}
  </div>`;
}

// ── 3. renderSecondaryRunRate(opp) ────────────────────────────
//  Always returns the monthly run-rate projection as a short secondary string.
//  Never the headline — caller decides where to place it.
function renderSecondaryRunRate(opp) {
  const bd = getImpactBreakdown(opp);
  if (!bd) return '';
  const monthly = bd.monthlyOpenOpportunity || bd.monthlyRunRate;
  if (!monthly) return '';
  return `${formatCurrency(monthly)}/mo run-rate projection`;
}

// ── 4. renderVerificationStatus(opp) ─────────────────────────
//  Returns one of four canonical status strings.
//  Reads opp.output_type and opp.impact fields — no new logic.
function renderVerificationStatus(opp) {
  if (!opp) return 'Open exposure · not counted in ROI';
  const bd = getImpactBreakdown(opp);
  if (!bd) return 'Open exposure · not counted in ROI';

  if (bd.countedInVerifiedROI && bd.verifiedSavings > 0) {
    return 'Verified recovery · counted in ROI';
  }
  if (bd.outputType === 'active_recovery' || bd.activeRecovery > 0) {
    return 'Active recovery · monitoring required';
  }
  if (bd.outputType === 'unavailable') {
    return 'Blocked · data or guardrail issue';
  }
  // Default: open
  return 'Open exposure · not counted in ROI';
}

// ── 5. getImpactColorClass(opp) ───────────────────────────────
//  Returns a CSS utility class name for the impact value color.
//  Maps to existing CSS vars — no new classes needed.
function getImpactColorClass(opp) {
  if (!opp) return 'text-muted';
  const bd = getImpactBreakdown(opp);
  if (!bd) return 'text-muted';

  if (bd.countedInVerifiedROI && bd.verifiedSavings > 0) return 'text-green';
  if (bd.outputType === 'active_recovery')                 return 'text-blue';
  if (bd.outputType === 'unavailable')                     return 'text-red';
  if (bd.outputType === 'open_opportunity')                return 'text-amber';
  return 'text-muted';
}

// ── 6. renderTimeBasisNote(opp) ──────────────────────────────
//  One-line explanatory note for any card.
//  "Based on X affected services per week. Monthly value is a run-rate projection."
function renderTimeBasisNote(opp) {
  const bd = getImpactBreakdown(opp);
  if (!bd) return '';
  const svcCount = bd.affectedServicesPerWeek;
  const svcLabel = bd.perServiceLabel;
  const basis = bd.weeklyLabel && bd.weeklyLabel !== bd.affectedServicesPerWeek + ' service(s)/wk'
    ? bd.weeklyLabel
    : `${svcCount} affected ${svcLabel.replace('per ', '')} service${svcCount !== 1 ? 's' : ''} per week`;
  return `Based on ${basis}. Monthly run-rate is a projection from weekly operating patterns. SKC verifies impact by service, day, and week.`;
}


// ═══════════════════════════════════════════════════════════════
//  SKC_STATE  —  single source of truth for all visible UI
//
//  Rules:
//   · Every number shown in the UI must come from here
//   · SKC_STATE.render() propagates all values to the DOM
//   · Simulation / DQ changes mutate this object, then call render()
//   · All downstream objects (SKC, DQ_STATE, VE, CA_DEFS) are
//     built as computed views of SKC_STATE — they do not hold
//     their own canonical numbers
// ═══════════════════════════════════════════════════════════════

const SKC_STATE = {

  // ─── 0. (v26 · Fixes 8 + 11) Demo state for role + pilot phase ──
  //  viewer_role: 'gm' | 'owner' | 'both'  · controls which audience badges dim
  //  account_phase: 'pilot' | 'paying'     · controls Pilot expectations card on ROI Proof
  //  pilot_day: 0-30                       · for the Day 0/15/30 toggle
  viewer_role:   'gm',
  account_phase: 'pilot',
  pilot_day:     15,

  // ─── 1. Business context ──────────────────────────────────
  business: {
    name:               'Rosewood Group',
    locations:          ['Oakland','Berkeley','Walnut Creek','San Jose'],
    location_count:     4,
    selected_location:  'All Locations',
    selected_daypart:   'Dinner',
    selected_timeframe: '8-week rolling',
  },

  // ─── 2. Data quality ─────────────────────────────────────
  data_quality: {
    global_health: 78,        // % completeness
    sources: {
      toast: {
        id:'toast', label:'Toast POS',
        status:'healthy', lastSync:'4m ago',
        sync_frequency: 'Every 5 min',
        confidence_impact: { healthy:0, stale:-30, degraded:-15, missing:-50 },
        action_rule: { healthy:'allowed', stale:'requires_approval', degraded:'allowed', missing:'blocked' },
        verification_rule: { healthy:'eligible', stale:'blocked', degraded:'conditional', missing:'blocked' },
        affected_opportunity_categories: ['Labor','Menu','Throughput'],
        reconnect_fn: "showScreen('settings',null,'Data Quality')",
        metrics: ['sales','covers','avg_check','ticket_time','table_turns','rplh','labor_pct'],
      },
      shifts: {
        id:'shifts', label:'7shifts',
        status:'stale', lastSync:'18h ago',
        sync_frequency: 'Every 15 min',
        confidence_impact: { healthy:0, stale:-7, degraded:-15, missing:-60 },
        action_rule: { healthy:'allowed', stale:'requires_approval', degraded:'requires_approval', missing:'blocked' },
        verification_rule: { healthy:'eligible', stale:'blocked', degraded:'blocked', missing:'blocked' },
        affected_opportunity_categories: ['Labor'],
        reconnect_fn: "dqFix('shifts')",
        metrics: ['hours_scheduled','labor_pct','rplh'],
      },
      menu: {
        id:'menu', label:'Menu / Recipe Cost',
        status:'stale', lastSync:'18d ago',
        sync_frequency: 'Manual upload',
        confidence_impact: { healthy:0, stale:-10, degraded:-10, missing:-45 },
        action_rule: { healthy:'allowed', stale:'allowed', degraded:'allowed', missing:'requires_approval' },
        verification_rule: { healthy:'eligible', stale:'eligible', degraded:'eligible', missing:'conditional' },
        affected_opportunity_categories: ['Menu'],
        reconnect_fn: "showScreen('settings',null,'Data Quality')",
        metrics: ['food_cost','contribution_margin','menu_mix'],
      },
      kds: {
        id:'kds', label:'KDS',
        status:'degraded', lastSync:'6m ago',
        sync_frequency: 'Continuous',
        confidence_impact: { healthy:0, stale:-35, degraded:-16, missing:-60 },
        action_rule: { healthy:'allowed', stale:'requires_approval', degraded:'allowed', missing:'blocked' },
        verification_rule: { healthy:'eligible', stale:'blocked', degraded:'conditional', missing:'blocked' },
        affected_opportunity_categories: ['Throughput'],
        reconnect_fn: "showScreen('settings',null,'Data Quality')",
        metrics: ['ticket_time'],
      },
      reviews: {
        id:'reviews', label:'Google Reviews',
        status:'stale', lastSync:'1h ago',
        sync_frequency: 'Every 30 min',
        confidence_impact: { healthy:0, stale:-5, degraded:-10, missing:-40 },
        action_rule: { healthy:'allowed', stale:'allowed', degraded:'allowed', missing:'allowed' },
        verification_rule: { healthy:'eligible', stale:'conditional', degraded:'conditional', missing:'conditional' },
        affected_opportunity_categories: [],
        reconnect_fn: "showScreen('settings',null,'Data Quality')",
        metrics: ['review_rating','complaints'],
      },
      accounting: {
        id:'accounting', label:'Accounting',
        status:'missing', lastSync:'Never',
        sync_frequency: 'Not connected',
        confidence_impact: { healthy:0, stale:-10, degraded:-5, missing:-15 },
        action_rule: { healthy:'allowed', stale:'allowed', degraded:'allowed', missing:'allowed' },
        verification_rule: { healthy:'eligible', stale:'eligible', degraded:'eligible', missing:'eligible' },
        affected_opportunity_categories: [],
        reconnect_fn: "showScreen('settings',null,'Data Quality')",
        metrics: ['prime_cost','net_margin'],
      },
    },
    // Computed from sources
    get stale_sources() {
      return Object.values(this.sources).filter(s => s.status !== 'healthy').map(s => s.label);
    },
    get blocked_actions() {
      return Object.values(this.sources)
        .filter(s => this.sources[s.id]?.action_rule?.[s.status] === 'blocked')
        .map(s => s.id);
    },
    sync_history: [
      { ts:'2026-05-18T11:46:00', source:'toast',   status:'ok' },
      { ts:'2026-05-18T11:44:00', source:'kds',     status:'partial' },
      { ts:'2026-05-18T10:50:00', source:'reviews', status:'ok' },
      { ts:'2026-05-17T17:47:00', source:'shifts',  status:'token_stale' },
      { ts:'2026-04-30T08:12:00', source:'menu',    status:'manual_upload' },
    ],
  },


  // ─── 3. Diagnostic metrics  ───────────────────────────────
  //  These are the canonical live readings.
  //  All guardrail checks, evidence tables, and calculations
  //  must read from here — never from hard-coded strings.
  metrics: {
    // Labor
    rplh_current:        31.40,   // $/hr  · Toast POS · DET
    rplh_baseline:       38.20,   // $/hr  · 8-wk rolling avg
    rplh_target:         36.50,   // $/hr  · verification threshold
    hours_scheduled:     28,      // hrs/night · 7shifts
    hours_needed:        22,      // hrs/night
    hours_excess:        6,       // hrs/night
    labor_pct:           34.8,    // %
    labor_pct_target:    31.5,    // %
    wage_blended:        18.40,   // $/hr  · base wage only · diagnostic reference (not used for savings calc)
    covers:              87,      // Tue dinner · Toast POS
    covers_baseline:     98,      //
    // Menu
    salmon_cm_pct:       38.2,    // %  · Recipe Cost
    salmon_cm_target:    55,      // %  · threshold
    menu_avg_cm_pct:     61.2,    // %  · Toast POS
    salmon_price:        24.00,   // $  · current
    salmon_price_target: 27.00,   // $  · recommended
    salmon_cost:         14.80,   // $  · Recipe Cost (manual, 18d stale)
    salmon_covers_week:  94,      // covers/wk · Toast POS
    // Throughput
    ticket_time:         14.2,    // min · KDS (partial)
    ticket_baseline:     11.8,    // min
    avg_check:           53.10,   // $  · Toast POS
    avg_check_baseline:  52.40,   // $
    table_turns:         48,      // min
    table_turns_limit:   52,      // min · guardrail
    complaints:          0,       // /wk
    complaints_limit:    2,       // /wk
    // Bar staffing (monitoring)
    bar_rplh_current:    38.40,   // $/hr · Walnut Creek · monitoring
    bar_rplh_baseline:   33.80,   // $/hr · pre-action
    bar_rplh_target:     36.50,   // $/hr
  },

  // ─── 4. Guardrail thresholds ──────────────────────────────
  guardrails: {
    ticket_time:  { limit:16,   op:'lte', unit:'min',   get current() { return SKC_STATE.metrics.ticket_time;   } },
    avg_check:    { limit:50,   op:'gte', unit:'$',     get current() { return SKC_STATE.metrics.avg_check;     } },
    table_turns:  { limit:52,   op:'lte', unit:'min',   get current() { return SKC_STATE.metrics.table_turns;   } },
    complaints:   { limit:2,    op:'lte', unit:'/week', get current() { return SKC_STATE.metrics.complaints;    } },
    // Guardrail status helper
    status(key) {
      const g = this[key]; if (!g || !g.limit) return 'pass';
      const v = g.current;
      const passes = g.op === 'lte' ? v <= g.limit : v >= g.limit;
      if (!passes) return 'fail';
      const watch = g.op === 'lte' ? v > g.limit * 0.9 : v < g.limit * 1.1;
      return watch ? 'watch' : 'pass';
    },
    verdict() {
      const ks = ['ticket_time','avg_check','table_turns','complaints'];
      const statuses = ks.map(k => SKC_STATE.guardrails.status(k));
      if (statuses.some(s=>s==='fail'))  return 'blocked';
      if (statuses.some(s=>s==='watch')) return 'monitoring';
      return 'eligible';
    },
  },

  // ─── 5. Opportunities — delegates to OPPORTUNITIES ─────────────────
  opportunities: {
    // Thin delegates — all canonical data lives in OPPORTUNITIES object below
    get labor()      { return OPPORTUNITIES.labor;      },
    get salmon()     { return OPPORTUNITIES.salmon;     },
    get throughput() { return OPPORTUNITIES.throughput; },
    get total_open() {
      return OPPORTUNITIES.labor.impact.portfolio_monthly_impact
           + OPPORTUNITIES.salmon.impact.portfolio_monthly_impact
           + OPPORTUNITIES.throughput.impact.portfolio_monthly_impact;
    },
  },

  // ─── 6. Actions — delegate to canonical ACTIONS object ─────
  actions: {
    // Thin delegates — canonical data lives in ACTIONS object defined above.
    // getters here allow SKC_STATE.actions.A006.impact etc. to still work.
    get A000() { return ACTIONS.A000; },
    get A005() { return ACTIONS.A005; },
    get A006() { return ACTIONS.A006; },
    get A007() { return ACTIONS.A007; },
    get A008() { return ACTIONS.A008; },
    // Note: summary helpers are external functions — not getters here (avoids Object.values() self-recursion)
  },

  // ─── 7. Verification / ROI ───────────────────────────────
  verification: {
    mode: 'monitoring',   // 'eligible' | 'monitoring' | 'blocked'
    // Guardrail sim overrides (null = use live metrics)
    sim_overrides: null,
    get active_verdict() {
      if (this.sim_overrides) {
        // check sim values against thresholds
        const ov = this.sim_overrides;
        const fails = [
          ov.ticket_time   > 16,
          ov.avg_check     < 50,
          ov.table_turns   > 52,
          ov.complaints    > 2,
        ];
        if (fails.some(Boolean)) return 'blocked';
        const watches = [
          ov.ticket_time   > 16*0.9,
          ov.avg_check     < 50*1.1,
          ov.table_turns   > 52*0.9,
          false,
        ];
        return watches.some(Boolean) ? 'monitoring' : 'eligible';
      }
      return SKC_STATE.guardrails.verdict();
    },
  },

  roi: {
    // Delegates to ROI_STATE — computed from VERIFICATIONS
    get subscription()        { return ROI_STATE.subscription_cost; },
    get verified()            { return ROI_STATE.verified_monthly_savings; },
    get approaching()         { return ROI_STATE.active_recovery_value; },
    get active_recovery()     { return ROI_STATE.active_recovery_value + OPPORTUNITIES.labor.impact.location_monthly_impact; },
    get total_open()          { return ROI_STATE.open_opportunity_value; },
    get net_gain()            { return ROI_STATE.net_verified_gain; },
    get roi_multiple()        { return ROI_STATE.verified_roi_multiple; },
    get roi_post_bar()        { return ROI_STATE.projected_roi_multiple; },
    get net_gain_post_bar()   { return ROI_STATE.verified_monthly_savings + ROI_STATE.active_recovery_value - ROI_STATE.subscription_cost; },
    get accounting_connected(){ return ROI_STATE.accounting_connected; },
    get margin_confirmed()    { return ROI_STATE.margin_confirmation_available; },
  },

  // ─── 8. Reports ──────────────────────────────────────────
  reports: {
    current_week: 'May 11–17',
    report_date:  'May 18, 2026',
  },

  // ─── 9. UI state ─────────────────────────────────────────
  ui: {
    active_screen:            'home',
    active_tabs:              {},
    selected_opportunity_id:  null,
    selected_action_id:       null,
    assistant_open:           false,
    evidence_drawer_open:     false,
    evidence_drawer_key:      null,
    filters:                  { location:'All Locations', daypart:'All', timeframe:'8-week' },
  },

  // ─── 10. Formatted display values ────────────────────────
  //  All UI-facing strings go through fmt so they're consistent
  fmt: {
    // Core formatters — delegate to standalone functions after they're defined
    dollar:     (n, suffix='/mo') => '$' + Math.round(n).toLocaleString() + suffix,
    dollarX:    (n) => '$' + (+n).toFixed(2),
    pct:        (n) => n + '%',
    rplh:       (n) => '$' + (+n).toFixed(2) + '/hr',
    mins:       (n) => n + ' min',
    hrs:        (n) => n + ' hrs',
    multiple:   (n) => n + '×',
    // Time-basis formatters — use canonical labels
    monthly:    (n, status='estimated') => typeof formatMonthly === 'function' ? formatMonthly(n, status) : '$' + Math.round(n).toLocaleString() + '/mo',
    weekly:     (n) => typeof formatWeekly === 'function' ? formatWeekly(n) : '$' + Math.round(n).toLocaleString() + '/wk',
    perService: (n, unit='service') => typeof formatPerService === 'function' ? formatPerService(n, unit) : '$' + Math.round(n) + '/' + unit,
    runRate:    (n) => typeof formatRunRate === 'function' ? formatRunRate(n) : '$' + Math.round(n).toLocaleString() + '/mo est. run-rate',
    verified:   (n) => typeof formatVerifiedValue === 'function' ? formatVerifiedValue(n) : '$' + Math.round(n).toLocaleString() + '/mo verified',
  },

  // ─── 11. Render  ─────────────────────────────────────────
  //  Call after any state mutation to push all values to the DOM
  render() {
    const m   = this.metrics;
    const opp = OPPORTUNITIES; // canonical source
    const roi = this.roi;
    const fmt = this.fmt;
    const dq  = this.data_quality;

    // Map: data-skc attribute value → computed display string
    const bindings = {
      // ROI / proof
      'verified-savings':    formatVerifiedValue(roi.verified),
      'verified-savings-val': formatCurrency(roi.verified),
      'verified-savings-mo':  formatCurrency(roi.verified) + '/mo',
      'subscription':        fmt.dollar(roi.subscription),
      'net-gain':            fmt.dollar(roi.net_gain),
      'roi-current':         fmt.multiple(roi.roi_multiple),
      'roi-post-bar':        fmt.multiple(roi.roi_post_bar),
      'total-open':          formatRunRate(opp.total_open),  // $6,840/mo — sum of all portfolio run-rates
      'total-open-val':       formatCurrency(opp.total_open),
      'active-recovery':     formatMonthly(roi.active_recovery, 'active-recovery'),
      'approaching-verified':fmt.dollar(roi.approaching),

      // Labor opportunity — all time-basis levels
      'labor-oakland':             formatMonthly(opp.labor.impact.location_monthly_impact, 'open'),
      'labor-both':                formatRunRate(opp.labor.impact.monthly_run_rate),
      'labor-both-val':            formatCurrency(opp.labor.impact.portfolio_monthly_impact),
      'labor-weekly':              fmt.dollar(opp.labor.impact.weekly_exposure, '/wk'), // portfolio weekly
      'labor-per-location-wk':    fmt.dollar(opp.labor.impact.weekly_per_location, '/wk'), // per location
      'labor-per-service':         '$' + opp.labor.impact.per_service_impact + '/service',
      'labor-services-per-week':   opp.labor.impact.affected_services_per_week + ' services/wk',
      'labor-run-rate':            fmt.dollar(opp.labor.impact.monthly_run_rate),
      'labor-verified':            opp.labor.impact.monthly_verified_savings === 0 ? '$0 verified' : fmt.dollar(opp.labor.impact.monthly_verified_savings),
      'labor-in-roi':              opp.labor.impact.counted_in_verified_roi ? 'Counted in ROI' : 'Not counted in ROI',

      // Menu opportunity — all time-basis levels
      'salmon-opp':                formatRunRate(opp.salmon.impact.monthly_run_rate),
      'salmon-per-plate':          '$' + opp.salmon.impact.per_service_impact.toFixed(2) + '/plate',
      'salmon-weekly':             fmt.dollar(opp.salmon.impact.weekly_exposure, '/wk'),
      'salmon-run-rate':           fmt.dollar(opp.salmon.impact.monthly_run_rate),
      'salmon-verified':           opp.salmon.impact.monthly_verified_savings === 0 ? '$0 verified' : fmt.dollar(opp.salmon.impact.monthly_verified_savings),
      'salmon-in-roi':             opp.salmon.impact.counted_in_verified_roi ? 'Counted in ROI' : 'Not counted in ROI',

      // Throughput opportunity — all time-basis levels
      'ticket-opp':                formatRunRate(opp.throughput.impact.monthly_run_rate),
      'ticket-per-service':        '$' + opp.throughput.impact.per_service_impact + '/service',
      'ticket-weekly':             fmt.dollar(opp.throughput.impact.weekly_exposure, '/wk'),
      'ticket-run-rate':           fmt.dollar(opp.throughput.impact.monthly_run_rate),
      'ticket-verified':           opp.throughput.impact.monthly_verified_savings === 0 ? '$0 verified' : fmt.dollar(opp.throughput.impact.monthly_verified_savings),
      'ticket-in-roi':             opp.throughput.impact.counted_in_verified_roi ? 'Counted in ROI' : 'Not counted in ROI',

      // Live metrics
      'rplh-current':        fmt.dollarX(m.rplh_current) + '/hr',
      'rplh-baseline':       fmt.dollarX(m.rplh_baseline) + '/hr',
      'rplh-target':         fmt.dollarX(m.rplh_target) + '/hr',
      'labor-pct':           fmt.pct(m.labor_pct),
      'avg-check':           fmt.dollarX(m.avg_check),
      'ticket-time':         fmt.mins(m.ticket_time),
      'table-turns':         fmt.mins(m.table_turns),
      'hours-excess':        fmt.hrs(m.hours_excess),
      'salmon-cm':           fmt.pct(m.salmon_cm_pct),
      'salmon-price':        fmt.dollarX(m.salmon_price),
      'salmon-price-target': fmt.dollarX(m.salmon_price_target),

      // Confidence
      'conf-labor':          fmt.pct(opp.labor.confidence_score),
      'conf-salmon':         fmt.pct(opp.salmon.confidence_score),
      'conf-throughput':     fmt.pct(opp.throughput.confidence_score),

      // Time-basis impact values (computed from canonical formula inputs)
      'labor-run-rate':      (typeof formatRunRate === 'function') ? formatRunRate(opp.labor.impact.monthly_run_rate) : '$' + opp.labor.impact.monthly_run_rate + '/mo est.',
      'salmon-run-rate':     (typeof formatRunRate === 'function') ? formatRunRate(opp.salmon.impact.monthly_run_rate) : '$' + opp.salmon.impact.monthly_run_rate + '/mo est.',
      'ticket-run-rate':     (typeof formatRunRate === 'function') ? formatRunRate(opp.throughput.impact.monthly_run_rate) : '$' + opp.throughput.impact.monthly_run_rate + '/mo est.',
      'labor-per-service':   (typeof formatPerService === 'function') ? formatPerService(opp.labor.impact.per_service_impact, 'dinner service') : '$' + opp.labor.impact.per_service_impact + '/service',
      'salmon-per-plate':    (typeof formatPerService === 'function') ? formatPerService(opp.salmon.impact.per_service_impact, 'plate') : '$' + opp.salmon.impact.per_service_impact + '/plate',
      'ticket-per-service':  (typeof formatPerService === 'function') ? formatPerService(opp.throughput.impact.per_service_impact, 'Friday') : '$' + opp.throughput.impact.per_service_impact + '/Friday',
      'labor-not-roi':       opp.labor.impact.counted_in_verified_roi ? 'Counted in ROI' : 'Not counted in ROI — est. run-rate',
      'salmon-not-roi':      opp.salmon.impact.counted_in_verified_roi ? 'Counted in ROI' : 'Not counted in ROI — est. run-rate',
      'ticket-not-roi':      opp.throughput.impact.counted_in_verified_roi ? 'Counted in ROI' : 'Not counted in ROI — est. run-rate',
      'roi-verified-label':  (typeof formatVerifiedValue === 'function') ? formatVerifiedValue(roi.verified) : '$420/mo verified',
      'roi-net-gain-label':  '+' + (typeof formatCurrency === 'function' ? formatCurrency(roi.net_gain) : '$121') + '/mo net gain',

      // Metric values (diagnostic — not savings)
      'rplh-gap':            '$' + (m.rplh_baseline - m.rplh_current).toFixed(2) + '/hr below baseline',
      'hours-scheduled':     m.hours_scheduled + ' hrs scheduled',
      'hours-needed':        m.hours_needed + ' hrs needed',
      'covers-current':      m.covers + ' covers',
      'covers-baseline':     m.covers_baseline + ' covers baseline',
      'avg-check-baseline':  '$' + m.avg_check_baseline.toFixed(2),
      'wage-blended':        '$' + m.wage_blended.toFixed(2) + '/hr blended wage',
      'salmon-cm-baseline':  m.menu_avg_cm_pct + '%',
      'salmon-cm-gap':       (m.menu_avg_cm_pct - m.salmon_cm_pct).toFixed(1) + ' pts below menu avg',
      'ticket-baseline':     m.ticket_baseline + ' min baseline',
      'ticket-excess':       '+' + (m.ticket_time - m.ticket_baseline).toFixed(1) + ' min above baseline',
      'bar-rplh':            '$' + m.bar_rplh_current.toFixed(2) + '/hr · monitoring',
      'bar-rplh-target':     '$' + m.bar_rplh_target.toFixed(2) + '/hr target',

      // Output type labels — every opportunity and key metric
      'labor-output-chip':    (typeof getOpportunityOutputLabel==='function') ? getOpportunityOutputLabel(opp.labor,'chip')    : 'EST',
      'salmon-output-chip':   (typeof getOpportunityOutputLabel==='function') ? getOpportunityOutputLabel(opp.salmon,'chip')   : 'EST',
      'ticket-output-chip':   (typeof getOpportunityOutputLabel==='function') ? getOpportunityOutputLabel(opp.throughput,'chip') : 'EST',
      'labor-output-full':    (typeof getOpportunityOutputLabel==='function') ? getOpportunityOutputLabel(opp.labor,'full')    : '',
      'salmon-output-full':   (typeof getOpportunityOutputLabel==='function') ? getOpportunityOutputLabel(opp.salmon,'full')   : '',
      'ticket-output-full':   (typeof getOpportunityOutputLabel==='function') ? getOpportunityOutputLabel(opp.throughput,'full') : '',

      // Verified savings — output type
      'roi-output-chip':      (typeof renderOutputChip==='function') ? renderOutputChip('verified', roi.verified > 0 ? SKC_STATE.actions.A000.confidence : null) : 'VER',
      'active-output-chip':   (typeof renderOutputChip==='function') ? renderOutputChip('active_recovery', SKC_STATE.actions.A005.confidence) : 'ACT',
      'open-output-chip':     (typeof renderOutputChip==='function') ? renderOutputChip('open_opportunity', null) : 'OPEN',

      // Metric-level output chips
      'rplh-output':          (typeof renderOutputChip==='function') ? renderOutputChip(METRIC_OUTPUT_TYPES_PROXY.rplh_current,      null) : 'DET',
      'hours-output':         (typeof renderOutputChip==='function') ? renderOutputChip(METRIC_OUTPUT_TYPES_PROXY.hours_scheduled,   null) : 'DET',
      'wage-output':          (typeof renderOutputChip==='function') ? renderOutputChip(METRIC_OUTPUT_TYPES_PROXY.wage_blended,      null) : 'HEU',
      'salmon-cm-output':     (typeof renderOutputChip==='function') ? renderOutputChip(METRIC_OUTPUT_TYPES_PROXY.salmon_cm_pct,    null) : 'EST',
      'ticket-time-output':   (typeof renderOutputChip==='function') ? renderOutputChip(METRIC_OUTPUT_TYPES_PROXY.ticket_time,      null) : 'DET',

      // Labor breakdown chain — for cards that show the time chain
      'labor-chain-service': formatPerService(opp.labor.impact.per_service_impact,'dinner service'),
      'labor-chain-weekly':  formatWeekly(opp.labor.impact.weekly_exposure),
      'labor-chain-runrate': formatRunRate(opp.labor.impact.monthly_run_rate),
      'labor-chain-verified':formatVerifiedValue(opp.labor.impact.monthly_verified_savings) || '$0 verified · not counted in ROI',
      'labor-chain-status':  opp.labor.impact.counted_in_verified_roi ? 'Counted in ROI ✓' : 'NOT counted in ROI — est. run-rate',

      // Salmon breakdown chain
      'salmon-chain-service':formatPerService(opp.salmon.impact.per_service_impact,'plate'),
      'salmon-chain-weekly': formatWeekly(opp.salmon.impact.weekly_exposure),
      'salmon-chain-runrate':formatRunRate(opp.salmon.impact.monthly_run_rate),
      'salmon-chain-status': opp.salmon.impact.counted_in_verified_roi ? 'Counted in ROI ✓' : 'NOT counted in ROI — est. run-rate',

      // Throughput breakdown chain
      'ticket-chain-service':formatPerService(opp.throughput.impact.per_service_impact,'Friday lunch service'),
      'ticket-chain-weekly': formatWeekly(opp.throughput.impact.weekly_exposure),
      'ticket-chain-runrate':formatRunRate(opp.throughput.impact.monthly_run_rate),
      'ticket-chain-status': opp.throughput.impact.counted_in_verified_roi ? 'Counted in ROI ✓' : 'NOT counted in ROI — est. run-rate',

      // Subscription / ROI
      'subscription':        formatMonthly(roi.subscription, 'estimated'),
      'net-gain':            '+' + formatCurrency(roi.net_gain) + '/mo net gain',
      'roi-post-bar':        roi.roi_post_bar + '×',
      'approaching-verified':formatMonthly(roi.approaching, 'active-recovery'),

      // Business
      'business-name':       this.business.name,
      'location-count':      this.business.location_count + ' locations',

      // Data quality
      'dq-health':           dq.global_health + '% complete',
      'toast-sync':          dq.sources.toast.lastSync,
      'shifts-sync':         dq.sources.shifts.lastSync,
      'menu-sync':           dq.sources.menu.lastSync,
      'kds-sync':            dq.sources.kds.lastSync,

      // Topbar health (last sync is fastest source = Toast)
      'last-synced':         dq.sources.toast.lastSync,
    };

    // Push to every element with a matching data-skc attribute
    Object.entries(bindings).forEach(([key, val]) => {
      document.querySelectorAll(`[data-skc="${key}"]`).forEach(el => {
        el.textContent = val;
      });
    });

    // Update confidence fill bars
    const confBars = {
      'conf-labor-fill':      opp.labor.confidence_score,
      'conf-salmon-fill':     opp.salmon.confidence_score,
      'conf-throughput-fill': opp.throughput.confidence_score,
    };
    Object.entries(confBars).forEach(([id, pct]) => {
      const el = document.getElementById(id);
      if (el) el.style.width = pct + '%';
    });

    // Update topbar health time
    const tbTime = document.querySelector('.tb-health-time');
    if (tbTime) tbTime.textContent = dq.sources.toast.lastSync;

    // Update Data Quality health bar
    const dqBar = document.querySelector('[data-dq-completeness]');
    if (dqBar) dqBar.textContent = dq.global_health + '% complete';

    // Update ni-badge counts using standalone helpers (avoiding circular getters)
    const leakBadge = document.querySelector('.nav-item[onclick*="leaks"] .ni-badge');
    if (leakBadge) leakBadge.textContent = '3';

    const actionBadge = document.querySelector('.nav-item[onclick*="actions"] .ni-badge');
    if (actionBadge) actionBadge.textContent = getActionsInProgress();

    // Re-run topRecovery bindings for backwards compatibility
    if (typeof bindTopRecovery === 'function') bindTopRecovery();
    // Propagate data quality to all screens
    if (typeof applyDataQualityToUI === 'function') {
      try { applyDataQualityToUI(); } catch(e) { /* DOM may not be ready on first call */ }
    }

    // Push computed display values for elements that need formula-based results
    try {
      const labTB = calculateTimeBasisImpact(OPPORTUNITIES.labor);
      const exSumActive = document.querySelector('[data-skc-computed="active-impact"]');
      if (exSumActive) exSumActive.textContent = formatRunRate(roi.active_recovery);
      const netGain = document.querySelector('[data-skc-computed="net-gain"]');
      if (netGain) netGain.textContent = formatCurrency(roi.net_gain);
    } catch(e) { /* format fns may not be ready on first call */ }

    // Also update cgState-driven card impact labels
    try {
      [1,2,3].forEach(id => {
        const cg = cgState[id];
        if (!cg) return;
        const impEl = document.getElementById('cg-impact-' + id);
        if (impEl) impEl.textContent = cg.impact;
        const detEl = document.getElementById('cg-impact-detail-' + id);
        if (detEl) detEl.textContent = cg.impactDetail;
      });
    } catch(e) {}
  },

}; // end SKC_STATE

// ── Action summary helpers — standalone to avoid Object.values() self-recursion ──
const ACTION_IDS = ['A000','A005','A006','A007','A008'];


// ─── Legacy bridge: existing code expects these globals ────────────────────
//  These are now computed views of SKC_STATE — do not edit numbers here.

// ─── COUNTER-METRIC GUARDRAILS ────────────────────────

// Per-card state: each metric has a status: 'pass' | 'watch' | 'fail'
const cgState = {
  1: { metrics: ['pass','pass','watch','pass'], name:'Labor (RPLH)',
       get impact() { return formatRunRate(OPPORTUNITIES.labor.impact.monthly_run_rate); },
       get impactDetail() { return formatPerService(OPPORTUNITIES.labor.impact.per_service_impact,'dinner service') + ' · ' + OPPORTUNITIES.labor.impact.affected_services_per_week + ' services/wk'; } },
  2: { metrics: ['pass','pass','watch','pass'], name:'Menu (Salmon CM)',
       get impact() { return formatRunRate(OPPORTUNITIES.salmon.impact.monthly_run_rate); },
       get impactDetail() { return formatPerService(OPPORTUNITIES.salmon.impact.per_service_impact,'plate') + ' · ' + OPPORTUNITIES.salmon.impact.affected_services_per_week + ' services/wk'; } },
  3: { metrics: ['pass','pass','pass','watch'], name:'Throughput (Ticket Time)',
       get impact() { return formatRunRate(OPPORTUNITIES.throughput.impact.monthly_run_rate); },
       get impactDetail() { return formatPerService(OPPORTUNITIES.throughput.impact.per_service_impact,'Friday') + ' · ' + OPPORTUNITIES.throughput.impact.affected_services_per_week + ' service/wk'; } },
};

// Scenario data per card
const cgScenarios = {
  1: {
    pass:    { metrics:['pass','pass','pass','pass'],
               rows: [['14.2 min','text-green'],['$53.10','text-green'],['48 min','text-green'],['0 this week','text-green']],
               notes:['Below 16 min · healthy','Strong +$0.70 above baseline','Back within baseline · confirmed','No complaints · 4.6★ stable'] },
    degrade: { metrics:['pass','watch','watch','pass'],
               rows: [['15.8 min',''],['$49.20','text-amber'],['53 min','text-amber'],['1 this week','']],
               notes:['Approaching threshold · monitor','Dropped below $50 — service signal','Slowing — possible coverage gap','1 complaint logged · watch'] },
    fail:    { metrics:['fail','fail','watch','fail'],
               rows: [['17.4 min','text-red'],['$47.10','text-red'],['56 min','text-amber'],['4 this week','text-red']],
               notes:['Exceeds 16 min — win blocked','Below $50 — verified win blocked','Significantly slower','4 complaints — service degradation'] },
    reset:   { metrics:['pass','pass','watch','pass'],
               rows: [['14.2 min',''],['$53.10','text-green'],['48 min',''],['0 this week','text-green']],
               notes:['Within threshold · monitor weekly','+$0.70 above baseline · healthy','Within range but 4 min slower than last week','No complaints logged · Google 4.6★ stable'] },
  },
  2: {
    pass:    { metrics:['pass','pass','pass','pass'],
               rows: [['4.7★ avg','text-green'],['0 this week','text-green'],['−3% (91 covers)','text-green'],['6.8 min','text-green']],
               notes:['No rating change post-reprice','No voids · clean signal','Volume stable within 15% threshold','No prep time change detected'] },
    degrade: { metrics:['watch','pass','watch','pass'],
               rows: [['4.4★ avg','text-amber'],['2 this week',''],['−12% (83 covers)','text-amber'],['7.2 min','']],
               notes:['Declining — approaching 4.3★ floor','Within threshold but increasing','Approaching 15% drop threshold','Slightly elevated · monitor'] },
    fail:    { metrics:['fail','fail','fail','pass'],
               rows: [['4.1★ avg','text-red'],['5 this week','text-red'],['−22% (73 covers)','text-red'],['6.9 min','text-green']],
               notes:['Below 4.3★ — win blocked','Exceeds 3/week — win blocked','Volume drop >15% — net recovery negative','No change'] },
    reset:   { metrics:['pass','pass','watch','pass'],
               rows: [['4.7★ avg','text-green'],['0 this week','text-green'],['−8% (86 covers)','text-amber'],['6.8 min','text-green']],
               notes:['No rating change detected post-reprice','No voids recorded · clean signal','Down 8 covers — within range but trending','No prep time change detected'] },
  },
  3: {
    pass:    { metrics:['pass','pass','pass','pass'],
               rows: [['0.9%','text-green'],['11.1%','text-green'],['0 this week','text-green'],['3.1 min','text-green']],
               notes:['Well within range · quality healthy','No staffing added — fix is pure process','No wait complaints · rating stable','Below 3.5 min threshold · healthy'] },
    degrade: { metrics:['watch','pass','watch','watch'],
               rows: [['2.1%','text-amber'],['11.4%',''],['2 this week','text-amber'],['3.9 min','text-amber']],
               notes:['Increasing — monitor for quality trend','Still within range','Approaching threshold · service signal','Elevated · approaching 4 min limit'] },
    fail:    { metrics:['fail','pass','fail','fail'],
               rows: [['4.2%','text-red'],['11.6%',''],['5 this week','text-red'],['4.8 min','text-red']],
               notes:['Exceeds 3% — quality-speed tradeoff · win blocked','No change','5 complaints — service degradation · win blocked','Exceeds 4 min — food quality risk · win blocked'] },
    reset:   { metrics:['pass','pass','pass','watch'],
               rows: [['1.2%','text-green'],['11.4%','text-green'],['0 this week','text-green'],['3.8 min','text-amber']],
               notes:['Well within range · no quality signals','No staffing change detected','No complaints · Google rating stable','Slightly elevated — monitor after line review'] },
  },
};

// Verdict config
const verdicts = {
  eligible:  { cls:'eligible',  icon:'✅', text:'Eligible for verified win', roiCls:'counts',  roi:'ROI: Counts as verified' },
  monitoring:{ cls:'monitoring',icon:'⏳', text:'Monitoring required',       roiCls:'pending', roi:'ROI: Pending' },
  blocked:   { cls:'blocked',   icon:'🚫', text:'Verified win blocked',      roiCls:'blocked', roi:'ROI: Blocked' },
};

const verdictSubs = {
  1: {
    eligible:  'All counter-metrics are passing. RPLH target met. Win can be verified and counted toward ROI.',
    monitoring:'Table turn time is Watch — 1 metric not fully confirmed. Continue monitoring before claiming verified win.',
    blocked:   'One or more guardrails breached. Verified win is blocked. Restore staffing if service degradation continues.',
  },
  2: {
    eligible:  'All guardrails passing. CM target met. Win can be verified and counted toward ROI.',
    monitoring:'Menu mix shift is Watch — volume dropped below threshold. Continue monitoring before claiming verified win.',
    blocked:   'Rating or void count exceeded threshold. Verified win is blocked. Consider rolling back the reprice.',
  },
  3: {
    eligible:  'All guardrails passing. Ticket time target met. Win can be verified and counted toward ROI.',
    monitoring:'Hold time is Watch — above 3.5 min threshold. Continue monitoring after Friday line review.',
    blocked:   'Remake rate or hold time exceeded threshold. Quality-speed tradeoff detected. Win is blocked until resolved.',
  },
};

function computeVerdict(metrics) {
  if (metrics.some(m => m === 'fail'))  return 'blocked';
  if (metrics.some(m => m === 'watch')) return 'monitoring';
  return 'eligible';
}

function applyVerdict(id) {
  const state   = cgState[id];
  const verdict = computeVerdict(state.metrics);
  const v       = verdicts[verdict];
  const el      = document.getElementById('verdict-' + id);
  const icon    = document.getElementById('verdict-icon-' + id);
  const text    = document.getElementById('verdict-text-' + id);
  const sub     = document.getElementById('verdict-sub-' + id);
  const roi     = document.getElementById('verdict-roi-' + id);
  if (!el) return;
  el.className  = 'cg-verdict ' + v.cls;
  icon.textContent = v.icon;
  text.textContent = v.text;
  sub.textContent  = verdictSubs[id][verdict];
  roi.className    = 'cg-roi-tag ' + v.roiCls;
  roi.textContent  = v.roi;
  // update the summary pills in the toggle bar
  updateSummaryPills(id, state.metrics);
  // update ROI scorecard hint
  updateRoiScorecard();
}

function updateSummaryPills(id, metrics) {
  const wrap = document.querySelector('#cg-wrap-' + id + ' .cg-toggle-pills');
  if (!wrap) return;
  const labels = {
    1: ['Ticket time','Avg check','Table turns','Complaints'],
    2: ['Item rating','Refunds','Menu mix','Prep time'],
    3: ['Remakes','Labor cost','Complaints','Hold time'],
  };
  const suffixes = { pass: '✓', watch: '~', fail: '✗' };
  wrap.innerHTML = metrics.map((s, i) =>
    `<span class="cg-summary-pill ${s}">${labels[id][i]} ${suffixes[s]}</span>`
  ).join('');
}

function simulateState(id, scenario) {
  const sc = cgScenarios[id][scenario];
  cgState[id].metrics = [...sc.metrics];
  // update table rows
  const rows = document.querySelectorAll('#cg-panel-' + id + ' .cg-table tbody tr');
  rows.forEach((row, i) => {
    if (!sc.rows[i]) return;
    const valCell = row.querySelector('.cg-val');
    if (valCell) {
      valCell.textContent = sc.rows[i][0];
      valCell.className   = 'cg-val ' + (sc.rows[i][1] || '');
    }
    const statusCell = row.querySelector('.cg-status');
    if (statusCell) {
      const s = sc.metrics[i];
      const labels = { pass:'Passing', watch:'Watch', fail:'Failing' };
      statusCell.className = 'cg-status ' + s;
      statusCell.textContent = labels[s];
    }
    const noteCell = row.cells[5];
    if (noteCell) noteCell.textContent = sc.notes[i] || '';
  });
  applyVerdict(id);
}

function updateRoiScorecard() {
  // compute aggregate across all 3 cards
  const allVerdicts = [1,2,3].map(id => computeVerdict(cgState[id].metrics));
  const blocked  = allVerdicts.filter(v => v === 'blocked').length;
  const eligible = allVerdicts.filter(v => v === 'eligible').length;
  // update scorecard renewal box if visible
  const box = document.querySelector('.renewal-text');
  if (!box) return;
  if (blocked > 0) {
    box.innerHTML = `SKC has confirmed <strong>$1,240/mo in verified recovery</strong> against a <strong>$399/mo subscription — a verified 4.1× ROI.</strong> <span style="color:var(--red);font-weight:600">${blocked} guardrail${blocked>1?'s':''} currently blocking</span> additional verifications. Active recovery of $4,120/mo run-rate projection cannot count as ROI until guardrails are resolved and monitoring windows close.`;
  } else if (eligible === 3) {
    box.innerHTML = `SKC has confirmed <strong>$1,240/mo in verified recovery</strong> against a <strong>$399/mo subscription — a verified 4.1× ROI.</strong> <span style="color:var(--green);font-weight:600">All guardrails passing</span> — $4,120/mo run-rate projection in active recovery is eligible for verification once monitoring windows close. Estimated values remain unverified until confirmed.`;
  } else {
    box.innerHTML = `SKC has confirmed <strong>$1,240/mo in verified recovery</strong> against a <strong>$399/mo subscription — a verified 4.1× ROI.</strong> An additional $4,120/mo run-rate projection is in active recovery (not yet verified) and $6,840/mo run-rate projection is open weekly exposure — not yet actioned. <span style="color:var(--t3);font-size:12px">Active recovery and open weekly exposure are estimated and cannot count as ROI until monitoring confirms with all guardrails passing.</span>`;
  }
}

function toggleDemoPanel(id) {
  const p = document.getElementById('demo-panel-' + id);
  if (p) p.classList.toggle('open');
}

// ─── DAILY REVIEW ─────────────────────────────────────
const drReviewed = new Set();
const drTotal = 5;

const drCardMeta = {
  1: { dot:'win',       label:'Yesterday\'s Win',  title:'Avg check held at $52.40 despite −11 covers' },
  2: { dot:'risk',      label:'Today\'s Risk',     _titleFn: () => topRecovery.issue + ' — $800 exposure tonight' },
  3: { dot:'action',    label:'Top Move Today',    _titleFn: () => topRecovery.recommendedAction + ' · ' + topRecovery.location + ' · ' + topRecovery.due },
  4: { dot:'watching',  label:'SKC Watching',      title:'Berkeley Fri lunch ticket time drifting — week 3' },
  5: { dot:'unresolved',label:'Unresolved',        title:'Salmon reprice unactioned for 12 days — $840 uncollected' },
};

const drTimeNow = () => {
  const d = new Date();
  return d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
};

function drMarkCard(id) {
  if (drReviewed.has(id)) return;
  drReviewed.add(id);

  // dim the card
  const card = document.getElementById('drCard-' + id);
  if (card) card.classList.add('reviewed');

  // show reviewed badge, disable mark button
  const badge = document.getElementById('drBadge-' + id);
  if (badge) badge.style.display = 'flex';
  const btn = document.getElementById('drMarkBtn-' + id);
  if (btn) { btn.textContent = '✓ Reviewed'; btn.classList.add('done'); btn.disabled = true; }

  // add timeline entry
  drAddTimeline(id);

  // update progress
  drUpdateProgress();
}

function drAddTimeline(id) {
  const meta = drCardMeta[id];
  const tl = document.getElementById('drTimelineItems');
  if (!tl) return;
  const entry = document.createElement('div');
  entry.className = 'dr-tl-entry';
  entry.innerHTML = `
    <div class="dr-tl-dot ${meta.dot}"></div>
    <div class="dr-tl-text"><strong>${meta.label}</strong> — ${meta.title}</div>
    <div class="dr-tl-time">${drTimeNow()}</div>`;
  tl.appendChild(entry);
  // show timeline wrap if first entry
  const wrap = document.getElementById('drTimeline');
  if (wrap) wrap.style.display = 'block';
}

function drUpdateProgress() {
  const count = drReviewed.size;
  const pct   = Math.round((count / drTotal) * 100);
  const fill  = document.getElementById('drHpFill');
  const label = document.getElementById('drHpLabel');
  if (fill)  fill.style.width = pct + '%';
  if (label) label.textContent = count + ' / ' + drTotal + ' reviewed';

  const hero       = document.getElementById('drHero');
  const statusText = document.getElementById('drHeroStatusText');
  const statusDot  = hero ? hero.querySelector('.dr-status-dot') : null;
  const insight    = document.getElementById('drHeroInsight');

  if (count === drTotal) {
    // all done
    if (hero)       { hero.classList.add('complete') }
    if (statusDot)  { statusDot.className = 'dr-status-dot complete'; }
    if (statusText) { statusText.textContent = 'All items reviewed'; }
    if (insight)    { insight.textContent = 'Review complete. Today\'s staffing action is ready to create.'; }
    showDemoToast('Daily Review completed — all items reviewed', 'green');
  } else {
    const remaining = drTotal - count;
    if (statusText) statusText.textContent = remaining + ' item' + (remaining === 1 ? '' : 's') + ' to review';
    showDemoToast('Item marked reviewed · ' + count + ' / ' + drTotal + ' done', 'blue');
  }
}

function drMarkAll() {
  for (let id = 1; id <= drTotal; id++) {
    if (!drReviewed.has(id)) drMarkCard(id);
  }
}

// hide timeline on load until first entry
document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.getElementById('drTimeline');
  if (wrap) wrap.style.display = 'none';
  currentNavItem = document.querySelector('.nav-item.active');
  const initBar = document.getElementById('daBar');
  if (initBar) initBar.style.display = 'none';
  // ── Initialize all UI from single state object ──────────
  SKC_STATE.render();
  if (typeof bindTopRecovery === 'function') bindTopRecovery();
  if (typeof applyGlobalDQ === 'function') applyGlobalDQ();
  if (typeof applyVerification === 'function') applyVerification();
  if (typeof vepRenderAll === 'function') vepRenderAll();
  if (typeof populateActionTabs === 'function') populateActionTabs();
});

function toggleCG(id) {
  const panel = document.getElementById('cg-panel-' + id);
  const caret = document.getElementById('cg-caret-' + id);
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  panel.classList.toggle('open', !isOpen);
  if (caret) { caret.classList.toggle('open', !isOpen); caret.textContent = isOpen ? '▾' : '▴'; }
}

// ─── NAV ─────────────────────────────────────────────────
let currentNavItem = null; // set on DOMContentLoaded
function showScreen(id, navEl, title) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const sc = document.getElementById('screen-' + id);
  if (sc) sc.classList.add('active');
  if (navEl) { navEl.classList.add('active'); currentNavItem = navEl; }
  else {
    // Auto-highlight sidebar item whose onclick matches this screen id
    document.querySelectorAll('.nav-item').forEach(n => {
      const oc = n.getAttribute('onclick') || '';
      if (oc.includes("'" + id + "'")) n.classList.add('active');
    });
  }
  // Update topbar title
  const displayTitle = title || id;
  document.getElementById('tbTitle').textContent = displayTitle;
  // Scroll to top
  const ct = document.getElementById('content');
  if (ct) ct.scrollTop = 0;
  // Doctrine bar: only show on core workspace screens
  const bar = document.getElementById('daBar');
  const withDoctrine = ['leaks','actions','scorecard','reports','config'];
  if (bar) bar.style.display = withDoctrine.includes(id) ? 'flex' : 'none';
  // If navigating to reports screen, populate timeline
  if (id === 'reports') {
    setTimeout(() => {
      const src = document.getElementById('tlList');
      const dst = document.getElementById('tlListReports');
      if (src && dst && !dst.children.length) dst.innerHTML = src.innerHTML;
    }, 80);
  }
  // If navigating to actions screen, render all tabs
  if (id === 'actions') {
    setTimeout(populateActionTabs, 50);
  }
  // (v27) If navigating to Menu Optimization, ensure a subpage is active
  if (id === 'menu') {
    setTimeout(() => {
      // Default to overview if no child is currently active
      const anyActive = document.querySelector('#screen-menu .menu-subpage.active');
      if (!anyActive) {
        showMenuSubpage('overview');
      } else {
        // Re-sync nav highlight to the currently-active subpage
        const activeId = anyActive.id.replace('menu-subpage-','');
        _menuUpdateNav(activeId);
      }
    }, 20);
  } else {
    // Leaving the Menu screen: clear menu parent active state
    const mp = document.getElementById('navMenuParent');
    if (mp) mp.classList.remove('parent-active');
    document.querySelectorAll('#navMenuChildren .nav-child').forEach(c => c.classList.remove('active'));
  }
  // (v28) If navigating to Actions, ensure a subpage is active and nav syncs
  if (id === 'actions') {
    setTimeout(() => {
      const anyActive = document.querySelector('#screen-actions .ac-subpage.active');
      if (!anyActive) {
        showActionsSubpage('overview');
      } else {
        const activeId = anyActive.id.replace('ac-subpage-','');
        _actionsUpdateNav(activeId);
      }
    }, 20);
  } else {
    // Leaving Actions: clear Actions parent active state
    const ap = document.getElementById('navActionsParent');
    if (ap) ap.classList.remove('parent-active');
    document.querySelectorAll('#navActionsChildren .nav-child').forEach(c => c.classList.remove('active'));
  }
  // (v28b) If navigating to Labor Efficiency, ensure a subpage is active and nav syncs
  if (id === 'labor-efficiency') {
    setTimeout(() => {
      const anyActive = document.querySelector('#screen-labor-efficiency .le-subpage.active');
      if (!anyActive) {
        showLaborSubpage('overview');
      } else {
        const activeId = anyActive.id.replace('le-subpage-','');
        _laborUpdateNav(activeId);
      }
    }, 20);
  } else {
    // Leaving Labor: clear Labor parent active state
    const lp = document.getElementById('navLaborParent');
    if (lp) lp.classList.remove('parent-active');
    document.querySelectorAll('#navLaborChildren .nav-child').forEach(c => c.classList.remove('active'));
  }
  // (v28c) If navigating to Table Turns, ensure a subpage is active and nav syncs
  if (id === 'table-turns') {
    setTimeout(() => {
      const anyActive = document.querySelector('#screen-table-turns .tt-subpage.active');
      if (!anyActive) {
        showTtSubpage('overview');
      } else {
        const activeId = anyActive.id.replace('tt-subpage-','');
        _ttUpdateNav(activeId);
      }
    }, 20);
  } else {
    // Leaving Table Turns: clear TT parent active state
    const tp = document.getElementById('navTtParent');
    if (tp) tp.classList.remove('parent-active');
    document.querySelectorAll('#navTtChildren .nav-child').forEach(c => c.classList.remove('active'));
  }
}

// ═══════════════════════════════════════════════════════════
// (v27) MENU OPTIMIZATION — subpage controller + data + handlers
// ═══════════════════════════════════════════════════════════

// Canonical demo data (must reconcile to ~$1,420/mo exposure)
// (Taya #14) Central menu-class labels — plain operator language, no Star/Plowhorse/Puzzle/Dog.
// Single source of truth: change wording here to update every chip, legend, and table label.
// Data keys (cls:'star'|'plow'|'puzz'|'dog') and CSS classes (.menu-q-*) are unchanged.
const MENU_CLASS_LABELS = {
  star: 'High profit · high sales',
  plow: 'Low profit · high sales',
  puzz: 'High profit · low sales',
  dog:  'Low profit · low sales',
};

const MENU_SUBPAGE_TITLES = {
  overview:    'Menu Optimization',
  matrix:      'Menu Matrix',
  mix:         'Menu Mix Shift',
  items:       'Menu Item Economics',
  actions:     'Menu Actions',
  simulations: 'Menu Simulations',
  evidence:    'Menu Evidence',
};

// ── Core controller ──────────────────────────────────────────
function _menuUpdateNav(sub) {
  const parent = document.getElementById('navMenuParent');
  if (parent) parent.classList.add('parent-active');
  // Clear other nav-items active state (the showScreen pass-through cleared all .nav-item — re-applying parent-active only)
  document.querySelectorAll('#navMenuChildren .nav-child').forEach(c => {
    c.classList.toggle('active', c.dataset.sub === sub);
  });
}

// ── Sidebar parent handlers ──────────────────────────────────
function _actionsUpdateNav(sub) {
  const parent = document.getElementById('navActionsParent');
  if (parent) {
    parent.classList.add('parent-active');
    parent.setAttribute('aria-expanded', 'true');
  }
  document.querySelectorAll('#navActionsChildren .nav-child').forEach(c => {
    c.classList.toggle('active', c.dataset.sub === sub);
  });
}

// ── Sidebar parent handlers ──────────────────────────────────
function _laborUpdateNav(sub) {
  const parent = document.getElementById('navLaborParent');
  if (parent) {
    parent.classList.add('parent-active');
    parent.setAttribute('aria-expanded', 'true');
  }
  document.querySelectorAll('#navLaborChildren .nav-child').forEach(c => {
    c.classList.toggle('active', c.dataset.sub === sub);
  });
}

let LE_CO_ACTIVE_FILTER = 'all';
function _ttUpdateNav(sub) {
  const parent = document.getElementById('navTtParent');
  if (parent) {
    parent.classList.add('parent-active');
    parent.setAttribute('aria-expanded', 'true');
  }
  document.querySelectorAll('#navTtChildren .nav-child').forEach(c => {
    c.classList.toggle('active', c.dataset.sub === sub);
  });
}

// (Taya #15) Data-driven menu matrix — bubbles render from MENU_DATA.items instead of
// 9 hand-coded SVG nodes, so the matrix scales to 100+ items. Position uses the
// documented mapping (x = 50 + pop/22*500, y = 370 − cm/15*350); radius scales with
// units; colour by class. Compact mode (>24 items) drops per-bubble labels to stay
// legible at scale. Static bubbles in the HTML remain as a no-JS fallback.
const MENU_MATRIX_LABEL = { crispy:'Crispy', burger:'Burger', vodka:'Vodka', fries:'Fries', martini:'Martini', risotto:'Risotto', burrata:'Burrata', beet:'Beet', kids:'Kids' };
const MENU_Q_FILL = { star:'var(--green)', plow:'var(--amber)', puzz:'var(--blue)', dog:'#a1a1aa' };
const MENU_Q_NAME = { star:'High profit · high sales', plow:'Low profit · high sales', puzz:'High profit · low sales', dog:'Low profit · low sales' };
function renderMenuMatrix() {
  const host = document.getElementById('menuMatrixBubbles');
  if (!host || typeof MENU_DATA === 'undefined' || !MENU_DATA.items) return;
  // SAMPLE — cm is food-cost-derived; requires a manual cost-input layer, not built (Taya #20).
  const entries = Object.entries(MENU_DATA.items);
  const compact = entries.length > 24;
  host.innerHTML = entries.map(([key, it]) => {
    const cx = (50 + (it.pop / 22) * 500).toFixed(1);
    const cy = (370 - (it.cm / 15) * 350).toFixed(1);
    const r  = Math.max(13, Math.min(30, 13 + it.units * 0.04)).toFixed(0);
    const fill = MENU_Q_FILL[it.cls] || '#a1a1aa';
    const dash = it.watch ? ' stroke-dasharray="3 3"' : '';
    const op   = it.watch ? '0.4' : '0.52';
    const label = MENU_MATRIX_LABEL[key] || (it.name || '').split(' ')[0];
    const kind = (typeof _menuItemKind === 'function') ? _menuItemKind(key) : 'food';
    const aria = (it.name || key) + ' · ' + (MENU_Q_NAME[it.cls] || '') + (it.watch ? ' · Watch' : '') +
                 ' · CM $' + it.cm.toFixed(2) + ' · ' + it.pop.toFixed(1) + '% popularity';
    const text = (compact || r < 14) ? '' :
      '<text x="' + cx + '" y="' + (parseFloat(cy) + 3.5).toFixed(1) + '" font-size="' + (r >= 22 ? 10 : 9) +
      '" fill="var(--t1)" text-anchor="middle" font-weight="700">' + label + '</text>';
    return '<g class="menu-bubble menu-q-' + it.cls + '" data-item="' + key + '" data-kind="' + kind +
      '" tabindex="0" role="button" aria-label="' + aria + '" onclick="menuMatrixSelect(\'' + key +
      '\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();menuMatrixSelect(\'' + key + '\')}">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '" opacity="' + op +
      '" stroke="' + fill + '" stroke-width="1.8"' + dash + '/>' + text + '</g>';
  }).join('');
}
document.addEventListener('DOMContentLoaded', function () {
  try { renderMenuMatrix(); } catch (e) { console.warn('renderMenuMatrix failed:', e); }
});

function menuMatrixSelect(key) {
  // SAMPLE — item.cm / Total CM are food-cost-derived; manual cost-input layer not built (Taya #20).
  const item = MENU_DATA.items[key];
  if (!item) return;
  // Update selection ring on matrix
  const ring = document.getElementById('menuMatrixSelectionRing');
  const bubble = document.querySelector('#screen-menu .menu-bubble[data-item="' + key + '"] circle');
  if (ring && bubble) {
    ring.setAttribute('cx', bubble.getAttribute('cx'));
    ring.setAttribute('cy', bubble.getAttribute('cy'));
    const r = parseFloat(bubble.getAttribute('r'));
    ring.setAttribute('r', (r + 6).toFixed(0));
  }
  // Update side card
  const detail = document.getElementById('menuMatrixDetail');
  if (!detail) return;
  const clsLabel = MENU_CLASS_LABELS[item.cls];
  const cmDelta = (item.cm - MENU_DATA.cm_threshold).toFixed(2);
  const popDelta = (item.pop - MENU_DATA.popularity_threshold).toFixed(1);
  detail.innerHTML =
    '<div class="menu-side-eyebrow">Selected item</div>' +
    '<div class="menu-side-title">' + item.name + '</div>' +
    '<div class="menu-side-class menu-q-' + item.cls + '">' + clsLabel + (item.watch ? ' · Watch' : '') + '</div>' +
    '<div class="menu-side-rows">' +
      '<div class="menu-side-row"><span data-tip="Contribution Margin per item — price minus food cost">CM/item</span><strong>$' + item.cm.toFixed(2) + '</strong></div>' +
      '<div class="menu-side-row"><span data-tip="Popularity % — share of total dinner items sold">Popularity</span><strong>' + item.pop.toFixed(1) + '%</strong></div>' +
      '<div class="menu-side-row"><span data-tip="Units sold in trailing 28 days">Units (28d)</span><strong>' + item.units + '</strong></div>' +
      '<div class="menu-side-row"><span>Revenue</span><strong>$' + item.rev.toLocaleString() + '</strong></div>' +
      '<div class="menu-side-row"><span data-tip="Total Contribution Margin — CM × units">Total CM</span><strong>$' + item.totalCM.toLocaleString() + '</strong></div>' +
    '</div>' +
    '<div class="menu-side-insight">' +
      (item.cls === 'plow'   ? 'Popular but <strong>' + Math.abs(cmDelta) + ' below</strong> CM threshold. These high-sales, low-profit items drive volume but starve the menu of margin.' :
       item.cls === 'puzz'   ? '<strong>$' + item.cm.toFixed(2) + '</strong> CM at only ' + item.pop.toFixed(1) + '% popularity. High-margin item under-promoted — biggest upside opportunity.' :
       item.cls === 'star'   ? 'High CM <em>and</em> high popularity. Protect placement and pricing — these items carry the menu.' :
       'Low margin and low popularity. Candidate for menu cleanup or reposition.') +
    '</div>' +
    '<div class="menu-side-rec">' +
      '<div class="menu-side-rec-k">Recommended action</div>' +
      '<div class="menu-side-rec-v">' + item.action + '.</div>' +
    '</div>' +
    '<div style="margin:8px 0;padding:6px 10px;background:var(--surface);border-left:3px solid var(--amber);border-radius:4px;font-size:10.5px;color:var(--t2);line-height:1.5">' +
      '<strong style="color:var(--amber)">CM source:</strong> Recipe cost file · stale 18d · <strong data-tip="Estimated · Recipe cost file is stale 18 days">EST</strong>' +
    '</div>' +
    '<div class="menu-side-ctas">' +
      '<button class="btn btn-primary btn-sm" onclick="showMenuSubpage(\'actions\')">Create Action</button>' +
      '<button class="btn btn-secondary btn-sm" onclick="showMenuSubpage(\'simulations\')">Simulate</button>' +
      '<button class="btn btn-ghost btn-sm" onclick="showMenuSubpage(\'evidence\')">Open Evidence</button>' +
    '</div>';
}

// ── Item Economics: render compact table ─────────────────────
// ── (v30b) Floating tooltip controller for Item Economics ─────────
// Uses a single position:fixed element shared across all [data-tip]
// inside #menu-subpage-items, so the tooltip escapes overflow:auto
// containers (table panel + items body).
// (Taya #16) Food vs Alcohol axis. The demo fixture is almost entirely food; Espresso
// Martini is the only alcohol line. A full beverage program (cocktails/wine/beer) needs
// connected bar/POS data SKC does not yet ingest — so the Alcohol view is an explicit
// illustrative placeholder. Default is Food; food metrics exclude alcohol (Taya #16).
const MENU_ITEM_KIND = { martini: 'alcohol' };   // every other item defaults to 'food'
function _menuItemKind(key) { return MENU_ITEM_KIND[key] || 'food'; }
function menuItemsSetKind(kind) {
  const k = (kind === 'alcohol') ? 'alcohol' : 'food';
  const table = document.querySelector('#menu-subpage-items .menu-items-table');
  if (table) table.setAttribute('data-kind-filter', k);
  document.querySelectorAll('#menu-subpage-items [data-kind-btn]').forEach(b => {
    b.classList.toggle('is-active', b.getAttribute('data-kind-btn') === k);
  });
  const note = document.getElementById('menuAlcoholNote');
  if (note) note.style.display = (k === 'alcohol') ? 'flex' : 'none';
  const hdr = document.getElementById('menuItemsPanelH');
  if (hdr) hdr.textContent = (k === 'alcohol') ? 'Item economics · alcohol' : 'Item economics · food items';
}

function renderMenuItemsTable() {
  // SAMPLE — item.cm / Total CM are food-cost-derived; manual cost-input layer not built (Taya #20).
  const body = document.getElementById('menuItemsBody');
  if (!body || body.dataset.rendered === 'true') return;
  // Sort by total CM descending by default
  const entries = Object.entries(MENU_DATA.items).sort((a,b) => b[1].totalCM - a[1].totalCM);
  const cmMax = 15; // for mini-bar scaling
  const popMax = 22;
  const cmThresholdPct = (MENU_DATA.cm_threshold / cmMax * 100);
  const popThresholdPct = (MENU_DATA.popularity_threshold / popMax * 100);
  body.innerHTML = entries.map(([key, item]) => {
    const clsLabel = MENU_CLASS_LABELS[item.cls];
    const cmBarPct = Math.min(100, item.cm / cmMax * 100);
    const popBarPct = Math.min(100, item.pop / popMax * 100);
    const cmBarColor = item.cm >= MENU_DATA.cm_threshold ? 'var(--green)' : 'var(--amber)';
    const popBarColor = item.pop >= MENU_DATA.popularity_threshold ? 'var(--blue)' : '#a1a1aa';
    return '<div class="menu-items-row" data-item="' + key + '" data-kind="' + _menuItemKind(key) + '" onclick="menuItemSelect(\'' + key + '\', this)" role="button" tabindex="0" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();menuItemSelect(\'' + key + '\',this)}" aria-label="' + item.name + ' · ' + clsLabel + '">' +
      '<span><strong>' + item.name + '</strong>' + (item.watch ? ' <span data-tip="Near-threshold low-profit, high-sales item — flagged for monitoring" style="font-size:9px;color:var(--amber);font-weight:700">·WATCH</span>' : '') + '</span>' +
      '<span><span class="menu-items-class menu-q-' + item.cls + '">' + clsLabel + '</span></span>' +
      '<span>' +
        '<strong data-tip="Contribution Margin per item — price minus food cost">$' + item.cm.toFixed(2) + '</strong> <span data-tip="Estimated · Recipe cost file is stale 18 days" style="font-size:9px;color:var(--amber);font-weight:700;letter-spacing:.04em">EST</span>' +
        '<div class="menu-mini-bar"><div class="menu-mini-bar-fill" style="width:' + cmBarPct + '%;background:' + cmBarColor + '"></div><div class="menu-mini-bar-line" style="left:' + cmThresholdPct + '%"></div></div>' +
      '</span>' +
      '<span>' +
        '<strong data-tip="Popularity % — share of total dinner items sold">' + item.pop.toFixed(1) + '%</strong>' +
        '<div class="menu-mini-bar"><div class="menu-mini-bar-fill" style="width:' + popBarPct + '%;background:' + popBarColor + '"></div><div class="menu-mini-bar-line" style="left:' + popThresholdPct + '%"></div></div>' +
      '</span>' +
      '<span><strong data-tip="Units sold in trailing 28 days">' + item.units + '</strong></span>' +
      '<span><strong data-tip="Total Contribution Margin — CM × units">$' + item.totalCM.toLocaleString() + '</strong></span>' +
      '<span class="menu-items-action">' + item.action + '</span>' +
    '</div>';
  }).join('') +
    // Reconciliation row: 273 other mapped dinner items
    '<div class="menu-items-row" style="opacity:.78;background:repeating-linear-gradient(135deg,transparent 0,transparent 6px,var(--surface) 6px,var(--surface) 8px);cursor:default" aria-label="Other mapped dinner items, included in weighted CM">' +
      '<span><strong>Other mapped dinner items</strong> <span data-tip="Included in weighted average CM, not plotted on the 2×2 matrix" style="font-size:9px;color:var(--t3);font-weight:700">·INCLUDED</span></span>' +
      '<span><span class="menu-items-class" style="background:var(--card);color:var(--t3);border:1px dashed var(--border)">Other</span></span>' +
      '<span><strong>~$8.53</strong> <span data-tip="Estimated · Recipe cost file is stale 18 days" style="font-size:9px;color:var(--amber);font-weight:700">EST</span></span>' +
      '<span><strong>—</strong></span>' +
      '<span><strong>273</strong></span>' +
      '<span><strong>~$2,328</strong></span>' +
      '<span class="menu-items-action" style="font-style:italic">Included in weighted CM, not plotted individually</span>' +
    '</div>' +
    // Totals reconciliation footer row
    '<div class="menu-items-row" style="background:var(--blue-d);border-top:2px solid var(--blue-b);font-weight:700;cursor:default" aria-label="Totals">' +
      '<span><strong>Total dinner items (28d)</strong></span>' +
      '<span style="color:var(--t3);font-size:10px">9 shown + 273 other</span>' +
      '<span><strong>$8.42</strong> <span data-tip="Weighted average across all 2,004 dinner items" style="font-size:9px;color:var(--blue);font-weight:700">WEIGHTED</span></span>' +
      '<span><strong>100%</strong></span>' +
      '<span><strong>2,004</strong></span>' +
      '<span><strong>~$16,874</strong></span>' +
      '<span class="menu-items-action" style="color:var(--blue)">Reconciles to weighted avg CM $8.42</span>' +
    '</div>';
  body.dataset.rendered = 'true';
}

function menuItemSelect(key, el) {
  // SAMPLE — item.cm / Total CM are food-cost-derived; manual cost-input layer not built (Taya #20).
  const item = MENU_DATA.items[key];
  if (!item) return;
  document.querySelectorAll('#screen-menu .menu-items-row').forEach(r => r.classList.remove('menu-selected'));
  if (el) el.classList.add('menu-selected');
  // Update detail card
  const detail = document.getElementById('menuItemDetail');
  if (!detail) return;
  const clsLabel = MENU_CLASS_LABELS[item.cls];
  const cmDelta = (item.cm - MENU_DATA.cm_threshold).toFixed(2);
  const popDelta = (item.pop - MENU_DATA.popularity_threshold).toFixed(1);
  const cmSign = parseFloat(cmDelta) >= 0 ? '+' : '−';
  const popSign = parseFloat(popDelta) >= 0 ? '+' : '−';
  detail.innerHTML =
    '<div class="menu-side-eyebrow">Selected item</div>' +
    '<div class="menu-side-title">' + item.name + '</div>' +
    '<div class="menu-side-class menu-q-' + item.cls + '">' + clsLabel + (item.watch ? ' · Watch' : '') + '</div>' +
    '<div class="menu-side-rows">' +
      '<div class="menu-side-row"><span>CM vs $8.75 threshold</span><strong>$' + item.cm.toFixed(2) + ' · ' + cmSign + '$' + Math.abs(parseFloat(cmDelta)).toFixed(2) + '</strong></div>' +
      '<div class="menu-side-row"><span>Popularity vs 8.0%</span><strong>' + item.pop.toFixed(1) + '% · ' + popSign + Math.abs(parseFloat(popDelta)).toFixed(1) + ' pts</strong></div>' +
      '<div class="menu-side-row"><span>Units (28d)</span><strong>' + item.units + '</strong></div>' +
      '<div class="menu-side-row"><span>Revenue</span><strong>$' + item.rev.toLocaleString() + '</strong></div>' +
      '<div class="menu-side-row"><span>Total CM</span><strong>$' + item.totalCM.toLocaleString() + '</strong></div>' +
    '</div>' +
    '<div class="menu-side-insight"><strong>Why it matters:</strong> ' +
      (item.cls === 'plow' ? 'Popular but $' + Math.abs(parseFloat(cmDelta)).toFixed(2) + ' below CM threshold. These high-sales, low-profit items drive volume but starve margin.' :
       item.cls === 'puzz' ? 'High CM at low popularity — biggest upside if it can move volume.' :
       item.cls === 'star' ? 'High CM and high popularity. Protect placement and pricing.' :
       'Low CM and low popularity. Candidate for cleanup.') +
    '</div>' +
    '<div class="menu-side-rec">' +
      '<div class="menu-side-rec-k">Recommendation</div>' +
      '<div class="menu-side-rec-v">' + item.action + '.</div>' +
    '</div>' +
    '<div style="margin:8px 0;padding:6px 10px;background:var(--surface);border-left:3px solid var(--amber);border-radius:4px;font-size:10.5px;color:var(--t2);line-height:1.5">' +
      '<strong style="color:var(--amber)">CM source:</strong> Recipe cost file · stale 18d · <strong>EST</strong><br>' +
      '<span style="color:var(--t3)">Verification blocked until cost refresh.</span>' +
    '</div>' +
    '<div class="menu-side-guards">' +
      '<div class="menu-side-guards-h">Guardrails</div>' +
      '<ul class="menu-side-guards-list">' +
        '<li>Unit sales decline ≤ 7%</li>' +
        '<li>Guest sentiment stable</li>' +
        '<li>Refund/comp rate stable</li>' +
        '<li>No negative review spike</li>' +
      '</ul>' +
    '</div>' +
    '<div class="menu-side-ctas">' +
      '<button class="btn btn-primary btn-sm" onclick="showMenuSubpage(\'actions\')">Create Action</button>' +
      '<button class="btn btn-secondary btn-sm" onclick="showMenuSubpage(\'simulations\')">Simulate</button>' +
    '</div>';
}

// ── Simulation selector ─────────────────────────────────────
// Menu simulation scenarios (data-driven detail panel)
function menuSimSelect(key, el) {
  document.querySelectorAll('#screen-menu .menu-sim-card').forEach(c => c.classList.remove('menu-sim-active'));
  if (el) el.classList.add('menu-sim-active');
  const s = MENU_SIM_SCENARIOS[key];
  if (!s) return;
  const set = (id, val) => { const n = document.getElementById(id); if (n) n.textContent = val; };
  set('menuSimDetailTitle', s.title);
  set('menuSimDetailWhy', s.why);
  // current
  const curPrice = document.querySelector('#menuSimDetailCurPrice strong'); if (curPrice) curPrice.textContent = s.curPrice;
  const curCm    = document.querySelector('#menuSimDetailCurCm strong');    if (curCm)    curCm.textContent    = s.curCm;
  const curUnits = document.querySelector('#menuSimDetailCurUnits strong'); if (curUnits) curUnits.textContent = s.curUnits;
  const curTotal = document.querySelector('#menuSimDetailCurTotal strong'); if (curTotal) curTotal.textContent = s.curTotal;
  // sim
  const simPrice = document.querySelector('#menuSimDetailSimPrice strong'); if (simPrice) simPrice.textContent = s.simPrice;
  const simCm    = document.querySelector('#menuSimDetailSimCm strong');    if (simCm)    simCm.textContent    = s.simCm;
  const simUnits = document.querySelector('#menuSimDetailSimUnits strong'); if (simUnits) simUnits.textContent = s.simUnits;
  const simTotal = document.querySelector('#menuSimDetailSimTotal strong'); if (simTotal) simTotal.textContent = s.simTotal;
  // formula + lift
  set('menuSimDetailFormula', s.formula);
  set('menuSimDetailLift', s.lift);
}

// ── Menu Evidence drawer — (Taya #3/#4) consolidated into the ONE canonical evidence drawer ──
// Every "show math" trigger now opens #evDrawer. The detailed menu content lives in the
// #menuEvDrawer markup (kept as the content source); we inject it into the shared shell so
// there is a single fixed-position evidence drawer rather than two competing systems.
function openMenuEvidenceDrawer() {
  const src     = document.querySelector('#menuEvDrawer .menu-ev-drawer-body');
  const body    = document.getElementById('evDrawerBody');
  const drawer  = document.getElementById('evDrawer');
  const overlay = document.getElementById('evOverlay');
  // Fallback to the standalone drawer if the canonical shell is unavailable.
  if (!src || !body || !drawer) {
    const ov = document.getElementById('menuEvDrawerOverlay');
    const dr = document.getElementById('menuEvDrawer');
    if (ov) ov.classList.add('open');
    if (dr) dr.classList.add('open');
    return;
  }
  const title = document.getElementById('evDrawerTitle');
  if (title) title.textContent = 'Menu Optimization Evidence · Oakland · Dinner · Last 28 Days';
  const strip = document.getElementById('evSummaryStrip');
  if (strip) strip.innerHTML =
    '<div class="ev-sum-cell ev-sum-span2"><div class="ev-sum-label">Recommended Action</div>' +
    '<div class="ev-sum-val" style="font-size:11.5px;font-weight:500;line-height:1.5;white-space:normal">Reprice / re-portion the largest low-profit, high-sales items; promote high-profit, low-sales items.</div></div>' +
    '<div class="ev-sum-cell"><div class="ev-sum-label">Estimated exposure</div>' +
    '<div class="ev-sum-val"><div style="font-family:var(--mono);font-size:15px;font-weight:700;color:var(--t1)">~$1,420<span style="font-size:11px;color:var(--t2)">/mo</span></div></div></div>' +
    '<div class="ev-sum-cell"><div class="ev-sum-label">Output</div><div class="ev-sum-val"><span class="tag-est tag-pill">ESTIMATED</span></div></div>' +
    '<div class="ev-sum-cell"><div class="ev-sum-label">Verification</div><div class="ev-sum-val"><span class="badge" style="background:var(--amber-d);color:var(--amber);border:1px solid var(--amber-b);font-size:9.5px">Blocked · recipe cost stale</span></div></div>';
  body.innerHTML = src.innerHTML;
  drawer.classList.add('open');
  if (overlay) overlay.classList.add('open');
}
function closeMenuEvidenceDrawer() {
  // Consolidated — menu evidence now lives in the canonical drawer.
  if (typeof closeEvDrawer === 'function') { closeEvDrawer(); return; }
  const dr = document.getElementById('evDrawer'); const ov = document.getElementById('evOverlay');
  if (dr) dr.classList.remove('open');
  if (ov) ov.classList.remove('open');
}

// ── ASK SKC PANEL ────────────────────────────────────────
function toggleAskPanel() {
  const panel   = document.getElementById('askPanel');
  const overlay = document.getElementById('askPanelOverlay');
  const isOpen  = panel.classList.contains('open');
  if (isOpen) {
    panel.classList.remove('open');
    overlay.classList.remove('open');
  } else {
    panel.classList.add('open');
    overlay.classList.add('open');
    setTimeout(() => {
      const inp = document.getElementById('askPanelInput');
      if (inp) inp.focus();
    }, 280);
  }
}

function closeAskPanel() {
  document.getElementById('askPanel').classList.remove('open');
  document.getElementById('askPanelOverlay').classList.remove('open');
}

function askPanelQ(q) {
  // Open panel if closed, then send the question
  const panel = document.getElementById('askPanel');
  if (!panel.classList.contains('open')) {
    panel.classList.add('open');
    document.getElementById('askPanelOverlay').classList.add('open');
  }
  const input = document.getElementById('askPanelInput');
  if (input) {
    input.value = q;
    setTimeout(() => sendPanelMsg(), 60);
  }
}

function sendPanelMsg() {
  const input  = document.getElementById('askPanelInput');
  const thread = document.getElementById('askPanelThread');
  if (!input || !thread) return;
  const q = input.value.trim();
  if (!q) return;
  input.value = '';

  // User bubble
  const userEl = document.createElement('div');
  userEl.className = 'ask-msg user-msg';
  userEl.innerHTML = `
    <div class="ask-msg-header user-hd">
      <span class="ask-msg-time">${new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}</span>
      <span class="ask-msg-sender" style="color:var(--t2)">Sarah Chen</span>
      <div class="ask-msg-ava user">SC</div>
    </div>
    <div class="ask-msg-body user-body"><p>${q}</p></div>`;
  thread.appendChild(userEl);

  // Typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'ask-msg skc-msg';
  typingEl.innerHTML = `
    <div class="ask-msg-header">
      <div class="ask-msg-ava skc">S</div>
      <span class="ask-msg-sender">SKC Profit Manager</span>
    </div>
    <div class="ask-msg-body"><div class="r-typing"><span></span><span></span><span></span></div></div>`;
  thread.appendChild(typingEl);
  thread.scrollTop = thread.scrollHeight;

  // Response
  setTimeout(() => {
    thread.removeChild(typingEl);
    const respEl = document.createElement('div');
    respEl.className = 'ask-msg skc-msg';
    respEl.innerHTML = `
      <div class="ask-msg-header">
        <div class="ask-msg-ava skc">S</div>
        <span class="ask-msg-sender">SKC Profit Manager</span>
        <span class="ask-msg-time">${new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}</span>
      </div>
      <div class="ask-msg-body">${getResponse(q)}</div>`;
    thread.appendChild(respEl);
    thread.scrollTop = thread.scrollHeight;
    // Hide chips after first interaction
    const chips = document.getElementById('askPanelChips');
    if (chips) chips.style.display = 'none';
  }, 1200);
}

// Escape key closes ask panel, evidence drawer, and menu evidence drawer
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeAskPanel();
    closeEvDrawer();
    // Menu Evidence Drawer — close if open; safe no-op if elements absent
    try {
      const mdr = document.getElementById('menuEvDrawer');
      if (mdr && mdr.classList.contains('open')) {
        closeMenuEvidenceDrawer();
      }
    } catch (err) { /* ignore */ }
  }
});

// ─── THEME ───────────────────────────────────────────────
let light = false;
function toggleTheme() {
  light = !light;
  document.body.classList.toggle('light', light);
  document.querySelector('.theme-toggle').textContent = light ? '☾' : '☀';
}

// ── (Taya #1/#2/#6) Executive vs Expanded detail mode ──────────────
// One top-level body class hides everything marked .skc-detail. Default is
// Executive (set statically on <body> in index.html). No per-screen rebuild —
// progressive disclosure via a single CSS class, exactly like the theme toggle.
let skcMode = 'exec';
function setSkcMode(mode) {
  skcMode = (mode === 'expanded') ? 'expanded' : 'exec';
  document.body.classList.toggle('skc-exec', skcMode === 'exec');
  document.querySelectorAll('[data-skc-mode-btn]').forEach(b => {
    b.classList.toggle('is-active', b.getAttribute('data-skc-mode-btn') === skcMode);
  });
}

// ── (Taya #13) Today on-track / off-track status — stated threshold rule ──────
// ON TRACK when projected labor % <= peer target AND sales pace >= plan; else OFF.
// Demo values are the canonical 29.3% target / +2.1 pts over (= 31.4% labor).
// Markup defaults to the computed state; this makes it data-driven if called.
function renderTodayStatus(laborPct = 31.4, targetPct = 29.3, salesPacePct = 100) {
  const el = document.getElementById('todayStatus');
  if (!el) return;
  const onTrack = laborPct <= targetPct && salesPacePct >= 100;
  el.classList.toggle('td-status-on', onTrack);
  el.classList.toggle('td-status-off', !onTrack);
  const hd = el.querySelector('.td-status-headline');
  const mv = el.querySelector('.td-status-metric-v');
  if (hd) hd.textContent = onTrack ? 'On track today' : 'Off track today';
  if (mv) mv.textContent = laborPct.toFixed(1) + '%';
}
document.addEventListener('DOMContentLoaded', () => renderTodayStatus());

// ── (User-view) GM ⇄ Owner role lens — primary axis is WHO you are ────────────
// GM sees the daily decision + safety + who; Owner sees money saved / in testing /
// available + whether it pays for itself. Drives body.skc-role-gm / .skc-role-owner;
// .skc-gm-only / .skc-owner-only elements show/hide. Default GM (set on <body>).
let skcRole = 'gm';
function setSkcRole(role) {
  skcRole = (role === 'owner') ? 'owner' : 'gm';
  document.body.classList.toggle('skc-role-gm', skcRole === 'gm');
  document.body.classList.toggle('skc-role-owner', skcRole === 'owner');
  document.querySelectorAll('[data-skc-role-btn]').forEach(b => {
    b.classList.toggle('is-active', b.getAttribute('data-skc-role-btn') === skcRole);
  });
}

// ─── DRAWER ──────────────────────────────────────────────
const drawerData = {
  leak1: {
    title: 'Evidence · Tue/Wed Dinner Overstaffing',
    html: `
      <div class="drawer-section">
        <div class="drawer-section-title">Impact</div>
        <div style="font-size:22px;font-weight:600;font-family:var(--mono);color:var(--red)">$3,200/mo</div>
        <div style="font-size:12px;color:var(--t3);margin-top:3px">Estimated · 78% confidence · <span class="badge amber" style="vertical-align:middle">EST</span></div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title">Key Evidence</div>
        <div class="evidence-panel">
          <div class="evidence-hd"><span>Metric</span><span>Current</span><span>Baseline</span><span>Variance</span><span>Source</span></div>
          <div class="evidence-row"><span>RPLH · Tue dinner</span><span class="mono var-down" data-skc="rplh-current">$31.40</span><span class="mono" data-skc="rplh-baseline">$38.20</span><span class="mono var-down">−$6.80</span><span><span class="source-tag">Toast</span></span></div>
          <div class="evidence-row"><span>Server hours</span><span class="mono var-down">28 hrs</span><span class="mono">22 hrs</span><span class="mono var-down">+6 excess</span><span><span class="source-tag">7shifts</span></span></div>
          <div class="evidence-row"><span>Cover count</span><span class="mono">87</span><span class="mono">98</span><span class="mono var-warn">−11</span><span><span class="source-tag">Toast</span></span></div>
          <div class="evidence-row"><span>Avg check</span><span class="mono var-up" data-skc="avg-check">$53.10</span><span class="mono" data-skc="avg-check-baseline">$52.40</span><span class="mono var-up">+$0.70 ✓</span><span><span class="source-tag">Toast</span></span></div>
        </div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title">Calculation</div>
        <div class="calc-box">
          <div class="calc-lines">6 excess hours/night
× $23 blended rate
× 4 nights/week
× 4.33 weeks</div>
          <div class="calc-total">= $3,200/mo <span class="badge amber" style="vertical-align:middle">EST</span></div>
        </div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title">Recommended Action</div>
        <div class="step-list">
          <div class="step-item"><div class="step-num">1</div><div class="step-text">Open 7shifts</div></div>
          <div class="step-item"><div class="step-num">2</div><div class="step-text">Go to Oakland → Tuesday Dinner</div></div>
          <div class="step-item"><div class="step-num">3</div><div class="step-text">Remove 5 PM–10 PM server shift</div></div>
          <div class="step-item"><div class="step-num">4</div><div class="step-text">Confirm manager coverage</div></div>
          <div class="step-item"><div class="step-num">5</div><div class="step-text">Repeat for Wednesday and Berkeley</div></div>
          <div class="step-item"><div class="step-num">6</div><div class="step-text">Monitor RPLH next Tuesday in SKC</div></div>
        </div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title">Verification</div>
        <div class="verify-box" style="margin-bottom:0">
          <div class="verify-label">Verification</div>
          <div class="verify-text">Target: RPLH → $36.50+ in 2 weeks<br>Guardrails: avg check, ticket time, review rating</div>
        </div>
      </div>
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" onclick="closeDrawer();showScreen('actions',null,'Actions')">Assign Recovery Action →</button>
        <button class="btn btn-secondary btn-sm" onclick="showDemoToast('Opening 7shifts → Oakland → Tuesday Dinner','blue')">Open in 7shifts</button>
        <button class="btn btn-ghost btn-sm" onclick="showDemoToast('Report sent to GM — they will receive it before service','blue')">Send to GM</button>
      </div>`
  },
  leak2: {
    title: 'Evidence · Grilled Salmon Margin Leak',
    html: `
      <div class="drawer-section">
        <div class="drawer-section-title">Impact</div>
        <div style="font-size:22px;font-weight:600;font-family:var(--mono);color:var(--amber)">$2,100/mo</div>
        <div style="font-size:12px;color:var(--t3);margin-top:3px">Estimated · 71% confidence · <span class="badge amber" style="vertical-align:middle">EST</span></div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title">Key Evidence</div>
        <div class="evidence-panel">
          <div class="evidence-hd"><span>Metric</span><span>Current</span><span>Target</span><span>Variance</span><span>Source</span></div>
          <div class="evidence-row"><span>CM %</span><span class="mono var-down">38.2%</span><span class="mono">61.2%</span><span class="mono var-down">−23 pts</span><span><span class="source-tag">Recipe</span></span></div>
          <div class="evidence-row"><span>Menu price</span><span class="mono var-down">$24.00</span><span class="mono">$26.40</span><span class="mono var-down">−$2.40</span><span><span class="source-tag">Toast</span></span></div>
          <div class="evidence-row"><span>Item cost</span><span class="mono var-down">$14.80</span><span class="mono">$12.80</span><span class="mono var-down">+$2.00</span><span><span class="source-tag">Recipe</span></span></div>
          <div class="evidence-row"><span>Volume</span><span class="mono">94/wk</span><span class="mono">—</span><span class="mono">#4 by vol</span><span><span class="source-tag">Toast</span></span></div>
        </div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title">Calculation</div>
        <div class="calc-box">
          <div class="calc-lines">CM gap: 61.2% − 38.2% = 23 pts
Per-plate gap: $24 × 23% = $5.52/cover
94 covers/wk × $5.52 × 4.33 wks</div>
          <div class="calc-total">= $2,249/mo gap<br>At $27 reprice: ~$2,100/mo recovery <span class="badge amber" style="vertical-align:middle">EST</span></div>
        </div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title">Recommended Action</div>
        <div class="step-list">
          <div class="step-item"><div class="step-num">1</div><div class="step-text">Open Toast POS → Menu Management</div></div>
          <div class="step-item"><div class="step-num">2</div><div class="step-text">Find Grilled Salmon → Edit price</div></div>
          <div class="step-item"><div class="step-num">3</div><div class="step-text">Update from $24.00 → $27.00</div></div>
          <div class="step-item"><div class="step-num">4</div><div class="step-text">Apply to all 4 locations</div></div>
          <div class="step-item"><div class="step-num">5</div><div class="step-text">Monitor CM % and volume for 3 weeks</div></div>
        </div>
      </div>
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" onclick="closeDrawer();showScreen('actions',null,'Actions')">Assign Recovery Action →</button>
        <button class="btn btn-secondary btn-sm" onclick="showDemoToast('Opening Toast POS → Menu Management → Grilled Salmon','blue')">Open in Toast</button>
        <button class="btn btn-ghost btn-sm" onclick="showDemoToast('Comparable East Bay proteins: Branzino $28, Duck Confit $29, Halibut $31','blue')">Compare Similar Items</button>
      </div>`
  },
  action1: {
    title: 'Action A001 · Remove Server · Oakland',
    html: `
      <div class="drawer-section">
        <div class="drawer-section-title">Details</div>
        <div class="card-sm mb-8" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div><div class="label mb-4">Status</div><span class="badge blue">In Progress</span></div>
          <div><div class="label mb-4">Owner</div><div style="font-size:13px;font-weight:500;color:var(--t1)">Sarah Chen</div></div>
          <div><div class="label mb-4">Location</div><div style="font-size:13px;color:var(--t2)">Oakland</div></div>
          <div><div class="label mb-4">Due</div><div style="font-size:13px;font-family:var(--mono);color:var(--amber)">Today by 3 PM</div></div>
          <div><div class="label mb-4">System</div><div style="font-size:13px;color:var(--t2)">7shifts</div></div>
          <div><div class="label mb-4">Impact</div><div style="font-size:13px;font-family:var(--mono);color:var(--amber)" data-tr="open-opportunity" data-skc="labor-oakland">$1,600/mo</div></div>
          <div style="grid-column:1/-1"><div class="label mb-4">Verification Metric</div><div style="font-size:13px;font-family:var(--mono);color:var(--t2)">RPLH &gt; $36.50 within 2 Tuesdays</div></div>
        </div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title">Steps</div>
        <div class="step-list">
          <div class="step-item"><div class="step-num" style="background:var(--green-d);border-color:var(--green-b);color:var(--green)">✓</div><div class="step-text" style="color:var(--t3)">Open 7shifts</div></div>
          <div class="step-item"><div class="step-num" style="background:var(--green-d);border-color:var(--green-b);color:var(--green)">✓</div><div class="step-text" style="color:var(--t3)">Go to Oakland → Tuesday Dinner</div></div>
          <div class="step-item"><div class="step-num">3</div><div class="step-text">Remove 5 PM–10 PM server shift</div></div>
          <div class="step-item"><div class="step-num">4</div><div class="step-text">Confirm manager coverage</div></div>
          <div class="step-item"><div class="step-num">5</div><div class="step-text">Monitor RPLH next Tuesday in SKC → Labor</div></div>
        </div>
      </div>
      <div class="verify-box">
        <div class="verify-label">Verification</div>
        <div class="verify-text">RPLH should move from $31.40 → $36.50+ within 2 Tuesdays.<br>Guardrails: avg check above $50 · ticket time below 16 min</div>
      </div>
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" onclick="showDemoToast('Action marked as implemented — monitoring will begin next sync','green');closeDrawer()">Mark as Implemented</button>
        <button class="btn btn-secondary btn-sm" onclick="showDemoToast('Opening 7shifts → Oakland → Tuesday Dinner','blue')">Open in 7shifts</button>
        <button class="btn btn-ghost btn-sm" onclick="showDemoToast('Report sent to GM — they will receive it before service','blue')">Send to GM</button>
        <button class="btn btn-ghost btn-sm" onclick="showDemoToast('Snoozed for 7 days','blue')">Snooze</button>
      </div>`
  },
  action3: {
    title: 'Action A003 · Reprice Salmon',
    html: `
      <div class="drawer-section">
        <div class="drawer-section-title">Details</div>
        <div class="card-sm mb-8" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div><div class="label mb-4">Status</div><span class="badge outline">Open</span></div>
          <div><div class="label mb-4">Owner</div><div style="font-size:13px;font-weight:500;color:var(--t1)">Marcus R.</div></div>
          <div><div class="label mb-4">Location</div><div style="font-size:13px;color:var(--t2)">All Locations</div></div>
          <div><div class="label mb-4">Due</div><div style="font-size:13px;font-family:var(--mono);color:var(--t2)">Friday</div></div>
          <div><div class="label mb-4">System</div><div style="font-size:13px;color:var(--t2)">Toast POS</div></div>
          <div><div class="label mb-4">Impact</div><div style="font-size:13px;font-family:var(--mono);color:var(--green)">$2,100/mo</div></div>
          <div style="grid-column:1/-1"><div class="label mb-4">Verification Metric</div><div style="font-size:13px;font-family:var(--mono);color:var(--t2)">Salmon CM &gt; 45% within 3 weeks</div></div>
        </div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title">Steps</div>
        <div class="step-list">
          <div class="step-item"><div class="step-num">1</div><div class="step-text">Open Toast POS → Menu Management</div></div>
          <div class="step-item"><div class="step-num">2</div><div class="step-text">Find Grilled Salmon → Edit price</div></div>
          <div class="step-item"><div class="step-num">3</div><div class="step-text">Update from $24.00 → $27.00</div></div>
          <div class="step-item"><div class="step-num">4</div><div class="step-text">Apply to all 4 locations</div></div>
          <div class="step-item"><div class="step-num">5</div><div class="step-text">Monitor CM % and volume for 3 weeks in SKC → Menu</div></div>
        </div>
      </div>
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" onclick="showDemoToast('Action marked as implemented — monitoring will begin next sync','green');closeDrawer()">Mark as Implemented</button>
        <button class="btn btn-secondary btn-sm" onclick="showDemoToast('Opening Toast POS → Menu Management → Grilled Salmon','blue')">Open in Toast</button>
        <button class="btn btn-ghost btn-sm" onclick="openDrawer('roi-calc')">View Calculation</button>
      </div>`
  },
  action4: {
    title: 'Action A004 · Friday Lunch Line Review',
    html: `
      <div class="drawer-section">
        <div class="drawer-section-title">Details</div>
        <div class="card-sm mb-8" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div><div class="label mb-4">Status</div><span class="badge outline">Open</span></div>
          <div><div class="label mb-4">Owner</div><div style="font-size:13px;font-weight:500;color:var(--t1)">Jamie L.</div></div>
          <div><div class="label mb-4">Location</div><div style="font-size:13px;color:var(--t2)">Berkeley</div></div>
          <div><div class="label mb-4">Due</div><div style="font-size:13px;font-family:var(--mono);color:var(--t2)">Tomorrow</div></div>
          <div><div class="label mb-4">System</div><div style="font-size:13px;color:var(--t2)">KDS</div></div>
          <div><div class="label mb-4">Impact</div><div style="font-size:13px;font-family:var(--mono);color:var(--green)">$1,540/mo</div></div>
          <div style="grid-column:1/-1"><div class="label mb-4">Verification Metric</div><div style="font-size:13px;font-family:var(--mono);color:var(--t2)">Ticket time &lt; 12 min for 2 consecutive Fridays</div></div>
        </div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title">Steps</div>
        <div class="step-list">
          <div class="step-item"><div class="step-num">1</div><div class="step-text">Arrive 30 minutes before Friday lunch service</div></div>
          <div class="step-item"><div class="step-num">2</div><div class="step-text">Walk each kitchen station — check mise en place and prep completeness</div></div>
          <div class="step-item"><div class="step-num">3</div><div class="step-text">Identify handoff friction between positions</div></div>
          <div class="step-item"><div class="step-num">4</div><div class="step-text">Note findings and implement one process change before service starts</div></div>
          <div class="step-item"><div class="step-num">5</div><div class="step-text">Monitor KDS ticket times during service</div></div>
          <div class="step-item"><div class="step-num">6</div><div class="step-text">Report back to SKC → Throughput after close</div></div>
        </div>
      </div>
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" onclick="showDemoToast('Action marked as implemented — monitoring will begin next sync','green');closeDrawer()">Mark as Implemented</button>
        <button class="btn btn-ghost btn-sm" onclick="showDemoToast('Report sent to GM — they will receive it before service','blue')">Send to GM</button>
      </div>`
  },
  'value-defs': {
    title: 'Value Category Definitions',
    html: `
      <div class="drawer-section">
        <div class="drawer-section-title">How SKC classifies every dollar</div>
        <div class="ac-meta" style="background:var(--hover);border:1px solid var(--border);border-radius:var(--r-md);padding:12px 14px;display:flex;flex-direction:column;gap:12px">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span class="output-chip ot-ver" title="VER = Verified — monitoring window closed, all guardrails passed" data-skc="verified-savings-mo">$420/mo verified</span> <span class="da-badge verified" style="display:none">Verified Savings</span></div>
            <div style="font-size:12px;color:var(--t2);line-height:1.6">Action implemented, monitoring window closed, all guardrails passed. <strong>Counted in ROI.</strong> This is the only category that appears in the 4.1× ROI calculation.</div>
          </div>
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span class="da-badge active-recovery" style="background:var(--blue-d);color:var(--blue);border:1px solid var(--blue-b)">Active Recovery</span></div>
            <div style="font-size:12px;color:var(--t2);line-height:1.6">Action assigned or monitoring in progress. Savings are estimated. <strong>Not counted in ROI yet.</strong> Becomes Verified Savings if monitoring closes with guardrails intact.</div>
          </div>
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span class="da-badge estimated">Open Weekly Exposure</span></div>
            <div style="font-size:12px;color:var(--t2);line-height:1.6">Weekly exposure detected and sized, but no action has been created yet. <strong>Not counted in ROI.</strong> Becomes Active Recovery once an action is assigned and monitoring starts.</div>
          </div>
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="font-size:10px;padding:2px 7px;border-radius:4px;background:var(--red-d);color:var(--red);border:1px solid var(--red-b)">Blocked Value</span></div>
            <div style="font-size:12px;color:var(--t2);line-height:1.6">A guardrail failed during monitoring, or source data quality is insufficient to verify the outcome. <strong>Not counted in ROI.</strong> Cannot be promoted until the block condition resolves.</div>
          </div>
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="font-size:10px;padding:2px 7px;border-radius:4px;background:var(--hover);color:var(--t3);border:1px solid var(--border)">Modeled Estimate</span></div>
            <div style="font-size:12px;color:var(--t2);line-height:1.6">Forward-looking scenario output. Based on model assumptions, not measured data. <strong>Never counted in ROI.</strong> Used in Scenario Simulator and Menu Pricing to explore what-if outcomes before committing.</div>
          </div>
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span class="badge gray" style="font-size:10px">Needs More Data</span></div>
            <div style="font-size:12px;color:var(--t2);line-height:1.6">A required data source is missing or stale. SKC cannot make a confident recommended action. <strong>Not counted in ROI.</strong> Confidence upgrades once the data issue is resolved.</div>
          </div>
        </div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title">The rule that never changes</div>
        <div class="verify-box" style="margin-bottom:0"><div class="verify-text">Only <strong>Verified Savings</strong> count toward SKC's ROI calculation. Every other category is shown for transparency, not credit. SKC will never claim a dollar as verified until post-action monitoring confirms it with all guardrails passing.</div></div>
      </div>`
  },
  'roi-calc': {
    title: 'ROI Calculation · May 2026',
    html: `
      <div class="drawer-section">
        <div class="drawer-section-title">What counts toward ROI</div>
        <div class="evidence-panel">
          <div class="evidence-hd"><span>Category</span><span>Amount</span><span>Counts?</span><span>Why</span></div>
          <div class="evidence-row"><span><span class="output-chip ot-ver" title="VER = Verified — monitoring window closed, all guardrails passed" data-skc="verified-savings-mo">$420/mo verified</span> <span class="da-badge verified" style="display:none">Verified Savings</span></span><span class="mono green">$1,240/mo</span><span class="mono green">✓ Yes</span><span>Post-monitoring confirmed · guardrails passed</span></div>
          <div class="evidence-row"><span><span class="da-badge active-recovery" style="background:var(--blue-d);color:var(--blue);border:1px solid var(--blue-b)">Active Recovery</span></span><span class="mono" style="color:var(--t3)" data-skc="active-recovery">$4,120/mo</span><span class="mono" style="color:var(--amber)">✗ No</span><span>Monitoring window not closed</span></div>
          <div class="evidence-row"><span><span class="da-badge estimated">Open Weekly Exposure</span></span><span class="mono" style="color:var(--t3)">$6,840/mo run-rate</span><span class="mono" style="color:var(--amber)">✗ No</span><span>Not yet actioned — run-rate projections only, scope-adjusted</span></div>
          <div class="evidence-row"><span><span style="font-size:10px;padding:2px 7px;border-radius:4px;background:var(--red-d);color:var(--red);border:1px solid var(--red-b)">Blocked Value</span></span><span class="mono" style="color:var(--t3)">$0/mo</span><span class="mono" style="color:var(--red)">✗ No</span><span>Failed guardrails or data quality</span></div>
        </div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title">ROI Formula</div>
        <div class="verify-box" style="margin-bottom:0">
          <div class="verify-text" style="font-family:var(--mono);font-size:13px;line-height:2">
            Verified Savings = $1,240 / mo<br>
            Subscription Cost = $299 / mo<br>
            ─────────────────────────────<br>
            ROI = $1,240 ÷ $299 = <strong style="color:var(--green)">4.1×</strong><br>
            Net gain = $1,240 − $299 = <strong style="color:var(--green)">$941 / mo</strong>
          </div>
        </div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title">What is excluded and why</div>
        <div class="dr-card-section-text" style="font-size:12.5px;color:var(--t2);line-height:1.7">
          Active Recovery, Open Weekly Exposure, and Blocked Value are <strong>never included</strong> in the ROI figure — even if the recovery is real and likely. SKC uses the most conservative defensible number: only what has been confirmed by post-action monitoring with all guardrails passing. This ensures the 4.1× is not inflated by projections, estimates, or actions that haven't closed.
        </div>
      </div>`
  }
};

function openDrawer(key) {
  const d = drawerData[key];
  if (!d) return;
  document.getElementById('drawerTitle').textContent = d.title;
  document.getElementById('drawerBody').innerHTML = d.html;
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('open');
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
}

// ─── ASK SKC CHAT ─────────────────────────────────────────
// ── ASK SKC ───────────────────────────────────────────
// ── ASK SKC RESPONSE HELPERS ──────────────────────────────
function mkSection(label) {
  return `<div class="r-section-label">${label}</div>`;
}
function mkEv(rows) {
  const hd = `<div class="r-ev-hd"><span>Metric</span><span>Current</span><span>Baseline</span><span>Variance</span><span>Source</span></div>`;
  const body = rows.map(r => `<div class="r-ev-row"><span class="r-ev-metric">${r[0]}</span><span class="r-mono ${r[4]||''}">${r[1]}</span><span class="r-mono r-muted">${r[2]}</span><span class="r-mono ${r[5]||''}">${r[3]}</span><span class="r-src">${r[6]||''}</span></div>`).join('');
  return `<div class="r-ev-table">${hd}${body}</div>`;
}
function mkCalc(lines, total) {
  return `<div class="r-calc"><div class="r-calc-lines">${lines.replace(/\n/g,'<br>')}</div><div class="r-calc-result">${total}</div></div>`;
}
function mkConf(items, warn) {
  const typeMap = { det:'DET · Direct', est:'EST · Estimated', stale:'Stale', missing:'Missing' };
  const badgeMap = { det:'da-badge direct', est:'da-badge estimated', stale:'badge amber', missing:'badge red' };
  const html = items.map(it => `<div class="r-conf-item"><span class="${badgeMap[it[0]]||'badge gray'}" style="font-size:9px;flex-shrink:0">${typeMap[it[0]]||it[0]}</span><span class="r-conf-label">${it[1]}</span></div>`).join('');
  const warnHtml = warn ? `<div class="r-conf-warn"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span>${warn}</span></div>` : '';
  return `<div class="r-conf-items">${html}</div>${warnHtml}`;
}
function mkVerify(rule, paths) {
  return `<div class="r-verify-rule">${rule}</div><div class="r-verify">${paths.map(p=>`<div class="r-verify-path"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>${p}</div>`).join('')}</div>`;
}
function mkAction(title, steps) {
  return `<div class="r-action"><div class="r-action-title">${title}</div><div class="r-action-steps">${steps.map((s,i)=>`<div class="r-step"><span class="r-step-n">${i+1}</span><span>${s}</span></div>`).join('')}</div></div>`;
}
function mkWhere(paths) {
  return `<div class="r-where">${paths.map(p=>`<div class="r-where-item"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>${p}</div>`).join('')}</div>`;
}
function mkRisk(text) {
  return `<div class="r-risk"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg><span>${text}</span></div>`;
}
function mkCtaRow(btns) {
  return `<div class="r-cta-row">${btns.map(b=>`<button class="btn ${b.cls||'btn-ghost'} btn-sm" onclick="${b.fn}">${b.label}</button>`).join('')}</div>`;
}

const RESPONSES = {

  labor: () => {
    const lab = OPPORTUNITIES.labor;
    const tb  = calculateTimeBasisImpact(lab);
    return `
    ${mkSection('Direct Answer')}
    <p>Labor cost is high because Tuesday and Wednesday dinner schedules were not adjusted after covers normalised in April. The restaurant is running March-level staffing for May-level demand.</p>
    <p class="r-stat">Labor cost: <span class="r-hl red">${SKC_STATE.fmt.pct(SKC_STATE.metrics.labor_pct)}</span> — <span class="r-hl red">${(SKC_STATE.metrics.labor_pct - SKC_STATE.metrics.labor_pct_target).toFixed(1)} points</span> above the ${SKC_STATE.metrics.labor_pct_target}% target. RPLH is the diagnostic signal — excess labour hours are the lever.</p>

    ${mkSection('Evidence')}
    ${mkEv([
      ['RPLH · Tue + Wed dinner', formatCurrencyExact(SKC_STATE.metrics.rplh_current)+'/hr', formatCurrencyExact(SKC_STATE.metrics.rplh_baseline)+'/hr', '−'+formatCurrencyExact(SKC_STATE.metrics.rplh_current - SKC_STATE.metrics.rplh_baseline > 0 ? 0 : SKC_STATE.metrics.rplh_baseline - SKC_STATE.metrics.rplh_current)+'/hr', 'r-red','r-red','Toast POS · DET'],
      ['Scheduled server hrs / night', SKC_STATE.metrics.hours_scheduled+' hrs', SKC_STATE.metrics.hours_needed+' hrs needed', '+'+SKC_STATE.metrics.hours_excess+' excess', 'r-red','r-red','7shifts · DET'],
      ['Cover count · Tue dinner', SKC_STATE.metrics.covers+' covers', SKC_STATE.metrics.covers_baseline+' baseline', '−'+(SKC_STATE.metrics.covers_baseline - SKC_STATE.metrics.covers), '','r-amber','Toast POS · DET'],
      ['Average check', formatCurrencyExact(SKC_STATE.metrics.avg_check), formatCurrencyExact(SKC_STATE.metrics.avg_check_baseline), '+'+formatCurrencyExact(SKC_STATE.metrics.avg_check - SKC_STATE.metrics.avg_check_baseline)+' ✓', 'r-green','r-green','Toast POS · DET'],
    ])}
    <p class="r-note">RPLH is diagnostic — it proves the inefficiency. The dollar recovery comes from excess hours × wage, not from the RPLH gap directly.</p>

    ${mkSection('Calculation — Time Basis')}
    ${mkCalc(tb.formula_lines.join('\n'), `= ${tb.fmt_run_rate} · Oakland only · ${lab.impact.affected_services_per_week} affected services/wk <span class="r-badge amber">EST · ${lab.confidence_score}%</span>`)}
    <div class="r-impact-chain-block">
      <div class="r-chain-row"><span class="r-chain-label">Per dinner service</span><span class="r-chain-val">${tb.fmt_per_service}</span><span class="r-chain-basis">5 excess hrs × $18.40/hr</span></div>
      <div class="r-chain-row"><span class="r-chain-label">Services / week</span><span class="r-chain-val">${lab.impact.affected_services_per_week}</span><span class="r-chain-basis">${lab.impact.affected_services_basis}</span></div>
      <div class="r-chain-row"><span class="r-chain-label">Weekly exposure</span><span class="r-chain-val">${tb.fmt_weekly}</span><span class="r-chain-basis">at current staffing levels</span></div>
      <div class="r-chain-row r-chain-row-total"><span class="r-chain-label">Monthly run-rate</span><span class="r-chain-val">${tb.fmt_run_rate}</span><span class="r-chain-basis">Oakland only · NOT counted in ROI</span></div>
      <div class="r-chain-row r-chain-row-roi"><span class="r-chain-label">Verified savings</span><span class="r-chain-val">${tb.fmt_verified}</span><span class="r-chain-basis">Requires 2 Tuesdays at RPLH ≥ ${formatCurrencyExact(SKC_STATE.metrics.rplh_target)}</span></div>
    </div>

    ${mkSection('Confidence')}
    ${mkConf([
      ['det', 'RPLH and cover count from Toast POS — direct measurement, ' + SKC_STATE.data_quality.sources.toast.lastSync],
      ['det', 'Scheduled hours from 7shifts — ' + SKC_STATE.data_quality.sources.shifts.lastSync],
      ['est', 'Fully loaded labor cost ($37/hr) covers base wage + payroll tax + workers comp + benefits — actual varies by role and location'],
      ['stale','7shifts last synced ' + SKC_STATE.data_quality.sources.shifts.lastSync + ' — confidence reduced from 85% to ' + lab.confidence_score + '%'],
    ], lab.source_data.dq_warning)}

    ${mkSection('Recommendation')}
    ${mkAction('Remove one 5 PM–10 PM server shift at Oakland, Tuesday and Wednesday', lab.recommendation.playbook)}

    ${mkSection('Verification')}
    ${mkVerify('RPLH ≥ ' + formatCurrencyExact(SKC_STATE.metrics.rplh_target) + '/hr for 2 consecutive Tuesday dinners at Oakland. All 4 guardrails passing throughout. Recovery is ' + tb.fmt_verified + ' only after monitoring closes.',
      ['Recovery is active recovery until monitoring passes — it does not count as verified recovery until the window closes', 'Counted in ROI only after RPLH target and guardrails hold for 2 Tuesdays'])}

    ${mkSection('Where to find it')}
    ${mkWhere(['Profit Recovery → Labor card → time-basis breakdown', 'Actions → Monitoring tab → A006 progress', 'Data Quality → 7shifts → reconnect to restore confidence'])}
    ${mkCtaRow([
      {label:'Assign Recovery Action', cls:'btn-primary', fn:"closeAskPanel();openCA('leak1')"},
      {label:'View Evidence', fn:"closeAskPanel();openEvDrawer('leak1')"},
      {label:'Open Data Quality', fn:"closeAskPanel();showScreen('settings',null,'Data Quality')"},
    ])}`;
  },

  gm: () => {
    const lab = OPPORTUNITIES.labor;
    const tb  = calculateTimeBasisImpact(lab);
    return `
    ${mkSection('Direct Answer')}
    <p>Sarah C. (GM Oakland + Berkeley) has one action before 3 PM today: remove the 5 PM–10 PM server shift from Oakland Tuesday dinner in 7shifts. 3 minutes. Stops <span class="r-hl red">${tb.fmt_per_service}</span> in excess labour tonight.</p>
    <p class="r-note">This is a per-service impact — one dinner shift. The monthly run-rate is ${tb.fmt_run_rate} (Oakland only) if the pattern continues across all 4 affected services per week.</p>

    ${mkSection('Evidence')}
    ${mkEv([
      ['Per-service exposure tonight', tb.fmt_per_service, '—', 'excess labour cost · 1 service', 'r-red','r-red','SKC model · EST'],
      ['RPLH · current', formatCurrencyExact(SKC_STATE.metrics.rplh_current)+'/hr', formatCurrencyExact(SKC_STATE.metrics.rplh_baseline)+'/hr', '−'+formatCurrencyExact(SKC_STATE.metrics.rplh_baseline - SKC_STATE.metrics.rplh_current)+'/hr · 6 weeks', 'r-red','r-red','Toast POS · DET'],
      ['Table turns', SKC_STATE.metrics.table_turns+' min', '≤ '+SKC_STATE.metrics.table_turns_limit+' min', SKC_STATE.metrics.table_turns_limit - SKC_STATE.metrics.table_turns+' min margin · Watch', '','r-amber','Toast POS · DET'],
      ['Average check', formatCurrencyExact(SKC_STATE.metrics.avg_check), '≥ $50 guardrail', '✓ safe to proceed', 'r-green','r-green','Toast POS · DET'],
    ])}

    ${mkSection('Time Basis')}
    <div class="r-impact-chain-block">
      <div class="r-chain-row"><span class="r-chain-label">Tonight (1 service)</span><span class="r-chain-val r-chain-highlight">${tb.fmt_per_service}</span><span class="r-chain-basis">excess labour · 1 dinner shift</span></div>
      <div class="r-chain-row"><span class="r-chain-label">This week (4 services)</span><span class="r-chain-val">${tb.fmt_weekly}</span><span class="r-chain-basis">Tue + Wed × Oakland + Berkeley</span></div>
      <div class="r-chain-row"><span class="r-chain-label">Monthly run-rate</span><span class="r-chain-val">${tb.fmt_run_rate}</span><span class="r-chain-basis">Oakland only · EST · not verified yet</span></div>
    </div>

    ${mkSection('Recommendation')}
    ${mkAction('Sarah — complete before 3 PM today', lab.recommendation.playbook.slice(1))}

    ${mkSection('Verification')}
    ${mkVerify('Check RPLH at end-of-night Toast sync. Target ' + formatCurrencyExact(SKC_STATE.metrics.rplh_target) + '+. Recovery is not verified until 2 consecutive Tuesdays pass guardrails.',
      ['This action stops the per-service exposure tonight', 'The monthly run-rate is confirmed only after monitoring closes'])}

    ${mkSection('Where to find it')}
    ${mkWhere(['Actions → Open Actions → A006 (due today)', 'Profit Recovery → Labor card → per-service breakdown'])}
    ${mkCtaRow([
      {label:'Assign Recovery Action', cls:'btn-primary', fn:"closeAskPanel();openCA('leak1')"},
      {label:'View Actions', fn:"closeAskPanel();showScreen('actions',null,'Actions')"},
    ])}`;
  },

  evidence: () => {
    const lab = OPPORTUNITIES.labor;
    const calc = calculateLaborOpportunity(lab);
    return `
    ${mkSection('Direct Answer')}
    <p>The ${formatRunRate(lab.impact.monthly_run_rate)} labor run-rate is derived from excess labour hours × blended wage, not from the RPLH gap directly. RPLH is the diagnostic signal. Here is the full calculation.</p>

    ${mkSection('Evidence')}
    ${mkEv([
      ['RPLH · Tue dinner · Oakland', formatCurrencyExact(SKC_STATE.metrics.rplh_current)+'/hr', formatCurrencyExact(SKC_STATE.metrics.rplh_baseline)+'/hr', '−'+formatCurrencyExact(SKC_STATE.metrics.rplh_baseline - SKC_STATE.metrics.rplh_current)+'/hr · DET','r-red','r-red','Toast POS'],
      ['Scheduled server hrs / night', SKC_STATE.metrics.hours_scheduled+' hrs', SKC_STATE.metrics.hours_needed+' hrs needed', '+'+SKC_STATE.metrics.hours_excess+' excess · DET', 'r-red','r-red','7shifts'],
      ['Blended wage rate', formatCurrencyExact(SKC_STATE.metrics.wage_blended)+'/hr', '—', 'Oakland min wage model · EST', '','','SKC model'],
      ['Average check', formatCurrencyExact(SKC_STATE.metrics.avg_check), formatCurrencyExact(SKC_STATE.metrics.avg_check_baseline), '+'+formatCurrencyExact(SKC_STATE.metrics.avg_check - SKC_STATE.metrics.avg_check_baseline)+' ✓', 'r-green','r-green','Toast POS'],
    ])}

    ${mkSection('Calculation')}
    ${mkCalc(calc.formula_line_1 + '\n' + calc.formula_line_2 + '\n' + calc.formula_line_3,
      formatCurrency(lab.impact.monthly_open_opportunity) + '/mo · Oakland only · ' + lab.output_type + ' · ' + lab.confidence_score + '%')}

    ${mkSection('Time Basis')}
    <div class="r-impact-chain-block">
      <div class="r-chain-row"><span class="r-chain-label">Per dinner service</span><span class="r-chain-val r-chain-highlight">${formatPerService(lab.impact.per_service_impact, 'dinner service')}</span><span class="r-chain-basis">5 excess hrs × ${formatCurrencyExact(SKC_STATE.metrics.wage_blended)}/hr</span></div>
      <div class="r-chain-row"><span class="r-chain-label">Affected services</span><span class="r-chain-val">${lab.impact.affected_services_per_week} services/wk</span><span class="r-chain-basis">Tue + Wed × 2 locations</span></div>
      <div class="r-chain-row"><span class="r-chain-label">Weekly exposure</span><span class="r-chain-val">${formatWeekly(lab.impact.weekly_exposure)}</span><span class="r-chain-basis">at current staffing</span></div>
      <div class="r-chain-row r-chain-row-total"><span class="r-chain-label">Monthly run-rate</span><span class="r-chain-val">${formatRunRate(lab.impact.monthly_run_rate)}</span><span class="r-chain-basis">both locations · NOT counted in ROI</span></div>
      <div class="r-chain-row r-chain-row-roi"><span class="r-chain-label">Verified savings</span><span class="r-chain-val">${formatVerifiedValue(lab.impact.monthly_verified_savings) || '$0 verified'}</span><span class="r-chain-basis">requires monitoring to pass</span></div>
    </div>

    ${mkSection('Confidence')}
    ${mkConf([
      ['det','RPLH from Toast POS — direct arithmetic · live'],
      ['det','Scheduled hours from 7shifts — stale ' + SKC_STATE.data_quality.sources.shifts.lastSync],
      ['est','Wage rate modelled from Oakland minimum wage — actual may vary ±8%'],
      ['stale','7shifts stale — confidence reduced from 85% to ' + lab.confidence_score + '%'],
    ])}

    ${mkSection('Where to find it')}
    ${mkWhere(['Profit Recovery → Labor → Evidence tab', 'Evidence Drawer → Impact Breakdown section', 'Profit Recovery → Calculation section'])}
    ${mkCtaRow([
      {label:'View Evidence Drawer', cls:'btn-primary', fn:"closeAskPanel();openEvDrawer('leak1')"},
      {label:'Open Profit Recovery', fn:"closeAskPanel();showScreen('leaks',null,'Profit Recovery')"},
    ])}`;
  },

  reprice: () => {
    const sal = OPPORTUNITIES.salmon;
    const tb  = calculateTimeBasisImpact(sal);
    const calc = calculateSalmonOpportunity(sal);
    return `
    ${mkSection('Direct Answer')}
    <p>Reprice Grilled Salmon from ${formatCurrencyExact(sal.calculation.formula_inputs.current_price)} to ${formatCurrencyExact(sal.calculation.formula_inputs.target_price)}. The estimated margin recovery is <span class="r-hl amber">${tb.fmt_per_service}</span> per plate — ${sal.calculation.formula_inputs.covers_per_week} covers/week compounds to ${tb.fmt_run_rate} monthly run-rate.</p>
    <p class="r-note">This is an estimated run-rate — not verified recovery. Nothing counts in ROI until CM ≥ 45% for 3 consecutive weeks with volume drop < 15%.</p>

    ${mkSection('Evidence')}
    ${mkEv([
      ['Salmon CM %', sal.calculation.diagnostic_metrics.current_cm_pct+'%', sal.calculation.diagnostic_metrics.menu_avg_cm_pct+'% avg', '−'+(sal.calculation.diagnostic_metrics.menu_avg_cm_pct - sal.calculation.diagnostic_metrics.current_cm_pct).toFixed(1)+' pts', 'r-red','r-red','Recipe Cost · DET'],
      ['CM gap / plate', formatCurrencyExact(sal.calculation.formula_inputs.cm_gap_per_plate), '—', 'at current pricing','r-red','r-red','SKC model'],
      ['Salmon covers / week', sal.calculation.formula_inputs.covers_per_week+' covers', '—', '#4 by volume', '','','Toast POS · DET'],
      ['Current menu price', formatCurrencyExact(sal.calculation.formula_inputs.current_price), formatCurrencyExact(sal.calculation.formula_inputs.target_price)+' target', '−'+formatCurrencyExact(sal.calculation.formula_inputs.target_price - sal.calculation.formula_inputs.current_price)+'/plate gap', 'r-red','r-red','Toast Menu'],
    ])}

    ${mkSection('Calculation')}
    ${mkCalc(calc.formula_line_1 + '\n' + calc.formula_line_2 + '\n' + calc.formula_line_3,
      formatRunRate(sal.impact.monthly_open_opportunity) + ' · ' + sal.output_type + ' · ' + sal.confidence_score + '%')}

    ${mkSection('Time Basis')}
    <div class="r-impact-chain-block">
      <div class="r-chain-row"><span class="r-chain-label">Per plate</span><span class="r-chain-val r-chain-highlight">${tb.fmt_per_service}</span><span class="r-chain-basis">CM gap at target price</span></div>
      <div class="r-chain-row"><span class="r-chain-label">Covers / week</span><span class="r-chain-val">${sal.calculation.formula_inputs.covers_per_week} covers/wk</span><span class="r-chain-basis">8-week rolling avg · DET</span></div>
      <div class="r-chain-row"><span class="r-chain-label">Weekly run-rate</span><span class="r-chain-val">${tb.fmt_weekly}</span><span class="r-chain-basis">before volume buffer</span></div>
      <div class="r-chain-row r-chain-row-total"><span class="r-chain-label">Monthly run-rate</span><span class="r-chain-val">${tb.fmt_run_rate}</span><span class="r-chain-basis">× 0.85 volume buffer · NOT counted in ROI</span></div>
      <div class="r-chain-row r-chain-row-roi"><span class="r-chain-label">Verified savings</span><span class="r-chain-val">$0 verified</span><span class="r-chain-basis">requires 3-week monitoring window</span></div>
    </div>

    ${mkSection('Confidence')}
    ${mkConf([
      ['det','Sales volume ('+sal.calculation.formula_inputs.covers_per_week+' covers/wk) from Toast POS · live'],
      ['stale','Recipe cost file '+SKC_STATE.data_quality.sources.menu.lastSync+' — item cost may have changed'],
      ['est','Volume retention modelled at '+(sal.calculation.formula_inputs.volume_buffer*100)+'% — actual unknown until reprice applied'],
    ], sal.source_data.dq_warning)}

    ${mkSection('Recommendation')}
    ${mkAction('Reprice Grilled Salmon '+formatCurrencyExact(sal.calculation.formula_inputs.current_price)+' → '+formatCurrencyExact(sal.calculation.formula_inputs.target_price)+' · requires owner approval', sal.recommendation.playbook)}

    ${mkSection('Verification')}
    ${mkVerify('CM ≥ 45% for 3 consecutive weeks after reprice. Volume drop < 15% (stays above 80 covers/week). Run-rate counts as verified recovery only after monitoring closes.',
      ['Monthly run-rate is estimated — not active recovery and not verified recovery', 'Counted in ROI only after 3-week monitoring window passes all conditions'])}

    ${mkSection('Where to find it')}
    ${mkWhere(['Profit Recovery → Menu card → per-plate breakdown', 'Actions → Approvals tab → pending owner sign-off', 'Evidence Drawer → Impact Breakdown section'])}
    ${mkCtaRow([
      {label:'Send for Approval', cls:'btn-primary', fn:"closeAskPanel();switchTab('execution','approvals');showScreen('actions',null,'Actions')"},
      {label:'View Evidence', fn:"closeAskPanel();openEvDrawer('leak2')"},
    ])}`;
  },

  // (v27) Menu Optimization — broader suite responses
  menuLeak: () => {
    return `
    ${mkSection('Direct Answer')}
    <p>Oakland's dinner menu mix is leaking estimated margin. Weighted avg CM is <span class="r-hl amber">$8.42/item</span> vs an 8-week baseline of <span class="r-hl">$9.13/item</span> — a <span class="r-hl amber">$0.71/item</span> shift driven by popular low-margin items.</p>
    <p class="r-note">Estimated exposure: 2,004 items × $0.71 = <span class="r-hl amber">~$1,420/mo [ESTIMATED]</span>. This is exposure, not verified savings. Recipe costs are stale 18d, so menu ROI cannot move to Verified Savings until food costs refresh.</p>

    ${mkSection('Quadrant distribution (top 9 dinner items)')}
    <p class="r-note">High profit · high sales: <strong>2</strong> · Low profit · high sales: <strong>3</strong> (incl. Truffle Fries Watch) · High profit · low sales: <strong>2</strong> · Low profit · low sales: <strong>2</strong>. The primary low-profit, high-sales items (Crispy + Burger) account for <span class="r-hl amber">30.6%</span> of dinner volume. Including Truffle Fries Watch, popular below-threshold items represent <span class="r-hl amber">46.4%</span>. Top 9 visible items + 273 other mapped dinner items reconcile to 2,004 total.</p>

    ${mkSection('Where the leak comes from')}
    ${mkEv([
      ['Low-profit, high-sales mix (primary)','−$0.46/item','baseline','30.6% of volume','r-amber','','SKC mix model · EST'],
      ['High-profit, low-sales under-promo','−$0.18/item','baseline','9.8% of volume','r-amber','','SKC mix model · EST'],
      ['Low-profit, low-sales items','−$0.07/item','baseline','5.7% of volume','','','SKC mix model · EST'],
      ['Total shift','−$0.71/item','—','×2,004 items','r-amber','r-amber','=$1,422.84/mo'],
    ])}

    ${mkSection('Top 3 money moves')}
    ${mkAction('Drive these from Menu Optimization', [
      'Review Crispy Chicken Sandwich price/portion · $5.80 CM vs $8.75 threshold · ~$300/28d [SIMULATED]',
      'Review Burger price/portion · $6.40 CM vs $8.75 threshold · ~$210/28d [SIMULATED]',
      'Promote Mushroom Risotto · $14.20 CM at 4.2% popularity · ~$355/28d [SIMULATED]',
    ])}
    <p class="r-note">Ready-approval lift (Crispy + Burger): <span class="r-hl amber">~$510/28d [SIMULATED]</span>. All scenario upside (incl. Risotto promo): <span class="r-hl amber">~$865/28d [SIMULATED]</span>. Neither is verified savings.</p>

    ${mkSection('What blocks verified savings')}
    ${mkVerify('Recipe cost file is stale 18d. Menu ROI verification needs fresh food cost + 28-day monitoring + guardrails (unit decline ≤ 7%, sentiment stable, refunds stable).',
      ['Estimated exposure does NOT count in ROI Proof.','Simulated lift does NOT count in ROI Proof.','Recipe cost refresh unblocks verification.'])}

    ${mkCtaRow([
      {label:'Open Menu Optimization', cls:'btn-primary', fn:"closeAskPanel();showScreen('menu',null,'Menu Optimization');showMenuSubpage('overview')"},
      {label:'Open Evidence', fn:"closeAskPanel();showScreen('menu',null,'Menu Optimization');showMenuSubpage('evidence')"},
      {label:'Fix Recipe Cost', fn:"closeAskPanel();showScreen('settings',null,'Data Quality')"},
    ])}`;
  },

  menuPlowhorse: () => {
    return `
    ${mkSection('Direct Answer')}
    <p>Crispy Chicken Sandwich is classified <span class="r-hl amber">Low profit · high sales</span> because it crosses both menu engineering thresholds in opposite directions: <span class="r-hl">18.6% popularity</span> (above the 8.0% line) but <span class="r-hl amber">$5.80 CM</span> (well below the $8.75 threshold).</p>
    <p class="r-note">High-sales, low-profit items drive volume but starve margin. This one alone accounts for $2,163 of total CM at $5.80/plate — but the same volume at the menu's $8.75 threshold would yield $3,264.</p>

    ${mkSection('Classification trace')}
    ${mkEv([
      ['Popularity', '18.6%', '8.0% threshold', '+10.6 pts','','','Toast POS · DET'],
      ['CM/item', '$5.80', '$8.75 threshold', '−$2.95','r-amber','r-amber','Recipe cost · EST (stale 18d)'],
      ['Units (28d)', '373', '—', 'rank #3 by volume','','','Toast POS · DET'],
      ['Quadrant', 'Low profit · high sales', '—', 'high pop + low CM','r-amber','','Menu engineering 2×2'],
    ])}

    ${mkSection('Why it matters')}
    <p>$0.71/item mix shift is dominated by low-profit, high-sales items. Re-pricing or re-portioning the Crispy Chicken alone simulates to <span class="r-hl amber">~$300/28d</span> recovery — but that is simulated, not verified.</p>

    ${mkCtaRow([
      {label:'Open Matrix', cls:'btn-primary', fn:"closeAskPanel();showScreen('menu',null,'Menu Matrix');showMenuSubpage('matrix')"},
      {label:'Simulate Reprice', fn:"closeAskPanel();showScreen('menu',null,'Menu Simulations');showMenuSubpage('simulations')"},
    ])}`;
  },

  menuMixFormula: () => {
    return `
    ${mkSection('Direct Answer')}
    <p>Three formulas drive Menu Mix Shift exposure.</p>

    ${mkSection('Formula trace')}
    ${mkCalc(
      'Weighted Avg CM = SUM(CM × units) ÷ SUM(units)\n' +
      'Mix Shift = current weighted avg CM − 8-week baseline weighted avg CM\n' +
      'Estimated Exposure = ABS(mix shift) × total items sold',
      ''
    )}

    ${mkSection('Numeric trace · Oakland Dinner · 28d')}
    ${mkCalc(
      'Weighted Avg CM = $8.42/item\n' +
      'Baseline (8wk) = $9.13/item\n' +
      'Mix Shift = $8.42 − $9.13 = −$0.71/item\n' +
      'Exposure = 2,004 × $0.71 = $1,422.84',
      '~$1,420/mo [ESTIMATED]'
    )}

    ${mkSection('Waterfall reconciliation')}
    ${mkCalc(
      '$9.13 (baseline)\n' +
      '− $0.46 low-profit, high-sales mix\n' +
      '− $0.18 high-profit, low-sales under-promo\n' +
      '− $0.07 low-profit, low-sales items\n' +
      '= $8.42 (current)',
      'Reconciles to $0.71 shift'
    )}

    <p class="r-note">All values are estimated. Recipe costs are stale 18d — Menu ROI cannot become Verified Savings until refresh + 28-day monitoring + guardrails.</p>

    ${mkCtaRow([
      {label:'Open Mix Shift', cls:'btn-primary', fn:"closeAskPanel();showScreen('menu',null,'Menu Mix Shift');showMenuSubpage('mix')"},
      {label:'Open Evidence', fn:"closeAskPanel();showScreen('menu',null,'Menu Evidence');showMenuSubpage('evidence')"},
    ])}`;
  },

  menuSandwichPrice: () => {
    return `
    ${mkSection('Direct Answer')}
    <p>Simulation says raising the Crispy Chicken Sandwich $18 → $19 lifts CM by <span class="r-hl amber">~$300 over 28 days</span> at a modeled −3% unit drop. <strong>This is simulated, not verified.</strong> It is also blocked from becoming verified savings until recipe costs refresh and a 28-day monitoring window passes.</p>

    ${mkSection('Simulation math')}
    ${mkCalc(
      'Current: 373 units × $5.80 CM = $2,163.40\n' +
      'Sim:     362 units × $6.80 CM = $2,461.60\n' +
      'Lift     = $298.20 over 28 days',
      '~$300/28d [SIMULATED — not verified]'
    )}

    ${mkSection('Guardrails (must hold post-reprice)')}
    <p>• Unit sales decline ≤ 7%<br>• Guest sentiment stable<br>• Refund/comp rate stable<br>• Avg check stable<br>• No negative review spike</p>

    ${mkSection('What it does not do')}
    ${mkVerify('Does not move to Verified Savings until: (a) recipe cost file refreshes, (b) 28-day monitoring passes, (c) all guardrails hold.',
      ['~$300/28d is simulated — does NOT count in ROI Proof','Owner approval required before menu change'])}

    ${mkCtaRow([
      {label:'Open Simulations', cls:'btn-primary', fn:"closeAskPanel();showScreen('menu',null,'Menu Simulations');showMenuSubpage('simulations')"},
      {label:'Send for Owner Approval', fn:"closeAskPanel();switchTab('execution','approvals');showScreen('actions',null,'Actions')"},
    ])}`;
  },

  menuVerifyBlocked: () => {
    return `
    ${mkSection('Direct Answer')}
    <p>The recipe cost file is stale 18 days. While it is stale, SKC can estimate menu exposure (~$1,420/mo) and simulate test lift (~$510/28d ready approvals · ~$865/28d all scenarios), but <strong>cannot</strong> move menu ROI to Verified Savings.</p>

    ${mkSection('Three conditions for Verified menu savings')}
    <p>1. <strong>Fresh recipe cost</strong> · refresh Toast Menu food cost or connect inventory COGS<br>2. <strong>28-day monitoring window</strong> · post-change CM tracked weekly<br>3. <strong>Guardrails hold</strong> · unit decline ≤ 7%, sentiment stable, refunds stable, no negative review spike</p>

    ${mkSection('Why it matters')}
    <p>SKC's doctrine separates estimated/simulated values from verified savings. If recipe cost is stale, food cost may have moved — every CM is estimated until refresh. Counting estimated value as verified would over-claim ROI, which the Profit Recovery system explicitly prevents.</p>

    ${mkCtaRow([
      {label:'Fix Data Quality', cls:'btn-primary', fn:"closeAskPanel();showScreen('settings',null,'Data Quality')"},
      {label:'Open Menu Evidence', fn:"closeAskPanel();showScreen('menu',null,'Menu Evidence');showMenuSubpage('evidence')"},
    ])}`;
  },

  tuesdayFlagged: () => {
    const lab = OPPORTUNITIES.labor;
    const tb  = calculateTimeBasisImpact(lab);
    return `
    ${mkSection('Direct Answer')}
    <p>Tuesday dinner is flagged because RPLH has been below baseline for ${lab.weeks_running} consecutive weeks. This is structural — not random variance. The weekly exposure at current staffing is <span class="r-hl red">${tb.fmt_weekly}</span> across all affected services.</p>
    <p class="r-note">The monthly run-rate is ${tb.fmt_run_rate} if the same pattern holds across all comparable services. This is an estimated run-rate — not verified recovery.</p>

    ${mkSection('Evidence')}
    ${mkEv([
      ['RPLH · Tue dinner · Oakland', formatCurrencyExact(SKC_STATE.metrics.rplh_current)+'/hr', formatCurrencyExact(SKC_STATE.metrics.rplh_baseline)+'/hr', '−'+formatCurrencyExact(SKC_STATE.metrics.rplh_baseline - SKC_STATE.metrics.rplh_current)+'/hr · '+lab.weeks_running+' wks','r-red','r-red','Toast POS · DET'],
      ['Server hrs / night', SKC_STATE.metrics.hours_scheduled+' hrs', SKC_STATE.metrics.hours_needed+' needed', '+'+SKC_STATE.metrics.hours_excess+' excess since March','r-red','r-red','7shifts · DET'],
      ['Cover count trend', SKC_STATE.metrics.covers+' avg', SKC_STATE.metrics.covers_baseline+' peak (March)', 'Normalised — schedule did not','','r-amber','Toast POS · DET'],
    ])}

    ${mkSection('Time Basis')}
    <div class="r-impact-chain-block">
      <div class="r-chain-row"><span class="r-chain-label">Per service exposure</span><span class="r-chain-val r-chain-highlight">${tb.fmt_per_service}</span><span class="r-chain-basis">one Tuesday or Wednesday dinner</span></div>
      <div class="r-chain-row"><span class="r-chain-label">Services affected</span><span class="r-chain-val">${lab.impact.affected_services_per_week}/wk</span><span class="r-chain-basis">Tue + Wed × 2 locations</span></div>
      <div class="r-chain-row"><span class="r-chain-label">Weekly exposure</span><span class="r-chain-val">${tb.fmt_weekly}</span><span class="r-chain-basis">at current staffing levels</span></div>
      <div class="r-chain-row r-chain-row-total"><span class="r-chain-label">Monthly run-rate</span><span class="r-chain-val">${tb.fmt_run_rate}</span><span class="r-chain-basis">both locations · NOT counted in ROI</span></div>
    </div>

    ${mkSection('Recommendation')}
    ${mkAction('Remove one server per service — Tuesday and Wednesday dinner at Oakland', lab.recommendation.playbook)}

    ${mkSection('Verification')}
    ${mkVerify('RPLH ≥ ' + formatCurrencyExact(SKC_STATE.metrics.rplh_target) + '/hr for 2 consecutive Tuesday dinners. Monthly run-rate counts as verified recovery only after monitoring passes.',
      ['Weekly exposure stops when action is taken', 'Monthly run-rate is an estimated figure — verified only after monitoring closes'])}

    ${mkSection('Where to find it')}
    ${mkWhere(['Profit Recovery → Labor card → per-service breakdown', 'Evidence Drawer → Impact Breakdown → time chain'])}
    ${mkCtaRow([
      {label:'Assign Recovery Action', cls:'btn-primary', fn:"closeAskPanel();openCA('leak1')"},
      {label:'View Full Evidence', fn:"closeAskPanel();openEvDrawer('leak1')"},
    ])}`;
  },

  changed: () => {
    const lab = OPPORTUNITIES.labor;
    const tb  = calculateTimeBasisImpact(lab);
    return `
    ${mkSection('Direct Answer')}
    <p>Two things changed meaningfully since last week. Labour weekly exposure grew. One monitoring window is tracking toward a verified win.</p>

    ${mkSection('Evidence')}
    ${mkEv([
      ['Labor weekly exposure (this week)', tb.fmt_weekly, formatWeekly(lab.impact.weekly_exposure - 20), 'growing', 'r-red','r-red','SKC model · EST'],
      ['A005 RPLH · Walnut Creek', formatCurrencyExact(SKC_STATE.metrics.bar_rplh_current)+'/hr', formatCurrencyExact(SKC_STATE.metrics.bar_rplh_baseline)+'/hr', '+'+formatCurrencyExact(SKC_STATE.metrics.bar_rplh_current - SKC_STATE.metrics.bar_rplh_baseline)+'/hr ✓','r-green','r-green','Toast POS · DET'],
      ['Friday lunch ticket time', SKC_STATE.metrics.ticket_time+' min', SKC_STATE.metrics.ticket_baseline+' min', '+'+SKC_STATE.fmt.mins(SKC_STATE.metrics.ticket_time - SKC_STATE.metrics.ticket_baseline),'','r-amber','KDS · DET'],
      ['Avg check · all locations', formatCurrencyExact(SKC_STATE.metrics.avg_check), formatCurrencyExact(SKC_STATE.metrics.avg_check_baseline), '+'+formatCurrencyExact(SKC_STATE.metrics.avg_check - SKC_STATE.metrics.avg_check_baseline)+' ✓','r-green','r-green','Toast POS · DET'],
    ])}

    ${mkSection('What is improving')}
    <p>Avg check is up ${formatCurrencyExact(SKC_STATE.metrics.avg_check - SKC_STATE.metrics.avg_check_baseline)} vs baseline. A005 (bar staffing) is in Wk 3/4 and tracking above its RPLH target — on pace to become verified recovery. A000 (Risotto removal) confirmed <span class="r-hl green">${formatVerifiedValue(SKC_STATE.roi.verified)}</span>.</p>

    ${mkSection('Time Basis — Open Opportunities')}
    <div class="r-impact-chain-block">
      <div class="r-chain-row"><span class="r-chain-label">Labor · weekly exposure</span><span class="r-chain-val r-chain-highlight">${tb.fmt_weekly}</span><span class="r-chain-basis">est. run-rate · NOT counted in ROI</span></div>
      <div class="r-chain-row"><span class="r-chain-label">A005 · active recovery — not yet verified</span><span class="r-chain-val">${formatMonthly(SKC_STATE.roi.approaching, 'active-recovery')}</span><span class="r-chain-basis">Wk 3/4 · closes May 24</span></div>
      <div class="r-chain-row r-chain-row-roi"><span class="r-chain-label">Currently verified</span><span class="r-chain-val">${formatVerifiedValue(SKC_STATE.roi.verified)}</span><span class="r-chain-basis">Rosewood removal · counted in ROI</span></div>
    </div>

    ${mkSection('Recommendation')}
    <p>Two moves: (1) Create the Oakland labor action today before service. (2) Let A005 run — tracking above target, on pace to verify ${formatMonthly(SKC_STATE.roi.approaching, 'verified')} by May 24.</p>

    ${mkSection('Where to find it')}
    ${mkWhere(['Proof → Owner Summary → verified vs active vs open', 'Actions → Monitoring tab → A005 progress'])}
    ${mkCtaRow([
      {label:'View ROI Proof', cls:'btn-primary', fn:"closeAskPanel();showScreen('scorecard',null,'ROI Proof')"},
      {label:'Create Labor Action', fn:"closeAskPanel();openCA('leak1')"},
    ])}`;
  },

  dinner: () => {
    const lab = OPPORTUNITIES.labor;
    const tb  = calculateTimeBasisImpact(lab);
    return `
    ${mkSection('Direct Answer')}
    <p>Before tonight's service, one action: remove the 5 PM–10 PM server shift from Oakland Tuesday dinner in 7shifts. 3 minutes. Stops <span class="r-hl red">${tb.fmt_per_service}</span> in excess labour <strong>tonight</strong>.</p>

    ${mkSection('Time Basis — Tonight vs Monthly')}
    <div class="r-impact-chain-block">
      <div class="r-chain-row"><span class="r-chain-label">Tonight (1 service)</span><span class="r-chain-val r-chain-highlight">${tb.fmt_per_service}</span><span class="r-chain-basis">excess labour · 1 dinner shift · NOT counted in ROI</span></div>
      <div class="r-chain-row"><span class="r-chain-label">This week (4 services)</span><span class="r-chain-val">${tb.fmt_weekly}</span><span class="r-chain-basis">if all 4 affected services are fixed · est.</span></div>
      <div class="r-chain-row r-chain-row-total"><span class="r-chain-label">Monthly run-rate</span><span class="r-chain-val">${tb.fmt_run_rate}</span><span class="r-chain-basis">if consistent across comparable services · NOT counted in ROI</span></div>
      <div class="r-chain-row r-chain-row-roi"><span class="r-chain-label">Verified savings</span><span class="r-chain-val">$0 verified</span><span class="r-chain-basis">requires 2-week monitoring window to close</span></div>
    </div>

    ${mkSection('Evidence')}
    ${mkEv([
      ['RPLH · current', formatCurrencyExact(SKC_STATE.metrics.rplh_current)+'/hr', formatCurrencyExact(SKC_STATE.metrics.rplh_baseline)+'/hr', '−'+formatCurrencyExact(SKC_STATE.metrics.rplh_baseline - SKC_STATE.metrics.rplh_current)+'/hr','r-red','r-red','Toast POS · DET'],
      ['Table turns', SKC_STATE.metrics.table_turns+' min', '≤ '+SKC_STATE.metrics.table_turns_limit+' min', (SKC_STATE.metrics.table_turns_limit - SKC_STATE.metrics.table_turns)+' min margin · Watch','','r-amber','Toast POS'],
    ])}

    ${mkSection('Recommendation')}
    ${mkAction('Before 3 PM today — Sarah C.', lab.recommendation.playbook.slice(1, 5))}
    ${mkRisk('Table turns at Watch ('+SKC_STATE.metrics.table_turns+' min, '+SKC_STATE.metrics.table_turns_limit+' min limit). If turns exceed '+SKC_STATE.metrics.table_turns_limit+' min during service, call one server back and reassess.')}

    ${mkSection('Where to find it')}
    ${mkWhere(['Actions → Open Actions → A006 (due today)', 'Proof → Verified Savings → $0 until monitoring closes'])}
    ${mkCtaRow([
      {label:'Assign Recovery Action', cls:'btn-primary', fn:"closeAskPanel();openCA('leak1')"},
      {label:'View Guardrails', fn:"closeAskPanel();switchTab('recovery','guardrails');showScreen('leaks',null,'Profit Recovery')"},
    ])}`;
  },

  notVerified: () => {
    const lab = OPPORTUNITIES.labor;
    const roi = calculateVerifiedROI();
    const tb  = calculateTimeBasisImpact(lab);
    return `
    ${mkSection('Direct Answer')}
    <p>Nothing is verified yet from the labor action because no action has been created. A dollar value only counts as verified recovery after: action created → implemented → monitoring window closes → guardrails pass.</p>
    <p class="r-note">Current status: ${tb.fmt_run_rate} est. run-rate · ${tb.fmt_verified} · NOT counted in ROI.</p>

    ${mkSection('Verification Path')}
    ${mkAction('Three steps to verified recovery', [
      'Reconnect 7shifts (Data Quality) — required for monitoring eligibility',
      'Create the action and assign it to Sarah C.',
      'Implement the schedule change before next Tuesday dinner',
      'RPLH ≥ '+formatCurrencyExact(SKC_STATE.metrics.rplh_target)+'/hr for 2 consecutive Tuesdays',
      'All 4 guardrails passing throughout the monitoring window',
    ])}

    ${mkSection('What Changes When Verified')}
    <div class="r-impact-chain-block">
      <div class="r-chain-row"><span class="r-chain-label">Today</span><span class="r-chain-val">${tb.fmt_run_rate}</span><span class="r-chain-basis">estimated run-rate · NOT counted in ROI</span></div>
      <div class="r-chain-row r-chain-row-roi"><span class="r-chain-label">After monitoring</span><span class="r-chain-val">${formatMonthly(lab.impact.monthly_open_opportunity, 'verified')}</span><span class="r-chain-basis">counted in ROI · updated in Proof screen</span></div>
      <div class="r-chain-row"><span class="r-chain-label">ROI multiple then</span><span class="r-chain-val">${((roi.verified + lab.impact.monthly_open_opportunity) / roi.subscription).toFixed(1)}×</span><span class="r-chain-basis">vs current ${roi.roi_multiple}× verified</span></div>
    </div>

    ${mkSection('Where to find it')}
    ${mkWhere(['Proof → Owner Summary → verified vs active vs open', 'Data Quality → 7shifts → reconnect', 'Profit Recovery → Verification tab'])}
    ${mkCtaRow([
      {label:'Open Data Quality', cls:'btn-primary', fn:"closeAskPanel();showScreen('settings',null,'Data Quality')"},
      {label:'View ROI Proof', fn:"closeAskPanel();showScreen('scorecard',null,'ROI Proof')"},
    ])}`;
  },

  blockROI: () => {
    const roi = calculateVerifiedROI();
    const lab = OPPORTUNITIES.labor;
    return `
    ${mkSection('Direct Answer')}
    <p>Four guardrail conditions can block a verified win. Any one is sufficient to prevent the estimated run-rate from becoming verified recovery. There is also a data quality block condition.</p>
    <p class="r-note">Current verified recovery: ${formatVerifiedValue(roi.verified)}. Estimated run-rate not yet in ROI: ${formatRunRate(lab.impact.monthly_run_rate)}.</p>

    ${mkSection('Evidence — Guardrail Status')}
    ${mkEv([
      ['Kitchen ticket time', SKC_STATE.metrics.ticket_time+' min', '≤ 16 min limit', '✓ '+SKC_STATE.fmt.mins(16 - SKC_STATE.metrics.ticket_time)+' margin','r-green','r-green','KDS · DET'],
      ['Average check', formatCurrencyExact(SKC_STATE.metrics.avg_check), '≥ $50.00', '✓ '+formatCurrencyExact(SKC_STATE.metrics.avg_check - 50)+' margin','r-green','r-green','Toast POS · DET'],
      ['Table turn time', SKC_STATE.metrics.table_turns+' min', '≤ '+SKC_STATE.metrics.table_turns_limit+' min', '~ Watch · '+(SKC_STATE.metrics.table_turns_limit - SKC_STATE.metrics.table_turns)+' min margin','','r-amber','Toast POS · DET'],
      ['Guest complaints', SKC_STATE.metrics.complaints+' / wk', '≤ 2 / wk', '✓ clear','r-green','r-green','Toast POS · DET'],
    ])}

    ${mkSection('What Verified Looks Like')}
    <div class="r-impact-chain-block">
      <div class="r-chain-row"><span class="r-chain-label">Currently</span><span class="r-chain-val">${formatRunRate(lab.impact.monthly_run_rate)}</span><span class="r-chain-basis">estimated · NOT counted in ROI</span></div>
      <div class="r-chain-row r-chain-row-roi"><span class="r-chain-label">After monitoring</span><span class="r-chain-val">${formatVerifiedValue(lab.impact.monthly_open_opportunity)}</span><span class="r-chain-basis">only after RPLH + guardrails pass 2 Tuesdays</span></div>
    </div>

    ${mkSection('Recommendation')}
    <p>Table turns are the primary block risk — ${SKC_STATE.metrics.table_turns} min, ${SKC_STATE.metrics.table_turns_limit - SKC_STATE.metrics.table_turns} min from threshold. Monitor each Tuesday during the action window. Reconnect 7shifts before creating the action to prevent a DQ block.</p>

    ${mkSection('Where to find it')}
    ${mkWhere(['Proof → Blocked Value', 'Profit Recovery → Guardrails tab', 'Data Quality → 7shifts'])}
    ${mkCtaRow([
      {label:'View Blocked Value', cls:'btn-primary', fn:"closeAskPanel();switchTab('roi','blocked');showScreen('scorecard',null,'ROI Proof')"},
      {label:'View Guardrails', fn:"closeAskPanel();switchTab('recovery','guardrails');showScreen('leaks',null,'Profit Recovery')"},
    ])}`;
  },
};

function closeChat() { closeAskPanel(); }


function getResponse(q) {
  const lower = q.toLowerCase();
  // (v27) Menu Optimization — specific prompts first
  if (lower.includes('menu money') || (lower.includes('menu') && lower.includes('leak'))) return RESPONSES.menuLeak();
  if (lower.includes('crispy chicken') || lower.includes('plowhorse')) return RESPONSES.menuPlowhorse();
  if (lower.includes('mix shift formula') || (lower.includes('formula') && lower.includes('mix'))) return RESPONSES.menuMixFormula();
  if (lower.includes('sandwich price') || (lower.includes('raise') && lower.includes('price'))) return RESPONSES.menuSandwichPrice();
  if (lower.includes('blocks this from verified') || lower.includes('blocks verified') || (lower.includes('block') && lower.includes('verified saving'))) return RESPONSES.menuVerifyBlocked();
  if (lower.includes('tuesday dinner') && (lower.includes('flag') || lower.includes('why'))) return RESPONSES.tuesdayFlagged();
  if (lower.includes('not verified') || lower.includes('why is this not') || lower.includes('verified yet') || lower.includes('how do i verify')) return RESPONSES.notVerified();
  if (lower.includes('block') && (lower.includes('roi') || lower.includes('verified'))) return RESPONSES.blockROI();
  if (lower.includes('labor') || lower.includes('cost') || lower.includes('high') || lower.includes('rplh') || lower.includes('why is labor')) return RESPONSES.labor();
  if (lower.includes('gm') || lower.includes('manager') || lower.includes('should') || lower.includes('today') || lower.includes('priority')) return RESPONSES.gm();
  if (lower.includes('evidence') || lower.includes('number') || lower.includes('prove') || lower.includes('source') || lower.includes('behind') || lower.includes('calculate')) return RESPONSES.evidence();
  if (lower.includes('reprice') || lower.includes('menu') || lower.includes('salmon') || lower.includes('item') || lower.includes('margin')) return RESPONSES.reprice();
  if (lower.includes('changed') || lower.includes('last week') || lower.includes('different') || lower.includes('since')) return RESPONSES.changed();
  if (lower.includes('dinner') || lower.includes('before') || lower.includes('service') || lower.includes('tonight')) return RESPONSES.dinner();
  // Default
  return `
    ${mkSection('Direct Answer')}
    <p>Based on Rosewood's current data, your highest-priority item is the Tuesday–Wednesday dinner overstaffing: <span class="r-hl red">$3,200/mo</span> in exposure, fully within your control today.</p>
    ${mkSection('Top Open Items')}
    <p>1. Labor cost <span class="r-hl red">34.8%</span> — 3.3 pts above target (Tue/Wed dinner staffing)<br>2. Grilled Salmon CM <span class="r-hl red">38.2%</span> — 23 pts below location average<br>3. Friday lunch ticket time <span class="r-hl amber">14.2 min</span> — 2.4 min above baseline</p>
    ${mkSection('Recommendation')}
    ${mkAction('Start here', ['Remove Oakland Tuesday dinner server before 3 PM today (7shifts · 3 minutes · $180 this week)'])}
    ${mkCtaRow([
      {label:'Assign Recovery Action', cls:'btn-primary', fn:"closeChat();openCA('leak1')"},
      {label:'View Recovery', fn:"closeChat();showScreen('leaks',null,'Profit Recovery')"},
    ])}`;
}

function askQ(q) {
  document.getElementById('chatInput').value = q;
  sendMsg();
}

function sendMsg() {
  const input = document.getElementById('chatInput');
  const q = input.value.trim();
  if (!q) return;
  const hist = document.getElementById('chatHist');

  // User message
  const userDiv = document.createElement('div');
  userDiv.className = 'ask-msg user-msg';
  userDiv.innerHTML = `
    <div class="ask-msg-header user-hd">
      <span class="ask-msg-time">${new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}</span>
      <span class="ask-msg-sender" style="color:var(--t2)">Sarah Chen</span>
      <div class="ask-msg-ava user">SC</div>
    </div>
    <div class="ask-msg-body user-body"><p>${q}</p></div>`;
  hist.appendChild(userDiv);
  input.value = '';

  // Typing
  const typingDiv = document.createElement('div');
  typingDiv.className = 'ask-msg skc-msg';
  typingDiv.innerHTML = `
    <div class="ask-msg-header">
      <div class="ask-msg-ava skc">S</div>
      <span class="ask-msg-sender">SKC Profit Manager</span>
    </div>
    <div class="ask-msg-body"><div class="r-typing"><span></span><span></span><span></span></div></div>`;
  hist.appendChild(typingDiv);
  hist.scrollTop = hist.scrollHeight;

  setTimeout(() => {
    hist.removeChild(typingDiv);
    const responseDiv = document.createElement('div');
    responseDiv.className = 'ask-msg skc-msg';
    responseDiv.innerHTML = `
      <div class="ask-msg-header">
        <div class="ask-msg-ava skc">S</div>
        <span class="ask-msg-sender">SKC Profit Manager</span>
        <span class="ask-msg-time">${new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}</span>
      </div>
      <div class="ask-msg-body">${getResponse(q)}</div>`;
    hist.appendChild(responseDiv);
    hist.scrollTop = hist.scrollHeight;
  }, 1200);
}

// ── DATA QUALITY CENTER ───────────────────────────────
function closeDqModal(source) {
  const modal = document.getElementById('modal-' + source);
  if (modal) modal.classList.remove('open');
}

// Simulate 7shifts reconnection
function dqSimulate7shifts() {
  const overlay = document.getElementById('modal-7shifts');
  const body = overlay.querySelector('.dq-modal-body');
  body.innerHTML = `
    <div style="text-align:center;padding:20px 0">
      <div style="font-size:14px;font-weight:600;color:var(--t1);margin-bottom:8px">Connecting to 7shifts…</div>
      <div style="font-size:12px;color:var(--t3);margin-bottom:20px">Importing 18 hours of missing clock-out data</div>
      <div class="dq-sim-bar"><div class="dq-sim-fill" id="simFill"></div></div>
      <div id="simLabel" style="font-size:11px;font-family:var(--mono);color:var(--t3);margin-top:10px">Authorizing…</div>
    </div>`;
  let pct = 0;
  const labels = ['Authorizing OAuth token…','Importing clock-out records…','Recalculating RPLH…','Updating labor baselines…','Done'];
  const iv = setInterval(() => {
    pct += 20;
    const fill = document.getElementById('simFill');
    const lbl = document.getElementById('simLabel');
    if (fill) fill.style.width = pct + '%';
    if (lbl) lbl.textContent = labels[Math.floor(pct/20)-1] || 'Done';
    if (pct >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        overlay.classList.remove('open');
        // update the 7shifts card
        const card = document.getElementById('dq7shifts');
        if (card) {
          card.className = 'dq-src-card healthy';
          const pill = card.querySelector('.dq-status-pill');
          if (pill) { pill.className='dq-status-pill healthy'; pill.innerHTML='<svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="currentColor"/></svg> Connected'; }
          const syncVal = card.querySelectorAll('.dq-src-metric-val')[0];
          if (syncVal) { syncVal.textContent='Just now'; syncVal.className='dq-src-metric-val text-green'; }
          const compVal = card.querySelectorAll('.dq-src-metric-val')[1];
          if (compVal) { compVal.textContent='97%'; compVal.className='dq-src-metric-val text-green'; }
          const fixBtn = card.querySelector('.dq-src-footer button');
          if (fixBtn) { fixBtn.textContent='Connected ✓'; fixBtn.disabled=true; fixBtn.style.opacity='.5'; }
        }
        // update score
        const score = document.getElementById('dqScoreVal');
        if (score) animScore(82, 94, score);
        // update hero
        const hero = document.querySelector('.dq-hero');
        if (hero) {
          hero.style.borderLeftColor = 'var(--green)';
          const t = hero.querySelector('.dq-hero-title');
          if (t) t.textContent = 'All critical data sources are now healthy.';
          const s = hero.querySelector('.dq-hero-sub');
          if (s) s.textContent = '7shifts reconnected. Labor data up to date. RPLH and labor cost figures have been recalculated.';
          const pill = hero.querySelector('.dq-status-pill');
          if (pill) { pill.className='dq-status-pill healthy'; pill.innerHTML='<svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="currentColor"/></svg> Healthy'; }
        }
      }, 400);
    }
  }, 500);
}

function animScore(from, to, el) {
  let v = from;
  const iv = setInterval(() => {
    v++;
    el.textContent = v;
    el.style.color = v >= 90 ? 'var(--green)' : 'var(--amber)';
    const circle = document.querySelector('.dq-score-ring circle:last-child');
    if (circle) {
      const pct = v / 100;
      circle.style.strokeDashoffset = 213.6 * (1 - pct);
      circle.style.stroke = v >= 90 ? 'var(--green)' : 'var(--amber)';
    }
    if (v >= to) clearInterval(iv);
  }, 60);
}

function dqSimulateCogs() {
  const overlay = document.getElementById('modal-cogs');
  overlay.classList.remove('open');
  // show a brief toast
  const t = document.createElement('div');
  t.style.cssText='position:fixed;bottom:24px;right:24px;background:var(--green);color:#fff;font-size:13px;font-weight:500;padding:10px 18px;border-radius:8px;z-index:999;animation:slideUp .2s ease';
  t.textContent = '✓ Recipe costs saved — CM recalculating';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function dqSimulateKds() {
  const overlay = document.getElementById('modal-kds');
  overlay.classList.remove('open');
  const t = document.createElement('div');
  t.style.cssText='position:fixed;bottom:24px;right:24px;background:var(--blue);color:#fff;font-size:13px;font-weight:500;padding:10px 18px;border-radius:8px;z-index:999;animation:slideUp .2s ease';
  t.textContent = '✓ 14 duplicate KDS IDs removed — ticket time updating';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function dqRunScan() {
  const btn = event.target;
  const orig = btn.textContent;
  btn.textContent = 'Scanning…';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = orig;
    btn.disabled = false;
    const t = document.createElement('div');
    t.style.cssText='position:fixed;bottom:24px;right:24px;background:var(--surface);border:1px solid var(--border);color:var(--t1);font-size:13px;font-weight:500;padding:10px 18px;border-radius:8px;z-index:999;animation:slideUp .2s ease';
    t.textContent = 'Scan complete — 4 issues found, 1 critical';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }, 1800);
}
// ─── TOP RECOVERY — SHARED DEMO STORY ────────────────
//
// Single source of truth for the main profit recovery demo narrative.
// Every screen reads from this object. Change it here, it updates everywhere.
//
// ═══════════════════════════════════════════════════════════
// SKC CANONICAL FINANCIAL MODEL — single source of truth
// Every dollar amount visible in the UI derives from this object.
// Do not hard-code financial values in HTML; use data-tr bindings
// or fmt() helpers that reference this model.
// ═══════════════════════════════════════════════════════════

// ─── SKC — computed view of SKC_STATE (backwards-compat) ──────────────────
//  All downstream code that reads SKC.diag.*, SKC.labor.*, etc. continues
//  to work — but the numbers now come from SKC_STATE, not a separate object.
const SKC = {
  get diag() {
    const m = SKC_STATE.metrics;
    return {
      rplh_current:      m.rplh_current,
      rplh_baseline:     m.rplh_baseline,
      rplh_target:       m.rplh_target,
      rplh_gap:          +(m.rplh_baseline - m.rplh_current).toFixed(2),
      labor_pct:         m.labor_pct,
      labor_pct_target:  m.labor_pct_target,
      hours_scheduled:   m.hours_scheduled,
      hours_needed:      m.hours_needed,
      hours_excess:      m.hours_excess,
      covers:            m.covers,
      covers_baseline:   m.covers_baseline,
      avg_check:         m.avg_check,
      avg_check_baseline:m.avg_check_baseline,
      ticket_time:       m.ticket_time,
      ticket_baseline:   m.ticket_baseline,
      table_turns:       m.table_turns,
      table_turns_limit: m.table_turns_limit,
      complaints:        m.complaints,
      complaints_limit:  m.complaints_limit,
    };
  },
  get labor() {
    const m = SKC_STATE.metrics;
    const opp = SKC_STATE.opportunities.labor;
    return {
      wage_blended:        m.wage_blended,
      nights_per_week:     2,
      locations:           2,
      weeks_per_month:     4.33,
      weekly_oakland:      opp.impact_weekly,
      monthly_oakland:     opp.impact_monthly,
      weekly_both:         opp.impact_weekly * 2,
      monthly_both:        opp.impact_both,
    };
  },
  get opportunity() {
    const opp = SKC_STATE.opportunities;
    const roi = SKC_STATE.roi;
    return {
      labor_oakland:    opp.labor.impact.location_monthly_impact,
      labor_both:       opp.labor.impact.portfolio_monthly_impact,
      labor_weekly:     opp.labor.impact.weekly_exposure,
      salmon:           opp.salmon.impact.portfolio_monthly_impact,
      ticket:           opp.throughput.impact.portfolio_monthly_impact,
      total_open:       opp.total_open,
      bar_staffing:     roi.approaching,
      active_recovery:  roi.active_recovery,
      risotto:          roi.verified,
      verified:         roi.verified,
      subscription:     roi.subscription,
      roi_current:      roi.roi_multiple,
      roi_post_sim:     roi.roi_post_bar,
      net_gain_current: roi.net_gain,
    };
  },
  get confidence() {
    const opp = SKC_STATE.opportunities;
    return {
      labor:   opp.labor.confidence_score,
      salmon:  opp.salmon.confidence_score,
      ticket:  opp.throughput.confidence_score,
      bar:     SKC_STATE.actions.A005.confidence,
      risotto: SKC_STATE.actions.A000.confidence,
    };
  },
  get guardrails() {
    const g = SKC_STATE.guardrails;
    const m = SKC_STATE.metrics;
    return {
      ticket_time: { limit:g.ticket_time.limit, unit:'min', current:m.ticket_time, pass:g.status('ticket_time')!=='fail', watch:g.status('ticket_time')==='watch' },
      avg_check:   { limit:g.avg_check.limit,   unit:'$',   current:m.avg_check,   pass:g.status('avg_check')!=='fail' },
      table_turns: { limit:g.table_turns.limit, unit:'min', current:m.table_turns, pass:g.status('table_turns')!=='fail', watch:g.status('table_turns')==='watch' },
      complaints:  { limit:g.complaints.limit,  unit:'/week', current:m.complaints, pass:g.status('complaints')!=='fail' },
    };
  },
  get action() {
    const a = SKC_STATE.actions.A006;
    const m = SKC_STATE.metrics;
    return {
      title:          a.title,
      location:       a.location,
      locations_both: SKC_STATE.opportunities.labor.location,
      owner:          'Sarah Chen',
      owner_short:    a.owner,
      due:            a.due,
      system:         a.system,
      system_time:    '3 min',
      verify_at:      `RPLH ≥ $${m.rplh_target.toFixed(2)}`,
      verify_cycles:  '2 consecutive Tuesdays',
      monitoring_days: a.monitoring_window,
      sources:        'Toast POS + 7shifts',
    };
  },
  get wins() { return Object.values(SKC_STATE.actions).filter(a=>typeof a==='object'&&a.impact); },
  fmt: {
    dollar:  (n, mo=true) => '$' + Math.round(n).toLocaleString() + (mo ? '/mo' : ''),
    dollarWk:(n) => '$' + Math.round(n).toLocaleString() + '/wk',
    pct:     (n) => n + '%',
    rplh:    (n) => '$' + (+n).toFixed(2) + '/hr',
    hrs:     (n) => n + ' hrs',
    min:     (n) => n + ' min',
  },
};

// ── Backwards-compatible topRecovery shim ────────────────────
// Keeps all data-tr="..." bindings working without touching HTML
const topRecovery = {
  title:             SKC.action.title,
  location:          SKC.action.location,
  issue:             'Labor ran 9.4% above demand while ticket time stayed healthy',
  openOpportunity:   SKC.fmt.dollar(OPPORTUNITIES.labor.impact.location_monthly_impact),
  openOpportunityWk: SKC.fmt.dollarWk(OPPORTUNITIES.labor.impact.weekly_exposure) + ' · Oakland',
  confidence:        SKC.fmt.pct(SKC.confidence.labor),
  status:            'Active Recovery',
  sources:           SKC.action.sources,
  owner:             SKC.action.owner,
  ownerShort:        SKC.action.owner_short,
  due:               SKC.action.due,
  recommendedAction: SKC.action.title,
  actionSteps:       '7shifts → Oakland → Tuesday Dinner → Remove 5 PM–10 PM shift → Confirm manager coverage',
  primaryMetric:     'Labor % / RPLH',
  primaryVal:        SKC.fmt.rplh(SKC.diag.rplh_current) + ' → ' + SKC.fmt.rplh(SKC.diag.rplh_target) + '+ target',
  counterMetrics:    'ticket time, guest complaints, average check, table turn time',
  monitoringWindow:  SKC.action.monitoring_days + ' days',
  verifyAt:          'RPLH ≥ ' + SKC.fmt.rplh(SKC.diag.rplh_target),
};

// Field accessors — maps a data-tr key to a topRecovery field (or computed value)
const trFields = {
  'title':             () => topRecovery.title,
  'location':          () => topRecovery.location,
  'issue':             () => topRecovery.issue,
  'open-opportunity':  () => topRecovery.openOpportunity,
  'open-opportunity-wk': () => topRecovery.openOpportunityWk,
  'confidence':        () => topRecovery.confidence,
  'status':            () => topRecovery.status,
  'sources':           () => topRecovery.sources,
  'owner':             () => topRecovery.owner,
  'owner-short':       () => topRecovery.ownerShort,
  'due':               () => topRecovery.due,
  'action':            () => topRecovery.recommendedAction,
  'action-steps':      () => topRecovery.actionSteps,
  'primary-metric':    () => topRecovery.primaryMetric,
  'primary-val':       () => topRecovery.primaryVal,
  'counter-metrics':   () => topRecovery.counterMetrics,
  'monitoring-window': () => topRecovery.monitoringWindow,
  'verify-at':         () => topRecovery.verifyAt,
  'summary':           () => `${topRecovery.location} · ${topRecovery.due} · ${topRecovery.openOpportunity}`,
};

function bindTopRecovery() {
  document.querySelectorAll('[data-tr]').forEach(el => {
    const key = el.getAttribute('data-tr');
    const fn  = trFields[key];
    if (fn) el.textContent = fn();
  });
}

// updateTopRecovery — call with partial overrides to update state and re-bind
function updateTopRecovery(patch) {
  Object.assign(topRecovery, patch);
  bindTopRecovery();
}

// Convenience presets callable from console or demo controls:
//   setRecoveryStatus('active')   — In Progress
//   setRecoveryStatus('verified') — Verified Win
//   setRecoveryStatus('blocked')  — Guardrail Blocked
window.setRecoveryStatus = function(preset) {
  const presets = {
    active:   { status: 'Active Recovery',  openOpportunity: '$1,600/mo', openOpportunityWk: '$180 this week' },
    verified: { status: 'Verified Win',     openOpportunity: '$1,600/mo', openOpportunityWk: '$820 verified' },
    blocked:  { status: 'Guardrail Blocked',openOpportunity: 'Blocked',   openOpportunityWk: 'Blocked — restore coverage' },
  };
  if (presets[preset]) updateTopRecovery(presets[preset]);
};
window.topRecovery = topRecovery;
window.updateTopRecovery = updateTopRecovery;

// Run on load
// (bindTopRecovery called in DOMContentLoaded below)

// ─── EVIDENCE DRAWER — "Why am I seeing this?" ───────────
// Registry: one entry per surfaced recommendation.
// Each entry covers all 10 evidence fields.


// ─── EVIDENCE DRAWER DATA MODEL ──────────────────────────
// Now reads from OPPORTUNITIES — no duplicated numbers.
// evData[key] returns the same structure as before, built from
// the canonical opportunity object.

const evData = (function buildEvData() {
  function oppToEvData(opp) {
    const dq   = opp.source_data;
    const calc = opp.calculation;
    const imp  = opp.impact;
    const vr   = opp.verification_rule;
    const rec  = opp.recommendation;
    const fmt  = SKC_STATE.fmt;

    const srcLabels = { toast:'Toast POS', shifts:'7shifts', menu:'Menu / Recipe Cost', kds:'KDS', reviews:'Google Reviews', accounting:'Accounting' };
    const srcRoles  = {
      toast:      'Revenue, covers, avg check, ticket times, RPLH calculation',
      shifts:     'Scheduled labour hours, shift assignments, role breakdown',
      menu:       'Ingredient costs, contribution margin, recipe yields',
      kds:        'Kitchen ticket timestamps — aggregate only, no per-station breakdown',
      reviews:    'Rating monitoring and complaint guardrail signal',
      accounting: 'Prime cost, net margin (not connected — excluded from calculation)',
    };
    const ALL_SOURCES = ['toast','shifts','menu','kds','reviews','accounting'];
    const sources = ALL_SOURCES.map(id => {
      const src = SKC_STATE.data_quality.sources[id];
      const isRequired = dq.required_sources.includes(id);
      return { id, label: srcLabels[id], status: isRequired ? src.status : 'unused', sync: isRequired ? src.lastSync : '—', role: isRequired ? srcRoles[id] : 'Not used in this recommendation' };
    });

    const baseline = opp.variances.map(v => ({
      metric:   v.metric,
      current:  (v.unit === '$' || v.unit === '$/hr') ? '$' + v.current.toFixed(2) : v.current + ' ' + v.unit,
      base:     (v.unit === '$' || v.unit === '$/hr') ? '$' + v.baseline.toFixed(2) : v.baseline + ' ' + v.unit,
      variance: (v.variance > 0 ? '+' : '') + v.variance + (v.unit === '$' || v.unit === '$/hr' ? '' : ' ' + v.unit),
      varClass: v.status === 'bad' ? 'text-red' : v.status === 'good' ? 'text-green' : '',
      sig:      v.status === 'bad',
    }));

    // Build confidence items using the output type system
    const confItems = [
      ...dq.healthy_sources.map(id  => ({ type:'det',     label: srcLabels[id] + ' · ' + SKC_STATE.data_quality.sources[id].lastSync + ' · ' + (typeof renderOutputChip==='function' ? 'Deterministic' : 'DET') })),
      ...dq.stale_sources.map(id    => ({ type:'stale',   label: srcLabels[id] + ' · last synced ' + SKC_STATE.data_quality.sources[id].lastSync + ' — confidence reduced' })),
      ...dq.degraded_sources.map(id => ({ type:'stale',   label: srcLabels[id] + ' · degraded — partial data only — confidence reduced' })),
      ...dq.missing_sources.map(id  => ({ type:'missing', label: srcLabels[id] + ' · not connected — metric excluded from calculation' })),
      { type: 'est', label: 'Conservative adjustment: ' + calc.conservative_adjustment },
    ];
    // Build typed confidence block HTML for the drawer
    const confBlockHtml = (typeof renderConfidenceBlock === 'function')
      ? renderConfidenceBlock(opp)
      : null;

    const guardrails = opp.counter_metrics.map(g => ({
      name:    g.name,
      current: g.current + ' ' + g.unit,
      limit:   (g.op === 'lte' ? '≤ ' : '≥ ') + g.limit + ' ' + g.unit,
      status:  g.status,
    }));

    // Impact breakdown — shows every level of the time chain
    const impactBreakdown = [
      { label: 'Per service',           value: '$' + imp.per_service_impact + (imp.per_service_impact < 50 ? '/plate' : '/service'), basis: imp.per_service_basis },
      { label: 'Services affected/wk',  value: imp.affected_services_per_week + ' services/wk', basis: imp.affected_services_basis },
      { label: 'Weekly exposure',       value: '$' + imp.weekly_exposure + '/wk',               basis: imp.weekly_basis },
      { label: 'Monthly run-rate',      value: '$' + imp.monthly_run_rate + '/mo',              basis: imp.monthly_run_rate_basis },
      { label: 'Open weekly exposure',  value: '$' + imp.monthly_open_opportunity + '/mo',      basis: imp.open_opportunity_basis },
      { label: 'Active recovery',       value: imp.monthly_active_recovery === 0 ? '$0 — not started' : '$' + imp.monthly_active_recovery + '/mo', basis: imp.active_recovery_basis },
      { label: 'Verified savings',      value: imp.monthly_verified_savings === 0 ? '$0 — not verified' : '$' + imp.monthly_verified_savings + '/mo', basis: imp.verified_savings_basis },
      { label: 'Counted in ROI',        value: imp.counted_in_verified_roi ? 'YES' : 'NO',     basis: imp.roi_basis },
    ];

    return {
      title:         opp.title + ' · ' + opp.location_name,
      what:          rec.recommendation_text,
      impact:        fmt.dollar(imp.portfolio_monthly_impact),
      impactBreakdown,
      timeBasis:     calc.time_basis_explanation,
      confidence:    opp.confidence_score,
      outputType:    opp.output_type,
      outputChip:    (typeof getOpportunityOutputLabel==='function') ? getOpportunityOutputLabel(opp,'chip') : opp.output_type,
      outputFull:    (typeof getOpportunityOutputLabel==='function') ? getOpportunityOutputLabel(opp,'full') : opp.output_type,
      outputRow:     (typeof renderOutputRow==='function') ? renderOutputRow(opp.output_type, opp.confidence_score, dq.dq_warning ? _dqReasonShort(dq.dq_warning) : null) : '',
      confBlockHtml,
      status:        opp.status,
      statusClass:   opp.status_key,
      sources,
      baseline,
      formulaLines:  calc.explanation,
      formulaInputs: calc.formula_inputs,
      formulaResult: fmt.dollar(calc.final_display_value) + '/mo ' + (typeof getOutputLabel==='function' ? getOutputLabel(opp.output_type, opp.confidence_score).text : opp.output_type + ' · ' + opp.confidence_score + '%'),
      formulaResultClass: 'text-green',
      conservativeNote: calc.conservative_adjustment,
      confItems,
      confWarn:      dq.dq_warning,
      guardrails,
      guardrailNote: opp.counter_metrics.some(g => g.status === 'fail') ? 'Some guardrails are currently above target — these are the source of the leak, not just monitoring checks.' : null,
      verifyWin:     vr.pass_conditions,
      verifyBlock:   vr.fail_conditions,
      verifyWindow:  vr.required_monitoring_period,
      verifyBlockers: typeof vr.blocked_by === 'function' ? vr.blocked_by() : [],
      ctaTitle:      rec.operator_action,
      ctaSteps:      rec.playbook,
      ctaPrimary:    rec.primary_cta,
      ctaSecondary:  rec.secondary_cta,
      ctaOwner:      rec.owner || null,
      ctaSystem:     rec.system || null,
      ctaTime:       rec.time_required || null,

      // ── Statistical proof (built from OPPORTUNITY data) ─────
      statProof: opp.statistical_proof ? {
        baselineWindow: opp.statistical_proof.baseline_window,
        sampleSize:     opp.statistical_proof.sample_size,
        normalRange:    opp.statistical_proof.normal_range,
        current:        opp.statistical_proof.current_value,
        pattern:        opp.statistical_proof.pattern,
        triggerRule:    opp.statistical_proof.trigger_rule,
        anomalyHandling: opp.statistical_proof.anomaly_handling,
      } : null,

      // ── Confidence math (decomposed) ────────────────────────
      confMath: {
        base:     85,
        penalties: dq.stale_sources.map(id => ({
          reason: srcLabels[id] + ' stale',
          pts: id === 'shifts' ? 7 : id === 'menu' ? 12 : 4
        })),
        final:    opp.confidence_score,
        behavior: opp.confidence_score >= 80
          ? 'High confidence — action and ROI verification allowed.'
          : opp.confidence_score >= 65
          ? 'Moderate-high confidence — action allowed. ROI verification limited until data source refreshes.'
          : 'Moderate confidence — action allowed with manager review. ROI verification blocked.',
      },

      // ── Threshold explanations ──────────────────────────────
      thresholds: opp.thresholds || null,

      // ── Attribution status (for verified items) ─────────────
      attribution: opp.attribution || null,

      // ── Operator memo ────────────────────────────────────────
      operatorMemo: opp.operator_memo || null,

      // ── Methodology ──────────────────────────────────────────
      methodology: opp.methodology || null,

      // ── (v26 · Fixes 1/2/3) Derivation sub-blocks for Calc Trail ──
      // Passed through from OPPORTUNITIES.<opp>.calculation.
      excessHoursDerivation:  calc.excess_hours_derivation  || null,
      volumeRetentionModel:   calc.volume_retention_model   || null,
      dollarValueDerivation:  calc.dollar_value_derivation  || null,

      // ── (Taya #18) Static risk & effort profile ─────────────
      risk: opp.risk || null,
    };
  }

  return {
    leak1: oppToEvData(OPPORTUNITIES.labor),
    leak2: oppToEvData(OPPORTUNITIES.salmon),
    leak3: oppToEvData(OPPORTUNITIES.throughput),
  };
})();
// every section from this data. No raw HTML strings.


// ── Evidence drawer renderer ──────────────────────────────
// Builds all 8 sections from the structured data model.

// ── Evidence drawer helpers ───────────────────────────────
// All helpers are module-level so _evTimeBasis and _evFormulaInputs
// are available when openEvDrawer calls them.

function _evSection(num, label, content, open = false) {
  if (!content || content.trim() === '') return '';
  return `
  <div class="ev-sec">
    <div class="ev-sec-hd" onclick="toggleEvSection(this)">
      <span class="ev-sec-num${open?' done':''}">${num}</span>
      <span class="ev-sec-label">${label}</span>
      <span class="ev-sec-caret${open?' open':''}">▾</span>
    </div>
    <div class="ev-sec-body${open?' open':''}">
      ${content}
    </div>
  </div>`;
}

function _evTimeBasis(d) {
  if (!d.timeBasis) return '';
  return `<div class="ev-time-basis-block">
    <div class="ev-tb-icon">⏱</div>
    <div class="ev-tb-text">${d.timeBasis}</div>
  </div>`;
}

function _evImpactBreakdown(d) {
  if (!d.impactBreakdown) return '';
  const colorOf = (label) => {
    if (label === 'Per service')          return 'var(--t1)';
    if (label === 'Weekly exposure')       return 'var(--t1)';
    if (label === 'Services affected/wk') return 'var(--t2)';
    if (label === 'Counted in ROI')       return d.impactBreakdown.find(r=>r.label===label)?.value === 'YES' ? 'var(--green)' : 'var(--red)';
    return 'var(--t3)'; // monthly run-rate, open opp, active recovery, verified — all secondary
  };
  const rows = d.impactBreakdown.map(r => `
    <div class="ev-impact-row ev-impact-${r.label==='Per service'||r.label==='Weekly exposure'?'primary':'secondary'}">
      <div class="ev-impact-label">${r.label}</div>
      <div class="ev-impact-value" style="color:${colorOf(r.label)}">${r.value}</div>
      <div class="ev-impact-basis">${r.basis}</div>
    </div>`).join('');
  return `<div class="ev-impact-breakdown">${rows}</div>`;
}

function _evFormulaInputs(d) {
  // Section 3: formula narrative + raw inputs table
  const formulaHtml = d.formulaLines
    ? `<div class="ev-formula-box">
        <div class="ev-formula-label">Calculation</div>
        <div class="ev-formula-lines">${d.formulaLines}</div>
        <div class="ev-formula-result text-green">${d.formulaResult}</div>
      </div>`
    : '';
  const conservativeHtml = d.conservativeNote
    ? `<div class="ev-conservative-note"><span class="ev-con-icon">~</span><span>${d.conservativeNote}</span></div>`
    : '';
  const inputs = d.formulaInputs ? Object.entries(d.formulaInputs) : [];
  const inputsHtml = inputs.length
    ? `<div class="ev-inputs-table">
        <div class="ev-inputs-hd"><span>Input</span><span>Value</span></div>
        ${inputs.map(([k, v]) => `
        <div class="ev-inputs-row">
          <span class="ev-inputs-key">${k.replace(/_/g,' ')}</span>
          <span class="ev-inputs-val">${v}</span>
        </div>`).join('')}
      </div>`
    : '';

  // ── (v26 · Fixes 1/2/3) Derivation sub-blocks ──────────────
  // Collapsed-by-default sub-sections that show where each "magic input"
  // actually came from. Reconciles to numbers already in OPPORTUNITIES.
  const derivBlocks = [];
  if (d.excessHoursDerivation) derivBlocks.push(_evExcessHoursDerivation(d.excessHoursDerivation));
  if (d.volumeRetentionModel)  derivBlocks.push(_evVolumeRetentionModel(d.volumeRetentionModel));
  if (d.dollarValueDerivation) derivBlocks.push(_evDollarValueDerivation(d.dollarValueDerivation));
  const derivHtml = derivBlocks.length ? `<div class="ev-deriv-stack">${derivBlocks.join('')}</div>` : '';

  return formulaHtml + conservativeHtml + (inputs.length ? `<div style="margin-top:10px">${inputsHtml}</div>` : '') + derivHtml;
}

// ── (v26 · Fix 1) Excess-hours derivation render ────────────
function _evExcessHoursDerivation(x) {
  return `
  <details class="ev-deriv-block">
    <summary class="ev-deriv-summary">
      <span class="ev-deriv-summary-label">Excess hours derivation</span>
      <span class="ev-deriv-summary-meta">Where the "${x.net_excess_hours} excess hours" input came from</span>
      <span class="ev-deriv-caret">▾</span>
    </summary>
    <div class="ev-deriv-body">
      <div class="tt-formula-block">
        <div class="tt-fb-h">Scheduled vs demand-justified hours</div>
        <span class="tt-fb-eq">scheduled_hours_actual         = ${x.scheduled_hours_actual} hrs/service · 7shifts</span><br>
        <span class="tt-fb-eq">covers_current_per_service     = ${x.covers_current_per_service} covers · Toast POS</span><br>
        <span class="tt-fb-eq">hours_per_cover_baseline       = ${x.hours_per_cover_baseline} hrs/cover · pre-catering ratio</span><br>
        <span class="tt-fb-eq">demand_justified_hours         = ${x.covers_current_per_service} × ${x.hours_per_cover_baseline} ≈ ${x.demand_justified_hours} hrs</span>

        <div class="tt-fb-h">Excess hours</div>
        <span class="tt-fb-eq">gross_excess  = ${x.scheduled_hours_actual} − ${x.demand_justified_hours} = ${x.gross_excess_hours} hrs</span><br>
        <span class="tt-fb-eq">net_excess    = ${x.gross_excess_hours} − ${x.manager_coverage_buffer} (manager buffer) = <strong>${x.net_excess_hours} hrs</strong> → flows to $/service math</span>

        <div class="tt-fb-h">Floor rule</div>
        <span class="tt-fb-eq">${x.floor_rule}</span>
      </div>
      <div class="ev-deriv-text">${x.derivation_text}</div>
    </div>
  </details>`;
}

// ── (v26 · Fix 2) Volume retention model render ─────────────
function _evVolumeRetentionModel(x) {
  const condChipClass = x.conditional_flag ? 'ev-deriv-chip-amber' : 'ev-deriv-chip-green';
  const condChipLabel = x.conditional_flag ? 'Conditional · breakeven > 95% retention' : 'Recommended · breakeven below assumed retention';
  return `
  <details class="ev-deriv-block">
    <summary class="ev-deriv-summary">
      <span class="ev-deriv-summary-label">Volume retention model</span>
      <span class="ev-deriv-summary-meta">Breakeven sensitivity for the $${x.current_price} → $${x.proposed_price} reprice</span>
      <span class="ev-deriv-caret">▾</span>
    </summary>
    <div class="ev-deriv-body">
      <div class="ev-deriv-chip-row">
        <span class="ev-deriv-chip ${condChipClass}">${condChipLabel}</span>
      </div>
      <div class="tt-formula-block">
        <div class="tt-fb-h">Contribution margin per unit</div>
        <span class="tt-fb-eq">cm_per_unit_current = $${x.current_price} − $${x.item_cost} = <strong>$${x.cm_per_unit_current.toFixed(2)}/plate</strong></span><br>
        <span class="tt-fb-eq">cm_per_unit_new     = $${x.proposed_price} − $${x.item_cost} = <strong>$${x.cm_per_unit_new.toFixed(2)}/plate</strong></span>

        <div class="tt-fb-h">Volume retention assumption</div>
        <span class="tt-fb-eq">current_volume                       = ${x.current_volume_per_week} plates/wk</span><br>
        <span class="tt-fb-eq">assumed_retention                    = ${x.assumed_volume_retention_pct}%</span><br>
        <span class="tt-fb-eq">expected_volume_at_new_price         = ${x.current_volume_per_week} × ${(x.assumed_volume_retention_pct/100).toFixed(2)} ≈ ${x.expected_volume_per_week_at_new_price} plates/wk</span>

        <div class="tt-fb-h">Weekly CM dollars</div>
        <span class="tt-fb-eq">current_weekly_cm   = ${x.current_volume_per_week} × $${x.cm_per_unit_current.toFixed(2)} = $${x.current_weekly_cm_dollars.toFixed(2)}/wk</span><br>
        <span class="tt-fb-eq">expected_weekly_cm  = ${x.expected_volume_per_week_at_new_price} × $${x.cm_per_unit_new.toFixed(2)} = $${x.expected_weekly_cm_dollars.toFixed(2)}/wk</span><br>
        <span class="tt-fb-eq">weekly_revenue_recovery = <strong>$${x.weekly_revenue_recovery.toFixed(2)}/wk</strong> → $${x.monthly_revenue_recovery.toLocaleString()}/mo run-rate equiv.</span>

        <div class="tt-fb-h">Breakeven volume retention</div>
        <span class="tt-fb-eq">breakeven_retention = cm_current ÷ cm_new = $${x.cm_per_unit_current.toFixed(2)} ÷ $${x.cm_per_unit_new.toFixed(2)} = <strong>${x.breakeven_volume_retention_pct.toFixed(1)}%</strong></span><br>
        <span class="tt-fb-eq" style="color:var(--t3)">Below this retention level, the reprice is net-negative on CM dollars.</span>
      </div>
      <div class="ev-deriv-text">${x.derivation_text}</div>
      <div class="ev-deriv-reconciliation"><strong>Reconciliation note:</strong> ${x.reconciliation_note}</div>
    </div>
  </details>`;
}

// ── (v26 · Fix 3) Dollar-value derivation render ────────────
function _evDollarValueDerivation(x) {
  return `
  <details class="ev-deriv-block">
    <summary class="ev-deriv-summary">
      <span class="ev-deriv-summary-label">Throughput exposure model · seat-based</span>
      <span class="ev-deriv-summary-meta">estimated · not verified · station-level root cause required before action</span>
      <span class="ev-deriv-caret">▾</span>
    </summary>
    <div class="ev-deriv-body">
      <div class="ev-deriv-chip-row">
        <span class="ev-deriv-chip ev-deriv-chip-amber">Confidence: ${x.confidence_flag} · KDS partial</span>
      </div>
      <div class="tt-formula-block">
        <div class="tt-fb-h">Ticket time overage</div>
        <span class="tt-fb-eq">current      = ${x.current_ticket_time_min} min</span><br>
        <span class="tt-fb-eq">baseline     = ${x.baseline_ticket_time_min} min</span><br>
        <span class="tt-fb-eq">overage      = <strong>+${x.overage_min} min</strong></span>

        <div class="tt-fb-h">Seat-based lost covers per service</div>
        <span class="tt-fb-eq">SP = ${x.service_period_min} min · seat_count = ${x.seat_count} · effective_fill_factor = ${x.effective_fill_factor}</span><br>
        <span class="tt-fb-eq">(SP / baseline_turn) − (SP / current_turn)</span><br>
        <span class="tt-fb-eq">= (${x.service_period_min} / ${x.baseline_table_turn_min}) − (${x.service_period_min} / ${x.current_table_turn_min}) ≈ ${x.seat_turns_delta_per_seat}</span><br>
        <span class="tt-fb-eq">lost_covers/service = ${x.seat_turns_delta_per_seat} × ${x.seat_count} × ${x.effective_fill_factor} ≈ <strong>${x.theoretical_lost_covers_per_service} covers</strong></span>

        <div class="tt-fb-h">Dollar exposure (seat-based, capacity-capped)</div>
        <span class="tt-fb-eq">weekly_exposure  = ${x.theoretical_lost_covers_per_service} × $${x.avg_check_lunch} × ${x.services_per_week_affected} svc = <strong>~$${x.weekly_revenue_exposure}/wk</strong></span><br>
        <span class="tt-fb-eq">monthly_exposure = ~$${x.weekly_revenue_exposure} × 4.33 ≈ <strong>$${x.monthly_revenue_exposure_seat_based.toLocaleString()}/mo seat-based</strong></span>

        <div class="tt-fb-h">Reconciliation vs headline figure</div>
        <span class="tt-fb-eq">headline_exposure (older lost-turns model) = $${x.headline_monthly_exposure.toLocaleString()}/mo</span><br>
        <span class="tt-fb-eq">seat-based exposure                          = $${x.monthly_revenue_exposure_seat_based.toLocaleString()}/mo</span><br>
        <span class="tt-fb-eq" style="color:var(--amber)">gap (over-claim risk) ≈ $${x.gap_vs_headline.toLocaleString()}/mo</span>
      </div>
      <div class="ev-deriv-text">${x.derivation_text}</div>
      <div class="ev-deriv-reconciliation" style="border-left-color:var(--amber);color:var(--amber)">
        <strong>Actionability:</strong> ${x.actionability}<br>
        <strong>Why confidence stays Low:</strong> ${x.confidence_reason}
      </div>
    </div>
  </details>`;
}

function _evSources(sources) {
  const statusMap = {
    healthy:  { dot:'healthy', label:'Live',     cls:'healthy' },
    stale:    { dot:'stale',   label:'Stale',    cls:'stale' },
    degraded: { dot:'degraded',label:'Partial',  cls:'stale' },
    missing:  { dot:'missing', label:'Missing',  cls:'missing' },
    unused:   { dot:'unused',  label:'Not used', cls:'unused' },
  };
  const confImpact = { healthy:'Full · DET', stale:'Reduced · EST', degraded:'Reduced · partial', missing:'Excluded', unused:'' };
  return `<div class="ev-src-table">${sources.map(s => {
    const st = statusMap[s.status] || statusMap.unused;
    const rowCls = s.status === 'stale' ? ' stale' : s.status === 'missing' ? ' missing' : s.status === 'unused' ? ' unused' : '';
    const ci = confImpact[s.status] || '';
    return `<div class="ev-src-row${rowCls}">
      <div class="ev-src-dot ${st.dot}"></div>
      <div class="ev-src-info">
        <div class="ev-src-name">${s.label}</div>
        <div class="ev-src-role">${s.role}</div>
      </div>
      <div class="ev-src-right">
        <div class="ev-src-sync">${s.sync}</div>
        <div class="ev-src-status ${st.cls}">${st.label}</div>
        ${ci ? `<div class="ev-src-conf-impact">${ci}</div>` : ''}
      </div>
    </div>`;
  }).join('')}</div>`;
}

function _evBaseline(rows) {
  return `<div class="ev-bl-table">
    <div class="ev-bl-hd"><span>Metric</span><span>Current</span><span>Baseline</span><span>Variance</span></div>
    ${rows.map(r => `<div class="ev-bl-row${r.sig?' sig':''}">
      <span class="ev-bl-metric">${r.metric}</span>
      <span class="ev-bl-current ${r.sig?'text-red':''}">${r.current}</span>
      <span class="ev-bl-baseline">${r.base}</span>
      <span class="ev-bl-variance ${r.varClass||''}">${r.variance}</span>
    </div>`).join('')}
  </div>`;
}

function _evGuardrails(grds, note) {
  const icons = { pass:'✓', watch:'~', fail:'✗' };
  const grdsHtml = `<div class="ev-gr-grid">${grds.map(g => `
    <div class="ev-gr-card ${g.status}">
      <div class="ev-gr-name">${g.name}</div>
      <div class="ev-gr-reading">
        <span class="ev-gr-val ${g.status==='fail'?'text-red':g.status==='watch'?'text-amber':'text-green'}">${icons[g.status]||'·'} ${g.current}</span>
        <span class="ev-gr-limit">${g.limit}</span>
      </div>
    </div>`).join('')}</div>`;
  const noteHtml = note ? `<div class="ev-gr-note">${note}</div>` : '';
  return grdsHtml + noteHtml;
}

function _evVerify(win, block, window_, blockers) {
  // win and block are now arrays; render as lists
  const winArr   = Array.isArray(win)   ? win   : (win   ? [win]   : []);
  const blockArr = Array.isArray(block) ? block : (block ? [block] : []);
  const blkArr   = Array.isArray(blockers) ? blockers : [];
  const listOf = (items, cls) => items.length
    ? `<ul class="ev-verify-list ${cls}">${items.map(i=>`<li>${i}</li>`).join('')}</ul>`
    : `<span class="ev-verify-none">None</span>`;
  return `<div class="ev-verify-box">
    <div class="ev-verify-row">
      <span class="ev-verify-icon ev-vi-pass">✓</span>
      <div><div class="ev-verify-label">Pass conditions</div>${listOf(winArr,'pass')}</div>
    </div>
    <div class="ev-verify-row">
      <span class="ev-verify-icon ev-vi-block">⛔</span>
      <div><div class="ev-verify-label">Block conditions</div>${listOf(blockArr,'block')}</div>
    </div>
    <div class="ev-verify-row">
      <span class="ev-verify-icon ev-vi-time">⏱</span>
      <div><div class="ev-verify-label">Monitoring window</div><span class="ev-verify-window">${window_||'—'}</span></div>
    </div>
    ${blkArr.length ? `<div class="ev-verify-row">
      <span class="ev-verify-icon ev-vi-warn">⚠</span>
      <div><div class="ev-verify-label">Current blockers</div>${listOf(blkArr,'blocker')}</div>
    </div>` : ''}
  </div>`;
}

function _evCTA(d) {
  const steps = (d.ctaSteps || []).map((s,i) =>
    `<div class="ev-cta-step"><span class="ev-cta-n">${i+1}</span><span>${s}</span></div>`).join('');
  const metaRows = [
    d.ctaOwner  ? `<div class="ev-cta-meta-row"><span>Owner</span><span>${d.ctaOwner}</span></div>` : '',
    d.ctaSystem ? `<div class="ev-cta-meta-row"><span>System</span><span>${d.ctaSystem}</span></div>` : '',
    d.ctaTime   ? `<div class="ev-cta-meta-row"><span>Time required</span><span>${d.ctaTime}</span></div>` : '',
  ].filter(Boolean).join('');
  return `<div class="ev-cta-block">
    <div class="ev-cta-title">${d.ctaTitle}</div>
    ${metaRows ? `<div class="ev-cta-meta">${metaRows}</div>` : ''}
    ${steps ? `<div class="ev-cta-steps">${steps}</div>` : ''}
    <div class="ev-cta-btns">
      <button class="btn btn-primary btn-sm" onclick="${d.ctaPrimary.fn}">${d.ctaPrimary.label}</button>
      ${d.ctaSecondary ? `<button class="btn btn-secondary btn-sm" onclick="${d.ctaSecondary.fn}">${d.ctaSecondary.label}</button>` : ''}
    </div>
  </div>`;
}

// ── Statistical proof card renderer ──────────────────────
function _evStatProof(d) {
  if (!d.statProof) return '';
  const sp = d.statProof;
  return `<div class="stat-proof">
    <div class="stat-proof-title">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      Statistical Proof
    </div>
    <div class="stat-proof-grid">
      <div class="stat-proof-row"><div class="stat-proof-key">Baseline window</div><div class="stat-proof-val">${sp.baselineWindow}</div></div>
      <div class="stat-proof-row"><div class="stat-proof-key">Sample size</div><div class="stat-proof-val">${sp.sampleSize}</div></div>
      <div class="stat-proof-row"><div class="stat-proof-key">Normal range</div><div class="stat-proof-val highlight">${sp.normalRange}</div></div>
      <div class="stat-proof-row"><div class="stat-proof-key">Current value</div><div class="stat-proof-val highlight">${sp.current}</div></div>
      <div class="stat-proof-row"><div class="stat-proof-key">Pattern</div><div class="stat-proof-val">${sp.pattern}</div></div>
      <div class="stat-proof-row"><div class="stat-proof-key">Trigger rule</div><div class="stat-proof-val">${sp.triggerRule}</div></div>
    </div>
    <div class="stat-proof-note">${sp.anomalyHandling}</div>
    <div class="kpi-registry-ref">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      Formula source: SKC KPI Registry v0.3
    </div>
  </div>`;
}

// ── Confidence math renderer ──────────────────────────────
function _evConfMath(d) {
  if (!d.confMath) return '';
  const cm = d.confMath;
  const behavior = cm.behavior
    ? `<div class="conf-behavior">${cm.behavior}</div>`
    : '';
  const penalties = (cm.penalties || []).map(p =>
    `<div class="conf-math-row"><span class="conf-math-label">Penalty: ${p.reason}</span><span class="conf-math-val penalty">${p.pts > 0 ? '−' : '+'}${Math.abs(p.pts)} pts</span></div>`
  ).join('');
  return `<div class="conf-math">
    <div class="conf-math-row"><span class="conf-math-label">Base confidence</span><span class="conf-math-val">${cm.base}%</span></div>
    ${penalties}
    <div class="conf-math-sep"></div>
    <div class="conf-math-row"><span class="conf-math-label">Final confidence</span><span class="conf-math-val result">${cm.final}%</span></div>
  </div>${behavior}`;
}

// ── Threshold explanation renderer ───────────────────────
function _evThresholds(d) {
  if (!d.thresholds) return '';
  return (d.thresholds || []).map(t => `
    <div class="threshold-box">
      <strong>${t.name}</strong><span class="threshold-tag">${t.type}</span><br>
      ${t.value} — ${t.explanation}
    </div>`).join('');
}

// ── Attribution status renderer ───────────────────────────
function _evAttribution(d) {
  if (!d.attribution) return '';
  const a = d.attribution;
  const checks = (a.checks || []).map(c => `
    <div class="attr-check ${c.pass ? 'pass' : 'fail'}">
      <svg class="attr-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        ${c.pass
          ? '<polyline points="20 6 9 17 4 12"/>'
          : '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'}
      </svg>
      ${c.label}
    </div>`).join('');
  return `<div class="attr-status">
    <div class="attr-status-title">Attribution status: <strong style="color:${a.verified ? 'var(--green)' : 'var(--amber)'}">${a.status}</strong></div>
    ${checks}
    <div class="attr-regression-note">${a.regressionNote}</div>
  </div>`;
}

// ── Operator memo renderer ────────────────────────────────
function _evOperatorMemo(d) {
  if (!d.operatorMemo) return '';
  const m = d.operatorMemo;
  const rows = [
    m.doThis     ? `<div class="memo-row"><span class="memo-key">Do this:</span><span class="memo-val">${m.doThis}</span></div>` : '',
    m.doNotChange ? `<div class="memo-row"><span class="memo-key">Do not change:</span><span class="memo-val">${m.doNotChange}</span></div>` : '',
    m.watch      ? `<div class="memo-row"><span class="memo-key">Watch:</span><span class="memo-val">${m.watch}</span></div>` : '',
    m.reverseIf  ? `<div class="memo-row"><span class="memo-key">Reverse if:</span><span class="memo-val">${m.reverseIf}</span></div>` : '',
    m.owner      ? `<div class="memo-row"><span class="memo-key">Owner:</span><span class="memo-val">${m.owner}</span></div>` : '',
    m.deadline   ? `<div class="memo-row"><span class="memo-key">Deadline:</span><span class="memo-val" style="color:var(--amber)">${m.deadline}</span></div>` : '',
    m.checkpoint ? `<div class="memo-row"><span class="memo-key">Next checkpoint:</span><span class="memo-val">${m.checkpoint}</span></div>` : '',
  ].filter(Boolean).join('');
  return `<div class="operator-memo">${rows}</div>`;
}

// ── Methodology renderer ──────────────────────────────────
function _evMethodology(d) {
  if (!d.methodology) return '';
  const m = d.methodology;
  const fields = [
    ['Metric',            m.metric],
    ['Formula',           m.formula ? m.formula + ' <span class="kpi-registry-ref" style="display:inline-flex;margin-left:4px">Formula source: SKC KPI Registry v0.3</span>' : null],
    ['Baseline type',     m.baselineType],
    ['Comparison',        m.comparison],
    ['Minimum sample',    m.minSample],
    ['Trigger',           m.trigger],
    ['Anomaly handling',  m.anomalyHandling],
    ['Confidence logic',  m.confidenceLogic],
    ['ROI rule',          m.roiRule],
  ].filter(([,v]) => v);
  return `<div class="methodology-block">${
    fields.map(([k,v]) => `<div class="meth-row"><span class="meth-key">${k}</span><span class="meth-val">${v}</span></div>`).join('')
  }</div>`;
}

// ── (Taya #18) Risk & effort matrix — static labels per recommendation ──────
function _evRisk(d) {
  const r = d.risk;
  if (!r) return '<div class="ev-empty" style="font-size:11.5px;color:var(--t3)">No risk profile recorded for this recommendation.</div>';
  const lvl = (v) => {
    const k = (v || '').toLowerCase();
    const cls = (k === 'elevated' || k === 'high') ? 'ev-risk-hi' : k === 'moderate' ? 'ev-risk-mid' : 'ev-risk-lo';
    const label = v ? v.charAt(0).toUpperCase() + v.slice(1) : '—';
    return `<span class="ev-risk-chip ${cls}">${label}</span>`;
  };
  const rows = [
    ['Difficulty',            `<span class="ev-risk-flat">${r.difficulty || '—'}</span>`],
    ['Time to implement',     `<span class="ev-risk-flat">${r.time || '—'}</span>`],
    ['Guest-experience risk', lvl(r.guest)],
    ['Staff risk',            lvl(r.staff)],
    ['Revenue risk',          lvl(r.revenue)],
  ];
  return `<div class="ev-risk-grid">${
    rows.map(([k,v]) => `<div class="ev-risk-row"><span class="ev-risk-k">${k}</span><span class="ev-risk-v">${v}</span></div>`).join('')
  }</div>${ r.note ? `<div class="ev-risk-note">${r.note}</div>` : '' }`;
}

function openEvDrawer(key) {
  const d = evData[key];
  if (!d) return;

  document.getElementById('evDrawerTitle').textContent = d.title;

  // ── Summary strip ────────────────────────────────────────
  const confColor = d.confidence >= 75 ? 'var(--green)' : d.confidence >= 60 ? 'var(--amber)' : 'var(--red)';
  const statusBadgeStyle = d.statusClass === 'active-recovery'
    ? 'background:var(--blue-d);color:var(--blue);border:1px solid var(--blue-b)'
    : d.statusClass === 'verified'
    ? 'background:var(--green-d);color:var(--green);border:1px solid var(--green-b)'
    : 'background:var(--hover);color:var(--t3);border:1px solid var(--border)';

  // Per-service first, weekly second, monthly muted
  const ps  = d.impactBreakdown && d.impactBreakdown.find(r => r.label === 'Per service');
  const wk  = d.impactBreakdown && d.impactBreakdown.find(r => r.label === 'Weekly exposure');
  const mo  = d.impactBreakdown && d.impactBreakdown.find(r => r.label === 'Monthly run-rate');
  const roiRow = d.impactBreakdown && d.impactBreakdown.find(r => r.label === 'Counted in ROI');
  const roiBadge = roiRow && roiRow.value === 'YES'
    ? `<span class="output-chip ot-ver" title="VER = Verified — monitoring window closed, all guardrails passed" style="font-size:9.5px">Counted in ROI ✓</span>`
    : `<span style="font-size:10.5px;font-weight:500;color:var(--t3)">Not counted in ROI</span>`;

  document.getElementById('evSummaryStrip').innerHTML = `
    <div class="ev-sum-cell ev-sum-span2">
      <div class="ev-sum-label">Recommended Action</div>
      <div class="ev-sum-val" style="font-size:11.5px;font-weight:500;line-height:1.5;white-space:normal">${d.what}</div>
    </div>
    <div class="ev-sum-cell">
      <div class="ev-sum-label">Per-service impact</div>
      <div class="ev-sum-val" style="flex-direction:column;align-items:flex-start;gap:2px">
        <div style="font-family:var(--mono);font-size:15px;font-weight:700;color:var(--t1)">${ps ? ps.value : d.impact}</div>
        ${wk ? `<div style="font-size:11px;color:var(--t2)">${wk.value}</div>` : ''}
        ${mo ? `<div style="font-size:10px;color:var(--t3)">${mo.value} run-rate</div>` : ''}
      </div>
    </div>
    <div class="ev-sum-cell">
      <div class="ev-sum-label">Confidence</div>
      <div class="ev-sum-val">
        <div class="ev-conf-bar"><div class="ev-conf-fill" style="width:${d.confidence}%;background:${confColor}"></div></div>
        <span class="ev-conf-pct" style="color:${confColor}">${d.confidence}%</span>
      </div>
    </div>
    <div class="ev-sum-cell">
      <div class="ev-sum-label">Status</div>
      <div class="ev-sum-val"><span class="badge" style="${statusBadgeStyle}">${d.status}</span></div>
    </div>
    <div class="ev-sum-cell">
      <div class="ev-sum-label">ROI</div>
      <div class="ev-sum-val">${roiBadge}</div>
    </div>`;

  // ── Body sections ────────────────────────────────────────
  const body = document.getElementById('evDrawerBody');
  body.innerHTML = [
    _evSection(1, 'Diagnosis',            _evTimeBasis(d),                                           true),
    _evSection(2, 'Financial Impact',     _evImpactBreakdown(d),                                     true),
    _evSection(3, 'Risk & Effort',        _evRisk(d)),
    _evSection(4, 'Calculation Trail',    _evFormulaInputs(d) + '<div style="margin-top:8px">' + _evThresholds(d) + '</div>'),
    _evSection(5, 'Statistical Proof',    _evStatProof(d)),
    _evSection(6, 'Source Data',          _evSources(d.sources) + '<div style="margin-top:8px">' + _evConfMath(d) + '</div>'),
    _evSection(7, 'Before vs Baseline',   _evBaseline(d.baseline)),
    _evSection(8, 'Guardrails',           _evGuardrails(d.guardrails, d.guardrailNote)),
    _evSection(9, 'Verification Rule',    _evVerify(d.verifyWin, d.verifyBlock, d.verifyWindow, d.verifyBlockers) + (d.attribution ? '<div style="margin-top:10px">' + _evAttribution(d) + '</div>' : '')),
    _evSection(10, 'Recommended Action',   _evCTA(d) + '<div style="margin-top:8px">' + _evOperatorMemo(d) + '</div>'),
    _evSection(11, 'Methodology',          _evMethodology(d)),
  ].join('');

  document.getElementById('evDrawer').classList.add('open');
  document.getElementById('evOverlay').classList.add('open');
}

function closeEvDrawer() {
  document.getElementById('evDrawer').classList.remove('open');
  document.getElementById('evOverlay').classList.remove('open');
}

function toggleEvSection(hd) {
  const body  = hd.nextElementSibling;
  const caret = hd.querySelector('.ev-sec-caret');
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  if (caret) caret.classList.toggle('open', !isOpen);
}

// ── Populate action tab containers ────────────────────────────
function populateActionTabs() {
  ['open','approvals','monitoring','completed'].forEach(tab => {
    const el = document.getElementById('ex-tab-' + tab + '-container');
    if (el) {
      try { el.innerHTML = renderActionsTab(tab); }
      catch(e) { console.warn('renderActionsTab error:', e.message); }
    }
  });
}

// (Escape key handled above in the ask panel section)

// ─── PROGRESS TIMELINE ───────────────────────────────────
// Base events — seed data; dynamic events appended from state
const TL_BASE = [
  { date:'May 1',  type:'verified',   cat:['menu'],       dot:'green',  title:'Mushroom Risotto removed — verified win',                   owner:'Marcus R.',  source:'Toast POS', conf:'88%', impact:'$420/mo', impact_cls:'green' },
  { date:'May 3',  type:'surfaced',   cat:['menu'],       dot:'gray',   title:'Grilled Salmon CM gap detected — $2,100/mo at risk',        owner:'SKC',        source:'Recipe Cost + Toast', conf:'71%', impact:'$2,100/mo', impact_cls:'amber' },
  { date:'May 9',  type:'surfaced',   cat:['labor'],      dot:'gray',   title:'Tue/Wed dinner overstaffing detected — 6 excess hrs/night', owner:'SKC',        source:'Toast POS + 7shifts', conf:'78%', impact:'$3,200/mo', impact_cls:'amber' },
  { date:'May 10', type:'action',     cat:['labor'],      dot:'blue',   title:'A005 assigned — Bar staffing reduction · Walnut Creek',     owner:'Devon K.',   source:'7shifts', conf:'91%', impact:'$820/mo', impact_cls:'green' },
  { date:'May 10', type:'surfaced',   cat:['throughput'], dot:'gray',   title:'Friday lunch ticket time drift detected — 3 wks consecutive',owner:'SKC',       source:'KDS', conf:'64%', impact:'$1,540/mo', impact_cls:'amber' },
  { date:'May 11', type:'monitoring', cat:['labor'],      dot:'blue',   title:'A005 monitoring started — Walnut Creek bar staffing',        owner:'Devon K.',   source:'Toast POS', conf:'91%', impact:null },
  { date:'May 12', type:'issue',      cat:['data'],       dot:'amber',  title:'7shifts OAuth token expired — labor data stale 18h',         owner:'System',     source:'7shifts', conf:null, impact:null },
  { date:'May 14', type:'action',     cat:['labor'],      dot:'blue',   title:'A001 assigned — Remove Oakland Tue dinner server',           owner:'Sarah C.',   source:'7shifts', conf:'78%', impact:'$3,200/mo', impact_cls:'amber' },
  { date:'May 14', type:'action',     cat:['labor'],      dot:'blue',   title:'A002 assigned — Wed dinner Berkeley schedule',               owner:'Sarah C.',   source:'7shifts', conf:'78%', impact:'$1,600/mo', impact_cls:'amber' },
  { date:'May 15', type:'verified',   cat:['labor'],      dot:'green',  title:'A005 verified win — bar staffing confirmed · Walnut Creek',  owner:'Devon K.',   source:'Toast POS', conf:'91%', impact:'$820/mo', impact_cls:'green' },
  { date:'May 15', type:'regression', cat:['throughput'], dot:'red',    title:'RPLH drifting $0.90/week — 3rd consecutive Tuesday',         owner:'SKC',        source:'Toast POS + 7shifts', conf:'DET', impact:null },
];

// Dynamic events built from CA_STATE + other actions
function tlBuildDynamic() {
  const events = [];
  Object.entries(CA_STATE || {}).forEach(([key, st]) => {
    const def = (typeof CA_DEFS !== 'undefined') ? CA_DEFS[key] : null;
    if (!def) return;
    const cat = def.category === 'Labor' ? ['labor'] : def.category === 'Menu' ? ['menu'] : ['throughput'];
    events.push({ date:'Today', type:'action', cat, dot:'blue', title:`${def.id} assigned — ${def.title}`, owner:st.owner.split('—')[0].trim(), source:'SKC Actions', conf:def.conf, impact:def.impact, impact_cls:'amber' });
    if (st.status === 'inprogress' || st.status === 'monitoring' || st.status === 'verified') {
      events.push({ date:'Today', type:'monitoring', cat, dot:'blue', title:`${def.id} in progress — ${def.title.slice(0,50)}…`, owner:st.owner.split('—')[0].trim(), source:'SKC', conf:def.conf, impact:null });
    }
    if (st.status === 'monitoring') {
      events.push({ date:'Today', type:'monitoring', cat, dot:'blue', title:`${def.id} monitoring started`, owner:st.owner.split('—')[0].trim(), source:'Toast POS', conf:def.conf, impact:null });
    }
    if (st.status === 'verified') {
      events.push({ date:'Today', type:'verified', cat, dot:'green', title:`${def.id} verified win — ${def.title.slice(0,50)}…`, owner:st.owner.split('—')[0].trim(), source:'Toast POS', conf:def.conf, impact:def.impact, impact_cls:'green' });
    }
  });
  if (typeof tlOwnerReportLogged !== 'undefined' && tlOwnerReportLogged) {
    events.push({ date:'Today', type:'report', cat:['all'], dot:'gray', title:'Owner report generated — May 11–17 weekly summary sent', owner:'You', source:'SKC Weekly Review', conf:null, impact:null });
  }
  return events;
}

let tlActiveFilter = 'all';

function tlSetFilter(f, btn) {
  tlActiveFilter = f;
  document.querySelectorAll('.tl-filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  tlRender();
}

function tlRender() {
  const list = document.getElementById('tlList');
  const empty = document.getElementById('tlEmpty');
  if (!list) return;
  const all = [...TL_BASE, ...tlBuildDynamic()].reverse(); // newest first
  const f = tlActiveFilter;
  const filtered = all.filter(e => {
    if (f === 'all')        return true;
    if (f === 'verified')   return e.type === 'verified';
    if (f === 'open')       return e.type === 'action';
    if (f === 'regression') return e.type === 'regression';
    if (f === 'data')       return e.type === 'issue' || e.cat.includes('data');
    return e.cat.includes(f);
  });
  if (empty) empty.style.display = filtered.length ? 'none' : '';
  list.innerHTML = filtered.map((e, i) => {
    const impactHtml = e.impact ? `<span class="tl-impact ${e.impact_cls||''}">${e.impact}</span>` : '';
    const confHtml   = e.conf   ? `<span class="src-tag">${e.conf}</span>` : '';
    const connector  = i < filtered.length - 1 ? '<div class="tl-connector"></div>' : '';
    return `<div class="tl-event">
      <div class="tl-line-col"><div class="tl-dot ${e.dot}"></div>${connector}</div>
      <div class="tl-body">
        <div class="tl-hd">
          <span class="tl-type ${e.type}">${e.type.replace('surfaced','Issue Surfaced').replace('action','Action Assigned').replace('monitoring','Monitoring').replace('verified','Verified Win').replace('regression','Regression').replace('issue','Data Issue').replace('report','Report')}</span>
          ${impactHtml}${confHtml}
        </div>
        <div class="tl-title">${e.title}</div>
        <div class="tl-meta">
          <span>${e.date}</span>
          <span>·</span>
          <span>${e.owner}</span>
          <span>·</span>
          <span class="src-tag"><span class="src-dot ${e.dot === 'green' ? 'green' : e.dot === 'red' ? 'red' : 'amber'}"></span>${e.source}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

// Re-render timeline whenever its screen is shown
const _origShowScreen = typeof showScreen === 'function' ? showScreen : null;

let tlOwnerReportLogged = false;

// ─── DEMO TOUR ───────────────────────────────────────────
// ── Tour state seed — ensures flow works even on a fresh load ─
function tourSeedState() {
  // Ensure leak1 action exists in CA_STATE so Actions and Timeline show it
  if (!CA_STATE['leak1']) {
    CA_STATE['leak1'] = {
      status: 'open',
      owner:  'Sarah C. — GM Oakland',
      due:    'Today before 3 PM',
      notes:  'Assigned via SKCDemoController',
    };
    injectKanbanCard('leak1');
    // Add timeline entry via tlRender (TL_BASE already has the seed events)
    tlOwnerReportLogged = false; // reset so step 8 logs it fresh
  }
}

const TOUR_STEPS = [

  // ── Step 1: Today — Priority Decision ────────────────────────────────
  {
    screen: 'home',
    title: 'Today: One Operating Decision',
    caption: 'SKC opens every morning with one ranked decision — not a dashboard. This action ranked highest because it has the strongest evidence, highest estimated value, and the simplest owner path before service.',
    target: '#demo-target-today-priority',
    action: () => {
      tourSeedState();
      closeCA(); closeEvDrawer(); closeDrawer();
      const askPnl = document.getElementById('askPanel');
      if (askPnl) askPnl.classList.remove('open');
    },
  },

  // ── Step 2: Trigger Logic — Why This Triggered ───────────────────────
  {
    screen: 'leaks',
    title: 'Why This Triggered',
    caption: 'SKC requires pattern evidence before surfacing an action. Tuesday dinner RPLH fell outside the normal range ($35.80–$40.60) for 6 of the last 6 comparable services. This is a structural drift, not noise.',
    target: '#demo-target-trigger-logic',
    action: () => {
      closeCA(); closeEvDrawer(); closeDrawer();
      switchTab('recovery', 'overview');
    },
  },

  // ── Step 3: Evidence — Show the Math ─────────────────────────────────
  {
    screen: 'leaks',
    title: 'Evidence: Formula, Source, Confidence',
    caption: 'Every number shows its formula, source data, baseline, normal range, sample size, and confidence math. 78% = 85% base minus 7 pts for stale 7shifts. No decorative numbers.',
    target: '.ev-drawer.open',
    action: () => {
      closeCA(); closeDrawer();
      setTimeout(() => openEvDrawer('leak1'), 150);
    },
  },

  // ── Step 4: Assign the Action ─────────────────────────────────────────
  {
    screen: 'leaks',
    title: 'Assign Recovery Action',
    caption: 'The GM assigns the action before service. SKC captures owner, deadline, service window, guardrails, and next checkpoint. This starts the monitoring clock.',
    target: '#caOverlay',
    action: () => {
      closeEvDrawer(); closeDrawer();
      setTimeout(() => openCA('leak1'), 150);
    },
  },

  // ── Step 5: Actions — Execution Workflow ───────────────────────────
  {
    screen: 'actions',
    title: 'Actions: Who Owns What',
    caption: 'Actions are not generic tasks. Each one is tied to an owner, service window, guardrails, ROI status, and verification eligibility. Active Recovery does not count toward ROI yet.',
    target: '#demo-target-action-row',
    action: () => {
      closeCA(); closeEvDrawer(); closeDrawer();
      tourSeedState();
      switchTab('execution', 'queue');
    },
  },

  // ── Step 6: Monitoring — Guardrails Active ────────────────────────────
  {
    screen: 'leaks',
    title: 'Monitoring: Guardrails Running',
    caption: 'After service, SKC monitors the primary KPI and four counter-metrics. Table turns are at Watch — 4 minutes from the threshold that would block a verified win.',
    target: '#demo-target-guardrails',
    action: () => {
      closeCA(); closeEvDrawer(); closeDrawer();
      switchTab('recovery', 'guardrails');
    },
  },

  // ── Step 7: Guardrails Passed → Verified Savings ──────────────────────
  {
    screen: 'scorecard',
    title: 'Guardrails Passed → Verified Savings',
    caption: 'When RPLH improves and all four counter-metrics stay within guardrail for two consecutive services, SKC classifies the value as Verified Savings. Only then does it count toward ROI.',
    target: '#demo-target-roi-proof',
    action: () => {
      closeCA(); closeEvDrawer(); closeDrawer();
      simPass();
      switchTab('roi', 'verified');
    },
  },

  // ── Step 8: Guardrail Failed → Rejected ───────────────────────────────
  {
    screen: 'scorecard',
    title: 'Guardrail Failed → Not Counted',
    caption: 'SKC also rejects fake wins. If labor efficiency improves but dining duration worsens beyond the guardrail, SKC counts $0 toward ROI. This is what makes the verified number trustworthy.',
    target: '#demo-target-rejected-row',
    action: () => {
      closeCA(); closeEvDrawer(); closeDrawer();
      simReset();
      switchTab('roi', 'verified');
    },
  },

  // ── Step 9: Proof Hierarchy ───────────────────────────────────────
  {
    screen: 'scorecard',
    title: 'Proof: Four Separate Buckets',
    caption: 'Verified Savings, Active Recovery, Open Exposure, and Rejected Value are always kept separate. Only Verified Savings counts toward ROI. The owner sees exactly what was proved, not what was estimated.',
    target: '#demo-target-roi-proof',
    action: () => {
      closeCA(); closeEvDrawer(); closeDrawer();
      switchTab('roi', 'summary');
    },
  },

  // ── Step 10: Reports — Weekly Owner Proof ─────────────────────────────
  {
    screen: 'reports',
    title: 'Weekly Owner Report',
    caption: 'The weekly report shows what SKC verified, what is still monitoring, what is open, what was rejected, and what needs owner approval — in one 90-second read.',
    target: '#demo-target-owner-memo',
    action: () => {
      closeCA(); closeEvDrawer(); closeDrawer();
      const orOv = document.getElementById('orOverlay');
      if (orOv) orOv.style.display = 'none';
      switchTab('reports', 'weekly');
    },
  },

  // ── Step 11: Data Quality — Source Impact ──────────────────────────────
  {
    screen: 'settings',
    title: 'Data Quality: Source Confidence',
    caption: 'SKC does not hide data problems. 7shifts stale 18h reduced labor confidence from 85% to 78% and limits ROI verification until reconnected. Reconnecting takes 5 minutes.',
    target: '#dq7shifts',
    action: () => {
      closeCA(); closeEvDrawer(); closeDrawer();
    },
  },

  // ── Step 12: Ask SKC — Explain the Decision ───────────────────────────
  {
    screen: 'home',
    title: 'Ask SKC: Explain Any Decision',
    caption: 'Ask SKC explains the trigger rule, evidence, formula, confidence math, action eligibility, ROI eligibility, and next step. It references the same analytics engine behind every card — not a generic chatbot.',
    target: '#chatHist',
    action: () => {
      closeCA(); closeEvDrawer(); closeDrawer();
      setTimeout(() => {
        if (typeof toggleAskPanel === 'function') {
          const askPnl = document.getElementById('askPanel');
          if (askPnl && !askPnl.classList.contains('open')) toggleAskPanel();
        }
        setTimeout(() => {
          if (typeof askPanelQ === 'function') askPanelQ('Why did this trigger?');
        }, 450);
      }, 300);
    },
  },

];

let tourIdx = 0;



function tourStart() {
  tourIdx = 0;
  document.getElementById('tourOverlay').style.display = 'block';
  tourRender();
}

function tourExit() {
  document.getElementById('tourOverlay').style.display = 'none';
  // Reset mask and card so they don't flash stale position on re-open
  const mask = document.getElementById('tourMask');
  const card = document.getElementById('tourCard');
  if (mask) mask.style.cssText = 'position:absolute;pointer-events:none';
  if (card) { card.style.bottom = ''; card.style.position = 'fixed'; }
  // Restore any opened panels
  const bar = document.getElementById('roiDemoBar');
  if (bar) bar.style.display = '';
}

function tourStep(dir) {
  const next = tourIdx + dir;
  if (next < 0 || next >= TOUR_STEPS.length) return;
  tourIdx = next;
  tourRender();
}

function tourRender() {
  const step  = TOUR_STEPS[tourIdx];
  const total = TOUR_STEPS.length;
  // Resolve deferred title functions (titles that reference runtime objects)
  const title = step._titleFn ? step._titleFn() : step.title;

  // Navigate to the correct screen first
  showScreen(step.screen, null, title);

  // Update card content immediately
  document.getElementById('tourStep').textContent   = `Step ${tourIdx + 1} of ${total}`;
  document.getElementById('tourTitle').textContent  = title;
  document.getElementById('tourCaption').textContent = step.caption;
  document.getElementById('tourBack').disabled       = tourIdx === 0;
  document.getElementById('tourBack').style.opacity  = tourIdx === 0 ? '.4' : '1';

  const nextBtn = document.getElementById('tourNext');
  if (tourIdx === total - 1) {
    nextBtn.textContent = 'Finish ✓';
    nextBtn.onclick = tourExit;
  } else {
    nextBtn.textContent = 'Next →';
    nextBtn.onclick = () => tourStep(1);
  }

  // Progress dots
  const dots = document.getElementById('tourDots');
  dots.innerHTML = Array.from({length: total}, (_, i) =>
    `<div style="width:${i === tourIdx ? 16 : 6}px;height:6px;border-radius:3px;background:${i === tourIdx ? 'var(--green)' : 'var(--border)'};transition:all .25s"></div>`
  ).join('');

  // Run step action, then highlight. Use longer delay for steps that open modals/drawers
  const hasModal = step.action && /Overlay|ev-drawer/.test(step.target || '');
  const delay    = hasModal ? 650 : (step.action ? 480 : 340);
  if (step.action) setTimeout(step.action, 200);
  setTimeout(() => tourHighlight(step.target), delay);
}

function tourHighlight(selector) {
  const mask  = document.getElementById('tourMask');
  const card  = document.getElementById('tourCard');
  if (!mask || !card) return;

  // Find target — querySelector, treating fixed-position visible elements as valid
  let target = null;
  if (selector) {
    target = document.querySelector(selector);
    if (target) {
      const cs = window.getComputedStyle(target);
      const isFixed = cs.position === 'fixed';
      // For fixed elements, check they're actually visible (display !== none)
      const isVisible = cs.display !== 'none' && cs.visibility !== 'hidden';
      if (!isFixed || !isVisible) {
        // Not a valid fixed-visible target — check non-fixed elements too
        if (!isFixed && target.offsetParent === null) {
          target = null; // hidden in off-screen screen, fall back
        } else if (isFixed && !isVisible) {
          target = null; // overlay not yet open, fall back
        }
      }
    }
    if (!target) {
      target = document.querySelector('.screen.active .sh') ||
               document.querySelector('.screen.active');
    }
  }

  const vpW = window.innerWidth;
  const vpH = window.innerHeight;
  const pad = 10;

  let rx, ry, rw, rh;

  if (target) {
    // Scroll into view first, synchronously estimate position
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    // Re-measure after a tick so we get post-scroll coords
    requestAnimationFrame(() => {
      const r = target.getBoundingClientRect();
      // Clamp so the hole is always fully on-screen
      rx = Math.max(4, r.left - pad);
      ry = Math.max(4, r.top  - pad);
      rw = Math.min(r.width  + pad * 2, vpW - rx - 4);
      rh = Math.min(r.height + pad * 2, vpH - ry - 4);

      // Cap height so it never fills the whole screen
      if (rh > vpH * 0.6) rh = Math.min(220, vpH * 0.6);

      applyTourMask(mask, card, rx, ry, rw, rh, vpW, vpH);
    });
  } else {
    // Fallback: highlight top strip of content area
    rx = 220; ry = 80; rw = vpW - 240; rh = 180;
    applyTourMask(mask, card, rx, ry, rw, rh, vpW, vpH);
  }
}

function applyTourMask(mask, card, rx, ry, rw, rh, vpW, vpH) {
  const isMobile = vpW < 600;
  const cardW = Math.min(344, vpW - 24);
  const cardH = 230; // safe estimate

  // ── Mask: box-shadow darkens outside, green border + glow highlights inside ──
  const glowColor = 'rgba(16,185,129,0.55)'; // --green at 55% opacity
  mask.style.cssText = [
    'position:absolute',
    `left:${rx}px`, `top:${ry}px`,
    `width:${rw}px`, `height:${rh}px`,
    'border-radius:8px',
    'box-shadow:0 0 0 9999px rgba(0,0,0,.6)',
    `outline:2px solid var(--green)`,
    `outline-offset:0px`,
    `filter:drop-shadow(0 0 8px ${glowColor})`,
    'transition:left .32s,top .32s,width .32s,height .32s cubic-bezier(.4,0,.2,1)',
    'pointer-events:none',
  ].join(';');

  // ── Card position: smart quadrant placement to avoid covering highlight ──
  // On mobile: always anchor to bottom of screen
  if (isMobile) {
    card.style.left  = '12px';
    card.style.top   = '';
    card.style.bottom = '12px';
    card.style.width  = (vpW - 24) + 'px';
    card.style.position = 'fixed';
    return;
  }
  card.style.bottom   = '';
  card.style.position = 'fixed';
  card.style.width    = cardW + 'px';

  // Determine best quadrant — prefer the quadrant with most space
  const spaceBelow  = vpH - (ry + rh);
  const spaceAbove  = ry;
  const spaceRight  = vpW - (rx + rw);
  const spaceLeft   = rx;

  let cx, cy;

  if (spaceBelow >= cardH + 20) {
    // Place below
    cy = ry + rh + 14;
    cx = Math.max(12, Math.min(rx, vpW - cardW - 12));
  } else if (spaceAbove >= cardH + 20) {
    // Place above
    cy = ry - cardH - 14;
    cx = Math.max(12, Math.min(rx, vpW - cardW - 12));
  } else if (spaceRight >= cardW + 20) {
    // Place to the right
    cx = rx + rw + 14;
    cy = Math.max(12, Math.min(ry, vpH - cardH - 12));
  } else if (spaceLeft >= cardW + 20) {
    // Place to the left
    cx = rx - cardW - 14;
    cy = Math.max(12, Math.min(ry, vpH - cardH - 12));
  } else {
    // Fallback: bottom of viewport, inset from edge
    cy = vpH - cardH - 16;
    cx = Math.max(12, Math.min(rx, vpW - cardW - 12));
  }

  // Final clamp to keep fully in viewport
  cx = Math.max(12, Math.min(cx, vpW - cardW - 12));
  cy = Math.max(12, Math.min(cy, vpH - cardH - 12));

  card.style.left = cx + 'px';
  card.style.top  = cy + 'px';
}

// Hook keyboard nav
document.addEventListener('keydown', e => {
  if (document.getElementById('tourOverlay').style.display === 'none') return;
  if (e.key === 'ArrowRight' || e.key === 'Enter') tourStep(1);
  if (e.key === 'ArrowLeft')  tourStep(-1);
  if (e.key === 'Escape')     tourExit();
});

// ─── REUSABLE TAB SYSTEM ─────────────────────────────────
// switchTab(group, tabKey)
// Deactivates all .skc-tab buttons and .skc-panel elements in the group,
// then activates the matching ones.
// group  — the data-tabs attribute value on the .skc-tabs container
// tabKey — appended to group with '-' to form the data-tab value on panels
//          e.g. switchTab('recovery','leaks') matches data-tab="recovery-leaks"
function switchTab(group, tabKey) {
  const panelId = group + '-' + tabKey;
  document.querySelectorAll(`.skc-tabs[data-tabs="${group}"] .skc-tab`).forEach(t => t.classList.remove('active'));
  const activeTab = document.querySelector(`.skc-tabs[data-tabs="${group}"] .skc-tab[data-key="${tabKey}"]`);
  if (activeTab) activeTab.classList.add('active');
  document.querySelectorAll(`.skc-panel[data-tab^="${group}-"]`).forEach(p => p.classList.remove('active'));
  const activePanel = document.querySelector(`.skc-panel[data-tab="${panelId}"]`);
  if (activePanel) activePanel.classList.add('active');
  // Render VEP charts when Evidence or History tab opens
  if (group === 'recovery' && (tabKey === 'evidence' || tabKey === 'history')) {
    renderVEP();
    if (tabKey === 'history') {
      setTimeout(() => {
        const src = document.getElementById('vepFunnel');
        const dst = document.getElementById('vepFunnelHistory');
        if (src && dst && !dst.innerHTML.trim()) dst.innerHTML = src.innerHTML;
      }, 100);
    }
  }
  // Re-render action cards when switching to any action tab
  if (group === 'execution' && ['open','approvals','monitoring','completed'].includes(tabKey)) {
    setTimeout(() => {
      const el = document.getElementById('ex-tab-' + tabKey + '-container');
      if (el && typeof renderActionsTab === 'function') {
        try { el.innerHTML = renderActionsTab(tabKey); } catch(e) { console.warn(e); }
      }
    }, 20);
  }
  // Render timeline into execution timeline tab
  if (group === 'execution' && tabKey === 'timeline') {    setTimeout(() => {
      if (typeof tlRender === 'function') {
        tlRender();
        const src = document.getElementById('tlList');
        const dst = document.getElementById('tlListExec');
        if (src && dst) dst.innerHTML = src.innerHTML;
      }
    }, 100);
  }
}

// ─── DEMO QA PANEL ───────────────────────────────────────
function toggleQA() {
  const p = document.getElementById('qaPanel');
  p.style.display = p.style.display === 'none' ? 'block' : 'none';
}

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.shiftKey && e.key === 'D') { e.preventDefault(); toggleQA(); }
});

function qa(action) {
  switch (action) {
    case 'dashboard':
      showScreen('home',null,'Today');
      showDemoToast('Opened Today', 'blue'); break;

    case 'leaks':
      showScreen('leaks',null,'Profit Recovery');
      showDemoToast('Opened Profit Recovery', 'blue'); break;

    case 'actions':
      showScreen('actions',null,'Actions');
      showDemoToast('Opened Actions', 'blue'); break;

    case 'scorecard':
      showScreen('scorecard',null,'ROI Proof');
      showDemoToast('Opened Proof', 'blue'); break;

    case 'timeline':
      showScreen('actions',null,'Actions');switchTab('execution','timeline');
      if (typeof tlRender === 'function') tlRender();
      showDemoToast('Opened Progress Timeline', 'blue'); break;

    case 'evidence':
      showScreen('leaks',null,'Profit Recovery');
      setTimeout(() => { closeCA(); openEvDrawer('leak1'); }, 150);
      showDemoToast('Opened Evidence Drawer', 'blue'); break;

    case 'createaction':
      showScreen('leaks',null,'Profit Recovery');
      setTimeout(() => { closeEvDrawer(); openCA('leak1'); }, 150);
      showDemoToast('Opened Assign Recovery Action', 'blue'); break;

    case 'ownerreport':
      showScreen('scorecard',null,'ROI Proof');
      setTimeout(() => openOwnerReport(), 150);
      showDemoToast('Opened Owner Proof Report', 'blue'); break;

    case 'actioncreated':
      tourSeedState();
      showScreen('actions',null,'Actions');
      showDemoToast('Recovery action assigned · Sarah C. · Due before 3 PM', 'green'); break;

    case 'monitoring':
      tourSeedState();
      if (CA_STATE['leak1']) advanceAction('leak1', 'monitoring');
      else { showDemoToast('Assign the action before starting monitoring', 'amber'); return; }
      break;

    case 'guardpass':
      simPass();
      showDemoToast('Guardrails passed · value eligible for Verified Savings', 'green'); break;

    case 'guardfail':
      simDegrade();
      showDemoToast('Guardrail failed · value rejected and not counted in ROI', 'red'); break;

    case 'tour':
      toggleQA();
      setTimeout(() => tourStart(), 100); break;

    case 'datahealth':
      showScreen('settings',null,'Data Quality');
      showDemoToast('7shifts stale · labor verification limited until reconnected', 'amber'); break;

    case 'askskc':
      showScreen('home',null,'Today');
      setTimeout(() => {
        if (typeof toggleAskPanel === 'function') toggleAskPanel();
        setTimeout(() => {
          if (typeof askPanelQ === 'function') askPanelQ('Why did this trigger?');
        }, 400);
      }, 200);
      showDemoToast('Ask SKC — explaining trigger logic', 'blue'); break;

    case 'reset':
      Object.keys(CA_STATE).forEach(k => delete CA_STATE[k]);
      document.querySelectorAll('[id^="ca-card-"]').forEach(el => el.remove());
      simReset();
      tlOwnerReportLogged = false;
      if (typeof tlRender === 'function') tlRender();
      vepRendered = false;
      closeCA(); closeEvDrawer(); closeDrawer();
      const orOv = document.getElementById('orOverlay');
      if (orOv) orOv.style.display = 'none';
      const askPnl = document.getElementById('askPanel');
      if (askPnl) askPnl.classList.remove('open');
      showScreen('home',null,'Today');
      showDemoToast('Demo reset — back to Today', 'blue'); break;

    // ─── (Trust layer: v23 implementation pass) ─────────────
    case 'tr-ob-day-0':       SKC_TRUST.qaDebug('ob-day-0');         break;
    case 'tr-ob-day-7':       SKC_TRUST.qaDebug('ob-day-7');         break;
    case 'tr-ob-day-14':      SKC_TRUST.qaDebug('ob-day-14');        break;
    case 'tr-walk-reset':     SKC_TRUST.qaDebug('walkthrough-reset'); break;
    case 'tr-dq-healthy':     SKC_TRUST.qaDebug('dq-healthy');       break;
    case 'tr-dq-toast':       SKC_TRUST.qaDebug('dq-toast-down');    break;
    case 'tr-dq-shifts':      SKC_TRUST.qaDebug('dq-shifts-stale');  break;
    case 'tr-dq-recipe':      SKC_TRUST.qaDebug('dq-recipe-stale');  break;
    case 'tr-rej-reset':      SKC_TRUST.qaDebug('rejections-reset'); break;

    // ─── (v26 · Fix 8) Role toggle ────────────────────────────
    case 'v26-role-gm':     setViewerRole('gm');    break;
    case 'v26-role-owner':  setViewerRole('owner'); break;
    case 'v26-role-both':   setViewerRole('both');  break;

    // ─── (v26 · Fix 10) DQ dirty toggle ──────────────────────
    case 'v26-dq-dirty':
      SKC_TRUST.state.dq_demo_state = 'data_dirty';
      SKC_TRUST.renderAll();
      showDemoToast('DQ: 14% of dine-in checks flagged as anomalous · recommendations excluding flagged checks', 'amber');
      break;

    // ─── (v26 · Fix 11) Pilot phase toggle ───────────────────
    case 'v26-pilot-0':   setPilotPhase('pilot', 0);   break;
    case 'v26-pilot-15':  setPilotPhase('pilot', 15);  break;
    case 'v26-pilot-30':  setPilotPhase('pilot', 30);  break;
    case 'v26-paying':    setPilotPhase('paying', 90); break;
  }
  if (action !== 'reset' && action !== 'tour') toggleQA();
}

// ── (v26 · Fix 8) Viewer role helpers ──────────────────────
function setViewerRole(role) {
  SKC_STATE.viewer_role = role;
  document.body.classList.remove('skc-role-gm','skc-role-owner','skc-role-both');
  document.body.classList.add('skc-role-' + role);
  const labelMap = { gm:'GM view active · Owner badges dimmed', owner:'Owner view active · GM badges dimmed', both:'Both audiences shown (default)' };
  showDemoToast('Role: ' + labelMap[role], role === 'gm' ? 'blue' : role === 'owner' ? 'green' : 'blue');
}

// ── (v26 · Fix 11) Pilot phase helpers ─────────────────────
function setPilotPhase(phase, day) {
  SKC_STATE.account_phase = phase;
  SKC_STATE.pilot_day = day;
  document.body.classList.remove('skc-phase-pilot','skc-phase-paying');
  document.body.classList.add('skc-phase-' + phase);
  // Update pilot expectations strip if visible
  if (typeof renderPilotExpectations === 'function') renderPilotExpectations();
  const msg = phase === 'pilot'
    ? `Pilot · Day ${day} of 30 · expected verified lines so far: ${day < 14 ? 0 : day < 30 ? '0–1' : '1 (typical)'}`
    : 'Paying customer · standard 2–4 wk monitoring windows';
  showDemoToast(msg, phase === 'pilot' ? 'amber' : 'green');
}

// ── (v26 · Fix 11) Render Pilot expectations card text ─────
function renderPilotExpectations() {
  const phase = SKC_STATE.account_phase || 'pilot';
  const day = SKC_STATE.pilot_day || 0;
  const titleEl = document.getElementById('rp-pilot-title');
  const chipEl  = document.getElementById('rp-pilot-phase-chip');
  if (!titleEl || !chipEl) return;
  if (phase === 'pilot') {
    titleEl.textContent = `Pilot verification expectations · Day ${day} of 30`;
    chipEl.textContent = `Pilot · Day ${day}`;
    chipEl.className = 'os-chip os-chip-amber';
  } else {
    titleEl.textContent = `Paying customer · standard verification windows`;
    chipEl.textContent = 'Paying';
    chipEl.className = 'os-chip os-chip-green';
  }
}

// ── (v26) Apply initial role + phase body classes on load ──
(function applyInitialDemoClasses(){
  if (typeof SKC_STATE === 'undefined') return;
  document.body.classList.add('skc-role-' + (SKC_STATE.viewer_role || 'gm'));
  document.body.classList.add('skc-phase-' + (SKC_STATE.account_phase || 'pilot'));
  // Defer render until DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderPilotExpectations);
  } else {
    renderPilotExpectations();
  }
})();

// ── (v26 · Fix 12 Pass A) Accessibility retrofit ──────────
// One-shot pass that upgrades non-button clickable elements (rows,
// cards, KPI tiles, nav items) to be keyboard-accessible without
// changing their visual treatment. Adds:
//   - role="button"
//   - tabindex="0"
//   - Enter / Space keyboard handler
//   - aria-label when missing
//
// Targets the high-traffic patterns: nav items, td-kpi-card, td-win,
// pr-sum-card, pr-opp-card, td-hero clickable rows, os-vq-row, and
// any element matching the [onclick] selector that is NOT already a
// button/anchor/input.
function applyA11yRetrofit() {
  const SELECTOR_LIST = [
    '.nav-item[onclick]',
    '.td-kpi-card[onclick]',
    '.td-win[onclick]',
    '.pr-sum-card[onclick]',
    '.pr-opp-card[onclick]',
    '.os-vq-row[onclick]',
    '.tb-health[onclick]',
    '.ask-panel-chip[onclick]',
    '[data-skc-clickable]',
  ];
  const selector = SELECTOR_LIST.join(',');
  const elements = document.querySelectorAll(selector);
  let upgraded = 0;
  elements.forEach(el => {
    // Skip if already a real button or anchor
    const tag = el.tagName.toUpperCase();
    if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT') return;
    // Mark
    if (!el.hasAttribute('role'))     el.setAttribute('role', 'button');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    el.classList.add('skc-a11y-clickable');
    // Add aria-label from visible text if not present
    if (!el.hasAttribute('aria-label')) {
      const txt = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
      if (txt) el.setAttribute('aria-label', txt);
    }
    // Keyboard handler — Enter / Space trigger click
    el.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        el.click();
      }
    });
    upgraded++;
  });
  return upgraded;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyA11yRetrofit);
} else {
  applyA11yRetrofit();
}

// ── (v26 · Fix 13) When SKC is wrong — handlers ────────────
function reopenForReverification(){
  const statusEl = document.getElementById('os-wrong-reverify-status');
  const btnEl    = document.getElementById('os-wrong-reverify-btn');
  if (statusEl) { statusEl.textContent = 'Reverifying'; statusEl.className = 'os-chip os-chip-amber'; }
  if (btnEl)    { btnEl.disabled = true; btnEl.textContent = 'Queued · 4-wk evaluation'; }
  showDemoToast('Reverification queued — guardrails will re-evaluate against the last 4 weeks of data', 'amber');
}
function openDisputePanel(){
  const p = document.getElementById('os-wrong-dispute-panel');
  if (p) p.style.display = 'block';
}
function closeDisputePanel(){
  const p = document.getElementById('os-wrong-dispute-panel');
  if (p) p.style.display = 'none';
}
function submitDispute(){
  const radios = document.querySelectorAll('input[name="dispute-reason"]');
  let chosen = null;
  radios.forEach(r => { if (r.checked) chosen = r.value; });
  if (!chosen) { showDemoToast('Choose a dispute reason first', 'amber'); return; }
  const statusEl = document.getElementById('os-wrong-dispute-status');
  const btnEl    = document.getElementById('os-wrong-dispute-btn');
  if (statusEl) { statusEl.textContent = 'Disputed'; statusEl.className = 'os-chip os-chip-red'; }
  if (btnEl)    { btnEl.disabled = true; btnEl.textContent = 'Flagged for human review'; }
  closeDisputePanel();
  showDemoToast('Verification disputed — flagged for human review. Subscription-coverage math will exclude this line until reviewed.', 'red');
}

function toggleCCAnalytics(hd) {
  const panel = document.getElementById('ccAnalyticsPanel');
  const caret = document.getElementById('ccAnalyticsCaret');
  const open  = panel.style.display === 'none';
  panel.style.display = open ? 'block' : 'none';
  if (caret) caret.textContent = open ? '▴ Hide analytics' : '▾ View charts, KPI grid, and confidence data';
}

// ─── BIND SKC FINANCIALS TO DOM ──────────────────────────
// Elements with data-skc="key" are populated from SKC model on load.
// This ensures every dollar amount shown in HTML derives from the
// canonical model, not from hard-coded strings.
// NOTE: skcFields block replaced — all bindings now handled by SKC_STATE.render()
// which is called from Block 1 DOMContentLoaded above.
// This block retained only for populateActionTabs (action cards) and proof rendering.
document.addEventListener('DOMContentLoaded', () => {
  if (typeof populateActionTabs === 'function') populateActionTabs();
  if (typeof applyVerification === 'function') applyVerification();
});

// ─── MORE NAV TOGGLE ─────────────────────────────────────
function setDaypart(btn) {
  btn.closest('.daypart-group').querySelectorAll('.daypart-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showDemoToast(btn.textContent.trim() + ' view selected', 'blue');
}
function toggleMoreNav(labelEl) {
  const items = document.getElementById('moreNavItems');
  const caret = document.getElementById('moreNavCaret');
  const open  = items.style.display === 'none';
  items.style.display = open ? 'block' : 'none';
  if (caret) caret.style.transform = open ? 'rotate(180deg)' : '';
}

// ─── APPROVAL QUEUE ──────────────────────────────────────
function aqDecide(cardId, decision) {
  const card = document.getElementById(cardId);
  if (!card) return;
  const msgs = { approved: ['green','Approved — action can now be created.'], rejected: ['red','Rejected — recommendation dismissed.'], moredata: ['amber','More data requested — action blocked pending update.'] };
  const [color, msg] = msgs[decision];
  card.style.opacity = '.5';
  card.style.pointerEvents = 'none';
  card.querySelector('.dr-card-footer div:last-child').innerHTML = `<span style="font-size:12px;font-weight:600;color:var(--${color})">${decision === 'approved' ? '✓' : decision === 'rejected' ? '✗' : '⏳'} ${msg}</span>`;
  showDemoToast(msg, color);
}

function openOwnerReport() {
  tlOwnerReportLogged = true;
  document.getElementById('orOverlay').style.display = 'flex';
}

// ── Reports screen button handlers ────────────────────────
function rptGenerateWeekly() {
  const verified = '$97/wk equivalent ($420/mo run-rate)';
  const recovery = '$189/wk';
  const exposure = '$1,243/wk';
  showDemoToast(
    `Weekly owner report generated for Rosewood Group — Week of May 18. Includes ${verified} in verified recovery (counted in ROI), ${recovery} active recovery under monitoring (not yet counted), and ${exposure} in open weekly exposure not counted as ROI.`,
    'green'
  );
}
function rptExportPDF() {
  showDemoToast('Owner proof PDF generated — Rosewood Group · Week of May 18 · 1.4× verified ROI · $420/mo confirmed. Check your downloads.', 'green');
}
function rptCopySummary() {
  const summary = `Rosewood Group · SKC Weekly Summary · Week of May 18, 2026\n\nThis week SKC verified $97/wk in savings, equal to $420/mo run-rate equivalent (counted in ROI).\nSKC is monitoring $189/wk in active recovery ($820/mo run-rate — not yet counted).\nSKC found $1,243/wk in open weekly exposure ($6,840/mo run-rate projection — not counted as ROI).\n\nVerified ROI: 1.05× ($420/mo run-rate equivalent vs $399/mo subscription)\nNext action due: Remove 1 server · Oakland Tuesday dinner · Sarah C. · before 3 PM today\n\nActive recovery and open exposure are estimated from per-service data. Monthly figures are run-rate projections. None count as ROI until monitoring confirms with all guardrails passing.`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(summary).then(() =>
      showDemoToast('Owner summary copied to clipboard — paste into email or message', 'blue')
    );
  } else {
    showDemoToast('Owner summary copied to clipboard', 'blue');
  }
}
function rptShareGM() {
  showDemoToast('Weekly summary shared with GM (Sarah C.) — they will receive it via the SKC mobile app before service today.', 'blue');
}
function rptEmailReport() {
  showDemoToast('Weekly owner report emailed to Rosewood Group owner — includes verified proof, active recovery status, and open exposure summary.', 'blue');
}

// Hook showScreen to auto-render timeline when navigating to it
document.addEventListener('DOMContentLoaded', () => {
  const origShowScreen = window.showScreen;
  if (origShowScreen) {
    window.showScreen = function(id, ...args) {
      origShowScreen(id, ...args);
      if (id === 'timeline') tlRender();
    };
  }
  tlRender(); // initial render for if timeline is active on load
});

// ─── ASSIGN RECOVERY ACTION FLOW ─────────────────────────

// Action definitions keyed by leak
const CA_DEFS = (function buildCADefs() {
  function oppToCADef(opp) {
    const fmt = SKC_STATE.fmt;
    return {
      id:        opp.ca_key === 'leak1' ? 'A006' : opp.ca_key === 'leak2' ? 'A007' : 'A008',
      category:  opp.category,
      title:     opp.title + ' · ' + opp.location_name,
      impact:    fmt.dollar(opp.impact.portfolio_monthly_impact),
      conf:      opp.confidence_score + '%',
      confCls:   opp.confidence_score >= 80 ? 'green' : opp.confidence_score >= 65 ? 'amber' : 'gray',
      location:  opp.location_name,
      system:    opp.recommendation.system,
      verify:    opp.verification_rule.pass_conditions[0],
      guardrails: opp.counter_metrics.map(g => ({
        name: g.name,
        val:  g.current + ' ' + g.unit,
        limit:(g.op==='lte'?'≤ ':'≥ ') + g.limit + ' ' + g.unit,
        st:   g.status,
      })),
      playbook: opp.recommendation.playbook,
      evidence: opp.variances.map(v => [
        v.metric,
        (v.unit==='$'||v.unit==='$/hr'?'$'+v.current.toFixed(2):v.current+' '+v.unit),
        (v.unit==='$'||v.unit==='$/hr'?'$'+v.baseline.toFixed(2):v.baseline+' '+v.unit),
        (v.variance>0?'+':'')+v.variance,
        opp.source_data.required_sources[0] ? ({ toast:'Toast POS', shifts:'7shifts', menu:'Recipe Cost', kds:'KDS', reviews:'Reviews', accounting:'Accounting' }[opp.source_data.required_sources[0]] || '') : '',
      ]),
    };
  }
  return {
    leak1: oppToCADef(OPPORTUNITIES.labor),
    leak2: oppToCADef(OPPORTUNITIES.salmon),
    leak3: oppToCADef(OPPORTUNITIES.throughput),
  };
})();
const CA_STATE = {};
let CA_CURRENT = null;

function openCA(leakKey) {
  // Accept both leak keys (leak1,leak2,leak3), OPP IDs, and category names
  const normKey = (leakKey === 'OPP-001' || leakKey === 'labor')      ? 'leak1'
                : (leakKey === 'OPP-002' || leakKey === 'salmon')     ? 'leak2'
                : (leakKey === 'OPP-003' || leakKey === 'throughput') ? 'leak3'
                : leakKey;
  const def = CA_DEFS[normKey];
  if (!def) { showScreen('actions', null, 'Actions'); return; }
  CA_CURRENT = normKey;
  document.getElementById('caModalTitle').textContent = def.title;
  document.getElementById('caImpactStrip').innerHTML =
    `<strong>${def.impact}</strong> estimated monthly recovery · ${def.conf} confidence · <span class="badge ${def.confCls}" style="vertical-align:middle">EST</span> · ${def.location}`;
  document.getElementById('caVerify').textContent = def.verify;
  document.getElementById('caNotes').value = '';
  document.getElementById('caOverlay').style.display = 'flex';
}

function openSimulateDrawer(leakKey) {
  document.getElementById('simulateOverlay').style.display = 'flex';
}
function closeSimulateDrawer() {
  document.getElementById('simulateOverlay').style.display = 'none';
}
function closeCA() {
  document.getElementById('caOverlay').style.display = 'none';
  CA_CURRENT = null;
}

function submitCA() {
  if (!CA_CURRENT) return;
  const def   = CA_DEFS[CA_CURRENT];
  const owner = document.getElementById('caOwner').value;
  const due   = document.getElementById('caDue').value;
  const notes = document.getElementById('caNotes').value;
  CA_STATE[CA_CURRENT] = { status: 'open', owner, due, notes };
  closeCA();
  injectKanbanCard(CA_CURRENT);
  showDemoToast(`Recovery action assigned · ${owner.split('—')[0].trim()} · Due ${due}`, 'green');
  // (v28) Deep-link to Pending Decisions subpage — the new card lives there as a draft.
  showScreen('actions', null, ACTIONS_SUBPAGE_TITLES.pending);
  setTimeout(() => showActionsSubpage('pending'), 30);
}


function openRecoveryDetail(leakKey) {
  showScreen('recovery-detail', null, 'Recovery Detail');
}
function openActionDetail(leakKey) {
  showScreen('action-detail', null, 'Action Detail');
}

function injectKanbanCard(leakKey) {
  const def = CA_DEFS[leakKey];
  const st  = CA_STATE[leakKey];
  if (!def || !st) return;
  const cardId = 'ca-card-' + leakKey;
  const existing = document.getElementById(cardId);
  if (existing) existing.remove();

  const colMap = { open: 'kanbanOpen', inprogress: 'kanbanInProgress', monitoring: 'kanbanMonitoring', verified: 'kanbanVerified' };
  const col = document.getElementById(colMap[st.status] || 'kanbanOpen');
  if (!col) return;

  const grHtml = def.guardrails.map(g => {
    const icon = g.st === 'pass' ? '✓' : g.st === 'watch' ? '~' : '✗';
    const col  = { pass: 'var(--green)', watch: 'var(--amber)', fail: 'var(--red)' }[g.st];
    return `<span style="font-size:9.5px;color:${col}">${icon} ${g.name}</span>`;
  }).join(' ');

  const statusLabel = { open: 'Open', inprogress: 'In Progress', monitoring: 'Monitoring', verified: 'Verified Win' }[st.status];
  const card = document.createElement('div');
  card.id = cardId;
  card.className = 'action-card';
  card.onclick = () => openActionDrawer(leakKey);
  card.innerHTML = `
    <div class="ac-id">${def.id} · ${def.category} · <span style="color:var(--green)">${statusLabel}</span></div>
    <div class="ac-title">${def.title}</div>
    <div class="ac-meta">
      <div class="ac-row"><span class="ac-row-l">Owner</span><span class="ac-row-r">${st.owner.split('—')[0].trim()}</span></div>
      <div class="ac-row"><span class="ac-row-l">Due</span><span class="ac-row-r">${st.due}</span></div>
      <div class="ac-row"><span class="ac-row-l">Impact</span><span class="ac-impact">${def.impact}</span></div>
      <div class="ac-row"><span class="ac-row-l">Confidence</span><span><span class="badge ${def.confCls}">${def.conf}</span></span></div>
      <div class="ac-row"><span class="ac-row-l">Guardrails</span><span style="display:flex;flex-wrap:wrap;gap:3px">${grHtml}</span></div>
    </div>
    ${st.status !== 'open' ? `<div class="prog-bar"><div class="prog-fill" style="width:${{inprogress:45,monitoring:75,verified:100}[st.status]||0}%"></div></div>` : ''}`;
  col.appendChild(card);
  updateKanbanCounts();
}

function updateKanbanCounts() {
  const openEl = document.getElementById('kanbanOpenCt');
  if (openEl) openEl.textContent = 2 + Object.values(CA_STATE).filter(s => s.status === 'open').length;
}

function openActionDrawer(leakKey) {
  const def = CA_DEFS[leakKey];
  const st  = CA_STATE[leakKey];
  if (!def) return;
  const statusNow = st ? st.status : 'unassigned';
  const statusLabels = { open: 'Open', inprogress: 'In Progress', monitoring: 'Monitoring', verified: 'Verified Win', unassigned: 'Unassigned' };

  const grRows = def.guardrails.map(g => {
    const icon = g.st === 'pass' ? '✓' : g.st === 'watch' ? '~' : '✗';
    const color = { pass: 'var(--green)', watch: 'var(--amber)', fail: 'var(--red)' }[g.st];
    return `<div class="ac-row"><span class="ac-row-l" style="font-size:11px">${g.name}</span>
      <span style="font-size:11px;font-family:var(--mono);color:${color}">${icon} ${g.val} <span style="color:var(--t3)">${g.limit}</span></span></div>`;
  }).join('');

  const evRows = def.evidence.map(r =>
    `<div class="evidence-row"><span>${r[0]}</span><span class="mono">${r[1]}</span><span class="mono">${r[2]}</span><span class="mono">${r[3]}</span><span><span class="source-tag">${r[4]}</span></span></div>`
  ).join('');

  const steps = def.playbook.map((s, i) =>
    `<div class="step-item"><div class="step-num">${i + 1}</div><div class="step-text">${s}</div></div>`
  ).join('');

  const log = st ? [
    `🟢 Assigned to ${st.owner.split('—')[0].trim()} · ${st.due}`,
    ...(statusNow === 'inprogress'  ? ['🔵 Marked In Progress'] : []),
    ...(statusNow === 'monitoring'  ? ['🔵 Marked In Progress', '🟣 Monitoring started'] : []),
    ...(statusNow === 'verified'    ? ['🔵 Marked In Progress', '🟣 Monitoring window closed', '✅ Verified Win confirmed'] : []),
  ].map(l => `<div style="margin-bottom:4px">${l}</div>`).join('') : '<div style="color:var(--t3)">No activity — create action first.</div>';

  const btnMap = {
    open:       ['inprogress', 'Mark In Progress',   'btn-primary'],
    inprogress: ['monitoring', 'Start Monitoring',    'btn-secondary'],
    monitoring: ['verified',   'Verify Win',          'btn-secondary'],
    verified:   [null,         '✓ Verified Win',      'btn-ghost'],
    unassigned: [null,         'Not yet assigned',    'btn-ghost'],
  };
  const [nextSt, btnLabel, btnCls] = btnMap[statusNow];
  const actionBtn = nextSt
    ? `<button class="btn ${btnCls} btn-sm" onclick="advanceAction('${leakKey}','${nextSt}')">${btnLabel}</button>`
    : `<button class="btn btn-ghost btn-sm" disabled>${btnLabel}</button>`;

  document.getElementById('drawerTitle').textContent = `${def.id} · ${def.category} — ${def.title.slice(0, 42)}…`;
  document.getElementById('drawerBody').innerHTML = `
    <div class="drawer-section">
      <div class="drawer-section-title">Impact &amp; Status</div>
      <div style="font-size:22px;font-weight:600;font-family:var(--mono);color:var(--green)">${def.impact}</div>
      <div style="font-size:12px;color:var(--t3);margin-top:4px"><span class="badge ${def.confCls}">${def.conf}</span> &nbsp;Status: <strong style="color:var(--t1)">${statusLabels[statusNow]}</strong></div>
    </div>
    ${st ? `<div class="drawer-section"><div class="drawer-section-title">Assignment</div>
      <div class="ac-row"><span class="ac-row-l" style="font-size:11px">Owner</span><span style="font-size:11px">${st.owner.split('—')[0].trim()}</span></div>
      <div class="ac-row"><span class="ac-row-l" style="font-size:11px">Due</span><span style="font-size:11px">${st.due}</span></div>
      ${st.notes ? `<div class="ac-row"><span class="ac-row-l" style="font-size:11px">Notes</span><span style="font-size:11px;color:var(--t2)">${st.notes}</span></div>` : ''}
    </div>` : ''}
    <div class="drawer-section"><div class="drawer-section-title">Playbook</div><div class="step-list">${steps}</div></div>
    <div class="drawer-section">
      <div class="drawer-section-title">Evidence</div>
      <div class="evidence-panel">
        <div class="evidence-hd"><span>Metric</span><span>Current</span><span>Baseline</span><span>Variance</span><span>Source</span></div>
        ${evRows}
      </div>
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Guardrail Status</div>
      <div class="ac-meta" style="background:var(--hover);border:1px solid var(--border);border-radius:var(--r-md);padding:10px 12px">${grRows}</div>
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Verification Rule</div>
      <div class="verify-box" style="margin-bottom:0"><div class="verify-text">${def.verify}</div></div>
    </div>
    <div class="drawer-section"><div class="drawer-section-title">Activity Log</div><div style="font-size:11.5px;color:var(--t3)">${log}</div></div>
    <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
      ${actionBtn}
      <button class="btn btn-ghost btn-sm" onclick="closeDrawer()">Close</button>
    </div>`;

  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('open');
}

function advanceAction(leakKey, newStatus) {
  if (!CA_STATE[leakKey]) return;
  CA_STATE[leakKey].status = newStatus;
  const labels = { inprogress: 'In Progress', monitoring: 'Monitoring', verified: 'Verified Win ✓' };
  showDemoToast(`${CA_DEFS[leakKey].id} → ${labels[newStatus]}`, newStatus === 'verified' ? 'green' : 'blue');
  injectKanbanCard(leakKey);
  closeDrawer();
  setTimeout(() => openActionDrawer(leakKey), 100);
}

// ─── DATA QUALITY → CONFIDENCE LABEL SYNC ────────────────
// Source truth: read from actual DQ card states in the DOM.
// Rules encoded here; no new pages or charts built.

// ═══════════════════════════════════════════════════════════
// GLOBAL DATA QUALITY MODEL
// Single source of truth for all source health across the platform.
// Every affected screen reads from DQ_STATE; applyGlobalDQ() propagates
// every consequence of a source status change across all screens.
// ═══════════════════════════════════════════════════════════

// ─── DQ_STATE — computed view of SKC_STATE.data_quality ───────────────────
// ─── DQ_STATE — backwards-compatible façade over DQ_SOURCES ──────────────
const DQ_STATE = {
  get sources() { return SKC_STATE.data_quality.sources; },
  get(id)   { return SKC_STATE.data_quality.sources[id]; },
  status(id){ return SKC_STATE.data_quality.sources[id]?.status || 'healthy'; },
  metricConf(metric) {
    const base = {
      rplh: OPPORTUNITIES.labor.confidence_score,
      labor_pct: OPPORTUNITIES.labor.confidence_score,
      hours_scheduled: OPPORTUNITIES.labor.confidence_score,
      food_cost: OPPORTUNITIES.salmon.confidence_score,
      contribution_margin: OPPORTUNITIES.salmon.confidence_score,
      ticket_time: OPPORTUNITIES.throughput.confidence_score,
      review_rating: 85, complaints: 85,
    };
    return base[metric] || 70;
  },
  actionRule(category) {
    const rules = {
      labor:      DQ_STATE.status('shifts') === 'stale' ? 'requires_approval' : 'allowed',
      menu:       DQ_STATE.status('menu') === 'missing' ? 'requires_approval' : 'allowed',
      throughput: DQ_STATE.status('kds') === 'missing' ? 'blocked' : 'allowed',
    };
    return rules[category] || 'allowed';
  },
  completeness() { return SKC_STATE.data_quality.global_health; },
};

// ═══════════════════════════════════════════════════════════════
//  DATA QUALITY MODEL
//
//  Single authority for all source health, confidence propagation,
//  action availability, and verification eligibility.
//
//  Every screen reads from these functions — never from its own
//  hard-coded assumptions about source health.
// ═══════════════════════════════════════════════════════════════

// ── Canonical source registry ─────────────────────────────────
const DQ_SOURCES = {
  toast: {
    source_id:   'toast',
    name:        'Toast POS',
    icon:        '🟢',
    sync_frequency: 'Every 5 min',
    affected_metrics: ['sales','covers','avg_check','ticket_time','table_turns','rplh','labor_pct','menu_mix'],
    affected_features: ['Today hero','Profit Recovery','Actions','Proof','Reports','Ask SKC'],
    affected_opportunity_categories: ['Labor','Menu','Throughput'],
    get status()     { return SKC_STATE.data_quality.sources.toast.status; },
    get last_synced(){ return SKC_STATE.data_quality.sources.toast.lastSync; },
    confidence_impact: { healthy:0, stale:-30, degraded:-15, missing:-50 },
    action_rule: {
      healthy:   'allowed',
      stale:     'requires_approval',
      degraded:  'allowed',
      missing:   'blocked',
    },
    verification_rule: {
      healthy:  'eligible',
      stale:    'blocked',
      degraded: 'conditional',
      missing:  'blocked',
    },
    get reconnect_cta() {
      return this.status === 'healthy' ? null
        : { label: 'Reconnect Toast POS', fn: "showScreen('settings',null,'Data Quality')", urgency: this.status === 'missing' ? 'critical' : 'warn' };
    },
    rules: {
      stale: [
        'Suppress real-time revenue estimates — show last-known with staleness label',
        'Show red/amber labels on avg check, covers, RPLH, ticket time',
        'Block new recommendations that depend on fresh sales data',
        'All opportunity dollar values revert to "last known" with age badge',
      ],
      missing: [
        'All opportunity calculations unavailable',
        'Today hero shows critical data warning',
        'All actions blocked',
        'Verification blocked',
      ],
    },
  },
  shifts: {
    source_id:   'shifts',
    name:        'Labor / 7shifts',
    icon:        '🟡',
    sync_frequency: 'Every 15 min',
    affected_metrics: ['hours_scheduled','hours_excess','labor_pct','rplh','wage_blended'],
    affected_features: ['Today hero','Profit Recovery · Labor card','Evidence Drawer','Actions','Proof','Ask SKC'],
    affected_opportunity_categories: ['Labor'],
    get status()     { return SKC_STATE.data_quality.sources.shifts.status; },
    get last_synced(){ return SKC_STATE.data_quality.sources.shifts.lastSync; },
    confidence_impact: { healthy:0, stale:-7, degraded:-15, missing:-60 },
    action_rule: {
      healthy:   'allowed',
      stale:     'requires_approval',
      degraded:  'requires_approval',
      missing:   'blocked',
    },
    verification_rule: {
      healthy:  'eligible',
      stale:    'blocked',         // cannot verify labor wins without current schedule data
      degraded: 'blocked',
      missing:  'blocked',
    },
    get reconnect_cta() {
      return this.status === 'healthy' ? null
        : { label: 'Reconnect 7shifts', fn: "dqFix('shifts')", urgency: this.status === 'missing' ? 'critical' : 'warn' };
    },
    rules: {
      stale: [
        'Labor confidence reduced from 85% to 78%',
        'Labor actions require GM or owner approval before execution',
        'Labor verification blocked — cannot confirm RPLH improvement without schedule data',
        'Labor-related Proof values cannot become Verified',
        'Today hero shows data warning if the top action is labor-related',
        'Profit Recovery · Labor card shows confidence-reduced badge',
        'Evidence Drawer source section shows stale row with reconnect CTA',
        'Actions screen shows blocker notice on labor actions',
        'Ask SKC mentions stale data before recommending any labor action',
      ],
      missing: [
        'All labor actions blocked',
        'Labor verification permanently blocked until reconnected',
        'Labor confidence set to 0 — estimates suppressed',
      ],
    },
  },
  kds: {
    source_id:   'kds',
    name:        'Kitchen Display (KDS)',
    icon:        '🟠',
    sync_frequency: 'Continuous',
    affected_metrics: ['ticket_time','ticket_baseline','kitchen_throughput'],
    affected_features: ['Profit Recovery · Throughput card','Evidence Drawer','Actions throughput'],
    affected_opportunity_categories: ['Throughput'],
    get status()     { return SKC_STATE.data_quality.sources.kds.status; },
    get last_synced(){ return SKC_STATE.data_quality.sources.kds.lastSync; },
    confidence_impact: { healthy:0, stale:-35, degraded:-16, missing:-60 },
    action_rule: {
      healthy:   'allowed',
      stale:     'requires_approval',
      degraded:  'allowed',         // partial data allowed, confidence reduced
      missing:   'blocked',
    },
    verification_rule: {
      healthy:  'eligible',
      stale:    'blocked',
      degraded: 'conditional',      // allowed but note proxy mode
      missing:  'blocked',
    },
    get reconnect_cta() {
      return this.status === 'healthy' ? null
        : { label: 'Fix KDS connection', fn: "showScreen('settings',null,'Data Quality')", urgency: this.status === 'missing' ? 'critical' : 'warn' };
    },
    rules: {
      degraded: [
        'Kitchen throughput uses proxy mode — ticket time from aggregate KDS, no per-station breakdown',
        'Ticket-time confidence reduced from 80% to 64%',
        'Evidence Drawer explains proxy method and missing station data',
        'Throughput opportunity marked as EST (proxy) not DET',
      ],
      missing: [
        'All throughput calculations unavailable',
        'Throughput opportunity confidence 0 — suppressed',
        'Throughput actions blocked',
      ],
    },
  },
  menu: {
    source_id:   'menu',
    name:        'Menu / Recipe Cost',
    icon:        '🟡',
    sync_frequency: 'Manual upload',
    affected_metrics: ['food_cost','contribution_margin','menu_mix','item_cost'],
    affected_features: ['Profit Recovery · Menu card','Evidence Drawer','Actions menu','Owner Reports'],
    affected_opportunity_categories: ['Menu'],
    get status()     { return SKC_STATE.data_quality.sources.menu.status; },
    get last_synced(){ return SKC_STATE.data_quality.sources.menu.lastSync; },
    confidence_impact: { healthy:0, stale:-10, degraded:-10, missing:-45 },
    action_rule: {
      healthy:   'allowed',
      stale:     'allowed',          // allowed but note stale costs
      degraded:  'allowed',
      missing:   'requires_approval',
    },
    verification_rule: {
      healthy:  'eligible',
      stale:    'eligible',           // can verify price change without fresh cost data
      degraded: 'eligible',
      missing:  'conditional',
    },
    get reconnect_cta() {
      return this.status === 'healthy' ? null
        : { label: 'Upload recipe cost file', fn: "showScreen('settings',null,'Data Quality')", urgency: 'info' };
    },
    rules: {
      stale: [
        'Menu opportunity confidence reduced from 81% to 71%',
        'Item cost noted as stale with last-upload date',
        'Operator must verify item cost before submitting reprice for approval',
      ],
      missing: [
        'Menu contribution margin unavailable — menu opportunity suppressed',
        'Recipe cost required for CM calculation',
      ],
    },
  },
  reviews: {
    source_id:   'reviews',
    name:        'Google Reviews',
    icon:        '🟡',
    sync_frequency: 'Every 30 min',
    affected_metrics: ['review_rating','complaints'],
    affected_features: ['Profit Recovery · Guardrails','Proof','Verification eligibility'],
    affected_opportunity_categories: ['Labor','Menu','Throughput'],  // guardrail for all
    get status()     { return SKC_STATE.data_quality.sources.reviews.status; },
    get last_synced(){ return SKC_STATE.data_quality.sources.reviews.lastSync; },
    confidence_impact: { healthy:0, stale:-5, degraded:-10, missing:-40 },
    action_rule: {
      healthy:  'allowed',
      stale:    'allowed',
      degraded: 'allowed',
      missing:  'allowed',            // non-blocking for actions
    },
    verification_rule: {
      healthy:  'eligible',
      stale:    'conditional',        // can still verify but note stale complaint signal
      degraded: 'conditional',
      missing:  'conditional',        // if complaint guardrail required, mark note
    },
    get reconnect_cta() {
      return this.status === 'healthy' ? null
        : { label: 'Reconnect Google Reviews', fn: "showScreen('settings',null,'Data Quality')", urgency: 'info' };
    },
    rules: {
      stale: [
        'Review/complaint guardrail shows reduced-confidence badge',
        'Complaint count last known — may not reflect current week',
        'Verified win can close but note is added to Proof record',
      ],
      missing: [
        'Complaint guardrail unavailable — verification proceeds without review signal',
        'Proof record notes missing review data',
      ],
    },
  },
  accounting: {
    source_id:   'accounting',
    name:        'Accounting',
    icon:        '🔴',
    sync_frequency: 'Not connected',
    affected_metrics: ['prime_cost','net_margin','cogs'],
    affected_features: ['Reports','Proof','Owner Reports'],
    affected_opportunity_categories: [],    // non-blocking
    get status()     { return SKC_STATE.data_quality.sources.accounting.status; },
    get last_synced(){ return SKC_STATE.data_quality.sources.accounting.lastSync; },
    confidence_impact: { healthy:0, stale:-10, degraded:-5, missing:-15 },
    action_rule: {
      healthy:  'allowed',
      stale:    'allowed',
      degraded: 'allowed',
      missing:  'allowed',            // non-blocking for actions
    },
    verification_rule: {
      healthy:  'eligible',
      stale:    'eligible',
      degraded: 'eligible',
      missing:  'eligible',           // savings can verify without accounting
    },
    get reconnect_cta() {
      return this.status === 'healthy' ? null
        : { label: 'Connect accounting system', fn: "showScreen('settings',null,'Data Quality')", urgency: 'info' };
    },
    rules: {
      missing: [
        'Operational savings (labor, menu, throughput) can show — not affected',
        'Full net-margin confirmation unavailable',
        'Reports and Proof show this limitation with a note',
        'Owner Reports label prime cost and net margin as unavailable',
      ],
    },
  },
};

// ── getSourceHealth(source_id) ────────────────────────────────
//  Returns full health object for a source.
function getSourceHealth(source_id) {
  const src = DQ_SOURCES[source_id];
  if (!src) return { status: 'unknown', healthy: false, warn: false, blocked: false };
  const st = src.status;
  return {
    source_id,
    name:       src.name,
    status:     st,
    last_synced:src.last_synced,
    healthy:    st === 'healthy',
    warn:       st === 'stale' || st === 'degraded',
    blocked:    st === 'missing',
    degraded:   st === 'degraded',
    stale:      st === 'stale',
    confidence_penalty: src.confidence_impact[st] || 0,
    action_rule:        src.action_rule[st] || 'allowed',
    verification_rule:  src.verification_rule[st] || 'eligible',
    reconnect_cta:      src.reconnect_cta,
    rules:              src.rules[st] || [],
    output_chip:        (typeof renderOutputChip === 'function')
      ? renderOutputChip(
          st === 'healthy' ? 'deterministic'
          : st === 'missing' ? 'unavailable'
          : 'estimated', null)
      : st.toUpperCase(),
  };
}

// ── getOpportunityDataHealth(opportunity_id) ──────────────────
//  Returns the DQ health profile for an opportunity — which sources
//  it needs, which are unhealthy, and the net confidence score.
function getOpportunityDataHealth(opportunity_id) {
  const opp = typeof opportunity_id === 'string'
    ? (OPPORTUNITIES[opportunity_id] || Object.values(OPPORTUNITIES).find(o => o.opportunity_id === opportunity_id || o.leak_key === opportunity_id))
    : opportunity_id;
  if (!opp) return null;

  const required   = opp.source_data.required_sources;
  const statuses   = required.map(id => ({ id, ...getSourceHealth(id) }));
  const unhealthy  = statuses.filter(s => !s.healthy);
  const blocked    = statuses.filter(s => s.blocked);
  const stale      = statuses.filter(s => s.stale || s.degraded);
  const totalPenalty = statuses.reduce((sum, s) => sum + s.confidence_penalty, 0);
  const netConf    = Math.max(0, opp.confidence_score);    // already accounts for DQ

  const action_blocked   = blocked.length > 0 || statuses.some(s => s.action_rule === 'blocked');
  const action_approval  = !action_blocked && statuses.some(s => s.action_rule === 'requires_approval');
  const verify_blocked   = statuses.some(s => s.verification_rule === 'blocked');
  const verify_cond      = !verify_blocked && statuses.some(s => s.verification_rule === 'conditional');

  // Compose the DQ warning message
  const warnings = unhealthy.map(s => {
    if (s.blocked)  return `${s.name} not connected — ${opp.category} opportunity may be incomplete`;
    if (s.stale)    return `${s.name} last synced ${s.last_synced} — confidence reduced`;
    if (s.degraded) return `${s.name} providing partial data — confidence reduced`;
    return `${s.name} status: ${s.status}`;
  });

  return {
    opportunity_id:  opp.opportunity_id,
    category:        opp.category,
    required_sources:required,
    source_statuses: statuses,
    unhealthy_sources: unhealthy,
    blocked_sources:   blocked,
    stale_sources:     stale,
    confidence_score:  netConf,
    confidence_penalty:totalPenalty,
    action_blocked,
    action_approval,
    verify_blocked,
    verify_conditional: verify_cond,
    warnings,
    primary_warning:    warnings[0] || null,
    all_healthy:        unhealthy.length === 0,
  };
}

// ── getActionAvailability(action_id) ─────────────────────────
//  Returns whether an action can be taken, needs approval,
//  or is blocked — and why.
function getActionAvailability(action_id) {
  const actions = SKC_STATE.actions;
  const action  = typeof action_id === 'string' ? actions[action_id] : action_id;
  if (!action) return { available: false, reason: 'Action not found' };

  // Support both old schema (leak_key) and new ACTIONS schema (linked_opportunity_id)
  const opp_key = action.leak_key || (action.linked_opportunity_id
    ? action.linked_opportunity_id.replace('OPP-001','labor').replace('OPP-002','salmon').replace('OPP-003','throughput')
    : null);
  const opp = opp_key ? (OPPORTUNITIES[opp_key] ||
    Object.values(OPPORTUNITIES).find(o => o.ca_key === opp_key || o.leak_key === opp_key)) : null;

  if (!opp) {
    // Non-opportunity actions (verified wins etc.)
    return { available: true, needs_approval: false, blocked: false, blockers: [], approvers: [] };
  }

  const dqHealth = getOpportunityDataHealth(opp);
  const blockers  = [];
  const approvers = [];
  const notes     = [];

  if (dqHealth.action_blocked) {
    dqHealth.blocked_sources.forEach(s => blockers.push(`${s.name} not connected — reconnect to unlock`));
  }
  if (dqHealth.action_approval) {
    dqHealth.source_statuses
      .filter(s => s.action_rule === 'requires_approval')
      .forEach(s => approvers.push(`${s.name} is ${s.status} — GM or owner approval required`));
  }
  if (action.requires_approval) {
    approvers.push(action.approval_reason || 'Business rule requires owner approval');
  }

  // DQ-specific notes
  const shiftsHealth = getSourceHealth('shifts');
  if (opp.category === 'Labor' && shiftsHealth.stale) {
    notes.push(`7shifts last synced ${shiftsHealth.last_synced} — labor schedule data may be stale. Reconnect to restore full confidence.`);
  }
  const menuHealth = getSourceHealth('menu');
  if (opp.category === 'Menu' && menuHealth.stale) {
    notes.push(`Recipe cost file last updated ${menuHealth.last_synced} — verify item cost before executing.`);
  }

  return {
    action_id:       action.id,
    category:        opp.category,
    available:       blockers.length === 0,
    needs_approval:  approvers.length > 0,
    blocked:         blockers.length > 0,
    blockers,
    approvers,
    notes,
    primary_blocker: blockers[0] || null,
    primary_note:    notes[0] || null,
    confidence:      opp.confidence_score,
    output_chip:     (typeof getOutputLabel === 'function')
      ? getOutputLabel(blockers.length > 0 ? 'unavailable' : 'open_opportunity', opp.confidence_score).chip
      : '',
  };
}

// ── getVerificationEligibility(opportunity_id) ───────────────
//  Returns whether a recovery action can be moved to Verified,
//  and all blocking conditions.
function getVerificationEligibility(opportunity_id) {
  const opp = typeof opportunity_id === 'string'
    ? (OPPORTUNITIES[opportunity_id] || Object.values(OPPORTUNITIES).find(o => o.opportunity_id === opportunity_id || o.leak_key === opportunity_id))
    : opportunity_id;
  if (!opp) return { eligible: false, reason: 'Opportunity not found' };

  const dqHealth = getOpportunityDataHealth(opp);
  const vr = opp.verification_rule;
  const guardrailVerdict = SKC_STATE.guardrails.verdict();
  const blockers = [];
  const conditions = [];

  // Source-level blocks
  if (dqHealth.verify_blocked) {
    dqHealth.source_statuses
      .filter(s => s.verification_rule === 'blocked')
      .forEach(s => blockers.push(`${s.name} is ${s.status} — must be healthy for verification`));
  }

  // Guardrail check
  if (guardrailVerdict === 'blocked') {
    blockers.push('One or more guardrails are failing — all must pass throughout the monitoring window');
  } else if (guardrailVerdict === 'monitoring') {
    conditions.push('Table turns at Watch (48 min, limit 52 min) — must stay ≤ 52 min throughout monitoring window');
  }

  // Verification rule pass conditions
  const blockeds = vr.blocked_by || [];
  blockeds.forEach(b => blockers.push(b));

  // Special rules per category
  if (opp.category === 'Labor') {
    const shiftsH = getSourceHealth('shifts');
    if (shiftsH.stale || shiftsH.blocked) {
      blockers.push(`7shifts ${shiftsH.status} — cannot confirm schedule change without current labor data`);
    }
  }
  if (opp.category === 'Throughput') {
    const kdsH = getSourceHealth('kds');
    if (kdsH.blocked) {
      blockers.push('KDS not connected — ticket time cannot be verified');
    } else if (kdsH.degraded) {
      conditions.push('KDS partial — ticket time measured but no per-station confirmation');
    }
  }

  const accountingH = getSourceHealth('accounting');
  const accountingNote = accountingH.blocked
    ? 'Accounting not connected — operational savings can verify, but net-margin confirmation unavailable'
    : null;

  return {
    opportunity_id:   opp.opportunity_id,
    category:         opp.category,
    eligible:         blockers.length === 0,
    conditional:      blockers.length === 0 && conditions.length > 0,
    blocked:          blockers.length > 0,
    blockers,
    conditions,
    accounting_note:  accountingNote,
    monitoring_period:vr.required_monitoring_period,
    pass_conditions:  vr.pass_conditions,
    fail_conditions:  vr.fail_conditions,
    primary_blocker:  blockers[0] || null,
    primary_condition:conditions[0] || null,
    output_type:      blockers.length > 0 ? 'unavailable' : 'open_opportunity',
  };
}

// ── applyDataQualityToUI() ────────────────────────────────────
//  Propagates all DQ state to every screen.
//  Called by SKC_STATE.render() — runs after every state mutation.
function applyDataQualityToUI() {
  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  const toast    = getSourceHealth('toast');
  const shifts   = getSourceHealth('shifts');
  const kds      = getSourceHealth('kds');
  const menu     = getSourceHealth('menu');
  const reviews  = getSourceHealth('reviews');
  const accounting = getSourceHealth('accounting');

  const laborDQ  = getOpportunityDataHealth('labor');
  const salmonDQ = getOpportunityDataHealth('salmon');
  const tpDQ     = getOpportunityDataHealth('throughput');

  const a006avail = getActionAvailability('A006');
  const a007avail = getActionAvailability('A007');
  const a008avail = getActionAvailability('A008');

  const laborVE  = getVerificationEligibility('labor');
  const salmonVE = getVerificationEligibility('salmon');
  const tpVE     = getVerificationEligibility('throughput');

  // ── helpers ───────────────────────────────────────────────────
  const setText = (id, t)     => { const el = $(id); if (el) el.textContent = t; };
  const setHTML = (id, h)     => { const el = $(id); if (el) el.innerHTML = h; };
  const setFill = (id, pct, color) => {
    const el = $(id); if (!el) return;
    el.style.width = pct + '%';
    el.style.background = color || (pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)');
  };
  const show = (id, vis = true) => { const el = $(id); if (el) el.style.display = vis ? '' : 'none'; };
  const toggleCls = (el, cls, on) => el && el.classList[on ? 'add' : 'remove'](cls);
  const setChip = (id, chip_html) => { const el = $(id); if (el) el.outerHTML = chip_html; };

  const confChip = (score, type) => typeof renderOutputChip === 'function'
    ? renderOutputChip(type || (score >= 80 ? 'deterministic' : 'estimated'), score)
    : score + '%';
  const blockerBanner = (msg, cta_fn, cta_label) =>
    `<div class="dq-banner warn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span>${msg}</span>${cta_fn ? '<button class="dq-banner-cta" onclick="' + cta_fn + '">' + cta_label + '</button>' : ''}</div>`;
  const infoBanner = (msg) =>
    `<div class="dq-banner info"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>${msg}</span></div>`;
  const srcTag = (src_health) => {
    const cls = src_health.healthy ? 'src-dot green' : src_health.stale ? 'src-dot amber' : 'src-dot red';
    const label = src_health.stale ? `${src_health.name} · ${src_health.last_synced} · stale`
      : src_health.blocked ? `${src_health.name} · not connected`
      : src_health.degraded ? `${src_health.name} · partial data`
      : `${src_health.name} · live`;
    return `<span class="src-tag"><span class="${cls}"></span>${label}</span>`;
  };

  // ─────────────────────────────────────────────────────────────
  //  1. TODAY HERO
  // ─────────────────────────────────────────────────────────────
  // Today banner: only show for BLOCKED sources (critical failure).
  // Stale data is surfaced inline in the stat strip Data Confidence cell.
  // A yellow top-of-page banner should not open the Today screen in a warning state.
  const todayBanner = $('dq-today-banner');
  if (todayBanner) {
    if (toast.blocked) {
      // Toast POS blocked = true critical failure — app cannot function
      todayBanner.innerHTML = blockerBanner(
        `Toast POS not connected — revenue and cover data unavailable. SKC cannot generate reliable recommendations.`,
        "showScreen('settings',null,'Data Quality')", 'View Data Quality'
      );
      todayBanner.style.display = '';
    } else if (shifts.blocked) {
      // 7shifts blocked = cannot create or verify labor actions at all
      todayBanner.innerHTML = blockerBanner(
        `7shifts not connected — labor schedule data unavailable. Labor recovery actions are blocked until reconnected.`,
        "dqFix('shifts')", 'Reconnect 7shifts'
      );
      todayBanner.style.display = '';
    } else {
      // Stale or degraded sources: shown inline in stat strip — no top banner
      todayBanner.style.display = 'none';
    }
  }

  // Topbar health dot
  const tbDot = document.querySelector('.tb-health-dot');
  if (tbDot) {
    tbDot.style.background = toast.healthy && shifts.healthy ? 'var(--green)'
      : toast.blocked ? 'var(--red)' : 'var(--amber)';
  }
  const tbTime = document.querySelector('.tb-health-time');
  if (tbTime) tbTime.textContent = toast.last_synced;

  // ─────────────────────────────────────────────────────────────
  //  2. PROFIT LEAKS — labor card
  // ─────────────────────────────────────────────────────────────
  // Confidence fill + value
  setFill('dq-lc1-conf-fill', laborDQ.confidence_score,
    laborDQ.confidence_score >= 70 ? 'var(--amber)' : 'var(--red)');
  setText('dq-lc1-conf-val', laborDQ.confidence_score + '%');

  const lc1Badge = $('dq-lc1-conf-badge') || document.querySelector('[data-dq-target="dq-lc1-conf-badge"]');
  if (lc1Badge) lc1Badge.outerHTML =
    `<span id="dq-lc1-conf-badge" class="output-chip ${shifts.healthy ? 'ot-act' : 'ot-est'}">${shifts.healthy ? 'ACT' : 'EST'} · ${laborDQ.confidence_score}%${shifts.stale ? ' · 7shifts stale' : ''}</span>`;

  // Labor source tag in leaks card
  const lc1SrcEl = $('dq-lc1-source');
  if (lc1SrcEl) lc1SrcEl.innerHTML = srcTag(shifts);

  // Recovery screen banner (labor)
  const recBanner = $('dq-recovery-banner');
  if (recBanner) {
    if (shifts.stale) {
      recBanner.innerHTML = blockerBanner(
        `7shifts stale ${shifts.last_synced} — labor actions need approval. Reconnect to restore full confidence and unlock verified win eligibility.`,
        "dqFix('shifts')", 'Reconnect 7shifts'
      );
      recBanner.style.display = '';
    } else if (shifts.blocked) {
      recBanner.innerHTML = blockerBanner(
        '7shifts not connected — all labor actions blocked. Connect 7shifts to unlock labor recovery.',
        "showScreen('settings',null,'Data Quality')", 'Connect 7shifts'
      );
      recBanner.style.display = '';
    } else {
      recBanner.style.display = 'none';
    }
  }

  // ─────────────────────────────────────────────────────────────
  //  3. PROFIT LEAKS — salmon card
  // ─────────────────────────────────────────────────────────────
  setFill('dq-lc2-conf-fill', salmonDQ.confidence_score,
    salmonDQ.confidence_score >= 70 ? 'var(--amber)' : 'var(--red)');
  setText('dq-lc2-conf-val', salmonDQ.confidence_score + '%');

  const lc2Badge = $('dq-lc2-conf-badge') || document.querySelector('[data-dq-target="dq-lc2-conf-badge"]');
  if (lc2Badge) lc2Badge.outerHTML =
    `<span id="dq-lc2-conf-badge" class="output-chip ot-open" title="OPEN = Open opportunity — not yet actioned">OPEN · ${salmonDQ.confidence_score}%${menu.stale ? ' · recipe stale' : ''}</span>`;

  // ─────────────────────────────────────────────────────────────
  //  4. PROFIT LEAKS — throughput card
  // ─────────────────────────────────────────────────────────────
  const lc3Fill = $('dq-lc3-conf-fill');
  if (lc3Fill) {
    lc3Fill.style.width = tpDQ.confidence_score + '%';
    lc3Fill.style.background = tpDQ.confidence_score >= 70 ? 'var(--amber)' : 'var(--red)';
  }
  const lc3Val = $('dq-lc3-conf-val');
  if (lc3Val) lc3Val.textContent = tpDQ.confidence_score + '%';

  const lc3Badge = $('dq-lc3-conf-badge');
  if (lc3Badge) lc3Badge.outerHTML =
    `<span id="dq-lc3-conf-badge" class="output-chip ot-open" title="OPEN = Open opportunity — not yet actioned">OPEN · ${tpDQ.confidence_score}%${kds.degraded ? ' · KDS partial' : ''}</span>`;

  // KDS proxy mode note
  const lc3KdsNote = $('dq-lc3-kds-note');
  if (lc3KdsNote) {
    lc3KdsNote.style.display = kds.degraded || kds.blocked ? '' : 'none';
    if (kds.degraded) lc3KdsNote.textContent = 'KDS partial data — proxy mode. No per-station breakdown.';
    if (kds.blocked)  lc3KdsNote.textContent = 'KDS not connected — throughput uses Toast proxy only.';
  }

  // ─────────────────────────────────────────────────────────────
  //  5. ACTIONS SCREEN
  // ─────────────────────────────────────────────────────────────
  // Labor action blocker
  const exLaborSrc = $('dq-ex-labor-src');
  if (exLaborSrc) exLaborSrc.innerHTML = srcTag(shifts);

  const exLaborBlocker = $('dq-ex-labor-blocker');
  if (exLaborBlocker) {
    if (a006avail.needs_approval && !a006avail.blocked) {
      exLaborBlocker.innerHTML = infoBanner(`7shifts stale ${shifts.last_synced} — this action requires GM approval before scheduling.`);
      exLaborBlocker.style.display = '';
    } else if (a006avail.blocked) {
      exLaborBlocker.innerHTML = blockerBanner('7shifts not connected — labor actions blocked.', "showScreen('settings',null,'Data Quality')", 'Connect 7shifts');
      exLaborBlocker.style.display = '';
    } else {
      exLaborBlocker.style.display = 'none';
    }
  }

  // Create action button state
  const createBtn = $('dq-action-create-btn');
  if (createBtn) {
    if (a006avail.blocked) {
      createBtn.disabled = true;
      createBtn.title = a006avail.primary_blocker || '7shifts required';
      createBtn.classList.add('btn-disabled');
    } else if (a006avail.needs_approval) {
      createBtn.disabled = false;
      createBtn.title = a006avail.approvers[0] || 'Requires approval';
      createBtn.classList.remove('btn-disabled');
    } else {
      createBtn.disabled = false;
      createBtn.title = '';
      createBtn.classList.remove('btn-disabled');
    }
  }

  // ─────────────────────────────────────────────────────────────
  //  6. PROOF / SCORECARD
  // ─────────────────────────────────────────────────────────────
  // Verification eligibility notes — SUPPRESSED on ROI Proof per product
  // decision: this page exists to surface what's verified, not enumerate DQ
  // failures. The same blockers remain visible on the Data Quality screen
  // and on the trust-layer banner on Today (#skc-tr-dq-banner). Build logic
  // retained because notes[] is read by other consumers downstream.
  const proofDQNote = $('dq-proof-note');
  if (proofDQNote) {
    const notes = [];
    if (!laborVE.eligible)  notes.push(`Labor: ${laborVE.primary_blocker}`);
    if (!salmonVE.eligible) notes.push(`Menu: ${salmonVE.primary_blocker}`);
    if (!tpVE.eligible)     notes.push(`Throughput: ${tpVE.primary_blocker}`);
    if (accounting.blocked) notes.push('Net margin unavailable — accounting not connected');
    // Render-suppression: always hide on ROI Proof. The data is still computed
    // for any downstream consumer that reads notes[].
    proofDQNote.style.display = 'none';
    proofDQNote.innerHTML = '';
  }

  // Verification eligibility badge
  const veElig = $('dq-ve-eligibility');
  if (veElig) {
    const elig = getVerificationEligibility('labor');
    if (elig.blocked) {
      veElig.innerHTML = `<span class="output-chip ot-unavail">Blocked — ${elig.primary_blocker}</span>`;
    } else if (elig.conditional) {
      veElig.innerHTML = `<span class="output-chip ot-act" title="ACT = Action recommended — confidence threshold met">Conditional — ${elig.primary_condition}</span>`;
    } else {
      veElig.innerHTML = `<span class="output-chip ot-ver" title="VER = Verified — monitoring window closed, all guardrails passed">Eligible for verification</span>`;
    }
  }

  // ROI labor / menu source badges in proof
  const prLaborSrc = $('dq-pr-labor-src');
  if (prLaborSrc) prLaborSrc.innerHTML = srcTag(shifts);
  const prCogsSrc = $('dq-pr-cogs-src');
  if (prCogsSrc) prCogsSrc.innerHTML = srcTag(menu);

  // Accounting note in proof — SUPPRESSED on ROI Proof per product decision.
  // Same caveat surfaces on Data Quality screen and Reports.
  const prAccounting = $('dq-proof-accounting');
  if (prAccounting) {
    prAccounting.style.display = 'none';
    prAccounting.innerHTML = '';
  }

  // ─────────────────────────────────────────────────────────────
  //  7. REPORTS
  // ─────────────────────────────────────────────────────────────
  // SUPPRESSED on Reports per product decision: this page is owner-ready
  // weekly summaries, not a DQ audit surface. Same caveats live on the
  // Data Quality screen and the trust-layer banner on Today. Build logic
  // retained for any downstream consumer.
  const reportsDQNote = $('dq-reports-note');
  if (reportsDQNote) {
    const notes = [];
    if (accounting.blocked) notes.push('Accounting not connected — net margin and prime cost excluded from this report.');
    if (shifts.stale)       notes.push(`7shifts stale ${shifts.last_synced} — labor costs are estimated, not confirmed.`);
    if (menu.stale)         notes.push(`Recipe cost file ${menu.last_synced} — item costs may have changed since last upload.`);
    reportsDQNote.style.display = 'none';
    reportsDQNote.innerHTML = '';
  }

  // ─────────────────────────────────────────────────────────────
  //  8. ASK SKC — warn banner
  // ─────────────────────────────────────────────────────────────
  const askWarn = $('dq-ask-labor-warn');
  if (askWarn) {
    if (shifts.stale) {
      askWarn.innerHTML = blockerBanner(
        `7shifts stale ${shifts.last_synced} — labor answers have reduced confidence (${laborDQ.confidence_score}%). Reconnect to restore full accuracy.`,
        "dqFix('shifts')", 'Reconnect'
      );
      askWarn.style.display = '';
    } else {
      askWarn.style.display = 'none';
    }
  }

  // Ask note general
  const askNote = $('dq-ask-note');
  if (askNote) {
    const issues = [shifts, kds, menu, reviews].filter(s => !s.healthy);
    if (issues.length) {
      askNote.textContent = `Data quality: ${issues.map(s => s.name + ' ' + s.status).join(' · ')}`;
      askNote.style.display = '';
    } else {
      askNote.style.display = 'none';
    }
  }

  // ─────────────────────────────────────────────────────────────
  //  9. COMMAND CENTER (Today / Dashboard)
  // ─────────────────────────────────────────────────────────────
  const cmdBanner = $('dq-cmd-banner');
  if (cmdBanner) {
    if (shifts.stale) {
      cmdBanner.innerHTML = blockerBanner(
        `7shifts stale ${shifts.last_synced} — labor confidence reduced to ${laborDQ.confidence_score}%. Today's top action needs approval before execution.`,
        "dqFix('shifts')", 'Reconnect 7shifts'
      );
      cmdBanner.style.display = '';
    } else {
      cmdBanner.style.display = 'none';
    }
  }

  // Command center labor source
  const cmdLaborSrc = $('dq-cmd-labor-src');
  if (cmdLaborSrc) cmdLaborSrc.innerHTML = srcTag(shifts);

  // Command center confidence badge
  const cmdConfBadge = $('dq-cmd-conf-badge') || document.querySelector('[data-dq-target="dq-cmd-conf-badge"]');
  if (cmdConfBadge) {
    const chip = confChip(laborDQ.confidence_score, shifts.healthy ? 'deterministic' : 'estimated');
    cmdConfBadge.outerHTML = `<span id="dq-cmd-conf-badge" class="output-chip ${shifts.healthy ? 'ot-det' : 'ot-est'}">${laborDQ.confidence_score}% · ${shifts.healthy ? 'DET' : 'EST' + (shifts.stale ? ' · stale' : '')}</span>`;
  }

  // ─────────────────────────────────────────────────────────────
  //  10. DATA QUALITY SCREEN — source cards
  // ─────────────────────────────────────────────────────────────
  // Update each source card status indicator
  [
    ['toast', toast], ['shifts', shifts], ['kds', kds],
    ['menu', menu], ['reviews', reviews], ['accounting', accounting]
  ].forEach(([id, health]) => {
    const statusEl = $('dq-src-status-' + id);
    if (statusEl) {
      statusEl.textContent = health.status.charAt(0).toUpperCase() + health.status.slice(1);
      statusEl.className = 'dq-src-status dq-src-status-' + health.status;
    }
    const syncEl = $('dq-src-sync-' + id);
    if (syncEl) syncEl.textContent = health.last_synced;
    const chipEl = $('dq-src-chip-' + id);
    if (chipEl) chipEl.innerHTML = health.output_chip;
  });

  // Global health score
  const healthEl = document.querySelector('[data-dq-completeness]');
  if (healthEl) healthEl.textContent = SKC_STATE.data_quality.global_health + '% complete';
}

// ── Backwards-compatible alias ────────────────────────────────
function applyGlobalDQ() { applyDataQualityToUI(); }



// ── dqFix: actually changes source state + propagates ────────
function dqFix(sourceId) {
  const src = DQ_STATE.sources[sourceId];
  if (!src) { showDemoToast('Unknown source: ' + sourceId, 'red'); return; }

  // For demo: toggle between stale and healthy
  if (src.status === 'stale' || src.status === 'missing' || src.status === 'degraded') {
    src.status = 'healthy';
    // Also update the DQ card class in the settings screen
    const labelMap = { shifts: 'dq7shifts', menu: 'dqMenu', kds: 'dqKDS', reviews: 'dqReviews' };
    const cardId = labelMap[sourceId];
    if (cardId) {
      const card = document.getElementById(cardId);
      if (card) { card.classList.remove('critical','warning','missing'); }
    }
    showDemoToast(`✓ ${src.label} reconnected — data now live · confidence restored`, 'green');
  } else {
    src.status = 'stale';
    showDemoToast(`${src.label} connection lost — data stale · confidence reduced`, 'amber');
  }

  applyGlobalDQ();
  // Re-run verification verdict since confidence changed
  applyVerification();
}

// run once on load
document.addEventListener('DOMContentLoaded', applyGlobalDQ);

function toggleVEP(toggleEl) {
  // Tabbed workspace: "View Evidence" navigates to the evidence tab
  switchTab('recovery', 'evidence');
}

let vepRendered = false;
function renderVEP() {
  if (vepRendered) return;
  vepRendered = true;
  renderBarChart();
  renderMatrix();
  renderLineChart();
  renderBaseline();
  renderGuardrails();
  renderFunnel();
  // Also render into History tab's funnel container
  const h = document.getElementById('vepFunnelHistory');
  if (h) { const f = document.getElementById('vepFunnel'); if (f) h.innerHTML = f.innerHTML; }
}

// ── 1. Bar chart ─────────────────────────────────────────
function renderBarChart() {
  const container = document.getElementById('vepBarChart');
  if (!container) return;
  const data = [
    { label: 'Tue–Wed Overstaffing',  val: 3200, conf: 78, color: 'var(--red)' },
    { label: 'Salmon Menu Pricing',   val: 2100, conf: 71, color: 'var(--amber)' },
    { label: 'Fri Lunch Ticket Time', val: 1540, conf: 64, color: 'var(--blue)' },
    { label: 'Bar Staff · Walnut Ck', val: 820,  conf: 91, color: 'var(--green)' },
  ];
  const max = 3200;
  container.innerHTML = data.map(d => {
    const pct = Math.round((d.val / max) * 100);
    return `<div class="vep-bar-row">
      <span class="vep-bar-label">${d.label}</span>
      <div class="vep-bar-track">
        <div class="vep-bar-fill" style="width:${pct}%;background:${d.color}">
          <span class="vep-bar-val">$${(d.val/1000).toFixed(d.val < 1000 ? 0 : 1)}k</span>
        </div>
      </div>
      <span class="vep-bar-conf">${d.conf}%</span>
    </div>`;
  }).join('');
}

// ── 2. Confidence vs Impact matrix ───────────────────────
function renderMatrix() {
  const svg = document.getElementById('vepMatrix');
  if (!svg) return;
  const W = 340, H = 200;
  const pad = { l: 36, r: 16, t: 14, b: 28 };
  const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
  const points = [
    { label: 'Overstaffing',  conf: 78, val: 3200, color: '#EF4444' },
    { label: 'Salmon Reprice',conf: 71, val: 2100, color: '#F59E0B' },
    { label: 'Ticket Time',   conf: 64, val: 1540, color: '#3B82F6' },
    { label: 'Bar Staff',     conf: 91, val: 820,  color: '#10B981' },
  ];
  const xMin = 0, xMax = 4000, yMin = 50, yMax = 100;
  const toX = v => pad.l + ((v - xMin) / (xMax - xMin)) * cw;
  const toY = v => pad.t + ch - ((v - yMin) / (yMax - yMin)) * ch;
  const rScale = v => Math.sqrt(v / 3200) * 22 + 8;
  let m = '';
  [60,70,80,90].forEach(y => {
    const cy = toY(y);
    m += `<line x1="${pad.l}" y1="${cy}" x2="${W-pad.r}" y2="${cy}" stroke="var(--border)" stroke-width="1"/>`;
    m += `<text x="${pad.l-4}" y="${cy+3.5}" text-anchor="end" font-size="9" fill="var(--t3)" font-family="'IBM Plex Mono',SFMono-Regular,Consolas,monospace">${y}%</text>`;
  });
  [1000,2000,3000].forEach(x => {
    const cx = toX(x);
    m += `<line x1="${cx}" y1="${pad.t}" x2="${cx}" y2="${H-pad.b}" stroke="var(--border)" stroke-width="1" stroke-dasharray="3,3"/>`;
    m += `<text x="${cx}" y="${H-pad.b+11}" text-anchor="middle" font-size="9" fill="var(--t3)" font-family="'IBM Plex Mono',SFMono-Regular,Consolas,monospace">$${x/1000}k</text>`;
  });
  const qx = toX(2000), qy = toY(75);
  m += `<line x1="${qx}" y1="${pad.t}" x2="${qx}" y2="${H-pad.b}" stroke="var(--border-s)" stroke-width="1" stroke-dasharray="4,4" opacity=".5"/>`;
  m += `<line x1="${pad.l}" y1="${qy}" x2="${W-pad.r}" y2="${qy}" stroke="var(--border-s)" stroke-width="1" stroke-dasharray="4,4" opacity=".5"/>`;
  m += `<line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${H-pad.b}" stroke="var(--border-s)" stroke-width="1"/>`;
  m += `<line x1="${pad.l}" y1="${H-pad.b}" x2="${W-pad.r}" y2="${H-pad.b}" stroke="var(--border-s)" stroke-width="1"/>`;
  m += `<text x="${pad.l+cw/2}" y="${H-2}" text-anchor="middle" font-size="9" fill="var(--t3)">Monthly Run-Rate Projection ($)</text>`;
  m += `<text x="9" y="${pad.t+ch/2}" text-anchor="middle" font-size="9" fill="var(--t3)" transform="rotate(-90,9,${pad.t+ch/2})">Confidence</text>`;
  m += `<text x="${W-pad.r-4}" y="${pad.t+11}" text-anchor="end" font-size="8.5" fill="var(--green)" opacity=".7">act first →</text>`;
  [...points].sort((a,b) => b.val - a.val).forEach(p => {
    const cx = toX(p.val), cy = toY(p.conf), r = rScale(p.val);
    m += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${p.color}" fill-opacity=".18" stroke="${p.color}" stroke-width="1.5"/>`;
    m += `<text x="${cx}" y="${cy+3.5}" text-anchor="middle" font-size="9.5" fill="${p.color}" font-weight="600" font-family="'IBM Plex Mono',SFMono-Regular,Consolas,monospace">${p.conf}%</text>`;
    const lx = cx > W*0.65 ? cx - r - 3 : cx + r + 3;
    const anchor = cx > W*0.65 ? 'end' : 'start';
    m += `<text x="${lx}" y="${cy-r-3}" text-anchor="${anchor}" font-size="8.5" fill="var(--t2)">${p.label}</text>`;
  });
  svg.innerHTML = m;
}

// ── 3. Line chart: RPLH 8-week trend ─────────────────────
function renderLineChart() {
  const svg = document.getElementById('vepLine');
  if (!svg) return;
  const W = 340, H = 180;
  const pad = { l: 42, r: 12, t: 14, b: 28 };
  const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
  const weeks   = ['Wk1','Wk2','Wk3','Wk4','Wk5','Wk6','Wk7','Now'];
  const baseline = 38.20;
  const actual   = [38.8,37.9,36.2,34.8,33.1,32.4,31.8,31.40];
  const yMin = 28, yMax = 42;
  const toX = i => pad.l + (i / (weeks.length-1)) * cw;
  const toY = v => pad.t + ch - ((v - yMin) / (yMax - yMin)) * ch;
  let m = '';
  [30,33,36,39,42].forEach(v => {
    const y = toY(v);
    m += `<line x1="${pad.l}" y1="${y}" x2="${W-pad.r}" y2="${y}" stroke="var(--border)" stroke-width="1"/>`;
    m += `<text x="${pad.l-4}" y="${y+3.5}" text-anchor="end" font-size="9" fill="var(--t3)" font-family="'IBM Plex Mono',SFMono-Regular,Consolas,monospace">$${v}</text>`;
  });
  const by = toY(baseline);
  m += `<line x1="${pad.l}" y1="${by}" x2="${W-pad.r}" y2="${by}" stroke="var(--green)" stroke-width="1.5" stroke-dasharray="5,3" opacity=".7"/>`;
  m += `<text x="${W-pad.r-2}" y="${by-4}" text-anchor="end" font-size="8.5" fill="var(--green)">Baseline $${baseline}</text>`;
  const areaPath = actual.map((v,i) => `${i===0?'M':'L'}${toX(i)},${toY(v)}`).join(' ');
  m += `<path d="${areaPath} L${toX(actual.length-1)},${H-pad.b} L${pad.l},${H-pad.b} Z" fill="var(--red)" fill-opacity=".07"/>`;
  const linePath = actual.map((v,i) => `${i===0?'M':'L'}${toX(i)},${toY(v)}`).join(' ');
  m += `<path d="${linePath}" fill="none" stroke="var(--red)" stroke-width="2" stroke-linejoin="round"/>`;
  const lx = toX(actual.length-1), ly = toY(actual[actual.length-1]);
  m += `<line x1="${lx}" y1="${ly}" x2="${lx}" y2="${by}" stroke="var(--red)" stroke-width="1" stroke-dasharray="3,2" opacity=".6"/>`;
  m += `<text x="${lx+5}" y="${(ly+by)/2+3}" font-size="9.5" fill="var(--red)" font-weight="600" font-family="'IBM Plex Mono',SFMono-Regular,Consolas,monospace">−$6.80</text>`;
  actual.forEach((v,i) => {
    const isLast = i === actual.length-1;
    m += `<circle cx="${toX(i)}" cy="${toY(v)}" r="${isLast?4:3}" fill="${isLast?'var(--red)':'var(--surface)'}" stroke="var(--red)" stroke-width="1.5"/>`;
  });
  weeks.forEach((w,i) => {
    m += `<text x="${toX(i)}" y="${H-pad.b+11}" text-anchor="middle" font-size="8.5" fill="var(--t3)">${w}</text>`;
  });
  m += `<rect x="${lx-26}" y="${ly-20}" width="52" height="16" rx="3" fill="var(--red)" fill-opacity=".9"/>`;
  m += `<text x="${lx}" y="${ly-9}" text-anchor="middle" font-size="9.5" fill="#fff" font-weight="600" font-family="'IBM Plex Mono',SFMono-Regular,Consolas,monospace" data-skc="rplh-current">$31.40</text>`;
  svg.innerHTML = m;
}

// ── 4. Baseline comparison ────────────────────────────────
function renderBaseline() {
  const svg = document.getElementById('vepBaseline');
  if (!svg) return;
  const W = 340, H = 190;
  const pad = { l: 72, r: 16, t: 10, b: 28 };
  const cw = W - pad.l - pad.r;
  const slots = [
    { label: '4–5 PM',  sched: 3, demand: 2 },
    { label: '5–6 PM',  sched: 5, demand: 3 },
    { label: '6–7 PM',  sched: 6, demand: 5 },
    { label: '7–8 PM',  sched: 6, demand: 5 },
    { label: '8–9 PM',  sched: 5, demand: 4 },
    { label: '9–10 PM', sched: 3, demand: 2 },
  ];
  const maxVal = 7;
  const barH = 18, gap = 7;
  const toW = v => (v / maxVal) * cw;
  let m = '';
  [2,4,6].forEach(v => {
    const x = pad.l + toW(v);
    m += `<line x1="${x}" y1="${pad.t}" x2="${x}" y2="${pad.t + slots.length*(barH*2+gap)}" stroke="var(--border)" stroke-width="1" stroke-dasharray="3,3"/>`;
    m += `<text x="${x}" y="${pad.t + slots.length*(barH*2+gap) + 11}" text-anchor="middle" font-size="9" fill="var(--t3)" font-family="'IBM Plex Mono',SFMono-Regular,Consolas,monospace">${v}h</text>`;
  });
  slots.forEach((s,i) => {
    const y0 = pad.t + i*(barH*2+gap);
    const dw = toW(s.demand), ew = toW(s.sched - s.demand), sw = toW(s.sched);
    m += `<text x="${pad.l-5}" y="${y0+barH-2}" text-anchor="end" font-size="10" fill="var(--t2)">${s.label}</text>`;
    m += `<rect x="${pad.l}" y="${y0}" width="${dw}" height="${barH}" rx="2" fill="var(--border-s)"/>`;
    if (s.sched > s.demand) {
      m += `<rect x="${pad.l+dw}" y="${y0}" width="${ew}" height="${barH}" rx="0" fill="var(--red)" opacity=".75"/>`;
    }
    m += `<text x="${pad.l+sw+4}" y="${y0+12}" font-size="9" fill="var(--t2)" font-family="'IBM Plex Mono',SFMono-Regular,Consolas,monospace">${s.sched}h ${s.sched>s.demand?`<tspan fill="#EF4444">+${s.sched-s.demand}</tspan>`:'✓'}</text>`;
    m += `<rect x="${pad.l}" y="${y0+barH+2}" width="${dw}" height="${barH-4}" rx="2" fill="var(--green)" opacity=".35"/>`;
    m += `<text x="${pad.l+dw+4}" y="${y0+barH+11}" font-size="9" fill="var(--t3)" font-family="'IBM Plex Mono',SFMono-Regular,Consolas,monospace">${s.demand}h needed</text>`;
  });
  const ly = pad.t + slots.length*(barH*2+gap) + 22;
  m += `<rect x="${pad.l}" y="${ly}" width="10" height="10" rx="2" fill="var(--red)" opacity=".75"/>`;
  m += `<text x="${pad.l+14}" y="${ly+8}" font-size="9" fill="var(--t2)">Excess scheduled</text>`;
  m += `<rect x="${pad.l+120}" y="${ly}" width="10" height="10" rx="2" fill="var(--green)" opacity=".4"/>`;
  m += `<text x="${pad.l+134}" y="${ly+8}" font-size="9" fill="var(--t2)">Demand-justified</text>`;
  svg.innerHTML = m;
}

// ── 5. Guardrail status cards ─────────────────────────────
function renderGuardrails() {
  const container = document.getElementById('vepGuardrails');
  if (!container) return;
  const metrics = [
    { name: 'Kitchen Ticket Time', val: '14.2 min', threshold: '≤ 16 min', status: 'pass' },
    { name: 'Average Check Value',  val: '$53.10',   threshold: '≥ $50.00', status: 'pass' },
    { name: 'Table Turn Time',      val: '48 min',   threshold: '≤ 52 min', status: 'watch' },
    { name: 'Guest Complaints',     val: '0 / week', threshold: '≤ 2 / wk', status: 'pass' },
  ];
  const icons  = { pass: '✓', watch: '~', fail: '✗' };
  const labels = { pass: 'Passing', watch: 'Watch',   fail: 'Failing' };
  container.innerHTML = metrics.map(m => `
    <div class="vep-gr-card ${m.status}">
      <div class="vep-gr-name">${m.name}</div>
      <div class="vep-gr-row">
        <span class="vep-gr-val ${m.status}">${m.val}</span>
        <span class="vep-gr-threshold">${m.threshold}</span>
      </div>
      <span class="vep-gr-status ${m.status}">${icons[m.status]} ${labels[m.status]}</span>
    </div>`).join('');
}

// ─── VERIFICATION ENGINE ─────────────────────────────────

// ── State ────────────────────────────────────────────────
// ─── VE — Verification Engine, reads from SKC_STATE ───────────────────────
const VE = {
  // metric definitions — thresholds come from SKC_STATE.guardrails
  get metrics() {
    const g = SKC_STATE.guardrails;
    const m = SKC_STATE.metrics;
    return [
      { id:'ticket',     name:'Kitchen Ticket Time', unit:'min', threshold:g.ticket_time.limit, op:'lte', passVal:m.ticket_time,   failVal:16.4 },
      { id:'avgcheck',   name:'Average Check Value',  unit:'$',   threshold:g.avg_check.limit,   op:'gte', passVal:m.avg_check,     failVal:m.avg_check },
      { id:'tableturn',  name:'Table Turn Time',      unit:'min', threshold:g.table_turns.limit, op:'lte', passVal:m.table_turns,   failVal:m.table_turns },
      { id:'complaints', name:'Guest Complaints',     unit:'/wk', threshold:g.complaints.limit,  op:'lte', passVal:m.complaints,    failVal:m.complaints },
    ];
  },
  // current — reads from SKC_STATE metrics (sim overrides those values directly)
  get current() {
    const m = SKC_STATE.metrics;
    return { ticket: m.ticket_time, avgcheck: m.avg_check, tableturn: m.table_turns, complaints: m.complaints };
  },
  statusOf(id) {
    const m = VE.metrics.find(x => x.id === id);
    const v = VE.current[id];
    const passes = m.op === 'lte' ? v <= m.threshold : v >= m.threshold;
    const watch  = m.op === 'lte' ? v > m.threshold * 0.9 && v <= m.threshold
                                  : v < m.threshold * 1.1 && v >= m.threshold;
    if (!passes) return 'fail';
    if (watch)   return 'watch';
    return 'pass';
  },
  verdict() { return SKC_STATE.guardrails.verdict(); },
};

// ── Simulation functions — mutate SKC_STATE.metrics, then render ─────────
function simPass() {
  Object.assign(SKC_STATE.metrics, { ticket_time:12.8, avg_check:54.20, table_turns:44, complaints:0 });
  if (typeof simulateState === 'function') simulateState(1, 'pass');
  applyVerification();
  SKC_STATE.render();
  showDemoToast('Simulation: All guardrails passing — eligible for verified win', 'green');
}
function simDegrade() {
  Object.assign(SKC_STATE.metrics, { ticket_time:16.4, avg_check:53.10, table_turns:48, complaints:0 });
  if (typeof simulateState === 'function') simulateState(1, 'degrade');
  applyVerification();
  SKC_STATE.render();
  showDemoToast('Simulation: Ticket time exceeded threshold — verified win blocked', 'red');
}

function simReset() {
  // Reset to canonical baseline values stored in SKC_STATE
  Object.assign(SKC_STATE.metrics, {
    ticket_time:  14.2,
    avg_check:    53.10,
    table_turns:  48,
    complaints:   0,
  });
  if (typeof simulateState === 'function') simulateState(1, 'reset');
  applyVerification();
  SKC_STATE.render();
  showDemoToast('Reset to live state — monitoring · table turns at Watch (48 min, limit 52 min)', 'blue');
}

// ── Core: apply verdict to all reactive UI ───────────────
function applyVerification() {
  const verdict = VE.verdict();
  updateGuardrailCards(verdict);
  updateVEPGuardrails(verdict);
  updateEvDrawerConf(verdict);
  updateROIStatus(verdict);
  updateLeakCardBadge(verdict);
  updateVerificationBanner(verdict);
  // Re-render canonical Proof summary panel
  const proofSummaryEl = document.getElementById('roi-summary-rendered');
  if (proofSummaryEl && typeof renderROISummary === 'function') {
    try { proofSummaryEl.innerHTML = renderROISummary(); } catch(e) {}
  }
  // Re-render verified wins tab
  const verifiedEl = document.getElementById('roi-verified-rendered');
  if (verifiedEl && typeof getVerifiedWins === 'function') {
    try { verifiedEl.innerHTML = getVerifiedWins().map(renderVerificationCard).join('') || '<div class="empty-state">No verified wins yet</div>'; } catch(e) {}
  }
  // Re-render active recovery tab
  const activeEl = document.getElementById('roi-active-rendered');
  if (activeEl && typeof getActiveRecoveries === 'function') {
    try { activeEl.innerHTML = getActiveRecoveries().map(renderVerificationCard).join('') || '<div class="empty-state">No active recovery</div>'; } catch(e) {}
  }
}

// ── Format metric display value ───────────────────────────
function fmtMetric(m) {
  const v = VE.current[m.id];
  if (m.id === 'avgcheck')   return '$' + v.toFixed(2);
  if (m.id === 'complaints') return v + ' / week';
  return v + ' min';
}

// ── 1. Guardrail mini-dashboard (VEP chart 5) ────────────
function updateVEPGuardrails(verdict) {
  const container = document.getElementById('vepGuardrails');
  if (!container) return;
  const icons  = { pass: '✓', watch: '~', fail: '✗' };
  const labels = { pass: 'Passing', watch: 'Watch', fail: 'Failing' };
  container.innerHTML = VE.metrics.map(m => {
    const st = VE.statusOf(m.id);
    return `
    <div class="vep-gr-card ${st}">
      <div class="vep-gr-name">${m.name}</div>
      <div class="vep-gr-row">
        <span class="vep-gr-val ${st}">${fmtMetric(m)}</span>
        <span class="vep-gr-threshold">${m.op === 'lte' ? '≤' : '≥'} ${m.threshold} ${m.unit}</span>
      </div>
      <span class="vep-gr-status ${st}">${icons[st]} ${labels[st]}</span>
    </div>`;
  }).join('');

  // update footer summary
  const footer = container.closest('.vep-chart-wrap')?.querySelector('.vep-chart-footer');
  if (footer) {
    const counts = { pass: 0, watch: 0, fail: 0 };
    VE.metrics.forEach(m => counts[VE.statusOf(m.id)]++);
    footer.querySelector('span:last-child').textContent =
      `${counts.pass} passing · ${counts.watch} watch · ${counts.fail} failing`;
  }
}

// ── 2. Evidence drawer confidence reason update ───────────
function updateEvDrawerConf(verdict) {
  // update ev-conf-fill for leak1 if currently open
  const fill = document.getElementById('evConfFill');
  const pct  = document.getElementById('evConfPct');
  if (!fill || !pct) return;
  if (verdict === 'blocked') {
    fill.style.background = 'var(--red)';
    fill.style.width = '45%';
    pct.textContent = '45%';
    pct.style.color = 'var(--red)';
  } else if (verdict === 'eligible') {
    fill.style.background = 'var(--green)';
    fill.style.width = '91%';
    pct.textContent = '91%';
    pct.style.color = 'var(--green)';
  } else {
    fill.style.background = 'var(--amber)';
    fill.style.width = '78%';
    pct.textContent = '78%';
    pct.style.color = 'var(--amber)';
  }
}

// ── 3. ROI scorecard status update ───────────────────────
function updateROIStatus(verdict) {
  const el = document.getElementById('roiVerificationStatus');
  const roiHero = document.getElementById('roiHeroStat');
  const arc = document.getElementById('activeRecoveryCard');

  // Amounts from canonical model
  const verified = SKC.fmt.dollar(SKC.opportunity.verified);              // $420/mo
  const verifiedSim = SKC.fmt.dollar(SKC.opportunity.verified_post_sim);  // $1,240/mo
  const active = SKC.fmt.dollar(SKC.opportunity.active_recovery);         // $4,120/mo
  const roiNow = SKC.opportunity.roi_current + '×';                        // 1.4×
  const roiSim = SKC.opportunity.roi_post_sim + '×';                       // 4.1×

  if (verdict === 'blocked') {
    if (el) el.innerHTML = `
      <div class="ve-blocked-banner" id="veBlockedBanner">
        <div class="ve-blocked-icon">⛔</div>
        <div class="ve-blocked-body">
          <div class="ve-blocked-title">Savings detected, but verified win blocked because service quality worsened.</div>
          <div class="ve-blocked-sub">Kitchen ticket time is <strong>${SKC.fmt.min(VE.current.ticket)}</strong> — above the ${SKC.fmt.min(VE.metrics.find(m=>m.id==='ticket').threshold)} guardrail threshold. The labor saving cannot be counted as verified ROI until ticket time returns below threshold for 2 consecutive Tuesday dinners.</div>
          <div class="ve-blocked-metrics">
            <span class="ve-blocked-chip fail">✗ Ticket Time ${SKC.fmt.min(VE.current.ticket)}</span>
            <span class="ve-blocked-chip pass">✓ Avg Check ${SKC.fmt.dollar(VE.current.avgcheck,false)}</span>
            <span class="ve-blocked-chip pass">✓ Table Turns ${SKC.fmt.min(VE.current.tableturn)}</span>
            <span class="ve-blocked-chip pass">✓ Complaints ${VE.current.complaints}</span>
          </div>
        </div>
      </div>`;
    if (arc) { arc.style.opacity = '.55'; arc.style.filter = 'saturate(.3)'; }
    if (roiHero) roiHero.innerHTML = `<div class="sh-stat-val" style="color:var(--red);font-size:20px">Blocked</div><div class="sh-stat-label">verified win</div>`;

  } else if (verdict === 'eligible') {
    if (el) el.innerHTML = `
      <div class="ve-eligible-banner">
        <div class="ve-eligible-icon">🎯</div>
        <div class="ve-eligible-body">
          <div class="ve-eligible-title">All guardrails passing — eligible for verified win</div>
          <div class="ve-eligible-sub">All 4 counter-metrics are within threshold. When monitoring window closes: ${verifiedSim} confirmed (${roiSim} ROI). Bar staffing $820/mo now verified + Risotto $420/mo = ${verifiedSim}.</div>
          <div class="ve-blocked-metrics">
            <span class="ve-blocked-chip pass">✓ Ticket Time ${SKC.fmt.min(VE.current.ticket)}</span>
            <span class="ve-blocked-chip pass">✓ Avg Check ${SKC.fmt.dollar(VE.current.avgcheck,false)}</span>
            <span class="ve-blocked-chip pass">✓ Table Turns ${SKC.fmt.min(VE.current.tableturn)}</span>
            <span class="ve-blocked-chip pass">✓ Complaints ${VE.current.complaints}</span>
          </div>
        </div>
      </div>`;
    if (arc) { arc.style.opacity = ''; arc.style.filter = ''; }
    // Post-sim state: bar staffing verified → $1,240/mo, 4.1×
    if (roiHero) roiHero.innerHTML = `<div class="sh-stat-val text-green">${roiSim}</div><div class="sh-stat-label">verified ROI</div>`;
    // Update verified savings display
    document.querySelectorAll('[data-skc="verified-savings"]').forEach(el => { el.textContent = verifiedSim.replace('/mo','') + '/mo'; });
    document.querySelectorAll('[data-skc="roi-current"]').forEach(el => { el.textContent = roiSim; });

  } else {
    // monitoring — default/reset state
    if (el) el.innerHTML = `
      <div class="ve-monitoring-banner">
        <div class="ve-monitoring-icon">◉</div>
        <div class="ve-monitoring-body">
          <div class="ve-monitoring-title">Monitoring required — Table Turn Time is at Watch</div>
          <div class="ve-monitoring-sub">${SKC.fmt.min(VE.current.tableturn)} is within the ≤ ${SKC.fmt.min(SKC.diag.table_turns_limit)} threshold but trending slower. Monitoring window continues. Current verified recovery: ${verified} (${roiNow} ROI). Bar staffing $820/mo approaching verification (Wk 3/4).</div>
          <div class="ve-blocked-metrics">
            <span class="ve-blocked-chip pass">✓ Ticket Time ${SKC.fmt.min(VE.current.ticket)}</span>
            <span class="ve-blocked-chip pass">✓ Avg Check ${SKC.fmt.dollar(VE.current.avgcheck,false)}</span>
            <span class="ve-blocked-chip watch">~ Table Turns ${SKC.fmt.min(VE.current.tableturn)}</span>
            <span class="ve-blocked-chip pass">✓ Complaints ${VE.current.complaints}</span>
          </div>
        </div>
      </div>`;
    if (arc) { arc.style.opacity = ''; arc.style.filter = ''; }
    // Reset to current verified state: only Risotto confirmed
    if (roiHero) roiHero.innerHTML = `<div class="sh-stat-val text-green">${roiNow}</div><div class="sh-stat-label">verified ROI · $420 confirmed</div>`;
    document.querySelectorAll('[data-skc="verified-savings"]').forEach(el => { el.textContent = verified.replace('/mo','') + '/mo'; });
    document.querySelectorAll('[data-skc="roi-current"]').forEach(el => { el.textContent = roiNow; });
  }
}

// ── 4. Leak card 1 confidence badge update ────────────────
function updateLeakCardBadge(verdict) {
  const badge = document.getElementById('leak1VerifyBadge');
  if (!badge) return;
  if (verdict === 'blocked') {
    badge.innerHTML = '<span class="badge red">BLOCKED</span>';
  } else if (verdict === 'eligible') {
    badge.innerHTML = '<span class="badge green">ELIGIBLE</span>';
  } else {
    badge.innerHTML = '<span class="badge amber">MONITORING</span>';
  }
}

// ── 5. Inline guardrail cards on the leak card body ───────
function updateGuardrailCards(verdict) {
  const container = document.getElementById('leak1GuardrailCards');
  if (!container) return;
  const icons  = { pass: '✓', watch: '~', fail: '✗' };
  const labels = { pass: 'Passing', watch: 'Watch', fail: 'Failing' };
  container.innerHTML = VE.metrics.map(m => {
    const st = VE.statusOf(m.id);
    return `<div class="lgr-card ${st}">
      <div class="lgr-name">${m.name}</div>
      <div class="lgr-val ${st}">${fmtMetric(m)}</div>
      <div class="lgr-threshold">${m.op === 'lte' ? '≤' : '≥'} ${m.threshold} ${m.unit}</div>
      <div class="lgr-status ${st}">${icons[st]} ${labels[st]}</div>
    </div>`;
  }).join('');
}

// ── 6. Page-top verification banner (on Profit Recovery) ──
function updateVerificationBanner(verdict) {
  const banner = document.getElementById('vePageBanner');
  if (!banner) return;
  const cfg = {
    eligible:   { cls: 'green', icon: '🎯', text: 'All guardrails passing — eligible for verified win on Tue–Wed overstaffing.' },
    monitoring: { cls: 'amber', icon: '◉',  text: 'Monitoring required — Table Turn Time is at Watch. Verified win pending.' },
    blocked:    { cls: 'red',   icon: '⛔', text: 'Verified win blocked — Kitchen Ticket Time exceeded threshold (16.4 min > 16 min limit). Savings detected but cannot count toward ROI.' },
  }[verdict];
  banner.className = `ve-page-banner ve-page-banner-${cfg.cls}`;
  banner.innerHTML = `<span class="ve-banner-icon">${cfg.icon}</span><span class="ve-banner-text">${cfg.text}</span>
    <span class="ve-banner-rule">${verdict === 'eligible' ? 'All counter-metrics pass' : verdict === 'monitoring' ? 'Watch state requires monitoring window' : 'Guardrail failure blocks ROI verification'}</span>`;
}

// ── Demo toast ─────────────────────────────────────────────
function showDemoToast(msg, color) {
  let t = document.getElementById('demoToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'demoToast';
    document.body.appendChild(t);
  }
  const colors = { green: 'var(--green)', red: 'var(--red)', blue: 'var(--blue)', amber: 'var(--amber)' };
  t.style.cssText = `position:fixed;bottom:88px;left:50%;transform:translateX(-50%);
    background:var(--card);border:1px solid ${colors[color]||'var(--border)'};
    border-left:3px solid ${colors[color]||'var(--border)'};
    color:var(--t1);padding:10px 18px;border-radius:var(--r-lg);font-size:12px;
    box-shadow:0 4px 24px rgba(0,0,0,.35);z-index:300;max-width:480px;text-align:center;
    white-space:nowrap;font-family:var(--sans);transition:opacity .3s;`;
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity = '0'; }, 3200);
}

// initialise on load
document.addEventListener('DOMContentLoaded', () => {
  if (typeof bindTopRecovery === 'function') bindTopRecovery();
  if (typeof applyVerification === 'function') applyVerification();
  // Render proof tabs if on scorecard screen
  if (typeof renderROISummary === 'function') {
    const summaryEl = document.getElementById('roi-summary-rendered');
    if (summaryEl) { try { summaryEl.innerHTML = renderROISummary(); } catch(e) {} }
  }
  if (typeof renderVerificationCard === 'function') {
    const verEl = document.getElementById('roi-verified-rendered');
    if (verEl) {
      try { verEl.innerHTML = (typeof getVerifiedWins === 'function' ? getVerifiedWins() : []).map(renderVerificationCard).join('') || '<div class="empty-state" style="padding:32px;text-align:center;color:var(--t3)">No verified wins yet</div>'; } catch(e) {}
    }
    const actEl = document.getElementById('roi-active-rendered');
    if (actEl) {
      try { actEl.innerHTML = (typeof getActiveRecoveries === 'function' ? getActiveRecoveries() : []).map(renderVerificationCard).join('') || '<div class="empty-state" style="padding:24px;text-align:center;color:var(--t3)">No active recovery</div>'; } catch(e) {}
    }
  }
});
function renderFunnel() {
  const svg = document.getElementById('vepFunnel');
  if (!svg) return;
  const W = 340, H = 200;
  // Values from canonical ROI_STATE — not hard-coded
  const openAmt    = typeof ROI_STATE !== 'undefined' ? formatCurrency(ROI_STATE.open_opportunity_value)      : '$6,840';
  const activeAmt  = typeof ROI_STATE !== 'undefined' ? formatCurrency(ROI_STATE.active_recovery_value + OPPORTUNITIES.labor.impact.location_monthly_impact) : '$4,120';
  const monitorAmt = typeof ROI_STATE !== 'undefined' ? formatCurrency(ROI_STATE.active_recovery_value)       : '$820';
  const verAmt     = typeof ROI_STATE !== 'undefined' ? formatCurrency(ROI_STATE.verified_monthly_savings)    : '$420';
  const openN      = typeof getOpenOpportunities !== 'undefined'   ? getOpenOpportunities().length   : 3;
  const activeN    = typeof getActiveRecoveries !== 'undefined'    ? getActiveRecoveries().length + 1 : 2; // +A006 proposed
  const monitorN   = typeof getActiveRecoveries !== 'undefined'    ? getActiveRecoveries().length    : 1;
  const verN       = typeof getVerifiedWins !== 'undefined'        ? getVerifiedWins().length         : 1;
  const stages = [
    { label: 'Detected',   n: openN + 1,   val: openAmt,    color: '#3B82F6', note: (openN + 1) + ' leaks identified' },
    { label: 'Actioned',   n: activeN,      val: activeAmt,  color: '#F59E0B', note: activeN + ' have open actions' },
    { label: 'Monitoring', n: monitorN,     val: monitorAmt, color: '#8B5CF6', note: monitorN + ' action in monitoring' },
    { label: 'Verified',   n: verN,         val: verAmt,     color: '#10B981', note: verN + ' verified · counted in ROI' },
  ];
  const widths = [280, 220, 160, 100];
  const barH = 34, gap = 6;
  const totalH = stages.length*(barH+gap)-gap;
  const padT = (H - totalH) / 2;
  const cx = W / 2;
  let m = '';
  stages.forEach((s,i) => {
    const y = padT + i*(barH+gap);
    const hw = widths[i]/2;
    const nhw = widths[i+1] ? widths[i+1]/2 : hw;
    m += `<path d="M${cx-hw},${y} L${cx+hw},${y} L${cx+nhw},${y+barH} L${cx-nhw},${y+barH} Z" fill="${s.color}" fill-opacity="${0.15+i*0.04}"/>`;
    m += `<path d="M${cx-hw},${y} L${cx+hw},${y} L${cx+nhw},${y+barH} L${cx-nhw},${y+barH} Z" fill="none" stroke="${s.color}" stroke-width="1.5" opacity=".55"/>`;
    m += `<text x="${cx-hw-8}" y="${y+barH/2+4}" text-anchor="end" font-size="11" font-weight="600" fill="${s.color}">${s.label}</text>`;
    m += `<rect x="${cx-14}" y="${y+8}" width="28" height="18" rx="9" fill="${s.color}" fill-opacity=".2" stroke="${s.color}" stroke-width="1" opacity=".8"/>`;
    m += `<text x="${cx}" y="${y+20}" text-anchor="middle" font-size="10" font-weight="700" fill="${s.color}" font-family="'IBM Plex Mono',SFMono-Regular,Consolas,monospace">${s.n}</text>`;
    m += `<text x="${cx+hw+8}" y="${y+barH/2-1}" text-anchor="start" font-size="10.5" font-weight="600" fill="var(--t1)" font-family="'IBM Plex Mono',SFMono-Regular,Consolas,monospace">${s.val}</text>`;
    m += `<text x="${cx+hw+8}" y="${y+barH/2+11}" text-anchor="start" font-size="9" fill="var(--t3)">${s.note}</text>`;
    if (i < stages.length-1) {
      m += `<text x="${cx}" y="${y+barH+gap/2+3}" text-anchor="middle" font-size="8" fill="var(--t3)" opacity=".5">▾</text>`;
    }
  });
  svg.innerHTML = m;
}

function toggleKanbanView() {
  const btn = document.getElementById('kanbanToggleBtn');
  const queuePanel = document.querySelector('[data-tab="execution-queue"]');
  const kanbanSection = document.getElementById('kanbanBoardSection');
  if (!kanbanSection) return;
  const isKanban = kanbanSection.style.display !== 'none';
  if (isKanban) {
    kanbanSection.style.display = 'none';
    if (queuePanel) queuePanel.style.display = '';
    if (btn) btn.textContent = '⊞ Board view';
  } else {
    kanbanSection.style.display = '';
    if (queuePanel) queuePanel.style.display = 'none';
    if (btn) btn.textContent = '☰ List view';
  }
}

// ═══════════════════════════════════════════════════════════════════════
// SKC ANALYTICS ENGINE
// Central source of truth for all trigger logic, confidence math,
// guardrail evaluation, action eligibility, and ROI eligibility.
// All recommendation cards, evidence drawers, Ask SKC answers, and
// demo steps reference this single object — no scattered logic.
// ═══════════════════════════════════════════════════════════════════════

const SKCAnalyticsEngine = {

  // ── 1. Global source status — one truth everywhere ──────────────────
  sources: {
    toast:      { status: 'healthy',     lastSync: '4m ago',  confidence: 0,   actionAllowed: true,  roiAllowed: true,  label: 'Toast POS · 4m · DET' },
    shifts:     { status: 'stale',       lastSync: '18h ago', confidence: -7,  actionAllowed: true,  roiAllowed: false, label: '7shifts · stale 18h · −7 pts', approvalRequired: 'GM approval required' },
    kds:        { status: 'partial',     lastSync: '6m ago',  confidence: -14, actionAllowed: true,  roiAllowed: false, label: 'KDS · partial · 6m ago', observationRequired: true },
    recipe:     { status: 'stale',       lastSync: '18d ago', confidence: -18, actionAllowed: false, roiAllowed: false, label: 'Recipe Cost · stale 18d · −18 pts', ownerApprovalRequired: true },
    reviews:    { status: 'healthy',     lastSync: '1h ago',  confidence: 0,   actionAllowed: true,  roiAllowed: true,  label: 'Google Reviews · 1h ago · DET' },
    accounting: { status: 'missing',     lastSync: 'never',   confidence: -100,actionAllowed: false, roiAllowed: false, label: 'Accounting · not connected' },
    inventory:  { status: 'missing',     lastSync: 'never',   confidence: -20, actionAllowed: false, roiAllowed: false, label: 'Inventory · not connected' },
  },

  // ── 2. Trigger rules ─────────────────────────────────────────────────
  triggerRules: {
    labor_recovery: {
      metric:           'RPLH',
      triggerCondition: 'below normal range for 3+ comparable services',
      escalateAt:       '6 of last 6 comparable services',
      minSampleSize:    4,
      anomalyExclusions:['holiday', 'private event', 'abnormal cover swing', 'weather event', 'known promotion'],
      sourceDeps:       ['toast', 'shifts'],
    },
    menu_margin: {
      metric:           'contribution_margin',
      triggerCondition: 'high-volume item CM below category expected range',
      roiBlockCondition:'recipe cost stale — margin verification blocked',
      sourceDeps:       ['toast', 'recipe'],
    },
    throughput: {
      metric:           'ticket_time',
      triggerCondition: 'ticket time above daypart normal range for 3+ comparable services',
      kdsLimitation:    'station root cause unavailable without full KDS',
      sourceDeps:       ['toast', 'kds'],
    },
    data_quality: {
      triggerCondition: 'source stale beyond threshold',
      effect:           'confidence reduced, verification limited or blocked',
    },
  },

  // ── 3. Demo recommendation objects ──────────────────────────────────
  recommendations: {
    labor: {
      id: 'labor_recovery_oakland',
      type: 'labor_recovery',
      severity: 'high',
      headline: 'Remove one 5–10 PM server · Oakland + Berkeley Tue/Wed dinner',
      currentRPLH: 31.40,
      normalRangeLow: 35.80,
      normalRangeHigh: 40.60,
      baseline: 38.20,
      patternCount: 6,
      patternOf: 6,
      sampleSize: 8,
      anomaliesExcluded: 2,
      estimatedWeeklyValue: 368,
      estimatedMonthlyRunRate: 3200,
      sourceDeps: ['toast', 'shifts'],
      outputType: 'ESTIMATED',
    },
    menu: {
      id: 'salmon_margin_gap',
      type: 'menu_margin',
      severity: 'medium',
      headline: 'Reprice Grilled Salmon $24 → $27',
      currentCM: 38.2,
      targetCMMin: 55,
      targetCMMax: 62,
      estimatedWeeklyValue: 519,
      estimatedMonthlyRunRate: 2100,
      sourceDeps: ['toast', 'recipe'],
      outputType: 'ESTIMATED',
      ownerApprovalRequired: true,
    },
    throughput: {
      id: 'berkeley_fri_lunch_ticket',
      type: 'throughput',
      severity: 'medium',
      headline: '15-min kitchen line review · Berkeley Friday lunch',
      currentTicketTime: 14.2,
      normalRangeLow: 11.0,
      normalRangeHigh: 13.0,
      patternCount: 5,
      patternOf: 5,
      estimatedWeeklyValue: 356,
      estimatedMonthlyRunRate: 1540,
      sourceDeps: ['toast', 'kds'],
      outputType: 'ESTIMATED',
      observationRequired: true,
    },
  },

  // ── 4. Evaluate confidence ───────────────────────────────────────────
  evaluateConfidence(recId) {
    const rec = this.recommendations[recId];
    if (!rec) return { score: 0, breakdown: 'Unknown recommendation' };
    let base = 85;
    const factors = [];
    for (const dep of rec.sourceDeps) {
      const src = this.sources[dep];
      if (!src) continue;
      if (src.confidence < 0) {
        base += src.confidence;
        factors.push(`${src.label}: ${src.confidence} pts`);
      }
    }
    if (rec.type === 'throughput') {
      base = Math.max(base, 56);
    }
    return {
      score: Math.max(0, Math.min(100, base)),
      breakdown: `85% base ${factors.map(f => `− ${f.split(': ')[1]}`).join(' ')}`,
      factors,
    };
  },

  // ── 5. Evaluate trigger ──────────────────────────────────────────────
  evaluateTrigger(recId) {
    const rec = this.recommendations[recId];
    if (!rec) return { active: false };
    const rule = this.triggerRules[rec.type];
    return {
      active: true,
      rule: rule ? rule.triggerCondition : 'threshold exceeded',
      severity: rec.severity,
      metric: rule ? rule.metric : rec.type,
      patternSummary: rec.patternCount ? `${rec.patternCount} of last ${rec.patternOf} comparable services` : null,
      samplePassed: rec.sampleSize ? rec.sampleSize >= (rule?.minSampleSize || 4) : true,
      anomaliesExcluded: rec.anomaliesExcluded || 0,
    };
  },

  // ── 6. Evaluate action eligibility ───────────────────────────────────
  evaluateActionEligibility(recId) {
    const rec = this.recommendations[recId];
    if (!rec) return { eligible: false, reason: 'Unknown' };
    if (rec.ownerApprovalRequired) return { eligible: true, reason: 'Owner approval required', badge: 'Owner Approval Required' };
    if (rec.observationRequired)   return { eligible: true, reason: 'Observation required before automated recommendation', badge: 'Observation Required' };
    for (const dep of rec.sourceDeps) {
      const src = this.sources[dep];
      if (src && src.approvalRequired) return { eligible: true, reason: src.approvalRequired, badge: 'GM Approval Required' };
    }
    return { eligible: true, reason: 'Action allowed', badge: 'Action Allowed' };
  },

  // ── 7. Evaluate ROI eligibility ──────────────────────────────────────
  evaluateROIEligibility(recId) {
    const rec = this.recommendations[recId];
    if (!rec) return { eligible: false, reason: 'Unknown' };
    for (const dep of rec.sourceDeps) {
      const src = this.sources[dep];
      if (src && !src.roiAllowed) {
        return {
          eligible: false,
          status: 'verification_limited',
          reason: `${src.label} — verification limited until source refreshes`,
          badge: 'ROI Verification Limited',
        };
      }
    }
    return { eligible: true, status: 'monitoring_eligible', reason: 'All sources eligible for verification', badge: 'ROI Eligible' };
  },

  // ── 8. Compute priority score ─────────────────────────────────────────
  computePriorityScore(recId) {
    const rec = this.recommendations[recId];
    if (!rec) return 0;
    const conf = this.evaluateConfidence(recId).score;
    const valueScore = Math.min(40, (rec.estimatedWeeklyValue / 500) * 40);
    const severityScore = { high: 25, medium: 15, low: 5 }[rec.severity] || 10;
    const patternScore = rec.patternCount ? Math.min(15, (rec.patternCount / rec.patternOf) * 15) : 5;
    const confScore = (conf / 100) * 10;
    const urgencyScore = rec.type === 'labor_recovery' ? 8 : 3;
    const penalty = rec.ownerApprovalRequired ? -5 : rec.observationRequired ? -3 : 0;
    return Math.round(valueScore + severityScore + patternScore + confScore + urgencyScore + penalty);
  },

  // ── 9. Explain trigger for Ask SKC ───────────────────────────────────
  explainTrigger(recId) {
    const rec = this.recommendations[recId];
    if (!rec) return null;
    const trigger = this.evaluateTrigger(recId);
    const conf = this.evaluateConfidence(recId);
    const action = this.evaluateActionEligibility(recId);
    const roi = this.evaluateROIEligibility(recId);
    const score = this.computePriorityScore(recId);

    const explanations = {
      labor_recovery: {
        answer: `This triggered because Tuesday dinner RPLH fell outside the normal range ($${rec.normalRangeLow}–$${rec.normalRangeHigh}/hr) for ${rec.patternCount} consecutive comparable services. Current: $${rec.currentRPLH}/hr. Baseline: $${rec.baseline}/hr.`,
        triggerRule: `SKC triggers labor recovery when RPLH is below the daypart normal range for 3+ comparable services. This passed the trigger threshold (${rec.patternCount}/${rec.patternOf}).`,
        evidence: `Toast shows stable sales and cover count. 7shifts shows scheduled labor remained above demand-justified levels. ${rec.anomaliesExcluded} anomaly weeks excluded from baseline.`,
        formula: `RPLH = Net Revenue ÷ Labor Hours. Formula source: SKC KPI Registry v0.3. Dollar impact = (baseline RPLH − actual RPLH) × actual hours × services per week.`,
        nextStep: `Assign Sarah C. to remove one 5–10 PM server before 3 PM and monitor tonight's guardrails.`,
      },
      menu_margin: {
        answer: `This triggered because Grilled Salmon's contribution margin (${rec.currentCM}%) is ${rec.targetCMMin - rec.currentCM} points below the category minimum (${rec.targetCMMin}%). At ${rec.estimatedWeeklyValue} covers/week the gap is $519/week.`,
        triggerRule: `SKC triggers menu margin recovery when a high-volume item's CM falls below the category expected range. This item passed the volume threshold.`,
        evidence: `Toast shows 94 covers/week. Recipe cost file is stale 18 days — CM value is estimated. Action requires owner approval.`,
        formula: `CM % = (Price − Food Cost) ÷ Price × 100. Weighted gap = CM gap × covers/week. Formula source: SKC KPI Registry v0.3.`,
        nextStep: `Send for owner approval before recipe cost is refreshed. ROI verification is blocked until cost file is updated.`,
      },
      throughput: {
        answer: `This triggered because Berkeley Friday lunch ticket time (${rec.currentTicketTime} min) exceeded the daypart normal range (${rec.normalRangeLow}–${rec.normalRangeHigh} min) for ${rec.patternCount} consecutive comparable services.`,
        triggerRule: `SKC triggers throughput recovery when ticket time exceeds the daypart normal range for 3+ comparable services. KDS station data is partial — root cause requires observation.`,
        evidence: `Toast shows stable cover count (96–102). KDS confirms aggregate ticket time. Station-level breakdown unavailable.`,
        formula: `Missed covers = excess minutes ÷ baseline dining duration × seating capacity. Dollar impact = missed covers × avg check. Formula source: SKC KPI Registry v0.3.`,
        nextStep: `Assign Jamie L. to conduct a 15-minute line observation before Friday service to identify the bottleneck station.`,
      },
    };

    const ex = explanations[rec.type] || { answer: 'Pattern detected above normal range.', triggerRule: '', evidence: '', formula: '', nextStep: '' };

    return {
      recId,
      priorityScore: score,
      ...ex,
      confidence: `${conf.score}% = ${conf.breakdown}`,
      actionEligibility: action.reason,
      roiEligibility: roi.reason,
    };
  },

  // ── 10. Guardrail definitions ─────────────────────────────────────────
  guardrails: {
    labor: [
      { metric: 'Kitchen ticket time', current: 14.2, threshold: 16, unit: 'min', op: 'lte', status: 'pass', roiEffect: 'eligible' },
      { metric: 'Average check',       current: 53.10,threshold: 50, unit: '$',   op: 'gte', status: 'pass', roiEffect: 'eligible' },
      { metric: 'Table turn time',     current: 48,   threshold: 52, unit: 'min', op: 'lte', status: 'watch', roiEffect: 'monitor closely — 4 min from threshold' },
      { metric: 'Guest complaints',    current: 0,    threshold: 2,  unit: '/wk', op: 'lte', status: 'pass', roiEffect: 'eligible' },
    ],
  },

  // ── 11. Evaluate guardrails ──────────────────────────────────────────
  evaluateGuardrails(recType) {
    const guards = this.guardrails[recType];
    if (!guards) return { verdict: 'unavailable', guards: [] };
    const results = guards.map(g => {
      const passes = g.op === 'lte' ? g.current <= g.threshold : g.current >= g.threshold;
      const watch  = g.op === 'lte'
        ? (g.current > g.threshold * 0.9 && g.current <= g.threshold)
        : (g.current < g.threshold * 1.1 && g.current >= g.threshold);
      return { ...g, status: !passes ? 'fail' : watch ? 'watch' : 'pass' };
    });
    const anyFail  = results.some(r => r.status === 'fail');
    const anyWatch = results.some(r => r.status === 'watch');
    return {
      verdict: anyFail ? 'rejected' : anyWatch ? 'monitoring' : 'eligible',
      guards: results,
    };
  },

  // ── 12. Severity label helper ─────────────────────────────────────────
  severityLabel(recId) {
    const rec = this.recommendations[recId];
    if (!rec) return { severity: 'low', reason: '', escalation: '' };
    const map = {
      high:   { reason: `Repeated pattern across ${rec.patternCount || 'multiple'} comparable services with $${rec.estimatedWeeklyValue}/wk estimated exposure.`, escalation: 'Escalates to Critical if pattern repeats or exposure exceeds $500/wk.' },
      medium: { reason: 'Meaningful pattern with actionable fix. Not time-sensitive within today.', escalation: '' },
      low:    { reason: 'Pattern present but value small or confidence low.', escalation: '' },
    };
    return { severity: rec.severity, ...map[rec.severity] };
  },

  // ── 13. Data Quality trigger impact ──────────────────────────────────
  dataQualityTriggerImpact() {
    return [
      {
        source: '7shifts stale 18h',
        affectedTriggers: [
          { trigger: 'Labor Recovery', impact: 'confidence reduced 85%→78%' },
          { trigger: 'Labor ROI Verification', impact: 'limited until reconnected' },
        ],
      },
      {
        source: 'Recipe Cost stale 18d',
        affectedTriggers: [
          { trigger: 'Menu Trigger', impact: 'estimated only — owner approval required' },
          { trigger: 'Menu ROI Verification', impact: 'blocked until cost refresh' },
        ],
      },
      {
        source: 'KDS partial',
        affectedTriggers: [
          { trigger: 'Throughput Trigger', impact: 'observation required — station root cause unavailable' },
          { trigger: 'Throughput ROI Verification', impact: 'conditional' },
        ],
      },
    ];
  },
};

// ═══════════════════════════════════════════════════════════════════════
// SKC DEMO CONTROLLER
// Central controller for the client-facing demo.
// Wraps tourStart/tourStep/tourExit but adds:
// - mode separation (client vs qa)
// - coherent state transitions
// - product-language toast messages
// - reset that starts on Today
// ═══════════════════════════════════════════════════════════════════════

const SKCDemoController = {
  mode: 'client',  // 'client' | 'qa'
  currentStep: 0,

  start() {
    this.currentStep = 0;
    this.syncStateToUI('reset');
    tourStart();
  },

  next() {
    tourStep(1);
    this.currentStep++;
  },

  back() {
    tourStep(-1);
    this.currentStep = Math.max(0, this.currentStep - 1);
  },

  exit() {
    tourExit();
    this.syncStateToUI('reset');
  },

  reset() {
    // Close all overlays
    closeCA();
    closeEvDrawer();
    closeDrawer();
    const orOv = document.getElementById('orOverlay');
    if (orOv) orOv.style.display = 'none';
    const askPnl = document.getElementById('askPanel');
    if (askPnl) askPnl.classList.remove('open');

    // Reset action state
    Object.keys(CA_STATE).forEach(k => delete CA_STATE[k]);
    document.querySelectorAll('[id^="ca-card-"]').forEach(el => el.remove());
    simReset();
    tlOwnerReportLogged = false;
    if (typeof tlRender === 'function') tlRender();
    vepRendered = false;

    // Navigate to Today
    showScreen('home', null, 'Today');
    showDemoToast('Demo reset \u2014 back to Today', 'blue');
  },

  syncStateToUI(state) {
    if (state === 'reset') {
      this.reset();
    } else if (state === 'assigned') {
      tourSeedState();
      showDemoToast('Recovery action assigned \u00b7 Sarah C. \u00b7 Due before 3 PM', 'green');
    } else if (state === 'monitoring') {
      tourSeedState();
      if (CA_STATE['leak1']) advanceAction('leak1', 'monitoring');
      showDemoToast('Monitoring started \u2014 guardrails active tonight', 'blue');
    } else if (state === 'verified') {
      simPass();
      showDemoToast('Guardrails passed \u00b7 value eligible for Verified Savings', 'green');
    } else if (state === 'rejected') {
      simDegrade();
      showDemoToast('Guardrail failed \u00b7 value rejected and not counted in ROI', 'red');
    }
  },

  // Wire Ask SKC chips to the analytics engine
  explainForAskSKC(recId) {
    const explanation = SKCAnalyticsEngine.explainTrigger(recId);
    if (!explanation) return null;
    return explanation;
  },
};

// ── Upgrade Ask SKC chips with analytics-engine-powered answers ───────
// Called when user clicks a chip or types a question
function askPanelQWithEngine(question) {
  // Map common questions to analytics engine explanations
  const triggerQuestions = [
    'why did this trigger',
    'why is this ranked',
    'why triggered',
    'what changed',
    'why #1',
  ];
  const lower = question.toLowerCase();
  const isTriggerQ = triggerQuestions.some(q => lower.includes(q));

  if (isTriggerQ) {
    const ex = SKCDemoController.explainForAskSKC('labor');
    if (ex) {
      const msg = [
        `<strong>Answer:</strong> ${ex.answer}`,
        `<br><br><strong>Trigger Rule:</strong> ${ex.triggerRule}`,
        `<br><br><strong>Evidence:</strong> ${ex.evidence}`,
        `<br><br><strong>Formula:</strong> ${ex.formula}`,
        `<br><br><strong>Confidence:</strong> ${ex.confidence}`,
        `<br><br><strong>Action Eligibility:</strong> ${ex.actionEligibility}`,
        `<br><br><strong>ROI Eligibility:</strong> ${ex.roiEligibility}`,
        `<br><br><strong>Next Step:</strong> ${ex.nextStep}`,
        `<br><br><em style="color:var(--t3);font-size:11px">Priority Score: ${ex.priorityScore}/100 · SKC Analytics Engine · Pattern analysis only — not a diagnosis</em>`,
      ].join('');
      return msg;
    }
  }
  return null; // fall through to existing askPanelQ logic
}

// Patch askPanelQ to check engine first
(function patchAskPanelQ() {
  const original = window.askPanelQ;
  if (typeof original !== 'function') return;
  window.askPanelQ = function(q) {
    const engineAnswer = askPanelQWithEngine(q);
    if (engineAnswer) {
      // Inject engine answer into the chat thread as an SKC message
      const hist = document.getElementById('chatHist');
      if (hist) {
        const ts = new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
        const userMsg = `<div class="ask-msg user-msg"><div class="ask-msg-header"><div class="ask-msg-ava user">SC</div><span class="ask-msg-sender">You</span><span class="ask-msg-time">${ts}</span></div><div class="ask-msg-body"><p>${q}</p></div></div>`;
        const skcMsg = `<div class="ask-msg skc-msg"><div class="ask-msg-header"><div class="ask-msg-ava skc">S</div><span class="ask-msg-sender">SKC</span><span class="ask-msg-time">${ts}</span></div><div class="ask-msg-body"><p>${engineAnswer}</p></div></div>`;
        hist.insertAdjacentHTML('beforeend', userMsg + skcMsg);
        hist.scrollTop = hist.scrollHeight;
        // Open the panel if not open
        const pnl = document.getElementById('askPanel');
        if (pnl && !pnl.classList.contains('open')) {
          if (typeof toggleAskPanel === 'function') toggleAskPanel();
        }
        return;
      }
    }
    original(q);
  };
})();

// ── Wire the topbar Tour button to SKCDemoController ──────────────────
(function patchTourStart() {
  // The ▶ Tour button calls tourStart() directly — patch it to go through controller
  const orig = window.tourStart;
  window.tourStart = function() {
    SKCDemoController.currentStep = 0;
    if (typeof orig === 'function') orig();
  };
})();

// ── Add Ctrl+Shift+R as client-safe demo reset ────────────────────────
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.shiftKey && e.key === 'R') {
    e.preventDefault();
    SKCDemoController.reset();
  }
});


// ─── LABOR EFFICIENCY — interactive logic ────────────────
// Drawers, heatmap rendering, shift row toggle, action toast.
// All functions namespaced with le* or specific names; no globals collided.

function openStaffingPlan(shiftId) {
  // shiftId param reserved for future shift-specific content; default content shown for demo
  document.getElementById('leStaffingPlanOverlay').classList.add('le-drawer-open');
  document.getElementById('leStaffingPlanDrawer').classList.add('le-drawer-open');
}

function openLaborEvidence(shiftId) {
  document.getElementById('leEvidenceOverlay').classList.add('le-drawer-open');
  document.getElementById('leEvidenceDrawer').classList.add('le-drawer-open');
}

function closeLeDrawer(which) {
  const overlayId = which === 'staffing' ? 'leStaffingPlanOverlay' : 'leEvidenceOverlay';
  const drawerId  = which === 'staffing' ? 'leStaffingPlanDrawer'  : 'leEvidenceDrawer';
  document.getElementById(overlayId).classList.remove('le-drawer-open');
  document.getElementById(drawerId).classList.remove('le-drawer-open');
}

function leCreateAction(label) {
  // Reuse the existing showDemoToast utility for consistency
  const msg = 'Action drafted · ' + label + ' labor adjustment · Ready in Actions';
  if (typeof showDemoToast === 'function') {
    showDemoToast(msg, 'green');
  }
  // Offer a delayed nudge to open Actions
  setTimeout(function() {
    if (typeof showDemoToast === 'function') {
      showDemoToast('Tap Actions in the sidebar to review the draft', 'blue');
    }
  }, 2200);
}

function toggleShiftRow(id) {
  const expanded = document.getElementById('exp-' + id);
  const chevron  = document.getElementById('chev-' + id);
  if (!expanded) return;
  const row = expanded.closest('.le-shift-row');
  const isOpen = expanded.style.display === 'block';
  expanded.style.display = isOpen ? 'none' : 'block';
  if (row) row.classList.toggle('le-sr-open', !isOpen);
  if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
}

// ── Heatmap data: 7 days x 12 hours (10AM–9PM) ──────────
// Cell values are productivity score (RPLH / baseline × 100)
// null = N/A (zero revenue / excluded), used for closed hours
const LE_HEATMAP_DATA = {
  Mon: [null, 92, 96, 94, 88, null, null, 91, 93, 90, 86, 82],
  Tue: [null, 78, 78, 87, 76, null, null, 89, 88, 84, 82, 78],   // <- Tuesday lunch underperformance
  Wed: [null, 86, 92, 90, 88, null, null, 92, 94, 91, 87, 84],
  Thu: [null, 88, 91, 89, 85, null, null, 90, 93, 92, 88, 85],
  Fri: [null, 81, 84, 87, 79, null, null, 88, 92, 90, 86, 83],   // <- some watch zones
  Sat: [null, 92, 95, 96, 94, null, null, 94, 96, 95, 92, 89],
  Sun: [null, 90, 93, 91, 87, null, null, 88, 90, 87, 84, 81],
};
const LE_HOURS = ['10A','11A','12P','1P','2P','3P','4P','5P','6P','7P','8P','9P'];
const LE_HOUR_LABELS = ['10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM','6 PM','7 PM','8 PM','9 PM'];
// Per-cell detailed data keyed as 'Day:hourIdx'
// Each entry: { rev, hrs, baseline_rplh, rec }
const LE_CELL_DATA = {
  'Tue:1': { rev: 284, hrs: 5.0, base: 36.20 },
  'Tue:2': { rev: 612, hrs: 6.5, base: 40.50 },
  'Tue:3': { rev: 498, hrs: 6.0, base: 38.10 },
  'Tue:4': { rev: 184, hrs: 3.5, base: 34.50 },
  'Tue:5': { rev: null, hrs: null, base: null },  // 3PM pre-dinner excluded
  'Tue:6': { rev: null, hrs: null, base: null },  // 4PM pre-dinner excluded
  'Tue:7': { rev: 620, hrs: 5.5, base: 42.10 },
  'Tue:8': { rev: 890, hrs: 7.0, base: 42.40 },
  'Tue:9': { rev: 780, hrs: 6.5, base: 38.20 },
  'Tue:10': { rev: 540, hrs: 5.0, base: 36.10 },
  'Tue:11': { rev: 310, hrs: 4.0, base: 31.40 },
  'Mon:1': { rev: 310, hrs: 4.2, base: 36.10 }, 'Mon:2': { rev: 580, hrs: 5.8, base: 38.90 },
  'Mon:3': { rev: 440, hrs: 5.0, base: 38.10 }, 'Mon:4': { rev: 210, hrs: 3.6, base: 34.20 },
  'Mon:7': { rev: 580, hrs: 4.8, base: 41.80 }, 'Mon:8': { rev: 820, hrs: 6.2, base: 41.90 },
  'Mon:9': { rev: 710, hrs: 6.0, base: 37.90 }, 'Mon:10': { rev: 490, hrs: 4.8, base: 35.60 },
  'Mon:11': { rev: 280, hrs: 3.8, base: 29.80 },
  'Wed:1': { rev: 320, hrs: 4.3, base: 36.40 }, 'Wed:2': { rev: 620, hrs: 6.1, base: 40.20 },
  'Wed:3': { rev: 500, hrs: 5.5, base: 38.50 }, 'Wed:4': { rev: 220, hrs: 3.5, base: 34.20 },
  'Wed:7': { rev: 640, hrs: 5.0, base: 41.20 }, 'Wed:8': { rev: 900, hrs: 7.0, base: 43.10 },
  'Wed:9': { rev: 790, hrs: 6.5, base: 38.80 }, 'Wed:10': { rev: 550, hrs: 5.1, base: 36.00 },
  'Fri:1': { rev: 260, hrs: 4.8, base: 36.10 }, 'Fri:2': { rev: 560, hrs: 6.4, base: 39.40 },
  'Fri:3': { rev: 430, hrs: 5.5, base: 37.50 }, 'Fri:4': { rev: 180, hrs: 3.8, base: 34.00 },
  'Fri:7': { rev: 620, hrs: 5.6, base: 41.80 }, 'Fri:8': { rev: 860, hrs: 6.9, base: 42.10 },
  'Fri:9': { rev: 750, hrs: 6.4, base: 38.40 },
  'Sat:7': { rev: 720, hrs: 5.6, base: 43.20 }, 'Sat:8': { rev: 1020, hrs: 7.5, base: 43.80 },
  'Sat:9': { rev: 890, hrs: 7.1, base: 40.90 }, 'Sat:10': { rev: 620, hrs: 5.8, base: 37.80 },
};
const LE_BASELINES = {
  '10A': 28.40, '11A': 36.20, '12P': 40.50, '1P': 38.10, '2P': 34.50,
  '3P': null, '4P': null, '5P': 39.20, '6P': 43.10, '7P': 42.40, '8P': 39.50, '9P': 35.20,
};

function leClassForScore(score) {
  if (score === null) return 'le-hm-gray';
  if (score >= 85) return 'le-hm-green';
  if (score >= 70) return 'le-hm-amber';
  return 'le-hm-red';
}

function populateHeatmap() {
  const grid = document.getElementById('le-heatmap-grid');
  if (!grid) return;
  if (grid.dataset.populated === '1') return;

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  days.forEach(day => {
    // Day label cell
    const dayLabel = document.createElement('div');
    dayLabel.className = 'le-heatmap-day';
    dayLabel.textContent = day === 'Mon' ? 'Monday'
      : day === 'Tue' ? 'Tuesday'
      : day === 'Wed' ? 'Wednesday'
      : day === 'Thu' ? 'Thursday'
      : day === 'Fri' ? 'Friday'
      : day === 'Sat' ? 'Saturday' : 'Sunday';
    grid.appendChild(dayLabel);

    // Cells
    LE_HEATMAP_DATA[day].forEach((score, hourIdx) => {
      const cell = document.createElement('div');
      cell.className = 'le-heatmap-cell ' + leClassForScore(score);

      // Compute RPLH for the cell: prefer measured rev/hrs, else baseline × score/100
      let rplh = null;
      if (score !== null) {
        const cd = LE_CELL_DATA[day + ':' + hourIdx];
        if (cd && cd.rev !== null && cd.hrs && cd.hrs > 0) {
          rplh = cd.rev / cd.hrs;
        } else {
          const base = (cd && cd.base) || LE_BASELINES[LE_HOURS[hourIdx]];
          if (base) rplh = base * score / 100;
        }
      }

      cell.innerHTML = score === null
        ? '<span class="le-hc-score">—</span>'
        : '<span class="le-hc-score">' + score + '</span>'
          + (rplh ? '<span class="le-hc-rplh">$' + rplh.toFixed(0) + '</span>' : '');

      cell.title = day + ' · ' + LE_HOUR_LABELS[hourIdx] + ' · '
        + (score === null ? 'N/A (no revenue)' : 'Score ' + score + (rplh ? ' · $' + rplh.toFixed(2) + '/hr' : ''));
      cell.setAttribute('data-day', day);
      cell.setAttribute('data-hour', LE_HOURS[hourIdx]);
      cell.setAttribute('data-score', score === null ? '' : score);
      cell.addEventListener('click', function() {
        leShowHeatmapDetail(day, hourIdx, score);
      });
      grid.appendChild(cell);
    });
  });
  grid.dataset.populated = '1';
  // Apply whichever focal is pending (default = Oakland Tue Lunch) once cells exist.
  if (typeof leApplyHeatmapFocal === 'function') {
    leApplyHeatmapFocal(typeof LE_PENDING_FOCAL !== 'undefined' ? LE_PENDING_FOCAL : 'default');
  }
}

// Staffing Plan · drafted-action state. Same shape as Coaching's scheduled state:
// session-scoped, keyed by recommendation id, mutates the DOM in place since
// the recommendation cards are static HTML (not JS-rendered).
let LE_SF_DRAFTED = {};

function leSfDraftRec(recId, recLabel, recAmount) {
  if (LE_SF_DRAFTED[recId]) {
    // Idempotent — clicking again does nothing besides a toast nudge.
    if (typeof showDemoToast === 'function') {
      showDemoToast(recLabel + ' is already drafted · review in Actions', 'blue');
    }
    return;
  }
  LE_SF_DRAFTED[recId] = { label: recLabel, amount: recAmount, date: 'today' };
  if (typeof showDemoToast === 'function') {
    showDemoToast('Action drafted · ' + recLabel + ' ($' + recAmount + '/wk) · review in Actions', 'green');
  }
  leSfApplyDraftedState();
}

function leSfUndraftRec(recId) {
  delete LE_SF_DRAFTED[recId];
  if (typeof showDemoToast === 'function') {
    showDemoToast('Draft removed · recommendation back in queue', 'blue');
  }
  leSfApplyDraftedState();
}

// Bulk apply — drafts every recommendation above the action floor (tier !== red).
// Skips items already drafted. Floor enforcement lives in the rec card classes.
function leSfBulkApplyDraft() {
  const cards = document.querySelectorAll('#le-subpage-staffing .le-sf-item[data-rec-id]');
  let drafted = 0;
  cards.forEach(card => {
    const id = card.getAttribute('data-rec-id');
    const tierRed = card.classList.contains('le-sf-item-conf-red');
    if (tierRed) return;
    if (LE_SF_DRAFTED[id]) return;
    const label = card.getAttribute('data-rec-label') || id;
    const amount = parseInt(card.getAttribute('data-rec-amount') || '0', 10);
    LE_SF_DRAFTED[id] = { label: label, amount: amount, date: 'today' };
    drafted++;
  });
  if (typeof showDemoToast === 'function') {
    if (drafted > 0) {
      showDemoToast(drafted + ' action' + (drafted === 1 ? '' : 's') + ' drafted · review in Actions', 'green');
    } else {
      showDemoToast('No new actions to draft · all ready items are already drafted', 'amber');
    }
  }
  leSfApplyDraftedState();
}

// Update every recommendation card + the bulk-apply bar to reflect current draft state.
// Idempotent — safe to call multiple times.
function leSfApplyDraftedState() {
  document.querySelectorAll('#le-subpage-staffing .le-sf-item[data-rec-id]').forEach(card => {
    const id = card.getAttribute('data-rec-id');
    const draft = LE_SF_DRAFTED[id];
    const ctaRow = card.querySelector('.le-sf-item-cta');
    let badge = card.querySelector('.le-sf-drafted-badge');
    if (draft) {
      card.classList.add('is-drafted');
      // Insert drafted badge in the value block if not present
      const valBlock = card.querySelector('.le-sf-item-val-block');
      if (valBlock && !badge) {
        badge = document.createElement('div');
        badge.className = 'le-sf-drafted-badge';
        badge.innerHTML = '✓ Drafted · today';
        valBlock.appendChild(badge);
      }
      // Swap CTAs: primary "Turn into Action" → secondary "Open in Actions" + ghost "Undo draft"
      if (ctaRow && !ctaRow.dataset.draftedCtas) {
        ctaRow.dataset.draftedCtas = '1';
        const label = card.getAttribute('data-rec-label') || id;
        const heatmapKey = id;
        ctaRow.innerHTML =
          '<button class="btn btn-secondary btn-sm" onclick="showScreen(\'actions\',null,\'Active Recovery\');setTimeout(()=>showActionsSubpage(\'active\'),30)">Open in Actions →</button>'
          + '<button class="btn btn-ghost btn-sm" onclick="leSfUndraftRec(\'' + id + '\')">Undo draft</button>'
          + '<button class="btn btn-ghost btn-sm" onclick="leShowHeatmapWithFocal(\'' + heatmapKey + '\')">View in Heatmap</button>';
      }
    } else {
      card.classList.remove('is-drafted');
      if (badge) badge.remove();
      // Restore original CTAs if previously swapped
      if (ctaRow && ctaRow.dataset.draftedCtas) {
        delete ctaRow.dataset.draftedCtas;
        const label = card.getAttribute('data-rec-label') || id;
        const amount = card.getAttribute('data-rec-amount') || '0';
        ctaRow.innerHTML =
          '<button class="btn btn-primary btn-sm" onclick="leSfDraftRec(\'' + id + '\',\'' + label + '\',' + amount + ')">Turn into Action</button>'
          + '<button class="btn btn-secondary btn-sm" onclick="leShowHeatmapWithFocal(\'' + id + '\')">View in Heatmap</button>';
      }
    }
  });

  // Update the bulk apply bar
  const bulkBtn = document.querySelector('#le-subpage-staffing .le-sf-apply-bar-cta');
  if (bulkBtn) {
    const eligible = document.querySelectorAll('#le-subpage-staffing .le-sf-item[data-rec-id]:not(.le-sf-item-conf-red)');
    const remaining = Array.from(eligible).filter(c => !LE_SF_DRAFTED[c.getAttribute('data-rec-id')]);
    const remainingSum = remaining.reduce((a, c) => a + parseInt(c.getAttribute('data-rec-amount') || '0', 10), 0);
    if (remaining.length === 0) {
      bulkBtn.innerHTML = '<span class="le-sf-bulk-done">✓ All ready actions drafted</span>';
    } else {
      bulkBtn.innerHTML = '<button class="btn btn-primary" onclick="leSfBulkApplyDraft()">Apply ' + remaining.length + ' action' + (remaining.length === 1 ? '' : 's') + ' · $' + remainingSum + '/wk →</button>';
    }
  }
}

// Heatmap focal map — each Staffing Plan recommendation (and other call sites)
// can navigate to the Heatmap with the correct focal context, instead of
// landing on the same default focal regardless of where the user clicked from.
const LE_HEATMAP_FOCALS = {
  'default': {
    eyebrow: 'Worst shift this week',
    shift:   'Oakland · Tuesday · Lunch',
    sev:     'Medium severity · lowest sales per labor hour',
    day:     'Tue',
    hours:   ['11A', '12P', '1P', '2P']
  },
  'oakland-tue-dinner': {
    eyebrow: 'Coming from Staffing Plan',
    shift:   'Oakland · Tuesday · Dinner',
    sev:     'High severity · over-staffed by 1 front-of-house server',
    day:     'Tue',
    hours:   ['5P', '6P', '7P', '8P', '9P']
  },
  'wc-wed-dinner': {
    eyebrow: 'Coming from Staffing Plan',
    shift:   'Walnut Creek · Wednesday · Dinner',
    sev:     'Medium severity · slow bar service · 4 of 4 comparable shifts',
    day:     'Wed',
    hours:   ['5P', '6P', '7P', '8P', '9P']
  },
  'berkeley-mon-lunch': {
    eyebrow: 'Coming from Staffing Plan',
    shift:   'Berkeley · Monday · Lunch',
    sev:     'Below 70% — too low to act on yet · investigate first',
    day:     'Mon',
    hours:   ['11A', '12P', '1P', '2P']
  }
};
let LE_PENDING_FOCAL = 'default';

// Apply a focal preset to the Heatmap subpage: rewrite the focal eyebrow text
// and toggle the .is-focal class on matching cells. Called after the heatmap
// renders (cells must exist before .is-focal is applied).
function leApplyHeatmapFocal(key) {
  const f = LE_HEATMAP_FOCALS[key] || LE_HEATMAP_FOCALS.default;
  const eb = document.getElementById('leFocalEyebrow');
  const sh = document.getElementById('leFocalShift');
  const sv = document.getElementById('leFocalSev');
  if (eb) eb.textContent = f.eyebrow;
  if (sh) sh.textContent = f.shift;
  if (sv) sv.textContent = f.sev;
  // Clear prior focal cells, then mark the new ones.
  document.querySelectorAll('.le-heatmap-cell.is-focal')
    .forEach(c => c.classList.remove('is-focal'));
  f.hours.forEach(h => {
    const sel = '.le-heatmap-cell[data-day="' + f.day + '"][data-hour="' + h + '"]';
    document.querySelectorAll(sel).forEach(c => c.classList.add('is-focal'));
  });
}

// Called from any Staffing Plan / Overview button that wants to open the
// Heatmap with a specific focal context. Stores the focal key and triggers
// subpage navigation; the heatmap-render hook will pick it up on activation.
function leShowHeatmapWithFocal(focalKey) {
  LE_PENDING_FOCAL = focalKey || 'default';
  if (typeof showLaborSubpage === 'function') {
    showLaborSubpage('heatmap');
  }
  // Apply focal slightly after subpage activation so cells exist + populateHeatmap has run.
  setTimeout(() => leApplyHeatmapFocal(LE_PENDING_FOCAL), 60);
}

// (v32) Evidence subpage — expand/collapse all cards (works on any Evidence page using .ev-card)
function leEvToggleAll(open) {
  document.querySelectorAll('details.ev-card').forEach(d => {
    if (open) d.setAttribute('open', '');
    else d.removeAttribute('open');
  });
}

function leCloseHeatmapDetail() {
  const panel = document.getElementById('le-heatmap-detail');
  if (panel) {
    panel.classList.remove('le-heatmap-detail-open');
    panel.style.display = 'none';
  }
  document.querySelectorAll('.le-heatmap-cell-selected')
    .forEach(el => el.classList.remove('le-heatmap-cell-selected'));
}

// 6-week recurring-pattern fixture data, keyed by Day:hourIdx.
// Currently populated for Tue lunch hours — the canonical recurring shift.
// Values are weekly productivity scores ending in the current week.
const LE_RECURRING_PATTERNS = {
  'Tue:1': [85, 79, 84, 81, 78, 78], // 11 AM
  'Tue:2': [88, 79, 86, 82, 81, 78], // 12 PM
  'Tue:3': [89, 85, 88, 86, 84, 87], // 1 PM (less consistent pattern)
  'Tue:4': [82, 78, 80, 79, 77, 76], // 2 PM (most severe)
};

function leShowHeatmapDetail(day, hourIdx, score) {
  const panel = document.getElementById('le-heatmap-detail');
  const titleEl = document.getElementById('le-hmd-title');
  const gridEl = document.getElementById('le-hmd-grid');
  if (!panel || !titleEl || !gridEl) return;

  const hourLabel = LE_HOUR_LABELS[hourIdx];
  const baseline = LE_BASELINES[LE_HOURS[hourIdx]];
  const cellKey = day + ':' + hourIdx;
  const cell = LE_CELL_DATA[cellKey] || null;

  // Selected-cell state: clear any prior, mark the clicked cell.
  document.querySelectorAll('.le-heatmap-cell-selected')
    .forEach(el => el.classList.remove('le-heatmap-cell-selected'));
  const clickedCell = document.querySelector(
    '.le-heatmap-cell[data-day="' + day + '"][data-hour="' + LE_HOURS[hourIdx] + '"]'
  );
  if (clickedCell) clickedCell.classList.add('le-heatmap-cell-selected');

  titleEl.textContent = day + ' · ' + hourLabel;

  const cellId = 'le-cell-' + day.toLowerCase() + '-' + hourIdx;
  const actionLabel = day + ' ' + hourLabel;

  // Build a 6-week recurring-pattern sparkline if this cell has one on file.
  const pattern = LE_RECURRING_PATTERNS[cellKey];
  let sparklineHtml = '';
  if (pattern) {
    const belowCount = pattern.filter(s => s < 85).length;
    let bars = '';
    pattern.forEach((s, i) => {
      const cls = s >= 85 ? 'le-hm-green' : s >= 70 ? 'le-hm-amber' : 'le-hm-red';
      const isCurrent = i === pattern.length - 1;
      const wkLabel = isCurrent ? 'This wk' : (pattern.length - i - 1) + ' wks ago';
      bars +=
        '<div class="le-hmd-spark-bar ' + cls + (isCurrent ? ' le-hmd-spark-current' : '') + '"' +
        ' style="height:' + s + '%"' +
        ' title="' + wkLabel + ' · ' + s + '"></div>';
    });
    sparklineHtml =
      '<div class="le-hmd-sparkline-row">' +
        '<span class="le-hmd-spark-label">6-week pattern · ' + day + ' ' + hourLabel + '</span>' +
        '<div class="le-hmd-sparkline">' + bars + '</div>' +
        '<span class="le-hmd-spark-cap">Below baseline ' + belowCount + ' of last 6 wks · this week highlighted</span>' +
      '</div>';
  }

  if (score === null || (cell && cell.rev === null)) {
    gridEl.innerHTML =
      '<div class="le-hmd-status"><span class="le-hmd-status-pill le-hmd-status-na">N/A · Excluded</span></div>' +
      '<div class="le-hmd-rec-hero le-hmd-rec-hero-neutral">' +
        '<div class="le-hmd-rec-label">Why excluded</div>' +
        '<div class="le-hmd-rec-text">Pre/post-close or zero-revenue hour. RPLH denominator excludes this window — labor cost is counted only in total shift cost.</div>' +
      '</div>' +
      '<div class="le-hmd-source">Source: Toast POS + Toast Labor + SKC baseline engine</div>' +
      '<div class="le-hmd-ctas">' +
        '<button class="btn btn-ghost btn-sm" onclick="openLaborEvidence(\'' + cellId + '\')">Show Evidence</button>' +
      '</div>';
  } else {
    const rev = cell ? cell.rev : null;
    const hrs = cell ? cell.hrs : null;
    const base = cell ? cell.base : baseline;
    const currRplh = (rev !== null && hrs !== null && hrs > 0) ? (rev / hrs).toFixed(2) : (base ? (base * score / 100).toFixed(2) : '—');
    const excessHrs = (hrs !== null && rev !== null && base)
      ? Math.max(0, hrs - rev / base).toFixed(1)
      : (score < 100 && hrs ? (hrs * (1 - score/100)).toFixed(1) : '0.0');
    const isTueLunch = (day === 'Tue' && hourIdx >= 1 && hourIdx <= 4);
    const rec = isTueLunch
      ? 'Remove or shift one front-of-house slot from 11 AM–2 PM'
      : (score < 70 ? 'Investigate why this hour is so far behind' : score < 85 ? 'Watch this hour — under the healthy benchmark' : 'No action required — within the healthy range');
    const statusText = score >= 85 ? 'Healthy · meeting benchmark' : score >= 70 ? 'Watch · below benchmark' : 'Problem · well below benchmark';
    const statusClass = score >= 85 ? 'le-hmd-status-healthy' : score >= 70 ? 'le-hmd-status-watch' : 'le-hmd-status-severe';

    gridEl.innerHTML =
      // Severity pill — first thing the reader sees
      '<div class="le-hmd-status"><span class="le-hmd-status-pill ' + statusClass + '">' + statusText + '</span></div>' +
      // Recommendation hero — answers "what do I do" without scrolling
      '<div class="le-hmd-rec-hero">' +
        '<div class="le-hmd-rec-label">Recommendation</div>' +
        '<div class="le-hmd-rec-text">' + rec + '</div>' +
      '</div>' +
      // Dense 2-column data grid for the short numeric pairs
      '<div class="le-hmd-compact">' +
        '<div class="le-hmd-cell"><div class="le-hmd-cell-key">Revenue</div><div class="le-hmd-cell-val">' + (rev !== null ? '$' + rev : '—') + '</div></div>' +
        '<div class="le-hmd-cell"><div class="le-hmd-cell-key">Labor hours</div><div class="le-hmd-cell-val">' + (hrs !== null ? hrs + ' hrs' : '—') + '</div></div>' +
        '<div class="le-hmd-cell"><div class="le-hmd-cell-key">Sales / labor hr</div><div class="le-hmd-cell-val">$' + currRplh + '/hr <span class="le-hmd-tag-det" title="Measured directly from POS data">Measured</span></div></div>' +
        '<div class="le-hmd-cell"><div class="le-hmd-cell-key">Healthy benchmark</div><div class="le-hmd-cell-val">$' + (base ? base.toFixed(2) : '—') + '/hr</div></div>' +
        '<div class="le-hmd-cell"><div class="le-hmd-cell-key">Score · out of 100</div><div class="le-hmd-cell-val">' + score + ' <span class="le-hmd-tag-det" title="Measured directly from POS data">Measured</span></div></div>' +
        '<div class="le-hmd-cell"><div class="le-hmd-cell-key">Extra hours staffed</div><div class="le-hmd-cell-val">' + excessHrs + ' hrs <span class="le-hmd-tag-est" title="Estimated based on wage assumptions">Estimated</span></div></div>' +
      '</div>' +
      sparklineHtml +
      '<div class="le-hmd-source">Source: Toast POS + Toast Labor + SKC baseline engine</div>' +
      '<div class="le-hmd-ctas">' +
        (score < 85
          ? '<button class="btn btn-primary btn-sm" onclick="leCreateAction(\'' + actionLabel.replace(/'/g, "\\'") + '\')">Create Action</button>'
          : '') +
        '<button class="btn btn-secondary btn-sm" onclick="openStaffingPlan(\'' + cellId + '\')">Review Staffing Plan</button>' +
        '<button class="btn btn-ghost btn-sm" onclick="openLaborEvidence(\'' + cellId + '\')">Show Evidence</button>' +
      '</div>';
  }

  // Restart the slide-in animation each time a new cell is clicked.
  panel.classList.remove('le-heatmap-detail-open');
  panel.style.display = 'block';
  // Force reflow so the animation re-triggers.
  void panel.offsetWidth;
  panel.classList.add('le-heatmap-detail-open');
}

// Populate heatmap when Labor Efficiency screen activates
(function() {
  // Patch showScreen to lazily populate heatmap when screen-labor-efficiency becomes visible
  if (typeof window.showScreen === 'function' && !window.__leShowScreenPatched) {
    const _origShowScreen = window.showScreen;
    window.showScreen = function(screenId, navEl, title) {
      const result = _origShowScreen.apply(this, arguments);
      if (screenId === 'labor-efficiency') {
        setTimeout(populateHeatmap, 30);
      }
      return result;
    };
    window.__leShowScreenPatched = true;
  }
})();


// ────────────────────────────────────────────────────────────────────
// Script 4 (source lines 30373-31089): SKC_TRUST trust layer
// ────────────────────────────────────────────────────────────────────
/* ═══════════════════════════════════════════════════════════════════════════
   SKC_TRUST — namespace for v23 trust layer
   Reads SKC_STATE.data_quality.sources.*  (canonical source of truth)
   Owns:
     - onboarding state (Fix 1)
     - first_action_assigned flag (Fix 2)
     - rejections array (Fix 3)
     - dq_demo_state (Fix 4 — override healthy for demo)
   ═══════════════════════════════════════════════════════════════════════════ */
window.SKC_TRUST = (function(){

  // ── State (extends SKC_STATE side-by-side) ───────────────
  var state = {
    onboarding: {
      day: 14,           // 0 / 7 / 14+ (toggleable via QA)
      enabled: false,    // becomes true when day < 14
    },
    first_action_assigned: false,  // default false — walkthrough shows on first openCA; set true after submit or dismiss
    rejections: {},                 // { leakKey: { reason, ts, location } }
    dq_demo_state: 'as_state',      // 'as_state' | 'all_healthy' | 'toast_down' | 'shifts_stale' | 'recipe_stale'
  };

  // ── (Fix 4) DQ failure profiles — effective when active ─
  // These mirror SKC_STATE.data_quality patterns but allow demo overrides.
  var DQ_PROFILES = {
    toast_down: {
      severity: 'red',
      banner_title: 'Toast POS disconnected · Detection paused',
      banner_sub:   'Last sync 4h ago. No new opportunities will be detected until reconnection.',
      banner_cta:   { label: 'Reconnect Toast', action: "SKC_TRUST.simulateReconnect('toast')" },
      card: {
        title:    'Toast POS — disconnected',
        sub:      'All detection is paused until this source reconnects. Last sync 4h ago.',
        cta:      { label: 'Reconnect Toast', action: "SKC_TRUST.simulateReconnect('toast')" },
        affected_label: 'Detections paused',
        affected: [
          { name: 'Labor overstaffing', status: 'Paused' },
          { name: 'Menu margin (salmon)', status: 'Paused' },
          { name: 'Throughput / ticket time', status: 'Paused' },
          { name: 'Table turns', status: 'Paused' },
        ],
        impact: 'Verified Savings eligibility is suspended for the duration of the outage. Active Recovery actions already in monitoring continue but cannot verify until Toast reconnects.',
      },
    },
    shifts_stale: {
      severity: 'amber',
      banner_title: '7shifts token expired · Labor confidence reduced',
      banner_sub:   'Labor confidence currently 78% (was 85%). Refresh token to restore full accuracy.',
      banner_cta:   { label: 'Refresh token', action: "SKC_TRUST.simulateReconnect('shifts')" },
      card: {
        title:    '7shifts — token stale',
        sub:      'Token expired 18 hours ago. Labor recommendations are confidence-reduced until refreshed.',
        cta:      { label: 'Refresh 7shifts token', action: "SKC_TRUST.simulateReconnect('shifts')" },
        affected_label: 'Labor detections — confidence reduced',
        affected: [
          { name: 'Labor overstaffing (OPP-001)', status: 'Conf. 78%', pillCls: 'skc-tr-dqfail-pill-reduced' },
        ],
        impact: 'Labor-related recommendations still allowed but require GM approval. Verified Savings on labor actions are blocked until token refreshes.',
      },
    },
    recipe_stale: {
      severity: 'yellow',
      banner_title: 'Recipe cost file stale',
      banner_sub:   'Uploaded 18 days ago. Menu margin confidence reduced. Salmon reprice recommendation now 71% (was 81%).',
      banner_cta:   { label: 'Upload latest', action: "SKC_TRUST.simulateRecipeUpload()" },
      card: {
        title:    'Recipe cost file — stale (18d)',
        sub:      'Menu margin calculations use ingredient costs from 18 days ago. Confidence reduced on menu-category recommendations.',
        cta:      { label: 'Upload latest recipe costs', action: "SKC_TRUST.simulateRecipeUpload()" },
        affected_label: 'Menu detections — confidence reduced',
        affected: [
          { name: 'Salmon reprice (OPP-002)', status: 'Conf. 71%', pillCls: 'skc-tr-dqfail-pill-reduced' },
        ],
        impact: 'Menu recommendations remain allowed. Salmon reprice confidence reduced to 71% until recipe costs refresh. Verified Savings still eligible but uses the latest available costs.',
      },
    },
    // (v26 · Fix 10) Dirty data — connected but contaminated
    data_dirty: {
      severity: 'amber',
      banner_title: 'Toast data quality flagged · 14% of dine-in checks show anomalies',
      banner_sub:   'Open >4hr, $0 totals, missing guest counts, dining-option mismatch, voids-as-comps. Recommendations are excluding flagged checks until reviewed.',
      banner_cta:   { label: 'Review flagged checks', action: "showScreen('settings',null,'Data Quality');switchTab('dq','hygiene')" },
      card: {
        title:    'Toast — connected, but data quality flagged',
        sub:      '14% of dine-in checks in the last 7 days fail one or more hygiene rules. SKC excludes these from baselines and detection until reviewed.',
        cta:      { label: 'Open Data Hygiene tab', action: "showScreen('settings',null,'Data Quality');switchTab('dq','hygiene')" },
        affected_label: 'Detection accuracy — reduced across categories',
        affected: [
          { name: 'Labor (OPP-001)', status: 'Conf. −5 pts',  pillCls: 'skc-tr-dqfail-pill-reduced' },
          { name: 'Menu (OPP-002)',  status: 'Conf. −8 pts',  pillCls: 'skc-tr-dqfail-pill-reduced' },
          { name: 'Throughput (OPP-003)', status: 'Conf. −12 pts', pillCls: 'skc-tr-dqfail-pill-reduced' },
        ],
        impact: 'Detection runs but with confidence penalties proportional to the share of flagged checks. Verified Savings remain eligible only on opportunities where flagged-check share is under 10% of the relevant window. Operators should review the Data Hygiene tab weekly.',
      },
    },
  };

  // ── Active DQ profile resolver ──────────────────────────
  function activeDqProfile(){
    if (state.dq_demo_state === 'all_healthy') return null;
    if (state.dq_demo_state === 'toast_down')   return { id:'toast_down', ...DQ_PROFILES.toast_down };
    if (state.dq_demo_state === 'shifts_stale') return { id:'shifts_stale', ...DQ_PROFILES.shifts_stale };
    if (state.dq_demo_state === 'recipe_stale') return { id:'recipe_stale', ...DQ_PROFILES.recipe_stale };
    if (state.dq_demo_state === 'data_dirty')   return { id:'data_dirty',   ...DQ_PROFILES.data_dirty   };
    // 'as_state' — derive from SKC_STATE (default: shifts stale per existing state)
    if (typeof SKC_STATE !== 'undefined') {
      if (SKC_STATE.data_quality.sources.shifts.status === 'stale') {
        return { id:'shifts_stale', ...DQ_PROFILES.shifts_stale };
      }
      if (SKC_STATE.data_quality.sources.menu.status === 'stale') {
        return { id:'recipe_stale', ...DQ_PROFILES.recipe_stale };
      }
    }
    return null;
  }

  // ── (Fix 4) Render top-of-screen DQ banner ──────────────
  function renderDqBanner(){
    var el = document.getElementById('skc-tr-dq-banner');
    if (!el) return;
    var prof = activeDqProfile();
    if (!prof) { el.classList.remove('skc-tr-active'); el.style.display='none'; return; }
    var cls = 'skc-tr-banner-' + prof.severity;
    el.className = 'skc-tr-banner skc-tr-active ' + cls;
    el.style.display = 'flex';
    el.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:var(--'+ (prof.severity==='red'?'red':'amber') +')"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' +
      '<div class="skc-tr-banner-body">' +
        '<div class="skc-tr-banner-title">' + escapeHtml(prof.banner_title) + '</div>' +
        '<div class="skc-tr-banner-sub">' + escapeHtml(prof.banner_sub) + '</div>' +
      '</div>' +
      '<button class="btn btn-secondary btn-sm" onclick="'+ prof.banner_cta.action +'">' + escapeHtml(prof.banner_cta.label) + '</button>';
  }

  // ── (Fix 4) Render DQ failure cards on Data Quality screen ─
  function renderDqFailureCards(){
    var host = document.getElementById('skc-tr-dq-failure-cards');
    if (!host) return;
    var prof = activeDqProfile();
    if (!prof) {
      host.innerHTML = '<div style="padding:14px 16px;background:var(--green-d);border:1px solid var(--green-b);border-left:3px solid var(--green);border-radius:var(--r-md);font-size:12px;color:var(--t1);line-height:1.55"><strong style="color:var(--green)">All sources healthy.</strong> Detection running across all categories. No DQ failures to resolve.</div>';
      return;
    }
    var sev = prof.severity;
    var sevClass = sev === 'red' ? 'skc-tr-dqfail-red' : sev === 'amber' ? 'skc-tr-dqfail-amber' : 'skc-tr-dqfail-yellow';
    var c = prof.card;

    var affectedHtml = c.affected.map(function(a){
      var pill = a.pillCls || 'skc-tr-dqfail-pill-paused';
      return '<span class="skc-tr-dqfail-pill ' + pill + '">' + escapeHtml(a.name) + ' · ' + escapeHtml(a.status) + '</span>';
    }).join('');

    host.innerHTML =
      '<div class="skc-tr-dqfail ' + sevClass + '">' +
        '<div class="skc-tr-dqfail-head">' +
          '<div>' +
            '<div class="skc-tr-dqfail-title">' + escapeHtml(c.title) + '</div>' +
            '<div class="skc-tr-dqfail-sub">' + escapeHtml(c.sub) + '</div>' +
          '</div>' +
          '<button class="btn btn-primary btn-sm" onclick="'+ c.cta.action +'">' + escapeHtml(c.cta.label) + '</button>' +
        '</div>' +
        '<div class="skc-tr-dqfail-affected">' +
          '<strong>' + escapeHtml(c.affected_label) + '</strong>' +
          '<div class="skc-tr-dqfail-pillrow">' + affectedHtml + '</div>' +
        '</div>' +
        '<div class="skc-tr-dqfail-impact">' + escapeHtml(c.impact) + '</div>' +
      '</div>';
  }

  // ── (Fix 4) Demo reconnect / upload handlers ────────────
  function simulateReconnect(src){
    if (typeof showDemoToast === 'function') {
      var msg = src === 'toast'  ? 'Toast OAuth flow simulated · Source reconnected · Detection resuming'
              : src === 'shifts' ? '7shifts token refreshed · Labor confidence restored to 85%'
              : 'Source reconnect simulated';
      showDemoToast(msg, 'green');
    }
    state.dq_demo_state = 'all_healthy';
    renderAll();
  }
  function simulateRecipeUpload(){
    if (typeof showDemoToast === 'function') {
      showDemoToast('Recipe cost file uploaded · Menu margin confidence restored to 81%', 'green');
    }
    state.dq_demo_state = 'all_healthy';
    renderAll();
  }

  // ── (Fix 1) Onboarding render ───────────────────────────
  function renderOnboarding(){
    var ob = document.getElementById('skc-tr-onboarding');
    if (!ob) return;
    var preBaseline = document.getElementById('preBaselineBanner');
    if (!state.onboarding.enabled) {
      ob.classList.remove('skc-tr-active');
      ob.style.display = 'none';
      // restore default home content
      var defaults = document.querySelectorAll('#screen-home [data-skc-tr-default]');
      defaults.forEach(function(el){ el.style.display = ''; });
      if (preBaseline) preBaseline.style.display = '';
      return;
    }
    ob.classList.add('skc-tr-active');
    ob.style.display = 'flex';
    if (preBaseline) preBaseline.style.display = 'none';

    // hide existing home content (preserve via data-skc-tr-default)
    var defaultEls = document.querySelectorAll('#screen-home > :not(#skc-tr-onboarding):not(#skc-tr-dq-banner):not(#preBaselineBanner)');
    defaultEls.forEach(function(el){
      if (!el.hasAttribute('data-skc-tr-default')) el.setAttribute('data-skc-tr-default','1');
      el.style.display = 'none';
    });

    // Build the overlay content
    var day = state.onboarding.day;
    var daysCollected = Math.min(14, day);
    var pct = Math.min(100, (day / 14) * 100);

    // 5-step checklist with status derived from day
    function stat(threshold, label){
      // Below threshold: status is "todo" or "warn" depending on what
      // Above threshold: ok
      return day >= threshold ? 'ok' : (day >= Math.max(0, threshold - 3) ? 'warn' : 'todo');
    }

    var steps = [
      { id:'toast',    title:'Connect Toast POS',                  meta: day >= 0 ? 'Connected · syncing every 5 min' : 'Not connected',         st: day >= 0 ? 'ok' : 'todo', cta: 'Manage' },
      { id:'shifts',   title:'Connect 7shifts',                    meta: day >= 7 ? 'Connected · token healthy' : (day >= 2 ? 'Token stale — refresh' : 'Not connected'), st: day >= 7 ? 'ok' : (day >= 2 ? 'warn' : 'todo'), cta: 'Connect' },
      { id:'recipe',   title:'Upload recipe cost file',            meta: day >= 5 ? 'Current · uploaded 2d ago' : (day >= 2 ? 'Stale 18d ago — please re-upload' : 'Missing — upload to enable menu detection'), st: day >= 5 ? 'ok' : (day >= 2 ? 'warn' : 'todo'), cta: 'Upload' },
      { id:'roles',    title:'Confirm location roles & wages',     meta: day >= 4 ? 'Confirmed across 4 locations' : 'Pending — please confirm', st: day >= 4 ? 'ok' : 'todo', cta: 'Open' },
      { id:'guard',    title:'Define guardrail thresholds',        meta: day >= 6 ? 'Set: RPLH ≥ $36.50, CM ≥ 62%, ticket ≤ 12 min' : 'Pending — recommended after 7d of data', st: day >= 6 ? 'ok' : 'todo', cta: 'Configure' },
    ];

    var detectableMap = { 0: 0, 7: 1, 14: 3 };
    var detectable = day >= 14 ? 3 : (day >= 7 ? 1 : 0);

    var html =
      '<div class="skc-tr-ob-hero">' +
        '<div class="skc-tr-ob-eyebrow">Cold-start onboarding · Day ' + day + ' of 14</div>' +
        '<h1 class="skc-tr-ob-h1">SKC is learning your operation.</h1>' +
        '<div class="skc-tr-ob-sub">' + (day === 0
            ? 'Welcome to SKC. Your first 14 days build a personalized baseline. Until then, KPIs below are industry benchmarks — not your numbers yet.'
            : day < 14
            ? 'Toast data is streaming. You\'re ' + daysCollected + ' of 14 days into baseline-building. The first detections will unlock as data thresholds clear.'
            : 'Baseline complete. Detection is live across all categories. You can now see personalized profit-recovery opportunities on Today.') +
        '</div>' +
        '<div class="skc-tr-ob-progress">' +
          '<div class="skc-tr-ob-progress-head"><span>Days of Toast data collected</span><strong>' + daysCollected + ' of 14</strong></div>' +
          '<div class="skc-tr-ob-bar-track"><div class="skc-tr-ob-bar-fill" style="width:' + pct.toFixed(1) + '%"></div></div>' +
        '</div>' +
      '</div>' +

      '<div class="skc-tr-ob-grid">' +
        '<div class="skc-tr-checklist">' +
          '<div class="skc-tr-checklist-h">Setup checklist</div>' +
          '<div class="skc-tr-checklist-sub">Complete these 5 steps to unlock detection. SKC needs each to compute and verify recommendations safely.</div>' +
          '<div class="skc-tr-checklist-list">' +
            steps.map(function(s, i){
              var cls = 'skc-tr-step-' + s.st;
              var icon = s.st === 'ok' ? '✓' : s.st === 'warn' ? '!' : String(i + 1);
              return '<div class="skc-tr-step ' + cls + '">' +
                '<div class="skc-tr-step-icon">' + icon + '</div>' +
                '<div class="skc-tr-step-body">' +
                  '<div class="skc-tr-step-title">' + escapeHtml(s.title) + '</div>' +
                  '<div class="skc-tr-step-meta">' + escapeHtml(s.meta) + '</div>' +
                '</div>' +
                (s.st === 'ok' ? '' : '<button type="button" class="skc-tr-step-cta" onclick="showScreen(\'settings\',null,\'Data Quality\')">' + escapeHtml(s.cta) + ' →</button>') +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>' +

        '<div class="skc-tr-learning">' +
          '<div class="skc-tr-learning-h">What SKC is learning right now</div>' +
          '<div class="skc-tr-learning-sub">No actions can be recommended until the baseline window completes. This is by design.</div>' +
          '<div class="skc-tr-learning-row"><span class="k">Toast data days collected</span><span class="v">' + daysCollected + ' / 14</span></div>' +
          '<div class="skc-tr-learning-row"><span class="k">Services observed (all locations)</span><span class="v">' + (day * 8) + '</span></div>' +
          '<div class="skc-tr-learning-row"><span class="k">Comparable-service samples</span><span class="v">' + Math.max(0, day - 1) + '</span></div>' +
          '<div class="skc-tr-readiness">' +
            '<div class="skc-tr-readiness-label"><span>Detection readiness</span><span class="v">' + detectable + ' of 3 categories detectable</span></div>' +
            '<div class="skc-tr-ob-bar-track"><div class="skc-tr-ob-bar-fill" style="width:' + ((detectable / 3) * 100).toFixed(1) + '%;background:' + (detectable === 3 ? 'var(--green)' : 'var(--amber)') + '"></div></div>' +
            '<div style="font-size:11px;color:var(--t3);line-height:1.5;margin-top:8px">' + (day < 7 ? 'Labor detection requires 7+ days of comparable services.' : day < 14 ? 'Menu and throughput detection require 14+ days for baselines.' : 'All categories active. Open Today for live recommendations.') + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="skc-tr-benchmarks">' +
        '<div class="skc-tr-benchmarks-h">KPIs <span class="skc-tr-tag-bench">Industry benchmark — not personalized yet</span></div>' +
        '<div class="skc-tr-benchmarks-sub">These are restaurant-industry benchmarks for your daypart and concept. They become your numbers once 14 days of data have been collected.</div>' +
        '<div class="skc-tr-benchmarks-grid">' +
          '<div class="skc-tr-benchmark"><div class="skc-tr-benchmark-label">RPLH</div><div class="skc-tr-benchmark-val">$38.20</div><div class="skc-tr-benchmark-note">Industry casual-dinner benchmark / hr</div></div>' +
          '<div class="skc-tr-benchmark"><div class="skc-tr-benchmark-label">Avg Check</div><div class="skc-tr-benchmark-val">$74.50</div><div class="skc-tr-benchmark-note">Industry dinner benchmark</div></div>' +
          '<div class="skc-tr-benchmark"><div class="skc-tr-benchmark-label">Ticket Time</div><div class="skc-tr-benchmark-val">11.5 min</div><div class="skc-tr-benchmark-note">Industry kitchen benchmark</div></div>' +
        '</div>' +
      '</div>';

    ob.innerHTML = html;
  }

  // ── (Fix 1) QA toggle for onboarding day ────────────────
  function setOnboardingDay(day){
    state.onboarding.day = day;
    state.onboarding.enabled = day < 14;
    renderAll();
    if (typeof showScreen === 'function') showScreen('home', null, 'Today');
    if (typeof showDemoToast === 'function') {
      showDemoToast(day < 14
        ? 'Onboarding state: Day ' + day + ' of 14'
        : 'Baseline complete · Day 14+ · Detection live', day < 14 ? 'blue' : 'green');
    }
  }

  // ── (Fix 2) First-action walkthrough injection ──────────
  function injectWalkthrough(){
    var body = document.querySelector('#caOverlay .ca-modal-body');
    if (!body) return;
    var existing = body.querySelector('.skc-tr-walkthrough');
    if (state.first_action_assigned) {
      // Flag is set — remove panel if it was previously injected
      if (existing) existing.remove();
      return;
    }
    if (existing) return;  // already present and flag still false

    var panel = document.createElement('div');
    panel.className = 'skc-tr-walkthrough';
    panel.innerHTML =
      '<div class="skc-tr-walkthrough-eyebrow">First-time guide · 30-second read</div>' +
      '<div class="skc-tr-walkthrough-h">What happens when you assign this Recovery Action</div>' +

      '<div class="skc-tr-walkthrough-step">' +
        '<div class="skc-tr-walkthrough-num">1</div>' +
        '<div class="skc-tr-walkthrough-body"><strong>What this does.</strong> This action moves to <strong>Active Recovery</strong> — not Verified Savings yet. Active Recovery means a recommended fix is assigned and monitoring is about to start. No dollars are counted in ROI until guardrails close clean.</div>' +
      '</div>' +

      '<div class="skc-tr-walkthrough-step">' +
        '<div class="skc-tr-walkthrough-num">2</div>' +
        '<div class="skc-tr-walkthrough-body"><strong>Monitoring window.</strong> SKC watches the action for the verification period defined in the rule below (typically 2 weeks of comparable services). During this window, every guardrail metric is checked against its limit.</div>' +
      '</div>' +

      '<div class="skc-tr-walkthrough-step">' +
        '<div class="skc-tr-walkthrough-num">3</div>' +
        '<div class="skc-tr-walkthrough-body"><strong>What "verified" means.</strong> If every guardrail holds for the full window, the recovery moves to <strong>Verified Savings</strong> and counts in ROI. If any guardrail fails, the recovery is rejected and the dollars are <em>never</em> counted.</div>' +
      '</div>' +

      '<div class="skc-tr-walkthrough-foot">' +
        '<input type="checkbox" id="skc-tr-dismiss-walkthrough">' +
        '<label for="skc-tr-dismiss-walkthrough">Don\'t show this again</label>' +
      '</div>';

    body.insertBefore(panel, body.firstChild);
  }

  // Patch openCA — wrap existing function so we don't break anything
  function patchOpenCA(){
    if (typeof window.openCA !== 'function') return;
    if (window._skcTrustOpenCAPatched) return;
    var orig = window.openCA;
    window.openCA = function(leakKey){
      orig.apply(this, arguments);
      // Inject walkthrough on every open if flag is false
      setTimeout(injectWalkthrough, 20);
    };
    window._skcTrustOpenCAPatched = true;
  }

  // Patch submitCA so flag is set and toast shows
  function patchSubmitCA(){
    if (typeof window.submitCA !== 'function') return;
    if (window._skcTrustSubmitCAPatched) return;
    var orig = window.submitCA;
    window.submitCA = function(){
      var wasFirst = !state.first_action_assigned;
      // Read dismiss checkbox if present
      var cb = document.getElementById('skc-tr-dismiss-walkthrough');
      if (cb && cb.checked) state.first_action_assigned = true;
      orig.apply(this, arguments);
      if (wasFirst) {
        // Always set on first submit
        state.first_action_assigned = true;
        if (typeof showDemoToast === 'function') {
          // The orig already shows a toast; we add a follow-up after a small delay
          setTimeout(function(){
            showDemoToast('Action assigned — monitoring begins after implementation. Verified Savings appear here after the monitoring window if guardrails hold.', 'blue');
          }, 900);
        }
      }
    };
    window._skcTrustSubmitCAPatched = true;
  }

  function resetWalkthrough(){
    state.first_action_assigned = false;
    if (typeof showDemoToast === 'function') showDemoToast('First-action walkthrough reset · Open Assign Recovery Action to see it', 'blue');
  }

  // ── (Fix 3) Rejection flow ──────────────────────────────
  // Drawer injection: add "Reject recommendation" button next to Create Action,
  // and an inline reject panel inside the drawer body.
  function injectRejectControls(){
    var drawer = document.getElementById('evDrawer');
    if (!drawer) return;

    // Find the "Create Action" button container — it lives inside .ev-cta-btns
    var ctaGroup = drawer.querySelector('.ev-cta-btns');
    if (ctaGroup && !ctaGroup.querySelector('.skc-tr-reject-trigger')) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-ghost btn-sm skc-tr-reject-trigger';
      btn.textContent = 'Reject recommendation';
      btn.onclick = openRejectPanel;
      ctaGroup.appendChild(btn);
    }

    // Create reject panel inside drawer body if not present
    var body = document.getElementById('evDrawerBody');
    if (!body) return;
    if (body.querySelector('#skc-tr-reject-panel')) return;
    var panel = document.createElement('div');
    panel.id = 'skc-tr-reject-panel';
    panel.className = 'skc-tr-reject-panel';
    panel.innerHTML =
      '<div class="skc-tr-reject-h">Why is this recommendation wrong?</div>' +
      '<div class="skc-tr-reject-sub">Your feedback adjusts how SKC ranks similar detections for your operation. It does not delete the underlying signal.</div>' +
      '<div class="skc-tr-reject-opts">' +
        '<label class="skc-tr-reject-opt"><input type="radio" name="skc-tr-reject-reason" value="data_wrong"><span class="skc-tr-reject-opt-label"><strong>The data is wrong</strong><span>e.g., that wasn\'t overstaffing — we had a private event.</span></span></label>' +
        '<label class="skc-tr-reject-opt"><input type="radio" name="skc-tr-reject-reason" value="wrong_action"><span class="skc-tr-reject-opt-label"><strong>The recommendation is the wrong action</strong><span>SKC identified the issue but the suggested fix doesn\'t match how we operate.</span></span></label>' +
        '<label class="skc-tr-reject-opt"><input type="radio" name="skc-tr-reject-reason" value="wrong_context"><span class="skc-tr-reject-opt-label"><strong>The timing or context is wrong</strong><span>Right idea, wrong day, daypart, or location.</span></span></label>' +
        '<label class="skc-tr-reject-opt"><input type="radio" name="skc-tr-reject-reason" value="unrealistic_impact"><span class="skc-tr-reject-opt-label"><strong>The expected impact is unrealistic</strong><span>The dollar value doesn\'t reflect what\'s actually recoverable here.</span></span></label>' +
        '<label class="skc-tr-reject-opt"><input type="radio" name="skc-tr-reject-reason" value="other"><span class="skc-tr-reject-opt-label"><strong>Other</strong><span>Tell SKC what doesn\'t fit.</span></span></label>' +
      '</div>' +
      '<textarea class="skc-tr-reject-textarea" id="skc-tr-reject-text" placeholder="Add context (optional)…"></textarea>' +
      '<div class="skc-tr-reject-note">This feedback adjusts SKC\'s ranking for your operation only. The underlying detection signal is preserved.</div>' +
      '<div class="skc-tr-reject-foot">' +
        '<button type="button" class="btn btn-ghost btn-sm" onclick="SKC_TRUST.closeRejectPanel()">Cancel</button>' +
        '<button type="button" class="btn btn-secondary btn-sm" onclick="SKC_TRUST.submitReject()">Reject and record reason</button>' +
      '</div>';
    body.appendChild(panel);
  }

  function openRejectPanel(){
    var p = document.getElementById('skc-tr-reject-panel');
    if (p) { p.classList.add('skc-tr-open'); p.scrollIntoView({behavior:'smooth', block:'end'}); }
  }
  function closeRejectPanel(){
    var p = document.getElementById('skc-tr-reject-panel');
    if (p) p.classList.remove('skc-tr-open');
  }
  function submitReject(){
    var reasonInput = document.querySelector('input[name="skc-tr-reject-reason"]:checked');
    if (!reasonInput) {
      if (typeof showDemoToast === 'function') showDemoToast('Select a reason before recording the rejection', 'amber');
      return;
    }
    var reason = reasonInput.value;
    var reasonLabel = reasonInput.closest('.skc-tr-reject-opt').querySelector('strong').textContent;
    var freeText = (document.getElementById('skc-tr-reject-text') || {}).value || '';

    // Resolve current leak key — first try tracked key, then fall back to title parse
    var leakKey = api._currentEvKey || null;
    var title = (document.getElementById('evDrawerTitle') || {}).textContent || '';
    if (!leakKey) {
      leakKey = title.toLowerCase().includes('overstaff') ? 'leak1'
              : title.toLowerCase().includes('salmon')    ? 'leak2'
              : title.toLowerCase().includes('ticket')    ? 'leak3'
              : 'leak1';
    }
    // Normalize OPP-* / category aliases to leak* keys
    if (leakKey === 'OPP-001' || leakKey === 'labor')      leakKey = 'leak1';
    if (leakKey === 'OPP-002' || leakKey === 'salmon')     leakKey = 'leak2';
    if (leakKey === 'OPP-003' || leakKey === 'throughput') leakKey = 'leak3';
    var loc = title.split('·').pop().trim() || 'this location';

    state.rejections[leakKey] = { reason, reasonLabel, freeText, ts: Date.now(), location: loc };
    closeRejectPanel();
    if (typeof closeEvDrawer === 'function') closeEvDrawer();
    if (typeof showDemoToast === 'function') {
      showDemoToast('Recommendation rejected · SKC will deprioritize similar detections for ' + loc + ' for 30 days', 'amber');
    }

    // Visual rejected state on Profit Recovery card
    markCardRejected(leakKey, reasonLabel);
  }
  function markCardRejected(leakKey, reasonLabel){
    // Find the pr-opp-card whose onclick references this leak
    var cards = document.querySelectorAll('.pr-opp-card');
    cards.forEach(function(card){
      var oc = card.getAttribute('onclick') || '';
      if (oc.indexOf(leakKey) === -1) return;
      // Apply visual rejected state
      card.style.opacity = '0.55';
      card.style.filter = 'grayscale(0.4)';
      // Add badge once
      if (!card.querySelector('.skc-tr-rejected-badge')) {
        var titleEl = card.querySelector('.pr-opp-title');
        if (titleEl) {
          var badge = document.createElement('span');
          badge.className = 'skc-tr-rejected-badge';
          badge.textContent = 'Rejected · ' + reasonLabel;
          titleEl.appendChild(badge);
        }
      }
    });
  }
  function resetRejections(){
    state.rejections = {};
    // Restore cards
    var cards = document.querySelectorAll('.pr-opp-card');
    cards.forEach(function(card){
      card.style.opacity = '';
      card.style.filter  = '';
      var badge = card.querySelector('.skc-tr-rejected-badge');
      if (badge) badge.remove();
    });
    if (typeof showDemoToast === 'function') showDemoToast('Rejections cleared · cards restored', 'blue');
  }

  function patchOpenEvDrawer(){
    if (typeof window.openEvDrawer !== 'function') return;
    if (window._skcTrustOpenEvPatched) return;
    var orig = window.openEvDrawer;
    window.openEvDrawer = function(key){
      api._currentEvKey = key;   // track for rejection wire-up
      orig.apply(this, arguments);
      setTimeout(function(){
        injectRejectControls();
        injectReasoningGraph(key);   // Fix 5
      }, 20);
    };
    window._skcTrustOpenEvPatched = true;
  }

  // ── (Fix 5) Reasoning graph ─────────────────────────────
  // All numbers below are pulled from existing demo copy (OPP-001/002/003).
  // No invented figures.
  // ── (v26 · Fix 6) Reasoning graphs — statistical disclosure ─
  // Each node now declares either statistical_basis (the actual test or comparison
  // backing it) or is_heuristic:true (asserted, not measured). The renderer surfaces
  // this so the customer can see which nodes are tested and which are reasoned.
  // Throughput numbers corrected to match OPPORTUNITIES.throughput canonical data
  // (14.2 / 11.8 / ~$356/wk) — earlier graph used 14.8 / 11.5 / $354 inconsistently.
  var REASONING_GRAPHS = {
    leak1: {
      mode_note: null,
      disclaimer: 'This is a reasoning chain, not a causal proof. Each node shows whether the claim is statistically tested or heuristic.',
      nodes: [
        { claim: 'Covers down ~12% on Tuesday + Wednesday dinner across the last 6 weeks running.',                              source: 'Toast covers data · 6 weeks of comparable dine-in services',                conf: 'high',   statistical_basis: 'Welch\'s t-test: current 6-week mean (87 covers) vs prior 8-week mean (98 covers), p < 0.01.', is_heuristic: false },
        { claim: 'Schedule template still set to the high-cover baseline from March (post-catering event).',                     source: '7shifts schedule history vs current cover pattern',                          conf: 'medium', statistical_basis: null, is_heuristic: true,  heuristic_note: 'Asserted from schedule audit, not a statistical inference. Schedule unchanged since March 14; covers normalised April 1.' },
        { claim: 'Result: ~5 excess server hours running on every Tuesday + Wednesday dinner service.',                          source: 'Scheduled hours minus demand-justified hours at current covers',              conf: 'medium', statistical_basis: null, is_heuristic: true,  heuristic_note: 'Derived from a single hours-per-cover ratio (0.253) and a 1-hour manager-coverage buffer. The ratio is heuristic, not measured against same-week productivity.' },
        { claim: 'Financial impact: 5 hrs × $37 fully loaded = $185 / service · 2 services/wk · 2 locations.',                   source: 'Wage data (7shifts · stale 18h) + service count',                            conf: 'medium', statistical_basis: 'Arithmetic: 5 × 37 × 2 × 2 × 4.33. Wage figure is a deterministic blend from payroll.', is_heuristic: false },
        { claim: 'Conclusion: ~$740/wk weekly exposure · ~$3,200/mo estimated portfolio run-rate.',                              source: 'SKC labor model · NOT verified · NOT counted in ROI',                         conf: 'medium', statistical_basis: null, is_heuristic: true,  heuristic_note: 'Run-rate projection. Held as exposure until monitoring window closes clean. Not counted toward ROI.' },
      ],
    },
    leak2: {
      mode_note: null,
      disclaimer: 'This is a reasoning chain, not a causal proof. Each node shows whether the claim is statistically tested or heuristic.',
      nodes: [
        { claim: 'Grilled Salmon contribution margin has dropped over the last 8 weeks.',                                        source: 'Toast menu sales mix · recipe-cost calculation',                              conf: 'high',   statistical_basis: 'Direct CM% comparison: 8-week current avg (38.2%) vs 12-week prior avg (61.2%), gap > 20 pts sustained.', is_heuristic: false },
        { claim: 'Associated factor: ingredient cost has risen while menu price has not been adjusted.',                            source: 'Recipe cost file (last upload 18d ago) vs current Toast menu price',          conf: 'medium', statistical_basis: null, is_heuristic: true,  heuristic_note: 'Causal attribution. Recipe cost file is 18d stale — the inference is reasonable but not statistically tested against alternative causes (mix shift, portion drift).' },
        { claim: 'Comparable peers in the daypart have repriced — your salmon is now below market.',                             source: 'Industry benchmark range for casual-dinner entrées',                          conf: 'low',    statistical_basis: null, is_heuristic: true,  heuristic_note: 'Industry-comparable assertion, no specific peer data. Treated as supporting context only.' },
        { claim: 'Repricing $24 → $27 restores CM% to baseline at current volume.',                                              source: 'Menu mix sensitivity at projected volume retention',                          conf: 'medium', statistical_basis: null, is_heuristic: true,  heuristic_note: 'Volume retention is assumed at 85%, not measured. The volume-retention model in the Calculation Trail surfaces the breakeven so the operator can stress-test the assumption.' },
        { claim: 'Estimated weekly opportunity ~$485/wk · ~$2,100/mo run-rate · NOT counted in ROI.',                            source: 'Volume × margin recovery model · estimated · not verified',                   conf: 'medium', statistical_basis: null, is_heuristic: true,  heuristic_note: 'Run-rate projection at 85% retention. Not a counted savings amount.' },
      ],
    },
    leak3: {
      mode_note: 'KDS data is partial · stage-level breakdown is limited. This graph uses aggregate ticket time only. The whole chain is observation + heuristic until station-level root cause is identified.',
      disclaimer: 'This is a reasoning chain, not a causal proof. Each node shows whether the claim is statistically tested or heuristic.',
      nodes: [
        { claim: 'Ticket time on Friday lunch at Berkeley is averaging 14.2 min vs 11.8 min baseline.',                          source: 'Toast KDS aggregate ticket time · 5 of last 8 services',                      conf: 'medium', statistical_basis: 'Mean comparison: 5-service current mean (14.2 min) vs 8-week baseline (11.8 min). +2.4 min sustained across 5 of 5 most recent Fridays.', is_heuristic: false },
        { claim: 'Pattern is concentrated in the 12:15–1:00 PM peak window.',                                                    source: 'Toast KDS · per-hour aggregation',                                            conf: 'medium', statistical_basis: null, is_heuristic: true,  heuristic_note: 'Pattern observation, not a station-level isolation. Per-station KDS is unavailable on this account.' },
        { claim: 'Root cause is not yet identified — could be grill, expo, or pickup.',                                          source: 'Station-level KDS data unavailable · on-site observation required',           conf: 'low',    statistical_basis: null, is_heuristic: true,  heuristic_note: 'Open question. Without station-level KDS, this stays a hypothesis until the 15-min line review confirms or rules out each station.' },
        { claim: 'Without root cause, automated correction is blocked. A 15-min line review is the safe first step.',            source: 'SKC platform rule — no FOH action created before bottleneck stage is identified', conf: 'high',   statistical_basis: null, is_heuristic: true,  heuristic_note: 'Platform safety rule, deterministic but not a measurement. SKC will not propose front-of-house action when the inferred bottleneck is in the kitchen.' },
        { claim: 'Estimated weekly opportunity ~$356/wk · ~$1,540/mo run-rate · NOT counted in ROI.',                            source: 'Throughput exposure model · estimated · not verified',                       conf: 'low',    statistical_basis: null, is_heuristic: true,  heuristic_note: 'Exposure estimate, not actionable until root cause identified. Seat-based reconciliation in the Calculation Trail surfaces the gap between the headline figure and the capacity-capped model.' },
      ],
    },
  };

  function injectReasoningGraph(key){
    var graph = REASONING_GRAPHS[key];
    if (!graph) return;
    var body = document.getElementById('evDrawerBody');
    if (!body) return;
    // Avoid double-inject — remove any previous reasoning section
    var existing = body.querySelector('.skc-tr-rgraph-section');
    if (existing) existing.remove();

    var section = document.createElement('div');
    section.className = 'ev-sec skc-tr-rgraph-section';
    section.innerHTML =
      '<div class="ev-sec-hd" onclick="toggleEvSection(this)">' +
        '<span class="ev-sec-num done">★</span>' +
        '<span class="ev-sec-label">Why this was flagged</span>' +
        '<span class="ev-sec-caret open">▾</span>' +
      '</div>' +
      '<div class="ev-sec-body open">' +
        // (v26 · Fix 6) Disclaimer at top of every reasoning graph
        (graph.disclaimer ? '<div class="skc-tr-rg-disclaimer">' + escapeHtml(graph.disclaimer) + '</div>' : '') +
        (graph.mode_note ? '<div class="skc-tr-rg-mode-note">' + escapeHtml(graph.mode_note) + '</div>' : '') +
        '<div class="skc-tr-rgraph">' +
          graph.nodes.map(function(n, i){
            var cls = n.conf === 'high' ? 'skc-tr-rg-conf-high' : n.conf === 'medium' ? 'skc-tr-rg-conf-med' : 'skc-tr-rg-conf-low';
            // (v26 · Fix 6) Heuristic nodes get an extra class for visual distinction
            var nodeCls = 'skc-tr-rg-node' + (n.is_heuristic ? ' skc-tr-rg-node-heuristic' : '');
            // Build the test/heuristic line
            var basisLine;
            if (n.is_heuristic) {
              basisLine = '<div class="skc-tr-rg-basis skc-tr-rg-basis-heuristic"><em>Heuristic — not statistically tested.' +
                (n.heuristic_note ? ' ' + escapeHtml(n.heuristic_note) : '') + '</em></div>';
            } else if (n.statistical_basis) {
              basisLine = '<div class="skc-tr-rg-basis skc-tr-rg-basis-stat"><em>Test: ' + escapeHtml(n.statistical_basis) + '</em></div>';
            } else {
              basisLine = '';
            }
            return '<div class="' + nodeCls + '" data-step="' + (i + 1) + '">' +
              '<div class="skc-tr-rg-claim">' + escapeHtml(n.claim) + '</div>' +
              '<div class="skc-tr-rg-meta">' +
                '<span class="skc-tr-rg-source">From: ' + escapeHtml(n.source) + '</span>' +
                '<span class="skc-tr-rg-conf ' + cls + '">' + escapeHtml(n.conf) + ' confidence</span>' +
              '</div>' +
              basisLine +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>';

    // Insert AFTER Source Data section. Find the section whose label is "Source Data".
    var allSections = body.querySelectorAll('.ev-sec');
    var sourceDataSection = null;
    allSections.forEach(function(sec){
      var labelEl = sec.querySelector('.ev-sec-label');
      if (labelEl && /Source Data/i.test(labelEl.textContent)) sourceDataSection = sec;
    });
    if (sourceDataSection && sourceDataSection.nextSibling) {
      body.insertBefore(section, sourceDataSection.nextSibling);
    } else if (sourceDataSection) {
      // Source Data is last child — append
      body.appendChild(section);
    } else {
      // Fallback: prepend so it's at least visible
      body.insertBefore(section, body.firstChild);
    }
  }

  // ── Render-all ──────────────────────────────────────────
  function renderAll(){
    renderDqBanner();
    renderDqFailureCards();
    renderOnboarding();
  }

  // ── QA debug actions (called from extended qa() switch) ─
  function qaDebug(action){
    switch (action) {
      case 'ob-day-0':   setOnboardingDay(0); break;
      case 'ob-day-7':   setOnboardingDay(7); break;
      case 'ob-day-14':  setOnboardingDay(14); break;
      case 'walkthrough-reset': resetWalkthrough(); break;
      case 'dq-healthy':
        state.dq_demo_state = 'all_healthy';
        renderAll();
        if (typeof showDemoToast === 'function') showDemoToast('DQ: All sources healthy', 'green');
        break;
      case 'dq-toast-down':
        state.dq_demo_state = 'toast_down';
        renderAll();
        if (typeof showDemoToast === 'function') showDemoToast('DQ: Toast disconnected · detection paused', 'red');
        break;
      case 'dq-shifts-stale':
        state.dq_demo_state = 'shifts_stale';
        renderAll();
        if (typeof showDemoToast === 'function') showDemoToast('DQ: 7shifts token stale · labor confidence reduced', 'amber');
        break;
      case 'dq-recipe-stale':
        state.dq_demo_state = 'recipe_stale';
        renderAll();
        if (typeof showDemoToast === 'function') showDemoToast('DQ: Recipe cost file stale · menu confidence reduced', 'amber');
        break;
      case 'rejections-reset':
        resetRejections();
        break;
    }
  }

  // ── Utilities ───────────────────────────────────────────
  function escapeHtml(s){
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  }

  // ── Public surface ──────────────────────────────────────
  var api = {
    state: state,
    setOnboardingDay: setOnboardingDay,
    resetWalkthrough: resetWalkthrough,
    simulateReconnect: simulateReconnect,
    simulateRecipeUpload: simulateRecipeUpload,
    submitReject: submitReject,
    closeRejectPanel: closeRejectPanel,
    resetRejections: resetRejections,
    qaDebug: qaDebug,
    renderAll: renderAll,
  };

  // ── Init ────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function(){
    patchOpenCA();
    patchSubmitCA();
    patchOpenEvDrawer();
    renderAll();
  });

  return api;
})();

