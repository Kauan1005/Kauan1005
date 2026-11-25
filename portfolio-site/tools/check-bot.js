// Testa: robô (voo, varredura, pipeline, testes, contato), terminal com campo real, gato só após "cat", celular.
const { chromium } = require('playwright-core');
const OUT = require('path').join(__dirname, '..', 'capturas');
(async () => {
  require('fs').mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ executablePath: process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = []; p.on('pageerror', (e) => errors.push(String(e))); p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await p.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2600);
  console.log('gato ausente no início:', await p.evaluate(() => !document.querySelector('.kc-wrap') && !window.__kc), '| robô:', await p.evaluate(() => !!document.querySelector('.rb')));
  await p.screenshot({ path: `${OUT}/hero.png` });

  const goto = async (sel, shot, waitMs) => {
    await p.evaluate((s) => { const el = document.querySelector(s); const r = el.getBoundingClientRect(); window.scrollTo(0, scrollY + r.top - innerHeight / 2 + r.height / 2); }, sel);
    await p.waitForTimeout(waitMs);
    await p.screenshot({ path: `${OUT}/${shot}.png` });
  };
  await goto('#projetos .project__art', 'robo-tonsorium', 2600);
  console.log('selo tonsorium:', await p.evaluate(() => document.querySelector('#projetos .rb-badge')?.textContent));
  await p.waitForFunction(() => !__rb.busy, null, { timeout: 8000 }).catch(() => {});
  await goto('#acrilife .project__art', 'robo-acrilife', 2600);
  console.log('selo acrilife:', await p.evaluate(() => document.querySelector('#acrilife .rb-badge')?.textContent));
  await p.waitForFunction(() => !__rb.busy, null, { timeout: 8000 }).catch(() => {});
  await goto('.pipe-card', 'robo-pipeline-meio', 1700);
  await p.waitForTimeout(2600);
  await p.screenshot({ path: `${OUT}/robo-pipeline.png` });
  console.log('canais acesos:', await p.evaluate(() => [...document.querySelectorAll('.pipe-h .rb-lane.is-lit')].length), '| cards ok:', await p.evaluate(() => document.querySelectorAll('.fact.rb-ok').length));
  await p.waitForFunction(() => !__rb.busy, null, { timeout: 8000 }).catch(() => {});
  await goto('.code-wrap', 'codigo', 900);
  await goto('[data-term-run]', 'robo-testes', 2600);
  await p.waitForFunction(() => !__rb.busy, null, { timeout: 8000 }).catch(() => {});
  await goto('#contato .btn--primary', 'robo-contato', 1600);
  await p.waitForTimeout(2500);
  console.log('robô voltou para a base:', await p.evaluate(() => __rb.home));
  console.log('largura:', await p.evaluate(() => document.documentElement.scrollWidth));

  // terminal: help, bot, lua sem gato, cat, lua, dormir
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(600);
  const type = async (c) => { await p.click('.tm-in'); await p.keyboard.type(c); await p.keyboard.press('Enter'); await p.waitForTimeout(300); };
  const outs = () => p.evaluate(() => [...document.querySelectorAll('.hero__bento .kc-out')].map((x) => x.textContent));
  await type('help'); await type('lua');
  console.log('saídas:', JSON.stringify(await outs()));
  const tr = await p.evaluate(() => { const r = document.querySelector('.hero__bento .term').getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
  await p.screenshot({ path: `${OUT}/terminal.png`, clip: { x: tr[0] - 10, y: tr[1] - 10, width: tr[2] + 20, height: tr[3] + 20 } });
  await type('cat');
  const cat = await p.waitForFunction(() => window.__kc && window.__kc.cmd, null, { timeout: 6000 }).then(() => true).catch(() => false);
  const dove = await p.waitForFunction(() => getComputedStyle(document.querySelector('.kc-wrap')).opacity === '0', null, { timeout: 6000 }).then(() => true).catch(() => false);
  await p.waitForFunction(() => __kc.mode === 'free', null, { timeout: 9000 }).catch(() => {});
  console.log('cat carregou:', cat, '| entrou no terminal:', dove);
  await p.mouse.move(5, 5);
  await type('lua');
  console.log('lua veio:', await p.waitForFunction(() => __kc.luaOn, null, { timeout: 4000 }).then(() => true).catch(() => false));
  await p.waitForFunction(() => !__kc.luaOn, null, { timeout: 20000 }).catch(() => {});
  await type('dormir'); await p.mouse.move(5, 5);
  console.log('dormiu:', await p.waitForFunction(() => __kc.pose === 'sleep' && __kc.chair, null, { timeout: 10000 }).then(() => true).catch(() => false));
  console.log('erros desktop:', errors.length ? errors.join(' | ') : 'nenhum');
  await p.close();

  // celular: robô na barra do topo, gato chega e o robô cede o lugar
  const m = await b.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const merr = []; m.on('pageerror', (e) => merr.push(String(e)));
  await m.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'networkidle' });
  await m.waitForTimeout(2600);
  await m.screenshot({ path: `${OUT}/celular-topo.png`, clip: { x: 0, y: 0, width: 375, height: 300 } });
  console.log('celular: robô na barra:', await m.evaluate(() => !!document.querySelector('.nav__bar .rb')), '| largura:', await m.evaluate(() => document.documentElement.scrollWidth));
  await m.evaluate(() => { const el = document.querySelector('.pipe-card'); el.scrollIntoView({ block: 'center' }); });
  await m.waitForTimeout(5500);
  console.log('celular: canais acesos:', await m.evaluate(() => [...document.querySelectorAll('.pipe-v .rb-lane.is-lit')].length));
  await m.evaluate(() => window.scrollTo(0, 0)); await m.waitForTimeout(500);
  await m.tap('.tm-in'); await m.keyboard.type('cat'); await m.keyboard.press('Enter');
  await m.waitForTimeout(3000);
  console.log('celular: gato na barra:', await m.evaluate(() => !!document.querySelector('.kc-wrap--nav')), '| robô saiu:', await m.evaluate(() => !document.querySelector('.rb')), '| largura:', await m.evaluate(() => document.documentElement.scrollWidth));
  await m.screenshot({ path: `${OUT}/celular-gato.png`, clip: { x: 0, y: 0, width: 375, height: 300 } });
  console.log('erros celular:', merr.length ? merr.join(' | ') : 'nenhum');
  await b.close();
})();
