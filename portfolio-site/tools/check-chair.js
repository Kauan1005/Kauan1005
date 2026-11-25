// Testa: "miau" em três situações e o sono só na cadeira gamer (desktop e celular).
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
  await p.waitForTimeout(1200);
  const rain = () => p.waitForFunction(() => !!document.querySelector('.kc-rain'), null, { timeout: 1500 }).then(() => true).catch(() => false);
  const noRain = () => p.waitForFunction(() => !document.querySelector('.kc-rain'), null, { timeout: 6000 }).catch(() => {});

  // miau na página
  await p.mouse.click(700, 120); await p.keyboard.type('miau');
  console.log('miau na página:', await rain()); await noRain();
  // meow com o terminal do hero focado
  const t = await p.evaluate(() => { const r = document.querySelector('.hero__bento .term').getBoundingClientRect(); return [r.left + r.width / 2, r.top + 40]; });
  await p.mouse.click(t[0], t[1]); await p.keyboard.type('meow');
  console.log('meow com terminal focado:', await rain(), '| foco no terminal:', await p.evaluate(() => document.activeElement.classList.contains('kc-term-live'))); await noRain();
  await p.keyboard.press('Escape');
  // miau com o gato pausado
  await p.click('.nav__cat'); await p.mouse.click(700, 120); await p.keyboard.type('miau');
  console.log('miau com gato pausado:', await rain()); await noRain();
  await p.click('.nav__cat');
  await p.mouse.move(5, 5);
  await p.waitForTimeout(2500);

  // sono: aparece a cadeira, ele sobe e dorme no assento
  const sleep = p.evaluate(() => __kc.test.sleep());
  const onChair = await p.waitForFunction(() => __kc.pose === 'sleep' && __kc.chair, null, { timeout: 9000 }).then(() => true).catch(() => false);
  await p.waitForTimeout(900);
  const geo = await p.evaluate(() => { const c = document.querySelector('.kc-chair').getBoundingClientRect(); return { chairTop: Math.round(c.top), seatY: Math.round(c.top + 98), feetY: Math.round(__kc.pos.y - scrollY), chairX: Math.round(c.left + 71), catX: Math.round(__kc.pos.x) }; });
  console.log('dormindo na cadeira:', onChair, JSON.stringify(geo));
  const r = await p.evaluate(() => { const c = document.querySelector('.kc-chair').getBoundingClientRect(); return [c.left, c.top]; });
  await p.screenshot({ path: `${OUT}/dormindo-cadeira.png`, clip: { x: Math.max(0, r[0] - 90), y: Math.max(0, r[1] - 50), width: 320, height: 240 } });
  // acorda com o mouse: espreguiça, desce e a cadeira some
  await p.mouse.move(400, 400, { steps: 4 });
  const woke = await p.waitForFunction(() => __kc.pose === 'stretch', null, { timeout: 3000 }).then(() => true).catch(() => false);
  await sleep;
  await p.waitForTimeout(800);
  console.log('acordou espreguiçando:', woke, '| cadeira removida:', await p.evaluate(() => !document.querySelector('.kc-chair')), '| no chão:', await p.evaluate(() => Math.abs(__kc.pos.y - scrollY - (innerHeight - 6)) < 4));
  console.log('erros desktop:', errors.length ? errors.join(' | ') : 'nenhum');
  await p.close();

  // celular: espera o sono (45 s) e confere a cadeirinha no menu
  const m = await b.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const merr = []; m.on('pageerror', (e) => merr.push(String(e)));
  await m.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'networkidle' });
  await m.waitForTimeout(47500);
  const ms = await m.evaluate(() => ({ chairOn: document.querySelector('.kc-chair-nav').classList.contains('is-on'), zzz: getComputedStyle(document.querySelector('.kc-zzz')).opacity }));
  await m.screenshot({ path: `${OUT}/celular-cadeira.png`, clip: { x: 0, y: 0, width: 375, height: 90 } });
  console.log('celular dormindo na cadeirinha:', JSON.stringify(ms), merr.length ? merr.join('|') : 'sem erros');
  await b.close();
})();
