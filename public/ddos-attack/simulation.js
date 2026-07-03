/**
 * LUCID DDoS Detection Simulator — simulation.js
 * Handles: attack config UI, packet animation, live metrics, Chart.js timeline
 * Data sourced from the NYIT Vancouver evaluation paper (2024)
 */

// ============================================================
// 1. METRICS DATA (from paper tables)
// ============================================================
const METRICS = {
  tcp: {
    old:  { acc: 0.0041, f1: 0.0039, tpr: 0.0041, fpr: 0.05 },
    new:  { acc: 0.8161, f1: 0.8943, tpr: 0.8161, fpr: 0.12 },
    new5t:{ acc: 0.9593, f1: 0.9783, tpr: 0.9593, fpr: 0.04 }
  },
  udp: {
    old:  { acc: 1.000,  f1: 1.000,  tpr: 1.000,  fpr: 0.00 },
    new:  { acc: 1.000,  f1: 1.000,  tpr: 1.000,  fpr: 0.00 },
    new5t:{ acc: 0.7639, f1: 0.8571, tpr: 0.7639, fpr: 0.18 }
  },
  get: {
    old:  { acc: 0.0984, f1: 0.0779, tpr: 0.0984, fpr: 0.45 },
    new:  { acc: 0.8063, f1: 0.8887, tpr: 0.8063, fpr: 0.14 },
    new5t:{ acc: 0.8603, f1: 0.9191, tpr: 0.8603, fpr: 0.11 }
  },
  all: {
    old:  { acc: 0.35,   f1: 0.36,   tpr: 0.35,   fpr: 0.20 },
    new:  { acc: 0.874,  f1: 0.921,  tpr: 0.874,  fpr: 0.10 },
    new5t:{ acc: 0.912,  f1: 0.951,  tpr: 0.912,  fpr: 0.06 }
  }
};

// SVG coordinates for packet animation [sourceNode → router]
const NODE_COORDS = {
  b1:     { x: 112, y: 70 },
  b2:     { x: 112, y: 155 },
  b3:     { x: 112, y: 240 },
  router: { x: 280, y: 155 },
  victim: { x: 443, y: 100 },
  lucid:  { x: 443, y: 214 }
};

const PKT_COLORS = {
  tcp: '#ff4444',
  udp: '#ff8800',
  get: '#3399ff',
  all: '#ff4444'
};

// ============================================================
// 2. STATE
// ============================================================
let simTimer    = null;
let running     = false;
let elapsed     = 0;
let totalPkts   = 0;
let ddosPkts    = 0;
let windowCount = 0;
let portCounts  = { http: 0, udp: 0, tcp: 0 };
let timelineChart = null;
let timelineData  = [];
let statusInterval = null;

// ============================================================
// 3. UI — Slider & segmented control setup
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  setupSlider('threads-slider', 'threads-disp');
  setupSlider('dur-slider',     'dur-disp');
  setupSegCtrl();
  updateCmd();
  initTimelineChart();
});

function setupSlider(sliderId, dispId) {
  const s = document.getElementById(sliderId);
  const d = document.getElementById(dispId);
  if (!s || !d) return;
  s.addEventListener('input', () => {
    d.textContent = s.value;
    updateCmd();
  });
}

function setupSegCtrl() {
  document.querySelectorAll('.seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateCmd();
    });
  });
  document.getElementById('model-sel').addEventListener('change', updateCmd);
}

function getAtk()    { return document.querySelector('.seg-btn.active')?.dataset.val || 'tcp'; }
function getThreads(){ return parseInt(document.getElementById('threads-slider').value); }
function getDur()    { return parseInt(document.getElementById('dur-slider').value); }
function getModel()  { return document.getElementById('model-sel').value; }

function updateCmd() {
  const atk     = getAtk();
  const threads = getThreads();
  const dur     = getDur();
  const el      = document.getElementById('cmd-text');
  if (!el) return;

  let cmds = [];
  if (atk === 'tcp' || atk === 'all')
    cmds.push(`python3 start.py tcp 192.168.1.78:9000 ${threads} ${dur}`);
  if (atk === 'udp' || atk === 'all')
    cmds.push(`python3 start.py udp 192.168.1.78:7000 ${threads} ${dur}`);
  if (atk === 'get' || atk === 'all')
    cmds.push(`python3 start.py GET 192.168.1.78:8080 1 ${threads} http.txt 200 ${dur}`);

  el.textContent = cmds.join('\n');
}

// ============================================================
// 4. CHART
// ============================================================
function initTimelineChart() {
  if (timelineChart) timelineChart.destroy();
  const ctx = document.getElementById('timeline-chart');
  if (!ctx) return;
  timelineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Total pkts',
          data: [],
          borderColor: '#3399ff',
          backgroundColor: 'rgba(51,153,255,0.08)',
          fill: true,
          tension: 0.35,
          pointRadius: 2,
          borderDash: []
        },
        {
          label: 'DDoS pkts',
          data: [],
          borderColor: '#ff4444',
          backgroundColor: 'rgba(255,68,68,0.08)',
          fill: true,
          tension: 0.35,
          pointRadius: 2,
          borderDash: [4, 2]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 0 },
      plugins: { legend: { display: false } },
      scales: {
        x: {
          display: true,
          ticks: { font: { size: 9, family: 'JetBrains Mono' }, color: '#3a4f60', maxRotation: 0 }
        },
        y: {
          display: true,
          ticks: { font: { size: 9, family: 'JetBrains Mono' }, color: '#3a4f60' }
        }
      }
    }
  });
}

function pushChartPoint(total, ddos, t) {
  if (!timelineChart) return;
  const label = `${t}s`;
  timelineChart.data.labels.push(label);
  timelineChart.data.datasets[0].data.push(total);
  timelineChart.data.datasets[1].data.push(ddos);
  if (timelineChart.data.labels.length > 25) {
    timelineChart.data.labels.shift();
    timelineChart.data.datasets[0].data.shift();
    timelineChart.data.datasets[1].data.shift();
  }
  timelineChart.update('none');
}

// ============================================================
// 5. PACKET ANIMATION (SVG)
// ============================================================
function spawnPacket(fromKey, toKey, color) {
  const svg = document.getElementById('packets-layer');
  if (!svg) return;
  const from = NODE_COORDS[fromKey];
  const to   = NODE_COORDS[toKey];
  if (!from || !to) return;

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('r', '4');
  circle.setAttribute('cx', from.x);
  circle.setAttribute('cy', from.y);
  circle.setAttribute('fill', color || '#ff4444');
  circle.setAttribute('opacity', '0.9');
  svg.appendChild(circle);

  const dur = 600 + Math.random() * 200;
  let start = null;

  function step(ts) {
    if (!start) start = ts;
    const p = Math.min(1, (ts - start) / dur);
    const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
    circle.setAttribute('cx', from.x + (to.x - from.x) * ease);
    circle.setAttribute('cy', from.y + (to.y - from.y) * ease);
    if (p < 1) {
      requestAnimationFrame(step);
    } else {
      circle.remove();
    }
  }
  requestAnimationFrame(step);
}

function flashNode(id, cls) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 500);
}

// ============================================================
// 6. LOG
// ============================================================
function log(msg, type = 'info') {
  const box = document.getElementById('log-box');
  if (!box) return;
  const now = new Date();
  const ts  = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
  const div = document.createElement('div');
  div.className = `log-entry ${type}`;
  div.textContent = `[${ts}]  ${msg}`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  // Keep log lean
  while (box.children.length > 120) box.removeChild(box.firstChild);
}

function clearLog() {
  const box = document.getElementById('log-box');
  if (box) box.innerHTML = '';
}

// ============================================================
// 7. METRICS DISPLAY
// ============================================================
function setBar(id, val, max) {
  const pct  = Math.min(100, Math.round((val / max) * 100));
  const fill = document.getElementById('bar-' + id);
  const valEl= document.getElementById('val-' + id);
  if (fill) fill.style.width = pct + '%';
  if (valEl) valEl.textContent = (val * 100).toFixed(1) + '%';
}

function updateMetricsDisplay() {
  const atk   = getAtk();
  const model = getModel();
  const m     = METRICS[atk][model];
  const ddosPct = ddosPkts / Math.max(1, totalPkts);

  // Top strip
  setText('ms-pkts', totalPkts.toLocaleString());
  setText('ms-ddos', ddosPkts.toLocaleString());
  setText('ms-acc',  m ? (m.acc * 100).toFixed(1) + '%' : '—');
  setText('ms-f1',   m ? (m.f1  * 100).toFixed(1) + '%' : '—');
  const threshold = Math.round(totalPkts * ddosPct);
  setText('ms-thr',  threshold);

  if (!m) return;

  // Right panel bars
  setBar('acc', m.acc, 1);
  setBar('f1',  m.f1,  1);
  setBar('tpr', m.tpr, 1);
  setBar('fpr', m.fpr, 1);
  setBar('ddos', ddosPct, 1);

  // Threshold trigger
  const triggered = ddosPct > 0.67 || threshold >= 200;
  const thr = document.getElementById('thr-status');
  if (thr) {
    thr.textContent = triggered ? 'TRIGGERED' : 'INACTIVE';
    thr.className   = 'thr-status ' + (triggered ? 'triggered' : 'inactive');
  }
  return { triggered, threshold, ddosPct };
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ============================================================
// 8. SIMULATION CORE
// ============================================================
function startSim() {
  if (running) return;
  running     = true;
  elapsed     = 0;
  totalPkts   = 0;
  ddosPkts    = 0;
  windowCount = 0;
  portCounts  = { http: 0, udp: 0, tcp: 0 };
  timelineData = [];

  // Reset chart
  initTimelineChart();

  const atk     = getAtk();
  const threads = getThreads();
  const dur     = getDur();
  const model   = getModel();

  // UI state
  document.getElementById('btn-launch').disabled = true;
  document.getElementById('btn-stop').disabled   = false;
  setStatusDot('active');
  setText('status-text', 'Attack running');
  setText('status-time', 'T+0s');

  // Log launch
  log(`Botnet initialised · attack=${atk.toUpperCase()} · threads=${threads} · duration=${dur}s`, 'info');
  if (atk === 'tcp' || atk === 'all')
    log(`BOT01 → python3 start.py tcp 192.168.1.78:9000 ${threads} ${dur}`, 'atk');
  if (atk === 'udp' || atk === 'all')
    log(`BOT02 → python3 start.py udp 192.168.1.78:7000 ${threads} ${dur}`, 'atk');
  if (atk === 'get' || atk === 'all')
    log(`BOT03 → python3 start.py GET 192.168.1.78:8080 1 ${threads} http.txt 200 ${dur}`, 'atk');
  log(`LUCID IDS listening on en1 · model=${model} · window=10s`, 'det');

  const pps = threads * 38 + (atk === 'all' ? 70 : 0);

  simTimer = setInterval(() => {
    if (!running) return;
    elapsed++;
    setText('status-time', `T+${elapsed}s`);

    // Packet burst with slight randomness
    const burst    = Math.round(pps * (0.75 + Math.random() * 0.5));
    const ddosFrac = 0.82 + Math.random() * 0.12;
    const newDdos  = Math.round(burst * ddosFrac);

    totalPkts += burst;
    ddosPkts  += newDdos;

    // Update port counters
    if (atk === 'tcp' || atk === 'all') portCounts.tcp  += Math.round(burst * (atk === 'all' ? 0.36 : 1));
    if (atk === 'udp' || atk === 'all') portCounts.udp  += Math.round(burst * (atk === 'all' ? 0.36 : 1));
    if (atk === 'get' || atk === 'all') portCounts.http += Math.round(burst * (atk === 'all' ? 0.28 : 1));

    // Chart push
    pushChartPoint(burst, newDdos, elapsed);

    // Packet animations
    animateAttack(atk);

    // Flash nodes
    flashNode('node-victim', 'lit-red');
    flashNode('node-lucid',  'lit-green');

    // LUCID window report every 10s
    if (elapsed % 10 === 0) {
      windowCount++;
      const ddosPct = ddosPkts / Math.max(1, totalPkts);
      const m = METRICS[atk][model];
      const thr = Math.round(totalPkts * ddosPct);
      log(`[LUCID window #${windowCount}] pkts=${burst} · DDoS%=${(ddosPct*100).toFixed(1)}% · ACC=${(m.acc*100).toFixed(1)}% · F1=${(m.f1*100).toFixed(1)}%`, 'det');
      if (ddosPct > 0.67 || thr >= 200) {
        log(`⚠ ALERT — threshold breached (${thr}/200). Posting to management service...`, 'warn');
        log(`Management: HTTP server shutting down on port 8080. Migrating...`, 'warn');
      }
    }

    // Update all metric displays
    updateMetricsDisplay();

    // Auto-stop
    if (elapsed >= dur) stopSim();
  }, 1000);
}

function stopSim() {
  running = false;
  clearInterval(simTimer);

  document.getElementById('btn-launch').disabled = false;
  document.getElementById('btn-stop').disabled   = true;
  setStatusDot('done');
  setText('status-text', 'Simulation complete');

  const atk   = getAtk();
  const model = getModel();
  const m     = METRICS[atk][model];
  log(`Simulation ended at T+${elapsed}s · final pkts=${totalPkts.toLocaleString()} · ACC=${(m.acc*100).toFixed(1)}% · F1=${(m.f1*100).toFixed(1)}%`, 'det');
}

// ============================================================
// 9. ANIMATION HELPERS
// ============================================================
function animateAttack(atk) {
  // Stagger slightly so packets don't overlap perfectly
  const bots = [];
  if (atk === 'tcp' || atk === 'all') bots.push({ from: 'b1', color: PKT_COLORS.tcp });
  if (atk === 'udp' || atk === 'all') bots.push({ from: 'b2', color: PKT_COLORS.udp });
  if (atk === 'get' || atk === 'all') bots.push({ from: 'b3', color: PKT_COLORS.get });

  bots.forEach((b, i) => {
    setTimeout(() => {
      // Multiple concurrent packets per bot per tick
      const count = 2 + Math.floor(Math.random() * 2);
      for (let j = 0; j < count; j++) {
        setTimeout(() => {
          spawnPacket(b.from, 'router', b.color);
          flashNode('node-' + (b.from === 'b1' ? 'b1' : b.from === 'b2' ? 'b2' : 'b3'), 'lit-red');
        }, j * 80);
      }
      // Then router → victim
      setTimeout(() => {
        spawnPacket('router', 'victim', b.color);
      }, 350);
    }, i * 100);
  });

  // LUCID sniffs traffic
  setTimeout(() => {
    spawnPacket('victim', 'lucid', '#00ffaa');
    flashNode('node-router', 'lit-green');
  }, 550);
}

function setStatusDot(state) {
  const dot = document.getElementById('status-dot');
  if (!dot) return;
  dot.className = 'status-dot ' + state;
}

// ============================================================
// 10. RESULTS TABS
// ============================================================
function showTab(tab, btn) {
  ['tcp', 'udp', 'get'].forEach(t => {
    const tbl = document.getElementById('res-' + t);
    if (tbl) tbl.classList.toggle('hidden', t !== tab);
  });
  document.querySelectorAll('.rtab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

// ============================================================
// 11. SMOOTH SCROLL for anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
