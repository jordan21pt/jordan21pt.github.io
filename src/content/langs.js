// Um ficheiro JSON por lingua. Acrescentar en.json ou es.json a esta pasta
// chega para criar a rota /en/, /es/ e fazer aparecer o seletor de lingua.
const ficheiros = import.meta.glob('./*.json', { eager: true })

// So contam ficheiros com nome de codigo de lingua (pt, en, es, pt-br).
// Qualquer outro JSON que apareca nesta pasta e ignorado em vez de
// virar um idioma fantasma com rota propria.
const CODIGO = /^[a-z]{2}(-[a-z]{2})?$/i

export const LINGUA_OMISSAO = 'pt'

export const NOMES = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
}

export const linguas = Object.fromEntries(
  Object.entries(ficheiros)
    .map(([caminho, mod]) => [caminho.match(/\.\/(.+)\.json$/)[1], mod.default])
    .filter(([codigo]) => CODIGO.test(codigo)),
)

export const codigos = Object.keys(linguas).sort(
  (a, b) => (a === LINGUA_OMISSAO ? -1 : b === LINGUA_OMISSAO ? 1 : a.localeCompare(b)),
)

export const getSite = (lang) => linguas[lang] ?? linguas[LINGUA_OMISSAO]

// A lingua por omissao fica na raiz; as outras levam prefixo.
export const caminhoDe = (lang, base) =>
  lang === LINGUA_OMISSAO ? base : `${base}${lang}/`.replace(/\/{2,}/g, '/')
