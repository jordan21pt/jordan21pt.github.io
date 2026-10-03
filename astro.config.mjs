import { defineConfig } from 'astro/config'

// Publicado na raiz de https://jordan21pt.github.io
// Dominio proprio no futuro: trocar `site`; nao ha base para mexer.
export default defineConfig({
  site: 'https://jordan21pt.github.io',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
})
