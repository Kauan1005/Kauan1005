// Portfólio v2 · comportamento mínimo da Fase 2: menu mobile, copiar e-mail, link ativo no menu.
(() => {
  // menu mobile
  const btn = document.querySelector('.nav__menu');
  const sheet = document.getElementById('sheet');
  if (btn && sheet) {
    const set = (open) => {
      sheet.hidden = !open;
      sheet.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? btn.dataset.close : btn.dataset.open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    sheet.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) { set(false); btn.focus(); } });
    matchMedia('(min-width: 901px)').addEventListener('change', (m) => { if (m.matches) set(false); });
  }

  // copiar e-mail
  document.querySelectorAll('[data-copy]').forEach((b) => {
    const label = b.querySelector('span');
    const original = label.textContent;
    b.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(b.dataset.copy); } catch { return; }
      label.textContent = b.dataset.done;
      setTimeout(() => { label.textContent = original; }, 1800);
    });
  });

  // link do menu da seção visível
  const links = [...document.querySelectorAll('.nav__links a')];
  const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const alias = { acrilife: 'projetos', github: 'habilidades' };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const id = alias[e.target.id] || e.target.id;
      links.forEach((a) => a.removeAttribute('aria-current'));
      map.get(id)?.setAttribute('aria-current', 'true');
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main > section[id]').forEach((s) => io.observe(s));

  // o gato agora só aparece pelo comando "cat" no terminal do topo (term.js)
})();
