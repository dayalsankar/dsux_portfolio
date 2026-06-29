/* ============================================================================
   TERRA — a living, scroll-driven world (WebGL / Three.js)
   Farmlands  ->  transition  ->  forest & river
   Single-file scene. No build step. Procedural geometry, instanced life.
   ============================================================================ */

import * as THREE from "three";
import { ImprovedNoise } from "three/addons/math/ImprovedNoise.js";

/* ----------------------------------------------------------------------------
   0 · Globals & config
---------------------------------------------------------------------------- */
const CFG = {
  worldStartZ: 30,
  worldEndZ: -540,
  riverStartZ: -150,           // forest + river begin here
  waterY: -8,
  riverWidth: 26,
};

// Irrigation canal layout — shared by the canal meshes and the wheat exclusion
const CANALS = [
  { x: 0, z: -60, len: 180, rotY: 0.05 },
  { x: -30, z: -90, len: 140, rotY: -0.4 },
  { x: 35, z: -75, len: 120, rotY: 0.5 },
];
// True if (x,z) lies within `margin` of any canal (so wheat can skip it)
function nearCanal(x, z, margin) {
  for (const c of CANALS) {
    const dx = Math.sin(c.rotY), dz = Math.cos(c.rotY);   // unit along-canal dir
    const rx = x - c.x, rz = z - c.z;
    if (Math.abs(rx * dx + rz * dz) > c.len / 2) continue; // beyond canal ends
    if (Math.abs(rx * dz - rz * dx) < margin) return true; // within width
  }
  return false;
}

const canvas = document.getElementById("scene");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 1200);
camera.position.set(0, 8, 30);

const fog = new THREE.Fog(0xf6dcae, 60, 380);
scene.fog = fog;

// Shared animated time uniform (drives wind on instanced foliage)
const uTime = { value: 0 };

// Shared noise
const noise = new ImprovedNoise();

/* ----------------------------------------------------------------------------
   1 · Terrain height field (used by mesh + every placed object)
---------------------------------------------------------------------------- */
function riverCenterX(z) {
  return Math.sin(z * 0.01) * 22;
}

function terrainHeight(x, z) {
  let h = 0;
  h += noise.noise(x * 0.006, z * 0.006, 0) * 16;     // broad rolling hills
  h += noise.noise(x * 0.022, z * 0.022, 5.2) * 5;    // medium undulation
  h += noise.noise(x * 0.08, z * 0.08, 9.1) * 1.2;    // fine detail

  // distant hills rise toward the far edges
  h += Math.max(0, (Math.abs(x) - 90)) * 0.18;

  // carve the river valley once we cross into the forest
  if (z < CFG.riverStartZ) {
    const d = Math.abs(x - riverCenterX(z));
    const channel = Math.max(0, 1 - d / 16);
    h -= channel * channel * 24;                       // dig the channel
  }

  // Cliff & gorge at the very end: the land plunges past the brink into a lower
  // valley so the whole waterfall is exposed and lands somewhere real.
  const zBrink = CFG.worldEndZ - 4;                     // ~ -544
  if (z < zBrink) {
    const cliff = smoothstep(zBrink, zBrink - 12, z);   // 0 at the brink -> 1 just past
    // U-shaped canyon: only the central channel drops; the sides stay high as walls
    const dxc = Math.abs(x - riverCenterX(z));
    const inGorge = smoothstep(48, 22, dxc);            // 1 at centre -> 0 at the walls
    const floorTarget = h * (1.0 - inGorge) + (-80) * inGorge;
    h = h * (1.0 - cliff) + floorTarget * cliff;        // carve only the middle
    if (z < -620) h += (-620 - z) * 0.55;               // far wall rises -> a horizon ridge
  }
  return h;
}

/* ----------------------------------------------------------------------------
   2 · Sky dome (gradient that shifts with the journey)
---------------------------------------------------------------------------- */
const skyUniforms = {
  uTop: { value: new THREE.Color(0xaed3e8) },
  uBottom: { value: new THREE.Color(0xffe2b0) },
};
const sky = new THREE.Mesh(
  new THREE.SphereGeometry(700, 32, 16),
  new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: skyUniforms,
    vertexShader: `
      varying float vY;
      void main(){ vY = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
    `,
    fragmentShader: `
      uniform vec3 uTop; uniform vec3 uBottom; varying float vY;
      void main(){
        float t = smoothstep(-0.15, 0.55, vY);
        vec3 col = mix(uBottom, uTop, t);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  })
);
sky.renderOrder = -1;
scene.add(sky);

// Sun disc (soft glow billboard)
const sunUniforms = { uColor: { value: new THREE.Color(0xfff0c2) }, uOpacity: { value: 0 } };
const sun = new THREE.Mesh(
  new THREE.PlaneGeometry(120, 120),
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: sunUniforms,
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);} `,
    fragmentShader: `
      uniform vec3 uColor; uniform float uOpacity; varying vec2 vUv;
      void main(){
        float d = distance(vUv, vec2(0.5));
        float core = smoothstep(0.5, 0.0, d);
        float halo = smoothstep(0.5, 0.12, d);
        float a = (core * 0.9 + halo * 0.5) * uOpacity;
        gl_FragColor = vec4(uColor, a);
      }`,
  })
);
sun.position.set(-120, 60, -480);
scene.add(sun);

/* ----------------------------------------------------------------------------
   3 · Lighting
---------------------------------------------------------------------------- */
const hemi = new THREE.HemisphereLight(0xffe9c4, 0x4a5a36, 0.9);
scene.add(hemi);

const sunLight = new THREE.DirectionalLight(0xfff0cf, 2.1);
sunLight.position.set(-80, 70, -120);
scene.add(sunLight);

const ambient = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambient);

/* ----------------------------------------------------------------------------
   4 · Ground mesh (vertex-colored: golden farmland -> green forest)
---------------------------------------------------------------------------- */
const GROUND_W = 360;
const GROUND_L = 860;          // extended downstream so the gorge/horizon has land
const SEGS = 240;
const groundGeo = new THREE.PlaneGeometry(GROUND_W, GROUND_L, SEGS, Math.floor(SEGS * 1.6));
groundGeo.rotateX(-Math.PI / 2);

const cGold = new THREE.Color(0xc7a544);
const cGoldDry = new THREE.Color(0xb98a35);
const cForest = new THREE.Color(0x4f7d39);
const cWet = new THREE.Color(0x5b4a2c);
const cSand = new THREE.Color(0xb7a878);
const cRock = new THREE.Color(0x5b5446);   // gorge / cliff rock

{
  const pos = groundGeo.attributes.position;
  const colors = [];
  const tmp = new THREE.Color();
  // Center the strip so it spans worldStartZ..worldEndZ
  const zOffset = (CFG.worldStartZ + CFG.worldEndZ) / 2;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i) + zOffset;
    pos.setZ(i, z);
    const h = terrainHeight(x, z);
    pos.setY(i, h);

    // ----- vertex color -----
    const forestT = smoothstep(-120, -280, z);          // 0 farmland -> 1 forest
    tmp.copy(cGold).lerp(cForest, forestT);
    // dry patches in the fields
    const dry = noise.noise(x * 0.05, z * 0.05, 21) * 0.5 + 0.5;
    tmp.lerp(cGoldDry, (1 - forestT) * dry * 0.5);
    // wet earth in the valley + sandy banks near the river
    if (z < CFG.riverStartZ) {
      const d = Math.abs(x - riverCenterX(z));
      const bank = smoothstep(20, 9, d);
      tmp.lerp(cSand, bank * 0.6);
      const wet = smoothstep(11, 2, d);
      tmp.lerp(cWet, wet * 0.8);
    }
    // rocky cliff & gorge floor at the very end
    if (z < CFG.worldEndZ - 4) tmp.lerp(cRock, 0.6);
    colors.push(tmp.r, tmp.g, tmp.b);
  }
  groundGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  groundGeo.computeVertexNormals();
}

const ground = new THREE.Mesh(
  groundGeo,
  new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0, flatShading: false })
);
scene.add(ground);

/* ----------------------------------------------------------------------------
   5 · Wind helper for instanced foliage (sway in the vertex shader)
---------------------------------------------------------------------------- */
function applyWind(material, strength, speed) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uTime;
    shader.vertexShader =
      "uniform float uTime;\n" +
      shader.vertexShader.replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
         #ifdef USE_INSTANCING
           float ix = instanceMatrix[3].x; float iz = instanceMatrix[3].z;
         #else
           float ix = 0.0; float iz = 0.0;
         #endif
         float hh = uv.y;
         float w = sin(uTime * ${speed.toFixed(2)} + ix * 0.35 + iz * 0.3);
         float w2 = cos(uTime * ${(speed * 0.7).toFixed(2)} + iz * 0.4);
         transformed.x += w * ${strength.toFixed(2)} * hh * hh;
         transformed.z += w2 * ${(strength * 0.6).toFixed(2)} * hh * hh;
        `
      );
  };
  material.needsUpdate = true;
}

/* ----------------------------------------------------------------------------
   5b · Shared grass tuft — several thin blades that curve over and taper to a
   point, fanned at angles. One style used everywhere (farmland + wild region);
   only the colour differs per biome. uv.y carries height for the wind sway.
---------------------------------------------------------------------------- */
function buildGrassTuft(bladeH) {
  const pos = [], uv = [], idx = [];
  function addBlade(h, baseW, yaw, bend) {
    const segs = 4, c = Math.cos(yaw), s = Math.sin(yaw), lx = -s, lz = c;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs, y = h * t;
      const bendOff = bend * t * t;                 // arcs forward as it rises
      const w = baseW * (1 - t) * (1 - t * 0.35);   // taper to a point
      const cx = c * bendOff, cz = s * bendOff, o = pos.length / 3;
      pos.push(cx + lx * (-w / 2), y, cz + lz * (-w / 2));
      pos.push(cx + lx * (w / 2),  y, cz + lz * (w / 2));
      uv.push(0, t, 0, t);
      if (i > 0) idx.push(o - 2, o - 1, o, o, o - 1, o + 1);
    }
  }
  const blades = 4;
  for (let b = 0; b < blades; b++) {
    const yaw = (b / blades) * Math.PI * 2 + Math.random() * 0.7;
    addBlade(bladeH * (0.7 + Math.random() * 0.55), 0.05, yaw, 0.12 + Math.random() * 0.14);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

/* ----------------------------------------------------------------------------
   6 · Wheat / golden field (instanced, swaying blades)
---------------------------------------------------------------------------- */
{
  const bladeH = 0.55;
  const blade = buildGrassTuft(bladeH);     // shared realistic grass style

  const count = 85000;
  const mat = new THREE.MeshStandardMaterial({
    color: 0xcfa948,                         // golden, to match the land
    roughness: 0.95,
    side: THREE.DoubleSide,
  });
  applyWind(mat, 0.3, 1.15);

  const mesh = new THREE.InstancedMesh(blade, mat, count);
  const dummy = new THREE.Object3D();
  const col = new THREE.Color();
  let n = 0;
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 300;
    const z = CFG.worldStartZ - Math.random() * 230;     // farmland band only
    if (z < CFG.riverStartZ + 10) continue;
    if (nearCanal(x, z, 2.4)) continue;                  // keep grass out of the canals
    const y = terrainHeight(x, z);
    dummy.position.set(x, y, z);
    dummy.rotation.y = Math.random() * Math.PI;
    const s = 0.7 + Math.random() * 0.9;
    dummy.scale.set(s, s * (0.8 + Math.random() * 0.6), s);
    dummy.updateMatrix();
    mesh.setMatrixAt(n, dummy.matrix);
    // golden field tones to match the land, with a few warmer/drier tufts
    col.setHSL(0.11 + Math.random() * 0.04, 0.6, 0.42 + Math.random() * 0.18);
    mesh.setColorAt(n, col);
    n++;
  }
  mesh.count = n;
  mesh.instanceMatrix.needsUpdate = true;
  scene.add(mesh);
}

/* ----------------------------------------------------------------------------
   7 · Forest grass tufts (greener, swaying) in the wild region
---------------------------------------------------------------------------- */
{
  const bladeH = 0.6;
  const blade = buildGrassTuft(bladeH);     // same realistic grass style as the fields
  const count = 85000;
  const mat = new THREE.MeshStandardMaterial({ color: 0x6fa544, roughness: 0.95, side: THREE.DoubleSide });
  applyWind(mat, 0.3, 1.1);
  const mesh = new THREE.InstancedMesh(blade, mat, count);
  const dummy = new THREE.Object3D();
  const col = new THREE.Color();
  let n = 0;
  for (let i = 0; i < count; i++) {
    const z = CFG.riverStartZ - Math.random() * 380;
    const x = (Math.random() - 0.5) * 300;
    const d = Math.abs(x - riverCenterX(z));
    if (d < 11) continue;                                  // keep out of the water
    const y = terrainHeight(x, z);
    if (y < CFG.waterY + 0.5) continue;
    dummy.position.set(x, y, z);
    dummy.rotation.y = Math.random() * Math.PI;
    const s = 0.7 + Math.random();
    dummy.scale.set(s, s, s);
    dummy.updateMatrix();
    mesh.setMatrixAt(n, dummy.matrix);
    col.setHSL(0.25 + Math.random() * 0.06, 0.5, 0.32 + Math.random() * 0.16);
    mesh.setColorAt(n, col);
    n++;
  }
  mesh.count = n;
  mesh.instanceMatrix.needsUpdate = true;
  scene.add(mesh);
}

/* ----------------------------------------------------------------------------
   8 · Trees (low-poly: trunk + stacked foliage cones), instanced
---------------------------------------------------------------------------- */
// merge a list of {geo, color} parts into one vertex-coloured BufferGeometry.
// uv.y carries a height factor (0..1) so the wind shader sways the upper canopy.
function mergeColoredParts(parts) {
  let total = 0;
  parts.forEach((p) => (total += p.geo.attributes.position.count));
  const position = new Float32Array(total * 3);
  const normal = new Float32Array(total * 3);
  const uv = new Float32Array(total * 2);
  const color = new Float32Array(total * 3);
  let o = 0,
    uo = 0;
  parts.forEach((p) => {
    const g = p.geo;
    g.computeVertexNormals();
    const pp = g.attributes.position,
      nn = g.attributes.normal;
    for (let i = 0; i < pp.count; i++) {
      position[o] = pp.getX(i);
      position[o + 1] = pp.getY(i);
      position[o + 2] = pp.getZ(i);
      normal[o] = nn.getX(i);
      normal[o + 1] = nn.getY(i);
      normal[o + 2] = nn.getZ(i);
      uv[uo] = 0;
      uv[uo + 1] = Math.min(1, pp.getY(i) / 12);
      color[o] = p.color.r;
      color[o + 1] = p.color.g;
      color[o + 2] = p.color.b;
      o += 3;
      uo += 2;
    }
  });
  const merged = new THREE.BufferGeometry();
  merged.setAttribute("position", new THREE.BufferAttribute(position, 3));
  merged.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
  merged.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  merged.setAttribute("color", new THREE.BufferAttribute(color, 3));
  return merged;
}

// A mango tree: a short, thick trunk that splits into spreading limbs under a
// broad, dense, rounded dome of dark-green foliage, with ripening mangoes
// hanging from the lower outer canopy.
function buildTreeGeometry() {
  const parts = [];
  const bark = new THREE.Color(0x5a4026);
  const up = new THREE.Vector3(0, 1, 0);

  // --- short, thick trunk ---
  const trunkH = 2.6;
  const trunk = new THREE.CylinderGeometry(0.5, 0.8, trunkH, 9);
  trunk.translate(0, trunkH / 2, 0);
  parts.push({ geo: trunk, color: bark });

  // --- main limbs spreading up & out from the top of the trunk ---
  const nL = 4;
  for (let i = 0; i < nL; i++) {
    const a = (i / nL) * Math.PI * 2 + Math.random() * 0.5;
    const dir = new THREE.Vector3(Math.cos(a) * 0.62, 0.82, Math.sin(a) * 0.62).normalize();
    const len = 1.8 + Math.random() * 0.6;
    const seg = new THREE.CylinderGeometry(0.22, 0.42, len, 7);
    seg.translate(0, len / 2, 0);
    seg.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(up, dir));
    seg.translate(0, trunkH - 0.2, 0);
    parts.push({ geo: seg, color: bark });
  }

  // --- broad, dense canopy: a dome of overlapping foliage masses ---
  const baseY = trunkH + 0.7;
  const foliage = (x, y, z, cr) => {
    const g = new THREE.IcosahedronGeometry(cr, 1);
    const p = g.attributes.position;                    // jitter -> organic clump
    for (let i = 0; i < p.count; i++) {
      p.setXYZ(i, p.getX(i) * (0.82 + Math.random() * 0.34), p.getY(i) * (0.82 + Math.random() * 0.34), p.getZ(i) * (0.82 + Math.random() * 0.34));
    }
    g.scale(1.0, 0.9, 1.0);
    g.translate(x, y, z);
    parts.push({ geo: g, color: new THREE.Color().setHSL(0.30 + Math.random() * 0.035, 0.5, 0.22 + Math.random() * 0.12) });
  };
  // rings rising and narrowing form a broad rounded dome (wider than tall)
  const layers = [
    { y: baseY + 0.0, rad: 3.1, n: 6, cr: 1.7 },
    { y: baseY + 1.3, rad: 2.5, n: 5, cr: 1.6 },
    { y: baseY + 2.4, rad: 1.6, n: 4, cr: 1.5 },
    { y: baseY + 3.3, rad: 0.6, n: 2, cr: 1.4 },
  ];
  layers.forEach((L) => {
    for (let i = 0; i < L.n; i++) {
      const a = (i / L.n) * Math.PI * 2 + Math.random() * 0.6;
      const rr = L.rad * (0.6 + Math.random() * 0.5);
      foliage(Math.cos(a) * rr, L.y + (Math.random() - 0.5) * 0.5, Math.sin(a) * rr, L.cr * (0.85 + Math.random() * 0.3));
    }
    foliage(0, L.y, 0, L.cr);                            // fill the centre
  });

  // --- ripening mangoes hanging at the lower outer canopy ---
  const mangoColors = [0x8a9438, 0xd9b63e, 0xe79a35, 0xcf5a2f];  // green → yellow → orange → red-blush
  for (let i = 0; i < 12; i++) {
    const a = Math.random() * Math.PI * 2;
    const rr = 2.4 + Math.random() * 0.9;
    const mx = Math.cos(a) * rr, mz = Math.sin(a) * rr, my = baseY + 0.2 + Math.random() * 1.2;
    const stalk = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 4);
    stalk.translate(0, -0.2, 0); stalk.translate(mx, my, mz);
    parts.push({ geo: stalk, color: new THREE.Color(0x5c6b2c) });
    const fruit = new THREE.IcosahedronGeometry(0.3 + Math.random() * 0.06, 1);
    fruit.scale(0.85, 1.3, 0.85);
    fruit.rotateZ((Math.random() - 0.5) * 0.5);
    fruit.translate(mx, my - 0.55, mz);
    parts.push({ geo: fruit, color: new THREE.Color(mangoColors[Math.floor(Math.random() * mangoColors.length)]) });
  }

  return mergeColoredParts(parts);
}

// Coconut palm — a gracefully curving, leaning trunk with the crown bending over
function buildCoconutTreeGeometry() {
  const parts = [];
  const top = 9.0;
  const lean = 2.4;                                       // sideways reach of the crown
  const trunkClr = new THREE.Color(0x86653f);

  // build the curved trunk as a chain of short tapered cylinders following an arc
  const tSegs = 9;
  let prev = new THREE.Vector3(0, 0, 0);
  const up = new THREE.Vector3(0, 1, 0);
  for (let i = 1; i <= tSegs; i++) {
    const t = i / tSegs;
    const cur = new THREE.Vector3(lean * t * t, top * t, 0);   // accelerating lean
    const dir = cur.clone().sub(prev);
    const len = dir.length();
    const r = 0.5 - 0.24 * t;                             // taper from base to crown
    const seg = new THREE.CylinderGeometry(r * 0.92, r, len * 1.04, 8);
    seg.translate(0, len / 2, 0);                         // base at origin
    const q = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
    seg.applyQuaternion(q);
    seg.translate(prev.x, prev.y, prev.z);
    parts.push({ geo: seg, color: trunkClr });
    prev = cur;
  }
  const crownX = lean, crownY = top;                      // where the fronds emerge

  // swollen crown shaft
  const base = new THREE.SphereGeometry(0.5, 8, 6);
  base.scale(1, 0.75, 1);
  base.translate(crownX, crownY, 0);
  parts.push({ geo: base, color: new THREE.Color(0x7a5a36) });

  // each frond is a chain of segments that arch up then droop down, tapering to
  // a tip — two interleaved tiers give a rounded, well-filled shuttlecock crown
  const fronds = 13;
  const segCount = 4;
  const segLen = 1.45;
  for (let i = 0; i < fronds; i++) {
    const a = (i / fronds) * Math.PI * 2;
    const tier = i % 2;                                   // alternate high/low fronds
    let ang = tier === 0 ? -0.35 : 0.05;                 // upper tier starts arching upward
    const droopInc = tier === 0 ? 0.45 : 0.55;           // then curves over and droops
    const hueJit = (i % 3) * 0.04;
    let pz = 0.3, py = crownY + 0.1;                      // start at the crown
    for (let s = 0; s < segCount; s++) {
      const w = 0.6 * (1 - (s / segCount) * 0.78);       // blade narrows toward the tip
      const g = new THREE.BoxGeometry(w, 0.1, segLen);
      const cz = pz + Math.cos(ang) * segLen / 2;
      const cy = py - Math.sin(ang) * segLen / 2;
      g.rotateX(ang);                                    // tilt this segment
      g.translate(0, cy, cz);                            // place along the arc
      g.rotateY(a);                                      // swing around the trunk
      g.translate(crownX, 0, 0);                          // move onto the leaning crown
      parts.push({ geo: g, color: new THREE.Color().setHSL(0.33, 0.55, 0.30 + hueJit + s * 0.02) });
      pz += Math.cos(ang) * segLen;                      // advance to next segment
      py -= Math.sin(ang) * segLen;
      ang += droopInc;
    }
  }

  // cluster of coconuts tucked under the crown
  [ { x: 0.4, z: 0.3 }, { x: -0.4, z: 0.2 }, { x: 0.1, z: -0.4 }, { x: 0.5, z: -0.2 } ].forEach((c) => {
    const g = new THREE.IcosahedronGeometry(0.42, 0);
    g.translate(crownX + c.x, crownY - 0.5, c.z);
    parts.push({ geo: g, color: new THREE.Color(0x6d4f2c) });
  });

  return mergeColoredParts(parts);
}

// Banana — short green pseudostem, big broad upright leaves, a hanging bunch
function buildBananaTreeGeometry() {
  const parts = [];
  const top = 3.4;
  const trunk = new THREE.CylinderGeometry(0.4, 0.62, top, 7);
  trunk.translate(0, top / 2, 0);
  parts.push({ geo: trunk, color: new THREE.Color(0x5c7d38) });

  // big broad leaves splaying up and out from the top
  const leaves = 6;
  for (let i = 0; i < leaves; i++) {
    const a = (i / leaves) * Math.PI * 2 + 0.3;
    const g = new THREE.BoxGeometry(1.5, 0.1, 4.6);
    g.translate(0, 0, 2.3);
    g.rotateX(-0.6 - (i % 2) * 0.2);   // mostly upward, a few flatter
    g.rotateY(a);
    g.translate(0, top, 0);
    parts.push({ geo: g, color: new THREE.Color().setHSL(0.30, 0.6, 0.40 + (i % 3) * 0.05) });
  }

  // hanging banana bunch near the crown
  [ { x: 0.0, y: 2.9, z: 0.7 }, { x: 0.25, y: 2.7, z: 0.75 }, { x: -0.2, y: 2.7, z: 0.7 }, { x: 0.05, y: 2.5, z: 0.85 } ].forEach((b) => {
    const g = new THREE.IcosahedronGeometry(0.5, 0);
    g.scale(0.5, 0.95, 0.5);
    g.translate(b.x, b.y, b.z);
    parts.push({ geo: g, color: new THREE.Color(0xe7b833) });
  });

  return mergeColoredParts(parts);
}

{
  // a grove of mango trees
  const geos = {
    mango: buildTreeGeometry(),
  };
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true });
  applyWind(mat, 0.22, 0.6); // gentle whole-canopy sway
  const count = 420;
  const buckets = { mango: [] };
  const dummy = new THREE.Object3D();
  let n = 0;
  for (let i = 0; i < count * 3 && n < count; i++) {
    const z = CFG.riverStartZ - 10 - Math.random() * 380;
    const x = (Math.random() - 0.5) * 300;
    const d = Math.abs(x - riverCenterX(z));
    if (d < 16) continue; // clear of the river
    const y = terrainHeight(x, z);
    if (y < CFG.waterY + 1) continue;
    // density grows deeper into the forest
    const deep = smoothstep(CFG.riverStartZ, -480, z);
    if (Math.random() > 0.25 + deep * 0.75) continue;
    dummy.position.set(x, y - 0.4, z);
    dummy.rotation.y = Math.random() * Math.PI * 2;
    const s = 0.7 + Math.random() * 0.9;
    dummy.scale.set(s, s * (0.9 + Math.random() * 0.4), s);
    dummy.updateMatrix();
    buckets.mango.push(dummy.matrix.clone());
    n++;
  }
  Object.keys(buckets).forEach((type) => {
    const mats = buckets[type];
    if (!mats.length) return;
    const mesh = new THREE.InstancedMesh(geos[type], mat, mats.length);
    mats.forEach((m, idx) => mesh.setMatrixAt(idx, m));
    mesh.instanceMatrix.needsUpdate = true;
    scene.add(mesh);
  });
}

/* ----------------------------------------------------------------------------
   9 · Windmills (tower + rotating sails) in the farmland
---------------------------------------------------------------------------- */
const windmillRotors = [];
const windmills = [];          // groups, for positional audio
function buildWindmill(x, z, scale = 1) {
  const g = new THREE.Group();
  const y = terrainHeight(x, z);
  g.position.set(x, y, z);
  g.scale.setScalar(scale);

  const towerMat = new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.85 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x7a4a32, roughness: 0.8 });

  const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 2.4, 11, 12), towerMat);
  tower.position.y = 5.5;
  g.add(tower);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.0, 2.6, 12), roofMat);
  roof.position.y = 12;
  g.add(roof);

  // rotor assembly (sits on the front face)
  const rotor = new THREE.Group();
  rotor.position.set(0, 10.4, 2.2);
  const hub = new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 8), roofMat);
  rotor.add(hub);

  const sailMat = new THREE.MeshStandardMaterial({ color: 0xb5651d, roughness: 0.7, side: THREE.DoubleSide });
  const clothMat = new THREE.MeshStandardMaterial({ color: 0xf3ead2, roughness: 0.9, side: THREE.DoubleSide });
  for (let s = 0; s < 4; s++) {
    const arm = new THREE.Group();
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.25, 7, 0.25), sailMat);
    beam.position.y = 3.5;
    arm.add(beam);
    const cloth = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 6), clothMat);
    cloth.position.set(1.1, 3.5, 0);
    arm.add(cloth);
    arm.rotation.z = (s / 4) * Math.PI * 2;
    rotor.add(arm);
  }
  g.add(rotor);
  windmillRotors.push(rotor);
  windmills.push(g);
  scene.add(g);
}
[
  [-45, -25, 1.0],
  [55, -70, 1.2],
  [-65, -120, 0.95],
  [30, -150, 1.1],
].forEach(([x, z, s]) => buildWindmill(x, z, s));

/* ----------------------------------------------------------------------------
   10 · Irrigation canals (thin reflective water strips in the fields)
---------------------------------------------------------------------------- */
const canalMat = new THREE.MeshStandardMaterial({
  color: 0x4a8fb0,
  roughness: 0.15,
  metalness: 0.4,
  transparent: true,
  opacity: 0.85,
});
// A ribbon whose vertices hug the terrain along its length (no floating/clipping)
function buildCanal(x0, z0, len, rotY) {
  const half = 1.2;                                  // width 2.4
  const segs = 56;
  const dx = Math.sin(rotY), dz = Math.cos(rotY);    // along-canal
  const px = Math.cos(rotY), pz = -Math.sin(rotY);   // across-canal
  const pos = [], uv = [], idx = [];
  for (let i = 0; i <= segs; i++) {
    const t = (i / segs - 0.5) * len;
    const ccx = x0 + dx * t, ccz = z0 + dz * t;
    for (let s = -1; s <= 1; s += 2) {
      const wx = ccx + px * half * s;
      const wz = ccz + pz * half * s;
      pos.push(wx, terrainHeight(wx, wz) + 0.12, wz); // sit just on the surface
      uv.push((s + 1) / 2, i / segs);
    }
    if (i < segs) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  scene.add(new THREE.Mesh(g, canalMat));
}
CANALS.forEach((c) => buildCanal(c.x, c.z, c.len, c.rotY));

/* ----------------------------------------------------------------------------
   10b · Farmer on a tractor — low-poly, drives a looping field route, kicks
         up dust, wheels spin, body conforms & tilts to the terrain.
---------------------------------------------------------------------------- */
const tractor = (() => {
  const TIRE = 0x2b2b2b, HUB = 0xe2c87d, BODY = 0xc23b22, BODY_DK = 0x97301b;
  const STACK = 0x35302c, SEAT = 0x3a3530;
  const SKIN = 0xe0a87e, SHIRT = 0x2f5d8c, STRAW = 0xd9b25a;
  const mat = (c, rough = 0.7) => new THREE.MeshStandardMaterial({ color: c, roughness: rough, flatShading: true });

  // A wheel as a group so it can spin about its axle (local X).
  function makeWheel(radius, width, spokes) {
    const w = new THREE.Group();
    const tire = new THREE.CylinderGeometry(radius, radius, width, 16);
    tire.rotateZ(Math.PI / 2);                       // lay the axle along X
    w.add(new THREE.Mesh(tire, mat(TIRE, 0.85)));
    const hubGeo = new THREE.CylinderGeometry(radius * 0.42, radius * 0.42, width * 1.15, 12);
    hubGeo.rotateZ(Math.PI / 2);
    w.add(new THREE.Mesh(hubGeo, mat(HUB, 0.5)));
    if (spokes) {                                    // crossed spokes read the rotation
      for (let s = 0; s < 3; s++) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(width * 1.05, radius * 1.6, 0.12), mat(HUB, 0.5));
        bar.rotation.x = (s / 3) * Math.PI;
        w.add(bar);
      }
    }
    w.userData.radius = radius;
    return w;
  }

  const group = new THREE.Group();

  // Big rear wheels + small steer wheels.
  const wheels = [];
  const rearY = 1.6, frontY = 0.95;
  [[-1.55, rearY, -1.15, 1.6, true], [1.55, rearY, -1.15, 1.6, true],
   [-1.35, frontY, 2.1, 0.95, false], [1.35, frontY, 2.1, 0.95, false]
  ].forEach(([x, y, z, r, sp]) => {
    const w = makeWheel(r, 0.55, sp);
    w.position.set(x, y, z);
    group.add(w);
    wheels.push(w);
  });

  // Chassis / hood / cab.
  const hood = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.1, 3.0), mat(BODY));
  hood.position.set(0, 2.0, 1.2);
  group.add(hood);
  const nose = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.8, 0.9), mat(BODY_DK));
  nose.position.set(0, 1.7, 3.0);
  group.add(nose);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.0, 1.7), mat(BODY));
  cab.position.set(0, 2.55, -0.9);
  group.add(cab);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.9), mat(SEAT, 0.9));
  seat.position.set(0, 3.2, -1.1);
  group.add(seat);
  const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 1.8, 8), mat(STACK, 0.6));
  stack.position.set(0.7, 3.1, 2.4);
  group.add(stack);

  // The farmer, seated.
  const farmer = new THREE.Group();
  farmer.position.set(0, 3.5, -1.1);
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.0, 0.6), mat(SHIRT, 0.85));
  torso.position.y = 0.5;
  farmer.add(torso);
  const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.36, 1), mat(SKIN, 0.8));
  head.position.y = 1.35;
  farmer.add(head);
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.08, 12), mat(STRAW, 0.9));
  brim.position.y = 1.6;
  farmer.add(brim);
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.34, 12), mat(STRAW, 0.9));
  crown.position.y = 1.75;
  farmer.add(crown);
  // arms reaching forward to the wheel
  [-0.55, 0.55].forEach((ax) => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.8), mat(SHIRT, 0.85));
    arm.position.set(ax, 0.7, 0.45);
    arm.rotation.x = -0.5;
    farmer.add(arm);
  });
  group.add(farmer);

  group.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
  scene.add(group);

  // Looping plough route through the golden fields (closed CatmullRom).
  const routePts = [
    [-42, -18], [38, -28], [46, -78], [12, -128], [-34, -122], [-50, -64],
  ].map(([x, z]) => new THREE.Vector3(x, 0, z));
  const route = new THREE.CatmullRomCurve3(routePts, true, "catmullrom", 0.5);
  const LOOP_SECONDS = 52;

  // --- Dust trail (CPU particles emitted behind the rear wheels) ---
  const DUST = reducedMotion ? 0 : 80;
  const dPos = new Float32Array(Math.max(1, DUST) * 3);
  const dAlpha = new Float32Array(Math.max(1, DUST));
  const dVel = [], dLife = [], dMax = [];
  for (let i = 0; i < DUST; i++) { dLife[i] = 0; dMax[i] = 1; dVel[i] = new THREE.Vector3(); dAlpha[i] = 0; }
  const dGeo = new THREE.BufferGeometry();
  dGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
  dGeo.setAttribute("aAlpha", new THREE.BufferAttribute(dAlpha, 1));
  const dMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uColor: { value: new THREE.Color(0xcaa46a) } },
    vertexShader: `
      attribute float aAlpha; varying float vA;
      void main(){ vA = aAlpha;
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        gl_PointSize = 26.0 * (300.0 / -mv.z);
        gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `
      uniform vec3 uColor; varying float vA;
      void main(){ float d = distance(gl_PointCoord, vec2(0.5));
        float a = smoothstep(0.5, 0.0, d) * vA;
        gl_FragColor = vec4(uColor, a); }`,
  });
  const dust = new THREE.Points(dGeo, dMat);
  dust.frustumCulled = false;
  if (DUST) scene.add(dust);

  // Reusable temporaries
  const P = new THREE.Vector3(), A = new THREE.Vector3(), prev = new THREE.Vector3();
  const fwd = new THREE.Vector3(), up = new THREE.Vector3(), right = new THREE.Vector3();
  const emit = new THREE.Vector3(), m4 = new THREE.Matrix4();
  let u = 0, started = false, dustCursor = 0;

  function place(uu) {
    route.getPointAt(uu % 1, P);
    route.getPointAt((uu + 0.006) % 1, A);
    const x = P.x, z = P.z;
    fwd.set(A.x - x, 0, A.z - z);
    if (fwd.lengthSq() < 1e-6) fwd.set(0, 0, 1);
    fwd.normalize();
    // terrain normal -> up (gives both pitch over hills and side-roll)
    const e = 2.2;
    up.set(terrainHeight(x - e, z) - terrainHeight(x + e, z), 2 * e,
           terrainHeight(x, z - e) - terrainHeight(x, z + e)).normalize();
    fwd.addScaledVector(up, -fwd.dot(up)).normalize();   // project forward onto the slope
    right.crossVectors(up, fwd).normalize();
    m4.makeBasis(right, up, fwd);
    group.quaternion.setFromRotationMatrix(m4);
    group.position.set(x, terrainHeight(x, z) - 0.1, z);
  }

  function update(dt, p) {
    // The tractor belongs to the farmland chapter; fade it out once we move on.
    const show = p < 0.74;
    group.visible = show;
    if (DUST) dust.visible = show;
    if (!show) return;

    if (reducedMotion) { if (!started) { place(0); started = true; } return; }

    prev.copy(group.position);
    u = (u + dt / LOOP_SECONDS) % 1;
    place(u);

    // engine bob + idle shake
    group.position.y += Math.sin(uTime.value * 11) * 0.05;
    farmer.rotation.z = Math.sin(uTime.value * 9) * 0.02;

    // spin the wheels by the real distance travelled
    const dist = group.position.distanceTo(prev);
    wheels.forEach((w) => (w.rotation.x -= dist / w.userData.radius));

    if (!DUST) return;
    // emit a couple of puffs per frame from behind the rear axle
    emit.set((Math.random() - 0.5) * 1.6, 0.5, -1.8);
    group.localToWorld(emit);
    for (let k = 0; k < 2; k++) {
      const i = dustCursor; dustCursor = (dustCursor + 1) % DUST;
      dPos[i * 3] = emit.x + (Math.random() - 0.5) * 0.6;
      dPos[i * 3 + 1] = emit.y;
      dPos[i * 3 + 2] = emit.z + (Math.random() - 0.5) * 0.6;
      dVel[i].set((Math.random() - 0.5) * 1.2, 0.9 + Math.random() * 0.8, (Math.random() - 0.5) * 1.2);
      dMax[i] = dLife[i] = 1.1 + Math.random() * 0.7;
    }
    // age every puff
    for (let i = 0; i < DUST; i++) {
      if (dLife[i] <= 0) { dAlpha[i] = 0; continue; }
      dLife[i] -= dt;
      dVel[i].multiplyScalar(0.96);          // settle
      dPos[i * 3] += dVel[i].x * dt;
      dPos[i * 3 + 1] += dVel[i].y * dt;
      dPos[i * 3 + 2] += dVel[i].z * dt;
      dAlpha[i] = Math.max(0, dLife[i] / dMax[i]) * 0.5;
    }
    dGeo.attributes.position.needsUpdate = true;
    dGeo.attributes.aAlpha.needsUpdate = true;
  }

  return { update, group };
})();
tractor.group.visible = true;   // tractor back in the farmland (visible, animated, audible)

const walkers = [];   // every grazing/wandering animal, animated by one loop (goats, sheep, hens)

/* ----------------------------------------------------------------------------
   11 · The river (animated water ribbon following the valley)
---------------------------------------------------------------------------- */
{
  const zStart = CFG.riverStartZ + 6;
  const zEnd = CFG.worldEndZ - 6;          // ends at the brink, not out over the gorge
  const segs = 160;
  const half = CFG.riverWidth / 2;
  const positions = [];
  const uvs = [];
  const indices = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const z = THREE.MathUtils.lerp(zStart, zEnd, t);
    const cx = riverCenterX(z);
    positions.push(cx - half, CFG.waterY, z);
    positions.push(cx + half, CFG.waterY, z);
    uvs.push(0, t * 20);
    uvs.push(1, t * 20);
    if (i < segs) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  const waterMat = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: uTime,
      uDeep: { value: new THREE.Color(0x21474f) },   // = waterfall deep teal (match at the brink)
      uBody: { value: new THREE.Color(0x4fb6c4) },   // = waterfall body / river shallow
      uFoam: { value: new THREE.Color(0xeafdff) },   // = waterfall whitewater
      uSky: { value: new THREE.Color(0x9fc9d6) },
      uBrinkZ: { value: zEnd },                      // world z where the river meets the lip
    },
    vertexShader: `
      uniform float uTime; uniform float uBrinkZ;
      varying vec2 vUv; varying vec3 vWorld;
      void main(){
        vUv = uv;
        vec3 p = position;
        // fade the surface wave to zero approaching the brink so the river arrives
        // dead flat, exactly where the waterfall lip begins (no opening/closing gap)
        float damp = smoothstep(uBrinkZ, uBrinkZ + 14.0, p.z);
        p.y += (sin(p.x*0.35 + uTime*1.4)*0.18 + sin(p.z*0.18 + uTime*1.1)*0.22) * damp;
        vec4 wp = modelMatrix * vec4(p,1.0);
        vWorld = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: `
      uniform float uTime; uniform vec3 uDeep; uniform vec3 uBody; uniform vec3 uFoam; uniform vec3 uSky;
      varying vec2 vUv; varying vec3 vWorld;
      float h(float x){ return fract(sin(x*91.17)*43758.5453); }
      void main(){
        // SAME flow language as the waterfall: meandering foam strands streaming
        // downstream (toward the brink) so the current reads continuous over the lip.
        float yL = vUv.y;                                   // 0..20 along the channel
        float wob = sin(yL*1.2 + uTime*1.3)*0.015 + (h(floor(yL*4.0)) - 0.5)*0.025;
        float ux = vUv.x + wob;
        float lane = floor(ux*48.0);
        float sp = 1.2 + h(lane)*0.8;
        float flow = fract(yL*0.6 - uTime*sp + h(lane));    // '-' = travels downstream
        float strand = smoothstep(0.0,0.45,flow)*smoothstep(1.0,0.55,flow);
        // teal body (matches the fall) -> whitens via strands; gentler since it's flat water
        vec3 col = mix(uDeep, uBody, 0.62);
        col = mix(col, uFoam, strand*0.16);
        // sky glints
        float spark = pow(max(0.0, sin(vWorld.x*0.8 + uTime*3.0)*sin(vWorld.z*0.5 - uTime*2.0)), 14.0);
        col += uSky * spark * 0.55;
        col = mix(col, uSky, 0.14);
        // edge softening toward banks
        float edge = smoothstep(0.0,0.16, vUv.x) * smoothstep(1.0,0.84, vUv.x);
        // shared crest foam at the very brink — same phase/scale as the waterfall lip,
        // so the whitewater is continuous across the seam (and hides it)
        float endN = smoothstep(18.6, 20.0, yL);
        float crestFoam = endN * (0.45 + 0.55*fract(ux*30.0 + uTime*2.6 + h(floor(ux*30.0))));
        col = mix(col, uFoam, crestFoam*0.8);
        gl_FragColor = vec4(col, clamp(0.85*edge + 0.1 + crestFoam*0.35*edge, 0.0, 0.97));
      }`,
  });
  const river = new THREE.Mesh(geo, waterMat);
  scene.add(river);
}

/* ----------------------------------------------------------------------------
   11b · Waterfall — the river cascades off the edge of the world at the end
---------------------------------------------------------------------------- */
// World position of the fall + the camera viewpoint that frames it at the end
const waterfallPos = new THREE.Vector3(riverCenterX(CFG.worldEndZ - 16), CFG.waterY - 34, CFG.worldEndZ - 28);
const waterfallView = new THREE.Vector3(riverCenterX(CFG.worldEndZ - 16) + 20, CFG.waterY + 10, CFG.worldEndZ - 16 - 78);
{
  const zFall = CFG.worldEndZ - 16;          // at the river's end
  // center the sheet on the river's MOUTH (z = brink), not zFall, so the lip lines up
  // exactly with where the river ends (the meander shifts the center ~1.5u between them)
  const cx = riverCenterX(CFG.worldEndZ - 6);
  const wfWidth = CFG.riverWidth;             // matches the river channel width
  const topY = CFG.waterY;                    // starts at the river surface
  const fallH = 72;                           // how far it drops

  // ONE continuous water sheet: river end -> curved lip -> vertical drop.
  // Geometry is built in world space so it joins the river exactly (no seam).
  const zTop = CFG.worldEndZ - 6;             // exactly where the river ends
  const yTop = topY;                           // river surface level
  const floorY = topY - fallH;                 // pool / gorge floor
  const R = 9;                                 // lip curve radius
  const zDrop = zTop - R;                      // z of the vertical drop
  const yLipBottom = yTop - R;

  function buildFallGeometry(width) {
    const nU = 22, nV = 72, lipFrac = 0.2;
    const pos = [], uv = [], idx = [];
    for (let j = 0; j <= nV; j++) {
      const v = j / nV;                         // 0 = pool, 1 = river join
      let py, pz;
      if (v < 1 - lipFrac) {
        const vd = v / (1 - lipFrac);
        py = THREE.MathUtils.lerp(floorY, yLipBottom, vd);
        pz = zDrop;
      } else {
        const lc = (v - (1 - lipFrac)) / lipFrac;   // 0 lip-bottom -> 1 river join
        const th = (1 - lc) * Math.PI / 2;
        pz = zTop - R * Math.sin(th);
        py = yTop - R * (1 - Math.cos(th));
      }
      const w = width * (0.92 + 0.08 * v);
      for (let i = 0; i <= nU; i++) {
        const u = i / nU;
        pos.push(cx + (u - 0.5) * w, py, pz);
        uv.push(u, v);
        if (i < nU && j < nV) {
          const a = j * (nU + 1) + i;
          idx.push(a, a + 1, a + nU + 1, a + 1, a + nU + 2, a + nU + 1);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }

  const fallMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: uTime,
      uFoam: { value: new THREE.Color(0xeafdff) },   // whitewater
      uBody: { value: new THREE.Color(0x4fb6c4) },   // = river shallow (match at the seam)
      uDeep: { value: new THREE.Color(0x21474f) },   // deep teal
    },
    vertexShader: `
      uniform float uTime; varying vec2 vUv;
      void main(){
        vUv = uv;
        vec3 p = position;
        p.x += sin(p.y * 0.4 + uTime * 1.6) * 0.3 * (1.0 - uv.y);   // sway, dead still at the lip
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: `
      uniform float uTime; uniform vec3 uFoam; uniform vec3 uBody; uniform vec3 uDeep;
      varying vec2 vUv;
      float h(float x){ return fract(sin(x * 91.17) * 43758.5453); }
      void main(){
        // meandering vertical strands, falling DOWNWARD (continuous with the river)
        float wob = sin(vUv.y * 7.0 + uTime * 1.3) * 0.02
                  + (h(floor(vUv.y * 30.0)) - 0.5) * 0.03;
        float ux = vUv.x + wob;
        float lane = floor(ux * 60.0);
        float sp = 1.5 + h(lane) * 0.9;
        float flow = fract(vUv.y * 2.2 + uTime * sp + h(lane));
        float strand = smoothstep(0.0, 0.45, flow) * smoothstep(1.0, 0.55, flow);
        // teal body (matches river) -> whitens via strands toward the base
        vec3 col = mix(uDeep, uBody, smoothstep(0.0, 0.5, vUv.y));
        col = mix(col, uFoam, strand * (0.25 + 0.4 * (1.0 - vUv.y)));
        // crest foam exactly at the lip = the seam / acceleration zone
        float crest = smoothstep(0.82, 0.99, vUv.y);
        float crestFoam = crest * (0.45 + 0.55 * fract(ux * 30.0 + uTime * 2.6 + h(floor(ux * 30.0))));
        col = mix(col, uFoam, crestFoam * 0.8);
        // irregular soft side edges
        float ln = h(floor(vUv.y * 22.0)) * 0.08;
        float rn = h(floor(vUv.y * 22.0) + 9.0) * 0.08;
        float sideFade = smoothstep(0.0, 0.16 + ln, ux) * smoothstep(1.0, 0.84 - rn, ux);
        float botFade = smoothstep(0.0, 0.28, vUv.y);
        float a = (0.62 + strand * 0.35) * sideFade * botFade;
        a = clamp(a + crestFoam * 0.4 * sideFade, 0.0, 0.95);
        gl_FragColor = vec4(col, a);
      }`,
  });
  const fall = new THREE.Mesh(buildFallGeometry(wfWidth), fallMat);
  scene.add(fall);

  // Rising mist cloud at the base — soft, diffuse haze (not a bright orb)
  const n = 520;
  const mg = new THREE.BufferGeometry();
  const mp = new Float32Array(n * 3), mph = new Float32Array(n), msc = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    mp[i * 3]     = cx + (Math.random() - 0.5) * (wfWidth + 6);
    mp[i * 3 + 1] = topY - fallH + 2 + Math.random() * 20;
    mp[i * 3 + 2] = zFall + (Math.random() - 0.5) * 26;
    mph[i] = Math.random() * 6.28;
    msc[i] = 0.6 + Math.random() * 1.0;
  }
  mg.setAttribute("position", new THREE.BufferAttribute(mp, 3));
  mg.setAttribute("aPhase", new THREE.BufferAttribute(mph, 1));
  mg.setAttribute("aScale", new THREE.BufferAttribute(msc, 1));
  const mistMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    uniforms: { uTime: uTime, uColor: { value: new THREE.Color(0xc6e6f0) } },
    vertexShader: `
      uniform float uTime; attribute float aPhase; attribute float aScale; varying float vF;
      void main(){
        vec3 p = position;
        float rise = mod(uTime * 0.8 + aPhase, 4.0);
        p.y += rise + sin(uTime * 0.6 + aPhase) * 0.8;            // low billow, not a column
        p.x += sin(uTime * 0.4 + aPhase) * 1.6;
        p.z -= rise * 0.18;                                       // drifts downstream with the flow
        // fade in low, fade out quickly -> soft hugging haze
        vF = smoothstep(0.0, 1.0, rise) * smoothstep(4.0, 2.0, rise);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = aScale * 80.0 * (300.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying float vF; uniform vec3 uColor;
      void main(){
        float d = distance(gl_PointCoord, vec2(0.5));
        float a = smoothstep(0.5, 0.05, d);   // soft-edged puff
        gl_FragColor = vec4(uColor, a * 0.10 * vF);
      }`,
  });
  const mist = new THREE.Points(mg, mistMat);
  mist.frustumCulled = false;
  scene.add(mist);
}

/* ----------------------------------------------------------------------------
   11c · Plunge pool + rocks at the gorge floor where the fall lands
---------------------------------------------------------------------------- */
{
  const zFall = CFG.worldEndZ - 16;
  const cx = riverCenterX(zFall);
  const floorY = -80;                       // matches the carved gorge floor
  const zDrop = CFG.worldEndZ - 15;         // where the fall actually lands
  const poolR = 42;                         // generous body to match the fall's scale

  // Plunge pool — readable water surface, churning impact foam, expanding ripple ring
  const poolMat = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: uTime,
      uDeep: { value: new THREE.Color(0x1f4a55) },
      uShallow: { value: new THREE.Color(0x4fb6c4) },   // = river/fall colour
      uFoam: { value: new THREE.Color(0xe8fbff) },
    },
    vertexShader: `
      varying vec2 vUv; uniform float uTime;
      void main(){ vUv = uv; vec3 p = position;
        p.z += sin(p.x*0.2 + uTime*1.2)*0.5; gl_Position = projectionMatrix*modelViewMatrix*vec4(p,1.0); }`,
    fragmentShader: `
      varying vec2 vUv; uniform float uTime; uniform vec3 uDeep; uniform vec3 uShallow; uniform vec3 uFoam;
      void main(){
        vec2 c = vUv - 0.5; float r = length(c) * 2.0;        // 0 centre -> 1 shore
        // teal surface, lighter at the shallows near shore
        vec3 col = mix(uShallow, uDeep, smoothstep(0.15, 0.9, r));
        // gentle concentric ripples
        float ripple = sin(r*18.0 - uTime*2.6)*0.5 + 0.5;
        col += ripple * 0.05 * smoothstep(1.0, 0.25, r);
        // churning foam right where the water lands (pool centre = impact)
        float churn = 0.5 + 0.5 * fract(r*7.0 - uTime*1.6 + sin(atan(c.y, c.x)*5.0));
        float foam = smoothstep(0.34, 0.0, r) * churn;
        // an expanding foam ring pulsing outward from the impact
        float rp = fract(uTime * 0.22);
        float foamRing = smoothstep(0.07, 0.0, abs(r - rp)) * (1.0 - rp);
        col = mix(col, uFoam, clamp(foam*0.7 + foamRing*0.5, 0.0, 0.9));
        float edge = smoothstep(1.0, 0.82, r);                // soft shoreline
        gl_FragColor = vec4(col, edge * 0.96);
      }`,
  });
  const pool = new THREE.Mesh(new THREE.CircleGeometry(poolR, 72), poolMat);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(cx, floorY + 2.0, zDrop);          // centred on the impact
  scene.add(pool);

  // Low-poly rocks ringing the shoreline (grounded, half in the water)
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x6b6356, roughness: 1, flatShading: true });
  const wetRockMat = new THREE.MeshStandardMaterial({ color: 0x45463d, roughness: 0.4, metalness: 0.12, flatShading: true });
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2 + Math.random() * 0.3;
    const rad = poolR - 4 + Math.random() * 12;           // sit on the shoreline
    const x = cx + Math.cos(ang) * rad;
    const z = zDrop + Math.sin(ang) * rad;
    const g = new THREE.IcosahedronGeometry(3 + Math.random() * 4.5, 0);
    g.scale(1 + Math.random() * 0.6, 0.7 + Math.random() * 0.6, 1 + Math.random() * 0.6);
    const m = new THREE.Mesh(g, rad < poolR + 1 ? wetRockMat : rockMat);
    m.position.set(x, floorY + 0.5 + Math.random() * 2.5, z);
    m.rotation.set(Math.random(), Math.random() * 6.28, Math.random());
    scene.add(m);
  }
}

/* ----------------------------------------------------------------------------
   11d · Cliff-face detail — rock relief, wet sheen, and moss around the fall
---------------------------------------------------------------------------- */
{
  const zFall = CFG.worldEndZ - 16;
  const cx = riverCenterX(zFall);
  const halfW = CFG.riverWidth / 2;                   // curtain half-width (matches river)

  const wetRock = new THREE.MeshStandardMaterial({ color: 0x45463d, roughness: 0.4, metalness: 0.12, flatShading: true });
  const dryRock = new THREE.MeshStandardMaterial({ color: 0x6b6356, roughness: 1.0, flatShading: true });
  const mossMat = new THREE.MeshStandardMaterial({ color: 0x4e7a36, roughness: 0.9, flatShading: true });

  function placeRock(x, y, z, s, mat) {
    const g = new THREE.IcosahedronGeometry(s, 0);
    g.scale(1 + Math.random() * 0.7, 0.7 + Math.random() * 0.7, 1 + Math.random() * 0.7);
    const m = new THREE.Mesh(g, mat);
    m.position.set(x, y, z);
    m.rotation.set(Math.random() * 0.6, Math.random() * 6.28, Math.random() * 0.6);
    scene.add(m);
    return m;
  }

  // Rocks seated down both flanks of the falls — break up the flat cliff polygon
  for (let side = -1; side <= 1; side += 2) {
    for (let k = 0; k < 7; k++) {
      const z = zFall + 4 - k * 2 + (Math.random() - 0.5) * 2;       // follow the face down
      const x = cx + side * (halfW + 1 + Math.random() * 5);
      const y = terrainHeight(x, z) + 1.2;                           // rest on the cliff slope
      const wet = y < -34;                                           // lower = spray-soaked
      const s = 3 + Math.random() * 4;
      placeRock(x, y, z, s, wet ? wetRock : dryRock);
      if (!wet && Math.random() < 0.5) placeRock(x + (Math.random() - 0.5) * 3, y + s * 0.5, z, 1.1 + Math.random(), mossMat);
    }
  }

  // Wet boulders flanking the plunge pool
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI - Math.PI * 0.1;
    const x = cx + Math.cos(ang) * (halfW + 4);
    const z = (zFall - 14) + Math.sin(ang) * 10;
    placeRock(x, terrainHeight(x, z) + 2, z, 3 + Math.random() * 3, wetRock);
  }

  // Moss / grass tufts along the cliff lip (top edge of the drop)
  for (let i = 0; i < 24; i++) {
    const x = cx + (Math.random() - 0.5) * (halfW * 2 + 18);
    const z = zFall + 10 + Math.random() * 6;                        // just upstream of the brink
    const y = terrainHeight(x, z);
    const g = new THREE.ConeGeometry(0.45 + Math.random() * 0.5, 1.3 + Math.random(), 5);
    const m = new THREE.Mesh(g, mossMat);
    m.position.set(x, y + 0.7, z);
    m.rotation.y = Math.random() * 6.28;
    scene.add(m);
  }
}

/* ----------------------------------------------------------------------------
   11e · Splash burst where the falling water strikes the plunge pool
---------------------------------------------------------------------------- */
{
  const zFall = CFG.worldEndZ - 16;
  const cx = riverCenterX(zFall);
  const impactY = -77;                         // pool surface level
  const n = 260;
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array(n * 3);
  const dir = new Float32Array(n * 2);
  const ph = new Float32Array(n);
  const sc = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    pos[i * 3]     = cx + (Math.random() - 0.5) * (CFG.riverWidth - 2);   // across the impact line
    pos[i * 3 + 1] = impactY;
    pos[i * 3 + 2] = (zFall - 2) + (Math.random() - 0.5) * 7;
    const a = Math.random() * Math.PI * 2;
    const r = 0.4 + Math.random();
    dir[i * 2] = Math.cos(a) * r;
    dir[i * 2 + 1] = Math.sin(a) * r;
    ph[i] = Math.random() * 1.5;
    sc[i] = 0.7 + Math.random() * 0.9;
  }
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aDir", new THREE.BufferAttribute(dir, 2));
  g.setAttribute("aPhase", new THREE.BufferAttribute(ph, 1));
  g.setAttribute("aScale", new THREE.BufferAttribute(sc, 1));
  const splashMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: uTime, uColor: { value: new THREE.Color(0xeafcff) } },
    vertexShader: `
      uniform float uTime; attribute vec2 aDir; attribute float aPhase; attribute float aScale; varying float vF;
      void main(){
        float life = 1.5;
        float tt = mod(uTime + aPhase, life);
        vec3 p = position;
        p.y += 14.0 * tt - 9.0 * tt * tt;        // launch up, arc back down
        p.x += aDir.x * tt * 7.0;                // spread outward
        p.z += aDir.y * tt * 7.0;
        vF = (1.0 - tt / life) * smoothstep(0.0, 0.12, tt);   // fade in at launch, out at end
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = aScale * 26.0 * (300.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColor; varying float vF;
      void main(){
        float d = distance(gl_PointCoord, vec2(0.5));
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(uColor, a * vF * 0.45);
      }`,
  });
  const splash = new THREE.Points(g, splashMat);
  splash.frustumCulled = false;
  scene.add(splash);
}

/* ----------------------------------------------------------------------------
   11f · Gorge framing — trees on the rims & rocks on the canyon walls (fill the flanks)
---------------------------------------------------------------------------- */
{
  const zc = CFG.worldEndZ - 16;
  const cxc = riverCenterX(zc);

  // Trees lining both rims of the gorge (only where the ground is above water)
  const treeGeo = buildTreeGeometry();
  const treeMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true });
  applyWind(treeMat, 0.18, 0.5);
  for (let side = -1; side <= 1; side += 2) {
    for (let k = 0; k < 7; k++) {
      const z = zc + 24 - k * 24 + (Math.random() - 0.5) * 10;
      const x = cxc + side * (46 + Math.random() * 34);
      const y = terrainHeight(x, z);
      if (y < CFG.waterY + 1) continue;               // keep them on the rim, not in the gorge
      const m = new THREE.Mesh(treeGeo, treeMat);
      const s = 0.8 + Math.random() * 0.7;
      m.position.set(x, y - 0.4, z);
      m.scale.set(s, s * (0.9 + Math.random() * 0.4), s);
      m.rotation.y = Math.random() * 6.28;
      scene.add(m);
    }
  }

  // Rocks studding the canyon walls
  const wallRock = new THREE.MeshStandardMaterial({ color: 0x5f584c, roughness: 1, flatShading: true });
  for (let side = -1; side <= 1; side += 2) {
    for (let k = 0; k < 8; k++) {
      const z = zc - k * 16 + (Math.random() - 0.5) * 10;
      const x = cxc + side * (30 + Math.random() * 28);
      const y = terrainHeight(x, z) + 1;
      const g = new THREE.IcosahedronGeometry(3 + Math.random() * 5, 0);
      g.scale(1 + Math.random() * 0.7, 0.7 + Math.random() * 0.6, 1 + Math.random() * 0.7);
      const m = new THREE.Mesh(g, wallRock);
      m.position.set(x, y, z);
      m.rotation.set(Math.random(), Math.random() * 6.28, Math.random());
      scene.add(m);
    }
  }
}

/* ----------------------------------------------------------------------------
   12 · Particle systems (pollen, fireflies) — GPU-animated Points
---------------------------------------------------------------------------- */
function makeParticles({ count, zMin, zMax, yMin, yMax, color, size, drift, additive }) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const scale = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 280;
    pos[i * 3 + 1] = THREE.MathUtils.lerp(yMin, yMax, Math.random());
    pos[i * 3 + 2] = THREE.MathUtils.lerp(zMin, zMax, Math.random());
    phase[i] = Math.random() * 6.28;
    scale[i] = 0.5 + Math.random();
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
  geo.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    uniforms: { uTime: uTime, uColor: { value: new THREE.Color(color) }, uSize: { value: size }, uDrift: { value: drift } },
    vertexShader: `
      uniform float uTime; uniform float uSize; uniform float uDrift;
      attribute float aPhase; attribute float aScale;
      varying float vFlick;
      void main(){
        vec3 p = position;
        p.x += sin(uTime*0.5 + aPhase)*uDrift;
        p.y += sin(uTime*0.7 + aPhase*1.3)*uDrift*0.6;
        p.z += cos(uTime*0.4 + aPhase)*uDrift;
        vFlick = 0.5 + 0.5*sin(uTime*2.5 + aPhase*4.0);
        vec4 mv = modelViewMatrix * vec4(p,1.0);
        gl_PointSize = uSize * aScale * (300.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColor; varying float vFlick;
      void main(){
        float d = distance(gl_PointCoord, vec2(0.5));
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(uColor, a * vFlick);
      }`,
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  scene.add(pts);
  return mat;
}

// golden pollen over the fields
makeParticles({ count: 600, zMin: -160, zMax: 30, yMin: 1, yMax: 22, color: 0xffe39a, size: 7, drift: 3, additive: true });
// fireflies in the forest (will glow stronger as it darkens)
const fireflyMat = makeParticles({ count: 700, zMin: -540, zMax: -150, yMin: 1, yMax: 16, color: 0xc8ff8a, size: 9, drift: 2.5, additive: true });
fireflyMat.uniforms.uColor.value.set(0xbfff7a);
// fine atmospheric dust everywhere (depth)
makeParticles({ count: 400, zMin: -540, zMax: 30, yMin: 0, yMax: 40, color: 0xffffff, size: 3, drift: 1.5, additive: true });

/* ----------------------------------------------------------------------------
   13 · Birds (a drifting flock, wings flapping) — CPU light
---------------------------------------------------------------------------- */
const birds = [];
function buildBirdFlock(n, region) {
  const mat = new THREE.MeshBasicMaterial({ color: 0x2a2a2a, side: THREE.DoubleSide, fog: true });
  for (let i = 0; i < n; i++) {
    const g = new THREE.Group();
    const wingGeo = new THREE.BufferGeometry();
    // a simple triangle wing
    wingGeo.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 1.2, 0, -0.3, 1.2, 0, 0.3], 3));
    wingGeo.computeVertexNormals();
    const left = new THREE.Mesh(wingGeo, mat);
    const right = new THREE.Mesh(wingGeo, mat);
    right.scale.x = -1;
    g.add(left, right);
    g.userData = {
      speed: 6 + Math.random() * 6,
      flap: 6 + Math.random() * 4,
      phase: Math.random() * 6.28,
      x: (Math.random() - 0.5) * 200,
      y: region.y + Math.random() * 25,
      z: THREE.MathUtils.lerp(region.zMin, region.zMax, Math.random()),
      dir: Math.random() > 0.5 ? 1 : -1,
    };
    g.scale.setScalar(1.2 + Math.random() * 1.4);
    scene.add(g);
    birds.push(g);
  }
}
buildBirdFlock(14, { y: 30, zMin: -480, zMax: 20 });

/* ----------------------------------------------------------------------------
   14 · Butterflies & drifting leaves (small flapping sprites) — CPU
---------------------------------------------------------------------------- */
const flutterers = [];
function buildFlutterers() {
  // butterflies: colourful, near the path
  const fly = (color, count, zMin, zMax, yBase, kind) => {
    const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 0.95 });
    for (let i = 0; i < count; i++) {
      const g = new THREE.Group();
      const wGeo = new THREE.PlaneGeometry(0.6, 0.9);
      wGeo.translate(0.3, 0, 0);
      const l = new THREE.Mesh(wGeo, mat);
      const r = new THREE.Mesh(wGeo, mat);
      r.scale.x = -1;
      g.add(l, r);
      g.userData = {
        kind,
        l, r,
        flap: kind === "butterfly" ? 10 + Math.random() * 6 : 3 + Math.random() * 2,
        phase: Math.random() * 6.28,
        cx: (Math.random() - 0.5) * 120,
        cz: THREE.MathUtils.lerp(zMin, zMax, Math.random()),
        y: yBase + Math.random() * 6,
        r0: 6 + Math.random() * 10,
        spd: 0.2 + Math.random() * 0.4,
        fall: kind === "leaf" ? 1.5 + Math.random() * 2 : 0,
      };
      g.scale.setScalar(kind === "butterfly" ? 1 : 1.4);
      scene.add(g);
      flutterers.push(g);
    }
  };
  fly(0xff8a5c, 10, -150, 25, 3, "butterfly");
  fly(0xffd45c, 8, -150, 25, 3, "butterfly");
  // drifting leaves in the forest
  fly(0xc98a3a, 18, -520, -150, 14, "leaf");
  fly(0x8aa84a, 14, -520, -150, 14, "leaf");
}
buildFlutterers();

/* ----------------------------------------------------------------------------
   15 · Camera path (CatmullRom through farmland -> river bank)
---------------------------------------------------------------------------- */
const pathPoints = [];
{
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const z = THREE.MathUtils.lerp(CFG.worldStartZ, CFG.worldEndZ + 30, t);
    let x;
    if (z > CFG.riverStartZ) {
      x = Math.sin(z * 0.02) * 10;                   // wander the field path
    } else {
      x = riverCenterX(z) + 18;                       // walk the right bank
    }
    pathPoints.push(new THREE.Vector3(x, 8, z));
  }
}
const camCurve = new THREE.CatmullRomCurve3(pathPoints, false, "catmullrom", 0.5);

/* ----------------------------------------------------------------------------
   16 · Scroll, phases & DOM wiring
---------------------------------------------------------------------------- */
let targetProgress = 0;
let progress = 0;

const phaseStops = [
  // progress, label, dotColor
  { p: 0.0, name: "FARMLANDS", color: "#ffcf6b" },
  { p: 0.58, name: "MANGO FARM", color: "#f4b13a" },
  { p: 0.8, name: "THE RIVER", color: "#74c7d6" },
  { p: 0.93, name: "WATERFALL", color: "#74c7d6" },
];
const phaseNameEl = document.getElementById("phase-name");
const phaseDotEl = document.querySelector(".phase-dot");
const progressFill = document.getElementById("progress-fill");
let lastPhase = -1;

function getScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
}
window.addEventListener("scroll", () => { targetProgress = getScrollProgress(); }, { passive: true });
targetProgress = getScrollProgress();

// Panel reveal
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.target.classList.toggle("in", e.isIntersecting)),
  { threshold: 0.25 }
);
document.querySelectorAll(".panel").forEach((p) => io.observe(p));

// Sky/light colour keyframes along the journey
const keys = [
  { p: 0.0, top: 0xaed3e8, bot: 0xffe2b0, fog: 0xf6dcae, sun: 0xfff0c2, hemiSky: 0xffe9c4, hemiGr: 0x6a6a36, dir: 0xfff0cf, dirI: 2.1, amb: 0.25 },
  { p: 0.5, top: 0x86b48f, bot: 0xd6ecb6, fog: 0xc3ddaa, sun: 0xeaf6c0, hemiSky: 0xdaf0c0, hemiGr: 0x3a5a30, dir: 0xeafbc8, dirI: 1.8, amb: 0.3 },
  { p: 0.78, top: 0x4f7488, bot: 0x9fd0d4, fog: 0x8fc2c8, sun: 0xcaf2f2, hemiSky: 0xbfe6ea, hemiGr: 0x2c4a44, dir: 0xd8f4f0, dirI: 1.5, amb: 0.32 },
  { p: 1.0, top: 0x32506e, bot: 0x7cc0cc, fog: 0x6fb0bb, sun: 0xbfeef0, hemiSky: 0x9fd6dc, hemiGr: 0x24403c, dir: 0xc8eef0, dirI: 1.35, amb: 0.35 },
];
const _cA = new THREE.Color(), _cB = new THREE.Color();
function lerpColorHex(a, b, t, out) { out.set(a); _cB.set(b); return out.lerp(_cB, t); }

function updateAtmosphere(p) {
  let i = 0;
  while (i < keys.length - 1 && p > keys[i + 1].p) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  const span = Math.max(0.0001, b.p - a.p);
  const t = THREE.MathUtils.clamp((p - a.p) / span, 0, 1);

  lerpColorHex(a.top, b.top, t, skyUniforms.uTop.value);
  lerpColorHex(a.bot, b.bot, t, skyUniforms.uBottom.value);
  lerpColorHex(a.fog, b.fog, t, fog.color);
  lerpColorHex(a.sun, b.sun, t, sunUniforms.uColor.value);
  lerpColorHex(a.sun, b.sun, t, sunLight.color);
  lerpColorHex(a.hemiSky, b.hemiSky, t, hemi.color);
  lerpColorHex(a.hemiGr, b.hemiGr, t, hemi.groundColor);
  lerpColorHex(a.dir, b.dir, t, sunLight.color);
  sunLight.intensity = THREE.MathUtils.lerp(a.dirI, b.dirI, t);
  ambient.intensity = THREE.MathUtils.lerp(a.amb, b.amb, t);

  // sun stays hidden on the opening green face, then eases in along the journey
  sunUniforms.uOpacity.value = THREE.MathUtils.smoothstep(p, 0.12, 0.42);

  // fireflies fade in as the world cools
  fireflyMat.uniforms.uColor.value.lerpColors(new THREE.Color(0x4a6a2a), new THREE.Color(0xd6ff8a), THREE.MathUtils.smoothstep(p, 0.45, 0.9));
}

function updatePhaseUI(p) {
  let idx = 0;
  for (let i = 0; i < phaseStops.length; i++) if (p >= phaseStops[i].p) idx = i;
  if (idx !== lastPhase) {
    lastPhase = idx;
    phaseNameEl.textContent = phaseStops[idx].name;
    phaseDotEl.style.background = phaseStops[idx].color;
    phaseDotEl.style.boxShadow = `0 0 14px ${phaseStops[idx].color}`;
  }
  progressFill.style.height = (p * 100).toFixed(1) + "%";
}

/* ----------------------------------------------------------------------------
   17 · Mouse parallax
---------------------------------------------------------------------------- */
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
window.addEventListener("pointermove", (e) => {
  mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
});

/* ----------------------------------------------------------------------------
   18 · Render loop
---------------------------------------------------------------------------- */
const clock = new THREE.Clock();
const _look = new THREE.Vector3();
const _camTarget = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();

function frame() {
  const dt = Math.min(clock.getDelta(), 0.05);
  uTime.value += dt;

  // smooth scroll progress
  progress += (targetProgress - progress) * Math.min(1, dt * 4.5);

  // camera along the curve
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  camCurve.getPointAt(p, _camTarget);
  _camTarget.y = terrainHeight(_camTarget.x, _camTarget.z) + 6.5;

  const ahead = Math.min(p + 0.025, 1);
  camCurve.getPointAt(ahead, _lookTarget);
  _lookTarget.y = terrainHeight(_lookTarget.x, _lookTarget.z) + 5.0;

  // At the very end, glide in front of and below the drop to face the waterfall
  if (p > 0.8) {
    const k = THREE.MathUtils.smoothstep(p, 0.8, 1.0);
    _camTarget.lerp(waterfallView, k);
    _lookTarget.lerp(waterfallPos, k);
  }

  // mouse parallax
  mouse.x += (mouse.tx - mouse.x) * 0.05;
  mouse.y += (mouse.ty - mouse.y) * 0.05;
  _camTarget.x += mouse.x * 2.4;
  _camTarget.y += -mouse.y * 1.6;

  // Terrain floor clamp: never let the target dip below the ground (e.g. while the
  // transition lerps over the cliff lip toward the gorge overlook).
  const targetFloor = terrainHeight(_camTarget.x, _camTarget.z) + 4.0;
  if (_camTarget.y < targetFloor) _camTarget.y = targetFloor;

  camera.position.lerp(_camTarget, Math.min(1, dt * 3.2));
  // Safety clamp on the smoothed position too, so the lag never clips underground.
  const camFloor = terrainHeight(camera.position.x, camera.position.z) + 2.5;
  if (camera.position.y < camFloor) camera.position.y = camFloor;
  _look.lerp(_lookTarget, Math.min(1, dt * 3.2));
  camera.lookAt(_look);

  // sun follows roughly ahead/low
  sun.position.set(_camTarget.x - 90, 55, _camTarget.z - 320);
  sun.lookAt(camera.position);

  // windmill sails
  windmillRotors.forEach((r, i) => (r.rotation.z += dt * (0.4 + i * 0.05)));

  // grazing animals (goat, sheep, hen, chicken) ambling along the grass
  walkers.forEach((g) => {
    const w = g.userData.walk;
    w.t += dt * w.speed;
    // drift around the anchor in a slow loose loop (each animal roams its own patch)
    const z = w.z0 + Math.sin(w.t) * w.az;
    const x = w.x0 + Math.cos(w.t * 0.7) * w.ax;
    const y = terrainHeight(x, z);
    // face the direction of travel (head is along local +x)
    const vx = x - w.px, vz = z - w.pz;
    if (vx * vx + vz * vz > 1e-7) {
      const target = Math.atan2(-vz, vx);
      const d = ((target - g.rotation.y + Math.PI) % (Math.PI * 2)) - Math.PI;
      g.rotation.y += d * Math.min(1, dt * 3);            // smooth U-turns
    }
    // gentle body bob plus swinging legs
    const stride = w.t * Math.PI * 2 * w.gait;
    g.position.set(x, y + Math.abs(Math.sin(stride)) * w.bob, z);
    g.userData.legs.forEach((L) => {
      L.rotation.z = Math.sin(stride + L.userData.phase) * w.swing;
    });
    w.px = x; w.pz = z;
  });

  // farmer on the tractor — drives its looping field route
  tractor.update(dt, p);

  // spatial ambience follows the journey
  audioEngine.update(p, dt);

  // birds
  birds.forEach((b) => {
    const u = b.userData;
    u.x += u.speed * u.dir * dt;
    if (u.x > 140) u.x = -140;
    if (u.x < -140) u.x = 140;
    b.position.set(u.x, u.y + Math.sin(uTime.value * 0.6 + u.phase) * 2, u.z);
    b.rotation.y = u.dir > 0 ? -Math.PI / 2 : Math.PI / 2;
    const flap = Math.sin(uTime.value * u.flap + u.phase) * 0.7;
    b.children[0].rotation.z = flap;
    b.children[1].rotation.z = flap;
  });

  // butterflies & leaves
  flutterers.forEach((f) => {
    const u = f.userData;
    const a = uTime.value * u.spd + u.phase;
    if (u.kind === "butterfly") {
      const x = u.cx + Math.cos(a) * u.r0;
      const z = u.cz + Math.sin(a * 1.3) * u.r0 * 0.6;
      const y = terrainHeight(x, z) + u.y + Math.sin(a * 2.0) * 1.5;
      f.position.set(x, y, z);
      f.rotation.y = a;
      const fl = Math.sin(uTime.value * u.flap + u.phase);
      f.userData.l.rotation.y = fl * 1.1;
      f.userData.r.rotation.y = -fl * 1.1;
    } else {
      // leaf: spiral down then respawn
      u.y -= u.fall * dt;
      let y = terrainHeight(u.cx, u.cz) + u.y;
      if (y < terrainHeight(u.cx, u.cz) + 0.5) { u.y = 16 + Math.random() * 8; }
      const x = u.cx + Math.cos(a) * u.r0 * 0.4;
      const z = u.cz + Math.sin(a) * u.r0 * 0.4;
      f.position.set(x, terrainHeight(u.cx, u.cz) + u.y, z);
      f.rotation.set(a, a * 1.3, a * 0.7);
    }
  });

  updateAtmosphere(p);
  updatePhaseUI(p);

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

/* ----------------------------------------------------------------------------
   19 · Resize
---------------------------------------------------------------------------- */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/* ----------------------------------------------------------------------------
   20 · Loader -> reveal, then start
---------------------------------------------------------------------------- */
function smoothstep(edge0, edge1, x) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

const loaderFill = document.getElementById("loader-fill");
const loaderEl = document.getElementById("loader");
const startBtn = document.getElementById("start-btn");
// Quick fill (~0.9s); the loader then auto-dismisses after a short readable hold
// so the intro can be taken in (the "enter" button is gone — no click needed).
const LOAD_MS = 900;
const LOADER_HOLD_MS = 1100;   // pause after the fill completes before the curtain lifts
const loadStart = performance.now();
function loaderTick(now) {
  const p = Math.min(1, (now - loadStart) / LOAD_MS);
  if (loaderFill) loaderFill.style.width = (p * 100).toFixed(1) + "%";
  if (p < 1) requestAnimationFrame(loaderTick);
  else if (startBtn) startBtn.classList.add("ready");
  else if (loaderEl) setTimeout(() => loaderEl.classList.add("done"), LOADER_HOLD_MS);
}
requestAnimationFrame(loaderTick);
if (startBtn) startBtn.addEventListener("click", () => loaderEl && loaderEl.classList.add("done"));

/* ----------------------------------------------------------------------------
   21 · Spatial ambience — a living, procedural soundscape (no asset files)

   Every layer is synthesized live with the Web Audio API, so it weighs 0 KB
   and never loops/repeats. Localized sources (tractor, windmills, river,
   forest birds, waterfall) run through Three.js PositionalAudio attached to
   real scene objects, so proximity attenuation and stereo panning track the
   camera automatically. Stereo beds (wind, crickets, leaves) fade by scroll
   progress. A master gain (the AudioListener) handles mute + autoplay policy.
---------------------------------------------------------------------------- */
const soundBtn = document.getElementById("sound-toggle");
const audioEngine = (() => {
  const MASTER = 0.6;
  let listener = null, ctx = null, inited = false, ambienceOn = false;
  let whiteBuf = null, brownBuf = null;
  const layers = [];

  // Envelope helpers (scroll progress p -> 0..1 chapter gain) ----------------
  const trap = (p, a, b, c, d) => Math.max(0, Math.min(smoothstep(a, b, p), 1 - smoothstep(c, d, p)));
  const envFarm     = (p) => trap(p, -1, 0, 0.46, 0.64);   // tractor, crickets
  const envWindmill = (p) => trap(p, -1, 0, 0.52, 0.70);   // distance also gates
  const envWind     = (p) => 0.6 + 0.4 * smoothstep(0.84, 1.0, p);
  const envRiver    = (p) => trap(p, 0.42, 0.62, 9, 10);   // begins early, stays
  const envForest   = (p) => trap(p, 0.50, 0.66, 0.90, 0.98);
  const envFall     = (p) => smoothstep(0.78, 0.97, p);

  function makeNoise(seconds, kind) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    if (kind === "brown") {
      let last = 0;
      for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2; }
    } else {
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    return buf;
  }

  function init() {
    inited = true;
    listener = new THREE.AudioListener();
    camera.add(listener);
    ctx = listener.context;
    listener.setMasterVolume(0);
    whiteBuf = makeNoise(4, "white");
    brownBuf = makeNoise(4, "brown");

    // --- tiny node helpers ---
    const src = (buf) => { const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.start(); return s; };
    const gain = (v) => { const g = ctx.createGain(); g.gain.value = v; return g; };
    const filt = (type, freq, q) => { const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; if (q != null) f.Q.value = q; return f; };
    const pan = (v) => { const p = ctx.createStereoPanner(); p.pan.value = v; return p; };
    // modulate an AudioParam around its base value by ±depth at `rate` Hz
    const lfo = (rate, depth, target) => { const o = ctx.createOscillator(); o.frequency.value = rate; const g = gain(depth); o.connect(g).connect(target); o.start(); return o; };

    const addGlobal = (node, base, env) => {
      const a = new THREE.Audio(listener); a.setNodeSource(node); a.setVolume(0);
      layers.push({ a, base, env, cur: 0 });
    };
    const addPositional = (obj, node, ref, max, roll, base, env) => {
      const a = new THREE.PositionalAudio(listener);
      a.setNodeSource(node);
      a.setRefDistance(ref); a.setMaxDistance(max); a.setRolloffFactor(roll); a.setDistanceModel("linear");
      a.setVolume(0); obj.add(a);
      layers.push({ a, base, env, cur: 0 });
    };
    const live = () => ambienceOn && ctx.state === "running";

    /* WIND — wide gusty stereo bed (brown noise, LFO-swept lowpass) */
    {
      const out = gain(1);
      [-0.75, 0.75].forEach((px, i) => {
        const lp = filt("lowpass", 420, 0.7);
        lfo(0.07 + i * 0.03, 170, lp.frequency);            // slow gusts
        src(brownBuf).connect(lp).connect(gain(0.9)).connect(pan(px)).connect(out);
      });
      addGlobal(out, 0.10, envWind);
    }

    /* CRICKETS / grasshoppers — trilled band-passed noise, farmland only */
    {
      const out = gain(1);
      [-0.6, 0.6].forEach((px) => {
        const bp = filt("bandpass", 4600 + Math.random() * 600, 16);
        const am = gain(0.5);
        lfo(22 + Math.random() * 8, 0.5, am.gain);          // fast trill
        src(whiteBuf).connect(bp).connect(am).connect(pan(px)).connect(out);
      });
      addGlobal(out, 0.05, envFarm);
    }

    /* TRACTOR — a diesel "putt-putt" idle: irregular combustion thumps + low rumble.
       Timing + level jitter keep it from sounding like a steady electronic drone.
       The tractor is back, so its idle runs through PositionalAudio in the farmland. */
    {
      const bus = gain(1);

      // low rumble bed (the engine block resonating)
      const rumble = gain(0.16);
      [41, 41.7, 62].forEach((f) => { const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = f; lfo(0.07, 1.5, o.frequency); o.connect(rumble); o.start(); });
      rumble.connect(filt("lowpass", 200, 0.8)).connect(bus);

      // persistent combustion-grit noise, pulsed once per thump (no per-pulse sources)
      const knock = gain(0.0001);
      src(whiteBuf).connect(filt("bandpass", 240, 1.1)).connect(knock).connect(bus);

      (function chug() {
        if (live()) {
          const t = ctx.currentTime;
          const amp = 0.5 + Math.random() * 0.28;           // each combustion varies
          // piston knock: a quick low sine thump with a downward pitch blip
          const o = ctx.createOscillator(); o.type = "sine";
          const f0 = 78 + Math.random() * 18;
          o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(46, t + 0.07);
          const g = gain(0);
          g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(amp, t + 0.004); g.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
          o.connect(g).connect(bus); o.start(t); o.stop(t + 0.18);
          // grit pulse on the shared noise bus
          knock.gain.cancelScheduledValues(t);
          knock.gain.setValueAtTime(0.0001, t);
          knock.gain.linearRampToValueAtTime(amp * 0.16, t + 0.004);
          knock.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
        }
        setTimeout(chug, 95 + Math.random() * 38);          // irregular ~8-11 Hz idle
      })();

      addPositional(tractor.group, bus, 8, 130, 1.0, 0.5, envFarm);
    }

    /* WINDMILLS — blade whoosh synced to a slow LFO + occasional wood creak */
    windmills.forEach((w) => {
      const bus = gain(1);
      const bp = filt("bandpass", 500, 1.2);
      const swell = gain(0.4);
      lfo(0.65 + Math.random() * 0.25, 0.4, swell.gain);    // ~4 blades passing
      src(brownBuf).connect(bp).connect(swell).connect(bus);
      (function creak() {
        if (live()) {
          const t = ctx.currentTime, f0 = 120 + Math.random() * 120;
          const o = ctx.createOscillator(); o.type = "sawtooth";
          o.frequency.setValueAtTime(f0, t); o.frequency.linearRampToValueAtTime(f0 * 0.8, t + 0.25);
          const g = gain(0);
          g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.22, t + 0.04); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          o.connect(filt("bandpass", f0 * 2, 6)).connect(g).connect(bus); o.start(t); o.stop(t + 0.4);
        }
        setTimeout(creak, 2500 + Math.random() * 4500);
      })();
      addPositional(w, bus, 7, 64, 1.4, 0.6, envWindmill);
    });

    /* RIVER — babbling flow from several emitters placed along the channel */
    [-185, -285, -385, -475].forEach((z) => {
      const obj = new THREE.Object3D(); obj.position.set(riverCenterX(z), CFG.waterY, z); scene.add(obj);
      const bus = gain(1);
      const am = gain(0.7);
      lfo(0.5 + Math.random() * 0.4, 0.12, am.gain);        // gentle babble
      src(whiteBuf).connect(filt("bandpass", 1400, 0.8)).connect(filt("lowpass", 3000, 0.7)).connect(am).connect(bus);
      addPositional(obj, bus, 10, 110, 1.4, 0.13, envRiver);  // softened river — quieter, shorter reach
    });

    /* FOREST — leaf-rustle bed + randomized bird calls from scattered spots */
    {
      const out = gain(1);
      const am = gain(0.4);
      lfo(0.3, 0.35, am.gain);
      src(whiteBuf).connect(filt("highpass", 2600, 0.6)).connect(am).connect(out);
      addGlobal(out, 0.05, envForest);
    }
    [[-40, -220, 1.0], [55, -300, 1.3], [-60, -360, 0.85], [25, -430, 1.1]].forEach(([x, z, pitch]) => {
      const obj = new THREE.Object3D(); obj.position.set(x, terrainHeight(x, z) + 8, z); scene.add(obj);
      const bus = gain(1);
      addPositional(obj, bus, 6, 90, 1.2, 0.5, envForest);
      (function chirp() {
        if (live()) {
          const t = ctx.currentTime, notes = 1 + Math.floor(Math.random() * 3);
          for (let n = 0; n < notes; n++) {
            const ts = t + n * 0.12, f = (1700 + Math.random() * 1400) * pitch;
            const o = ctx.createOscillator(); o.type = "sine";
            o.frequency.setValueAtTime(f, ts); o.frequency.linearRampToValueAtTime(f * (1.05 + Math.random() * 0.3), ts + 0.08);
            const g = gain(0);
            g.gain.setValueAtTime(0, ts); g.gain.linearRampToValueAtTime(0.16, ts + 0.02); g.gain.exponentialRampToValueAtTime(0.001, ts + 0.12);
            o.connect(g).connect(bus); o.start(ts); o.stop(ts + 0.14);
          }
        }
        setTimeout(chirp, 1800 + Math.random() * 4200);
      })();
    });

    /* WATERFALL — layered roar (rumble + hiss) with turbulence and splashes */
    {
      const obj = new THREE.Object3D(); obj.position.copy(waterfallPos); scene.add(obj);
      const bus = gain(0.9);
      lfo(0.2, 0.15, bus.gain);                             // turbulence
      src(whiteBuf).connect(filt("lowpass", 320, 0.8)).connect(gain(0.6)).connect(bus);          // rumble
      src(whiteBuf).connect(filt("highpass", 1800, 0.6)).connect(filt("bandpass", 3500, 0.7)).connect(gain(0.35)).connect(bus); // hiss
      (function splash() {
        if (live()) {
          const t = ctx.currentTime, s = src(whiteBuf);
          const g = gain(0);
          g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.18, t + 0.05); g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
          s.connect(filt("bandpass", 2500, 1.2)).connect(g).connect(bus);
          setTimeout(() => { try { s.stop(); } catch (e) {} }, 800);
        }
        setTimeout(splash, 1100 + Math.random() * 1800);
      })();
      addPositional(obj, bus, 16, 200, 1.0, 0.55, envFall);
    }
  }

  function rampMaster(v, dur) {
    const g = listener.getInput().gain, now = ctx.currentTime;
    g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(v, now + dur);
  }

  function toggle() {
    if (!inited) init();
    ambienceOn = !ambienceOn;
    if (ambienceOn) {
      if (ctx.state !== "running") ctx.resume();
      rampMaster(MASTER, 0.9);
      soundBtn.classList.add("playing");
      soundBtn.setAttribute("aria-pressed", "true");
    } else {
      rampMaster(0, 0.6);
      soundBtn.classList.remove("playing");
      soundBtn.setAttribute("aria-pressed", "false");
      setTimeout(() => { if (!ambienceOn && ctx.state === "running") ctx.suspend(); }, 700);
    }
  }

  // Per-frame: lerp each layer toward base × chapter-envelope (panner handles
  // distance/stereo on its own). Smooth, framerate-independent crossfades.
  function update(p, dt) {
    if (!inited) return;
    const k = Math.min(1, (dt || 0.016) * 2.2);
    for (const L of layers) {
      const target = (ambienceOn ? 1 : 0) * L.base * L.env(p);
      L.cur += (target - L.cur) * k;
      L.a.setVolume(L.cur);
    }
  }

  return { toggle, update };
})();

soundBtn.addEventListener("click", () => audioEngine.toggle());

// kick off
frame();
