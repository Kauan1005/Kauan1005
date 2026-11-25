// Portfólio v2 · Fase 3: animações (Lenis + GSAP/ScrollTrigger).
// Só transform e opacity. Sem nada disso com prefers-reduced-motion.
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const { gsap, ScrollTrigger, Lenis } = window;
  if (reduce || !gsap || !ScrollTrigger || !Lenis) { root.classList.remove('m-on'); return; }
  window.__motionReady = true;
  gsap.registerPlugin(ScrollTrigger);

  const EASE = 'expo.out';            // entrada forte e suave (equivale a cubic-bezier(.19,1,.22,1))
  const small = matchMedia('(max-width: 767px)').matches;
  const RISE = small ? 18 : 28;

  // ---------- 1. scroll suave ----------
  const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const target = id === '#top' ? 0 : document.querySelector(id);
    if (target === null) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: id === '#top' ? 0 : -24, duration: 1.2 });
    history.replaceState(null, '', id);
  });
  // a página do outro idioma abre na mesma seção
  document.querySelectorAll('.lang a').forEach((a) => {
    a.addEventListener('click', () => {
      const secs = [...document.querySelectorAll('main > section[id]')];
      const mid = innerHeight / 2;
      const cur = secs.find((s) => { const r = s.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; });
      if (cur && cur.id !== 'top') a.href = a.getAttribute('href').split('#')[0] + '#' + cur.id;
    });
  });
  if (location.hash) {
    const t = document.querySelector(location.hash);
    if (t) requestAnimationFrame(() => lenis.scrollTo(t, { immediate: true, offset: -24 }));
  }

  // ---------- 3. hero: digitação + palavras ----------
  const hero = document.querySelector('.hero');
  const splitWords = (el) => {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(part); return; }
            const w = document.createElement('span'); w.className = 'w';
            const i = document.createElement('span'); i.textContent = part;
            w.append(i); frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    return el.querySelectorAll('.w > span');
  };
  const typeChars = (el) => {
    const nodes = [];
    [...el.childNodes].forEach((n) => {
      if (n.nodeType !== 3 && !(n.nodeType === 1 && n.tagName === 'B')) return;
      const text = n.textContent; const frag = document.createDocumentFragment();
      const wrap = n.nodeType === 1 ? n : null;
      if (wrap) wrap.textContent = '';
      [...text].forEach((ch) => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; (wrap || frag).append(s); nodes.push(s); });
      if (!wrap) n.replaceWith(frag);
    });
    return nodes;
  };
  if (hero) {
    const h1 = hero.querySelector('h1');
    const words = splitWords(h1);
    const type = hero.querySelector('.hero__type');
    const chars = type ? typeChars(type) : [];
    const items = hero.querySelectorAll('[data-h]');
    const bento = hero.querySelectorAll('.hero__bento > *');
    const json = hero.querySelectorAll('.hero__bento .term__body p');
    gsap.set(chars, { opacity: 0 });
    gsap.set(words, { yPercent: 110 });
    gsap.set(json, { opacity: 0 });
    const tl = gsap.timeline({ defaults: { ease: EASE }, delay: 0.15 });
    tl.to(items[0], { opacity: 1, y: 0, duration: 0.6 })                                   // chip de status
      .to(type, { opacity: 1, y: 0, duration: 0.3 }, '-=0.35')
      .to(chars, { opacity: 1, duration: 0.01, stagger: 0.055, ease: 'none' })              // digitação
      // no celular o título e o texto entram junto com a digitação (o LCP não espera ela terminar)
      .to(h1, { opacity: 1, y: 0, duration: 0.01 }, small ? 0.05 : '-=0.15')
      .to(words, { yPercent: 0, duration: small ? 0.6 : 0.8, stagger: small ? 0.04 : 0.06 }, '<')  // palavras
      .to([...items].slice(1), { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, small ? 0.15 : '-=0.55')
      .to(bento, { opacity: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.09 }, '-=0.7')
      .to(json, { opacity: 1, duration: 0.01, stagger: 0.09, ease: 'none' }, '-=0.45');
  }

  // ---------- 2. revelação das seções com stagger ----------
  ScrollTrigger.batch('[data-r]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: EASE, stagger: 0.07, overwrite: true }),
  });
  // dentro do card do projeto: as partes entram em sequência depois do card
  document.querySelectorAll('.project').forEach((card) => {
    const parts = card.querySelectorAll('[data-ri]');
    ScrollTrigger.create({
      trigger: card, start: 'top 80%', once: true,
      onEnter: () => gsap.to(parts, { opacity: 1, y: 0, duration: 0.7, ease: EASE, stagger: 0.06, delay: 0.15 }),
    });
  });
  // terminal de testes: o comando é digitado e as linhas aparecem uma a uma
  document.querySelectorAll('[data-term-run]').forEach((term) => {
    const lines = [...term.querySelectorAll('.term__body p')];
    const cmd = lines[0]?.querySelector('.t-w');
    const chars = cmd ? typeChars(cmd) : [];
    gsap.set(chars, { opacity: 0 });
    gsap.set(lines.slice(1), { opacity: 0 });
    ScrollTrigger.create({
      trigger: term, start: 'top 80%', once: true,
      onEnter: () => gsap.timeline({ delay: 0.3 })
        .to(chars, { opacity: 1, duration: 0.01, stagger: 0.045, ease: 'none' })
        .to(lines.slice(1), { opacity: 1, duration: 0.01, stagger: 0.09, ease: 'none' }, '+=0.2'),
    });
  });

  // ---------- 5. parallax leve ----------
  if (!small) {
    document.querySelectorAll('.project__art svg, .pipe-h svg').forEach((el) => {
      gsap.fromTo(el, { y: 24 }, { y: -24, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    const bentoWrap = document.querySelector('.hero__bento');
    if (bentoWrap) gsap.to(bentoWrap, { y: -40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  // ---------- 4. brilho que segue o cursor ----------
  if (fine) {
    document.querySelectorAll('.card, .term, .tl-item').forEach((host) => {
      const g = document.createElement('span'); g.className = 'glow'; g.setAttribute('aria-hidden', 'true');
      host.prepend(g);
      const xTo = gsap.quickTo(g, 'x', { duration: 0.35, ease: 'power3.out' });
      const yTo = gsap.quickTo(g, 'y', { duration: 0.35, ease: 'power3.out' });
      host.addEventListener('pointerenter', (e) => {
        const r = host.getBoundingClientRect();
        gsap.set(g, { x: e.clientX - r.left, y: e.clientY - r.top });
      });
      host.addEventListener('pointermove', (e) => {
        const r = host.getBoundingClientRect();
        xTo(e.clientX - r.left); yTo(e.clientY - r.top);
      }, { passive: true });
    });

    // opcional: hover magnético nos botões principais
    document.querySelectorAll('.btn--primary, .btn--icon').forEach((b) => {
      const xTo = gsap.quickTo(b, 'x', { duration: 0.3, ease: 'power3.out' });
      const yTo = gsap.quickTo(b, 'y', { duration: 0.3, ease: 'power3.out' });
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.18);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.25);
      });
      b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
