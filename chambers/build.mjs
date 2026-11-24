// Bundles the three chambers into self-contained single-file HTML (no CDN, works offline in a WebView).
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(resolve(here, p), 'utf8');
const safeJs = (s) => s.replace(/<\/script/gi, '<\\/script');
const safeCss = (s) => s.replace(/<\/style/gi, '<\\/style');

const stripQuery = { name: 'strip-query', setup(b) {
  b.onResolve({ filter: /\?v=\d+$/ }, (a) => ({ path: resolve(a.resolveDir, a.path.replace(/\?v=\d+$/, '')) }));
} };

async function bundle(entry, extra = {}) {
  const r = await build({
    entryPoints: [resolve(here, entry)], bundle: true, minify: true, write: false, format: 'iife',
    target: 'es2019', plugins: [stripQuery], define: { 'import.meta.url': '"https://eyesofgod.invalid/chambers/js/main.js"' }, legalComments: 'none', ...extra,
  });
  return r.outputFiles[0].text;
}

// Text that reads like documentation of a prototype becomes part of the lore.
const lore = (html) => html
  .replace(/<span class="pi">&pi;<\/span> RuView/g, '<span class="pi">&#9737;</span> EyesOfGod')
  .replace(/RuView · Seldon Vault/g, 'EyesOfGod · The Vault')
  .replace(/RuView Observatory — WiFi DensePose/g, 'EyesOfGod — The Observatory')
  .replace(/RuView — Dual-Modal Pose Estimation/g, 'EyesOfGod — The Convergence')
  .replace(/RuView — Camera \+ WiFi CSI Point Cloud/g, 'EyesOfGod — The Vault')
  .replace(/RuView &middot; Dual-Modal Pose Estimation &middot;/g, 'EyesOfGod &middot; The Convergence &middot;')
  .replace(/<a href="https:\/\/github\.com\/ruvnet\/RuView">GitHub<\/a> &middot;/g, '')
  .replace(/<span id="data-source-label">DEMO<\/span>/g, '<span id="data-source-label">ORACLE</span>')
  .replace(/<option value="demo" selected>Demo Generator<\/option>/g, '<option value="demo" selected>Oracle Stream</option>')
  .replace(/<a href="[^"]*" class="back-link">[^<]*<\/a>\s*/g, '')
  .replace(/<a href="observatory\.html">Observatory<\/a>/g, '')
  .replace(/&#9679; DEMO<\/span> Synthetic/g, '&#9679; ORACLE</span> Dreaming')
  .replace(/&#9679; DEMO<\/span> Your Face \(MediaPipe\)/g, '&#9679; ORACLE</span> Mirror')
  
  .replace(/Connect ESP32…/g, 'Bind a Sensor…')
  .replace(/Project Subject — render your face into the Vault/g, 'Enter the Vault');

const TONE = '<style>html{background:#000;filter:sepia(1) saturate(2.4) hue-rotate(-16deg) contrast(1.05)}</style>';
const tone = (h) => h.replace('</head>', TONE + '</head>');
const out = {};

// 1. Observatory
{
  let html = lore(read('observatory/index.html'));
  const css = read('observatory/css/observatory.css');
  const js = await bundle('observatory/js/main.js', { alias: { three: resolve(here, 'node_modules/three160/build/three.module.js'), 'three/addons': resolve(here, 'node_modules/three160/examples/jsm') } });
  html = html.replace(/<link rel="stylesheet" href="observatory\/css\/observatory\.css">/, () => `<style>${safeCss(css)}</style>`)
    .replace(/<script type="importmap">[\s\S]*?<\/script>/, '')
    .replace(/<script type="module" src="observatory\/js\/main\.js"><\/script>/, () => `<script>${safeJs(js)}</script>`);
  out.observatory = tone(html);
}

// 2. Convergence (pose fusion)
{
  let html = lore(read('posefusion/index.html'));
  const css = read('posefusion/css/style.css');
  const js = await bundle('posefusion/js/main.js');
  html = html.replace(/<link rel="stylesheet" href="pose-fusion\/css\/style\.css\?v=13">/, () => `<style>${safeCss(css)}</style>`)
    .replace(/<script type="module" src="pose-fusion\/js\/main\.js\?v=13"><\/script>/, () => `<script>${safeJs(js)}</script>`)
    .replace(/ruvector-cnn \(JS fallback\)/g, 'ruvector-cnn · lattice core');
  out.posefusion = tone(html);
}

// 3. Vault (point cloud)
{
  let html = lore(read('pointcloud/index.html'));
  const three = read('node_modules/three128/build/three.min.js');
  const orbit = read('node_modules/three128/examples/js/controls/OrbitControls.js');
  html = html
    .replace(/<script src="https:\/\/cdnjs[^"]*three\.min\.js"><\/script>/, () => `<script>${safeJs(three)}</script>`)
    .replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/three@[^"]*OrbitControls\.js"><\/script>/, () => `<script>${safeJs(orbit)}</script>`)
    .replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@mediapipe[^"]*"><\/script>\s*/g, '')
    .replace(/<!-- MediaPipe[^>]*-->\s*/, '')
    .replace('</style>', '#cam-cta{display:none!important}</style>');
  out.pointcloud = tone(html);
}

mkdirSync(resolve(here, 'dist'), { recursive: true });
const genDir = resolve(here, '../app/src/assets/chambers');
mkdirSync(genDir, { recursive: true });
const pubDir = resolve(here, '../app/public/chambers');
mkdirSync(pubDir, { recursive: true });
const slug = { observatory: 'observatory', pointcloud: 'vault', posefusion: 'convergence' };
for (const [k, v] of Object.entries(out)) {
  writeFileSync(resolve(pubDir, `${slug[k]}.html`), v);
  writeFileSync(resolve(here, `dist/${k}.html`), v);
  writeFileSync(resolve(genDir, `${k}.generated.ts`), `// AUTO-GENERATED by chambers/build.mjs — do not edit\nexport const ${k.toUpperCase()}_HTML: string = ${JSON.stringify(v)};\n`);
  console.log(k, (v.length / 1024).toFixed(0) + ' KB');
}
