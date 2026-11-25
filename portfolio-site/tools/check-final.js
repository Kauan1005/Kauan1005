// Fase 5: capturas em 1440, 768 e 375 (PT e EN), rolagem lateral, erros no console, sobreposições e links.
const { chromium } = require('playwright-core');
const OUT = require('path').join(__dirname, '..', 'capturas');
(async () => {
  require('fs').mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ executablePath: process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
  const hrefs = new Set();
  for (const page of ['index.html', 'en.html']) {
    for (const [w, h] of [[1440, 900], [768, 1024], [375, 812]]) {
      const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 500 });
      const errors = [];
      p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      p.on('pageerror', (e) => errors.push(String(e)));
      p.on('requestfailed', (r) => errors.push('falhou: ' + r.url()));
      p.on('response', (r) => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
      await p.goto(`http://127.0.0.1:5173/${page}`, { waitUntil: 'networkidle' });
      await p.evaluate(() => document.fonts.ready);
      // pausa o gato para a captura não ter ele por cima do texto
      await p.evaluate(() => { const t = document.querySelector('[data-cat-toggle]'); if (t && !t.hidden && t.getAttribute('aria-pressed') !== 'true') t.click(); });
      // rola a página toda para disparar as revelações
      const H = await p.evaluate(() => document.documentElement.scrollHeight);
      let maxSW = 0;
      for (let y = 0; y < H; y += Math.round(h * 0.6)) {
        await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(260);
        maxSW = Math.max(maxSW, await p.evaluate(() => document.documentElement.scrollWidth));
      }
      await p.waitForTimeout(1500);
      await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(500);
      const info = await p.evaluate(() => {
        const vis = (e) => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
        // texto escondido depois de rolar tudo
        const hidden = [...document.querySelectorAll('main h1, main h2, main h3, main p, main li, main .btn')].filter((e) => vis(e) && parseFloat(getComputedStyle(e).opacity) < 0.5 && !e.closest('[aria-hidden="true"]')).map((e) => e.textContent.trim().slice(0, 30));
        // sobreposição entre blocos de texto irmãos dentro da main
        const blocks = [...document.querySelectorAll('main h1, main h2, main h3, main p, main .btn, main .chip')].filter(vis).filter((e) => !e.closest('svg, .term, [aria-hidden="true"]'));
        const over = [];
        for (let i = 0; i < blocks.length; i++) for (let j = i + 1; j < blocks.length; j++) {
          const a = blocks[i], c = blocks[j]; if (a.contains(c) || c.contains(a)) continue;
          const r1 = a.getBoundingClientRect(), r2 = c.getBoundingClientRect();
          const ix = Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left), iy = Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top);
          if (ix > 4 && iy > 4) over.push(a.textContent.trim().slice(0, 20) + ' × ' + c.textContent.trim().slice(0, 20));
        }
        const ids = new Set([...document.querySelectorAll('[id]')].map((e) => e.id));
        const badAnchors = [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href').slice(1)).filter((id) => id && !ids.has(id));
        const links = [...document.querySelectorAll('a[href]')].map((a) => a.href).filter((u) => /^https?:/.test(u));
        return { hidden: hidden.slice(0, 6), over: over.slice(0, 6), badAnchors, links };
      });
      info.links.forEach((u) => hrefs.add(u.split('#')[0]));
      await p.screenshot({ path: `${OUT}/${page.replace('.html', '')}-${w}.png`, fullPage: true });
      console.log(page, w, '| rolagem lateral:', maxSW > w ? maxSW : 'não', '| texto escondido:', JSON.stringify(info.hidden), '| sobreposições:', JSON.stringify(info.over), '| âncoras quebradas:', JSON.stringify(info.badAnchors), '|', errors.length ? 'ERROS ' + errors.join(' | ') : 'sem erros');
      await p.close();
    }
  }
  await b.close();
  // links: locais e externos
  for (const u of hrefs) {
    let st;
    try { const r = await fetch(u, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(12000), headers: { 'user-agent': 'Mozilla/5.0 link-check' } }); st = r.status; } catch (e) { st = 'erro ' + e.message; }
    console.log('link', st, u);
  }
})();
