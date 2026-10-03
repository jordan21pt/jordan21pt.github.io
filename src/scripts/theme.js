const KEY = 'rg-theme'
const root = document.documentElement
const button = document.getElementById('theme-toggle')
const prefereClaro = matchMedia('(prefers-color-scheme: light)')

// Sem escolha guardada, o tema e o do sistema. Ler uma cor computada nao
// serve: com light-dark() o valor so se resolve na pintura.
const temaActual = () => root.dataset.theme ?? (prefereClaro.matches ? 'light' : 'dark')

// O icone visivel e so CSS; aqui trata-se do nome que o leitor de ecra le.
function actualizarRotulo() {
  const escuro = temaActual() === 'dark'
  button.setAttribute('aria-label', escuro ? 'Mudar para tema claro' : 'Mudar para tema escuro')
  button.setAttribute('aria-pressed', String(!escuro))
}

button?.addEventListener('click', () => {
  root.dataset.theme = temaActual() === 'dark' ? 'light' : 'dark'
  try { localStorage.setItem(KEY, root.dataset.theme) } catch {}
  actualizarRotulo()
})

// Enquanto seguir o sistema, o rotulo acompanha quem muda de tema no SO.
prefereClaro.addEventListener('change', () => {
  if (!root.dataset.theme) actualizarRotulo()
})

actualizarRotulo()
