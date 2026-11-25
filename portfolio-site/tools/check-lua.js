// Testa: sem rolagem lateral, caixa na frente do gato, auréola e a visita da Lua.
const { chromium } = require('playwright-core');
const OUT = require('path').join(__dirname, '..', 'capturas');
(async () => {
  require('fs').mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ executablePath: process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.addInitScript(() => { try { sessionStorage.setItem('kc-on', '1'); } catch {} });
  const errors = []; p.on('pageerror', (e) => errors.push(String(e))); p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await p.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'networkidle' });
  await p.waitForFunction(() => window.__kc, null, { timeout: 8000 });
  await p.waitForTimeout(1000); await p.mouse.move(5, 5);

  // 1. rolagem lateral com algo fora da tela
  const sw = await p.evaluate(() => { const bl = document.querySelector('.kc-ball'); bl.style.opacity = 1; bl.style.transform = `translate(${innerWidth + 80}px, 0px)`; const r = [document.documentElement.scrollWidth, innerWidth]; bl.style.opacity = 0; return r; });
  const canScrollX = await p.evaluate(() => { scrollTo(300, scrollY); return scrollX; });
  console.log('largura da página com a bola fora da tela:', sw.join(' x '), '| consegue rolar para o lado?', canScrollX > 0);

  // 2. caixa: a frente cobre o corpo do gato
  p.evaluate(() => __kc.test.box());
  await p.waitForFunction(() => document.querySelector('.kc-box') && Math.abs(__kc.pos.y - scrollY - (innerHeight - 6) + 29) < 3, null, { timeout: 8000 });
  await p.waitForTimeout(500);
  const z = await p.evaluate(() => ['.kc-box--back', '.kc-wrap', '.kc-box--front'].map((q) => getComputedStyle(document.querySelector(q)).zIndex).join(' < '));
  const r = await p.evaluate(() => { const x = document.querySelector('.kc-box--front').getBoundingClientRect(); return [x.left, x.top]; });
  await p.screenshot({ path: `${OUT}/caixa.png`, clip: { x: r[0] - 80, y: r[1] - 80, width: 300, height: 170 } });
  console.log('camadas (fundo < gato < frente):', z);
  await p.waitForTimeout(6000);

  // 3. auréola
  const halo = await p.evaluate(() => { const h = document.querySelector('.kc-halo').getBoundingClientRect(); const head = document.querySelector('.kc-head').getBoundingClientRect(); return { haloAcimaDaCabeca: h.bottom <= head.top + 14, w: Math.round(h.width) }; });
  console.log('auréola:', JSON.stringify(halo));

  // 4. visita da Lua
  const visit = p.evaluate(() => __kc.test.lua());
  const shots = {};
  const t0 = Date.now(); let sawName = false, sawBark = false, sawBow = false, nose = false;
  while (Date.now() - t0 < 16000) {
    await p.waitForTimeout(90);
    const s = await p.evaluate(() => ({ on: __kc.luaOn, name: parseFloat(getComputedStyle(document.querySelector('.ld-name')).opacity), bark: parseFloat(getComputedStyle(document.querySelector('.ld-bark')).opacity), tongue: parseFloat(getComputedStyle(document.querySelector('.ld-tongue')).opacity), pose: __kc.pose, sw: document.documentElement.scrollWidth }));
    if (s.sw > 1440) console.log('ROLAGEM LATERAL durante a visita!', s.sw);
    if (s.name > 0.8 && !sawName) { sawName = true; const d = await p.evaluate(() => { const x = document.querySelector('.ld-wrap').getBoundingClientRect(); return [x.left, x.top]; }); await p.screenshot({ path: `${OUT}/lua-chegou.png`, clip: { x: Math.max(0, Math.min(1440 - 560, d[0] - 220)), y: 900 - 260, width: 560, height: 260 } }); }
    if (s.bark > 0.5) sawBark = true;
    if (s.pose === 'crouch' && sawName && !sawBow) { sawBow = true; const d = await p.evaluate(() => { const x = document.querySelector('.ld-wrap').getBoundingClientRect(); return [x.left, x.top]; }); await p.screenshot({ path: `${OUT}/lua-brincando.png`, clip: { x: Math.max(0, Math.min(1440 - 560, d[0] - 220)), y: 900 - 260, width: 560, height: 260 } }); }
    if (s.tongue > 0.8 && !nose) { nose = true; const d = await p.evaluate(() => { const x = document.querySelector('.ld-wrap').getBoundingClientRect(); return [x.left, x.top]; }); await p.screenshot({ path: `${OUT}/lua-focinho.png`, clip: { x: Math.max(0, Math.min(1440 - 560, d[0] - 220)), y: 900 - 260, width: 560, height: 260 } }); }
    if (!s.on && sawName) break;
  }
  await visit;
  console.log('Lua: nome', sawName, '| latiu', sawBark, '| reverência', sawBow, '| focinho com focinho', nose, '| foi embora', !(await p.evaluate(() => __kc.luaOn)));
  console.log('erros:', errors.length ? errors.join(' | ') : 'nenhum');
  await b.close();
})();
