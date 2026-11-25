// Testa o gato brincalhão: olhos estáveis, atividade, bola, letras, rolagem, cansaço, bote.
const { chromium } = require('playwright-core');
const OUT = require('path').join(__dirname, '..', 'capturas');
(async () => {
  require('fs').mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ executablePath: process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.addInitScript(() => { try { sessionStorage.setItem('kc-on', '1'); } catch {} });
  const errors = [];
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  p.on('pageerror', (e) => errors.push(String(e)));
  await p.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'networkidle' });
  await p.waitForFunction(() => window.__kc, null, { timeout: 8000 });

  // 1. olhos: o centro não pode se mover ao piscar
  const eyes = await p.evaluate(async () => {
    const g = document.querySelector('.kc-eyes'); const c = () => { const r = g.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
    const a = c(); window.gsap.set(g, { scaleY: 0.12 }); const m = c(); window.gsap.set(g, { scaleY: 1 });
    return Math.round(Math.hypot(a[0] - m[0], a[1] - m[1]) * 10) / 10;
  });
  console.log('deslocamento dos olhos ao piscar (px):', eyes);

  // 2. atividade em 35 s com o mouse se mexendo de vez em quando
  const seen = await p.evaluate(() => new Promise((res) => {
    const s = { poses: new Set(), text: false, ball: false, moved: 0 }; let lx = window.__kc.pos.x;
    const id = setInterval(() => { const k = window.__kc; s.poses.add(k.pose); if (k.onText) s.text = true; if (getComputedStyle(document.querySelector('.kc-ball')).opacity === '1') s.ball = true; s.moved += Math.abs(k.pos.x - lx); lx = k.pos.x; }, 100);
    setTimeout(() => { clearInterval(id); res({ poses: [...s.poses], text: s.text, ball: s.ball, moved: Math.round(s.moved) }); }, 35000);
  }).then((r) => r));
  // movimentos do mouse em paralelo não são possíveis aqui; o cérebro age sozinho
  console.log('35 s:', JSON.stringify(seen));
  await p.screenshot({ path: `${OUT}/ativo.png` });

  // 3. rolagem lenta: o gato desce junto e continua visível
  await p.mouse.move(700, 400);
  for (let i = 0; i < 10; i++) { await p.mouse.wheel(0, 90); await p.waitForTimeout(120); }
  await p.waitForTimeout(300);
  const slow = await p.evaluate(() => { const r = document.querySelector('.kc-wrap').getBoundingClientRect(); return { mode: window.__kc.mode, visible: r.bottom > 0 && r.top < innerHeight && getComputedStyle(document.querySelector('.kc-wrap')).opacity !== '0', bottom: Math.round(r.bottom) }; });
  console.log('rolagem lenta:', JSON.stringify(slow));
  await p.waitForTimeout(1200);

  // 4. rolagem rápida: some e volta cansado
  for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, 1600); await p.waitForTimeout(25); }
  await p.waitForTimeout(120);
  const fast = await p.evaluate(() => window.__kc.mode);
  await p.waitForTimeout(1500);
  const back = await p.evaluate(() => ({ mode: window.__kc.mode, pose: window.__kc.pose }));
  await p.screenshot({ path: `${OUT}/cansado.png` });
  console.log('rolagem rápida:', fast, '→ depois:', JSON.stringify(back));
  await p.waitForTimeout(3500);
  console.log('após 3 s:', await p.evaluate(() => window.__kc.pose));

  // 5. duplo clique: bote até o cursor
  const tgt = { x: 900, y: 600 };
  await p.mouse.move(tgt.x, tgt.y);
  await p.mouse.dblclick(tgt.x, tgt.y);
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}/ataque.png` });
  await p.waitForTimeout(900);
  const pounce = await p.evaluate(() => { const r = document.querySelector('.kc-wrap').getBoundingClientRect(); return { cx: Math.round(r.left + r.width / 2), cy: Math.round(r.top + r.height / 2), pose: window.__kc.pose }; });
  console.log('bote: gato em', JSON.stringify(pounce), 'cursor em', JSON.stringify(tgt));

  // 6. pausa
  await p.click('.nav__cat');
  console.log('pausado:', await p.evaluate(() => document.querySelector('.nav__cat').getAttribute('aria-pressed')));
  await p.click('.nav__cat');
  console.log('erros:', errors.length ? errors.join(' | ') : 'nenhum');
  await b.close();
})();
