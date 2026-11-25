// Portfólio v2 · o robô de testes.
// Ele mostra o portfólio funcionando: escaneia as ilustrações dos projetos e deixa um selo,
// faz os dados correrem pelo pipeline da automação e acende os canais, roda os testes do
// terminal e aponta o contato. Telas largas: ele voa até cada parte. Telas menores: fica na barra do topo.
// Só usa transform e opacity; com movimento reduzido, os estados finais aparecem sem animação.
(() => {
  const { gsap } = window;
  if (!gsap || document.querySelector('.rb')) return;
  const isEn = document.documentElement.lang === 'en';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wide = matchMedia('(min-width: 1300px) and (pointer: fine)').matches;
  const T = isEn ? {
    label: 'Site robot: show a tip', hello: 'bot online · type help in the terminal', scanT: 'scanning tonsorium…', okT: '✓ RLS · 2FA · 61 tests',
    scanA: 'scanning acrilife…', okA: '✓ catalogue · panel · live', pipe: 'running the pipeline…', pipeOk: '3/3 channels ✓ · ≈ R$ 2k/day saved',
    tests: '$ npm run test:db', testsOk: '61/61 passed · all green', contact: 'email is the fastest way to reach Kauan', cat: 'a cat in the repo?!', catNav: 'giving my seat to Banguela',
    tips: ['tip: type help in the top terminal', 'this site: plain HTML, CSS and JS + GSAP', 'the code samples use made-up names', 'type cat in the terminal… if you dare'],
  } : {
    label: 'Robô do site: mostrar uma dica', hello: 'bot online · digite help no terminal', scanT: 'escaneando tonsorium…', okT: '✓ RLS · 2FA · 61 testes',
    scanA: 'escaneando acrilife…', okA: '✓ catálogo · painel · no ar', pipe: 'rodando o pipeline…', pipeOk: '3/3 canais ✓ · ≈ R$ 2 mil/dia economizados',
    tests: '$ npm run test:db', testsOk: '61/61 passaram · tudo verde', contact: 'o e-mail é o caminho mais rápido', cat: 'um gato no repositório?!', catNav: 'passando o lugar pro Banguela',
    tips: ['dica: digite help no terminal do topo', 'este site: HTML, CSS e JS puros + GSAP', 'os exemplos de código usam nomes fictícios', 'digite cat no terminal… se tiver coragem'],
  };
  const ACC = '#4ade80', AMB = '#f5b454', INK = '#1d2024', EDGE = 'rgba(255,255,255,.28)';
  const SVG = `<svg viewBox="0 0 80 96" aria-hidden="true" focusable="false">
    <g class="rb-jet" style="transform-origin:40px 80px"><path d="M32 80h16l-4 9q-4 7-8 0z" fill="${AMB}" opacity=".9"/><path d="M36 80h8l-2 5q-2 4-4 0z" fill="#fff" opacity=".85"/></g>
    <g class="rb-all">
      <path d="M40 16V8" stroke="${EDGE}" stroke-width="2" stroke-linecap="round"/>
      <circle class="rb-led" cx="40" cy="6" r="3.4" fill="${ACC}"/>
      <rect x="9" y="28" width="6" height="13" rx="3" fill="${INK}" stroke="${EDGE}"/><rect x="65" y="28" width="6" height="13" rx="3" fill="${INK}" stroke="${EDGE}"/>
      <rect x="14" y="16" width="52" height="37" rx="15" fill="${INK}" stroke="${EDGE}" stroke-width="1.3"/>
      <rect x="20" y="23" width="40" height="22" rx="10" fill="#0b0c0e"/>
      <g class="rb-eyes"><rect class="rb-eye" x="27" y="30" width="8" height="9" rx="3.5" fill="${ACC}"/><rect class="rb-eye" x="45" y="30" width="8" height="9" rx="3.5" fill="${ACC}"/></g>
      <rect x="35" y="53" width="10" height="4" rx="2" fill="#2a2d32"/>
      <g class="rb-arm rb-arm--l" style="transform-origin:21px 61px"><rect x="12" y="59" width="9" height="17" rx="4.5" fill="${INK}" stroke="${EDGE}"/></g>
      <g class="rb-arm rb-arm--r" style="transform-origin:59px 61px"><rect x="59" y="59" width="9" height="17" rx="4.5" fill="${INK}" stroke="${EDGE}"/></g>
      <rect x="21" y="56" width="38" height="25" rx="11" fill="#16181b" stroke="${EDGE}" stroke-width="1.3"/>
      <circle class="rb-core" cx="40" cy="68.5" r="4.5" fill="${AMB}"/>
    </g>
  </svg>`;

  // ---------- montagem ----------
  const bot = document.createElement('div');
  bot.className = 'rb' + (wide ? '' : ' rb--nav');
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'rb-btn'; btn.setAttribute('aria-label', T.label); btn.innerHTML = SVG;
  bot.append(btn);
  const bubble = document.createElement('div');
  bubble.className = 'rb-say' + (wide ? '' : ' rb-say--fixed'); bubble.setAttribute('aria-hidden', 'true');
  if (wide) { bot.append(bubble); document.body.append(bot); }
  else {
    const bar = document.querySelector('.nav__bar'); const logo = bar && bar.querySelector('.nav__logo');
    if (!bar) return;
    logo.after(bot); document.body.append(bubble);
  }
  const $ = (s) => bot.querySelector(s);
  const eyes = $('.rb-eyes'), led = $('.rb-led'), core = $('.rb-core'), jet = $('.rb-jet'), armL = $('.rb-arm--l'), armR = $('.rb-arm--r'), all = $('.rb-all');
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const inView = (el) => { const r = el.getBoundingClientRect(); const vis = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0); return vis > Math.min(r.height, innerHeight) * 0.35; };

  // ---------- balão de fala ----------
  let sayT = 0;
  const say = (txt, ms = 2600) => {
    clearTimeout(sayT);
    bubble.textContent = txt;
    if (wide) bubble.classList.toggle('rb-say--r', st.x < 300);
    gsap.killTweensOf(bubble);
    gsap.fromTo(bubble, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: reduce ? 0.01 : 0.2, ease: 'power2.out' });
    sayT = setTimeout(() => gsap.to(bubble, { opacity: 0, duration: 0.25 }), ms);
  };

  // ---------- posição (só telas largas) ----------
  const SIZE = 64;
  const st = { x: 0, y: 0, r: 0 };
  const dock = () => ({ x: innerWidth - SIZE - 28, y: innerHeight - SIZE * 1.2 - 24 });
  const render = () => gsap.set(bot, { x: st.x, y: st.y, rotation: st.r });
  // o robô sempre persegue um alvo: a base ou o elemento da tarefa, relido a cada quadro
  // (se a página rolar no meio da tarefa, ele acompanha o elemento em vez de ficar parado no lugar antigo)
  let home = true, follow = null, arrive = null, live = false;
  const clampPt = (x, y) => ({ x: Math.max(12, Math.min(innerWidth - SIZE - 12, x)), y: Math.max(84, Math.min(innerHeight - SIZE * 1.3, y)) });
  const aim = () => {
    if (!follow) return dock();
    const r = follow.getBoundingClientRect();
    return clampPt(r.right - SIZE * 0.55, r.top - SIZE * 0.7);
  };
  const tick = () => {
    if (!live) return;
    const p = aim();
    const dx = p.x - st.x, dy = p.y - st.y, d = Math.hypot(dx, dy);
    if (d < 0.4 && Math.abs(st.r) < 0.2) { if (arrive) { const a = arrive; arrive = null; a(); } return; }
    st.x += dx * 0.11; st.y += dy * 0.11;
    st.r += (Math.max(-12, Math.min(12, dx * 0.06)) - st.r) * 0.2;
    gsap.set(jet, { scaleY: 1 + Math.min(0.5, d / 300) });
    render();
    if (d < 6 && arrive) { const a = arrive; arrive = null; a(); }
  };
  const flyTo = (el) => new Promise((res) => {
    if (!wide || reduce) { res(); return; }
    follow = el; home = !el;
    arrive = res; setTimeout(() => { if (arrive === res) { arrive = null; res(); } }, 1600);
  });
  const near = (el) => flyTo(el);
  const goHome = () => flyTo(null);

  // ---------- pequenos gestos ----------
  let bobT = null;
  const bob = () => { if (reduce) return; if (bobT) bobT.kill(); bobT = gsap.to(all, { y: -3, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: 7 }); };
  const blink = () => { if (!reduce) gsap.fromTo($('.rb-eyes'), { scaleY: 1, transformOrigin: '40px 34px' }, { scaleY: 0.1, duration: 0.08, yoyo: true, repeat: 1 }); setTimeout(blink, 3500 + Math.random() * 3000); };
  const wave = () => { if (reduce) return; gsap.timeline().to(armR, { rotation: -150, duration: 0.25, ease: 'power2.out' }).to(armR, { rotation: -120, duration: 0.18, yoyo: true, repeat: 3 }).to(armR, { rotation: 0, duration: 0.3 }); };
  const work = (on) => { gsap.to([armL, armR], { rotation: on ? -35 : 0, duration: 0.25, stagger: 0.05 }); gsap.to(core, { fill: on ? ACC : AMB, duration: 0.25 }); };
  const pulseLed = (c = ACC) => { gsap.fromTo(led, { fill: '#ffffff' }, { fill: c, duration: 0.5 }); };
  if (wide) addEventListener('pointermove', (e) => {
    const r = bot.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height * 0.35;
    const a = Math.atan2(e.clientY - cy, e.clientX - cx);
    gsap.to(eyes, { x: Math.cos(a) * 3, y: Math.sin(a) * 2.2, duration: 0.25, overwrite: true });
  }, { passive: true });

  // ---------- fila de tarefas: uma de cada vez ----------
  let chain = Promise.resolve(), busy = 0;
  const queue = (fn) => { busy++; chain = chain.then(fn).catch(() => {}).then(() => { busy--; if (!busy && wide && !home) setTimeout(() => { if (!busy) goHome().then(bob); }, 900); }); return chain; };

  // 1. projetos: varredura na ilustração e um selo de verificado
  const scanArt = (art, txt, ok) => queue(async () => {
    if (art.dataset.rbDone || !inView(art)) return; art.dataset.rbDone = '1';
    const badge = document.createElement('span'); badge.className = 'rb-badge'; badge.textContent = ok;
    if (reduce) { art.append(badge); gsap.set(badge, { opacity: 1 }); return; }
    await near(art); work(true); say(txt, 1800);
    const beam = document.createElement('span'); beam.className = 'rb-beam'; art.append(beam);
    await new Promise((r) => gsap.fromTo(beam, { y: 0, opacity: 1 }, { y: art.clientHeight + 46, duration: 1.3, ease: 'power1.inOut', onComplete: r }));
    gsap.to(beam, { opacity: 0, duration: 0.3, onComplete: () => beam.remove() });
    art.append(badge);
    gsap.fromTo(badge, { opacity: 0, scale: 0.94, y: 6 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(2)' });
    work(false); pulseLed(); say(ok, 1600); await wait(900);
  });

  // 2. automação: pacotes correndo pelos fios do pipeline, canais acendem, cards confirmam
  const packet = (svg, path, dur) => new Promise((res) => {
    const len = path.getTotalLength();
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('r', svg.viewBox.baseVal.width > 500 ? 6 : 5); c.setAttribute('fill', ACC); c.setAttribute('class', 'rb-pkt');
    svg.append(c);
    const o = { t: 0 };
    const place = () => { const pt = path.getPointAtLength(o.t * len); c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); };
    place();
    gsap.to(o, { t: 1, duration: dur, ease: 'power1.inOut', onUpdate: place, onComplete: () => { gsap.to(c, { opacity: 0, duration: 0.25, onComplete: () => c.remove() }); res(); } });
  });
  const runPipe = (card) => queue(async () => {
    if (card.dataset.rbDone || !inView(card)) return; card.dataset.rbDone = '1';
    const svg = [...card.querySelectorAll('svg')].find((x) => x.getBoundingClientRect().width > 0);
    const facts = [...document.querySelectorAll('#automacao .fact')];
    if (!svg) return;
    const lanes = [...svg.querySelectorAll('.rb-lane')];
    const wires = [...svg.querySelectorAll('.rb-wire')];
    const first = wires.find((w) => !w.dataset.to), branches = wires.filter((w) => w.dataset.to);
    if (reduce) { lanes.forEach((l) => l.classList.add('is-lit')); facts.forEach((f) => f.classList.add('rb-ok')); return; }
    await near(card); work(true); say(T.pipe, 3200);
    for (let round = 0; round < 2; round++) {
      await packet(svg, first, 0.55);
      await Promise.all(branches.map((w, i) => packet(svg, w, 0.75 + i * 0.08).then(() => { const l = lanes[+w.dataset.to]; if (l) l.classList.add('is-lit'); pulseLed(); })));
    }
    for (const f of facts) { f.classList.add('rb-ok'); await wait(140); }
    work(false); say(T.pipeOk, 3200); wave(); await wait(1400);
  });

  // 3. testes: ele "roda" o terminal de testes
  const runTests = (term) => queue(async () => {
    if (term.dataset.rbDone || !inView(term)) return; term.dataset.rbDone = '1';
    if (reduce) return;
    await near(term); work(true); say(T.tests, 2000);
    await wait(2300); work(false); pulseLed(); say(T.testsOk, 2000); await wait(900);
  });

  // 4. contato: aponta o botão de e-mail com um anel
  const pointContact = (btn) => queue(async () => {
    if (btn.dataset.rbDone || !inView(btn)) return; btn.dataset.rbDone = '1';
    await near(btn); say(T.contact, 2400); wave();
    if (!reduce) { btn.classList.remove('rb-ping'); void btn.offsetWidth; btn.classList.add('rb-ping'); }
    await wait(1600);
  });

  // ---------- gatilhos: quando cada parte aparece na tela ----------
  // a tarefa só roda se o alvo ainda estiver na tela quando chegar a vez dela; senão espera ele voltar
  const watch = (el, fn, thr = 0.55) => {
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting || el.dataset.rbDone || el.dataset.rbQ) return;
        el.dataset.rbQ = '1';
        fn(el).finally(() => { delete el.dataset.rbQ; if (el.dataset.rbDone) io.disconnect(); });
      });
    }, { threshold: thr });
    io.observe(el);
  };
  const arts = document.querySelectorAll('.project__art');
  watch(arts[0], (el) => scanArt(el, T.scanT, T.okT), 0.6);
  watch(arts[1], (el) => scanArt(el, T.scanA, T.okA), 0.6);
  watch(document.querySelector('.pipe-card'), runPipe, 0.6);
  watch(document.querySelector('[data-term-run]'), runTests, 0.7);
  watch(document.querySelector('#contato .btn--primary'), pointContact, 1);

  // "bot" no terminal ou clique: escaneia a seção visível (ou dá uma dica)
  let tip = 0;
  const scanHere = () => {
    const mid = innerHeight / 2;
    const sec = [...document.querySelectorAll('main > section')].find((s) => { const r = s.getBoundingClientRect(); return r.top <= mid && r.bottom >= mid; });
    const art = sec && sec.querySelector('.project__art'), card = sec && sec.querySelector('.pipe-card'), term = sec && sec.querySelector('[data-term-run]');
    const reset = (el) => { if (!el) return; delete el.dataset.rbDone; el.querySelectorAll('.rb-badge').forEach((b) => b.remove()); el.querySelectorAll('.rb-lane').forEach((l) => l.classList.remove('is-lit')); };
    if (art) { reset(art); const t = art === arts[0]; scanArt(art, t ? T.scanT : T.scanA, t ? T.okT : T.okA); }
    else if (card) { reset(card); document.querySelectorAll('#automacao .fact').forEach((f) => f.classList.remove('rb-ok')); runPipe(card); }
    else if (term) { reset(term); runTests(term); }
    else { say(T.tips[tip++ % T.tips.length]); wave(); }
  };
  addEventListener('rb:scan', scanHere);
  btn.addEventListener('click', () => { pulseLed(); if (busy) return; say(T.tips[tip++ % T.tips.length], 3000); wave(); });

  // o gato chegou
  addEventListener('kc:on', () => {
    if (wide) { say(T.cat, 2400); gsap.fromTo(eyes, { scale: 1.35, transformOrigin: '40px 34px' }, { scale: 1, duration: 0.6, delay: 0.4 }); }
    else { say(T.catNav, 2200); gsap.to(bot, { opacity: 0, duration: 0.4, delay: 1.6, onComplete: () => bot.remove() }); }
  });
  let catOn = false; try { catOn = sessionStorage.getItem('kc-on') === '1'; } catch {}
  if (catOn && !wide) bot.remove();

  // ---------- entrada ----------
  if (wide) {
    const d = dock(); st.x = d.x; st.y = d.y + 140; render();
    addEventListener('resize', () => { if (reduce) { const n = dock(); st.x = n.x; st.y = n.y; render(); } });
  }
  gsap.set(bot, { opacity: 0 });
  setTimeout(() => {
    gsap.to(bot, { opacity: 1, duration: 0.4 });
    if (wide && !reduce) { live = true; gsap.ticker.add(tick); setTimeout(() => { bob(); wave(); }, 900); }
    else if (wide) { const d = dock(); st.y = d.y; render(); }
    say(T.hello, 3200);
    setTimeout(blink, 2000);
  }, 1400);

  window.__rb = { get busy() { return busy; }, get home() { return home; }, scan: scanHere };
})();
