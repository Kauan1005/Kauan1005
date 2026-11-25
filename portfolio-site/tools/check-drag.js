// Testa pegar e soltar o gato: em cima das letras, de um card e no chão; fica no poleiro; clique ainda pula.
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
  await p.waitForTimeout(3500);
  const catCenter = () => p.evaluate(() => { const r = document.querySelector('.kc-wrap .kc-body ellipse').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height * 0.35]; });
  async function dragTo(tx, ty, shot) {
    const c = await catCenter();
    await p.mouse.move(c[0], c[1]); await p.mouse.down();
    await p.mouse.move(c[0] + 20, c[1] - 20, { steps: 3 });
    await p.waitForTimeout(150);
    const during = await p.evaluate(() => ({ mode: __kc.mode, pose: __kc.pose, grab: document.documentElement.classList.contains('kc-dragging') }));
    await p.mouse.move(tx, ty, { steps: 14 });
    if (shot) await p.screenshot({ path: `${OUT}/${shot}-segurando.png`, clip: { x: Math.max(0, tx - 180), y: Math.max(0, ty - 120), width: 360, height: 240 } });
    await p.mouse.up();
    await p.waitForTimeout(1300);
    const after = await p.evaluate(() => { const r = document.querySelector('.kc-wrap').getBoundingClientRect(); return { mode: __kc.mode, perch: __kc.perch, feetY: Math.round(__kc.pos.y - scrollY), left: Math.round(r.left) }; });
    return { during, after };
  }
  // 1. em cima do título (primeira linha do h1)
  const line = await p.evaluate(() => { const rg = document.createRange(); rg.selectNodeContents(document.querySelector('.hero h1')); const r = [...rg.getClientRects()].find((x) => x.width > 200); return [r.left + r.width / 2, r.top, r.height]; });
  const r1 = await dragTo(line[0], line[1] - 90, 'letras');
  console.log('título: linha do texto no topo em y≈', Math.round(line[1] + line[2] * 0.16), '→', JSON.stringify(r1));
  await p.screenshot({ path: `${OUT}/letras.png`, clip: { x: Math.max(0, line[0] - 200), y: Math.max(0, line[1] - 150), width: 400, height: 260 } });
  await p.waitForTimeout(6000);
  console.log('6 s depois, continua em cima?', JSON.stringify(await p.evaluate(() => ({ perch: __kc.perch, mode: __kc.mode }))));
  // 2. em cima de um card do hero
  const card = await p.evaluate(() => { const r = document.querySelector('.hero__bento .mini').getBoundingClientRect(); return [r.left + r.width / 2, r.top]; });
  const r2 = await dragTo(card[0], card[1] - 90, 'card');
  console.log('card: topo em y≈', Math.round(card[1]), '→', JSON.stringify(r2.after));
  await p.screenshot({ path: `${OUT}/card.png`, clip: { x: Math.max(0, card[0] - 200), y: Math.max(0, card[1] - 150), width: 400, height: 260 } });
  // 3. área vazia: cai no chão
  const r3 = await dragTo(1000, 740, null);
  console.log('área vazia (chão em y≈894):', JSON.stringify(r3.after));
  // 4. clique simples ainda pula
  await p.waitForTimeout(800);
  const c = await catCenter(); await p.mouse.click(c[0], c[1]); await p.waitForTimeout(120);
  console.log('clique:', await p.evaluate(() => __kc.pose));
  console.log('erros:', errors.length ? errors.join(' | ') : 'nenhum');
  await b.close();
})();
