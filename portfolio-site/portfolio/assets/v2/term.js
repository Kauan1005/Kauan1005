// Portfólio v2 · terminal interativo do hero.
// Um campo de texto de verdade (abre o teclado no celular). Comandos: help, ls, whoami, clear, bot, cat, lua, dormir, miau.
// O gato só existe depois do comando "cat": ele é carregado sob demanda (e lembrado nesta aba).
(() => {
  const ht = document.querySelector('.hero__bento .term');
  if (!ht) return;
  const isEn = document.documentElement.lang === 'en';
  const body = ht.querySelector('.term__body');
  const L = isEn
    ? { aria: 'Terminal command', hint: 'type help', nf: 'command not found: ', help: 'commands: ls, whoami, bot, cat, lua, sleep, meow, clear', ls: 'projects/  automation/  cv.pdf', cmds: 'commands: bot · cat · lua · sleep · meow', who: 'kauan · planning assistant, looking for a junior dev role', catIn: '=^..^=  Banguela jumped into the terminal', catHi: '=^..^=  Banguela is here (top bar)', catBusy: 'Banguela is busy right now, try again', noCat: 'Banguela is not here yet: type cat', luaIn: 'U・ᴥ・U  calling Lua... woof!', luaOn: 'Lua is already here!', luaMob: 'Lua only visits on a computer screen', sleep: 'zzz  Banguela went to his gaming chair', meow: '=^.^=  meow!', bot: 'bot: running a scan of this section' }
    : { aria: 'Comando do terminal', hint: 'digite help', nf: 'comando não encontrado: ', help: 'comandos: ls, whoami, bot, cat, lua, dormir, miau, clear', ls: 'projetos/  automacao/  curriculo.pdf', cmds: 'comandos: bot · cat · lua · dormir · miau', who: 'kauan · assistente de planejamento, em busca de vaga júnior', catIn: '=^..^=  Banguela entrou no terminal', catHi: '=^..^=  Banguela chegou (barra do topo)', catBusy: 'Banguela está ocupado agora, tente de novo', noCat: 'o Banguela ainda não chegou: digite cat', luaIn: 'U・ᴥ・U  chamando a Lua... au!', luaOn: 'A Lua já está aqui!', luaMob: 'a Lua só aparece na tela do computador', sleep: 'zzz  Banguela foi para a cadeira gamer', meow: '=^.^=  miau!', bot: 'bot: escaneando esta seção' };

  // linha de comando sempre visível no fim do terminal
  const line = document.createElement('p');
  line.className = 'tm-line';
  line.innerHTML = `<span class="t-p">$</span> <input class="tm-in" type="text" maxlength="32" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go" placeholder="${L.hint}" aria-label="${L.aria}">`;
  body.append(line);
  const input = line.querySelector('input');
  ht.addEventListener('click', (e) => { if (!e.target.closest('input')) input.focus({ preventScroll: true }); });
  ht.classList.add('tm-live');

  let extra = [];
  const out = (txt, cls = '') => {
    const p = document.createElement('p');
    p.className = 'kc-out ' + cls; p.textContent = txt;
    body.insertBefore(p, line); extra.push(p);
    while (extra.length > 4) extra.shift().remove();
  };
  window.__term = { out, el: ht };

  // ---------- gato sob demanda ----------
  let catLoading = null;
  const loadCat = () => {
    if (window.__kc) return Promise.resolve(window.__kc);
    if (catLoading) return catLoading;
    catLoading = new Promise((res) => {
      const sc = document.createElement('script');
      sc.src = 'assets/v2/cat.js';
      sc.onload = () => { const t0 = Date.now(); const tick = () => (window.__kc || Date.now() - t0 > 3000 ? res(window.__kc) : setTimeout(tick, 50)); tick(); };
      document.body.append(sc);
    });
    try { sessionStorage.setItem('kc-on', '1'); } catch {}
    dispatchEvent(new CustomEvent('kc:on'));
    return catLoading;
  };
  // se o visitante já chamou o gato nesta aba (ex.: trocou de idioma), ele volta
  let wasOn = false; try { wasOn = sessionStorage.getItem('kc-on') === '1'; } catch {}
  if (wasOn) addEventListener('load', () => setTimeout(loadCat, 600));

  const catCmd = async (fn) => {
    const kc = window.__kc;
    if (!kc) { out(L.noCat, 'kc-err'); return; }
    fn(kc);
  };

  const run = async (raw) => {
    const c = raw.trim(); if (!c) return;
    out('$ ' + c, 'kc-echo');
    const low = c.toLowerCase();
    if (low === 'help' || low === 'ajuda') out(L.help);
    else if (low === 'ls') { out(L.ls); out(L.cmds, 'kc-ok'); }
    else if (low === 'whoami') out(L.who);
    else if (low === 'clear') { extra.forEach((x) => x.remove()); extra = []; }
    else if (low === 'bot' || low === 'robo' || low === 'robô') { out(L.bot, 'kc-ok'); dispatchEvent(new CustomEvent('rb:scan')); }
    else if (['cat', 'cat banguela', 'cat banguela.cat'].includes(low)) {
      const first = !window.__kc;
      const kc = await loadCat();
      if (!kc) return;
      if (kc.mobile) { out(L.catHi, 'kc-ok'); return; }
      if (!kc.cmd.can()) { out(L.catBusy, 'kc-err'); return; }
      out(L.catIn, 'kc-ok');
      setTimeout(() => kc.cmd.dive(), first ? 250 : 0);
    }
    else if (low === 'lua') catCmd((kc) => {
      if (kc.mobile) out(L.luaMob, 'kc-err');
      else if (kc.cmd.luaOn) out(L.luaOn, 'kc-ok');
      else if (kc.cmd.can()) { out(L.luaIn, 'kc-ok'); kc.cmd.lua(); }
      else out(L.catBusy, 'kc-err');
    });
    else if (['dormir', 'sleep', 'zzz'].includes(low)) catCmd((kc) => {
      if (kc.cmd.can()) { out(L.sleep, 'kc-ok'); kc.cmd.sleep(); } else out(L.catBusy, 'kc-err');
    });
    else if (low === 'miau' || low === 'meow') out(L.meow, 'kc-ok');
    else out(L.nf + c, 'kc-err');
  };
  input.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') { e.preventDefault(); const v = input.value; input.value = ''; run(v); }
    else if (e.key === 'Escape') input.blur();
  });
  window.__term.run = run;
})();
