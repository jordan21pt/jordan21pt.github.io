import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

function setupReveals() {
  gsap.registerPlugin(ScrollTrigger, SplitText)

  // Titulos entram palavra a palavra.
  document.querySelectorAll('[data-split]').forEach((node) => {
    const split = new SplitText(node, { type: 'words', wordsClass: 'word' })
    gsap.from(split.words, {
      yPercent: 110,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.04,
      scrollTrigger: { trigger: node, start: 'top 85%' },
    })
  })

  // Tudo o resto sobe e aparece, com stagger entre irmaos.
  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    gsap.to(group.querySelectorAll('[data-reveal]'), {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'top 82%' },
    })
  })
}

function setupSmoothScroll() {
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'))
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target, { offset: -70 })
    })
  })
}

if (!reduced) {
  setupReveals()
  setupSmoothScroll()
  setupTimeline()
}

function setupTimeline() {
  const list = document.querySelector('[data-timeline]')
  if (!list) return

  const progress = list.querySelector('[data-timeline-progress]')
  const items = [...list.querySelectorAll('.timeline__item')]

  // A linha cresce colada ao scroll, do primeiro ao ultimo ponto.
  gsap.to(progress, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: list,
      start: 'top 65%',
      end: 'bottom 75%',
      scrub: 0.4,
    },
  })

  // Cada ponto acende quando a linha o alcanca.
  items.forEach((item) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 65%',
      onEnter: () => item.classList.add('is-reached'),
      onLeaveBack: () => item.classList.remove('is-reached'),
    })
  })
}

function setupHorizontalTimeline() {
  const scroller = document.querySelector('[data-htl]')
  if (!scroller) return

  const progress = scroller.querySelector('[data-htl-progress]')
  const stops = [...scroller.querySelectorAll('.htl__stop')]

  // Indicador de posicao, nao animacao: corre mesmo com reduced-motion.
  const update = () => {
    const max = scroller.scrollWidth - scroller.clientWidth
    progress.style.transform = `scaleX(${max > 0 ? scroller.scrollLeft / max : 1})`

    const limite = scroller.scrollLeft + scroller.clientWidth * 0.6
    stops.forEach((stop) => {
      stop.classList.toggle('is-reached', stop.offsetLeft <= limite)
    })
  }

  scroller.addEventListener('scroll', update, { passive: true })
  addEventListener('resize', update)
  update()

  setupWheelTakeover(scroller)
}

// Roda do rato na vertical passa a andar para o lado enquanto houver faixa.
// Ao chegar a qualquer ponta devolve o evento a pagina, senao ficavas preso aqui.
function setupWheelTakeover(scroller) {
  const limite = () => scroller.scrollWidth - scroller.clientWidth

  let alvo = scroller.scrollLeft
  let aCorrer = false

  const passo = () => {
    const falta = alvo - scroller.scrollLeft
    if (Math.abs(falta) < 0.5) {
      scroller.scrollLeft = alvo
      aCorrer = false
      return
    }
    scroller.scrollLeft += falta * 0.18
    requestAnimationFrame(passo)
  }

  // Scroll vindo de outro sitio (arrasto, teclado) tem de repor o alvo.
  scroller.addEventListener('scroll', () => {
    if (!aCorrer) alvo = scroller.scrollLeft
  }, { passive: true })

  scroller.addEventListener('wheel', (event) => {
    if (event.ctrlKey) return                                      // zoom do browser
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return    // gesto lateral de trackpad: nativo
    if (limite() <= 0) return                                      // cabe tudo, nada a fazer

    const naPontaEsquerda = scroller.scrollLeft <= 0 && event.deltaY < 0
    const naPontaDireita = scroller.scrollLeft >= limite() - 1 && event.deltaY > 0
    if (naPontaEsquerda || naPontaDireita) return                  // deixa a pagina seguir

    event.preventDefault()
    event.lenisStopPropagation = true                              // escape hatch do Lenis

    alvo = Math.max(0, Math.min(limite(), alvo + event.deltaY))

    if (reduced) {
      scroller.scrollLeft = alvo
      return
    }
    if (!aCorrer) {
      aCorrer = true
      requestAnimationFrame(passo)
    }
  }, { passive: false })
}

setupHorizontalTimeline()
