import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

// Performance optimization - Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Initialize Smooth Scroll with fallback
if (!prefersReducedMotion) {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 1.5,
  })

  function raf(time) {
    lenis.raf(time)
    ScrollTrigger.update()
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)
}

// Helper function for responsive animations
const getResponsiveValues = () => {
  const width = window.innerWidth
  return {
    moduleRadius: width < 768 ? 140 : 280, // Using the updated 280 radius for desktop
    strategyX: width < 768 ? '-60%' : '-80%',
  }
}

const initAnimations = () => {
  // Mark body as loaded
  document.body.classList.add('loaded')

  // --- SECTION 1: HERO ---
  const heroTl = gsap.timeline()
  heroTl.fromTo('.hero .logo-text',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', delay: 0.5 }
  )
    .fromTo('.hero .subtext',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8'
    )
    .fromTo('.hero .capabilities',
      { opacity: 0, y: 30 },
      { opacity: 0.6, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8'
    )
    .fromTo('.hero .cta-group',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8'
    )

  // Only add infinite animation if motion is allowed
  if (!prefersReducedMotion) {
    heroTl.to('.hero', {
      scale: 1.05,
      duration: 5,
      ease: 'linear',
      repeat: -1,
      yoyo: true
    }, 0)
  }

  // --- SECTION 2: THE PROBLEM (Word-by-word) ---
  const words = document.querySelectorAll('.problem .word')
  if (words.length) {
    const problemTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.problem',
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: prefersReducedMotion ? false : 1,
      }
    })

    words.forEach((word, i) => {
      problemTl.to(word, { opacity: 1, y: -20, duration: 1, ease: 'power2.inOut' })
        .to(word, { opacity: 0, y: -40, duration: 1, ease: 'power2.inOut' }, '+=0.5')
    })

    problemTl.to('.problem .summary', { opacity: 1, y: -120, duration: 1 }, '>-=0.5')
  }

  // --- SECTION 3: THE SHIFT ---
  const shiftTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.shift',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: prefersReducedMotion ? false : 1,
    }
  })

  shiftTl.to('.shift h2', { opacity: 1, y: -20, duration: 1 })
    .to('.shift-details p', { opacity: 1, y: -10, stagger: 0.3, duration: 1 })
    .to('.shift-description', { opacity: 0.8, y: 0, duration: 1 }, '>-=0.5')
    .to('.core-values', { opacity: 1, y: -10, duration: 1 })
    .to('.glow-overlay', { opacity: 0.8, scale: 1.2, duration: 1 }, 0)

  // --- SECTION 4: ZUNO CORE ---
  const coreTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.core',
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: prefersReducedMotion ? false : 1,
    }
  })

  const modules = document.querySelectorAll('.module')
  const lines = document.querySelectorAll('.core-line')
  const { moduleRadius } = getResponsiveValues()

  if (modules.length) {
    modules.forEach((module, i) => {
      const angle = (i / modules.length) * Math.PI * 2
      const x = Math.cos(angle) * moduleRadius
      const y = Math.sin(angle) * moduleRadius
      const deg = (angle * 180) / Math.PI

      gsap.set(module, { x: 0, y: 0, opacity: 0, xPercent: -50, yPercent: -50 })
      if (lines[i]) {
        gsap.set(lines[i], { rotation: deg, width: 0, opacity: 0, xPercent: 0, yPercent: -50 })
      }

      coreTl.to(module, {
        x: x,
        y: y,
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
      }, i * 0.1)

      if (lines[i]) {
        coreTl.to(lines[i], {
          width: moduleRadius - 60,
          opacity: 0.4,
          duration: 0.8,
          ease: 'power2.out'
        }, i * 0.1)
      }
    })
  }

  coreTl.to('.core-footer', { opacity: 1, y: -20, duration: 1 })

  // --- SECTION 5: PHASE STRATEGY (Horizontal) ---
  const { strategyX } = getResponsiveValues()
  gsap.to('.horizontal-scroll', {
    x: strategyX,
    ease: 'none',
    scrollTrigger: {
      trigger: '.strategy',
      pin: true,
      scrub: prefersReducedMotion ? false : 1,
      end: '+=300%',
    }
  })

  // --- SECTION 5.5: THE BRIDGE ---
  const bridgeTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.bridge',
      start: 'top 80%',
      end: 'top 20%',
      scrub: prefersReducedMotion ? false : 1,
    }
  })

  bridgeTl.to('.bridge-title', { opacity: 1, y: 0, duration: 1 })
    .to('.bridge-subtitle', { opacity: 1, y: 0, duration: 1 }, '-=0.5')
    .to('.bridge-stats', { opacity: 1, y: 0, duration: 1 }, '-=0.5')

  // --- SECTION 6: PRODUCT EXPERIENCE ---
  const productTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.product',
      start: 'top top',
      end: '+=600%',
      pin: '.sticky-wrapper',
      pinSpacing: true,
      scrub: prefersReducedMotion ? false : 1,
    }
  })

  const screens = document.querySelectorAll('.screen')
  const textSteps = document.querySelectorAll('.text-step')

  if (screens.length && textSteps.length) {
    textSteps.forEach((step, i) => {
      productTl.to(step, { opacity: 1, y: 0, duration: 1 })
      if (screens[i]) {
        productTl.to(screens[i], { opacity: 1, duration: 1 }, '<')
      }

      productTl.to({}, { duration: 1 })

      if (i < textSteps.length - 1 && screens[i]) {
        productTl.to(step, { opacity: 0, y: -20, duration: 1 })
        productTl.to(screens[i], { opacity: 0, duration: 1 }, '<')
      }
    })
  }

  // --- FINAL SECTION: CLOSING ---
  const closingTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.closing',
      start: 'top 80%',
    }
  })

  // --- CLOSING: Mouse Glow and Finalization ---
  window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e
    const x = (clientX / window.innerWidth - 0.5) * 20
    const y = (clientY / window.innerHeight - 0.5) * 20

    gsap.to('.glow-overlay', {
      left: `${clientX}px`,
      top: `${clientY}px`,
      duration: 2,
      ease: 'power2.out'
    })
  })
}

window.onload = () => {
  initAnimations()
}
