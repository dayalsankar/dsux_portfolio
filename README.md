# TERRA — An Interactive World Portfolio

A surreal, scroll-driven WebGL experience. Visitors *travel* through a living
landscape instead of scrolling sections: golden **farmlands** (windmills, wheat,
irrigation canals, distant hills) gradually transform into **deep forests** and a
**flowing river**. Skills, case studies, and achievements appear as landmarks
along the journey.

Built with **Three.js** (via CDN importmap) — no build step, no dependencies to install.

## Run it

ES modules + importmaps need to be served over HTTP (not opened as a `file://`).

```bash
cd "Protfolio Farm land"
python3 -m http.server 8123
# then open http://localhost:8123
```

Any static server works (`npx serve`, VS Code Live Server, etc.).

## How it works

| File | Role |
|------|------|
| `index.html` | Story overlay (oversized type + landmark panels) and importmap |
| `style.css`  | Typography, scroll panels, glass landmark cards, UI chrome |
| `main.js`    | The entire 3D world + scroll-driven cinematography |

**The journey** is one long scroll. Scroll progress (0→1) drives a smoothed
camera along a `CatmullRomCurve3` path while the sky, fog, sunlight, and particle
mood cross-fade through keyframes — farmland gold → forest green → river twilight.

**Living world:** instanced swaying wheat & grass (GPU wind shader), low-poly
trees, turning windmills, an animated water-ribbon river carved into the terrain,
plus pollen, fireflies, a bird flock, butterflies, and drifting leaves.

## Make it yours

- **Copy / case studies:** edit the `.panel` sections in `index.html`.
- **Name / contact:** the `.brand`, the `mailto:` in the final CTA.
- **World tuning:** `CFG` at the top of `main.js` (river start, water level, width).
- **Mood:** the `keys[]` colour keyframes and `phaseStops[]` labels in `main.js`.
- **Density / performance:** instance `count` values in the wheat/grass/tree blocks.

Click the speaker button (bottom-right) for optional synthesized wind ambience.
Respects `prefers-reduced-motion`.
