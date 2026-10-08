/**
 * example.js — regenerates every slide archetype of the original deck style.
 * Run:  node example.js
 * Out:  ./Deep-Indigo-Style-Reference.pptx
 *
 * Copy this file, replace the content, keep the helpers. That is the workflow.
 */
const { build, C, M, CW } = require('./theme');
const K = build();
const { deck } = K;

/* 1 ── title slide ------------------------------------------------------- */
K.titleSlide({
  kicker: 'FINAL YEAR PROJECT',
  title: 'Optimized Energy Management system for PV-grid system',
  people: [
    'Group - 18',
    'Abhijit Goswami - 230610003004',
    'Bijuban Deka - 230610003024',
    'Arihant Malu - 230610003014',
    'Joysheel Borah - 230610003046',
  ],
  mentor: 'Mentor: Mrs. Priyakshi Shyam, Assistant Professor (EE)',
});

/* 2 ── dark body panels -------------------------------------------------- */
K.slide();
K.title('PV-BATTERY GRID-CONNECTED SYSTEM');
K.panel([
  {
    text:
      'The system consists of a solar photovoltaic (PV) generation unit integrated with ' +
      'a battery energy storage system (BESS) and connected to the utility grid.',
  },
  {
    text:
      'The PV system supplies the local load, while excess generation is stored in the ' +
      'battery. When PV generation and available battery energy are insufficient, power ' +
      'is imported from the grid.',
  },
]);
K.panel(
  [
    {
      head: 'PHASE 3',
      text: 'Add the cost of battery wear to the plan, so we save money without overworking the battery.',
    },
    {
      head: 'PHASE 4',
      text: 'Compare all methods on cost and battery life, on sunny and cloudy days and with different tariffs.',
    },
  ],
  { y: 6.1, h: 3.6 },
);

/* 3 ── figure + commentary panel (the workhorse layout) ------------------ */
K.slide();
K.title('Daily Dispatch - Sunny Day');
K.figure('assets/dispatch.png', M, 1.914, 7.571, 8.3);
K.commentary([
  { label: 'Baseline:  ', text: 'No battery. The midday PV surplus is exported at the low solar-slot rate.' },
  { label: 'Heuristic:  ', text: 'Charges from ~9 h to ~13 h, exports once full, then discharges 15 h to 20 h.' },
  { label: 'LP:  ', text: 'Charges in short midday pulses, then discharges from ~17 h into the night.' },
]);
K.caption('Sunny day, 24-hour dispatch.', M, 10.3, 7.5);

/* 4 ── stat row + commentary --------------------------------------------- */
K.slide();
K.title('Savings Comparison');
K.figure('assets/dispatch.png', M, 1.914, 7.571, 8.3);
K.stat('Rs 12.89', 'Baseline', 9.569, 1.914);
K.stat('Rs 7.20', 'Heuristic EMS', 12.741, 1.914);
K.stat('Rs 5.85', 'LP EMS', 15.912, 1.914, { dark: true });
K.commentary(
  [
    { label: 'Sunny:  ', text: 'LP saves Rs 7.04/day over baseline — about Rs 211 per month.' },
    { label: 'Cloudy:  ', text: 'The advantage narrows to Rs 10.87/day, about Rs 326 per month.' },
  ],
  { y: 4.046, h: 5.2 },
);

/* 5 ── your own plot (image) + compare stack ------------------------------ */
K.slide();
K.title('Cost: Sunny vs Cloudy');
K.figure('assets/cost.png', M, 2.078, 12.4, 7.6);
K.caption('Monthly household bill by method, sunny day.', M, 9.85, 12.4);
K.compare('LP vs baseline', [{ v: '55%', l: 'sunny' }, { v: '38%', l: 'cloudy' }], 14.217, 2.078, { dark: true });
K.compare('LP vs heuristic', [{ v: '19%', l: 'sunny' }, { v: '26%', l: 'cloudy' }], 14.217, 4.867);
K.compare('Heuristic vs baseline', [{ v: '44%', l: 'sunny' }, { v: '17%', l: 'cloudy' }], 14.217, 7.655);

/* 6 ── phase card grid + takeaway ---------------------------------------- */
K.slide();
K.title('FUTURE SCOPE');
K.phaseCard('PHASE 3', 'Battery-friendly EMS', 'Add the cost of battery wear to the plan, so we save money without overworking the battery.', 1.125, 2.187);
K.phaseCard('PHASE 4', 'Compare everything', 'Compare all methods on cost and battery life, on sunny and cloudy days and with different tariffs.', 5.65, 2.187);
K.phaseCard('PHASE 5', 'Real-time control', 'Re-plan every 15 minutes using real campus meter data and solar forecasts.', 10.175, 2.187);
K.phaseCard('PHASE 6', 'Live dashboard', 'Build an app with sliders and live graphs to show the system working in the final demo.', 14.699, 2.187);
K.takeaway('Goal: lower electricity bills while keeping the battery healthy for longer.');

/* 7 ── data table --------------------------------------------------------- */
K.slide();
K.title('Savings Comparison');
K.table(
  [
    { w: 2.52, head: 'Scenario' },
    { w: 3.61, head: 'Method' },
    { w: 2.84, head: 'Daily cost (Rs)' },
    { w: 3.61, head: 'Saving vs baseline (Rs/day)' },
    { w: 2.19, head: 'Saving (%)' },
    { w: 2.95, head: 'Monthly saving (Rs)' },
  ],
  [
    ['Sunny', 'Baseline (no battery)', '12.89', '-', '-', '-'],
    ['', 'Heuristic EMS', '7.20', '5.69', '44%', '171'],
    ['', 'LP EMS', '5.85', '7.04', '55%', '211'],
    ['Cloudy', 'Baseline (no battery)', '28.30', '-', '-', '-'],
    ['', 'Heuristic EMS', '23.60', '4.70', '17%', '141'],
    ['', 'LP EMS', '17.43', '10.87', '38%', '326'],
  ],
  { y: 2.0, rowH: 0.85, highlight: { row: 2, col: 4 } },
);
K.takeaway('LP saves 55% on sunny and 38% on cloudy days.', { y: 9.1, h: 1.2 });

/* 8 ── closing ------------------------------------------------------------ */
K.closing();

deck.writeFile({ fileName: 'Deep-Indigo-Style-Reference.pptx' }).then((f) => console.log('wrote', f));