// Portfólio v2 · o gato (versão brincalhona).
// SVG próprio por partes + GSAP + um "cérebro" que escolhe ações sem parar:
// andar, correr, zoomies, brincar de bola, subir nas letras e esfregar a cabeça nelas,
// seguir a rolagem da página, cair de volta cansado, atacar o cursor com duplo clique.
(() => {
  const { gsap } = window;
  if (!gsap || document.querySelector('.kc-wrap')) return;
  const html = document.documentElement;
  const isEn = html.lang === 'en';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 900px), (pointer: coarse)').matches;
  const T = isEn ? { pause: 'Pause the cat', play: 'Wake the cat' } : { pause: 'Pausar o gato', play: 'Acordar o gato' };

  // ---------- desenho (viewBox 220x160, pés na linha y=146) ----------
  const INK = '#1d2024', EDGE = 'rgba(255,255,255,.24)', ACC = '#4ade80', AMB = '#f5b454';
  const HIPS = [[74, 108], [86, 110], [116, 110], [128, 108]];
  const TAILS = {
    up: 'M60 92c-22-2-30-24-20-46', walk: 'M60 95c-20 3-34-6-42-22', q: 'M60 92c-16-6-18-32-2-42 11-7 23 3 14 13',
    sleep: 'M56 128c-6 12 12 17 42 17s46-3 54-8', stretch: 'M52 84c-8-24 2-46 20-54', jump: 'M60 92c-20-12-24-34-12-50',
    low: 'M60 96c-16 4-30 2-44-6',
  };
  const eye = (kind, x) => {
    const g = 'filter="url(#kc-glow)"';
    if (kind === 'closed') return `<path d="M${x - 4.5} -1q4.5 3.5 9 0" fill="none" stroke="${ACC}" stroke-width="2" stroke-linecap="round" opacity=".75"/>`;
    if (kind === 'squint') return `<path d="M${x - 4.5} 0q4.5 -4 9 0" fill="none" stroke="${ACC}" stroke-width="2.2" stroke-linecap="round" ${g}/>`;
    if (kind === 'angry') {
      const m = x < 0 ? 1 : -1; // canto interno mais baixo nos dois olhos
      return `<path d="M${x - 5 * m} -3.5L${x + 5 * m} 0L${x + 4.5 * m} 2.6Q${x} 4.6 ${x - 4.5 * m} 2.6Z" fill="${ACC}" ${g}/><ellipse class="kc-pupil" cx="${x}" cy="1" rx="1.2" ry="2.2" fill="#052e16"/><path d="M${x - 6 * m} -8L${x + 5 * m} -3.6" stroke="#e8eaed" stroke-width="2" stroke-linecap="round"/>`;
    }
    if (kind === 'dizzy') return `<path d="M${x - 4.5} -1a4.5 4.5 0 1 1 4.5 4.5a3 3 0 1 1-3-3a1.5 1.5 0 1 1 1.5 1.5" fill="none" stroke="${ACC}" stroke-width="1.6" stroke-linecap="round" ${g}/>`;
    if (kind === 'wide') return `<circle cx="${x}" cy="-1" r="5.6" fill="${ACC}" ${g}/><circle class="kc-pupil" cx="${x + 1.2}" cy="-1.4" r="2.8" fill="#052e16"/>`;
    return `<ellipse cx="${x}" cy="-1" rx="4.4" ry="5.2" fill="${ACC}" ${g}/><ellipse class="kc-pupil" cx="${x}" cy="-1" rx="1.4" ry="3.6" fill="#052e16"/>`;
  };
  const eyeSet = (k) => `<g class="kc-eye" data-eye="${k}"${k === 'open' ? '' : ' opacity="0"'}>${eye(k, -9)}${eye(k, 9)}</g>`;
  const leg = (i) => `<g class="kc-leg" data-i="${i}"><rect x="${HIPS[i][0] - 5}" y="${HIPS[i][1] - 4}" width="10" height="34" rx="5" fill="${i === 1 || i === 3 ? '#16181b' : INK}" stroke="${EDGE}" stroke-width="1.2"/></g>`;
  // cadeira gamer: encosto com almofada e faixa verde, assento com costura âmbar, base com rodinhas
  const CHAIR = `<svg viewBox="0 0 140 172" aria-hidden="true" focusable="false">
    <g stroke="#2a2d32" stroke-width="5" stroke-linecap="round"><path d="M70 150 22 160M70 150l48 10M70 150 46 164M70 150l24 14"/></g>
    <g fill="#0b0c0e" stroke="rgba(255,255,255,.28)" stroke-width="1.2"><circle cx="20" cy="165" r="5.5"/><circle cx="120" cy="165" r="5.5"/><circle cx="45" cy="166.5" r="5"/><circle cx="95" cy="166.5" r="5"/></g>
    <rect x="65" y="116" width="10" height="36" rx="3" fill="#1d2024" stroke="rgba(255,255,255,.2)"/>
    <path d="M12 104V22c0-10 8-16 18-16h6c10 0 16 6 16 16v82z" fill="#16181b" stroke="rgba(255,255,255,.24)" stroke-width="1.2"/>
    <path d="M18 30c4 10 4 50 0 66M46 30c-4 10-4 50 0 66" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="1.2"/>
    <path d="M32 46v54" stroke="#4ade80" stroke-width="3" stroke-linecap="round" opacity=".85"/>
    <rect x="17" y="22" width="30" height="16" rx="7" fill="#1d2024" stroke="#4ade80" stroke-opacity=".7" stroke-width="1.2"/>
    <rect x="100" y="80" width="7" height="22" rx="2" fill="#1d2024" stroke="rgba(255,255,255,.2)"/>
    <rect x="88" y="74" width="32" height="8" rx="4" fill="#16181b" stroke="#4ade80" stroke-opacity=".55"/>
    <rect x="18" y="98" width="106" height="20" rx="9" fill="#1d2024" stroke="rgba(255,255,255,.24)" stroke-width="1.2"/>
    <path d="M28 112h86" stroke="#f5b454" stroke-opacity=".6" stroke-width="2" stroke-dasharray="4 4"/>
  </svg>`;
  const svg = `<svg class="kc" viewBox="0 0 220 160" aria-hidden="true" focusable="false">
  <defs><filter id="kc-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <ellipse class="kc-shadow" cx="104" cy="146" rx="58" ry="5" fill="rgba(0,0,0,.55)"/>
  <g class="kc-all">
    <g class="kc-tails">${Object.entries(TAILS).map(([k, d]) => `<path data-tail="${k}" d="${d}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"${k === 'up' ? '' : ' opacity="0"'}/>`).join('')}</g>
    ${leg(1)}${leg(3)}
    <g class="kc-body"><ellipse class="kc-hit" cx="100" cy="96" rx="44" ry="24" fill="${INK}" stroke="${EDGE}" stroke-width="1.2"/></g>
    ${leg(0)}${leg(2)}
    <g class="kc-paws" opacity="0"><ellipse cx="128" cy="138" rx="9" ry="5.5" fill="${INK}" stroke="${EDGE}" stroke-width="1.2"/><ellipse cx="142" cy="140" rx="9" ry="5.5" fill="${INK}" stroke="${EDGE}" stroke-width="1.2"/></g>
    <g class="kc-head"><g transform="translate(142 64)"><g class="kc-look">
      <g class="kc-ears" data-ears="up" fill="${INK}" stroke="${EDGE}" stroke-width="1.2" stroke-linejoin="round"><path d="M-20 -7-16-33-3-17z"/><path d="M3-17 16-33 20-7z"/></g>
      <g class="kc-ears" data-ears="back" opacity="0" fill="${INK}" stroke="${EDGE}" stroke-width="1.2" stroke-linejoin="round"><path d="M-22-3-31-21-8-15z"/><path d="M8-15 31-21 22-3z"/></g>
      <g fill="${ACC}" opacity=".18"><path d="M-16-12-14-26-7-17z"/><path d="M7-17 14-26 16-12z"/></g>
      <ellipse class="kc-hit" rx="24" ry="20" fill="${INK}" stroke="${EDGE}" stroke-width="1.2"/>
      <g class="kc-halo"><ellipse cx="0" cy="-43" rx="15" ry="4.2" fill="none" stroke="${AMB}" stroke-width="2.6" filter="url(#kc-glow)"/></g>
      <g class="kc-eyes">${['open', 'wide', 'squint', 'closed', 'angry', 'dizzy'].map(eyeSet).join('')}</g>
      <path class="kc-nose" d="M-2.4 6.5h4.8l-2.4 2.8z" fill="${AMB}"/>
      <g class="kc-hiss" opacity="0"><path d="M-6.5 10q6.5 9 13 0z" fill="#052e16" stroke="${EDGE}" stroke-width=".8"/><path d="M-4.4 10.4l1.3 3.4 1.3-3.4M1.8 10.4l1.3 3.4 1.3-3.4" fill="#e8eaed"/></g>
      <g class="kc-mouth" opacity="0"><path d="M-5 11q5 7 10 0z" fill="#052e16" stroke="${EDGE}" stroke-width=".8"/><path d="M-2 13.5q2 6 4 0z" fill="#ff8fa3"/></g>
      <g stroke="rgba(255,255,255,.24)" stroke-width="1" stroke-linecap="round"><path d="M-9 9-27 7M-9 11-26 14M9 9 27 7M9 11 26 14"/></g>
    </g></g></g>
  </g>
  <g class="kc-tx"><g class="kc-zzz" opacity="0" font-family="JetBrains Mono, monospace" fill="${ACC}"><text x="170" y="104" font-size="15">z</text><text x="184" y="86" font-size="12" opacity=".7">z</text><text x="195" y="71" font-size="9" opacity=".5">z</text></g></g>
  <g class="kc-burst" opacity="0" stroke="${AMB}" stroke-width="2.4" stroke-linecap="round"><path d="M168 24l8-8M180 40h11M164 14V4M46 30l-8-8M34 44h-10"/></g>
  <g class="kc-tx"><text class="kc-say" x="150" y="24" opacity="0" font-family="JetBrains Mono, monospace" font-size="15" fill="${ACC}">prrr</text></g>
  <g class="kc-tx"><text class="kc-hss" x="146" y="24" opacity="0" font-family="JetBrains Mono, monospace" font-size="16" font-weight="500" fill="${AMB}">hss!</text></g>
  <g class="kc-tx"><text class="kc-fixed" x="92" y="22" opacity="0" font-family="JetBrains Mono, monospace" font-size="13" font-weight="500" fill="${ACC}">${isEn ? '// bug fixed' : '// bug corrigido'}</text></g>
  <g class="kc-tx"><text class="kc-miau" x="146" y="24" opacity="0" font-family="JetBrains Mono, monospace" font-size="16" font-weight="500" fill="${ACC}">${isEn ? 'meow!' : 'miau!'}</text></g>
  <g class="kc-tx"><g class="kc-name" opacity="0"><rect x="110" y="2" width="88" height="24" rx="12" fill="#16181b" stroke="${ACC}" stroke-width="1.2"/><text x="154" y="18.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12.5" font-weight="500" fill="${ACC}">Banguela</text></g></g>
  <g class="kc-tx"><text class="kc-sneeze" x="138" y="24" opacity="0" font-family="JetBrains Mono, monospace" font-size="15" font-weight="500" fill="${AMB}">${isEn ? 'achoo!' : 'atchim!'}</text></g>
  <g class="kc-tx"><text class="kc-nhac" x="146" y="24" opacity="0" font-family="JetBrains Mono, monospace" font-size="16" font-weight="500" fill="${AMB}">${isEn ? 'chomp!' : 'nhac!'}</text></g>
  <g class="kc-tx"><text class="kc-oops" x="150" y="24" opacity="0" font-family="JetBrains Mono, monospace" font-size="18" font-weight="500" fill="#a1a7ad">...</text></g>
  <g class="kc-tx"><text class="kc-look" x="146" y="24" opacity="0" font-family="JetBrains Mono, monospace" font-size="15" font-weight="500" fill="${ACC}">${isEn ? 'look!' : 'olha!'}</text></g>
  <g class="kc-tx"><text class="kc-boo" x="150" y="24" opacity="0" font-family="JetBrains Mono, monospace" font-size="17" font-weight="500" fill="${AMB}">${isEn ? 'boo!' : 'bu!'}</text></g>
  <g class="kc-tx"><text class="kc-q" x="150" y="22" opacity="0" font-family="JetBrains Mono, monospace" font-size="24" font-weight="500" fill="${AMB}">?</text></g>
</svg>`;

  // ---------- poses (relativas ao desenho de pé) ----------
  const L = (x = 0, y = 0, rotation = 0, scaleY = 1, opacity = 1) => ({ x, y, rotation, scaleY, opacity });
  const B = (x = 0, y = 0, rotation = 0, scaleX = 1, scaleY = 1) => ({ x, y, rotation, scaleX, scaleY });
  const Hd = (x = 0, y = 0, rotation = 0) => ({ x, y, rotation });
  const P = {
    idle: { all: 0, body: B(), head: Hd(), legs: [L(), L(), L(), L()], tail: 'up', eyes: 'open', ears: 'up', shadow: 1 },
    walk: { all: 0, body: B(0, 2, 2), head: Hd(2, 6, 4), legs: [L(), L(), L(), L()], tail: 'walk', eyes: 'open', ears: 'up', shadow: 1 },
    run: { all: 0, body: B(2, 4, 0, 1.1, 0.94), head: Hd(8, 10, 8), legs: [L(), L(), L(), L()], tail: 'low', eyes: 'open', ears: 'back', shadow: 1.05 },
    curious: { all: 0, body: B(), head: Hd(0, -2, -16), legs: [L(), L(), L(), L()], tail: 'q', eyes: 'open', ears: 'up', shadow: 1 },
    sleep: { all: 0, body: B(4, 28, 0, 1.18, 0.79), head: Hd(8, 56, 12), legs: [L(0, 18, 0, 0.5, 0), L(0, 18, 0, 0.5, 0), L(0, 18, 0, 0.5, 0), L(0, 18, 0, 0.5, 0)], tail: 'sleep', eyes: 'closed', ears: 'up', paws: 1, shadow: 1.14 },
    stretch: { all: 0, body: B(-8, 6, -15), head: Hd(-10, 46, 10), legs: [L(-10, -10, 0, 1.29), L(-10, -8, 0, 1.18), L(12, 18, -84, 1.82), L(4, 26, -86, 1.94)], tail: 'stretch', eyes: 'squint', ears: 'up', shadow: 1 },
    jump: { all: 0, body: B(0, 0, -6), head: Hd(0, 0, -6), legs: [L(0, 0, 38, 0.82), L(0, 0, 30, 0.82), L(0, 0, -34, 0.82), L(0, 0, -40, 0.82)], tail: 'jump', eyes: 'wide', ears: 'back', shadow: 0.7 },
    crouch: { all: 0, body: B(0, 10, 9), head: Hd(6, 20, 6), legs: [L(0, 2, 0, 0.9), L(0, 2, 0, 0.9), L(0, 6, 0, 0.62), L(0, 6, 0, 0.62)], tail: 'low', eyes: 'wide', ears: 'back', shadow: 1.05 },
    pounce: { all: 0, body: B(4, -4, -12, 1.08, 0.96), head: Hd(10, -6, -8), legs: [L(0, 0, 55, 1.05), L(0, 0, 48, 1.05), L(0, 0, -70, 1.15), L(0, 0, -64, 1.15)], tail: 'walk', eyes: 'wide', ears: 'back', shadow: 0.6 },
    tired: { all: 0, body: B(0, 8, 3, 1.02, 0.94), head: Hd(4, 16, 12), legs: [L(0, 4, -6, 0.9), L(0, 4, 4, 0.9), L(0, 4, 6, 0.9), L(0, 4, -4, 0.9)], tail: 'low', eyes: 'squint', ears: 'back', mouth: 1, shadow: 1 },
    rub: { all: 0, body: B(0, 4, 8), head: Hd(4, 18, 24), legs: [L(), L(), L(0, 2, 0, 0.9), L(0, 2, 0, 0.9)], tail: 'q', eyes: 'squint', ears: 'up', shadow: 1 },
    happy: { all: 0, body: B(), head: Hd(0, -2, -8), legs: [L(), L(), L(), L()], tail: 'up', eyes: 'squint', ears: 'up', shadow: 1 },
    groom: { all: 0, body: B(-6, 8, -18), head: Hd(-4, 12, 22), legs: [L(0, 6, 0, 0.7), L(0, 6, 0, 0.7), L(10, -12, -150, 0.8), L()], tail: 'low', eyes: 'squint', ears: 'up', shadow: 1 },
    oops: { all: 0, body: B(0, 4, 4), head: Hd(-2, 12, 14), legs: [L(), L(), L(), L()], tail: 'low', eyes: 'squint', ears: 'back', shadow: 1 },
    loaf: { all: 0, body: B(4, 28, 0, 1.18, 0.79), head: Hd(8, 50, 4), legs: [L(0, 18, 0, 0.5, 0), L(0, 18, 0, 0.5, 0), L(0, 18, 0, 0.5, 0), L(0, 18, 0, 0.5, 0)], tail: 'sleep', eyes: 'squint', ears: 'up', paws: 1, shadow: 1.14 },
    dizzy: { all: 0, body: B(), head: Hd(0, 2, 6), legs: [L(0, 0, -8), L(0, 0, 8), L(0, 0, 10), L(0, 0, -6)], tail: 'low', eyes: 'dizzy', ears: 'back', shadow: 1 },
    yawn: { all: 0, body: B(0, 0, -3, 1, 1.03), head: Hd(0, -6, -16), legs: [L(), L(), L(), L()], tail: 'up', eyes: 'closed', ears: 'back', mouth: 1, shadow: 1 },
    point: { all: 0, body: B(0, 0, -2), head: Hd(2, 4, 10), legs: [L(), L(), L(6, -10, -70, 1.15), L()], tail: 'up', eyes: 'open', ears: 'up', shadow: 1 },
    alert: { all: 0, body: B(0, -2, -2, 1, 1.03), head: Hd(0, -4, -10), legs: [L(0, 0, 0, 1.04), L(0, 0, 0, 1.04), L(0, 0, 0, 1.04), L(0, 0, 0, 1.04)], tail: 'up', eyes: 'wide', ears: 'up', shadow: 1 },
    dangle: { all: 0, body: B(0, -4, -4, 0.94, 1.1), head: Hd(4, -10, -12), legs: [L(0, 2, 8, 1.15), L(0, 2, -6, 1.15), L(0, 2, -8, 1.15), L(0, 2, 6, 1.15)], tail: 'low', eyes: 'wide', ears: 'back', shadow: 0 },
    pet: { all: 0, body: B(0, -3, -5, 1, 1.06), head: Hd(-2, -8, -20), legs: [L(0, 0, 0, 1.05), L(0, 0, 0, 1.05), L(), L()], tail: 'q', eyes: 'squint', ears: 'up', shadow: 1 },
    angry: { all: 0, body: B(0, -5, 0, 1.07, 1.1), head: Hd(-4, 2, -4), legs: [L(0, 0, -6, 1.08), L(0, 0, 4, 1.08), L(0, 0, 6, 1.08), L(0, 0, -4, 1.08)], tail: 'up', eyes: 'angry', ears: 'back', hiss: 1, shadow: 1.05 },
  };

  // ---------- montagem ----------
  const W = mobile ? 60 : 140;
  const H = Math.round(W * 160 / 220);
  const FOOT = 141 / 160, MIDX = 104 / 220; // linha onde as patas tocam a superfície
  const wrap = document.createElement('div');
  wrap.className = 'kc-wrap' + (mobile ? ' kc-wrap--nav' : '');
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML = `<div class="kc-flip">${svg}</div>`;
  let layer = null;
  if (mobile) {
    const logo = document.querySelector('.nav__bar .nav__logo');
    if (!logo) return;
    logo.after(wrap);
  } else {
    layer = document.createElement('div');
    layer.className = 'kc-layer' + (reduce ? ' kc-layer--fixed' : '');
    layer.append(wrap);
    document.body.append(layer);
    wrap.style.width = W + 'px';
  }
  // visibilidade sem tween: a transição é do CSS, então não depende do relógio do GSAP
  const show = (v) => { wrap.style.opacity = v ? '1' : '0'; };
  const $ = (s) => wrap.querySelector(s);
  const $$ = (s) => [...wrap.querySelectorAll(s)];
  const flip = $('.kc-flip'), body = $('.kc-body'), head = $('.kc-head'), look = $('.kc-look'), eyesG = $('.kc-eyes');
  const legs = $$('.kc-leg'), tailsG = $('.kc-tails'), shadow = $('.kc-shadow');
  const pupils = $$('.kc-pupil');
  // origens: partes de primeiro nível em coordenadas do SVG; partes dentro da cabeça pela própria caixa
  gsap.set(body, { svgOrigin: '100 96' });
  gsap.set(head, { svgOrigin: '142 64' });
  legs.forEach((l, i) => gsap.set(l, { svgOrigin: `${HIPS[i][0]} ${HIPS[i][1] - 4}` }));
  gsap.set(tailsG, { svgOrigin: '60 92' });
  gsap.set(shadow, { svgOrigin: '104 146' });
  gsap.set(look, { transformOrigin: '50% 62%' });
  gsap.set(eyesG, { transformOrigin: '50% 50%' });

  let pose = 'idle', loops = [], paused = false, facing = 1;
  function setPose(name, d = 0.35) {
    const p = P[name]; pose = name;
    const o = { duration: d, ease: 'power3.out', overwrite: 'auto' };
    gsap.to(body, { ...p.body, ...o });
    gsap.to(head, { ...p.head, ...o });
    // devolve o quique da corrida/caminhada para a altura da pose (senão o gato fica flutuando)
    gsap.to($('.kc-all'), { y: p.all || 0, duration: Math.min(d, 0.15), ease: 'power2.out', overwrite: 'auto' });
    legs.forEach((l, i) => gsap.to(l, { ...p.legs[i], ...o }));
    $$('[data-tail]').forEach((t) => gsap.to(t, { opacity: t.dataset.tail === p.tail ? 1 : 0, duration: d * 0.6, overwrite: 'auto' }));
    $$('[data-eye]').forEach((e) => gsap.set(e, { opacity: e.dataset.eye === p.eyes ? 1 : 0 }));
    $$('[data-ears]').forEach((e) => gsap.to(e, { opacity: e.dataset.ears === p.ears ? 1 : 0, duration: 0.12, overwrite: 'auto' }));
    gsap.to($('.kc-paws'), { opacity: p.paws || 0, duration: d * 0.6, overwrite: 'auto' });
    gsap.to($('.kc-mouth'), { opacity: p.mouth || 0, duration: 0.15, overwrite: 'auto' });
    gsap.to($('.kc-hiss'), { opacity: p.hiss || 0, duration: 0.12, overwrite: 'auto' });
    gsap.to(shadow, { scaleX: p.shadow, ...o });
    gsap.to($('.kc-zzz'), { opacity: name === 'sleep' ? 1 : 0, duration: 0.4, overwrite: 'auto' });
  }
  const killLoops = () => { loops.forEach((t) => t.kill()); loops = []; };
  function loop(kind) {
    killLoops();
    if (paused || reduce) return;
    const add = (t) => loops.push(t);
    if (kind === 'idle') {
      add(gsap.to(tailsG, { rotation: 8, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
      add(gsap.to(body, { scaleY: 1.03, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    } else if (kind === 'walk' || kind === 'run') {
      const run = kind === 'run', a = run ? 30 : 18, d = run ? 0.13 : 0.26;
      add(gsap.fromTo([legs[0], legs[3]], { rotation: -a }, { rotation: a, duration: d, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
      add(gsap.fromTo([legs[1], legs[2]], { rotation: a }, { rotation: -a, duration: d, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
      add(gsap.fromTo($('.kc-all'), { y: 0 }, { y: run ? -5 : -1.8, duration: d / 2, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
      add(gsap.to(tailsG, { rotation: run ? -10 : 6, duration: d * 2, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    } else if (kind === 'sleep') {
      add(gsap.fromTo($('.kc-zzz'), { y: 4 }, { y: -8, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
      add(gsap.to(body, { scaleY: 0.83, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    } else if (kind === 'tired') {
      add(gsap.to(body, { scaleY: 0.88, duration: 0.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
      add(gsap.to(head, { y: 19, duration: 0.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
      add(gsap.to($('.kc-mouth'), { scaleY: 1.25, transformOrigin: '50% 0%', duration: 0.2, yoyo: true, repeat: -1 }));
    } else if (kind === 'wiggle') {
      add(gsap.to(body, { rotation: 13, x: 2, duration: 0.09, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
      add(gsap.to(tailsG, { rotation: -14, duration: 0.09, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    } else if (kind === 'groom') {
      add(gsap.to(head, { rotation: 30, y: 15, duration: 0.32, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
      add(gsap.to(legs[2], { rotation: -132, duration: 0.32, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    } else if (kind === 'dizzy') {
      add(gsap.to(body, { rotation: 6, duration: 0.35, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
      add(gsap.to(head, { rotation: -8, x: 3, duration: 0.42, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    } else if (kind === 'dangle') {
      // pendurado pelo cangote: patas pedalando no ar e rabo balançando
      add(gsap.to([legs[0], legs[2]], { rotation: 18, duration: 0.22, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
      add(gsap.to([legs[1], legs[3]], { rotation: -14, duration: 0.26, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
      add(gsap.to(tailsG, { rotation: 12, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    } else if (kind === 'pet') {
      // carinho: a cabeça sobe e desce contra a mão, o corpo balança e o rabo enrola
      add(gsap.to(head, { y: -2, rotation: -26, duration: 0.42, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
      add(gsap.to(body, { rotation: -1, scaleY: 1.09, duration: 0.42, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
      add(gsap.to(tailsG, { rotation: 12, duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    } else if (kind === 'angry') {
      add(gsap.to(body, { x: 1.2, duration: 0.05, ease: 'none', yoyo: true, repeat: -1 }));
      add(gsap.to(tailsG, { rotation: 4, duration: 0.06, ease: 'none', yoyo: true, repeat: -1 }));
    } else if (kind === 'rub') {
      add(gsap.to(look, { rotation: 14, duration: 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
      add(gsap.to(head, { x: 9, duration: 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
      add(gsap.to(tailsG, { rotation: 10, duration: 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    }
  }
  function act(name, d) { setPose(name, d); const l = { idle: 'idle', curious: 'idle', happy: 'idle', walk: 'walk', run: 'run', sleep: 'sleep', tired: 'tired', crouch: 'wiggle', rub: 'rub', pet: 'pet', angry: 'angry', dangle: 'dangle', alert: 'idle', groom: 'groom', dizzy: 'dizzy' }[name]; if (l) loop(l); else killLoops(); }
  const say = (sel, ms = 1100) => { const el = $(sel); gsap.killTweensOf(el); gsap.timeline().fromTo(el, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.25 }).to(el, { opacity: 0, y: -8, duration: 0.4 }, `+=${ms / 1000}`); };
  const flash = () => gsap.timeline().to($('.kc-burst'), { opacity: 1, duration: 0.06 }).to($('.kc-burst'), { opacity: 0, duration: 0.3 }, '+=0.14');
  // os textos (prrr, ?, hss!) desviram junto, para nunca aparecerem espelhados
  function face(dir) { if (!dir || dir === facing) return; facing = dir; gsap.to(flip, { scaleX: dir, duration: 0.16, ease: 'power2.out' }); $$('.kc-tx').forEach((g) => { const b = g.getBBox(); const cx = b.x + b.width / 2; if (dir < 0) g.setAttribute('transform', `translate(${2 * cx} 0) scale(-1 1)`); else g.removeAttribute('transform'); }); }

  // piscar: escala vertical dos olhos em torno do próprio centro (sem "saltos")
  function blink() {
    if (!paused && !reduce && (pose === 'idle' || pose === 'curious' || pose === 'walk' || pose === 'happy')) {
      gsap.timeline().to(eyesG, { scaleY: 0.12, duration: 0.07, ease: 'power2.in' }).to(eyesG, { scaleY: 1, duration: 0.11, ease: 'power2.out' });
    }
    setTimeout(blink, 2200 + Math.random() * 3200);
  }

  // olhar o cursor (cabeça e pupilas, suave)
  const lookTo = gsap.quickTo(look, 'rotation', { duration: 0.45, ease: 'power3.out' });
  const pupX = pupils.map((p) => gsap.quickTo(p, 'x', { duration: 0.35, ease: 'power3.out' }));
  const pupY = pupils.map((p) => gsap.quickTo(p, 'y', { duration: 0.35, ease: 'power3.out' }));
  let mouse = { x: -1, y: -1, t: 0 };
  function gaze() {
    if (paused || reduce || mouse.t === 0 || pose === 'sleep' || pose === 'rub') return;
    const r = wrap.getBoundingClientRect();
    const cx = r.left + r.width * 0.64, cy = r.top + r.height * 0.4;
    const dx = (mouse.x - cx) * facing, dy = mouse.y - cy;
    lookTo(Math.max(-16, Math.min(16, (dy / 240) * 16 * (dx >= 0 ? 1 : -1))));
    const nx = Math.max(-1.5, Math.min(1.5, dx / 220)), ny = Math.max(-1.3, Math.min(1.3, dy / 220));
    pupX.forEach((f) => f(nx)); pupY.forEach((f) => f(ny));
  }

  // a auréola sobe e desce devagar
  const haloT = reduce ? null : gsap.to($('.kc-halo'), { y: -2.5, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  // contador de carinhos no rodapé, salvo no navegador do visitante
  function countPets(add) {
    let el = document.querySelector('.kc-count');
    if (!el) { const w = document.querySelector('.footer .wrap'); if (!w) return; el = document.createElement('p'); el.className = 'kc-count'; w.insertBefore(el, w.children[1] || null); }
    let n = 0;
    try { n = +localStorage.getItem('kc-pets') || 0; if (add) { n += 1; localStorage.setItem('kc-pets', String(n)); } } catch {}
    el.textContent = isEn ? `Banguela got ${n} ${n === 1 ? 'pet' : 'pets'}` : `Banguela recebeu ${n} ${n === 1 ? 'carinho' : 'carinhos'}`;
  }
  countPets(false);

  // ---------- celular: gato no menu, simplificado e por toque ----------
  if (mobile) {
    act('idle', 0); setTimeout(blink, 1800);
    let tapT = 0;
    const bounce = () => { act('jump', 0.14); flash(); gsap.fromTo(flip, { y: 0 }, { y: -10, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out', onComplete: () => act('idle') }); };
    const pounceHere = () => { act('crouch', 0.15); setTimeout(() => { act('pounce', 0.12); gsap.fromTo(flip, { x: 0, y: 0 }, { x: 10 * facing, y: -12, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out', onComplete: () => act('happy') }); setTimeout(() => act('idle'), 1300); }, 650); };
    wrap.addEventListener('click', () => { if (paused || reduce) return; const now = Date.now(); if (now - tapT < 320) pounceHere(); else { bounce(); say('.kc-name', 1200); } tapT = now; });
    // carinho no celular: segurar o dedo no gato por 1 s
    let holdT = 0;
    wrap.addEventListener('touchstart', () => { if (paused || reduce) return; holdT = setTimeout(() => { countPets(true); act('pet', 0.3); say('.kc-say', 1600); setTimeout(() => { act('happy', 0.3); setTimeout(() => act('idle', 0.3), 700); }, 2600); }, 1000); }, { passive: true });
    ['touchend', 'touchmove', 'touchcancel'].forEach((ev) => wrap.addEventListener(ev, () => clearTimeout(holdT), { passive: true }));
    wrap.addEventListener('contextmenu', (e) => e.preventDefault());
    const fidget = () => {
      setTimeout(fidget, 2600 + Math.random() * 3000);
      if (paused || reduce || pose !== 'idle') return;
      const r = Math.random();
      if (r < 0.35) { face(-facing); }
      else if (r < 0.6) { act('curious', 0.3); setTimeout(() => act('idle'), 1400); }
      else if (r < 0.8) { bounce(); }
      else if (r < 0.9) { act('happy', 0.3); say('.kc-say', 700); setTimeout(() => act('idle'), 1300); }
      else { say('.kc-sneeze', 700); bounce(); }
    };
    setTimeout(fidget, 3000);
    const chairNav = document.createElement('span');
    chairNav.className = 'kc-chair-nav'; chairNav.innerHTML = CHAIR;
    wrap.prepend(chairNav);
    const sleepNav = () => { chairNav.classList.add('is-on'); gsap.to(flip, { y: -9, x: 6, duration: 0.4, ease: 'power2.out' }); act('sleep', 0.8); };
    const wakeNav = () => { act('stretch', 0.5); setTimeout(() => { act('idle'); chairNav.classList.remove('is-on'); gsap.to(flip, { y: 0, x: 0, duration: 0.35, ease: 'power2.out' }); }, 1200); };
    let idleT = 0; const wakeup = () => { clearTimeout(idleT); if (pose === 'sleep') wakeNav(); idleT = setTimeout(() => { if (!paused) sleepNav(); }, 45000); };
    addEventListener('scroll', wakeup, { passive: true }); addEventListener('touchstart', wakeup, { passive: true }); wakeup();
    document.addEventListener('click', (e) => {
      if (paused || reduce) return;
      if (e.target.closest && e.target.closest('a[href^="mailto:"], a[download], [data-copy]')) { bounce(); say('.kc-miau', 800); }
    });
    setupPause(() => {}, () => {});
    window.__kc = { mobile: true, cmd: { can: () => !paused && !reduce, sleep: () => { clearTimeout(idleT); sleepNav(); }, luaOn: false } };
    return;
  }

  // ---------- desktop: o gato vive na página (coordenadas do documento) ----------
  const FLOOR = 6;
  const pos = { x: 0, y: 0, r: 0 };
  const vw = () => html.clientWidth;
  const floorY = () => (reduce ? 0 : scrollY) + innerHeight - FLOOR;
  const minX = () => W * MIDX + 10, maxX = () => vw() - W * (1 - MIDX) - 10;
  const clampX = (x) => Math.max(minX(), Math.min(maxX(), x));
  const rand = (a, b) => a + Math.random() * (b - a);
  function render() {
    if (mode !== 'lost' && !(typeof ghost !== 'undefined' && ghost) && wrap.style.opacity !== '1') show(true);
    if (typeof carrying !== 'undefined' && carrying) placeFake();
    gsap.set(wrap, { x: pos.x - W * MIDX, y: pos.y - H * FOOT, rotation: pos.r, transformOrigin: `${(pos.ox ?? MIDX) * 100}% ${(pos.oy ?? FOOT) * 100}%` }); }

  let mode = 'free';          // free | busy | follow | lost | drag | laser
  let onText = null;          // linha de texto em que está, ou null (chão)
  let gen = 0;                // incrementa a cada interrupção
  const STOP = Symbol('stop');
  const guard = (my) => { if (my !== gen) throw STOP; };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  // esperas que também terminam quando o gato é interrompido (senão uma animação morta nunca resolve)
  const pending = new Set();
  const tw = (t) => new Promise((res) => { const done = () => { pending.delete(done); res(); }; pending.add(done); t.eventCallback('onComplete', done); });
  function interrupt() { cleanupExtras(); if (typeof hideBug === 'function') hideBug(); if (typeof ball !== 'undefined') { gsap.killTweensOf(ball); gsap.set(ball, { opacity: 0 }); } if (typeof carrying !== 'undefined' && carrying) { carrying = false; html.classList.remove('kc-steal'); gsap.to(fake, { opacity: 0, duration: 0.12 }); } if (typeof petting !== 'undefined') petting = false; gen++; gsap.killTweensOf(pos); gsap.killTweensOf(bpos); killLoops(); [...pending].forEach((f) => f()); }

  async function moveTo(my, tx, run = false) {
    tx = clampX(tx); const d = Math.abs(tx - pos.x); if (d < 6) return;
    if (onText) tx = Math.max(onText.x0, Math.min(onText.x1, tx));
    face(Math.sign(tx - pos.x)); act(run ? 'run' : 'walk', 0.2);
    await tw(gsap.to(pos, { x: tx, duration: Math.abs(tx - pos.x) / (run ? 430 : 160), ease: 'none' })); guard(my);
    act('idle', 0.25);
  }
  async function jumpTo(my, tx, ty, { h = 70, poseName = 'jump', prep = 0.14 } = {}) {
    tx = clampX(tx); face(Math.sign(tx - pos.x) || facing);
    act('crouch', 0.1); killLoops(); await wait(prep * 1000); guard(my);
    act(poseName, 0.14);
    const dur = Math.max(0.38, Math.min(0.85, 0.3 + Math.hypot(tx - pos.x, ty - pos.y) / 1100));
    const peak = Math.min(pos.y, ty) - h;
    const tl = gsap.timeline();
    tl.to(pos, { x: tx, duration: dur, ease: 'none' }, 0)
      .to(pos, { y: peak, duration: dur * 0.45, ease: 'power2.out' }, 0)
      .to(pos, { y: ty, duration: dur * 0.55, ease: 'power2.in' }, dur * 0.45);
    await tw(tl); guard(my);
    act('idle', 0.2);
    gsap.fromTo(body, { scaleY: 0.86 }, { scaleY: 1, duration: 0.25, ease: 'back.out(3)' });
  }

  // retângulos das linhas de um elemento, medidos pelos nós de texto e com o topo na altura das letras
  // distância do topo da caixa da linha até o topo das letras, medida com o canvas para cada fonte
  const capCache = new Map();
  const capCtx = document.createElement('canvas').getContext('2d');
  function capOffset(node, boxH) {
    const cs = getComputedStyle(node.parentElement);
    const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if (!capCache.has(font)) {
      capCtx.font = font;
      // altura das minúsculas (x-height): o gato pisa no topo de "esenvolve", e as hastes de "l" e "d" ficam por trás dele
      const m = capCtx.measureText('xenvo');
      capCache.set(font, { asc: m.fontBoundingBoxAscent, desc: m.fontBoundingBoxDescent, cap: m.actualBoundingBoxAscent });
    }
    const f = capCache.get(font);
    const content = f.asc + f.desc;
    // a caixa da linha pode ser maior que a área da fonte: centraliza a diferença
    return (boxH - content) / 2 + (f.asc - f.cap);
  }
  function lineRects(el) {
    const out = [];
    const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT) });
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      const rg = document.createRange(); rg.selectNodeContents(n);
      for (const rc of rg.getClientRects()) if (rc.width > 4 && rc.height > 6) out.push({ top: rc.top + capOffset(n, rc.height), left: rc.left, right: rc.right, width: rc.width });
    }
    // junta pedaços da mesma linha (palavras separadas em spans)
    out.sort((a, b) => a.top - b.top || a.left - b.left);
    const merged = [];
    for (const r of out) {
      const m = merged.find((x) => Math.abs(x.top - r.top) < 6);
      if (m) { m.left = Math.min(m.left, r.left); m.right = Math.max(m.right, r.right); m.width = m.right - m.left; } else merged.push({ ...r });
    }
    return merged;
  }
  // linhas de texto visíveis onde o gato pode subir
  function textLines() {
    const out = []; const top = scrollY + H + 30, bottom = scrollY + innerHeight - 60;
    document.querySelectorAll('main h1, main h2, main .display, main .lead, main .h3, main .project__what').forEach((el) => {
      for (const rc of lineRects(el)) {
        if (rc.width < W * 1.1) continue;
        const y = rc.top + scrollY + 5;
        if (y < top || y > bottom) continue;
        out.push({ x0: rc.left + W * 0.35, x1: rc.right - W * 0.35, y, el });
      }
    });
    return out.filter((s) => s.x1 > s.x0);
  }
  // botões e links embaixo do gato (ele pode cobrir letras, mas não fica parado em cima de botões)
  function onButton() {
    const r = wrap.getBoundingClientRect();
    for (const fx of [0.35, 0.55, 0.75]) for (const fy of [0.45, 0.8]) {
      for (const el of document.elementsFromPoint(r.left + r.width * fx, r.top + r.height * fy)) {
        if (layer.contains(el)) continue;
        if (el.closest('a, button, input')) return true;
      }
    }
    return false;
  }

  // ---------- ações ----------
  async function doWander(my) {
    await moveTo(my, pos.x + (Math.random() < 0.5 ? -1 : 1) * rand(120, 420), Math.random() < 0.35);
    act(Math.random() < 0.5 ? 'curious' : 'idle', 0.3); await wait(rand(700, 1600)); guard(my);
  }
  async function doZoomies(my) {
    for (let i = 0, n = 2 + Math.floor(Math.random() * 3); i < n; i++) {
      await moveTo(my, rand(minX(), maxX()), true);
      if (Math.random() < 0.5) { await jumpTo(my, pos.x + facing * 60, pos.y, { h: 34, prep: 0.06 }); }
    }
    act('happy', 0.3); await wait(800); guard(my);
  }
  async function doLookAround(my) {
    act('curious', 0.3); await wait(600); guard(my);
    face(-facing); await wait(700); guard(my);
    face(-facing); act('idle', 0.3); await wait(rand(500, 1200)); guard(my);
  }
  async function doLetters(my) {
    const lines = textLines(); if (!lines.length) return doWander(my);
    const s = lines[Math.floor(Math.random() * lines.length)];
    const near = Math.max(s.x0, Math.min(s.x1, pos.x));
    await moveTo(my, near - facing * 30, true);
    await jumpTo(my, near, s.y, { h: 90 }); onText = s;
    await moveTo(my, rand(s.x0, s.x1));
    act('rub', 0.3); say('.kc-say', 1600); await wait(2200); guard(my);
    act('happy', 0.25); await wait(600); guard(my);
    if (Math.random() < 0.5) { await moveTo(my, rand(s.x0, s.x1)); act('curious', 0.3); await wait(900); guard(my); }
    const down = clampX(pos.x + facing * rand(40, 140));
    onText = null;
    await jumpTo(my, down, floorY(), { h: 40 });
  }
  const ball = document.createElement('div');
  ball.className = 'kc-ball';
  ball.innerHTML = '<svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="14" r="12" fill="#f5b454"/><path d="M4 10c6 4 14 4 20 0M5 19c6-3 12-3 18 1" fill="none" stroke="#08090a" stroke-width="2" stroke-linecap="round" opacity=".55"/></svg>';
  layer.append(ball);
  // o bug: um insetinho próprio que atravessa a página
  const bug = document.createElement('div');
  bug.className = 'kc-bug';
  bug.innerHTML = '<svg viewBox="0 0 30 24" aria-hidden="true"><g class="kc-bug-legs" stroke="#e8eaed" stroke-width="1.5" stroke-linecap="round" opacity=".85"><path d="M10 10 4 6M10 13H3M10 16l-6 4M20 10l6-4M20 13h7M20 16l6 4"/></g><ellipse cx="15" cy="14" rx="7" ry="8" fill="#4ade80"/><path d="M15 6v16" stroke="#052e16" stroke-width="1.4"/><circle cx="12" cy="12" r="1.3" fill="#052e16"/><circle cx="18" cy="17" r="1.3" fill="#052e16"/><circle cx="15" cy="5.5" r="3.4" fill="#16181b" stroke="#4ade80" stroke-width="1.2"/><path d="M13.6 2.6 11 -.6M16.4 2.6 19 -.6" stroke="#e8eaed" stroke-width="1.2" stroke-linecap="round"/></svg>';
  layer.append(bug);
  const gpos = { x: -100, y: 0, r: 90 };
  const renderBug = () => gsap.set(bug, { x: gpos.x - 15, y: gpos.y - 24, rotation: gpos.r });
  const hideBug = () => { gsap.killTweensOf(gpos); gsap.killTweensOf(bug); gsap.set(bug, { opacity: 0, scale: 1 }); };
  async function doBugHunt(my) {
    if (onText) return doWander(my);
    const fromLeft = Math.random() < 0.5;
    gpos.y = floorY(); gpos.x = fromLeft ? -20 : vw() + 20; gpos.r = fromLeft ? 90 : -90; renderBug();
    gsap.set(bug, { opacity: 1, scale: 1 });
    const stopX = clampX(rand(vw() * 0.22, vw() * 0.78));
    const crawl = gsap.to(gpos, { x: stopX, duration: Math.abs(stopX - gpos.x) / 170, ease: 'none', onUpdate: renderBug });
    await wait(450); guard(my);
    face(Math.sign(gpos.x - pos.x) || facing); act('alert', 0.2);
    await tw(crawl); guard(my);
    act('crouch', 0.2); await wait(650); guard(my);
    // espreita devagar enquanto o bug se mexe um pouco
    for (let i = 0; i < 4 && Math.abs(gpos.x - pos.x) > 130; i++) {
      const side = Math.sign(gpos.x - pos.x) || 1;
      face(side); act('walk', 0.15); loops.forEach((l) => l.timeScale(0.45));
      const step = gpos.x - side * 120;
      await tw(gsap.to(pos, { x: clampX(step), duration: Math.min(1.6, Math.abs(step - pos.x) / 75), ease: 'none' })); guard(my);
      act('crouch', 0.12);
      const nx = clampX(gpos.x + rand(-70, 70));
      gpos.r = nx > gpos.x ? 90 : -90;
      await tw(gsap.to(gpos, { x: nx, duration: 0.55, ease: 'power1.inOut', onUpdate: renderBug })); guard(my);
    }
    face(Math.sign(gpos.x - pos.x) || facing);
    act('crouch', 0.12); await wait(rand(450, 850)); guard(my);
    const escapes = Math.random() < 0.3;
    const target = gpos.x;
    if (escapes) {
      gsap.to(gpos, { y: gpos.y - 420, x: gpos.x + rand(-160, 160), r: gpos.r + 360, duration: 0.9, ease: 'power2.in', onUpdate: renderBug });
      gsap.to(bug, { opacity: 0, delay: 0.6, duration: 0.3 });
    }
    await jumpTo(my, target, floorY(), { h: 60, poseName: 'pounce', prep: 0.05 });
    if (!escapes) {
      gsap.to(bug, { opacity: 0, scale: 0.3, duration: 0.15 });
      flash(); act('happy', 0.2); say('.kc-fixed', 1300); await wait(1600); guard(my);
    } else {
      act('curious', 0.2); say('.kc-q', 1000); await wait(1000); guard(my);
      face(-facing); await wait(500); guard(my); face(-facing);
    }
    hideBug();
    act('idle', 0.3);
  }
  const B_R = 15; const bpos = { x: -100, y: 0, r: 0 };
  const renderBall = () => gsap.set(ball, { x: bpos.x - B_R, y: bpos.y - B_R * 2, rotation: bpos.r });
  function rollBall(to, dur) { const d = to - bpos.x; return tw(gsap.to(bpos, { x: to, r: bpos.r + (d / B_R) * 57.3, duration: dur, ease: 'power2.out', onUpdate: renderBall })); }
  async function doBall(my) {
    if (onText) return doWander(my);
    const fromLeft = Math.random() < 0.5;
    bpos.y = floorY(); bpos.x = fromLeft ? -30 : vw() + 30; renderBall(); gsap.set(ball, { opacity: 1 });
    act('curious', 0.25);
    face(fromLeft ? -1 : 1);
    await rollBall(clampX(pos.x + (fromLeft ? -1 : 1) * rand(160, 300)), 1.1); guard(my);
    act('crouch', 0.2); await wait(500); guard(my);
    for (let i = 0, n = 3 + Math.floor(Math.random() * 3); i < n; i++) {
      const side = Math.sign(bpos.x - pos.x) || 1;
      await moveTo(my, bpos.x - side * W * 0.42, true);
      face(side);
      act('crouch', 0.12); await wait(rand(250, 550)); guard(my);
      // patada
      act('idle', 0.1); gsap.timeline().to(legs[2], { rotation: -75, duration: 0.09 }).to(legs[2], { rotation: 0, duration: 0.18 });
      await wait(110); guard(my);
      const last = i === n - 1;
      const dir = Math.random() < 0.7 ? side : -side;
      const target = last ? (dir > 0 ? vw() + 60 : -60) : clampX(bpos.x + dir * rand(140, 340));
      bpos.y = floorY();
      const rolling = rollBall(target, last ? 1.3 : rand(0.7, 1.0));
      await wait(150); guard(my);
      if (last) {
        await moveTo(my, dir > 0 ? maxX() - 20 : minX() + 20, true);
        await rolling; guard(my);
        act('curious', 0.3); say('.kc-q', 1100); await wait(900); guard(my);
        face(-facing); await wait(800); guard(my); face(-facing); await wait(600); guard(my);
      } else {
        await rolling; guard(my);
      }
    }
    gsap.set(ball, { opacity: 0 });
    act('idle', 0.3);
  }
  async function doCursorPlay(my) {
    const tx = mouse.x + scrollX, ty = mouse.y + scrollY;
    if (Math.abs(ty - pos.y) > 260) return doWander(my);
    await moveTo(my, tx - Math.sign(tx - pos.x || 1) * W * 0.5, true);
    face(Math.sign(tx - pos.x) || facing);
    act('crouch', 0.15); await wait(700); guard(my);
    act('idle', 0.1);
    for (let k = 0; k < 2; k++) { gsap.timeline().to(legs[2], { rotation: -80, duration: 0.09 }).to(legs[2], { rotation: 0, duration: 0.16 }); await wait(320); guard(my); }
    act('happy', 0.25); await wait(700); guard(my);
  }
  let lastAct = Date.now();
  // só dorme na cadeira gamer: ela aparece no chão, ele sobe e se enrola no assento
  let chairEl = null;
  function makeChair(x) {
    const el = document.createElement('div'); el.className = 'kc-chair'; el.innerHTML = CHAIR;
    layer.insertBefore(el, wrap);
    gsap.set(el, { x: x - 71, y: floorY() - 172 });
    gsap.fromTo(el, { scale: 0.6, opacity: 0, transformOrigin: '50% 100%' }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' });
    chairEl = el;
  }
  function removeChair(now) {
    if (typeof chairEl === 'undefined' || !chairEl) return;
    const c = chairEl; chairEl = null;
    if (now) { c.remove(); return; }
    gsap.to(c, { opacity: 0, duration: 0.5, onComplete: () => c.remove() });
  }
  async function doSleep(my, forced) {
    onText = null;
    if (pos.y < floorY() - 4) await jumpTo(my, pos.x, floorY(), { h: 20 });
    const dir = pos.x < vw() / 2 ? 1 : -1;
    const cx = clampX(pos.x + dir * rand(150, 240));
    makeChair(cx);
    face(dir); act('yawn', 0.3); await wait(900); guard(my);
    await moveTo(my, cx - dir * 120, false);
    const seat = floorY() - 74;
    await jumpTo(my, cx, seat, { h: 40 });
    onText = { x0: cx, x1: cx, y: seat };
    face(1);
    const minUntil = forced ? Date.now() + 4000 : 0;
    if (forced || Date.now() - lastAct > 2000) {
      act('sleep', 0.8);
      const slept = Date.now();
      while (Date.now() < minUntil || (forced ? lastAct < slept : Date.now() - lastAct > 2000)) { await wait(400); guard(my); }
      act('stretch', 0.5); await wait(1300); guard(my);
    }
    act('idle', 0.4); await wait(300); guard(my);
    onText = null;
    await jumpTo(my, clampX(cx + dir * 120), floorY(), { h: 30 });
    removeChair(false);
  }
  async function tired(my) {
    act('tired', 0.3); await wait(3000); guard(my);
    act('idle', 0.4); await wait(300); guard(my);
  }

  // em cima de algo onde foi colocado: fica lá, passeia, olha em volta, esfrega a cabeça nas letras
  async function doPerch(my) {
    const s = onText, r = Math.random();
    if (r < 0.3) await doLookAround(my);
    else if (r < 0.6 && s.x1 - s.x0 > 20) { await moveTo(my, rand(s.x0, s.x1)); act('idle', 0.3); await wait(rand(600, 1400)); guard(my); }
    else if (r < 0.8 && s.text) { act('rub', 0.3); say('.kc-say', 1400); await wait(1900); guard(my); act('happy', 0.25); await wait(500); guard(my); }
    else { act(Math.random() < 0.5 ? 'idle' : 'happy', 0.3); await wait(rand(1500, 3000)); guard(my); }
  }

  // cérebro: escolhe a próxima brincadeira sem parar
  async function brain() {
    for (;;) {
      const my = gen;
      try {
        if (paused || mode !== 'free') { await wait(300); continue; }
        if (Date.now() - lastAct > SLEEP_AFTER) { await doSleep(my); continue; }
        if (pendingShow) { const id = pendingShow; pendingShow = null; await doShowProject(my, id); continue; }
        if (onText && onText.perch) { await doPerch(my); continue; }
        if (onButton()) { await moveTo(my, pos.x + facing * W, false); continue; }
        const cursorIdle = mouse.t ? Date.now() - mouse.t : 0;
        if (cursorIdle > 12000 && Date.now() - lastHide > 30000 && Math.random() < 0.5) { lastHide = Date.now(); await doHide(my); continue; }
        const r = Math.random();
        const z = morning ? 0.1 : 0; // de manhã: mais zoomies
        const cursorNear = mouse.t && Date.now() - mouse.t < 2500;
        if (cursorNear && r < 0.14) await doCursorPlay(my);
        else if (r < 0.26) await doBall(my);
        else if (r < 0.37) await doBugHunt(my);
        else if (r < 0.5) await doLetters(my);
        else if (r < 0.58) await (diveFn && visibleIn(diveFn.el.getBoundingClientRect()) && Math.random() < 0.35 ? diveFn(my) : doTerminal(my));
        else if (r < 0.64) await doKnock(my);
        else if (r < 0.69) await (Date.now() - lastLua > 50000 && Math.random() < 0.6 ? doLuaVisit(my) : doBox(my));
        else if (r < 0.76 + z) await doZoomies(my);
        else if (r < 0.83 + z) await (night && Math.random() < 0.5 ? doYawn(my) : doGroom(my));
        else if (r < 0.86 + z) await doSneeze(my);
        else if (r < 0.94) await doWander(my);
        else await doLookAround(my);
      } catch (e) { if (e !== STOP) console.error(e); }
      await wait(rand(150, 600));
    }
  }

  // ---------- rolagem: desce/sobe junto com a tela; some se a rolagem for rápida demais ----------
  let lastScroll = 0;
  // perseguição com mola: vy segue a tela com aceleração e freio; vx faz o gato correr de verdade (na diagonal)
  let vy = 0, vx = 0;
  const K = 32, C = 2 * Math.sqrt(K) * 0.92, VMAX = 1700;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  // velocidade da rolagem (px/s, negativa quando sobe), suavizada
  let sv = 0, lastSY = scrollY, lostSide = 'top';
  const FAST_UP = -1800;
  gsap.ticker.add((t, dt) => {
    if (reduce) return;
    const sec = Math.max(dt / 1000, 0.001);
    sv = sv * 0.7 + ((scrollY - lastSY) / sec) * 0.3; lastSY = scrollY;
    if (Date.now() - lastScroll > 120) sv *= 0.5;
    if (mode === 'laser' && !paused && !laser.jumping) {
      const s = Math.min(dt / 1000, 0.05);
      const tx = laser.x + scrollX, dx = tx - pos.x, dist = Math.abs(dx);
      pos.y = floorY(); pos.r = 0;
      if (dist > 70) {
        const speed = Math.min(600, 170 + dist * 1.7);
        pos.x = clampX(pos.x + Math.sign(dx) * Math.min(dist, speed * s));
        face(Math.sign(dx));
        if (pose !== 'run') act('run', 0.12);
        loops.forEach((l) => l.timeScale(Math.max(0.6, Math.min(1.8, speed / 330))));
      } else {
        if (pose !== 'crouch') act('crouch', 0.12);
        if (Date.now() - laser.lastMove > 380) pounceLaser();
      }
    }
    if (mode !== 'lost' && !paused) {
      const floor = floorY(), top = scrollY;
      const off = onText ? (pos.y < top + H * 0.9 || pos.y > floor) : Math.abs(pos.y - floor) > 4;
      if (mode !== 'follow' && (mode === 'free' || mode === 'busy') && off && Date.now() - lastScroll < 400) {
        interrupt(); mode = 'follow'; onText = null; gsap.set(ball, { opacity: 0 });
        vy = 0; vx = 0;
        act('run', 0.15);
      }
      if (mode === 'follow') {
        const s = Math.min(dt / 1000, 0.05);
        const diff = floor - pos.y;
        // subindo (rolagem para cima) a mola é mais firme e o gato nunca passa de 1/3 abaixo da borda
        const k = diff < 0 ? 95 : K, c = 2 * Math.sqrt(k) * 0.92;
        vy = cl(vy + (k * diff - c * vy) * s, -VMAX, VMAX);
        pos.y += vy * s;
        // subida normal: nunca passa de 1/3 abaixo da borda; subida muito rápida: fica para trás e some por baixo
        if (sv > FAST_UP && pos.y > floor + H * 0.33) { pos.y = floor + H * 0.33; if (vy > 0) vy = 0; }
        const speed = Math.abs(vy);
        // corre na horizontal enquanto persegue a tela, e vira na borda
        const vxT = speed > 25 ? cl(110 + speed * 0.32, 110, 440) : 0;
        vx += (vxT - vx) * Math.min(1, s * 5);
        pos.x += facing * vx * s;
        if (pos.x <= minX()) { pos.x = minX(); face(1); } else if (pos.x >= maxX()) { pos.x = maxX(); face(-1); }
        // inclinação suave: cabeça para baixo ao descer, para cima ao subir
        const rT = cl(vy * 0.016, -24, 24) * facing;
        pos.r += (rT - pos.r) * Math.min(1, s * 9);
        // patas no ritmo da velocidade real
        const ts = cl((vx + speed * 0.25) / 300, 0.3, 1.8);
        loops.forEach((l) => l.timeScale(ts));
        if (pos.y < scrollY - 6 || pos.y - H > scrollY + innerHeight) { lostSide = pos.y < scrollY ? 'top' : 'bottom'; mode = 'lost'; vy = 0; vx = 0; pos.r = 0; show(false); killLoops(); }
        else if (Math.abs(diff) < 2 && Math.abs(vy) < 22 && Date.now() - lastScroll > 160) {
          pos.y = floor; vy = 0; vx = 0; mode = 'free';
          gsap.to(pos, { r: 0, duration: 0.25, ease: 'power2.out' });
          act('idle', 0.3);
          gsap.fromTo(body, { scaleY: 0.88 }, { scaleY: 1, duration: 0.3, ease: 'back.out(2.5)' });
        }
      }
    } else if (mode === 'lost' && Date.now() - lastScroll > 380 && !paused) {
      respawn();
    }
    render();
  });
  async function respawn() {
    mode = 'busy'; const my = ++gen;
    const fromBottom = lostSide === 'bottom';
    pos.x = clampX(rand(vw() * 0.2, vw() * 0.85)); pos.r = 0;
    // sumiu por cima: cai do topo; sumiu por baixo: volta pulando de baixo para dentro da tela
    pos.y = fromBottom ? floorY() + H + 12 : scrollY - 10; render();
    show(true);
    act('jump', 0);
    try {
      if (fromBottom) {
        face(pos.x < vw() / 2 ? 1 : -1);
        const peak = floorY() - 70;
        const tl = gsap.timeline();
        tl.to(pos, { y: peak, duration: 0.32, ease: 'power2.out' }).to(pos, { y: floorY(), duration: 0.26, ease: 'power2.in' })
          .to(pos, { x: clampX(pos.x + facing * 60), duration: 0.58, ease: 'none' }, 0);
        await tw(tl); guard(my);
      } else {
        await tw(gsap.to(pos, { y: floorY(), duration: 0.5, ease: 'power2.in' })); guard(my);
      }
      gsap.fromTo(body, { scaleY: 0.8 }, { scaleY: 1, duration: 0.3, ease: 'back.out(3)' });
      await tired(my);
    } catch (e) { if (e !== STOP) console.error(e); }
    if (my === gen) mode = 'free';
  }

  // ---------- mouse ----------
  // ---------- cursor "roubado": um cursor desenhado na boca do gato ----------
  const fake = document.createElement('div');
  fake.className = 'kc-cursor';
  fake.innerHTML = '<svg viewBox="0 0 20 26" aria-hidden="true"><path d="M2 2v18l5-5 3.6 8 3.2-1.4L10.2 13.8H17z" fill="#f4f5f7" stroke="#08090a" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  layer.append(fake);
  const nose = $('.kc-nose');
  let carrying = false, carryStart = 0, carryMoved = 0, stealT = 0;
  const steal = (v) => {
    html.classList.toggle('kc-steal', v);
    clearTimeout(stealT);
    if (v) stealT = setTimeout(() => steal(false), 4000); // trava: o cursor real sempre volta
  };
  addEventListener('blur', () => { if (carrying) escape(false); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && carrying) escape(false); });
  function placeFake() {
    const r = nose.getBoundingClientRect();
    gsap.set(fake, { x: r.left + r.width / 2 + scrollX - 4 + facing * 6, y: r.bottom + scrollY + 2, rotation: facing > 0 ? -38 : 38 });
  }
  function escape(angry = true) {
    carrying = false; steal(false);
    gsap.to(fake, { opacity: 0, scale: 0.6, duration: 0.14 });
    if (!angry) return;
    interrupt(); mode = 'busy'; const my = gen;
    (async () => {
      try {
        face(Math.sign(mouse.x + scrollX - pos.x) || facing);
        act('angry', 0.12); say('.kc-hss', 900); flash();
        await wait(1500); guard(my);
        act('idle', 0.4); await wait(400); guard(my);
      } catch (e) { if (e !== STOP) console.error(e); }
      if (my === gen) mode = 'free';
    })();
  }
  async function carry(my) {
    carrying = true; carryStart = Date.now(); carryMoved = 0;
    steal(true); placeFake(); gsap.fromTo(fake, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.15 });
    say('.kc-say', 500);
    if (pos.y < floorY() - 4) await jumpTo(my, pos.x + facing * 30, floorY(), { h: 12, prep: 0 });
    const dir = pos.x < vw() / 2 ? 1 : -1;
    const dur = rand(1.3, 1.9);
    face(dir); act('run', 0.12);
    await tw(gsap.to(pos, { x: clampX(pos.x + dir * 430 * dur), duration: dur, ease: 'power1.inOut' })); guard(my);
    // solta o cursor: ele cai no chão e some, e o cursor real volta
    carrying = false;
    act('happy', 0.25); say('.kc-say', 700);
    const fy = gsap.getProperty(fake, 'y');
    gsap.timeline()
      .to(fake, { y: floorY() - 24, rotation: facing > 0 ? -100 : 100, duration: 0.35, ease: 'bounce.out' })
      .to(fake, { opacity: 0, duration: 0.3 }, '+=0.5')
      .add(() => steal(false), 0.15);
    await wait(900); guard(my);
  }

  // ---------- carinho: cursor parado 1 s em cima do gato ----------
  let overT = 0, petting = false;
  const overCat = () => { const el = mouse.t && document.elementFromPoint(mouse.x, mouse.y); return !!(el && el.closest && el.closest('.kc-wrap')); };
  function startPet() {
    if (petting || paused || reduce || carrying || drag || Date.now() < petCooldown || mode === 'lost' || mode === 'follow' || mode === 'drag' || mode === 'laser' || !overCat()) return;
    interrupt(); mode = 'busy'; petting = true; countPets(true);
    face(Math.sign(mouse.x + scrollX - pos.x) || facing);
    act('pet', 0.3); say('.kc-say', 1100);
    const t0 = Date.now(), purrTxt = $('.kc-say');
    // o "prrr" fica maior e mais frequente, e o corpo vibra cada vez mais
    const purr = () => {
      if (!petting) return;
      const level = Math.min(5, Math.floor((Date.now() - t0) / 1000));
      if (Date.now() - t0 > 6000) { bite(); return; }
      gsap.set(purrTxt, { scale: 1 + level * 0.14, transformOrigin: '50% 50%' });
      say('.kc-say', 800);
      if (level >= 2) loops.push(gsap.to(body, { x: Math.min(2.4, level * 0.45), duration: 0.045, yoyo: true, repeat: 7, ease: 'none' }));
      setTimeout(purr, Math.max(650, 1600 - level * 220));
    };
    setTimeout(purr, 1100);
  }
  // carinho demais: mordidinha e fuga
  async function bite() {
    petting = false; petCooldown = Date.now() + 8000;
    gsap.set($('.kc-say'), { scale: 1 });
    const my = ++gen; killLoops();
    try {
      face(Math.sign(mouse.x + scrollX - pos.x) || facing);
      act('angry', 0.1); say('.kc-nhac', 800);
      gsap.timeline().to(head, { x: 12, duration: 0.08 }).to(head, { x: 0, duration: 0.15 });
      await wait(450); guard(my);
      onText = null;
      await moveTo(my, pos.x < vw() / 2 ? maxX() - 40 : minX() + 40, true);
      act('happy', 0.3); await wait(600); guard(my); act('idle', 0.3);
    } catch (err) { if (err !== STOP) console.error(err); }
    if (my === gen) mode = 'free';
  }
  function endPet() {
    if (!petting) return;
    petting = false;
    gsap.set($('.kc-say'), { scale: 1 });
    const my = ++gen;
    act('happy', 0.3);
    setTimeout(() => { if (my === gen) { act('idle', 0.3); mode = 'free'; } }, 700);
  }

  addEventListener('pointermove', (e) => {
    const dx = e.clientX - mouse.x, dy = e.clientY - mouse.y;
    mouse = { x: e.clientX, y: e.clientY, t: Date.now() }; lastAct = Date.now(); gaze();
    // mexeu o mouse enquanto o gato carrega o cursor: escapa e o gato fica bravo
    if (carrying && Date.now() - carryStart > 220) { carryMoved += Math.hypot(dx, dy); if (carryMoved > 14) escape(true); }
    // carinho
    if (drag && drag.started) return;
    const over = !!(e.target && e.target.closest && e.target.closest('.kc-wrap'));
    if (over) { if (!overT && !petting) overT = setTimeout(() => { overT = 0; startPet(); }, 1000); }
    else { clearTimeout(overT); overT = 0; if (petting) endPet(); }
  }, { passive: true });
  addEventListener('scroll', () => { lastScroll = Date.now(); lastAct = Date.now(); }, { passive: true });
  addEventListener('keydown', () => { lastAct = Date.now(); });
  // ---------- laser: segurar o botão direito ----------
  const dot = document.createElement('div');
  dot.className = 'kc-laser';
  layer.append(dot);
  const laser = { on: false, x: 0, y: 0, holdT: 0, used: false, jumping: false, lastMove: 0 };
  const placeDot = (x, y) => { laser.x = x; laser.y = y; gsap.set(dot, { x: x + scrollX - 6, y: y + scrollY - 6 }); };
  function startLaser(x, y) {
    if (paused || reduce || mode === 'drag' || mode === 'lost' || carrying) return;
    interrupt(); mode = 'laser'; laser.on = true; laser.used = true; laser.jumping = false; laser.lastMove = Date.now();
    html.classList.add('kc-steal'); clearTimeout(stealT);
    placeDot(x, y); gsap.set(dot, { opacity: 1 });
    if (onText) { onText = null; laser.jumping = true; const my = gen; jumpTo(my, pos.x + facing * 30, floorY(), { h: 20, prep: 0 }).catch(() => {}).finally(() => { laser.jumping = false; }); }
    face(Math.sign(x + scrollX - pos.x) || facing); act('alert', 0.12);
  }
  async function pounceLaser() {
    laser.jumping = true; const my = gen;
    try {
      const tx = laser.x + scrollX, ty = Math.min(laser.y + scrollY + H * 0.38, floorY());
      await jumpTo(my, tx, ty, { h: 50, poseName: 'pounce', prep: 0.05 });
      flash();
      if (pos.y < floorY() - 4) await jumpTo(my, pos.x + facing * 30, floorY(), { h: 12, prep: 0 });
    } catch (e) { if (e !== STOP) console.error(e); }
    laser.jumping = false; laser.lastMove = Date.now();
  }
  function stopLaser() {
    if (!laser.on) return;
    laser.on = false;
    html.classList.remove('kc-steal');
    gsap.to(dot, { opacity: 0, duration: 0.15 });
    interrupt(); mode = 'busy'; const my = gen;
    (async () => {
      try {
        if (pos.y < floorY() - 4) await jumpTo(my, pos.x, floorY(), { h: 10, prep: 0 });
        act('curious', 0.2); say('.kc-q', 900); await wait(700); guard(my);
        face(-facing); await wait(450); guard(my); face(-facing); act('idle', 0.3);
      } catch (e) { if (e !== STOP) console.error(e); }
      if (my === gen) mode = 'free';
    })();
  }
  addEventListener('pointerdown', (e) => {
    if (e.button !== 2 || paused || reduce || (e.target.closest && e.target.closest('input, textarea'))) return;
    clearTimeout(laser.holdT); laser.used = false;
    laser.holdT = setTimeout(() => startLaser(e.clientX, e.clientY), 220);
  });
  addEventListener('pointermove', (e) => { if (laser.on) { if (Math.hypot(e.clientX - laser.x, e.clientY - laser.y) > 2) laser.lastMove = Date.now(); placeDot(e.clientX, e.clientY); } }, { passive: true });
  addEventListener('scroll', () => { if (laser.on) placeDot(laser.x, laser.y); }, { passive: true });
  addEventListener('pointerup', (e) => { if (e.button !== 2) return; clearTimeout(laser.holdT); if (laser.on) stopLaser(); });
  // o menu do botão direito só some se o laser foi usado; um clique direito rápido continua normal
  addEventListener('contextmenu', (e) => { if (laser.on || laser.used) { e.preventDefault(); laser.used = false; if (laser.on) stopLaser(); } });
  addEventListener('blur', () => { clearTimeout(laser.holdT); if (laser.on) stopLaser(); });

  // ---------- botões de contato: atento no hover, comemora no clique ----------
  const CONTACT = 'a[href^="mailto:"], a[download], [data-copy]';
  let watching = null;
  document.addEventListener('pointerover', (e) => {
    const b = e.target.closest && e.target.closest(CONTACT);
    if (!b || b === watching || paused || reduce || mode !== 'free') return;
    watching = b;
    interrupt(); mode = 'busy'; const my = gen;
    (async () => {
      try {
        const r = b.getBoundingClientRect();
        face(Math.sign(r.left + r.width / 2 + scrollX - pos.x) || facing);
        act('alert', 0.2);
        const t0 = Date.now();
        while (watching === b && Date.now() - t0 < 4000) { await wait(150); guard(my); }
        act('idle', 0.3); await wait(200); guard(my);
      } catch (err) { if (err !== STOP) console.error(err); }
      if (my === gen) mode = 'free';
    })();
  });
  document.addEventListener('pointerout', (e) => { if (watching && !(e.relatedTarget && watching.contains(e.relatedTarget))) watching = null; });
  document.addEventListener('click', (e) => {
    if (!(e.target.closest && e.target.closest(CONTACT)) || paused || reduce || ['drag', 'laser', 'lost', 'follow'].includes(mode) || carrying) return;
    watching = null;
    interrupt(); mode = 'busy'; const my = gen;
    (async () => {
      try {
        flash(); say('.kc-miau', 900);
        await jumpTo(my, pos.x, pos.y, { h: 62, prep: 0.06 });
        await jumpTo(my, pos.x, pos.y, { h: 30, prep: 0.02 });
        act('happy', 0.2); await wait(700); guard(my);
      } catch (err) { if (err !== STOP) console.error(err); }
      if (my === gen) mode = 'free';
    })();
  });

  // =================== Banguela: interações extras ===================
  const hour = new Date().getHours();
  const night = hour >= 21 || hour < 6, morning = hour >= 6 && hour < 11;
  const SLEEP_AFTER = night ? 25000 : 45000;   // à noite ele dorme mais cedo
  let ghost = false, lastHide = Date.now(), pendingShow = null, petCooldown = 0, dizzyAt = 0;
  const shown = new Set(), typedLines = new Set();
  const visibleIn = (r, pad = 40) => r.width > 0 && r.top > H + pad && r.top < innerHeight - 60 && r.left > -10 && r.right < vw() + 10;
  const swipe = () => gsap.timeline().to(legs[2], { rotation: -65, duration: 0.09 }).to(legs[2], { rotation: 0, duration: 0.18 });
  function cleanupExtras() {
    if (typeof ghost === 'undefined') return;
    ghost = false;
    html.classList.remove('kc-hide');
    gsap.killTweensOf(flip); gsap.set(flip, { scaleX: facing, scaleY: 1, y: 0 });
    removeBox(true);
    removeChair(true);
    if (typeof hideDog === 'function') hideDog();
    typedLines.forEach((l) => l.remove()); typedLines.clear();
  }

  // ---- terminal: patadas no cursor que pisca, pisada no teclado ----
  async function doTerminal(my) {
    const terms = [...document.querySelectorAll('main .term')].filter((t) => visibleIn(t.getBoundingClientRect()));
    const typeLine = document.querySelector('.hero__type');
    const tr = typeLine && typeLine.getBoundingClientRect();
    const onCursor = tr && visibleIn(tr) && Math.random() < 0.4;
    if (!terms.length && !onCursor) return doWander(my);
    onText = null;
    if (onCursor) {
      const cur = typeLine.querySelector('.cursor').getBoundingClientRect();
      const line = lineRects(typeLine)[0];
      const top = (line ? line.top : tr.top) + scrollY + 5;
      await jumpTo(my, clampX(cur.right + scrollX + W * 0.42), top, { h: 70 });
      onText = { x0: pos.x, x1: pos.x, y: top };
      face(-1);
      for (let i = 0; i < 3; i++) { act('crouch', 0.1); await wait(rand(250, 480)); guard(my); act('idle', 0.08); swipe(); await wait(260); guard(my); }
      act('happy', 0.25); await wait(600); guard(my);
    } else {
      const t = terms[Math.floor(Math.random() * terms.length)], r = t.getBoundingClientRect();
      const y = r.top + scrollY, x0 = r.left + scrollX + W * 0.4, x1 = r.right + scrollX - W * 0.4;
      await jumpTo(my, clampX(rand(x0, Math.max(x0, x1))), y, { h: 80 });
      onText = { x0, x1: Math.max(x0, x1), y };
      for (let i = 0; i < 2; i++) { swipe(); await wait(320); guard(my); }
      if (Math.random() < 0.65) await stomp(my, t);
      act('happy', 0.25); await wait(500); guard(my);
    }
    onText = null;
    await jumpTo(my, clampX(pos.x + facing * rand(50, 140)), floorY(), { h: 40 });
  }
  async function stomp(my, term) {
    const tb = term.querySelector('.term__body'); if (!tb) return;
    const line = document.createElement('p'); line.className = 'kc-typed';
    line.innerHTML = '<span class="t-p">$</span> <span class="t-w"></span>';
    const out = line.querySelector('.t-w');
    act('crouch', 0.1); await wait(250); guard(my);
    gsap.fromTo($('.kc-all'), { y: 0 }, { y: -8, duration: 0.12, yoyo: true, repeat: 3 });
    tb.append(line); typedLines.add(line);
    try {
      for (const ch of 'asdfjkl;') { out.textContent += ch; await wait(70); guard(my); }
      act('oops', 0.2); say('.kc-oops', 900); await wait(700); guard(my);
      while (out.textContent) { out.textContent = out.textContent.slice(0, -1); await wait(45); guard(my); }
    } finally { line.remove(); typedLines.delete(line); }
  }

  // ---- projetos: aponta para a ilustração e deita no horário verde ----
  async function doShowProject(my, id) {
    const sec = document.getElementById(id); const art = sec && sec.querySelector('.project__art');
    if (!art) return;
    const ar = art.getBoundingClientRect(); if (!(ar.top > 0 && ar.bottom < innerHeight + 40)) return;
    onText = null;
    if (id === 'projetos') {
      const slot = art.querySelector('rect[fill="#4ade80"]');
      const sr = slot ? slot.getBoundingClientRect() : ar;
      const x = sr.left + sr.width / 2 + scrollX, y = sr.top + scrollY + 4;
      await moveTo(my, clampX(x - 170), true);
      await jumpTo(my, clampX(x), y, { h: 90 });
      onText = { x0: pos.x, x1: pos.x, y };
      act('loaf', 0.5); say('.kc-say', 1400); await wait(2600); guard(my);
    } else {
      const x = ar.left + scrollX + ar.width * 0.22, y = ar.top + scrollY;
      await moveTo(my, clampX(x - 170), true);
      await jumpTo(my, clampX(x), y, { h: 80 });
      onText = { x0: pos.x, x1: pos.x, y };
      face(1); act('point', 0.25); say('.kc-look', 1300); await wait(1900); guard(my);
      act('happy', 0.25); await wait(500); guard(my);
    }
    onText = null;
    await jumpTo(my, clampX(pos.x + facing * rand(60, 160)), floorY(), { h: 40 });
  }
  const showIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting && !shown.has(e.target.id)) { shown.add(e.target.id); pendingShow = e.target.id; }
  }), { threshold: 0.55 });
  ['projetos', 'acrilife'].forEach((id) => { const sct = document.getElementById(id); if (sct) showIO.observe(sct); });

  // ---- derrubar um chip de stack ----
  async function doKnock(my) {
    const chips = [...document.querySelectorAll('main .chips .chip')].filter((c) => visibleIn(c.getBoundingClientRect()));
    if (!chips.length) return doWander(my);
    const c = chips[Math.floor(Math.random() * chips.length)], r = c.getBoundingClientRect();
    const y = r.top + scrollY;
    onText = null;
    await jumpTo(my, clampX(r.left + scrollX - W * 0.15), y, { h: 80 });
    onText = { x0: pos.x, x1: pos.x, y };
    face(1); act('curious', 0.2); await wait(600); guard(my);
    act('idle', 0.08); swipe(); await wait(90); guard(my);
    gsap.timeline()
      .to(c, { x: 30, y: 150, rotation: 70, opacity: 0, duration: 0.6, ease: 'power2.in' })
      .set(c, { x: 0, y: -14, rotation: 0 }, '+=0.9')
      .to(c, { y: 0, opacity: 1, duration: 0.35, ease: 'back.out(2)' })
      .set(c, { clearProps: 'transform,opacity' });
    lookTo(0); await wait(1300); guard(my);   // olha para quem está vendo
    act('happy', 0.25); await wait(500); guard(my);
    onText = null;
    await jumpTo(my, clampX(pos.x - rand(60, 140)), floorY(), { h: 40 });
  }

  // ---- caixa de papelão ----
  let boxEls = null;
  function makeBox(x) {
    const back = document.createElement('div'); back.className = 'kc-box kc-box--back';
    back.innerHTML = '<svg viewBox="0 0 130 80" aria-hidden="true"><path d="M8 18 22 4h86l14 14z" fill="#1c1a17" stroke="rgba(245,180,84,.45)"/></svg>';
    const front = document.createElement('div'); front.className = 'kc-box kc-box--front';
    front.innerHTML = '<svg viewBox="0 0 130 80" aria-hidden="true"><path d="M2 18h126v58a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" fill="#2a2520" stroke="rgba(245,180,84,.55)" stroke-width="1.5"/><path d="M2 18-6 4M128 18l8-14" stroke="rgba(245,180,84,.55)" stroke-width="1.5"/><path d="M50 18v14h30V18" fill="none" stroke="#f5b454" stroke-opacity=".5" stroke-width="2"/></svg>';
    layer.insertBefore(back, wrap); layer.insertBefore(front, wrap.nextSibling);
    const fy = floorY();
    [back, front].forEach((el) => gsap.set(el, { x: x - 65, y: fy - 80 }));
    gsap.fromTo([back, front], { scale: 0.6, opacity: 0, transformOrigin: '50% 100%' }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2)' });
    boxEls = { back, front };
  }
  function removeBox(now) {
    if (typeof boxEls === 'undefined' || !boxEls) return;
    const b = boxEls; boxEls = null;
    if (now) { b.back.remove(); b.front.remove(); return; }
    gsap.to([b.back, b.front], { opacity: 0, duration: 0.4, onComplete: () => { b.back.remove(); b.front.remove(); } });
  }
  async function doBox(my) {
    if (onText) return doWander(my);
    const bx = clampX(rand(vw() * 0.15, vw() * 0.85));
    makeBox(bx);
    face(Math.sign(bx - pos.x) || facing); act('alert', 0.2); await wait(500); guard(my);
    await moveTo(my, bx - (Math.sign(bx - pos.x) || 1) * 110, true);
    await jumpTo(my, bx, floorY() - 29, { h: 70 });
    act('curious', 0.25);
    for (let i = 0; i < 3; i++) { await wait(rand(900, 1500)); guard(my); face(-facing); }
    say('.kc-say', 900); await wait(800); guard(my);
    await jumpTo(my, clampX(bx + facing * 120), floorY(), { h: 60 });
    removeBox(false);
  }

  // ---- lamber, bocejar, espirrar ----
  async function doGroom(my) { act('groom', 0.4); await wait(rand(2500, 4000)); guard(my); act('idle', 0.4); await wait(300); guard(my); }
  async function doYawn(my) { act('yawn', 0.35); await wait(1300); guard(my); act('idle', 0.4); await wait(400); guard(my); }
  async function doSneeze(my) {
    act('idle', 0.2); await wait(200); guard(my);
    await tw(gsap.to(head, { rotation: -18, y: -5, duration: 0.45, ease: 'power2.out' })); guard(my);
    gsap.to(head, { rotation: 16, y: 6, duration: 0.07, ease: 'power3.in' });
    say('.kc-sneeze', 800);
    await wait(140); guard(my);
    // susto com o próprio espirro: pulinho para trás sem virar
    act('jump', 0.1);
    const x0 = pos.x, y0 = pos.y;
    await tw(gsap.timeline().to(pos, { x: clampX(x0 - facing * 34), duration: 0.32, ease: 'none' }, 0)
      .to(pos, { y: y0 - 32, duration: 0.15, ease: 'power2.out' }, 0).to(pos, { y: y0, duration: 0.17, ease: 'power2.in' }, 0.15)); guard(my);
    act('alert', 0.2); await wait(800); guard(my); act('idle', 0.3);
  }

  // ---- esconde-esconde atrás de um card ----
  async function doHide(my) {
    const cards = [...document.querySelectorAll('main .card, main .term')].filter((c) => { const r = c.getBoundingClientRect(); return r.width > W * 1.2 && r.top > innerHeight * 0.22 && r.top < innerHeight * 0.75; });
    if (!cards.length) return doLookAround(my);
    const c = cards[Math.floor(Math.random() * cards.length)], r = c.getBoundingClientRect();
    const top = r.top + scrollY;
    ghost = true; show(false); await wait(260); guard(my);
    html.classList.add('kc-hide');
    onText = null;
    pos.x = clampX(rand(r.left + scrollX + W * 0.5, Math.max(r.left + scrollX + W * 0.5, r.right + scrollX - W * 0.5)));
    pos.y = top + H * 0.62; pos.r = 0;
    face(mouse.x + scrollX > pos.x ? 1 : -1);
    act('curious', 0.01);
    ghost = false; show(true);
    const t0 = Date.now();
    for (;;) {
      await wait(120); guard(my);
      const rr = wrap.getBoundingClientRect();
      const d = Math.hypot(mouse.x - (rr.left + rr.width * 0.6), mouse.y - (rr.top + rr.height * 0.3));
      if (d < 220 || Date.now() - t0 > 12000) break;
    }
    html.classList.remove('kc-hide');
    flash(); say('.kc-boo', 800);
    await jumpTo(my, pos.x, top, { h: 60, prep: 0.02 });
    onText = { x0: pos.x, x1: pos.x, y: top };
    act('happy', 0.25); await wait(700); guard(my);
    onText = null;
    await jumpTo(my, clampX(pos.x + facing * rand(60, 140)), floorY(), { h: 40 });
  }

  // ---- sacudir o mouse: tontura ----
  const shake = { sign: 0, rev: [] };
  addEventListener('pointermove', (e) => {
    if (reduce || paused) return;
    const mx = e.movementX || 0; if (Math.abs(mx) < 18) return;
    const sg = Math.sign(mx);
    if (sg === shake.sign) return;
    shake.sign = sg;
    const now = Date.now();
    shake.rev = shake.rev.filter((t) => now - t < 700); shake.rev.push(now);
    if (shake.rev.length >= 5 && now - dizzyAt > 6000 && !['drag', 'laser', 'lost', 'follow'].includes(mode) && !carrying) { dizzyAt = now; shake.rev = []; dizzy(); }
  }, { passive: true });
  async function dizzy() {
    interrupt(); mode = 'busy'; const my = gen;
    try {
      act('dizzy', 0.2); await wait(700); guard(my);
      for (let i = 0; i < 3; i++) { const t = clampX(pos.x + (i % 2 ? -1 : 1) * rand(25, 45)); await tw(gsap.to(pos, { x: onText ? Math.max(onText.x0, Math.min(onText.x1, t)) : t, duration: 0.45, ease: 'sine.inOut' })); guard(my); }
      await wait(700); guard(my);
      act('idle', 0.4);
    } catch (err) { if (err !== STOP) console.error(err); }
    if (my === gen) mode = 'free';
  }

  // ---- Konami ou digitar "miau"/"meow": giro e chuva de patinhas ----
  const KONAMI = 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a';
  let keyLog = [], typedKeys = '';
  addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('input, textarea, [contenteditable]')) return;
    keyLog.push(e.key.length === 1 ? e.key.toLowerCase() : e.key); keyLog = keyLog.slice(-10);
    if (e.key.length === 1) typedKeys = (typedKeys + e.key.toLowerCase()).slice(-8);
    if (keyLog.join() === KONAMI || typedKeys.endsWith('miau') || typedKeys.endsWith('meow')) { keyLog = []; typedKeys = ''; party(); }
  }, true);
  async function party() {
    if (reduce) return;
    // gato ocupado ou pausado: a chuva de patinhas aparece mesmo assim
    if (paused || ['drag', 'laser', 'lost'].includes(mode) || carrying) { pawRain(); return; }
    interrupt(); mode = 'busy'; const my = gen;
    try {
      act('jump', 0.15); flash(); say('.kc-miau', 900);
      const y0 = pos.y;
      await tw(gsap.timeline().to(pos, { y: y0 - 70, duration: 0.3, ease: 'power2.out' }).to(pos, { r: 360 * facing, duration: 0.55, ease: 'power2.inOut' }, 0).to(pos, { y: y0, duration: 0.28, ease: 'power2.in' }, 0.3)); guard(my);
      pos.r = 0; pawRain();
      act('happy', 0.25); await wait(1200); guard(my);
    } catch (err) { if (err !== STOP) console.error(err); }
    pos.r = 0; if (my === gen) mode = 'free';
  }
  function pawRain() {
    const box = document.createElement('div'); box.className = 'kc-rain'; box.setAttribute('aria-hidden', 'true');
    const paw = (c) => `<svg viewBox="0 0 24 24"><ellipse cx="12" cy="16" rx="6" ry="5" fill="${c}"/><circle cx="5.5" cy="9.5" r="2.4" fill="${c}"/><circle cx="9.5" cy="5.5" r="2.4" fill="${c}"/><circle cx="14.5" cy="5.5" r="2.4" fill="${c}"/><circle cx="18.5" cy="9.5" r="2.4" fill="${c}"/></svg>`;
    for (let i = 0; i < 26; i++) {
      const d = document.createElement('div'); d.className = 'kc-paw'; d.innerHTML = paw(i % 3 ? ACC : AMB); box.append(d);
      gsap.fromTo(d, { x: rand(0, innerWidth - 24), y: -40, rotation: rand(-40, 40) }, { y: innerHeight + 40, rotation: `+=${rand(-120, 120)}`, duration: rand(1.3, 2.3), delay: rand(0, 0.7), ease: 'power1.in' });
    }
    document.body.append(box); setTimeout(() => box.remove(), 3400);
  }

  let diveFn = null;
  const canCmd = () => !paused && !reduce && !['drag', 'laser', 'lost'].includes(mode) && !carrying;
  // o terminal do hero (term.js) chama estes comandos; o gato só escreve nele
  const ht = document.querySelector('.hero__bento .term');
  const out = (txt, cls) => { if (window.__term) window.__term.out(txt, cls); };
  if (ht) {
    const dive = async (my) => {
      {
        const r = ht.getBoundingClientRect();
        onText = null;
        await jumpTo(my, clampX(r.left + scrollX + r.width / 2), r.top + scrollY, { h: 80 });
        await tw(gsap.to(flip, { scaleX: 0.15 * facing, scaleY: 0.15, y: 40, duration: 0.35, ease: 'power2.in' })); guard(my);
        ghost = true; show(false);
        await wait(1500); guard(my);
        out(isEn ? 'Banguela: meow' : 'Banguela: miau', 'kc-ok');
        ghost = false; show(true);
        await tw(gsap.to(flip, { scaleX: facing, scaleY: 1, y: 0, duration: 0.4, ease: 'back.out(2)' })); guard(my);
        flash(); say('.kc-miau', 700);
        onText = { x0: pos.x, x1: pos.x, y: r.top + scrollY };
        await wait(500); guard(my);
        onText = null;
        await jumpTo(my, clampX(pos.x + facing * 120), floorY(), { h: 50 });
      }
    };
    dive.el = ht; diveFn = dive;
  }

  // =================== Lua: a cachorrinha branca que vem brincar ===================
  const DW = 118, DH = Math.round(DW * 140 / 200), DFOOT = 128 / 140, DMIDX = 0.5;
  const WHITE = '#f1f2f4', DEDGE = '#b9bdc6', PINK = '#ff6fa3';
  const dleg = (x, y, far) => `<g class="ld-leg"><rect x="${x - 5}" y="${y - 4}" width="10" height="34" rx="5" fill="${far ? '#d9dce2' : WHITE}" stroke="${DEDGE}" stroke-width="1.2"/></g>`;
  const LUA = `<svg viewBox="0 0 200 140" aria-hidden="true" focusable="false">
    <ellipse class="ld-shadow" cx="100" cy="129" rx="52" ry="5" fill="rgba(0,0,0,.55)"/>
    <g class="ld-all">
      <g class="ld-tail"><path d="M54 76c-14-4-20-20-12-32" fill="none" stroke="${WHITE}" stroke-width="8" stroke-linecap="round"/></g>
      ${dleg(68, 94, true)}${dleg(126, 94, true)}
      <g class="ld-body"><ellipse class="ld-hit" cx="96" cy="82" rx="46" ry="22" fill="${WHITE}" stroke="${DEDGE}" stroke-width="1.2"/></g>
      ${dleg(80, 96)}${dleg(138, 96)}
      <g class="ld-collar">
        <path d="M128 58c-7 8-9 19-4 30" fill="none" stroke="${PINK}" stroke-width="7" stroke-linecap="round"/>
        <circle cx="124" cy="96" r="8" fill="#ffd1e1" stroke="${PINK}" stroke-width="1.6"/>
        <text x="124" y="98.6" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="6.6" font-weight="600" fill="#b8326a">Lua</text>
      </g>
      <g class="ld-head"><g transform="translate(148 54)">
        <ellipse class="ld-hit" rx="21" ry="19" fill="${WHITE}" stroke="${DEDGE}" stroke-width="1.2"/>
        <ellipse cx="17" cy="7" rx="14" ry="9.5" fill="${WHITE}" stroke="${DEDGE}" stroke-width="1.2"/>
        <circle cx="29" cy="4" r="3.6" fill="#16181b"/>
        <circle cx="5" cy="-4" r="2.8" fill="#16181b"/><circle cx="6" cy="-5" r=".9" fill="#fff"/>
        <path class="ld-tongue" d="M20 14q3 9 7 0z" fill="#ff8fb1" opacity="0"/>
        <g class="ld-ear"><path d="M-10-14c-12 0-17 14-13 26 7-1 13-11 13-26z" fill="#e2e4e9" stroke="${DEDGE}" stroke-width="1.2"/></g>
      </g></g>
    </g>
    <g class="ld-tx"><g class="ld-name" opacity="0"><rect x="120" y="0" width="56" height="22" rx="11" fill="#16181b" stroke="${PINK}" stroke-width="1.2"/><text x="148" y="15.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="500" fill="${PINK}">Lua</text></g></g>
    <g class="ld-tx"><text class="ld-bark" x="164" y="36" opacity="0" font-family="JetBrains Mono, monospace" font-size="15" font-weight="500" fill="${PINK}">${isEn ? 'woof!' : 'au!'}</text></g>
  </svg>`;
  const dog = document.createElement('div'); dog.className = 'ld-wrap'; dog.style.width = DW + 'px';
  dog.innerHTML = `<div class="ld-flip">${LUA}</div>`;
  layer.append(dog);
  const dq = (q) => dog.querySelector(q), dqa = (q) => [...dog.querySelectorAll(q)];
  const dflip = dq('.ld-flip'), dlegs = dqa('.ld-leg'), dtail = dq('.ld-tail'), dhead = dq('.ld-head'), dear = dq('.ld-ear'), dbody = dq('.ld-body'), dall = dq('.ld-all');
  gsap.set(dtail, { svgOrigin: '54 76' }); gsap.set(dbody, { svgOrigin: '96 82' }); gsap.set(dhead, { svgOrigin: '148 54' });
  dlegs.forEach((l) => gsap.set(l, { transformOrigin: '50% 0%' }));
  gsap.set(dear, { transformOrigin: '80% 0%' });
  const dpos = { x: -300, y: 0 };
  let dfacing = 1, dLoops = [], luaOn = false, lastLua = Date.now() - 30000;
  const renderDog = () => gsap.set(dog, { x: dpos.x - DW * DMIDX, y: dpos.y - DH * DFOOT });
  function dogFace(dir) {
    if (!dir || dir === dfacing) return;
    dfacing = dir; gsap.to(dflip, { scaleX: dir, duration: 0.15 });
    dqa('.ld-tx').forEach((g) => { const bb = g.getBBox(); const cx = bb.x + bb.width / 2; if (dir < 0) g.setAttribute('transform', `translate(${2 * cx} 0) scale(-1 1)`); else g.removeAttribute('transform'); });
  }
  const dKill = () => { dLoops.forEach((t) => t.kill()); dLoops = []; };
  function dogRun(on) {
    dKill();
    dLoops.push(gsap.to(dtail, { rotation: 22, duration: on ? 0.09 : 0.14, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    if (on) {
      dLoops.push(gsap.fromTo([dlegs[0], dlegs[3]], { rotation: -28 }, { rotation: 28, duration: 0.13, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
      dLoops.push(gsap.fromTo([dlegs[1], dlegs[2]], { rotation: 28 }, { rotation: -28, duration: 0.13, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
      dLoops.push(gsap.fromTo(dall, { y: 0 }, { y: -4, duration: 0.065, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
      dLoops.push(gsap.to(dear, { rotation: -16, duration: 0.13, yoyo: true, repeat: -1 }));
    } else {
      gsap.to(dlegs, { rotation: 0, duration: 0.2 }); gsap.to(dall, { y: 0, duration: 0.15 }); gsap.to(dear, { rotation: 0, duration: 0.2 });
    }
  }
  const dsay = (q, ms = 900) => { const el = dq(q); gsap.killTweensOf(el); gsap.timeline().fromTo(el, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.25 }).to(el, { opacity: 0, y: -8, duration: 0.4 }, `+=${ms / 1000}`); };
  function playBow(on) {
    gsap.to(dbody, { rotation: on ? 12 : 0, y: on ? 4 : 0, duration: 0.25 });
    gsap.to(dhead, { y: on ? 16 : 0, rotation: on ? 8 : 0, duration: 0.25 });
    gsap.to([dlegs[1], dlegs[3]], { scaleY: on ? 0.7 : 1, duration: 0.25 });
  }
  function dogTo(x, speed = 420) { dogFace(Math.sign(x - dpos.x) || dfacing); return tw(gsap.to(dpos, { x, duration: Math.max(0.25, Math.abs(x - dpos.x) / speed), ease: 'none', onUpdate: renderDog })); }
  function hideDog() {
    if (typeof dLoops === 'undefined') return;
    dKill(); gsap.killTweensOf(dpos); luaOn = false; playBow(false);
    gsap.set(dog, { opacity: 0 }); gsap.set(dq('.ld-tongue'), { opacity: 0 });
  }
  // clicar na Lua: ela late e mostra o nome
  dqa('.ld-hit').forEach((h) => h.addEventListener('click', () => { if (!luaOn) return; dsay('.ld-name', 1300); dsay('.ld-bark', 600); gsap.fromTo(dall, { y: 0 }, { y: -14, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out' }); }));

  async function doLuaVisit(my) {
    // se estiver em cima de algo, desce para o chão antes de a Lua chegar
    if (onText || pos.y < floorY() - 4) { onText = null; await jumpTo(my, pos.x, floorY(), { h: 24 }); }
    lastLua = Date.now(); luaOn = true;
    const fromLeft = pos.x > vw() / 2;
    dpos.y = floorY(); dpos.x = fromLeft ? -DW : vw() + DW; renderDog();
    dfacing = 1; gsap.set(dflip, { scaleX: 1 }); dqa('.ld-tx').forEach((g) => g.removeAttribute('transform'));
    dogFace(fromLeft ? 1 : -1);
    gsap.set(dog, { opacity: 1 });
    dogRun(true);
    face(fromLeft ? -1 : 1); act('alert', 0.2);
    // a Lua chega correndo e se apresenta
    await dogTo(clampX(pos.x + (fromLeft ? -1 : 1) * 150), 460); guard(my);
    dogRun(false); dsay('.ld-name', 1600); dsay('.ld-bark', 700);
    await wait(800); guard(my);
    // reverência de brincadeira; o gato se agacha
    playBow(true); dLoops.push(gsap.to(dtail, { rotation: 26, duration: 0.07, yoyo: true, repeat: -1 }));
    act('crouch', 0.15); await wait(1000); guard(my);
    playBow(false);
    // pega-pega: o gato foge e a Lua corre atrás
    for (let i = 0; i < 2; i++) {
      const away = pos.x < vw() / 2 ? 1 : -1;
      const target = clampX(pos.x + away * rand(260, 380));
      face(away); act('run', 0.12);
      const catRun = tw(gsap.to(pos, { x: target, duration: Math.abs(target - pos.x) / 430, ease: 'none' }));
      await wait(220); guard(my);
      dogRun(true); const dogRunP = dogTo(clampX(target - away * 120), 400);
      await catRun; guard(my); act('idle', 0.15);
      await dogRunP; guard(my); dogRun(false); dsay('.ld-bark', 600);
      await wait(300); guard(my);
    }
    // o gato pula por cima da Lua
    const side = dpos.x > pos.x ? 1 : -1;
    await jumpTo(my, clampX(dpos.x + side * 130), floorY(), { h: 100 });
    dogFace(Math.sign(pos.x - dpos.x) || dfacing); dsay('.ld-bark', 600);
    // focinho com focinho
    dogRun(true); await dogTo(clampX(pos.x - (pos.x > dpos.x ? 1 : -1) * 98), 300); guard(my);
    dogRun(false); face(Math.sign(dpos.x - pos.x) || facing);
    gsap.to(dq('.ld-tongue'), { opacity: 1, duration: 0.15 });
    act('happy', 0.25); say('.kc-say', 1000);
    dLoops.push(gsap.to(dtail, { rotation: 24, duration: 0.08, yoyo: true, repeat: -1 }));
    await wait(1500); guard(my);
    gsap.to(dq('.ld-tongue'), { opacity: 0, duration: 0.15 });
    // a Lua vai embora
    dogRun(true); dsay('.ld-bark', 500);
    await dogTo(dpos.x < vw() / 2 ? -DW : vw() + DW, 480); guard(my);
    hideDog();
    act('curious', 0.25); await wait(900); guard(my); act('idle', 0.3);
  }

  // ---------- pegar e soltar ----------
  let drag = null, suppressClick = false;
  // superfície mais próxima abaixo dos pés: linha de texto, card, terminal, ilustração, botão... ou o chão
  function surfaceBelow(xDoc, yDoc) {
    const xv = xDoc - scrollX, yv = yDoc - scrollY;
    let best = { y: floorY(), perch: false };
    const consider = (top, left, right, text, el) => {
      if (xv < left + 8 || xv > right - 8 || top < yv - 16 || top > innerHeight) return;
      const y = top + scrollY;
      if (y < best.y) best = { y, x0: left + scrollX + W * 0.3, x1: right + scrollX - W * 0.3, perch: true, text, src: el.tagName + '.' + el.className };
    };
    document.querySelectorAll('main h1, main h2, main h3, main p, main li, main .eyebrow, main .chip, main .btn, main .label, main .when, footer p').forEach((el) => {
      if (el.closest('.kc-layer')) return;
      for (const rc of lineRects(el)) if (rc.width > 8) consider(rc.top + 5, rc.left, rc.right, true, el); // +5: as patas afundam um pouco e pisam nas letras
    });
    document.querySelectorAll('main .card, main .term, main .project__art, main .tl-item, main .btn, main .chip, main .email, footer .btn').forEach((el) => {
      const rc = el.getBoundingClientRect(); if (rc.width && rc.height) consider(rc.top, rc.left, rc.right, false, el);
    });
    if (best.perch && best.x1 < best.x0) { const m = (best.x0 + best.x1) / 2; best.x0 = best.x1 = m; }
    return best;
  }
  function beginDrag(e) {
    interrupt(); mode = 'drag'; onText = null; drag.started = true;
    clearTimeout(overT); overT = 0; petting = false; gsap.set(ball, { opacity: 0 });
    html.classList.add('kc-dragging');
    const r = wrap.getBoundingClientRect();
    pos.ox = (e.clientX - r.left) / r.width; pos.oy = (e.clientY - r.top) / r.height;
    drag.offX = pos.x - (e.clientX + scrollX); drag.offY = pos.y - (e.clientY + scrollY) + 8;
    drag.lx = e.clientX; drag.lt = performance.now(); drag.vx = 0;
    act('dangle', 0.15); flash();
  }
  function dragTo(cx, cy) {
    pos.x = clampX(cx + scrollX + drag.offX);
    pos.y = cy + scrollY + drag.offY;
    const now = performance.now(), dtm = Math.max(8, now - drag.lt);
    drag.vx = drag.vx * 0.6 + ((cx - drag.lx) / dtm) * 1000 * 0.4;
    drag.lx = cx; drag.lt = now;
    const rT = Math.max(-30, Math.min(30, -drag.vx * 0.035));
    pos.r += (rT - pos.r) * 0.35;
  }
  async function dropCat() {
    html.classList.remove('kc-dragging');
    mode = 'busy'; const my = ++gen;
    try {
      // endireita e volta a origem para os pés antes de cair
      await tw(gsap.to(pos, { r: 0, duration: 0.12, ease: 'power2.out' })); guard(my);
      const before = wrap.getBoundingClientRect();
      pos.ox = undefined; pos.oy = undefined; render();
      const after = wrap.getBoundingClientRect();
      pos.x += before.left - after.left; pos.y += before.top - after.top;
      const s = surfaceBelow(pos.x, pos.y);
      act('jump', 0.12);
      const dist = Math.max(0, s.y - pos.y);
      await tw(gsap.to(pos, { y: s.y, duration: Math.max(0.16, Math.min(0.8, Math.sqrt(dist) / 26)), ease: 'power2.in' })); guard(my);
      onText = s.perch ? s : null;
      gsap.fromTo(body, { scaleY: 0.82 }, { scaleY: 1, duration: 0.3, ease: 'back.out(3)' });
      act('happy', 0.2); if (s.perch) say('.kc-say', 700);
      await wait(650); guard(my);
      act('idle', 0.3);
    } catch (err) { if (err !== STOP) console.error(err); }
    if (my === gen) mode = 'free';
  }
  $$('.kc-hit').forEach((h) => h.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || paused || reduce || mode === 'lost' || mode === 'laser' || carrying) return;
    e.preventDefault();
    drag = { sx: e.clientX, sy: e.clientY, started: false };
  }));
  addEventListener('pointermove', (e) => {
    if (!drag) return;
    if (!drag.started && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 5) beginDrag(e);
    if (drag.started) dragTo(e.clientX, e.clientY);
  }, { passive: true });
  addEventListener('scroll', () => { if (drag && drag.started) dragTo(mouse.x, mouse.y); }, { passive: true });
  const endDrag = () => {
    if (!drag) return;
    const was = drag.started; drag = null;
    if (was) { suppressClick = true; setTimeout(() => { suppressClick = false; }, 60); dropCat(); }
  };
  addEventListener('pointerup', endDrag);
  addEventListener('pointercancel', endDrag);
  addEventListener('blur', endDrag);

  // clique no gato: pulinho
  $$('.kc-hit').forEach((h) => h.addEventListener('click', async () => {
    if (suppressClick || paused || reduce || mode === 'lost' || mode === 'follow' || mode === 'drag') return;
    interrupt(); mode = 'busy'; const my = gen;
    try { flash(); say('.kc-name', 1400); await jumpTo(my, pos.x, pos.y, { h: 46, prep: 0.06 }); act('happy', 0.2); await wait(700); guard(my); } catch (e) { if (e !== STOP) console.error(e); }
    if (my === gen) mode = 'free';
  }));
  // duplo clique em qualquer lugar: posição de ataque e bote no cursor
  addEventListener('dblclick', async (e) => {
    if (paused || reduce || mode === 'lost' || mode === 'follow' || mode === 'drag' || mode === 'laser' || e.target.closest('input, textarea')) return;
    lastAct = Date.now();
    interrupt(); mode = 'busy'; const my = gen;
    const tx = e.clientX + scrollX, ty = e.clientY + scrollY + H * 0.38;
    const start = { x: e.clientX, y: e.clientY };
    if (carrying) return;
    clearTimeout(overT); overT = 0; petting = false;
    try {
      face(Math.sign(tx - pos.x) || facing);
      act('crouch', 0.15); await wait(750); guard(my);
      onText = null;
      await jumpTo(my, tx, Math.min(ty, floorY()), { h: 50, poseName: 'pounce', prep: 0.05 });
      flash();
      // pegou? só se o cursor ainda estiver perto de onde foi o duplo clique
      if (Math.hypot(mouse.x - start.x, mouse.y - start.y) < 40) await carry(my);
      else {
        act('curious', 0.2); say('.kc-q', 900); await wait(900); guard(my);
        if (pos.y < floorY() - 4) await jumpTo(my, pos.x + facing * 40, floorY(), { h: 16 });
      }
    } catch (err) { if (err !== STOP) console.error(err); }
    if (my === gen) mode = 'free';
  });

  // ---------- pausa ----------
  function setupPause(onPause, onPlay) {
    const btns = [...document.querySelectorAll('[data-cat-toggle]')];
    const apply = (v) => {
      paused = v;
      try { localStorage.setItem('kc-paused', v ? '1' : '0'); } catch {}
      btns.forEach((b) => { b.hidden = !!reduce; b.setAttribute('aria-pressed', String(v)); b.setAttribute('aria-label', v ? T.play : T.pause); b.title = v ? T.play : T.pause; const l = b.querySelector('[data-cat-label]'); if (l) l.textContent = v ? T.play : T.pause; });
      if (haloT) { if (v) haloT.pause(); else haloT.play(); }
      if (v) { killLoops(); onPause(); } else { act(pose === 'sleep' ? 'sleep' : 'idle', 0.3); onPlay(); }
    };
    btns.forEach((b) => b.addEventListener('click', () => apply(!paused)));
    let saved = false; try { saved = localStorage.getItem('kc-paused') === '1'; } catch {}
    apply(saved && !reduce);
  }

  // executa uma ação isolada (testes)
  async function run(fn) { interrupt(); mode = 'busy'; const my = gen; try { await fn(my); } catch (e) { if (e !== STOP) console.error(e); } if (my === gen) mode = 'free'; }
  // estado legível para testes automatizados
  window.__kc = { get pose() { return pose; }, get mode() { return mode; }, get onText() { return !!onText; }, get perch() { return onText && onText.perch ? { y: Math.round(onText.y), text: !!onText.text, src: onText.src } : null; }, get carrying() { return carrying; }, get petting() { return petting; }, get lostSide() { return lostSide; }, get laser() { return laser.on; }, test: { terminal: () => run(doTerminal), project: (id) => run((my) => doShowProject(my, id)), knock: () => run(doKnock), box: () => run(doBox), groom: () => run(doGroom), sneeze: () => run(doSneeze), yawn: () => run(doYawn), hide: () => run(doHide), sleep: () => run(doSleep), lua: () => run(doLuaVisit), dive: () => diveFn && run(diveFn) }, cmd: { can: canCmd, dive: () => diveFn && run(diveFn), lua: () => run(doLuaVisit), sleep: () => run((my) => doSleep(my, true)), get luaOn() { return luaOn; } }, get luaOn() { return luaOn; }, get chair() { return !!chairEl; }, get bugVisible() { return getComputedStyle(bug).opacity !== '0'; }, huntBug: async () => { interrupt(); mode = 'busy'; const my = gen; try { await doBugHunt(my); } catch (e) { if (e !== STOP) console.error(e); } if (my === gen) mode = 'free'; }, pos, bpos };

  // ---------- início ----------
  pos.x = clampX(vw() - 180); pos.y = floorY(); render();
  setupPause(() => { interrupt(); if (mode !== 'lost') mode = 'free'; act('idle', 0.3); }, () => {});
  if (reduce) { show(true); return; }
  show(true);
  setTimeout(blink, 1600);
  act('idle', 0);
  brain();
})();
