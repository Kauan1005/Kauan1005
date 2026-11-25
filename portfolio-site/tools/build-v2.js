// Portfólio v2: gera portfolio/index.html (PT) e portfolio/en.html (EN).
// Uso: node build-v2.js
const fs = require('fs');
const path = require('path');

const SITE = path.join(__dirname, '..', 'portfolio');
const EMAIL = 'kauanribalmeida@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/kauan-ribeiro';
const GITHUB = 'https://github.com/Kauan1005';
const T_SITE = 'https://tonsorium.netlify.app';
const T_CODE = 'https://github.com/Kauan1005/tonsorium-admin';
const A_SITE = 'https://acrilife.com.br';
const BASE = 'https://ribeiroportfolio.netlify.app';
const ext = 'target="_blank" rel="noopener noreferrer"';

// ---------- ícones de interface (traço próprio, 24x24) ----------
const I = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  ext: '<path d="M7 17 17 7M8 7h9v9"/>',
  down: '<path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  gh: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  in: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  flow: '<circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 6h4a3 3 0 0 1 3 3v6"/>',
  db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  layout: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M9 9v11"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  cat: '<path d="M5 20v-9l-1-7 5 4h6l5-4-1 7v9z"/><path d="M9.5 13.5h.01M14.5 13.5h.01"/><path d="M11 16.5h2"/>',
};
const ic = (n, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
const logo = (id, inv = false) => `<img src="assets/icons/${id}.svg" alt="" width="15" height="15" loading="lazy" decoding="async"${inv ? ' class="inv"' : ''}>`;
const chip = (name, id, inv) => `<li class="chip">${id ? logo(id, inv) : ''}${name}</li>`;

// ---------- ilustrações próprias em SVG ----------
function artTonsorium(c) {
  const days = c.days;
  const cols = days.map((d, i) => {
    const x = 64 + i * 58;
    const slots = [0, 1, 2, 3, 4, 5].map((r) => {
      const y = 110 + r * 34;
      const busy = (i * 7 + r * 3) % 5 === 0 || (i === 3 && r === 1);
      const booked = i === 2 && r === 2;
      const off = i === 4 && r >= 4;
      if (booked) return `<rect x="${x}" y="${y}" width="48" height="26" rx="9" fill="#4ade80"/><path d="m${x + 17} ${y + 13} 5 5 9-10" fill="none" stroke="#052e16" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
      if (off) return `<rect x="${x + .5}" y="${y + .5}" width="47" height="25" rx="9" fill="none" stroke="#f5b454" stroke-opacity=".55" stroke-dasharray="3 3"/>`;
      if (busy) return `<rect x="${x}" y="${y}" width="48" height="26" rx="9" fill="url(#hatch)"/>`;
      return `<rect x="${x + .5}" y="${y + .5}" width="47" height="25" rx="9" fill="none" stroke="rgba(255,255,255,.12)"/>`;
    }).join('');
    return `<text x="${x + 24}" y="94" text-anchor="middle" class="sv-l">${d}</text>${slots}`;
  }).join('');
  return `<svg viewBox="0 0 480 440" role="img" aria-label="${c.artT}">
  <defs>
    <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="rgba(255,255,255,.05)"/><path d="M0 0v6" stroke="rgba(255,255,255,.16)" stroke-width="2"/></pattern>
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="rgba(255,255,255,.07)"/></pattern>
  </defs>
  <rect width="480" height="440" fill="url(#dots)"/>
  <rect x="40" y="48" width="334" height="330" rx="24" fill="#101113" stroke="rgba(255,255,255,.1)"/>
  <circle cx="66" cy="70" r="4" fill="#2a2d32"/><circle cx="80" cy="70" r="4" fill="#2a2d32"/><circle cx="94" cy="70" r="4" fill="#2a2d32"/>
  <text x="352" y="74" text-anchor="end" class="sv-l">${c.agenda}</text>
  ${cols}
  <g transform="translate(316 238)">
    <path d="M62 0 118 20v46c0 38-25 64-56 76C31 130 6 104 6 66V20z" fill="#16181b" stroke="#4ade80" stroke-width="2"/>
    <rect x="44" y="56" width="36" height="30" rx="8" fill="none" stroke="#4ade80" stroke-width="2.4"/>
    <path d="M51 56v-8a11 11 0 0 1 22 0v8" fill="none" stroke="#4ade80" stroke-width="2.4"/>
    <text x="62" y="112" text-anchor="middle" class="sv-l" fill="#4ade80">RLS + 2FA</text>
  </g>
  <g transform="translate(40 396)">
    <rect width="168" height="32" rx="16" fill="#16181b" stroke="rgba(255,255,255,.12)"/>
    <circle cx="18" cy="16" r="5" fill="#4ade80"/>
    <text x="32" y="20.5" class="sv-m">${c.tests}</text>
  </g>
</svg>`;
}

function artAcrilife(c) {
  return `<svg viewBox="0 0 480 440" role="img" aria-label="${c.artA}">
  <defs><pattern id="dots2" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="rgba(255,255,255,.07)"/></pattern>
  <radialGradient id="glow" r=".5"><stop offset="0" stop-color="#4ade80" stop-opacity=".35"/><stop offset="1" stop-color="#4ade80" stop-opacity="0"/></radialGradient></defs>
  <rect width="480" height="440" fill="url(#dots2)"/>
  <g>
    <rect x="40" y="44" width="180" height="168" rx="24" fill="#101113" stroke="rgba(255,255,255,.1)"/>
    <circle cx="130" cy="118" r="62" fill="url(#glow)"/>
    <path d="M100 152 130 82l30 70M110 130h40" fill="none" stroke="#4ade80" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="60" y="182" width="72" height="9" rx="4.5" fill="rgba(255,255,255,.18)"/>
  </g>
  <g>
    <rect x="236" y="44" width="180" height="168" rx="24" fill="#101113" stroke="rgba(255,255,255,.1)"/>
    <rect x="290" y="78" width="72" height="84" rx="12" fill="none" stroke="#e8eaed" stroke-opacity=".7" stroke-width="3"/>
    <path d="M300 170h52l10 12h-72z" fill="none" stroke="#e8eaed" stroke-opacity=".5" stroke-width="3" stroke-linejoin="round"/>
    <rect x="256" y="182" width="60" height="9" rx="4.5" fill="rgba(255,255,255,.18)"/>
  </g>
  <g>
    <rect x="40" y="228" width="180" height="168" rx="24" fill="#101113" stroke="rgba(255,255,255,.1)"/>
    <circle cx="130" cy="296" r="34" fill="none" stroke="#f5b454" stroke-width="3"/>
    <path d="M130 278v18l12 8" fill="none" stroke="#f5b454" stroke-width="3" stroke-linecap="round"/>
    <rect x="60" y="366" width="84" height="9" rx="4.5" fill="rgba(255,255,255,.18)"/>
  </g>
  <g>
    <rect x="236" y="228" width="180" height="168" rx="24" fill="#16181b" stroke="#4ade80" stroke-opacity=".5"/>
    <text x="256" y="262" class="sv-l" fill="#4ade80">${c.panel}</text>
    <rect x="256" y="280" width="140" height="10" rx="5" fill="rgba(255,255,255,.14)"/>
    <rect x="256" y="300" width="104" height="10" rx="5" fill="rgba(255,255,255,.1)"/>
    <rect x="256" y="320" width="122" height="10" rx="5" fill="rgba(255,255,255,.1)"/>
    <rect x="256" y="350" width="74" height="28" rx="14" fill="#4ade80"/>
    <text x="293" y="368.5" text-anchor="middle" class="sv-m" fill="#052e16">${c.save}</text>
  </g>
  <g transform="translate(318 18)">
    <path d="M14 0h118a14 14 0 0 1 14 14v30a14 14 0 0 1-14 14H40l-16 14V58h-10A14 14 0 0 1 0 44V14A14 14 0 0 1 14 0z" fill="#1d2024" stroke="rgba(255,255,255,.16)"/>
    <text x="73" y="34" text-anchor="middle" class="sv-m">${c.quote}</text>
  </g>
</svg>`;
}

function artPipe(c, vertical) {
  if (vertical) {
    const lane = (y, label, sub, color) => `<g class="rb-lane" transform="translate(20 ${y})"><rect width="300" height="56" rx="18" fill="#16181b" stroke="rgba(255,255,255,.12)"/><circle cx="28" cy="28" r="6" fill="${color}"/><text x="48" y="25" class="sv-b">${label}</text><text x="48" y="42" class="sv-l">${sub}</text></g>`;
    return `<svg viewBox="0 0 340 520" role="img" aria-label="${c.pipeAlt}">
    <g transform="translate(20 10)"><rect width="300" height="64" rx="20" fill="#16181b" stroke="rgba(255,255,255,.12)"/><text x="24" y="29" class="sv-l">${c.p.in}</text><text x="24" y="48" class="sv-b">SQL Server</text></g>
    <path class="rb-wire" d="M170 74v40" stroke="rgba(255,255,255,.2)" stroke-width="2"/>
    <g transform="translate(20 114)"><rect width="300" height="80" rx="22" fill="#0f1a13" stroke="#4ade80" stroke-width="1.5"/><text x="24" y="33" class="sv-l" fill="#4ade80">${c.p.core}</text><text x="24" y="56" class="sv-b">KNIME · ${c.p.flows}</text></g>
    <g fill="none" stroke="rgba(255,255,255,.2)" stroke-width="2"><path class="rb-wire" data-to="0" d="M170 194v28H60v30"/><path class="rb-wire" data-to="1" d="M170 194v136"/><path class="rb-wire" data-to="2" d="M170 194v28h110v190"/></g>
    ${lane(252, 'WhatsApp', c.p.api, '#4ade80')}${lane(330, 'RCS', c.p.api, '#4ade80')}${lane(412, c.p.report, 'Python · ' + c.p.daily, '#f5b454')}
  </svg>`;
  }
  const lane = (y, label, sub, color) => `<g class="rb-lane" transform="translate(760 ${y})"><rect width="300" height="64" rx="20" fill="#16181b" stroke="rgba(255,255,255,.12)"/><circle cx="30" cy="32" r="7" fill="${color}"/><text x="52" y="28" class="sv-b">${label}</text><text x="52" y="47" class="sv-l">${sub}</text></g>`;
  return `<svg viewBox="0 0 1100 300" role="img" aria-label="${c.pipeAlt}">
  <defs><pattern id="dots3" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="rgba(255,255,255,.06)"/></pattern></defs>
  <rect width="1100" height="300" fill="url(#dots3)"/>
  <g transform="translate(40 110)"><rect width="230" height="80" rx="22" fill="#16181b" stroke="rgba(255,255,255,.12)"/><text x="26" y="33" class="sv-l">${c.p.in}</text><text x="26" y="57" class="sv-b">SQL Server</text></g>
  <path class="rb-wire" d="M270 150h110" stroke="rgba(255,255,255,.22)" stroke-width="2"/><circle cx="325" cy="150" r="4" fill="#4ade80"/>
  <g transform="translate(380 96)"><rect width="270" height="108" rx="26" fill="#0f1a13" stroke="#4ade80" stroke-width="1.5"/><text x="28" y="40" class="sv-l" fill="#4ade80">${c.p.core}</text><text x="28" y="68" class="sv-b">KNIME · ${c.p.flows}</text><text x="28" y="88" class="sv-l">${c.p.nodes}</text></g>
  <g fill="none" stroke="rgba(255,255,255,.22)" stroke-width="2"><path class="rb-wire" data-to="0" d="M650 150h50V52a14 14 0 0 1 14-14h46"/><path class="rb-wire" data-to="1" d="M650 150h110"/><path class="rb-wire" data-to="2" d="M650 150h50v98a14 14 0 0 0 14 14h46"/></g>
  ${lane(6, 'WhatsApp', c.p.api, '#4ade80')}${lane(118, 'RCS', c.p.api, '#4ade80')}${lane(230, c.p.report, 'Python · ' + c.p.daily, '#f5b454')}
</svg>`;
}

// ---------- conteúdo ----------
const PT = {
  lang: 'pt-BR', file: 'index.html', other: 'en.html',
  title: 'Kauan Ribeiro Almeida · Automação de dados e sistemas web',
  desc: 'Assistente de Planejamento em Osasco, SP, em busca da primeira vaga como desenvolvedor júnior. Automação com KNIME, SQL e Python, integração de APIs e sistemas web com Supabase e React.',
  skip: 'Pular para o conteúdo', catPause: 'Pausar o gato', menu: 'Abrir menu', menuClose: 'Fechar menu', mainNav: 'Principal',
  nav: [['projetos', 'Projetos'], ['automacao', 'Automação'], ['habilidades', 'Habilidades'], ['experiencia', 'Experiência'], ['contato', 'Contato']],
  langLabel: 'Idioma',
  cv: 'Baixar currículo', cvFile: 'cv/Kauan-Ribeiro-Almeida-CV-PT.pdf', cvOther: 'cv/Kauan-Ribeiro-Almeida-CV-EN.pdf', cvOtherLabel: 'Currículo em inglês',
  mail: 'Enviar e-mail', subject: 'Vaga de desenvolvedor júnior',
  hero: {
    status: 'aberto a vagas júnior · Osasco, SP · remoto ou híbrido',
    h1: 'Automação de dados <span class="dim">e sistemas web.</span>',
    lead: 'Sou Assistente de Planejamento na ML Gomes, onde construí as automações de dados e os disparos por API da cobrança. Também entreguei sozinho dois sistemas web com Supabase e React. Busco minha primeira vaga como desenvolvedor júnior.',
    nowL: 'agora', now: 'Automação de cobrança na ML Gomes',
    doneL: 'entregues', done: '2 sistemas web, do banco ao deploy',
    file: 'perfil.json',
    json: [['cargo', '"Assistente de Planejamento"'], ['busca', '"Desenvolvedor júnior"'], ['foco', '["automação", "dados", "web"]'], ['stack', '["SQL", "Python", "React"]']],
  },
  projHead: { eyebrow: 'ls ./projetos', h2: 'Projetos entregues. <span class="dim">Do problema ao deploy.</span>' },
  f: { what: 'O que é', problem: 'Problema', solution: 'Solução', feats: 'Funcionalidades', stack: 'Stack', role: 'Meu papel', result: 'Resultado' },
  t: {
    n: '01 / 02', name: 'Tonsorium', kind: 'Sistema web · 2026',
    what: 'Sistema da barbearia Tonsorium, em Itapevi/SP: site público com agendamento e um painel administrativo.',
    problem: 'A agenda era manual e o site era estático: o dono não conseguia atualizar nada sem um desenvolvedor.',
    solution: 'Site com agendamento em tempo real e painel em que dono e barbeiros cuidam da agenda e do conteúdo sem código.',
    feats: ['Horários ocupados em tempo real e pedido pelo WhatsApp', 'Painel com 3 perfis e 18 módulos editáveis', 'Avaliações moderadas e sincronizadas com o Google', 'Login com 2FA, backup diário e LGPD'],
    stack: [['React', 'react'], ['TypeScript', 'typescript'], ['Supabase', 'supabase'], ['PostgreSQL', 'postgres'], ['GitHub Actions', 'github-actions']],
    role: 'Desenvolvedor único: produto, front-end, banco, segurança e deploy.',
    result: '21 tabelas com 26 políticas RLS e 61 testes automatizados passando. Entregue ao cliente, em implantação.',
    site: 'Abrir o site', code: 'Ver o código',
  },
  a: {
    n: '02 / 02', name: 'Acrilife', kind: 'Catálogo e painel · 2025',
    what: 'Catálogo online e painel administrativo da AcriLife, empresa de produtos em acrílico e LED em São Paulo.',
    solution: 'Catálogo com pedido de orçamento pelo WhatsApp e um painel em que os donos cadastram produtos, categorias e fotos.',
    feats: ['Catálogo com filtro por categoria e galeria por produto', 'Orçamento pelo WhatsApp com produto e código preenchidos', 'Painel com cadastro de produtos, várias fotos e exclusão em massa', 'Compressão de imagem no navegador e acesso por perfil'],
    stack: [['JavaScript', 'javascript'], ['HTML e CSS', 'html'], ['Supabase', 'supabase'], ['Netlify', 'netlify']],
    role: 'Desenvolvedor único: produto, front-end, banco e deploy.',
    result: 'No ar em acrilife.com.br. Os donos ampliaram o catálogo sozinhos pelo painel.',
    site: 'Abrir o site',
  },
  k: {
    eyebrow: 'crontab -l · processo diário', h2: 'Automação de cobrança. <span class="dim">Do atendimento ao planejamento.</span>',
    lead: 'Com a promoção para o planejamento, em 09/2026, passei a automatizar o preparo e o envio das campanhas. Todo dia, pegam a carteira no banco, limpam e segmentam os contatos e disparam as campanhas por API.',
    facts: [
      ['≈ R$ 2 mil por dia', 'Economia média em 11 dias de envio: mensagens desnecessárias bloqueadas antes de gerar custo.'],
      ['5 fluxos KNIME', 'Cerca de 1.700 nós, separados por perfil de carteira.'],
      ['Disparo por API REST', 'Campanhas de WhatsApp e RCS sem upload manual.'],
      ['Trava em T-SQL e relatório em Python', 'Bloqueia contato repetido na hora do envio e mede gasto e economia por canal, todo dia.'],
    ],
  },
  p: { in: 'entrada', core: 'núcleo', flows: '5 fluxos', nodes: '~1.700 nós', api: 'API REST', report: 'Relatório', daily: 'diário' },
  code: { label: 'Código', note: 'Arquivos do repositório público, com nomes fictícios e sem dados da empresa.', repo: 'Ver o repositório completo' },
  pipeAlt: 'A carteira sai do SQL Server, passa pelos fluxos KNIME e segue para WhatsApp, RCS e o relatório diário em Python.',
  s: {
    eyebrow: 'cat stack.json', h2: 'Ferramentas do dia a dia. <span class="dim">E onde usei cada uma.</span>',
    cards: [
      ['flow', 'Automação e dados', 'No trabalho, todo dia.', [['KNIME', 'knime'], ['SQL Server', 'database', true], ['Python', 'python'], ['APIs REST'], ['Excel', 'xlsx']]],
      ['db', 'Back-end e banco', 'Tonsorium, Acrilife e Arca.', [['Supabase', 'supabase'], ['PostgreSQL', 'postgres'], ['RLS'], ['Edge Functions', 'deno', true], ['Web Crypto']]],
      ['layout', 'Front-end', 'Interfaces responsivas e acessíveis.', [['React', 'react'], ['Next.js'], ['TypeScript', 'typescript'], ['JavaScript', 'javascript'], ['HTML e CSS', 'html']]],
      ['spark', 'Ferramentas e IA', 'Versionamento, deploy e IA: no desenvolvimento e dentro do produto.', [['GitHub', 'github', true], ['GitHub Actions', 'github-actions'], ['Netlify', 'netlify'], ['Claude Code', 'claude-code'], ['API do Claude', 'claude-code']]],
    ],
    termTitle: 'tonsorium/admin', tests: ['horário sobreposto é recusado', 'cliente não vê a agenda', 'admin sem 2FA não é admin', 'barbeiro vê só a própria agenda'],
    sum: '61 ok · 0 falhas · 3,23s',
  },
  gh: {
    eyebrow: 'gh repo list kauan1005', h2: 'Mais no GitHub. <span class="dim">Código aberto para você ler.</span>',
    open: 'Abrir no GitHub',
    items: [
      ['apogeu-app', 'Apogeu: site de finanças pessoais com Open Finance (Next.js, TypeScript e Supabase). Importa as transações dos bancos, categoriza sozinho, mostra o fluxo de caixa com projeção e roda como app Android. O código do site está na pasta site/ (sem chaves nem histórico), com migrações do Supabase com RLS e 14 suítes de testes; há também protótipos com dados fictícios.', ['Next.js', 'TypeScript', 'Supabase', 'Android'], ['Ver protótipos', 'https://kauan1005.github.io/apogeu-app/']],
      ['automacao-cobranca', 'A lógica dos meus fluxos de cobrança em Python, com dados fictícios: limpeza de CPF/CNPJ, segmentação, trava anti-reenvio e relatório. As respostas dos clientes são classificadas com a API do Claude (com regras de reserva). 18 testes e CI.', ['Python', 'SQL', 'API do Claude', 'GitHub Actions']],
      ['Gerenciador-de-Senhas', 'Arca: gerenciador de senhas e de projetos que cifra tudo no navegador (AES-256-GCM, chave por PBKDF2). O login usa um segredo derivado, não a senha mestra, e há chave de recuperação. Tem CSP, SRI, um relatório de segurança com 14 achados corrigidos e testes de criptografia e de ponta a ponta.', ['JavaScript', 'Web Crypto', 'Supabase', 'Playwright']],
      ['quicklink-devops-enterprise', 'Infraestrutura com Docker Compose e Nginx como proxy reverso, com limite de CPU e memória por serviço e monitoramento do consumo.', ['Docker', 'Nginx', 'DevOps']],
    ],
  },
  e: {
    eyebrow: 'git log --carreira', h2: 'Experiência <span class="dim">e formação.</span>',
    lead: 'Do atendimento ao planejamento na mesma empresa: foi no atendimento que aprendi o processo de cobrança, e no planejamento que passei a automatizá-lo.',
    items: [
      ['09/2026 — atual', 'Assistente de Planejamento · ML Gomes', 'Automação de dados e disparos por API com KNIME, SQL Server e Python.', true],
      ['09/2024 — 09/2026', 'Operador de Atendimento · ML Gomes', 'Negociação com clientes. Nesse período desenvolvi os sistemas web Acrilife e Tonsorium.'],
      ['07/2024 — 09/2024', 'Jovem Aprendiz · Siry Global', 'Controle de estoque e relatórios de conformidade em Excel.'],
      ['06/2026', 'Análise e Desenvolvimento de Sistemas · UNIFIEO', 'Tecnólogo.'],
      ['idiomas', 'Português nativo · Inglês intermediário', 'Leitura técnica em inglês.'],
    ],
  },
  c: {
    eyebrow: 'echo "vamos conversar"', h2: 'Vamos conversar <span class="dim">sobre a sua vaga.</span>',
    lead: 'Busco vaga júnior em automação, dados ou IA, remota ou híbrida na Grande São Paulo.',
    copy: 'Copiar', copied: 'Copiado',
  },
  foot: 'Feito com HTML, CSS e JavaScript.', top: 'Voltar ao topo',
  days: ['SEG', 'TER', 'QUA', 'QUI', 'SEX'], agenda: 'agenda · hoje', tests: '61 testes ok',
  artT: 'Ilustração: agenda semanal com horários livres, ocupados e um horário marcado, protegida por um escudo de RLS e 2FA.',
  artA: 'Ilustração: cards de produtos do catálogo, um painel de cadastro e um balão de pedido de orçamento.',
  panel: 'painel', save: 'salvar', quote: 'orçamento?',
};

const EN = {
  lang: 'en', file: 'en.html', other: 'index.html',
  title: 'Kauan Ribeiro Almeida · Data automation and web systems',
  desc: 'Planning Assistant in Osasco, Brazil, looking for a first junior developer role. Automation with KNIME, SQL and Python, API integration and web systems with Supabase and React.',
  skip: 'Skip to content', catPause: 'Pause the cat', menu: 'Open menu', menuClose: 'Close menu', mainNav: 'Main',
  nav: [['projetos', 'Projects'], ['automacao', 'Automation'], ['habilidades', 'Skills'], ['experiencia', 'Experience'], ['contato', 'Contact']],
  langLabel: 'Language',
  cv: 'Download CV', cvFile: 'cv/Kauan-Ribeiro-Almeida-CV-EN.pdf', cvOther: 'cv/Kauan-Ribeiro-Almeida-CV-PT.pdf', cvOtherLabel: 'CV in Portuguese',
  mail: 'Send an email', subject: 'Junior developer role',
  hero: {
    status: 'open to junior roles · Osasco, Brazil · remote or hybrid',
    h1: 'Data automation <span class="dim">and web systems.</span>',
    lead: 'I am a Planning Assistant at ML Gomes, where I built the data automation and API campaigns for debt collection. I also delivered two web systems on my own with Supabase and React. I am looking for my first junior developer role.',
    nowL: 'now', now: 'Debt-collection automation at ML Gomes',
    doneL: 'shipped', done: '2 web systems, from database to deploy',
    file: 'profile.json',
    json: [['role', '"Planning Assistant"'], ['seeking', '"Junior developer"'], ['focus', '["automation", "data", "web"]'], ['stack', '["SQL", "Python", "React"]']],
  },
  projHead: { eyebrow: 'ls ./projects', h2: 'Shipped projects. <span class="dim">From problem to deploy.</span>' },
  f: { what: 'What it is', problem: 'Problem', solution: 'Solution', feats: 'Features', stack: 'Stack', role: 'My role', result: 'Result' },
  t: {
    n: '01 / 02', name: 'Tonsorium', kind: 'Web system · 2026',
    what: 'System for the Tonsorium barbershop in Itapevi, Brazil: a public site with booking and an admin panel.',
    problem: 'Bookings were handled by hand and the site was static: the owner could not change anything without a developer.',
    solution: 'A site with real-time booking and a panel where the owner and barbers manage bookings and content without code.',
    feats: ['Real-time busy slots and WhatsApp booking requests', 'Admin panel with 3 roles and 18 editable modules', 'Reviews moderated and synced with Google', '2FA login, daily backups and LGPD compliance'],
    stack: [['React', 'react'], ['TypeScript', 'typescript'], ['Supabase', 'supabase'], ['PostgreSQL', 'postgres'], ['GitHub Actions', 'github-actions']],
    role: 'Sole developer: product, front end, database, security and deploy.',
    result: '21 tables with 26 RLS policies and 61 automated tests passing. Delivered to the client, being rolled out.',
    site: 'Open the site', code: 'See the code',
  },
  a: {
    n: '02 / 02', name: 'Acrilife', kind: 'Catalogue and panel · 2025',
    what: 'Online catalogue and admin panel for AcriLife, an acrylic and LED products company in São Paulo.',
    solution: 'A catalogue with WhatsApp quote requests and a panel where the owners add products, categories and photos.',
    feats: ['Catalogue with category filter and per-product gallery', 'WhatsApp quote with product and code filled in', 'Admin panel with multi-photo products and bulk delete', 'In-browser image compression and role-based access'],
    stack: [['JavaScript', 'javascript'], ['HTML and CSS', 'html'], ['Supabase', 'supabase'], ['Netlify', 'netlify']],
    role: 'Sole developer: product, front end, database and deploy.',
    result: 'Live at acrilife.com.br. The owners grew the catalogue on their own through the panel.',
    site: 'Open the site',
  },
  k: {
    eyebrow: 'crontab -l · daily process', h2: 'Collection automation. <span class="dim">From customer service to planning.</span>',
    lead: 'After my promotion to planning, in 09/2026, I started automating campaign preparation and delivery. Every day they take the portfolio from the database, clean and segment the contacts and send campaigns through APIs.',
    facts: [
      ['≈ R$ 2k per day', 'Average savings over 11 sending days: unnecessary messages blocked before they cost anything.'],
      ['5 KNIME workflows', 'About 1,700 nodes, split by portfolio profile.'],
      ['REST API delivery', 'WhatsApp and RCS campaigns with no manual upload.'],
      ['T-SQL guard and Python report', 'Blocks repeat contacts at send time and measures cost and savings per channel, every day.'],
    ],
  },
  p: { in: 'input', core: 'core', flows: '5 workflows', nodes: '~1,700 nodes', api: 'REST API', report: 'Report', daily: 'daily' },
  code: { label: 'Code', note: 'Files from the public repository (written in Portuguese), with made-up names and no company data.', repo: 'See the full repository' },
  pipeAlt: 'The portfolio leaves SQL Server, goes through the KNIME workflows and out to WhatsApp, RCS and the daily Python report.',
  s: {
    eyebrow: 'cat stack.json', h2: 'Everyday tools. <span class="dim">And where I used each one.</span>',
    cards: [
      ['flow', 'Automation and data', 'At work, every day.', [['KNIME', 'knime'], ['SQL Server', 'database', true], ['Python', 'python'], ['REST APIs'], ['Excel', 'xlsx']]],
      ['db', 'Back end and database', 'Tonsorium, Acrilife and Arca.', [['Supabase', 'supabase'], ['PostgreSQL', 'postgres'], ['RLS'], ['Edge Functions', 'deno', true], ['Web Crypto']]],
      ['layout', 'Front end', 'Responsive, accessible interfaces.', [['React', 'react'], ['Next.js'], ['TypeScript', 'typescript'], ['JavaScript', 'javascript'], ['HTML and CSS', 'html']]],
      ['spark', 'Tools and AI', 'Version control, deploy and AI: while coding and inside the product.', [['GitHub', 'github', true], ['GitHub Actions', 'github-actions'], ['Netlify', 'netlify'], ['Claude Code', 'claude-code'], ['Claude API', 'claude-code']]],
    ],
    termTitle: 'tonsorium/admin', tests: ['overlapping booking is refused', 'customer cannot read the schedule', 'admin without 2FA is not admin', 'barber sees only own schedule'],
    sum: '61 passed · 0 failed · 3.23s',
  },
  gh: {
    eyebrow: 'gh repo list kauan1005', h2: 'More on GitHub. <span class="dim">Open code you can read.</span>',
    open: 'Open on GitHub',
    items: [
      ['apogeu-app', 'Apogeu: a personal finance site with Open Finance (Next.js, TypeScript and Supabase). It imports bank transactions, categorizes them automatically, shows cash flow with a projection and runs as an Android app. The site code is in the site/ folder (no keys, no history), with Supabase migrations with RLS and 14 test suites; there are also prototypes with made-up data.', ['Next.js', 'TypeScript', 'Supabase', 'Android'], ['See prototypes', 'https://kauan1005.github.io/apogeu-app/']],
      ['automacao-cobranca', 'The logic of my debt-collection workflows in Python, with made-up data: ID cleansing, segmentation, a resend guard and a report. Customer replies are classified with the Claude API (with fallback rules). 18 tests and CI.', ['Python', 'SQL', 'Claude API', 'GitHub Actions']],
      ['Gerenciador-de-Senhas', 'Arca: a password and project manager that encrypts everything in the browser (AES-256-GCM, PBKDF2 key). Login uses a derived secret, not the master password, and there is a recovery key. It has CSP, SRI, a security report with 14 fixed findings and crypto and end-to-end tests.', ['JavaScript', 'Web Crypto', 'Supabase', 'Playwright']],
      ['quicklink-devops-enterprise', 'Infrastructure with Docker Compose and Nginx as a reverse proxy, with CPU and memory limits per service and resource monitoring.', ['Docker', 'Nginx', 'DevOps']],
    ],
  },
  e: {
    eyebrow: 'git log --career', h2: 'Experience <span class="dim">and education.</span>',
    lead: 'From customer service to planning at the same company: customer service is where I learned the collection process, and planning is where I started automating it.',
    items: [
      ['09/2026 — present', 'Planning Assistant · ML Gomes', 'Data automation and API campaigns with KNIME, SQL Server and Python.', true],
      ['09/2024 — 09/2026', 'Customer Service Agent · ML Gomes', 'Customer negotiation. During this period I built the Acrilife and Tonsorium web systems.'],
      ['07/2024 — 09/2024', 'Apprentice · Siry Global', 'Inventory control and compliance reports in Excel.'],
      ['06/2026', 'Systems Analysis and Development · UNIFIEO', 'Associate degree.'],
      ['languages', 'Portuguese native · English intermediate', 'Technical reading in English. This English page is a translation of the Portuguese site.'],
    ],
  },
  c: {
    eyebrow: 'echo "let\'s talk"', h2: 'Let’s talk <span class="dim">about your opening.</span>',
    lead: 'I am looking for a junior role in automation, data or AI, remote or hybrid in Greater São Paulo.',
    copy: 'Copy', copied: 'Copied',
  },
  foot: 'Built with HTML, CSS and JavaScript. English version translated from Portuguese.', top: 'Back to top',
  days: ['MON', 'TUE', 'WED', 'THU', 'FRI'], agenda: 'schedule · today', tests: '61 tests passed',
  artT: 'Illustration: weekly schedule with free, busy and one booked slot, protected by an RLS and 2FA shield.',
  artA: 'Illustration: catalogue product cards, a product form panel and a quote request bubble.',
  panel: 'panel', save: 'save', quote: 'quote?',
};


// ---------- exemplo de código (nomes fictícios, sem dados da empresa) ----------
// código lido direto do repositório público, para o site nunca mostrar algo diferente dele
// Os trechos de código do site vêm de github.com/Kauan1005/automacao-cobranca (cópia em tools/amostras).
const REPO = process.env.AUTOMACAO_COBRANCA_DIR || path.join(__dirname, 'amostras');
const CODE_FILES = [
  ['sql/trava_envio.sql', 'sql'],
  ['cobranca/documentos.py', 'py'],
];
function hl(code, lang) {
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const KW = lang === 'sql'
    ? /\b(DECLARE|BEGIN|TRANSACTION|COMMIT|INSERT|INTO|SELECT|FROM|WHERE|EXISTS|AND|AS|JOIN|ON|DELETE|CAST|CONCAT|DATEADD|SYSDATETIME|GETDATE|date|int)\b/g
    : /\b(from|import|def|return|if|not|and|or|in|None|str|int|bool|list|tuple)\b/g;
  const re = lang === 'sql'
    ? /(--[^\n]*|\/\*[\s\S]*?\*\/)|('[^']*')/g
    : /(#[^\n]*|"""[\s\S]*?""")|("[^"\n]*"|'[^'\n]*')/g;
  let out = '', last = 0, m;
  const plain = (t) => esc(t).replace(KW, '<span class="t-s">$1</span>');
  while ((m = re.exec(code))) {
    out += plain(code.slice(last, m.index));
    out += m[1] ? `<span class="t-c">${esc(m[1])}</span>` : `<span class="t-k">${esc(m[2])}</span>`;
    last = re.lastIndex;
  }
  return out + plain(code.slice(last));
}
function codeBlock(c) {
  const term = (title, body) => `<div class="term code c-6"><div class="term__bar"><span class="term__dots" aria-hidden="true"><i></i><i></i><i></i></span>${title}</div><pre class="term__body" tabindex="0"><code>${body}</code></pre></div>`;
  const files = CODE_FILES.map(([f, lang]) => term(f, hl(fs.readFileSync(path.join(REPO, f), 'utf8').replace(/\r\n/g, '\n').trimEnd(), lang))).join('');
  return `<div class="code-wrap">
      <p class="code-head"><span class="label">${c.code.label}</span> <span>${c.code.note}</span> <a class="code-link" href="https://github.com/Kauan1005/automacao-cobranca" target="_blank" rel="noopener noreferrer">${c.code.repo} ↗</a></p>
      <div class="grid">${files}</div>
    </div>`;
}

// ---------- página ----------
function project(c, P, id, art, links) {
  const facet = (k, body, wide = false) => `<div class="facet${wide ? ' facet--wide' : ''}"><span class="label">${c.f[k]}</span>${body}</div>`;
  const problem = P.problem ? `<p>${P.problem}</p>` : '';
  return `<section class="section" id="${id}" aria-labelledby="${id}-h">
  <div class="wrap">
    ${id === 'projetos' ? `<p class="eyebrow project__eyebrow" style="margin-bottom:16px"><b>$</b> ${c.projHead.eyebrow}</p>` : ''}
    <article class="card project">
      <div class="project__info">
        <div style="display:grid;gap:12px">
          <span class="eyebrow"><b>${P.n}</b> · ${P.kind}</span>
          <h2 class="h2" id="${id}-h">${P.name}</h2>
          <p class="project__what">${P.what}</p>
        </div>
        <div class="facets">
          ${problem ? facet('problem', problem) : ''}
          ${facet('solution', `<p>${P.solution}</p>`)}
          ${facet('feats', `<ul class="feats">${P.feats.map((x) => `<li>${x}</li>`).join('')}</ul>`, true)}
          ${facet('role', `<p>${P.role}</p>`)}
          ${facet('result', `<p>${P.result}</p>`)}
        </div>
        <div class="project__foot">
          <ul class="chips" aria-label="${c.f.stack}">${P.stack.map(([n, i]) => chip(n, i)).join('')}</ul>
          <div class="btn-row">${links}</div>
        </div>
      </div>
      <div class="project__art">${art}</div>
    </article>
  </div>
</section>`;
}

function page(c) {
  const mail = `mailto:${EMAIL}?subject=${encodeURIComponent(c.subject)}`;
  const isPt = c.lang !== 'en';
  const langSwitch = `<div class="lang" role="group" aria-label="${c.langLabel}">${isPt
    ? '<span aria-current="page" lang="pt-BR">PT</span><a href="en.html" hreflang="en" lang="en">EN</a>'
    : '<a href="index.html" hreflang="pt-BR" lang="pt-BR">PT</a><span aria-current="page" lang="en">EN</span>'}</div>`;
  const tLinks = `<a class="btn btn--ghost" href="${T_SITE}" ${ext}>${c.t.site}${ic('ext')}</a><a class="btn btn--ghost" href="${T_CODE}" ${ext}>${c.t.code}${ic('gh')}</a>`;
  const aLinks = `<a class="btn btn--ghost" href="${A_SITE}" ${ext}>${c.a.site}${ic('ext')}</a><a class="btn btn--ghost" href="https://github.com/Kauan1005/acrilife" ${ext}>${c.t.code}${ic('gh')}</a>`;
  const json = c.hero.json.map(([k, v], i) => `<p>  <span class="t-s">"${k}"</span>: <span class="t-w">${v.replace(/"([^"]*)"/g, '<span class="t-k">"$1"</span>')}</span>${i < c.hero.json.length - 1 ? ',' : ''}</p>`).join('');

  return `<!doctype html>
<html lang="${c.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${c.title}</title>
<meta name="description" content="${c.desc}">
<meta name="theme-color" content="#08090a">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="website">
<meta property="og:title" content="${c.title}">
<meta property="og:description" content="${c.desc}">
<link rel="canonical" href="${BASE}/${c.file === 'index.html' ? '' : c.file}">
<link rel="alternate" hreflang="pt-BR" href="${BASE}/">
<link rel="alternate" hreflang="en" href="${BASE}/en.html">
<link rel="alternate" hreflang="x-default" href="${BASE}/">
<meta property="og:url" content="${BASE}/${c.file === 'index.html' ? '' : c.file}">
<meta property="og:locale" content="${c.lang === 'en' ? 'en_US' : 'pt_BR'}">
<meta property="og:site_name" content="Kauan Ribeiro Almeida">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"></noscript>
<style>html.lenis,html.lenis body {  height: auto;}.lenis:not(.lenis-autoToggle).lenis-stopped {  overflow: clip;}.lenis [data-lenis-prevent],.lenis [data-lenis-prevent-wheel],.lenis [data-lenis-prevent-touch],.lenis [data-lenis-prevent-vertical],.lenis [data-lenis-prevent-horizontal] {  overscroll-behavior: contain;}.lenis.lenis-smooth iframe {  pointer-events: none;}.lenis.lenis-autoToggle {  transition-property: overflow;  transition-duration: 1ms;  transition-behavior: allow-discrete;}</style>
<link rel="stylesheet" href="assets/v2/site.css">
<script>(function(){var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('m-on');setTimeout(function(){if(!window.__motionReady)d.classList.remove('m-on')},2500)})()</script>
<style>.sv-l{font:500 12px 'JetBrains Mono',monospace;fill:#858c93;letter-spacing:.04em}.sv-m{font:500 13px 'JetBrains Mono',monospace;fill:#e8eaed}.sv-b{font:600 17px Geist,system-ui,sans-serif;fill:#e8eaed}</style>
</head>
<body>
<a class="skip" href="#main">${c.skip}</a>
<header class="nav">
  <div class="nav__bar">
    <a class="nav__logo" href="#top" aria-label="Kauan Almeida"><b>~/</b>kauan</a>
    <nav class="nav__links" aria-label="${c.mainNav}">${c.nav.map(([id, w]) => `<a href="#${id}">${w}</a>`).join('')}</nav>
    ${langSwitch}
    <button class="nav__cat" type="button" data-cat-toggle hidden aria-pressed="false" aria-label="${c.catPause}" title="${c.catPause}">${ic('cat')}</button>
    <button class="nav__menu" type="button" aria-expanded="false" aria-controls="sheet" aria-label="${c.menu}" data-open="${c.menu}" data-close="${c.menuClose}">${ic('menu')}</button>
  </div>
</header>
<div class="sheet" id="sheet" hidden>
  ${c.nav.map(([id, w]) => `<a href="#${id}">${w}</a>`).join('')}
  <a class="btn btn--primary" href="${c.cvFile}" download>${ic('down')}${c.cv}</a>
  <button class="btn btn--ghost" type="button" data-cat-toggle hidden aria-pressed="false">${ic('cat')}<span data-cat-label>${c.catPause}</span></button>
</div>

<main id="main">
<section class="hero" id="top" aria-labelledby="hero-h">
  <div class="wrap grid hero__grid">
    <div class="hero__text c-7">
      <span class="chip" data-h style="width:max-content;max-width:100%"><span class="dot" aria-hidden="true"></span>${c.hero.status}</span>
      <p class="hero__type" aria-hidden="true"><b>$</b> whoami<span class="cursor"></span></p>
      <h1 class="display" id="hero-h">${c.hero.h1}</h1>
      <p class="lead" data-h>${c.hero.lead}</p>
      <div class="btn-row" data-h>
        <a class="btn btn--primary" href="${mail}">${c.mail}${ic('arrow')}</a>
        <a class="btn btn--ghost" href="${c.cvFile}" download>${ic('down')}${c.cv}</a>
        <a class="btn btn--icon" href="${GITHUB}" ${ext} aria-label="GitHub">${ic('gh')}</a>
        <a class="btn btn--icon" href="${LINKEDIN}" ${ext} aria-label="LinkedIn">${ic('in')}</a>
      </div>
    </div>
    <div class="c-5 hero__bento">
      <div class="term">
        <div class="term__bar"><span class="term__dots" aria-hidden="true"><i></i><i></i><i></i></span>${c.hero.file}</div>
        <div class="term__body"><p><span class="t-p">$</span> <span class="t-w">cat ${c.hero.file}</span></p><p>{</p>${json}<p>}</p></div>
      </div>
      <div class="card mini"><span class="label">${c.hero.nowL}</span><strong>${c.hero.now}</strong></div>
      <div class="card mini"><span class="label">${c.hero.doneL}</span><strong>${c.hero.done}</strong></div>
    </div>
  </div>
</section>

${project(c, c.t, 'projetos', artTonsorium(c), tLinks)}
${project(c, c.a, 'acrilife', artAcrilife(c), aLinks)}

<section class="section" id="automacao" aria-labelledby="automacao-h">
  <div class="wrap">
    <header class="section__head"><span class="eyebrow"><b>$</b> ${c.k.eyebrow}</span><h2 class="h2" id="automacao-h">${c.k.h2}</h2><p class="lead">${c.k.lead}</p></header>
    <div class="card pipe-card"><div class="pipe-h">${artPipe(c, false)}</div><div class="pipe-v">${artPipe(c, true)}</div></div>
    <ul class="grid facts">${c.k.facts.map(([t, d]) => `<li class="card fact c-3 c-t6"><strong>${t}</strong><p>${d}</p></li>`).join('')}</ul>
    ${codeBlock(c)}
  </div>
</section>

<section class="section" id="habilidades" aria-labelledby="habilidades-h">
  <div class="wrap">
    <header class="section__head"><span class="eyebrow"><b>$</b> ${c.s.eyebrow}</span><h2 class="h2" id="habilidades-h">${c.s.h2}</h2></header>
    <div class="grid">
      ${(() => { const [i0, t0, d0, l0] = c.s.cards[0]; return `<article class="card skill c-5"><div class="skill__head"><span class="skill__ic">${ic(i0)}</span><div><h3 class="h3">${t0}</h3><p>${d0}</p></div></div><ul class="chips">${l0.map(([n, id, inv]) => chip(n, id, inv)).join('')}</ul></article>`; })()}
      <div class="term c-7">
        <div class="term__bar"><span class="term__dots" aria-hidden="true"><i></i><i></i><i></i></span>${c.s.termTitle} · bash</div>
        <div class="term__body"><p><span class="t-p">$</span> <span class="t-w">npm run test:db</span></p>${c.s.tests.map((t) => `<p><span class="t-p">✓</span> ${t} <span class="t-c">· RLS</span></p>`).join('')}<p><span class="t-w">${c.s.sum}</span></p></div>
      </div>
      ${c.s.cards.slice(1).map(([i0, t0, d0, l0]) => `<article class="card skill c-4"><div class="skill__head"><span class="skill__ic">${ic(i0)}</span><div><h3 class="h3">${t0}</h3><p>${d0}</p></div></div><ul class="chips">${l0.map(([n, id, inv]) => chip(n, id, inv)).join('')}</ul></article>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section" id="github" aria-labelledby="github-h">
  <div class="wrap">
    <header class="section__head"><span class="eyebrow"><b>$</b> ${c.gh.eyebrow}</span><h2 class="h2" id="github-h">${c.gh.h2}</h2></header>
    <ul class="grid repos">${c.gh.items.map(([n, d, tags, extra]) => `<li class="card repo ${c.gh.items.length === 4 ? 'c-6' : 'c-4'}"><div class="repo__head">${ic('gh')}<h3 class="h3">${n}</h3></div><p>${d}</p><ul class="chips">${tags.map((t) => `<li class="chip">${t}</li>`).join('')}</ul><div class="btn-row"><a class="btn btn--ghost" href="https://github.com/Kauan1005/${n}" ${ext}>${c.gh.open}${ic('ext')}</a>${extra ? `<a class="btn btn--ghost" href="${extra[1]}" ${ext}>${extra[0]}${ic('ext')}</a>` : ''}</div></li>`).join('')}</ul>
  </div>
</section>

<section class="section" id="experiencia" aria-labelledby="experiencia-h">
  <div class="wrap grid exp">
    <div class="exp__aside c-5">
      <span class="eyebrow"><b>$</b> ${c.e.eyebrow}</span>
      <h2 class="h2" id="experiencia-h">${c.e.h2}</h2>
      <p class="lead">${c.e.lead}</p>
      <div class="btn-row"><a class="btn btn--ghost" href="${c.cvFile}" download>${ic('down')}${c.cv}</a></div>
    </div>
    <ol class="timeline c-7">
      ${c.e.items.map(([w, t, d, now]) => `<li class="tl-item${now ? ' is-now' : ''}"><span class="when">${w}</span><h3>${t}</h3><p>${d}</p></li>`).join('\n      ')}
    </ol>
  </div>
</section>

<section class="section" id="contato" aria-labelledby="contato-h">
  <div class="wrap contact">
    <span class="eyebrow"><b>$</b> ${c.c.eyebrow}</span>
    <h2 class="display" id="contato-h">${c.c.h2}</h2>
    <p class="lead">${c.c.lead}</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="${mail}">${c.mail}${ic('arrow')}</a>
      <a class="btn btn--ghost" href="${c.cvFile}" download>${ic('down')}${c.cv}</a>
      <a class="btn btn--ghost" href="${c.cvOther}" download>${ic('down')}${c.cvOtherLabel}</a>
    </div>
    <div class="btn-row">
      <div class="email"><span>${EMAIL}</span><button class="btn btn--ghost" type="button" data-copy="${EMAIL}" data-done="${c.c.copied}">${ic('copy')}<span>${c.c.copy}</span></button></div>
      <a class="btn btn--icon" href="${GITHUB}" ${ext} aria-label="GitHub">${ic('gh')}</a>
      <a class="btn btn--icon" href="${LINKEDIN}" ${ext} aria-label="LinkedIn">${ic('in')}</a>
    </div>
  </div>
</section>
</main>

<footer class="footer">
  <div class="wrap">
    <p><span style="color:var(--accent)">~/</span>kauan · © 2026 Kauan Ribeiro Almeida · ${c.foot}</p>
    <a class="btn btn--ghost" href="#top">${c.top}</a>
  </div>
</footer>
<script src="assets/v2/site.js" defer></script>
<script src="assets/v2/vendor/gsap.min.js" defer></script>
<script src="assets/v2/vendor/ScrollTrigger.min.js" defer></script>
<script src="assets/v2/vendor/lenis.min.js" defer></script>
<script src="assets/v2/motion.js" defer></script>
<script src="assets/v2/term.js" defer></script>
<script src="assets/v2/bot.js" defer></script>
</body>
</html>
`;
}


function markReveal(html) {
  const i = html.indexOf('<section class="section"');
  const j = html.indexOf('</main>');
  let body = html.slice(i, j);
  body = body
    .replace(/<(span|p) class="eyebrow( project__eyebrow)?"/g, '<$1 data-r class="eyebrow$2"')
    .replace(/<h2 class="(h2|display)" id="(automacao|habilidades|github|experiencia|contato)-h"/g, '<h2 data-r class="$1" id="$2-h"')
    .replace(/<p class="lead">/g, '<p data-r class="lead">')
    .replace(/<article class="card project">/g, '<article data-r class="card project">')
    .replace(/<div style="display:grid;gap:12px">/g, '<div data-ri style="display:grid;gap:12px">')
    .replace(/<div class="facet( facet--wide)?">/g, '<div data-ri class="facet$1">')
    .replace(/<div class="project__(foot|art)">/g, '<div data-ri class="project__$1">')
    .replace(/<div class="card pipe-card">/g, '<div data-r class="card pipe-card">')
    .replace(/<li class="card fact/g, '<li data-r class="card fact')
    .replace(/<article class="card skill/g, '<article data-r class="card skill')
    .replace(/<div class="term c-7">/g, '<div data-r data-term-run class="term c-7">')
    .replace(/<li class="tl-item/g, '<li data-r class="tl-item')
    .replace(/<li class="card repo/g, '<li data-r class="card repo')
    .replace(/<div class="code-wrap">/g, '<div data-r class="code-wrap">');
  const k = body.indexOf('id="experiencia"');
  body = body.slice(0, k) + body.slice(k).replace(/<div class="btn-row">/g, '<div data-r class="btn-row">');
  return html.slice(0, i) + body + html.slice(j);
}

fs.writeFileSync(path.join(SITE, 'favicon.svg'),
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#08090a"/><path d="M8 11l6 5-6 5" fill="none" stroke="#4ade80" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><rect x="16" y="20" width="9" height="3" rx="1.5" fill="#f5b454"/></svg>');
fs.writeFileSync(path.join(SITE, 'robots.txt'), `User-agent: *
Allow: /
Sitemap: ${BASE}/sitemap.xml
`);
fs.writeFileSync(path.join(SITE, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${['', 'en.html'].map((u) => `  <url><loc>${BASE}/${u}</loc><xhtml:link rel="alternate" hreflang="pt-BR" href="${BASE}/"/><xhtml:link rel="alternate" hreflang="en" href="${BASE}/en.html"/></url>`).join('\n')}
</urlset>
`);
for (const c of [PT, EN]) {
  fs.writeFileSync(path.join(SITE, c.file), markReveal(page(c)));
  console.log('ok', c.file);
}
