# Portfólio · Kauan Ribeiro Almeida

> Esta pasta (`portfolio-site/`) do repositório [Kauan1005](https://github.com/Kauan1005/Kauan1005) guarda o código do meu portfólio. O README do perfil está na raiz.

Meu portfólio e currículo, em português e inglês: **[ribeiroportfolio.netlify.app](https://ribeiroportfolio.netlify.app)**.

Sou Assistente de Planejamento, formado em Análise e Desenvolvimento de Sistemas, e busco minha primeira vaga como desenvolvedor júnior (automação de dados e sistemas web). O site mostra os projetos com problema, solução e resultado, o código real de um deles e um terminal interativo para quem quiser explorar.

## O que tem no site

- **Projetos:** Tonsorium e Acrilife (sistemas web entregues) e, em "Mais no GitHub", Apogeu, automacao-cobranca, Arca e quicklink-devops.
- **Automação de cobrança:** pipeline animado, a economia média por dia e trechos do código do [automacao-cobranca](https://github.com/Kauan1005/automacao-cobranca).
- **Terminal no topo:** `help`, `ls`, `whoami`, `bot`, `cat`, `lua`, `dormir`, `miau`, `clear`.
- **Robô de testes:** aparece enquanto a página rola, "escaneia" os projetos, roda o pipeline e aponta o contato.
- **Gato Banguela e cachorrinha Lua:** só aparecem depois do comando `cat`.
- **Currículo** em 1 página, PT e EN, em PDF e DOCX.

## Como é feito

| Parte | Tecnologia |
|---|---|
| Páginas | HTML e CSS gerados por um script Node (`tools/build-v2.js`), sem framework |
| Animação | GSAP com ScrollTrigger e Lenis; só `transform` e `opacity`; respeita "reduzir movimento" |
| Gato, Lua e robô | SVG desenhado à mão e animado com GSAP, sem imagens |
| Fontes | Geist e JetBrains Mono |
| Currículo | biblioteca `docx` para o DOCX; o PDF sai do Word (`tools/to-pdf.ps1`) |
| Testes | Playwright, em 375, 768 e 1440 px |
| Hospedagem | Netlify |

Medido com o Lighthouse no site publicado (celular): desempenho entre 91 e 99, acessibilidade 100, boas práticas 100 e SEO 100.

## Estrutura

```
portfolio/     o site pronto para publicar (index.html, en.html, assets/, cv/)
curriculo/     o currículo em DOCX e PDF, PT e EN
tools/
  build-v2.js        gera index.html e en.html (todo o conteúdo, PT e EN, está aqui)
  cv-content.js      o texto do currículo (fonte única)
  build-cv.js        gera os DOCX
  to-pdf.ps1         converte os DOCX em PDF (precisa do Word instalado)
  amostras/          trechos de código reais mostrados no site
  check-*.js         testes no navegador
```

## Gerar e testar

```bash
cd tools
npm install
node build-v2.js                    # gera portfolio/index.html e portfolio/en.html
node build-cv.js ../curriculo       # gera os DOCX do currículo
powershell -File to-pdf.ps1 -Dir ../curriculo   # PDF (Windows com Word)
```

Para os testes, sirva a pasta `portfolio/` em `http://127.0.0.1:5173` (por exemplo `python -m http.server 5173 --bind 127.0.0.1 --directory portfolio`) e rode `node check-final.js`. Eles precisam do Edge ou do Chrome (`BROWSER_PATH=caminho` se não estiver no lugar padrão) e gravam capturas em `capturas/`.

- `check-final.js`: sem rolagem lateral, sem texto escondido, sem sobreposição, sem erro no console e âncoras válidas, em PT e EN.
- `check-bot.js`: robô, terminal e comandos.
- `check-motion.js`: quadros por segundo e movimento reduzido.
- `check-cat2.js`, `check-lua.js`, `check-drag.js`, `check-chair.js`, `check-cmds.js`: comportamentos do gato e da Lua.

## Licenças e créditos

- O código do gerador, do site e dos testes é MIT (veja [LICENSE](LICENSE)).
- Os textos, o currículo e meus dados de contato são meus e **não** estão licenciados para reuso.
- As bibliotecas em `portfolio/assets/v2/vendor/` (GSAP e Lenis) mantêm as licenças originais.

---

Kauan Ribeiro Almeida · [GitHub](https://github.com/Kauan1005) · [LinkedIn](https://www.linkedin.com/in/kauan-ribeiro)
