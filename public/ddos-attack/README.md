# LUCID DDoS Detection Simulator

An interactive website demonstrating the LUCID CNN-based intrusion detection
framework evaluated against MHDDoS-simulated TCP, UDP, and HTTP GET flood attacks.

Built as a research showcase for the NYIT Vancouver paper:
**"Evaluating Performance of LUCID: A Lightweight DDoS Detection Framework
with Realtime DDoS Traffic Simulation in LAN"** (Patel, Zhu, Jin — 2024)

---

## Files

```
ddos-website/
├── index.html        Main page (hero, sim, about, results, footer)
├── style.css         All styles (dark terminal aesthetic, responsive)
├── simulation.js     Simulation engine, chart, animation, metrics
└── README.md         This file
```

---

## How to deploy

### Option 1 — Static hosting (recommended)

Upload all three files (`index.html`, `style.css`, `simulation.js`) to any
static host. No build step, no dependencies, no server required.

**GitHub Pages**
1. Create a repository (e.g. `lucid-ddos-sim`)
2. Push all three files to the `main` branch
3. Go to Settings → Pages → Source: Deploy from branch → `main` / `/ (root)`
4. Your site is live at `https://yourusername.github.io/lucid-ddos-sim`

**Netlify Drop**
1. Drag the `ddos-website/` folder onto [netlify.com/drop](https://app.netlify.com/drop)
2. Done — instant live URL.

**Vercel**
```bash
npm i -g vercel
cd ddos-website
vercel
```

### Option 2 — Local development

```bash
# Python (no install required)
cd ddos-website
python3 -m http.server 8000
# open http://localhost:8000

# Node (if you have npx)
npx serve .
```

> ⚠️ Do **not** open `index.html` as a `file://` URL directly — Google Fonts
> and the Chart.js CDN will load fine, but some browsers block mixed content
> from file:// origins. Use a local server instead.

---

## Dependencies (all CDN, no install)

| Library | Purpose | CDN |
|---------|---------|-----|
| Chart.js 4.4.1 | Timeline chart | jsdelivr |
| Google Fonts: Syne + JetBrains Mono | Typography | fonts.googleapis.com |

All other code is vanilla HTML/CSS/JS.

---

## Customisation

### Change institution / author names
Edit the footer section in `index.html`.

### Swap metrics data
Update the `METRICS` object at the top of `simulation.js`:
```js
const METRICS = {
  tcp: {
    old:  { acc: 0.0041, f1: 0.0039, tpr: 0.0041, fpr: 0.05 },
    new:  { acc: 0.8161, f1: 0.8943, tpr: 0.8161, fpr: 0.12 },
    new5t:{ acc: 0.9593, f1: 0.9783, tpr: 0.9593, fpr: 0.04 }
  },
  ...
};
```

### Adjust simulation speed
In `simulation.js`, `startSim()`, the `setInterval` at the bottom is called
every `1000` ms (1 second). Reduce it (e.g. `500`) for faster ticks.

### Add your own domain / favicon
Add inside `<head>` in `index.html`:
```html
<link rel="icon" href="favicon.ico">
```

---

## Disclaimer

This is a **purely visual simulation** for educational and research presentation
purposes. No real network packets are generated or transmitted. All attack
metrics are derived from the paper's result tables.

---

## References

- R. Doriguzzi-Corin et al., "LUCID: A Practical, Lightweight Deep Learning
  Solution for DDoS Attack Detection," *IEEE TNSM*, vol. 17, no. 2, 2020.
- [github.com/doriguzzi/lucid-ddos](https://github.com/doriguzzi/lucid-ddos)
- [github.com/MatrixTM/MHDDoS](https://github.com/MatrixTM/MHDDoS)
