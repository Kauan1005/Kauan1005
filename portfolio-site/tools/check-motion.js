// Verifica a Fase 3: entrada do hero, revelação ao rolar, quadros por segundo, reduced-motion, erros.
const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
  for (const [w, h] of [[1440, 900], [375, 812]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errors = [];
    p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    p.on('pageerror', (e) => errors.push(String(e)));
    await p.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'networkidle' });
    await p.waitForTimeout(3200);
    const heroOk = await p.evaluate(() => [...document.querySelectorAll('.hero [data-h], .hero h1, .hero__bento > *')].every((e) => getComputedStyle(e).opacity === '1'));
    // mede quadros durante a rolagem
    await p.evaluate(() => { window.__f = []; let last = performance.now(); const loop = (t) => { window.__f.push(t - last); last = t; if (window.__f.length < 400) requestAnimationFrame(loop); }; requestAnimationFrame(loop); });
    await p.mouse.move(w / 2, h / 2);
    for (let i = 0; i < 40; i++) { await p.mouse.wheel(0, 260); await p.waitForTimeout(60); }
    await p.waitForTimeout(2500);
    const res = await p.evaluate(() => {
      const f = window.__f.slice(5); const avg = f.reduce((a, b) => a + b, 0) / f.length;
      const hidden = [...document.querySelectorAll('[data-r], [data-ri]')].filter((e) => getComputedStyle(e).opacity !== '1').map((e) => e.className || e.tagName);
      return { fps: Math.round(1000 / avg), long: f.filter((x) => x > 34).length, hidden: hidden.slice(0, 6), hiddenN: hidden.length, sw: document.documentElement.scrollWidth, y: Math.round(scrollY) };
    });
    console.log(w, 'heroOk', heroOk, JSON.stringify(res), errors.length ? 'ERR ' + errors.join(' | ') : 'no errors');
    await p.close();
  }
  // reduced motion: tudo visível de cara, sem a classe m-on
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => ({ mOn: document.documentElement.classList.contains('m-on'), hidden: [...document.querySelectorAll('[data-r], [data-ri], .hero h1')].filter((e) => getComputedStyle(e).opacity !== '1').length }));
  console.log('reduced', JSON.stringify(r));
  await b.close();
})();
