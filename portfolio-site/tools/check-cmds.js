// Testa os comandos do terminal do hero: ls, lua, dormir, cat; e o mergulho na rotina.
const { chromium } = require('playwright-core');
const OUT = require('path').join(__dirname, '..', 'capturas');
(async () => {
  require('fs').mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ executablePath: process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = []; p.on('pageerror', (e) => errors.push(String(e))); p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await p.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'networkidle' });
  await p.waitForFunction(() => window.__kc, null, { timeout: 8000 });
  await p.waitForTimeout(1200);
  const t = await p.evaluate(() => { const r = document.querySelector('.hero__bento .term').getBoundingClientRect(); return [r.left + r.width / 2, r.top + 40]; });
  const type = async (c) => { await p.mouse.click(t[0], t[1]); await p.keyboard.type(c); await p.keyboard.press('Enter'); };
  const outs = () => p.evaluate(() => [...document.querySelectorAll('.kc-out')].map((x) => x.textContent));

  await type('ls');
  console.log('ls:', JSON.stringify(await outs()));
  const tr = await p.evaluate(() => { const r = document.querySelector('.hero__bento .term').getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
  await p.screenshot({ path: `${OUT}/ls.png`, clip: { x: tr[0], y: tr[1], width: tr[2], height: tr[3] } });

  await type('lua');
  const lua = await p.waitForFunction(() => __kc.luaOn, null, { timeout: 3000 }).then(() => true).catch(() => false);
  await p.mouse.move(5, 5);
  await p.waitForFunction(() => !__kc.luaOn, null, { timeout: 20000 }).catch(() => {});
  console.log('lua chegou:', lua, '| saída:', JSON.stringify((await outs()).slice(-1)));

  await type('dormir');
  await p.mouse.move(5, 5);
  const slept = await p.waitForFunction(() => __kc.pose === 'sleep' && __kc.chair, null, { timeout: 10000 }).then(() => true).catch(() => false);
  await p.waitForTimeout(1500);
  const still = await p.evaluate(() => __kc.pose);
  await p.mouse.move(400, 400, { steps: 4 });
  const woke = await p.waitForFunction(() => __kc.pose === 'stretch', null, { timeout: 5000 }).then(() => true).catch(() => false);
  console.log('dormir: dormiu na cadeira', slept, '| ainda dormindo após 1,5 s', still === 'sleep', '| acordou com o mouse', woke);
  await p.waitForFunction(() => __kc.mode === 'free', null, { timeout: 8000 }).catch(() => {});

  await type('cat');
  const ghost = await p.waitForFunction(() => getComputedStyle(document.querySelector('.kc-wrap')).opacity === '0', null, { timeout: 5000 }).then(() => true).catch(() => false);
  await p.waitForFunction(() => __kc.mode === 'free', null, { timeout: 8000 }).catch(() => {});
  console.log('cat: entrou no terminal', ghost, '| saída:', JSON.stringify(await outs()));

  // rotina: mergulho sem o terminal focado
  await p.keyboard.press('Escape'); await p.mouse.move(5, 5);
  p.evaluate(() => __kc.test.dive());
  const g2 = await p.waitForFunction(() => getComputedStyle(document.querySelector('.kc-wrap')).opacity === '0', null, { timeout: 5000 }).then(() => true).catch(() => false);
  await p.waitForFunction(() => __kc.mode === 'free', null, { timeout: 8000 }).catch(() => {});
  console.log('rotina (mergulho):', g2, '| visível depois:', await p.evaluate(() => getComputedStyle(document.querySelector('.kc-wrap')).opacity));
  console.log('erros:', errors.length ? errors.join(' | ') : 'nenhum');
  await b.close();
})();
