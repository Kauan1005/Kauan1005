// Conteúdo do currículo (PT e EN). Fonte única para o .docx e o PDF.
// Números: economia = média dos relatórios diários de 26/10 a 10/11/2026 (11 dias de envio).

const contact = {
  name: 'Kauan Ribeiro Almeida',
  city: 'Osasco, SP',
  phone: '(11) 97852-3609',
  email: 'kauanribalmeida@gmail.com',
  linkedin: 'linkedin.com/in/kauan-ribeiro',
  github: 'github.com/Kauan1005',
  portfolio: 'ribeiroportfolio.netlify.app',
};

const pt = {
  file: 'Kauan-Ribeiro-Almeida-CV-PT',
  title: 'Automação de Dados e Sistemas Web | Busco vaga de Desenvolvedor Júnior',
  portfolioLabel: 'ribeiroportfolio.netlify.app',
  h: { summary: 'Resumo', exp: 'Experiência', projects: 'Projetos', skills: 'Habilidades', edu: 'Formação', lang: 'Idiomas' },
  summary:
    'Assistente de Planejamento formado em Análise e Desenvolvimento de Sistemas, em busca da primeira vaga como desenvolvedor júnior. ' +
    'Automatizei com KNIME, SQL Server e Python o envio diário de campanhas de cobrança por API, com economia média de cerca de R$ 2 mil por dia, e entreguei sozinho dois sistemas web (React e Supabase) com segurança no banco e testes.',
  exp: [
    {
      role: 'Assistente de Planejamento', org: 'ML Gomes', period: '09/2026 – atual',
      bullets: [
        'Automatizei o preparo diário das campanhas de cobrança com 5 fluxos KNIME (~1.700 nós): extração em SQL Server, higienização de CPF/CNPJ e telefones, deduplicação e segmentação por atraso.',
        'Integrei o envio de campanhas de WhatsApp e RCS por APIs REST (campanha e contatos em JSON), sem upload manual.',
        'Criei uma trava em T-SQL que bloqueia, na hora do envio, contatos já acionados e registra o motivo. Economia média de cerca de R$ 2 mil por dia (R$ 22,5 mil em 11 dias de envio).',
        'Desenvolvi em Python um relatório diário em Excel, por canal, com gasto, economia e indicadores.',
        'Integrei a validação de telefones com fornecedores via SFTP, em lotes de até 20 mil, com conferência automática.',
      ],
    },
    {
      role: 'Operador de Atendimento', org: 'ML Gomes', period: '09/2024 – 09/2026',
      bullets: [
        'Atendi e negociei com clientes e registrei dados em tempo real, base do conhecimento de cobrança que uso nas automações.',
        'Em paralelo, desenvolvi dois sistemas web (Acrilife e Tonsorium), descritos em Projetos.',
      ],
    },
    {
      role: 'Jovem Aprendiz', org: 'Siry Global', period: '07/2024 – 09/2024',
      bullets: [
        'Controlei o estoque de EPIs e extintores em Excel e organizei relatórios periódicos de conformidade e indicadores.',
      ],
    },
  ],
  projects: [
    {
      name: 'Tonsorium', what: 'agendamento e gestão para barbearia', tag: 'Sistema web · 2026',
      links: ['tonsorium.netlify.app', 'github.com/Kauan1005/tonsorium-admin'],
      stack: 'React, TypeScript, Supabase, GitHub Actions',
      bullets: [
        'Desenvolvi sozinho o site com agendamento em tempo real e o painel (3 perfis, 18 módulos editáveis); entregue ao cliente.',
        'Modelei 21 tabelas com 26 políticas RLS, 2FA e restrição contra horários sobrepostos, com 61 testes automatizados.',
        'Backup diário (GitHub Actions) e sincronização das avaliações do Google (pg_cron), com retenção de 12 meses (LGPD).',
      ],
    },
    {
      name: 'Acrilife', what: 'catálogo online e painel administrativo', tag: 'Sistema web · 2025',
      links: ['acrilife.com.br', 'github.com/Kauan1005/acrilife'],
      stack: 'JavaScript, Supabase (Auth, Storage, RLS), Netlify',
      bullets: [
        'Desenvolvi sozinho o catálogo (busca, filtros, orçamento no WhatsApp) e o painel para os donos cadastrarem produtos.',
        'Comprimo imagens no navegador, restrinjo a escrita a admins com RLS e bloqueio o Analytics até o aceite de cookies.',
      ],
    },
    {
      name: 'automacao-cobranca', what: 'pipeline de cobrança em Python, com dados fictícios', tag: 'GitHub · 2026',
      links: ['github.com/Kauan1005/automacao-cobranca'],
      stack: 'Python, SQL (T-SQL), openpyxl, API do Claude, GitHub Actions',
      bullets: [
        'Reescrevi em Python a lógica dos meus fluxos (CPF/CNPJ, segmentação, trava, disparo, relatório), com 18 testes e CI.',
        'Classifico respostas de clientes com a API do Claude (JSON validado por esquema), com regras de reserva sem credencial.',
      ],
    },
    {
      name: 'Arca (Gerenciador de Senhas)', what: 'senhas e projetos cifrados', tag: 'GitHub · 2026',
      links: ['github.com/Kauan1005/Gerenciador-de-Senhas'],
      stack: 'JavaScript, Web Crypto API, Supabase (Auth, PostgreSQL, RLS), Playwright',
      bullets: [
        'Cifra no navegador (AES-256-GCM); login derivado, chave de recuperação, 14 achados de segurança corrigidos e testados.',
      ],
    },
    {
      name: 'Apogeu', what: 'finanças pessoais com Open Finance e app Android', tag: 'GitHub · 2026',
      links: ['github.com/Kauan1005/apogeu-app'],
      stack: 'Next.js, TypeScript, Supabase, Android (TWA)',
      bullets: [
        'Importa transações via Open Finance, categoriza e projeta o caixa; PWA e app Android; migrações com RLS, 14 suítes de testes.',
      ],
    },
  ],
  skills: [
    ['Linguagens', 'Python, SQL (T-SQL, PostgreSQL), JavaScript, TypeScript, HTML, CSS'],
    ['Automação e dados', 'KNIME, APIs REST/JSON, ETL, SFTP, openpyxl, Excel'],
    ['Back-end e banco', 'Supabase (Auth, RLS, Storage, Edge Functions), PostgreSQL, SQL Server'],
    ['Front-end', 'React, Next.js, Vite, design responsivo, acessibilidade'],
    ['Ferramentas', 'Git, GitHub Actions, Docker, Nginx, Netlify, testes automatizados, API do Claude e Claude Code'],
  ],
  edu: [['Tecnólogo em Análise e Desenvolvimento de Sistemas', 'UNIFIEO', 'Concluído em 06/2026']],
  lang: 'Português (nativo) · Inglês (intermediário, leitura técnica)',
};

const en = {
  file: 'Kauan-Ribeiro-Almeida-CV-EN',
  title: 'Data Automation and Web Systems | Seeking a Junior Developer role',
  portfolioLabel: 'ribeiroportfolio.netlify.app',
  h: { summary: 'Summary', exp: 'Experience', projects: 'Projects', skills: 'Skills', edu: 'Education', lang: 'Languages' },
  summary:
    'Planning Assistant with a degree in Systems Analysis and Development, looking for a first role as a junior developer. ' +
    'Automated daily debt-collection campaigns by API with KNIME, SQL Server and Python, saving about R$ 2k per day on average, and delivered two web systems on my own (React, TypeScript and Supabase) with database-level security and automated tests.',
  exp: [
    {
      role: 'Planning Assistant', org: 'ML Gomes', period: '09/2026 – present',
      bullets: [
        'Automated the daily preparation of collection campaigns for a portfolio with 5 KNIME workflows (~1,700 nodes): SQL Server extraction, ID and phone cleansing, deduplication and segmentation by days past due.',
        'Integrated WhatsApp and RCS campaign delivery through REST APIs (campaign and JSON contacts), with no manual upload.',
        'Built a T-SQL guard that, at send time, blocks contacts already reached within the minimum interval and logs the reason for each block. Average savings of about R$ 2k per day (R$ 22.5k over 11 sending days).',
        'Developed a daily Excel report in Python, per channel, with cost, savings and KPIs.',
        'Integrated phone validation with vendors over SFTP, in batches of up to 20,000, with automatic checks.',
      ],
    },
    {
      role: 'Customer Service Agent', org: 'ML Gomes', period: '09/2024 – 09/2026',
      bullets: [
        'Handled and negotiated with customers and recorded data in real time, the base of the collection knowledge I use in my automations.',
        'In parallel, built and launched two web systems (Acrilife and Tonsorium), described under Projects.',
      ],
    },
    {
      role: 'Apprentice', org: 'Siry Global', period: '07/2024 – 09/2024',
      bullets: [
        'Tracked PPE and fire-extinguisher inventory in Excel and organised periodic compliance and KPI reports.',
      ],
    },
  ],
  projects: [
    {
      name: 'Tonsorium', what: 'booking and management for a barbershop', tag: 'Web system · 2026',
      links: ['tonsorium.netlify.app', 'github.com/Kauan1005/tonsorium-admin'],
      stack: 'React, TypeScript, Supabase, GitHub Actions',
      bullets: [
        'Built on my own the site with real-time booking and the admin panel (3 roles, 18 no-code modules); delivered to the client, being rolled out.',
        'Designed 21 tables with 26 RLS policies, 2FA and a constraint against overlapping bookings, with 61 automated tests.',
        'Daily backups (GitHub Actions) and Google reviews sync (pg_cron), with 12-month data retention (LGPD).',
      ],
    },
    {
      name: 'Acrilife', what: 'online catalogue and admin panel', tag: 'Web system · 2025',
      links: ['acrilife.com.br', 'github.com/Kauan1005/acrilife'],
      stack: 'JavaScript, Supabase (Auth, Storage, RLS), Netlify',
      bullets: [
        'Built on my own the catalogue (search, filters, WhatsApp quotes) and the panel where the owners add products and photos without code.',
        'Compress images in the browser before upload, restrict writes to admins with RLS and block analytics until cookie consent (LGPD).',
      ],
    },
    {
      name: 'automacao-cobranca', what: 'debt-collection pipeline in Python, with made-up data', tag: 'GitHub · 2026',
      links: ['github.com/Kauan1005/automacao-cobranca'],
      stack: 'Python, SQL (T-SQL), openpyxl, Claude API, GitHub Actions',
      bullets: [
        'Rewrote my workflow logic in Python (ID checks, segmentation, resend guard, delivery, report), with 18 tests and CI.',
        'Classify customer replies with the Claude API (schema-validated JSON), with fallback rules without a credential.',
      ],
    },
    {
      name: 'Arca (Password Manager)', what: 'passwords and projects, encrypted', tag: 'GitHub · 2026',
      links: ['github.com/Kauan1005/Gerenciador-de-Senhas'],
      stack: 'JavaScript, Web Crypto API, Supabase (Auth, PostgreSQL, RLS), Playwright',
      bullets: [
        'In-browser encryption (AES-256-GCM); derived login, recovery key, 14 security findings fixed and tested.',
      ],
    },
    {
      name: 'Apogeu', what: 'personal finance with Open Finance and an Android app', tag: 'GitHub · 2026',
      links: ['github.com/Kauan1005/apogeu-app'],
      stack: 'Next.js, TypeScript, Supabase, Android (TWA)',
      bullets: [
        'Open Finance import, categorization and cash-flow projection; PWA and Android app; RLS migrations, 14 test suites.',
      ],
    },
  ],
  skills: [
    ['Languages', 'Python, SQL (T-SQL, PostgreSQL), JavaScript, TypeScript, HTML, CSS'],
    ['Automation & data', 'KNIME, REST/JSON APIs, ETL, SFTP, openpyxl, Excel'],
    ['Back end & databases', 'Supabase (Auth, RLS, Storage, Edge Functions), PostgreSQL, SQL Server'],
    ['Front end', 'React, Next.js, Vite, responsive design, accessibility'],
    ['Tools', 'Git, GitHub Actions, Docker, Nginx, Netlify, automated testing, Claude API and Claude Code'],
  ],
  edu: [['Associate degree in Systems Analysis and Development', 'UNIFIEO', 'Completed 06/2026']],
  lang: 'Portuguese (native) · English (intermediate, technical reading)',
};

module.exports = { contact, pt, en };
