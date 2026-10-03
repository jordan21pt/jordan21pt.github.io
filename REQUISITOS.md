# Requisitos — Site pessoal / CV (referência: michaelpumo.com)

> Referência de **estrutura e padrões de UX**, não de conteúdo. Textos, imagens,
> projectos e identidade visual são originais. A tipografia da referência (Saans,
> Displaay) é comercial — ver secção 8.

## 1. Objectivo

Single-page (one-pager) que funciona como CV + portfólio, com CTA claro de contacto
e PDF do CV descarregável. Público-alvo: recrutadores e potenciais clientes.

## 2. Estrutura da página (ordem)

| # | Secção | Conteúdo | Notas |
|---|--------|----------|-------|
| 1 | Hero | Tagline curta de posicionamento, badge de disponibilidade ("Disponível para projectos"), CTA primário | Ocupa ~100vh |
| 2 | Barra de acções | Links sociais (GitHub, LinkedIn), download do CV em PDF | Pode ser sticky |
| 3 | Sobre | Parágrafo de posicionamento + CTA "Diz olá" (mailto) | |
| 4 | Testemunhos | 2–4 citações com atribuição (nome, cargo, empresa) | Opcional na v1 |
| 5 | Competências | Lista de tecnologias agrupadas por área | Marquee horizontal opcional |
| 6 | Clientes / Experiência | Lista inline de nomes com link | |
| 7 | Abordagem | Parágrafo sobre método: performance, acessibilidade, standards | |
| 8 | Projectos | Grid de cards: imagem, nome, descrição curta, stack, link | Dados em ficheiro, não hardcoded no markup |
| 9 | FAQ | 4–6 perguntas em `<details>`/accordion | |
| 10 | Play (opcional) | Toggles de personalização — ver secção 4 | Diferenciador, deixar para v2 |
| 11 | Footer | CTA final com email, nome/empresa, ano, dados legais | |

## 3. Navegação

- Sem menu tradicional: scroll contínuo com âncoras.
- Scroll suave entre secções; respeitar `prefers-reduced-motion`.
- Indicador de secção activa (opcional).

## 4. Interacções

### Base (v1)
- Accordion do FAQ (nativo `<details>` — funciona sem JS).
- Animações de entrada ao scroll (`IntersectionObserver` ou GSAP ScrollTrigger).
- Hover states nos cards de projecto.
- Dark/light mode com persistência em `localStorage` + respeito por `prefers-color-scheme`.

### Extra (v2 — "Play")
- Selector de tipografia (2–3 opções).
- Selector de paleta de cores.
- Toggle de som ambiente (**default: off**, nunca autoplay).
- Easter egg (ex.: inverter texto).

Requisito transversal: **todas as preferências persistem entre visitas**.

## 5. Stack técnica

Referência corre **Nuxt** (ficheiros `/_nuxt/`), alojado em **Netlify**, pré-renderizado
(payload JSON estático). Opções:

- **A — Astro** (recomendado): zero JS por omissão, islands para as partes interactivas,
  colagem natural a conteúdo em Markdown/JSON. Melhor fit para um one-pager.
- **B — Nuxt/Next**: igual à referência; só compensa se já houver familiaridade.
- **C — HTML/CSS/JS puro**: já existe base em `CV/cv-html/`. Mais trabalho manual nos
  projectos, mas sem build step.

Comum a todas:
- CSS: Tailwind ou CSS moderno com custom properties (tokens de cor/espaçamento).
- Animação: GSAP ou Web Animations API.
- Conteúdo: `content/projects.json` + `content/faq.json` — editável sem tocar no markup.
- Deploy: Netlify/Vercel/GitHub Pages, build automático no push.

## 6. Imagens

- Formatos modernos (WebP/AVIF) com fallback.
- `loading="lazy"` abaixo da dobra, `width`/`height` sempre definidos (evitar CLS).
- Múltiplas resoluções via `srcset`.
- Thumbnails de projecto com rácio fixo.

## 7. Qualidade (critérios de aceitação)

- Lighthouse ≥ 95 em Performance, Acessibilidade, Best Practices, SEO.
- Responsivo de 320px a 2560px.
- Navegável só com teclado; focus visível.
- Contraste AA em ambos os temas.
- Conteúdo legível com JS desactivado.
- Meta tags OG + Twitter card, `sitemap.xml`, JSON-LD `Person`.
- Favicon e `theme-color`.

## 8. Conteúdo a preparar (dependências)

- [ ] Tagline / posicionamento
- [ ] Bio (~80 palavras)
- [ ] 6–12 projectos: título, descrição (1–2 linhas), stack, imagem, link
- [ ] Lista de competências agrupadas
- [ ] 2–4 testemunhos com autorização de uso
- [ ] 5 perguntas de FAQ + respostas
- [ ] CV em PDF actualizado (existe `CV/ruiGoncalves.pdf`)
- [ ] Tipografia: escolher alternativa livre (ex.: Inter, Geist, General Sans) ou
      licenciar uma comercial — não usar a da referência sem licença

## 9. Faseamento sugerido

1. **v1** — Secções 1–9 + 11, tema claro/escuro, deploy. Estática, sem animação pesada.
2. **v2** — Animações de scroll, testemunhos, secção Play.
3. **v3** — CMS (se a actualização manual se tornar incómoda), analytics, i18n PT/EN.

---

## 10. Ponto de partida — o que já existe

Repo actual: `CV/` (git, remote `jordan21pt/CV`), site em `CV/cv-html/`
(~720 linhas: `index.html`, `styles.css`, `meyer-css-reset.css`, `script.js`).

### Já feito ✅
- One-pager com âncoras: Hero, Sobre, Experiência, Projectos, Contacto, Footer.
- Dark/light toggle com `localStorage` (`script.js:11`).
- Reveal ao scroll via `IntersectionObserver` com stagger (`script.js:25`).
- Link de secção activa na nav (`script.js:46`).
- Download do CV em PDF no hero.
- Grid de projectos com cards + tags de stack.
- Meta description, `lang="pt"`, fontes Google (Syne + Space Grotesk).

### Em falta face à referência ❌
| Lacuna | Secção deste doc |
|---|---|
| Badge de disponibilidade no hero | 2 |
| Testemunhos | 2 |
| Secção de competências agrupadas (está só dentro do card do hero) | 2 |
| Clientes / lista de trabalhos | 2 |
| Secção "Abordagem" | 2 |
| FAQ em accordion | 2 |
| Secção "Play" (tipografia/paleta/som) | 4 |
| Imagens nos cards de projecto (hoje são só texto) | 2, 6 |
| Projectos em ficheiro de dados em vez de hardcoded no HTML | 5 |

### Problemas a corrigir no existente 🔧
- **Links sociais mortos**: LinkedIn, GitHub e Instagram apontam para `href="#"`
  (`index.html:117-119`).
- **Email provavelmente placeholder**: `hello@ruigoncalves.dev` (`index.html:120`).
- **Acentuação em falta** em todo o conteúdo ("Experiencia", "Licenciado em Ciencias
  da Computacao", "escalavel", "memoravel"...) — corrigir para PT correcto.
- **`prefers-color-scheme` ignorado**: o tema arranca sempre em `dark` quando não há
  nada em `localStorage` (`script.js:16`).
- **`prefers-reduced-motion` não respeitado** nas animações de reveal.
- **Sem `width`/`height`** em `photos/rui.jpg` → risco de CLS.
- **Imagens não optimizadas** (`.jpg`, sem WebP, sem `srcset`, sem `loading="lazy"`).
- **Sem OG/Twitter tags**, sem favicon, sem `theme-color`, sem JSON-LD.
- **Nav sem versão mobile** (confirmar comportamento abaixo de 640px).
- **Caminho do PDF frágil**: `../ruiGoncalves.pdf` sai da pasta publicada.

### Decisão de stack à luz disto
A base em HTML/CSS/JS puro é sólida e já cobre ~60% dos requisitos de interacção.
Duas vias:

- **Evoluir o existente** (menor esforço): acrescentar as secções em falta, extrair
  projectos para `projects.json` + `<template>`, corrigir a lista acima. Sem build step.
- **Migrar para Astro** (`cvNew/`): mantém o CSS e o JS praticamente intactos, mas dá
  componentes, conteúdo em Markdown/JSON e optimização de imagens automática
  (`<Image />`). Compensa se o número de projectos crescer.

Recomendação: **evoluir o existente até à v1 completa**, migrar só se a manutenção
do HTML começar a doer.

---

## 11. Arquitectura confirmada da referência

Fonte: `github.com/michaelpumo/michael-pumo` (público, **sem ficheiro de licença** →
todos os direitos reservados; serve como referência de arquitectura, não de código
a copiar).

### Stack real
| Camada | Escolha |
|---|---|
| Framework | Nuxt 4 + Vue 3 (`nuxt generate` → estático) |
| CSS | Tailwind 4 via `@tailwindcss/vite` + `postcss-nested` |
| CMS | Storyblok (`@storyblok/nuxt`), tipos TS gerados do schema |
| Estado | Pinia + `pinia-plugin-persistedstate` (persiste tema/tipografia/som) |
| Animação | GSAP + Lenis (smooth scroll) |
| Carrossel | keen-slider |
| Imagens | `@nuxt/image` |
| SEO | `@nuxtjs/seo` + Satori/resvg (OG images geradas) |
| Ícones | lucide-vue-next + SVG locais via `vite-svg-loader` |
| Utils | `@vueuse/core` |
| Qualidade | ESLint (`@antfu/eslint-config`), Husky, commitlint |
| Deploy | Netlify |

### Organização por blocos
Os componentes mapeiam 1:1 com as secções da página:
`block/Hero`, `block/Text`, `block/Bento`, `block/Projects`, `block/Faq`, `block/Play`,
mais cards (`card/Project`, `card/Testimonial`, `card/Standard`), primitivos de UI
(`Accordion`, `Carousel`, `Marquee`, `Canvas`, `Clock`) e efeitos
(`FadeReveal`, `TextReveal`, `TextFiller`).

**Padrão-chave:** rota catch-all `pages/[...slug].vue` + um resolver de componentes
(`app/Components.vue`) que recebe a lista de blocos do CMS e renderiza o componente
correspondente a cada um. A página não conhece as secções — a ordem vem dos dados.
É isto que torna o site editável sem tocar no código.

A secção "Play" tem um componente por toggle (`selected/Typeface`, `selected/Palette`,
`selected/Audio`, `selected/AussieMode`), com o estado na store persistida.

### O que daqui vale a pena adoptar
1. **Blocos orientados a dados** — mesmo sem CMS, um `blocks.json` com
   `[{ type: "projects", ... }]` e um resolver dá a mesma flexibilidade.
2. **Estado de preferências centralizado e persistido** — em vez do `localStorage`
   espalhado que existe hoje em `script.js`.
3. **Componentes de efeito reutilizáveis** em vez de uma classe `.reveal` global.
4. **OG images geradas** a partir do conteúdo.
5. **Icon set em SVG local** para a secção de competências.

### O que não vale a pena replicar (para este caso)
- Storyblok: só compensa se alguém não-técnico for editar o conteúdo.
- Pinia + Nuxt completo: pesado para um one-pager de um programador.
- Satori/resvg para OG: uma imagem estática chega.
- Husky/commitlint: opcional num repo pessoal.

### Recomendação final de stack
**Astro** com o padrão de blocos orientados a dados da referência:
conteúdo em `content/*.json`, um resolver de blocos, islands só nas partes
interactivas (tema, FAQ, Play). Fica com a flexibilidade arquitectural do Nuxt+CMS
sem o peso, e aproveita o CSS/JS que já existe em `CV/cv-html/`.
